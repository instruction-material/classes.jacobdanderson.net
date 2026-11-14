# Snowflake pattern checks

## Pattern inputs

Use an eight-by-eight grid. Each # is an occupied cell and each . is empty; the first row is the top row.

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

Check the tile count, icon count, occupied positions and square shape. Repeat at 390 and 1280 pixels wide and at 200% zoom. Save, reopen and export the same project.

## Pattern answers

There are 64 tiles and 34 occupied cells. The row counts are 3, 4, 5, 5, 5, 5, 4 and 3. Occupied columns, counted from 1, are 1–3, 1–4, 1–5, 2–6, 3–7, 4–8, 5–8 and 6–8.

The reference places Material Icons ac_unit glyphs in those cells, centers them with flex alignment and creates equal tracks with CSS Grid. Its square is bounded by the available width and viewport height. The exported icon font and styles work locally. Reopening preserves the edited files; exporting preserves all eight files, including the two dependency licenses.
