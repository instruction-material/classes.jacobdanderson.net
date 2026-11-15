# Circles Collide

Open index.html without a server. The 800-by-500 canvas begins with black circles at (50,250) and (500,250), both radius 20. Every 10 ms, move the first center one unit right and the second one unit left. They pass through each other; this assignment detects contact rather than simulating an elastic bounce.

Complete updateCircles and circlesTouch in the starter. The drawing loop is supplied. Calculate dx=a.x-b.x,dy=a.y-b.y and radius=a.size+b.size. Pythagoras gives distance squared=dx*dx+dy*dy. Contact or overlap means distance squared <= radius*radius. Change both circles to blue while true and black when separated. The size property is the radius.

Initially the distance is450. After 204 ticks it is42: black. Tick 205 gives centers255 and295, distance40: blue at exact contact. Tick 225 gives the same center: blue. Tick 245 touches again after passing;tick 246 separates and is black.

The original reference uses strict horizontal overlap on a shared row and logs every tick. This complete reference applies the lesson's inclusive contact rule on both axes and keeps the original canvas, colors and movement. Different y values and unequal radii work. Faster motion may skip an entire contact interval between samples; continuous collision detection is a separate extension.

Save a working checkpoint and demonstrate separated,touching,overlapping and separated-again states. CASES.md includes exact inputs and outputs.
