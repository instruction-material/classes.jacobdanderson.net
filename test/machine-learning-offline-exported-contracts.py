import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import subprocess
import sys
import tempfile
import zipfile

root = Path(sys.argv[1])
fixture = json.loads(Path("test/fixtures/machine-learning-offline-sources.json").read_text())
selected = [value for value in os.environ.get("ML_OFFLINE_PROJECTS", "").split(",") if value]
assert all(value in {p["caseId"] for p in fixture["projects"]} for value in selected)
projects = [p for p in fixture["projects"] if not selected or p["caseId"] in selected]
assert projects
records = []
for project in projects:
    directory = root / project["caseId"]
    for archive in sorted(directory.glob("*.zip")):
        role = archive.name.split("-")[0]
        edited = archive.name.endswith("-edited.zip")
        with tempfile.TemporaryDirectory(prefix="ml-browser-export-") as temp:
            target = Path(temp)
            with zipfile.ZipFile(archive) as z:
                for name in z.namelist():
                    assert not name.startswith("/") and ".." not in Path(name).parts
                roots = {PurePosixPath(name).parts[0] for name in z.namelist()}
                assert len(roots) == 1 and all(len(PurePosixPath(name).parts) > 1 for name in z.namelist())
                assert all((z.getinfo(name).external_attr >> 16) & 0o170000 != 0o120000 for name in z.namelist())
                z.extractall(target)
                target = target / next(iter(roots))
            names = {p.relative_to(target).as_posix() for p in target.rglob("*") if p.is_file()}
            expected = {name.removeprefix(project["folder"] + "/" + role + "/"): value
                        for name, value in fixture["files"].items()
                        if name.startswith(project["folder"] + "/" + role + "/")}
            assert names == set(expected), (archive, names, set(expected))
            for name, source in expected.items():
                if not edited or name not in (["main.py", "model.py"] if project["multipleModules"] else ["main.py"]):
                    assert hashlib.sha256((target / name).read_bytes()).hexdigest() == source["sha256"], (archive, name)
            if edited or role == "solution":
                result = subprocess.run([sys.executable, "-B", str(target / "main.py")], cwd="/",
                                        capture_output=True, text=True, timeout=15)
                assert result.returncode == 0, (archive, result.stderr)
                if edited:
                    assert "ML workflow verified: " + project["caseId"] in result.stdout
                assert not result.stderr, (archive, result.stderr)
            records.append({"project": project["caseId"], "archive": archive.name, "sourceRole": role, "edited": edited, "executed": edited or role == "solution"})
    matching = [r for r in records if r["project"] == project["caseId"]]
    assert len(matching) == 8, (project["caseId"], len(matching))
proof = {"source": fixture["revision"], "projects": len(projects), "archives": len(records), "nativeExecutions": sum(r["executed"] for r in records), "records": records}
(root / "native-exports.json").write_text(json.dumps(proof, indent=2) + "\n")
print(json.dumps({"projects": proof["projects"], "archives": proof["archives"], "source": proof["source"]}))
