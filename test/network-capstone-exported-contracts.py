"""Validate actual browser-exported capstone roles with the pinned native verifier."""
import datetime
import hashlib
import io
import json
import os
import signal
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

from network_export_receipts import export_profile, read_export


def main():
    root = Path(__file__).resolve().parents[1]
    output = Path(sys.argv[1]).resolve()
    browser = json.loads((output / "network-browser-proof.json").read_text())
    fixture = json.loads((root / "test/fixtures/network-capstone-contracts.json").read_text())[0]
    pack = fixture["pack"]
    proof = output / "native/network-capstone-native.json"
    proof.parent.mkdir(parents=True, exist_ok=True)
    comparisons = 0
    with tempfile.TemporaryDirectory(prefix="network-capstone-site-export-") as temporary:
        work = Path(temporary)
        for role in ["starter", "solution"]:
            profile = export_profile(browser, fixture, role, 390)
            filename, raw = read_export(output, profile, "exact")
            expected = {name: file for name, file in fixture["files"].items()
                        if name == "README.md" or name.startswith(role + "/")}
            assert len(expected) == 6
            with zipfile.ZipFile(io.BytesIO(raw)) as archive:
                names = archive.namelist()
                assert len(names) == len(set(names)) == 6
                for name, file in expected.items():
                    matches = [value for value in names if value.endswith("/" + name)]
                    assert len(matches) == 1
                    data = archive.read(matches[0])
                    assert data.decode() == file["content"]
                    assert hashlib.sha256(data).hexdigest() == file["sha256"]
                    target = work / pack / name
                    target.parent.mkdir(parents=True, exist_ok=True)
                    if target.exists():
                        assert target.read_bytes() == data
                    else:
                        target.write_bytes(data)
                    comparisons += 1
        verifier = work / "test/verify_capstone.py"
        verifier.parent.mkdir()
        verifier.write_text(fixture["nativeVerification"])
        argv = [sys.executable, str(verifier), "--proof", str(proof)]
        started = datetime.datetime.now(datetime.UTC).isoformat()
        child = subprocess.Popen(argv, cwd=work, stdout=subprocess.PIPE,
                                 stderr=subprocess.PIPE, start_new_session=True,
                                 env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"))
        cleanup = "process exited"
        try:
            stdout, stderr = child.communicate(timeout=720)
        except BaseException:
            cleanup = "owned verifier interrupted and process group reaped"
            os.killpg(child.pid, signal.SIGINT)
            try:
                child.communicate(timeout=15)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid, signal.SIGKILL)
                child.communicate()
            raise
        finally:
            record = {"parentTaskId": "network-capstone-site-export", "command": argv,
                      "cwd": str(work), "pid": child.pid, "startTime": started,
                      "endTime": datetime.datetime.now(datetime.UTC).isoformat(),
                      "exitCode": child.returncode, "timeoutSeconds": 720,
                      "childProcessGroupCleanup": cleanup}
            proof.with_suffix(".wrapper-processes.jsonl").write_text(json.dumps(record) + "\n")
        sys.stdout.buffer.write(stdout)
        sys.stderr.buffer.write(stderr)
        assert child.returncode == 0, "Exported native capstone verification failed"
        result = json.loads(proof.read_text())
        expected_hashes = {name: file["sha256"] for name, file in fixture["files"].items()}
        assert result["sourceFileHashes"] == expected_hashes
        assert result["sourceUnchanged"] and result["temporaryBuildCleanup"]
        result.update(siteExportedFiles=expected_hashes, sourceRevision=fixture["revision"],
                      browserExportRoleComparisons=comparisons)
        proof.write_text(json.dumps(result, indent=2) + "\n")
    assert not Path(temporary).exists()


if __name__ == "__main__":
    main()
