import type { RawCourse } from "./types";
import { buildProjectGuidance } from "./projectGuidance";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

const JAVASCRIPT_LEVEL_1_ORIGINAL_MEDIA = [
	"js1_project_1.mp4",
	"js1_project_2.mp4",
	"js1_supplemental_project_1.mp4",
	"js1_supplemental_project_2.mp4",
	"js1_supplemental_project_3.mp4",
	"js2_project_1.mp4",
	"js2_project_2.mp4",
	"js2_project_3.mp4",
	"js2_supplemental_project_1.mp4",
	"js2_supplemental_project_2.mp4",
	"js2_supplemental_project_3.mp4",
	"js3_project_1.mp4",
	"js3_project_2.mp4",
	"js3_project_3.mp4",
	"js3_supplemental_project_1.mp4",
	"js3_supplemental_project_2.mp4",
	"js3_supplemental_project_3.mp4",
	"js4_project_1.mp4",
	"js4_project_2.mp4",
	"js4_project_3.mp4",
	"js4_supplemental_project_1.mp4",
	"js5_project_1.mp4",
	"js5_project_2.mp4",
	"js5_project_3.mp4",
	"js5_supplemental_project_1.mp4",
	"js5_supplemental_project_2.mp4",
	"js5_supplemental_project_3.mp4",
	"js6_project_1.mp4",
	"js6_project_2.mp4",
	"js6_project_3.mp4",
	"js6_supplemental_project_1.mp4",
	"js6_supplemental_project_2.mp4",
	"js7_project_1.mp4",
	"js7_project_2.mp4",
	"js7_project_3.mp4",
	"js7_supplemental_project_1.mp4",
	"js7_supplemental_project_2.mp4",
	"js7_supplemental_project_3.mp4",
	"jss8_project_1.mp4",
	"jss8_project_2.mp4",
	"jss8_project_3.mp4",
	"jss8_supplemental_project_1.mp4",
	"jss8_supplemental_project_2.mp4",
	"jss8_supplemental_project_3.mp4",
	"jss9_project_1.mp4",
	"jss9_project_2.mp4",
	"jss10_project_1.mp4",
	"jss10_project_2.mp4",
	"jss10_project_3.mp4",
	"jss10_supplemental_project_1.mp4",
	"jss10_supplemental_project_2.mp4",
	"jss11_project_1.mp4",
	"jss11_project_2.mp4",
	"jss11_project_3.mp4",
	"jss11_supplemental_project_1.mp4",
	"jss12_project_1.mp4",
	"jss12_project_2.mp4",
	"jss12_project_3.mp4",
	"jss12_project_4.mp4",
	"jss12_supplemental_project_1.mp4",
	"jss13_project_1.mp4",
	"jss13_project_2.mp4",
	"jss13_project_3.mp4",
	"jss13_project_4.mp4",
	"jss13_supplemental_project_1.mp4",
	"jss13_supplemental_project_2.mp4",
	"jss14_project_1.mp4",
	"jss14_project_2.mp4",
	"jss14_project_3.mp4",
	"jss14_project_4.mp4",
	"jss14_supplemental_project_1.mp4",
	"jss14_supplemental_project_2.mp4",
	"jss15_project_1.mp4",
	"jss15_supplemental_project_1.mp4",
	"jss15_supplemental_project_2.mp4",
	"jss15_supplemental_project_3.mp4",
	"jss_check_in_1_project.mp4",
	"jss_check_in_2_project.mp4"
];

const JAVASCRIPT_LEVEL_1_PRACTICE_PACK =
	"/course-assets/javascript-level-1/javascript-level-1-practice-pack.md";
const JAVASCRIPT_LEVEL_1_VERIFICATION_GUIDE =
	"/course-assets/javascript-level-1/javascript-level-1-verification-guide.md";

