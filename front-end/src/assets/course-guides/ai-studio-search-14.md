# Search Lab 14: Depth limits and iterative deepening

Depth counts edges from the start, whose depth is zero. Depth-limited search uses DFS but stops descending at the limit. Its three outcomes have different meanings: found returns a goal path; cutoff means a legal continuation was excluded by the limit; failure means this search exhausted all cycle-free possibilities without a goal.

## Worked case

Use S → A,B; A → C; C → G; B,G have no outgoing edges. A goal check happens before a cutoff check, so a goal exactly at the limit is found.

| Limit | Outcome | Visit order |
| --- | --- | --- |
| 0 | cutoff | S |
| 1 | cutoff | S,A,B |
| 2 | cutoff | S,A,C,B |
| 3 | found | S,A,C,G |

Iterative deepening restarts DLS at 0,1,2,3. It visits S four times, repeating shallow work to avoid committing to one depth limit. The successful path is S,A,C,G. A limit of 4 also finds that path, at depth 3. A dead-end state at the limit is failure, because no continuation was excluded.

## Build and verify

Implement depth_limited_search and iterative_deepening. Return status, path and visits; IDS also returns attempts including every limit. Track cycles on the current path. A global visited set can incorrectly suppress a state later reached by a shallower route. Reject negative or noninteger limits. Stop IDS after found, after genuine failure, or at the caller's maximum depth.

Run python3 main.py from the selected role folder. Try a goal at the start with limit 0, a goal exactly at the limit, an unreachable goal, and a graph with a cycle. Compare total visits across IDS attempts with one depth-3 DLS run. A cutoff is inconclusive, not proof of unreachability.
