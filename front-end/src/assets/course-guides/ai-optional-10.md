# Test the admissibility boundary

The graph has S → A(2),B(1); A → G(2); B → G(8). Compare the supplied admissible estimate h(A)=2 with h(A)=100, leaving the graph unchanged. Costs are four and nine. Verify the true remaining cost from A by hand, then explain which heuristic assumption changed.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"admissible_cost": 4, "overestimate_cost": 9}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
