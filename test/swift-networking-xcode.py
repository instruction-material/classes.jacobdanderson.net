"""Build Xcode targets from exact networking exports and a declared long-data variant."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def generate(browser, output, variant):
    spec = importlib.util.spec_from_file_location("swift_export_xcode", ROOT / "test/swift-welcome-xcode.py")
    builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(builder)
    template = (ROOT / "test/fixtures/swift-networking-uitests.swift").read_text()
    template = template.replace("LONG_DATA", "true" if variant == "long-data" else "false")
    result = builder.generate(
        browser, output, kind="networking",
        source_files=("APIReferenceApp.swift", "ContentView.swift", "ReferenceClient.swift", "ReferenceStore.swift"),
        shared_files=("README.md", "verify-networking.py", "tests/ReferenceContracts.swift"),
        ui_template=template
    )
    if variant == "long-data":
        title = "LONG_TITLE_BEGIN " + "Readable reference titles can wrap across several lines. " * 3 + "LONG_TITLE_END"
        body = "LONG_BODY_BEGIN " + "A reference detail remains readable when content fills more than one screen. " * 18 + "LONG_BODY_END"
        entries = [
            {"id": 1, "title": title, "body": body},
            {"id": 2, "title": "Check an HTTP response", "body": "Validate the status before decoding the response body."},
            {"id": 3, "title": "Keep state predictable", "body": "A cancelled request must not replace a newer result."}
        ]
        replacement = 'static let json = """\n    ' + json.dumps(entries).replace("\\", "\\\\") + '\n    """'
        for profile in result["profiles"]:
            path = output / profile["role"] / profile["role"] / "ReferenceClient.swift"
            before = path.read_bytes()
            changed, count = re.subn(r'static let json = """[\s\S]*?"""', lambda _match: replacement, before.decode())
            assert count == 1
            path.write_text(changed)
            profile["declaredSourceVariant"] = dict(
                path=str(path.relative_to(output)), originalSha256=hashlib.sha256(before).hexdigest(),
                sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
                change="Only the embedded sample JSON title and body are enlarged; UI, client and store logic unchanged."
            )
    for profile in result["profiles"]:
        profile["variant"] = variant
        profile["contentSize"] = "accessibility-extra-extra-extra-large" if variant == "long-data" else "large"
    result["variant"] = variant
    result["nativeExecutionVerified"] = False
    (output / "inputs.json").write_text(json.dumps(result, indent=2) + "\n")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--variant", choices=("standard", "long-data"), required=True)
    args = parser.parse_args()
    print(json.dumps(generate(args.browser.resolve(), args.output.resolve(), args.variant)))
