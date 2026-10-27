A [virtual environment](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) keeps this workspace's packages separate from other Python projects. Use Python 3.12, 3.13 or 3.14, which are supported by the current [NetworkX release](https://networkx.org/documentation/stable/install.html). PyCharm or VS Code can use the same environment as the terminal.

## Create the environment

Open a terminal in the folder where the search and graph labs will be saved. Check the selected Python version with `python3 --version` on macOS/Linux or `py -3 --version` on Windows. If several versions are installed, select a supported one before creating the environment.

On macOS or Linux:

```sh
python3 -m venv .venv
source .venv/bin/activate
```

In Windows PowerShell:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If activation is unavailable, use `.venv/bin/python` on macOS/Linux or `.venv\Scripts\python.exe` on Windows in place of `python` below. Activation changes which interpreter the terminal finds; the environment also works through its explicit interpreter path.

Install the graph, plotting and notebook tools:

```sh
python -m pip install networkx matplotlib jupyterlab
```

If a selected lab supplies `requirements.txt`, use `python -m pip install -r requirements.txt` for its declared dependencies. Record the versions that work in this environment with `python -m pip freeze > requirements-local.txt`.

## Run a checkable example

Save the following as `check_environment.py`:

```python
import sys
import networkx as nx
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

graph = nx.path_graph(3)
print(sys.executable)
print(nx.shortest_path(graph, 0, 2))
nx.draw_networkx(graph, pos={node: (node, 0) for node in graph})
plt.axis("off")
plt.savefig("graph-check.png", bbox_inches="tight")
plt.close()
```

Run `python check_environment.py`. The first line should point inside `.venv`; the second should be `[0, 1, 2]`. Open `graph-check.png`: nodes 0, 1 and 2 should form a connected path. The `Agg` plotting backend saves the image without opening a desktop window. The [NetworkX tutorial](https://networkx.org/documentation/stable/tutorial.html) explains the graph operations; the [Matplotlib guide](https://matplotlib.org/stable/users/explain/quick_start.html) explains figures and plotting.

## Keep the interpreter consistent

Select this same `.venv` interpreter in the editor. For notebook work, run `python -m jupyterlab` from the workspace folder, create a Python notebook, and check `import sys; print(sys.executable)` in its first cell. A different path means the notebook is using a different environment, which can explain imports working in the terminal but failing in the notebook. See [starting JupyterLab](https://jupyterlab.readthedocs.io/en/stable/getting_started/starting.html) for the notebook interface.

Keep an experiment log beside the lab: the command used, the input graph or state, the expected result and the observed result. For this check, record the interpreter path, `[0, 1, 2]` and the generated image.
