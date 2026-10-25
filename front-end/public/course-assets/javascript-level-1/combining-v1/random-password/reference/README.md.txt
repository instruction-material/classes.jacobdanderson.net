# Random Password

Use ASCII codes and loops to generate ten lowercase letters and ten decimal digits. Interleave them into a twenty-character sample, alternating one letter and one digit.

## Checks

Check that positions 0, 2, 4 and so on contain lowercase letters, while the remaining positions contain digits. Include a and z, and 0 and 9, in the possible random ranges. This is a loop exercise: [Math.random does not provide secure random numbers for account passwords](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random).

## Run

Open index.html in a browser. The project runs offline.

## Source

Adapted from [Juni Learning's original reference project](https://codepen.io/junilearning/pen/1520f836e15f3d4e7f554b913a805b02). The D3 license is included as LICENSE-d3.txt.
