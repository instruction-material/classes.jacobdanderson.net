# Decision trees: choosing a split and following a path

A classification tree stores a sequence of feature comparisons. An internal node routes a query to a child; a leaf returns a class learned from its training rows. Fitting chooses the comparisons. Prediction follows the already fitted comparisons without consulting the query's true label.

## Calculate an impurity reduction

For class proportions p, Gini impurity is 1 minus the sum of squared proportions. Four A and four B rows give 1-(1/2)^2-(1/2)^2=1/2. A pure group has impurity zero.

Consider the first supplied teaching case: x values 0 through 7, second feature y alternating 0,1, and labels A,A,A,A,B,B,B,B. The candidate x<=3.5 puts four A rows left and four B rows right. Its sample-count-weighted child impurity is (4/8)×0+(4/8)×0=0, so the impurity reduction is 1/2.

The alternative y<=0.5 puts two A and two B rows in each child. Its weighted impurity remains 1/2 and its reduction is zero. Splits are compared using training rows only. Including query labels while choosing a split would leak the answers into fitting.

Entropy is another criterion: -sum(p×log2(p)), with a zero-proportion contribution defined as zero. This balanced parent has entropy 1 bit and the pure x split has entropy zero. Gini and entropy measure different quantities; compare reductions within the chosen criterion.

## Distinguish a stump from a deeper tree

A stump makes at most one split. For a second, separate supplied case, keep the same two feature columns but use labels A,A,B,B,B,B,A,A.

The root again has impurity 1/2. At x<=1.5, the left child has two A rows and impurity zero. The right child has four B and two A rows, giving 1-(4/6)^2-(2/6)^2=4/9. Weighted child impurity is (2/8)×0+(6/8)×(4/9)=1/3; the reduction is 1/6.

The candidate x<=5.5 has the same reduction. The teaching implementation resolves equal gains by lower feature index, then lower threshold, so it selects 1.5. Its tolerance is 1e-12. This is the supplied algorithm's explicit convention; another library can resolve ties differently.

At depth 1 the right child is a B leaf. At depth 2, splitting that child at x<=5.5 creates pure B and A children. Root depth is zero.

For query x=6.5, first check 6.5<=1.5, which is false; follow right. Then check 6.5<=5.5, also false; follow right to the A leaf. The stump instead returns B. A query exactly equal to a threshold follows left under the declared <= convention.

For illustration, x queries 0.5,2.5,4.5,6.5 have labels A,B,B,A in this second case. The stump predicts A,B,B,B, giving 3/4 accuracy; the deeper tree predicts all four correctly. These four disclosed answers explain the trace. Once used to choose depth, they cannot also establish untouched final-test performance.

## Stop growth and evaluate the result

The supplied recursive algorithm stops at its maximum depth, a pure node, no distinct midpoint, or no positive impurity improvement above its tolerance. Leaf class-count ties choose the alphabetically first label.

A positive-gain-only greedy tree can stop on the four XOR examples: each single-feature split leaves both classes balanced, even though a two-level tree could represent XOR. A local stopping rule limits what fitting discovers.

For larger data, choose depth or leaf-size limits on training folds or validation data. Compare the selected tree with a training-fitted majority baseline, then evaluate once on a reserved test set. Report class supports and a meaningful error slice alongside accuracy. A readable path explains the fitted rule; it does not establish causation, fairness or reliable probability estimates.

[Decision-tree methods](https://scikit-learn.org/stable/modules/tree.html).
