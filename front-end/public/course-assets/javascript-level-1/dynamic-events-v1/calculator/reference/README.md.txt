# Calculator

Finish the original D3/SVG calculator. The starter draws its black case and white display, then copies the first input into that display when + is clicked. Add the missing arithmetic rather than replacing the drawing. The two HTML inputs and four operation buttons remain outside the SVG; HTML inputs appended directly to SVG do not become working form controls.

Read each input's `value`, trim whitespace, and reject an empty string before converting with `Number(value)`. `Number("")` is zero, which would otherwise disguise an unfinished input. Check `Number.isFinite()` after conversion so words and Infinity receive a useful error. Give each input a visible label and use a button's click callback to read the current values, not a value captured before the user types.

Use `+`, `-`, `*`, and `/` on the converted numbers. The + operator concatenates strings, so converting both inputs matters: After numeric conversion, 12 + 3 produces 15; raw strings concatenate as 123. Reject a zero divisor and a non-finite result before updating the display. A single calculation function can handle the shared validation; each D3 `.on("click", callback)` selects its operation. Each document ID must be unique.

Write the short result to the SVG text element with D3 `.text()`, and write a complete result or error to the live status paragraph. The reference rounds only the small display to ten significant digits; the status retains the full JavaScript numeric result. Decimal arithmetic uses binary floating point, so 0.1 + 0.2 may have a small representation error. Clear a prior error when a valid calculation follows it.

Check 12 + 3 = 15, 12 - 3 = 9, -4 * 2.5 = -10, and 9 / 4 = 2.25. Also test zero as an ordinary input, negative numbers, decimals, either empty input, spaces, words, Infinity, division by zero, and overflow such as 1e308 * 1e308. Use only the keyboard to reach both inputs and all buttons. Check the complete drawing and readable controls on a phone and at 200% zoom. Save an operation or visible color change, reopen the same attempt, and export every file.

Open index.html in a browser without a server. Keep every companion file when exporting.

Original reference: https://codepen.io/junilearning/pen/d394480277af12f893819f3d64c5ea81

Adaptations: Unique SVG and HTML IDs. Valid HTML controls with labels. Finite-number and zero-divisor handling in reference. Responsive original D3 calculator drawing.
