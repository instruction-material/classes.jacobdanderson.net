# Rock Paper Scissors

Build a first-to-three match with separate input, random choice, comparison, and score functions. The original reference incorrectly counted Cancel as a loss. A cancelled or invalid choice must leave the round number and both scores unchanged.

## Function contracts

yourTurn() reads the selected page value, trims it, lowercases it, and returns rock, paper, scissors, or nothing for an empty choice. computerTurn() selects one of the three choices using floor(random×3). findResult(player,computer) returns win, lose, or tie for valid choices, and invalid for any other token.

| Player | Rock | Paper | Scissors |
| --- | --- | --- | --- |
| Rock | tie | lose | win |
| Paper | win | tie | lose |
| Scissors | lose | win | tie |

The column is the computer's choice. Implement and check all nine comparisons before connecting score updates.

## State and events

playRound() calls the input function first. If the choice is cancelled, return the current score immediately, before drawing a computer choice. Otherwise compare, add one point only to the winner, and advance the round number once. A tie advances the played round without adding points. Return a record containing the choices, result, round, scores, and whether the match is finished; support.js displays that record.

Once a score reaches three, further calls preserve the finished state. resetMatch() returns scores to zero and the next round to one. The page submits one round at a time rather than trapping the browser in a prompt/alert loop. Preserve these state functions in script.js so the exercise includes the match logic.

Check cancellation before the first round and after a scored round, all ties, a three-win player match, a three-win computer match, and reset. Cancel must not consume a random computer choice or erase the last played round.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The starter retains unfinished original work; the reference contains completed functions. Edit script.js, save the same attempt, reopen it, and check that earlier edits remain. `README.md` is the project brief. Export the complete ZIP, extract all files, and open index.html in a browser. The page works without a server, installation, or network connection.

The original examples use D3 5.16.0 to print results. The local copy and its license are included. support.js supplies readable page output and connects the labeled controls to the exercise functions. Calculations and game state belong in script.js. Input changes take effect only after the page form is submitted. `SOURCES.md` records the original editor panels and deliberate adaptations.

Before running, predict the return value and identify the state that should change. Trace parameters, local variables, returned values, and displayed output separately. Compare the starter and reference after an independent attempt; keep explanation alongside the saved code rather than replacing an earlier attempt.

## Verify the result

Use the supplied fixed cases before random examples. Check a boundary case, an invalid input, and a second valid case. A rejected form value should leave the last valid output readable. Operate the controls with the keyboard and inspect a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export every companion file, and repeat the check in the extracted page. Record the expected and observed result and the function responsible for any difference.
