import type { RawCourse } from "./types";
import { isCoreProjectTitle } from "./projectGrouping";

const cppLevel1SourceCourse: RawCourse = {
	name: "C++ Level 1",
	modules: [
		{
			title: "CPPF1 Variables, Types, Strings, and Input/Output",
			curriculum: [
				{
					title: "Program Setup, Syntax, and Compile-Run Cycle",
					content:
						"This lesson begins with a single-file console program and makes the compile-run cycle explicit.\n\n**Key topics:**\n- `#include`\n- `main`\n- braces\n- semicolons\n- comments\n- compiler errors versus runtime behavior\n- the idea that C++ is compiled before it runs\n\n**Practice check:** A successful first workflow makes one small change, recompiles, reads the output or error, and explains what changed before the syntax load rises."
				},
				{
					title: "Primitive Types, Strings, and Console I/O",
					content:
						"Integers, doubles, booleans, chars, and `std::string` are the core beginner value types, and they connect directly to `std::cin` and `std::cout`. Include declaring and assigning variables, choosing a type, reading typed input, printing labels with values, basic string length/indexing, and common beginner mistakes such as missing quotes, invalid assignments, and input that stops at whitespace.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Primitive-Types-and-Strings-Reference"
				},
				{
					title: "CPPF1 Project 1: Mad Libs",
					content:
						"Build a short Mad Libs generator with string variables, prompts, and a printed story. Use clear variable names, test at least two custom stories, and explain how inputs move through the program.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Mad-Libs",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Mad-Libs"
				},
				{
					title: "CPPF1 Project 2: Chat Bot",
					content:
						"Use strings, input, and simple arithmetic to make a small interactive chatbot. This is still a syntax-and-confidence project, not an algorithmic challenge.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Chat-Bot",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Chat-Bot"
				}
			],
			supplementalProjects: [
				{
					title: "Variables and Input/Output: Extension Challenge",
					content:
						"Extend the early syntax work with one extra input case, one more formatted output step, or a slightly more realistic text-processing task.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Variables-Types-and-Input-and-Output-Supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Variables-Types-and-Input-and-Output-Supplemental-2/solution"
				}
			]
		},
		{
			title: "CPPF2 Loops and Conditionals",
			curriculum: [
				{
					title: "Branching and Repetition",
					content:
						"Control flow is how a program chooses and repeats behavior. Include `if`, `else if`, and `else`; comparison operators; Boolean expressions; ordered branch checks; `for` loops for counted repetition; `while` loops for condition-driven repetition; loop initialization, stopping conditions, and updates; and how to trace variable changes without guessing.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-For-Loop-Practice"
				},
				{
					title: "CPPF2 Project 1: Number Games",
					content:
						"Build small loop-driven tasks such as counting between bounds, summing values, and computing averages. The main habit here is tracing loop state instead of guessing.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games"
				},
				{
					title: "CPPF2 Project 2: Rock, Paper, Scissors",
					content:
						"Use conditionals to compare choices and decide winners. Keep the focus on branching logic practice rather than a large design exercise.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Rock-Paper-Scissors",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Rock-Paper-Scissors"
				},
				{
					title: "CPPF2 Project 3: Fizz Buzz",
					content:
						"Use modular arithmetic and ordered condition checks to build a correct Fizz Buzz solution. This is a compact way to reinforce both loops and branching.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Fizz-Buzz",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Fizz-Buzz"
				}
			],
			supplementalProjects: [
				{
					title: "Loops and Conditionals: While-Loop Drill",
					content:
						"Use a short while-loop reinforcement task when termination logic is still shaky.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-While-Loop-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-While-Loop-Practice"
				}
			]
		},
		{
			title: "CPPF3 Functions",
			curriculum: [
				{
					title: "Function Signatures, Return Values, and Decomposition",
					content:
						"Functions are named units of work with parameters and return types. Include reading a function signature, deciding what data a function needs, deciding what it returns, separating calculation from printing, avoiding repeated code, and using small helper functions to make a larger program easier to test. A strong explanation names why a function exists, not just how to call it."
				},
				{
					title: "Randomness and Small Simulation Helpers",
					content:
						"Modern `<random>` tools belong after basic function calls are comfortable. Use `std::mt19937` with an explicit seed and an appropriate distribution, pass or wrap the engine so random behavior stays separate from game output, and use a fixed seed for reproducible tests. `rand()` can be recognized in older code, but it is not the course's default. Randomness creates a reason to decompose the program instead of writing one long `main`.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-rand-Reference"
				},
				{
					title: "CPPF3 Project 1: Probability Functions",
					content:
						"Write functions that simulate small random events such as coin flips, dice rolls, or card draws. Separate generation logic from printing logic.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Probability-Functions",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Probability-Functions"
				},
				{
					title: "CPPF3 Project 2: Number Guesser",
					content:
						"Break the game into input handling, random-number selection, and guess checking. This is the point where function decomposition starts feeling necessary instead of optional.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Number-Guesser",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Number-Guesser"
				}
			],
			supplementalProjects: [
				{
					title: "Functions: Extension Challenge",
					content:
						"Use a focused starter and review pair when function design and testing need one more pass.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Functions-Supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Functions-Supplemental-2/solution"
				}
			]
		},
		{
			title: "CPPF4 Classes and Objects",
			curriculum: [
				{
					title: "Classes, Objects, and Encapsulated State",
					content:
						"A class packages related data and behavior together. Include objects as individual instances, private state, public behavior, constructors, getters/setters when appropriate, and why methods protect invariants instead of letting every part of the program edit fields directly. Keep the focus on object modeling, not advanced language mechanics."
				},
				{
					title: "Multi-File Class Implementation",
					content:
						"Small multi-file classes show how real C++ projects split declarations and definitions. Key topics include header files, source files, include guards, method declarations versus method bodies, default and overloaded constructors, member functions that update object state, and how to compile a project with more than one `.cpp` file.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Point-Class"
				},
				{
					title: "CPPF4 Project: Cat Class",
					content:
						"Build a small class with constructors, state updates, and readable output. The project focuses on modeling and method practice, not memory management.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Cat-Class",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Cat-Class"
				}
			],
			supplementalProjects: [
				{
					title: "Classes and Objects: BMI Extension",
					content:
						"Treat the member-initializer-list version as an extension after the class shape itself is already comfortable.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Person-Class-with-BMI"
				}
			]
		},
		{
			title: "CPPF5 Vectors and Collection Patterns",
			curriculum: [
				{
					title: "Vectors as Growable Sequences and Function Inputs",
					content:
						"`std::vector` is the default beginner collection for ordered values that can grow over time. Cover: `push_back`, indexing, `size`, iterating with indexes and range-based loops, reading versus mutating a collection, passing vectors to functions, using `const` references for read-only access, and writing summary operations such as totals, filters, and searches.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vectors-Reference"
				},
				{
					title: "CPPF5 Project 1: Vector Practice",
					content:
						"Use vectors to store values, compute totals, and process strings through helper functions. This replaces the earlier raw-array jump with a safer container-first pattern.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vector-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vector-Practice"
				},
				{
					title: "CPPF5 Project 2: Bank Accounts",
					content:
						"Use a vector of transactions to compute a changing account balance. This is a better first collection project than raw arrays because the data model stays visible without manual resizing mechanics.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts"
				}
			],
			supplementalProjects: [
				{
					title: "Vectors and Collections: Extension Challenge",
					content:
						"Extend one of the vector projects with filtering, searching, or a new summary calculation to keep collection thinking active.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts"
				}
			]
		},
		{
			title: "CPPF6 Structs and Parameter Passing",
			curriculum: [
				{
					title: "References, Const References, and Function Boundaries",
					content:
						"References are aliases, and `const` references are a safe way to avoid unnecessary copying. Include pass-by-value versus pass-by-reference, when a function mutates caller-owned data, when it only observes data, why `const` communicates intent, and how to trace what changes after a function call. Treat this as a data-flow topic, not a pointer topic.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing-Introduction"
				},
				{
					title: "CPPF6 Project 1: Parameter Passing Tracing",
					content:
						"Trace what changes and what does not when values are passed by value, by reference, and by const reference. The result shows clear reasoning about function boundaries.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing"
				},
				{
					title: "Structs for Small Records",
					content:
						"`struct` is a lightweight way to group related fields before the profile capstone. Cover: simple record shapes such as a person, transaction, or post; when a struct is clearer than parallel vectors; passing records to functions; using vectors of structs; and deciding whether a behavior belongs in a function now or in a class later.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Structs-Example"
				},
				{
					title: "CPPF6 Project 2: Defanging a Website Address",
					content:
						"Compare a function that edits a string directly with one that returns a new string. This creates a concrete reason to care about parameter passing choices.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Defanging-a-Website-URL",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Defanging-a-Website-URL"
				}
			],
			supplementalProjects: [
				{
					title: "Structs and Parameter Passing: String Mutation Lab",
					content:
						"Use the string-scrambling lab only after the main parameter-passing work is clear.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Chaos-Monkeys",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Chaos-Monkeys"
				}
			]
		},
		{
			title: "CPPF7 Grids and 2D Vectors",
			curriculum: [
				{
					title: "Nested Vectors, Grid Traversal, and Nested Loop Patterns",
					content:
						"A 2D vector first works as a grid of rows instead of a shortcut into raw multi-dimensional arrays. Include reading `grid[row][col]`, row versus column meaning, printing a grid, updating a cell, nested loops for row totals and scans, rectangular versus irregular grids, and why this higher-level model prepares for raw array layout later without introducing memory tricks too early.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Grids-and-2D-Vectors-Reference"
				},
				{
					title: "CPPF7 Project: Matrix Addition",
					content:
						"Use two 2D vectors with the same dimensions and build a result grid cell by cell. This gives the course a clean grid project without manual allocation or pointer arithmetic.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Matrix-Addition",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Matrix-Addition"
				}
			],
			supplementalProjects: [
				{
					title: "CPPF7 Project 2: Grid Statistics",
					content:
						"Extend grid work by computing row totals, column totals, diagonal totals, and the largest value in a rectangular 2D vector. This gives the course a second grid project before the Level 1 capstone.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Grid-Statistics",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Grid-Statistics"
				}
			]
		},
		{
			title: "CPPF8 Master Project: Profile Posts",
			curriculum: [
				{
					title: "Profile Modeling and API Design",
					content:
						"Model a `Post` as a small record and a `Profile` as a class that owns a vector of posts. Cover: why `Post` can be a simple record, why `Profile` owns the collection, how to design add/remove/print/update methods, how to validate indexes before mutation, and how to keep the API readable without introducing manual ownership logic.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts"
				},
				{
					title: "Command Loops, Switches, and Simple State Machines",
					content:
						"Convert one-shot profile operations into a menu-driven command loop. Cover: prompting until quit, rejecting invalid choices, separating input handling from `Profile` methods, using `switch` when one discrete value selects the next action, using `enum class` instead of magic numbers or strings, ending each `case` intentionally, drawing a small state diagram, and explaining states such as `MainMenu`, `ViewingPosts`, `EditingPost`, and `Quit`. Close by naming the Level 1 outcomes: decomposition, object modeling, records, vectors, grids, command loops, switches, scoped enums, and simple program states."
				},
				{
					title: "CPPF8 Project: Profile Posts",
					content:
						"Build a small profile manager that stores posts, prints them clearly, sums hearts, removes posts safely, and updates likes. The finished version includes a clear command loop, validated menu choices, and at least one named program state so Level 1 ends with a small interactive application rather than a collection of isolated functions.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts"
				}
			],
			supplementalProjects: [
				{
					title: "Profile Posts: Extension Challenge",
					content:
						"Extend the profile manager with search, extra post fields, or another summary statistic while keeping the `std::vector<Post>` design clean.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts"
				},
				{
					title: "CPPF8 Project 2: Profile Posts State Machine Extension",
					content:
						"Add a written state diagram and update the capstone so the user can move between at least three explicit modes. The extension justifies why a `switch` plus `enum class` is clearer than another long `if`/`else if` chain.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-State-Machine-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-State-Machine-Profile-Posts"
				}
			]
		}
	]
};

