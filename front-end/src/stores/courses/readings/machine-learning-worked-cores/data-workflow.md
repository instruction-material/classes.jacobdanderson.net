# Inspect the data before fitting a model

A row is one unit of observation: for example, one fictional message. A feature is information available when a prediction will be made; the target is the value to predict. Keep the target outside the input features. A later outcome, or a value calculated using that outcome, can reveal the answer and create target leakage.

## Worked data card

Use this separate hand fixture:

| ID | Words | Spam |
| --- | --- | --- |
| 1 | 2 | 0 |
| 2 | 4 | 1 |
| 3 | missing | 0 |
| 4 | 100 | 1 |

The unit is one fictional message; word_count is a nonnegative count; spam is a binary target, with 1 meaning spam. There are four rows, one missing feature value and two observations in each target class. The identifier tracks rows and is excluded from the model inputs.

Suppose rows 1–3 are the training portion and row 4 is held out. The median of the observed training word counts [2,4] is 3, so a training-fitted median imputer fills row 3 with 3. Computing the median from all observed rows [2,4,100] would instead give 4 and let held-out information affect preparation. If the held-out count changes to 1, the training median stays 3; the all-row median changes to 2. Splitting before learned preparation keeps that dependency visible.

These four rows explain a mechanism. One held-out row cannot establish useful classifier performance. Record that sample limit rather than treating the balanced overall labels as proof of a representative population.

## Prepare a reproducible local run

The supplied offline data-card and evaluation-contract projects use Python's standard library and support Python 3.10 or later. Check the selected interpreter with `python3 --version`, then open the complete exported folder and use its README's run command. These first projects can record optional libraries as not installed.

Later scikit-learn projects use the supplied Python 3.14 environment and hash-locked requirements. Follow that project's own README and the IDE's local run instructions. A notebook host, account or accelerator is optional.

Record the actual interpreter, source revision, data file identity, row count, feature/target definitions, missing values and the chosen split. Restart and rerun from the first cell or script command. A reproducible result includes the input and preparation choices as well as the final number.

Complete the [local environment and data-card case](/course-assets/machine-learning/machine-learning-practice-pack.md#environment-and-data-card-case), then compare it with the [worked answer](/course-assets/machine-learning/machine-learning-verification-guide.md#environment-and-data-card-key). Before any supervised fitting, declare a training-only dummy baseline and reserve the final test portion. The next module supplies the comparison contract.
