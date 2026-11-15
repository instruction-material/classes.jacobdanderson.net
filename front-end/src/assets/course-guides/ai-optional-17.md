# Transfer the marble strategy to new piles

Analyze piles nine through twelve under the same last-take-wins rule. Takes one, two and three leave losing pile eight. Pile twelve has no winning take against perfect play; the reference chooses the lowest legal take, one. Report whether a winning take exists separately from the selected move.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"10": {"take": 2, "winning_take_exists": true}, "11": {"take": 3, "winning_take_exists": true}, "12": {"take": 1, "winning_take_exists": false}, "9": {"take": 1, "winning_take_exists": true}}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
