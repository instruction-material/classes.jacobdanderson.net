import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaSearchModuleID,
	javaSearchProjects,
	javaSearchURL
} from "@/modules/javaSearchResources";

const workflow = `Open the starter in the site IDE after confirming the import. Use **Run** for the Java 21 commands. Download and extract the ZIP, then open a terminal in its folder. Compile the exported AJ5 pack in a clean Java 21 build directory before checking the reported output.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

Keep the folders separate because every project defines Main. The untouched coding starters compile and identify the unfinished method when the check runs.`;

const searchReading = `**Course flow:** Trace the returned index, count equality comparisons, and use those counts to explain growth. Build the first-match method before continuing to all matches or comparison counts.

Linear search checks positions from left to right. Pass the array and target as parameters and return an index without changing the input. A match at position zero is a valid result. Reserve -1 for a missing target. With duplicates, return on the first match. Empty input reaches the missing case without an equality comparison.

\`\`\`java
static int firstIndex(int[] values, int target) {
    if (values == null) throw new IllegalArgumentException("values must not be null");
    for (int i = 0; i < values.length; i++) {
        if (values[i] == target) return i;
    }
    return -1;
}
\`\`\`

For [7, 2, 7, 4], a search for 7 returns 0 after one comparison. A search for 4 reaches index 3 after four comparisons. Looking for 9 also takes four comparisons and returns -1. Sortedness is unnecessary. Record which equality check allowed the search to stop. The method returns a value, and the console alone decides how to display it.`;

const growthReading = `Use n for the number of items and count a specific operation. For a nonempty linear search, a first-position hit takes one equality comparison. A last-position hit or a miss takes n comparisons. With a target equally likely to be at any position, a successful search averages (n + 1) / 2 comparisons. A mixture of hits and misses depends on how often each occurs.

**Tight growth:** For 12n² + n, n² dominates as n increases. The tight label is n². Big-O gives an upper bound, and a tight label describes both the eventual upper and lower growth. A fixed constant has label 1. Repeatedly halving an integer to reach 1 takes a logarithmic number of steps.

**Two independent sizes:** Keep both terms in log(n) + m². Neither can be discarded when n and m vary independently. The value of 1 + 2 + … + n grows quadratically, while a loop that sums those n values performs n additions. Name whether the expression represents a numeric result or an operation count before describing runtime.`;

const activities = [
	[
		"AJ5 Project 1: Linear Search Implementation",
		0,
		`Implement firstIndex for a non-null int array. Visit positions in order and return the first matching index. Return -1 for an empty array or absent target. Throw IllegalArgumentException for null. Use the returned index to display the outcome. Index zero counts as found.

${workflow}

**Checkpoints:** Test [7, 2, 7, 4] with targets 7, 4 and 9. Expect 0, 3 and -1. Record one empty-input test and show that a search leaves the array unchanged.`
	],
	[
		"AJ5 Project 2: Big-O Practice",
		1,
		`Classify the ten supplied growth expressions. Write the dominant term and name the counted quantity for each answer. The starter prints the expressions and blank labels. Enter the tight labels in worksheet order using the formats in README.md.

${workflow}

**Checkpoints:** Explain why 12n² + n has label n^2 and n + log(n) has label n. Keep both independent terms in 3log₂(n) + m². For the final recurrence, trace n = 8 through 8, 4, 2 and 1. The harness checks that each row uses an accepted label format. Compare the reasoning with the worked reading and reference.`
	],
	[
		"Linear Search and Big O Notation: Extension Challenge",
		0,
		`Reopen the completed Linear Search Implementation workspace. Implement allIndices so it returns every matching zero-based index in ascending order. Return an empty array for no match. Build the result without modifying the input.

Compile Main.java and ContractTests.java as in the main project. Run java ContractTests all, then java Main all.

**Checkpoints:** Searching [7, 2, 7, 4] for 7 produces [0, 2]. A missing target produces an empty result. Explain why collecting every match must examine the full input even when the first element matches.`
	],
	[
		"Search Runtime Transfer Practice",
		2,
		`Implement firstPrefix for a non-null array of non-null labels and a nonempty prefix. Return the first zero-based index starting with the prefix, or -1 when no label matches. Match case exactly. Reject an empty or null prefix with IllegalArgumentException.

${workflow}

**Checkpoints:** For [map-north, pen, map-south], the prefix map returns 0, pen returns 1 and MAP returns -1. Check an empty array and compare the array before and after the call.`
	],
	[
		"Runtime Comparison Extension Practice",
		3,
		`Instrument a linear search over any non-null int array. Return the first index and the number of equality comparisons. A miss returns index -1. An empty array returns (-1, 0). Run the supplied fixture with sizes 8, 16 and 32.

${workflow}

**Checkpoints:** The output rows are 8 1 8 8, 16 1 16 16 and 32 1 32 32. Columns are size, first hit, last hit and missing target. Explain why doubling the size doubles the miss comparisons and leaves the first hit at one. Compare counts from the algorithm rather than elapsed time.`
	]
] as const;

function lesson(item: RawCourseModuleItem): RawCourseModuleItem {
	const match = activities.find(activity => activity[0] === item.title);
	if (!match) {
		const content =
			item.title === "Linear Search"
				? searchReading
				: item.title === "Introduction to Big-O Analysis"
					? growthReading
					: undefined;
		return content
			? {
					...item,
					content,
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true
				}
			: item;
	}
	const [, index, content] = match;
	const pack = javaSearchProjects[index].pack;
	return {
		...item,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaSearchURL(pack, "starter"),
		solutionLink: javaSearchURL(pack, "solution")
	};
}

export function completeJavaSearchModule(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "AJ5 Linear Search and Big-O Notation") return module;
	return {
		...module,
		id: javaSearchModuleID,
		curriculum: module.curriculum.map(lesson),
		supplementalProjects: module.supplementalProjects.map(lesson)
	};
}
