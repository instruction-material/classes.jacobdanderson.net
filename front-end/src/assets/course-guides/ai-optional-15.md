# Transfer a block through board rotation

Rotate the forced-block board XX-/-O-/--- clockwise. Its row-major encoding becomes --X/-OX/---. The threat moves from the top row to the right column, so O must block index eight. Keep X/O counts, coordinates and move legality consistent through the transformation.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"block": 8, "board": "--X-OX---"}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
