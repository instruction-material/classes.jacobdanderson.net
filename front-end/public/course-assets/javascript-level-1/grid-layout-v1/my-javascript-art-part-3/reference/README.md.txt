# My JavaScript Art Part III

Continue the four-piece D3 portfolio and add a fifth original drawing. The supplied starter already contains Rainbow, Captain America Shield, Pac-Man, and Snowman. It leaves the new drawing and card layout unfinished. The original linked Part III reference contains only those four earlier drawings; the local reference adds an explicitly authored Constellation example to complete the assignment.

Load Materialize 1.0.0 CSS, D3 5.16.0, and then script.js in that order. Keep the earlier drawings' geometry and add a new SVG inside `#constellation`. The example uses a 400 by 260 coordinate area, six circle centers at (45,190), (105,70), (180,130), (245,45), (300,150), and (355,85), and five connecting line segments. `selectAll(...).data(points).enter().append(...)` creates one circle per record; an SVG polyline can connect the same coordinates in order. The new drawing is an example, not an additional original CodePen drawing.

Give every SVG a `viewBox`, a responsive width, and an accessible description. Keep one page heading and a heading and description for each piece. Use a two-column card layout on wide screens and one column on phones; alternating the drawing and text on wide rows must still leave a sensible source order. Prefer a CSS grid on each card to fixed-width spacer columns.

Preserve the seven rainbow arcs, four shield circles and star, two opposite-angle Pac-Man arcs, and the snowman's circles, smile, and arms. Convert degrees with `degrees * Math.PI / 180` before passing angles to D3 arcs. Keep all drawings inside their viewBoxes. Respect `prefers-reduced-motion: reduce` by displaying the rainbow's final state immediately; the standard version can retain its staggered reveal.

Check all five drawings in the reference, the four earlier drawings and unfinished fifth area in the starter, readable descriptions, responsive cards, both motion preferences, phone widths, and 200% zoom. Save a visible drawing change and export the HTML, CSS, JavaScript, libraries, and licenses together.

Open index.html in a browser without a server. Keep every companion file when exporting.

Original source: https://codepen.io/junilearning/pen/4735eaf3e168cfb944a3daad063e287c
