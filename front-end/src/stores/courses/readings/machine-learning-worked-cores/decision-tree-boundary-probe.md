# Probe one fixed tree boundary

Use the completed [tree-selection project](#machine-learning-ml3-5-decision-trees-and-interpretable-models-curriculum-core-project-5-decision-trees-and-interpretable-models). Keep its validation
scores, selected depth and fitted tree. Predict before running: at
`[5.5,0]` the depth-2 tree takes the root's right branch, then the
`x<=5.5` branch to B. At `[5.51,0]` it takes right then right
to A.

From that project folder, inspect both paths in Python:

```python
from main import experiment
from tree_rules import trace

report = experiment()
model = report["selected_tree"]
for query in ([5.5, 0], [5.51, 0]):
    print(trace(model, query))
```

The first leaf has four training B observations; the second has two A
observations. Record the exact comparisons and explain the equality rule.
Changing only y from 0 to 99 leaves the original path unchanged because
this fitted tree never uses the second feature.

## Keep the experiment fixed

Compare two queries against the same `model` object. Preserve its
thresholds, training class counts, selected depth and original comparison
report. If the query's declared true label stays B, the first prediction
is correct and the perturbed prediction is an error.

Explain this as sensitivity at one learned threshold. Fitted leaf counts
describe the training observations; they establish neither calibrated
real-world confidence nor a causal explanation. Retain both traces and
state the probe's input range before proposing a separate new experiment.
