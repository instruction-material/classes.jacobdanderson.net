import type { RawCourse, RawCourseModuleItem } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";
import { placeGoldSetupProjects } from "./usacoGoldSetupPlacement";

const usacoGoldPendingSourceAssets = ["treasure.txt"] as const;

function pendingUsacoGoldAssetList(filenames: readonly string[]) {
	return filenames
		.map(
			filename =>
				`- ${staticMediaUrl(filename)}\n\n${pendingStaticMediaNotice(filename)}`
		)
		.join("\n\n");
}

const usacoGoldSourceCourse: RawCourse = {
	name: "USACO Gold",
	modules: [
		{
			title: "USG0 Setup and Gold Mindset",
			curriculum: [
				{
					title: "Gold as Algorithmic Structure",
					content:
						"Frame Gold as the tier where dynamic programming, graph optimization, MSTs, Dijkstra-style shortest paths, Fenwick trees, and more formal invariants become normal. Expect fewer purely literal simulations and more algorithmic compression of the problem."
				},
				{
					title: "Implementation Discipline at Higher Complexity",
					content:
						"Use careful naming, helper methods, and meaningful intermediate checks. Gold problems often have an elegant core idea that becomes fragile if the implementation is rushed or opaque."
				},
				{
					title: "From Pattern Recognition to Proof Sketches",
					content:
						"Use short proof sketches for why a DP transition, greedy choice, or graph method is valid. Gold work rewards the ability to justify the method, not just to recall one."
				},
				{
					title: "Read Constraints as Design Signals",
					content:
						"Use input limits to narrow the candidate solution family quickly. At Gold level, the constraints often tell you more than the story paragraph does."
				},
				{
					title: "USG0 Setup and Gold Mindset: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "USG0 Setup and Gold Mindset",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Gold Log: Setup and Gold Mindset",
					content:
						"Keep a compact Gold-level log for setup and gold mindset that records the core recurrence or invariant, one discarded approach, and one note about which constraint or invariant most clearly signals the right solution family. Gold progress depends on being able to explain the structure of a solution, not just implement it.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube/solution"
				},
				{
					title: "Why Did the Cow Cross the Road III",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Why Did the Cow Cross the Road III",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG24-Why-Did-the-Cow-Cross-the-Road-III/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG24-Why-Did-the-Cow-Cross-the-Road-III/solution"
				},
				{
					title: "Snow Boots",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Snow Boots",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG27-Snow-Boots/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG27-Snow-Boots/solution"
				}
			]
		},
		{
			title: "Unit 1: Dynamic Programming Foundations",
			curriculum: [
				{
					title: "State Design and Recurrence Thinking",
					content:
						"Define a DP state so that each smaller answer supports a larger one cleanly. The most important Gold habit here is choosing the right subproblem, not coding the table quickly."
				},
				{
					title: "Transitions, Base Cases, and Ordering",
					content:
						"State how each DP cell depends on earlier work and in what order the states can be computed. The recurrence is explainable in plain language before it is translated into code."
				},
				{
					title: "Space and Time Tradeoffs",
					content:
						"This section develops when a DP can be compressed, when it cannot, and how to reason about whether a recurrence is actually feasible under the given limits."
				},
				{
					title: "Recognize DP in the Wild",
					content:
						"Compare several problem statements that look unrelated on the surface but collapse into the same state-transition mindset once the structure is exposed."
				},
				{
					title: "Unit 1: Dynamic Programming Foundations: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Unit 1: Dynamic Programming Foundations",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Dynamic Programming with Fibonacci",
					content:
						"Use a simple recurrence to make the DP mindset explicit before harder state spaces are introduced. The checkpoint is not the Fibonacci answer itself, but the ability to name the state, base cases, transition, evaluation order, and improvement from repeated recursion to stored subproblems.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci/solution"
				},
				{
					title: "Problem: 0-1 Knapsack",
					content:
						"Use a classic optimization recurrence to practice state design, choices, and table updates. Define whether each state means best value after considering items, remaining capacity, or used capacity, then explain why each item creates exactly two choices: take it or skip it.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-0-1-Knapsack/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-0-1-Knapsack/solution"
				},
				{
					title: "Problem: Teamwork",
					content:
						"Use grouped decisions and transition design to move beyond the most basic DP templates. The solution describes how a final group is chosen, how that group affects score, and why checking bounded group lengths keeps the recurrence feasible.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG3-Teamwork/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG3-Teamwork/solution"
				},
				{
					title: "Problem: Fruit Feast",
					content:
						"Use a state-space DP problem to test whether reachable states and transitions can be managed without losing clarity.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG40-Fruit-Feast/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG40-Fruit-Feast/solution"
				}
			]
		},
		{
			title: "Unit 2: Shortest Paths and Weighted Graphs",
			curriculum: [
				{
					title: "Weighted Graph Modeling",
					content:
						"Identify what the nodes and edges actually represent in a weighted setting. Gold shortest-path work becomes much easier when the model is precise before Dijkstra's algorithm is even considered."
				},
				{
					title: "Dijkstra's Algorithm and Relaxation",
					content:
						"This section develops Dijkstra as repeated relaxation over the currently cheapest frontier. The priority queue matters because it preserves the cheapest-frontier invariant, and nonnegative weights make that invariant valid."
				},
				{
					title: "Use Distance Information Strategically",
					content:
						"Move beyond 'compute the shortest paths' and show how those distances become ingredients in a second layer of reasoning. This is where Gold graph problems start to feel richer than Silver traversal."
				},
				{
					title: "Be Explicit about Complexity",
					content:
						"State how many nodes, edges, and priority-queue operations the approach entails. Gold graph work demands a clearer sense of cost."
				},
				{
					title: "Unit 2: Shortest Paths and Weighted Graphs: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Unit 2: Shortest Paths and Weighted Graphs",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Dijkstra's Algorithm",
					content:
						"Use a direct shortest-path implementation to make priority-queue relaxation fully concrete. Track distance estimates, stale queue entries, and edge relaxations explicitly, then explain why nonnegative weights allow the smallest queued distance to become final.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm/solution"
				},
				{
					title: "Problem: Shortcut",
					content:
						"Use shortest-path information inside a second optimization question so distance arrays become tools, not endpoints. After building shortest-path structure, reason about how many cows use each path segment and which shortcut location creates the largest time savings.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG11-Shortcut/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG11-Shortcut/solution"
				},
				{
					title: "Problem: Fine Dining",
					content:
						"Use a more layered graph task to test whether shortest-path ideas can be adapted to a richer condition set.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG30-Fine-Dining/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG30-Fine-Dining/solution"
				},
				{
					title: "Why Did the Cow Cross the Road II",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Unit 2: Shortest Paths and Weighted Graphs",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG31-Why-Did-the-Cow-Cross-the-Road-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG31-Why-Did-the-Cow-Cross-the-Road-II/solution"
				}
			]
		},
		{
			title: "Unit 3: MSTs, DSU, and Connectivity Optimization",
			curriculum: [
				{
					title: "Minimum Spanning Tree Intuition",
					content:
						"This section develops MSTs as the cheapest way to connect everything under the given edge structure. State the objective clearly before memorizing Kruskal or Prim."
				},
				{
					title: "Disjoint Set Union as a Connectivity Tool",
					content:
						"Use DSU to support fast connectivity checks while edges are considered in sorted order. The important idea is the role of union-find in the larger algorithmic plan."
				},
				{
					title: "Edge Ordering and Greedy Validity",
					content:
						"Explain why the chosen next edge is safe. This is an important place to practice small proof sketches for greedy algorithms."
				},
				{
					title: "Connectivity Problems beyond the Template",
					content:
						"Compare direct MST tasks with problems that use connectivity ideas in disguised forms. Build a wider pattern library than a single named algorithm."
				},
				{
					title: "Unit 3: MSTs, DSU, and Connectivity Optimization: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Unit 3: MSTs, DSU, and Connectivity Optimization",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: MST",
					content:
						"Use a direct MST implementation to practice sorted edges, cycle avoidance, and connection cost reasoning. The explanation names the objective, shows why adding a cycle cannot help, and connects the sorted-edge process to the cheapest safe next choice.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST/solution"
				},
				{
					title: "Problem: Disjoint Sets and Kruskal's",
					content:
						"Use a dedicated DSU and Kruskal exercise to make the structure and proof idea explicit. Implement find and union with clear component meaning, then use the DSU state to justify exactly when an edge connects two components versus creating a cycle.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG19-Disjoint-Sets-and-Kruskals/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG19-Disjoint-Sets-and-Kruskals/solution"
				},
				{
					title: "Problem: Moocast",
					content:
						"Use a connectivity optimization problem that turns graph reachability and distance structure into a stronger Gold-style challenge. Model power or distance as an edge threshold, test connectivity under that threshold, and explain how the search or MST view finds the minimum sufficient value.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG17-Moocast/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG17-Moocast/solution"
				}
			]
		},
		{
			title: "Unit 4: Fenwick Trees, Ordering, and Range Structure",
			curriculum: [
				{
					title: "Prefix Structure beyond Simple Arrays",
					content:
						"Move from simple prefix sums into update-friendly structures when the problem demands repeated changes and queries. The point is to keep the range intuition while upgrading the data structure."
				},
				{
					title: "Fenwick Tree Mechanics",
					content:
						"Make the Fenwick tree implementation meaningful by explaining what each node aggregates and why the lowbit jumps work. Do not treat the structure as a magic snippet."
				},
				{
					title: "Ordering Problems with Hidden Statistics",
					content:
						"Use sorted order, inversion-like thinking, and relative positions to solve problems that are really about where elements sit with respect to one another."
				},
				{
					title: "Choose the Smallest Structure that Works",
					content:
						"Compare direct arrays, prefix sums, Fenwick trees, and sorting passes to distinguish when a heavier data structure is necessary and when it is just extra complexity."
				},
				{
					title: "Unit 4: Fenwick Trees, Ordering, and Range Structure: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Unit 4: Fenwick Trees, Ordering, and Range Structure",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Binary Indexed Tree / Fenwick Tree",
					content:
						"Build a direct Fenwick tree checkpoint that connects the data structure to concrete prefix-query behavior. The solution explains what each internal index stores, why lowbit moves to the next responsible range, and how updates and prefix queries stay logarithmic.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree/solution"
				},
				{
					title: "Problem: Balanced Photo",
					content:
						"Use relative ordering and imbalance counts to practice range-style reasoning around positions. Count taller cows to the left and right of each cow with an ordered or Fenwick-style structure, then state the imbalance condition precisely before tallying the answer.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG23-Balanced-Photo/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG23-Balanced-Photo/solution"
				},
				{
					title: "Problem: Out of Sorts",
					content:
						"Use the Gold modified bubble algorithm: each iteration makes a forward adjacent-swap sweep, a backward sweep, then an adjacency check, and runs at least once. Retain stable order for equal values. Mark the original positions of the smallest k values and count the desired left-side values still across each cut; the maximum cut requirement, with a minimum of one, gives the iteration count.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG26-Out-of-Sorts/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG26-Out-of-Sorts/solution"
				},
				{
					title: "Circular Barn",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Unit 4: Fenwick Trees, Ordering, and Range Structure",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG37-Circular-Barn/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG37-Circular-Barn/solution"
				}
			]
		},
		{
			title: "Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems",
			curriculum: [
				{
					title: "Model the Right Nodes, Not the Obvious Ones",
					content:
						"Gold graph problems often depend on a less obvious graph representation than the story first suggests. Redesign the graph until the algorithm fits naturally."
				},
				{
					title: "Combine Structure with Optimization",
					content:
						"Use problems where the graph is only part of the story and a second objective or geometric constraint changes how the solution must be built."
				},
				{
					title: "Keep Spatial Reasoning Precise",
					content:
						"Whether the task involves geometry, movement, or mirrored structures, keep diagrams and coordinate reasoning explicit instead of relying on intuition alone."
				},
				{
					title: "Know When the Model Is the Real Challenge",
					content:
						"Make it clear that some Gold problems are hard not because the algorithm is exotic, but because finding the right representation takes real thought."
				},
				{
					title: "Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Lasers and Mirrors",
					content:
						"Use a spatially flavored graph problem to practice turning geometry into a graph you can actually search. Treat shared rows and columns as transitions, search mirror changes rather than every coordinate step, and verify that the graph model preserves the meaning of a reflection.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors/solution"
				},
				{
					title: "Problem: Lights Out",
					content:
						"Use geometric structure and path reasoning to test whether multiple interpretations of distance and position stay aligned. Compare path signatures around the polygon, determine when a position becomes uniquely identifiable, and connect that ambiguity to the extra distance traveled.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG35-Lights-Out/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG35-Lights-Out/solution"
				},
				{
					title: "Problem: Circular Barn Revisited",
					content:
						"Use a more involved structural problem to push representation and optimization thinking together. Break the circular dependency deliberately, define the DP state for doors and covered segments, and justify how rotation choices or preprocessing keep the recurrence consistent.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG36-Circular-Barn-Revisited/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG36-Circular-Barn-Revisited/solution"
				}
			]
		},
		{
			title: "Unit 6: Advanced DP and Combinatorics",
			curriculum: [
				{
					title: "DP beyond the First Table",
					content:
						"Gold DP often involves richer transitions, combinatorial counts, or less obvious state compressions. The key is still the same: define the right subproblem first."
				},
				{
					title: "Count Carefully, Mod Carefully",
					content:
						"When combinatorics enters the picture, be precise about what is being counted, what constraints remain, and how modular arithmetic interacts with the recurrence."
				},
				{
					title: "Blend Math Insight with Algorithm Design",
					content:
						"Use these problems to show that mathematical structure and algorithmic structure often reinforce each other. A clean count or recurrence can completely change what looks feasible."
				},
				{
					title: "Explain the Transition in Words",
					content:
						"Explain every DP transition or combinatorial term in a sentence. If the explanation is not clear, the implementation is probably ahead of the understanding."
				},
				{
					title: "Unit 6: Advanced DP and Combinatorics: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Unit 6: Advanced DP and Combinatorics",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Cow Poetry",
					content:
						"Use combinatorial counting and dynamic programming together in a problem where explanation matters as much as implementation. Compute syllable-count possibilities, group words by rhyme class, and explain how the poem pattern multiplies choices without double-counting equivalent rhyme assignments.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry/solution"
				},
				{
					title: "Problem: Stamp Painting",
					content:
						"Use a counting DP problem to practice recurrence design under modular arithmetic constraints. State what is counted directly and what is easier to subtract, keep the recurrence compatible with modular arithmetic, and test tiny lengths where manual counting is possible.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG32-Stamp-Painting/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG32-Stamp-Painting/solution"
				},
				{
					title: "Problem: Time is Mooney",
					content:
						"Use a richer optimization problem that blends repeated transitions and scoring over time. Define the state by city and day, update scores along directed edges, and explain the stopping bound so the search does not become an unbounded walk.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Time-is-Mooney/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Time-is-Mooney/solution"
				},
				{
					title: "Problem: Milk Visits",
					content:
						"Use a stronger capstone-style problem to test whether multiple Gold ideas can be held together in one coherent solution.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Milk-Visits/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Milk-Visits/solution"
				}
			]
		},
		{
			title: "Unit 7: Gold Capstone Sets",
			curriculum: [
				{
					title: "Mix Families on Purpose",
					content:
						"Practice sets that force a choice among DP, graph optimization, range structures, and combinatorial reasoning. Gold readiness is as much about classification speed as raw implementation skill."
				},
				{
					title: "Write Proof Sketches and Design Notes",
					content:
						"Include a short explanation of the invariant, recurrence, or greedy safety argument behind each serious Gold solution. This turns solved problems into reusable knowledge rather than isolated wins."
				},
				{
					title: "Identify Personal Strengths and Gaps",
					content:
						"Use the capstone sets to diagnose which Gold families are strongest and which still need targeted work. That diagnosis matters more than the number of problems completed."
				},
				{
					title: "Prepare for Independent Gold and Beyond",
					content:
						"Close by positioning the path toward continued Gold training, open contest prep, or deeper systems and algorithms coursework. The outcome is a stronger internal map of advanced problem types."
				},
				{
					title: "Unit 7: Gold Capstone Sets: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Unit 7: Gold Capstone Sets",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Radio Contact",
					content:
						"Use a capstone-style state problem that blends movement and optimization in a way that rewards careful representation. Model the state as how many moves each route has consumed, compare the three possible next-step choices, and verify the energy calculation at synchronized and unsynchronized positions.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact/solution"
				},
				{
					title: "Problem: Cowpatibility",
					content:
						"Use a richer counting or combinatorial problem as one more test of explanation and implementation discipline. Count shared flavor subsets with inclusion-exclusion, explain why subset size changes the sign, and validate the final incompatible count by subtracting compatible pairs from all pairs.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG29-Cowpatibility/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG29-Cowpatibility/solution"
				},
				{
					title: "Bovine Genomics",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Unit 7: Gold Capstone Sets",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG38-Bovine-Genomics/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG38-Bovine-Genomics/solution"
				}
			]
		},
		{
			title: "Unit 8: Optional Gold Problem Bank",
			curriculum: [
				{
					title: "Why Gold Needs a Bigger Library",
					content:
						"The `USACO-Gold` repo is broader than the main course by design. A larger technique-indexed library supports pattern recognition at this level because advanced classification depends on seeing many structurally similar problems."
				},
				{
					title: "Advanced DP and Optimization Bank",
					content:
						"Optional DP-heavy and optimization folders include `UG1 Dynamic Programming Practice`, `UG1 Hoof Paper Scissors`, `UG2 Talent Show`, `UG4 Cow Checklist`, `UG5 Marathon`, `UG6 248`, `UG7 Treasure Chest`, and `UG8 Bookshelf`."
				},
				{
					title: "Graph, MST, and Shortest-Path Extensions",
					content:
						"Optional graph-heavy extensions include `UG10 Roadblock`, `UG12/UG24/UG31 Why Did the Cow Cross the Road`, `UG13 Cow Routing`, `UG14 MST II`, `UG15 Superbull`, `UG16 Watering the Fields`, `UG18 I Would Walk 500 Miles`, `UG20 Fenced In`, `UG21 MooTube`, and `UG9 Dijkstra's Algorithm II`."
				},
				{
					title: "Late Gold Counting and Structure Bank",
					content:
						"Additional late-Gold folders include `UG25 Sleepy Cow Sorting`, `UG27 Snow Boots`, `UG28 Cow Poetry`, `UG29 Cowpatibility`, `UG32 Stamp Painting`, `UG36 Circular Barn Revisited`, `UG37 Circular Barn`, `UG38 Bovine Genomics`, `UG-Milk-Visits`, and `UG-Time-is-Mooney`."
				},
				{
					title: "Unit 8: Optional Gold Problem Bank: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Unit 8: Optional Gold Problem Bank",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Problem Bank: Full Gold Repo",
					content:
						"Browse the full Gold repo library when the core sequence is not enough and you want the wider advanced-problem inventory.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main"
				},
				{
					title: "Problem: Roadblock",
					content:
						"Use shortest-path sensitivity analysis to deepen understanding of weighted-graph optimization. Start with the original shortest path, test how doubling each edge on that path changes the result, and explain why edges outside the chosen path do not need the same brute-force treatment.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG10-Roadblock/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG10-Roadblock/solution"
				},
				{
					title: "Problem: Superbull",
					content:
						"Use an MST-style optimization problem as a stronger extension of connectivity and edge-choice reasoning. Translate team pair scores into complete-graph edge weights, choose a maximum spanning tree rather than a minimum one, and justify why connecting all teams once captures the tournament objective.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG15-Superbull/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG15-Superbull/solution"
				},
				{
					title: "Problem: Fenced In",
					content:
						"Use a richer connectivity and cost-optimization problem to strengthen MST and graph-structure judgment. Convert fence gaps into grid edge costs, reason about repeated horizontal and vertical connections, and connect the optimized construction to MST principles without materializing unnecessary edges.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG20-Fenced-In/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG20-Fenced-In/solution"
				},
				{
					title: "Problem: Sleepy Cow Sorting",
					content:
						"Use a strong ordering and invariants problem to test whether the work can reason about progress without brute force.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG25-Sleepy-Cow-Sorting/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG25-Sleepy-Cow-Sorting/solution"
				}
			]
		},
		{
			title: "Dynamic Programming Practice: Practice Studio",
			curriculum: [
				{
					title: "Dynamic Programming Practice: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Dynamic Programming Practice: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Dynamic Programming Practice: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Dynamic Programming Practice: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Dynamic Programming Practice: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Dynamic Programming Practice: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice/solution"
				},
				{
					title: "Dynamic Programming Practice: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Dynamic Programming Practice: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Dynamic Programming Practice: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Dynamic Programming Practice: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice/solution"
				},
				{
					title: "Cow Checklist",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Dynamic Programming Practice: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG4-Cow-Checklist/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG4-Cow-Checklist/solution"
				},
				{
					title: "Marathon",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Dynamic Programming Practice: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG5-Marathon/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG5-Marathon/solution"
				}
			]
		},
		{
			title: "Hoof Paper Scissors: Practice Studio",
			curriculum: [
				{
					title: "Hoof Paper Scissors: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Hoof Paper Scissors: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Hoof Paper Scissors: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors/solution"
				},
				{
					title: "Hoof Paper Scissors: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Hoof Paper Scissors: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors/solution"
				},
				{
					title: "248",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG6-248/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG6-248/solution"
				},
				{
					title: "Treasure Chest",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG7-Treasure-Chest/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG7-Treasure-Chest/solution"
				}
			]
		},
		{
			title: "Why Did the Cow Cross the Road: Practice Studio",
			curriculum: [
				{
					title: "Why Did the Cow Cross the Road: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Why Did the Cow Cross the Road: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Why Did the Cow Cross the Road: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road/solution"
				},
				{
					title: "Why Did the Cow Cross the Road: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Why Did the Cow Cross the Road: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road/solution"
				},
				{
					title: "Bookshelf",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG8-Bookshelf/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG8-Bookshelf/solution"
				},
				{
					title: "Dijkstras Algorithm II",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm-II/solution"
				}
			]
		},
		{
			title: "Cow Routing: Practice Studio",
			curriculum: [
				{
					title: "Cow Routing: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Cow Routing: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Cow Routing: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Cow Routing: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Cow Routing: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Cow Routing: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing/solution"
				},
				{
					title: "Cow Routing: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Cow Routing: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Cow Routing: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Cow Routing: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing/solution"
				},
				{
					title: "Cow Routing Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Cow Routing: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-01-applied-studio-13-cow-routing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-01-applied-studio-13-cow-routing-supplemental-2/solution"
				},
				{
					title: "Cow Routing Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Cow Routing: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-02-applied-studio-13-cow-routing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-02-applied-studio-13-cow-routing-supplemental-3/solution"
				}
			]
		},
		{
			title: "MST II: Practice Studio",
			curriculum: [
				{
					title: "MST II: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "MST II: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "MST II: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "MST II: Practice Studio",
						section: "example"
					})
				},
				{
					title: "MST II: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "MST II: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II/solution"
				},
				{
					title: "MST II: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "MST II: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "MST II: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "MST II: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II/solution"
				},
				{
					title: "MST II Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "MST II: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-03-applied-studio-14-mst-ii-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-03-applied-studio-14-mst-ii-supplemental-2/solution"
				},
				{
					title: "MST II Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "MST II: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-04-applied-studio-14-mst-ii-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-04-applied-studio-14-mst-ii-supplemental-3/solution"
				}
			]
		},
		{
			title: "Watering the Fields: Practice Studio",
			curriculum: [
				{
					title: "Watering the Fields: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Watering the Fields: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Watering the Fields: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Watering the Fields: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Watering the Fields: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Watering the Fields: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields/solution"
				},
				{
					title: "Watering the Fields: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Watering the Fields: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Watering the Fields: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Watering the Fields: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields/solution"
				},
				{
					title: "Watering the Fields Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Watering the Fields: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-05-applied-studio-15-watering-the-fields-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-05-applied-studio-15-watering-the-fields-supplemental-2/solution"
				},
				{
					title: "Watering the Fields Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Watering the Fields: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-06-applied-studio-15-watering-the-fields-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-06-applied-studio-15-watering-the-fields-supplemental-3/solution"
				}
			]
		},
		{
			title: "I Would Walk 500 Miles: Practice Studio",
			curriculum: [
				{
					title: "I Would Walk 500 Miles: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "I Would Walk 500 Miles: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "I Would Walk 500 Miles: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "I Would Walk 500 Miles: Practice Studio",
						section: "example"
					})
				},
				{
					title: "I Would Walk 500 Miles: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "I Would Walk 500 Miles: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles/solution"
				},
				{
					title: "I Would Walk 500 Miles: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "I Would Walk 500 Miles: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "I Would Walk 500 Miles: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "I Would Walk 500 Miles: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles/solution"
				},
				{
					title: "I Would Walk 500 Miles Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "I Would Walk 500 Miles: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-07-applied-studio-16-i-would-walk-500-miles-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-07-applied-studio-16-i-would-walk-500-miles-supplemental-2/solution"
				},
				{
					title: "I Would Walk 500 Miles Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "I Would Walk 500 Miles: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-08-applied-studio-16-i-would-walk-500-miles-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-08-applied-studio-16-i-would-walk-500-miles-supplemental-3/solution"
				}
			]
		},
		{
			title: "Talent Show: Practice Studio",
			curriculum: [
				{
					title: "Talent Show: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Talent Show: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Talent Show: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Talent Show: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Talent Show: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Talent Show: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show/solution"
				},
				{
					title: "Talent Show: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Talent Show: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Talent Show: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Talent Show: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show/solution"
				},
				{
					title: "Talent Show Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Talent Show: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-09-applied-studio-17-talent-show-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-09-applied-studio-17-talent-show-supplemental-2/solution"
				},
				{
					title: "Talent Show Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Gold",
						moduleTitle: "Talent Show: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-10-applied-studio-17-talent-show-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-10-applied-studio-17-talent-show-supplemental-3/solution"
				}
			]
		},
		{
			kind: "appendix",
			title: "Pending Static Assets",
			curriculum: [
				{
					title: "USACO Gold Asset Status",
					content: [
						"This course lists the pending data file below. The entry keeps a stable static media URL so the matching file can be added without changing course links.",
						pendingUsacoGoldAssetList(usacoGoldPendingSourceAssets)
					].join("\n\n")
				}
			],
			supplementalProjects: []
		}
	]
};

