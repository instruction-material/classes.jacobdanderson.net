import type { RawCourse, RawCourseModuleItem } from "./types";
import { silverJavaPacks } from "../../modules/usacoSilverJavaPacks";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

const usacoSilverSourceCourse: RawCourse = {
	name: "USACO Silver",
	modules: [
		{
			title: "USS0 Setup and Silver Transition",
			curriculum: [
				{
					title: "Move from Bronze Accuracy to Silver Structure",
					content:
						"Frame Silver as the tier where clean modeling is still necessary but no longer sufficient. Algorithm families such as DFS, BFS, prefix sums, sorting-based reasoning, and binary search now need to be recognized more deliberately."
				},
				{
					title: "Stronger Debugging under Time Pressure",
					content:
						"Use custom tests, reasoning about invariants, and quick rejection of bad approaches. In Silver, debugging means finding bugs and diagnosing whether the entire strategy is wrong before wasting time polishing it."
				},
				{
					title: "Comfort with Java or Another Strong Contest Language",
					content:
						"Many of the Silver repo solutions lean on Java, so the course expects comfort reading and writing contest code in a strongly structured environment. The language still matters less than the algorithmic habit."
				},
				{
					title: "Catalog the Core Silver Patterns",
					content:
						"Keep a running list of the patterns that repeatedly appear: graph traversal, sorted sweeps, range accumulation, simulation with structure, and search over answer space. Actively build a mental index of problem types."
				},
				{
					title: "USS0 Setup and Silver Transition: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "USS0 Setup and Silver Transition",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US25-Why-Did-the-Cow-Cross-the-Road-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US25-Why-Did-the-Cow-Cross-the-Road-II/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Silver Log: Setup and Silver Transition",
					content:
						"Keep a short contest log for setup and silver transition that records one structural idea, one failed approach, and one note about which Bronze habit still helps and which old instinct now causes wasted effort. Silver progress comes from recognizing patterns quickly and abandoning weak ideas early.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US25-Why-Did-the-Cow-Cross-the-Road-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US25-Why-Did-the-Cow-Cross-the-Road-II/solution"
				},
				{
					title: "Why Did the Cow Cross the Road III",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Why Did the Cow Cross the Road III",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US26-Why-Did-the-Cow-Cross-the-Road-III/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US26-Why-Did-the-Cow-Cross-the-Road-III/solution"
				},
				{
					title: "Paired Up",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Paired Up",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US27-Paired-Up/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US27-Paired-Up/solution"
				}
			]
		},
		{
			title: "Unit 1: Data Structures and Problem Modeling",
			curriculum: [
				{
					title: "Sets, Maps, and Fast Membership Reasoning",
					content:
						"Use hash-based structures when the problem is really about uniqueness, fast lookup, or counting distinct states. This is one of the first Silver shifts away from only array-based thinking."
				},
				{
					title: "Model the Right Entity",
					content:
						"Use object-like or structured representations when the problem is about relationships rather than raw numbers. Name the true 'thing' in the problem before deciding how to store it."
				},
				{
					title: "Separate Storage from Strategy",
					content:
						"Distinguish the data structure from the algorithm using it. A HashSet does not solve the problem by itself; it enables a class of faster reasoning."
				},
				{
					title: "Trace with Structure",
					content:
						"Continue written tracing, but now with collections, maps, and richer state. Silver errors often come from losing track of what a structure is supposed to contain at each stage."
				},
				{
					title: "Unit 1: Data Structures and Problem Modeling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Unit 1: Data Structures and Problem Modeling",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US4-Exam-and-Bank-Account-Classes/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US4-Exam-and-Bank-Account-Classes/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Exam and BankAccount Classes",
					content:
						"Use a structured warmup to keep class design and data modeling fluent before heavier graph and range problems dominate.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US4-Exam-and-Bank-Account-Classes/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US4-Exam-and-Bank-Account-Classes/solution"
				},
				{
					title: "Problem: HashSets",
					content:
						"Practice membership and deduplication logic in a contest setting where the structure choice matters directly. The checkpoint is naming what belongs in the set, why duplicates must disappear, and how lookup changes the solution from repeated searching into direct evidence.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US5-Hash-Sets/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US5-Hash-Sets/solution"
				},
				{
					title: "Problem: HashMaps",
					content:
						"Use keyed storage and frequency-style reasoning to reinforce when a map is the cleanest expression of the problem.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US5-Hash-Maps/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US5-Hash-Maps/solution"
				},
				{
					title: "Bovine Genomics",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Unit 1: Data Structures and Problem Modeling",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US28-Bovine-Genomics/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US28-Bovine-Genomics/solution"
				}
			]
		},
		{
			title: "Unit 2: DFS, BFS, and Graph Traversal",
			curriculum: [
				{
					title: "Traversal as a Problem Family",
					content:
						"Recognize when a problem is secretly about reachability, components, shortest unweighted paths, or propagation through a state graph. Silver success often starts with spotting the hidden graph."
				},
				{
					title: "DFS for Exhaustive Structure",
					content:
						"Use DFS for component finding, recursive exploration, and bounded search over connected structures. The core idea is What DFS proves and what it does not."
				},
				{
					title: "BFS for Layers and Minimum-Step Reasoning",
					content:
						"Use BFS when step count matters or when the frontier naturally expands in layers. The key lesson is to link the algorithm to the guarantee it offers."
				},
				{
					title: "Graph Construction from Non-Graph Statements",
					content:
						"Practice rewriting problem statements into nodes and edges even when the original prompt talks about videos, containers, or rooms rather than explicit graph vocabulary."
				},
				{
					title: "Unit 2: DFS, BFS, and Graph Traversal: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Unit 2: DFS, BFS, and Graph Traversal",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-Mothers-Milk/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-Mothers-Milk/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Mothers Milk",
					content:
						"Use state-space exploration to practice traversal on a generated graph instead of a fixed one. Represent a state as the amount in each bucket, generate all legal pours, and explain why visited-state tracking is enough to prevent loops while preserving every reachable final answer.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-Mothers-Milk/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-Mothers-Milk/solution"
				},
				{
					title: "Problem: MooTube",
					content:
						"Treat relationships and thresholds as graph structure so that traversal answers a query cleanly. For each query, identify which edges remain usable under the relevance cutoff, traverse only through those edges, and verify that the count excludes the starting video itself.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US7-Moo-Tube/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US7-Moo-Tube/solution"
				},
				{
					title: "Problem: Dance Mooves",
					content:
						"Use repeated transitions and component reasoning to rehearse graph thinking in a problem that does not announce itself as graph theory at first glance.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US34-Dance-Mooves/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US34-Dance-Mooves/solution"
				}
			]
		},
		{
			title: "Unit 3: Sorting, Searching, and Binary Search",
			curriculum: [
				{
					title: "Sort to Reveal Structure",
					content:
						"Look for orderings that make the problem simpler: numeric order, lexical order, or a custom ranking that exposes the main constraint. Silver problems frequently unlock once the data is sorted the right way."
				},
				{
					title: "Search over Data and Search over Answers",
					content:
						"Differentiate between searching a sorted structure and binary searching over a possible answer range. Know that binary search is a strategy for monotonic questions, not just for arrays."
				},
				{
					title: "Prove the Predicate",
					content:
						"Whenever answer-space search appears, write the monotonic predicate in plain language before coding. This keeps binary search tied to logic instead of template memorization."
				},
				{
					title: "Compare Candidate Approaches Honestly",
					content:
						"Compare brute force, sorted scans, and binary search options so they can justify why a more structured approach is necessary."
				},
				{
					title: "Unit 3: Sorting, Searching, and Binary Search: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Unit 3: Sorting, Searching, and Binary Search",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US10-Prime-Palindromes/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US10-Prime-Palindromes/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Prime Palindromes",
					content:
						"Use a search-heavy numeric problem to practice pruning and candidate generation with strong test discipline. The solution generates plausible palindrome candidates before primality checks, justifies any skipped ranges, and includes boundary tests for the smallest and largest requested values.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US10-Prime-Palindromes/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US10-Prime-Palindromes/solution"
				},
				{
					title: "Problem: Ordered Fractions",
					content:
						"Use ordering and careful generation of candidates to practice sorted reasoning in a mathematically flavored setting. Generate only reduced fractions, compare without floating-point ambiguity when possible, and explain why the output order is mathematically sorted rather than accidentally matching the sample.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US14-Ordered-Fractions/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US14-Ordered-Fractions/solution"
				},
				{
					title: "Problem: Loan Repayment",
					content:
						"Use binary search over the answer space to practice monotonic reasoning and careful predicate design. Write the feasibility predicate in words first, identify why larger or smaller candidate values preserve monotonicity, and test off-by-one boundaries at the final answer.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Loan-Repayment/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Loan-Repayment/solution"
				},
				{
					title: "Problem: Searching for Soulmates",
					content:
						"Use a later Silver search-style problem to compare direct transformation ideas with cleaner search reasoning. Track which operations move a value toward the target efficiently, avoid wandering through unnecessary states, and justify the chosen search or greedy strategy with small transformation traces.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US40-Searching-For-Soulmates/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US40-Searching-For-Soulmates/solution"
				}
			]
		},
		{
			title: "Unit 4: Prefix Sums, Ranges, and Counting",
			curriculum: [
				{
					title: "Range Aggregation as a Core Silver Tool",
					content:
						"This section develops prefix sums and cumulative counts as the right abstraction when the problem asks repeated questions about segments or totals. Stop recomputing the same range work from scratch."
				},
				{
					title: "Count Indirectly when Direct Counting Is Awkward",
					content:
						"Partial sums, difference reasoning, and transformed arrays can make a messy direct count suddenly simple. Silver problems often reward this change in perspective."
				},
				{
					title: "Build Small Examples First",
					content:
						"Use small arrays and hand-built prefixes to verify that the transformed representation really answers the original question. This is especially important when cumulative reasoning is still new."
				},
				{
					title: "Keep the Interpretation Visible",
					content:
						"Explain what each prefix value means in plain language, not just compute it mechanically. This protects the solution from correct-looking but meaningless code."
				},
				{
					title: "Unit 4: Prefix Sums, Ranges, and Counting: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Unit 4: Prefix Sums, Ranges, and Counting",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US18-Counting-Haybales/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US18-Counting-Haybales/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Counting Haybales",
					content:
						"Use sorted positions and repeated range queries to practice structural counting instead of repeated scanning. The solution converts each query into two boundary searches, explains inclusive endpoint handling, and includes tests where the range starts or ends outside all haybale positions.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US18-Counting-Haybales/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US18-Counting-Haybales/solution"
				},
				{
					title: "Problem: Prefix Sums",
					content:
						"Treat a direct prefix-sum exercise as a template for broader Silver range reasoning. Define exactly what each prefix entry stores, derive the range formula before coding, and check empty-prefix, one-element, and full-array ranges so the indexing convention is not ambiguous.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US22-Prefix-Sums/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US22-Prefix-Sums/solution"
				},
				{
					title: "Problem: Just Green Enough",
					content:
						"Use a more layered counting problem to test whether transformed values stay aligned with the real goal. Reduce the grid values to the property being counted, use cumulative structure to avoid checking every rectangle naively, and verify that rectangles containing values below the threshold are excluded.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US33-Just-Green-Enough/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US33-Just-Green-Enough/solution"
				},
				{
					title: "Dance Mooves",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Unit 4: Prefix Sums, Ranges, and Counting",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US34-Dance-Mooves/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US34-Dance-Mooves/solution"
				}
			]
		},
		{
			title: "Unit 5: Greedy and Structured Simulation",
			curriculum: [
				{
					title: "Greedy Choice with Better Justification",
					content:
						"Silver greedy problems demand stronger explanation than Bronze ones. Name why a local choice preserves optimality or why no future decision can benefit from delaying it."
				},
				{
					title: "Simulation with Real Structure",
					content:
						"Use simulations that require sorted events, careful updates, or auxiliary data structures. The purpose is to show that simulation can still be the answer, but now it needs better organization."
				},
				{
					title: "Spot the Bottleneck",
					content:
						"Identify which step of the simulation dominates the runtime and whether restructuring could fix it. This grows algorithmic awareness without losing the practical contest mindset."
				},
				{
					title: "Compare Greedy to Search or DP Alternatives",
					content:
						"A greedy plan must be checked for safety; if the local choice is not provably safe, the problem may be hinting at a different family altogether. This distinction becomes even more important on the path to Gold."
				},
				{
					title: "Unit 5: Greedy and Structured Simulation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Unit 5: Greedy and Structured Simulation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Cow-Dance-Show/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Cow-Dance-Show/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Cow Dance Show",
					content:
						"Use scheduling and ordered simulation to practice reasoning about feasibility and bottlenecks. Model a stage size as a feasibility question, simulate finish times with an ordered structure, and explain why the minimum valid stage size can be found by binary search.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Cow-Dance-Show/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Cow-Dance-Show/solution"
				},
				{
					title: "Problem: Secret Cow Code",
					content:
						"Use structured reasoning and repeated transformations to avoid naive simulation of a much larger process. Work backward from the requested index through the length-doubling pattern, preserve one-based versus zero-based indexing deliberately, and test positions exactly at rotation boundaries.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US23-Secret-Cow-Code/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US23-Secret-Cow-Code/solution"
				},
				{
					title: "Problem: Rental Service",
					content:
						"Compare multiple ways to allocate resources and justify the order in which choices are considered. Sort cows, milk buyers, and renters by the relevant value, then explain how prefix or suffix profit tables make each split between renting and selling easy to evaluate.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US34-Rental-Service/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US34-Rental-Service/solution"
				}
			]
		},
		{
			title: "Unit 6: Silver Capstone Sets",
			curriculum: [
				{
					title: "Mix Patterns Deliberately",
					content:
						"Practice short sets that combine graph reasoning, sorting, simulation, and counting to avoid expecting the problem category to be obvious from the first sentence."
				},
				{
					title: "Write Cleaner Contest Explanations",
					content:
						"Include a one-paragraph explanation for each finished problem that names the pattern, the key data structure, and the reason the approach fits the constraints. This builds a reusable mental library."
				},
				{
					title: "Find the Gaps before Gold",
					content:
						"Identify whether the remaining gap is graph modeling, answer-space search, counting transforms, or structured simulation. The transition to Gold is much smoother when that diagnosis is honest."
				},
				{
					title: "Prepare for USACO Gold",
					content:
						"Close by positioning Gold as the tier where dynamic programming, shortest paths, MSTs, and more formal optimization ideas become normal. Move on only once Silver patterns feel recognizable rather than mysterious."
				},
				{
					title: "Unit 6: Silver Capstone Sets: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Unit 6: Silver Capstone Sets",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US38-Redistributing-Gifts/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US38-Redistributing-Gifts/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Redistributing Gifts",
					content:
						"Use a more layered relationship problem to test whether graph and constraint reasoning are becoming automatic. Convert preference lists into reachability or mutual-improvement relationships, identify which trades are actually possible, and keep the final counting tied to the problem's preference constraint.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US38-Redistributing-Gifts/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US38-Redistributing-Gifts/solution"
				},
				{
					title: "Problem: Wormhole Sort",
					content:
						"Use a Silver capstone that mixes structural reasoning, search thinking, and strong implementation discipline. Treat the answer as a width threshold, use connectivity to test whether every cow can reach its target position, and justify the monotonic property behind the binary search.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Wormhole-Sort/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Wormhole-Sort/solution"
				},
				{
					title: "Stuck in a Rut Silver",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Unit 6: Silver Capstone Sets",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US35-Stuck-in-a-Rut-Silver/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US35-Stuck-in-a-Rut-Silver/solution"
				}
			]
		},
		{
			title: "Unit 7: Optional Silver Problem Bank",
			curriculum: [
				{
					title: "Why the Repo Is Larger than the Main Course",
					content:
						"The `USACO-Silver` repo is intentionally broader than the required course spine. Use it as an optional canonical library grouped by technique families once the core Silver modules are stable."
				},
				{
					title: "Classical Training and Search Problems",
					content:
						"Important classical and structure-building problems in the repo include `US8 Arithmetic Progressions`, `US9 Number Triangles`, `US11 Superprime Rib`, `US12 Floodfill`, `US13 The Castle`, `US15 Sorting a Three-Valued Sequence`, `US16 Healthy Holsteins`, and `US17 Hamming Codes`."
				},
				{
					title: "Graph, Reachability, and Simulation Extensions",
					content:
						"Graph and structured simulation extensions include `US19 Cities and States`, `US20 Moocast`, `US21 Priority Queues`, `US22 Hoof Paper Scissors`, `US24/US25/US26 Why Did the Cow Cross the Road`, `US27 Paired Up`, `US28 Bovine Genomics`, `US35 Stuck in a Rut`, and `US36 Rectangular Pasture`."
				},
				{
					title: "Support Labs and Late Silver Bank",
					content:
						"Support and late-Silver folders include `US5 Custom Classes with HashSets and HashMaps`, `US6 DFS`, `US6 Stacks`, `US7 BFS`, `US7 Queues`, `US23 Secret Cow Code`, `US34 Rental Service`, `US37 Subset Equality`, `US38 Redistributing Gifts`, `US39 Closest Cow Wins`, and `US-Wormhole-Sort`."
				},
				{
					title: "Unit 7: Optional Silver Problem Bank: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Unit 7: Optional Silver Problem Bank",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Problem Bank: Full Silver Repo",
					content:
						"Browse the full Silver repo bank when the public spine is not enough practice and you want the larger contest-library view.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main"
				},
				{
					title: "Problem: Floodfill",
					content:
						"Use a direct flood-fill and component-style problem to reinforce traversal fundamentals in a contest setting. Mark visited cells, define exactly which neighbors are connected, and record component sizes or labels so the traversal produces reusable information rather than only a pass/fail search.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US12-Floodfill/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US12-Floodfill/solution"
				},
				{
					title: "Problem: Cities and States",
					content:
						"Use hashed counting and pair reasoning to strengthen map-based Silver problem modeling. Store city-prefix and state pairs, count complementary pairs carefully, and explain how the solution avoids double-counting and ignores pairs where the city prefix already equals its own state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US19-Cities-and-States/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US19-Cities-and-States/solution"
				},
				{
					title: "Problem: Moocast",
					content:
						"Use reachability and graph construction in a problem where the hidden structure matters more than the story text.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US20-Moocast/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US20-Moocast/solution"
				},
				{
					title: "Problem: Rectangular Pasture",
					content:
						"Use geometric counting and structure-aware iteration as a stronger late-Silver challenge. Compress coordinates, reason about choosing left and right boundaries, and use prefix counts to determine how many vertical choices are available without scanning every rectangle explicitly.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US36-Rectangular-Pasture/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US36-Rectangular-Pasture/solution"
				}
			]
		},
		{
			title: "US Berry Picking: Practice Studio",
			curriculum: [
				{
					title: "US Berry Picking: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "US Berry Picking: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "US Berry Picking: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "US Berry Picking: Practice Studio",
						section: "example"
					})
				},
				{
					title: "US Berry Picking: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "US Berry Picking: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Berry-Picking/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Berry-Picking/solution"
				},
				{
					title: "US Berry Picking: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "US Berry Picking: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "US Berry Picking: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "US Berry Picking: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Berry-Picking/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Berry-Picking/solution"
				},
				{
					title: "Subset Equality",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "US Berry Picking: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US37-Subset-Equality/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US37-Subset-Equality/solution"
				},
				{
					title: "Closest Cow Wins",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "US Berry Picking: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US39-Closest-Cow-Wins/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US39-Closest-Cow-Wins/solution"
				}
			]
		},
		{
			title: "Superprime Rib: Practice Studio",
			curriculum: [
				{
					title: "Superprime Rib: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Superprime Rib: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Superprime Rib: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Superprime Rib: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Superprime Rib: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Superprime Rib: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US11-Superprime-Rib/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US11-Superprime-Rib/solution"
				},
				{
					title: "Superprime Rib: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Superprime Rib: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Superprime Rib: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Superprime Rib: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US11-Superprime-Rib/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US11-Superprime-Rib/solution"
				},
				{
					title: "Custom Classes with HashSets and HashMaps",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Superprime Rib: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US5-Custom-Classes-with-Hash-Sets-and-Hash-Maps/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US5-Custom-Classes-with-Hash-Sets-and-Hash-Maps/solution"
				},
				{
					title: "DFS",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Superprime Rib: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-DFS/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-DFS/solution"
				}
			]
		},
		{
			title: "The Castle: Practice Studio",
			curriculum: [
				{
					title: "The Castle: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "The Castle: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "The Castle: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "The Castle: Practice Studio",
						section: "example"
					})
				},
				{
					title: "The Castle: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "The Castle: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US13-The-Castle/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US13-The-Castle/solution"
				},
				{
					title: "The Castle: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "The Castle: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "The Castle: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "The Castle: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US13-The-Castle/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US13-The-Castle/solution"
				},
				{
					title: "Stacks",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "The Castle: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-Stacks/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-Stacks/solution"
				},
				{
					title: "BFS",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "The Castle: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US7-BFS/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US7-BFS/solution"
				}
			]
		},
		{
			title: "Sorting a Three Valued Sequence: Practice Studio",
			curriculum: [
				{
					title: "Sorting a Three Valued Sequence: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Sorting a Three Valued Sequence: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Sorting a Three Valued Sequence: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Sorting a Three Valued Sequence: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Sorting a Three Valued Sequence: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Sorting a Three Valued Sequence: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US15-Sorting-a-Three-Valued-Sequence/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US15-Sorting-a-Three-Valued-Sequence/solution"
				},
				{
					title: "Sorting a Three Valued Sequence: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Sorting a Three Valued Sequence: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Sorting a Three Valued Sequence: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Sorting a Three Valued Sequence: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US15-Sorting-a-Three-Valued-Sequence/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US15-Sorting-a-Three-Valued-Sequence/solution"
				},
				{
					title: "Queues",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Sorting a Three Valued Sequence: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US7-Queues/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US7-Queues/solution"
				},
				{
					title: "Arithmetic Progressions",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Sorting a Three Valued Sequence: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US8-Arithmetic-Progressions/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US8-Arithmetic-Progressions/solution"
				}
			]
		},
		{
			title: "Healthy Holsteins: Practice Studio",
			curriculum: [
				{
					title: "Healthy Holsteins: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Healthy Holsteins: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Healthy Holsteins: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Healthy Holsteins: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Healthy Holsteins: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Healthy Holsteins: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US16-Healthy-Holsteins/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US16-Healthy-Holsteins/solution"
				},
				{
					title: "Healthy Holsteins: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Healthy Holsteins: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Healthy Holsteins: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Healthy Holsteins: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US16-Healthy-Holsteins/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US16-Healthy-Holsteins/solution"
				},
				{
					title: "Number Triangles",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Healthy Holsteins: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US9-Number-Triangles/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US9-Number-Triangles/solution"
				},
				{
					title: "Healthy Holsteins Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Healthy Holsteins: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-01-applied-studio-13-healthy-holsteins-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-01-applied-studio-13-healthy-holsteins-supplemental-3/solution"
				}
			]
		},
		{
			title: "Hamming Codes: Practice Studio",
			curriculum: [
				{
					title: "Hamming Codes: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hamming Codes: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Hamming Codes: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hamming Codes: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Hamming Codes: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hamming Codes: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US17-Hamming-Codes/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US17-Hamming-Codes/solution"
				},
				{
					title: "Hamming Codes: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hamming Codes: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Hamming Codes: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hamming Codes: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US17-Hamming-Codes/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US17-Hamming-Codes/solution"
				},
				{
					title: "Hamming Codes Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hamming Codes: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-02-applied-studio-14-hamming-codes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-02-applied-studio-14-hamming-codes-supplemental-2/solution"
				},
				{
					title: "Hamming Codes Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hamming Codes: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-03-applied-studio-14-hamming-codes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-03-applied-studio-14-hamming-codes-supplemental-3/solution"
				}
			]
		},
		{
			title: "Priority Queues: Practice Studio",
			curriculum: [
				{
					title: "Priority Queues: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Priority Queues: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Priority Queues: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Priority Queues: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Priority Queues: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Priority Queues: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Priority-Queues/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Priority-Queues/solution"
				},
				{
					title: "Priority Queues: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Priority Queues: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Priority Queues: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Priority Queues: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Priority-Queues/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Priority-Queues/solution"
				},
				{
					title: "Priority Queues Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Priority Queues: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-04-applied-studio-15-priority-queues-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-04-applied-studio-15-priority-queues-supplemental-2/solution"
				},
				{
					title: "Priority Queues Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Priority Queues: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-05-applied-studio-15-priority-queues-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-05-applied-studio-15-priority-queues-supplemental-3/solution"
				}
			]
		},
		{
			title: "Hoof Paper Scissors: Practice Studio",
			curriculum: [
				{
					title: "Hoof Paper Scissors: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Hoof Paper Scissors: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Hoof Paper Scissors: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US22-Hoof-Paper-Scissors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US22-Hoof-Paper-Scissors/solution"
				},
				{
					title: "Hoof Paper Scissors: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Hoof Paper Scissors: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US22-Hoof-Paper-Scissors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US22-Hoof-Paper-Scissors/solution"
				},
				{
					title: "Hoof Paper Scissors Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-06-applied-studio-16-hoof-paper-scissors-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-06-applied-studio-16-hoof-paper-scissors-supplemental-2/solution"
				},
				{
					title: "Hoof Paper Scissors Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle: "Hoof Paper Scissors: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-07-applied-studio-16-hoof-paper-scissors-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-07-applied-studio-16-hoof-paper-scissors-supplemental-3/solution"
				}
			]
		},
		{
			title: "Why Did the Cow Cross the Road: Practice Studio",
			curriculum: [
				{
					title: "Why Did the Cow Cross the Road: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Why Did the Cow Cross the Road: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Why Did the Cow Cross the Road: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US24-Why-Did-the-Cow-Cross-the-Road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US24-Why-Did-the-Cow-Cross-the-Road/solution"
				},
				{
					title: "Why Did the Cow Cross the Road: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO Silver",
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
						courseFamily: "USACO Silver",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US24-Why-Did-the-Cow-Cross-the-Road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US24-Why-Did-the-Cow-Cross-the-Road/solution"
				},
				{
					title: "Why Did the Cow Cross the Road Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-08-applied-studio-17-why-did-the-cow-cross-the-road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-08-applied-studio-17-why-did-the-cow-cross-the-road/solution"
				},
				{
					title: "Why Did the Cow Cross the Road Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "USACO Silver",
						moduleTitle:
							"Why Did the Cow Cross the Road: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-09-applied-studio-17-why-did-the-cow-cross-the-road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-09-applied-studio-17-why-did-the-cow-cross-the-road/solution"
				}
			]
		}
	]
};

