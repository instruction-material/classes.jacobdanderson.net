"""Execute the setup reading's exact Python example in its installed environment."""
import argparse
import datetime
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import re
import signal
import struct
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--proof", type=Path, required=True)
args = parser.parse_args()
assert sys.prefix != sys.base_prefix, "Use the isolated lesson environment"
assert (3, 12) <= sys.version_info[:2] <= (3, 14)
out = args.proof.resolve().parent
out.mkdir(parents=True, exist_ok=True)
reading = ROOT / "front-end/src/assets/course-guides/ai-search-setup.md"
examples = re.findall(r"```python\n([\s\S]*?)\n```", reading.read_text())
assert len(examples) == 1
example = out / "check_environment.py"
example.write_text(examples[0] + "\n")
os.environ["MPLCONFIGDIR"] = str(out / "matplotlib-cache")
now = lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()


def run(label, command):
    event = dict(parentTaskId=os.environ.get("CLASSES_FAMILY_TASK_ID", "ai-setup-reading"),
                 parentPid=os.getpid(), cwd=str(out), command=command,
                 startTime=now(), timeoutSeconds=120)
    child = subprocess.Popen(command, cwd=out, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, start_new_session=True)
    event["pid"] = child.pid
    log = out / "processes.jsonl"
    with log.open("a") as stream:
        stream.write(json.dumps(dict(event, event="start")) + "\n")
    stdout, stderr = b"", b""
    cleanup = "owned process exited and reaped"
    try:
        stdout, stderr = child.communicate(timeout=120)
    except BaseException:
        if child.poll() is None:
            os.killpg(child.pid, signal.SIGTERM)
            try:
                stdout, stderr = child.communicate(timeout=5)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid, signal.SIGKILL)
                stdout, stderr = child.communicate()
        cleanup = "owned process group terminated and reaped"
        raise
    finally:
        (out / (label + ".stdout.txt")).write_bytes(stdout)
        (out / (label + ".stderr.txt")).write_bytes(stderr)
        with log.open("a") as stream:
            stream.write(json.dumps(dict(event, event="end", endTime=now(),
                                         exitCode=child.returncode, childProcessGroupCleanup=cleanup)) + "\n")
    assert child.returncode == 0, (label, stderr.decode(errors="replace"))
    return stdout.decode()


stdout = run("example", [sys.executable, str(example)])
lines = stdout.strip().splitlines()
assert Path(lines[0]) == Path(sys.executable)
assert lines[1:] == ["[0, 1, 2]"]
image = out / "graph-check.png"
raw = image.read_bytes()
assert raw[:8] == b"\x89PNG\r\n\x1a\n"
width, height = struct.unpack(">II", raw[16:24])
assert width > 100 and height > 100 and len(raw) > 1000
notebook_version = run("notebook-version", [sys.executable, "-m", "jupyterlab", "--version"]).strip()
record = dict(at=now(), accepted=True, interpreter=sys.executable,
              pythonVersion=sys.version, isolatedEnvironment=True,
              sourceReadingSHA256=hashlib.sha256(reading.read_bytes()).hexdigest(),
              executedExampleSHA256=hashlib.sha256(example.read_bytes()).hexdigest(),
              expectedPath=[0, 1, 2], actualStdout=stdout,
              graphImage=dict(path=str(image), sha256=hashlib.sha256(raw).hexdigest(), width=width, height=height),
              packageVersions={name: importlib.metadata.version(name) for name in ["networkx", "matplotlib", "jupyterlab"]},
              notebookLauncherVersion=notebook_version,
              scope="Exact reading example and notebook launcher in a fresh installed environment; platform-specific activation commands are separately sourced instructions.")
args.proof.write_text(json.dumps(record, indent=2) + "\n")
print(json.dumps(record, indent=2))
