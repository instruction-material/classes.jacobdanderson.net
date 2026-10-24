"""Build ordinary targets from unmodified chosen-role course exports."""
import argparse
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COURSES = {
    "gallery": "MediaGalleryApp.swift",
    "hobby": "MultiTabHobbyApp.swift",
    "map": "MapPlacesApp.swift",
    "capstone": "PublishReadyCapstoneApp.swift",
}


def generate(browser, output, course, variant):
    assert course in COURSES and variant in ("standard", "largest-text")
    spec = importlib.util.spec_from_file_location("swift_chosen_role_xcode", ROOT / "test/swift-welcome-xcode.py")
    builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(builder)
    template = (ROOT / "test/fixtures/swift-canonical-uitests.swift").read_text()
    template = template.replace("COURSE", str(list(COURSES).index(course)))
    result = builder.generate(browser, output, kind=course,
                              source_files=("ContentView.swift", COURSES[course]),
                              ui_template=template, bundle_suffix=variant)
    for profile in result["profiles"]:
        profile.update(variant=variant, contentSize="large" if variant == "standard" else "accessibility-extra-extra-extra-large")
    result.update(course=course, variant=variant, appSourceUnmodified=True)
    (output / "inputs.json").write_text(json.dumps(result, indent=2) + "\n")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--course", choices=tuple(COURSES), required=True)
    parser.add_argument("--variant", choices=("standard", "largest-text"), required=True)
    args = parser.parse_args()
    print(json.dumps(generate(args.browser.resolve(), args.output.resolve(), args.course, args.variant)))
