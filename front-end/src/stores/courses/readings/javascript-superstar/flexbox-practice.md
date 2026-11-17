# Practice a wrapping row of cards

[Flexbox Froggy](https://flexboxfroggy.com/) is an optional layout drill. A local browser project can demonstrate the same main-axis, cross-axis and wrapping decisions.

```html
<div class="cards">
	<article class="card">One</article>
	<article class="card">Two</article>
	<article class="card">Three</article>
</div>
```

Give cards a readable border and padding. Set border-box sizing so the stated widths include that padding and border. Give each card a 140-pixel width with flex shrinking disabled. Make the container a flex layout with a 12-pixel gap and wrapping enabled. Compare justify-content, which distributes remaining space along the main axis, with align-items, which aligns items across that axis.

With the default row direction, the main axis is horizontal. Changing the direction changes which axis those properties act on. Preserve One, Two, Three in the HTML order; visual reordering does not change the underlying reading order.

## Completion checks

At a container width of 480 pixels, all three cards fit on one row: their widths and two gaps total 444 pixels. At 280 pixels, two cards would require 292 pixels, so each card occupies its own row. Inspect both widths and confirm that the cards retain their text, spacing and order without horizontal page overflow.

Save and reopen the project. Change one alignment property and predict the visible difference before running it. Flexbox Froggy offers additional property combinations after this local check.
