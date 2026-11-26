import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaRecursionProjectKey } from "@/modules/javaRecursionResources";

export const javaSearchRevision = "c4c73df01fcbb97475dd75ef9d30af0940dc55a2";
export const javaSearchModuleID =
	"java-level-3-aj5-linear-search-and-big-o-notation";

export const javaSearchProjects = [
	{
		pack: "AJ5-Linear-Search-Packs",
		id: `${javaSearchModuleID}-curriculum-aj5-project-1-linear-search-implementation`
	},
	{
		pack: "AJ5-Big-O-Practice-Packs",
		id: `${javaSearchModuleID}-curriculum-aj5-project-2-big-o-practice`
	},
	{
		pack: "J3-07-aj5-linear-search-and-big-o-notation-supplemental-2",
		id: `${javaSearchModuleID}-supplemental-search-runtime-transfer-practice`
	},
	{
		pack: "J3-08-aj5-linear-search-and-big-o-notation-supplemental-3",
		id: `${javaSearchModuleID}-supplemental-runtime-comparison-extension-practice`
	}
] as const;

export const javaBinarySearchRevision =
	"629659e63143303c135181590c5ca542a1559397";
export const javaBinarySearchModuleID = "java-level-3-aj6-binary-search";

export const javaBinarySearchProjects = [
	{
		pack: "AJ6-Binary-Search-Iteration-Packs",
		id: `${javaBinarySearchModuleID}-curriculum-aj6-project-1-binary-search-with-iteration`
	},
	{
		pack: "AJ6-Binary-Search-Recursion-Packs",
		id: `${javaBinarySearchModuleID}-curriculum-aj6-project-2-binary-search-with-recursion`
	},
	{
		pack: "AJ6-Precision-Square-Root-Packs",
		id: `${javaBinarySearchModuleID}-curriculum-aj6-project-3-precise-square-roots`
	},
	{
		pack: "J3-09-aj6-binary-search-supplemental-2",
		id: `${javaBinarySearchModuleID}-supplemental-binary-search-trace-practice`
	},
	{
		pack: "J3-10-aj6-binary-search-supplemental-3",
		id: `${javaBinarySearchModuleID}-supplemental-binary-search-edge-case-practice`
	}
] as const;

export const javaCheckIn1Revision = "2bab8041dfa2b2171a3852711dfd3b9c086fa5c6";
export const javaCheckIn1ModuleID = "java-level-3-check-in-1";

export const javaCheckIn1Projects = [
	{
		pack: "AJ-Check-In-1-Workbook-Packs",
		id: `${javaCheckIn1ModuleID}-curriculum-java-level-3-check-in-1-core-concepts`
	},
	{
		pack: "AJ-Check-In-1-Benchmark-Packs",
		id: `${javaCheckIn1ModuleID}-curriculum-java-level-3-check-in-1-practice-project`
	},
	{
		pack: "J3-11-check-in-1-supplemental-2",
		id: `${javaCheckIn1ModuleID}-supplemental-review-checkpoint-transfer-practice`
	},
	{
		pack: "J3-12-check-in-1-supplemental-3",
		id: `${javaCheckIn1ModuleID}-supplemental-review-checkpoint-extension-practice`
	}
] as const;

export const javaSortingRevision = "8c4a69683e0af396344c373ee9eb3f1561a14cd3";
export const javaElementarySortingModuleID =
	"java-level-3-aj7-selection-and-insertion-sort";
export const javaMergeSortingModuleID = "java-level-3-aj9-merge-sort";

export const javaElementarySortingProjects = [
	{
		pack: "AJ7-Selection-Sort-Packs",
		id: `${javaElementarySortingModuleID}-curriculum-aj7-project-1-selection-sort`
	},
	{
		pack: "AJ7-Insertion-Sort-Packs",
		id: `${javaElementarySortingModuleID}-curriculum-aj7-project-2-insertion-sort`
	},
	{
		pack: "AJ7-Bookshelf-Packs",
		id: `${javaElementarySortingModuleID}-supplemental-aj7-supplemental-project-1-biggest-to-smallest-bookshelf`
	},
	{
		pack: "J3-13-aj7-selection-and-insertion-sort-supplemental-2",
		id: `${javaElementarySortingModuleID}-supplemental-elementary-sorting-transfer-practice`
	},
	{
		pack: "J3-14-aj7-selection-and-insertion-sort-supplemental-3",
		id: `${javaElementarySortingModuleID}-supplemental-elementary-sorting-extension-practice`
	}
] as const;

