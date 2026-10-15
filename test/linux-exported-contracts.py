"""Run accepted Linux contracts against exact archives downloaded from the IDE."""
import argparse
import hashlib
import json
import os
import platform
import signal
import subprocess
import sys
import tempfile
import time
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument("--archives", type=Path, required=True)
parser.add_argument("--proof", type=Path, required=True)
args = parser.parse_args()
assert platform.system() == "Linux" and os.geteuid() != 0
fixture_dir = ROOT / "fixtures"
packs = json.loads((fixture_dir / "linux-owned-labs-contracts.json").read_text())
identity = json.loads((fixture_dir / "linux-owned-labs-source-verifier.json").read_text())
verifier = (fixture_dir / "linux-owned-labs-source-verifier.py").read_bytes()
assert hashlib.sha256(verifier).hexdigest() == identity["sha256"]
legacy_packs = [pack for pack in packs if pack["revision"] == identity["revision"]]
assert len(legacy_packs) == 5
proxy_packs = [pack for pack in packs if pack["pack"] == "LS3-Nginx-Reverse-Proxy-App"]
assert len(proxy_packs) == 1
proxy_identity = json.loads((fixture_dir / "linux-reverse-proxy-source-verifier.json").read_text())
proxy_verifier = (fixture_dir / "linux-reverse-proxy-source-verifier.py").read_bytes()
assert hashlib.sha256(proxy_verifier).hexdigest() == proxy_identity["sha256"]
assert proxy_packs[0]["revision"] == proxy_identity["revision"]
apache_packs = [pack for pack in packs if pack["pack"] == "LS4-Apache-Virtual-Host-Compare"]
assert len(apache_packs) == 1
apache_identity = json.loads((fixture_dir / "linux-apache-source-verifier.json").read_text())
apache_verifier = (fixture_dir / "linux-apache-source-verifier.py").read_bytes()
assert hashlib.sha256(apache_verifier).hexdigest() == apache_identity["sha256"]
assert apache_packs[0]["revision"] == apache_identity["revision"]
systemd_packs = [pack for pack in packs if pack["pack"] == "LS5-Systemd-Toy-Service"]
assert len(systemd_packs) == 1
systemd_identity = json.loads((fixture_dir / "linux-systemd-source-verifier.json").read_text())
systemd_verifier = (fixture_dir / "linux-systemd-source-verifier.py").read_bytes()
assert hashlib.sha256(systemd_verifier).hexdigest() == systemd_identity["sha256"]
assert systemd_packs[0]["revision"] == systemd_identity["revision"]
supplemental_packs = [pack for pack in packs if pack["pack"] in ("LS-13-unit-6-services-and-systemd-supplemental-2", "LS-14-unit-6-services-and-systemd-supplemental-3")]
assert len(supplemental_packs) == 2
supplemental_identity = json.loads((fixture_dir / "linux-systemd-supplemental-source-verifier.json").read_text())
supplemental_verifier = (fixture_dir / "linux-systemd-supplemental-source-verifier.py").read_bytes()
assert hashlib.sha256(supplemental_verifier).hexdigest() == supplemental_identity["sha256"]
assert all(pack["revision"] == supplemental_identity["revision"] for pack in supplemental_packs)
logging_packs = [pack for pack in packs if pack["pack"] in ("LS-09-unit-7-logging-and-observability", "LS-15-unit-7-logging-and-observability-supplemental-2", "LS-16-unit-7-logging-and-observability-supplemental-3")]
assert len(logging_packs) == 3 and len(packs) == 52
logging_identity = json.loads((fixture_dir / "linux-logging-source-verifier.json").read_text())
logging_verifier = (fixture_dir / "linux-logging-source-verifier.py").read_bytes()
assert hashlib.sha256(logging_verifier).hexdigest() == logging_identity["sha256"]
assert all(pack["revision"] == logging_identity["revision"] for pack in logging_packs)
editing_core_packs = [pack for pack in packs if pack["pack"] == "LS-07-unit-4-editing-and-configuration"]
editing_optional_packs = [pack for pack in packs if pack["pack"] in ("LS-09-unit-4-editing-and-configuration-supplemental-2", "LS-10-unit-4-editing-and-configuration-supplemental-3")]
assert len(editing_core_packs) == 1 and len(editing_optional_packs) == 2
editing_core_identity = json.loads((fixture_dir / "linux-editing-core-source-verifier.json").read_text())
editing_core_verifier = (fixture_dir / "linux-editing-core-source-verifier.py").read_bytes()
editing_optional_identity = json.loads((fixture_dir / "linux-editing-optional-source-verifier.json").read_text())
editing_optional_verifier = (fixture_dir / "linux-editing-optional-source-verifier.py").read_bytes()
assert hashlib.sha256(editing_core_verifier).hexdigest() == editing_core_identity["sha256"]
assert hashlib.sha256(editing_optional_verifier).hexdigest() == editing_optional_identity["sha256"]
assert editing_core_packs[0]["revision"] == editing_core_identity["revision"]
assert all(pack["revision"] == editing_optional_identity["revision"] for pack in editing_optional_packs)
process_core_packs = [pack for pack in packs if pack["pack"] == "LS-08-unit-5-processes-and-job-control"]
process_optional_packs = [pack for pack in packs if pack["pack"] in ("LS-11-unit-5-processes-and-job-control-supplemental-2", "LS-12-unit-5-processes-and-job-control-supplemental-3")]
assert len(process_core_packs) == 1 and len(process_optional_packs) == 2
process_core_identity = json.loads((fixture_dir / "linux-process-core-source-verifier.json").read_text())
process_core_verifier = (fixture_dir / "linux-process-core-source-verifier.py").read_bytes()
process_optional_identity = json.loads((fixture_dir / "linux-process-optional-source-verifier.json").read_text())
process_optional_verifier = (fixture_dir / "linux-process-optional-source-verifier.py").read_bytes()
assert hashlib.sha256(process_core_verifier).hexdigest() == process_core_identity["sha256"]
assert hashlib.sha256(process_optional_verifier).hexdigest() == process_optional_identity["sha256"]
assert process_core_packs[0]["revision"] == process_core_identity["revision"]
assert all(pack["revision"] == process_optional_identity["revision"] for pack in process_optional_packs)
package_core_packs = [pack for pack in packs if pack["pack"] == "LS-10-unit-9-package-management-and-software-layout"]
package_optional_packs = [pack for pack in packs if pack["pack"] in ("LS-19-unit-9-package-management-and-software-layout-supplemental-2", "LS-20-unit-9-package-management-and-software-layout-supplemental-3")]
assert len(package_core_packs) == 1 and len(package_optional_packs) == 2
package_core_identity = json.loads((fixture_dir / "linux-package-core-source-verifier.json").read_text())
package_core_verifier = (fixture_dir / "linux-package-core-source-verifier.py").read_bytes()
package_optional_identity = json.loads((fixture_dir / "linux-package-optional-source-verifier.json").read_text())
package_optional_verifier = (fixture_dir / "linux-package-optional-source-verifier.py").read_bytes()
assert hashlib.sha256(package_core_verifier).hexdigest() == package_core_identity["sha256"]
assert hashlib.sha256(package_optional_verifier).hexdigest() == package_optional_identity["sha256"]
assert package_core_packs[0]["revision"] == package_core_identity["revision"]
assert all(pack["revision"] == package_optional_identity["revision"] for pack in package_optional_packs)
network_identity = json.loads((fixture_dir / "linux-network-source-verifier.json").read_text())
network_verifier = (fixture_dir / "linux-network-source-verifier.py").read_bytes()
network_names = ['LS-11-unit-10-networking-from-a-systems-view', 'LS-21-unit-10-networking-from-a-systems-view-supplemental-2', 'LS-22-unit-10-networking-from-a-systems-view-supplemental-3']
network_packs = [pack for pack in packs if pack["pack"] in network_names]
assert len(network_packs) == 3
assert hashlib.sha256(network_verifier).hexdigest() == network_identity["sha256"]
assert all(pack["revision"] == network_identity["revision"] for pack in network_packs)
storage_identity = json.loads((fixture_dir / "linux-storage-source-verifier.json").read_text())
storage_verifier = (fixture_dir / "linux-storage-source-verifier.py").read_bytes()
storage_names = ['LS-12-unit-12-storage-backups-and-reliability', 'LS-25-unit-12-storage-backups-and-reliability-supplemental-2', 'LS-26-unit-12-storage-backups-and-reliability-supplemental-3']
storage_packs = [pack for pack in packs if pack["pack"] in storage_names]
assert len(storage_packs) == 3
assert hashlib.sha256(storage_verifier).hexdigest() == storage_identity["sha256"]
assert all(pack["revision"] == storage_identity["revision"] for pack in storage_packs)
shell_identity = json.loads((fixture_dir / "linux-shell-optional-source-verifier.json").read_text())
shell_verifier = (fixture_dir / "linux-shell-optional-source-verifier.py").read_bytes()
shell_packs = [pack for pack in packs if pack["pack"] in ['LS-03-unit-1-shell-foundations-supplemental-2', 'LS-04-unit-1-shell-foundations-supplemental-3']]
assert len(shell_packs) == 2
assert hashlib.sha256(shell_verifier).hexdigest() == shell_identity["sha256"]
assert all(pack["revision"] == shell_identity["revision"] for pack in shell_packs)
filesystem_identity = json.loads((fixture_dir / "linux-filesystem-optional-source-verifier.json").read_text())
filesystem_verifier = (fixture_dir / "linux-filesystem-optional-source-verifier.py").read_bytes()
filesystem_packs = [pack for pack in packs if pack["pack"] in ['LS-05-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-2', 'LS-06-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-3']]
assert len(filesystem_packs) == 2
assert hashlib.sha256(filesystem_verifier).hexdigest() == filesystem_identity["sha256"]
assert all(pack["revision"] == filesystem_identity["revision"] for pack in filesystem_packs)
permissions_identity = json.loads((fixture_dir / "linux-permissions-optional-source-verifier.json").read_text())
permissions_verifier = (fixture_dir / "linux-permissions-optional-source-verifier.py").read_bytes()
permissions_packs = [pack for pack in packs if pack["pack"] in ['LS-07-unit-3-users-groups-and-permissions-supplemental-2', 'LS-08-unit-3-users-groups-and-permissions-supplemental-3']]
assert len(permissions_packs) == 2
assert hashlib.sha256(permissions_verifier).hexdigest() == permissions_identity["sha256"]
assert all(pack["revision"] == permissions_identity["revision"] for pack in permissions_packs)
setup_identity = json.loads((fixture_dir / "linux-setup-optional-source-verifier.json").read_text())
setup_verifier = (fixture_dir / "linux-setup-optional-source-verifier.py").read_bytes()
setup_packs = [pack for pack in packs if pack["pack"] in ['LS-01-ls0-setup-and-tooling-supplemental-2', 'LS-02-ls0-setup-and-tooling-supplemental-3']]
assert len(setup_packs) == 2
assert hashlib.sha256(setup_verifier).hexdigest() == setup_identity["sha256"]
assert all(pack["revision"] == setup_identity["revision"] for pack in setup_packs)
scheduling_identity = json.loads((fixture_dir / "linux-scheduling-optional-source-verifier.json").read_text())
scheduling_verifier = (fixture_dir / "linux-scheduling-optional-source-verifier.py").read_bytes()
scheduling_packs = [pack for pack in packs if pack["pack"] in ['LS-17-unit-8-scheduling-and-automation-supplemental-2', 'LS-18-unit-8-scheduling-and-automation-supplemental-3']]
assert len(scheduling_packs) == 2
assert hashlib.sha256(scheduling_verifier).hexdigest() == scheduling_identity["sha256"]
assert all(pack["revision"] == scheduling_identity["revision"] for pack in scheduling_packs)
web_identity = json.loads((fixture_dir / "linux-web-optional-source-verifier.json").read_text())
web_verifier = (fixture_dir / "linux-web-optional-source-verifier.py").read_bytes()
web_packs = [pack for pack in packs if pack["pack"] in ['LS-23-unit-11-web-servers-supplemental-2', 'LS-24-unit-11-web-servers-supplemental-3']]
assert len(web_packs) == 2
assert hashlib.sha256(web_verifier).hexdigest() == web_identity["sha256"]
assert all(pack["revision"] == web_identity["revision"] for pack in web_packs)
deployment_identity = json.loads((fixture_dir / "linux-deployment-studio-source-verifier.json").read_text())
deployment_verifier = (fixture_dir / "linux-deployment-studio-source-verifier.py").read_bytes()
deployment_packs = [pack for pack in packs if pack["pack"] in ['LS-01-linux-systems-lab-14', 'LS-27-applied-studio-14-linux-systems-lab-14-supplemental-2', 'LS-28-applied-studio-14-linux-systems-lab-14-supplemental-3']]
assert len(deployment_packs) == 3
assert hashlib.sha256(deployment_verifier).hexdigest() == deployment_identity["sha256"]
assert all(pack["revision"] == deployment_identity["revision"] for pack in deployment_packs)
capstone_identity = json.loads((fixture_dir / "linux-operations-capstone-source-verifier.json").read_text())
capstone_verifier = (fixture_dir / "linux-operations-capstone-source-verifier.py").read_bytes()
capstone_packs = [pack for pack in packs if pack["pack"] == "LS-04-linux-systems-lab-17"]
assert len(capstone_packs) == 1
assert hashlib.sha256(capstone_verifier).hexdigest() == capstone_identity["sha256"]
assert capstone_packs[0]["revision"] == capstone_identity["revision"]
recovery_identity = json.loads((fixture_dir / "linux-capstone-recovery-source-verifier.json").read_text())
recovery_verifier = (fixture_dir / "linux-capstone-recovery-source-verifier.py").read_bytes()
recovery_packs = [pack for pack in packs if pack["pack"] in ['LS-33-applied-studio-17-linux-systems-lab-17-supplemental-2', 'LS-34-applied-studio-17-linux-systems-lab-17-supplemental-3']]
assert len(recovery_packs) == 2
assert hashlib.sha256(recovery_verifier).hexdigest() == recovery_identity["sha256"]
assert all(pack["revision"] == recovery_identity["revision"] for pack in recovery_packs)
observability_identity = json.loads((fixture_dir / "linux-observability-studio-source-verifier.json").read_text())
observability_verifier = (fixture_dir / "linux-observability-studio-source-verifier.py").read_bytes()
observability_packs = [pack for pack in packs if pack["pack"] in ['LS-02-linux-systems-lab-15', 'LS-29-applied-studio-15-linux-systems-lab-15-supplemental-2', 'LS-30-applied-studio-15-linux-systems-lab-15-supplemental-3']]
assert len(observability_packs) == 3
assert hashlib.sha256(observability_verifier).hexdigest() == observability_identity["sha256"]
assert all(pack["revision"] == observability_identity["revision"] for pack in observability_packs)
backup_studio_identity = json.loads((fixture_dir / "linux-backup-studio-source-verifier.json").read_text())
backup_studio_verifier = (fixture_dir / "linux-backup-studio-source-verifier.py").read_bytes()
backup_studio_packs = [pack for pack in packs if pack["pack"] in ['LS-03-linux-systems-lab-16', 'LS-31-applied-studio-16-linux-systems-lab-16-supplemental-2', 'LS-32-applied-studio-16-linux-systems-lab-16-supplemental-3']]
assert len(backup_studio_packs) == 3
assert hashlib.sha256(backup_studio_verifier).hexdigest() == backup_studio_identity["sha256"]
assert all(pack["revision"] == backup_studio_identity["revision"] for pack in backup_studio_packs)
args.proof = args.proof.resolve()
args.proof.parent.mkdir(parents=True, exist_ok=True)
archives = []


