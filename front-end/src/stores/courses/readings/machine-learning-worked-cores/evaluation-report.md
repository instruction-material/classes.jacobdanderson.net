# Report a held-out comparison

Write a compact evaluation report for a completed project. Use the worked customer-neighbor report to distinguish the task, model decision, measured result and interpretation.

## Completed reference report

**Question and source:** How well does a fixed three-neighbor classifier imitate a five-cluster rule fitted from the 150 training observations? The [200-row input](https://github.com/instruction-material/AI-Level-2/blob/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/customer-neighbors/starter/customers.csv) supplies income and spending. The complete [project source](https://github.com/instruction-material/AI-Level-2/tree/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/customer-neighbors/starter) records seed 42 and the 150/50 split.

**Fit boundary:** The label rule, feature scaling and classifier use the training portion. The neighbor count is fixed before final testing. Class IDs 0,1,2,3,4 name the generated groups. The table compares accuracy (Acc.) and macro F1.

| Method | Acc. | Macro F1 |
| --- | --- | --- |
| KNN | 0.9600 | 0.9596 |
| Majority | 0.4200 | 0.1183 |

The complete confusion matrix has actual labels in rows and predicted labels in columns. The model makes two errors among 50 test rows. In the report's zero-based observation IDs, row 45 has true label 4 and prediction 0; row 132 has true label 0 and prediction 1. Use those IDs to inspect the retained predictions.

**Conclusion and limit:** The classifier agrees closely with this fitted labeling rule on this reserved sample. The input provides no measured customer-type target. A useful next experiment checks whether a changed representation or split alters the agreement, while retaining the original result.

For the selected completed project, report its own counts, baseline, metrics, error IDs and limitation. Retain the source revision, input identity, command and output report. Check the result against the [review criteria](#machine-learning-project-practice-guide).