export const javaMergeSortingProjects = [
	{
		pack: "AJ9-Merge-Packs",
		id: `${javaMergeSortingModuleID}-curriculum-aj9-project-1-merge-method`
	},
	{
		pack: "AJ9-Split-Packs",
		id: `${javaMergeSortingModuleID}-curriculum-aj9-project-2-split-method`
	},
	{
		pack: "AJ9-Merge-Sort-Packs",
		id: `${javaMergeSortingModuleID}-curriculum-aj9-project-3-merge-sort`
	},
	{
		pack: "J3-17-aj9-merge-sort-supplemental-2",
		id: `${javaMergeSortingModuleID}-supplemental-merge-sort-trace-practice`
	},
	{
		pack: "J3-18-aj9-merge-sort-supplemental-3",
		id: `${javaMergeSortingModuleID}-supplemental-merge-sort-extension-practice`
	}
] as const;

const javaSortingProjects = [
	...javaElementarySortingProjects,
	...javaMergeSortingProjects
];

export function javaSortingURL(
	pack: (typeof javaSortingProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaSortingRevision}/${pack}/${role}`;
}

export const javaBubbleCheckIn2Revision =
	"79e4ebf1e155ecf060b07451d30fd0b7c93dffda";
export const javaBubbleSortArchiveID =
	"java-level-3-optional-java-foundations-bubble-sort-and-reference-archive";
export const javaCheckIn2ModuleID = "java-level-3-check-in-2";

const foundationID = "java-level-3-java-foundations-reference-archive";

export const javaBubbleSortProjects = [
	{
		pack: "AJ8-Bubble-Sort-Packs",
		id: `${foundationID}-curriculum-aj8-project-1-bubble-sort-implementation`
	},
	{
		pack: "AJ8-Alphabetical-Order-Packs",
		id: `${foundationID}-curriculum-aj8-project-2-alphabetical-order`
	},
	{
		pack: "J3-15-aj8-bubble-sort-supplemental-2",
		id: `${foundationID}-supplemental-bubble-sort-trace-practice`
	},
	{
		pack: "J3-16-aj8-bubble-sort-supplemental-3",
		id: `${foundationID}-supplemental-bubble-sort-optimization-practice`
	}
] as const;

export const javaCheckIn2Projects = [
	{
		pack: "AJ-Check-In-2-Workbook-Packs",
		id: `${javaCheckIn2ModuleID}-curriculum-java-level-3-check-in-2-overview`
	},
	{
		pack: "AJ-Check-In-2-Benchmark-Packs",
		id: `${javaCheckIn2ModuleID}-curriculum-java-level-3-check-in-2-practice-project`
	},
	{
		pack: "J3-19-check-in-2-supplemental-2",
		id: `${javaCheckIn2ModuleID}-supplemental-sorting-checkpoint-transfer-practice`
	},
	{
		pack: "J3-20-check-in-2-supplemental-3",
		id: `${javaCheckIn2ModuleID}-supplemental-sorting-checkpoint-extension-practice`
	}
] as const;

const bubbleAndCheckInProjects = [
	...javaBubbleSortProjects,
	...javaCheckIn2Projects
];

export function javaBubbleCheckIn2URL(
	pack: (typeof bubbleAndCheckInProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaBubbleCheckIn2Revision}/${pack}/${role}`;
}

export const javaSustainableRevision =
	"68e048d82539fe9b1e16295181a2042edfd785a9";
export const javaSustainableModuleID =
	"java-level-3-aj10-sustainable-programming";

export const javaSustainableProjects = [
	{
		pack: "AJ10-Bakery-Packs",
		id: `${javaSustainableModuleID}-curriculum-aj10-project-1-bakery-model`
	},
	{
		pack: "AJ10-Anything-Array-Packs",
		id: `${javaSustainableModuleID}-curriculum-aj10-project-2-anything-array`
	},
	{
		pack: "AJ10-Exceptions-Packs",
		id: `${javaSustainableModuleID}-curriculum-aj10-project-3-exception-practice`
	},
	{
		pack: "J3-21-aj10-sustainable-programming-supplemental-2",
		id: `${javaSustainableModuleID}-supplemental-refactoring-transfer-practice`
	},
	{
		pack: "J3-22-aj10-sustainable-programming-supplemental-3",
		id: `${javaSustainableModuleID}-supplemental-maintainability-extension-practice`
	}
] as const;

