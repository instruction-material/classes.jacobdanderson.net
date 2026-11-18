# Review the local image comparison

The supplied workspace contains 32 authored 12x12 RGB PNG patterns in four classes. Inspect `metadata.csv`: source groups stay together in the 16/8/8 training, validation and test split. Verify the named image hashes before decoding.

Trace one forward pass and check one shared-kernel coefficient with central differences. With epsilon 0.000001, divide the difference between the two perturbed losses by twice epsilon. Restore the original parameter before checking another coefficient or bias. Compare the result with the analytic gradient.

## Separate fitting and evaluation

The mean-color prototype fits training images only. Flip and brightness augmentation apply to training batches. Validation and test bytes retain their recorded identities.

Compare the majority and color-prototype baselines with the dense model and CNN. The fixed seeds are 7 and 19. Validation cross-entropy retains each seed's earliest best checkpoint; mean validation macro F1 and the declared 0.02 simplicity preference choose the architecture. A neural seed is selected using validation loss. Freeze these choices before final testing.

## Inspect the actual result

Run the completed workspace with `python3 main.py --output results/report.json`. Keep the JSON, prediction CSV, contact sheet and model card.

Record updates, completed epochs, checkpoint and stopping reason. Default training is bounded by six epochs, batch four and a shared eight-second CPU budget; a budget stop can retain the initial checkpoint. Describe the observed outcome.

Check the 4x4 confusion matrix, class supports, recalls and F1 scores. Inspect an actual error filename when present and state when a class has no observed errors. The generated patterns share drawing rules across partitions, so this comparison supports a numerical workflow demonstration. Testing real weather photographs would require separate source and evaluation evidence.
