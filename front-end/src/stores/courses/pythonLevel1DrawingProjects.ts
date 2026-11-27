import type { RawCourseModuleItem } from "./types";

const drawingSource =
	"https://github.com/instruction-material/Python-Level-1/tree/5445f3f97e45f732a6049fab6152b49017c95f82";

const loopStateSource =
	"https://github.com/instruction-material/Python-Level-1/tree/7ae88632fdd8788a8ec739fb345662e083294f31";

const nestedLoopsSource =
	"https://github.com/instruction-material/Python-Level-1/tree/0295dc97c52e6de3360606dcba77d3466c4a75c6";

const functionsEventsSource =
	"https://github.com/instruction-material/Python-Level-1/tree/31948d78c17d1d3496e6ff02d6cf54d03362ea4f";

const parameterGeometrySource =
	"https://github.com/instruction-material/Python-Level-1/tree/0cd00416bfde88d8036a3c9b77585acaa829bb42";

interface DrawingBrief {
	task: string;
	classroom: string;
	title?: string;
	previousId?: string;
	source?: string;
}

const briefs = {
	"GrS8-Build-a-Snowman": {
		source: parameterGeometrySource,
		task: `**Concept focus:** A parameter gives one function a named input. Here \`disk(x, y, radius)\` takes the center and size each time. Turtle begins a positive-radius circle at its bottom, so the helper moves to \`(x, y - radius)\` and faces right before drawing.

Add a head centered at (0, 58) with radius 19 using the same helper as the body. Lift the pen, place two navy eyes at x = -6 and 6 with y = 62, then place an orange nose at (0, 52).

**Checkpoints:** The three radii are 37, 27, and 19. All centers share x = 0, and the adjacent disks meet. Changing the head radius changes the head only.`,
		classroom: `**Concept focus:** Trace each call to the same function body. The center and radius are new for each call, and the expression y minus radius picks the bottom edge.

**Normal:** In \`normal_addition()\`, print the bottom y-coordinate for the body disks and head. Expect -89, -15, and 39. Match those positions to the reference scene.

**Hard:** In \`hard_addition()\`, draw a second smaller snowman at x = 85 with centers y = -45, -15, and 6. Use radii 17, 13, and 8. Add the same two eye positions relative to its center.

**Checkpoints:** Adjacent circles touch and the first snowman stays visible. The original helper is called for all six circles.`
	},
	"GrS8-More-Functions": {
		source: parameterGeometrySource,
		task: `The program has a square helper and a triangle helper. Each accepts \`length\` and leaves the pen at its starting position. The start position and color come from the separate \`place\` function, which lifts the pen before moving it.

Use the current parameter values to draw a triangle after each square. The three columns use lengths 18, 30, and 42. In each column, compare the lower square and upper triangle before moving to the next size.

**Checkpoints:** Count 12 square edges and nine triangle edges. Change only the 30 argument to 34 and check the two shapes in that column.`,
		classroom: `**Normal:** In \`normal_addition()\`, draw one square with length 20 and one triangle with length 36 at separate positions above the two rows. Report the pen position at the end of each outline. Each endpoint should match the position passed to the placement helper.

**Hard:** In \`hard_addition()\`, swap the square and triangle sizes in a new pair. Keep their centers and colors easy to distinguish from the original three pairs.

**Checkpoints:** Observe that the number of sides comes from the function. The argument changes how long each edge is.`
	},
	"GrS9-Polka-Dots-Parameterized": {
		source: parameterGeometrySource,
		task: `Pass the click coordinates, dot diameter, and color as arguments to \`draw_dot\`. In the callback, replace the constant diameter with \`10 + min(20, abs(round(x)) // 5)\`. It grows in steps of one pixel with horizontal distance and reaches a maximum diameter of 30. The left half uses orchid and the right half uses teal.

Use clicks or taps at the center, edges, and corners. Compare points the same distance left and right of the center.

**Checkpoints:** x = 0 gives diameter 10. x = -40 and x = 40 both give diameter 18 but different colors. The dots remain centered on the clicks.`,
		classroom: `**Normal:** In \`normal_addition()\`, call \`place_dot\` at (-40, 20), (0, 20), and (40, 20). Match printed diameters 18, 10, and 18 to the three marks. Confirm the coordinates are passed to the helper without rounding away their sign.

**Hard:** In \`hard_addition()\`, write a new callback that uses distance from the horizontal axis for diameter and changes color by the sign of y. Register it with \`screen.onclick\`.

**Checkpoints:** Tap at two settings above and below the axis to compare size and color. The new marks still use the same drawing helper.`
	},
	"GrS9-Click-and-Draw-Rectangle": {
		source: parameterGeometrySource,
		task: `Use \`dimensions(x, y)\` to convert the click coordinates into positive side lengths. Width already uses the magnitude of x and stays between 12 and 105. Give height the same calculation with y and bounds 12 and 72. The callback passes the two values to \`draw_rectangle\`, which centers the result and reports its dimensions.

Trace four clicks with x = 40 or -40 and y = 30 or -30. Then try the center and a point near the edge.

**Checkpoints:** All four sign combinations give 40 by 30. A click near the origin cannot produce zero sides. A very large click produces no side beyond its cap.`,
		classroom: `**Normal:** In \`normal_addition()\`, print \`dimensions(-40, 30)\`, \`dimensions(0, 0)\`, and \`dimensions(200, -200)\`. Expect (40, 30), (12, 12), and (105, 72). Draw one of those pairs directly to distinguish the click conversion from the drawing helper.

**Hard:** In \`hard_addition()\`, bind another pointer callback with height capped at 48. Keep the existing rectangle drawing routine in use. Compare its color choices for one wide and one tall click.

**Checkpoints:** A click with a large vertical magnitude stays within the new cap, and all four corners still close.`
	},
	"GrS7-Any-Shape-Staircase": {
		source: parameterGeometrySource,
		task: `Complete \`draw_shape(length, sides)\` by setting the exterior turn to 360 divided by the number of sides. The caller places each shape one step higher and to the right. It passes a fixed length of 23 and successive side counts 3, 4, 5, and 6. Keep positioning outside the helper.

Draw one triangle first and compare where the pen starts and ends. Repeat for all four shapes. Predict the turn for each before running.

**Checkpoints:** The turns are 120, 90, 72, and 60 degrees. The complete staircase has 18 edges. Every outline returns to its own starting point.`,
		classroom: `**Normal:** In \`normal_addition()\`, draw a pentagon with length 15 at (-100, 55) using the shape helper. Print the calculated turn and the final coordinates. Expect 72 and the starting point.

**Hard:** In \`hard_addition()\`, draw two more steps using two different side lengths and side counts. Give each step a planned coordinate and predict the turn once per shape before the program runs.

**Checkpoints:** Print the result of each closure check. Only the caller changes size or position between steps, and the existing helper handles all supported polygons.`
	},
	"GrS7-Square-Inception-with-Functions": {
		source: parameterGeometrySource,
		task: `A square can be drawn by one function, \`draw_square(length, red, green, blue)\`. The current starter repeats length 18 for every call. Pass the current value from the size loop so each group has sides 18, 34, and 50. The outer loop supplies a group color and turns after each finished group.

Trace how the color changes between groups while size changes within a group. List the first four values passed into the helper and describe the job of each parameter.

**Checkpoints:** Expect 12 squares and 48 edges. Changing one size argument should affect that layer across all four groups.`,
		classroom: `**Normal:** In \`normal_addition()\`, use the helper to draw one 24-pixel square in a separate location with an RGB color of your choice. Then draw it again with length 36 and the same color at that location. Follow the two calls through the same four-edge function.

**Hard:** In \`hard_addition()\`, place a second group at a different origin. Keep the supplied size sequence and compute a different color for each size. The helper should remain unchanged.

**Checkpoints:** Expect two independent patterns and three distinguishable layers in the added group.`
	},
	"Rainbow-Square-Inception": {
		source: parameterGeometrySource,
		task: `**Concept focus:** The outer loop sets a color and a group heading. The middle loop selects one of four lengths. The inner loop draws four equal sides and returns to its starting heading. Together the loops draw 24 groups with 15-degree turns between them.

Add 23 to blue after a group and use the remainder after division by 256 as the next blue channel. Every channel passed to Turtle must be between 0 and 255.

**Checkpoints:** Start at blue 20. The eleventh group uses 250 and the next uses 17. Count 96 squares and 384 edges. Each group resets the size sequence.`,
		classroom: `**Concept focus:** Track length and blue in separate columns. Length resets from the same four values each group, while blue carries forward and wraps at 256.

**Normal:** In \`normal_addition()\`, print blue for groups 11 and 12. Expect 250 and 17. Report the shape and edge totals as 96 and 384.

**Hard:** In \`hard_addition()\`, draw a small four-group inset. Turn 90 degrees between groups and start its blue channel at 240, increasing by 23 for each group. Use two lengths per group to make the layers easy to see.

**Checkpoints:** The inset uses blue values 240, 7, 30, and 53. Its total is eight squares.`
	},
	Snowflake: {
		source: parameterGeometrySource,
		task: `**Concept focus:** One arm contains six levels. A level moves along the main ray, draws a twig on each side, and returns to the ray after both twigs. The top-level loop repositions the pen at the center and rotates the starting direction for the next arm.

Change the twig argument from zero to 10. Start each arm in one of six directions 60 degrees apart. Trace one twig as a forward and backward pair, then compare its endpoint with the point before the pair.

**Checkpoints:** Count six arms and 12 twigs per arm. Each arm ends 54 pixels from the center. Pen-up moves leave no lines between arms.`,
		classroom: `**Concept focus:** Each twig is a round trip along one direction. The pair adds visible strokes without advancing the pen down the central ray.

**Normal:** In \`normal_addition()\`, draw a single shorter arm at (85, -45) with step 5 and twig 6. Set its heading to zero and measure its last point. Expect x = 115 with the same y-coordinate.

**Hard:** In \`hard_addition()\`, add a four-arm inset around another center. Use short dimensions, lift the pen to recenter, and set a 90-degree change in heading for each arm.

**Checkpoints:** The four-arm version has 48 twigs and the rays reach the same distance from their new center.`
	},
	"GrS10-Winter-Wonderland": {
		source: parameterGeometrySource,
		task: `Call \`draw_flake\` once at each of six supplied centers. The starter samples three values but passes constant values into the function. Pass the sampled arm count, length, and twig size instead. The ranges are 5 to 7 arms, 20 to 38 pixels for the main ray, and 4 to 7 pixels per twig.

Trace the first flake's center and sampled values. Predict how many main steps it draws using five per arm. Run again and confirm that a new sample changes the shapes without moving the centers.

**Checkpoints:** Expect six centers and consistent placement on every run. The main steps add up to the supplied arm length.`,
		classroom: `**Normal:** In \`normal_addition()\`, draw a fixed sample at (0, 0) with five arms, length 20, and twig 4. Check that each main arm advances four pixels per level and that its last point is 20 pixels from the center.

**Hard:** In \`hard_addition()\`, use a trace table and draw a comparison pair with equal length but different arm counts. Put the pair in clear positions between the original rows and use small dimensions.

**Checkpoints:** Arm counts change the angle between rays. Equal total length gives the same distance from each center after the final level.`
	},
	"GrS6-Spiral-Staircase": {
		source: parameterGeometrySource,
		task: `The outer loop draws 24 rotated squares. Inside each loop, keep the same side length for its four edges and return to the starting point. Change length by three after each square. A 15-degree turn between squares makes the increasingly large outlines resemble a spiral staircase.

Trace lengths 12, 15, and 18 on the first three outer passes. Compare the repeated drawing with the starter, where the square size remains fixed. Keep color independent from length.

**Checkpoints:** The last square has side length 81 and the value after the final update is 84. Count 96 edges.`,
		classroom: `**Normal:** In \`normal_addition()\`, print the first drawn length, the last drawn length, and the next unused value. Expect 12, 81, and 84. Explain which loop boundary must be reached before the size changes.

**Hard:** In \`hard_addition()\`, add a small four-square sample with start length 8 and an increase of two. Compare its 30-degree group turns to the reference's 15-degree turns. Place it away from the larger pattern.

**Checkpoints:** The sample uses lengths 8, 10, 12, and 14. Changing the turn does not change the length sequence.`
	},
	"GrS6-Dizzy-Hexagon": {
		source: parameterGeometrySource,
		task: `Draw 100 hexagons. Each starts from a new position by lifting the pen, returning to the origin, setting its heading to 12 times the index, and traveling index divided by four pixels. Complete the pen-up movement before drawing. Then use six moves with 60-degree turns to close the current hexagon.

Start by tracing indices 0, 4, and 8. The length grows in steps of one every four shapes. The center sweeps around while the distance from the origin grows.

**Checkpoints:** A four-shape run has 24 edges, and the full run has 600. No travel line connects different starts.`,
		classroom: `**Normal:** In \`normal_addition()\`, print start distances for indices 0, 4, and 8 and the side lengths for those indices. Expect 0, 1, and 2 for distance and 18, 19, and 20 for side length.

**Hard:** In \`hard_addition()\`, draw a short six-hexagon comparison near (100, 0), with a constant length and an increasing pen-up radius. Explain which of those rules affects the outline and which affects its placement.

**Checkpoints:** The comparison has six closed outlines, six separately traceable starts, and no connector segments.`
	},
	"GrS6-Dot-Grid": {
		source: parameterGeometrySource,
		task: `The outer loop selects a row and the inner loop selects a column. Complete the y-coordinate so each new row subtracts \`row * spacing\` from the initial height. Keep the pen lifted while moving between points and use the supplied dot size. The x-coordinate starts at -88 and grows by 25 for each column.

Trace the first and last dot of row zero before adding the rest. Change the row count independently of the column count and predict the resulting number of dots.

**Checkpoints:** The default grid has 40 dots. The last point is (87, -50). Each new row restarts at x = -88.`,
		classroom: `**Normal:** In \`normal_addition()\`, print all y-coordinates and count all dots. Expect [50, 25, 0, -25, -50] and 40. Identify why moving to a new column leaves the current y-coordinate unchanged.

**Hard:** In \`hard_addition()\`, use two nested loops to draw a smaller two-by-three marker grid with spacing 12. Use a distinct color, avoid overlapping the original dots, and print the first and last points.

**Checkpoints:** The small grid has six dots and no lines between them. The original grid still has five rows of eight.`
	},
	"GrS6-Build-a-Neighborhood": {
		source: functionsEventsSource,
		task: `The starter contains a function that draws a 32-pixel square body from the given coordinates. In \`draw_house(x, y)\`, place a second outline with its base on top of the body at \`(x, y + 32)\`. Use three 32-pixel moves and left turns of 120 degrees to close the roof. Lift the pen between parts with \`move_to\`.

Call the same function at (-85, -35), (-16, -35), and (53, -35). Trace one call from the first argument through both shapes before running all three.

**Checkpoints:** Count three matching houses and 21 edges. Each roof meets its own 32-pixel body. The spaces between houses stay clear.`,
		classroom: `**Concept focus:** A definition gives the body-and-roof steps one name. During a call the arguments determine where those same steps run. Trace how \`draw_house(-16, -35)\` carries x unchanged from the body to the roof and adds 32 only to y.

**Normal:** In \`normal_addition()\`, use the existing function to place a fourth house at (-85, 35). Run the program and confirm that the new roof starts at y = 67.

**Hard:** In \`hard_addition()\`, write a two-argument door helper and call it for every house in the first row. Use an 8-by-13 outline, position it away from the edge, and lift the pen between houses.

**Checkpoints:** Three matching doors appear in the first row. The fourth house stays intact and the last door closes at its starting coordinate.`
	},
	"GrS7-Basic-Functions": {
		source: functionsEventsSource,
		task: `Trace the line where \`all_random()\` calls \`random_spot()\`. Add the call to \`random_color()\` inside the same function. Each call moves the pen to a fresh position with the pen lifted, chooses one RGB color, and leaves drawing to the outer loop. The supplied \`reset()\` clears old marks and restores the origin, black color, and heading zero.

**Checkpoints:** Count five separate 24-pixel strokes. Identify which function starts a new color, which moves to a new position, and which restores the pen. Call \`reset()\` and check that the previous picture disappears.`,
		classroom: `**Normal:** In \`normal_addition()\`, call \`all_random()\` twice and draw one short stroke after each call. Print each sampled start position so the two executions can be traced separately.

**Hard:** In \`hard_addition()\`, use \`reset()\`, then draw three new strokes using one loop. Print the position and heading immediately after the reset. Update the screen after the new drawing.

Read the two helper bodies side by side. Predict which values remain unchanged when the pen moves, then print its heading before and after one call to \`all_random()\`.

**Checkpoints:** The reset reports (0, 0) and heading 0. The new picture has three strokes and clear gaps between their random starts.`
	},
	"Event-Listener-Discovery": {
		source: functionsEventsSource,
		task: `Run the starter and click or tap the canvas near its center. The pointer callback receives x and y, moves with the pen lifted, and calls the square function. Add \`screen.onkey(draw_square, "s")\` before \`screen.listen()\` to call that same function from the keyboard. Pass the function name so Turtle can call it when the key is released.

**Checkpoints:** Focus the canvas and press s. The square starts and ends at the current pen position. Clicking another point makes the next square start there. One action prints one confirmation.`,
		classroom: `**Concept focus:** Calling \`draw_square()\` executes it immediately. Passing \`draw_square\` to \`screen.onkey()\` gives Turtle the function so it can run it on release. Use one direct call and then one key press to observe the difference in timing.

**Normal:** In \`normal_addition()\`, call \`draw_square()\` once from the origin and verify that its endpoint and heading match the start.

**Hard:** In \`hard_addition()\`, bind a new key to a named callback that draws a closed three-sided figure. Register the function before the screen starts listening. Check that the original s key and pointer action still draw squares.

Tell the two square inputs apart by reporting the starting point before each. The key uses the current point, while the pointer supplies a new point.

**Checkpoints:** The added key draws once per release. The new callback uses three exterior turns of 120 degrees.`
	},
	"Etch-A-Sketch": {
		source: functionsEventsSource,
		task: `Connect the Right arrow to the supplied \`turn_right\` callback. Use Up and Down for a 14-pixel forward or backward movement. Left and Right turn by 30 degrees. Each callback handles one action, so turns change direction while leaving the pen position alone.

Focus the canvas for the arrow keys. For touch input, tap near a canvas edge. Top and bottom move, and left and right turn. The pointer callback selects the axis farther from the center.

**Checkpoints:** Starting at the origin, Up then Down returns to (0, 0). Left then Right restores the starting heading. A forward move after a turn makes a new angled segment without restarting the program.`,
		classroom: `**Normal:** In \`normal_addition()\`, call \`move_forward()\` and \`move_backward()\` once each. Print the final point and current heading. Expect (0, 0) and heading 0.

**Hard:** In \`hard_addition()\`, bind c to a clear-and-home callback. Clear with \`pen.clear()\`, lift the pen before returning to (0, 0), restore heading 0, and lower the pen again.

Turn Left once before pressing Up. Record the new heading and explain why repeating Up advances along the same slanted line until a turn changes it.

**Checkpoints:** After using c, the canvas is clean and the original arrows still respond. Moving from the reset position leaves no stray travel line.`
	},
	"Picasso-Game": {
		source: functionsEventsSource,
		task: `Make an art tool that can draw a square, octagon, burst, and circle. The starter sets a new bounded position and color at the beginning of each mark. Connect the Right arrow to \`draw_circle\`. The Up, Down, and Left keys already draw the first three marks.

Focus the canvas for keys. Tap top left for a square, top right for an octagon, bottom left for a burst, and bottom right for a circle.

**Checkpoints:** Each action shows one new mark. A square has four edges, an octagon has eight, and a burst has twelve rays with no return strokes. Travel between marks leaves no lines.`,
		classroom: `**Normal:** In \`normal_addition()\`, draw one square and one octagon using the existing callbacks. Count their four and eight sides.

**Hard:** In \`hard_addition()\`, bind t to a new triangle callback. Use the shared setup for placement and color, then close the outline with three sides and 120-degree turns.

Trace \`start_mark\` on two separate calls. Each call samples fresh x and y values and a color. The number of sides stays fixed within each shape callback.

**Checkpoints:** The new key draws a third kind of polygon and the original four actions are still available.`
	},
	"GrS9-Polka-Dots": {
		source: functionsEventsSource,
		task: `Change the fixed dot diameter in \`stamp_dot()\` to a random integer between 8 and 26 chosen on each call. Keep the random color in the same callback. Focus the canvas and use arrows to move or turn, then use Space to stamp. Clicking or tapping places a dot directly at that point.

**Checkpoints:** Stamping twice at one spot can draw dots with different diameters. Arrow movement leaves the canvas clean until a dot is stamped. Confirm that all diameters stay within the allowed range.`,
		classroom: `**Normal:** In \`normal_addition()\`, move to the right with one \`move_forward()\` call, then call \`stamp_dot()\`. Report the current coordinates. Expect (12, 0) with no travel stroke.

**Hard:** In \`hard_addition()\`, bind c to clear the marks while keeping the pen at its current coordinates. Preserve the arrow keys and Space.

Log the sampled diameter once per stamp. Moving the pen should leave the count of logged diameters unchanged, while a touch should add one new value.

**Checkpoints:** After c, the next Space stamps at the same point. Tap a different position and check that the dot is centered on the tap.`
	},
	"GrS8-Fruit-Stand": {
		source: functionsEventsSource,
		task: `Complete the binding from number 3 to \`cherry\`. Use 1 for the orange, 2 for starfruit, and 3 for the cherry. Each fruit uses a shared positioning helper with the pen lifted. A tap chooses fruit by column, from left to right.

Trace number 2 from \`screen.onkey()\` to \`starfruit()\`. A 144-degree turn walks the five outer points in a crossing path. The other two callbacks use circular marks.

**Checkpoints:** The orange is a closed circle in the left column. The middle column shows a five-point fruit. The right column shows a red cherry with a green stem. No lines connect the three columns.`,
		classroom: `**Normal:** In \`normal_addition()\`, call all three fruit functions directly. Trace how \`move_fruit\` gives each one a different starting position.

**Hard:** In \`hard_addition()\`, bind 4 to a new fruit shape in a second row. Use the positioning helper for at least two parts of that fruit and keep the first three bindings working.

Compare the second-row start to the first three y-coordinates. Place it far enough away for the whole new mark to fit without crossing another fruit.

**Checkpoints:** All original fruit remain separate. The fourth fruit has its own visible outline and position.`
	},
	"GrS8-Picasso-Game": {
		source: functionsEventsSource,
		task: `Complete the example's binding from number 3 to \`reveal_petals\`. The three stage functions reveal a base, a stem, and petals in order. Try pressing 2 first, then 1, 2, 3, and r. A key for the wrong stage leaves the picture unchanged. Tap the canvas to advance, or tap near the bottom edge to reset.

Plan an original three-part design using the same ordered state. Name the key, expected state, and next state for each part before replacing the drawing functions.

**Checkpoints:** Repeating a completed stage has no effect. Reset removes every part and allows the first action again. List the three controls and the reset key in a comment.`,
		classroom: `**Normal:** In \`normal_addition()\`, call \`reveal_stem()\` before \`reveal_base()\` and print the current stage after each action. Expect 0 and 1. Reset before demonstrating the complete sequence.

**Hard:** Extend the scene with a fourth gated part, such as two leaves after the petals. Bind a new key within \`hard_addition()\` and check that the fourth action is ignored until stage 3. Add the same action to the tap sequence.

**Checkpoints:** Run the sequence with keys and again with taps. Repeating an action should add nothing, and reset returns the stage to 0.`
	},
	"Nested-Loops-Exploration": {
		source: nestedLoopsSource,
		task: `Run the starter and trace a single square from (0, 0). Four 90-degree turns restore its starting heading. The three outer passes currently retrace that square. Complete the update after the inner loop so the lengths are 30, 50, and 70. Keep one length for all four sides of a square.

**Checkpoints:** Count three completed squares and 12 forward moves. After each inner loop the pen is back at (0, 0) facing right.`,
		classroom: `**Normal:** In \`normal_addition()\`, print the lengths used by the three squares and the next length. Expect [30, 50, 70] and 90.

**Hard:** In \`hard_addition()\`, place the pen at (-90, -55) and draw a second group of three squares using lengths 10, 20, and 30. Run the inner loop four times for each length and report the final position.

Mark the first inner-loop entry and final exit in a trace table. The side length stays constant on every row belonging to the same square.

**Checkpoints:** The second group has 12 strokes and closes at (-90, -55).`
	},
	"Square-Inception": {
		source: nestedLoopsSource,
		task: `The middle loop draws three squares from the origin with lengths 30, 50, and 70. Complete the turn at the end of the outer loop so each finished group is followed by a 90-degree clockwise rotation. Keep the size reset inside the quadrant loop and outside the square loop.

Make a trace table with one row per quadrant. Enter the starting heading and the reset length before drawing the first square. Fill the third row while stepping through the example.

**Checkpoints:** The four groups start facing east, south, west, and north. Expect 12 squares and 48 forward moves. The same three lengths appear in each quadrant.`,
		classroom: `**Normal:** In \`normal_addition()\`, print the number of quadrants, squares, and sides drawn. Expect 4, 12, and 48.

**Hard:** In \`hard_addition()\`, draw two groups of three small triangles at a second origin. Start with sides 8, 13, and 18. Turn 120 degrees per edge and add a separate 180-degree turn after each group.

Predict the heading at the start of each small triangle. Three 120-degree turns restore it, so only the outer turn changes the direction for the second group.

**Checkpoints:** The triangle groups face opposite ways. Expect 18 new edges and the same three lengths in both groups.`
	},
	"GrS5-Pyramid": {
		source: nestedLoopsSource,
		task: `Draw ten aligned triangle outlines. Start from the supplied apex (0, 65) facing 300 degrees. The inner loop makes three equal moves with 120-degree right turns. Increase length by 15 after all three sides.

With the first triangle in view, compare one point at the end of the first side with the same point on the final triangle. Both lie on the same ray from the apex, at different distances.

**Checkpoints:** The first side length is 15 and the final one is 150. Each triangle closes at the shared apex. Expect 30 sides.`,
		classroom: `**Normal:** In \`normal_addition()\`, print the first drawn length, the last drawn length, and the next length. Expect 15, 150, and 165.

**Hard:** In \`hard_addition()\`, place the pen at (105, 40) with heading 300. Draw three outlined triangles sharing this apex with lengths 12, 24, and 36.

Trace length 12 for three consecutive moves. Write length 24 on the next row only after returning to the apex. The first side of each triangle follows the same direction.

**Checkpoints:** Each of the three inner loops returns to (105, 40) with its starting heading.`
	},
	"GrS5-Reverse-Pyramid": {
		source: nestedLoopsSource,
		task: `Use the same apex as Pyramid and draw filled triangles from largest to smallest. Start with length 150 and subtract 15 after each finished fill. One random color and one fill surround each complete three-side loop.

Trace the largest fill and the next fill on two rows. Record the side length and exact starting coordinate for each. The second shape covers only the smaller region at the shared apex.

**Checkpoints:** The final filled triangle uses length 15. Its smaller footprint leaves room to see the preceding layers. Confirm that the pen always returns to the apex.`,
		classroom: `**Normal:** In \`normal_addition()\`, print the ten lengths in drawing order. Expect [150, 135, 120, 105, 90, 75, 60, 45, 30, 15].

**Hard:** In \`hard_addition()\`, draw a separate stack of three filled triangles with lengths 36, 24, and 12 at (-100, 40). Use three clearly different colors and end each fill before moving to the next length.

Before adding the separate stack, trace the reference's first two calls to \`end_fill()\`. Compare which region is covered by each and which edge remains visible.

**Checkpoints:** All three bands are visible and their triangles share a starting point.`
	},
	"GrS5-Reverse-Square-Inception": {
		source: nestedLoopsSource,
		task: `Fill three squares in each quadrant. Complete the middle-loop update so the lengths descend from 72 to 52 to 32. Keep the four side commands inside one fill. The color ranges become lighter for smaller layers to keep the boundaries visible.

Trace the three fill calls in one quadrant. Record color only when a new layer begins and keep the color constant during the four draws that close it.

**Checkpoints:** Expect 12 filled squares and 48 drawn edges. Every quadrant resets to length 72 and turns only after its last square closes.`,
		classroom: `**Normal:** In \`normal_addition()\`, print the three lengths and the number of sides they require in one quadrant. Expect [72, 52, 32] and 12.

**Hard:** In \`hard_addition()\`, place the pen at (110, 5). Fill three closed squares at that origin with lengths 36, 24, and 12, using three different shades.

Record the colors in drawing order and verify them by looking from the outside toward the origin. Each smaller shape exposes at least one boundary of the preceding larger one.

**Checkpoints:** The fourth edge closes each shape before the next fill starts. All three layers are visible.`
	},
	"GrS5-Rainbow-Flower": {
		source: nestedLoopsSource,
		task: `Draw six petals from (0, 0), with starting headings 60 degrees apart. Each petal uses 40 strokes. The turn grows by one degree after each stroke. Complete the blue-channel update by adding five after each stroke. Reset the angle and blue channel at the start of every petal.

Trace angle values 0, 1, and 2 for the first three strokes separately from the color values 0, 5, and 10. Each update prepares the next stroke.

**Checkpoints:** Expect 240 strokes. The blue values used by each petal start at 0, reach 5 on the second stroke, and end at 195.`,
		classroom: `**Normal:** In \`normal_addition()\`, print the six start headings and the first and last blue values. Expect [0, 60, 120, 180, 240, 300] and 0 and 195.

**Hard:** In \`hard_addition()\`, build a separate four-petal design. Start 90 degrees apart and use 20 strokes of length 5 per petal. Track blue changes in steps of 8.

**Checkpoints:** Expect 80 strokes and a last blue value of 152 per petal. Each petal returns to the center with the pen lifted before the next starts.`
	},
	"GrS5-Circle-of-Circles": {
		source: nestedLoopsSource,
		task: `Draw a small loop using 36 short segments of six pixels. Turn right by ten degrees after each segment. Complete the outer-loop turn of 20 degrees after each finished circle. Keep that extra rotation outside the inner loop.

Predict the difference between putting the 20-degree turn in the inner loop and putting it after the inner loop. Try just one circle first and check whether the pen returns to the starting point.

**Checkpoints:** The inner loop turns through 360 degrees and returns to its start. The 18 outer turns account for a second full revolution. Count 648 short segments.`,
		classroom: `**Normal:** In \`normal_addition()\`, print 36 times 10, 18 times 20, and 18 times 36. Expect 360, 360, and 648.

**Hard:** In \`hard_addition()\`, draw six smaller loops at (-90, 0). Make each loop from 12 steps of three pixels with a 30-degree turn, then turn 60 degrees to start the next loop.

The first inner loop uses 12 times 30 degrees. Predict the starting heading of the second loop after that full turn and the separate 60-degree rotation.

**Checkpoints:** All six loops share the starting point and use 72 new strokes.`
	},
	"GrS3-Spirals": {
		source: nestedLoopsSource,
		task: `Draw one spiral in each of the six supplied cells. Lift the pen to reach each randomized start. Each inner loop uses 32 forward strokes and a 123-degree left turn. Complete the growth step so each stroke is one pixel longer than the preceding stroke.

Record the first five lengths and compare the finished spiral with the constant-length starter. The direction changes by the same amount in both, so the changing length causes the outward spread.

**Checkpoints:** There are 192 strokes and no travel lines between cells. A spiral starting at length 4 ends with a drawn length of 35.`,
		classroom: `**Normal:** In \`normal_addition()\`, compute the move count and the last drawn length for a 32-stroke spiral starting at length 4. Expect 192 for all six cells and 35 for that spiral.

**Hard:** In \`hard_addition()\`, create a comparison at (0, 0) using 12 strokes starting at 4 and growing by two. Keep the 123-degree left turn. Print the final drawn length for the new and original growth rules after 12 strokes.

**Checkpoints:** Expect 26 and 15 as the final drawn lengths. Verify that both use exactly 12 turns.`
	},
	"GrS2-Basic-Shapes": {
		task: `The starter draws the square. Add the three 60-pixel sides at (80, -40) using left turns of 120 degrees. Finish with pen.circle(30) at (-100, 40). Check that the square and triangle return to their starting points and that the pen stays lifted when it moves between shapes.`,
		classroom: `**Normal:** In \`normal_addition()\`, place the pen at (80, 5) and draw a 30-pixel triangle. Compare its final position with (80, 5). Three 120-degree turns restore its starting heading.

**Hard:** In \`hard_addition()\`, use the same repeated step to draw a five-sided outline. Predict the exterior turn, 72 degrees, before running. Lift the pen to move between drawings and update the screen after the new shape.

**Checkpoints:** Both outlines close. The stroke count equals the number of sides. No travel lines appear.`
	},
	"Smiley-Face": {
		task: `Start with the filled gold head. Add one 14-by-26 rectangle at each eye coordinate (-35, 18) and (21, 18). The two shapes share the same height and mirror each other around x = 0. For the mouth, start at (-31, -17) with heading -53 and draw a 39-radius arc through 106 degrees.

**Checkpoints:** Count two eyes and one mouth. Compare the eye centers at x = -28 and x = 28. Confirm that the arc curves below its starting point and that moving between facial features leaves no lines.`,
		classroom: `Run the completed portrait. Trace how one loop draws equal rectangles at the two eye positions.

**Normal:** In \`normal_addition()\`, calculate the eye centers using half the width. Print -28 and 28 and verify the horizontal distances from the center.

**Hard:** In \`hard_addition()\`, use a loop to add two matching 8-radius cheek disks at x = -53 and 53 and y = -9. Run the same disk function twice and update once.

**Checkpoints:** The mouth and eyes stay intact. Both cheek disks share a height and lie within the head.`
	},
	"GrS2-More-Shapes": {
		task: `Complete the decagon with ten 20-pixel sides and turns of 36 degrees. Draw the teal star with five equal strokes and 144-degree turns. Place each shape with the pen up before drawing it. Use the supplied magenta hexagon as the first trace.

**Checkpoints:** Six times 60 and ten times 36 both make 360 degrees. The five-point star turns through 720 degrees. Each outline closes at its starting coordinate even though the star crosses its earlier strokes.`,
		classroom: `Run the three working outlines and trace the different turning totals.

**Normal:** In \`normal_addition()\`, print the total turn for the hexagon, decagon, and star. Expect 360, 360, and 720 degrees.

**Hard:** In \`hard_addition()\`, add a second five-point star at (-140, 100) using 32-pixel strokes. Check that its endpoint and heading match the starting values. Update the screen when the shape is complete.

**Checkpoints:** The shorter star retains its outline because the turn stays at 144 degrees. Pen-up travel keeps the other shapes separate.`
	},
	"GrS2-Bullseye": {
		task: `Finish the ring plan by adding radii 60, 40, and 20 after 100 and 80. Alternate red and white. Draw the largest disk first so each smaller disk remains visible. Each disk starts at (0, -radius) and uses heading 0, which puts the center at (0, 0).

**Checkpoints:** Count five layers. The radii decrease by 20 each time, and the final disk is red. Compare the bottom points and recover the same center from each start position.`,
		classroom: `Run the prepared target and trace how the same disk command draws every layer.

**Normal:** In \`normal_addition()\`, print the five radii and their first-to-last color sequence. Expect radii [100, 80, 60, 40, 20] and alternating red and white.

**Hard:** In \`hard_addition()\`, use disk to add a smaller three-ring target at (115, 70) with outer radius 42. Print the three bottom points and check that all three rings share a center after the translation.

**Checkpoints:** The inset target is separate from the original. Its inner disks stay visible because they are drawn last.`
	},
	"GrS2-Watermelon-Slice": {
		task: `Complete the pink fruit with the same half-circle method as the 100-radius rind. Use radius 87 and share the same straight edge at y = 0. Draw five black seeds at y = -28 with the provided x positions. Use a loop and one seed size.

**Checkpoints:** Both arcs turn through 180 degrees. The x positions -48, -24, 0, 24, and 48 are evenly spaced. With both layers present, the curved edge still shows the green rind.`,
		classroom: `Run the prepared slice and separate the shared geometry from the color of each layer.

**Normal:** In \`normal_addition()\`, print the outer-minus-inner radius and the gap between two seeds. Expect 13 and 24.

**Hard:** In \`hard_addition()\`, add a second row of three smaller seeds at x = -24, 0, and 24 and y = -51. Make each radius 2 and keep the centers aligned with three seeds in the first row.

**Checkpoints:** There are five seeds in the original row and three in the second row. The seed loops do not alter either fruit layer.`
	},
	"GrS2-Taxi": {
		task: `Keep the gold body, roof, and sign. Draw two light-blue 42-by-29 windows at the two supplied x positions. At each wheel position, draw a dark disk of radius 21 and then a hub of radius 7 at the same center. Draw the wheels after the body so the overlaps remain visible.

**Checkpoints:** The wheel centers are (-65, -36) and (65, -36). Both windows are 29 pixels tall. Check that the hubs align with the tires and that the space between the windows stays visible.`,
		classroom: `Run the complete taxi and locate the two loops that keep repeated parts consistent.

**Normal:** In \`normal_addition()\`, print the distance between the wheel centers and the difference between tire and hub radii. Expect 130 and 14.

**Hard:** In \`hard_addition()\`, use a loop to add two 5-radius lamps at x = -101 and 101 and y = -29. Give the lamps a distinct color and check that their centers mirror each other.

**Checkpoints:** Each hub stays centered inside its tire. The lamps stay within the vehicle body.`
	},
	"GrS2-Captain-America-Shield": {
		title: "GrS2 Supplemental Project 5: Compass Badge",
		previousId:
			"python-level-1-grs2-loops-supplemental-grs2-supplemental-project-5-captain-america-shield",
		task: `Draw an original compass badge with three round layers and two mirrored needles. The starter builds the navy, wheat, and dark-gray disks. In the prepared loop, call needle with each direction and color. Multiplying 61 by 1 or -1 places the two tips on opposite sides of the center.

**Checkpoints:** The disk centers are all at (0, 0). The needle tips at (61, 0) and (-61, 0) have the same distance from the center. The smallest disk covers the seam between the two directions.`,
		classroom: `Run the working badge. Compare the two triangles and the centered layers that support them.

**Normal:** In \`normal_addition()\`, print both needle tip coordinates and their absolute horizontal distances. Expect (61, 0), (-61, 0), and distances of 61.

**Hard:** In \`hard_addition()\`, place four 3-radius marks at (0, 65), (0, -65), (65, 0), and (-65, 0). Draw each with disk and choose a color with enough contrast against the center.

**Checkpoints:** All four marks are inside the smallest background disk and at the same distance from the center.`
	},
	"GrS2-Minion": {
		title: "GrS2 Supplemental Project 6: Robot Portrait",
		previousId:
			"python-level-1-grs2-loops-supplemental-grs2-supplemental-project-6-minion",
		task: `Build an original robot portrait using repeated geometric features. The starter draws the blue panel and antenna. Fill the two eye lights with rectangles of equal width and height. Draw four dark 12-by-25 grille slots at the supplied x positions. Use one loop for the eye lights and one for the grille.

**Checkpoints:** The centers of the two eyes are at x = -33 and 33. The grille slots are 22 pixels apart and share a bottom edge. Moving between parts with the pen up keeps the gaps clear.`,
		classroom: `Run the prepared robot. Find a rectangle reused for multiple features with different inputs.

**Normal:** In \`normal_addition()\`, calculate both eye center positions and the differences between consecutive grille positions. Expect centers -33 and 33 and gaps of 22.

**Hard:** In \`hard_addition()\`, add four 3-radius corner rivets at x = -73 and 73, y = -58 and 54. Use the same radius and color for all four circles.

**Checkpoints:** The existing eyes and grille stay distinct. The rivets remain inside the blue panel and maintain the same inset on opposite edges.`
	},
	"GrS3-Awesome-Angles": {
		task: `Complete the polygon helper using the supplied length and turn variables. Test length 70, degrees 90, and four sides first. Then change to three sides and 120 degrees while keeping the length the same. In each run, record which value controls the stroke length and which controls the change of heading.

**Checkpoints:** The square returns to (-35, -35) after four equal strokes. The triangle returns there after three equal strokes. Predict the result of four 120-degree turns before trying it.`,
		classroom: `Run the reference and trace how a change to one variable reaches all four turns or lengths.

**Course flow:** Begin with fixed lengths and headings. Follow the same variable pattern into the random square.

**Normal:** In \`normal_addition()\`, print length, degrees, and number_of_sides * degrees. Expect 70, 90, and 360 initially.

**Hard:** In \`hard_addition()\`, draw a second outline with three sides of length 45 and turns of 120 degrees at (50, -30). Check the final positions and headings against the square.

**Checkpoints:** Both close after one complete turn. Changing the side length changes scale without changing closure.`
	},
	"Surprise-Me-Square": {
		task: `Replace x and y with separate random integers from -125 through 45. Use a third random draw for side_length from 28 through 80, then three independent channels from 0 through 255. Keep four equal sides and four quarter turns.

**Checkpoints:** The greatest far edge is 45 + 80 = 125, so the whole drawing fits. Use fixed values x = -125 and size 28, then x = 45 and size 80, to verify both extremes before putting back the random draws. Each rerun allows different size, color, and position while the square still closes.`,
		classroom: `Run the reference and trace the six generated values into the drawing.

**Normal:** In \`normal_addition()\`, print whether x, y, side_length, and all three RGB channels are in their specified ranges. Expect six true results.

**Hard:** In \`hard_addition()\`, draw two fixed test squares at (-125, -125) and (45, 45) with lengths 28 and 80. Identify the furthest corner of the larger square and check that both outlines return to their respective starts.

**Checkpoints:** The larger square reaches (125, 125). Independent draws can return equal channel values.`
	},
	"GrS3-Random-Bowtie": {
		task: `Randomize the three pale background channels from 175 through 255. Choose one length from 45 through 100 for both filled triangles. Use the headings -30 and 150 so the halves are related by a half turn and both start at (0, 0).

**Checkpoints:** The two outlines close at the same join, even when the size changes. Their headings differ by 180 degrees. Check one minimum and one maximum size, then rerun with random values.`,
		classroom: `Run the prepared bowtie. Name the variable that keeps the two triangles the same size and the values that make them point in opposite directions.

**Normal:** In \`normal_addition()\`, print the difference between 150 and -30 and test the shared length range. Expect 180 and True.

**Hard:** In \`hard_addition()\`, translate the join to (0, -110) and use length 42 for both halves. Compare their closing points and show that translating the join leaves the heading difference intact.

**Checkpoints:** The second pair meets at the new join, and each triangle uses three equal sides.`
	},
	"GrS4-Surprise-Shape": {
		task: `Complete the missing elif cases so 0 selects a square, 1 a triangle, 2 a hexagon, and 3 the circle approximation. The function returns a name, side count, side length, and turn. Keep the prepared square and circle cases as the endpoints of the chain.

**Checkpoints:** Set the choice to 0, 1, 2, and 3 in separate runs. Expect one draw per choice, using side counts 4, 3, 6, and 36. The turn times the side count is 360 in each case. Restore the random choice after checking all branches.`,
		classroom: `Run the complete reference and read the choice printed in the console. Trace exactly one branch into a drawing.

**Course flow:** Test the four shape selections before applying combined comparisons to coordinates.

**Normal:** In \`normal_addition()\`, print the selected shape name for each value from 0 through 3. Expect square, triangle, hexagon, and circle approximation.

**Hard:** In \`hard_addition()\`, use the returned settings to calculate the total turn for each case. Change the square length for one additional drawing and confirm that the choice still returns a square.

**Checkpoints:** Every total turn is 360. Length and branch selection can vary independently.`
	},
	"GrS4-Find-Your-Turtle": {
		task: `Complete region with strict positive or negative tests for both x and y. Use and to combine signs for one quadrant. A coordinate on either axis uses the fallback, including the origin. Complete outside_box with or so either absolute coordinate above 100 causes a circle; other points get a square.

**Checkpoints:** Test (20, 20), (-20, 20), (-20, -20), and (20, -20) for I, II, III, and IV. Both (0, 20) and (0, 0) are on an axis. Compare (100, 100), (101, 0), and (0, -101) for inside, outside, and outside.`,
		classroom: `Run the example and trace the two decisions separately. One chooses the region and color. The other changes the mark near the edge.

**Normal:** In \`normal_addition()\`, print the region for all four sign combinations plus the origin. Expect I, II, III, IV, and axis.

**Hard:** In \`hard_addition()\`, test outside_box with (100, 100), (101, 0), (0, -101), and (-100, 0). Explain the exact boundary and which condition lets either coordinate trigger a change.

**Checkpoints:** The results are False, True, True, False. The axis case does not claim a quadrant.`
	},
	"GrS5-Fireworks": {
		source: loopStateSource,
		task: `Grow the ray length through reassignment. The starter draws 72 rays from the center and turns 5 degrees between them. Complete the update that increases length by 1 after each ray. Leave the pen up for the return to (0, 0) and lower it before drawing the next ray.

**Checkpoints:** Record the first three lengths, 8, 9, and 10. After 72 rays, the last drawn length is 79 and the next length is 80. The heading completes one turn. Change the starting length to 12 and predict the new first and last lengths before running.`,
		classroom: `Run the finished burst. Find the update that changes the following ray and trace how the turtle returns to the same center.

**Course flow:** Trace a reassignment in a counted loop before using a while condition to stop motion.

**Normal:** In \`normal_addition()\`, print the first length, last length, and next length using the existing variables. Expect 8, 79, and 80.

**Hard:** In \`hard_addition()\`, draw a shorter burst at (75, 55) with six 60-degree turns. Begin each ray from that center. Record the lengths and check the heading after the last ray.

**Checkpoints:** The additional rays share a center and the pen-up returns leave the bursts separate.`
	},
	"While-Loops-Exploration": {
		source: loopStateSource,
		task: `Use a while loop when the stopping rule depends on a changing position. In walk_positions, replace False with x < 0. Each loop pass adds the smaller of step and the remaining distance to zero. The supplied replay moves the turtle through that trace. It uses clear() and write() to show one position label at a time.

**Checkpoints:** From -150 in steps of 5, expect 30 moves and a final position of 0. From -151, the final move is one unit and the loop takes 31 moves. From 0 or 7, the loop runs zero times. Trace the condition before and after the last update.`,
		classroom: `Run the working stop-sign example and follow the position label to zero. Separate the while loop that calculates the trace from the timer that displays it.

**Normal:** In \`normal_addition()\`, print walk_positions(-20, 5). Expect [-15, -10, -5, 0]. Explain which comparison ends the loop.

**Hard:** In \`hard_addition()\`, run the same check from -151 and print the move count and final three positions. Test a start at zero too. Expect 31 moves, final positions [-6, -1, 0], and an empty list from zero.

**Checkpoints:** The last step is clipped to zero. The replay updates one label per position and stops at the same boundary.`
	},
	"GrS5-Square-Spiral": {
		source: loopStateSource,
		task: `Use a counter-controlled while loop to draw the square spiral. Keep counter as the number of sides already drawn and side as the next length. Complete the reassignment that adds increase to side after every right turn. The supplied counter update advances toward the limit.

**Checkpoints:** Start at length 10 and add 5 per side. The fiftieth side uses length 255, while the next length is 260. Test a limit of zero for no marks and an unchanged length. Predict the next length for a smaller test of eight sides and an increase of 2.`,
		classroom: `Run the completed spiral. Trace the counter and side length as separate values. Pause the trace after the first three right turns and predict the next length.

**Normal:** In \`normal_addition()\`, print sides_drawn and next_side. Expect 50 and 260. Calculate the length used on the last side.

**Hard:** In \`hard_addition()\`, draw a separate smaller spiral with spiral(10, 2, 8). Reposition with the pen up before starting. Compare the reported count and next length with a run at a zero limit.

**Checkpoints:** Eight sides give next length 26. Zero sides leave the initial length unchanged.`
	},
	"GrS5-Rainbow-Ninja-Star": {
		source: loopStateSource,
		task: `Draw the repeated arms and control the color progression with reassignment inside the loop. Complete the update that takes the value returned by next_channel and stores it in blue. The helper uses (current + 2) % 256 to keep the channel between 0 and 255. Lift the pen before returning to the center.

**Checkpoints:** The values begin 0, 2, and 4. After 254 the next value is 0, followed by 2. The last of 180 arms uses 102 and the next value would be 104. Check both a normal update and the wrap point.`,
		classroom: `Run the reference and trace the blue channel as it reaches the top of the RGB range and cycles back. The two other channels stay fixed while the star is drawn.

**Normal:** In \`normal_addition()\`, print next_channel for 0, 252, and 254. Expect 2, 254, and 0.

**Hard:** In \`hard_addition()\`, trace five successive values starting at 250. Store each value before updating it and print the sequence. Compare the printed values with the color changes in the reference.

**Checkpoints:** The sequence is [250, 252, 254, 0, 2], with a next value of 4. Every displayed channel remains within the RGB range.`
	},
	"GrS5-Into-the-Void": {
		source: loopStateSource,
		task: `Draw an expanding spiral using near-quarter turns. Complete the update that adds increase to length after each movement. The supplied limits begin at 30, draw 120 segments, and turn right by 91 degrees. Compare the tilted spiral with a separate run turning exactly 90 degrees.

**Checkpoints:** Trace the first three lengths, 30, 31, and 32. The last drawn segment uses 149 and the next length is 150. The two angles produce the same length sequence but change the alignment of successive passes.`,
		classroom: `Run the finished expanding design. Identify what the near-quarter turn changes while the growth rule stays the same.

**Normal:** In \`normal_addition()\`, print after_last and compare it with the length of the final drawn segment. Expect 150 and 149.

**Hard:** In \`hard_addition()\`, draw two three-step samples using length 10, increase 2, and turns of 90 and 91 degrees. Give them separate start positions and compare their final headings and returned lengths.

**Checkpoints:** Both samples return next length 16. Their final headings differ by 3 degrees.`
	},
	"GrS5-Out-of-the-Void": {
		source: loopStateSource,
		task: `Build an inward spiral with a positive movement length. Complete the update that subtracts shrink from length. The loop checks length > 0 before drawing each segment, so it stops at the first zero or negative next value. Use the supplied turn of 119 degrees to rotate the triangle-like spiral.

**Checkpoints:** From length 160 with shrink 3, the last segment has length 1. The loop ends after 54 moves with a next value of -2. An initial length of zero gives zero moves. In a separate comparison with the pen lifted, face right and try forward(-12). The turtle moves left while its heading stays the same.`,
		classroom: `Run the inward design and trace the last two lengths. The loop sends a positive distance to forward on each pass.

**Normal:** In \`normal_addition()\`, print steps and final_length. Expect 54 and -2. Explain why the final value ends the loop before the next drawing command.

**Hard:** In \`hard_addition()\`, run inward_spiral(0, 3, 119) and compare it with a separate pen-up forward(-12) from (0, 0) with heading zero. Record the move count, x-coordinate, and heading.

**Checkpoints:** The zero-length spiral draws nothing. The separate backward move reaches x = -12 while heading stays at 0.`
	}
} satisfies Record<string, DrawingBrief>;

export function pythonLevel1DrawingProject(
	folder: keyof typeof briefs,
	item: RawCourseModuleItem
): RawCourseModuleItem {
	const brief: DrawingBrief = briefs[folder];
	const source = brief.source ?? drawingSource;
	return {
		...item,
		title: brief.title ?? item.title,
		id: brief.previousId ?? item.id,
		content:
			brief.title || !item.content
				? brief.task
				: [item.content, brief.task].join("\n\n"),
		contentKind: "assignment",
		preserveInstructions: true,
		ideImport: true,
		projectLink: `${source}/${folder}/starter`,
		solutionLink: `${source}/${folder}/solution`
	};
}

export function pythonLevel1ClassroomDrawingContent(item: RawCourseModuleItem) {
	for (const [folder, brief] of Object.entries<DrawingBrief>(briefs)) {
		const source = brief.source ?? drawingSource;
		if (item.solutionLink !== `${source}/${folder}/solution`) continue;
		return folder === "GrS2-Basic-Shapes"
			? [item.content, brief.classroom].join("\n\n")
			: brief.classroom;
	}
}
