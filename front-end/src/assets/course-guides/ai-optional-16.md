# Compare against seeded random opponents

Run twenty games with seeded random X moves and the complete-search O policy. Record X wins, O wins and draws, using one Random(7) instance for reproducibility. X must never win, and all outcome counts must sum to twenty. These sampled games supplement the core exhaustive check; they do not replace a proof over every legal human response.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

Check the stated outcome invariants and repeated-seed reproducibility.

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
