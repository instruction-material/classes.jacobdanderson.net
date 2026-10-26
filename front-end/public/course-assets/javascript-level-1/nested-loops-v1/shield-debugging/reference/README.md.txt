# Shield Debugging

Debug the D3 assembly line so it draws nine rows of Captain America's shields, containing one through nine shields for 45 shields total. Each shield has red, white, red, and blue circles of radii 110, 90, 70, and 50, plus a centered white star. Use distinct counters for the outer row loop and inner column loop. Reset each row's horizontal position, advance it by 210 after each shield, and advance the vertical position by 210 after each row. The starter intentionally contains loop and position errors; use the browser console to locate the first failure, then check the complete pattern.

Open `index.html` directly in a browser without a server. Edit `script.js` and refresh to run it. `printToScreen(value)` adds one line to the page.

Source: Juni Learning, JSS8 Supplemental Project 3: Debugging Captain America's Shield Solution
https://codepen.io/junilearning/pen/1ac928d6d9d777928c4439b4262310a3

D3 5.16.0 is included in `vendor/d3.min.js`; its license is in `LICENSE-d3.txt`.