const USACO_SILVER_CONTESTS = "https://usaco.org/index.php?page=contests";
const USACO_SILVER_RULES = "https://usaco.org/index.php?page=instructions";
const USACO_SILVER_DETAILS = "https://usaco.org/index.php?page=details";
const USACO_SILVER_GUIDE = "https://usaco.guide/silver";
const USACO_SILVER_COMPRESSION_GUIDE =
	"https://usaco.guide/silver/sorting-custom";
const USACO_SILVER_2026_SLIDING_WINDOW =
	"https://usaco.org/index.php?page=viewproblem2&cpid=1544";
const USACO_SILVER_2025_SEQUENCE_CONSTRUCTION =
	"https://usaco.org/index.php?cpid=1518&lang=en&page=viewproblem2";
const USACO_SILVER_2026_THIRD_RESULTS =
	"https://usaco.org/index.php?page=season26contest3results";

const USACO_SILVER_PRIMARY_TITLES = new Set([
	"USS0 Setup and Silver Transition",
	"Unit 1: Data Structures and Problem Modeling",
	"Unit 2: DFS, BFS, and Graph Traversal",
	"Unit 3: Sorting, Searching, and Binary Search",
	"Unit 4: Prefix Sums, Ranges, and Counting",
	"Unit 5: Greedy and Structured Simulation",
	"Unit 6: Silver Capstone Sets"
]);

