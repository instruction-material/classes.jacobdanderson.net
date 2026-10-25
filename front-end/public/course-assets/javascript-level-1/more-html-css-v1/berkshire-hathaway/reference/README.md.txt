# Berkshire Hathaway

Recreate the structure of the supplied 2020 Berkshire Hathaway page as a supplemental HTML/CSS exercise: centered name and address, a list of document links in two columns, small dated update notes, and a footer separated by horizontal rules. Preserve the order and meaning of the link labels. The supplied material is a historical layout sample, so its 2020 update dates are not current announcements.

A link's `href` is resolved relative to the current document unless it is an absolute URL. A path such as `reports.html` in an exported exercise would point to a missing local file. Use the full official HTTPS destination instead. The page itself renders offline; opening an external document link requires a connection. Keep the source company's website clearly distinct from the exercise's page title.

The reference retains the original table layout for comparison and marks it `role="presentation"`, because its cells arrange links rather than describe tabular data. `border-spacing: 0` controls space between table cells; `vertical-align: top` aligns their content. `cellspacing` and `valign` are not CSS properties. Compare this with a semantic list styled with CSS Grid: `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem` creates two flexible columns without assigning table meaning to layout.

At narrow widths, let the link groups stack into one readable column. Use flexible widths, wrapping text, and visible keyboard focus. Check every relative destination, confirm the dates are identified as historical, and test at a phone width and 200% zoom. Keep Berkshire Hathaway supplemental; the core projects are Box Inception Part II, My Hero Page, and My JavaScript Art.

Open `index.html` directly in a browser without a server. Edit `index.html` and `styles.css`, then refresh the browser. The site IDE retains edits and exports all companion files.

Source: Juni Learning, JSS11 Supplemental Project 1: Berkshire Hathaway Solution
https://codepen.io/junilearning/pen/3efe23650b01fd4f978f3f827cc1691e
