import type { RawCourse } from "./types";
import encoding from "./readings/machine-learning-car-studio/encoding.md?raw";
import probe from "./readings/machine-learning-car-studio/probe.md?raw";
import review from "./readings/machine-learning-car-studio/review.md?raw";

export function applyMachineLearningCarStudioReadings(course: RawCourse) {
	const module = course.modules.find(
		candidate =>
			candidate.title === "KNN Car Classification: Practice Studio"
	);
	for (const [title, content] of [
		["KNN Car Classification: Core Concepts", encoding],
		["KNN Car Classification: Guided Example", probe],
		["Review: KNN Car Classification", review]
	] as const) {
		const item = module?.curriculum.find(
			candidate => candidate.title === title
		);
		if (!item)
			throw new Error(`Missing Machine Learning car reading: ${title}`);
		item.content = content;
		item.contentKind = "reading";
		item.preserveInstructions = true;
		item.preserveAssignment = true;
	}
}
