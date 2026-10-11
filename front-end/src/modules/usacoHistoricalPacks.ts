import {
	goldImplementationLabForFolder,
	goldImplementationLabRevision
} from "./usacoImplementationLabs";
import { goldRequiredCoreAssignment } from "./usacoRequiredCorePacks";
import { goldSpanningIntervalPack } from "./usacoSpanningIntervalPacks";

// Immutable native source accepted independently on JDK 17 and 21.
export const goldHistoricalPacks = [
	{
		slug: "hoof-paper-scissors",
		title: "Hoof Paper Scissors",
		folder: "UG1-Hoof-Paper-Scissors",
		revision: "9849997abcd2328fa97a86fc9a34994c5dd85c1e",
		purpose:
			"Optional Gold dynamic-programming application after prefix states and bounded choices. Add a switch budget and a gesture dimension to an ordered sequence. This complements the Unit 1 state-design work and is distinct from grouping consecutive cows into teams.\n\nSource contract: [USACO, January 2017 Gold, problem 2](https://usaco.org/index.php?page=viewproblem2&cpid=694).",
		contract:
			"Read `hps.in`: N K, then N opponent gestures, each H, P or S. N is 1..100000 and K is 0..20. Hoof beats scissors, scissors beats paper, and paper beats hoof; equal gestures tie. Choose Bessie's gesture each round while changing it at most K times. The first gesture costs no switch. Write the greatest possible number of wins as one integer in `hps.out`. The supplied learner encodes opponent H/P/S as 0/1/2 and validates every token and bound before solving.",
		prediction:
			"The official sample in `hps.in` is:\n\n```text\n5 1\nP\nP\nH\nP\nS\n```\n\nExpected `hps.out`:\n\n```text\n4\n```\n\nBessie can play scissors for rounds 1..4, then hoof for round 5: three wins against paper and one against scissors. Round 3 is a loss. With K=0 the same input gives three wins. A single opponent permits one win even when K exceeds the number of round boundaries. Predict the first three rounds and both budget columns before opening the reference.",
		tasks: "1. Define prefix, at-most switch budget and literal Bessie gesture states; initialize zero rounds for every budget and gesture.\n2. Continue the current gesture using the previous round at the same budget.\n3. Compare switching from either other gesture using the previous round at budget j-1, only when j>0.\n4. Add the current cyclic win and take the greatest final value across gestures.\n\nThe learner has four marked algorithm tasks and remains deliberately unfinished. Untouched work exits 2 without writing a new answer. The supplied parser and result bounds do not prove optimality. Predict, trace, implement and save an attempt independently or with an instructor, then compare changed tiny cases with an independent model. Keep the original prediction and attempt before consulting the separate reference.",
		model: "Define dp[i][j][g] as the greatest wins in the first i rounds, ending with literal Bessie gesture g and using at most j switches. At zero rounds every allowed budget has value zero. Take the better of continuing dp[i-1][j][g] and, when j>0, switching from dp[i-1][j-1][h] for either h different from g; then add one only when g beats this opponent. With literal H/P/S encoded as 0/1/2, a win means `(g+2)%3 == opponent`, not equality. Values fit int because they lie in 0..N.\n\nThe historical reference labels a state by the opponent gesture it beats. Its target H/P/S labels correspond to Bessie P/S/H. Equality of that target label with an opponent counts a win, not a literal-gesture tie. The cyclic relabeling preserves gesture changes. Do not combine the reference equality test with literal Bessie states. Both representations use an at-most budget, not exactly K changes.",
		checks: "Independently enumerate all literal H/P/S sequences for at most eight rounds. Count changes between adjacent rounds, reject sequences exceeding K, count wins with the cyclic game rules, and compare the greatest count with the solver. This model does not copy the DP recurrence or its target relabeling. Cover all three single opponents, K=0, K greater than the possible boundaries, alternating opponents and the official sample.\n\nThe full table takes O(N(K+1)) time and space, with three gesture states. After the first implementation works, compare separate previous/next rolling layers using O(K+1) auxiliary space; do not overwrite a value still needed for the current round. Full-size checks use 100000 identical gestures, a zero-switch repeated cycle whose majority is counted directly, and 21 constant runs all beatable with 20 changes. Keep a boundary prediction, two changed inputs, any mismatch and its explanation, and a later reflection.",
		input: "hps.in",
		output: "hps.out"
	},
	{
		slug: "cow-routing",
		title: "Cow Routing",
		folder: "UG13-Cow-Routing",
		revision: "22a63d79519ee317a5e8c9b253cd80f1802db8f1",
		purpose:
			"Optional historical bridge practice after weighted shortest paths. It combines directed ticket portions with money-first, flight-count-second comparison. It complements core Dijkstra; it does not replace the Gold spine.\n\nSource contract: [USACO, January 2015 Silver, problem 2](https://usaco.org/index.php?page=viewproblem2&cpid=512). The origin remains explicit even when this historical exercise appears in the Gold appendix.\n",
		contract:
			"Read `cowroute.in`: `A B N`, then two lines for each route: `price stopCount` and the ordered city labels. There are 1..1000 routes, 1..100 stops per route, labels 1..1000, and prices 1..1000000000. A route has no repeated city. Buying a ticket permits any forward portion of that route for the same price; leaving and later boarding it again requires another ticket. Minimize total money, then flights among equal-money itineraries. Write `cowroute.out` as `money flights`, or `-1 -1` if unreachable. Use long money totals. Whitespace separates tokens; the learner driver checks all tokens and bounds before solving.",
		prediction:
			"The official sample in `cowroute.in` is:\n\n```text\n3 4 3\n3 5\n1 2 3 4 5\n2 3\n3 5 4\n1 2\n1 5\n```\n\nExpected `cowroute.out`:\n\n```text\n2 2\n```\n\nOne ticket costing 2 covers 3 to 5 to 4: two flights. The price-3 direct portion uses one flight but loses on money. A tied price-2 direct ticket would win on flights. Reverse travel along a route is not permitted.",
		tasks: "1. Represent every forward portion by one ticket price and its number of flights; retain the best pair for repeated endpoints.\n2. Define pair comparison and addition, minimizing money before flights and protecting unreachable sentinels.\n3. Initialize distance pairs, visited flags and a zero pair at the starting city.\n4. Select and relax vertices with the same pair ordering; return the destination pair or explicit unreachable output.\n\nThe learner has four marked algorithm tasks and remains deliberately unfinished. Untouched work exits 2 without writing an answer. The supplied parser and output guards check input and basic result shape; they do not prove reachability or optimality.\n\nFor independent study or an instructor walkthrough: predict the sample, explain the state and invariant, trace one transition, implement and save an attempt, and compare a changed tiny case against an independent model. Open the separate reference after the attempt; preserve the original attempt when retrying or comparing variants.",
		model: "A vertex stores the best money/flights pair found so far. All ticket costs are positive, so settling the least unvisited pair is safe. A selected portion from stop i to j uses j-i flights but pays once. Lexicographic comparison is used both for direct portions and complete itineraries. An optimal itinerary has no repeated city: removing a positive-cost cycle improves money. Its flights therefore number at most 999; the historical unreachable test uses this fact.",
		checks: "Compare tiny itineraries with bounded boarding-by-boarding relaxation rather than another Dijkstra implementation. Test a money tie with unequal flight counts, reverse-only routes, unreachable destinations, start equal to destination, competing direct portions, repeated ticket purchases and a total above int. The full-limit construction uses 1000 routes, city 1000 and an eleven-billion ticket total. The dense reference takes O(1000^2 + sum(stopCount^2)) time and O(1000^2) space.",
		input: "cowroute.in",
		output: "cowroute.out"
	},
	{
		slug: "watering-the-fields",
		title: "Watering the Fields",
		folder: "UG16-Watering-the-Fields",
		revision: "22a63d79519ee317a5e8c9b253cd80f1802db8f1",
		purpose:
			"Optional historical bridge practice after minimum spanning trees. The graph is implicit in coordinates and excludes pipes that are too short. It transfers the MST cut invariant without introducing a different spanning-tree objective.\n\nSource contract: [USACO, March 2014 Silver, problem 1](https://usaco.org/index.php?page=viewproblem2&cpid=415). The origin remains explicit even when this historical exercise appears in the Gold appendix.\n",
		contract:
			"Read `irrigation.in`: `N C`, then N coordinate pairs. There are 1..2000 distinct points, each coordinate lies in 0..1000, and C lies in 1..1000000. A pipe is eligible when its squared Euclidean length is at least C, including equality. Its cost is that squared length. Connect all points at minimum total cost, or write `-1` to `irrigation.out` if impossible. One point costs zero. Use a long total; a square root is never needed.",
		prediction:
			"The official sample in `irrigation.in` is:\n\n```text\n3 11\n0 2\n5 0\n4 3\n```\n\nExpected `irrigation.out`:\n\n```text\n46\n```\n\nThe three squared lengths are 29, 17 and 10. The cutoff excludes 10; the other two connect all points and total 46. Increasing the cutoff to 30 makes this graph disconnected. A two-point pipe of squared length 25 is permitted at cutoff 25 and refused at 26.",
		tasks: "1. Initialize cheapest connecting keys, visited state and a zero root key.\n2. Select the cheapest unattached point and distinguish an infinite key from completion.\n3. Attach a point and accumulate its connecting key using a long total.\n4. Generate squared lengths on demand and relax only eligible pipes to unvisited points.\n\nThe learner has four marked algorithm tasks and remains deliberately unfinished. Untouched work exits 2 without writing an answer. The supplied parser and output guards check input and basic result shape; they do not prove reachability or optimality.\n\nFor independent study or an instructor walkthrough: predict the sample, explain the state and invariant, trace one transition, implement and save an attempt, and compare a changed tiny case against an independent model. Open the separate reference after the attempt; preserve the original attempt when retrying or comparing variants.",
		model: "A key is the cheapest eligible pipe from the current tree to a point outside it. Selecting the least key preserves the cut property. The cutoff is a lower bound, so reversing the comparison creates a different graph. Infinite remaining keys prove disconnection. Coordinates make individual squares fit int within this contract, but the tree total can exceed int; long intermediate differences also make the numeric intent explicit.",
		checks: "Independently enumerate edge subsets on tiny point sets, then check connectivity and the least sum. Cover cutoff equality, one point, disconnection, widely spaced points and a full 2000-point construction. One full construction has two rows a thousand units apart and a known MST total 1999000999. Another uses two small opposite-corner clusters; singleton-cut reasoning yields a tree total above int. The dense reference computes edges as needed in O(N^2) time and O(N) extra space.",
		input: "irrigation.in",
		output: "irrigation.out"
	},
	{
		slug: "i-would-walk-500-miles",
		title: "I Would Walk 500 Miles",
		folder: "UG18-I-Would-Walk-500-Miles",
		revision: "22a63d79519ee317a5e8c9b253cd80f1802db8f1",
		purpose:
			"Optional clustering application after MST cut reasoning. The goal is the largest possible minimum distance between groups, rather than the smallest total tree cost. It keeps the historical implicit-graph approach; the derived formula is a later comparison.\n\nSource contract: [USACO, US Open 2019 Gold, problem 2](https://usaco.org/index.php?page=viewproblem2&cpid=946). The origin remains explicit even when this historical exercise appears in the Gold appendix.\n",
		contract:
			"Read `walk.in` as `N K`, with 2 <= K <= N <= 7500. Cows have labels 1..N. For x < y their distance is `(2019201913*x + 2019201949*y) mod 2019201997`. Form exactly K nonempty groups and maximize the least distance between cows belonging to different groups. Write that spacing to `walk.out`. Evaluate multiplication and addition in long arithmetic before the modulo.",
		prediction:
			"The official sample in `walk.in` is:\n\n```text\n3 2\n```\n\nExpected `walk.out`:\n\n```text\n2019201769\n```\n\nDistances for pairs (1,2), (1,3), (2,3) are 2019201817, 2019201769 and 2019201685. Grouping {1} and {2,3} yields spacing 2019201769. For three singleton groups the spacing is 2019201685. The historical Prim list includes a root zero, which is not a connecting edge.",
		tasks: "1. Generate the symmetric distance with one-based labels and long intermediate products.\n2. Build an MST by selecting the cheapest unattached key and relaxing implicit neighbors.\n3. Keep the N-1 real connecting weights separate from the root zero, or account explicitly for its list position.\n4. Remove K-1 largest connecting edges and identify the smallest removed weight as the maximum spacing.\n\nThe learner has four marked algorithm tasks and remains deliberately unfinished. Untouched work exits 2 without writing an answer. The supplied parser and output guards check input and basic result shape; they do not prove reachability or optimality.\n\nFor independent study or an instructor walkthrough: predict the sample, explain the state and invariant, trace one transition, implement and save an attempt, and compare a changed tiny case against an independent model. Open the separate reference after the attempt; preserve the original attempt when retrying or comparing variants.",
		model: "The ascending MST construction joins the nearest remaining components. After N-K connecting edges there are K components; the next connecting weight is their spacing. Any attempted partition with larger spacing would need to keep every smaller connection inside a group, leaving fewer than K available groups once that next connection is included. Equivalently remove K-1 largest MST edges. With N-1 real weights sorted ascending the spacing index is N-K; the historical length-N list includes the root zero and therefore uses N-K+1. This is the (K-1)th largest real edge, not the Kth largest.",
		checks: "Enumerate every unlabelled partition for tiny N and compute the smallest cross-group distance directly. Test N=2, K=2, K=N, one-based labels and products larger than int. Full-bound checks cover N=7500 with K=2 and K=N. The historical implementation takes O(N^2 + N log N) time and O(N) space. Only after implementing and checking this approach, derive the closed-form spacing by simplifying the edge formula and proving the resulting MST structure.",
		input: "walk.in",
		output: "walk.out"
	},
	{
		slug: "talent-show",
		title: "Talent Show",
		folder: "UG2-Talent-Show",
		revision: "22a63d79519ee317a5e8c9b253cd80f1802db8f1",
		purpose:
			"Optional advanced DP application after 0-1 choices and binary-search invariants. It optimizes a ratio subject to a minimum weight, rather than maximizing value below a capacity. It keeps the feasibility-DP problem intact.\n\nSource contract: [USACO, US Open 2018 Gold, problem 3](https://usaco.org/index.php?page=viewproblem2&cpid=839). The origin remains explicit even when this historical exercise appears in the Gold appendix.\n",
		contract:
			"Read `talent.in`: `N W`, then N lines `weight talent`. There are 1..250 cows; W is 1..1000; each weight is 1..1000000 and each talent is 1..1000. The total available weight reaches W. Select a subset with total weight at least W and maximize total talent divided by total weight. Write the floor of 1000 times that ratio to `talent.out`. Each cow may be selected once. Use integer and long arithmetic, with no floating-point rounding.",
		prediction:
			"The learner `talent.in` contains the official sample below. The reference keeps its historical 150-cow `talent.in` and `talent.out` (expected `26706`) unchanged; its separately named `official-sample.in` contains the official sample. To run that sample in the reference, copy it to `talent.in` in a disposable working copy first.\n\nOfficial sample:\n\n```text\n3 15\n20 21\n10 11\n30 31\n```\n\nExpected `talent.out`:\n\n```text\n1066\n```\n\nThe weight-10 cow alone has ratio 11/10 but misses the weight threshold. Combining it with the weight-20 cow gives 32/30; flooring 1000 times that ratio yields 1066. A cow heavier than W is still permitted. A DP state at W means total weight at least W, not weight exactly W.",
		tasks: "1. For a proposed scaled ratio r, initialize unreachable states and the zero-weight empty choice.\n2. Process each cow once, tracking the largest transformed score and clamping all weights above W to W.\n3. Decide feasibility from the threshold state and explain the score `sum(1000*talent - r*weight)`.\n4. Binary-search the greatest feasible integer ratio using a feasible lower bound and an infeasible exclusive upper bound.\n\nThe learner has four marked algorithm tasks and remains deliberately unfinished. Untouched work exits 2 without writing an answer. The supplied parser and output guards check input and basic result shape; they do not prove reachability or optimality.\n\nFor independent study or an instructor walkthrough: predict the sample, explain the state and invariant, trace one transition, implement and save an attempt, and compare a changed tiny case against an independent model. Open the separate reference after the attempt; preserve the original attempt when retrying or comparing variants.",
		model: "A selected subset has scaled ratio at least r precisely when its transformed score is nonnegative. For the same clamped weight, a larger score dominates a smaller score. All threshold-or-heavier states have identical future eligibility, so they can share state W. Separate previous/next rows ensure each cow is used once. Feasibility is monotone as r increases because all weights are positive. The greatest feasible integer r is the required floor. The reference row i includes cows 0 through i; its first-cow initialization is a special first row. A zero lower bound is feasible, and 250*1000*1000+1 is a safe exclusive upper bound.",
		checks: "Independently enumerate subsets on small inputs and compare exact integer ratios. Cover a single overweight cow, exact threshold equality, first-cow use, states above W, unattainable intermediate weights and floor boundaries. Full-bound checks use 250 cows, W=1000 and individual weights of a million. The historical two-dimensional reference takes O(N*W*log R) time and O(N*W) space, where R is the binary-search bound. A rolling-row implementation may reduce memory after its one-use invariant is established.",
		input: "talent.in",
		output: "talent.out"
	}
];
const prim = goldImplementationLabForFolder("UG14-MST-II")!;
export const goldHistoricalTopics = [
	...goldHistoricalPacks,
	{
		...prim,
		slug: "mst-ii",
		title: "MST II",
		revision: goldImplementationLabRevision,
		model: "A key is the cheapest single crossing edge, not a cumulative path distance. The cut property justifies each attachment. Queue entries can become stale; a visited row is scanned once."
	}
];
export const goldHistoricalAssignments = [
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-core-project-hoof-paper-scissors",
		slug: "hoof-paper-scissors",
		variant: "first",
		title: "Hoof, Paper, Scissors: First Implementation",
		previousFolder: "UG1-Hoof-Paper-Scissors",
		previousTitle: "Core Project"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-extension-challenge-hoof-paper-scissors",
		slug: "hoof-paper-scissors",
		variant: "retry",
		title: "Hoof, Paper, Scissors: Changed-Case Retry",
		previousFolder: "UG1-Hoof-Paper-Scissors",
		previousTitle: "Extension Challenge"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-core-project-cow-routing",
		slug: "cow-routing",
		variant: "first",
		title: "Cow Routing: First Implementation",
		previousFolder: "UG13-Cow-Routing",
		previousTitle: "Core Project"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-extension-challenge-cow-routing",
		slug: "cow-routing",
		variant: "retry",
		title: "Cow Routing: Changed-Case Retry",
		previousFolder: "UG13-Cow-Routing",
		previousTitle: "Extension Challenge"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-cow-routing-transfer-practice",
		slug: "cow-routing",
		variant: "model",
		title: "Cow Routing: Independent Verifier",
		previousFolder: "UG-01-applied-studio-",
		previousTitle: ""
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-cow-routing-extension-practice",
		slug: "cow-routing",
		variant: "extension",
		title: "Cow Routing: Extension",
		previousFolder: "UG-02-applied-studio-",
		previousTitle: ""
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-mst-ii-transfer-practice",
		slug: "mst-ii",
		variant: "model",
		title: "MST II: Independent Verifier",
		previousFolder: "UG-03-applied-studio-",
		previousTitle: ""
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-mst-ii-extension-practice",
		slug: "mst-ii",
		variant: "extension",
		title: "MST II: Extension",
		previousFolder: "UG-04-applied-studio-",
		previousTitle: ""
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-core-project-watering-the-fields",
		slug: "watering-the-fields",
		variant: "first",
		title: "Watering the Fields: First Implementation",
		previousFolder: "UG16-Watering-the-Fields",
		previousTitle: "Core Project"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-extension-challenge-watering-the-fields",
		slug: "watering-the-fields",
		variant: "retry",
		title: "Watering the Fields: Changed-Case Retry",
		previousFolder: "UG16-Watering-the-Fields",
		previousTitle: "Extension Challenge"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-watering-the-fields-transfer-practice",
		slug: "watering-the-fields",
		variant: "model",
		title: "Watering the Fields: Independent Verifier",
		previousFolder: "UG-05-applied-studio-",
		previousTitle: ""
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-watering-the-fields-extension-practice",
		slug: "watering-the-fields",
		variant: "extension",
		title: "Watering the Fields: Extension",
		previousFolder: "UG-06-applied-studio-",
		previousTitle: ""
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-core-project-i-would-walk-500-miles",
		slug: "i-would-walk-500-miles",
		variant: "first",
		title: "I Would Walk 500 Miles: First Implementation",
		previousFolder: "UG18-I-Would-Walk-500-Miles",
		previousTitle: "Core Project"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-extension-challenge-i-would-walk-500-miles",
		slug: "i-would-walk-500-miles",
		variant: "retry",
		title: "I Would Walk 500 Miles: Changed-Case Retry",
		previousFolder: "UG18-I-Would-Walk-500-Miles",
		previousTitle: "Extension Challenge"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-i-would-walk-500-miles-transfer-practice",
		slug: "i-would-walk-500-miles",
		variant: "model",
		title: "I Would Walk 500 Miles: Independent Verifier",
		previousFolder: "UG-07-applied-studio-",
		previousTitle: ""
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-i-would-walk-500-miles-extension-practice",
		slug: "i-would-walk-500-miles",
		variant: "extension",
		title: "I Would Walk 500 Miles: Extension",
		previousFolder: "UG-08-applied-studio-",
		previousTitle: ""
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-core-project-talent-show",
		slug: "talent-show",
		variant: "first",
		title: "Talent Show: First Implementation",
		previousFolder: "UG2-Talent-Show",
		previousTitle: "Core Project"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-extension-challenge-talent-show",
		slug: "talent-show",
		variant: "retry",
		title: "Talent Show: Changed-Case Retry",
		previousFolder: "UG2-Talent-Show",
		previousTitle: "Extension Challenge"
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-talent-show-transfer-practice",
		slug: "talent-show",
		variant: "model",
		title: "Talent Show: Independent Verifier",
		previousFolder: "UG-09-applied-studio-",
		previousTitle: ""
	},
	{
		id: "usaco-gold-optional-historical-and-applied-gold-studios-supplemental-talent-show-extension-practice",
		slug: "talent-show",
		variant: "extension",
		title: "Talent Show: Extension",
		previousFolder: "UG-10-applied-studio-",
		previousTitle: ""
	}
] as const;
const variantTasks: Partial<
	Record<string, { model: string; extension: string }>
