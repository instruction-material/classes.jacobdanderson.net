import type { RawCourse } from "./types";
import {
	cppBuildDebugProjectBrief,
	cppBuildPositioningReading,
	cppBuildReadinessBrief
} from "./cppBuildDebugProjectBrief";
import { cppCapstoneLessons } from "./cppCapstoneLessons";
import { cppContainerAuditWorksheet } from "./cppContainerAuditWorksheet";
import { cppContainerLessons } from "./cppContainerLessons";
import { cppDebugEvidenceNotebookBrief } from "./cppDebugEvidenceNotebookBrief";
import { cppMazeSearchBriefs } from "./cppMazeSearchBriefs";
import { cppRecursionTraceWorksheet } from "./cppRecursionTraceWorksheet";
import { cppResourceSafetyLessons } from "./cppResourceSafetyLessons";
import { cppRowImportProjectBrief } from "./cppRowImportProjectBrief";
import { cppTaskManagerBriefs } from "./cppTaskManagerBriefs";
import { cppValueTemplateLessons } from "./cppValueTemplateLessons";
import cppMiniCommandScannerBrief from "./readings/cpp-level-3/mini-command-scanner.md?raw";

const cppMiniScannerSource =
	"https://github.com/instruction-material/CPP-Level-3/tree/5695d18a91ab249b7db4003df49cd4dc47d8c480/CPPI1-Mini-Command-Scanner";

