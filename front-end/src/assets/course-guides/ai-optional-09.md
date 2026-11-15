# Reopen a cheaper state

Use S → A(3),B(1); B → A(1); A → G(2). Set h(S)=0,h(A)=0,h(B)=3,h(G)=0. These estimates are admissible but inconsistent across B → A. A is first popped at g=3, then reopened at g=2 through B. Return cost four and two A pops. Closing A permanently after its first pop loses the cheapest route.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"A_pops": 2, "cost": 4}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
