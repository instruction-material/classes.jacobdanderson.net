import type { RawCourse, RawCourseModuleItem } from "./types";
import { restoredUsacoResourceUrl } from "../../modules/usacoProjectResources";

export const marathonSavedItemId =
	"usaco-gold-optional-historical-and-applied-gold-studios-supplemental-marathon";

const briefs: Record<
	string,
	{
		title: string;
		input: string;
		output: string;
		stdio?: boolean;
		contract: string;
		model: string;
		tasks: string;
		sample: string;
		checks: string;
		cost: string;
	}
> = {
	"UB1-Square-Pasture": {
		title: "Square Pasture: bounding rectangles with a square",
		input: "square.in",
		output: "square.out",
		contract:
			"The December 2016 Bronze problem gives two nonoverlapping, nontouching rectangles. Each of the two input lines contains x1 y1 x2 y2, lower-left then upper-right coordinates from 0 through 10; both dimensions are positive. Return the area of the smallest axis-aligned square covering both rectangles. Its placement need not be unique.",
		model: "Find the leftmost, rightmost, lowest and highest boundaries across both rectangles. Their differences give the enclosing width and height. A square must cover both spans, so its side is the larger span and its area is side squared. Explain why a smaller side fails and why the selected side is sufficient; do not return the side or perimeter.",
		tasks: "Complete the three geometry tasks in minimum_square_area. The Python driver supplies file reading and output; the untouched helper raises NotImplementedError before opening the answer file.",
		sample: "The supplied rectangles are (6,6)–(8,8) and (1,8)–(4,9). Width 7 and height 3 require side 7, so the output is 49.",
		checks: "Draw horizontal and vertical separation, reverse the rectangle order, vary unequal dimensions, and include extreme coordinates. For tiny coordinates, enumerate candidate square placements as an independent oracle.",
		cost: "A fixed number of boundary comparisons takes O(1) time and space."
	},
	"UB62-Cow-College": {
		title: "Cow College: frequency counts, revenue and ties",
		input: "sample.in",
		output: "",
		stdio: true,
		contract:
			"Choose one tuition for all cows to maximize revenue, returning the smallest tuition among tied optima. This optional project practices frequency tables and cumulative counts. Before starting, be able to read integer input, index a list and trace a decreasing loop. The first input line is N (1 through 100,000); the second contains N affordable tuition values (1 through 1,000,000). A cow attends when its value is at least the chosen price. Print maximum revenue and smallest optimal tuition on one line. The program reads standard input and prints standard output. [USACO problem contract](https://usaco.org/index.php?cpid=1251&page=viewproblem2).",
		model: "The supplied driver builds tuition_to_cow[p], the number of cows willing to pay exactly p. Scan prices from MAX_TUITION down to one, including both endpoints. Add the current frequency before calculating revenue; the cumulative count then includes precisely the cows able to pay that price. Multiply price by count. Descending order visits larger tied prices first, so replacing a saved result when revenue is equal retains the smallest tied price. For values 1 and 2, both prices earn 2 and the smallest optimal tuition is one. Explain the count invariant and tie rule before editing. Python integers hold the full revenue; another language needs 64-bit storage.",
		tasks: "Complete only choose_tuition in main.py, returning (maximum_revenue, smallest_optimal_tuition). Keep the supplied frequency-table input driver and output order. Initialize the count and best pair, scan both endpoints, add the frequency, compare the candidate and return the pair. In an instructor walkthrough, hand-trace the sample table at each step. For independent work, record that trace before implementing. Sorting the original offers is an alternative formulation, but this pack's helper receives a frequency table.",
		sample: "The included sample is N=4 with values 1, 6, 4, 6. Tuition 4 admits three cows and earns 12, so the printed answer is 12 4.",
		checks: "Check the sample, the tied values 1 and 2 (2 1), one value 1,000,000 (1000000 1000000), and three values 7 (21 7). Reordering the same values must not change the result. For 100,000 cows each willing to pay 1,000,000, revenue is 100,000,000,000. For small cases, separately count attendees at each distinct offered price and compare the best revenue and smallest tied price. Explain why adding the frequency after calculating revenue would omit eligible cows.",
		cost: "O(N + 1,000,000) time and O(1,000,000) storage. Avoid scanning every cow separately at every possible price."
	},
	"UB63-Feeding-the-Cows": {
		title: "Feeding the Cows: greedy coverage with two breeds",
		input: "sample.in",
		output: "",
		stdio: true,
		contract:
			"Place the fewest breed-specific patches so every cow reaches a patch of its own breed. This optional project practices a left-to-right greedy scan, separate coverage state and output validation. Before starting, be able to index strings, update lists and trace inclusive distances. Input starts with T (1 through 10). Each case gives N K, then N G/H characters; N is 1 through 100,000 and K is 0 through N-1. A position holds G, H or a dot. A patch feeds unlimited same-breed cows at distance at most K. Print the minimum patch count, then a length-N layout on the next line. Any valid optimal layout is accepted. Read standard input and print standard output. [USACO problem contract](https://usaco.org/index.php?cpid=1252&page=viewproblem2).",
		model: "Maintain a patch list and separate rightmost covered positions for G and H, initially uncovered. Scan cow indices left to right. An already covered cow needs no new patch. For an uncovered cow with idx+k inside the line, put its matching patch at idx+k and update only that breed's coverage to idx+2*k. This is the furthest-right placement that feeds the current cow, reaching as far as possible into later same-breed cows. Near the end, when idx+k is outside the line, a patch at idx reaches every remaining position. If the other breed already occupies idx, use idx-1 without overwriting it. For K=0 this collision cannot occur; for K>0 the adjacent trailing position remains reachable and available. Trace GH with K=1. An exchange argument justifies the interior choice, and the trailing choice covers every remaining same-breed cow.",
		tasks: "Complete only place_patches(cows, k) in main.py. Create N dots, initialize separate coverage boundaries, test whether each cow is uncovered, place an interior or trailing patch, and return the character list. The supplied driver counts non-dot positions and prints both lines. Keep G and H coverage independent. In a shared walkthrough, draw GHHGG with K=0, 1 and 2 before editing. For independent work, predict layouts and mark each patch's matching coverage interval first.",
		sample: "The six included cases require counts 5, 3, 2, 2, 2 and 2. Validate the breed and distance for every cow; a correct layout may differ from the sample characters.",
		checks: "Check one cow, K=0 (N patches matching the cows), one breed with K=N-1 (one patch), both breeds with K=N-1 (two different patch positions), alternating breeds near the right edge, and the two-cow GH case with K=1. Swapping G and H preserves the minimum count while swapping patch breeds. The reported count must equal the non-dot count. Enumerate tiny dot/G/H layouts independently to find the minimum valid count, then accept any layout reaching that optimum. Explain why an uncovered cow needs a patch and why updating G coverage cannot update H coverage.",
		cost: "O(N) work and O(N) output storage per case. Validate optimal count, breed, position occupancy and inclusive distance separately."
	},
	"US9-Number-Triangles": {
		title: "Number Triangles: overlapping path subproblems",
		input: "numtri.in",
		output: "numtri.out",
		contract:
			"This optional classical training problem bridges Silver reasoning and Gold dynamic programming. Before starting, trace nested arrays and explain why a greedy local choice can fail. Input gives R from 1 through 1,000, followed by R rows; row r contains r values from 0 through 100. Start at the top and move to either of the two adjacent cells in each next row, visiting exactly one cell per row. Write the largest path sum to numtri.out. The program reads numtri.in from its working directory. [Original USACO training statement reproduced in the archive](https://jvonk.github.io/usaco/2018/10/04/numtri.html).",
		model: "Define a state as the greatest total from one cell down to the last row. The last-row states equal their cell values. A higher state adds its own value to the larger total of its two legal children. Evaluate lower rows before higher ones. Explain why every legal path has exactly one of those first steps and why choosing the larger immediate cell can lose a better later path. With rows [1], [100,99], [0,0,100], the locally larger choice gives 101, while the optimum is 200. A rolling row retains only already-computed child totals; left-to-right updates keep the next child available until it is used.",
		tasks: "Complete maximumPathSum in main.cpp while retaining the supplied parser and file driver. First draw legal edges and enumerate every path of a three-row triangle. In an instructor walkthrough, trace the bottom row, one higher row and the final answer together. For independent work, record the same state trace before coding. Explain the base row, the update order and where the final answer is stored. The unfinished helper stops before the driver opens the answer file.",
		sample: "The supplied five-row training input begins with 7 and has maximum total 30. Record one complete legal path achieving that total; a collection of each row's largest value is not necessarily a legal path.",
		checks: "Check one zero, one 100, tied choices, all-zero rows, an optimum on each outer edge and the greedy trap above. Enumerate every legal left/right path for small triangles as an independent oracle. For 1,000 rows each filled with 100, the result is 100,000. Missing, truncated, out-of-range and extra input must be refused before producing an answer. Reordering cells changes their adjacency and is not a valid simplification.",
		cost: "O(R²) time and O(R) additional DP storage. The supplied driver retains the complete triangle, so total input-plus-working storage is O(R²). Reading one row at a time is an optional later extension with a different driver; do not claim the supplied program uses O(R) total space."
	},
	"US18-Counting-Haybales": {
		title: "Counting Haybales: inclusive coordinate queries",
		input: "haybales.in",
		output: "haybales.out",
		contract:
			"The December 2016 Silver problem reads N Q, N distinct haybale positions, and Q pairs A B. N and Q are at most 100,000; positions and query endpoints are between 0 and 1,000,000,000, with A <= B. Each answer counts positions in the inclusive interval [A,B], one integer per line.",
		model: "Sort positions once. lower_bound(A) locates the first position at least A and upper_bound(B) locates the first position greater than B. The distance between them counts the requested positions. Trace positions equal to either endpoint; using upper_bound(B) avoids computing B+1. This is coordinate counting, while the optional Prefix Sums pack sums array values over index ranges.",
		tasks: "Complete the sorted boundary searches in the learner helper. Preserve the supplied input validation, sorted representation and driver; justify both endpoint choices before coding.",
		sample: "The supplied six queries produce 2, 2, 3, 4, 1, 0 on separate lines. Trace the final empty interval rather than special-casing its answer.",
		checks: "Check ranges outside all positions, a singleton coordinate, both exact endpoints, a query spanning every position, reversed input position order, and the largest coordinates. Compare small queries with direct inclusive counting.",
		cost: "Sorting costs O(N log N); each query costs O(log N). The provided driver uses O(N+Q) storage including buffered answers."
	},
	"US21-Priority-Queues": {
		title: "Priority queue studio: stable task scheduling",
		input: "priority.in",
		output: "priority.out",
		contract:
			"This course-authored heap exercise reads N from 0 through 100,000, then N signed 64-bit priorities with whitespace-free labels. Output one label per line, lowest numerical priority first and earliest input position first for ties. Repeated labels are distinct tasks; negative priorities are valid.",
		model: "Pair each priority with its arrival index, which also locates its label. C++ priority_queue exposes the greatest entry by default; choose a comparison that exposes the smallest pair. Labels are not tie-breakers. Only inspect top or pop a nonempty queue. Trace equal-priority labels whose alphabetical order differs from arrival order.",
		tasks: "Complete orderTasks by inserting entries, removing the minimum entry repeatedly, and collecting labels. File handling is provided. The optional extension adds interleaved arrivals in a separate attempt with its own input contract; the supplied batch reference does not implement that extension.",
		sample: "The supplied sample outputs urgent, alpha, gamma, beta, beta on separate lines.",
		checks: "Check no tasks, one task, equal priorities, repeated labels, negative and extreme priorities. Use a stable sort of the original records as an independent small-case oracle.",
		cost: "O(N log N) time and O(N) storage. A heap becomes especially useful when insertions and removals interleave."
	},
	"US22-Prefix-Sums": {
		title: "Prefix sums practice: zero sentinel and half-open ranges",
		input: "prefix.in",
		output: "prefix.out",
		contract:
			"This course-authored optional exercise reads N Q, N signed values, then Q pairs left right. N and Q are from 0 through 100,000; values are from -1,000,000,000 through 1,000,000,000. Each query satisfies 0 <= left <= right <= N and asks for the sum in [left,right), excluding right. Write one signed sum per line.",
		model: "prefix[k] stores the sum of the first k values, so prefix[0]=0 and the table has N+1 entries. Build prefix[i+1]=prefix[i]+values[i]; subtract prefix[left] from prefix[right] to remove preceding values. Empty ranges give zero. Use signed 64-bit totals: the allowed magnitude reaches 100,000,000,000,000. This static table must be rebuilt if input values change.",
		tasks: "Complete makePrefix and rangeSum. Hand-build all six prefix entries for [3,-2,7,0,4], explaining each entry before deriving the range expression. The validated file driver is provided.",
		sample: "The supplied five queries produce 0, -2, 12, 7, 0 on separate lines.",
		checks: "Check an empty array, an empty interior range, a singleton, [0,N), negative totals and totals beyond 32-bit range. Compare every valid interval of a small array with direct slice addition.",
		cost: "O(N) preprocessing and O(1) per query, or O(N+Q) total time. The provided driver uses O(N+Q) storage."
	},
	"UG1-Dynamic-Programming-with-Fibonacci": {
		title: "Fibonacci: a bounded dynamic-programming warmup",
		input: "fibonacci.in",
		output: "fibonacci.out",
		contract:
			"This course-authored warmup reads one integer n from 0 through 92 and writes F(n), with F(0)=0 and F(1)=1. F(92)=7,540,113,804,746,346,429 fits signed 64-bit storage; F(93) does not. It establishes DP reasoning before larger Gold state-design problems rather than serving as a complete Gold assessment.",
		model: "Each value depends only on the two preceding values. Naive recursive evaluation repeats subproblems; a table or two retained values evaluates each state once. State the base cases, dependency order and storage bound before implementing the recurrence.",
		tasks: "Complete the unfinished Fibonacci helper while retaining validation and file handling. Trace indices 0, 1, 2 and 10 by hand; a later independent retry can reduce a table to two retained values without changing the file contract.",
		sample: "For n=10 the output is 55. Check the actual included input before predicting its answer.",
		checks: "Check n=0, 1, 2, 10 and 92. Inputs -1, 93 and nonintegers must be refused. Compare small values with a separately written recursive definition, restricted to small n.",
		cost: "O(n) time; O(n) storage for a table or O(1) for two retained values."
	},
	"UG3-Teamwork": {
		title: "Teamwork: choose the final team of a prefix",
		input: "teamwork.in",
		output: "teamwork.out",
		contract:
			"The December 2018 Gold problem reads N K and N skills in original cow order. N <= 10,000, K <= 1,000 and skills are from 1 through 100,000. Partition the sequence into consecutive teams of at most K cows. A team contributes its size times its maximum skill; output the greatest total.",
		model: "Let dp[i] be the best score for the first i cows, with dp[0]=0. Try every feasible final team length, maintaining that team's maximum while extending backward. Add its score to the best earlier prefix, then retain the greatest candidate. Every valid partition has one of these final teams, which justifies the recurrence. Sorting cows changes the problem.",
		tasks: "Complete the learner DP helper. Trace candidate final teams on a short unequal-skill sequence and explain why choosing the largest immediate team score need not maximize the full partition.",
		sample: "The supplied seven-cow, K=3 sample outputs 84.",
		checks: "Check one cow, K=1, K>=N, equal skills, high skills at either end, and a case where a greedy team choice fails. Enumerate every legal partition for small N as an independent oracle.",
		cost: "O(NK) time and O(N) DP storage, sufficient for the full Gold limits."
	},
	"UG5-Marathon": {
		title: "Marathon Gold: mutable checkpoints and range aggregates",
		input: "marathon.in",
		output: "marathon.out",
		contract:
			"The December 2014 Gold variant reads N Q (each at most 100,000), N checkpoint coordinates from -1,000 through 1,000, then commands. U I X Y replaces checkpoint I. Q I J asks for the shortest Manhattan sub-route from I to J, skipping at most one interior checkpoint. File indices are one-based, I <= J, and endpoints cannot be skipped. Write one distance per query. The Bronze and Silver variants have different contracts.",
		model: "Convert to zero-based points. Edge i connects i to i+1; a route a through b sums edges in [a,b). Skipping interior i saves distance(i-1,i)+distance(i,i+1)-distance(i-1,i+1). Subtract the largest gain in [a+1,b), excluding endpoints. Use separate sum and maximum segment trees with zero identities. A point update changes two incident edges and at most three neighboring gains. A static prefix sum needs rebuilding; a sum-only Fenwick tree does not supply this replacement range maximum.",
		tasks: "Complete point assignment and ancestor rebuilding, half-open range aggregation, and update refresh. Allocation, Manhattan distances, file handling and the route formula are provided. Draw the trees' meanings and trace an endpoint update before coding.",
		sample: "The supplied official sample outputs 11, 8, 8 on separate lines.",
		checks: "Check one checkpoint, adjacent endpoints, repeated points, collinear routes, first/last-point updates and repeated updates. For small routes enumerate each allowable skipped point and directly total distances.",
		cost: "The supplied repeated-assignment initialization is O(N log N); updates and queries are O(log N), with O(N+Q) driver storage. Bottom-up O(N) building is an optional extension."
	},
	"UG7-Treasure-Chest": {
		title: "Treasure Chest: optimal play on an interval",
		input: "treasure.in",
		output: "treasure.out",
		contract:
			"This optional Gold interval-DP challenge uses the original December 2010 Silver problem. Teaching placement reflects its state-design practice; it does not change the historical contest division. Start after tracing prefix DP and identifying dependencies between smaller intervals. Input gives N from 1 through 5,000, then N coin values from 1 through 5,000 in their original order. Two players alternate taking one coin from either end of the remaining line. Both maximize their own final total. Write the greatest total the first player can guarantee to treasure.out, reading treasure.in from the working directory. [Original USACO statement reproduced in the archive](https://ac.nowcoder.com/acm/problem/24756).",
		model: "An interval state records the score advantage of whoever moves next over the other player. A single coin gives an advantage equal to its value. Taking the left coin gives its value minus the opponent's advantage on the shorter remaining interval; the right choice works the same way. Keep the greater candidate. Evaluate shorter intervals first. Recover the first player's total from the sum of all coins and the full interval's advantage: the two totals add to the sum and differ by that advantage. The requested output is the first total, not the advantage. A rolling array updated left to right preserves both needed shorter intervals until they are read.",
		tasks: "Complete maximumFirstPlayerTotal in main.cpp; retain the supplied input validation and file driver. Draw the complete choice tree of a short line, labeling whose turn it is and each player's earned total. In a shared walkthrough, fill states of length one, two and three before discussing the rolling array. For independent work, write the same dependency trace before implementing. Explain why taking the larger exposed coin can lose and why the opponent's response must be accounted for. The unfinished helper stops before opening the output file.",
		sample: "The new practice input is four coins: 30, 25, 10 and 35. The first player can guarantee 60. The preserved repository treasure.out value 1229981 belongs to an unavailable historical input and is not this practice answer. Output files are excluded from the IDE import; generate a fresh answer after completing the helper.",
		checks: "Check a single coin, equal coins, odd and even lengths, reversed lines, and [8,15,3,7], where taking 7 first guarantees 22. For small cases, enumerate alternating complete game trees and compare both players' absolute totals as an independent oracle. Reversing the line preserves the optimal first-player total. A line of 5,000 coins each worth 5,000 yields 12,500,000. Refuse missing, extra, truncated and out-of-range input without replacing an earlier result.",
		cost: "O(N²) time and O(N) total storage. A full table with 25,000,000 signed 64-bit entries needs about 200 MB for entries alone; the rolling interval state avoids that table. Use 64-bit totals and explain the update order before attempting further storage changes."
	},
	"UG8-Bookshelf": {
		title: "Bookshelf Gold: constrained contiguous partitions",
		input: "bookshelf.in",
		output: "bookshelf.out",
		contract:
			"The November 2012 Gold problem reads N and maximum shelf width L, then N HEIGHT WIDTH pairs in that order. N <= 100,000, L <= 1,000,000,000, height <= 1,000,000 and each width is from 1 through L. Preserve book order and partition into contiguous shelves whose width sums are at most L. A shelf costs its tallest book's height; minimize total cost. This is the full Gold variant.",
		model: "dp[i] is the minimum cost for the first i books. A candidate shelf start j contributes dp[j] plus the maximum height from j through i-1. Positive widths give a moving lower bound on feasible starts. A monotonic stack groups starts sharing a maximum height; a lazy range-add/minimum tree updates groups when a new height replaces their maxima and selects the least feasible cost. Explain candidate activation, expired starts and lazy propagation; a quadratic DP is useful only as a small-case oracle.",
		tasks: "Complete the marked range-tree and candidate-DP helpers after tracing a tiny candidate table. This advanced challenge follows prefix-partition DP and range structures; defer it until both invariants can be explained.",
		sample: "The supplied official sample costs 21; a greedy packing choice costs 25. The preserved historical bookshelf.out value 248427 belongs to an unavailable older input and is not the expected result for this sample.",
		checks: "Check one book, every book requiring its own shelf, equal heights, increasing/decreasing heights, exact-width shelves and widths beyond 32-bit total range. Compare small cases with exhaustive contiguous partitions or independent quadratic DP.",
		cost: "O(N log N) time and O(N) storage are required for the full Gold limit. Use 64-bit width sums and DP costs."
	},
	"UG9-Dijkstras-Algorithm": {
		title: "Dijkstra: nonnegative weighted paths",
		input: "dijkstra.in",
		output: "dijkstra.out",
		contract:
			"This required Gold Unit 2 project is a course-authored algorithm demonstration retaining the historical example's undirected edges and source vertex 0. It is not an official contest problem. Prerequisites are adjacency lists, arrays, priority queues and graph paths. Input starts with N M, then exactly M lines P Q W. Vertices are zero-based; each edge works in both directions. This maintained practice pack uses 1 <= N <= 2,000, 0 <= M <= 200,000 and 0 <= W <= 1,000,000,000. Those bounds are authored practice limits, not historical contest limits. Parallel edges, self-loops, isolated vertices and zero weights are allowed. Negative weights, malformed or extra records and missing files are refused. Write one line per destination 1 through N-1: its vertex path followed by Distance: value, or Unreachable: i. For N=1, the answer is empty. Equal-cost paths can differ; verify endpoints, edges and total weight.",
		model: "distance[v] is the cheapest discovered source-to-v cost, and previous[v] is the preceding vertex on that path. Initialize all estimates to infinity and predecessors to -1, except source 0 at distance 0. Put only finite discovered states in a minimum priority queue. A current minimum can become final because going through an unprocessed vertex cannot make it cheaper with nonnegative edges; zero weights preserve this argument. Discard a removed entry when its saved distance differs from the current estimate. Relax an edge only for a strict improvement, saving the predecessor and queueing the improved distance together. Never add a weight to infinity or update on equal cost. Keep every parallel edge; a later heavier edge must not erase a cheaper one. Use long for distances: a simple path can cost 1,999 billion under this contract.",
		tasks: "Complete the four marked tasks in shortestPaths in Main.java: initialize state, remove the cheapest queued entry, discard stale entries and relax neighbors. Keep the supplied parser and protected path-output driver. The untouched helper throws an unfinished-task error before opening the answer file. Before coding independently, predict the next popped vertex, queue, distance array and predecessor changes. With an instructor, compare those predictions before each relaxation. The optional copy is a changed-case retry of this required project; preserve the first attempt rather than submit identical work twice.",
		sample: "The supplied edges are 0-1:10, 0-2:3, 2-1:4, 1-3:2, 2-3:9 and 3-4:0. After source 0, pop vertex 2 at 3; it improves vertex 1 to 7 and discovers vertex 3 at 12. Vertex 1 improves vertex 3 to 9, and vertex 3 reaches vertex 4 at 9. The old entries at 10 and 12 are later discarded. The output lines are 0 2 1 Distance: 7; 0 2 Distance: 3; 0 2 1 3 Distance: 9; and 0 2 1 3 4 Distance: 9.",
		checks: "Check one vertex, no edges, disconnected components, a cheaper parallel edge followed by a heavier one, tied shortest paths, zero-weight cycles and stale entries. A three-edge billion-weight chain has distance 3,000,000,000, beyond a signed 32-bit integer. On small nonnegative graphs, compute distances independently with Bellman-Ford, then verify that each predecessor route starts at 0, reaches its destination, contains no cycle and uses real edges whose sum equals the reported distance. Remove all edges from source 0 and explain why other vertices remain unreachable. Refused input preserves an earlier output file, so inspect a result only after a successful run.",
		cost: "Lazy queue operations for this multigraph take O((N+M) log(N+M)) time and O(N+M) memory. Let P be the total length of all printed paths: preparing output adds O(P) time and O(P) memory, and a chain can make P quadratic in N. The archived matrix implementation is not the active reference."
	},
	"UG22-Binary-Indexed-Tree-Fenwick-Tree": {
		title: "Fenwick trees: additive updates and inclusive range sums",
		input: "sample.in",
		output: "",
		stdio: true,
		contract:
			"This required Gold Unit 4 checkpoint is an authored data-structure practice contract, not an official contest problem. Prerequisites are arrays, signed integers, loops, ordinary prefix sums and zero-based closed ranges. Read standard input: exactly N Q on the first line, exactly N initial values on the second, then exactly Q operation lines. The maintained practice bounds are 1 <= N <= 200,000, 0 <= Q <= 200,000, and absolute initial values and individual update deltas at most 1,000,000,000; they are not historical contest limits. ADD index delta adds delta to the current value at that zero-based index; it does not assign a new value. PREFIX index returns the inclusive sum from 0 through index, with PREFIX -1 returning the empty prefix, zero. RANGE left right returns a closed-range sum, with 0 <= left <= right < N. ADD indices are in [0,N-1]; prefix indices are in [-1,N-1]. Negative values and deltas are valid. Reversed ranges, malformed or missing input, out-of-bounds indices and extra nonblank records are refused; harmless trailing blank lines are accepted. Print one integer per PREFIX or RANGE in operation order; ADD prints nothing. Use long sums: the absolute bound (N+Q)*1,000,000,000 is at most 400,000,000,000,000. The driver validates all records before processing and prints only after every operation succeeds. Refused input prints no answer and exits with status 2; the program creates no answer file.",
		model: "Public indices are zero-based; internal slot zero is unused. Internal slot i > 0 stores the original indices [i-lowbit(i), i-1], where lowbit(i) = i & -i. Convert a public index by adding one. An additive update jumps upward through all blocks containing its index; starting at internal zero would never advance. A prefix query jumps downward through disjoint blocks that partition its prefix. A closed-range sum is prefix(right) minus prefix(left-1). Explain why subtraction works for sums and does not supply a general range-minimum query. Assignment from old to new requires delta = new - old. Compare static prefix sums when there are no updates and segment trees when the merge operation or query contract needs more flexibility. Coordinate compression, inversion counting and range updates are later extensions, not features of this pack.",
		tasks: "Complete the four marked BinaryIndexedTree tasks in Main.java: reset/load, additive update, inclusive prefix query and closed-range subtraction. Keep the supplied parser, bounds guards and buffered output driver. The untouched starter reports unfinished work and prints no answer. For independent work, predict the visited internal slots, changed cells and printed sums before implementing. With an instructor, pause at the same steps and compare the block invariant before continuing. The optional copy is a changed-case retry of this required checkpoint: preserve the first attempt, change the update/range trace and compare with a plain-array oracle rather than repeat an identical submission.",
		sample: "The supplied array is [3,2,-1,6,5,4,-3,3,7,2,3]. PREFIX 5 visits internal slots 6 and 4, contributing 9 and 10, so it prints 19. RANGE 2 5 subtracts prefix(1)=5 and prints 14. ADD 2 5 changes -1 to 4 and updates internal slots 3, 4 and 8; the next PREFIX 5 prints 24. RANGE 0 0 prints 3 and PREFIX -1 prints 0. After ADD 10 -3, RANGE 8 10 prints 9 and PREFIX 10 prints 33. The seven output lines are 19, 14, 24, 3, 0, 9 and 33. Draw each block and trace every operation without hard-coding these answers.",
		checks: "Check one value, zero operations, the empty prefix, first and last indices, negative values, cancellation and repeated additive updates. Two billion-weight values sum to 2,000,000,000; after adding another billion the sum is 3,000,000,000, exposing a 32-bit accumulator. Refuse ADD at -1, index N, reversed ranges and malformed records even after a valid earlier query, without printing partial answers. Independently apply additions to a plain array and sum each requested slice; exhaust tiny arrays and compare seeded traces without copying lowbit logic into the oracle. Reload a different array and verify that old tree cells were cleared. Explain each discrepancy and why the selected interval endpoints are inclusive.",
		cost: "Building with repeated additions takes O(N log N), and each update, prefix or range query takes O(log N). The tree uses O(N) memory. The complete validated driver uses O((N+Q) log N) time and O(N+Q) memory because it retains commands and answer text. A linear-time build is an optional later extension after the current invariant is explained."
	},
	"UG14-MST": {
		title: "Minimum spanning trees: Prim's cheapest crossing edge",
		input: "prim.in",
		output: "prim.out",
		contract:
			"This required Gold Unit 3 checkpoint is a course-authored algorithm demonstration retaining the historical example's undirected graph, matrix scan, source vertex 0 and child-parent output. It is not an official contest problem. Prerequisites are arrays, weighted graph edges, visited-state reasoning and the distinction between a spanning tree and a shortest path. Input starts with exactly N M, then exactly M lines P Q W, using zero-based endpoints. The maintained practice bounds are 1 <= N <= 2,000, 0 <= M <= 200,000 and 0 <= W <= 1,000,000,000; they are authored practice limits, not historical contest limits. Parallel edges, self-loops and zero weights are allowed. Retain the cheapest parallel edge in either input order; a self-loop cannot connect a new vertex. Negative weights are refused by this pack's input contract, although Prim's cut argument can support them with a suitable representation. A disconnected graph has no spanning tree and is refused before opening an answer file. Invalid bounds, endpoints, malformed or extra records and missing input are also refused. For a connected graph, prim.out has N-1 child-parent lines in vertex order 1 through N-1, followed by Total Distance: value. The historical label means total selected edge weight, not a source-to-vertex distance. With N=1, the total is zero and there are no edge lines. Equal-weight alternatives can produce different optimal trees.",
		model: "best[v] is the cheapest known single edge connecting unvisited vertex v to the visited tree. Initialize all costs to infinity and parents to -1, then set root 0's cost to zero. Select the unvisited vertex with the smallest finite connecting cost, mark it visited and add that cost using long arithmetic. Relax its unvisited neighbors using the edge's own weight, not best[closest] plus that weight. Each chosen edge crosses the cut between visited and unvisited vertices and adds one new vertex, so it cannot create a cycle. Choosing a cheapest crossing edge preserves the possibility of an optimal tree. Refuse an infinite next cost rather than adding infinity or indexing a missing parent. The reference breaks selection ties by the lowest vertex index and changes parents only on strict improvements. The maximum tree total under this practice contract is 1,999 billion, which fits long.",
		tasks: "Complete the four marked tasks in minimumTree in Main.java: initialize arrays and root cost, select a finite cheapest unvisited vertex, mark it and accumulate its cost using long, then update neighbor costs and parents with single-edge weights. Keep the supplied parser and output validator. The untouched starter reports unfinished work and creates no answer file. Before coding independently, predict the visited set, costs, parents and running total after each selection. With an instructor, compare predictions at the same steps and explain the cut argument. The optional copy is a changed-case retry of this required checkpoint: preserve the first attempt, reverse parallel-edge input order or introduce a disconnected case, and compare with a separate Kruskal implementation rather than repeat the same submission.",
		sample: "The supplied edges are 0-1:10, 0-2:3, 2-1:4, 1-3:2, 2-3:9, 3-4:0 and 0-4:20. After root 0, vertex 2 joins with cost 3. It offers vertex 1 a connecting edge of weight 4, rather than Dijkstra's cumulative path cost 7. Vertex 1 joins and offers vertex 3 a weight-2 edge; vertex 3 then offers vertex 4 a weight-0 edge. The tree total is 9. Output is 1 2; 2 0; 3 1; 4 3; then Total Distance: 9 on its own line. For edges 0-1:10, 0-2:6 and 1-2:5, the MST total is 11 although its path from 0 to 1 costs 11 and the direct shortest path costs 10.",
		checks: "Check a single vertex, disconnected components, a cycle, tied optimal trees, self-loops, zero weights and parallel weights 1 then 9 in both input orders. A three-edge billion-weight chain totals 3,000,000,000, beyond a signed 32-bit integer. Verify exactly N-1 real selected edges, connectivity to root 0, no cycle, the sum of their weights and minimum total. Use independent Kruskal with union-find for small graphs and enumerate every spanning tree on tiny graphs; do not require an arbitrary tie tree. The supplied output validator checks the tree structure and reported total, while the independent oracle supplies the separate minimality check. Refused input and the unfinished starter preserve an earlier answer; treat an old answer as old, and inspect native output only after a successful run.",
		cost: "The matrix reference uses O(N²+M) time including parsing and output validation, and O(N²) memory. An adjacency-list/heap version is a separate extension after explaining the current cut invariant; its complexity is not the complexity of this matrix program. The historical reference remains archived separately from these learner and complete roles."
	}
};

