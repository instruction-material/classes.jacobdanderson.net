import { parseGitHubResource } from "./codePreview";

export const dataScienceCleaningRevision =
	"68317c129f0962e5e71a5d53120119f605185c62";
export const dataScienceCleaningFolders = ["DSP-02-data-analysis-lab-12"];

export function dataScienceCleaningProjectKey(
	courseId: string,
	_itemId: string,
	role: "starter" | "reference",
	sourceUrl: string
) {
	const resource = parseGitHubResource(sourceUrl);
	if (
		courseId !== "data-science-in-python" ||
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "data-science" ||
		resource.ref !== dataScienceCleaningRevision
	) {
		return null;
	}
	const [folder, sourceRole, extra] = resource.path.split("/");
	if (
		!folder ||
		!dataScienceCleaningFolders.includes(folder) ||
		sourceRole !== (role === "reference" ? "solution" : "starter") ||
		extra !== undefined
	) {
		return null;
	}
	return `${courseId}:${folder}:${role}:cleaning-studio-v1`;
}
