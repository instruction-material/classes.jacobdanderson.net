# Account for iterative-deepening work

The supplied chain S → A → C → G also has dead-end B beside A. IDS tries limits 0,1,2,3. Its visit counts are 1,3,4,4: twelve total, including four visits to S. Keep repeated visits across restarts in the measurement; a set would erase the repeated-work cost.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"attempts": 4, "start_visits": 4, "visits": 12}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
