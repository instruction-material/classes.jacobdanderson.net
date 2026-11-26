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

const additionalAlgorithmFiles: Partial<Record<string, readonly string[]>> = {
	[javaBubbleSortProjects[1].id]: ["words.txt"],
	[javaCheckIn2Projects[1].id]: [
		"BubbleSort.java",
		"InsertionSort.java",
		"ListGenerator.java",
		"MergeSort.java",
		"SelectionSort.java",
		"Sort.java"
	]
};

export function javaBubbleCheckIn2URL(
	pack: (typeof bubbleAndCheckInProjects)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaBubbleCheckIn2Revision}/${pack}/${role}`;
}

const searchGroups = [
	{ revision: javaSearchRevision, projects: javaSearchProjects },
	{ revision: javaBinarySearchRevision, projects: javaBinarySearchProjects },
	{ revision: javaCheckIn1Revision, projects: javaCheckIn1Projects },
	{ revision: javaSortingRevision, projects: javaSortingProjects },
	{ revision: javaBubbleCheckIn2Revision, projects: bubbleAndCheckInProjects }
] as const;

export const javaLevel3SearchProjects = [
	...javaSearchProjects,
	...javaBinarySearchProjects,
	...javaCheckIn1Projects,
	...javaSortingProjects,
	...bubbleAndCheckInProjects
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
