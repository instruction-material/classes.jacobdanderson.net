// These saved identities belong to the verified native Gold lessons.
// Other Java and Karel lessons retain their existing teaching previews.
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
const fenwickItems = new Set([
	"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure-curriculum-core-project-fenwick-trees-ordering-and-range-structure",
	"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure-supplemental-problem-binary-indexed-tree-fenwick-tree"
]);

export function javaNativeBuildInstructions(courseProjectKey?: string) {
	const [course, item, role, extra] = (courseProjectKey ?? "").split(":");
	if (
		course !== "usaco-gold" ||
		(!dijkstraItems.has(item ?? "") &&
			!mstItems.has(item ?? "") &&
			!fenwickItems.has(item ?? "") &&
			!setupItems.has(item ?? "") &&
			!mootubeItems.has(item ?? "")) ||
		!["starter", "reference"].includes(role ?? "") ||
		extra !== undefined
	) {
		return null;
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
