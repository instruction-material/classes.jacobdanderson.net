import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaReferenceLibraryProjects,
	javaReferenceLibraryURL,
	javaStreetSearcherModuleID
} from "@/modules/javaSearchResources";

const archive = "java-level-3-java-foundations-reference-archive";
const previousArchive =
	"java-level-3-optional-java-foundations-bubble-sort-and-reference-archive";
const capstone = `[Street Searcher](/courses#${javaStreetSearcherModuleID})`;
const [exceptions, ownership, chaining] = javaReferenceLibraryProjects;

function reading(
	section: "curriculum" | "supplemental",
	identity: string,
	title: string,
	content: string,
	aliases?: string[]
): RawCourseModuleItem {
	return {
		id: `${archive}-${section}-${identity}`,
		aliases,
		title,
		content,
		contentKind: "reading",
		preserveInstructions: true,
		preserveAssignment: true
	};
}

function lab(
	project: (typeof javaReferenceLibraryProjects)[number],
	title: string,
	content: string,
	sources = "Main.java ContractTests.java"
): RawCourseModuleItem {
	return {
		id: project.id,
		title,
		content: `${content}

Open the starter in the site IDE and confirm the import. Save and extract its ZIP. In its folder, run javac --release 21 -Xlint:all -Werror ${sources}, then java ContractTests and java Main.`,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaReferenceLibraryURL(project.pack, "starter"),
		solutionLink: javaReferenceLibraryURL(project.pack, "solution")
	};
}

