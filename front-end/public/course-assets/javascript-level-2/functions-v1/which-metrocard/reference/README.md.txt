# Which MetroCard

Compare two plans using the original fixed teaching fares: a monthly pass costs $127 and each individual ride costs $2.75. These are sample inputs from the source exercise, not a current transit fare quote.

## Cost model

For n rides, pay-per-ride cost is 2.75n and monthly cost is 127. calculateSavings(n) returns 2.75n−127. A positive result means the monthly pass saves that amount; a negative result means paying per ride saves its absolute value. suggestCard(savings) converts the signed number into a neutral message. Zero means equal costs.

Keep both costs visible, then give the comparison. Round only the displayed money with toFixed(2) or currency formatting. Validate a nonnegative whole ride count before multiplying. A blank or cancelled entry is not an implicit zero: a legitimate zero must be entered explicitly. The page form replaces the original blocking prompt and retains the previous result when a value is rejected.

## Fixed cases and break-even

For 30 rides, the individual total is $82.50 and saves $44.50. For 45 rides, it is $123.75 and saves $3.25. For 60 rides, it is $165.00 and a pass saves $38.00. The equality point is 127/2.75, about 46.18 rides; for whole rides the monthly pass first becomes cheaper at 47. Check 46 and 47 separately. Check suggestCard(0) directly even though the equality point is not a whole ride count under these sample fares.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The starter retains unfinished original work; the reference contains completed functions. Edit script.js, save the same attempt, reopen it, and check that earlier edits remain. README.md is the project brief. Export the complete ZIP, extract all files, and open index.html in a browser. The page works without a server, installation, or network connection.

The original examples use D3 5.16.0 to print results. The local copy and its license are included. support.js supplies readable page output and connects the labeled controls to the exercise functions. Calculations and game state belong in script.js. Input changes take effect only after the page form is submitted. SOURCES.md records the original editor panels and deliberate adaptations.

Before running, predict the return value and identify the state that should change. Trace parameters, local variables, returned values, and displayed output separately. Compare the starter and reference after an independent attempt; keep explanation alongside the saved code rather than replacing an earlier attempt.

## Verify the result

Use the supplied fixed cases before random examples. Check a boundary case, an invalid input, and a second valid case. A rejected form value should leave the last valid output readable. Operate the controls with the keyboard and inspect a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export every companion file, and repeat the check in the extracted page. Record the expected and observed result and the function responsible for any difference.
