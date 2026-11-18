# Build the assign-and-update loop

K-means chooses k centers and assigns each observation to its nearest center. Its objective is the sum of squared distances from observations to their assigned centers, called inertia. For fixed centers, nearest-center assignment minimizes each observation's contribution. For fixed assignments, the coordinate mean minimizes each group's squared-distance sum.

Implement the named fit_kmeans task in the supplied starter. The program prepares standardized income and spending features before calling that function. The function itself operates on the coordinates it receives. Keep duplicate observations as distinct rows; use distinct values when choosing the initial centers. Equal assignment distances choose the earlier center index.

Each iteration assigns rows, repairs empty groups, computes the new means and measures the largest center movement. An empty group has no mean: move a faraway row from a group containing at least two rows, resolving equal distances by original row index. This preserves a donor group with at least one member. Complete all repairs before computing means.

Use the declared maximum of 300 iterations and movement tolerance 1e-6. A budget-limited result and a tolerance-converged result are different outcomes. Assign labels against the final returned centers before reporting inertia, even when the budget ends. Keep the iteration count, convergence flag and repair count with the result. Initialization can lead to different local solutions; a finite run does not prove the globally best grouping.