interface CppLevel1ModuleFlow {
	estimatedTime: string;
	flowNote: string;
	keyBlocks: string[];
}

const CPP_LEVEL_1_OPTIONAL_CURRICULUM = new Set([
	"CPPF1 Project 2: Chat Bot",
	"CPPF2 Project 2: Rock, Paper, Scissors",
	"CPPF2 Project 3: Fizz Buzz",
	"CPPF3 Project 2: Number Guesser",
	"CPPF5 Project 2: Bank Accounts",
	"CPPF6 Project 2: Defanging a Website Address"
]);

const CPP_LEVEL_1_CHALLENGE_CURRICULUM = new Set([
	"CPPF2 Project 3: Fizz Buzz"
]);

const CPP_LEVEL_1_MODULE_FLOW: Record<string, CppLevel1ModuleFlow> = {
	"CPPF1 Variables, Types, Strings, and Input/Output": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"C++20 compile / run",
			"warnings",
			"value types",
			"cin / getline",
			"input validation"
		],
		flowNote:
			"Establish a repeatable C++20 build with `-Wall -Wextra -Wpedantic`, then complete Mad Libs as the first required program. Check whitespace input, failed numeric extraction, and recovery before choosing the chatbot extension."
	},
	"CPPF2 Loops and Conditionals": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"ordered branches",
			"for loop",
			"while loop",
			"termination",
			"state trace"
		],
		flowNote:
			"Trace Number Games with a table before running it and test empty, reversed, or boundary ranges. Rock Paper Scissors is a choice and Fizz Buzz is a challenge, so one correct loop-driven project completes the module."
	},
	"CPPF3 Functions": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"function contract",
			"parameters",
			"return value",
			"decomposition",
			"reproducible randomness"
		],
		flowNote:
			"Write deterministic helper contracts first, then use `std::mt19937` with a fixed test seed for the probability project. Keep generation, decision logic, and output separate; Number Guesser is an optional integration build."
	},
	"CPPF4 Classes and Objects": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"class invariant",
			"constructor",
			"private state",
			"header / source split",
			"multi-file build"
		],
		flowNote:
			"Build the Cat class in the smallest working slices: construct, observe, update, and reject invalid state. Compile every source file from a clean command and explain which declarations belong in the header and which definitions belong in the source file."
	},
	"CPPF5 Vectors and Collection Patterns": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"vector",
			"safe iteration",
			"const reference",
			"search / filter / summary",
			"empty collection"
		],
		flowNote:
			"Use Vector Practice to compare index and range-based iteration, then test empty, one-item, and multi-item collections. Bank Accounts is a fictional-data choice; real account details are never entered."
	},
	"CPPF6 Structs and Parameter Passing": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"value semantics",
			"reference alias",
			"const reference",
			"struct record",
			"mutation trace"
		],
		flowNote:
			"Trace copies, aliases, and mutations before compiling, then combine a small struct with a vector or helper function. Defanging and the string-mutation lab remain optional after the parameter-passing trace is correct."
	},
	"CPPF7 Grids and 2D Vectors": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"row / column",
			"nested vector",
			"dimension check",
			"nested loop",
			"grid boundary"
		],
		flowNote:
			"Add matrices only after dimensions are validated, then test empty, one-cell, rectangular, and mismatched inputs. Matrix Addition is required; Grid Statistics is a choice for more nested-loop practice."
	},
	"CPPF8 Master Project: Profile Posts": {
		estimatedTime: "4–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"Profile / Post model",
			"vector ownership",
			"command state",
			"validated mutation",
			"regression cases"
		],
		flowNote:
			"Build a fictional, local-only profile manager in vertical slices, keep input handling outside the model, and validate every index and command. A warning-clean build plus normal, boundary, invalid-input, and fresh-start checks completes Level 1; networking, public posting, and real personal data are out of scope."
	}
};

