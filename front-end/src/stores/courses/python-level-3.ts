import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "./types";
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
	goal
}: {
	build: string[];
	checkpoints: string[];
	extension?: string;
	goal: string;
}) {
	return [
		`**Goal:** ${goal}`,
		`**Build path:**\n${build.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
		`**Checkpoints:**\n${checkpoints.map(checkpoint => `- ${checkpoint}`).join("\n")}`,
		`**Verification:** The finished project proves "${goal}" with a correctness trace, a normal case, a boundary or adversarial case, and a short note explaining the algorithmic or data-structure choice.`,
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
					content:
						"This opening section establishes the coding environment, course navigation, editor workflow, instructions, and console. The review can move in sequence or jump directly to the areas that need the most reinforcement."
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
					content: projectBrief({
						goal: "Write a verifier for a fictional language rule set.",
						build: [
							"Ask for an input word and store it as a string.",
							"Check whether the word has an even number of characters.",
							"Count vowels and require at least two.",
							"Compare the first and last letters and require them to be different.",
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
					content: projectBrief({
						goal: "Create a simple command assistant that keeps responding until an exit command is entered.",
						build: [
							"Define several supported commands, such as time, date, remember-name, joke, or fun-fact.",
							"Keep accepting commands with a loop controlled by either `while True` plus `break` or a boolean running variable.",
							"Add a clear stopping command.",
							"Handle unknown commands with a helpful message instead of crashing or silently doing nothing."
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
						"Functions are reusable templates for computation. A function definition begins with `def`, receives values through parameters, and sends values back with `return`. A simple function that squares its input leads naturally into functions with multiple parameters and more complex logic."
				},
				{
					title: "AM2 Project 1: Functions Practice",
					content: projectBrief({
						goal: "Build a function practice file that separates reusable logic from test calls.",
						build: [
							"Write a function that returns the product of three numbers.",
							"Write a function that returns the average of two numbers.",
							"Write a function that counts how many times a letter appears in a word.",
							"Write a function that counts how many digits in an integer are 7.",
							"Write a function that computes `a` to the power of `b`."
						],
						checkpoints: [
							"Each function returns a value rather than only printing.",
							"Each function has at least two test calls.",
							"Edge cases include zero, repeated letters, and numbers without the digit 7."
						],
						extension:
							"Add factorial and Hailstone-sequence length functions after the required functions are working."
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
							"Generate the numbers 1 through 20.",
							"Generate the first 20 even numbers.",
							"Generate the first 10 perfect squares.",
							"Write functions that sum a list, return minimum and maximum values, flatten a list of lists, and return the maximum value from each inner list."
						],
						checkpoints: [
							"Generated lists come from loops or comprehensions rather than manually typed full lists.",
							"List functions work on new test lists, not only on the provided examples.",
							"Empty or one-item lists are considered where the function contract allows them."
						]
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
							"Solve problems involving list processing, counting, perfect squares, factorial sums, divisors, reverse strings, vowel counts, frequency analysis, and swapping values in a list.",
							"Keep each solution small enough to test independently.",
							"Name helper functions when a problem has a reusable subtask.",
							"Record any problem where the first approach failed and what changed in the working solution."
						],
						checkpoints: [
							"Each solution has at least one normal test and one boundary-style test.",
							"The code avoids hard-coded answers.",
							"The final review identifies which topics are ready and which still need practice."
						]
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
							"Trace where the print statement happens relative to the recursive call.",
							"Compare head recursion and tail recursion using the two versions."
						],
						checkpoints: [
							"A short word produces the expected forward and backward cascades.",
							"The base case handles an empty or one-character string.",
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
						goal: "Write a recursive palindrome checker for strings.",
						build: [
							"Compare the first and last characters.",
							"Return `False` immediately when the characters do not match.",
							"Continue recursively on the smaller middle substring when the characters match.",
							"Add base cases for strings that are empty or one character long."
						],
						checkpoints: [
							"Known palindromes return `True` and non-palindromes return `False`.",
							"Even-length and odd-length examples both work.",
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
							"Represent the recursive choice as including or excluding part of the remaining string.",
							"Collect generated strings in a list.",
							"Remove duplicates by converting the result to a set and back to a list.",
							"Sort or print the results in a stable order for easier checking."
						],
						checkpoints: [
							"Short inputs such as `ab` and `aba` are easy to verify by hand.",
							"Duplicate substrings are removed from the final output.",
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
							"Attempt each prompt independently before reviewing hints or examples.",
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
							"Remove the first and last letters from a word.",
							"Extract the second word from a sentence with at least two words.",
							"Explain which indexes are included and excluded in each slice."
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
							"Identify the base case and recursive call in a provided function.",
							"Write recursive solutions for bowling-pin pyramids and Lucas numbers.",
							"Trace the behavior of a provided recursive function before running it."
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
							"Create a stack of numbers.",
							"Push and pop items while tracking the top of the stack.",
							"Process keyboard input where `#` represents backspace."
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
						build: [
							"Simplify expressions such as `12n^2 + n`, `n - sqrt(n)`, and `log(n) + 2`.",
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
						build: [
							"Count the main operations performed by each function.",
							"Break nested loops into outer-loop and inner-loop work.",
							"Compare repeated addition with multiplication.",
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
						"Binary search is a faster search method for sorted lists. At each step, the target value is compared to the middle item, and half of the remaining search space is eliminated. This repeated halving connects directly to recursion and logarithmic runtime."
				},
				{
					title: "AM7 Project 1: Binary Search Implementation",
					content: projectBrief({
						goal: "Implement binary search both iteratively and recursively.",
						build: [
							"Keep the input list sorted before searching.",
							"In the iterative version, track low and high indexes and continue while `low <= high`.",
							"In the recursive version, search the appropriate half with slices or index bounds.",
							"Return a clear result when the list is empty or the target is found."
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
						"Analyze the worst case for binary search by tracking how many times the input can be cut in half before nothing remains. Compare `O(log n)` with `O(n)` and discuss why binary search only works reliably on sorted data."
				},
				{
					title: "AM7 Project 2: Reverse Number Guesser",
					content: projectBrief({
						goal: "Write a reverse number guesser where the computer applies binary search to find the user's number.",
						build: [
							"Track the lowest and highest possible values.",
							"Guess the midpoint of the current range.",
							"Update the range based on whether the guess is too high or too low.",
							"Stop when the guess is correct."
						],
						checkpoints: [
							"The possible range shrinks after every wrong guess.",
							"The program finds any number in the range within the expected number of guesses.",
							"The explanation connects the guessing strategy to binary search."
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
						goal: "Compare linear search and binary search with repeated timing experiments.",
						build: [
							"Copy in iterative implementations of linear search and binary search.",
							"Generate a sorted data set for binary search.",
							"Run many random searches through each algorithm.",
							"Measure elapsed time with `time.time()` before and after repeated searches."
						],
						checkpoints: [
							"The same targets are tested against both algorithms.",
							"Binary search is only used on sorted data.",
							"The timing result is interpreted as evidence, not as a single perfect measurement."
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
						goal: "Design a number-guessing strategy that guarantees the correct answer within 7 tries.",
						build: [
							"Define the full range of possible numbers.",
							"Choose guesses that split the remaining possibilities as evenly as possible.",
							"Track the remaining interval after each high/low response.",
							"Explain why lucky guesses are not the measure of success."
						],
						checkpoints: [
							"Every possible secret number can be found within the limit.",
							"The strategy can be written as a repeatable process.",
							"The process clearly motivates binary search."
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
							"Build a version that repeatedly finds the minimum value, removes it, and appends it to a result list.",
							"Trace how the unsorted portion shrinks after each pass.",
							"Compare the extra-list approach with an in-place version that swaps values instead.",
							"Test sorted, reversed, duplicate, and random inputs."
						],
						checkpoints: [
							"The final list is sorted in ascending order.",
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
							"Treat the left side of the list as the sorted portion.",
							"Take the next unsorted value and move it left until it belongs in the sorted portion.",
							"Track how the sorted and unsorted portions change over time.",
							"Test an already sorted list, a descending list, a duplicate-heavy list, and a random list."
						],
						checkpoints: [
							"The list is sorted correctly after every full run.",
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
							"Explain the reasoning behind each answer before checking the final result.",
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
							"Define Big-O analysis.",
							"Simplify several runtime expressions.",
							"Identify best-case and worst-case behavior in sample functions."
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
							"Complete missing code for a linear search function.",
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
							"Finish iterative and recursive implementations.",
							"Identify the logarithmic runtime behavior."
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
							"Trace the result of a few passes on a sample list.",
							"Complete an implementation and explain its runtime."
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
							"Trace several passes.",
							"Complete an implementation and compare best and worst cases."
						],
						evidence:
							"The trace shows how a new value moves through the sorted prefix."
					})
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content: projectBrief({
						goal: "Reuse earlier sorting algorithms and compare their speed across input patterns.",
						build: [
							"Run the same algorithms on random, sorted, and reversed lists.",
							"Test multiple list sizes.",
							"Record timing results in a small table.",
							"Explain which results match the expected best or worst cases."
						],
						checkpoints: [
							"All algorithms sort the same inputs correctly.",
							"The timing table uses comparable list sizes.",
							"The conclusion explains more than one timing result."
						]
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
							"Duplicate, already sorted, reversed, and random inputs sort correctly.",
							"The inner comparison range shrinks after each pass for a stated reason.",
							"The copy-returning helper does not mutate the original list."
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
						"Count the repeated adjacent comparisons and show why bubble sort is also `O(n^2)` in time. Then improve the algorithm by adding an early cutoff or reducing the comparison range once the largest values have already been moved into place."
				},
				{
					title: "AM9 Project 2: Baseball Analytics",
					content: projectBrief({
						goal: "Adapt sorting logic to rank baseball players by selected statistics.",
						build: [
							"Store each player's data together in a consistent structure.",
							"Support ranking by statistics such as batting average, home runs, or RBI.",
							"Sort based on the chosen field.",
							"Return or print a leaderboard in the correct order."
						],
						checkpoints: [
							"Changing the selected statistic changes the leaderboard order.",
							"Ties and missing or unusual values are handled consistently.",
							"The explanation identifies the data shape and the sort key."
						]
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
							"Compare the front remaining items of both input lists.",
							"Append the smaller item to the result list.",
							"Continue until one input list is exhausted.",
							"Append any leftover values from the other list."
						],
						checkpoints: [
							"Two sorted inputs produce one sorted output.",
							"Unequal list lengths are handled correctly.",
							"Duplicate values remain in the merged result."
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
							"Print or return the split structure so the recursive shape is visible.",
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
							"Add the base case for a list that is already trivially sorted.",
							"Split the list into two halves.",
							"Recursively sort each half.",
							"Merge the sorted halves into one sorted result.",
							"Optionally compare the helper-based version with a compact version."
						],
						checkpoints: [
							"Empty, one-item, duplicate, reversed, and random lists sort correctly.",
							"The implementation preserves all original values.",
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
						"A recursion tree shows why merge sort runs in `O(n log n)` time. Each level of the tree does `O(n)` total merge work, and the height of the tree is `O(log n)`. Comparing this growth to `O(n^2)` explains why merge sort is usually preferable on larger inputs."
				}
			],
			supplementalProjects: []
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
							"Take a list and a pivot value as inputs.",
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
							"Choose a pivot for the current input.",
							"Partition the list into less-than, equal-to, and greater-than regions.",
							"Recursively sort the less-than and greater-than regions.",
							"Concatenate the sorted left side, equal values, and sorted right side."
						],
						checkpoints: [
							"Repeated values remain in the output.",
							"Already sorted and reversed inputs still produce correct results.",
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
						"A recursion tree makes quicksort's best and worst cases visible. If the pivot splits the list evenly, quicksort runs in `O(n log n)`. If the pivot is consistently poor and produces highly unbalanced partitions, the runtime degrades to `O(n^2)`. Random pivots or shuffling the list first reduce the chance of repeated bad partitions."
				},
				{
					title: "AM11 Project 3: Sorting Comparison",
					content: projectBrief({
						goal: "Compare sorting algorithms across different input patterns.",
						build: [
							"Run several sorting algorithms on random, sorted, and reversed lists.",
							"Test more than one list size.",
							"Record timing or operation-count evidence.",
							"Compare the measured results with the expected Big-O behavior."
						],
						checkpoints: [
							"Each algorithm receives comparable inputs.",
							"The comparison distinguishes correctness from speed.",
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
						'`open("filename.txt", "w+")` creates or opens a file for writing, and `f.write(...)` stores output in that file instead of only printing to the console. Good file-writing practice includes multiple lines of text and output generated inside a loop.'
				},
				{
					title: "AM12 Project 1: Crazy Name Tags Printer",
					content: projectBrief({
						goal: "Write variations of a typed name to one or more output files.",
						build: [
							"Ask for a name.",
							"Write the name one letter at a time.",
							"Write every other letter.",
							"Write the name backward.",
							"Close files cleanly or use context managers."
						],
						checkpoints: [
							"The output file contains the expected name variations.",
							"Short names and empty input are handled deliberately.",
							"The file-writing code is organized enough to modify safely."
						],
						extension:
							"Write each name variation to a separate file after the single-file version works."
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
							"Read a text file that alternates between keys and values.",
							"Strip newline characters from each line.",
							"Store each key with the following line as its value.",
							"Print or inspect the resulting dictionary."
						],
						checkpoints: [
							"Known key-value pairs appear correctly in the dictionary.",
							"Odd numbers of lines or blank lines are handled deliberately.",
							"The explanation connects file order to dictionary construction."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-File-IO-and-Dictionaries/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-File-IO-and-Dictionaries/solution"
				},
				{
					title: "AM12 Project 3: Word Translator with File I/O",
					content: projectBrief({
						goal: "Translate text from an input file and write the translated result to an output file.",
						build: [
							"Read sentences from an input text file.",
							"Translate each word with a word-translation function.",
							"Write the translated sentences to an output file.",
							"Keep the file-reading, translation, and file-writing steps easy to test separately."
						],
						checkpoints: [
							"The output file has the expected translated text.",
							"Multiple lines are preserved or intentionally reformatted.",
							"Unknown words and capitalization are handled consistently."
						],
						extension:
							"Preserve punctuation in its original location while translating the words."
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
							"Trace each sorting algorithm before running the implementation.",
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
							"Trace the effect of a few passes.",
							"Complete an implementation.",
							"Discuss early cutoff or shrinking-range improvements."
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
							"Complete a `merge()` helper.",
							"Identify why merge sort uses recursion rather than repeated adjacent passes."
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
							"Complete a `partition()` helper.",
							"Compare best and worst runtime behavior."
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
							"Write letters of an input word to a file.",
							"Read the letters back.",
							"Count letter frequencies in a dictionary.",
							"Explain the difference between `.read()` and `.readlines()`."
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
							"Read letters from a file into a list.",
							"Sort the letters in ASCII order with one implemented sorting algorithm.",
							"Write the sorted result to an output file.",
							"Compare the output file with the expected sorted order."
						],
						checkpoints: [
							"The code handles newline characters intentionally.",
							"The sorting algorithm is one already implemented in the course.",
							"The output file can be reopened and checked."
						]
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
						"Conway's Game of Life is a cellular automaton played on a grid of live and dead cells. Each generation updates based on four rules about underpopulation, survival, overpopulation, and reproduction. The project combines grids, loops, conditionals, and file input into a larger simulation."
				},
				{
					title: "AM13 Project 1: Conway's Game of Life",
					content: projectBrief({
						goal: "Implement Conway's Game of Life as a file-backed grid simulation.",
						build: [
							"Represent the board as a grid of live and dead cells.",
							"Load an initial pattern from a file.",
							"Count live neighbors for each cell.",
							"Apply the four update rules to produce the next generation.",
							"Print or display successive generations with a short pause between updates."
						],
						checkpoints: [
							"Still-life patterns remain stable.",
							"Oscillator patterns change and then return as expected.",
							"The next generation is computed from the previous generation, not from partially updated cells."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Conways-Game-of-Life/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Conways-Game-of-Life/solution"
				},
				{
					title: "AM13 Project 2: Two-Player Conway's Game of Life",
					content: projectBrief({
						goal: "Extend Conway's Game of Life into a two-player strategy variant.",
						build: [
							"Represent dead cells and two different player cell states in the grid.",
							"Allow each player to place and remove cells between generations.",
							"Apply update rules without confusing the two player states.",
							"End the game when one player's cells are completely gone."
						],
						checkpoints: [
							"Both players' cells are displayed distinctly.",
							"Player edits happen between generations, not during rule evaluation.",
							"The end condition detects when one player has no live cells left."
						]
					}),
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
						goal: "Create a playable Tic Tac Toe interface before adding stronger computer strategy.",
						build: [
							"Represent the board with a list or a list of lists.",
							"Print the board clearly after each move.",
							"Alternate turns between two players.",
							"Detect wins and ties.",
							"Add a first computer player that chooses random legal moves."
						],
						checkpoints: [
							"Illegal moves are rejected or handled clearly.",
							"Rows, columns, and diagonals are all checked for wins.",
							"Tie games end without falsely reporting a winner."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-UI/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-UI/solution"
				},
				{
					title: "AM14 Project 2: Tic Tac Toe AI",
					content: projectBrief({
						goal: "Replace the random computer player with a rule-based Tic Tac Toe strategy.",
						build: [
							"Check for an immediate winning move.",
							"Block the opponent's immediate winning move.",
							"Prefer center control, then corners, then sides.",
							"Test candidate moves on a copied board so evaluation does not mutate the real game state."
						],
						checkpoints: [
							"The AI takes a win when one is available.",
							"The AI blocks a one-move opponent win.",
							"The copied-board evaluation leaves the actual board unchanged until the chosen move is applied."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI/solution"
				},
				{
					title: "AM14 Project 3: Tic Tac Toe AI Test",
					content: projectBrief({
						goal: "Evaluate the Tic Tac Toe AI by running repeated games against a random player.",
						build: [
							"Automate many games between the rule-based AI and a random player.",
							"Record wins, losses, and ties.",
							"Summarize results as counts or percentages.",
							"Identify at least one board state where the AI still makes a weak choice."
						],
						checkpoints: [
							"The test run includes enough games to reveal a trend.",
							"The results distinguish wins, losses, and ties.",
							"The conclusion names where the strategy performs well and where it can improve."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI-Test/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI-Test/solution"
				},
				{
					title: "AM14 Project 4: Advanced Tic Tac Toe AI",
					content: projectBrief({
						goal: "Upgrade the Tic Tac Toe AI with fork creation and fork blocking.",
						build: [
							"Define a fork as a move that creates two simultaneous winning threats.",
							"Detect whether the AI can create a fork.",
							"Detect whether the opponent is threatening a fork.",
							"Update the strategy order to include immediate wins, blocks, forks, fork blocks, center, corners, and sides."
						],
						checkpoints: [
							"Known fork positions are detected correctly.",
							"The AI blocks opponent forks when required.",
							"The advanced strategy is tested against the earlier AI and the random player."
						]
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
		choiceCurriculumTitles: ["Check-In #1: Additional Practice Project"],
		projectThread:
			"Diagnose string helpers, recursion, and explicit stacks separately. Use additional practice only for the failed trace or implementation skill."
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
		choiceCurriculumTitles: ["AM7 Project 2: Reverse Number Guesser"],
		challengeCurriculumTitles: ["AM7 Project 3: Runtime Comparator"],
		projectThread:
			"Prove the sorted-input invariant and trace low, high, and midpoint updates before implementation. Reverse Number Guesser is a role-reversal choice; Runtime Comparator is the empirical challenge."
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
		choiceCurriculumTitles: ["Check-In #2: Additional Practice Project"],
		projectThread:
			"Each algorithm family includes a trace and a complexity explanation. Additional practice targets the first incorrect invariant or growth-rate explanation."
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
		challengeCurriculumTitles: ["AM9 Project 2: Baseball Analytics"],
		projectThread:
			"Trace adjacent comparisons and swaps through one complete pass, then add an early-exit condition. Baseball Analytics is the data-context challenge after the sort is independently verified."
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
			"Verify partition independently, then trace pivot placement across recursive calls. Sorting Comparison is the challenge because it requires evidence-based algorithm selection across input shapes."
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
		challengeCurriculumTitles: [
			"AM12 Project 3: Word Translator with File I/O"
		],
		projectThread:
			"Write and read a small file before parsing structured lines into a dictionary. Word Translator is the challenge after file closure, malformed lines, and missing-file behavior are explicit."
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
		choiceCurriculumTitles: ["Check-In #3: Additional Practice Project"],
		projectThread:
			"Compare sorting traces and file-lifecycle reasoning without requiring a full new build. Assign additional practice only for the algorithm or I/O boundary that remains unclear."
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
		challengeCurriculumTitles: [
			"AM13 Project 2: Two-Player Conway's Game of Life"
		],
		projectThread:
			"Treat Conway's Game of Life as the simulation capstone. Build a minimum grid, neighbor counter, and immutable generation update before adding display polish; the two-player variation is the challenge."
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
		challengeCurriculumTitles: ["AM14 Project 4: Advanced Tic Tac Toe AI"],
		projectThread:
			"Treat Tic Tac Toe as the AI capstone: ship the board and legal-move loop, add a testable decision rule, then prove wins, blocks, ties, and invalid moves. Fork-aware strategy is the advanced challenge."
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
