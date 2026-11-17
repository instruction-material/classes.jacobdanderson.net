import type { RawCourse } from "./types";
import readings from "./machine-learning-clustering-readings.json";

/** Replace normalized filler while retaining each existing progress identity. */
export function applyMachineLearningClusteringReadings(course: RawCourse) {
	const module = course.modules.find(
		candidate => candidate.title === "ML1 K-Means Clustering"
	);
	if (!module) throw new Error("Missing Machine Learning clustering module");
	for (const [title, content] of Object.entries(readings)) {
		const item = module.curriculum.find(
			candidate => candidate.title === title
		);
		if (!item) throw new Error(`Missing clustering reading: ${title}`);
		item.content = content;
		item.contentKind = "reading";
		item.preserveInstructions = true;
		if (title === "Optional Google Colab Orientation")
			item.learningPath = "choice";
	}
}
