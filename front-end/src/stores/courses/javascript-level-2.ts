import type { RawCourse } from "./types";
import javascriptApiResponsesReading from "@/assets/course-guides/javascript-api-projects/apis.md?raw";
import javascriptLocalDocumentsReading from "@/assets/course-guides/javascript-local-persistence/local-documents.md?raw";
import javascriptLocalMessageBoardReading from "@/assets/course-guides/javascript-local-persistence/local-message-board.md?raw";
import javascriptColorfulCards2DReading from "@/assets/course-guides/javascript-master-arrays/colorful-cards-2d.md?raw";
import javascriptColorfulCardsReading from "@/assets/course-guides/javascript-master-arrays/colorful-cards.md?raw";
import javascriptForayIntoArraysReading from "@/assets/course-guides/javascript-master-arrays/foray-into-arrays.md?raw";
import javascriptIntegratingIteratorsReading from "@/assets/course-guides/javascript-master-arrays/integrating-iterators.md?raw";
import javascriptPokemonMasterReading from "@/assets/course-guides/javascript-master-arrays/pokemon-master.md?raw";
import javascriptRandomIconsReading from "@/assets/course-guides/javascript-master-arrays/random-icons.md?raw";
import javascriptBasicShapesReading from "@/assets/course-guides/javascript-master-canvas/basic-shapes.md?raw";
import javascriptCanvasTextReading from "@/assets/course-guides/javascript-master-canvas/canvas-text.md?raw";
import javascriptJniStockPriceReading from "@/assets/course-guides/javascript-master-canvas/jni-stock-price.md?raw";
import javascriptLoopyLandscapeReading from "@/assets/course-guides/javascript-master-canvas/loopy-landscape.md?raw";
import javascriptShiningStarsReading from "@/assets/course-guides/javascript-master-canvas/shining-stars.md?raw";
import javascriptAgeMilestonesReading from "@/assets/course-guides/javascript-master-conditionals/age-milestones.md?raw";
import javascriptDepartmentStoreDiscountsReading from "@/assets/course-guides/javascript-master-conditionals/department-store-discounts.md?raw";
import javascriptSpecialNumbersReading from "@/assets/course-guides/javascript-master-conditionals/special-numbers.md?raw";
import javascriptTernaryOperatorsPracticeReading from "@/assets/course-guides/javascript-master-conditionals/ternary-operators-practice.md?raw";
import javascriptDebuggingFunctionsReading from "@/assets/course-guides/javascript-master-functions/debugging-functions.md?raw";
import javascriptFunctionsPracticeReading from "@/assets/course-guides/javascript-master-functions/functions-practice.md?raw";
import javascriptGameOfWarReading from "@/assets/course-guides/javascript-master-functions/game-of-war.md?raw";
import javascriptGeometryFunctionsReading from "@/assets/course-guides/javascript-master-functions/geometry-functions.md?raw";
import javascriptPainAtThePumpReading from "@/assets/course-guides/javascript-master-functions/pain-at-the-pump.md?raw";
import javascriptRockPaperScissorsReading from "@/assets/course-guides/javascript-master-functions/rock-paper-scissors.md?raw";
import javascriptWhichMetrocardReading from "@/assets/course-guides/javascript-master-functions/which-metrocard.md?raw";
import { buildProjectGuidance } from "./projectGuidance";
import {
	pendingStaticMediaNotice,
	staticMediaFilename,
	staticMediaUrl,
	withPendingStaticMediaNotice
} from "./staticMedia";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

const JAVASCRIPT_LEVEL_2_ORIGINAL_MEDIA = [
	"jsm_check_in_project_1.mp4",
	"jsm_check_in_project_2.mp4",
	"jsm1_project_1.mp4",
	"jsm1_project_2.mp4",
	"jsm1_project_3.mp4",
	"jsm1_project_4.mp4",
	"jsm1_project_5.mp4",
	"jsm2_project_1.mp4",
	"jsm2_project_2.mp4",
	"jsm2_project_3.mp4",
	"jsm2_supplemental_project_1.mp4",
	"jsm2_supplemental_project_2.mp4",
	"jsm2_supplemental_project_3.mp4",
	"jsm2_supplemental_project_4.mp4",
	"jsm3_project_1.mp4",
	"jsm3_project_2.mp4",
	"jsm3_project_3.mp4",
	"jsm3_supplemental_project_1.mp4",
	"jsm4_project_1.mp4",
	"jsm4_project_2.mp4",
	"jsm4_project_3.mp4",
	"jsm4_supplemental_project_1.mp4",
	"jsm4_supplemental_project_2.mp4",
	"jsm5_project_1.mp4",
	"jsm5_project_2.mp4",
	"jsm5_project_3.mp4",
	"jsm5_project_4.mp4",
	"jsm5_supplemental_project_1.mp4",
	"jsm5_supplemental_project_2.mp4",
	"jsm6_project_1.mp4",
	"jsm6_project_2.mp4",
	"jsm6_project_3.mp4",
	"jsm6_supplemental_project_1.mp4",
	"jsm6_supplemental_project_2.mp4",
	"jsm7_project_1.mp4",
	"jsm7_project_2.mp4",
	"jsm7_project_3.mp4",
	"jsm7_supplemental_project_1.mp4",
	"jsm7_supplemental_project_2.mp4",
	"jsm8_project_1.mp4",
	"jsm8_project_2.mp4",
	"jsm8_project_3.mp4",
	"jsm9_project_1.mp4",
	"jsm9_supplemental_project_1.mp4",
	"jsm9_supplemental_project_2.mp4",
	"jsm9_supplemental_project_3.mp4",
	"jsm10_project_1.mp4",
	"jsm10_project_2.mp4",
	"jsm10_project_3.mp4",
	"jsm10_supplemental_project_1.mp4",
	"jsm12_project_1.mp4",
	"jsm12_project_2.mp4",
	"jsm12_supplemental_project_1.mp4",
	"jsm13_project_1.mp4",
	"jsm13_supplemental_project_1.mp4",
	"jsm14_project_1.mp4"
] as const;

const JAVASCRIPT_LEVEL_2_PRACTICE_PACK =
	"/course-assets/javascript-level-2/javascript-level-2-practice-pack.md";
const JAVASCRIPT_LEVEL_2_VERIFICATION_GUIDE =
	"/course-assets/javascript-level-2/javascript-level-2-verification-guide.md";

function applyJavaScriptLevel2PendingMediaNotices(course: RawCourse) {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			if (!item.mediaLink) continue;

			const filename = staticMediaFilename(item.mediaLink);
			if (!filename) continue;

			item.content = withPendingStaticMediaNotice(item.content, filename);
		}
	}
}

