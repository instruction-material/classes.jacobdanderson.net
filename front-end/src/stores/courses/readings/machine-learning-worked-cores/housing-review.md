# Review the housing comparison

Run the completed housing workspace with `python3 main.py --output results`. Keep `report.json`, `epochs.csv`, `residuals.csv` and the three SVG plots with the source.

Check the 120-row input identity, 72/24/24 split and training-only feature/target scalers. `house_id` and `split` trace records; `region` supports error slices. Only `area_m2` and `rooms` enter this model.

## Explain the selected candidate

The fixed rule chooses the simplest of median, linear and neural within 1.0 target unit of the best validation MAE. The default reference gives validation MAEs about 44.048083, 6.169554 and 7.240817 respectively. The linear model is chosen from that validation evidence.

After the choice is frozen, the corresponding test MAEs are about 38.824833, 5.676861 and 7.621252. These results describe the three fixed candidates; they leave the recorded choice unchanged. The values use thousands of fictional units.

## Trace the saved network

Inspect `best_epoch`, `completed_epochs`, `stop_reason` and the epoch history. Confirm that the returned parameters are a copy of the best validation checkpoint. A CPU stop before a completed epoch can return the initial checkpoint; record that actual outcome.

Use `training.svg` to compare the training and validation curves. Inspect the prediction plot's equality line and a signed residual in `residuals.svg`. Locate the same record in the CSV, then compare its region with the other error slices.

Explain one observed error and the model choice. Distinguish a source or arithmetic fault from a limitation of this small authored dataset. A reproducible comparison can support choosing the simpler model.
