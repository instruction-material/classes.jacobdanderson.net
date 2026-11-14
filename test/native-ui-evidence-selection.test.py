"""Exercise original result selection without Xcode, builds or test reruns."""
import importlib.util
import io
import json
from pathlib import Path
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "native_ui_evidence", ROOT / "scripts/inspect-native-ui-evidence.py")
inspector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(inspector)


def archive(course="capstone", role="solution", size="small",
            variant="standard", failures=1, second_course=None):
    data = io.BytesIO()
    profiles = [dict(role=role, size=size, variant=variant, passed=False)
                for _ in range(failures)]
    with zipfile.ZipFile(data, "w") as bundle:
        bundle.writestr(course + "/proof.json", json.dumps(
            dict(simulatorTests=profiles)))
        bundle.writestr(course + "/results/" + role + "-" + size + "-"
                        + variant + ".xcresult/Info.plist", "result")
        bundle.writestr(course + "/results/starter-large-standard.xcresult/Info.plist",
                        "unrelated successful result")
        if second_course:
            bundle.writestr(second_course + "/proof.json", "{}")
    return zipfile.ZipFile(data)


class NativeResultSelectionTests(unittest.TestCase):
    def test_selects_exact_capstone_failure_and_excludes_other_results(self):
        with archive() as bundle:
            selected = inspector.select_failed_result(bundle)
        self.assertEqual(selected["course"], "capstone")
        self.assertEqual(selected["result"],
                         "capstone/results/solution-small-standard.xcresult")
        self.assertEqual(selected["testId"],
                         "CanonicalCourseUITests/testCourseWorkflow()")
        self.assertEqual(len(selected["selected"]), 2)

    def test_preserves_original_tracker_profile(self):
        with archive(course="tracker", size="large") as bundle:
            selected = inspector.select_failed_result(bundle)
        self.assertEqual(selected["result"],
                         "tracker/results/solution-large-standard.xcresult")
        self.assertEqual(selected["testId"], "TrackerUITests/testTrackerWorkflow()")

    def test_selects_swiftdata_failure_with_its_tracker_ui_identifier(self):
        with archive(course="swiftdata") as bundle:
            selected = inspector.select_failed_result(bundle)
        self.assertEqual(selected["course"], "swiftdata")
        self.assertEqual(selected["result"],
                         "swiftdata/results/solution-small-standard.xcresult")
        self.assertEqual(selected["testId"], "TrackerUITests/testTrackerWorkflow()")
        self.assertEqual(len(selected["selected"]), 2)

    def test_rejects_mixed_tracker_and_swiftdata_proofs(self):
        with archive(course="swiftdata", second_course="tracker") as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_accepts_largest_text_profile(self):
        with archive(variant="largest-text") as bundle:
            selected = inspector.select_failed_result(bundle)
        self.assertTrue(selected["result"].endswith("small-largest-text.xcresult"))

    def test_rejects_ambiguous_course_proofs(self):
        with archive(second_course="tracker") as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_rejects_unknown_course(self):
        with archive(course="unknown") as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_rejects_multiple_failures(self):
        with archive(failures=2) as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_rejects_missing_failure(self):
        with archive(failures=0) as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_rejects_unexpected_profile_path(self):
        for field in [dict(role="../solution"), dict(size="../small"),
                      dict(variant="../standard")]:
            with self.subTest(field=field), archive(**field) as bundle:
                with self.assertRaises(AssertionError):
                    inspector.select_failed_result(bundle)


class FailedProducerSelectionTests(unittest.TestCase):
    def setUp(self):
        self.repo = "anderson-webops/classes.jacobdanderson.net"
        self.head = "a" * 40
        self.run = dict(id=123, repository=dict(full_name=self.repo, id=10),
                        path=".github/workflows/ci.yml", status="in_progress",
                        conclusion=None, head_sha=self.head)
        self.artifact = dict(id=456, name="swift-tracker-ui-tracker",
                             digest="sha256:" + "b" * 64, expired=False,
                             created_at="2026-11-08T18:24:56Z",
                             workflow_run=dict(id=123, head_sha=self.head,
                                               repository_id=10, head_repository_id=10))
        self.job = dict(id=789, run_id=123, name="swift-tracker-ui (tracker)",
                        status="completed", conclusion="failure", head_sha=self.head,
                        started_at="2026-11-08T18:09:47Z",
                        completed_at="2026-11-08T18:25:04Z")

    def select(self, jobs=None):
        return inspector.select_failed_producer(self.repo, self.run, self.artifact,
                                                 jobs if jobs is not None else [self.job])

    def test_authenticates_completed_failure_while_other_jobs_continue(self):
        self.assertEqual(self.select()["job"]["id"], 789)
        self.assertEqual(self.select()["course"], "tracker")

    def test_accepts_terminal_failed_run_and_earlier_attempt(self):
        self.run.update(status="completed", conclusion="failure")
        later = dict(self.job, id=790, conclusion="success",
                     started_at="2026-11-08T18:26:00Z",
                     completed_at="2026-11-08T18:30:00Z")
        self.assertEqual(self.select([later, self.job])["job"]["id"], 789)

    def test_rejects_active_successful_or_other_source_jobs(self):
        for change in [dict(status="in_progress"), dict(conclusion="success"),
                       dict(head_sha="c" * 40), dict(run_id=999), dict(name="unrelated")]:
            with self.subTest(change=change):
                with self.assertRaises(AssertionError):
                    self.select([dict(self.job, **change)])

    def test_requires_upload_time_within_failed_job(self):
        for changed in [dict(started_at="2026-11-08T18:25:00Z"),
                        dict(completed_at="2026-11-08T18:24:00Z")]:
            with self.subTest(changed=changed):
                with self.assertRaises(AssertionError):
                    self.select([dict(self.job, **changed)])

    def test_rejects_ambiguous_uploader_jobs(self):
        with self.assertRaises(AssertionError):
            self.select([self.job, dict(self.job, id=800)])

    def test_rejects_other_producer_repository_or_workflow(self):
        for change in [dict(path=".github/workflows/unknown.yml"),
                       dict(repository=dict(full_name="other/repo", id=10))]:
            original = dict(self.run)
            self.run.update(change)
            with self.assertRaises(AssertionError):
                self.select()
            self.run = original

    def test_rejects_other_source_and_unknown_or_expired_upload(self):
        for change in [dict(name="unrelated"), dict(expired=True),
                       dict(workflow_run=dict(self.artifact["workflow_run"], head_sha="c" * 40)),
                       dict(workflow_run=dict(self.artifact["workflow_run"], head_repository_id=11))]:
            original = dict(self.artifact)
            self.artifact.update(change)
            with self.assertRaises(AssertionError):
                self.select()
            self.artifact = original

    def test_rejects_inconsistent_successful_parent(self):
        self.run.update(status="completed", conclusion="success")
        with self.assertRaises(AssertionError):
            self.select()

    def test_requires_exact_uploader_id_and_digest(self):
        good = "Artifact ID: 456\nSHA256 digest of uploaded artifact is " + "b" * 64
        for label in ["Artifact ID: 456", "Artifact ID 456", "Artifact ID is 456"]:
            inspector.verify_failed_upload(label + "\nSHA256 digest of uploaded artifact is " + "b" * 64,
                                           self.artifact)
        for bad in [good.replace("456", "4567"), good.replace("b" * 64, "c" * 64)]:
            with self.assertRaises(AssertionError):
                inspector.verify_failed_upload(bad, self.artifact)


if __name__ == "__main__":
    unittest.main()
