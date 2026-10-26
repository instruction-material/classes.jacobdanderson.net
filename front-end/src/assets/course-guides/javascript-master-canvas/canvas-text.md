# Writing Text on the Canvas

## Files and canvas setup

Open `index.html` in a browser without a server. `README.md` contains this reading; drawing code belongs in `script.js`. Save that file and refresh the browser after a change. The starter supplies a canvas and its 2D context, leaving the drawing work unfinished.

`document.getElementById("my-canvas")` selects the canvas element. Its `width` and `height` attributes set the drawing coordinate system. `canvas.getContext("2d")` supplies drawing methods. The origin `(0, 0)` is the upper-left corner: x increases to the right and y increases downward. The stylesheet scales the completed bitmap to the available page width while retaining its proportions. Setting a canvas dimension again clears its pixels and resets context settings, so set dimensions before drawing.

Make a holiday card using both shapes and text. Choose a holiday and a matching message, then plan a background, illustration and readable text. The original reference is a Valentine's Day card with a red heart on pink.

## Text and drawing order

The reference uses an 800 by 800 canvas. A pink rectangle at `(50, 0)` with width 600 and height 400 forms the card. Shapes drawn later appear over earlier pixels, so draw the background before the illustration and message.

Build the heart from two red circles centered at `(305, 100)` and `(395, 100)`, each with radius 55, and a polygon pointing down to `(350, 270)`. Start independent paths with `beginPath`, then use `arc`, `moveTo`, `lineTo`, and `fill` to combine the rounded top and pointed bottom. Draw one component at a time to inspect its position.

Set `ctx.font = "40px Georgia"` before adding the message. With `ctx.textAlign = "center"`, `ctx.fillText("Happy Valentine's Day!", 350, 350)` centers the text around x 350. The y-coordinate is the text baseline, not the top of its letters. `fillStyle` also controls text color. The local reference uses dark red text on pink so the message remains readable; changing the fill color after drawing a shape does not recolor pixels already drawn.

## Build and check

1. Sketch the card's layout and choose its message.
2. Draw a background and at least one themed illustration.
3. Add the message after setting its font, color and alignment.
4. Refresh at a narrow width. Adjust font size, wording or placement if the text does not fit its card.

Canvas text becomes pixels and is not ordinary selectable HTML text. Put the message and a brief description in `drawingDescription` in `script.js`; the page presents it below the canvas and associates it with the image for assistive technology. Keep that description accurate when changing the card. Saving and reopening the source must retain the chosen message, colors and illustration. If drawing the card again without resetting its dimensions, clear the old pixels before redrawing to avoid overlapping messages.
