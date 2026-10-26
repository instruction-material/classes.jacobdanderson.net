# Moving Your Car

This worked example moves all nine car parts 700 SVG units to the right in 1500 milliseconds. Draw the car first. `svg.selectAll("*").transition().duration(1500).attr("transform","translate(700)")` selects every part and starts their transitions together. A duration is measured in milliseconds; a translation changes position without changing the original shape coordinates. A group containing the car is another way to move the parts together.

Use a 1400 by 500 viewBox so the car's final right edge at 1200 remains visible. Change 700 to 500 and predict the new final position before running. Reload to repeat the single trip. With reduced motion requested, this example shows the final position immediately.

## Run and coordinate space

Open index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.

## D3 transitions and events

Create shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.

Check the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser's reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.

References: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).

## Original activity

Adapted from [Juni Learning’s original example activity](https://codepen.io/junilearning/pen/46c3f402eb4100c983f22bbbb3f4cede).
