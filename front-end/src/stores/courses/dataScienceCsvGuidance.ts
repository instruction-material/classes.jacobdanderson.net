import type { RawCourse, RawCourseModuleItem } from "./types";
import { dataScienceCsvRevision } from "@/modules/dataScienceCsvResources";
import guidance from "./dataScienceCsvGuidanceData.json";

export function applyDataScienceCsvGuidance(course: RawCourse) {
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
			const root = `https://github.com/instruction-material/Data-Science/tree/${dataScienceCsvRevision}/${entry.folder}`;
			item.projectLink = `${root}/starter`;
			item.solutionLink = `${root}/solution`;
			item.ideImport = true;
			item.datasetLink = `https://github.com/instruction-material/Data-Science/blob/${dataScienceCsvRevision}/${entry.folder}/starter/data/sample.csv`;
		}
	}
	const domainModule = course.modules.find(
		module => module.title === "Module 8: Domain Projects"
	);
	const domain = domainModule?.curriculum.find(
		item => item.title === "Domain Projects Core Concepts"
	);
	if (!domain)
		throw new Error("Missing Data Science domain dataset reference.");
	domain.datasetLink =
		"https://static.classes.jacobdanderson.net/life_expectancy.csv";
	domain.content +=
		"\n\n**Optional domain dataset:** The linked life-expectancy CSV is a separate domain input. Inspect its actual header, units and source context before choosing a question. The earlier CSV studio uses its own bundled synthetic sample.";
}
