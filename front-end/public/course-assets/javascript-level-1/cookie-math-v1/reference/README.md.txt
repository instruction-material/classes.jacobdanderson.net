# Cookie Math

Open `index.html` with every exported file in place. No server, package installation or network connection is required.

A batch uses 3 cups of flour, 2 eggs and 4 cups of chocolate chips. Ask how many cups of flour are available, convert the response to a number, then scale both other ingredients by `flour / 3`. For 4.5 cups of flour, the result is 3 eggs and 6 cups of chocolate chips. Exact proportions may include fractional ingredients; use `Math.ceil()` only when intentionally rounding up to whole items.

Complete exercise code above the supplied `printToScreen` helper. Its output wraps on narrow pages.

`prompt()` returns a string or `null` when canceled. The reference handles cancellation before using the responses.

The supplied helper uses the original D3 5.16.0 library locally. Retain `vendor/d3.min.js` and `LICENSE-d3.txt`.

Juni Learning source: [reference](https://codepen.io/junilearning/pen/27b890b0097969f24289d9abf77d1392).
