# Shining Stars

## Files and canvas setup

Open `index.html` in a browser without a server. `README.md` contains this reading; drawing code belongs in `script.js`. Save that file and refresh the browser after a change. The starter supplies a canvas and its 2D context, leaving the drawing work unfinished.

`document.getElementById("my-canvas")` selects the canvas element. Its `width` and `height` attributes set the drawing coordinate system. `canvas.getContext("2d")` supplies drawing methods. The origin `(0, 0)` is the upper-left corner: x increases to the right and y increases downward. The stylesheet scales the completed bitmap to the available page width while retaining its proportions. Setting a canvas dimension again clears its pixels and resets context settings, so set dimensions before drawing.

Draw one gold star, turn its path into `drawStar(x, y)`, then draw five stars by calling that function from a loop.

## Relative coordinates

The function's `(x, y)` arguments identify the star's top point. Begin a new path, then visit `(x, y)`, `(x + 50, y + 150)`, `(x - 75, y + 50)`, `(x + 75, y + 50)`, `(x - 50, y + 150)`, and finally `(x, y)`. Fill the path gold. These offsets preserve the star's shape when its anchor moves. A thin dark outline makes the boundary easier to see against white.

Every call must begin a new path. Otherwise a later fill or outline can include segments from the previous star. Context properties such as `fillStyle`, `strokeStyle`, and `lineWidth` persist until changed; set the properties the function needs inside it.

## Repetition and bounds

Use `for (let i = 1; i <= 5; i++)` and call `drawStar(200 * i, 100)` inside the loop. The anchors are `(200, 100)`, `(400, 100)`, `(600, 100)`, `(800, 100)` and `(1000, 100)`. The complete drawing reaches x 1075 and y 250. A 1200 by 320 logical canvas contains it, including the outline.

The drawing area stays 1200 pixels wide logically and scales through CSS. Using the phone viewport as the logical width would crop the later stars, because their coordinates still extend beyond 1000. Display scaling keeps all five in view at the same relative positions.

## Build and check

1. Construct one star using explicit path calls.
2. Move those calls into `drawStar(x, y)` and replace absolute positions with offsets.
3. Make one function call, verify its bounds, then add the five-iteration loop.
4. Change the loop's spacing or one test call's anchor and predict the new bounds before refreshing.

Count five distinct gold stars at both phone and desktop widths. Confirm that each path uses its own starting point and that no star extends beyond the logical canvas. Keep the canvas description consistent with the count and arrangement. An optional extension adds a color parameter without duplicating the path code.
