# Compare stack and queue traversal

Use S → A,B; A → C; B → D,S; C → G. Append neighbors in the written order. A stack pops from the newest end and visits S,B,D,A,C,G. A queue pops the oldest entry and visits S,A,B,C,D,G. The back edge B → S must not cause a repeat. These are traversal orders, not reconstructed paths. Explain how the same stored frontier can produce either policy.

## Build and verify

Implement the named functions and solve_extension in main.py. Run python3 main.py from the chosen role folder. The JSON output represents tuple states as arrays. Use the worked case and the stated boundary checks before changing an input. The source uses only the Python standard library.

## Expected result

{"queue": ["S", "A", "B", "C", "D", "G"], "stack": ["S", "B", "D", "A", "C", "G"]}

## Function contract

traversal(policy) accepts stack or queue and returns the full visited order. Reject other policy names. The starter supplies GRAPH in neighbor order.
