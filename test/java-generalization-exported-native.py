"""Verify actual browser ZIP package trees and generalization contracts."""
import hashlib
import json
import os
import datetime
import signal
from pathlib import Path
import shutil
import subprocess
import tempfile
import zipfile
ROOT=Path(__file__).resolve().parents[1]
FIXTURE=json.loads((ROOT/"test/fixtures/java-generalization-sources.json").read_text())
SOURCE=Path(os.environ.get("JAVA_GENERALIZATION_BROWSER_PROOF_DIR",ROOT/"output/java-generalization"))
JAVA_HOME=os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA=str(Path(JAVA_HOME)/"bin/java") if JAVA_HOME else shutil.which("java")
JAVAC=str(Path(JAVA_HOME)/"bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-generalization-native"),
            "parentPid": os.getpid(), "cwd": str(cwd or Path.cwd()), "command": args,
            "pid": child.pid, "startTime": started, "timeoutSeconds": timeout}
    print(json.dumps({**base, "event": "start"}), flush=True)
    cleaned = False
    timed_out = False
    try:
        stdout, stderr = child.communicate(input, timeout=timeout)
    except BaseException as error:
        timed_out = isinstance(error, subprocess.TimeoutExpired)
        os.killpg(child.pid, signal.SIGKILL)
        stdout, stderr = child.communicate()
        cleaned = True
        raise
    finally:
        if child.returncode not in [None, 0] and not cleaned:
            try:
                os.killpg(child.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
            cleaned = True
        print(json.dumps({**base, "event": "end", "endTime": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                          "exitCode": child.returncode, "timedOut": timed_out,
                          "childProcessGroupCleanup": cleaned}), flush=True)
    result = subprocess.CompletedProcess(args, child.returncode, stdout, stderr)
    if check and result.returncode:
        raise RuntimeError({"command": args, "exitCode": result.returncode,
                            "stdout": stdout, "stderr": stderr})
    return result







PLAN=json.loads((ROOT/"test/fixtures/java-generalization-projects.json").read_text())
version=run([JAVAC,"-version"],check=True)
assert version.stdout.startswith("javac 21."),version
pack=PLAN["pack"]
results=[]
def execute(folder, name, mode, enabled=True):
    return run([JAVA,"-Xmx128m","-ea" if enabled else "-da","-cp","out",name,mode],cwd=folder)
def passed(result, expected):
    assert result.returncode==0 and result.stdout==expected,vars(result)
    return dict(returncode=result.returncode,stdout=result.stdout,stderr=result.stderr)
def unfinished(result, marker):
    assert result.returncode!=0 and marker in result.stderr,vars(result)
    return dict(expectedUnfinished=True,returncode=result.returncode,stderr=result.stderr)
with tempfile.TemporaryDirectory(prefix="generalization-export-") as temporary:
    for group, selected in PLAN["groups"].items():
        for role in ["starter","solution"]:
            prefix=pack+"/"+role+"/"
            initial={key[len(prefix):]:value for key,value in FIXTURE["files"].items() if key.startswith(prefix)}
            assert len(initial)==(28 if role=="starter" else 30)
            for width in [390,1280]:
                for variant in ["exact","edited"]:
                    expected={name:entry["content"] for name,entry in initial.items()}
                    if variant=="edited":
                        if role=="starter":
                            for name in selected["remove"]: del expected[name]
                            for name in selected["replace"]+selected["add"]:
                                expected[name]=FIXTURE["files"][pack+"/solution/"+name]["content"]
                        expected["sources.txt"]="\n".join(sorted(n for n in expected if n.endswith(".java")))+"\n"
                        for name in selected["replace"]+["README.md","REFACTORING.md"]:
                            expected[name]+=("\n// Saved generalization trace " if name.endswith(".java") else "\nSaved generalization trace ")+group+" "+str(width)+"\n"
                    archive=SOURCE/group/f"{role}-{width}-{variant}.zip"
                    folder=Path(temporary)/f"{group}-{role}-{width}-{variant}"
                    folder.mkdir()
                    with zipfile.ZipFile(archive) as zipped:
                        listed=zipped.namelist()
                        assert len(listed)==len(set(listed))==len(expected)
                        for name,content in expected.items():
                            matches=[n for n in listed if n.endswith("/"+name)]
                            assert len(matches)==1,(name,matches)
                            data=zipped.read(matches[0])
                            assert data.decode()==content,name
                            if variant=="exact":
                                assert hashlib.sha256(data).hexdigest()==initial[name]["sha256"]
                            file=folder/name;file.parent.mkdir(parents=True,exist_ok=True);file.write_bytes(data)
                    java_names=sorted(p.relative_to(folder).as_posix() for p in folder.rglob("*.java"))
                    assert (folder/"sources.txt").read_text().splitlines()==java_names
                    empty=folder/"empty";empty.mkdir()
                    run([JAVAC,"--release","21","-encoding","UTF-8","-Xlint:all","-Werror","-proc:none",
                         "--source-path",str(empty),"--class-path",str(empty),"-d","out","@sources.txt"],cwd=folder,check=True)
                    row=dict(group=group,role=role,width=width,variant=variant,members=len(expected),archiveSHA256=hashlib.sha256(archive.read_bytes()).hexdigest(),completed={})
                    row["baseline"]=[passed(execute(folder,"ContractChecks","baseline",enabled),"mode=baseline checks=6163\n") for enabled in [True,False]]
                    for mode,demo in PLAN["demos"].items():
                        main_mode={"core":"baseline","transfer":"transfer-baseline","extension":"extension-baseline"}[mode]
                        passed(execute(folder,"Main",main_mode),demo)
                        complete=role=="solution" or (variant=="edited" and group==mode)
                        if complete:
                            row["completed"][mode]=[passed(execute(folder,"ContractChecks",mode,enabled),"mode="+mode+" checks="+str(PLAN["groups"][mode]["checks"])+"\n") for enabled in [True,False]]
                            passed(execute(folder,"Main",mode),demo)
                        else:
                            row["completed"][mode]=unfinished(execute(folder,"ContractChecks",mode),PLAN["unfinished"][mode])
                    results.append(row)
assert len(results)==24 and sum(r["members"] for r in results)==700
proof=dict(accepted=True,sourceRevision=FIXTURE["revision"],archives=24,members=700,results=results,
           requiredAndBothOptionalProjectsCompletedIndependently=True,actualUIFileCreationAndDeletionVerified=True)
(SOURCE/"native-proof.json").write_text(json.dumps(proof,indent=2)+"\n")
print(json.dumps({k:v for k,v in proof.items() if k!="results"}))
