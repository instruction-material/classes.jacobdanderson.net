// These saved identities belong to the verified file-based Gold lessons.
// Other Java and Karel lessons retain their existing teaching previews.
const dijkstraItems = new Set([
	"usaco-gold-unit-2-shortest-paths-dags-and-weighted-graphs-curriculum-core-project-shortest-paths-and-weighted-graphs",
	"usaco-gold-unit-2-shortest-paths-dags-and-weighted-graphs-supplemental-problem-dijkstra-s-algorithm"
]);
const mstItems = new Set([
	"usaco-gold-unit-3-msts-dsu-and-connectivity-proofs-curriculum-core-project-msts-dsu-and-connectivity-optimization",
	"usaco-gold-unit-3-msts-dsu-and-connectivity-proofs-supplemental-problem-mst"
]);

export function javaNativeBuildInstructions(courseProjectKey?: string) {
	const [course, item, role, extra] = (courseProjectKey ?? "").split(":");
	if (
		course !== "usaco-gold" ||
		(!dijkstraItems.has(item ?? "") && !mstItems.has(item ?? "")) ||
		!["starter", "reference"].includes(role ?? "") ||
		extra !== undefined
	) {
		return null;
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
