# Debugging Functions

Debug the original coffee-shop calculator. The starter deliberately contains invalid syntax and other bugs; its initial syntax diagnostic is part of the exercise. Repair the source rather than replacing the starter with the reference.

## Model the costs

Each cup uses 1/100 gallon of milk, 1/150 bag of beans, and 1/200 sack of sugar. Ingredient packs cost $2.49, $18.89, and $9.99 respectively. A cup costs $0.01, daily maintenance $30, daily rent $100, and the selling price is $1.99 per cup. These are fixed fictional teaching costs.

Because unused ingredients expire daily, n cups require ceil(n/100) milk packs, ceil(n/150) bean packs, and ceil(n/200) sugar packs. dailyCost(n) adds those whole-pack costs, n times the cup cost, maintenance, and rent. Revenue is 1.99n. calculateProfit(n) returns revenue minus cost. Keep money calculations in integer cents and format only the displayed dollars.

## Repair in order

First repair arrow-function syntax and missing braces so the file parses. Correct Math.ceiling to Math.ceil and make parameter names match their uses. Define const-bound functions before calling them. Return calculated values; printing a value is not a return. Repair template interpolation so expressions appear inside ${...}.

reachProfitGoal(goal) checks successive whole cup counts from zero and returns the first whose profit reaches the goal. Do not assume profit increases on every cup: buying another whole ingredient pack creates a cost jump. A sequential search proves the first qualifying count. The reference accepts finite goals from $0 through $10,000 and bounds its search, avoiding an endless loop on an invalid or unattainable input.

## Verify the repair

At zero cups, cost is $130 and profit is −$130. At 81 cups profit is −$0.99; at 82 cups it is $0.99, so 82 is the first break-even count. Check goals $0, $200, and $1,000. For each returned n, check that profit(n) reaches the goal and that no earlier count does. Also compare 100 and 101 cups to observe a purchasing boundary. Record each bug, its symptom, and the corrected function before comparing with the reference.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The starter retains unfinished original work; the reference contains completed functions. Edit script.js, save the same attempt, reopen it, and check that earlier edits remain. `README.md` is the project brief. Export the complete ZIP, extract all files, and open index.html in a browser. The page works without a server, installation, or network connection.

The original examples use D3 5.16.0 to print results. The local copy and its license are included. support.js supplies readable page output and connects the labeled controls to the exercise functions. Calculations and game state belong in script.js. Input changes take effect only after the page form is submitted. `SOURCES.md` records the original editor panels and deliberate adaptations.

Before running, predict the return value and identify the state that should change. Trace parameters, local variables, returned values, and displayed output separately. Compare the starter and reference after an independent attempt; keep explanation alongside the saved code rather than replacing an earlier attempt.

## Verify the result

Use the supplied fixed cases before random examples. Check a boundary case, an invalid input, and a second valid case. A rejected form value should leave the last valid output readable. Operate the controls with the keyboard and inspect a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export every companion file, and repeat the check in the extracted page. Record the expected and observed result and the function responsible for any difference.
