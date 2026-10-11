// Exact source roles and existing lesson identities, including the transition log.
export const silverJavaPacks = [
	{
		slug: "maxcross",
		folder: "US25-Why-Did-the-Cow-Cross-the-Road-II",
		revision: "de7ac589f93fe91a2bb60c728f2a8d36e46bd27f",
		title: "Signal Repairs and Native Window Setup",
		purpose:
			"Required implementation checkpoint for native setup and the Bronze-to-Silver transition. Establish exact file I/O, predictions, a saved first attempt and a linear window invariant. Later range-query work extends this baseline; this problem does not replace the unit's other setup requirements.",
		retry: "Keep the optional practice log's purpose: record one structural idea, one failed approach, one Bronze habit that still helps and one old instinct that wastes effort. Compare O(NK) recounting with O(N) window counts. Move a broken signal so the best block changes ends, predict the new answer and explain a mismatch before revising the approach.",
		input: "maxcross.in",
		output: "maxcross.out",
		mainFile: "Main.java",
		contract:
			"[Official problem: February 2017 Silver, problem 2](https://usaco.org/index.php?page=viewproblem2&cpid=715).\nSignals are numbered 1 through N; exactly B distinct signals are broken.\nRepair as few as possible to obtain at least K consecutive working signals.\nIt suffices to check blocks of exactly K, since every longer block contains one.\n\n- Read `maxcross.in` from the process's working directory: N, K, B, then B broken\n  signal IDs. Their input order is irrelevant.\n- Limits: 1 <= N <= 100000, 1 <= K,B <= N; IDs are distinct and in 1..N.\n- Write the minimum repair count and a newline to `maxcross.out`. Zero is a\n  valid answer even though the input has at least one broken signal.\n\nThe supplied reader builds a boolean array indexed by signal ID, with zero\nunused. It rejects missing/extra integers, duplicate/out-of-range IDs and inputs\noutside the limits before trying to write an answer.",
		prediction:
			"Both roles contain the official `maxcross.in`:\n\n```text\n10 6 5\n2\n10\n1\n5\n9\n```\n\nBlocks 1..6, 2..7, 3..8, 4..9 and 5..10 need 3, 2, 1, 2 and 3 repairs.\nThe answer is `1`: block 3..8 requires only signal 5 to be repaired.\nBefore running code, explain these additional cases:\n\n| N, K, B | Broken IDs | Answer | Boundary |\n| --- | --- | --- | --- |\n| 1, 1, 1 | 1 | 1 | Single signal. |\n| 5, 3, 2 | 2, 1 | 0 | Last block already works. |\n| 4, 2, 4 | 4, 2, 1, 3 | 2 | All signals broken. |\n| 5, 5, 1 | 3 | 1 | Only one possible block. |",
		tasks: "Complete `minimumRepairs(InputData input)` in `starter/Main.java`.\n\n1. State why legal starts are 1 through N-K+1, including both end blocks.\n2. Choose prefix counts or a rolling count. If P[t] counts broken signals in\n   1..t and P[0]=0, block l..r has P[r]-P[l-1] broken signals. State that\n   invariant before filling the array. A rolling count removes the departing\n   signal and adds the entering one exactly once.\n3. Evaluate every K-length block and retain its smallest broken count. Explain\n   why this count equals the necessary repair count for that block.\n4. Target O(N) time and O(N) memory with the supplied boolean array. Recounting\n   every entire block costs O(NK), which is too slow at the maximum size.\n\nUntouched learner work throws an unfinished-task exception and exits 2 with a\nstandard-error diagnostic. It creates no answer and preserves an existing\n`maxcross.out`. The answer file opens only after parsing and learner work succeed.\nA returned result is checked only for its possible range, not its optimality.",
		checks: "For small N, independently list all blocks and count their broken IDs directly.\nCompare against the learner using unsorted IDs, K=1, K=N, all signals broken\nand a last-block optimum. At N=100000, K=N and all signals broken require\n100000 repairs. The verifier also checks a near-full alternating pattern.\n\nAfter preserving the attempt, read the reference: it sorts broken IDs and builds\nprefix counts, costing O(B log B + N) time and O(N+B) memory. Its code is\nunchanged. Match its prefix entries to the learner invariant, then construct a\nnew input whose best block lies at the opposite end of the road.",
		assignments: [
			{
				itemId: "usaco-silver-uss0-setup-and-silver-transition-curriculum-core-project-setup-and-silver-transition",
				moduleId: "usaco-silver-uss0-setup-and-silver-transition",
				moduleTitle: "USS0 Setup and Silver Transition",
				section: "curriculum",
				variant: "core",
				learningPath: "core",
				title: "Core Project: Signal Repairs and Native Window Setup"
			},
			{
				itemId: "usaco-silver-uss0-setup-and-silver-transition-supplemental-silver-log-setup-and-silver-transition",
				moduleId: "usaco-silver-uss0-setup-and-silver-transition",
				moduleTitle: "USS0 Setup and Silver Transition",
				section: "supplementalProjects",
				variant: "log",
				learningPath: "choice",
				title: "Silver Log: Setup and Window Reasoning"
			}
		]
	},
	{
		slug: "cowdance",
		folder: "US21-Cow-Dance-Show",
		revision: "de7ac589f93fe91a2bb60c728f2a8d36e46bd27f",
		title: "Cow Dance Show Scheduling and First Feasible Size",
		purpose:
			"Required implementation checkpoint for ordered simulation, a min-heap invariant and monotone feasibility. Keep arrival order, include the exact deadline and justify the first feasible stage size. Continue the unit's other greedy, bitwise and structured-simulation work separately.",
		retry: "Change the official sample deadline from 8 to 11 to 16 and predict minimum sizes 4, 3 and 2. Then use four durations of 3 with deadlines 6 and 3; predict 2 and 4. Close the reference, retain the new schedule traces and compare an ordinary slot-array checker before explaining ties and the search boundary.",
		input: "cowdance.in",
		output: "cowdance.out",
		mainFile: "Main.java",
		contract:
			"[Official problem: January 2017 Silver, problem 1](https://usaco.org/index.php?page=viewproblem2&cpid=690).\nA stage holds K cows. The first K start at time zero; whenever one finishes,\nthe next waiting cow immediately starts. Preserve the given arrival order.\nThe show ends when its last cow finishes. Find the smallest K whose finish\ntime is at most Tmax, including equality.\n\n- Read `cowdance.in`: N and Tmax, followed by N durations in order.\n- Limits: 1 <= N <= 10000, 1 <= Tmax <= 1000000; durations are in 1..100000.\n  K=N is guaranteed feasible, so every duration is at most Tmax.\n- Write K and a newline to `cowdance.out`, with 1 <= K <= N.\n- Do not sort durations or allow a cow to begin before a slot frees.\n\nThe reader validates the bounds, exact integer count and K=N guarantee.\nThese guards check input validity, not scheduling correctness.",
		prediction:
			"The supplied official `cowdance.in` is:\n\n```text\n5 8\n4\n7\n8\n6\n4\n```\n\nFor K=3, initial finish times are 4, 7 and 8. Cow 4 starts at 4 and finishes\nat 10; cow 5 starts at 7 and finishes at 11. The show ends at 11 and fails.\nFor K=4, cow 5 starts at 4 and finishes at 8; all cows finish by 8.\nK=1 takes 29 and K=2 takes 16, so the answer is `4`.\n\n| Durations | Tmax | Minimum K | Boundary |\n| --- | --- | --- | --- |\n| 7 | 7 | 1 | One cow; exact deadline. |\n| 3, 3, 3, 3 | 6 | 2 | Simultaneous departures; two waves. |\n| 3, 3, 3, 3 | 3 | 4 | All cows must start immediately. |\n| 4, 1, 1 | 6 | 1 | One slot meets the deadline exactly. |",
		tasks: "Complete both tasks in `starter/Main.java`.\n\n1. Implement `finishesWithin`: the heap holds active cows' finish times. Insert\n   the first K durations. For each waiting cow, remove the earliest finish time\n   and insert that time plus its duration. Explain why the minimum is the next\n   available slot. Repeated equal minima allow simultaneous starts without delay.\n2. At the end, compare the greatest remaining finish time with the deadline.\n   Test this predicate on the schedules above before implementing the search.\n3. Implement `minimumStageSize`. Increasing K cannot increase the finish time;\n   feasibility changes from false to true, with possible equal times. Search\n   for the first true value. Explain which half retains the answer after each\n   midpoint result, and why K=N provides a feasible upper bound.\n4. Heap insertion and polling each cost O(log K); `peek` costs O(1). One check\n   costs O(N log K) for K>1 and O(N) for K=1. Binary search gives O(N log² N)\n   worst-case time and O(N) total memory including input. The duration sum is\n   at most 1000000000, so finish times fit a Java `int` for this contract.\n\nUntouched work exits 2 with an unfinished-task diagnostic and preserves an\nexisting `cowdance.out`. The answer file opens only after parsing and learner\nwork succeed. The returned K is checked only for range, not feasibility or\nminimality.",
		checks: "For small N, try every K. Use an ordinary array of K finish times; find the\nsmallest slot by scanning and add the next duration there. Compare the first\nfeasible K against the learner. This oracle uses neither heap nor binary search.\nAt N=10000 with all durations 100000, Tmax=100000 requires K=10000 and\nTmax=1000000 requires K=1000. With all durations 1 and Tmax=1000000, K=1\nsuffices. Include exact deadlines and tied finish times.\n\nAfter preserving the attempt, compare the reference's search boundaries and\nheap state with these invariants. Two misleading comments now correctly state\nthat the search finds the minimum feasible K and polling costs O(log K).\nThe algorithm is unchanged. Change only a deadline and predict how K changes.",
		assignments: [
			{
				itemId: "usaco-silver-unit-5-greedy-priority-queues-bitwise-and-structured-simulation-curriculum-core-project-greedy-and-structured-simulation",
				moduleId:
					"usaco-silver-unit-5-greedy-priority-queues-bitwise-and-structured-simulation",
				moduleTitle:
					"Unit 5: Greedy, Priority Queues, Bitwise, and Structured Simulation",
				section: "curriculum",
				variant: "core",
				learningPath: "core",
				title: "Core Project: Cow Dance Show Scheduling and First Feasible Size"
			},
			{
				itemId: "usaco-silver-unit-5-greedy-priority-queues-bitwise-and-structured-simulation-supplemental-problem-cow-dance-show",
				moduleId:
					"usaco-silver-unit-5-greedy-priority-queues-bitwise-and-structured-simulation",
				moduleTitle:
					"Unit 5: Greedy, Priority Queues, Bitwise, and Structured Simulation",
				section: "supplementalProjects",
				variant: "retry",
				learningPath: "choice",
				title: "Cow Dance Show: Changed-Deadline Retry"
			}
		]
	},
	{
		slug: "gifts",
		folder: "US38-Redistributing-Gifts",
		revision: "de7ac589f93fe91a2bb60c728f2a8d36e46bd27f",
		title: "Silver Capstone with Gifts and Acceptable Cycles",
		purpose:
			"Required implementation checkpoint within the Silver capstone. Use acceptable exchanges and return paths to distinguish each cow's best possibility from one joint assignment. This is one capstone problem; it does not complete protected Silver sets, postmortems or Gold readiness. Run protected sets from empty files with reference browsing closed, then retain a postmortem and a later fresh attempt.",
		retry: "Predict the three-cow rows 2 3 1; 1 3 2; 1 2 3: outputs 2,1,1 are separate best possibilities, supported by legal assignments (2,1,3) and (2,3,1). Change only cow 3's row to 3 1 2 and predict 2,1,3. Draw the return paths that disappear and check all legal permutations independently. A repeated output is allowed; a one-way wish alone is insufficient.",
		input: "input.txt",
		output: "stdout",
		mainFile: "src/main/java/Main.java",
		contract:
			"[Official problem: February 2022 Silver, problem 1](https://usaco.org/index.php?page=viewproblem2&cpid=1206).\nThere are N cows and gifts, numbered 1..N. Cow i initially owns gift i.\nEach cow lists a permutation of gift IDs, best first. A legal reassignment\nuses each gift once and gives no cow a gift worse than its original one.\nFor each cow, output its best gift among all legal reassignments.\n\n- Standard input: N followed by N rows of N preference integers.\n- Limits: 1 <= N <= 500; each row is a permutation of 1..N.\n- Standard output: N gift IDs, one per line, in cow order.\n- Each line describes a separate best possibility. Output IDs may repeat and\n  need not themselves form one legal reassignment. A candidate is possible\n  only if some full legal reassignment gives that cow that gift.\n\nThe reader validates bounds, exact integer count and permutations. Arrays use\nzero-based cow/rank indices and retain gift IDs in 1..N. The supplied `rankOf`\nreturns a zero-based rank; a smaller value means a better gift.",
		prediction:
			"The supplied `input.txt` contains the official sample:\n\n```text\n4\n1 2 3 4\n1 3 2 4\n1 2 3 4\n1 2 3 4\n```\n\nThe answer is `1`, `3`, `2`, `4` on separate lines. Cows 2 and 3 can exchange\ngifts; cows 1 and 4 cannot improve. Explain why cow 3 wanting gift 1 does not\nmake it obtainable.\n\nAlso predict this teaching case:\n\n```text\n3\n2 3 1\n1 3 2\n1 2 3\n```\n\nIts answer is `2`, `1`, `1`. Assignment (2,1,3) gives cow 2 its favorite;\nassignment (2,3,1) gives cow 3 its favorite. Both are legal, but the reported\nbest possibilities (2,1,1) cannot occur together. Formatting must allow repeats.\nFor N=1 the answer is 1. If every cow ranks its own gift first, no cow improves.\nIf all first choices form one cycle, rotating gifts attains those first choices.",
		tasks: "Complete `reachability` and `bestGifts` in `starter/src/main/java/Main.java`.\n\n1. Define an edge i -> j when cow i accepts gift j, including its own gift.\n   Exclude gifts ranked after its own. Draw both teaching graphs first.\n2. Gift j is possible for cow i when acceptable edge i -> j has a return path\n   j -> i. Rotate gifts around that cycle and leave other cows unchanged.\n   Conversely, every legal full reassignment decomposes into acceptable cycles.\n   This establishes both directions of the criterion.\n3. Compute transitive reachability with Floyd-Warshall's intermediate vertex\n   as the outer loop. State which paths are represented after each iteration.\n   N<=500 permits O(N³) time and O(N²) space.\n4. For each cow scan its preferences, best first, through its own gift. Return\n   the first acceptable gift with a return path. Its own gift ensures an answer\n   exists. Preserve one edge direction and explain the ID/index conversions.\n5. Keep answers in cow order. `formatAnswers` checks length, range and that\n   each gift is no worse than that cow's original. It allows repeated IDs and\n   does not grade reachability or optimality.\n\nUntouched work exits 2 and prints only a diagnostic to standard error; the\nentire answer is buffered before writing standard output. The unchanged\nreference stores reversed acceptable edges, owner -> recipient. The cycle\ncriterion is equivalent, but restate its indices before comparing it.",
		checks: "For N<=6 enumerate all N! assignments, reject any that leave a cow worse off,\nand record each cow's best gift independently across the remaining assignments.\nThis oracle uses neither graph reachability nor Floyd-Warshall. Include the\nrepeated-output teaching case, own-first rankings, asymmetric wishes and cycles.\n\nAt N=500 with every row 1..500, cow 1 must keep gift 1, then cow 2 must keep\ngift 2, and so on. All cows retain their own gifts. A single cycle of first\nchoices gives every cow its first choice. The verifier checks both constructions\nand legal small cases. After comparing the reference, change one row and\nexplain which return paths disappear.",
		assignments: [
			{
				itemId: "usaco-silver-unit-6-protected-silver-sets-postmortems-and-gold-readiness-curriculum-core-project-silver-capstone-sets",
				moduleId:
					"usaco-silver-unit-6-protected-silver-sets-postmortems-and-gold-readiness",
				moduleTitle:
					"Unit 6: Protected Silver Sets, Postmortems, and Gold Readiness",
				section: "curriculum",
				variant: "core",
				learningPath: "core",
				title: "Core Project: Silver Capstone with Gifts and Acceptable Cycles"
			},
			{
				itemId: "usaco-silver-unit-6-protected-silver-sets-postmortems-and-gold-readiness-supplemental-problem-redistributing-gifts",
				moduleId:
					"usaco-silver-unit-6-protected-silver-sets-postmortems-and-gold-readiness",
				moduleTitle:
					"Unit 6: Protected Silver Sets, Postmortems, and Gold Readiness",
				section: "supplementalProjects",
				variant: "retry",
				learningPath: "choice",
				title: "Redistributing Gifts: Changed-Preference Retry"
			}
		]
	}
] as const;

