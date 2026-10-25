# Box Inception Part II

The box model adds padding and border around content; margin separates the outside of a box from its neighbors. With the default `box-sizing: content-box`, a 50px-wide content box plus 4px padding and a 2px border on each side occupies 62px before margins. With `box-sizing: border-box`, the declared width includes padding and border. Measure these layers in the browser inspector before changing them.

Normal flow places block elements on separate lines and allows inline-block elements to share a line. `position: relative` keeps an element's place in flow while offsets move its painted box. An absolutely positioned element leaves normal flow; its nearest positioned ancestor establishes its containing block. With no such ancestor, it uses the initial containing block. `position: fixed` normally uses the viewport; transforms on ancestors can change that relationship. A `z-index` controls stacking within its stacking context, rather than acting as one global page-wide order.

Recreate the four groups from JSS9 Box Inception: six 50-by-50 boxes in a block column, six inline-block boxes, three ordinary div rows with two inline-block boxes each, and a three-row, two-cell table. Use red, orange, yellow, green, blue, and purple in that order. The div-row group demonstrates HTML grouping, not CSS Grid.

Add `Absolute Positioning`: nest the six colored 50-by-50 boxes inside one another. Give the outer containing block `position: relative`; give each colored box `position: absolute; top: 10px; left: 10px`. Predict the accumulated offsets, then measure them. Reserve at least 110px of height for the positioned group so later content does not overlap it. Change one offset, padding, or border at a time and explain the result. Test at a narrow width and 200% zoom.

Open `index.html` directly in a browser without a server. Edit `index.html` and `styles.css`, then refresh the browser. The site IDE retains edits and exports all companion files.

Source: Juni Learning, JSS11 Project 1: Box Inception Part II Solution
https://codepen.io/junilearning/pen/261c1809ad0309dd584526c73c586289
