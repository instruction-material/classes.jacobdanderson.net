# Bouncing and Growing

Move a steel-blue ball from(40,100) to (500,100) on a 1000 by 500 SVG over 2000 milliseconds while growing its radius from 20 to 40. Then return to (40,100) and radius 20 over another 2000 milliseconds. Radius 40 is double the starting radius; its diameter doubles too. A ball of radius 50 would be 2.5 times the original radius.

Put the cx and r changes on the same transition so movement and growth happen together. Chain the return transition after it. Check both midpoint targets and the final position and size. Reload to repeat. Reduced motion keeps the initial position and radius.

## Run and coordinate space

Open index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.

## D3 transitions and events

Create shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.

Check the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser's reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.

References: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).

## Original activity

Adapted from [Juni Learning’s original starter activity](https://codepen.io/junilearning/pen/5e44ed4c619e2a3e960ba5cdf6ab067f).