const javascriptLevel1SourceCourse: RawCourse = {
	name: "JavaScript Level 1: JavaScript Superstar",
	modules: [
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this checkpoint as a review of JavaScript variables, operators, randomness, loops, conditionals, SVG drawing, and nested loops. Each prompt produces a small runnable example and a short explanation of why the chosen JavaScript structure fits the task. The checkpoint identifies which fundamentals are fluent and which ones need more practice before the next project sequence.",
					solutionLink:
						"https://codepen.io/junilearning/pen/9023ac5a2ab1213c64d59d7b864aef8d"
				},
				{
					title: "Check-In #1: Variables",
					content:
						"Create variables for three different kinds of data: a number, a string, and a boolean. Then ask for a favorite color with `prompt()`, store the response in `userColor`, and use the value in two outputs: a `printToScreen()` sentence and an `alert()`. Check that the variable name, stored value, and printed message all match."
				},
				{
					title: "Check-In #1: Mathematical Operators and Randomness",
					content:
						"Generate a random number from 1 through 256, convert it into an integer, then apply several arithmetic operations to that value. Print the original integer, the value plus 5, the value multiplied by 10, and at least one remainder calculation. The finished code makes the order of operations and rounding step easy to inspect."
				},
				{
					title: "Check-In #1: Loops",
					content:
						"Compare a `for` loop and a `while` loop by using both to print the even numbers from 0 through 20. Then use a loop to generate six random integers from 0 through 10 and keep a running sum. Verify the loop count, update step, and final total by printing enough intermediate information to catch off-by-one mistakes."
				},
				{
					title: "Check-In #1: Conditionals",
					content:
						"Review `if`, `else if`, and `else` branches. Write a program that asks for a number; if the number is less than or equal to 50, print a success message, otherwise print a sorry message. Create booleans for reading and chores; if both are true, print that going outside is allowed, otherwise print that it is not. Then update the condition to allow going outside if either value is true using `||`."
				},
				{
					title: "Check-In #1: Drawing in JavaScript",
					content:
						"Create a 500-by-500 SVG and draw two aligned shapes: a green square at `x=100`, `y=120`, `width=200`, `height=200`, and a blue circle centered inside the square with radius 50. Use the square's position and size to reason about the circle's center point instead of guessing coordinates."
				},
				{
					title: "Check-In #1: Nested Loops",
					content:
						"Use nested loops to print a shrinking star pattern: four stars, then three, then two, then one. Build the pattern once with nested `for` loops and again with nested `while` loops. The outer loop controls the row and the inner loop controls how many stars appear in that row."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Build a three-round random number guessing game with golf-style scoring. Each round chooses a target number, allows three guesses, compares each guess to the target, and awards fewer points for closer guesses. Track total score across rounds and print enough feedback for a player to understand whether a guess was close, far away, or exact.",
					projectLink:
						"https://codepen.io/junilearning/pen/b04e9208251c84d123c97daf37972988",
					solutionLink:
						"https://codepen.io/junilearning/pen/e0a4c125fb9fa7f0324934dc2fe9317f"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Check In #1",
						section: "extension"
					}),
					solutionLink:
						"https://codepen.io/junilearning/pen/9023ac5a2ab1213c64d59d7b864aef8d"
				},
				{
					title: "Check In #1 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JavaScript Superstar Check-In #1",
						itemTitle:
							"JavaScript Superstar Check-In #1 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-01-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-01-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check In #1 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JavaScript Superstar Check-In #1",
						itemTitle:
							"JavaScript Superstar Check-In #1 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-02-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-02-check-in-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"Use this checkpoint to review the web-development half of JavaScript Level 1: HTML structure, CSS layout, D3 animation, DOM events, components, and responsive page layout. Each task connects a visible result to the underlying markup, style rule, or JavaScript event that created it.",
					solutionLink:
						"https://codepen.io/junilearning/pen/ce3da888e3e72bcaff1251f225b2f6fa"
				},
				{
					title: "Check-In #2: HTML & CSS",
					content:
						"Review HTML tags, nesting, and the difference between `div` and `span`. Create a red class-based `div` with a fixed height, compare `block`, `inline-block`, and `inline`, then build a yellow box with margin, padding, and a border so the box model is visible. Finish by placing a blue square at the top-left of the page, scrolling the page, and explaining how position and `z-index` affect layering.",
					projectLink:
						"https://codepen.io/junilearning/pen/f52dbec392b0c8ec4d21abcf8aecad43",
					solutionLink:
						"https://codepen.io/junilearning/pen/ce3da888e3e72bcaff1251f225b2f6fa"
				},
				{
					title: "Check-In #2: Animations and JavaScript Components",
					content:
						"Draw a red square with D3, animate it so the square doubles in size, and add a `mouseover` interaction that transitions the square to green. Then use the Materialize documentation to add a collapsible component. Confirm which code creates the SVG shape, which code handles animation, and which code initializes the external component."
				},
				{
					title: "Check-In #2: Website Layout",
					content:
						"Compare a page section with a layout container, then build two small layout examples: a 3-by-3 CSS Grid with alternating colors and a 3-by-3 Materialize grid with numbers 1 through 9. Add one icon and demonstrate how its display or placement changes on a smaller screen."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Replicate the snowflake pattern with D3 shapes and animation. Break the snowflake into repeated arms or segments, use a loop or helper to avoid manually duplicating every piece, and animate at least one property such as rotation, opacity, size, or position so the final result shows both structure and motion.",
					projectLink: "https://codepen.io/junilearning/pen/vYGWvaq",
					solutionLink:
						"https://codepen.io/junilearning/pen/084c3032877fa7f9c828bba2c5798551"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Check In #2",
						section: "extension"
					}),
					solutionLink:
						"https://codepen.io/junilearning/pen/ce3da888e3e72bcaff1251f225b2f6fa"
				},
				{
					title: "Check In #2 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JavaScript Superstar Check-In #2",
						itemTitle:
							"JavaScript Superstar Check-In #2 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-03-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-03-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check In #2 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JavaScript Superstar Check-In #2",
						itemTitle:
							"JavaScript Superstar Check-In #2 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-04-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-04-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS1 Variables and Data Types",
			curriculum: [
				{
					title: "Introductions & Setup",
					content:
						'Get comfortable with the browser-based coding workspace by opening the starter resource, saving a personal copy, and running the page. Confirm that the HTML, CSS, and JavaScript panels are visible, then call printToScreen("Hello World"); in JavaScript and verify that the page updates.',
					projectLink: "https://codepen.io/junilearning/pen/JjGrYOG"
				},
				{
					title: "Variables and Data Types",
					content:
						'Use `let` for a binding that can be reassigned and `const` for one that cannot. Store numbers, strings and booleans, then display them with `printToScreen()`. After `let value;`, `value` is `undefined`. `null` is a primitive value used to represent an intentional absence; `typeof null` returns "object", so test for it with `value === null`. Explain comments and convert a numeric string with a leading `+`. Compare "1" + "1" with 1 + 1.',
					projectLink: "https://codepen.io/junilearning/pen/eYpBWWX"
				},
				{
					title: "User Input and Printing",
					content:
						"Use `prompt()` to collect text from the user and store the response in a variable. Display information three ways: `printToScreen()` for visible page output, `console.log()` for developer/debug output, and `alert()` for a popup message. Open the browser console and verify that console output is separate from page output."
				},
				{
					title: "Strings",
					content:
						"Treat strings as ordered characters whose indices start at 0. Practice reading a character by index, joining strings with `+`, and measuring text with `.length`. Remember that `prompt()` returns a string even when the user types digits, so numeric input needs conversion before arithmetic."
				},
				{
					title: "JSS1 Project 1: Welcome Survey",
					preserveInstructions: true,
					content:
						"Build a short welcome survey that collects a first name, last name, two numeric inputs, and a favorite food. Print the full name as one sentence, convert the numeric inputs before adding them, log the sum to the console, and alert the last letter of the favorite food. Test a one-letter food and a multi-word name so indexing and concatenation are not only tested on easy input.",
					projectLink: "https://codepen.io/junilearning/pen/OJMxyqw",
					solutionLink:
						"https://codepen.io/junilearning/pen/1efb04d2b3e13694f1bf614fef02c22c"
				},
				{
					title: "Debugging",
					content:
						"Compare syntax errors, which prevent code from running, with logic errors, which run but produce the wrong result. Use console error messages, out-of-range string indexing, type-conversion mistakes, and the `debugger` keyword to inspect program state. The debugging habit is to change one thing, rerun, and verify what changed."
				},
				{
					title: "JSS1 Project 2: Mad Libs",
					preserveInstructions: true,
					content:
						"Create a Mad Libs story that uses `prompt()` to collect at least five words, stores each response in a clearly named variable, and prints a complete story with `printToScreen()`. The story includes punctuation and spaces intentionally so the final sentence reads naturally instead of looking like raw concatenated fragments.",
					projectLink: "https://codepen.io/junilearning/pen/qBbPbPp",
					solutionLink:
						"https://codepen.io/junilearning/pen/ce06ca273ecc8c28529261846833d4c1"
				}
			],
			supplementalProjects: [
				{
					title: "JSS1 Supplemental Project 1: Cookie Math",
					preserveInstructions: true,
					content:
						"Use `prompt()` to ask how much flour is available, convert the input to a number, and calculate how many eggs and chocolate chips are needed for the matching recipe amount. Decide where rounding is necessary, such as with `Math.ceil()`, and print the recipe recommendation clearly enough that the units and rounded values are not ambiguous.",
					projectLink: "https://codepen.io/junilearning/pen/rNxGxKm",
					solutionLink:
						"https://codepen.io/junilearning/pen/27b890b0097969f24289d9abf77d1392"
				},
				{
					title: "JSS1 Supplemental Project 2: Hello World!",
					preserveInstructions: true,
					content:
						"Use string indexing to construct `Hello World!` from provided strings. Identify the index of each needed character, store or print the characters in order, and verify that spaces and punctuation are included intentionally. This makes zero-based indexing concrete rather than relying on a prewritten full phrase.",
					projectLink: "https://codepen.io/junilearning/pen/MWKEKPJ",
					solutionLink:
						"https://codepen.io/junilearning/pen/36a808fbb70a55e25889b07c74debb6a"
				},
				{
					title: "JSS1 Supplemental Project 3: Debugging a Friend Survey",
					preserveInstructions: true,
					content:
						"Debug a friend's survey code by checking prompts, variable names, string concatenation, numeric conversion, and output statements. Run the broken version first, list the intended prompts and printed output, then fix one issue at a time until every answer appears in the intended place.",
					projectLink: "https://codepen.io/junilearning/pen/VwexoXw",
					solutionLink:
						"https://codepen.io/junilearning/pen/a16730b9a6d5bba63389d9e3f5614ab9"
				}
			]
		},
		{
			title: "JSS2 Operators and Math",
			curriculum: [
				{
					title: "Introduction to Operators",
					content:
						"An operator changes or combines values. Practice `+`, `-`, `*`, `/`, and `%`, then compare those arithmetic operators with the assignment operator `=`, which stores a value. Use compound assignment such as `+=` and `*=` when updating an existing variable, and test `++` or `--` only when the one-step change is clear."
				},
				{
					title: "Math Methods",
					content:
						"Use JavaScript's `Math` methods to make calculations more expressive. Practice `Math.random()`, `Math.floor()`, `Math.ceil()`, `Math.PI`, and `Math.pow()`. For random integers, show the full transformation from a decimal between 0 and 1 to a useful whole-number range, then test the smallest and largest possible values."
				},
				{
					title: "JSS2 Project 1: Tips and Taxes",
					preserveInstructions: true,
					content:
						"Prompt for meal cost, tax percent, and tip percent, then calculate the final total. Convert all numeric inputs before arithmetic, show the intermediate tax and tip values, and print the final cost with a readable label. Test a whole-dollar meal and a decimal meal cost so rounding and formatting choices are visible.",
					projectLink: "https://codepen.io/junilearning/pen/RwrLayP",
					solutionLink:
						"https://codepen.io/junilearning/pen/06257a44b94db1486fac683ccaace7be"
				},
				{
					title: "JSS2 Project 2: Randomly Random Party",
					preserveInstructions: true,
					content:
						"Generate a random party date and start time. Choose a month from 5 through 7, a day from 1 through 30, an hour from 10 through 20, and a minute from 0 through 59. Print the result in a readable sentence, and verify that the random formulas cannot produce an impossible value outside the intended ranges.",
					projectLink: "https://codepen.io/junilearning/pen/xxZXVye",
					solutionLink:
						"https://codepen.io/junilearning/pen/29d1e4fde67a75fc4b5cdcacd458cb8d"
				},
				{
					title: "JSS2 Project 3: What's the Password?",
					preserveInstructions: true,
					content:
						"Start with `Math.PI`, multiply by 6 to the eighth power, then add 11. Divide by 3 and round down with `Math.floor()`, then find the remainder after division by `Math.PI`. Keep each step on a separate line, trace the intermediate values, and pass the final number to `printToScreen()`.",
					projectLink: "https://codepen.io/junilearning/pen/PoZJNXb",
					solutionLink:
						"https://codepen.io/junilearning/pen/c550ef1e284c55fa01964589bf19b21c"
				}
			],
			supplementalProjects: [
				{
					title: "JSS2 Supplemental Project 1: Pie Eating Contest",
					preserveInstructions: true,
					content:
						"Distribute a non-negative whole number of donated pies equally among four contestants, giving only whole pies. Prompt for the starting total, calculate each contestant's share and the leftover count, then print all three values. Test zero pies, a total divisible by four, and a total with leftovers.",
					projectLink: "https://codepen.io/junilearning/pen/jOWGqJZ",
					solutionLink:
						"https://codepen.io/junilearning/pen/a9612fb435c5e334490c1eeb72e9c567"
				},
				{
					title: "JSS2 Supplemental Project 2: Random Practice",
					preserveInstructions: true,
					content:
						"Print random numbers from several target ranges: 0 through 5, 1 through 10, 20 through 50, even numbers from 0 through 50, and odd numbers from 51 through 101. For each range, write the formula first, then run several samples to check that the endpoints and parity rules are possible.",
					projectLink: "https://codepen.io/junilearning/pen/JjGrXgg",
					solutionLink:
						"https://codepen.io/junilearning/pen/5bbc99927a71e48ec59e93b8dfbb585c"
				},
				{
					title: "JSS2 Supplemental Project 3: Circles",
					preserveInstructions: true,
					content:
						"Use a modified `printToScreen(start, end)` helper to draw arcs. Convert degrees to radians before drawing, then create a rainbow arc, a full circle, and a three-quarter circle. Keep the angle values visible in the code so it is clear why each arc opens or closes where it does.",
					projectLink: "https://codepen.io/junilearning/pen/yLezJLx",
					solutionLink:
						"https://codepen.io/junilearning/pen/d004723cc01403a3db897db1206f449b"
				},
				{
					title: "JSS2 Supplemental Project 4: Debugging Math Practice",
					preserveInstructions: true,
					content:
						"Debug the math-practice program by first identifying the expected numeric result, then tracing each arithmetic step in the existing code. Fix one error at a time, rerun after each change, and leave the final version readable enough that the order of operations, rounding behavior, and printed answer are easy to verify.",
					projectLink: "https://codepen.io/junilearning/pen/VwexoVL",
					solutionLink:
						"https://codepen.io/junilearning/pen/f90710cc7e05de72ea7ff2b8b05a32bd"
				}
			]
		},
		{
			title: "JSS3 For and While Loops",
			curriculum: [
				{
					title: "For Loops",
					content:
						"A `for` loop is useful when the number of repetitions or the counting pattern is known. Read the loop as three parts: initialization, continuation condition, and update step. Practice by printing 0 through 9, multiples of 3, and countdowns, then trace the first two and last two iterations to confirm where the loop starts and stops."
				},
				{
					title: "JSS3 Project 1: For Loops Practice",
					preserveInstructions: true,
					content:
						"Use separate `for` loops with `printToScreen()` to print 1 through 50, 50 down to 1, even numbers 2 through 100, and odd numbers 99 down to 1. Optional challenges: print powers of 3 from 1 through 100, then the sequence 500, 100, 20, 4. Trace each loop's start value, condition, and update.",
					projectLink: "https://codepen.io/junilearning/pen/PoZJGKV",
					solutionLink:
						"https://codepen.io/junilearning/pen/8c4bf4ddfb48b6a93a41d0347d6f78ef"
				},
				{
					title: "While Loops",
					content:
						"A `while` loop repeats as long as its condition stays true. It is useful when the stopping point depends on a changing value rather than a fixed number of repetitions. Every `while` loop needs a clear starting value, a condition, and an update that moves the loop toward stopping; otherwise it can become infinite."
				},
				{
					title: "JSS3 Project 2: String Reversal",
					preserveInstructions: true,
					content:
						"Prompt for a word, then print its letters forward with a `for` loop and backward with a `while` loop. Use string indices deliberately: the forward loop starts at 0, while the backward loop starts at the last valid index. Test a one-letter word and a longer word to confirm the boundary logic.",
					projectLink: "https://codepen.io/junilearning/pen/OJMxRvY",
					solutionLink:
						"https://codepen.io/junilearning/pen/3f802bef974fcccd10caafaac8c3eb04"
				},
				{
					title: "JSS3 Project 3: Looping Squares",
					preserveInstructions: true,
					content:
						"Use loops to print repeated colored squares with `printToScreen()`: two red squares, three yellow squares, four blue squares, and three purple squares. Use `for` loops for some groups and `while` loops for others, then compare which version makes the repeat count easiest to read.",
					projectLink: "https://codepen.io/junilearning/pen/xxZXEzP",
					solutionLink:
						"https://codepen.io/junilearning/pen/56baa6b060aab0e3511c7c3608d53eaa"
				}
			],
			supplementalProjects: [
				{
					title: "JSS3 Supplemental Project 1: Powers of 3",
					preserveInstructions: true,
					content:
						"Print every power of 3 that is less than 5000. Start with a value of 1, repeatedly multiply by 3, and stop before the value reaches the limit. The output makes the growth pattern clear, and the loop avoids printing the first value that is too large.",
					projectLink: "https://codepen.io/junilearning/pen/wvMrzEw",
					solutionLink:
						"https://codepen.io/junilearning/pen/1c1201771499a38d4f15588580d7bfa1"
				},
				{
					title: "JSS3 Supplemental Project 2: Forgotten Math",
					preserveInstructions: true,
					content:
						"Multiply two finite numbers by repeated addition without using `*` or `*=`. Use a whole-number input as the repeat count; either input can supply that count, while the other may be decimal. Track the running total and its sign. Test multiplying by 0 and 1, negative inputs, a decimal amount, and canceled or unsupported input.",
					projectLink: "https://codepen.io/junilearning/pen/gOPGwBy",
					solutionLink:
						"https://codepen.io/junilearning/pen/53206f1e4800c28a4549aea7be49b7e0"
				},
				{
					title: "JSS3 Supplemental Project 3: Debugging Loops",
					preserveInstructions: true,
					content:
						"Repair the simulation so it runs five races. For each race, count down from 10 to 1, advance each of three racers 50 times by a random whole distance from 1 through 10, and print their final distances. Trace initialization, conditions, updates, and the race counter.",
					projectLink: "https://codepen.io/junilearning/pen/KKVGBWx",
					solutionLink:
						"https://codepen.io/junilearning/pen/d56a9a00a8022b7f85434f295cc0dbec"
				}
			]
		},
		{
			title: "JSS4 Combining Loops and Variables",
			curriculum: [
				{
					title: "Combining Loops and Variables",
					content:
						"Loops become more useful when variables change inside them. Use counters, totals, guesses, lives, or attempts to represent program state, then update that state on each iteration. The important habit is to identify what changes, where it changes, and how that change affects the loop condition or final output."
				},
				{
					title: "JSS4 Project 1: Totaling Up",
					preserveInstructions: true,
					content:
						"Use loops to sum the numbers from 1 through 100, sum their squares, and compute a prompted whole-number factorial. Initialize or reset the accumulator for each task. Check 5050, 338350 and 5! = 120, then test the 0 and 1 boundaries, canceled input and values that cannot produce a finite factorial.",
					projectLink: "https://codepen.io/junilearning/pen/gOPGwNV",
					solutionLink:
						"https://codepen.io/junilearning/pen/71ad8b99ac4c707e75b4f0e136f82665"
				},
				{
					title: "JSS4 Project 2: Coin Machine",
					preserveInstructions: true,
					content:
						"Ask for a whole number of pennies. Use while loops to subtract dollars first, then quarters, dimes and nickels, leaving the remaining pennies. Track each count and the changing remainder. Test 0, 4, 25, 41, 99 and 187 pennies, including a case with both a dollar and leftover coins.",
					projectLink: "https://codepen.io/junilearning/pen/VweMmZq",
					solutionLink:
						"https://codepen.io/junilearning/pen/17494fdc78b6e93db4e8206101f45ea7"
				},
				{
					title: "ASCII",
					content:
						"Character codes represent text characters as numbers, which makes it possible to shift or generate characters with arithmetic. Use `char.charCodeAt()` to inspect a character's numeric code and `String.fromCharCode()` to convert a number back into a character. Test uppercase letters, lowercase letters, digits, and punctuation so the ranges are not treated as one continuous alphabet."
				},
				{
					title: "JSS4 Project 3: Random Password",
					preserveInstructions: true,
					content:
						"Generate ten random lowercase letters using ASCII codes and ten random digits. Interleave them into a twenty-character sample that alternates a letter and a digit. Check the length, positions and inclusive a-z and 0-9 ranges. Math.random is suitable for this exercise but does not produce secure account passwords.",
					projectLink: "https://codepen.io/junilearning/pen/jOWGVVB",
					solutionLink:
						"https://codepen.io/junilearning/pen/1520f836e15f3d4e7f554b913a805b02"
				}
			],
			supplementalProjects: [
				{
					title: "JSS4 Supplemental Project 1: Debugging Football",
					preserveInstructions: true,
					content:
						"Repair the simulation so the starting yard is a random whole number from 1 through 25. Run four plays per round, each gaining a random whole amount from -4 through 10 yards. Update the current yard and round total, report the round gain, and use the Y/N answer to continue or stop. Distinguish total gain from the final yard position.",
					projectLink: "https://codepen.io/junilearning/pen/gOPRqPr",
					solutionLink:
						"https://codepen.io/junilearning/pen/eb1d816cbecce4d20944284fc085ae36"
				}
			]
		},
		{
			title: "JSS5 Conditionals",
			curriculum: [
				{
					title: "Introduction to Conditionals",
					content:
						"Conditionals let a program choose what happens based on whether a condition is true. Start with simple real-world examples, then connect them to JavaScript `if` syntax: a condition in parentheses and a block of code in braces. Test both a true case and a false case so the branch behavior is visible."
				},
				{
					title: "Equivalence Operators",
					content:
						"Use comparison operators to create boolean expressions: `>`, `<`, `>=`, `<=`, `===`, and `!==`. Practice using `!` to invert a boolean, then build small `if` checks that print which comparison was true. Prefer strict equality so the code does not hide type-conversion surprises."
				},
				{
					title: "JSS5 Project 1: A-Checker",
					preserveInstructions: true,
					content:
						"Prompt for a word and check whether it contains the letter `a`. Use a loop to inspect characters one at a time and a conditional to detect a match. Print a clear result for words that contain `a` and words that do not, then test uppercase, lowercase, and empty input if the project allows it.",
					projectLink: "https://codepen.io/junilearning/pen/QWyqrLo",
					solutionLink:
						"https://codepen.io/junilearning/pen/3ef023d001ee721f608cac6b87a41bd2"
				},
				{
					title: "Else and Else If",
					content:
						"`else if` and `else` let one decision chain cover multiple outcomes. Use `if` for the first condition, `else if` for additional specific conditions, and `else` for the fallback. Check that the branches are ordered from most specific to most general when the conditions can overlap."
				},
				{
					title: "JSS5 Project 2: What Grade Is This?",
					preserveInstructions: true,
					content:
						"Given a number from 0 through 100, print the matching letter grade with an `if`/`else if`/`else` chain. Decide how boundary values such as 90, 80, 70, and invalid scores are handled before coding. Test the exact boundary values as well as one score in the middle of each grade range.",
					projectLink: "https://codepen.io/junilearning/pen/yLezjje",
					solutionLink:
						"https://codepen.io/junilearning/pen/2d86a137a1c362df390051e86a298e9d"
				},
				{
					title: "Advanced String Functions",
					content:
						"Use template strings to build readable output with backticks and embedded expressions. Then use `.toUpperCase()` and `.toLowerCase()` to normalize or transform text. These tools are especially useful when user input might have unexpected capitalization."
				},
				{
					title: "JSS5 Project 3: Wholesome Memes",
					preserveInstructions: true,
					content:
						"Convert a sentence to alternating case, such as `tHaT lOoKs LiKe ThIs`. Loop through the characters, use conditionals or index parity to decide uppercase versus lowercase, and preserve spaces or punctuation intentionally. An extension can use ASCII checks so only alphabetic characters affect the alternating pattern.",
					projectLink: "https://codepen.io/junilearning/pen/wvMrXdG",
					solutionLink:
						"https://codepen.io/junilearning/pen/bf0a3506f98d1b247c3f259986a941bd"
				}
			],
			supplementalProjects: [
				{
					title: "JSS5 Supplemental Project 1: Login Credentials",
					preserveInstructions: true,
					content:
						"Build a simple login loop that keeps prompting until the username and password match the expected credentials. Track attempts if useful, give clear failure feedback, and alert success only when both values match. Make sure the loop has a reliable stopping condition so it does not continue after a correct login.",
					projectLink: "https://codepen.io/junilearning/pen/QWyqxqp",
					solutionLink:
						"https://codepen.io/junilearning/pen/d0f771c4f6fd24c86077e6b3fee4fa72"
				},
				{
					title: "JSS5 Supplemental Project 2: Snake Eyes",
					preserveInstructions: true,
					content:
						"Simulate rolling two dice until both dice show 1. Each iteration rolls both dice, counts the attempt, and decides whether the stopping condition has been met. Print the total number of rolls and enough sample roll information to verify that the loop is actually waiting for snake eyes.",
					projectLink: "https://codepen.io/junilearning/pen/jOWGKZw",
					solutionLink:
						"https://codepen.io/junilearning/pen/6580937e9dfd9ce926651a6fe915e078"
				},
				{
					title: "JSS5 Supplemental Project 3: Debugging the Favorite Fruit Guesser",
					preserveInstructions: true,
					content:
						"Debug a fruit guesser that uses color and taste conditionals. First identify the intended decision tree, then check whether each condition is testing the correct variable and whether the branches are ordered correctly. Test at least one input that matches, one that almost matches, and one that falls through to the default result.",
					projectLink: "https://codepen.io/junilearning/pen/PoZdQeW",
					solutionLink:
						"https://codepen.io/junilearning/pen/949d30ec6dbcc0dfdda259392403b0b7"
				}
			]
		},
		{
			title: "JSS6 Advanced Conditionals",
			curriculum: [
				{
					title: "Nested Conditionals",
					content:
						"Nested conditionals place one `if` statement inside another when a second decision only matters after the first decision is true. Use nesting sparingly: it is useful for dependent checks, but long nested code can become hard to read. Compare a nested version with a combined-condition version when both are possible."
				},
				{
					title: "JSS6 Project 1: The Sorting Hat",
					preserveInstructions: true,
					content:
						"Prompt for a house and a quality. Use nested conditionals with these exercise rules: Gryffindor/bravery, Slytherin/cunning, Ravenclaw/wisdom, and Hufflepuff/hard work. Print the selected house for a matching pair, a mismatch message for a known house with another quality, and an unknown-house message otherwise.\n\nTest all four matching pairs, a mismatch for each house, and an unknown house. Comparisons are case-sensitive. The reference handles Cancel at either prompt before choosing a house.",
					projectLink: "https://codepen.io/junilearning/pen/JjGrxRB",
					solutionLink:
						"https://codepen.io/junilearning/pen/e7c85cf84c953eb5bc630e214fe476d8"
				},
				{
					title: "AND & OR Operators",
					content:
						"`&&` requires both sides to be true, while `||` requires at least one side to be true. Use small examples to show how combined conditions reduce nested code. Also note short-circuit behavior: JavaScript may skip the second expression when the first expression already determines the result."
				},
				{
					title: "JSS6 Project 2: FizzBuzz",
					preserveInstructions: true,
					content:
						"Print the numbers from 1 through 50. Replace multiples of 3 with `Fizz`, multiples of 5 with `Buzz`, and multiples of both with `FizzBuzz`. Check the combined 3-and-5 condition first.\n\nProduce exactly 50 lines. Check 1 and 2, 3 (`Fizz`), 5 (`Buzz`), 15, 30 and 45 (`FizzBuzz`), and the final value 50 (`Buzz`).",
					projectLink: "https://codepen.io/junilearning/pen/gOPGqKa",
					solutionLink:
						"https://codepen.io/junilearning/pen/0b39a6e7b85b790e7cd9a276e9ee2c4f"
				},
				{
					title: "True Versus Truthy",
					content:
						"JavaScript distinguishes strict truth from truthy and falsy values. Compare `==`, which can coerce types, with `===`, which checks both value and type. Use examples such as empty strings, 0, nonempty strings, and booleans, then prefer `===` and `!==` unless coercion is intentional."
				},
				{
					title: "Switch Statements",
					content:
						"A `switch` statement is useful when one expression is compared against several exact cases. Each case handles one expected value, `break` prevents accidental fall-through, and `default` handles unknown values. Test at least one known case and one default case."
				},
				{
					title: "JSS6 Project 3: GCF of Two Numbers",
					preserveInstructions: true,
					content:
						"Find the greatest common factor of two positive whole numbers. Test candidate factors from 1 through the smaller input, use `&&` to check that both remainders are zero, and retain the largest matching factor.\n\nCheck 36/24 → 12, 8/15 → 1, 18/18 → 18, and reversed inputs. The reference accepts positive whole inputs from 1 through 1,000,000, bounding the factor search. It handles Cancel separately and rejects blank, fractional, nonnumeric, infinite, zero, negative and larger inputs before entering the loop.",
					projectLink: "https://codepen.io/junilearning/pen/NWxaJdX",
					solutionLink:
						"https://codepen.io/junilearning/pen/b418881c3e60c8c7ac8fcbc3b7d74aa0"
				}
			],
			supplementalProjects: [
				{
					title: "JSS6 Supplemental Project 1: What Does the _ Say?",
					preserveInstructions: true,
					content:
						"Use a `switch` statement with `break` to map lowercase animal names to sounds: dog/woof, cat/meow, cow/moo, bee/buzz, and frog/ribbit. The original reference also gives fox a playful response. Print `huh?` for an unknown animal.\n\nCheck each listed animal, fox, an unknown animal and a differently capitalized name. Comparisons remain case-sensitive. The reference handles Cancel separately. Every recognized switch case ends with `break`.",
					projectLink: "https://codepen.io/junilearning/pen/NWxaJgy",
					solutionLink:
						"https://codepen.io/junilearning/pen/5b0bdb527344a081c9abf91138ce5f4a"
				},
				{
					title: "JSS6 Supplemental Project 2: Debugging Bugging Friends",
					preserveInstructions: true,
					content:
						"Debug the starter’s compound conditions using this fictional exercise’s message-rate rules: acquaintance 10, friend 25, good friend 50, and best friend 200 messages per hour. A warning requires both the matching level and a rate strictly above its threshold.\n\nThe starter intentionally uses incorrect compound conditions. Trace each level at its exact threshold and one message above it, then fix the `&&`/`||` choice. Equal rates do not warn. The reference accepts a recognized level, a nonnegative safe whole message count, and finite elapsed hours greater than zero. It handles Cancel at each prompt and reports invalid input before computing the rate.",
					projectLink: "https://codepen.io/junilearning/pen/mdVGXLE",
					solutionLink:
						"https://codepen.io/junilearning/pen/67b0c29a104afde9cce553de6cacf882"
				}
			]
		},
		{
			title: "JSS7 Drawing in JavaScript",
			curriculum: [
				{
					title: "Introduction to D3",
					preserveInstructions: true,
					content:
						'D3 selects elements with `d3.select(...)`, creates children with `.append(...)`, and sets SVG attributes with `.attr(...)`. The imported projects include D3 locally.\n\n```javascript\nconst svg = d3.select("body").append("svg")\n  .attr("width", 400).attr("height", 200)\n  .attr("viewBox", "0 0 400 200");\n\nsvg.append("rect")\n  .attr("x", 20).attr("y", 30)\n  .attr("width", 80).attr("height", 40)\n  .attr("fill", "purple");\n```\n\nSVG coordinates begin at the top-left: x increases to the right and y increases downward. The example rectangle starts at (20,30). Width and height set the drawing dimensions; `viewBox` defines its coordinate area. The projects scale that area to fit the screen while keeping the shape coordinates unchanged.'
				},
				{
					title: "Drawing Shapes in D3",
					preserveInstructions: true,
					content:
						"Draw rectangles, circles, and ellipses by appending SVG elements and setting their attributes. Use `x`, `y`, `width`, `height`, and `fill` for rectangles; `cx`, `cy`, and `r` for circles; and `rx` and `ry` for ellipses. Verify each shape by changing one coordinate or size attribute and predicting how the drawing will move.",
					projectLink: "https://codepen.io/junilearning/pen/zYrPBYM",
					solutionLink:
						"https://codepen.io/junilearning/pen/7ba2616cfb21c6a3fbf71ee0cfb78332"
				},
				{
					title: "Drawing Arcs",
					preserveInstructions: true,
					content:
						'`d3.arc()` generates the path data for a curved shape. Angles use radians: multiply degrees by `Math.PI / 180`. Zero points upward and positive angles turn clockwise. `innerRadius: 0` makes a filled sector; a larger inner radius leaves a hole.\n\nThis example adds a quarter-ring to the SVG created above:\n\n```javascript\nfunction degreesToRadians(degrees) {\n  return degrees * Math.PI / 180;\n}\n\nconst arcGenerator = d3.arc();\nconst pathData = arcGenerator({\n  startAngle: degreesToRadians(0),\n  endAngle: degreesToRadians(90),\n  innerRadius: 20,\n  outerRadius: 40\n});\n\nsvg.append("path")\n  .attr("d", pathData)\n  .attr("fill", "orange")\n  .attr("transform", "translate(80,80)");\n```\n\nThe `d` attribute receives the generated path. Arcs start around (0,0); `translate(80,80)` moves this arc’s center to (80,80). Change one angle or radius and predict the result before running it.'
				},
				{
					title: "JSS7 Project 2: Smiley Face",
					preserveInstructions: true,
					content:
						"Draw a smiley face with D3 using two eye shapes and an arc-based mouth. Use `degreesToRadians()` or a similar helper so the mouth angles are understandable. The final drawing places both eyes symmetrically and positions the mouth relative to the face center instead of relying on unexplained coordinates.",
					projectLink: "https://codepen.io/junilearning/pen/MWKOeRd",
					solutionLink:
						"https://codepen.io/junilearning/pen/593993382174caa7d510ddbd5b0009d8"
				},
				{
					title: "JSS7 Project 3: Pac-Man",
					preserveInstructions: true,
					content:
						"Draw two Pac-Men facing each other with D3 arcs, each with a missing slice for its mouth. Set `innerRadius` to `0`, give the second character the same start and end angles with opposite signs, and translate the paths to separate centers. Test a wider and narrower mouth by changing the angle values.",
					projectLink: "https://codepen.io/junilearning/pen/JjGORoK",
					solutionLink:
						"https://codepen.io/junilearning/pen/6df064875eb631bc08eab5c342ef98f7"
				}
			],
			supplementalProjects: [
				{
					title: "JSS7 Supplemental Project 1: Snowman",
					preserveInstructions: true,
					content:
						"Draw a snowman from multiple D3 shapes: stacked circles for the body, smaller shapes for eyes/buttons, arcs or lines for facial details, and optional lines for arms. Build the drawing from named sections so the body, face, and accessories can be adjusted independently.",
					projectLink: "https://codepen.io/junilearning/pen/GRoOjjx",
					solutionLink:
						"https://codepen.io/junilearning/pen/bb6f6bcdf7ff47fef8a5f2dc3a2138f0"
				},
				{
					title: "JSS7 Supplemental Project 2: Captain America's Shield",
					preserveInstructions: true,
					content:
						"Draw Captain America's shield with concentric circular or arc shapes and a centered star. Use the D3 symbol documentation for the star, keep the center coordinates consistent across layers, and verify that later shapes do not accidentally cover the star or important ring boundaries.",
					projectLink: "https://codepen.io/junilearning/pen/VweRVWq",
					solutionLink:
						"https://codepen.io/junilearning/pen/0736d5c2045c3ecd6969c5284b93b067"
				},
				{
					title: "JSS7 Supplemental Project 3: Debugging Olaf's Star",
					preserveInstructions: true,
					content:
						"Repair the D3 drawing so the star appears in the intended position on the snowman. Trace the shape creation, fill/stroke settings, and transform coordinates, then confirm the final drawing still preserves the rest of the snowman while adding the missing star.",
					projectLink: "https://codepen.io/junilearning/pen/rNxZJdQ",
					solutionLink:
						"https://codepen.io/junilearning/pen/20aeca54176134a3397922a9e98f3564"
				}
			]
		},
		{
			title: "JSS8 Nested Loops",
			curriculum: [
				{
					title: "Nested Loops",
					content:
						'A nested loop runs its inner loop completely for each outer-loop iteration. The outer counter represents a group, such as a row or round; the inner counter represents work within that group. Use a separate variable for each counter. Declare a row\'s output inside the outer loop so it starts empty for each new row.\n\n```javascript\nfor (let row = 1; row <= 2; row++) {\n  let output = "";\n  for (let column = 1; column <= 3; column++) {\n    output += "(" + row + "," + column + ") ";\n  }\n  printToScreen(output.trim());\n}\n```\n\nThis prints `(1,1) (1,2) (1,3)` and then `(2,1) (2,2) (2,3)`: two rows, three entries per row, and six inner-loop iterations. In the project starters, `printToScreen(text)` displays one line on the page. To make triangular patterns, let the inner loop\'s limit depend on the current row. For a grid, reset the horizontal position at the start of each row, advance it inside the inner loop, and advance the vertical position after the inner loop ends.'
				},
				{
					title: "JSS8 Project 1: Multiplication Tables",
					content:
						"Use nested loops to print ten rows of products for the numbers 1 through 10. The outer loop chooses a row and the inner loop multiplies it by each column from 1 through 10. Separate products with spaces; the first row is `1 2 3 4 5 6 7 8 9 10` and the final value is `100`. Explain why ten iterations of each loop produce 100 multiplication operations.",
					projectLink: "https://codepen.io/junilearning/pen/WNrXoBj",
					solutionLink:
						"https://codepen.io/junilearning/pen/431a3c1e61b0fe9d0e6fa2e16e6d37f6"
				},
				{
					title: "JSS8 Project 2: Pattern Production",
					content:
						"Print five lines containing one, two, three, four, and five stars. Use an outer loop for rows and an inner loop to build each line, then pass the line to `printToScreen()`. Recreate the same five rows as 15 yellow D3 Pac-Man shapes. Use a filled arc with radii 0 and 50, angles 120 and 430 degrees, and `transform: translate(...)` to place each shape. Start each row at x = 100, space columns by 150, and place rows at y = 150 through 750.",
					projectLink: "https://codepen.io/junilearning/pen/pogdRva",
					solutionLink:
						"https://codepen.io/junilearning/pen/9b713f294e21887a1a2c9b528764bd4b"
				},
				{
					title: "JSS8 Project 3: Armstrong Numbers",
					content:
						"Find every three-digit Armstrong number from 100 through 999: its three digits cubed must add up to the number itself. For example, `153 = 1³ + 5³ + 3³`. Use `% 10` to extract the last digit and `Math.floor(value / 10)` to remove it; `Math.pow(digit, 3)` cubes it. Check each candidate with a loop over its three digits and print each match once. Alternatively, use three nested loops over the hundreds, tens, and ones digits, allowing hundreds from 1 through 9 and other digits from 0 through 9.",
					projectLink: "https://codepen.io/junilearning/pen/eYJegdP",
					solutionLink:
						"https://codepen.io/junilearning/pen/e12716e0c3e1cbfc0405c9da2e245b8a"
				}
			],
			supplementalProjects: [
				{
					title: "JSS8 Supplemental Project 1: Archery Simulator",
					aliases: ["JSS8 Supplemental Project 1: Juni Archery"],
					content:
						"Simulate five rounds of archery with three arrows per round. Use nested loops for rounds and arrows. `Math.floor(Math.random() * 3)` produces 0, 1, or 2; count exactly one of those outcomes as a hit so each arrow has a one-in-three chance. Print all 15 shots as `Round 1, arrow 1: X` for a hit or `O` for a miss, using the actual round and arrow numbers. Count the X results and print the total bullseyes after the final shot.",
					projectLink: "https://codepen.io/junilearning/pen/xxZPgdv",
					solutionLink:
						"https://codepen.io/junilearning/pen/2882e6ebc5b146358627d5c4f5afd90c"
				},
				{
					title: "JSS8 Supplemental Project 2: Tower of Boxes",
					content:
						"Print four hollow square boxes with side lengths 3, 4, 5, and 6. The top and bottom rows contain only `#`; every interior row starts and ends with `#` and contains underscores between them. For example, the size-3 box is three lines: `###`, `#_#`, `###`. Use nested loops to build the borders and repeat interior rows, with a blank line between boxes. The larger boxes need 2, 3, and 4 interior rows respectively.",
					projectLink: "https://codepen.io/junilearning/pen/PoZOWWp",
					solutionLink:
						"https://codepen.io/junilearning/pen/6973a709e1c0d6932da2ed1e7650d30f"
				},
				{
					title: "JSS8 Supplemental Project 3: Shield Debugging",
					content:
						"Debug the D3 assembly line so it draws nine rows of Captain America's shields, containing one through nine shields for 45 shields total. Each shield has red, white, red, and blue circles of radii 110, 90, 70, and 50, plus a centered white star. Use distinct counters for the outer row loop and inner column loop. Reset each row's horizontal position, advance it by 210 after each shield, and advance the vertical position by 210 after each row. The starter intentionally contains loop and position errors; use the browser console to locate the first failure, then check the complete pattern.",
					projectLink: "https://codepen.io/junilearning/pen/pogyeaj",
					solutionLink:
						"https://codepen.io/junilearning/pen/1ac928d6d9d777928c4439b4262310a3"
				}
			]
		},
		{
			title: "JSS9 Introduction to HTML & CSS",
			curriculum: [
				{
					title: "Introduction to HTML",
					content:
						'HTML describes page content with elements. Most elements have an opening tag, content, and a closing tag: `<div>Alan</div>`. Elements can contain children, such as `<div><span>Alan</span> <span>Turing</span></div>`. A `div` groups content as a block; a `span` groups text within a line. Headings use `h1` through `h6`. A `br` inserts a line break and an `img` embeds an image; neither has a separate closing tag.\n\n```html\n<h1>A sample page</h1>\n<div><span>Alan</span> <span>Turing</span></div>\n<a href="https://www.wikipedia.org/">Visit Wikipedia</a>\n<img src="landscape.svg" alt="Blue mountains and a gold sun">\n```\n\nAttributes give additional information: `href` is a link destination, `src` is an image path, and `alt` provides a text alternative for an image. A complete document uses `<!doctype html>`, an `html` root, a `head` for metadata and stylesheet links, and a `body` for visible content. The local project starter supplies this outer structure.'
				},
				{
					title: "Document Object Model (DOM)",
					content:
						"The browser parses HTML into the Document Object Model (DOM), a tree of element and text nodes. In `<div><span>Alan</span></div>`, the `div` is the parent and the `span` is its child. The text `Alan` is a text node inside the span. Siblings share a parent; the document's `head` and `body` are siblings inside `html`.\n\nOpen a local project in a browser and inspect it with the browser's Elements or Inspector panel. Find `html`, `head`, and `body`, expand a `div` to locate its `span`, and select that span to see the CSS rules applied to it. The source file is the written markup; the inspector shows the parsed DOM, including containers the browser may insert, such as `tbody` around table rows."
				},
				{
					id: "javascript-level-1-javascript-superstar-jss9-introduction-to-html-css-curriculum-introduction-to-css",
					aliases: ["Introduction to CSS"],
					title: "JSS9 Project 1: Basics of HTML & CSS",
					content:
						'A CSS rule pairs a selector with declarations: `div { text-align: center; }` selects every `div` and centers its text. A type selector names a tag, `.name` selects a class, and `#name` selects an id. For `<div class="note" id="example">Text</div>`, `div`, `.note`, and `#example` all match that element. Classes can be reused on several elements; an id identifies one element on the page.\n\nWrite declarations as `property: value;` inside braces. Properties such as text color and font weight can pass from a parent to a child through inheritance. A rule on the child can override the inherited value: a normal-weight `span` can appear inside a bold `div`.\n\nUse a fictional first and last name for these HTML and CSS exercises:\n\n1. Put the first and last names in separate `div` elements.\n2. Put two `span` elements inside one `div`, one for each name. Compare this with the separate `div` elements.\n3. Put a `br` line break between another pair of name `div` elements.\n4. Add an `img` using the included `landscape.svg`, with alternative text describing the image. Another suitable local image can be used instead.\n5. Add an anchor (`a`) linking to `https://www.wikipedia.org/`.\n6. Select `body` in CSS and set a background color.\n7. Select `div` and center its text.\n8. Select `span` and set its font size to 20 pixels.\n9. Select `img` and set both its width and height to 200 pixels.\n10. Make `div` text bold and `span` text normal. Explain which text inherits bold weight and which rule overrides it.',
					projectLink:
						"https://codepen.io/junilearning/pen/a4555b19dc5183859c0a6956be1f6c0a",
					solutionLink:
						"https://codepen.io/junilearning/pen/d14dd0596bbb8720c359688f460c9419"
				},
				{
					id: "javascript-level-1-javascript-superstar-jss9-introduction-to-html-css-curriculum-display-property-and-table-tags",
					aliases: ["Display Property and Table Tags"],
					title: "JSS9 Project 2: Box Inception",
					content:
						"A block element starts a new line and normally fills its available width. An inline element such as `span` flows with surrounding text. `inline-block` also flows along a line, while allowing explicit width and height. A parent `div` can group several inline-block children into a row; another parent starts the next row.\n\nIn tables, `table` contains rows (`tr`) and each row contains cells (`td` for data or `th` for a heading). `thead` groups header rows and `tbody` groups body rows. Here, table cells contain colored boxes for a layout comparison.\n\nRecreate four views of the same six colors, in this order: red, orange, yellow, green, blue, purple. Each colored box is 50 by 50 pixels.\n\n- Under `Block Display`, give each box `display: block` so the six boxes form a vertical column.\n- Under `Inline Block Display`, give each box `display: inline-block` so they share a line when enough space is available.\n- Under `Grid`, use three ordinary block `div` rows containing two inline-block boxes each. This exercise uses HTML grouping, before the later CSS Grid module.\n- Under `Table`, use a table with three rows and two cells per row, with one colored box in each cell.\n\nThe paired colors in each grid and table row are red/orange, yellow/green, and blue/purple. Compare where the browser inserts line breaks in the four structures.",
					projectLink:
						"https://codepen.io/junilearning/pen/eca1fa811c12940c388c331a07cb0dbb",
					solutionLink:
						"https://codepen.io/junilearning/pen/4ae1264dcfd25856b2d4d893eb3b2ffa"
				}
			],
			supplementalProjects: [
				{
					title: "JSS9 Supplemental Project 1: Practice with CSS Selectors",
					content:
						"Use CSS Diner to practice selector precision, not just clicking through the levels. Track examples of tag, class, id, descendant, child, adjacent-sibling, attribute, and pseudo-class selectors. After the practice, write three original selectors for a small HTML snippet and explain which elements each selector matches before testing it.",
					projectLink: "https://flukeout.github.io/"
				},
				{
					title: "JSS9 Supplemental Project 2: Practice with Flexbox",
					content:
						"Use Flexbox Froggy as a layout reasoning drill. For each new property, record what changed about the main axis, cross axis, spacing, wrapping, or item order. Finish by building a small three-card layout in CodePen that uses at least `display: flex`, `justify-content`, `align-items`, `gap`, and one responsive wrapping behavior.",
					projectLink: "https://flexboxfroggy.com/"
				},
				{
					title: "Introduction to HTML & CSS Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS9 Introduction to HTML & CSS",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-08-jss9-introduction-to-html-and-css-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-08-jss9-introduction-to-html-and-css-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS10 Animations in JavaScript",
			curriculum: [
				{
					title: "JSS10 Project 1: Car",
					content:
						'Draw a car with D3 circles, rectangles and lines on an 800 by 500 SVG. Use a 500 by 500 logical car area centered at (250,250). Wheels are centered at (125,375) and (375,375), with black radius 50 tires and gray radius 40 hubs. The red body starts at (50,200), size 450 by 150; its top starts at (50,100), size 200 by 120. Add a black roof at y 105, a slanted windshield, and a 20 by 20 yellow light at (475,225). Align the pieces before animating them.\n\n`svg.append("rect").attr("x",50).attr("y",200)` creates a rectangle and sets its coordinates; width, height and fill are separate attributes. SVG y increases downward. Later shapes draw over earlier ones. Keep the tires behind the body. Change one body color and one wheel dimension, then verify that both sides still align.\n\n## Run and coordinate space\n\nOpen index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.\n\n## D3 transitions and events\n\nCreate shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.\n\nCheck the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser\'s reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.\n\nReferences: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).\n',
					projectLink:
						"https://codepen.io/junilearning/pen/38ef977913b6ce7e1a913883f984a4e5",
					solutionLink:
						"https://codepen.io/junilearning/pen/2723c8a04416bf8402171eb247a02bb5"
				},
				{
					title: "Moving Your Car",
					content:
						'This worked example moves all nine car parts 700 SVG units to the right in 1500 milliseconds. Draw the car first. `svg.selectAll("*").transition().duration(1500).attr("transform","translate(700)")` selects every part and starts their transitions together. A duration is measured in milliseconds; a translation changes position without changing the original shape coordinates. A group containing the car is another way to move the parts together.\n\nUse a 1400 by 500 viewBox so the car\'s final right edge at 1200 remains visible. Change 700 to 500 and predict the new final position before running. Reload to repeat the single trip. With reduced motion requested, this example shows the final position immediately.\n\n## Run and coordinate space\n\nOpen index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.\n\n## D3 transitions and events\n\nCreate shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.\n\nCheck the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser\'s reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.\n\nReferences: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).\n',
					projectLink:
						"https://codepen.io/junilearning/pen/46c3f402eb4100c983f22bbbb3f4cede"
				},
				{
					title: "JSS10 Project 2: Bouncing Ball",
					content:
						'Create a steel-blue ball of radius 20 on a 960 by 500 SVG. Start its center at (40,250), move to (920,250) over 2000 milliseconds, then return to (40,250) over another 2000 milliseconds. Chain a second `.transition()` after the first to run the trips in sequence. Setting several `.attr()` targets on one transition changes them together. This is horizontal travel and return; gravity is not part of this assignment.\n\nInspect the start, far edge and final positions. Change both durations to 1000 and compare the total travel time. Reload to repeat. When reduced motion is requested, keep the ball at its starting position instead of playing automatic motion.\n\n## Run and coordinate space\n\nOpen index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.\n\n## D3 transitions and events\n\nCreate shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.\n\nCheck the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser\'s reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.\n\nReferences: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).\n',
					projectLink:
						"https://codepen.io/junilearning/pen/6a90681824ce331a3533469f911e2497",
					solutionLink:
						"https://codepen.io/junilearning/pen/a449284a2d08eecf0a0f61b644044f84"
				},
				{
					title: "DOM Events",
					content:
						'This worked example draws a 100 by 100 red square at (100,100) on a 750 by 750 SVG. `rect.on("click", turnPink)` registers a callback on the selected rectangle. Pass the function itself; `turnPink()` would call it immediately while registering. The callback transitions the fill to pink. The method is `selection.on(...)`, so call it on `rect`, not on the top-level `d3` object.\n\nClick the square twice: the first changes red to pink, and the second leaves it pink because both callbacks request the same final color. The rectangle is also keyboard focusable; Enter and Space trigger the same callback. Change pink to another CSS color and verify mouse, keyboard and touch activation. Reduced motion applies the color immediately.\n\n## Run and coordinate space\n\nOpen index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.\n\n## D3 transitions and events\n\nCreate shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.\n\nCheck the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser\'s reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.\n\nReferences: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).\n',
					projectLink: "https://codepen.io/junilearning/pen/BajVdPQ"
				},
				{
					title: "JSS10 Project 3: Growing Ball",
					content:
						'Draw a red circle centered at (200,200) on a 750 by 750 SVG. Its starting radius is 110. On `mouseover`, transition to radius 200; on `mouseout`, return to 110. Changing only r keeps the center fixed. Interrupt the previous transition before starting a new resize so rapid pointer changes settle at the latest requested radius.\n\nProvide a native button that toggles the same two radii for keyboard and touch users. Its label names the next action. Test repeated grow/shrink actions, pointer entry/exit, and rapid changes during a transition. The reference uses 250 milliseconds for each resize and changes immediately when reduced motion is requested.\n\n## Run and coordinate space\n\nOpen index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.\n\n## D3 transitions and events\n\nCreate shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.\n\nCheck the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser\'s reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.\n\nReferences: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).\n',
					projectLink:
						"https://codepen.io/junilearning/pen/ff4f98a080f26536a286835de4b1b9a2",
					solutionLink:
						"https://codepen.io/junilearning/pen/9d8630fbb5a9554618f11c649a95ab55"
				}
			],
			supplementalProjects: [
				{
					title: "JSS10 Supplemental Project 1: Bouncing and Growing",
					content:
						'Move a steel-blue ball from(40,100) to (500,100) on a 1000 by 500 SVG over 2000 milliseconds while growing its radius from 20 to 40. Then return to (40,100) and radius 20 over another 2000 milliseconds. Radius 40 is double the starting radius; its diameter doubles too. A ball of radius 50 would be 2.5 times the original radius.\n\nPut the cx and r changes on the same transition so movement and growth happen together. Chain the return transition after it. Check both midpoint targets and the final position and size. Reload to repeat. Reduced motion keeps the initial position and radius.\n\n## Run and coordinate space\n\nOpen index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.\n\n## D3 transitions and events\n\nCreate shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.\n\nCheck the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser\'s reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.\n\nReferences: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).\n',
					projectLink:
						"https://codepen.io/junilearning/pen/5e44ed4c619e2a3e960ba5cdf6ab067f",
					solutionLink:
						"https://codepen.io/junilearning/pen/be50c8f1430016572f95794d69800440"
				},
				{
					title: "JSS10 Supplemental Project 2: Rainbow",
					content:
						'Draw six D3 arc bands centered at (300,300) on an 800 by 450 SVG. Use angles from -60 to 60 degrees, converted to radians with `degrees * Math.PI /180`. The outside red band\'s outer/inner radii are 300/280. Decrease both by 20 for orange, yellow, green, blue and violet, ending at 200/180. `d3.arc()` creates the path data; append each path before animating it.\n\nReveal bands from outside inward with delays 200,400,600,800,1000 and 1200 milliseconds and 150 milliseconds for each fade. The paths keep their geometry while opacity changes from 0 to 1. Use one shared center so the bands meet without overlap or gaps. With reduced motion requested, show every band immediately. Preserve `degreesToRadians` in the starter, and implement the six bands above it.\n\n## Run and coordinate space\n\nOpen index.html in a browser. The project runs without a server. D3 and its license are included locally. A viewBox keeps the same SVG coordinates when CSS scales the drawing to a phone. Edit script.js, save, reopen the same project and export all files together. Reload the page to restart a one-shot animation.\n\n## D3 transitions and events\n\nCreate shapes with append before transitioning their attributes. `.transition().duration(2000).attr("cx",500)` interpolates the current x coordinate toward 500 over two seconds. A following `.transition()` starts after that transition. `.delay(200)` postpones the start. A callback registered with `.on("click", callback)` runs when the event occurs. `.interrupt()` stops the current and pending unnamed transitions on that selection; a new transition can then target the latest state.\n\nCheck the browser console, both animation endpoints, and repeated event actions. Test keyboard controls and the browser\'s reduced-motion setting. For reduced motion, show a stable meaningful result and keep interactive changes immediate.\n\nReferences: [D3 transitions](https://d3js.org/d3-transition), [D3 events](https://d3js.org/d3-selection/events), [transition interruption](https://d3js.org/d3-transition/control-flow#selection_interrupt).\n',
					projectLink:
						"https://codepen.io/junilearning/pen/36846ad022b36b072833ace22a9edbef",
					solutionLink:
						"https://codepen.io/junilearning/pen/b858a6f5c9b50333229dd36700cc4ac0"
				},
				{
					title: "Animations in JavaScript Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS10 Animations in JavaScript",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-09-jss10-animations-in-javascript-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-09-jss10-animations-in-javascript-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS11 More HTML & CSS",
			curriculum: [
				{
					title: "The Box Model",
					content:
						"Use one visible box to separate the four box-model layers: content, padding, border, and margin. Change one layer at a time and predict whether the visible box, its internal spacing, or its distance from neighboring elements changes. This keeps layout debugging concrete instead of memorizing definitions."
				},
				{
					id: "javascript-level-1-javascript-superstar-jss11-more-html-css-curriculum-the-position-property",
					aliases: ["The Position Property"],
					title: "JSS11 Project 1: Box Inception Part II",
					preserveInstructions: true,
					content:
						"The box model adds padding and border around content; margin separates the outside of a box from its neighbors. With the default `box-sizing: content-box`, a 50px-wide content box plus 4px padding and a 2px border on each side occupies 62px before margins. With `box-sizing: border-box`, the declared width includes padding and border. Measure these layers in the browser inspector before changing them.\n\nNormal flow places block elements on separate lines and allows inline-block elements to share a line. `position: relative` keeps an element's place in flow while offsets move its painted box. An absolutely positioned element leaves normal flow; its nearest positioned ancestor establishes its containing block. With no such ancestor, it uses the initial containing block. `position: fixed` normally uses the viewport; transforms on ancestors can change that relationship. A `z-index` controls stacking within its stacking context, rather than acting as one global page-wide order.\n\nRecreate the four groups from JSS9 Box Inception: six 50-by-50 boxes in a block column, six inline-block boxes, three ordinary div rows with two inline-block boxes each, and a three-row, two-cell table. Use red, orange, yellow, green, blue, and purple in that order. The div-row group demonstrates HTML grouping, not CSS Grid.\n\nAdd `Absolute Positioning`: nest the six colored 50-by-50 boxes inside one another. Give the outer containing block `position: relative`; give each colored box `position: absolute; top: 10px; left: 10px`. Predict the accumulated offsets, then measure them. Reserve at least 110px of height for the positioned group so later content does not overlap it. Change one offset, padding, or border at a time and explain the result. Test at a narrow width and 200% zoom.",
					projectLink:
						"/course-assets/javascript-level-1/more-html-css-v1/box-inception-part-2/starter/index.html.txt",
					solutionLink:
						"https://codepen.io/junilearning/pen/261c1809ad0309dd584526c73c586289"
				},
				{
					title: "JSS11 Project 2: My Hero Page",
					preserveInstructions: true,
					content:
						'Build a tribute page for a person whose work interests you. Use one `h1`, short factual paragraphs, an image with a useful text alternative, an unordered list of accomplishments, and an ordered list of dated milestones. Use headings in order: `h2` introduces sections below the page\'s `h1`. An unordered list (`ul`) groups items without a sequence; an ordered list (`ol`) communicates an order, with each item in an `li`.\n\nThe project includes the Noto Sans font and its license. Link `noto-sans.css` in the document head, then apply `font-family: "Noto Sans", sans-serif` in `styles.css`. `@font-face` names the included font; `font-family` selects it for content. The included basketball illustration can be replaced by an appropriate local image with permission to use it and an accurate `alt` value. A purely decorative image uses `alt=""`.\n\nUse flexible widths such as `max-width: 50rem; width: 100%`, and `max-width: 100%; height: auto` for the image. Include padding in declared widths with `box-sizing: border-box`. Check that paragraphs, lists, and the image fit a phone-sized viewport and remain readable at 200% zoom. Give links a visible keyboard focus style.\n\nFor the supplied LeBron James reference, the list describes selected historical achievements, not a current season\'s complete totals. Verify dates and factual claims against a primary source, name that source, and distinguish facts from personal opinions. The reference\'s dated championship milestones are 2012 and 2013 with Miami, 2016 with Cleveland, and 2020 with Los Angeles. A chosen subject can use a different set of verified milestones.',
					projectLink:
						"https://codepen.io/junilearning/pen/d959f67d5f753f31d3fea61cd4e6e8e3",
					solutionLink:
						"https://codepen.io/junilearning/pen/f148f71f0ba2807f695133ab280a5b67"
				},
				{
					title: "JSS11 Project 3: My JavaScript Art",
					preserveInstructions: true,
					content:
						'Present three D3 drawings or animations from earlier modules on one page. Give the gallery one `h1`, then give each artwork an `h2`, a short description of its JavaScript or SVG concept, and a separate container with a unique id. A title identifies a piece; its description explains what the code demonstrates. Adapt the original drawing code to select the appropriate container instead of appending every SVG to `body`.\n\nThis pack includes D3 5.16.0, matching the original gallery. Load `vendor/d3.min.js` before `script.js`. Define a separate SVG selection for each artwork so changes to one drawing do not target another. The reference uses `#rainbow`, `#shield`, and `#pacman`. Keep shared variable names distinct, or place each drawing in its own function. An SVG `viewBox="0 0 width height"` establishes drawing coordinates; CSS `max-width: 100%; height: auto` scales that drawing to the available page width.\n\nThe reference draws seven rainbow arcs, a shield of four circles and one star, and two Pac-Man arcs. An arc uses radians: multiply degrees by `Math.PI / 180`. Its inner radius sets the hole and its outer radius sets the outside edge. Keep the original positions and sizes while making the surrounding page responsive. Use the drawing\'s description as an accessible label for its SVG.\n\nFor motion preferences, `matchMedia("(prefers-reduced-motion: reduce)").matches` reports whether reduced motion is requested. Show the final rainbow immediately for that preference; otherwise retain the original staggered reveal. Verify all three complete drawings, their descriptions, and one visible code change at both narrow and wide widths.',
					projectLink:
						"https://codepen.io/junilearning/pen/b252c1398d97eda534482419d9103b87",
					solutionLink:
						"https://codepen.io/junilearning/pen/65a70df75b1168154b07ed73a09e9aa3"
				}
			],
			supplementalProjects: [
				{
					title: "JSS11 Supplemental Project 1: Berkshire Hathaway",
					preserveInstructions: true,
					content:
						"Recreate the structure of the supplied 2020 Berkshire Hathaway page as a supplemental HTML/CSS exercise: centered name and address, a list of document links in two columns, small dated update notes, and a footer separated by horizontal rules. Preserve the order and meaning of the link labels. The supplied material is a historical layout sample, so its 2020 update dates are not current announcements.\n\nA link's `href` is resolved relative to the current document unless it is an absolute URL. A path such as `reports.html` in an exported exercise would point to a missing local file. Use the full official HTTPS destination instead. The page itself renders offline; opening an external document link requires a connection. Keep the source company's website clearly distinct from the exercise's page title.\n\nThe reference retains the original table layout for comparison and marks it `role=\"presentation\"`, because its cells arrange links rather than describe tabular data. `border-spacing: 0` controls space between table cells; `vertical-align: top` aligns their content. `cellspacing` and `valign` are not CSS properties. Compare this with a semantic list styled with CSS Grid: `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem` creates two flexible columns without assigning table meaning to layout.\n\nAt narrow widths, let the link groups stack into one readable column. Use flexible widths, wrapping text, and visible keyboard focus. Check every relative destination, confirm the dates are identified as historical, and test at a phone width and 200% zoom. Keep Berkshire Hathaway supplemental; the core projects are Box Inception Part II, My Hero Page, and My JavaScript Art.",
					projectLink:
						"https://codepen.io/junilearning/pen/b24ef5d48d5f8e0fbcafee18631d0336",
					solutionLink:
						"https://codepen.io/junilearning/pen/3efe23650b01fd4f978f3f827cc1691e"
				},
				{
					title: "More HTML & CSS Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS11 More HTML & CSS",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-10-jss11-more-html-and-css-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-10-jss11-more-html-and-css-supplemental-2/solution"
				},
				{
					title: "More HTML & CSS Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS11 More HTML & CSS",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-11-jss11-more-html-and-css-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-11-jss11-more-html-and-css-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS12 Basic Website Layout",
			curriculum: [
				{
					title: "Component Libraries",
					preserveInstructions: true,
					content:
						"The local project packs include Materialize 1.0.0 CSS and its license. Link vendor/materialize.min.css in the document head before styles.css. Classes such as container, section, card-panel, striped, and centered apply documented styles to ordinary HTML. Inspect the element and computed styles to connect each class to width, padding, shadow, color, or alignment. These static projects do not need jQuery or Materialize JavaScript. Use semantic HTML for headings and tabular data, then compare the library styles with a small native CSS rule. The separate practice guide uses Materialize 2.2.2; record which supplied version is loaded instead of mixing their assumptions."
				},
				{
					title: "JSS12 Project 1: Rainbow Sections",
					preserveInstructions: true,
					content:
						"Build three groups of seven colored blocks, in this order: red, orange, yellow, green, blue, indigo, and purple. The supplied reference has 21 blocks in total. Compare seven `card-panel` divs inside a `container`, seven `section` divs inside a second `container`, and seven `section` divs that span the page outside either container. Keep the groups separate so their width and spacing can be compared.\n\nLoad the included `vendor/materialize.min.css` before `styles.css`. This is Materialize 1.0.0, matching the original project. A class is an HTML attribute: `<div class=\"section red\">Red</div>` combines the section's vertical padding with a red background. Multiple classes are separated by spaces. A `container` limits the content width and centers it; it does not add a visible border. A `card-panel` adds padding, margin, and a shadow. A `section` adds vertical padding without the card's elevation.\n\nGive the page one `h1` and each comparison an `h2`. Name each color in text as well as showing its background. Choose readable foreground colors: dark text on light colors and white text on indigo or purple. Keep the seven outside sections outside the containers so they actually reach the viewport edges. The imported starter intentionally leaves these groups unfinished.\n\nRun the page at narrow and wide widths and at 200% zoom. Confirm all three seven-color groups remain in order, the containers narrow the first two groups, and the last group fills the available width. Use the inspector to compare padding, margin, width, and shadow. These static components need CSS only; jQuery and Materialize JavaScript are not required.",
					projectLink:
						"https://codepen.io/junilearning/pen/ed06d5371daf7472425bea1c7e65e4bf",
					solutionLink:
						"https://codepen.io/junilearning/pen/3d22e6b16852d5226f7944331d44b315"
				},
				{
					title: "JSS12 Project 2: My Hobby Table",
					preserveInstructions: true,
					content:
						'Create a table about a hobby with consistent columns and rows, or use the supplied historical 2019 NFL dataset in README.md. State the table\'s subject and time period in a `caption`. The reference preserves all ten players from the original 2019 AP first-team offense example; its team names describe that season, not current rosters. The spelling is Zack Martin.\n\nUse `table` for the data, `thead` for the header group, `tbody` for the data rows, and `tr` for each row. Column headings use `<th scope="col">`; each player\'s name can use `<th scope="row">`. Other cells use `td`. Put the same fields in the same order in every row. For example, a row can contain Lamar Jackson, Baltimore Ravens, and Quarterback.\n\nLoad the included Materialize 1.0.0 CSS. `class="striped centered"` adds alternate row shading and centers the table\'s cells. The table remains readable without relying only on color: row and column labels convey the data when color or styling is unavailable. Use CSS such as `overflow-wrap: anywhere` for long names and flexible widths for the surrounding container; avoid a fixed page width.\n\nVerify the ten-row reference or the chosen complete dataset, the caption, every row/column association, and readable wrapping at phone and desktop widths and 200% zoom. Compare the striped rows with an unstyled table and identify which appearance comes from the library. The page and its supplied data work offline; opening the source link requires a connection.',
					projectLink:
						"https://codepen.io/junilearning/pen/0214806859946640ce1654c9c3ec08f0",
					solutionLink:
						"https://codepen.io/junilearning/pen/134bda10f6f852089b21d49498c47ad7"
				},
				{
					title: "Material Icons",
					preserveInstructions: true,
					content:
						'The Reverse The Rainbow pack includes the original Material Icons 3.0.1 font and license inside vendor/material-icons.css. Load that CSS, then place a documented ligature name inside an element with class material-icons, such as `<i class="material-icons" aria-hidden="true">face</i>`. Materialize adds tiny, small, medium, and large size helpers and color helpers such as red-text. A font icon is a glyph, not an image file. Keep an accessible text name for an example and a readable action label for any real button or link. Check that the bundled font loads offline and that text, source order, and meaning remain available when visual styling is unavailable.'
				},
				{
					id: "javascript-level-1-javascript-superstar-jss12-basic-website-layout-curriculum-mobile-wrappers",
					aliases: ["Mobile Wrappers"],
					title: "JSS12 Project 3: Reverse The Rainbow",
					preserveInstructions: true,
					content:
						'Build a row of seven different Material Icons in rainbow order. The original reference uses face, bug_report, fingerprint, autorenew, build, card_travel, and event_seat, colored red through purple. At large widths use Materialize\'s `large` icon size. At medium and smaller widths reverse both the order and colors and use `small` icons.\n\nLoad the included Materialize 1.0.0 CSS and `vendor/material-icons.css`. The icon CSS embeds the original Material Icons 3.0.1 font, so the page does not depend on a font service. A glyph is selected by a ligature name, for example `<i class="material-icons large red-text" aria-hidden="true">face</i>`. Keep an accessible text name for every example; icons used in real buttons or links also need a readable action label.\n\nUse two wrappers. Give the large row `row center hide-on-med-and-down` and the compact row `row center hide-on-large-only`. In this included CSS, the large row is hidden at 992px and below; the compact row is hidden at 993px and above. `large` means 6rem and `small` means 2rem. Write the compact row\'s elements in reverse DOM order so reading order agrees with what is displayed. Hidden wrappers use `display: none`, so only one set is exposed at a time.\n\nTest 992px and 993px as well as phone and wide-desktop widths. Confirm that exactly one row is visible, each row has seven loaded icon glyphs, the order reverses at the breakpoint, and icon sizes change. Let the compact row wrap at high zoom instead of clipping or hiding examples.',
					projectLink:
						"https://codepen.io/junilearning/pen/ab476697ba2b3957601555751bda65fb",
					solutionLink:
						"https://codepen.io/junilearning/pen/7da430381845aeb20d85bd435e7d8d03"
				},
				{
					title: "JSS12 Project 4: My JavaScript Art Part II",
					preserveInstructions: true,
					content:
						"Extend the three-piece JavaScript art gallery with a snowman and organize all four pieces using Materialize sections. Give the page one `h1`; Rainbow, Captain America Shield, Pac-Man, and Snowman each need an `h2`, a short description of the code, and their own container. The independently authored starter continues the supplied three-piece gallery and leaves the snowman unfinished. The original linked Part II material is a complete reference.\n\nLoad the included Materialize 1.0.0 CSS, D3 5.16.0, and then `script.js`. D3's `select` chooses a container, `append` creates an SVG element or shape, and `attr` assigns an attribute. Create the snowman's SVG inside `#snowman` with a 300 by 500 coordinate area. Give it a `viewBox` and let CSS scale its width to fit the screen.\n\nThe reference snowman has a white head centered at (150,50), radius 50; black eyes at (125,35) and (175,35), radius 5; an orange nose at (150,50), radius 5; a white middle at (150,160), radius 70; and a white lower body at (150,300), radius 100. Two brown lines form arms from (200,160) to (300,145) and (100,160) to (0,145). The smile is a black arc with inner radius 10, outer radius 15, angles 90 to 270 degrees, translated to (150,70). Convert degrees with `degrees * Math.PI / 180` before passing them to `d3.arc()`. Draw later shapes above earlier ones and keep the snowman's background dark enough to see white circles.\n\nPreserve the earlier seven-arc rainbow, four-circle shield with a star, and two Pac-Man arcs. Label each SVG with its description. For `prefers-reduced-motion: reduce`, show the rainbow's final state immediately; otherwise retain its staggered reveal. Check all four complete drawings, their descriptions, narrow-screen scaling, reduced motion, and one visible saved code change before exporting the complete project.",
					projectLink:
						"/course-assets/javascript-level-1/basic-layout-v1/my-javascript-art-part-2/starter/index.html.txt",
					solutionLink:
						"https://codepen.io/junilearning/pen/68f7db60fabe38f5ff48cf4cfa631a4c"
				}
			],
			supplementalProjects: [
				{
					title: "JSS12 Supplemental Project 1: Table Documentation Dive",
					preserveInstructions: true,
					content:
						'Extend the My Hobby Table project, or build the supplied ten-row 2019 table from README.md. Keep the caption, column headings, row headings, and historical team labels. This is supplemental practice in reading documentation and applying a focused change; it does not replace the core table project.\n\nIn the included Materialize 1.0.0 CSS, `class="highlight centered"` highlights the row under the pointer and centers the cells. Add links to the player names with an `a` element and an appropriate absolute HTTPS `href`. The reference preserves the original ten Wikipedia destinations, including the correctly spelled Zack Martin page. Use meaningful link text so a list of links still identifies each destination.\n\nA pointer hover is not keyboard focus. Keep links underlined, add a visible `:focus-visible` outline, and use `tbody tr:focus-within` to highlight the row containing the focused link. Move through every link with Tab, confirm that only the relevant row highlights, and make sure the link target and text agree. Preserve ordinary keyboard activation instead of adding a click-only handler.\n\nThe table itself renders offline; following an external source link needs a connection. Check the ten data rows or the chosen complete dataset, pointer and keyboard highlighting, readable long names, phone and desktop widths, and 200% zoom. Record which documented class or selector produces each change.',
					projectLink:
						"https://codepen.io/junilearning/pen/a08f05f994009cffe397dd6dd86dbddd",
					solutionLink:
						"https://codepen.io/junilearning/pen/0bbd6c8223876a9fa514f42411e3f37d"
				},
				{
					title: "Basic Website Layout Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS12 Basic Website Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-12-jss12-basic-website-layout-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-12-jss12-basic-website-layout-supplemental-2/solution"
				},
				{
					title: "Basic Website Layout Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS12 Basic Website Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-13-jss12-basic-website-layout-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-13-jss12-basic-website-layout-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS13 The Grid Layout",
			curriculum: [
				{
					title: "Introduction to CSS Grid",
					content:
						"Two-dimensional page layout uses rows and columns at the same time. Practice grid terminology with the starter CodePen and Grid Garden, then identify the container, grid tracks, and grid items in a small example. The key skill is predicting where an item will land before checking the browser."
				},
				{
					title: "JSS13 Project 1: Chessboard",
					preserveInstructions: true,
					content:
						"Build a square chessboard with eight rows and eight columns. Keep all 64 squares in row order. A CSS grid container controls its direct children: `display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr)` divides its available space into equal tracks. `1fr` shares the remaining space equally; it is not a fixed pixel length.\n\nAlternate light and dark squares within each row and reverse the starting color on the next row. The parity rule is `(row + column) % 2`: adjacent squares change color, including across row boundaries. Merely coloring every second child fails at the start of an even-length row. Use explicit classes or a correct row-aware selector, then check the top-left square and all four corners.\n\nGive the board a width that fits its parent and an `aspect-ratio: 1`. A useful rule is `width: min(100%, 90vmin, 42rem)` with `box-sizing: border-box` so the border stays inside that width. `vmin` follows the smaller viewport dimension. A width based only on viewport height can overflow a portrait phone. Let the parent center the board without adding fixed side tracks.\n\nThe starter leaves the board unfinished. Retain one page heading and give the finished noninteractive board a descriptive accessible name, rather than exposing 64 meaningless controls. Check all 64 squares, 32 of each color, equal cell sizes, alternating rows, no horizontal overflow, and a square board at phone and desktop widths and 200% zoom. Save one visible color change and export every companion file.",
					projectLink:
						"https://codepen.io/junilearning/pen/2573f4cfc9cb525b5940f500fd22dc79",
					solutionLink:
						"https://codepen.io/junilearning/pen/6d8b7a81d39a66ce9536c1e700f287c0"
				},
				{
					id: "javascript-level-1-javascript-superstar-jss13-the-grid-layout-curriculum-component-library-grids",
					aliases: ["Component Library Grids"],
					title: "JSS13 Project 2: The Responsive Grid",
					preserveInstructions: true,
					content:
						'Build the original Responsive Grid project with the supplied Materialize 1.0.0 CSS and Material Icons 3.0.1 font. A Materialize row contains columns whose widths are fractions of a 12-column grid. `col s4 m2 l1` means 4/12 of the row on small screens, 2/12 on medium screens, and 1/12 on large screens. In this version, medium begins at 601px and large at 993px; narrower rules continue to apply until a wider rule overrides them.\n\nFirst create 12 numbered cards in their original order. At large widths they form one row of 12; at medium widths they form two rows of six; at small widths they form four rows of three. Then create six information cards with `col s12 m6 l4`: three columns on large screens, two on medium screens, and one on small screens. A `row` clears the floated columns; a `container` sets a centered maximum width.\n\nThe six original icon names are favorite_border, code, language, functions, http, and share. Load `vendor/material-icons.css` and put a name inside an element with class `material-icons`; mark decorative glyphs `aria-hidden="true"` and keep the readable caption beside them. Use captions about learning, coding, remote study, mathematics, websites, and sharing. The bundled font renders without a font service.\n\nThe starter intentionally leaves both sets unfinished. Test the 600/601px and 992/993px boundaries as well as phone and desktop widths. Count all 12 numbered cards and all six information cards, verify row counts and source order, inspect a loaded icon glyph, and check readable contrast and wrapping at 200% zoom.',
					projectLink:
						"https://codepen.io/junilearning/pen/a3eaa0595c2a0f55991e946605e38e60",
					solutionLink:
						"https://codepen.io/junilearning/pen/9efdb71bcb845f3d9c01b14f0fd1e32e"
				},
				{
					title: "JSS13 Project 3: Pokemon Team",
					preserveInstructions: true,
					content:
						"Build a six-member Pok\u00E9mon team page with a navigation landmark, a page heading, portraits, fictional nicknames, statistics, and moveset tables. Use the supplied six species, values, moves, and local image filenames from README.md, or make a complete consistent team of your own. The supplied values are sample team data from the original exercise, not species base-stat claims or a competitive-game guide.\n\nUse a repeated card structure with a heading for the species and text for its nickname. Show HP, ATK, DEF, SPA, SPD, and SPE with a readable label and a matching decorative icon. Their expanded labels are hit points, attack, defense, special attack, special defense, and speed. A `dl` associates each statistic's `dt` label with its `dd` value. Keep the text labels even when an icon is present.\n\nPut moves in a real table with a caption and row labels. Use meaningful image alternatives that name each species. Keep the local SVG image companions with the project: each contains the retained original raster, so no external image request is needed. `object-fit: contain` and a flexible width preserve the complete portrait.\n\nMaterialize's `col s12 m6 l4` makes one team card per row on small screens, two on medium screens, and three on large screens. The included reference uses an equivalent CSS grid so cards in the same row share available width without float gaps. At 600px and below use one column, from 601px use two, and from 993px use three. Long labels and moves must wrap within a card.\n\nThe starter leaves the team unfinished; the reference supplies all six fictional nicknames, the original 36 values and 24 moves. Check those counts, six loaded portraits, table captions and labels, all breakpoint transitions, keyboard navigation, and no horizontal overflow at phone widths or 200% zoom. Change one visible nickname, save, reload, and export the complete project.",
					projectLink:
						"https://codepen.io/junilearning/pen/ae3059e723f4f66779b4cd4e2a1fc520",
					solutionLink:
						"https://codepen.io/junilearning/pen/e96eae8cd85c1fe2bbaf3b5cdd046522"
				},
				{
					title: "JSS13 Project 4: My JavaScript Art Part III",
					preserveInstructions: true,
					content:
						"Continue the four-piece D3 portfolio and add a fifth original drawing. The supplied starter already contains Rainbow, Captain America Shield, Pac-Man, and Snowman. It leaves the new drawing and card layout unfinished. The original linked Part III reference contains only those four earlier drawings; the local reference adds an explicitly authored Constellation example to complete the assignment.\n\nLoad Materialize 1.0.0 CSS, D3 5.16.0, and then script.js in that order. Keep the earlier drawings' geometry and add a new SVG inside `#constellation`. The example uses a 400 by 260 coordinate area, six circle centers at (45,190), (105,70), (180,130), (245,45), (300,150), and (355,85), and five connecting line segments. `selectAll(...).data(points).enter().append(...)` creates one circle per record; an SVG polyline can connect the same coordinates in order. The new drawing is an example, not an additional original CodePen drawing.\n\nGive every SVG a `viewBox`, a responsive width, and an accessible description. Keep one page heading and a heading and description for each piece. Use a two-column card layout on wide screens and one column on phones; alternating the drawing and text on wide rows must still leave a sensible source order. Prefer a CSS grid on each card to fixed-width spacer columns.\n\nPreserve the seven rainbow arcs, four shield circles and star, two opposite-angle Pac-Man arcs, and the snowman's circles, smile, and arms. Convert degrees with `degrees * Math.PI / 180` before passing angles to D3 arcs. Keep all drawings inside their viewBoxes. Respect `prefers-reduced-motion: reduce` by displaying the rainbow's final state immediately; the standard version can retain its staggered reveal.\n\nCheck all five drawings in the reference, the four earlier drawings and unfinished fifth area in the starter, readable descriptions, responsive cards, both motion preferences, phone widths, and 200% zoom. Save a visible drawing change and export the HTML, CSS, JavaScript, libraries, and licenses together.",
					projectLink:
						"/course-assets/javascript-level-1/grid-layout-v1/my-javascript-art-part-3/starter/index.html.txt",
					solutionLink:
						"https://codepen.io/junilearning/pen/4735eaf3e168cfb944a3daad063e287c"
				}
			],
			supplementalProjects: [
				{
					title: "JSS13 Supplemental Project 1: FakeTech.io",
					preserveInstructions: true,
					content:
						"Create a fictional company employee page using the five supplied biographies and local illustrated portraits in README.md. Each employee needs an identity heading, role and complete biography. Keep the same content fields in the same order so readers can compare the cards. The people and company belong to this exercise.\n\nLoad Materialize 1.0.0 CSS. A `card-panel` adds padding and elevation; `z-depth-2` sets a shadow and `hoverable` changes it on pointer hover. A `valign-wrapper` uses flex alignment to center children vertically, and `circle` rounds a square portrait. These appearance helpers do not turn a card into a button. Leave these informational cards as ordinary articles.\n\nUse a grid or flex layout to put a portrait beside a biography on large screens. Alternate sides on successive wide cards if desired. At narrow widths stack the portrait and text, keep the complete biography visible, and preserve meaningful reading order. Name each person with a heading; a decorative portrait beside that heading can use an empty alternative.\n\nThe starter leaves the five cards unfinished. Check Mark, Molly, Stefan, Sara, and Janet, all five loaded local portraits, complete biographies and roles, circular crops, vertical alignment, and card shadows. Verify wrapping on phones and at 200% zoom. A visual hover effect must not be the only way to discover content. Save a visible edit and export every companion file. This supplemental project practices component styling rather than replacing the core responsive-grid work.",
					projectLink:
						"https://codepen.io/junilearning/pen/ca71737eccb1712a4a653a8f883c57cf",
					solutionLink:
						"https://codepen.io/junilearning/pen/cdf88ee56f7d30ee0b1eba24ae89353e"
				},
				{
					title: "JSS13 Supplemental Project 2: Art Gallery",
					preserveInstructions: true,
					content:
						"Build a gallery containing all 12 supplied artworks, artists, local images, visual descriptions, and links from README.md. Put each artwork in a horizontal card with an image frame and a text area. Use a heading for the work, name its artist, and describe something visible in the image rather than repeating the title. Preserve each image's aspect ratio and use a meaningful alternative.\n\nUse CSS Grid to arrange four cards per row on desktop, three on tablets, and one on phones. Apply `grid-template-columns: repeat(4, minmax(0, 1fr))` at large widths, three tracks from 601px, and one below that. Within a card, use two flexible tracks for image and text; stack them when the available width is too small. `minmax(0, 1fr)` lets long content shrink and wrap instead of forcing page overflow.\n\nGive each image a visible frame, use `object-fit: contain`, and let the card grow to fit the complete description. Keep links underlined and provide a visible `:focus-visible` outline.\n\nThe starter leaves the artwork cards unfinished. Check all 12 headings and artist names, all 12 loaded images and complete descriptions, four/three/one-column reflow, correct destinations, keyboard focus, readable contrast, and no horizontal overflow at phone widths or 200% zoom. The gallery renders offline; following an external source link needs a connection. Save one visible framing change and export every companion file.",
					projectLink:
						"https://codepen.io/junilearning/pen/8a2437122b9c7eb4159c9cacccdedae8",
					solutionLink:
						"https://codepen.io/junilearning/pen/45dabf41b44570f312ef9334db333f97"
				},
				{
					title: "The Grid Layout Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS13 The Grid Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-14-jss13-the-grid-layout-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-14-jss13-the-grid-layout-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS14 Dynamic Websites with JavaScript",
			curriculum: [
				{
					title: "Manipulating HTML with JavaScript",
					content:
						"Use JavaScript to select DOM elements, read values from inputs, and change text, classes, attributes, or styles in response to events. Practice with the demo CodePen, then identify the selector, event listener, callback, and DOM update in the code."
				},
				{
					title: "JSS14 Project 1: Calculator",
					preserveInstructions: true,
					content:
						'Finish the original D3/SVG calculator. The starter draws its black case and white display, then copies the first input into that display when + is clicked. Add the missing arithmetic rather than replacing the drawing. The two HTML inputs and four operation buttons remain outside the SVG; HTML inputs appended directly to SVG do not become working form controls.\n\nRead each input\'s `value`, trim whitespace, and reject an empty string before converting with `Number(value)`. `Number("")` is zero, which would otherwise disguise an unfinished input. Check `Number.isFinite()` after conversion so words and Infinity receive a useful error. Give each input a visible label and use a button\'s click callback to read the current values, not a value captured before the user types.\n\nUse `+`, `-`, `*`, and `/` on the converted numbers. The + operator concatenates strings, so converting both inputs matters: After numeric conversion, 12 + 3 produces 15; raw strings concatenate as 123. Reject a zero divisor and a non-finite result before updating the display. A single calculation function can handle the shared validation; each D3 `.on("click", callback)` selects its operation. Each document ID must be unique.\n\nWrite the short result to the SVG text element with D3 `.text()`, and write a complete result or error to the live status paragraph. The reference rounds only the small display to ten significant digits; the status retains the full JavaScript numeric result. Decimal arithmetic uses binary floating point, so 0.1 + 0.2 may have a small representation error. Clear a prior error when a valid calculation follows it.\n\nCheck 12 + 3 = 15, 12 - 3 = 9, -4 * 2.5 = -10, and 9 / 4 = 2.25. Also test zero as an ordinary input, negative numbers, decimals, either empty input, spaces, words, Infinity, division by zero, and overflow such as 1e308 * 1e308. Use only the keyboard to reach both inputs and all buttons. Check the complete drawing and readable controls on a phone and at 200% zoom. Save an operation or visible color change, reopen the same attempt, and export every file.',
					projectLink:
						"https://codepen.io/junilearning/pen/8cb69f2696d31b929107d3798ef095aa",
					solutionLink:
						"https://codepen.io/junilearning/pen/d394480277af12f893819f3d64c5ea81"
				},
				{
					title: "JSS14 Project 2: Strength Tester",
					preserveInstructions: true,
					content:
						'Build the original carnival Strength Tester. A button click chooses an integer from 0 through 500, shows that score, and selects one of five prize images and messages. The original starter is an assignment comment; the local starter adds a page heading and companion files while leaving the application unfinished. The reference retains the original five prize types and score boundaries, with locally authored SVG illustrations.\n\n`Math.random()` returns a value from zero inclusive to one exclusive. Multiplying by 501 and applying `Math.floor()` creates the 501 possible integers 0 through 500. Multiplying by 500 never generates 500. Generate a fresh score inside the click handler, then pass that score to a separate prize-selection function. The score is a fictional game result, not a measurement of physical strength.\n\nUse one ordered if/else-if chain: 0–100 wins a yo-yo, 101–200 a frisbee, 201–300 a football, 301–400 a basketball, and 401–500 a teddy bear. Test `score <= 100`, then `<= 200`, `<= 300`, `<= 400`, and finally the remaining valid scores. Separate independent if statements can overwrite a prize; gaps or overlapping boundaries can leave a score with the wrong message.\n\nSelect the button and result elements with D3. In `.on("click", callback)`, generate the score and update the score text, image `src`, meaningful image `alt`, and prize message together. Keep the image hidden until a real prize has been chosen. Put the changing score and message in a polite live region so the update is available without moving keyboard focus from the button. Use paths such as `images/yo-yo.svg`; these companions work without an image service.\n\nTemporarily inject fixed random values or call the prize-selection function with 0, 100, 101, 200, 201, 300, 301, 400, 401, and 500. Confirm all five tiers, including the maximum, and repeat clicks to confirm updates replace earlier results. Restore normal randomness after testing. Check keyboard activation, complete images, readable messages, phone layout, and 200% zoom. Save a visible prize or color change, reopen the same attempt, and export every file.',
					projectLink:
						"https://codepen.io/junilearning/pen/afcffeca5355cf07d9882f08c90ab84c",
					solutionLink:
						"https://codepen.io/junilearning/pen/20af41540e7b43929ccf60cc88c8e8bd"
				},
				{
					title: "JavaScript Components",
					content:
						"Materialize JavaScript components need both markup and initialization code. Add the required CSS, JavaScript, and icon dependencies, select component elements with `document.querySelectorAll()`, and initialize them with the documented `M.*` call. Verify that the component still works after refreshing the page."
				},
				{
					title: "JSS14 Project 3: Dynamic Components",
					preserveInstructions: true,
					content:
						'Implement three Materialize JavaScript components on one page using Materialize 1.0.0. This example retains the original reference\'s right-side Sidenav, Modal, and five-image Carousel. The original link supplies only a completed reference; the local starter is explicitly authored and leaves the components unfinished. The supplied five Yellowstone photographs replace the original external nature thumbnails and include complete credits in SOURCES.md.\n\nLoad `vendor/materialize.min.css` and `vendor/material-icons.css` in the head. Load `vendor/materialize.min.js` before `script.js` at the end of the body. The markup must exist before initialization. Materialize 1.0.0 uses its `M` namespace and does not need jQuery. A missing library produces `M is not defined`; a selector with no matching elements silently initializes nothing. Keep each target ID unique and make a trigger\'s `data-target` match it exactly.\n\nFor the right-side Sidenav, create a `ul.sidenav` outside the nav, give it an ID, and add a trigger with `class="sidenav-trigger"` and that `data-target`. Use real links to the Photographs and Credits sections, then initialize `M.Sidenav.init(document.querySelectorAll(".sidenav"), { edge: "right" })`. Mark links that close the panel with `sidenav-close`. Track `aria-expanded` and return focus to the Menu trigger after closing; Escape must close the panel too.\n\nFor the Modal, connect a `modal-trigger` link to a `div.modal` with the same target ID. Include a `modal-content` area, an accessible dialog name, and a `modal-close` button. Initialize `M.Modal.init(document.querySelectorAll(".modal"))`. The reference opens the current photograph and its credit. Keep focus inside the open dialog, close it with Escape or Close, and return focus to Photo details. The complete photo remains visible with its aspect ratio preserved.\n\nFor the Carousel, put all five images in children with class `carousel-item` inside a `carousel` container, then call `M.Carousel.init(document.querySelectorAll(".carousel"), options)`. The reference\'s Previous and Next buttons call the instance\'s `.prev()` and `.next()` methods. ArrowLeft and ArrowRight provide the same navigation when the carousel has keyboard focus. Its `onCycleTo` callback updates the visible title and the photograph used by the dialog. Only the current slide is announced. Respect reduced motion by setting component durations to zero when the media preference requests it.\n\nCheck all three real components after a page refresh, five loaded local photos, next/previous wraparound, keyboard arrows, working sidebar destinations, dialog Close and Escape, focus return, and the correct title and credit after changing slides. Check a phone, a desktop, reduced motion, and 200% zoom. Save a visible caption or style change, reopen the same attempt, and export every companion file. Component interaction notes belong in README.md; the finished page contains the photographs and navigation.\n\nDocumentation: [Sidenav](https://materializecss.com/sidenav.html), [Modal](https://materializecss.com/modals.html), [Carousel](https://materializecss.com/carousel.html).',
					projectLink:
						"/course-assets/javascript-level-1/dynamic-components-v1/dynamic-components/starter/index.html.txt",
					solutionLink:
						"https://codepen.io/junilearning/pen/e55b7c0d570df2c9943e06395a42c974"
				},
				{
					title: "JSS14 Project 4: My JavaScript Art Part IV",
					preserveInstructions: true,
					content:
						'Continue the Part III portfolio, add another D3 drawing, and implement a working Materialize Dropdown and ScrollSpy. Preserve its earlier drawings and right-side Sidenav. The original Part IV reference contains only Rainbow, Captain America Shield, Pac-Man, and Snowman; it omits the assignment\'s new drawing and dropdown and calls Materialize without loading its JavaScript. The local continuation starter already contains those four drawings and the authored Part III Constellation. It leaves the sixth drawing, dropdown, and ScrollSpy unfinished. The local reference adds an explicitly authored Ringed Planet example.\n\nKeep Materialize CSS, Material Icons, D3 5.16.0, Materialize 1.0.0 JavaScript, and script.js in the supplied order. D3 creates the SVG geometry; Materialize controls navigation. Materialize 1.0.0 does not need the unused jQuery dependency from the original settings. Give every SVG a responsive viewBox and an accessible description. The seven rainbow arcs, shield circles and star, opposite-angle Pac-Man arcs, snowman\'s circles, smile and arms, and six-star Constellation all remain intact.\n\nBuild the sixth drawing in `#ringed-planet`. The reference uses a 400 by 260 viewBox, a planet centered at (200,130) with radius 70, an ellipse with radii 130 and 36, and a front half-ring. Draw the back ring first, then the planet, then the front ring so the overlap creates depth. Rotate the ring group by -18 degrees around the planet center and add three small stars. These coordinates are an example; a different complete original drawing also satisfies the assignment.\n\nFor the Dropdown, create a trigger whose `data-target` matches the ID of a `ul.dropdown-content`. Add a link for each artwork, then initialize `M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"), { coverTrigger: false, constrainWidth: false })`. Each link targets an existing section ID, not a placeholder hash. The Sidenav uses the same six destinations and closes when one is selected. Keep the navigation above the content without obscuring the destination heading.\n\nFor ScrollSpy, place `class="scrollspy"` and a unique ID on every artwork section. Initialize `M.ScrollSpy.init(document.querySelectorAll(".scrollspy"), { scrollOffset: offset })`, using the navigation height for the offset. ScrollSpy updates the matching link\'s active class as sections enter view; it does not create sections or links. Reinitialize after resizing so the offset follows a wrapped navigation bar. Style the active link visibly and retain ordinary anchor navigation. Keep each drawing container\'s original ID separate from its section ID.\n\nCheck five existing drawings and an unfinished sixth area in the starter; check all six complete drawings, all six dropdown destinations, working Sidenav links, and changing ScrollSpy selection in the reference. Test pointer and keyboard navigation, Escape and focus return, the first and last sections, phone and desktop widths, 200% zoom, and reduced motion. Reduced motion displays the rainbow\'s final state immediately and removes navigation animation. Save a visible drawing change, reopen the same attempt, and export the HTML, CSS, JavaScript, libraries, and licenses together.\n\nDocumentation: [Dropdown](https://materializecss.com/dropdown.html), [ScrollSpy](https://materializecss.com/scrollspy.html), [Sidenav](https://materializecss.com/sidenav.html).',
					projectLink:
						"/course-assets/javascript-level-1/dynamic-components-v1/my-javascript-art-part-4/starter/index.html.txt",
					solutionLink:
						"https://codepen.io/junilearning/pen/68807d2000d19574d4c80d354eea197f"
				}
			],
			supplementalProjects: [
				{
					title: "JSS14 Supplemental Project 1: Video Collection",
					preserveInstructions: true,
					content:
						"Create a collection of nine embedded videos using Materialize's responsive video container and grid. Include a descriptive title and a short description for each selection. The starter retains the original unfinished exercise; its nine cards still need to be built. The reference is an example collection of Nintendo Switch trailers, with three columns on wide screens and a single column on a phone. Eight original video selections remain; SOURCES.md records the verified private original fourth video and its explicitly authored replacement.\n\nLoad `vendor/materialize.min.css` and `styles.css` in the head. A responsive video embed uses a `div.video-container` containing an iframe. Use an explicit HTTPS URL such as `https://www.youtube.com/embed/_3YNL0OWio0`, with a unique, meaningful iframe title and `allowfullscreen`. Use `referrerpolicy=\"strict-origin-when-cross-origin\"`; embedded YouTube playback requires an HTTP Referer identifying the page. Keep videos user-started rather than autoplaying. Each card also needs a normal watch link so its selection can still be opened when embedded playback is restricted. Do not download or redistribute the videos.\n\nUse a `row` with `col s12 m6 l4` card columns and consistent spacing. Keep each video at least 200 by 200 CSS pixels, including at large text sizes. The supplied `.video-scroll` wrapper permits local horizontal scrolling only when the available card width falls below that player minimum; the text and page still reflow. Keep navigation and the title outside the player so neither disappears if YouTube is unavailable. Videos need no Materialize JavaScript initialization; the original unused jQuery dependency is omitted.\n\nThis exported collection needs a local HTTP server and an internet connection for embedded playback. With Python 3 installed, open a terminal in the extracted folder containing index.html and run `python3 -m http.server 8000 --bind 127.0.0.1`, then visit `http://127.0.0.1:8000`. Choose another available port if necessary and use Ctrl+C to stop this exercise's server. Opening a file:// page can make YouTube report error 153 because it lacks an HTTP Referer. The watch links remain an alternative. No npm installation is required. Offline checks can verify the layout and local files, but cannot prove external video playback.\n\nCheck all nine different players, their titles, short descriptions, matching watch links, and a phone and desktop layout. Test keyboard access, 200% zoom, a refused or offline video request, and actual playback over HTTP with a connection. Save a visible title or style change, reopen the same attempt, and export every companion file. Read SOURCES.md before changing the example selections.\n\nDocumentation: [Materialize responsive media](https://materializecss.com/media-css.html), [YouTube embed parameters](https://developers.google.com/youtube/player_parameters), [YouTube player requirements and errors](https://developers.google.com/youtube/iframe_api_reference).",
					projectLink:
						"https://codepen.io/junilearning/pen/71ea495430eac148ba6c02e837de1727",
					solutionLink:
						"https://codepen.io/junilearning/pen/449ef8b56fdf70dca74400b0401655e1"
				},
				{
					title: "JSS14 Supplemental Project 2: National Park",
					preserveInstructions: true,
					content:
						'Build a national park page using the real Materialize 1.0.0 Parallax component with two or three substantial background photographs. Include location, notable features, activities, and visitor tips. The starter retains the original unfinished parallax exercise, with two credited Yellowstone images supplied as optional local companions. The reference keeps the original two-image Yellowstone structure, corrects its missing JavaScript dependency, and replaces the fictional booking contact with official visitor information.\n\nLoad `vendor/materialize.min.css`, then `styles.css`. At the end of the body, load `vendor/materialize.min.js` before `script.js`. Materialize 1.0.0 does not need the original unused jQuery dependency. Give each photograph a `div.parallax-container` containing `div.parallax` and an img with a local source and useful alt text. Initialize after the markup exists with `M.Parallax.init(document.querySelectorAll(".parallax"), { responsiveThreshold: 0 })`. The original `edge` option belongs to Sidenav and is removed here. A missing JavaScript file gives `M is not defined`.\n\nSet a substantial responsive height on `.parallax-container`, keep the image taller than its viewport, and crop with object-fit rather than stretching the photograph. Scroll to check that the image transform changes at a different rate from the page content. Two static images alone do not complete this assignment. Keep text in readable sections between the backgrounds, rather than placing low-contrast paragraphs directly over the image. Include a visible credit for each supplied photograph and retain SOURCES.md.\n\nRespect `prefers-reduced-motion`. The reference leaves the photographs visible and static when that preference is on, destroys existing Parallax instances when it changes to reduced motion, and restores real instances when it changes back. The park information and links remain available in either mode. Source the location and features from the National Park Service, and use current official conditions and safety links rather than copying temporary closures or inventing booking details.\n\nCheck two real Parallax instances and a changing image transform while scrolling in the reference. Check the unfinished starter separately. Verify loaded images, readable location/features/activities/visitor-tip sections, accurate credits, working official links, phone and desktop layouts, 200% zoom, and static images with reduced motion. Save a visible heading or style change, reopen the same attempt, and export all companions. The park page works by opening index.html directly without a server or network; external source and visitor-information links need a connection.\n\nDocumentation: [Materialize Parallax](https://materializecss.com/parallax.html).',
					projectLink:
						"https://codepen.io/junilearning/pen/bba3ef0f2520577fb92d3fc6cc546335",
					solutionLink:
						"https://codepen.io/junilearning/pen/1d2df4b333d28c9a00f17d0fa4f37978"
				},
				{
					title: "Dynamic Websites with JavaScript Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS14 Dynamic Websites with JavaScript",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-15-jss14-dynamic-websites-with-javascript-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-15-jss14-dynamic-websites-with-javascript-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS15 Master Project",
			curriculum: [
				{
					title: "JSS15 Project 1: Master Project",
					content:
						"Build a splash page (business, restaurant, news, e-commerce, or other idea) showcasing course concepts with Materialize components. Plan to complete over about two weeks while moving on to the next course once the core is done.",
					projectLink:
						"https://codepen.io/junilearning/pen/181b8577413d710bc8e669f2740d4c5b",
					solutionLink:
						"https://codepen.io/junilearning/pen/c8520963128a302c0e6aa6738965ae43"
				},
				{
					title: "Recommended Next Course Path",
					content:
						"`JavaScript Level 2` is the normal next step after this course. A comfortable JavaScript Level 1 finish leads into deeper functions, arrays, objects, events, APIs, and data work in JavaScript Level 2 before moving into `Web Development Foundations`, which assumes stronger JavaScript fluency and shifts the emphasis from browser-only projects toward local project structure, Git, npm, servers, databases, and deployment."
				},
				{
					title: "Course Recap",
					content:
						"Review the main skills from JavaScript Level 1: variables, strings, input, math, loops, conditionals, D3/SVG drawing, HTML, CSS, responsive layout, DOM events, and Materialize components. Identify one project that best demonstrates programming logic and one project that best demonstrates page layout."
				},
				{
					title: "Master Project: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Master Project",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JSS15 Supplemental Project 1: Restaurant Splash Page",
					aliases: ["JSS15 Supplemental Project 1: Juni Eatz"],
					content:
						"Build a restaurant splash page with a menu preview, location or hours section, and at least one Materialize parallax or card layout. The page communicates a clear restaurant identity through typography, color, images, and navigation rather than only placing empty starter sections.",
					projectLink:
						"https://codepen.io/junilearning/pen/eb5dc79c245ab907ddd8f56853cb817a"
				},
				{
					title: "JSS15 Supplemental Project 2: News Homepage",
					aliases: ["JSS15 Supplemental Project 2: Juni News"],
					content:
						"Build a news-style homepage with a headline area, story cards, categories, and a Materialize slider for featured stories. Use layout choices that make article priority clear, and include enough text hierarchy that readers can distinguish headlines, summaries, and metadata.",
					projectLink:
						"https://codepen.io/junilearning/pen/910d8fa54b43a581c779c8dfab792c60"
				},
				{
					title: "JSS15 Supplemental Project 3: Jun-E-Commerce",
					content:
						"Build a small e-commerce landing page with featured products, prices or descriptions, and a Materialize carousel or card grid. The page makes product browsing clear, includes at least one call-to-action, and remains readable on a narrow screen.",
					projectLink:
						"https://codepen.io/junilearning/pen/c8048a26149f2dc5c4340a2d6cdb0ce2"
				}
			]
		},
		{
			kind: "appendix",
			title: "Pending Demo Media",
			curriculum: [
				{
					title: "Pending JavaScript Level 1 Demo Media",
					content: [
						"This course lists pending demo media below. Each entry keeps a stable static media URL so the matching file can be added without changing course links.",
						...JAVASCRIPT_LEVEL_1_ORIGINAL_MEDIA.map(
							filename =>
								`- ${staticMediaUrl(filename)}\n\n${pendingStaticMediaNotice(filename)}`
						)
					].join("\n\n")
				}
			],
			supplementalProjects: []
		}
	]
};

interface JavaScriptLevel1ModuleFlow {
	stage: string;
	estimatedTime: string;
	keyBlocks: string[];
	practiceSection: string;
	answerSection: string;
	route: string;
	standardsRoute: string;
	evidence: string;
	primaryReference: {
		label: string;
		url: string;
	};
	additionalReferences?: {
		label: string;
		url: string;
	}[];
}

const JAVASCRIPT_LEVEL_1_SEQUENCE = [
	"JSS1 Variables and Data Types",
	"JSS2 Operators and Math",
	"JSS3 For and While Loops",
	"JSS4 Combining Loops and Variables",
	"JSS5 Conditionals",
	"JSS6 Advanced Conditionals",
	"JSS7 Drawing in JavaScript",
	"JSS8 Nested Loops",
	"Check-In #1",
	"JSS9 Introduction to HTML & CSS",
	"JSS10 Animations in JavaScript",
	"JSS11 More HTML & CSS",
	"JSS12 Basic Website Layout",
	"JSS13 The Grid Layout",
	"JSS14 Dynamic Websites with JavaScript",
	"Check-In #2",
	"JSS15 Master Project"
] as const;

const JAVASCRIPT_LEVEL_1_MODULE_FLOW: Record<
	(typeof JAVASCRIPT_LEVEL_1_SEQUENCE)[number],
	JavaScriptLevel1ModuleFlow
> = {
	"JSS1 Variables and Data Types": {
		stage: "Store, inspect, and display small pieces of fictional data",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"const and let",
			"number",
			"string",
			"boolean",
			"conversion",
			"safe output"
		],
		practiceSection: "variables-types-and-private-input-case",
		answerSection: "variables-types-and-private-input-key",
		route: "Compare `const` and `let`, classify numbers, strings, and booleans, convert a fictional form value deliberately, and render the result as text. Introductory `prompt()`, `alert()`, and `printToScreen()` examples remain recognizable, while the finished route uses a labeled form and page output.",
		standardsRoute:
			"Use current JavaScript declarations and explicit conversion in a plain local HTML, CSS, and JavaScript project. Treat blocking dialogs and sandbox-only helpers as temporary scaffolds rather than the browser application model.",
		evidence:
			"The record identifies each value, intended type, declaration choice, conversion result, visible output, empty-input behavior, and one privacy choice.",
		primaryReference: {
			label: "MDN JavaScript grammar and types",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types"
		}
	},
	"JSS2 Operators and Math": {
		stage: "Make numeric rules and randomness inspectable",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"number conversion",
			"precedence",
			"arithmetic",
			"remainder",
			"random range",
			"boundary test"
		],
		practiceSection: "operators-conversion-and-randomness-case",
		answerSection: "operators-conversion-and-randomness-key",
		route: "Convert incoming values before arithmetic, use parentheses to communicate precedence, and implement one inclusive random-integer formula. Test the lower bound, upper bound, decimal input, empty input, and a value that cannot become a finite number.",
		standardsRoute:
			"Use `Number`, `Number.isFinite`, `Math.random`, and `Math.floor` directly. Keep the random rule in a named helper so the range contract can be reviewed independently from display code.",
		evidence:
			"The calculation table records the expression, predicted result, observed result, type, exact random bounds, and the response to invalid input.",
		primaryReference: {
			label: "MDN expressions and operators guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators"
		}
	},
	"JSS3 For and While Loops": {
		stage: "Select a loop from its stopping rule",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"initial state",
			"condition",
			"update",
			"for loop",
			"while loop",
			"termination"
		],
		practiceSection: "loop-range-and-stop-condition-case",
		answerSection: "loop-range-and-stop-condition-key",
		route: "Use a `for` loop for a known range and a `while` loop for a state-based stop. Predict iteration counts before running, cap all generated work, and diagnose off-by-one, missing-update, and wrong-bound failures.",
		standardsRoute:
			"Use language-native loops in a local script and keep loop work separate from DOM output. Collect results first, then render once so a teaching example does not create excessive page updates.",
		evidence:
			"The trace lists initial state, condition result, body result, update, final state, iteration count, and the exact reason the loop terminates.",
		primaryReference: {
			label: "MDN loops and iteration guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration"
		}
	},
	"JSS4 Combining Loops and Variables": {
		stage: "Extract repeated logic into named functions",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"function",
			"parameter",
			"return value",
			"accumulator",
			"generated value",
			"single purpose"
		],
		practiceSection: "functions-accumulators-and-generated-values-case",
		answerSection: "functions-accumulators-and-generated-values-key",
		route: "Turn repeated calculations and generated-value steps into small functions with parameters and return values. Keep accumulation, randomness, formatting, and page rendering in separate named operations that can be checked with fixed inputs.",
		standardsRoute:
			"Use function declarations or clearly named function expressions, local variables, explicit returns, and deterministic test inputs. Any password-style generator uses fictional samples only and is not presented as production credential generation.",
		evidence:
			"The function table states each input contract, returned value, side effect, fixed test, boundary case, and where the result enters the next step.",
		primaryReference: {
			label: "MDN functions guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions"
		}
	},
	"JSS5 Conditionals": {
		stage: "Translate a rule table into exclusive branches",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"strict equality",
			"comparison",
			"if",
			"else if",
			"else",
			"range partition"
		],
		practiceSection: "conditional-rule-table-case",
		answerSection: "conditional-rule-table-key",
		route: "Write a small rule table before coding, then implement exact comparisons and non-overlapping ranges with `if`, `else if`, and `else`. Use fictional access labels rather than implying that a browser-only comparison is a real authentication system.",
		standardsRoute:
			"Use strict equality, explicit numeric conversion, and ordered branches whose boundaries cover the intended domain exactly once. Display the selected outcome with safe text insertion.",
		evidence:
			"The case table covers each exact boundary, one value on either side, an unmatched value, invalid input, expected branch, observed branch, and correction when they differ.",
		primaryReference: {
			label: "MDN control flow and error handling guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling"
		}
	},
	"JSS6 Advanced Conditionals": {
		stage: "Compose boolean rules without hiding precedence",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"boolean",
			"AND",
			"OR",
			"NOT",
			"truthiness",
			"branch order"
		],
		practiceSection: "compound-condition-and-truthiness-case",
		answerSection: "compound-condition-and-truthiness-key",
		route: "Model compound decisions with truth tables, parentheses, and named boolean expressions. Compare deliberate booleans with truthy and falsy values, then use a FizzBuzz-style rule to expose branch-order mistakes.",
		standardsRoute:
			"Use `&&`, `||`, and `!` with explicit grouping and avoid relying on coercion when a converted boolean or number communicates the rule more clearly.",
		evidence:
			"The truth table includes every meaningful combination, expected expression result, selected branch, observed output, and one explanation of why changing branch order changes behavior.",
		primaryReference: {
			label: "MDN truthy glossary",
			url: "https://developer.mozilla.org/en-US/docs/Glossary/Truthy"
		}
	},
	"JSS7 Drawing in JavaScript": {
		stage: "Represent a visual as structured SVG",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"SVG",
			"coordinate",
			"attribute",
			"group",
			"text alternative",
			"D3 comparison"
		],
		practiceSection: "native-svg-shape-case",
		answerSection: "native-svg-shape-key",
		route: "Create and position SVG shapes with native elements or `createElementNS`, derive coordinates instead of guessing, and add a title, description, or adjacent text equivalent. Rebuild one preserved D3 example only after the native structure is understood.",
		standardsRoute:
			"Native SVG is the required route. The original drawing packs include D3 5.16.0 locally; the animation packs use D3 7.9.0. Record the supplied version before comparing D3 behavior with native SVG.",
		evidence:
			"The diagram names the SVG viewport, coordinate calculation, element and attributes, grouping rule, visible result, text equivalent, and whether the same structure works without D3.",
		primaryReference: {
			label: "MDN SVG scripting guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Scripting"
		},
		additionalReferences: [
			{
				label: "D3 7 documentation",
				url: "https://d3js.org/"
			}
		]
	},
	"JSS8 Nested Loops": {
		stage: "Assign one dimension of repeated work to each loop",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"outer loop",
			"inner loop",
			"row",
			"column",
			"work budget",
			"pattern"
		],
		practiceSection: "nested-loop-pattern-and-work-budget-case",
		answerSection: "nested-loop-pattern-and-work-budget-key",
		route: "Build text and SVG patterns by giving the outer loop responsibility for rows or groups and the inner loop responsibility for items. Calculate total work before running and cap both dimensions.",
		standardsRoute:
			"Use bounded language-native loops and one rendering pass. Keep coordinate or text generation separate from DOM insertion so the nested logic can be tested without a visual dependency.",
		evidence:
			"The grid trace records row count, column count, total iterations, first and last generated positions, output dimensions, boundary behavior, and response to an over-budget request.",
		primaryReference: {
			label: "MDN for statement reference",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for"
		}
	},
	"Check-In #1": {
		stage: "Fundamentals checkpoint after JSS1–JSS8",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"variables",
			"operators",
			"functions",
			"loops",
			"conditionals",
			"SVG"
		],
		practiceSection: "fundamentals-checkpoint-case",
		answerSection: "fundamentals-checkpoint-key",
		route: "Complete this required checkpoint after JSS8 across variables, conversion, operators, functions, loops, conditionals, SVG, and nested work. It can also be used earlier as an optional placement preview, but the verification key stays closed until an independent attempt is recorded.",
		standardsRoute:
			"Use one local browser project, native JavaScript and SVG, fixed test inputs, and a short explanation for each choice. External examples may clarify syntax but do not replace the learner's runnable result.",
		evidence:
			"The checkpoint packet contains a prediction, runnable result, boundary or error case, console check, short explanation, confidence rating, and named revisit module for every topic.",
		primaryReference: {
			label: "MDN JavaScript Guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"
		}
	},
	"JSS9 Introduction to HTML & CSS": {
		stage: "Create a semantic document before styling it",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"landmark",
			"heading",
			"label",
			"DOM tree",
			"selector",
			"source order"
		],
		practiceSection: "semantic-html-and-css-case",
		answerSection: "semantic-html-and-css-key",
		route: "Build a small document with landmarks, a logical heading order, labeled controls, and meaningful text before applying selectors and display rules. Inspect the DOM tree and preserve a useful reading order when styles are absent.",
		standardsRoute:
			"Use the HTML Living Standard, modern CSS, and native elements. Add a generic `div` or `span` only when no semantic element communicates the role.",
		evidence:
			"The structure map names every landmark, heading, control label, selector, display behavior, source-order decision, and the result with CSS or JavaScript unavailable.",
		primaryReference: {
			label: "HTML Living Standard developer edition",
			url: "https://html.spec.whatwg.org/dev/"
		}
	},
	"JSS10 Animations in JavaScript": {
		stage: "Separate interaction state from animation rendering",
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"event",
			"state",
			"update",
			"render",
			"animation frame",
			"reduced motion"
		],
		practiceSection: "events-animation-and-reduced-motion-case",
		answerSection: "events-animation-and-reduced-motion-key",
		route: "Use the original D3 SVG projects to distinguish drawing, timed transitions and event callbacks. Chain transitions for sequential motion, change multiple attributes together, and interrupt resizing before applying the latest event. Provide stable reduced-motion results and keyboard/touch controls.",
		standardsRoute:
			"The supplied projects use locally bundled D3 7.9.0. D3 selection.on handles browser events; transitions interpolate SVG attributes. CSS and requestAnimationFrame are alternatives for a later comparison, not prerequisites for these assignments.",
		evidence:
			"The interaction trace names event source, state before and after, rendered change, frame or transition stop, keyboard route, reduced-motion result, reset behavior, and console state.",
		primaryReference: {
			label: "D3 transitions",
			url: "https://d3js.org/d3-transition"
		},
		additionalReferences: [
			{
				label: "MDN prefers-reduced-motion reference",
				url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
			}
		]
	},
	"JSS11 More HTML & CSS": {
		stage: "Predict spacing, positioning, and reflow",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"box model",
			"normal flow",
			"position",
			"stacking",
			"responsive unit",
			"zoom"
		],
		practiceSection: "box-model-positioning-and-reflow-case",
		answerSection: "box-model-positioning-and-reflow-key",
		route: "Measure content, padding, border, and margin, then compare normal flow with deliberately positioned elements. Test at narrow widths and 200% zoom so decorative placement does not cover text or controls.",
		standardsRoute:
			"Prefer normal flow, flexible sizing, and modern responsive units. Use absolute or fixed positioning only for a named relationship with a tested overlap and focus-order plan.",
		evidence:
			"The layout record includes predicted and measured box size, positioning context, stacking result, narrow-width reflow, zoom behavior, focus visibility, and one corrected overlap.",
		primaryReference: {
			label: "MDN box model lesson",
			url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model"
		}
	},
	"JSS12 Basic Website Layout": {
		stage: "Build reusable page sections with a native fallback",
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"section",
			"navigation",
			"table",
			"component",
			"fallback",
			"keyboard check"
		],
		practiceSection: "component-library-and-native-fallback-case",
		answerSection: "component-library-and-native-fallback-key",
		route: "Assemble navigation, sections, data tables, and repeated content with semantic HTML and CSS first. Recreate one original Materialize component only after the native structure works, then test it with keyboard input and without the library.",
		standardsRoute:
			"Native HTML and CSS form the required route. Materialize 2.2.2 is pinned for preserved projects, initialized explicitly, and treated as an enhancement rather than the only source of structure or meaning.",
		evidence:
			"The component ledger records native element, enhanced component, library dependency, keyboard operation, label or name, narrow-width result, no-library result, and fallback content.",
		primaryReference: {
			label: "Materialize 2 getting started",
			url: "https://materializeweb.com/getting-started.html"
		},
		additionalReferences: [
			{
				label: "HTML forms standard",
				url: "https://html.spec.whatwg.org/dev/forms.html"
			}
		]
	},
	"JSS13 The Grid Layout": {
		stage: "Create responsive grids without scrambling meaning",
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"grid container",
			"track",
			"item",
			"minmax",
			"breakpoint",
			"source order"
		],
		practiceSection: "grid-source-order-and-responsive-case",
		answerSection: "grid-source-order-and-responsive-key",
		route: "Build an explicit two-dimensional grid, then replace brittle fixed columns with a responsive rule. Keep DOM and reading order logical even when visual placement changes, and verify a card or board at desktop, tablet, and narrow widths.",
		standardsRoute:
			"Use native CSS Grid as the required route. A Materialize grid remains an optional comparison, not a substitute for understanding tracks, gaps, intrinsic sizing, and source order.",
		evidence:
			"The grid record includes source order, visual order, column rule, minimum item width, overflow result, three viewport checks, keyboard sequence, and any content that required a layout revision.",
		primaryReference: {
			label: "MDN CSS Grid accessibility guidance",
			url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Accessibility"
		}
	},
	"JSS14 Dynamic Websites with JavaScript": {
		stage: "Update the DOM from explicit state and validated input",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"selector",
			"event listener",
			"input validation",
			"state",
			"textContent",
			"reset"
		],
		practiceSection: "dom-state-and-safe-rendering-case",
		answerSection: "dom-state-and-safe-rendering-key",
		route: "Read a labeled control, normalize the value, update explicit state, and render text or attributes through a named function. Test repeated actions, invalid and empty input, reset, and text containing markup characters without inserting learner text as HTML.",
		standardsRoute:
			"Use DOM selectors, `addEventListener`, form events, `textContent`, and narrow attribute or class updates. Keep state changes independent from rendering and avoid inline event handlers.",
		evidence:
			"The event table records trigger, raw input, normalized value, state before and after, visible output, safe-rendering result, repeated-action result, reset route, focus behavior, and console state.",
		primaryReference: {
			label: "MDN Document Object Model guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model"
		}
	},
	"Check-In #2": {
		stage: "Web-experience checkpoint after JSS9–JSS14",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"semantic HTML",
			"responsive CSS",
			"event",
			"state",
			"animation",
			"accessibility"
		],
		practiceSection: "web-experience-checkpoint-case",
		answerSection: "web-experience-checkpoint-key",
		route: "Complete this required checkpoint after JSS14 by building one semantic, responsive, dynamic page. It can also be used earlier as an optional placement preview, but the verification key stays closed until the learner records an independent attempt.",
		standardsRoute:
			"Use native HTML, CSS, SVG, and DOM behavior first. D3 or Materialize may enhance one preserved task only when the page keeps its content, control names, and core interaction without the library.",
		evidence:
			"The checkpoint packet covers structure, layout, interaction, dynamic state, motion preference, keyboard path, narrow reflow, safe text, reset, console output, and a named module to revisit.",
		primaryReference: {
			label: "MDN CSS and JavaScript accessibility lesson",
			url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/CSS_and_JavaScript"
		}
	},
	"JSS15 Master Project": {
		stage: "Accessible interactive-site capstone",
		estimatedTime: "8–10 sessions · 45–60 minutes each",
		keyBlocks: [
			"problem statement",
			"semantic structure",
			"state model",
			"original interaction",
			"verification",
			"demonstration"
		],
		practiceSection: "accessible-interactive-site-capstone-case",
		answerSection: "accessible-interactive-site-capstone-key",
		route: "Plan and build one focused single-page experience with meaningful content, semantic structure, responsive layout, named JavaScript functions, validated input, explicit state, and an original SVG or DOM interaction. Develop it in vertical slices and keep a no-JavaScript reading order.",
		standardsRoute:
			"Use current browser standards as the baseline. Any pinned D3 7.9.0 or Materialize 2.2.2 feature remains an enhancement with attribution, a native structural fallback, and a documented limitation.",
		evidence:
			"The final packet contains the audience and task, state and event map, browser baseline, viewport checks, keyboard and focus evidence, motion and contrast checks, input table, regression record, external-asset list, privacy choices, limitations, and a two-minute demonstration.",
		primaryReference: {
			label: "WCAG 2.2 quick reference",
			url: "https://www.w3.org/WAI/WCAG22/quickref/"
		}
	}
};

