# Snowman

Draw a snowman with three white body circles on a black background. Add eyes, a nose, an arc mouth and two brown line arms. Use the same x center for the body circles; SVG y coordinates increase downward. A line needs x1/y1/x2/y2 and a visible stroke color. Keep each body, face and arm section separate.

## Canvas

The SVG `viewBox` sets its coordinate area. CSS scales the drawing to the screen without changing coordinates. Use `.attr("viewBox", "0 0 750 750")` after setting the SVG width and height.

## Run

Open index.html in a browser. D3 and its license are included locally, so the export runs offline.

## Source

Adapted from [Juni Learning’s original starter project](https://codepen.io/junilearning/pen/GRoOjjx).
