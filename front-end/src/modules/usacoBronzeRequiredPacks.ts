import type { RawCourse } from "../stores/courses/types";

// Complete source contracts from the accepted learner guides; references remain separate.
export const bronzeRequiredPacks = [
	{
		slug: "crossroad",
		title: "Road-Crossing Observations and Native Setup",
		requirements:
			"Finish the setup sequence by creating separate source/input/output folders, compiling the current file, checking process status, comparing an independent expected file, and distinguishing malformed input, unfinished work, a wrong answer and an old output. Keep the included sample separate from changed cases. Explain cow-ID indexing and retain a trace for two interleaved cows. The optional log records one setup mistake, its cause, its correction and a changed-case prediction; it does not repeat the required sample. Protected mocks start from empty files and do not use this practice driver.",
		retry: "Replace the sample with ten different cows observed once and predict zero. Then observe cow 10 alternating sides for 100 rows and predict 99. Interleave a second cow and record separate last-side states. Save the new trace, a corrected mistake and a comparison with grouped per-cow sequences.",
		folder: "UB-22-Why-Did-the-Cow-Cross-the-Road-Java",
		mode: "java",
		revision: "f189f7d71b170cfaf69798d411747234ab25d8c4",
		input: "crossroad.in",
		output: "crossroad.out",
		mainFile: "Main.java",
		sourceGuideSha256:
			"44da85bb9ae382585000081ff4f5b0b64783f4e0775f3994123649a3bf9e4188",
		sampleInput: "8\n3 1\n3 0\n6 0\n2 1\n4 1\n3 0\n4 0\n3 1",
		sampleExpected: "3\n",
		contract:
			"Process the observations in their recorded order. `crossroad.in` begins with an\ninteger N in 1..100. The next N observations each contain a cow ID in 1..10 and\na road side, 0 or 1. A crossing is confirmed only when successive observations\nof the same cow have different sides. Observations of other cows can appear\nbetween them. A cow's first observation confirms no crossing. Write the total\nas one integer and a newline in `crossroad.out`.\n\nThis guide supplies the working contract independently. The\n[official problem](https://usaco.org/index.php?page=viewproblem2&cpid=711)\nis an additional resource. No inference about unobserved crossings is required.",
		prediction:
			"The included `crossroad.in` has eight observations. Cow 3 has side sequence\n1,0,0,1 and contributes two changes; cow 4 has 1,0 and contributes one. Cows 6\nand 2 are each seen once. Predict `3` followed by a newline; `sample.expected`\ncontains those exact bytes. Grouping by cow is useful for a separate check,\nbut the implementation still processes the original observation order.\n\nFor each observation, record the cow's previous known side, the new side,\nwhether it contributes one change, and the updated total. An unknown side\nneeds a value distinct from both 0 and 1. Maintain a separate state for each\nof the ten cows. Explain why another cow's observation cannot change that state.",
		tasks: "Complete the learner's `Main.countCrossings(int[][] observations)`. Retain the\nsupplied driver and return an integer count. Before each row, the stored side\nfor each seen cow is its latest observed side, and the total counts all changes\nconfirmed by earlier rows. Update both parts of this invariant after the row.\nUse O(N) time and O(10) state. A dictionary or a ten-entry indexed array is a\nchoice about representation; explain the ID-to-index mapping if using an array.",
		checks: "Collect each cow's side sequence independently, then count unequal neighboring\nvalues in those sequences. Compare that sum with the implementation. Check one\nobservation, repeated identical sides, 0-to-1 and 1-to-0 changes, IDs 1 and 10,\ninterleaved cows and the maximum 100 observations. One cow alternating sides\nfor 100 observations confirms 99 crossings. Ten cows observed once confirm zero.\n\nA shared walkthrough pauses at the prediction, the unknown-side representation,\none interleaved trace, the invariant and the independent check. The same order\nsupports individual reading. For optional practice, change the observations and\npredict the complete result before running; retain one corrected trace and an\nexplanation. This checkpoint does not complete every topic in its course unit.",
		guard: 'task_classes="$(pwd)/target/classes"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif rm -rf target/classes \\\n    && mkdir -p target/classes \\\n    && javac --release 17 -encoding UTF-8 -Xlint:all -Werror -d target/classes Main.java \\\n    && cp crossroad.in "$task_run/crossroad.in" \\\n    && (cd "$task_run" && java -cp "$task_classes" Main) \\\n    && diff -u sample.expected "$task_run/crossroad.out" \\\n    && cp "$task_run/crossroad.out" crossroad.out.new \\\n    && mv crossroad.out.new crossroad.out; then\n    printf \'Verified crossroad.out\\n\'\nelse\n    task_status=$?\n    rm -f crossroad.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				courseId: "usaco-bronze",
				sourceModuleTitle: "USB0 Setup and Contest Workflow",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-usb0-setup-and-contest-workflow-curriculum-core-project-setup-and-contest-workflow",
				moduleTitle: "USB0 Setup and Contest Workflow",
				section: "curriculum",
				learningPath: "core",
				variant: "core",
				title: "Core Project: Road-Crossing Observations and Native Setup"
			},
			{
				courseId: "usaco-bronze",
				sourceModuleTitle: "USB0 Setup and Contest Workflow",
				sourceSection: "supplementalProjects",
				itemId: "usaco-bronze-usb0-setup-and-contest-workflow-supplemental-bronze-log-setup-and-contest-workflow",
				moduleTitle: "USB0 Setup and Contest Workflow",
				section: "supplementalProjects",
				learningPath: "choice",
				variant: "log",
				title: "Bronze Log: Native Setup and Crossing-State Reasoning"
			}
		]
	},
	{
		slug: "transform",
		title: "Transformations: Coordinates, Composition and Priority",
		requirements:
			"Finish the grid/translation work by deriving both coordinate mappings, keeping fresh rows, composing transformations and checking category priority. Also trace ordinary string indexing and empty/nonempty boundaries when those are assigned by the surrounding stage; this bounded grid pack does not replace modular-arithmetic or all string activities. Retain a diagram, two independently predicted targets and a mutation/aliasing check. The structured course uses its required stage order; the instructor course may choose this optional grid application after the simulation prerequisite.",
		retry: "Close the reference. Start with a non-symmetric grid, predict a reflection followed by a quarter-turn, and compare against a coordinate-mapping oracle. Then use a one-cell or symmetric grid and explain why rotation category 1 wins even though no change also matches. Check four rotations and two reflections restore the original without mutation.",
		folder: "UB10-Transformations",
		mode: "python",
		revision: "f189f7d71b170cfaf69798d411747234ab25d8c4",
		input: "transform.in",
		output: "transform.out",
		mainFile: "main.py",
		sourceGuideSha256:
			"8da0e127e53892dfd07d7dc2db000a35d8fac5d3f6339484f25b1b4844cd137e",
		sampleInput: "3\n@--\n-@@\n@-@\n@-@\n-@-\n@@-\n",
		sampleExpected: "1\n",
		contract:
			"Read `transform.in`: square size N, then N original rows and N target rows, each containing exactly N characters chosen from @ and -. This course pack uses N in 1..10. Write one integer to `transform.out`, selecting the first matching category: 1 clockwise 90 degrees, 2 clockwise 180, 3 clockwise 270, 4 reflection across the vertical axis, 5 that reflection followed by a nonzero quarter-turn rotation, 6 no change, 7 none of these. Apply priority even when a symmetric pattern fits several categories.\n\nThis standalone guide supplies the course contract and explicit verification bounds. The [original problem resource](https://train.usaco.org/) is additional reading; no account is needed to use this pack.",
		prediction:
			"The original rows are @--, -@@, @-@. The target rows are @-@, -@-, @@-. The original top-left cell moves to the target top-right cell; the complete target is a clockwise quarter-turn, so category 1 wins. `sample.expected` stores the exact answer with a final newline. Read the included input file and record a manual trace before execution.",
		tasks: "Complete `rotate90(pattern)` and `reflect(pattern)`, each returning a fresh square list of rows without changing its argument. Track (row,column) and derive the destination using the square size. The supplied category selection composes those operations and applies the required priority. Explain why comparing only the number of @ cells is insufficient and why the reflection reverses columns rather than rows.\n\nEach operation takes O(N squared) time and space. A fixed number of transformations preserves that bound. Avoid aliasing output rows or mutating the original, since later category checks must see the same input.",
		checks: "Use a separate coordinate-mapping checker. Four quarter-turns and two reflections must restore the original. Include an asymmetric pattern for each category, a reflection-then-rotation case, an unrelated target, a one-cell square and a symmetric square where rotation takes priority over no change. Exercise N=10.\n\nA shared walkthrough pauses at the prediction, one state transition, the invariant and the independent check. Those same checkpoints support individual reading. For optional practice, change the input and predict a separate expected file before running. Retain a corrected trace and an explanation of one boundary case. This project does not complete every topic in its wider course unit.",
		guard: 'task_role="$(pwd)"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif cp main.py transform.in "$task_run/" \\\n    && (cd "$task_run" && python3 main.py) \\\n    && diff -u sample.expected "$task_run/transform.out" \\\n    && cp "$task_run/transform.out" transform.out.new \\\n    && mv transform.out.new transform.out; then\n    printf \'Verified transform.out\\n\'\nelse\n    task_status=$?\n    rm -f transform.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				courseId: "usaco-bronze",
				sourceModuleTitle: "Unit 1: Simulation and Careful Translation",
				sourceSection: "supplementalProjects",
				itemId: "usaco-bronze-unit-1-simulation-and-careful-translation-supplemental-problem-transformations",
				moduleTitle: "Unit 1: Simulation and Careful Translation",
				section: "supplementalProjects",
				learningPath: "choice",
				variant: "retry",
				title: "Transformations: Coordinates, Composition and Priority: Changed Case Practice"
			},
			{
				courseId: "usaco-bronze-on-demand",
				sourceModuleTitle:
					"Stage 2: Strings, Modular Arithmetic, and Grids",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-on-demand-stage-2-strings-modular-arithmetic-and-grids-curriculum-concepts-transformations",
				moduleTitle: "Stage 2: Strings, Modular Arithmetic, and Grids",
				section: "curriculum",
				learningPath: "core",
				variant: "sequence",
				title: "Transformations: Coordinates, Composition and Priority"
			}
		]
	},
	{
		slug: "wormhole",
		title: "Wormholes: Exhaustive Pairings and Cycle Checks",
		requirements:
			"This is the required complete-search implementation checkpoint. Count the pairing space, select the first unpaired point, enumerate every possible partner once and restore both entries after recursion. Independently validate symmetric complete pairings and the deterministic transition graph. Continue the wider unit with a constructive witness whose validity can be replayed and explain when direct simulation is preferable to enumeration. The Lost Cow walk belongs in the simulation unit and does not satisfy this pairing-search requirement.",
		retry: "Reorder the four-square points and predict the same count two. Then compare two points on one row (one cyclic pairing) with two on different rows (zero). Save a distinct pairing trace and a visited-set cycle check. At N=12 account for all 10395 pairings and explain why multiple trapped starting points do not multiply a pairing count.",
		folder: "UB16-Wormholes",
		mode: "python",
		revision: "f189f7d71b170cfaf69798d411747234ab25d8c4",
		input: "wormhole.in",
		output: "wormhole.out",
		mainFile: "main.py",
		sourceGuideSha256:
			"501251eca660b5734c17653e681106b42adc280810a508d80525ac6c20731686",
		sampleInput: "4\n0 0\n1 0\n1 1\n0 1\n",
		sampleExpected: "2\n",
		contract:
			"Read `wormhole.in`: even N in 2..12, followed by N distinct (x,y) points with coordinates in 0..1000000000. Pair every wormhole with exactly one other wormhole. After teleporting through a pair, the cow walks in the positive x direction to the nearest wormhole strictly to the right on the same horizontal line; if none exists, it escapes. Write to `wormhole.out` the number of distinct pairings for which at least one starting position can enter an infinite cycle. Count each pairing once, regardless of how many starting positions cycle.\n\nThis standalone guide supplies the course contract and explicit verification bounds. The [original problem resource](https://usaco.org/index.php?page=viewproblem2&cpid=360) is additional reading; no account is needed to use this pack.",
		prediction:
			"For the four corners, there are three pairings. Pairing the two horizontal neighbors on each row cycles. Pairing opposite corners in the matching 1-3 and 2-4 also cycles. Pairing 1-4 and 2-3 does not. Thus the count is 2, not the number of trapped starts. `sample.expected` stores the exact answer with a final newline. Read the included input file and record a manual trace before execution.",
		tasks: "Complete `generate_next_on_right(x,y)` and `main(partners,next_on_right)`. Use -1 for no right neighbor and an unpaired partner. The supplied `cycle_exists` checks every start for N teleport-and-walk steps. Enumerate pairings by selecting the first unpaired index, pairing it with each available later index, recursing, then restoring both entries to -1. Explain why this generates each complete pairing once and why state restoration is necessary. The legacy neighbor helper uses the supplied global partners list only for its length; all lists have N entries.\n\nNeighbor construction is O(N squared). There are (N-1)!! complete pairings, at most 10395; the supplied cycle check is O(N squared) per pairing. The partner state uses O(N) space, plus recursion depth N/2.",
		checks: "Independently build the deterministic directed transition graph for each complete pairing and detect a cycle with visited-node sets. Test two points on one row (one cyclic pairing), two on different rows (zero), the square, unsorted input, several rows, coordinate limits and N=12. Verify each point has exactly one symmetric partner before judging a pairing.\n\nA shared walkthrough pauses at the prediction, one state transition, the invariant and the independent check. Those same checkpoints support individual reading. For optional practice, change the input and predict a separate expected file before running. Retain a corrected trace and an explanation of one boundary case. This project does not complete every topic in its wider course unit.",
		guard: 'task_role="$(pwd)"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif cp main.py wormhole.in "$task_run/" \\\n    && (cd "$task_run" && python3 main.py) \\\n    && diff -u sample.expected "$task_run/wormhole.out" \\\n    && cp "$task_run/wormhole.out" wormhole.out.new \\\n    && mv wormhole.out.new wormhole.out; then\n    printf \'Verified wormhole.out\\n\'\nelse\n    task_status=$?\n    rm -f wormhole.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 4: Complete Search, Structured State, and Construction",
				sourceSection: "supplementalProjects",
				itemId: "usaco-bronze-unit-4-complete-search-structured-state-and-construction-supplemental-problem-wormholes",
				moduleTitle:
					"Unit 4: Complete Search, Structured State, and Construction",
				section: "curriculum",
				learningPath: "core",
				variant: "core",
				title: "Core Project: Wormholes: Exhaustive Pairings and Cycle Checks"
			},
			{
				courseId: "usaco-bronze-on-demand",
				sourceModuleTitle:
					"Stage 4: Complete Search and Structured State",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-on-demand-stage-4-complete-search-and-structured-state-curriculum-concepts-wormholes",
				moduleTitle: "Stage 4: Complete Search and Structured State",
				section: "curriculum",
				learningPath: "core",
				variant: "sequence",
				title: "Wormholes: Exhaustive Pairings and Cycle Checks"
			}
		]
	},
	{
		slug: "lostcow",
		title: "The Lost Cow: Alternating Simulation and Early Stopping",
		requirements:
			"This required checkpoint belongs to simulation. Name the original start, current position, next offset, accumulated distance and stop condition separately. Explain an endpoint hit, a target inside a leg and a target on the other side. Complete the surrounding simulation unit with another update-order trace and an independently hand-computed tiny oracle. This walk does not enumerate candidate pairings or establish the complete-search checkpoint.",
		retry: "Close the reference and predict walks with (x,y)=(3,4), (3,1) and (3,6): totals 1,4 and 9. Translate both coordinates by the same amount and explain why distance stays unchanged. For a target just beyond an endpoint, compare the whole-leg calculation with a separate unit-step walk.",
		folder: "UB25-The-Lost-Cow",
		mode: "python",
		revision: "f189f7d71b170cfaf69798d411747234ab25d8c4",
		input: "lostcow.in",
		output: "lostcow.out",
		mainFile: "main.py",
		sourceGuideSha256:
			"f8cf213dc2691c52c9ac4c50f57962d823f26e9d3c1c175d813ba19776c42183",
		sampleInput: "3 6\n",
		sampleExpected: "9\n",
		contract:
			"Read distinct integers x and y in 0..1000 from `lostcow.in`. Begin at x and visit endpoints x+1, x-2, x+4, x-8 and so on. These endpoints are offsets from the original x, not from the previous endpoint. Stop immediately when the walk first reaches y, even in the middle of a leg. Write the total distance traveled to `lostcow.out`.\n\nThis standalone guide supplies the course contract and explicit verification bounds. The [original problem resource](https://usaco.org/index.php?page=viewproblem2&cpid=735) is additional reading; no account is needed to use this pack.",
		prediction:
			"From x=3, walk to 4 (distance 1), then 1 (distance 3), then toward 7. Stop at y=6 after another 5, for a total of 9. The final endpoint is not actually reached. `sample.expected` stores the exact answer with a final newline. Read the included input file and record a manual trace before execution.",
		tasks: "Complete `main(starting_pos,bessie_pos)` and return an integer distance. Track the original start, the current position, the alternating doubled offset and accumulated distance separately. Before each leg, determine whether the target lies between the current position and the next endpoint, inclusive. If it does, add only the distance to the target and stop. Explain why multiplying an offset by -2 both doubles the reach and changes direction.\n\nA whole-leg calculation takes O(log(abs(x-y)+1)) steps and constant state. Walking one unit at a time is useful as an independent small-case checker.",
		checks: "Compare with a separate unit-step walk that stops as soon as y is reached. Cover targets on both sides, a target at an endpoint, one just past an endpoint, both boundary coordinates and translated cases with the same x-y separation. x=y is outside this contract.\n\nA shared walkthrough pauses at the prediction, one state transition, the invariant and the independent check. Those same checkpoints support individual reading. For optional practice, change the input and predict a separate expected file before running. Retain a corrected trace and an explanation of one boundary case. This project does not complete every topic in its wider course unit.",
		guard: 'task_role="$(pwd)"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif cp main.py lostcow.in "$task_run/" \\\n    && (cd "$task_run" && python3 main.py) \\\n    && diff -u sample.expected "$task_run/lostcow.out" \\\n    && cp "$task_run/lostcow.out" lostcow.out.new \\\n    && mv lostcow.out.new lostcow.out; then\n    printf \'Verified lostcow.out\\n\'\nelse\n    task_status=$?\n    rm -f lostcow.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 4: Complete Search, Structured State, and Construction",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-unit-4-complete-search-structured-state-and-construction-curriculum-core-project-search-flavored-bronze-problems",
				moduleTitle: "Unit 1: Simulation and Careful Translation",
				section: "curriculum",
				learningPath: "core",
				variant: "core",
				title: "Core Project: The Lost Cow: Alternating Simulation and Early Stopping"
			},
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 4: Complete Search, Structured State, and Construction",
				sourceSection: "supplementalProjects",
				itemId: "usaco-bronze-unit-4-complete-search-structured-state-and-construction-supplemental-problem-the-lost-cow",
				moduleTitle: "Unit 1: Simulation and Careful Translation",
				section: "supplementalProjects",
				learningPath: "choice",
				variant: "retry",
				title: "The Lost Cow: Alternating Simulation and Early Stopping: Changed Case Practice"
			}
		]
	},
	{
		slug: "diamond",
		title: "Diamond Collector: Inclusive Counts and Duplicates",
		requirements:
			"The supplied candidate-minimum program is an O(N squared) Bronze checkpoint; it does not implement every map, set, sorting or prefix-count topic in Unit 3. Also use [4,1,4,2,1] to build the frequency map {1:2,2:1,4:2}, distinct set {1,2,4} and sorted multiset [1,1,2,4,4]. For the indicator of value 4, build prefix counts [0,1,1,2,2,2]; positions 2..4 contain one 4, using P[4]-P[1]. Explain why a set would lose the two separate size-1 diamonds. Implement and independently check each assigned representation and a sorted-window comparison before marking the unit complete.",
		retry: "Use K=0 with sizes 4,1,4,2,1 and predict two. Use K=3 with sizes 1,1,4,5 and predict three; the exact-K boundary is inclusive. Shuffle the input and retain the same prediction. Close the reference, compare both an independent sorted-window checker and tiny subset enumeration, and explain a discrepancy rather than repeat the sample.",
		folder: "UB37-Diamond-Collector",
		mode: "python",
		revision: "f189f7d71b170cfaf69798d411747234ab25d8c4",
		input: "diamond.in",
		output: "diamond.out",
		mainFile: "main.py",
		sourceGuideSha256:
			"df836fe51db1353f1b3c788da169f05775727dca2a3cd5f6024e94d634bdfc07",
		sampleInput: "5 3\n1\n6\n4\n3\n1\n",
		sampleExpected: "4\n",
		contract:
			"Read N and K from `diamond.in`, followed by N diamond sizes. Use 1..1000 diamonds, K in 0..10000 and sizes in 1..10000. Select the largest number that fit in one display case while the largest and smallest selected sizes differ by at most K. A difference exactly equal to K is allowed; equal-size diamonds are separate objects. Write that maximum count to `diamond.out`.\n\nThis standalone guide supplies the course contract and explicit verification bounds. The [original problem resource](https://usaco.org/index.php?page=viewproblem2&cpid=639) is additional reading; no account is needed to use this pack.",
		prediction:
			"The two size-1 diamonds and sizes 3 and 4 fit in [1,4], giving four objects. Size 6 cannot join that case. The count includes both copies of size 1. `sample.expected` stores the exact answer with a final newline. Read the included input file and record a manual trace before execution.",
		tasks: "Complete `calc_num_diamonds(min_size,sizes,k)` and `calc_max_diamonds(sizes,k)`. The first counts values in the inclusive interval [min_size,min_size+k]; the second tries observed minimum sizes and returns the best count. Explain why an optimal nonempty case has an observed smallest size and why using abs(size-min_size) would permit an invalid two-sided window.\n\nThe candidate-minimum method is O(N squared) time and O(1) additional state. With N at most 1000 it is suitable for this Bronze checkpoint. Sorting and a sliding window provide a separate checker and an optional extension.",
		checks: "Compare with a sorted contiguous-window checker, and enumerate all subsets on tiny cases. Test K=0, repeated sizes, an exact-K boundary, a just-too-large difference, arbitrary input order, one diamond and 1000 diamonds including sizes 1 and 10000.\n\nA shared walkthrough pauses at the prediction, one state transition, the invariant and the independent check. Those same checkpoints support individual reading. For optional practice, change the input and predict a separate expected file before running. Retain a corrected trace and an explanation of one boundary case. This project does not complete every topic in its wider course unit.",
		guard: 'task_role="$(pwd)"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif cp main.py diamond.in "$task_run/" \\\n    && (cd "$task_run" && python3 main.py) \\\n    && diff -u sample.expected "$task_run/diamond.out" \\\n    && cp "$task_run/diamond.out" diamond.out.new \\\n    && mv diamond.out.new diamond.out; then\n    printf \'Verified diamond.out\\n\'\nelse\n    task_status=$?\n    rm -f diamond.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 3: Frequency Maps, Sets, Sorting, and Prefix Counts",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-unit-3-frequency-maps-sets-sorting-and-prefix-counts-curriculum-core-project-counting-sorting-and-ranking",
				moduleTitle:
					"Unit 3: Frequency Maps, Sets, Sorting, and Prefix Counts",
				section: "curriculum",
				learningPath: "core",
				variant: "core",
				title: "Core Project: Diamond Collector: Inclusive Counts and Duplicates"
			},
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 3: Frequency Maps, Sets, Sorting, and Prefix Counts",
				sourceSection: "supplementalProjects",
				itemId: "usaco-bronze-unit-3-frequency-maps-sets-sorting-and-prefix-counts-supplemental-problem-diamond-collector",
				moduleTitle:
					"Unit 3: Frequency Maps, Sets, Sorting, and Prefix Counts",
				section: "supplementalProjects",
				learningPath: "choice",
				variant: "retry",
				title: "Diamond Collector: Inclusive Counts and Duplicates: Changed Case Practice"
			}
		]
	},
	{
		slug: "milkorder",
		title: "Milking Order: Feasibility, Preparation and Postmortem",
		requirements:
			"This practice scaffold is for preparation or postmortem outside a protected timer. Complete the required three-problem mock using unseen Bronze problems, a continuous timer, one empty solution file per problem, permitted basic references only and no supplied starter, reference, hints or assistance. Preserve submitted attempts and judge results before explanations. Diagnose an unsolved problem with its smallest counterexample and produce a later independent rewrite. Completing this feasibility helper or reading its reference does not earn the independent mock or tier-transition gate.",
		retry: "Close the reference. Choose one case with cow 1 fixed, one where cow 1 is in the hierarchy and one where it is absent. Enumerate tiny legal full orders independently and predict the earliest position. Check both Boolean False and a missing return value refuse the base feasibility test and preserve an earlier answer, including a fixed cow 1. Keep each trial state separate. Use this practice only before or after the protected window.",
		folder: "UB50-Milking-Order",
		mode: "python",
		revision: "f189f7d71b170cfaf69798d411747234ab25d8c4",
		input: "milkorder.in",
		output: "milkorder.out",
		mainFile: "main.py",
		sourceGuideSha256:
			"c03976c775f2ad218de8779ba567391904e7649a0fab889213cc21d5727506cd",
		sampleInput: "10 4 3\n2 10 3 1\n7 7\n10 2\n8 4\n",
		sampleExpected: "5\n",
		contract:
			"Read N, M, K from `milkorder.in`, then M distinct cow IDs in hierarchy order, then K cow/position pairs. N is in 2..100; M and K are each in 1..N-1. Cow IDs and one-based positions are in 1..N. Every cow appears exactly once in the final order, hierarchy cows keep their listed relative order, and fixed positions must be honored. A valid order is guaranteed. Write the earliest feasible one-based position of cow 1 to `milkorder.out`.\n\nThis standalone guide supplies the course contract and explicit verification bounds. The [original problem resource](https://usaco.org/index.php?page=viewproblem2&cpid=832) is additional reading; no account is needed to use this pack.",
		prediction:
			"Cow 10 must occupy position 2 and cow 8 position 4. Hierarchy 2,10,3,1 requires cow 2 before position 2 and cow 3 after it but before cow 1. Cow 1 cannot use position 3 because cow 3 still needs an earlier free position; position 4 is fixed. Position 5 works, so the answer is 5. `sample.expected` stores the exact answer with a final newline. Read the included input file and record a manual trace before execution.",
		tasks: "Complete `check(N,social,req_cows)`, returning a Boolean feasibility result. Reserve all fixed positions first. Traverse hierarchy cows in order; use their fixed slot when present and reject a slot before the current lower bound. Otherwise put the cow in the earliest free slot at or after that bound. The learner driver requires the base feasibility check to return Boolean True before continuing, including when cow 1 is already fixed. False, a missing return value and an unfinished task stop before an answer is published. The supplied `main` then tries candidate positions for cow 1 in ascending order and handles an already fixed cow 1. Explain why placing an unfixed hierarchy cow earlier cannot reduce the space available to later hierarchy cows.\n\nEach feasibility check scans at most N positions plus M hierarchy entries and K fixed entries. Trying up to N candidate positions takes O(N squared) time and O(N) state. State for each trial must be fresh.",
		checks: "For tiny N, enumerate every complete permutation, retain those satisfying both constraints and take the smallest position of cow 1. Test cow 1 fixed, in the hierarchy, absent from it, blocked early positions, hierarchy entries with fixed anchors and N=100. A false feasibility result must not leave trial state behind.\n\nA shared walkthrough pauses at the prediction, one state transition, the invariant and the independent check. Those same checkpoints support individual reading. For optional practice, change the input and predict a separate expected file before running. Retain a corrected trace and an explanation of one boundary case. This project does not complete every topic in its wider course unit.",
		guard: 'task_role="$(pwd)"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif cp main.py milkorder.in "$task_run/" \\\n    && (cd "$task_run" && python3 main.py) \\\n    && diff -u sample.expected "$task_run/milkorder.out" \\\n    && cp "$task_run/milkorder.out" milkorder.out.new \\\n    && mv milkorder.out.new milkorder.out; then\n    printf \'Verified milkorder.out\\n\'\nelse\n    task_status=$?\n    rm -f milkorder.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 5: Mock Contests, Postmortems, and Silver Readiness",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-unit-5-mock-contests-postmortems-and-silver-readiness-curriculum-core-project-contest-sets-and-tier-transition",
				moduleTitle:
					"Unit 5: Mock Contests, Postmortems, and Silver Readiness",
				section: "curriculum",
				learningPath: "core",
				variant: "core",
				title: "Core Project: Milking Order: Feasibility, Preparation and Postmortem"
			},
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 5: Mock Contests, Postmortems, and Silver Readiness",
				sourceSection: "supplementalProjects",
				itemId: "usaco-bronze-unit-5-mock-contests-postmortems-and-silver-readiness-supplemental-problem-milking-order",
				moduleTitle:
					"Unit 5: Mock Contests, Postmortems, and Silver Readiness",
				section: "supplementalProjects",
				learningPath: "challenge",
				variant: "retry",
				title: "Milking Order: Feasibility, Preparation and Postmortem: Changed Case Practice"
			},
			{
				courseId: "usaco-bronze-on-demand",
				sourceModuleTitle:
					"Stage 6: Protected Mock Contest and Postmortem",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-on-demand-stage-6-protected-mock-contest-and-postmortem-curriculum-concepts-milking-order",
				moduleTitle: "Stage 6: Protected Mock Contest and Postmortem",
				section: "curriculum",
				learningPath: "core",
				variant: "mock",
				title: "Milking Order: Feasibility, Preparation and Postmortem"
			}
		]
	},
	{
		slug: "family",
		title: "Family Tree: Parent Chains and Exact Relationship Output",
		requirements:
			"Use this relationship application to consolidate representation and exact-output reasoning; it does not itself prove contest readiness. Keep the wider exit portfolio: complete independent solves from more than one protected mock, one delayed rewrite of a missed problem, full constraint/complexity records, the smallest-counterexample postmortem and a cross-pattern explanation. Decide Silver readiness from repeatable independent work and the live promotion criteria, not merely this reference result. In the instructor course this is optional parent-chain practice after maps and structured state.",
		retry: "Close the reference and reverse the two query names. Predict the same ancestor/aunt first in the output. Independently draw chains for a mother, grand-mother, siblings, aunt, great-aunt, cousins and separate trees. Include an absent query name and a 100-relation chain. Save exact expected capitalization, hyphens and spaces, plus one corrected generation-distance trace.",
		folder: "UB51-Family-Tree",
		mode: "python",
		revision: "f189f7d71b170cfaf69798d411747234ab25d8c4",
		input: "family.in",
		output: "family.out",
		mainFile: "main.py",
		sourceGuideSha256:
			"dddcb81e364b791976ed41191eafc03121109b4becfe0e245d5b1d14ca1883e0",
		sampleInput:
			"7 AA BB\nMOTHER AA\nGGMOTHER BB\nMOTHER SISTER\nGMOTHER MOTHER\nGMOTHER AUNT\nAUNT COUSIN\nGGMOTHER GMOTHER",
		sampleExpected: "BB is the great-aunt of AA\n",
		contract:
			"Read N and two distinct query names from `family.in`, followed by N mother/child name pairs, with N in 1..100. Names contain 1..10 uppercase letters. Records form a maternal forest: each child has at most one mother and ancestry has no cycles. Write one exact relationship line to `family.out`. Shared mother gives SIBLINGS. Direct ancestry gives NAME is the mother, grand-mother, great-grand-mother, and so on, of OTHER. A sister of a direct ancestor gives NAME is the aunt, great-aunt, and so on, of OTHER. Other shared ancestry gives COUSINS; absent shared ancestry gives NOT RELATED. Put the ancestor or aunt first even if that reverses the input names.\n\nThis standalone guide supplies the course contract and explicit verification bounds. The [original problem resource](https://usaco.org/index.php?page=viewproblem2&cpid=833) is additional reading; no account is needed to use this pack.",
		prediction:
			"AA reaches MOTHER, GMOTHER, GGMOTHER in three parent steps. BB reaches GGMOTHER in one. The nearest shared ancestor is therefore at distances (3,1), making BB the great-aunt of AA. The required output includes the names and hyphen in great-aunt. `sample.expected` stores the exact answer with a final newline. Read the included input file and record a manual trace before execution.",
		tasks: "Complete `main(cow1,cow2,parents)` and return the complete relationship string without a newline. Trace both parent chains, including each query cow at distance zero. Find the nearest shared ancestor and both generation distances. Distances (1,1) mean siblings; both above one mean cousins. For other related cases, the shallower query cow is the ancestor or aunt. A mother is one generation away, a grandmother two; an aunt shares a mother with the target's mother. Preserve the exact required capitalization, spaces and hyphens.\n\nThe dictionary gives constant-time parent lookup on average. The reference scans one query chain for every ancestor of the other: O(N squared) time and constant additional traversal state. A separate ancestor-distance map can check the classification in O(N) time and space.",
		checks: "Compare against independently recorded ancestor chains and nearest shared ancestry. Check both query orientations, mother, grandmother, deep ancestry, siblings, aunt, great-aunt, cousins, separate trees and a query name absent from the records. Use a chain of 100 relations to check the longest allowed generation wording.\n\nA shared walkthrough pauses at the prediction, one state transition, the invariant and the independent check. Those same checkpoints support individual reading. For optional practice, change the input and predict a separate expected file before running. Retain a corrected trace and an explanation of one boundary case. This project does not complete every topic in its wider course unit.",
		guard: 'task_role="$(pwd)"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif cp main.py family.in "$task_run/" \\\n    && (cd "$task_run" && python3 main.py) \\\n    && diff -u sample.expected "$task_run/family.out" \\\n    && cp "$task_run/family.out" family.out.new \\\n    && mv family.out.new family.out; then\n    printf \'Verified family.out\\n\'\nelse\n    task_status=$?\n    rm -f family.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 4: Complete Search, Structured State, and Construction",
				sourceSection: "supplementalProjects",
				itemId: "usaco-bronze-unit-4-complete-search-structured-state-and-construction-supplemental-problem-family-tree",
				moduleTitle:
					"Unit 4: Complete Search, Structured State, and Construction",
				section: "supplementalProjects",
				learningPath: "choice",
				variant: "retry",
				title: "Family Tree: Parent Chains and Exact Relationship Output: Changed Case Practice"
			},
			{
				courseId: "usaco-bronze-on-demand",
				sourceModuleTitle:
					"Stage 7: Bronze Exit Portfolio and Silver Readiness",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-on-demand-stage-7-bronze-exit-portfolio-and-silver-readiness-curriculum-concepts-family-tree",
				moduleTitle:
					"Stage 7: Bronze Exit Portfolio and Silver Readiness",
				section: "curriculum",
				learningPath: "core",
				variant: "sequence",
				title: "Family Tree: Parent Chains and Exact Relationship Output"
			}
		]
	},
	{
		slug: "milk2",
		title: "Milking Cows: Coverage Runs and Intervals",
		requirements:
			"Complete the wider interval unit by tracing half-open endpoints, sorting and merging intervals, distinguishing overlap from adjacency, and stating a greedy invariant when merging. For [1,3), [3,5) and [8,9), predict covered run 4 and interior gap 3; [1,5) with a nested [2,3) still covers four units. Compare the supplied difference-array/prefix representation with a sorted-merge checker. Retain operation and storage bounds and a changed-case diagnosis; one successful sample does not complete arrays or greedy reasoning.",
		retry: "Use unsorted intervals [8,9), [3,5), [1,3) and predict 4 3. Add [2,3) and explain why the answer stays the same. Compare the difference-array run with independently sorted/merged intervals, including adjacent boundaries and a one-unit gap.",
		folder: "UB6-Milking-Cows",
		mode: "python",
		revision: "f189f7d71b170cfaf69798d411747234ab25d8c4",
		input: "milk2.in",
		output: "milk2.out",
		mainFile: "main.py",
		sourceGuideSha256:
			"36513f349ef52dbdb999e4534e3261a3458b206947fc61498026c928f5fc962c",
		sampleInput: "3\n300 1000\n700 1200\n1500 2100",
		sampleExpected: "900 300\n",
		contract:
			"Read `milk2.in`: N followed by N start/end pairs. This course pack uses 1..5000 intervals with integer times in 0..1000000 and start < end. An interval covers [start,end): the end instant is not an extra unit. Write the longest continuous period covered by at least one interval and the longest uncovered gap between the earliest start and latest end, separated by a space, to `milk2.out`. Do not count time before the first interval or after the last. Touching intervals form one continuous period.\n\nThis standalone guide supplies the course contract and explicit verification bounds. The [original problem resource](https://train.usaco.org/) is additional reading; no account is needed to use this pack.",
		prediction:
			"The first two intervals overlap, so together they cover 300..1200, a length of 900. The gap to 1500 has length 300; the last interval lasts 600. The expected answer is `900 300`. `sample.expected` stores the exact answer with a final newline. Read the included input file and record a manual trace before execution.",
		tasks: "Complete `calc_times(milk_times)`, returning (longest_covered, longest_uncovered). The supplied driver turns intervals into Boolean time units. After each unit, the two current run counters describe runs ending at that unit; at most one is positive. Maintain each maximum and reset the other current counter when the state changes. Explain why a duplicated or nested interval contributes coverage without increasing the elapsed time.\n\nThe supplied difference array records two boundaries per interval, then computes a prefix sum. Total time is O(N + T), space O(T), where T is latest_end - earliest_start, at most 1000000. This replaces the previous repeated per-interval filling, which could do 5000 times as much work on overlapping intervals.",
		checks: "Independently sort and merge intervals, then compare the longest merged interval and longest gap. Check a single interval, identical intervals, nesting, adjacency, unsorted disjoint intervals and a gap of one time unit. At the course limit, 5000 copies of [0,1000000) must return `1000000 0`.\n\nA shared walkthrough pauses at the prediction, one state transition, the invariant and the independent check. Those same checkpoints support individual reading. For optional practice, change the input and predict a separate expected file before running. Retain a corrected trace and an explanation of one boundary case. This project does not complete every topic in its wider course unit.",
		guard: 'task_role="$(pwd)"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif cp main.py milk2.in "$task_run/" \\\n    && (cd "$task_run" && python3 main.py) \\\n    && diff -u sample.expected "$task_run/milk2.out" \\\n    && cp "$task_run/milk2.out" milk2.out.new \\\n    && mv milk2.out.new milk2.out; then\n    printf \'Verified milk2.out\\n\'\nelse\n    task_status=$?\n    rm -f milk2.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 2: Intervals, Arrays, and Greedy Warmups",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-unit-2-intervals-arrays-and-greedy-warmups-curriculum-core-project-intervals-arrays-and-greedy-warmups",
				moduleTitle: "Unit 2: Intervals, Arrays, and Greedy Warmups",
				section: "curriculum",
				learningPath: "core",
				variant: "core",
				title: "Core Project: Milking Cows: Coverage Runs and Intervals"
			},
			{
				courseId: "usaco-bronze",
				sourceModuleTitle:
					"Unit 2: Intervals, Arrays, and Greedy Warmups",
				sourceSection: "supplementalProjects",
				itemId: "usaco-bronze-unit-2-intervals-arrays-and-greedy-warmups-supplemental-problem-milking-cows",
				moduleTitle: "Unit 2: Intervals, Arrays, and Greedy Warmups",
				section: "supplementalProjects",
				learningPath: "choice",
				variant: "retry",
				title: "Milking Cows: Coverage Runs and Intervals: Changed Case Practice"
			},
			{
				courseId: "usaco-bronze-on-demand",
				sourceModuleTitle:
					"Stage 3: Arrays, Intervals, Counting, and Greedy",
				sourceSection: "curriculum",
				itemId: "usaco-bronze-on-demand-stage-3-arrays-intervals-counting-and-greedy-curriculum-concepts-milking-cows",
				moduleTitle: "Stage 3: Arrays, Intervals, Counting, and Greedy",
				section: "curriculum",
				learningPath: "core",
				variant: "sequence",
				title: "Milking Cows: Coverage Runs and Intervals"
			}
		]
	}
] as const;

