"""Create native tracker targets from the actual browser-edited chosen-role ZIPs."""
import argparse
import importlib.util
import json
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def generate(browser, output, course, variant):
    spec = importlib.util.spec_from_file_location("swift_export_xcode", ROOT / "test/swift-welcome-xcode.py")
    builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(builder)
    files = ("ContentView.swift", "SimpleTrackerApp.swift", "TrackerItem.swift", "TrackerStore.swift") if course == "tracker" else ("ContentView.swift", "PersistentTrackerApp.swift", "TrackerRecord.swift", "TrackerPersistence.swift")
    shared = ("README.md", "verify-tracker.py", "tests/TrackerContracts.swift") if course == "tracker" else ("README.md", "verify-persistence.py", "tests/PersistenceContracts.swift", "Package.swift", "tests/PersistenceTests.swift")
    template = (ROOT / "test/fixtures/swift-tracker-uitests.swift").read_text() + "\n" + (ROOT / "test/fixtures/swift-tracker-storage-uitests.swift").read_text()
    template = template.replace("OPEN_FAILURE", "true" if variant == "open-failure" else "false").replace("READ_ONLY", "true" if variant == "read-only" else "false")
    template = template.replace("SWIFT_DATA", "true" if course == "swiftdata" else "false").replace("LONG_TEXT", "true" if variant == "long-text" else "false")
    result = builder.generate(browser, output, kind=course, source_files=files, shared_files=shared,
                              ui_template=template, bundle_suffix=variant)
    if variant in ("open-failure", "read-only"):
        assert course == "swiftdata"
        for profile in result["profiles"]:
            path = output / profile["role"] / profile["role"] / "PersistentTrackerApp.swift"
            before = path.read_bytes()
            original = "TrackerRootView(inMemory: " + ("true" if profile["role"] == "starter" else "false") + ")"
            replacement = 'TrackerRootView(inMemory: false, storeURL: URL(fileURLWithPath: "/dev/null/tracker.store"))' if variant == "open-failure" else "ReadOnlyTrackerFixture()"
            text = before.decode()
            assert text.count(original) >= 1
            text = text.replace(original, replacement, 1)
            if variant == "read-only":
                text = "import Foundation\n" + text + "\n" + (ROOT / "test/fixtures/swift-tracker-readonly-app.swift").read_text()
            path.write_text(text)
            profile["declaredSourceVariant"] = dict(path=str(path.relative_to(output)), originalSha256=hashlib.sha256(before).hexdigest(), sha256=hashlib.sha256(path.read_bytes()).hexdigest(), change="Only app-entry storage configuration is replaced for an isolated failure fixture. ContentView, model, repository and error handling are unchanged.")
    for profile in result["profiles"]:
        profile.update(variant=variant, contentSize="large" if variant == "standard" else "accessibility-extra-extra-extra-large")
    result.update(variant=variant, course=course, appSourceUnmodified=variant in ("standard", "long-text"))
    (output / "inputs.json").write_text(json.dumps(result, indent=2) + "\n")
    return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--course", choices=("tracker", "swiftdata"), required=True)
    parser.add_argument("--variant", choices=("standard", "long-text", "open-failure", "read-only"), required=True)
    args = parser.parse_args()
    print(json.dumps(generate(args.browser.resolve(), args.output.resolve(), args.course, args.variant)))
