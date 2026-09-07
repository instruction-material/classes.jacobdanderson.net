import type { ImplementationLabSection } from "./implementationLabGuidance";
import type { RawCourse, RawCourseModuleItem } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { javaLevel1GraphicsExtensionModules } from "./java-graphics-extensions";
import { isCoreProjectTitle } from "./projectGrouping";
import { buildProjectGuidance } from "./projectGuidance";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

const JAVA_LEVEL_1_ORIGINAL_MEDIA = [
	"js1_chatbot.mp4",
	"js1_division_facts.mp4",
	"js1_first_middle_last.mp4",
	"js1_mad_libs.mp4",
	"js2_basic_shapes.png",
	"js2_happy_graphics.png",
	"js2_rainbow.png",
	"js2_snowman.png",
	"js2_temperature_converter.mp4",
	"js3_code_your_own_adventure.mp4",
	"js3_color_mixer.mp4",
	"js3_elevator_limits.mp4",
	"js3_spreadsheet_width.mp4",
	"js3_too_chicken_to_cross_the_road.mp4",
	"js3_weather_activities.mp4",
	"js3_which_shape.mp4",
	"js4_checkout_calculator.mp4",
	"js4_letter_square.mp4",
	"js4_loops_practice.mp4",
	"js4_nested_loops.mp4",
	"js4_paintball.png",
	"js5_letter_guesser.mp4",
	"js5_mathematical_challenges.mp4",
	"js5_number_guesser.mp4",
	"js6_caught_speeding.png",
	"js6_methods_practice.png",
	"js6_min_and_max.png",
	"js6_palindrome_checker.png",
	"js6_picasso.png",
	"js6_string_expander.mp4",
	"js7_airline_management.mp4",
	"js7_arithmetic_sequence.mp4",
	"js7_fortuneteller.mp4",
	"js7_high_score_list.mp4",
	"js7_lucky_array.mp4",
	"js7_practice_with_arraylists.mp4",
	"js7_practice_with_arrays.png",
	"js7_song_shuffler.mp4",
	"js7_string_to_array.png",
	"js7_too_much_reversing.png",
	"js8_2d_array_to_string.png",
	"js8_grid_drawer.mp4",
	"js8_magic_square.png",
	"js8_practice_with_2d_arrays.png",
	"js8_square_of_squares.mp4",
	"js9_advanced_battleship.mp4",
	"js9_simple_battleship.mp4"
];

const javaFoundationBuildContexts = {
	13: {
		code: "J1X02",
		focus: "enhanced `for` loops, `%` divisibility checks, accumulator variables, even-value filtering, and hand-checking a computed total",
		artifact:
			"the `computeScore(List<Integer> values)` method, the even-value rule, the default list, and one custom list with odd values or zero",
		invariant:
			"the invariant that odd values do not affect the score and the input list is never changed",
		exampleCase:
			"For **Java Foundations Build 13**, trace `List.of(2, 5, 8, 13)` by hand before coding. The even values are `2` and `8`, so the expected score is `10`.",
		boundaryCase:
			"Then check an all-odd list and a list containing `0` so the `% 2 == 0` condition is understood as a rule rather than a memorized sample.",
		reviewEvidence:
			"Summarize the divisibility condition, which values were skipped, which values were added, and the custom case used to prove the accumulator is correct."
	},
	14: {
		code: "J1X03",
		focus: "`if`/`else` scoring rules, threshold comparisons, accumulator updates, and predicting output before running the program",
		artifact:
			"the weighted `computeScore(List<Integer> values)` method, the `>= 10` threshold, the doubled-value branch, and a test case containing exactly `10`",
		invariant:
			"the invariant that values below `10` count once while values `10` or higher count twice",
		exampleCase:
			"For **Java Foundations Build 14**, trace `List.of(2, 5, 8, 13)` as `2 + 5 + 8 + 26`, producing an expected score of `41`.",
		boundaryCase:
			"Then test a value exactly equal to `10` so the inclusive threshold is explicit and not confused with `> 10`.",
		reviewEvidence:
			"Summarize the threshold rule, both branches of the conditional, and the custom case that proves the boundary value belongs in the doubled branch."
	},
	15: {
		code: "J1X04",
		focus: "method parameters, inclusive range checks, boolean `&&`, counting matching values, and distinguishing a count from a sum",
		artifact:
			"the `computeScore(List<Integer> values, int min, int max)` method, the inclusive `min`/`max` rule, and a default call using the range `5` through `10`",
		invariant:
			"the invariant that both endpoints are included and only matching values increase the count",
		exampleCase:
			"For **Java Foundations Build 15**, trace `List.of(2, 5, 8, 13)` with range `5` to `10`; only `5` and `8` match, so the expected result is `2`.",
		boundaryCase:
			"Then test values equal to `min` and `max` so the inclusive comparison is verified from both sides.",
		reviewEvidence:
			"Summarize the boolean expression, which values matched, which values failed, and why the method returns a count instead of a total."
	},
	16: {
		code: "J1X05",
		focus: "index-based loops, adjacent list access, best-so-far tracking, positive differences, and safe behavior for short or non-increasing lists",
		artifact:
			"the largest-adjacent-gap `computeScore(List<Integer> values)` method, the `values.get(i)` and `values.get(i - 1)` comparison, and a default increasing list",
		invariant:
			"the invariant that a list with fewer than two values or no positive adjacent increase returns `0`",
		exampleCase:
			"For **Java Foundations Build 16**, trace the adjacent gaps in `List.of(2, 5, 8, 13)`: `3`, `3`, and `5`; the expected score is `5`.",
		boundaryCase:
			"Then test a one-element list and a decreasing list so the loop bounds and default `0` result are justified.",
		reviewEvidence:
			"Summarize the loop start index, the adjacent values compared, the largest gap found, and the short-list or non-increasing case used for verification."
	},
	17: {
		code: "J1X06",
		focus: "two-pass list processing, average calculation, integer-to-double conversion, empty-list handling, and counting values above a computed benchmark",
		artifact:
			"the above-average `computeScore(List<Integer> values)` method, the total pass, the average calculation, the count pass, and the empty-list guard",
		invariant:
			"the invariant that an empty list returns `0` and only values strictly greater than the average are counted",
		exampleCase:
			"For **Java Foundations Build 17**, trace `List.of(2, 5, 8, 13)`: the average is `7.0`, and `8` plus `13` are above average, so the expected result is `2`.",
		boundaryCase:
			"Then test an empty list and a list where every value equals the average so strict greater-than behavior is clear.",
		reviewEvidence:
			"Summarize why two passes are used, how the average is calculated as a `double`, and which custom case proves the empty or equal-to-average behavior."
	}
} satisfies Record<
	number,
	{
		code: string;
	} & NonNullable<
		Parameters<typeof buildImplementationLabGuidance>[0]["context"]
	>
>;

function buildJavaFoundationGuidance(
	build: keyof typeof javaFoundationBuildContexts,
	section: ImplementationLabSection
) {
	const context = javaFoundationBuildContexts[build];

	return buildImplementationLabGuidance({
		courseFamily: "Java Level 1",
		moduleTitle: `${context.code} Java Foundations Build ${build}: Practice Studio`,
		section,
		context
	});
}

