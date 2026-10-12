// Verified standalone source roles and the six existing progress identities.
export const silverFoundationPacks = [
	{
		slug: "records",
		folder: "US4-Exam-and-Bank-Account-Classes",
		entryClass: "Main",
		title: "Class Keys, Ordering, and Record Modeling",
		input: null,
		output: "answer.txt",
		purpose:
			"Required implementation checkpoint for structured records, comparison keys and safe integer ordering. State what each record represents and distinguish its ordering rule from equality and membership. Complete the maps/sets unit requirements below as well.",
		retry: "Close the reference. In a copy, give exams scores -2147483648, 0, 2147483647 and 0; predict the order from (score, name). Give accounts those same balances and predict descending balance with ascending names on ties. Keep all four objects and verify both comparison directions. Then reverse only the primary-key direction and prepare a new expected file before changing either comparator. Repeating the original sample does not complete this optional retry.",
		requirements:
			"To finish Unit 1, also choose arrays, sets and maps from the required operations, trace membership and frequency updates, and justify the representation independently of its algorithm. For scores [5,5,-2,5,-2], the distinct set has two values and the frequency map has 5→3 and -2→2. A set records presence; a map records the value associated with each key. Decrementing the last occurrence must remove that frequency entry when zero means absent. An array indexed directly by score needs a known bounded nonnegative range or an explicit offset; it cannot directly index these negative or extreme scores. Java HashMap/HashSet use equals and hashCode for key identity, whereas Comparable specifies ordering. Equal ordering keys alone do not define object equality. Explain duplicate-key replacement, an absent-key lookup and how changing a hashed field while it is stored can break lookup. Retain an operation-by-operation trace and a separate membership/counting implementation; this class-ordering demonstration is one checkpoint within that work.",
		revision: "8891c9ffbb61f101edb01d18cfbcba75905de141",
		mainFile: "Main.java",
		guard: 'if rm -rf target/classes \\\n    && mkdir -p target/classes \\\n    && javac --release 17 -encoding UTF-8 -Xlint:all -Werror -d target/classes Main.java \\\n    && java -cp target/classes Main > answer.new \\\n    && diff -u sample.expected answer.new; then\n    mv answer.new answer.txt\nelse\n    status=$?\n    rm -f answer.new\n    exit "$status"\nfi',
		assignments: [
			{
				itemId: "usaco-silver-unit-1-maps-sets-and-problem-modeling-curriculum-core-project-data-structures-and-problem-modeling",
				moduleId: "usaco-silver-unit-1-maps-sets-and-problem-modeling",
				moduleTitle: "Unit 1: Maps, Sets, and Problem Modeling",
				section: "curriculum",
				variant: "core",
				learningPath: "core",
				title: "Core Project: Class Keys, Ordering, and Record Modeling"
			},
			{
				itemId: "usaco-silver-unit-1-maps-sets-and-problem-modeling-supplemental-problem-exam-and-bankaccount-classes",
				moduleId: "usaco-silver-unit-1-maps-sets-and-problem-modeling",
				moduleTitle: "Unit 1: Maps, Sets, and Problem Modeling",
				section: "supplementalProjects",
				variant: "retry",
				learningPath: "choice",
				title: "Class Ordering: Ties and Integer-Limit Retry"
			}
		],
		contract:
			"This is a Java class-ordering demonstration with no input file or standard input. It sorts the four supplied Exam objects by increasing score, then increasing name for a score tie. It sorts the four BankAccount objects by decreasing balance, then increasing name for a balance tie. Names are non-null strings and use Java's case-sensitive String.compareTo order. Scores and balances are Java int values, including negative values, Integer.MIN_VALUE and Integer.MAX_VALUE. They are demonstration fields, not a specification of a financial account system.\n\nA successful run prints exactly two lines: the sorted exam list and the sorted account array. Each object's supplied toString controls the displayed name and numeric field. The included sample.expected contains the exact output for the unmodified demonstration data. A different legal data set needs its own predicted output.",
		prediction:
			"Exam demonstration: Abdi has score 95, Beyonce 100, Camila 87 and Diego 87. Increasing (score, name) gives Camila, Diego, Abdi, Beyonce.\n\nBankAccount demonstration: Emilia has balance 1000, Farooq 1050, Gabrielle 1200 and Hassan 1050. Decreasing balance with increasing names on ties gives Gabrielle, Farooq, Hassan, Emilia.\n\nCamila and Diego have equal scores, so their names decide their relative order. Farooq and Hassan have equal balances, so their names decide that tie. For an exam with score -2147483648 and another with score 2147483647, the first belongs earlier. Subtracting those scores overflows an int and can reverse the comparison. For accounts, the greater balance belongs earlier, including at these same limits.",
		tasks: "1. Predict both complete output lines before running. Mark the primary key, direction and tie rule separately.\n2. Complete Exam.compareTo in the learner: increasing score followed by increasing name. A negative result means this exam comes before the other; zero means their ordering keys are equal. Only the sign matters.\n3. Complete Main.compareBankAccounts in the learner: decreasing balance followed by increasing name. Keep the name direction increasing when the balance direction reverses. Use an overflow-safe numeric comparison such as Integer.compare rather than subtracting int fields.\n4. Retain the constructors, display methods, supplied data and two sort calls. The unfinished methods throw named task exceptions; the unchanged learner exits 2 and prints no result.\n5. Record a tied-value prediction and an integer-limit prediction, then implement and compare those results. Keep the learner attempt before inspecting the separate reference.\n\nThe reference uses Exam's natural Comparable ordering for Collections.sort and an inline comparator for Arrays.sort on BankAccount. The learner names the bank comparison method so each task is visible. Both forms specify the same ordering contract. This lesson teaches object keys and comparator contracts; later algorithm lessons can apply those keys when implementing their own sorting algorithms.",
		checks: "For each result, verify every neighboring pair follows the primary key and then the tie key. Count objects before and after sorting to ensure none were removed or duplicated. Compare equal-key objects in both directions: both comparisons must have sign zero. For unequal keys, swapping the objects must reverse the comparison's sign.\n\nTest equal scores, equal balances, equal names, already sorted and reversed data. Then replace numeric demonstration values in a copy with -1, 0, 1, Integer.MIN_VALUE and Integer.MAX_VALUE. Predict exam order using the pair (score, name), and account order using (-balance, name) in an independent model with unbounded integers. Do not negate Integer.MIN_VALUE in Java as a substitute for a safe comparison.\n\nFor an instructor walkthrough, stop after the prediction, trace one tied comparison, inspect one overflow example, and then run each completed task. The same steps form a standalone reading and implementation sequence. Optional practice can add a third tie key or reverse one direction; state the changed contract and expected order before editing."
	},
	{
		slug: "milk3",
		folder: "US6-Mothers-Milk",
		entryClass: "milk3",
		title: "Mother's Milk: State Graphs and Reachability",
		input: "milk3.in",
		output: "milk3.out",
		purpose:
			"Required implementation checkpoint for translating a non-graph story into a finite graph. Define all three bucket volumes, generate legal edges, prevent cycles and prove exhaustive reachability.",
		retry: "Close the reference and change the capacities to 4 6 7. Predict the full answer before searching: 1 2 3 4 5 6 7. Independently enumerate the 17 reachable states, compare a queue and a stack, and explain why they collect the same qualifying C amounts. Trace a zero-transfer pour and a repeated state. Then try 20 20 20, predicting 0 20. Retain both predictions, one corrected state trace and the reason a key containing only C can merge states with different next moves. Repeating the original sample does not complete this optional retry.",
		requirements:
			"To finish Unit 2, also construct fixed graphs and grids, distinguish DFS reachability from BFS minimum edge count on unweighted graphs, and work through components, flood fill, trees and functional graphs. In the graph with undirected edges 0–1, 1–2 and 0–2, BFS from 0 gives distances 0,1,1; a DFS path through 1 can reach 2 in two edges without proving that path is shortest. A grid flood fill uses legal neighboring cells as edges and marks a cell when queued. In a tree, record the parent and avoid returning along that edge; for a general graph, use visited states as well. In a functional graph each node has one outgoing edge, so a repeated node in the current walk identifies a cycle, while joining an already finished walk does not create a new cycle. Build and trace a small example of each model, justify each stopping rule, and retain an independent check. The bucket problem asks for reachable volumes and does not assign minimum-pour distances.",
		revision: "8891c9ffbb61f101edb01d18cfbcba75905de141",
		mainFile: "Main.java",
		guard: 'task_classes="$(pwd)/target/classes"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif rm -rf target/classes \\\n    && mkdir -p target/classes \\\n    && javac --release 17 -encoding UTF-8 -Xlint:all -Werror -d target/classes Main.java \\\n    && cp milk3.in "$task_run/milk3.in" \\\n    && (cd "$task_run" && java -cp "$task_classes" milk3) \\\n    && diff -u sample.expected "$task_run/milk3.out" \\\n    && cp "$task_run/milk3.out" milk3.out.new \\\n    && mv milk3.out.new milk3.out; then\n    printf \'Verified milk3.out\\n\'\nelse\n    task_status=$?\n    rm -f milk3.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				itemId: "usaco-silver-unit-2-dfs-bfs-flood-fill-trees-and-functional-graphs-curriculum-core-project-dfs-bfs-and-graph-traversal",
				moduleId:
					"usaco-silver-unit-2-dfs-bfs-flood-fill-trees-and-functional-graphs",
				moduleTitle:
					"Unit 2: DFS, BFS, Flood Fill, Trees, and Functional Graphs",
				section: "curriculum",
				variant: "core",
				learningPath: "core",
				title: "Core Project: Mother's Milk: State Graphs and Reachability"
			},
			{
				itemId: "usaco-silver-unit-2-dfs-bfs-flood-fill-trees-and-functional-graphs-supplemental-problem-mothers-milk",
				moduleId:
					"usaco-silver-unit-2-dfs-bfs-flood-fill-trees-and-functional-graphs",
				moduleTitle:
					"Unit 2: DFS, BFS, Flood Fill, Trees, and Functional Graphs",
				section: "supplementalProjects",
				variant: "retry",
				learningPath: "choice",
				title: "Mother's Milk: Changed-Capacity Reconstruction"
			}
		],
		contract:
			"Three buckets have integer capacities A, B and C in 1..20. Initially A and B are empty and C is full: `(0, 0, C)`. A move pours from one bucket into a different bucket until the source is empty or the destination is full. Milk is never added or lost. Find every reachable amount in C at a state where A is empty.\n\nRead the three capacities from `milk3.in` in the process's working directory. Write the distinct possible C amounts in increasing order, separated by single spaces and followed by one newline, to `milk3.out`. Zero is a possible amount; do not omit it. This bounded teaching contract agrees with the preserved reference's 21-by-21-by-21 visited array. The historical USACO training statement is an additional resource and may require a training account; this guide supplies the complete working contract independently.\n\nEach state is the three current volumes, not the capacities and not just C. Volumes satisfy `0 <= volume[i] <= capacity[i]` and their sum is the initial C capacity. Two states with equal C but different A and B can allow different next pours. The supplied `Node.pour` copies its input state and moves `min(sourceVolume, destinationCapacity-destinationVolume)` units. It leaves the third bucket and the original Node unchanged.",
		prediction:
			"The included `milk3.in` is `8 9 10`. Its exact `sample.expected` is:\n\n```text\n1 2 8 9 10\n```\n\nStart at `(0,0,10)`, so 10 qualifies. C-to-B pours 9 and reaches `(0,9,1)`, so 1 qualifies. C-to-A then A-to-B reaches `(0,8,2)`, so 2 qualifies. A and B's capacities can also leave C at 8 or 9 with A empty. These examples establish possibilities, not completeness; graph exhaustion establishes that there are no others. An independent breadth-first enumeration reaches 12 different states for these capacities.\n\nBefore coding, trace every ordered source/destination pair from `(0,9,1)`. Identify the pairs that do not move milk and those that reach a previously visited state. For capacities `1 1 1`, predict `0 1`. For `20 20 20`, predict `0 20`. Do not assume all integers between the smallest and largest answer are reachable.",
		tasks: "1. Complete `milk3.reachableVolumes(int[] capacity)` in the separate learner. Begin with `(0,0,capacity[2])` and use a stack or queue to explore reachable states.\n2. Define the visited key from all three volumes. Mark when adding a state to the worklist, or explicitly skip already visited states when removing them, so cycles cannot expand indefinitely.\n3. Try all six ordered pours between distinct buckets with the supplied helper. A zero-transfer result is the same state and must not create another traversal task.\n4. Whenever A is zero, collect C into a distinct-answer set or another deduplicated collection. Return an ArrayList of those amounts; the supplied driver sorts it before writing.\n5. State the invariant: every discovered state is reachable, within capacity, and conserves the initial milk. Each newly discovered state is eventually explored. Explain why exhausting the worklist proves completeness.\n\nThe untouched learner throws `TASK: reachable bucket states`, exits 2 and never opens `milk3.out`. Parsing and capacity checks are supplied. The reference's historical DFS and Node helper remain unchanged. The driver does not establish that a returned answer is complete; the independent checks below are necessary.",
		checks: "Compare against a separately written small breadth-first model that represents states as immutable triples and enumerates all ordered pours. Include equal capacities, a bucket that holds all initial milk, unequal capacities, zero in the answer, the supplied example and the maximum capacity. Check that output is sorted and distinct, every answer is reachable with A empty, and no qualifying reachable state is omitted.\n\nTest the pour helper independently: volume sum and capacity bounds are preserved, the original state is unchanged, and a move stops at an empty source or a full destination. Swapping the names of initially empty A and B changes which bucket's emptiness is queried; do not assume the answer stays the same.\n\nFor an instructor walkthrough, pause after the state definition, trace two pours, identify a cycle, then justify visited handling before running. The same sequence works independently. Optional practice can replace DFS with BFS or change a capacity, predicting the complete new answer before execution. This is a finite-state search exercise, not a minimum-number-of-pours exercise; a shortest-path extension needs its own distance contract."
	},
	{
		slug: "pprime",
		folder: "US10-Prime-Palindromes",
		entryClass: "pprime",
		title: "Prime Palindromes: Structured Candidate Search",
		input: "pprime.in",
		output: "pprime.out",
		purpose:
			"Required implementation checkpoint for complete candidate generation, pruning justified by the contract, inclusive boundaries and independent checking. Explain both digit symmetry and the separate primality filter.",
		retry: "Close the reference. Predict 12..100 as an empty file, 99..111 as 101, and 121..131 as 131. Explain why candidate 121 is rejected and why 11 remains a prime even-length palindrome. For a two-digit helper call predict 11,33,55,77,99 before filtering. Trace a three-digit mirror with a middle zero and a four-digit mirror, then independently compare every small-range integer. Keep an endpoint prediction and a missing-candidate diagnosis separate from a wrong-primality diagnosis. Repeating the original sample does not complete this optional retry.",
		requirements:
			"To finish Unit 3, also implement custom ordering, two pointers, coordinate compression and binary search with a monotone predicate. Compress [50,-2,50,9] using distinct sorted coordinates [-2,9,50], giving ranks [2,0,2,1]; ranks preserve order, not original numeric distances. For sorted [1,2,2,4,7], there are two index pairs summing to 6: either 2 with 4. A two-pointer count must handle the duplicate 2s rather than counting only distinct values. For a sorted array, the predicate value>=target is monotone, so a first-true boundary can find the first qualifying position, including an empty range and a target beyond every element. State which half-open search interval still contains that boundary before every update. Primality over consecutive integers is not monotone, so it cannot serve as that binary-search predicate. Retain the representation, duplicate-count trace, boundary invariant and tiny independent oracle for each assigned method; the palindrome generator covers candidate search within this broader unit.",
		revision: "8891c9ffbb61f101edb01d18cfbcba75905de141",
		mainFile: "Main.java",
		guard: 'task_classes="$(pwd)/target/classes"\ntask_run=$(mktemp -d) || exit 1\ntrap \'rm -rf "$task_run"\' EXIT\nif rm -rf target/classes \\\n    && mkdir -p target/classes \\\n    && javac --release 17 -encoding UTF-8 -Xlint:all -Werror -d target/classes Main.java \\\n    && cp pprime.in "$task_run/pprime.in" \\\n    && (cd "$task_run" && java -cp "$task_classes" pprime) \\\n    && diff -u sample.expected "$task_run/pprime.out" \\\n    && cp "$task_run/pprime.out" pprime.out.new \\\n    && mv pprime.out.new pprime.out; then\n    printf \'Verified pprime.out\\n\'\nelse\n    task_status=$?\n    rm -f pprime.out.new\n    exit "$task_status"\nfi',
		assignments: [
			{
				itemId: "usaco-silver-unit-3-sorting-two-pointers-compression-and-binary-search-curriculum-core-project-sorting-searching-and-binary-search",
				moduleId:
					"usaco-silver-unit-3-sorting-two-pointers-compression-and-binary-search",
				moduleTitle:
					"Unit 3: Sorting, Two Pointers, Compression, and Binary Search",
				section: "curriculum",
				variant: "core",
				learningPath: "core",
				title: "Core Project: Prime Palindromes: Structured Candidate Search"
			},
			{
				itemId: "usaco-silver-unit-3-sorting-two-pointers-compression-and-binary-search-supplemental-problem-prime-palindromes",
				moduleId:
					"usaco-silver-unit-3-sorting-two-pointers-compression-and-binary-search",
				moduleTitle:
					"Unit 3: Sorting, Two Pointers, Compression, and Binary Search",
				section: "supplementalProjects",
				variant: "retry",
				learningPath: "choice",
				title: "Prime Palindromes: Boundary and Candidate Retry"
			}
		],
		contract:
			"Read two integer bounds from `pprime.in`, with `5 <= lower <= upper <= 100000000`. Print every prime decimal palindrome in the inclusive interval, in increasing order, one number per line in `pprime.out`. An empty result is an empty output file. A prime is an integer at least 2 with no divisor other than 1 and itself; a decimal palindrome has the same digits in reverse order, without leading zeroes.\n\nThe preserved reference generates candidates with one through eight digits and an odd leading digit, then filters by the bounds and primality. These are odd-valued palindromes, not only odd-length palindromes. Every relevant prime is odd because the interval starts at 5. The only nine-digit value permitted by the upper bound is 100000000, which is not a palindrome. Thus these candidates cover the whole legal interval. The historical training statement is an additional account-dependent resource; this guide includes the complete working contract independently.\n\nFor `generatePalindromes(digits)`, where digits is in 1..8, return every odd-valued palindrome with exactly that many digits, once each and in increasing order. Include candidates such as 1 and 99 even though they are not prime; the separate filter handles primality and the requested interval. A digit-length call outside 1..8 is outside this helper contract.",
		prediction:
			"The included `pprime.in` is `5 500`. Its exact output is:\n\n```text\n5\n7\n11\n101\n131\n151\n181\n191\n313\n353\n373\n383\n```\n\nFor three digits, seed 13 mirrors to 131 by appending the first digit; for four digits, seed 13 mirrors to 1331 by appending both seed digits in reverse. Do not duplicate the middle digit of an odd-length palindrome. The leading digit must be nonzero. An even leading digit produces an even palindrome that cannot be a prime in this interval.\n\nPredict these inclusive boundary cases before running: `5 5` gives 5; `11 11` gives 11; `12 100` gives an empty file. Although every even-length decimal palindrome is divisible by 11, 11 itself is prime. The learner helper contract still asks for all odd-valued candidates at each length; filtering or an explicitly changed extension may apply that observation afterward.",
		tasks: "1. Complete the separate learner's `pprime.generatePalindromes(int digits)`. Choose nested digit loops or enumerate valid half-seeds and mirror them. Keep exactly the requested digit length.\n2. For odd lengths, mirror all seed digits except the middle one. For even lengths, mirror the whole seed. Preserve zeroes inside the number; forbid a leading zero.\n3. Generate candidates in increasing order and without duplicates. The supplied driver visits increasing digit lengths, so its combined candidate order is also increasing.\n4. Retain the supplied `isPrime` helper and inclusive bound checks. The helper correctly rejects 0, 1 and negative integers. It tests divisors through the square root; it is not a palindrome generator.\n5. Explain why candidate generation avoids checking every integer up to one hundred million. For length d there are `5 * 10^(ceil(d/2)-1)` candidates under this contract; the eight calls produce 11110 candidates in total.\n\nThe untouched learner throws `TASK: palindrome generation`, exits 2 and never opens `pprime.out`. The reference generator and accepted primality helper remain unchanged. The driver cannot prove that a returned candidate list is exhaustive, so the checks below are required.",
		checks: "For small intervals, enumerate every integer independently, reverse its decimal digits, and test divisibility. Compare the full ordered result, including empty intervals and both endpoints. For each helper length check the candidate count, exact digit length, odd value, decimal symmetry, distinctness and increasing order. At small lengths, compare against direct enumeration rather than another copy of the generator.\n\nCheck a range crossing a digit-length boundary, 11, repeated middle zeroes, prime squares such as 121, and the largest allowed interval. Use a separately generated candidate set and independently computed prime divisors for the full interval. Distinguish a missing candidate from a wrong primality result before changing the code.\n\nFor an instructor walkthrough, pause after the interval prediction, build one odd-length and one even-length mirror, check 11, then implement and run. The same steps are a standalone reading sequence. Optional practice can compare the historical nested-loop generator with a half-seed generator, or use a prime-divisor table; retain the same interval and output contract when comparing them. This is structured candidate search; binary search, two pointers and coordinate compression need separate activities if assigned in the surrounding unit."
	}
] as const;

