# Fit one movie-coordinate pipeline

The movie program reads release_date and inflation_adjusted_gross from the supplied disney.csv. It extracts release year and combines that coordinate with inflation-adjusted revenue in the dataset's dollars. The data preparation supplies a finite two-column matrix; the named fit_model task owns fitting the scaled clustering pipeline.

Return a fitted Pipeline containing scale=StandardScaler and cluster=KMeans. Preserve the requested k and seed, n_init=10, max_iter=300 and tol=1e-6. StandardScaler estimates one population mean and standard deviation per input column, with scale 1 for a constant column. KMeans then fits to the transformed coordinates.

This is an unsupervised descriptive analysis of the supplied observations, so the fitted scaler uses those observations. A separate supervised prediction study would reserve held-out data before fitting learned transformations. State which task is being performed when interpreting the result.

Read labels_ and cluster_centers_ from the fitted cluster step. The centers are standardized coordinates; scale.inverse_transform converts them back to release years and revenue units for interpretation. A second fit can choose another solution and must not be used to obtain centers for labels saved from the first fit. The provided main program retains all six k/seed results and creates its selected fitted illustration.
