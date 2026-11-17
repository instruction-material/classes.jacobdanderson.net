"""Execute actual course-exported clustering files with independent invariants."""
import hashlib
import json
import math
import os
from pathlib import Path, PurePosixPath
import signal
import struct
import subprocess
import sys
import tempfile
import time
import zipfile

fixture = json.loads(Path("test/fixtures/machine-learning-legacy-clustering-sources.json").read_text())

if sys.argv[1] == "--write-locks":
    directory = Path(sys.argv[2])
    directory.mkdir(parents=True, exist_ok=True)
    verification = fixture["verificationRequirements"]
    assert hashlib.sha256(verification["content"].encode()).hexdigest() == verification["sha256"]
    (directory / "verification.txt").write_text(verification["content"])
    locks = {row["content"] for name, row in fixture["files"].items() if name.endswith("/requirements.txt")}
    assert len(locks) == 1
    (directory / "runtime.txt").write_text(locks.pop())
    sys.exit(0)

root = Path(sys.argv[1]).resolve()
selected = list(filter(None, os.environ.get("ML_LEGACY_PROJECTS", "").split(",")))
assert all(value in {row["caseId"] for row in fixture["projects"]} for value in selected)
projects = [row for row in fixture["projects"] if not selected or row["caseId"] in selected]
assert projects
records = []


def digest(data):
    return hashlib.sha256(data).hexdigest()


def check_report(report, project):
    assert report["rows"] == project["rows"]
    runs = report["runs"]
    assert len(runs) == 6
    assert {(row["k"], row["seed"]) for row in runs} == {
        (k, seed) for k in ((2, 3) if project["kind"] == "iris" else (3, 5))
        for seed in (7, 19, 31)
    }
    for row in runs:
        assert math.isfinite(row["inertia"]) and row["inertia"] >= 0
        assert row["silhouette"] is None or -1 <= row["silhouette"] <= 1
        if project["kind"] == "customer":
            assert len(row["labels"]) == project["rows"]
            assert row["iterations"] <= row["max_iter"] == 300
            assert row["manual_n_init"] == 1 and row["library_n_init"] == 10
            assert row["empty_cluster_repairs"] >= 0
        else:
            assert row["n_init"] == 10 and row["max_iter"] == 300
    assert report["displayed_seed"] in (7, 19, 31)
    if project["kind"] == "iris":
        assert report["species_labels_used_for_fitting"] is False


def execute(main, output, log):
    args = [sys.executable, "-I", "-B", str(main), "--output-dir", str(output)]
    started = time.time()
    child = subprocess.Popen(args, cwd=output, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, start_new_session=True)
    entry = dict(parentTask=os.environ.get("CLASSES_FAMILY_TASK_ID", "ml-clustering-export-contracts"),
                 parentPid=os.getpid(), command=args, cwd=str(output), pid=child.pid,
                 startTime=started, timeoutSeconds=60)
    with log.open("a") as stream:
        stream.write(json.dumps(dict(entry, event="start")) + "\n")
    cleanup = "not needed"
    try:
        stdout, stderr = child.communicate(timeout=60)
    except BaseException:
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.communicate(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.communicate()
        cleanup = "process group terminated after timeout or cancellation"
        raise
    finally:
        with log.open("a") as stream:
            stream.write(json.dumps(dict(entry, event="end", endTime=time.time(),
                                        exitCode=child.returncode, childProcessGroupCleanup=cleanup)) + "\n")
    return child.returncode, stdout.decode(), stderr.decode()


for project in projects:
    directory = root / project["caseId"]
    proof = json.loads((directory / ("data-" + project["caseId"] + "-course-proof.json")).read_text())
    profiles = proof["profiles"]
    assert {(row["role"], row["width"]) for row in profiles} == {
        (role, width) for role in ("starter", "solution") for width in (390, 1280)
    }
    for profile in profiles:
        assert profile["revision"] == fixture["revision"]
        assert all(profile[key] for key in ["consentBeforeFetch", "primaryStoreRead", "sameAttemptReused", "previousWorkPreserved"])
        assert profile["additionalSourceRequests"] == profile["remoteWrites"] == 0
        for edited in (False, True):
            archive = directory / profile["editedArchive" if edited else "exactArchive"]
            assert digest(archive.read_bytes()) == profile["editedArchiveSha256" if edited else "exactArchiveSha256"]
            role = profile["role"]
            expected = {name.removeprefix(project["sources"][role] + "/"): value
                        for name, value in fixture["files"].items()
                        if name.startswith(project["sources"][role] + "/")}
            with tempfile.TemporaryDirectory(prefix="ml-clustering-export-") as temp:
                temp = Path(temp)
                with zipfile.ZipFile(archive) as z:
                    paths = [PurePosixPath(name) for name in z.namelist()]
                    assert len(paths) == len(set(paths))
                    assert all(not path.is_absolute() and ".." not in path.parts and len(path.parts) > 1 for path in paths)
                    roots = {path.parts[0] for path in paths}
                    assert len(roots) == 1
                    assert all((z.getinfo(name).external_attr >> 16) & 0o170000 != 0o120000 for name in z.namelist())
                    z.extractall(temp)
                source = temp / roots.pop()
                names = {path.relative_to(source).as_posix() for path in source.rglob("*") if path.is_file()}
                assert names == set(expected) | ({"clustering-report.json"} if edited else set()), (archive, names)
                for name, value in expected.items():
                    if name != "main.py" or not edited:
                        assert digest((source / name).read_bytes()) == value["sha256"], (archive, name)
                if edited:
                    reference = fixture["files"][project["sources"]["solution"] + "/main.py"]["content"].replace("\r\n", "\n").replace("\r", "\n")
                    assert (source / "main.py").read_text().startswith(reference)
                    check_report(json.loads((source / "clustering-report.json").read_text()), project)
                before = {name: digest((source / name).read_bytes()) for name in expected}
                output = temp / "fresh-output"
                output.mkdir()
                code, stdout, stderr = execute(source / "main.py", output, root / "native-processes.jsonl")
                unfinished = role == "starter" and project["exercise"] and not edited
                if unfinished:
                    assert code != 0 and "NotImplementedError: Complete " + project["exercise"] in stderr
                else:
                    assert code == 0 and not stderr, (archive, stderr)
                    check_report(json.loads((output / "clustering-report.json").read_text()), project)
                    if edited:
                        assert "ML workflow verified: " + project["caseId"] in stdout
                    for name in ("before_clustering.png", "clustered_graph.png"):
                        data = (output / name).read_bytes()
                        assert data[:8] == bytes.fromhex("89504e470d0a1a0a")
                        assert all(value > 100 for value in struct.unpack(">II", data[16:24]))
                assert {name: digest((source / name).read_bytes()) for name in expected} == before
                records.append(dict(project=project["caseId"], archive=archive.name, sha256=digest(archive.read_bytes()),
                                    sourceRole=role, width=profile["width"], edited=edited, executed=True,
                                    completed=not bool(unfinished), intentionalExercise=project["exercise"] if unfinished else None,
                                    exactInputsUnchanged=True))
    assert len([row for row in records if row["project"] == project["caseId"]]) == 8

proof = dict(source=fixture["revision"], projects=len(projects), archives=len(records), nativeExecutions=len(records),
             successfulCompletedExecutions=sum(row["completed"] for row in records),
             intentionalStarterStops=sum(not row["completed"] for row in records), records=records, accepted=True)
(root / "native-exports.json").write_text(json.dumps(proof, indent=2) + "\n")
print(json.dumps({key: value for key, value in proof.items() if key != "records"}))