const cppLevel3SourceCourse: RawCourse = {
	name: "C++ Level 3",
	modules: [
		{
			title: "CPPI0 Bridge Course Setup and Positioning",
			curriculum: [
				{
					title: "Bridge Course Goals, Scale, and Tooling",
					content: cppBuildPositioningReading,
					contentKind: "reading",
					preserveInstructions: true
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
					content: cppRowImportProjectBrief,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Import-and-Reject-Bad-Rows/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Import-and-Reject-Bad-Rows/solution"
				},
				{
					title: "CPPI1 Project 3: Mini Command Scanner",
					content: cppMiniCommandScannerBrief,
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					projectLink: `${cppMiniScannerSource}/starter`,
					solutionLink: `${cppMiniScannerSource}/solution`
				}
			]
		},
		{
			title: "CPPI2 Recursion and the Call Stack",
			curriculum: [
				{
					title: "Recursion, Base Cases, and Stack Frames",
					content: cppMazeSearchBriefs.stack
				},
				{
					title: "Recursive Traversal and Backtracking",
					content: cppMazeSearchBriefs.backtracking
				},
				{
					title: "CPPI2 Project: Recursive Maze or Word Search",
					content: cppMazeSearchBriefs.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursive-Maze-Search/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursive-Maze-Search/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI2 Project 2: Recursion Trace Drill",
					content: cppRecursionTraceWorksheet,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI2-Recursion-Trace-Drill/starter/WORKSHEET.md",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI2-Recursion-Trace-Drill/solution/WORKED-TRACE.md"
				}
			]
		},
		{
			title: "CPPI3 STL Containers, Iterators, and Algorithms",
			curriculum: [
				{
					title: "Choosing Containers and Traversing with Iterators",
					content: `**Concept focus:** Choose containers from required operations and traverse their elements without invalidating the current traversal.\n\n${
						cppContainerLessons.containers
					}`
				},
				{
					title: "Standard Algorithms and Relation-Style Views",
					content: `**Concept focus:** Use standard algorithms to build derived views while preserving container invariants.\n\n${
						cppContainerLessons.algorithms
					}`
				},
				{
					title: "CPPI3 Project: Inventory Indexer",
					content: cppContainerLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Inventory-Indexer/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Inventory-Indexer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI3 Project 2: Container Tradeoff Mini-Audit",
					content: cppContainerAuditWorksheet,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI3-Container-Tradeoff-Audit/starter/WORKSHEET.md",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI3-Container-Tradeoff-Audit/solution/WORKED-AUDIT.md"
				}
			]
		},
		{
			title: "CPPI4 RAII, Smart Pointers, and Robust Error Handling",
			curriculum: [
				{
					title: "RAII and Single-Owner Resource Design",
					content: cppResourceSafetyLessons.ownership
				},
				{
					title: "Validation, Exceptions, and Resource Boundaries",
					content: cppResourceSafetyLessons.errors
				},
				{
					title: "CPPI4 Project: Resource-Safe File Processor",
					content: cppResourceSafetyLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Resource-Safe-File-Processor/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Resource-Safe-File-Processor/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI4 Project 2: Ownership Rewrite Reflection",
					content: cppResourceSafetyLessons.worksheet,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI4-Ownership-Rewrite-Reflection/starter/NOTES.md",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI4-Ownership-Rewrite-Reflection/solution/WORKED.md"
				}
			]
		},
		{
			title: "CPPI5 Value Types, Operator Overloading, and Templates",
			curriculum: [
				{
					title: "Predictable Value Types and Restrained Operators",
					content: cppValueTemplateLessons.values
				},
				{
					title: "Templates and Diagnostic Reading",
					content: cppValueTemplateLessons.templates
				},
				{
					title: "CPPI5 Project: Score or Fraction Toolkit",
					content: cppValueTemplateLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Fraction-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Fraction-Toolkit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI5 Project 2: Template Error Reading Drill",
					content: cppValueTemplateLessons.worksheet,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI5-Template-Error-Reading-Drill/WORKSHEET.md",
					solutionLink:
						"/ide?course=cpp-level-3&mode=cpp&projectKey=cpp-level-3%3Acppi5-template-diagnostic%3Areference-pack-v1&starterUrl=https%3A%2F%2Fgithub.com%2Finstruction-material%2FCPP-Level-3%2Ftree%2Fmain%2FCPPI5-Template-Error-Reading-Drill%2Fsolution&starterTitle=CPPI5+Project+2%3A+Template+Error+Reading+Drill&starterLabel=Worked+reference&lesson=cpp-level-3-cppi5-value-types-operator-overloading-and-templates"
				}
			]
		},
		{
			title: "CPPI6 Polymorphism and Bridge to Advanced C++",
			curriculum: [
				{
					title: "Polymorphism, Composition, and Runtime Dispatch",
					content: cppCapstoneLessons.dispatch
				},
				{
					title: "Advanced Pathways and Program Framing",
					content: cppCapstoneLessons.pathways
				},
				{
					title: "CPPI6 Capstone: Saveable Command-Driven Simulation",
					content: cppCapstoneLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Saveable-Command-Simulation/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Saveable-Command-Simulation/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI6 Project 2: Enum State versus Polymorphic State Review",
					content: cppCapstoneLessons.worksheet,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI6-Enum-vs-Polymorphic-State-Review/WORKSHEET.md",
					solutionLink:
						"/ide?course=cpp-level-3&mode=cpp&projectKey=cpp-level-3%3Acppi6-state-review%3Areference-pack-v1&starterUrl=https%3A%2F%2Fgithub.com%2Finstruction-material%2FCPP-Level-3%2Ftree%2Fmain%2FCPPI6-Enum-vs-Polymorphic-State-Review%2Fsolution&starterTitle=CPPI6+Project+2%3A+Enum+State+versus+Polymorphic+State+Review&starterLabel=Worked+reference&lesson=cpp-level-3-cppi6-polymorphism-and-bridge-to-advanced-c"
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
				? item.content.startsWith("**Concept focus:**")
					? item.content.replace(
							/^(\*\*Concept focus:\*\*[\s\S]*?\n\n)/,
							`$1**Course flow:** ${flow.flowNote}\n\n`
						)
					: `**Course flow:** ${flow.flowNote}\n\n${item.content}`
				: item.content,
		learningPath: "core" as const
	}));

	if (module.title === "CPPI0 Bridge Course Setup and Positioning") {
		curriculum.splice(1, 0, {
			title: "CPPI0 Project 0: Reproducible Build and Test Readiness",
			content: cppBuildReadinessBrief,
			contentKind: "assignment",
			preserveInstructions: true,
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
