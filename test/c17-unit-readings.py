"""Verify rendered unit examples against actual exports and independent starters."""

import argparse
import ast
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import signal
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
TASK = os.environ.get("CSE_PARENT_TASK_ID", "c17-unit-reading-contracts")
CC = os.environ.get("CSE_CC", "clang")
parser = argparse.ArgumentParser()
parser.add_argument("--archives", type=Path)
parser.add_argument("--fixture-only", action="store_true")
args = parser.parse_args()
assert args.archives is not None or args.fixture_only, (
    "Actual browser exports are required for the complete gate"
)
fixture = json.loads((ROOT / "test/fixtures/c17-opening-contracts.json").read_text())
readings = ast.literal_eval(
    (ROOT / "front-end/src/stores/courses/c17UnitProjectReading.ts")
    .read_text()
    .split(" = ", 1)[1]
    .strip()
    .removesuffix(";")
)
lessons = fixture["unitLessons"]
recipes = fixture["unitCompletionRecipes"]["recipes"]
proof_path = Path(
    os.environ.get(
        "C17_UNIT_NATIVE_PROOF",
        ROOT
        / "output/playwright"
        / ("c17-unit-native-proof-" + Path(CC).name + ".json"),
    )
)
proof_path.parent.mkdir(parents=True, exist_ok=True)
process_log = proof_path.with_suffix(".processes.jsonl")


def run(command, cwd, expected=0, timeout=120):
    command = [str(value) for value in command]
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(
        command,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        start_new_session=True,
    )
    cleanup = "process exited"
    try:
        out, err = child.communicate(timeout=timeout)
    except BaseException:
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.communicate(timeout=5)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.communicate()
        cleanup = "child process group terminated"
        raise
    finally:
        with process_log.open("a") as log:
            log.write(
                json.dumps(
                    dict(
                        parentTaskId=TASK,
                        cwd=str(cwd),
                        command=command,
                        pid=child.pid,
                        startTime=started,
                        endTime=datetime.datetime.now(
                            datetime.timezone.utc
                        ).isoformat(),
                        exitCode=child.returncode,
                        timeoutSeconds=timeout,
                        childProcessGroupCleanup=cleanup,
                    )
                )
                + "\n"
            )
    assert (
        child.returncode != 0 if expected == "failure" else child.returncode == expected
    ), (command, child.returncode, (out + err).decode(errors="replace"))
    return out, err


def flags(profile):
    value = [
        CC,
        "-std=c17",
        "-Wall",
        "-Wextra",
        "-Wpedantic",
        "-Wconversion",
        "-Werror",
        "-I.",
    ]
    value += (
        [
            "-O1",
            "-g",
            "-fsanitize=address,undefined",
            "-fno-sanitize-recover=all",
            "-fno-omit-frame-pointer",
        ]
        if profile == "Debug"
        else ["-O2", "-DNDEBUG"]
    )
    if profile == "Debug" and os.uname().sysname == "Linux" and "gcc" in Path(CC).name:
        value += ["-fno-pie", "-no-pie"]
    return value


def compile_driver(cwd, row, driver, profile, name):
    arguments = flags(profile)
    sources = list(row["libraryFiles"])
    if driver == "tests.c" and row["pack"] in [
        "CSE1-Hex-and-Binary-Inspector",
        "CSE2-Bitflag-Configuration-Parser",
    ]:
        sources.append("input.c")
    if row["pack"] == "CSE7-Dynamic-Ring-Buffer" and driver == "tests.c":
        sources = ["ring.c", "test_allocation.c"]
    if row["renameMain"]:
        run([*arguments, "-Dmain=cse_demo_main", "-c", "main.c", "-o", "demo.o"], cwd)
        sources = ["demo.o"]
    executable = cwd / name
    run([*arguments, *sources, driver, "-o", executable], cwd)
    return executable


