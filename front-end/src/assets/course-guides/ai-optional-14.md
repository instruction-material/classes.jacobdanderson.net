# Evaluate the complete tiny puzzle space

Enumerate all 24 permutations. Twelve can reach the goal and twelve cannot; the longest minimum path is six moves. Among reachable states, two non-goal boards still have blank-distance zero. Report both coverage and this score limitation. This finite benchmark describes the 2×2 puzzle, not all search problems.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"false_zero_scores": 2, "max_shortest_moves": 6, "reachable": 12, "unreachable": 12}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
