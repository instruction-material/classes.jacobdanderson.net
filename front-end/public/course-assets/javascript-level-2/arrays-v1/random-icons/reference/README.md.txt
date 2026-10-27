# Random Icons

## Files and workflow

Open the selected starter in the site IDE after confirming its source. Read the TODOs in `script.js`, save a change, reopen the same attempt and export its complete ZIP. Extract the ZIP and open `index.html` in a browser; its scripts, styles, fonts and licenses are local. Save files and reload the browser after an edit. `README.md` contains this full reading and `SOURCES.md` identifies the original role and adaptations. The reference is available for comparison after an independent attempt.

Create six randomly chosen, randomly colored Material Icons. This supplemental project combines array indexing, randomness, D3 selection and Materialize color classes.

## Select and render

The starter supplies an array of icon names and an array of twelve color names. Keep both arrays available. For each of six iterations, choose an icon index using `Math.floor(Math.random() * icons.length)`, and choose a color index independently using the corresponding color-array length. The largest possible valid index is length minus one; rounding could incorrectly produce length.

Read the two selected values into named variables before rendering. D3's `select(".row")` finds the supplied container. Append an `i` element, set its class to `material-icons large ${color}-text`, then use `.text(icon)` for the icon name. The local font turns known text ligatures into glyphs. The local Materialize stylesheet supplies the class structure; there is no Materialize JavaScript behavior to initialize here.

Use a loop condition `i < 6`. Icon and color selection occur inside the loop; selecting them once outside would repeat the same pair every time. Repeated values are valid random outcomes. Six draws do not imply six distinct icons or colors.

## Readable results

The local reference also records each chosen pair in an ordered list beside the gallery. Its textual icon and color names expose the actual random data without requiring color recognition or font rendering. Each glyph is decorative for assistive technology because its corresponding list entry identifies it. Regenerating a page by refresh replaces the complete set.

Light Materialize colors are darkened locally against white while retaining their named color families. The responsive row wraps on narrow screens so all six icons remain available. These changes support reading the result without changing the selection algorithm. A missing local stylesheet or font should be diagnosed from the page's source files and browser console, rather than fixed by adding a new remote dependency.

## Build and check

1. Render one fixed icon and color to verify D3, local styles and font order.
2. Select a random icon and inspect that it belongs to the icon array.
3. Select the color independently and verify its membership.
4. Repeat exactly six times and generate the ordered list from those same six choices.

Check six glyphs and six matching list entries at phone and desktop widths. Test random values close to zero and one when tracing index bounds. Inspect duplicate pairs without treating them as errors. All local assets and licenses must remain in the exported ZIP.
