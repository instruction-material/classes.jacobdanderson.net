import type { RawCourse } from "./types";
import { cppBuildDebugProjectBrief } from "./cppBuildDebugProjectBrief";
import { cppDebugEvidenceNotebookBrief } from "./cppDebugEvidenceNotebookBrief";
import { cppTaskManagerBriefs } from "./cppTaskManagerBriefs";

const cppLevel3SourceCourse: RawCourse = {
	name: "C++ Level 3",
	modules: [
		{
			title: "CPPI0 Bridge Course Setup and Positioning",
			curriculum: [
				{
					title: "Bridge Course Goals, Scale, and Tooling",
					content:
						"Position `C++ Level 3` as the bridge between beginner/manual-memory C++ and larger idiomatic C++ work. Cover the assumed baseline from Levels 1-2, what makes a program medium-size instead of just longer, why command structure and file-backed state matter, how standard-library fluency connects to recursion and RAII, and how repeatable build commands, warnings, debugger stepping, and trace output provide evidence. By the end of this setup module, the expected outcome is a compiled multi-file program, one explained warning or runtime failure, and a clear description of the structure needed before moving into data structures or design patterns."
				},
				{
					title: "CPPI0 Project: Build and Debug Checkpoint",
					content: cppBuildDebugProjectBrief,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI0-Build-and-Debug-Checkpoint/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI0-Build-and-Debug-Checkpoint/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI0 Project 2: Warnings and Debugger Evidence Notebook",
					content: cppDebugEvidenceNotebookBrief,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI0-Warnings-and-Debugger-Notebook/starter/EVIDENCE.md",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI0-Warnings-and-Debugger-Notebook/solution/EVIDENCE.md"
				}
			]
		},
		{
			title: "CPPI1 Command Architecture, File I/O, and Small Parsers",
			curriculum: [
				{
					title: "Command Architecture and File Persistence",
					content: cppTaskManagerBriefs.architecture
				},
				{
					title: "Scanning, Parsing, and Error Boundaries",
					content: cppTaskManagerBriefs.parsing
				},
				{
					title: "CPPI1 Project: Saveable Task Manager",
					content: cppTaskManagerBriefs.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Saveable-Task-Manager/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Saveable-Task-Manager/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI1 Project 2: Import and Reject Bad Rows",
					content:
						"Add a small import command that reports malformed rows without stopping the entire program. Explain which data was accepted, which data was rejected, and why.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Import-and-Reject-Bad-Rows/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Import-and-Reject-Bad-Rows/solution"
				},
				{
					title: "CPPI1 Project 3: Mini Command Scanner",
					content:
						"Build a small tokenizer for task-manager-style commands. It recognizes words, numbers, quoted strings, punctuation, comments, line numbers, and malformed input before any command mutates application state.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Mini-Command-Scanner/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Mini-Command-Scanner/solution"
				}
			]
		},
		{
			title: "CPPI2 Recursion and the Call Stack",
			curriculum: [
				{
					title: "Recursion, Base Cases, and Stack Frames",
					content:
						"Recursion starts with call-stack diagrams before algorithm vocabulary. The important pieces are the base case, the recursive step, the smaller subproblem, what data each stack frame owns, what value returns to the previous frame, and why missing or non-progressing base cases lead to infinite recursion. Strings, vectors, and small grids build control-flow confidence before linked lists or trees."
				},
				{
					title: "Recursive Traversal and Backtracking",
					content:
						"Use traversal problems to show recursion as a practical tool rather than a trick. Cover: marking visited grid cells, stopping at invalid positions, returning success/failure, and the backtracking pattern of choose, recurse, undo, and try the next possibility. Keep the search space small enough to draw and to explain exactly why the algorithm stops."
				},
				{
					title: "CPPI2 Project: Recursive Maze or Word Search",
					content:
						"Implement a recursive search through a small grid. Mark visited cells, backtrack safely, and explain why the algorithm stops instead of looping forever.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursive-Maze-Search/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursive-Maze-Search/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI2 Project 2: Recursion Trace Drill",
					content:
						"Trace three recursive calls by hand before running the program. The submitted work includes the predicted output, the actual output, and one corrected misconception.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursion-Trace-Drill/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursion-Trace-Drill/solution"
				}
			]
		},
		{
			title: "CPPI3 STL Containers, Iterators, and Algorithms",
			curriculum: [
				{
					title: "Choosing Containers and Traversing with Iterators",
					content:
						"Move beyond `vector` by treating standard containers as design choices. Compare when `array`, `deque`, `set`, `map`, and `unordered_map` fit better than a vector; how ordering, uniqueness, key lookup, insertion, and mutation patterns affect the choice; how iterators represent positions across different containers; and how iterator invalidation differs from pointer arithmetic. A justified container choice follows from the operations the program actually performs."
				},
				{
					title: "Standard Algorithms and Relation-Style Views",
					content:
						"Standard algorithms are reusable operations that often communicate intent better than another hand-written loop. Cover: `find`, `count`, `sort`, `transform`, custom predicates, and when explicit loops are still clearer. Then adapt the CS236 relation idea into a practical container exercise: model rows as records and implement small `select`, `project`, `rename`, and join-style views with `vector`, `set`, and `map`."
				},
				{
					title: "CPPI3 Project: Inventory Indexer",
					content:
						"Build an inventory or library index that stores records in a sequence, maps IDs to records, tracks unique categories, and produces sorted relation-style views such as selected rows, projected names, renamed categories, and supplier joins. The point is practical standard-library fluency before custom data structures.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Inventory-Indexer/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Inventory-Indexer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI3 Project 2: Container Tradeoff Mini-Audit",
					content:
						"Take one part of the inventory project and justify why the selected container is better than at least one alternative for the operations the program actually performs.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Container-Tradeoff-Audit/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Container-Tradeoff-Audit/solution"
				}
			]
		},
		{
			title: "CPPI4 RAII, Smart Pointers, and Robust Error Handling",
			curriculum: [
				{
					title: "RAII and Single-Owner Resource Design",
					content:
						"RAII is the default modern C++ answer to cleanup: resources are acquired by objects and released automatically when those objects leave scope. Destructors are not called manually in normal code; they run because scope, object lifetime, and ownership are designed correctly. Standard containers, file streams, lock guards, and small wrapper classes are concrete RAII examples before custom resource classes appear. `std::unique_ptr` is the first smart pointer because it models single ownership clearly: moving it transfers ownership, the moved-from pointer no longer owns the resource, and copying is intentionally blocked. `std::shared_ptr` appears only when shared lifetime is justified, with `std::weak_ptr` used to observe shared objects or break ownership cycles rather than making shared ownership the default."
				},
				{
					title: "Validation, Exceptions, and Resource Boundaries",
					content:
						"Error handling belongs beside resource safety. Expected bad input is validated and reported normally; exceptional failures interrupt the current operation because continuing would leave the program in an untrustworthy state. Key cases include failed file opens, parse errors, invalid numeric ranges, partial output, rollback of a failed save, and preserving the previous valid state when a command cannot be completed. RAII makes cleanup reliable even when a function returns early or throws, but it does not replace validation. The failure-path target is the basic guarantee: after a failed operation, the program can name which state was preserved, which temporary work was discarded, and which message explains the problem."
				},
				{
					title: "CPPI4 Project: Resource-Safe File Processor",
					content:
						"Build a file-processing tool that opens input/output files, validates records, reports errors, and relies on object lifetime for cleanup. The project includes at least one deliberately failed open or parse case.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Resource-Safe-File-Processor/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Resource-Safe-File-Processor/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI4 Project 2: Ownership Rewrite Reflection",
					content:
						"Rewrite one small raw-pointer example from Level 2 using a standard container or `std::unique_ptr`, then explain what cleanup responsibility disappeared and what responsibility remains.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Ownership-Rewrite-Reflection/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Ownership-Rewrite-Reflection/solution"
				}
			]
		},
		{
			title: "CPPI5 Value Types, Operator Overloading, and Templates",
			curriculum: [
				{
					title: "Predictable Value Types and Restrained Operators",
					content:
						"Review constructors, invariants, `const` methods, and value semantics before adding operator overloading. Cover: what makes a class safe to copy, compare, print, and store in containers; when `operator<<`, comparison operators, or arithmetic operators make a type read naturally; and why overloaded operators avoid surprising side effects. Leave with a bias toward readable value behavior, not clever syntax."
				},
				{
					title: "Templates and Diagnostic Reading",
					content:
						"Templates are a way to write type-independent code after the standard library is familiar. Cover: small function templates, tiny class-template wrappers, comparison helpers, constraints stated in plain language, and how to read template compiler errors by finding the first useful diagnostic instead of reacting to the full wall of output."
				},
				{
					title: "CPPI5 Project: Score or Fraction Toolkit",
					content:
						"Build a small value type such as `Fraction`, `Score`, or `Measurement` with validation, output, comparisons, and one or two restrained overloaded operators. Add a templated helper where it improves reuse.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Fraction-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Fraction-Toolkit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI5 Project 2: Template Error Reading Drill",
					content:
						"Trigger one controlled template compile error and practice reading the first useful diagnostic instead of reacting to the entire wall of compiler output.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Template-Error-Reading-Drill/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Template-Error-Reading-Drill/solution"
				}
			]
		},
		{
			title: "CPPI6 Polymorphism and Bridge to Advanced C++",
			curriculum: [
				{
					title: "Polymorphism, Composition, and Runtime Dispatch",
					content:
						"Inheritance is a tool for shared interfaces and substitutable roles, not the default way to reuse code. Cover: composition versus inheritance, pure virtual interfaces, virtual destructors, `override`, runtime dispatch through references or smart pointers, object-slicing avoidance, and how this differs from a simple `enum class` state machine. Connect the comparison directly to future design-pattern work, especially polymorphic state objects."
				},
				{
					title: "Advanced Pathways and Program Framing",
					content:
						"Close the course by naming the next paths clearly and framing the capstone as evidence of readiness. `Data Structures and Algorithms in C++` fits when performance, asymptotic reasoning, trees, graphs, and containers are the main next gap. `Design Patterns in C++` fits when the next gap is architecture: polymorphic roles, state objects, factories, adapters, and testable boundaries. `C Systems Engineering` fits when memory layout, compilation, operating-system interfaces, and lower-level representation are the strongest pull. The advanced CS236-inspired capstone can combine a scanner, parser, command or AST objects, table-style evaluation, and a dependency graph, but it remains smaller than the original college project. Readiness evidence includes a parse trace, a class or ownership diagram, focused tests, and a written limitation."
				},
				{
					title: "CPPI6 Capstone: Saveable Command-Driven Simulation",
					content:
						"Build a small simulation, game, or interpreter-style command engine with saved data, explicit states, STL containers, one recursive or algorithmic subsystem, and a narrow polymorphic interface. The capstone demonstrates medium-size C++ program organization without jumping into a full application framework.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Saveable-Command-Simulation/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Saveable-Command-Simulation/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI6 Project 2: Enum State versus Polymorphic State Review",
					content:
						"Take one capstone state transition and compare the simple `enum class` approach with a possible polymorphic State-pattern design. Explain which version is more appropriate for the current project size.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Enum-vs-Polymorphic-State-Review/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Enum-vs-Polymorphic-State-Review/solution"
				}
			]
		}
	]
};