const USACO_GOLD_CONTESTS = "https://usaco.org/index.php?page=contests";
const USACO_GOLD_RULES = "https://usaco.org/index.php?page=instructions";
const USACO_GOLD_DETAILS = "https://usaco.org/index.php?page=details";
const USACO_GOLD_GUIDE = "https://usaco.guide/gold";
const USACO_GOLD_RANGE_GUIDE =
	"https://usaco.guide/gold/point-update-range-sum";
const USACO_GOLD_EULER_GUIDE = "https://usaco.guide/gold/tree-euler";
const USACO_GOLD_TREE_DP_GUIDE = "https://usaco.guide/gold/dp-trees";
const USACO_GOLD_REROOTING_GUIDE = "https://usaco.guide/gold/all-roots";
const USACO_GOLD_BITMASK_GUIDE = "https://usaco.guide/gold/dp-bitmasks";
const USACO_GOLD_2026_THIRD_RESULTS =
	"https://usaco.org/index.php?page=season26contest3results";

const USACO_GOLD_PRIMARY_TITLES = new Set([
	"USG0 Setup and Gold Mindset",
	"Unit 1: Dynamic Programming Foundations",
	"Unit 2: Shortest Paths and Weighted Graphs",
	"Unit 3: MSTs, DSU, and Connectivity Optimization",
	"Unit 4: Fenwick Trees, Ordering, and Range Structure",
	"Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems",
	"Unit 6: Advanced DP and Combinatorics",
	"Unit 7: Gold Capstone Sets"
]);

