import { parseGitHubResource } from "./codePreview";

export const dataScienceReportRevision =
	"0aefbfaef8a65237d1e47cee98355b6717481a25";
export const dataScienceReportFolders = [
	"DSP-05-data-analysis-lab-15",
	"DSP-28-applied-studio-15-data-analysis-lab-15-supplemental-2"
];

export function dataScienceReportProjectKey(
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
		resource.ref !== dataScienceReportRevision
	) {
		return null;
	}
	const [folder, sourceRole, extra] = resource.path.split("/");
	if (
		!folder ||
		!dataScienceReportFolders.includes(folder) ||
		sourceRole !== (role === "reference" ? "solution" : "starter") ||
		extra !== undefined
	) {
		return null;
	}
	return `${courseId}:${folder}:${role}:report-studio-v1`;
}
