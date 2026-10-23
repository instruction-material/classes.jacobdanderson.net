import importlib.util
import os
from pathlib import Path
import sys


SNAPSHOT_PATH = Path(__file__).resolve().parents[1] / "scripts/snapshot-native-candidate.py"
SPECIFICATION = importlib.util.spec_from_file_location("native_candidate_snapshot", SNAPSHOT_PATH)
snapshot = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(snapshot)


def main():
    if len(sys.argv) != 3:
        raise ValueError("Expected extracted archive and new snapshot paths")
    extracted = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    destination.mkdir()
    source_descriptor = os.open(extracted, snapshot.DIRECTORY_FLAGS)
    destination_descriptor = os.open(destination, snapshot.DIRECTORY_FLAGS)
    try:
        snapshot.copy_tree(source_descriptor, destination_descriptor)
    finally:
        os.close(destination_descriptor)
        os.close(source_descriptor)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError):
        sys.exit("Native archive snapshot rejected")
