# Double or Nothing

Start with 1000 virtual dollars. Before each flip, ask whether to play or leave.
Y plays; N or Cancel ends the game with the current balance. Other entries
repeat the question without flipping. Heads doubles the balance; tails ends
the game at zero. This exercise uses virtual dollars only.

## Trace the loop

Keep the balance in one variable. A while loop repeats the decision until a stop
path returns that balance. Test the choice before drawing a random value.
Normalize a string with trim().toUpperCase(); check Cancel (null) first.

For Y, Y, N with heads then heads, trace 1000, 2000, 4000. N consumes no third
random value. For Y and tails, return zero immediately. Cancel before the first
flip returns 1000. An invalid choice asks again with the same balance.

## Complete the starter

Implement playDoubleOrNothing(ask = prompt, random = Math.random) in script.js.
ask accepts the prompt message and returns the entered string or null.
random returns a value in [0, 1). Compute Math.floor(random() * 2): zero means
heads and one means tails. Separate choice handling, flips and balance changes.

Return the final balance along every ending path. The supplied Start round
button calls the function and printToScreen. The supplied D3 helper appends a
readable text paragraph. text() treats the result as text. Keep game decisions
outside this rendering helper. Each button click starts a fresh round at 1000
and records one result.

Validate the random value before using it. Values outside [0, 1) produce an
error instead of a fabricated flip. If another heads would exceed
Number.MAX_SAFE_INTEGER, preserve the current balance and end the round,
keeping displayed dollar amounts exact.

## Run and compare

Keep all files together and open index.html in a browser without a server.
Press Start round and use the actual Y/N/Cancel prompt. Complete the starter
before comparing the reference. Save the same IDE attempt, export its ZIP and
open that exported HTML. README.md explains the workflow; CASES.md supplies fixed traces; SOURCES.md identifies
the original assignment and the offline output adaptation.

Complete the starter before comparing the reference.