> = {
	"cow-routing": {
		model: "Create Verifier.java beside a working copy of the saved solver. For at most six cities and four routes of at most four stops, enumerate each forward ticket portion, then repeatedly relax all boarding choices for at most cityCount-1 tickets. Compare money first and flights second, using long totals. This bounded relaxation must not reuse the solver's Dijkstra selection. Check unreachable and reverse-only travel, a money tie with different flight counts, A=B, and routes [1,2,3,4] and [4,1] costing 1 each: from 3 to 2, buying the first ticket twice costs 3 and takes 3 flights. Record a failing case, expected pair and repaired explanation.",
		extension:
			"After the dense solver and tiny verifier agree, implement sparse adjacency lists over the observed city labels with a priority queue of money/flights pairs. Ignore stale queue entries and retain the cheapest lexicographic forward portion per endpoint pair. A portion pays once, regardless of its flight count; returning to a route buys another ticket. Preserve cowroute.in/out and the -1 -1 contract. Count generated portions, queue removals and storage on sparse and dense route sets; derive costs in terms of observed cities V and generated portions E before claiming an improvement."
	},
	"mst-ii": {
		model: "Create Verifier.java beside a working copy of the saved solver. For at most six vertices and eleven edges, enumerate all subsets of N-1 input edges and test connectivity by repeated reachability. Reject cycles, absent edges and wrong sums, then compare the least total with the solver's tree; tied parent choices may differ. Include zero weights, self-loops, heavier parallel edges last and disconnection. Keep the checker independent of Prim and DSU, and retain one rejected tree and its explanation.",
		extension:
			"After the queue-and-matrix implementation passes the independent checker, replace matrix storage with adjacency lists in a saved working copy. Update the Graph representation, input construction and output edge lookup together; preserve the supplied input bounds, minimum parallel edges, refusal-before-output behavior and prim.out format. Use stale-entry checks and count queue removals plus scanned neighbors on a chain, star and dense graph. Explain O(N+M) graph storage and O((N+M) log(N+M)) time with duplicate queue entries. Compare against O(N^2+M log M) for the original matrix version; this extension does not request a second-best tree."
	},
	"watering-the-fields": {
		model: "Create Verifier.java beside a working copy of the saved solver. For at most five distinct points, generate every squared distance and retain only pipes with distance >= C. Enumerate subsets of N-1 eligible pipes and use repeated reachability to find the minimum connected cost. Compare this independent enumeration with the implicit Prim solver. Include one point, a pipe exactly at the cutoff, disconnection and the official total 46. Reject a connected but nonminimal candidate and explain why its structure alone is insufficient.",
		extension:
			"After the minimum-total solver and checker agree, retain parent choices and write a separate optional irrigation-trace.out after successful validation. Keep irrigation.out as the official total only. The trace contains N-1 lines of zero-based endpoint pairs, or no lines for a single point; on impossible input, produce no new trace. Validate that every chosen pipe meets the cutoff, the pairs connect all points without a cycle, and their long sum equals the reported total. Preserve earlier output on unfinished or refused work. Compare a tied tree by cost and validity, rather than requiring one fixed parent order."
	},
	"i-would-walk-500-miles": {
		model: "Create Verifier.java beside a working copy of the saved solver. For N <= 7, enumerate unlabelled partitions into exactly K nonempty groups by assigning the next cow to an existing group or one new group. Compute each partition's least cross-group distance directly, then maximize it. Use one-based labels and long products. Compare with the MST spacing result for K=2 and K=N; the root zero is not an edge. Record a partition and its spacing so the check remains independent of Prim and of any closed-form shortcut.",
		extension:
			"Complete and independently check the dense Prim implementation first. In a separate comparison, let P=2019201997 and prove that for x<y<=7500 the edge simplifies to P-84*x-48*y without wrap ambiguity. For every x<N, show that edge (x,N) is its cheapest incident edge: when z<x, compare 84*(x-z)+48*(N-x), which is positive. The singleton cuts justify the star at N. Sort its real connecting weights and derive spacing P-48*N-84*(K-1). Implement that O(1) formula only as the later extension, compare it with the dense solver and partition oracle, and test both K endpoints at N=7500."
	},
	"talent-show": {
		model: "Create Verifier.java beside a working copy of the saved solver. For at most eighteen cows, enumerate every subset with total weight >= W and maximize the exact integer value floor(1000*totalTalent/totalWeight), using long products. Compare with feasibility DP and binary search. Include a single overweight cow, threshold equality, use of cow zero, an unreachable intermediate weight and a floor boundary. Compare official-sample.in in a disposable reference copy separately from its preserved historical input; never assume those inputs have the same expected answer.",
		extension:
			"After the feasibility DP and subset checker agree, compare the historical two-dimensional table with separate previous/next rolling rows in a saved working copy. Reset unreachable next states, copy skip choices and take each cow from the previous row only; clamp threshold-or-heavier weights to W. Explain why in-place reuse at clamped W can select a cow repeatedly. Preserve monotone integer binary search, long transformed scores and talent.in/out. Measure storage as O(W) versus O(N*W), and compare all answers with the independent subset checker before increasing to 250 cows and W=1000."
	}
};

