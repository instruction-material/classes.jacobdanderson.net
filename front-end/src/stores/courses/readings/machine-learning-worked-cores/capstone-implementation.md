# Implement the frozen comparison

The supplied token capstone has 108 authored observations: 72 training, 18 validation and 18 test. Each row has two sensor features and an amber, blue or green target. Related variants share a source batch; every batch stays in one partition.

Complete `choose_candidate` in `model.py`. Keep IDs, batches, split markers and targets outside the learned features. The program provides a dummy baseline, Gini stump and uniform KNN with k=3 and k=1.

## Worked selection using grouped training folds

Use the same four group-disjoint training folds for every candidate. Fit means, scales and any vocabularies within each fold's training portion. Calculate each candidate's mean fold macro F1.

The declared preference order is dummy, stump, 3-neighbor, 1-neighbor. Choose the first candidate within 0.02 of the best mean fold score. For scores dummy=0.50, stump=0.79 and 3-neighbor=0.80, choose stump: its deficit is 0.01.

Record the fold scores, selection rule and chosen candidate before examining validation diagnostics. In this workspace, validation is a separate diagnostic check. It supplies no second selection stage.

## Fit once, then report

Fit the fixed candidates on all training rows, using training-fitted preprocessing. Freeze the chosen identity and fitted state before final test prediction. The program reports all candidates for comparison, with the previously selected model clearly identified.

Run `python3 main.py --output results/report.json`. Retain the JSON, prediction CSV and model card. Inspect accuracy, macro F1, balanced accuracy, class support and the actual-row/predicted-column confusion matrix. Preserve zero-error cases accurately.

Restart from the same files and reproduce the split, folds, choice and predictions. Explain a specific error or robustness result and the authored sensor fixture's limitation. A new experiment gets its own recorded question and evaluation boundary.
