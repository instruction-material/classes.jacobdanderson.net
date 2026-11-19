import { parseGitHubResource } from "./codePreview";

export const dataScienceChartRevision =
	"bafc5488641ec8940b64057eaaff48b13ca63207";
export const dataScienceChartFolders = [
	"DSP-04-data-analysis-lab-14",
	"DSP-26-applied-studio-14-data-analysis-lab-14-supplemental-2"
];

export function dataScienceChartProjectKey(
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
		resource.ref !== dataScienceChartRevision
	) {
		return null;
	}
	const [folder, sourceRole, extra] = resource.path.split("/");
	if (
		!folder ||
		!dataScienceChartFolders.includes(folder) ||
		sourceRole !== (role === "reference" ? "solution" : "starter") ||
		extra !== undefined
	) {
		return null;
	}
	return `${courseId}:${folder}:${role}:chart-studio-v1`;
}
