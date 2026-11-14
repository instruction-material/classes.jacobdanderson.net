"""Verify actual browser ZIP package trees and value-data contracts."""
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
FIXTURE=json.loads((ROOT/"test/fixtures/java-value-data-sources.json").read_text())
SOURCE=Path(os.environ.get("JAVA_VALUE_DATA_BROWSER_PROOF_DIR",ROOT/"output/java-value-data"))
JAVA_HOME=os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA=str(Path(JAVA_HOME)/"bin/java") if JAVA_HOME else shutil.which("java")
JAVAC=str(Path(JAVA_HOME)/"bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-value-data-native"),
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
probe_name="src/supplies/experiment/Probe.java"
probe_content='package supplies.experiment;\npublic final class Probe {\n    public static void main(String[] args) { System.out.println("Saved value-data probe"); }\n}\n'
demo="LAB|1|PEN:2;PAD:1;PEN:3\nLAB dispatch=60 lines=3 units=6\nequal=true\nhash-set=true\nunchanged=LAB|1|PEN:2;PAD:1;PEN:3\n"
core_files=['src/supplies/ItemCode.java', 'src/supplies/RequestLine.java', 'src/supplies/SupplyRequest.java', 'src/supplies/RequestCodec.java']
with tempfile.TemporaryDirectory(prefix="java-value-data-exports-") as temporary:
    for role in ["starter","solution"]:
        prefix="DPR4-Value-Data-Packs/"+role+"/"
        names=sorted(path[len(prefix):] for path in FIXTURE["files"] if path.startswith(prefix))
        assert len(names)==13
        for width in [390,1280]:
            for variant in ["exact","edited"]:
                archive=SOURCE/"supplies"/f"{role}-{width}-{variant}.zip"
                assert archive.is_file(),archive
                output=Path(temporary)/f"{role}-{width}-{variant}"
                output.mkdir()
                actual_names=names+([probe_name] if variant=="edited" else [])
                with zipfile.ZipFile(archive) as zipped:
                    listed=zipped.namelist()
                    assert len(listed)==len(set(listed))==len(actual_names)
                    for filename in actual_names:
                        matches=[name for name in listed if name.endswith("/"+filename)]
                        assert len(matches)==1,(filename,listed)
                        data=zipped.read(matches[0])
                        if variant=="exact":
                            assert hashlib.sha256(data).hexdigest()==FIXTURE["files"][prefix+filename]["sha256"]
                        else:
                            if filename==probe_name:
                                expected=probe_content
                            else:
                                expected=FIXTURE["files"][prefix+filename]["content"]
                                if role=="starter" and filename in core_files:
                                    expected=FIXTURE["files"]["DPR4-Value-Data-Packs/solution/"+filename]["content"]
                                    if filename.endswith("/SupplyRequest.java"):
                                        expected=expected[:expected.index("    public SupplyRequest merged() {")]+('    public SupplyRequest merged() {\n'
                                            '        throw new UnsupportedOperationException("Implement optional merge.");\n'
                                            '    }\n}\n')
                                if filename in core_files:
                                    expected+=f"\n// Saved value-data trace {width}\n"
                                elif filename in ["README.md","CHECKPOINTS.md","DECISIONS.md"]:
                                    expected+=f"\nSaved value-data trace {width}\n"
                                elif filename=="sources.txt":
                                    expected+="\n"+probe_name+"\n"
                            assert data.decode()==expected,filename
                        path=output/filename
                        path.parent.mkdir(parents=True,exist_ok=True)
                        path.write_bytes(data)
                run([JAVAC,"--release","21","-Xlint:all","-Werror","-d","classes","@sources.txt"],cwd=output,check=True)
                base=run([JAVA,"-cp","classes","ContractTests","base"],cwd=output,check=True)
                assert base.stdout=="base data contracts: 1673 passed\n",base
                if role=="starter" and variant=="exact":
                    core=run([JAVA,"-cp","classes","ContractTests","core"],cwd=output)
                    assert core.returncode!=0 and "Expected IllegalArgumentException: code" in core.stderr
                    outcome="runnable baseline;typed-value core intentionally unfinished"
                else:
                    core=run([JAVA,"-cp","classes","ContractTests","core"],cwd=output,check=True)
                    assert core.stdout=="core data contracts: 1704 passed\n",core
                    outcome="complete typed-value core"
                for args in [[],["base"]]:
                    result=run([JAVA,"-cp","classes","Main",*args],cwd=output,check=True)
                    assert result.stdout==demo,result
                if variant=="edited":
                    probe=run([JAVA,"-cp","classes","supplies.experiment.Probe"],cwd=output,check=True)
                    assert probe.stdout=="Saved value-data probe\n",probe
                if role=="solution":
                    all_tests=run([JAVA,"-cp","classes","ContractTests"],cwd=output,check=True)
                    assert all_tests.stdout=="all data contracts: 1709 passed\n",all_tests
                elif variant=="edited":
                    optional=run([JAVA,"-cp","classes","ContractTests"],cwd=output)
                    assert optional.returncode!=0 and "Implement optional merge." in optional.stderr
                results.append({"role":role,"width":width,"variant":variant,"archive":str(archive),
                    "sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),"files":len(actual_names),
                    "result":outcome,"unchangedCompatibilityClientCompiled":True,"baseline":1673})
proof={"results":results,"browserExportsInspected":8,"exactArchives":4,"editedArchives":4,
       "membersChecked":108,"sourceRevision":FIXTURE["revision"],
       "scope":"All original/actual edited role files and every native mode;core verified before optional merge",
       "accepted":True}
assert len(results)==8
(SOURCE/"native-export-proof.json").write_text(json.dumps(proof,indent=2)+"\n")
print("Java value-data exports:8archives/108members,baseline/core/optional and unchanged clients verified")