const USACO_GOLD_FLOW: Record<
	string,
	{
		title: string;
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"USG0 Setup and Gold Mindset": {
		title: "USG0 Setup, Contest Contract, and Gold Mindset",
		estimatedTime: "3 sessions · 60–90 minutes each",
		keyBlocks: [
			"Silver readiness",
			"current Gold rules",
			"certified result window",
			"language and I/O workflow",
			"complexity budget",
			"protected practice"
		],
		flowNote:
			"Verify independent Silver fluency, establish one reliable Gold contest language and standard-I/O workflow, read the live Gold and certified-result rules, and begin a proof-and-counterexample log before adding advanced algorithms."
	},
	"Unit 1: Dynamic Programming Foundations": {
		title: "Unit 1: Dynamic Programming, Knapsack, and State Design",
		estimatedTime: "7 sessions · 60–100 minutes each",
		keyBlocks: [
			"state definition",
			"base cases",
			"push and pull transitions",
			"evaluation order",
			"knapsack and grid DP",
			"slow oracle"
		],
		flowNote:
			"Design states from the minimum information needed for future choices, prove transitions and evaluation order, validate against a slow oracle, and transfer the same discipline to knapsack and grid-state problems."
	},
	"Unit 2: Shortest Paths and Weighted Graphs": {
		title: "Unit 2: Shortest Paths, DAGs, and Weighted Graphs",
		estimatedTime: "7 sessions · 60–100 minutes each",
		keyBlocks: [
			"weighted graph model",
			"relaxation invariant",
			"shortest-path selection",
			"topological ordering",
			"DAG dynamic programming",
			"complexity proof"
		],
		flowNote:
			"Choose a shortest-path method from edge weights, source count, and graph size; reject stale priority-queue work; and use topological order when dependencies form a DAG."
	},
	"Unit 3: MSTs, DSU, and Connectivity Optimization": {
		title: "Unit 3: MSTs, DSU, and Connectivity Proofs",
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"component invariant",
			"path compression",
			"union by size",
			"Kruskal and Prim",
			"cut and exchange proof",
			"connectivity threshold"
		],
		flowNote:
			"Maintain an exact disjoint-set component invariant, compare Kruskal and Prim from the graph representation, and justify every accepted edge with a cut or exchange argument."
	},
	"Unit 4: Fenwick Trees, Ordering, and Range Structure": {
		title: "Unit 4: Fenwick and Segment Trees, Ordering, and Range Structure",
		estimatedTime: "7 sessions · 60–100 minutes each",
		keyBlocks: [
			"point update",
			"prefix and range query",
			"Fenwick tree",
			"segment tree",
			"coordinate compression",
			"inversion counting"
		],
		flowNote:
			"Choose the smallest range structure whose updates and queries match the statement, derive index boundaries before coding, and connect compressed order statistics to inversion and sweep problems."
	},
	"Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems": {
		title: "Unit 5: Tree Algorithms, Euler Tours, and Advanced Graph Modeling",
		estimatedTime: "7 sessions · 60–100 minutes each",
		keyBlocks: [
			"tree rooting",
			"Euler tour flattening",
			"subtree range",
			"tree dynamic programming",
			"rerooting",
			"state-graph modeling"
		],
		flowNote:
			"Root trees only when it clarifies state, flatten subtrees into ranges with Euler-tour timestamps, build and reroot tree DP, and preserve the existing graph and geometry projects as model-selection practice."
	},
	"Unit 6: Advanced DP and Combinatorics": {
		title: "Unit 6: Advanced DP, Bitmask State, and Combinatorics",
		estimatedTime: "7 sessions · 60–110 minutes each",
		keyBlocks: [
			"bitmask state",
			"range and digit DP awareness",
			"modular arithmetic",
			"combinatorics",
			"modular inverse",
			"transition proof"
		],
		flowNote:
			"Extend state design to subsets and other compact dimensions, separate counting logic from modular implementation, and use range or digit DP only when the state and complexity genuinely fit."
	},
	"Unit 7: Gold Capstone Sets": {
		title: "Unit 7: Protected Gold Sets, Postmortems, and Platinum Readiness",
		estimatedTime: "8–10 sessions · 90–240 minutes each",
		keyBlocks: [
			"current official set",
			"four-hour protected mock",
			"certified-mode rehearsal",
			"subtask strategy",
			"delayed rewrite",
			"Gold or Platinum next step"
		],
		flowNote:
			"Calibrate with recent official Gold tasks, complete protected four-hour sets, repair failures through delayed independent rewrites, and use repeated evidence—not one cutoff or one lucky solve—to choose continued Gold work or a Platinum transition."
	}
};

