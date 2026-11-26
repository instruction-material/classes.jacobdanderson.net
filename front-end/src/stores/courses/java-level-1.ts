import type { ImplementationLabSection } from "./implementationLabGuidance";
import type { RawCourse, RawCourseModuleItem } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { javaLevel1GraphicsExtensionModules } from "./java-graphics-extensions";
import {
	javaMadLibsSource,
	javaPracticeSource,
	legacyJavaSource
} from "./javaLevel1PracticeSources";
import { isCoreProjectTitle } from "./projectGrouping";
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

const karelWorldsModuleId =
	"java-level-1-j1a-visual-java-launch-karel-robot-worlds";
const karelSyntaxModuleId =
	"java-level-1-j1b-visual-java-syntax-types-objects-and-methods";

const karelPracticeSource =
	"https://github.com/instruction-material/Java-Level-1/tree/0cd0f67993cd73f49889d095a7808aaca9ebd677/Karel-Worlds";

const consoleProjectSource =
	"https://github.com/instruction-material/Java-Level-1/tree/0d9ddad588fd37a68c68c5f035d40702450eb283";

const javaLevel1SourceCourse: RawCourse = {
	name: "Java Level 1",
	modules: [
		{
			title: "J1A Visual Java Launch: Karel Robot Worlds",
			aliases: ["J1A Visual Java Launch: Carol/Karel Robot Worlds"],
			curriculum: [
				{
					title: "Course Launch: Start Java Visually",
					contentKind: "reading",
					content:
						"The opening Java sequence starts in a visible robot world before switching to console-only programs. For the first week or roughly first three class meetings, Karel makes the object on a grid, one small command, and compiler feedback visible together. BlueJ in class fits the object-bench and Karel workflow, while CodeHS or the browser Code IDE outside class provides the fallback when device installs are unavailable.",
					projectLink: "/ide?mode=karel&template=demo"
				},
				{
					title: "First-Week Karel Cadence",
					content:
						"Repeat several short robot exercises before the text bridge: one movement trace, one blocked-move error, one beeper or wall task, one helper-method refactor, and one parameterized movement. This keeps Java visual long enough for syntax, main method structure, state, method calls, and errors to become concrete without turning the whole course into a robot course."
				},
				{
					title: "Compile, Run, Observe, Repair",
					content:
						"In BlueJ, compile Algo.java and read the first diagnostic if a semicolon, brace, or capital letter is wrong. The browser previews robot commands. A wall stops a move during the run. A legal move in the wrong direction runs too: compare the first unexpected trace entry with the command that produced it."
				},
				{
					title: "Robot State: Street, Avenue, Direction, Beepers",
					content:
						"In Algo.java, Sam starts at street 6, avenue 7 facing east with an empty beeper bag. Streets increase northward and avenues eastward. Read `sam.turnLeft();` as a quarter turn in place. After one left turn, `sam.move();` takes Sam to street 7, avenue 7 facing north. On a square with a beeper, `sam.pickBeeper();` moves one into the bag. With a beeper in the bag, `sam.putBeeper();` leaves one on the current square."
				},
				{
					title: "J1A Project 1: Robot Walkthrough",
					preserveInstructions: true,
					content:
						"Run Algo.java once. The sample ends at street 6, avenue 4 facing west. Your target is the beeper at street 6, avenue 9 in world.txt. Leave it on the ground.\n\n1. Keep the constructor in main. Replace the turns and loop after it with `sam.move();`. Run once and record the last state. Find `wall 6 7 east` in world.txt and explain why Sam stayed put.\n2. Keep that wall and the starting position. Use `sam.turnLeft();` and `sam.move();` to go around the wall to the beeper.\n3. Predict the street, avenue, direction, and bag count after each turn or move. Compare your predictions with the run. A successful route ends at (6, 9) with an empty bag and no blocked move.",
					projectLink:
						"/ide?mode=karel&template=demo&projectKey=java-level-1-robot-walkthrough&starterTitle=Robot+Walkthrough",
					solutionLink:
						"/ide?mode=karel&template=karel-robot-walkthrough-reference&projectKey=java-level-1-robot-walkthrough-solution&starterTitle=Robot+Walkthrough+Solution" +
						`&lesson=${karelWorldsModuleId}-${karelWorldsModuleId}-curriculum-j1a-project-1-robot-walkthrough`
				},
				{
					title: "Visual Exit Ticket: Ready for Text",
					content:
						"**Exit check:** Point to the line in `main` that constructs Sam. Explain how its four arguments set the starting state, then use one turn and one move from your trace to explain why only the move changed Sam’s square."
				}
			],
			supplementalProjects: [
				{
					title: "J1A Supplemental Project 1: Beeper Delivery",
					preserveInstructions: true,
					content:
						"The site editor opens Algo.java and world.txt. Sam starts at street 2, avenue 2 facing east with an empty bag and one beeper on his square. Deliver it to (2, 4). Keep the world and constructor unchanged.\n\nBefore editing, make a trace with columns for street, avenue, bag count and beepers on the current square. Use pickBeeper(), move() and putBeeper() to complete the delivery. After pickup, the starting square should be empty and the bag should hold one. At the end, verify that the bag is empty and exactly one beeper is at (2, 4). Predict what happens if the program tries to put a beeper down before picking it up.",
					projectLink: `${karelPracticeSource}/Beeper-Delivery/starter`,
					solutionLink: `${karelPracticeSource}/Beeper-Delivery/solution`
				},
				{
					title: "J1A Supplemental Project 2: Error Journal",
					content:
						"Collect three intentional errors from the robot project: one syntax error, one runtime/world error, and one logic error. For each, record the message or symptom, the cause, and the smallest code change that fixed it."
				},
				{
					title: "J1A Supplemental Project 3: Blocked Move Debugging",
					preserveInstructions: true,
					content:
						"Run the starter once. Sam faces east at (2, 2) and the destination is the adjacent square (2, 3). The line `wall 2 2 east` in world.txt blocks that edge. Record the message, position and direction after the attempted move.\n\nKeep the wall in place. Use turns and moves to cross street 3 and approach the destination from its north side. A right turn can be written as three left turns. Trace the first legal step and the final state. The repaired run should end at (2, 3) facing south with no blocked move.",
					projectLink: `${karelPracticeSource}/Blocked-Move-Debugging/starter`,
					solutionLink: `${karelPracticeSource}/Blocked-Move-Debugging/solution`
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
						"In Algo.java, `public class Algo` encloses the program. When `public static void main(String[] args)` runs, its statements run in order. A call such as `sam.turnLeft();` ends with a semicolon. Define a static helper inside the class, outside the braces of main. For example, `static void advanceOne(UrRobot robot) { robot.move(); }` defines a helper. Calling `advanceOne(sam);` in main moves Sam one square, then execution resumes after the call."
				},
				{
					title: "Primitives vs. Objects with Visual Inspection",
					content:
						"Use BlueJ object inspection or equivalent diagrams to contrast primitive values such as `int`, `double`, `char`, and `boolean` with object references such as `String` or a robot object. Include a concrete replacement trace such as `int x = 7; x = 9;` to show that primitives store direct values, while objects come from classes, carry methods, and preserve inspectable state."
				},
				{
					title: "Parameters and Arguments from Robot Construction",
					content:
						"The constructor takes street, avenue, direction, and bag count in order. In a helper declaration such as `static void advance(UrRobot robot, int steps)`, the parameter names belong to that call. In `advance(sam, 2);`, robot refers to Sam and steps holds 2. The loop header `for (int i = 0; i < steps; i++)` runs the body for i equal to 0 and 1. **Readiness check:** Predict how many times the body runs when steps is 0."
				},
				{
					title: "J1B Project 1: Parameterized Robot Moves",
					preserveInstructions: true,
					content:
						"Run the supplied Algo.java in this project. Record Sam’s final state after the two left turns and three westward moves. Refactor that route without changing world.txt or the starting state.\n\n1. Move the two turns into a static helper that accepts the robot. Call it from main with `sam`.\n2. Move the starter’s loop into a second static helper, `moveMany(UrRobot robot, int steps)`. Use the parameter as the loop bound and move the robot passed to the helper. In main, replace the original loop with `moveMany(sam, MOVE_COUNT);`.\n3. Compare the complete trace with the original run. Then change only the count argument to 1 and rerun, and repeat with 0. On street 6, the three runs should finish on avenues 4, 6, and 7 respectively, all facing west. Explain why a zero count still leaves Sam facing west.",
					projectLink:
						"/ide?mode=karel&template=demo&projectKey=java-level-1-parameterized-robot-moves&starterTitle=Parameterized+Robot+Moves",
					solutionLink:
						"/ide?mode=karel&template=karel-parameterized-robot-moves-reference&projectKey=java-level-1-parameterized-robot-moves-solution&starterTitle=Parameterized+Robot+Moves+Solution" +
						`&lesson=${karelSyntaxModuleId}-${karelSyntaxModuleId}-curriculum-j1b-project-1-parameterized-robot-moves`
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
					preserveInstructions: true,
					content:
						"Run each starting state separately. Keep the same two left turns and one move. Change only the four arguments in `new UrRobot(street, avenue, direction, beepers)`. For each run, record the starting square, facing direction, bag count and predicted final square before checking the trace.\n\n| Run | Street | Avenue | Direction | Beepers |\n| --- | ---: | ---: | --- | ---: |\n| A | 3 | 3 | East | 0 |\n| B | 3 | 3 | North | 2 |\n| C | 4 | 4 | West | 1 |\n\nFor A, the two turns leave Sam facing west, so the move ends at (3, 2). Explain which argument changes the direction of travel in B and why the bag count is unchanged during every run.",
					projectLink: `${karelPracticeSource}/Constructor-Swap/starter`,
					solutionLink: `${karelPracticeSource}/Constructor-Swap/solution`
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
			aliases: ["JS1 Variable Types & Input/Output"],
			curriculum: [
				{
					title: "Introductions and Java Setup",
					content:
						'A console program starts in `main`. Save the following as `Main.java`. From that folder, run `javac Main.java`, then `java Main`. The compiler produces Main.class. The second command runs it.\n\n```java\nclass Main {\n    public static void main(String[] args) {\n        int blocks = 3;\n        System.out.println("Blocks: " + blocks);\n    }\n}\n```\n\nThe output is `Blocks: 3`. Change 3 to 4 and compile again. The printed value plays the same role as a robot’s final grid position: it gives an observation to compare with a prediction.'
				},
				{
					title: "Optional Python-to-Java Bridge",
					content:
						'Compare integer division with positive operands in Python and Java. Python: `parts = 5 // 2`. Java: `int parts = 5 / 2;`. Both produce 2 here because the operands are positive integers. In Java, `5 / 2.0` produces 2.5 and needs a double for a result with a fractional part.\n\nPython’s input() and Java’s Scanner.nextLine() both read a line as text. Assigning "12" to an int in Java requires a conversion, such as `Integer.parseInt("12")`. The optional Python to Java and C++ Bridge course develops these translations further.'
				},
				{
					title: "Primitive Types",
					content:
						"A primitive variable stores a value of its declared type. Inside `main`, declare `int stops = 3;`, `double minutes = 2.5;`, `char platform = 'B';`, and `boolean open = true;`. An int counts whole stops, a double can include a fractional part, a char holds one UTF-16 code unit, and a boolean holds true or false.\n\nAfter `stops = stops + 1;`, `System.out.println(stops * minutes);` prints `10.0`. The assignment changed stops to 4. Multiplication with a double produces a double. Predict the result if minutes is changed to 1.5 before running again.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Primitives"
				},
				{
					title: "Strings",
					content:
						'A `String` contains text in double quotes. For `String ship = "Comet";`, `ship.length()` is 5 and indices run from 0 through 4. `ship.charAt(2)` gives the character \'m\'. `ship.substring(1, 4)` gives "ome": the first index is included and the second is excluded. Neither call changes ship.\n\nFor four letters, integer division chooses the index to the right of center: in "mars", length / 2 is 2 and the character is \'r\'. The empty string has length 0 and has no valid character index. Check the length before calling charAt.'
				},
				{
					title: "Input and Output",
					content:
						'Import `java.util.Scanner` above the class and put these lines inside `main`.\n\n```java\nScanner input = new Scanner(System.in);\nSystem.out.println("Destination?");\nif (input.hasNextLine()) {\n    String destination = input.nextLine();\n    System.out.println("Next stop: " + destination);\n}\n```\n\nEntering `Coral Moon` prints `Next stop: Coral Moon`. nextLine reads the entire line, including the internal space. Pressing Enter on an empty line supplies an empty string. End of input means there is no line to read. To require a nonblank answer, trim the line, check its length, and ask again when that length is zero.'
				},
				{
					title: "JS1 Project 1: Chat Bot",
					content:
						"Create a chatbot that asks at least five questions, stores the user's answers, and prints customized responses using string concatenation and input handling.",
					projectLink: `${consoleProjectSource}/JS1-Chat-Bot/starter`,
					solutionLink: `${consoleProjectSource}/JS1-Chat-Bot/solution`
				},
				{
					title: "JS1 Project 2: First Middle Last",
					content:
						"Read one word made of English letters. Remove surrounding spaces. For a blank line, print `A word is needed.` and finish before indexing. Otherwise print the characters at 0, length / 2, and length - 1, separated by hyphens.\n\nCheck `orbit` → `o-b-t`, `mars` → `m-r-s`, and `x` → `x-x-x`. Explain why the middle index for mars is 2. Optionally use substring to print the word with this middle character removed.",
					projectLink: `${consoleProjectSource}/JS1-First-Middle-Last/starter`,
					solutionLink: `${consoleProjectSource}/JS1-First-Middle-Last/solution`
				}
			],
			supplementalProjects: [
				{
					title: "JS1 Supplemental Project 1: Mad Libs",
					preserveInstructions: true,
					content:
						"Ask for parts of speech, store each response, and insert the answers in a story. Try a multiword noun such as paper kite, then change just that answer. Check that the rest of the story stays the same.\n\n**Checkpoints:** Choose a noun, verb and adjective before writing the story. Read each answer on its own line using Scanner.nextLine. Enter paper kite, floats and silver. A possible output is The silver paper kite floats above town. Use the variables to print the story after all three reads. Change paper kite to weather balloon and verify the new noun appears intact. Repeat with a second set of words and make sure the old answers disappear.",
					projectLink: `${javaMadLibsSource}/JS1-Mad-Libs/starter`,
					solutionLink: `${javaMadLibsSource}/JS1-Mad-Libs/solution`
				},
				{
					title: "JS1 Supplemental Project 2: Division Facts",
					preserveInstructions: true,
					content:
						"Read two integers in dividend, divisor order. Without %, print the quotient and remainder: 17 divided by 5 equals 3 with a remainder of 2. Reject a zero divisor.\n\n**Checkpoints:** Use integer division to find the quotient and subtract the product of quotient and divisor from the dividend to recover the remainder. Validate the divisor before dividing. For 20 and 5 expect quotient 4 and remainder 0. For 3 and 5 expect quotient 0 and remainder 3. For 17 and 0 print a clear division-by-zero message without attempting the calculation. Check each valid case by reconstructing the dividend from quotient, divisor and remainder.",
					projectLink: `${javaPracticeSource}/JS1-Division-Facts/starter`,
					solutionLink: `${javaPracticeSource}/JS1-Division-Facts/solution`
				},
				{
					title: "Variable Types & Input/Output Extension Practice",
					preserveInstructions: true,
					content:
						"Run the starter with flight number 17, object paper kite and destination night sky, one input per line. After nextInt, the cursor remains before the newline on the number line. The first nextLine therefore captures an empty object and the destination receives paper kite. Keep the numeric read and discard the rest of the number line before reading the two text lines.\n\n**Checkpoints:** The repaired story reads Flight 17 carries paper kite toward night sky. Try number 9 with letter and Mars. Check that neither read drops a word or shifts input into the wrong field.",
					projectLink: `${javaMadLibsSource}/JS1-Mad-Libs-Mixed-Input/starter`,
					solutionLink: `${javaMadLibsSource}/JS1-Mad-Libs-Mixed-Input/solution`
				}
			]
		},
		{
			title: "J1D Text Bridge: Casting, Operators, and Coordinate Reasoning",
			aliases: ["JS2 Casting and Operators"],
			curriculum: [
				{
					title: "Casting",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"Inside main, print 5 / 2, (double) 5 / 2, and (double) (5 / 2). Predict 2, 2.5 and 2.0. The last cast happens after integer division has already discarded the fraction.\n\nUse an explicit cast when a calculation requires a different numeric type. If both sides of division are int, Java computes an int and drops the fractional part toward zero. Casting the result cannot recover what was dropped. Casting either operand to double asks Java to perform decimal division. A separate example is casting 4.9 to int, which gives 4. Predict the same expressions for negative inputs. Check why -5 / 2 is -2 while casting the numerator first gives -2.5.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Casting-Reference"
				},
				{
					title: "Mathematical Operators",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"Compare 2 + 3 * 4 with (2 + 3) * 4: the results are 14 and 20. For nonnegative whole numbers, 17 / 5 gives 3 complete groups and 17 % 5 gives the 2 left over.\n\nJava evaluates multiplication, division and remainder before addition and subtraction. Operations at the same precedence ordinarily group from left to right. Parentheses can select a different order. Draw the calculation for 12 / 3 * 2 and for 12 / (3 * 2). The first evaluates to 8 and the second to 2. The remainder operator answers how much remains after integer division. Try 20 % 5 for an exact multiple and 3 % 5 when the dividend is smaller than the divisor.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Math-Operators-Reference"
				},
				{
					title: "JS2 Project 1: Temperature Converter",
					preserveInstructions: true,
					content:
						"Read Fahrenheit and then Celsius. Use (F - 32) * 5.0 / 9 and C * 9.0 / 5 + 32. Print each result as a decimal and rounded to the nearest degree. Try 31 F and -40 C: the rounded results are -1 C and -40 F.\n\n**Checkpoints:** Label the units in prompts and in output so a reader can verify the conversion direction. Keep the decimal result as a double and store Math.round in a separate variable. Try the freezing pair 32 F and 0 C. Expect 0 C and 32 F. Try 33 F for about 0.56 C rounded to 1. If the decimal result is zero, look for division of two integer literals before multiplication.",
					projectLink: `${javaPracticeSource}/JS2-Temperature-Converter/starter`,
					solutionLink: `${javaPracticeSource}/JS2-Temperature-Converter/solution`
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
					preserveInstructions: true,
					content:
						"Draw six nested arcs from outside to inside: red, orange, yellow, green, blue and magenta. Keep the arcs centered. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Use the supplied draw method and reuse one center for all six arcs. Sketch the bounding rectangles first, then calculate left as center minus half the width for each arc. Work from a wide arc toward narrower arcs so the inner colors remain visible. Check the left and right extremes of the picture for matching distances from the center. Export after changing one color and confirm the same band changes on both sides.",
					projectLink: `${javaPracticeSource}/JS2_Rainbow/starter`,
					solutionLink: `${javaPracticeSource}/JS2_Rainbow/solution`
				},
				{
					title: "JS2 Supplemental Project 2: Snowman",
					preserveInstructions: true,
					content:
						"Stack three white snowballs on a contrasting background. Add a hat, arms and a face. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Plan three oval bounding boxes with a shared horizontal center and decreasing sizes toward the top. Overlap adjacent edges enough to avoid a strip of background between them. Draw arms and hat after the snowballs and check that both stay visible. Move the face down a few pixels and confirm the eyes remain inside the head. Check the background color through pixels outside the snowman.",
					projectLink: `${javaPracticeSource}/JS2_Snowman/starter`,
					solutionLink: `${javaPracticeSource}/JS2_Snowman/solution`
				},
				{
					title: "Casting and Operators Extension Practice",
					preserveInstructions: true,
					content:
						"Track integer division before and after casting in the Fahrenheit conversion. For 33 F compare the truncated zero with 5.0/9. For 31 F compare the rounded result with -1.\n\n**Checkpoints:** Use the same Fahrenheit inputs for three expressions: (F - 32) * (5 / 9), (double) ((F - 32) * 5 / 9) and (F - 32) * 5.0 / 9. Write a prediction for each result before running the program. At 33 F the first two report zero and the third reports about 0.56. At 31 F the decimal conversion is about -0.56 and the rounded answer is -1. Circle the operation that first drops the fraction.",
					projectLink: `${javaPracticeSource}/JS2-Temperature-Converter/starter`,
					solutionLink: `${javaPracticeSource}/JS2-Temperature-Converter/solution`
				},
				{
					title: "Basic Shapes (Optional)",
					preserveInstructions: true,
					content:
						"Draw a filled rectangle, oval and arc. Predict each bounding box and check its position, size and color. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Use the starter’s draw method. Work on a 500 by 500 canvas and place the three shapes far enough apart to verify each against the background. Record the upper-left coordinate and width and height for all three, then choose visibly different colors. Use the center of each intended bounding box to check the oval or rectangle placement. Change only the arc start angle and compare the two PNGs to see which section moves.",
					projectLink: `${javaPracticeSource}/JS2_Basic_Shapes/starter`,
					solutionLink: `${javaPracticeSource}/JS2_Basic_Shapes/solution`
				},
				{
					title: "Happy Graphics (Optional)",
					preserveInstructions: true,
					content:
						"Draw two eyes and a smiling mouth, then draw two yellow Pac-Men facing one another. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Sketch the smile as an arc on a bounding box inside the face. Place the two eye shapes at the same height and the same distance from the centerline. Use different starting angles for the two Pac-Man arcs so the open wedges face one another. Verify that changing the first arc angle does not affect the second. If either shape looks like a full disk, inspect the arc extent.",
					projectLink: `${javaPracticeSource}/JS2_Happy_Graphics/starter`,
					solutionLink: `${javaPracticeSource}/JS2_Happy_Graphics/solution`
				}
			]
		},
		{
			title: "J1E Branching Logic: Console Choices and Visual Decisions",
			aliases: ["JS3 Conditionals"],
			curriculum: [
				{
					title: "Conditionals",
					preserveInstructions: true,
					content:
						'A branch checks a boolean before executing its body. Given String color = "blue", color.equals("blue") is true. Write an if/else chain that accepts red, yellow or blue and reports any other input. Test one valid and one unknown value; compare the text using equals.'
				},
				{
					title: "JS3 Project 1: Code Your Own Adventure",
					preserveInstructions: true,
					content:
						"Plan two opening choices and give at least one branch a second choice with different endings. Test each ending and an unknown command.\n\n**Checkpoints:** Use a table with a row for each valid sequence of commands. For example, cave followed by light can reach a safe exit, cave followed by dark can lead to a dead end, and river can have its own ending. Store the first input before checking whether a second is required. Try each legal path and an invalid first or second command. A valid command should lead to one ending and an invalid command should print a clear response.",
					projectLink: `${javaPracticeSource}/JS3-Code-Your-Own-Adventure/starter`,
					solutionLink: `${legacyJavaSource}/JS3-Code-Your-Own-Adventure`
				},
				{
					title: "JS3 Project 2: Color Mixer",
					preserveInstructions: true,
					content:
						"Accept red, yellow or blue for each color. Test red + yellow and yellow + red (orange), two blues (blue), and green as either input (error).\n\n**Checkpoints:** Write a table with two input columns and one result column before coding. Equal colors keep their color. Red and blue make purple, red and yellow make orange, and yellow and blue make green, in either order. Handle the invalid-color check before any mixture. Test both orders for blue and red and confirm both return purple. Try red with red, then try a valid color paired with green. The second case should report invalid input.",
					projectLink: `${javaPracticeSource}/JS3-Color-Mixer/starter`,
					solutionLink: `${legacyJavaSource}/JS3-Color-Mixer`
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
					preserveInstructions: true,
					content:
						"Use the shape string to select a circle, square or Pac-Man. Test all three and give unknown values a visible fallback. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.",
					projectLink: `${javaPracticeSource}/JS3_Which_Shape/starter`,
					solutionLink: `${javaPracticeSource}/JS3_Which_Shape/solution`
				},
				{
					title: "JS3 Supplemental Project 1: Elevator Limits",
					preserveInstructions: true,
					content:
						"Use the 1,500-pound limit. With 1,475 pounds report 25 under; with 1,525 report 25 over. Check exactly 1,500.\n\n**Checkpoints:** Compute the difference between the total and the limit just once. Use the sign of that difference to choose an overload, exact-capacity or space-remaining message. At exactly 1,500 the difference is zero, so avoid printing a warning. Try 1,499 and 1,501 to check the nearest cases on both sides.",
					projectLink: `${javaPracticeSource}/JS3-Elevator-Limits/starter`,
					solutionLink: `${legacyJavaSource}/JS3-Elevator-Limits`
				},
				{
					title: "JS3 Supplemental Project 2: Weather Activities",
					preserveInstructions: true,
					content:
						"Choose activities for several weather conditions. Test a known condition and one outside your choices, which should receive a fallback message.\n\n**Checkpoints:** Make a two-column table of supported weather words and activities. Use a known word such as snowy to choose an activity and an unsupported word such as windy to exercise the fallback. Clear the input between runs and check that exactly one message is printed. Add a new valid word and verify the other rows still work.",
					projectLink: `${javaPracticeSource}/JS3-Weather-Activities/starter`,
					solutionLink: `${legacyJavaSource}/JS3-Weather-Activities`
				},
				{
					title: "JS3 Supplemental Project 3: Too Chicken to Cross the Road",
					preserveInstructions: true,
					content:
						"Read two booleans, left clear and right clear. Try all four combinations. Only true/true is safe; name the blocked side or sides in the other cases.\n\n**Checkpoints:** Write the two input values and the expected blocked sides as a truth table. With false and true, report the left is blocked. With true and false, report the right. With false twice, report both. Decide how to order the conditions so the case with two blocked sides reaches its own message.",
					projectLink: `${javaPracticeSource}/JS3-Too-Chicken-to-Cross-the-Road/starter`,
					solutionLink: `${legacyJavaSource}/JS3-Too-Chicken-to-Cross-the-Road`
				},
				{
					title: "JS3 Supplemental Project 4: Spreadsheet Width",
					preserveInstructions: true,
					content:
						"Read a width then a word. Width 5 with conditionals should print |condi|. With hi it should print |hi   |, including three spaces.\n\n**Checkpoints:** Choose actions by comparing the string length to the requested width. When the word is longer, take the first width characters. When it is shorter, append exactly their difference in spaces. Use the boundary markers to see the spaces. With width 4 and java verify |java|, then compare widths 3 and 6.",
					projectLink: `${javaPracticeSource}/JS3-Spreadsheet-Width/starter`,
					solutionLink: `${legacyJavaSource}/JS3-Spreadsheet-Width`
				}
			]
		},
		{
			title: "J1F Repetition: Console Patterns and Grid Moves",
			aliases: ["JS4 Loops"],
			curriculum: [
				{
					title: "For Loops",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"In for (int i = 2; i <= 6; i += 2), initialization happens once. The test runs before each iteration and the update after it. Printing i in the body gives 2, 4, 6. Predict the last value if <= becomes <."
				},
				{
					title: "While Loops",
					preserveInstructions: true,
					content:
						"Start int n = 3. In while (n > 0) { System.out.println(n); n--; }, each pass reduces n by one. You see 3, 2, 1; starting at zero prints nothing. Point to the update that guarantees the loop stops."
				},
				{
					title: "JS4 Project 1: Loops Practice",
					preserveInstructions: true,
					content:
						"Using for and then while loops, print 1 through 10, evens 2 through 10, and 10 down to 1. Accumulate the sum from 1 through 100; both versions should give 5050.\n\n**Checkpoints:** Draw a trace table with the counter before the condition, the printed value, and the counter after the update. For the evens pass expect exactly five values and stop at 10. For the countdown expect ten values and stop before zero. Build both versions using the same bounds, then compare their printed lines and sum.",
					projectLink: `${javaPracticeSource}/JS4-Loop-Practice/starter`,
					solutionLink: `${legacyJavaSource}/JS4-Loop-Practice`
				},
				{
					title: "JS4 Project 2: Nested Loops",
					preserveInstructions: true,
					content:
						"Print a 12 by 12 multiplication table, a five-row increasing star triangle, its reverse, and a 5 by 5 field of dashes with a star on the main diagonal. Check the bottom right of the table is 144.\n\n**Checkpoints:** Trace row 2 and column 3 before generating the whole table. Their product is 6. In the increasing triangle, row 1 prints one star and row 5 prints five. The reverse swaps those counts. For the diagonal, print a star only when row equals column. Check the first and last lines of each pattern and count the rows.",
					projectLink: `${javaPracticeSource}/JS4-Nested-Loops/starter`,
					solutionLink: `${legacyJavaSource}/JS4-Nested-Loops`
				}
			],
			supplementalProjects: [
				{
					title: "JS4 Supplemental Graphics Project: Paintball (Optional)",
					preserveInstructions: true,
					content:
						"Draw an X from two diagonals of circles. Use one loop and two fillOval calls. Predict where the two paths meet. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.\n\n**Checkpoints:** Draw the first two pairs of circle positions on graph paper. One x coordinate increases as the other decreases, while the two y coordinates advance together. Mark the center where the diagonals cross. Run the export on JDK 21 and compare the image at the center and all four ends of the X.",
					projectLink: `${javaPracticeSource}/JS4_Paintball/starter`,
					solutionLink: `${javaPracticeSource}/JS4_Paintball/solution`
				},
				{
					title: "JS4 Supplemental Project 1: Letter Square",
					preserveInstructions: true,
					content:
						"For H and 3 print three rows of HHH. Produce the same square using nested for loops and nested while loops. Compare at size 1.\n\n**Checkpoints:** Start every new row with the inner counter reset to zero. Print characters with print and end each row with println. For size 3, count three lines with three characters each. For size 1, expect one line and one character. Run the same cases in both loop versions and compare their output character by character.",
					projectLink: `${javaPracticeSource}/JS4-Letter-Square/starter`,
					solutionLink: `${legacyJavaSource}/JS4-Letter-Square`
				},
				{
					title: "JS4 Supplemental Project 2: Checkout Calculator",
					preserveInstructions: true,
					content:
						"Read prices until the first zero. For 1.25, 2.50, 0 the total is 3.75. Starting with zero gives zero.\n\n**Checkpoints:** Keep a running total that starts at zero. Each read either ends the loop or adds one more price. Record the total after each input. Try 0.10, 0.20, 0 and format the final total with two decimal places. Then enter 1, 0, 9 and check that the 9 never enters the total.",
					projectLink: `${javaPracticeSource}/JS4-Checkout-Calculator/starter`,
					solutionLink: `${legacyJavaSource}/JS4-Checkout-Calculator`
				},
				{
					title: "JS4 Supplemental Project 3: Pyramid",
					preserveInstructions: true,
					content:
						"Make a centered five-row pyramid of slash pairs. Row 1 has four leading spaces, one forward slash and one backslash. Each row loses a space and adds one slash of each kind.\n\n**Checkpoints:** Use the outer loop for the five rows and separate inner loops for spaces, forward slashes and backslashes. Draw row 3 on paper before coding. It contains two leading spaces, three forward slashes and three backslashes. Escape each backslash in the Java string. Count the first and last row’s leading spaces to check alignment.",
					projectLink: `${javaPracticeSource}/JS4-Pyramid/starter`,
					solutionLink: `${legacyJavaSource}/JS4-Pyramid`
				}
			]
		},
		{
			title: "J1G Loops, Conditionals, and Randomized Games",
			aliases: ["JS5 Practice with Loops & Conditionals"],
			curriculum: [
				{
					title: "Random Numbers and Letters",
					content:
						"Use `Math.random()` to create random integers in different ranges, then use ASCII values and casting to generate random lowercase letters and simple random words."
				},
				{
					title: "JS5 Project 1: Letter Guesser",
					preserveInstructions: true,
					content:
						"Select a random lowercase letter from a through z, read guesses and count attempts until it matches. Use one fixed seed to replay the guesses. Ignore blank lines.\n\n**Checkpoints:** Draw the secret once before the loop. Keep one seeded Random instance and count only guesses accepted as input. Try a valid wrong guess, an empty line, the correct answer, and an extra valid guess afterward. The result reports two accepted attempts and ends before the extra guess. Repeat with the same seed and confirm the original secret returns.",
					projectLink: `${javaPracticeSource}/JS5-Letter-Guesser/starter`,
					solutionLink: `${javaPracticeSource}/JS5-Letter-Guesser/solution`
				},
				{
					title: "JS5 Project 2: Mathematical Challenges",
					preserveInstructions: true,
					content:
						"Print FizzBuzz for 1 through 50 (3: Fizz, 5: Buzz, 15: FizzBuzz). List every positive factor of a number up to 1000; for 12 expect 1, 2, 3, 4, 6, 12. Reverse a word such as loop to pool.\n\n**Checkpoints:** Put the divisible-by-both check before either single divisor check. Confirm 1 prints itself and 15 prints FizzBuzz exactly once. In the factor loop, test the smallest positive input 1 and a prime such as 13. For reversing, trace the source index moving backward while the answer grows. Try a word like level to verify it stays the same.",
					projectLink: `${javaPracticeSource}/JS5-Mathematical-Challenges/starter`,
					solutionLink: `${javaPracticeSource}/JS5-Mathematical-Challenges/solution`
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
					preserveInstructions: true,
					content:
						"Choose a secret integer between the entered minimum and maximum, inclusive. Give higher/lower feedback and count guesses. With minimum and maximum both 7, guesses 6, 8, 7 should take three tries.\n\n**Checkpoints:** Reject a minimum greater than the maximum before drawing the secret. Include both bounds when computing how many values can be selected. In the single-value range, 6 receives higher and 8 receives lower. Then 7 ends the round. Reverse the two bounds and check that the program gives a clear error without asking for guesses.",
					projectLink: `${javaPracticeSource}/JS5-Random-Number-Guesser/starter`,
					solutionLink: `${javaPracticeSource}/JS5-Random-Number-Guesser/solution`
				},
				{
					title: "Practice with Loops & Conditionals Transfer Practice",
					preserveInstructions: true,
					content:
						"Run a seeded round twice with the same guesses. Add a blank line to the second run. Count only nonblank guesses and explain why the target repeats.\n\n**Checkpoints:** Record the initial seed, three guesses, and the count after each read. Reuse the same seed and the same three guesses, adding a blank line before the last one. The selected letter and the final count agree. Look at the position of the increment if the extra blank line changes the count.",
					projectLink: `${javaPracticeSource}/JS5-Letter-Guesser/starter`,
					solutionLink: `${javaPracticeSource}/JS5-Letter-Guesser/solution`
				},
				{
					title: "Practice with Loops & Conditionals Extension Practice",
					preserveInstructions: true,
					content:
						"Test the guessing loop with the one-number range 4 through 4, then with a reversed range. The first accepts 4 and the second reports an invalid range.\n\n**Checkpoints:** Locate the first statement that uses the difference between minimum and maximum. Make sure the range is valid before that calculation or random selection. Add one test with the endpoint 4 itself as the successful guess and one input with minimum 5 and maximum 4. A rejected range never enters the guessing loop.",
					projectLink: `${javaPracticeSource}/JS5-Random-Number-Guesser/starter`,
					solutionLink: `${javaPracticeSource}/JS5-Random-Number-Guesser/solution`
				}
			]
		},
		{
			title: "J1H Check-In: Visual-to-Text Foundations",
			aliases: ["Check-In #1"],
			curriculum: [
				{
					title: "Check-In #1 Overview",
					preserveInstructions: true,
					content:
						"Try the check-in independently, then review the first unexpected output with your tutor. Read an animal and a color. Print the first animal letter and color length. Distinguish a black cat, one matching answer, and neither. Use loops to print 0 through 9 and 20 down to 10.",
					projectLink: `${javaPracticeSource}/Check-In-1/starter`,
					solutionLink: `${javaPracticeSource}/Check-In-1/solution`
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
					preserveInstructions: true,
					content:
						"Read a row and column from 1 through 10. Print ten rows of ten characters: X at the intersection, O in the selected row or column, and - elsewhere. Input 7 and 2 should make row 7 OXOOOOOOOO.",
					projectLink: `${javaPracticeSource}/Check-In-1-Grid/starter`,
					solutionLink: `${javaPracticeSource}/Check-In-1-Grid/solution`
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					preserveInstructions: true,
					content:
						"Trace the three animal-and-color branches for black cat, white cat and brown dog. Then change the correct animal and repeat all three tests.",
					projectLink: `${javaPracticeSource}/Check-In-1/starter`,
					solutionLink: `${javaPracticeSource}/Check-In-1/solution`
				},
				{
					title: "Check In #1 Transfer Practice",
					preserveInstructions: true,
					content:
						"Use (1,10) for the grid intersection. Check that the upper right is X and the remaining nine entries of row 1 are O.",
					projectLink: `${javaPracticeSource}/Check-In-1-Grid/starter`,
					solutionLink: `${javaPracticeSource}/Check-In-1-Grid/solution`
				},
				{
					title: "Check In #1 Extension Practice",
					preserveInstructions: true,
					content:
						"Format the same word at widths one shorter, equal to and one longer than its length. Mark the bars so the final padding space is visible.",
					projectLink: `${javaPracticeSource}/JS3-Spreadsheet-Width/starter`,
					solutionLink: `${legacyJavaSource}/JS3-Spreadsheet-Width`
				}
			]
		},
		{
			title: "J1I Methods: Helpers, Parameters, and Reuse",
			aliases: ["JS6 Methods"],
			curriculum: [
				{
					title: "Methods",
					preserveInstructions: true,
					content:
						"Define static int twice(int x) { return x + x; } inside Main but outside main. In main, print twice(4), then twice(-2): the calls return 8 and -4. The parameter belongs to the call. Change the argument and predict the return before printing it."
				},
				{
					title: "JS6 Project 1: Methods Practice",
					preserveInstructions: true,
					content:
						"Write methods for the precise average of two integers, evenness, the minimum of three doubles, factorial and integer exponentiation with nonnegative exponents. Check average(3,6) = 4.5, factorial(0) = 1 and exponent(5,3) = 125.",
					projectLink: `${javaPracticeSource}/JS6-Methods-Practice/starter`,
					solutionLink: `${javaPracticeSource}/JS6-Methods-Practice/solution`
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
					preserveInstructions: true,
					content:
						"Write three shape helpers with color, position and size parameters. Call each helper 500 times using random inputs. Export Main.java and run it with JDK 21 (javac Main.java, then java Main). Open drawing.png after each change.",
					projectLink: `${javaPracticeSource}/JS6_Picasso/starter`,
					solutionLink: `${javaPracticeSource}/JS6_Picasso/solution`
				},
				{
					title: "JS6 Supplemental Project 1: Min and Max",
					preserveInstructions: true,
					content:
						"Return the smallest and largest of three integers using comparisons. Try (4,-2,4) and three equal values. Work without Math.min or Math.max.",
					projectLink: `${javaPracticeSource}/JS6-Min-and-Max/starter`,
					solutionLink: `${legacyJavaSource}/JS6-Min-and-Max`
				},
				{
					title: "JS6 Supplemental Project 2: Caught Speeding",
					preserveInstructions: true,
					content:
						"Return “No ticket!” at 65 mph or below, “Small ticket!” from 66 through 79, and “Big ticket!” at 80 or above. A birthday lowers the ticket by one level. Test 65, 66, 79 and 80 with both birthday values.",
					projectLink: `${javaPracticeSource}/JS6-Caught-Speeding/starter`,
					solutionLink: `${javaPracticeSource}/JS6-Caught-Speeding/solution`
				},
				{
					title: "JS6 Supplemental Project 3: String Expander",
					preserveInstructions: true,
					content:
						"Expand each character in order. For “cat” and 2 return “ccaatt”. For a repeat count of 0 return the empty string.",
					projectLink: `${javaPracticeSource}/JS6-String-Expander/starter`,
					solutionLink: `${legacyJavaSource}/JS6-String-Expander`
				},
				{
					title: "JS6 Supplemental Project 4: Palindrome Checker",
					preserveInstructions: true,
					content:
						"Compare mirrored characters. racecar and a single character are palindromes; java is not. Check the empty string too.",
					projectLink: `${javaPracticeSource}/JS6-Palindrome-Checker/starter`,
					solutionLink: `${legacyJavaSource}/JS6-Palindrome-Checker`
				}
			]
		},
		{
			title: "J1J Lists of State: Arrays and ArrayLists",
			aliases: ["JS7 Arrays and ArrayLists"],
			curriculum: [
				{
					title: "Arrays",
					content:
						"Create arrays with fixed sizes, access and update elements by index, loop through arrays, and work with arrays of different types including strings and booleans."
				},
				{
					title: "JS7 Project 1: Practice with Arrays",
					preserveInstructions: true,
					content:
						"Generate ten perfect squares. Write methods for matching first/last, sum, total string lengths, presence of zero and N random doubles from 0 up to 10. Optionally return a reversed array and swap min/max. Trace [2,0,2] and an empty array.",
					projectLink: `${javaPracticeSource}/JS7-Practice-with-Arrays/starter`,
					solutionLink: `${javaPracticeSource}/JS7-Practice-with-Arrays/solution`
				},
				{
					title: "JS7 Project 2: Fortune Teller",
					preserveInstructions: true,
					content:
						"Store five fortunes in an array. Select an index from 0 through length - 1 and print its fortune. Change the array length and check every possible index remains valid.",
					projectLink: `${javaPracticeSource}/JS7-Fortune-Teller/starter`,
					solutionLink: `${javaPracticeSource}/JS7-Fortune-Teller/solution`
				},
				{
					title: "ArrayLists",
					content:
						"Compare arrays with `ArrayList`s, then use `add()`, `get()`, `set()`, `remove()`, and `size()` to build dynamic lists that can grow and shrink."
				},
				{
					title: "JS7 Project 3: Practice with ArrayLists",
					preserveInstructions: true,
					content:
						"Generate N integers from -50 through 50. Return a separate list of evens. Remove a smallest value, append the sum, and divide multiples of 3 by 3. Read N words and insert MIDDLE at index size()/2. Check [6,1,3] and an empty list.",
					projectLink: `${javaPracticeSource}/JS7-Array-List-Practice/starter`,
					solutionLink: `${javaPracticeSource}/JS7-Array-List-Practice/solution`
				},
				{
					title: "JS7 Project 4: High Score List",
					preserveInstructions: true,
					content:
						"Start with scores 500, 450, 375. Insert 400 then 550 in descending order. Add another 450 and a new lowest score. Print the list after each input.",
					projectLink: `${javaPracticeSource}/JS7-High-Score-List/starter`,
					solutionLink: `${javaPracticeSource}/JS7-High-Score-List/solution`
				}
			],
			supplementalProjects: [
				{
					title: "JS7 Supplemental Project 1: Lucky Array",
					preserveInstructions: true,
					content:
						"Generate ten numbers and check whether a chosen lucky number occurs. Use [4,8,4] to test 4 (present) and 7 (absent).",
					projectLink: `${javaPracticeSource}/JS7-Lucky-Array/starter`,
					solutionLink: `${legacyJavaSource}/JS7-Lucky-Array`
				},
				{
					title: "JS7 Supplemental Project 2: Arithmetic Sequence",
					preserveInstructions: true,
					content:
						"Implement generateArithSeq(first, count, difference). For (5,4,2) return [5,7,9,11]. Test a negative difference and zero terms.",
					projectLink: `${javaPracticeSource}/JS7-Arithmetic-Sequence/starter`,
					solutionLink: `${javaPracticeSource}/JS7-Arithmetic-Sequence/solution`
				},
				{
					title: "JS7 Supplemental Project 3: String to Array",
					preserveInstructions: true,
					content:
						"Return each character of Java, then write a second method that keeps indices 0,2,4 and so on. For array the second result is [a,r,y].",
					projectLink: `${javaPracticeSource}/JS7-String-to-Array/starter`,
					solutionLink: `${legacyJavaSource}/JS7-String-to-Array`
				},
				{
					title: "JS7 Supplemental Project 4: Too Much Reversing",
					preserveInstructions: true,
					content:
						"Reverse each word and the order of the words. For [sun,moon] return [noom,nus]. Check the empty array. Read the output array without changing the input.",
					projectLink: `${javaPracticeSource}/JS7-Too-Much-Reversing/starter`,
					solutionLink: `${legacyJavaSource}/JS7-Too-Much-Reversing`
				},
				{
					title: "JS7 Supplemental Project 5: Airline Management",
					preserveInstructions: true,
					content:
						"Store five reservations as booleans. Seats are numbered 1 through 5. Use reserveSeat and isFull. Reserve seat 1 twice, then fill seats 2 through 5; the duplicate must leave the count unchanged.",
					projectLink: `${javaPracticeSource}/JS7-Airline-Management/starter`,
					solutionLink: `${javaPracticeSource}/JS7-Airline-Management/solution`
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
			aliases: ["JS8 Two-Dimensional Arrays"],
			curriculum: [
				{
					title: "Two-Dimensional Arrays",
					content:
						"Treat a 2D array as a grid or an array of arrays, and practice traversing it with nested loops while keeping track of row counts and column counts separately."
				},
				{
					title: "JS8 Project 1: Practice with 2D Arrays",
					preserveInstructions: true,
					content:
						"Write sum, minimum, an N by N multiplication table, and double row averages. For [[1,2,3],[4,5,6]] expect 21, 1 and [2.0,5.0]. Check a one-cell table.",
					projectLink: `${javaPracticeSource}/JS8-Practice-with-2D-Arrays/starter`,
					solutionLink: `${javaPracticeSource}/JS8-Practice-with-2D-Arrays/solution`
				},
				{
					title: "JS8 Project 2: Grid Drawer",
					preserveInstructions: true,
					content:
						"Start with a 10 by 10 blank grid, mark a valid row and column, and display it after each edit. Mark (0,9) and (9,0). Typing -1 at either prompt stops immediately.",
					projectLink: `${javaPracticeSource}/JS8-Grid-Drawer/starter`,
					solutionLink: `${javaPracticeSource}/JS8-Grid-Drawer/solution`
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
					preserveInstructions: true,
					content:
						"Fill a square grid row by row with successive positive perfect squares. Size 2 should show 1 4 on the first row and 9 16 on the second.",
					projectLink: `${javaPracticeSource}/JS8-Square-of-Squares/starter`,
					solutionLink: `${legacyJavaSource}/JS8-Square-of-Squares`
				},
				{
					title: "JS8 Supplemental Project 2: 2D Array to String",
					preserveInstructions: true,
					content:
						"Use nested loops to produce [[0, 1], [2, 3], [4, 5]], including the commas and spaces. Try an empty grid and a single row.",
					projectLink: `${javaPracticeSource}/JS8-2D-Array-to-String/starter`,
					solutionLink: `${javaPracticeSource}/JS8-2D-Array-to-String/solution`
				},
				{
					title: "JS8 Supplemental Project 3: Magic Square",
					preserveInstructions: true,
					content:
						"Compare every row, column and both diagonals with the first row sum. [[2,7,6],[9,5,1],[4,3,8]] passes. Swap two unequal entries and check again. An empty or non-square grid fails.",
					projectLink: `${javaPracticeSource}/JS8-Magic-Square/starter`,
					solutionLink: `${javaPracticeSource}/JS8-Magic-Square/solution`
				}
			]
		},
		{
			title: "J1L Check-In: Methods and Data Structures",
			aliases: ["Check-In #2"],
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
					preserveInstructions: true,
					content:
						"Fill ten integers with random values from 0 through 10 inclusive. Return the count strictly above 5. Before trying random data, test [0,5,6,10] (2) and [] (0).",
					projectLink: `${javaPracticeSource}/Check-In-2-Count/starter`,
					solutionLink: `${javaPracticeSource}/Check-In-2-Count/solution`
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					preserveInstructions: true,
					content:
						"Predict a random integer range and character conversion. Write a sum method, simulate coin flips, traverse an array and print a two-dimensional grid. Explain each bound before running the example.",
					projectLink: `${javaPracticeSource}/Check-In-2/starter`,
					solutionLink: `${javaPracticeSource}/Check-In-2/solution`
				},
				{
					title: "Check In #2 Transfer Practice",
					preserveInstructions: true,
					content:
						"Create three fixed arrays with no values above 5, one above 5 and every value above 5. Record the expected counts before running your method.",
					projectLink: `${javaPracticeSource}/Check-In-2-Count/starter`,
					solutionLink: `${javaPracticeSource}/Check-In-2-Count/solution`
				},
				{
					title: "Check In #2 Extension Practice",
					preserveInstructions: true,
					content:
						"For rows [2,3] and [4,8], predict the sum (17), minimum (2), and row averages (2.5 and 6.0). Change one cell and predict which averages change.",
					projectLink: `${javaPracticeSource}/JS8-Practice-with-2D-Arrays/starter`,
					solutionLink: `${javaPracticeSource}/JS8-Practice-with-2D-Arrays/solution`
				}
			]
		},
		{
			title: "J1M Master Project: Battleship Grid Game",
			aliases: ["JS9 Master Project: Battleship"],
			curriculum: [
				{
					title: "JS9 Master Project: Simple Battleship",
					preserveInstructions: true,
					content:
						"Plan the board, hidden ships and shot history in pseudocode. Build a 10 by 10 single-player game with one two-cell and one three-cell ship. Read row and column from 0 to 9. Record hits and misses, reject repeat shots, and end when all five different ship cells are hit. Test a corner, a duplicate miss, bad input and a fresh board. Use one coordinate per line. Explain one decision in your finished game and share your run with your tutor.",
					projectLink: `${javaPracticeSource}/JS9-Simple-Battleship/starter`,
					solutionLink: `${javaPracticeSource}/JS9-Simple-Battleship/solution`
				},
				{
					title: "JS9 Master Project: Advanced Battleship",
					learningPath: "challenge",
					preserveInstructions: true,
					content:
						"Optional after Simple Battleship. Choose the board size and counts of 2-, 3- and 4-cell ships. Each player places a fleet and then takes turns firing at the other board. Test overlapping or out-of-bounds placement, repeated shots, a miss and the winning hit.",
					projectLink: `${javaPracticeSource}/JS9-Advanced-Battleship/starter`,
					solutionLink: `${javaPracticeSource}/JS9-Advanced-Battleship/solution`
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
					preserveInstructions: true,
					content:
						"After completing your game, replay three malformed coordinates. Keep the board unchanged and end after the third consecutive invalid shot. Try a valid shot between two errors and explain when the retry count resets.",
					projectLink: `${javaPracticeSource}/JS9-Simple-Battleship/starter`,
					solutionLink: `${javaPracticeSource}/JS9-Simple-Battleship/solution`
				},
				{
					title: "Master Project: Battleship Transfer Practice",
					preserveInstructions: true,
					content:
						"Write a transcript for a duplicate miss followed by a duplicate hit. In each pair only the first shot changes the displayed board.",
					projectLink: `${javaPracticeSource}/JS9-Simple-Battleship/starter`,
					solutionLink: `${javaPracticeSource}/JS9-Simple-Battleship/solution`
				},
				{
					title: "Master Project: Battleship Extension Practice",
					preserveInstructions: true,
					content:
						"Run a complete fixed fleet twice. Before the second run predict the initial board and verify that no previous shot is marked.",
					projectLink: `${javaPracticeSource}/JS9-Simple-Battleship/starter`,
					solutionLink: `${javaPracticeSource}/JS9-Simple-Battleship/solution`
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
					preserveInstructions: true,
					content:
						"Use [0,-2,5,8]. Sum only the evens: the total is 6. Check an empty input.",
					projectLink: `${legacyJavaSource}/J1-02-java-foundations-build-13/starter`,
					solutionLink: `${legacyJavaSource}/J1-02-java-foundations-build-13/solution`
				},
				{
					title: "J1X02 Java Foundations Build 13 Extension Practice",
					preserveInstructions: true,
					content:
						"Add an odd number to [2,8] and then an even number. Explain why only the second addition changes the score.",
					projectLink: `${legacyJavaSource}/J1-02-java-foundations-build-13/starter`,
					solutionLink: `${legacyJavaSource}/J1-02-java-foundations-build-13/solution`
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
					preserveInstructions: true,
					content:
						"Compare [9,10,11] with [9,9,11]. Doubling only values at least 10 produces 51 and 40.",
					projectLink: `${legacyJavaSource}/J1-03-java-foundations-build-14/starter`,
					solutionLink: `${legacyJavaSource}/J1-03-java-foundations-build-14/solution`
				},
				{
					title: "J1X03 Java Foundations Build 14 Extension Practice",
					preserveInstructions: true,
					content:
						"Compare [10,10] with [9,11]. Both sum to 20 before weighting. Verify the weighted scores 40 and 31.",
					projectLink: `${legacyJavaSource}/J1-03-java-foundations-build-14/starter`,
					solutionLink: `${legacyJavaSource}/J1-03-java-foundations-build-14/solution`
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
					preserveInstructions: true,
					content:
						"Count entries in the inclusive range 5 through 10 in [4,5,10,11]. Both endpoints count, giving 2.",
					projectLink: `${legacyJavaSource}/J1-04-java-foundations-build-15/starter`,
					solutionLink: `${legacyJavaSource}/J1-04-java-foundations-build-15/solution`
				},
				{
					title: "J1X04 Java Foundations Build 15 Extension Practice",
					preserveInstructions: true,
					content:
						"Set both range endpoints to 5. For [4,5,5,6] the count is 2; for [4,6] it is 0.",
					projectLink: `${legacyJavaSource}/J1-04-java-foundations-build-15/starter`,
					solutionLink: `${legacyJavaSource}/J1-04-java-foundations-build-15/solution`
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
					preserveInstructions: true,
					content:
						"Trace [9,3,8,7]. Its largest positive adjacent increase is 5. A one-element list returns 0.",
					projectLink: `${legacyJavaSource}/J1-05-java-foundations-build-16/starter`,
					solutionLink: `${legacyJavaSource}/J1-05-java-foundations-build-16/solution`
				},
				{
					title: "J1X05 Java Foundations Build 16 Extension Practice",
					preserveInstructions: true,
					content:
						"Compare [5,1,4] with [1,4,5]. For each list write the two adjacent differences; both largest increases are 3.",
					projectLink: `${legacyJavaSource}/J1-05-java-foundations-build-16/starter`,
					solutionLink: `${legacyJavaSource}/J1-05-java-foundations-build-16/solution`
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
					preserveInstructions: true,
					content:
						"For [2,3,3] the mean is 8/3 and two values exceed it. Check that equal values produce count 0.",
					projectLink: `${legacyJavaSource}/J1-06-java-foundations-build-17/starter`,
					solutionLink: `${legacyJavaSource}/J1-06-java-foundations-build-17/solution`
				},
				{
					title: "J1X06 Java Foundations Build 17 Extension Practice",
					preserveInstructions: true,
					content:
						"Compare [-3,0,3] and [-3,0,6]. The means are 0 and 1. Check that only one value exceeds the mean in each case.",
					projectLink: `${legacyJavaSource}/J1-06-java-foundations-build-17/starter`,
					solutionLink: `${legacyJavaSource}/J1-06-java-foundations-build-17/solution`
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
					preserveInstructions: true,
					content:
						"Read Fahrenheit and then Celsius. Use (F - 32) * 5.0 / 9 and C * 9.0 / 5 + 32. Print each result as a decimal and rounded to the nearest degree. Try 31 F and -40 C: the rounded results are -1 C and -40 F.",
					projectLink: `${javaPracticeSource}/JS2-Temperature-Converter/starter`,
					solutionLink: `${javaPracticeSource}/JS2-Temperature-Converter/solution`
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
					preserveInstructions: true,
					content:
						"Compare -40, 0 and 100 Celsius with the reverse conversion. Predict -40, 32 and 212 Fahrenheit. Explain where a cast before dividing preserves a fraction.",
					projectLink: `${javaPracticeSource}/JS2-Temperature-Converter/starter`,
					solutionLink: `${javaPracticeSource}/JS2-Temperature-Converter/solution`
				},
				{
					title: "Temperature Converter Transfer Practice",
					preserveInstructions: true,
					content:
						"Compare the two scales at -40 degrees. Both conversions should give -40. Then test 0 C and 32 F.",
					projectLink: `${javaPracticeSource}/JS2-Temperature-Converter/starter`,
					solutionLink: `${javaPracticeSource}/JS2-Temperature-Converter/solution`
				},
				{
					title: "Temperature Converter Extension Practice",
					preserveInstructions: true,
					content:
						"Use 30 F and 34 F to check rounding on either side of freezing. Their nearest whole Celsius temperatures are -1 and 1.",
					projectLink: `${javaPracticeSource}/JS2-Temperature-Converter/starter`,
					solutionLink: `${javaPracticeSource}/JS2-Temperature-Converter/solution`
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
				"Build a fictional flight log. The starter reads a ship name and prints a greeting. Add questions about a planet, robot pilot, cargo and arrival signal. Store all five answers and print a final message that uses each one. Use the supplied readAnswer helper for full-line input, a blank-input retry and a clean exit at end of input. Use fictional, non-sensitive details for all five prompts.\n\nTest with Solar Kite, Coral Moon, Bolt, wind chimes and two taps. The log should identify who pilots which ship, its destination, what it carries, and its signal. Try a blank line before the pilot and a response containing spaces."
		};
	}

	if (item.title === "Random Numbers and Letters") {
		return {
			...item,
			preserveInstructions: true,
			content:
				"Create and reuse one `java.util.Random` object. Pass a fixed seed such as `new Random(12345)` during tests so a run can be reproduced, then use `new Random()` only for ordinary play. Derive integer ranges with `nextInt(bound)` and verify the smallest and largest possible values before using numeric character ranges.\n\nFor a lowercase letter, use (char) ('a' + random.nextInt(26)). The offsets 0 and 25 produce a and z. Construct two Random objects with the same seed and compare three successive draws from each."
		};
	}

	if (item.title === "Arrays") {
		return {
			...item,
			preserveInstructions: true,
			content:
				"Create fixed-size arrays, access and update elements by index, and traverse them without reading outside `0` through `length - 1`. Test empty, one-element, first-index, and last-index arrays, and state whether each method mutates the original array or returns a separate result.\n\nFor int[] scores = {4, 7, 9}, setting scores[1] = 5 produces [4,5,9]. The length stays 3. Sum the elements with an enhanced for loop; the result is 18. Try an empty array: the loop runs zero times."
		};
	}

	if (item.title === "ArrayLists") {
		return {
			...item,
			preserveInstructions: true,
			content:
				'Compare arrays with `ArrayList`, then use `add()`, `get()`, `set()`, `remove()`, and `size()` with explicit empty-list and index-boundary handling. State whether a helper mutates the supplied list or returns a new list, especially when removing items during traversal.\n\nStarting with an empty `ArrayList<String>`, add "red" and "blue". set(1,"green") replaces blue without growing the list. remove(0) leaves [green], now at index 0. Check size() before reading index 1.'
		};
	}

	if (item.title === "Two-Dimensional Arrays") {
		return {
			...item,
			preserveInstructions: true,
			content:
				"Treat a 2D array as rows containing columns and traverse it with separate row and column bounds. Test empty, one-cell, non-square, edge, and corner cases; validate or document a rectangular-grid precondition before assuming every row has the same length.\n\nFor int[][] grid = {{1,2,3},{4,5,6}}, grid.length is 2 and grid[0].length is 3. grid[1][2] is 6. Traverse using grid[r].length inside the row loop; this also visits all cells when the second row is shorter."
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
			learningPath: item.learningPath ?? ("core" as const)
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
					"- Verify a normal value, a response containing spaces, blank input, invalid numeric input, and a corrected retry without a stale newline.",
					"",
					'Place this example in main after creating a Scanner named input. With the input lines “three” and “3”, the first attempt prints a correction and the second prints `Tickets: 3`. Two invalid lines use up both attempts. An empty input stream ends immediately.\n\n```java\nfor (int attempt = 0; attempt < 2 && input.hasNextLine(); attempt++) {\n    String line = input.nextLine();\n    try {\n        int tickets = Integer.parseInt(line.trim());\n        System.out.println("Tickets: " + tickets);\n        break;\n    } catch (NumberFormatException error) {\n        System.out.println("Enter a whole number.");\n    }\n}\n```'
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
