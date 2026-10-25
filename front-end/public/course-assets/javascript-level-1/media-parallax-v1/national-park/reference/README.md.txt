# National Park

Build a national park page using the real Materialize 1.0.0 Parallax component with two or three substantial background photographs. Include location, notable features, activities, and visitor tips. The starter retains the original unfinished parallax exercise, with two credited Yellowstone images supplied as optional local companions. The reference keeps the original two-image Yellowstone structure, corrects its missing JavaScript dependency, and replaces the fictional booking contact with official visitor information.

Load `vendor/materialize.min.css`, then `styles.css`. At the end of the body, load `vendor/materialize.min.js` before `script.js`. Materialize 1.0.0 does not need the original unused jQuery dependency. Give each photograph a `div.parallax-container` containing `div.parallax` and an img with a local source and useful alt text. Initialize after the markup exists with `M.Parallax.init(document.querySelectorAll(".parallax"), { responsiveThreshold: 0 })`. The original `edge` option belongs to Sidenav and is removed here. A missing JavaScript file gives `M is not defined`.

Set a substantial responsive height on `.parallax-container`, keep the image taller than its viewport, and crop with object-fit rather than stretching the photograph. Scroll to check that the image transform changes at a different rate from the page content. Two static images alone do not complete this assignment. Keep text in readable sections between the backgrounds, rather than placing low-contrast paragraphs directly over the image. Include a visible credit for each supplied photograph and retain SOURCES.md.

Respect `prefers-reduced-motion`. The reference leaves the photographs visible and static when that preference is on, destroys existing Parallax instances when it changes to reduced motion, and restores real instances when it changes back. The park information and links remain available in either mode. Source the location and features from the National Park Service, and use current official conditions and safety links rather than copying temporary closures or inventing booking details.

Check two real Parallax instances and a changing image transform while scrolling in the reference. Check the unfinished starter separately. Verify loaded images, readable location/features/activities/visitor-tip sections, accurate credits, working official links, phone and desktop layouts, 200% zoom, and static images with reduced motion. Save a visible heading or style change, reopen the same attempt, and export all companions. The park page works by opening index.html directly without a server or network; external source and visitor-information links need a connection.

Documentation: [Materialize Parallax](https://materializecss.com/parallax.html).

Open index.html directly in a browser without a server. Local photographs and Parallax work offline; external links need a connection.

Original reference: https://codepen.io/junilearning/pen/1d2df4b333d28c9a00f17d0fa4f37978

Adaptations: Original unfinished starter retained with supplied optional photo companions. Actual Materialize Parallax library bundled and initialized after matching markup. Sidenav-only edge option removed from Parallax. Two credited public-domain NPS images replace external background hotlinks without changing source JPEG bytes. Fictional booking contact replaced by source-backed park information and official visitor links. Reduced motion uses static images and responds to preference changes.
