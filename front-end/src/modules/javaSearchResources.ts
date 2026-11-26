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
		resource.repo.toLowerCase() !== "java-level-3" ||
		![javaSearchRevision, javaBinarySearchRevision].includes(resource.ref)
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	const projects =
		resource.ref === javaBinarySearchRevision
			? javaBinarySearchProjects
			: javaSearchProjects;
	const project = projects.find(candidate => candidate.pack === pack);
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
	return ["Main.java", "ContractTests.java", "README.md"].map(name => {
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
