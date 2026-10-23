"""Verify complete networking browser exports with their supplied Swift contracts and iOS SDK."""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import signal
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def verify(browser, proof):
    browser, proof = browser.resolve(), proof.resolve()
    assert not proof.exists(), "Use a fresh proof path"
    proof.parent.mkdir(parents=True, exist_ok=True)
    work = proof.parent / "exported-contract-work"
    assert not work.exists()
    work.mkdir()
    (work / ".metadata_never_index").touch()
    owner = json.loads((Path(os.environ.get("CLASSES_FAMILY_LOCK", "/tmp/classes-family-heavy-task.lock")) / "owner.json").read_text())
    assert owner["parentPid"] == os.getppid() and owner["childPid"] == os.getpid(), "Use the shared heavy-task wrapper"
    assert os.environ.get("CLASSES_FAMILY_ALLOW_HIGH_LOAD") != "1"
    fixture = json.loads((ROOT / "test/fixtures/swift-networking-source.json").read_text())
    workflow = json.loads((browser / "swift-swift-networking-course-proof.json").read_text())
    profiles = workflow["profiles"]
    assert len(profiles) == 4 and {(p["role"], p["width"]) for p in profiles} == {
        (role, width) for role in ("starter", "solution") for width in (390, 1280)
    }
    result = dict(startedAt=now(), accepted=False, sourceRevision=fixture["revision"], exports=[],
                  iosSimulatorExecutionVerified=False, nativeUIAcceptancePending=True)
    log = proof.parent / "processes.jsonl"

    def stop(signum, _frame):
        raise SystemExit(128 + signum)

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)

    def run(label, command, cwd, timeout=300):
        event = dict(parentTaskId="swift-networking-exported-contracts", parentPid=os.getpid(),
                     cwd=str(cwd), command=command, startTime=now(), timeoutSeconds=timeout)
        child = subprocess.Popen(command, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True)
        event["pid"] = child.pid
        with log.open("a") as stream:
            stream.write(json.dumps(dict(event, event="start")) + "\n")
        cleanup = "owned child exited and reaped"
        stdout, stderr = b"", b""
        try:
            stdout, stderr = child.communicate(timeout=timeout)
        except BaseException:
            if child.poll() is None:
                os.killpg(child.pid, signal.SIGTERM)
                try:
                    stdout, stderr = child.communicate(timeout=5)
                except subprocess.TimeoutExpired:
                    os.killpg(child.pid, signal.SIGKILL)
                    stdout, stderr = child.communicate()
            cleanup = "owned child process group terminated and reaped"
            raise
        finally:
            with log.open("a") as stream:
                stream.write(json.dumps(dict(event, event="end", endTime=now(), exitCode=child.returncode,
                                             childProcessGroupCleanup=cleanup)) + "\n")
            (proof.parent / (label + ".stdout.txt")).write_bytes(stdout)
            (proof.parent / (label + ".stderr.txt")).write_bytes(stderr)
        assert child.returncode == 0, (label, stderr.decode(errors="replace")[-5000:])
        return stdout

    try:
        for profile in profiles:
            role = profile["role"]
            assert profile["revision"] == fixture["revision"]
            assert profile["key"] == "intro-to-swift-app-development:api-reference:" + (
                "starter" if role == "starter" else "reference") + ":native-swift-v1"
            assert all(profile[key] for key in ["consentBeforeFetch", "primaryStoreRead", "codeAndTraceSaved",
                                                "sameAttemptReused", "previousWorkPreserved"])
            assert profile["remoteWrites"] == 0 and profile["additionalSourceRequests"] == 0
            names = {role + "/" + name for name in [
                "ContentView.swift", "APIReferenceApp.swift", "ReferenceClient.swift", "ReferenceStore.swift"
            ]} | {"README.md", "verify-networking.py", "tests/ReferenceContracts.swift"}
            for kind in ("exact", "edited"):
                filename = profile[kind + "Archive"]
                assert PurePosixPath(filename).name == filename
                archive = browser / filename
                assert archive.stat().st_size < 8 * 1024 * 1024
                digest = hashlib.sha256(archive.read_bytes()).hexdigest()
                assert digest == profile[kind + "ArchiveSha256"]
                files = profile["sourceFiles" if kind == "exact" else "editedFiles"]
                assert len(files) == 7 and {file["name"] for file in files} == names
                destination = work / archive.stem
                destination.mkdir()
                with zipfile.ZipFile(archive) as zipped:
                    assert len(zipped.infolist()) == 7
                    for item in zipped.infolist():
                        path = PurePosixPath(item.filename)
                        assert not path.is_absolute() and ".." not in path.parts and "\\" not in item.filename
                        assert not item.is_dir() and item.file_size < 2 * 1024 * 1024
                    for file in files:
                        matches = [name for name in zipped.namelist() if name.endswith("/" + file["name"])]
                        assert len(matches) == 1
                        raw = zipped.read(matches[0])
                        assert hashlib.sha256(raw).hexdigest() == file["sha256"]
                        if kind == "exact":
                            expected = fixture["files"][fixture["pack"] + "/" + file["name"]]
                            assert raw == expected["content"].encode() and file["sha256"] == expected["sha256"]
                        target = destination / file["name"]
                        target.parent.mkdir(parents=True, exist_ok=True)
                        target.write_bytes(raw)
                contract_proof = destination / "contracts-proof.json"
                run(archive.stem, [sys.executable, str(destination / "verify-networking.py"),
                                  "--ios", "--proof", str(contract_proof)], destination, timeout=600)
                contracts = json.loads(contract_proof.read_text())
                assert contracts["accepted"] and contracts["contractsAccepted"]
                assert contracts["passed"] == len(contracts["checks"]) >= 25
                assert contracts["sourceRoles"] == contracts["iosRolesTypechecked"] == [role]
                assert contracts["externalRequests"] == 0 and contracts["ownedServerClosed"]
                assert contracts["iosSimulatorExecutionVerified"] is False
                result["exports"].append(dict(archive=filename, sha256=digest, role=role,
                    width=profile["width"], kind=kind, contractsPassed=contracts["passed"],
                    iosSDK=contracts["iosSDK"], iosTarget=contracts["iosTarget"],
                    sdkTypecheckPassed=True, contractProof=str(contract_proof)))
                proof.write_text(json.dumps(result, indent=2) + "\n")
        result["accepted"] = len(result["exports"]) == 8
        assert result["accepted"]
    finally:
        result["endedAt"] = now()
        proof.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", type=Path, required=True)
    parser.add_argument("--proof", type=Path, required=True)
    args = parser.parse_args()
    verify(args.browser, args.proof)
