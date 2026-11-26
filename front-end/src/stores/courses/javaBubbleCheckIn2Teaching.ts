import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaBubbleCheckIn2URL,
	javaBubbleSortProjects,
	javaCheckIn2ModuleID,
	javaCheckIn2Projects
} from "@/modules/javaSearchResources";

function workflow(files = "Main.java ContractTests.java") {
	return `Open the starter in the site IDE and confirm the import. **Run** shows the Java 21 commands. Save the attempt, download its ZIP, and open a terminal in the extracted project directory.

\`\`\`sh
javac --release 21 -Xlint:all -Werror ${files}
java ContractTests
java Main
\`\`\`

The starter compiles and identifies its unfinished method when checked. Compile each project in its own folder.`;
}

type Pack = Parameters<typeof javaBubbleCheckIn2URL>[0];

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
	pack: Pack,
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaBubbleCheckIn2URL(pack, "starter"),
		solutionLink: javaBubbleCheckIn2URL(pack, "solution")
	};
}

export function buildJavaBubbleSortModule(): RawCourseModule {
	const [numeric, words, trace, optimize] = javaBubbleSortProjects;
	return {
		title: "AJ8 Bubble Sort",
		curriculum: [
			reading(
				"Bubble Sort",
				`Bubble sort repeatedly compares adjacent values and swaps them when they are out of order. Move left to right across the active prefix. The largest value in that prefix ends the pass at its final index. The sorted tail grows by one, so the next pass has one fewer adjacent pair.

For [4, 2, 3, 1], the first pass makes [2, 3, 1, 4]. The next makes [2, 1, 3, 4]. The last gives [1, 2, 3, 4]. Record which values are in final positions after each pass. Compare adjacent items with a strict greater-than condition so equal keys keep their relative order.

When a pass makes no exchanges, every adjacent pair in the active range is ordered. The range is sorted, and the existing sorted tail remains valid. This proves the whole list is sorted and allows an early exit.`
			),
			assignment(
				"AJ8 Project 1: Bubble Sort Implementation",
				numeric.pack,
				`Implement sort for an int array. Move each out-of-order adjacent pair into order and shrink the active bound after each pass. Return a long count of every value comparison. When earlyStop is true, stop after a pass with no swaps. Keep the normal full-pass mode for comparison.

${workflow()}

**Checkpoints:** [2, 1, 3, 4, 5] sorts to [1, 2, 3, 4, 5] either way. Full-pass mode makes ten comparisons, while early-stop mode makes seven. Check empty, sorted, reversed, and repeated-value inputs. Count comparisons and swaps separately.`
			),
			reading(
				"Bubble Sort Big-O Analysis",
				`Without a no-swap stop, an array of length n uses n(n − 1) / 2 adjacent comparisons for any input order. After adding early exit, already sorted input of size n ≥ 2 uses n − 1 comparisons. A reversed array of distinct values still uses n(n − 1) / 2. The algorithm needs a fixed number of indices, a saved value and a flag, so its extra space is constant.

For length 5, compare four comparisons on sorted data with ten on reversed data. A nearly sorted list such as [2, 1, 3, 4, 5] takes seven because it exchanges the initial pair during the first pass and then verifies the remaining active pairs. Identify which comparisons are retained in the last-exchange extension.`
			),
			assignment(
				"AJ8 Project 2: Alphabetical Order",
				words.pack,
				`Read the supplied UTF-8 words.txt in the project folder. Treat whitespace as a separator and put the words in a mutable list. Sort with adjacent comparisons using String.compareTo. Keep all occurrences of a word. In Java's case-sensitive order, an uppercase English letter precedes its lowercase counterpart. A punctuation-leading token can come before both.

${workflow()}

**Checkpoints:** From zebra, apple, Apple, !yes, apple, expect !yes, Apple, apple, apple, zebra. Verify empty input and an already sorted list. Run java Main to use the supplied file or pass a local filename as the first argument to test custom data.`
			)
		],
		supplementalProjects: [
			assignment(
				"Bubble Sort: Extension Challenge",
				numeric.pack,
				`Reopen the saved numeric bubble-sort workspace. Implement lastExchange. In each pass, record the left index of the final swapped pair and use that index as the next upper bound. The items to its right are already in final order for this pass. If no pair was swapped, no work remains. Stop once there are no adjacent pairs left to compare.

Compile Main.java and ContractTests.java. Run java ContractTests last and java Main last. On [2, 1, 3, 4, 5], the optimized workflow makes four comparisons. Show why the sorted result matches the full-pass mode even when all exchanges occur near the beginning.`
			),
			assignment(
				"Bubble Sort Trace Practice",
				trace.pack,
				`Run the shrinking-bound version on a copy and record the full array after each pass. Add each snapshot as a separate copy. Include all n − 1 passes for nonempty input and use an empty list of snapshots if there is no adjacent pair.

${workflow()}

**Checkpoints:** [4, 2, 3, 1] yields [2, 3, 1, 4], [2, 1, 3, 4], [1, 2, 3, 4]. Check that editing the last returned snapshot leaves the first snapshot and original array unchanged. Explain which tail positions are final at each step.`
			),
			assignment(
				"Bubble Sort Optimization Practice",
				optimize.pack,
				`Alternate forward and backward adjacent passes. A forward pass puts the largest remaining value at the upper end. A backward pass puts the smallest remaining value at the lower end. Shrink the appropriate boundary after each pass. Finish when either pass finds no exchanges or no adjacent pairs remain.

${workflow()}

**Checkpoints:** [2, 3, 8, 4, −1, 2] gives [−1, 2, 2, 3, 4, 8]. Track where −1 moves on a forward pass and a backward pass. Explain why the backward pass can bring a small item to the front more quickly on this input.`
			)
		]
	};
}

