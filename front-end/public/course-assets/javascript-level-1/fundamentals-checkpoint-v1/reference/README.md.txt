# Fundamentals checkpoint

## Check-In #1: Variables

Create variables for three different kinds of data: a number, a string, and a boolean. Collect a favorite color with `prompt()`, store the response in `userColor`, and use the value in two outputs: a `printToScreen()` sentence and an `alert()`. Check that the variable name, stored value, and printed message all match.

## Check-In #1: Mathematical Operators and Randomness

Generate a random number from 1 through 256, convert it into an integer, then apply several arithmetic operations to that value. Print the original integer, the value plus 5, the value multiplied by 10, and at least one remainder calculation. The finished code makes the order of operations and rounding step easy to inspect.

## Check-In #1: Loops

Compare a `for` loop and a `while` loop by using both to print the even numbers from 0 through 20. Then use a loop to generate six random integers from 0 through 10 and keep a running sum. Verify the loop count, update step, and final total by printing enough intermediate information to catch off-by-one mistakes.

## Check-In #1: Conditionals

Review `if`, `else if`, and `else` branches. Write a program that asks for a number; if the number is less than or equal to 50, print a success message, otherwise print a sorry message. Create booleans for reading and chores; if both are true, print that going outside is allowed, otherwise print that it is not. Then update the condition to allow going outside if either value is true using `||`.

## Check-In #1: Drawing in JavaScript

Create a 500-by-500 SVG and draw two aligned shapes: a green square at `x=100`, `y=120`, `width=200`, `height=200`, and a blue circle centered inside the square with radius 50. Use the square's position and size to reason about the circle's center point instead of guessing coordinates.

## Check-In #1: Nested Loops

Use nested loops to print a shrinking star pattern: four stars, then three, then two, then one. Build the pattern once with nested `for` loops and again with nested `while` loops. The outer loop controls the row and the inner loop controls how many stars appear in that row.

## Workspace

Edit the six named functions in script.js. The provided output helper and exercise control are shared. Export the complete project and open index.html in a browser without a server; select an exercise and press Run. Keep styles.css and vendor/d3.min.js with the page. Save and reopen the same project between the two task cards.

## Boundary checks

For randomness, check both ends of each inclusive interval. For prompted numbers, distinguish Cancel, empty text and a non-finite value from valid zero. Compare 50 with 51. The drawing keeps a 500-by-500 coordinate system while fitting the available page width. Each nested-loop version prints four, three, two and one stars.
