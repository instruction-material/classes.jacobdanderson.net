# Drawing Shapes

Append a green rectangle, a blue circle and a red ellipse to an SVG. Set rectangles with x/y/width/height, circles with cx/cy/r, and ellipses with cx/cy/rx/ry. Change one coordinate or size at a time and predict the result.

## Canvas

The SVG `viewBox` sets its coordinate area. CSS scales the drawing to the screen without changing coordinates. Use `.attr("viewBox", "0 0 400 200")` after setting the SVG width and height.

## Run

Open index.html in a browser. D3 and its license are included locally, so the export runs offline.

## Source

Adapted from [Juni Learning’s original reference project](https://codepen.io/junilearning/pen/7ba2616cfb21c6a3fbf71ee0cfb78332).
