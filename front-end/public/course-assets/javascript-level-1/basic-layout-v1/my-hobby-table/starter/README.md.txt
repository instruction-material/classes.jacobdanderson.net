# My Hobby Table

Create a table about a hobby with consistent columns and rows, or use the supplied historical 2019 NFL dataset in README.md. State the table's subject and time period in a `caption`. The reference preserves all ten players from the original 2019 AP first-team offense example; its team names describe that season, not current rosters. The spelling is Zack Martin.

Use `table` for the data, `thead` for the header group, `tbody` for the data rows, and `tr` for each row. Column headings use `<th scope="col">`; each player's name can use `<th scope="row">`. Other cells use `td`. Put the same fields in the same order in every row. For example, a row can contain Lamar Jackson, Baltimore Ravens, and Quarterback.

Load the included Materialize 1.0.0 CSS. `class="striped centered"` adds alternate row shading and centers the table's cells. The table remains readable without relying only on color: row and column labels convey the data when color or styling is unavailable. Use CSS such as `overflow-wrap: anywhere` for long names and flexible widths for the surrounding container; avoid a fixed page width.

Verify the ten-row reference or the chosen complete dataset, the caption, every row/column association, and readable wrapping at phone and desktop widths and 200% zoom. Compare the striped rows with an unstyled table and identify which appearance comes from the library. The page and its supplied data work offline; opening the source link requires a connection.

Open index.html in a browser; keep every companion file when exporting.

Original source: https://codepen.io/junilearning/pen/0214806859946640ce1654c9c3ec08f0

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
