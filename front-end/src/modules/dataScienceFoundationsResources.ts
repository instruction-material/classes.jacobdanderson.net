import { parseGitHubResource } from "./codePreview";

export const dataScienceFoundationsRevision =
	"a56978e9116a6d7121fffa08aea490e905a99a5d";

const reproducibilityFolders = new Set([
	"DSP-09-module-2-notebook-workflow-and-reproducibility",
	"DSP-05-module-2-notebook-workflow-and-reproducibility-supplemental-2",
	"DSP-06-module-2-notebook-workflow-and-reproducibility-supplemental-3"
]);

const tabularFolders = new Set([
	"DSP-10-module-3-pandas-foundations",
	"DSP-07-module-3-pandas-foundations-supplemental-2",
	"DSP-08-module-3-pandas-foundations-supplemental-3",
	"DSP-11-module-4-cleaning-and-validation",
	"DSP-09-module-4-cleaning-and-validation-supplemental-2",
	"DSP-10-module-4-cleaning-and-validation-supplemental-3"
]);

export function dataScienceFoundationsSource(folder: string) {
	if (reproducibilityFolders.has(folder)) {
		return {
			revision: dataScienceFoundationsRevision,
			keySuffix: "reproducibility-v1"
		};
	}
	if (tabularFolders.has(folder)) {
		return {
			revision: "693f9b92c3da20526a4a37e80f19f9f0a6ee84f2",
			keySuffix: "tabular-v1"
		};
	}
	return null;
}

export function dataScienceFoundationsProjectKey(
	role: "starter" | "reference",
	sourceUrl: string
) {
	const resource = parseGitHubResource(sourceUrl);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "data-science"
	) {
		return null;
	}
	const [folder, sourceRole, extra] = resource.path.split("/");
	const source = dataScienceFoundationsSource(folder);
	if (
		!source ||
		resource.ref !== source.revision ||
		sourceRole !== (role === "reference" ? "solution" : "starter") ||
		extra !== undefined
	) {
		return null;
	}
	return `data-science-in-python:${folder}:${role}:${source.keySuffix}`;
}
