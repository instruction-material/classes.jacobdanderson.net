"""Create source-bound Welcome targets for normal and long-note/largest-text UI."""
import argparse
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def generate(browser, output, variant):
    assert variant in ("standard", "long-note")
    spec = importlib.util.spec_from_file_location("welcome_builder", ROOT / "test/swift-welcome-xcode.py")
    builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(builder)
    template = (ROOT / "test/fixtures/swift-welcome-extended-uitests.swift").read_text()
    template = template.replace("LONG_NOTE_VARIANT", "true" if variant == "long-note" else "false")
    result = builder.generate(browser, output, ui_template=template, bundle_suffix=variant)
    for profile in result["profiles"]:
        profile.update(variant=variant, contentSize="large" if variant == "standard" else "accessibility-extra-extra-extra-large")
    result.update(course="welcome", variant=variant, appSourceUnmodified=True,
                  longNoteEnteredThroughNativeUI=variant == "long-note")
    (output / "inputs.json").write_text(json.dumps(result, indent=2) + "\n")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--variant", choices=("standard", "long-note"), required=True)
    args = parser.parse_args()
    print(json.dumps(generate(args.browser.resolve(), args.output.resolve(), args.variant)))