export function silverFoundationAssignment(itemId: string) {
	for (const pack of silverFoundationPacks) {
		const assignment = pack.assignments.find(
			item => item.itemId === itemId
		);
		if (assignment) return { pack, assignment };
	}
}

export function silverFoundationNativeInstructions(
	current: NonNullable<ReturnType<typeof silverFoundationAssignment>>
) {
	const { pack } = current;
	return [
		"The site's Java teaching preview does not execute this native Java exercise. Save the attempt, download its ZIP and extract the complete role folder. Use JDK 17 or newer. Choosing Run displays these native instructions.",
		`Main.java contains the entry class ${pack.entryClass}; compile the filename and run that class. Retain README.md and sample.expected. Learner and reference use separate generated classes.`,
		pack.input
			? `Read ${pack.input} from the extracted working directory and write ${pack.output}. The browser Input panel does not replace ${pack.input}.`
			: "This demonstration reads no input file or standard input. The native guard compares the two displayed lines with sample.expected before replacing answer.txt.",
		"Run this shell guard from the extracted role folder. It rebuilds current classes and publishes only a successful matching result; an unfinished learner, failed compilation, missing entry class or wrong oracle preserves an earlier answer.",
		pack.guard,
		"The complete role README contains the same tested guard. Use a shell supporting this command, or follow its compile, run, compare and publish steps in another terminal, checking each exit status before continuing. The untouched learner exits 2; no answer file is created or replaced. After changing data, predict a separate expected file before replacing the comparison filename."
	];
}

