const pythonLevel1MotionSource =
	"https://github.com/instruction-material/Python-Level-1/tree/8f2a2b7a038961ab332abe9eb9469c3319c5fb83";
const turtleGuide = "/course-assets/python/turtle-project-reference.md";

const projects = [
	{
		title: "GrS13 Project 1: Perpetual Motion",
		folder: "GrS13-Perpetual-Motion",
		individual: `Open the Turtle starter. Left and Right already change the heading. The advance function is the only place that moves the turtle and schedules the next frame.

1. Add one forward step after the running check. Run once to see one step.
2. At the end of advance, use screen.ontimer(advance, 20) to schedule the function after 20 milliseconds. Pass the function name without calling it.
3. Let the window continue processing keys between calls. The supplied Space action sets running to False so a pending frame returns without scheduling another.

**Checkpoints:** From the default heading, predict x = 3 after three straight frames. Check that Left changes the heading by 5 degrees and Right reverses that turn. Press Space and check that motion stops.`,
		classroom: `Run the prepared project. The timer moves the turtle between key events, Left and Right turn it, and Space stops it.

**Course flow:** Follow one timer call through movement and a key event. Later projects add bounds, one redraw per frame, wall reflections and collision transitions.

**Normal:** In \`normal_addition()\`, call turn_left() once and print player.heading(). Expect 5 before the first movement frame.

**Hard:** In \`hard_addition()\`, add an R key handler that sets the heading to 0 with player.setheading(0). Press Left, then R, and check that the heading returns to 0 while movement continues.

**Checkpoints:** Space still stops the timer. Compare the location after the last motion frame with the location after waiting for another frame.`
	},
	{
		title: "GrS13 Project 2: Stay Inbounds",
		folder: "GrS13-Stay-Inbounds",
		datasetLink: `${turtleGuide}#boundaries-and-in-bounds-checks`,
		individual: `Start with the supplied square, moving turtle, arrow-key turns and score label. The allowed range on both axes is -200 through 200.

1. Complete outside(x, y) with comparisons for all four walls. Use or because crossing either axis ends the round.
2. In advance(), move forward five steps. Check the coordinates just reached. If they are outside, write Out of bounds! and return from the function.
3. Otherwise add a point, replace the score text and schedule the next frame. Update the shared score when the function runs.

**Checkpoints:** With no turns, x = 200 on move 40, which still counts. The next move reaches x = 205 and ends the run. The score stays at 40. Try the predicate with x = -201 and y = 201 in separate cases.`,
		classroom: `Run the prepared square and steer with Left or Right. The timer tests the new position before awarding a point.

**Normal:** In \`normal_addition()\`, print the results of outside(200, 0) and outside(201, 0). Expect False and True.

**Hard:** In \`hard_addition()\`, traverse the four points (-201, 0), (0, 0), (0, 200), and (0, 201). Count only the outside points. The expected count is 2.

**Checkpoints:** The main game remains unchanged. With no keyboard input, the score reaches 40 and the next step announces Out of bounds! without adding a point.`
	},
	{
		title: "GrS13 Project 3: Fluid Motion",
		folder: "Python-Level-1-ScreenUpdate",
		individual: `The starter turns off automatic drawing updates with screen.tracer(0). Build an animation loop that shows each completed frame at once.

1. In draw_frame(), clear the earlier circle and lift the pen. Move to x = -100 + 10 * frame and y = -20. Put the pen down and draw a circle with radius 20.
2. Call screen.update() once after the circle is complete. Lifting the pen before moving prevents a line from connecting the circle positions.
3. In advance(), draw the current frame. If frame is below 20, increase it and schedule advance in 40 milliseconds.

**Checkpoints:** The first two circles start at x = -100 and -90. Expect 21 screen updates ending at x = 100, with no additional scheduled frame.`,
		classroom: `Run the supplied animation. Observe how the circle moves in steps while the final image in each frame is complete.

**Normal:** In \`normal_addition()\`, print last_frame + 1 to predict the number of frames. The expected total is 21. Explain why frame 0 counts.

**Hard:** In \`hard_addition()\`, use a loop to collect the predicted x-positions at frame indices 0, 1 and 20. Print the three values and expect [-100, -90, 100].

**Checkpoints:** The drawing still starts at -100 and ends at 100. Try a longer timer delay in advance after saving the baseline. The path stays the same.`
	},
	{
		title: "GrS13 Project 4: Bouncy Ball Room",
		folder: "GrS13-Bouncy-Ball-Room",
		datasetLink: `${
			turtleGuide
		}#game-template-with-score-boundaries-and-moving-triangles`,
		individual: `Open the starter with the room and the list of ten balls. Move each ball ten steps per frame, then keep its center inside the square.

1. When x crosses a left or right wall, set x to that wall and reflect the direction with 180 minus the heading.
2. When y crosses a top or bottom wall, set y to that wall and reflect with minus the heading.
3. Check both axes independently so a corner can apply both rules. Refresh once after processing the whole list, then schedule the next frame.

**Checkpoints:** A ball at (201, 30) facing 30 degrees becomes (200, 30) facing 150. A ball at (201, 201) facing 45 becomes (200, 200) facing 225. Watch all ten balls stay in the room.`,
		classroom: `Run the working room and identify the direction change at a side wall. The center is pushed back to the wall if a step crosses it.

**Normal:** In \`normal_addition()\`, print the length of balls. Expect 10.

**Hard:** In \`hard_addition()\`, move the first ball to (201, 201) and give it heading 45. Call reflect_at_walls with that ball, then print its position and heading. Expect (200, 200) and 225.

**Checkpoints:** The next move takes that ball into the room. The other nine continue on their existing paths. Compare this corner with a single-axis bounce.`
	},
	{
		title: "GrS13 Project 5: Turtle Collision",
		folder: "GrS14-Turtle-Collision",
		datasetLink: `${turtleGuide}#score-turtle-pattern`,
		individual: `Two turtles start 40 steps apart and face each other. Their centers count as touching when the absolute difference is strictly below 10 on both axes.

1. Complete touching(ax, ay, bx, by) with the two comparisons joined by and.
2. Move each turtle one step before checking contact. Write Collision! only when the current frame touches and the previous one did not.
3. Store the new contact state. Decrease frames_left, update the scene and schedule another frame only if frames remain.

**Checkpoints:** The points (0, 0) and (9, -9) touch. A difference of 10 on either axis is outside the hitbox. With no turns, expect one announcement during the 40-frame run.`,
		classroom: `Run the prepared two-turtle scene. The message appears once as the turtles pass each other.

**Normal:** In \`normal_addition()\`, print touching(0, 0, 9, -9) and touching(0, 0, 10, 0). Expect True and False.

**Hard:** In \`hard_addition()\`, trace contact states [False, True, True, False, True]. Count only transitions from False to True and expect 2. Update the remembered state after each case.

**Checkpoints:** The middle True does not count twice. The original on-canvas meeting still produces one message during the default 40 frames.`
	}
];

export const pythonLevel1GameMechanicsProjects = projects.map(project => ({
	title: project.title,
	content: project.individual,
	contentKind: "assignment" as const,
	preserveInstructions: true,
	projectLink: `${pythonLevel1MotionSource}/${project.folder}/starter`,
	solutionLink: `${pythonLevel1MotionSource}/${project.folder}/solution`,
	datasetLink: project.datasetLink
}));

export function pythonLevel1ClassroomMotionContent(title: string) {
	return projects.find(project => project.title === title)?.classroom;
}