const javascriptLevel2SourceCourse: RawCourse = {
	name: "JavaScript Level 2: JavaScript Master",
	modules: [
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content: `**Review scope:** This checkpoint brings together JavaScript functions, conditionals, random values, arrays, objects, and canvas rendering. The goal is clear reasoning about where values are stored, when code runs, and how the visible output proves the program state.

**Working pattern:** Attempt each small task as an isolated program first. When the output is wrong, name the expected value, the actual value, and the line where the state first diverges. Console output, printed page output, and canvas drawings all count as evidence when they make the program behavior visible.

**Evidence target:** A complete check-in has working code for every topic area, at least one custom test case beyond the provided prompt, and a short explanation of the bug or design choice that required the most careful reasoning.`,
					solutionLink:
						"https://codepen.io/junilearning/pen/bbb5cce14f0a1bc5c5c4b5582da67750"
				},
				{
					title: "Check-In #1: Functions & Complex Conditionals",
					content: `**Concept path:** Functions package repeatable logic, while conditionals decide which path runs for each value. This section checks whether a program can isolate one job per function and then combine those functions into a larger result.

**Practice targets:** Create \`rollDie()\` so each call returns a random integer from 1 through 6. Run it 100 times, count how often the result is 6, and print both the raw count and a short interpretation. Build \`playJackpot()\` with a ternary expression for the win/loss message, then add a sum function and an \`isOdd\` function that return values instead of only printing.

**Evidence target:** The output changes across runs because randomness is involved, but every die roll remains within range. The function calls are reusable, and the conditional logic can be checked with fixed test values before the random loop is trusted.`,
					projectLink:
						"https://codepen.io/junilearning/pen/f1b05b8f30ae178563d6ecd20e816e3f"
				},
				{
					title: "Check-In #1: Arrays",
					content: `**Concept path:** Arrays preserve ordered data, so the index, length, and loop boundaries matter as much as the values themselves. This section connects random generation to later analysis.

**Practice targets:** Fill an array with 20 \`rollDie()\` results. Log the 10th element by using index 9, count how many rolls are even, and create doubled output without losing the original roll data. Use the array length rather than hard-coded loop limits when possible.

**Evidence target:** The array contains exactly 20 values, every value is in the die range, the even count matches a manual scan of one printed sample, and the doubled values are derived from the original array rather than generated separately.`
				},
				{
					title: "Check-In #1: Objects and the Canvas",
					content: `**Concept path:** Objects group related properties under one name. Canvas drawing turns object state into visible geometry, which makes the connection between data and rendering concrete.

**Practice targets:** Create a car object with descriptive properties such as make, model, color, and year. Set up a 1200 by 1200 canvas, then build a cards array where each object stores at least x position, y position, width, height, and color. Render one card first, then render the full array with a loop.

**Evidence target:** Changing a card object's coordinates or color changes the drawing without rewriting the drawing logic. The card data and the rendering function stay separate enough that new cards can be added by changing the array.`
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content: `**Project target:** Build a 3 by 3 board where each cell randomly becomes either a square or a circle. The board represents both a data problem and a drawing problem: the program needs a way to generate the board state, render it, and decide whether every cell matches.

**Build path:** Store the board in an array or two-dimensional array before drawing. Write a rendering function that clears the canvas and redraws the full board from the current data. Write a matching check that returns true only when every cell has the same shape.

**Evidence target:** The board can redraw multiple times without leaving old shapes behind. The matching check works for a manually created all-square board, a manually created mixed board, and the random board produced by the program.`,
					projectLink:
						"https://codepen.io/junilearning/pen/c9af625a0a84cbffef3dc7891aa804f9",
					solutionLink:
						"https://codepen.io/junilearning/pen/702bf96c0927e96b0089cdc58df366d0"
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
						"https://codepen.io/junilearning/pen/bbb5cce14f0a1bc5c5c4b5582da67750"
				},
				{
					title: "Check In #1 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JavaScript Master Check-In #1",
						itemTitle:
							"JavaScript Master Check-In #1 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check In #1 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JavaScript Master Check-In #1",
						itemTitle:
							"JavaScript Master Check-In #1 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-02-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-02-check-in-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content: `**Review scope:** This checkpoint connects helper functions, event listeners, DOM updates, arrays, objects, APIs, and database vocabulary. The central question is how a browser program responds when input, events, or remote data change the available state.

**Working pattern:** Keep each feature small enough to test independently. A helper function can be checked with fixed inputs, an event listener can be checked with a visible log or page update, and an API request can be checked by inspecting the returned object before building display logic.

**Evidence target:** A complete checkpoint has at least one event-driven page change, one remote-data example, one organized data structure, and one explanation of how a value moved from input or response data into visible output.`,
					solutionLink:
						"https://codepen.io/junilearning/pen/7b72b5cd25d5372e9097f68de4b66db6"
				},
				{
					title: "Check-In #2: Helper Functions and Event Listeners",
					content: `**Concept path:** Helper functions reduce repeated code by naming one small operation. Event listeners connect browser actions to JavaScript functions, so a program can respond after the page loads.

**Practice targets:** Refactor the starter code so repeated drawing, formatting, or calculation logic lives in named helpers. Add a canvas click listener that reads the event coordinates and logs both x and y. If the canvas is positioned with CSS, account for the canvas bounding rectangle before interpreting the click location.

**Evidence target:** The refactored code has less repetition, the helper names describe their jobs, and clicking different canvas positions produces different coordinate output that matches the visible location.`,
					projectLink:
						"https://codepen.io/junilearning/pen/f6a04f3b9405ba212662f72a776bc0cd"
				},
				{
					title: "Check-In #2: APIs",
					content: `**Concept path:** An API is a structured way for one program to request data from another program. In browser JavaScript, \`fetch\` starts the request and the response must be converted to usable data before the values can be read.

**Practice targets:** Begin with the supplied PokéAPI-shaped fixture, inspect its top-level object, validate \`results\`, and display the first move name. Then optionally request \`https://pokeapi.co/api/v2/move/?limit=20\`, check \`response.ok\`, parse JSON, validate the same shape, and use an \`AbortController\` timeout. Keep loading, request, validation, state, and display code separate.

**Evidence target:** The fixture route always produces the expected first name. A successful optional request uses the same rendering path, repeated reads use the cached result, and offline, timeout, non-OK, or malformed-data cases produce a visible message without erasing the last valid state.`
				},
				{
					title: "Check-In #2: Databases",
					content: `**Concept path:** Databases store related records so programs can create, read, update, and delete persistent data. SQL queries describe what data to retrieve and how tables relate.

**Practice targets:** Define \`SELECT\`, \`WHERE\`, and \`JOIN\` using the supplied books-and-bookshelves rows. Draw a two-table schema locally, identify primary and foreign keys, predict each supplied query result, and map create, read, update, and delete to local app state. Optionally reproduce the diagram in dbdiagram after the local artifact is complete.

**Evidence target:** The schema makes the relationship and constraints visible, each query prediction matches the supplied result, CRUD examples distinguish changing stored data from merely rendering it, and no hosted database, account, or real record is required.`
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content: `**Project target:** Build a small move analyzer that counts types from a supplied PokéAPI-shaped fixture and displays the total for a form-selected type. An optional public GET refresh may replace the fixture after the local route works. The project combines resilient data loading, array/object traversal, input handling, and safe page output.

**Build path:** Validate the fixture, normalize the form value so capitalization does not break comparison, and store counts in an object where each key is a type and each value is the number of matching moves. For an optional live refresh, check status, abort after a short timeout, cache the response, validate shape, and fall back to the fixture.

**Evidence target:** The page displays correct counts for at least two types, handles unknown and empty values, remains usable offline or after malformed remote data, and includes a privacy-safe page trace naming whether fixture or live data produced the result.`,
					projectLink:
						"https://codepen.io/junilearning/pen/a320051c74a1a5baa1358818c5bca5bc",
					solutionLink:
						"https://codepen.io/junilearning/pen/ba366d22ab4a98e653a5b2bcb4affba8"
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
						"https://codepen.io/junilearning/pen/7b72b5cd25d5372e9097f68de4b66db6"
				},
				{
					title: "Check In #2 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JavaScript Master Check-In #2",
						itemTitle:
							"JavaScript Master Check-In #2 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-03-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-03-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check In #2 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JavaScript Master Check-In #2",
						itemTitle:
							"JavaScript Master Check-In #2 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-04-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-04-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM1 Fundamentals Review",
			curriculum: [
				{
					title: "Introductions & Setup",
					content: `**Setup path:** JavaScript Level 2 uses local \`index.html\`, \`styles.css\`, and \`script.js\` files as the durable browser workspace. Open the starter resource or create those three files, run the page, and confirm that JavaScript changes update visible output. CodePen remains an optional reference and quick experiment surface rather than the only place the project can run.

**Core workflow:** Render user-visible results into a semantic page element with \`textContent\` and use \`console.log()\` only for temporary diagnostic evidence. Existing \`printToScreen("Hello World")\` examples are sandbox scaffolds; identify the element and DOM update that replace that helper in a standards-based page.

**Evidence target:** The local project runs after a refresh, a small text change appears on the page, the same result remains understandable without CodePen, and the console can be opened to inspect a test value without containing private input.`,
					projectLink: "https://codepen.io/junilearning/pen/JjGrYOG"
				},
				{
					title: "Variables and Strings",
					content: `**Concept path:** Variables give names to values so a program can reuse and update information. JavaScript values commonly include numbers, strings, booleans, \`null\`, and \`undefined\`; each type behaves differently in comparisons and output.

**Practice targets:** Create examples with \`let\` and \`const\`, then inspect each value with \`typeof\`. Use \`const\` for values that are not reassigned and \`let\` for values that change. Avoid \`var\` in new code because its function-scoped behavior makes state harder to reason about.

**Evidence target:** The examples show at least one reassigned \`let\`, one protected \`const\`, one string concatenation, and one case where \`null\` and \`undefined\` mean different things.`
				},
				{
					title: "Alert and Prompt",
					content: `**Concept path:** \`alert()\` displays a blocking browser message, while \`prompt()\` collects a string from the user. Prompted input is text even when it looks like a number, so numeric calculations require conversion.

**Practice targets:** Inspect one preserved \`prompt()\` and \`alert()\` example, including cancel and blank behavior. Then replace it with a labeled form, submit event, explicit numeric conversion, an inline status message, and focus that remains in the page. Use fictional input and do not log the raw response.

**Evidence target:** The form route is keyboard operable, page output changes from the normalized value, conversion is explicit, invalid or missing input produces a clear inline fallback, and \`NaN\` or personal text does not spread through diagnostics.`
				},
				{
					title: "Conditionals",
					content: `**Concept path:** Conditionals choose a code path based on a boolean expression. In JavaScript, strict equality (\`===\`) compares value and type, while loose equality (\`==\`) performs coercion that can hide bugs.

**Practice targets:** Write an \`if\`, an \`else if\`, and an \`else\` branch for a small input decision. Compare \`"5" === 5\` and \`"5" == 5\`, then connect the result to prompt input and number conversion.

**Evidence target:** The branch order is intentional, every path can be triggered with a test input, and strict comparison is used unless the code explicitly documents a conversion.`
				},
				{
					title: "JSM1 Project 1: Finish the Lyrics",
					preserveInstructions: true,
					content: `Build a three-question guessing game using short lyric snippets, quotations, original sayings or jokes. Ask each question with prompt(), compare its answer, count correct answers and call the supplied printToScreen(text) helper to show the final score. The local pack includes index.html, styles.css, script.js, the helper and D3.

Choose one accepted word for each blank. Check that an answer is not null before trimming it and converting case: cancelling a prompt returns null. Count a cancelled, blank or unmatched answer as incorrect and continue to the next question. Increment the score only for a match; refresh to begin a new attempt.

Record the prompts, accepted words and expected scores in CASES.md. Check all-correct, all-wrong and mixed answers, case/whitespace variants, and cancellation at each question. Every attempt must ask three questions and display one final score with the correct total. Reopen the saved project to verify its files and narrow-screen result.`,
					projectLink:
						"https://codepen.io/junilearning/pen/2d400625754c49aedbb72402eed3ba8f",
					solutionLink:
						"https://codepen.io/junilearning/pen/5e36bb6a04a440e18fb502b1cd635628"
				},
				{
					title: "Loops",
					content: `**Concept path:** Loops repeat work without duplicating code. A \`for\` loop is useful when the repeat count is known, while a \`while\` loop is useful when repetition depends on a condition that may change during execution.

**Practice targets:** Print a counting sequence with a \`for\` loop, repeat input validation with a \`while\` loop, and build a small nested-loop pattern using \`i\` for the outer loop and \`j\` for the inner loop. Use \`break\` only when there is a clear stop condition that exits early.

**Evidence target:** Loop boundaries produce the intended number of iterations, the loop variable updates in the correct place, and the program cannot become infinite under the tested inputs.`
				},
				{
					title: "Math",
					content: `**Concept path:** The \`Math\` object provides standard numeric tools for randomness, rounding, and geometry. Random values become useful only after the range and rounding rules are made explicit.

**Practice targets:** Generate a random decimal, a random integer from 1 through 10, and a random integer in a custom inclusive range. Use \`Math.floor\`, \`Math.ceil\`, and \`Math.round\` on the same decimal to compare their behavior. Use \`Math.PI\` in a circle area or circumference calculation.

**Evidence target:** The random integer formula never returns a value outside the target range, and the rounding examples show why each rounding method fits a different situation.`
				},
				{
					title: "JSM1 Project 2: Double or Nothing",
					content: `**Project target:** Build a risk-and-reward coin-flip game. Each successful flip doubles the current dollars, and a losing flip ends the round with zero.

**Build path:** Start with 1000 virtual dollars. Before each flip, prompt for Y to play or N to stop; Cancel also stops and preserves the balance. Retry other entries without flipping. Use \`Math.floor(Math.random() * 2)\`: 0 means heads and doubles the balance, while 1 means tails, sets the balance to zero, and ends the game. Keep the choice, flip, and balance update separate.

**Evidence target:** A win doubles the displayed value, a loss resets the round correctly, stopping preserves the current total, and the game prints a final message for every ending path.`,
					projectLink:
						"https://codepen.io/junilearning/pen/546a7d889ffe394b3efeca62a005209c",
					solutionLink:
						"https://codepen.io/junilearning/pen/2b0624ece93522ec526afca3700ede22",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_double_or_nothing.gif"
				},
				{
					title: "Drawing in JavaScript",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: `SVG describes shapes as elements in the page, and D3 helps create or update those elements from JavaScript data. Unlike canvas, SVG shapes remain as individual DOM nodes that can be selected and styled.

Recreate the original 100 Squares project with D3: begin with one 50-by-50 square, make a row of 10, then use nested loops for 10 rows and 10 columns. Use a 1000-by-1000 SVG. Set each square's x and y positions to \`50 + column * 75\` and \`50 + row * 75\`. Choose red, green, and blue channel values from 1 through 255 and form a complete \`rgb(r, g, b)\` color string. Scale the SVG to fit narrower screens while retaining its coordinates.

**Check:** The SVG contains exactly 100 rectangles with 10 distinct x positions and 10 distinct y positions. The first square begins at (50, 50), the last at (725, 725), and every square is 50-by-50. Rerunning changes colors while preserving the grid; narrow screens retain the full drawing.

The imported \`README.md\` includes SVG setup and a worked one-square example. \`CASES.md\` supplies fixed coordinate and color checks.`,
					projectLink:
						"https://codepen.io/junilearning/pen/90973aa93a04ccb12c61f3a85280daed",
					solutionLink:
						"https://codepen.io/junilearning/pen/a057491eec4fc8ccc9e38a5fa9f727ac"
				},
				{
					title: "HTML & CSS",
					content: `**Concept path:** HTML gives page content structure, while CSS controls presentation. JavaScript can generate or modify page content, but the result remains easier to maintain when markup, style, and behavior each have a clear job.

**Practice targets:** Build the Favorite Restaurants table with columns Name, Favorite Menu Item, and Photo or Illustration. Include three real or fictional restaurant rows, give each column a header, and add descriptive alternative text to each image. Use a photo or a self-made illustration for each row. Style spacing, font size, image width, and alternating rows with CSS; keep the full table readable on a narrow screen.

**Evidence target:** The table is readable without JavaScript console output, CSS selectors are specific enough to avoid accidental global changes, and the alternating-row styling still works after adding another row.`,
					projectLink:
						"https://codepen.io/junilearning/pen/90c67c576d9b57cccffe8a34b4b42525",
					solutionLink:
						"https://codepen.io/junilearning/pen/69f1a078e1066a1d71f0fa1b7cb92850"
				},
				{
					title: "Materialize and D3 Interaction",
					preserveInstructions: true,
					content: `Create a webpage that recommends an item for the weather. The starter supplies the assignment comment and an empty page body. Materialize styles the controls, while D3 selects elements and handles events; the local pack includes the libraries and pictures needed to run the project.

Brainstorm at least five weather situations and choose an item to bring for each. Examples include rain, snow, strong wind, hot sunshine, and cool weather. Build a labeled weather control and a visible recommendation area. Use Materialize to style the control or result, then use a D3 selection and an event handler to read the chosen weather and update the recommendation text. Keep the weather-to-item choices in one mapping or conditional sequence so each situation has a deliberate result.

Record the five weather inputs and their expected recommendations. Select every situation, then switch back to one already tried; each selection must replace the previous recommendation with the matching item. Refresh the page and verify that the control and result still work. The weather choices and recommendation remain readable on a narrow screen.`,
					projectLink:
						"https://codepen.io/junilearning/pen/81d62c84dfa32d88f17d0e012229bf0c",
					solutionLink:
						"https://codepen.io/junilearning/pen/6014e92e4707defd82249fb10b43d70d"
				}
			],
			supplementalProjects: [
				{
					title: "Fundamentals Review: Extension Challenge",
					preserveInstructions: true,
					content: `Compare exact answer matching with trimmed, case-insensitive matching in a separate copy of the completed three-question game. For the first question, keep the accepted word program; answer the other two with easier and clear. Try program, PROGRAM, a space-padded program, an empty answer, a cancelled prompt and wrong.

Record predicted and observed scores for both policies in CASES.md. Keep the null check before either comparison. The reference uses trimmed, case-insensitive matching; README.md supplies the exact-policy expression and the worked comparison table. Explain which inputs each policy accepts and choose a policy for the intended game.`,
					projectLink:
						"https://codepen.io/junilearning/pen/2d400625754c49aedbb72402eed3ba8f",
					solutionLink:
						"https://codepen.io/junilearning/pen/5e36bb6a04a440e18fb502b1cd635628"
				},
				{
					title: "Fundamentals Review Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM1 Fundamentals Review",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-05-jsm1-fundamentals-review-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-05-jsm1-fundamentals-review-supplemental-2/solution"
				},
				{
					title: "Fundamentals Review Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM1 Fundamentals Review",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-06-jsm1-fundamentals-review-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-06-jsm1-fundamentals-review-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM2 Functions",
			curriculum: [
				{
					title: "Functions",
					content: `**Concept path:** Functions turn a repeated process into a named operation. Parameters are the names used inside the function, arguments are the actual values passed during a call, and return values allow the result to be reused by other code.

**Practice targets:** Write the same small calculation as a function declaration and as an arrow function. Call each function before and after its definition where JavaScript allows it, then compare the calling-order behavior. Add one example where an inner function closes over a variable from an outer scope.

**Evidence target:** Each function has one clear job, the parameter names match the meaning of the data, and at least one returned value is used in a later calculation rather than only printed.`
				},
				{
					title: "String Interpolation",
					content: `**Concept path:** Template strings make dynamic text easier to read by placing expressions directly inside backticks. This is especially useful when output combines labels, numbers, and calculated values.

**Practice targets:** Rewrite a concatenated string using embedded expressions inside backticks. Include at least one variable, one arithmetic expression, and one function call inside a template string. Compare the result to the older concatenation version.

**Evidence target:** The output text is identical to the concatenated version, but the source code is easier to scan because the sentence order matches the displayed sentence.`
				},
				{
					title: "JSM2 Project 1: Functions Practice",
					preserveInstructions: true,
					content: javascriptFunctionsPracticeReading,
					projectLink:
						"https://codepen.io/junilearning/pen/22b54271a2ed49675c512f1034c0e749",
					solutionLink:
						"https://codepen.io/junilearning/pen/5cd805c9464780ddb07004ec7feedd7b"
				},
				{
					title: "JSM2 Project 2: Which MetroCard",
					preserveInstructions: true,
					content: javascriptWhichMetrocardReading,
					projectLink:
						"https://codepen.io/junilearning/pen/7295dc0298b2f2da6af9e1287d32456a",
					solutionLink:
						"https://codepen.io/junilearning/pen/0ee1b7431e9ee2bf0befa562068702d7"
				},
				{
					title: "JSM2 Project 3: Rock Paper Scissors",
					preserveInstructions: true,
					content: javascriptRockPaperScissorsReading,
					projectLink:
						"https://codepen.io/junilearning/pen/30e42b5cf6775bbf059a3d313c96f7c5",
					solutionLink:
						"https://codepen.io/junilearning/pen/2813f8a526379aefbabc47ad2f65fcd3",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_rock_paper_scissors.gif"
				}
			],
			supplementalProjects: [
				{
					title: "JSM2 Supplemental Project 1: Geometry Functions",
					preserveInstructions: true,
					content: javascriptGeometryFunctionsReading,
					projectLink:
						"https://codepen.io/junilearning/pen/1f563eb4624314cf5b3673480ec18472",
					solutionLink:
						"https://codepen.io/junilearning/pen/b8bf00b13b1d7085a129e155c9c428eb"
				},
				{
					title: "JSM2 Supplemental Project 2: Pain at the Pump",
					preserveInstructions: true,
					content: javascriptPainAtThePumpReading,
					projectLink:
						"https://codepen.io/junilearning/pen/87b49903a68f15f9132d49b704444083",
					solutionLink:
						"https://codepen.io/junilearning/pen/0ec6f1fb939a959f455f1fb70519c29e"
				},
				{
					title: "JSM2 Supplemental Project 3: Game of War",
					preserveInstructions: true,
					content: javascriptGameOfWarReading,
					projectLink:
						"https://codepen.io/junilearning/pen/06315e2ce4772499678cc4959f8e2360",
					solutionLink:
						"https://codepen.io/junilearning/pen/96fa9d7b8f7255c42c313b2d914abc48"
				},
				{
					title: "JSM2 Supplemental Project 4: Debugging Functions",
					preserveInstructions: true,
					content: javascriptDebuggingFunctionsReading,
					projectLink:
						"https://codepen.io/junilearning/pen/789be1560455a424d23eacd04d4ac69b",
					solutionLink:
						"https://codepen.io/junilearning/pen/7afcb6feb94f958d3975a028b537b9cc"
				}
			]
		},
		{
			title: "JSM3 Complex Conditionals",
			curriculum: [
				{
					title: "Conditionals",
					content: `**Concept path:** Complex conditionals are about ordering decisions carefully. The first matching branch runs, so overlapping conditions need to be arranged from most specific to most general or split into separate checks when multiple outcomes can apply.

**Practice targets:** Build examples with simple \`if/else\`, chained \`else if\`, nested conditions, and compound boolean expressions using \`&&\` and \`||\`. Trace each example with values that hit the first branch, a middle branch, the final \`else\`, and an edge case.

**Evidence target:** Every branch has a test value, overlapping conditions are intentional, and the code avoids unreachable branches caused by a broad condition appearing too early.`
				},
				{
					title: "Ternary Operators",
					content: `**Concept path:** A ternary expression chooses between two values with \`condition ? valueIfTrue : valueIfFalse\`. It is best for short value selection, not for multi-step behavior.

**Practice targets:** Rewrite simple assignment-based \`if/else\` logic as ternary expressions. Keep standard conditionals for cases with several statements, many branches, or side effects such as printing and score updates.

**Evidence target:** The ternary version returns the same value as the original conditional, and readability is preserved because each expression fits on one understandable line.`
				},
				{
					title: "JSM3 Project 1: Ternary Operators Practice",
					preserveInstructions: true,
					content: javascriptTernaryOperatorsPracticeReading,
					projectLink:
						"https://codepen.io/junilearning/pen/a7c2ad78bc62de68676af56657849a9b",
					solutionLink:
						"https://codepen.io/junilearning/pen/b1db3868ed9880b007754b9003337700"
				},
				{
					title: "JSM3 Project 2: Department Store Discounts",
					aliases: ["JSM3 Project 2: Juni Department Store"],
					preserveInstructions: true,
					content: javascriptDepartmentStoreDiscountsReading,
					projectLink:
						"https://codepen.io/junilearning/pen/b3de9678fa8b77aae5cc988f74bd086e",
					solutionLink:
						"https://codepen.io/junilearning/pen/d37942e57460093f20ee6217402d4ba7"
				},
				{
					title: "JSM3 Project 3: Special Numbers",
					preserveInstructions: true,
					content: javascriptSpecialNumbersReading,
					projectLink:
						"https://codepen.io/junilearning/pen/1be13919321ab5708564a8a7ca928226",
					solutionLink:
						"https://codepen.io/junilearning/pen/2ccb91adaa2536ecc746e938b9411171"
				}
			],
			supplementalProjects: [
				{
					title: "JSM3 Supplemental Project 1: Age Milestones",
					preserveInstructions: true,
					content: javascriptAgeMilestonesReading,
					projectLink:
						"https://codepen.io/junilearning/pen/8b95795088fd04a2a6b77fba56416332",
					solutionLink:
						"https://codepen.io/junilearning/pen/a85d4be8f2f94812a0357dae2a1d1e00"
				},
				{
					title: "Complex Conditionals Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM3 Complex Conditionals",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-07-jsm3-complex-conditionals-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-07-jsm3-complex-conditionals-supplemental-2/solution"
				},
				{
					title: "Complex Conditionals Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM3 Complex Conditionals",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-08-jsm3-complex-conditionals-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-08-jsm3-complex-conditionals-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM4 Canvas",
			curriculum: [
				{
					title: "The Canvas API",
					content: `**Concept path:** The Canvas API draws pixels into a rectangular coordinate space. The origin is the top-left corner, x increases to the right, and y increases downward. Unlike SVG, canvas does not preserve each drawn shape as a separate page element.

**Practice targets:** Create a canvas element, set width and height, retrieve the 2D context, and draw simple test marks at known coordinates. Clear the canvas and redraw to verify that the current frame is fully controlled by the code.

**Evidence target:** The coordinate grid is visible through test marks, shapes appear at expected positions, and changing the canvas size or drawing coordinates produces predictable movement.`
				},
				{
					title: "JSM4 Project 1: Basic Shapes",
					preserveInstructions: true,
					content: javascriptBasicShapesReading,
					projectLink:
						"https://codepen.io/junilearning/pen/7bdedd0b00112751b87d288e4b8120b5",
					solutionLink:
						"https://codepen.io/junilearning/pen/6d083a06497b47a62825f3d2c205813e"
				},
				{
					title: "JSM4 Project 2: Shining Stars",
					preserveInstructions: true,
					content: javascriptShiningStarsReading,
					projectLink:
						"https://codepen.io/junilearning/pen/fa66f3594a65a54d562d3932d97e2cb7",
					solutionLink:
						"https://codepen.io/junilearning/pen/425a78d7d054dfda21d4242e818f64ba"
				},
				{
					title: "Writing Text on the Canvas",
					preserveInstructions: true,
					content: javascriptCanvasTextReading,
					projectLink:
						"https://codepen.io/junilearning/pen/9355a832c485b33c747b6c600f2d13ae",
					solutionLink:
						"https://codepen.io/junilearning/pen/1c3ffebb91e5c060c6b0ba4ae4df8275"
				}
			],
			supplementalProjects: [
				{
					title: "JSM4 Supplemental Project 1: Loopy Landscape",
					preserveInstructions: true,
					content: javascriptLoopyLandscapeReading,
					projectLink:
						"https://codepen.io/junilearning/pen/7911fd2b7b0ff50be9320b0c069f0613",
					solutionLink:
						"https://codepen.io/junilearning/pen/d704fa037c5f913792b1df06c8fddd6d"
				},
				{
					title: "JSM4 Supplemental Project 2: JNI Stock Price",
					preserveInstructions: true,
					content: javascriptJniStockPriceReading,
					projectLink:
						"https://codepen.io/junilearning/pen/aa96160a1e7c1d1bdac74cfe5e6a9333",
					solutionLink:
						"https://codepen.io/junilearning/pen/1d48af84b840e8d7a72fd02e82de9f28"
				},
				{
					title: "Canvas Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM4 Canvas",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-09-jsm4-canvas-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-09-jsm4-canvas-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM5 Arrays and Iterators",
			curriculum: [
				{
					title: "Arrays",
					content: `**Concept path:** Arrays store ordered collections. Index 0 is the first element, \`length\` counts the elements, and array methods can either leave the original array unchanged or mutate it directly.

**Practice targets:** Read and reassign values by index, add and remove values with \`push\` and \`pop\`, and compare \`slice\` with \`splice\` on the same sample array. Print the original and changed arrays after each operation.

**Evidence target:** The output shows which operations mutate the original array, which return a new array, and how off-by-one errors appear when index and length are confused.`
				},
				{
					title: "JSM5 Project 1: Foray into Arrays",
					preserveInstructions: true,
					content: javascriptForayIntoArraysReading,
					projectLink:
						"https://codepen.io/junilearning/pen/96047a35895a6620240bd2ce171a71ec",
					solutionLink:
						"https://codepen.io/junilearning/pen/6925d98f7583227a4c1c65996a10cf40"
				},
				{
					title: "For-Of and For-Each Iterators",
					content: `**Concept path:** \`for...of\` loops iterate directly over values, while \`forEach\` runs a callback once for each element. Both are useful when the code needs every value, but they differ in syntax and control flow.

**Practice targets:** Print the same array with a classic index loop, \`for...of\`, and \`forEach\`. Add a callback that uses a variable from the surrounding scope so closure behavior is visible. Compare which loop form is easiest when the index is needed.

**Evidence target:** The three loop styles produce the same value order, the callback example uses outside state intentionally, and the chosen loop form matches whether the task needs values only or values plus indices.`
				},
				{
					title: "Advanced Iterators",
					content: `**Concept path:** \`map\`, \`filter\`, and \`reduce\` express common transformations. \`map\` changes each element into a new value, \`filter\` keeps matching elements, and \`reduce\` combines all elements into one result.

**Practice targets:** Use \`map\` to double numbers, \`filter\` to keep values divisible by a chosen number, and \`reduce\` to calculate a sum. Print the original array after each operation to confirm whether it changed.

**Evidence target:** Each iterator has a clear input array and output value, the callback return value is correct for the method, and \`reduce\` includes an explicit starting value when that makes the result safer.`
				},
				{
					title: "JSM5 Project 2: Integrating Iterators",
					preserveInstructions: true,
					content: javascriptIntegratingIteratorsReading,
					projectLink:
						"https://codepen.io/junilearning/pen/2e76b16dbd71552eeb1179b45b57ae2d",
					solutionLink:
						"https://codepen.io/junilearning/pen/2d9117dd9b2d44b478d8155655c7bb9b"
				},
				{
					title: "JSM5 Project 3: Colorful Cards",
					preserveInstructions: true,
					content: javascriptColorfulCardsReading,
					projectLink:
						"https://codepen.io/junilearning/pen/b167fc3da0e85d5ff65158f799658566",
					solutionLink:
						"https://codepen.io/junilearning/pen/03f3b4a97545b4fcec50aa6b11ab4188"
				},
				{
					title: "Two-Dimensional Arrays",
					content: `**Concept path:** A two-dimensional array is an array whose elements are also arrays. It is useful for grid data because values can be addressed by row and column.

**Practice targets:** Create a small 2D array manually, access values with \`arr[row][col]\`, then generate a 12 by 12 multiplication table with nested loops. Print row and column labels so the grid meaning is clear.

**Evidence target:** The multiplication table has the correct dimensions, row and column positions match the expected products, and the nested loop variables are not accidentally swapped.`
				},
				{
					title: "JSM5 Project 4: Colorful Cards in 2D",
					preserveInstructions: true,
					content: javascriptColorfulCards2DReading,
					projectLink:
						"https://codepen.io/junilearning/pen/1dce247c86d866c1f33a6dce86511c71",
					solutionLink:
						"https://codepen.io/junilearning/pen/54cadf32718bc4b635e9b82ea67a7a7f"
				}
			],
			supplementalProjects: [
				{
					title: "JSM5 Supplemental Project 1: Pokemon Master",
					preserveInstructions: true,
					content: javascriptPokemonMasterReading,
					projectLink:
						"https://codepen.io/junilearning/pen/61d80971229e4f85126de1fcfb54b1d8",
					solutionLink:
						"https://codepen.io/junilearning/pen/03693f4763858d7d7c10a34186e030f3"
				},
				{
					title: "JSM5 Supplemental Project 2: Random Icons",
					preserveInstructions: true,
					content: javascriptRandomIconsReading,
					projectLink:
						"https://codepen.io/junilearning/pen/e3ae971ad6fd35c3c0829208cb049099",
					solutionLink:
						"https://codepen.io/junilearning/pen/f163e56c8fa75a482877d789d08fc784"
				},
				{
					title: "Arrays and Iterators Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM5 Arrays and Iterators",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-10-jsm5-arrays-and-iterators-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-10-jsm5-arrays-and-iterators-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM6 Objects and Properties",
			curriculum: [
				{
					title: "Objects",
					content: `**Concept path:** Objects store related values as key-value pairs. They are useful when several pieces of information describe the same thing, such as one business, one player, one card, or one animated shape.

**Practice targets:** Create objects with string, number, boolean, and array properties. Read properties with dot notation and bracket notation, add a new property after creation, and update an existing property. Compare object organization with parallel arrays to see why named properties make code easier to read.

**Evidence target:** The same object can be printed, updated, and passed into a function. The function reads named properties rather than relying on the order of separate arrays.`
				},
				{
					title: "JSM6 Project 1: Small Talk",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: `Create exactly two declared variables, \`aboutMe\` and \`aboutYou\`, both objects. Give both at least five corresponding properties, including string, integer and boolean values. Assign prompted input directly to the second object's properties. Keep working values in those properties; use ternary expressions for simple comparison messages.

The supplied path compares six fictional profile fields: name, city, age, school, favoriteSubject and pineappleOnPizza. Use Riley, Oakville, 20, Example School, coding and true for the fixed profile. Request the other profile's fields in that order, then display a summary with \`textContent\`. A custom profile may retain the original five-property minimum and document corresponding examples.

Trim text and compare city, school and subject without case differences. Cancel or blank input skips that field and continues. A completed age is a whole number from 0 through 120. Normalize pizza answers yes/no to boolean values. Report other age or pizza answers and mark the field skipped. The imported \`README.md\` supplies the complete input rules and worked cases; \`script.js\` retains the original blank assignment area.

**Complete when:** The two objects have corresponding keys and correctly typed completed values; each comparison changes for matching versus differing input. Show a matching run, a differing run, whitespace/case input, invalid input, and cancellation at each question without stopping later questions or displaying \`null\`/\`NaN\`. Explain why a skipped field differs from age zero or a false pizza preference.`,
					projectLink:
						"https://codepen.io/junilearning/pen/c8c02ee2db01eeb4c5f408d9a1f58815",
					solutionLink:
						"https://codepen.io/junilearning/pen/0ed9be7b36e44c36de057a37265095a3"
				},
				{
					title: "For-In Iterator",
					content: `**Concept path:** A \`for...in\` loop iterates over an object's property names. It is useful when the exact keys may vary or when an object needs to be displayed without manually listing every property.

**Practice targets:** Print every key and value in a sample object. Add a property and rerun the same loop to prove the display logic adapts. Compare this with looping through an array using \`for...of\`.

**Evidence target:** The loop output includes all current object properties, newly added properties appear without changing the loop body, and array iteration is kept separate from object-key iteration.`
				},
				{
					title: "JSM6 Project 2: My Favorite Businesses",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: `Create an array containing at least three business objects. Each object needs a name plus at least three other properties; one must be a products array containing at least three entries. Iterate over the objects and their product arrays. Use one or two \`printToScreen()\` calls per business to describe every property in one or two sentences.

Use these fictional records for the supplied four-key path. Another dataset may keep the original minimums and document corresponding expected results.

\`\`\`json
[
  {
    "name": "Cedar Trail Outfitters",
    "location": "Fairhaven",
    "CEO": "Rowan Patel",
    "products": [
      "Daypack",
      "Trail Bottle",
      "Rain Shell"
    ]
  },
  {
    "name": "Sunrise Bakery",
    "location": "Mapleton",
    "CEO": "Avery Kim",
    "products": [
      "Sourdough",
      "Blueberry Muffin",
      "Cinnamon Roll"
    ]
  },
  {
    "name": "Harbor Books",
    "location": "Lakeside",
    "CEO": "Morgan Reed",
    "products": [
      "Mystery Novel",
      "Nature Guide",
      "Sketchbook"
    ]
  }
]
\`\`\`

Print a location/CEO sentence and a products sentence for each object. All property values are nonempty strings except the products array. The imported \`README.md\` and \`CASES.md\` supply complete inputs and six expected paragraphs. The blank starter retains the original assignment and supplied display helper.

**Complete when:** All three business descriptions include every property and all products in array order. Adding a fourth valid object produces eight paragraphs without another hard-coded print call; changing a property or product changes its corresponding summary. Explain which loop visits businesses and which visits products.`,
					projectLink:
						"https://codepen.io/junilearning/pen/bcc6527a03ffb7ca42b705ff3f3910dd",
					solutionLink:
						"https://codepen.io/junilearning/pen/c694262e464e83912c601ad1875d6cd2"
				},
				{
					title: "Animations in the Canvas",
					contentKind: "reading",
					preserveInstructions: true,
					content:
						"The original worked example animates one black square on an 800-by-500 canvas. The square is 50 units wide and high, with its top at y = 50. Its state is stored in x and direction; move returns x + 1 when the direction is right and x - 1 otherwise.\n\nEach moveSquare call clears the whole canvas, draws at the current x, updates x, changes direction when the updated position reaches 0 or 500, and schedules the next call with requestAnimationFrame. Calling moveSquare once starts one animation chain.\n\n**Worked trace:** The first call draws at x = 0, then updates x to 1. A call drawing at 499 updates x to 500 and selects left. The next call draws at 500 and updates to 499. The later call drawing at 1 while moving left updates to 0 and selects right; the next draw is at 0. The turning positions are 0 and 500, even though the canvas extends to 800.\n\nClearing before every draw removes the previous square. Updating after drawing determines which position appears in the current frame. This example moves one unit per callback.",
					projectLink: "https://codepen.io/junilearning/pen/zYBjpZE"
				},
				{
					title: "JSM6 Project 3: Inflate and Deflate",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					content:
						'Create a ball object with x, y, radius and color. Animate it growing to one size, changing color, shrinking to another size, then repeating.\n\n**Canvas setup:** Add `<canvas id="my-canvas"></canvas>` in HTML. In JavaScript, obtain that element with `document.getElementById("my-canvas")` and its 2D context with `getContext("2d")`. The starter has empty HTML/CSS and a JavaScript entry area; no external library is needed.\n\n**Build:** Write drawBall to begin a path, set the fill color, draw a full circle from the ball properties and fill it. Write inflate and deflate to change radius and color. In one pumpBall loop, clear the previous frame, select the phase, update the ball, draw it and schedule the next callback with requestAnimationFrame. Start that loop once.\n\n**Worked reference:** The canvas is 1000 by 800. The ball begins at (300,300), radius 20, green. Inflation adds 5 and uses green; deflation subtracts 5 and uses red. A separate inflating boolean stores the phase. The loop switches to deflation when the current radius is greater than 200 and to inflation when it is less than 10, then performs the update.\n\nThe first drawn radius is 25. Near the upper turn, rendered states are 200 green,205 green,200 red. Near the lower turn, they are 10 red,5 red,10 green. Those strict comparisons happen before a 5 unit step, so the reference\u2019s actual extrema are 5 and 205. A version intended to stop exactly at 10 and 200 needs explicit clamping or a different switching rule.\n\n**Check:** Show both colors and both direction changes over repeated cycles. Keep the center fixed, keep the radius positive and bounded, and clear the previous frame. Explain the reference\u2019s first drawn radius and both three-frame turn traces.',
					projectLink:
						"https://codepen.io/junilearning/pen/d0195323eaa77fa2a273961fa3df61c3",
					solutionLink:
						"https://codepen.io/junilearning/pen/20f860c221cac7107010e0299f47b953"
				}
			],
			supplementalProjects: [
				{
					title: "JSM6 Supplemental Project 1: My Favorite Businesses II",
					preserveInstructions: true,
					content: `Extend My Favorite Businesses into a searchable directory. Copy at least three business objects, retaining name, location, CEO and products. Add logo_image and display_image. This optional project practices object data, Materialize autocomplete and D3 rendering.

**Build:** Complete the local starter’s business array and renderBusiness function. The included HTML/CSS, libraries and six local example images run offline. Generate autocomplete names and logos from the same array. Choosing a suggestion or submitting Show business renders one card from the selected object.

**Input rules:** Trim surrounding spaces and use exact names. Hide the previous card and show “No business found.” for blank or unknown input. Render data as text. Show an image fallback if a display image fails.

**Worked inputs:** Cedar Trail Outfitters → Fairhaven, Rowan Patel, Daypack/Trail Bottle/Rain Shell. Sunrise Bakery → Mapleton, Avery Kim, Sourdough/Blueberry Muffin/Cinnamon Roll. Harbor Books → Lakeside, Morgan Reed, Mystery Novel/Nature Guide/Sketchbook. These are fictional records.

**Check:** Choose an autocomplete result; submit every name, then No Such Business and blank input; change a display image to images/missing.svg. The current card, clear no-match state and image fallback should remain usable without exceptions. The imported \`README.md\` and \`CASES.md\` include setup and all expected results. Save, reopen and export the completed project.`,
					projectLink:
						"https://codepen.io/junilearning/pen/50854534e6dccd9c7bedc0a2d01aded7",
					solutionLink:
						"https://codepen.io/junilearning/pen/7cbfe6e04babe21bb34a6d6af1028f57"
				},
				{
					title: "JSM6 Supplemental Project 2: Circle March",
					preserveInstructions: true,
					content: `Create an array of circle objects and animate them diagonally from the top left toward the bottom right. Store x, y, radius and color in each object; wrap each coordinate at its own canvas boundary.

**Setup:** Add \`<canvas id="canvas" width="500" height="200"></canvas>\` in HTML. In JavaScript, obtain that element with \`document.getElementById("canvas")\` and its drawing context with \`getContext("2d")\`. The original starter has empty HTML/CSS and a JavaScript comment area. No external library is needed.

**Build:** Draw each object as a filled circle using its properties. In one animation loop, clear the previous frame, update every circle’s coordinates, apply horizontal and vertical wrapping, draw all circles and schedule the next callback with requestAnimationFrame. Start the loop once.

**Worked reference:** The canvas is 500 by 200. Nested loops create 25 columns and 10 rows: x = column × 20, y = row × 20, radius = 5. Each of the 250 circles receives an RGB color once during setup. Every frame adds 1 to both x and y. When x is greater than 500, subtract 500; when y is greater than 200, subtract 200. The reference uses fixed increments; it has no velocity property.

The first drawn positions include (1,1) and (481,181). For the circle that begins at (480,180), frame 20 draws (500,200) and frame 21 draws (1,1). The strict greater-than rules retain the boundary coordinate for one frame. A circle may be partly clipped at an edge because its radius is 5.

**Check:** Use the worked inputs to trace both coordinate updates and both wrap conditions. Verify the whole array is drawn each frame, colors remain attached to their circles, the old frame is cleared, and only one callback chain runs through repeated wraps.`,
					projectLink:
						"https://codepen.io/junilearning/pen/7ac4e84b6d1ce34caa732bc0945c6255",
					solutionLink:
						"https://codepen.io/junilearning/pen/abdb1b2dadb02ac244d8cf862bd9b321"
				},
				{
					title: "Objects and Properties Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM6 Objects and Properties",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-11-jsm6-objects-and-properties-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-11-jsm6-objects-and-properties-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM7 Helper Functions and Event Listeners",
			curriculum: [
				{
					title: "Helper Functions",
					content: `**Concept path:** Helper functions keep a program understandable by giving a name to repeated or low-level work. A good helper has one purpose, a clear input contract, and a result that the caller can use.

**Practice targets:** Find repeated drawing or formatting code, extract it into helper functions, and replace the copied code with calls. Use names that describe the result, such as \`drawCard\`, \`isInsideRectangle\`, or \`formatScore\`.

**Evidence target:** The refactored program produces the same visible result as before, but changing one helper updates every matching use case.`
				},
				{
					title: "JSM7 Project 1: Refactory",
					preserveInstructions: true,
					content: `**Project target:** Refactor the working widget factory into helper functions while keeping the same two reports. The original HTML and CSS panels are empty; the results are JavaScript console objects.

**Inputs and expected results:** A heavy widget has name "heavy" and weight 500; a standard widget has name "standard" and weight 100. The first report contains two separate heavy widget objects and totalWeight 1000. The second contains three separate standard widget objects and totalWeight 300. Each report has a widgets array and totalWeight number. Preserve report order, widget order, names, weights and totals.

**Build path:** Run the working starter and record both reports. Extract a helper that creates a new widget from a model's name and weight. Extract an assembly helper that accepts a model and count, creates a fresh report, calls the widget helper once per loop iteration, pushes each new widget and accumulates its weight, then returns the report. Replace the two copied factory blocks with calls for two heavy widgets and three standard widgets. Returning a report lets the caller decide when to log or reuse it.

**Worked check:** Two heavy widgets weigh 500 + 500 = 1000; three standard widgets weigh 100 + 100 + 100 = 300. A zero-count call returns an empty widgets array and totalWeight 0. Each call creates its own report and each produced widget is a separate object; editing one produced widget must preserve the model and its neighbors.

**Local files:** Open the selected source in the site IDE after accepting the import. Open index.html to run the exported files without a server. README.md explains the files and CASES.md supplies the complete expected reports. The local report viewer displays the same logged objects on the page; script.js contains the factory work.

**Completion evidence:** Compare the starter's and refactored program's two reports by their data. JSON object property order may differ; array order and every value must match. Show one additional model/count call without copying another assembly loop, and explain which helper creates a widget and which helper assembles a report.`,
					projectLink:
						"https://codepen.io/junilearning/pen/3a1383fc8a60d0ff0f55419c9b4940fe",
					solutionLink:
						"https://codepen.io/junilearning/pen/4e1986a769365ecdef09ebeea1144a4f"
				},
				{
					title: "Mouse Events",
					content: `**Concept path:** Mouse events carry information about what happened and where it happened. Canvas programs usually need to translate page coordinates into canvas coordinates before deciding what was clicked.

**Practice targets:** Add \`click\`, \`mousedown\`, and \`mouseup\` listeners to a canvas. Log event coordinates, convert them relative to the canvas, and display the converted coordinates on the page or console.

**Evidence target:** Clicking different canvas positions produces different converted coordinates, and the program distinguishes a press, release, and full click.`
				},
				{
					title: "JSM7 Project 2: Which Card",
					preserveInstructions: true,
					content: `**Project target:** Add a click handler to the five-card drawing so each selected card logs its color. The local starter supplies the drawing prerequisite and leaves the handler unfinished.

**Drawing inputs:** Use \`<canvas id="my-canvas"></canvas>\`, its 2D context and a 1200-by-800 drawing size. The colors, in order, are green, red, blue, yellow and cyan. Card i has x = i * 200, y = 150, width = 150 and height = 100. Left edges are 0, 200, 400, 600 and 800, with 50-unit gaps.

**Build path:** Read \`canvas.getBoundingClientRect()\` and convert x = (event.clientX - rect.left) * canvas.width / rect.width and y = (event.clientY - rect.top) * canvas.height / rect.height. This handles offsets, scrolling and responsive scaling. Match both coordinates against the drawing geometry: left/top included, right/bottom excluded. Log the matched color once; gap or background clicks log no color.

**Worked cases:** Centers (75,200), (275,200), (475,200), (675,200) and (875,200) select the palette in order. (1,151) selects green; (150,200), (175,200) and (75,260) select none. Repeat centers and gaps after resizing or scrolling.

**Local files and evidence:** Accept the selected source import in the site IDE. Open index.html to run the exported files without a server. README.md gives the setup and mapping; CASES.md supplies fixed cases. The viewer mirrors console colors in its Click log. Show correct centers, edges, gaps and background results on a narrow or scrolled page.`,
					projectLink:
						"https://codepen.io/junilearning/pen/88140a4225b8cfb5468e91fbccfaa100",
					solutionLink:
						"https://codepen.io/junilearning/pen/1e1ad471f376b1364cd157bd9c96f9ab"
				},
				{
					title: "Key Events",
					content: `**Concept path:** Keyboard events let a browser game respond to pressed and released keys. For smooth movement, the program usually tracks which keys are currently active rather than moving only once per key press.

**Practice targets:** Add \`keydown\` and \`keyup\` listeners, record left and right arrow state, and compare older numeric key codes with modern key names such as \`ArrowLeft\` and \`ArrowRight\`.

**Evidence target:** Pressing a key changes stored input state, releasing it clears that state, and the program can handle holding a key down for repeated movement.`
				},
				{
					title: "JSM7 Project 3: Paddle",
					preserveInstructions: true,
					content: `**Project target:** Build a keyboard-controlled black paddle on a 500-by-500 canvas. The local starter supplies the canvas, model and drawing loop; complete the input handlers and movement helper.

**Input and geometry:** The paddle starts at (0,0), measures 100 by 20 and moves 10 logical units per animation frame. Focus the canvas before using Left or Right. Track ArrowLeft and ArrowRight on keydown/keyup, prevent their default action while focused, and clear held state when the canvas/window loses focus or the document becomes hidden.

**Build path:** Compute direction as Number(right) - Number(left). Add direction * speed to x, then clamp x between 0 and canvas.width - paddle.width. Both directions held cancel. Update before clearing and drawing each frame. Key release leaves the paddle at its current position.

**Worked checks:** From 200, one left frame gives 190 and one right frame gives 210. From 395, right gives 400; from 5, left gives 0. Holding either direction cannot move past 0 or 400. Both keys held at 200 leave 200. Releasing a key or leaving the page stops movement.

**Local files and evidence:** Accept the selected source import in the site IDE. Open index.html to run the exported files without a server. README.md explains the state and frame model; CASES.md supplies fixed checks. Show both directions, both limits, release and focus-loss behavior, and explain how the loop uses key state.`,
					projectLink:
						"https://codepen.io/junilearning/pen/8ccc67de1bc03e5f2c81f78a411adee1",
					solutionLink:
						"https://codepen.io/junilearning/pen/f633db1559cc122a943d0a52bcf74ebc"
				}
			],
			supplementalProjects: [
				{
					title: "JSM7 Supplemental Project 1: Coastal Cruise",
					preserveInstructions: true,
					content: `**Project target:** Use seven helper functions to register named passengers in numbered seats until a ship is full. Set maxSeats to a positive whole number, initially 2. Each seat is a separate {name:"",open:true} object.

**Helper contracts:** populateSeats creates the seat array. isOpen checks a valid zero-based seat index. registerSeat validates the name and index, rejects occupied seats without overwriting them, and returns whether registration succeeded. getNameAndNum prompts for a name and a one-based seat number, or returns null on Cancel. isShipFull checks whether every seat is occupied. printShip logs passengers in seat order. fillShip coordinates requests until full or cancelled, then prints a full ship's manifest.

**Input checks:** Trim names and reject empty values. Accept only integer seat numbers from 1 through maxSeats; convert to a zero-based index once before registration. Invalid requests preserve all seats and allow another attempt. Cancelling either prompt ends the run without announcing a full ship.

**Worked check:** Ada/1 and Lin/2 produce "Seat 1: Ada" then "Seat 2: Lin". Trying Eve/1 after Ada/1 rejects the occupied seat and retains Ada. With maxSeats 3, enter Grace/3, Ada/1 and Lin/2; print in seat order 1,2,3.

**Local files and evidence:** Accept the selected source import in the site IDE. Open index.html to run the exported files without a server. README.md explains every helper and CASES.md gives complete input traces. Show a full ship, duplicate-seat rejection, invalid input, cancellation and a changed capacity; explain how the helpers call each other.`,
					projectLink:
						"https://codepen.io/junilearning/pen/13e9d8e0ad56ecbaff7933d0e063d682",
					solutionLink:
						"https://codepen.io/junilearning/pen/8c0f86e9e4d1996ac073f2d675141072"
				},
				{
					title: "JSM7 Supplemental Project 2: Juggling Paddle",
					preserveInstructions: true,
					content: `**Project target:** Extend the working paddle with a red ball that falls, bounces upward when it hits the paddle, turns downward at its upper endpoint, and falls off the screen on a miss. The local starter supplies the preceding paddle setup.

**Model:** Use a 500-by-500 canvas. The black paddle starts at (200,300), is 100 by 20 and moves 10 units per frame. The ball starts at (250,100), has radius 10, fixed x=250 and vertical speed 1 unit per frame. isFalling controls its direction; its upward endpoint is center y=50. This uses fixed-speed motion. Scoring, lives and restart are optional remixes.

**Build path:** Move the bounded paddle from held-key state. During descent, use the actual paddle rectangle and ball radius to find the contact surface, then detect crossing from oldY to nextY. A centered hit occurs at y=290 because 290+10=300. Clamp to that contact and turn upward. During ascent, turn downward when nextY reaches or crosses 50. A missed ball continues below the canvas; a ball already below the paddle does not bounce back. Update state before drawing.

**Worked checks:** From y=289 while falling, the next frame is y=290 and rising. From y=50.5 while rising, the next frame is y=50 and falling. Moving the paddle to x=0 causes a miss. README.md derives the rounded-corner contact formula and CASES.md covers changed radius, paddle position and step size.

**Local files and evidence:** Accept the selected source import in the site IDE. Open index.html to run the exported files without a server. Focus the canvas before using Left or Right. Show a hit, upward travel, the downward return at y=50 and a miss that leaves the screen; explain both direction changes and the circle-radius check.`,
					projectLink:
						"https://codepen.io/junilearning/pen/9c003b58d7ca7770e49f9243dbecb00f",
					solutionLink:
						"https://codepen.io/junilearning/pen/8f44f06f31939f0a56050f4718f0b608"
				},
				{
					title: "Helper Functions and Event Listeners Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"JSM7 Helper Functions and Event Listeners",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-12-jsm7-helper-functions-and-event-listeners-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-12-jsm7-helper-functions-and-event-listeners-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM8 Collisions and Controls",
			curriculum: [
				{
					title: "Object Collisions",
					content: `**Concept path:** Collision detection turns geometry into boolean logic. Circle collision compares distance between centers with the combined radii, while rectangle collision checks whether edges overlap on both axes.

**Practice targets:** Write one circle-collision function and one rectangle-collision function. Test with clearly separated objects, touching objects, overlapping objects, and edge cases where one object is exactly on the boundary.

**Evidence target:** The functions return true only when the shapes overlap or touch according to the chosen rule, and false when they are separated horizontally or vertically.`
				},
				{
					title: "JSM8 Project 1: Circles Collide",
					preserveInstructions: true,
					content: `Accept the selected role import in the site IDE. Open index.html to run exported files without a server. The 800-by-500 canvas begins with black circles at (50,250) and (500,250), both radius 20. Every 10 ms, move the first center one unit right and the second one unit left. They pass through each other; this assignment detects contact rather than simulating an elastic bounce.

Complete updateCircles and circlesTouch in the starter. The drawing loop is supplied. Calculate dx=a.x-b.x,dy=a.y-b.y and radius=a.size+b.size. Pythagoras gives distance squared=dx*dx+dy*dy. Contact or overlap means distance squared <= radius*radius. Change both circles to blue while true and black when separated. The size property is the radius.

Initially the distance is450. After 204 ticks it is42: black. Tick 205 gives centers255 and295, distance40: blue at exact contact. Tick 225 gives the same center: blue. Tick 245 touches again after passing;tick 246 separates and is black.

The original reference uses strict horizontal overlap on a shared row and logs every tick. This complete reference applies the lesson's inclusive contact rule on both axes and keeps the original canvas, colors and movement. Different y values and unequal radii work. Faster motion may skip an entire contact interval between samples; continuous collision detection is a separate extension.

Save a working checkpoint and demonstrate separated,touching,overlapping and separated-again states. CASES.md includes exact inputs and outputs.`,
					projectLink:
						"https://codepen.io/junilearning/pen/d4a36001e0d9b6e58c640ca0f280284a",
					solutionLink:
						"https://codepen.io/junilearning/pen/2cc6ea883fc971206d81c61a3f93582e"
				},
				{
					title: "JSM8 Project 2: Rectangular Collision",
					preserveInstructions: true,
					content: `Accept the selected role import in the site IDE. Open index.html to run exported files without a server. Draw two random rectangles on the 550-by-500 canvas and display whether they touch or overlap. Reload for a new pair. The starter supplies random generation,drawing and result display;complete rectanglesTouch.

Each rectangle stores x,y,width,height and color. Generate width and height as integers 100..299 first. Choose x in 50..canvas.width-50-width and y in 50..canvas.height-50-height,including both endpoints. This leaves a 50-unit margin and keeps every edge visible. RGB components are integers 0..254,matching the original palette.

Compute left=x,right=x+width,top=y,bottom=y+height. The x ranges touch/overlap if a.right>=b.left AND a.left<=b.right. Apply the same test vertically,and combine all four comparisons with AND. Edge and corner contact count as collision;separation on either axis means false. No rotation or negative dimensions are used.

For a=(50,50,100,100) and b=(150,75,100,100),the rectangles touch at x150: true. Move b.x to151:false. For b=(75,150,100,100),they touch horizontally along y150:true. The original reference uses strict overlap and can clip randomly generated rectangles;this version follows the original task's touching rule and bounds both shapes.

Show overlapping,edge-touching,corner-touching,contained and separated cases from CASES.md. Save the chosen fixed inputs when explaining a result.`,
					projectLink:
						"https://codepen.io/junilearning/pen/1c22a392782c8551073c92fe3e825849",
					solutionLink:
						"https://codepen.io/junilearning/pen/ba1bd74c40cacbdddafc645ba3f7350a"
				},
				{
					title: "JSM8 Project 3: The Bouncy Ball",
					preserveInstructions: true,
					content: `Accept the selected role import in the site IDE. Open index.html to run exported files without a server. The 480-by-320 canvas starts with a green ball at(240,290),radius 15,dx2 anddy-5. Each 10 ms tick applies gravity 0.08,then moves by velocity,handles collisions and draws. Damping is 0.8;stopSpeed is 0.1. Complete updateBall in the supplied drawing framework.

A center stays within x 15..465 and y 15..305. After movement,clamp an outward-moving ball to the crossed wall and reverse the perpendicular velocity,multiplying by 0.8. At the floor also multiply dx by 0.8. Positive dy moves downward. A top hit also loses speed,as the original assignment requires for every wall.

When the new floor rebound magnitude is below 0.1,set dy=0 and grounded=true. A grounded ball stays at y305,receives no gravity and loses horizontal speed by 0.8 per tick. When its horizontal magnitude is below 0.1,set dx=dy=0 and resting=true. Return immediately on future resting ticks. This stable ground/rest state prevents gravity from restarting a stopped ball.

The original reference applies gravity after its zero-velocity condition and omits top-wall damping. This implementation preserves the initial canvas,green ball,velocities,gravity and damping while making update order,bounds and stable rest explicit.

Show an ascent,a damped rebound,the floor and eventual rest. CASES.md gives exact next-state checks and changed-speed boundary cases. Keyboard controls and scoring are optional extensions.`,
					projectLink:
						"https://codepen.io/junilearning/pen/1e97468ca0197dcf6ca6d933e175b6fb",
					solutionLink:
						"https://codepen.io/junilearning/pen/fb9156c7c34ad0319ba52c3c01b326c3"
				}
			],
			supplementalProjects: [
				{
					title: "Collisions and Controls: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Collisions and Controls",
						section: "extension"
					}),
					projectLink:
						"https://codepen.io/junilearning/pen/d4a36001e0d9b6e58c640ca0f280284a",
					solutionLink:
						"https://codepen.io/junilearning/pen/2cc6ea883fc971206d81c61a3f93582e"
				},
				{
					title: "Collisions and Controls Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM8 Collisions and Controls",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-13-jsm8-collisions-and-controls-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-13-jsm8-collisions-and-controls-supplemental-2/solution"
				},
				{
					title: "Collisions and Controls Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM8 Collisions and Controls",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-14-jsm8-collisions-and-controls-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-14-jsm8-collisions-and-controls-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM9 Games in the Canvas",
			curriculum: [
				{
					title: "Choosing a Game",
					content: `**Project choice:** Choose one canvas game and treat it as a multi-session build. The goal is a playable loop with visible state, input handling, collision or scoring logic, and a clear win/loss or completion condition.

**Scope path:** Define the smallest playable version first: one player action, one obstacle or target, one score or state display, and one restart or end condition. Extra art, levels, and polish belong after the core loop works.

**Evidence target:** The selected game has a written feature list, a minimal playable milestone, and at least one planned extension that can be cut without breaking the base game.`
				},
				{
					title: "JSM9 Project 1: Falling Skies",
					preserveInstructions: true,
					content: `The blue 30-by-60 player starts at (260,400) on a 550-by-500 canvas. Left and right move eight pixels per simulation tick and clamp the entire rectangle inside the canvas. After a three-second countdown, radius-15 circles fall eight pixels per tick, with a new circle every ten ticks. The score increases once per two seconds of survival. The simulation uses 60 ticks per second, independent of display refresh rate.

Complete circleTouchesRectangle and stepGame in script.js. Clamp the circle center to the rectangle's nearest point. Compare squared distance to radius squared; equality is contact. Check every circle before declaring the player safe. Remove all circles beyond the bottom without skipping adjacent entries. A hit changes the state to lost once and freezes play. Restart creates a fresh countdown. Hold the arrow keys or the on-screen direction controls; releasing focus clears held input.

Trace a harmless first circle followed by a circle at the player's center: the second circle must end play. A circle centered at (245,400) exactly touches the player's left top corner; (246,386) is outside its radius despite overlapping bounding boxes. Review CASES.md, then compare the complete reference only after attempting both functions.

Accept the selected starter or reference import in the site IDE. README.md contains the full assignment and CASES.md supplies the boundary checks. Open index.html without a server. Save edits,export the ZIP and reopen the saved project to compare the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/8d640d76fa709de228ec6303625663e3",
					solutionLink:
						"https://codepen.io/junilearning/pen/643e3bf98d5a641557276dbc1f269a02"
				},
				{
					title: "JSM9 Project 2: 2D Breakout",
					preserveInstructions: true,
					content: `The 480-by-320 canvas contains fifteen bricks, a radius-10 ball, a 75-by-10 paddle and three lives. The ball starts at (240,290), moving (2,-2) per simulation tick. A new life resets its motion to (3,-3), preserving the original reference's rule. Arrow keys move the paddle seven pixels per tick; pointer movement maps the displayed canvas position into its logical coordinates. The paddle remains wholly inside the canvas.

Complete circleTouchesRectangle and stepGame in script.js. Compare the ball's radius with a brick's nearest point, mark a hit brick inactive, increase score once and reverse the collision axis. A downward crossing of the paddle top reflects the ball upward. Crossing completely below the canvas costs exactly one life. Reset the ball when lives remain; otherwise enter lost. Removing the fifteenth brick enters won. Both terminal states freeze the model until Restart, with a message on the canvas and in the status line.

Use the CASES.md boundary checks: a ball can touch a brick before its center enters it; a miss costs one life, not one per later frame. Compare the saved reference after completing the starter. Hold a direction control or use the pointer to play; observe all three lives and restart without browser alerts.

Accept the selected starter or reference import in the site IDE. README.md contains the full assignment and CASES.md supplies the boundary checks. Open index.html without a server. Save edits,export the ZIP and reopen the saved project to compare the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/0d5f9c3b21921a4bc506a1139a3091bc",
					solutionLink:
						"https://codepen.io/junilearning/pen/778b7aa1d7bcd942b617d87a517d35e2"
				},
				{
					title: "JSM9 Project 3: Asteroids",
					preserveInstructions: true,
					content: `The 550-by-500 canvas begins with the original triangular ship at (100,100). A and D rotate five degrees per simulation tick; W moves one pixel in the ship's forward direction. The on-screen controls provide the same actions. Space and F share one ten-tick firing cooldown. Bullets move five pixels per tick; radius-50 asteroids enter from a random edge every five seconds and move two pixels per tick. Motion uses 60 simulation ticks per second. The ship and asteroids wrap at the canvas boundary.

Complete shipTouchesCircle and stepGame in script.js. Rotate the three local triangle vertices around the ship center. A circle hits if its center lies inside the triangle or its distance from any edge is at most its radius. Bullet collision uses squared center distance and the combined radii. Remove the hit parent, add two half-radius children only when their radius exceeds ten, and score once. Keep bullets in the single game loop, removing spent or off-screen entries.

Death freezes firing, spawning and score until Restart. Focus loss releases all controls. Check CASES.md for the ten-tick cooldown, a single split and a stopped terminal state. Increasing bullet speed requires a swept collision method; this assignment's fixed speeds are the stated model. Compare the complete reference after attempting both functions.

Accept the selected starter or reference import in the site IDE. README.md contains the full assignment and CASES.md supplies the boundary checks. Open index.html without a server. Save edits,export the ZIP and reopen the saved project to compare the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/4d14f6e432dd3b2dcee15a9d95eac750",
					solutionLink:
						"https://codepen.io/junilearning/pen/8a5307a6643fbf762925b08229b5a847"
				},
				{
					title: "JSM9 Project 4: Animated Starfield",
					preserveInstructions: true,
					content: `Create a black field of one hundred white stars. Each object stores x, y, size and downward velocity. Sizes range from one to four pixels; velocities range from fifteen to thirty pixels per second. The original CodePen uses Babel, but this implementation uses ordinary browser JavaScript and needs no compiler or external scripts. Open index.html without a server.

Complete stepGame and resizeStars in script.js. At thirty simulation ticks per second, a star moves velocity divided by thirty pixels per tick. When its y coordinate exceeds the field height, replace that entry with a new star at y=0. Preserve the array length. On resize, scale existing positions by new width/old width and new height/old height before storing the new dimensions. A single animation loop draws the black background and then the white squares.

In CASES.md, trace a star with velocity=30 from y=10 to y=11 after one tick. A star that moves past the bottom returns to the top without increasing density. Resize the window and confirm that all stars remain within the new field. Restart creates a fresh field without adding another loop.

Accept the selected starter or reference import in the site IDE. README.md contains the full assignment and CASES.md supplies the boundary checks. Open index.html without a server. Save edits,export the ZIP and reopen the saved project to compare the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/6d5f8181e8ea59009eadd259e249c5c5",
					solutionLink:
						"https://codepen.io/junilearning/pen/ac7242107973239507eebc571a767c5a"
				}
			],
			supplementalProjects: [
				{
					title: "Games in the Canvas: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Games in the Canvas",
						section: "extension"
					}),
					projectLink:
						"https://codepen.io/junilearning/pen/8d640d76fa709de228ec6303625663e3",
					solutionLink:
						"https://codepen.io/junilearning/pen/643e3bf98d5a641557276dbc1f269a02"
				},
				{
					title: "Games in the Canvas Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM9 Games in the Canvas",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-15-jsm9-games-in-the-canvas-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-15-jsm9-games-in-the-canvas-supplemental-2/solution"
				},
				{
					title: "Games in the Canvas Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM9 Games in the Canvas",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-16-jsm9-games-in-the-canvas-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-16-jsm9-games-in-the-canvas-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM10 APIs and Requests",
			curriculum: [
				{
					title: "APIs",
					contentKind: "reading",
					preserveInstructions: true,
					content: javascriptApiResponsesReading
				},
				{
					title: "JSM10 Project 1: Programming Jokes",
					preserveInstructions: true,
					content: `Display one programming joke as a setup followed by its punchline. The supplied set has ten actual programming jokes from the original API project's public data. Saved responses cycle through those records. Live API requests use the original programming/random endpoint; a successful response may be an object or a one-item array. Keep its two pieces of text together.

Complete loadJokeResponse, normalizeJoke and renderJoke in script.js. In the asynchronous loader, await fixtureResponse for saved data or await requestJson for the live endpoint, then return the validated record from its data field. Normalize an array by selecting its first record, reject empty data, and require nonempty setup and punchline strings of at most 500 characters. The supplied request.js checks HTTP status, JSON content type, a 512 KiB response limit and a four-second deadline. Parse and validate before changing the page. Use textContent and replace the previous two paragraphs instead of accumulating old output. A supplied color rule keeps the original colored-text idea while retaining readable contrast.

Select Saved responses and load several jokes without a network. Then select Live API and inspect the request in the browser tools. One active request is allowed; Cancel aborts it. A failed or malformed refresh keeps the previous joke and shows a status. Random endpoints deliberately request a fresh value, while the shared helper retains a bounded cache for deterministic lookups. Check CASES.md before comparing the completed reference. Open index.html without a server.

Accept the selected role in the site IDE. README.md contains the full assignment;CASES.md supplies the checks. Save,export and reopen the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/55981d32b9659656bb8cc4a17a0526bc",
					solutionLink:
						"https://codepen.io/junilearning/pen/e82a3c7cb28fcfba32ad765c0fe3009a"
				},
				{
					title: "JSM10 Project 2: Random Fox Generator",
					preserveInstructions: true,
					content: `Add a fox photograph whenever the load button succeeds. Each valid response appends a fox photograph to the gallery. The gallery retains the newest twelve entries. Saved responses cycle through three real, public-domain fox photographs; their credits and source pages are included. Live API uses the original randomfox.ca/floof/ endpoint when available.

Complete loadFoxResponse, validateFox and appendFox in script.js. The asynchronous loader selects fixtureResponse or requestJson and returns the validated object before image decoding begins. Require an object with a valid image field. Saved image values must match the supplied fixtures; live values must use HTTPS, the exact randomfox.ca origin and an images/number.jpg, .jpeg or .png path. Reject query strings, fragments and unrelated origins. The supplied request helper checks status, JSON parsing, byte size and a four-second deadline. The supplied image helper waits for successful decoding before the new figure is attached, so broken images cannot displace valid ones.

Create meaningful alt text from trusted local copy, keep image proportions with CSS, and append a text credit link. Remove the oldest figure only after a thirteenth valid result is ready. Verify the gallery offline, then use Cancel and the failure cases in CASES.md. Failed requests or image loads keep earlier photographs. Photographs use their natural proportions at both display widths. Open index.html without a server.

Accept the selected role in the site IDE. README.md contains the full assignment;CASES.md supplies the checks. Save,export and reopen the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/93750fc08b5b2268a1d78b296295e2e8",
					solutionLink:
						"https://codepen.io/junilearning/pen/686374da7355c247854acf33c3904b25"
				},
				{
					title: "JSM10 Project 3: Pokedex",
					preserveInstructions: true,
					content: `Search the original 893-entry Pokémon index by name or numeric ID. Every entry includes its real name, one or two types, six base statistics and the corresponding supplied sprite. The local dataset is derived from pinned public PokéAPI CSV files and sprite sources, so every indexed lookup works offline. The datalist contains all 893 names. Live API optionally refreshes one selected record; loading the page never launches 893 requests.

Complete loadPokemonResponse, normalizePokemon and renderPokemon in script.js. The asynchronous loader selects the saved record or one live request, waits for validation, and returns its data plus cache status. Require an ID from 1 through 893, a normalized name, one or two type records, six numeric base statistics and a valid sprite. The complete reference accepts the supplied PNG data URLs locally and the exact reviewed PokéAPI sprite path for a live response. Render one result with DOM text, a labeled sprite and a definition list of statistics; replace previous details so repeated searches do not accumulate stale fields.

The supplied request.js checks HTTP status, JSON type, a 512 KiB response cap, one active request and a four-second timeout. Successful live records enter a bounded sixty-second cache. Repeating the same lookup uses it; a failed refresh retains the previous record. Try bulbasaur, pikachu, 25 and 893, then an unknown name. Inspect CASES.md, including markup-shaped input, invalid records, sprite failure and cached reads. Open index.html without a server.

Accept the selected role in the site IDE. README.md contains the full assignment;CASES.md supplies the checks. Save,export and reopen the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/35923b1d6dee01a5f3004d67836eca46",
					solutionLink:
						"https://codepen.io/junilearning/pen/e72824bf10e7457a18774db2554f860e"
				}
			],
			supplementalProjects: [
				{
					title: "JSM10 Supplemental Project 1: Funny Meter",
					preserveInstructions: true,
					content: `Rate exactly ten programming jokes, one at a time. This optional project extends the single-joke reader: the completed normalizeJoke helper is supplied, and the new work is validating the batch and recording decisions. Saved responses contain ten actual programming jokes. The Live API option uses the original programming/ten endpoint when available.

Complete loadTenJokesResponse, normalizeTenJokes and recordRating in script.js. The asynchronous loader awaits the saved response or the live programming/ten endpoint before creating the session. Require an array of exactly ten valid jokes, assign a stable session ID to each position, and reuse normalizeJoke for each setup and punchline. Store each accepted rating with the current joke's ID. Accept only yes or no; invalid input leaves the current position unchanged. The next joke is determined by the number of recorded ratings, not by an independently incremented prompt counter.

The supplied renderer shows progress, the current joke and two native answer buttons. After ten answers it displays liked/disliked counts and whether the set was liked, disliked or tied. Buttons stop accepting ratings at completion. Restart clears ratings for the current set; a failed live refresh preserves it, and another load cannot erase a partly rated session. Use CASES.md to complete all-yes, all-no and tied sessions, plus invalid/duplicate/after-completion cases. Open index.html without a server.

Accept the selected role in the site IDE. README.md contains the full assignment;CASES.md supplies the checks. Save,export and reopen the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/bf88ab46e0b7314e0b0999ba35363519",
					solutionLink:
						"https://codepen.io/junilearning/pen/d07e0093689c1e654fc59de47093b043"
				},
				{
					title: "APIs and Requests Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM10 APIs and Requests",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-17-jsm10-apis-and-requests-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-17-jsm10-apis-and-requests-supplemental-2/solution"
				},
				{
					title: "APIs and Requests Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM10 APIs and Requests",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-18-jsm10-apis-and-requests-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-18-jsm10-apis-and-requests-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM11 SQL and Schemas",
			curriculum: [
				{
					title: "Introduction to Databases",
					content: `**Concept path:** A relational database represents entities as tables, rows as records, columns as attributes, and constraints as rules the stored data must satisfy. Separating repeated facts can prevent contradictory copies, but every split needs a clear relationship.

**Practice targets:** Model a fictional library with books, shelves, and placements. Identify candidate keys, choose a primary key, mark required and optional columns, and explain one duplication problem prevented by the design.

**Evidence target:** The table map names each entity and relationship, includes representative rows, distinguishes an identifier from display text, and records one design tradeoff without requiring a hosted database.`
				},
				{
					title: "SQL Queries",
					content: `**Concept path:** SQL separates the requested result from the steps a database uses to produce it. \`SELECT\` chooses columns, \`FROM\` chooses tables, \`WHERE\` filters rows, and \`ORDER BY\` makes output order explicit.

**Practice targets:** Predict results for supplied \`SELECT\`, \`WHERE\`, \`ORDER BY\`, and \`LIMIT\` queries before comparing with the answer set. For one fictional update, write the matching preview \`SELECT\`, identify the exact target rows, and describe a rollback or transaction boundary.

**Evidence target:** Every query names its input table shape, expected columns and rows, ordering assumption, \`NULL\` behavior, and whether it reads or changes data.`
				},
				{
					title: "JSM11 Project 1: SQL SELECT Practice",
					content:
						"Complete SQLBolt lessons 1-4 and record the core `SELECT` patterns used: selecting specific columns, filtering with `WHERE`, ordering results, and limiting output. After the practice, write two original query examples and explain what table shape each query expects.",
					projectLink:
						"https://sqlbolt.com/lesson/select_queries_introduction"
				},
				{
					title: "Primary and Foreign Keys",
					content: `**Concept path:** A primary key identifies one row; a foreign key states that a value refers to a valid row in another table. A join follows that declared relationship, while the join type determines what happens to unmatched rows.

**Practice targets:** Add primary and foreign keys to the supplied books-and-shelves schema, then predict inner-join and left-join results containing a missing shelf and an empty shelf. Distinguish a stable synthetic ID from a name that can change or repeat.

**Evidence target:** The relationship diagram, representative rows, and predicted join results agree. The explanation names the parent, child, cardinality, optionality, and action expected when a referenced row changes or is deleted.`
				},
				{
					title: "JSM11 Project 2: Join Tables Practice",
					content:
						"Complete SQLBolt lessons 6-7 and focus on why `JOIN` requires a relationship between tables. Identify the key columns being matched, describe what rows appear in the result, and write one extra join query that would answer a realistic question about related records.",
					projectLink:
						"https://sqlbolt.com/lesson/select_queries_with_joins"
				},
				{
					title: "Database Schemas",
					content: `**Concept path:** A schema records entities, columns, types, constraints, and relationships before application code depends on them. One-to-many relationships place a foreign key on the many side; many-to-many relationships use a junction table with its own uniqueness rule.

**Practice targets:** Draw the apartment schema locally, add column types and constraints, and convert one many-to-many idea into a junction table. Then optionally reproduce the same artifact in dbdiagram without using real resident data.

**Evidence target:** The schema includes primary keys, foreign keys, required fields, one uniqueness rule, cardinality, representative fictional rows, and two queries the design can answer.`
				},
				{
					title: "JSM11 Project 3: Apartment Building",
					content:
						"Design a fictional apartment-building schema locally with units, residents, and occupancy history. Give each entity a stable key, use foreign keys for relationships, include at least five purposeful attributes across the model, and represent residents moving between units without overwriting history. Add representative rows and two query questions. Optionally reproduce the finished local diagram in dbdiagram; no account, real address, resident identity, or hosted database is required.",
					projectLink: "https://dbdiagram.io/d",
					solutionLink:
						"https://dbdiagram.io/d/5facb8cf3a78976d7b7b8d44"
				}
			],
			supplementalProjects: [
				{
					title: "JSM11 Supplemental Project 1: Advanced SQL Queries",
					content:
						"Complete SQLBolt lessons 8-12 with attention to `NULL`, aggregation, grouping, and query cleanup. For each new query feature, write down one case where it changes the answer compared with a simpler `SELECT` query, then test at least one query that handles missing data deliberately.",
					projectLink:
						"https://sqlbolt.com/lesson/select_queries_with_nulls"
				},
				{
					title: "JSM11 Supplemental Project 2: Music Library",
					content:
						"Create a music library schema with tables for artists, songs, albums, and genres. Use primary keys for each table, foreign keys for relationships, and at least one many-to-many relationship where appropriate. Finish by explaining how the schema avoids duplicating the same artist or genre information across many rows.",
					projectLink: "https://dbdiagram.io/d",
					solutionLink:
						"https://dbdiagram.io/d/5fadb2e23a78976d7b7bb248"
				},
				{
					title: "JSM11 Supplemental Project 3: Altering Tables",
					content:
						"Complete SQLBolt lessons 13-18 and focus on how data changes after `INSERT`, `UPDATE`, `DELETE`, and table-altering commands. For each operation, identify the before-and-after state of the table and write one safety check that would prevent accidental data loss or malformed records.",
					projectLink: "https://sqlbolt.com/lesson/inserting_rows"
				}
			]
		},
		{
			title: "JSM12 NoSQL and CRUD",
			curriculum: [
				{
					title: "Introduction to NoSQL",
					content: `**Concept path:** A document model stores related fields together as JSON-like values, while a relational model separates entities and connects rows with keys. Neither model removes the need for identifiers, validation, constraints, versioning, or deliberate update rules.

**Practice targets:** Represent the same fictional reading list as relational tables and as bounded document objects. Compare duplication, lookup shape, partial updates, ordering, missing fields, and a change that requires a data migration.

**Evidence target:** The comparison names one fit and one limitation for each model, includes a small validated example, and avoids treating “NoSQL” as meaning no schema or no consistency rules.`
				},
				{
					title: "CRUD",
					content: `**Concept path:** Create, read, update, and delete describe state changes, while HTTP methods describe a remote protocol. This course first implements CRUD against explicit in-memory state and \`localStorage\`, then maps each operation to a hypothetical request without exposing a write credential.

**Practice targets:** Define an operation contract with input, validation, state before, state after, rendered result, persistence action, and failure result. Distinguish replacing a whole record from changing one field, and make delete require a stable record ID rather than a display position.

**Evidence target:** Every local operation is repeatable, survives refresh where intended, reports storage failure, preserves unrelated records, and maps to an HTTP method without claiming that a browser-held secret creates a trusted database boundary.`
				},
				{
					title: "JSONBin Setup",
					content:
						'Review JSONBin v3 only as a preserved example of a hosted JSON API. Its write routes require an `X-Master-Key` or scoped `X-Access-Key`, so do not create, paste, or ship either key in CodePen or browser source. Build the required exercise with a versioned `{"schemaVersion": 1, "notes": [{"id": "n1", "text": "fictional note"}]}` fixture and `localStorage`. The key skill is separating local page state from persisted remote state; model that boundary with a storage adapter locally instead of exposing a remote credential. An optional demonstration may show request shapes with redacted placeholders or an isolated server-side proxy, but learner completion never depends on a hosted bin or remote write.'
				},
				{
					title: "Local Documents and Stable IDs",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: javascriptLocalDocumentsReading
				},
				{
					title: "JSM12 Project 1: To-Do List",
					preserveInstructions: true,
					content: `Build a note list from a version-one document with stable IDs. The two supplied notes make the initial state concrete. Complete addNote(state, value, id) and renderNotes(state) in script.js. addNote trims and validates a 1–200-character note, rejects a repeated ID or more than 100 records, pushes one {id, text} object and returns true. Use the supplied recordId and textField helpers. renderNotes creates a list item for each record and assigns its text with textContent. An empty array displays No notes.

The supplied form generates an ID once per accepted submission. Its transaction helper clones state, applies the mutation, validates the complete document and saves JSON before replacing working state. Trace this route in storage.js and the perform function. A failed save keeps the previous document. Invalid or unsupported stored JSON stays available for recovery and produces a read-only example.

Add two notes, including duplicate text, and refresh at the same origin. Each note must retain its own ID. Verify literal markup-shaped text, blank/overlength input, the record limit, failed saving and corrupted storage using CASES.md. This project supplies creation and rendering; deletion belongs to the next core project.

Accept the selected role in the site IDE. README.md contains the complete assignment;CASES.md supplies the checks. Save,export and reopen the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/1f218d8aafbcc33fd6409a8ab1616e29",
					solutionLink: "https://codepen.io/junilearning/pen/MWZzbmK",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_todo_list.gif"
				},
				{
					title: "JSM12 Project 2: Deleting Notes",
					preserveInstructions: true,
					content: `Extend the completed local note list with deletion. Adding, validation, rendering and persistence are supplied from the earlier project. Complete deleteNote(state, id) in script.js. Find the note with the selected stable ID, remove exactly that record and return true. Return false for an unknown ID so no stored document is rewritten. Array positions describe display order; the stored ID identifies the record across changes.

Each Delete button captures its note's ID. After a successful transaction the renderer rebuilds the list and focus returns to the note input. The storage helper validates and saves a cloned document first, so a quota or policy failure leaves the previous state intact.

Delete the first, last and only note. Repeat a deletion with the removed ID, and try an ID that never existed. Add duplicate text to confirm the selected ID determines the deletion. Refresh after success and after a failed save. The list uses version one and has no completion checkbox; checking notes remains a separate optional project.

Accept the selected role in the site IDE. README.md contains the complete assignment;CASES.md supplies the checks. Save,export and reopen the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/f8f84204c272d2a6449cda485cbe7736",
					solutionLink: "https://codepen.io/junilearning/pen/BavGpyN"
				}
			],
			supplementalProjects: [
				{
					title: "JSM12 Supplemental Project 1: Checking Notes",
					preserveInstructions: true,
					content: `Add persistent completion state to the local note list. Adding, deleting, safe rendering and the storage transaction are supplied. Complete upgradeLegacyNotes(value) and setCompletion(state, id, checked) in script.js.

Version two retains each note's ID and text and adds the Boolean done field. Upgrade a valid version-one document by preserving its records and assigning done: false. For the older string-array fixture, keep each valid nonblank note, including duplicate text, and assign a distinct legacy-position ID. Validate text and record limits and reject other shapes. Return the version-two document. The supplied normalizer validates the result and marks it as migrated; the next successful change saves that schema.

setCompletion finds one note by ID, accepts only a Boolean checked value, assigns its done field and returns true. Unknown IDs or non-Boolean values return false. The native checkbox and Completed/Incomplete text show the same state. Focus returns to the corresponding checkbox after rendering.

Use the two legacy fixtures in fixtures.js and CASES.md to verify migration, toggling one of two notes, repeated toggles, deletion after checking, refresh, corrupted data and failed saving. A failed migration preserves the original JSON for recovery. This is the optional extension of the two core note projects.

Accept the selected role in the site IDE. README.md contains the complete assignment;CASES.md supplies the checks. Save,export and reopen the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/ab6bf77b9d85e1b9a7452d5a307b6b7f",
					solutionLink:
						"https://codepen.io/junilearning/pen/bc74a6591ecf2d986cd8fd83eb46e427"
				},
				{
					title: "NoSQL and CRUD Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM12 NoSQL and CRUD",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-19-jsm12-nosql-and-crud-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-19-jsm12-nosql-and-crud-supplemental-2/solution"
				},
				{
					title: "NoSQL and CRUD Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM12 NoSQL and CRUD",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-20-jsm12-nosql-and-crud-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-20-jsm12-nosql-and-crud-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM13 Message Board",
			curriculum: [
				{
					title: "JSM13 Project 1: Message Board",
					preserveInstructions: true,
					content: `Build a single-browser topic board with separate title, site URL and optional image-address fields. Complete addTopic(state, title, url, imageUrl, id) and renderTopics(state) in script.js. The supplied version-one fixture contains two topics with stable IDs and ordering values.

addTopic validates the ID, a 1–100-character title and the two addresses, then creates one post with a locally increasing order value. Reject repeated IDs and more than 30 topics. Use reviewedUrl for the explicit site/image origins in storage.js. An empty image address is valid and uses the supplied decorative illustration. A failed image load exposes a text fallback.

renderTopics sorts a copy by descending order, builds each article with DOM methods, assigns the title with textContent and links to its reviewed site URL. Assign image addresses through the img src property and handle load failure. The supplied transaction saves a validated clone before changing working state. Reset requires confirmation; read-only recovery preserves original saved bytes.

Create at least two new topics and check ordering, the three distinct fields, refresh, markup-shaped titles, disallowed URLs, image failure, record/document limits, corrupted storage and failed saving. Adding comments is a separate optional extension; this core board displays topics.

Accept the selected role in the site IDE. README.md contains the complete assignment;CASES.md supplies the checks. Save,export and reopen the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/6c0b3c5a207fc24b58c44a5f481922e3",
					solutionLink: "https://codepen.io/junilearning/pen/GRPwwOg"
				},
				{
					title: "Local Topics and Comments",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: javascriptLocalMessageBoardReading
				},
				{
					title: "Message Board: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Message Board",
						section: "debugging"
					})
				},
				{
					title: "Message Board: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Message Board",
						section: "planning"
					})
				},
				{
					title: "Message Board: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Message Board",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JSM13 Supplemental Project 1: Adding Comments",
					preserveInstructions: true,
					content: `Extend the completed topic board with nested comments. Topic creation, URL validation, ordering, rendering, local transactions and a version-one upgrade are supplied. Complete addComment(state, postId, value, id) in script.js.

Find the parent topic by stable ID. An unknown parent returns false without changing or saving the document. Validate a unique comment ID and trimmed text of 1–400 characters. Append one {id, text} object to that topic's comments array, with at most 20 comments per topic and 200 across the board. The full document must remain within 128 KiB.

The renderer creates a labeled form for each topic and captures its ID. Adding a newer topic changes display positions while the captured ID still selects the intended parent. Duplicate comment text is allowed as distinct records. The supplied renderer uses textContent and restores focus to the appropriate new comment input.

Comment on two topics, add a newer topic, comment again on an older one and refresh. Verify stable associations, duplicate and markup-shaped text, blank/overlength input, missing parents, limits, reset and storage failures using CASES.md. A failed save preserves the previous document. Reset restores the supplied example and clears its comments. This project remains optional.

Accept the selected role in the site IDE. README.md contains the complete assignment;CASES.md supplies the checks. Save,export and reopen the same files.`,
					projectLink:
						"https://codepen.io/junilearning/pen/f40d31ed70aef27cee691e91d947ef14",
					solutionLink:
						"https://codepen.io/junilearning/pen/c3fb5542e72c66ad7264b94a8be3c4c0"
				},
				{
					title: "Message Board Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM13 Message Board",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-21-jsm13-message-board-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-21-jsm13-message-board-supplemental-2/solution"
				},
				{
					title: "Message Board Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM13 Message Board",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-22-jsm13-message-board-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-22-jsm13-message-board-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM14 Quiz Game",
			curriculum: [
				{
					title: "JSM14 Project 1: Quiz Game",
					content:
						"Build a fictional region-and-capital quiz from the supplied local JSON fixture. Model loading, ready, asking, feedback, complete, and reset states explicitly; use a labeled form or native buttons for answers; update score exactly once per question; and render progress, feedback, and final result as DOM text. Canvas may color a decorative map or region diagram, but essential names, current question, score, status, and controls remain available outside it. Validate and cap fixture data, support keyboard and pointer use, preserve visible focus, respect reduced motion, and verify duplicate submit, wrong and correct answers, final question, empty fixture, malformed fixture, and restart. The preserved JSONBin-based CodePen is reference-only; no browser credential or remote write belongs in the required project.",
					projectLink:
						"https://codepen.io/junilearning/pen/f8ec7312634d2011e58c44d691d1da13",
					solutionLink:
						"https://codepen.io/junilearning/pen/540c4d060641bb749cefde340d69acd6",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_us_capitals_quiz.gif"
				},
				{
					title: "Quiz Game: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Quiz Game",
						section: "debugging"
					})
				},
				{
					title: "Quiz Game: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Quiz Game",
						section: "planning"
					})
				},
				{
					title: "Quiz Game: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Quiz Game",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Quiz Game: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Quiz Game",
						section: "extension"
					}),
					projectLink:
						"https://codepen.io/junilearning/pen/f8ec7312634d2011e58c44d691d1da13",
					solutionLink:
						"https://codepen.io/junilearning/pen/540c4d060641bb749cefde340d69acd6"
				},
				{
					title: "Quiz Game Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM14 Quiz Game",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-23-jsm14-quiz-game-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-23-jsm14-quiz-game-supplemental-2/solution"
				},
				{
					title: "Quiz Game Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM14 Quiz Game",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-24-jsm14-quiz-game-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-24-jsm14-quiz-game-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM15 Master Project",
			curriculum: [
				{
					title: "JSM15 Project 1: Master Project",
					content:
						"Plan and build one browser-only app or game for a fictional audience over roughly two weeks. Define one primary task, non-goals, state and event model, data shape, failure states, and a smallest complete vertical slice before adding polish. Separate pure logic from DOM, canvas, storage, and optional public-GET boundaries. A chat-style interface may be simulated locally, but do not add real accounts, public messages, browser-held write secrets, or an implied secure back end. Include a supplied-fixture route, bounded local persistence where useful, semantic controls, keyboard and pointer operation, visible focus and status, reduced motion, safe text and URL handling, reset and recovery, performance limits, and independent verification checkpoints."
				},
				{
					title: "Handoff to Web Development Foundations",
					content:
						"`Web Development Foundations` is the default follow-on course after JavaScript Level 2. Be reasonably comfortable with functions, conditionals, arrays, objects, events, APIs, and basic data modeling before starting it. The goal of that next course is not to reteach core syntax, but to move into file-based local projects, Git and GitHub, npm, dev servers, back-end basics, databases, and deployment. If the `JSM10` through `JSM13` range still feels shaky, review those units before making the jump. A good readiness check is to explain one prior project in terms of event flow, state, data shape, and what happens when a request or input fails."
				},
				{
					title: "Course Recap",
					content:
						"Review the main JavaScript Level 2 skills: helper functions, events, canvas drawing, collision logic, arrays, objects, API requests, SQL and NoSQL data models, CRUD flows, and full project planning. Choose one project that best demonstrates interactive browser logic and one project that best demonstrates data flow or persistence."
				},
				{
					title: "JSM15 Master Project: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "JSM15 Master Project",
						section: "verification"
					})
				},
				{
					title: "JSM15 Master Project: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM15 Master Project",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/solution"
				}
			],
			supplementalProjects: [
				{
					title: "JSM15 Master Project: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "JSM15 Master Project",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/solution"
				},
				{
					title: "Master Project Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM15 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-25-jsm15-master-project-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-25-jsm15-master-project-supplemental-2/solution"
				},
				{
					title: "Master Project Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM15 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-26-jsm15-master-project-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-26-jsm15-master-project-supplemental-3/solution"
				}
			]
		},
		{
			kind: "appendix",
			title: "Pending Demo Media",
			curriculum: [
				{
					title: "Pending JavaScript Level 2 Demo Media",
					content: [
						"This course lists pending demo media below. Each entry keeps a stable static media URL so the matching file can be added without changing course links.",
						...JAVASCRIPT_LEVEL_2_ORIGINAL_MEDIA.map(
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

applyJavaScriptLevel2PendingMediaNotices(javascriptLevel2SourceCourse);

interface JavaScriptLevel2ModuleFlow {
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

const JAVASCRIPT_LEVEL_2_SEQUENCE = [
	"JSM1 Fundamentals Review",
	"JSM2 Functions",
	"JSM3 Complex Conditionals",
	"JSM4 Canvas",
	"JSM5 Arrays and Iterators",
	"JSM6 Objects and Properties",
	"Check-In #1",
	"JSM7 Helper Functions and Event Listeners",
	"JSM8 Collisions and Controls",
	"JSM9 Games in the Canvas",
	"JSM10 APIs and Requests",
	"JSM11 SQL and Schemas",
	"JSM12 NoSQL and CRUD",
	"Check-In #2",
	"JSM13 Message Board",
	"JSM14 Quiz Game",
	"JSM15 Master Project"
] as const;

const JAVASCRIPT_LEVEL_2_MODULE_FLOW: Record<
	(typeof JAVASCRIPT_LEVEL_2_SEQUENCE)[number],
	JavaScriptLevel2ModuleFlow
> = {
	"JSM1 Fundamentals Review": {
		stage: "Verify Level 1 fluency in a durable local workspace",
		estimatedTime: "3–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"local files",
			"declaration",
			"conversion",
			"branch",
			"loop",
			"safe output"
		],
		practiceSection: "level-1-readiness-and-state-case",
		answerSection: "level-1-readiness-and-state-key",
		route: "Rebuild one small Level 1 interaction with local files, explicit declarations and conversion, strict comparisons, bounded loops, safe DOM output, and a native SVG or CSS result. Preserve CodePen, dialogs, D3, and Materialize only as recognizable references.",
		standardsRoute:
			"Use ECMAScript 2026 and the HTML Living Standard in an evergreen browser. A labeled form and `textContent` replace blocking or sandbox-only helpers in the finished route.",
		evidence:
			"The readiness sheet records expected and observed values, types, branch and loop traces, local refresh behavior, console state, keyboard path, and the exact Level 1 topic that needs review.",
		primaryReference: {
			label: "MDN JavaScript Guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"
		}
	},
	"JSM2 Functions": {
		stage: "Design functions as testable contracts",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"parameter",
			"return",
			"pure logic",
			"side effect",
			"default",
			"test table"
		],
		practiceSection: "function-contract-and-pure-test-case",
		answerSection: "function-contract-and-pure-test-key",
		route: "Write input and output contracts before implementation, extract pure calculations from prompting or rendering, return values instead of hiding results in logs, and test fixed boundaries before connecting random or event-driven callers.",
		standardsRoute:
			"Use named functions, local scope, template literals, explicit defaults, and deliberate error or fallback values. Keep DOM, random, storage, and network effects at narrow boundaries.",
		evidence:
			"The function table names parameters, accepted domain, return type, side effects, standard case, boundary, invalid case, caller, and one refactor that removed duplication.",
		primaryReference: {
			label: "MDN functions guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions"
		}
	},
	"JSM3 Complex Conditionals": {
		stage: "Make compound decisions auditable",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"decision table",
			"strict comparison",
			"compound rule",
			"branch order",
			"ternary",
			"boundary"
		],
		practiceSection: "decision-table-and-ternary-case",
		answerSection: "decision-table-and-ternary-key",
		route: "Translate a decision table into grouped boolean expressions and mutually exclusive branches. Use a ternary only for one compact value choice, and use full branches when multiple actions, validation, or explanation are involved.",
		standardsRoute:
			"Use strict equality, explicit conversion, named booleans, parentheses, and complete range partitions. Do not rely on coercion or nested ternaries to compress an unclear rule.",
		evidence:
			"The case matrix covers all meaningful combinations and exact boundaries, identifies the selected branch and message, and demonstrates that changing branch order alters only the intended cases.",
		primaryReference: {
			label: "MDN control flow guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling"
		}
	},
	"JSM4 Canvas": {
		stage: "Map explicit drawing state to Canvas 2D",
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"canvas size",
			"coordinate",
			"context state",
			"path",
			"pixel ratio",
			"fallback"
		],
		practiceSection: "canvas-coordinate-and-fallback-case",
		answerSection: "canvas-coordinate-and-fallback-key",
		route: "Configure the canvas drawing buffer and CSS size deliberately, calculate coordinates, isolate save and restore state, draw from data objects, and expose essential meaning in adjacent DOM text or canvas fallback content.",
		standardsRoute:
			"Use the Canvas 2D API directly with a bounded scene. Account for device pixel ratio when crispness matters, and keep decorative pixels separate from semantic controls and status.",
		evidence:
			"The canvas record names CSS and buffer dimensions, coordinate transform, drawing order, state changes, first and last pixels or objects, text alternative, resize result, and reset behavior.",
		primaryReference: {
			label: "MDN Canvas basic usage",
			url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage"
		}
	},
	"JSM5 Arrays and Iterators": {
		stage: "Choose array operations from the data transformation",
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: ["index", "for-of", "map", "filter", "reduce", "2D shape"],
		practiceSection: "array-transform-and-grid-case",
		answerSection: "array-transform-and-grid-key",
		route: "Trace ordered data by index, use `for...of` for direct values, choose `map`, `filter`, or `reduce` from the requested output, and make row and column ownership explicit in a rectangular two-dimensional array.",
		standardsRoute:
			"Use immutable transformations when the source must remain available, copy deliberately, avoid sparse accidental arrays, and cap generated dimensions and total work.",
		evidence:
			"The transformation ledger records input, operation, callback contract, output, source mutation, empty case, duplicate case, row lengths, total work, and one iterator choice rejected with a reason.",
		primaryReference: {
			label: "MDN Array reference",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
		}
	},
	"JSM6 Objects and Properties": {
		stage: "Model related state before animating it",
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"object shape",
			"property",
			"method",
			"identity",
			"update",
			"render"
		],
		practiceSection: "object-model-and-animation-state-case",
		answerSection: "object-model-and-animation-state-key",
		route: "Define a stable object shape, distinguish identity from display values, iterate only intended own properties, and separate state updates from canvas rendering. Animate a bounded object array through one explicit loop.",
		standardsRoute:
			"Use object literals, predictable property names, safe defaults, and `Object.keys`, `Object.values`, or `Object.entries` when property iteration is needed. Avoid mixing inherited or unvalidated fields into rendering.",
		evidence:
			"The object contract lists required fields, defaults, identity, valid updates, render inputs, frame before and after, unknown-field behavior, and one test proving that rendering does not mutate domain state.",
		primaryReference: {
			label: "MDN working with objects guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects"
		},
		additionalReferences: [
			{
				label: "MDN Canvas basic animations",
				url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations"
			}
		]
	},
	"Check-In #1": {
		stage: "Logic, data, and canvas checkpoint after JSM1–JSM6",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"function",
			"conditional",
			"array",
			"object",
			"canvas",
			"test"
		],
		practiceSection: "logic-data-canvas-checkpoint-case",
		answerSection: "logic-data-canvas-checkpoint-key",
		route: "Complete this required checkpoint after JSM6 by combining function contracts, compound conditions, arrays, objects, and data-driven canvas rendering. It can also be used earlier as an optional placement preview, but the key stays closed until an independent attempt is recorded.",
		standardsRoute:
			"Use local files, fixed test data before randomness, bounded drawing work, semantic controls, and a text result that exposes essential canvas state.",
		evidence:
			"The packet contains predictions, runnable results, boundaries and invalid cases, object and array traces, canvas evidence, console state, an explanation for each choice, and a named revisit module.",
		primaryReference: {
			label: "MDN Canvas API",
			url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API"
		}
	},
	"JSM7 Helper Functions and Event Listeners": {
		stage: "Normalize events before changing state",
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"listener",
			"event data",
			"coordinate transform",
			"focus",
			"handled key",
			"cleanup"
		],
		practiceSection: "event-normalization-and-input-case",
		answerSection: "event-normalization-and-input-key",
		route: "Extract repeated logic into helpers, attach named listeners, convert pointer coordinates through the canvas bounding rectangle, and handle only documented keys while the interaction surface has focus. Remove or disable listeners when the experience stops.",
		standardsRoute:
			"Use `addEventListener`, native focus behavior, `KeyboardEvent.key`, and `preventDefault` only for a handled key inside the active interaction. Preserve normal page scrolling when focus leaves the experience.",
		evidence:
			"The event trace records target, event type, raw data, normalized data, state transition, visible result, default action decision, focus state, repeated-listener check, and cleanup.",
		primaryReference: {
			label: "MDN addEventListener reference",
			url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener"
		},
		additionalReferences: [
			{
				label: "MDN KeyboardEvent key reference",
				url: "https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key"
			}
		]
	},
	"JSM8 Collisions and Controls": {
		stage: "Treat collision as a tested geometry contract",
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"shape bounds",
			"overlap",
			"touching edge",
			"response",
			"single event",
			"debug overlay"
		],
		practiceSection: "collision-boundary-case",
		answerSection: "collision-boundary-key",
		route: "Define circle and axis-aligned rectangle bounds, state whether touching counts as collision, test geometry with fixed values, and separate detection from response. Prevent one overlap from changing score or velocity repeatedly across frames.",
		standardsRoute:
			"Use small pure collision helpers and a visible optional debug overlay. Controls remain focus-aware, keyboard and pointer operable, and independent from collision math.",
		evidence:
			"The geometry table covers separated, touching, overlapping, contained, corner, high-speed crossing, and repeated-frame cases with expected detection, response, and correction.",
		primaryReference: {
			label: "MDN 2D collision detection",
			url: "https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection"
		}
	},
	"JSM9 Games in the Canvas": {
		stage: "Build one bounded and recoverable game loop",
		estimatedTime: "7–9 sessions · 45–60 minutes each",
		keyBlocks: [
			"state machine",
			"delta time",
			"input",
			"update",
			"render",
			"pause and reset"
		],
		practiceSection: "bounded-game-loop-case",
		answerSection: "bounded-game-loop-key",
		route: "Implement a minimal playable loop with explicit ready, running, paused, complete, and reset states. Sample input, update with capped delta time, resolve collisions, render once per frame, cancel the frame when stopped, and bound spawned objects.",
		standardsRoute:
			"Use `requestAnimationFrame`, one active loop, semantic start, pause, and reset controls, focus-aware keys, reduced-motion behavior, and DOM text for instructions, score, lives, status, and outcome.",
		evidence:
			"The loop trace includes frame handle, timestamp and delta cap, state before and after, object count, collision events, score change, pause and background-tab behavior, restart, and a measured work budget.",
		primaryReference: {
			label: "MDN anatomy of a video game",
			url: "https://developer.mozilla.org/en-US/docs/Games/Anatomy"
		},
		additionalReferences: [
			{
				label: "MDN requestAnimationFrame reference",
				url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame"
			}
		]
	},
	"JSM10 APIs and Requests": {
		stage: "Design resilient read-only data boundaries",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"fixture",
			"loading state",
			"response status",
			"abort",
			"shape validation",
			"cache"
		],
		practiceSection: "resilient-fetch-and-fixture-case",
		answerSection: "resilient-fetch-and-fixture-key",
		route: "Start from a supplied fixture, then optionally refresh from a public GET API through one function that checks status, aborts on timeout or replacement, validates shape and size, caches successful data, and returns a typed local result to rendering.",
		standardsRoute:
			"Use Fetch, Response.ok, AbortController, URL, and safe text or reviewed image URLs. Follow provider fair-use guidance, make no browser-side authenticated write, and keep the fixture route fully functional offline.",
		evidence:
			"The request matrix covers fixture, loading, success, empty, non-OK, timeout, abort, malformed shape, unexpected URL, stale cache, repeated request, and recovery without exposing raw remote content or secrets.",
		primaryReference: {
			label: "MDN using Fetch",
			url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
		},
		additionalReferences: [
			{
				label: "PokéAPI v2 documentation and fair-use policy",
				url: "https://pokeapi.co/docs/v2"
			}
		]
	},
	"JSM11 SQL and Schemas": {
		stage: "Connect relational design to predicted query results",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"table",
			"primary key",
			"foreign key",
			"constraint",
			"join",
			"mutation preview"
		],
		practiceSection: "relational-schema-and-query-case",
		answerSection: "relational-schema-and-query-key",
		route: "Model supplied fictional entities, choose stable keys and constraints, represent one-to-many and many-to-many relationships, and predict SELECT, WHERE, ORDER, JOIN, NULL, aggregate, insert, update, and delete results from small tables.",
		standardsRoute:
			"Use the supplied local schema, rows, queries, and answer tables as the required route. SQLBolt and dbdiagram remain optional practice surfaces; no account, live database, real record, or destructive command is needed.",
		evidence:
			"The schema-and-query packet includes representative rows, cardinality, constraints, expected columns and rows, order and NULL assumptions, mutation preview, target count, rollback note, and observed or supplied result.",
		primaryReference: {
			label: "SQLite SELECT documentation",
			url: "https://www.sqlite.org/lang_select.html"
		},
		additionalReferences: [
			{
				label: "SQLite foreign key documentation",
				url: "https://www.sqlite.org/foreignkeys.html"
			}
		]
	},
	"JSM12 NoSQL and CRUD": {
		stage: "Implement versioned local CRUD without browser secrets",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"document shape",
			"stable ID",
			"CRUD contract",
			"localStorage",
			"migration",
			"recovery"
		],
		practiceSection: "local-crud-and-persistence-case",
		answerSection: "local-crud-and-persistence-key",
		route: "Define a bounded versioned document, validate it at load, implement create, read, update, and delete against in-memory state, persist with localStorage, migrate one older shape, and recover from missing, malformed, or unavailable storage.",
		standardsRoute:
			"Use JSON and Web Storage locally. JSONBin remains historical context only because authenticated writes require a key that does not belong in browser source; no remote write or hosted account is required.",
		evidence:
			"The CRUD table records stable ID, input, validation, state before and after, persisted form, rendered result, refresh, duplicate or unknown ID, quota or storage failure, migration, and reset.",
		primaryReference: {
			label: "MDN localStorage reference",
			url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
		},
		additionalReferences: [
			{
				label: "MDN JSON reference",
				url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON"
			},
			{
				label: "JSONBin v3 update API reference",
				url: "https://jsonbin.io/api-reference/bins/update"
			}
		]
	},
	"Check-In #2": {
		stage: "Events, requests, and data checkpoint after JSM7–JSM12",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"event flow",
			"canvas input",
			"fixture and fetch",
			"relational model",
			"local CRUD",
			"failure state"
		],
		practiceSection: "events-requests-data-checkpoint-case",
		answerSection: "events-requests-data-checkpoint-key",
		route: "Complete this required checkpoint after JSM12 with a focus-aware event, one geometry or canvas state change, a supplied-fixture data flow, an optional resilient GET, a small relational model, and versioned local CRUD. It can also serve as an optional placement preview before the sequence.",
		standardsRoute:
			"Use local files, fixtures, localStorage, and safe DOM output. Keep public GET refresh optional, open the key only after an independent attempt, and include no remote write credential.",
		evidence:
			"The packet traces input through state and output, covers request and storage failures, predicts query results, verifies keyboard and pointer operation, names the revisit module for each weak area, and keeps the local route complete.",
		primaryReference: {
			label: "MDN using Fetch",
			url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
		}
	},
	"JSM13 Message Board": {
		stage: "Build a safe single-browser message-board model",
		estimatedTime: "6–7 sessions · 45–60 minutes each",
		keyBlocks: [
			"post schema",
			"stable ID",
			"safe text",
			"reviewed URL",
			"nested comment",
			"record limit"
		],
		practiceSection: "safe-message-board-case",
		answerSection: "safe-message-board-key",
		route: "Create fictional posts and comments in versioned local state, validate and cap every field and collection, render text safely, parse and allow only reviewed URLs, persist locally, and preserve predictable focus and status after create, comment, delete, refresh, migration, and reset.",
		standardsRoute:
			"Use native forms, `textContent`, the URL API, localStorage, and semantic lists or articles. The project is not a public service, has no real identity or moderation claim, and requires no remote data store or browser-held credential.",
		evidence:
			"The message-board matrix covers two posts, comment association, duplicate text, markup-shaped input, invalid and failed URLs, missing image, count and length caps, corrupt storage, migration, focus, announcement, refresh, delete, and reset.",
		primaryReference: {
			label: "MDN Node textContent reference",
			url: "https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent"
		},
		additionalReferences: [
			{
				label: "MDN URL API",
				url: "https://developer.mozilla.org/en-US/docs/Web/API/URL_API"
			}
		]
	},
	"JSM14 Quiz Game": {
		stage: "Implement an accessible quiz state machine",
		estimatedTime: "6–7 sessions · 45–60 minutes each",
		keyBlocks: [
			"fixture validation",
			"quiz state",
			"single submit",
			"feedback",
			"canvas alternative",
			"restart"
		],
		practiceSection: "accessible-quiz-state-machine-case",
		answerSection: "accessible-quiz-state-machine-key",
		route: "Load a bounded fictional local fixture, model ready, asking, feedback, complete, and reset states, accept one answer per question, and render question, score, progress, feedback, and controls in the DOM. Canvas remains optional visual enhancement.",
		standardsRoute:
			"Use labeled forms or native buttons, keyboard and pointer parity, visible focus, status announcements, reduced motion, and essential non-canvas content. No JSONBin, remote write, credential, or real learner result is required.",
		evidence:
			"The quiz matrix covers correct, wrong, empty, duplicate submit, exact final question, score integrity, malformed and empty fixture, keyboard path, focus destination, canvas unavailable, complete state, and restart.",
		primaryReference: {
			label: "MDN Canvas accessibility guidance",
			url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage#accessible_content"
		}
	},
	"JSM15 Master Project": {
		stage: "Browser application or game capstone",
		estimatedTime: "10–14 sessions · 45–60 minutes each",
		keyBlocks: [
			"audience and task",
			"state model",
			"effect boundary",
			"data contract",
			"verification",
			"recovery"
		],
		practiceSection: "browser-app-capstone-case",
		answerSection: "browser-app-capstone-key",
		route: "Build one browser-only app or game through vertical slices: define audience, task and non-goals; model state and events; isolate pure logic from effects; implement bounded interaction; add fixture data and optional resilient reads; persist locally when useful; then verify accessibility, failure, recovery, and performance.",
		standardsRoute:
			"Use current browser standards, local files, supplied fictional fixtures, and no browser secret. Canvas, public GET APIs, SQL reasoning, and local CRUD appear only when they serve the selected task and retain complete fallback and recovery routes.",
		evidence:
			"The final packet includes requirements, state and event diagrams, data schema, effect boundaries, expected and observed cases, request and storage failures, keyboard and pointer evidence, canvas alternative, motion, contrast, reflow, frame or record budget, reset, regression, attribution, privacy, limitations, and a three-minute demonstration.",
		primaryReference: {
			label: "WCAG 2.2 quick reference",
			url: "https://www.w3.org/WAI/WCAG22/quickref/"
		}
	}
};

function javascriptLevel2PracticeLink(section: string) {
	return `${JAVASCRIPT_LEVEL_2_PRACTICE_PACK}#${section}`;
}

function javascriptLevel2VerificationLink(section: string) {
	return `${JAVASCRIPT_LEVEL_2_VERIFICATION_GUIDE}#${section}`;
}

function javascriptLevel2SupplementalPath(title: string) {
	if (/extension|challenge/i.test(title)) return "challenge" as const;
	return "choice" as const;
}

function renderJavaScriptLevel2References(flow: JavaScriptLevel2ModuleFlow) {
	return [
		`[${flow.primaryReference.label}](${flow.primaryReference.url})`,
		...(flow.additionalReferences ?? []).map(
			item => `[${item.label}](${item.url})`
		)
	].join(", ");
}

function priorJavaScriptPracticeTitle(moduleTitle: string, itemTitle: string) {
	const practice = itemTitle.endsWith("Transfer Practice")
		? "Transfer Practice"
		: itemTitle.endsWith("Extension Practice")
			? "Extension Practice"
			: null;
	if (!practice) return null;
	if (moduleTitle === "JSM15 Master Project")
		return `${practice}: ${javascriptLevel2SourceCourse.name}`;
	const checkIn = /^Check-In #([12])$/.exec(moduleTitle);
	if (checkIn) return `${practice}: Check-In ${checkIn[1]}`;
	const moduleTopic = /^JSM\d{1,2} (.+)$/.exec(moduleTitle)?.[1];
	return moduleTopic ? `${practice}: ${moduleTopic}` : null;
}

function decorateJavaScriptLevel2Module(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow =
		JAVASCRIPT_LEVEL_2_MODULE_FLOW[
			module.title as (typeof JAVASCRIPT_LEVEL_2_SEQUENCE)[number]
		];
	if (!flow)
		throw new Error(`Missing JavaScript Level 2 flow: ${module.title}`);

	const practiceLink = javascriptLevel2PracticeLink(flow.practiceSection);
	const verificationLink = javascriptLevel2VerificationLink(
		flow.answerSection
	);
	const references = renderJavaScriptLevel2References(flow);

	return {
		...module,
		kind: "module",
		estimatedTime: flow.estimatedTime,
		keyBlocks: [...flow.keyBlocks],
		curriculum: module.curriculum.map((item, index) => ({
			...item,
			content:
				index === 0 && module.title !== "JSM10 APIs and Requests"
					? `**Course flow:** ${flow.stage}. ${flow.route}

**Standards route:** ${flow.standardsRoute}

**Evidence gate:** ${flow.evidence}

**Local continuity:** Complete the [supplied Level 2 case](${practiceLink}) before comparing it with the [verification guide](${verificationLink}). Local files and fixtures remain the completion route when CodePen, public APIs, hosted database tools, remote storage, or pending media are unavailable.

**Current references:** ${references}. Record the browser and viewport, fixture edition, storage schema version, and any external host, API, media, or library version that affects the result.

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
		supplementalProjects: module.supplementalProjects.map(item => {
			const previousTitle = priorJavaScriptPracticeTitle(
				module.title,
				item.title
			);
			return {
				...item,
				...(previousTitle
					? { aliases: [...(item.aliases ?? []), previousTitle] }
					: {}),
				learningPath: javascriptLevel2SupplementalPath(item.title),
				...(item.projectLink
					? {
							datasetLink: item.datasetLink ?? practiceLink,
							mediaLink:
								item.mediaLink ?? flow.primaryReference.url
						}
					: {})
			};
		})
	};
}

const javascriptLevel2ModulesByTitle = new Map(
	javascriptLevel2SourceCourse.modules.map(module => [module.title, module])
);

const javascriptLevel2CoreModules = JAVASCRIPT_LEVEL_2_SEQUENCE.map(title => {
	const module = javascriptLevel2ModulesByTitle.get(title);
	if (!module) throw new Error(`Missing JavaScript Level 2 module: ${title}`);
	return decorateJavaScriptLevel2Module(module);
});

const javascriptLevel2Appendices = javascriptLevel2SourceCourse.modules.filter(
	module => module.kind === "appendix"
);

export const javascriptLevel2Course: RawCourse = {
	...javascriptLevel2SourceCourse,
	modules: [...javascriptLevel2CoreModules, ...javascriptLevel2Appendices]
};
