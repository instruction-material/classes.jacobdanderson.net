"""Verify all actual browser studio ZIPs with native Java 21 contracts."""
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
FIXTURE=json.loads((ROOT/"test/fixtures/java-studios-sources.json").read_text())
SOURCE=Path(os.environ.get("JAVA_STUDIOS_BROWSER_PROOF_DIR",ROOT/"output/java-studios"))
JAVA_HOME=os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA=str(Path(JAVA_HOME)/"bin/java") if JAVA_HOME else shutil.which("java")
JAVAC=str(Path(JAVA_HOME)/"bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-studios-native"),
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

families=json.loads((ROOT/"test/fixtures/java-studios-workflows.json").read_text())
version=run([JAVAC,"-version"],check=True)
assert version.stdout.startswith("javac 21."),version
results=[]
probe_name="src/studio/Probe.java"
probe_content='package studio;\npublic final class Probe {\n    public static void main(String[] args) { System.out.println("Saved studio probe"); }\n}\n'
with tempfile.TemporaryDirectory(prefix="java-studio-exports-") as temporary:
    for studio in families:
        for role in ["starter","solution"]:
            prefix=studio["pack"]+"/"+role+"/"
            filenames=sorted(path[len(prefix):] for path in FIXTURE["files"] if path.startswith(prefix))
            target="src/notebook/NotebookDesk.java" if studio["key"]=="architecture" and role=="starter" else studio["target"]
            for width in [390,1280]:
                for variant in ["exact","edited"]:
                    archive=SOURCE/studio["key"]/f"{role}-{width}-{variant}.zip"
                    assert archive.is_file(),archive
                    output=Path(temporary)/f'{studio["key"]}-{role}-{width}-{variant}'
                    output.mkdir()
                    actual=filenames+([probe_name] if variant=="edited" else [])
                    with zipfile.ZipFile(archive) as zipped:
                        names=zipped.namelist()
                        assert len(names)==len(set(names))==len(actual)
                        for filename in actual:
                            matches=[name for name in names if name.endswith("/"+filename)]
                            assert len(matches)==1,(filename,names)
                            data=zipped.read(matches[0])
                            if filename==probe_name:
                                assert data.decode()==probe_content
                            else:
                                original=FIXTURE["files"][prefix+filename]
                                suffix=("\n"+probe_name+"\n" if filename=="sources.txt"
                                        else f"\n// Saved studio trace {width}\n" if filename==target
                                        else f"\nSaved studio trace {width}\n" if filename in ["README.md","DECISIONS.md"]
                                        else "") if variant=="edited" else ""
                                assert data.decode()==original["content"]+suffix,filename
                                if variant=="exact":
                                    assert hashlib.sha256(data).hexdigest()==original["sha256"]
                            path=output/filename
                            path.parent.mkdir(parents=True,exist_ok=True)
                            path.write_bytes(data)
                    run([JAVAC,"--release","21","-Xlint:all","-Werror","-d","classes","@sources.txt"],cwd=output,check=True)
                    core=run([JAVA,"-cp","classes","ContractTests","core"],cwd=output,check=True)
                    assert core.stdout==f'Core {studio["key"]} studio contracts: {studio["core"]} passed\n',core
                    for mode in [[],["base"]]:
                        demo=run([JAVA,"-cp","classes","Main",*mode],cwd=output,check=True)
                        assert demo.stdout==studio["demo"],demo
                    complete=run([JAVA,"-cp","classes","ContractTests"],cwd=output,check=role=="solution")
                    if role=="starter":
                        assert complete.returncode!=0 and "UnsupportedOperationException: "+studio["missing"] in complete.stderr,complete
                    else:
                        assert complete.stdout==f'Complete {studio["key"]} studio contracts: {studio["full"]} passed\n',complete
                        if studio["key"]=="architecture":
                            seam=run([JAVA,"-cp","classes","ArchitectureProbe"],cwd=output,check=True)
                            assert seam.stdout=="Isolated application seam and failure contracts passed\n",seam
                    if variant=="edited":
                        probe=run([JAVA,"-cp","classes","studio.Probe"],cwd=output,check=True)
                        assert probe.stdout=="Saved studio probe\n",probe
                    results.append({"studio":studio["key"],"role":role,"width":width,"variant":variant,
                                    "archive":str(archive),"sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),
                                    "files":len(actual),"coreAccepted":True,"referenceCompleteAccepted":role=="solution",
                                    "starterOptionalExplicitlyIncomplete":role=="starter",
                                    "newNestedSourceCompiledAndExecuted":variant=="edited"})
assert len(results)==24
proof={"accepted":True,"jdk":version.stdout.strip(),"actualBrowserArchives":results,
       "temporaryBuildsCleaned":True,"learnerStructuralReasoningInferred":False}
(SOURCE/"native-export-proof.json").write_text(json.dumps(proof,indent=2)+"\n")
print(json.dumps(proof),flush=True)
