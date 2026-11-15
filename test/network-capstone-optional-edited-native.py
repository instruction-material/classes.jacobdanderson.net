"""Run six actual browser-made capstone configuration edits in owned namespaces."""
import argparse
import hashlib
import json
from pathlib import Path
import sys
import tempfile

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, required=True)
    parser.add_argument("--edited-root", type=Path, required=True)
    parser.add_argument("--proof", type=Path, required=True)
    args = parser.parse_args()
    sys.path.insert(0, str(args.source_root / "test"))
    import verify_capstone as v
    import verify_capstone_optional as checks
    args.proof = args.proof.resolve()
    args.proof.parent.mkdir(parents=True, exist_ok=True)
    raw = args.proof.parent / "capstone-browser-edited-raw"
    raw.mkdir(exist_ok=False)
    v.RETAINED = raw
    v.PROCESS_LOG = args.proof.with_suffix(".processes.jsonl")
    definitions = [{"pack": v.PACK, "kind": "core",
                    "starterCase": {"ipv4_service_route": "198.18.99.0/30", "proxy_upstream_port": 9001}}] + checks.CASES["definitions"]
    proof = {"at": v.now(), "accepted": False, "runs": []}
    try:
        with tempfile.TemporaryDirectory(prefix="owned-capstone-browser-edits-") as temp:
            for definition in definitions:
                for role in ["starter", "solution"]:
                    original = args.source_root / definition["pack"] / role
                    folder = args.edited_root / definition["pack"] / role
                    expected = checks.CASES["correctCase"] if role == "starter" else definition["starterCase"]
                    assert json.loads((folder / "case.json").read_text()) == expected
                    for name in checks.CASES["roleFiles"]:
                        if name != "case.json":
                            assert (folder / name).read_bytes() == (original / name).read_bytes()
                    output = Path(temp) / (definition["kind"] + "-" + role)
                    result, _ = v.run([sys.executable, folder / "main.py", "--output", output], folder)
                    if role == "starter":
                        assert result["exitCode"] == 0
                        evidence = v.completed_evidence(output, False)
                    elif definition["kind"] == "core":
                        parent, lab, _ = v.cleanup_evidence(output)
                        assert result["exitCode"] == 1 and not lab["completed"]
                        assert lab["routeGet4"]["exitCode"] != 0 and lab["http6"]["status"] == "502"
                        evidence = {"firstIPv4Failure": "route", "firstIPv6Failure": "upstream",
                                    "packetEvidence": v.packet_observations(output / "capture.pcap"),
                                    "hostUnchanged": parent["hostUnchanged"]}
                    else:
                        assert result["exitCode"] == 1
                        evidence = checks.inspect_unfinished(output, definition["kind"])
                    proof["runs"].append({"pack": definition["pack"], "browserRole": role, "process": result,
                                           "editedCaseSHA256": hashlib.sha256((folder / "case.json").read_bytes()).hexdigest(),
                                           "actualEvidence": evidence})
        assert not Path(temp).exists()
        assert len(proof["runs"]) == 6
        proof.update(accepted=True, actualProfiles=6, actualBrowserTaskEditsExecuted=6,
                     allOtherImportedFilesUnchanged=True, temporaryNativeTreeRemoved=True)
    finally:
        proof["endedAt"] = v.now()
        args.proof.write_text(json.dumps(proof, indent=2) + "\n")
    print(json.dumps({"actualBrowserTaskEditsExecuted": 6, "accepted": True}))

if __name__ == "__main__":
    main()
