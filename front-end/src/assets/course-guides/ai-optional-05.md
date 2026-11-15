# Trace a route through a cyclic graph

Change the original tree into A → B,C; B → D; C → A,G; D → G. The back edge C → A must not enqueue A again. A,C,G has two edges; A,B,D,G has three. Report the two-edge path and expanded order A,B,C,D,G. The expanded order itself is not a legal route.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"expanded": ["A", "B", "C", "D", "G"], "path": ["A", "C", "G"]}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
