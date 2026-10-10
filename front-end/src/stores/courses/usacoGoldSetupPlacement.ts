import type { RawCourse, RawCourseModuleItem } from "./types";

const setupPrefix = "usaco-gold-usg0-setup-contest-contract-and-gold-mindset";
const goldSource =
	"https://github.com/instruction-material/USACO-Gold/tree/main";

function setupCheckpoint(retry: boolean): RawCourseModuleItem {
	return {
		id: `${setupPrefix}-${retry ? "supplemental-native-input-output-retry" : "curriculum-core-project-native-input-output-checkpoint"}`,
		title: retry
			? "Native Input/Output Retry"
			: "Core Project: Native Input/Output Checkpoint",
		content:
			"Read the complete input contract, predict a 64-bit sum, complete the marked learner helper and check standard output. Keep a later changed-case retry separate from the first attempt.",
		learningPath: retry ? "choice" : "core",
		projectLink: `${goldSource}/UG0-Contest-Contract/starter`,
		solutionLink: `${goldSource}/UG0-Contest-Contract/solution`
	};
}

function mooTubeGuidance(retry: boolean) {
	return [
		"## Optional connectivity practice",
		"Start after Unit 3's DSU, sorting and component-size work. This historical problem is optional practice, not the setup checkpoint. Preserve the earlier attempt before a changed-case retry.",
		"## Contract and reasoning",
		"[USACO January 2018 Gold MooTube](https://usaco.org/index.php?page=viewproblem2&cpid=789) gives N videos and Q queries, each from 1 through 100,000. The N-1 undirected edges form a tree. Each edge has relevance from 1 through 1,000,000,000; vertices are numbered 1 through N. Each query gives threshold K in that same positive range and a starting vertex V. A path's relevance is its minimum edge weight. Count other vertices reachable using only edges of weight at least K. Read mootube.in and write one count per query to mootube.out in original query order; exclude V itself.",
		"Sort edges and queries by decreasing threshold. Before answering K, union every edge of weight at least K. The current components are exactly the components of the threshold-filtered tree. Answer componentSize(V)-1. Include equal-weight edges before answering, retain original query indices and use union by size. The preserved legacy reference follows parent links without path compression; compression is a separate learner refinement. This is a connectivity count, not a shortest-path distance or an MST total.",
		"Input layout: the first line is N Q. Each of the next N-1 lines is P Q R, giving two endpoints and edge relevance. Each of the final Q lines is K V, giving threshold then starting vertex. The sample file starts with 4 3, followed by the three edge lines and then the three query lines listed below. Sorting takes O(N log N + Q log Q); the preserved weighted-union reference adds O((N+Q) log N) DSU work because its root lookup does not compress paths. A separate implementation with path compression and weighted union can improve that amortized bound.",
		"## Guided implementation",
		retry
			? "Close the reference and reconstruct the component invariant with different thresholds and query order. Diagnose one error from the first attempt, preserve the failing input and explain the correction in this separate retry."
			: "First solve a tiny query by direct traversal of edges meeting K. Draw the filtered tree, predict the component size, then implement DSU and the ordered sweep. With an instructor, pause at the same filter, union and answer-order checks used for independent work.",
		"The sample has edges 1-2:3, 2-3:2 and 2-4:4. Queries (1,2), (4,1) and (3,1) produce 3, 0 and 2. For K=3 from vertex 1, vertices 1, 2 and 4 form a component; subtract the starting vertex to obtain 2.",
		"## Check and explain",
		"Check one vertex, a threshold above every edge, a threshold equal to an edge, repeated queries, tied weights, a chain and reordered queries. For small trees, use independent BFS/DFS over edges with weight >= K as the oracle. Preserve original answer order. The supplied weighted-union reference takes O(N log N + Q log Q + (N+Q) log N) total time and O(N+Q) storage.",
		"## Open, save and run",
		"Choose Open in IDE and confirm the accepted learner import. Complete its six marked DSU and sweep tasks, retain the attempt, download its ZIP and create mootube.in from sample.in. Use JDK 17 or newer: javac -encoding UTF-8 Main.java, then java Main. The browser Run action shows native directions. An unfinished learner creates no answer file and preserves any earlier output. Check exit status and read mootube.out after success. The historical reference assumes valid contest input and remains separate from learner work. The first practice, changed-case retry and setup checkpoint keep distinct saved identities."
	].join("\n\n");
}

