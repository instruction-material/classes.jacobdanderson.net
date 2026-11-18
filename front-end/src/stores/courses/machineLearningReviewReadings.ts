import type { RawCourse } from "./types";
import content2 from "./readings/machine-learning-worked-cores/capstone-implementation.md?raw";
import content3 from "./readings/machine-learning-worked-cores/course-next-steps.md?raw";
import content1 from "./readings/machine-learning-worked-cores/housing-review.md?raw";
import content4 from "./readings/machine-learning-worked-cores/image-further-reading.md?raw";
import content5 from "./readings/machine-learning-worked-cores/image-review.md?raw";
import content0 from "./readings/machine-learning-worked-cores/regression-metrics.md?raw";

const definitions = [
	{
		moduleTitle: "ML6 Regression with Neural Networks",
		title: "Evaluating Regression Models",
		content: content0
	},
	{
		moduleTitle: "ML6 Regression with Neural Networks",
		title: "Verification Review: Regression with Neural Networks",
		content: content1
	},
	{
		moduleTitle: "ML8 Master Project",
		title: "Master Project Implementation",
		content: content2
	},
	{
		moduleTitle: "ML8 Master Project",
		title: "Course Recap & Next Steps",
		content: content3
	},
	{
		moduleTitle: "ML7 Image Classifier",
		title: "Further Reading on ML Models",
		content: content4
	},
	{
		moduleTitle: "ML7 Image Classifier",
		title: "Verification Review: Image Classifier",
		content: content5
	}
];
export function applyMachineLearningReviewReadings(course: RawCourse) {
	for (const entry of definitions) {
		const module = course.modules.find(
			candidate => candidate.title === entry.moduleTitle
		);
		const item = module?.curriculum.find(
			candidate => candidate.title === entry.title
		);
		if (!item) {
			throw new Error(
				`Missing Machine Learning review reading: ${entry.title}`
			);
		}
		item.content = entry.content;
		item.contentKind = "reading";
		item.preserveInstructions = true;
		item.preserveAssignment = true;
	}
}
