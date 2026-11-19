import { parseGitHubResource } from "./codePreview";

export const dataScienceStatisticsStorytellingRevision =
	"be7ce3fa3bd556a95a0a4bfe86525ac1ed403cba";

interface SourcePack {
	starter: string;
	reference: string;
	dataset?: string;
}

const sourcePacks: Partial<Record<string, SourcePack>> = {
	"simple-stats": {
		starter: "DS1-Simple-Stats-Starter",
		reference: "DS1-Simple-Stats"
	},
	"mode-finder": {
		starter: "DS1-Mode-Starter",
		reference: "DS1-Mode"
	},
	"DSP-11-module-5-visualization-and-statistics-in-context-supplemental-3": {
		starter:
			"DSP-11-module-5-visualization-and-statistics-in-context-supplemental-3/starter",
		reference:
			"DSP-11-module-5-visualization-and-statistics-in-context-supplemental-3/solution",
		dataset:
			"DSP-11-module-5-visualization-and-statistics-in-context-supplemental-3/starter/data/sample.csv"
	},
	"DSP-12-module-6-storytelling-with-data": {
		starter: "DSP-12-module-6-storytelling-with-data/starter",
		reference: "DSP-12-module-6-storytelling-with-data/solution",
		dataset:
			"DSP-12-module-6-storytelling-with-data/starter/data/sample.csv"
	},
	"DSP-12-module-6-storytelling-with-data-supplemental-2": {
		starter:
			"DSP-12-module-6-storytelling-with-data-supplemental-2/starter",
		reference:
			"DSP-12-module-6-storytelling-with-data-supplemental-2/solution",
		dataset:
			"DSP-12-module-6-storytelling-with-data-supplemental-2/starter/data/sample.csv"
	},
	"DSP-13-module-6-storytelling-with-data-supplemental-3": {
		starter:
			"DSP-13-module-6-storytelling-with-data-supplemental-3/starter",
		reference:
			"DSP-13-module-6-storytelling-with-data-supplemental-3/solution",
		dataset:
			"DSP-13-module-6-storytelling-with-data-supplemental-3/starter/data/sample.csv"
	}
};

export function dataScienceStatisticsStorytellingSource(identity: string) {
	return Object.hasOwn(sourcePacks, identity)
		? sourcePacks[identity]
		: undefined;
}

export function dataScienceStatisticsStorytellingProjectKey(
	role: "starter" | "reference",
	sourceUrl: string
) {
	const resource = parseGitHubResource(sourceUrl);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "data-science" ||
		resource.ref !== dataScienceStatisticsStorytellingRevision
	) {
		return null;
	}
	const identity = Object.keys(sourcePacks).find(
		key => sourcePacks[key]?.[role] === resource.path
	);
	return identity
		? `data-science-in-python:${identity}:${role}:statistics-storytelling-v1`
		: null;
}
