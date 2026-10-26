# Functions Practice

Implement six arrow functions with returned values: add(x,y)=x+y; subtract(x,y)=x−y; multiply(x,y,z)=xyz; and average(x,y)=(x+y)/2. Parentheses ensure the sum is divided, rather than dividing only the second value. Printing remains outside the calculation functions so a returned value can be reused.

## Factorial and powers

For a nonnegative integer n, n! is the product 1×2×…×n. Start a local accumulator at 1 and multiply once for each integer from 1 through n. The empty product gives 0!=1. The reference accepts integers from 0 through 170 because larger factorials overflow JavaScript Number. Negative and fractional inputs are rejected.

For exponent(b,p), start another local accumulator at 1 and multiply by b exactly p times. A power of zero therefore returns 1. This exercise uses finite bases and integer powers from 0 through 1000; reject an overflowing result. Declaring both accumulators locally prevents one function from overwriting another function's work.

## Fixed cases

add(13,18)=31; subtract(13,18)=−5; multiply(13,18,10)=2340; average(13,18)=15.5; factorial(4)=24; exponent(2,5)=32. Also check factorial(0), exponent(2,0), exponent(2,1), and repeated calls in different orders. A nonnumeric, fractional-factorial, or negative-power value needs a clear rejection rather than a misleading number.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The starter retains unfinished original work; the reference contains completed functions. Edit script.js, save the same attempt, reopen it, and check that earlier edits remain. README.md is the project brief. Export the complete ZIP, extract all files, and open index.html in a browser. The page works without a server, installation, or network connection.

The original examples use D3 5.16.0 to print results. The local copy and its license are included. support.js supplies readable page output and connects the labeled controls to the exercise functions. Calculations and game state belong in script.js. Input changes take effect only after the page form is submitted. SOURCES.md records the original editor panels and deliberate adaptations.

Before running, predict the return value and identify the state that should change. Trace parameters, local variables, returned values, and displayed output separately. Compare the starter and reference after an independent attempt; keep explanation alongside the saved code rather than replacing an earlier attempt.

## Verify the result

Use the supplied fixed cases before random examples. Check a boundary case, an invalid input, and a second valid case. A rejected form value should leave the last valid output readable. Operate the controls with the keyboard and inspect a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export every companion file, and repeat the check in the extracted page. Record the expected and observed result and the function responsible for any difference.
