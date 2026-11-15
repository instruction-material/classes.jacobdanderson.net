# Which Card

Extend the working five-card drawing so clicking inside a card logs its color once.
The starter supplies the drawing prerequisite. Implement the handler in script.js.

## Files and execution

Open index.html in a browser without a server. The site IDE runs the same local files.
script.js contains the data, drawing and handler work. styles.css fits the 1200-by-800
drawing to the available width. console-viewer.js mirrors console.log in the Click log
while preserving console output. All files work offline.

## Geometry and input mapping

The colors are green, red, blue, yellow and cyan. Card i has x = i * 200, y = 150,
width = 150 and height = 100. Use the same geometry for drawing and hit testing.
Neighboring cards have a 50-unit gap.

Read canvas.getBoundingClientRect() and convert each click:
x = (event.clientX - rect.left) * canvas.width / rect.width
y = (event.clientY - rect.top) * canvas.height / rect.height

A point matches when x >= left, x < left + width, y >= top and y < top + height.
Log the matched color once. Background and gap clicks log no color.

## Worked results and completion

Centers (75,200), (275,200), (475,200), (675,200) and (875,200) log the palette in order.
(1,151) selects green. (150,200), (175,200) and (75,260) select none.
CASES.md gives complete edge, offset and scale cases. Repeat after resizing or scrolling.
Explain why client coordinates need conversion and how shared geometry prevents mismatches.

The original starter contained only a prompt. The local starter supplies the drawing and
leaves the handler unfinished. The original reference's hit boxes differ from its drawing
by 10 units and use client coordinates directly. The newly authored local reference preserves
its palette, drawing and requested console output while correcting those issues.
SOURCES.md records the captures; LICENSE-original.txt retains the starter notice.
