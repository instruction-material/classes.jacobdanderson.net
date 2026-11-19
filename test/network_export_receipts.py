"""Bind a native verifier to its exact browser profile and exported bytes."""
import hashlib
from pathlib import PurePosixPath


def export_profile(browser, fixture, role, width):
    assert role in {"starter", "solution"}
    source_role = "starter" if role == "starter" else "reference"
    version = fixture.get("projectKeyVersion")
    suffix = "-v" + str(version) if version else ""
    key = f"network-systems:{fixture['coreItemId']}:{source_role}:native-network{suffix}"
    matches = [profile for profile in browser["profiles"]
               if profile["pack"] == fixture["pack"] and profile["role"] == role
               and profile["width"] == width and profile["key"] == key]
    assert len(matches) == 1, "Expected one browser profile for this exact saved project"
    profile = matches[0]
    assert profile["revision"] == fixture["revision"], "Browser source revision differs"
    assert profile["consentBeforeFetch"] and profile["savedEditReopened"]
    assert profile["previousWorkPreserved"] and profile["remoteWrites"] == 0
    return profile


def read_export(output, profile, variant):
    assert variant in {"exact", "edited"}
    name = profile[variant + "Archive"]
    key_digest = hashlib.sha256(profile["key"].encode()).hexdigest()[:12]
    expected = f"{profile['pack']}-{key_digest}-{profile['role']}-{profile['width']}-{variant}.zip"
    assert name == expected, "Archive name differs from the recorded project identity"
    assert PurePosixPath(name).name == name and "\\" not in name
    raw = (output / name).read_bytes()
    assert hashlib.sha256(raw).hexdigest() == profile[variant + "ArchiveSha256"], "Archive bytes differ"
    return name, raw
