"""Regressions for distinct saved projects sharing one Network source pack."""
import copy
import hashlib
from pathlib import Path
import tempfile
import unittest

from network_export_receipts import export_profile, read_export


class ExportReceiptTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.output = Path(self.directory.name)
        self.fixture = {"pack": "shared-lab", "coreItemId": "core-item", "revision": "a" * 40}
        self.profile = self.make_profile("core-item")
        self.other = self.make_profile("optional-item")
        self.browser = {"profiles": [self.other, self.profile]}

    def make_profile(self, item, role="starter", width=390, version=""):
        source_role = "starter" if role == "starter" else "reference"
        key = f"network-systems:{item}:{source_role}:native-network{version}"
        prefix = "shared-lab-" + hashlib.sha256(key.encode()).hexdigest()[:12]
        profile = dict(pack="shared-lab", role=role, width=width, key=key, revision="a" * 40,
                       consentBeforeFetch=True, savedEditReopened=True, previousWorkPreserved=True, remoteWrites=0)
        for variant in ["exact", "edited"]:
            raw = (item + role + variant).encode()
            name = f"{prefix}-{role}-{width}-{variant}.zip"
            (self.output / name).write_bytes(raw)
            profile[variant + "Archive"] = name
            profile[variant + "ArchiveSha256"] = hashlib.sha256(raw).hexdigest()
        return profile

    def test_shared_pack_selects_the_requested_saved_project(self):
        actual = export_profile(self.browser, self.fixture, "starter", 390)
        self.assertIs(actual, self.profile)
        self.assertEqual(read_export(self.output, actual, "exact")[1], b"core-itemstarterexact")

    def test_reference_role_and_phone_width_stay_distinct(self):
        profile = self.make_profile("core-item", "solution", 1280)
        self.browser["profiles"].append(profile)
        self.assertIs(export_profile(self.browser, self.fixture, "solution", 1280), profile)

    def test_versioned_saved_project_stays_distinct(self):
        profile = self.make_profile("core-item", version="-v2")
        self.browser["profiles"].append(profile)
        self.fixture["projectKeyVersion"] = 2
        self.assertIs(export_profile(self.browser, self.fixture, "starter", 390), profile)

    def test_missing_profile_fails(self):
        with self.assertRaises(AssertionError):
            export_profile(self.browser, self.fixture, "solution", 390)

    def test_duplicate_profile_fails(self):
        self.browser["profiles"].append(copy.deepcopy(self.profile))
        with self.assertRaises(AssertionError):
            export_profile(self.browser, self.fixture, "starter", 390)

    def test_changed_source_revision_fails(self):
        self.profile["revision"] = "b" * 40
        with self.assertRaises(AssertionError):
            export_profile(self.browser, self.fixture, "starter", 390)

    def test_unconfirmed_import_fails(self):
        self.profile["consentBeforeFetch"] = False
        with self.assertRaises(AssertionError):
            export_profile(self.browser, self.fixture, "starter", 390)

    def test_remote_write_fails(self):
        self.profile["remoteWrites"] = 1
        with self.assertRaises(AssertionError):
            export_profile(self.browser, self.fixture, "starter", 390)

    def test_changed_archive_bytes_fail(self):
        (self.output / self.profile["exactArchive"]).write_bytes(b"changed")
        with self.assertRaises(AssertionError):
            read_export(self.output, self.profile, "exact")

    def test_other_projects_archive_fails(self):
        self.profile["exactArchive"] = self.other["exactArchive"]
        self.profile["exactArchiveSha256"] = self.other["exactArchiveSha256"]
        with self.assertRaises(AssertionError):
            read_export(self.output, self.profile, "exact")

    def test_path_escape_fails(self):
        self.profile["exactArchive"] = "../" + self.profile["exactArchive"]
        with self.assertRaises(AssertionError):
            read_export(self.output, self.profile, "exact")

    def test_edited_export_uses_its_own_receipt(self):
        self.assertEqual(read_export(self.output, self.profile, "edited")[1], b"core-itemstarteredited")


if __name__ == "__main__":
    unittest.main()
