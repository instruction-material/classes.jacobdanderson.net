# Chessboard

Build a square chessboard with eight rows and eight columns. Keep all 64 squares in row order. A CSS grid container controls its direct children: `display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr)` divides its available space into equal tracks. `1fr` shares the remaining space equally; it is not a fixed pixel length.

Alternate light and dark squares within each row and reverse the starting color on the next row. The parity rule is `(row + column) % 2`: adjacent squares change color, including across row boundaries. Merely coloring every second child fails at the start of an even-length row. Use explicit classes or a correct row-aware selector, then check the top-left square and all four corners.

Give the board a width that fits its parent and an `aspect-ratio: 1`. A useful rule is `width: min(100%, 90vmin, 42rem)` with `box-sizing: border-box` so the border stays inside that width. `vmin` follows the smaller viewport dimension. A width based only on viewport height can overflow a portrait phone. Let the parent center the board without adding fixed side tracks.

The starter leaves the board unfinished. Retain one page heading and give the finished noninteractive board a descriptive accessible name, rather than exposing 64 meaningless controls. Check all 64 squares, 32 of each color, equal cell sizes, alternating rows, no horizontal overflow, and a square board at phone and desktop widths and 200% zoom. Save one visible color change and export every companion file.

Open index.html in a browser without a server. Keep every companion file when exporting.

Original source: https://codepen.io/junilearning/pen/2573f4cfc9cb525b5940f500fd22dc79
