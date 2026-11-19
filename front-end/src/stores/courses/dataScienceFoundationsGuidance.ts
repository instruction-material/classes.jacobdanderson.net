import type { RawCourse, RawCourseModuleItem } from "./types";
import { dataScienceFoundationsSource } from "@/modules/dataScienceFoundationsResources";
import guidance from "./dataScienceFoundationsGuidanceData.json";

export function applyDataScienceFoundationsGuidance(course: RawCourse) {
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
		if (
			entry.learningPath === "choice" ||
			entry.learningPath === "challenge"
		) {
			item.learningPath = entry.learningPath;
		}
		item.preserveInstructions = true;
		item.preserveAssignment = true;
		delete item.projectLink;
		delete item.solutionLink;
		delete item.ideImport;
		delete item.datasetLink;
		if (entry.datasetLink) item.datasetLink = entry.datasetLink;
		if (entry.folder) {
			const repo = "https://github.com/instruction-material/Data-Science";
			const pack = dataScienceFoundationsSource(entry.folder);
			if (!pack) {
				throw new Error(
					`Missing Data Science source pack: ${entry.folder}`
				);
			}
			const source = `${pack.revision}/${entry.folder}`;
			item.projectLink = `${repo}/tree/${source}/starter`;
			item.solutionLink = `${repo}/tree/${source}/solution`;
			item.ideImport = true;
			if (pack.datasetPath) {
				item.datasetLink = `${repo}/blob/${source}/starter/${pack.datasetPath}`;
			}
		}
	}
}
