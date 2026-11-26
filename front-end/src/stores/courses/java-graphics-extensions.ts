import type { RawCourseModule } from "./types";
import { javaPracticeSource } from "./javaLevel1PracticeSources";

export const javaLevel1GraphicsExtensionModules: RawCourseModule[] = [
	{
		title: "Java Level 1 Graphics Extension: Visual Project Setup",
		curriculum: [
			{
				title: "Graphics Extension Positioning",
				content:
					"**Concept path:** Graphics projects are optional extensions inside Java Level 1. They start after the Karel robot launch and reuse the same foundations: variables, conditionals, loops, methods, coordinate reasoning, and object-state explanations.\n\n**Design guardrail:** Visual output makes program state easier to inspect; it does not replace reasoning about state. Strong projects still name their inputs, model values, helper methods, and edge cases before adding visual polish.\n\n**Evidence target:** A graphics project is complete when the visual output can be explained from code structure: which method draws each part, which variables control placement or size, and what change would produce a predictable new result."
			},
			{
				title: "Graphics Setup Expectations",
				content:
					"**Concept path:** Keep graphics work intentionally small and local: understand coordinates, shape sizing, color selection, repeated drawing with loops, and helper methods that compose a larger scene. Graphics setup does not replace the main Java goals of clean control flow and object design.\n\n**Setup boundary:** Graphics setup is useful only after the compile-run workflow is stable. The project first proves that a tiny shape renders, then adds coordinate reasoning, repeated shapes, helper methods, and scene-level organization in separate steps.\n\n**Evidence target:** A graphics project includes a coordinate sketch, named helper methods, and at least one changed input or setting that visibly changes the output in a predictable way."
			}
		],
		supplementalProjects: [
			{
				title: "Graphics Extension Checkpoint: Coordinate Sketch",
				content:
					"Before coding, sketch a small coordinate plane and label the top-left origin, x direction, y direction, width, and height for three planned shapes.\n\n**Completion check:** The sketch predicts at least one exact rectangle or oval position before the program runs, then compares the prediction with the rendered result and revises the coordinate model if needed."
			},
			{
				title: "Graphics Extension Checkpoint: Scene Decomposition",
				content:
					"Pick a drawing project and split it into helper methods such as background, main character, details, and repeated decorations.\n\n**Completion check:** Each helper owns one visual responsibility and receives enough parameters to avoid hard-coding every detail. The final scene becomes easier to modify because repeated drawing logic lives in named methods."
			}
		]
	},
	{
		title: "Java Level 1 Graphics Extension: Coordinates, Color, and Shapes",
		curriculum: [
			{
				title: "Coordinate Systems and Drawing Primitives",
				content:
					"**Concept path:** The drawing surface is a coordinate system with an origin, x/y directions, widths, heights, colors, and layering order. Predict where a shape appears before running the program.\n\n**Practice targets:** Draw one shape by hand from its coordinates, change only one parameter, and predict the visual effect before rerunning. Include one overlap or layering example so drawing order is visible.\n\n**Evidence target:** The coordinate explanation accounts for both position and size. A common error is treating width and height as the second corner instead of dimensions measured from the starting coordinate."
			},
			{
				title: "Java Graphics Project 1: Rainbow",
				preserveInstructions: true,
				content:
					"Draw six nested arcs from outside to inside: red, orange, yellow, green, blue and magenta. Keep the arcs centered. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Check that all six bands appear in the requested order. Compare the x coordinate of an arc’s left edge with its width. The arc’s midpoint stays fixed as its width shrinks.",
				projectLink: `${javaPracticeSource}/JS2_Rainbow/starter`,
				solutionLink: `${javaPracticeSource}/JS2_Rainbow/solution`
			},
			{
				title: "Java Graphics Project 2: Snowman Scene",
				preserveInstructions: true,
				content:
					"Stack three white snowballs on a contrasting background. Add a hat, arms and a face. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Check that each snowball overlaps the one below and that the head is smallest. Drawing the hat after the snowballs keeps the brim visible.",
				projectLink: `${javaPracticeSource}/JS2_Snowman/starter`,
				solutionLink: `${javaPracticeSource}/JS2_Snowman/solution`
			}
		],
		supplementalProjects: [
			{
				title: "Java Graphics Project 3: Which Shape?",
				preserveInstructions: true,
				content:
					"Use the shape string to select a circle, square or Pac-Man. Test all three and give unknown values a visible fallback. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Render a valid example of each shape and one unknown value. The unknown case shows readable fallback text. The valid examples display only their requested shape.",
				projectLink: `${javaPracticeSource}/JS3_Which_Shape/starter`,
				solutionLink: `${javaPracticeSource}/JS3_Which_Shape/solution`
			},
			{
				title: "Java Graphics Extension: Coordinate Refactor",
				content:
					"Choose one shape-heavy drawing and replace copied coordinate literals with named variables for the anchor point, spacing, or size rule.\n\n**Completion check:** Changing one variable moves or resizes a meaningful part of the scene predictably, and the explanation names which repeated coordinate relationship became easier to maintain."
			}
		]
	},
	{
		title: "Java Level 1 Graphics Extension: Loops, Methods, and Scene Composition",
		curriculum: [
			{
				title: "Drawing with Loops and Helper Methods",
				content:
					"**Concept path:** Move from one-off shapes to repeated visual structure. Cover loop-driven patterns, random placement, helper methods for reusable drawing pieces, and the difference between visual complexity and code complexity.\n\n**Practice targets:** One correctly placed shape becomes a helper method, then that helper is called from a loop with changing coordinates, color, or size. A strong result makes the repeated rule visible in code.\n\n**Evidence target:** The final scene becomes shorter or easier to adjust because repetition moved into a loop or helper method. If adding the tenth object requires copying the same long block again, the decomposition has not done enough work."
			},
			{
				title: "Java Graphics Project 1: Paintball Pattern",
				preserveInstructions: true,
				content:
					"Draw an X from two diagonals of circles. Use one loop and two fillOval calls. Predict where the two paths meet. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Count the positions along both diagonals and inspect the center of the X. Moving one circle right by one step in the loop moves its partner left by the same amount.",
				projectLink: `${javaPracticeSource}/JS4_Paintball/starter`,
				solutionLink: `${javaPracticeSource}/JS4_Paintball/solution`
			},
			{
				title: "Java Graphics Project 2: Picasso Method Art",
				preserveInstructions: true,
				content:
					"Write three shape helpers with color, position and size parameters. Call each helper 500 times using random inputs. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Run once with a fixed seed to debug repeatably. Check that a call with a different color or position changes the canvas independently of the other helpers.",
				projectLink: `${javaPracticeSource}/JS6_Picasso/starter`,
				solutionLink: `${javaPracticeSource}/JS6_Picasso/solution`
			}
		],
		supplementalProjects: [
			{
				title: "Java Graphics Project 3: Scene Composer",
				content:
					"Combine at least three helper methods into one original scene. Include a short written plan that names each helper and explains what visual responsibility it owns.\n\n**Completion check:** The scene is easier to extend because new details can be added through another helper call instead of editing one long drawing block."
			},
			{
				title: "Java Graphics Extension: Pattern Parameter Swap",
				content:
					"Take an existing loop-driven pattern and add parameters for count, spacing, color family, or starting coordinate. Run two versions of the same helper with different arguments.\n\n**Completion check:** The two outputs visibly share the same rule while differing in one controlled way, and the method signature makes the adjustable choices clear."
			}
		]
	}
];
