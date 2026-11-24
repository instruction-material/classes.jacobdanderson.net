import type { RawCourse, RawCourseModuleItem } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

const USACO_CONTESTS = "https://usaco.org/index.php?page=contests";
const USACO_CONTEST_RULES = "https://usaco.org/index.php?page=instructions";
const USACO_2025_BRONZE_PROBLEM =
	"https://usaco.org/index.php?page=viewproblem2&cpid=1468";
const USACO_2026_BRONZE_PROBLEM =
	"https://usaco.org/index.php?page=viewproblem2&cpid=1563";
const USACO_2026_CONTEST_RESULTS =
	"https://usaco.org/index.php?page=season26contest2results";

const usacoBronzeSourceCourse: RawCourse = {
	name: "USACO Bronze",
	modules: [
		{
			title: "USB0 Setup and Contest Workflow",
			curriculum: [
				{
					title: "USACO File I/O and Submission Rhythm",
					content:
						"Set up a clean competitive-programming workflow with fast compile-run cycles, local sample files, and disciplined input/output handling. Contest success depends on fast iteration and careful reading, not on large project scaffolding."
				},
				{
					title: "Bronze-Level Problem Framing",
					content:
						"This section treats Bronze problems as exercises in accurate simulation, manageable brute force, careful counting, and well-structured conditionals. Many Bronze tasks become approachable once the story is translated into data and steps."
				},
				{
					title: "Trace First, Optimize Second",
					content:
						"Use handwritten traces and small custom tests before speed becomes the focus. Bronze work usually fails because of overlooked cases or incorrect translation, not because the code is too slow."
				},
				{
					title: "Language Strategy",
					content:
						"Choose the language that best supports current growth, while keeping problem-solving habits language-agnostic. Python is often enough for Bronze, while Java versions in the repo are useful preparation for later tiers."
				},
				{
					title: "USB0 Setup and Contest Workflow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "USB0 Setup and Contest Workflow",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Bronze Log: Setup and Contest Workflow",
					content:
						"Keep a short contest log for setup and contest workflow that records one wrong assumption, one edge case that broke an early idea, and one note about which part of the problem statement is easiest to misread under time pressure. Bronze-level progress comes from disciplined debugging as much as from knowing a trick.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java/solution"
				},
				{
					title: "UB 23 Why Did the Cow Cross the Road II Java",
					preserveInstructions: true,
					content:
						"Read one line from circlecross.in containing the 52 boundary points, with each letter A through Z appearing twice. Draw chords between matching letters. Two cows must cross when exactly one endpoint of the second cow lies between the first cow’s endpoints. Predict the count with ABAB followed by each letter C through Z doubled in order. Only A and B alternate, so circlecross.out is 1. Change the prefix to ABBA: nesting gives 0. Count each unordered pair once. The Java starter folder contains a README; write Main.java and run it beside the input.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-23-Why-Did-the-Cow-Cross-the-Road-II-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-23-Why-Did-the-Cow-Cross-the-Road-II-Java/solution"
				},
				{
					title: "UB 24 Why Did the Cow Cross the Road III Java",
					preserveInstructions: true,
					content:
						"Read N from cowqueue.in, then N pairs of arrival time and questioning duration. Draw a timeline in arrival order: each cow starts when both it and the gate are ready. Try two input rows, 2 2 then 1 4. The first arrival finishes at 5 and the waiting cow finishes at 7, so cowqueue.out contains 7. Change the rows to 4 2 then 1 1: the gate is idle from 2 to 4 and the last cow finishes at 6. Start Main.java from a blank file and explain why summing durations alone misses idle time.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-24-Why-Did-the-Cow-Cross-the-Road-III-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-24-Why-Did-the-Cow-Cross-the-Road-III-Java/solution"
				}
			]
		},
		{
			title: "Unit 1: Simulation and Careful Translation",
			curriculum: [
				{
					title: "Turn Story Problems into Variables and Steps",
					content:
						"Translate narrative wording into a tiny model: what is tracked, what changes each step, and when the answer is updated. The first win at Bronze is usually accurate modeling, not deep theory."
				},
				{
					title: "Follow the Rules Exactly",
					content:
						"Bronze problems often reward literal implementation of a process. In The Lost Cow, Farmer John aims first one unit right of his original position, then two left, then four right. Each leg begins where the previous leg ended. Stop at the first sighting, even partway through a leg."
				},
				{
					title: "Make Small Custom Tests",
					content:
						"Use intentionally tiny cases to catch off-by-one mistakes and state-update errors. Leave this unit knowing that small tests are the fastest path to correctness."
				},
				{
					title: "Use Tables and Traces",
					content:
						"Trace lostcow.in containing 3 1 together. The legs from 3 to 4 and from 4 to 1 cost 1 and 3, giving 4 in lostcow.out. Now predict the result for 3 5 before your partner reveals the last leg. From 1 the next endpoint is 7, but the search stops at 5. The distances 1, 3 and 4 give 8. Charging the entire final leg would give 10."
				},
				{
					title: "Unit 1: Simulation and Careful Translation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 1: Simulation and Careful Translation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Square Pasture",
					content:
						"Use geometric bounds and direct translation to practice reading a short statement carefully and converting it into a compact calculation.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/solution"
				},
				{
					title: "Problem: Your Ride Is Here",
					preserveInstructions: true,
					content:
						"Read two uppercase names of one to six letters from ride.in, one per line. Assign values in alphabet order, starting at 1 for A and ending at 26 for Z. Multiply each name’s letter values and compare the remainders modulo 47. Before running, ask your partner whether unequal products can match. For BX and A, the products 48 and 1 both leave remainder 1, so ride.out contains GO. Change BX to BY: 50 leaves remainder 3, so the answer becomes STAY. Start a blank Python file; the starter folder contains a README. Write just the decision and a newline.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here/solution"
				},
				{
					title: "Problem: Transformations",
					content:
						"Practice rule-driven simulation by applying each transformation as a named case, comparing the resulting grid to the target, and stopping only after the fallback case is justified. A strong solution keeps rotation, reflection, and combination logic separate enough to debug with a tiny custom pattern.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations/solution"
				},
				{
					title: "Square Pasture Java",
					preserveInstructions: true,
					content:
						"Draw the two pastures from square.in on one set of axes. Each line gives the lower-left corner followed by the upper-right corner. For `0 0 1 1` and `3 0 5 2`, ask which pair of edges forces the side of the new square. The width is 5 and the height is 2, so square.out should contain 25. Implement the four bounds in Main.java and compare your drawing with the result.\n\n**Checkpoints:** Change the second line to `0 3 2 6`. Predict the area of 36 from the vertical span. Reverse the lines and explain why the same four bounds survive.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture-Java/solution"
				}
			]
		},
		{
			title: "Unit 2: Intervals, Arrays, and Greedy Warmups",
			curriculum: [
				{
					title: "Intervals and Coverage Thinking",
					content:
						"Reason about segments, overlaps, and gaps with small sorted lists or interval scans. Many Bronze tasks become easier once the timeline or number line is made explicit."
				},
				{
					title: "Greedy Choice with Just Enough Justification",
					content:
						"Small greedy arguments apply when choosing the earliest finish, largest gap, or best local option can be justified clearly. At Bronze level, the proof stays intuitive but still needs to be named aloud."
				},
				{
					title: "Scanning Arrays for Best Answers",
					content:
						"Use running best values, counts, and interval endpoints to show how one pass over data can be enough. This reinforces efficient habits without turning the unit into a complexity lecture."
				},
				{
					title: "Sorted Input as a Strategic Advantage",
					content:
						"Sort when it clarifies the structure of the task. Bronze solutions often become dramatically simpler once the data is in a useful order."
				},
				{
					title: "Unit 2: Intervals, Arrays, and Greedy Warmups: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 2: Intervals, Arrays, and Greedy Warmups",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Milking Cows",
					content:
						"Use interval merging and longest-gap reasoning to practice scanning sorted ranges carefully. The key checkpoint is explaining when two intervals count as continuous milking, when a true idle gap begins, and why sorting by start time makes the one-pass scan trustworthy.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows/solution"
				},
				{
					title: "Problem: Barn Repair",
					preserveInstructions: true,
					content:
						"Mark occupied stalls 1, 2, 9 and 10 on a line of 12. With one board the covered span is 10. Ask where to split it if two boards are available: skipping stalls 3 through 8 saves six, giving 4. In barn1.in enter 2 12 4 followed by the four occupied numbers on separate lines. Start a blank Python file and compare barn1.out with your drawing. Try the same positions in reverse input order; the answer should still be 4.\n\n**Checkpoints:** Mark the two board endpoints in each drawing. Compare their total length with the program output.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB12-Barn-Repair/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB12-Barn-Repair/solution"
				},
				{
					title: "Problem: Speeding Ticket",
					content:
						"Practice range comparisons and piecewise simulation while keeping the data model simple enough to debug quickly. The solution states how each mile segment receives a limit and an actual speed, then reports the maximum violation rather than only whether a violation happened.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket/solution"
				}
			]
		},
		{
			title: "Unit 3: Counting, Sorting, and Ranking",
			curriculum: [
				{
					title: "Frequency and Ranking Problems",
					content:
						"Count occurrences, rank values, and compare groups without overcomplicating the data structures. Many Bronze tasks can be solved with careful counts and sorted lists alone."
				},
				{
					title: "Look for the Key Ordering",
					content:
						"Sorting often reveals the decisive pattern in a Bronze problem. Once data is ordered, the main logic may shrink to a single pass or a compact window scan."
				},
				{
					title: "Explain the Metric Being Optimized",
					content:
						"State exactly what quantity is being maximized, minimized, or counted. This helps prevent the common mistake of solving a nearby but different problem."
				},
				{
					title: "Compare Similar Solutions",
					content:
						"Compare two plausible but different approaches and identify why one is safer, simpler, or more general. This builds real contest judgment."
				},
				{
					title: "Unit 3: Counting, Sorting, and Ranking: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 3: Counting, Sorting, and Ranking",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Diamond Collector",
					content:
						"Use sorting and window-style reasoning to capture the largest valid group under a size-difference constraint. The final explanation identifies the sorted invariant, why the left edge only moves forward, and which sample cases prove that duplicate sizes and boundary-equal differences are handled correctly.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector/solution"
				},
				{
					title: "Problem: Promotion Counting",
					content:
						"Practice tier-by-tier counting and careful propagation of totals through a simple structure. Work from the highest division downward, track how many animals must have moved up at each boundary, and verify that the intermediate totals reconcile with the before-and-after counts.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB31-Promotion-Counting/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB31-Promotion-Counting/solution"
				},
				{
					title: "Problem: Acowdemia",
					content:
						"Use ranking and threshold logic to reinforce the habit of naming the exact score or count the problem asks for.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB54-Acowdemia/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB54-Acowdemia/solution"
				},
				{
					title: "Transformations Java",
					preserveInstructions: true,
					content:
						"Draw the source grid `@-- / -@@ / @-@` and mark its upper-left cell. Ask where that cell lands after a clockwise quarter-turn. With zero-based indices, (row, column) becomes (column, N−1−row). Use a fresh Java array so writing a destination cannot erase a source cell. In transform.in write 3, the three source rows and then the three target rows, each on its own line. For target `@-@ / -@- / @@-`, transform.out should contain 1.\n\n**Checkpoints:** Compare the cells in every row. Try the unchanged asymmetric grid for 6, then a one-cell `@` mapped to itself for 1. Explain which earlier match wins.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations-Java/solution"
				}
			]
		},
		{
			title: "Unit 4: Search-Flavored Bronze Problems",
			curriculum: [
				{
					title: "Path Simulation and Reachability",
					content:
						"Bronze problems can feel a little more graph-like or stateful without demanding heavy graph theory. The main habit is staying organized as the state space becomes less linear."
				},
				{
					title: "Track Structure Explicitly",
					content:
						"Use tables, parent relationships, or step histories when the problem involves movement, ancestry, or repeated transitions. Explicit structure prevents guessing."
				},
				{
					title: "Separate Representation from Process",
					content:
						"Decide what data structure best represents the problem before choosing the algorithmic loop that uses it. This is the first step toward Silver-level thinking."
				},
				{
					title: "Stay Grounded in Bronze Simplicity",
					content:
						"Even when a problem hints at graphs or search, Bronze solutions are usually still modest. Avoid overengineering the problem beyond what the constraints require."
				},
				{
					title: "Unit 4: Search-Flavored Bronze Problems: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 4: Search-Flavored Bronze Problems",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: The Lost Cow",
					content:
						"Use path simulation to model repeated movement and distance accumulation carefully. The important evidence is a trace of each outward sweep, including overshooting the target, so the total distance reflects the route actually traveled rather than only the difference between endpoints.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow/solution"
				},
				{
					title: "Problem: Wormholes",
					content:
						"Treat pairings and repeated movement as a structured search exercise with a clear, bounded state space. Build the pairing recursively, simulate rightward travel through paired wormholes, and include a termination argument showing how a repeated state reveals a cycle.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB16-Wormholes/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB16-Wormholes/solution"
				},
				{
					title: "Problem: Family Tree",
					content:
						"Use parent and ancestor reasoning to practice a light graph-style relationship problem without leaving Bronze territory. The solution compares ancestor chains, distinguishes direct parent-child relationships from cousins or siblings, and explains why the reported relationship is the most specific valid one.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB51-Family-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB51-Family-Tree/solution"
				}
			]
		},
		{
			title: "Unit 5: Contest Sets and Tier Transition",
			curriculum: [
				{
					title: "Bundle Problems by Pattern",
					content:
						"Practice solving short sets of problems that share a theme such as simulation, intervals, or counting. Start to recognize families of Bronze tasks instead of experiencing each prompt as brand new."
				},
				{
					title: "Know When Bronze Is Solved",
					content:
						"Stop polishing once the solution is clearly correct, tested, and within constraints. This is important for contest pacing and prevents time loss on unnecessary rewrites."
				},
				{
					title: "Reflect on Weak Spots",
					content:
						"Use logs to identify whether the main obstacle is misreading statements, building the wrong state model, weak test design, or overcomplicating simple tasks. Bronze growth is very diagnosable when the evidence is tracked honestly."
				},
				{
					title: "Prepare for USACO Silver",
					content:
						"Close by identifying the habits that carry forward: stronger use of sorting, cleaner state models, comfort with custom tests, and willingness to justify an approach before coding. Move to `USACO Silver` only once these habits are stable."
				},
				{
					title: "Unit 5: Contest Sets and Tier Transition: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 5: Contest Sets and Tier Transition",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Milking Order",
					content:
						"Use ordering constraints and careful placement to rehearse the kind of structured reasoning that starts to appear near the top of Bronze.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order/solution"
				},
				{
					title: "Problem: Feeding the Cows",
					content:
						"Use a late-Bronze constraint problem to test whether the solution stays simple under a more layered prompt. Focus on placing feed as far right as safely possible, tracking which cows are already covered, and proving the greedy placement does not waste future coverage.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB63-Feeding-the-Cows/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB63-Feeding-the-Cows/solution"
				},
				{
					title: "Problem: Just Stalling",
					content:
						"Use a counting-and-ordering problem as a final check for combining sorting with a careful interpretation of what is being counted.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB55-Just-Stalling/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB55-Just-Stalling/solution"
				},
				{
					title: "Mixing Milk Java",
					preserveInstructions: true,
					content:
						"How much does it cost to buy exactly eight units? Put `8 3` in milk.in, followed by three lines: `5 6`, `2 3`, `2 2`. Each offer lists the price per unit first and the available quantity second. With a partner, mark which units to buy before sorting the offers in Java. The two cheaper farms supply five units for 10. Three more at 5 each bring milk.out to 25.\n\n**Checkpoints:** Change the demand to five. The answer falls to 10. Which purchase disappeared? To replay the supplied reference, compile `javac Main.java` and run `java milk` beside milk.in.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk-Java/solution"
				}
			]
		},
		{
			title: "Unit 6: Optional Bronze Problem Bank",
			curriculum: [
				{
					title: "How to Read the Repo Bank",
					content:
						"Treat the extra `USACO-Bronze` repo folders as an optional canonical problem bank rather than as hidden missing lessons. The public course keeps a curated spine, while the repo holds a broader set of classical and modern Bronze problems for extra practice."
				},
				{
					title: "Classical Bronze Bank",
					content:
						"Classical training problems in the repo include `UB3 Friday the Thirteenth`, `UB4 Broken Necklace`, `UB5 Greedy Gift Givers`, `UB7 Name That Number`, `UB8 Palindromic Squares`, `UB9 Dual Palindromes`, `UB11 Mixing Milk`, `UB13 Combination Lock`, `UB14 Prime Cryptarithm`, and `UB15 Ski Course Design`."
				},
				{
					title: "Simulation, Arrays, and Grid Practice",
					content:
						"Mid-course optional problems include `UB17 Block Game`, `UB18 The Cow Signal`, `UB19 Don't Be Last`, `UB20 Hoof Paper Scissors`, `UB21 Cow Tipping`, `UB22/UB23/UB24 Why Did the Cow Cross the Road`, `UB26 Bovine Genomics`, `UB27 Modern Art`, and `UB28 Fence Painting`."
				},
				{
					title: "Late Bronze and Modern Contest Bank",
					content:
						"Later optional repo practice includes `UB30 Contaminated Milk`, `UB32 Angry Cows`, `UB33 Mowing the Field`, `UB34 Milk Pails`, `UB35 Circular Barn`, `UB36 Load Balancing`, `UB38 Bull in a China Shop`, `UB39 Field Reduction`, `UB40/UB43 Blocked Billboard`, `UB41 The Bovine Shuffle`, `UB42 Milk Measurement`, `UB44 Lifeguards`, `UB45 Out of Place`, `UB46 Teleportation`, `UB47 Hoofball`, `UB48 Taming the Herd`, `UB49 Team Tic-Tac-Toe`, `UB52 Do You Know Your ABCs`, `UB53 Daisy Chains`, `UB56 Photoshoot`, `UB57 Photoshoot 2`, `UB58 Air Cownditioning`, `UB59 Non-Transitive Dice`, `UB60 Rotate and Shift`, `UB61 FEB`, and `UB62 Cow College`."
				},
				{
					title: "Language Variants",
					content:
						"The repo also contains parallel `-Java` versions for many Bronze problems. Treat the plain folder as the canonical public problem entry and the `-Java` mirror as an alternate language path rather than as a duplicate lesson."
				},
				{
					title: "Unit 6: Optional Bronze Problem Bank: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 6: Optional Bronze Problem Bank",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Problem Bank: Full Bronze Repo",
					content:
						"Browse the full Bronze repo bank, including the Python-side canonical problems and their parallel Java mirrors, when the curated course spine is not enough practice.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main"
				},
				{
					title: "Problem: Mixing Milk",
					content:
						"Use repeated pour operations to rehearse careful simulation and container-state updates. Each pour updates both source and destination amounts from the same transfer value, with a short trace showing that capacity limits and empty-source cases behave correctly.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk/solution"
				},
				{
					title: "Problem: Hoof, Paper, Scissors",
					content:
						"Use case-based counting and matchup reasoning to strengthen simple game-logic analysis. Enumerate the possible winning rule assignments, count how many rounds each assignment wins, and explain why trying the small complete set is safer than hard-coding one assumed rule order.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB20-Hoof-Paper-Scissors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB20-Hoof-Paper-Scissors/solution"
				},
				{
					title: "Problem: Circular Barn",
					content:
						"Use a stronger late-Bronze simulation and counting problem to test whether state modeling stays clean under more layered movement.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB35-Circular-Barn/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB35-Circular-Barn/solution"
				},
				{
					title: "Problem: Cow College",
					content:
						"Use a late Bronze optimization prompt to practice sorting, revenue reasoning, and clear objective definition. Sort tuition offers, evaluate each candidate price by the number of cows willing to pay it, and record how ties are handled so the chosen answer matches the stated output rule.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB62-Cow-College/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB62-Cow-College/solution"
				}
			]
		},
		{
			title: "UB 12 Barn Repair Java: Practice Studio",
			curriculum: [
				{
					title: "UB 12 Barn Repair Java: Core Concepts",
					preserveInstructions: true,
					content:
						"A board covers a continuous run of stalls, including both endpoints. Cover every occupied stall with at most M boards while minimizing total covered stalls. Sort the occupied positions. Begin with one board from the first cow to the last. Each extra board lets you leave one internal gap uncovered. Which gap would you skip first, and why?"
				},
				{
					title: "UB 12 Barn Repair Java: Guided Example",
					preserveInstructions: true,
					content:
						"Draw stalls 1 through 12 with cows at 1, 2, 9 and 10. Predict the answer with one board before drawing it: stalls 1 through 10 cost 10. With two boards, cover 1–2 and 9–10. The six empty stalls between the groups account for the change from 10 to 4. Ask a partner why the two empty stalls after stall 10 never enter the calculation."
				},
				{
					title: "UB 12 Barn Repair Java: Core Project",
					preserveInstructions: true,
					content:
						"Start a blank Main.java. In barn1.in the first line gives M (board limit), S (stall count), and C (occupied stalls), followed by C lines with one occupied stall each. Write the minimum total covered length and a newline to barn1.out. Sort the stall numbers, compute gaps between consecutive cows, and deduct at most M−1 of the largest gaps from the inclusive span. Test 2 12 4 followed by 9, 1, 10, 2 on separate lines. The result should be 4 even with unsorted input. Compile with javac Main.java and run java Main in the input directory.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java/solution"
				},
				{
					title: "UB 12 Barn Repair Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"For cows at 1, 4 and 7 with two boards, there are two equally large gaps. Draw both optimal covers. Either choice saves two stalls from the span of seven, giving 5. Explain why subtracting the distance between cows would save one stall too many."
				}
			],
			supplementalProjects: [
				{
					title: "UB 12 Barn Repair Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"Predict how allowing more boards changes the answer for cows at 1, 4 and 7. Run separate cases with limits of one, two and four boards. Expect 7, 5 and 3. Explain why the last answer cannot fall below the number of occupied stalls.\n\n**Checkpoints:** Draw both optimal two-board placements. Label the unused gap and the total length in each drawing.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java/solution"
				},
				{
					title: "Combination Lock",
					preserveInstructions: true,
					content:
						"Start a Python file for the linked practice problem. Put 10, then `1 1 1`, then `6 6 6` on separate lines in combo.in. Draw a ten-position dial and circle the five settings within two steps of 1. Repeat for 6. Ask whether `(1,6,1)` opens the lock. Its positions match parts of different keys, so neither complete key admits it.\n\n**Checkpoints:** Each key admits 125 ordered triples here. The two sets are disjoint, so combo.out should contain 250. Change the second key to match the first and predict why the count falls to 125.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB13-Combination-Lock/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB13-Combination-Lock/solution"
				},
				{
					title: "Prime Cryptarithm",
					preserveInstructions: true,
					content:
						"Use a blank Python file for this practice. Put `5` on the first line of crypt1.in and `2 3 4 6 8` on the second. Form a three-digit number and a two-digit multiplier using only those digits, with repetition allowed. Each unshifted partial product must have three allowed digits, and the total must have four. Compare `222 × 22` with `242 × 34` on paper before counting.\n\n**Checkpoints:** The first gives 444, 444 and 4884. The second ends in 8228, but its partial products 968 and 726 contain forbidden digits. Only the first multiplication qualifies for this input, so crypt1.out contains 1.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB14-Prime-Cryptarithm/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB14-Prime-Cryptarithm/solution"
				}
			]
		},
		{
			title: "UB 13 Combination Lock Java: Practice Studio",
			curriculum: [
				{
					title: "UB 13 Combination Lock Java: Core Concepts",
					preserveInstructions: true,
					content:
						"A dial labeled 1 through N wraps from N back to 1. For labels a and b, compare their direct distance with the distance around the other side. On a ten-position dial, 9 is two steps from 1. A three-dial setting opens the lock if every dial is within two steps of the corresponding dial on one complete key. With keys `(1,1,1)` and `(6,6,6)`, ask which key admits `(10,2,1)` and why neither admits `(1,6,1)`."
				},
				{
					title: "UB 13 Combination Lock Java: Guided Example",
					preserveInstructions: true,
					content:
						"Draw the two neighborhoods on a ten-position dial. Around 1 the labels are 9, 10, 1, 2 and 3. Around 2 they are 10, 1, 2, 3 and 4. For keys `(1,1,1)` and `(2,2,2)`, each key admits 5³ settings. Ask how many would be counted twice. Four shared labels on each dial give 4³ shared settings, so the union contains 125 + 125 − 64 = 186."
				},
				{
					title: "UB 13 Combination Lock Java: Core Project",
					preserveInstructions: true,
					content:
						"In Main.java read combo.in as N followed by two lines with three dial labels each. Enumerate each ordered triple of labels from 1 through N. Count the triple once when it passes the three distance checks for either complete key. Write the total on one line in combo.out.\n\n**Checkpoints:** With N = 10, use `1 1 1` and `2 2 2` to get 186. Have a partner move the second key to `6 6 6`. Predict 250 and point to the condition that keeps mixed-key triples out.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java/solution"
				},
				{
					title: "UB 13 Combination Lock Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"Compare two wrong totals for the ten-position example with keys `(1,1,1)` and `(2,2,2)`. A total of 250 counts the shared 64 triples twice. A total of 216 accepts every combination of the six labels in the two neighborhoods. Ask which of those triples uses labels unique to opposite keys. For instance `(9,4,1)` fails both complete keys. Use that triple to explain the difference between the two mistakes."
				}
			],
			supplementalProjects: [
				{
					title: "UB 13 Combination Lock Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"Shrink the dial until a turn of two steps in opposite directions can reach the same label. Use keys `1 1 1` and `2 2 2`. For N = 5, each key reaches every label, so the answer is 125. Predict the answer for N = 4 before running Main.java.\n\n**Checkpoints:** List the distinct labels reachable on one four-position dial and justify the total of 64 triples. At N = 1 both keys must be `1 1 1`. Check that the program counts exactly one setting.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java/solution"
				},
				{
					title: "Ski Course Design",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 13 Combination Lock Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB15-Ski-Course-Design/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB15-Ski-Course-Design/solution"
				},
				{
					title: "Block Game",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 13 Combination Lock Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB17-Block-Game/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB17-Block-Game/solution"
				}
			]
		},
		{
			title: "UB 14 Prime Cryptarithm Java: Practice Studio",
			curriculum: [
				{
					title: "UB 14 Prime Cryptarithm Java: Core Concepts",
					preserveInstructions: true,
					content:
						"Write a three-digit number over a two-digit multiplier as in long multiplication. Each position draws from the same list of digits 1 through 9, and a digit may appear several times. Multiply the top number by each bottom digit separately. Both partial products must have exactly three digits from the list. Add the units partial to ten times the tens partial. The resulting four digits must also belong to the list. Where does the factor of ten enter a handwritten calculation?"
				},
				{
					title: "UB 14 Prime Cryptarithm Java: Guided Example",
					preserveInstructions: true,
					content:
						"Work through `222 × 22` using the digits 2, 3, 4, 6 and 8. Both partial products are 444. The tens row contributes 4440 after shifting, giving a final product of 4884. The zero used to align that row is a place-value marker. The digit test applies to the unshifted 444. Now try `242 × 34`. Its final product, 8228, passes the digit test. Which digit rules out its units partial, 968?"
				},
				{
					title: "UB 14 Prime Cryptarithm Java: Core Project",
					preserveInstructions: true,
					content:
						"In Main.java, read the number of allowed digits and the space-separated digit list from crypt1.in. Enumerate the three positions in the top number and the two in the multiplier. Test the two unshifted partial products and the final product, then count each qualifying pair once. Write that count to crypt1.out.\n\n**Checkpoints:** With `2` followed by `1 2`, the only pair is `111 × 11`, giving 1221. The output is 1. With `3` followed by `1 2 3`, the output is 7. Trace one new pair, `111 × 12`, through both partial-product checks.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java/solution"
				},
				{
					title: "UB 14 Prime Cryptarithm Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"A program checks the factors and final product and accepts `121 × 34` for allowed digits 1, 2, 3 and 4. Test that decision with a partner. The result is 4114, but the units partial is 484 and the tens partial is 363. Identify the forbidden digit in each row. Run crypt1.in with `4` followed by `1 2 3 4`. The correct count is 21. Which checks would prevent this particular false positive?"
				}
			],
			supplementalProjects: [
				{
					title: "UB 14 Prime Cryptarithm Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"A digit can be allowed and still appear in a row of the wrong width. With digits 1 through 6, trace `221 × 16`. The final product 3536 and both partial products use allowed digits. The units partial, 1326, needs four places, so this pair must be rejected.\n\n**Checkpoints:** Put `6` followed by `1 2 3 4 5 6` in crypt1.in. Predict the decision for this pair before checking the total of 137. Repeat with only `1 2 3 4` and a first line of `4`. Explain why the count falls to 21.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java/solution"
				},
				{
					title: "The Cow Signal",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 14 Prime Cryptarithm Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB18-The-Cow-Signal/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB18-The-Cow-Signal/solution"
				},
				{
					title: "Don't Be Last",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 14 Prime Cryptarithm Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB19-Dont-Be-Last/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB19-Dont-Be-Last/solution"
				}
			]
		},
		{
			title: "UB 15 Ski Course Design Java: Practice Studio",
			curriculum: [
				{
					title: "UB 15 Ski Course Design Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 15 Ski Course Design Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 15 Ski Course Design Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java/solution"
				},
				{
					title: "UB 15 Ski Course Design Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 15 Ski Course Design Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java/solution"
				},
				{
					title: "Your Ride Is Here Java",
					preserveInstructions: true,
					content:
						"Use this mirror to transfer the two-name test to Java. Start Main.java from a blank file. Read two lines from ride.in. For each uppercase letter, multiply the running product by letter - 'A' + 1 and reduce modulo 47. Compare the two final remainders and write GO or STAY plus a newline to ride.out. Predict BX with A, then BY with A. Compile with javac Main.java and run java Main from the input directory. Compare the output files to GO and STAY respectively before opening the reference.\n\n**Checkpoints:** Record the two residues for each test so a mismatch can be traced to multiplication or comparison.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here-Java/solution"
				},
				{
					title: "Cow Tipping",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB21-Cow-Tipping/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB21-Cow-Tipping/solution"
				}
			]
		},
		{
			title: "UB 16 Wormholes Java: Practice Studio",
			curriculum: [
				{
					title: "UB 16 Wormholes Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 16 Wormholes Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 16 Wormholes Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/solution"
				},
				{
					title: "UB 16 Wormholes Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 16 Wormholes Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/solution"
				},
				{
					title: "Why Did the Cow Cross the Road",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB22-Why-Did-the-Cow-Cross-the-Road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB22-Why-Did-the-Cow-Cross-the-Road/solution"
				},
				{
					title: "Why Did the Cow Cross the Road II",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB23-Why-Did-the-Cow-Cross-the-Road-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB23-Why-Did-the-Cow-Cross-the-Road-II/solution"
				}
			]
		},
		{
			title: "UB 17 Block Game Java: Practice Studio",
			curriculum: [
				{
					title: "UB 17 Block Game Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 17 Block Game Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 17 Block Game Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/solution"
				},
				{
					title: "UB 17 Block Game Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 17 Block Game Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/solution"
				},
				{
					title: "Why Did the Cow Cross the Road III",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB24-Why-Did-the-Cow-Cross-the-Road-III/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB24-Why-Did-the-Cow-Cross-the-Road-III/solution"
				},
				{
					title: "The Lost Cow Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow-Java/solution"
				}
			]
		},
		{
			title: "UB 18 The Cow Signal Java: Practice Studio",
			curriculum: [
				{
					title: "UB 18 The Cow Signal Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 18 The Cow Signal Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 18 The Cow Signal Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/solution"
				},
				{
					title: "UB 18 The Cow Signal Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 18 The Cow Signal Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/solution"
				},
				{
					title: "Bovine Genomics",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics/solution"
				},
				{
					title: "Bovine Genomics Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics-Java/solution"
				}
			]
		},
		{
			title: "UB 19 Don't Be Last Java: Practice Studio",
			curriculum: [
				{
					title: "UB 19 Don't Be Last Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 19 Don't Be Last Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 19 Don't Be Last Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/solution"
				},
				{
					title: "UB 19 Don't Be Last Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 19 Don't Be Last Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/solution"
				},
				{
					title: "Modern Art",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art/solution"
				},
				{
					title: "Modern Art Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art-Java/solution"
				}
			]
		},
		{
			title: "UB 20 Hoof Paper Scissors Java: Practice Studio",
			curriculum: [
				{
					title: "UB 20 Hoof Paper Scissors Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/solution"
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 20 Hoof Paper Scissors Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/solution"
				},
				{
					title: "Fence Painting",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting/solution"
				},
				{
					title: "Fence Painting Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting-Java/solution"
				}
			]
		},
		{
			title: "UB 21 Cow Tipping Java: Practice Studio",
			curriculum: [
				{
					title: "UB 21 Cow Tipping Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 21 Cow Tipping Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 21 Cow Tipping Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/solution"
				},
				{
					title: "UB 21 Cow Tipping Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 21 Cow Tipping Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/solution"
				},
				{
					title: "Speeding Ticket Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket-Java/solution"
				},
				{
					title: "Friday the Thirteenth",
					preserveInstructions: true,
					content:
						"Draw a January 1900 calendar together, starting Monday. The 13th falls on Saturday. January has 31 days, so February’s 13th is three weekdays later, Tuesday. Mark March’s 13th before opening the Python reference. February 1900 has 28 days, so March also lands on Tuesday. Use friday.in with 1 year and tally every month.\n\n**Checkpoints:** Read friday.out from Saturday through Friday. The row should be `2 1 1 3 1 2 2`. Match the Tuesday count to the calendar and explain why all seven counts sum to 12.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB3-Friday-the-Thirteenth/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB3-Friday-the-Thirteenth/solution"
				}
			]
		}
	]
};

