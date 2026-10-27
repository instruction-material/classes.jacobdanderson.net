# Ternary Operators Practice

Rewrite four decisions using `condition ? trueValue : falseValue`. The starter already runs with ordinary if/else bodies. Comment out each original body and keep it beside its equivalent expression so the two versions can be compared.

## Four conversions

`greeting(draw)` returns Hello! when draw×2 > 1 and Goodbye! otherwise. `chooseName(draw)` returns Kevin under the same condition and Katy otherwise. Draws range from 0 inclusive to 1 exclusive; exactly 0.5 takes the false branch. Both functions default to Math.random() when called without an argument. The form supplies a draw so each branch can be reproduced.

`colorMessage(color)` returns Didn't quite get that! only when color is null. Every other string, including the empty string, is inserted into Wow, [color] is my favorite color too! The original completed example used a truthiness check and changed the empty-string behavior. Preserve the starter's strict null check. The Cancel color answer checkbox supplies null; an unchecked empty field supplies an empty string. Neither value should be silently substituted for the other.

`greaterThan50(number)` returns a boolean. Check 49, 50, and 51. The comparison itself is already a boolean, but write the explicit ternary first to practice its two values. Do not put multiple statements or score updates inside a ternary.

## Trace and compare

For draws 0.25 and 0.75, predict Goodbye!/Katy and Hello!/Kevin. For 0.5 predict the false branch. Compare null, empty text, violet, and the string 0. Keep all four old conditional bodies as comments in the completed version. The resulting output must agree with the starter for each of these inputs.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The original starter and reference remain separate roles. The Ternary Operators starter already runs; convert its conditional bodies. The other starters retain their unfinished exercise and the function contracts needed by the local controls. Edit script.js, save the same attempt, and reopen it before continuing. README.md contains the full brief. Export the complete ZIP, extract every file, and open index.html. It works without a server, installation, or network connection.

support.js connects labeled controls to the exercise functions and prints results with the bundled D3 version. Keep calculations and decisions in script.js. SOURCES.md records the original editor panels, declared dependencies, and deliberate corrections. Read the reference after an independent attempt; retain explanations and trace notes alongside the saved code.

## Verify the result

Predict a true case, a false case, and an exact boundary before running. Compare expected return values with displayed output. Rejected input must preserve the last valid result. Check keyboard controls, a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export all companion files, and repeat the checks in the extracted page.
