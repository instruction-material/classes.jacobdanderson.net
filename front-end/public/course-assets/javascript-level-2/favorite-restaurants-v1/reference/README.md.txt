# Favorite Restaurants

Build a three-row table with Name, Favorite Menu Item, and Photo or Illustration
columns. The original task uses restaurant names, menu items and images.
This pack supplies three original SVG food illustrations that work offline.
Use the example restaurants or substitute three real or fictional choices.

## Build the table

A caption inside table identifies its data. Put column labels in a thead row
with th scope="col". Put restaurant rows in tbody. Each tr has three cells
in the same order: a td for the name, a td for its menu item, and a td for img.

Begin with one complete row, then add two more. Use images/fries.svg,
images/chicken.svg and images/bowl.svg as relative src paths. Each image needs
alt text describing its food, rather than a filename. Keep the images folder
with index.html when exporting. Drawing replacement illustrations is optional.

Restaurant website links use HTTPS and descriptive names. The reference keeps
the original three destination links and opens them in the same tab. The table
and supplied images work without visiting those websites.

## Style and check

Use border-collapse: collapse for neighboring cell borders, with modest cell
padding. Give images a practical width and max-width: 100%. Use
tbody tr:nth-child(even) for alternate rows; selecting tbody keeps the header
from shifting the pattern. Include visible keyboard focus for links.

Keep all three columns aligned on narrow screens. Allow text to wrap, use
table-layout: fixed with explicit column widths and reduce padding on smaller
screens. At 390 pixels all columns and images remain visible without clipping.
Check again at 200% text size. Long replacement names should wrap.

The starter contains the page and supplied files. Complete its table head,
three body rows and CSS. The reference shows one solution after an attempt.
No JavaScript is required to display a semantic table or alternate its rows.

## Run and verify

Open index.html in a browser without a server. Check the caption, three column
headers, three rows and three loaded images. Tab through the links.
Temporarily add a fourth row and verify its background follows the selector.

Save the same IDE attempt, export its ZIP and reopen the exported HTML.
Relative images must still load. README.md, CASES.md and SOURCES.md travel
with the table and record its expectations and original source boundary.

Reference: compare semantics,relative images and responsive cell rules.
