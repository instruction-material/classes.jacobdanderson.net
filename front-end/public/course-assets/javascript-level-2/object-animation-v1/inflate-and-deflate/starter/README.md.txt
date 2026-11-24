# Inflate and Deflate

Open index.html with script.js beside it. The starter page is blank until you add a canvas and write the animation.

1. Add a canvas named my-canvas to index.html. In script.js obtain its 2D context and set its drawing area to 1000 by 800.
2. Store the center (300, 300), radius 20 and green color in a ball object. Write a function that draws a filled circle from those properties.
3. Keep a growing or shrinking phase. If the current radius is above 200, shrink; if it is below 10, grow. Otherwise keep the current phase. Each growing step adds 5 and sets green; each shrinking step subtracts 5 and sets red.
4. Clear, update and draw once per frame. Request the next frame exactly once. Report radius and phase as text as well. Compare both turns with the lesson, save the attempt and reopen its exported index.html with its script.
