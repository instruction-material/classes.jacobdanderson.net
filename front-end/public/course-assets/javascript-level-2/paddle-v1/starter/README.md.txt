# Paddle

Build a keyboard-controlled paddle in script.js. The starter supplies a working
canvas, paddle model and animation loop. Complete its input handlers and updatePaddle.

## Files and execution

Open index.html in a browser without a server. The site IDE uses the same local
files. styles.css fits the logical 500-by-500 canvas to the page.
Focus the canvas, then hold Left or Right. A keyboard with arrow keys is required.
CASES.md gives the expected states; SOURCES.md records the original inputs.

## Input and movement

The black paddle starts at x=0,y=0 and measures 100 by 20. Its speed is
10 logical units per animation frame, matching the original exercise's frame-based
movement. Store ArrowLeft and ArrowRight as booleans. keydown sets the matching
state; keyup clears it. Handle only those keys and prevent their default action
while the canvas is focused.

Each animation frame computes direction = Number(right) - Number(left).
Add direction * speed to x, then clamp x to [0,canvas.width-paddle.width].
Both keys held cancel; neither key held leaves x unchanged. Update first, then
clear and redraw the canvas so the displayed frame matches the current state.

Clear both states when the canvas or window loses focus and when the document
becomes hidden. A release outside the page must leave the paddle stopped.

## Worked cases and completion

From x=200, one left frame gives 190; one right frame gives 210.
The left limit is0 and the right limit is400. From 395 a right frame gives 400.
From 5 a left frame gives 0. Both keys held at 200 leave 200.
CASES.md includes held-key, release, blur and unchanged-starter checks.

Show both directions, both limits, release-to-stop and focus-loss-to-stop.
Explain why key state is read every frame instead of moving once per keydown.
The unmodified starter draws its initial paddle and remains stationary.
