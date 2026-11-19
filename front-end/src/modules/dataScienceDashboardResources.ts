import { parseGitHubResource } from "./codePreview";

export const dataScienceDashboardRevision =
	"5cd0d1b4c2158c5a16b85e28c92f404bf023c787";
export const dataScienceDashboardFolders = [
	"DSP-06-data-analysis-lab-16",
	"DSP-31-applied-studio-16-data-analysis-lab-16-supplemental-3",
	"DSP-07-data-analysis-lab-17"
];

export function dataScienceDashboardProjectKey(
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
		resource.ref !== dataScienceDashboardRevision
	) {
		return null;
	}
	const [folder, sourceRole, extra] = resource.path.split("/");
	if (
		!folder ||
		!dataScienceDashboardFolders.includes(folder) ||
		sourceRole !== (role === "reference" ? "solution" : "starter") ||
		extra !== undefined
	) {
		return null;
	}
	return `${courseId}:${folder}:${role}:dashboard-capstone-v1`;
}