export function bronzeRequiredAssignment(courseId: string, itemId: string) {
	for (const pack of bronzeRequiredPacks) {
		const assignment = pack.assignments.find(
			item => item.courseId === courseId && item.itemId === itemId
		);
		if (assignment) return { pack, assignment };
	}
}

export function applyBronzeRequiredAssignments(
	courseId: string,
	course: RawCourse
) {
	if (courseId === "usaco-bronze") {
		for (const gate of [
			{
				module: "Unit 1: Simulation and Careful Translation",
				id: "usaco-bronze-unit-1-simulation-and-careful-translation-curriculum-simulation-mastery-gate",
				title: "Simulation Mastery Gate",
				content:
					"Complete the required simulations before this exit check. Close the reference and trace a fresh Lost Cow case using the original start, current position, next endpoint, distance and stopping rule. Compare with a separate unit-step oracle; retain one endpoint case and one stop inside a leg. For another simulation, show how reversing two updates changes the result. Explain a corrected discrepancy and the largest legal work bound. In a shared walkthrough, explain the same state table without being supplied the next transition. Optional retries can repair a diagnosed weakness; repeating a sample does not establish this transfer."
			},
			{
				module: "Unit 4: Complete Search, Structured State, and Construction",
				id: "usaco-bronze-unit-4-complete-search-structured-state-and-construction-curriculum-complete-search-mastery-gate",
				title: "Complete Search Mastery Gate",
				content:
					"Complete the required Wormholes checkpoint before this exit check. Close the reference and use points (0,0), (1,0), (1,1), (0,1). Enumerate all three pairings of this square, validate symmetric partners and explain which two transition graphs cycle under teleport-then-right movement. Trace restoration after a rejected branch and prove each complete pairing occurs once. Move (1,1) to (2,2), predict the changed count and compare with a separately built directed graph. For a fresh constructive witness, place cows 1 through 5 exactly once in positions 1 through 5, with cow 3 before cow 1 before cow 4 and cow 2 fixed at position 4. Write a legal order, replay every constraint and determine cow 1's earliest feasible position by checking the 120 permutations independently. Explain when a direct simulation, such as Lost Cow, avoids enumeration. Retain the state-space bound, independent check and a corrected counterexample; an instructor walkthrough uses the same evidence."
			}
		]) {
			const module = course.modules.find(
				module => module.title === gate.module
			);
			if (!module)
				throw new Error(`Missing Bronze mastery unit: ${gate.module}`);
			if (!module.curriculum.some(item => item.id === gate.id)) {
				module.curriculum.push({
					id: gate.id,
					title: gate.title,
					content: gate.content,
					learningPath: "core"
				});
			}
		}
		const search = course.modules.find(
			module =>
				module.title ===
				"Unit 4: Complete Search, Structured State, and Construction"
		)!;
		const witnessId =
			"usaco-bronze-unit-4-complete-search-structured-state-and-construction-supplemental-constructive-witness-practice";
		if (!search.supplementalProjects.some(item => item.id === witnessId)) {
			search.supplementalProjects.push({
				id: witnessId,
				title: "Constructive Witness Practice",
				learningPath: "choice",
				content: [
					"## Constructive Witness Practice",
					"**Optional practice:** Choose this worksheet when a feasibility answer is clear but constructing and checking the actual result needs practice. Use a paper trace or a small independent checker before the unit exit gate.",
					"## Contract and worked trace",
					"Place cows 1, 2, 3 and 4 exactly once in positions 1 through 4. Cow 2 must precede cow 3, and cow 4 must occupy position 2. A witness is the full order; the optimization question asks for cow 1's earliest feasible position.",
					"The order [2,4,3,1] is legal: every cow occurs once, cow 2 is at position 1 before cow 3 at position 3, and cow 4 occupies position 2. Cow 1 is at position 4. The order [1,4,2,3] also passes every constraint and puts cow 1 at position 1. Since positions begin at 1, this second witness proves the optimum is 1.",
					"## Guided implementation",
					"Build a cow-to-position table from the proposed order. Reject a wrong length, a missing or repeated cow, an out-of-range ID, a violated fixed position or a reversed hierarchy pair. Check these rules before reporting success. For this four-cow case, separately list all 4! = 24 permutations, retain the legal ones and compare the smallest position of cow 1.",
					"## Changed-case reconstruction",
					"Close the worked trace. First fix cow 4 at position 1 while retaining cow 2 before cow 3. Then use cow 3 before cow 2 with cow 4 fixed at position 3. Predict a legal order and cow 1's earliest position for each case before checking all 24 permutations. Retain the predictions and explain a corrected mismatch.",
					"## Check and explain",
					"For the original contract, diagnose [1,4,2,2] (repeated/missing cow), [1,2,4,3] (wrong fixed position), and [3,4,2,1] (reversed hierarchy). A checker must reject each for its actual violated rule. Keep the witness, position table, independent enumeration and a corrected case. The unit exit gate uses a separate five-cow contract with 120 permutations."
				].join("\n\n")
			});
		}
	}
	for (const pack of bronzeRequiredPacks) {
		for (const assignment of pack.assignments) {
			if (assignment.courseId !== courseId) continue;
			const target = course.modules.find(
				module => module.title === assignment.moduleTitle
			);
			const matches = course.modules.flatMap(module =>
				(["curriculum", "supplementalProjects"] as const).flatMap(
					section =>
						module[section].flatMap((item, index) =>
							item.id === assignment.itemId ||
							(module.title === assignment.sourceModuleTitle &&
								section === assignment.sourceSection &&
								item.projectLink?.endsWith(
									`/${pack.folder}/starter`
								))
								? [{ module, section, item, index }]
								: []
						)
				)
			);
			if (!target || matches.length !== 1) {
				throw new Error(
					`Missing or ambiguous Bronze assignment: ${assignment.itemId}`
				);
			}
			const source = matches[0]!;
			if (
				source.module !== target ||
				source.section !== assignment.section
			) {
				source.module[source.section].splice(source.index, 1);
				const gate = target[assignment.section].findIndex(item =>
					item.title.endsWith("Mastery Gate")
				);
				target[assignment.section].splice(
					gate < 0 ? target[assignment.section].length : gate,
					0,
					source.item
				);
			}
			Object.assign(source.item, {
				id: assignment.itemId,
				title: assignment.title,
				learningPath: assignment.learningPath,
				projectLink: `https://github.com/instruction-material/USACO-Bronze/tree/${pack.revision}/${pack.folder}/starter`,
				solutionLink: `https://github.com/instruction-material/USACO-Bronze/tree/${pack.revision}/${pack.folder}/solution`
			});
		}
	}
}

