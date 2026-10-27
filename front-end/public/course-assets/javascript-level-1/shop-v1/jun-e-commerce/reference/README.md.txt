# Jun-E-Commerce

Build a responsive catalog with four featured photographs, six product cards, prices, and a Materialize carousel. This is an optional Master Project example. The captured reference supplied the carousel and card layout. The working local cart is an authored correction of its inactive Add to Cart links.

## Select a role

The starter is an authored companion with an unfinished main region, local libraries, photographs, and source comments. Only a completed reference was captured for this supplemental example. The separate reference adapts that source; `SOURCES.md` records its exact panel hashes, original image URLs, and corrections.

Confirm the selected import in the site IDE. Edit index.html, styles.css, and script.js, with `README.md` as the project brief. Export the ZIP, extract every file, and open index.html in a browser. Both roles work without a server, package installation, or network connection. Documentation and original-source links need a connection.

## Structure the catalog

Use the carousel to introduce featured products and the Shop section to present the full catalog. A call-to-action gives the next step a clear destination or result: the centered photograph links to Shop, and each Add to cart button changes that product's quantity. Keep these actions distinct from the controls that only move between photographs.

Use one h1 for the catalog name, an h2 for Shop, and an h3 for each product. Keep every product's image, name, price, and Add to cart control together. The reference retains all ten original photographs and all six numerical sample prices. Two original labels did not match their photographs: the console is a PS one, and the Jio device is a portable Wi-Fi hotspot. The reference corrects those labels and removes unsupported marketing qualifiers. Prices are example data, not current offers.

The Materialize grid uses col s12 m6 l4: one card per row on small screens, two on medium screens, and three on large screens. Keep the same information in the same order on every card. Place the price in readable card content rather than over a photograph. Preserve meaningful image alternative text and visible keyboard focus.

The SVG companions embed the unchanged JPEG bytes from the original Unsplash URLs. Keep the images directory and `LICENSE-Images.md` with the export. The original unused D3 and icon-font declarations are omitted; this project uses neither.

## Connect the carousel

Load vendor/materialize.min.css before styles.css. Load vendor/materialize.min.js before script.js at the end of the document. Initialize M.Carousel with fullWidth and indicators enabled. The onCycleTo callback updates the selected-photo status and makes only the active photo link available to the keyboard and screen reader. The original indicator dots remain visual navigation; Previous photo and Next photo provide explicit keyboard controls.

There is no automatic carousel playback. With reduced motion, its duration is zero. An in-place preference change updates that duration without creating duplicate component instances. Before JavaScript runs, all four featured photos remain readable in a static layout. The centered photo link leads to the actual Shop heading.

## Make the cart actions work

Each product has a stable data-product identifier and an integer data-price-cents value. Store quantities in a Map keyed by product identifier. Add to cart increments the selected quantity; Remove one decrements it and removes an entry when its quantity reaches zero. Compute each line and the total in integer cents, then format them as USD for display. Do not add formatted price strings together.

Read the reference in this order: build the product lookup, create the quantity map, render the cart from that state, attach the Add handlers, and then handle Remove actions through the cart list. The list is rebuilt with createElement and textContent. After rebuilding it, restore keyboard focus to a remaining Remove control or to the Cart summary. A status region announces changes without adding repeated visible notices.

The cart is page memory. Reloading resets it; saving the course project preserves source files. This exercise does not collect contact information or send orders or payments. With JavaScript disabled, the catalog remains readable and its cart buttons are disabled.

## Build and check

Complete the starter in stages: semantic catalog content, responsive cards, the carousel, and then the cart state and handlers. Predict each state change before running it. Keep original image sources and license references with adaptations.

Test a narrow screen and a desktop width, 200% zoom, all ten image placements, and the absence of horizontal scrolling. Use the keyboard to move through all four photos, follow the photo link to Shop, add repeated and different products, open Cart, remove quantities, and return to the empty state. Confirm six single items total $850.00 using the supplied example prices. Test reduced motion, an in-place preference change, and a page load with JavaScript disabled.

Save visible HTML, CSS, and JavaScript edits. Reopen the same attempt, preserve earlier work, export every file, and inspect the extracted page outside the IDE. Record expected and observed behavior. If an image or library is missing, check the relative paths and confirm the whole ZIP was extracted.

## Documentation

- Carousel: https://materializecss.com/carousel.html
- Grid: https://materializecss.com/grid.html
- Cards: https://materializecss.com/cards.html
- Map: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
- Currency formatting: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