function cppLevel1SupplementalPath(title: string) {
	return /extension|mutation lab/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

function decorateCppLevel1Module(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = CPP_LEVEL_1_MODULE_FLOW[module.title];
	const optionalCurriculum = module.curriculum.filter(
		item =>
			CPP_LEVEL_1_OPTIONAL_CURRICULUM.has(item.title) &&
			!isCoreProjectTitle(item.title)
	);
	const coreCurriculum = module.curriculum
		.filter(item => !optionalCurriculum.includes(item))
		.map((item, index) => ({
			...item,
			content:
				index === 0 && flow
					? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
					: item.content,
			learningPath: "core" as const
		}));

	if (module.title === "CPPF1 Variables, Types, Strings, and Input/Output") {
		coreCurriculum.push({
			title: "C++20 Toolchain and Input Readiness Check",
			content: [
				"**Completion evidence:**",
				"- Compiler name and version plus the exact C++20 build and run command.",
				"- Warning-clean hello-world build using `-Wall -Wextra -Wpedantic` or the closest supported equivalent.",
				"- One `std::cin` numeric input and one full-line `std::getline` input, including the transition between them.",
				"- One invalid numeric input case that clears the failed stream and explains the recovery behavior."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "CPPF8 Master Project: Profile Posts") {
		coreCurriculum.push({
			title: "Profile Posts Completion Contract",
			content: [
				"**Completion evidence:**",
				"- Clean C++20 build instructions and a fresh-start run.",
				"- Fictional seed posts and no real personal or account data.",
				"- Tests or transcripts for add, view, update, remove, invalid index, invalid command, empty profile, and quit behavior.",
				"- State diagram, class/struct responsibility note, and one revision made after a failed case."
			].join("\n"),
			learningPath: "core"
		});
	}

	return {
		...module,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum: coreCurriculum,
		supplementalProjects: [
			...optionalCurriculum.map(item => ({
				...item,
				learningPath: CPP_LEVEL_1_CHALLENGE_CURRICULUM.has(item.title)
					? ("challenge" as const)
					: ("choice" as const)
			})),
			...module.supplementalProjects.map(item => ({
				...item,
				learningPath: cppLevel1SupplementalPath(item.title)
			}))
		]
	};
}

export const cppLevel1Course: RawCourse = {
	...cppLevel1SourceCourse,
	modules: cppLevel1SourceCourse.modules.map(decorateCppLevel1Module)
};
