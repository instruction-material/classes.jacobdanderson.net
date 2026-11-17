# Choose a model before opening the final test

Give each candidate the same prediction inputs, split groups and metric. Fit learned preprocessing only on the training portion of each fold. Related observations stay together so that a repeated template or source batch does not cross a fold boundary.

For this separate worked example, the primary metric is macro F1. Preference is dummy, decision stump, then KNN. The first candidate within an absolute 0.02 of the best training-CV score wins.

| Candidate | Mean training-CV macro F1 |
| --- | ---: |
| Most-frequent dummy | 0.50 |
| Decision stump | 0.79 |
| KNN | 0.80 |

The best score is 0.80, making the admissible threshold 0.78. The dummy falls below it. The stump is the first preferred candidate at or above it, so the rule selects the stump.

```python
preference = ["dummy", "stump", "knn"]
scores = {"dummy": 0.50, "stump": 0.79, "knn": 0.80}
threshold = max(scores.values()) - 0.02
chosen = next(name for name in preference
              if scores[name] >= threshold)
print(chosen)
```

This prints stump. These numbers illustrate the rule; they are not measured performance for the supplied data. An absolute macro-F1 difference and a relative percentage change in MAE are different rules. Follow the rule and metric declared by each project.

Record all fold scores and the selected identity, then fit the selected candidate on the declared training rows. Use validation as the independent check specified by that plan. Freeze candidate identity, parameters and learned preprocessing before final test prediction. Changing final test labels can change the final score while leaving those earlier decisions unchanged.

The baseline supplies a simple comparison. Class-level errors and the prediction setting explain whether a small score improvement matters. A candidate with similar performance and fewer assumptions or lower computation can satisfy the declared simplicity rule.
