"""Compile actual browser ZIPs and exercise both source roles on iOS simulators."""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import platform
import re
import signal
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--browser", type=Path, required=True)
parser.add_argument("--proof", type=Path, required=True)
parser.add_argument("--course", choices=("welcome", "networking", "gallery", "hobby", "map", "capstone"), default="welcome")
parser.add_argument("--extended-welcome", action="store_true")
parser.add_argument("--diagnostic-map-case", nargs="?", const="small", choices=("small", "large"),
                    help="Run only the selected iPhone reference at largest text; full acceptance remains false")
args = parser.parse_args()
assert not args.extended_welcome or args.course == "welcome"
assert not args.diagnostic_map_case or (args.course == "map" and not args.extended_welcome)
args.browser = args.browser.resolve()
args.proof = args.proof.resolve()
OUT = args.proof.parent
assert platform.system() == "Darwin", "An existing Xcode/iOS simulator installation is required"
assert not args.proof.exists()
OUT.mkdir(parents=True, exist_ok=True)
WORK = OUT / "work"
WORK.mkdir()
(WORK / ".metadata_never_index").touch()
LOGS = OUT / "logs"
LOGS.mkdir()
RESULTS = OUT / "results"
RESULTS.mkdir()
task_id = "swift-" + args.course + "-ios-" + os.environ.get("GITHUB_RUN_ID", str(os.getpid()))
lock = Path(os.environ.get("CLASSES_FAMILY_LOCK", "/tmp/classes-family-heavy-task.lock"))
owner = json.loads((lock / "owner.json").read_text())
assert owner["parentPid"] == os.getppid() and owner["childPid"] == os.getpid(), \
    "Run native verification through the shared heavy-task wrapper"
assert os.environ.get("CLASSES_FAMILY_ALLOW_HIGH_LOAD") != "1", "The entry load guard must remain enabled"


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def stop(signum, _frame):
    raise SystemExit(128 + signum)


signal.signal(signal.SIGTERM, stop)
signal.signal(signal.SIGINT, stop)


def run(label, command, timeout=180, check=True):
    event = dict(parentTaskId=task_id, parentPid=os.getpid(), cwd=str(ROOT),
                 command=command, startTime=now(), timeoutSeconds=timeout,
                 hostLoadAtStart=os.getloadavg()[0])
    child = subprocess.Popen(command, cwd=ROOT, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, start_new_session=True)
    event["pid"] = child.pid
    log = OUT / "processes.jsonl"
    with log.open("a") as stream:
        stream.write(json.dumps(dict(event, event="start")) + "\n")
    stdout, stderr = b"", b""
    cleanup = "owned process exited and reaped"
    try:
        stdout, stderr = child.communicate(timeout=timeout)
    except BaseException:
        if child.poll() is None:
            os.killpg(child.pid, signal.SIGTERM)
            try:
                stdout, stderr = child.communicate(timeout=5)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid, signal.SIGKILL)
                stdout, stderr = child.communicate()
        cleanup = "owned child process group terminated and reaped"
        raise
    finally:
        with log.open("a") as stream:
            stream.write(json.dumps(dict(event, event="end", endTime=now(),
                                         exitCode=child.returncode,
                                         childProcessGroupCleanup=cleanup)) + "\n")
        (LOGS / (label + ".stdout.txt")).write_bytes(stdout)
        (LOGS / (label + ".stderr.txt")).write_bytes(stderr)
    if check:
        assert child.returncode == 0, (label, stdout.decode(errors="replace")[-6000:],
                                      stderr.decode(errors="replace")[-4000:])
        return stdout
    return child.returncode, stdout, stderr


def record_booted_host(label):
    # The shared wrapper admits this entire sequential job before it starts.
    # Observe load from its running simulator without adding a second job gate.
    load = os.getloadavg()[0]
    record.setdefault("postBootObservation", {})[label] = dict(at=now(), load=load)
    args.proof.write_text(json.dumps(record, indent=2) + "\n")
    print(f"Simulator {label} host load within the admitted job: {load:.2f}", flush=True)


def version(value):
    numbers = re.match(r"(\d+)\.(\d+)(?:\.(\d+))?", value)
    assert numbers, value
    return tuple(int(x or "0") for x in numbers.groups())


