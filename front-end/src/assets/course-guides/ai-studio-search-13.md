# Search Lab 13: Inspect a BFS trace

A state is a graph node. The frontier is the FIFO queue of discovered states waiting to be expanded. The visited collection contains every discovered state, including frontier states. A parent map records the edge that first discovered each state.

## Worked case

The supplied graph has A → B,C; B → D; C → E,F; D,E,F have no outgoing edges. Neighbors are considered in the order written.

| Expanded state | Frontier after expansion | New parent links |
| --- | --- | --- |
| A | B,C | B ← A; C ← A |
| B | C,D | D ← B |
| C | D,E,F | E ← C; F ← C |
| D | E,F | none |
| E | F | none |
| F | empty | none; goal reached |

Follow F ← C ← A backward, then reverse it: A,C,F. The path has two edges. BFS guarantees a minimum-edge path in this unweighted graph; it does not minimize varying edge costs. The final trace entry is the goal check, so F's outgoing edges are not expanded.

## Build and verify

Implement breadth_first_search(graph,start,goal), returning path, expanded and trace. Each trace row stores node, frontier, visited and a snapshot of parents. Mark a state visited when it enters the queue so cycles cannot enqueue it repeatedly. Reconstruct the path from parent links rather than treating visited order as a path.

Keep breadth_first_path(start,goal) as a wrapper using GRAPH. Run python3 main.py from the selected role folder. Expect path ['A','C','F'] and expanded order A,B,C,D,E,F. Try start=goal (one-state path), an unreachable goal (empty path), and C → A (cycle). Earlier snapshots must remain unchanged when later states are discovered.
