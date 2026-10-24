# Random Practice

Print five random integers, in order: 0 through 5, 1 through 10, 20 through 50, an even integer from 0 through 50, and an odd integer from 51 through 101.

## Exercise

The supplied printToScreen helper displays text as text, without interpreting HTML.

## Checks

Count the allowed integers before selecting each multiplier. Check the endpoints using 0 and a value just below 1 in place of Math.random(). Math.ceil(Math.random() * 10) can produce 0, so it does not satisfy the 1-through-10 contract.

## Run

Open index.html in a browser. The same HTML, CSS, JavaScript and local D3 files run from the exported project without a network connection. Prompts accept input in browser dialogs; results appear on the page.

## Source

Adapted from [Juni Learning's original reference project](https://codepen.io/junilearning/pen/5bbc99927a71e48ec59e93b8dfbb585c). The D3 license is included as LICENSE-d3.txt.
