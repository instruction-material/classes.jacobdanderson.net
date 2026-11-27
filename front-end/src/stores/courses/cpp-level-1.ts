import type { RawCourse } from "./types";
import {
	cppClassesLessonBriefs,
	cppClassesProjectBriefs
} from "./cppClassesProjectBriefs";
import {
	cppCollectionsLessonBrief,
	cppCollectionsProjectBriefs
} from "./cppCollectionsProjectBriefs";
import {
	cppFoundationLessonBriefs,
	cppFoundationProjectBriefs
} from "./cppFoundationProjectBriefs";
import {
	cppFunctionsLessonBriefs,
	cppFunctionsProjectBriefs
} from "./cppFunctionsProjectBriefs";
import {
	cppGridLessonBrief,
	cppGridProjectBriefs
} from "./cppGridProjectBriefs";
import {
	cppParameterLessonBriefs,
	cppParameterProjectBriefs
} from "./cppParameterProjectBriefs";
import { cppProfileProjectBriefs } from "./cppProfileProjectBriefs";
import { isCoreProjectTitle } from "./projectGrouping";

function workedExample(folder: string) {
	return {
		contentKind: "reading" as const,
		ideImport: true,
		preserveInstructions: true,
		projectLink: `https://github.com/instruction-material/CPP-Level-1/tree/770aa14c51891d73e4f5c960fa839f8bdf15b964/${folder}`
	};
}

