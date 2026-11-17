# Naive Bayes: priors, likelihoods and two feature models

Bayes' rule combines a class prior with the likelihood of observed features. For comparing classes, the shared evidence denominator can be omitted: `score(class) = prior(class) * product(feature likelihoods given class)`. The naive assumption treats features as independent conditional on the class. This is a modeling assumption, not a claim that real features are unrelated.

## Counted-text calculation

Use a fixed vocabulary in the order free, offer, meeting. Two fictional classes S and H have equal prior 1/2. Their training token totals are S:(4,2,0) and H:(0,1,5); each class contains six tokens.

With Laplace smoothing alpha=1, add one to each token count and add the vocabulary size three to each denominator. The conditional token probabilities are S:(5/9,3/9,1/9) and H:(1/9,2/9,6/9). Without smoothing, an unseen class/token pair would make the entire product zero.

The message `free meeting` has count vector (1,0,1). Its unnormalized scores are:

- S: `(1/2)*(5/9)*(1/9) = 5/162`.
- H: `(1/2)*(1/9)*(6/9) = 6/162`.

The larger score selects H. Dividing by their sum gives S:5/11 and H:6/11. These are outputs under this tiny assumed model, not independently established confidence in real messages.

For `free free`, use the repeated count: the free likelihood is squared. The normalized S result becomes 25/26. A count model records repetitions; a binary word-presence model is a different likelihood model.

Implementations normally sum log priors and count-weighted log likelihoods instead of multiplying many small values. Freeze the vocabulary and smoothing choice from training evidence; transform later messages with that same vocabulary.

## Continuous measurements

Gaussian naive Bayes models a feature with a class-specific mean and variance. For one feature, its density is `exp(-(x-mean)^2/(2*variance)) / sqrt(2*pi*variance)`. A density at a point is not the probability of observing that exact continuous value.

For a separate authored case, let class A have mean 0, class B mean 3, and both variances be 1. At x=1, their densities are approximately 0.241971 and 0.053991. Equal priors select A. Changing the priors to A:0.1 and B:0.9 yields scores about 0.024197 and 0.048592, selecting B. Both the prior and feature model matter.

Estimate each class's feature means and variances from training rows only. A zero variance needs the implementation's explicit positive variance safeguard. Use Gaussian likelihoods for the supplied continuous-measurement example and count likelihoods for the text example, with suitable checks for each representation.

Compare held-out class supports, errors and a baseline. The independence assumption and the data's sampling limit the interpretation even when the program executes correctly.

[Naive Bayes likelihood models](https://scikit-learn.org/stable/modules/naive_bayes.html).