const javaLevel1SourceCourse: RawCourse = {
	name: "Java Level 1",
	modules: [
		{
			title: "J1A Visual Java Launch: Karel Robot Worlds",
			curriculum: [
				{
					title: "Course Launch: Start Java Visually",
					content:
						"The opening Java sequence starts in a visible robot world before switching to console-only programs. For the first week or roughly first three class meetings, Karel makes the object on a grid, one small command, and compiler feedback visible together. BlueJ in class fits the object-bench and Karel workflow, while CodeHS or the browser Code IDE outside class provides the fallback when device installs are unavailable.",
					projectLink: "/ide?mode=karel"
				},
				{
					title: "First-Week Karel Cadence",
					content:
						"Repeat several short robot exercises before the text bridge: one movement trace, one blocked-move error, one beeper or wall task, one helper-method refactor, and one parameterized movement. This keeps Java visual long enough for syntax, main method structure, state, method calls, and errors to become concrete without turning the whole course into a robot course."
				},
				{
					title: "Compile, Run, Observe, Repair",
					content:
						"Missing semicolons, mismatched braces, wrong capitalization, and blocked robot moves become intentional first errors. The repair routine reads the Java file, line, and symbol before the program runs, then uses one-line changes, reruns, and short explanations to separate compile-time, runtime, and logic errors."
				},
				{
					title: "Robot State: Street, Avenue, Direction, Beepers",
					content:
						"The robot is the first inspectable Java object in the course. Track its street, avenue, direction, and beeper count after each call to `move()`, `turnLeft()`, `pickBeeper()`, or `putBeeper()`. This gives variables and object state a visible meaning before those ideas move into console variables."
				},
				{
					title: "J1A Project 1: Robot Walkthrough",
					content:
						"Create a short robot program that starts Karel at a known location, moves around one obstacle, and ends at a named target square. Include a written trace with the robot's street, avenue, and direction after each major step.",
					projectLink: "/ide?mode=karel"
				},
				{
					title: "Visual Exit Ticket: Ready for Text",
					content:
						"Before moving to console-only Java, the exit ticket explains one robot program from class name to `main()`, statement order, constructor arguments, state changes, and final grid evidence. A ready explanation can fast-forward into the text bridge while keeping the visual model available for debugging later."
				}
			],
			supplementalProjects: [
				{
					title: "J1A Supplemental Project 1: Beeper Delivery",
					content:
						"Place one beeper at a start square, move it to a target square, and explain how the robot's visible state proves the program worked. Add one blocked-path case if the world supports walls."
				},
				{
					title: "J1A Supplemental Project 2: Error Journal",
					content:
						"Collect three intentional errors from the robot project: one syntax error, one runtime/world error, and one logic error. For each, record the message or symptom, the cause, and the smallest code change that fixed it."
				},
				{
					title: "J1A Supplemental Project 3: Blocked Move Debugging",
					content:
						"Create one world where a robot move fails because of a wall or boundary. Predict the failure, run the program, record the message or visual symptom, then repair the path with the smallest code change that still reaches the target."
				},
				{
					title: "J1A Supplemental Project 4: Five-Robot Warm-Up Set",
					content:
						"Complete five small Karel warm-ups: straight path, turn sequence, beeper pickup, blocked-path repair, and target-square challenge. The set is finished when each program has a short state trace and one sentence explaining what changed visually."
				}
			]
		},
		{
			title: "J1B Visual Java Syntax: Types, Objects, and Methods",
			curriculum: [
				{
					title: "Main Method and Program Skeleton",
					content:
						"`public static void main(String[] args)` is introduced as the place where a Java program starts, with the explanation attached to a running robot program. The checkpoint identifies the class name, braces, method header, statements, and semicolons before memorized terminology becomes the focus."
				},
				{
					title: "Primitives vs. Objects with Visual Inspection",
					content:
						"Use BlueJ object inspection or equivalent diagrams to contrast primitive values such as `int`, `double`, `char`, and `boolean` with object references such as `String` or a robot object. Include a concrete replacement trace such as `int x = 7; x = 9;` to show that primitives store direct values, while objects come from classes, carry methods, and preserve inspectable state."
				},
				{
					title: "Parameters and Arguments from Robot Construction",
					content:
						"Parameters begin with visible robot setup: street, avenue, direction, and beeper count. The checkpoint explains how changing one constructor argument changes the robot's starting state, then transfers that idea to ordinary method calls and to helpers such as `moveMany(3)` instead of three copied move statements."
				},
				{
					title: "J1B Project 1: Parameterized Robot Moves",
					content:
						"Refactor a repeated robot path into helper methods such as `turnRight()`, `moveTwice()`, or `moveToWall()`. Then add at least one method with a parameter, making repeated visual behavior reusable through code.",
					projectLink: "/ide?mode=karel"
				}
			],
			supplementalProjects: [
				{
					title: "J1B Supplemental Project 1: String Object Inspection",
					content:
						"Create several `String` values and inspect or diagram their methods, length, and characters. Connect this to why `length()`, `charAt()`, and `substring()` use method-call syntax while primitive values do not."
				},
				{
					title: "J1B Supplemental Project 2: Constructor Swap",
					content:
						"Run the same robot program with different starting constructor arguments. Record which changes affected the starting position, facing direction, beeper count, and final behavior."
				},
				{
					title: "J1B Supplemental Project 3: Primitive Replacement Trace",
					content:
						"Trace a primitive variable before and after reassignment, then contrast it with a `String` or robot object that exposes methods. The finished note names which values are direct primitive storage and which behavior comes from a class-defined object."
				}
			]
		},
		{
			title: "J1C Text Bridge: Variables, Strings, and Input",
			curriculum: [
				{
					title: "Introductions and Java Setup",
					content:
						"Move from visual robot programs into console Java only after the robot trace is comfortable. Keep the same compile-run-observe habit, now using `main()`, `System.out.print`, variables, and typed input to make program state visible through output instead of a grid."
				},
				{
					title: "Optional Python-to-Java Bridge",
					content:
						"The `Python to Java and C++ Bridge` course or its equivalent addendum fits before or alongside the first Java module when the Python sequence is already familiar. The point is to translate typed variables, method signatures, `Scanner`, and compiler feedback into familiar concepts rather than treating Java as a fresh start."
				},
				{
					title: "Primitive Types",
					content:
						"This module covers the built-in Java types `int`, `double`, `char`, and `boolean`, along with declaring variables, assigning values, printing them, and noticing Java syntax such as semicolons and single quotes for characters.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Primitives"
				},
				{
					title: "Strings",
					content:
						"Use `String` values, compare them with primitive types, and practice built-in string methods such as `length()`, `charAt()`, and `substring()`. Then combine strings with other values using concatenation."
				},
				{
					title: "Input and Output",
					content:
						"Import `Scanner`, create a scanner object, prompt the user with `System.out.print`, and store responses with methods such as `nextLine()`."
				},
				{
					title: "JS1 Project 1: Chat Bot",
					content:
						"Create a chatbot that asks at least five questions, stores the user's answers, and prints customized responses using string concatenation and input handling.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Chat-Bot",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Chat-Bot"
				},
				{
					title: "JS1 Project 2: First Middle Last",
					content:
						"Ask the user for a word and print its first, middle, and last characters. As an optional extension, remove one of those characters using substring logic.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-First-Middle-Last",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-First-Middle-Last"
				}
			],
			supplementalProjects: [
				{
					title: "JS1 Supplemental Project 1: Mad Libs",
					content:
						"Ask the user for different parts of speech and print a completed Mad Lib story using their responses.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Mad-Libs",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Mad-Libs"
				},
				{
					title: "JS1 Supplemental Project 2: Division Facts",
					content:
						"Build Division Facts as an object-design exercise that asks for two numbers, computes the quotient and remainder without using the `%` operator, and explains the arithmetic rule in code. Verify the Division Facts object-design exercise with one standard case and one boundary case that exposes the key concept.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Division-Facts",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Division-Facts"
				},
				{
					title: "Variable Types & Input/Output Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS1 Variable Types & Input/Output",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-01-js1-variable-types-input-output-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-01-js1-variable-types-input-output-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1D Text Bridge: Casting, Operators, and Coordinate Reasoning",
			curriculum: [
				{
					title: "Casting",
					content:
						"Learn how casting changes the type the computer uses for a value. Compare automatic casting with explicit casts, especially when mixing `int` and `double` values in arithmetic.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Casting-Reference"
				},
				{
					title: "Mathematical Operators",
					content:
						"Practice Java arithmetic with `+`, `-`, `*`, `/`, and `%`, and compare how order of operations and parentheses affect the result of expressions.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Math-Operators-Reference"
				},
				{
					title: "JS2 Project 1: Temperature Converter",
					content:
						"Read temperature input from the user, convert between Fahrenheit and Celsius, and use casting to produce more accurate results before rounding to whole numbers.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter/src/main/java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter/src/main/java"
				},
				{
					title: "Casting and Operators: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Casting and Operators",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JS2 Supplemental Project 1: Rainbow",
					content:
						"Use the graphics methods introduced in the optional BlueJ workflow to create a six-color rainbow.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow"
				},
				{
					title: "JS2 Supplemental Project 2: Snowman",
					content:
						"Use graphics methods to draw and customize a snowman with extra features such as a scarf, arms, or snowflakes.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Snowman",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Snowman"
				},
				{
					title: "Casting and Operators Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS2 Casting and Operators",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-js2-casting-and-operators-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-js2-casting-and-operators-supplemental-3/solution"
				},
				{
					title: "Basic Shapes (Optional)",
					content:
						"Use BlueJ graphics methods such as `fillRect`, `fillOval`, and `fillArc` with `setColor` to explore Java graphics coordinates, color, and shape sizing.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS2_Basic_Shapes.java"
				},
				{
					title: "Happy Graphics (Optional)",
					content:
						"Use the same drawing methods to create a smiley face and a pair of Pac-Man characters.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS2_Happy_Graphics.java"
				}
			]
		},
		{
			title: "J1E Branching Logic: Console Choices and Visual Decisions",
			curriculum: [
				{
					title: "Conditionals",
					content:
						"Practice `if`, `else if`, and `else`, along with comparison operators and logical operators such as `!`, `&&`, and `||`. Pay special attention to comparing strings with `.equals()` rather than `==`."
				},
				{
					title: "JS3 Project 1: Code Your Own Adventure",
					content:
						"Create a text-based choose-your-own-adventure game using nested conditionals to handle multiple user choices and branching outcomes.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Code-Your-Own-Adventure",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Code-Your-Own-Adventure"
				},
				{
					title: "JS3 Project 2: Color Mixer",
					content:
						"Ask the user for two primary colors, validate the input, and use conditional logic to determine the resulting mixed color or print an error if the input is invalid.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Color-Mixer",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Color-Mixer"
				},
				{
					title: "Conditionals: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Conditionals",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental Graphics Project: Which Shape? (Optional)",
					content:
						"Use a string and conditionals in a BlueJ graphics project to decide whether to draw a circle, square, Pac-Man, or another shape.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS3_Which_Shape.java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS3_Which_Shape.java"
				},
				{
					title: "JS3 Supplemental Project 1: Elevator Limits",
					content:
						"Check whether an elevator is above or below its weight limit and print how far over or under the limit it is.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Elevator-Limits",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Elevator-Limits"
				},
				{
					title: "JS3 Supplemental Project 2: Weather Activities",
					content:
						"Ask the user about the weather and recommend an activity based on their answer.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Weather-Activities",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Weather-Activities"
				},
				{
					title: "JS3 Supplemental Project 3: Too Chicken to Cross the Road",
					content:
						"Read booleans for the left and right sides of the road and use conditionals to tell Charlie the chicken whether it is safe to cross.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Too-Chicken-to-Cross-the-Road",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Too-Chicken-to-Cross-the-Road"
				},
				{
					title: "JS3 Supplemental Project 4: Spreadsheet Width",
					content:
						"Format a word so it fits within a given spreadsheet cell width by either trimming or padding it, then print it between vertical bars.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Spreadsheet-Width",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Spreadsheet-Width"
				}
			]
		},
		{
			title: "J1F Repetition: Console Patterns and Grid Moves",
			curriculum: [
				{
					title: "For Loops",
					content:
						"Use `for` loops to repeat code with a loop variable, a stopping condition, and an update step. Practice counting forward, backward, and by larger increments."
				},
				{
					title: "While Loops",
					content:
						"Compare `while` loops with `for` loops, and practice using changing conditions and `while (true)` plus `break` to control repetition."
				},
				{
					title: "JS4 Project 1: Loops Practice",
					content:
						"Use loops to print ranges of numbers, even numbers, countdowns, and the sum of 1 through 100 with both `for` loops and `while` loops.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Loop-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Loop-Practice"
				},
				{
					title: "JS4 Project 2: Nested Loops",
					content:
						"Use nested loops to print multiplication tables and text patterns such as triangles of stars and diagonal marker patterns that combine loops with conditionals.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Nested-Loops",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Nested-Loops"
				}
			],
			supplementalProjects: [
				{
					title: "JS4 Supplemental Graphics Project: Paintball (Optional)",
					content:
						"Use loops and coordinates in a BlueJ graphics project to draw diagonals of circles and experiment with other repeated patterns.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS4_Paintball.java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS4_Paintball.java"
				},
				{
					title: "JS4 Supplemental Project 1: Letter Square",
					content:
						"Ask the user for a letter and a size, then print a square made of that letter using both `for` loops and `while` loops.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Letter-Square",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Letter-Square"
				},
				{
					title: "JS4 Supplemental Project 2: Checkout Calculator",
					content:
						"Keep asking the user for item prices until they enter 0, then print the total cost.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Checkout-Calculator",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Checkout-Calculator"
				},
				{
					title: "JS4 Supplemental Project 3: Pyramid",
					content:
						"Use nested loops to print a slash-and-backslash pyramid pattern in the console.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Pyramid",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Pyramid"
				}
			]
		},
		{
			title: "J1G Loops, Conditionals, and Randomized Games",
			curriculum: [
				{
					title: "Random Numbers and Letters",
					content:
						"Use `Math.random()` to create random integers in different ranges, then use ASCII values and casting to generate random lowercase letters and simple random words."
				},
				{
					title: "JS5 Project 1: Letter Guesser",
					content:
						"Pick a random lowercase letter, ask the user to guess until they get it right, and count how many guesses it took.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Letter-Guesser",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Letter-Guesser"
				},
				{
					title: "JS5 Project 2: Mathematical Challenges",
					content:
						"Complete several challenge problems, including FizzBuzz, listing all factors of a number, and reversing a string.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Mathematical-Challenges",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Mathematical-Challenges"
				},
				{
					title: "Practice with Loops & Conditionals: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Practice with Loops & Conditionals",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JS5 Supplemental Project 1: Number Guesser",
					content:
						"Create a number guessing game with a user-defined range, random target, feedback on each guess, and a final guess count.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Random-Number-Guesser",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Random-Number-Guesser"
				},
				{
					title: "Practice with Loops & Conditionals Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS5 Practice with Loops & Conditionals",
						itemTitle:
							"Practice with Loops & Conditionals Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-js5-practice-with-loops-conditionals-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-js5-practice-with-loops-conditionals-supplemental-2/solution"
				},
				{
					title: "Practice with Loops & Conditionals Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS5 Practice with Loops & Conditionals",
						itemTitle:
							"Practice with Loops & Conditionals Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-js5-practice-with-loops-conditionals-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-js5-practice-with-loops-conditionals-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1H Check-In: Visual-to-Text Foundations",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"This module is a low-pressure review of variables, strings, conditionals, and loops after the visual-to-text bridge. Work through the prompts independently first, then revisit any ideas that need reinforcement by translating the text output back to state changes, method calls, and visible evidence.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Check-in-1/starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Check-in-1/solution"
				},
				{
					title: "Check-In #1: Variables and Strings",
					content:
						"Review primitive variable types such as `int`, `double`, and `boolean`, compare `System.out.print` with `System.out.println`, store and inspect strings, read user input, access characters with indexing, and measure string length."
				},
				{
					title: "Check-In #1: Conditionals",
					content:
						"Practice `if`, `else if`, and nested conditionals by checking guessed animals and colors. Use `&&`, `||`, and branching logic to distinguish exact matches, partial matches, and incorrect guesses."
				},
				{
					title: "Check-In #1: Loops",
					content:
						"Compare `for` loops and `while` loops, print number ranges in different directions and steps, and use nested loops to build a multiplication table while tracking how often the inner loop runs."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Ask the user for a row and column, then print a grid with `O` characters along that row and column and an `X` at the exact chosen coordinate.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS-Check-in-1-Additional-Project-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS-Check-in-1-Additional-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check In #1",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Check-in-1/starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Check-in-1/solution"
				},
				{
					title: "Check In #1 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check-In #1",
						itemTitle: "Check In #1 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check In #1 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check-In #1",
						itemTitle: "Check In #1 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-check-in-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1I Methods: Helpers, Parameters, and Reuse",
			curriculum: [
				{
					title: "Methods",
					content:
						"Learn how methods package reusable logic with parameters, return types, and method calls. Practice writing simple helpers such as `sum`, `subtract`, `double`, and `max`."
				},
				{
					title: "JS6 Project 1: Methods Practice",
					content:
						"Write methods that compute an average, test whether a number is even, find the smallest of three doubles, compute a factorial, and raise a base to a power.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Methods-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Methods-Practice"
				},
				{
					title: "Methods: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Methods",
						section: "planning"
					})
				},
				{
					title: "Methods: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Methods",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JS6 Supplemental Graphics Project: Picasso (Optional)",
					content:
						"Use methods plus random size, color, and position values in a BlueJ graphics project to generate abstract art from multiple shapes.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS6_Picasso.java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS6_Picasso.java"
				},
				{
					title: "JS6 Supplemental Project 1: Min and Max",
					content:
						"Write `min()` and `max()` methods for three integers without using `Math.min()` or `Math.max()`.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Min-and-Max",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Min-and-Max"
				},
				{
					title: "JS6 Supplemental Project 2: Caught Speeding",
					content:
						"Write a method that returns a ticket category based on driving speed and whether it is the driver's birthday.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Caught-Speeding",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Caught-Speeding"
				},
				{
					title: "JS6 Supplemental Project 3: String Expander",
					content:
						"Write a method that repeats each character in a string a specified number of times.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-String-Expander",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-String-Expander"
				},
				{
					title: "JS6 Supplemental Project 4: Palindrome Checker",
					content:
						"Write an `isPalindrome()` method that checks whether a string reads the same forward and backward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Palindrome-Checker",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Palindrome-Checker"
				}
			]
		},
		{
			title: "J1J Lists of State: Arrays and ArrayLists",
			curriculum: [
				{
					title: "Arrays",
					content:
						"Create arrays with fixed sizes, access and update elements by index, loop through arrays, and work with arrays of different types including strings and booleans."
				},
				{
					title: "JS7 Project 1: Practice with Arrays",
					content:
						"Build arrays of perfect squares, write methods that inspect or transform arrays, test for values such as 0, create arrays of random doubles, and optionally reverse arrays or swap the smallest and largest values.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays"
				},
				{
					title: "JS7 Project 2: Fortune Teller",
					content:
						"Store several fortunes in an array and print a random one each time the program runs.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Fortune-Teller",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Fortune-Teller"
				},
				{
					title: "ArrayLists",
					content:
						"Compare arrays with `ArrayList`s, then use `add()`, `get()`, `set()`, `remove()`, and `size()` to build dynamic lists that can grow and shrink."
				},
				{
					title: "JS7 Project 3: Practice with ArrayLists",
					content:
						"Write methods that generate lists of random integers, filter even numbers, remove the smallest value, add a sum, edit multiples of 3, collect user-entered words, and insert `MIDDLE` into the center of a list.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Array-List-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Array-List-Practice"
				},
				{
					title: "JS7 Project 4: High Score List",
					content:
						"Create a sorted high-score list that inserts each new score in the correct place from highest to lowest.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-High-Score-List",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-High-Score-List"
				}
			],
			supplementalProjects: [
				{
					title: "JS7 Supplemental Project 1: Lucky Array",
					content:
						"Ask the user for a lucky number, then check whether it appears in an array of random integers.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Lucky-Array",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Lucky-Array"
				},
				{
					title: "JS7 Supplemental Project 2: Arithmetic Sequence",
					content:
						"Write `generateArithSeq()` to return an array representing an arithmetic sequence from a starting value, term count, and common difference.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays"
				},
				{
					title: "JS7 Supplemental Project 3: String to Array",
					content:
						"Convert strings to arrays of characters, including a version that keeps every other character starting from the first.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-String-to-Array",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-String-to-Array"
				},
				{
					title: "JS7 Supplemental Project 4: Too Much Reversing",
					content:
						"Reverse every string in an array and also reverse the order of the strings in the array itself.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Too-Much-Reversing",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Too-Much-Reversing"
				},
				{
					title: "JS7 Supplemental Project 5: Airline Management",
					content:
						"Use a boolean array to represent airplane seats, then write methods that reserve seats and detect when the flight is full.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Airline-Management",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Airline-Management"
				},
				{
					title: "JS7 Supplemental Project 6: Song Shuffler",
					content:
						"Shuffle a list of songs by randomly moving entries from an original list into a new shuffled list.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Song-Shuffler-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Song-Shuffler"
				}
			]
		},
		{
			title: "J1K Grid Data: Two-Dimensional Arrays",
			curriculum: [
				{
					title: "Two-Dimensional Arrays",
					content:
						"Treat a 2D array as a grid or an array of arrays, and practice traversing it with nested loops while keeping track of row counts and column counts separately."
				},
				{
					title: "JS8 Project 1: Practice with 2D Arrays",
					content:
						"Write methods that sum all values in a grid, find the minimum value, generate an `N x N` multiplication table, and return row averages as doubles.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Practice-with-2D-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Practice-with-2D-Arrays"
				},
				{
					title: "JS8 Project 2: Grid Drawer",
					content:
						"Create a 10x10 grid that lets the user place `x` markers at chosen row and column positions until they enter `-1` to stop.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Grid-Drawer",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Grid-Drawer"
				},
				{
					title: "Two Dimensional Arrays: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Two Dimensional Arrays",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JS8 Supplemental Project 1: Square of Squares",
					content:
						"Ask the user for a size, fill a 2D array with perfect squares, and print the resulting square grid.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Square-of-Squares",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Square-of-Squares"
				},
				{
					title: "JS8 Supplemental Project 2: 2D Array to String",
					content:
						"Write `arrToString()` to return a string representation of a 2D array using nested loops.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-2D-Array-to-String",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-2D-Array-to-String"
				},
				{
					title: "JS8 Supplemental Project 3: Magic Square",
					content:
						"Write `isMagicSquare()` to check whether all rows, columns, and diagonals in a square grid have the same sum.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Magic-Square",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Magic-Square"
				}
			]
		},
		{
			title: "J1L Check-In: Methods and Data Structures",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"This review revisits math operators, randomness, methods, arrays, and two-dimensional arrays. Focus on explaining not just what the code does, but why each structure fits the problem."
				},
				{
					title: "Check-In #2: Mathematical Operators and Randomness",
					content:
						"Generate random integers and random letters, review ASCII, and practice using Java expressions to control ranges and convert between numbers and characters."
				},
				{
					title: "Check-In #2: Methods",
					content:
						"Define and call methods that take inputs and return results, including a sum method and a coin-flip simulation that uses random values and conditional logic."
				},
				{
					title: "Check-In #2: Arrays",
					content:
						"Create empty and pre-populated arrays, access specific elements, and use loops to fill arrays, print them, and update every element."
				},
				{
					title: "Check-In #2: Two-Dimensional Arrays",
					content:
						"Create and access a 2D array, inspect its row and column counts, set specific values, and use nested loops to print every element."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Fill an integer array with random values and write a method called `countNumElementsAboveFive()` that returns how many entries are greater than 5.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check In #2",
						section: "extension"
					})
				},
				{
					title: "Check In #2 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check-In #2",
						itemTitle: "Check In #2 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-07-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-07-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check In #2 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check-In #2",
						itemTitle: "Check In #2 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-08-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-08-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1M Master Project: Battleship Grid Game",
			curriculum: [
				{
					title: "JS9 Master Project: Simple Battleship",
					content:
						"Plan and build a playable Battleship game using the core ideas from the course, including loops, conditionals, methods, arrays, and two-dimensional arrays. Think carefully about how to store ships, guesses, and hits, and keep the player guessing until all ships are sunk.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship"
				},
				{
					title: "JS9 Master Project: Advanced Battleship",
					content:
						"Extend the project into a configurable multiplayer Battleship game with custom board sizes, multiple ship types, setup validation, alternating turns, and win detection.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Advanced-Battleship",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Advanced-Battleship"
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including primitive types, strings, input and output, operators, conditionals, loops, randomness, methods, arrays, ArrayLists, two-dimensional arrays, and building a larger game."
				},
				{
					title: "Master Project: Battleship: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Master Project: Battleship",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Battleship: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Master Project: Battleship",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship"
				},
				{
					title: "Master Project: Battleship Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS9 Master Project: Battleship",
						itemTitle:
							"Master Project: Battleship Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-09-js9-master-project-battleship-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-09-js9-master-project-battleship-supplemental-2/solution"
				},
				{
					title: "Master Project: Battleship Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS9 Master Project: Battleship",
						itemTitle:
							"Master Project: Battleship Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-10-js9-master-project-battleship-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-10-js9-master-project-battleship-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X02 Java Foundations Build 13: Practice Studio",
			curriculum: [
				{
					title: "J1X02 Java Foundations Build 13: Core Concepts",
					content: buildJavaFoundationGuidance(13, "concepts")
				},
				{
					title: "J1X02 Java Foundations Build 13: Guided Example",
					content: buildJavaFoundationGuidance(13, "example")
				},
				{
					title: "J1X02 Java Foundations Build 13: Core Project",
					content: buildJavaFoundationGuidance(13, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-java-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-java-foundations-build-13/solution"
				},
				{
					title: "J1X02 Java Foundations Build 13: Review and Reflection",
					content: buildJavaFoundationGuidance(13, "review")
				}
			],
			supplementalProjects: [
				{
					title: "J1X02 Java Foundations Build 13: Extension Challenge",
					content: buildJavaFoundationGuidance(13, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-java-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-java-foundations-build-13/solution"
				},
				{
					title: "J1X02 Java Foundations Build 13 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X02 Java Foundations Build 13: Practice Studio",
						itemTitle:
							"J1X02 Java Foundations Build 13 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-11-applied-studio-12-j1x02-java-foundations-build-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-11-applied-studio-12-j1x02-java-foundations-build-13-supplemental-2/solution"
				},
				{
					title: "J1X02 Java Foundations Build 13 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X02 Java Foundations Build 13: Practice Studio",
						itemTitle:
							"J1X02 Java Foundations Build 13 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-12-applied-studio-12-j1x02-java-foundations-build-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-12-applied-studio-12-j1x02-java-foundations-build-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X03 Java Foundations Build 14: Practice Studio",
			curriculum: [
				{
					title: "J1X03 Java Foundations Build 14: Core Concepts",
					content: buildJavaFoundationGuidance(14, "concepts")
				},
				{
					title: "J1X03 Java Foundations Build 14: Guided Example",
					content: buildJavaFoundationGuidance(14, "example")
				},
				{
					title: "J1X03 Java Foundations Build 14: Core Project",
					content: buildJavaFoundationGuidance(14, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-java-foundations-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-java-foundations-build-14/solution"
				},
				{
					title: "J1X03 Java Foundations Build 14: Review and Reflection",
					content: buildJavaFoundationGuidance(14, "review")
				}
			],
			supplementalProjects: [
				{
					title: "J1X03 Java Foundations Build 14: Extension Challenge",
					content: buildJavaFoundationGuidance(14, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-java-foundations-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-java-foundations-build-14/solution"
				},
				{
					title: "J1X03 Java Foundations Build 14 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X03 Java Foundations Build 14: Practice Studio",
						itemTitle:
							"J1X03 Java Foundations Build 14 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-13-applied-studio-13-j1x03-java-foundations-build-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-13-applied-studio-13-j1x03-java-foundations-build-14-supplemental-2/solution"
				},
				{
					title: "J1X03 Java Foundations Build 14 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X03 Java Foundations Build 14: Practice Studio",
						itemTitle:
							"J1X03 Java Foundations Build 14 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-14-applied-studio-13-j1x03-java-foundations-build-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-14-applied-studio-13-j1x03-java-foundations-build-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X04 Java Foundations Build 15: Practice Studio",
			curriculum: [
				{
					title: "J1X04 Java Foundations Build 15: Core Concepts",
					content: buildJavaFoundationGuidance(15, "concepts")
				},
				{
					title: "J1X04 Java Foundations Build 15: Guided Example",
					content: buildJavaFoundationGuidance(15, "example")
				},
				{
					title: "J1X04 Java Foundations Build 15: Core Project",
					content: buildJavaFoundationGuidance(15, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-java-foundations-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-java-foundations-build-15/solution"
				},
				{
					title: "J1X04 Java Foundations Build 15: Review and Reflection",
					content: buildJavaFoundationGuidance(15, "review")
				}
			],
			supplementalProjects: [
				{
					title: "J1X04 Java Foundations Build 15: Extension Challenge",
					content: buildJavaFoundationGuidance(15, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-java-foundations-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-java-foundations-build-15/solution"
				},
				{
					title: "J1X04 Java Foundations Build 15 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X04 Java Foundations Build 15: Practice Studio",
						itemTitle:
							"J1X04 Java Foundations Build 15 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-15-applied-studio-14-j1x04-java-foundations-build-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-15-applied-studio-14-j1x04-java-foundations-build-15-supplemental-2/solution"
				},
				{
					title: "J1X04 Java Foundations Build 15 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X04 Java Foundations Build 15: Practice Studio",
						itemTitle:
							"J1X04 Java Foundations Build 15 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-16-applied-studio-14-j1x04-java-foundations-build-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-16-applied-studio-14-j1x04-java-foundations-build-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X05 Java Foundations Build 16: Practice Studio",
			curriculum: [
				{
					title: "J1X05 Java Foundations Build 16: Core Concepts",
					content: buildJavaFoundationGuidance(16, "concepts")
				},
				{
					title: "J1X05 Java Foundations Build 16: Guided Example",
					content: buildJavaFoundationGuidance(16, "example")
				},
				{
					title: "J1X05 Java Foundations Build 16: Core Project",
					content: buildJavaFoundationGuidance(16, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-java-foundations-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-java-foundations-build-16/solution"
				},
				{
					title: "J1X05 Java Foundations Build 16: Review and Reflection",
					content: buildJavaFoundationGuidance(16, "review")
				}
			],
			supplementalProjects: [
				{
					title: "J1X05 Java Foundations Build 16: Extension Challenge",
					content: buildJavaFoundationGuidance(16, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-java-foundations-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-java-foundations-build-16/solution"
				},
				{
					title: "J1X05 Java Foundations Build 16 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X05 Java Foundations Build 16: Practice Studio",
						itemTitle:
							"J1X05 Java Foundations Build 16 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-17-applied-studio-15-j1x05-java-foundations-build-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-17-applied-studio-15-j1x05-java-foundations-build-16-supplemental-2/solution"
				},
				{
					title: "J1X05 Java Foundations Build 16 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X05 Java Foundations Build 16: Practice Studio",
						itemTitle:
							"J1X05 Java Foundations Build 16 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-18-applied-studio-15-j1x05-java-foundations-build-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-18-applied-studio-15-j1x05-java-foundations-build-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X06 Java Foundations Build 17: Practice Studio",
			curriculum: [
				{
					title: "J1X06 Java Foundations Build 17: Core Concepts",
					content: buildJavaFoundationGuidance(17, "concepts")
				},
				{
					title: "J1X06 Java Foundations Build 17: Guided Example",
					content: buildJavaFoundationGuidance(17, "example")
				},
				{
					title: "J1X06 Java Foundations Build 17: Core Project",
					content: buildJavaFoundationGuidance(17, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-java-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-java-foundations-build-17/solution"
				},
				{
					title: "J1X06 Java Foundations Build 17: Review and Reflection",
					content: buildJavaFoundationGuidance(17, "review")
				}
			],
			supplementalProjects: [
				{
					title: "J1X06 Java Foundations Build 17: Extension Challenge",
					content: buildJavaFoundationGuidance(17, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-java-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-java-foundations-build-17/solution"
				},
				{
					title: "J1X06 Java Foundations Build 17 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X06 Java Foundations Build 17: Practice Studio",
						itemTitle:
							"J1X06 Java Foundations Build 17 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-19-applied-studio-16-j1x06-java-foundations-build-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-19-applied-studio-16-j1x06-java-foundations-build-17-supplemental-2/solution"
				},
				{
					title: "J1X06 Java Foundations Build 17 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X06 Java Foundations Build 17: Practice Studio",
						itemTitle:
							"J1X06 Java Foundations Build 17 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-20-applied-studio-16-j1x06-java-foundations-build-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-20-applied-studio-16-j1x06-java-foundations-build-17-supplemental-3/solution"
				}
			]
		},
		{
			title: "Temperature Converter: Practice Studio",
			curriculum: [
				{
					title: "Temperature Converter: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Temperature Converter: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Temperature Converter: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Temperature Converter: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Temperature Converter: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Temperature Converter: Practice Studio",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter"
				},
				{
					title: "Temperature Converter: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Temperature Converter: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Temperature Converter: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Temperature Converter: Practice Studio",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter"
				},
				{
					title: "Temperature Converter Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Temperature Converter: Practice Studio",
						itemTitle: "Temperature Converter Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-21-applied-studio-17-temperature-converter-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-21-applied-studio-17-temperature-converter-supplemental-2/solution"
				},
				{
					title: "Temperature Converter Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Temperature Converter: Practice Studio",
						itemTitle: "Temperature Converter Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-22-applied-studio-17-temperature-converter-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-22-applied-studio-17-temperature-converter-supplemental-3/solution"
				}
			]
		},
		...javaLevel1GraphicsExtensionModules,
		{
			title: "Pending Demo Media",
			kind: "appendix",
			curriculum: [
				{
					title: "Pending Java Level 1 Demo Media",
					content: [
						"This course lists pending demonstration videos and screenshots below. Each entry keeps a stable static media URL so the matching file can be added without changing course links.",
						"",
						...JAVA_LEVEL_1_ORIGINAL_MEDIA.map(
							filename =>
								`- ${staticMediaUrl(filename)} - ${pendingStaticMediaNotice(filename)}`
						)
					].join("\n")
				}
			],
			supplementalProjects: []
		}
	]
};

const JAVA_LEVEL_1_PRIMARY_MODULE_COUNT = 13;
const JAVA_LEVEL_1_FOUNDATION_ARCHIVE_END = 19;

const JAVA_LEVEL_1_SECONDARY_PROJECTS = new Set([
	"JS1 Project 2: First Middle Last",
	"JS3 Project 2: Color Mixer",
	"JS4 Project 2: Nested Loops",
	"JS5 Project 2: Mathematical Challenges",
	"JS7 Project 2: Fortune Teller",
	"JS7 Project 4: High Score List",
	"JS8 Project 2: Grid Drawer",
	"JS9 Master Project: Advanced Battleship"
]);

const JAVA_LEVEL_1_MODULE_FLOW: Record<
	string,
	{
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"J1A Visual Java Launch: Karel Robot Worlds": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"compile-run-observe",
			"robot object state",
			"method call",
			"blocked move",
			"state trace"
		],
		flowNote:
			"Start with short Karel programs until object state, statement order, method calls, and compiler feedback are visible and explainable. Finish with a blocked-path repair and a written street, avenue, direction, and beeper trace before moving to console Java."
	},
	"J1B Visual Java Syntax: Types, Objects, and Methods": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"class and main",
			"primitive value",
			"object construction",
			"method signature",
			"parameter trace"
		],
		flowNote:
			"Use the robot world to connect the class and `main` skeleton to typed values, constructor arguments, object state, methods, and parameters. Predict each state change before running, then explain one compiler error from its file, line, and symbol evidence."
	},
	"J1C Text Bridge: Variables, Strings, and Input": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Java 21",
			"typed variable",
			"String method",
			"full-line input",
			"invalid-input recovery"
		],
		flowNote:
			"Pin the course to Java 21 and carry the visual compile-run-observe routine into console programs. Use full-line `Scanner` reads followed by explicit parsing so spaces, blank input, and invalid numbers are handled without stale-newline surprises; classroom prompts use fictional, non-sensitive responses."
	},
	"J1D Text Bridge: Casting, Operators, and Coordinate Reasoning": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"integer division",
			"explicit cast",
			"operator precedence",
			"coordinate range",
			"boundary case"
		],
		flowNote:
			"Predict expression type and value before running, especially around integer division and explicit casts. Verify negative, zero, and threshold cases, then connect the same arithmetic to graphics coordinates without confusing position with width or height."
	},
	"J1E Branching Logic: Console Choices and Visual Decisions": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"boolean condition",
			"branch table",
			"String equality",
			"normalized input",
			"fallback case"
		],
		flowNote:
			"Write a small decision table before each conditional, compare strings with `.equals()` or `.equalsIgnoreCase()`, and normalize text input deliberately. Test every branch plus one unknown or boundary input so the fallback behavior is visible rather than silent."
	},
	"J1F Repetition: Console Patterns and Grid Moves": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"loop invariant",
			"initial state",
			"update step",
			"termination",
			"nested-loop grid"
		],
		flowNote:
			"Trace the initial state, condition, body, and update for bounded `for` and `while` loops before relying on output. Test zero, one, and several iterations, then use row and column variables to explain nested-loop patterns without an unbounded execution path."
	},
	"J1G Loops, Conditionals, and Randomized Games": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Random instance",
			"seeded test",
			"range boundary",
			"guess loop",
			"attempt limit"
		],
		flowNote:
			"Use one `java.util.Random` instance, inject a fixed seed for tests, and choose a fresh seed only for ordinary play. Derive inclusive ranges explicitly and test their endpoints; every guessing loop has a clear exit condition or attempt limit."
	},
	"J1H Check-In: Visual-to-Text Foundations": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"state prediction",
			"compiler diagnosis",
			"input trace",
			"branch coverage",
			"loop boundary"
		],
		flowNote:
			"Use the check-in as evidence, not another content sprint: predict state and output, diagnose one compiler error, and complete one transfer task covering input, branching, and loop boundaries. Revisit only the specific weak block before continuing."
	},
	"J1I Methods: Helpers, Parameters, and Reuse": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"method contract",
			"parameter",
			"return value",
			"constructor",
			"private state"
		],
		flowNote:
			"Move from static helpers to one small class boundary: name each method's inputs, return value, side effects, and edge cases, then give a simple object private state, a constructor, and behavior. Test the class directly before arrays or the capstone depend on it."
	},
	"J1J Lists of State: Arrays and ArrayLists": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"fixed-size array",
			"ArrayList",
			"index boundary",
			"empty collection",
			"mutation contract"
		],
		flowNote:
			"Choose arrays for fixed-size indexed state and `ArrayList` for a collection that must grow or shrink. Test empty, one-element, first-index, and last-index cases, and state whether each method mutates its input or returns a new result."
	},
	"J1K Grid Data: Two-Dimensional Arrays": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"row count",
			"column count",
			"nested traversal",
			"rectangular precondition",
			"empty-grid case"
		],
		flowNote:
			"Sketch the row-column model before coding and keep row and column bounds separate. Test empty, one-cell, edge, corner, and non-square grids; if a method assumes a rectangular grid, validate or document that precondition instead of indexing blindly."
	},
	"J1L Check-In: Methods and Data Structures": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"method trace",
			"array boundary",
			"ArrayList mutation",
			"2D traversal",
			"targeted reteach"
		],
		flowNote:
			"Demonstrate method contracts and collection reasoning with one prediction, one implementation, and one boundary test for arrays, lists, and grids. Use the result to select targeted practice before Battleship rather than assigning every optional project."
	},
	"J1M Master Project: Battleship Grid Game": {
		estimatedTime: "6–8 sessions · 45–60 minutes each",
		keyBlocks: [
			"board model",
			"coordinate parser",
			"shot result",
			"seeded fixture",
			"win condition"
		],
		flowNote:
			"Keep one local, single-player Battleship game as the required capstone and build it in testable pieces: board state, coordinate parsing, shot resolution, rendering, and win detection. Use deterministic fixtures and complete the simple game before choosing the multiplayer extension."
	}
};

