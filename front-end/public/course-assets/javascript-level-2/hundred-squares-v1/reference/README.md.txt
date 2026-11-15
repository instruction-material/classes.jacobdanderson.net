# 100 Squares

Draw 100 random colored squares with D3: 10 rows by 10 columns. First draw one square,
then a row of 10, then 10 rows with nested loops. The logical SVG width and height are 1000.
Each rectangle is 50 wide and 50 high. Position it at x = 50 + column * 75 and
y = 50 + row * 75, where column and row run from 0 through 9.
Use integer red, green and blue channels from 1 through 255.

## Files and execution

Open index.html in a browser without a server. All scripts and styles are local.
The starter script.js retains the original assignment and blank entry area.
The reference completes the nested-loop task. README.md supplies setup, CASES.md supplies
fixed coordinate/color checks, and SOURCES.md and the license files retain provenance.

## SVG and D3 setup

SVG stores vector shapes as individual page elements. d3.select chooses a container,
append creates an element, and attr sets an SVG attribute. Canvas instead draws into a
raster surface. These commands create the SVG and one square:

```js
const svg = d3.select("#drawing").append("svg")
  .attr("width", 1000).attr("height", 1000)
  .attr("viewBox", "0 0 1000 1000")
  .attr("role", "img").attr("aria-label", "A random color square grid");
svg.append("rect")
  .attr("x", 50).attr("y", 50)
  .attr("width", 50).attr("height", 50)
  .attr("fill", "rgb(120,80,200)");
```

The viewBox preserves logical coordinates while styles.css fits the SVG into the page.
Math.random() returns a value at least 0 and less than 1.
Math.floor(Math.random() * 255) + 1 therefore gives an integer from 1 through 255.
A template literal such as `rgb(${r},${g},${b})` inserts the three channels into a
complete color string. Retain the closing parenthesis.

## Required implementation

Replace the single-square call with a loop of 10 columns, then nest a loop of 10 rows.
Use the column for x and the row for y. Choose three new channels inside the inner loop,
then append one rectangle using those positions, dimensions and color.
The reference uses column as its outer loop; using row as the outer loop produces the same grid.

## Completion evidence

Show 100 rectangles and every x/y combination exactly once.
Check the first square at (50, 50) and the last at (725, 725); each remains 50 by 50.
Explain why 75-unit spacing leaves 25 units between 50-unit squares.
Reload to compare changed colors with unchanged geometry. Retain all 100 squares on a
narrow screen without changing the logical coordinates. CASES.md supplies independent checks.

## Source and adaptation

The original assignment, coordinates, channel range and nested-loop purpose are retained.
The original color hint and reference omit a closing parenthesis; the local roles supply it.
The reference uses the complete local HTML/CSS shell, responsive SVG and verified D3 7.9.0.
LICENSE-original.txt retains the original starter MIT notice. No other source is required to run.
