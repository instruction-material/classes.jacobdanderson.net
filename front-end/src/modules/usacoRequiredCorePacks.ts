// Native source accepted independently; lesson IDs retain existing progress.
export const goldRequiredCorePacks = [
	{
		slug: "lasers",
		folder: "UG33-Lasers-and-Mirrors",
		revision: "706e67a67cc7ca4496359918ee01d84cb8fa246d",
		title: "Lasers and Mirrors: Line States and Fewest Turns",
		purpose:
			"Required advanced-graph checkpoint after tree and graph-state reasoning. Convert eligible posts to line states and minimize reflections, including a genuine unreachable result.",
		retry: "Change a direct path to an unreachable path, then add one useful post. Predict all three results before running, compare a tiny point-graph oracle and explain why coordinate distance is not the objective.",
		input: "lasers.in",
		output: "lasers.out",
		contract:
			"There are 1 to 100,000 distinct posts. Every coordinate is an integer from 0 through 1,000,000,000. Posts are distinct from the laser and barn. A mirror at a post changes a horizontal beam to a vertical beam, or the reverse. Leaving a post without a mirror allows straight travel through it. The initial beam may point along either axis.\n\nRead `lasers.in`: the first line contains `N xLaser yLaser xBarn yBarn`, followed by `N` post coordinate pairs. Write one integer to `lasers.out`: the minimum mirror count, or `-1` if the barn cannot be reached. A direct horizontal or vertical beam needs zero mirrors.\n\nThe official statement is [USACO Lasers and Mirrors](https://usaco.org/index.php?page=viewproblem2&cpid=671). The sample input is included in each role. The reference expected-output fixture is corrected to 1; its original blank answer is archived.",
		prediction:
			"```text\n4 0 0 7 2\n3 2\n0 2\n1 6\n3 0\n```\n\nExpected output:\n\n```text\n1\n```\n\nA mirror at `(0,2)` turns the beam from the laser's vertical line onto the barn's horizontal line. A post such as `(3,2)` can be passed without adding another mirror. The two endpoints share neither coordinate, so zero mirrors cannot solve this sample.\n\nBefore implementation, draw the laser lines, the barn lines and the line pair at each post. Count reflections rather than crossed posts or coordinate distance.",
		model: "Use separate identities for vertical and horizontal lines, even when their numeric coordinates are equal. The provided `xLine(x)` helper returns `-x-1`; `yLine(y)` returns `y`. Thus `xLine(0)` is `-1` and `yLine(0)` is `0`. The largest coordinate also fits this encoding in a Java `int`.\n\nEach post joins its vertical line to its horizontal line. Crossing that graph edge represents one reflection. Seed both lines through the laser at distance zero. Reaching either line through the barn completes a straight final segment without another reflection.\n\nBreadth-first search processes nondecreasing edge counts. Mark a line when first discovered so cycles and repeated coordinates do not repeat work. Each post contributes two adjacency entries; expected hashing time and storage are linear in the number of posts. A physical grid containing every possible coordinate would be much larger and is unnecessary.",
		tasks: "The supplied parser validates counts, coordinate bounds, distinct posts and trailing input. File reading, line encoding and writing are provided. `minimumMirrors(Input input)` remains unfinished.\n\n1. Build the two-way line adjacency lists from the posts.\n2. Add both initial line states with distance zero to a queue and distance map.\n3. Repeatedly remove a line, test the barn-line condition and discover its unvisited neighboring lines at one greater distance.\n4. Return `-1` when the queue is exhausted. Keep this result distinct from a reachable zero-mirror path.\n\nThe initial method throws an unfinished-task exception. It exits with status 2 and writes no new answer. A previously existing `lasers.out` is preserved. The starter contains no mirror-search implementation.",
		checks: "- For `1 0 0 1 1` with the only post `(2,2)`, neither initial line reaches any usable post. The answer is `-1`.\n- Move that post to `(0,1)`. The answer becomes `1`.\n- For endpoints `(0,0)` and `(0,5)` with an unrelated post `(9,9)`, the answer is `0`.\n- Repeated x coordinates and repeated y coordinates are valid when whole post locations remain distinct.\n- Include coordinates zero and one billion to check the line namespaces.\n- For a tiny input, construct a separate graph of actual points. Connect two points when they share a coordinate. The minimum number of straight segments minus one is the mirror count; an unreachable barn has answer `-1`. This model checks the line-state implementation using a different representation.\n\nA full-size construction can alternate posts `(1,0), (1,1), (2,1), (2,2), ...` and place the barn just beyond the final turn. Check the exact turn count and completion with 100,000 posts, using a native heap bound instead of a browser Java preview.\n\nWalkthrough checkpoints are the state identities, the two initial states, the first two queue layers, the exhausted-queue result and a changed-case prediction. Compare the complete reference only after recording the model and expected results.",
		build: "Use a native JDK 17 or newer. Enter the chosen `starter` or `solution` folder, with `Main.java` and `lasers.in` together. Compile only that role's `Main.java`.\n\nOn macOS or Linux:\n\n```sh\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java && java -ea -Xmx256m Main && cat lasers.out\n```\n\nIn PowerShell:\n\n```powershell\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java\nif ($LASTEXITCODE -eq 0) { java -ea -Xmx256m Main }\nif ($LASTEXITCODE -eq 0) { Get-Content -LiteralPath lasers.out }\n```\n\nAn unfinished learner exits 2, so the final display command is skipped. A completed sample run writes `1`. Save source edits separately from expected results, change the input deliberately, and recompute the expected answer before another run. The site workspace saves and exports native source. Run shows the native commands; execute them in the extracted role folder.",
		assignments: [
			{
				itemId: "usaco-gold-unit-5-tree-algorithms-euler-tours-and-advanced-graph-modeling-curriculum-core-project-advanced-graph-modeling-and-geometry-flavored-problems",
				moduleId:
					"usaco-gold-unit-5-tree-algorithms-euler-tours-and-advanced-graph-modeling",
				moduleTitle:
					"Unit 5: Tree Algorithms, Euler Tours, and Advanced Graph Modeling",
				section: "curriculum",
				variant: "core",
				learningPath: "core",
				title: "Core Project: Lasers and Mirrors"
			},
			{
				itemId: "usaco-gold-unit-5-tree-algorithms-euler-tours-and-advanced-graph-modeling-supplemental-problem-lasers-and-mirrors",
				moduleId:
					"usaco-gold-unit-5-tree-algorithms-euler-tours-and-advanced-graph-modeling",
				moduleTitle:
					"Unit 5: Tree Algorithms, Euler Tours, and Advanced Graph Modeling",
				section: "supplementalProjects",
				variant: "retry",
				learningPath: "choice",
				title: "Lasers and Mirrors: Changed-Case Retry"
			}
		]
	},
	{
		slug: "poetry",
		folder: "UG28-Cow-Poetry",
		revision: "706e67a67cc7ca4496359918ee01d84cb8fa246d",
		title: "Cow Poetry: Ordered Lines and Rhyme Groups",
		purpose:
			"Required advanced-DP and combinatorics checkpoint. Connect ordered syllable states, final rhyme classes and choices for repeated scheme letters. This is distinct from the unit's later bitmask-state topics.",
		retry: "Change AB to AA with two one-syllable words in separate classes, then merge their rhyme classes. Predict 4, 2 and 4, compare enumerated word choices and explain why different letters may share a class.",
		input: "poetry.in",
		output: "poetry.out",
		contract:
			"Read `poetry.in`: `N M K`, then N pairs of syllable lengths and rhyme-class numbers, then M uppercase scheme letters. Bounds are N and K from 1 to 5000, M from 1 to 100000, word lengths from 1 to K, and class numbers from 1 to N. A word may be reused. Word identities and their order distinguish lines. Each line totals exactly K syllables. Equal scheme letters require equal final rhyme classes; different letters may use the same class. Write the poem count modulo 1000000007 to `poetry.out`.\n\nThe [official Cow Poetry contract](https://usaco.org/index.php?page=viewproblem2&cpid=897) defines the contest bounds. The maintained fixtures use the official sample. The previously supplied larger input and answer remain byte-for-byte in the historical fixture archive.",
		prediction:
			"```text\n3 3 10\n3 1\n4 1\n3 2\nA\nB\nA\n```\n\nExpected output:\n\n```text\n960\n```\n\nTreat the two length-three words as different word choices. There are eight complete lines ending in class 1 and four ending in class 2. The two A lines have 8*8 + 4*4 = 80 choices; the B line has 8 + 4 = 12. Their product is 960. Requiring B to use a different class would incorrectly discard poems.",
		model: "Let a prefix state count ordered word sequences at a syllable total. The empty sequence provides one way to reach total zero. Appending a word increases that total by its positive length, so smaller totals can be processed first. Iterate over word identities, even when lengths or classes coincide.\n\nSeparate the last word from its prefix to group complete-line counts by the last word's rhyme class. For each scheme letter, choose a class once and choose the required number of lines independently within that class. Sum these choices over classes, then multiply the results for different letters. Skip unused letters. A class with no complete lines contributes zero for a used letter.\n\nNormalize additions, multiplications and powers modulo 1000000007. Java long safely holds the product of two normalized residues. Repeated squaring avoids a loop for every exponent value. With N words, K syllables and at most 26 scheme letters, a direct plan uses O(N*K + M + 26*N*log M) time and O(N+K) extra state. The provided parser retains letter frequencies rather than all M letters.",
		tasks: "`Main.readInput(String)` provides bounds checks, arrays and zero-based rhyme-class indices. File reading and guarded writing are provided. `countPoems(Input input)` remains unfinished.\n\n1. Define the prefix-count state, its empty base case and ordered append transitions.\n2. Count complete lines by their final word's rhyme class.\n3. Combine each used scheme letter's choices and return a normalized result.\n\nFor a walkthrough, explain the empty sequence, trace totals three and four, derive the sample's ending counts and compare schemes AB and AA. Record predictions before opening the reference. The supplied learner contains no counting implementation. An untouched run exits with status 2 and writes no new answer; any existing answer is preserved.",
		checks: "- With one length-one word, K=1 and scheme AAA, there is one poem.\n- With two length-one words in different classes and K=1, AB gives 4 poems while AA gives 2.\n- With those words in the same class, AA gives 4 because both line choices remain independent.\n- With two length-two words and K=3, no complete line exists, so the answer is zero.\n- For tiny K, recursively enumerate actual sequences of word identities and tally their last classes. Enumerate poem line choices or calculate rhyme-group products from those independent tallies.\n- At N=K=5000 with every word of length 5000 and class 1, a scheme of 100000 A letters has answer 5000^100000 modulo the modulus. Splitting words equally between two classes changes it to twice 2500^100000 modulo the modulus. These constructions also exercise the actual advertised input limits.\n\nAlter syllable lengths, a final class and a repeated scheme letter separately. Explain each result before running. Save the learner attempt before comparison; a matching sample alone does not establish correctness.",
		build: "Use a native JDK 17 or newer. Keep this role's `Main.java` and `poetry.in` together, then enter that folder. Compile only this role. On macOS or Linux:\n\n```sh\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java && java -ea -Xmx256m Main && cat poetry.out\n```\n\nIn PowerShell:\n\n```powershell\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java\nif ($LASTEXITCODE -eq 0) { java -ea -Xmx256m Main }\nif ($LASTEXITCODE -eq 0) { Get-Content -LiteralPath poetry.out }\n```\n\nThe display command runs only after success. An old answer file is not evidence that an unfinished or failed run succeeded. The provided learner diagnoses missing or malformed input before writing. The reference expects contract-valid input and writes 960 for the sample. Preserve expected results separately, edit the input intentionally and save source changes before rerunning.\n\nThe site workspace saves and exports native Java source when the verified resource import is enabled. Its Java preview is not a complete JDK. Native source acceptance and actual site import/export acceptance are separate gates.",
		assignments: [
			{
				itemId: "usaco-gold-unit-6-advanced-dp-bitmask-state-and-combinatorics-curriculum-core-project-advanced-dp-and-combinatorics",
				moduleId:
					"usaco-gold-unit-6-advanced-dp-bitmask-state-and-combinatorics",
				moduleTitle:
					"Unit 6: Advanced DP, Bitmask State, and Combinatorics",
				section: "curriculum",
				variant: "core",
				learningPath: "core",
				title: "Core Project: Cow Poetry"
			},
			{
				itemId: "usaco-gold-unit-6-advanced-dp-bitmask-state-and-combinatorics-supplemental-problem-cow-poetry",
				moduleId:
					"usaco-gold-unit-6-advanced-dp-bitmask-state-and-combinatorics",
				moduleTitle:
					"Unit 6: Advanced DP, Bitmask State, and Combinatorics",
				section: "supplementalProjects",
				variant: "retry",
				learningPath: "choice",
				title: "Cow Poetry: Changed-Case Retry"
			}
		]
	},
	{
		slug: "radio",
		folder: "UG34-Radio-Contact",
		revision: "706e67a67cc7ca4496359918ee01d84cb8fa246d",
		title: "Radio Contact: Coordinating Two Fixed Paths",
		purpose:
			"Required capstone implementation checkpoint using two progress counters and squared destination energy. This is one capstone problem; completing it alone does not complete protected Gold sets, postmortems or Platinum readiness.",
		retry: "Compare simultaneous movement with one-at-a-time movement, then change one valid path. Enumerate all tiny schedules, explain the excluded initial energy and keep a written postmortem before a later fresh attempt.",
		input: "radio.in",
		output: "radio.out",
		contract:
			"Read `radio.in`: N and M, the first start x/y pair, the second start x/y pair, then direction strings of lengths N and M. N and M range from 1 to 1000. Directions are N, E, S and W. Every position, including every later path position, stays within coordinates 0 through 1000. Each tick advances the first traveler, the second traveler, or both, without changing either path's order. Charge squared Euclidean distance after the move, exclude initial-position energy, and stop when both paths finish. Write the minimum total to `radio.out`.\n\nThe [official Radio Contact contract](https://usaco.org/index.php?page=viewproblem2&cpid=598) specifies those bounds. The original sample fixtures remain available in both roles.",
		prediction:
			"```text\n2 7\n3 0\n5 0\nNN\nNWWWWWN\n```\n\nExpected output:\n\n```text\n28\n```\n\nBefore coding, list both position sequences, including their initial positions. Distinguish a position index from a wall-clock tick. Several ticks may pass while one index stays fixed. A completed path's traveler may remain at its final position while the other finishes.",
		model: "A state (i,j) means that i first-path moves and j second-path moves have finished. The coordinates at that state are already supplied in `Input.firstPath` and `Input.secondPath`. The provided `energy(input,i,j)` returns the squared distance using long arithmetic.\n\nInitialize the initial state's cost to zero. A noninitial state can come from a first-only move, a second-only move or a simultaneous move, whenever those predecessor indices exist. Add the energy at the destination state to a feasible predecessor cost. Processing increasing indices ensures each needed predecessor is available. A transition advancing neither index cannot improve a nonnegative-cost schedule and would create an unnecessary cycle.\n\nThe answer belongs at (N,M). Handle states on both axes: they describe one traveler moving while the other remains at its initial position. Do not charge the initial separation, substitute ordinary distance for squared distance, or charge both travelers separately for a simultaneous tick.\n\nA full table uses O(N*M) time and O(N*M) memory; a rolling-row extension can reduce memory after the full-table version is explained. At the official coordinate bounds, each tick costs at most 2000000. Advancing both travelers whenever possible finishes a prefix in max(i,j) ticks, bounding each optimal state by 2000000000. One candidate transition costs at most 2002000000, which still fits signed int. The preserved int reference is therefore valid for this contract; the learner uses long to make numeric intent explicit.",
		tasks: "The parser builds both position arrays and validates counts, direction lengths, letters, all positions and trailing input. The distance helper and file handling are provided. `minimumEnergy(Input input)` remains unfinished.\n\n1. Define the state values, feasible base cases and table evaluation order.\n2. Compare every legal predecessor, including axis states and simultaneous moves.\n3. Add destination energy and return the cost when both paths finish.\n\nFor a walkthrough, draw a small progress grid, trace its first row and column, and explain the three incoming transitions of an interior cell. Predict a changed path before comparing the completed reference. The supplied learner contains no schedule solver. An untouched run exits with status 2, writes no new answer and preserves any existing answer.",
		checks: "- Both travelers starting together and taking E have optimal cost zero.\n- Starting at (0,0) and (2,0), with paths E and W, gives zero by moving simultaneously.\n- Starting at (0,0) and (0,2), both taking E, gives 4. Charging initial energy would incorrectly increase it.\n- For tiny paths, enumerate every sequence of first-only, second-only and simultaneous moves that finishes both paths. Sum destination squared distances for each schedule and choose the minimum. This checks the table using an independent exhaustive model.\n- At length 1000, starts (0,0) and (1000,1000), paths E repeated 1000 and W repeated 1000 remain inside the contract. Compare the full table with a separate rolling-row oracle. A path moving east from x=1000 is invalid and cannot demonstrate an overflow defect.\n\nKeep changed-case predictions and expected results outside the program. Explain why waiting helps or hurts in each tiny case. Preserve the learner attempt before comparing the reference.",
		build: "Use a native JDK 17 or newer. Keep this role's `Main.java` and `radio.in` together, then enter that folder. Compile only this role. On macOS or Linux:\n\n```sh\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java && java -ea -Xmx256m Main && cat radio.out\n```\n\nIn PowerShell:\n\n```powershell\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java\nif ($LASTEXITCODE -eq 0) { java -ea -Xmx256m Main }\nif ($LASTEXITCODE -eq 0) { Get-Content -LiteralPath radio.out }\n```\n\nThe display command runs only after success. An old answer file does not establish that an unfinished or failed run succeeded. The provided learner rejects missing or malformed input before writing. The reference expects contract-valid input and writes 28 for the sample. Save source edits, preserve expected results separately and rerun after intentional input changes.\n\nThe site workspace saves and exports native Java source. Run shows native commands; execute them in the extracted role folder.",
		assignments: [
			{
				itemId: "usaco-gold-unit-7-protected-gold-sets-postmortems-and-platinum-readiness-curriculum-core-project-gold-capstone-sets",
				moduleId:
					"usaco-gold-unit-7-protected-gold-sets-postmortems-and-platinum-readiness",
				moduleTitle:
					"Unit 7: Protected Gold Sets, Postmortems, and Platinum Readiness",
				section: "curriculum",
				variant: "core",
				learningPath: "core",
				title: "Core Project: Radio Contact"
			},
			{
				itemId: "usaco-gold-unit-7-protected-gold-sets-postmortems-and-platinum-readiness-supplemental-problem-radio-contact",
				moduleId:
					"usaco-gold-unit-7-protected-gold-sets-postmortems-and-platinum-readiness",
				moduleTitle:
					"Unit 7: Protected Gold Sets, Postmortems, and Platinum Readiness",
				section: "supplementalProjects",
				variant: "retry",
				learningPath: "choice",
				title: "Radio Contact: Changed-Case Retry"
			}
		]
	}
] as const;

