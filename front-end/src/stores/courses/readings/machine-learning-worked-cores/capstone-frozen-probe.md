# Diagnose one input change with a frozen model

A robustness probe changes a query while preserving the fitted representation and chosen model. Keep the original prediction and comparison report beside the probe.

Use this constructed two-class example. The saved training mean for `sensor_a` is 2 and its scale is 2. The fitted stump predicts amber when the standardized value is at most 0.75, and blue otherwise. Its rule ignores `sensor_b`.

## Worked probe

For `sensor_a=3`, the stored transform gives `(3-2)/2=0.5`, so the model predicts amber. Copy that query and add 1 to its measured `sensor_a`. The transformed value becomes `(4-2)/2=1`, so the same model predicts blue.

In this controlled probe, the underlying true label stays amber. The original query is correct and the perturbed query is an error. Record both inputs, transformed values and predictions.

## Keep the comparison interpretable

The saved mean, scale, split, fold scores, candidate choice and stump threshold remain unchanged. Repeat both queries and recover the same two predictions. These are the experiment's state invariants; the prediction itself can change.

Explain why fitting a new mean or scale using the perturbed query would change the experiment. Describe the observed error as sensitivity to the declared measurement change. It supplies one numerical observation, with a limited range of inputs.

For the [completed capstone](#machine-learning-ml8-master-project-curriculum-ml8-project-1-master-project-workspace), retain its original fold-based model choice and final report while explaining a separately recorded error or probe. A proposed improvement starts a new experiment with its own selection and evaluation boundary.
