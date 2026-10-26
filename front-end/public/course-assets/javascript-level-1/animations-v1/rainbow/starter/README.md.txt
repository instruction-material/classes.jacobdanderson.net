# Rainbow

Draw six D3 arc bands centered at (300,300) on an 800 by 450 SVG. Use angles from -60 to 60 degrees, converted to radians with `degrees * Math.PI /180`. The outside red band's outer/inner radii are 300/280. Decrease both by 20 for orange, yellow, green, blue and violet, ending at 200/180. `d3.arc()` creates the path data; append each path before animating it.

Reveal bands from outside inward with delays 200,400,600,800,1000 and 1200 milliseconds and 150 milliseconds for each fade. The paths keep their geometry while opacity changes from 0 to 1. Use one shared center so the bands meet without overlap or gaps. With reduced motion requested, show every band immediately. Preserve `degreesToRadians` in the starter, and implement the six bands above it.

## Run and coordinate space

Open index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.

## D3 transitions and events

Create shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.

Check the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser's reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.

References: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).

## Original activity

Adapted from [Juni Learning’s original starter activity](https://codepen.io/junilearning/pen/36846ad022b36b072833ace22a9edbef).
