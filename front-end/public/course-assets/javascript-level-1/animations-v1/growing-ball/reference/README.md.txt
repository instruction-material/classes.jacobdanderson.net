# Growing Ball

Draw a red circle centered at (200,200) on a 750 by 750 SVG. Its starting radius is 110. On `mouseover`, transition to radius 200; on `mouseout`, return to 110. Changing only r keeps the center fixed. Interrupt the previous transition before starting a new resize so rapid pointer changes settle at the latest requested radius.

Provide a native button that toggles the same two radii for keyboard and touch users. Its label names the next action. Test repeated grow/shrink actions, pointer entry/exit, and rapid changes during a transition. The reference uses 250 milliseconds for each resize and changes immediately when reduced motion is requested.

## Run and coordinate space

Open index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.

## D3 transitions and events

Create shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.

Check the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser's reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.

References: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).

## Original activity

Adapted from [Juni Learning’s original reference activity](https://codepen.io/junilearning/pen/9d8630fbb5a9554618f11c649a95ab55).
