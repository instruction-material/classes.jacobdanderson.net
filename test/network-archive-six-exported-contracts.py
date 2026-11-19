"""Check actual IDE archives against pinned course inputs, then run their assessments."""
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
from pathlib import Path, PurePosixPath

# Resolve the sibling verifier by its trusted source path, including python -I.
import importlib.util

_receipt_spec = importlib.util.spec_from_file_location(
    "network_export_receipts", Path(__file__).resolve().with_name("network_export_receipts.py"))
_receipts = importlib.util.module_from_spec(_receipt_spec)
_receipt_spec.loader.exec_module(_receipts)
export_profile, read_export = _receipts.export_profile, _receipts.read_export


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    root = Path(__file__).resolve().parents[1]
    output = Path(sys.argv[1]).resolve()
    fixtures = json.loads((root / "test/fixtures/network-archive-six-contracts.json").read_text())
    assert len(fixtures) == 6 and len({f["revision"] for f in fixtures}) == 1
    browser = json.loads((output / "network-browser-proof.json").read_text())
    profiles = {(p["pack"], p["role"], p["width"]): p for p in browser["profiles"]}
    assert len(profiles) == len(browser["profiles"]) == 24
    proof_path = output / "network-archive-six-exported-assessments.json"
    process_path = output / "network-archive-six-exported-processes.jsonl"
    assert not proof_path.exists() and not process_path.exists(), "Use a fresh output directory"
    proof = {"acceptedWithinStatedScope": False, "sourcePairs": 6, "browserProfiles": 24,
             "archives": {}, "memberComparisons": 0, "actualAssessmentCommands": [],
             "liveKernelExecutionClaimed": False, "notebookCompletionInferred": False,
             "fullCourseSignoff": False, "fullGoalComplete": False}
    try:
        with tempfile.TemporaryDirectory(prefix="network-archive-actual-exports-") as tmp:
            for fixture in fixtures:
                pack = fixture["pack"]
                for file in fixture["files"].values():
                    assert digest(file["content"].encode()) == file["sha256"]
                for role in ["starter", "solution"]:
                    expected = {n: f["content"].encode() for n, f in fixture["files"].items()
                                if n == "README.md" or n.startswith(role + "/")}
                    assert len(expected) == 8
                    for width in [390, 1280]:
                        profile = export_profile(browser, fixture, role, width)
                        assert profile["revision"] == fixture["revision"]
                        assert profile["editedFileName"] == role + "/assessment.json"
                        assert profile["editedSourceSHA256"] == digest(fixture["roleEdits"][role].encode())
                        assert profile["remoteWrites"] == 0 and profile["legacyProjectsPreserved"] > 0
                        assert profile["taskChoiceEdited"]
                        for flag in ["consentBeforeFetch", "primaryStoreRead", "savedEditReopened",
                                     "reopenedSameAttempt", "previousWorkPreserved", "nativeInstructions"]:
                            assert profile[flag] is True, (pack, role, width, flag)
                        assert profile["notebookReusedSameAttempt"] == bool(fixture.get("notebookItemId"))
                        assert profile["capstoneActionsReused"] == len(fixture.get("continuationItems", []))
                        assert {f["name"]: f["sha256"] for f in profile["sourceFiles"]} == {
                            n: digest(content) for n, content in expected.items()}
                        for variant in ["exact", "edited"]:
                            filename, raw = read_export(output, profile, variant)
                            assert digest(raw) == profile[variant + "ArchiveSha256"]
                            proof["archives"][filename] = digest(raw)
                            actual = {}
                            with zipfile.ZipFile(io.BytesIO(raw)) as archive:
                                members = archive.namelist()
                                assert len(members) == len(set(members)) == 8
                                roots = set()
                                for member in members:
                                    p = PurePosixPath(member)
                                    assert not p.is_absolute() and len(p.parts) >= 2
                                    assert ".." not in p.parts and "\\" not in member
                                    roots.add(p.parts[0])
                                    name = str(PurePosixPath(*p.parts[1:]))
                                    assert name not in actual
                                    actual[name] = archive.read(member)
                                assert len(roots) == 1 and set(actual) == set(expected)
                            for name, content in expected.items():
                                if variant == "edited" and name == role + "/assessment.json":
                                    content = fixture["roleEdits"][role].encode()
                                assert actual[name] == content, (filename, name)
                                proof["memberComparisons"] += 1
                            folder = Path(tmp) / filename.removesuffix(".zip")
                            for name, content in actual.items():
                                target = folder / name
                                target.parent.mkdir(parents=True, exist_ok=True)
                                target.write_bytes(content)
                            cwd = folder / role
                            argv = [sys.executable, "-B", "main.py"]
                            started = datetime.datetime.now(datetime.UTC).isoformat()
                            child = subprocess.Popen(argv, cwd=cwd, stdout=subprocess.PIPE,
                                                     stderr=subprocess.PIPE, start_new_session=True)
                            record = {"parentTaskId": os.environ.get("CLASSES_FAMILY_TASK_ID", "network-archive-six-export"),
                                      "parentPid": os.getpid(), "pid": child.pid, "cwd": str(cwd),
                                      "command": argv, "startTime": started, "timeoutSeconds": 10,
                                      "archive": filename}
                            with process_path.open("a") as log:
                                log.write(json.dumps(dict(record, event="start")) + "\n")
                            cleanup = "owned process group completed"
                            try:
                                stdout, stderr = child.communicate(timeout=10)
                            except BaseException:
                                os.killpg(child.pid, signal.SIGTERM)
                                try:
                                    stdout, stderr = child.communicate(timeout=2)
                                except subprocess.TimeoutExpired:
                                    os.killpg(child.pid, signal.SIGKILL)
                                    stdout, stderr = child.communicate()
                                cleanup = "owned process group terminated"
                                raise
                            finally:
                                record.update(endTime=datetime.datetime.now(datetime.UTC).isoformat(),
                                              exitCode=child.returncode, childProcessGroupCleanup=cleanup)
                                with process_path.open("a") as log:
                                    log.write(json.dumps(dict(record, event="end")) + "\n")
                            result = json.loads(stdout)
                            expected_exit = int((role == "starter") == (variant == "exact"))
                            assert child.returncode == expected_exit, (filename, child.returncode, stdout, stderr)
                            assert result["objectiveChecksPassed"] == (expected_exit == 0)
                            assert result["liveNetworkRun"] is False
                            assert result["notebookCompletionInferred"] is False
                            assert result["notebookReviewRequired"] is True
                            record.update(stdout=stdout.decode(), stderr=stderr.decode(),
                                          factualAssessmentAccepted=expected_exit == 0)
                            proof["actualAssessmentCommands"].append(record)
            assert len(proof["archives"]) == 48 and proof["memberComparisons"] == 384
            assert len(proof["actualAssessmentCommands"]) == 48
            proof["acceptedWithinStatedScope"] = True
    finally:
        proof_path.write_text(json.dumps(proof, indent=2) + "\n")
    print(json.dumps({k: v for k, v in proof.items() if k not in ["actualAssessmentCommands", "archives"]}))


if __name__ == "__main__":
    main()
