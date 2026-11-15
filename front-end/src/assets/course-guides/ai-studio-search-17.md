# Search Lab 17: Evaluate a puzzle heuristic

Represent a 2×2 sliding puzzle as four row-major integers. Zero is the blank. A legal action swaps the blank with one vertically or horizontally adjacent tile. The goal is (1,2,3,0). BFS supplies a minimum-move baseline because every move costs one. Greedy search uses a score to choose the next frontier state.

The misplaced score counts numbered tiles outside their goal positions, excluding the blank. The weaker blank-distance score counts how far the blank is from the bottom-right cell. Log each expanded board, its score, and its legal candidate boards and scores.

## Worked case

From (1,0,3,2), sliding tile 2 up reaches (1,2,3,0) in one move. BFS and both supplied greedy policies find that route.

Stress the score with (2,3,1,0). Its blank-distance score is zero, although the numbered tiles are wrong. A shortest route is:
(2,3,1,0) → (2,0,1,3) → (0,2,1,3) → (1,2,0,3) → (1,2,3,0).
That is four moves. A score of zero from this weak heuristic is not a goal test; compare the whole board to GOAL. The two scores can rank candidates differently without guaranteeing that greedy produces a shortest route in general.

## Build and verify

Implement neighbors and solve(start,strategy,heuristic). Return path,moves,decisions; each decision contains state,score,candidates. Use a FIFO queue for BFS and a score-priority queue for greedy. Record expanded states to terminate cycles. Reject boards that do not contain 0,1,2,3 exactly once. If the frontier is exhausted, return an empty path and moves None.

Run python3 main.py from the selected role folder. Verify every consecutive path pair is one legal blank swap. Try the four-move stress case, the goal itself, and (1,3,2,0), an unreachable board. This small state space permits checking all 24 permutations: 12 are reachable from the goal. Compare move counts and decision logs for both scores. Keep the heuristic separate from state validity, legal actions and the goal test.
