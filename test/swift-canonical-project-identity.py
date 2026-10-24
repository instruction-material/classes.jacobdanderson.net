"""Check selected-role source and distinct native course/variant identities."""
import json
from pathlib import Path
import re
import tempfile
import unittest

import importlib.util

ROOT = Path(__file__).resolve().parents[1]


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


class CanonicalProjectIdentityTests(unittest.TestCase):
    def test_welcome_variants_keep_unmodified_roles_and_distinct_apps(self):
        generator = load("welcome_extended", ROOT / "test/swift-welcome-extended-xcode.py")
        fixtures = load("tracker_identity", ROOT / "test/swift-tracker-project-identity.py")
        with tempfile.TemporaryDirectory(prefix="welcome-extended-identity-") as directory:
            root = Path(directory)
            browser = fixtures.browser_inputs(root, "welcome")
            source = json.loads((ROOT / "test/fixtures/swift-welcome-source.json").read_text())
            identifiers = set()
            for variant in ("standard", "long-note"):
                output = root / variant
                result = generator.generate(browser, output, variant)
                project = (Path(result["project"]) / "project.pbxproj").read_text()
                current = set(re.findall(r'"PRODUCT_BUNDLE_IDENTIFIER"\s*=\s*"([^"]+)"', project))
                self.assertEqual(len(current), 4)
                self.assertFalse(identifiers & current)
                identifiers.update(current)
                for profile in result["profiles"]:
                    role = profile["role"]
                    for name, file in source["files"].items():
                        relative = name.removeprefix(source["pack"] + "/")
                        selected = relative.startswith(role + "/") or not relative.startswith(("starter/", "solution/"))
                        path = output / role / relative
                        self.assertEqual(path.exists(), selected)
                        if selected:
                            self.assertEqual(path.read_bytes(), file["content"].encode())
            self.assertEqual(len(identifiers), 8)

    def test_selected_role_sources_and_installation_identities(self):
        generator = load("canonical_generator", ROOT / "test/swift-canonical-xcode.py")
        fixtures = load("tracker_identity", ROOT / "test/swift-tracker-project-identity.py")
        with tempfile.TemporaryDirectory(prefix="canonical-course-identity-") as directory:
            root = Path(directory)
            identifiers = set()
            for course in generator.COURSES:
                browser = fixtures.browser_inputs(root, course)
                source = json.loads((ROOT / f"test/fixtures/swift-{course}-source.json").read_text())
                for variant in ("standard", "largest-text"):
                    output = root / (course + "-" + variant)
                    result = generator.generate(browser, output, course, variant)
                    project = (Path(result["project"]) / "project.pbxproj").read_text()
                    current = set(re.findall(r'"PRODUCT_BUNDLE_IDENTIFIER"\s*=\s*"([^"]+)"', project))
                    self.assertEqual(len(current), 4)
                    self.assertFalse(identifiers & current)
                    identifiers.update(current)
                    for profile in result["profiles"]:
                        role = profile["role"]
                        self.assertIn(profile["bundleIdentifier"], current)
                        self.assertTrue(profile["bundleIdentifier"].endswith("." + variant))
                        for name, file in source["files"].items():
                            relative = name.removeprefix(source["pack"] + "/")
                            selected = relative.startswith(role + "/") or not relative.startswith(("starter/", "solution/"))
                            path = output / role / relative
                            self.assertEqual(path.exists(), selected)
                            if selected:
                                self.assertEqual(path.read_bytes(), file["content"].encode())
            self.assertEqual(len(identifiers), 32)

    def test_unrecognized_course_or_variant_is_rejected_before_writing(self):
        generator = load("canonical_generator", ROOT / "test/swift-canonical-xcode.py")
        with tempfile.TemporaryDirectory(prefix="canonical-invalid-input-") as directory:
            root = Path(directory)
            for course, variant in (("unknown", "standard"), ("gallery", "../other")):
                with self.assertRaises(AssertionError):
                    generator.generate(root / "unused", root / "output", course, variant)
                self.assertFalse((root / "output").exists())


if __name__ == "__main__":
    unittest.main()
