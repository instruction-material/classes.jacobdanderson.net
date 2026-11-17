"""Execute exact and edited browser exports with independent numerical checks."""
from pathlib import Path, PurePosixPath
import csv
import datetime
import hashlib
import importlib
import json
import math
import os
import re
import signal
import struct
import subprocess
import sys
import tempfile
import zipfile

fixture = json.loads(Path("test/fixtures/machine-learning-library-workspaces.json").read_text())
assert len(fixture["projects"]) == 12 and len(fixture["files"]) == 80

if sys.argv[1] == "--write-locks":
    directory = Path(sys.argv[2])
    directory.mkdir(parents=True, exist_ok=True)
    legacy = json.loads(Path("test/fixtures/machine-learning-legacy-clustering-sources.json").read_text())
    verification = legacy["verificationRequirements"]
    assert hashlib.sha256(verification["content"].encode()).hexdigest() == verification["sha256"]
    locks = {row["content"] for name, row in fixture["files"].items() if name.endswith("/requirements.txt")}
    old_locks = {row["content"] for name, row in legacy["files"].items() if name.endswith("/requirements.txt")}
    assert locks == old_locks and len(locks) == 1
    (directory / "verification.txt").write_text(verification["content"])
    (directory / "runtime.txt").write_text(locks.pop())
    sys.exit(0)

np = importlib.import_module("numpy")

root = Path(sys.argv[1]).resolve()
selected = list(filter(None, os.environ.get("ML_LIBRARY_PROJECTS", "").split(",")))
assert all(value in {row["caseId"] for row in fixture["projects"]} for value in selected)
projects = [row for row in fixture["projects"] if not selected or row["caseId"] in selected]
assert projects
records = []
profiles = []


def digest(data):
    return hashlib.sha256(data).hexdigest()


def close(actual, expected, tolerance=1e-8):
    assert math.isclose(float(actual), float(expected), rel_tol=tolerance, abs_tol=tolerance), (actual, expected)


def classification(truth, predictions, labels):
    matrix = [[sum(a == left and b == right for a, b in zip(truth, predictions))
               for right in labels] for left in labels]
    recalls, scores = [], []
    for i in range(len(labels)):
        tp = matrix[i][i]
        support = sum(matrix[i])
        predicted = sum(row[i] for row in matrix)
        recall = tp / support if support else 0
        precision = tp / predicted if predicted else 0
        recalls.append(recall)
        scores.append(2 * precision * recall / (precision + recall) if precision + recall else 0)
    return {"accuracy": sum(matrix[i][i] for i in range(len(labels))) / len(truth),
            "balanced_accuracy": sum(recalls) / len(recalls),
            "macro_f1": sum(scores) / len(scores), "confusion_matrix": matrix}


def regression(truth, predictions):
    actual, predicted = np.array(truth), np.array(predictions)
    errors = actual - predicted
    return {"mae_years": np.abs(errors).mean(), "rmse_years": np.sqrt((errors ** 2).mean()),
            "r_squared": 1 - np.sum(errors ** 2) / np.sum((actual - actual.mean()) ** 2)}


def check_metrics(actual, expected):
    for name, value in expected.items():
        if name in actual:
            if isinstance(value, list):
                assert actual[name] == value
            else:
                close(actual[name], value)


