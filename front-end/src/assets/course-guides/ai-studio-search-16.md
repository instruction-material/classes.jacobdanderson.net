# Search Lab 16: Greedy search and A*

Greedy best-first search orders the frontier using h alone. A* uses g+h, accounting for the route already traveled. Keep accumulated cost and priority separate in both implementations. A lower estimate is a choice rule, not proof of a cheaper complete route.

## Worked case

Use S → A (2),B (1); A → G (2); B → G (8), with estimates S=3,A=2,B=0,G=0. Greedy pops S,B,G: after B, G has priority 0 while A has priority 2. Its path S,B,G costs 9.

A* also pops B before A, but then compares G's f=9 with A's f=2+2=4. It pops A and improves the goal to g=4. Its path S,A,G costs 4. The heuristic is admissible in this example, yet greedy still returns the more expensive path.

## Build and verify

Implement both modes using the same graph, ordered edges and heuristic so frontier policy is the changed variable. Return path,cost,trace with node,g,h,f,priority. Reopen a state when g improves, skip stale entries and stop on a popped goal. Reject negative or nonfinite edge costs. Keep h(goal)=0; A*'s cheapest-path guarantee also needs admissibility.

Run python3 main.py from the selected role folder. Expect greedy cost 9 and A* cost 4. Record the popped states, priorities, path costs and number of pops. Try h=0 everywhere: A* becomes UCS while greedy follows queue tie order. Try an unreachable goal and a zero-cost cycle. The trace supports an explanation of this case; a small number of examples does not prove universal performance.