export function buildJavaReferenceLibraryModule(): RawCourseModule {
	return {
		title: "AJ18 Repo Extension, Starter, and Capstone Library",
		curriculum: [
			reading(
				"curriculum",
				"classify-the-extra-java-level-3-folders",
				"Java Reference Library",
				`Choose a reference for a specific question from an earlier project. Use the node trace for aliasing, the hashing trace for a lookup that crosses a deleted slot, and the capstone notes for routing and fixture comparisons. The three optional labs provide practice in recovering from a failed parse, tracing nested object ownership, and maintaining a chained hash table.`
			),
			reading(
				"curriculum",
				"data-structures-reinforcement-without-clutter",
				"Choose a Data Structure for a Small Trace",
				`A linked list preserves the order of its node links. A map retrieves a value by key. A graph represents routes between places and can give several outgoing neighbors to one place. For a library loan, a map can answer which loan corresponds to a barcode. A queue can decide which request arrived first. A graph can trace which stages are reachable in a return workflow. Write the operation needed at each step before choosing its representation.`
			),
			reading(
				"curriculum",
				"capstone-support-material",
				"Capstone Support Material",
				`The graph, loader, route search and optional closure work use the same saved project in ${capstone}. The earlier source examples explored different graph representations. For comparing those designs, use the same file and expected route, then change one representation at a time.`
			),
			reading(
				"curriculum",
				"verification-review-repo-extension-starter-and-capstone-library",
				"Verify a Reference Example",
				`Before running an example, make a small prediction. For a room desk, rename the room and predict the desk's label before calling label again. For chaining, choose keys that collide and predict what happens to the second key after deleting the first. Run the lab's checks and record the prediction and actual output.`,
				[
					"repo-extension-starter-and-capstone-library-verification-and-reflection",
					`${archive}-curriculum-repo-extension-starter-and-capstone-library-verification-and-reflection`,
					`${previousArchive}-curriculum-repo-extension-starter-and-capstone-library-verification-and-reflection`
				]
			),
			reading(
				"curriculum",
				"core-project-repo-extension-starter-and-capstone-library",
				"Compare a Reference and an Attempt",
				`Begin with the saved learner attempt and select one behavior to compare after it runs. For a parser, compare which method recognizes an invalid token and which method chooses to continue. For a map, compare which method recomputes an index after a resize. Change one input and run both versions to check whether the difference affects output.`,
				[
					"aj18-repo-extension-starter-and-capstone-library-core-project",
					`${archive}-curriculum-aj18-repo-extension-starter-and-capstone-library-core-project`,
					`${previousArchive}-curriculum-aj18-repo-extension-starter-and-capstone-library-core-project`
				]
			)
		],
		supplementalProjects: [
			lab(
				exceptions,
				"Extension: Exceptions Reference Lab",
				`Parse integer measurements from 0 through 100. Strip outer space and use Integer.parseInt. Report text that cannot be parsed or values outside the range with the supplied checked ReadingError. The batch caller catches that exception per line, records its one-based line number and continues with the next line. Keep the valid measurements in their original order.

For the five lines 8, bad, 12 with surrounding space, 101, and 0, the results are [8, 12, 0] and invalid lines [2, 4]. Check that an invalid final line is reported and that an empty input yields two empty lists.`
			),
			lab(
				ownership,
				"Extension: Nested Classes",
				`A nested record Code holds a positive desk number and can be created before any room exists. A Desk is an inner class. Creating it with room.new Desk(code) gives it a particular room owner. Implement label using the current Room.this.name and the saved code value. A room rename changes the labels of that room's desks.

Given Code(3), desks owned by North and South return North-3 and South-3. Rename North to Maple and check that only its label changes. Try creating a code of zero and inspect the supplied validation.`
			),
			reading(
				"supplemental",
				"reference-node-class",
				"Reference: Node Class",
				`A generic node stores a value of a named type. A linked-list node also stores a link to its next node. A binary tree stores links to child nodes. To trace the object references, give the nodes labels A, B and C independently of the values inside them.

Start with head pointing at A, and A.next pointing at B. Store another variable named kept that also points at B. A reassignment of A.next to C changes the chain reachable from head. The variable kept can still reach B. Predict which names or links change if the value inside B is edited instead.`
			),
			lab(
				chaining,
				"Extension: Separate Chaining Hash Table",
				`Store all entries that share a bucket in one list. Implement remove so it deletes the matching entry through the iterator and decrements the total once. A missing key leaves the map unchanged. Implement resize by allocating larger empty buckets and computing each old entry's index at the new capacity. Move entries directly so that reinsertion does not change the count or start another resize.

Keys 0, 47 and 94 start in bucket 0 at capacity 47. Removing 0 must leave the other keys present. After 24 distinct insertions the load factor exceeds one-half. Check that each key and its latest value are still accessible after resizing. Add a negative key and remove it.`,
				"Main.java HashMap.java ContractTests.java"
			),
			reading(
				"supplemental",
				"reference-open-addressing-hash-tables",
				"Reference: Open Addressing Hash Tables",
				`In separate chaining, a collision adds an entry to the bucket's list. In open addressing, a probe sequence searches for another array slot. Suppose two keys begin at slot 2. Linear probing places the second at slot 3. A successful lookup of the second key crosses slot 2. Tombstones keep that path valid after the first key is deleted, while a never-used slot can end the search.

With four slots and a home index of 1, quadratic offsets i² visit 1, 2, 1 and 2 for i from 0 to 3. An empty slot at index 3 is unreachable by that sequence. Count attempts and handle the exhausted sequence instead of waiting for an open slot to appear.`
			),
			reading(
				"supplemental",
				"extension-google-maps-showcase",
				"Reference: Route Design Comparison",
				`A sparse adjacency map stores only outgoing roads. A matrix also stores an entry for every absent road. Compare their space on a five-place fixture with four one-way roads. Then trace the same Dijkstra queue on both representations using the published ${capstone} workbook. The same weighted edges give the same minimum route cost.`,
				["extension-google-maps-showcase"]
			),
			reading(
				"supplemental",
				"starter-street-searcher",
				"Start or Resume Street Searcher",
				`Start at Weighted Graph in ${capstone} to import the workbook. Use Loading Data when the graph checks pass, then Finding Shortest Paths. Each stage opens the same saved attempt. Run graph, load and route checks separately to see which stage needs work.`,
				["starter-street-searcher"]
			),
			reading(
				"supplemental",
				"starter-master-project",
				"Capstone Fixture Checklist",
				`Create a second fictional road file for the completed workspace in ${capstone}. Put a disconnected pair of places in a separate component. Include an expensive direct road and a cheaper route through an intermediate stop. Write the expected distance and stop list before running the search. Check the reverse direction and a route to the same starting place.`,
				["starter-master-project"]
			)
		]
	};
}