export function goldHistoricalAssignment(itemId: string) {
	const assignment = goldHistoricalAssignments.find(
		entry => entry.id === itemId
	);
	if (!assignment) return undefined;
	const pack = goldHistoricalTopics.find(
		entry => entry.slug === assignment.slug
	)!;
	return { ...assignment, pack };
}

// A previous C++ attempt keeps its three-part identity. Never overwrite it on migration.
export function goldHistoricalProjectKey(
	courseId: string,
	itemId: string,
	role: "starter" | "reference",
	sourceUrl: string
) {
	const base = `${courseId}:${itemId}:${role}`;
	const pack =
		goldHistoricalAssignment(itemId)?.pack ??
		goldSpanningIntervalPack(itemId) ??
		goldRequiredCoreAssignment(itemId)?.pack;
	const pathRole = role === "reference" ? "solution" : "starter";
	return courseId === "usaco-gold" &&
		pack &&
		sourceUrl ===
			`https://github.com/instruction-material/USACO-Gold/tree/${pack.revision}/${pack.folder}/${pathRole}`
		? `${base}:native-java`
		: base;
}

export function historicalNativeInstructions(
	assignment: NonNullable<ReturnType<typeof goldHistoricalAssignment>>
) {
	const pack = assignment.pack;
	return [
		"Save the attempt, download its ZIP and extract it. Use JDK 17 or newer inside the extracted folder. These commands also work in PowerShell:",
		"javac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java",
		"java -ea -Xmx256m Main",
		"The site's Java teaching preview does not execute this native Java exercise. Choosing Run displays these instructions; the Input panel does not run the program.",
		`Keep the included ${pack.input} beside Main.java. Check exit status first; read ${pack.output} only after success with cat ${pack.output} or Get-Content ${pack.output}. An untouched learner exits 2 and creates no answer file. Missing input, refused input and unfinished learner work preserve an earlier answer. The historical reference expects complete valid contract input; its old answer is not evidence of a successful new run.`,
		pack.slug === "hoof-paper-scissors"
			? "The historical reference also prints the answer to the terminal. Its target H/P/S labels mean literal Bessie P/S/H; equality with an opponent is a win in this representation. Preserve valid input and check the new run's exit status and answer file together."
			: pack.slug === "talent-show"
				? "The learner input is the official sample, whose answer is 1066. The reference preserves a 150-cow input and answer 26706. Its official-sample.in has answer 1066; copy it to talent.in only in a disposable reference working copy with cp official-sample.in talent.in or Copy-Item official-sample.in talent.in. The historical reference opens output while parsing; malformed-input experiments belong in a disposable copy of the guarded starter."
				: "Preserve previous source, inputs and answers before changing cases.",
		pack.purpose,
		pack.contract,
		pack.prediction,
		pack.tasks,
		pack.model,
		pack.checks,
		historicalVariantTask(assignment),
		...historicalVerifierInstructions(assignment),
		"New Java assignments have separate saved identities from older C++ attempts. Select a previous attempt from saved projects to resume it. Existing saved attempts reopen with their edits. Learner and reference imports remain separate; confirm the import before any source is fetched. Protected mocks and active contests start from empty files."
	];
}

