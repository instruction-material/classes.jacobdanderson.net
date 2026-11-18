# Fix the comparison before opening final test results

An evaluation contract states the prediction target, input features available at prediction time, training/validation/final-test split, preprocessing fit boundary, baseline, primary metric, secondary metric and model-selection rule. Training fits parameters. Validation compares declared candidates. Final testing evaluates the frozen choice. Splitting by a shared source or entity keeps related observations together when a random row split would leak information.

Fit imputers, scalers, encoders and vocabulary on training data. Apply their fitted state to validation and test rows. Compare candidates on the same validation observations, choose the model using the declared rule, then open the final test set once. Keep a simple training-only baseline on that same final test set.

## Worked regression errors

Use a separate hand example with final observed targets [3,5,7] and a previously fixed model's predictions [4,4,8]. Define signed error as prediction minus observation, giving [1,-1,1].

MAE is the average absolute error: (1+1+1)/3=1. RMSE is the square root of average squared error: sqrt((1+1+1)/3)=1. Both use the target's units; squaring makes RMSE more sensitive to a large error.

The observed target mean is 5 and its squared-deviation sum is 4+0+4=8. R-squared is 1 minus squared-error sum divided by that target-deviation sum, so this model gives 1-3/8=0.625. This definition needs a nonzero target-deviation sum.

Suppose a dummy regressor was fitted earlier on training targets [2,4,6]. Its prediction is the training mean 4 for every final row. On the same observed targets its signed errors are [1,-1,-3], MAE is 5/3, RMSE is sqrt(11/3), approximately 1.915, and R-squared is 1-11/8=-0.375. A negative R-squared is possible. The score's mathematical comparison uses the evaluated targets' mean, while the actual deployed dummy prediction comes from training.

These calculations describe the supplied three observations. They do not estimate a future population accurately on their own. Keep row or group counts and relevant error slices with the summary.

## Choose metrics for the task

For classification, an ordered confusion matrix counts true and predicted labels. Precision asks how many predicted positives are correct; recall asks how many actual positives were found. F1 combines those two, while balanced accuracy averages class recall. The complete worked classification measures and model-selection examples follow in this module.

Use MAE when typical error in original units is the main concern; use RMSE when large errors deserve greater weight. Declare the choice before comparing candidate results. Accuracy can hide minority-class failures, and R-squared alone does not show the size or location of errors.

Complete the [local evaluation-contract case](/course-assets/machine-learning/machine-learning-practice-pack.md#evaluation-contract-case) and compare it with the [worked answer](/course-assets/machine-learning/machine-learning-verification-guide.md#evaluation-contract-key). Keep its template_family groups together. Explain the selected split, a possible leakage path, the training-only baseline, selection rule, final-test opening condition and one result limitation.