export function javaSustainableURL(
	pack: (typeof javaSustainableProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaSustainableRevision}/${pack}/${role}`;
}

export const javaLinkedListRevision =
	"14f6c4a008125873efd503abe59f7c3da5dbf6ca";
export const javaLinkedListModuleID = "java-level-3-aj11-linked-lists";

export const javaLinkedListProjects = [
	{
		pack: "AJ11-Singly-Linked-List-Packs",
		id: `${javaLinkedListModuleID}-curriculum-aj11-project-1-singly-linked-list`
	},
	{
		pack: "AJ11-Doubly-Linked-List-Packs",
		id: `${javaLinkedListModuleID}-curriculum-aj11-project-2-doubly-linked-list`
	},
	{
		pack: "J3-23-aj11-linked-lists-supplemental-2",
		id: `${javaLinkedListModuleID}-supplemental-linked-list-transfer-practice`
	},
	{
		pack: "J3-24-aj11-linked-lists-supplemental-3",
		id: `${javaLinkedListModuleID}-supplemental-linked-list-extension-practice`
	}
] as const;

export function javaLinkedListURL(
	pack: (typeof javaLinkedListProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaLinkedListRevision}/${pack}/${role}`;
}

export const javaStackQueueRevision =
	"1ab3db0dd93cdc52d6fa62200cd60c2f3eeb6ea7";
export const javaStackQueueModuleID = "java-level-3-aj12-stacks-and-queues";

export const javaStackQueueProjects = [
	{
		pack: "AJ12-Stack-Packs",
		id: `${javaStackQueueModuleID}-curriculum-aj12-project-1-implementing-a-stack`
	},
	{
		pack: "AJ12-Queue-Packs",
		id: `${javaStackQueueModuleID}-curriculum-aj12-project-2-implementing-a-queue`
	},
	{
		pack: "AJ12-Valid-Parentheses-Packs",
		id: `${javaStackQueueModuleID}-supplemental-aj12-supplemental-project-1-valid-parentheses`
	},
	{
		pack: "AJ12-Calculator-with-Stacks-Packs",
		id: `${javaStackQueueModuleID}-supplemental-aj12-supplemental-project-2-calculator-with-stacks`
	},
	{
		pack: "AJ12-Deque-Packs",
		id: `${javaStackQueueModuleID}-supplemental-aj12-supplemental-project-3-implementing-a-deque`
	}
] as const;

export function javaStackQueueURL(
	pack: (typeof javaStackQueueProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaStackQueueRevision}/${pack}/${role}`;
}

export const javaPriorityMapRevision =
	"be905396e93d8fd23bc469feb72127f809cd280b";
export const javaPriorityMapModuleID =
	"java-level-3-aj13-priority-queues-and-maps";

export const javaPriorityMapProjects = [
	{
		pack: "AJ13-Class-Rank-Packs",
		id: `${javaPriorityMapModuleID}-curriculum-aj13-project-1-class-rank`
	},
	{
		pack: "AJ13-Letter-Frequencies-Packs",
		id: `${javaPriorityMapModuleID}-curriculum-aj13-project-2-letter-frequencies`
	},
	{
		pack: "J3-25-aj13-priority-queues-and-maps-supplemental-2",
		id: `${javaPriorityMapModuleID}-supplemental-priority-queue-transfer-practice`
	},
	{
		pack: "J3-26-aj13-priority-queues-and-maps-supplemental-3",
		id: `${javaPriorityMapModuleID}-supplemental-map-lookup-extension-practice`
	}
] as const;

export function javaPriorityMapURL(
	pack: (typeof javaPriorityMapProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaPriorityMapRevision}/${pack}/${role}`;
}

export const javaCheckIn3Revision = "0092cb0068208745c24a7fed2014a992d09aae4b";
export const javaCheckIn3ModuleID = "java-level-3-check-in-3";

