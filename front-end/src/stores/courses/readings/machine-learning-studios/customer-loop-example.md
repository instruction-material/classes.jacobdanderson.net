# Trace one Lloyd update

Use the one-dimensional hand observations 0,2,10,12, with initial centers 0 and 10. Squared distances assign 0 and 2 to the first center and 10 and 12 to the second. The coordinate means are (0+2)/2=1 and (10+12)/2=11.

With those updated centers, squared distances sum to (0-1)²+(2-1)²+(10-11)²+(12-11)²=4. A second update leaves both means unchanged. For this trace, fit_kmeans receives the raw hand coordinates; the supplied customer program separately standardizes its actual two-feature input.

The hand sample's mean is 6 and its population variance is (36+16+16+36)/4=26. Standardizing the hand coordinate divides every squared distance by 26, so the corresponding standardized inertia is 4/26. Raw-unit and standardized inertia therefore have different units and magnitudes, even for the same partition.

Call the completed function with k=2, initial centers [[0],[10]] and max_iter=1. Inspect centers, final labels, inertia, iterations and converged. Predict each value before running. Then allow a second update and explain why the movement stopping rule can establish convergence without changing the already useful first result.
