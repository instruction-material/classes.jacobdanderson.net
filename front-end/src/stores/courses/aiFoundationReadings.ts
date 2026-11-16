import type { RawCourse } from "./types";
import readings from "./aiFoundationReadingsData.json";

const planningAppendices = new Set([
	"Course Roadmap",
	"Project Practice Guide",
	"Dataset, Model, and Evaluation Catalog",
	"Data Science, AI Foundations, and Machine Learning Boundary Map",
	"AI Level 1: Toolchain and Version Assumptions",
	"Pending Source Media Inventory"
]);

export function applyAiFoundationReadings(
	course: RawCourse,
	progressId: (value: string) => string
) {
	let applied = 0;
	for (const module of course.modules) {
		const previousTitle = module.title;
		if (planningAppendices.has(previousTitle)) {
			module.internal = true;
			continue;
		}
		if (previousTitle === "Standards Map") {
			module.id ??= progressId(`ai-level-1-${previousTitle}`);
			module.aliases = [
				...new Set([...(module.aliases ?? []), previousTitle])
			];
			module.title = "AI Level 1 Reference";
		}
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			if (
				/^https:\/\/github\.com\/instruction-material\/AI-Level-1\/tree\/[a-f0-9]{40}\/.+$/i.test(
					item.projectLink ?? ""
				)
			) {
				item.ideImport = true;
			}
			const entry = readings.find(
				row => row.module === previousTitle && row.title === item.title
			);
			if (!entry) continue;
			if ("displayTitle" in entry && entry.displayTitle) {
				item.id ??= progressId(
					`${
						module.id ?? progressId(`ai-level-1-${previousTitle}`)
					}-${
						module.curriculum.includes(item)
							? "curriculum"
							: "supplemental"
					}-${item.title}`
				);
				item.aliases = [
					...new Set([...(item.aliases ?? []), item.title])
				];
				item.title = entry.displayTitle;
			}
			item.content = entry.content;
			item.contentKind =
				entry.contentKind === "reading" ? "reading" : "assignment";
			item.preserveInstructions = true;
			if (item.contentKind === "assignment")
				item.preserveAssignment = true;
			applied += 1;
		}
	}
	if (applied !== readings.length)
		throw new Error("Incomplete AI foundation readings and assignments.");
}
