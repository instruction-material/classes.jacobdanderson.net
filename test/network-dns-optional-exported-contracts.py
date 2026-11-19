"""Verify every browser DNS export, then exercise its exact programs on Linux."""
import datetime
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath

from network_export_receipts import export_profile, read_export
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
    fixtures = json.loads((root / "test/fixtures/network-dns-optional-contracts.json").read_text())
    verifier = json.loads((root / "test/fixtures/network-dns-optional-source-verifier.json").read_text())
    assert len(fixtures) == 2
    assert {fixture["revision"] for fixture in fixtures} == {verifier["revision"]}
    assert digest(verifier["content"].encode()) == verifier["sha256"]
    browser = json.loads((output / "network-browser-proof.json").read_text())
    profiles = {(row["pack"], row["role"], row["width"]): row for row in browser["profiles"]}
    assert len(profiles) == len(browser["profiles"]) == 8
    accepted = output / "dns-native/network-dns-optional-native.json"
    accepted.parent.mkdir(parents=True, exist_ok=True)
    archives, comparisons, expected_hashes = {}, 0, {}
    with tempfile.TemporaryDirectory(prefix="network-dns-site-export-") as temporary:
        work = Path(temporary)
        for fixture in fixtures:
            pack = fixture["pack"]
            for name, file in fixture["files"].items():
                assert digest(file["content"].encode()) == file["sha256"]
                expected_hashes[pack + "/" + name] = file["sha256"]
            for role in ["starter", "solution"]:
                expected = {name: file for name, file in fixture["files"].items()
                            if name == "README.md" or name.startswith(role + "/")}
                assert len(expected) == 5
                for width in [390, 1280]:
                    profile = export_profile(browser, fixture, role, width)
                    assert profile["revision"] == verifier["revision"]
                    for field in ["consentBeforeFetch", "savedEditReopened", "primaryStoreRead",
                                  "reopenedSameAttempt", "previousWorkPreserved", "nativeInstructions"]:
                        assert profile[field] is True, (pack, role, width, field)
                    for variant in ["exact", "edited"]:
                        filename, raw = read_export(output, profile, variant)
                        assert digest(raw) == profile[variant + "ArchiveSha256"]
                        archives[filename] = digest(raw)
                        with zipfile.ZipFile(io.BytesIO(raw)) as archive:
                            names = archive.namelist()
                            assert len(names) == len(set(names)) == 5
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
                                if variant == "edited" and name == role + "/network-notes.md":
                                    content += f"\nIndependent network observation {width}\n"
                                assert actual[name] == content.encode(), (filename, name)
                                comparisons += 1
                                if width == 390 and variant == "exact":
                                    target = work / pack / name
                                    target.parent.mkdir(parents=True, exist_ok=True)
                                    if target.exists():
                                        assert target.read_bytes() == actual[name]
                                    else:
                                        target.write_bytes(actual[name])
        assert len(archives) == 16 and comparisons == 80
        path = PurePosixPath(verifier["path"])
        assert path.parts == ("test", "verify_dns_optional.py")
        entry = work / str(path)
        entry.parent.mkdir()
        entry.write_text(verifier["content"])
        argv = [sys.executable, "-I", "-B", str(entry), "--proof", str(accepted)]
        started = datetime.datetime.now(datetime.timezone.utc).isoformat()
        child = subprocess.Popen(argv, cwd=work, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                 start_new_session=True,
                                 env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"))
        cleanup = "owned verifier and its children completed and were reaped"
        try:
            stdout, stderr = child.communicate(timeout=180)
        except BaseException:
            cleanup = "owned verifier group interrupted, terminated and reaped"
            for sig, deadline in [(signal.SIGINT, 5), (signal.SIGTERM, 3), (signal.SIGKILL, 3)]:
                try:
                    os.killpg(child.pid, sig)
                except ProcessLookupError:
                    pass
                try:
                    child.communicate(timeout=deadline)
                    break
                except subprocess.TimeoutExpired:
                    continue
            raise
        finally:
            record = {"parentTaskId": "network-dns-optional-site-export", "parentPID": os.getpid(),
                      "command": argv, "cwd": str(work), "pid": child.pid, "startTime": started,
                      "endTime": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                      "exitCode": child.returncode, "timeoutSeconds": 180,
                      "childProcessGroupCleanup": cleanup}
            accepted.with_suffix(".wrapper-processes.jsonl").write_text(json.dumps(record) + "\n")
        accepted.with_suffix(".stdout").write_bytes(stdout)
        accepted.with_suffix(".stderr").write_bytes(stderr)
        sys.stdout.buffer.write(stdout)
        sys.stderr.buffer.write(stderr)
        assert child.returncode == 0, "Actual exported DNS program verification failed"
        result = json.loads(accepted.read_text())
        assert result["accepted"] is True and len(result["profiles"]) == 9
        assert result["independentWireComparisons"] == 12
        assert result["sourceFiles"] == expected_hashes
        assert result["resolver"]["reaped"] and result["resolver"]["pidAbsent"]
        assert result["actualInterruption"]["liveChildConfirmed"]
        assert result["actualInterruption"]["childReaped"]
        result.update(sourceRevision=verifier["revision"], sourceArchivesSha256=archives,
                      browserExportMemberComparisons=comparisons, browserProfiles=len(profiles),
                      uniqueExportedSourceFiles=len(expected_hashes),
                      executedCodeEqualsAllExportVariants=True)
    assert not Path(temporary).exists()
    result["temporaryExportTreeRemoved"] = True
    accepted.write_text(json.dumps(result, indent=2) + "\n")


if __name__ == "__main__":
    main()
