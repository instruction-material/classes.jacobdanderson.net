# Keep the representation with the result

Choose a candidate grouping using its declared purpose, actual k/seed stability, silhouette, group sizes and interpretable raw-unit centers. Record why the additional centers help the analysis, or why the simpler grouping is sufficient. Preserve the evidence for all six fits rather than retaining only the most attractive plot.

For the unit experiment, multiply every income observation by 1000 and refit StandardScaler on the same observations. Positive rescaling changes the fitted mean and scale by the same factor, leaving standardized coordinates unchanged up to floating-point error. Compare partitions with adjusted Rand agreement and convert centers back to the chosen original units. Comparing raw center numbers across different units without conversion would be misleading.

The observations and chosen features delimit the conclusion. Stable grouping across three seeds supplies evidence about this fitting procedure; it does not establish meaningful customer types, behavior or suitable targeting decisions. Retain one data-coverage or representation limitation with the chosen grouping.
