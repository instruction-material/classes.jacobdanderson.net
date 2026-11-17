# Compare class-level evidence

Suppose a separate hand fixture has truth [A,A,A,B] and predicts A for every row. Its confusion matrix, with true rows and predicted columns ordered A,B, is [[3,0],[1,0]]. Accuracy is 3/4. Recall is 1 for A and 0 for B, so balanced accuracy is (1+0)/2=1/2.

For A, precision is 3/4 and recall is 1, giving F1=2×(3/4)×1÷(3/4+1)=6/7. For B, no prediction is positive; with the declared zero-division convention its F1 is 0. Macro F1 is therefore (6/7+0)/2=3/7. A high majority-class accuracy can coexist with no minority-class recall.

For the actual car report, use its recorded four-class label order, model metrics and training-only baseline metrics. Identify which classes improve and which remain difficult. Interpret the unknown-category probe using the fitted vocabulary, and explain why identical encodings need not imply equivalent real categories.

Retain the source, exact dataset revision, fixed split, fitted categories, confusion matrix, both class-level summaries and one limitation. The primary project builds the pipeline; this optional studio supplies evidence about its representation and error behavior. A completed reference demonstrates the mechanism while the independent interpretation remains the assigned work.