function crossingGuidance() {
	return [
		"## Optional Fenwick ordering practice",
		"Start after Unit 4's prefix-query and Fenwick update checkpoint. This problem transfers the data structure to crossing counts; it is not needed to configure the Gold environment.",
		"## Contract and reasoning",
		"[USACO February 2017 Gold Why Did the Cow Cross the Road III](https://usaco.org/index.php?page=viewproblem2&cpid=719) reads N from 1 through 50,000, followed by 2N cow IDs, one per line. Each ID from 1 through N occurs exactly twice. Two paths cross when their endpoints alternate around the circle. Read circlecross.in and write the total number of unordered crossing pairs to circlecross.out.",
		"Record each cow's earlier and later endpoint, then process cows by increasing earlier endpoint. Mark previous cows' later endpoints in a Fenwick tree. For a current interval, count marked later endpoints strictly inside it, then mark its own later endpoint. Every counted interval started earlier and ends inside the current one, so the pair alternates and is counted exactly once. Earlier endpoints and later endpoints are distinct. Nested and disjoint intervals contribute zero.",
		"## Guided implementation",
		"Trace the sequence 3,2,4,4,1,3,2,1; its answer is 3. Draw each chord before translating strict interior boundaries into prefix queries. Complete the five marked interval and Fenwick tasks in the separate learner pack, keeping the parser and answer driver. In a shared walkthrough, predict each inserted endpoint and query result; for independent work, record the same trace before coding.",
		"## Check and explain",
		"Check one cow, adjacent pairs, nested pairs, all crossings and a rotated sequence. For tiny cases, directly test endpoint alternation for each unordered pair. At N=50,000, at most N(N-1)/2 = 1,249,975,000 pairs cross, within Java int range; explain the bound rather than assuming every count needs a wider type. Sorting and Fenwick operations take O(N log N) time and O(N) memory.",
		"## Open, save and run",
		"Choose Open in IDE and confirm the distinct learner import. Save and download its ZIP; create circlecross.in from sample.in. Use JDK 17 or newer, javac -encoding UTF-8 Main.java, then java Main. Read circlecross.out only after success. The untouched learner exits with status 2 and preserves previous output. Retain the attempt before reviewing the separately saved reference. The browser Run action displays native directions."
	].join("\n\n");
}