export const javaCheckIn3Projects = [
	{
		pack: "AJ-Check-In-3-Workbook-Packs",
		id: `${javaCheckIn3ModuleID}-curriculum-java-level-3-check-in-3-overview`
	},
	{
		pack: "AJ-Check-In-3-Collections-Practice-Packs",
		id: `${javaCheckIn3ModuleID}-curriculum-java-level-3-check-in-3-practice-project`
	},
	{
		pack: "J3-27-check-in-3-supplemental-2",
		id: `${javaCheckIn3ModuleID}-supplemental-data-structures-checkpoint-transfer-practice`
	},
	{
		pack: "J3-28-check-in-3-supplemental-3",
		id: `${javaCheckIn3ModuleID}-supplemental-data-structures-checkpoint-extension-practice`
	}
] as const;

export function javaCheckIn3URL(
	pack: (typeof javaCheckIn3Projects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaCheckIn3Revision}/${pack}/${role}`;
}

export const javaBinaryTreeRevision =
	"2219ebbf8c499f54a66f8219a657f952fe801e4d";
export const javaBinaryTreeModuleID = "java-level-3-aj14-binary-search-trees";

export const javaBinaryTreeProjects = [
	{
		pack: "AJ14-BST-Basic-Packs",
		id: `${javaBinaryTreeModuleID}-curriculum-aj14-project-1-bst-basic-implementation`
	},
	{
		pack: "AJ14-BST-Traversal-Packs",
		id: `${javaBinaryTreeModuleID}-curriculum-aj14-project-2-bst-traversals`
	},
	{
		pack: "AJ14-BST-Removal-Packs",
		id: `${javaBinaryTreeModuleID}-curriculum-aj14-project-3-bst-clear-and-remove`
	},
	{
		pack: "J3-29-aj14-binary-search-trees-supplemental-2",
		id: `${javaBinaryTreeModuleID}-supplemental-bst-traversal-transfer-practice`
	},
	{
		pack: "J3-30-aj14-binary-search-trees-supplemental-3",
		id: `${javaBinaryTreeModuleID}-supplemental-bst-mutation-extension-practice`
	}
] as const;

export function javaBinaryTreeURL(
	pack: (typeof javaBinaryTreeProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaBinaryTreeRevision}/${pack}/${role}`;
}

export const javaHashTableRevision = "c0354fdcc81a685334edeea6581aeecc30bb161c";
export const javaHashTableModuleID = "java-level-3-aj15-hash-tables";

export const javaHashTableProjects = [
	{
		pack: "AJ15-Hash-Map-Packs",
		id: `${javaHashTableModuleID}-curriculum-aj15-project-1-hashmap`
	},
	{
		pack: "AJ15-Search-Engine-Packs",
		id: `${javaHashTableModuleID}-curriculum-aj15-project-2-mini-search-engine`
	},
	{
		pack: "J3-31-aj15-hash-tables-supplemental-2",
		id: `${javaHashTableModuleID}-supplemental-hash-table-collision-transfer-practice`
	},
	{
		pack: "J3-32-aj15-hash-tables-supplemental-3",
		id: `${javaHashTableModuleID}-supplemental-hash-table-resizing-extension-practice`
	}
] as const;

export function javaHashTableURL(
	pack: (typeof javaHashTableProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaHashTableRevision}/${pack}/${role}`;
}

export const javaGraphRevision = "4f82efdb43585981242bb485b5686af94bc8f640";
export const javaGraphModuleID = "java-level-3-aj16-graphs";

export const javaGraphProjects = [
	{
		pack: "AJ16-Basic-Graph-Packs",
		id: `${javaGraphModuleID}-curriculum-aj16-project-1-basic-graph-implementation`
	},
	{
		pack: "AJ16-Shortest-Path-Packs",
		id: `${javaGraphModuleID}-curriculum-aj16-project-2-dijkstra-s-shortest-path`
	},
	{
		pack: "AJ16-Eulerian-Mail-Circuit-Packs",
		id: `${javaGraphModuleID}-supplemental-aj16-supplemental-project-1-eulerian-mail-circuit`
	},
	{
		pack: "J3-33-aj16-graphs-supplemental-2",
		id: `${javaGraphModuleID}-supplemental-graph-traversal-transfer-practice`
	},
	{
		pack: "J3-34-aj16-graphs-supplemental-3",
		id: `${javaGraphModuleID}-supplemental-graph-modeling-extension-practice`
	}
] as const;

export function javaGraphURL(
	pack: (typeof javaGraphProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaGraphRevision}/${pack}/${role}`;
}

