## Worked regression errors

For actual 2,4 and predictions 1,5, prediction-minus-actual residuals are -1,1. MAE is the average absolute residual, 1. RMSE is the square root of the mean squared residual, also 1, in the target's units.

Let SSE be the sum of squared residuals and SST the sum of squared target deviations from the evaluated targets' mean. Then `R-squared = 1 - SSE/SST`. Here both sums are 2, giving 0. For actual 0,1 and predictions 2,2, residual squares sum to 5 and target squares around the mean sum to 0.5, giving -9. R-squared is dimensionless and can be negative; MAE and RMSE retain the error's units.

Compare these errors with the training-fitted dummy on the same evaluated rows. Inspect residuals over a named slice or input range before explaining the summary.