function historicalVariantTask(
	assignment: NonNullable<ReturnType<typeof goldHistoricalAssignment>>
) {
	if (assignment.variant === "first")
		return "This optional practice is a first implementation after the matching unit. Predict the sample and one transition, implement the four marked tasks, save the attempt, and compare two changed cases with an independent model before consulting the reference.";
	if (assignment.variant === "retry")
		return "This optional practice is a changed-case retry. Preserve the first implementation, wait at least two days, close the reference and reconstruct the four tasks using different data. Include a boundary case and an independently checked mismatch. Repeating the identical sample does not complete this retry.";
	const tasks = variantTasks[assignment.slug];
	if (!tasks) throw new Error("No verifier or extension task for this topic");
	return `This optional practice follows a saved working implementation. Keep that attempt and create a working copy; reuse its solver instead of repeating the first assignment. ${
		tasks[assignment.variant]
	}`;
}

export function historicalCourseBrief(
	assignment: NonNullable<ReturnType<typeof goldHistoricalAssignment>>
) {
	const { pack } = assignment;
	const directions = historicalNativeInstructions(assignment);
	return [
		`## ${assignment.title}`,
		`**Learning sequence:** ${historicalVariantTask(assignment)}`,
		pack.purpose,
		"## Contract and reasoning",
		pack.contract,
		pack.model,
		"## Guided implementation",
		pack.prediction,
		pack.tasks,
		"## Check and explain",
		pack.checks,
		"For an independent read or an instructor walkthrough, interpret the contract, record a prediction, trace the state, implement, compare independent results and explain a discrepancy. Keep the prediction, source attempt, two changed inputs and a later reflection. The supplied driver checks basic result shape; it does not grade algorithm optimality.",
		"## Open, save and run",
		directions[0],
		"```sh\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java\njava -ea -Xmx256m Main\n```",
		...directions.slice(3, 6),
		...historicalVerifierInstructions(assignment),
		directions.at(-1)
	].join("\n\n");
}

function historicalVerifierInstructions(
	assignment: NonNullable<ReturnType<typeof goldHistoricalAssignment>>
) {
	if (assignment.variant !== "model") return [];
	return [
		"## Run the independent verifier",
		"In a disposable copy of the exported project, create Verifier.java with public static void main(String[] args) throws Exception. Preserve the saved solver and its original input and answer. For each bounded case, compute the independent expected result, write the case to the contract's input file, launch Main in a fresh native Java process with ProcessBuilder, and wait for its exit status. Compare the answer file only after success; check an expected refusal without treating an older file as a new answer. Throw AssertionError on a discrepancy and report the input, expected result and actual result.",
		"```sh\njavac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java Verifier.java\njava -ea -Xmx256m Verifier\n```",
		"The same commands work in PowerShell. Keep all generated cases inside the disposable working folder. The new checker must implement the independent model described in this assignment; copying the solver's recurrence or using its answer as the expectation does not complete the verifier."
	];
}
