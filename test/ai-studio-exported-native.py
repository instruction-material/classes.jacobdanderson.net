"""Verify exact AI source exports with native Python, independently of the browser."""
import argparse
import datetime
import hashlib
import itertools
import json
import os
from pathlib import Path
import signal
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = json.loads((ROOT / "test/fixtures/ai-studio-sources.json").read_text())
EXPECTED = {
    "search-13": "['A', 'C', 'E']", "search-14": "cutoff",
    "search-15": "9", "search-16": "4", "search-17": "4",
    "tic-tac-toe": "1", "marble-game": "3",
}


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def utc():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def execute(directory, out, label, stdin=""):
    args = ["python3", "-B", "main.py"]
    started = utc()
    child = subprocess.Popen(args, cwd=directory, stdin=subprocess.PIPE,
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                             start_new_session=True, text=True)
    cleanup = "not needed"
    try:
        stdout, stderr = child.communicate(stdin, timeout=15)
    except BaseException:
        cleanup = "process group terminated"
        os.killpg(child.pid, signal.SIGTERM)
        try:
            stdout, stderr = child.communicate(timeout=2)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            stdout, stderr = child.communicate()
        raise
    finally:
        record = dict(parentTask=os.environ.get("CLASSES_FAMILY_TASK_ID", "ai-studio-native"),
                      parentPid=os.getpid(), cwd=str(directory), command=args,
                      pid=child.pid, startTime=started, endTime=utc(), exitCode=child.returncode,
                      timeoutSeconds=15, childProcessGroupCleanup=cleanup)
        with (out / "processes.jsonl").open("a") as stream:
            stream.write(json.dumps(record) + "\n")
    result = dict(label=label, **record, stdout=stdout, stderr=stderr)
    (out / (label + ".json")).write_text(json.dumps(result, indent=2) + "\n")
    return result


def unpack(archive, target, expected_names):
    with zipfile.ZipFile(archive) as bundle:
        names = bundle.namelist()
        assert len(names) == len(expected_names), names
        assert {Path(name).name for name in names} == expected_names
        files = {}
        for name in names:
            assert not Path(name).is_absolute() and ".." not in Path(name).parts
            raw = bundle.read(name)
            basename = Path(name).name
            (target / basename).write_bytes(raw)
            files[basename] = raw
    return files


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--browser", required=True, type=Path)
    parser.add_argument("--source", type=Path)
    parser.add_argument("--proof", required=True, type=Path)
    args = parser.parse_args()
    out = args.proof.parent
    out.mkdir(parents=True, exist_ok=True)
    if args.source:
        head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=args.source, text=True).strip()
        assert head == FIXTURE["revision"]
        for path, file in FIXTURE["files"].items():
            raw = (args.source / path).read_bytes()
            assert sha(raw) == file["sha256"] and raw.decode() == file["content"], path
    results = []
    projects = FIXTURE["projects"] + FIXTURE["optionalProjects"]
    for project in projects:
        directory = args.browser / project["key"]
        proof = json.loads((directory / ("data-ai-" + project["key"] + "-course-proof.json")).read_text())
        profiles = proof["profiles"]
        assert len(profiles) == 4
        widths = {profile["width"] for profile in profiles}
        assert len(widths) == 2 and min(widths) < 900 <= max(widths)
        assert {(p["role"], p["width"]) for p in profiles} == set(itertools.product(("starter", "solution"), widths))
        for profile in profiles:
            role, width = profile["role"], profile["width"]
            label = project["key"] + "-" + role + "-" + str(width)
            assert profile["revision"] == FIXTURE["revision"]
            for flag in ("consentBeforeFetch", "primaryStoreRead", "codeAndTraceSaved", "sameAttemptReused", "previousWorkPreserved"):
                assert profile[flag] is True, (label, flag)
            assert profile["remoteWrites"] == 0 and profile["additionalSourceRequests"] == 0
            assert profile["lessonEvidence"]["completeWorkedReading"] is True
            assert profile["editingEvidence"]["editedAlgorithmExecuted"] is True
            assert profile["continuationActions"]
            reading = json.loads((directory / ("reading-" + role + "-" + str(width) + ".json")).read_text())
            assert reading["expected"] == reading["actual"]["text"]
            assert not reading["actual"]["overflow"]
            for kind in ("exact", "edited"):
                archive = directory / profile[kind + "Archive"]
                assert sha(archive.read_bytes()) == profile[kind + "ArchiveSha256"]
                with tempfile.TemporaryDirectory(prefix="ai-studio-export-") as name:
                    target = Path(name)
                    expected_names = {Path(path).name for path in FIXTURE["files"] if path.startswith(project["folder"] + "/" + role + "/")}
                    files = unpack(archive, target, expected_names)
                    if kind == "exact":
                        for basename, raw in files.items():
                            expected = FIXTURE["files"][project["folder"] + "/" + role + "/" + basename]
                            assert sha(raw) == expected["sha256"] and raw.decode() == expected["content"]
                    else:
                        reference = FIXTURE["files"][project["folder"] + "/solution/main.py"]["content"]
                        prefix = reference.split('if __name__ == "__main__":\n')[0]
                        assert files["main.py"].decode().startswith(prefix)
                        for basename, raw in files.items():
                            if basename == "main.py":
                                continue
                            expected = FIXTURE["files"][project["folder"] + "/" + role + "/" + basename]
                            assert sha(raw) == expected["sha256"]
                    stdin = "bad\n1\n2\n3\n4\n5\n6\n7\n8\n9\n" if project["key"] == "tic-tac-toe" else "bad\n0\n4\n1\n2\n3\n"
                    result = execute(target, out, label + "-" + kind, stdin)
                    if kind == "exact" and role == "starter":
                        assert result["exitCode"] != 0 and "NotImplementedError" in result["stderr"], result
                    else:
                        assert result["exitCode"] == 0 and "Traceback" not in result["stderr"], result
                        if kind == "edited":
                            expected_output = project["expectedEditedOutput"] if project.get("kind") == "optional" else "Studio result: " + EXPECTED[project["key"]]
                            assert result["stdout"].strip() == expected_output, result
                        elif project.get("kind") == "optional":
                            assert result["stdout"].strip() == project["originalOutput"], result
                        elif project["key"] in ("tic-tac-toe", "marble-game"):
                            assert "Winner:" in result["stdout"], result
                    results.append(dict(project=project["key"], role=role, width=width, kind=kind,
                                        archiveSha256=sha(archive.read_bytes()), exitCode=result["exitCode"],
                                        stdout=result["stdout"], stderr=result["stderr"]))
    expected_count = len(projects) * 8
    assert len(results) == expected_count
    args.proof.write_text(json.dumps(dict(source=FIXTURE["revision"], actualArchives=expected_count,
                                          nativeExecutions=results), indent=2) + "\n")
    print(f"Verified {expected_count} actual AI ZIP exports, including {expected_count // 2} edited native executions.")


if __name__ == "__main__":
    main()