interface CppLevel3ModuleFlow {
	estimatedTime: string;
	flowNote: string;
	keyBlocks: string[];
}

const CPP_LEVEL_3_CHALLENGE_SUPPLEMENTAL = new Set([
	"CPPI1 Project 2: Import and Reject Bad Rows",
	"CPPI1 Project 3: Mini Command Scanner",
	"CPPI5 Project 2: Template Error Reading Drill"
]);

const CPP_LEVEL_3_MODULE_FLOW: Record<string, CppLevel3ModuleFlow> = {
	"CPPI0 Bridge Course Setup and Positioning": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"C++20",
			"warning-clean build",
			"multi-file target",
			"test harness",
			"debug evidence"
		],
		flowNote:
			"Start from a clean checkout and establish one documented C++20 build, test, and run path before adding features. The checkpoint is complete only when warnings are clean, a deliberately broken case is reproduced, and debugger or trace evidence explains why the correction works."
	},
	"CPPI1 Command Architecture, File I/O, and Small Parsers": {
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"token boundary",
			"command object",
			"validated mutation",
			"save / reload",
			"malformed input"
		],
		flowNote:
			"Build the task manager in vertical slices: parse one command, validate it, mutate only after success, save through a temporary file, and reload into the same observable state. Test unknown commands, missing and extra arguments, quoted text, malformed rows, and a failed save; the scanner and import extensions remain optional."
	},
	"CPPI2 Recursion and the Call Stack": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"base case",
			"smaller subproblem",
			"stack frame",
			"visited state",
			"backtracking invariant"
		],
		flowNote:
			"Draw representative stack frames before implementation, then keep search state small enough to verify by hand. The maze or word search must terminate on blocked, visited, boundary, solved, and unsolved cases and restore backtracked state deliberately."
	},
	"CPPI3 STL Containers, Iterators, and Algorithms": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"container contract",
			"iterator validity",
			"algorithm",
			"predicate",
			"complexity justification"
		],
		flowNote:
			"Choose each container from the operations the inventory actually needs, then document iterator-invalidation assumptions before mutation. Verify duplicate IDs, missing keys, empty data, stable sorted views, and relation-style select/project/join results; the tradeoff audit is a choice for deeper justification."
	},
	"CPPI4 RAII, Smart Pointers, and Robust Error Handling": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"RAII",
			"unique_ptr",
			"shared_ptr / weak_ptr",
			"basic guarantee",
			"rollback"
		],
		flowNote:
			"Keep ownership single by default and introduce shared lifetime only with a written ownership graph and a reason `std::unique_ptr` is insufficient. The file processor must preserve the previous valid state after failed open, parse, or output operations and demonstrate automatic cleanup on early return or exception."
	},
	"CPPI5 Value Types, Operator Overloading, and Templates": {
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"value invariant",
			"const behavior",
			"conventional operator",
			"template contract",
			"diagnostic reading"
		],
		flowNote:
			"Define the value-type invariant and ordinary named operations before adding an operator. Test construction, comparison, output, invalid values, and container use, then add only operators whose meaning is conventional; the controlled template-error drill is an optional challenge."
	},
	"CPPI6 Polymorphism and Bridge to Advanced C++": {
		estimatedTime: "6–8 sessions · 45–60 minutes each",
		keyBlocks: [
			"composition / inheritance",
			"virtual destructor",
			"state transition",
			"serialization round trip",
			"regression suite"
		],
		flowNote:
			"Build the capstone as a sequence of working vertical slices with a narrow interface and composition as the default. Prove accepted and rejected commands, every state transition, recursive or algorithmic edge cases, save/reload equivalence, corrupted-file recovery, and clean polymorphic destruction before selecting the next C++ pathway."
	}
};