const USACO_SILVER_FLOW: Record<
	string,
	{
		title: string;
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"USS0 Setup and Silver Transition": {
		title: "USS0 Setup and Silver Transition",
		estimatedTime: "3 sessions · 45–90 minutes each",
		keyBlocks: [
			"Bronze readiness",
			"current contest rules",
			"language and I/O workflow",
			"complexity budget",
			"protected practice",
			"problem log"
		],
		flowNote:
			"Verify independent Bronze accuracy, establish one reliable Silver language and standard-I/O workflow, read the live contest rules, and use protected practice before adding new algorithm families."
	},
	"Unit 1: Data Structures and Problem Modeling": {
		title: "Unit 1: Maps, Sets, and Problem Modeling",
		estimatedTime: "5 sessions · 45–90 minutes each",
		keyBlocks: [
			"state representation",
			"maps and sets",
			"membership and frequency",
			"data-structure invariant",
			"constraint budget",
			"structured trace"
		],
		flowNote:
			"Choose arrays, maps, sets, or structured records from the value range and required operations. Define what each structure contains at every step, then test the representation independently from the algorithm that uses it."
	},
	"Unit 2: DFS, BFS, and Graph Traversal": {
		title: "Unit 2: DFS, BFS, Flood Fill, Trees, and Functional Graphs",
		estimatedTime: "6 sessions · 45–90 minutes each",
		keyBlocks: [
			"graph construction",
			"DFS and BFS",
			"flood fill",
			"tree structure",
			"functional graphs",
			"visited-state invariant"
		],
		flowNote:
			"Translate stories and grids into nodes, edges, and states; choose DFS, BFS, or flood fill from the guarantee needed; and extend traversal reasoning to trees and one-outgoing-edge functional graphs."
	},
	"Unit 3: Sorting, Searching, and Binary Search": {
		title: "Unit 3: Sorting, Two Pointers, Compression, and Binary Search",
		estimatedTime: "6 sessions · 45–90 minutes each",
		keyBlocks: [
			"custom ordering",
			"two pointers",
			"coordinate compression",
			"binary search",
			"monotone predicate",
			"boundary invariant"
		],
		flowNote:
			"Sort to expose structure, scan monotone ranges with two pointers, compress large coordinates when only order matters, and use binary search only after stating a monotone predicate and boundary invariant."
	},
	"Unit 4: Prefix Sums, Ranges, and Counting": {
		title: "Unit 4: Prefix and Difference Sums, Ranges, and Sliding Windows",
		estimatedTime: "6 sessions · 45–90 minutes each",
		keyBlocks: [
			"prefix meaning",
			"difference updates",
			"two-dimensional ranges",
			"sliding window",
			"multiple test cases",
			"aggregate input bound"
		],
		flowNote:
			"Represent repeated range work with prefix or difference structures, extend the invariant to grids, and use sliding windows only when the entering and leaving updates are both explicit."
	},
	"Unit 5: Greedy and Structured Simulation": {
		title: "Unit 5: Greedy, Priority Queues, Bitwise, and Structured Simulation",
		estimatedTime: "6 sessions · 45–90 minutes each",
		keyBlocks: [
			"greedy exchange",
			"event ordering",
			"priority queue",
			"bitwise state",
			"constructive output",
			"counterexample"
		],
		flowNote:
			"Justify local choices with an exchange or no-regret argument, use priority queues for the next relevant event, and treat bitwise or constructive tasks as explicit state design rather than memorized tricks."
	},
	"Unit 6: Silver Capstone Sets": {
		title: "Unit 6: Protected Silver Sets, Postmortems, and Gold Readiness",
		estimatedTime: "6–8 sessions · 60–120 minutes each",
		keyBlocks: [
			"current official set",
			"four-hour protected mock",
			"partial-credit plan",
			"judge diagnosis",
			"delayed rewrite",
			"Gold readiness"
		],
		flowNote:
			"Calibrate against a recent official Silver set, complete protected mocks under the active-contest boundary, repair misses through delayed independent rewrites, and move to Gold only after Silver pattern recognition is repeatable."
	}
};