export function silverJavaAssignment(itemId: string) {
	for (const pack of silverJavaPacks) {
		const assignment = pack.assignments.find(
			item => item.itemId === itemId
		);
		if (assignment) return { pack, assignment };
	}
}

export function silverJavaProjectKey(
	courseId: string,
	itemId: string,
	role: "starter" | "reference",
	sourceUrl: string
) {
	const base = `${courseId}:${itemId}:${role}`;
	const pack = silverJavaAssignment(itemId)?.pack;
	const pathRole = role === "reference" ? "solution" : "starter";
	return courseId === "usaco-silver" &&
		pack &&
		sourceUrl ===
			`https://github.com/instruction-material/USACO-Silver/tree/${pack.revision}/${pack.folder}/${pathRole}`
		? `${base}:native-java`
		: base;
}

export function silverJavaNativeInstructions(
	current: NonNullable<ReturnType<typeof silverJavaAssignment>>
) {
	const { pack } = current;
	const commands = [
		"The site's Java teaching preview does not execute this native Java exercise. Save the attempt, download its ZIP and extract the complete role folder. Choosing Run displays these instructions. Use JDK 17 or newer from the extracted folder, retaining its README and source paths.",
		"mkdir -p target/classes",
		`javac --release 17 -encoding UTF-8 -Xlint:all -Werror -d target/classes ${pack.mainFile}`,
		pack.slug === "gifts"
			? "java -ea -cp target/classes Main < input.txt"
			: "java -ea -cp target/classes Main",
		"Run Java only after compilation succeeds. Keep learner and reference source and compiled classes in separate folders."
	];
	if (pack.slug === "gifts") {
		return [
			...commands,
			"Gifts reads standard input and writes N separate best possibilities to standard output; IDs may repeat. There is no gifts.in/gifts.out contract. The browser Input panel does not execute this program. The untouched learner exits 2, buffers its answer and creates no answer file.",
			"To preserve answer.txt, use: if java -ea -cp target/classes Main < input.txt > answer.tmp; then mv answer.tmp answer.txt; else rm -f answer.tmp; fi. Direct > answer.txt truncates an older answer before Java starts.",
			'PowerShell: New-Item -ItemType Directory -Force target/classes; run the same javac command and stop if $LASTEXITCODE is nonzero. Use cmd /c "java -ea -cp target/classes Main < input.txt > answer.tmp"; move answer.tmp to answer.txt only if $LASTEXITCODE is zero, otherwise remove the temporary file.',
			"The reference retains its historical pom.xml. Direct JDK compilation needs no Maven or dependency download. Compare a successful reference run with sample.expected."
		];
	}
	return [
		...commands,
		`Keep ${pack.input} in the extracted working directory. Check exit status before reading ${pack.output}; the browser Input panel does not replace ${pack.input}. The untouched learner exits 2, creates no answer file and preserves an earlier answer. Input and result guards do not grade the algorithm.`,
		`PowerShell: New-Item -ItemType Directory -Force target/classes; run the same javac and java commands, stopping on a nonzero $LASTEXITCODE. Read the successful answer with Get-Content ${pack.output}. The reference includes ${pack.slug}.expected for sample comparison.`
	];
}