const USACO_BRONZE_PRIMARY_TITLES = new Set([
	"USB0 Setup and Contest Workflow",
	"Unit 1: Simulation and Careful Translation",
	"Unit 2: Intervals, Arrays, and Greedy Warmups",
	"Unit 3: Counting, Sorting, and Ranking",
	"Unit 4: Search-Flavored Bronze Problems",
	"Unit 5: Contest Sets and Tier Transition"
]);

const USACO_BRONZE_FLOW: Record<
	string,
	{
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"USB0 Setup and Contest Workflow": {
		estimatedTime: "3 sessions · 45–75 minutes each",
		keyBlocks: [
			"current contest rules",
			"standard input and output",
			"legacy file input and output",
			"sample and custom tests",
			"protected contest mode"
		],
		flowNote:
			"Establish a current contest workflow before solving for speed. Read the live rules, distinguish modern standard input/output from legacy file tasks, reproduce sample output exactly, build small custom tests, and practice a protected mode that matches USACO integrity requirements."
	},
	"Unit 1: Simulation and Careful Translation": {
		estimatedTime: "5 sessions · 45–75 minutes each",
		keyBlocks: [
			"state model",
			"simulation invariant",
			"update order",
			"tiny oracle",
			"boundary case"
		],
		flowNote:
			"Turn each story into state, transitions, and an answer update. Prove the simulation on tiny cases with a hand-computed oracle, then test first, last, equal, empty-or-minimum, and overshoot boundaries before considering a shortcut."
	},
	"Unit 2: Intervals, Arrays, and Greedy Warmups": {
		estimatedTime: "5 sessions · 45–75 minutes each",
		keyBlocks: [
			"constraint budget",
			"interval ordering",
			"greedy exchange",
			"64-bit range",
			"one-pass invariant"
		],
		flowNote:
			"Use constraints to choose a safe work budget, then apply sorted intervals, scans, and small greedy choices with an explicit invariant. Check numeric range before coding and use 64-bit values whenever the largest legal count, product, or sum can exceed 32-bit storage."
	},
	"Unit 3: Counting, Sorting, and Ranking": {
		estimatedTime: "5 sessions · 45–75 minutes each",
		keyBlocks: [
			"frequency map",
			"distinct set",
			"prefix count",
			"sorted order",
			"large-input test"
		],
		flowNote:
			"Choose among direct counts, maps, sets, sorting, and prefix counts based on value range and query shape. State what is counted, what makes two results distinct, and why the chosen representation fits the largest legal input."
	},
	"Unit 4: Search-Flavored Bronze Problems": {
		estimatedTime: "5 sessions · 45–75 minutes each",
		keyBlocks: [
			"complete search",
			"bounded state",
			"constructive witness",
			"multiple test cases",
			"termination argument"
		],
		flowNote:
			"Use complete search when the state space is provably small, and use direct structured simulation when it is not. Modern Bronze work may ask for a witness as well as YES/NO, so verify both feasibility and the constructed output across multiple test cases."
	},
	"Unit 5: Contest Sets and Tier Transition": {
		estimatedTime: "6–8 sessions · 60–90 minutes each",
		keyBlocks: [
			"current official set",
			"timed contest",
			"partial-credit plan",
			"WA/TLE/RTE postmortem",
			"Silver readiness"
		],
		flowNote:
			"Calibrate against recent official Bronze problems, then complete a protected three-problem mock and a structured postmortem. Read promotion criteria from each live contest rather than assuming a fixed threshold, and move to Silver only after independent Bronze accuracy is repeatable."
	}
};

