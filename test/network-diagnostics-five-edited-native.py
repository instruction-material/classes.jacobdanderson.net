"""Run the configurations actually edited through the site browser."""
import argparse
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
    import verify_diagnostics_five as checks
    args.proof = args.proof.resolve()
    args.proof.parent.mkdir(parents=True, exist_ok=True)
    raw = args.proof.parent / "diagnostics-five-edited-raw"
    raw.mkdir(exist_ok=False)
    proof = {"at": checks.now(), "accepted": False, "runs": [], "processes": []}
    try:
        for definition in checks.CASES["definitions"]:
            for role in ["starter", "solution"]:
                original = args.source_root / definition["pack"] / role
                work = args.edited_root / definition["pack"] / role
                expected_case = definition["referenceCase" if role == "starter" else "starterCase"]
                assert json.loads((work / "case.json").read_text()) == expected_case
                for name in definition["roleFiles"]:
                    if name != "case.json":
                        assert (work / name).read_bytes() == (original / name).read_bytes()
                row = checks.run_profile(work, definition, role == "starter", False, "normal", raw,
                    proof["processes"], definition["kind"] + "-browser-" + role)
                row.update(browserRole=role, editedTaskSHA256=checks.digest((work / "case.json").read_bytes()))
                proof["runs"].append(row)
        assert len(proof["runs"]) == 10
        proof.update(accepted=True, actualProfiles=10, actualBrowserTaskEditsExecuted=10,
                     allOtherImportedFilesUnchanged=True)
    finally:
        proof["endedAt"] = checks.now()
        args.proof.write_text(json.dumps(proof, indent=2) + "\n")
    print(json.dumps({"actualBrowserTaskEditsExecuted": 10, "accepted": True}))


if __name__ == "__main__":
    main()
