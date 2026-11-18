# Choose the environment for the selected project

The offline data-card, evaluation-contract, neuron and small image fixtures use Python's standard library. Their README gives the supported interpreter and run command. The ML-Library-Workspaces projects use Python 3.14 and the exact libraries in their supplied `requirements.txt`.

Export and extract the complete selected folder. Keep `main.py`, `exercise.py`, `README.md`, `SOURCES.md`, `requirements.txt` and any supplied CSV together. `README.md` identifies the named task and expected outputs; `SOURCES.md` records the input origin and implementation assumptions.

For a library project on macOS or Linux, run from that folder:

```text
python3.14 -m venv .venv
.venv/bin/python -m pip install --require-hashes -r requirements.txt
.venv/bin/python -m pip check
```

The first command creates an isolated interpreter; the second installs the recorded versions with accepted download hashes; the third checks installed dependency relationships. Complete the named fitting function in `exercise.py`, then use the Run instructions supplied by that project's IDE workspace. A reference project already includes the completed fitting function.

Local scripts provide the complete required route. Jupyter or VS Code can be used as editors; a hosted notebook account or accelerator is optional. Keep the selected interpreter and the project's requirements together when comparing results.

[Python virtual environments](https://docs.python.org/3.14/library/venv.html).
