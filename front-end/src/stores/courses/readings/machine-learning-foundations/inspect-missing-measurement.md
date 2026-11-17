# Inspect one missing measurement

Complete `inspect_fixture` in the supplied data-card starter first. Its `main.py` also provides `DATA`, `FIELDS` and `split_ids`. From that role's folder, save this separate `variation.py`:

```python
import csv
from pathlib import Path
from main import DATA, FIELDS, inspect_fixture, split_ids

original = inspect_fixture(DATA)
with DATA.open(newline="", encoding="utf-8") as source:
    rows = list(csv.DictReader(source))

rows[0]["water_liters"] = ""
copy = Path("garden_missing.csv")
with copy.open("w", newline="", encoding="utf-8") as target:
    writer = csv.DictWriter(target, fieldnames=FIELDS, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)

changed = inspect_fixture(copy)
print(original["missing"]["water_liters"],
      changed["missing"]["water_liters"])
print(original["source_sha256"] == changed["source_sha256"])
print(split_ids(original["identifiers"]) ==
      split_ids(changed["identifiers"]))
```

Run `python variation.py`. The expected lines are 0 1, False and True. The first garden plot, garden-001, now has an empty water measurement in the copy. Its identity and every other row remain present.

Both inspections still have 120 rows, the same header and 40 plots per soil category. The hash changes because the file bytes changed. Seed-42 splitting retains the same 96 training and 24 held-out identities because that helper uses identities rather than measurement values. No model is fitted here. Keep the canonical CSV unchanged and retain the copy's missingness record and checksum with the explanation.
