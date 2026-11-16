import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import zipfile

root = Path(sys.argv[1])
fixture = json.loads(Path("test/fixtures/machine-learning-offline-sources.json").read_text())
records = []
for project in fixture["projects"]:
    directory = root / project["caseId"]
    for archive in sorted(directory.glob("*.zip")):
        role = archive.name.split("-")[0]
        edited = archive.name.endswith("-edited.zip")
        with tempfile.TemporaryDirectory(prefix="ml-browser-export-") as temp:
            target = Path(temp)
            with zipfile.ZipFile(archive) as z:
                for name in z.namelist():
                    assert not name.startswith("/") and ".." not in Path(name).parts
                z.extractall(target)
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
            records.append({"project": project["caseId"], "archive": archive.name, "sourceRole": role, "edited": edited})
    matching = [r for r in records if r["project"] == project["caseId"]]
    assert len(matching) == 8, (project["caseId"], len(matching))
proof = {"source": fixture["revision"], "projects": len(fixture["projects"]), "archives": len(records), "records": records}
(root / "native-exports.json").write_text(json.dumps(proof, indent=2) + "\n")
print(json.dumps({"projects": proof["projects"], "archives": proof["archives"], "source": proof["source"]}))