fixture = json.loads((ROOT / f"test/fixtures/swift-{args.course}-source.json").read_text())
browser = json.loads((args.browser / f"swift-swift-{args.course}-course-proof.json").read_text())
profiles = browser["profiles"]
assert {(x["role"], x["width"]) for x in profiles} == {
    (role, width) for role in ("starter", "solution") for width in (390, 1280)
} and len(profiles) == 4
assert all(x["revision"] == fixture["revision"] and x["consentBeforeFetch"]
           and x["sameAttemptReused"] and x["previousWorkPreserved"]
           and x["remoteWrites"] == 0 for x in profiles)
record = dict(at=now(), accepted=False, sourceRevision=fixture["revision"],
              exports=[], simulatorTests=[], ownedSimulatorsCreated=[], ownedSimulatorsDeleted=[],
              resourcePolicy=dict(sharedLockOwner=owner, entryLoadGuardEnabled=True,
                                  buildsAndSimulatorsRunSequentially=True))
canonical_courses = {"gallery": "MediaGalleryApp.swift", "hobby": "MultiTabHobbyApp.swift",
                     "map": "MapPlacesApp.swift", "capstone": "PublishReadyCapstoneApp.swift"}
record["course"] = args.course
if args.diagnostic_map_case:
    record.update(diagnosticOnly=True, diagnosticSize=args.diagnostic_map_case, fullCoverageRequired=8)
variant_native = args.course in canonical_courses or args.extended_welcome
if variant_native:
    harness = (["test/swift-welcome-exported-ios.py", "test/swift-welcome-xcode.py",
                "test/swift-welcome-extended-xcode.py", "test/fixtures/swift-welcome-extended-uitests.swift"]
               if args.extended_welcome else
               ["test/swift-welcome-exported-ios.py", "test/swift-welcome-xcode.py",
                "test/swift-canonical-xcode.py", "test/fixtures/swift-canonical-uitests.swift"])
    record["harnessSourceHashes"] = {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in harness}
    record["installedApps"] = []
    if args.course == "hobby":
        recognizer_source = "test/swift-hobby-text-recognition.swift"
        record["harnessSourceHashes"][recognizer_source] = hashlib.sha256((ROOT / recognizer_source).read_bytes()).hexdigest()
        record["renderedTextChecks"] = []
args.proof.write_text(json.dumps(record, indent=2) + "\n")
recognizer = None
if args.course == "hobby":
    recognizer = WORK / "recognize-course-text"
    run("build-text-recognizer", ["/usr/bin/xcrun", "swiftc", "-module-cache-path", str(WORK / "text-module-cache"),
                                   str(ROOT / "test/swift-hobby-text-recognition.swift"), "-o", str(recognizer)])
sdk = run("sdk-path", ["/usr/bin/xcrun", "--sdk", "iphonesimulator", "--show-sdk-path"]).decode().strip()
sdk_version = run("sdk-version", ["/usr/bin/xcrun", "--sdk", "iphonesimulator", "--show-sdk-version"]).decode().strip()
assert version(sdk_version) >= (17, 0, 0)
arch = platform.machine()
assert arch in ("arm64", "x86_64")
target = arch + "-apple-ios17.0-simulator"
record.update(sdk=sdk, sdkVersion=sdk_version, target=target, languageMode="Swift6",
              architecture=arch, hostMacOS=platform.mac_ver()[0],
              swiftVersion=run("swift-version", ["/usr/bin/xcrun", "swiftc", "--version"]).decode().strip(),
              xcodeVersion=run("xcode-version", ["/usr/bin/xcrun", "xcodebuild", "-version"]).decode().strip())
