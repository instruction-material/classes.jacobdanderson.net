import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaElementarySortingModuleID,
	javaElementarySortingProjects,
	javaMergeSortingModuleID,
	javaMergeSortingProjects,
	javaSortingURL
} from "@/modules/javaSearchResources";

const workflow = `Open the starter in the site IDE and confirm the import. **Run** displays the Java 21 commands. Save the attempt, download its ZIP, and open a terminal in the extracted project directory.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The starter compiles, and its checks identify the unfinished method. Build each project in its own folder because these projects use the same Main class name.`;

type SortingPack = Parameters<typeof javaSortingURL>[0];

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
	pack: SortingPack,
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaSortingURL(pack, "starter"),
		solutionLink: javaSortingURL(pack, "solution")
	};
}

export function buildJavaElementarySortingModule(): RawCourseModule {
	const [selection, insertion, bookshelf, tasks, inversions] =
		javaElementarySortingProjects;
	return {
		id: javaElementarySortingModuleID,
		title: "AJ7 Selection and Insertion Sort",
		curriculum: [
			reading(
				"Selection Sort",
				`Selection sort divides a collection into a sorted prefix and an unsorted remainder. At the start of a pass, the prefix already contains the smallest values in their final positions. Scan the remaining suffix to find its smallest value, then exchange it with the first position of that suffix. The prefix grows by one. Stop when at most one position remains.

For [4, 1, 3, 1], the first suffix is the entire array. Keep index 1 when index 3 ties it. Swap positions 0 and 1 to get [1, 4, 3, 1]. The second pass finds the remaining 1 at index 3 and gives [1, 1, 3, 4]. The last pass sees 3 already in place.

Finding the first minimum during each scan still allows a distant exchange to reverse earlier ties. For labeled values [2a, 2b, 1], the first exchange gives [1, 2b, 2a]. This is an example of instability. For numbered values alone, both equal entries still appear in the sorted result.`,
				{
					id: `${javaElementarySortingModuleID}-curriculum-selection-and-insertion-sort-core-concepts`,
					aliases: [
						"core-concepts",
						`${javaElementarySortingModuleID}-curriculum-core-concepts`,
						`${javaElementarySortingModuleID}-curriculum-core-concepts-and-learning-sequence`
					]
				}
			),
			assignment(
				"AJ7 Project 1: Selection Sort",
				selection.pack,
				`Implement sort to arrange the supplied int array in ascending order in place and return a long comparison count. For every pass, initialize the minimum candidate to the first unsorted position, scan the rest, and keep the first candidate on equal values. Swap the candidate into place if it is elsewhere. Count every comparison of two values, including ones that leave the candidate unchanged.

${workflow}

**Checkpoints:** [4, 1, 3, 1] becomes [1, 1, 3, 4] after six comparisons. [1, 2, 3, 4] also requires six. Verify empty and singleton arrays, duplicates, negative values, and reverse order. Record the prefix after each pass for the first example.`
			),
			reading(
				"Selection Sort Big-O Analysis",
				`A length-n array needs (n − 1) + (n − 2) + … + 1 = n(n − 1) / 2 candidate comparisons. An empty or singleton array needs none. The counts for lengths 4 and 8 are 6 and 28. Already sorted input takes the same number of comparisons because each suffix must be scanned to establish its minimum.

The sum grows quadratically with n. There is at most one actual swap per pass. When the minimum is already at the first unsorted position, the reference skips the exchange. The program changes the original array and uses a fixed number of index, count and temporary-value variables, so its auxiliary space is constant.

Predict comparison and swap counts for [3, 1, 2]. Identify why the two counts differ even though both describe the same run.`
			),
			reading(
				"Insertion Sort",
				`Insertion sort grows a sorted prefix. Save the first value after that prefix. Move larger prefix values one place right until the gap belongs before a larger value or at the start. Place the saved value into the gap. Each pass leaves a longer sorted prefix without losing or duplicating an entry.

For [4, 1, 3, 1], inserting the first 1 gives [1, 4, 3, 1] after one shift. Inserting 3 moves 4 once and gives [1, 3, 4, 1]. Inserting the final 1 moves 4 and 3, giving [1, 1, 3, 4]. There are four shifts in total.

Move a prefix value only when it is strictly larger than the saved one. The later 1 then stays after the earlier 1. Keeping equal keys in their original order is stability. The task-order practice uses labeled equal keys so that this property can be observed.`
			),
			assignment(
				"AJ7 Project 2: Insertion Sort",
				insertion.pack,
				`Implement sort to arrange the original int array in ascending order and return the number of shifts as a long. Save each value before shifting the prefix. Move larger values right into the gap and insert the saved value where it belongs. Count every value moved right and exclude writing the saved value into the final gap.

${workflow}

**Checkpoints:** [4, 1, 3, 1] gives [1, 1, 3, 4] and four shifts. [1, 2, 3, 4] has zero shifts. [4, 3, 2, 1] takes six shifts. Trace the saved value and gap at each step, then verify duplicates and negative values.`
			),
			reading(
				"Insertion Sort Big-O Analysis",
				`On a sorted nonempty array, every value after the first needs one comparison with the value immediately before it and zero shifts. The total is n − 1 value comparisons and linear time. On a strictly decreasing array, each inserted value must move past every earlier value. The shift count is 1 + 2 + … + (n − 1), which grows quadratically. The algorithm uses constant auxiliary space for its saved value, positions and counter.

Compare [1, 2, 4, 3] to [4, 3, 2, 1]. The first takes one shift, when 3 crosses 4. The second takes six. Selection sort makes six candidate comparisons on both arrays. Name the unit being counted before comparing the figures. The optional inversion task connects insertion shifts to relationships in the input.`
			)
		],
		supplementalProjects: [
			assignment(
				"AJ7 Supplemental Project 1: Biggest to Smallest Bookshelf",
				bookshelf.pack,
				`Return a separate ArrayList of book records in descending page-count order. Select the first largest book remaining, append that record, and remove it from the working copy. Avoid separating page counts from their titles. On a tie, keep the earlier book first. Leave the caller's list intact.

${workflow}

**Checkpoints:** Reef (180), Drift (250), Current (180) and Jetty (90) produce Drift, Reef, Current, Jetty. Verify an empty list and two books with the same page count. Explain how choosing the first largest entry makes the ties predictable.`
			),
			assignment(
				"Elementary Sorting Transfer Practice",
				tasks.pack,
				`Order task records by ascending priority using insertion sort on a copy. Keep labels attached to priorities. Shift an earlier task only if its priority is strictly greater than the saved task's priority. Return a separate array and keep the input in its original order.

${workflow}

**Checkpoints:** upload (2), review (1), archive (2) gives review, upload, archive. Add a second group of tied records with a different priority. Explain why changing the condition to greater-than-or-equal can reorder tied labels.`
			),
			assignment(
				"Elementary Sorting Extension Practice",
				inversions.pack,
				`Count all pairs of indices i < j whose values satisfy values[i] > values[j]. Each such pair is an inversion. Use a long count and leave the array unchanged. A repeated value paired with an equal value contributes zero.

${workflow}

**Checkpoints:** [4, 1, 3, 1] has four inversions and [1, 1, 3, 4] has none. Identify the four pairs by index. In insertion sort, each shift resolves one such pair. Explain why this pair scanner still performs quadratic work even when it finds no inversions.`
			)
		]
	};
}

