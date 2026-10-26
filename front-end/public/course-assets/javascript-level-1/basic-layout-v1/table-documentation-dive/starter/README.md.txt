# Table Documentation Dive

Extend the My Hobby Table project, or build the supplied ten-row 2019 table from README.md. Keep the caption, column headings, row headings, and historical team labels. This is supplemental practice in reading documentation and applying a focused change; it does not replace the core table project.

In the included Materialize 1.0.0 CSS, `class="highlight centered"` highlights the row under the pointer and centers the cells. Add links to the player names with an `a` element and an appropriate absolute HTTPS `href`. The reference preserves the original ten Wikipedia destinations, including the correctly spelled Zack Martin page. Use meaningful link text so a list of links still identifies each destination.

A pointer hover is not keyboard focus. Keep links underlined, add a visible `:focus-visible` outline, and use `tbody tr:focus-within` to highlight the row containing the focused link. Move through every link with Tab, confirm that only the relevant row highlights, and make sure the link target and text agree. Preserve ordinary keyboard activation instead of adding a click-only handler.

The table itself renders offline; following an external source link needs a connection. Check the ten data rows or the chosen complete dataset, pointer and keyboard highlighting, readable long names, phone and desktop widths, and 200% zoom. Record which documented class or selector produces each change.

Open index.html in a browser; keep every companion file when exporting.

Original source: https://codepen.io/junilearning/pen/a08f05f994009cffe397dd6dd86dbddd

## Supplied historical data

| Player | Team in 2019 | Position |
| --- | --- | --- |
| Lamar Jackson | Baltimore Ravens | Quarterback |
| Christian McCaffrey | Carolina Panthers | Running Back/Flex |
| George Kittle | San Francisco 49ers | Tight End |
| Michael Thomas | New Orleans Saints | Wide Receiver |
| DeAndre Hopkins | Houston Texans | Wide Receiver |
| Ronnie Stanley | Baltimore Ravens | Left Tackle |
| Ryan Ramczyk | New Orleans Saints | Right Tackle |
| Quenton Nelson | Indianapolis Colts | Left Guard |
| Zack Martin | Dallas Cowboys | Right Guard |
| Jason Kelce | Philadelphia Eagles | Center |

Source: [NFL/AP 2019 selections](https://www.nfl.com/news/2019-all-pro-team-jackson-mccaffrey-highlight-roster-0ap3000001094130).
