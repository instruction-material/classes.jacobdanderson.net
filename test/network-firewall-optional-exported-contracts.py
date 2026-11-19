"""Verify all firewall browser exports before real isolated UFW execution."""
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
    fixtures = json.loads((root / "test/fixtures/network-firewall-contracts.json").read_text())
    fixtures += json.loads((root / "test/fixtures/network-firewall-optional-contracts.json").read_text())
    verifier = json.loads((root / "test/fixtures/network-firewall-optional-source-verifiers.json").read_text())
    assert len(fixtures) == 3
    assert {fixture["revision"] for fixture in fixtures} == {verifier["revision"]}
    for file in verifier["files"]:
        assert digest(file["content"].encode()) == file["sha256"]
    browser = json.loads((output / "network-browser-proof.json").read_text())
    profiles = {(row["pack"], row["role"], row["width"]): row for row in browser["profiles"]}
    assert len(profiles) == len(browser["profiles"]) == 12
    accepted = output / "ufw-native/network-firewall-exported-native.json"
    accepted.parent.mkdir(parents=True, exist_ok=True)
    archives, comparisons, expected_hashes = {}, 0, {}
    with tempfile.TemporaryDirectory(prefix="network-firewall-site-export-") as temporary:
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

        assert len(archives) == 24 and comparisons == 144
        assert os.geteuid() == 0 and sys.platform == "linux"
        for file in verifier["files"]:
            path = PurePosixPath(file["path"])
            assert path.parts in [("test", "verify_ufw.py"), ("test", "verify_ufw_optional.py")]
            entry = work / str(path)
            entry.parent.mkdir(exist_ok=True)
            entry.write_text(file["content"])
        results = {}
        for scope, filename in [("optional", "verify_ufw_optional.py"), ("core", "verify_ufw.py")]:
            proof = accepted.parent / scope / "native.json"
            proof.parent.mkdir()
            argv = [sys.executable, "-B", str(work / "test" / filename),
                    "--exported-source", "--proof", str(proof)]
            started = datetime.datetime.now(datetime.timezone.utc).isoformat()
            child = subprocess.Popen(argv, cwd=work, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                     start_new_session=True, env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"))
            cleanup = "owned verifier and isolated lab children completed and were reaped"
            try:
                stdout, stderr = child.communicate(timeout=600)
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
                record = {"parentTaskId": "network-firewall-site-export", "parentPID": os.getpid(),
                          "command": argv, "cwd": str(work), "pid": child.pid, "startTime": started,
                          "endTime": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                          "exitCode": child.returncode, "timeoutSeconds": 600,
                          "childProcessGroupCleanup": cleanup}
                proof.with_suffix(".wrapper-processes.jsonl").write_text(json.dumps(record) + "\n")
            proof.with_suffix(".stdout").write_bytes(stdout)
            proof.with_suffix(".stderr").write_bytes(stderr)
            sys.stdout.buffer.write(stdout)
            sys.stderr.buffer.write(stderr)
            assert child.returncode == 0, (scope, "Actual exported firewall verification failed")
            result = json.loads(proof.read_text())
            assert result["nativeAccepted"] is True
            if scope == "optional":
                actual_hashes = result["sourceFiles"]
                wanted = {name: sha for name, sha in expected_hashes.items()
                          if not name.startswith("NS3-UFW-Web-Server-Policy/")}
                assert result["actualProfiles"] == 11 and result["actualPolicyRollbacks"] == 11
                assert result["actualOverexposureDemonstrated"] and result["wrongProtocolRejected"]
            else:
                actual_hashes = {"NS3-UFW-Web-Server-Policy/" + name: sha
                                 for name, sha in result["sourceHashes"].items()}
                wanted = {name: sha for name, sha in expected_hashes.items()
                          if name.startswith("NS3-UFW-Web-Server-Policy/")}
                assert result["profiles"] == 8 and result["actualPolicyRollbacks"] == 8
            assert actual_hashes == wanted
            results[scope] = {"proof": str(proof), "sha256": digest(proof.read_bytes()),
                              "profiles": len(result["cases"]),
                              "observations": result["actualObservations"]}
    assert not Path(temporary).exists()
    accepted.write_text(json.dumps({
        "accepted": True, "sourceRevision": verifier["revision"], "browserProfiles": len(profiles),
        "sourceArchivesSha256": archives, "browserExportMemberComparisons": comparisons,
        "sourceFiles": expected_hashes, "native": results, "actualNativeProfiles": 19,
        "actualPolicyRollbacks": 19, "temporaryExportTreeRemoved": True,
        "executedCodeEqualsAllExportVariants": True
    }, indent=2) + "\n")


if __name__ == "__main__":
    main()
