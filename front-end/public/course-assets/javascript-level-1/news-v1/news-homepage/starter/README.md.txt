# News Homepage

Create a featured-story slider whose three headlines open three corresponding article dialogs. This is an optional Master Project example. It practices Materialize Slider and Modal components, content hierarchy, focus management, and motion controls.

## Select a role

The starter is an authored companion with an unfinished main region, local libraries, images, and source comments. The separate reference adapts the captured completed example. Only that reference was available in the original source; the starter is not an original course starter.

Confirm the selected import in the site IDE. Read `README.md` and `SOURCES.md`, then edit index.html, styles.css, and script.js. Export the ZIP, extract every file, and open index.html in a browser. Both roles work without a server, package installation, or network connection. Documentation and original-source links need a connection.

## Build the page

Use one h1 for the page title, a slider containing ul.slides, and three li children. Each slide combines an image, a headline, a short caption, and a Read story link. Match each link's fragment to one unique article ID. Keep the article title, body, and Close story action together inside that article. The reference retains the original three headlines, captions, modal story titles, and placeholder article text. Replace the placeholder bodies with original sample stories when adapting the design.

The three local SVG illustrations are authored companions for the computing, city, and mathematics topics. They replace remote photographs. `SOURCES.md` retains the original image URLs and exact source hashes. Decorative slide images use empty alternative text because the adjacent headline identifies the story.

Load vendor/materialize.min.css before styles.css. Load vendor/materialize.min.js before script.js at the end of the document. Initialize the slider with M.Slider.init and the three dialogs with M.Modal.init. Read the reference callbacks in order: pause the slider as a dialog opens, keep focus inside the open dialog, then restore focus to the story link after closing.

## Control interaction and motion

Previous story and Next story provide explicit manual navigation. The slideshow starts paused. Play slideshow is an explicit choice; Pause slideshow stops automatic changes. Opening a story, focusing a featured-story link, changing the motion preference, or manually changing slides pauses automatic playback. A hidden tab also pauses it. Reduced motion keeps manual navigation available with zero-duration slider changes.

Before JavaScript runs, all three features and articles remain readable in normal document order. The enhanced class changes the page into a slider with dialogs only after the library exists. Keep that fallback readable rather than hiding the only copy of an article.

The original global .active rule changes unrelated active components. Scope styles to this slider instead. The captured original also declared unused jQuery; Materialize 1.0.0 handles these components without it. No extra network library is needed.

## Check the result

Check phone and desktop widths, long headlines, and 200% zoom. Read story must open its matching title and content. Use the keyboard to open a story, move through its controls, close it with Escape, and return to the initiating link. Confirm automatic playback stays paused when requested, while a dialog is open, and with reduced motion. Test an in-place motion preference change and a page load with JavaScript disabled.

Save visible HTML, CSS, and JavaScript edits. Reopen the same attempt, verify earlier projects remain intact, export the complete ZIP, and inspect the extracted page outside the IDE. Record expected and observed behavior. These headlines and placeholder stories are example data for the layout exercise, not a current news service.

## Documentation

- Slider: https://materializecss.com/media.html
- Modal: https://materializecss.com/modals.html
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
