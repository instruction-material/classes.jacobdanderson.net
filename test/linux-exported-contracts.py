"""Run accepted Linux contracts against exact archives downloaded from the IDE."""
import argparse
import hashlib
import json
import os
import platform
import signal
import subprocess
import sys
import tempfile
import time
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument("--archives", type=Path, required=True)
parser.add_argument("--proof", type=Path, required=True)
args = parser.parse_args()
assert platform.system() == "Linux" and os.geteuid() != 0
fixture_dir = ROOT / "fixtures"
packs = json.loads((fixture_dir / "linux-owned-labs-contracts.json").read_text())
identity = json.loads((fixture_dir / "linux-owned-labs-source-verifier.json").read_text())
verifier = (fixture_dir / "linux-owned-labs-source-verifier.py").read_bytes()
assert hashlib.sha256(verifier).hexdigest() == identity["sha256"]
legacy_packs = [pack for pack in packs if pack["revision"] == identity["revision"]]
assert len(legacy_packs) == 5
proxy_packs = [pack for pack in packs if pack["pack"] == "LS3-Nginx-Reverse-Proxy-App"]
assert len(proxy_packs) == 1
proxy_identity = json.loads((fixture_dir / "linux-reverse-proxy-source-verifier.json").read_text())
proxy_verifier = (fixture_dir / "linux-reverse-proxy-source-verifier.py").read_bytes()
assert hashlib.sha256(proxy_verifier).hexdigest() == proxy_identity["sha256"]
assert proxy_packs[0]["revision"] == proxy_identity["revision"]
args.proof = args.proof.resolve()
args.proof.parent.mkdir(parents=True, exist_ok=True)
archives = []

