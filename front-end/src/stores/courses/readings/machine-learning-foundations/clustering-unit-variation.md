# Change a unit and inspect the fitted geometry

Complete the movie project's `fit_model` function first. Save `unit_variation.py` beside that role's `main.py` and run the following separate four-point example. Multiplying the first feature by 1000 represents a positive unit conversion; the second feature keeps its units.

```python
import numpy as np
from sklearn.metrics import adjusted_rand_score
from main import fit_model

points = np.array([[0, 0], [2, 0], [10, 10], [12, 10]], dtype=float)
converted = points.copy()
converted[:, 0] *= 1000

first = fit_model(points, 2, 7)
second = fit_model(converted, 2, 7)
print(np.allclose(first.named_steps["scale"].transform(points),
                  second.named_steps["scale"].transform(converted)))
print(adjusted_rand_score(first.named_steps["cluster"].labels_,
                         second.named_steps["cluster"].labels_))
```

The expected lines are True and 1.0. Each pipeline fits its own scaler. Multiplying a column by 1000 also multiplies that column's fitted mean and standard deviation by 1000, so its standardized coordinates remain the same, up to floating-point rounding. The clearly separated groups here retain the same membership.

Record the raw and standardized centers and the two inertias. Convert first-coordinate raw centers back by dividing by 1000 before comparing them. Compare the grouping with adjusted Rand agreement so that permuted cluster numbers still count as agreement. Adjusted Rand agreement is 1 for matching partitions, is near 0 for chance-level agreement and can be negative.

Repeat the comparison on a separate copy of the supplied movie table, documenting the selected columns and units. Inspect the result rather than assuming exact label numbers. A nonlinear change such as taking a logarithm changes the geometry beyond a unit conversion and is a different modelling decision. Keep the original supplied CSV unchanged.
