# Gaussian classification of flower measurements

Each Iris observation has four measurements in the fixed order [sepal_length, sepal_width, petal_length, petal_width]. Its target is setosa, versicolor or virginica. A Gaussian Naive Bayes classifier estimates each species' prior probability from its training frequency. For each species and each measurement, it also learns a training mean and population variance.

For a measurement x, the Gaussian density is `exp(-(x-mean)^2/(2*variance))/sqrt(2*pi*variance)`. A density describes concentration near x; it is not the probability of observing that exact continuous value. For each candidate species, combine its prior with the four measurement densities. The naive assumption treats measurements as conditionally independent given that species. Implementations add log densities to the log prior, avoiding underflow from multiplying small numbers, then normalize across classes when reporting probabilities.

## Worked one-measurement comparison

Use a separate hand fixture with class A observations [0,2] and class B observations [4,6]. Both priors are 1/2. Their means are 1 and 5, and each population variance is 1. Ignore the small numerical variance offset for this hand calculation.

For query x=2, squared deviations are 1 for A and 9 for B. The common prior and Gaussian normalization cancel in the score ratio. A's score is exp(4) times B's, so its normalized probability is 1/(1+exp(-4)), approximately 0.9820. The predicted class is A. At x=3, the distances and priors tie, giving 1/2 for each class. For x=4, repeat the calculation: B has probability approximately 0.9820.

Copying the same measurement into a second column adds no new observation. The independence model nevertheless counts its density twice, changing the first query's probability to 1/(1+exp(-8)), approximately 0.9997. This illustrates why strong model scores do not establish independent evidence or calibrated real-world confidence.

## Apply the fitted model

The supplied Iris workflow retains 150 observations and a fixed stratified split of 112 training and 38 test rows. Fit GaussianNB on the training measurements only. The implementation includes a small variance offset for numerical stability. Inspect the fitted class priors, means and variances, then compare held-out accuracy, macro F1 and the ordered confusion matrix with the training-only most-frequent baseline.

More data or additional features can change performance in either direction. The held-out comparison supplies the evidence for this split. Explain one flower confusion and one limitation of the sample or the conditional-independence assumption.
