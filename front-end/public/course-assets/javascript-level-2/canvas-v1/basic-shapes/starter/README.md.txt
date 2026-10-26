# Basic Shapes

## Files and canvas setup

Open `index.html` in a browser without a server. `README.md` contains this reading; drawing code belongs in `script.js`. Save that file and refresh the browser after a change. The starter supplies a canvas and its 2D context, leaving the drawing work unfinished.

`document.getElementById("my-canvas")` selects the canvas element. Its `width` and `height` attributes set the drawing coordinate system. `canvas.getContext("2d")` supplies drawing methods. The origin `(0, 0)` is the upper-left corner: x increases to the right and y increases downward. The stylesheet scales the completed bitmap to the available page width while retaining its proportions. Setting a canvas dimension again clears its pixels and resets context settings, so set dimensions before drawing.

Draw the original three shapes: a red square, a blue circle, and a green triangle. Predict their positions before changing the code.

## Shape construction

Use a 1000 by 500 drawing area. Set `ctx.fillStyle` before filling a shape. `ctx.fillRect(100, 100, 100, 100)` draws a square whose upper-left corner is `(100, 100)` and whose width and height are 100. The reference uses `rgba(255,0,0,0.5)`: red with half opacity, so the white page remains visible through it.

A circle is a path. Call `ctx.beginPath()` to start a fresh path, then `ctx.arc(300, 150, 50, 0, degreesToRadians(360))`. These arguments are the center x, center y, radius, starting angle and ending angle. The supplied helper returns `degrees * Math.PI / 180`, because canvas angles use radians. Set the fill color to blue and call `ctx.fill()`.

Start another path for the triangle. Move to `(500, 200)`, draw lines to `(400, 200)` and `(500, 100)`, then close the path and fill it green. `moveTo` positions the pen without drawing; `lineTo` adds a segment; `closePath` joins the last point to the first. Starting each independent shape with `beginPath` keeps a later fill from recoloring an earlier path.

## Build and check

1. Draw the square and verify that its center is `(150, 150)`.
2. Add the circle. Its bounds are x 250 through 350 and y 100 through 200.
3. Add the triangle. It fits in the rectangle from `(400, 100)` to `(500, 200)`.
4. Change one position or color, refresh, and explain which drawing call changed the result.

The three shapes must all remain visible at phone and desktop widths. CSS display scaling changes their apparent size together, rather than changing the logical coordinates. Update the description below the canvas when changing the drawing so it also describes the new result. To clear an existing drawing before redrawing, use `ctx.clearRect(0, 0, canvas.width, canvas.height)`.
