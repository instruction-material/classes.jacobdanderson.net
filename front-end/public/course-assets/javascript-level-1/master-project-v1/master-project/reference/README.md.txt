# Master Project

Build a splash page for a business, restaurant, news publication, shop, or another chosen subject. Combine the course's HTML, CSS, responsive layout, and JavaScript skills with Materialize components. Plan about two weeks of project work; the core can be completed before optional refinements while beginning JavaScript Level 2.

## Plan the page

Identify its audience, the information they need, and one primary action. Sketch the phone layout first, then show how sections use the wider desktop space. Choose components that serve that content. The supplied reference demonstrates a responsive three-column grid, a right-side Sidenav, a Collapsible, and a Modal. A different subject can use other appropriate components.

List the content and assets needed before building. Use original or clearly licensed images, meaningful alternative text, accurate source credits, and fictional contact details when the business is fictional. Keep sample claims and prices separate from real current offers. A link or button must have its stated effect; a decorative cart link does not implement checkout.

## Open the selected role

The starter keeps the original blank-page exercise. Its valid HTML shell, local libraries, and empty styles/script files are supplied; the page itself is deliberately unfinished. Read the source comments and add the planned content. The reference demonstrates a fictional Learning Workshop page with a grid, Sidenav, Collapsible, and Modal. It is a design reference, not a required business. SOURCES.md records its original source and adaptations.

Open index.html in the site IDE after confirming the import, or export the selected role and open index.html directly in a browser. Each ZIP contains README.md, SOURCES.md, styles.css, script.js, and every local library and license used by that role. The page and components run without a server or network. External documentation links need a connection.

## Connect HTML, CSS, and JavaScript

Keep content in index.html, layout rules in styles.css, and event/component initialization in script.js. The HTML head loads vendor/materialize.min.css, vendor/material-icons.css, then styles.css. Scripts at the end of the body load vendor/materialize.min.js before script.js, so the markup and M object exist when initialization runs. Materialize 1.0.0 does not require jQuery. The original starter's D3 6.1.1 dependency is included and loaded locally for optional SVG drawing; the reference does not use D3. Its license is retained.

Use a row containing columns such as `col s12 m4`: each section spans twelve grid units on a small screen and four on a medium or larger screen. Keep semantic headings, readable text, and a single main region. A viewport meta tag allows the responsive breakpoints to follow the device width. Add content before relying on decorative effects.

For a right-side menu, place a `.sidenav` outside the nav element, give it an ID, and match that ID in the trigger's `data-target`. Initialize with `M.Sidenav.init(document.querySelectorAll(".sidenav"), { edge: "right" })`. Materialize creates its own overlay; do not copy generated overlay or drag-target elements from an inspector.

A `.collapsible` list contains a `.collapsible-header` and matching `.collapsible-body` in each list item. Initialize it with `M.Collapsible.init(document.querySelectorAll(".collapsible"))`. Use secondary detail here; keep information needed to compare the main choices visible. Give each header keyboard access, an accessible name, and an accurate expanded state.

A `.modal-trigger` links to the ID of a `.modal`, which has `.modal-content` and a close control with `.modal-close`. Initialize with `M.Modal.init(document.querySelectorAll(".modal"))`. Label the dialog, move focus into it on opening, keep keyboard focus inside, allow Escape to close it, and return focus to its trigger. The reference supplies these behaviors in script.js. Its callbacks also maintain menu/accordion states. Reduced-motion preferences shorten the component animations without removing the content.

If the browser reports `M is not defined`, check the local script path and load order. If a trigger does nothing, compare its target ID with the markup and check that the corresponding component was initialized. Test JavaScript errors in the browser console. Optional D3 drawing uses vendor/d3.min.js before script.js; its global `d3` object has the original starter's version 6.1.1.

## Build and review

Build the static content and responsive layout, then add one interaction at a time. Predict which element or component state a click will change before testing it. Keep teaching TODOs in source comments or the project plan rather than visitor-facing paragraphs. Retain SOURCES.md and the library licenses when adapting the reference.

Check phone and desktop widths, 200% zoom, long headings, image loading, readable contrast, and absence of horizontal scrolling. Use the keyboard to open the mobile menu, expand each accordion item, and open/close the dialog. Confirm focus stays in the dialog and returns correctly, and check reduced motion. Every navigation target and primary action should reach the intended content. Review business/news claims and credits separately from the code.

Save a visible HTML, CSS, or JavaScript change in the IDE. Reopen the same attempt, confirm the change and earlier projects remain, export the complete ZIP, and test it outside the IDE. Record expected versus observed behavior and one design decision. The restaurant, news, and shop examples remain optional supplemental projects, not extra core requirements.

## Reference documentation

- [Materialize grid](https://materializecss.com/grid.html)
- [Sidenav](https://materializecss.com/sidenav.html)
- [Collapsible](https://materializecss.com/collapsible.html)
- [Modal](https://materializecss.com/modals.html)
