# Pain at the Pump

Model fuel cost with explicit units. miles/MPG gives gallons; multiplying gallons by dollars per gallon gives dollars. totalCost(mpg,miles,gasCost) returns that numeric cost, not a formatted string.

## Inputs and precision

Require finite values, MPG greater than zero, and nonnegative miles and fuel price. Zero miles is valid and costs zero. Zero MPG is invalid because division by zero does not describe a usable efficiency. A blank form field must not silently become zero.

The original example samples an integer distance from 10,000 through 100,000 miles and a sample fuel price from $1 through $5 per gallon, then compares 10, 25, and 50 MPG at the same distance and price. Keep those common inputs identical so efficiency is the only changed variable. These are teaching scenarios, not a current price quote.

Keep full numeric precision inside totalCost. Apply toFixed(2) or a currency formatter only where money is printed. Otherwise a later addition may concatenate strings instead of adding numbers.

## Fixed cases

At 10,000 miles and $3 per gallon, 10 MPG requires 1,000 gallons and costs $3,000; 25 MPG requires 400 gallons and costs $1,200; 50 MPG requires 200 gallons and costs $600. At a fixed distance and price, doubling MPG halves cost. Check zero miles, zero fuel price, zero MPG, and a decimal price. Predict the gallons first so a unit mistake is visible before rounding hides it.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The starter retains unfinished original work; the reference contains completed functions. Edit script.js, save the same attempt, reopen it, and check that earlier edits remain. `README.md` is the project brief. Export the complete ZIP, extract all files, and open index.html in a browser. The page works without a server, installation, or network connection.

The original examples use D3 5.16.0 to print results. The local copy and its license are included. support.js supplies readable page output and connects the labeled controls to the exercise functions. Calculations and game state belong in script.js. Input changes take effect only after the page form is submitted. `SOURCES.md` records the original editor panels and deliberate adaptations.

Before running, predict the return value and identify the state that should change. Trace parameters, local variables, returned values, and displayed output separately. Compare the starter and reference after an independent attempt; keep explanation alongside the saved code rather than replacing an earlier attempt.

## Verify the result

Use the supplied fixed cases before random examples. Check a boundary case, an invalid input, and a second valid case. A rejected form value should leave the last valid output readable. Operate the controls with the keyboard and inspect a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export every companion file, and repeat the check in the extracted page. Record the expected and observed result and the function responsible for any difference.