function goldOptionPath(title: string) {
	return /extension|advanced|full gold repo|treasure|248|bookshelf|dijkstras algorithm ii|transfer practice|lights out|circular barn|bovine genomics|superbull|fenced in|roadblock/i.test(
		title
	)
		? ("challenge" as const)
		: ("choice" as const);
}

function insertGoldItem(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateGoldModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = USACO_GOLD_FLOW[module.title];
	let curriculum: RawCourseModuleItem[] = module.curriculum.map(item => ({
		...item,
		learningPath: "core" as const
	}));
	const coreProjectTitle = curriculum.at(-1)?.title ?? "";

	if (module.title === "USG0 Setup and Gold Mindset") {
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Current Gold Contest and Certified-Result Contract",
			content: [
				"**Format:** A normal online contest usually uses one continuous four-hour window; the US Open uses five hours. The live schedule, promotion cutoff, problem count, and special event conditions remain authoritative.",
				"",
				"**Certified Gold result:** Gold problems are currently released at 12:00 p.m. ET on Saturday. A start between 12:00 and 12:15 earns a certified score, and a certified result is required for promotion from Gold to Platinum. Recheck this rule before every event.",
				"",
				"**Promotion:** A perfect score can promote during a contest; other promotion cutoffs vary by contest. Treat every published cutoff as evidence about that set, not a permanent target.",
				"",
				"**I/O:** Current problems use statement-specified standard input and output. Print no prompts or debug text, check 64-bit range, honor aggregate test-case bounds, and match every required newline."
			].join("\n"),
			projectLink: USACO_GOLD_DETAILS,
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Active-Contest Integrity and Protected Practice",
			content: [
				"**Active-contest boundary:** Work alone. Generative AI, Copilot-style assistance, discussion, shared code, prewritten templates, solution resources, and automated submissions are prohibited. Only basic language syntax, library, and input/output references are permitted.",
				"",
				"**Course practice:** Guided hints and editorial comparison occur only after a preserved attempt. A protected mock begins from empty files and follows the active-contest boundary for its full timer.",
				"",
				"**Evidence:** Retain source, submissions, judge outcomes, timing notes, and the smallest counterexample. Write the postmortem after the timer ends."
			].join("\n"),
			projectLink: USACO_GOLD_RULES,
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Gold Language, Numeric, and Performance Contract",
			content: [
				"USACO currently accepts C, C++, Java, and Python, but higher-division full solutions may exceed Python's practical speed even with a larger time allowance. C++ is the only language supported at IOI. Select one contest language before a training block and learn its fast input, priority queues, ordered containers, recursion limits, integer widths, and memory costs.",
				"",
				"Estimate operations and storage before coding. Use 64-bit integers whenever sums, products, path lengths, or counts can exceed 32-bit range, and verify the live compiler or interpreter versions instead of relying on an old course note."
			].join("\n"),
			projectLink: USACO_GOLD_RULES,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 1: Dynamic Programming Foundations") {
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "DP State, Transition, and Validation Contract",
			content: [
				"**State:** Write one sentence defining exactly what `dp[state]` means and which choices from the original problem are already fixed.",
				"**Base and order:** List base cases, whether transitions push or pull, and the evaluation order that guarantees dependencies are ready.",
				"**Complexity:** Count reachable states and transitions per state; include memory and any dimension compression.",
				"**Validation:** First implement or reason through a slower correct oracle, compare random tiny cases, and preserve the smallest mismatch before optimizing."
			].join("\n"),
			projectLink: USACO_GOLD_GUIDE,
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Knapsack and Grid-State Transfer",
			content:
				"Practice 0–1 and bounded-choice knapsack, then transfer the same state discipline to paths on grids. Identify when iteration direction prevents reusing an item, when obstacles or string alignment create a two-dimensional state, and when rolling rows preserve every dependency. The table shape is a consequence of the recurrence, not the starting point.",
			projectLink: "https://usaco.guide/gold/knapsack",
			learningPath: "core"
		});
	}

	if (module.title === "Unit 2: Shortest Paths and Weighted Graphs") {
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Shortest-Path Selection and Relaxation Contract",
			content: [
				"Choose BFS for unit edges, 0–1 BFS for binary weights, Dijkstra for nonnegative weights, Bellman–Ford when negative edges require it, and Floyd–Warshall only when the graph is small enough for all-pairs cubic work.",
				"",
				"For every method, define the distance meaning, unreachable sentinel, relaxation condition, numeric range, and proof for when a value becomes final. In Dijkstra, permit duplicate queue entries and discard any entry whose distance is no longer current."
			].join("\n"),
			projectLink: "https://usaco.guide/gold/shortest-paths",
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Topological Ordering and DAG Dynamic Programming",
			content:
				"When directed dependencies have no cycle, compute a topological order and process each edge only after its predecessor state is ready. Define how indegrees or DFS finish order prove the ordering, detect a cycle rather than silently producing a partial order, and use the order for longest paths, counts, or reachability DP on a DAG.",
			projectLink: "https://usaco.guide/gold/toposort",
			learningPath: "core"
		});
	}

	if (module.title === "Unit 3: MSTs, DSU, and Connectivity Optimization") {
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "DSU, Kruskal, Prim, and MST Proof Contract",
			content: [
				"**DSU:** Each representative identifies one current component. Use path compression plus union by size or rank, and count a successful merge only when representatives differ.",
				"**Kruskal:** Process edges in nondecreasing weight and justify a chosen edge through the cut or exchange property.",
				"**Prim:** Maintain the cheapest edge that can expand the current tree; reject stale candidates and compare its representation cost with Kruskal.",
				"**Boundary:** Detect disconnected input, equal-weight ties, overflow in total cost, and problems asking for a threshold or forest rather than one MST."
			].join("\n"),
			projectLink: USACO_GOLD_GUIDE,
			learningPath: "core"
		});
	}

	if (
		module.title === "Unit 4: Fenwick Trees, Ordering, and Range Structure"
	) {
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Fenwick-versus-Segment-Tree Contract",
			content: [
				"Use a Fenwick tree for compact invertible prefix aggregation such as sums, or a segment tree when the merge operation, query shape, or stored node information needs more flexibility.",
				"",
				"Define whether indices are zero- or one-based, whether ranges are closed or half-open, what each internal node stores, and how a point update changes every affected aggregate. Test one element, the first and last index, an empty range if permitted, and repeated updates."
			].join("\n"),
			projectLink: USACO_GOLD_RANGE_GUIDE,
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Compressed Order Statistics and Inversion Counting",
			content:
				"Compress values only when relative order and equality are sufficient, preserve a reverse map when original values remain observable, and count each pair exactly once. Use a Fenwick tree, segment tree, ordered set, or merge-sort counting according to the required updates. Compare against an `O(n²)` inversion oracle on tiny permutations.",
			projectLink: USACO_GOLD_RANGE_GUIDE,
			learningPath: "core"
		});
	}

	if (
		module.title ===
		"Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems"
	) {
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Euler-Tour Flattening and Subtree Ranges",
			content: [
				"Root the tree and assign each vertex an entry time before exploring its children. A subtree then occupies one contiguous interval from `tin[v]` through `tout[v]` under the chosen convention.",
				"",
				"Prove the interval convention on a tiny tree, skip the parent edge, and combine the flattened array with a Fenwick or segment tree for subtree queries and point updates."
			].join("\n"),
			projectLink: USACO_GOLD_EULER_GUIDE,
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Tree DP and Rerooting Contract",
			content: [
				"**First pass:** Define a subtree state and combine child contributions in postorder.",
				"**All roots:** Identify what contribution is lost and gained when the root crosses one edge; carry the outside-subtree information in a second traversal.",
				"**Proof:** Explain why each directed parent-child relation is processed a constant number of times and why the rerooted value includes every vertex exactly once.",
				"**Safety:** Use iterative traversal when depth can exceed the language stack."
			].join("\n"),
			projectLink: USACO_GOLD_TREE_DP_GUIDE,
			solutionLink: USACO_GOLD_REROOTING_GUIDE,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 6: Advanced DP and Combinatorics") {
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Bitmask, Range, and Digit-DP Scope Ladder",
			content:
				"Use bitmask DP when a small set of independent choices makes subsets the natural state, with complexity stated in terms of `2^n`. Treat range DP and digit DP as specialized extensions: define interval boundaries or digit-prefix restrictions precisely, and reject the method when the state count multiplied by transition cost exceeds the full constraints.",
			projectLink: USACO_GOLD_BITMASK_GUIDE,
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Modular Arithmetic and Combinatorics Contract",
			content: [
				"State what is being counted before applying a modulus. Normalize subtraction, multiply in a wide enough type, and use a modular inverse only when the modulus and denominator make the inverse valid.",
				"",
				"For combinations, precompute factorials and inverse factorials only within the proven maximum input; for tree or DP counting, separate the structural recurrence from the modular operations and verify tiny answers by enumeration."
			].join("\n"),
			projectLink: "https://usaco.guide/gold/modular",
			learningPath: "core"
		});
	}

	if (module.title === "Unit 7: Gold Capstone Sets") {
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Current Gold Archive and Analysis-Mode Workflow",
			content:
				"Use the official contest archive to select recent Gold tasks, download released test data and solutions only after an attempt, and submit in analysis mode for judge feedback. Read all problems before choosing an order, identify available subtasks, and preserve the last timed submission before beginning post-contest repair.",
			projectLink: USACO_GOLD_CONTESTS,
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "2026 Third-Contest Gold Calibration",
			content:
				"Use the official 2026 third-contest Gold set—`Good Cyclic Shifts`, `Picking Flowers`, and `Random Tree Generation`—as a recent three-problem calibration. Its released analyses combine inversion/range structure and prefix reasoning, layered graph DP, modular inverses, subtree sizes, and tree rerooting. The reported 750 promotion cutoff belongs to this contest, and Gold-to-Platinum promotion still requires a certified result under the live rules.",
			projectLink: USACO_GOLD_2026_THIRD_RESULTS,
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Protected Gold Mock and Postmortem Contract",
			content: [
				"**Mock:** Use three unseen Gold problems, one continuous four-hour timer, an empty file per problem, permitted syntax/library references only, and no AI, hints, discussion, templates, or solution viewing.",
				"**During the timer:** Record statement triage, estimated complexity, subtask opportunities, attempt order, submission time, and judge outcome without turning the log into outside assistance.",
				"**Postmortem:** Preserve every partial attempt, classify the failure, find the smallest counterexample, study the released analysis, then complete a delayed rewrite from an empty file.",
				"**Certified rehearsal:** Occasionally begin exactly on a scheduled start and use the full contest setup, while clearly distinguishing a course rehearsal from an official certified score."
			].join("\n"),
			projectLink: USACO_GOLD_RULES,
			learningPath: "core"
		});
		curriculum = insertGoldItem(curriculum, coreProjectTitle, {
			title: "Continue in Gold or Pursue Platinum",
			content:
				"Across at least two protected Gold mocks, demonstrate one independent full solve per set, meaningful verified partial progress on another problem, a correct delayed rewrite, and clear explanations of state, invariant, proof, and full-constraint complexity. Continue targeted Gold practice when one family remains fragile. Pursue Platinum study only when this evidence is repeatable; the official certified promotion result remains the authority for contest division.",
			projectLink: USACO_GOLD_DETAILS,
			learningPath: "core"
		});
	}

	curriculum = curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
				: item.content
	}));

	return {
		...module,
		title: flow.title,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: goldOptionPath(item.title)
		}))
	};
}

