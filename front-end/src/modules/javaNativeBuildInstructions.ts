import {
	goldHistoricalAssignment,
	historicalNativeInstructions
} from "./usacoHistoricalPacks";
// These saved identities belong to the verified native Gold lessons.
// Other Java and Karel lessons retain their existing teaching previews.
import {
	goldImplementationLabForItem,
	implementationLabNativeInstructions
} from "./usacoImplementationLabs";
import {
	matrixDijkstraSavedItemId,
	milkVisitsSavedItemId,
	roadblockSavedItemId,
	shortcutSavedItemId,
	timeMooneySavedItemId
} from "./usacoProjectResources";

import {
	goldSpanningIntervalPack,
	spanningIntervalNativeInstructions
} from "./usacoSpanningIntervalPacks";

const setupItems = new Set([
	"usaco-gold-usg0-setup-contest-contract-and-gold-mindset-curriculum-core-project-native-input-output-checkpoint",
	"usaco-gold-usg0-setup-contest-contract-and-gold-mindset-supplemental-native-input-output-retry"
]);
const dijkstraItems = new Set([
	"usaco-gold-unit-2-shortest-paths-dags-and-weighted-graphs-curriculum-core-project-shortest-paths-and-weighted-graphs",
	"usaco-gold-unit-2-shortest-paths-dags-and-weighted-graphs-supplemental-problem-dijkstra-s-algorithm"
]);
const mstItems = new Set([
	"usaco-gold-unit-3-msts-dsu-and-connectivity-proofs-curriculum-core-project-msts-dsu-and-connectivity-optimization",
	"usaco-gold-unit-3-msts-dsu-and-connectivity-proofs-supplemental-problem-mst"
]);
const mootubeItems = new Set([
	"usaco-gold-usg0-setup-contest-contract-and-gold-mindset-curriculum-core-project-setup-and-gold-mindset",
	"usaco-gold-usg0-setup-contest-contract-and-gold-mindset-supplemental-gold-log-setup-and-gold-mindset"
]);
const orderingItems = new Map([
	[
		"usaco-gold-usg0-setup-contest-contract-and-gold-mindset-supplemental-why-did-the-cow-cross-the-road-iii",
		{
			title: "CircleCross",
			input: "circlecross.in",
			output: "circlecross.out",
			tasks: "five interval and Fenwick tasks",
			diagnostic: false
		}
	],
	[
		"usaco-gold-usg0-setup-contest-contract-and-gold-mindset-supplemental-snow-boots",
		{
			title: "Snow Boots",
			input: "snowboots.in",
			output: "snowboots.out",
			tasks: "six sorting, neighbor-link and maximum-gap tasks",
			diagnostic: true
		}
	]
]);
const fenwickPracticeItems = new Map([
	[
		"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure-supplemental-problem-balanced-photo",
		{
			title: "Balanced Photo",
			input: "bphoto.in",
			output: "bphoto.out",
			meaning:
				"Count a cow only when the larger taller-side count is strictly greater than twice the smaller count. Query before marking its position; heights are distinct."
		}
	],
	[
		"usaco-gold-optional-gold-problem-bank-supplemental-problem-sleepy-cow-sorting",
		{
			title: "Sleepy Cow Sorting",
			input: "sleepy.in",
			output: "sleepy.out",
			meaning:
				"Only the first cow moves. Write the minimum count and any optimal legal move sequence; simulate every move and check the sorted final row. A sorted row needs zero moves."
		}
	],
	[
		"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure-supplemental-problem-out-of-sorts",
		{
			title: "Out of Sorts, Gold bidirectional sweeps",
			input: "sort.in",
			output: "sort.out",
			meaning:
				"Each Gold iteration makes a forward sweep, a backward sweep, then the adjacency check. Count stable-order cut deficits with a minimum of one iteration; duplicates are allowed."
		}
	]
]);
const fenwickItems = new Set([
	"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure-curriculum-core-project-fenwick-trees-ordering-and-range-structure",
	"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure-supplemental-problem-binary-indexed-tree-fenwick-tree"
]);
const knapsackItem =
	"usaco-gold-unit-1-dynamic-programming-knapsack-and-state-design-supplemental-problem-0-1-knapsack";
