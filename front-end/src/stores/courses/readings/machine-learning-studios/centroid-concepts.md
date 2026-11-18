# Implement a coordinate mean

A centroid is one coordinate mean per feature. For n points of equal width, coordinate j is the sum of their j-th coordinates divided by n. The result has the same number of coordinates as each point, rather than one scalar average across every feature.

This studio completes calculate_centroid while retaining the provided clustering loop. The caller supplies one group's current feature rows. The reference rejects an empty collection, zero-width points and unequal dimensions; the clustering loop validates finite rectangular observations and repairs an empty group before asking for a centroid.

The mean is the squared-distance minimizer. In one coordinate, expanding the sum of (x-center)² and differentiating gives 2n×center-2×sum(x); setting that expression to zero yields center=sum(x)/n. Different coordinates separate into the same calculation. Keep full precision during fitting and round only for display.

The customer program fits in standardized coordinates and converts centers back to original feature units for its plots. A correct mean must therefore preserve coordinate order and avoid silently changing the input values. Implementing the mean supplies one step of the model; the caller still owns assignments, repair, convergence and interpretation.
