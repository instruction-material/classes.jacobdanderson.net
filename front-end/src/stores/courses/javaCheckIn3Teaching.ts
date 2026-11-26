import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaCheckIn3ModuleID,
	javaCheckIn3Projects,
	javaCheckIn3URL
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
	pack: Parameters<typeof javaCheckIn3URL>[0],
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaCheckIn3URL(pack, "starter"),
		solutionLink: javaCheckIn3URL(pack, "solution")
	};
}

export function buildJavaCheckIn3Module(): RawCourseModule {
	const [workbook, practice, transfer, undo] = javaCheckIn3Projects;
	return {
		id: javaCheckIn3ModuleID,
		title: "Check-In #3",
		curriculum: [
			assignment(
				"Check-In #3 Overview",
				workbook.pack,
				`Complete the workbook methods as the readings introduce them. Read an integer from lines of input, find and unlink data nodes, apply backspaces, rotate a queue, drain a priority queue, and pair keys with values. Use the supplied nested records and node types. Keep the group method for the optional exercise.

${workflow}

**Checkpoints** The default sample shows 42, index 1, [elm], acdc, [blue, red, green], [1, 2, 5, 5] and {oak=5, elm=3} after the record demonstration. Trace one method by hand before running the tests. Keep the saved workbook to revisit an operation or attempt the grouped-count extension.`
			),
			reading(
				"Check-In #3: Sustainable Programming",
				`A static nested type groups a helper with its owner class without needing an instance of that outer class. The supplied Riddle and Triple records are nested and implicitly static. Triple<String, Boolean, Integer> holds three values of different named types and gives each accessor its own return type. The first value in Triple<>("oak", true, 2) is a String. The third is an Integer.

Implement firstInteger with one Scanner. Read a whole line, trim it, and parse a signed integer. Integer.parseInt rejects text such as bad and values outside the int range with NumberFormatException. Handle that exception by reading the next line. The input bad followed by 42 yields OptionalInt.of(42). Empty input or input that ends after invalid lines yields OptionalInt.empty(). Trace which lines were consumed when the method returns and explain why no separate token needs to be discarded.`,
				{
					id: `${javaCheckIn3ModuleID}-curriculum-java-level-3-check-in-3-core-concepts`,
					aliases: [
						`${javaCheckIn3ModuleID}-curriculum-core-concepts-and-learning-sequence`,
						"core-concepts",
						"check-in-3-core-concepts",
						`${javaCheckIn3ModuleID}-curriculum-core-concepts`,
						`${javaCheckIn3ModuleID}-curriculum-check-in-3-core-concepts`
					]
				}
			),
			reading(
				"Check-In #3: Linked Lists",
				`Start indexOf at the first data node and increment the index when following next. Objects.equals handles a null value or query. For oak → null → oak, the first oak is at index 0 and null is at index 1. Missing values return −1. The search ends when traversal reaches a null node reference.

In the provided doubly linked chain, head and tail are sentinels. To remove a matched data node, connect its predecessor directly to its successor in both directions and decrement size once. Begin at head.next and stop before tail, even when the query is null. With head ↔ null ↔ elm ↔ null ↔ tail, removing null leaves elm followed by null. Trace both directions after removing the last node from a one-item chain.`
			),
			reading(
				"Check-In #3: Stacks",
				`Read typed keys in order. Use one end of an ArrayDeque as a stack. Ordinary keys are pushed on that end and # pops the most recent key. A backspace on an empty stack leaves it empty. Iterate over the remaining keys from oldest to newest to build the text.

For ab#cdef##c, the first backspace removes b and the next two remove f and e. The final text is acdc. Read Unicode code points so a backspace removes one complete supplementary character. For a😀#, the result is a. Try three leading backspaces and an empty input before testing an ordinary word.`
			),
			reading(
				"Check-In #3: Queues",
				`When rotating a FIFO queue, each step removes the head and appends that same value to the tail. From [red, green, blue], one rotation gives [green, blue, red] and two give [blue, red, green]. After a full cycle the order repeats, so a positive rotation count can be reduced modulo the number of items. Check for an empty input before taking a remainder. Reject negative counts.

A PriorityQueue of integers uses natural order. Add 5, 2, 5 and 1, then remove the head until it is empty. The result [1, 2, 5, 5] keeps duplicates. The iterator does not promise that order. Explain why priority order changes the sequence even when the same values entered a FIFO queue.`
			),
			reading(
				"Check-In #3: Maps",
				`Before pairing parallel lists, require the same number of keys and values. Walk them in step. Putting oak with 2, elm with 3 and oak with 5 leaves {oak=5, elm=3} because a put replaces the earlier value for an equal key. LinkedHashMap retains the order in which each distinct key first entered.

A map can replace a nested search when the workload repeatedly queries the same keys. For example, store a tree label as the key and its latest count as the value. Build the index once and use get for each label. A separate lookup can check containsKey when a missing key would otherwise be confused with a default. When multiple observations per label matter, the optional grouped-count exercise changes the value from one integer to an ordered list.`
			),
			reading(
				"Check-In #3 Application Check",
				`Trace the entire chain from head to tail before and after removing a matching node. Check that the backward path returns the same nodes in reverse and that size equals the number of data nodes.

Trace the same additions through a stack, a FIFO queue and a priority queue. For additions [3, 1, 2], the first removals are 2, 3 and 1 respectively. Explain what rule selected each value. Then state what happens when removing from an empty structure under the chosen Java API.

For keys [oak, elm, oak] and values [2, 3, 5], explain why the map contains only two keys. Show a separate representation that retains both counts for oak. Check that the solutions compile without warnings and that the contract suite passes before moving to trees.`,
				{
					id: `${javaCheckIn3ModuleID}-curriculum-check-in-3-application-check`,
					aliases: [
						`${javaCheckIn3ModuleID}-curriculum-application-misconceptions-and-readiness-check`,
						"application-check"
					]
				}
			),
			assignment(
				"Check-In #3: Additional Practice Project",
				practice.pack,
				`Show the original order of a queue of names, then reverse it with a stack and alphabetize it with a priority queue. Drain the FIFO queue to the stack and drain the stack back to the queue. For alphabetizing, poll a priority queue with String's natural order. Preserve duplicate names and the original input list.

${workflow}

**Checkpoints** The sample gives [Cora, Ada, Bea, Ada], then [Ada, Bea, Ada, Cora], then [Ada, Ada, Bea, Cora]. Test an empty list, one name and several identical names. Explain which operation reverses arrival order and which selects the next name alphabetically.`
			)
		],
		supplementalProjects: [
			assignment(
				"Check In #3: Extension Challenge",
				workbook.pack,
				`Reopen the saved workbook. Complete group to retain all values for each key. Reject unequal list lengths. Keep the keys in first-arrival order and values in input order. Use a new list the first time a key appears, then append to that list on later occurrences.

Compile the saved project and run java ContractTests groups and java Main groups. The sample changes {oak=5, elm=3} to {oak=[2, 5], elm=[3]}. Verify both original counts for oak, an empty input and a length mismatch. Add a later elm value of 6 and check that the result still starts with oak and keeps both elm counts in the order 3, 6.`
			),
			assignment(
				"Data Structures Checkpoint Transfer Practice",
				transfer.pack,
				`Batch document IDs by first arrival. Count each ID in a map and enqueue it only when its count becomes one. Drain the queue into a list of dispatch records containing the ID and total count. Keep comparisons case-sensitive and leave the input order intact.

${workflow}

**Checkpoints** For A2, B1, A2, C3, B1, A2, dispatch A2 with 3, B1 with 2 and C3 with 1. Try an empty batch and labels that differ only in case. Explain why counting alone does not capture dispatch order when the map has no iteration guarantee.`
			),
			assignment(
				"Data Structures Checkpoint Extension Practice",
				undo.pack,
				`Replay an inventory history. An item label adds one unit and goes onto the undo stack. UNDO reverses the latest addition that still remains. Ignore an undo on empty history and remove a label from the report when its count falls to zero. Use a sorted map for the report.

${workflow}

**Checkpoints** UNDO, lamp, bulb, lamp, UNDO, fan gives {bulb=1, fan=1, lamp=1}. Try undoing every addition and then adding again. Explain how the stack preserves the order needed to reverse operations while the map stores only each label's current count.`
			)
		]
	};
}
