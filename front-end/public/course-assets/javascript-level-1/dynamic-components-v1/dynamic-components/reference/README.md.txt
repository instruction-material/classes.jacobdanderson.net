# Dynamic Components

Implement three Materialize JavaScript components on one page using Materialize 1.0.0. This example retains the original reference's right-side Sidenav, Modal, and five-image Carousel. The original link supplies only a completed reference; the local starter is explicitly authored and leaves the components unfinished. The supplied five Yellowstone photographs replace the original external nature thumbnails and include complete credits in `SOURCES.md`.

Load `vendor/materialize.min.css` and `vendor/material-icons.css` in the head. Load `vendor/materialize.min.js` before `script.js` at the end of the body. The markup must exist before initialization. Materialize 1.0.0 uses its `M` namespace and does not need jQuery. A missing library produces `M is not defined`; a selector with no matching elements silently initializes nothing. Keep each target ID unique and make a trigger's `data-target` match it exactly.

For the right-side Sidenav, create a `ul.sidenav` outside the nav, give it an ID, and add a trigger with `class="sidenav-trigger"` and that `data-target`. Use real links to the Photographs and Credits sections, then initialize `M.Sidenav.init(document.querySelectorAll(".sidenav"), { edge: "right" })`. Mark links that close the panel with `sidenav-close`. Track `aria-expanded` and return focus to the Menu trigger after closing; Escape must close the panel too.

For the Modal, connect a `modal-trigger` link to a `div.modal` with the same target ID. Include a `modal-content` area, an accessible dialog name, and a `modal-close` button. Initialize `M.Modal.init(document.querySelectorAll(".modal"))`. The reference opens the current photograph and its credit. Keep focus inside the open dialog, close it with Escape or Close, and return focus to Photo details. The complete photo remains visible with its aspect ratio preserved.

For the Carousel, put all five images in children with class `carousel-item` inside a `carousel` container, then call `M.Carousel.init(document.querySelectorAll(".carousel"), options)`. The reference's Previous and Next buttons call the instance's `.prev()` and `.next()` methods. ArrowLeft and ArrowRight provide the same navigation when the carousel has keyboard focus. Its `onCycleTo` callback updates the visible title and the photograph used by the dialog. Only the current slide is announced. Respect reduced motion by setting component durations to zero when the media preference requests it.

Check all three real components after a page refresh, five loaded local photos, next/previous wraparound, keyboard arrows, working sidebar destinations, dialog Close and Escape, focus return, and the correct title and credit after changing slides. Check a phone, a desktop, reduced motion, and 200% zoom. Save a visible caption or style change, reopen the same attempt, and export every companion file. Component interaction notes belong in `README.md`; the finished page contains the photographs and navigation.

Documentation: [Sidenav](https://materializecss.com/sidenav.html), [Modal](https://materializecss.com/modals.html), [Carousel](https://materializecss.com/carousel.html).

Open index.html in a browser without a server. Keep every companion file when exporting. External documentation and source links need a connection.

Original reference: https://codepen.io/junilearning/pen/e55b7c0d570df2c9943e06395a42c974

Adaptations: Original Sidenav, Modal and five-image Carousel retained. Explicitly authored unfinished starter because original is reference-only. Five credited local NPS photographs replace external nature thumbnails. Complete offline Materialize JavaScript and icon font. Keyboard controls, dialog focus and reduced-motion options.
