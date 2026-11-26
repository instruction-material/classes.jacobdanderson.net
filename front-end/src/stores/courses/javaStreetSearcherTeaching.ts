import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaStreetSearcherModuleID,
	javaStreetSearcherProjects,
	javaStreetSearcherURL
} from "@/modules/javaSearchResources";

const [capstone, itinerary, roadAudit] = javaStreetSearcherProjects;

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
	pack: Parameters<typeof javaStreetSearcherURL>[0],
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaStreetSearcherURL(pack, "starter"),
		solutionLink: javaStreetSearcherURL(pack, "solution")
	};
}

const practiceWorkflow =
	"Open the starter in the IDE and confirm the import. Save and extract the ZIP. In its folder, compile with javac --release 21 -Xlint:all -Werror Main.java ContractTests.java, then run java ContractTests and java Main.";

export function buildJavaStreetSearcherModule(): RawCourseModule {
	return {
		id: javaStreetSearcherModuleID,
		title: "AJ17 Master Project: Google Maps",
		curriculum: [
			reading(
				"Introduction to Street Searcher",
				`Build a route finder for fictional places. A road has a starting place, an ending place, and a distance in miles. The graph manages roads, the loader reads the bundled roads.txt, and the route finder chooses a route and returns its stops and distance to the console program. Keep one saved IDE workbook for all three stages.

For Harbor → Market (2.5 miles), Market → Station (2.5 miles), and Harbor → Station (8 miles), the cheapest route from Harbor goes through Market and costs 5 miles. A reverse road needs its own entry. Before coding, draw that network and mark where the direction matters.`
			),
			assignment(
				"AJ17 Project 1: Weighted Graph",
				capstone.pack,
				`Implement addRoad in StreetGraph.java. Store a map for each known place whose keys are its outgoing destinations and whose values are their mileages. Add both endpoints, then insert the road only in the source's map. A place with no outgoing roads has an empty map. Accept zero mileage and reject negative or nonfinite weights. A repeated road with the same weight keeps one entry, and a repeated road with a different weight is an error.

The starter supplies place creation and a snapshot of outgoing edges. Predict the number of places and directed roads in the worked example from the introduction. Add Station → Harbor (0 miles) on paper and check that it creates a separate connection.

Open the starter in the site IDE and confirm the import. Save the project, download the ZIP and extract it. With Java 21, compile using javac --release 21 -Xlint:all -Werror *.java in the extracted folder. Run java ContractTests graph. Return to the saved IDE project to make changes and carry it into the next stage.`
			),
			assignment(
				"AJ17 Project 2: Loading Data",
				capstone.pack,
				`Reopen the weighted-graph project. Implement addRow in RoadFile.java. The UTF-8 loader skips blank lines and lines starting with #, and supplies each remaining line to addRow. Each record has four whitespace-separated fields. Here is one complete row.

\`\`\`text
10,10 10,11 2.5 Harbor--Market
\`\`\`

The first two fields give source and destination latitude and longitude. The third is the miles field and the fourth names the endpoints. Use the supplied coordinate checker and place map helper. Add one directed road, record the coordinates of both places, and reject names, coordinates or distances that violate the format. Repeated names must keep the same coordinates. The file reader reports errors with their line number and returns a completed graph only after the whole file is valid.

Compile the saved project and run java ContractTests load. Predict the message for a record with latitude 91 on line 2 and for the same place listed with two coordinates. Check that the starter fixture includes a zero-mile road.`
			),
			assignment(
				"AJ17 Project 3: Finding Shortest Paths",
				capstone.pack,
				`Reopen the same workbook and finish the search method in RouteFinder.java. Give the source distance zero. Use a priority queue of immutable name and distance pairs and a map of best distances. When a queued distance differs from the stored best, skip it. For each outgoing road, add its mileage to the current distance. If this improves the destination's best distance, store the new distance and predecessor and enqueue the new pair.

The first queue entry removed for the destination at its current best distance finishes the search. Follow the predecessor links from the destination and add each stop to the front of a deque. If the queue empties, the route is unavailable. The input check rejects unknown endpoint names. A known place can reach itself with one stop and zero miles.

Trace Harbor at 0, then Market at 2.5. Updating Station lowers its estimate from 8 to 5. The result has stops Harbor → Market → Station. Run java ContractTests route and then java Main roads.txt Harbor Station. Reverse the endpoints and compare the unavailable result with the result of routing Station to itself.`
			),
			reading(
				"Street Searcher Capstone Definition of Done",
				`Run java ContractTests to check all three required stages. Use the bundled fictional fixture or another course-owned or openly licensed file. The capstone uses no live location or external routing service and no unbounded background compute.

Give one small fixture and the expected route and total before running the program. Compare a cheaper indirect route with an expensive direct one. For an equal-cost tie, verify the ends, every directed road, and their total instead of asserting that one particular equally cheap route must appear. Check a disconnected place, an unknown name, one self-route, and an invalid line in the source file.

Save the source and the fixture together. Record the commands and one result that demonstrates the difference between a zero-mile route and an unavailable route.`
			),
			reading(
				"Course Recap",
				`**Algorithms and growth** Write a stopping case and state how each recursive step approaches it. Linear search accepts unsorted input. Binary search halves a sorted interval. Insertion sort shifts an item into the sorted prefix, selection sort finds the next smallest remaining item, and merge sort divides and merges sorted runs. Compare a sorted result with a copy sorted by Arrays.sort and verify that duplicates survive.

**Java structure** Give classes clear ownership and protect invariants behind methods. Use type parameters when the same operation works for different types. Catch specific exceptions where the program can recover. In the capstone, the loader reports malformed records and the console handles that error.

**Collections** A linked list follows node references. A stack removes the latest entry, a queue serves arrivals in order, and a priority queue removes the best-ranked entry. Maps look up values by key. A hash table computes bucket positions and handles collisions. A binary search tree uses key order, so in-order traversal returns sorted keys when the search-tree bounds hold.

**Graphs** Model direction and weights. Breadth-first search minimizes edge count in an unweighted graph. Dijkstra minimizes total nonnegative cost with a priority queue and a best-distance map. In the Street Searcher, a direct Harbor → Station route takes one edge, while Harbor → Market → Station costs fewer miles. Describe each algorithm's queue rule and identify which objective selects each route.`
			)
		],
		supplementalProjects: [
			assignment(
				"Master Project: Google Maps: Extension Challenge",
				capstone.pack,
				`Reopen the saved route finder. Implement avoiding in RouteFinder.java by passing the existing search a rule that excludes closed place names. A closure names an existing place. The search must skip closed neighbors and report an unavailable route when a required endpoint is closed. Keep the graph unchanged so an ordinary search can reuse it.

Run java ContractTests avoid. The command java Main roads.txt Harbor Station Market should choose Harbor → Station for 8.00 miles. Re-run the ordinary search and check that Market is available again. Try closing the destination and finding Library when Market is closed.`
			),
			assignment(
				"Google Maps Transfer Practice",
				itinerary.pack,
				`Build a mileage report from a supplied itinerary. The first row names the origin and records zero miles. Each directed leg must start at the previous stop. Add its nonnegative whole-mile cost and record the destination with the running total. Reject a broken connection, a negative cost, and a total larger than Long.MAX_VALUE.

${practiceWorkflow}

For Harbor → Market (2) and Market → Station (3), the rows show Harbor at 0, Market at 2, and Station at 5. Try an empty itinerary and a zero-mile leg.`
			),
			assignment(
				"Google Maps Extension Practice",
				roadAudit.pack,
				`Audit directed road data. For each road, look up the reversed key. Report one-way when it is absent and different reverse cost when the reverse exists at another mileage. Equal forward and reverse costs need no finding. Report each qualifying directed road in order by source name and then destination name.

${practiceWorkflow}

With A → B at 2, B → A at 4, and B → C at 1, the first two roads have different reverse costs and the last is one-way. Test equal costs, a self-loop, and a one-way road with zero miles.`
			)
		]
	};
}
