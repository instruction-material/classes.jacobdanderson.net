# Machine Learning Verification Guide

Open this guide only after recording an independent attempt. The entries describe defensible evidence, not one mandatory code listing.

## Environment and Data Card Key

The data-card reference loads 120 rows with five ordered columns and zero missing cells. Each soil occurs 40 times. Seed 42 reserves 24 IDs and retains 96 for training,with no overlap; a fresh process reproduces the same IDs. Compare the recorded byte hash with [the fixture manifest](/course-assets/machine-learning/manifest.json).

Record the actual Python and installed package versions. The supplied core runs with Python 3.10 or later and the standard library; a missing optional library is reported truthfully. Later library-based projects have their own environment requirements.

One fictional plot after six weeks is the observation,growth_cm is the target,and plot_id is an identifier. Record feature units,authored source,classroom purpose and the absence of real agricultural validity. The supplied CSV includes no third-party data or external license.

## Evaluation Contract Key

Seed 42 gives 132 training,54 validation and 54 test rows. The corresponding question/bug/request counts are 72/40/20,24/20/10 and 24/20/10. All 240 IDs and all template families are disjoint across partitions. The grouped allocation deliberately approximates 60/20/20; exact row stratification could leak repeated templates.

The contract names summary as input,label as target,template_family as the split group and ticket_id as trace metadata. Use a most-frequent dummy baseline,macro F1 primary and balanced accuracy secondary. Fit CountVectorizer only on training summaries within candidate pipelines and grouped training folds.

Freeze preprocessing,candidate choice and parameters before final test predictions. Prefer the simpler model unless validation macro F1 improves by at least 0.02. The contract records a plan; it does not fit a classifier.

## Clustering Stability Key

The manual loop needs all three protections:

- stop when maximum centroid movement falls below a tolerance;
- stop at a maximum iteration count;
- reseed an empty centroid from a documented point, such as the point farthest from its assigned centroid.

Scale visits and spend before Euclidean clustering. Record `random_state` and explicit `n_init`. A reasonable conclusion compares stability and multiple k values without claiming that one numeric cluster label reveals a true customer identity. Silhouette score is supporting evidence, not an automatic answer.

## Distance Classification Key

Integer category codes invent order and equal spacing. One-hot encoding avoids those unsupported distances, and `handle_unknown="ignore"` gives a predictable path for a new category.

The correct sequence is raw split, training-fitted encoder inside `ColumnTransformer`, then KNN in one `Pipeline`. Tune k on training evidence. The final report compares against a dummy baseline and includes balanced accuracy, macro F1, and a confusion matrix. Any weak class must remain visible.

## Probabilistic Classification Key

`GaussianNB` is the appropriate course default for continuous Iris measurements because it models a Gaussian distribution per feature and class. The historical `MultinomialNB` Iris source is worth auditing, but not copying as the current route.

For text, split raw messages first and keep `CountVectorizer` plus `MultinomialNB` in one pipeline. No runtime stopword download is necessary. Precision, recall, F1, and the confusion matrix expose different spam/ham costs. Only fictional or redacted examples should appear in evidence.

## Interpretable Tree Key

Depth selection belongs on training-only validation evidence. An unrestricted tree commonly raises training performance while validation performance stalls or falls. Prefer the shallowest model that achieves comparable validation evidence.

The explanation should translate one or two split rules into plain language, then state that the rule reflects the supplied sample and target. Inspectability does not prove fairness, causation, or correctness outside the observed distribution.

## Regression Baseline Key

The median dummy baseline establishes whether a learned model improves typical absolute error. MAE remains in target units and is therefore a clear primary measure; RMSE or `R^2` may be secondary.

Fit preprocessing only on training data. Compare candidates on the same split. Residual slices should show whether rainy hours or a target range behave differently. An out-of-range temperature prediction is extrapolation and should be labeled unsupported even if the method returns a number.

Country-year life expectancy is aggregate data. It cannot predict one person's lifespan, and correlation among aggregate variables does not establish an intervention's causal effect.

## Neural Network Audit Key

The weighted sum is `0*1 + 1*2 + 1 = 3`; sigmoid gives approximately `0.953`. A correct transparent simulation prints each hidden value before the output.

A trained network is acceptable only with fixed seeds, stated sample and architecture bounds, early stopping, and runtime evidence. It must be compared with dummy and simpler learned baselines. If performance is not materially better, the simpler model is the stronger conclusion. The historical diabetes dataset can support a dataset/model audit only, never a diagnosis.

## Neural Regression Key

The supplied fixture has 120 invented rows split into 72 training,24 validation and 24 test rows. Features are area_m2 and rooms; region supports error slices. value_k uses fictional thousands. Fit feature and target scaling only on training rows and restore target units before metrics.

The median baseline,least-squares linear regressor and three-hidden-unit tanh network use the same split. MSE gradients are averaged over batches; the numeric output is linear. Default seed 42,batch 16,learning rate 0.04 and 30 epochs remain within the documented CPU budget. Validation MAE selects the saved epoch; final test targets cannot change fitting,stopping or model selection.

train_network returns a dictionary with parameters (the saved numeric list), hidden_units, best_epoch, completed_epochs, stop_reason, history, cpu_seconds, seed, batch_size and l2. Each history entry has epoch, train_mae and validation_mae. Epoch 0 is the initial model. stop_reason is max_epochs, validation_patience or cpu_budget. If the budget stops before a completed epoch, return the initial saved checkpoint. Preserve input rows and the training-fitted scaler.

The default fixture and seed 42 complete 30 epochs and select the linear baseline. Reference held-out results, rounded to six decimals:

| Model                            |       MAE |      RMSE |
| -------------------------------- | --------: | --------: |
| Training median                  | 38.824833 | 48.648618 |
| Linear regression                |  5.676861 |  7.629158 |
| Three-hidden-unit neural network |  7.621252 |  9.462846 |

The corresponding validation MAEs are 44.048083, 6.169554 and 7.240817. The linear model earns the selection under the predeclared one-unit simplicity margin. Explain this result from the validation evidence before opening test targets.

Retain the epoch table,all predictions,region and training-median error slices,and three SVG plots. Cached California housing is an optional later comparison. The unchanged historical Boston Housing dataset is an optional ethics and migration audit; its ethically problematic B feature is excluded from the assigned benchmark.

## Model Comparison Capstone Key

A defensible capstone includes all of the following:

1. Low-stakes source and license, unit of observation, target, intended use, and non-goals.
2. Held-out test boundary, fixed random state, and training-only preprocessing.
3. Task-appropriate dummy baseline and two justified candidate pipelines.
4. One primary and one secondary metric chosen before model selection.
5. Error slices plus confusion, residual, or stability evidence.
6. Dataset identity, environment versions, resource budget, expected/observed run, and clean restart proof.
7. Model card naming uncertainty, distribution limits, likely failures, and human review.

The presentation should say what the model may support, what it cannot establish, and what new evidence would change the choice. A strong capstone may conclude that the baseline or simpler model is preferable.