function javascriptLevel1PracticeLink(section: string) {
	return `${JAVASCRIPT_LEVEL_1_PRACTICE_PACK}#${section}`;
}

function javascriptLevel1VerificationLink(section: string) {
	return `${JAVASCRIPT_LEVEL_1_VERIFICATION_GUIDE}#${section}`;
}

function javascriptLevel1SupplementalPath(title: string) {
	if (/extension|challenge/i.test(title)) return "challenge" as const;
	return "choice" as const;
}

function renderJavaScriptLevel1References(flow: JavaScriptLevel1ModuleFlow) {
	const references = [
		`[${flow.primaryReference.label}](${flow.primaryReference.url})`,
		...(flow.additionalReferences ?? []).map(
			item => `[${item.label}](${item.url})`
		)
	];
	return references.join(", ");
}

function decorateJavaScriptLevel1Module(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow =
		JAVASCRIPT_LEVEL_1_MODULE_FLOW[
			module.title as (typeof JAVASCRIPT_LEVEL_1_SEQUENCE)[number]
		];
	if (!flow)
		throw new Error(`Missing JavaScript Level 1 flow: ${module.title}`);

	const practiceLink = javascriptLevel1PracticeLink(flow.practiceSection);
	const verificationLink = javascriptLevel1VerificationLink(
		flow.answerSection
	);
	const references = renderJavaScriptLevel1References(flow);

	return {
		...module,
		kind: "module",
		estimatedTime: flow.estimatedTime,
		keyBlocks: [...flow.keyBlocks],
		curriculum: module.curriculum.map((item, index) => ({
			...item,
			content:
				index === 0
					? `**Course flow:** ${flow.stage}. ${flow.route}

**Standards route:** ${flow.standardsRoute}

**Evidence gate:** ${flow.evidence}

**Local continuity:** Complete the [supplied browser case](${practiceLink}) before comparing it with the [verification guide](${verificationLink}). This route uses fictional inputs and local files, so CodePen, a CDN, and pending demonstration media are optional.

**Current references:** ${references}. Record the browser and viewport, and record any D3, Materialize, font, icon, media, or host version that affects the result.

${item.content}`
					: item.content,
			learningPath: "core" as const,
			...(item.projectLink
				? {
						datasetLink: item.datasetLink ?? practiceLink,
						mediaLink: item.mediaLink ?? flow.primaryReference.url
					}
				: {})
		})),
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: javascriptLevel1SupplementalPath(item.title),
			...(item.projectLink
				? {
						datasetLink: item.datasetLink ?? practiceLink,
						mediaLink: item.mediaLink ?? flow.primaryReference.url
					}
				: {})
		}))
	};
}

const javascriptLevel1ModulesByTitle = new Map(
	javascriptLevel1SourceCourse.modules.map(module => [module.title, module])
);

const javascriptLevel1CoreModules = JAVASCRIPT_LEVEL_1_SEQUENCE.map(title => {
	const module = javascriptLevel1ModulesByTitle.get(title);
	if (!module) throw new Error(`Missing JavaScript Level 1 module: ${title}`);
	return decorateJavaScriptLevel1Module(module);
});

const javascriptLevel1Appendices = javascriptLevel1SourceCourse.modules.filter(
	module => module.kind === "appendix"
);

export const javascriptLevel1Course: RawCourse = {
	...javascriptLevel1SourceCourse,
	modules: [...javascriptLevel1CoreModules, ...javascriptLevel1Appendices]
};
