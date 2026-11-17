# Plan a model comparison before viewing final answers

The supplied capstone compares classifiers for fictional game-token observations. A row contains two sensor features, an observed class, a source batch, a fixed partition and a trace ID. The prediction target is amber, blue or green. Only the two declared measurements enter the model.

## Define the observation and split

Each of twelve source batches per class has three related variants. Keep a whole batch together: eight batches per class train, two validate and two test. This gives 72/18/18 rows and 24/6/6 rows per class in the respective partitions. Related variants crossing partitions would make a withheld row less independent than its row ID suggests.

A problem card states the row unit, available-at-prediction-time inputs, target, source checksum, intended use and main limitation. For this dataset, batch and trace IDs identify records; the partition marker assigns a workflow role. Those fields must not become predictive features. A target-derived column would reveal the answer.

The split is part of the experiment. Make it before fitting a vocabulary, mean, scale or model. In each training fold, fit learned transformations on that fold's training rows and apply the same fitted state to its validation rows.

## Declare the comparison

The complete workspace supplies a most-frequent dummy, a one-split Gini rule and uniform nearest neighbors with k=3 and k=1. Every candidate uses the same four group-disjoint training folds. The primary selection score is the mean of the four macro F1 values.

For a separate authored selection example, suppose those means are dummy=0.50, stump=0.79, 3-neighbor=0.80 and 1-neighbor=0.80. The best mean is 0.80. The declared rule takes the first model in preference order dummy,stump,3-neighbor,1-neighbor within 0.02 of that best score. The stump qualifies because 0.80-0.79=0.01; the dummy does not. Select the stump.

This example illustrates the rule and is not an asserted output of the supplied fixture. Preserve the actual per-fold scores produced by the program. The simpler preference is a predeclared modeling decision rather than a conclusion about every future dataset.

Fit candidates on all training rows after recording selection evidence. Validation scores provide a separate diagnostic under this workspace's contract. They do not reopen the chosen identity or the tuning rule.

## Freeze and evaluate

Freeze the selected model, fitted transforms, class order and training records before opening final test labels. Changing test labels must leave each of those objects unchanged. A change in test metrics is expected; a change in fitted state would expose leakage.

Report accuracy, macro F1, balanced accuracy, class supports and a confusion matrix with actual labels in rows and predictions in columns. Inspect errors by the supplied slices. Explain why a good score on balanced authored observations does not establish usefulness for a real sensor deployment.

Keep the code, input checksums, split/group assignments, model-choice record, prediction table and model card together. Restart from those files and regenerate the report. A reader should be able to distinguish the problem declaration, the decision based on training evidence, and the later observations from held-out data.
