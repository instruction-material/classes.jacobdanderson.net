// Source roles and lesson identities were accepted independently before site activation.
export const goldSpanningIntervalPacks = [
	{
		slug: "superbull",
		folder: "UG15-Superbull",
		revision: "47262a7e6819ee20081a19716dd69fac1fe8e702",
		title: "Superbull: Maximum Elimination Score",
		itemId: "usaco-gold-optional-gold-problem-bank-supplemental-problem-superbull",
		legacyAnchor:
			"usaco-gold-optional-gold-problem-bank-usaco-gold-optional-gold-problem-bank-supplemental-problem-superbull",
		moduleTitle: "Unit 3: MSTs, DSU, and Connectivity Proofs",
		learningPath: "challenge",
		purpose:
			"Optional maximum-spanning-tree application after crossing-edge proofs. Superbull originated in February 2015 Silver; its Gold-course role is to compare maximization and legal elimination choices with minimum spanning trees.",
		input: "superbull.in",
		output: "superbull.out",
		contract:
			"Source contract: [USACO, February 2015 Silver, problem 3](https://usaco.org/index.php?page=viewproblem2&cpid=531).\n\nRead `superbull.in`. N is 1..2000. Read N distinct positive team IDs, each at most 2^30-1. A game scores the XOR of its IDs and eliminates one participant. Choose N-1 games ending with one survivor to maximize total points. Write one integer followed by a newline in `superbull.out`.",
		prediction:
			"The official sample included in this folder is:\n\n```text\n4\n3\n6\n9\n10\n```\n\nExpected `superbull.out`: `37`.\n\nThe sample permits 37 points. Games joining 3 to 9, 6 to 9, and 6 to 10 score 10, 15, and 12; choose eliminations consistent with a final survivor.",
		tasks: "1. Explain why a sequence of elimination games forms a spanning tree.\n2. Choose maximum XOR crossing edges, or negate weights consistently for a minimum-key formulation.\n3. Include each team once and update its best connection to the chosen set.\n4. Accumulate all selected game scores in long; a single team needs zero games.\n\nThe learner has four marked algorithm tasks and is deliberately unfinished. Untouched work exits 2 before opening an answer file. Parsing and result bounds are supplied; they do not grade optimality. For independent study or an instructor walkthrough, record a prediction, trace a small case, implement and save an attempt, then compare two changed inputs with an independent model. Consult the separate reference after an attempt and explain any discrepancy. Preserve the first implementation; a later retry uses different data, a boundary case and a closed reference.",
		model: "Each elimination game joins a removed team to a survivor, producing a tree. Conversely, removing tree leaves toward a root realizes any spanning tree as an elimination sequence. The maximum spanning tree therefore gives the greatest score. A dense Prim implementation stores each unchosen team's best edge to the chosen set, selects the greatest key, and updates keys with XOR. The historical reference negates XOR weights and selects the minimum key. Do not interpret these keys as shortest-path distances. Use long for the sum; every edge fits int but 1999 scores may not.\n\nO(N^2) time and O(N) auxiliary space without constructing every complete-graph edge.",
		build: 'Use JDK 17 or newer inside this role\'s working folder. These commands also work in PowerShell:\n\n```sh\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java &&\njava -ea -Xmx256m Main\ntask_course_status=$?\nif [ "$task_course_status" -eq 0 ]; then cat superbull.out; else printf \'Build or run failed with exit status %s\\n\' "$task_course_status"; fi\n```\n\nOn PowerShell:\n\n```powershell\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java\nif ($LASTEXITCODE -eq 0) {\n    java -ea -Xmx256m Main\n    if ($LASTEXITCODE -eq 0) { Get-Content superbull.out }\n    else { Write-Host "Run failed with exit status $LASTEXITCODE" }\n} else { Write-Host "Compilation failed with exit status $LASTEXITCODE" }\n```\n\nKeep `superbull.in` beside Main.java. Run Java only after a successful compilation. Check exit status first; read `superbull.out` only after success with `cat superbull.out` or `Get-Content superbull.out`. Run the file-based Java program natively after exporting its ZIP; the browser Input panel does not supply its input file. The unfinished learner, missing input and refused input preserve an earlier answer because computation and basic result validation precede opening output. The historical reference assumes complete valid contract input; a previous answer is not evidence of a successful run. Learner and reference are independent source roles and should be opened only after confirming the source import.',
		checks: "Independently enumerate the remaining-team subsets: for every possible game add its XOR score and choose either eliminated participant, then recurse. This models actual elimination choices rather than Prim. Cover a singleton, two teams, the official sample, changed distinct IDs and totals above 32-bit range. A full-size construction uses IDs 1..1999 plus 2^30-1. Every small ID has its uniquely greatest edge to that last team, so the forced star score is 1999*(2^30-1)-1999*2000/2."
	},
	{
		slug: "moocast",
		folder: "UG17-Moocast",
		revision: "47262a7e6819ee20081a19716dd69fac1fe8e702",
		title: "Moocast: Minimum Broadcast Power",
		itemId: "usaco-gold-unit-3-msts-dsu-and-connectivity-proofs-supplemental-problem-moocast",
		legacyAnchor:
			"usaco-gold-unit-3-msts-dsu-and-connectivity-proofs-usaco-gold-unit-3-msts-dsu-and-connectivity-proofs-supplemental-problem-moocast",
		moduleTitle: "Unit 3: MSTs, DSU, and Connectivity Proofs",
		learningPath: "choice",
		purpose:
			"Optional Gold connectivity application after dense Prim. Minimize the sufficient broadcast threshold, rather than the sum of selected edge lengths. Compare an MST cut argument with independent threshold connectivity.",
		input: "moocast.in",
		output: "moocast.out",
		contract:
			"Source contract: [USACO, December 2016 Gold, problem 1](https://usaco.org/index.php?page=viewproblem2&cpid=669).\n\nRead `moocast.in`. N is 1..1000. Read N coordinate pairs with both coordinates in 0..25000. Spending X enables every direct transmission whose squared distance is at most X. Relays are allowed. Find the minimum integer X that lets a broadcast reach all cows. Write one integer followed by a newline in `moocast.out`.",
		prediction:
			"The official sample included in this folder is:\n\n```text\n4\n1 3\n5 4\n7 2\n6 1\n```\n\nExpected `moocast.out`: `17`.\n\nThe official sample requires 17. At that threshold, edges between (1,3) and (5,4), between (5,4) and (6,1), and between (6,1) and (7,2) connect all cows. Any smaller threshold leaves the first cow isolated.",
		tasks: "1. Model an undirected edge by squared coordinate distance; no square root is needed.\n2. Connect every cow with minimum spanning-tree crossing-edge choices.\n3. Update the cheapest edge linking each unchosen cow to the chosen set.\n4. Return the greatest selected edge, rather than the sum; one cow needs zero power.\n\nThe learner has four marked algorithm tasks and is deliberately unfinished. Untouched work exits 2 before opening an answer file. Parsing and result bounds are supplied; they do not grade optimality. For independent study or an instructor walkthrough, record a prediction, trace a small case, implement and save an attempt, then compare two changed inputs with an independent model. Consult the separate reference after an attempt and explain any discrepancy. Preserve the first implementation; a later retry uses different data, a boundary case and a closed reference.",
		model: "For a fixed X, connectivity depends only on edges whose squared length is at most X. If a minimum spanning tree has greatest edge w, X=w connects every cow. A smaller X separates the cut crossed by a greatest required tree edge, so it cannot connect all cows. A dense Prim implementation keeps minimum crossing squared distances; the answer is their maximum as cows are chosen, not their sum. Differences are at most 25000 and a squared diagonal is at most 1250000000, so the documented edge values fit int. A singleton or entirely coincident cows has answer zero.\n\nO(N^2) time and O(N) auxiliary space without materializing every pair.",
		build: 'Use JDK 17 or newer inside this role\'s working folder. These commands also work in PowerShell:\n\n```sh\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java &&\njava -ea -Xmx256m Main\ntask_course_status=$?\nif [ "$task_course_status" -eq 0 ]; then cat moocast.out; else printf \'Build or run failed with exit status %s\\n\' "$task_course_status"; fi\n```\n\nOn PowerShell:\n\n```powershell\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java\nif ($LASTEXITCODE -eq 0) {\n    java -ea -Xmx256m Main\n    if ($LASTEXITCODE -eq 0) { Get-Content moocast.out }\n    else { Write-Host "Run failed with exit status $LASTEXITCODE" }\n} else { Write-Host "Compilation failed with exit status $LASTEXITCODE" }\n```\n\nKeep `moocast.in` beside Main.java. Run Java only after a successful compilation. Check exit status first; read `moocast.out` only after success with `cat moocast.out` or `Get-Content moocast.out`. Run the file-based Java program natively after exporting its ZIP; the browser Input panel does not supply its input file. The unfinished learner, missing input and refused input preserve an earlier answer because computation and basic result validation precede opening output. The historical reference assumes complete valid contract input; a previous answer is not evidence of a successful run. Learner and reference are independent source roles and should be opened only after confirming the source import.',
		checks: "Collect distinct squared pair distances, test each threshold using flood-fill connectivity, and select the first connected threshold. This independent model does not build a spanning tree. Cover the official sample, coincident coordinates, a singleton, maximum diagonal coordinates and changed small sets. Full-size constructions include 1000 coincident cows (zero), 1000 cows on a line at spacing 25 (625), and a 20-by-50 grid at spacing 500 (250000)."
	},
	{
		slug: "248",
		folder: "UG6-248",
		revision: "47262a7e6819ee20081a19716dd69fac1fe8e702",
		title: "248: Adjacent Merge Intervals",
		itemId: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-248",
		legacyAnchor:
			"usaco-gold-optional-historical-and-applied-gold-studios-usaco-gold-optional-historical-and-applied-gold-studios-supplemental-248",
		moduleTitle: "Unit 1: Dynamic Programming, Knapsack, and State Design",
		learningPath: "challenge",
		purpose:
			"Optional Gold interval-DP application after state design. Model adjacent merges inside contiguous intervals; this complements prefix and knapsack states without requiring the entire sequence to collapse.",
		input: "248.in",
		output: "248.out",
		contract:
			"Source contract: [USACO, US Open 2016 Gold, problem 3](https://usaco.org/index.php?page=viewproblem2&cpid=647).\n\nRead `248.in`. N is 2..248. Read N positive tile values, each in 1..40. A move replaces two adjacent equal tiles x with one tile x+1. Find the greatest tile value achievable anywhere in the sequence. Write one integer followed by a newline in `248.out`.",
		prediction:
			"The official sample included in this folder is:\n\n```text\n4\n1\n1\n1\n2\n```\n\nExpected `248.out`: `3`.\n\nMerge the second and third 1s in the sample to obtain 1,2,2, then merge the adjacent 2s to obtain 1,3. The best tile is 3 even though the whole sequence does not collapse.",
		tasks: "1. Define which contiguous intervals can collapse to one tile and a sentinel for impossible intervals.\n2. Initialize every singleton interval from its original tile.\n3. Visit increasing interval lengths and test every split with equal, possible child tiles.\n4. Track the greatest tile from any interval; the entire sequence need not collapse.\n\nThe learner has four marked algorithm tasks and is deliberately unfinished. Untouched work exits 2 before opening an answer file. Parsing and result bounds are supplied; they do not grade optimality. For independent study or an instructor walkthrough, record a prediction, trace a small case, implement and save an attempt, then compare two changed inputs with an independent model. Consult the separate reference after an attempt and explain any discrepancy. Preserve the first implementation; a later retry uses different data, a boundary case and a closed reference.",
		model: "Let dp[left][right] describe a single tile produced by collapsing that inclusive interval, with zero for an impossible collapse. All input values are positive, making zero a safe sentinel. Singletons keep their input value. For each increasing interval length, compare splits into two already-computed intervals; equal nonzero child tiles merge into that value plus one. Preserve a greatest answer over every interval, not only dp[0][N-1]. The invariant sum(2^tile) is unchanged by a merge and ensures a collapsible interval has a unique final value. The bound 248*2^40 is less than 2^48, so any produced tile is at most 47.\n\nO(N^3) time and O(N^2) auxiliary space; int suffices for tile values.",
		build: 'Use JDK 17 or newer inside this role\'s working folder. These commands also work in PowerShell:\n\n```sh\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java &&\njava -ea -Xmx256m Main\ntask_course_status=$?\nif [ "$task_course_status" -eq 0 ]; then cat 248.out; else printf \'Build or run failed with exit status %s\\n\' "$task_course_status"; fi\n```\n\nOn PowerShell:\n\n```powershell\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java\nif ($LASTEXITCODE -eq 0) {\n    java -ea -Xmx256m Main\n    if ($LASTEXITCODE -eq 0) { Get-Content 248.out }\n    else { Write-Host "Run failed with exit status $LASTEXITCODE" }\n} else { Write-Host "Compilation failed with exit status $LASTEXITCODE" }\n```\n\nKeep `248.in` beside Main.java. Run Java only after a successful compilation. Check exit status first; read `248.out` only after success with `cat 248.out` or `Get-Content 248.out`. Run the file-based Java program natively after exporting its ZIP; the browser Input panel does not supply its input file. The unfinished learner, missing input and refused input preserve an earlier answer because computation and basic result validation precede opening output. The historical reference assumes complete valid contract input; a previous answer is not evidence of a successful run. Learner and reference are independent source roles and should be opened only after confirming the source import.',
		checks: "For small sequences, enumerate all reachable sequences by applying every legal adjacent equal merge, and take the greatest tile present. This models actual moves rather than interval DP. Cover the official sample, no legal merge, an all-equal run, changed order and a best tile from a proper subinterval. Full-size constructions include 248 tiles of value 40 (47), 248 alternating 1/2 values (2), and 248 increasing cyclic 1..40 values (40)."
	},
	{
		slug: "fenced-in",
		folder: "UG20-Fenced-In",
		revision: "47262a7e6819ee20081a19716dd69fac1fe8e702",
		title: "Fenced In: Minimum Fence Removal",
		itemId: "usaco-gold-optional-gold-problem-bank-supplemental-problem-fenced-in",
		legacyAnchor:
			"usaco-gold-optional-gold-problem-bank-usaco-gold-optional-gold-problem-bank-supplemental-problem-fenced-in",
		moduleTitle: "Unit 3: MSTs, DSU, and Connectivity Proofs",
		learningPath: "challenge",
		purpose:
			"Optional Gold grid-graph application after DSU and Kruskal. Minimize total removed fence length, distinguish crossing direction from segment length, and evaluate native memory at the maximum dimensions.",
		input: "fencedin.in",
		output: "fencedin.out",
		contract:
			"USACO February 2016 Gold, problem 3: [Fenced In](https://usaco.org/index.php?page=viewproblem2&cpid=623). Read `fencedin.in`: `A B n m`, then n vertical positions and m horizontal positions. A and B are 1..1000000000; n and m are 0..2000. Positions within each orientation are distinct and strictly inside the corresponding outer boundary. Input positions need not be sorted. Write the minimum total removed length to `fencedin.out`, using a 64-bit total. The outer fence is not a candidate for removal. This is native Java with JDK 17 or 21 and a 256 MiB teaching heap.",
		prediction:
			"The supplied official sample has A=B=15, vertical positions 2,5,10,6,4 and horizontal positions 11,3. Predict 44, then trace the cheapest connections. Before coding, predict: no interior fences gives 0; only m horizontal fences gives m*A; only n vertical fences gives n*B. A larger answer can exceed a 32-bit integer.",
		tasks: "1. Draw the regions, sort coordinates with outer boundaries 0/A and 0/B, and compute gaps.\n2. Map each region to `column + row*(n+1)`. A horizontal dividing segment has the column width; a vertical dividing segment has the row height. Explain why crossing direction and removed-segment length differ.\n3. Remove increasing-cost segments only when they join different components. Stop after `(n+1)*(m+1)-1` successful joins. Describe why a cycle can be omitted without losing connectivity.\n4. Keep a long total, verify zero dimensions and tied gaps, and evaluate the memory cost before running the full boundary.\n\nLearner work can be read independently or walked through with an instructor: predict, explain a state, implement, compare independent checks and describe a failure. Preserve the first attempt before using the reference. A later changed-case retry should close the reference and change ordering, dimensions or gap lengths.",
		model: "Vertices are enclosed regions; each candidate edge is a fence segment between neighboring regions. A minimum spanning tree minimizes the total removed length, not the largest individual opening. The reference retains Kruskal and weighted disjoint sets. It packs a positive weight in the high 32 bits of a long and the original construction index in the low 32 bits. The index recovers the same endpoints after sorting. There are `(n+1)*m + (m+1)*n` edges. At n=m=2000 the primitive edge array and two disjoint-set arrays contain about 92 MiB of payload, before VM/sorting overhead; native acceptance uses `-Xmx256m`. Never divide by a zero dimension: the corresponding orientation has no edges. The algorithm uses O(E log E) time and O(E+V) memory.",
		build: 'Export the chosen role to its own folder. Keep `Main.java`, this guide and `fencedin.in` together. Open a terminal in that folder. The browser IDE can edit/export these files; its ordinary Input panel is not native file input. It cannot validate this heap-bound reference in a browser Java runner.\n\nOn macOS/Linux with JDK 17 or 21:\n\n```sh\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java &&\njava -ea -Xmx256m Main\ntask_course_status=$?\nif [ "$task_course_status" -eq 0 ]; then cat fencedin.out; else printf \'Build or run failed with exit status %s\\n\' "$task_course_status"; fi\n```\n\nOn PowerShell:\n\n```powershell\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java\nif ($LASTEXITCODE -eq 0) {\n    java -ea -Xmx256m Main\n    if ($LASTEXITCODE -eq 0) { Get-Content fencedin.out }\n    else { Write-Host "Run failed with exit status $LASTEXITCODE" }\n} else { Write-Host "Compilation failed with exit status $LASTEXITCODE" }\n```\n\nCheck the exit status before reading the answer; an older output file is not evidence that the current run succeeded. The unfinished learner exits 2 and preserves an earlier output. Learner input guards reject missing, extra, out-of-range or repeated positions before the algorithm tasks. The historical reference expects valid contest input; no malformed-input guarantee is made for it. Keep learner/reference work in separate export folders and saved attempts.',
		checks: "Compare tiny grids against enumeration of all candidate spanning trees with independent flood-fill connectivity. Check unsorted positions, equal gaps, one region, either zero dimension and swapped axes. Full-size constructions include 2000-by-2000 fences with unit gaps (4004000), unequal constant gaps with a total above 32 bits, and varied column gaps to exercise sorting. Check both single-orientation boundaries with a 2000000000000 total."
	}
] as const;