const fruitFeastItem =
	"usaco-gold-unit-1-dynamic-programming-knapsack-and-state-design-supplemental-problem-fruit-feast";

export function javaNativeBuildInstructions(courseProjectKey?: string) {
	const parts = (courseProjectKey ?? "").split(":");
	const [course, item, role, extra] = parts;
	const spanning = goldSpanningIntervalPack(item ?? "");
	if (
		course === "usaco-gold" &&
		spanning &&
		["starter", "reference"].includes(role ?? "") &&
		(parts.length === 3 || (parts.length === 4 && extra === "native-java"))
	) {
		return spanningIntervalNativeInstructions(spanning);
	}
	const historical = goldHistoricalAssignment(item ?? "");
	if (
		course === "usaco-gold" &&
		historical &&
		["starter", "reference"].includes(role ?? "") &&
		(parts.length === 3 || (parts.length === 4 && extra === "native-java"))
	) {
		return historicalNativeInstructions(historical);
	}
	const implementationLab = goldImplementationLabForItem(item ?? "");
	if (
		course !== "usaco-gold" ||
		(!implementationLab &&
			!dijkstraItems.has(item ?? "") &&
			!mstItems.has(item ?? "") &&
			!fenwickItems.has(item ?? "") &&
			!setupItems.has(item ?? "") &&
			!mootubeItems.has(item ?? "") &&
			!orderingItems.has(item ?? "") &&
			!fenwickPracticeItems.has(item ?? "") &&
			item !== shortcutSavedItemId &&
			item !== roadblockSavedItemId &&
			item !== matrixDijkstraSavedItemId &&
			item !== milkVisitsSavedItemId &&
			item !== timeMooneySavedItemId &&
			item !== knapsackItem &&
			item !== fruitFeastItem) ||
		!["starter", "reference"].includes(role ?? "") ||
		extra !== undefined
	) {
		return null;
	}
	if (implementationLab)
		return implementationLabNativeInstructions(implementationLab);
	if (item === milkVisitsSavedItemId || item === timeMooneySavedItemId) {
		const milk = item === milkVisitsSavedItemId;
		const input = milk ? "milkvisits.in" : "time.in";
		const output = milk ? "milkvisits.out" : "time.out";
		return [
			`Save and download this project's ZIP, then extract it. Keep the included ${input} beside Main.java.`,
			`This optional ${milk ? "tree-path application" : "bounded-time graph DP practice"} requires a native JDK 17 or newer. The site's Java teaching preview does not execute its file I/O or ${milk ? "tree-path algorithm" : "graph DP algorithm"}.`,
			"Preserve earlier source, inputs and answers. Run inside the extracted folder:",
			"javac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java",
			"java -ea -Xmx256m Main",
			`Check exit status first; read ${output} only after success. The browser Input panel does not replace ${input}. These commands also work in PowerShell.`,
			milk
				? "The Gold Milk Visits contract allows 100000 farms and queries, with types 1..N. Write one bit per inclusive tree path, in query order, without spaces. The official sample answers are 10110 and 0110. Complete the four marked learner tasks: iterative ancestor intervals, endpoint queries and active type stacks, inclusive path decisions, and exit cleanup. Keep the JVM's default stack; use explicit traversal frames on a deep chain."
				: "Each directed road takes one day and earns its destination's reward, including repeated visits. Finish at city 1 and subtract C*T*T once for the whole trip; no trip earns 0. The sample answer is 24. Complete the four marked learner tasks: prove a useful time bound, initialize reachable day/city states, transition from the previous day, and maximize net profit only on returns to city 1. Rewards at most 1000 and C>=1 bound useful time by 1000 days.",
			"An untouched learner exits with status 2 and creates no answer file. Missing input, refused input and unfinished work preserve an earlier answer. The supplied driver checks contract and result structure; it does not grade a completed algorithm. The historical reference expects valid contract input.",
			milk
				? "Compare tiny trees with an independent BFS path checker, including identical endpoints, a matching ancestor, an absent type and sibling branches. At full scale, compare a 100000-farm unique-type chain with interval membership. Expected time and memory are O(N+M)."
				: "Compare tiny cases with independently enumerated bounded walks, including no return route, zero rewards, high cost and repeated cycles. A layered algorithm uses O(H*(N+M)) time and O(N+M) memory for H<=1000; storing all layers uses O(H*N+M) memory. The historical reference adds priority-queue overhead.",
			"Preserve the first attempt, a state trace and two changed cases before opening the separately saved reference. Protected mocks and active contests begin from empty files without these practice packs."
		];
	}

	if (item === shortcutSavedItemId) {
		return [
			"Save and download this project's ZIP, then extract it. Keep Main.java and the included shortcut.in in the same folder.",
			"Shortcut is optional traffic practice after weighted shortest paths and tree rooting. Use a native JDK 17 or newer. The site's Java teaching preview does not execute its file I/O or tree-traffic algorithm.",
			"Preserve earlier source, inputs and answers. Run inside the extracted folder:",
			"javac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java",
			"java -ea -Xmx256m Main",
			"The commands also work in PowerShell. Check exit status first, then read shortcut.out with cat shortcut.out or Get-Content shortcut.out. The browser Input panel does not replace shortcut.in.",
			"The January 2019 Gold contract reads N M T, N cow counts, then M undirected a b time trails: N in 1..10000, M in N-1..50000, T in 1..10000, cows in 0..10000, endpoints in 1..N and positive times in 1..25000. All fields reach barn 1; parallel trails and positive loops are allowed, and N=1, M=0 is valid. Write one maximum reduction in total travel time.",
			"Keep usual shortest routes fixed. Compare tied field-label sequences toward the barn. Only cows whose usual route encounters the candidate may use its trail. Gain is traffic[v] * max(0, distance[v] - T), using long before multiplication. On the sample, field 4 uses 4,2,1; field 5 uses 5,3,1. A shortcut at 5 saves 40, reducing total travel from 101 to 61; field 4's cows do not detour toward it.",
			"Complete the four marked learner tasks with the supplied shortestRoutes helper: build child lists and explain ties, accumulate long traffic in an iterative postorder, compare fixed-route savings, then return and explain the greatest nonnegative gain. A 10000-field chain must not depend on recursive call-stack depth.",
			"An untouched learner exits with status 2 and creates no answer file. Missing input, refused input and unfinished work preserve an earlier answer. The numeric range guard does not grade algorithm correctness. The reference expects valid contract input; its included shortcut.out is an expected sample answer, not proof of a new run.",
			"For tiny graphs, enumerate simple routes and select the least (time, toward-barn field sequence); independently simulate shortcut encounters without rerouting. Check ties, zero cows, slow shortcuts, changed cow counts, reversed trails, parallel trails and loops. The supplied helper costs O((N+M) log(M+1)); iterative tree aggregation adds O(N). The preserved reference instead traces each origin's route, which can cost O(N²), with separate queue overhead.",
			"Save a learner attempt, route/traffic trace and two changed cases before comparing the separately saved reference. Reconstruct the reasoning on a fresh case later. Protected mocks and active contests start from empty files."
		];
	}
	if (item === roadblockSavedItemId) {
		return [
			"Save and download this project's ZIP, then extract it. Keep Main.java and the included rblock.in in the same folder.",
			"Roadblock is optional shortest-path sensitivity practice after the core weighted-graph lesson. Its origin is February 2014 Silver. Use a native JDK 17 or newer. The site's Java teaching preview does not execute its file I/O or sensitivity algorithm.",
			"Preserve earlier source, inputs and answers. Run inside the extracted folder:",
			"javac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java",
			"java -ea -Xmx256m Main",
			"These commands also work in PowerShell. Check exit status first; read rblock.out only after success. The browser Input panel does not replace rblock.in.",
			"Read N M and M undirected A B length records: 1..250 fields, 1..25000 roads, endpoints in 1..N, lengths in 1..1000000, unique undirected pairs and a connected network. Travel from 1 to N. Double exactly one road and maximize the increase over the unchanged optimum, not the new total distance. The sample baseline is 6; the changed optimum is 8, so the answer is 2.",
			"Complete the four marked learner tasks with the supplied dense shortest-path helper: preserve one baseline predecessor path, prove its roads suffice including tied optima, compute single-road increases against the same baseline, and restore both matrix directions even after a failed trial. A positive loop cannot improve a route; coincident endpoints use an empty route.",
			"An untouched learner exits with status 2 and creates no answer file. Missing input, refused input and unfinished work preserve an earlier answer. Numeric range guards do not grade algorithm correctness. The historical reference expects valid contract input.",
			"Use a tiny independent all-road perturbation oracle with Floyd-Warshall or repeated edge relaxation. Include ties, a bridge, a replacement route and successive trials. The supplied dense helper uses O(N²) time per call; at most N calls give O(N³) total time and O(N²) storage. The preserved reference has different queue and stale-entry overhead.",
			"Save the first attempt, a trial-state table and two changed cases before opening the separately saved reference. Reconstruct the reasoning on a fresh graph later. Protected mocks and active contests start from empty files."
		];
	}
	if (item === matrixDijkstraSavedItemId) {
		return [
			"Save and download this project's ZIP, then extract it. Keep the included dijkstra.in beside Main.java.",
			"This optional matrix-representation comparison requires a native JDK 17 or newer; source acceptance uses JDK 17 and 21. The site's Java teaching preview does not execute its file I/O or shortest-path algorithm.",
			"Preserve earlier inputs and answers. Run inside the extracted folder:",
			"javac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java",
			"java -ea -Xmx256m Main",
			"Check exit status and read dijkstra.out only after success. The browser Input panel does not replace dijkstra.in. The included sample's destination distances are 7, 9, 20, 20 and 11.",
			"Complete the four marked matrix Dijkstra tasks: initialize long distances and predecessors, seed the queue, skip stale states and relax existing edges on strict improvement. Zero weight is an edge; only -1 means absent. Minimum parallel weights are retained. Any tied minimum-cost path is valid; unreachable vertices have explicit Unreachable lines.",
			"An untouched learner exits with status 2 and creates no answer file. Missing input, refused input and unfinished work preserve an earlier answer. Its path validator checks consistency; an independent Bellman-Ford model checks minimum distances. The historical reference expects valid contract input.",
			"Compare matrix row scans and storage with the core adjacency-list lesson on a chain, star and dense graph. Preserve the learner attempt before consulting the separately saved reference. Include parallel records in both orders, a zero-weight cycle, an isolated vertex and totals beyond int range."
		];
	}
	if (item === knapsackItem) {
		return [
			"Save and download this project's ZIP, then extract it.",
			"This Knapsack demonstration requires a native JDK 17 or newer. The site's Java teaching preview does not execute its dynamic programming or traceback.",
			"Run inside the extracted folder:",
			"javac -encoding UTF-8 Main.java",
			"java Main",
			"This demonstration reads no input file or standard input and creates no answer file. Edit weights, values and capacity in Main.java for changed cases. The reference also has numItems, which must match the arrays; the learner derives that count.",
			"The default optimum is 9 with distinct indices 1 and 2 in either order. Check feasibility and optimality, not one fixed index ordering. A single weight-2, value-3 item at capacity 4 can be selected only once.",
			"Complete the five marked learner tasks: table bases, the preceding-row skip/take recurrence, traceback selection, moving past every considered item and the final result. The untouched starter exits with status 2 and prints no answer. Check the native exit status.",
			"Preserve the attempt before the separately saved reference. Compare tiny datasets with subset enumeration and estimate O(n*W) time and table storage before increasing the constants. The browser Input panel has no data contract for this demonstration."
		];
	}
	if (item === fruitFeastItem) {
		return [
			"Save and download this project's ZIP, then extract it.",
			"This Fruit Feast project requires a native JDK 17 or newer. The site's Java teaching preview does not execute its file I/O or dynamic programming.",
			"Preserve earlier inputs and answers, then create feast.in from sample.in and run inside the extracted folder:",
			"cp sample.in feast.in",
			"In PowerShell, use Copy-Item sample.in feast.in.",
			"javac -encoding UTF-8 Main.java",
			"java Main",
			"Read feast.out only after a successful run. The browser Input panel does not replace feast.in. The sample 8 5 6 reaches 8 by eating 6, drinking to 3 and eating 5.",
			"Complete the five marked learner tasks: before-water states, eating transitions, floor-halving seeds, after-water eating and the maximum across both phases. Water is optional and may be used at most once. An untouched run exits with status 2 and creates no answer file; missing input, refused input and unfinished work preserve an earlier answer.",
			"The reference assumes valid contest input. Its normal run prints no diagnostics; java Main --trace is an optional small-case reference walkthrough. The learner accepts no arguments. Predict changed cases and compare tiny cases with an independent search of (fullness, waterUsed) states before revisiting the separate reference."
		];
	}
	if (setupItems.has(item!)) {
		return [
			"Save and download this project's ZIP, then extract it.",
			"This Gold setup project requires a native JDK 17 or newer. The site's Java teaching preview does not execute this native input/output checkpoint.",
			"Keep sample.in beside Main.java and run inside the extracted folder:",
			"javac -encoding UTF-8 Main.java",
			"java Main < sample.in",
			"In PowerShell, use Get-Content sample.in | java Main for this numeric input.",
			"Read the sum in the native terminal. This program reads standard input and prints standard output; it creates no answer file. The site's Input panel does not run this native project.",
			"Complete calculateTotal using a long accumulator. The untouched starter reports unfinished work; refused input exits with status 2. Both print no answer. Check exit status before accepting a result.",
			"Change sample.in and predict the new sum before rerunning. Check N=0, negative values, cancellation, a sum beyond int range and missing or extra tokens. Preserve the first attempt before the optional changed-case retry."
		];
	}
	const practice = fenwickPracticeItems.get(item!);
	if (practice) {
		return [
			"Save and download this project's ZIP, then extract it.",
			`This ${practice.title} project requires a native JDK 17 or newer. The site's Java teaching preview does not execute its file I/O or ordering algorithm.`,
			`Create ${practice.input} from sample.in and run inside the extracted folder:`,
			`cp sample.in ${practice.input}`,
			`In PowerShell, use Copy-Item sample.in ${practice.input}.`,
			"javac -encoding UTF-8 Main.java",
			"java Main",
			`Read ${practice.output} only after a successful run. The browser Input panel does not replace the native file.`,
			"Complete the five marked learner tasks. Every valid untouched run exits with status 2 and creates no answer file, including the smallest or already sorted case. Missing input, malformed input or unfinished work preserves earlier output; check exit status. The preserved reference assumes valid contest input.",
			practice.meaning,
			"Preserve the attempt, predict changed cases and explain mismatches before revisiting the separately saved reference."
		];
	}
	const ordering = orderingItems.get(item!);
	if (ordering) {
		return [
			"Save and download this project's ZIP, then extract it.",
			`This ${ordering.title} project requires a native JDK 17 or newer. The site's Java teaching preview does not execute its file I/O or ordering algorithm.`,
			`Create ${ordering.input} from sample.in and run inside the extracted folder:`,
			`cp sample.in ${ordering.input}`,
			`In PowerShell, use Copy-Item sample.in ${ordering.input}.`,
			"javac -encoding UTF-8 Main.java",
			"java Main",
			`Read ${ordering.output} only after a successful run. The browser Input panel does not replace the native file.`,
			`The learner has ${ordering.tasks}. An untouched learner exits with status 2 and creates no answer file. Malformed input or unfinished work preserves earlier output; check exit status. The preserved reference assumes valid contest input.`,
			ordering.diagnostic
				? "Snow Boots writes one 0/1 answer per boot in original input order. Its historical reference prints gap diagnostics in the terminal; those lines are not answers."
				: "CircleCross writes one unordered crossing-pair count. Predict strict endpoint alternation and compare tiny cases with direct pair counting.",
			"Preserve the attempt, change cases and explain the new predictions before revisiting the separately saved reference."
		];
	}
	if (mootubeItems.has(item!)) {
		return [
			"Save and download this project's ZIP, then extract it.",
			"This MooTube project requires a native JDK 17 or newer. The site's Java teaching preview does not execute its file I/O or offline connectivity algorithm.",
			"Create mootube.in from sample.in and run inside the extracted folder:",
			"cp sample.in mootube.in",
			"In PowerShell, use Copy-Item sample.in mootube.in.",
			"javac -encoding UTF-8 Main.java",
			"java Main",
			"Read mootube.out after a successful run. The browser Input panel does not replace the native file.",
			"Complete the six DSU and ordered-sweep tasks. An untouched learner exits with status 2 and creates no answer file. Input or task failure preserves an earlier answer; check exit status before accepting a result. The historical reference assumes valid contest input.",
			"Change edge weights, thresholds and query order; predict filtered component sizes minus one. Preserve the first practice attempt before the separate changed-case retry."
		];
	}
	if (fenwickItems.has(item!)) {
		return [
			"Save and download this project's ZIP, then extract it.",
			"This Fenwick tree project requires a native JDK 17 or newer. The site's Java teaching preview does not execute its input-driven data structure.",
			"Keep sample.in beside Main.java and run these commands inside the extracted folder:",
			"javac -encoding UTF-8 Main.java",
			"java Main < sample.in",
			"Read the answers in the native terminal. This program reads standard input and prints standard output; it creates no answer file. The site's Input panel does not run this native project.",
			"The untouched starter reports unfinished work and prints no answer. Refused input exits with status 2 and prints no answer. Check the exit status before accepting a new result.",
			"Change sample.in, predict the updates and inclusive range sums, and rerun. ADD adds a delta; PREFIX -1 is the empty prefix. Use long sums and compare with a plain-array oracle."
		];
	}
	if (mstItems.has(item!)) {
		return [
			"Save and download this project's ZIP, then extract it.",
			"This minimum spanning tree project requires a native JDK 17 or newer. The site's Java teaching preview does not execute its file I/O or matrix algorithm.",
			"Keep prim.in beside Main.java and run these commands inside the extracted folder:",
			"javac -encoding UTF-8 Main.java",
			"java Main",
			"Inspect prim.out after a successful run. Change prim.in, predict the selected tree edges and total weight, and rerun.",
			"The untouched starter reports unfinished work and creates no answer. Refused input preserves an earlier answer; do not treat that old file as a new result.",
			"Use the lesson's contract to check real edges, connectivity, cycles, minimal total cost and long totals. A disconnected graph has no spanning tree."
		];
	}
	return [
		"Save and download this project's ZIP, then extract it.",
		"This Dijkstra project requires a native JDK 17 or newer. The site's Java teaching preview does not execute its file I/O or priority queue.",
		"Keep dijkstra.in beside Main.java and run these commands inside the extracted folder:",
		"javac -encoding UTF-8 Main.java",
		"java Main",
		"Inspect dijkstra.out after a successful run. Change dijkstra.in, predict the new paths, and rerun.",
		"The untouched starter reports unfinished work and creates no answer. Refused input preserves an earlier answer file; do not treat that old file as a new result.",
		"Use the lesson's contract and checks to explain paths, unreachable vertices and long distances."
	];
}
