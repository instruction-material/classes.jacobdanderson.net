# Membership agreement and separation

For four observations, partition A=[0,0,1,1] and partition B=[1,1,0,0] assign different numeric labels at every position. Their groups are nevertheless identical: rows 0 and 1 share one group and rows 2 and 3 share another. Their adjusted Rand agreement is 1.

Compare C=[0,1,0,1]. A and C each have two same-group observation pairs out of six possible pairs, but none of those pairs coincide. The chance-adjusted expected overlap is 2×2/6=2/3. Adjusted Rand agreement is (0-2/3)/(2-2/3)=-1/2. This concerns membership relationships, rather than arithmetic differences between cluster indices.

For the separate hand points 0,2,10,12 grouped as [0,2] and [10,12], the first point has within-group distance a=2 and other-group average b=11, giving silhouette 9/11. The second point has a=2,b=9 and silhouette 7/9. Symmetry gives the other two values. The average is (9/11+7/9)/2=79/99.

Use these hand calculations to interpret the actual six customer runs. A high score on a tiny constructed example demonstrates a calculation; the recorded dataset's score and limitation still need their own interpretation.
