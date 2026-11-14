# Snowflake pattern

Reproduce the original eight-by-eight CSS Grid. Each `#` below is one snowflake icon; each `.` is an empty cell. Rows and columns start at the top left.

```text
###.....
####....
#####...
.#####..
..#####.
...#####
....####
.....###
```

## Core project

- Create 64 tiles in row order and place the 34 icons at the marked positions.
- Use CSS Grid with eight equal rows and columns. Center each icon within its tile.
- Use the supplied Material Icons font: `<i class="small material-icons" aria-hidden="true">ac_unit</i>`. The icon color is `#78B1BF`.
- Keep the grid square and within both the viewport width and height. Check at 390 and 1280 pixels wide.

Compare row positions, icon count, equal tile sizes and the absence of horizontal scrolling. The starter contains the original hints; the reference preserves the original 64 cells and 34 icon positions with responsive sizing.

## Run and save

Open index.html in a browser without a server. Edit index.html and styles.css, save the project, then reopen the saved attempt and verify the same pattern. README.md retains the target after export.

## Source and dependencies

Original starter: https://codepen.io/junilearning/pen/vYGWvaq

Original reference: https://codepen.io/junilearning/pen/084c3032877fa7f9c828bba2c5798551

The original settings include Materialize 1.0.0 CSS, Material Icons 3.0.1, jQuery 3.4.1, Materialize JavaScript 1.0.0 and D3 5.16.0. This HTML/CSS exercise uses the two stylesheets. Their existing licensed local copies and embedded icon font are included; the unused JavaScript libraries are omitted. Original panel hashes and settings are retained in the audit fixture.