archives = []
case_proof = []
contracts = []
unfinished = []
diagnostics = []
packs = sorted({row["pack"] for row in lessons})
assert len(packs) == 14 and len(lessons) == 26
original_sources = {
    name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
    for name in [
        "test/fixtures/c17-opening-contracts.json",
        "front-end/src/stores/courses/c17UnitProjectReading.ts",
    ]
}
with tempfile.TemporaryDirectory(
    prefix="c17-unit-readings-", dir=os.environ.get("TMPDIR")
) as directory:
    temp = Path(directory)
    for pack in packs:
        expected = {
            name.removeprefix(pack + "/"): value
            for name, value in fixture["files"].items()
            if name.startswith(pack + "/")
        }
        if args.archives is not None:
            for role in ["starter", "solution"]:
                archive = args.archives / (pack + "-" + role + ".zip")
                assert archive.is_file(), archive
                seen = set()
                with zipfile.ZipFile(archive) as zipped:
                    roots = {
                        entry.filename.split("/")[0] for entry in zipped.infolist()
                    }
                    assert len(roots) == 1
                    for entry in zipped.infolist():
                        path = Path(entry.filename)
                        assert not path.is_absolute() and ".." not in path.parts
                        relative = "/".join(path.parts[1:])
                        assert (
                            relative in expected
                            and relative not in seen
                            and entry.file_size < 1024 * 1024
                        )
                        assert relative.startswith(role + "/") or "/" not in relative
                        raw = zipped.read(entry)
                        assert (
                            raw == expected[relative]["content"].encode()
                            and hashlib.sha256(raw).hexdigest()
                            == expected[relative]["sha256"]
                        )
                        seen.add(relative)
                        destination = temp / pack / relative
                        destination.parent.mkdir(parents=True, exist_ok=True)
                        if destination.exists():
                            assert destination.read_bytes() == raw
                        else:
                            destination.write_bytes(raw)
                assert seen == {
                    name
                    for name in expected
                    if name.startswith(role + "/") or "/" not in name
                }
                archives.append(
                    dict(
                        pack=pack,
                        role=role,
                        files=sorted(seen),
                        sha256=hashlib.sha256(archive.read_bytes()).hexdigest(),
                    )
                )
        else:
            for relative, value in expected.items():
                raw = value["content"].encode()
                assert hashlib.sha256(raw).hexdigest() == value["sha256"]
                destination = temp / pack / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(raw)
        starter = temp / pack / "starter"
        completed = temp / pack / "completed"
        shutil.copytree(starter, completed)
        for change in recipes[pack]:
            file = completed / change["file"]
            text = file.read_text()
            if change["kind"] == "literal":
                assert text.count(change["before"]) == 1
                text = text.replace(change["before"], change["after"])
            else:
                match = re.search(change["before"], text, re.S)
                assert match and "\n}" not in match.group(0)
                text, count = re.subn(
                    change["before"],
                    lambda _: change["after"],
                    text,
                    count=1,
                    flags=re.S,
                )
                assert count == 1
            file.write_text(text)
        changed = {change["file"] for change in recipes[pack]}
        for file in starter.iterdir():
            if file.is_file() and file.name not in changed:
                assert file.read_bytes() == (completed / file.name).read_bytes()
        row = next(lesson for lesson in lessons if lesson["pack"] == pack)
        if pack == "CSE-09-unit-11-systems-tooling":
            _, err = run(
                [*flags("Debug"), "main.c", "engineering_math.c", "-o", "unfinished"],
                starter,
                expected="failure",
            )
            assert b"format" in err and not (starter / "unfinished").exists()
        else:
            executable = compile_driver(starter, row, "tests.c", "Debug", "unfinished")
            run([executable], starter, expected=1, timeout=15)
        unfinished.append(dict(pack=pack, documentedUnfinishedRoleRejected=True))
        for role in ["solution", "completed"]:
            cwd = temp / pack / role
            for profile in ["Debug", "Release"]:
                executable = compile_driver(cwd, row, "tests.c", profile, "contracts")
                out, _ = run([executable], cwd, timeout=30)
                contracts.append(
                    dict(pack=pack, role=role, profile=profile, stdout=out.decode())
                )
    for lesson in lessons:
        content = readings[lesson["id"]]
        code_blocks = re.findall(r"~~~c\n(.*?)\n~~~", content, re.S)
        code = code_blocks[0] + "\n"
        title = content.splitlines()[0].split(": ", 1)[1]
        for role in ["solution", "completed"]:
            cwd = temp / lesson["pack"] / role
            (cwd / "case.c").write_text(code)
            for profile in ["Debug", "Release"]:
                executable = compile_driver(cwd, lesson, "case.c", profile, "case")
                out, _ = run([executable], cwd, timeout=30)
                assert out == (title + ": accepted\n").encode()
                case_proof.append(
                    dict(
                        lesson=lesson["id"],
                        pack=lesson["pack"],
                        revision=lesson["revision"],
                        role=role,
                        profile=profile,
                        codeSha256=hashlib.sha256(code.encode()).hexdigest(),
                        expectedOutput=out.decode(),
                    )
                )
            for experiment in lesson["diagnostics"]:
                arguments = flags("Debug")
                kind = experiment["kind"]
                if kind in ["compile", "logic"]:
                    file = cwd / experiment["name"]
                    assert code_blocks[1].strip() == experiment["bad"].strip()
                    assert code_blocks[2].strip() == experiment["good"].strip()
                    file.write_text(code_blocks[1] + "\n")
                    executable = cwd / "probe"
                    if kind == "compile":
                        _, err = run(
                            [*arguments, "-c", file, "-o", "bad.o"],
                            cwd,
                            expected="failure",
                        )
                        assert b"format" in err
                    else:
                        run([*arguments, file, "-o", executable], cwd)
                        out, err = run([executable], cwd, expected=1)
                        assert not out and not err
                    file.write_text(code_blocks[2] + "\n")
                    run([*arguments, file, "-o", executable], cwd)
                    out, _ = run([executable], cwd)
                    assert out == experiment["stdout"].encode()
                else:
                    sources = ["main.c", "reading.c", "labels.c"]
                    if kind == "missing-definition":
                        sources.remove(experiment["omitted"])
                    else:
                        assert kind == "duplicate-definition"
                        assert code_blocks[1].strip() == experiment["source"].strip()
                        (cwd / experiment["name"]).write_text(code_blocks[1] + "\n")
                        sources.append(experiment["name"])
                    objects = []
                    for source in sources:
                        obj = source + ".o"
                        objects.append(obj)
                        run([*arguments, "-c", source, "-o", obj], cwd)
                    _, err = run(
                        [*arguments, *objects, "-o", "bad-link"],
                        cwd,
                        expected="failure",
                    )
                    assert b"reading_label" in err
                    if kind == "missing-definition":
                        run([*arguments, "-c", "labels.c", "-o", "labels.c.o"], cwd)
                        objects.append("labels.c.o")
                    else:
                        objects.remove(experiment["name"] + ".o")
                    run([*arguments, *objects, "-o", "healthy-link"], cwd)
                    run([cwd / "healthy-link"], cwd)
                diagnostics.append(
                    dict(
                        lesson=lesson["id"],
                        role=role,
                        kind=kind,
                        invalidRejected=True,
                        correctedAccepted=True,
                    )
                )
