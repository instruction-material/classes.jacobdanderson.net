"""Run the accepted inventory verifier against actual browser-exported optional roles."""
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

# Resolve the sibling verifier by its trusted source path, including python -I.
import importlib.util

_receipt_spec = importlib.util.spec_from_file_location(
    "network_export_receipts", Path(__file__).resolve().with_name("network_export_receipts.py"))
_receipts = importlib.util.module_from_spec(_receipt_spec)
_receipt_spec.loader.exec_module(_receipts)
export_profile, read_export = _receipts.export_profile, _receipts.read_export


def main():
    root = Path(__file__).resolve().parents[1]
    output = Path(sys.argv[1]).resolve()
    browser = json.loads((output / "network-browser-proof.json").read_text())
    fixtures = json.loads((root / "test/fixtures/network-inventory-contracts.json").read_text())
    verifier_source = json.loads((root / "test/fixtures/network-inventory-source-verifier.json").read_text())
    assert {fixture["revision"] for fixture in fixtures} == {verifier_source["revision"]}
    assert hashlib.sha256(verifier_source["content"].encode()).hexdigest() == verifier_source["sha256"]
    proof = output / "inventory-native/network-inventory-native.json"
    proof.parent.mkdir(parents=True, exist_ok=True)
    comparisons, exports = 0, {}
    with tempfile.TemporaryDirectory(prefix="network-inventory-site-export-") as temporary:
        work = Path(temporary)
        for fixture in fixtures:
            pack = fixture["pack"]
            for role in ["starter", "solution"]:
                profile = export_profile(browser, fixture, role, 390)
                filename, raw = read_export(output, profile, "exact")
                exports[pack + "/" + role] = hashlib.sha256(raw).hexdigest()
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
        verifier = work / verifier_source["path"]
        verifier.parent.mkdir()
        verifier.write_text(verifier_source["content"])
        argv = [sys.executable, str(verifier), "--proof", str(proof)]
        started = datetime.datetime.now(datetime.UTC).isoformat()
        child = subprocess.Popen(argv, cwd=work, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                 start_new_session=True, env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"))
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
            record = {"parentTaskId": "network-inventory-site-export", "command": argv,
                      "cwd": str(work), "pid": child.pid, "startTime": started,
                      "endTime": datetime.datetime.now(datetime.UTC).isoformat(),
                      "exitCode": child.returncode, "timeoutSeconds": 720,
                      "childProcessGroupCleanup": cleanup}
            proof.with_suffix(".wrapper-processes.jsonl").write_text(json.dumps(record) + "\n")
        sys.stdout.buffer.write(stdout)
        sys.stderr.buffer.write(stderr)
        assert child.returncode == 0, "Actual exported inventory verification failed"
        result = json.loads(proof.read_text())
        expected_hashes = {
            fixture["mode"]: {name: file["sha256"] for name, file in fixture["files"].items()}
            for fixture in fixtures
        }
        flattened = {fixture["pack"] + "/" + name: file["sha256"]
                     for fixture in fixtures for name, file in fixture["files"].items()}
        assert result["sourceFiles"] == flattened
        assert result["nativeExecuted"] and result["nativeExperiments"] == 10 and result["inputRefusals"] == 8
        for fixture in fixtures:
            for name, file in fixture["files"].items():
                assert hashlib.sha256((work / fixture["pack"] / name).read_bytes()).hexdigest() == file["sha256"]
        result.update(sourceFileHashes=expected_hashes, sourceUnchanged=True)
        result.update(siteExportedFiles=expected_hashes, sourceRevision=verifier_source["revision"],
                      browserExportRoleComparisons=comparisons, sourceArchivesSha256=exports)
        proof.write_text(json.dumps(result, indent=2) + "\n")
    assert not Path(temporary).exists()


if __name__ == "__main__":
    main()
