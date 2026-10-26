# Bouncing Ball

Create a steel-blue ball of radius 20 on a 960 by 500 SVG. Start its center at (40,250), move to (920,250) over 2000 milliseconds, then return to (40,250) over another 2000 milliseconds. Chain a second `.transition()` after the first to run the trips in sequence. Setting several `.attr()` targets on one transition changes them together. This is horizontal travel and return; gravity is not part of this assignment.

Inspect the start, far edge and final positions. Change both durations to 1000 and compare the total travel time. Reload to repeat. When reduced motion is requested, keep the ball at its starting position instead of playing automatic motion.

## Run and coordinate space

Open index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.

## D3 transitions and events

Create shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.

Check the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser's reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.

References: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).

## Original activity

Adapted from [Juni Learning’s original starter activity](https://codepen.io/junilearning/pen/6a90681824ce331a3533469f911e2497).
