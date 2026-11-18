# Audit bounds and empty groups

For the same four hand observations, start both centers at 0. The assignment tie sends every row to the first group. The farthest eligible row is 12, so move it to the empty group. The resulting means are (0+2+10)/3=4 and 12.

After that one update, final nearest-center assignment gives groups [0,2] and [10,12], whose cost against centers 4 and 12 is 16+4+4+0=24. The centers need another update to become 1 and 11. This is why the report separates final assignment consistency, center movement and budget exhaustion. Do not report convergence merely because a program returned a result.

Check a zero iteration budget, inconsistent feature dimensions and k larger than the number of distinct points against the declared input errors. Confirm that the completed function leaves the supplied input rows unchanged. For actual customer results, retain all six k/seed runs, compare the manual single initialization per seed with the library's ten restarts per seed, and keep those different budgets visible. Interpret generated groups as patterns in these observations, with one limitation about units, initialization or data coverage.
