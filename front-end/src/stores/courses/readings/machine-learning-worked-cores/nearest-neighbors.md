# Nearest neighbors: distances, votes and feature units

K-nearest-neighbor classification stores labelled training examples. To classify a new query, compute its distance to each stored example, select the nearest k and combine their labels. A label is the supplied training category; a cluster index used as a teaching target instead measures agreement with that grouping rule.

## Work one query

Use the query (1,0) and the following small authored training set. Euclidean distance is the square root of `(x1-q1)^2 + (x2-q2)^2`.

| Row | Features | Label | Squared distance |
| --- | --- | --- | --- |
| 0 | (0,0) | A | 1 |
| 1 | (2,0) | A | 1 |
| 2 | (0,2) | B | 5 |
| 3 | (2,2) | B | 5 |

For this hand calculation, break equal-distance neighbor ties by original row order. With k=3, selected rows are 0,1,2 and labels are A,A,B. The vote is A:2, B:1, so predict A. Compare squared distances directly when only their ordering is needed; taking square roots preserves that ordering.

A class-vote tie is separate from a distance tie. This hand calculation chooses the label of the first selected neighbor when vote totals tie. The retained manual customer script uses that rule; its library comparison uses sorted class order. The rules can disagree on tied votes. Keep both policies explicit, including the rule for a tie at the k-neighbor cutoff.

## Uniform and distance-weighted votes

Suppose the selected neighbors are A at distance 1 and two B examples each at distance 2. Uniform voting chooses B by two votes to one. With weights `1/d`, A receives 1 and B receives `1/2+1/2=1`. The first selected neighbor is A, so the stated class-tie rule chooses A. Using `1/d^2` would define a different rule.

For distance weighting with an exact zero-distance match, use only the zero-distance neighbors with equal votes. This avoids division by zero. Conflicting labels among identical training features still need the stated tie rule.

## Check feature units

Consider just two other training examples: A at (0,10), B at (1,0), and query (0,0). Raw distances are 10 and 1, so k=1 selects B. Expressing the first coordinate in units multiplied by 1000 changes B's raw distance to 1000 and switches the answer to A. A change of measurement units has changed the raw metric's relative weighting.

Fit population means and standard deviations on training rows only, then transform both training rows and queries with those fitted values. For this two-row example, the means are (0.5,5) and scales are (0.5,5). The transformed training points are (-1,1) and (1,-1); the query is (-1,-1). Both distances are 2, resolved by the declared neighbor tie rule. Multiplying the first coordinate by a positive unit factor and refitting on the same training rows preserves these standardized coordinates. A constant training column uses scale 1.

Choose k, feature representation and voting rule using training-fold or validation evidence. Keep final test labels outside those decisions. Compare a majority-class baseline and class-level metrics; storing training rows does not itself demonstrate useful performance on new examples.

[Nearest-neighbor methods](https://scikit-learn.org/stable/modules/neighbors.html).