export function goldSpanningIntervalPack(itemId: string) {
	return goldSpanningIntervalPacks.find(pack => pack.itemId === itemId);
}

const nativeNotice =
	"The site's Java teaching preview does not execute this native Java exercise. Save the attempt, download its ZIP and extract it. Choosing Run displays native build instructions; the browser Input panel does not supply the input file. Use JDK 17 or newer in the extracted role folder.";

export function spanningIntervalNativeInstructions(
	pack: NonNullable<ReturnType<typeof goldSpanningIntervalPack>>
) {
	return [nativeNotice, pack.build].join("\n\n");
}

export function spanningIntervalCourseBrief(
	pack: NonNullable<ReturnType<typeof goldSpanningIntervalPack>>
) {
	return [
		`## ${pack.title}`,
		"**Learning sequence:** This is optional practice after the unit's required implementation checkpoint. Keep older C++ attempts and their notes; the confirmed Java import uses a separate saved identity.",
		pack.purpose,
		"## Contract and reasoning",
		pack.contract,
		pack.model,
		"## Guided implementation",
		pack.prediction,
		pack.tasks,
		"## Check and explain",
		pack.checks,
		"For independent study or an instructor walkthrough, explain the contract, record a prediction, trace a small case, implement and save an attempt, compare two changed inputs against an independent model, and explain a mismatch. Preserve the original work before consulting the separate reference. A later retry changes the data and a boundary while closing the reference.",
		"## Open, save and run",
		spanningIntervalNativeInstructions(pack),
		"Select the native starter or permitted reference, confirm the import before any source is fetched, then save, export and run. Existing saved attempts reopen with their edits, and older C++ work remains separate. Protected mocks and active contests start from empty files with the reference closed. An untouched learner exits 2 and creates no answer file; unfinished or refused work preserves an earlier answer. The supplied result bounds do not grade optimality."
	].join("\n\n");
}

export function goldSpanningIntervalLegacyItemId(anchor: string) {
	return goldSpanningIntervalPacks.find(pack => pack.legacyAnchor === anchor)
		?.itemId;
}
