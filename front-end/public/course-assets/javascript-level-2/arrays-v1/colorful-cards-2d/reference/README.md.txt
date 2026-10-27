# Colorful Cards in 2D

## Files and workflow

Open the selected starter in the site IDE after confirming its source. Read the TODOs in `script.js`, save a change, reopen the same attempt and export its complete ZIP. Extract the ZIP and open `index.html` in a browser; its scripts, styles, fonts and licenses are local. Save files and reload the browser after an edit. `README.md` contains this full reading and `SOURCES.md` identifies the original role and adaptations. The reference is available for comparison after an independent attempt.

Draw a five-row, five-column arrangement of colored cards from a two-dimensional array. Each outer element represents one row; each element inside it represents a column.

## Data shape and coordinates

Build a 5 by 5 array using green, red, blue, yellow and cyan. The reference shifts those five colors one place left in each successive row. The first row is green, red, blue, yellow, cyan; the next starts red and ends green. These are arrays of strings, not one comma-separated string.

Set up a 1000 by 1000 canvas and its 2D context. Use an outer `forEach((row, rowIndex) => ...)` and an inner `row.forEach((color, columnIndex) => ...)`. Calculate x from the column: `columnIndex * 200`. Calculate y from the row: `150 + rowIndex * 150`. Draw a rectangle 150 units wide and 100 units high at that position.

The top row starts at y 150 and the bottom row at y 750. The last column starts at x 800 and ends at x 950. Every card fits in the logical drawing area; CSS scales that complete area on a phone. Independent paths and a fill color set inside the inner callback preserve each card's color.

## Build and trace

1. Make one row and render it with the earlier Colorful Cards method.
2. Put five row arrays inside an outer array.
3. Add the outer callback and use its index only for the y coordinate.
4. Use the inner index for x and its value for the fill color.
5. Generate one line of text for each row from the same data.

There should be exactly 25 rectangles. Trace cell `twoDCards[2][3]`: it belongs to the third row and fourth column, so x is 600 and y is 450. In the supplied pattern it is green. Change that one value, refresh and confirm only that cell changes color. Swapping row and column indices would move the change to a different location, which this check detects.

The descriptions below the canvas list colors in row order and remain readable without interpreting colored pixels. If extending to different dimensions, derive loops from actual row lengths and calculate the maximum right and bottom edges before changing canvas dimensions. Keep a rectangular grid when comparing columns. Save, reopen and export a visible change; the exported HTML, data and drawing must agree. The starter includes canvas setup while leaving the array and iteration unfinished.
