# My JavaScript Art

Present three D3 drawings or animations from earlier modules on one page. Give the gallery one `h1`, then give each artwork an `h2`, a short description of its JavaScript or SVG concept, and a separate container with a unique id. A title identifies a piece; its description explains what the code demonstrates. Adapt the original drawing code to select the appropriate container instead of appending every SVG to `body`.

This pack includes D3 5.16.0, matching the original gallery. Load `vendor/d3.min.js` before `script.js`. Define a separate SVG selection for each artwork so changes to one drawing do not target another. The reference uses `#rainbow`, `#shield`, and `#pacman`. Keep shared variable names distinct, or place each drawing in its own function. An SVG `viewBox="0 0 width height"` establishes drawing coordinates; CSS `max-width: 100%; height: auto` scales that drawing to the available page width.

The reference draws seven rainbow arcs, a shield of four circles and one star, and two Pac-Man arcs. An arc uses radians: multiply degrees by `Math.PI / 180`. Its inner radius sets the hole and its outer radius sets the outside edge. Keep the original positions and sizes while making the surrounding page responsive. Use the drawing's description as an accessible label for its SVG.

For motion preferences, `matchMedia("(prefers-reduced-motion: reduce)").matches` reports whether reduced motion is requested. Show the final rainbow immediately for that preference; otherwise retain the original staggered reveal. Verify all three complete drawings, their descriptions, and one visible code change at both narrow and wide widths.

Open `index.html` directly in a browser without a server. Edit `index.html` and `styles.css` and `script.js`, then refresh the browser. The site IDE retains edits and exports all companion files.

Source: Juni Learning, JSS11 Project 3: My JavaScript Art
https://codepen.io/junilearning/pen/b252c1398d97eda534482419d9103b87
