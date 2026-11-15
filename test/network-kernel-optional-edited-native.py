"""Run the task files actually changed through the browser editor."""
import argparse
import base64
import json
from pathlib import Path
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, required=True)
    parser.add_argument("--edited-root", type=Path, required=True)
    parser.add_argument("--proof", type=Path, required=True)
    args = parser.parse_args()
    sys.path.insert(0, str(args.source_root / "test"))
    from kernel_optional_source import CASES, digest
    import verify_capture_optional as capture
    import verify_routing_optional as routing

    args.proof = args.proof.resolve()
    raw = args.proof.parent / "edited-raw"
    raw.mkdir(parents=True, exist_ok=False)
    proof = {"at": routing.now(), "accepted": False, "processes": [], "runs": []}
    try:
        for family in ["routing", "capture"]:
            for definition in CASES[family]:
                for role in ["starter", "solution"]:
                    work = args.edited_root / definition["pack"] / role
                    changed = work / definition["taskFile"]
                    expected_role = "solution" if role == "starter" else "starter"
                    assert digest(changed) == definition["choiceHashes"][expected_role]
                    for name, expected in CASES["qualifiedApparatus"][family].items():
                        assert digest(work / name) == expected
                    label = definition["kind"] + "-browser-" + role
                    if family == "routing":
                        routing.observe(work, label, definition["kind"], role == "starter",
                                        "normal", definition["exposure"], raw, proof)
                        proof["runs"][-1].update(family=family, browserRole=role,
                                                editedTaskSHA256=digest(changed))
                    else:
                        report = raw / (label + ".json")
                        reverse = role == "solution"
                        argv = ["bash", str(work / "capture_http.sh"), "--output", str(report)]
                        if reverse:
                            argv.append("--reverse")
                        code, stdout, stderr = capture.run(argv, proof["processes"])
                        (raw / (label + ".stdout")).write_text(stdout)
                        (raw / (label + ".stderr")).write_text(stderr)
                        assert code == 0, (label, code, stderr)
                        data = json.loads(report.read_text())
                        settings = definition["referenceSettings" if role == "starter" else "starterSettings"]
                        frames, requests = capture.check_observations(data, settings, role == "starter", "normal", reverse)
                        pcap = base64.b64decode(data["lab"]["pcapBase64"], validate=True)
                        (raw / (label + ".pcap")).write_bytes(pcap)
                        proof["runs"].append({"profile": label, "family": family, "browserRole": role,
                            "editedTaskSHA256": digest(changed), "expectedComplete": role == "starter",
                            "settings": settings, "reverse": reverse, "exitCode": code,
                            "rawReport": str(report), "rawSHA256": digest(report), "evidence": data,
                            "independentFrames": frames, "actualRequests": requests})
        assert len(proof["runs"]) == 12
        proof.update(accepted=True, actualProfiles=12, actualBrowserTaskEditsExecuted=12,
                     originalApparatusUnchanged=True)
    finally:
        proof["endedAt"] = routing.now()
        args.proof.parent.mkdir(parents=True, exist_ok=True)
        args.proof.write_text(json.dumps(proof, indent=2) + "\n")
    print(json.dumps({"editedExportProfiles": 12, "accepted": True}))


if __name__ == "__main__":
    main()
