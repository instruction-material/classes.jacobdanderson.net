# Recover with the project's recorded versions

A source revision and its `requirements.txt` describe one reproducible project environment. Keep that file with the saved work. A newer installed library can change defaults, accepted arguments or numerical behavior.

If an import is missing, check which interpreter runs the project. A command through `.venv/bin/python` on macOS/Linux, or `.venv\Scripts\python.exe` on Windows, uses the selected project's environment. Run pip through that same interpreter so installation and execution refer to the same place.

A hash mismatch means the downloaded bytes do not match the hashes accepted by the supplied requirements. Confirm the complete selected source folder and restore its original requirements file. Keep the edited `exercise.py` and notes, create a fresh environment using the supported Python version, and install from that recorded file.

After recovery, rerun the import check and smallest supplied case before a full comparison. Record the interpreter, source revision, requirements identity and observed output. An intentional experiment with newer versions belongs in a separate saved copy, with its resulting changes documented alongside the original result.

[pip hash-checked requirements](https://pip.pypa.io/en/stable/topics/secure-installs/).
