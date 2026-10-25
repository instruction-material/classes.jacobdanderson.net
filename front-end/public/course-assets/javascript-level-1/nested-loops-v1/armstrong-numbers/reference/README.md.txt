# Armstrong Numbers

Find every three-digit Armstrong number from 100 through 999: its three digits cubed must add up to the number itself. For example, `153 = 1³ + 5³ + 3³`. Use `% 10` to extract the last digit and `Math.floor(value / 10)` to remove it; `Math.pow(digit, 3)` cubes it. Check each candidate with a loop over its three digits and print each match once. Alternatively, use three nested loops over the hundreds, tens, and ones digits, allowing hundreds from 1 through 9 and other digits from 0 through 9.

Open `index.html` directly in a browser without a server. Edit `script.js` and refresh to run it. `printToScreen(value)` adds one line to the page.

The reference includes `findByNumber()` and `findByDigits()`. Run one at a time using the call at the end of the exercise code. Both should produce the same four numbers in ascending order.

Source: Juni Learning, JSS8 Project 3: Armstrong Numbers Solution
https://codepen.io/junilearning/pen/e12716e0c3e1cbfc0405c9da2e245b8a

D3 5.16.0 is included in `vendor/d3.min.js`; its license is in `LICENSE-d3.txt`.
