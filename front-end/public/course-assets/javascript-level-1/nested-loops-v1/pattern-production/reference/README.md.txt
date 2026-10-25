# Pattern Production

Print five lines containing one, two, three, four, and five stars. Use an outer loop for rows and an inner loop to build each line, then pass the line to `printToScreen()`. Recreate the same five rows as 15 yellow D3 Pac-Man shapes. Use a filled arc with radii 0 and 50, angles 120 and 430 degrees, and `transform: translate(...)` to place each shape. Start each row at x = 100, space columns by 150, and place rows at y = 150 through 750.

Open `index.html` directly in a browser without a server. Edit `script.js` and refresh to run it. `printToScreen(value)` adds one line to the page.

`degreesToRadians(degrees)` converts degrees to radians for `d3.arc()`. SVG coordinates increase rightward and downward. Use `svg.append("path").attr("d", arcData).attr("transform", "translate(100,150)")` to place an arc.

Source: Juni Learning, JSS8 Project 2: Pattern Printing Solution
https://codepen.io/junilearning/pen/9b713f294e21887a1a2c9b528764bd4b

D3 5.16.0 is included in `vendor/d3.min.js`; its license is in `LICENSE-d3.txt`.
