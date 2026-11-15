# Search Lab 15: Account for costs in UCS and A*

Weighted edges carry nonnegative finite costs. g is the sum of edge costs on the candidate path, h estimates the remaining cost, and f=g+h. UCS orders its priority queue by g. A* orders by f. The queue stores a separate g value even when its priority uses f.

## Worked case

Use S → A (2),B (1); A → G (2); B → G (8). The two routes cost 4 and 9. The supplied admissible estimates are h(S)=3,h(A)=2,h(B)=0,h(G)=0; each is at most the true remaining cost. Admissible means an estimate never overstates the cheapest remaining cost.

UCS expands S(g=0), B(g=1), A(g=2), G(g=4). A* expands S(f=3), B(f=1), A(f=4), G(f=4). Both return S,A,G with cost 4. After B, the queue contains a cost-9 goal candidate. Finding a goal while generating successors does not establish the cheapest route.

Now change h(A) to 100. A* expands S,B,G and returns cost 9. That heuristic overestimates A's remaining cost of 2, so the usual optimality guarantee no longer applies.

## Build and verify

Implement search(graph,start,goal,heuristic,mode) for ucs and astar, returning path,cost,trace. Every popped-state trace records node,g,h,f,priority. Reopen a state when a cheaper g is found and skip stale entries. Stop when the goal is popped. For A* optimality, use admissible estimates with h(goal)=0 and allow reopenings; these packs use finite graphs. Reject negative and nonfinite edge costs. An exhausted frontier returns an empty path and cost None.

Run python3 main.py from the selected role folder. Expect UCS=4, admissible A*=4 and bad-heuristic A*=9. Change the graph so a state is reached first by a costly route and later more cheaply. Check zero-cost cycles and an unreachable goal. Explain each queue priority from the trace.
