import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaPriorityMapModuleID,
	javaPriorityMapProjects,
	javaPriorityMapURL
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
	pack: Parameters<typeof javaPriorityMapURL>[0],
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaPriorityMapURL(pack, "starter"),
		solutionLink: javaPriorityMapURL(pack, "solution")
	};
}

export function buildJavaPriorityMapModule(): RawCourseModule {
	const [rank, frequency, transfer, lookup] = javaPriorityMapProjects;
	return {
		id: javaPriorityMapModuleID,
		title: "AJ13 Priority Queues and Maps",
		curriculum: [
			reading(
				"Priority Queues",
				`A priority queue retrieves the item ordered first by its comparator. In a regular queue, the item that arrived first leaves first. In a priority queue using the natural order of integers, adding 9, then 2, then 5 makes 2 the next item removed.

For class rank, compare GPAs in descending order and compare names in ascending order when GPAs match. Compare Zoe at 3.90 and Ana at 3.90. The GPA comparison ties, so Ana comes first by name. If Mei has 4.00, the full poll sequence is Mei, Ana, Zoe. Use comparingInt, reversed and thenComparing to express those rules one at a time. Place reversed before thenComparing so only the GPA ordering is reversed.

Java's PriorityQueue can peek at the head in constant time. Insertion and head removal take O(log n). Its iterator and toArray show the retained items in an unspecified order. Repeated polling yields priority order and consumes the queue. For a report that keeps the queue, poll a copy or sort a copy of the input.`
			),
			reading(
				"Using a Java Priority Queue",
				`The default PriorityQueue of integers uses the smallest integer as its head. offer adds a value. peek reads the head without removal. poll removes and returns the head. Peek and poll return null when the queue is empty. Remove takes a specified matching value if supplied, and contains reports membership.

\`\`\`java
import java.util.PriorityQueue;

class PriorityQueueExample {
    public static void main(String[] args) {
        var tasks = new PriorityQueue<Integer>();
        tasks.offer(9);
        tasks.offer(2);
        tasks.offer(5);
        System.out.println(tasks.peek());       // 2
        System.out.println(tasks.contains(9)); // true
        tasks.remove(9);
        System.out.println(tasks.poll());      // 2
        System.out.println(tasks.poll());      // 5
        System.out.println(tasks.poll());      // null
    }
}
\`\`\`

Run the example as PriorityQueueExample.java. Replace the default order with java.util.Comparator.reverseOrder() and predict the first peek and each poll. The removal of the specific value 9 still happens before the first poll.`
			),
			assignment(
				"AJ13 Project 1: Class Rank",
				rank.pack,
				`Implement rank using a PriorityQueue of Student records. The GPA is stored in hundredths. Rank by descending GPA, then by ascending name. Remove the head repeatedly to produce the report and keep the input list intact. Keep equal records in the output.

${workflow}

**Checkpoints** The sample reports Mei (4.00), Ana (3.90), Zoe (3.90), then Ray (3.55). Trace the result as each student is polled. Check an empty list, two equal records, and equal GPAs supplied in reverse name order.`
			),
			reading(
				"Maps",
				`A map stores associations between keys and values. In an inventory map, the key might be the SKU lamp and the value could be the quantity 4. Calling put with the same key and a new value replaces its earlier value. Checking for a key before updating can enforce a different policy, such as rejecting any duplicate.

HashMap uses equality and hashing to find a key and has no guaranteed iteration order. TreeMap uses a comparator or natural ordering and traverses keys in that order. Both store one value per key. Use HashMap for direct lookups when order is irrelevant and TreeMap when the report needs stable key order.

When counting letters, each letter is a key and its count is a value. A TreeMap of Unicode code points makes the order explicit. On input Baa!, ignore the punctuation, lowercase each letter and update the count of a twice. The report is a: 2 and b: 1. A tie can be resolved consistently by choosing the lower code point.`,
				{
					id: `${javaPriorityMapModuleID}-curriculum-java-level-3-maps`,
					aliases: [
						"maps",
						`${javaPriorityMapModuleID}-curriculum-maps`
					]
				}
			),
			reading(
				"Using a Java Map",
				`Use get for a stored value, containsKey to check membership, remove to delete, and entrySet when both keys and values are needed. In this inventory, a missing SKU has no entry and zero means a known item is out of stock.

\`\`\`java
import java.util.Map;
import java.util.TreeMap;

class MapExample {
    public static void main(String[] args) {
        Map<String, Integer> stock = new TreeMap<>();
        stock.put("lamp", 4);
        stock.put("bulb", 7);
        stock.put("lamp", 0);
        System.out.println(stock.get("lamp"));        // 0
        System.out.println(stock.containsKey("fan")); // false
        stock.remove("lamp");
        for (var entry : stock.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
\`\`\`

Run the example as MapExample.java. The last line is bulb: 7. To count occurrences, use merge(key, 1, Integer::sum). It stores 1 when the key is absent or adds 1 to the prior count when the key exists.`,
				{
					id: `${javaPriorityMapModuleID}-curriculum-java-level-3-using-a-java-map`,
					aliases: [
						"using-a-java-map",
						`${javaPriorityMapModuleID}-curriculum-using-a-java-map`
					]
				}
			),
			assignment(
				"AJ13 Project 2: Letter Frequencies",
				frequency.pack,
				`Implement frequencies and winner. Read text by Unicode code point so a letter encoded as a surrogate pair is counted once. Keep only characters for which Character.isLetter is true and apply Character.toLowerCase to each code point. Store the counts in a TreeMap with ascending numeric code points. For a tie, return the smallest code point among the highest counts. If there are no letters, return OptionalInt.empty().

${workflow}

**Checkpoints** The default sample produces a: 3, b: 3, c: 1, f: 1 and é: 2, then reports a as most frequent. Try punctuation-only input. Check two representations of the same uppercase and lowercase supplementary letter, such as 𐐀 and 𐐨.`
			)
		],
		supplementalProjects: [
			assignment(
				"Priority Queues and Maps: Extension Challenge",
				rank.pack,
				`Reopen the saved Class Rank workspace. Implement topWithTies. Order the students by the existing rank rules. Take the first n ranks and include all additional students with the same GPA as the student at that cutoff. Compare GPA to extend the list, so different names can share the cutoff. A nonpositive limit returns an empty result.

After compiling, run java ContractTests cutoff and java Main cutoff. With a cutoff of two in the sample, the result is Mei, Ana and Zoe. Check a limit beyond the list length, an empty list and a zero limit.`
			),
			assignment(
				"Priority Queue Transfer Practice",
				transfer.pack,
				`Schedule jobs by descending urgency and ascending arrival sequence for tied urgency. Each arrival number is unique. The sequence records arrival independently of where a job appears in the input. Return the drained list of job labels and keep the original list intact.

${workflow}

**Checkpoints** The example returns [Terminal, Router, Printer, Monitor]. Add two equal-priority jobs in reverse input order and check which arrives first. Test an empty input.`
			),
			assignment(
				"Map Lookup Extension Practice",
				lookup.pack,
				`Build a catalog of inventory updates. Trim surrounding Java whitespace and lowercase the SKU with Locale.ROOT before both storage and lookup. A later update replaces the count for its normalized SKU. Reject blank keys and negative counts. Use OptionalInt to distinguish an absent key from a count of zero.

${workflow}

**Checkpoints** Lamp becomes zero after its second update, bulb has seven, and Cable is missing. Check an empty catalog and a lookup with surrounding whitespace and mixed case. Explain why the same key normalization belongs on both paths.`
			)
		]
	};
}
