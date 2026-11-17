# Practice CSS selectors

CSS Diner is an optional way to practice selector precision. The same skills can be checked in a local browser workspace with this HTML:

```html
<section class="menu" id="lunch">
	<p class="special">Soup</p>
	<p>Salad</p>
	<div><p class="special">Pie</p></div>
</section>
<p>After</p>
```

Write three selectors: one matching only Soup and Salad, one matching Soup and Pie, and one matching the paragraph immediately after the section. Predict the matching elements before applying each selector. Add a border with one selector at a time and inspect the selected elements in the browser.

A space selects descendants at any depth; > limits the relationship to direct children; + selects an immediately following sibling. A class selector starts with a dot, while an ID selector starts with #. Combine these rules instead of adding unnecessary classes.

## Completion checks

The direct-child selection excludes Pie because a div intervenes. The special-paragraph selection includes both Soup and Pie. The following-sibling selection reaches After without selecting an internal paragraph. Save and reopen the page, then explain each selector's relationship in words.

For further practice, use tag, attribute and pseudo-class selectors in CSS Diner. Record one specific match and one excluded element for each new rule.