function decorateCppLevel3Module(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = CPP_LEVEL_3_MODULE_FLOW[module.title];
	const curriculum = module.curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
				: item.content,
		learningPath: "core" as const
	}));

	if (module.title === "CPPI0 Bridge Course Setup and Positioning") {
		curriculum.splice(1, 0, {
			title: "CPPI0 Project 0: Reproducible Build and Test Readiness",
			content: [
				"**Completion evidence:**",
				"- Compiler name and version plus one documented C++20 configure/build/test/run path from a clean checkout.",
				"- Warning-clean output using `-Wall -Wextra -Wpedantic` or the closest supported equivalent.",
				"- A small deterministic test or command harness that exits unsuccessfully when a regression is introduced.",
				"- One debugger, trace, sanitizer, or failed-test artifact connected to the exact code change that resolved it."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "CPPI6 Polymorphism and Bridge to Advanced C++") {
		curriculum.push({
			title: "CPPI6 Capstone Completion Contract",
			content: [
				"**Completion evidence:**",
				"- Clean C++20 build and deterministic regression command from a fresh checkout.",
				"- Tests or transcripts for accepted command, unknown command, missing and extra arguments, every state transition, recursive base and failure cases, empty state, and quit behavior.",
				"- Save/reload round-trip equivalence plus malformed or corrupted-file recovery that preserves the previous valid state.",
				"- Interface and ownership diagram showing composition choices, virtual destruction, no object slicing, and one limitation or deferred feature."
			].join("\n"),
			learningPath: "core"
		});
	}

	return {
		...module,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: CPP_LEVEL_3_CHALLENGE_SUPPLEMENTAL.has(item.title)
				? ("challenge" as const)
				: ("choice" as const)
		}))
	};
}

export const cppLevel3Course: RawCourse = {
	...cppLevel3SourceCourse,
	modules: cppLevel3SourceCourse.modules.map(decorateCppLevel3Module)
};
