"""Verify exact source bytes and execute every actual exported neuron ZIP."""
from pathlib import Path, PurePosixPath
import datetime
import hashlib
import json
import math
import os
import signal
import subprocess
import sys
import tempfile
import zipfile

root = Path(sys.argv[1])
fixture = json.loads(Path("test/fixtures/machine-learning-neuron-sources.json").read_text())
assert len(fixture["projects"]) == 2 and len(fixture["files"]) == 8
records, profiles = [], []
log_path = root / "native-processes.jsonl"


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def execute(script):
    args = [sys.executable, "-I", "-B", str(script)]
    event = dict(parentTask=os.environ.get("CLASSES_FAMILY_TASK_ID", "neuron-export-check"),
                 parentPid=os.getpid(), command=args, cwd="/", timeoutSeconds=15,
                 startTime=now())
    process = subprocess.Popen(args, cwd="/", stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               text=True, start_new_session=True)
    event["pid"] = process.pid
    with log_path.open("a") as log:
        log.write(json.dumps(dict(event, event="start")) + "\n")
    cleanup = "not needed"
    try:
        stdout, stderr = process.communicate(timeout=15)
        return process.returncode, stdout, stderr
    except BaseException:
        if process.poll() is None:
            os.killpg(process.pid, signal.SIGTERM)
            try:
                process.communicate(timeout=2)
            except subprocess.TimeoutExpired:
                os.killpg(process.pid, signal.SIGKILL)
                process.communicate()
        cleanup = "terminated and reaped"
        raise
    finally:
        with log_path.open("a") as log:
            log.write(json.dumps(dict(event, event="end", endTime=now(),
                                      exitCode=process.returncode,
                                      childProcessGroupCleanup=cleanup)) + "\n")


for source in fixture["files"].values():
    raw = source["content"].encode()
    assert len(raw) == source["byteLength"]
    assert hashlib.sha256(raw).hexdigest() == source["sha256"]
    assert hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest() == source["gitBlob"]

for project in fixture["projects"]:
    directory = root / project["caseId"]
    course_path = directory / ("data-" + project["caseId"] + "-course-proof.json")
    course = json.loads(course_path.read_text())
    assert len(course["profiles"]) == 4
    assert {(row["role"], row["width"]) for row in course["profiles"]} == {
        ("starter", 390), ("starter", 1280), ("solution", 390), ("solution", 1280)}
    for row in course["profiles"]:
        assert row["revision"] == fixture["revision"]
        assert row["lessonEvidence"]["completeAssignmentText"]
        assert row["lessonEvidence"]["completeCoreReadingText"]
        assert row["editingEvidence"]["completedAlgorithmExecuted"]
        assert row["editingEvidence"]["initialExerciseErrorObserved"] == (row["role"] == "starter")
        profiles.append(dict(project=project["caseId"], role=row["role"], width=row["width"],
                             completeCoreReadingText=True, completeAssignmentText=True))

    archives = sorted(directory.glob("*.zip"))
    assert len(archives) == 8
    for archive in archives:
        role = archive.name.split("-")[0]
        assert role in {"starter", "solution"}
        edited = archive.name.endswith("-edited.zip")
        expected_root = project["sources"][role]
        expected = {name.removeprefix(expected_root + "/"): value
                    for name, value in fixture["files"].items()
                    if name.startswith(expected_root + "/")}
        assert set(expected) == {"main.py", "README.md"}
        marker = "ML workflow verified: " + project["caseId"]
        with tempfile.TemporaryDirectory(prefix="neuron-export-") as temporary:
            target = Path(temporary)
            with zipfile.ZipFile(archive) as bundle:
                names = bundle.namelist()
                assert names and len(names) == len(set(names))
                assert sum(item.file_size for item in bundle.infolist()) < 1024 * 1024
                assert all(not PurePosixPath(name).is_absolute() and ".." not in PurePosixPath(name).parts
                           and "\\" not in name for name in names)
                roots = {PurePosixPath(name).parts[0] for name in names}
                assert len(roots) == 1 and all(len(PurePosixPath(name).parts) > 1 for name in names)
                assert all((item.external_attr >> 16) & 0o170000 != 0o120000 for item in bundle.infolist())
                bundle.extractall(target)
                target = target / next(iter(roots))
            actual = {p.relative_to(target).as_posix(): p.read_bytes()
                      for p in target.rglob("*") if p.is_file()}
            assert set(actual) == set(expected)
            for name, value in actual.items():
                wanted = expected[name]["content"]
                if edited and name == "main.py":
                    wanted = fixture["files"][project["sources"]["solution"] + "/main.py"]["content"]
                    wanted = wanted.replace("\r\n", "\n").replace("\r", "\n")
                    wanted += "\nprint(" + json.dumps(marker) + ")\n"
                assert value == wanted.encode(), (archive.name, name)

            code, stdout, stderr = execute(target / "main.py")
            stopped = role == "starter" and not edited
            if stopped:
                assert code != 0 and "NotImplementedError" in stderr and not stdout
            else:
                assert code == 0 and not stderr, (archive.name, stderr)
                lines = stdout.strip().splitlines()
                if edited:
                    assert lines.pop() == marker
                values = [float(value) for value in lines]
                assert len(values) == len(project["nativeExpectedValues"])
                assert all(math.isclose(actual, expected, abs_tol=1e-12, rel_tol=0)
                           for actual, expected in zip(values, project["nativeExpectedValues"]))
            records.append(dict(project=project["caseId"], archive=archive.name, sourceRole=role,
                                edited=edited, sha256=hashlib.sha256(archive.read_bytes()).hexdigest(),
                                nativeExecuted=True, intentionalStarterStop=stopped, exitCode=code,
                                stdout=stdout))

proof = dict(accepted=True, source=fixture["revision"], projects=2, courseProfiles=len(profiles),
             completeCoreReadingProfiles=len(profiles), archives=len(records), nativeExecutions=len(records),
             successfulCompletedExecutions=sum(not row["intentionalStarterStop"] for row in records),
             intentionalStarterStops=sum(row["intentionalStarterStop"] for row in records),
             profiles=profiles, records=records)
assert proof["courseProfiles"] == 8 and proof["archives"] == proof["nativeExecutions"] == 16
assert proof["successfulCompletedExecutions"] == 12 and proof["intentionalStarterStops"] == 4
(root / "native-exports.json").write_text(json.dumps(proof, indent=2) + "\n")
print(json.dumps({k: proof[k] for k in ["accepted", "projects", "courseProfiles", "archives",
                                      "nativeExecutions", "intentionalStarterStops"]}))
