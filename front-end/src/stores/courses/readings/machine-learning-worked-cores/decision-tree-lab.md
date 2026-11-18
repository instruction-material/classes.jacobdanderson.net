# Compare shallow trees on fixed observations

The supplied fictional measurements have two features, `x` and `y`,
and class A or B. Training x values are 0 through 7; y alternates 0 and 1.
Labels are A,A,B,B,B,B,A,A. Validation x values 0.5,2.5,4.5,6.5 have labels
A,B,B,A; their y values are 0,1,0,1.

## Worked tree comparison

The root contains four A and four B observations, giving Gini impurity
`1-(4/8)^2-(4/8)^2=1/2`. Splits `x<=1.5` and `x<=5.5` tie
at weighted child impurity 1/3. The supplied rule selects the lower threshold.

At depth 1, the left leaf has two A observations. The right leaf has four B
and two A observations, so it predicts B. At depth 2, the right child splits
at `x<=5.5`, creating a four-B left leaf and two-A right leaf.
The alternating y feature supplies no better split.

Validation predictions and accuracy:

| Depth | Labels | Acc. |
| --- | --- | --- |
| 0 | A,A,A,A | 0.50 |
| 1 | A,B,B,B | 0.75 |
| 2 | A,B,B,A | 1.00 |

Draw the three fitted trees. Trace validation x=6.5 through the depth-2
tree's right and right branches to the A leaf. At depth 1, that query stops
at the mixed B leaf.

## Freeze the comparison

The declared selection rule chooses the shallowest candidate within 0.02
of the best validation accuracy. Here it selects depth 2. Training class
counts tie, so the majority baseline chooses A alphabetically.

Only after freezing the model, open test x values -0.5,1.5,5.5,7.5 with
y values 1,0,1,0 and labels A,A,B,A. The selected tree predicts A,A,B,A,
accuracy 1.0. The training-only baseline predicts A,A,A,A, accuracy 0.75.
Values exactly at a threshold follow the left branch.

The [core project](#machine-learning-ml3-5-decision-trees-and-interpretable-models-curriculum-core-project-5-decision-trees-and-interpretable-models) supplies the complete tree rules and all three
CSV splits. Implement its validation-based selection function and reproduce
the comparison. The separate optional projects develop Gini/split selection
and recursive tree construction. These small fixed observations demonstrate
the mechanism; they support no claim about a wider population.
