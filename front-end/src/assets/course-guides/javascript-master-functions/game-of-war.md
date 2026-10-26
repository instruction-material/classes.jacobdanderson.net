# Game of War

Simulate ten rounds of two independent card draws. This is the original simplified model with replacement, not a shuffled 52-card deck and not the full multi-card War tie procedure. A tied round adds no points.

## Draw a card

Choose a rank with floor(random×13)+1, giving integers 1 through 13 even when Math.random() returns zero. Ranks 11, 12, and 13 display Jack, Queen, and King. Display rank 1 as Ace and return comparison value 14 so it beats King. Choose a suit with floor(random×4)+1 and map all four results to suit names.

drawCard(playerName) prints the card and suit, then returns the comparison value. Keep display labels separate from the numeric value used by the scoring loop. The page uses fictional Player 1 and Player 2 labels instead of requesting names in blocking prompts.

## Ten-round state

Start both scores at zero. In each of exactly ten iterations, draw once for each player, compare the returned values, update at most one score, and print the round result. Print both final scores and the final winner or tie after the last iteration. A rerun starts a new ten-round simulation.

Check the lower random boundary explicitly: zero must draw an Ace, not a rank-zero card. Check the highest boundary, Ace versus King, equal ranks, and all four suits. The two scores sum to ten minus the number of tied rounds. Fixed random draws make these checks reproducible before a random simulation is interpreted.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The starter retains unfinished original work; the reference contains completed functions. Edit script.js, save the same attempt, reopen it, and check that earlier edits remain. README.md is the project brief. Export the complete ZIP, extract all files, and open index.html in a browser. The page works without a server, installation, or network connection.

The original examples use D3 5.16.0 to print results. The local copy and its license are included. support.js supplies readable page output and connects the labeled controls to the exercise functions. Calculations and game state belong in script.js. Input changes take effect only after the page form is submitted. SOURCES.md records the original editor panels and deliberate adaptations.

Before running, predict the return value and identify the state that should change. Trace parameters, local variables, returned values, and displayed output separately. Compare the starter and reference after an independent attempt; keep explanation alongside the saved code rather than replacing an earlier attempt.

## Verify the result

Use the supplied fixed cases before random examples. Check a boundary case, an invalid input, and a second valid case. A rejected form value should leave the last valid output readable. Operate the controls with the keyboard and inspect a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export every companion file, and repeat the check in the extracted page. Record the expected and observed result and the function responsible for any difference.