function silverOptionPath(title: string) {
	return /extension|challenge|advanced|superprime|castle|healthy holsteins|hamming|rectangular pasture|wormhole|closest cow|stuck in a rut|gold/i.test(
		title
	)
		? ("challenge" as const)
		: ("choice" as const);
}

function strengthenSilverItem(item: RawCourseModuleItem): RawCourseModuleItem {
	if (item.title === "Move from Bronze Accuracy to Silver Structure") {
		return {
			...item,
			content:
				"Enter Silver after Bronze problem statements, exact I/O, constraint checks, custom tests, and postmortem repair are independently reliable. Silver adds deliberate recognition of graph traversal, sorted sweeps, two pointers, coordinate compression, prefix and difference sums, sliding windows, binary search, greedy methods, priority queues, and compact state representations."
		};
	}

	if (item.title === "Stronger Debugging under Time Pressure") {
		return {
			...item,
			content:
				"Separate strategy failure from implementation failure early. Keep the last submission, classify the result as wrong answer, time limit, runtime or memory error, compile failure, or output-format failure, find the smallest counterexample, and decide whether the next action is a model change, complexity change, or code repair."
		};
	}

	if (item.title === "Comfort with Java or Another Strong Contest Language") {
		return {
			...item,
			title: "One Reliable Silver Contest Language",
			content:
				"Use one language whose input, sorting, collections, queues, recursion limits, integer ranges, and performance costs are already familiar. USACO accepts C, C++, Java, and Python under the live technical specifications; verify current versions before competing and change languages between training blocks rather than during a contest."
		};
	}

	if (item.title === "Catalog the Core Silver Patterns") {
		return {
			...item,
			content:
				"Maintain a pattern index with statement signals, required invariant, common complexity, and one counterexample for maps and sets, prefix and difference sums, custom sorting and compression, two pointers, binary search, DFS/BFS/flood fill, trees and functional graphs, greedy methods, priority queues, bitwise state, and constructive output. The index supports recognition; it is not prewritten contest code."
		};
	}

	if (item.title === "Prepare for USACO Gold") {
		return {
			...item,
			content:
				"Move to `USACO Gold` after more than one protected Silver mock shows repeatable statement parsing, pattern selection, complexity analysis, exact implementation, and repair after failure. The live promotion result remains authoritative; this learning gate prevents dynamic programming, shortest paths, disjoint-set structures, and other Gold tools from hiding unresolved Silver gaps."
		};
	}

	return item;
}

