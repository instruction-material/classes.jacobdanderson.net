import type { RawCourse, RawCourseModuleItem } from "./types";
import {
	dataScienceStatisticsStorytellingRevision,
	dataScienceStatisticsStorytellingSource
} from "@/modules/dataScienceStatisticsStorytellingResources";
import guidance from "./dataScienceStatisticsStorytellingGuidanceData.json";

const repository = "https://github.com/instruction-material/Data-Science";

export function applyDataScienceStatisticsStorytellingGuidance(
	course: RawCourse
) {
	for (const entry of guidance) {
		const module = course.modules.find(
			candidate => candidate.title === entry.module
		);
		const items =
			entry.group === "curriculum"
				? module?.curriculum
				: module?.supplementalProjects;
		const item = items?.find(candidate => candidate.title === entry.title);
		if (!item) {
			throw new Error(`Missing Data Science activity: ${entry.title}`);
		}

		item.content = entry.content;
		item.contentKind =
			entry.contentKind as RawCourseModuleItem["contentKind"];
		item.preserveInstructions = true;
		item.preserveAssignment = true;
		delete item.projectLink;
		delete item.solutionLink;
		delete item.ideImport;
		delete item.datasetLink;

		if (!entry.pack) continue;
		const source = dataScienceStatisticsStorytellingSource(entry.pack);
		if (!source) {
			throw new Error(`Missing Data Science source pack: ${entry.pack}`);
		}
		const revision = dataScienceStatisticsStorytellingRevision;
		item.projectLink = `${repository}/tree/${revision}/${source.starter}`;
		item.solutionLink = `${repository}/tree/${revision}/${source.reference}`;
		item.ideImport = true;
		if (source.dataset)
			item.datasetLink = `${repository}/blob/${revision}/${source.dataset}`;
	}
}
