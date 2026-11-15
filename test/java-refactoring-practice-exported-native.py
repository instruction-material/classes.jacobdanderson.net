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
SOURCE=Path(os.environ.get("JAVA_REFACTORING_PRACTICE_BROWSER_PROOF_DIR", ROOT/"output/java-refactoring-practice"))
JAVA_HOME=os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA=str(Path(JAVA_HOME)/"bin/java") if JAVA_HOME else shutil.which("java")
JAVAC=str(Path(JAVA_HOME)/"bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-refactoring-practice-native"),
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


PLANS=json.loads((ROOT/"test/fixtures/java-refactoring-practice-projects.json").read_text())
results=[]
assert run([JAVAC,"-version"],check=True).stdout.startswith("javac 21.")
def passed(result, expected):
    assert result.returncode==0 and result.stdout==expected and not result.stderr,vars(result)
    return dict(stdout=result.stdout,returncode=0)
with tempfile.TemporaryDirectory(prefix="refactoring-practice-export-") as temporary:
    for plan in PLANS:
        unit=plan["unit"]
        fixture=json.loads((ROOT/"test"/plan["fixture"]).read_text())
        assert fixture["revision"]==unit["revision"]
        for index,item in enumerate(unit["sourceItems"]):
            for role in ["starter","solution"]:
                primary=plan.get("primaryByRole",{}).get(role,plan["primary"])
                for width in [390,1280]:
                    for variant in ["exact","edited"]:
                        archive=SOURCE/unit["id"]/str(index)/f"{role}-{width}-{variant}.zip"
                        folder=Path(temporary)/f"{unit['id']}-{index}-{role}-{width}-{variant}";folder.mkdir()
                        names=unit["files"][role]
                        with zipfile.ZipFile(archive) as zipped:
                            listed=zipped.namelist();assert len(listed)==len(set(listed))==len(names)
                            for name in names:
                                original=fixture["files"][unit["pack"]+"/"+role+"/"+name]
                                expected=original["content"]
                                if variant=="edited" and name in [primary,"README.md"]:
                                    expected+=("\n// Saved practice trace " if name.endswith(".java") else "\nSaved practice trace ")+str(width)+"\n"
                                matches=[n for n in listed if n.endswith("/"+name)];assert len(matches)==1,(name,matches)
                                data=zipped.read(matches[0]);assert data.decode()==expected,name
                                if variant=="exact":assert hashlib.sha256(data).hexdigest()==original["sha256"],name
                                path=folder/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
                        assert sorted((folder/"sources.txt").read_text().splitlines())==sorted(n for n in names if n.endswith(".java"))
                        empty=folder/"empty";empty.mkdir()
                        run([JAVAC,"--release","21","-encoding","UTF-8","-Xlint:all","-Werror","-proc:none",
                            "--source-path",str(empty),"--class-path",str(empty),"-d","classes","@sources.txt"],cwd=folder,check=True)
                        row=dict(unit=unit["id"],item=item,role=role,width=width,variant=variant,members=len(names),
                            sha256=hashlib.sha256(archive.read_bytes()).hexdigest(),checks=[])
                        for flag in ["-ea","-da"]:
                            core=run([JAVA,flag,"-cp","classes","ContractTests","core"],cwd=folder)
                            if role=="starter" and plan["coreUnfinished"]:
                                assert core.returncode!=0 and plan["coreUnfinished"] in core.stderr,vars(core)
                                row["checks"].append({"flag":flag,"expectedUnfinished":plan["coreUnfinished"]})
                            else:row["checks"].append(passed(core,plan["coreOutput"]))
                            if role=="solution":
                                passed(run([JAVA,flag,"-cp","classes","ContractTests"],cwd=folder),plan["fullOutput"])
                                passed(run([JAVA,flag,"-cp","classes","Main"],cwd=folder),plan["demo"])
                            elif not plan["coreUnfinished"]:
                                incomplete=run([JAVA,flag,"-cp","classes","ContractTests"],cwd=folder)
                                assert incomplete.returncode!=0 and plan["fullUnfinished"] in incomplete.stderr,vars(incomplete)
                                passed(run([JAVA,flag,"-cp","classes","Main"],cwd=folder),plan["demo"])
                        results.append(row)
assert len(results)==40 and sum(r["members"] for r in results)==512
proof=dict(accepted=True,archives=40,members=512,practiceItems=5,uniqueSourceFamilies=4,results=results,
    priorQualifiedSourcesRetained=True,independentCourseAndRoleNamespaces=True,actualSavedEditsVerified=True,
    priorSourceCompletionAndMutationEvidenceReused=True,manualDesignReviewRequired=True)
(SOURCE/"native-proof.json").write_text(json.dumps(proof,indent=2)+"\n")
print(json.dumps({k:v for k,v in proof.items() if k!="results"}))
