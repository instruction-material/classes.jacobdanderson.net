# Same-Shape Board

Build the original checkpoint's 3 by 3 board: each of its nine cells randomly
contains a green circle or a red square. Keep generating and drawing boards
until all nine shapes have the same type. The page supplies Start, Stop,
one-board controls and a readable record of the current board.

Open index.html without a server. Complete createBoard(random),
boardComplete(board) and drawBoard(context,board) in board.js. The interface
code in script.js is supplied so this task focuses on arrays, objects,
drawing and the completion condition.

## Generate and draw

createBoard returns an array of nine shape objects in column-major order.
Use two loops from 0 through 2. For a circle in column i and row j, set
type "circle", `x=i*50+20`, `y=j*50+20`, radius 20 and color "green".
For a square, set type "square", `x=i*50`, `y=j*50`, length 40 and color "red".
Choose each type independently with `Math.floor(random()*2)`. A supplied
random function returning 0 should make nine circles; 0.75 should make nine
squares. Alternating 0 and 0.75 should make a mixed board.

drawBoard clears the 500 by 500 canvas before looping through the array.
Use fillRect for squares and beginPath, arc and fill for circles. Drawing
must read each object's stored properties rather than generating new random
values: the text list and the canvas then describe the same board.
The visible canvas scales to a narrow screen while its buffer remains 500
by 500. Compare two successive one-board drawings for leftover shapes.

## Decide when to stop

boardComplete returns true only for exactly nine valid shapes of one type.
Nine circles and nine squares are complete; a mixed array, an empty array,
a partial board and an unknown type are incomplete. Compare every shape's
type with the first after checking the length and valid types.

Start draws one board per animation frame and stops as soon as the current
board is complete. The supplied controller also stops after 2,000 attempts;
it reports the limit instead of claiming a match. Randomness has no finite
guarantee of a matching board. Stop cancels the pending frame. Starting again
creates a fresh bounded attempt, and showing one board cancels any animation.
Leaving or hiding the page also stops it. Keep the board state locally declared.

## Completion

Retain the three fixed generated boards, expected and observed completion
values, a screenshot or text record of a match, and a stopped mixed run.
Confirm that no extra frame runs after Stop or a match, that a second Start
resets the attempt counter, and that reaching the limit reports the limit.
Keep the array and text results available even when canvas is unavailable.
Explain why a redraw clears the old image, why an empty array is not a full
board, and why a bounded random run may finish without a match.

Reference: compare after a recorded attempt.