function buildGoldProblemBankAppendix(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Gold Problem Bank",
		estimatedTime:
			"Choose targeted problems after a unit gate or contest postmortem",
		keyBlocks: [
			"pattern repair",
			"historical archive",
			"starter and solution pairs",
			"analysis-mode retry",
			"spaced independent solve"
		],
		curriculum: [
			{
				title: "Problem Bank Scope Guide",
				content:
					"**Course flow:** The full Gold repository bank is optional practice, not a ninth required unit. Choose a problem because a unit gate or postmortem identified a specific algorithm, proof, or implementation gap. Preserve the first attempt, delay solution study until diagnosis, and later rewrite from an empty file.",
				learningPath: "core"
			}
		],
		supplementalProjects: [
			...module.curriculum,
			...module.supplementalProjects
		].map(item => ({
			...item,
			learningPath: goldOptionPath(item.title)
		}))
	};
}

function buildGoldStudioAppendix(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Historical and Applied Gold Studios",
		estimatedTime:
			"Choose one studio for a diagnosed algorithm or implementation gap",
		keyBlocks: [
			"guided reconstruction",
			"historical Gold practice",
			"implementation fluency",
			"transfer problem",
			"delayed rewrite"
		],
		curriculum: [
			{
				title: "Studio Scope Guide",
				content:
					"**Course flow:** These eight studios preserve the complete guided practice collection without placing every repository folder in the required spine. Choose one when a specific DP, shortest-path, MST, range-structure, or implementation weakness remains after the matching unit; close reference code before the transfer attempt.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: goldOptionPath(item.title)
				})
			)
		)
	};
}

