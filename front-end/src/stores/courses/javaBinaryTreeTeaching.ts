import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaBinaryTreeModuleID,
	javaBinaryTreeProjects,
	javaBinaryTreeURL
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
	pack: Parameters<typeof javaBinaryTreeURL>[0],
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaBinaryTreeURL(pack, "starter"),
		solutionLink: javaBinaryTreeURL(pack, "solution")
	};
}

export function buildJavaBinaryTreeModule(): RawCourseModule {
	const [basics, traversal, removal, range, trim] = javaBinaryTreeProjects;
	return {
		id: javaBinaryTreeModuleID,
		title: "AJ14 Binary Search Trees",
		curriculum: [
			reading(
				"Trees",
				`A tree starts at a root. An edge joins a parent to a child. A node's descendants include the children and the nodes reached by following their child links. A leaf has no children. A subtree consists of a starting node and its descendants. A binary tree has at most two children per node, distinguished as left and right.

\`\`\`text
        12
       /  \\
      3    20
     / \\   / \\
   -4   7 16  23
\`\`\`

The root 12 has depth 0. The path 12 → 3 → 7 has two edges, so 7 has depth 2. The height of this tree is 2 edges. Inserting a new child below 7 would place that child at depth 3. Trace the ancestors of 16, then identify the four leaves and the subtree rooted at 20.`,
				{
					id: `${javaBinaryTreeModuleID}-curriculum-binary-search-trees-core-concepts`,
					aliases: [
						`${javaBinaryTreeModuleID}-curriculum-core-concepts-and-learning-sequence`,
						"core-concepts",
						`${javaBinaryTreeModuleID}-curriculum-core-concepts`
					]
				}
			),
			reading(
				"Binary Search Trees",
				`For a binary search tree of distinct integers, every key in a node's left subtree is smaller and every key in its right subtree is larger. These bounds apply to the whole subtree. For example, a node with value 14 can be greater than its parent 3 and still be in the wrong place if both are in the left subtree of 12.

Compare the search key to the current node. Equality ends a successful search. A smaller key proceeds left and a larger key proceeds right. Reaching a missing child means the key is absent. To insert an absent key, place a new leaf at that missing child. On the example tree, searching for 7 compares 12, then 3, then 7. Trying to insert a second 7 leaves the tree unchanged.

Search and insertion do one comparison sequence along a path of length at most the tree height. Balanced trees give O(log n) paths. Inserting sorted keys into an ordinary unbalanced tree can produce a chain and O(n) paths. Compare the shapes from inserting [12, 3, 20, 7] and [3, 7, 12, 20].`
			),
			reading(
				"BST Practice Problems",
				`When deleting a leaf, its parent loses that child link. When deleting a node with one child, its parent links directly to the child. Deleting 3 from a tree whose only child of 3 is 7 leaves 7 where 3 had been. The same rule applies to the root. Always use the root returned by the removal operation.

When a node has two children, its inorder predecessor is the largest key in the left subtree. In the drawing, 7 is the predecessor of 12. Put 7 in the position of 12, remove 7 from its old position, and preserve both surviving subtrees. If the old predecessor has a left child, that child takes its old place. Each removal changes the number of data nodes by exactly one.

By hand, remove −4, then 3, then 12 from the original drawing and record the inorder keys after each step. After removing −4, node 3 has one child. After removing 3, that child becomes the new left subtree of 12. Check that 7 is still reachable after replacing 12.`
			),
			assignment(
				"AJ14 Project 1: BST Basic Implementation",
				basics.pack,
				`Implement insert and contains. Treat the tree as a set of distinct int keys. Return the new root for an empty input and return the existing root after inserting below it. Leave duplicates unchanged. Search down one branch at each comparison. The starter supplies the node representation and an inorder helper for checking the result.

${workflow}

**Checkpoints** The sample gives [3, 7, 12, 20], true for 7 and false for 9. Trace the path followed by the query 9 and that followed by a duplicate insertion. Test an empty root, a sorted sequence and both extreme int values.`
			),
			reading(
				"Depth First Search",
				`Depth-first traversal visits the left and right subtrees recursively. Each recursive call stops at a missing node. The order names describe when a node's own key is recorded relative to its children. Preorder records it before either subtree, inorder between the subtrees and postorder after both. Each traversal visits every node once.

For the example tree, preorder gives [12, 3, −4, 7, 20, 16, 23]. Inorder gives [−4, 3, 7, 12, 16, 20, 23]. Postorder gives [−4, 7, 3, 16, 23, 20, 12]. Inorder is sorted because a BST orders the left subtree before the root and the right subtree after it.

Pass the same result list to the recursive calls for a given traversal, so every key is appended once. The traversal takes O(n) time and uses O(h) active stack space for height h, in addition to the output. Trace the left subtree alone and compare the point at which each order records 3.`
			),
			assignment(
				"AJ14 Project 2: BST Traversals",
				traversal.pack,
				`Complete the recursive collect helper shared by preorder, inorder and postorder. Visit the left subtree before the right and add the current key at the position selected by the traversal order. Leave the tree intact and return a new result list for each traversal. A missing root gives an empty list.

${workflow}

**Checkpoints** The worked tree in the reading gives all three expected lists. Explain why inorder lists the keys in ascending order here. Repeat the trace for a one-node tree and a tree with only right children. Compare the roots before and after all three calls.`
			),
			assignment(
				"AJ14 Project 3: BST Clear and Remove",
				removal.pack,
				`Implement recursive subtree replacement and clearing. Reattach the returned subtree at every recursive step. Use the inorder predecessor when removing a node with two children, and remove its old occurrence from the left subtree. The provided public method checks presence and decrements size once on success. Clearing releases the entire privately owned tree by setting root to null and size to zero.

${workflow}

**Checkpoints** Removing 12 from the sample leaves [3, 7, 16, 20]. Removing the absent 90 returns false, and clearing gives size 0. Verify that a removed node with one child preserves that child, that removing a missing key changes neither the order nor size, and that insertion works again after two consecutive clears.`
			),
			reading(
				"BST Invariant and Mutation Contract",
				`Check ordering, reachability, node count and the returned root after each mutation. An inorder sequence of distinct ascending keys provides one check for ordering. Compare it with the expected keys from an independent TreeSet. Check both the values and their number so losing a subtree cannot pass just because the remaining keys are sorted.

Start from the tree in the first reading. Removing 12 should replace the root with 7, keep both surviving subtrees reachable, and decrease the size to 6. Test a leaf, a node with one child, a node with two children, a missing key, a duplicate insertion and an empty tree. Inspect the new root after removing the only node. Clearing twice should leave the empty state unchanged.`
			)
		],
		supplementalProjects: [
			assignment(
				"Binary Search Trees: Extension Challenge",
				basics.pack,
				`Reopen the saved basic tree. Implement ceiling to return the smallest key at least as large as the query. An exact match is the answer. When the current key is greater, save it as a candidate before searching left. When it is smaller, search right. Return OptionalInt.empty() if no candidate was found.

Compile the saved project and run java ContractTests ceiling and java Main ceiling. The sample returns 12 for a query of 8. Try an exact match, an empty tree and a query above the largest key. Explain why each descent keeps or replaces the saved candidate.`
			),
			assignment(
				"BST Traversal Transfer Practice",
				range.pack,
				`Return the keys in an inclusive interval using inorder traversal. Only visit a left subtree when it can contain a key above or equal to the lower bound. Apply the corresponding upper-bound check to the right subtree. Return an empty list for a reversed interval or missing root. Leave all links intact.

${workflow}

**Checkpoints** In the sample, [7, 20] returns [7, 12, 18, 20]. Try identical endpoints, a reversed interval and the full valid int range. Explain why a node equal to the lower bound has no qualifying keys in its left subtree.`
			),
			assignment(
				"BST Mutation Extension Practice",
				trim.pack,
				`Trim a tree to the inclusive interval and return the new root. If the root is below the interval, only its right subtree can contain survivors. If it is above, only its left subtree can contain survivors. For a surviving root, trim both children and attach their returned roots. Reuse the surviving nodes. A reversed interval returns no tree.

${workflow}

**Checkpoints** The sample trims to [14, 23] and returns [18, 20, 23] in inorder. Confirm that the new root is the original node 20. Try trimming to one key and to an interval with no keys, then compare the surviving node identities.`
			)
		]
	};
}
