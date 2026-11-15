"""Verify actual browser ZIP package trees and method-call contracts."""
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
FIXTURE=json.loads((ROOT/"test/fixtures/java-method-calls-sources.json").read_text())
SOURCE=Path(os.environ.get("JAVA_METHOD_CALLS_BROWSER_PROOF_DIR",ROOT/"output/java-method-calls"))
JAVA_HOME=os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA=str(Path(JAVA_HOME)/"bin/java") if JAVA_HOME else shutil.which("java")
JAVAC=str(Path(JAVA_HOME)/"bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-method-calls-native"),
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






version=run([JAVAC,"-version"],check=True)
assert version.stdout.startswith("javac 21."),version
results=[]
pack="DPR6-Method-Calls-Packs"
core_files=["src/dispatch/DispatchService.java","src/dispatch/CompatibilityDesk.java"]
optional_files=["src/dispatch/optional/QueueClient.java"]
demo="140\n505\n645\n-1\nQuote[label=B, cents=505]\nnull\n"
def execute(folder,name,mode,enabled=True):
    return run([JAVA,"-Xmx128m","-ea" if enabled else "-da","-cp","out",name,mode],cwd=folder)
def passed(result,expected):
    assert result.returncode==0 and result.stdout==expected,{"returncode":result.returncode,"stdout":result.stdout,"stderr":result.stderr}
    return dict(returncode=result.returncode,stdout=result.stdout,stderr=result.stderr)
def failed(result,token):
    assert result.returncode!=0 and token in result.stderr,result
    return dict(returncode=result.returncode,stdout=result.stdout,stderr=result.stderr)
with tempfile.TemporaryDirectory(prefix="method-calls-export-") as temporary:
    for group in ["core","optional"]:
        editable=core_files if group=="core" else optional_files
        for role in ["starter","solution"]:
            prefix=pack+"/"+role+"/"
            names=[key[len(prefix):] for key in FIXTURE["files"] if key.startswith(prefix)]
            assert len(names)==18
            for width in [390,1280]:
                for variant in ["exact","edited"]:
                    archive=SOURCE/group/f"{role}-{width}-{variant}.zip"
                    assert archive.is_file(),archive
                    folder=Path(temporary)/f"{group}-{role}-{width}-{variant}"
                    folder.mkdir()
                    with zipfile.ZipFile(archive) as zipped:
                        listed=zipped.namelist()
                        assert len(listed)==len(set(listed))==18
                        for name in names:
                            matches=[n for n in listed if n.endswith("/"+name)]
                            assert len(matches)==1,(name,matches)
                            data=zipped.read(matches[0])
                            expected=FIXTURE["files"][prefix+name]["content"]
                            if variant=="edited" and name in editable+["README.md","REFACTORING.md"]:
                                if role=="starter" and name in editable:
                                    expected=FIXTURE["files"][pack+"/solution/"+name]["content"]
                                expected+=("\n// Saved dispatch trace " if name.endswith(".java") else "\nSaved dispatch trace ")+group+" "+str(width)+"\n"
                            assert data.decode()==expected,name
                            if variant=="exact":
                                assert hashlib.sha256(data).hexdigest()==FIXTURE["files"][prefix+name]["sha256"]
                            file=folder/name
                            file.parent.mkdir(parents=True,exist_ok=True)
                            file.write_bytes(data)
                    empty=folder/"empty";empty.mkdir()
                    run([JAVAC,"--release","21","-encoding","UTF-8","-Xlint:all","-Werror","-proc:none",
                         "--source-path",str(empty),"--class-path",str(empty),"-d","out","@sources.txt"],cwd=folder,check=True)
                    row=dict(group=group,role=role,width=width,variant=variant,archiveSHA256=hashlib.sha256(archive.read_bytes()).hexdigest(),members=18)
                    row["baseline"]=passed(execute(folder,"ContractChecks","baseline"),"mode=baseline rows=576 checks=2319\n")
                    row["baselineOptional"]=passed(execute(folder,"dispatch.optional.OptionalChecks","baseline"),"mode=baseline queues=21 checks=507\n")
                    passed(execute(folder,"Main","baseline"),demo)
                    core_complete=role=="solution" or (variant=="edited" and group=="core")
                    optional_complete=role=="solution" or (variant=="edited" and group=="optional")
                    if core_complete:
                        row["core"]=[passed(execute(folder,"ContractChecks","core",enabled),"mode=core rows=576 checks=9266\n") for enabled in [True,False]]
                        passed(execute(folder,"Main","core"),demo)
                    else:
                        row["core"]=failed(execute(folder,"ContractChecks","core"),"TODO quote")
                    row["optional"]=[passed(execute(folder,"dispatch.optional.OptionalChecks","full",enabled),"mode=full queues=21 checks=507\n") for enabled in [True,False]] if optional_complete else failed(execute(folder,"dispatch.optional.OptionalChecks","full"),"TODO printNext")
                    results.append(row)
assert len(results)==16 and sum(r["members"] for r in results)==288
proof=dict(accepted=True,sourceRevision=FIXTURE["revision"],archives=16,members=288,results=results,
           requiredAndOptionalCompletedIndependently=True)
(SOURCE/"native-proof.json").write_text(json.dumps(proof,indent=2)+"\n")
print(json.dumps(dict(accepted=True,archives=16,members=288,requiredRowsPerRun=576,
    independentCoreAndOptionalAttempts=True,sourceRevision=FIXTURE["revision"])))
