"""Verify exact browser exports and execute their saved machine build edits."""
import argparse
import datetime
import hashlib
import json
import os
import signal
import subprocess
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--cc", choices=("clang", "gcc"), required=True)
parser.add_argument("--archives", type=Path, required=True)
parser.add_argument("--proof", type=Path, required=True)
args = parser.parse_args()
args.proof = args.proof.resolve()
args.proof.parent.mkdir(parents=True, exist_ok=True)
fixtures = json.loads((ROOT / "test/fixtures/assembly-machine-contracts.json").read_text())
verifier = json.loads((ROOT / "test/fixtures/assembly-machine-source-verifier.json").read_text())
assert hashlib.sha256(verifier["content"].encode()).hexdigest() == verifier["sha256"]


def run(command, cwd, expected=0):
    started = datetime.datetime.now(datetime.UTC).isoformat()
    child = subprocess.Popen(command, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True)
    cleanup = "process exited"
    try:
        out, err = child.communicate(timeout=240)
    except BaseException:
        try:
            os.killpg(child.pid, signal.SIGTERM)
        except ProcessLookupError:
            pass
        try:
            child.communicate(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.communicate()
        cleanup = "owned process group terminated and reaped"
        raise
    finally:
        with args.proof.with_suffix(".wrapper-processes.jsonl").open("a") as stream:
            stream.write(json.dumps({"parentTaskId": "assembly-machine-site-export", "command": command, "cwd": str(cwd), "pid": child.pid, "startTime": started, "endTime": datetime.datetime.now(datetime.UTC).isoformat(), "exitCode": child.returncode, "timeoutSeconds": 240, "childProcessGroupCleanup": cleanup}) + "\n")
    prefix = args.proof.parent / (args.cc + "-wrapper-" + str(child.pid))
    prefix.with_suffix(".stdout.txt").write_bytes(out)
    prefix.with_suffix(".stderr.txt").write_bytes(err)
    accepted = child.returncode == expected if expected in (0, 78) else child.returncode != 0
    assert accepted, (command, child.returncode, err.decode(errors="replace"))
    return out, err


def entries(path, expected):
    with zipfile.ZipFile(path) as archive:
        assert len(archive.namelist()) == len(expected) == 9
        result = {}
        for name in expected:
            matches = [path for path in archive.namelist() if path.endswith("/" + name)]
            assert len(matches) == 1
            result[name] = archive.read(matches[0])
        return result


export_hashes = {}
edited_profiles = []
with tempfile.TemporaryDirectory(prefix="assembly-machine-export-") as temporary:
    root = Path(temporary)
    for fixture in fixtures:
        assert fixture["revision"] == verifier["revision"]
        pack = fixture["pack"]
        for role in ("starter", "solution"):
            expected = {path.removeprefix(pack + "/"): file for path, file in fixture["files"].items() if path.startswith(pack + "/" + role + "/") or path == pack + "/README.md"}
            original = entries(args.archives / (pack + "-" + role + ".zip"), expected)
            for name, raw in original.items():
                assert raw.decode() == expected[name]["content"] and hashlib.sha256(raw).hexdigest() == expected[name]["sha256"]
                path = root / pack / name
                path.parent.mkdir(parents=True, exist_ok=True)
                if path.exists(): assert path.read_bytes() == raw
                path.write_bytes(raw)
                export_hashes[pack + "/" + name] = expected[name]["sha256"]
            changed = dict(original)
            task = role + "/routine.S"
            if role == "starter":
                changed[task] = fixture["files"][pack + "/solution/routine.S"]["content"].encode()
            else:
                before, after = (b"    mov rax, QWORD PTR [rsp + 0]\n", b"    mov rax, QWORD PTR [rsp + 0]\n    bswap rax\n") if fixture["mode"] == "memory" else (b"    lea rax, [rdi + rsi*8 - 7]\n", b"    lea rax, [rdi + rsi*4 - 7]\n")
                assert changed[task].count(before) == 1
                changed[task] = changed[task].replace(before, after, 1)
            assert changed[task] != original[task]
            for width in (1280, 360):
                for theme in ("light", "dark"):
                    assert entries(args.archives / (pack + "-" + role + "-edited-" + str(width) + "-" + theme + ".zip"), expected) == changed
            directory = root / (fixture["mode"] + "-saved-" + role)
            directory.mkdir()
            for name, raw in changed.items():
                if name.startswith(role + "/"): (directory / name.removeprefix(role + "/")).write_bytes(raw)
            run(["cmake", "-S", ".", "-B", "build", "-DCMAKE_BUILD_TYPE=Debug", "-DCMAKE_C_COMPILER=" + args.cc, "-DCMAKE_ASM_COMPILER=" + args.cc], directory)
            run(["cmake", "--build", "build", "--verbose", "--parallel", "1"], directory)
            run(["ctest", "--test-dir", "build", "--output-on-failure"], directory, expected=0 if role == "starter" else 1)
            retained = args.proof.parent / (args.cc + "-saved") / directory.name
            retained.mkdir(parents=True)
            for local in list(directory.iterdir()) + [directory / "build/app", directory / "build/contracts", directory / "build/CMakeFiles/app.dir/routine.S.o"]:
                if local.is_file(): (retained / local.name).write_bytes(local.read_bytes())
            for variant in ("default", "changed"):
                succeeds = role == "starter"
                stdout, stderr = run([str(directory / "build/app"), *(["--changed"] if variant == "changed" else [])], directory, expected=0 if succeeds else 78)
                (retained / (variant + ".stdout.txt")).write_bytes(stdout)
                (retained / (variant + ".stderr.txt")).write_bytes(stderr)
                if succeeds: assert stdout.startswith(b"initial=")
                else: assert stdout == b""
            edited_profiles.append({"mode": fixture["mode"], "role": role, "browserWidths": 2, "browserThemes": 2, "completedLearner": role == "starter", "referenceRegressionRefused": role == "solution", "retainedDirectory": str(retained.relative_to(args.proof.parent))})
    path = root / verifier["path"]
    path.parent.mkdir()
    path.write_text(verifier["content"])
    run(["python3", str(path), "--cc", args.cc, "--proof", str(args.proof)], root)
    receipt = json.loads(args.proof.read_text())
    assert receipt["sourceFiles"] == export_hashes and receipt["nativeExecuted"] and receipt["sourceUnchanged"]
    assert receipt["successfulProfiles"] == 6 and receipt["unfinishedProfiles"] == 2
    assert receipt["controlledOperationRegressions"] == receipt["preservedRegisterRegressions"] == 2
    receipt.update(sourceRevision=verifier["revision"], exactBrowserSourceFiles=34, actualSavedEditProfiles=edited_profiles, editedArchivesCompared=16, temporarySourceCleanup=True)
assert not root.exists()
args.proof.write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps({"compiler": args.cc, "exactBrowserSourceFiles": 34, "editedArchivesCompared": 16, "actualSavedEditProfiles": 4, "nativeSuccessfulProfiles": 6, "controlledNativeRegressions": 4}))