function insertSilverItem(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateSilverModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = USACO_SILVER_FLOW[module.title];
	let curriculum: RawCourseModuleItem[] = module.curriculum
		.map(strengthenSilverItem)
		.map(item => ({ ...item, learningPath: "core" as const }));
	const coreProjectTitle = curriculum.at(-1)?.title ?? "";

	if (module.title === "USS0 Setup and Silver Transition") {
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Current Silver Contest and I/O Contract",
			content: [
				"**Format:** The current general description uses a continuous four-hour window for a normal online contest and five hours for the US Open. Silver is defined around fundamental problem-solving techniques and data structures. Promotion cutoffs, season structure, technical versions, and special contest conditions can change, so read the live details before every event.",
				"",
				"**2025–26 context:** Certified result windows applied to Gold and Platinum, not Silver, and the season used three online contests followed by a proctored invitational US Open. Treat that as one transitional season, not a permanent schedule.",
				"",
				"**I/O:** Modern problems use terminal-based standard input and output. Match the statement exactly, print no prompts or debug text, and verify numeric range and total input across test cases before coding."
			].join("\n"),
			projectLink: USACO_SILVER_DETAILS,
			learningPath: "core"
		});
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Contest Integrity and Protected Practice",
			content: [
				"**Active-contest boundary:** Work alone. Generative AI, Copilot-style assistance, discussion, shared code, prewritten templates, solution resources, and automated submissions are prohibited. Only basic language syntax, library, and input/output references are permitted.",
				"",
				"**Course practice:** Hints, editorial study, and solution comparison happen only after a preserved attempt. Protected mocks follow the active-contest boundary and begin from empty files.",
				"",
				"**Evidence:** Retain source, submissions, judge results, and timing notes; write the postmortem after the timer ends."
			].join("\n"),
			projectLink: USACO_SILVER_RULES,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 1: Data Structures and Problem Modeling") {
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Representation and Data-Structure Invariant Contract",
			content: [
				"**Operations first:** List required insert, delete, membership, frequency, minimum/maximum, traversal, and ordering operations before naming a structure.",
				"**Range check:** Use an array for a small dense domain, a set for distinct membership, and a map for sparse keyed values or counts.",
				"**Invariant:** State exactly what each entry means after processing the first `i` inputs or events.",
				"**Complexity:** Include both the expected operation cost and total number of operations at the largest legal input."
			].join("\n"),
			projectLink: USACO_SILVER_GUIDE,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 2: DFS, BFS, and Graph Traversal") {
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Flood Fill, Trees, and Functional Graphs",
			content: [
				"**Flood fill:** Define legal grid neighbors, mark a cell when it enters the traversal, and record component evidence such as size, perimeter, or label.",
				"**Trees:** Use the unique-path property, choose a root only when it clarifies parent/child state, and avoid treating an undirected parent edge as a new subtree.",
				"**Functional graphs:** Every node has one outgoing edge, so each component contains a directed cycle with incoming trees. Track visit state carefully enough to distinguish a new path from an already completed component.",
				"**Safety:** Choose iterative traversal when recursion depth can exceed the language's safe stack."
			].join("\n"),
			projectLink: USACO_SILVER_GUIDE,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 3: Sorting, Searching, and Binary Search") {
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Two-Pointer and Sorted-Sweep Contract",
			content: [
				"Sort only when order preserves the information required by the answer. Define each pointer, the valid window or pair condition, and why at least one pointer moves monotonically after every comparison.",
				"",
				"Count each pair, interval, or event exactly once. Test equal values, no valid pair, all valid pairs, and a boundary where moving the wrong pointer skips the answer."
			].join("\n"),
			projectLink: USACO_SILVER_GUIDE,
			learningPath: "core"
		});
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Custom Ordering, Coordinate Compression, and Search Boundaries",
			content: [
				"**Comparator:** State the primary key, tie-breaker, and strict ordering rule before implementation.",
				"**Compression:** Map sorted distinct values to compact indices only when relative order or equality is enough; retain reverse mapping when original values remain part of the output.",
				"**Binary search:** Write the monotone predicate, maintain a known-false/known-true or half-open boundary invariant, and test the first valid and last invalid candidates.",
				"**Memory:** Compression replaces an impossible large coordinate domain with storage proportional to the number of observed values."
			].join("\n"),
			projectLink: USACO_SILVER_COMPRESSION_GUIDE,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 4: Prefix Sums, Ranges, and Counting") {
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Prefix, Difference, Grid, and Sliding-Window Contract",
			content: [
				"**Prefix:** Define whether entry `i` includes or excludes position `i`, then derive the range formula before coding.",
				"**Difference:** Record how an interval update changes its start and the position after its end, then recover values with one cumulative pass.",
				"**Grid:** State the rectangle inclusion-exclusion formula and verify all four corners on a tiny matrix.",
				"**Window:** Name the entering contribution, leaving contribution, maintained invariant, and condition that moves the left boundary."
			].join("\n"),
			projectLink: USACO_SILVER_GUIDE,
			learningPath: "core"
		});
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Recent Official Sliding-Window Calibration",
			content:
				"Use the official 2026 first-contest Silver problem `Sliding Window Summation` as a recent calibration. It contains up to 1,000 test cases, an aggregate input bound of one million, window relationships, and minimum/maximum output requirements. Start with a tiny oracle, state what one shifted window reveals about the next, reset all per-case state, and justify aggregate runtime.",
			projectLink: USACO_SILVER_2026_SLIDING_WINDOW,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 5: Greedy and Structured Simulation") {
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Priority Queue and Greedy-Exchange Contract",
			content: [
				"Use a priority queue when the next minimum or maximum event changes repeatedly while the remaining data stays active. Define what one entry represents, when stale entries can exist, and how they are rejected.",
				"",
				"For a greedy choice, write an exchange, dominance, or no-regret argument. If a smallest counterexample defeats the local rule, preserve it and reclassify the problem before coding further."
			].join("\n"),
			projectLink: USACO_SILVER_GUIDE,
			learningPath: "core"
		});
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Bitwise State and Constructive Output",
			content:
				"Recent Silver work can require bitwise reasoning and construction rather than only returning a number. Use the official 2025 US Open Silver `Sequence Construction` problem to practice popcount, XOR, bounded output length, impossibility detection, and witness validation. Recompute every required property from the produced sequence before accepting it.",
			projectLink: USACO_SILVER_2025_SEQUENCE_CONSTRUCTION,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 6: Silver Capstone Sets") {
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Current Season and Analysis-Mode Archive",
			content:
				"Use the official contest archive to select recent Silver tasks, download released test data and solutions after an attempt, and submit in analysis mode for judge feedback. Season structure and promotion criteria can change, so use the active contest page rather than copying a previous calendar or cutoff into the plan.",
			projectLink: USACO_SILVER_CONTESTS,
			learningPath: "core"
		});
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "2026 Third-Contest Silver Calibration",
			content:
				"Use the official 2026 third-contest Silver set—`Clash!`, `Milk Buckets`, and `Point Elimination`—as a recent three-problem calibration. Read all statements before choosing an order, record subtask opportunities, solve under protected conditions, and use released solutions, test data, and analysis mode only after the timer. The reported 700 promotion cutoff belongs to that contest, not every Silver contest.",
			projectLink: USACO_SILVER_2026_THIRD_RESULTS,
			learningPath: "core"
		});
		curriculum = insertSilverItem(curriculum, coreProjectTitle, {
			title: "Protected Mock and Postmortem Contract",
			content: [
				"**Mock:** Use three unseen Silver problems, one continuous four-hour timer, an empty file per problem, permitted syntax/library references only, and no AI, hints, discussion, templates, or solution viewing.",
				"**During the timer:** Record first-read complexity, attempt order, submission time, and judge outcome without turning the log into outside assistance.",
				"**Postmortem:** Preserve every partial attempt, classify the failure, find the smallest counterexample, study the released explanation, then complete a delayed rewrite from an empty file.",
				"**Gold gate:** Across more than one mock, complete at least two independent solves and one successful delayed repair while explaining the pattern, invariant, and full-constraint complexity."
			].join("\n"),
			projectLink: USACO_SILVER_RULES,
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
		supplementalProjects: module.supplementalProjects
			.map(strengthenSilverItem)
			.map(item => ({
				...item,
				learningPath: silverOptionPath(item.title)
			}))
	};
}

