// These contracts are taken from the independently accepted native source guides.
export const goldImplementationLabRevision =
	"da5a720e4bd65eac62c0169da2fe9ed05acff078";
export const goldImplementationLabs = [
	{
		folder: "UG1-Dynamic-Programming-Practice",
		itemIds: [
			"usaco-gold-optional-historical-and-applied-gold-studios-supplemental-core-project-dynamic-programming-practice",
			"usaco-gold-optional-historical-and-applied-gold-studios-supplemental-extension-challenge-dynamic-programming-practice"
		],
		title: "Dynamic programming implementation practice",
		purpose:
			"A focused programming exercise after Fibonacci state design. It compares rolling contiguous-sum state, a grid table and recursive 0-1 choices. It complements the separate iterative knapsack exercise; it is not a contest input format.",
		contract:
			"No input file or terminal input is read. Edit the constants in a working copy. The three output lines are the maximum contiguous-subarray sum with an empty subarray allowed, the number of top-left to bottom-right grid paths using right/down steps, and the maximum value of a subset of distinct items within capacity. Each item is `[weight, value]`; the recursive index names the last available zero-based item, or -1 when none remain. Zero-weight items are allowed and can be taken once even at capacity zero.\n\nTeaching bounds: at most 2000 subarray values, each from -1000000 to 1000000; grid rows and columns from 1 to 15; at most 20 items, nonnegative weights/values at most 1000000, and capacity from 0 to 1000000. These keep array/grid totals in int and bound the exponential reference to at most 2^20 subsets. The reference assumes valid edited constants; the learner driver validates them.",
		prediction:
			"The default array `[5,-5,6,2,3]` has optimum 11. A 3-by-2 grid has 3 paths. Items `[[1,5],[2,3],[4,5],[2,3],[5,2]]` at capacity 10 have optimum 16, using the first four items (weight 9). The output is `11`, `3`, `16`, one number per line.",
		tasks: "1. Define the rolling state and empty-subarray base case.\n2. Define grid boundary counts and a legal evaluation order.\n3. Terminate recursive knapsack only after every item is considered.\n4. Compare skip/take branches that both move to the preceding item.\n\nThe distinct learner has four marked tasks. Untouched tasks exit 2 without producing an answer. The supplied driver validates parameters and feasible result structure; it does not prove algorithm optimality.\n\nFor independent work or an instructor walkthrough: predict the sample, state the invariant, trace one transition, save the attempt, and compare an independently checked changed case before opening the separate reference. Return to the same attempt for reflection; use changed small datasets for transfer practice.",
		checks: "Check an empty/all-negative subarray, a single-row/column grid, no items, no fitting item, a single item of weight 1 and value 5, and zero-weight positive-value items at capacity zero. Independently enumerate contiguous intervals and item subsets; enumerate tiny grid walks or use the binomial coefficient. Confirm input arrays remain unchanged. The original reference skipped item zero; its smallest correction also handles zero-weight items at capacity zero.\n\nMaximum subarray takes O(A) time and O(1) storage. Grid DP takes O(R*C) time/storage. Recursive knapsack takes O(2^K) worst-case time and O(K) call-stack space, without memoization. State repeated `(index,capacity)` calls before proposing memoization as an extension.",
		input: "",
		output: "",
		demonstration: true
	},
	{
		folder: "UG14-MST-II",
		itemIds: [
			"usaco-gold-optional-historical-and-applied-gold-studios-supplemental-core-project-mst-ii",
			"usaco-gold-optional-historical-and-applied-gold-studios-supplemental-extension-challenge-mst-ii"
		],
		title: "Priority-queue Prim with a dense matrix",
		purpose:
			"A focused implementation comparison after the core matrix Prim checkpoint. The queue changes vertex selection; the matrix still changes storage and neighbor-scan costs. MST II here means a second implementation of MST construction, not the second-best spanning-tree problem.",
		contract:
			"Read `prim.in`: `N M`, then M undirected edge lines `P Q W`. Vertices are zero-based. Teaching bounds are 1 <= N <= 2000, 0 <= M <= 200000, and 0 <= W <= 1000000000. The graph must be connected; N=1 and M=0 is valid. Parallel edges retain their cheapest weight and self-loops cannot join a tree. Write `prim.out`: one `vertex parent` line for each vertex 1 through N-1, then `Total Distance: TOTAL`. Root 0 has no printed parent. Use a long total. Any minimum tree is valid; tie-dependent parent choices may differ. The reference assumes valid tokens/bounds and refuses a disconnected graph before opening output.",
		prediction:
			"The supplied six-vertex, nine-edge graph has minimum total 33. Compare the provided reference edges with an independent cut or spanning-tree enumeration; do not require identical parents when weights tie. A two-vertex graph with weights 1 then 9 on the same pair must use weight 1. A three-vertex chain of weight 1000000000 on each edge totals 2000000000; a four-vertex chain totals 3000000000.",
		tasks: "1. Initialize keys, parents, visited state and the root queue entry.\n2. Extract the cheapest key and ignore already-attached vertices.\n3. Attach a fresh vertex and add its connecting key to a long total.\n4. Relax neighbors using one edge weight and enqueue improved keys.\n\nThe distinct learner has four marked tasks. Untouched tasks exit 2 without producing an answer. The supplied driver validates parameters and feasible result structure; it does not prove algorithm optimality.\n\nFor independent work or an instructor walkthrough: predict the sample, state the invariant, trace one transition, save the attempt, and compare an independently checked changed case before opening the separate reference. Return to the same attempt for reflection; use changed small datasets for transfer practice.",
		checks: "Check one vertex, zero-weight edges, ties, heavier parallel edges appearing last, self-loops, a disconnected graph and a total above int. Independently enumerate trees on small graphs and check N-1 real edges, connectivity, acyclicity and the reported sum. Preserve the previous answer on unfinished or refused runs. Queue staleness must not rescan matrix rows.\n\nStorage is O(N^2 + M) for the matrix and worst-case queued improvements. With each vertex row scanned once, time is O(N^2 + M log M). A priority queue does not turn this dense representation into a sparse adjacency-list implementation.",
		input: "prim.in",
		output: "prim.out",
		demonstration: false
	},
	{
		folder: "UG19-Disjoint-Sets-and-Kruskals",
		itemIds: [
			"usaco-gold-unit-3-msts-dsu-and-connectivity-proofs-supplemental-problem-disjoint-sets-and-kruskal-s"
		],
		title: "Disjoint sets and Kruskal cycle decisions",
		purpose:
			"A dedicated DSU exercise following the core MST checkpoint. Find/union component invariants justify why a candidate edge creates a cycle. Compare Kruskal sorting with the existing Prim cut frontier; path compression is an optional extension, not a prerequisite of the reference.",
		contract:
			"Read `kruskal.in`: `N M`, then M undirected `P Q W` edges, with zero-based vertices. Teaching bounds are 1 <= N <= 200000, 0 <= M <= 200000, and 0 <= W <= 1000000000. Require a connected graph; one vertex with no edges is valid. Parallel edges and self-loops are permitted. Write `kruskal.out` as N-1 selected endpoint pairs, one per line, with no total line. Any minimum tree and tie order are valid. Accumulate edge weights in long when checking its cost. The reference assumes valid tokens/bounds and refuses disconnection before opening output. Its trace is opt-in with `java -Dcourse.trace=true Main`.",
		prediction:
			"The supplied six-vertex graph has optimum 33. One valid reference output selects edges 2-5 (2), 3-4 (6), 0-1 (7), 0-2 (9), and 4-5 (9). Follow the component count 6,5,4,3,2,1. Size is meaningful only at a representative root; values stored at former roots can be stale.",
		tasks: "1. Follow parent links to a component representative.\n2. Join different roots by size, updating the winning size and count once.\n3. Sort a copy of the edge list and initialize singleton components.\n4. Accept only edges between different components, ending with N-1 edges or refusing disconnection.\n\nThe distinct learner has four marked tasks. Untouched tasks exit 2 without producing an answer. The supplied driver validates parameters and feasible result structure; it does not prove algorithm optimality.\n\nFor independent work or an instructor walkthrough: predict the sample, state the invariant, trace one transition, save the attempt, and compare an independently checked changed case before opening the separate reference. Return to the same attempt for reflection; use changed small datasets for transfer practice.",
		checks: "Check repeated union, union within one component, ties, zero weights, parallel edges, self-loops, one vertex and disconnection. Independently enumerate tiny spanning trees and compare the minimum selected weight; do not require one fixed optimal edge ordering. Check that every selected edge came from input and that the result connects all vertices. Preserve an earlier answer when a task is unfinished or input is refused. Use the optional trace only for small graphs.\n\nUnion by size without path compression bounds parent depth by O(log N). Sorting and DSU work take O(M log M + M log N) time and O(N+M) space. The supplied output validator also uses O(N+M) time/space. Explain amortized near-constant operations only after implementing path compression; do not attribute them to the preserved reference.",
		input: "kruskal.in",
		output: "kruskal.out",
		demonstration: false
	}
];

