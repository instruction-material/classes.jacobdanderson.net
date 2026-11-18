# Verify the library imports before fitting

Use one complete ML-Library-Workspaces folder already exported from its course project. Create the Python 3.14 environment and install its requirements as described in Setup Assumptions.

On macOS or Linux, run:

```text
.venv/bin/python -c "import sys,numpy,pandas,sklearn,matplotlib; print(sys.version.split()[0]); print('ML imports ready')"
```

On Windows, run the same command through `.\.venv\Scripts\python.exe` instead of `.venv/bin/python`. Expected output is the selected 3.14 interpreter version followed by ML imports ready. This check imports the required libraries before fitting a model.

Save the command and observed output in project notes. A missing-module error usually identifies an interpreter or incomplete-installation problem: use pip through the same project interpreter, install its recorded requirements, then repeat the check. Once it passes, continue the named fitting exercise and retain its actual model report separately.