function buildSilverProblemBankAppendix(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Silver Problem Bank",
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
					"**Course flow:** The full repository bank is optional practice, not another required sequence. Choose a problem because a unit gate or postmortem identified a pattern gap. Preserve the first attempt, use hints or solutions only after diagnosis, and complete a later rewrite from an empty file.",
				learningPath: "core"
			}
		],
		supplementalProjects: [
			...module.curriculum,
			...module.supplementalProjects
		]
			.map(strengthenSilverItem)
			.map(item => ({
				...item,
				learningPath: silverOptionPath(item.title)
			}))
	};
}

function buildSilverStudioAppendix(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Historical and Applied Silver Studios",
		estimatedTime:
			"Choose one studio for a diagnosed algorithm or implementation gap",
		keyBlocks: [
			"guided reconstruction",
			"historical training",
			"implementation fluency",
			"transfer problem",
			"delayed rewrite"
		],
		curriculum: [
			{
				title: "Studio Scope Guide",
				content:
					"**Course flow:** These nine studios preserve the complete guided practice collection without placing every repository folder in the required spine. Choose one when a specific algorithm, data structure, or implementation weakness remains after the matching unit; close reference code before the transfer attempt.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(strengthenSilverItem)
				.map(item => ({
					...item,
					learningPath: silverOptionPath(item.title)
				}))
		)
	};
}

