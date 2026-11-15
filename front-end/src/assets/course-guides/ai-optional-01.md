# Represent legal grid actions

Encode a state as (row,column) in a 2×2 grid, with blocked cell (1,0). Each action moves one cell horizontally or vertically. From (0,0), only (0,1) is legal; from (1,1), only (0,1) is legal. Reject out-of-bounds and blocked start states. Separating state validity from legal actions gives later searches a precise problem model.

## Build and verify

Implement the named functions and solve_extension in main.py. Run python3 main.py from the chosen role folder. The JSON output represents tuple states as arrays. Use the worked case and the stated boundary checks before changing an input. The source uses only the Python standard library.

## Expected result

{"from_goal": [[0, 1]], "from_start": [[0, 1]]}

## Function contract

legal_next(position) returns legal destination tuples and rejects blocked or out-of-bounds positions. The starter supplies WIDTH, HEIGHT and BLOCKED.
