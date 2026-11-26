import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaLinkedListModuleID,
	javaLinkedListProjects,
	javaLinkedListURL
} from "@/modules/javaSearchResources";

function workflow(sources: string) {
	return `Open the starter in the site IDE and confirm the import. Save the attempt before downloading the ZIP. The IDE's **Run** panel shows these Java 21 commands. Run them in the extracted project folder.

\`\`\`sh
javac --release 21 -Xlint:all -Werror ${sources}
java ContractTests
java Main
\`\`\`

The untouched starter compiles. The checker identifies an unfinished method until the implementation is ready.`;
}

function reading(title: string, content: string): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "reading",
		preserveInstructions: true,
		preserveAssignment: true
	};
}

function assignment(
	title: string,
	pack: Parameters<typeof javaLinkedListURL>[0],
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaLinkedListURL(pack, "starter"),
		solutionLink: javaLinkedListURL(pack, "solution")
	};
}

export function buildJavaLinkedListModule(): RawCourseModule {
	const [singly, doubly, remove, reverse] = javaLinkedListProjects;
	return {
		id: javaLinkedListModuleID,
		title: "AJ11 Linked Lists",
		curriculum: [
			{
				...reading(
					"Introduction to Linked Lists",
					`A linked list stores each value in a node with a reference to its successor. For A → B → C, the order comes from following links. In an array or ArrayList, get(2) can jump to position 2. In a linked list, reaching position 2 requires walking past two data nodes.

Inserting X after A changes two references. Point X at B first, then point A at X. The sequence becomes A → X → B → C. If A is redirected before the old successor is saved, the tail can become unreachable. When the predecessor is already available, relinking takes constant time. Finding that predecessor by walking from the head can take linear time.

A sentinel is a structural node outside the stored sequence. Use a size field to count data nodes only. Trace the empty list, a one-value list and the example above. After each change, verify that the sequence from the sentinel visits exactly size data nodes.`
				),
				id: `${javaLinkedListModuleID}-curriculum-linked-lists-core-concepts`,
				aliases: [
					`${javaLinkedListModuleID}-curriculum-core-concepts-and-learning-sequence`,
					"core-concepts",
					`${javaLinkedListModuleID}-curriculum-core-concepts`
				]
			},
			reading(
				"Singly Linked Lists",
				`In this implementation, head is a fixed sentinel and head.next is the first data node or null. Each node has one next reference. To prepend, create a node whose next reference is the old first node, set head.next to the new node, and increment size. To remove the first node of a nonempty list, set head.next to the second node and decrement size.

Prepending and removing the first node take O(1) time. Appending takes O(n) in this version because it keeps only the head sentinel. Removing the last node needs its predecessor and also takes O(n). Clearing simply detaches the chain by setting head.next to null and size to zero.

Validate 0 ≤ index < size before walking for get(index). The sentinel has no index. A data node may hold a Java null value, so traversal ends when the node reference is null. Starting with B → C, trace prepend(A), removeFront() and removeBack(). Check the remaining node and size after each operation.`
			),
			assignment(
				"AJ11 Project 1: Singly Linked List",
				singly.pack,
				`Complete the operations in LinkedList.java using the provided Node and ListContract. Insert and remove at either end, get a value by zero-based index, and clear all data. Removing from an empty list leaves it empty. Invalid indices throw IndexOutOfBoundsException. Preserve duplicate and null values.

${workflow("*.java")}

**Checkpoints:** The sample prints [A, B, C], B and 0 on separate lines. Draw the head and links after the first insertion and after removing the last node. Check empty removal, get(−1), get(size), two clears in a row and insertion after clearing. Explain why removing the tail requires a walk in this version.`
			),
			reading(
				"Doubly Linked Lists",
				`Each data node now has next and previous references. Two sentinels mark the ends. On an empty list, head.next is tail and tail.previous is head. On a nonempty list, neighboring nodes agree about their connection: if a.next is b, then b.previous is a.

Insert X between A and B by making A and X neighbors, then making X and B neighbors. Remove X by reconnecting A and B in both directions. These steps work when either neighbor is a sentinel. Because the sentinels expose both endpoints, inserting or removing at either end takes O(1). Indexed lookup still requires traversal.

Trace head ↔ 7 ↔ 12 ↔ 21 ↔ tail. Follow previous from tail.previous to read 21, 12, 7. Remove 7 and then 21. Check that 12 is adjacent to both sentinels. Clearing reconnects the sentinels directly and resets size to zero.`
			),
			assignment(
				"AJ11 Project 2: Doubly Linked List",
				doubly.pack,
				`Complete DoublyLinkedList.java against the same ListContract. Finish the helper that reconnects two neighbors, then use it for insertions, removals and clear. Implement reverseValues by following previous links without mutating the list. Exclude both sentinels from results, even if a data node contains null.

${workflow("*.java")}

**Checkpoints:** The sample prints [7, 12, 21], [21, 12, 7] and 12. Verify an empty reverse traversal and a single data node, then use duplicate and null values. After every removal, compare forward order to the reverse of backward order. Explain why removing the last value is constant time here.`
			)
		],
		supplementalProjects: [
			assignment(
				"Linked Lists: Extension Challenge",
				singly.pack,
				`Reopen the saved singly linked list workspace. Complete firstIndex so it returns the zero-based index of the first matching value or −1 if none exists. Start at head.next and compare values with Objects.equals so equal strings and null values work. Stop at the first match.

Compile the saved project, then run java ContractTests find and java Main find. The sample prints 1 for B in [A, B, C]. Add examples with two equal values, a null value and an empty list. Explain why a search that finds no match must visit every node.`
			),
			assignment(
				"Linked List Transfer Practice",
				remove.pack,
				`Implement removeFirst(sentinel, value) for a singly linked chain. Return true and unlink only the first equal data node. Return false if none matches. Preserve all other nodes and their order. Scan with a predecessor reference so removing the first data node follows the same rule as removing an interior node.

${workflow("Main.java ContractTests.java")}

**Checkpoints:** Removing a from a → b → a prints true, b and a. Check a match at the end, a missing value, an empty chain and a null value.`
			),
			assignment(
				"Linked List Extension Practice",
				reverse.pack,
				`Reverse a singly linked chain in place. The method receives the first data node and returns the new first node. Keep references to the already reversed portion, the current node and the next unprocessed node. Save the next node before redirecting the current node's link. Reuse the input nodes and use constant extra space.

${workflow("Main.java ContractTests.java")}

**Checkpoints:** Reversing 1 → 2 → 3 prints 3, 2 and 1. Verify that each output node is an original node and the old first node is now last with a null next reference. Try an empty chain, a one-node chain and reversing twice.`
			)
		]
	};
}
