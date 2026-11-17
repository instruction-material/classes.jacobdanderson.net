# Read a completed comparison and diagnose one change

A useful model comparison explains why the chosen pipeline follows the declared evidence. It also identifies an input change that could break the conclusion.

## Work a metric example

For a separate two-class illustration, actual labels are A,A,B and predictions are A,B,B. With rows actual and columns predicted in class order A,B, the confusion matrix is [[1,1],[0,1]].

Accuracy is 2/3. Class A has precision 1, recall 1/2 and F1 2/3. Class B has precision 1/2, recall 1 and F1 2/3. Macro F1 is the unweighted mean of the two class F1 values, 2/3. Balanced accuracy is the mean recall, (1/2+1)/2=3/4.

The two scores differ because they combine errors differently. Record the class order and zero-denominator rule. The supplied implementation contributes zero for an undefined class precision or F1 and averages balanced accuracy over classes represented in the evaluated truth.

## Explain model choice

Use the training-fold choice from the preceding selection example: stump mean macro F1=0.79, best neighbor mean=0.80, and a fixed 0.02 simplicity margin. The stump is selected before final test labels are opened.

Suppose a later test report favors a neighbor instead. That observation describes this reserved sample; switching models now would use the test as another tuning set. Record the discrepancy as an error-analysis finding. A revised experiment needs a newly declared selection procedure and new independent evaluation evidence.

## Transfer one assumption

In the supplied car-choice variation, categorical vocabularies come from training folds. A category first seen in validation or a query activates the extra unknown-category bit reserved for that field; all of its known-category bits are zero. Other fields are encoded normally. It does not expand the fitted vocabulary from that query. Inspect how the changed representation alters distances before interpreting a predicted category.

In the numeric game-token case, multiply one feature's units by a positive constant and refit the training-only standardizer. The standardized geometry should remain the same up to floating-point rounding. Applying a newly fitted scaler to the query alone would define a different space and invalidate that comparison.

These are controlled variations: change one declared condition, state the expected effect, run the same frozen workflow and compare. Preserve an unexpected outcome as evidence until its cause is identified.
