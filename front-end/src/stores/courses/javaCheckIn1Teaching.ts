import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaCheckIn1ModuleID,
	javaCheckIn1Projects,
	javaCheckIn1URL
} from "@/modules/javaSearchResources";

const workflow = `Open the starter in the site IDE and confirm the import. **Run** displays the Java 21 commands. Save the attempt, download its ZIP and open a terminal in the extracted project.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The starter compiles. The checks identify the first unfinished method until its contract is implemented. Compile each project in its own folder.`;

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
	pack: (typeof javaCheckIn1Projects)[number]["pack"],
	content: string,
	identity?: Pick<RawCourseModuleItem, "id" | "aliases">
): RawCourseModuleItem {
	return {
		...identity,
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaCheckIn1URL(pack, "starter"),
		solutionLink: javaCheckIn1URL(pack, "solution")
	};
}

export function buildJavaCheckIn1Module(): RawCourseModule {
	const [workbook, benchmark, boundary, loopCount] = javaCheckIn1Projects;
	return {
		id: javaCheckIn1ModuleID,
		title: "Check-In #1",
		curriculum: [
			{
				...reading(
					"Check-In #1 Overview",
					"Start with one search target and predict its result and stopping condition. Then work through the recursion, growth and search traces before running the workbook. Use the separate timing project to compare the searches on identical inputs."
				),
				id: `${javaCheckIn1ModuleID}-curriculum-java-level-3-check-in-1-overview`
			},
			assignment(
				"Check-In #1 Workbook",
				workbook.pack,
				`Complete the workbook by explaining and tracing recursion, classifying growth expressions, and implementing a linear scan plus both binary-search variants. The next four readings give the inputs, result contracts and trace prompts. Record a returned or printed value, the stopping condition, and one case that tests a boundary for each unfinished algorithm.

${workflow}

Use java Main trace to check the order of printed values in the supplied recursive traversal after making a prediction. Keep the workbook attempt for the optional Pascal cache extension.`,
				{
					id: workbook.id,
					aliases: [
						`${javaCheckIn1ModuleID}-curriculum-core-concepts`,
						`${javaCheckIn1ModuleID}-curriculum-core-concepts-and-learning-sequence`
					]
				}
			),
			reading(
				"Check-In #1: Recursion",
				`A recursive method needs a result it can return immediately in a base case and a smaller input for every other call. For string length without calling length in the method, check whether the remaining string is empty. Otherwise count its first UTF-16 unit and add the answer for the remaining suffix. For "cat", the calls see "cat", "at", "t" and "". The answers return as 0, 1, 2 and 3. The exercise uses short strings because repeated suffix copying can take quadratic work.

In Pascal's triangle, row 0, column 0 is 1. A column below 0 or above its row contributes 0. Every other entry adds the two parents at (row − 1, column − 1) and (row − 1, column). At row 4, column 2, the two parents are both 3, so the result is 6. The workbook uses rows 0 through 20.

The supplied traversal records its input when it enters. If the input exceeds 2, it fully visits n − 1 before visiting n − 2. Start at 5 and write the outputs in call-entry order. Then compare the prediction with java Main trace. Mark both the condition that stops recursion and the line that records a value.`
			),
			reading(
				"Check-In #1: Time Complexity",
				`Name the operation being counted before assigning a growth class. For the expression 25n² + 20n + 15n³, n³ dominates for large n. Classify log(n) + sqrt(n) by comparing its two terms. For 1 × 2 × … × n, distinguish the factorial value from the linear number of multiplications in a simple product loop.

1. A scan returns as soon as it sees −1. Count comparisons with −1 at the first position, at the last position and absent. Use input length for n.
2. An outer loop runs n times, a middle loop runs floor(n / 4) times per outer iteration, and the innermost body runs twice per middle iteration. For n = 8, there are 8 × 2 × 2 = 32 body executions. Write the formula and its growth.
3. Recursion on integer n / 2 stops at zero. Starting at 8, it visits 8, 4, 2, 1 and 0. The number of calls grows logarithmically with the starting value.

Prepare a short reason for each class. Explain why doubling n doubles the worst-case scan, adds about one halving step, and can produce about four times as many body executions in the nested loops.`
			),
			reading(
				"Check-In #1: Linear Search",
				`Implement linearContains for an int array in any order. Compare the target with each element in order. Return true at the first equal value. Return false after the loop ends, including when the input is empty. A false return inside the loop would treat the first mismatch as proof that the target never occurs.

With [9, 2, 8], target 2 takes two equality comparisons and returns true. Target 3 takes three and returns false. A match at the first item takes one comparison. A miss or a match at the last item takes n in an n-item array. Check that the method leaves the input unchanged; explain when a scan is useful without a sortedness guarantee.`
			),
			reading(
				"Check-In #1: Binary Search",
				`Implement binaryIndex with a loop and binaryRange with recursion. Both expect ascending input and return a matching zero-based index or −1. Start with inclusive bounds 0 and length − 1. Treat lower > upper as the missing base case. Otherwise compute lower + (upper − lower) / 2. After a miss, discard the midpoint and the half known to be wrong. The recursive method returns the result of searching the smaller range.

For [2, 4, 8, 16] and target 7, the first probe finds 4 at index 1 and leaves [2, 3]. The next finds 8 at index 2 and leaves [2, 1]. Return −1. Run both versions with targets 2 and 16 and an empty input. Explain the single-probe best case and logarithmic worst case using the number of candidates left.`
			),
			assignment(
				"Check-In #1: Additional Practice Project",
				benchmark.pack,
				`Compare linear and binary search on the same sorted array and the same target list. The supplied workload contains 2,000 queries per round, half guaranteed hits and half guaranteed misses. Build measure to visit each query once in order, count positive results, and report elapsed nanoseconds from System.nanoTime. Exclude data generation, sorting and printing from the measured loop.

${workflow}

Warm both algorithms, alternate their order across four rounds and report mean milliseconds. Counts must agree. Timing values will vary across runs. Explain what the measurement shows for this workload and how including a one-time sort changes the comparison for one query or many queries.`
			)
		],
		supplementalProjects: [
			assignment(
				"Check In #1: Extension Challenge",
				workbook.pack,
				`Reopen the saved workbook. Compute Pascal entries with a zero-filled table that records positive results as they are first calculated. Check invalid columns before accessing the table. Return a stored result when another branch reaches the same entry. Keep the uncached pascal method for comparison.

Compile the saved sources and run java ContractTests memo, then java Main memo. Row 10, column 5 gives 252. Show which subproblem can be reached through two paths. Explain the tradeoff between avoiding repeated calls and storing an additional table.

**Checkpoint:** Confirm that row 10, column 0 gives 1 and column 11 gives 0. Run a second request for (10, 5) using the same table and show where it returns the stored 252.`
			),
			assignment(
				"Review Checkpoint Transfer Practice",
				boundary.pack,
				`A trial history contains false values followed by true values, with either group possibly empty. Implement firstPassing to return the index of the first true or −1 when no trial passes. Keep the candidates in a half-open range [lower, upper). A true midpoint can itself be the first pass, so make it the new upper boundary. After a false midpoint, advance lower past it.

${workflow}

For [false, false, true, true], expect 2. Show the remaining bounds when index 2 first passes. Check an empty history, an all-false history and one starting with true. Explain why a history that goes from true back to false fails the input guarantee.`
			),
			assignment(
				"Review Checkpoint Extension Practice",
				loopCount.pack,
				`Implement visits to return the number of times the innermost body runs for a nonnegative size. The three loop counts are n, floor(n / 4) and 2. Use long arithmetic and reject negative sizes with IllegalArgumentException.

${workflow}

Check 3 → 0, 4 → 8 and 8 → 32. The harness compares the formula with an actual loop for small sizes. Explain why the original loops take quadratic work as n grows while the formula uses a fixed number of arithmetic operations.`
			)
		]
	};
}