function javaLevel1SupplementalPath(title: string) {
	return /advanced|nested loops|mathematical challenges|high score|extension|challenge/i.test(
		title
	)
		? ("challenge" as const)
		: ("choice" as const);
}

function strengthenJavaLevel1Item(
	item: RawCourseModuleItem
): RawCourseModuleItem {
	if (item.title === "JS1 Project 1: Chat Bot") {
		return {
			...item,
			content:
				"Create a chatbot that asks at least five fictional, non-sensitive questions, stores the answers, and prints customized responses using string concatenation and robust full-line input handling. Do not request real names, contact details, passwords, health information, or other private data; test blank input and one response containing spaces."
		};
	}

	if (item.title === "Random Numbers and Letters") {
		return {
			...item,
			content:
				"Create and reuse one `java.util.Random` object. Pass a fixed seed such as `new Random(12345)` during tests so a run can be reproduced, then use `new Random()` only for ordinary play. Derive integer ranges with `nextInt(bound)` and verify the smallest and largest possible values before using numeric character ranges."
		};
	}

	if (item.title === "Arrays") {
		return {
			...item,
			content:
				"Create fixed-size arrays, access and update elements by index, and traverse them without reading outside `0` through `length - 1`. Test empty, one-element, first-index, and last-index arrays, and state whether each method mutates the original array or returns a separate result."
		};
	}

	if (item.title === "ArrayLists") {
		return {
			...item,
			content:
				"Compare arrays with `ArrayList`, then use `add()`, `get()`, `set()`, `remove()`, and `size()` with explicit empty-list and index-boundary handling. State whether a helper mutates the supplied list or returns a new list, especially when removing items during traversal."
		};
	}

	if (item.title === "Two-Dimensional Arrays") {
		return {
			...item,
			content:
				"Treat a 2D array as rows containing columns and traverse it with separate row and column bounds. Test empty, one-cell, non-square, edge, and corner cases; validate or document a rectangular-grid precondition before assuming every row has the same length."
		};
	}

	return item;
}

