import { parseGitHubResource } from "./codePreview";

export const dataScienceGroupedRevision =
	"d5e810546f6fe59d3ac0fca697f372d33feb3d4f";
export const dataScienceGroupedFolders = [
	"DSP-03-data-analysis-lab-13",
	"DSP-24-applied-studio-13-data-analysis-lab-13-supplemental-2",
	"DSP-25-applied-studio-13-data-analysis-lab-13-supplemental-3"
];

export function dataScienceGroupedProjectKey(
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
		resource.ref !== dataScienceGroupedRevision
	) {
		return null;
	}
	const [folder, sourceRole, extra] = resource.path.split("/");
	if (
		!folder ||
		!dataScienceGroupedFolders.includes(folder) ||
		sourceRole !== (role === "reference" ? "solution" : "starter") ||
		extra !== undefined
	) {
		return null;
	}
	return `${courseId}:${folder}:${role}:grouped-studio-v1`;
}