export function silverFoundationCourseBrief(
	current: NonNullable<ReturnType<typeof silverFoundationAssignment>>
) {
	const { pack, assignment } = current;
	const native = silverFoundationNativeInstructions(current);
	return [
		`## ${assignment.title}`,
		assignment.variant === "core"
			? "**Learning sequence:** Required implementation checkpoint. Predict, define the representation, trace a small case, implement and retain an independent check before comparing the separate reference."
			: "**Learning sequence:** Optional changed-case reconstruction after the required checkpoint. Close the reference for this optional practice; predict new results and retain a fresh attempt and a mismatch explanation.",
		assignment.variant === "core"
			? pack.purpose
			: pack.purpose.replace(
					"Required implementation checkpoint",
					"Optional changed-case practice"
				),
		"Existing saved attempts retain their source, inputs, notes and timestamps. The confirmed native Java import saves separately from an earlier C++ attempt. Required and optional progress entries remain distinct; learner and reference have separate saved roles.",
		"## Contract and reasoning",
		pack.contract,
		"## Guided implementation",
		pack.prediction,
		pack.tasks,
		"## Check and explain",
		pack.checks,
		assignment.variant === "core"
			? "Record two changed-case predictions, a tiny independent oracle and one explained discrepancy. A shared instructor walkthrough pauses at the same representation, trace and test steps."
			: pack.retry,
		"## Unit completion requirements",
		pack.requirements,
		"## Open, save and run",
		...native.slice(0, 4),
		`\`\`\`sh\n${pack.guard}\n\`\`\``,
		...native.slice(5),
		"Open the learner action and confirm the import before fetching files. Preserve an attempt and explanation before opening the separately saved reference. The supplied driver does not prove a completed learner algorithm is correct. Protected mocks and active contests start from empty files with reference browsing closed."
	].join("\n\n");
}
