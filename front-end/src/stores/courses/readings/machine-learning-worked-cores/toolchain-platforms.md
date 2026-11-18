# Run the same library project on each platform

The native library projects use the same source, local data and requirements on supported desktop systems. The environment's executable path changes with the operating system.

On macOS or Linux, run from the extracted project folder:

```text
python3.14 -m venv .venv
.venv/bin/python -m pip install --require-hashes -r requirements.txt
MPLBACKEND=Agg .venv/bin/python main.py
```

In Windows PowerShell, use:

```text
py -3.14 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --require-hashes -r requirements.txt
$env:MPLBACKEND = "Agg"
.\.venv\Scripts\python.exe main.py
```

Agg writes the supplied figures to local image files. Open those files after the program finishes. Keep the CSV beside the source and use the exact filename recorded in `README.md`.

An unfinished starter stops at its named fitting task. Complete that function before expecting the final report. Earlier standard-library projects use their own simpler README commands. Record the actual platform and interpreter with the result so another reader can select the corresponding path.

[Python on Windows](https://docs.python.org/3.14/using/windows.html).
