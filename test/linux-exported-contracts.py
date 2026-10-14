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
apache_packs = [pack for pack in packs if pack["pack"] == "LS4-Apache-Virtual-Host-Compare"]
assert len(apache_packs) == 1
apache_identity = json.loads((fixture_dir / "linux-apache-source-verifier.json").read_text())
apache_verifier = (fixture_dir / "linux-apache-source-verifier.py").read_bytes()
assert hashlib.sha256(apache_verifier).hexdigest() == apache_identity["sha256"]
assert apache_packs[0]["revision"] == apache_identity["revision"]
systemd_packs = [pack for pack in packs if pack["pack"] == "LS5-Systemd-Toy-Service"]
assert len(systemd_packs) == 1
systemd_identity = json.loads((fixture_dir / "linux-systemd-source-verifier.json").read_text())
systemd_verifier = (fixture_dir / "linux-systemd-source-verifier.py").read_bytes()
assert hashlib.sha256(systemd_verifier).hexdigest() == systemd_identity["sha256"]
assert systemd_packs[0]["revision"] == systemd_identity["revision"]
supplemental_packs = [pack for pack in packs if pack["pack"] in ("LS-13-unit-6-services-and-systemd-supplemental-2", "LS-14-unit-6-services-and-systemd-supplemental-3")]
assert len(supplemental_packs) == 2
supplemental_identity = json.loads((fixture_dir / "linux-systemd-supplemental-source-verifier.json").read_text())
supplemental_verifier = (fixture_dir / "linux-systemd-supplemental-source-verifier.py").read_bytes()
assert hashlib.sha256(supplemental_verifier).hexdigest() == supplemental_identity["sha256"]
assert all(pack["revision"] == supplemental_identity["revision"] for pack in supplemental_packs)
logging_packs = [pack for pack in packs if pack["pack"] in ("LS-09-unit-7-logging-and-observability", "LS-15-unit-7-logging-and-observability-supplemental-2", "LS-16-unit-7-logging-and-observability-supplemental-3")]
assert len(logging_packs) == 3 and len(packs) == 13
logging_identity = json.loads((fixture_dir / "linux-logging-source-verifier.json").read_text())
logging_verifier = (fixture_dir / "linux-logging-source-verifier.py").read_bytes()
assert hashlib.sha256(logging_verifier).hexdigest() == logging_identity["sha256"]
assert all(pack["revision"] == logging_identity["revision"] for pack in logging_packs)
args.proof = args.proof.resolve()
args.proof.parent.mkdir(parents=True, exist_ok=True)
archives = []