function projectBrief(
	courseId: string,
	folder: string,
	mode: "python" | "cpp" | "java",
	item: RawCourseModuleItem
) {
	const brief = briefs[folder]!;
	const placement =
		item.learningPath === "core"
			? "Required implementation checkpoint: complete and explain this pack before continuing."
			: item.learningPath === "challenge"
				? "Choose this optional challenge after the matching unit; it is not a prerequisite for completing the required spine."
				: "This optional practice targets a diagnosed gap or an independent retry. If the same pack was already completed in the required unit, preserve that attempt and change the test cases rather than repeat identical work.";
	return [
		`## ${brief.title}`,
		`**Learning sequence:** ${placement}`,
		"## Contract and reasoning",
		brief.contract,
		brief.model,
		"## Guided implementation",
		brief.tasks,
		brief.sample,
		"## Check and explain",
		brief.checks,
		brief.cost,
		"Record a prediction, a trace, source changes and two custom tests before reviewing a reference. A shared walkthrough follows the same sequence: interpret the contract, draw the state, predict a small case, implement, test and explain discrepancies. Finish with a later rewrite from an empty file.",
		...(courseId === "usaco-bronze-on-demand" &&
		folder === "UB1-Square-Pasture"
			? [
					"## Self-paced checkpoint",
					"Before opening the pack, draw the sample on a grid and write its area prediction. Read the boundary model only after recording the first attempt. If blocked, name the missing step and use one hint at a time; an instructor walkthrough is optional. Keep the prediction, a corrected trace and two custom cases in the attempt record. After at least two days, reconstruct the geometry from an empty file using different rectangles. This independent retry distinguishes the on-demand route from the instructor course's shared implementation checkpoint."
				]
			: []),
		"## Open, save and run",
		`Choose Open in IDE beside the starter resource, then confirm the import. The ${mode === "python" ? "Python" : mode === "java" ? "Java" : "C++20"} pack includes ${mode === "java" ? "Main.java" : `main.${mode === "python" ? "py" : "cpp"}`} and ${brief.input}${folder === "UB1-Square-Pasture" ? "; the starter also includes README.md" : ", plus README.md"}. Existing saved attempts reopen with their edits. The starter and reference use separate project identities; reference resources are available in the authorized instructor view after an attempt.`,
		...(brief.stdio && mode === "java"
			? [
					"Use a native JDK 17 or newer. The site IDE edits, saves and exports this Java project; its teaching preview does not execute this input-driven data structure. Choosing Run displays native commands. The Input panel does not execute this project.",
					"Save the attempt, download its ZIP and extract it. Run inside the extracted directory with sample.in redirected into standard input:",
					"```sh\njavac -encoding UTF-8 Main.java\njava Main < sample.in\n```",
					"Read the printed answers in the native terminal. Change sample.in and predict the results before rerunning. The untouched starter and refused input exit with status 2 and print no answer. This program creates no answer file; check the exit status before accepting a result, including any file created separately by shell redirection. Reopening a saved attempt preserves its source edits and separate starter/reference identities."
				]
			: brief.stdio
				? [
						"In the site IDE, open sample.in and copy all its lines into the Input panel. Select main.py and choose Run. The untouched starter stops with NotImplementedError and prints no answer; complete its helper before expecting results. The completed program prints its answer in Console output. The input fixture is not opened automatically by this program.",
						"Save the attempt, download its ZIP and extract it. Run inside the extracted directory with the sample redirected into standard input:",
						"```sh\npython3 main.py < sample.in\n```",
						"Change the Input panel or the redirected fixture for each custom case. Reopening a saved attempt preserves its source edits; paste the desired input again before running. Keep a copy of learner work before using the separately saved instructor reference. Compare printed results using the contract above."
					]
				: [
						"Save the attempt, download its ZIP and extract it. Keep the input beside the source and run inside that extracted directory. The unfinished starter stops with an unfinished-task error and creates no answer file; that is the expected starting state.",
						"```sh",
						`rm -f ${brief.output}`,
						...(mode === "python"
							? ["python3 main.py"]
							: mode === "java"
								? [
										"javac -encoding UTF-8 Main.java",
										"java Main"
									]
								: [
										"c++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o project",
										"./project"
									]),
						`cat ${brief.output}`,
						"```",
						mode === "java"
							? `Use a native JDK 17 or newer. The site IDE edits, saves and exports this Java project; its teaching preview does not execute this file-I/O/${folder === "UG14-MST" ? "matrix" : "priority-queue"} program. Choosing Run displays the native commands. The Input panel does not replace ${brief.input}. Read the native result in ${brief.output} after a successful run.`
							: mode === "cpp"
								? "The browser edits and exports C++ source; it does not compile or execute C++. Follow the native commands above with a C++20 compiler. Delete only the stale answer file before running so an old answer cannot be mistaken for a new result."
								: "Python can also run in the site IDE. Inspect the generated output file after completing the helper; the native commands provide the same file-I/O check after export."
					]),
		"Source checks validate the supplied packs; they do not grade a completed learner submission. Protected mocks and active contests begin from an empty file without these practice starters or references."
	]
		.join("\n\n")
		.replace(
			/```sh\n\n([\s\S]*?)\n\n```/g,
			(_match, commands: string) =>
				`\`\`\`sh\n${commands.replaceAll("\n\n", "\n")}\n\`\`\``
		);
}

export function applyRestoredUsacoProjects(
	courseId: string,
	course: RawCourse
) {
	if (!courseId.startsWith("usaco-")) return;
	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				const resource = restoredUsacoResourceUrl(
					courseId,
					item.projectLink ?? ""
				);
				if (!resource) continue;
				item.ideImport = true;
				item.content = projectBrief(
					courseId,
					resource.folder,
					resource.mode,
					item
				);
			}
		}
	}
	if (courseId !== "usaco-gold") return;
	const previous = course.modules.find(
		module =>
			module.title === "Optional Historical and Applied Gold Studios"
	);
	const destination = course.modules.find(
		module =>
			module.title ===
			"Unit 4: Fenwick and Segment Trees, Ordering, and Range Structure"
	);
	const index =
		previous?.supplementalProjects.findIndex(item =>
			item.projectLink?.includes("/UG5-Marathon/starter")
		) ?? -1;
	if (!previous || !destination || index < 0) return;
	const [marathon] = previous.supplementalProjects.splice(index, 1);
	marathon!.id = marathonSavedItemId;
	destination.supplementalProjects.push(marathon!);
}
