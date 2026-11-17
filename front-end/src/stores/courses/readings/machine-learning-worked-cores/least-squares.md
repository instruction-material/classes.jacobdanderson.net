# Fitting a regression line and reusing polynomial features

Regression predicts a numeric target from declared inputs. In a one-feature line, `prediction = slope*x + intercept`. Ordinary least squares chooses parameters that minimize the sum of squared residuals on training rows. Here residual means prediction minus observation.

## Fit a complete small case

Use the authored training pairs (0,3), (1,5), (2,7). Their input mean is 1 and target mean is 5. With nonconstant inputs, the fitted slope is:

`sum((x-mean_x)*(y-mean_y)) / sum((x-mean_x)^2)`.

The numerator is `(-1)*(-2) + 0*0 + 1*2 = 4`; the denominator is `1+0+1 = 2`. The slope is 2. The intercept is `mean_y-slope*mean_x = 5-2*1 = 3`. The fitted line reproduces all three training targets and predicts 9 at x=3.

A training fit of zero error is a property of these three rows. A new observation at x=3 could have a different target. Evaluate it using the parameters already fitted, rather than refitting on the new target first. A constant input column makes this slope formula's denominator zero; that case needs an explicit convention or a more general solver.

## Read error in its units

For actual targets (10,20) and predictions (12,17), residuals are (2,-3). MAE is `(2+3)/2 = 2.5` in target units. MSE is `(4+9)/2 = 6.5` in squared target units. RMSE is `sqrt(6.5)`, approximately 2.549510 in target units. A training-mean or training-median baseline is fitted from training targets only.

R-squared compares squared errors with variation around the evaluated targets' mean: `1-SSE/SST`. It can be negative. It differs from Pearson correlation: actual values (1,2,3) and predictions (10,20,30) have Pearson correlation 1, but SSE=1134 and SST=2 give R-squared=-566. The predictions track ordering while badly missing the numeric scale. For constant true targets SST is zero, so report the chosen undefined-value convention explicitly.

## Make a nonlinear feature map

A polynomial model can be linear in its coefficients while using nonlinear features. A degree-two one-input basis is `[1,x,x*x]`. Given coefficients [1,3,2], the prediction is `1+3*x+2*x*x`. At x=3, the feature vector is [1,3,9] and the prediction is 28.

Keep feature definitions and coefficient order fixed. A reusable fitted transformer must transform queries using the same feature map as the training rows. Replacing it with a different degree or refitting a learned scaler on one query changes the input representation.

Select polynomial degree and other model choices from training/validation evidence. Compare the numeric baseline, simpler line and more flexible candidate before opening final test targets. A curved training fit alone does not establish better generalization or a causal explanation.

[Linear models and least squares](https://scikit-learn.org/stable/modules/linear_model.html).