def run_pinned_contract(work, name, source, proof, timeout):
    script = work / "test" / name
    script.write_bytes(source)
    command = [sys.executable, str(script), "--proof", str(proof)]
    started = time.time()
    child = subprocess.Popen(command, cwd=work, start_new_session=True)
    cleanup = "process exited"
    try:
        status = child.wait(timeout=timeout)
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
        with args.proof.with_suffix(".processes.jsonl").open("a") as stream:
            stream.write(json.dumps({"parentTaskId": os.environ.get("CLASSES_FAMILY_TASK_ID", "linux-site-export-ci"), "parentPid": os.getpid(), "pid": child.pid, "command": command, "cwd": str(work), "startTime": started, "endTime": time.time(), "exitCode": child.returncode, "timeoutSeconds": timeout, "childProcessGroupCleanup": cleanup}) + "\n")
    assert status == 0
    return json.loads(proof.read_text())

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
    assert len(archives) == 26
    (work / "test").mkdir()
    native_proof = args.proof.with_name(args.proof.stem + "-native.json")
    native = run_pinned_contract(work, "verify_owned_labs.py", verifier, native_proof, 300)
    assert len(native["sourceHashes"]) == 35
    assert native["accepted"] and native["commandCount"] == 108
    assert len(native["profiles"]) == 14
    expected_hashes = {pack["pack"] + "/" + name: file["sha256"]
                       for pack in legacy_packs for name, file in pack["files"].items()}
    assert native["sourceHashes"] == expected_hashes
    proxy_proof = args.proof.with_name(args.proof.stem + "-proxy-native.json")
    proxy_native = run_pinned_contract(work, "verify_reverse_proxy.py", proxy_verifier, proxy_proof, 180)
    assert proxy_native["accepted"] and not proxy_native["appOnly"]
    assert len(proxy_native["profiles"]) == 3 and len(proxy_native["observations"]) == 75
    assert proxy_native["sourceHashes"] == {name: file["sha256"] for name, file in proxy_packs[0]["files"].items()}
    apache_proof = args.proof.with_name(args.proof.stem + "-apache-native.json")
    apache_native = run_pinned_contract(work, "verify_apache_comparison.py", apache_verifier, apache_proof, 180)
    assert apache_native["accepted"] and apache_native["sourceUnchanged"]
    assert len(apache_native["profiles"]) == 3 and len(apache_native["observations"]) == 99
    assert apache_native["sourceHashes"] == {name: file["sha256"] for name, file in apache_packs[0]["files"].items()}
    assert all(profile["actualLinuxSockets"] and profile["rejectedSyntaxLeavesServing"] and profile["ownedListenersRemoved"] for profile in apache_native["profiles"])
    assert sum(profile["changedAndRestored"] for profile in apache_native["profiles"]) == 2
    systemd_proof = args.proof.with_name(args.proof.stem + "-systemd-native.json")
    systemd_native = run_pinned_contract(work, "verify_systemd_service.py", systemd_verifier, systemd_proof, 180)
    assert systemd_native["accepted"] and not systemd_native["appOnly"]
    assert systemd_native["sourceUnchanged"] and systemd_native["managerVersion"]
    assert len(systemd_native["profiles"]) == 3
    assert systemd_native["sourceHashes"] == {name: file["sha256"] for name, file in systemd_packs[0]["files"].items()}
    assert all(profile["actualManager"] for profile in systemd_native["profiles"])
    learner = next(profile for profile in systemd_native["profiles"] if profile["role"] == "starter")
    assert learner["namedUnfinishedStatus"] == 78 and learner["restartLoopPrevented"]
    completed = [profile for profile in systemd_native["profiles"] if profile["role"] != "starter"]
    assert len(completed) == 2
    assert all(all(profile[key] for key in ("actualJournal", "manualRestart", "automaticRestart", "persistentEnable", "enabledAndStopped", "invalidEnvironmentFailure", "recovered")) for profile in completed)
    cleanup = [row for row in systemd_native["observations"] if row.get("kind") == "cleanup"]
    assert len(cleanup) == 3
    assert all(all(row[key] for key in ("unitRemoved", "processStopped", "activationRemoved", "installRemoved")) for row in cleanup)
    supplemental_proof = args.proof.with_name(args.proof.stem + "-supplemental-native.json")
    supplemental_native = run_pinned_contract(work, "verify_systemd_supplemental.py", supplemental_verifier, supplemental_proof, 300)
    assert supplemental_native["accepted"] and not supplemental_native["appOnly"]
    assert supplemental_native["managerVersion"] and supplemental_native["sourceUnchanged"]
    assert len(supplemental_native["profiles"]) == 6
    assert supplemental_native["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in supplemental_packs for name, file in pack["files"].items()}
    assert all(profile["actualManager"] for profile in supplemental_native["profiles"])
    transfer = [profile for profile in supplemental_native["profiles"] if profile["kind"] == "transfer"]
    extension = [profile for profile in supplemental_native["profiles"] if profile["kind"] == "extension"]
    assert len(transfer) == 3 and len(extension) == 3
    assert next(profile for profile in transfer if profile["role"] == "starter")["namedWorkingDirectoryFailure"]
    assert all(all(profile[key] for key in ("actualHttpAndSocket", "actualJournal", "manualRestart", "automaticRestart", "workingDirectoryFaultAndRecovery", "baseUnitUnchanged", "enabledAndStopped")) for profile in transfer if profile["role"] != "starter")
    assert all(all(profile[key] for key in ("actualJournal", "actualProcessEnvironment", "dropInRemovalRestoresBase", "baseUnitUnchanged")) for profile in extension)
    assert all(all(profile[key] for key in ("resetAndReplacementObserved", "fileEditNeedsRestart", "invalidOverrideFailureAndRecovery")) for profile in extension if profile["role"] != "starter")
    assert next(profile for profile in extension if profile["role"] == "starter")["ignoredInvalidOverrideObserved"]
    supplemental_cleanup = [row for row in supplemental_native["observations"] if row.get("kind") == "cleanup"]
    assert len(supplemental_cleanup) == 6 and all(all(row[key] for key in ("unitRemoved", "processStopped", "activationRemoved", "dropInRemoved", "installRemoved")) for row in supplemental_cleanup)
    logging_proof = args.proof.with_name(args.proof.stem + "-logging-native.json")
    logging_native = run_pinned_contract(work, "verify_logging_labs.py", logging_verifier, logging_proof, 300)
    assert logging_native["accepted"] and not logging_native["offlineOnly"] and logging_native["preflightPassed"]
    assert logging_native["sourceUnchanged"] and logging_native["temporaryFilesCleaned"]
    assert logging_native["managerVersion"] and logging_native["logrotateVersion"]
    assert len(logging_native["profiles"]) == 9
    assert logging_native["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in logging_packs for name, file in pack["files"].items()}
    assert all(all(value for value in profile.values() if isinstance(value, bool)) for profile in logging_native["profiles"])
    for kind in ("journal", "application", "retention"):
        group = [profile for profile in logging_native["profiles"] if profile["kind"] == kind]
        assert len(group) == 3 and {profile["role"] for profile in group} == {"starter", "solution", "independent-completion"}
    scope_rows = [row for row in logging_native["observations"] if row.get("kind") == "unit-scope-analysis"]
    assert len(scope_rows) == 2 and all(row["managerRows"] > 0 and row["fieldCollisions"] > 0 and row["expectedEvents"] == row["reportedEvents"] for row in scope_rows)
    logging_cleanup = [row for row in logging_native["observations"] if row.get("kind") == "cleanup"]
    assert len(logging_cleanup) == 6 and all(all(value for value in row.values() if isinstance(value, bool)) for row in logging_cleanup)
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
                                     "apacheSourceIdentity": apache_identity,
                                     "apacheNativeProof": str(apache_proof),
                                     "systemdSourceIdentity": systemd_identity,
                                     "systemdNativeProof": str(systemd_proof),
                                     "supplementalSourceIdentity": supplemental_identity,
                                     "supplementalNativeProof": str(supplemental_proof),
                                     "loggingSourceIdentity": logging_identity,
                                     "loggingNativeProof": str(logging_proof),
                                     "defaultWorkspace": {"fileHashes": default_hashes,
                                                          "stdout": output.decode(),
                                                          "status": default_child.returncode},
                                     "nativePassed": True}, indent=2) + "\n")
