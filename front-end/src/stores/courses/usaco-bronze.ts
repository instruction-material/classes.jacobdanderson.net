import type { RawCourse, RawCourseModuleItem } from "./types";
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
					preserveInstructions: true,
					content:
						"For this Python exercise, put `5` in skidesign.in, followed by 20, 4, 1, 24 and 21 on separate lines. Mark those heights on a number line. The band [4,21] leaves three hills alone and changes the outer two by three each, so skidesign.out contains 18. Compare your cost with a partner’s choice of band.\n\n**Checkpoints:** Replace the input with two hills at 5 and 9. Their spread is already within 17, so the answer is 0. If your minimum still has its initial value, trace whether any candidate band was considered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/354eb28d3f0b990bbb781cf4396df774cacedfe3/UB15-Ski-Course-Design/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/354eb28d3f0b990bbb781cf4396df774cacedfe3/UB15-Ski-Course-Design/solution"
				},
				{
					title: "Block Game",
					preserveInstructions: true,
					content:
						"In Python, read `2` and the lines `aba bc` and `bb ac` from blocks.in. Work with a partner: each person picks one face from each board and spells the two visible words. Which choices demand the most a blocks? Repeat for b and c. Take each letter’s maximum over the four possible displays. The result starts with 3, 3 and 2, each on its own line in blocks.out.\n\n**Checkpoints:** Flip both boards by exchanging the words on each line. Check that the same three counts and 23 trailing zero lines come back.",
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
					preserveInstructions: true,
					content:
						"Write `2 3 2` followed by `X..` and `.XX` in cowsignal.in, one row per line. For this Python exercise, one partner can sketch the enlarged image while the other predicts its dimensions. Four rows of six characters are needed. The first two lines of cowsignal.out should read `XX....`, the next two `..XXXX`. A period occupies a cell just as an X does.\n\n**Checkpoints:** Exchange the input rows. The two `..XXXX` lines move above the two `XX....` lines. Check the order as well as the number of characters.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB18-The-Cow-Signal/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB18-The-Cow-Signal/solution"
				},
				{
					title: "Don't Be Last",
					preserveInstructions: true,
					content:
						"Write a Python solution for notlast.in. One partner can tally the named entries while the other keeps the seven-cow roster. For `3` followed by `Bessie 2`, `Elsie 4`, `Bessie 3`, compare the two tables before choosing an answer. The unmentioned cows set the minimum at zero. Elsie’s four is the next distinct total, so write `Elsie` to notlast.out.\n\n**Checkpoints:** Add `Elsie 1` and update the entry count. Both named cows now have five. Check that the output changes to `Tie` and identify which earlier additions contributed to that tie.",
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
					preserveInstructions: true,
					content:
						"A ski course can keep any hill whose height falls inside a chosen band of width 17. A hill below the band rises to its lower edge, and one above it falls to the upper edge. Moving a hill by d costs d². On a number line, place hills at 0 and 21. Four units of excess height must come out of the spread. What happens to the bill if each hill moves two units? Compare that with moving just one hill by four."
				},
				{
					title: "UB 15 Ski Course Design Java: Guided Example",
					preserveInstructions: true,
					content:
						"For hills at 0 and 21, compare bands [1,18] and [2,19]. The first costs 1² + 3² = 10. The second costs 2² + 2² = 8. Now add a second hill at 0. Each low hill must be moved and paid for separately. The same bands now cost 11 and 12. Which band wins, and why did adding a hill change the answer even though the two extreme heights stayed the same?"
				},
				{
					title: "UB 15 Ski Course Design Java: Core Project",
					preserveInstructions: true,
					content:
						"Read the hill count from skidesign.in, then one height per line. In Java, try integer lower edges from 0 through 83. For each band ending 17 higher, sum the squared adjustments for hills outside it. Write the smallest sum to skidesign.out. Start with heights 0 and 21 and compare the result with the hand calculation of 8.\n\n**Checkpoints:** Try 0 and 17, then 5 and 9. Each pair can stay where it is, so both outputs must be 0. A single hill at 7 also costs 0.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/354eb28d3f0b990bbb781cf4396df774cacedfe3/UB-15-Ski-Course-Design-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/354eb28d3f0b990bbb781cf4396df774cacedfe3/UB-15-Ski-Course-Design-Java/solution"
				},
				{
					title: "UB 15 Ski Course Design Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"For heights 0, 0 and 21, a program reports 8. On paper, mark the adjustment for each of the three hills in [2,19]. The cost is 12, and the cheaper band [1,18] costs 11. Which hill did the program lose if it kept just the distinct heights? Shift all three original heights up by one. Explain why the best band shifts by the same amount and the minimum cost remains 11."
				}
			],
			supplementalProjects: [
				{
					title: "UB 15 Ski Course Design Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"Can two placements tie for the minimum? Put `2`, `0`, and `20` on separate lines in skidesign.in. The three excess units can be split as one and two in either order. Both [1,18] and [2,19] cost 5. Sketch each placement before running the program.\n\n**Checkpoints:** Reverse the input heights. Check that skidesign.out still contains one line with 5. The judge asks for the cost, so the two optimal placements produce a single answer.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/354eb28d3f0b990bbb781cf4396df774cacedfe3/UB-15-Ski-Course-Design-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/354eb28d3f0b990bbb781cf4396df774cacedfe3/UB-15-Ski-Course-Design-Java/solution"
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
					preserveInstructions: true,
					content:
						"Use a two-by-two grid for this Python practice. Place the rows `00` and `01` below `2` in cowtip.in. Compare two predictions: how many cells are tipped, and how many allowed rectangles must be toggled? Trace the whole grid, left column, top row and top-left cell in that order. All cows are upright after the fourth move, so cowtip.out contains 4.\n\n**Checkpoints:** Change both rows to `11` and predict 1. Try `11` above `00` for another 1. Identify which rectangle clears each board in one move.",
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
					preserveInstructions: true,
					content:
						"Draw A at (0,0) and B at (2,0) and connect them as partners. Starting just left of B, Bessie enters B, exits at A, and walks right into B again. That pairing permits a cycle. Move B to (2,1). There is still exactly one way to pair the holes, but neither exit has another hole directly to its right on the same row. Distinguish the number of possible pairings from the number that permit a loop."
				},
				{
					title: "UB 16 Wormholes Java: Guided Example",
					preserveInstructions: true,
					content:
						"Label A=(0,0), B=(2,0), C=(0,1), D=(2,1). Pair A with D and B with C. Starting at the entrance B, teleport to C and walk right to D. Teleport to A and walk right to B. Mark the repeated entrance. Now pair A with C and B with D: both right-hand entrances teleport to the rightmost point on the opposite row and escape. Check the remaining pairing, A with B and C with D. Two of the three pairings loop."
				},
				{
					title: "UB 16 Wormholes Java: Core Project",
					preserveInstructions: true,
					content:
						"Read an even number of distinct points from wormhole.in, one coordinate pair per line after the count. For each hole find the closest hole strictly to its right on the same row. Pair the first free hole with each possible free partner in turn. At a complete pairing, start at each entrance, teleport, then take one rightward step to the next hole. A repeated entrance proves a cycle. Count that pairing once in wormhole.out.\n\n**Checkpoints:** The two points (0,0) and (2,0) give 1. Move the second to (2,1) for 0. The four corners (0,0), (2,0), (0,1), (2,1) give 2.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/solution"
				},
				{
					title: "UB 16 Wormholes Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"On the four corners (0,0), (2,0), (0,1), (2,1), a pair on each horizontal row makes a loop on both rows. Should the counter advance once or twice? The answer counts whole pairings, so record that arrangement once as soon as any start loops. With four holes there are only three possible pairings. Reverse the input rows, redraw the same partner lines and check that the total remains 2."
				}
			],
			supplementalProjects: [
				{
					title: "UB 16 Wormholes Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"Place four holes at x = 0, 1, 2 and 3, all on y = 0. List the three perfect pairings. Two allow a loop. For the pairing 0 with 2 and 1 with 3, trace from each entrance until the cow walks past the last hole. At every exit she must enter the nearest hole to the right.\n\n**Checkpoints:** Keep the same x-coordinates and set each y equal to its x. No two holes now share a row. The three possible pairings remain, but wormhole.out becomes 0.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/solution"
				},
				{
					title: "Why Did the Cow Cross the Road",
					preserveInstructions: true,
					content:
						"Draw a separate column for each cow in a Python trace. Put `5` followed by `1 0`, `2 1`, `1 0`, `2 0`, `1 1` in crossroad.in. Each row gives the cow ID and the side seen. Cow 1 has sightings 0, 0, 1; cow 2 has 1, 0. Each changes side once. Write their combined count of 2 to crossroad.out.\n\n**Checkpoints:** Change only the last row to `1 0`. The new output is 1. Which cow’s history was affected, and why does its first sighting contribute nothing?",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB22-Why-Did-the-Cow-Cross-the-Road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB22-Why-Did-the-Cow-Cross-the-Road/solution"
				},
				{
					title: "Why Did the Cow Cross the Road II",
					preserveInstructions: true,
					content:
						"On paper, arrange `ABCABC` around a circle, then add adjacent pairs `DD`, `EE` and so on through `ZZ`. Use the resulting 52-letter line as circlecross.in. Draw a chord for each cow. A pair must cross when its endpoints alternate around the circle. A, B and C each cross both of the others, giving three unordered pairs in circlecross.out.\n\n**Checkpoints:** Start with `ABAB` and add adjacent pairs from C through Z for a count of 1. Keep the suffix and change the prefix to `ABBA` for 0. Compare the positions between A’s endpoints.",
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
					preserveInstructions: true,
					content:
						"Each board shows one of two words. How many copies of each letter must be on hand to spell whatever the boards show? Compare `aa` with `ab` on opposite sides of one board. Two a blocks cover the worst case for a, and one b block covers the worst case for b. The two worst cases can occur on different faces. With `aba` and `bc`, make the same comparison for a, b and c: the board needs 2, 1 and 1."
				},
				{
					title: "UB 17 Block Game Java: Guided Example",
					preserveInstructions: true,
					content:
						"Draw two boards with sides `aba / bc` and `bb / ac`. For a, the largest count on the first board is 2 and on the second it is 1, giving 3. For b, the maxima are 1 and 2, also giving 3. For c, each board can show one, giving 2. Which two faces would use both c blocks at once? Compare that choice with the faces that use all three a blocks."
				},
				{
					title: "UB 17 Block Game Java: Core Project",
					preserveInstructions: true,
					content:
						"In Main.java read the board count from blocks.in, followed by two lowercase words per line. Count the letters on each face separately. For each letter add the larger face count to its running total, then clear the face counts for the next board. Print exactly 26 totals in alphabetic order, one integer per line in blocks.out.\n\n**Checkpoints:** With `2` followed by `aba bc` and `bb ac`, the first three lines read 3, 3 and 2. The remaining 23 lines are zero. With one board `z z`, only the last line is 1.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/solution"
				},
				{
					title: "UB 17 Block Game Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"One board with `aa` on both sides needs two a blocks. A program asks for four. Mark the instruction that combines the two sides: only one face can be visible. Now use two boards, both reading `aa ab`. They can show `aa` at the same time, so the a total is 4. They can also both show `ab`, so the b total is 2. Why does the operation change when you move from one board to two?"
				}
			],
			supplementalProjects: [
				{
					title: "UB 17 Block Game Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"Flip both boards in the input: replace `aba bc` and `bb ac` with `bc aba` and `ac bb`. Predict all 26 output lines before rerunning the program. The first three remain 3, 3 and 2 and the rest remain zero. Swapping faces cannot change a per-letter maximum.\n\n**Checkpoints:** Try two copies of `aa ab`. The first two lines become 4 and 2, followed by 24 zeros. If duplicating a board has no effect, check where you accumulate its contribution.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/solution"
				},
				{
					title: "Why Did the Cow Cross the Road III",
					preserveInstructions: true,
					content:
						"Draw a timeline for a single gate. Put `3` and the arrival-duration pairs `8 3`, `2 1`, `5 7` on separate lines in cowqueue.in. In arrival order the gate serves a cow from 2 to 3, waits until 5, then stays busy until 12. The cow that arrived at 8 finishes at 15. Compare that timeline with the finish time your Python program writes to cowqueue.out.\n\n**Checkpoints:** Shorten the seven-unit interview to two units. The last cow now finishes at 11. For simultaneous arrivals `4 2` and `4 3`, both durations count and the finish is 9.",
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
					preserveInstructions: true,
					content:
						"Draw one row with a marked cell and an empty cell, `X.`. At scale 2, each original cell occupies a two-by-two square. Both enlarged rows read `XX..`. Copying the whole original row twice across would instead produce `X.X.`. Point to the two neighboring cells descended from the first X. If the input were a single X at scale 3, what would the height, width and number of marked cells become?"
				},
				{
					title: "UB 18 The Cow Signal Java: Guided Example",
					preserveInstructions: true,
					content:
						"Sketch a two-row signal, `X..` above `.XX`. With scale 2, read the top row from left to right and expand each cell: `XX`, `..`, `..`. Join them into `XX....`, then put an identical row underneath. Expand the second source row into `..XXXX` and repeat it too. Trace the empty cell at the start of the second row to its four positions. Which mistake would put its copies two rows apart?"
				},
				{
					title: "UB 18 The Cow Signal Java: Core Project",
					preserveInstructions: true,
					content:
						"Read M, N and K from cowsignal.in in that order: rows, columns and scale. Read M strings of length N. Build an expanded row by copying each character K times. Write that completed row K times before moving to the next source row. Preserve periods as cells. Write the image alone to cowsignal.out.\n\n**Checkpoints:** Use `2 3 2` followed by `X..` and `.XX`. Expect two lines of `XX....` followed by two of `..XXXX`. Change K to 1 and compare both output rows character for character with the original.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/solution"
				},
				{
					title: "UB 18 The Cow Signal Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"A program enlarges `X..` above `.XX` to the correct size, four rows by six columns, but alternates `XX....` and `..XXXX`. Place a finger on the original top-left X and mark its four descendants. In which two rows must they appear? Move the row-repetition loop so those rows are adjacent. Exchange the two source rows and confirm that `..XXXX` now appears twice at the top and `XX....` twice below."
				}
			],
			supplementalProjects: [
				{
					title: "UB 18 The Cow Signal Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"Use `1 2 3` followed by `.X`. Before running Main.java, draw the boundary between the empty and marked regions. The three output rows each read `...XXX`. Next transpose the original two-by-three picture `X.. / .XX` to three rows `X.`, `.X`, `.X` and use scale 2.\n\n**Checkpoints:** The transposed result has six rows and four columns. The first two rows are `XX..` and the last four are `..XX`. Compare the four descendants of one source cell before and after transposing.",
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
					preserveInstructions: true,
					content:
						"Make seven spaces in a table for Bessie, Elsie, Daisy, Gertie, Annabelle, Maggie and Henrietta. Each starts at zero. A log entry adds milk to one cow’s total. With only `Maggie 3` recorded, six cows share the minimum, zero. Maggie is the only cow at the next distinct total, so the answer is Maggie. What happens to that next level if all seven cows produce exactly two units each?"
				},
				{
					title: "UB 19 Don't Be Last Java: Guided Example",
					preserveInstructions: true,
					content:
						"Trace `Bessie 2`, `Elsie 4`, `Bessie 3` together. The five unlisted cows finish at zero, Elsie at four and Bessie at five. Cross out every cow at the minimum. The smallest remaining total belongs to Elsie. Add `Elsie 1` and repeat the trace. Now Bessie and Elsie both have five, so notlast.out changes from `Elsie` to `Tie`. Which tie matters in each version?"
				},
				{
					title: "UB 19 Don't Be Last Java: Core Project",
					preserveInstructions: true,
					content:
						"Read the entry count from notlast.in and accumulate each name and quantity in Java. Include all seven cows when finding the least total. Among the totals strictly above it, find the smallest and count how many cows have it. Write the unique name or `Tie` to notlast.out.\n\n**Checkpoints:** With `3` followed by `Bessie 2`, `Elsie 4`, `Bessie 3` on separate lines, expect `Elsie`. Append `Elsie 1` and change the count to `4` for `Tie`. Check the one-entry file containing `Maggie 3` separately: it must give `Maggie`.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/solution"
				},
				{
					title: "UB 19 Don't Be Last Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"A program returns Bessie for a log containing `Bessie 2`, `Elsie 4`, `Bessie 3`. Compare its table with one that includes five zero totals. If it kept only the two recorded names, four became its minimum and five its next level. The correct answer is Elsie. Reverse the input rows and check again. Reordering additions must leave the answer unchanged. What would a different answer reveal about the update for a repeated name?"
				}
			],
			supplementalProjects: [
				{
					title: "UB 19 Don't Be Last Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"Give all seven cows one entry of 2 units each. With seven equal totals there is no higher level, so notlast.out reads `Tie`. Predict the result of adding one unit to Daisy before running it.\n\n**Checkpoints:** Change the first line from `7` to `8` and append `Daisy 1`. Six cows remain at two and Daisy alone reaches three. Compare this `Daisy` result with the original `Tie` and explain why six cows at the minimum still permit a unique answer.",
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
					preserveInstructions: true,
					content:
						"The same three numbers stand for hoof, paper and scissors throughout the log. Paper beats hoof, hoof beats scissors and scissors beats paper. Draw one possible assignment next to the rows `1 2` and `2 1`. Reversing the order reverses the winner, so the first cow can win at most one of those games. Equal gestures always tie. How many first-cow wins are possible for `2 2` and `3 3`?"
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Guided Example",
					preserveInstructions: true,
					content:
						"Use the rounds `1 2`, `2 3`, `3 1`, `2 1`, `1 1`. Draw arrows from winner to loser for the cycle 1→2→3→1. The first cow wins the first three rounds. Reversing the arrows gives one win, and the last round ties either way. The largest score is 3. Replace the first row with `2 1`. Tally both directions again: each now gives two wins."
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Core Project",
					preserveInstructions: true,
					content:
						"Read the round count and the two gesture labels per round from hps.in. In Java, score the first cow for each fixed assignment of labels to gestures. Reset the win count between assignments and keep the highest complete-game score. Print it to hps.out.\n\n**Checkpoints:** For five rounds `1 2`, `2 3`, `3 1`, `2 1`, `1 1`, the maximum is 3. Try just the two rounds `1 2` and `2 1`. The maximum is 1. Which round changes from a win to a loss when you reverse the cycle?",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/solution"
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"Compare two explanations for an output of 2 on the two rounds `1 2` and `2 1`. Assigning the labels anew for each round can make both look like wins on paper, but the input describes one fixed code. Keep your assignment visible and mark the winner of each round again. The maximum is 1. For `2 2` and `3 3`, check that neither scoring direction claims a win; the output is 0."
				}
			],
			supplementalProjects: [
				{
					title: "UB 20 Hoof Paper Scissors Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"Rename the symbols everywhere by sending 1 to 2, 2 to 3 and 3 to 1. The five rounds `1 2`, `2 3`, `3 1`, `2 1`, `1 1` become `2 3`, `3 1`, `1 2`, `3 2`, `2 2`. Predict whether the possible scores change when only the labels change.\n\n**Checkpoints:** Both files give 3. Reverse the order of the five original rounds and verify 3 again. Explain what each change preserves in the tally.",
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
					preserveInstructions: true,
					content:
						"A 1 marks a tipped cow; a 0 marks an upright cow. Each move toggles every cell in a rectangle stretching from the top-left corner to a chosen cell. Draw `00 / 01` as a two-row grid. Only the whole grid reaches the bottom-right 1. Why must that move appear in any solution? Contrast this board with `11 / 11`, which takes just one flip, and `00 / 00`, which takes none."
				},
				{
					title: "UB 21 Cow Tipping Java: Guided Example",
					preserveInstructions: true,
					content:
						"Put `00` above `01`. Working from the bottom right, flip the whole grid to get `11 / 10`. Next flip the left column to get `01 / 00`. Flip the top row to reach `10 / 00`, then the top-left cell to clear it. Mark the cell fixed by each move. Once the bottom row is settled, which remaining rectangles leave it untouched? The four forced moves explain why a single tipped cow here takes four flips."
				},
				{
					title: "UB 21 Cow Tipping Java: Core Project",
					preserveInstructions: true,
					content:
						"Read N from cowtip.in, followed by N rows of N binary digits with no spaces. Scan the Java grid from the last row upward, moving right to left within a row. Whenever the current bit is 1, toggle the upper-left rectangle ending at that cell and increase the move count. Use the updated cells for the rest of the scan. Write the count to cowtip.out.\n\n**Checkpoints:** With N = 2, `00 / 01` takes 4 moves. Try `11 / 11` for 1 and `00 / 00` for 0.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/solution"
				},
				{
					title: "UB 21 Cow Tipping Java: Review and Reflection",
					preserveInstructions: true,
					content:
						"A prediction based on the number of ones gets the easiest-looking board wrong: `00 / 01` takes four flips, while `11 / 11` takes one. Draw the allowed rectangles on a two-by-two grid. After the forced whole-grid flip, circle the bottom-right cell and rule out any later action that would disturb it. Why does that force the choice at the next cell? Check your argument on `11 / 00`, which clears with one top-row flip."
				}
			],
			supplementalProjects: [
				{
					title: "UB 21 Cow Tipping Java: Extension Challenge",
					preserveInstructions: true,
					content:
						"Try the two diagonal ones in `01 / 10`. Flip the left column, then the top row: both rows are now zero. For `01 / 11`, the whole-grid flip followed by the top-left flip also takes two moves. Count how many cells each move changes in the two traces.\n\n**Checkpoints:** Run a single-cell grid first with `1` and then with `0`. The outputs must be 1 and 0. Use these to check the loop endpoints when the rectangle is only one cell wide and high.",
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
