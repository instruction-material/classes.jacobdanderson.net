"""Verify actual browser ZIP package trees and Java capstone contracts."""
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
FIXTURE=json.loads((ROOT/"test/fixtures/java-capstone-sources.json").read_text())
SOURCE=Path(os.environ.get("JAVA_CAPSTONE_BROWSER_PROOF_DIR",ROOT/"output/java-capstone"))
JAVA_HOME=os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA=str(Path(JAVA_HOME)/"bin/java") if JAVA_HOME else shutil.which("java")
JAVAC=str(Path(JAVA_HOME)/"bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-capstone-native"),
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
probe_name="src/dispatch/experiment/Probe.java"
probe_content='package dispatch.experiment;\npublic final class Probe {\n    public static void main(String[] args) { System.out.println("Saved refactor probe"); }\n}\n'
demo="EMAIL: Hi\nsent:a\n200\nsent:b\n[a, b]\n"
with tempfile.TemporaryDirectory(prefix="java-capstone-exports-") as temporary:
    for role in ["starter","solution"]:
        prefix="DPJ10-Dispatch-Refactor-Packs/"+role+"/"
        filenames=sorted(path[len(prefix):] for path in FIXTURE["files"] if path.startswith(prefix))
        original_count=13 if role=="starter" else 18
        assert len(filenames)==original_count
        for width in [390,1280]:
            for variant in ["exact","edited"]:
                archive=SOURCE/"desk"/f"{role}-{width}-{variant}.zip"
                assert archive.is_file(),archive
                output=Path(temporary)/f"{role}-{width}-{variant}";output.mkdir()
                actual_filenames=filenames+([probe_name] if variant=="edited" else [])
                with zipfile.ZipFile(archive) as zipped:
                    names=zipped.namelist();assert len(names)==len(set(names))==len(actual_filenames)
                    for filename in actual_filenames:
                        matches=[name for name in names if name.endswith("/"+filename)]
                        assert len(matches)==1,(filename,names)
                        data=zipped.read(matches[0])
                        if filename==probe_name:
                            assert variant=="edited" and data.decode()==probe_content
                        else:
                            original=FIXTURE["files"][prefix+filename]
                            if variant=="exact":assert hashlib.sha256(data).hexdigest()==original["sha256"]
                            else:
                                suffix=f"\n// Saved capstone trace {width}\n" if filename=="src/dispatch/app/Desk.java" else f"\nSaved capstone trace {width}\n" if filename in ["README.md","CHECKPOINTS.md","DECISIONS.md"] else "\n"+probe_name+"\n" if filename=="sources.txt" else ""
                                assert data.decode()==original["content"]+suffix,filename
                        path=output/filename;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
                run([JAVAC,"--release","21","-Xlint:all","-Werror","-d","classes","@sources.txt"],cwd=output,check=True)
                baseline=run([JAVA,"-cp","classes","ContractTests","base"],cwd=output,check=True)
                assert baseline.stdout=="Baseline capstone contracts: 2433 passed\n",baseline
                core=run([JAVA,"-cp","classes","ContractTests","core"],cwd=output,check=True)
                assert core.stdout=="Core capstone contracts: 4854 passed\n",core
                for mode in [[],["base"]]:
                    result=run([JAVA,"-cp","classes","Main",*mode],cwd=output,check=True)
                    assert result.stdout==demo,result
                if variant=="edited":
                    probe=run([JAVA,"-cp","classes","dispatch.experiment.Probe"],cwd=output,check=True)
                    assert probe.stdout=="Saved refactor probe\n",probe
                if role=="starter":
                    full=run([JAVA,"-cp","classes","ContractTests"],cwd=output)
                    assert full.returncode!=0 and "UnsupportedOperationException: Implement optional prefix-commit batch." in full.stderr,full
                    outcome="runnable-core-starter-optional-independent"
                else:
                    full=run([JAVA,"-cp","classes","ContractTests"],cwd=output,check=True)
                    assert full.stdout=="Complete capstone contracts: 4869 passed\n",full
                    architecture=run([JAVA,"-cp","classes","ArchitectureTests"],cwd=output,check=True)
                    assert architecture.stdout=="Architecture capstone contracts: 30 passed\n",architecture
                    outcome=full.stdout.strip()
                    # The actual reference export also supports completing core before optional batching.
                    path=output/"src/dispatch/app/Desk.java";text=path.read_text()
                    start=text.index("\n",text.index("public List<Dispatch> sendBatch"))+1
                    end=text.index("    }\n",start)
                    path.write_text(text[:start]+'        throw new UnsupportedOperationException("Implement optional prefix-commit batch.");\n'+text[end:])
                    run([JAVAC,"--release","21","-Xlint:all","-Werror","-d","classes","@sources.txt"],cwd=output,check=True)
                    core_only=run([JAVA,"-cp","classes","ContractTests","core"],cwd=output,check=True)
                    assert core_only.stdout=="Core capstone contracts: 4854 passed\n"
                    optional=run([JAVA,"-cp","classes","ContractTests"],cwd=output)
                    assert optional.returncode!=0 and "UnsupportedOperationException: Implement optional prefix-commit batch." in optional.stderr
                results.append({"role":role,"width":width,"variant":variant,"archive":str(archive),"sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),
                                "files":len(actual_filenames),"result":outcome,"baselineAndCoreAccepted":True,"optionalIndependentOfCore":True,
                                "newNestedSourceCompiledAndExecuted":variant=="edited"})
assert len(results)==8
proof={"accepted":True,"jdk":version.stdout.strip(),"actualBrowserArchives":results,
       "temporaryBuildsCleaned":True,"learnerStructuralReasoningInferred":False,"runnableCoreBothRoles":True}
(SOURCE/"native-export-proof.json").write_text(json.dumps(proof,indent=2)+"\n")
print(json.dumps(proof),flush=True)