def check_outputs(case, directory, stdout, source):
    report_name = {"customer-neighbors": "classification-report.json", "car-neighbors": "classification-report.json",
                   "email-naive-bayes": "spam-report.json", "country-year-regression": "regression-report.json"}.get(case)
    report = json.loads((directory / report_name).read_text()) if report_name else None
    if case in {"customer-neighbors", "car-neighbors", "email-naive-bayes"}:
        assert report["model_fixed_before_test"]
        assert not set(report["train_ids"]) & set(report["test_ids"])
        expected = classification(report["test_truth"], report["test_predictions"], report["class_labels"])
        check_metrics(report["metrics"], expected)
        check_metrics(report["baseline_metrics"], classification(report["test_truth"], report["baseline_predictions"], report["class_labels"]))
        assert len(report["test_truth"]) == report["test_rows"]
        if case == "customer-neighbors":
            assert report["rows"] == 200 and report["train_rows"] == 150 and report["test_rows"] == 50
            assert report["cluster_fitted_rows"] == report["neighbor_fitted_rows"] == 150
            rows = list(csv.DictReader((source / "customers.csv").open()))
            training = np.array([[float(rows[i][name]) for name in report["features"]] for i in report["train_ids"]])
            np.testing.assert_allclose(report["training_means"], training.mean(axis=0))
            np.testing.assert_allclose(report["training_variances"], training.var(axis=0))
        elif case == "car-neighbors":
            assert report["rows"] == 1728 and report["fitted_rows"] == report["train_rows"] == 1296
            assert report["test_rows"] == 432 and report["neighbors"] == 7
            buying = len(report["fitted_categories"][0])
            assert report["unknown_probe"]["encoded"][:buying] == [0.0] * buying
            assert sum(report["unknown_probe"]["encoded"][buying:]) == 5
        else:
            assert report["input_rows"] == 66 and report["rows"] == 64 and report["duplicates_removed"] == 2
            assert (report["train_rows"], report["validation_rows"], report["test_rows"]) == (38, 13, 13)
            assert not set(report["validation_ids"]) & (set(report["train_ids"]) | set(report["test_ids"]))
            assert report["fictional"] and report["chosen_model"] == "default count vectorizer"
    elif case == "country-year-regression":
        assert report["rows_read"] == 2938 and report["rows"] == 2928 and report["model_frozen_before_test"]
        assert not set(report["countries"]["train"]) & set(report["countries"]["test"])
        assert not set(report["countries"]["validation"]) & (set(report["countries"]["train"]) | set(report["countries"]["test"]))
        check_metrics(report["metrics"], regression(report["test_truth"], report["test_predictions"]))
        check_metrics(report["baseline_metrics"], regression(report["test_truth"], report["baseline_predictions"]))
        for degree in ("1", "2"):
            check_metrics(report["candidate_test_metrics"][degree], regression(report["test_truth"], report["candidate_test_predictions"][degree]))
        assert report["selected_degree"] == (2 if report["validation_metrics"]["2"]["mae_years"] < .98 * report["validation_metrics"]["1"]["mae_years"] else 1)
        slices = report["evaluation"]["slices"]
        for left, right in [("year_at_or_below_training_median", "year_above_training_median"), ("complete_covariates", "missing_covariates")]:
            assert slices[left]["rows"] + slices[right]["rows"] == report["test_rows"]
            close(sum(slices[name]["rows"] * (slices[name]["mae_years"] or 0) for name in (left, right)) / report["test_rows"], report["metrics"]["mae_years"])
        uncertainty = report["evaluation"]["uncertainty"]
        assert len(uncertainty["estimates_mae_years"]) == uncertainty["resamples"] == 200
        low, high = np.quantile(uncertainty["estimates_mae_years"], [.025, .975])
        close(uncertainty["lower_mae_years"], low)
        close(uncertainty["upper_mae_years"], high)
    elif case in {"linear-regression", "polynomial-regression"}:
        x = np.arange(1., 11.)
        y = np.array([4,5,6,3,5,7,3,9,13,14] if case == "linear-regression" else [10,8,7.5,7,6,6,7,9,8.5,11])
        predictions = [float(v) for v in re.findall(r"Predicted value of y for x = 7: ([^\n]+)", stdout)]
        scores = [float(v) for v in re.findall(r"Training R-squared: ([^\n]+)", stdout)]
        degrees = [1] if case == "linear-regression" else [1, 2]
        assert len(predictions) == len(scores) == len(degrees)
        for i, degree in enumerate(degrees):
            design = np.column_stack([x ** power for power in range(degree + 1)])
            coefficients = np.linalg.lstsq(design, y, rcond=None)[0]
            fitted = design @ coefficients
            close(predictions[i], sum(value * 7 ** power for power, value in enumerate(coefficients)))
            close(scores[i], 1 - np.sum((y-fitted)**2) / np.sum((y-y.mean())**2))
        if case == "linear-regression":
            close(float(re.search(r"Pearson correlation: ([^\n]+)", stdout)[1]), np.corrcoef(x, y)[0, 1])
    else:
        assert case == "iris-naive-bayes"
        # Independent Gaussian calculation on the same declared split, without GaussianNB.
        from sklearn.model_selection import train_test_split
        rows = list(csv.DictReader((source / "iris.csv").open()))
        features = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
        x = np.array([[float(row[name]) for name in features] for row in rows])
        y = np.array([row["species"] for row in rows])
        train_x, test_x, train_y, test_y = train_test_split(x, y, test_size=.25, random_state=42, stratify=y)
        labels = sorted(set(train_y))
        epsilon = train_x.var(axis=0).max() * 1e-9
        scores = []
        for label in labels:
            values = train_x[train_y == label]
            variance = values.var(axis=0) + epsilon
            scores.append(np.log(len(values) / len(train_x)) - .5 * np.sum(np.log(2*np.pi*variance) + (test_x-values.mean(axis=0))**2/variance, axis=1))
        predicted = np.array(labels)[np.argmax(np.array(scores), axis=0)]
        expected = classification(test_y, predicted, labels)
        close(float(re.search(r"^Accuracy: ([^ ]+)", stdout, re.M)[1]), expected["accuracy"] * 100)
        close(float(re.search(r"GaussianNB macro F1: ([^\n]+)", stdout)[1]), expected["macro_f1"])
    figures = {"customer-neighbors": ["before_clustering.png", "clustered_graph.png"], "linear-regression": ["before.png", "after.png"], "polynomial-regression": ["before.png", "linear.png", "polynomial.png"]}.get(case, [])
    for name in figures:
        raw = (directory / name).read_bytes()
        assert raw[:8] == b"\x89PNG\r\n\x1a\n" and min(struct.unpack(">II", raw[16:24])) > 100
    return {path.name: {"bytes": path.stat().st_size, "sha256": digest(path.read_bytes())} for path in directory.iterdir() if path.is_file()}


