# What's the Password?

Start with Math.PI, multiply by 6 to the eighth power, add 11, divide by 3 and round down, then take the remainder after division by Math.PI. Pass the result to printToScreen().

## Exercise

Pass the calculated number to printToScreen(value) to check the password.

## Checks

Trace each intermediate value. Math.pow(base, exponent) uses that argument order, Math.floor rounds down, and % computes a remainder. Keep the final number unrounded: the supplied checker compares the numeric result.

## Run

Open index.html in a browser. The same HTML, CSS, JavaScript and local D3 files run from the exported project without a network connection. Prompts accept input in browser dialogs; results appear on the page.

## Source

Adapted from [Juni Learning's original reference project](https://codepen.io/junilearning/pen/c550ef1e284c55fa01964589bf19b21c). The D3 license is included as LICENSE-d3.txt.
