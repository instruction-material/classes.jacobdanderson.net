import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaCheckIn4ModuleID,
	javaCheckIn4Projects,
	javaCheckIn4URL
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
	pack: Parameters<typeof javaCheckIn4URL>[0],
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaCheckIn4URL(pack, "starter"),
		solutionLink: javaCheckIn4URL(pack, "solution")
	};
}

export function buildJavaCheckIn4Module(): RawCourseModule {
	const [workbook, practice, resize, routes] = javaCheckIn4Projects;
	return {
		id: javaCheckIn4ModuleID,
		title: "Check-In #4",
		curriculum: [
			assignment(
				"Check-In #4 Overview",
				workbook.pack,
				`Complete the workbook as each reading introduces its data structure. Validate a binary search tree against inherited bounds, trace a hash-table search through deleted slots, and check the cost of a proposed path through a directed graph. Save the workbook for the optional shortest-hops exercise.

${workflow}

**Checkpoints** The supplied tree is valid. Searching for key 1 finds it at slot 3. An insertion search for key 16 returns slot 2 with found=false. The route 0 → 1 → 2 costs 5, and 2 → 0 is absent. Predict each result before running the contract checks.`
			),
			reading(
				"Check-In #4: Binary Search Trees",
				`A binary search tree in this workbook keeps strictly smaller keys in each node's left subtree and strictly larger keys in its right subtree. To check every ancestor, pass an exclusive lower and upper bound. The left subtree inherits the lower bound and takes the current key as its upper bound. The right subtree takes the current key as its lower bound and inherits the upper bound. An empty subtree satisfies its bounds. Start with long limits so both extreme int keys are valid.

Trace a tree with root 12, children 3 and 20, and 7 as the right child of 3. The key 7 must satisfy 3 < 7 < 12. Replacing 7 with 14 violates the upper bound from 12. Insert 10 by following left from 12, right from 3 and right from 7. In the original tree, deleting 12 with its in-order predecessor puts 7 at the root and removes the original 7 from the left subtree. Deleting a one-child node links its parent directly to that child. A leaf can be removed directly.

In-order visits left, node, right and gives [3, 7, 12, 20] for the original tree. Preorder visits node, left, right and gives [12, 3, 7, 20]. Postorder visits left, right, node and gives [7, 3, 20, 12]. Trace the tree after deleting 12 and check that the in-order result remains sorted.`,
				{
					id: `${javaCheckIn4ModuleID}-curriculum-java-level-3-check-in-4-core-concepts`,
					aliases: [
						`${javaCheckIn4ModuleID}-curriculum-core-concepts-and-learning-sequence`,
						"core-concepts",
						"check-in-4-core-concepts",
						`${javaCheckIn4ModuleID}-curriculum-core-concepts`,
						`${javaCheckIn4ModuleID}-curriculum-check-in-4-core-concepts`
					]
				}
			),
			reading(
				"Check-In #4: Hash Tables",
				`The load factor is the number of stored entries divided by the number of slots or buckets. For 695 entries in 1,543 slots it is about 0.450. For 420,000 in 700,001 it is about 0.600. For 98 in 193 it is about 0.508. With a policy that resizes above 0.5, the second and third examples cross the threshold. Recompute the bucket index at the new capacity for every key. In separate chaining, several keys can occupy the same bucket. In open addressing each live entry occupies its own slot.

With linear probing, start at floorMod(key, capacity), advance by one, wrap around and visit at most one full cycle. The workbook has five slots: empty, live 6, deleted 11, live 1, empty. Searching for 1 starts at slot 1, crosses the tombstone at slot 2 and finds the key in slot 3. An insertion search for 16 follows the same probe and reaches the empty slot 4. It can reuse slot 2 after checking for a match. A lookup can stop at the first genuinely empty slot. floorMod also gives a valid nonnegative index for negative integer keys.

Trace a search on a table with no empty slot and explain when it ends. Then trace an insertion when a tombstone appears before an existing copy of the key. State which result shows a match and which slot could be reused when the key is absent.`
			),
			reading(
				"Check-In #4: Graphs",
				`A graph stores vertices and edges. A directed edge has a source and a destination. A weighted edge also has a cost. The workbook adjacency list is 0 → [(1, 2), (2, 8)], 1 → [(2, 3)], and 2 → []. Its adjacency matrix is:

\`\`\`text
-1   2   8
-1  -1   3
-1  -1  -1
\`\`\`

Rows mark sources and columns mark destinations. A weight of -1 marks a missing edge. Zero is a valid cost. The matrix provides direct access to any ordered pair and uses quadratic space in the number of vertices. An adjacency list stores only present edges and is usually smaller for a sparse graph.

Check each vertex in a proposed route, then check and add the cost of each consecutive directed edge. The route 0 → 1 → 2 costs 2 + 3 = 5 and 0 → 2 costs 8. The reverse route 2 → 0 is missing. An empty route gives an empty result and one known vertex costs zero. Accumulate costs in a long.

To find the globally cheapest route with nonnegative weights, start Dijkstra's algorithm at distance zero and take the lowest-cost vertex from a priority queue. Relax each outgoing edge by replacing its destination's best distance only when the new total is smaller. Track predecessors for reconstruction and skip queue entries that are older than the current best distance. Trace the queue after visiting 0: it contains distance 2 for 1 and distance 8 for 2. Visiting 1 improves the distance to 2 to 5. For the fewest edges, use breadth-first search with an ordinary FIFO queue.`
			),
			reading(
				"Check-In #4 Application Check",
				`Explain why a key of 14 under the left subtree of 12 is invalid even when it is correctly placed relative to its immediate parent. Show the inherited bound that catches the error.

Calculate the load factor for four live entries in seven slots. It is about 0.571. If capacity grows to 13, key −1 moves from slot 6 to slot 12 under floorMod. Explain why copying all entries to the same numbered slots can break search.

Compare the direct route 0 → 2, which has one edge and costs 8, with 0 → 1 → 2, which has two edges and costs 5. Name the algorithm you would use to minimize each quantity. Run the workbook checks before starting the tree traversal project.`,
				{
					id: `${javaCheckIn4ModuleID}-curriculum-check-in-4-application-check`,
					aliases: [
						`${javaCheckIn4ModuleID}-curriculum-application-misconceptions-and-readiness-check`,
						"application-check"
					]
				}
			),
			assignment(
				"Check-In #4: Additional Practice Project",
				practice.pack,
				`Implement breadth-first traversal for the supplied tree. When the root exists, enqueue it. Remove the front node, append its key to the result, and enqueue its existing left and right children in that order. Return an empty list for an empty tree. Compare with the provided preorder traversal without modifying the tree.

${workflow}

**Checkpoints** On the sample tree, breadth-first yields [12, 3, 20, 7]. Preorder yields [12, 3, 7, 20]. Test an empty tree, a single node and a tree whose left child is missing. Explain what the queue contains just after processing 3.`
			)
		],
		supplementalProjects: [
			assignment(
				"Check In #4: Extension Challenge",
				workbook.pack,
				`Reopen the saved workbook and implement fewestHops with a FIFO queue. Reuse the matrix validator and count each present edge as one hop. Mark each vertex when enqueueing it so a cycle cannot cause repeated visits. Return zero for a route from a vertex to itself and an empty result for an unreachable destination.

Compile the saved project and run java ContractTests hops and java Main hops. The sample reaches vertex 2 from 0 in one hop. Test an unreachable destination and a directed cycle. Compare the one-hop route with the cost-5 route found in the workbook.`
			),
			assignment(
				"Advanced Structures Checkpoint Transfer Practice",
				resize.pack,
				`Verify a set of proposed buckets after resizing a hash table that uses separate chaining. Every original key must occur once at the bucket returned by floorMod for the new capacity and retain its original value. Reject repeated, missing, changed and misplaced entries. Use an index of original keys to track which entries still need to appear.

${workflow}

**Checkpoints** With three new buckets, keys 2 and −1 both belong in bucket 2. The sample accepts their correct entries and rejects a misplaced one. Test a duplicated key, a changed value and an empty input with a positive capacity.`
			),
			assignment(
				"Advanced Structures Checkpoint Extension Practice",
				routes.pack,
				`Choose the cheapest valid route from the supplied candidates. Look up each consecutive ordered pair in the directed edge map, add its weight, and discard empty routes, routes that use missing or negative-cost arcs, and totals outside the long range. Keep the first candidate when costs tie. Return an empty result if every candidate is unusable. A single vertex gives cost zero.

${workflow}

**Checkpoints** C → A is missing. A → C costs 8, and A → B → C costs 5. The sample selects [A, B, C]. Try a zero-cost edge, a tie and a candidate whose mathematical total exceeds Long.MAX_VALUE.`
			)
		]
	};
}
