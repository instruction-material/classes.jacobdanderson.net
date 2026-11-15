# Marble Game: state, moves and strategy

A pile contains 0..100 marbles. Players alternate taking 1, 2 or 3, without taking more than remain. Taking the last marble wins. Equivalently, the player whose turn begins at pile zero loses. This terminal rule determines the evaluation; a different last-take rule changes the strategy.

## Worked case

Pile 1 is winning: take 1. Piles 2 and 3 are also winning because the current player can take the whole pile. Pile 4 is losing against perfect play: every take leaves 1, 2 or 3 for the opponent.

At pile 5, taking 1 leaves the opponent at losing pile 4. Taking 2 or 3 leaves a winning opponent at 3 or 2. At pile 7, take 3 to leave 4. This yields the pattern that positive multiples of 4 lose against perfect play. Starting on such a pile gives no guaranteed winning take; the reference uses the lowest legal take as its tie rule.

## Build and verify

Separate legal_moves, take, candidate_scores and best_move. Compute winning positions from zero upward: a position wins if at least one legal take leads to an opponent-losing position. Log each take, resulting pile and whether that pile is winning for the next player. This is exact finite-state evaluation, not a random prediction.

Compare lowest-legal or seeded-random play with this policy at 5 and 7, and explain the forced-loss case 4. Reject zero/negative takes, takes over 3 and takes exceeding the pile. At pile zero there are no legal moves and best_move returns None. Try 1,4,5,7 and an invalid string in the console reference. Run python3 main.py from the chosen role folder.

The starter runs a four-position comparison once its TODOs are completed. The reference starts a five-marble console game, with the human moving first, prints AI candidate scores, and reprompts on invalid input. The root main.py retains the original explicit game-tree version for comparison with the role packs' bottom-up evaluation.