export function buildJavaCheckIn2Module(): RawCourseModule {
	const [workbook, benchmark, validate, smallest] = javaCheckIn2Projects;
	return {
		id: javaCheckIn2ModuleID,
		title: "Check-In #2",
		curriculum: [
			assignment(
				"Check-In #2 Overview",
				workbook.pack,
				`This review compares selection sort, insertion sort, bubble sort, and merge sort. The required workbook covers selection, insertion and merge. Predict the intermediate states before writing the code. The Foundations Reference Archive gives the optional bubble comparison. For each sorter, state which prefix, tail or subarray is correct after its main step and what allows the process to end.

${workflow()}

**Checkpoints:** Use the original arrays shown in the readings. Check zero and full pass counts, then compare completed results with Arrays.sort on a copy. Keep the workbook attempt for the optional equal-run exercise.`
			),
			reading(
				"Check-In #2: Selection Sort",
				`Return an array copy after up to the requested number of selection passes. Each pass finds a minimum in the unsorted suffix and exchanges it with the first unfilled position. Start with [34, 23, 76, 75, 14, 25]. The first pass swaps 14 with 34. The second keeps 23 in place, leaving [14, 23, 76, 75, 34, 25].

The leftmost two positions are final after two passes. Each selection scan compares the best candidate so far with all later candidates in its range. A full sort uses n(n − 1) / 2 value comparisons regardless of input order. The workbook uses a copy so callers keep the original order. Explain how using the original array in place would change auxiliary space.`,
				{
					id: `${javaCheckIn2ModuleID}-curriculum-java-level-3-check-in-2-core-concepts`,
					aliases: [
						"core-concepts",
						"check-in-2-core-concepts",
						`${javaCheckIn2ModuleID}-curriculum-core-concepts`,
						`${javaCheckIn2ModuleID}-curriculum-core-concepts-and-learning-sequence`,
						`${javaCheckIn2ModuleID}-curriculum-check-in-2-core-concepts`
					]
				}
			),
			reading(
				"Check-In #2: Insertion Sort",
				`Return a copy after the requested number of insertions, beginning with the value at index 1. Save the value being inserted, shift earlier values that are larger, and put the saved value in the gap. Every pass leaves the processed prefix sorted and preserves all entries there.

With [99, 15, 27, 13, 8, 1], the first prefix becomes [15, 99]. Inserting 27 makes [15, 27, 99]. Inserting 13 makes [13, 15, 27, 99], so the full array after three passes is [13, 15, 27, 99, 8, 1]. On sorted input each saved value stays put. On reverse-ordered input each saved value shifts past the entire processed prefix. Count the moves on those two cases.`
			),
			reading(
				"Check-In #2: Bubble Sort",
				`Return a copy after the requested number of shrinking-bound bubble passes. Compare adjacent values from the first position through the active upper bound and exchange each pair in the wrong order. A pass puts the largest active value at the upper edge.

For [50, 23, 12, 43, 12, 20], the first pass gives [23, 12, 43, 12, 20, 50]. The second gives [12, 23, 12, 20, 43, 50]. The final two positions are fixed, and the active prefix still requires work. In the workbook, run java ContractTests bubble and java Main bubble to check this optional trace. Explain why a no-swap pass would justify stopping early and why the requested trace still records its stated number of passes when the array has enough positions.`
			),
			reading(
				"Check-In #2: Merge Sort",
				`The provided cursor merge takes two already sorted inputs. For [1, 4, 7, 10] and [2, 3, 5, 11], the first three choices are 1 from the left, 2 from the right and 3 from the right. Continue until one side empties, then copy the rest. The final array is [1, 2, 3, 4, 5, 7, 10, 11].

Implement the recursive caller. Return a copy when the length is at most one. Otherwise sort each smaller half and pass the returned arrays into merge. Each layer merges a total of n values across O(log n) layers, for Θ(n log n) time. Trace an odd-length array to show where each recursive call stops and how both halves return their values.`
			),
			assignment(
				"Check-In #2: Additional Practice Project",
				benchmark.pack,
				`Implement timed in the supplied benchmark. Give the algorithm its own input copy. Start the clock after copying and stop immediately after sorting. Compare the returned list with an independently sorted reference. Reject a wrong result before accepting its time.

${workflow("*.java")}

**Checkpoints:** Run the four algorithms on the same seeded data in random, ascending and descending order. The driver warms up each algorithm and rotates their order over four trials. Compare mean milliseconds per order, then repeat at a second input size. Explain how preparation cost and trial-to-trial variation affect the measured results. Describe growth from algorithm counts.`
			)
		],
		supplementalProjects: [
			assignment(
				"Check In #2: Extension Challenge",
				workbook.pack,
				`Reopen the saved workbook. In rangeAfterSorting, sort a copy with sortMerge. Use the supplied boundary helper to find the first position whose value is at least the target and the first position strictly greater than it. Return [first, endExclusive] for a run or [−1, −1] if the value is absent. Locate positions in the sorted copy and keep the input unchanged.

Compile the saved sources and run java ContractTests range and java Main range. In [8, 2, 5, 2, 2], target 2 occupies [0, 3) after sorting. Test a missing value and Integer.MAX_VALUE. Explain how changing the comparison avoids incrementing the target.`
			),
			assignment(
				"Sorting Checkpoint Transfer Practice",
				validate.pack,
				`Implement valid to check ascending order and exact value multiplicities. Count each input value in a map. Walk the result and reject any descending adjacent pair or value used more times than it appears in the input. Both lengths and all counts must agree.

${workflow()}

**Checkpoints:** [7, −3, 7, 1] matches [−3, 1, 7, 7]. Reject [−3, 1, 1, 7] because the number of 1s changed, and reject [−3, 7, 1, 7] because its order is wrong. Verify empty inputs and explain why only comparing lengths or sums would miss errors.`
			),
			assignment(
				"Sorting Checkpoint Extension Practice",
				smallest.pack,
				`Return the smallest k entries in ascending order, including repeated values. Leave the original input intact. Partially selection-sort a copy by placing the next minimum in its final position and stopping once the first k positions are filled. Reject k below zero or above the array length.

${workflow()}

**Checkpoints:** [8, −3, 5, −3, 2] with k = 3 gives [−3, −3, 2]. Try zero, the full length, and k larger than the input. Count the candidate comparisons for k = 1 and k = 3 and connect the stopping position to the requested output size.`
			)
		]
	};
}
