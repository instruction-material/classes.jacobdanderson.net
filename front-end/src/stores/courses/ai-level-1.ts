import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

type AiSearchSupplementalPurpose = "transfer" | "extension";

function aiSearchLabFocus(labNumber: number) {
	const focusByLab: Record<number, string> = {
		13: "frontier instrumentation, path reconstruction, visited-state evidence, and a trace that explains why the selected path was found",
		14: "depth limits, iterative-deepening comparisons, missed-state notes, repeated-work logs, and a clear explanation of the stop condition",
		15: "uniform-cost or A* cost accounting, priority-queue traces, weighted-edge behavior, and heuristic admissibility checks",
		16: "greedy versus A* comparisons, misleading heuristic cases, cost-aware path explanations, and evidence that the faster-looking path is not always best",
		17: "game or puzzle search evaluation, baseline comparison, scoring-heuristic stress tests, decision logs, and a cautious interpretation of the chosen move"
	};

	return (
		focusByLab[labNumber] ??
		"state representation, search traces, success conditions, and evidence that the algorithm behaves intentionally"
	);
}

function aiSearchSupplementalContent(
	labNumber: number,
	purpose: AiSearchSupplementalPurpose
) {
	const label = `AI Search Lab ${labNumber}`;
	const purposeText =
		purpose === "transfer"
			? {
					artifact: "transfer-practice search lab",
					path: "Move the search idea into a changed state space, graph shape, cost rule, or stopping condition so the same reasoning is checked outside the original walkthrough."
				}
			: {
					artifact: "extension-practice search lab",
					path: "Add one stronger diagnostic, comparison, visualization, or stress case that makes the search behavior easier to inspect and explain."
				};
	const finalCheck =
		purpose === "transfer"
			? "The changed case still names the state representation, valid actions, goal test, and evidence used to judge correctness."
			: "The extension adds insight rather than only extra output: the new evidence changes what can be explained about the search behavior.";

	return [
		`**Project goal:** Complete the ${purposeText.artifact} for **${label}** with a reproducible run, visible search trace, and one edge case that is not copied from the core lab.`,
		`**Practice path:** ${purposeText.path}`,
		`**Focus:** ${aiSearchLabFocus(labNumber)}.`,
		"**Core work:**",
		"1. Define the state representation, valid actions, goal condition, frontier rule, and evidence to record before changing the code.",
		"2. Run one baseline case and save enough trace output to explain the order in which states are explored.",
		"3. Change one meaningful condition, then rerun the search and compare path, cost, frontier size, visited states, or decision quality.",
		"4. Write a short interpretation that separates algorithm behavior from implementation bugs or arbitrary tie-breaking.",
		"**Completion checks:**",
		`- ${finalCheck}`,
		"- The output includes a standard case, a changed or edge case, and a short explanation of what the trace supports.",
		"- The conclusion names one limitation of the representation, heuristic, cost rule, or stopping condition."
	].join("\n\n");
}