export function silverJavaCourseBrief(
	current: NonNullable<ReturnType<typeof silverJavaAssignment>>
) {
	const { pack, assignment } = current;
	const [workflow, mkdir, compile, run, ...nativeNotes] =
		silverJavaNativeInstructions(current);
	const sequence =
		assignment.variant === "core"
			? "**Learning sequence:** Required implementation checkpoint. Predict, state an invariant, trace a tiny case, implement and save an attempt before comparing the separate reference."
			: assignment.variant === "log"
				? "**Learning sequence:** This optional practice is a transition log. Preserve the structural idea, failed approach and transfer from Bronze; use a changed case to explain the decision, not only another copy of the sample."
				: "**Learning sequence:** This is optional practice after the required checkpoint. Close the reference and reconstruct a changed-case attempt with fresh predictions and a mismatch explanation. Repeating the original sample does not complete this retry.";
	return [
		`## ${assignment.title}`,
		sequence,
		pack.purpose,
		"Existing saved attempts keep their code, inputs, notes and timestamps. The confirmed Java import saves separately from older C++ attempts. The existing required and optional progress entries remain separate; learner and reference have separate saved roles.",
		"## Contract and reasoning",
		pack.contract,
		"## Guided implementation",
		pack.prediction,
		pack.tasks,
		"## Check and explain",
		pack.checks,
		assignment.variant === "core"
			? "Record two changed-case predictions, an independent check and a mismatch explanation. An instructor walkthrough pauses at the same invariant, trace and testing checkpoints."
			: pack.retry,
		"## Open, save and run",
		workflow,
		`\`\`\`sh\n${[mkdir, compile, run].join("\n")}\n\`\`\``,
		...nativeNotes,
		"Open the learner resource and confirm the import before fetching files. Save the learner attempt and explanation before opening the separately saved reference. The driver validates input and answer structure, not optimality. Protected mocks and active contests start from empty files and keep solution browsing closed."
	].join("\n\n");
}