const cppLevel1SourceCourse: RawCourse = {
	name: "C++ Level 1",
	modules: [
		{
			title: "CPPF1 Variables, Types, Strings, and Input/Output",
			curriculum: [
				{
					title: "Program Setup, Syntax, and Compile-Run Cycle",
					aliases: [
						"c-level-1-cppf1-variables-types-strings-and-input-output-curriculum-variables-types-strings-and-input-output-core-concepts"
					],
					content: cppFoundationLessonBriefs.setup
				},
				{
					title: "Primitive Types, Strings, and Console I/O",
					content: cppFoundationLessonBriefs.values,
					...workedExample(
						"CPPF1-Primitive-Types-and-Strings-Reference"
					)
				},
				{
					title: "Token Input, Full-Line Input, and Failure",
					content: cppFoundationLessonBriefs.input
				},
				{
					title: "CPPF1 Project 1: Mad Libs",
					content: cppFoundationProjectBriefs.madLibs,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Mad-Libs/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Mad-Libs/solution"
				},
				{
					title: "CPPF1 Project 2: Chat Bot",
					content: cppFoundationProjectBriefs.chatBot,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Chat-Bot/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Chat-Bot/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF2 Loops and Conditionals",
			curriculum: [
				{
					title: "Branching and Repetition",
					content: cppFoundationLessonBriefs.branches,
					...workedExample("CPPF2-For-Loop-Practice")
				},
				{
					title: "While-Loop Reference and State Tracing",
					content: cppFoundationLessonBriefs.whileLoops,
					...workedExample("CPPF2-While-Loop-Practice")
				},
				{
					title: "CPPF2 Project 1: Number Games",
					content: cppFoundationProjectBriefs.numberGames,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games/solution"
				},
				{
					title: "CPPF2 Project 2: Rock, Paper, Scissors",
					content: cppFoundationProjectBriefs.rockPaperScissors,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Rock-Paper-Scissors/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Rock-Paper-Scissors/solution"
				},
				{
					title: "CPPF2 Project 3: Fizz Buzz",
					content: cppFoundationProjectBriefs.fizzBuzz,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Fizz-Buzz/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Fizz-Buzz/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF3 Functions",
			curriculum: [
				{
					title: "Function Signatures, Return Values, and Decomposition",
					aliases: [
						"c-level-1-cppf3-functions-curriculum-functions-core-concepts"
					],
					content: cppFunctionsLessonBriefs.functions
				},
				{
					title: "CPPF3 Project 1: Function Practice",
					content: cppFunctionsProjectBriefs.functionPractice,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Function-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Function-Practice/solution"
				},
				{
					title: "Randomness and Small Simulation Helpers",
					aliases: [
						"c-level-1-cppf3-functions-curriculum-functions-application-check"
					],
					content: cppFunctionsLessonBriefs.random,
					...workedExample("CPPF3-rand-Reference")
				},
				{
					title: "CPPF3 Project 2: Probability Events and Random",
					aliases: [
						"c-level-1-cppf3-functions-curriculum-cppf3-project-1-probability-functions"
					],
					content: cppFunctionsProjectBriefs.probability,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Probability-Functions/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Probability-Functions/solution"
				},
				{
					title: "CPPF3 Project 3: Number Guesser",
					aliases: [
						"c-level-1-cppf3-functions-curriculum-cppf3-project-2-number-guesser"
					],
					content: cppFunctionsProjectBriefs.numberGuesser,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Number-Guesser/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Number-Guesser/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF4 Classes and Objects",
			curriculum: [
				{
					title: "Classes, Objects, and Encapsulated State",
					content: cppClassesLessonBriefs.objects
				},
				{
					title: "Point Declarations, Definitions, and State Tracing",
					aliases: [
						"c-level-1-cppf4-classes-and-objects-curriculum-multi-file-class-implementation"
					],
					content: cppClassesLessonBriefs.point,
					...workedExample("CPPF4-Point-Class")
				},
				{
					title: "CPPF4 Project 1: Person Class",
					content: cppClassesProjectBriefs.person,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Person-Class/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Person-Class/solution"
				},
				{
					title: "Person Constructors and Member-Initializer Lists",
					aliases: [
						"c-level-1-cppf4-classes-and-objects-supplemental-classes-and-objects-bmi-extension"
					],
					content: cppClassesLessonBriefs.initializers,
					...workedExample("CPPF4-Person-Class-with-BMI")
				},
				{
					title: "CPPF4 Project 2: Cat Class",
					aliases: [
						"c-level-1-cppf4-classes-and-objects-curriculum-cppf4-project-cat-class"
					],
					content: cppClassesProjectBriefs.cat,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Cat-Class/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Cat-Class/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF5 Vectors and Collection Patterns",
			curriculum: [
				{
					title: "Vectors as Growable Sequences and Function Inputs",
					content: cppCollectionsLessonBrief,
					...workedExample("CPPF5-Vectors-Reference")
				},
				{
					title: "CPPF5 Project 1: Vector Practice",
					content: cppCollectionsProjectBriefs.vector,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vector-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vector-Practice/solution"
				},
				{
					title: "CPPF5 Project 2: Bank Accounts",
					content: cppCollectionsProjectBriefs.bank,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF6 Structs and Parameter Passing",
			curriculum: [
				{
					title: "References, Const References, and Function Boundaries",
					content: cppParameterLessonBriefs.introduction,
					...workedExample("CPPF6-Parameter-Passing-Introduction")
				},
				{
					title: "CPPF6 Project 1: Parameter Passing Tracing",
					content: cppParameterProjectBriefs.tracing,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing/solution"
				},
				{
					title: "Structs for Small Records",
					content: cppParameterLessonBriefs.structs,
					...workedExample("CPPF6-Structs-Example")
				},
				{
					title: "CPPF6 Project 2: Defanging a Website Address",
					content: cppParameterProjectBriefs.defang,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Defanging-a-Website-URL/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Defanging-a-Website-URL/solution"
				},
				{
					id: "c-level-1-cppf6-structs-and-parameter-passing-supplemental-structs-and-parameter-passing-string-mutation-lab",
					title: "CPPF6 Project 3: Chaos Monkeys",
					content: cppParameterProjectBriefs.chaos,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Chaos-Monkeys/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Chaos-Monkeys/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF7 Grids and 2D Vectors",
			curriculum: [
				{
					title: "Nested Vectors, Grid Traversal, and Nested Loop Patterns",
					content: cppGridLessonBrief,
					...workedExample("CPPF7-Grids-and-2D-Vectors-Reference")
				},
				{
					title: "CPPF7 Project: Matrix Addition",
					content: cppGridProjectBriefs.matrix,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Matrix-Addition/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Matrix-Addition/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPF7 Project 2: Grid Statistics",
					content: cppGridProjectBriefs.statistics,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Grid-Statistics/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Grid-Statistics/solution"
				}
			]
		},
		{
			title: "CPPF8 Master Project: Profile Posts",
			curriculum: [
				{
					title: "Profile Modeling and API Design",
					content: cppProfileProjectBriefs.model
				},
				{
					title: "Command Loops, Switches, and Simple State Machines",
					content: cppProfileProjectBriefs.commands
				},
				{
					title: "CPPF8 Project: Profile Posts",
					content: cppProfileProjectBriefs.profile,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts/solution"
				}
			],
			supplementalProjects: [
				{
					id: "c-level-1-cppf8-master-project-profile-posts-supplemental-extension-challenge-profile-posts",
					title: "Profile Posts: Extension Challenge",
					content: cppProfileProjectBriefs.challenge
				},
				{
					title: "CPPF8 Project 2: Profile Posts State Machine Extension",
					content: cppProfileProjectBriefs.states,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-State-Machine-Profile-Posts/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-State-Machine-Profile-Posts/solution"
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
	"CPPF3 Project 3: Number Guesser",
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
			"Establish a repeatable C++20 build with `-Wall -Wextra -Wpedantic`, then complete Mad Libs as the first required program. Check token versus full-line input, failed numeric extraction and recovery, then complete both required Mad Libs and Chat Bot projects."
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
			"Trace Number Games with a table before running it and test empty, reversed, or boundary ranges. Complete Number Games with both loop kinds, then the required Rock Paper Scissors and Fizz Buzz branching projects. Supplied loop examples are references rather than extra assignments."
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
			"Complete Function Practice with explicit parameter, return-value and arithmetic contracts before introducing randomness. Then complete the required Probability Events and Random and Number Guesser projects with one seeded engine, independent die rolls, checked range/guess input and a five-valid-guess limit. Supplied demonstrations remain lesson references."
	},
	"CPPF4 Classes and Objects": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"object state",
			"constructor",
			"private state",
			"header / source split",
			"multi-file build"
		],
		flowNote:
			"Trace the supplied Point class, then complete the required Person project before rewriting its constructors with member-initializer lists. Complete the required Cat project with its authored defaults and signed-age contract. Compile both source files, test every public method and explain how private access differs from value validation. Supplied examples remain complete lesson references."
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
			"Trace the complete vectors example, then complete required Vector Practice with empty, one-item and bounded signed collections. Complete required Bank Accounts with fictional integer-dollar values, validate count and each requested amount before reporting any balance, and test cancellation as well as normal results. Real account details are never entered."
	},
	"CPPF6 Structs and Parameter Passing": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"value semantics",
			"reference alias",
			"const reference",
			"struct record",
			"mutation trace"
		],
		flowNote:
			"Trace the complete introduction and implement the required prediction driver before comparing results. Read the supplied small-record lesson, then complete required Defanging and Chaos Monkeys. Check copy preservation, mutable caller changes, const observation and loop termination; test empty and bounded inputs. Save each attempt before comparing the reference."
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
			"Trace the complete 2D-vector lesson, then complete required Matrix Addition with dimensions checked before allocation and both bounded matrices validated before any sum. Test one-cell, wide/tall, dimension and numeric bounds, and every cancellation phase. Optional Grid Statistics practices const-reference summaries, empty/zero-column grids and row-major ties in its stated rectangular domain."
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
			"Complete the required interactive multi-file profile manager in vertical slices, with full-line commands, guarded model bounds and cancellation before mutation. Preserve zero-based API versus one-based displayed indexes. The optional data-model challenge and scripted explicit-mode extension have distinct purposes. Retain warning-clean builds, normal/boundary/invalid/fresh-start evidence and a state diagram; use fictional local data."
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
