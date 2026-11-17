## Worked classification measures

Confusion-matrix rows are actual classes and columns are predictions. With declared labels A,B, actual A,A,B and predicted A,B,B produce `[[1, 1], [0, 1]]`. Accuracy is 2/3. Precision for B is its correct predictions divided by all predicted B values, 1/2. Recall for B is its correct predictions divided by all actual B values, 1.

With P for precision and R for recall, class F1 is `2*P*R/(P+R)`. Equivalently, use `2*TP/(2*TP+FP+FN)`, where TP, FP and FN count true positives, false positives and false negatives. Both classes have F1 2/3, so macro F1 is 2/3. Balanced accuracy averages recalls over classes represented in the evaluated truth: (1/2+1)/2=3/4.

The supplied metric tasks use zero for zero-denominator precision, recall and F1. Macro F1 includes every declared training class. Keep the label order with the matrix.

In the separate 24-row fixture with A=18,B=4,C=2, always predicting A gives 75 percent accuracy. Recalls 1,0,0 give balanced accuracy 1/3. A's F1 is `2*18/(24+18) = 6/7`; the others are zero, so macro F1 is 2/7. The accuracy conceals complete failure to find B or C.