def execute(script, cwd):
    args = [sys.executable, "-B", str(script)]
    now = lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
    event = dict(parentTask=os.environ.get("CLASSES_FAMILY_TASK_ID", "ml-library-export-check"), parentPid=os.getpid(), command=args, cwd=str(cwd), timeoutSeconds=60, startTime=now())
    process = subprocess.Popen(args, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
    event["pid"] = process.pid
    log_path = root / "native-processes.jsonl"
    with log_path.open("a") as log: log.write(json.dumps(dict(event, event="start")) + "\n")
    cleanup = "not needed"
    try:
        stdout, stderr = process.communicate(timeout=60)
        return process.returncode, stdout, stderr
    except BaseException:
        if process.poll() is None:
            os.killpg(process.pid, signal.SIGTERM)
            try: process.communicate(timeout=2)
            except subprocess.TimeoutExpired: os.killpg(process.pid, signal.SIGKILL); process.communicate()
        cleanup = "terminated and reaped"
        raise
    finally:
        with log_path.open("a") as log: log.write(json.dumps(dict(event, event="end", endTime=now(), exitCode=process.returncode, childProcessGroupCleanup=cleanup)) + "\n")


for source in fixture["files"].values():
    raw = source["content"].encode()
    assert len(raw) == source["byteLength"] and digest(raw) == source["sha256"]
    assert hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest() == source["gitBlob"]

for project in projects:
    directory = root / project["caseId"]
    course = json.loads((directory / ("data-" + project["caseId"] + "-course-proof.json")).read_text())
    assert {(row["role"], row["width"]) for row in course["profiles"]} == {(role, width) for role in ("starter", "solution") for width in (390, 1280)}
    for profile in course["profiles"]:
        assert profile["revision"] == fixture["revision"] and profile["nativeInstructions"]
        assert profile["lessonEvidence"]["completeAssignmentText"] and profile["consentBeforeFetch"]
        assert profile["codeAndTraceSaved"] and profile["sameAttemptReused"] and profile["previousWorkPreserved"]
        assert not profile["remoteWrites"] and not profile["additionalSourceRequests"]
        assert profile["editingEvidence"]["completedFittingFunctionSaved"] and profile["editingEvidence"]["completeREADMEKept"]
        assert profile["editingEvidence"]["nativeInstructionsObserved"] and not profile["editingEvidence"]["browserExecutionClaimed"]
        profiles.append(dict(project=project["caseId"], role=profile["role"], width=profile["width"]))
    archives = sorted(directory.glob("*.zip"))
    assert len(archives) == 8
    for archive in archives:
        role = archive.name.split("-")[0]
        assert role in {"starter", "solution"}
        edited = archive.name.endswith("-edited.zip")
        width = int(archive.name.split("-")[1])
        prefix = project["sources"][role] + "/"
        expected = {name.removeprefix(prefix): value["content"] for name, value in fixture["files"].items() if name.startswith(prefix)}
        marker = "ML workflow verified: " + project["caseId"]
        if edited:
            expected["exercise.py"] = fixture["files"][project["sources"]["solution"] + "/exercise.py"]["content"].replace("\r\n", "\n").replace("\r", "\n") + "\nprint(" + json.dumps(marker) + ")\n"
            expected["README.md"] += "\n# Independent library observation " + str(width) + "\n"
        with tempfile.TemporaryDirectory(prefix="ml-library-export-") as temporary:
            target = Path(temporary)
            with zipfile.ZipFile(archive) as bundle:
                names = bundle.namelist()
                assert names and len(names) == len(set(names)) and bundle.testzip() is None
                assert sum(item.file_size for item in bundle.infolist()) < 4_000_000
                assert all(not PurePosixPath(name).is_absolute() and ".." not in PurePosixPath(name).parts and "\\" not in name for name in names)
                roots = {PurePosixPath(name).parts[0] for name in names}
                assert len(roots) == 1 and all(len(PurePosixPath(name).parts) > 1 for name in names)
                assert all((item.external_attr >> 16) & 0o170000 != 0o120000 for item in bundle.infolist())
                bundle.extractall(target)
            source = target / next(iter(roots))
            actual = {p.relative_to(source).as_posix(): p.read_bytes() for p in source.rglob("*") if p.is_file()}
            assert set(actual) == set(expected)
            assert all(data == expected[name].encode() for name, data in actual.items())
            output = target / "independent-output"
            output.mkdir()
            code, stdout, stderr = execute(source / "main.py", output)
            stopped = role == "starter" and not edited
            if stopped:
                assert code != 0 and "NotImplementedError" in stderr and "exercise.py" in stderr
                evidence = {}
            else:
                assert code == 0, (project["caseId"], archive.name, stderr)
                assert "Traceback" not in stderr
                if edited: assert marker in stdout.splitlines()
                evidence = check_outputs(project["project"], output, stdout, source)
            assert all((source / name).read_bytes() == data for name, data in actual.items())
            records.append(dict(project=project["caseId"], model=project["project"], archive=archive.name, sourceRole=role, width=width,
                                edited=edited, sha256=digest(archive.read_bytes()), nativeExecuted=True, intentionalStarterStop=stopped,
                                exitCode=code, stdout=stdout, stderr=stderr, independentOutputEvidence=evidence))

proof = dict(accepted=True, source=fixture["revision"], projects=len(projects), courseProfiles=len(profiles), archives=len(records),
             nativeExecutions=len(records), successfulCompletedExecutions=sum(not row["intentionalStarterStop"] for row in records),
             intentionalStarterStops=sum(row["intentionalStarterStop"] for row in records), profiles=profiles, records=records)
assert proof["courseProfiles"] == len(projects) * 4 and proof["archives"] == proof["nativeExecutions"] == len(projects) * 8
assert proof["successfulCompletedExecutions"] == len(projects) * 6 and proof["intentionalStarterStops"] == len(projects) * 2
(root / "native-exports.json").write_text(json.dumps(proof, indent=2) + "\n")
print(json.dumps({key: proof[key] for key in ("accepted", "projects", "courseProfiles", "archives", "nativeExecutions", "intentionalStarterStops")}))
