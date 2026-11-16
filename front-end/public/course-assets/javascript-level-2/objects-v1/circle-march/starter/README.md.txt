# Circle March

Create an array of circle objects and animate every object diagonally. Each object stores x, y, radius and color. Keep the learner attempt separate from the worked reference.

## Files and setup

The local index.html document connects the original panels in styles.css and script.js. viewport.css adapts the display to the available width; the original reference canvas retains its 500 by 200 drawing resolution. No library or preprocessor is used. Open index.html in a browser to run the exported project without a server.

The original learner HTML and CSS panels are empty. Add a canvas with id canvas and width 500, height 200 inside the document's main element. In script.js, obtain that element and its 2D context before drawing. The retained starter comment is followed by the learner's implementation.

## Build and check

Create the circle array, draw each filled circle from its properties, and use one requestAnimationFrame chain. Clear the previous frame, update both coordinates, apply the separate horizontal and vertical wrap conditions, and draw every circle.

The worked reference uses 25 columns and 10 rows at 20-pixel intervals, radius 5, and one random RGB color per circle. A frame adds 1 to each coordinate. An x value greater than 500 subtracts 500; a y value greater than 200 subtracts 200. The reference stores four properties and uses fixed increments.

Predict the first and last grid positions before opening the reference. In an independent attempt, explain one update and one wrap before running. A guided review pauses at the canvas setup, array construction, first frame and first wrap. Save, reopen and export each role independently. CASES.md supplies the complete worked checks.
