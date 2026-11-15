# Animated Starfield

Open index.html without a server. Edit script.js and reload the page.

Create a black field of one hundred white stars. Each object stores x, y, size and downward velocity. Sizes range from one to four pixels; velocities range from fifteen to thirty pixels per second. The original CodePen uses Babel, but this implementation uses ordinary browser JavaScript and needs no compiler or external scripts. Open index.html without a server.

Complete stepGame and resizeStars in script.js. At thirty simulation ticks per second, a star moves velocity divided by thirty pixels per tick. When its y coordinate exceeds the field height, replace that entry with a new star at y=0. Preserve the array length. On resize, scale existing positions by new width/old width and new height/old height before storing the new dimensions. A single animation loop draws the black background and then the white squares.

In CASES.md, trace a star with velocity=30 from y=10 to y=11 after one tick. A star that moves past the bottom returns to the top without increasing density. Resize the window and confirm that all stars remain within the new field. Restart creates a fresh field without adding another loop.

The reference completes both functions and supplies a comparison after the starter attempt.
