# Explain a zero-heuristic comparison

Set every h to zero in the original weighted graph. A* becomes UCS. Greedy uses only tie order, and this particular ordered graph also happens to produce cost four. Record the popped states to explain why equal final costs do not establish equivalent algorithms. Reverse neighbor order as a follow-up case.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"astar": 4, "greedy": 4}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
