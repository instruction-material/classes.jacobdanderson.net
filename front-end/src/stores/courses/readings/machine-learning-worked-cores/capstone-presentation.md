# Present the model decision and its supporting evidence

Lead with the prediction task and the selected model. Identify the row unit, the two or more inputs actually used, the target and the population represented by the data. State the main limitation beside the result.

Show the fixed train/validation/test sizes and the group boundary that keeps related observations together. Name the checksum or version of the input files and the environment used to reproduce the run.

Present one compact comparison table using the same columns for every candidate: mean training-fold primary score, final held-out primary score and one secondary score. Mark which evidence selected the model. Include the dummy baseline and the simpler preference rule.

Use one concrete error or prediction trace to explain the behavior. A nearest-neighbor trace names the transformed query, selected training rows and vote rule; a stump trace names the feature, threshold and chosen leaf. Tie the explanation to a retained prediction ID rather than an invented representative example.

Show class supports and the actual-row/predicted-column confusion matrix for classification, or original-unit MAE/RMSE and a residual slice for regression. State when a slice is too small to support a stable comparison.

Finish with the files and command needed to reproduce the result, the strongest remaining limitation and one next experiment justified by that limitation. Label training, validation and final test observations consistently. A proposed improvement remains a proposal until separately evaluated.
