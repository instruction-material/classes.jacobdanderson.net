#!/usr/bin/env python3
"Verify that practice exports preserve qualified source bytes and only edit notes."

import hashlib
import json
import sys
import zipfile
from pathlib import Path

output = Path(sys.argv[1])
root = Path(__file__).resolve().parent
fixtures = json.loads((root / "fixtures/network-practice-contracts.json").read_text())
proof = json.loads((output / "network-browser-proof.json").read_text())
expected = {
    (f["pack"], role, width)
    for f in fixtures
    for role in ("starter", "solution")
    for width in (390, 1280)
}
actual = {(p["pack"], p["role"], p["width"]) for p in proof["profiles"]}
assert actual == expected and len(proof["profiles"]) == 20
records = []
members = 0
for profile in proof["profiles"]:
    fixture = next(f for f in fixtures if f["pack"] == profile["pack"])
    role = profile["role"]
    files = {
        name: data
        for name, data in fixture["files"].items()
        if name == "README.md" or name.startswith(role + "/")
    }
    assert profile["consentBeforeFetch"] is True
    assert profile["savedEditReopened"] is True
    assert profile["primaryStoreRead"] is True
    assert profile["revision"] == fixture["revision"]
    assert profile["editedFileName"] == role + "/network-notes.md"
    assert fixture["originalCoreItemId"] not in profile["key"]
    for state in ("exact", "edited"):
        path = output / profile[state + "Archive"]
        archive_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        assert archive_hash == profile[state + "ArchiveSha256"]
        with zipfile.ZipFile(path) as archive:
            names = archive.namelist()
            assert len(names) == len(files) == len(set(names))
            for relative, original in files.items():
                matches = [name for name in names if name.endswith("/" + relative)]
                assert len(matches) == 1
                value = archive.read(matches[0])
                source = original["content"].encode()
                assert hashlib.sha256(source).hexdigest() == original["sha256"]
                expected_bytes = (
                    fixture["roleEdits"][role].encode()
                    if state == "edited" and relative == role + "/network-notes.md"
                    else source
                )
                assert value == expected_bytes, (path.name, relative)
                members += 1
        records.append(
            {
                "archive": path.name,
                "sha256": archive_hash,
                "files": len(files),
                "state": state,
            }
        )
assert len(records) == 40
result = {
    "profiles": 20,
    "archives": len(records),
    "archiveMembers": members,
    "programAndConfigurationBytesUnchanged": True,
    "freshKernelRunClaimed": False,
    "records": records,
}
(output / "practice-export-continuity.json").write_text(
    json.dumps(result, indent=2) + "\n"
)
print(json.dumps({k: v for k, v in result.items() if k != "records"}))
