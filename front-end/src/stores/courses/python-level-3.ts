import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "./types";
import {
	gitCourseGuideLink,
	mergeSortFrameGuide
} from "./classroomReferenceGuides";
import { isCoreProjectTitle } from "./projectGrouping";
import { isKnownPendingStaticMedia, staticMediaUrl } from "./staticMedia";

const SORT_ANIMATIONS = {
	bubble: staticMediaUrl("py3_bubble_sort_wikimedia.gif"),
	insertion: staticMediaUrl("py3_insertion_sort_wikimedia.gif"),
	merge: staticMediaUrl("py3_merge_sort_wikimedia.gif"),
	quick: staticMediaUrl("py3_quicksort_wikimedia.gif"),
	selection: staticMediaUrl("py3_selection_sort_wikimedia.gif")
} as const;

const SORT_ANIMATION_SOURCES = {
	bubble: "**Animation source:** [Bubble-sort-example-300px.gif](https://commons.wikimedia.org/wiki/File:Bubble-sort-example-300px.gif), Swfung8 via Wikimedia Commons, CC BY-SA 3.0.",
	insertion:
		"**Animation source:** [Insertion-sort-example-300px.gif](https://commons.wikimedia.org/wiki/File:Insertion-sort-example-300px.gif), Swfung8 via Wikimedia Commons, CC BY-SA 3.0.",
	merge: "**Animation source:** [Merge-sort-example-300px.gif](https://commons.wikimedia.org/wiki/File:Merge-sort-example-300px.gif), Swfung8 via Wikimedia Commons, CC BY-SA 3.0.",
	quick: "**Animation source:** [Sorting quicksort anim.gif](https://commons.wikimedia.org/wiki/File:Sorting_quicksort_anim.gif), RolandH via Wikimedia Commons, CC BY-SA 3.0.",
	selection:
		"**Animation source:** [Selection-Sort-Animation.gif](https://commons.wikimedia.org/wiki/File:Selection-Sort-Animation.gif), Joestape89 via Wikimedia Commons, CC BY-SA 3.0."
} as const;

const SOURCE_PROJECT_MEDIA_BY_TITLE: Record<string, string> = {
	"AM1 Project 1: Mad Libs": "am_1_mad_libs.mp4",
	"AM1 Project 2: Fictional Language Verifier":
		"am_1_junian_language_verifier.mp4",
	"AM1 Project 3: Command Assistant": "am_1_juni_assistant.mp4",
	"AM2 Project 1: Functions Practice": "am_2_functions_practice.mp4",
	"AM2 Project 2: Lists Practice": "am_2_lists_practice.mp4",
	"AM3 Project 1: Python Fundamentals Problem Set": "am_3_recap.mp4",
	"AM4 Project 1: Recursive Factorials": "am_4_recursive_factorials.mp4",
	"AM4 Project 2: Recursive Exponents": "am_4_recursive_exponents.mp4",
	"AM4 Project 3: Recursive Fibonacci Numbers":
		"am_4_recursive_fibonacci_numbers.mp4",
	"AM4 Supplemental Project 1: Binary Converter": "am_4_binary_converter.mp4",
	"AM5 Project 1: Recursive Cascade": "am_5_recursive_cascade.mp4",
	"AM5 Project 2: Recursive Palindrome Checker":
		"am_5_recursive_palindrome_checker.mp4",
	"AM5 Project 3: Parentheses Validator": "am_5_parentheses_validator.mp4",
	"AM5 Supplemental Project 1: Recursive Sum and Max":
		"am_5_recursive_sum_and_max.mp4",
	"AM5 Supplemental Project 2: Substring Generator":
		"am_5_substring_generator.mp4",
	"AM6 Project 1: Linear Search Implementation": "am_6_linear_search.mp4",
	"AM7 Project 1: Binary Search Implementation": "am_7_binary_search.mp4",
	"AM7 Project 2: Reverse Number Guesser": "am_7_reverse_number_guesser.mp4",
	"AM7 Project 3: Runtime Comparator": "am_7_runtime_comparator.mp4",
	"AM7 Supplemental Project 1: Number Guesser": "am_7_number_guesser.mp4",
	"AM8 Project 1: Selection Sort": "am_8_selection_sort.mp4",
	"AM8 Project 2: Insertion Sort": "am_8_insertion_sort.mp4",
	"AM9 Project 1: Bubble Sort": "am_9_bubble_sort.mp4",
	"AM9 Project 2: Baseball Analytics": "am_9_baseball_analytics.mp4",
	"AM10 Project 1: Merge": "am_10_merge.mp4",
	"AM10 Project 2: Split": "am_10_split.mp4",
	"AM10 Project 3: Merge Sort": "am_10_merge_sort.mp4",
	"AM11 Project 1: Partition": "am_11_partition.mp4",
	"AM11 Project 2: Quicksort": "am_11_quicksort.mp4",
	"AM11 Project 3: Sorting Comparison": "am_11_sorting_comparison.mp4",
	"AM12 Project 1: Crazy Name Tags Printer": "am_12_crazy_name_tags.mp4",
	"AM12 Project 2: File IO and Dictionaries":
		"am_12_file_io_with_dictionaries.mp4",
	"AM12 Project 3: Word Translator with File I/O": "am_12_juni_latin.mp4",
	"AM13 Project 1: Conway's Game of Life": "am_13_conways.mp4",
	"AM13 Project 2: Two-Player Conway's Game of Life":
		"am_13_two_player_conways.mp4",
	"AM14 Project 1: Tic Tac Toe UI": "am_14_tic_tac_toe_ui.mp4",
	"AM14 Project 2: Tic Tac Toe AI": "am_14_tic_tac_toe_ai.mp4",
	"AM14 Project 3: Tic Tac Toe AI Test": "am_14_tic_tac_toe_ai_test.mp4",
	"AM14 Project 4: Advanced Tic Tac Toe AI":
		"am_14_tic_tac_toe_ai_with_forks.mp4"
};

function sourceProjectMedia(filename: string) {
	return staticMediaUrl(filename);
}

function withSourceProjectMedia(course: RawCourse): RawCourse {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			const filename = SOURCE_PROJECT_MEDIA_BY_TITLE[item.title];

			if (
				filename &&
				!isKnownPendingStaticMedia(filename) &&
				!item.mediaLink
			) {
				item.mediaLink = sourceProjectMedia(filename);
			}
		}
	}

	return course;
}

