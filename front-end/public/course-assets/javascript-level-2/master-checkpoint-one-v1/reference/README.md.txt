# Check-In 1: Functions, Arrays, Objects and Canvas

Continue the same local project through the three checkpoint tasks. Open
index.html in a browser without a server. The page controls and result areas
are supplied; complete the functions in functions.js, arrays.js and objects.js.
The starter reports unfinished tasks until those functions return useful values.
Keep your completed files when continuing to the next task.

## Functions and complex conditionals

Implement rollDie() to return one integer from 1 through 6 on every call.
Math.random() includes 0 and excludes 1: multiplying by 6, taking Math.floor,
then adding 1 gives the required range. The optional random parameter lets a
fixed input be checked without waiting for a rare random event. Check inputs
0 and 0.999999: the results must be 1 and 6. Math.ceil(random * 6) would give
0 at the first boundary.

Implement playJackpot(a,b) with a ternary expression: return "Jackpot!" when
a+b is at least 10; otherwise return "Better luck next time!". For (4,5),
(4,6) and (6,6), check the messages for sums 9, 10 and 12. Implement sum(a,b)
to return the sum, and isOdd(number) to return a boolean. Check sum(2,3)=5,
isOdd(3)=true, isOdd(2)=false, isOdd(0)=false and isOdd(-3)=true.

Run Functions. The supplied runner calls rollDie 100 times and displays all
100 values plus the number of sixes. A random count is not a fixed expected
answer: every displayed roll must be an integer from 1 through 6 and the
count must equal a manual count of sixes in that same list. The page also
shows a jackpot result from two new rolls, the sum result and oddness checks.

## Arrays

Implement createDiceResults(count,random) using rollDie to generate count
rolls. Use count=20 in the page. Implement countEvenRolls(values) to return
the number divisible by two, and doubleResults(values) to return a new array
with twice each corresponding value. Preserve the original array.

Run Arrays. Display the original twenty values, the tenth element at index 9,
the even count and the doubled array. Compare the tenth displayed value with
the reported value. For fixed [1,2,3,4,5,6], the even count is 3 and the doubled
array is [2,4,6,8,10,12]; the input still contains [1,2,3,4,5,6].
Empty input produces zero even values and a new empty doubled array.
An even count may range from 0 through 20 for twenty die rolls.

## Objects and canvas

Implement createCar() with make "Toyota", model "Corolla", year 1999,
color "red" and damaged true. Read its year through the object property.

Implement createCards(random) to return four card objects. Each stores text
as an integer from 1 through 100, x=50, width=200, height=100, a color and a y
value of 0, 150, 300 or 450. The canvas has a 1200 by 1200 drawing buffer;
CSS scales its display while retaining those coordinates. Using height as
the property name makes the rectangle's vertical dimension explicit.

Implement drawCards(context,cards) to clear the old drawing, loop over the
objects and draw their rectangles and centered number labels. Run Cards.
All four labels must match the adjacent text list. Change one card's position
or color in its object data and rerun; the rendering loop should stay the
same. Repeated runs replace the prior drawing. The supplied text list keeps
card data available when canvas drawing is unavailable.

## Completion

Keep the three task files, a result from every Run control, the fixed boundary
checks, and one changed input with its predicted and observed result. Explain
the difference between returning a value and printing it, why the tenth array
element uses index 9, and how an object's coordinates control its rectangle.
Use the reference after an attempt to compare the relevant functions.

Reference: compare after a recorded attempt.
