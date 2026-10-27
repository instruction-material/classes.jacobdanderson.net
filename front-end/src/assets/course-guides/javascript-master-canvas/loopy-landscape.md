# Loopy Landscape

## Files and canvas setup

Open `index.html` in a browser without a server. `README.md` contains this reading; drawing code belongs in `script.js`. Save that file and refresh the browser after a change. The starter supplies a canvas and its 2D context, leaving the drawing work unfinished.

`document.getElementById("my-canvas")` selects the canvas element. Its `width` and `height` attributes set the drawing coordinate system. `canvas.getContext("2d")` supplies drawing methods. The origin `(0, 0)` is the upper-left corner: x increases to the right and y increases downward. The stylesheet scales the completed bitmap to the available page width while retaining its proportions. Setting a canvas dimension again clears its pixels and resets context settings, so set dimensions before drawing.

Create a landscape containing repeated trees, a sun and distinct sky and ground areas. Use a helper function and a loop so repeated shapes come from shared drawing code. Additional landscape elements can be added after that scene works.

## Layers and a reusable tree

Use an 800 by 800 canvas. Draw the sky first with `fillRect(0, 0, 800, 500)`, then the ground with `fillRect(0, 500, 800, 300)`. Their shared edge is the horizon at y 500. Choose separate fill colors before each rectangle.

Define `drawTree(x, y)` using the original triangular crown. Start a path at `(x, y)`, draw to `(x + 50, y - 400)` and `(x + 100, y)`, close it, and fill green. A brown rectangle at `(x + 40, y - 50)` with width 20 and height 250 forms the trunk. All coordinates are offsets from the function's anchor; moving the anchor moves the complete tree.

Call the function in a loop with `i` taking 0, 1 and 2. Use x `10 + 100 * i`; choose y 550 for the middle tree and 600 for the other two. The expression `i === 1 ? 550 : 600` selects those heights. This reproduces the reference's three tree positions while keeping the repeated calls in one loop.

Add the sun as a yellow circle centered at `(600, 200)` with radius 100. Start a fresh path before its arc so filling the sun does not also fill tree paths. Draw order matters whenever two elements overlap; changing colors later only affects subsequent drawing operations.

## Build and check

1. Draw the sky and ground and verify the horizon position.
2. Draw one tree, then move its code into the helper.
3. Use the loop to draw all three positions and inspect their crowns and trunks.
4. Draw the sun, then make one deliberate landscape change and explain the layer order it needs.

The original tree trunks end at y 800 for the two lower trees, so increasing their anchor y would crop them unless the design or canvas changed. Check bounds before adding more trees. Verify the complete scene at narrow and wide widths and update `drawingDescription` to match any added elements. A river or clouds are optional extensions, rather than prerequisites for the three-tree scene.
