# Compare two recorded environments

Use the same complete library project and unchanged data. Record the source revision and Python version used for the existing successful result. Through that project's interpreter, collect:

```text
.venv/bin/python --version
.venv/bin/python -m pip list --format=freeze
.venv/bin/python -m pip check
```

On Windows, substitute `.\.venv\Scripts\python.exe` for the executable. Compare installed versions with the supplied `requirements.txt`. A successful pip check reports No broken requirements found; the version listing identifies the package graph actually used.

Write a note naming the source revision, interpreter, matching or differing package versions and smallest observed result. If a version differs, keep the successful source and outputs, recreate the recorded environment from its requirements, and repeat the import check and small case.

An optional comparison with a newer environment uses a separate copy and the same input and split. Explain any changed error, metric or output using the recorded versions. A cosmetic display change and a different model result require different conclusions.
