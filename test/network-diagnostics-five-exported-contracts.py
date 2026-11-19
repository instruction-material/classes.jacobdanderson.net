"""Verify exact and actual browser-edited diagnostics projects before native execution."""
import datetime
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath

# Resolve the sibling verifier by its trusted source path, including python -I.
import importlib.util

_receipt_spec = importlib.util.spec_from_file_location(
    "network_export_receipts", Path(__file__).resolve().with_name("network_export_receipts.py"))
_receipts = importlib.util.module_from_spec(_receipt_spec)
_receipt_spec.loader.exec_module(_receipts)
export_profile, read_export = _receipts.export_profile, _receipts.read_export
import signal
import subprocess
import sys
import tempfile
import zipfile


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    root = Path(__file__).resolve().parents[1]
    output = Path(sys.argv[1]).resolve()
    fixtures = json.loads((root / "test/fixtures/network-diagnostics-five-contracts.json").read_text())
    verifier = json.loads((root / "test/fixtures/network-diagnostics-five-source-verifiers.json").read_text())
    assert len(fixtures) == 5
    assert {fixture["revision"] for fixture in fixtures} == {verifier["revision"]}
    for file in verifier["files"]:
        assert digest(file["content"].encode()) == file["sha256"]
    browser = json.loads((output / "network-browser-proof.json").read_text())
    profiles = {(row["pack"], row["role"], row["width"]): row for row in browser["profiles"]}
    assert len(profiles) == len(browser["profiles"]) == 20
    accepted = output / "diagnostics-native/network-diagnostics-exported-native.json"
    accepted.parent.mkdir(parents=True, exist_ok=True)
    archives, comparisons, expected_hashes = {}, 0, {}
    with tempfile.TemporaryDirectory(prefix="network-diagnostics-site-export-") as temporary:
        work = Path(temporary)
        for fixture in fixtures:
            pack = fixture["pack"]
            for name, file in fixture["files"].items():
                assert digest(file["content"].encode()) == file["sha256"]
                expected_hashes[pack + "/" + name] = file["sha256"]
            for role in ["starter", "solution"]:
                expected = {name: file for name, file in fixture["files"].items()
                            if name == "README.md" or name.startswith(role + "/")}
                assert len(expected) == 6
                for width in [390, 1280]:
                    profile = export_profile(browser, fixture, role, width)
                    assert profile["revision"] == verifier["revision"]
                    assert profile["taskChoiceEdited"] is True
                    assert profile["editedFileName"] == role + "/" + fixture["taskFile"]
                    assert profile["editedSourceSHA256"] == digest(fixture["roleEdits"][role].encode())
                    for field in ["consentBeforeFetch", "savedEditReopened", "primaryStoreRead",
                                  "reopenedSameAttempt", "previousWorkPreserved", "nativeInstructions"]:
                        assert profile[field] is True, (pack, role, width, field)
                    for variant in ["exact", "edited"]:
                        filename, raw = read_export(output, profile, variant)
                        assert digest(raw) == profile[variant + "ArchiveSha256"]
                        archives[filename] = digest(raw)
                        with zipfile.ZipFile(io.BytesIO(raw)) as archive:
                            names = archive.namelist()
                            assert len(names) == len(set(names)) == 6
                            roots, actual = set(), {}
                            for member in names:
                                path = PurePosixPath(member)
                                assert not path.is_absolute() and len(path.parts) >= 2
                                assert ".." not in path.parts and "\\" not in member
                                roots.add(path.parts[0])
                                name = str(PurePosixPath(*path.parts[1:]))
                                assert name not in actual
                                actual[name] = archive.read(member)
                            assert len(roots) == 1 and set(actual) == set(expected)
                            for name, file in expected.items():
                                content = file["content"]
                                if variant == "edited" and name == role + "/" + fixture["taskFile"]:
                                    content = fixture["roleEdits"][role]
                                assert actual[name] == content.encode(), (filename, name)
                                comparisons += 1
                                if width == 390:
                                    target = work / ("edited" if variant == "edited" else "original") / pack / name
                                    target.parent.mkdir(parents=True, exist_ok=True)
                                    if target.exists():
                                        assert target.read_bytes() == actual[name]
                                    else:
                                        target.write_bytes(actual[name])


        assert len(archives) == 40 and comparisons == 240
        assert os.geteuid() > 0 and sys.platform == "linux"
        source_root = work / "original"
        expected_verifiers = {"test/verify_diagnostics_five.py", "test/network_diagnostics_five_cases.json"}
        assert {file["path"] for file in verifier["files"]} == expected_verifiers
        for file in verifier["files"]:
            entry = source_root / file["path"]
            entry.parent.mkdir(exist_ok=True)
            entry.write_text(file["content"])
        results = {}
        def checked(argv, scope, timeout=600):
            directory = accepted.parent / scope
            directory.mkdir()
            proof = directory / "native.json"
            argv = argv + ["--proof", str(proof)]
            started = datetime.datetime.now(datetime.timezone.utc).isoformat()
            child = subprocess.Popen(argv, cwd=source_root, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                     start_new_session=True, env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"))
            cleanup = "owned verifier and isolated lab children completed and were reaped"
            try:
                stdout, stderr = child.communicate(timeout=timeout)
            except BaseException:
                cleanup = "owned verifier interrupted and process group reaped"
                for sig, seconds in [(signal.SIGINT, 10), (signal.SIGTERM, 25), (signal.SIGKILL, 3)]:
                    try:
                        os.killpg(child.pid, sig)
                    except ProcessLookupError:
                        pass
                    try:
                        child.communicate(timeout=seconds)
                        break
                    except subprocess.TimeoutExpired:
                        continue
                raise
            finally:
                record = {"parentTaskId": "network-diagnostics-site-export", "parentPID": os.getpid(),
                          "command": argv, "cwd": str(source_root), "pid": child.pid, "startTime": started,
                          "endTime": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                          "exitCode": child.returncode, "timeoutSeconds": timeout,
                          "childProcessGroupCleanup": cleanup}
                proof.with_suffix(".wrapper-processes.jsonl").write_text(json.dumps(record) + "\n")
            proof.with_suffix(".stdout").write_bytes(stdout)
            proof.with_suffix(".stderr").write_bytes(stderr)
            sys.stdout.buffer.write(stdout)
            sys.stderr.buffer.write(stderr)
            assert child.returncode == 0, (scope, "Actual exported program verification failed")
            return proof, json.loads(proof.read_text())
        argv = [sys.executable, "-B", str(source_root / "test/verify_diagnostics_five.py"), "--exported-source"]
        proof, result = checked(argv, "original")
        assert result["accepted"] and result["actualProfiles"] == 35
        assert result["sourceFiles"] == expected_hashes
        results["original"] = {"proof": str(proof), "sha256": digest(proof.read_bytes()), "profiles": 35}
        argv = [sys.executable, "-B", str(root / "test/network-diagnostics-five-edited-native.py"),
                "--source-root", str(source_root), "--edited-root", str(work / "edited")]
        proof, result = checked(argv, "edited")
        assert result["accepted"] and result["actualProfiles"] == 10
        assert result["actualBrowserTaskEditsExecuted"] == 10
        results["edited"] = {"proof": str(proof), "sha256": digest(proof.read_bytes()), "profiles": 10}
    assert not Path(temporary).exists()
    accepted.write_text(json.dumps({
        "accepted": True, "sourceRevision": verifier["revision"], "browserProfiles": len(profiles),
        "sourceArchivesSha256": archives, "browserExportMemberComparisons": comparisons,
        "sourceFiles": expected_hashes, "native": results, "actualNativeProfiles": 45,
        "actualBrowserTaskEditsExecuted": 10, "temporaryExportTreeRemoved": True,
        "allViewportExportsByteVerified": True
    }, indent=2) + "\n")


if __name__ == "__main__":
    main()
