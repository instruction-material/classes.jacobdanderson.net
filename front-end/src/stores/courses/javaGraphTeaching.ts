import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaGraphModuleID,
	javaGraphProjects,
	javaGraphURL
} from "@/modules/javaSearchResources";

const workflow = `Open the starter in the site IDE and confirm the import. Save the attempt before downloading the ZIP. The IDE's **Run** panel shows these Java 21 commands. Run them in the extracted project folder.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The untouched starter compiles. The checker identifies an unfinished method until the implementation is ready.`;

function reading(
	title: string,
	content: string,
	identity?: Pick<RawCourseModuleItem, "id" | "aliases">
): RawCourseModuleItem {
	return {
		...identity,
		title,
		content,
		contentKind: "reading",
		preserveInstructions: true,
		preserveAssignment: true
	};
}

function assignment(
	title: string,
	pack: Parameters<typeof javaGraphURL>[0],
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaGraphURL(pack, "starter"),
		solutionLink: javaGraphURL(pack, "solution")
	};
}

export function buildJavaGraphModule(): RawCourseModule {
	const [graph, routes, mail, traversal, degrees] = javaGraphProjects;
	return {
		id: javaGraphModuleID,
		title: "AJ16 Graphs",
		curriculum: [
			reading(
				"Graphs",
				`A graph represents relationships using vertices and edges. A vertex can represent a place, and an edge can represent a connection between places. An isolated vertex has no incident edges. A path follows edges between successive vertices. A cycle returns to its starting vertex without repeating the intermediate vertices.

A directed edge from A to B makes B an outgoing neighbor of A. B can return to A only if another directed edge provides that connection. An undirected edge gives a connection in both directions. A weighted edge has a numeric cost. The weight might represent time or distance, depending on the model.

A tree is a connected undirected graph with no cycles. The edges A–B and B–C form a three-vertex tree. Adding C–A adds a cycle. Adding a separate vertex D makes the graph disconnected. Draw both directed and undirected versions of these connections and trace which vertices can be reached from B.`,
				{
					id: `${javaGraphModuleID}-curriculum-graphs-core-concepts`,
					aliases: [
						"core-concepts",
						`${javaGraphModuleID}-curriculum-core-concepts`,
						`${javaGraphModuleID}-curriculum-core-concepts-and-learning-sequence`
					]
				}
			),
			reading(
				"Representing a Graph",
				`An adjacency list stores each vertex alongside its outgoing neighbors. For A → B and B → C, write A: [B], B: [C], C: []. An isolated D gets its own empty row. With a set for each row, adding A → B twice leaves one edge. A self-edge A → A occupies one set entry and contributes once to both incoming and outgoing degree.

An adjacency matrix stores a cell per ordered pair. For a fixed order [A, B, C], a directed edge A → B appears in row A and column B. Its reverse occupies a different cell. A weighted matrix needs a value for no edge. In this project that value is −1, which leaves 0 available as a valid edge weight.

For V vertices and E edges, adjacency lists take O(V + E) storage. A dense graph has enough edges that a V-by-V matrix can be practical, and the matrix checks a known ordered pair in O(1) time. Listing all neighbors of one matrix row scans V cells. An edge list stores pairs or weighted triples and is useful for importing data. An incidence list instead records all edges that touch a vertex, including incoming edges. For a graph with 1,000 vertices but only 1,800 edges, compare the number of adjacency entries with the number of matrix cells.`
			),
			assignment(
				"AJ16 Project 1: Basic Graph Implementation",
				graph.pack,
				`Complete addVertex, addEdge and neighbors. Preserve isolated vertices and register both endpoints of an added edge. Store and count each directed edge once. Reject a null endpoint before changing the graph. Return outgoing neighbors in insertion order as a read-only snapshot. An absent vertex returns an empty list.

${workflow}

**Checkpoints** The sample gives [Library, Museum] for Park, an empty list for Pier, and 3 edges. Add a repeated Park → Museum edge and check that the count stays unchanged. Store A → A once, then check that an earlier snapshot stays unchanged after adding another neighbor.`
			),
			reading(
				"Dijkstra's Shortest Path Algorithm",
				`Dijkstra finds minimum-cost paths when all real edge weights are nonnegative. Give the source a cost of zero and all other vertices an unknown cost. The priority queue holds snapshots of candidate vertices and costs. Remove the cheapest snapshot, and for each outgoing edge compare the known destination cost with the current cost plus the edge weight. A strict improvement updates the cost and records the predecessor.

Consider 0 → 1 with weight 7, 0 → 2 with weight 2, 2 → 1 with weight 1, 1 → 3 with weight 2, and 2 → 3 with weight 8. Processing 0 first creates candidates 2 at cost 2 and 1 at cost 7. Processing 2 improves 1 to cost 3 and discovers 3 at cost 10. Processing 1 improves 3 to cost 5. The current cheapest entry for 3 proves that the route 0, 2, 1, 3 has minimum cost 5. Any older snapshot of 1 or 3 is stale because its cost differs from the current recorded cost.

Use long instead of int for totals. Two edges of weight Integer.MAX_VALUE sum to 4,294,967,294. A zero-weight edge can improve a route and still counts as an edge. Follow predecessors from the target, then reverse that sequence to return the path from the source. A destination with no path has no cost or predecessor chain.`
			),
			assignment(
				"AJ16 Project 2: Dijkstra's Shortest Path",
				routes.pack,
				`Implement shortest for a square directed matrix. Use −1 only for absence, accept zero and positive weights, and reject weights below −1 and invalid endpoint indices. Use immutable priority queue entries and break cost ties by smaller vertex index. Discard entries with old costs and update predecessors only on a strict improvement. Return Optional.empty() when the destination is unreachable. For a reachable destination, return its long cost and the ordered source-to-target vertices.

${workflow}

**Checkpoints** The sample returns cost 5 and route [0, 2, 1, 3]. Vertex 4 is unreachable. Verify total cost by summing the matrix entries for each consecutive pair in the path. Check a source-to-itself route, a zero-cost alternative, a stale candidate, a disconnected target, and two edges with maximum int weights.`
			),
			reading(
				"Graph and Dijkstra Completion Contract",
				`State how the model handles direction, repeated edges, self-edges and vertices without neighbors. Trace one cyclic graph and one disconnected graph. Compare vertex and edge counts against a hand-drawn example.

Confirm that the implementation rejects negative weights other than the absent-edge sentinel, skips stale queue entries and produces an explicit unreachable result. Verify the source and destination of each returned path. Check that every edge exists and that the sum of its weights equals the reported cost. Compare equal-cost alternatives and use the stated tie rule for deterministic output. A path that has the right endpoints can still be wrong if a cheaper valid path exists.`
			)
		],
		supplementalProjects: [
			assignment(
				"AJ16 Supplemental Project 1: Eulerian Mail Circuit",
				mail.pack,
				`Classify the undirected street graph by whether it has a circuit, an open trail or neither. Either successful route uses each street exactly once. A circuit returns to its starting vertex. A loop adds two to its vertex degree and parallel streets count separately. Ignore isolated vertices when checking that all streets belong to one connected component. Within that component, zero odd degrees gives a circuit, two gives an open trail and more than two gives neither.

${workflow}

**Checkpoints** A triangle with an isolated vertex gives CIRCUIT. A two-edge chain gives TRAIL. Two disjoint edges give NEITHER. Draw a loop, then a pair of parallel edges, and count their degree contributions. With declared vertices but no streets, a zero-length circuit can stay at one vertex. A graph with no vertices has no start.`
			),
			assignment(
				"Graph Traversal Transfer Practice",
				traversal.pack,
				`Visit reachable vertices in breadth-first order. Process a queue from its front and append unseen outgoing neighbors in the supplied order. Mark a vertex when it enters the queue, so multiple incoming edges cannot enqueue it twice. A missing start returns an empty list. A reached vertex without its own row has no outgoing neighbors.

${workflow}

**Checkpoints** Starting at A in the sample gives [A, B, C, D]. Draw the queue and visited set after processing A and B. Add C → A and check that the cycle does not repeat A. Use two edges into D and verify it appears once.`
			),
			assignment(
				"Graph Modeling Extension Practice",
				degrees.pack,
				`Count incoming and outgoing arcs for each label. Register declared vertices even when their counts are zero. Include both endpoints inferred from the data and count each ordered pair once. A self-loop contributes once to each count for its vertex. Return the degree map sorted by label.

${workflow}

**Checkpoints** With A → B repeated, B → A and B → B, A has degree counts 1 incoming and 1 outgoing. B has 2 incoming and 2 outgoing. C and D are isolated. Add an undeclared endpoint, then reverse one arc and check which counts change.`
			)
		]
	};
}
