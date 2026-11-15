# 2D Breakout

Open index.html without a server. Edit script.js and reload the page.

The 480-by-320 canvas contains fifteen bricks, a radius-10 ball, a 75-by-10 paddle and three lives. The ball starts at (240,290), moving (2,-2) per simulation tick. A new life resets its motion to (3,-3), preserving the original reference's rule. Arrow keys move the paddle seven pixels per tick; pointer movement maps the displayed canvas position into its logical coordinates. The paddle remains wholly inside the canvas.

Complete circleTouchesRectangle and stepGame in script.js. Compare the ball's radius with a brick's nearest point, mark a hit brick inactive, increase score once and reverse the collision axis. A downward crossing of the paddle top reflects the ball upward. Crossing completely below the canvas costs exactly one life. Reset the ball when lives remain; otherwise enter lost. Removing the fifteenth brick enters won. Both terminal states freeze the model until Restart, with a message on the canvas and in the status line.

Use the CASES.md boundary checks: a ball can touch a brick before its center enters it; a miss costs one life, not one per later frame. Compare the saved reference after completing the starter. Hold a direction control or use the pointer to play; observe all three lives and restart without browser alerts.

The starter keeps the supplied renderer and input wiring; complete its two TODO functions.
