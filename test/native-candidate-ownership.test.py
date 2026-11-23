import os
from pathlib import Path
import pwd
import shutil
import subprocess
import sys
import tempfile
import unittest


class NativeCandidateOwnershipTests(unittest.TestCase):
    def test_unattested_candidate_never_reaches_production_mutation(self):
        self.assertEqual(os.geteuid(), 0, "Run this isolated Linux fixture as root")
        repository = Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory(prefix="classes-provenance-", dir="/root") as temporary:
            base = Path(temporary)
            source = base / "source"
            releases = base / "site/releases"
            tools = base / "tools"
            source.mkdir()
            (releases / ".candidates").mkdir(parents=True)
            tools.mkdir()
            for relative in [
                "package.json", "package-lock.json", "front-end/package.json",
                "back-end/package.json", "back-end/package-lock.json",
                "scripts/verify-native-source.sh", "scripts/verify-native-release.mjs",
                "scripts/promote-native-release.sh", "scripts/snapshot-native-candidate.py",
                "scripts/verify-native-provenance.mjs"
            ]:
                destination = source / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(repository / relative, destination)
            shutil.copytree(repository / "deploy/native", source / "deploy/native")
            for command in [
                ["init", "-b", "main"], ["config", "user.email", "fixture@example.invalid"],
                ["config", "user.name", "Synthetic fixture"], ["add", "."],
                ["commit", "-m", "Synthetic native fixture"],
                ["remote", "add", "origin", "https://github.com/instruction-material/classes.jacobdanderson.net.git"],
                ["update-ref", "refs/remotes/origin/main", "HEAD"],
                ["tag", "-a", "v2.8.4", "-m", "Synthetic fixture"]
            ]:
                subprocess.run(["git", "-C", str(source), *command], check=True, capture_output=True)
            revision = subprocess.check_output(["git", "-C", str(source), "rev-parse", "HEAD"], text=True).strip()
            candidate = releases / ".candidates" / ("v2.8.4-" + revision)
            candidate.mkdir()
            for relative in ["package.json", "package-lock.json", "front-end/package.json", "back-end/package.json", "back-end/package-lock.json", "scripts/verify-native-source.sh", "scripts/verify-native-release.mjs"]:
                destination = candidate / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source / relative, destination)
            shutil.copytree(source / "deploy/native", candidate / "deploy/native")
            for relative, content in {
                "front-end/dist/index.html": "<h1>Classes</h1>",
                "front-end/dist/404.html": "<title>Page not found | Classes</title>",
                "front-end/dist/python-runtime/runtime.js": "export {};",
                "front-end/dist/python-runtime/runtime.css": "body {}",
                "back-end/dist/server.js": "export {};",
                "back-end/node_modules/fixture/index.js": "export {};"
            }.items():
                destination = candidate / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_text(content)
            subprocess.run([
                "node", str(source / "scripts/verify-native-release.mjs"), "--write",
                "--tag", "v2.8.4", "--revision", revision, str(candidate)
            ], check=True, capture_output=True)
            sentinel = base / "production-command-called"
            for name in ["nginx", "systemctl"]:
                command = tools / name
                command.write_text(f"#!/bin/sh\nprintf mutation >> '{sentinel}'\nexit 99\n")
                command.chmod(0o755)
            verifier = tools / "gh"
            verifier.write_text("#!/bin/sh\nexit 1\n")
            verifier.chmod(0o755)
            result = subprocess.run([
                "bash", str(source / "scripts/promote-native-release.sh"),
                "--source", str(source), "--candidate", str(candidate),
                "--release-root", str(releases.parent)
            ], env={**os.environ, "PATH": str(tools) + os.pathsep + os.environ["PATH"]},
                capture_output=True, text=True, timeout=30, check=False)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("lacks verified canonical CI provenance", result.stderr)
            self.assertFalse(sentinel.exists())
            self.assertFalse((releases.parent / "current").exists())
            self.assertFalse((releases / candidate.name).exists())

    def test_root_snapshot_is_independent_and_readable_by_runtime(self):
        self.assertEqual(os.geteuid(), 0, "Run this isolated Linux fixture as root")
        runtime = pwd.getpwnam("nobody")
        helper = Path(__file__).resolve().parents[1] / "scripts/snapshot-native-candidate.py"
        with tempfile.TemporaryDirectory(prefix="classes-ownership-", dir="/root") as temporary:
            base = Path(temporary)
            source = base / "trusted-source"
            releases = base / "releases"
            candidates = releases / ".candidates"
            source.mkdir()
            candidates.mkdir(parents=True)
            name = "v2.8.1-" + "a" * 40
            incoming = candidates / name
            incoming.mkdir()
            payload = incoming / "runtime-fixture.txt"
            payload.write_text("synthetic runtime bytes")
            payload.chmod(0o600)
            for entry in [candidates, incoming, payload]:
                os.chown(entry, runtime.pw_uid, runtime.pw_gid)
            copied = Path(subprocess.check_output([
                sys.executable, "-B", str(helper), "--source", str(source),
                "--releases", str(releases), "--name", name
            ], text=True).strip())
            self.assertEqual(copied.parent.stat().st_mode & 0o777, 0o700)
            self.assertEqual((copied / payload.name).stat().st_uid, 0)
            self.assertNotEqual(
                (copied / payload.name).stat().st_ino,
                (copied.parent / "incoming" / payload.name).stat().st_ino
            )
            with tempfile.TemporaryDirectory(prefix="classes-readable-", dir="/var/tmp") as visible:
                visible_root = Path(visible)
                visible_root.chmod(0o755)
                final = visible_root / name
                copied.rename(final)
                result = subprocess.run([
                    sys.executable, "-I", "-c",
                    "import os, pathlib, sys; "
                    "target = pathlib.Path(sys.argv[1]); "
                    "assert target.read_text() == 'synthetic runtime bytes'; "
                    "assert not os.access(target, os.W_OK); "
                    "assert not os.access(target.parent, os.W_OK)",
                    str(final / payload.name)
                ], user=runtime.pw_uid, group=runtime.pw_gid, extra_groups=[],
                    capture_output=True, text=True, check=False)
                self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