const additionalAlgorithmFiles: Partial<Record<string, readonly string[]>> = {
	[javaBubbleSortProjects[1].id]: ["words.txt"],
	[javaCheckIn2Projects[1].id]: [
		"BubbleSort.java",
		"InsertionSort.java",
		"ListGenerator.java",
		"MergeSort.java",
		"SelectionSort.java",
		"Sort.java"
	],
	[javaSustainableProjects[0].id]: ["Bakery.java"],
	[javaSustainableProjects[2].id]: ["sample.txt"],
	[javaLinkedListProjects[0].id]: ["LinkedList.java", "ListContract.java"],
	[javaLinkedListProjects[1].id]: [
		"DoublyLinkedList.java",
		"ListContract.java"
	],
	[javaHashTableProjects[0].id]: ["HashMap.java", "Map.java"],
	[javaHashTableProjects[1].id]: ["HashMap.java", "Map.java", "corpus.txt"]
};

const searchGroups = [
	{ revision: javaSearchRevision, projects: javaSearchProjects },
	{ revision: javaBinarySearchRevision, projects: javaBinarySearchProjects },
	{ revision: javaCheckIn1Revision, projects: javaCheckIn1Projects },
	{ revision: javaSortingRevision, projects: javaSortingProjects },
	{
		revision: javaBubbleCheckIn2Revision,
		projects: bubbleAndCheckInProjects
	},
	{ revision: javaSustainableRevision, projects: javaSustainableProjects },
	{ revision: javaLinkedListRevision, projects: javaLinkedListProjects },
	{ revision: javaStackQueueRevision, projects: javaStackQueueProjects },
	{ revision: javaPriorityMapRevision, projects: javaPriorityMapProjects },
	{ revision: javaCheckIn3Revision, projects: javaCheckIn3Projects },
	{ revision: javaBinaryTreeRevision, projects: javaBinaryTreeProjects },
	{ revision: javaHashTableRevision, projects: javaHashTableProjects },
	{ revision: javaGraphRevision, projects: javaGraphProjects }
] as const;

export const javaLevel3SearchProjects = [
	...javaSearchProjects,
	...javaBinarySearchProjects,
	...javaCheckIn1Projects,
	...javaSortingProjects,
	...bubbleAndCheckInProjects,
	...javaSustainableProjects,
	...javaLinkedListProjects,
	...javaStackQueueProjects,
	...javaPriorityMapProjects,
	...javaCheckIn3Projects,
	...javaBinaryTreeProjects,
	...javaHashTableProjects,
	...javaGraphProjects
];

export function javaCheckIn1URL(
	pack: (typeof javaCheckIn1Projects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaCheckIn1Revision}/${pack}/${role}`;
}

export function javaBinarySearchURL(
	pack: (typeof javaBinarySearchProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaBinarySearchRevision}/${pack}/${role}`;
}

export function javaSearchURL(pack: string, role: "starter" | "solution") {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaSearchRevision}/${pack}/${role}`;
}

export function javaSearchResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3"
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	const group = searchGroups.find(
		candidate => candidate.revision === resource.ref
	);
	const project = group?.projects.find(candidate => candidate.pack === pack);
	if (
		!project ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, project, role };
}

export function javaLevel3ProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaSearchResource(url);
	if (selected && courseID === "java-level-3") {
		return `${courseID}:${selected.project.id}:${role}:native-java-search`;
	}
	return javaRecursionProjectKey(courseID, itemID, role, url);
}

export function javaSearchImportFiles(url: string) {
	const selected = javaSearchResource(url);
	if (!selected) return null;
	const files = [
		"Main.java",
		"ContractTests.java",
		"README.md",
		...(additionalAlgorithmFiles[selected.project.id] ?? [])
	];
	return files.map(name => {
		const path = `${selected.resource.path}/${name}`;
		return {
			name,
			file: {
				path,
				label: name,
				size: null,
				htmlUrl: `https://github.com/${selected.resource.owner}/${selected.resource.repo}/blob/${selected.resource.ref}/${path}`,
				rawUrl: githubRawUrl(selected.resource, path)
			}
		};
	});
}
