# The Responsive Grid

Build the original Responsive Grid project with the supplied Materialize 1.0.0 CSS and Material Icons 3.0.1 font. A Materialize row contains columns whose widths are fractions of a 12-column grid. `col s4 m2 l1` means 4/12 of the row on small screens, 2/12 on medium screens, and 1/12 on large screens. In this version, medium begins at 601px and large at 993px; narrower rules continue to apply until a wider rule overrides them.

First create 12 numbered cards in their original order. At large widths they form one row of 12; at medium widths they form two rows of six; at small widths they form four rows of three. Then create six information cards with `col s12 m6 l4`: three columns on large screens, two on medium screens, and one on small screens. A `row` clears the floated columns; a `container` sets a centered maximum width.

The six original icon names are favorite_border, code, language, functions, http, and share. Load `vendor/material-icons.css` and put a name inside an element with class `material-icons`; mark decorative glyphs `aria-hidden="true"` and keep the readable caption beside them. Use captions about learning, coding, remote study, mathematics, websites, and sharing. The bundled font renders without a font service.

The starter intentionally leaves both sets unfinished. Test the 600/601px and 992/993px boundaries as well as phone and desktop widths. Count all 12 numbered cards and all six information cards, verify row counts and source order, inspect a loaded icon glyph, and check readable contrast and wrapping at 200% zoom.

Open index.html in a browser without a server. Keep every companion file when exporting.

Original source: https://codepen.io/junilearning/pen/9efdb71bcb845f3d9c01b14f0fd1e32e
