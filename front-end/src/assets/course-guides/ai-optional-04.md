# Evaluate a toy classifier by failure slice

The eight fictional rows are (group,expected,predicted). Group A has one correct result in four; group B has three in four. Overall accuracy is four/eight=0.5, while the slices are 0.25 and 0.75. Two of four positive examples are found, so positive recall is 0.5. These synthetic slices reveal where this toy program fails; they support no conclusion about real people. Also check an imbalanced case with nine negative labels and one positive: always predicting zero gives 0.9 accuracy but zero positive recall.

## Build and verify

Implement the named functions and solve_extension in main.py. Run python3 main.py from the chosen role folder. The JSON output represents tuple states as arrays. Use the worked case and the stated boundary checks before changing an input. The source uses only the Python standard library.

## Expected result

{"groups": {"A": 0.25, "B": 0.75}, "overall": 0.5, "positive_recall": 0.5}

## Function contract

metrics(rows) accepts (group,expected,predicted) tuples with binary labels and returns overall, groups and positive_recall. Empty rows give overall None; no positive examples give positive_recall None. The starter supplies all eight ROWS explicitly.