export function goldRequiredCoreAssignment(itemId: string) {
	for (const pack of goldRequiredCorePacks) {
		const assignment = pack.assignments.find(
			item => item.itemId === itemId
		);
		if (assignment) return { pack, assignment };
	}
}

export function requiredCoreNativeInstructions(
	current: NonNullable<ReturnType<typeof goldRequiredCoreAssignment>>
) {
	return [
		"The site's Java teaching preview does not execute this native Java exercise. Save the attempt, download its ZIP and extract it. Choosing Run displays native build instructions. The browser Input panel does not supply the input file. Use JDK 17 or newer inside the extracted role folder.",
		current.pack.build
	];
}

export function requiredCoreCourseBrief(
	current: NonNullable<ReturnType<typeof goldRequiredCoreAssignment>>
) {
	const { pack, assignment } = current;
	const sequence =
		assignment.variant === "core"
			? "**Learning sequence:** Required implementation checkpoint. Predict, explain the state, trace a tiny case, implement and save an attempt before consulting the separate reference."
			: "**Learning sequence:** This is optional practice after the required checkpoint. Close the reference, change the data and a boundary, then reconstruct the reasoning in a separately saved retry. Repeating the original sample does not complete this retry.";
	return [
		`## ${assignment.title}`,
		sequence,
		pack.purpose,
		"Keep older C++ attempts, code and notes. The confirmed Java import has a separate saved identity. Existing saved attempts keep their code, notes and timestamps. Required and retry entries keep their existing progress identities; learner and reference remain separate roles.",
		"## Contract and reasoning",
		pack.contract,
		pack.model,
		"## Guided implementation",
		pack.prediction,
		pack.tasks,
		"## Check and explain",
		pack.checks,
		assignment.variant === "retry"
			? pack.retry
			: "Record two changed-case predictions, an independent check and a mismatch explanation. An instructor walkthrough pauses at those same reasoning checkpoints.",
		"## Open, save and run",
		...requiredCoreNativeInstructions(current),
		"Open the learner resource and confirm the import before opening files. Preserve the learner attempt before comparison. The learner exits 2 while its algorithm is unfinished, creates no answer file and preserves any earlier answer. Input and result guards do not grade algorithm correctness. Protected mocks and active contests start from empty files and keep solution browsing closed."
	].join("\n\n");
}
