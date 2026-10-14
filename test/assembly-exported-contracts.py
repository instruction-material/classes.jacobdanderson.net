"""Exercise the accepted contract verifier on actual site-exported role bytes."""
import argparse
import datetime
import hashlib
import json
import os
import signal
import subprocess
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--project", choices=["opening", "calculator", "array", "string", "helper", "parser", "reverse", "stack", "compiler", "debug", "performance", "hardening"], default="opening")
parser.add_argument("--archives", type=Path, required=True)
parser.add_argument("--cc", choices=["clang", "gcc"], required=True)
parser.add_argument("--skip-debugger", action="store_true")
parser.add_argument("--proof", type=Path, required=True)
args = parser.parse_args()
assert not (args.project == "hardening" and args.skip_debugger), "Hardening acceptance requires actual GDB setting and return traces"
fixture = json.loads((ROOT / ("test/fixtures/assembly-" + args.project + "-contracts.json")).read_text())
args.proof.parent.mkdir(parents=True, exist_ok=True)

def run(command, cwd):
    start = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(command, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True)
    cleanup = "process exited"
    try:
        out, err = child.communicate(timeout=180)
    except BaseException:
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.communicate(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.communicate()
        cleanup = "child process group terminated"
        raise
    finally:
        with args.proof.with_suffix(".wrapper-processes.jsonl").open("a") as stream:
            stream.write(json.dumps({"parentTaskId": os.environ.get("CLASSES_FAMILY_TASK_ID", "assembly-site-export"), "command": command, "cwd": str(cwd), "pid": child.pid, "startTime": start, "endTime": datetime.datetime.now(datetime.timezone.utc).isoformat(), "exitCode": child.returncode, "timeoutSeconds": 180, "childProcessGroupCleanup": cleanup}) + "\n")
    assert child.returncode == 0, (command, child.returncode, (out + err).decode(errors="replace"))
    return out

with tempfile.TemporaryDirectory(prefix="assembly-site-export-") as work:
    root = Path(work)
    pack = root / fixture["pack"]
    hashes = {}
    for role in ["starter", "solution"]:
        archive = args.archives / (fixture["pack"] + "-" + role + ".zip")
        with zipfile.ZipFile(archive) as source:
            expected = {path.removeprefix(fixture["pack"] + "/"): file for path, file in fixture["files"].items() if path.startswith(fixture["pack"] + "/" + role + "/") or path == fixture["pack"] + "/README.md"}
            assert len(source.namelist()) == len(expected) and len(expected) > 1
            for name, file in expected.items():
                matches = [path for path in source.namelist() if path.endswith("/" + name)]
                assert len(matches) == 1
                data = source.read(matches[0])
                assert hashlib.sha256(data).hexdigest() == file["sha256"]
                assert data.decode() == file["content"]
                path = pack / name
                path.parent.mkdir(parents=True, exist_ok=True)
                if path.exists():
                    assert path.read_bytes() == data
                path.write_bytes(data)
                hashes[name] = file["sha256"]
    if args.project == "opening":
        with zipfile.ZipFile(args.archives / "assembly-default.zip") as source:
            demo = root / "default"
            demo.mkdir()
            assert len(source.namelist()) == 3
            for name in ["routine.S", "main.c", "README.md"]:
                matches = [path for path in source.namelist() if path.endswith("/" + name)]
                assert len(matches) == 1
                (demo / name).write_bytes(source.read(matches[0]))
            run([args.cc, "-std=c17", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "main.c", "routine.S", "-o", "example"], demo)
            assert run([str(demo / "example")], demo) == b"result=11\n"
    verifier = root / ("test/verify_" + args.project + ".py")
    verifier.parent.mkdir()
    verifier.write_text(fixture["nativeVerification"])
    command = ["python3", str(verifier), "--cc", args.cc, "--proof", str(args.proof.resolve())]
    if args.skip_debugger:
        command.append("--skip-debugger")
    run(command, root)
    receipt = json.loads(args.proof.read_text())
    if args.project == "opening":
        receipt["defaultWorkspaceNativeOutput"] = "result=11\n"
    receipt["siteExportedFiles"] = hashes
    receipt["sourceRevision"] = fixture["revision"]
    args.proof.write_text(json.dumps(receipt, indent=2) + "\n")
if args.project == "hardening":
    assert receipt["realGdb"] and len(receipt["traces"]) == 2
    summary = {"compiler": args.cc, "acceptedProfiles": len(receipt["profiles"]), "nativeCases": receipt["nativeCases"], "debugger": "accepted", "exactSiteExportedFiles": len(hashes)}
else:
    fields = {"opening": "arithmeticCases", "calculator": "arithmeticCases", "array": "arrayCases", "string": "stringCases", "helper": "helperCases", "parser": "parserCases", "reverse": "reverseCases", "stack": "stackCases", "compiler": "compilerCases", "debug": "debugCases", "performance": "performanceCases"}
    summary = {"compiler": args.cc, "acceptedProfiles": len(receipt["acceptedProfiles"]), "nativeCases": sum(p[fields[args.project]] for p in receipt["acceptedProfiles"]), "debugger": receipt["debugger"]["status"], "exactSiteExportedFiles": len(hashes)}
print(json.dumps(summary))
