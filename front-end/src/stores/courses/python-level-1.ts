import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "./types";
import { isCoreProjectTitle } from "./projectGrouping";
import {
	pythonLevel1ArcadeSupplementalProjects,
	pythonLevel1SpaceEaterProject
} from "./pythonLevel1ArcadeProjects";
import { pythonLevel1CheckIn } from "./pythonLevel1CheckInProjects";
import { pythonLevel1DrawingProject } from "./pythonLevel1DrawingProjects";
import { pythonLevel1GameMechanicsProjects } from "./pythonLevel1GameMechanicsProjects";
import { pythonLevel1ListProjects } from "./pythonLevel1ListProjects";

const TURTLE_REFERENCE = "/course-assets/python/turtle-project-reference.md";
const TURTLE_COMMAND_REFERENCE = `${TURTLE_REFERENCE}#turtle-command-reference`;
const TURTLE_GAME_TEMPLATE_REFERENCE = `${TURTLE_REFERENCE}#game-template-with-score-boundaries-and-moving-triangles`;
const TURTLE_COLOR_REFERENCE = "https://trinket.io/docs/colors";

export const pythonLevel1Course: RawCourse = {
	name: "Python Level 1",
	modules: [
		{
			title: "First 10 Days: Show, Play, Then Explain",
			curriculum: [
				{
					title: "Quick Start Project 1: Color Circle Art",
					content: `**Focus:** Begin by pressing Run so the first experience is a complete, colorful result rather than a list of definitions. Change the color list, circle count, radius, and three drawing positions, then predict and observe one result after each small edit. Trace the finished program from constants to the outer position loop, the circle loop, the drawing functions, and the pen-up, goto, pen-down movement pattern. Connect the visible repetition to loops and the reusable drawing actions to functions only after the design has been explored. Use ${TURTLE_COLOR_REFERENCE} to choose additional colors that work in Turtle. Finish by identifying one constant, one function call, and one repeated action in the code.`,
					projectLink: "/ide?mode=turtle&template=circle-art",
					datasetLink: TURTLE_COLOR_REFERENCE
				},
				{
					title: "Quick Start Project 2: Picasso Keyboard Painter",
					content:
						"Open the prepared keyboard-art starter. It supplies the `Screen` and `Turtle` imports, `choice`, the color list, black canvas, Turtle setup, `screen.onkey()`, and `screen.listen()`. Replace the `draw_square()` placeholder with the complete drawing function. Keep the name `draw_square`, or change both the function definition and the name passed to `screen.onkey()` so they match. Inside the function, choose the pen size and outline/fill colors, begin the fill, draw and turn four times, and end the fill. Run the project, click the canvas, and press or hold S to paint overlapping squares. After it works, remix one feature at a time: change the side length, add a clear function on Space, bind another shape to a new key, add arrow-key movement, or expand the color list. Finish by tracing the S key from `screen.onkey()` to the student-created function and then to the visible drawing.",
					projectLink: "/ide?mode=turtle&template=picasso"
				},
				{
					title: "Debugging Habit: Read the First Red Squiggle",
					content:
						"Treat editor marks and error messages as instructions rather than failure. Stop at the first red squiggle or first error line, read the message aloud, locate the named line, and change one thing before running again. Practice with a missing colon, mismatched indentation, a misspelled variable, and an event function called with parentheses. Compare each broken version with the last working version to build a repeatable debugging routine before projects become larger. Record the symptom, the first useful clue, the single edit, and the new result for each repair. If another error remains, restart the same process from the new first message instead of changing several lines at once."
				},
				{
					title: "Reflection: Name the Ideas After Play",
					content:
						"After changing and rerunning both projects, connect each observation to vocabulary: repeated drawing steps are iteration, named reusable actions are functions, values passed into actions are parameters, key presses are events, and constants provide safe remix controls. Predict one visible change before an edit, explain the actual result afterward, and point to the line or block that caused it. Compare the two starters by identifying what runs once, what repeats, and what waits for input. Then continue into GrS1 for the formal coordinate, movement, pen-control, and program-structure sequence. The later Circle of Circles and Picasso projects revisit these previews with less scaffolding, more planning, and fuller independence."
				}
			],
			supplementalProjects: []
		},
		{
			title: "GrS1 Coordinates and Movement",
			curriculum: [
				{
					title: "Introduction and Setup",
					preserveInstructions: true,
					content: `Python runs statements from top to bottom. A statement such as \`pen.forward(60)\` calls an action on the turtle named \`pen\`; \`60\` is its argument. The dot selects an action belonging to that turtle. Quoted text such as \`"orange"\` is a string. A line beginning with \`#\` is a comment and does not draw anything.

The editor contains the program, the canvas shows its drawing, and the console displays printed values or errors. In the site's Turtle environment, Run starts the program and Stop ends a running program. A fresh run begins the drawing again. The first two preview projects supply more code than is needed here; Turtle Exploration begins with the movement and pen commands.

## Coordinates, direction and pen state

The canvas center is \`(0, 0)\`. Positive x is right, negative x is left, positive y is up, and negative y is down. A new turtle faces right. \`forward(distance)\` moves in its current direction; \`left(angle)\` and \`right(angle)\` change that direction in degrees. \`goto(x, y)\` moves to a coordinate without changing the direction.

The pen starts down, so movement leaves a line. Lift it before traveling to another part of a drawing, then lower it before drawing there. This complete example draws a filled rectangle:

\`\`\`python
import turtle

screen = turtle.Screen()
pen = turtle.Turtle()

# Travel to the lower-left corner without drawing.
pen.penup()
pen.goto(-60, -30)
pen.pendown()
pen.color("black", "orange")
pen.begin_fill()

pen.forward(120)
pen.left(90)
pen.forward(60)
pen.left(90)
pen.forward(120)
pen.left(90)
pen.forward(60)
pen.left(90)

pen.end_fill()
screen.mainloop()
\`\`\`

\`import turtle\` makes the library available. \`Screen()\` supplies the drawing area and \`Turtle()\` creates the drawing cursor. Assignment with \`=\` gives each object a name. Here \`color("black", "orange")\` chooses an outline and fill. Movement between \`begin_fill()\` and \`end_fill()\` defines the filled shape. \`mainloop()\` keeps the drawing window responsive.

Trace the four movements before running:

| After movement | Position | Direction before the next move |
| --- | --- | --- |
| First side | (60, -30) | Up after the first left turn |
| Second side | (60, 30) | Left after the second turn |
| Third side | (-60, 30) | Down after the third turn |
| Fourth side | (-60, -30) | Right after the fourth turn |

The turtle returns to its starting position and direction. Changing the first \`120\` alone leaves an open outline; changing both long sides to \`80\` produces a closed, narrower rectangle. These predictions connect the visible result to the exact statements.

## Checks and repairs

Run the unchanged example, then move the starting corner to \`(-100, -50)\`. Its opposite corner is now \`(20, 10)\`. Both values shift because the side lengths stay fixed. Add a second shape elsewhere by lifting the pen before the next \`goto()\`. A connecting line means the pen was down during travel.

Names are case-sensitive: \`Pen\` and \`pen\` are different names. A missing quote or parenthesis can prevent the program from starting. Read the first error, compare its named line with the working example, repair one change and run again. A drawing with the wrong position can run without a syntax error; use the coordinate trace to find that kind of mistake.

Continue with Turtle Exploration: draw a square, a triangle and a filled shape in a separate location. Explain the movement, turning and pen state for each. The recap and original drawing remain optional practice.

Color reference: use Trinket's Turtle color table when choosing Turtle names, CSS names, hex codes, or RGB values: ${TURTLE_COLOR_REFERENCE}

Command details: [Python Turtle reference](https://docs.python.org/3/library/turtle.html).`,
					datasetLink: TURTLE_COMMAND_REFERENCE
				},
				{
					title: "GrS1 Project 1: Turtle Exploration",
					content:
						"Import `turtle`, create a turtle, move it with `forward()`, turn with `left()` and `right()`, and use `goto()`, `penup()`, `pendown()`, `color()`, `begin_fill()`, and `end_fill()` to create a square, a triangle, and a filled shape in a new location. Practice reading console errors, fixing mistakes, and adding comments to explain code.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS1 Supplemental Project 1: Turtle Recap",
					content:
						"Create a personal study guide for the first Turtle module. Answer review questions about what Python does, how a Turtle program starts, how movement and turn commands change the drawing, and how pen control affects visible lines. Include one small code example that moves to a new coordinate, draws a filled shape, and uses a comment to explain the intent.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Recap/solution"
				},
				{
					title: "GrS1 Supplemental Project 2: Open Ended Project - Create a Drawing",
					content:
						"Create an original Turtle drawing that uses movement, turning, coordinates, pen control, and color deliberately. Plan the drawing as at least three visible parts before coding, then place each part with `goto()`, `penup()`, and `pendown()` instead of relying only on the turtle's current position. The finished program includes comments naming each part of the drawing and at least one filled shape."
				}
			]
		},
		{
			title: "GrS2 Loops",
			curriculum: [
				pythonLevel1DrawingProject("GrS2-Basic-Shapes", {
					title: "GrS2 Project 1: Basic Shapes",
					preserveInstructions: true,
					content: `Learn how \`for\` loops repeat code and use them to draw a square, triangle, and circle more efficiently. Compare repeated code with loop-based code and explore how shape sides and turn angles work together.

## Counted repetition

A loop runs the same indented statements once for each supplied value. \`range(4)\` supplies \`0, 1, 2, 3\`: four values, with the stopping value 4 excluded. In \`for step in range(4):\`, \`step\` receives those values in order. The colon begins the loop body; indent every repeated statement by four spaces. The first unindented statement runs after the loop finishes.

The rectangle lesson repeats movement and turning. A square has equal sides, so those two statements can share one loop:

\`\`\`python
import turtle

screen = turtle.Screen()
pen = turtle.Turtle()
pen.penup()
pen.goto(-40, -40)
pen.pendown()

for step in range(4):
    pen.forward(80)
    pen.left(90)

pen.color("purple")
screen.mainloop()
\`\`\`

Each iteration draws one side and turns once. Starting at \`(-40, -40)\`, the four endpoints are \`(40, -40)\`, \`(40, 40)\`, \`(-40, 40)\` and \`(-40, -40)\`. Only after all four sides does \`pen.color("purple")\` run, so it changes the cursor and future strokes; the existing square keeps its original color. Move that statement before the loop to draw purple sides.

If \`pen.left(90)\` loses its indentation, all four forward moves happen before the single turn. The result is a straight 320-pixel line. If the loop header loses its colon, Python reports a syntax error before drawing.

## Side counts and turn angles

A simple regular polygon with n sides makes one complete turn while its outline closes. Each exterior turn is \`360 / n\` degrees. A square uses four turns of 90 degrees; an equilateral triangle uses three turns of 120 degrees. The triangle's interior angle is 60 degrees, while the turtle turns through its exterior angle.

For the required triangle, travel pen-up to \`(80, -40)\`, face right with \`pen.setheading(0)\`, and use three 60-pixel sides with 120-degree left turns. Its last endpoint returns to \`(80, -40)\`. Use \`pen.circle(30)\` for the required circle after traveling to \`(-100, 40)\`; 30 is the radius. From the default rightward heading, this command places the circle's center 30 pixels above its starting point. A circle command already performs the curved drawing, so it does not need a surrounding polygon loop.

## Small-case checks

| Change to the square loop | Expected result |
| --- | --- |
| \`range(0)\` | No sides; the body never runs. |
| \`range(1)\` | One 80-pixel side and one left turn. |
| \`range(4)\` | Four sides, a closed square and the original heading. |

Finish with the square, triangle and circle in separate places. Keep travel lines absent and identify which statements repeat. Change a side length or starting position, predict the endpoints, then compare the drawing with that prediction. Continue with Smiley Face and the original loop drawing as the remaining required projects. More Shapes and Bullseye are optional practice.

Language details: [Python for loops and range](https://docs.python.org/3/tutorial/controlflow.html#for-statements).`
				}),
				pythonLevel1DrawingProject("Smiley-Face", {
					title: "GrS2 Project 2: Smiley Face",
					content:
						"Combine loops, shape planning, colors, and background changes to draw a smiley face with features such as rectangular eyes and a curved mouth."
				}),
				{
					title: "GrS2 Project 3: Open Ended Project - Drawing with Loops",
					content:
						"Create an original drawing that uses loops because repetition is genuinely part of the design. Good options include flowers, landscapes, symbols, patterned borders, or name art. The finished code has at least two loops, a clear reason for the repeated movement, and one short comment explaining which repeated visual feature each loop creates."
				}
			],
			supplementalProjects: [
				pythonLevel1DrawingProject("GrS2-More-Shapes", {
					title: "GrS2 Supplemental Project 1: More Shapes",
					content:
						"Draw a magenta hexagon, a purple decagon, and a teal star on different parts of a black screen. Use loops for the repeated sides, calculate or choose turns intentionally, and move between shapes with the pen lifted so the travel lines do not appear. Verify that each shape has the correct number of visible points or sides."
				}),
				pythonLevel1DrawingProject("GrS2-Bullseye", {
					title: "GrS2 Supplemental Project 2: Bullseye",
					content:
						"Draw a target made of alternating red and white circles. Keep the circles centered by returning to a predictable position before each ring, and use a loop or repeated helper pattern so the radius changes consistently. The final target shows clear alternating colors and rings that stay aligned around the same center point."
				}),
				pythonLevel1DrawingProject("GrS2-Watermelon-Slice", {
					title: "GrS2 Supplemental Project 3: Watermelon Slice",
					content:
						"Use loops and fills to draw a watermelon slice with rind, fruit, and seeds. Separate the drawing into layers: outer rind, inner fruit, and repeated seed shapes. The repeated seeds follow a clear pattern rather than random placement, and the fill colors make each layer easy to distinguish."
				}),
				pythonLevel1DrawingProject("GrS2-Taxi", {
					title: "GrS2 Supplemental Project 4: Taxi",
					content:
						"Draw a taxi using basic Turtle shapes for the body, wheels, windows, and at least one extra detail such as a sign, headlights, or road line. Experiment with thicker pen sizes for bolder outlines, but keep the fill colors and outlines readable. The finished drawing makes the taxi recognizable from separate planned pieces, not one continuous accidental path."
				}),
				pythonLevel1DrawingProject("GrS2-Captain-America-Shield", {
					title: "GrS2 Supplemental Project 5: Captain America Shield",
					content: ""
				}),
				pythonLevel1DrawingProject("GrS2-Minion", {
					title: "GrS2 Supplemental Project 6: Minion",
					content: ""
				}),
				{
					title: "GrS2 Supplemental Project 7: Loops Recap",
					content:
						"Create a study guide for loops and shape-building. Explain what a `for` loop repeats, why loops reduce copied code, and how side count relates to turn angle when drawing polygons. Include one short traced example showing how many times the loop body runs and one drawing example where changing the loop count changes the finished shape.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS-Loops-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS-Loops-Recap/solution"
				}
			]
		},
		{
			title: "GrS3 Variables and Random Numbers",
			curriculum: [
				pythonLevel1DrawingProject("GrS3-Awesome-Angles", {
					title: "GrS3 Project 1: Awesome Angles",
					content:
						"Use variables such as `length` and `degrees` to control turtle movement, compare assignment in code with equality in math, and experiment with changing variable values to alter the drawing."
				}),
				pythonLevel1DrawingProject("Surprise-Me-Square", {
					title: "GrS3 Project 2: Surprise Me Square",
					content: `Replace hardcoded coordinates, side lengths, and RGB values with variables, then use \`random.randint()\` to generate random locations, sizes, and colors for a square.

Color reference: compare Turtle color names and RGB values with ${TURTLE_COLOR_REFERENCE}`
				}),
				{
					title: "GrS3 Guided Project: User Input Shape Designer",
					content: `Use \`screen.textinput()\` and \`screen.numinput()\` to let the user choose a shape color and size before Turtle draws. Store each response in a descriptively named variable, provide a safe default when the user cancels, and validate the size before using it.

Test a typical color and size, the smallest accepted size, a value outside the accepted range, and a canceled prompt. Finish by explaining how the user's response becomes program state and then changes the visible drawing.`,
					datasetLink: TURTLE_COLOR_REFERENCE
				},
				{
					title: "GrS3 Project 3: Random Walk",
					content:
						"Combine loops with random movement to simulate a random walk. Customize the turtle shape and pen size while practicing readable variable names.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Random-Walk/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Random-Walk/solution"
				}
			],
			supplementalProjects: [
				pythonLevel1DrawingProject("GrS3-Random-Bowtie", {
					title: "GrS3 Supplemental Project 1: Random Bowtie",
					content:
						"Draw a bowtie with random colors for each half and a randomly chosen background color. Store the random choices in variables before drawing so the color decisions can be printed, reused, or debugged. The two halves stay symmetric in shape while color changes from run to run."
				}),
				{
					title: "GrS3 Supplemental Project 2: Debugging Practice",
					content:
						"Read console errors and fix a buggy Turtle program one issue at a time. Start with the first error message, identify the line it points to, and decide whether the problem is spelling, missing punctuation, variable naming, command order, or an invalid value. After each fix, rerun the program and confirm that the drawing moves closer to the intended result instead of changing several things at once.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Debugging-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Debugging-Practice/solution"
				},
				{
					title: "GrS3 Supplemental Project 3: Variables and Random Numbers Recap",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Use the supplied cases to review variables, assignment, types and bounded randomness. Write each prediction before checking it.

1. Trace \`length = 20\`, then \`length = length + 5\`, then \`print(length)\`. The right side uses the old value before assignment replaces it, so the printed result is 25.
2. Classify \`20\`, \`"20"\` and \`True\` as integer, string and boolean. Adding 5 to the integer gives 25; adding it directly to the string raises a type error because text and a number are different kinds of values.
3. For \`random.randint(10, 30)\`, identify which of 9, 10, 20, 30 and 31 can occur. Both endpoints are included, so 10, 20 and 30 are allowed. Repeated calls can return the same value.
4. Replace copied side lengths with a variable named \`side_length\`. Identify the drawing statements that read that name so changing it updates every intended side.
5. Choose one random property and one fixed property for a drawing. Record the permitted range and explain how a run can vary while keeping the intended design.

Complete the explanations and one short variable-based drawing example. This recap reviews GrS3; coordinate-controlled stopping loops are optional practice in GrS13.`
				},
				{
					title: "GrS3 Supplemental Project 4: Open Ended Project - Haphazard Artwork",
					content:
						"Use loops and random values together to create abstract artwork with random colors, positions, and shapes. Decide which properties are random and which stay controlled, then store important ranges in variables such as minimum size, maximum size, or number of shapes. The finished artwork is different on each run while still following a recognizable design rule."
				}
			]
		},
		{
			title: "GrS4 Conditionals Part 1",
			curriculum: [
				pythonLevel1DrawingProject("GrS4-Surprise-Shape", {
					title: "GrS4 Project 1: Surprise Shape",
					content:
						"Learn booleans, comparison operators, and `if` statements by generating a random number and using conditionals to choose which shape to draw."
				}),
				pythonLevel1DrawingProject("GrS4-Find-Your-Turtle", {
					title: "GrS4 Project 2: Find Your Turtle",
					content:
						"Use the coordinate plane, comparison operators, `and`, `or`, `xcor()`, and `ycor()` to detect where a turtle is and react differently in different regions of the canvas."
				})
			],
			supplementalProjects: [
				{
					title: "GrS4 Supplemental Project 1: Navigating the Coordinate Plane",
					content:
						"Strengthen coordinate-plane skills through targeted coordinate questions and movement practice. Use the x-axis, y-axis, quadrants, and ordered pairs to predict where the turtle moves before running the program. Include at least one check involving a positive coordinate, one involving a negative coordinate, and one involving the origin or an axis.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS4-Navigating-the-Coordinate-Plane/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS4-Navigating-the-Coordinate-Plane/solution"
				},
				{
					title: "GrS4 Supplemental Project 2: Open Ended Project - Boolean Bonanza",
					content:
						"Create an original Turtle game that uses random numbers, booleans, and conditionals to produce different outcomes. Define what counts as a win, loss, hit, miss, or special event before coding. The finished game uses at least two boolean expressions, one compound condition with `and` or `or`, and visible feedback that proves different branches can run."
				},
				{
					title: "GrS4 Supplemental Project 3: Conditionals and Booleans Recap",
					content:
						"Answer short review questions about booleans, comparison operators, and conditionals, then write one tiny Turtle example for a comparison that is true and one for a comparison that is false. The recap connects vocabulary to visible behavior, such as a turtle changing color only when a condition is met.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS-Conditionals-and-Booleans-Recap-Template/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS-Conditionals-and-Booleans-Recap-Template/solution"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				pythonLevel1CheckIn("Check-In #1 Overview"),
				{
					title: "Check-In #1: Basics with Turtle",
					content:
						"Review how to import Turtle, create a turtle, move forward, turn, change colors, use `goto()`, lift and lower the pen, and draw outlined and filled shapes at chosen coordinates."
				},
				{
					title: "Check-In #1: Loops",
					content:
						"Explain what loops do, then use them to repeat movement, draw polygons such as a dodecagon, scale shapes to different sizes, and approximate circles with many short repeated turns."
				},
				{
					title: "Check-In #1: Variables and Random Numbers",
					content:
						"Review variables as reusable names for values, store side lengths and random values, and use RGB variables to generate random turtle colors."
				},
				{
					title: "Check-In #1: Conditionals",
					content:
						"Practice `if`, `elif`, and `else` by reacting to random numbers and turtle positions. Use coordinate checks with `and` and `or` to change color based on where the turtle is on the canvas."
				},
				{
					title: "Check-In #1 Reflection",
					content:
						"Write a short reflection about favorite concepts, challenges, problem-solving strategies, and a moment of pride from the course so far.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/solution"
				}
			],
			supplementalProjects: [
				{
					...pythonLevel1CheckIn(
						"Check-In #1: Additional Practice Project"
					),
					id: "python-level-1-check-in-1-curriculum-check-in-1-additional-practice-project"
				}
			]
		},
		{
			title: "GrS5 Loops with Variables",
			curriculum: [
				{
					title: "GrS5 Project 1: Fireworks",
					content:
						"Combine loops with reassignment so a value changes on every repetition. Use a `lineLength` variable that grows over time to create an expanding fireworks pattern.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Fireworks/solution"
				},
				{
					title: "GrS5 Project 2: While Loops Exploration",
					content:
						"Compare `while` loops with `for` loops, build loops that stop based on coordinates, and use `write()`, `clear()`, and coordinate checks to animate a turtle moving toward a stop sign.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/While-Loops-Exploration/solution"
				},
				{
					title: "GrS5 Project 3: Square Spiral",
					content:
						"Use a counter-controlled `while` loop plus a changing line length to create a square spiral with gradually changing properties. Track the loop counter, current line length, and turn direction separately so the stopping condition is easy to explain. The final spiral shows steady growth rather than disconnected squares.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Square-Spiral/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS5 Supplemental Project 1: Rainbow Ninja Star",
					content:
						"Draw a ninja star pattern that starts from the center and gradually shifts through color values. Use variables for length, turn amount, and color components so the visual change is produced by reassignment inside the loop. The finished pattern makes both the repeated geometry and the color progression visible.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Rainbow-Ninja-Star/solution"
				},
				{
					title: "GrS5 Supplemental Project 2: Into the Void",
					content:
						"Draw a growing sequence of rotated squares using a loop that changes size and rotation in a predictable pattern. The final drawing makes the growth rule visible, and the code keeps the repeated drawing steps inside the loop rather than manually duplicating square commands.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Into-the-Void/solution"
				},
				{
					title: "GrS5 Supplemental Project 3: Out of the Void",
					content:
						"Create a spiral triangle pattern and experiment with negative movement values. Before running the full drawing, predict how a negative movement changes the turtle's direction compared with turning. The final code uses a loop, a changing size value, and one short comment explaining why the spiral moves outward or inward.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Out-of-the-Void/solution"
				},
				{
					title: "GrS5 Supplemental Project 4: Turtle Race",
					content:
						"Simulate a race between three turtles that move forward by random amounts until one crosses the finish line. Store each turtle's setup clearly, draw or mark a finish line, and use a loop condition tied to turtle position rather than a fixed number of turns. The result announces or visibly shows the winner.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Race-Starter/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Race-Starter/solution"
				},
				{
					title: "GrS5 Supplemental Project 5: Reassignment and While Loops Recap",
					content:
						"Answer short review questions about reassignment, counters, and `while` loops, then trace one loop by hand before running it. The recap identifies the starting value, the condition, the update step, and the reason the loop eventually stops.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reassignment-and-While-Loops-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reassignment-and-While-Loops-Recap/solution"
				}
			]
		},
		{
			title: "GrS6 Nested Loops Part 1",
			curriculum: [
				{
					title: "GrS6 Project 1: Nested Loops Exploration",
					content:
						"Learn what nested loops are by drawing repeated squares with changing sizes and identifying what repeats inside the outer pattern versus inside each shape.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Nested-Loops-Exploration/solution"
				},
				{
					title: "GrS6 Project 2: Square Inception",
					content:
						"Use multiple layers of repetition to draw groups of squares and practice placing code in the correct loop so each action runs the right number of times.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Square-Inception/solution"
				},
				{
					title: "GrS6 Project 3: Open Ended Project - Nested Loop Pattern",
					content:
						"Create an original pattern that clearly uses nested loops to build a repeated visual structure. The outer loop controls where or how many groups appear, and the inner loop controls the repeated shape within each group. Include comments naming the outer-loop job and inner-loop job so the nesting is understandable from the code."
				}
			],
			supplementalProjects: [
				{
					title: "GrS6 Supplemental Project 1: Pyramid",
					content:
						"Draw a triangle pyramid that grows a little larger each time. Use one loop to repeat the triangle and a changing size or position value to make the growth rule visible. The final pyramid has aligned layers rather than a cluster of unrelated triangles.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Pyramid/solution"
				},
				{
					title: "GrS6 Supplemental Project 2: Reverse Pyramid",
					content:
						"Reverse the pyramid order and fill each triangle with a random color. Keep the same pyramid idea, but change the loop values so the largest or smallest triangle appears first as required. Store random colors cleanly and verify that fill blocks start and end around exactly one triangle at a time.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Reverse-Pyramid/solution"
				},
				{
					title: "GrS6 Supplemental Project 3: Reverse Square Inception",
					content:
						"Draw the largest square first in each quadrant and fill each square with a random color. Use nested loops to manage the repeated squares and the repeated quadrant positions separately. The finished image makes the reversal obvious: each quadrant begins with the largest square and builds inward.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Reverse-Square-Inception/solution"
				},
				{
					title: "GrS6 Supplemental Project 4: Rainbow Flower",
					content:
						"Combine nested loops and gradual color changes to create a multicolored flower pattern. One loop repeats the petal or circle shape, and another rotates or repositions the group to build the flower. Use controlled changes to color values so the rainbow effect follows the structure of the drawing instead of appearing random.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Rainbow-Flower/solution"
				},
				{
					title: "GrS6 Supplemental Project 5: Circle of Circles",
					content:
						"Build a larger circular pattern from many smaller circles. Use a loop to draw each small circle, then rotate or move by a consistent amount before drawing the next one. Verify that the repeated circles form one intentional overall shape instead of drifting away from the center.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Circle-of-Circles/solution"
				},
				{
					title: "GrS6 Supplemental Project 6: Spirals",
					content:
						"Draw many randomly sized, colored, and positioned spiral shapes across the screen. Use one loop or helper pattern to create a single spiral, then another loop to repeat that spiral at different locations. Keep the random ranges controlled so the screen looks intentionally filled rather than cluttered by shapes outside the visible area.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Spirals/solution"
				}
			]
		},
		{
			title: "GrS7 Functions Part 1",
			curriculum: [
				{
					title: "GrS7 Project 1: Build a Neighborhood",
					content:
						"Discover why functions are useful by drawing several houses in a neighborhood. First notice which commands repeat for every house, such as drawing the body, roof, door, or windows. Then move that repeated code into a reusable `drawHouse()` function and call it at different positions or sizes. The final code makes it easier to add another house without duplicating the entire drawing sequence.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS6-Build-a-Neighborhood/solution"
				},
				{
					title: "GrS7 Project 2: Basic Functions",
					content:
						"Write helper functions for common Turtle actions such as moving to a random location, choosing a random color, and resetting the canvas. Practice the difference between defining a function and calling it.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Basic-Functions/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS7 Supplemental Project 1: Open Ended Project - Make Your Own Function",
					content:
						"Design and write an original function of at least 10 lines that creates a meaningful Turtle behavior or drawing. Give the function a descriptive name, keep all repeated steps inside the function body, and call it more than once so the reuse is visible. The final program makes it clear why a function is better than copying the same drawing commands repeatedly."
				},
				{
					title: "GrS7 Supplemental Project 2: Randomly Random Shapes",
					content:
						"Define a function that draws a random polygon, then call it repeatedly with random positions and colors. Keep the random side count, size, position, and color choices readable by storing them in variables before drawing. The result demonstrates both function reuse and controlled randomness.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/blob/main/Randomly-Random-Shapes-Updated/solution/main.py"
				},
				{
					title: "GrS7 Supplemental Project 3: Functions Recap",
					content:
						"Answer short review questions about function definitions, calls, and reusable code, then write a tiny example showing a function definition and two separate calls. The recap distinguishes between code that creates a function and code that actually runs it.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Functions-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Functions-Recap/solution"
				}
			]
		},
		{
			title: "GrS8 Event Listeners",
			curriculum: [
				{
					title: "GrS8 Project 1: Event Listener Discovery",
					content:
						"Learn what event listeners are by connecting key presses to functions. Define small movement or drawing functions, bind them to keys with `screen.onkey()`, and enable keyboard input with `screen.listen()`. Test one key at a time and keep each callback focused on one action so it is clear which function runs when a key is pressed.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Event-Listener-Discovery/solution"
				},
				{
					title: "GrS8 Project 2: Etch A Sketch",
					content:
						"Use four event listeners to move and turn the turtle, turning the canvas into a simple interactive drawing toy. Each key calls a named function, and the screen listens continuously for input. Test every direction key and verify that the turtle responds immediately without needing to rerun the program.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Etch-A-Sketch/solution"
				},
				{
					title: "GrS8 Project 3: Picasso Game",
					content:
						"Use key presses to draw different shapes and create more surprising patterns through interactive input. Map each key to a clear drawing function, and include at least one key that changes color, position, or size before drawing. The project functions as a small interactive art tool rather than a fixed drawing.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Picasso-Game/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS8 Supplemental Project 1: Polka Dot Game",
					content:
						"Move and turn the turtle with arrow keys, then press space to stamp circles with random sizes and colors. Separate movement functions from the stamping function so each key has one clear responsibility. Verify that repeated spacebar presses create different dots without breaking movement controls.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS9-Polka-Dots/solution"
				},
				{
					title: "GrS8 Supplemental Project 2: Fruit Stand",
					content:
						"Bind number keys to drawing different fruit shapes. Each fruit has its own function, and each function draws enough detail to make the fruit recognizable. Test every number key, then add one shared helper such as move-to-random-location or choose-random-color if the fruit functions repeat setup code.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS8-Fruit-Stand/solution"
				},
				{
					title: "GrS8 Supplemental Project 3: Open Ended Project - Interactive Drawing",
					content:
						"Create an interactive drawing that reveals different pieces only when certain keys are pressed in a chosen order. Plan the key map before coding, name each function after the part it reveals, and include at least one reset, clear, or surprise action. The finished program is understandable from the controls as well as from the code.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS8-Picasso-Game/solution"
				},
				{
					title: "GrS8 Supplemental Project 4: Event Listener Recap",
					content:
						"Answer short review questions about event listeners, key bindings, and interactive program structure, then write one minimal example that connects a key press to a named function. The recap identifies the function being called, the key that triggers it, and the line that makes the screen listen for events.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Event-Listener-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Event-Listener-Recap/solution"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				pythonLevel1CheckIn("Check-In #2 Overview"),
				{
					title: "Check-In #2: Advanced Loops",
					content:
						"Use a changing `sideLength` variable inside loops, compare `for` loops and `while` loops, build nested loop drawings, and control when a value stops growing."
				},
				{
					title: "Check-In #2: Functions",
					content: `Review how functions organize code into named actions. A function definition stores a reusable set of instructions, and a function call runs those instructions at a specific moment in the program.

Start with simple helpers such as \`moveForward50()\`, then move to parameterized helpers such as \`drawSquare(sideLength)\`. A strong solution uses descriptive function names, calls each helper more than once, and changes the argument values to prove that the function is reusable rather than copied code.`
				},
				{
					title: "Check-In #2: Event Listeners",
					content:
						"Create a screen, connect keys to functions, and use keyboard input to move the turtle or draw shapes. Finish by enabling the screen to listen for those events."
				},
				{
					title: "Check-In #2 Reflection",
					content: `Reflect on the course so far by naming one idea that feels stronger now, one idea that still needs practice, and one debugging strategy that helped when a program did not behave as expected.

The reflection is specific. Instead of saying "loops are easier," explain what changed: predicting loop counts, tracking a variable as it changes, reading console errors, testing one function at a time, or using comments to plan a drawing before coding it.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/solution"
				}
			],
			supplementalProjects: [
				{
					...pythonLevel1CheckIn(
						"Check-In #2: Additional Practice Project"
					),
					id: "python-level-1-check-in-2-curriculum-check-in-2-additional-practice-project"
				}
			]
		},
		{
			title: "GrS9 Functions Part 2",
			curriculum: [
				{
					title: "GrS9 Project 1: Build a Snowman",
					content:
						"See why function parameters matter by first writing several similar circle-drawing functions, then simplifying them into one reusable function that accepts size as an input.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS8-Build-a-Snowman/solution"
				},
				{
					title: "GrS9 Project 2: More Functions",
					content: `Create reusable shape functions, then use parameter values to control the finished drawing. Write \`drawSquare(sideLength)\` and \`drawTriangle(sideLength)\` so the same function can draw small, medium, and large versions of the shape.

After both functions work independently, call them repeatedly with different sizes, positions, or colors to build a pattern. Verify the design by changing one argument and checking that only the intended shape size changes, not the whole program structure.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS8-More-Functions/solution"
				},
				{
					title: "GrS9 Project 3: Polka Dots",
					content: `Build an interactive drawing that reacts to mouse clicks. Use \`screen.onclick()\` to connect the canvas to a function that receives the click coordinates, moves the turtle to that position, and draws a circle or dot.

The dot function uses parameters or random values for details such as size, color, or pen width. Test clicks near the center, edges, and corners of the canvas so the final program feels responsive and does not assume every click happens in one easy location.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/blob/main/GrS9-Polka-Dots/solution/main.py"
				},
				{
					title: "GrS9 Project 4: Click and Draw Rectangles",
					content: `Use mouse coordinates as input data for a drawing function. The click handler receives \`x\` and \`y\`, then draws a rectangle whose width and height are based on the distance from a reference point such as the center of the screen.

Plan how negative coordinates behave before coding. A strong version handles clicks in all four quadrants, labels or comments the coordinate logic, and verifies that the rectangle changes shape predictably when the click location changes.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS9-Click-and-Draw-Rectangle/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS9 Supplemental Project 1: Any Shape Staircase",
					content: `Write a general polygon helper, \`drawShape(sideLength, numSides)\`, and use it as the foundation for a staircase of shapes. The function calculates the turn angle from the number of sides instead of hard-coding one shape.

Build the staircase by changing at least one value each step, such as side length, position, color, or number of sides. Completion means the code can draw several different polygons from the same helper and the staircase rule is visible from the loop structure.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Any-Shape-Staircase/solution"
				},
				{
					title: "GrS9 Supplemental Project 2: Debugging Functions",
					content: `Debug a function-based snowman program by reading one error at a time and connecting each error to the relevant function definition or function call.

Look for common function mistakes: calling a function before it exists, forgetting parentheses, passing the wrong number of arguments, changing a local variable that does not affect the rest of the program, or duplicating code that belongs in a helper. Keep a short note beside each fix explaining what changed and how the visible drawing proves the repair worked.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Debugging-Functions/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Debugging-Functions/solution"
				},
				{
					title: "GrS9 Supplemental Project 3: Pyramid with Functions",
					content: `Use a single \`drawTriangle(sideLength)\` helper to create a pyramid made from repeated triangles. The helper only knows how to draw one triangle; the surrounding loop controls placement, row changes, and size changes.

Before coding, decide how each row differs from the previous one. The finished program shows that functions can separate "how to draw one piece" from "how to arrange many pieces."`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Pyramid-with-Functions/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Pyramid-with-Functions/solution"
				},
				{
					title: "GrS9 Supplemental Project 4: Square Inception with Functions",
					content: `Remake Square Inception with a helper function that accepts both size and color information: \`drawSquare(sideLength, r, g, b)\`.

This removes repeated square-drawing code while keeping the visual effect from the earlier project. Use a loop to call the helper with changing side lengths and RGB values, then verify that changing the loop rule changes the whole pattern without editing the helper body.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Square-Inception-with-Functions/solution"
				},
				{
					title: "GrS9 Supplemental Project 5: Functions Part 2 Recap",
					content: `Create a short study guide for function parameters, reusable helpers, and click-driven programs. Include the difference between defining a function and calling it, why parameters make a function more flexible, and how event listeners pass information such as mouse coordinates into a callback function.

Finish with one small original example: a function with at least one parameter, two different calls using different arguments, and one sentence explaining why that is better than copying the same code twice.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Functions-2-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Functions-2-Recap/solution"
				}
			]
		},
		{
			title: "GrS10 Nested Loops Part 2",
			curriculum: [
				{
					title: "GrS10 Project 1: Rainbow Square Inception",
					content:
						"Extend earlier nested loop work by increasing the number of shapes, adjusting turn amounts, and gradually changing color values to create a rainbow effect.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Rainbow-Square-Inception/solution"
				},
				{
					title: "GrS10 Project 2: Snowflake",
					content:
						"Use nested loops to build a snowflake from repeated branches and side branches, then adjust branch lengths, counts, and pen settings to customize the design.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Snowflake/solution"
				},
				{
					title: "GrS10 Project 3: Winter Wonderland",
					content:
						"Turn a snowflake drawing into a reusable function with multiple parameters, then call it many times with random arguments to create a full winter scene.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS10-Winter-Wonderland/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS10 Supplemental Project 1: Spiral Staircase",
					content:
						"Draw a staircase pattern that spirals outward by combining movement, turns, and a changing step length. Keep the rule for changing the step size explicit in the loop, and verify that the final image shows a consistent outward spiral rather than disconnected line segments.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS6-Spiral-Staircase/solution"
				},
				{
					title: "GrS10 Supplemental Project 2: Dizzy Hexagon",
					content: `Draw a spiral made from 100 hexagons. Each repetition draws one hexagon, rotates or moves the turtle, then prepares for the next hexagon so the final image grows into a controlled spiral instead of stacking shapes on top of each other.

Use random colors to add variety, but keep the movement rule deterministic enough to debug. If the drawing looks messy, test with fewer hexagons first, confirm one hexagon is correct, then increase the loop count gradually.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS6-Dizzy-Hexagon/solution"
				},
				{
					title: "GrS10 Supplemental Project 3: Dot Grid",
					content: `Use nested loops to generate a dot grid with configurable rows, columns, and spacing. The outer loop controls rows, while the inner loop draws dots across a row.

Store the row count, column count, dot size, and spacing in variables near the top of the program. Completion means those variables can be changed to create a wider, taller, denser, or more spread-out grid without rewriting the loop logic.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS6-Dot-Grid/solution"
				}
			]
		},
		{
			title: "GrS11 Conditionals Part 2",
			curriculum: [
				{
					title: "GrS11 Project 1: Advanced Conditionals Exploration",
					content:
						"Learn how `elif` and `else` connect to an `if` statement and use them to handle several mutually exclusive outcomes cleanly.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS11-Advanced-Conditionals-Exploration/solution"
				},
				{
					title: "GrS11 Project 2: Random Age",
					content:
						"Generate a random age, group it into named age ranges with `if`/`elif`/`else`, and display the result with Turtle writing commands.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Random-Age/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS11 Supplemental Project 1: Turtle Launch",
					content: `Create a launch simulation where a turtle travels toward a target moon. Use a random or chosen launch distance, then compare the turtle's final position to the target zone with conditionals.

The program clearly distinguishes at least three outcomes: undershoot, successful landing, and overshoot. Use color, text, or turtle position to show the result, and test boundary values close to the target so the conditional ranges are not accidentally overlapping or leaving gaps.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS9-Turtle-Launch/solution"
				},
				{
					title: "GrS11 Supplemental Project 2: Bullseye with Nested Loops",
					content: `Draw a bullseye target using a loop and the modulo operator. Each ring is drawn from the same repeated structure, while the ring size and color change from one iteration to the next.

Use \`i % 2\` or a similar expression to alternate colors predictably. Verify the pattern by changing the number of rings and checking that the alternating rule still works for both even and odd totals.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS9-Bullseye-with-Nested-Loops/solution"
				},
				{
					title: "GrS11 Supplemental Project 3: Advanced Conditionals Recap",
					content: `Create a recap for advanced conditionals. Explain when to use separate \`if\` statements, when to use an \`if\`/\`elif\`/\`else\` chain, and why the order of conditions matters when ranges overlap.

Include one original example with at least three possible outcomes. A strong recap identifies the exact condition for each branch and describes what happens at boundary values such as the smallest accepted value, largest accepted value, and values just outside the intended range.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS11Advanced-Conditionals-Recap-Template/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS11Advanced-Conditionals-Recap-Template/solution"
				}
			]
		},
		{
			title: "GrS12 Lists",
			curriculum: [
				{
					title: "Lists: Order, Indexes and Membership",
					contentKind: "reading",
					preserveInstructions: true,
					content: `A list keeps values in the order they were added. Use a for loop to visit every value, an index to select one position, and in to ask whether a value is present.

\`\`\`python
colors = []
colors.append("red")
colors.append("purple")

for color in colors:
    print(color)
print(colors[0])
print("purple" in colors)
\`\`\`

The loop prints red and then purple. Index 0 prints red again. The last line prints True. On an empty list, the loop prints nothing and the membership check returns False. An index has to name an item that exists, so check the list length before reading position 0.

Predict what changes after appending green. The order becomes red, purple, green. The first value and the membership result stay the same. In the next project, the loop draws with each color instead of printing it.

[Python list method reference](https://www.w3schools.com/python/python_ref_list.asp)`
				},
				...pythonLevel1ListProjects
			],
			supplementalProjects: [
				{
					title: "GrS12 Supplemental Project 1: Turtle Launch with Lists",
					content: `Upgrade Turtle Launch so several turtles can launch in one simulation. Store the turtle objects in a list, then iterate through the list so every turtle receives the same launch process while still getting its own random distance or result.

The list removes repeated launch code. Completion means adding another turtle only requires adding it to the list, not copying the entire movement and conditional section again.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Turtle-Launch-with-Lists/solution"
				},
				{
					title: "GrS12 Supplemental Project 2: Rainbow Path",
					content: `Store color strings in a list and iterate through them to create a path with changing colors and random turns.

Color reference: choose color strings from ${TURTLE_COLOR_REFERENCE}`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Rainbow-Path/solution"
				},
				{
					title: "GrS12 Supplemental Project 3: Debugging Lists",
					content:
						"Fix a buggy list-based program by reading console errors and matching the repaired behavior to the stated goals in the comments.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Debugging-Lists/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Debugging-Lists/solution"
				},
				{
					title: "GrS12 Supplemental Project 4: Lists Recap",
					content: `Create a recap for list creation, iteration, indexing, and membership checks. Include examples of an empty list, a list with starting values, \`.append()\`, a \`for item in list\` loop, a direct index lookup, and an \`in\` check.

For each example, explain what kind of problem it solves. The recap makes clear when a list is useful: storing related values together, applying the same command to many items, or checking whether a collection contains a value.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Lists-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Lists-Recap/solution"
				}
			]
		},
		{
			title: "GrS13 Game Mechanics",
			curriculum: pythonLevel1GameMechanicsProjects,
			supplementalProjects: [
				...pythonLevel1ArcadeSupplementalProjects,
				{
					title: "GrS13 Supplemental Project 3: Game Mechanics Recap",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Complete three finite movement exercises from the supplied starter. First move forward one pixel 100times using a counter and an explicit break. Reset position to (0, 0), face upward, and stop only when y is above 50. Reset again, face left, and stop when y is above 50 or x is below -100.

Predict the final positions before running. The reference endpoints are (100, 0), (0, 51) and (-101, 0), with 100, 51 and 101 moves. At y = 50 and x = -100 the strict comparisons are still false. Test the combined condition with (0, 51), (-101, 0), (-100, 50) and (101, 0): the expected results are true, true, false and false.

Explain which value changes on each iteration and why each loop eventually stops. Keep the three exercises separate by resetting both position and direction.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/03134b0960cfc71a0114e35e4e58be17d44b17c4/Game-Mechanics-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/03134b0960cfc71a0114e35e4e58be17d44b17c4/Game-Mechanics-Recap/solution"
				}
			]
		},
		{
			title: "Check-In #3",
			curriculum: [
				pythonLevel1CheckIn("Check-In #3 Overview"),
				{
					title: "Check-In #3: Nested Loops and Game Mechanics",
					content:
						"Review nested loops by drawing repeated shapes at random positions, then add screen updates and `while True` loops with counters or `break` conditions to simulate basic game behavior."
				},
				{
					title: "Check-In #3: Advanced Conditionals",
					content: `Compare \`elif\` and \`else\` by creating a program with several possible outcomes. Use ranges of random numbers to trigger different colors, messages, or movement rules.

The check-in shows that only one branch of an \`if\`/\`elif\`/\`else\` chain runs. Test the smallest and largest values in each range, then explain why a final \`else\` is useful for everything not matched earlier.`
				},
				{
					title: "Check-In #3: Lists",
					content:
						"Create empty lists, add multiple turtles to a list, and loop through that list to give each turtle the same command."
				},
				{
					title: "Check-In #3 Reflection",
					content:
						"Write or record a reflection about what has been most interesting, what still feels challenging, and how problem-solving has improved over time.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/solution"
				},
				pythonLevel1CheckIn("Check-In #3: Additional Practice Project")
			],
			supplementalProjects: []
		},
		{
			title: "GrS14 Space Eater",
			curriculum: [
				{
					...pythonLevel1SpaceEaterProject,
					datasetLink: TURTLE_GAME_TEMPLATE_REFERENCE
				}
			],
			supplementalProjects: [
				{
					title: "GrS14 Supplemental Project 1: Turtle Run",
					content: `Create a lane-based game where the player avoids moving enemies and collects targets for points. Organize the screen into lanes, decide how enemies move through those lanes, and give the player controls that feel predictable.

The game tracks score, detects collisions with enemies, detects successful collection of targets, and defines a clear win or loss condition. Test slow and fast enemy speeds so the game is challenging but still playable.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Turtle-Run/solution"
				},
				{
					title: "GrS14 Supplemental Project 2: Target Practice",
					content: `Build a turning-and-firing game where the player aims from the center of the screen. Keyboard controls rotate the player, and a launch key sends a projectile or turtle forward toward a target.

Use coordinate checks, distance checks, or a target radius to decide whether the shot hits. Add feedback for hit and miss outcomes, then verify edge cases where the shot passes close to the target but does not count as a hit.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Target-Practice/solution"
				},
				{
					title: "GrS14 Supplemental Project 3: Pong",
					content: `Program a two-player version of Pong with two paddles, a moving ball, wall bounces, paddle collision, scoring, and a reset after each point.

Keep the ball state explicit: position, direction, speed, and what changes after a collision. Completion means both players can control their paddles, the ball bounces from the correct surfaces, missed balls update the score, and the game can continue after a point.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Pong/solution"
				},
				{
					title: "GrS14 Supplemental Project 4: Fidget Spinner",
					content: `Animate a fidget spinner whose turn speed changes based on keyboard input. Store the current speed in a variable, update that variable when keys are pressed, and use an animation loop to rotate the spinner.

The program makes the relationship between input and state clear: one key can speed up, another can slow down, and the spinner eventually stops or slows toward a minimum speed if that rule is included. Test repeated key presses to make sure the speed does not jump unpredictably.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Fidget-Spinner/solution"
				},
				{
					title: "GrS14 Supplemental Project 5: Snake",
					content: `Create a Snake game using a list of turtle segments to represent the growing body. The head moves on a steady loop, food appears at random positions, and the body list grows when food is collected.

Track the game-over conditions explicitly: hitting a wall, colliding with the snake's own body, or any other rule chosen for the game. Test movement, food collection, body following, growth, wall collision, and self-collision separately before treating the full game as complete.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Snake/solution"
				}
			]
		},
		{
			title: "GrS15 Master Project",
			curriculum: [
				{
					title: "Bonus Concepts",
					content:
						"Explore optional advanced ideas that can support custom games, including custom turtle shapes, global variables for shared state, and mouse dragging with `.ondrag()`."
				},
				{
					title: "GrS15 Project 1: Master Project",
					content:
						"Plan and build an original game that combines the major ideas from the course. Break the project into steps, prototype core mechanics first, and then add polish or bonus features."
				},
				{
					title: "Master Project Presentation",
					content:
						"Record or share a presentation that explains how the project works and highlights the Python and Turtle concepts used to build it."
				},
				{
					title: "GrS15 Project 2: End of Course Reflection",
					content:
						"Reflect on what concepts were learned, the most challenging and most rewarding parts of the course, and how skills have grown from the beginning to the end.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/End-of-Course-Reflection/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/End-of-Course-Reflection/solution"
				}
			],
			supplementalProjects: []
		}
	]
};

interface PythonLevel1FlowConfig {
	title: string;
	estimatedTime: string;
	keyBlocks: string[];
	choiceCurriculumTitles?: string[];
	challengeCurriculumTitles?: string[];
	projectThread: string;
}

const PYTHON_LEVEL_1_FLOW: PythonLevel1FlowConfig[] = [
	{
		title: "First 10 Days: Show, Play, Then Explain",
		estimatedTime: "4–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"turtle.Turtle()",
			"for",
			"def",
			"screen.onkey()",
			"read-run-change-explain"
		],
		projectThread:
			"Run and remix the two complete visual projects before formal vocabulary. Treat the debugging routine and explanation as evidence that a visible change can be traced back to code."
	},
	{
		title: "GrS1 Coordinates and Movement",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"forward()",
			"left() / right()",
			"goto()",
			"penup() / pendown()",
			"begin_fill() / end_fill()"
		],
		projectThread:
			"Complete Turtle Exploration as the required movement-and-placement build. Use the recap or original drawing only when more coordinate or pen-control practice is useful."
	},
	{
		title: "GrS2 Loops",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: ["for", "range()", "loop body", "side count", "turn angle"],
		choiceCurriculumTitles: ["GrS2 Project 2: Smiley Face"],
		challengeCurriculumTitles: [
			"GrS2 Project 3: Open Ended Project - Drawing with Loops"
		],
		projectThread:
			"Use Basic Shapes to connect repetition count, side count, and turn angle. Continue with the required Smiley Face and original drawing projects; use supplemental shape projects when more practice is useful."
	},
	{
		title: "GrS3 Variables and Random Numbers",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"variable assignment",
			"random.randint()",
			"screen.textinput()",
			"screen.numinput()",
			"input validation"
		],
		choiceCurriculumTitles: ["GrS3 Project 3: Random Walk"],
		projectThread:
			"Move from named drawing values to bounded randomness, then collect and validate user input in the Shape Designer. Random Walk is an optional transfer project after those state changes can be explained."
	},
	{
		title: "GrS4 Conditionals Part 1",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"if",
			"comparison operators",
			"and / or",
			"xcor() / ycor()",
			"true and false branches"
		],
		projectThread:
			"Use Surprise Shape for branch selection and Find Your Turtle for coordinate regions. Test a true case, a false case, and an exact boundary before adding an optional game."
	},
	{
		title: "Check-In #1",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"Turtle movement",
			"for loops",
			"variables",
			"random values",
			"conditionals"
		],
		projectThread:
			"Use this as a readiness checkpoint, not a second unit. Complete the integrated case, record one trace, and assign only the smallest review project needed for a demonstrated gap."
	},
	{
		title: "GrS5 Loops with Variables",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"while",
			"reassignment",
			"counter",
			"coordinate condition",
			"break"
		],
		challengeCurriculumTitles: ["GrS5 Project 3: Square Spiral"],
		projectThread:
			"Use Fireworks to make reassignment visible and While Loops Exploration to connect condition, update, and stopping behavior. Square Spiral is the independent challenge."
	},
	{
		title: "GrS6 Nested Loops Part 1",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"outer loop",
			"inner loop",
			"total iterations",
			"changing size",
			"shape placement"
		],
		challengeCurriculumTitles: [
			"GrS6 Project 3: Open Ended Project - Nested Loop Pattern"
		],
		projectThread:
			"Trace one inner loop completely before advancing the outer loop, then build Square Inception. The open-ended pattern begins only after the total repetition count can be predicted."
	},
	{
		title: "GrS7 Functions Part 1",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"def",
			"function call",
			"helper function",
			"local responsibility",
			"reuse"
		],
		projectThread:
			"Refactor the repeated house parts into named helpers, then build and call small Turtle utilities. Two calls demonstrate that a function is being reused."
	},
	{
		title: "GrS8 Event Listeners",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"screen.onkey()",
			"screen.onclick()",
			"screen.listen()",
			"callback function",
			"canvas focus"
		],
		choiceCurriculumTitles: ["GrS8 Project 3: Picasso Game"],
		projectThread:
			"Connect one named function to one input event, then build Etch A Sketch with dependable canvas focus and controls. Picasso is a choice because its main idea was previewed in the opening module."
	},
	{
		title: "Check-In #2",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"while and nested loops",
			"function definitions",
			"function calls",
			"event callbacks",
			"clean restart"
		],
		projectThread:
			"Trace one input from event to function to visible result, then use targeted review only for the loop, function, or event step that cannot yet be explained."
	},
	{
		title: "GrS9 Functions Part 2",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"parameters",
			"arguments",
			"multiple calls",
			"click coordinates",
			"generalized helper"
		],
		choiceCurriculumTitles: ["GrS9 Project 3: Polka Dots"],
		challengeCurriculumTitles: [
			"GrS9 Project 4: Click and Draw Rectangles"
		],
		projectThread:
			"Generalize repeated shape functions with parameters before adding coordinate-driven callbacks. Polka Dots is a guided choice and Click and Draw Rectangles is the four-quadrant challenge."
	},
	{
		title: "GrS10 Nested Loops Part 2",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"nested loops",
			"function parameters",
			"rotation",
			"changing color",
			"random placement"
		],
		choiceCurriculumTitles: ["GrS10 Project 1: Rainbow Square Inception"],
		challengeCurriculumTitles: ["GrS10 Project 3: Winter Wonderland"],
		projectThread:
			"Use Snowflake as the required synthesis of nested structure and reusable drawing. Rainbow Square Inception is a fluency choice; Winter Wonderland is the parameter-and-randomness challenge."
	},
	{
		title: "GrS11 Conditionals Part 2",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"if / elif / else",
			"ordered ranges",
			"mutually exclusive outcomes",
			"boundary values",
			"fallback branch"
		],
		projectThread:
			"Build ordered branches, then test the smallest and largest value in every range. Random Age is complete only when there are no overlaps or uncovered boundary values."
	},
	{
		title: "GrS12 Lists",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"list literal",
			"append()",
			"for item in list",
			"index",
			"in"
		],
		projectThread:
			"Explore list creation and mutation, then use Which Way Turtles to apply one command to many objects. In Random Number Lists, keep the original values while drawing two transformed rows."
	},
	{
		title: "GrS13 Game Mechanics",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"screen.ontimer()",
			"screen.tracer() / update()",
			"boundary checks",
			"object lists",
			"collision helper"
		],
		projectThread:
			"Schedule a short movement frame and let key handlers run between frames. Add a stopping boundary, one redraw per frame, reflected movement, and a collision transition. Test each mechanic before combining it with the next."
	},
	{
		title: "Check-In #3",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"nested loops",
			"if / elif / else",
			"lists of turtles",
			"animation loop",
			"collision or target check"
		],
		projectThread:
			"Use the target game as the integrated readiness check for the capstone sequence. Record one normal run, one boundary case, and one restart before continuing."
	},
	{
		title: "GrS14 Space Eater",
		estimatedTime: "3–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"player controls",
			"lists of targets",
			"collision detection",
			"score state",
			"win, loss, and restart"
		],
		projectThread:
			"Ship Space Eater as the first complete game: controls, targets, score, collision feedback, end state, and clean replay. Use the alternate games only as transfer or challenge work."
	},
	{
		title: "GrS15 Master Project",
		estimatedTime: "5–7 sessions · 45–60 minutes each",
		keyBlocks: [
			"project plan",
			"minimum playable loop",
			"functions and lists",
			"game-state tests",
			"presentation and reflection"
		],
		choiceCurriculumTitles: ["Bonus Concepts"],
		projectThread:
			"Plan and ship a minimum playable version before optional shapes, dragging, levels, or visual polish. Present one state system, one reusable function, one bug fixed, and one tested edge case."
	}
];

const PYTHON_LEVEL_1_CHALLENGE_PROJECT_RE =
	/open ended|advanced|dodgeball|snake|pong|target practice|turtle run|light the stars|turtle launch with lists|bullseye with nested loops|reverse|winter wonderland|dizzy hexagon|circle of circles|spirals|minion|captain america|taxi|watermelon|haphazard|boolean bonanza/i;
const PYTHON_LEVEL_1_COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const PYTHON_LEVEL_1_NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const PYTHON_LEVEL_1_LEADING_HYPHENS_RE = /^-+/;
const PYTHON_LEVEL_1_TRAILING_HYPHENS_RE = /-+$/;

function pythonLevel1Slugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(PYTHON_LEVEL_1_COMBINING_MARKS_RE, "")
		.replace(PYTHON_LEVEL_1_NON_ALPHANUMERIC_RE, "-")
		.replace(PYTHON_LEVEL_1_LEADING_HYPHENS_RE, "")
		.replace(PYTHON_LEVEL_1_TRAILING_HYPHENS_RE, "");
}

function preservePythonLevel1Ids(
	module: RawCourseModule,
	legacyModuleId: string
) {
	for (const [items, prefix] of [
		[module.curriculum, "curriculum"],
		[module.supplementalProjects, "supplemental"]
	] as const) {
		for (const item of items) {
			item.id ??= pythonLevel1Slugify(
				`${legacyModuleId}-${prefix}-${item.title}`
			);
		}
	}
}

function pythonLevel1SupplementalPath(
	item: Pick<RawCourseModuleItem, "title">
): CourseItemLearningPath {
	return PYTHON_LEVEL_1_CHALLENGE_PROJECT_RE.test(item.title)
		? "challenge"
		: "choice";
}

function configurePythonLevel1Module(
	module: RawCourseModule,
	config: PythonLevel1FlowConfig
) {
	const legacyModuleId = pythonLevel1Slugify(
		`python-level-1-${module.title}`
	);
	module.id ??= legacyModuleId;
	preservePythonLevel1Ids(module, legacyModuleId);

	const choiceTitles = new Set(
		(config.choiceCurriculumTitles ?? []).filter(
			title => !isCoreProjectTitle(title)
		)
	);
	const challengeTitles = new Set(
		(config.challengeCurriculumTitles ?? []).filter(
			title => !isCoreProjectTitle(title)
		)
	);
	const movedPractice = module.curriculum.filter(
		item => choiceTitles.has(item.title) || challengeTitles.has(item.title)
	);
	module.curriculum = module.curriculum.filter(
		item =>
			!choiceTitles.has(item.title) && !challengeTitles.has(item.title)
	);

	for (const item of module.curriculum) {
		item.learningPath = "core";
	}
	for (const item of movedPractice) {
		item.learningPath = challengeTitles.has(item.title)
			? "challenge"
			: "choice";
	}
	for (const item of module.supplementalProjects) {
		item.learningPath = pythonLevel1SupplementalPath(item);
	}
	module.supplementalProjects = [
		...movedPractice,
		...module.supplementalProjects
	];
	module.estimatedTime = config.estimatedTime;
	module.keyBlocks = [...config.keyBlocks];

	if (module.curriculum[0]) {
		module.curriculum[0].content = [
			module.curriculum[0].content,
			`**Course flow:** ${config.projectThread}`
		].join("\n\n");
	}

	return module;
}

function configurePythonLevel1Flow(course: RawCourse) {
	const modulesByTitle = new Map(
		course.modules.map(module => [module.title, module])
	);

	course.modules = PYTHON_LEVEL_1_FLOW.map(config => {
		const module = modulesByTitle.get(config.title);
		if (!module) {
			throw new Error(`Python Level 1 flow is missing ${config.title}.`);
		}
		return configurePythonLevel1Module(module, config);
	});
}

configurePythonLevel1Flow(pythonLevel1Course);
