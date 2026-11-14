"""Inspect an immutable retained native UI result; never build or rerun tests."""
import hashlib
import json
import os
import re
import signal
import subprocess
import zipfile
from argparse import ArgumentParser
from datetime import UTC, datetime
from pathlib import Path


def select_failed_result(bundle):
    """Select one failed profile from a known, immutable native course archive."""
    names = bundle.namelist()
    assert len(names) == len(set(names)), "Duplicate archive members"
    courses = {"tracker", "swiftdata", "gallery", "hobby", "map", "capstone"}
    proofs = [course + "/proof.json" for course in courses
              if course + "/proof.json" in names]
    if "proof.json" in names:
        proofs.append("proof.json")
    assert len(proofs) == 1, "One known course proof is required"
    proof_path = proofs[0]
    course = "welcome" if proof_path == "proof.json" else proof_path.split("/")[0]
    proof = json.loads(bundle.read(proof_path))
    if course == "welcome":
        assert proof.get("course") == "welcome", "Known Welcome proof required"
    failures = [profile for profile in proof["simulatorTests"]
                if not profile["passed"]]
    assert len(failures) == 1, "One original failed profile is required"
    failure = failures[0]
    assert failure["role"] in {"starter", "solution"}
    assert failure["size"] in {"small", "large"}
    variants = {"standard", "long-note"} if course == "welcome" else {"standard", "largest-text"}
    assert failure["variant"] in variants
    profile = "-".join(failure[key] for key in ("role", "size", "variant"))
    prefix = "" if course == "welcome" else course + "/"
    result = prefix + "results/" + profile + ".xcresult"
    selected = [name for name in names
                if name == proof_path or name.startswith(result + "/")]
    assert any(name.startswith(result + "/") for name in selected)
    return {
        "course": course,
        "proof": proof_path,
        "result": result,
        "selected": selected,
        "failure": failure,
        "testId": ("TrackerUITests/testTrackerWorkflow()" if course in {"tracker", "swiftdata"}
                   else "WelcomeProfileUITests/testProfileNavigationAndState()" if course == "welcome"
                   else "CanonicalCourseUITests/testCourseWorkflow()"),
    }



def select_failed_producer(repository, run, artifact, jobs):
    """Bind one immutable upload to its completed failed job, including earlier attempts."""
    names = {
        "swift-welcome-ios": ("welcome", "swift-ios"),
        "swift-tracker-ui-tracker": ("tracker", "swift-tracker-ui (tracker)"),
        "swift-tracker-ui-swiftdata": ("swiftdata", "swift-tracker-ui (swiftdata)"),
        **{"swift-canonical-" + course + "-ios":
           (course, "swift-canonical-ios (" + course + ")")
           for course in ["gallery", "hobby", "map", "capstone"]},
    }
    assert repository in {
        "anderson-webops/classes.jacobdanderson.net",
        "instruction-material/classes.jacobdanderson.net",
    }
    assert run["repository"]["full_name"] == repository
    assert run["path"] == ".github/workflows/ci.yml"
    assert run["status"] in {"queued", "in_progress", "completed"}
    if run["status"] == "completed":
        assert run["conclusion"] in {"failure", "cancelled", "timed_out", "action_required"}
    assert re.fullmatch(r"[0-9a-f]{40}", run["head_sha"])
    origin = artifact["workflow_run"]
    assert origin["id"] == run["id"] and origin["head_sha"] == run["head_sha"]
    assert origin["repository_id"] == origin["head_repository_id"] == run["repository"]["id"]
    assert not artifact["expired"] and artifact["name"] in names
    assert re.fullmatch(r"sha256:[0-9a-f]{64}", artifact["digest"])
    course, expected_name = names[artifact["name"]]
    uploaded = datetime.fromisoformat(artifact["created_at"].replace("Z", "+00:00"))
    candidates = []
    for job in jobs:
        if job["name"] != expected_name or job["status"] != "completed":
            continue
        if job["conclusion"] not in {"failure", "timed_out"}:
            continue
        if job["run_id"] != run["id"]:
            continue
        if job["head_sha"] != run["head_sha"]:
            continue
        started = datetime.fromisoformat(job["started_at"].replace("Z", "+00:00"))
        ended = datetime.fromisoformat(job["completed_at"].replace("Z", "+00:00"))
        if started <= uploaded <= ended:
            candidates.append(job)
    assert len(candidates) == 1, "One completed failed uploader job is required"
    assert isinstance(candidates[0]["id"], int) and candidates[0]["id"] > 0
    return {"course": course, "job": candidates[0]}


