# Measure frontier growth

Use S → A,B,C; A → D,E; B → F; C → G. After A is expanded, the frontier is B,C,D,E, of size four. The peak is four and eight states are expanded before G is reached. Measure the recorded queue after each expansion; counting all discovered states measures something different.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"expanded": 8, "peak_frontier": 4}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
