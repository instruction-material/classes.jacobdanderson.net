"""Prepare pinned public sources and execute each actual browser ZIP."""
import argparse
import hashlib
import io
import json
import os
import signal
import subprocess
import sys
import tarfile
import tempfile
import time
import urllib.request
import zipfile
from collections import defaultdict
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = Path(os.environ.get("DATA_SCIENCE_FOUNDATIONS_BROWSER_PROOF_DIR",
                             ROOT / "output/data-science-foundations")).resolve()
FIXTURE = json.loads((ROOT / "test/fixtures/data-science-foundations-verification.json").read_text())


def digest(data):
    return hashlib.sha256(data).hexdigest()


def write_json(path, data):
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def prepare():
    wanted = defaultdict(dict)
    for folder, pack in FIXTURE["packs"].items():
        for role, entry in pack["roles"].items():
            for path, checksum in entry["files"].items():
                wanted[pack["revision"]][f"{folder}/{role}/{path}"] = checksum
    locks = FIXTURE["nativeLocks"]
    wanted[locks["revision"]].update(locks["files"])
    sources = {}
    for revision, paths in wanted.items():
        endpoint = f"https://codeload.github.com/{FIXTURE['repository']}/tar.gz/{revision}"
        with urllib.request.urlopen(endpoint, timeout=60) as response:
            archive = response.read(25000001)
        assert len(archive) <= 25000000, "Source archive exceeds the review bound"
        sources[revision] = {}
        with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as tar:
            for member in tar:
                path = "/".join(PurePosixPath(member.name).parts[1:])
                if path not in paths:
                    continue
                assert member.isfile() and path not in sources[revision] and member.size <= 200000
                data = tar.extractfile(member).read()
                assert digest(data) == paths[path], path
                sources[revision][path] = data.decode("utf-8")
        assert sources[revision].keys() == paths.keys()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name in locks["files"]:
        (OUTPUT / name).write_text(sources[locks["revision"]].pop(name), encoding="utf-8")
    write_json(OUTPUT / "pinned-sources.json", sources)


def execute(directory, processes):
    command = [sys.executable, "-I", "-B", "main.py"]
    receipt = dict(parentTask=os.environ.get("CLASSES_FAMILY_TASK_ID", "foundations-native"),
                   parentPid=os.getpid(), cwd=str(directory), command=command,
                   startTime=time.time(), timeoutSeconds=30, childProcessGroupCleanup="not needed")
    with subprocess.Popen(command, cwd=directory, stdout=subprocess.PIPE,
                          stderr=subprocess.PIPE, start_new_session=True) as child:
        receipt["pid"] = child.pid
        try:
            out, errors = child.communicate(timeout=30)
            receipt.update(stdout=out.decode(), stderr=errors.decode(), exitCode=child.returncode)
            assert child.returncode == 0 and not errors, receipt
        except BaseException:
            if child.poll() is None:
                os.killpg(child.pid, signal.SIGTERM)
                try:
                    child.communicate(timeout=5)
                except subprocess.TimeoutExpired:
                    os.killpg(child.pid, signal.SIGKILL)
                    child.communicate()
                receipt.update(exitCode=child.returncode, childProcessGroupCleanup="terminated process group")
            raise
        finally:
            receipt["endTime"] = time.time()
            processes.append(receipt)
    return out.decode()


def verify():
    assert sys.version_info[:3] == (3, 14, 10)
    import pandas
    assert pandas.__version__ == "3.1.1"
    browser = json.loads((OUTPUT / "browser-proof.json").read_text())
    site = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    assert browser["complete"] and browser["site"] == site
    bodies = {body["item"] for body in FIXTURE["bodies"]}
    assert {(row["item"], row["role"], row["width"]) for row in browser["views"]} == {
        (item, role, width) for item in bodies for role in ("learner", "instructor") for width in (390, 1280)
    }
    packs = FIXTURE["packs"]
    assert {(p["folder"], p["role"], p["sourceRole"]) for p in browser["imports"]} == {
        (folder, role, source) for folder in packs for role, source in
        (("learner", "starter"), ("instructor", "starter"), ("instructor", "solution"))
    }
    pinned = json.loads((OUTPUT / "pinned-sources.json").read_text())
    results, processes = [], []
    try:
        for profile in browser["imports"]:
            folder = profile["folder"]
            pack = packs[folder]
            original_role = profile["sourceRole"]
            assert profile["consentChecked"] and profile["priorWorkRetained"]
            assert list(profile["exports"]) == (["original", "edited"] if original_role == "starter" else ["original"])
            for stage, record in profile["exports"].items():
                assert record["name"].endswith(".zip") and PurePosixPath(record["name"]).name == record["name"]
                role = "solution" if stage == "edited" else original_role
                expected = pack["roles"][role]
                # The browser edits main.py in the imported project. Its other
                # files, including the starter README, retain their original bytes.
                files = dict(pack["roles"][original_role]["files"])
                output = expected["stdout"]
                if stage == "edited":
                    edited = pinned[pack["revision"]][f"{folder}/solution/main.py"] + "\nprint(" + json.dumps(profile["marker"]) + ")\n"
                    files["main.py"] = digest(edited.encode())
                    output += profile["marker"] + "\n"
                archive = (OUTPUT / record["name"]).read_bytes()
                assert digest(archive) == record["sha256"]
                with tempfile.TemporaryDirectory(prefix="foundations-export-") as temporary:
                    project = Path(temporary)
                    with zipfile.ZipFile(io.BytesIO(archive)) as zipped:
                        members = zipped.namelist()
                        relative = {}
                        roots = set()
                        for name in members:
                            path = PurePosixPath(name)
                            assert not path.is_absolute() and ".." not in path.parts and "\\" not in name
                            assert len(path.parts) >= 2
                            roots.add(path.parts[0])
                            child = PurePosixPath(*path.parts[1:]).as_posix()
                            assert child not in relative
                            relative[child] = zipped.read(name)
                        assert len(roots) == 1
                        generated = expected.get("generated", {})
                        assert {name: digest(data) for name, data in relative.items()} == files | generated, record["name"]
                        for name, data in relative.items():
                            target = project / name
                            target.parent.mkdir(parents=True, exist_ok=True)
                            target.write_bytes(data)
                    assert record["programStdout"] == output.rstrip("\n"), (record["name"], record["programStdout"], output)
                    for name in generated:
                        (project / name).unlink()
                    actual = execute(project, processes)
                    assert actual == output, (record["name"], actual, output)
                    assert all(digest((project / name).read_bytes()) == sha for name, sha in generated.items())
                results.append({"file": record["name"], "sha256": record["sha256"],
                                "matchedMembers": len(relative), "nativeStdout": actual})
        assert len(results) == 45
        write_json(OUTPUT / "native-export-proof.json", {"site": site, "count": len(results), "results": results})
    finally:
        (OUTPUT / "native-processes.jsonl").write_text("".join(json.dumps(row) + "\n" for row in processes),
                                                       encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("prepare", "verify"))
    stage = parser.parse_args().stage
    (prepare if stage == "prepare" else verify)()