with tempfile.TemporaryDirectory(prefix="linux-site-exports-") as directory:
    work = Path(directory)
    for pack in packs:
        for role in ("starter", "solution"):
            archive_path = args.archives / (pack["pack"] + "-" + role + ".zip")
            expected = {name: file for name, file in pack["files"].items()
                        if name == "README.md" or name.startswith(role + "/")}
            with zipfile.ZipFile(archive_path) as archive:
                names = archive.namelist()
                assert len(names) == len(expected) and len(names) == len(set(names))
                roots = {name.split("/")[0] for name in names}
                assert len(roots) == 1
                root = roots.pop()
                assert root not in ("", ".", "..")
                assert set(names) == {root + "/" + name for name in expected}
                for name, file in expected.items():
                    content = archive.read(root + "/" + name)
                    assert hashlib.sha256(content).hexdigest() == file["sha256"]
                    target = work / pack["pack"] / name
                    target.parent.mkdir(parents=True, exist_ok=True)
                    if target.exists():
                        assert target.read_bytes() == content
                    target.write_bytes(content)
            archives.append({"pack": pack["pack"], "role": role,
                             "sha256": hashlib.sha256(archive_path.read_bytes()).hexdigest(),
                             "files": sorted(expected)})
    assert len(archives) == 12
    (work / "test").mkdir()
    script = work / "test" / "verify_owned_labs.py"
    script.write_bytes(verifier)
    native_proof = args.proof.with_name(args.proof.stem + "-native.json")
    command = [sys.executable, str(script), "--proof", str(native_proof)]
    started = time.time()
    child = subprocess.Popen(command, cwd=work, start_new_session=True)
    cleanup = "process exited"
    try:
        status = child.wait(timeout=300)
    except BaseException:
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.wait(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.wait()
        cleanup = "process group terminated"
        raise
    finally:
        args.proof.with_suffix(".processes.jsonl").write_text(json.dumps({
            "parentTaskId": os.environ.get("CLASSES_FAMILY_TASK_ID", "linux-site-export-ci"),
            "parentPid": os.getpid(), "pid": child.pid, "command": command,
            "cwd": str(work), "startTime": started, "endTime": time.time(),
            "exitCode": child.returncode, "timeoutSeconds": 300,
            "childProcessGroupCleanup": cleanup}) + "\n")
    assert status == 0
    native = json.loads(native_proof.read_text())
    assert len(native["sourceHashes"]) == 35
    assert native["accepted"] and native["commandCount"] == 108
    assert len(native["profiles"]) == 14
    expected_hashes = {pack["pack"] + "/" + name: file["sha256"]
                       for pack in legacy_packs for name, file in pack["files"].items()}
    assert native["sourceHashes"] == expected_hashes
    proxy_script = work / "test" / "verify_reverse_proxy.py"
    proxy_script.write_bytes(proxy_verifier)
    proxy_proof = args.proof.with_name(args.proof.stem + "-proxy-native.json")
    proxy_command = [sys.executable, str(proxy_script), "--proof", str(proxy_proof)]
    proxy_started = time.time()
    proxy_child = subprocess.Popen(proxy_command, cwd=work, start_new_session=True)
    proxy_cleanup = "process exited"
    try:
        proxy_status = proxy_child.wait(timeout=180)
    except BaseException:
        os.killpg(proxy_child.pid, signal.SIGTERM)
        try:
            proxy_child.wait(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(proxy_child.pid, signal.SIGKILL)
            proxy_child.wait()
        proxy_cleanup = "process group terminated"
        raise
    finally:
        with args.proof.with_suffix(".processes.jsonl").open("a") as stream:
            stream.write(json.dumps({"parentTaskId": os.environ.get("CLASSES_FAMILY_TASK_ID", "linux-proxy-site-export-ci"), "parentPid": os.getpid(), "pid": proxy_child.pid, "command": proxy_command, "cwd": str(work), "startTime": proxy_started, "endTime": time.time(), "exitCode": proxy_child.returncode, "timeoutSeconds": 180, "childProcessGroupCleanup": proxy_cleanup}) + "\n")
    assert proxy_status == 0
    proxy_native = json.loads(proxy_proof.read_text())
    assert proxy_native["accepted"] and not proxy_native["appOnly"]
    assert len(proxy_native["profiles"]) == 3 and len(proxy_native["observations"]) == 75
    assert proxy_native["sourceHashes"] == {name: file["sha256"] for name, file in proxy_packs[0]["files"].items()}
    default = work / "default-workspace"
    default.mkdir()
    default_archive = args.archives / "default-linux.zip"
    default_hashes = {}
    with zipfile.ZipFile(default_archive) as archive:
        names = archive.namelist()
        assert len(names) == 2
        root = names[0].split("/")[0]
        assert set(names) == {root + "/main.sh", root + "/README.md"}
        for name in ("main.sh", "README.md"):
            content = archive.read(root + "/" + name)
            (default / name).write_bytes(content)
            default_hashes[name] = hashlib.sha256(content).hexdigest()
    default_command = ["bash", str(default / "main.sh")]
    started = time.time()
    default_child = subprocess.Popen(default_command, cwd=default,
                                     stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                     start_new_session=True)
    cleanup = "process exited"
    try:
        output, diagnostics = default_child.communicate(timeout=10)
    except BaseException:
        os.killpg(default_child.pid, signal.SIGTERM)
        try:
            default_child.communicate(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(default_child.pid, signal.SIGKILL)
            default_child.communicate()
        cleanup = "process group terminated"
        raise
    finally:
        with args.proof.with_suffix(".processes.jsonl").open("a") as stream:
            stream.write(json.dumps({
                "parentTaskId": os.environ.get("CLASSES_FAMILY_TASK_ID", "linux-site-export-ci"),
                "parentPid": os.getpid(), "pid": default_child.pid,
                "command": default_command, "cwd": str(default),
                "startTime": started, "endTime": time.time(),
                "exitCode": default_child.returncode, "timeoutSeconds": 10,
                "childProcessGroupCleanup": cleanup}) + "\n")
    assert default_child.returncode == 0 and output == b"Hello, Linux!\n"
    assert diagnostics == b""
    args.proof.write_text(json.dumps({"sourceIdentity": identity, "archives": archives,
                                     "nativeProof": str(native_proof),
                                     "proxySourceIdentity": proxy_identity,
                                     "proxyNativeProof": str(proxy_proof),
                                     "defaultWorkspace": {"fileHashes": default_hashes,
                                                          "stdout": output.decode(),
                                                          "status": default_child.returncode},
                                     "nativePassed": True}, indent=2) + "\n")
