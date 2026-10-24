"""Exercise the actual UI-test scroll geometry, including the observed large-phone failure."""
from pathlib import Path
import datetime
import hashlib
import json
import os
import signal
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
TASK = os.environ.get("CLASSES_FAMILY_TASK_ID", "swift-course-scroll-geometry")
fixture = ROOT / "test/fixtures/swift-canonical-uitests.swift"
source = fixture.read_text().split("final class CanonicalCourseUITests", 1)[0]
assert "private func courseScrollStart(" in source
source = source.replace("import XCTest\n", "")
checks = r"""
func verify(_ name: String, _ viewport: CGRect, _ target: CGRect, _ movement: CGFloat,
            insideVisibleTarget: Bool) {
    let point = courseScrollStart(viewport: viewport, target: target, movement: movement)
    precondition(viewport.contains(point), "\(name): start must stay in the viewport")
    if insideVisibleTarget {
        precondition(target.contains(point), "\(name): start must touch the visible target")
    } else if movement < 0 {
        precondition(point.y > viewport.midY, "\(name): search upward from lower content")
    } else {
        precondition(point.y < viewport.midY, "\(name): search downward from upper content")
    }
}
let large = CGRect(x: 0, y: 189, width: 440, height: 767)
let cafe = CGRect(x: 16, y: 753, width: 408, height: 234)
precondition(!cafe.contains(CGPoint(x: 426.8, y: 572.5)),
             "The original failed gesture missed the visible Cafe row")
let cafeMovement = courseScrollMovement(viewport: large, target: cafe, attempt: 0)
precondition(cafeMovement == -120,
             "The observed Cafe case needs a full scroll gesture rather than repeated 40-point nudges")
verify("observed large-phone Cafe", large, cafe, cafeMovement, insideVisibleTarget: true)
let small = CGRect(x: 0, y: 96, width: 375, height: 571)
verify("small partially below", small, CGRect(x: 16, y: 560, width: 343, height: 150),
       -100, insideVisibleTarget: true)
verify("large partially above", large, CGRect(x: 16, y: 130, width: 408, height: 150),
       70, insideVisibleTarget: true)
verify("small below", small, CGRect(x: 16, y: 900, width: 343, height: 100),
       -150, insideVisibleTarget: false)
verify("large above", large, CGRect(x: 16, y: -1000, width: 408, height: 100),
       150, insideVisibleTarget: false)
verify("unknown frame", large, .zero, -150, insideVisibleTarget: false)
verify("tiny visible sliver", large, CGRect(x: 16, y: 947, width: 408, height: 100),
       -40, insideVisibleTarget: false)
verify("horizontal intersection", large, CGRect(x: -80, y: 400, width: 160, height: 100),
       -60, insideVisibleTarget: true)
verify("offset viewport", CGRect(x: 20, y: 70, width: 320, height: 500),
       CGRect(x: 28, y: 430, width: 304, height: 200), -88, insideVisibleTarget: true)
verify("clipped Capstone switch group", CGRect(x: 0, y: 96, width: 375, height: 504),
       CGRect(x: 16, y: 436.7, width: 343, height: 187.5), -40, insideVisibleTarget: true)
precondition(courseScrollMovement(viewport: large,
             target: CGRect(x: 16, y: 100, width: 408, height: 100), attempt: 0) == 120)
precondition(courseScrollMovement(viewport: small,
             target: CGRect(x: 16, y: 1000, width: 343, height: 150), attempt: 0) == -180)
precondition(courseScrollMovement(viewport: small,
             target: CGRect(x: 16, y: -1000, width: 343, height: 150), attempt: 0) == 180)
precondition(courseScrollMovement(viewport: large, target: .zero, attempt: 0) == -150)
precondition(courseScrollMovement(viewport: large, target: .zero, attempt: 12) == 150)
precondition(courseScrollMovement(viewport: small,
             target: CGRect(x: 16, y: 300, width: 343, height: 100), attempt: 0) == -120)
precondition(courseScrollMovement(viewport: small,
             target: CGRect(x: 16, y: 300, width: 343, height: 100), attempt: 12) == 120)
print("Eighteen course scroll geometry checks passed")
"""


def run(command):
    entry = dict(parentTask=TASK, parentPid=os.getpid(), cwd=str(ROOT),
                 command=command, startTime=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                 timeoutSeconds=60)
    child = subprocess.Popen(command, cwd=ROOT, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, start_new_session=True)
    entry["pid"] = child.pid
    print(json.dumps(dict(entry, event="start")), flush=True)
    cleanup = "owned process exited and reaped"
    try:
        stdout, stderr = child.communicate(timeout=60)
    except BaseException:
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.communicate(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.communicate()
        cleanup = "owned process group terminated and reaped"
        raise
    finally:
        print(json.dumps(dict(entry, event="end", exitCode=child.returncode,
                              endTime=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                              childProcessGroupCleanup=cleanup)), flush=True)
    assert child.returncode == 0, (command, stdout.decode(), stderr.decode())
    return stdout.decode()


with tempfile.TemporaryDirectory(prefix="classes-scroll-geometry-") as directory:
    work = Path(directory)
    main = work / "main.swift"
    executable = work / "scroll-geometry"
    main.write_text(source + checks)
    run(["/usr/bin/xcrun", "swiftc", str(main), "-o", str(executable)])
    result = run([str(executable)])
    assert result.strip() == "Eighteen course scroll geometry checks passed"
    print(json.dumps(dict(accepted=True, checks=18,
                          fixtureSha256=hashlib.sha256(fixture.read_bytes()).hexdigest(),
                          scope="Actual scroll-origin function and observed failure geometry; native UI remains separately required")),
          flush=True)
