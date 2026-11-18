# Choose tree depth before final evaluation

Complete `choose_depth(scores)` in `exercise.py`. Its input is a
nonempty dictionary mapping integer depths 0 through 8 to finite validation
accuracies from 0 to 1. Return the shallowest depth within 0.02 of the best
accuracy, with an inclusive boundary and `1e-12` numerical tolerance.
Reject values outside this contract with `ValueError`.

For `{0:0.5,1:0.75,2:1.0}`, select 2. For
`{2:1.0,1:0.98}`, select 1. An exact accuracy tie also selects the
shallower candidate. Explain the declared simplicity preference before
running the experiment.

## Supplied experiment

Both roles contain `main.py`, `exercise.py`, `tree_rules.py`,
source notes and separate training, validation and test CSVs. Use Python
3.10 or later and its standard library:

```sh
python3 main.py --output tree-report.json
```

Keep those files and the `data` folder together. CSV paths are relative
to `main.py`; an absolute path to that script also works from another
folder. The untouched starter stops at `choose_depth`. Complete that
function, save the project and reopen it before exporting the full ZIP.

The supplied code fits depths 0,1,2 on the eight training rows, scores the
four validation rows, calls the selection function, then opens the four
test rows. It keeps training alone for fitting throughout this exercise.

## Worked result and interpretation

The [worked lab](#machine-learning-ml3-5-decision-trees-and-interpretable-models-curriculum-decision-tree-lab)
gives every input, fitted count and comparison. Expect validation accuracies
0.5,0.75,1.0 and selected depth 2. Final predictions A,A,B,A score 1.0;
the training-only majority baseline scores 0.75.

Inspect `tree-report.json` for candidate scores, chosen depth, the
complete fitted tree, final predictions, baseline and each test path.
Trace x=7.5 through comparisons with 1.5 and 5.5 to its A leaf. Explain the
mixed B leaf that would stop that query in the depth-1 tree.

In a separate saved copy, change only one final-test label. Candidate
scores, chosen depth, fitted counts and predictions must remain unchanged;
final accuracy may change. Explain why selecting depth from those labels
would turn the final test into another tuning opportunity.

Retain the report, one hand-traced prediction and the comparison with the
same-row baseline. The fixture is a reproducible teaching example. A perfect
score on these four authored rows supplies no population-performance claim.
