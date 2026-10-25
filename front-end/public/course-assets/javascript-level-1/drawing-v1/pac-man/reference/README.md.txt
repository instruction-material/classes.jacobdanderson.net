# Pac-Man

Draw two yellow Pac-Men facing each other with D3 arcs. Use innerRadius 0 and outerRadius 100. The reference uses angles 120 and 430 degrees for one character and their negatives for the other, translated to (150,110) and (400,110). Change the angles to test wider and narrower mouths.

## Canvas

The SVG `viewBox` sets its coordinate area. CSS scales the drawing to the screen without changing coordinates. Use `.attr("viewBox", "0 0 500 500")` after setting the SVG width and height.

## Run

Open index.html in a browser. D3 and its license are included locally, so the export runs offline.

## Source

Adapted from [Juni Learning’s original reference project](https://codepen.io/junilearning/pen/6df064875eb631bc08eab5c342ef98f7).