function projectBrief({
	build,
	checkpoints,
	extension,
	goal,
	verification
}: {
	build: string[];
	checkpoints: string[];
	extension?: string;
	goal: string;
	verification?: string;
}) {
	return [
		`**Goal:** ${goal}`,
		`**Build path:**\n${build.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
		`**Checkpoints:**\n${checkpoints.map(checkpoint => `- ${checkpoint}`).join("\n")}`,
		`**Verification:** ${verification ?? `The finished project proves "${goal}" with a correctness trace, a normal case, a boundary or adversarial case, and a short note explaining the algorithmic or data-structure choice.`}`,
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

export const pythonLevel3Course: RawCourse = withSourceProjectMedia({
	name: "Python Level 3",
	modules: [
		{
			title: "AM1 Review: Variables, Strings, Input, Loops, & Conditionals",
			curriculum: [
				{
					title: "Introductions & Setup",
					content: `This opening section establishes the coding environment, course navigation, editor workflow, instructions, and console. The review can move in sequence or jump directly to the areas that need the most reinforcement.${
						gitCourseGuideLink
					}`
				},
				{
					title: "Variables, Strings, and Input",
					content:
						'Variables are named places to store data such as numbers and strings. A variable like `x` can store `"Hello world"` and then be printed. String indexing with `x[i]` starts at index `0`, the first character. `input("prompt")` collects typed input and stores the result in a variable before the program uses it later.'
				},
				{
					title: "AM1 Project 1: Mad Libs",
					content: projectBrief({
						goal: "Build a Mad Libs program that collects typed words and inserts them into a complete story.",
						build: [
							"Ask for at least five words such as nouns, adjectives, verbs, places, or names.",
							"Store each answer in a clearly named variable.",
							"Print a story that combines the collected inputs with punctuation and spacing that reads naturally.",
							"Run the program more than once with different answers to confirm the story changes correctly."
						],
						checkpoints: [
							"At least five inputs are stored and reused.",
							"The printed story is readable, not a raw concatenation of fragments.",
							"The walkthrough explains how input values move from prompts into the final output."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM1-Mad-Libs/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM1-Mad-Libs/solution"
				},
				{
					title: "Loops",
					content:
						"`for` loops and `while` loops both repeat work, but they fit different situations. `for i in range(10)` prints 0 through 9 when the number of repetitions is known. The same result can be recreated with `while x < 10` by updating `x` inside the loop. `while True` creates an intentional infinite loop, and `break` stops it when a chosen condition is met."
				},
				{
					title: "Conditionals",
					content:
						'Review how conditionals control the flow of a program. Create examples with `if`, `elif`, and `else`, and compare conditions such as `==`, `>`, and `>=`. Test what happens when a conditional expression is replaced with `True` or `False`. Practice writing a chain that prints `"big"`, `"HUGE"`, `"H U M O N G O U S"`, or `"small"` depending on the value of `x`, and compare multiple independent `if` statements with an `if`/`elif` chain.'
				},
				{
					title: "AM1 Project 2: Fictional Language Verifier",
					aliases: ["AM1 Project 2: Junian Language Verifier"],
					content: projectBrief({
						goal: "Write a verifier for a fictional language rule set.",
						build: [
							"Ask for an input word and store it as a string.",
							"Check whether the word has an even number of characters.",
							"Count at least two vowels from a/e/i/o/u, ignoring letter case.",
							"Compare the first and last letters without case differences and require them to differ; empty input must not index a missing character.",
							"Print whether the word is valid and identify which rule failed when it is not valid."
						],
						checkpoints: [
							'`"Lumo"` is accepted as a valid example.',
							"Odd-length words, low-vowel words, and same-first-last words are rejected for the correct reason.",
							"The walkthrough connects each conditional to one language rule."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM1-Junian-Language-Verifier/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM1-Junian-Language-Verifier/solution"
				},
				{
					title: "AM1 Project 3: Command Assistant",
					aliases: ["AM1 Project 3: Juni Assistant"],
					content: projectBrief({
						goal: "Create a simple command assistant that keeps responding until an exit command is entered.",
						build: [
							"Define several supported commands, such as time, date, remember-name, joke, or fun-fact.",
							"Keep accepting commands with a loop controlled by either `while True` plus `break` or a boolean running variable.",
							"Add a clear stopping command.",
							"Compare complete commands, handle blank or unknown input without indexing an empty string, and keep any remembered name only in the current session."
						],
						checkpoints: [
							"At least three commands produce different responses.",
							"The assistant exits cleanly from the stopping command.",
							"Unknown input demonstrates defensive branching."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM1-Juni-Assistant/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM1-Juni-Assistant/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM2 Review: Functions & Lists",
			curriculum: [
				{
					title: "Functions",
					content:
						"Functions are reusable templates for computation. A function definition begins with `def`, receives values through parameters, and sends values back with `return`. A simple function that squares its input leads naturally into functions with multiple parameters and more complex logic. Python annotations such as `text: str` and `-> bool` describe expected input and return types for readers, editors and type checkers; standard Python does not enforce them at runtime. If a function must reject an invalid value, it needs explicit validation. A default such as `enabled=False` instead supplies an actual value when that argument is omitted. Avoid a list or dictionary as a mutable default: that object is created once when the function is defined and is shared by calls that omit the argument. Use `items=None` and create a fresh list inside the function when `items is None`. Assignment such as `other = items` keeps the same object; `items.copy()` creates a shallow copy whose nested objects can still be shared."
				},
				{
					title: "AM2 Project 1: Functions Practice",
					content: projectBrief({
						goal: "Review iterative functions with reusable return values and independent test calls; later AM4 projects teach recursion.",
						build: [
							"Implement `product(a, b, c)` to return the product of three numeric inputs.",
							"Implement `average(x, y)` to return the arithmetic mean of two numeric inputs.",
							"Implement `count_letter(word, letter)` to count an exact, case-sensitive character. Empty words give zero; reject a nonstring word or a letter that is not a one-character string with ValueError.",
							"Implement `count_seven(number)` to count digit 7 in an integer's magnitude, ignoring its minus sign. Zero has no sevens. Reject nonintegers and bool with ValueError; keep digit arithmetic exact rather than rounding through floating division.",
							"Implement `exponent(a, b)` with repeated multiplication. The exponent must be a nonnegative integer, not bool; unsupported values raise ValueError. Exponent zero returns one, including the conventional `0**0` case used here."
						],
						checkpoints: [
							"Each function returns a value rather than only printing.",
							"Each function has normal, boundary and rejected-domain tests; imports do not print or request input. Put demonstration calls under the direct-run guard.",
							"Check zero, negative digit inputs, repeated/absent letters, case differences and exact large integers against independent expectations."
						],
						extension:
							"Optional iterative challenges: implement `factorial(n)` for a nonnegative integer, not bool, with `0! = 1`; invalid domains raise ValueError. Implement `hailstone(n, max_steps=10000)` for a positive integer, not bool: halve even terms exactly, otherwise use `3*n + 1`, and stop at one. Return the term count including the initial number and final one; ten gives seven terms and one gives one. max_steps is a nonnegative integer transition cap, not bool; invalid domains raise ValueError and hitting the cap before one raises RuntimeError rather than returning a partial count. General Hailstone convergence is not proved. Attempt these only after the five required functions work.",
						verification:
							"Trace inputs, accumulator and return values before coding; write independent assertions, compare traces with an instructor, then test different data. Keep incomplete starter code and completed references separate."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM2-Functions-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM2-Functions-Practice/solution"
				},
				{
					title: "Lists",
					content:
						"Review lists as ordered collections of values. Create an empty list with `x = []`, build lists of numbers, mutate list elements, and use `append()` to add values at the end. Compare iterating through a list directly with `for item in myList` versus iterating by index with `for i in range(len(myList))`."
				},
				{
					title: "AM2 Project 2: Lists Practice",
					content: projectBrief({
						goal: "Practice list construction and list-processing functions without hard-coding final answers.",
						build: [
							"Implement `make_numbers()` to return a fresh list of integers 1 through 20.",
							"Implement `make_evens()` to return the first twenty positive even numbers, 2 through 40; zero is excluded.",
							"Implement `make_squares()` to return the first ten positive perfect squares, 1 through 100. Generate all three lists with loops, not manually typed answers.",
							"Implement `sum_lists(l1, l2)` to return the numeric sum of both lists, not concatenate them; empty lists contribute zero.",
							"Implement `minimum(l)` and `maximum(l)` for nonempty numeric lists; an empty input raises ValueError. Use loops rather than built-in sum/min/max helpers in these practice implementations.",
							"Implement `sum_list_of_lists(l)` to sum all inner lists, with empty outer/inner lists contributing zero.",
							"Implement `flatten_list(l)` to return a new one-level flattening, retaining input order and duplicates and skipping empty inner lists.",
							"Implement `max_list(l)` using maximum: return maxima of nonempty inner lists in order and deliberately skip empty inner lists. Empty outer/all-empty input returns a new empty list."
						],
						checkpoints: [
							"Generated counts and endpoints match all three tasks, including twenty even values rather than ten.",
							"No function changes input lists. List-producing functions return distinct new objects, including empty results.",
							"Test negative values, duplicates, singleton lists, empty sums, rejected empty min/max and mixed empty/nonempty nested lists. Imports remain quiet."
						],
						verification:
							"Trace accumulators and flattening order with an instructor, then check different inputs independently. Built-in helpers may be test oracles, not substitutes for the practice loops; consult the separate reference only after attempting the tasks."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM2-Lists-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM2-Lists-Practice/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM3 Review: Dictionaries & Recap",
			curriculum: [
				{
					title: "Dictionaries",
					content:
						'Dictionaries are collections of key-value pairs. Create examples such as `prices = {"soap": 2, "apple": 1, "frozen_pizza": 5}` and use `dictionary[key]` to look up values. Check whether a key exists with `if key in dictionary`, iterate with `for key in dictionary`, and explore dictionaries whose keys and values use different data types. Practice building dictionaries of squares, factorials, and letter counts for a word.'
				},
				{
					title: "AM3 Project 1: Python Fundamentals Problem Set",
					content: projectBrief({
						goal: "Complete a fundamentals problem set that proves fluency with Python's core data and control-flow tools.",
						build: [
							"`double(numbers)`: return a new list with every input number doubled, preserving input order and duplicates.",
							"`starts_with_a(words)`: return words starting with lowercase a, in order. Empty strings and uppercase A do not match.",
							"`num_of_evens(numbers)`: count even integers, including zero and negative evens.",
							"`sum_of_numbers(numbers)`: return the numeric sum; empty input returns zero.",
							"`index_of_largest_number(numbers)`: return the zero-based index of the largest value in a nonempty list of distinct numbers; otherwise raise ValueError.",
							"`all_squares(N)`: for a nonnegative integer N, print nonnegative perfect squares at most N, including zero, one per line in increasing order; return None.",
							"`largest_power_of_two(N)`: for a positive integer N, return the greatest integer x with `2**x <= N`; one returns zero.",
							"`factorial_sum(N)`: for a nonnegative integer N, return `1! + 2! + ... + N!`; zero returns the empty sum, zero.",
							"`largest_divisor(N)`: for a positive integer N, return the largest positive divisor strictly below N; one has no such divisor and returns None.",
							"`largest_product(numbers)`: return the largest product of two distinct positions. Equal values in separate positions are allowed; fewer than two integers raises ValueError.",
							"`sums_to_zero(numbers)`: return True if two distinct positions sum to zero. Empty/singleton input returns False; `[0]` is False while `[0, 0]` is True.",
							"`most_common_numbers(numbers)`: return all tied modes in a new list in ascending numeric order; `[3, 6, 2, 2, 6]` returns `[2, 6]`, and empty input returns a new empty list.",
							"`reverse_string(str)`: return the reversed string, preserving whitespace and punctuation.",
							"`count_vowels(str)`: count ASCII a/e/i/o/u in either letter case; do not count y.",
							"`count_pairs(numbers)`: count distinct values appearing exactly twice, not the number of their occurrences; a value appearing three times is not counted.",
							"`swap_min_max(numbers)`: swap the smallest and largest values in place and return that same list object. The input must be a nonempty list of distinct numbers; a singleton is unchanged. Empty or repeated-value input raises ValueError."
						],
						checkpoints: [
							"Every task has a normal test and an allowed boundary or deliberately rejected-domain test. Integer N parameters reject bool and unsupported values with ValueError; parity, product, zero-sum and mode tasks use integer lists.",
							"Only swap_min_max mutates input. Tasks 1, 2 and 12 return fresh lists even when empty. Imports do not print, and test calls remain under the direct-run guard.",
							"Check negative products, duplicate frequencies, two-distinct-position rules, case policies and empty inputs with independent expectations; do not hard-code example inputs."
						],
						verification:
							"Trace and attempt each of the sixteen functions before consulting the separate reference. Review one trace with an instructor, then test different data independently and record what changed after a failed first approach."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM3-Python-Fundamentals-Problem-Set/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM3-Python-Fundamentals-Problem-Set/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM4 Recursion Part 1",
			curriculum: [
				{
					title: "Introduction to Recursion",
					content:
						"A recursive function is a function that calls itself on a smaller version of the same problem. Each recursive solution needs at least one base case, where the answer is known directly, and a recursive step, where the problem is reduced toward that base case. Everyday examples such as nested dolls or repeated divide-and-repeat processes make the frame-by-frame structure easier to trace."
				},
				{
					title: "AM4 Project 1: Recursive Factorials",
					content: projectBrief({
						goal: "Write a recursive factorial function and trace how it reaches its base case.",
						build: [
							"Define the factorial meaning for positive integers.",
							"Add a base case such as `1! = 1`.",
							"Add the recursive step `factorial(n) = n * factorial(n - 1)`.",
							"Print or trace at least one example so the chain of calls is visible."
						],
						checkpoints: [
							"`factorial(1)` returns the base-case value.",
							"`factorial(5)` produces 120.",
							"The explanation identifies the base case, recursive step, and why the input gets smaller."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Recursive-Factorials/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Recursive-Factorials/solution"
				},
				{
					title: "AM4 Project 2: Recursive Exponents",
					content: projectBrief({
						goal: "Write a recursive exponent function that computes `b` raised to the power `p`.",
						build: [
							"Define the function inputs: base `b` and exponent `p`.",
							"Choose a base case for the smallest exponent handled by the function.",
							"Create the recursive step that multiplies by `b` while reducing `p` by 1.",
							"Compare the recursive result with Python's `**` operator for several values."
						],
						checkpoints: [
							"Small powers such as `2^1`, `2^3`, and `5^2` work correctly.",
							"The base case prevents infinite recursion.",
							"The trace shows the exponent moving toward the base case."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Recursive-Exponents/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Recursive-Exponents/solution"
				},
				{
					title: "AM4 Project 3: Recursive Fibonacci Numbers",
					content: projectBrief({
						goal: "Write a recursive function that returns the `n`th Fibonacci number.",
						build: [
							"Define the first two Fibonacci values used by the project.",
							"Add one base case for each starting value.",
							"Create the recursive step that adds the two previous Fibonacci numbers.",
							"Trace a small call such as `fibonacci(5)` to see the repeated subproblems."
						],
						checkpoints: [
							"The first two sequence values return immediately.",
							"A later value is built from two smaller recursive calls.",
							"The explanation names why this simple recursive version repeats work."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Fibonacci-Numbers/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Fibonacci-Numbers/solution"
				}
			],
			supplementalProjects: [
				{
					title: "AM4 Supplemental Project 1: Binary Converter",
					content: projectBrief({
						goal: "Convert decimal numbers to binary with both iterative and recursive approaches.",
						build: [
							"Review how place value differs between base 10 and base 2.",
							"Build an iterative version by repeatedly dividing by 2 and tracking remainders.",
							"Build a recursive version that solves the same task on `n // 2` and appends the final bit.",
							"Compare the order in which each approach produces the binary digits."
						],
						checkpoints: [
							"Several decimal inputs match Python's `bin()` result after removing the `0b` prefix.",
							"The recursive version has a clear base case.",
							"The comparison explains what is easier or harder in each approach."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Binary-Converter/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Binary-Converter/solution"
				}
			]
		},
		{
			title: "AM5 Recursion Part 2",
			curriculum: [
				{
					title: "Substrings",
					content:
						"Slicing extracts part of a string with `x[start:end]`, where the ending index is exclusive. Shortcuts such as `s[:i]`, `s[i:]`, and `s[:-1]` make common slices concise. `split()` is useful when a string needs to be separated into pieces based on a delimiter."
				},
				{
					title: "AM5 Project 1: Recursive Cascade",
					content: projectBrief({
						goal: "Write recursive cascade functions that print a string growing forward and shrinking backward.",
						build: [
							"Create `cascade()` so it prints the first character, then the first two characters, continuing until the full string is printed.",
							"Create the inverse version so it prints the full string first and removes one character at a time.",
							"Trace where the print statement happens relative to the recursive call. For `cat`, predict `c`, `ca`, `cat` for the growing version and `cat`, `ca`, `c` for the shrinking version.",
							"Keep each call's substring or position in its parameters; separate growing and shrinking functions need no shared global counter. Printing a cascade is a side effect, so an implicit `None` return is valid here.",
							"Compare head recursion and tail recursion using the two versions."
						],
						checkpoints: [
							"A short word produces the expected forward and backward cascades.",
							"An empty string prints no lines, and a one-character string prints once.",
							"The explanation identifies which version prints before or after the recursive call."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Recursive-Cascade/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Recursive-Cascade/solution"
				},
				{
					title: "AM5 Project 2: Recursive Palindrome Checker",
					content: projectBrief({
						goal: "Write a recursive palindrome checker for literal, case-sensitive strings.",
						build: [
							"First return `True` for an empty or one-character string, before indexing either end.",
							"Compare the first and last characters; return `False` immediately when they do not match.",
							"When the ends match, return the recursive result for `text[1:-1]`. Calling the function without returning its result makes the outer call return `None`.",
							"Keep this version recursive; a loop is not needed to compare the remaining middle substring."
						],
						checkpoints: [
							"Known palindromes return `True` and non-palindromes return `False`.",
							"Even-length and odd-length examples both work. Predict literal, case-sensitive results first: empty text, `x`, `abba`, and `racecar` are `True`; `ab`, `abca`, and `Aa` are `False`.",
							"Use a table of inputs and independently predicted booleans. Pass your checker function to the test helper without calling it; the helper calls it for each input and compares the returned value with the expectation.",
							"The explanation names why each recursive call is closer to a base case."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Recursive-Palindrome-Checker/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Recursive-Palindrome-Checker/solution"
				},
				{
					title: "Stacks",
					content:
						"A stack is a last-in, first-out data structure. In Python, a stack can be represented with a list by adding items with `append()`, inspecting the top item with `myStack[-1]`, and removing the top item with `pop()`. Compare stack behavior with real-world examples such as a stack of papers or plates."
				},
				{
					title: "AM5 Project 3: Parentheses Validator",
					content: projectBrief({
						goal: "Validate bracket strings with a stack-based approach and compare it with a recursive reduction approach.",
						build: [
							"Create a stack to track opening brackets.",
							"Create a dictionary of matching bracket pairs.",
							"Scan the input string and reject mismatched or premature closing brackets.",
							"Accept the string only when the stack is empty at the end.",
							"Use a bracket-only contract: empty input is balanced, but any non-bracket character is rejected by both approaches.",
							"Explore a recursive version that removes complete pairs such as `()`, `[]`, or `{}` until no more valid reductions are possible."
						],
						checkpoints: [
							"Examples such as `([])` are accepted.",
							"Examples such as `([)]`, `(()`, and `())` are rejected.",
							"The comparison explains why the stack version is usually clearer for nested structures."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Parentheses-Validator/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Parentheses-Validator/solution"
				}
			],
			supplementalProjects: [
				{
					title: "AM5 Supplemental Project 1: Recursive Sum and Max",
					content: projectBrief({
						goal: "Practice recursive list processing with sum and maximum functions.",
						build: [
							"Write a recursive function that returns the sum of a list.",
							"Write a recursive function that returns the maximum value in a list.",
							"Define the empty sum as 0 and raise ValueError for an empty maximum; keep the input list unchanged.",
							"Shrink the problem with sublists or index bounds until a base case is reached.",
							"Compare each recursive result with Python's built-in `sum()` or `max()` for verification."
						],
						checkpoints: [
							"One-item lists reach a direct base case.",
							"Longer lists combine the current value with the result of a smaller list.",
							"The maximum function handles negative values correctly."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Recursive-Sum-and-Max/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Recursive-Sum-and-Max/solution"
				},
				{
					title: "AM5 Supplemental Project 2: Substring Generator",
					content: projectBrief({
						goal: "Generate substrings recursively and remove duplicates from the final result.",
						build: [
							"Generate contiguous substrings by recursively removing characters from the ends; do not skip interior characters as in a subsequence.",
							"Collect generated strings in a list.",
							"Remove duplicates by converting the result to a set and back to a list.",
							"Return a sorted list in stable order, including the empty string, and trace only short inputs while exploring the branching recursion."
						],
						checkpoints: [
							"Short inputs such as `ab` and `aba` are easy to verify by hand.",
							"Duplicate substrings are removed from the final output.",
							"The result for abc excludes ac, because a substring must be contiguous.",
							"The explanation connects the recursive tree to the generated result."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Substring-Generator/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Substring-Generator/solution"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content: reviewBrief({
						focus: "Low-pressure review of recursion, stacks, and string processing.",
						tasks: [
							"Confirm importing the linked starter into the Python IDE, or run Python 3 from its starter folder. Its README contains the complete review; initial Run gives a reminder to implement the TODOs.",
							"Attempt each prompt independently before reviewing the separate solution and answer key. Keep supplied strangeFunction as tracing input, not a completed learner answer.",
							"Identify whether any mistakes came from vocabulary, tracing, syntax, or data-structure choice.",
							"Return to the specific skill that needs practice instead of repeating the whole module."
						],
						evidence:
							"The review notes name at least one strength and one specific skill that needs continued practice."
					})
				},
				{
					title: "Check-In #1: String Functions",
					content: reviewBrief({
						focus: "String slicing, splitting, and index boundaries.",
						tasks: [
							"Implement middle_letters(word), returning the string without its first and last characters. Empty, one-character and two-character words return an empty string; non-string input raises ValueError.",
							"Implement second_word(sentence), returning the second whitespace-delimited word. Repeated spaces and tabs are separators; fewer than two words or non-string input raises ValueError.",
							"Complete main to ask for a word and a sentence and display both results. Explain included/excluded slice indexes, then test short words and repeated whitespace."
						],
						evidence:
							"Examples with short words and multi-word sentences produce the expected substrings."
					})
				},
				{
					title: "Check-In #1: Recursion",
					content: reviewBrief({
						focus: "Base cases, recursive calls, and tracing call frames.",
						tasks: [
							"Explain what a recursive function is.",
							"Identify the base case and a recursive call that moves toward it.",
							"Implement num_pins(rows) recursively: rows is a nonnegative integer, not bool; row sizes are 1 through rows and zero rows need zero pins. Invalid input raises ValueError. Practice with small values such as 0 through 100 to stay within recursion limits.",
							"Implement lucas(n) recursively with one-based positions: the sequence starts 2, 1, 3, 4, 7, 11 and each later value sums the previous two. n is a positive integer, not bool; invalid input raises ValueError. Use small positions such as 1 through 20; repeated calls grow rapidly.",
							"Predict every line of supplied strangeFunction(4), including call order, before running it. Compare the trace with a course facilitator, then try different small inputs independently."
						],
						evidence:
							"The trace matches the program output and explains why recursion stops."
					})
				},
				{
					title: "Check-In #1: Stacks",
					content: reviewBrief({
						focus: "Last-in, first-out stack behavior and stack-backed editing.",
						tasks: [
							"Explain last-in, first-out behavior and how a Python list supports a stack.",
							"Create nums = [1, 2, 3, 4, 5], append a random integer from 1 through 10, print the stack, then pop the top and print it again in main.",
							"Implement make_word(keystrokes), also available as makeWord: # removes the latest character, and backspace on an empty stack does nothing. All other characters, including spaces and letter case, are literal; non-string input raises ValueError.",
							"Predict the original examples makeWord('hi#'), makeWord('ok##'), makeWord('ti#ger') and makeWord('t###') before running them. Test empty input and repeated leading backspaces."
						],
						evidence:
							"The final text after backspaces matches a hand-traced stack simulation."
					})
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content: projectBrief({
						goal: "Write recursive functions that print running sums forward and backward.",
						build: [
							"Create one recursive function that prints the running sums of the first `n` elements of a list.",
							"Create a second recursive function that prints the same sums in reverse order.",
							"Trace how the print location changes the order of output."
						],
						checkpoints: [
							"A short list can be checked by hand.",
							"The forward and reverse versions use the same sum idea but different recursion timing.",
							"The base case prevents an empty-list or index error."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM-Check-In-1-Additional-Project/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM-Check-In-1-Additional-Project/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM6 Introduction to Algorithms & Runtime Analysis",
			curriculum: [
				{
					title: "Introduction to Algorithms",
					content:
						"An algorithm is a step-by-step process for completing a task. Compare different ways to solve the same problem and discuss why some methods are more efficient than others. Searching for an element in a list is one common example that leads naturally into algorithm analysis."
				},
				{
					title: "AM6 Project 1: Linear Search Implementation",
					content: projectBrief({
						goal: "Implement linear search and make the success and failure paths explicit.",
						build: [
							"Write a function that takes a list and a target value.",
							"Scan the list one item at a time.",
							"Return `True` immediately when the target is found.",
							"Return `False` only after every item has been checked."
						],
						checkpoints: [
							"Targets at the beginning, middle, and end of the list are found.",
							"A missing target returns `False`.",
							"The explanation identifies best case and worst case behavior."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Linear-Search/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Linear-Search/solution"
				},
				{
					title: "Runtime Analysis & Big-O Notation",
					content:
						"Big-O notation describes how an algorithm's runtime grows as the input size grows. The dominant term matters most, while lower-order terms and constant factors are ignored. This connects directly to best-case, average-case, and worst-case reasoning."
				},
				{
					title: "AM6 Project 2: Big-O Notation",
					content: projectBrief({
						goal: "Classify runtime expressions by their dominant Big-O behavior.",
						verification:
							"The completed worksheet states the input domain and growth model, gives a justified classification for each of the ten prompts, and keeps independent variables separate. Attempt each prompt before consulting the reference key.",
						build: [
							"Simplify expressions such as `12n^2 + n`, `n - sqrt(n)`, and `log(n) + 2`.",
							"Read the ten-prompt mathematical worksheet in the starter README; this task does not require an IDE import. State the growth model and keep independent variables separate.",
							"Analyze recursive definitions such as `f(n) = 1 + f(n/2)`.",
							"Include challenge problems with multiple variables or known summations such as `1 + 2 + ... + n`."
						],
						checkpoints: [
							"The dominant term is identified for each expression.",
							"Constants and lower-order terms are removed for the right reason.",
							"At least one answer includes a short explanation rather than only the final notation."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Big-O-Analysis/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Big-O-Analysis/solution"
				},
				{
					title: "AM6 Project 3: Function Analysis",
					content: projectBrief({
						goal: "Analyze real code snippets by counting how work grows with `n`.",
						verification:
							"The analysis records a prediction and justified primitive-operation count for each supplied function, including independent variables, early exits, and empty-input boundaries. Compare small traces with the separate reference only after attempting the classification.",
						build: [
							"Use the supplied f1 through f14 source as the analysis input; record predictions before running small examples, then compare with the separate reference comments.",
							"Count the main operations performed by each function.",
							"Break nested loops into outer-loop and inner-loop work.",
							"Use the stated primitive-operation model, keep n and m independent, and distinguish early exits and empty-input boundaries from the worst-case count.",
							"Decide on the final Big-O classification for each function."
						],
						checkpoints: [
							"Each classification is tied to a specific loop, recursion, or repeated operation.",
							"Nested loops are explained as combined work rather than guessed from appearance.",
							"The final answer names both the raw count idea and the simplified Big-O."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Function-Analysis/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Function-Analysis/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM7 Binary Search",
			curriculum: [
				{
					title: "Binary Search Introduction",
					content:
						"Binary search searches sorted lists by comparing the target with the middle item and eliminating half of the remaining search space. This repeated halving gives logarithmic comparison counts. Index-bound implementations avoid the additional copying work of recursive list slices."
				},
				{
					title: "AM7 Project 1: Binary Search Implementation",
					content: projectBrief({
						goal: "Implement binary search both iteratively and recursively.",
						build: [
							"Keep the input list sorted before searching.",
							"In the iterative version, track low and high indexes and continue while `low <= high`.",
							"In the recursive version, search the appropriate half with slices or index bounds.",
							"Implement bin_search_iter(lst, item) and bin_search_recur(lst, item), returning True for membership and False for a missing target or empty list. Preserve the sorted input; preparing sorted data is separate from searching."
						],
						checkpoints: [
							"Targets at the beginning, middle, and end are found.",
							"Missing targets stop without an infinite loop.",
							"The recursive and iterative versions agree on the same test cases."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Binary-Search/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Binary-Search/solution"
				},
				{
					title: "Binary Search Big-O Analysis",
					content:
						"Track the repeated halving: both versions use `O(log n)` comparisons on sorted input. With constant-time indexed access and index bounds, worst-case search time is `O(log n)`. The original recursive reference uses list slices, which copy the selected halves: their total worst-case copying work is `O(n)`, so do not call that implementation's total runtime logarithmic. Preparing or validating sorted input has its own cost, outside the search. Compare these costs with linear search and explain the sorted-data precondition."
				},
				{
					title: "AM7 Project 2: Reverse Number Guesser",
					content: projectBrief({
						goal: "Build the required computer-led midpoint game over an inclusive 1–100 interval. The player holds the secret; this differs from the optional player-led Number Guesser.",
						build: [
							"Implement `parse_feedback(text)` for string input: strip surrounding whitespace, normalize case, and accept exactly yes/above/below/quit. Anything else raises ValueError; preserve the original yes command rather than treating arbitrary text as success.",
							"Implement `midpoint(low, high)` and `update_bounds(low, high, guess, feedback)`. Bounds are builtin integers, not Boolean, with 1 <= low <= high <= 100. Use the lower integer midpoint. Above means the secret is greater than the guess; below means smaller. Exclude the wrong guess and return a strictly smaller tuple. Only above/below update bounds; invalid guesses, domains or an empty resulting interval raise ValueError.",
							"Implement `play(low=1, high=100, max_guesses=7, input_fn=None, output_fn=None)`. The limit is a builtin integer from 1 to 7; validate configuration and callable callbacks before prompting. None resolves input/print at call time. Invalid feedback retries without changing bounds or consuming an attempt. Only accepted yes/above/below responses record a midpoint and consume one attempt; quit, EOF and KeyboardInterrupt cancel without recording the interrupted guess.",
							"Return a fresh dictionary with status, number, guesses and bounds. Yes is confirmed by the player's claim; a singleton is inferred conditionally on consistent feedback without another prompt. Empty candidates mean contradiction; a limit with multiple candidates means exhausted; interruption means cancelled. Number is None except for confirmed/inferred. Keep the last valid bounds and a fresh guesses list, without global state.",
							"Confirm opening the incomplete starter in the Python IDE, read its complete README, and test helpers before replacing the reminder with a guarded play() call. Use the standard-input prompt for feedback. Imports must not prompt or print. Locally run `python3 main.py` from starter; save/export and reopen the workspace. No extra files or dependencies are required."
						],
						checkpoints: [
							"Trace a small interval before running; then independently check all 100 default secrets with truthful feedback and at most seven accepted responses. The guarantee depends on consistent feedback, not arbitrary claims.",
							"Test invalid/mixed-case feedback, both edges, a singleton, contradiction, a deliberately insufficient limit, quit and EOF. Inferred is not confirmed; invalid, cancelled, contradictory and exhausted flows must not claim success.",
							"Explain strict interval shrinking and inference with a course facilitator, then independently test different secrets and fresh game histories. Completed reference answers remain separate."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Reverse-Number-Guesser/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Reverse-Number-Guesser/solution"
				},
				{
					title: "AM7 Project 3: Runtime Comparator",
					content: projectBrief({
						goal: "Complete the required search experiment using shared data and targets, independently checked answers and measured batch medians. This measures search, not AM11's sorting algorithms.",
						build: [
							"Implement `linear_search(list1, item)` and `bin_search_iter(lst, item)` with the original names and parameters. Return Boolean membership and preserve inputs. Binary search assumes sorted input and uses index bounds; do not put sorting or a validation scan inside either timed search. Reuse only previously verified learner code, not automatically imported reference answers.",
							"Implement `make_workload(size=2000, queries=50, seed=0)`: use local random.Random(seed), not global random state, to return fresh nums/targets lists of generated integers from 0 through 100000, retaining duplicates. Size is a builtin integer from 0 to 5000, queries from 0 to 100, and seed an integer; Boolean and invalid domains raise ValueError.",
							"Implement `compare_searches(nums, targets, repeats=3, clock=None)`: require integer lists, not Boolean items, within those size/query caps. Manually supplied negative integers are valid. Repeats is an integer from 1 to 10. None resolves time.perf_counter() at call time; another clock must be callable. Validate before timing. Freeze the same targets for both algorithms: linear uses original-order data, binary a sorted copy of the same multiset.",
							"Prepare an independent membership oracle and validated untimed warm-ups for both algorithms before measuring either. Prepare a fresh copy before each start-clock call. Time only the shared query loop and result collection; generation, sorting, copying, oracle work, validation and printing stay outside. Verify exact Boolean answers and unchanged working inputs after stopping the clock; mismatch raises AssertionError instead of reporting a result. Reject nonfinite, Boolean or decreasing clock readings and nonfinite elapsed time with ValueError.",
							"Return two fresh dictionaries in linear/binary order with algorithm, size, queries, hits, repeats, input_order and median_seconds. Hits includes repeated matching queries; input_order is original/sorted. Use medians of actual measured full-batch seconds. Implement `main(size=2000, queries=50, repeats=3, seed=0)` to generate once, return rows and print Python version/implementation, seed, report and timing boundaries.",
							"Optional: retain `bin_search_recur(lst, item)` outside the two-algorithm core benchmark. The original sliced recursion has O(log n) comparisons but O(n) worst-case copying work; its total runtime is not logarithmic. Core completion requires five tasks, not this extra helper.",
							"Confirm importing the incomplete starter into the Python IDE, read its complete README and check the five core tasks before a guarded main() call. Imports must not allocate workloads, draw random values, print or run timings. Locally run `python3 main.py` from starter; save/export and reopen. No extra files or dependencies are required."
						],
						checkpoints: [
							"Use independent membership predictions for negatives, duplicates, hits, misses and empty lists. Inject a clock to check shared queries, fresh copies, warm-ups, timer boundaries and measured medians; preserve nums and targets.",
							"Discuss the original-order versus sorted hit-position confound. An already sorted nums input controls that difference. Empty query batches measure overhead, not algorithm speed. Report workload, hit count, repeats, environment and seed.",
							"Measured local medians do not prove Big-O or the end-to-end cost of sorting before binary search. Walk one batch with a course facilitator, then vary workload independently; never substitute historical guesses for measurements."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Runtime-Comparator/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Runtime-Comparator/solution"
				}
			],
			supplementalProjects: [
				{
					title: "AM7 Supplemental Project 1: Number Guesser",
					content: projectBrief({
						goal: "Build the optional player-led game: the computer holds a random secret from 1–100 and gives higher/lower feedback for at most seven accepted guesses. Arbitrary guesses may lose; this is not the required computer-led Reverse Number Guesser.",
						build: [
							"Implement `parse_guess(text, low=1, high=100)`. Validate builtin integer bounds, excluding Boolean, with 1 <= low <= high <= 100. Strip surrounding whitespace; case-insensitive quit returns None. Otherwise require an optional sign followed by ASCII decimal digits and an in-range integer. Blank, decimal, underscore, internal-space, non-ASCII, out-of-range, non-string or overlong integer text raises ValueError.",
							"Implement `guess_feedback(guess, secret)` for builtin integers from 1 through 100, excluding Boolean: return higher when the guess is below the secret, lower when above and correct when equal. Invalid values raise ValueError.",
							"Implement `play(secret=None, low=1, high=100, max_guesses=7, input_fn=None, output_fn=None)`. Validate bounds, integer limit from 1 to 7 and callable callbacks before prompting. None callbacks resolve input/print at call time. A None secret selects random.randint(low, high) at call time; an injected integer in the interval enables repeatable tests.",
							"Invalid input retries without consuming a try; every accepted integer, including a repeated miss, consumes one. Quit, EOF or KeyboardInterrupt cancels without recording the interrupted input. Return a fresh dictionary with status, secret and guesses: won on exact guess, lost after all wrong tries, otherwise cancelled. Reveal the secret on the console only on win/loss, not cancellation; retain no global history.",
							"Confirm opening the incomplete starter in the Python IDE, read its complete README and check the three tasks before a guarded play() call using standard input. Imports must not draw a secret, prompt or print. Locally run `python3 main.py` from starter; save/export and reopen. No extra files or dependencies are required."
						],
						checkpoints: [
							"Predict higher/lower/correct independently using injected secrets, then verify all 100 secrets with a binary strategy. That strategy can win within seven; seven arbitrary guesses are not guaranteed to win.",
							"Test repeated misses, last-attempt wins, invalid text/range input, quit, EOF, fresh histories and invalid configuration. Check actual accepted attempts, status and non-disclosure on cancellation.",
							"Discuss strategy guarantees versus the game's allowance with a course facilitator, then independently test different secrets. Keep completed reference answers separate from this optional assignment."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Number-Guesser/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Number-Guesser/solution"
				}
			]
		},
		{
			title: "AM8 Selection Sort & Insertion Sort",
			curriculum: [
				{
					title: "Selection Sort Introduction",
					content: [
						"Selection sort repeatedly finds the smallest item in the unsorted portion of a list and places it into the next position of the sorted portion. It is a straightforward first sorting algorithm and leads naturally into runtime analysis.",
						"Read the algorithm as a sequence of passes: before each pass, the sorted prefix is already correct; during the pass, the minimum remaining value is found; after the pass, the sorted prefix grows by one item. The useful trace records the pass number, selected minimum, swap or append action, and list state.",
						"The animation traces how the smallest remaining value is selected and moved into the next sorted position.",
						SORT_ANIMATION_SOURCES.selection
					].join("\n\n"),
					mediaLink: SORT_ANIMATIONS.selection
				},
				{
					title: "AM8 Project 1: Selection Sort",
					content: projectBrief({
						goal: "Write selection sort and connect each pass to the growing sorted portion of the list.",
						build: [
							"Implement `selection_sort1(lst)` by repeatedly finding the minimum value, removing it, and appending it to a new result list. This consuming version leaves the input empty; keep a copy for tests.",
							"Trace how the unsorted portion shrinks after each pass.",
							"Implement `selection_sort2(lst)` in place: select the minimum from the current unsorted suffix, swap it into the next position, and return the same list. Do not restart the minimum scan from index zero.",
							"Test empty, singleton, negative, sorted, reversed, duplicate, and random inputs. Use built-in sorting only as an independent oracle, not inside either implementation."
						],
						checkpoints: [
							"The result is sorted and retains every input item. The consuming version returns a new list and empties the input; the in-place version returns that same list.",
							"The trace identifies which value is selected on each pass.",
							"The explanation compares time and space tradeoffs."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM8-Selection-Sort/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM8-Selection-Sort/solution"
				},
				{
					title: "Selection Sort Big-O Analysis",
					content:
						"Count the repeated passes through the shrinking list to show that selection sort performs on the order of `n^2` work. Then compare time complexity with space complexity and discuss the tradeoff between building a new list and sorting in place."
				},
				{
					title: "Insertion Sort Introduction",
					content: [
						"Insertion sort builds a sorted list one item at a time. Each new value is inserted into its proper location among the values already processed, often by swapping backward until the new value is in the correct place.",
						"Read the algorithm as a growing sorted prefix. The current value moves left only as far as needed, so nearly sorted input produces fewer moves than reversed input. The useful trace records the current index, value being inserted, comparisons made, final position, and list state after the insertion.",
						"The animation follows each new value moving left through the already sorted prefix until the prefix is ordered again.",
						SORT_ANIMATION_SOURCES.insertion
					].join("\n\n"),
					mediaLink: SORT_ANIMATIONS.insertion
				},
				{
					title: "AM8 Project 2: Insertion Sort",
					content: projectBrief({
						goal: "Implement insertion sort and trace how each new value moves into the sorted prefix.",
						build: [
							"Implement `insertion_sort1(lst)` with a new result list and preserve the input; implement `insertion_sort2(lst)` in place and return the same list. Treat the left side as the sorted portion.",
							"Take the next unsorted value and move it left until it belongs in the sorted portion.",
							"Track how the sorted and unsorted portions change over time.",
							"Move a value left only when it is strictly smaller, so tied items retain their order. Test empty, singleton, negative, sorted, descending, duplicate-heavy, and random inputs against an independent built-in-sort oracle."
						],
						checkpoints: [
							"The values are sorted correctly and all duplicates remain. The copy-returning version leaves the original unchanged and returns a distinct list, even for empty or singleton input.",
							"The trace shows why nearly sorted input is easier for insertion sort.",
							"The worst-case reversed input is connected to repeated swaps."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM8-Insertion-Sort/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM8-Insertion-Sort/solution"
				},
				{
					title: "Insertion Sort Big-O Analysis",
					content:
						"Analyze why the worst case for insertion sort occurs on a reversed list. Show that the total number of swaps forms the sum `1 + 2 + ... + (n - 1)`, giving `O(n^2)` time. Then compare this with the near-best case where the list is already almost sorted."
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content: reviewBrief({
						focus: "Algorithm analysis, searching, and elementary sorting.",
						tasks: [
							"Confirm importing the linked starter into the Python IDE, or run Python 3 from starter. Complete its TODOs after the initial reminder; weirdFunction, function1 and function2 remain supplied code to analyze.",
							"Explain the reasoning behind each answer before consulting the separate solution README. Preserve the original expressions and pass inputs; no classification or trace answer is filled into learner work.",
							"Trace at least one small input by hand for each algorithm family.",
							"Mark whether any error came from runtime notation, loop tracing, or algorithm vocabulary."
						],
						evidence:
							"The review identifies both the final answers and the reasoning used to reach them."
					})
				},
				{
					title: "Check-In #2: Time Complexity",
					content: reviewBrief({
						focus: "Big-O vocabulary and runtime simplification.",
						tasks: [
							"Define Big-O, the input size and the cost model. Treat a print, comparison, index or arithmetic operation as unit cost here; arbitrary-size integer bit costs are separate.",
							"Classify the growth of n^2 + 1000n, log(n) + sqrt(n), and 1*2*3*...*n for positive n. The last question concerns the expression's value, not the runtime of a loop multiplying n factors.",
							"Analyze the supplied weirdFunction(nums) for odd and even lengths, including best/worst input families; analyze function1(nums) with its fixed inner-loop bound.",
							"Trace supplied function2(50) before running it, then analyze its work for positive integer n under the stated unit-cost model."
						],
						evidence:
							"Each simplified runtime includes the dominant term and a short reason."
					})
				},
				{
					title: "Check-In #2: Linear Search",
					content: reviewBrief({
						focus: "Linear search tracing and implementation.",
						tasks: [
							"Explain how linear search works and when it can be used.",
							"Implement linear_search(l, v), returning Boolean membership without changing the list. Empty input returns False; sorting is unnecessary.",
							"Identify best-case and worst-case behavior."
						],
						evidence:
							"The code handles found and missing targets, and the explanation connects position to runtime."
					})
				},
				{
					title: "Check-In #2: Binary Search",
					content: reviewBrief({
						focus: "Binary search preconditions, boundaries, and runtime.",
						tasks: [
							"Explain binary search and the sorted-input requirement.",
							"Implement bin_search_iter(lst, item) and bin_search_recur(lst, item) for already ascending input. Return Boolean membership, including False for empty input, without mutation.",
							"Use indices/bounds rather than slicing, copying, sorting or a preliminary validation scan. Sorted input is a precondition established before calling the search.",
							"Implement first_one_index(numbers) for already sorted zeros followed by ones. Return the zero-based first-one index or -1 for empty/all-zero input. Use logarithmically many constant-cost indexed accesses; do not scan to validate the precondition.",
							"Test found/missing targets, every zero/one boundary, all zeros and all ones. Explain interval progress and stopping conditions."
						],
						evidence:
							"The search bounds shrink correctly and stop for both found and missing targets."
					})
				},
				{
					title: "Check-In #2: Selection Sort",
					content: reviewBrief({
						focus: "Selection sort passes, selected values, and runtime.",
						tasks: [
							"Describe selection sort.",
							"Predict two descending selection passes on [2, 5, 10, 3, 6, 1]. One pass selects the maximum of the unsorted suffix.",
							"Complete selectionSort(lst), also available as selection_sort, largest to smallest in place; return the same list, including empty/singleton input. Stability is not promised.",
							"Explain best/worst comparison work, then verify output, mutation and returned identity separately."
						],
						evidence:
							"The trace shows the selected value and sorted portion after each pass."
					})
				},
				{
					title: "Check-In #2: Insertion Sort",
					content: reviewBrief({
						focus: "Insertion sort prefix growth and best/worst cases.",
						tasks: [
							"Describe insertion sort.",
							"Predict three ascending insertion passes on [3, 7, 2, 5, 10, 1]. Count inserting indices 1, 2 and 3; index zero is not an insertion pass.",
							"Complete insertionSort(lst), also available as insertion_sort, smallest to largest in place; return the same list. Strict out-of-order comparisons keep tied items in their original order.",
							"Test empty/singleton, duplicate and reversed inputs. Explain best/worst comparisons and shifts rather than relying only on clock time."
						],
						evidence:
							"The trace shows how a new value moves through the sorted prefix."
					})
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content: projectBrief({
						goal: "Compare two ascending sorting algorithms fairly using measured timings.",
						build: [
							"Implement selection_sort2(lst) and insertion_sort2(lst), both ascending in place and returning the same list. This core two-sort review is distinct from AM11's five-sort comparison and the descending selection trace above.",
							"Implement make_workloads(n, seed=0): use a local seeded generator for integers 1 through max(1, 10*n), then make random, sorted and reversed shapes of the same multiset. n is an integer from 0 to 2000, not bool.",
							"Implement time_sort(sorter, values): compute the expected sorted output and a fresh copy before time.perf_counter(); time only the sorter, then validate the result after stopping the clock. Incorrect output raises AssertionError; a non-finite or negative elapsed value raises RuntimeError.",
							"Implement benchmark(sizes=(100, 300), repeats=3, seed=0, sorters=None): use one to five sizes from 0 to 2000 and one to ten repeats, rejecting bool/out-of-range integers with ValueError. seed is an integer, not bool. Optional sorters is a dictionary of one or two named callables; invalid configurations raise ValueError.",
							"Give every algorithm/repetition a fresh copy of the same shape. Return rows with algorithm, shape, n, repeats and seconds as the median of measured samples. Print a small table only after completing TODOs; larger explicit experiments can exceed browser budgets and can run locally."
						],
						checkpoints: [
							"Both algorithms sort identical workloads correctly without retaining mutations between samples.",
							"Generation, copying, expected-output computation, validation and printing are outside the timed section.",
							"The table reports measured medians only; timings do not prove Big-O and can vary by machine."
						],
						verification:
							"Predict work, compare actual results and discuss the experiment with a course facilitator. Test empty/small lists and invalid bounds; retain measured samples rather than historical timing guesses."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM-Check-In-2-Additional-Project/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM9 Bubble Sort",
			curriculum: [
				{
					title: "Bubble Sort Introduction",
					content: [
						"Bubble sort repeatedly walks through a list, compares adjacent items, and swaps them when they are out of order. One full pass moves a large value toward the end of the list, and repeated passes eventually sort the entire list.",
						"Read the algorithm as repeated local repairs. Each adjacent comparison is small, but the repeated passes create a sorted suffix at the end of the list. The useful trace records comparison pairs, swaps, whether a pass made any changes, and why an early-exit flag can stop a sorted run.",
						"The animation tracks adjacent comparisons and swaps as larger values move toward the end of the list.",
						SORT_ANIMATION_SOURCES.bubble
					].join("\n\n"),
					mediaLink: SORT_ANIMATIONS.bubble
				},
				{
					title: "AM9 Project 1: Bubble Sort",
					content: projectBrief({
						goal: "Implement bubble sort and refine it from a basic pass into a more efficient version.",
						build: [
							"Code one adjacent-comparison pass.",
							"Repeat passes until the list is sorted.",
							"Build a basic in-place version.",
							"Add an early-exit improvement for already sorted input.",
							"Add a helper that returns a sorted copy while leaving the original list unchanged."
						],
						checkpoints: [
							"Empty, singleton, negative, duplicate, already sorted, reversed, and random inputs sort correctly. `bubble_sort_in_place` and `bubble_sort_improved` return the same list; `bubble_sort_copy` returns a new list.",
							"The inner comparison range shrinks after each pass for a stated reason.",
							"The copy-returning helper does not mutate the original list. Count comparisons to verify that an already sorted input needs only one pass in the improved version; swap only strictly out-of-order neighbors to preserve ties."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM9-Bubble-Sort/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM9-Bubble-Sort/solution"
				},
				{
					title: "Bubble Sort Big-O Analysis",
					content:
						"Count the repeated adjacent comparisons: basic bubble sort remains `O(n^2)` even on sorted input. Reset a swap flag for each pass and stop after a no-swap pass to obtain a linear best case, while retaining quadratic worst-case time. In-place variants use constant auxiliary space; a sorted-copy helper adds linear space."
				},
				{
					title: "AM9 Project 2: Baseball Analytics",
					content: projectBrief({
						goal: "Apply adjacent bubble-sort comparisons to produce stable descending baseball leaderboards without changing the supplied records.",
						build: [
							"Retain the ten synthetic p1-p10 records and playerList; player_list is a compatible spelling. These are practice data, not current baseball results. Each record is a four-field list or tuple: name, average, home runs and RBI.",
							"Implement bubble_baseball(players, stat). players is a list; recognize exactly the case-sensitive fields Average, Home Run and RBI. Names are nonblank strings, average is a finite int/float in [0, 1], and both counts are nonnegative ints. Boolean numbers are invalid. Validate every field; invalid containers, records or keys raise ValueError, with one-based record numbers for record errors.",
							"Return a fresh list of names in descending selected-statistic order, keeping equal statistics in their original input order. Empty input returns a fresh []; retain duplicate names and records. Do not change the outer input list or its records. Use adjacent bubble comparisons on a working copy, not sorted or list.sort; reversing an ascending result would reverse ties too.",
							"Implement print_list(names): validate a list of strings before printing, print each name with one leading tab on its own line and return None. Empty input prints nothing; invalid input raises ValueError without partial output.",
							"Implement main() to display Average Leaderboard:, Home Run Leaderboard: and RBI Leaderboard:, with blank lines between groups. Return None and leave playerList unchanged. Replace the starter's initial reminder with a direct-run guarded call only after checking the helpers. Imports must not print, request input or sleep."
						],
						checkpoints: [
							"Independently predict all three rankings and a small tied-record trace before running them. Stable ties and nonmutation are explicit clarified policies, not guarantees of the old snapshot.",
							"Check empty/singleton lists, duplicate names, equal statistics, unchanged record identity, unknown keys and every invalid field domain.",
							"Explain the selected index, why equal adjacent values do not swap, quadratic worst-case work and the working copy's space."
						],
						verification:
							"Confirm opening the starter in the Python IDE or run from starter with Python 3. Discuss one adjacent pass with a course facilitator, then test different synthetic records independently. Compare with an independently computed expected ranking and save/export the project. Completed reference code stays separate in solution."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM9-Baseball-Analytics/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM9-Baseball-Analytics/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM10 Merge Sort",
			curriculum: [
				{
					title: "Merge Sort Introduction",
					content: [
						"Merge sort uses divide and conquer. Split a list into two halves, recursively sort each half, and then merge the two sorted halves back together. The key insight is that merging sorted lists is much faster than sorting from scratch.",
						"Read the algorithm in two phases. The divide phase explains the recursion tree, and the merge phase explains where most of the work happens. The useful trace records the split boundaries, base cases, merged sublists, and the comparison that chooses the next output value.",
						"The animation separates the two phases: repeated splitting into small pieces, then merging those pieces back into sorted order.",
						SORT_ANIMATION_SOURCES.merge
					].join("\n\n"),
					mediaLink: SORT_ANIMATIONS.merge
				},
				{
					title: "AM10 Project 1: Merge",
					content: projectBrief({
						goal: "Write a `merge()` helper that combines two already sorted lists.",
						build: [
							"Both inputs must already be sorted. Compare their front remaining items using indices; do not repeatedly call `pop(0)`, which shifts a Python list and breaks the linear-merge cost model.",
							"Append the smaller item to the result list.",
							"Continue until one input list is exhausted.",
							"Append any leftover values, return a new list, and preserve both inputs. Take the left-hand item on ties so the merge is stable."
						],
						checkpoints: [
							"Two sorted inputs produce one sorted output.",
							"Unequal list lengths are handled correctly.",
							"Duplicate values remain in the merged result. Empty inputs work on either side, inputs stay unchanged, and tied record labels retain their relative order."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM10-Merge-Sort/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM10-Merge-Sort/solution"
				},
				{
					title: "AM10 Project 2: Split",
					content: projectBrief({
						goal: "Write the recursive splitting structure used by merge sort.",
						build: [
							"Split a list into left and right halves.",
							"Recursively split each half until each piece has length 1 or less.",
							"Implement `split(lst)` as a trace helper: print singleton leaves from left to right, print `[]` for empty input, and return None. It does not return a sorted list.",
							"Trace the splitting process on an odd-length and even-length list."
						],
						checkpoints: [
							"The base case stops on lists of length 0 or 1.",
							"Odd-length lists divide without losing an item.",
							"The trace shows the recursive tree shape."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM10-Merge-Sort/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM10-Merge-Sort/solution"
				},
				{
					title: "AM10 Project 3: Merge Sort",
					content: projectBrief({
						goal: "Combine splitting and merging into a complete merge sort implementation.",
						build: [
							"Implement `merge_sort(lst)` with a new-list contract: empty and singleton base cases return a copy, not the input object.",
							"Split the list into two halves.",
							"Recursively sort each half.",
							"Merge the sorted halves into one sorted result.",
							"Optionally implement `merge_sort2(lst)` with the merge logic integrated, retaining the same stable, nonmutating, new-list contract."
						],
						checkpoints: [
							"Empty, one-item, duplicate, reversed, and random lists sort correctly.",
							"The implementation preserves all original values and leaves the input unchanged. The result is a different list even for empty and singleton inputs; equal-key record labels retain their relative order.",
							"The explanation connects split depth and merge work to runtime."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM10-Merge-Sort/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM10-Merge-Sort/solution"
				},
				{
					title: "Merge Sort Big-O Analysis",
					content:
						"A recursion tree shows why merge sort runs in `O(n log n)` time: indexed merging does `O(n)` total work at each level, and tree height is `O(log n)`. Repeated `pop(0)` would add Python list-shifting costs and invalidate this analysis. Slices and output lists require linear peak auxiliary storage, plus logarithmic recursion depth."
				}
			],
			supplementalProjects: [
				{
					id: "merge-sort-frame-reference",
					title: "Merge Sort Call and Return Trace",
					learningPath: "choice",
					content: mergeSortFrameGuide
				}
			]
		},
		{
			title: "AM11 Quicksort",
			curriculum: [
				{
					title: "Quicksort Introduction",
					content: [
						"Quicksort chooses a pivot value, partitions the list into values less than, equal to, and greater than the pivot, then recursively sorts the outer partitions. It is another divide-and-conquer algorithm, but unlike merge sort it relies on partitioning rather than merging.",
						"Read the algorithm through pivot quality. Balanced partitions create shallow recursion, while repeatedly poor pivots create deep recursion and quadratic behavior. The useful trace records the pivot, three partitions, recursive subproblems, and whether the chosen pivot created a balanced or lopsided split.",
						"The animation tracks the pivot-driven partition steps and the smaller recursive sorting regions that follow.",
						SORT_ANIMATION_SOURCES.quick
					].join("\n\n"),
					mediaLink: SORT_ANIMATIONS.quick
				},
				{
					title: "AM11 Project 1: Partition",
					content: projectBrief({
						goal: "Write a partition helper for quicksort.",
						build: [
							"Implement `partition(lst, pivot)` with a pivot value, not an index. Preserve the input and order within each group, including when the pivot is absent.",
							"Create one partition for values less than the pivot.",
							"Create one partition for values equal to the pivot.",
							"Create one partition for values greater than the pivot.",
							"Return the three partitions in a predictable order."
						],
						checkpoints: [
							"Every input value appears in exactly one partition.",
							"Duplicate pivot values are preserved.",
							"The helper can be tested independently from quicksort."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM11-Quicksort/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM11-Quicksort/solution"
				},
				{
					title: "AM11 Project 2: Quicksort",
					content: projectBrief({
						goal: "Write quicksort using partitioning and recursive sorting.",
						build: [
							"Implement `quicksort(lst, rng=None)` to return a sorted new list without changing the input, including empty and singleton cases. Choose a pivot from the current input; use `random.Random(0)` as the optional rng for repeatable tests.",
							"Partition the list into less-than, equal-to, and greater-than regions.",
							"Recursively sort the less-than and greater-than regions.",
							"Concatenate the sorted left side, equal values, and sorted right side."
						],
						checkpoints: [
							"Repeated values remain in the output.",
							"Empty, singleton, negative, already sorted, and reversed inputs produce correct results without mutating or aliasing the input. Test partition membership independently before recursion.",
							"The explanation identifies when quicksort can degrade to `O(n^2)`."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM11-Quicksort/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM11-Quicksort/solution"
				},
				{
					title: "Quicksort Big-O Analysis",
					content:
						"Balanced quicksort partitions give `O(n log n)` time; repeatedly poor pivots give `O(n^2)` time and can exceed Python's recursion depth. Random pivots reduce that risk, not eliminate it. This new-list implementation is not in-place: balanced recursion has linear peak list storage plus a logarithmic stack; worst-case retained partitions can use quadratic storage and a linear stack. Optional `shuffle` mutates by a nonnegative integer number of random swaps and returns None; empty input is safe, but fixed swaps are not a uniform permutation. Optional `shuffle2` returns a random permutation in a new list and empties its input."
				},
				{
					title: "AM11 Project 3: Sorting Comparison",
					content: projectBrief({
						goal: "Compare sorting algorithms across different input patterns.",
						build: [
							"Bring tested selection, insertion, basic bubble, merge, and quicksort implementations into the starter. Build `make_workloads(size, rng)` with shared seeded random, sorted, reversed, and duplicate-heavy data. Give every algorithm and repeat a fresh copy of the same input.",
							"Implement `time_sort(sorter, values)` using `time.perf_counter()`. Prepare the working copy and independent `sorted(values)` oracle before the clock; time only the sorting call, then validate the result after stopping the clock. Reject incorrect results rather than reporting their speed.",
							"Implement `benchmark(sizes=(100, 300), repeats=3, seed=0, algorithms=None)` to report measured median seconds per size, shape, and algorithm. Bound experiments to one through five integer sizes from 0 to 2000 and integer repeats from 1 to 10; reject bool as an integer. Optional algorithms is a name-to-function dictionary for small tests.",
							"Return result rows with size, shape, algorithm, repeats, and median_seconds fields. Exclude generation, copies, oracle sorting, validation, and printing from timings. Label basic versus optimized bubble sort and any skipped run; never substitute historical estimates for measurements. Record environment and seed, and explain why small local timings illustrate behavior but do not prove Big-O."
						],
						checkpoints: [
							"Each algorithm receives identical input values in an independent copy for every repeat; an in-place sort cannot change the next workload.",
							"Correctness checks pass before timings are reported. Merge uses indexed merging rather than `pop(0)`, and reported values are medians of measured runs only.",
							"The conclusion explains when one algorithm is a better fit than another."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM11-Sorting-Comparison/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM11-Sorting-Comparison/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM12 File Input/Output",
			curriculum: [
				{
					title: "Writing to a File",
					content:
						'Use `with open("output.txt", "w", encoding="utf-8", newline="\\n") as f:` and `f.write(...)` to store text. The context manager closes the file on success or an error. Validate and format the whole input before opening: write mode deliberately truncates existing output. UTF-8 and LF make the byte format explicit; `w+` adds reading access this task does not need. An I/O failure after opening may leave partial output, so use a working copy for experiments.'
				},
				{
					title: "AM12 Project 1: Crazy Name Tags Printer",
					content: projectBrief({
						goal: "Separate literal name transformations, exact text formatting and a required single-file writing workflow. Three separate files are an optional extension.",
						build: [
							"Implement name_variations(name), returning a fresh tuple of the literal name, characters at zero-based indexes 0, 2, 4, ... and the reversed name. Accept empty strings; preserve case, spaces, tabs and Unicode code points literally. Combining sequences are not preserved as visual graphemes, and no normalization is performed. Non-strings, embedded CR/LF or text that cannot encode as UTF-8 raise ValueError.",
							"Implement format_tags(name) without file I/O, using the same name domain. Write each character on its own line in the three variation orders: one LF after every character and one additional LF after each section, including the last. Empty names produce exactly three LF characters; a literal space is a space on a line, not a blank separator.",
							'Implement write_tags(name, path="output.txt"). Validate the whole name and destination before opening. Destinations are nonempty UTF-8 encodable strings or os.PathLike returning such text, without NUL; invalid paths raise ValueError. Accept pathlib.Path and preserve literal path whitespace. Use a context manager, mode "w", encoding="utf-8" and newline="\\n"; deliberately overwrite valid output and return None. Validation errors preserve existing output; normal filesystem errors propagate, parent folders are not created and later I/O failures can leave truncated/partial files.',
							'Implement main(path="output.txt", input_fn=None, output_fn=None). Validate path and callable-or-None callbacks before prompting; invalid configuration raises ValueError. Resolve None to built-in input/print at call time. Prompt once with "What is your name? " and call write_tags. Return a fresh dictionary with exactly status and path (destination text): written on success, invalid for an invalid name, failed for output OSError, cancelled for input EOFError/KeyboardInterrupt. Report the outcome without claiming success on failure. Invalid names and input cancellation open no output; literal quit is a valid name. Other callback errors propagate.',
							"Complete the four core callables before replacing the starter's reminder with a guarded main() call. Imports must not prompt, open files, print or run the project. No input file is needed; original output samples in solution remain historical reference assets, including the empty output.txt that is not an expected new core result."
						],
						checkpoints: [
							"For Ada, independently predict ('Ada', 'Aa', 'adA') and the exact core text 'A\\nd\\na\\n\\nA\\na\\n\\na\\nd\\nA\\n\\n'. Check the final section separator and UTF-8 bytes.",
							"Test empty input ('\\n\\n\\n'), one/odd-length names, repeated letters, literal case/space/tab and Unicode. Explain the difference between a code point and a displayed grapheme.",
							"With temporary files, verify deliberate overwrite, invalid input preserving prior output, invalid paths, missing parents, cancellation and closure after writing raises. Reopen actual output rather than inferring it from console messages."
						],
						extension:
							'Optionally implement write_separate_tags(name, paths=("output1.txt", "output2.txt", "output3.txt")) after the core works. paths must be a list or tuple of exactly three valid destinations. Validate all input and reject identical/equivalent paths and symlink/hardlink aliases with ValueError before opening any file; inspection errors propagate. Write one variation per file, one LF per character without core section separators, using UTF-8/LF context-managed overwrite; empty names give three empty files. Return None. Validation preserves all outputs; later I/O failure can leave earlier files written. No transactional rollback is promised. Core main() does not select this extension automatically.',
						verification:
							"Confirm importing the incomplete starter main.py and complete README.md into the Python IDE, or run from a starter working copy with python3 main.py. Initial Run is a reminder. Discuss one index/file trace with a course facilitator, implement the guarded console entry point, enter a name, reopen output.txt and check exact contents. Independently test another name, save/export and reopen the saved work. Completed reference answers stay separate in solution."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-Crazy-Name-Tags-Printer/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-Crazy-Name-Tags-Printer/solution"
				},
				{
					title: "Reading From a File",
					content:
						"`f.read()` handles the full file as one string, while `f.readlines()` returns a list of lines. Newline characters often appear in file input, so `strip()` is useful when a program needs the text without surrounding whitespace."
				},
				{
					title: "AM12 Project 2: File IO and Dictionaries",
					content: projectBrief({
						goal: "Read alternating file lines into a dictionary.",
						build: [
							'Retain the supplied input.txt and implement parse_pairs(lines), load_pairs(path="input.txt") and main(path="input.txt"). This assignment reads and inspects a dictionary; it does not require writing an output file.',
							"parse_pairs receives a list of strings, one physical record each, optionally ending in one LF/CRLF/CR delimiter. Other embedded CR/LF delimiters are invalid. Pair records 1/2, 3/4 and so on as keys/values. Strip surrounding whitespace from both, matching the original parser; retain interior spaces and string values.",
							"Return a fresh dictionary without changing lines. Empty input gives {}; blank keys are rejected, empty values are valid and later duplicate keys replace earlier values. Do not discard blank records. Invalid containers/record types raise ValueError; odd counts, blank keys and embedded delimiters report their one-based line number.",
							"load_pairs uses UTF-8, readlines and a context manager. Accept LF/CRLF and an unterminated final record. A final newline is not an extra blank value: an empty value needs its own physical blank line. Propagate normal missing/unreadable-file or decoding errors and preserve input bytes.",
							"main loads, prints and returns the dictionary. Replace the initial reminder with a guarded call after testing the helpers. Imports must not open files, print data or request input."
						],
						checkpoints: [
							"Independently predict a four-record fixture and inspect the original ten pairs, including surrounding whitespace on technology and tool.",
							"Check empty input, CRLF/LF, absent final newline, odd counts, blank keys/values, duplicate keys and missing files without modifying the original input.",
							"Explain why record position matters and why stripping surrounding whitespace differs from removing only a newline."
						],
						verification:
							"Confirm importing main.py and input.txt into the Python IDE, or run from starter with Python 3. Discuss one record-index trace with a course facilitator, then use independent expected dictionaries and temporary synthetic files. Inspect the result and save/export; reference answers remain in solution."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-File-IO-and-Dictionaries/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-File-IO-and-Dictionaries/solution"
				},
				{
					title: "AM12 Project 3: Word Translator with File I/O",
					aliases: ["AM12 Project 3: Juni Latin with File IO"],
					content: projectBrief({
						goal: "Combine a word-translation function implementing the original character rule with independently testable file-reading, translation and writing stages.",
						build: [
							"Retain input_no_punctuation.txt and input_punctuation.txt. The core uses the former; punctuation is a separate optional extension. This is not general Pig Latin or a known-word lookup.",
							"Implement translate(word): for a nonempty whitespace-free string, move its first character to the end and append ay. Empty input gives an empty string. Preserve character case and Unicode literally; non-string or whitespace-containing input raises ValueError. Core tokens follow the literal character rule, not a dictionary.",
							'Implement read_lines(path="input_no_punctuation.txt") with UTF-8 and a context manager. Remove record delimiters only, retaining blank lines; accept LF/CRLF and an unterminated final line. Empty files give []. Propagate normal file/decoding errors and preserve source bytes.',
							"translate_lines(lines, punctuation=False) receives a list of delimiter-free strings. Split each line on whitespace, translate tokens and join with single spaces: deliberately normalize leading/trailing spaces and repeated spaces/tabs while keeping one output line per input line, including blanks. Return a fresh list without mutation. Invalid containers, record types or embedded CR/LF raise ValueError, with line numbers for delimiter errors; punctuation must be Boolean.",
							'write_lines(lines, path="output.txt") validates the entire list before opening output, then writes UTF-8 with one LF after each record and no added trailing token spaces. Empty input writes an empty file. Return None; invalid records must preserve existing output. Valid output deliberately overwrites the destination.',
							'translate_file(input_path="input_no_punctuation.txt", output_path="output.txt", punctuation=False) rejects identical/equivalent paths and symlink/hardlink aliases with ValueError. Read and translate the complete source before writing, return the translated list and retain source bytes. Missing, undecodable or invalid input leaves existing output unchanged; ordinary output I/O errors propagate.',
							"Replace the starter's reminder with a guarded translate_file() call after the five core helpers work. Imports must not open files or run translation. Core completion does not require translate_punctuation."
						],
						checkpoints: [
							"Predict small tokens and a two-line fixture, then independently check empty/single-character tokens, literal case/Unicode, blank lines and normalized whitespace.",
							"Reopen output.txt and compare its exact line and final-newline policy. Test missing/undecodable input, malformed output records and aliases using temporary files.",
							"Explain the character rule and intentional whitespace changes without inventing unknown-word behavior."
						],
						extension:
							"Optionally implement translate_punctuation(word) and select it only with punctuation=True. Preserve leading/trailing clusters from Python's string.punctuation plus curly quotes “ ” ‘ ’ and ellipsis …. Empty or punctuation-only tokens remain unchanged. Internal characters, including straight/curly apostrophes, remain in the body and follow the same character rotation; do not promise language-aware contractions or an unchanged numeric index for arbitrary internal punctuation. Read input_punctuation.txt anew and write output_punctuation.txt in a separate call. Do not reuse core lines or a closed output handle.",
						verification:
							"Confirm importing the starter and original inputs in the Python IDE, or run from starter with Python 3. Discuss one trace with a course facilitator, independently test the stages, reopen output and save/export. The optional path also checks clustered/punctuation-only tokens and the original curly apostrophe in wasn’t. Completed reference code stays separate."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-Juni-Latin-with-File-IO/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-Juni-Latin-with-File-IO/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-In #3",
			curriculum: [
				{
					title: "Check-In #3 Overview",
					content: reviewBrief({
						focus: "Advanced sorting plus file input/output.",
						tasks: [
							"Confirm importing the linked starter into the Python IDE, or run Python 3 from starter. Initial Run is an exercise reminder; supplied bubbleSort is the unoptimized baseline to trace and improve.",
							"Trace each sorting algorithm before running the implementation; keep the separate reference and answer key outside the attempted starter.",
							"Explain how file data moves from disk into strings, lists, dictionaries, or output files.",
							"Return to any weak spot with one focused practice case."
						],
						evidence:
							"The final review names one sorting concept and one file-I/O concept that can be explained without notes."
					})
				},
				{
					title: "Check-In #3: Bubble Sort",
					content: reviewBrief({
						focus: "Bubble sort passes, adjacent swaps, and efficiency improvements.",
						tasks: [
							"Explain bubble sort.",
							"Predict two full left-to-right baseline bubbleSort passes on [4, 8, 2, 1, 10, 0] before running the supplied code.",
							"Implement bubble_sort(lst) ascending in place, returning the same list. Use both a shrinking suffix and a per-pass swap flag with actual no-swap early cutoff; strict swaps preserve tie order.",
							"Test empty/singleton, sorted, reversed and duplicate inputs. Count actual comparisons on sorted input for the baseline and improved versions, then explain best/worst work."
						],
						evidence:
							"The trace shows adjacent comparisons and the sorted suffix after each pass."
					})
				},
				{
					title: "Check-In #3: Merge Sort",
					content: reviewBrief({
						focus: "Merge sort splitting, merging, and recursive structure.",
						tasks: [
							"Explain merge sort.",
							"Complete merge(listA, listB) for already ascending lists: return a fresh stable merged list without changing either input. Use indices, taking left ties first; empty and unequal inputs work.",
							"Avoid pop(0), which shifts Python lists and undermines the linear-merge model. Verify identity, tie labels and leftovers separately.",
							"Explain merge sort's recursive splitting and cost. This assignment completes the merge helper, not a replacement full merge-sort project."
						],
						evidence:
							"The explanation connects sorted sublists to the final merge result."
					})
				},
				{
					title: "Check-In #3: Quicksort",
					content: reviewBrief({
						focus: "Quicksort partitioning and pivot-sensitive runtime.",
						tasks: [
							"Explain quicksort.",
							"Complete partition(lst, pivot), where pivot is a value, not an index. Return three fresh less/equal/greater lists in original within-group order; leave input unchanged. Empty input and a pivot absent from input work.",
							"Compare balanced/unbalanced recursive splits under a stated distinct-key model. Keep duplicates in the equal group so they do not enter a non-progressing recursive call.",
							"Discuss how a three-way equal group changes the all-equal case, then trace one new input independently."
						],
						evidence:
							"The explanation identifies how pivot quality changes recursion depth."
					})
				},
				{
					title: "Check-In #3: File Input/Output",
					content: reviewBrief({
						focus: "Writing, reading, and processing file contents.",
						tasks: [
							"Implement write_letters(word, path='file.txt'): validate that word is a string without CR/LF before opening output; invalid input raises ValueError. Write each exact Unicode character plus a newline using UTF-8 and a context manager; return None. Empty input is valid and valid runs deliberately overwrite the explicit output.",
							"Implement read_letter_counts(path='file.txt'): remove only record newlines, not meaningful spaces, and count literal case-sensitive characters in a dictionary. Empty files return {}; blank or longer records raise ValueError with the one-based line number. Missing/unreadable files propagate the normal file exception.",
							"Complete main to ask for a word, write it, read the file back and print the counts. Replace the direct-run reminder only after completing TODOs; imports do not ask for input or read/write files.",
							"Explain read() versus readlines() using a file with spaces and a last line without a newline. Neither automatically splits text into words.",
							"Use temporary fixtures for empty, repeated, Unicode, space and malformed records. Reopen generated file.txt in the IDE project, inspect its contents and save/export after inspection."
						],
						evidence:
							"The dictionary counts match the file contents after newline handling is considered."
					})
				},
				{
					title: "Check-In #3: Additional Practice Project",
					content: projectBrief({
						goal: "Read letters from a file, sort them, and write the sorted result back to disk.",
						build: [
							"Confirm importing the starter and input.txt into the Python IDE, or run Python 3 from starter. Complete read_letters(path='input.txt'): each UTF-8 record is exactly one ASCII character excluding CR/LF. Literal space/tab is valid; LF, CRLF and an absent final newline work. Empty files return []; blank, longer or non-ASCII records raise ValueError with a one-based line number.",
							"Implement sort_letters(letters): validate a list of those characters, return a fresh ascending ASCII-order list retaining duplicates, and leave input unchanged. Use a studied bubble, merge or quicksort, not built-in sort as the implementation; invalid values raise ValueError.",
							"Implement write_letters(letters, path='output.txt'): validate the full list before opening output, then write one character plus newline per record and return None. Valid runs deliberately overwrite output; invalid values preserve an existing file.",
							"Implement sort_file(input_path='input.txt', output_path='output.txt'): reject identical files, including path/symlink/hardlink aliases, with ValueError. Read/validate everything before writing, preserve input bytes and return the sorted list. Missing/unreadable input propagates normal exceptions; malformed input preserves existing output.",
							"After completing TODOs, replace the direct-run reminder with a guarded sort_file() call. Reopen output.txt in the project, compare independent expected order and save/export after inspection."
						],
						checkpoints: [
							"Empty input, duplicates, spaces, uppercase/lowercase and missing final newline have explicit expected results.",
							"Malformed records and output aliases fail before any source or existing output is overwritten.",
							"The output file can be reopened and checked; testing uses temporary files rather than overwriting the supplied example."
						],
						verification:
							"Predict one fixture, walk through its record handling and sorting with a course facilitator, then test different data independently. Compare exact input/output bytes and fresh-list identity; completed reference code stays separate from the starter."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM-Check-In-3-Additional-Project/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM13 Master Project: Conway's Game of Life",
			curriculum: [
				{
					title: "Introduction to Conway's Game of Life",
					content:
						"Conway's Game of Life is a cellular automaton. On a finite nonwrapping grid, count eight surrounding neighbors, excluding the cell: a dead cell is born with exactly three; a live cell survives with two or three (B3/S23). Compute every next cell from the same current generation. Complete the required Boolean simulation before the required ownership/strategy extension, predicting a small pattern before running."
				},
				{
					title: "AM13 Project 1: Conway's Game of Life",
					content: [
						"# Conway's Game of Life: required simulation project",
						"Build a file-driven cellular automaton with synchronous updates. This is a required\ncore capstone. The separate two-player project adds ownership and strategy after\nthis simulation works; it has a distinct purpose and is also required.",
						"Open the incomplete `starter`, not the separate `solution`. Confirm the site's\n**Open in Python IDE** request to import `main.py`, this README and all eight\n`.in` files. Initial Run prints a reminder. Complete functions before replacing\nthe guarded reminder with `main()`. For local work, open a terminal in this\nfolder and use `python3 main.py`. Relative filenames refer to that working folder.\nReference answers stay separate; read them after an attempt when checking work.",
						"## Rules and board",
						"Default size is 30 rows by 60 columns. A cell is exactly `False` (dead) or\n`True` (alive) in a rectangular list of lists. The board is finite and does not\nwrap: ignore neighbors outside its edges. Count the eight surrounding positions,\nincluding diagonals and excluding the cell itself.",
						"B3/S23 means a dead cell is born with exactly three live neighbors; a live cell\nsurvives with exactly two or three. Every other cell is dead next generation.\nCompute all next cells from the same current board, never partially updated rows.",
						"## Input and validation contract",
						"- Dimensions are positive integers; Booleans are not integers for this contract.\n  Coordinates are zero-based `(row, column)` pairs of integers, within the board.\n  Coordinate collections are lists of two-item tuples or lists.\n- `parse_coordinates` accepts a list of string records. Each nonblank physical\n  record contains exactly two signed ASCII decimal integers separated by\n  whitespace. Surrounding whitespace and one terminal LF, CR or CRLF are allowed;\n  embedded/new repeated record delimiters, extra fields, decimals, Unicode digits\n  and out-of-range indexes raise `ValueError`. Blank records are skipped.\n  Return a fresh list of tuples in input order, preserving duplicates.\n- `read_coordinates` opens the supplied path in UTF-8 read mode using `with`,\n  then parses physical records. Missing files and ordinary file/decoding errors\n  propagate. It never writes input. A final record need not end in a newline.\n- Validate a complete coordinate collection before constructing a board.\n  Duplicate coordinates for one pattern are idempotent. Rows must be separately\n  allocated. Inputs remain unchanged and returned boards have fresh rows.\n- Every board operation rejects an empty/ragged/non-list board or wrong cell\n  types with `ValueError`. An empty pattern means an all-dead positive-size board,\n  not `[]`. Addressed cells must be in bounds. `neighbors(..., alive, ...)`\n  additionally checks that `alive` has the exact required type and matches that\n  current cell. Validate before invoking output callbacks.\n- Optional callbacks resolve at call time: `output_fn=None` uses\n  `sys.stdout.write`; output callbacks accept one string. Noncallable configured\n  callbacks raise `ValueError`. There are no prompts, sleeps or file reads on\n  import. Helpers return fresh data and never write files.",
						"## Ten callable tasks",
						"Keep the signatures in `main.py`. Private helpers are allowed.",
						'1. `parse_coordinates(lines, height=30, width=60)`: implement the shared record\n   contract above.\n2. `read_coordinates(path, height=30, width=60)`: return parsed coordinates and\n   close the input even on failure.\n3. `make_grid(coords, height=30, width=60)`: return a fresh Boolean board with\n   exactly the requested coordinates alive.\n4. `count_neighbors(grid, i, j)`: return the integer live-neighbor count.\n5. `neighbors(grid, alive, i, j)`: return the next Boolean state for that cell.\n6. `next_generation(grid)`: return a synchronous fresh board of the same shape.\n7. `render_board(grid)`: return a string using `O` for live and `-` for dead,\n   no spaces or indexes, exactly one LF after every row including the last.\n8. `print_board(game, output_fn=None)`: send the complete rendered string to the\n   output callback once and return `None`.\n9. `run(grid, generations=5, delay=0.0, output_fn=None, sleep_fn=None)`: validate\n   configuration, copy the initial board, display `Generation 0\\n` and its\n   rendering, then display each completed update as `Generation N\\n` and its\n   rendering. `generations` is a nonnegative integer (not Boolean) or `None`.\n   Zero displays only the initial board. `delay` is finite and nonnegative\n   (integer/float, not Boolean); call the sleep callback before each update only\n   when delay is nonzero. `sleep_fn=None` resolves `time.sleep` at call time.\n   Return a fresh dictionary with exactly `status`, `grid`, `generations`.\n   Status is `completed` at the requested limit, or `cancelled` if a\n   `KeyboardInterrupt` occurs during the display/update loop. Count only\n   completed updates; return the most recently computed fresh board. Other\n   callback errors propagate. A still life or empty pattern still uses the\n   requested update count.\n10. `main(path="repeat.in", height=30, width=60, generations=5, delay=0.0,\n    output_fn=None, sleep_fn=None)`: validate configuration before opening,\n    read the pattern, build the board and return `run`\'s outcome. No input prompts\n    and no output files.',
						"## Patterns, run selection and checkpoints",
						'Original patterns are supplied unchanged in both roles:\n`repeat.in`, `square.in`, `boat.in`, `design1.in`, `f-pentomino.in`,\n`hertz-oscillator.in`, `b-heptomino-shuttle.in`, `spaceship.in`.\nAll fit the default size; `spaceship.in` uses column 59, so a smaller board\nmust be checked against its coordinates. To select a different pattern, change\nthe guarded call to `main(path="square.in")`; the filename is not a console prompt.',
						"- Before coding, trace one corner, one edge and one interior cell by hand.\n  Predict the result before running. Test a single cell dying, a 2-by-2 block\n  remaining stable, a three-cell blinker returning after two updates and an\n  all-dead board remaining dead.\n- Compare a copied input before/after an update; changing one returned row must\n  not change another row or the original. Check a non-default rectangular board\n  to expose hardcoded next-grid dimensions.\n- Default Run makes five updates without pauses. The original continuous\n  simulation is explicitly available as `main(generations=None, delay=0.5)`.\n  Local Ctrl-C returns a cancelled outcome; the IDE Stop button may terminate\n  the worker without returning an outcome. Continuous mode need not terminate\n  naturally, even when a pattern becomes stable.\n- Explain why one generation can take O(height × width) time and space when each\n  cell uses a private constant-size neighbor count. Public single-cell helpers\n  validate the whole board, so repeatedly calling those validating helpers\n  would add work. Complexity claims must describe the implementation used.\n- Save/export the project ZIP, including all pattern files; reopen saved work\n  and run a different pattern. No pattern or reference is auto-executed on import.",
						"For an instructor walkthrough, use the same sequence: predict, implement one\nhelper, compare evidence, then integrate. In the presentation, explain the\nfinite boundary, simultaneous update and file-to-board path with one cell trace."
					].join("\n\n"),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Conways-Game-of-Life/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Conways-Game-of-Life/solution"
				},
				{
					title: "AM13 Project 2: Two-Player Conway's Game of Life",
					content: [
						"# Two-Player Conway's Game of Life: required ownership project",
						"Extend the required single-player simulation with owned cells, legal paired edits\nand alternating turns. Both Conway projects are core. Reuse learner-written grid\nand parsing ideas, but keep this independently runnable pack separate: it teaches\nownership and turn/state reasoning rather than duplicating an animation.",
						"Confirm **Open in Python IDE** to import the incomplete `main.py`, this README,\n`player1.in` and `player2.in`. Initial Run prints a reminder. Complete functions\nbefore replacing the guarded reminder with `main()`. Locally run\n`python3 main.py` from this folder. Reference answers stay separate.",
						"## Rules, ownership and turn order",
						"The default board has 10 rows and 10 columns. Cells are exactly integers:\n`0` dead, `1` Player O, `2` Player X (Booleans rejected). Eight neighbors,\nfinite boundaries and synchronous B3/S23 are the same as the first project.\nA surviving cell retains its current owner even if opposing neighbors are the\nmajority. A dead cell born from exactly three neighbors belongs to their majority\nowner. No birth occurs at any other count.",
						"O starts, then X, alternating after each accepted turn, independent of cell\ncounts. A legal turn grows a cell at a dead position and kills one opponent\ncell. Validate both choices before changing anything. Apply the pair first,\ncheck extinction, then run one synchronous generation if both players remain.\nCheck extinction again. Do not run a generation before O's first edit.",
						"Initial files have five cells each, not squares. Reject overlap between the two\ninitial patterns. A full board has no legal grow: automatically pass that turn,\nadvance one generation and alternate. This explicit full-board policy completes\nan otherwise unspecified edge case. A pass counts as a turn.",
						"## Input and validation contract",
						"- Dimensions are positive integers; Booleans are not integers for this contract.\n  Coordinates are zero-based `(row, column)` pairs of integers, within the board.\n  Coordinate collections are lists of two-item tuples or lists.\n- `parse_coordinates` accepts a list of string records. Each nonblank physical\n  record contains exactly two signed ASCII decimal integers separated by\n  whitespace. Surrounding whitespace and one terminal LF, CR or CRLF are allowed;\n  embedded/new repeated record delimiters, extra fields, decimals, Unicode digits\n  and out-of-range indexes raise `ValueError`. Blank records are skipped.\n  Return a fresh list of tuples in input order, preserving duplicates.\n- `read_coordinates` opens the supplied path in UTF-8 read mode using `with`,\n  then parses physical records. Missing files and ordinary file/decoding errors\n  propagate. It never writes input. A final record need not end in a newline.\n- Validate a complete coordinate collection before constructing a board.\n  Duplicate coordinates for one pattern are idempotent. Rows must be separately\n  allocated. Inputs remain unchanged and returned boards have fresh rows.\n- Every board operation rejects an empty/ragged/non-list board or wrong cell\n  types with `ValueError`. An empty pattern means an all-dead positive-size board,\n  not `[]`. Addressed cells must be in bounds. `neighbors(..., alive, ...)`\n  additionally checks that `alive` has the exact required type and matches that\n  current cell. Validate before invoking output callbacks.\n- Optional callbacks resolve at call time: `output_fn=None` uses\n  `sys.stdout.write`; output callbacks accept one string. Noncallable configured\n  callbacks raise `ValueError`. There are no prompts, sleeps or file reads on\n  import. Helpers return fresh data and never write files.",
						"## Fourteen callable tasks",
						"Keep `main.py` signatures; private helpers are allowed.",
						'1. `parse_coordinates(lines, height=10, width=10)` and\n2. `read_coordinates(path, height=10, width=10)`: implement the shared contract.\n3. `make_grid(player1_coords, player2_coords, height=10, width=10)`: validate\n   both lists and their nonoverlap, then return a fresh owned board.\n4. `neighbor_counts(grid, i, j)`: return a fresh tuple `(O_count, X_count)`.\n5. `neighbors(grid, alive, i, j)`: return integer next ownership, following\n   survival retention and three-neighbor birth majority.\n6. `next_generation(grid)`: return a fresh synchronous board of the same shape.\n7. `count_board(grid)`: return a fresh list `[O_count, X_count]`.\n8. `render_board(grid)`: return zero-based column indexes in a header and row\n   indexes before each row, using `O`, `X`, `-`. Right-align row indexes to\n   the digits in height minus one, and columns/symbols to the digits in width\n   minus one, with one separating space and no trailing spaces. Finish every\n   line with LF. For `[[1, 0], [0, 2]]`, return\n   `"  0 1\\n0 O -\\n1 - X\\n"`.\n9. `print_board(game, output_fn=None)`: send the complete rendering once and\n   return `None`.\n10. `parse_move(text, height=10, width=10)`: return one tuple from exactly one\n    coordinate record. Blank or non-string input raises `ValueError`.\n11. `apply_turn(grid, player, grow, kill)`: player must be exactly integer 1\n    or 2. Grow must select dead; kill must select opponent. Reject invalid pairs\n    with `ValueError` without mutation. Return a fresh edited board.\n12. `board_status(grid)`: return `ongoing` if both have cells, `o_wins` if\n    only O, `x_wins` if only X, `draw` if neither. Check actual counts.\n13. `play(grid, max_turns=50, input_fn=None, output_fn=None)`: validate\n    configuration; copy/display the initial board and both counts; check initial\n    extinction before prompting. `max_turns` is a nonnegative integer, not\n    Boolean, or `None`. Zero returns the initial terminal result or `limit`.\n    `input_fn=None` resolves built-in `input` at call time; callbacks accept\n    the prompt string. For each non-full-board turn ask grow, then kill. Accept\n    surrounding-whitespace/case-insensitive `quit` at either prompt as\n    cancellation, and treat input EOF or KeyboardInterrupt as cancellation.\n    Invalid records or illegal pairs report `Invalid turn` and retry the same\n    player with no edit and no turn consumed. If either coordinate record is\n    invalid, begin a new pair. Report both counts after edits and each generation.\n    Follow the phase order above and stop on initial, post-edit or post-generation\n    extinction. Never announce a winner on cancellation or turn limit.\n    Return a fresh dictionary with exactly `status`, `grid`, `turns`,\n    `next_player`. Status is one of the four board states, `cancelled`, or\n    `limit`; a returned outcome never has `ongoing`. Turns counts accepted\n    edit pairs/passes only; next_player is 1 initially and toggles after each.\n    Output errors and unexpected input callback errors propagate.\n14. `main(player1_path="player1.in", player2_path="player2.in", height=10,\n    width=10, max_turns=50, input_fn=None, output_fn=None)`: validate\n    configuration before opening either input, read both patterns, build and\n    return `play`\'s result. No output files or import-time activity.',
						"## Workflow and self-checks",
						"- Read the indexed board before entering `row column`, for example `0 0`.\n  Do not enter Python tuple syntax. With the supplied patterns, O can grow at\n  `0 0` and kill X at `4 8`. Predict the edited board and generation before\n  running; those moves are an input example, not a strategy recommendation.\n- Before editing the loop, trace surviving ownership under an opposing majority,\n  majority births, a corner and simultaneous extinction. Test invalid grow,\n  own-cell kill, out-of-range coordinates, cancellation at each prompt and an\n  invalid pair followed by a valid pair. The invalid attempt must change nothing.\n- Check an initial terminal board, post-edit last-opponent removal,\n  post-generation wins/draw and a full-board automatic pass. Counts do not select\n  the next player. Keep original inputs and intermediate generations distinct.\n- Default Run caps accepted turns at 50; invalid attempts do not use this cap\n  and repeated invalid input may still need cancellation. Select the original\n  continue-until-terminal game explicitly with `main(max_turns=None)`.\n  Cycles need not end naturally. Use `quit` or local Ctrl-C during input;\n  IDE Stop may terminate the worker without a returned outcome.\n- To use different patterns, change the guarded filename arguments. All original\n  bytes stay unchanged. Save/export both `.in` files with the project ZIP,\n  reopen saved work and repeat a short game. Import never runs the game.\n- Walk through the same predict/implement/check sequence alone or with a course\n  facilitator. Present a complete turn trace, explaining why edits precede the\n  generation and why a survivor keeps its owner. O(height × width) generation\n  work assumes constant-size private neighbor checks after one validation pass."
					].join("\n\n"),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Two-Player-Conways/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Two-Player-Conways/solution"
				},
				{
					title: "Master Project Presentation",
					content: reviewBrief({
						focus: "Conway project design and implementation explanation.",
						tasks: [
							"Explain the grid representation.",
							"Explain the update rules.",
							"Explain how file input creates the starting board.",
							"Describe any additional features or strategies used in the implementation."
						],
						evidence:
							"The presentation can trace one cell from current state and neighbor count to next-generation result."
					})
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM14 Master Project: Tic Tac Toe AI",
			curriculum: [
				{
					title: "Introduction to Artificial Intelligence",
					content:
						"Artificial intelligence can be described as making a computer act rationally for a specific task. In this module, the goal is to design a Tic Tac Toe program that chooses strong moves instead of playing randomly."
				},
				{
					title: "AM14 Project 1: Tic Tac Toe UI",
					content: projectBrief({
						goal: "Build the playable console foundation with legal human input, random legal computer moves and honest terminal outcomes.",
						build: [
							"Confirm importing the linked starter into the Python IDE, or use Python 3 locally. Initial Run prints a reminder; the public callables are intentionally incomplete. Predict each case and implement or carry forward independently verified, learner-written functions. Keep the separate reference outside the attempted starter.",
							"Use three list rows of three exact string cells: space, X or O. Coordinates are exact integers 0..2; reject Boolean coordinates. Rows run top to bottom, columns left to right. Any three matching marks across one row, column or diagonal win; a full board without a winner draws. There is no wrapping.",
							"Implement make_board() and duplicate_board(board) with fresh separate rows. win(board, player) checks all eight lines for X/O, and finished(board) checks full occupancy independently of wins. Validate board shape and cell/player domains with ValueError; hypothetical mark-count imbalance is permitted for candidate analysis.",
							"game_status(board) returns ongoing, X_won, O_won or draw and rejects simultaneous winners. legal_moves(board) returns fresh row-major [row,col] pairs, or [] for an ended game. apply_move(board, player, row, col) validates an ongoing game and empty in-range square before returning copied rows with one edit. Caller-owned boards remain unchanged.",
							"A supplied rng needs callable choice(sequence); None resolves the current random module at call time. Validate returned random coordinates against the original legal list even if the callback changes its received copy. Standard random selection is uniform over a finite legal list. Strategy helpers return a fresh move or None for an ended game; unexpected callback errors propagate.",
							"Implement random_player_move(board, rng=None) by choosing from the finite legal list, with None for an ended game. Do not repeatedly guess occupied positions; a full or won board needs no move.",
							"render_board(board) returns three ASCII rows with | dividers, ---+---+--- separators and a final LF. print_board(board, output_fn=None) sends the whole render in one callback call; default print adds its usual newline. No clearing commands, sleeps, network requests or files are part of the game.",
							"parse_coordinate(text) trims whitespace and accepts signed ASCII integer text valued 0..2, or case-insensitive quit returning None. Empty, decimal, Unicode-digit, out-of-range and non-text records raise ValueError. Prompt for row then column; malformed text or an occupied square retries the whole pair without editing or advancing the turn.",
							"play(start_player=None, input_fn=None, output_fn=None, rng=None) starts empty with human X and computer O. None chooses the starting mark randomly; explicit X/O selects it. Input/output defaults resolve current built-ins at call time; validate configuration before I/O. Print the initial board and each accepted move, alternate accepted turns and stop immediately after win/draw.",
							"Quit at either prompt, EOF or an input KeyboardInterrupt cancels with no winner. Unexpected input/output/strategy errors propagate. play and main return fresh status/winner/board/moves/start_player fields: status is X_won, O_won, draw or cancelled; winner is X/O only for a win; moves are accepted (player,row,col) tuples. A completed game uses at most nine accepted moves; endlessly invalid input is not a termination guarantee.",
							'After implementing or porting the required functions, replace the reminder with a guarded main() call. main(start_player=None, input_fn=None, output_fn=None, rng=None) returns play’s outcome. Use main(start_player="X") for a predictable human-first trace. Imports remain quiet.'
						],
						checkpoints: [
							"Predict a row, column, diagonal win and a full-board draw; independently verify fresh rows, unchanged input and every terminal state.",
							"Exercise malformed coordinates, occupied cells, quit at each prompt and EOF. Invalid input never advances the turn or reports a winner.",
							"Replay one X-first and one O-first game, checking alternation and the nine-accepted-move bound."
						],
						verification:
							"Confirm the distinct starter import, predict a fixture and explain a trace with a course facilitator, then independently check the required functions. Run the guarded entry point, save and export the learner project, and reopen the saved work. Completed reference answers remain separate."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-UI/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-UI/solution"
				},
				{
					title: "AM14 Project 2: Tic Tac Toe AI",
					content: projectBrief({
						goal: "Extend learner-written UI code with copied-board candidate evaluation and the original basic tactical priorities.",
						build: [
							"Confirm importing the linked starter into the Python IDE, or use Python 3 locally. Initial Run prints a reminder; the public callables are intentionally incomplete. Predict each case and implement or carry forward independently verified, learner-written functions. Keep the separate reference outside the attempted starter.",
							"Use three list rows of three exact string cells: space, X or O. Coordinates are exact integers 0..2; reject Boolean coordinates. Rows run top to bottom, columns left to right. Any three matching marks across one row, column or diagonal win; a full board without a winner draws. There is no wrapping.",
							"Implement make_board() and duplicate_board(board) with fresh separate rows. win(board, player) checks all eight lines for X/O, and finished(board) checks full occupancy independently of wins. Validate board shape and cell/player domains with ValueError; hypothetical mark-count imbalance is permitted for candidate analysis.",
							"game_status(board) returns ongoing, X_won, O_won or draw and rejects simultaneous winners. legal_moves(board) returns fresh row-major [row,col] pairs, or [] for an ended game. apply_move(board, player, row, col) validates an ongoing game and empty in-range square before returning copied rows with one edit. Caller-owned boards remain unchanged.",
							"A supplied rng needs callable choice(sequence); None resolves the current random module at call time. Validate returned random coordinates against the original legal list even if the callback changes its received copy. Standard random selection is uniform over a finite legal list. Strategy helpers return a fresh move or None for an ended game; unexpected callback errors propagate.",
							"test_win(board, i, j, player) validates a candidate and tests copied state; occupied or ended positions return false. winning_moves(board, player) returns fresh immediate winning coordinates in row-major order. Candidate evaluation never mutates the actual board.",
							'The basic ai_player_move(board, rng=None, player="O") prioritizes the first own win, first opponent win to block, center, then the first open corner in top-left/top-right/bottom-left/bottom-right order, then a random legal side. Own wins precede blocks. Default O preserves the computer role; configure player="X" for a strategy acting as X. Record a weak position when evaluation finds one.',
							"render_board(board) returns three ASCII rows with | dividers, ---+---+--- separators and a final LF. print_board(board, output_fn=None) sends the whole render in one callback call; default print adds its usual newline. No clearing commands, sleeps, network requests or files are part of the game.",
							"parse_coordinate(text) trims whitespace and accepts signed ASCII integer text valued 0..2, or case-insensitive quit returning None. Empty, decimal, Unicode-digit, out-of-range and non-text records raise ValueError. Prompt for row then column; malformed text or an occupied square retries the whole pair without editing or advancing the turn.",
							"play(start_player=None, input_fn=None, output_fn=None, rng=None) starts empty with human X and computer O. None chooses the starting mark randomly; explicit X/O selects it. Input/output defaults resolve current built-ins at call time; validate configuration before I/O. Print the initial board and each accepted move, alternate accepted turns and stop immediately after win/draw.",
							"Quit at either prompt, EOF or an input KeyboardInterrupt cancels with no winner. Unexpected input/output/strategy errors propagate. play and main return fresh status/winner/board/moves/start_player fields: status is X_won, O_won, draw or cancelled; winner is X/O only for a win; moves are accepted (player,row,col) tuples. A completed game uses at most nine accepted moves; endlessly invalid input is not a termination guarantee.",
							'After implementing or porting the required functions, replace the reminder with a guarded main() call. main(start_player=None, input_fn=None, output_fn=None, rng=None) returns play’s outcome. Use main(start_player="X") for a predictable human-first trace. Imports remain quiet.'
						],
						checkpoints: [
							"Predict an immediate win, an opponent block and a position offering both; the own win takes precedence.",
							"Test empty-board center choice, original corner ordering, both acting marks and unchanged input rows.",
							"Keep a reproducible weak decision or losing trace for the evaluation stage; this basic heuristic is not an optimality claim."
						],
						verification:
							"Confirm the distinct starter import, predict a fixture and explain a trace with a course facilitator, then independently check the required functions. Run the guarded entry point, save and export the learner project, and reopen the saved work. Completed reference answers remain separate."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI/solution"
				},
				{
					title: "AM14 Project 3: Tic Tac Toe AI Test",
					content: projectBrief({
						goal: "Evaluate the earlier AI against a random player using reproducible legal games, correct bookkeeping and a retained first-loss trace.",
						build: [
							"Confirm importing the linked starter into the Python IDE, or use Python 3 locally. Initial Run prints a reminder; the public callables are intentionally incomplete. Predict each case and implement or carry forward independently verified, learner-written functions. Keep the separate reference outside the attempted starter.",
							"Use three list rows of three exact string cells: space, X or O. Coordinates are exact integers 0..2; reject Boolean coordinates. Rows run top to bottom, columns left to right. Any three matching marks across one row, column or diagonal win; a full board without a winner draws. There is no wrapping.",
							"Implement make_board() and duplicate_board(board) with fresh separate rows. win(board, player) checks all eight lines for X/O, and finished(board) checks full occupancy independently of wins. Validate board shape and cell/player domains with ValueError; hypothetical mark-count imbalance is permitted for candidate analysis.",
							"game_status(board) returns ongoing, X_won, O_won or draw and rejects simultaneous winners. legal_moves(board) returns fresh row-major [row,col] pairs, or [] for an ended game. apply_move(board, player, row, col) validates an ongoing game and empty in-range square before returning copied rows with one edit. Caller-owned boards remain unchanged.",
							"A supplied rng needs callable choice(sequence); None resolves the current random module at call time. Validate returned random coordinates against the original legal list even if the callback changes its received copy. Standard random selection is uniform over a finite legal list. Strategy helpers return a fresh move or None for an ended game; unexpected callback errors propagate.",
							"test_win(board, i, j, player) validates a candidate and tests copied state; occupied or ended positions return false. winning_moves(board, player) returns fresh immediate winning coordinates in row-major order. Candidate evaluation never mutates the actual board.",
							'The basic ai_player_move(board, rng=None, player="O") prioritizes the first own win, first opponent win to block, center, then the first open corner in top-left/top-right/bottom-left/bottom-right order, then a random legal side. Own wins precede blocks. Default O preserves the computer role; configure player="X" for a strategy acting as X. Record a weak position when evaluation finds one.',
							"Implement random_player_move(board, rng=None) by choosing from the finite legal list, with None for an ended game. Do not repeatedly guess occupied positions; a full or won board needs no move.",
							"Reuse and retest learner-written board and basic strategy functions. play_game(start_player=None, rng=None, x_move_fn=None, o_move_fn=None) starts fresh with random X/basic AI O defaults. Each callable strategy receives (copied_board, rng), returns a legal two-integer list/tuple and cannot edit the real board through its private copy. Invalid results raise ValueError; unexpected strategy errors propagate.",
							"Alternate accepted turns, stop at the first win/draw and accept at most nine moves. Return fresh status/winner/board/moves/start_player fields matching console outcomes; no console input or file writing is part of play_game. Custom callbacks need their own termination guarantee.",
							"evaluate(games=1000, seed=0, start_player=None, x_move_fn=None, o_move_fn=None) validates an exact integer game count 0..10000, an exact integer seed or None, X/O/None start and callable/None strategies before running. Use one fresh random.Random(seed) across the batch. None seed intentionally chooses a non-reproducible batch; None start randomizes the first mark separately each game.",
							"Return games/seed/start_player, x_wins/o_wins/draws, rates mapping those three count keys to count/games fractions, and first_x_win containing the first full X-win trace or None. Counts sum to games. A zero-game batch has zero counts, 0.0 rates and no fabricated outcome. Repeated reports have fresh mutable data.",
							'main(games=1000, seed=0, start_player=None, output_fn=None) prints default random-X/basic-O counts, percentages and evidence scope, then returns its report. Initial Run remains a reminder until the guarded call is enabled. Start with main(games=10, seed=0, start_player="X"), then use the original-sized 1000-game batch. Imports never run an experiment.',
							'Repeat matching seeds/order/policies for reproducibility and separate X-first from O-first results. Carry learner-written strategies into this project; configure a callback acting as X explicitly with player="X". Many wins against the sampled random opponent do not prove optimality; keep and replay a first-loss trace before adding forks. Full legal-opponent game-tree enumeration is a separate evidence method.'
						],
						checkpoints: [
							"Check zero-game results, count/rate consistency and identical reports for identical seed/order/policies.",
							"Replay retained traces independently; every move is legal and no move follows a win or full-board draw.",
							"Verify bad strategy results fail explicitly and a callback changing its private board cannot change the real game.",
							"Explain the tested opponent, seed and starting order before interpreting counts; retain one basic-AI weakness for the fork stage."
						],
						verification:
							"Confirm the distinct starter import, predict a fixture and explain a trace with a course facilitator, then independently check the required functions. Run the guarded entry point, save and export the learner project, and reopen the saved work. Completed reference answers remain separate."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI-Test/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI-Test/solution"
				},
				{
					title: "AM14 Project 4: Advanced Tic Tac Toe AI",
					content: projectBrief({
						goal: "Extend the earlier AI with distinct-threat fork creation and deliberate single/multiple-fork defenses.",
						build: [
							"Confirm importing the linked starter into the Python IDE, or use Python 3 locally. Initial Run prints a reminder; the public callables are intentionally incomplete. Predict each case and implement or carry forward independently verified, learner-written functions. Keep the separate reference outside the attempted starter.",
							"Use three list rows of three exact string cells: space, X or O. Coordinates are exact integers 0..2; reject Boolean coordinates. Rows run top to bottom, columns left to right. Any three matching marks across one row, column or diagonal win; a full board without a winner draws. There is no wrapping.",
							"Implement make_board() and duplicate_board(board) with fresh separate rows. win(board, player) checks all eight lines for X/O, and finished(board) checks full occupancy independently of wins. Validate board shape and cell/player domains with ValueError; hypothetical mark-count imbalance is permitted for candidate analysis.",
							"game_status(board) returns ongoing, X_won, O_won or draw and rejects simultaneous winners. legal_moves(board) returns fresh row-major [row,col] pairs, or [] for an ended game. apply_move(board, player, row, col) validates an ongoing game and empty in-range square before returning copied rows with one edit. Caller-owned boards remain unchanged.",
							"A supplied rng needs callable choice(sequence); None resolves the current random module at call time. Validate returned random coordinates against the original legal list even if the callback changes its received copy. Standard random selection is uniform over a finite legal list. Strategy helpers return a fresh move or None for an ended game; unexpected callback errors propagate.",
							"test_win(board, i, j, player) validates a candidate and tests copied state; occupied or ended positions return false. winning_moves(board, player) returns fresh immediate winning coordinates in row-major order. Candidate evaluation never mutates the actual board.",
							"test_fork(board, i, j, player) tests a non-winning candidate creating at least two distinct empty coordinates that each win on the next same-mark turn. Count coordinates, not winning lines through one square. Immediate wins are not forks; occupied/ended candidates are false. fork_moves(board, player) returns fresh row-major fork coordinates without mutation.",
							'The advanced ai_player_move(board, rng=None, player="O") preserves own win, opponent block, first own fork, opponent fork defense, center, original corner order and random-side priorities. Block one opponent fork directly at its coordinate.',
							"For multiple opponent forks, consider top-middle, middle-left, middle-right, bottom-middle, then other legal squares. Prefer a move creating one own immediate threat whose compulsory opponent block neither wins nor creates a fork. Otherwise choose the first candidate removing all immediate opponent forks. If neither defense exists, continue the stated center/corner/side heuristic. Explain the forcing reply instead of selecting a side unconditionally.",
							"Compare learner-written earlier and advanced policies against random play and each other using the evaluation harness with explicit marks and both starts. Independent reference game-tree checks cover every legal opponent response and possible random fallback from empty boards and find no losses for the revised 3x3 reference policy. That result requires separate verification of other implementations and does not cover already-lost arbitrary positions.",
							"render_board(board) returns three ASCII rows with | dividers, ---+---+--- separators and a final LF. print_board(board, output_fn=None) sends the whole render in one callback call; default print adds its usual newline. No clearing commands, sleeps, network requests or files are part of the game.",
							"parse_coordinate(text) trims whitespace and accepts signed ASCII integer text valued 0..2, or case-insensitive quit returning None. Empty, decimal, Unicode-digit, out-of-range and non-text records raise ValueError. Prompt for row then column; malformed text or an occupied square retries the whole pair without editing or advancing the turn.",
							"play(start_player=None, input_fn=None, output_fn=None, rng=None) starts empty with human X and computer O. None chooses the starting mark randomly; explicit X/O selects it. Input/output defaults resolve current built-ins at call time; validate configuration before I/O. Print the initial board and each accepted move, alternate accepted turns and stop immediately after win/draw.",
							"Quit at either prompt, EOF or an input KeyboardInterrupt cancels with no winner. Unexpected input/output/strategy errors propagate. play and main return fresh status/winner/board/moves/start_player fields: status is X_won, O_won, draw or cancelled; winner is X/O only for a win; moves are accepted (player,row,col) tuples. A completed game uses at most nine accepted moves; endlessly invalid input is not a termination guarantee.",
							'After implementing or porting the required functions, replace the reminder with a guarded main() call. main(start_player=None, input_fn=None, output_fn=None, rng=None) returns play’s outcome. Use main(start_player="X") for a predictable human-first trace. Imports remain quiet.'
						],
						checkpoints: [
							"Predict a genuine fork, an immediate winning candidate and two winning lines through one coordinate; count distinct future winning coordinates.",
							"Trace an opposite-corner opponent fork and the forced blocking reply for a side move. Prove the defense leaves no immediate winning or fork-producing compulsory reply.",
							"Compare the earlier and advanced strategies for both marks/starts, preserve traces and separate measured random-opponent performance from exhaustive legal-opponent evidence."
						],
						verification:
							"Confirm the distinct starter import, predict a fixture and explain a trace with a course facilitator, then independently check the required functions. Run the guarded entry point, save and export the learner project, and reopen the saved work. Completed reference answers remain separate."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI-with-Forks/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI-with-Forks/solution"
				},
				{
					title: "Master Project Presentation",
					content: reviewBrief({
						focus: "Tic Tac Toe AI design, evaluation, and strategy limits.",
						tasks: [
							"Explain how the board is represented.",
							"Explain how the AI evaluates candidate moves.",
							"Describe the testing used to measure strategy strength.",
							"Name one remaining limitation or improvement path."
						],
						evidence:
							"The presentation traces one candidate move from board state to AI decision."
					})
				},
				{
					title: "Course Recap",
					content: reviewBrief({
						focus: "Course-wide synthesis and next-course readiness.",
						tasks: [
							"Review functions, lists, dictionaries, recursion, stacks, searching, sorting, Big-O notation, file input/output, simulations, and rule-based AI.",
							"Identify the strongest and weakest topic areas.",
							"Compare next-course options based on future goals and interests."
						],
						evidence:
							"The recap connects at least three course concepts to projects completed during the course."
					})
				}
			],
			supplementalProjects: []
		}
	]
});

interface PythonLevel3FlowConfig {
	title: string;
	estimatedTime: string;
	keyBlocks: string[];
	choiceCurriculumTitles?: string[];
	challengeCurriculumTitles?: string[];
	projectThread: string;
}

const PYTHON_LEVEL_3_FLOW: PythonLevel3FlowConfig[] = [
	{
		title: "AM1 Review: Variables, Strings, Input, Loops, & Conditionals",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"input and conversion",
			"string indexing",
			"for / while loop",
			"if / elif / else",
			"command loop"
		],
		choiceCurriculumTitles: ["AM1 Project 3: Command Assistant"],
		projectThread:
			"Use Mad Libs and Fictional Language Verifier as a placement-quality review of data flow and branching. Command Assistant is an optional sustained-loop application when review evidence shows readiness."
	},
	{
		title: "AM2 Review: Functions & Lists",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"def",
			"parameter / argument",
			"return value",
			"list index",
			"list mutation"
		],
		projectThread:
			"Trace one function call and one list mutation before combining helpers with collection processing. Review can accelerate only when both state changes can be explained."
	},
	{
		title: "AM3 Review: Dictionaries & Recap",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"key-value pair",
			"dictionary lookup",
			"missing key",
			"collection selection",
			"readiness evidence"
		],
		projectThread:
			"Use the fundamentals problem set as a readiness gate. Record the specific review gap, if any, before recursion begins instead of repeating every earlier topic by default."
	},
	{
		title: "AM4 Recursion Part 1",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"base case",
			"recursive case",
			"smaller input",
			"call stack",
			"return unwinding"
		],
		challengeCurriculumTitles: [
			"AM4 Project 3: Recursive Fibonacci Numbers"
		],
		projectThread:
			"Trace factorial and exponent calls before coding them, labeling the base case, smaller input, and returned value. Recursive Fibonacci is the challenge because repeated subproblems expose efficiency limits."
	},
	{
		title: "AM5 Recursion Part 2",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"substring",
			"recursive shrink",
			"stack LIFO",
			"push / pop",
			"balanced delimiter"
		],
		choiceCurriculumTitles: ["AM5 Project 1: Recursive Cascade"],
		projectThread:
			"Connect recursive string reduction to the runtime stack, then implement palindrome checking and an explicit stack-based parentheses validator. Recursive Cascade remains a visual warm-up choice."
	},
	{
		title: "Check-In #1",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"string helper",
			"base case",
			"recursive trace",
			"stack state",
			"failure diagnosis"
		],
		projectThread:
			"Diagnose string helpers, recursion, and explicit stacks separately. The running-sum project remains a required core review project; complete its forward/reverse traces, discuss one case with a course facilitator, and test different data independently."
	},
	{
		title: "AM6 Introduction to Algorithms & Runtime Analysis",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"linear search",
			"input size n",
			"O(n)",
			"best / worst case",
			"operation count"
		],
		challengeCurriculumTitles: ["AM6 Project 3: Function Analysis"],
		projectThread:
			"Implement and trace linear search before naming its growth rate. Big-O work compares operation counts as input grows; Function Analysis is the transfer challenge."
	},
	{
		title: "AM7 Binary Search",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"sorted precondition",
			"low / high",
			"midpoint",
			"discard half",
			"O(log n)"
		],
		projectThread:
			"Trace the sorted-input invariant and midpoint updates before implementation. Reverse Number Guesser and Runtime Comparator remain required core projects: first build the computer-led game, then measure comparable search batches. Only the player-led Number Guesser is optional; its secret and guess roles are deliberately reversed."
	},
	{
		title: "AM8 Selection Sort & Insertion Sort",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"sorted / unsorted region",
			"minimum selection",
			"insertion shift",
			"invariant",
			"O(n²)"
		],
		projectThread:
			"Trace the list after every outer pass for both algorithms. Compare their invariants, movement patterns, and nearly-sorted behavior before comparing only their shared O(n²) bound."
	},
	{
		title: "Check-In #2",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"complexity class",
			"linear-search trace",
			"binary-search invariant",
			"selection-sort pass",
			"insertion-sort pass"
		],
		projectThread:
			"Each algorithm family includes a trace and a complexity explanation. The two-sort timing project remains a required core review project, distinct from the later five-sort comparison; use shared inputs and discuss measured results after checking correctness."
	},
	{
		title: "AM9 Bubble Sort",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"adjacent comparison",
			"swap",
			"outer pass",
			"early exit",
			"O(n²)"
		],
		projectThread:
			"Trace adjacent comparisons and swaps through one complete pass, then add an early-exit condition. Baseball Analytics remains a required core data-context project after the sort is independently verified; it adds keyed records, stable descending ties and unchanged-input checks."
	},
	{
		title: "AM10 Merge Sort",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"split",
			"merge",
			"base case",
			"recursive levels",
			"O(n log n)"
		],
		projectThread:
			"Build and test merge and split separately before composing merge sort. Trace one full recursion tree and verify duplicates, odd lengths, empty input, and already-sorted input."
	},
	{
		title: "AM11 Quicksort",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"pivot",
			"partition",
			"recursive subarray",
			"average O(n log n)",
			"worst O(n²)"
		],
		challengeCurriculumTitles: ["AM11 Project 3: Sorting Comparison"],
		projectThread:
			"Verify partition independently, then trace pivot values across recursive calls. Sorting Comparison remains a required project: independently verify each sorter, then compare measured behavior across shared input shapes."
	},
	{
		title: "AM12 File Input/Output",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"with open(...)",
			"read / write mode",
			"line parsing",
			"dictionary from file",
			"missing-file handling"
		],
		projectThread:
			"Complete the required single-file Crazy Name Tags project to practice formatting and deliberate writing; only its separate-file extension is optional. Then read a small file before parsing structured lines into a dictionary. Dictionary reading and the Word Translator remain required core projects with distinct purposes: alternating key/value construction versus a read/transform/write pipeline. Complete core translation after file closure, malformed-line and missing-file behavior are explicit; only its punctuation extension is optional."
	},
	{
		title: "Check-In #3",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"bubble-sort trace",
			"merge-sort trace",
			"quicksort partition",
			"file lifecycle",
			"algorithm choice"
		],
		projectThread:
			"Compare sorting traces and file-lifecycle reasoning. The ASCII file-sorting project remains a required core review project; predict a fixture, complete its read/sort/write workflow, reopen the output and test different data independently."
	},
	{
		title: "AM13 Master Project: Conway's Game of Life",
		estimatedTime: "4–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"2D grid",
			"neighbor count",
			"current / next state",
			"boundary policy",
			"generation test"
		],
		projectThread:
			"Both Conway projects remain required core capstones with distinct purposes. Treat the first project as the simulation capstone: verify the finite synchronous Boolean simulation; then extend learner-written ideas with retained ownership, paired legal edits, alternating turns and explicit extinction/cancellation outcomes. Predict each phase before running and keep reference answers separate."
	},
	{
		title: "AM14 Master Project: Tic Tac Toe AI",
		estimatedTime: "5–8 sessions · 45–60 minutes each",
		keyBlocks: [
			"board representation",
			"legal move",
			"win evaluation",
			"AI decision",
			"strategy test"
		],
		projectThread:
			"All four Tic Tac Toe stages remain required core work with distinct purposes: playable UI, copied-board basic tactics, reproducible evaluation and fork-aware defense. Together these stages form the AI capstone. Carry forward independently verified learner-written functions, retain reference answers separately and distinguish sampled performance from complete legal-opponent evidence."
	}
];

const PYTHON_LEVEL_3_CHALLENGE_TITLE_RE =
	/recursive sum and max|substring generator|advanced|extension/i;
const PYTHON_LEVEL_3_COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const PYTHON_LEVEL_3_NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const PYTHON_LEVEL_3_LEADING_HYPHENS_RE = /^-+/;
const PYTHON_LEVEL_3_TRAILING_HYPHENS_RE = /-+$/;

function pythonLevel3Slugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(PYTHON_LEVEL_3_COMBINING_MARKS_RE, "")
		.replace(PYTHON_LEVEL_3_NON_ALPHANUMERIC_RE, "-")
		.replace(PYTHON_LEVEL_3_LEADING_HYPHENS_RE, "")
		.replace(PYTHON_LEVEL_3_TRAILING_HYPHENS_RE, "");
}

function preservePythonLevel3Ids(
	module: RawCourseModule,
	legacyModuleId: string
) {
	for (const [items, prefix] of [
		[module.curriculum, "curriculum"],
		[module.supplementalProjects, "supplemental"]
	] as const) {
		for (const item of items) {
			item.id ??= pythonLevel3Slugify(
				`${legacyModuleId}-${prefix}-${item.title}`
			);
		}
	}
}

function pythonLevel3SupplementalPath(
	item: Pick<RawCourseModuleItem, "title">
): CourseItemLearningPath {
	return PYTHON_LEVEL_3_CHALLENGE_TITLE_RE.test(item.title)
		? "challenge"
		: "choice";
}

function configurePythonLevel3Module(
	module: RawCourseModule,
	config: PythonLevel3FlowConfig
) {
	const legacyModuleId = pythonLevel3Slugify(
		`python-level-3-${module.title}`
	);
	module.id ??= legacyModuleId;
	preservePythonLevel3Ids(module, legacyModuleId);

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
		item.learningPath = pythonLevel3SupplementalPath(item);
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

function configurePythonLevel3Flow(course: RawCourse) {
	const modulesByTitle = new Map(
		course.modules.map(module => [module.title, module])
	);

	course.modules = PYTHON_LEVEL_3_FLOW.map(config => {
		const module = modulesByTitle.get(config.title);
		if (!module) {
			throw new Error(`Python Level 3 flow is missing ${config.title}.`);
		}
		return configurePythonLevel3Module(module, config);
	});
}

configurePythonLevel3Flow(pythonLevel3Course);
