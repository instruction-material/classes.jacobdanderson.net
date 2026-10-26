# JNI Stock Price

## Files and canvas setup

Open `index.html` in a browser without a server. `README.md` contains this reading; drawing code belongs in `script.js`. Save that file and refresh the browser after a change. The starter supplies a canvas and its 2D context, leaving the drawing work unfinished.

`document.getElementById("my-canvas")` selects the canvas element. Its `width` and `height` attributes set the drawing coordinate system. `canvas.getContext("2d")` supplies drawing methods. The origin `(0, 0)` is the upper-left corner: x increases to the right and y increases downward. The stylesheet scales the completed bitmap to the available page width while retaining its proportions. Setting a canvas dimension again clears its pixels and resets context settings, so set dimensions before drawing.

Draw a labeled line graph for a practice stock called JNI. Use dates along the horizontal axis and price along the vertical axis. These are illustrative classroom values, not market observations.

## Practice data and scale

| Date | Price |
| --- | ---: |
| 1/1 | 100 |
| 1/4 | 300 |
| 1/7 | 150 |
| 1/10 | 250 |
| 1/13 | 350 |

Use an 800 by 800 canvas. The graph's left edge is x 200, right edge x 600, top y 200 and bottom y 600. Let the vertical axis cover prices 0 through 400. In this plot, one price unit is one logical pixel, so `priceToY(price)` returns `600 - price`. Larger prices must appear higher because canvas y increases downward.

Place the five dates at x 200, 300, 400, 500 and 600. The corresponding points are `(200, 500)`, `(300, 300)`, `(400, 450)`, `(500, 350)` and `(600, 250)`. These retain the original drawing's five plotted positions. The tick labels are corrected to share this same scale: price 0 at y 600, 100 at y 500, through 400 at y 200. Every date label must align with its own point.

## Build the graph

1. Draw the horizontal and vertical axes as a path, then stroke it gray.
2. Add the five price tick labels. Use a loop to change the price by 100 and its y-position by 100 each time.
3. Add the five date labels. Loop from index 0 through 4; x is `200 + 100 * index`, and the January day is `1 + 3 * index`.
4. Begin a new path, move to the first data point and connect the remaining points with `lineTo`. Stroke that path once.
5. Add the title, axis labels, and a plain HTML data table containing the same five rows.

The table keeps exact dates and values readable when the bitmap is scaled on a phone and makes the data available without interpreting its pixels. Keep both representations consistent when changing a sample. Give tick text a readable size, set its alignment before drawing, and leave room for labels around the axes.

## Check the interpretation

The line rises, falls, then rises twice; the highest value is 350 on 1/13. Explain why price 300 maps to y 300 and price 100 maps to y 500. Change one practice price and calculate its new y-position before drawing it. The y-axis labels, data table, canvas description and plotted point must agree after that change.
