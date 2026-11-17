# Categorical neighbors and one-hot distance

This optional studio audits the representation built in the primary car-classification project. The retained Car Evaluation table supplies six categorical inputs and a four-category acceptability target. Category names represent choices, rather than measured positions along a numeric scale.

An arbitrary encoding such as low=0, medium=1, high=2 and vhigh=3 makes the distance from low to vhigh three times the distance from low to medium. Those spacings are an added assumption. One-hot encoding gives each observed category its own indicator. Two different known values in one feature block have squared distance 2, regardless of their names.

For a two-feature hand example, let the fitted buying vocabulary be [low,high] and safety vocabulary be [low,high]. The row (low,low) becomes [1,0,1,0]; (high,high) becomes [0,1,0,1]. Their squared Euclidean distance is 1+1+1+1=4. These are illustrative observations, separate from the supplied six-feature dataset.

Fit the vocabulary only on training rows inside ColumnTransformer and Pipeline. Transform final-test rows and queries with that fitted state. With handle_unknown="ignore", an unseen buying value becomes zeros in the buying block. The other feature blocks still contribute to distance. This permits a prediction, but loses the identity of that unseen value.

Keep the six-feature column order and fitted vocabulary with the report. Compare a training-only most-frequent baseline using class-level measures as well as overall accuracy. These targets describe a classroom evaluation rule, rather than measured real-world safety.
