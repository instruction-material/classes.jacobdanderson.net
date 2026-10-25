# What Grade Is This?

Prompt for a percentage, convert it to a number and use an ordered conditional chain to choose a letter grade: A at 90 or above, B at 80, C at 70, D at 60, and F below 60.

## Checks

Test every boundary: 0, 59.99, 60, 69.99, 70, 79.99, 80, 89.99, 90 and 100. Percentages may be fractional. The reference rejects empty, nonnumeric, infinite and out-of-range input, and handles Cancel separately.

## Run

Open index.html in a browser with the exported files together. The project runs offline.

## Source

Adapted from [Juni Learning's original reference project](https://codepen.io/junilearning/pen/2d86a137a1c362df390051e86a298e9d). The original D3 5.16.0 library is supplied locally with LICENSE-d3.txt.
