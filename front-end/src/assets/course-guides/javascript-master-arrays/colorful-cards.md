# Colorful Cards

## Files and workflow

Open the selected starter in the site IDE after confirming its source. Read the TODOs in `script.js`, save a change, reopen the same attempt and export its complete ZIP. Extract the ZIP and open `index.html` in a browser; its scripts, styles, fonts and licenses are local. Save files and reload the browser after an edit. `README.md` contains this full reading and `SOURCES.md` identifies the original role and adaptations. The reference is available for comparison after an independent attempt.

Draw five colored rectangular cards in one row from an ordered array. The data should determine color and position, so adding or rearranging an element changes the drawing without copying drawing commands.

## Canvas and array

The starter supplies `<canvas id="my-canvas">`, a 1200 by 800 logical coordinate system and `ctx`, its 2D context. Coordinates begin at the upper-left corner: x increases rightward, y downward. CSS scales the entire canvas to the available width while retaining its proportions.

Create `cards` containing the five strings green, red, blue, yellow and cyan. Use `cards.forEach((color, index) => { ... })`. The first callback receives green and index 0; the fifth receives cyan and index 4. For every card, calculate x as `index * 200`, keep y at 150, and use width 150 and height 100. The five x positions are 0, 200, 400, 600 and 800, leaving a 50-unit gap between neighboring cards.

Start a path with `ctx.beginPath()`, add `ctx.rect(x, 150, 150, 100)`, set `ctx.fillStyle = color`, then call `ctx.fill()` and `ctx.closePath()`. A fresh path prevents subsequent fills from recoloring earlier rectangles. The reference retains the original positions, sizes and array order.

## Build and check

1. Draw one rectangle with known coordinates.
2. Define the color array and move the drawing calls into the callback.
3. Use the callback's index for x; do not use the color string in arithmetic.
4. Confirm five distinct cards and update the description from the same array.

The page presents the color order as text below the drawing, making the data available without distinguishing colors. When changing the array, keep that description synchronized. Rearrange two entries and verify that only their positions swap. Add a sixth entry as an extension and calculate its bounds before drawing: its right edge is 1150, still within the 1200-unit width.

Refresh after changing source. Repeated drawing from an event handler would first need `clearRect(0, 0, canvas.width, canvas.height)` to erase old pixels; assigning a canvas dimension also clears pixels and context settings. Verify the exported page at phone and desktop widths, with all five cards visible together and no horizontal page scrolling. A blank starter canvas is expected until the drawing task is implemented.