function bronzeOptionPath(title: string) {
	return /challenge|wormholes|prime|ski|circular|cow college|feeding|milking order|acowdemia|late bronze|silver/i.test(
		title
	)
		? ("challenge" as const)
		: ("choice" as const);
}

function strengthenBronzeItem(item: RawCourseModuleItem): RawCourseModuleItem {
	if (item.title === "USACO File I/O and Submission Rhythm") {
		return {
			...item,
			title: "Modern Standard I/O and Legacy File I/O",
			content:
				"Read each problem's input/output specification literally. Current contests use terminal-based standard input and output; most tasks before December 2020 use exact case-sensitive filenames from the statement. Produce only the requested output, include final newlines, never pause for a keypress, and test the same I/O mode that the judge will use."
		};
	}

	if (item.title === "Bronze-Level Problem Framing") {
		return {
			...item,
			content:
				"Frame Bronze problems through constraints and observable behavior: direct simulation, complete search over a bounded space, counting, sorting, maps or sets, prefix counts, and justified greedy choices. Identify the input size, required output, subtask boundaries, and simplest approach that fits before writing code."
		};
	}

	if (item.title === "Trace First, Optimize Second") {
		return {
			...item,
			content:
				"Build a correct baseline and a tiny hand-worked oracle before optimizing. Then compare the baseline's operation count with the largest legal input; if it is too large, preserve the tested behavior while changing the representation or repeated work. For the road-crossing project, trace observations (cow, side) of (1, 0), (2, 1), (1, 0). Ask which earlier sighting belongs to cow 1. Neither cow has changed sides, so crossroad.out contains 0. Change only the last side to 1 and the output becomes 1. Record the first observation where a program that compares adjacent rows disagrees with your trace."
		};
	}

	if (item.title === "Language Strategy") {
		return {
			...item,
			content:
				"USACO accepts C, C++, Java, and Python under the live technical rules. Bronze problems are generally designed to remain solvable in Python, while C++ is the required language at IOI and becomes the safest long-term contest choice. Keep one language stable during a contest cycle, verify the current compiler or interpreter details before competing, and treat Java mirrors as an optional transfer path rather than duplicate required lessons."
		};
	}

	if (item.title === "Bronze Log: Setup and Contest Workflow") {
		return {
			...item,
			content:
				"Keep a compact problem log with the statement fact that controlled the solution, chosen complexity, numeric type, first wrong assumption, smallest failing case, judge outcome, and correction. Distinguish wrong answer, time limit, runtime or memory error, compile failure, and output-format failure so each submission produces a specific next action."
		};
	}

	if (item.title === "Prepare for USACO Silver") {
		return {
			...item,
			content:
				"Move to `USACO Silver` after independent Bronze evidence is repeatable: parse an unfamiliar statement, derive a constraint-safe approach, implement exact I/O, solve at least two problems in a protected mock, and repair a missed problem from a postmortem. Promotion thresholds vary by contest, so the live USACO result remains authoritative while this readiness gate protects the learning transition."
		};
	}

	return item;
}

