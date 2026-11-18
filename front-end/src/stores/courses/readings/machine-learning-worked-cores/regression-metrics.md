# Read errors in the target's units

A residual here is prediction minus observation. Positive values mean overprediction. MAE averages absolute residuals; MSE averages their squares; RMSE is the square root of MSE. Squaring gives large errors greater influence.

## Worked residual table

For targets [10,20] and predictions [12,17], the residuals are +2 and -3. Their absolute values sum to 5, so MAE is 2.5. Their squares sum to 13, so MSE is 6.5 and RMSE is about 2.54951.

In the housing fixture, `value_k` uses thousands of fictional units. MAE and RMSE therefore use those same thousands; MSE uses squared thousands. Restore standardized predictions to target units before calculating these reported metrics.

The evaluated target mean is 15. Its squared deviations total 50; the model's squared errors total 13. R-squared is 1-13/50=0.74. R-squared can be negative when squared error exceeds that mean-reference total. A constant evaluated target makes that denominator zero, so an implementation needs an explicit undefined-value convention.

## Keep selection separate from final evaluation

Fit on training rows. Use validation evidence for the saved epoch and candidate choice. Evaluate the frozen choice on final test rows; a disappointing test score can motivate a separately planned experiment while the original final result remains recorded.

The supplied housing project uses 72/24/24 training, validation and test rows. Compare the median, line and network on identical evaluated rows. Its residual report also separates regions and target ranges. A single average can hide a systematic error in one such group.

Before accepting a report, trace one prediction, confirm its row ID and units, and independently calculate one metric. [The housing comparison](#machine-learning-ml6-regression-with-neural-networks) supplies the data and complete execution scaffold.
