# Neural regression: a forward pass, a gradient and a saved model

A regression network predicts a number in the target's units. In the supplied housing comparison, two training-standardized features enter three tanh hidden units and a linear output. A linear output can return values across the numeric range; a sigmoid output would constrain this particular model to a different range.

## Calculate one prediction

For a smaller authored example, take two already standardized inputs (1,2). One hidden unit has weights (0.5,-0.25) and bias 0.1. Its preactivation is 0.5×1-0.25×2+0.1=0.1; its hidden value is tanh(0.1), approximately 0.099667995.

An output weight of 2 and output bias -0.1 give prediction p=2×0.099667995-0.1, approximately 0.099335989. With standardized target t=0.5, squared loss is (p-t)^2, approximately 0.160531650.

If the training target mean is 100 and its training population standard deviation is 20, restore target units with 100+20×p. This predicts about 101.986720 fictional units; the standardized target 0.5 corresponds to 110. Calculate reported errors after this inverse transform. Keep the same training-fitted mean and scale for every validation row and query.

## Follow the derivative backward

For this one-row loss, the derivative with respect to the prediction is delta=2×(p-t), approximately -0.801328022.

The output-weight derivative is delta×hidden, about -0.079866757, and the output-bias derivative is delta. The hidden preactivation derivative is delta×output_weight×(1-hidden×hidden), about -1.586735724. Multiply by input 1 for the first hidden weight and by input 2 for the second; use the same preactivation derivative for the hidden bias.

Compute these derivatives from the same old parameters before applying an update. For example, gradient descent with learning rate 0.01 moves the output weight upward because its derivative is negative. A minibatch averages the row derivatives before updating.

For the assignment's optional L2 term, add lambda×sum(weight^2) to the mean squared loss, then add 2×lambda×weight to each weight derivative. Biases are excluded under that implementation's convention.

A central difference checks an analytic derivative: perturb one parameter by epsilon=1e-6 in both directions and divide the loss difference by 2×epsilon. Restore the old parameter before checking the next one. This checks local arithmetic; it does not prove a useful model fit.

## Save from validation evidence

The complete assignment supplies data checks, scalers, forward and gradient helpers, two baselines and plots. The learner training loop initializes from its declared seed, records epoch zero, shuffles training rows, applies bounded minibatch updates and records training/validation MAE after completed epochs.

Save a copy of parameters whenever validation MAE improves by more than 0.000001. Return that checkpoint, rather than the last visited parameters. The declared patience is six completed epochs without improvement; row, epoch, batch and CPU caps also bound the work. Report the actual stopping reason. An initial checkpoint returned after a CPU stop has not completed training.

For the supplied reference case, validation MAEs are approximately 44.048083 for the training-median baseline, 6.169554 for linear regression and 7.240817 for the small network. The fixed rule prefers the simplest model within 1.0 fictional unit of the best validation MAE. The linear model therefore wins before final test targets are opened.

The network is a flexible candidate, not a guaranteed improvement. Inspect residuals by the supplied region and value slices, compare original-unit MAE/RMSE, and record the training seed and completed budget. The authored housing values support a reproducible numerical comparison.

[Supervised neural-network models](https://scikit-learn.org/stable/modules/neural_networks_supervised.html).
