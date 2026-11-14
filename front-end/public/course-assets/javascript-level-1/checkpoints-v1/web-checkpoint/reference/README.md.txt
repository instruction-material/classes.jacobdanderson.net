# Web checkpoint

Open index.html in the IDE preview or from the exported ZIP without a server. Continue the three checkpoint tasks in this same project. Edit index.html, styles.css and script.js.

## Tasks

1. Create a red bar 10px high. Add a yellow 10px box with 50px margin, 50px padding and a 3px border. Materialize applies border-box sizing, so its minimum rendered width is 106px. Compare this with content-box, where the rendered width is 116px. Place a fixed blue 30px square at the viewport's top left; scroll to check it.
2. In a 500-by-500 SVG, draw a red 50px square at (100,100). Animate both dimensions to 100 over two seconds, turn it green on mouseover and restore red on mouseout. Add a modal trigger, dialog content and close control; initialize it with M.Modal.init(document.querySelectorAll(".modal")). The local reference respects reduced-motion preferences.
3. Build a 300px 3-by-3 CSS Grid of alternating grey/black tiles. Create a separate Materialize grid with numbers 1–9 in three equal columns using col s4. Show face above 992px and bug_report at 992px or below using the corresponding responsive classes.

## Checks

Check nine CSS tiles and nine numbered cards in row order. Resize to 390, 992, 993 and 1280px. Only one responsive icon should appear. Open and close the modal using the keyboard; check Escape. The SVG retains its coordinates while scaling to fit narrow screens. Save and reopen changes before exporting.

The starter is the original empty task workspace with local library loading and TODO comments. The reference is a separate instructor project.
