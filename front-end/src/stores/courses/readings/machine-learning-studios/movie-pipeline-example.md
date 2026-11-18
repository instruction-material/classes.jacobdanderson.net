# Transform years and revenue by hand

Consider just two hypothetical observations: (year=2000,revenue=100) and (year=2002,revenue=300). Their coordinate means are (2001,200). Population standard deviations are (1,100), because each year differs by 1 and each revenue value differs by 100 from its mean.

Standardization maps the observations to (-1,-1) and (1,1). Their joint one-group mean is (0,0); inverse transformation returns (2001,200). In standardized coordinates the squared-distance sum is 4. In raw coordinates the same grouping's squared-distance sum is 2×(1²+100²)=20002. These numbers describe different representations and cannot be compared as if they share one unit.

This two-observation calculation explains the transform; the course's actual movie comparison uses the full supplied dataset with k=3 and k=5. Complete fit_model, run the provided workflow and inspect its learned scaler means, scales and inverse-transformed centers.

Verify that every returned label and displayed center belongs to one fitted pipeline. Predict which displayed coordinate changes when only the revenue unit changes, and distinguish that display change from a change in the standardized partition.