export function goldImplementationLabForItem(itemId: string) {
	return goldImplementationLabs.find(lab => lab.itemIds.includes(itemId));
}

export function goldImplementationLabForFolder(folder: string) {
	return goldImplementationLabs.find(lab => lab.folder === folder);
}

export function implementationLabNativeInstructions(
	lab: (typeof goldImplementationLabs)[number]
) {
	return [
		"Save the attempt, download its ZIP and extract it. Use JDK 17 or newer inside the extracted folder. These commands also work in PowerShell:",
		"javac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java",
		"java -ea -Xmx256m Main",
		"The site's Java teaching preview does not execute this native Java exercise. Choosing Run displays these instructions; the Input panel does not run the program.",
		lab.demonstration
			? "This demonstration reads no input file or standard input and creates no answer file. Edit the constants in Main.java and compare the three terminal output lines. Check the exit status; an untouched learner exits 2 without an answer."
			: `Keep the included ${lab.input} beside Main.java. An untouched learner exits 2 and creates no answer file. Check the exit status first; read ${lab.output} only after success, using cat ${lab.output} or Get-Content ${lab.output}. Missing input, refused input and unfinished work preserve an earlier answer. The reference assumes valid contract input.`,
		lab.purpose,
		lab.contract,
		lab.prediction,
		lab.tasks,
		lab.checks,
		"Preserve the learner attempt before opening the separately saved reference. Protected mocks and active contests start from empty files."
	];
}