function insertBronzeItem(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateBronzeModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = USACO_BRONZE_FLOW[module.title];
	let curriculum: RawCourseModuleItem[] = module.curriculum
		.map(strengthenBronzeItem)
		.map(item => ({ ...item, learningPath: "core" as const }));
	const coreProjectTitle = curriculum.at(-1)?.title ?? "";

	if (module.title === "USB0 Setup and Contest Workflow") {
		curriculum = insertBronzeItem(curriculum, coreProjectTitle, {
			title: "Current USACO Contest Contract",
			preserveInstructions: true,
			content: [
				"**Format:** A contest typically contains three or four algorithmic problems in one contiguous four-to-five-hour personal window. Scoring is by test cases, so a correct subtask can earn partial credit even when the full constraints remain unsolved.",
				"",
				"**Feedback:** Classify judge results as accepted, wrong answer, time limit, runtime or memory error, compile failure, empty output, or missing output. Passing the sample is only the first gate; hidden legal cases remain the real correctness test.",
				"",
				"**Live-rule check:** Language versions, technical limits, schedule, certification details, and promotion thresholds can change. Read the official instructions and active contest page before every contest."
			].join("\n"),
			projectLink: USACO_CONTEST_RULES,
			learningPath: "core"
		});
		curriculum = insertBronzeItem(curriculum, coreProjectTitle, {
			title: "Contest Integrity and Protected Mode",
			preserveInstructions: true,
			content: [
				"**Active-contest boundary:** Work alone. Generative AI, Copilot-style assistance, discussion, shared code, prewritten templates, solution resources, and automated submissions are prohibited. Only references for basic language syntax, libraries, and input/output are permitted.",
				"",
				"**Course practice:** Hints, reviews, and solution comparison happen only outside active contests and after an honest attempt. Protected mocks use the stricter active-contest boundary so independent readiness is measured accurately.",
				"",
				"**Evidence:** Begin from an empty solution file, retain the submitted source and result, and write the postmortem only after the timer or practice window ends.\n\n**Checkpoints:** Date the attempt and record which resources were used before and after the timer."
			].join("\n"),
			projectLink: USACO_CONTEST_RULES,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 1: Simulation and Careful Translation") {
		curriculum = insertBronzeItem(curriculum, coreProjectTitle, {
			title: "Simulation Invariant and Tiny Oracle Contract",
			content: [
				"**Before code:** Name the complete state, one transition, update order, stopping condition, and answer update.",
				"**Oracle:** Hand-compute at least three tiny fixtures, including a minimum case and a boundary or overshoot case.",
				"**After code:** Compare every step against the oracle, then add a case where two updates would produce a different result if their order were reversed.",
				"**Complexity:** Count simulated steps and verify the bound against the largest legal input."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "Unit 2: Intervals, Arrays, and Greedy Warmups") {
		curriculum = insertBronzeItem(curriculum, coreProjectTitle, {
			title: "Constraint, Complexity, and Numeric-Range Contract",
			content: [
				"**Constraint table:** Record every input bound, total bound across test cases, time limit, memory limit, and any sortedness or uniqueness guarantee.",
				"**Work budget:** State the candidate operation count before implementation and reject an approach that cannot fit the largest legal input.",
				"**Numeric range:** Compute the largest possible index, count, distance, sum, and product; use a 64-bit signed integer type in C++, Java `long`, or Python integers when 32-bit storage is unsafe.",
				"**Greedy evidence:** State the local choice and why exchanging or delaying it cannot improve the final answer."
			].join("\n"),
			projectLink: USACO_CONTEST_RULES,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 3: Counting, Sorting, and Ranking") {
		curriculum = insertBronzeItem(curriculum, coreProjectTitle, {
			title: "Frequency Maps, Sets, and Prefix Counts",
			preserveInstructions: true,
			content: [
				"Choose a direct array when the value range is small and known, a map for sparse key counts, a set for distinct membership, sorting when order exposes the structure, and prefix counts when many range or before/after queries repeat.",
				"",
				"Use the 2025 official Bronze problem as a modern calibration: its input reaches one million values, asks for distinct ordered patterns, arrives through standard input, and explicitly warns that the answer may need 64-bit storage. A moo is a subsequence a,b,b with a different from b. Group index triples by their values before counting. Ask a partner to trace 1 2 2 2: three index triples give the same moo, so print 1. Reorder the input to 2 2 2 1 and print 0. For a fixed b, which distinct values can appear before its second-to-last occurrence?"
			].join("\n"),
			projectLink: USACO_2025_BRONZE_PROBLEM,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 4: Search-Flavored Bronze Problems") {
		curriculum = insertBronzeItem(curriculum, coreProjectTitle, {
			title: "Complete Search and Constructive Output Contract",
			preserveInstructions: true,
			content: [
				"**Complete search:** Define the candidate state space, count its worst-case size, reject duplicates or invalid states early, and prove every legal candidate is considered.",
				"**Structured simulation:** Prefer a direct invariant when enumerating all states is unnecessary.",
				"**Constructive output:** For the linked keyboard problem, M appends M. O flips every earlier letter, then appends O. To validate the witness, ask a partner to replay MO: M becomes OO. Compare OM: O becomes OM. The last displayed letter always identifies the last key. To undo O, remove it and flip the remaining prefix; to undo M, just remove it. Reversing the steps gives exactly one sequence per target. Print YES alone for k=0, or YES and the keystrokes on the next line for k=1.",
				"**Multiple cases:** Reset all per-case state and use the stated total-input bound to justify aggregate runtime."
			].join("\n\n"),
			projectLink: USACO_2026_BRONZE_PROBLEM,
			learningPath: "core"
		});
	}

	if (module.title === "Unit 5: Contest Sets and Tier Transition") {
		curriculum = insertBronzeItem(curriculum, coreProjectTitle, {
			title: "Current Season and Analysis-Mode Archive",
			content:
				"Use the live USACO contest page to confirm the current season structure and the official result pages to find problem statements, test data, solutions, and post-contest analysis-mode submissions. Season structure and certification details can change, so avoid copying an old schedule into the readiness plan.",
			projectLink: USACO_CONTESTS,
			learningPath: "core"
		});
		curriculum = insertBronzeItem(curriculum, coreProjectTitle, {
			title: "2025–26 Bronze Calibration Set",
			content:
				"Use the official 2026 second-contest Bronze set as a current calibration point. Read all three statements before choosing an order, identify available subtasks, solve under protected conditions, then use the released solutions, test data, and analysis mode only after the timed attempt. Treat the reported 700 promotion threshold as specific to that contest, not a permanent Bronze rule.",
			projectLink: USACO_2026_CONTEST_RESULTS,
			learningPath: "core"
		});
		curriculum = insertBronzeItem(curriculum, coreProjectTitle, {
			title: "Mock Contest and Postmortem Contract",
			preserveInstructions: true,
			content: [
				"**Mock:** Use three unseen Bronze problems, one continuous timer, an empty file per problem, permitted syntax/library references only, and no AI, hints, discussion, templates, or solution viewing.",
				"**During the timer:** Record first-read complexity, attempt order, submission time, and judge outcome without turning the log into outside assistance.",
				"**Postmortem:** For every unsolved or partially solved problem, preserve the last attempt, identify statement/model/complexity/implementation/test failure, find the smallest counterexample, and produce a clean independent rewrite later.",
				"**Silver gate:** Demonstrate two complete independent solves plus one successful postmortem rewrite on more than one mock before changing tiers."
			].join("\n\n"),
			projectLink: USACO_CONTEST_RULES,
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

	const title =
		module.title === "Unit 3: Counting, Sorting, and Ranking"
			? "Unit 3: Frequency Maps, Sets, Sorting, and Prefix Counts"
			: module.title === "Unit 4: Search-Flavored Bronze Problems"
				? "Unit 4: Complete Search, Structured State, and Construction"
				: module.title === "Unit 5: Contest Sets and Tier Transition"
					? "Unit 5: Mock Contests, Postmortems, and Silver Readiness"
					: module.title;

	return {
		...module,
		title,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: module.supplementalProjects
			.map(strengthenBronzeItem)
			.map(item => ({
				...item,
				learningPath: bronzeOptionPath(item.title)
			}))
	};
}

function buildBronzeProblemBankAppendix(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Bronze Problem Bank and Language Mirrors",
		estimatedTime:
			"Choose targeted problems after a primary unit or postmortem",
		keyBlocks: [
			"pattern repair",
			"classical archive",
			"modern archive",
			"Python/Java mirror",
			"independent retry"
		],
		curriculum: [
			{
				title: "Problem Bank Scope Guide",
				content:
					"**Course flow:** The full repository bank is optional practice, not another required sequence. Choose a problem because a postmortem identified a specific pattern or because the primary unit is already independently secure. Solve the canonical problem once; use a Java mirror only for deliberate language transfer.",
				learningPath: "core"
			}
		],
		supplementalProjects: [
			...module.curriculum,
			...module.supplementalProjects
		]
			.map(strengthenBronzeItem)
			.map(item => ({
				...item,
				learningPath: bronzeOptionPath(item.title)
			}))
	};
}

function buildBronzeJavaStudioAppendix(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Java Bronze Practice Studios",
		estimatedTime: "Choose one studio for a diagnosed Java or pattern gap",
		keyBlocks: [
			"language transfer",
			"exact I/O",
			"constraint-safe approach",
			"independent implementation",
			"postmortem rewrite"
		],
		curriculum: [
			{
				title: "Java Studio Scope Guide",
				content:
					"**Course flow:** These ten studios preserve the full Java practice sequence without forcing duplicate required work after the six-module Bronze spine. Choose a studio to transfer an already understood algorithm into Java or to repair a named contest weakness; begin from an empty file during protected practice.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(strengthenBronzeItem)
				.map(item => ({
					...item,
					learningPath: bronzeOptionPath(item.title)
				}))
		)
	};
}

const usacoBronzePrimaryModules = usacoBronzeSourceCourse.modules
	.filter(module => USACO_BRONZE_PRIMARY_TITLES.has(module.title))
	.map(decorateBronzeModule);
const usacoBronzeProblemBank = usacoBronzeSourceCourse.modules.find(
	module => module.title === "Unit 6: Optional Bronze Problem Bank"
);
const usacoBronzeJavaStudios = usacoBronzeSourceCourse.modules.filter(
	module =>
		!USACO_BRONZE_PRIMARY_TITLES.has(module.title) &&
		module.title !== "Unit 6: Optional Bronze Problem Bank"
);

if (!usacoBronzeProblemBank) {
	throw new Error("USACO Bronze optional problem bank is missing.");
}

export const usacoBronzeCourse: RawCourse = {
	...usacoBronzeSourceCourse,
	modules: [
		...usacoBronzePrimaryModules,
		buildBronzeProblemBankAppendix(usacoBronzeProblemBank),
		buildBronzeJavaStudioAppendix(usacoBronzeJavaStudios)
	]
};
