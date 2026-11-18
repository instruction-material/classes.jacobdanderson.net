import type { RawCourse } from "./types";
import reading3 from "./readings/machine-learning-studios/centroid-concepts.md?raw";
import reading4 from "./readings/machine-learning-studios/centroid-example.md?raw";
import reading5 from "./readings/machine-learning-studios/centroid-review.md?raw";
import reading6 from "./readings/machine-learning-studios/customer-analysis-concepts.md?raw";
import reading7 from "./readings/machine-learning-studios/customer-analysis-example.md?raw";
import reading8 from "./readings/machine-learning-studios/customer-analysis-review.md?raw";
import reading0 from "./readings/machine-learning-studios/customer-loop-concepts.md?raw";
import reading1 from "./readings/machine-learning-studios/customer-loop-example.md?raw";
import reading2 from "./readings/machine-learning-studios/customer-loop-review.md?raw";
import reading12 from "./readings/machine-learning-studios/movie-analysis-concepts.md?raw";
import reading13 from "./readings/machine-learning-studios/movie-analysis-example.md?raw";
import reading14 from "./readings/machine-learning-studios/movie-analysis-review.md?raw";
import reading9 from "./readings/machine-learning-studios/movie-pipeline-concepts.md?raw";
import reading10 from "./readings/machine-learning-studios/movie-pipeline-example.md?raw";
import reading11 from "./readings/machine-learning-studios/movie-pipeline-review.md?raw";

const definitions = [
	{
		module: "Customer Segmentation Starter Build: Practice Studio",
		title: "Customer Segmentation Starter Build: Core Concepts",
		content: reading0
	},
	{
		module: "Customer Segmentation Starter Build: Practice Studio",
		title: "Customer Segmentation Starter Build: Guided Example",
		content: reading1
	},
	{
		module: "Customer Segmentation Starter Build: Practice Studio",
		title: "Review: Customer Segmentation Starter Build",
		content: reading2
	},
	{
		module: "Customer Segmentation Interview: Practice Studio",
		title: "Customer Segmentation Interview: Core Concepts",
		content: reading3
	},
	{
		module: "Customer Segmentation Interview: Practice Studio",
		title: "Customer Segmentation Interview: Guided Example",
		content: reading4
	},
	{
		module: "Customer Segmentation Interview: Practice Studio",
		title: "Review: Customer Segmentation Interview",
		content: reading5
	},
	{
		module: "Customer Segmentation: Practice Studio",
		title: "Customer Segmentation: Core Concepts",
		content: reading6
	},
	{
		module: "Customer Segmentation: Practice Studio",
		title: "Customer Segmentation: Guided Example",
		content: reading7
	},
	{
		module: "Customer Segmentation: Practice Studio",
		title: "Review: Customer Segmentation",
		content: reading8
	},
	{
		module: "Disney Movie Clustering Starter Build: Practice Studio",
		title: "Disney Movie Clustering Starter Build: Core Concepts",
		content: reading9
	},
	{
		module: "Disney Movie Clustering Starter Build: Practice Studio",
		title: "Disney Movie Clustering Starter Build: Guided Example",
		content: reading10
	},
	{
		module: "Disney Movie Clustering Starter Build: Practice Studio",
		title: "Review: Disney Movie Clustering Starter Build",
		content: reading11
	},
	{
		module: "Disney Movie Clustering: Practice Studio",
		title: "Disney Movie Clustering: Core Concepts",
		content: reading12
	},
	{
		module: "Disney Movie Clustering: Practice Studio",
		title: "Disney Movie Clustering: Guided Example",
		content: reading13
	},
	{
		module: "Disney Movie Clustering: Practice Studio",
		title: "Review: Disney Movie Clustering",
		content: reading14
	}
];

export function applyMachineLearningClusteringStudioReadings(
	course: RawCourse
) {
	for (const definition of definitions) {
		const module = course.modules.find(
			row => row.title === definition.module
		);
		const item = module?.curriculum.find(
			row => row.title === definition.title
		);
		if (!item) {
			throw new Error(
				`Missing Machine Learning studio reading: ${definition.title}`
			);
		}
		item.content = definition.content;
		item.contentKind = "reading";
		item.preserveInstructions = true;
		item.preserveAssignment = true;
	}
}
