# Debugging Olaf's Star

Repair the starter so a visible star appears on Olaf’s middle snowball while the rest of the drawing remains intact. Trace the star path, its position variables and its fill. Check the console and fix one fault at a time. The reference centers a yellow star at (150,210).

## Canvas

The SVG `viewBox` sets its coordinate area. CSS scales the drawing to the screen without changing coordinates. Use `.attr("viewBox", "0 0 750 750")` after setting the SVG width and height.

## Run

Open index.html in a browser. D3 and its license are included locally, so the export runs offline.

## Source

Adapted from [Juni Learning’s original reference project](https://codepen.io/junilearning/pen/20aeca54176134a3397922a9e98f3564).