export const aiLevel1Course: RawCourse = {
	name: "AI Level 1",
	modules: [
		{
			title: "FAI0 Setup and Tooling",
			curriculum: [
				{
					title: "Python Environment for Search and Graph Labs",
					content:
						"Set up `Python 3`, a virtual environment, and a lightweight editor workflow in either `PyCharm` or `VS Code`. Install `networkx`, `matplotlib`, and notebook support early to inspect graphs, visualize search spaces, and keep small experiment logs without changing tools halfway through the course."
				},
				{
					title: "Bridge Positioning between Core Python and ML",
					content:
						"Frame the course as a bridge from programming fundamentals into AI thinking. The emphasis is on state, goals, search, rules, heuristics, and evaluation before heavier statistics or model-training pipelines."
				},
				{
					title: "How to Read an AI Problem Statement",
					content:
						"Practice identifying the state, the valid actions, the goal condition, and the cost or score function before code is written. This is the key shift from basic programming tasks into AI-style problem solving."
				},
				{
					title: "Experiment Logging and Reflection",
					content:
						"Include short written notes after each search or game AI lab: what representation was used, what strategy was tried, what failed, and what evidence supports the next revision. Leave the course able to explain why an algorithm behaved the way it did."
				},
				{
					title: "FAI0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "FAI0 Setup and Tooling",
						projectKind: "core",
						hasReference: false
					})
				}
			],
			supplementalProjects: [
				{
					title: "Reference Archive: AI Level 1 Workspace",
					aliases: ["Legacy Archive: AI Level 1 Workspace"],
					content:
						"The AI Level 1 workspace archive is a reference map for the course's Python search and game-AI materials. It identifies the folder layout, starter files, graph and grid examples, trace-output patterns, and earlier classroom variants that may clarify how a lab is organized. The archive is most useful for comparing state representation, action rules, search order, scoring logic, and reflection notes across projects. A strong use of the archive names the file being inspected, the behavior it demonstrates, and the part of the current project it helps verify; it is not a shortcut around explaining the algorithm.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main"
				},
				{
					title: "Object Refresh: Dog Class",
					content:
						"Use a small class-design warmup to refresh attributes, methods, and state changes before graph and game objects enter the course. The goal is not the dog model itself; it is confidence with objects as containers for AI state.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI1-Dog-Class"
				},
				{
					title: "Object Refresh: Deck of Cards",
					content:
						"Review lists of objects, controlled randomness, and data modeling with a deck implementation. The deck gives state transitions a concrete form before search trees and game logic enter the course.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI1-Deck-of-Cards"
				},
				{
					title: "The Marble Game AI",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "FAI0 Setup and Tooling",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI-Copy"
				}
			]
		},
		{
			title: "Unit 1: AI Landscape and State Representation",
			curriculum: [
				{
					title: "What AI Is and What It Is Not",
					content:
						"AI is a family of approaches: rules, search, planning, heuristics, machine learning, and modern generative systems. This course focuses on explicit state and decision processes rather than jumping straight to model fitting."
				},
				{
					title: "States, Actions, Goals, and Costs",
					content:
						"Every AI problem can be framed as a question about state changes. A clear problem statement says what a valid state looks like, what transitions are allowed, what counts as success, and whether a path is judged by steps, cost, score, or another metric."
				},
				{
					title: "Graphs as a Universal Representation",
					content:
						"Graphs are useful abstractions for AI because locations, social links, game boards, dependency chains, and puzzle moves can all be phrased as nodes and edges once the necessary information has been identified."
				},
				{
					title: "Knowledge Representation for Small Systems",
					content:
						"Simple Python classes and dictionaries can represent entities, edges, metadata, and rules. Strong representations are easy to inspect, reason about, and debug."
				},
				{
					title: "Unit 1: AI Landscape and State Representation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 1: AI Landscape and State Representation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Node and Graph Class",
					content:
						"Build a reusable graph model with explicit nodes, adjacency, and helper methods for traversal. This is the foundational starter for later DFS, BFS, and heuristic search work.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class"
				},
				{
					title: "Project: Graphs with Network Visualization",
					content:
						"Use `networkx` to draw graph structures and make the difference between representation and traversal visible. A search algorithm is easier to debug when the structure is easy to inspect.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Graphs-with-Network-Updated"
				},
				{
					title: "Project: Airports Problem",
					content:
						"Model routes, hubs, and reachability in a graph-based setting. This keeps the early graph work grounded in a recognizable real-world system rather than a purely abstract diagram.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI3-Airports-Problem"
				},
				{
					title: "Unit 1: AI Landscape and State Representation supplemental 4",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 1: AI Landscape and State Representation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-unit-1-ai-landscape-and-state-representation-supplemental-4/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-unit-1-ai-landscape-and-state-representation-supplemental-4/solution"
				}
			]
		},
		{
			title: "Unit 2: Stacks, Queues, and Traversal Intuition",
			curriculum: [
				{
					title: "Why Search Needs a Frontier",
					content:
						"The frontier is the set of states that have been generated but not fully explored. Search behavior is largely determined by how the frontier is organized and updated."
				},
				{
					title: "Stack Behavior and Depth-First Thinking",
					content:
						"Use stacks to make branch commitment and backtracking visible. The point is to make the control flow of DFS concrete long before formal optimization or comparison."
				},
				{
					title: "Queue Behavior and Breadth-First Thinking",
					content:
						"Use queues to show layer-by-layer exploration and shortest-path intuition in unweighted settings. Data structure choice changes the order of discovery and the type of guarantees an algorithm can make."
				},
				{
					title: "Tracing Traversals by Hand",
					content:
						"Use diagram or notebook traces before implementation. Follow push, pop, enqueue, dequeue, and visited-set changes step by step instead of treating search as magic recursion or copy-pasted code."
				},
				{
					title: "Unit 2: Stacks, Queues, and Traversal Intuition: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 2: Stacks, Queues, and Traversal Intuition",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI4-Practice-with-Stacks"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Practice with Stacks",
					content:
						"Work directly with LIFO behavior so that the mechanics behind backtracking become automatic. This warmup is intentionally small because the real value is the mental model it creates.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI4-Practice-with-Stacks"
				},
				{
					title: "Project: Practice with Queues",
					content:
						"Build fluency with FIFO behavior before BFS is introduced on graphs. Leave this project knowing exactly what comes out next and why.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI4-Practice-with-Queues"
				},
				{
					title: "Project: Stacks and Queues Reference",
					content:
						"Keep a reference implementation of stack- and queue-based workflows nearby while later search code gets more complex. This separates data-structure confusion from algorithmic confusion.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Queues"
				},
				{
					title: "Unit 2: Stacks, Queues, and Traversal Intuition supplemental 4",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 2: Stacks, Queues, and Traversal Intuition",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-unit-2-stacks-queues-and-traversal-intuition-supplemental-4/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-unit-2-stacks-queues-and-traversal-intuition-supplemental-4/solution"
				}
			]
		},
		{
			title: "Unit 3: DFS, BFS, and Reachability",
			curriculum: [
				{
					title: "Depth-First Search as Structured Exploration",
					content:
						"DFS is a systematic way to explore one branch fully, record visited nodes, and backtrack cleanly. It is especially useful for reachability, component finding, and exhaustive path exploration."
				},
				{
					title: "Breadth-First Search and Unweighted Shortest Paths",
					content:
						"BFS is the correct default when edge costs are uniform and the first shortest path matters. Defend BFS in a shortest-step setting instead of choosing it only because the name is familiar."
				},
				{
					title: "Visited Sets, Parents, and Path Reconstruction",
					content:
						"Move beyond simple discovery and show how to reconstruct actual solutions. Record parent pointers or equivalent state so that the search output explains the path, not just the destination."
				},
				{
					title: "Instrumentation and Debugging Search",
					content:
						"Add counters, frontier-size tracking, and simple visual markers to search code. This keeps performance and correctness observable, which matters once informed search and game trees arrive."
				},
				{
					title: "Unit 3: DFS, BFS, and Reachability: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "Unit 3: DFS, BFS, and Reachability",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-Implement-DFS"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Implement DFS",
					content:
						"Build DFS explicitly rather than relying on library behavior. Explain every mutation of the stack, visited set, and current node during execution.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-Implement-DFS"
				},
				{
					title: "Project: Implement BFS",
					content:
						"Build BFS with a queue, visited tracking, and path reconstruction. The emphasis is on why breadth-first ordering produces the right guarantee in an unweighted problem.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI6-Implement-BFS"
				},
				{
					title: "Project: Magic Portals",
					content:
						"Use a graph puzzle with teleports and special moves to distinguish state transitions from physical movement on a simple map. This sharpens the habit of designing the right graph before running the algorithm.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI6-Magic-Portals"
				},
				{
					title: "Project: Maze Solver",
					content:
						"Start with a constrained maze-search starter, then extend it into a working solver that traces paths and compares candidate routes. This becomes the anchor example for later informed search units.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Maze-Solver-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Maze-Solver"
				}
			]
		},
		{
			title: "Unit 4: Informed and Bounded Search",
			curriculum: [
				{
					title: "Depth-Limited and Iterative Deepening Search",
					content:
						"DLS and IDS control explosion in deep trees while still preserving a way to reason about completeness. Search often needs operational constraints as much as it needs cleverness."
				},
				{
					title: "Uniform Cost Search and Weighted Paths",
					content:
						"Move from step counts to path costs to distinguish shortest-by-steps from cheapest-by-total-cost. This sets up a clearer understanding of why BFS is not enough once edge weights matter."
				},
				{
					title: "Heuristics, Greedy Choice, and A*",
					content:
						"Heuristics are informed guesses that help order the frontier. Compare greedy best-first search with A* and learn that a better-looking local move is not the same thing as a guaranteed optimal plan."
				},
				{
					title: "Comparing Search Strategies Honestly",
					content:
						"Compare algorithms by memory use, guarantees, path quality, and runtime behavior on the same problem family. The comparison makes tradeoffs explicit rather than celebrating any single algorithm as 'the AI one'."
				},
				{
					title: "Unit 4: Informed and Bounded Search: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "Unit 4: Informed and Bounded Search",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-DLS"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Implement DLS",
					content:
						"Add depth limits deliberately and observe what gets missed, what gets found, and what the algorithm spends time revisiting. This is a good lab for understanding search control rather than only search success.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-DLS"
				},
				{
					title: "Project: Implement IDS",
					content:
						"Layer repeated depth-limited searches into an iterative-deepening workflow and compare its behavior to plain DFS. Identify when the extra repeated work is worth it.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-IDS"
				},
				{
					title: "Project: Implement UCS",
					content:
						"Handle weighted paths and prove to yourself that expanding the shallowest path is not enough once costs differ. UCS becomes the clean stepping stone into heuristic search.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-UCS"
				},
				{
					title: "Project: Compare A* and Greedy Search",
					content:
						"Run the same state space through greedy best-first search and A* to compare fast-looking decisions with cost-aware planning.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-A-Search"
				},
				{
					title: "Project: Greedy Search Lab",
					content:
						"Use a dedicated greedy search implementation to show how a heuristic can reduce work while still getting trapped by shortsighted choices.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-Greedy-Search"
				}
			]
		},
		{
			title: "Unit 5: Rule-Based Systems and Puzzle Framing",
			curriculum: [
				{
					title: "Rules as Small AI",
					content:
						"Rule-based systems are a legitimate form of AI when the domain is structured and the reasoning can be written down clearly. Not all intelligent behavior comes from statistical models."
				},
				{
					title: "Decision Logic, Constraints, and State Tracking",
					content:
						"Use text adventures and small puzzles to represent progress, conditions, and allowed actions explicitly. This reinforces the idea that good AI work often starts with clean state definitions rather than advanced math."
				},
				{
					title: "When Search Beats Rules and When Rules Beat Search",
					content:
						"Choose between hand-authored rules and search over a space of possibilities. The right answer often depends on whether the structure is known, stable, and explainable."
				},
				{
					title: "Feature Thinking before Machine Learning",
					content:
						"Start the bridge to ML by asking what information a system would need in order to make a good decision. Name candidate features even before training a predictive model."
				},
				{
					title: "Unit 5: Rule-Based Systems and Puzzle Framing: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 5: Rule-Based Systems and Puzzle Framing",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Adventure-Game"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Adventure Game State Tracker",
					content:
						"Use a branching text-style environment to manage inventory, location, and permitted actions. This is a good exercise in representing knowledge and gating decisions through explicit rules.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Adventure-Game"
				},
				{
					title: "Project: Puzzle Solver Warmup",
					content:
						"Frame a small puzzle in terms of state transitions and allowable moves before the capstone solver arrives. The lesson is to model the problem cleanly before choosing the search algorithm.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Puzzle"
				},
				{
					title: "Project: Book Rule System",
					aliases: ["Project: Juni Book Rule System"],
					content:
						"Use a structured decision or lookup problem to practice explicit rules, routing, and explainability. Justify each program choice in natural language.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-Juni-Book"
				},
				{
					title: "Unit 5: Rule Based Systems and Puzzle Framing supplemental 4",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 5: Rule-Based Systems and Puzzle Framing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-unit-5-rule-based-systems-and-puzzle-framing-supplemental-4/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-unit-5-rule-based-systems-and-puzzle-framing-supplemental-4/solution"
				}
			]
		},
		{
			title: "Unit 6: Heuristics and Game AI",
			curriculum: [
				{
					title: "Game State Trees",
					content:
						"Represent turn-based games as trees of future possibilities. One move creates a new state, and repeated expansion creates a search tree instead of a single graph walk."
				},
				{
					title: "Random Play, Heuristic Play, and Stronger Play",
					content:
						"Compare purely random agents with agents that score positions and look ahead. The point is to see how even simple heuristics can change behavior dramatically before a full minimax treatment is introduced."
				},
				{
					title: "Evaluation Functions and Tradeoffs",
					content:
						"Heuristic evaluation is a practical compromise when exhaustive search is too expensive. Design scores that reflect the actual objectives of the game, not just arbitrary numbers."
				},
				{
					title: "Debugging a Game AI",
					content:
						"Use concrete debugging methods: inspect candidate moves, print evaluation scores, compare turns against human reasoning, and capture failure positions. Learn that AI bugs are often representation bugs or scoring bugs."
				},
				{
					title: "Unit 6: Heuristics and Game AI: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "Unit 6: Heuristics and Game AI",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Tic-Tac-Toe-Tree-Node"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Tic-Tac-Toe Tree Nodes",
					content:
						"Build the board-state representation and successor logic that later AI strategies depend on. The quality of the tree structure determines how easy the rest of the project is to reason about.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Tic-Tac-Toe-Tree-Node"
				},
				{
					title: "Project: Random Tic-Tac-Toe AI",
					content:
						"Start from a deliberately weak baseline so that later heuristic and search upgrades are easy to compare against. This makes evaluation visible rather than abstract.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Random-Tic-Tac-Toe-AI"
				},
				{
					title: "Project: Unbeatable Tic-Tac-Toe AI",
					content:
						"Push a simple game AI all the way to strong play and discuss what made the jump possible: better state modeling, lookahead, pruning of bad choices, and more disciplined scoring.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Unbeatable-Tic-Tac-Toe-AI"
				},
				{
					title: "Project: Marble Game AI",
					content:
						"Use a two-player strategy game to compare state explosion, heuristics, and planning depth in a setting that is different enough from tic-tac-toe to test whether the reasoning generalizes.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI"
				}
			]
		},
		{
			title: "Unit 7: Features, Evaluation, and Responsible AI",
			curriculum: [
				{
					title: "From States to Features",
					content:
						"Turn raw states into measurable signals such as path cost, remaining distance, mobility, piece control, or resource counts. This is the conceptual bridge into ML because the design question becomes which inputs actually help a system make better decisions."
				},
				{
					title: "Labels, Benchmarks, and Success Criteria",
					content:
						"Define what counts as a correct or useful output before optimizing anything. Even in small AI systems, evaluation depends on clear labels, goals, baselines, and constraints."
				},
				{
					title: "Bias, Failure Modes, and Overconfidence",
					content:
						"Use toy AI examples to discuss blind spots, brittle heuristics, misleading benchmarks, and the danger of calling a system 'intelligent' when it only works on a narrow slice of cases. Responsible AI starts with honest evaluation."
				},
				{
					title: "Bridge to Later Machine Learning Work",
					content:
						"Connect search and rule systems to later ML topics by emphasizing features, labels, evaluation, training data, and the difference between hand-authored behavior and learned behavior. Leave this unit ready to enter `Machine Learning` with better intuition."
				},
				{
					title: "Unit 7: Features, Evaluation, and Responsible AI: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 7: Features, Evaluation, and Responsible AI",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-Greedy-Search"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Search Strategy Comparison Lab",
					content:
						"Run multiple algorithms on related problems and compare memory use, runtime, and path quality. The real deliverable is the written comparison, not just the code output.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-Greedy-Search"
				},
				{
					title: "Project: Water Jug Riddle",
					content:
						"Treat a classic reasoning puzzle as an exercise in formal state definition, action generation, and evaluation. This makes it easy to discuss how small changes in representation can completely change the search behavior.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Water-Jug-Riddle"
				},
				{
					title: "Unit 7: Features, Evaluation, and Responsible AI Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 7: Features, Evaluation, and Responsible AI",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-unit-7-features-evaluation-and-responsible-ai-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-unit-7-features-evaluation-and-responsible-ai-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: Capstone and Portfolio Build",
			curriculum: [
				{
					title: "Choose a Toy AI Direction",
					content:
						"Choose a capstone direction such as a puzzle solver, game AI, rule-based recommender, or search visualizer. The scope needs enough ambition to show real thinking while staying small enough to finish cleanly."
				},
				{
					title: "Build for Explanation, Not Just Output",
					content:
						"The capstone exposes its logic through traces, notes, diagrams, or evaluation summaries. The expected outcome is an explanation of why the system made a choice and how it would fail, not just a demonstration that it runs."
				},
				{
					title: "Measure Improvement over a Baseline",
					content:
						"Every capstone compares itself to a simpler starting point: random play, uninformed search, fewer rules, or a shallower heuristic. The comparison is what makes the project feel like AI rather than a generic programming assignment."
				},
				{
					title: "Reflect on the Next Course Step",
					content:
						"Close by comparing possible next steps: `Machine Learning`, `Data Science in Python`, `AP Computer Science A`, or deeper algorithmic work such as `USACO Bronze`. Justify the next step based on the kind of thinking that was most engaging."
				},
				{
					title: "Unit 8: Capstone and Portfolio Build: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "Unit 8: Capstone and Portfolio Build",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI11-8-Puzzle-Solver"
				}
			],
			supplementalProjects: [
				{
					title: "Capstone: 8-Puzzle Solver",
					content:
						"Build a full puzzle solver that makes representation, heuristic choice, and evaluation visible. This is the natural capstone because it rewards careful modeling as much as algorithm selection.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI11-8-Puzzle-Solver"
				},
				{
					title: "Capstone Option: Maze Solver Showcase",
					content:
						"Turn the earlier maze work into a polished search visualizer or comparison tool with cleaner reporting and a stronger interface for explaining results.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Maze-Solver-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Maze-Solver"
				},
				{
					title: "Capstone Option: Marble Game Strategy Lab",
					content:
						"Promote the marble game into a stronger strategy project by comparing heuristics, search depth, and game balance over multiple runs.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI"
				}
			]
		},
		{
			title: "Unit 9: Repo Extension Bank and Canonical Variants",
			curriculum: [
				{
					title: "Optional Reinforcement versus Core Scope",
					content:
						"Treat the extra `AI-Level-1` repo folders as a structured extension bank, not as missing core lessons. The public course keeps one canonical Tic-Tac-Toe and Marble Game path visible while still exposing worthwhile extra graph, stack, and class-based practice."
				},
				{
					title: "Canonical Variants for Game AI",
					content:
						"Use `FAI7-Updated-Tic-Tac-Toe-AI` as the main optional advanced Tic-Tac-Toe follow-up and keep `FAI7-Unbeatable-Tic-Tac-Toe-AI-1` as an archive duplicate rather than a separate public requirement. Do the same for the marble-game branch by using the clean playable variant and hiding the `COPY` folder."
				},
				{
					title: "How to Use the Extra Repo Folders",
					content:
						"The optional bank below supports targeted reinforcement: class refresh, stack/queue mechanics, graph variants, and stronger game-AI comparisons. The point is discoverability without flooding the core syllabus."
				},
				{
					title: "Unit 9: Repo Extension Bank and Canonical Variants: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "AI",
						moduleTitle:
							"Unit 9: Repo Extension Bank and Canonical Variants",
						section: "verification"
					})
				},
				{
					title: "Unit 9: Repo Extension Bank and Canonical Variants: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 9: Repo Extension Bank and Canonical Variants",
						projectKind: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Special-Graphs"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: Special Graphs",
					content:
						"Use alternate graph structures and examples to strengthen representation choices before later search and heuristic work.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Special-Graphs"
				},
				{
					title: "Extension: Practice with Stacks (Reference Bank)",
					content:
						"Use the dedicated stacks folder as extra frontier-order practice when DFS mechanics still feel shaky.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Stacks"
				},
				{
					title: "Extension: BankAccount Class",
					content:
						"Keep a second lightweight class-design warmup available when object state needs more reinforcement before graph and game objects.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI1-Bank-Account-Class"
				},
				{
					title: "Extension: DFS with a Stack Class",
					content:
						"Compare the earlier DFS implementation with a more class-structured stack-based version to show the same algorithm through a cleaner API boundary.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-DFS-With-a-Stack-Class"
				},
				{
					title: "Extension: BFS with a Queue Class",
					content:
						"Use a queue-centered class version of BFS to reinforce shortest-path intuition and explicit frontier management.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI6-BFS-With-a-Queue-Class"
				},
				{
					title: "Extension: Updated Tic-Tac-Toe AI",
					content:
						"Use the updated Tic-Tac-Toe branch as the canonical optional game-tree extension beyond the main course spine.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Updated-Tic-Tac-Toe-AI"
				},
				{
					title: "Extension: Two-Player Marble Game",
					content:
						"Use the two-player marble variant as a lighter strategy and evaluation warmup before the stronger AI version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-2-Player-Marble-Game"
				}
			]
		},
		{
			title: "AI Search Lab 13: Practice Studio",
			curriculum: [
				{
					title: "AI Search Lab 13: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 13: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Practice Studio",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 13: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/solution"
				},
				{
					title: "AI Search Lab 13: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 13: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/solution"
				},
				{
					title: "Transfer Practice: AI Search Lab 13",
					content: aiSearchSupplementalContent(13, "transfer"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-applied-studio-11-ai-search-lab-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-applied-studio-11-ai-search-lab-13-supplemental-2/solution"
				},
				{
					title: "Extension Practice: AI Search Lab 13",
					content: aiSearchSupplementalContent(13, "extension"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-06-applied-studio-11-ai-search-lab-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-06-applied-studio-11-ai-search-lab-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "AI Search Lab 14: Practice Studio",
			curriculum: [
				{
					title: "AI Search Lab 14: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 14: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Practice Studio",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 14: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/solution"
				},
				{
					title: "AI Search Lab 14: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 14: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/solution"
				},
				{
					title: "Transfer Practice: AI Search Lab 14",
					content: aiSearchSupplementalContent(14, "transfer"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-07-applied-studio-12-ai-search-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-07-applied-studio-12-ai-search-lab-14-supplemental-2/solution"
				},
				{
					title: "Extension Practice: AI Search Lab 14",
					content: aiSearchSupplementalContent(14, "extension"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-08-applied-studio-12-ai-search-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-08-applied-studio-12-ai-search-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "AI Search Lab 15: Practice Studio",
			curriculum: [
				{
					title: "AI Search Lab 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Practice Studio",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/solution"
				},
				{
					title: "AI Search Lab 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/solution"
				},
				{
					title: "Transfer Practice: AI Search Lab 15",
					content: aiSearchSupplementalContent(15, "transfer"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-09-applied-studio-13-ai-search-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-09-applied-studio-13-ai-search-lab-15-supplemental-2/solution"
				},
				{
					title: "Extension Practice: AI Search Lab 15",
					content: aiSearchSupplementalContent(15, "extension"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-10-applied-studio-13-ai-search-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-10-applied-studio-13-ai-search-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "AI Search Lab 16: Practice Studio",
			curriculum: [
				{
					title: "AI Search Lab 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Practice Studio",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/solution"
				},
				{
					title: "AI Search Lab 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/solution"
				},
				{
					title: "Transfer Practice: AI Search Lab 16",
					content: aiSearchSupplementalContent(16, "transfer"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-11-applied-studio-14-ai-search-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-11-applied-studio-14-ai-search-lab-16-supplemental-2/solution"
				},
				{
					title: "Extension Practice: AI Search Lab 16",
					content: aiSearchSupplementalContent(16, "extension"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-12-applied-studio-14-ai-search-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-12-applied-studio-14-ai-search-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "AI Search Lab 17: Practice Studio",
			curriculum: [
				{
					title: "AI Search Lab 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Practice Studio",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/solution"
				},
				{
					title: "AI Search Lab 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/solution"
				},
				{
					title: "Transfer Practice: AI Search Lab 17",
					content: aiSearchSupplementalContent(17, "transfer"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-13-applied-studio-15-ai-search-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-13-applied-studio-15-ai-search-lab-17-supplemental-2/solution"
				},
				{
					title: "Extension Practice: AI Search Lab 17",
					content: aiSearchSupplementalContent(17, "extension"),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-14-applied-studio-15-ai-search-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-14-applied-studio-15-ai-search-lab-17-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unbeatable TicTacToe AI 1: Practice Studio",
			curriculum: [
				{
					title: "Unbeatable TicTacToe AI 1: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Unbeatable TicTacToe AI 1: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Unbeatable TicTacToe AI 1: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Practice Studio",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Unbeatable-Tic-Tac-Toe-AI-1"
				},
				{
					title: "Unbeatable TicTacToe AI 1: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Unbeatable TicTacToe AI 1: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Practice Studio",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Unbeatable-Tic-Tac-Toe-AI-1"
				},
				{
					title: "Unbeatable TicTacToe AI 1 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-15-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-15-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-2/solution"
				},
				{
					title: "Unbeatable TicTacToe AI 1 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-16-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-16-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "The Marble Game AI: Practice Studio",
			curriculum: [
				{
					title: "The Marble Game AI: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "The Marble Game AI: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Practice Studio",
						section: "example"
					})
				},
				{
					title: "The Marble Game AI: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Practice Studio",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI-Copy"
				},
				{
					title: "The Marble Game AI: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "The Marble Game AI: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Practice Studio",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI-Copy"
				},
				{
					title: "Transfer Practice: The Marble Game AI",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-17-applied-studio-17-the-marble-game-ai-copy-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-17-applied-studio-17-the-marble-game-ai-copy-supplemental-2/solution"
				},
				{
					title: "Extension Practice: The Marble Game AI",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-18-applied-studio-17-the-marble-game-ai-copy-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-18-applied-studio-17-the-marble-game-ai-copy-supplemental-3/solution"
				}
			]
		}
	]
};

interface AiLevel1FlowConfig {
	title: string;
	estimatedTime: string;
	keyBlocks: string[];
	projectThread: string;
}

const AI_LEVEL_1_FLOW: AiLevel1FlowConfig[] = [
	{
		title: "FAI0 Setup and Tooling",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"Python environment",
			"state / action / goal",
			"graph package",
			"experiment log",
			"reproducible run"
		],
		projectThread:
			"Establish one reproducible graph-and-search workspace and a short experiment-log format. Refresh objects only when the state model shows a concrete prerequisite gap."
	},
	{
		title: "Unit 1: AI Landscape and State Representation",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: ["state", "action", "goal test", "path cost", "node / edge"],
		projectThread:
			"Translate a plain-language problem into explicit states, actions, goals, and costs before coding. Build one inspectable graph model that later searches can reuse."
	},
	{
		title: "Unit 2: Stacks, Queues, and Traversal Intuition",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"frontier",
			"stack LIFO",
			"queue FIFO",
			"push / pop",
			"hand trace"
		],
		projectThread:
			"Trace the same graph with a stack and queue so frontier order becomes visible. Do not introduce search names until the exploration order can be predicted by hand."
	},
	{
		title: "Unit 3: DFS, BFS, and Reachability",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"DFS",
			"BFS",
			"visited set",
			"parent map",
			"path reconstruction"
		],
		projectThread:
			"Implement DFS and BFS from the same state representation, record visited order and parent links, and distinguish reachability from unweighted shortest-path guarantees."
	},
	{
		title: "AI Search Lab 13: Practice Studio",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"frontier size",
			"visited order",
			"parent link",
			"reconstructed path",
			"trace explanation"
		],
		projectThread:
			"Instrument one uninformed search so the frontier, visited set, parent map, and final path can be inspected. Use the trace to separate algorithm behavior from implementation bugs."
	},
	{
		title: "Unit 4: Informed and Bounded Search",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"depth limit",
			"priority queue",
			"path cost g",
			"heuristic h",
			"A* score f"
		],
		projectThread:
			"Introduce limits, costs, and heuristics as separate changes to frontier policy. Compare completeness, optimality, repeated work, and assumptions rather than ranking algorithms by speed alone."
	},
	{
		title: "AI Search Lab 14: Practice Studio",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"depth cutoff",
			"missed goal",
			"iterative deepening",
			"repeated work",
			"stop condition"
		],
		projectThread:
			"Stress depth-limited search with goals above, at, and below the cutoff, then compare iterative deepening. The lab must record both missed-state risk and repeated work."
	},
	{
		title: "AI Search Lab 15: Practice Studio",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"uniform-cost search",
			"priority queue",
			"g / h / f",
			"weighted edge",
			"admissible heuristic"
		],
		projectThread:
			"Trace uniform-cost and A* accounting on a weighted graph, including queue priorities and final path cost. Check an admissible and intentionally bad heuristic."
	},
	{
		title: "AI Search Lab 16: Practice Studio",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"greedy search",
			"A* search",
			"misleading heuristic",
			"path cost",
			"comparison evidence"
		],
		projectThread:
			"Compare greedy and A* on a case where the locally attractive route is not cheapest. Explain the tradeoff from trace evidence rather than from the final path alone."
	},
	{
		title: "Unit 5: Rule-Based Systems and Puzzle Framing",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"rule",
			"constraint",
			"state tracker",
			"feature",
			"rules vs search"
		],
		projectThread:
			"Model a small rule system and a puzzle state explicitly, then justify whether direct rules or search better fit each behavior. Keep rule firing and state changes inspectable."
	},
	{
		title: "Unit 6: Heuristics and Game AI",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"game tree",
			"random baseline",
			"evaluation function",
			"tie breaking",
			"stress position"
		],
		projectThread:
			"Start with random play as a baseline, then add one explainable evaluation rule. Compare outcomes and failure positions before calling a strategy stronger."
	},
	{
		title: "AI Search Lab 17: Practice Studio",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"game state",
			"legal action",
			"score heuristic",
			"baseline comparison",
			"decision log"
		],
		projectThread:
			"Evaluate one game or puzzle search against a baseline, log candidate scores and decisions, and stress the heuristic with a position chosen to expose its limitation."
	},
	{
		title: "Unbeatable TicTacToe AI 1: Practice Studio",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"board state",
			"legal move",
			"minimax or complete search",
			"win / block / tie",
			"strategy test"
		],
		projectThread:
			"Build Tic-Tac-Toe AI in stages: legal board loop, random baseline, win and block rules, then complete search if used. Test forced wins, forced blocks, forks, ties, and invalid moves."
	},
	{
		title: "The Marble Game AI: Practice Studio",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"pile state",
			"legal move",
			"terminal state",
			"evaluation rule",
			"baseline result"
		],
		projectThread:
			"Represent the marble game independently from its strategy, verify legal and terminal states, then compare the chosen policy with random play and at least one adversarial position."
	},
	{
		title: "Unit 7: Features, Evaluation, and Responsible AI",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"feature",
			"benchmark",
			"failure slice",
			"bias",
			"uncertainty"
		],
		projectThread:
			"Evaluate systems with named success criteria, baseline comparisons, and failure slices. Separate measured behavior from broad claims and document bias, uncertainty, and representation limits."
	},
	{
		title: "Unit 8: Capstone and Portfolio Build",
		estimatedTime: "6–10 sessions · 45–60 minutes each",
		keyBlocks: [
			"scope lock",
			"baseline",
			"decision trace",
			"stress test",
			"portfolio explanation"
		],
		projectThread:
			"Choose a finishable toy-AI problem, ship a minimum working baseline, add one justified improvement, and compare results on ordinary and adversarial cases before portfolio polish."
	}
];

const AI_LEVEL_1_CHALLENGE_TITLE_RE =
	/extension|unbeatable|marble game|compare|greedy search|maze solver|airports|two-player|updated/i;

function aiLevel1SupplementalPath(
	item: Pick<RawCourseModuleItem, "title">
): CourseItemLearningPath {
	return AI_LEVEL_1_CHALLENGE_TITLE_RE.test(item.title)
		? "challenge"
		: "choice";
}

function configureAiLevel1Module(
	module: RawCourseModule,
	config: AiLevel1FlowConfig
) {
	for (const item of module.curriculum) item.learningPath = "core";
	for (const item of module.supplementalProjects) {
		item.learningPath = aiLevel1SupplementalPath(item);
	}
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

function configureAiExtensionBank(module: RawCourseModule) {
	module.kind = "appendix";
	delete module.estimatedTime;
	delete module.keyBlocks;
	for (const item of module.curriculum) {
		item.learningPath = aiLevel1SupplementalPath(item);
	}
	for (const item of module.supplementalProjects) {
		item.learningPath = aiLevel1SupplementalPath(item);
	}
	if (module.curriculum[0]) {
		module.curriculum[0].content = [
			"**Optional reference bank:** Use these variants only after the core search, evaluation, and capstone path is complete or when a specific prerequisite needs reinforcement.",
			module.curriculum[0].content
		].join("\n\n");
	}
	return module;
}

function configureAiLevel1Flow(course: RawCourse) {
	const modulesByTitle = new Map(
		course.modules.map(module => [module.title, module])
	);
	const teachingModules = AI_LEVEL_1_FLOW.map(config => {
		const module = modulesByTitle.get(config.title);
		if (!module) {
			throw new Error(`AI Level 1 flow is missing ${config.title}.`);
		}
		return configureAiLevel1Module(module, config);
	});
	const extensionBank = modulesByTitle.get(
		"Unit 9: Repo Extension Bank and Canonical Variants"
	);
	if (!extensionBank) {
		throw new Error(
			"AI Level 1 flow is missing the repository extension bank."
		);
	}
	course.modules = [
		...teachingModules,
		configureAiExtensionBank(extensionBank)
	];
}

configureAiLevel1Flow(aiLevel1Course);
