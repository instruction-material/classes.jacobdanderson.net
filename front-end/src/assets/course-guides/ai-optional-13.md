# Check a changed puzzle-state family

Use four start boards: (3,1,0,2), (0,1,3,2), (1,0,3,2), and (1,3,2,0). The first three lie on a three-swap chain to the goal, giving three, two and one moves. The last board is unreachable and gives None. Verify every adjacent pair by one physical blank swap.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"moves": [3, 2, 1, null]}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
