import type { RawCourse, RawCourseModuleItem } from "./types";
import { dataScienceGroupedRevision } from "@/modules/dataScienceGroupedResources";
import guidance from "./dataScienceGroupedGuidanceData.json";

export function applyDataScienceGroupedGuidance(course: RawCourse) {
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
		if (entry.folder) {
			const root = `https://github.com/instruction-material/Data-Science/tree/${dataScienceGroupedRevision}/${entry.folder}`;
			item.projectLink = `${root}/starter`;
			item.solutionLink = `${root}/solution`;
			item.ideImport = true;
			item.datasetLink = `https://github.com/instruction-material/Data-Science/blob/${dataScienceGroupedRevision}/${entry.folder}/starter/data/sample.csv`;
		}
	}
}
