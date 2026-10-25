# Debugging the Favorite Fruit Guesser

Repair the starter's conditional nesting so both taste and color determine the result. Apply this exercise's lookup rules: sour/red gives cherries, sour/yellow gives pineapples, sour/green gives lime, sweet/blue gives blueberries, and sweet/yellow gives mango.

## Checks

Trace all five listed pairs and a pair with no match, such as sweet/red. The starter intentionally places branches outside the taste condition; preserve it while identifying why the result is wrong. The reference trims and lowercases input, handles Cancel at either prompt and reports unsupported pairs rather than printing an empty fruit.

## Run

Open index.html in a browser with the exported files together. The project runs offline.

Complete the exercise above the supplied printToScreen helper. Its output wraps on narrow pages.

## Source

Adapted from [Juni Learning's original starter project](https://codepen.io/junilearning/pen/PoZdQeW). The original D3 5.16.0 library is supplied locally with LICENSE-d3.txt.