export function buildJavaMergeSortingModule(): RawCourseModule {
	const [merge, split, sort, trace, union] = javaMergeSortingProjects;
	return {
		id: javaMergeSortingModuleID,
		title: "AJ9 Merge Sort",
		curriculum: [
			reading(
				"Merge Sort",
				`Merge sort is a divide-and-conquer algorithm. It splits a range into two disjoint halves, sorts each half, and combines their results. With zero or one value, the range is already sorted. The split works on unsorted data. The merge requires two sorted inputs.

For [4, −3, 8, 4, 2], split into [4, −3] and [8, 4, 2]. The first half sorts to [−3, 4]. Splitting the second leaves [8] and [4, 2], which merges to [2, 4, 8]. Merge the two sorted halves to obtain [−3, 2, 4, 4, 8]. Each result contains all the original values, including both 4s.

The merge cursor points at the smallest remaining value on each side. Copy the smaller one and advance only that side. On a tie, pick the left value first. When one side ends, copy the rest of the other. This keeps both inputs intact and performs linear work in their combined lengths.`,
				{
					id: `${javaMergeSortingModuleID}-curriculum-merge-sort-core-concepts`,
					aliases: [
						"core-concepts",
						`${javaMergeSortingModuleID}-curriculum-core-concepts`
					]
				}
			),
			assignment(
				"AJ9 Project 1: Merge Method",
				merge.pack,
				`Implement merge for two ascending int arrays. Return a new ascending array of their combined length. Keep a cursor for each input and one write position. Copy the smaller current value and move only that cursor. Prefer the left on ties and append the remaining values when one side ends. Keep both inputs unchanged.

${workflow}

**Checkpoints:** [−2, 1, 5] and [1, 2, 7, 9] merge to [−2, 1, 1, 2, 5, 7, 9]. Try each side empty, both sides empty and uneven lengths. Record the first three cursor decisions and show when the remaining tail is copied.`
			),
			assignment(
				"AJ9 Project 2: Split Method",
				split.pack,
				`Implement split over the half-open range [start, end). An empty range produces no value leaf. A one-value range emits a singleton. Otherwise compute the midpoint, recurse on [start, midpoint), then on [midpoint, end). Keep the collected leaves in that order.

${workflow}

**Checkpoints:** [−1, 8, 3, 8, 0] gives [[−1], [8], [3], [8], [0]]. Draw the split tree for this odd-length input. Show that the sibling ranges share no positions and together cover the parent. Verify zero, one and two input values.`
			),
			assignment(
				"AJ9 Project 3: Merge Sort",
				sort.pack,
				`Use the provided cursor merge to build sort. For zero or one value, return a copy. Otherwise split the int array, recursively sort each half, and merge their returned arrays. The result is a new ascending array. Keep the original input and preserve duplicates.

${workflow}

**Checkpoints:** [4, −3, 8, 4, 2] becomes [−3, 2, 4, 4, 8]. Use a copy sorted with Arrays.sort as an independent check for random, reversed, already ordered and duplicate-heavy data. Show where the algorithm stops recursing on an odd-length input.`
			),
			reading(
				"Merge Sort Big-O Analysis",
				`For eight values, the split sizes are 8 → two 4s → four 2s → eight 1s. Merging reverses those levels. At each merge level, every value is written into a result once, so the total work per level is linear. The number of levels grows logarithmically, giving Θ(n log n) time for the supplied implementation.

At a merge with m and n values, there are at most m + n − 1 key comparisons if both sides are nonempty and m + n output writes. Using head indexes supports this count. Removing the first entry of an ArrayList shifts later entries and adds work. The supplied sort allocates temporary arrays. It allocates Θ(n log n) array capacity over all levels, uses O(n) peak auxiliary array storage when earlier temporaries are no longer needed, and uses O(log n) recursive stack frames.

For input size 16, count the split levels and the total number of value writes in the merge layers. Identify one cost that the time-growth formula does not state, such as the number of live arrays or actual elapsed time.`
			)
		],
		supplementalProjects: [
			assignment(
				"Merge Sort: Extension Challenge",
				merge.pack,
				`Reopen the saved merge workspace. Implement mergeEntries over sorted arrays of records with numeric keys and labels. Compare only the keys. On equality, copy the record from the left input first. This keeps the order of equal keys from an earlier contiguous half. Use the same cursor invariants as in the integer method.

Compile the saved sources and run java ContractTests stable, then java Main stable. The two example labels appear as [left, right]. Add a case with two tied labels on the same side and a tie from the other side. State which source ordering each label demonstrates and verify that neither input was changed.`
			),
			assignment(
				"Merge Sort Trace Practice",
				trace.pack,
				`Trace a split by recording each nonempty half-open range in call-entry order. Record the parent before visiting its left and right children. Stop after recording singleton ranges. An empty input produces an empty trace. Reject a negative size.

${workflow}

**Checkpoints:** For length 3, expect [0,3), [0,1), [1,3), [1,2), [2,3). Sketch the tree for length 5. Count its singleton and internal ranges and explain why a range of length 1 creates no children.`
			),
			assignment(
				"Merge Sort Extension Practice",
				union.pack,
				`Merge two ascending attendance-ID arrays into one ascending list of distinct IDs. Use two cursors to visit the IDs in order. Write the next candidate when the result is empty or differs from the last written ID. Keep both inputs and return only the filled part of the result buffer.

${workflow}

**Checkpoints:** [1, 1, 4, 8] and [1, 2, 8, 9] give [1, 2, 4, 8, 9]. Check duplicates within one side, both sides empty, and Integer.MIN_VALUE as a valid ID. Explain why comparing with the last written ID is sufficient when both lists are ascending.`
			)
		]
	};
}
