import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "./types";
import { classroomReferenceItem } from "./classroomReferenceGuides";
import { isCoreProjectTitle } from "./projectGrouping";
import { staticMediaFilename } from "./staticMedia";

export const PYTHON_LEVEL_2_PS1_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/b58d958347f0c3ca6f9d96963a674cc3d00813bf";

export const PYTHON_LEVEL_2_PS2_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/40e195905b59faa845ca0b4418e9fa7537c7e51d";

export const PYTHON_LEVEL_2_PS3_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/db7809a1c101e6d5e5943c8e22bbfed744ded734";

export const PYTHON_LEVEL_2_PS4_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/5d787e78f9d0e72096046c49ee25e9fab53fe045";

const PYTHON_LEVEL_2_PS5_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/6c8442dd68067e1f8cee1f14a5e08bf8e4b06c17";

export const PYTHON_LEVEL_2_PS6_LISTS_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/25e131ee66467d9c05e07b1895ff7a7e96feb1c6";

const PYTHON_LEVEL_2_MUSIC_INTEGRATION_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/7d5f2c7ecf27ed496af1afd576f2ae8424e92f0f";

const PYTHON_LEVEL_2_DICTIONARY_PRACTICE_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/e2808fac8733ae1ec4fa4882848f14c8d372ff74";

const PYTHON_LEVEL_2_SUPPLEMENTAL_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/017313722ab219e4fccd9c1e186c7323033af7df";

const PYTHON_LEVEL_2_SETS_AND_WORD_GAMES_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/6d2a63b50aa113e48935af046b65b118313b8733";

export const PYTHON_LEVEL_2_COLLECTIONS_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/2dec846ce80283885dfe01579a181906e6748985";

const PYTHON_LEVEL_2_CONSOLE_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/96f7196ea540fce55644e2a2d1d0ce97f16de9e8";

export const PYTHON_LEVEL_2_PS14_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/4451de4a1f7dccd55a0175bbf9fe3f2fbe183f70";

const PYTHON_LEVEL_2_CHECK_INS_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/8bc76e6927ae40683bfb79170c378dac2b266cf2";

const PYTHON_LEVEL_2_PENDING_SOURCE_ASSETS = [
	"ps10_field_day.gif",
	"ps10_field_day_ii.gif",
	"ps10_todo_list.gif",
	"ps10_us_capitals_quiz.gif",
	"ps11_bank_account.gif",
	"ps11_calculator.gif",
	"ps11_juni_world.gif",
	"ps12_review_sentiment.gif",
	"ps12_type_racer.mp4",
	"ps13_advanced_typewriter_monkeys.gif",
	"ps13_typewriter_monkeys.gif",
	"ps13_wordsmith.gif",
	"ps14_advanced_blackjack.gif",
	"ps14_blackjack.gif",
	"ps14_game_of_war.gif",
	"ps1_index_picker.mp4",
	"ps1_mad_libs.gif",
	"ps1_relay_race.gif",
	"ps1_space_mountain.gif",
	"ps1_tip_calculator.gif",
	"ps2_calendar_machine.gif",
	"ps2_change_machine.gif",
	"ps2_crazy_nametags.gif",
	"ps2_debugging_loops.gif",
	"ps2_double_or_nothing.gif",
	"ps2_for_loop_fun.gif",
	"ps2_interest_aggregator.gif",
	"ps2_juni_archery.gif",
	"ps2_multiplication_tables.gif",
	"ps2_password_guesser.gif",
	"ps3_ascii_art.gif",
	"ps3_caesar_cipher.gif",
	"ps3_nested_boxes.gif",
	"ps3_password_cracker.gif",
	"ps3_simple_cipher.gif",
	"ps3_uppercase_to_lowercase.gif",
	"ps4_carnival_strength_tester.gif",
	"ps4_credit_card_validator.gif",
	"ps4_debugging_conditionals.gif",
	"ps4_fizzbuzz.gif",
	"ps4_joes_donuts.gif",
	"ps4_number_guesser.gif",
	"ps4_relay_race_statistics.gif",
	"ps4_rock_paper_scissors.gif",
	"ps4_test_statistics.gif",
	"ps5_coin_flipper.gif",
	"ps5_debugging_functions.gif",
	"ps5_dice_roller.gif",
	"ps5_functions_practice.gif",
	"ps5_juni_latin.gif",
	"ps5_number_games.gif",
	"ps6_basketball_stars.gif",
	"ps6_card_shuffler.mp4",
	"ps6_debugging_lists.gif",
	"ps6_dog_breeds.gif",
	"ps6_lists_practice.gif",
	"ps6_song_generator.gif",
	"ps6_stock_trader.gif",
	"ps6_tower_of_terror.gif",
	"ps7_birthday_converter.gif",
	"ps7_coffee_shop.gif",
	"ps7_debugging_dictionaries.gif",
	"ps7_dictionaries_practice.gif",
	"ps7_dictionary_indexing.gif",
	"ps7_song_generator_2.gif",
	"ps7_test_scores.gif",
	"ps8_morse_code.gif",
	"ps9_class_registration.gif",
	"ps9_class_registration_ii.gif",
	"ps9_debugging_sets.gif",
	"ps9_favorite_foods.gif",
	"ps9_sets_practice.gif",
	"ps9_soccer_nationalities.gif",
	"ps_12_evil_hangman.mp4",
	"ps_14_mastermind.mp4",
	"ps_15_master_project.mp4",
	"ps_9_wheel_of_fortune.mp4",
	"python_level_2_check_in_questions.png",
	"python_level_2_concept.png",
	"python_level_2_project.png"
];

const PYTHON_STRING_METHOD_REFERENCE =
	"https://www.w3schools.com/python/python_ref_string.asp";
const PYTHON_LIST_METHOD_REFERENCE =
	"https://www.w3schools.com/python/python_ref_list.asp";
const PYTHON_DICTIONARY_METHOD_REFERENCE =
	"https://www.w3schools.com/python/python_ref_dictionary.asp";
const PYTHON_TUPLE_METHOD_REFERENCE =
	"https://www.w3schools.com/python/python_ref_tuple.asp";
const PYTHON_SET_METHOD_REFERENCE =
	"https://www.w3schools.com/python/python_ref_set.asp";

function conceptBrief({
	evidence,
	focus,
	practice
}: {
	evidence: string;
	focus: string;
	practice: string[];
}) {
	return [
		`**Focus:** ${focus}`,
		`**Practice:**\n${practice.map((item, index) => `${index + 1}. ${item}`).join("\n")}`,
		`**Evidence:** ${evidence}`,
		`**Concept check:** The explanation is complete when the main idea is connected to a runnable example, one edge or awkward case, and the exact Python syntax or data structure that makes the result work.`
	].join("\n\n");
}

function stripFinalPunctuation(text: string) {
	return text.trim().replace(/[.!?]+$/u, "");
}

function lowerFirst(text: string) {
	const trimmed = stripFinalPunctuation(text);
	return trimmed ? trimmed.charAt(0).toLowerCase() + trimmed.slice(1) : "";
}

