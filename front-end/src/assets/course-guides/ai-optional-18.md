# Benchmark a policy against seeded legal play

Run one game from each pile one through twelve, with the policy moving first and a seeded legal opponent. The nine starting piles that are not multiples of four must be won by the policy. Starting piles four, eight and twelve have no guaranteed win; an imperfect opponent can still lose. Record all outcomes and keep guaranteed-start wins distinct from lucky recoveries.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

Check the stated outcome invariants and repeated-seed reproducibility.

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
