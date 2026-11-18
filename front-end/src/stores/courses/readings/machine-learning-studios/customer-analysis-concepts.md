# Compare fitted customer partitions

Use the completed customer model to analyze grouping choices. The supplied program compares k=3 and k=5 for seeds 7,19,31. Each result records its own fitted labels and centers. Read both from that same run; fitting again creates another model and can change its grouping.

Inertia sums squared distances in standardized feature space. More centers make a smaller best-possible cost available, so a lower cost alone does not justify k=5. Actual finite local fits also depend on initialization. Silhouette instead compares each observation's average distance within its group, a, with the smallest average distance to another group, b, using (b-a)/max(a,b). Higher values indicate better separation under that representation, without establishing a useful real-world category.

Compare partitions across seeds using adjusted Rand agreement. Cluster numbers themselves have no stable meaning: permuting the numbers can leave every membership relationship unchanged. Inspect raw-unit centers and group sizes alongside the numerical scores.

The manual implementation uses one initialization for each declared seed, while the library comparison uses ten restarts for each seed. Keep those budgets explicit when interpreting differing inertia or stability. Standardizing income and spending prevents a mere change of units from arbitrarily dominating their relative distance; it does not choose the most useful features or validate the supplied observations.