assert (
    len(case_proof) == 104
    and len(contracts) == 56
    and len(unfinished) == 14
    and len(diagnostics) == 8
)
assert not Path(directory).exists()
assert original_sources == {
    name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
    for name in original_sources
}
receipt = dict(
    event="verified-c17-unit-reading-contracts",
    compiler=CC,
    lessons=26,
    packs=14,
    nativeCaseExecutions=104,
    independentLearnerRoles=14,
    baseContractProfiles=56,
    unfinishedRolesRejected=14,
    diagnosticExecutions=8,
    actualBrowserExportRoles=len(archives),
    cases=case_proof,
    archives=archives,
    baseContracts=contracts,
    unfinished=unfinished,
    diagnostics=diagnostics,
    sourceFilesUnchanged=True,
    temporaryBuildCleanup=True,
)
proof_path.write_text(json.dumps(receipt, indent=2) + "\n")
print(
    json.dumps(
        {
            key: receipt[key]
            for key in [
                "event",
                "compiler",
                "lessons",
                "packs",
                "nativeCaseExecutions",
                "independentLearnerRoles",
                "baseContractProfiles",
                "unfinishedRolesRejected",
                "diagnosticExecutions",
                "actualBrowserExportRoles",
                "sourceFilesUnchanged",
                "temporaryBuildCleanup",
            ]
        }
    )
)