def verify_failed_upload(log, artifact):
    """Check the original uploader's immutable artifact ID and provider digest."""
    assert re.search(r"\bArtifact ID(?::\s*|\s+(?:is\s+)?)" + str(artifact["id"]) + r"\b", log)
    digest = artifact["digest"].removeprefix("sha256:")
    assert "SHA256 digest of uploaded artifact is " + digest in log


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--artifact-id", required=True)
    parser.add_argument("--sha256", required=True)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    for value in [args.run_id, args.artifact_id]:
        assert re.fullmatch(r"[1-9][0-9]{0,19}", value), "Positive provider ID required"
    assert re.fullmatch(r"[0-9a-f]{64}", args.sha256)
    repository = os.environ["GITHUB_REPOSITORY"]
    assert repository in {
        "anderson-webops/classes.jacobdanderson.net",
        "instruction-material/classes.jacobdanderson.net",
    }
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    record = {
        "at": datetime.now(UTC).isoformat(),
        "repository": repository,
        "inspectionHead": os.environ["GITHUB_SHA"],
        "run": int(args.run_id),
        "artifact": int(args.artifact_id),
        "complete": False,
        "diagnosticOnly": True,
        "testsRerun": False,
        "currentApplicationAccepted": False,
        "commands": [],
    }

    def retain():
        (output / "proof.json").write_text(json.dumps(record, indent=2) + "\n")

    def execute(command, name, required=True):
        start = datetime.now(UTC).isoformat()
        process = subprocess.Popen(
            command, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            start_new_session=True
        )
        entry = {
            "parentTask": os.environ.get("GITHUB_RUN_ID", "native-evidence"),
            "cwd": str(Path.cwd()),
            "command": command,
            "pid": process.pid,
            "started": start,
            "timeoutSeconds": 120,
            "stdout": name + ".stdout",
            "stderr": name + ".stderr",
        }
        record["commands"].append(entry)
        retain()
        cleanup = "not needed"
        try:
            stdout, stderr = process.communicate(timeout=120)
        except BaseException:
            try:
                os.killpg(process.pid, signal.SIGKILL)
                cleanup = "child process group killed"
            except ProcessLookupError:
                cleanup = "child process group already exited"
            stdout, stderr = process.communicate()
            entry["interrupted"] = True
            raise
        finally:
            if process.returncode:
                try:
                    os.killpg(process.pid, signal.SIGKILL)
                    cleanup = "failed child process group killed"
                except ProcessLookupError:
                    cleanup = "failed child process group already exited"
            (output / (name + ".stdout")).write_bytes(stdout)
            (output / (name + ".stderr")).write_bytes(stderr)
            entry.update({
                "finished": datetime.now(UTC).isoformat(),
                "exitCode": process.returncode,
                "childProcessGroupCleanup": cleanup,
            })
            retain()
        result = subprocess.CompletedProcess(command, process.returncode, stdout, stderr)
        if required:
            result.check_returncode()
        return result

    def api(path, name):
        result = execute(
            ["gh", "api", "repos/" + repository + "/" + path], name
        )
        return json.loads(result.stdout)

    try:
        retain()
        artifact = api("actions/artifacts/" + args.artifact_id, "artifact-metadata")
        run = api("actions/runs/" + args.run_id, "producer-run")
        assert artifact["id"] == int(args.artifact_id)
        assert artifact["workflow_run"]["id"] == run["id"] == int(args.run_id)
        assert artifact["workflow_run"]["head_sha"] == run["head_sha"]
        assert run["repository"]["full_name"] == repository
        assert run["path"] == ".github/workflows/ci.yml"
        jobs = []
        page = 1
        while True:
            batch = api("actions/runs/" + args.run_id
                        + "/jobs?filter=all&per_page=100&page=" + str(page),
                        "producer-jobs-" + str(page))
            assert 0 < batch["total_count"] <= 1000, "Bounded original job inventory required"
            jobs.extend(batch["jobs"])
            if len(jobs) >= batch["total_count"]:
                break
            page += 1
            assert page <= 10
        producer = select_failed_producer(repository, run, artifact, jobs)
        upload_log = execute(["gh", "api", "--allow-escape-sequences", "repos/" + repository
                              + "/actions/jobs/" + str(producer["job"]["id"]) + "/logs"],
                             "producer-upload-log").stdout.decode()
        verify_failed_upload(upload_log, artifact)
        record["producerJob"] = producer["job"]["id"]
        record["producerJobConclusion"] = producer["job"]["conclusion"]
        record["producerJobCompleted"] = True
        record["producerRunStillActive"] = run["status"] != "completed"
        assert artifact["digest"] == "sha256:" + args.sha256
        assert 0 < artifact["size_in_bytes"] < 300 * 1024 * 1024
        record["producerHead"] = run["head_sha"]
        record["producerConclusion"] = run["conclusion"]
        record["artifactName"] = artifact["name"]
        execute(
            ["gh", "api", "--allow-escape-sequences", "repos/" + repository + "/actions/artifacts/"
             + args.artifact_id + "/zip"],
            "original-artifact",
        )
        archive = output / "original-artifact.stdout"
        assert archive.stat().st_size == artifact["size_in_bytes"]
        assert hashlib.sha256(archive.read_bytes()).hexdigest() == args.sha256
        record["originalArchiveSHA256"] = args.sha256
        extracted = output / "original"
        extracted.mkdir()
        with zipfile.ZipFile(archive) as bundle:
            assert sum(info.file_size for info in bundle.infolist()) < 1024**3
            for info in bundle.infolist():
                dest = (extracted / info.filename).resolve()
                assert dest.is_relative_to(extracted), info.filename
                assert (info.external_attr >> 16) & 0o170000 != 0o120000
            selection = select_failed_result(bundle)
            assert selection["course"] == producer["course"]
            bundle.extractall(extracted, selection["selected"])
        archive.rename(output / "original-artifact.zip")
        # The original archive stays in its producer run; retain its verified identity.
        (output / "original-artifact.zip").unlink()
        result = extracted / selection["result"]
        assert result.is_dir()
        record["originalFailure"] = selection["failure"]
        record["originalCourse"] = selection["course"]
        record["originalResultPath"] = selection["result"]
        execute(["xcodebuild", "-version"], "xcode-version")
        for command in [
            ["get", "test-results", "summary"],
            ["get", "test-results", "tests"],
            ["get", "test-results", "activities"],
            ["export", "attachments"],
        ]:
            execute(
                ["xcrun", "xcresulttool", *command, "--help"],
                "help-" + "-".join(command),
            )
        for command in ["summary", "tests"]:
            execute(
                ["xcrun", "xcresulttool", "get", "test-results", command,
                 "--path", str(result)],
                "result-" + command,
            )
        execute(
            ["xcrun", "xcresulttool", "get", "test-results", "activities",
             "--path", str(result), "--test-id",
             selection["testId"]],
            "result-activities", required=False,
        )
        attachments = output / "attachments"
        execute(
            ["xcrun", "xcresulttool", "export", "attachments", "--path",
             str(result), "--output-path", str(attachments)],
            "export-attachments",
        )
        record["attachments"] = [
            str(p.relative_to(output))
            for p in sorted(attachments.rglob("*"))
            if p.is_file()
        ]
        assert record["attachments"]
        record["complete"] = True
    finally:
        retain()


if __name__ == "__main__":
    main()
