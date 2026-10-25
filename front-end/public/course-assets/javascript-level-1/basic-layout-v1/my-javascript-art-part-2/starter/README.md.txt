# My JavaScript Art Part II

Extend the three-piece JavaScript art gallery with a snowman and organize all four pieces using Materialize sections. Give the page one `h1`; Rainbow, Captain America Shield, Pac-Man, and Snowman each need an `h2`, a short description of the code, and their own container. The independently authored starter continues the supplied three-piece gallery and leaves the snowman unfinished. The original linked Part II material is a complete reference.

Load the included Materialize 1.0.0 CSS, D3 5.16.0, and then `script.js`. D3's `select` chooses a container, `append` creates an SVG element or shape, and `attr` assigns an attribute. Create the snowman's SVG inside `#snowman` with a 300 by 500 coordinate area. Give it a `viewBox` and let CSS scale its width to fit the screen.

The reference snowman has a white head centered at (150,50), radius 50; black eyes at (125,35) and (175,35), radius 5; an orange nose at (150,50), radius 5; a white middle at (150,160), radius 70; and a white lower body at (150,300), radius 100. Two brown lines form arms from (200,160) to (300,145) and (100,160) to (0,145). The smile is a black arc with inner radius 10, outer radius 15, angles 90 to 270 degrees, translated to (150,70). Convert degrees with `degrees * Math.PI / 180` before passing them to `d3.arc()`. Draw later shapes above earlier ones and keep the snowman's background dark enough to see white circles.

Preserve the earlier seven-arc rainbow, four-circle shield with a star, and two Pac-Man arcs. Label each SVG with its description. For `prefers-reduced-motion: reduce`, show the rainbow's final state immediately; otherwise retain its staggered reveal. Check all four complete drawings, their descriptions, narrow-screen scaling, reduced motion, and one visible saved code change before exporting the complete project.

Open index.html in a browser; keep every companion file when exporting.

Authored continuation starter based on the earlier three-piece gallery; the original Part II link supplies a complete reference only.
Original Part II reference: https://codepen.io/junilearning/pen/68f7db60fabe38f5ff48cf4cfa631a4c