for profile in profiles:
    role = profile["role"]
    source_names = (("ContentView.swift", canonical_courses[args.course]) if args.course in canonical_courses else
                    ("ContentView.swift", "WelcomeProfileApp.swift") if args.course == "welcome" else
                    ("APIReferenceApp.swift", "ContentView.swift", "ReferenceClient.swift", "ReferenceStore.swift"))
    shared_names = {"README.md", "verify-networking.py", "tests/ReferenceContracts.swift"} if args.course == "networking" else {"README.md"}
    expected_names = {role + "/" + name for name in source_names} | shared_names
    for kind in ("exact", "edited"):
        archive = args.browser / profile[kind + "Archive"]
        assert archive.parent == args.browser and archive.stat().st_size < 8 * 1024 * 1024
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        assert digest == profile[kind + "ArchiveSha256"]
        files = profile["sourceFiles" if kind == "exact" else "editedFiles"]
        assert {x["name"] for x in files} == expected_names and len(files) == len(expected_names)
        destination = WORK / "sdk" / archive.stem
        destination.mkdir(parents=True)
        with zipfile.ZipFile(archive) as z:
            assert len(z.infolist()) == len(expected_names)
            for entry in z.infolist():
                path = PurePosixPath(entry.filename)
                assert not path.is_absolute() and ".." not in path.parts and "\\" not in entry.filename
                assert entry.file_size < 2 * 1024 * 1024
            for file in files:
                matches = [key for key in z.namelist() if key.endswith("/" + file["name"])]
                assert len(matches) == 1
                raw = z.read(matches[0])
                assert hashlib.sha256(raw).hexdigest() == file["sha256"]
                if kind == "exact":
                    source = fixture["files"][fixture["pack"] + "/" + file["name"]]
                    assert raw == source["content"].encode() and file["sha256"] == source["sha256"]
                path = destination / file["name"]
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(raw)
        sources = sorted(str(destination / role / name) for name in source_names)
        assert len(sources) == len(source_names)
        run("sdk-" + archive.stem, ["/usr/bin/xcrun", "swiftc", "-typecheck", "-parse-as-library",
                                  "-swift-version", "6", "-sdk", sdk, "-target", target,
                                  "-module-cache-path", str(WORK / "module-cache"), *sources])
        record["exports"].append(dict(archive=archive.name, sha256=digest, sdkTypecheckPassed=True))
        args.proof.write_text(json.dumps(record, indent=2) + "\n")

inputs = {"profiles": []}
variants = (["standard", "long-note"] if args.extended_welcome else
            ["standard", "largest-text"] if args.course in canonical_courses else
            ["standard"] if args.course == "welcome" else ["standard", "long-data"])
if args.diagnostic_map_case:
    variants = ["largest-text"]
for variant in variants:
    project_root = WORK / ("xcode" if args.course == "welcome" and not args.extended_welcome else "xcode-" + variant)
    generator = ROOT / "test" / ("swift-welcome-extended-xcode.py" if args.extended_welcome else
                                 "swift-canonical-xcode.py" if args.course in canonical_courses else
                                 "swift-welcome-xcode.py" if args.course == "welcome" else "swift-networking-xcode.py")
    command = [sys.executable, str(generator), "--browser", str(args.browser), "--output", str(project_root)]
    if args.course != "welcome" or args.extended_welcome:
        command += ["--variant", variant]
    if args.course in canonical_courses:
        command += ["--course", args.course]
    run("project-inputs-" + variant, command)
    generated = json.loads((project_root / "inputs.json").read_text())
    if args.diagnostic_map_case:
        generated["profiles"] = [x for x in generated["profiles"] if x["role"] == "solution"]
    for profile in generated["profiles"]:
        profile.update(project=generated["project"], variant=variant,
                       derivedData=str(WORK / "derived") if args.course == "welcome" and not args.extended_welcome else str(WORK / "derived" / variant))
        inputs["profiles"].append(profile)
        run("build-" + variant + "-" + profile["role"], [
            "/usr/bin/xcrun", "xcodebuild", "build-for-testing", "-project", profile["project"],
            "-scheme", profile["scheme"], "-configuration", "Debug", "-sdk", "iphonesimulator",
            "-destination", "generic/platform=iOS Simulator", "-jobs", "1",
            "-derivedDataPath", profile["derivedData"], "-disableAutomaticPackageResolution",
            "SWIFT_VERSION=6.0", "IPHONEOS_DEPLOYMENT_TARGET=17.0", "CODE_SIGNING_ALLOWED=NO"
        ], timeout=600)
record["appInputs"] = inputs
args.proof.write_text(json.dumps(record, indent=2) + "\n")
runtimes = json.loads(run("runtimes", ["/usr/bin/xcrun", "simctl", "list", "runtimes", "--json"]))["runtimes"]
available = [x for x in runtimes if x.get("isAvailable") and x["identifier"].startswith("com.apple.CoreSimulator.SimRuntime.iOS-")
             and (17, 0, 0) <= version(x["version"]) <= version(sdk_version)]
