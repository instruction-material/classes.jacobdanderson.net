# Archery Simulator

Simulate five rounds of archery with three arrows per round. Use nested loops for rounds and arrows. `Math.floor(Math.random() * 3)` produces 0, 1, or 2; count exactly one of those outcomes as a hit so each arrow has a one-in-three chance. Print all 15 shots as `Round 1, arrow 1: X` for a hit or `O` for a miss, using the actual round and arrow numbers. Count the X results and print the total bullseyes after the final shot.

Open `index.html` directly in a browser without a server. Edit `script.js` and refresh to run it. `printToScreen(value)` adds one line to the page.

Source: Juni Learning, JSS8 Supplemental Project 1: Juni Archery
https://codepen.io/junilearning/pen/xxZPgdv

D3 5.16.0 is included in `vendor/d3.min.js`; its license is in `LICENSE-d3.txt`.
