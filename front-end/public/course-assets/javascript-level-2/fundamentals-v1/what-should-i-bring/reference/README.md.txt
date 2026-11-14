# What Should I Bring?

Create a webpage that recommends an item for at least five weather situations. Keep the input, recommendation, image and heading color in agreement.

The original starter supplies the assignment comment and an empty page. This pack adds a complete local HTML shell and the libraries, images and method notes needed to build it. Open index.html in the course IDE preview or a browser; the untouched starter body is intentionally blank.

## Build the page

1. In the body of index.html, add a heading in a container with id panel, a label and text input with id input, a Submit button with id submit, and a result area containing output-text and output-image. Match the label's for attribute to input.
2. Brainstorm at least five weather situations and record one useful item for each in CASES.md. The reference uses hot, rain, snow, cold and wind. Its token matching is case-sensitive.
3. Register a click handler with d3.select("#submit").on("click", () => { ... }). Read the input using d3.select("#input").property("value").
4. Use an if / else if / else sequence or a mapping to select the recommendation. Set its visible text with d3.select("#output-text").text(message), the picture with .attr("src", "assets/umbrella.svg"), and the heading's Materialize classes with d3.select("#panel").attr("class", "card-panel blue white-text"). Give the picture an appropriate alt attribute.
5. Handle unknown input. Replace the previous message and hide/clear the previous image so the page never shows an earlier recommendation for an unrelated input.
6. Keep the input and result usable at a narrow width. Tab to the input and button; use the focused Submit button with Enter as well as a mouse.

## Local images and libraries

The supplied assets are sunglasses.svg, umbrella.svg, boots.svg, jacket.svg and windbreaker.svg. All scripts, styles and images use local relative paths. Materialize provides the card, button and color classes. D3 provides select, on, property, text and attr; no build or package installation is required.

Use .property("hidden", true) to hide an image and .attr("src", null) to remove its source. Show it again for a recognized case with .property("hidden", false). Keeping a result hidden or changing a JavaScript variable alone does not update its visible text.

## Completion evidence

Keep the completed HTML, CSS and JavaScript together with these assets. Check all five chosen weather inputs, an unknown value, and returning to a recognized value after the unknown one. Record predicted and observed results in CASES.md. Each submission replaces the prior recommendation and picture; refreshing leaves a working input and button. Keep the attempt separate from the reference.
