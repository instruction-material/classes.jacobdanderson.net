# Transfer greedy and A* to a new cost trap

Use S → X(1),Y(2); X → G(20); Y → G(2), with h(X)=0,h(Y)=2,h(S)=2,h(G)=0. Greedy takes the apparently close X route for cost 21. A* later compares G's f=21 with Y's f=4 and returns cost four. Hold inputs fixed while changing only the priority policy.

## Task

Complete solve_extension in main.py. The studio.py file supplies the already completed parent algorithm; use it to isolate this exercise's changed input, diagnostic or evaluation. Keep the game/search rules and goal test separate from the measurements. Run python3 main.py in the selected role folder.

## Expected result

{"astar": 4, "greedy": 21}

Try one additional case and explain which assumption changed. The source uses only the Python standard library.