placeGoldSetupProjects(usacoGoldSourceCourse);

const usacoGoldPrimaryModules = usacoGoldSourceCourse.modules
	.filter(module => USACO_GOLD_PRIMARY_TITLES.has(module.title))
	.map(decorateGoldModule);
const usacoGoldProblemBank = usacoGoldSourceCourse.modules.find(
	module => module.title === "Unit 8: Optional Gold Problem Bank"
);
const usacoGoldStudios = usacoGoldSourceCourse.modules.filter(
	module =>
		!USACO_GOLD_PRIMARY_TITLES.has(module.title) &&
		module.title !== "Unit 8: Optional Gold Problem Bank" &&
		module.title !== "Pending Static Assets"
);
const usacoGoldAssetAppendix = usacoGoldSourceCourse.modules.find(
	module => module.title === "Pending Static Assets"
);

if (!usacoGoldProblemBank) {
	throw new Error("USACO Gold optional problem bank is missing.");
}

if (!usacoGoldAssetAppendix) {
	throw new Error("USACO Gold pending-static-assets appendix is missing.");
}

export const usacoGoldCourse: RawCourse = {
	...usacoGoldSourceCourse,
	modules: [
		...usacoGoldPrimaryModules,
		buildGoldProblemBankAppendix(usacoGoldProblemBank),
		buildGoldStudioAppendix(usacoGoldStudios),
		usacoGoldAssetAppendix
	]
};
