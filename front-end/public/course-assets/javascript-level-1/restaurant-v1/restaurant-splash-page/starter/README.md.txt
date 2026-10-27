# Restaurant Splash Page

Create a responsive restaurant page with two Materialize parallax sections, an introduction, five alternating horizontal menu cards, and a contact footer. This is an optional Master Project example, not an additional core requirement. Its HTML, CSS, images, and JavaScript can also be used as a design reference for another subject.

## Select a role

The starter is an authored companion for this course. It supplies a valid HTML document, an unfinished main region, local libraries, images, and source comments. No original starter was available for this supplemental example. The separate reference adapts the captured restaurant solution and retains its two parallax sections, five menu items, alternating card layouts, and sample prices. Its restaurant and contact details are fictional examples.

Confirm the selected import in the site IDE, or export its ZIP and extract every file. Open index.html directly in a browser. Both roles include all images, Materialize 1.0.0, its license, `README.md`, and `SOURCES.md`. They work without a server, package installation, or network connection; source and documentation links need a connection.

## Structure the content

Plan the phone reading order before adding effects. Use one h1 for the restaurant name, a main region, h2 headings for the introduction and menu, and h3 headings for the individual dishes. Keep dish names, descriptions, and prices visible together. The reference retains Enchiladas, Burrito, Tacos, Torta, and Sopa from the original example.

A Materialize row contains columns. The class combination col s12 m8 uses all twelve grid units on a small screen and eight on a medium or larger screen. Alternate the wider-screen card rows with a right-aligned column, and alternate which side holds the card image. A horizontal card contains card-image and card-stacked; the latter holds card-content. At narrow widths the reference stacks each card's image above its text so long names do not squeeze the description or price.

Add two parallax-container elements at different points in the page. Each contains a parallax element with an image. Use meaningful alternative text for menu photographs and empty alternative text for repeated decorative backgrounds. The supplied SVG files embed the actual licensed photo bytes; they do not request remote images. `SOURCES.md` records the original images, credits, licenses, and adaptations.

## Connect the library

Load vendor/materialize.min.css before styles.css. Load vendor/materialize.min.js before script.js at the end of the document so the elements and global M object exist before initialization. Materialize 1.0.0 does not require jQuery for this component; the original unused jQuery dependency is omitted.

Initialize the two selected elements with M.Parallax.init(document.querySelectorAll(".parallax"), { responsiveThreshold: 600 }). The responsiveThreshold option sets the minimum viewport width for the effect. The original edge option belongs to a different component and is not used here.

The reference enables the effect above 600 CSS pixels when reduced motion is off. Its normal CSS supplies visible, static background images before JavaScript runs. At phone widths and with reduced motion enabled, images stay static while all content remains visible. A change to the motion preference or a resize updates the behavior and destroys obsolete component instances before creating replacements.

Read script.js in that order: inspect the motion preference and viewport, destroy any existing instances, update the document's motion state, and initialize only when the effect is appropriate. The image should move relative to its container during a normal desktop scroll. A screenshot alone does not prove parallax behavior.

If an image is missing, check the relative images/ path and confirm the whole export was extracted. If M is undefined, check library order and the vendor/ files. If desktop parallax does not run, check the viewport, reduced-motion preference, browser console, and component initialization. A static image at phone width or with reduced motion is expected.

## Build and check

Complete the starter in small steps: semantic content, the two image regions, the five menu cards, responsive CSS, and then the parallax initialization. Predict each layout or scroll change before testing it. Retain image credits and licenses when adapting the page.

Check phone and desktop widths, 200% zoom, long dish names, all seven image placements, and the absence of horizontal scrolling. Follow the Menu link with the keyboard and confirm it reaches the visible menu heading. Test desktop scrolling with normal motion, then reduced motion and an in-place preference change. Verify the page still reads correctly with JavaScript disabled.

Save a visible HTML, CSS, and JavaScript change in the IDE. Reopen the same attempt, confirm earlier work remains, export all files, and test the extracted page outside the IDE. Record expected and observed behavior. The displayed menu prices and reserved contact details are teaching data, not current offers or a real ordering service.

## Documentation

- Materialize grid: https://materializecss.com/grid.html
- Cards: https://materializecss.com/cards.html
- Parallax: https://materializecss.com/parallax.html
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
