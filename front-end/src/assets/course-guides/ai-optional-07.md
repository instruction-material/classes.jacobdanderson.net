# Find a shallower second route

Use S → A,B; A → X; X → C; B → C; C → G. With limit three, the A branch reaches C at the cutoff; the B branch reaches C one edge sooner and finds G. Limits zero, one and two give cutoff; three finds a goal. This exposes the error in using one global visited set for depth-limited DFS.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"0": "cutoff", "1": "cutoff", "2": "cutoff", "3": "found"}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
