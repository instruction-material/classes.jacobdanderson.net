# Change a revenue unit without changing a partition

Take hypothetical revenues 100 and 300. Their mean is 200 and population standard deviation is 100, so their standardized values are -1 and 1. Expressing the same revenues in thousands gives 0.1 and 0.3, mean 0.2 and standard deviation 0.1. Their standardized values remain -1 and 1.

For a positive unit factor c, the transformed expression is (c×value-c×mean)/(c×scale)=(value-mean)/scale. Apply this coordinate by coordinate while retaining release year. With the same observations, fitting choices and numerical tolerance, the standardized geometry is preserved. Floating-point details can affect an exact tie, so compare the observed partition rather than demanding identical raw labels.

For example, [0,0,1,1] and [1,1,0,0] name the same two groups. Adjusted Rand agreement is 1 despite the changed labels. Their centers must still be converted to the same revenue unit before comparing the displayed numbers.

Run the revenue-in-thousands experiment on a separate saved copy of the provided movie analysis. Keep the original CSV unchanged, retain both fitted scaler states and compare all corresponding k/seed partitions and converted centers.