def run_pinned_contract(work, name, source, proof, timeout):
    script = work / "test" / name
    script.write_bytes(source)
    command = [sys.executable, str(script), "--proof", str(proof)]
    started = time.time()
    child = subprocess.Popen(command, cwd=work, start_new_session=True)
    cleanup = "process exited"
    try:
        status = child.wait(timeout=timeout)
    except BaseException:
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.wait(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.wait()
        cleanup = "process group terminated"
        raise
    finally:
        with args.proof.with_suffix(".processes.jsonl").open("a") as stream:
            stream.write(json.dumps({"parentTaskId": os.environ.get("CLASSES_FAMILY_TASK_ID", "linux-site-export-ci"), "parentPid": os.getpid(), "pid": child.pid, "command": command, "cwd": str(work), "startTime": started, "endTime": time.time(), "exitCode": child.returncode, "timeoutSeconds": timeout, "childProcessGroupCleanup": cleanup}) + "\n")
    assert status == 0
    return json.loads(proof.read_text())

with tempfile.TemporaryDirectory(prefix="linux-site-exports-") as directory:
    work = Path(directory)
    for pack in packs:
        for role in ("starter", "solution"):
            archive_path = args.archives / (pack["pack"] + "-" + role + ".zip")
            expected = {name: file for name, file in pack["files"].items()
                        if name == "README.md" or name.startswith(role + "/")}
            with zipfile.ZipFile(archive_path) as archive:
                names = archive.namelist()
                assert len(names) == len(expected) and len(names) == len(set(names))
                roots = {name.split("/")[0] for name in names}
                assert len(roots) == 1
                root = roots.pop()
                assert root not in ("", ".", "..")
                assert set(names) == {root + "/" + name for name in expected}
                for name, file in expected.items():
                    content = archive.read(root + "/" + name)
                    assert hashlib.sha256(content).hexdigest() == file["sha256"]
                    target = work / pack["pack"] / name
                    target.parent.mkdir(parents=True, exist_ok=True)
                    if target.exists():
                        assert target.read_bytes() == content
                    target.write_bytes(content)
            archives.append({"pack": pack["pack"], "role": role,
                             "sha256": hashlib.sha256(archive_path.read_bytes()).hexdigest(),
                             "files": sorted(expected)})
    assert len(archives) == len(packs) * 2
    (work / "test").mkdir()
    native_proof = args.proof.with_name(args.proof.stem + "-native.json")
    native = run_pinned_contract(work, "verify_owned_labs.py", verifier, native_proof, 300)
    assert len(native["sourceHashes"]) == 35
    assert native["accepted"] and native["commandCount"] == 108
    assert len(native["profiles"]) == 14
    expected_hashes = {pack["pack"] + "/" + name: file["sha256"]
                       for pack in legacy_packs for name, file in pack["files"].items()}
    assert native["sourceHashes"] == expected_hashes
    proxy_proof = args.proof.with_name(args.proof.stem + "-proxy-native.json")
    proxy_native = run_pinned_contract(work, "verify_reverse_proxy.py", proxy_verifier, proxy_proof, 180)
    assert proxy_native["accepted"] and not proxy_native["appOnly"]
    assert len(proxy_native["profiles"]) == 3 and len(proxy_native["observations"]) == 75
    assert proxy_native["sourceHashes"] == {name: file["sha256"] for name, file in proxy_packs[0]["files"].items()}
    apache_proof = args.proof.with_name(args.proof.stem + "-apache-native.json")
    apache_native = run_pinned_contract(work, "verify_apache_comparison.py", apache_verifier, apache_proof, 180)
    assert apache_native["accepted"] and apache_native["sourceUnchanged"]
    assert len(apache_native["profiles"]) == 3 and len(apache_native["observations"]) == 99
    assert apache_native["sourceHashes"] == {name: file["sha256"] for name, file in apache_packs[0]["files"].items()}
    assert all(profile["actualLinuxSockets"] and profile["rejectedSyntaxLeavesServing"] and profile["ownedListenersRemoved"] for profile in apache_native["profiles"])
    assert sum(profile["changedAndRestored"] for profile in apache_native["profiles"]) == 2
    apache_reload_generations = 0
    apache_expected_bodies = {hashlib.sha256(apache_packs[0]["files"][name]["content"].encode()).hexdigest()
                              for name in ("solution/index.html", "solution/second.html")}
    for profile in apache_native["profiles"]:
        assert profile["exactPages"]
        generations = profile["reloadGenerations"]
        assert len(generations) == (0 if profile["role"] == "starter" else 4)
        transitions = set()
        for generation in generations:
            server = generation["server"]
            assert generation["signal"] == {"apache": "SIGUSR1", "nginx": "SIGHUP"}[server]
            assert generation["previousWorkersRetired"]
            assert generation["before"] and generation["after"]
            before_workers = {(worker["pid"], worker["startTicks"]) for worker in generation["before"]}
            after_workers = {(worker["pid"], worker["startTicks"]) for worker in generation["after"]}
            assert before_workers.isdisjoint(after_workers)
            assert all(worker["parentPid"] == generation["masterPid"] for worker in generation["before"] + generation["after"])
            transitions.add((server, generation["expectedBodySha256"]))
            apache_reload_generations += 1
        if profile["role"] != "starter":
            assert transitions == {(server, body) for server in ("apache", "nginx") for body in apache_expected_bodies}
            assert all(len({generation["masterPid"] for generation in generations if generation["server"] == server}) == 1
                       for server in ("apache", "nginx"))
    assert apache_reload_generations == 8
    systemd_proof = args.proof.with_name(args.proof.stem + "-systemd-native.json")
    systemd_native = run_pinned_contract(work, "verify_systemd_service.py", systemd_verifier, systemd_proof, 180)
    assert systemd_native["accepted"] and not systemd_native["appOnly"]
    assert systemd_native["sourceUnchanged"] and systemd_native["managerVersion"]
    assert len(systemd_native["profiles"]) == 3
    assert systemd_native["sourceHashes"] == {name: file["sha256"] for name, file in systemd_packs[0]["files"].items()}
    assert all(profile["actualManager"] for profile in systemd_native["profiles"])
    learner = next(profile for profile in systemd_native["profiles"] if profile["role"] == "starter")
    assert learner["namedUnfinishedStatus"] == 78 and learner["restartLoopPrevented"]
    completed = [profile for profile in systemd_native["profiles"] if profile["role"] != "starter"]
    assert len(completed) == 2
    assert all(all(profile[key] for key in ("actualJournal", "manualRestart", "automaticRestart", "persistentEnable", "enabledAndStopped", "invalidEnvironmentFailure", "recovered")) for profile in completed)
    cleanup = [row for row in systemd_native["observations"] if row.get("kind") == "cleanup"]
    assert len(cleanup) == 3
    assert all(all(row[key] for key in ("unitRemoved", "processStopped", "activationRemoved", "installRemoved")) for row in cleanup)
    supplemental_proof = args.proof.with_name(args.proof.stem + "-supplemental-native.json")
    supplemental_native = run_pinned_contract(work, "verify_systemd_supplemental.py", supplemental_verifier, supplemental_proof, 300)
    assert supplemental_native["accepted"] and not supplemental_native["appOnly"]
    assert supplemental_native["managerVersion"] and supplemental_native["sourceUnchanged"]
    assert len(supplemental_native["profiles"]) == 6
    assert supplemental_native["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in supplemental_packs for name, file in pack["files"].items()}
    assert all(profile["actualManager"] for profile in supplemental_native["profiles"])
    transfer = [profile for profile in supplemental_native["profiles"] if profile["kind"] == "transfer"]
    extension = [profile for profile in supplemental_native["profiles"] if profile["kind"] == "extension"]
    assert len(transfer) == 3 and len(extension) == 3
    assert next(profile for profile in transfer if profile["role"] == "starter")["namedWorkingDirectoryFailure"]
    assert all(all(profile[key] for key in ("actualHttpAndSocket", "actualJournal", "manualRestart", "automaticRestart", "workingDirectoryFaultAndRecovery", "baseUnitUnchanged", "enabledAndStopped")) for profile in transfer if profile["role"] != "starter")
    assert all(all(profile[key] for key in ("actualJournal", "actualProcessEnvironment", "dropInRemovalRestoresBase", "baseUnitUnchanged")) for profile in extension)
    assert all(all(profile[key] for key in ("resetAndReplacementObserved", "fileEditNeedsRestart", "invalidOverrideFailureAndRecovery")) for profile in extension if profile["role"] != "starter")
    assert next(profile for profile in extension if profile["role"] == "starter")["ignoredInvalidOverrideObserved"]
    supplemental_cleanup = [row for row in supplemental_native["observations"] if row.get("kind") == "cleanup"]
    assert len(supplemental_cleanup) == 6 and all(all(row[key] for key in ("unitRemoved", "processStopped", "activationRemoved", "dropInRemoved", "installRemoved")) for row in supplemental_cleanup)
    logging_proof = args.proof.with_name(args.proof.stem + "-logging-native.json")
    logging_native = run_pinned_contract(work, "verify_logging_labs.py", logging_verifier, logging_proof, 300)
    assert logging_native["accepted"] and not logging_native["offlineOnly"] and logging_native["preflightPassed"]
    assert logging_native["sourceUnchanged"] and logging_native["temporaryFilesCleaned"]
    assert logging_native["managerVersion"] and logging_native["logrotateVersion"]
    assert len(logging_native["profiles"]) == 9
    assert logging_native["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in logging_packs for name, file in pack["files"].items()}
    assert all(all(value for value in profile.values() if isinstance(value, bool)) for profile in logging_native["profiles"])
    for kind in ("journal", "application", "retention"):
        group = [profile for profile in logging_native["profiles"] if profile["kind"] == kind]
        assert len(group) == 3 and {profile["role"] for profile in group} == {"starter", "solution", "independent-completion"}
    scope_rows = [row for row in logging_native["observations"] if row.get("kind") == "unit-scope-analysis"]
    assert len(scope_rows) == 2 and all(row["managerRows"] > 0 and row["fieldCollisions"] > 0 and row["expectedEvents"] == row["reportedEvents"] for row in scope_rows)
    logging_cleanup = [row for row in logging_native["observations"] if row.get("kind") == "cleanup"]
    assert len(logging_cleanup) == 6 and all(all(value for value in row.values() if isinstance(value, bool)) for row in logging_cleanup)
    editing_core_proof = args.proof.with_name(args.proof.stem + "-editing-core-native.json")
    editing_core = run_pinned_contract(work, "verify_editing_core.py", editing_core_verifier, editing_core_proof, 180)
    assert editing_core["accepted"] and editing_core["platform"] == "linux" and editing_core["sourceUnchanged"]
    assert not editing_core["offlineOnly"] and not editing_core["localProcessPreflight"]
    assert editing_core["sourceHashes"] == {name: file["sha256"] for name, file in editing_core_packs[0]["files"].items()}
    assert len(editing_core["profiles"]) == 3
    assert {profile["role"] for profile in editing_core["profiles"]} == {"starter", "solution", "independent-completion"}
    assert all(profile["actualOwnedProcess"] and profile["ownedUid"] > 0 and profile["processStopped"] for profile in editing_core["profiles"])
    assert next(profile for profile in editing_core["profiles"] if profile["role"] == "starter")["namedUnfinishedStatus"] == 78
    assert all(all(profile[key] for key in ("exactBackupAndApply", "cachedBeforeReload", "validReload", "invalidCandidateNoWrite", "invalidCurrentPreservesBackup", "invalidReloadKeepsProcess", "exactRollback", "changedCase", "modePreserved", "symlinkBoundary", "invalidBackupRejected")) for profile in editing_core["profiles"] if profile["role"] != "starter")
    core_lifecycles = [row for row in editing_core["observations"] if row.get("kind") == "process-lifecycle"]
    assert len(core_lifecycles) == 3 and all(row["exitCode"] == 0 and row["uid"] > 0 and row["processStopped"] and row["readerStopped"] for row in core_lifecycles)
    core_cleanup = [row for row in editing_core["observations"] if row.get("kind") == "cleanup"]
    assert len(core_cleanup) == 3 and all(row["processStopped"] and row["temporaryDirectoryRemoved"] for row in core_cleanup)
    editing_optional_proof = args.proof.with_name(args.proof.stem + "-editing-optional-native.json")
    editing_optional = run_pinned_contract(work, "verify_editing_optional.py", editing_optional_verifier, editing_optional_proof, 180)
    assert editing_optional["accepted"] and editing_optional["platform"] == "linux" and editing_optional["nativeGNUVerified"] and editing_optional["sourceUnchanged"]
    assert not editing_optional["offlineOnly"] and not editing_optional["localProcessPreflight"]
    assert editing_optional["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in editing_optional_packs for name, file in pack["files"].items()}
    assert len(editing_optional["profiles"]) == 6
    for kind in ("environment", "replacement"):
        group = [profile for profile in editing_optional["profiles"] if profile["kind"] == kind]
        assert {profile["role"] for profile in group} == {"starter", "solution", "independent-completion"}
        assert next(profile for profile in group if profile["role"] == "starter")["namedUnfinishedStatus"] == 78
        for profile in group:
            if profile["role"] == "starter":
                continue
            keys = ("actualChildEnvironment", "callerValuesIsolated", "parentEnvironmentUnchanged", "fileEditLeavesRunningEnvironment", "restartLoadsNewFile", "explicitOverride", "overrideLeavesFileUnchanged", "syntaxFailureBeforeApplication", "valueFailureDistinct", "singleQuotesRemainLiteral", "watchedProcessesStopped") if kind == "environment" else ("previewLeavesBytesUnchanged", "exactAnchoredEdits", "commentsAndUnrelatedNumbersPreserved", "completeBackupsExact", "modesPreserved", "missingAndDuplicateRejectedBeforeApply", "invalidRequestedValuesRejected", "changedWhitespaceCase", "actualSecondRenameFailure", "explicitRollbackRestoresBoth", "outsideBackupRefused", "symlinkRefused", "invalidBackupLeavesCurrentUnchanged", "stagingRemoved")
            assert all(profile[key] for key in keys)
    watched = [row for row in editing_optional["observations"] if row.get("kind") == "watched-lifecycle"]
    assert len(watched) == 4 and all(row["exitCode"] == 0 and row["uid"] > 0 and row["processStopped"] and row["readerStopped"] for row in watched)
    partial = [row for row in editing_optional["observations"] if row.get("kind") == "forced-second-rename-failure"]
    assert len(partial) == 2 and all(row["status"] == 99 and row["firstFileChanged"] and row["secondFileUnchanged"] and row["completeBackupExact"] for row in partial)
    optional_cleanup = [row for row in editing_optional["observations"] if row.get("kind") == "cleanup"]
    assert len(optional_cleanup) == 6 and all(row["processesStopped"] and row["temporaryDirectoryRemoved"] for row in optional_cleanup)
    process_core_proof = args.proof.with_name(args.proof.stem + "-process-core-native.json")
    process_core = run_pinned_contract(work, "verify_process_core.py", process_core_verifier, process_core_proof, 90)
    assert process_core["accepted"] and process_core["sourceUnchanged"] and process_core["worksheetCompletionNotInferred"]
    assert process_core["sourceHashes"] == {name: file["sha256"] for name, file in process_core_packs[0]["files"].items()}
    assert len(process_core["profiles"]) == 3 and len(process_core["observations"]) == 45
    assert all(profile["actualForegroundStatus"] == 130 and profile["actualBashWaitStatuses"] == [0, 137] for profile in process_core["profiles"])
    process_optional_proof = args.proof.with_name(args.proof.stem + "-process-optional-native.json")
    process_optional = run_pinned_contract(work, "verify_process_optional.py", process_optional_verifier, process_optional_proof, 120)
    assert process_optional["accepted"] and process_optional["sourceUnchanged"] and process_optional["worksheetCompletionNotInferred"]
    assert process_optional["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in process_optional_packs for name, file in pack["files"].items()}
    assert len(process_optional["profiles"]) == 6 and len(process_optional["observations"]) == 66
    assert all(value for profile in process_optional["profiles"] for value in profile.values() if isinstance(value, bool))
    package_core_proof = args.proof.with_name(args.proof.stem + "-package-core-native.json")
    package_core = run_pinned_contract(work, "verify_package_core.py", package_core_verifier, package_core_proof, 90)
    assert package_core["accepted"] and package_core["sourceUnchanged"] and package_core["hostPackageDatabaseUnchanged"]
    assert package_core["worksheetCompletionNotInferred"] and package_core["temporaryFilesCleaned"]
    assert package_core["sourceHashes"] == {name: file["sha256"] for name, file in package_core_packs[0]["files"].items()}
    assert len(package_core["profiles"]) == 3 and package_core["loggedLifecycles"] == 26
    package_optional_proof = args.proof.with_name(args.proof.stem + "-package-optional-native.json")
    package_optional = run_pinned_contract(work, "verify_package_optional.py", package_optional_verifier, package_optional_proof, 180)
    assert package_optional["accepted"] and package_optional["sourceUnchanged"] and package_optional["hostPackageDatabaseUnchanged"]
    assert package_optional["worksheetCompletionNotInferred"] and package_optional["temporaryFilesCleaned"]
    assert package_optional["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in package_optional_packs for name,file in pack["files"].items()}
    assert len(package_optional["profiles"]) == 6
    assert all(value for profile in package_optional["profiles"] for value in profile.values() if isinstance(value,bool))
    network_records = args.proof.parent / "network-records"
    network_records.mkdir(exist_ok=True)
    network_proof = network_records / (args.proof.stem + "-network-native.json")
    network = run_pinned_contract(work, "verify_network_labs.py", network_verifier, network_proof, 240)
    assert network["accepted"] and network["sourceUnchanged"] and network["loopbackAddressesAndMainRoutesUnchanged"]
    assert network["worksheetCompletionNotInferred"] and network["temporaryFilesCleaned"]
    assert network["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in network_packs for name, file in pack["files"].items()}
    assert len(network["profiles"]) == 9 and network["loggedLifecycles"] == 148
    assert network["foregroundServicesClosed"] == 30
    network_reports = [json.loads(path.read_text()) for path in network_records.glob("[012]-*.json")]
    assert len(network_reports) == 39
    assert sum(len(report["commands"]) for report in network_reports) == 255
    assert all(report["learnerWorksheetCompletionInferred"] is False for report in network_reports)
    assert all(value for profile in network["profiles"] for value in profile.values() if isinstance(value, bool))
    storage_records = args.proof.parent / "storage-records"
    storage_records.mkdir(exist_ok=True)
    storage_proof = storage_records / (args.proof.stem + "-storage-native.json")
    storage = run_pinned_contract(work, "verify_storage_labs.py", storage_verifier, storage_proof, 180)
    assert all(storage[key] for key in ["accepted", "sourceUnchanged", "temporaryFilesCleaned", "worksheetCompletionNotInferred", "hostStorageConfigurationUnchanged"])
    assert storage["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in storage_packs for name, file in pack["files"].items()}
    assert len(storage["profiles"]) == 9 and storage["loggedOuterLifecycles"] == 177
    assert storage["nativeCommandRecords"] == 246 and storage["partialArchiveInterruptionProfiles"] == 3
    assert all(value for profile in storage["profiles"] for value in profile.values() if isinstance(value, bool))
    storage_reports = list(storage_records.glob("[012]-*-storage-observation.json"))
    assert len(storage_reports) == 9
    shell_records = args.proof.parent / "shell-records"
    shell_records.mkdir(exist_ok=True)
    shell_proof = shell_records / (args.proof.stem + "-shell-native.json")
    shell = run_pinned_contract(work, "verify_shell_optional.py", shell_verifier, shell_proof, 90)
    assert shell["nativePassed"] and shell["sourceUnchanged"] and shell["ownedTemporaryCasesRemoved"]
    assert shell["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in shell_packs for name, file in pack["files"].items()}
    assert len(shell["profiles"]) == 6 and shell["actualCases"] == 81
    assert all(profile["passed"] and profile["inputAndHelperRestored"] for profile in shell["profiles"])
    filesystem_records = args.proof.parent / "filesystem-records"
    filesystem_records.mkdir(exist_ok=True)
    filesystem_proof = filesystem_records / (args.proof.stem + "-filesystem-native.json")
    filesystem = run_pinned_contract(work, "verify_filesystem_optional.py", filesystem_verifier, filesystem_proof, 90)
    assert filesystem["nativePassed"] and filesystem["sourceUnchanged"] and filesystem["temporaryCasesRemoved"]
    assert filesystem["controlledDeadlineAndInterruptionPassed"]
    assert filesystem["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in filesystem_packs for name, file in pack["files"].items()}
    assert len(filesystem["profiles"]) == 6 and filesystem["actualCases"] == 68 and filesystem["innerNativeCommands"] == 96
    assert all(profile["passed"] and profile["readOnlyInputsPreserved"] and profile["outsideSentinelPreserved"] for profile in filesystem["profiles"])
    permissions_records = args.proof.parent / "permissions-records"
    permissions_records.mkdir(exist_ok=True)
    permissions_proof = permissions_records / (args.proof.stem + "-permissions-native.json")
    permissions = run_pinned_contract(work, "verify_permissions_optional.py", permissions_verifier, permissions_proof, 90)
    assert permissions["nativePassed"] and permissions["sourceUnchanged"] and permissions["temporaryCasesRemoved"]
    assert permissions["actualAccessProbes"] == 108 and permissions["actualCreationExperiments"] == 27
    assert permissions["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in permissions_packs for name, file in pack["files"].items()}
    assert len(permissions["profiles"]) == 6 and permissions["actualCases"] == 102
    assert all(profile["passed"] and profile["workspaceEntriesAndModeRestored"] and profile["outsideSentinelPreserved"] for profile in permissions["profiles"])
    setup_records = args.proof.parent / "setup-records"
    setup_records.mkdir(exist_ok=True)
    setup_proof = setup_records / (args.proof.stem + "-setup-native.json")
    setup = run_pinned_contract(work, "verify_setup_optional.py", setup_verifier, setup_proof, 90)
    assert setup["nativePassed"] and setup["sourceUnchanged"] and setup["temporaryCasesRemoved"]
    assert setup["callerPathUnchanged"] and setup["actualCases"] == setup["processLifecycles"] == 94
    assert setup["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in setup_packs for name, file in pack["files"].items()}
    assert len(setup["profiles"]) == 6 and all(profile["passed"] and profile["inputsUnchanged"] and profile["temporaryModesRestored"] and profile["outsideSentinelPreserved"] for profile in setup["profiles"])
    scheduling_records = args.proof.parent / "scheduling-records"
    scheduling_records.mkdir(exist_ok=True)
    scheduling_proof = scheduling_records / (args.proof.stem + "-scheduling-native.json")
    scheduling = run_pinned_contract(work, "verify_scheduling_optional.py", scheduling_verifier, scheduling_proof, 150)
    assert scheduling["nativePassed"] and scheduling["sourceUnchanged"] and scheduling["temporaryCasesRemoved"]
    assert scheduling["systemClockProgressionPreserved"] and scheduling["actualCases"] == scheduling["loggedOuterLifecycles"] == 64
    assert scheduling["calendarToolLifecycles"] == 24 and scheduling["actualUserTimerLifecycles"] == 9
    assert scheduling["actualInterruptedTimerLifecycles"] == 3 and scheduling["actualWorkerEvents"] > 0
    assert scheduling["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in scheduling_packs for name, file in pack["files"].items()}
    assert len(scheduling["profiles"]) == 6 and all(profile["passed"] and profile["inputsUnchanged"] and profile["ownedResourcesRemoved"] and profile["outsideSentinelPreserved"] for profile in scheduling["profiles"])
    web_records = args.proof.parent / "web-records"
    web_records.mkdir(exist_ok=True)
    web_proof = web_records / (args.proof.stem + "-web-native.json")
    web = run_pinned_contract(work, "verify_web_optional.py", web_verifier, web_proof, 150)
    assert web["nativePassed"] and web["sourceUnchanged"] and web["temporaryCasesRemoved"]
    assert web["actualCases"] == web["loggedOuterLifecycles"] == 66 and web["actualHttpRequests"] == 171
    assert web["actualNginxLifecycles"] == 24 and web["actualInterruptedNginxLifecycles"] == 6
    assert web["actualSyntaxRejections"] == web["actualCreationDenials"] == 6 and web["actualNativeCommands"] == 60
    assert web["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in web_packs for name, file in pack["files"].items()}
    assert len(web["profiles"]) == 6 and all(profile["passed"] and profile["inputsUnchanged"] and profile["ownedResourcesRemoved"] and profile["outsideSentinelPreserved"] for profile in web["profiles"])
    deployment_records = args.proof.parent / "deployment-studio-records"
    deployment_records.mkdir(exist_ok=True)
    deployment_proof = deployment_records / (args.proof.stem + "-deployment-studio-native.json")
    deployment = run_pinned_contract(work, "verify_deployment_studio.py", deployment_verifier, deployment_proof, 180)
    assert deployment["nativePassed"] and deployment["sourceUnchanged"] and deployment["temporaryCasesRemoved"]
    assert deployment["actualCases"] == deployment["loggedOuterLifecycles"] == 93
    assert deployment["actualHttpRequests"] == 162 and deployment["actualNginxLifecycles"] == 24
    assert deployment["actualPublisherLifecycles"] == 33 and deployment["actualContentionExits"] == 4
    assert deployment["actualPublisherSigintCases"] == 6 and deployment["actualPublisherCleanupTerminations"] == 3
    assert deployment["actualObserverInterruptions"] == deployment["actualCreationDenials"] == 9
    assert deployment["actualSyntaxRejections"] == 6 and deployment["actualNativeCommands"] == 60
    assert deployment["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in deployment_packs for name, file in pack["files"].items()}
    assert len(deployment["profiles"]) == 9 and all(profile["passed"] and profile["inputsUnchanged"] and profile["ownedResourcesRemoved"] and profile["outsideSentinelPreserved"] for profile in deployment["profiles"])
    capstone_records = args.proof.parent / "operations-capstone-records"
    capstone_records.mkdir(exist_ok=True)
    capstone_proof = capstone_records / (args.proof.stem + "-operations-capstone-native.json")
    capstone = run_pinned_contract(work, "verify_operations_capstone.py", capstone_verifier, capstone_proof, 240)
    assert capstone["nativePassed"] and capstone["sourceUnchanged"] and capstone["realSystemManager"]
    # Actual readiness and timer polling counts vary with the runner; reconcile
    # every observed lifecycle and require the same concrete manager transitions.
    assert capstone["actualCommandCases"] == capstone["loggedCommandLifecycles"] > 0
    assert capstone["actualHttpRequests"] > 0 and not capstone["learnerWorksheetCompletionInferred"]
    assert all(profile["evidence"]["actualWorkingDirectoryFailure"]["ExecMainStatus"] == "200" for profile in capstone["profiles"])
    assert all(profile["evidence"]["initialScheduledBackup"]["timer"]["LastTriggerUSec"] not in ("", "n/a", "0") for profile in capstone["profiles"])
    assert all(profile["evidence"]["changedScheduledBackup"]["manager"]["Result"] == "success" for profile in capstone["profiles"] if profile["profile"] != "starter")
    assert capstone["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in capstone_packs for name, file in pack["files"].items()}
    assert len(capstone["profiles"]) == 3 and all(profile["passed"] and profile["inputsUnchanged"] and profile["evidence"]["ownedResourcesRemoved"] for profile in capstone["profiles"])
    recovery_records = args.proof.parent / "capstone-recovery-records"
    recovery_records.mkdir(exist_ok=True)
    recovery_proof = recovery_records / (args.proof.stem + "-capstone-recovery-native.json")
    recovery = run_pinned_contract(work, "verify_capstone_recovery.py", recovery_verifier, recovery_proof, 180)
    assert recovery["nativePassed"] and recovery["sourceUnchanged"] and recovery["platform"] == "Linux" and recovery["uid"] > 0
    assert recovery["actualCases"] == recovery["loggedOuterLifecycles"] == 48
    assert recovery["actualBackupChildLifecycles"] == 246 and not recovery["learnerWorksheetCompletionInferred"]
    assert recovery["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in recovery_packs for name, file in pack["files"].items()}
    assert len(recovery["profiles"]) == 6 and all(profile["passed"] and profile["inputsUnchanged"] and profile["outsideSentinelPreserved"] and profile["ownedResourcesRemoved"] for profile in recovery["profiles"])
    observability_records = args.proof.parent / "observability-studio-records"
    observability_records.mkdir(exist_ok=True)
    observability_proof = observability_records / (args.proof.stem + "-observability-studio-native.json")
    observability = run_pinned_contract(work, "verify_observability_studio.py", observability_verifier, observability_proof, 240)
    assert observability["nativePassed"] and observability["sourceUnchanged"] and observability["platform"] == "Linux" and observability["uid"] > 0
    assert observability["actualCases"] == observability["loggedOuterLifecycles"] == 72
    assert observability["actualServiceInvocations"] == observability["actualManagedProcessObservations"] == observability["actualObservationGates"] == 81
    assert observability["actualOwnedTimers"] == observability["actualScheduledGateObservations"] == 72
    assert observability["actualWorkerEvents"] == 144 and observability["actualPolicyDecisions"] == 81 and observability["actualOperatorRetests"] == 9
    assert observability["error"] is None and not observability["learnerWorksheetCompletionInferred"]
    assert observability["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in observability_packs for name, file in pack["files"].items()}
    assert len(observability["profiles"]) == 9 and all(profile["passed"] and profile["inputsUnchanged"] and profile["outsideSentinelPreserved"] and profile["ownedResourcesRemoved"] for profile in observability["profiles"])
    backup_studio_records = args.proof.parent / "backup-studio-records"
    backup_studio_records.mkdir(exist_ok=True)
    backup_studio_proof = backup_studio_records / (args.proof.stem + "-backup-studio-native.json")
    backup_studio = run_pinned_contract(work, "verify_backup_studio.py", backup_studio_verifier, backup_studio_proof, 240)
    assert backup_studio["nativePassed"] and backup_studio["sourceUnchanged"] and backup_studio["platform"] == "Linux" and backup_studio["uid"] > 0
    assert backup_studio["actualCases"] == backup_studio["loggedOuterLifecycles"] == 75
    assert backup_studio["actualCommandObservations"] == 216 and backup_studio["actualChildLifecycles"] == 201
    assert backup_studio["actualSpawnRefusals"] == 15 and backup_studio["actualPublishedArchives"] == 67
    assert backup_studio["actualDeletions"] == 6 and backup_studio["actualSeparateRestores"] == 45 and backup_studio["actualInterruptions"] == 9
    assert backup_studio["error"] is None and not backup_studio["learnerWorksheetCompletionInferred"]
    assert backup_studio["sourceHashes"] == {pack["pack"] + "/" + name: file["sha256"] for pack in backup_studio_packs for name, file in pack["files"].items()}
    assert len(backup_studio["profiles"]) == 9 and all(profile["passed"] and profile["inputsUnchanged"] and profile["outsideSentinelPreserved"] and profile["ownedResourcesRemoved"] for profile in backup_studio["profiles"])
    default = work / "default-workspace"
    default.mkdir()
    default_archive = args.archives / "default-linux.zip"
    default_hashes = {}
    with zipfile.ZipFile(default_archive) as archive:
        names = archive.namelist()
        assert len(names) == 2
        root = names[0].split("/")[0]
        assert set(names) == {root + "/main.sh", root + "/README.md"}
        for name in ("main.sh", "README.md"):
            content = archive.read(root + "/" + name)
            (default / name).write_bytes(content)
            default_hashes[name] = hashlib.sha256(content).hexdigest()
    default_command = ["bash", str(default / "main.sh")]
    started = time.time()
    default_child = subprocess.Popen(default_command, cwd=default,
                                     stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                     start_new_session=True)
    cleanup = "process exited"
    try:
        output, diagnostics = default_child.communicate(timeout=10)
    except BaseException:
        os.killpg(default_child.pid, signal.SIGTERM)
        try:
            default_child.communicate(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(default_child.pid, signal.SIGKILL)
            default_child.communicate()
        cleanup = "process group terminated"
        raise
    finally:
        with args.proof.with_suffix(".processes.jsonl").open("a") as stream:
            stream.write(json.dumps({
                "parentTaskId": os.environ.get("CLASSES_FAMILY_TASK_ID", "linux-site-export-ci"),
                "parentPid": os.getpid(), "pid": default_child.pid,
                "command": default_command, "cwd": str(default),
                "startTime": started, "endTime": time.time(),
                "exitCode": default_child.returncode, "timeoutSeconds": 10,
                "childProcessGroupCleanup": cleanup}) + "\n")
    assert default_child.returncode == 0 and output == b"Hello, Linux!\n"
    assert diagnostics == b""
    args.proof.write_text(json.dumps({"sourceIdentity": identity, "archives": archives,
                                     "nativeProof": str(native_proof),
                                     "proxySourceIdentity": proxy_identity,
                                     "proxyNativeProof": str(proxy_proof),
                                     "apacheSourceIdentity": apache_identity,
                                     "apacheNativeProof": str(apache_proof),
                                     "apacheReloadGenerations": apache_reload_generations,
                                     "systemdSourceIdentity": systemd_identity,
                                     "systemdNativeProof": str(systemd_proof),
                                     "supplementalSourceIdentity": supplemental_identity,
                                     "supplementalNativeProof": str(supplemental_proof),
                                     "loggingSourceIdentity": logging_identity,
                                     "loggingNativeProof": str(logging_proof),
                                     "editingCoreSourceIdentity": editing_core_identity,
                                     "editingCoreNativeProof": str(editing_core_proof),
                                     "editingOptionalSourceIdentity": editing_optional_identity,
                                     "editingOptionalNativeProof": str(editing_optional_proof),
                                     "filesystemOptionalSourceIdentity": filesystem_identity,
                                     "filesystemOptionalNativeProof": str(filesystem_proof),
                                     "schedulingOptionalSourceIdentity": scheduling_identity,
                                     "schedulingOptionalNativeProof": str(scheduling_proof),
                                     "backupStudioSourceIdentity": backup_studio_identity,
                                     "backupStudioNativeProof": str(backup_studio_proof),
                                     "observabilityStudioSourceIdentity": observability_identity,
                                     "observabilityStudioNativeProof": str(observability_proof),
                                     "capstoneRecoverySourceIdentity": recovery_identity,
                                     "capstoneRecoveryNativeProof": str(recovery_proof),
                                     "operationsCapstoneSourceIdentity": capstone_identity,
                                     "operationsCapstoneNativeProof": str(capstone_proof),
                                     "deploymentStudioSourceIdentity": deployment_identity,
                                     "deploymentStudioNativeProof": str(deployment_proof),
                                     "webOptionalSourceIdentity": web_identity,
                                     "webOptionalNativeProof": str(web_proof),
                                     "setupOptionalSourceIdentity": setup_identity,
                                     "setupOptionalNativeProof": str(setup_proof),
                                     "permissionsOptionalSourceIdentity": permissions_identity,
                                     "permissionsOptionalNativeProof": str(permissions_proof),
                                     "shellOptionalSourceIdentity": shell_identity,
                                     "shellOptionalNativeProof": str(shell_proof),
                                     "storageSourceIdentity": storage_identity,
                                     "storageNativeProof": str(storage_proof),
                                     "networkSourceIdentity": network_identity,
                                     "networkNativeProof": str(network_proof),
                                     "packageCoreSourceIdentity": package_core_identity,
                                     "packageCoreNativeProof": str(package_core_proof),
                                     "packageOptionalSourceIdentity": package_optional_identity,
                                     "packageOptionalNativeProof": str(package_optional_proof),
                                     "processCoreSourceIdentity": process_core_identity,
                                     "processCoreNativeProof": str(process_core_proof),
                                     "processOptionalSourceIdentity": process_optional_identity,
                                     "processOptionalNativeProof": str(process_optional_proof),
                                     "defaultWorkspace": {"fileHashes": default_hashes,
                                                          "stdout": output.decode(),
                                                          "status": default_child.returncode},
                                     "nativePassed": True}, indent=2) + "\n")
