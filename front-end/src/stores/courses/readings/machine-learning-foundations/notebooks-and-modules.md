# Notebook cells and reusable modules

A notebook kernel retains variables and imported modules between cell runs. An old variable can make a later cell succeed even when the current notebook omits its setup. A clean restart followed by execution from the first cell checks the recorded order.

Save a reusable calculation in `audit.py`:

```python
def mean(values):
    if not values:
        raise ValueError("mean needs at least one value")
    return sum(values) / len(values)

if __name__ == "__main__":
    print(mean([2, 4, 6]))
```

Running `python audit.py` prints 4.0. A second file, `experiment.py`, uses the same function:

```python
from audit import mean

print(mean([2, 4]))
```

Running `python experiment.py` prints 3.0. Importing audit defines mean; the main guard keeps the demonstration print inside direct execution of `audit.py`. The function receives its numbers explicitly. An empty list raises the stated error.

In a notebook opened from this folder, `from audit import mean` makes the function available. After editing a module, restart the kernel before the final run so that the result uses the saved definitions. Keep exploration and plots in cells; place reused loading, transformation and calculation functions in modules with explicit inputs and returned results.