export function implementationLabCourseBrief(
	lab: (typeof goldImplementationLabs)[number],
	retry: boolean
) {
	const sequence = retry
		? "This optional practice is a changed-case retry after completing the first implementation. Preserve that attempt, wait at least two days, close the reference, and reconstruct the four tasks using new cases. Keep a separate saved retry and explain a mismatch against an independent model. Repeating identical sample work does not complete this challenge."
		: "This optional practice is a first implementation after the matching unit. Predict the result and one state transition before coding. Independently or with an instructor, compare predictions at each task, preserve the first attempt, and verify two changed cases before reference comparison.";
	const variation = lab.demonstration
		? "For the retry, memoize the recursive (last-item, capacity) states, preserving the zero-weight and one-use rules. Compare call counts and answers against subset enumeration; state how memoization changes time and storage. The included reference remains the unmemoized comparison."
		: lab.folder === "UG14-MST-II"
			? "For the retry, reconstruct the queue version on a tied graph and a graph with a late heavier parallel edge, then compare it with the existing core dense-scan Prim implementation. Count attached vertices, queue removals and matrix-row scans on a chain and a dense graph. Preserve the same minimum-total contract; this does not ask for a second-best MST."
			: "Compare Kruskal's component decisions with Prim's cut frontier. After union-by-size works, optionally add path compression and explain which size entries remain meaningful. Use the original supplied Edge objects from graph.edges when returning a tree; the driver validates membership in that input list.";
	const directions = implementationLabNativeInstructions(lab);
	return [
		`## ${lab.title}`,
		`**Learning sequence:** ${sequence}`,
		lab.purpose,
		"## Contract and reasoning",
		lab.contract,
		lab.prediction,
		"## Guided implementation",
		lab.tasks,
		variation,
		"## Check and explain",
		lab.checks,
		"## Open, save and run",
		directions[0],
		`\`\`\`sh\n${directions.slice(1, 3).join("\n")}\n\`\`\``,
		...directions.slice(3, 5),
		"Choose Open in site IDE and confirm the import before any source is fetched. Existing saved attempts reopen with their edits preserved; save and export a copy before reference comparison. The learner and reference have separate saved identities. Protected mocks and active contests start from empty files.",
		"Preserve the attempt before the separate reference; the supplied feasible-result driver does not grade algorithm optimality."
	].join("\n\n");
}
