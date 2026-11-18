# Interpret the measured comparison

Report the evaluated population, baseline, model and metric together. Classification accuracy counts correct labels; macro F1 gives each declared class equal weight. An ordered confusion matrix shows which classes were confused. Regression MAE and RMSE describe errors in the target's units; R-squared compares squared error with variation around the evaluated targets' mean.

## Worked interpretation

The customer-neighbor reference correctly predicts 48 of its 50 generated test labels, giving 48/50=0.96 accuracy. Its training-only majority baseline predicts 21 correctly, giving 21/50=0.42. Macro F1 is approximately 0.9596 for the model and 0.1183 for the baseline.

Those labels come from a fitted training clustering rule. The scores measure agreement with that rule on the reserved observations. They do not establish meaningful real-world customer types or predict purchasing outcomes.

The ten-point line and polynomial examples instead report training behavior. Their scores describe the fitted observations. The country-year task uses a separate grouped evaluation, keeping countries disjoint and choosing its declared candidate before final testing.

For each result, name the observation unit, split or resampling rule, baseline and one specific limit. Inspect a retained error or relevant slice. Keep descriptive clustering, fitted-sample demonstrations and held-out prediction evidence distinct when explaining a conclusion.