const usacoSilverPrimaryModules = usacoSilverSourceCourse.modules
	.filter(module => USACO_SILVER_PRIMARY_TITLES.has(module.title))
	.map(decorateSilverModule);
const usacoSilverProblemBank = usacoSilverSourceCourse.modules.find(
	module => module.title === "Unit 7: Optional Silver Problem Bank"
);
const usacoSilverStudios = usacoSilverSourceCourse.modules.filter(
	module =>
		!USACO_SILVER_PRIMARY_TITLES.has(module.title) &&
		module.title !== "Unit 7: Optional Silver Problem Bank"
);

if (!usacoSilverProblemBank) {
	throw new Error("USACO Silver optional problem bank is missing.");
}

export const usacoSilverCourse: RawCourse = {
	...usacoSilverSourceCourse,
	modules: [
		...usacoSilverPrimaryModules,
		buildSilverProblemBankAppendix(usacoSilverProblemBank),
		buildSilverStudioAppendix(usacoSilverStudios)
	]
};

// Preserve all six progress identities and the existing required/log/retry placements.
for (const pack of silverJavaPacks) {
	for (const assignment of pack.assignments) {
		const matches = usacoSilverCourse.modules.flatMap(module =>
			module[assignment.section]
				.filter(item =>
					item.projectLink?.endsWith(`/${pack.folder}/starter`)
				)
				.map(item => ({ module, item }))
		);
		if (
			matches.length !== 1 ||
			matches[0]!.module.title !== assignment.moduleTitle
		) {
			throw new Error(
				`Missing or ambiguous Silver source: ${pack.folder}`
			);
		}
		const { item } = matches[0]!;
		item.id = assignment.itemId;
		item.title = assignment.title;
		item.learningPath = assignment.learningPath;
		item.projectLink = `https://github.com/instruction-material/USACO-Silver/tree/${pack.revision}/${pack.folder}/starter`;
		item.solutionLink = `https://github.com/instruction-material/USACO-Silver/tree/${pack.revision}/${pack.folder}/solution`;
	}
}
