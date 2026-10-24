"""Check isolated native variant identities using source-bound synthetic ZIP inputs."""
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    loaded = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(loaded)
    return loaded


def browser_inputs(root, course):
    fixture = json.loads((ROOT / "test/fixtures" / ("swift-" + course + "-source.json")).read_text())
    browser = root / ("browser-" + course)
    browser.mkdir()
    profiles = []
    for role in ("starter", "solution"):
        selected = {}
        for path, file in fixture["files"].items():
            name = path.removeprefix(fixture["pack"] + "/")
            if name.startswith(role + "/") or not name.startswith(("starter/", "solution/")):
                raw = file["content"].encode()
                assert hashlib.sha256(raw).hexdigest() == file["sha256"]
                selected[name] = raw
        for width in (390, 1280):
            archive = browser / (role + "-" + str(width) + ".zip")
            with zipfile.ZipFile(archive, "w") as output:
                for name, raw in selected.items():
                    output.writestr("project/" + name, raw)
            profiles.append(dict(
                role=role, width=width, editedArchive=archive.name,
                editedArchiveSha256=hashlib.sha256(archive.read_bytes()).hexdigest(),
                editedFiles=[dict(name=name, sha256=hashlib.sha256(raw).hexdigest()) for name, raw in selected.items()]
            ))
    (browser / ("swift-swift-" + course + "-course-proof.json")).write_text(json.dumps(dict(profiles=profiles)))
    return browser


class TrackerProjectIdentityTests(unittest.TestCase):
    def test_variant_installation_identities(self):
        generator = module("tracker_generator", ROOT / "test/swift-tracker-xcode.py")
        with tempfile.TemporaryDirectory(prefix="tracker-variant-identity-") as directory:
            root = Path(directory)
            for course, variants in [("tracker", ("standard", "long-text")),
                                     ("swiftdata", ("standard", "long-text", "open-failure", "read-only"))]:
                browser = browser_inputs(root, course)
                all_apps = set()
                all_tests = set()
                generated_profiles = []
                for variant in variants:
                    output = root / (course + "-" + variant)
                    generated = generator.generate(browser, output, course, variant)
                    project = (Path(generated["project"]) / "project.pbxproj").read_text()
                    identifiers = set(re.findall(r'"PRODUCT_BUNDLE_IDENTIFIER"\s*=\s*"([^"]+)"', project))
                    apps = {value for value in identifiers if not value.endswith(".uitests")}
                    tests = identifiers - apps
                    self.assertEqual(len(apps), 2)
                    self.assertEqual(tests, {value + ".uitests" for value in apps})
                    all_apps.update(apps)
                    all_tests.update(tests)
                    generated_profiles.extend((profile, apps, variant) for profile in generated["profiles"])
                with self.subTest(course=course):
                    self.assertEqual(len(all_apps), len(variants) * 2, "Each source variant must install as a distinct app")
                    self.assertEqual(len(all_tests), len(variants) * 2)
                    for profile, apps, variant in generated_profiles:
                        self.assertIn(profile["bundleIdentifier"], apps)
                        self.assertTrue(profile["bundleIdentifier"].endswith("." + variant))

    def test_open_failure_changes_the_main_entry_without_changing_store_or_view(self):
        generator = module("tracker_generator", ROOT / "test/swift-tracker-xcode.py")
        with tempfile.TemporaryDirectory(prefix="tracker-fault-input-") as directory:
            root = Path(directory)
            browser = browser_inputs(root, "swiftdata")
            fixture = json.loads((ROOT / "test/fixtures/swift-swiftdata-source.json").read_text())
            output = root / "open-failure"
            result = generator.generate(browser, output, "swiftdata", "open-failure")
            for profile in result["profiles"]:
                role = profile["role"]
                app = output / role / role / "PersistentTrackerApp.swift"
                entry = app.read_text().split("struct TrackerRootView: View")[0]
                self.assertIn('storeURL: URL(fileURLWithPath: "/dev/null/tracker.store")', entry)
                for name in ("ContentView.swift", "TrackerRecord.swift", "TrackerPersistence.swift"):
                    actual = (output / role / role / name).read_bytes()
                    expected = fixture["files"][fixture["pack"] + "/" + role + "/" + name]["content"].encode()
                    self.assertEqual(actual, expected)

    def test_default_welcome_identifiers_remain_compatible(self):
        generator = module("welcome_generator", ROOT / "test/swift-welcome-xcode.py")
        with tempfile.TemporaryDirectory(prefix="welcome-default-identity-") as directory:
            root = Path(directory)
            result = generator.generate(browser_inputs(root, "welcome"), root / "welcome")
            self.assertEqual({row["bundleIdentifier"] for row in result["profiles"]},
                             {"org.example.classes.swiftwelcome.starter", "org.example.classes.swiftwelcome.solution"})

    def test_invalid_variant_identifier_is_rejected_before_writing(self):
        generator = module("welcome_generator", ROOT / "test/swift-welcome-xcode.py")
        with tempfile.TemporaryDirectory(prefix="welcome-invalid-identity-") as directory:
            root = Path(directory)
            for suffix in ("", "../other", "two.parts", "white space", "UPPER"):
                with self.subTest(suffix=suffix):
                    with self.assertRaises(AssertionError):
                        generator.generate(root / "unused-browser", root / "unused-output", bundle_suffix=suffix)
                    self.assertFalse((root / "unused-output").exists())


if __name__ == "__main__":
    unittest.main()
