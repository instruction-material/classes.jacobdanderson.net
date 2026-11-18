import type { RawCourse } from "./types";
import content2 from "./readings/machine-learning-worked-cores/dataset-catalog.md?raw";
import content4 from "./readings/machine-learning-worked-cores/evaluation-interpretation.md?raw";
import content7 from "./readings/machine-learning-worked-cores/evaluation-report.md?raw";
import content1 from "./readings/machine-learning-worked-cores/model-review.md?raw";
import content5 from "./readings/machine-learning-worked-cores/model-use-limits.md?raw";
import content6 from "./readings/machine-learning-worked-cores/readiness-card.md?raw";
import content0 from "./readings/machine-learning-worked-cores/reference-guide.md?raw";
import content3 from "./readings/machine-learning-worked-cores/reproduce-comparison.md?raw";

const definitions = [
	{
		module: "Standards Map",
		collection: "curriculum",
		title: "Machine Learning Reference Guide",
		displayTitle: "Course reference",
		content: content0,
		kind: "reading"
	},
	{
		module: "Project Practice Guide",
		collection: "curriculum",
		title: "Machine Learning Rubric",
		displayTitle: "Review criteria",
		content: content1,
		kind: "reading"
	},
	{
		module: "Dataset, Model, and Evaluation Catalog",
		collection: "curriculum",
		title: "Approved Dataset and Fixture Sources",
		displayTitle: "Supplied datasets",
		content: content2,
		kind: "reading"
	},
	{
		module: "Dataset, Model, and Evaluation Catalog",
		collection: "curriculum",
		title: "Reproducibility Contract",
		displayTitle: "Reproduce a comparison",
		content: content3,
		kind: "reading"
	},
	{
		module: "Dataset, Model, and Evaluation Catalog",
		collection: "curriculum",
		title: "Evaluation and Limitation Notes",
		displayTitle: "Interpret an evaluation",
		content: content4,
		kind: "reading"
	},
	{
		module: "Dataset, Model, and Evaluation Catalog",
		collection: "curriculum",
		title: "Responsible Use Check",
		displayTitle: "Model use and limits",
		content: content5,
		kind: "reading"
	},
	{
		module: "Dataset, Model, and Evaluation Catalog",
		collection: "supplementalProjects",
		title: "Catalog Project: Dataset Readiness Card",
		displayTitle: "Dataset readiness card",
		content: content6,
		kind: "assignment"
	},
	{
		module: "Dataset, Model, and Evaluation Catalog",
		collection: "supplementalProjects",
		title: "Catalog Project: Evaluation Report",
		displayTitle: "Evaluation report",
		content: content7,
		kind: "assignment"
	}
] as const;
const archivedModules = new Set([
	"Pending Static Assets",
	"Course Roadmap",
	"Data Science, AI Foundations, and Machine Learning Boundary Map"
]);
const moduleTitles: Record<string, string> = {
	"Standards Map": "Machine Learning Reference",
	"Project Practice Guide": "Model Review",
	"Dataset, Model, and Evaluation Catalog": "Datasets and Model Reports"
};

export function applyMachineLearningSupportReadings(
	course: RawCourse,
	progressId: (value: string) => string
) {
	let applied = 0;
	for (const module of course.modules) {
		const previousTitle =
			Object.keys(moduleTitles).find(
				title =>
					module.title === title || module.aliases?.includes(title)
			) ?? module.title;
		if (archivedModules.has(previousTitle)) {
			module.internal = true;
			continue;
		}
		if (
			module.kind === "appendix" &&
			previousTitle !== "ML7 Image Classifier"
		) {
			module.keyBlocks = [];
		}
		if (moduleTitles[previousTitle]) {
			module.id ??= progressId(`machine-learning-${previousTitle}`);
			module.aliases = [
				...new Set([...(module.aliases ?? []), previousTitle])
			];
			module.title = moduleTitles[previousTitle]!;
		}
		for (const collection of [
			"curriculum",
			"supplementalProjects"
		] as const) {
			for (const item of module[collection]) {
				if (moduleTitles[previousTitle]) {
					item.id ??= progressId(
						`${module.id}-${
							collection === "curriculum"
								? "curriculum"
								: "supplemental"
						}-${item.title}`
					);
				}
				const entry = definitions.find(
					row =>
						row.module === previousTitle &&
						row.collection === collection &&
						(row.title === item.title ||
							item.aliases?.includes(row.title))
				);
				if (!entry) {
					if (
						previousTitle === "Standards Map" ||
						previousTitle === "Project Practice Guide"
					) {
						item.internal = true;
					}
					continue;
				}
				item.id ??= progressId(
					`${
						module.id ??
						progressId(`machine-learning-${previousTitle}`)
					}-${
						collection === "curriculum"
							? "curriculum"
							: "supplemental"
					}-${entry.title}`
				);
				item.aliases = [
					...new Set([...(item.aliases ?? []), entry.title])
				];
				item.title = entry.displayTitle;
				item.content = entry.content;
				item.contentKind = entry.kind;
				item.preserveInstructions = true;
				item.preserveAssignment = true;
				applied += 1;
			}
		}
	}
	if (applied !== definitions.length) {
		throw new Error(
			"Incomplete Machine Learning reference and report material."
		);
	}
}
