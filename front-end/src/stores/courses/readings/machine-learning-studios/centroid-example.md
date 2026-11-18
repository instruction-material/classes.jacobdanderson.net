# Work the two-coordinate centroid

For points (2,4) and (6,8), add the first coordinates: 2+6=8. Divide by two to obtain 4. Add the second coordinates: 4+8=12. Divide by two to obtain 6. The centroid is (4,6).

Each point's squared distance to (4,6) is 2²+2²=8, giving total cost 16. Keeping the first observation (2,4) as the center instead gives 0+(4²+4²)=32. The mean reduces the fixed group's squared-distance cost.

Adding the point (100,100) changes the mean to ((2+6+100)/3,(4+8+100)/3)=(36,112/3). The large observation moves both coordinates substantially. This sensitivity follows from squared distance and is a reason to inspect observations and units before interpreting groups.

Predict the output of calculate_centroid for both collections, then compare the actual completed function. A one-point collection returns that point. Reordering the same points preserves the mathematical mean; small floating-point differences can arise when summing many values in a different order. Keep those numerical limits separate from a wrong coordinate or divisor.