function snowBootsGuidance() {
	return [
		"## Optional offline ordering extension",
		"Start after sorting, array indexing and the Unit 4 ordering work. This extension uses indexed neighbor links and a maximum gap rather than a Fenwick tree. Explain the link invariant before implementing the sweep.",
		"## Contract and reasoning",
		"[USACO February 2018 Gold Snow Boots](https://usaco.org/index.php?page=viewproblem2&cpid=813) reads N tiles and B boots, each count at most 100,000. Tile depths range from 0 through 1,000,000,000, and the first and last tile have depth zero. Each boot supplies a maximum depth in that range and a step length from 1 through N-1. Test each boot independently from the first tile to the last. Read snowboots.in and write B lines to snowboots.out: 1 when that boot can finish, otherwise 0, preserving boot input order.",
		"Sort tiles and boots by decreasing allowed depth. Maintain predecessor and successor indices for tiles still reachable by the current depth. Remove only tiles whose depth is strictly greater than the boot's limit, link their surviving neighbors and retain the largest gap between neighboring surviving tiles. The boot works exactly when its step can cross that largest gap. Equal-depth tiles remain usable; the zero-depth endpoints remain present even for a zero-depth boot. Save each result at the original boot index.",
		"Input layout: the first line is N B, the second line contains all N tile depths, and each of the following B lines contains maximum depth then maximum step for one boot. A custom four-tile case has depths 0,8,8,0. Boots (0,2), (0,3) and (8,1) must produce 0, 1 and 1 on separate lines. Write the first line as 4 3 and retain boot input order when checking the results.",
		"## Guided implementation",
		"Draw 0,3,8,5,6,9,0,0 and the surviving tiles for depth zero. The largest gap is six, so a step of five fails and six succeeds. Complete the six marked sorting, removal and gap tasks. Trace a removal by updating both neighbor links before measuring the new gap. Predict cases alone before coding; a shared walkthrough follows the same depth, links, gap and answer-order sequence.",
		"## Check and explain",
		"Check equal snow and boot depth, all-zero tiles, a boot permitting every depth, a gap equal to the step, repeated boots and reordered boots. On a small path, independently mark tiles reachable by forward jumps of at most the boot's step onto allowed depths. Compare that reachability result with the sweep. Sorting costs O(N log N + B log B), with O(N+B) sweep work and storage. Each interior tile is removed at most once.",
		"## Open, save and run",
		"Choose Open in IDE and confirm the distinct learner import. Save and download its ZIP; create snowboots.in from sample.in. Use JDK 17 or newer, javac -encoding UTF-8 Main.java, then java Main. Read snowboots.out only after success. The untouched learner exits with status 2 and preserves previous output. Retain the attempt before reviewing the separately saved reference. The browser Run action displays native directions. The reference prints diagnostic gap values in the terminal; those lines are not answers. Read the answer file in original boot order."
	].join("\n\n");
}

export function placeGoldSetupProjects(course: RawCourse) {
	const setup = course.modules.find(
		module => module.title === "USG0 Setup and Gold Mindset"
	);
	const connectivity = course.modules.find(
		module =>
			module.title === "Unit 3: MSTs, DSU, and Connectivity Optimization"
	);
	const ordering = course.modules.find(
		module =>
			module.title ===
			"Unit 4: Fenwick Trees, Ordering, and Range Structure"
	);
	if (!setup || !connectivity || !ordering)
		throw new Error("Gold setup prerequisites are missing");
	const coreIndex = setup.curriculum.findIndex(item =>
		item.projectLink?.includes("/UG21-Moo-Tube/starter")
	);
	if (coreIndex < 0)
		throw new Error("Historical Gold setup project is missing");
	const legacyCore = setup.curriculum[coreIndex]!;
	setup.curriculum[coreIndex] = setupCheckpoint(false);
	legacyCore.id = `${setupPrefix}-curriculum-core-project-setup-and-gold-mindset`;
	legacyCore.title = "MooTube: Offline Connectivity Practice";
	legacyCore.content = mooTubeGuidance(false);
	legacyCore.learningPath = "choice";
	connectivity.supplementalProjects.push(legacyCore);
	for (const item of setup.supplementalProjects) {
		if (item.projectLink?.includes("/UG21-Moo-Tube/starter")) {
			item.id = `${setupPrefix}-supplemental-gold-log-setup-and-gold-mindset`;
			item.title = "MooTube: Changed-Case Retry";
			item.content = mooTubeGuidance(true);
			connectivity.supplementalProjects.push(item);
		} else if (
			item.projectLink?.includes(
				"/UG24-Why-Did-the-Cow-Cross-the-Road-III/starter"
			)
		) {
			item.id = `${setupPrefix}-supplemental-why-did-the-cow-cross-the-road-iii`;
			item.content = crossingGuidance();
			ordering.supplementalProjects.push(item);
		} else if (item.projectLink?.includes("/UG27-Snow-Boots/starter")) {
			item.id = `${setupPrefix}-supplemental-snow-boots`;
			item.title = "Snow Boots: Offline Sweep Extension";
			item.content = snowBootsGuidance();
			ordering.supplementalProjects.push(item);
		} else {
			throw new Error(`Unclassified Gold setup practice: ${item.title}`);
		}
	}
	setup.supplementalProjects = [setupCheckpoint(true)];
}
