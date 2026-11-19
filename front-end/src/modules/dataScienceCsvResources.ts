import { parseGitHubResource } from "./codePreview";

export const dataScienceCsvRevision =
	"b0f82992a9bd38039971d31f6e4b2f86beaefd82";
export const dataScienceCsvFolders = [
	"DSP-01-data-analysis-lab-11",
	"DSP-20-applied-studio-11-data-analysis-lab-11-supplemental-2",
	"DSP-21-applied-studio-11-data-analysis-lab-11-supplemental-3"
];

export function dataScienceCsvProjectKey(
	courseId: string,
	itemId: string,
	role: "starter" | "reference",
	sourceUrl: string
) {
	const base = `${courseId}:${itemId}:${role}`;
	const resource = parseGitHubResource(sourceUrl);
	if (
		courseId !== "data-science-in-python" ||
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "data-science" ||
		resource.ref !== dataScienceCsvRevision
	) {
		return base;
	}
	const [folder, sourceRole, extra] = resource.path.split("/");
	if (
		!folder ||
		!dataScienceCsvFolders.includes(folder) ||
		sourceRole !== (role === "reference" ? "solution" : "starter") ||
		extra !== undefined
	) {
		return base;
	}
	return `${courseId}:${folder}:${role}:csv-studio-v1`;
}
