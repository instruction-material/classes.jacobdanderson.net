# Trace an unseen category

Keep the two-feature fitted vocabulary [buying: low,high; safety: low,high]. A known query (low,low) has vector [1,0,1,0]. An unseen query (unlisted,low) becomes [0,0,1,0]. Its squared distance to (low,low) is 1 and to (high,high) is 3. The unknown value is neither assigned an invented position nor added to the learned vocabulary.

Replace unlisted with a second distinct unseen string while retaining safety=low. Both queries become [0,0,1,0], so a fixed deterministic classifier gives them identical predictions. That agreement follows from the representation; it does not show that the original strings have the same meaning.

In the supplied completed car program, inspect fitted_categories and unknown_probe in classification-report.json. Locate the buying block in the full six-feature vector, compare its known and unknown encodings, and independently add the squared coordinate differences. The unseen buying value is deliberately separate from the retained dataset.

Use the same fitted encoder and seven-neighbor model throughout this trace. Refitting with a probe would change the vocabulary under investigation. Preserve the original split and distinguish a hand-worked representation check from the held-out model/baseline comparison.
