"""Verify actual browser ZIP package trees and ownership-move contracts."""
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
FIXTURE=json.loads((ROOT/"test/fixtures/java-ownership-move-sources.json").read_text())
SOURCE=Path(os.environ.get("JAVA_OWNERSHIP_MOVE_BROWSER_PROOF_DIR",ROOT/"output/java-ownership-move"))
JAVA_HOME=os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA=str(Path(JAVA_HOME)/"bin/java") if JAVA_HOME else shutil.which("java")
JAVAC=str(Path(JAVA_HOME)/"bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-ownership-move-native"),
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
probe_name="src/contacts/experiment/Probe.java"
probe_content='package contacts.experiment;\npublic final class Probe {\n    public static void main(String[] args) { System.out.println("Saved ownership probe"); }\n}\n'
demo="(212) 5550100\nMira <(212) 5550100>\nMira <(020) 70001234>\n020|70001234\n2024-01-08\n2024-01-08\n"
with tempfile.TemporaryDirectory(prefix="java-ownership-move-exports-") as temporary:
    for role in ["starter","solution"]:
        prefix="DPR3-Contact-Ownership-Packs/"+role+"/"
        names=sorted(path[len(prefix):] for path in FIXTURE["files"] if path.startswith(prefix))
        assert len(names)==(13 if role=="starter" else 14)
        for width in [390,1280]:
            for variant in ["exact","edited"]:
                archive=SOURCE/"contacts"/f"{role}-{width}-{variant}.zip"
                assert archive.is_file(),archive
                output=Path(temporary)/f"{role}-{width}-{variant}";output.mkdir()
                new_name="src/contacts/Phone.java" if role=="starter" else probe_name
                actual_names=names+([new_name] if variant=="edited" else [])
                with zipfile.ZipFile(archive) as zipped:
                    listed=zipped.namelist();assert len(listed)==len(set(listed))==len(actual_names)
                    for filename in actual_names:
                        matched=[name for name in listed if name.endswith("/"+filename)]
                        assert len(matched)==1,(filename,listed)
                        data=zipped.read(matched[0])
                        if variant=="edited" and filename==new_name:
                            expected=FIXTURE["files"]["DPR3-Contact-Ownership-Packs/solution/src/contacts/Phone.java"]["content"] if role=="starter" else probe_content
                            assert data.decode()==expected
                        else:
                            original=FIXTURE["files"][prefix+filename]
                            if variant=="exact":
                                assert hashlib.sha256(data).hexdigest()==original["sha256"]
                            else:
                                expected=original["content"]
                                if role=="starter" and filename in ["src/contacts/Member.java","src/contacts/ContactPrinter.java"]:
                                    expected=FIXTURE["files"]["DPR3-Contact-Ownership-Packs/solution/"+filename]["content"]
                                    if filename.endswith("/Member.java"):
                                        expected=expected.replace("return phone.masked();",'throw new UnsupportedOperationException("Implement optional masked format.");')
                                if filename in ["src/contacts/Member.java","src/contacts/ContactPrinter.java"] or (role=="solution" and filename=="src/contacts/Phone.java"):
                                    expected+=f"\n// Saved ownership trace {width}\n"
                                elif filename in ["README.md","CHECKPOINTS.md","DECISIONS.md"]:
                                    expected+=f"\nSaved ownership trace {width}\n"
                                elif filename=="sources.txt":
                                    expected+="\n"+new_name+"\n"
                                assert data.decode()==expected,filename
                        path=output/filename;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
                run([JAVAC,"--release","21","-Xlint:all","-Werror","-d","classes","@sources.txt"],cwd=output,check=True)
                baseline=run([JAVA,"-cp","classes","ContractTests","base"],cwd=output,check=True)
                assert baseline.stdout=="Baseline ownership-move contracts: 3253 passed\n",baseline
                core=run([JAVA,"-cp","classes","ContractTests","core"],cwd=output,check=True)
                assert core.stdout=="Core ownership-move contracts: 4911 passed\n",core
                for mode in [[],["base"]]:
                    result=run([JAVA,"-cp","classes","Main",*mode],cwd=output,check=True)
                    assert result.stdout==demo,result
                if variant=="edited" and role=="solution":
                    probe=run([JAVA,"-cp","classes","contacts.experiment.Probe"],cwd=output,check=True)
                    assert probe.stdout=="Saved ownership probe\n",probe
                owner_isolated=role=="solution" or variant=="edited"
                if owner_isolated:
                    run([JAVAC,"--release","21","-Xlint:all","-Werror","-d","owner-classes",
                         "src/contacts/Member.java","src/contacts/Phone.java"],cwd=output,check=True)
                if role=="starter":
                    full=run([JAVA,"-cp","classes","ContractTests"],cwd=output)
                    assert full.returncode!=0 and "UnsupportedOperationException: Implement optional masked format." in full.stderr,full
                    outcome="runnable-core-starter-optional-independent"
                else:
                    full=run([JAVA,"-cp","classes","ContractTests"],cwd=output,check=True)
                    assert full.stdout=="Complete ownership-move contracts: 4991 passed\n",full
                    outcome=full.stdout.strip()
                    path=output/"src/contacts/Member.java"
                    text=path.read_text().replace("return phone.masked();",'throw new UnsupportedOperationException("Implement optional masked format.");')
                    path.write_text(text)
                    run([JAVAC,"--release","21","-Xlint:all","-Werror","-d","classes","@sources.txt"],cwd=output,check=True)
                    core_only=run([JAVA,"-cp","classes","ContractTests","core"],cwd=output,check=True)
                    assert core_only.stdout=="Core ownership-move contracts: 4911 passed\n"
                    optional=run([JAVA,"-cp","classes","ContractTests"],cwd=output)
                    assert optional.returncode!=0 and "UnsupportedOperationException: Implement optional masked format." in optional.stderr
                results.append({"role":role,"width":width,"variant":variant,"archive":str(archive),
                                "sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),"files":len(actual_names),
                                "result":outcome,"unchangedOldClientCompiled":True,"ownerCompilesWithoutPrinter":owner_isolated,
                                "actualPhoneOwnerCreatedCompiledAndUsed":variant=="edited" and role=="starter",
                                "newNestedProbeCompiledAndExecuted":variant=="edited" and role=="solution",
                                "optionalIndependentOfCore":True})
assert len(results)==8
proof={"accepted":True,"jdk":version.stdout.strip(),"actualBrowserArchives":results,
       "temporaryBuildsCleaned":True,"learnerStructuralReasoningInferred":False}
(SOURCE/"native-export-proof.json").write_text(json.dumps(proof,indent=2)+"\n")
print(json.dumps(proof),flush=True)
