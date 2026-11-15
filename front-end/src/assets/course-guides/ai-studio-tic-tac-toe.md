# Tic-Tac-Toe: legal play and complete search

The board is a nine-cell row-major tuple of X, O and -. X moves first. A move places the current player's mark into one empty square. A winning row, column or diagonal ends the game immediately; a full board without a winner is a draw. Square indices 0..8 correspond to human input 1..9.

## Worked cases

With board (X,X,-,-,O,-,-,-,-), O must block at index 2. Any other move lets X complete the top row. With (X,X,-,O,O,-,X,-,-), O can win now at index 5; taking a win takes priority over blocking. For (X,-,-,-,O,-,-,-,X), O must choose an edge (index 1 under the stated tie rule) to avoid X's fork. A fork creates two winning threats, so blocking just one line on the next turn is too late.

Score terminal states from O's perspective: O win +1, X win -1, draw 0. At an O turn maximize successor scores; at an X turn minimize them. For the empty board the minimax value is 0, meaning perfect play draws. A score is an outcome under optimal future play, not a prediction that a human will choose perfectly.

## Build and verify

Start with the legal board model and random legal choice as a baseline. Add immediate win and block rules, then complete minimax and compare a fork position. candidate_scores returns every legal move and its minimax outcome. best_move chooses the lowest index among equally good outcomes, and returns None after a win or draw. Return a fresh board from play so branches cannot mutate each other.

Reject occupied squares, out-of-range or noninteger moves and impossible X/O counts. Check wins, blocks, forks, ties and a terminal board. Run python3 main.py in the chosen role folder. The starter demonstrates a forced-block case after its TODOs are completed. The reference offers a console game with X controlled by input and O by minimax, prints candidate scores, and reprompts on invalid input.

The role packs use cached evaluation of reached board states. The root main.py retains the earlier eager-tree demonstration; its timed variant is useful for comparing eager-tree construction and evaluation costs with caching.