export function bronzeRequiredProjectKey(
	courseId: string,
	itemId: string,
	role: "starter" | "reference",
	sourceUrl: string
) {
	const base = `${courseId}:${itemId}:${role}`;
	const current = bronzeRequiredAssignment(courseId, itemId);
	const sourceRole = role === "reference" ? "solution" : "starter";
	return current &&
		sourceUrl ===
			`https://github.com/instruction-material/USACO-Bronze/tree/${current.pack.revision}/${current.pack.folder}/${sourceRole}`
		? `${base}:${current.pack.mode === "java" ? "native-java" : "python-file-io"}`
		: base;
}

export function bronzePythonFileIoForKey(courseProjectKey?: string) {
	const parts = (courseProjectKey ?? "").split(":");
	const [course = "", item = "", role, variant] = parts;
	const current = bronzeRequiredAssignment(course, item);
	return parts.length === 4 &&
		variant === "python-file-io" &&
		["starter", "reference"].includes(role ?? "") &&
		current?.pack.mode === "python"
		? current.pack
		: null;
}

export function bronzeRequiredNativeInstructions(
	current: NonNullable<ReturnType<typeof bronzeRequiredAssignment>>
) {
	const { pack } = current;
	return [
		pack.mode === "java"
			? "The site's Java teaching preview does not execute this native file-I/O exercise. Choosing Run displays these instructions. Save the attempt, download its ZIP and extract the whole role folder. Use JDK 17 or newer."
			: `This Python file-I/O project can run in the site IDE. Select main.py, edit ${pack.input} and choose Run; then open the generated ${pack.output} file. On a phone, choose Code to inspect a file or Console to read a failure. It reads that project file, so there is no browser Input panel for this imported role. Save and export the complete attempt for a native run with Python 3.9 or newer.`,
		`Keep ${pack.mainFile}, ${pack.input}, README.md and sample.expected together. Learner and reference use separate saved roles and folders. An included old ${pack.output} is historical sample data; inspect a new result only after a successful run.`,
		`${pack.mode === "java" ? "The untouched Java learner exits 2" : "The untouched Python learner raises NotImplementedError"}, creates no answer file and preserves an earlier answer. Predict changed-case results independently; a matching sample alone does not prove correctness.`,
		"Run the following tested shell guard from the extracted role folder. It executes current source in a separate temporary folder, compares the sample and publishes only a successful matching result. Failed or unfinished work preserves an earlier answer. In another terminal follow the same steps, checking each exit status before continuing.",
		pack.guard,
		`After changing ${pack.input}, predict a separate expected file and use that comparison before publishing ${pack.output}. Keep earlier source, inputs, notes and answers. A driver validates its stated structure; it does not grade the completed algorithm.`
	];
}

