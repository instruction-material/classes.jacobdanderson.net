"""Compile and run the exact Java files exported by the eight-family browser workflow."""
import hashlib
import json
import os
import signal
from pathlib import Path
import shutil
import subprocess
import tempfile
import zipfile
import datetime
ROOT=Path(__file__).resolve().parents[1]
FIXTURE=json.loads((ROOT/"test/fixtures/java-refactoring-final-sources.json").read_text())
SOURCE=Path(os.environ.get("JAVA_REFACTORING_FINAL_BROWSER_PROOF_DIR", ROOT/"output/java-refactoring-final"))
JAVA_HOME=os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA=str(Path(JAVA_HOME)/"bin/java") if JAVA_HOME else shutil.which("java")
JAVAC=str(Path(JAVA_HOME)/"bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-refactoring-final-native"),
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


PLANS=json.loads((ROOT/"test/fixtures/java-refactoring-final-projects.json").read_text())["plans"]
assert len(PLANS)==8 and sum(sum(p["roleFileCounts"].values()) for p in PLANS)==262
assert run([JAVAC,"-version"],check=True).stdout.startswith("javac 21.")
results=[]
def execute(folder, name, mode, enabled=True, input=None):
    return run([JAVA,"-Xmx128m","-ea" if enabled else "-da","-cp","out",name,mode],cwd=folder,input=input)
def passed(result, expected=None):
    assert result.returncode==0 and not result.stderr,vars(result)
    if expected is not None: assert result.stdout==expected,vars(result)
    return dict(returncode=result.returncode,stdout=result.stdout,stderr=result.stderr)
def unfinished(result, marker):
    assert marker and result.returncode!=0 and marker in result.stderr,vars(result)
    return dict(expectedUnfinished=True,returncode=result.returncode,stderr=result.stderr)
with tempfile.TemporaryDirectory(prefix="refactoring-final-export-") as temporary:
    for plan in PLANS:
        unit=plan["unit"]; pack=unit["pack"]
        for group, selected in plan["groups"].items():
            for role in ["starter","solution"]:
                prefix=pack+"/"+role+"/"
                initial={key[len(prefix):]:value for key,value in FIXTURE["files"].items() if key.startswith(prefix)}
                assert len(initial)==plan["roleFileCounts"][role]
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
                                expected[name]+=("\n// Saved refactoring trace " if name.endswith(".java") else "\nSaved refactoring trace ")+group+" "+str(width)+"\n"
                        archive=SOURCE/unit["id"]/group/f"{role}-{width}-{variant}.zip"
                        folder=Path(temporary)/f"{unit['id']}-{group}-{role}-{width}-{variant}"
                        folder.mkdir()
                        with zipfile.ZipFile(archive) as zipped:
                            listed=zipped.namelist()
                            assert len(listed)==len(set(listed))==len(expected)
                            for name,content in expected.items():
                                matches=[n for n in listed if n.endswith("/"+name)]
                                assert len(matches)==1,(name,matches)
                                data=zipped.read(matches[0])
                                assert data.decode()==content,(unit["id"],name)
                                if variant=="exact": assert hashlib.sha256(data).hexdigest()==initial[name]["sha256"]
                                file=folder/name;file.parent.mkdir(parents=True,exist_ok=True);file.write_bytes(data)
                        java_names=sorted(p.relative_to(folder).as_posix() for p in folder.rglob("*.java"))
                        assert (folder/"sources.txt").read_text().splitlines()==java_names
                        empty=folder/"empty";empty.mkdir()
                        run([JAVAC,"--release","21","-encoding","UTF-8","-Xlint:all","-Werror","-proc:none",
                             "--source-path",str(empty),"--class-path",str(empty),"-d","out","@sources.txt"],cwd=folder,check=True)
                        row=dict(unit=unit["id"],group=group,role=role,width=width,variant=variant,members=len(expected),
                                 archiveSHA256=hashlib.sha256(archive.read_bytes()).hexdigest(),completed={})
                        row["baseline"]=[passed(execute(folder,"ContractChecks","baseline",enabled),"baseline: "+str(plan["baselineChecks"])+" checks passed\n") for enabled in [True,False]]
                        for mode in ["core","transfer","extension"]:
                            complete=role=="solution" or (variant=="edited" and group==mode) or (mode=="core" and not plan["unfinished"]["core"])
                            if complete:
                                row["completed"][mode]=[passed(execute(folder,"ContractChecks",mode,enabled),mode+": "+str(plan["groups"][mode]["checks"])+" checks passed\n") for enabled in [True,False]]
                            else:
                                row["completed"][mode]=[unfinished(execute(folder,"ContractChecks",mode,enabled),plan["unfinished"][mode]) for enabled in [True,False]]
                        if role=="solution":
                            row["full"]=[passed(execute(folder,"ContractChecks","all",enabled),"all: "+str(plan["fullChecks"])+" checks passed\n") for enabled in [True,False]]
                        row["main"]={}
                        for mode,demo in plan["demos"].items():
                            if mode in ["baseline","core"] or role=="solution" or (variant=="edited" and group==mode):
                                row["main"][mode]=passed(execute(folder,"Main",mode),demo)
                        if plan["label"]=="DPR10":
                            for enabled in [True,False]:
                                before=execute(folder,"Main","baseline",enabled);after=execute(folder,"Main","core",enabled)
                                passed(before);passed(after,before.stdout)
                                assert "cy" in after.stdout and "bo" in after.stdout
                                script=(folder/"sample-input.txt").read_text()
                                before=execute(folder,"Main","script-baseline",enabled,input=script);after=execute(folder,"Main","script-core",enabled,input=script)
                                passed(before,plan["scriptOutput"]);passed(after,before.stdout)
                            row["scriptAndDemoEquivalent"]=True
                        results.append(row)
expected_members=sum(4*(plan["roleFileCounts"]["starter"]+plan["roleFileCounts"]["solution"])+2*(len(group["add"])-len(group["remove"])) for plan in PLANS for group in plan["groups"].values())
assert len(results)==192 and sum(r["members"] for r in results)==expected_members
proof=dict(accepted=True,sourceRevision=FIXTURE["revision"],families=8,archives=len(results),members=expected_members,results=results,
    requiredAndBothOptionalProjectsCompletedIndependently=True,actualSourceEditingAndManifestVerified=True,manualDesignPortfolioRemainsRequired=True)
(SOURCE/"native-proof.json").write_text(json.dumps(proof,indent=2)+"\n")
print(json.dumps({k:v for k,v in proof.items() if k!="results"}))
