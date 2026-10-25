# DOM Events

This worked example draws a 100 by 100 red square at (100,100) on a 750 by 750 SVG. `rect.on("click", turnPink)` registers a callback on the selected rectangle. Pass the function itself; `turnPink()` would call it immediately while registering. The callback transitions the fill to pink. The method is `selection.on(...)`, so call it on `rect`, not on the top-level `d3` object.

Click the square twice: the first changes red to pink, and the second leaves it pink because both callbacks request the same final color. The rectangle is also keyboard focusable; Enter and Space trigger the same callback. Change pink to another CSS color and verify mouse, keyboard and touch activation. Reduced motion applies the color immediately.

## Run and coordinate space

Open index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.

## D3 transitions and events

Create shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.

Check the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser's reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.

References: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).

## Original activity

Adapted from [Juni Learning’s original example activity](https://codepen.io/junilearning/pen/BajVdPQ).