function insertBeforeProject(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateJavaLevel1Module(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = JAVA_LEVEL_1_MODULE_FLOW[module.title];
	const movedProjects = module.curriculum.filter(
		item =>
			JAVA_LEVEL_1_SECONDARY_PROJECTS.has(item.title) &&
			!isCoreProjectTitle(item.title)
	);
	let curriculum: RawCourseModuleItem[] = module.curriculum
		.filter(item => !movedProjects.includes(item))
		.map(strengthenJavaLevel1Item)
		.map((item, index) => ({
			...item,
			content:
				index === 0
					? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
					: item.content,
			learningPath: "core" as const
		}));

	if (module.title === "J1C Text Bridge: Variables, Strings, and Input") {
		curriculum = insertBeforeProject(
			curriculum,
			"JS1 Project 1: Chat Bot",
			{
				title: "Java 21 Toolchain and Input Readiness",
				content: [
					"**Completion evidence:**",
					"- The course uses the pinned Java 21 language level; record `java --version` and `javac --version` for the local or classroom environment.",
					"- Compile a small program with `javac -Xlint:all`, run it from a clean output location, and explain any warning instead of suppressing it without cause.",
					"- Read full lines with `Scanner.nextLine()` and parse numbers explicitly with `Integer.parseInt()` or `Double.parseDouble()` inside a bounded retry path.",
					"- Verify a normal value, a response containing spaces, blank input, invalid numeric input, and a corrected retry without a stale newline."
				].join("\n"),
				learningPath: "core"
			}
		);
	}

	if (module.title === "J1I Methods: Helpers, Parameters, and Reuse") {
		curriculum = insertBeforeProject(
			curriculum,
			"JS6 Project 1: Methods Practice",
			{
				title: "Small Class Boundary: State and Behavior",
				content: [
					"Create one small class such as `BoardCell`, `Player`, or `Counter` before the collection units.",
					"",
					"**Completion evidence:**",
					"- Private state with a constructor that establishes a valid starting condition.",
					"- At least one query method and one behavior method with named inputs, return value, side effects, and invalid-input policy.",
					"- Direct tests for normal construction, one state change, a boundary or rejected input, and independence between two instances.",
					"- No public mutable fields; callers use the class's methods rather than rewriting its rules."
				].join("\n"),
				learningPath: "core"
			}
		);
	}

	if (module.title === "J1M Master Project: Battleship Grid Game") {
		curriculum = insertBeforeProject(curriculum, "Course Recap", {
			title: "Simple Battleship Completion Contract",
			content: [
				"**Required scope:** A local, single-player game is the course capstone. Multiplayer, configurable fleets, and other advanced features remain optional until this contract passes.",
				"",
				"**Completion evidence:**",
				"- Board state is separate from display text, and coordinate parsing rejects malformed or out-of-range input without changing the board.",
				"- Seeded or fixed fixtures cover a valid miss, valid hit, duplicate shot, edge and corner coordinates, final winning shot, and a fresh-game reset.",
				"- The main loop has an explicit termination condition; invalid input follows a bounded recovery path.",
				"- One clean run demonstrates play from a fresh board through win detection, while direct checks prove the helper methods independently."
			].join("\n"),
			learningPath: "core"
		});
	}

	return {
		...module,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: [
			...module.supplementalProjects,
			...movedProjects
		].map(item => ({
			...item,
			learningPath: javaLevel1SupplementalPath(item.title)
		}))
	};
}

function buildJavaLevel1FoundationArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Java Foundations Practice Archive",
		estimatedTime: "Choose individual studios as needed",
		keyBlocks: [
			"even-value accumulator",
			"threshold branch",
			"inclusive range",
			"adjacent gap",
			"above-average count"
		],
		curriculum: [
			{
				title: "Java Foundations Practice Archive Guide",
				content:
					"**Course flow:** J1X02 Java Foundations Build 13: Practice Studio through J1X06 Java Foundations Build 17: Practice Studio, plus Temperature Converter: Practice Studio, are optional reinforcement after the matching core lesson or check-in. Select the smallest studio that addresses an observed gap; learners do not need to complete the entire archive.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: javaLevel1SupplementalPath(item.title)
				})
			)
		)
	};
}

function buildOptionalJavaGraphicsModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const extensionFocus = module.title
		.replace(/^Java Level 1 Graphics Extension:\s*/i, "")
		.trim();

	return {
		...module,
		kind: "appendix",
		estimatedTime:
			"Choose this visual extension after the matching core blocks",
		keyBlocks: [
			"coordinate sketch",
			"drawing primitive",
			"helper method",
			"controlled variation"
		],
		curriculum: [
			{
				title: `${extensionFocus} Guide`,
				content: `**Course flow:** This is an optional visual application of the main Java sequence, not a second required track. Choose one project after the relevant variables, branching, loops, or methods block; predict coordinates and state before rendering, then explain the result from the code.\n\n**Extension focus:** ${extensionFocus} provides the visual context for this optional practice.`,
				learningPath: "core"
			}
		],
		supplementalProjects: [
			...module.curriculum,
			...module.supplementalProjects
		].map(item => ({
			...item,
			learningPath: javaLevel1SupplementalPath(item.title)
		}))
	};
}

const javaLevel1PrimaryModules = javaLevel1SourceCourse.modules
	.slice(0, JAVA_LEVEL_1_PRIMARY_MODULE_COUNT)
	.map(decorateJavaLevel1Module);
const javaLevel1FoundationArchiveModules = javaLevel1SourceCourse.modules.slice(
	JAVA_LEVEL_1_PRIMARY_MODULE_COUNT,
	JAVA_LEVEL_1_FOUNDATION_ARCHIVE_END
);
const javaLevel1GraphicsModules = javaLevel1SourceCourse.modules
	.slice(JAVA_LEVEL_1_FOUNDATION_ARCHIVE_END, -1)
	.map(buildOptionalJavaGraphicsModule);
const javaLevel1PendingMediaModule = javaLevel1SourceCourse.modules.at(-1)!;

export const javaLevel1Course: RawCourse = {
	...javaLevel1SourceCourse,
	modules: [
		...javaLevel1PrimaryModules,
		buildJavaLevel1FoundationArchive(javaLevel1FoundationArchiveModules),
		...javaLevel1GraphicsModules,
		{
			...javaLevel1PendingMediaModule,
			kind: "appendix",
			estimatedTime: "Reference only",
			keyBlocks: ["stable media URL", "pending asset"],
			curriculum: javaLevel1PendingMediaModule.curriculum.map(item => ({
				...item,
				learningPath: "core"
			}))
		}
	]
};
