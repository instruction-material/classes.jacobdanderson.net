import type { RawCourseModuleItem } from "./types";

const checkInSource =
	"https://github.com/instruction-material/Python-Level-1/tree/1bd739a53a6808fd46175cf83940b3fa4397f5f8";

const sets = [
	{
		title: "Check-In #1 Overview",
		folder: "Check-in-1",
		individual: `Complete the integrated Turtle review, then use the lesson cards to revisit any skill that needs practice.

1. Complete polygon(sides, side_length, turn) with one forward step and one right turn per side. The worksheet uses the same function for four-sided squares, two 12-sided shapes, and a 36-step circle approximation. The pen stays up while move_to repositions the turtle.
2. Replace the fixed RGB tuple with three independent random integers from 0 through 255. The side-length variable uses a separate range of 42 through 90.
3. Complete surprise_shape(number) so values below 5 select a star, 5 selects a square, and values above 5 select a triangle. Return the name, number of moves and turn angle used by the drawing call.
4. Complete position_color(x, y). Green takes priority when x is above 100 or y is below -100. A point with x and y both negative is blue otherwise. The fallback is black.

**Checkpoints:** Shape inputs 4, 5 and 6 yield star, square and triangle. Test (-40, -40), (101, 0), (0, -101) and (100, -100) for blue, green, green and black. Record one loop trace and one comparison that changes the result.`,
		classroom: `Run the completed review. Follow a pen-up move into a shape, then identify which changing value controls its size and which selects its outline.

**Course flow:** Complete one integrated readiness trace. Use Zigzag Practice when a traced repeat or turn still needs work.

**Normal:** In \`normal_addition()\`, print the shape name from surprise_shape for 4, 5 and 6. The results are star, square and triangle.

**Hard:** In \`hard_addition()\`, test position_color for (-40, -40), (101, 0), (0, -101) and (100, -100). Predict blue, green, green and black, then explain why an exact boundary remains black and why the green rule comes first.

**Checkpoint:** Use the on-screen examples to identify one move with the pen up and one shape whose size comes from a variable.`
	},
	{
		title: "Check-In #2 Overview",
		folder: "GRS-Check-in-Two-Updated",
		individual: `Trace a changing value, a parameterized drawing function, and a keyboard event in the supplied Turtle workspace.

1. In growing_lengths, keep the first side length at 10 and increase it by 5 after each recorded value, stopping growth at maximum. The while loop ends when it has collected the requested number of lengths. Test with zero repeats before drawing.
2. Complete draw_square(size) with four sides of that length and four right turns. The outer drawing loop calls it at sizes 10, 20, 30 and 40.
3. Run the file, focus the canvas and test Right for a 50-step move and Up for a triangle. Bind A to the same draw_triangle function. Pass the function itself to onkey.

**Checkpoints:** Ten lengths capped at 30 begin with 10, 15, 20, 25 and 30. Every later entry is 30. Up and A each draw a triangle. Trace one key press from its binding to the visible drawing.`,
		classroom: `Run the completed review. Follow the capped lengths into the drawing loop, then focus the canvas and use Right, Up and A.

**Course flow:** Trace one event from a key to its callback and visible result. Use Keyboard Art for extra practice connecting several events.

**Normal:** In \`normal_addition()\`, print growing_lengths(5, 20). Expect [10, 15, 20, 20, 20] and name the update that preserves the cap.

**Hard:** In \`hard_addition()\`, register S for a function that calls draw_square(30) and screen.update(). Run the callback once, then press S on the canvas. Compare the position and heading before and after drawing each square.

**Checkpoint:** Up and A still call the same triangle function. The square closes and returns the turtle to its starting heading.`
	},
	{
		title: "Check-In #3 Overview",
		folder: "GRS-Check-in-Three-Updated",
		individual: `Complete the Turtle review of nested repetition, a finite stopping rule, conditional ranges, and a list of objects.

1. In draw_shape_at, turn by 360 divided by the number of sides after each forward step. The function redraws after one complete shape. Count the edges in five squares and three triangles.
2. In count_passes, increase the counter once per iteration. Change the break condition so the function returns 5.
3. Complete range_color. Use red for 0 through 20, yellow for 21 through 40, and green for 41 through 60. Test the adjacent values at both boundaries.
4. Complete the loop that moves each turtle in swimmers backward by 30. Use the loop variable for the current turtle.

**Checkpoints:** The polygons contain 29 edges in all. Test 20, 21, 40 and 41 for red, yellow, yellow and green. Exactly three turtles move left. Continue to the target project to apply a stopping rule to interactive motion.`,
		classroom: `Run the completed review. Count the polygon edges and explain the difference between redrawing one shape and ending a program loop.

**Course flow:** Use this review to prepare for the required target project. Explain one stopping rule and one branch boundary before adding the interactive launch.

**Normal:** In \`normal_addition()\`, print count_passes() and the result of range_color for 20 and 21. Expect 5, red and yellow.

**Hard:** In \`hard_addition()\`, record the three swimmer x-coordinates, move each turtle another 10 steps backward, and print the change for each one. Update the screen once. Expect -10 three times.

**Checkpoint:** Changing the number of turtles changes how many updates the loop performs. The loop body stays the same.`
	},
	{
		title: "Check-In #1: Additional Practice Project",
		folder: "GrS-Check-in-1-Additional-Practice-Project",
		individual: `Draw a zigzag and connect a closed shape to its last point. The starter sets the starting position, step length, turn amount and number of pairs.

1. Finish one pair by turning right by twice the turn angle after the first stroke, drawing an equal second stroke, and turning left by that same amount.
2. Use pair_count to repeat the finished pair. The two headings are 70 and -70 degrees, so the second stroke cancels the first stroke's vertical change.
3. Extend the last point with a square or another closed shape. Keep the pen down at the connection and turn through one full rotation.

**Checkpoints:** The 30 pairs use 60 strokes. With the supplied values the x-coordinate is about 148 and y is about 0. Verify that the square is connected intentionally by checking that its first point and its final point match that endpoint.`,
		classroom: `Run the prepared zigzag. Identify the two equal strokes in one pair and follow the last point into the square.

**Normal:** In \`normal_addition()\`, print pairs and the rounded coordinates of pen. Expect 30, 148 and 0.

**Hard:** In \`hard_addition()\`, lift the pen, move to (-180, -60), then draw ten pairs. The endpoint is about (-71, -60). Connect a square at the new endpoint and update the screen.

**Checkpoints:** A closed shape returns to the point where it began. The space between the two zigzags stays clear.`
	},
	{
		title: "Check-In #2: Additional Practice Project",
		folder: "Check-in-Two-Additional-Practice-ProjectUpdated",
		individual: `Finish a keyboard drawing project that uses one loop to repeat layers and a second loop to make each outline. D draws three filled diamonds in the supplied starter.

1. Complete draw_circle by passing 36, 10 and 2 to draw_layers. Thirty-six turns of 10 degrees complete a rotation. The final value sets the smallest step length.
2. Complete draw_pyramid with three sides and a 120-degree turn. Bind P to that callback. Each layer uses a larger step length than the previous layer.
3. In change_location, use two independent random integers from -115 through 115. Lift the pen before moving and lower it after arriving.

**Checkpoints:** With the canvas focused, D, C and P draw different shapes and each finishes at its starting point. Space changes the start point without leaving a line. Check both horizontal and vertical coordinates after moving.`,
		classroom: `Run the prepared drawing scene. Focus the canvas and press D for diamonds, C for circles, P for pyramids, or Space to change the drawing position.

**Normal:** In \`normal_addition()\`, call draw_diamond() and draw_pyramid(). Record the drawing turtle's starting and ending coordinates. Both shapes finish at the same point.

**Hard:** In \`hard_addition()\`, bind S to a function calling draw_layers(4, 90, 24) at heading 0. Try Space and then S. Check that the square begins at the new point and the move leaves no trail.

**Checkpoint:** The same nested loops draw all shapes. The parameters control the number of sides, the turn and the layer size.`
	},
	{
		title: "Check-In #3: Additional Practice Project",
		folder: "GrS-Check-in-2-Practice-Project",
		individual: `Finish the readiness project that combines rotation, a key event, collision feedback, and replay. The target is placed within reach of a 180-step launch.

1. Complete target_hit() by comparing the distance between player and target with 16. Contact is strictly below 16.
2. Follow advance through aiming, moving and finished. Space switches from aiming to moving, the turtle advances six steps per frame, and each move checks contact before testing the remaining range.
3. Bind R to reset. A new round returns the player to the center, chooses another target and keeps the same timer chain.

**Checkpoints:** Put the target at (90, 0) and face the player right for a hit. Put it at (-140, 0) and face right for a miss. Test distances 15 and 16. Press R after both outcomes and check that the center and aiming rotation return.`,
		classroom: `Run the spinning target project. Press Space to launch and R to start a new round. Trace the change from aiming to moving and from moving to finished.

**Normal:** In \`normal_addition()\`, move the target to (15, 0) and then (16, 0) while the player is centered. Print target_hit() at both points. Expect True and False.

**Hard:** In \`hard_addition()\`, place the target at (90, 0) and call launch while the player faces right. Check the hit message, then press R. Repeat the launch with the target at (-140, 0) to test a miss.

**Checkpoint:** Both endings freeze movement. Reset starts another round with one timer, a centered player and a fresh target.`
	}
];

export function pythonLevel1CheckIn(title: string): RawCourseModuleItem {
	const item = sets.find(entry => entry.title === title);
	if (!item) throw new Error(`Unknown Python Level 1 check-in: ${title}`);
	return {
		title,
		content: item.individual,
		contentKind: "assignment",
		preserveAssignment: true,
		preserveInstructions: true,
		ideImport: true,
		projectLink: `${checkInSource}/${item.folder}/starter`,
		solutionLink: `${checkInSource}/${item.folder}/solution`
	};
}

export function pythonLevel1ClassroomCheckIn(title: string) {
	return sets.find(entry => entry.title === title)?.classroom;
}
