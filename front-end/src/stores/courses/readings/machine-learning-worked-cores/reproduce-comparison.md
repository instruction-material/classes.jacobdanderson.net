# Reproduce one complete comparison

Keep the source folder, input identity and execution command with the result. The library projects provide `main.py`, `exercise.py`, `README.md`, `SOURCES.md`, `requirements.txt` and the local CSV where required. Complete the named task while preserving the supplied split and evaluation driver.

Use the recorded environment described in [local Python setup](#machine-learning-machine-learning-toolchain-and-version-assumptions). The standard-library projects use the command in their own README.

## Worked repeat

For customer neighbors, the input has 200 rows and the fixed seed-42 split reserves 150 training and 50 test rows. Scaling, the five-cluster label rule and the three-neighbor classifier fit using the training portion. Both test labels and predictions are then computed with that fitted state.

Retain `classification-report.json` and the two plots. The report records train/test row IDs, class order, fitted statistics, predictions, baseline and metrics. Check those identities before comparing two runs: a score from another split answers a different experiment.

Repeat from the saved source and original input. Fixed seeds make this comparison reproducible within the recorded toolchain; numerical libraries and hardware can still cause small floating-point differences. Use the stated tolerances and explain a difference before interpreting it as a modeling change.

A reproducible report connects the declared question to the actual input, fitted state and evaluated observations. Keep that chain with the result so it can be inspected independently.
