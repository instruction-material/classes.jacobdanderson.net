# Car

Draw a car with D3 circles, rectangles and lines on an 800 by 500 SVG. Use a 500 by 500 logical car area centered at (250,250). Wheels are centered at (125,375) and (375,375), with black radius 50 tires and gray radius 40 hubs. The red body starts at (50,200), size 450 by 150; its top starts at (50,100), size 200 by 120. Add a black roof at y 105, a slanted windshield, and a 20 by 20 yellow light at (475,225). Align the pieces before animating them.

`svg.append("rect").attr("x",50).attr("y",200)` creates a rectangle and sets its coordinates; width, height and fill are separate attributes. SVG y increases downward. Later shapes draw over earlier ones. Keep the tires behind the body. Change one body color and one wheel dimension, then verify that both sides still align.

## Run and coordinate space

Open index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.

## D3 transitions and events

Create shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.

Check the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser's reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.

References: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).

## Original activity

Adapted from [Juni Learning’s original starter activity](https://codepen.io/junilearning/pen/38ef977913b6ce7e1a913883f984a4e5).
