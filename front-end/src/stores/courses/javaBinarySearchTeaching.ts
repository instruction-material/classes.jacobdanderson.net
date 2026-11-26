import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaBinarySearchModuleID,
	javaBinarySearchProjects,
	javaBinarySearchURL
} from "@/modules/javaSearchResources";

const workflow = `Open the starter in the site IDE and confirm the import. **Run** displays the Java 21 commands. Save the attempt, extract its download, and open a terminal in that project folder.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The unchanged starter compiles and identifies its unfinished method when the test runs. Keep each project in its own folder because all five use the class name Main.`;

const searchReading = `Binary search relies on sorted data. This module uses arrays sorted in ascending order. Start with the inclusive range from index 0 to length − 1. If the range is empty, the target is missing. Otherwise compute the midpoint as lower + (upper − lower) / 2. A matching midpoint finishes the search. If its value is below the target, discard the midpoint and all earlier positions. If its value is above the target, discard the midpoint and all later positions. Every unsuccessful comparison shrinks the range.

For [2, 4, 10, 27, 38] and target 27, begin with lower = 0 and upper = 4. Midpoint 2 holds 10, so the next range is [3, 4]. Midpoint 3 holds 27, so return 3.

For target 28, the same first two midpoint values are too small. The last range is [4, 4]. Index 4 holds 38, which moves upper to 3. The range [4, 3] is empty, so return −1. A range of one element still needs a comparison.

In the iterative version, a loop updates the two bounds. In the recursive version, a method call receives the new bounds and returns the index produced by that smaller call. Both use the same sortedness guarantee and stop when the range is empty. Repeated values can give any matching index under this contract. Finding the leftmost possible position is the goal of a separate practice task.`;

const growthReading = `Count one probe each time the search examines a midpoint. For a nonempty array, a first-probe hit costs one probe. In the worst case a range of n elements leaves at most floor(n / 2) candidates after one failed probe. The maximum is floor(log₂(n)) + 1 probes for n ≥ 1. An empty array takes zero probes.

| Array size | Maximum binary probes | Maximum linear comparisons |
| --- | ---: | ---: |
| 8 | 4 | 8 |
| 16 | 5 | 16 |
| 32 | 6 | 32 |
| 1024 | 11 | 1024 |

For a worst-case miss in eight elements, the candidate counts can go 8 → 4 → 2 → 1 → 0, with one probe at each nonempty size. Doubling the size adds one possible binary probe. The number of probes has logarithmic growth. A midpoint iteration uses constant additional space. The recursive version keeps one call frame per probe, so its stack space grows logarithmically. The project passes ranges into the original array, avoiding a copy at every call.

The search cost assumes sorted input. Sorting once can support many logarithmic lookups, while a single lookup in unsorted data can use a linear scan immediately. State whether the count includes preparing the data when comparing the two choices.`;

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
	pack: (typeof javaBinarySearchProjects)[number]["pack"],
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaBinarySearchURL(pack, "starter"),
		solutionLink: javaBinarySearchURL(pack, "solution")
	};
}

export function buildJavaBinarySearchModule(): RawCourseModule {
	const [iteration, recursion, root, trace, insertion] =
		javaBinarySearchProjects;
	return {
		id: javaBinarySearchModuleID,
		title: "AJ6 Binary Search",
		curriculum: [
			reading("Binary Search", searchReading),
			assignment(
				"AJ6 Project 1: Binary Search with Iteration",
				iteration.pack,
				`Implement search for a sorted int array. Return a matching zero-based index or −1. Start with lower = 0 and upper = length − 1, then keep an inclusive range. Compare the midpoint, update just one bound after a failed probe, and return −1 when the range is empty. Treat repeated values as valid input and leave the array unchanged.

${workflow}

**Checkpoints:** For [2, 4, 10, 27, 38], targets 2, 38 and 28 return 0, 4 and −1. Check a one-element hit and miss, an empty array, and [1, 4, 8, 16] with target 16. Show the final interval for a miss.`
			),
			assignment(
				"AJ6 Project 2: Binary Search with Recursion",
				recursion.pack,
				`Use the supplied search wrapper to pass the full inclusive range to searchRange. In searchRange, check whether upper is below lower before reading the array. Return the midpoint on a match. Otherwise return the result of a recursive call with either upper = midpoint − 1 or lower = midpoint + 1. Keep the original array and pass the updated bounds as arguments.

${workflow}

**Checkpoints:** For [2, 4, 10, 27, 38] and target 38, trace [0, 4], [3, 4] and [4, 4]. The value 4 returns through both earlier calls. Target 39 eventually gives an empty range and returns −1. Compare the same first, last, empty and missing cases with the iterative result.`
			),
			reading("Binary Search Big-O Analysis", growthReading),
			assignment(
				"AJ6 Project 3: Precise Square Roots",
				root.pack,
				`Approximate the real square root of a finite, nonnegative double. Reject a negative value, NaN or infinity with IllegalArgumentException, and return zero as received. For a positive n, begin with lower = 0 and upper = max(1, n). If n lies between zero and one, its root is larger than n. With n = 0.25, the initial range [0, 1] contains the exact answer 0.5.

At each step compute middle = lower + (upper − lower) / 2. Compare middle with n / middle. When middle ≤ n / middle, keep it as the lower bound. Otherwise keep it as the upper bound. Division gives the same comparison as squaring a positive midpoint in real arithmetic and avoids floating-point overflow. Stop when Math.nextUp(lower) reaches upper, which means there is no representable value between the bounds. Return the lower endpoint.

${workflow}

**Checkpoints:** Run java Main 0.25 and expect 0.5. Check zero, 2, 81 and the extreme finite inputs in the harness. Use Math.sqrt only as an independent check. The harness allows two units in the last place, measured by Math.ulp on the expected result. Describe why the bracket continues to contain the root as it narrows.`
			)
		],
		supplementalProjects: [
			assignment(
				"Binary Search: Extension Challenge",
				iteration.pack,
				`Reopen the saved iterative search workspace. In measure, return a SearchResult with the matching index or −1 and the number of midpoints examined. Count one probe per iteration, even when that probe finds the target. Keep the original search method and its checks working.

Compile Main.java and ContractTests.java and run java ContractTests count, then java Main count. For [2, 4, 10, 27, 38], target 2 returns index 0 after two probes and target 28 returns −1 after three. An empty array takes zero probes. Compare the measured count with floor(log₂(n)) + 1 for powers of two.`
			),
			assignment(
				"Binary Search Trace Practice",
				trace.pack,
				`Implement trace to record lower:middle:upper before each midpoint comparison. Separate records with one space. Include the final probe for a match and return the empty string if there is no probe. The trace records the exact search decisions without changing the array or printing inside the method.

${workflow}

**Checkpoint:** For [2, 4, 10, 27, 38] and target 28, expect 0:2:4 3:3:4 4:4:4. Then trace target 2 and an empty array.`
			),
			assignment(
				"Binary Search Edge-Case Practice",
				insertion.pack,
				`Implement insertionIndex to return the first position where the value is at least the target. Return the array length if all values are smaller. This includes inserting before existing duplicates. Start with lower = 0 and upper = length. While lower < upper, the midpoint is an array index. Move lower to midpoint + 1 when its value is below the target. Otherwise move upper to midpoint because that position may be the first valid answer. Return lower when the bounds meet.

${workflow}

**Checkpoints:** In [2, 4, 4, 4, 9], target 4 gives 1, target 5 gives 4 and target 10 gives 5. An empty array gives 0. Explain why stopping at the first matching midpoint would sometimes produce a later position among duplicates.`
			)
		]
	};
}
