# Forgotten Math

Multiply two finite numbers using repeated addition, without the multiplication or multiplication-assignment operators. At least one input must be a whole-number repeat count; the other can be decimal.

## Checks

Check 3 and 4, 3 and 2.5, negative inputs, zero and one. The reference chooses the smaller available whole count, adds the other amount repeatedly and applies the count's sign. It accepts at most 10,000 additions and reports cancellation, unsupported counts and nonfinite results.

## Run

Open index.html in a browser. The exported HTML, CSS, JavaScript and local D3 files run without a network connection. Prompts accept input in browser dialogs; results appear on the page.

## Source

Adapted from [Juni Learning's original reference project](https://codepen.io/junilearning/pen/53206f1e4800c28a4549aea7be49b7e0). The D3 license is included as LICENSE-d3.txt.