function joinReadable(items: string[]) {
	if (items.length <= 1) return items[0] ?? "";
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function defaultProjectOutcome(checkpoints: string[]) {
	const checkpointSummary = joinReadable(
		checkpoints.slice(0, 2).map(lowerFirst)
	);
	const evidenceTarget =
		checkpointSummary ||
		"the result matches the stated goal and the code path can be traced";

	return `The finished project is complete when ${evidenceTarget}, and the result can be explained from Python input or setup through state changes to final output.`;
}

function defaultProjectVerification(checkpoints: string[]) {
	const stressTarget = checkpoints.at(-1);
	const specificCheck = stressTarget
		? ` The stress case is tied to this project check: ${stripFinalPunctuation(stressTarget)}.`
		: "";

	return `Run one straightforward case and one stress case that changes an input, boundary value, repeated value, empty collection, or formatting assumption.${specificCheck} Keep the sample input and output evidence with the project notes.`;
}

function projectBrief({
	build,
	checkpoints,
	extension,
	goal,
	outcome
}: {
	build: string[];
	checkpoints: string[];
	extension?: string;
	goal: string;
	outcome?: string;
}) {
	return [
		`**Goal:** ${goal}`,
		`**Outcome:** ${outcome ?? defaultProjectOutcome(checkpoints)}`,
		`**Build path:**\n${build.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
		`**Checkpoints:**\n${checkpoints.map(checkpoint => `- ${checkpoint}`).join("\n")}`,
		`**Verification:** ${defaultProjectVerification(checkpoints)}`,
		extension ? `**Extension:** ${extension}` : ""
	]
		.filter(Boolean)
		.join("\n\n");
}

function reviewBrief({
	evidence,
	focus,
	tasks
}: {
	evidence: string;
	focus: string;
	tasks: string[];
}) {
	return [
		`**Focus:** ${focus}`,
		`**Tasks:**\n${tasks.map((task, index) => `${index + 1}. ${task}`).join("\n")}`,
		`**Evidence:** ${evidence}`
	].join("\n\n");
}

function hideUnavailablePythonLevel2Media(course: RawCourse) {
	const unavailableMedia = new Set(PYTHON_LEVEL_2_PENDING_SOURCE_ASSETS);

	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			if (!item.mediaLink) continue;

			const filename = staticMediaFilename(item.mediaLink);
			if (!filename) continue;
			if (unavailableMedia.has(filename)) delete item.mediaLink;
		}
	}
}

export const pythonLevel2Course: RawCourse = {
	name: "Python Level 2",
	modules: [
		{
			title: "PS1 Variables, Strings, and Input",
			curriculum: [
				{
					title: "Introductions and Setup",
					content: conceptBrief({
						focus: "The first module establishes a reliable edit-run-debug loop before the projects depend on user input, strings, and numeric conversion.",
						practice: [
							'Run a tiny program such as `print("hello world")` and identify exactly where output appears.',
							"Open an existing project, create a blank reference file, and keep reusable examples separate from project submissions.",
							"Change one line, rerun the file, and confirm the output changed for the expected reason."
						],
						evidence:
							"The environment is ready when a small program can be edited, run, inspected in the console, and corrected after a simple typo without losing track of which file is being executed."
					})
				},
				{
					title: "Variables and Strings",
					content: `${conceptBrief({
						focus: "Variables give names to values so later code can reuse or transform them. Strings are ordered sequences of characters, so they support length checks, indexing, and combination with other strings.",
						practice: [
							"Store a name, word, or short phrase in a variable and print it more than once.",
							"Measure the string with `len()` and compare that length to the visible characters, including spaces.",
							"Retrieve the first character, a middle character, and the last character with indexes when the string is long enough."
						],
						evidence:
							"A complete explanation distinguishes the variable name from the value it stores and explains why string indexes begin at 0."
					})}

**Reference:** W3Schools Python string methods: ${PYTHON_STRING_METHOD_REFERENCE}`
				},
				{
					title: "Asking the User for Input",
					content: conceptBrief({
						focus: "`input()` collects text from the user. Programs that need math must convert that text with `int()` or `float()` before using arithmetic.",
						practice: [
							"Collect two or more responses and store each response in a clearly named variable.",
							"Build a sentence from user-provided strings while preserving spaces and punctuation.",
							"Convert a numeric response before adding, subtracting, multiplying, or rounding it."
						],
						evidence:
							"The program output proves which values are still strings and which values have been converted for numeric work."
					})
				},
				{
					title: "Comments",
					content: conceptBrief({
						focus: "Comments clarify intent for a reader and can temporarily remove a line from execution during debugging. They do not fix unclear variable names or replace testing.",
						practice: [
							"Add short comments above sections that collect input, transform values, or print final output.",
							"Comment out one experimental line, rerun the program, and observe which behavior disappeared.",
							"Remove comments that only repeat the exact code and keep comments that explain purpose or assumptions."
						],
						evidence:
							"Useful comments make the program easier to review without hiding what the code actually does."
					})
				},
				{
					title: "PS1 Project 1: Mad Libs",
					content: projectBrief({
						goal: "Create a Mad Libs program that gathers words from the user and inserts them into a complete story.",
						build: [
							"Keep the first adjective prompt from the starter. Add a second adjective, a noun, a present-tense verb, and a past-tense verb.",
							"Store each answer in a clearly named variable.",
							"Print a story that combines fixed story text with the collected words.",
							"Run the story with different answers to confirm the variables control the final output."
						],
						checkpoints: [
							"The story includes every requested word.",
							"Spacing and punctuation are readable.",
							"The explanation can trace one input prompt through to the final printed sentence."
						],
						extension:
							"Add a title, multiple paragraphs, or a replay loop that creates a different story with new answers."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Mad-Libs/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Mad-Libs/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_mad_libs.gif"
				},
				{
					title: "PS1 Project 2: Index Picker",
					content: projectBrief({
						goal: "Build a small string-indexing tool that reveals the character stored at a requested position.",
						build: [
							"Ask for a word or short phrase.",
							"Ask for an index and convert it to an integer.",
							"Print the original word and the character found at that index.",
							"Run planet with indices 0, 2, and 5. The selected characters are p, a, and t."
						],
						checkpoints: [
							"The index is converted before it is used.",
							"The program demonstrates that index 0 points to the first character.",
							"The output makes the selected character easy to identify."
						],
						extension:
							"Check whether the requested index is valid before indexing so the program can print a helpful message instead of crashing."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Index-Picker/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Index-Picker/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_index_picker.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PS1 Supplemental Project 1: Space Mountain",
					content: projectBrief({
						goal: "Track a roller coaster car's remaining safe capacity as riders board one at a time.",
						build: [
							"Use the starter model of 900 pounds and four fictional rider weights.",
							"Ask for four rider weights and convert each response to a number.",
							"Subtract each rider's weight from the remaining capacity.",
							"Print the remaining capacity after each update. Compare four 200-pound riders with 200, 200, 200, and 300 pounds."
						],
						checkpoints: [
							"Every rider changes the same running total.",
							"The printed values make the order of updates clear.",
							"The final output identifies whether capacity remains or has been exceeded."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Space-Mountain/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Space-Mountain/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_space_mountain.gif"
				},
				{
					title: "PS1 Supplemental Project 2: Tip Calculator",
					content: projectBrief({
						goal: "Calculate a restaurant tip and compare whole-dollar rounding with cents-based rounding.",
						build: [
							"Ask for a nonnegative bill in dollars and a tip rate as a decimal, such as 0.18 for 18 percent.",
							"Convert both inputs to numeric values.",
							"Calculate the tip and the total including tip.",
							"Print the tip and total to two decimal places. Show a separate whole-dollar tip estimate rounded down."
						],
						checkpoints: [
							"Percent input is interpreted correctly.",
							"Money output includes clear labels.",
							"A bill of $27.50 at 0.18 gives a tip of $4.95, a total of $32.45, and a round-down estimate of $4."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Tip-Calculator/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Tip-Calculator/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_tip_calculator.gif"
				},
				{
					title: "PS1 Supplemental Project 3: Relay Race",
					content: projectBrief({
						goal: "Calculate total and average relay-race time from four split times.",
						build: [
							"Ask for four lap or runner split times.",
							"Convert the inputs to numbers.",
							"Add the times to find the team total.",
							"Divide by four to find the average split. With splits of 60, 61, 62, and 63 seconds, check for a total of 246 and an average of 61.5."
						],
						checkpoints: [
							"The total and average use numeric addition, not string concatenation.",
							"The output labels the units of time.",
							"The average changes correctly if one split time is changed."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Relay-Race/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Relay-Race/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_relay_race.gif"
				}
			]
		},
		{
			title: "PS2 For Loops and While Loops",
			curriculum: [
				{
					title: "For Loops",
					content: conceptBrief({
						focus: "`for i in range(...)` fits repetition with a known count or a predictable number sequence. The range start, stop, and step determine exactly which values appear.\n\nA start of 1 and step of 2 produce 1, 3, and 5 in this example. The upper boundary 6 is excluded.\n\n```python\nfor number in range(1, 6, 2):\n    print(number)\n```",
						practice: [
							"Print 0 through 9 and identify why the stop value is not included.",
							"Print every third number in a range by changing the step.",
							"Count backward with a negative step.",
							"Print perfect squares by using the loop variable in a calculation."
						],
						evidence:
							"A correct explanation predicts the first value, final printed value, number of iterations, and step direction before the loop runs."
					})
				},
				{
					title: "While Loops",
					content: conceptBrief({
						focus: "`while` loops fit repetition controlled by a changing condition. The loop must move toward a stopping state or it can run forever.\n\nIn this example the condition is true at 68 and 43 cents. The third check sees 18 cents and stops. The counter is 2.\n\n```python\nremaining = 68\nquarters = 0\nwhile remaining >= 25:\n    remaining -= 25\n    quarters += 1\nprint(quarters, remaining)\n```",
						practice: [
							"Write a loop that counts upward until a limit is reached.",
							"Write a loop that keeps asking for input until a target answer appears.",
							"Compare a condition-based `while` loop with `while True` plus an explicit `break`."
						],
						evidence:
							"The loop design is solid when the condition, the update, and the stopping case can be explained separately."
					})
				},
				{
					title: "PS2 Project 1: Crazy Nametags",
					content: projectBrief({
						goal: "Print a name in several patterns to compare `for` loops, `while` loops, indexes, and stepping rules.",
						build: [
							"Use a fictional name such as Ada to trace the starter. The forward letters are A, d, a.",
							"Print the letters forward.",
							"Print every other character by controlling the index or range step.",
							"Print the name backward with a reverse loop. For Ada, expect A and a in the alternating pattern and a, d, A in reverse."
						],
						checkpoints: [
							"At least one version uses a `for` loop.",
							"At least one version uses a `while` loop.",
							"The backward version starts at the last valid index rather than one past the end."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Crazy-Nametags/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Crazy-Nametags/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_crazy_nametags.gif"
				},
				{
					title: "PS2 Project 2: Change Machine",
					content: projectBrief({
						goal: "Convert a number of cents into quarters, dimes, nickels, and pennies.",
						build: [
							"Ask once for a nonnegative whole number of cents. Use the remaining value from the previous coin counter.",
							"Count how many quarters fit and update the remaining cents.",
							"Subtract 10 for each dime, 5 for each nickel, and 1 for each penny. Keep a separate count for each denomination.",
							"Print the final coin breakdown."
						],
						checkpoints: [
							"After each subtraction, the remaining cents decrease by the value of the coin just counted.",
							"The breakdown adds back up to the original amount.",
							"Boundary cases such as 0, 4, 5, 10, 25, and 99 cents are tested."
						],
						extension:
							"Rebuild the solution with integer division and modulo, then compare that version with the loop-and-counter approach."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Change-Machine/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Change-Machine/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_change_machine.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS2 Supplemental Project 1: Interest Aggregator",
					content: projectBrief({
						goal: "Model compound growth over time and print a readable year-by-year projection.",
						build: [
							"Ask for a starting balance and an annual rate as a percent. For an example, use 100 and 5.",
							"Divide the displayed percent by 100 before multiplying the balance by one plus the rate.",
							"Loop through 20 years of growth.",
							"Update the balance each year and print the year number with the projected balance."
						],
						checkpoints: [
							"The balance changes cumulatively rather than resetting each year.",
							"For 100 at 5 percent, the first two year-end values are 105.00 and 110.25.",
							"The output is rounded or formatted so the trend is readable."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Interest-Aggregator/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Interest-Aggregator/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_interest_aggregator.gif"
				},
				{
					id: "python-level-2-ps2-for-loops-and-while-loops-supplemental-ps2-supplemental-project-2-password-guesser",
					title: "PS2 Supplemental Project 2: Target Phrase Game",
					aliases: ["PS2 Supplemental Project 2: Password Guesser"],
					content: projectBrief({
						goal: "Build a guessing loop that continues until the user enters the target phrase.",
						build: [
							"Use the public phrase blue comet from the starter. The program is an offline word game.",
							"Ask for guesses inside a loop.",
							"Track the number of attempts.",
							"Stop only when the guess matches the target exactly."
						],
						checkpoints: [
							"The loop has a clear stopping condition.",
							"The attempt count matches the number of guesses made.",
							"The output distinguishes a failed guess from the final successful guess."
						],
						extension:
							"Add case-insensitive comparison, a maximum attempt limit, or hints after repeated failed guesses."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Password-Guesser/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Password-Guesser/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_password_guesser.gif"
				},
				{
					title: "PS2 Supplemental Project 3: For Loop Fun",
					content: projectBrief({
						goal: "Create structured number and shape patterns with nested loops.",
						build: [
							"Print a repeated row pattern first.",
							"Add an outer loop so the row repeats across multiple lines.",
							"Change the inner-loop range so the pattern grows, shrinks, or shifts by row.",
							"Compare the loop variables used for rows with the loop variables used for columns."
						],
						checkpoints: [
							"The output shape matches the intended row and column counts.",
							"The inner loop controls content inside a row.",
							"The outer loop controls how many rows appear."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-For-Loop-Fun/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-For-Loop-Fun/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_for_loop_fun.gif"
				},
				{
					title: "PS2 Supplemental Project 4: Calendar Machine",
					content: projectBrief({
						goal: "Convert a raw day count into larger calendar-style units.",
						outcome:
							"The final program explains how many whole years, months, weeks, and days fit into the original total, while keeping the leftover days consistent with the chosen unit assumptions.",
						build: [
							"Ask for a number of days and convert it to an integer.",
							"Use a 365-day year, a 30-day month, and a 7-day week. Count in that order using the same remainder.",
							"Update the remaining day count after each unit.",
							"Print the result with clear labels."
						],
						checkpoints: [
							"The chosen year and month assumptions are stated.",
							"The remaining day count is updated in the correct order.",
							"The final units reconstruct the original day count under the chosen assumptions.",
							"Test zero days, a small number of days, and a value large enough to use every unit."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Calendar-Machine/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Calendar-Machine/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_calendar_machine.gif"
				},
				{
					title: "PS2 Supplemental Project 5: Double or Nothing",
					content: projectBrief({
						goal: "Simulate a simple risk-reward game driven by random coin flips and a stopping choice.",
						build: [
							"Begin the simulation with 10 points.",
							"Use Enter to continue and q to keep the current points. Prompt again on any other entry.",
							"Flip a random coin when the player continues.",
							"Double the points after heads, reset the points to zero after tails, and stop on a quit or loss."
						],
						checkpoints: [
							"The current amount is updated in only one place per round.",
							"The game stops cleanly after a loss or a quit choice.",
							"The output explains the result of each flip before the next decision."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Double-or-Nothing/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Double-or-Nothing/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_double_or_nothing.gif"
				},
				{
					title: "PS2 Supplemental Project 6: Debugging Loops",
					content: projectBrief({
						goal: "Repair a loop-based rocket launch simulator by using console evidence instead of guessing.",
						build: [
							"Run the starter and record the first syntax error with its line number. A while statement ends with a colon and its body is indented.",
							"Fix one issue at a time, then rerun the program.",
							"Inspect loop starts, stops, updates, and indentation.",
							"Continue until the launch countdown and post-launch behavior run completely."
						],
						checkpoints: [
							"Each fix is connected to a specific error or observed behavior.",
							"The loop no longer skips values, repeats forever, or stops too early.",
							"The final run demonstrates the complete launch sequence."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Debugging-Loops/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Debugging-Loops/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_debugging_loops.gif"
				},
				{
					title: "PS2 Supplemental Project 7: Multiplication Tables",
					content: projectBrief({
						goal: "Generate a complete multiplication table with nested loops.",
						build: [
							"Create one loop for the first factor.",
							"Create a nested loop for the second factor.",
							"Compute and print each product from 1 x 1 through 12 x 12.",
							"Keep the first factor fixed within each group and leave a blank line between the groups."
						],
						checkpoints: [
							"All 144 facts appear exactly once.",
							"The row factor and column factor are not accidentally swapped in the label.",
							"The structure remains readable when the maximum factor changes."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Multiplication-Tables/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS2_SOURCE}/PS2-Multiplication-Tables/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_multiplication_tables.gif"
				},
				{
					title: "PS2 Supplemental Project 8: Archery Simulator",
					aliases: ["PS2 Supplemental Project 8: Juni Archery"],
					content: projectBrief({
						goal: "Simulate an archery session with nested rounds, random outcomes, and a running score.",
						build: [
							"Loop through five rounds.",
							"Inside each round, simulate three shots.",
							"Generate a random outcome to determine whether each shot is a bullseye.",
							"Track round results and the total number of bullseyes."
						],
						checkpoints: [
							"The nested loops match the round and shot structure.",
							"The total score accumulates across all rounds.",
							"The output makes it possible to verify the total from the printed shot results."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/40e195905b59faa845ca0b4418e9fa7537c7e51d/PS2-Juni-Archery/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/40e195905b59faa845ca0b4418e9fa7537c7e51d/PS2-Juni-Archery/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_juni_archery.gif"
				}
			]
		},
		{
			title: "PS3 ASCII and Ciphers",
			curriculum: [
				{
					title: "ASCII and Ciphers",
					content: conceptBrief({
						focus: '`ord()` gives a character’s Unicode code point, and `chr()` converts a code point back into a character. The ASCII range is 0 through 127. In that range `ord("A")` is 65, `ord("a")` is 97, and `chr(65)` is "A".\n\nFor a lowercase alphabet shift, subtract `ord("a")` to get a position from 0 to 25. Add the shift and take modulo 26 to wrap. For example `z` at position 25 shifted by 1 wraps to position 0, which becomes `a`.',
						practice: [
							"Convert several letters and symbols with `ord()` and compare the returned numbers.",
							"Convert numbers back into characters with `chr()`.",
							"Shift a letter by adding or subtracting from its numeric code.",
							"Discuss why wraparound is needed when a shift moves past `z` or before `a`."
						],
						evidence:
							"A correct cipher explanation names the original character, the numeric transformation, and the final decoded character."
					})
				},
				{
					title: "PS3 Project 1: Simple Cipher",
					content: projectBrief({
						goal: "Represent a sample message as character codes, then add the same numeric offset to every code.",
						build: [
							"Use the starter to read one sample message such as Az!. Then read an integer offset such as 2.",
							"Convert each character of the sample to a numeric code with ord().",
							"Print the plain ASCII sequence with clear spacing.",
							"Add a constant key to each value and print the shifted sequence."
						],
						checkpoints: [
							"Every input character produces one output number.",
							"Spaces between numbers make the encoded result readable.",
							"Az! gives 65 122 33 and offset 2 gives 67 124 35."
						],
						extension:
							"Add a decoder that subtracts the same key and reconstructs the original message."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-Simple-Cipher/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-Simple-Cipher/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_simple_cipher.gif"
				},
				{
					title: "PS3 Project 2: Caesar Cipher",
					content: projectBrief({
						goal: "Build a Caesar cipher that shifts letters through the alphabet and supports decoding with the reverse shift.",
						build: [
							"Ask for a message and shift amount.",
							"Use separate bases for A through Z and a through z and turn each ASCII letter into a position from 0 to 25.",
							"Use (position + shift) % 26 to wrap the position. Decode by using the opposite shift.",
							"Convert positions back to the original letter case and copy spaces, numbers, punctuation, and non-ASCII characters unchanged."
						],
						checkpoints: [
							"`z` shifted forward and `a` shifted backward both wrap correctly.",
							"Encryption and decryption undo one another with the same key.",
							"With shift 1, Zebra-z! 9 becomes Afcsb-a! 9. Apply the opposite shift and confirm the full message is restored."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-Caesar-Cipher/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-Caesar-Cipher/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_caesar_cipher.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS3 Supplemental Project 1: ASCII Art",
					content: projectBrief({
						goal: "Generate a square block of text art from a user-selected size.",
						build: [
							"Ask for the square size.",
							"Build each row with nested loops or string repetition.",
							"Print the requested number of rows.",
							"Test small, medium, and larger sizes."
						],
						checkpoints: [
							"The number of rows equals the number of columns.",
							"Size 1 still works.",
							"The pattern is produced by loop logic rather than manually written rows.",
							"The output remains aligned when the size changes from one digit to two digits if numbers are added later."
						],
						extension:
							"Add hollow squares, diagonal marks, or alternating characters so the row/column condition becomes more meaningful than printing the same repeated symbol every time."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-ASCII-Art/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-ASCII-Art/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_ascii_art.gif"
				},
				{
					title: "PS3 Supplemental Project 2: Uppercase to Lowercase",
					content: projectBrief({
						goal: "Convert uppercase letters to lowercase by using ASCII offsets directly.",
						build: [
							"Ask for a short line such as AZ! or Mix 9.",
							"Convert each character with `ord()`.",
							"Add the uppercase-to-lowercase offset when the character is uppercase.",
							"Convert the result back with `chr()` and build the lowercase word."
						],
						checkpoints: [
							"The solution does not rely on `.lower()`.",
							"Each character transformation can be traced numerically.",
							"Mix 9 becomes mix 9. Lowercase letters and nonletters remain unchanged."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-Uppercase-to-Lowercase/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-Uppercase-to-Lowercase/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_uppercase_to_lowercase.gif"
				},
				{
					title: "PS3 Supplemental Project 3: Nested Boxes",
					content: projectBrief({
						goal: "Print nested or progressively larger box outlines using loop-controlled row and column logic.",
						build: [
							"Choose a maximum box size of at least 3. For 5, print separate outlines with sizes 3, 4, and 5.",
							"Print one box outline correctly before adding more.",
							"Grow or nest the outlines with loops.",
							"Print a mark in the first or last row or column. Print a space for every interior cell."
						],
						checkpoints: [
							"Horizontal and vertical borders line up.",
							"Interior spaces remain empty where expected.",
							"The same logic works for more than one size."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-Nested-Boxes/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS3_SOURCE}/PS3-Nested-Boxes/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_nested_boxes.gif"
				},
				{
					title: "PS3 Supplemental Project 4: Caesar Shift Detective",
					id: "python-level-2-ps3-ascii-and-ciphers-supplemental-ps3-supplemental-project-4-password-cracker",
					aliases: ["PS3 Supplemental Project 4: Password Cracker"],
					content: projectBrief({
						goal: "Compare every Caesar shift on a short classroom puzzle and identify the readable result.",
						build: [
							"Run the starter on the encoded sample phrase Eoxh frphw! and confirm shift 3 gives Blue comet!",
							"Use lowercase and uppercase alphabet offsets. Keep spaces and punctuation as they are.",
							"Put the decoding into one function and call it for all 26 shift numbers. Print the shift next to its output."
						],
						checkpoints: [
							"Shift 0 leaves the sample unchanged and shift 3 produces the only Blue comet! line.",
							"Test C and c with shift 3. Expect Z and z."
						],
						extension:
							"Rank the candidates against a short word list supplied for the puzzle."
					}),
					projectLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS3-Password-Cracker/starter`,
					solutionLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS3-Password-Cracker/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_password_cracker.gif"
				}
			]
		},
		{
			title: "PS4 Conditionals",
			curriculum: [
				{
					title: "Conditionals",
					content: conceptBrief({
						focus: "In an `if`/ `elif`/ `else` chain, Python runs the body of the first true condition. For example, check `height < 50` before `height < 100`. Height 49 matches the first test, and height 50 reaches the second. Separate `if` statements can both run. Use `and` when both parts must be true and `or` when either can be true.",
						practice: [
							"Write a two-branch decision with `if` and `else`.",
							"Add `elif` cases and predict which branch runs first when more than one condition could be true.",
							"Combine comparisons with `and` and `or` for cases where two facts matter.",
							"Test boundary values that sit exactly on the cutoff between branches."
						],
						evidence:
							"A good conditional design explains the order of branches, the boundary cases, and why the final `else` handles everything left."
					})
				},
				{
					title: "PS4 Project 1: Rock, Paper, Scissors",
					content: projectBrief({
						goal: "Build a two-player Rock, Paper, Scissors game that determines ties, wins, losses, and invalid input.",
						build: [
							"Read one move per player. Strip surrounding spaces and convert each move to lowercase.",
							"Reject the round if either move falls outside rock, paper, and scissors.",
							"Check ties before win/loss cases.",
							"Player 1 wins with rock against scissors, paper against rock, or scissors against paper. Player 2 wins the remaining valid unequal combinations."
						],
						checkpoints: [
							"All nine valid move combinations have a correct outcome.",
							"Invalid moves do not accidentally count as wins.",
							"Rock with surrounding spaces and rock tie. Lizard and rock report an invalid round."
						],
						extension:
							"Add replay, a computer opponent, score tracking, or an expanded version such as Rock, Paper, Scissors, Lizard, Spock."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Rock-Paper-Scissors/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Rock-Paper-Scissors/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_rock_paper_scissors.gif"
				},
				{
					title: "PS4 Project 2: FizzBuzz",
					content: projectBrief({
						goal: "Print the classic FizzBuzz sequence while handling overlapping divisibility rules correctly.",
						build: [
							"Loop through the numbers 1 through 50.",
							"Check whether the current number is divisible by both 3 and 5.",
							"Check the single-divisor cases for 3 and 5.",
							"Print the original number when none of the special cases apply."
						],
						checkpoints: [
							"Multiples of 15 print `FizzBuzz`, not only `Fizz` or only `Buzz`.",
							"Check lines 3, 5, 15, 16, and 50 for Fizz, Buzz, FizzBuzz, 16, and Buzz.",
							"The branch order prevents the overlapping case from being swallowed by an earlier condition."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-FizzBuzz/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-FizzBuzz/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_fizzbuzz.gif"
				},
				{
					title: "PS4 Project 3: Credit Card Validator",
					content: projectBrief({
						goal: "Use fictional digit strings to check the arithmetic of a checksum.",
						build: [
							"Read short fictional digit strings such as 1479, 1478, and 109. Require at least two ASCII digits.",
							"Read digits from right to left. Keep the rightmost digit unchanged.",
							"Double every second digit. Subtract 9 from a doubled value above 9.",
							"Add the processed values. The checksum passes when the total is divisible by 10."
						],
						checkpoints: [
							"For 1479, the processed values from right to left are 9, 5, 4, and 2.",
							"1479 and 109 pass with totals of 20 and 10. The sample 1478 fails with total 19.",
							"An empty string, 7, or 12a produces a validation message before the checksum runs."
						],
						extension:
							"Compare the unweighted sum with the checksum total for a sample. Explain what changing one digit does to the total."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Credit-Card-Validator/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Credit-Card-Validator/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_credit_card_validator.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS4 Supplemental Project 1: Carnival Strength Tester",
					content: projectBrief({
						goal: "Classify a carnival strength-test result into a prize tier.",
						build: [
							"Read a whole-number height in inches.",
							"Give no prize below 50, a small stuffed animal from 50 through 99, a frisbee from 100 through 149, and a large stuffed animal from 150 upward.",
							"Compare the height against ordered prize thresholds.",
							"Print the matching prize tier."
						],
						checkpoints: [
							"Test 49, 50, 99, 100, 149, and 150 against the prize rules.",
							"The thresholds are checked in an order that avoids unreachable branches.",
							"The output includes both the measured value and the result."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Carnival-Strength-Tester/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Carnival-Strength-Tester/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_carnival_strength_tester.gif"
				},
				{
					title: "PS4 Supplemental Project 2: Test Statistics",
					content: projectBrief({
						goal: "Compute a small set of summary statistics from five test scores.",
						build: [
							"Collect five whole-number scores from 0 through 100. Replace any invalid entry before advancing to the next score.",
							"Track or compute the highest score.",
							"Track or compute the lowest score.",
							"Calculate and print the average."
						],
						checkpoints: [
							"All inputs are converted before arithmetic.",
							"The average divides by the correct number of scores.",
							"Repeated high or low values still produce the correct result.",
							"For 0, 70, 100, 70, 100, report a low of 0, a high of 100, and an average of 68."
						],
						extension:
							"Add a letter-grade summary, a median, or a dropped-lowest-score version and explain how the summary changes."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Test-Statistics/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Test-Statistics/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_test_statistics.gif"
				},
				{
					title: "PS4 Supplemental Project 3: Relay Race Statistics",
					content: projectBrief({
						goal: "Compare each relay split against the team average.",
						build: [
							"Collect four lap times in seconds. A lower time represents a faster lap.",
							"Compute the total and average.",
							"Compare each split to the average.",
							"Print whether each runner was faster than, slower than, or equal to the average pace."
						],
						checkpoints: [
							"The average is computed once from all four values.",
							"For 50, 60, 55, 55, report average 55. Runner 1 is faster, runner 2 is slower, and runners 3 and 4 match the average.",
							"For 52.5, 52.5, 55, 55, report a tie for the fastest runner."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Relay-Race-Statistics/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Relay-Race-Statistics/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_relay_race_statistics.gif"
				},
				{
					title: "PS4 Supplemental Project 4: Joe's Donuts Opening Day",
					content: projectBrief({
						goal: "Determine which donut-shop promotions apply to a customer number.",
						build: [
							"Read a positive whole-number line position. The first customer also gets free donuts for a year.",
							"Give one opening-day tier. Positions 1–12 get a free dozen. Positions 13–200 get the first dozen for $1, except 144 gets free donuts for a month. Positions 201–500 get 50% off. Position 501 and above get a third donut free with two purchases.",
							"Handle overlapping promotions without losing any applicable reward.",
							"Add the year-round offer in every valid case. Buy a dozen and get the 13th free."
						],
						checkpoints: [
							"Position 1 gets three messages: a free year, a free dozen, and the year-round offer.",
							"Position 144 gets the free month and the year-round offer. Test the tier changes at 12/13, 200/201, and 500/501.",
							"Position 0 prompts for a positive position."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Joes-Donuts-Opening-Day/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Joes-Donuts-Opening-Day/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_joes_donuts.gif"
				},
				{
					title: "PS4 Supplemental Project 5: Number Guesser",
					content: projectBrief({
						goal: "Build a higher/lower number guessing game with a random target.",
						build: [
							"Start with target 27. Ask for whole-number guesses from 1 to 50. After testing, pick a random target once before the loop.",
							"Ask for guesses in a loop.",
							"Print higher or lower feedback after each incorrect guess.",
							"Stop when the guess matches the target and report the attempt count."
						],
						checkpoints: [
							"With target 27 and guesses 20, 30, 27, report too low, too high, then success in three tries.",
							"Guesses are converted before comparison.",
							"With target 27 and first guess 27, report success in one try."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Number-Guesser/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Number-Guesser/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_number_guesser.gif"
				},
				{
					title: "PS4 Supplemental Project 6: Debugging Conditionals",
					content: projectBrief({
						goal: "Debug a ticket-prize script by connecting each wrong result to the conditional rule that produced it.",
						build: [
							"Run the starter and fix its syntax error before comparing results with the prize rules.",
							"A lollipop costs 10 tickets, an action figure 75, a T-shirt 250, and a stuffed animal 350. List every affordable item and the tickets left if that one item is purchased.",
							"Matching T-shirts require lending a friend 6 tickets and still having 250 for one shirt. Check the price boundary both with and without the loan.",
							"Test values at the exact prize cutoffs."
						],
						checkpoints: [
							"With 256 tickets, list the lollipop, action figure, and T-shirt. A shirt alone leaves 6 tickets, and matching shirts are affordable.",
							"Test 9 and 10, 74 and 75, 249 and 250, 255 and 256, and 349 and 350.",
							"The final explanation names at least one conditional bug and why the fix worked."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Debugging-Conditionals/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS4_SOURCE}/PS4-Debugging-Conditionals/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_debugging_conditionals.gif"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content: projectBrief({
						goal: "Review variables, loops, and conditionals in an animal-and-color guessing program.",
						build: [
							"Run the starter with dog and black on separate lines. The animal length is 3.",
							"Complete the variables, loops, and conditionals prompts in this module. Check both versions of the decision.",
							"Record which inputs exercise each branch and which line fixes an unexpected result."
						],
						checkpoints: [
							"Dog and black give a length of 3, a third color character of a, and a correct answer.",
							"Cat and black give Almost there in both decisions. The incomplete color r reports a missing third character and the program continues."
						]
					}),
					contentKind: "assignment",
					preserveInstructions: true,
					projectLink: `${PYTHON_LEVEL_2_CHECK_INS_SOURCE}/PS-Check-in-1/starter`,
					solutionLink: `${PYTHON_LEVEL_2_CHECK_INS_SOURCE}/PS-Check-in-1/solution`
				},
				{
					title: "Check-In #1: Variables",
					content: reviewBrief({
						focus: "Variables, type conversion, string length, indexing, and formatted output.",
						tasks: [
							"Store animal as text and 42 as an integer. Print the word and the text produced by converting 42.",
							"Read an animal and a color and normalize spaces and case. Print the animal length and the third color character when present.",
							"For dog and black, print 3, a, and the combined guess black dog."
						],
						evidence:
							"The work shows the difference between storing a value, printing a value, and transforming a value."
					})
				},
				{
					title: "Check-In #1: Loops",
					content: reviewBrief({
						focus: "`for` loops, `while` loops, range parameters, string iteration, and stop conditions.",
						tasks: [
							"Use for loops to print 0–10, the individual color characters, and 6, 9, 12, 15.",
							"Use a while loop for 0–15. Use another while loop to print every other animal character starting at index 1. With dog, the latter prints o.",
							"As a bonus, use a loop that prints 1–10 and stops with break."
						],
						evidence:
							"The explanation predicts how many times the loop runs and why it stops."
					})
				},
				{
					title: "Check-In #1: Conditionals",
					content: reviewBrief({
						focus: "Branch order, combined conditions, nested conditionals, and boundary cases.",
						tasks: [
							"Compare the guesses with dog and black. Both matching gives Correct answer, exactly one gives Almost there, and neither gives Incorrect answer.",
							"Record cat separately without changing the comparison result.",
							"Recreate the decision with nested conditionals. Compare dog/black, dog/red, cat/black, and cat/red in both versions."
						],
						evidence:
							"The work identifies which branch runs for correct, partially correct, and incorrect inputs."
					})
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content: projectBrief({
						goal: "Compare two letter-shifting rules on identical sample text.",
						build: [
							"For the length rule, shift ASCII letters forward by one when the entire input length is even, or backward by one when it is odd.",
							"Read a second sample. Shift letters forward at even indexes and backward at odd indexes, starting at index 0.",
							"Wrap within the uppercase or lowercase alphabet. Copy punctuation and spaces unchanged. Include them in the length and the indexes."
						],
						checkpoints: [
							"With Az!, the length rule gives Zy! and the index rule gives By!.",
							"For za, the length rule gives ab and the index rule gives az. Empty input produces an empty result."
						]
					}),
					contentKind: "assignment",
					preserveInstructions: true,
					projectLink: `${PYTHON_LEVEL_2_CHECK_INS_SOURCE}/PS-Check-in-1/practice/starter`,
					solutionLink: `${PYTHON_LEVEL_2_CHECK_INS_SOURCE}/PS-Check-in-1/practice/solution`
				}
			],
			supplementalProjects: []
		},
		{
			title: "PS5 Functions",
			curriculum: [
				{
					title: "Functions",
					content: conceptBrief({
						focus: "The call add(2, 3) sends the arguments 2 and 3 to the parameters in the function definition. If the function returns 5, the caller can store it, print it, or use it in another calculation. A local name created in the function belongs to that call.",
						practice: [
							"Compare built-in functions such as `input()`, `print()`, and `str()` with a user-defined helper.",
							"Write one function that prints a result and one function that returns a result.",
							"Trace how argument order affects parameter values.",
							"Call one helper from another helper to build a larger behavior from smaller pieces."
						],
						evidence:
							"A complete function explanation states the inputs, output, side effects, and where the result is used."
					})
				},
				{
					title: "PS5 Project 1: Functions Practice",
					content: projectBrief({
						goal: "Write a set of focused practice functions and explain each function's contract.",
						build: [
							"Use the starter add function as a model. Write subtract with two parameters and multiply with three.",
							"Write an average helper that returns a computed result.",
							"Use loops to compute factorial and powers with nonnegative whole-number inputs for the count or exponent.",
							"Call each function with several test inputs."
						],
						checkpoints: [
							"For 2, 3, and 4, verify a sum of 5, difference of -1, product of 24, and mean of 2.5.",
							"Returned values are used by the caller rather than ignored.",
							"Check factorial(4) = 24 and exponent(2, 3) = 8. Factorial of 0 and a base raised to exponent 0 both return 1."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Functions-Practice/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Functions-Practice/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_functions_practice.gif"
				},
				{
					title: "Parameter Tracing",
					content: reviewBrief({
						focus: "Parameter tracing connects a function call to the values received inside the function body.",
						tasks: [
							"For function1(1, 2, 3), record a = 1, b = 2, and c = 3. Trace temp, then c, then the returned value 5.",
							"Map each argument to its matching parameter by position.",
							"Trace local variables separately from variables outside the function.",
							"Match all seven calls to the function parameters. Predict each result before enabling its print line."
						],
						evidence:
							"Compare the first and third calls to function1 and explain the different results. Compare calls 6 and 7 to function2 and explain why both pass the same values."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Parameter-Tracing/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Parameter-Tracing/solution`
				},
				{
					title: "PS5 Project 2: Coin Flipper",
					content: projectBrief({
						goal: "Estimate heads/tails frequencies with a function and repeated simulation.",
						build: [
							"Run the starter. Trace how flip_coin maps 0 to heads and 1 to tails before returning the label.",
							"Call flip_coin 1000 times in a loop. Before using randomness, trace a four-result sequence of heads, tails, heads, tails.",
							"Count how many times each result appears.",
							"Print totals and percentages."
						],
						checkpoints: [
							"The flip function returns a value instead of printing all results internally.",
							"The four-result sample gives two of each result, or 50% each. In a longer run the counts add to 1000, and the percentages add to 100.",
							"The observed percentages are compared to the expected 50/50 pattern without assuming every run will be exact."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Coin-Flipper/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Coin-Flipper/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_coin_flipper.gif"
				},
				{
					title: "PS5 Project 3: Dice Roller",
					content: projectBrief({
						goal: "Simulate two dice and analyze the distribution of possible sums.",
						build: [
							"Write or reuse a function that returns a random die roll.",
							"Roll two dice per trial. Use 1000 pairs in the simulation. For a dry run use 1/1, 1/6, 2/5, and 6/6.",
							"Track how often each sum appears.",
							"Print a summary that makes common and rare sums visible."
						],
						checkpoints: [
							"Sums range from 2 through 12.",
							"The four pairs produce 2, 7, 7, and 12. Their counts are 1, 2, and 1.",
							"The explanation connects middle sums to more possible dice combinations."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Dice-Roller/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Dice-Roller/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_dice_roller.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS5 Supplemental Project 1: Squawka Zilly Floog",
					content: projectBrief({
						goal: "Build a chain of math helpers where later functions reuse earlier functions.",
						build: [
							"Use the starter zilly(x) = 2 * x + 1. Define floog(x) = x * x - 6 * x + 12.",
							"Return 2 * zilly(x) + 3 * floog(x) from squawka(x).",
							"Print intermediate and final results while testing.",
							"Clean the output once the function chain is correct."
						],
						checkpoints: [
							"Functions are reused rather than copied.",
							"Argument order is consistent across calls.",
							"At x = 4, zilly gives 9, floog gives 4, and squawka gives 30. At x = 0, the results are 1, 12, and 38."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Squawka-Zilly-Floog/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Squawka-Zilly-Floog/solution`
				},
				{
					title: "PS5 Supplemental Project 2: Word Translator",
					aliases: ["PS5 Supplemental Project 2: Juni Latin"],
					content: projectBrief({
						goal: "Write a reusable word-translation function for a simplified Pig Latin-style rule.",
						build: [
							"Read and trim one word made up of letters. Check the input before using the first character.",
							"Define a function that receives one word as a parameter.",
							"Move the first letter to the end, keep its original case, and add ay.",
							"Return and print the translated word."
						],
						checkpoints: [
							"The translation logic lives inside a function.",
							"Cat becomes atCay and a becomes aay. Blank input and two words produce a message.",
							"The original and translated words are both visible in the output."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/6c8442dd68067e1f8cee1f14a5e08bf8e4b06c17/PS5-Juni-Latin/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/6c8442dd68067e1f8cee1f14a5e08bf8e4b06c17/PS5-Juni-Latin/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_juni_latin.gif"
				},
				{
					title: "PS5 Supplemental Project 3: Number Games",
					content: projectBrief({
						goal: "Create predicate helper functions that classify numbers and reuse them across ranges.",
						build: [
							"Extend is_even with is_odd, is_multiple7, is_multiple14, and is_prime. Also implement odd by negating is_even.",
							"Test each helper with known true and false examples.",
							"Print each category for 1 through 50. Rebuild the multiple-of-14 test with is_even and is_multiple7.",
							"Print categories based on which helpers return `True`."
						],
						checkpoints: [
							"Each helper returns a boolean.",
							"Values below 2 are never prime. Check -4, 0, 1, 2, and 49. Only 2 is prime in that sample.",
							"Both multiple-of-14 rules return 14, 28, and 42 across the range."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Number-Games/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Number-Games/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_number_games.gif"
				},
				{
					title: "PS5 Supplemental Project 4: Debugging Functions",
					content: projectBrief({
						goal: "Repair a guessing-game script by tracing function definitions, calls, parameters, and returns.",
						build: [
							"The broken project first reports a syntax error. Repair the function headers before tracing the calls.",
							"Check whether each function is actually called and whether its argument count matches its definition.",
							"Verify parameter counts, argument order, and return values.",
							"Make the game choose one target between 1 and 100 and use one response per guess. Fix the target at 27 while debugging."
						],
						checkpoints: [
							"Every function call matches the function definition.",
							"Returned values are captured where needed.",
							"Enter 20, 30, and 27 against target 27. Expect too low, too high, and correct in three guesses."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Debugging-Functions/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS5_SOURCE}/PS5-Debugging-Functions/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_debugging_functions.gif"
				}
			]
		},
		{
			title: "PS6 Lists and Music",
			curriculum: [
				{
					title: "Lists",
					content: `${conceptBrief({
						focus: "Lists store ordered collections. They are useful when the number of values can grow, when positions matter, or when a program needs to process many related items with one loop.",
						practice: [
							"Create empty and pre-filled lists.",
							"Append values and remove values.",
							"Iterate directly through values and by index when positions matter.",
							"Check membership and print list contents in a readable way."
						],
						evidence:
							"A list-based solution is justified when it avoids many separate variables and allows the same logic to process every item."
					})}

**Reference:** W3Schools Python list methods: ${PYTHON_LIST_METHOD_REFERENCE}`
				},
				{
					title: "PS6 Project 1: Lists Practice",
					content: projectBrief({
						goal: "Generate and analyze several lists to practice list construction, iteration, and aggregation.",
						build: [
							"Run the starter and verify the eleven values from 10 down to 0.",
							"Read a word and build its character list in order. Cat in lowercase becomes c, a, t.",
							"Generate the 100 squares from 1 squared through 100 squared. Remove the ten between 2000 and 3000. Use the factorial helper to generate the values from 1! through 25!.",
							"Write helper functions that compute properties such as sum, maximum, or length."
						],
						checkpoints: [
							"Generated lists have the expected number of items.",
							"Check a sum of -21 and a maximum of -3 with the list [-8, -3, -10]. An empty list has no maximum.",
							"The code distinguishes list construction from list analysis."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Lists-Practice-1/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Lists-Practice-1/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_lists_practice.gif"
				},
				{
					title: "PS6 Project 2: Build a Song",
					content: projectBrief({
						goal: "Represent a melody as list data and generate a playable audio file.",
						build: [
							"Each pair contains a pitch and a duration. In (c4, 4), c4 means middle C and 4 means a quarter note. Use 8 for an eighth note and r in place of a pitch for a rest.",
							"Run the two-note starter and listen to melody.wav. Extend the list to a phrase with at least four pitches and one rest.",
							"Render at 120 beats per minute. Use Download WAV in the IDE to save each version. To render on a computer, download the project and run python3 main.py from the extracted folder.",
							"Change note order or duration values and compare the result."
						],
						checkpoints: [
							"The music data is stored as structured list values.",
							"At 120 beats per minute, a quarter note lasts about half a second. Changing the first note from 4 to 2 should lengthen the output by about half a second.",
							"Compare two saved versions. Identify the list edit and where its effect is audible."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Build-a-Song/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Build-a-Song/solution`
				},
				{
					title: "PS6 Project 3: Song Generator",
					content: projectBrief({
						goal: "Generate a song from user-provided note data stored in a list structure.",
						build: [
							"Run the one-note starter. Extend it to collect a pitch and a duration for each pair.",
							"Trim spaces and lowercase the pitch. Accept c4 through b4, c5, or r for a rest. Accept duration 1, 2, 4, or 8.",
							"Append only completed pairs. Stop at six pairs or when q is entered at the pitch prompt.",
							"Play song.wav and save it with Download WAV. The project ZIP includes the synthesizer for running python3 main.py on a computer."
						],
						checkpoints: [
							"Enter C4 with duration 4, r with duration 8, and e4 with duration 2. Enter q. Hear a short C, a rest, and a longer E.",
							"An unsupported pitch or a duration of 3 prompts again before appending a pair.",
							"Entering q with an empty song prints a message and skips rendering."
						],
						extension:
							"Add a menu that lets the user preview, delete, or replace a note before generating the final file."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Song-Generator/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Song-Generator/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_song_generator.gif"
				}
			],
			supplementalProjects: [
				classroomReferenceItem("melody"),
				{
					title: "PS6 Supplemental Project 1: Tower of Terror",
					content: projectBrief({
						goal: "Store rider weights in a list and compute ride-summary values.",
						build: [
							"Collect up to ten fictional rider weights as positive whole numbers. Enter q to finish and replace invalid responses before increasing the entry count.",
							"Print the full weight list.",
							"Compute total weight.",
							"Compute average weight."
						],
						checkpoints: [
							"The number of list entries matches the number of riders entered.",
							"The sample 80, 120, q produces a list with two weights, a total of 200, and an average of 100.",
							"Entering q first reports that the average is unavailable. Entering 0 prompts for a replacement."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Tower-of-Terror/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Tower-of-Terror/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_tower_of_terror.gif"
				},
				{
					title: "PS6 Supplemental Project 2: Basketball Stars",
					content: projectBrief({
						goal: "Store player statistics in nested lists and detect triple-double performances.",
						build: [
							"Represent each player's points, rebounds, and assists together.",
							"Store five rows with three entries per row. Change the first row and check that the other four rows stay unchanged.",
							"Loop through players and inspect each stat category.",
							"Print which players meet the triple-double threshold."
						],
						checkpoints: [
							"Nested indexing retrieves the intended stat.",
							"A row of [10, 10, 9] does not qualify. A row of [10, 10, 10] qualifies because the threshold is at least 10 in all three categories.",
							"Match each flagged player to the original row of points, rebounds, and assists."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Basketball-Stars/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Basketball-Stars/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_basketball_stars.gif"
				},
				{
					title: "PS6 Supplemental Project 3: Stock Trader",
					content: projectBrief({
						goal: "Analyze stock trade histories stored in starter lists.",
						build: [
							"Inspect the structure of the starter trade-history lists.",
							"Read the last item as the most recent price. Use the fixed dataset to check the last GOOGL value of 1122.00.",
							"Report the latest value and mean to two decimal places. When a list is empty, report that it has no prices.",
							"Print a clear summary for every company."
						],
						checkpoints: [
							"Indexing retrieves the intended recent trade.",
							"The average divides by the number of trades in that company's list.",
							"The sample list [10, 20, 30] gives latest 30.00 and mean 20.00. An empty list gives no prices."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Stock-Trader/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Stock-Trader/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_stock_trader.gif"
				},
				{
					title: "PS6 Supplemental Project 4: Dog Breeds",
					content: projectBrief({
						goal: "Store dog breeds in a list and print derived information for each entry.",
						build: [
							"Use the seven nonempty names in the starter. It already displays the first breed, beagle.",
							"Loop through every breed.",
							"Print the breed name, first letter, and length.",
							"Format the output consistently."
						],
						checkpoints: [
							"The same loop handles every breed.",
							"Indexing is safe for the provided breed names.",
							"Check beagle with b and 6 letters, greyhound with g and 9, and pug with p and 3.",
							"If names are collected from input in an extension, skip a blank entry before indexing."
						],
						extension:
							"Add sorting, filtering by first letter, or a count of long breed names to turn the list into a small searchable catalog."
					}),
					projectLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Dog-Breeds/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Dog-Breeds/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_dog_breeds.gif"
				},
				{
					title: "PS6 Supplemental Project 5: Card Shuffler",
					content: projectBrief({
						goal: "Represent a deck as a list and shuffle it through repeated random swaps.",
						build: [
							"Generate 52 numeric ranks. Every rank from 1 through 13 appears four times.",
							"Pick two indexes from 0 through 51. For a fixed demonstration, swap the initial cards at positions 0 and 4.",
							"Swap the values at those positions.",
							"Repeat the swap process many times and print the resulting deck."
						],
						checkpoints: [
							"The deck keeps the same number of cards after shuffling.",
							"No card values are lost or duplicated by the swap operation.",
							"Zero swaps keeps the sorted deck. Compare 10, 50, 100, and 500 swaps. Each output still contains four of every rank."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Card-Shuffler/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Card-Shuffler/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_card_shuffler.mp4"
				},
				{
					title: "PS6 Supplemental Project 6: Debugging Lists",
					content: projectBrief({
						goal: "Debug an ice-cream survey program by tracing list operations and indexes.",
						build: [
							"Run the starter and record its first syntax error.",
							"Fix the empty list and the append operation. Then repair the loops that read the responses.",
							"Fix one list issue at a time.",
							"Enter chocolate mudslide, vanilla, pistachio, CHOCOLATE MUDSLIDE, and strawberry after each repair."
						],
						checkpoints: [
							"Indexes stay within list bounds.",
							"All five normalized responses print in the order received.",
							"The final counts are two for chocolate mudslide and one for pistachio. Changes to case and spaces leave the totals the same."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Debugging-Lists/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS6_LISTS_SOURCE}/PS6-Debugging-Lists/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_debugging_lists.gif"
				}
			]
		},
		{
			title: "PS7 Dictionaries",
			curriculum: [
				{
					title: "Dictionaries",
					content: `${conceptBrief({
						focus: "Dictionaries map keys to values. They are usually clearer than parallel lists when one value is looked up by name, code, category, or identifier.",
						practice: [
							"Create a dictionary with several key-value pairs.",
							"Look up values by key and handle missing keys deliberately.",
							"Add and update entries.",
							"Iterate through keys, values, or key-value pairs depending on the task."
						],
						evidence:
							"A dictionary design is justified when the key explains how the program finds the value."
					})}

**Reference:** W3Schools Python dictionary methods: ${PYTHON_DICTIONARY_METHOD_REFERENCE}`
				},
				{
					title: "PS7 Project 1: Dictionaries Practice",
					content: projectBrief({
						goal: "Practice dictionary construction through vocabulary, computed values, and frequency counts.",
						build: [
							"Run the starter to look up cake in the five-word glossary. Add a new key and definition.",
							"Map the integers 1 through 25 to their squares and factorials. Verify a square of 625 for 25 and a factorial of 120 for 5.",
							"Convert a word or phrase to lowercase. Count only letters. Use the previous count for a repeated key and start at zero when the key is absent.",
							"Print entries in a readable format."
						],
						checkpoints: [
							"Keys and values are chosen intentionally for each dictionary.",
							"Banana gives a count of 3 for a, 1 for b, and 2 for n. Banana! gives the same counts.",
							"The same lookup pattern works across multiple dictionary examples."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS7-Dictionaries-Practice/starter`,
					solutionLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS7-Dictionaries-Practice/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_dictionaries_practice.gif"
				},
				{
					title: "PS7 Project 2: Song Generator 2",
					content: projectBrief({
						goal: "Upgrade the song generator by translating human-readable duration names through a dictionary.",
						build: [
							"Run the starter and verify that quarter maps to 4. Map whole, half, quarter, and eighth to 1, 2, 4, and 8.",
							"Collect up to six pitches or rests with duration names. Trim and lowercase each name, then look up its value.",
							"Enter q to finish. Use the IDE audio result to play or download named_song.wav. The downloaded project also runs with python3 main.py."
						],
						checkpoints: [
							"Enter c4 with quarter, r with eighth, and e4 with half. Expect pairs c4 and 4, r and 8, and e4 and 2.",
							"An unknown duration prompts again before a pair is appended. A song with no entries prints a message without rendering."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_MUSIC_INTEGRATION_SOURCE}/PS7-Song-Generator-2/starter`,
					solutionLink: `${PYTHON_LEVEL_2_MUSIC_INTEGRATION_SOURCE}/PS7-Song-Generator-2/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_song_generator_2.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS7 Supplemental Project 1: Birthday Converter",
					content: projectBrief({
						goal: "Convert numeric birthday text into a written date.",
						build: [
							"Run the starter and see how month 2 maps to February. Read a sample date in mm/dd/yyyy.",
							"Check that the three parts are numbers with lengths 2, 2, and 4. Use datetime.date to verify the day and month before looking them up.",
							"For days 11 through 13, use th. Otherwise map the last digit to st, nd, or rd for 1, 2, or 3 and use th for other values."
						],
						checkpoints: [
							"02/29/2024 gives February 29th, 2024. 02/29/2023 reports that the date does not exist.",
							"Compare 11th, 12th, and 13th with 21st, 22nd, and 23rd. A malformed date prompts for the expected format."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_DICTIONARY_PRACTICE_SOURCE}/PS7-Birthday-Converter/starter`,
					solutionLink: `${PYTHON_LEVEL_2_DICTIONARY_PRACTICE_SOURCE}/PS7-Birthday-Converter/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_birthday_converter.gif"
				},
				{
					title: "PS7 Supplemental Project 2: Test Scores",
					content: projectBrief({
						goal: "Store multiple test scores per person and compute average scores.",
						build: [
							"Read the number of fictional names and tests. Trim names and use lowercase dictionary keys. Prompt again for a blank or repeated name.",
							"For each test, read one whole-number score from 0 through 100 for every name. Append to that name's score list.",
							"Divide the score total by that name's score count. Report No scores for an empty list.",
							"Store or print the average results."
						],
						checkpoints: [
							"The values are lists, not a single overwritten score.",
							"For ari and bea, enter 80 and 100 for test 1, then 90 and 70 for test 2. The two averages are 85.",
							"Try one name and zero tests. Entering ARI after ari asks for a replacement without changing the existing score list."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS7-Test-Scores/starter`,
					solutionLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS7-Test-Scores/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_test_scores.gif"
				},
				{
					title: "PS7 Supplemental Project 3: Coffee Shop",
					content: projectBrief({
						goal: "Replace parallel menu lists with a dictionary and print a readable menu.",
						build: [
							"Run the starter to see Coffee priced at $2.50. Check that every name has one price and each name appears once.",
							"Pair each name with its price and store the pairs in a dictionary. Loop through the entries with items().",
							"Use a two-decimal format for each price."
						],
						checkpoints: [
							"Coffee displays $2.50 and Vanilla Latte displays $4.00.",
							"Adding a name and its price gives one more row. An unmatched price or duplicate item produces a clear error."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_DICTIONARY_PRACTICE_SOURCE}/PS7-Coffee-Shop/starter`,
					solutionLink: `${PYTHON_LEVEL_2_DICTIONARY_PRACTICE_SOURCE}/PS7-Coffee-Shop/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_coffee_shop.gif"
				},
				{
					title: "PS7 Supplemental Project 4: Dictionary Indexing",
					content: `${projectBrief({
						goal: "Trace nested data structures and extract target values from dictionaries, lists, and tuples.",
						build: [
							"Run the starter. Trace how the dictionary key s2 retrieves the word one.",
							"For seven, use key l2, then select index 1, then use key d5.",
							"Retrieve two through eight. Write down the type and the key or index used at each step."
						],
						checkpoints: [
							"The program prints one through eight, one word per line.",
							"For the lookup that returns seven, the containers encountered are a dictionary, a list, and a dictionary."
						]
					})}

**Reference:** W3Schools Python tuple methods: ${PYTHON_TUPLE_METHOD_REFERENCE}`,
					projectLink: `${PYTHON_LEVEL_2_DICTIONARY_PRACTICE_SOURCE}/PS7-Dictionary-Indexing/starter`,
					solutionLink: `${PYTHON_LEVEL_2_DICTIONARY_PRACTICE_SOURCE}/PS7-Dictionary-Indexing/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_dictionary_indexing.gif"
				},
				{
					title: "PS7 Supplemental Project 5: Debugging Dictionaries",
					content: projectBrief({
						goal: "Repair a candy counter by tracing dictionary keys, updates, and lookup behavior.",
						build: [
							"Run the starter and record the first syntax error. Fix the dictionary entry and run again.",
							"Use the candy name as the key when reading and changing a count. Subtract one from each positive count.",
							"Set Wafer bar to zero. Add four to Mint with a default count of zero if that key is absent."
						],
						checkpoints: [
							"The original total is 42. The outcome includes Caramel 14, Wafer bar 0, and Mint 4.",
							"The expected final total is 35. A count initially at zero stays at zero when items are removed."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_DICTIONARY_PRACTICE_SOURCE}/PS7-Debugging-Dictionaries/starter`,
					solutionLink: `${PYTHON_LEVEL_2_DICTIONARY_PRACTICE_SOURCE}/PS7-Debugging-Dictionaries/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_debugging_dictionaries.gif"
				}
			]
		},
		{
			title: "PS8 Ciphers and Music",
			curriculum: [
				{
					title: "PS8 Project 1: Morse Code",
					content: projectBrief({
						goal: "Translate between text and Morse code and render the result as an audible signal.",
						build: [
							"Run the starter to see A map to .-. Use the same dictionary to encode letters and invert it to decode.",
							"Separate letter codes with spaces and words with slashes. Offer e to encode and d to decode. Report unsupported letters or unknown tokens.",
							"Use one timing unit for a dot and three for a dash. Use gaps of one unit between symbols, three between letters, and seven between words.",
							"Play or download morse.wav in the IDE. For a downloaded project, run python3 main.py in the extracted folder. Long messages still produce text when they exceed the 100-unit audio limit."
						],
						checkpoints: [
							"Encode A I as .- / .. and decode the result back to A I.",
							"The audio takes 15 timing units, including seven quiet units between the two words. An unknown token gives a clear error."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_MUSIC_INTEGRATION_SOURCE}/PS8-Morse-Code/starter`,
					solutionLink: `${PYTHON_LEVEL_2_MUSIC_INTEGRATION_SOURCE}/PS8-Morse-Code/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps8_morse_code.gif"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PS9 Sets",
			curriculum: [
				{
					title: "Sets",
					content: `${conceptBrief({
						focus: "Sets store unique values without preserving a meaningful order. They are useful for membership tests, deduplication, and comparing groups.",
						practice: [
							"Create sets directly and from lists or strings.",
							"Add and remove values.",
							"Check membership with `in`.",
							"Compare two sets with union, intersection, and difference."
						],
						evidence:
							"A set-based solution is appropriate when uniqueness or group comparison matters more than order."
					})}

**Reference:** W3Schools Python set methods: ${PYTHON_SET_METHOD_REFERENCE}`
				},
				{
					title: "PS9 Project 1: Sets Practice",
					content: projectBrief({
						goal: "Practice set creation, comparison, filtering, and deduplication.",
						build: [
							"Start with {1, 2, 3, 4, 5} and {4, 5, 6, 7, 8}. Then create two random sets of five distinct integers from 1 through 10.",
							"Print union and intersection, then report whether the second set contains 1.",
							"Convert two words to lowercase. Add only letters to the sets and print their shared letters.",
							"Write helper functions that filter set values by conditions."
						],
						checkpoints: [
							"Duplicate values collapse to one set entry.",
							"The fixed union contains 1 through 8 and the intersection is {4, 5}. Banana and Band share a, b, and n.",
							"Filtering {1, 2, 3, 4} for even values gives {2, 4}. Filtering cat, bat, and house for three-letter words gives bat and cat. Preserve the inputs."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS9-Sets-Practice/starter`,
					solutionLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS9-Sets-Practice/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_sets_practice.gif"
				},
				{
					title: "PS9 Project 2: Letter Puzzle",
					id: "python-level-2-ps9-sets-curriculum-ps9-project-2-wheel-of-fortune",
					aliases: ["PS9 Project 2: Wheel of Fortune"],
					content: projectBrief({
						goal: "Build a word-guessing game that uses sets to track target letters and guessed letters.",
						build: [
							"Use programming as the target. Display a blank for each letter until it is guessed.",
							"Create one set for unique letters in the target word.",
							"Keep a set of distinct guesses. Accept one ASCII letter, convert uppercase, and ask again after an invalid or repeated entry.",
							"Give fifteen distinct valid guesses. A new valid guess uses one attempt. Win when every target letter is in the guesses, or reveal the word after all fifteen attempts."
						],
						checkpoints: [
							"Repeated letters do not require repeated guesses.",
							"The guesses p, r, o, g, a, m, i, n reveal the word in eight attempts. A repeated r or a blank adds no attempt.",
							"The win check tests whether the set of unique target letters is a subset of all guesses."
						],
						extension:
							"Add replay, random word selection, wrong-guess tracking, or a displayed puzzle board."
					}),
					projectLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS9-Wheel-of-Fortune/starter`,
					solutionLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS9-Wheel-of-Fortune/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_9_wheel_of_fortune.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PS9 Supplemental Project 1: Class Registration",
					content: projectBrief({
						goal: "Clean class rosters by removing duplicates and reporting real enrollment counts.",
						build: [
							"Run the starter to see the number of registrations before removing repeated names.",
							"Convert each roster to a set to remove duplicates.",
							"Compute the actual enrollment count.",
							"Print the cleaned roster and count for each course."
						],
						checkpoints: [
							"Duplicates are removed without manual special cases.",
							"The count comes from the cleaned set.",
							"The Biology, Computer Science, and English counts are 8, 9, and 7. Both Sarah and Sara remain in the cleaned Biology roster."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_SUPPLEMENTAL_SOURCE}/PS9-Class-Registration/starter`,
					solutionLink: `${PYTHON_LEVEL_2_SUPPLEMENTAL_SOURCE}/PS9-Class-Registration/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_class_registration.gif"
				},
				{
					title: "PS9 Supplemental Project 2: Class Registration II",
					content: projectBrief({
						goal: "Apply enrollment caps after roster deduplication and identify waitlisted students.",
						build: [
							"Use the Design, Computing, and Studio samples. Scan sign-ups in original order and use a set to skip names already seen.",
							"Use a limit of six unique names per class. Add the first six to an ordered enrollment list, then place later unique names on an ordered waitlist.",
							"Design has Ari, Bea, Cleo, Dara, Eli, and Fay enrolled. Gus and Hana wait in that order.",
							"Print both groups clearly."
						],
						checkpoints: [
							"Capacity is enforced after duplicates are removed.",
							"Waitlisted students are not also counted as enrolled.",
							"Computing reaches exactly six unique names and Studio has three. Neither has a waitlist. Repeated entries occupy one place."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS9-Class-Registration-II/starter`,
					solutionLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS9-Class-Registration-II/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_class_registration_ii.gif"
				},
				{
					title: "PS9 Supplemental Project 3: Favorite Foods",
					content: projectBrief({
						goal: "Compare two people or groups by shared and unique favorite foods.",
						build: [
							"Collect five entries per group. Trim spaces and use lowercase. Ask again for blank input and collapse repeated names.",
							"Compute the shared favorites with intersection.",
							"Compute foods unique to each set with difference.",
							"Print each comparison category."
						],
						checkpoints: [
							"For Group A {pear, apple, rice} and Group B {pear, rice, pasta}, the shared values are pear and rice.",
							"Only Group A has apple and only Group B has pasta. An empty comparison category displays none.",
							"The explanation names which set operation produced each result."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS9-Favorite-Foods/starter`,
					solutionLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS9-Favorite-Foods/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_favorite_foods.gif"
				},
				{
					title: "PS9 Supplemental Project 4: Soccer Nationalities",
					content: projectBrief({
						goal: "Combine dictionary lookup with set deduplication to summarize team nationalities.",
						build: [
							"Represent player nationalities with a dictionary that maps player names to countries.",
							"Loop through the player entries.",
							"Add each nationality to a set.",
							"Print the distinct countries in alphabetical order and count them."
						],
						checkpoints: [
							"The sample roster has eleven players and eight distinct countries. Spain appears once in the country list.",
							"The dictionary keeps player identity separate from nationality grouping.",
							"The output makes the distinction between players and countries clear."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_SETS_AND_WORD_GAMES_SOURCE}/PS9-Soccer-Nationalities/starter`,
					solutionLink: `${PYTHON_LEVEL_2_SETS_AND_WORD_GAMES_SOURCE}/PS9-Soccer-Nationalities/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_soccer_nationalities.gif"
				},
				{
					title: "PS9 Supplemental Project 5: Debugging Sets",
					content: projectBrief({
						goal: "Debug a capture-the-flag tracker by inspecting set operations and state after each change.",
						build: [
							"Run the starter and find the setup line that raises an AttributeError.",
							"Repair set creation, add and remove operations, membership checks, and the union of the two captured rosters.",
							"Fix one problem at a time.",
							"Print or inspect set contents after each important step."
						],
						checkpoints: [
							"Set operations match the intended game rule.",
							"Duplicate entries do not create fake progress.",
							"After entering n, y, Jared, Jared is in the captured roster and absent from team 1's field roster."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_SETS_AND_WORD_GAMES_SOURCE}/PS9-Debugging-Sets/starter`,
					solutionLink: `${PYTHON_LEVEL_2_SETS_AND_WORD_GAMES_SOURCE}/PS9-Debugging-Sets/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_debugging_sets.gif"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content: projectBrief({
						goal: "Review functions, lists, dictionaries, and sets by extending one small program.",
						build: [
							"Run the starter with its built-in sample 15 and 22. Verify the result is 330.",
							"Complete the functions, lists, dictionaries, and sets prompts. Run fixed lottery cases before trying random values.",
							"Record the final guest list, jersey lookup, digit-count dictionary size, and shared ingredient."
						],
						checkpoints: [
							"The remaining guests are Ben and Mina in order.",
							"The digit-count dictionary maps 15 distinct keys from 0 through 1000 to their decimal length.",
							"Only salt is shared by the recipes and garlic belongs to exactly one."
						]
					}),
					contentKind: "assignment",
					preserveInstructions: true,
					projectLink: `${PYTHON_LEVEL_2_CHECK_INS_SOURCE}/PS-Check-in-2/starter`,
					solutionLink: `${PYTHON_LEVEL_2_CHECK_INS_SOURCE}/PS-Check-in-2/solution`
				},
				{
					title: "Check-In #2: Functions",
					content: reviewBrief({
						focus: "Function definitions, calls, parameters, return values, imports, and small simulations.",
						tasks: [
							"Call multiply with 15 and 22 and check the 330 result.",
							"Write a lottery-result function that takes a win flag and a prize amount. Check one loss and one fixed win of 75.",
							"Draw a random flag from 0–1 and a random prize from 1–1000. Print the function result."
						],
						evidence:
							"The solution identifies what each function receives, returns, and changes."
					})
				},
				{
					title: "Check-In #2: Lists",
					content: reviewBrief({
						focus: "List construction, mutation, iteration, formatting, and generated numeric sequences.",
						tasks: [
							"Append Ava, Ben, and Mina to an empty list and remove Ava.",
							"The first item is now Ben. Print Ben and Mina on separate lines.",
							"Use loops to build the list from 1 through 20 and a list of its ten even values."
						],
						evidence:
							"The list is used to simplify repeated work rather than to hide several unrelated variables."
					})
				},
				{
					title: "Check-In #2: Dictionaries",
					content: reviewBrief({
						focus: "Key-value modeling, lookup behavior, dictionary updates, iteration, and generated dictionaries.",
						tasks: [
							"Start with Parker 3, Reed 11, and Rivera 7. Look up Reed, add Diaz 10, and add Curry 30 only when absent.",
							"Display each player with the associated jersey number.",
							"Sample 15 distinct integers from 0 through 1000. Map each to the length of its decimal text. For example, 10 maps to 2."
						],
						evidence:
							"The solution explains why each key is stable enough to retrieve the matching value."
					})
				},
				{
					title: "Check-In #2: Sets",
					content: reviewBrief({
						focus: "Uniqueness, membership tests, intersections, unions, and deduplication.",
						tasks: [
							"Use garlic, onion, and salt in one recipe and apple, cinnamon, and salt in the other. Remove onion from the first.",
							"Compare the union and intersection. The union has four ingredients and only salt is shared. Garlic belongs to one recipe.",
							"Make a set from banana and verify the three unique letters are a, b, and n."
						],
						evidence:
							"The answer distinguishes unique membership from ordered sequence data."
					})
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content: projectBrief({
						goal: "Use a set to count unique letters and words while retaining the total word count.",
						build: [
							"Run the starter with Banana, banana! and verify that only a, b, and n count as letters.",
							"Read a paragraph, convert it to lowercase, and replace each nonletter with a space. Then split on whitespace.",
							"Keep the complete word list and create a set from it. Print the total and unique word counts."
						],
						checkpoints: [
							"Red blue red. gives two unique words out of three. Red,blue red gives the same counts.",
							"A paragraph with only spaces and punctuation produces zero words."
						]
					}),
					contentKind: "assignment",
					preserveInstructions: true,
					projectLink: `${PYTHON_LEVEL_2_CHECK_INS_SOURCE}/PS-Check-in-2/practice/starter`,
					solutionLink: `${PYTHON_LEVEL_2_CHECK_INS_SOURCE}/PS-Check-in-2/practice/solution`
				}
			],
			supplementalProjects: []
		},
		{
			title: "PS10 To-Do List",
			curriculum: [
				{
					title: "PS10 Project 1: To-Do List",
					content: projectBrief({
						goal: "Build an interactive to-do list with menu-driven list operations.",
						build: [
							"Run the starter and enter 1 to add a task. Store each nonempty task in order.",
							"Use 1 to add, 2 to remove, 3 to quit, and 4 to display the list.",
							"Display task positions starting at 1. Remove by position so identical task names can be treated as separate entries.",
							"Validate removal choices before mutating the list."
						],
						checkpoints: [
							"The program loop keeps running until the user chooses to quit.",
							"Add read, stretch, and read. Remove position 3. The first read and the stretch task remain in that order.",
							"Try removal positions 0, 20, and text. The list remains intact. An empty list displays No tasks."
						],
						extension:
							"Add priority labels, completed-task status, saving/loading, or due-date sorting."
					}),
					projectLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS10-Todo-List/starter`,
					solutionLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS10-Todo-List/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_todo_list.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS10 Supplemental Project 1: US Capitals Quiz",
					content: projectBrief({
						goal: "Run a state-capitals quiz with dictionary lookup and score tracking.",
						build: [
							"Read the two included text files and pair corresponding lines in a dictionary. The first pair is Alabama and Montgomery.",
							"Ask quiz questions in a loop.",
							"Ignore capitalization and surrounding spaces when comparing an answer with the expected capital.",
							"On a wrong answer show the correct capital and end the quiz. Print the final score when the session ends."
						],
						checkpoints: [
							"The state prompt and capital answer come from the same dictionary entry.",
							"The score increments only after correct answers.",
							"When asked about Alabama, MONTGOMERY earns one point. A different spelling ends the quiz."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_SUPPLEMENTAL_SOURCE}/PS10-US-Capitals-Quiz/starter`,
					solutionLink: `${PYTHON_LEVEL_2_SUPPLEMENTAL_SOURCE}/PS10-US-Capitals-Quiz/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_us_capitals_quiz.gif"
				},
				{
					title: "PS10 Supplemental Project 2: Field Day",
					content: projectBrief({
						goal: "Assign classmates to event rosters and compare group membership.",
						build: [
							"Record ten fictional names in arrival order. Ask again for a blank or repeated name, ignoring spaces and case around the name.",
							"Accept 1 for kickball, 2 for capture the flag, 3 for both, and 4 for neither. Retry other choices.",
							"Build one list per event and one for neither. Use the recorded choice to decide where each name belongs.",
							"Print the groups clearly."
						],
						checkpoints: [
							"Use ari 1, bea 2, cleo 3, dara 4, eli 1, fay 2, gus 3, hana 4, ira 1, and jai 2 as the ten entries.",
							"The kickball list is ari, cleo, eli, gus, ira. The flag list is bea, cleo, fay, gus, jai. The neither list is dara and hana.",
							"The data structure choice matches whether order or uniqueness matters."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS10-Field-Day/starter`,
					solutionLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS10-Field-Day/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_field_day.gif"
				},
				{
					title: "PS10 Supplemental Project 3: Field Day II",
					content: projectBrief({
						goal: "Randomly divide a class into two teams while tracking unassigned players.",
						build: [
							"Start with the ten names in the starter. Keep the original list and use a working copy for assignments.",
							"Choose one random unassigned name at a time. Alternate Team Red and Team Blue, starting with Red.",
							"Remove assigned students from the unassigned group.",
							"After each pair of assignments, print both team lists and the unassigned count. If the final round has one player, report that round too."
						],
						checkpoints: [
							"No student appears on both teams.",
							"Every assigned student is removed from the unassigned group.",
							"Ten distinct names give five per team. For three names, Red gets two and Blue gets one. Empty and one-name rosters finish without an invalid random choice."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS10-Field-Day-II/starter`,
					solutionLink: `${PYTHON_LEVEL_2_COLLECTIONS_SOURCE}/PS10-Field-Day-II/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_field_day_ii.gif"
				}
			]
		},
		{
			title: "PS11 Bank Account",
			curriculum: [
				{
					title: "PS11 Project 1: Bank Account",
					content: projectBrief({
						goal: "Create a console bank-account simulator with login, balances, and transaction actions.",
						build: [
							"Use the sample login names ari and bea. Run the starter with ari and demo-ari. Each account has an access phrase and balance in one record.",
							"Check the current access phrase before letting someone sign in or change it.",
							"Offer deposit, withdrawal, balance, phrase change, and logout commands. Return to login after logout and accept q to exit there.",
							"Use positive whole-dollar amounts. Reject a withdrawal above the balance before changing it."
						],
						checkpoints: [
							"An incorrect phrase leaves the program at login.",
							"Deposit 20 and withdraw 7. A withdrawal of 14, a negative deposit, and a text amount should each leave the balance at 13.",
							"Log out and use bea with demo-bea. Bea's balance is still 0. Sign in again as ari and verify the balance remains 13 until the program restarts."
						],
						extension:
							"Keep a history of successful transactions for each fictional account."
					}),
					projectLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS11-Bank-Account/starter`,
					solutionLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS11-Bank-Account/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps11_bank_account.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS11 Supplemental Project 1: Calculator",
					content: projectBrief({
						goal: "Build a calculator from small arithmetic helper functions.",
						build: [
							"Run the starter's addition example. Then add a menu for +, -, *, /, %, ^, and !. Use q to quit.",
							"Read one whole number for factorial and two for the other operations. Use inputs from -1000 through 1000 and factorial inputs and exponents from 0 through 100.",
							"Call one helper per operation. Show the expression and result, such as 2 ^ 5 = 32."
						],
						checkpoints: [
							"12 / 3 prints 4.0, and 0! prints 1.",
							"Dividing by zero or taking a remainder with zero reports a problem and returns to the menu.",
							"An unknown operation returns to the menu before asking for operands."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS11-Calculator/starter`,
					solutionLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS11-Calculator/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps11_calculator.gif"
				},
				{
					title: "PS11 Supplemental Project 2: Theme Park Planner",
					aliases: ["PS11 Supplemental Project 2: Juni World"],
					content: projectBrief({
						goal: "Plan a theme-park visit by tracking ride choices and remaining time.",
						build: [
							"Represent ride names and estimated durations in a dictionary.",
							"Begin with a 360-minute budget and let the user enter q to finish.",
							"Let the user choose rides from a menu.",
							"Reject any ride that takes more time than remains. Otherwise subtract its duration and add it to the plan."
						],
						checkpoints: [
							"Ride durations come from the dictionary.",
							"Two visits to String Mountain leave 100 minutes. A third visit does not fit, while Concatenation Carousel fits exactly.",
							"The final plan lists chosen rides and unused time."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/017313722ab219e4fccd9c1e186c7323033af7df/PS11-Juni-World/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/017313722ab219e4fccd9c1e186c7323033af7df/PS11-Juni-World/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps11_juni_world.gif"
				}
			]
		},
		{
			title: "PS12 Type Racer",
			curriculum: [
				{
					title: "Time Module",
					content: conceptBrief({
						focus: "Use `time.sleep()` for a countdown and `time.monotonic()` for a duration. Subtract two readings from the same monotonic clock to get elapsed seconds.",
						practice: [
							"Create a short countdown with `time.sleep()`.",
							"Take the start reading after displaying the target.",
							"Take the end reading after the matching response. A reading of 13.75 minus 10.50 gives a duration of 3.25 seconds.",
							"Run the same example twice and explain why the two durations can differ."
						],
						evidence:
							"A timing program is correct when it measures a duration from two timestamps rather than hard-coding how long the user took."
					})
				},
				{
					title: "PS12 Project 1: Typing Speed Practice",
					id: "python-level-2-ps12-type-racer-curriculum-ps12-project-1-type-racer",
					aliases: ["PS12 Project 1: Type Racer"],
					content: projectBrief({
						goal: "Measure how long it takes to enter a target sentence exactly.",
						build: [
							"Run the starter and type Rain taps on the glass. Include the period to match.",
							"Choose p for the fixed practice sentence, or use Enter to select a random sentence and show a countdown.",
							"Start the monotonic clock when the target is visible. Count each attempt until the text matches. Allow :quit to end the round."
						],
						checkpoints: [
							"Enter the sample without its period and then enter it correctly. Expect a match in two attempts.",
							"The elapsed time begins after the countdown and includes both attempts.",
							":quit ends the round without an elapsed result."
						],
						extension:
							"Report words per minute when the elapsed time is greater than zero, or highlight the first differing character."
					}),
					projectLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS12-Type-Racer/starter`,
					solutionLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS12-Type-Racer/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps12_type_racer.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PS12 Supplemental Project 1: Review Sentiment",
					content: projectBrief({
						goal: "Classify a review by comparing its words to positive and negative vocabularies.",
						build: [
							"Read one short English review.",
							"Lowercase the review and split it into runs of letters a through z, treating punctuation as a boundary.",
							"Compare words against positive and negative word sets.",
							"Show each match count out of the total word count. Classify by the higher count, with equal counts labeled neutral."
						],
						checkpoints: [
							"Great, but BAD. yields three words and one match in each category. The result is neutral.",
							"An empty or punctuation-only review reports zero scorable words.",
							"The program uses only the supplied vocabulary to interpret a review."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_SUPPLEMENTAL_SOURCE}/PS12-Review-Sentiment/starter`,
					solutionLink: `${PYTHON_LEVEL_2_SUPPLEMENTAL_SOURCE}/PS12-Review-Sentiment/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps12_review_sentiment.gif"
				},
				{
					title: "PS12 Supplemental Project 2: Evil Wheel of Fortune",
					content: projectBrief({
						goal: "Implement a harder word-guessing game that delays choosing a fixed secret word.",
						build: [
							"Load the included dictionary, choose a length from three through eight, and keep candidates of that length.",
							"Filter possible words after each guess.",
							"Choose a response pattern that keeps the largest useful word family.",
							"Spend a guess when the pattern stays the same. Stop when the word is revealed, guesses run out, or the user enters quit."
						],
						checkpoints: [
							"The possible-word list only contains words consistent with previous answers.",
							"The computer's responses remain logically possible.",
							"The final word belongs to the remaining candidate set."
						],
						extension:
							"Display the candidate count after each guess or compare the strategy to a normal fixed-word version."
					}),
					projectLink: `${PYTHON_LEVEL_2_SETS_AND_WORD_GAMES_SOURCE}/PS12-Evil-Wheel-of-Fortune/starter`,
					solutionLink: `${PYTHON_LEVEL_2_SETS_AND_WORD_GAMES_SOURCE}/PS12-Evil-Wheel-of-Fortune/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_12_evil_hangman.mp4"
				}
			]
		},
		{
			title: "PS13 Wordsmith",
			curriculum: [
				{
					title: "PS13 Project 1: Wordsmith",
					content: projectBrief({
						goal: "Build a timed word game from seven random letters and a valid-word list.",
						build: [
							"Choose seven distinct lowercase letters; a letter may repeat within a guess.",
							"Load the supplied valid_words.txt as stripped lowercase words.",
							"Set a 60-second deadline with time.monotonic(). Check before and after input(); discard an answer received at or after the deadline.",
							"Accept :quit for a clean exit. Reject empty, repeated, unavailable-letter or non-dictionary guesses. Add len(word) once per accepted word and print the final score."
						],
						checkpoints: [
							"Guesses use only available letters.",
							"Repeated guesses do not score twice.",
							"A late answer never scores; EOF and :quit end the round cleanly."
						],
						extension:
							"For letters a,c,e,i,n,r,t, cat then cat then crate scores 8 before :quit. The console checks its deadline when input returns. Add guaranteed vowels, replay, high scores or word-length difficulty as extensions."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/a840f54eb6a55718f6305544adc937c32fa516ee/PS13-Wordsmith/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/a840f54eb6a55718f6305544adc937c32fa516ee/PS13-Wordsmith/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps13_wordsmith.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS13 Supplemental Project 1: Typewriter Monkeys",
					content: projectBrief({
						goal: "Simulate random typing until the newest three-letter sequence forms a valid word.",
						build: [
							"Load or define a set of valid three-letter words.",
							"Generate random letters one at a time.",
							"Track the most recent three-letter window.",
							"Stop at the first valid word or after 10,000 letters. Report the found word and the number of generated letters."
						],
						checkpoints: [
							"A fixed stream of x, c, a, t with a set containing only cat first matches on the fourth letter.",
							"Membership checking uses the word set efficiently.",
							"The final output includes the found word and attempt count."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_SETS_AND_WORD_GAMES_SOURCE}/PS13-Typewriter-Monkeys/starter`,
					solutionLink: `${PYTHON_LEVEL_2_SETS_AND_WORD_GAMES_SOURCE}/PS13-Typewriter-Monkeys/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps13_typewriter_monkeys.gif"
				},
				{
					title: "PS13 Supplemental Project 2: Advanced Typewriter Monkeys",
					content: projectBrief({
						goal: "Generalize random typing to search for valid words of length `n` and observe how runtime changes.",
						build: [
							"Open valid_words.txt beside main.py. Group its words by length and ask for a length that exists in the file.",
							"Add one letter at a time and keep the latest n letters. Check for a match once the window reaches n.",
							"Choose p to practice with xcatmint. In random mode, stop after 20,000 letters if a match has not appeared."
						],
						checkpoints: [
							"In practice mode, length 3 finds cat after four letters. Length 4 finds mint after eight.",
							"Report the letter count for a match or a completed search without one.",
							"Compare several random runs for each length. Both the length and number of possible target words affect how often a run succeeds."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS13-Advanced-Typewriter-Monkeys/starter`,
					solutionLink: `${PYTHON_LEVEL_2_CONSOLE_SOURCE}/PS13-Advanced-Typewriter-Monkeys/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps13_advanced_typewriter_monkeys.gif"
				}
			]
		},
		{
			title: "PS14 Blackjack",
			curriculum: [
				{
					title: "PS14 Project 1: Simple Blackjack",
					content: projectBrief({
						goal: "Build a simplified card game with separate player and dealer hands.",
						build: [
							"Build a deck with four of each value from 2 through 11. Deal two cards to each hand.",
							"Use h to hit, s to stay, and q to quit. End the player turn at 21 and stop the round above 21.",
							"Have the dealer draw below 17. Compare the totals and report a bust separately from an ordinary win."
						],
						checkpoints: [
							"Choose p for practice. The player begins at 17. Staying lets the dealer draw 3 to reach 18 and win.",
							"Two surviving totals of 17 tie. Replay the practice round to verify both hands are dealt fresh."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS14_SOURCE}/PS14-Simple-Blackjack/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS14_SOURCE}/PS14-Simple-Blackjack/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps14_blackjack.gif"
				},
				{
					title: "PS14 Project 2: Advanced Blackjack",
					content: projectBrief({
						goal: "Use named cards and a shared helper to score hands with aces.",
						build: [
							"Jack, Queen, and King each count as 10. Count every ace as 1 first.",
							"If an ace is present and adding 10 keeps the total at or below 21, add 10. Use this rule for both hands.",
							"A two-card 21 ends the opening deal. Two such hands tie."
						],
						checkpoints: [
							"Choose p, hit twice, and stay. The player's totals are 17, 15, and 19. The dealer reaches 18.",
							"The dealer stops at a best value of 17 or higher, including Ace and 6."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS14_SOURCE}/PS14-Advanced-Blackjack/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS14_SOURCE}/PS14-Advanced-Blackjack/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps14_advanced_blackjack.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS14 Supplemental Project 1: High Card Rounds",
					id: "python-level-2-ps14-blackjack-supplemental-ps14-supplemental-project-1-game-of-war",
					aliases: ["PS14 Supplemental Project 1: Game of War"],
					content: projectBrief({
						goal: "Compare ten pairs of card draws and count wins and ties.",
						build: [
							"In each round draw two independent values from 2 to 10.",
							"Update exactly one counter and print who won or whether the round tied.",
							"Compare the two final win counts to name an overall winner or report an overall tie."
						],
						checkpoints: [
							"Enter Ari, Bea, and p to use fixed practice draws. Expect Ari 4, Bea 3, and ties 3.",
							"Both win counts and the tie count add up to ten."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS14_SOURCE}/PS14-Game-of-War/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS14_SOURCE}/PS14-Game-of-War/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps14_game_of_war.gif"
				},
				{
					title: "PS14 Supplemental Project 2: Signal Digits",
					id: "python-level-2-ps14-blackjack-supplemental-ps14-supplemental-project-2-mastermind",
					aliases: ["PS14 Supplemental Project 2: Mastermind"],
					content: projectBrief({
						goal: "Compare exact positions and count repeated digits in a hidden signal.",
						build: [
							"Generate four digits from 0 through 5. Use 2032 when the user chooses p for practice.",
							"Set exact positions aside. Count each remaining match by using one occurrence of its digit.",
							"Offer eight trials. A one-use digit-sum hint costs one trial, and malformed input uses none."
						],
						checkpoints: [
							"Against 2032, trial 2230 gives two exact and two misplaced. Trial 2222 gives two exact and zero misplaced.",
							"The practice hint shows 7. Only the first hint spends a trial. A match or the trial limit ends the puzzle."
						]
					}),
					projectLink: `${PYTHON_LEVEL_2_PS14_SOURCE}/PS14-Mastermind/starter`,
					solutionLink: `${PYTHON_LEVEL_2_PS14_SOURCE}/PS14-Mastermind/solution`,
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_14_mastermind.mp4"
				}
			]
		},
		{
			title: "PS15 Master Project",
			curriculum: [
				{
					title: "PS15 Project 1: Master Project",
					content: projectBrief({
						goal: "Design and build a larger console project that combines the main Python Level 2 skills.",
						build: [
							"Choose a project direction such as trivia, a virtual pet, a dice game, a text RPG, or another console application with meaningful state.",
							"Outline the main program loop, user actions, data structures, and helper functions before implementation.",
							"Build a small playable or usable version first.",
							"Add polish only after the core data and control flow are reliable."
						],
						checkpoints: [
							"The project uses at least three major course ideas such as functions, loops, lists, dictionaries, sets, random, or timing.",
							"The main loop, data model, and helper functions can be explained separately.",
							"The finished program handles ordinary input and at least one invalid or edge-case input."
						],
						extension:
							"Add save/load, scoring, levels, configuration, or replay if those features strengthen the core design instead of distracting from it."
					}),
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_15_master_project.mp4"
				},
				{
					title: "Master Project Presentation",
					content: reviewBrief({
						focus: "The presentation explains how the project works, why it was structured that way, and what tradeoffs were made.",
						tasks: [
							"Describe the user flow from program start to program end.",
							"Identify the most important variables, functions, and data structures.",
							"Show one bug or design decision that required revision.",
							"Run a short demo with an ordinary path and one edge case."
						],
						evidence:
							"A strong presentation connects code choices to behavior instead of only showing that the final program runs."
					})
				},
				{
					title: "Course Recap",
					content: reviewBrief({
						focus: "The recap connects the individual projects into a map of Python Level 2 skills and possible next directions.",
						tasks: [
							"Review variables, strings, input, loops, ASCII/ciphers, conditionals, functions, lists, dictionaries, sets, timing, and larger game structure.",
							"Identify which skills feel automatic and which still need deliberate practice.",
							"Compare next-course options such as Python Level 3, Java Level 1, Data Science in Python, PyGame, or JavaScript Level 1 based on goals."
						],
						evidence:
							"The next step follows from demonstrated strengths and gaps, not only from completing the last module."
					})
				}
			],
			supplementalProjects: []
		}
	]
};

interface PythonLevel2FlowConfig {
	title: string;
	estimatedTime: string;
	keyBlocks: string[];
	choiceCurriculumTitles?: string[];
	challengeCurriculumTitles?: string[];
	projectThread: string;
}

const PYTHON_LEVEL_2_FLOW: PythonLevel2FlowConfig[] = [
	{
		title: "PS1 Variables, Strings, and Input",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"input()",
			"int() / float()",
			"string indexing",
			"len()",
			"formatted output"
		],
		projectThread:
			"Establish a reliable edit-run-debug loop, then trace user input through conversion and string operations. Mad Libs proves complete input-to-output flow; Index Picker proves safe indexing."
	},
	{
		title: "PS2 For Loops and While Loops",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"for ... in range()",
			"while condition",
			"loop variable",
			"update step",
			"termination check"
		],
		projectThread:
			"Use Crazy Nametags to make repetition visible, then build Change Machine around a traceable loop invariant and tested boundary values. Optional projects provide targeted loop transfer."
	},
	{
		title: "PS3 ASCII and Ciphers",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"ord()",
			"chr()",
			"character offset",
			"wraparound",
			"encoded sample text"
		],
		projectThread:
			"Translate characters to numbers and back before building ciphers. Simple Cipher establishes the transformation; Caesar Cipher adds a reusable shift and wraparound cases."
	},
	{
		title: "PS4 Conditionals",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"if / elif / else",
			"comparison operators",
			"boolean expression",
			"branch coverage",
			"boundary value"
		],
		challengeCurriculumTitles: ["PS4 Project 3: Credit Card Validator"],
		projectThread:
			"Use Rock, Paper, Scissors and FizzBuzz to practice mutually exclusive branches and boundary tests. Credit Card Validator is the challenge because it combines branching with multi-step validation."
	},
	{
		title: "Check-In #1",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"input and conversion",
			"loop trace",
			"conditional branch",
			"edge case",
			"debug evidence"
		],
		choiceCurriculumTitles: ["Check-In #1: Additional Practice Project"],
		projectThread:
			"Diagnose variables, loops, and conditionals separately, then assign the additional project only when a specific gap needs another application."
	},
	{
		title: "PS5 Functions",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: ["def", "parameter", "argument", "return", "local scope"],
		choiceCurriculumTitles: ["PS5 Project 3: Dice Roller"],
		projectThread:
			"Trace parameters and return values before extracting repeated logic. Functions Practice and Coin Flipper form the required path; Dice Roller is an alternate random-function build."
	},
	{
		title: "PS6 Lists and Music",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"list index",
			"append()",
			"remove()",
			"for item in list",
			"random choice"
		],
		challengeCurriculumTitles: ["PS6 Project 3: Song Generator"],
		projectThread:
			"Practice list creation, indexing, mutation, and traversal. Build a fixed phrase first, then let the user build a song by adding and checking ordered pitch and duration pairs."
	},
	{
		title: "PS7 Dictionaries",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"key-value pair",
			"dictionary lookup",
			"get()",
			"items()",
			"missing-key case"
		],
		projectThread:
			"Move from positional list data to named key-value data. Dictionaries Practice verifies lookup and update behavior; Song Generator 2 applies the structure to a richer data model."
	},
	{
		title: "PS8 Ciphers and Music",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"mapping table",
			"dictionary translation",
			"unknown symbol",
			"word boundary",
			"round-trip check"
		],
		projectThread:
			"Use Morse Code as an integration studio: choose a direction, translate with a dictionary, preserve word boundaries, handle unknown symbols, and verify a round trip."
	},
	{
		title: "PS9 Sets",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"set()",
			"add() / remove()",
			"membership",
			"union / intersection",
			"duplicate elimination"
		],
		projectThread:
			"Contrast sets with lists and dictionaries using duplicate and membership cases. Sets Practice establishes set operations. Letter Puzzle uses them to track guesses through a complete round."
	},
	{
		title: "Check-In #2",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"function trace",
			"list mutation",
			"dictionary lookup",
			"set membership",
			"structure selection"
		],
		choiceCurriculumTitles: ["Check-In #2: Additional Practice Project"],
		projectThread:
			"Compare the same small problem across functions, lists, dictionaries, and sets. Use the additional project only after identifying which structure or function boundary needs reinforcement."
	},
	{
		title: "PS10 To-Do List",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"command loop",
			"task collection",
			"add / view / remove",
			"invalid command",
			"clean exit"
		],
		projectThread:
			"Build the first sustained console application around a small command loop. Ship add, view, remove, invalid-command, and exit paths before adding optional features."
	},
	{
		title: "PS11 Bank Account",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"account state",
			"deposit",
			"withdrawal guard",
			"transaction history",
			"menu loop"
		],
		projectThread:
			"Model state changes with explicit rules and guard conditions. Verify deposits, valid withdrawals, rejected withdrawals, repeated actions, and clean exit before optional account features."
	},
	{
		title: "PS12 Type Racer",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"time module",
			"elapsed time",
			"accuracy",
			"words per minute",
			"zero-time guard"
		],
		projectThread:
			"Measure elapsed time and check the text separately. Trace a mismatch, a match, and an early exit before adding speed or accuracy statistics."
	},
	{
		title: "PS13 Wordsmith",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"seven-letter set",
			"valid-word lookup",
			"duplicate guesses",
			"monotonic deadline",
			"word-length score"
		],
		projectThread:
			"Build a timed seven-letter word game from the supplied dictionary. Check letter membership and duplicate guesses, score each accepted word once, and reject answers received at or after the deadline. Replay and richer scoring are extensions."
	},
	{
		title: "PS14 Blackjack",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"deck representation",
			"hand total",
			"hit / stand",
			"dealer rule",
			"win / loss / tie"
		],
		challengeCurriculumTitles: ["PS14 Project 2: Advanced Blackjack"],
		projectThread:
			"Ship Simple Blackjack with a traceable deck, hand totals, player choices, dealer rules, and all end states. Advanced Blackjack is the challenge after replay and edge cases are reliable."
	},
	{
		title: "PS15 Master Project",
		estimatedTime: "6–10 sessions · 45–60 minutes each",
		keyBlocks: [
			"project scope",
			"minimum usable version",
			"data model",
			"helper functions",
			"test and presentation"
		],
		projectThread:
			"Choose a finishable console application, build a minimum usable version, and verify ordinary, edge, invalid-input, and replay paths before optional polish. Present one design decision and one repaired failure."
	}
];

const PYTHON_LEVEL_2_CHALLENGE_TITLE_RE =
	/advanced|debugging|caesar shift detective|extension|field day ii|class registration ii|evil wheel of fortune|signal digits|archery simulator|stock trader|double or nothing/i;
const PYTHON_LEVEL_2_COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const PYTHON_LEVEL_2_NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const PYTHON_LEVEL_2_LEADING_HYPHENS_RE = /^-+/;
const PYTHON_LEVEL_2_TRAILING_HYPHENS_RE = /-+$/;

function pythonLevel2Slugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(PYTHON_LEVEL_2_COMBINING_MARKS_RE, "")
		.replace(PYTHON_LEVEL_2_NON_ALPHANUMERIC_RE, "-")
		.replace(PYTHON_LEVEL_2_LEADING_HYPHENS_RE, "")
		.replace(PYTHON_LEVEL_2_TRAILING_HYPHENS_RE, "");
}

function preservePythonLevel2Ids(
	module: RawCourseModule,
	legacyModuleId: string
) {
	for (const [items, prefix] of [
		[module.curriculum, "curriculum"],
		[module.supplementalProjects, "supplemental"]
	] as const) {
		for (const item of items) {
			item.id ??= pythonLevel2Slugify(
				`${legacyModuleId}-${prefix}-${item.title}`
			);
		}
	}
}

function pythonLevel2SupplementalPath(
	item: Pick<RawCourseModuleItem, "title">
): CourseItemLearningPath {
	return PYTHON_LEVEL_2_CHALLENGE_TITLE_RE.test(item.title)
		? "challenge"
		: "choice";
}

function configurePythonLevel2Module(
	module: RawCourseModule,
	config: PythonLevel2FlowConfig
) {
	const legacyModuleId = pythonLevel2Slugify(
		`python-level-2-${module.title}`
	);
	module.id ??= legacyModuleId;
	preservePythonLevel2Ids(module, legacyModuleId);

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

	for (const item of module.curriculum) item.learningPath = "core";
	for (const item of movedPractice) {
		item.learningPath = challengeTitles.has(item.title)
			? "challenge"
			: "choice";
	}
	for (const item of module.supplementalProjects) {
		item.learningPath = pythonLevel2SupplementalPath(item);
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

function configurePythonLevel2Flow(course: RawCourse) {
	const modulesByTitle = new Map(
		course.modules.map(module => [module.title, module])
	);

	course.modules = PYTHON_LEVEL_2_FLOW.map(config => {
		const module = modulesByTitle.get(config.title);
		if (!module) {
			throw new Error(`Python Level 2 flow is missing ${config.title}.`);
		}
		return configurePythonLevel2Module(module, config);
	});
}

hideUnavailablePythonLevel2Media(pythonLevel2Course);
configurePythonLevel2Flow(pythonLevel2Course);