assert available, "Use a preinstalled iOS runtime compatible with the selected SDK; no downloads are performed"
runtime = max(available, key=lambda x: version(x["version"]))
phones = [x for x in runtime["supportedDeviceTypes"] if x["name"].startswith("iPhone")]
small = next((x for name in ["iPhone SE (3rd generation)", "iPhone 17", "iPhone 16", "iPhone 15"]
              for x in phones if x["name"] == name), None)
large = next((x for name in ["iPhone 17 Pro Max", "iPhone 16 Pro Max", "iPhone 15 Pro Max"]
              for x in phones if x["name"] == name), None)
assert small and large and small["identifier"] != large["identifier"], "Two installed iPhone size profiles are required"
record["runtime"] = dict(identifier=runtime["identifier"], version=runtime["version"])
devices = ([(args.diagnostic_map_case, small if args.diagnostic_map_case == "small" else large)]
           if args.diagnostic_map_case else [("small", small), ("large", large)])
for size, model in devices:
    device = run("create-" + size, ["/usr/bin/xcrun", "simctl", "create", task_id + "-" + size,
                                  model["identifier"], runtime["identifier"]]).decode().strip()
    assert re.fullmatch(r"[0-9A-Fa-f-]{36}", device)
    record["ownedSimulatorsCreated"].append(device)
    args.proof.write_text(json.dumps(record, indent=2) + "\n")
    try:
        run("boot-" + size, ["/usr/bin/xcrun", "simctl", "boot", device])
        run("ready-" + size, ["/usr/bin/xcrun", "simctl", "bootstatus", device, "-b"], timeout=300)
        record_booted_host(size)
        for profile in inputs["profiles"]:
            label = profile["role"] + "-" + size + ("" if args.course == "welcome" and not args.extended_welcome else "-" + profile["variant"])
            if args.course != "welcome" or args.extended_welcome:
                content_size = profile["contentSize"]
                run("set-content-size-" + label, ["/usr/bin/xcrun", "simctl", "ui", device, "content_size", content_size])
                observed = run("get-content-size-" + label, ["/usr/bin/xcrun", "simctl", "ui", device, "content_size"]).decode().strip()
                assert observed == content_size, (label, observed, content_size)
            if variant_native:
                app = Path(profile["derivedData"]) / "Build/Products/Debug-iphonesimulator" / (profile["scheme"] + ".app")
                run("install-" + label, ["/usr/bin/xcrun", "simctl", "install", device, str(app)])
                installed = Path(run("installed-app-" + label, ["/usr/bin/xcrun", "simctl", "get_app_container", device, profile["bundleIdentifier"], "app"]).decode().strip())
                binary_names = [profile["scheme"], profile["scheme"] + ".debug.dylib"]
                hashes = {}
                for name in binary_names:
                    assert (app / name).is_file() and (installed / name).is_file()
                    digest = hashlib.sha256((app / name).read_bytes()).hexdigest()
                    assert hashlib.sha256((installed / name).read_bytes()).hexdigest() == digest
                    hashes[name] = digest
                record["installedApps"].append(dict(case=label, device=device, bundleIdentifier=profile["bundleIdentifier"],
                                                    builtApp=str(app), installedApp=str(installed), binaryHashes=hashes,
                                                    builtAndInstalledBytesMatch=True))
                args.proof.write_text(json.dumps(record, indent=2) + "\n")
            result = RESULTS / (label + ".xcresult")
            status, stdout, stderr = run("ui-" + label, [
                "/usr/bin/xcrun", "xcodebuild", "test-without-building", "-project", profile["project"],
                "-scheme", profile["scheme"], "-configuration", "Debug", "-jobs", "1",
                "-destination", "platform=iOS Simulator,id=" + device, "-destination-timeout", "60",
                "-parallel-testing-enabled", "NO", "-maximum-concurrent-test-simulator-destinations", "1",
                "-derivedDataPath", profile["derivedData"], "-resultBundlePath", str(result),
                "SWIFT_VERSION=6.0", "IPHONEOS_DEPLOYMENT_TARGET=17.0", "CODE_SIGNING_ALLOWED=NO"
            ], timeout=600, check=False)
            assert result.exists(), (label, status, stdout.decode(errors="replace")[-6000:],
                                     stderr.decode(errors="replace")[-4000:])
            summary = json.loads(run("summary-" + label, [
                "/usr/bin/xcrun", "xcresulttool", "get", "test-results", "summary", "--path", str(result)
            ]))
            passed = status == 0 and summary.get("totalTestCount") == summary.get("passedTests") == 1 \
                and summary.get("failedTests") == summary.get("skippedTests") == 0
            record["simulatorTests"].append(dict(role=profile["role"], size=size, model=model["name"],
                                                variant=profile["variant"], contentSize=profile.get("contentSize", "system default"),
                                                passed=passed, resultBundle=str(result),
                                                executedTests=summary.get("totalTestCount"),
                                                processExitCode=status, testSummary=summary))
            args.proof.write_text(json.dumps(record, indent=2) + "\n")
            assert passed, (label, status, summary)
            if args.course == "hobby" and profile["role"] == "solution":
                visual = WORK / "rendered-text" / label
                run("text-attachments-" + label, ["/usr/bin/xcrun", "xcresulttool", "export", "attachments",
                                                   "--path", str(result), "--output-path", str(visual)])
                attachments = [a for entry in json.loads((visual / "manifest.json").read_text())
                               for a in entry["attachments"] if a["exportedFileName"].endswith(".png")
                               and not a["isAssociatedWithFailure"]]
                expected_text = {
                    "Complete Hobby summary": "Scout a neighborhood and collect strong compositions.",
                    "Complete Hobby schedule": "Scheduled for Tuesday",
                    "Complete Hobby save action": "Save Favorite",
                    "Complete Hobby remove action": "Remove Favorite",
                }
                for name, expected in expected_text.items():
                    chosen = [a for a in attachments if a["suggestedHumanReadableName"].startswith(name + "_")]
                    assert len(chosen) == 1, (label, name, chosen)
                    image = visual / chosen[0]["exportedFileName"]
                    observations = json.loads(run("text-" + label + "-" + name.lower().replace(" ", "-"),
                                                  [str(recognizer), str(image)]))[0]["observations"]
                    actual = " ".join(x["text"] for x in observations)
                    normalize = lambda value: re.sub("[^a-z0-9]", "", value.lower())
                    matched = normalize(expected) in normalize(actual)
                    record["renderedTextChecks"].append(dict(case=label, attachment=chosen[0]["suggestedHumanReadableName"],
                                                            imageSha256=hashlib.sha256(image.read_bytes()).hexdigest(),
                                                            expected=expected, observed=actual, matched=matched))
                    args.proof.write_text(json.dumps(record, indent=2) + "\n")
                    assert matched, (label, name, expected, actual)
    finally:
        try:
            run("shutdown-" + size, ["/usr/bin/xcrun", "simctl", "shutdown", device])
        except AssertionError:
            pass
        run("delete-" + size, ["/usr/bin/xcrun", "simctl", "delete", device])
        record["ownedSimulatorsDeleted"].append(device)
        args.proof.write_text(json.dumps(record, indent=2) + "\n")
record.update(at=now(), accepted=len(record["exports"]) == 8 and len(record["simulatorTests"]) == (4 if args.course == "welcome" and not args.extended_welcome else 8)
              and all(row["passed"] for row in record["simulatorTests"])
              and len(record["ownedSimulatorsDeleted"]) == 2)
if variant_native:
    record["accepted"] &= len(record["installedApps"]) == 8
if args.course == "hobby":
    record["accepted"] &= len(record["renderedTextChecks"]) == 16 and all(x["matched"] for x in record["renderedTextChecks"])
args.proof.write_text(json.dumps(record, indent=2) + "\n")
if args.diagnostic_map_case:
    record["diagnosticPassed"] = not record["accepted"] and len(record["exports"]) == 8 \
        and len(record["simulatorTests"]) == len(record["installedApps"]) == 1 \
        and record["simulatorTests"][0]["passed"] and len(record["ownedSimulatorsDeleted"]) == 1
    args.proof.write_text(json.dumps(record, indent=2) + "\n")
    assert record["diagnosticPassed"]
else:
    assert record["accepted"]
print(json.dumps(record, indent=2))
