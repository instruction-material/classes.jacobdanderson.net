# Rainbow Sections

Build three groups of seven colored blocks, in this order: red, orange, yellow, green, blue, indigo, and purple. The supplied reference has 21 blocks in total. Compare seven `card-panel` divs inside a `container`, seven `section` divs inside a second `container`, and seven `section` divs that span the page outside either container. Keep the groups separate so their width and spacing can be compared.

Load the included `vendor/materialize.min.css` before `styles.css`. This is Materialize 1.0.0, matching the original project. A class is an HTML attribute: `<div class="section red">Red</div>` combines the section's vertical padding with a red background. Multiple classes are separated by spaces. A `container` limits the content width and centers it; it does not add a visible border. A `card-panel` adds padding, margin, and a shadow. A `section` adds vertical padding without the card's elevation.

Give the page one `h1` and each comparison an `h2`. Name each color in text as well as showing its background. Choose readable foreground colors: dark text on light colors and white text on indigo or purple. Keep the seven outside sections outside the containers so they actually reach the viewport edges. The imported starter intentionally leaves these groups unfinished.

Run the page at narrow and wide widths and at 200% zoom. Confirm all three seven-color groups remain in order, the containers narrow the first two groups, and the last group fills the available width. Use the inspector to compare padding, margin, width, and shadow. These static components need CSS only; jQuery and Materialize JavaScript are not required.

Open index.html in a browser; keep every companion file when exporting.

Original source: https://codepen.io/junilearning/pen/ed06d5371daf7472425bea1c7e65e4bf
