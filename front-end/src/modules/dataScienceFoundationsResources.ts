import { parseGitHubResource } from "./codePreview";

export const dataScienceFoundationsRevision =
	"a56978e9116a6d7121fffa08aea490e905a99a5d";

const foundationsFolders = new Set([
	"DSP-09-module-2-notebook-workflow-and-reproducibility",
	"DSP-05-module-2-notebook-workflow-and-reproducibility-supplemental-2",
	"DSP-06-module-2-notebook-workflow-and-reproducibility-supplemental-3"
]);

export function dataScienceFoundationsProjectKey(
	role: "starter" | "reference",
	sourceUrl: string
) {
	const resource = parseGitHubResource(sourceUrl);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "data-science" ||
		resource.ref !== dataScienceFoundationsRevision
	) {
		return null;
	}
	const [folder, sourceRole, extra] = resource.path.split("/");
	if (
		!foundationsFolders.has(folder) ||
		sourceRole !== (role === "reference" ? "solution" : "starter") ||
		extra !== undefined
	) {
		return null;
	}
	return `data-science-in-python:${folder}:${role}:reproducibility-v1`;
}
