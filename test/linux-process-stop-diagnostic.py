"""Compare the exact optional-process verifier with an explicit Bash stopped-job wait."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import shutil
import signal
import subprocess
import tempfile
import time

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument("--output",type=Path,required=True)
args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
assert platform.system()=="Linux" and os.geteuid()!=0
identity=json.loads((ROOT/"test/fixtures/linux-process-optional-source-verifier.json").read_text())
original=(ROOT/"test/fixtures/linux-process-optional-source-verifier.py").read_bytes()
assert hashlib.sha256(original).hexdigest()==identity["sha256"]
needle='                jobs = wait_for(stopped_listing, "Bash records both stopped pipeline members")'
insert="""                stopped_wait = terminal.command("wait %1\\nprintf 'STOP_WAIT_STATUS=%s\\\\n' \\"$?\\"")
                assert "STOP_WAIT_STATUS=" + str(128 + signal.SIGSTOP) in stopped_wait
"""
assert original.decode().count(needle)==1
patched=original.decode() if "STOP_WAIT_STATUS=" in original.decode() else original.decode().replace(needle,insert+needle)
patched=patched.replace('"jobs": jobs, "foregroundStatus": 130,','"jobs": jobs, "stoppedWaitStatus": 128 + signal.SIGSTOP, "foregroundStatus": 130,')
packs=json.loads((ROOT/"test/fixtures/linux-owned-labs-contracts.json").read_text())
selected=[p for p in packs if p["pack"] in [
 "LS-11-unit-5-processes-and-job-control-supplemental-2",
 "LS-12-unit-5-processes-and-job-control-supplemental-3"]]
assert len(selected)==2
results=[]
with tempfile.TemporaryDirectory(prefix="linux-stopped-job-evidence-") as temporary:
    base=Path(temporary)
    for label,content in [("original",original),("wait-1",patched.encode()),("wait-2",patched.encode())]:
        folder=base/label;folder.mkdir();(folder/"test").mkdir()
        for pack in selected:
            assert pack["revision"]==identity.get("sourceRevision",identity["revision"])
            for name,data in pack["files"].items():
                content_bytes=data["content"].encode()
                assert hashlib.sha256(content_bytes).hexdigest()==data["sha256"]
                path=folder/pack["pack"]/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(content_bytes)
        path=folder/"test/verify_process_optional.py";path.write_bytes(content)
        output=args.output/label;output.mkdir()
        (output/"verifier.py").write_bytes(content)
        proof=output/"proof.json";stdout=output/"stdout.log"
        command=["python3","-I","-B",str(path),"--proof",str(proof.resolve())]
        started=time.time()
        with stdout.open("wb") as stream:
            child=subprocess.Popen(command,cwd=folder,stdout=stream,stderr=subprocess.STDOUT,start_new_session=True)
            record={"parentTaskId":os.environ.get("CLASSES_FAMILY_TASK_ID","linux-stop-evidence"),
                    "parentPid":os.getpid(),"pid":child.pid,"cwd":str(folder),"command":command,
                    "startTime":started,"timeoutSeconds":240}
            print(json.dumps({**record,"event":"start"}),flush=True)
            cleanup="owned verifier exited and reaped"
            try:
                status=child.wait(timeout=240)
            except BaseException:
                os.killpg(child.pid,signal.SIGTERM)
                try:child.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    os.killpg(child.pid,signal.SIGKILL);child.wait()
                cleanup="owned verifier process group terminated and reaped"
                raise
            finally:
                print(json.dumps({**record,"event":"end","endTime":time.time(),
                                  "exitCode":child.returncode,"childProcessGroupCleanup":cleanup}),flush=True)
        data=json.loads(proof.read_text()) if proof.exists() else {}
        result={"variant":label,"exitCode":status,"accepted":data.get("accepted",False),
                "profiles":len(data.get("profiles",[])),"observations":len(data.get("observations",[])),
                "verifierSHA256":hashlib.sha256(content).hexdigest(),"roleFilesUnchanged":data.get("sourceUnchanged",False)}
        if label!="original":
            assert status==0 and data["accepted"] and len(data["profiles"])==6 and len(data["observations"])==66,result
            stops=[row for row in data["observations"] if row["kind"]=="pipeline-job-control"]
            assert len(stops)==3 and all(row["stoppedWaitStatus"]==128+signal.SIGSTOP for row in stops)
        results.append(result)
proof={"sourceIdentity":identity,"explicitStopWaitAlreadyPresent":"STOP_WAIT_STATUS=" in original.decode(),"results":results,"candidateAcceptedTwice":True,
       "originalPublishedSourceAcceptanceInferred":False,"temporaryBuildsCleaned":True}
(args.output/"comparison.json").write_text(json.dumps(proof,indent=2)+"\n")
print(json.dumps(proof),flush=True)