export function bronzeRequiredCourseBrief(
	current: NonNullable<ReturnType<typeof bronzeRequiredAssignment>>
) {
	const { pack, assignment } = current;
	const optional =
		assignment.variant === "retry" || assignment.variant === "log";
	const sequence =
		assignment.variant === "mock"
			? "**Learning sequence:** Required preparation and postmortem outside the protected timer. The actual mock uses three unseen problems and empty files; these import actions are practice tools before or after that window."
			: optional
				? "**Learning sequence:** Optional changed-case reconstruction after the required prerequisite. Close the reference, make a fresh prediction, preserve a separate attempt and explain a mismatch. Repeating the original sample does not complete this retry."
				: assignment.variant === "sequence"
					? "**Learning sequence:** Required stage checkpoint in the structured independent sequence. Read, predict, trace, implement and retain an independent check before the next mastery gate."
					: "**Learning sequence:** Required implementation checkpoint. Predict, define the state, trace a tiny case, implement and retain an independent check. An instructor can pause at those same steps.";
	const native = bronzeRequiredNativeInstructions(current);
	const sampleBlock = (value: string) =>
		`\`\`\`text\n${value}${value.endsWith("\n") ? "" : "\n"}\`\`\``;
	return [
		`## ${assignment.title}`,
		sequence,
		"Existing saved attempts and progress identities retain their source, inputs, notes and timestamps. The confirmed file-I/O import saves separately from an earlier attempt; required and optional entries, and learner and reference roles, remain distinct.",
		"## Contract and reasoning",
		pack.contract,
		"## Guided implementation",
		`Included ${pack.input}:\n\n${sampleBlock(pack.sampleInput)}`,
		`Exact sample output in ${pack.output}:\n\n${sampleBlock(pack.sampleExpected)}`,
		pack.prediction,
		pack.tasks,
		"## Check and explain",
		pack.checks,
		optional
			? pack.retry
			: "Preserve two changed-case predictions, the independent oracle and one explained discrepancy before comparing the separate reference.",
		"## Unit completion requirements",
		pack.requirements,
		"## Open, save and run",
		...native.slice(0, 4),
		`\`\`\`sh\n${pack.guard}\n\`\`\``,
		...native.slice(5),
		"Open the learner action and confirm the import before any source fetch. Preserve the attempt and explanation before opening the separately saved reference. Protected mocks and active contests start from empty files with reference browsing closed."
	].join("\n\n");
}
