import type { RawCourse } from "./types";
import content1 from "./readings/machine-learning-worked-cores/capstone-frozen-probe.md?raw";
import content0 from "./readings/machine-learning-worked-cores/neuron-sensitivity.md?raw";

const worksheets = [
	{
		moduleTitle: "ML4 Neural Networks",
		title: "Extension Challenge: Neural Networks",
		content: content0
	},
	{
		moduleTitle: "ML8 Master Project",
		title: "Extension Challenge: Machine Learning",
		content: content1
	}
];

export function applyMachineLearningFinalTeaching(
	course: RawCourse,
	progressId: (value: string) => string
) {
	for (const definition of worksheets) {
		const module = course.modules.find(
			candidate => candidate.title === definition.moduleTitle
		);
		const item = module?.supplementalProjects.find(
			candidate => candidate.title === definition.title
		);
		if (!item) {
			throw new Error(
				`Missing Machine Learning extension: ${definition.title}`
			);
		}
		item.content = definition.content;
		item.contentKind = "assignment";
		item.preserveInstructions = true;
		item.preserveAssignment = true;
		item.ideImport = false;
		delete item.projectLink;
		delete item.solutionLink;
		delete item.datasetLink;
		delete item.mediaLink;
	}
	for (const module of course.modules) {
		if (
			![
				"ML3.5 Decision Trees and Interpretable Models",
				"ML7.5 Model Evaluation, Comparison, and Dataset Strategy"
			].includes(module.title)
		) {
			continue;
		}
		const moduleId =
			module.id ?? progressId(`machine-learning-${module.title}`);
		for (const collection of [
			"curriculum",
			"supplementalProjects"
		] as const) {
			for (const item of module[collection]) {
				const title = item.title.replace(
					/^(?:(Core Project|Extension Challenge|Transfer Practice|Extension Practice): )?5 /,
					(_match, prefix) => (prefix ? `${prefix}: ` : "")
				);
				if (title === item.title) continue;
				item.id ??= progressId(
					`${moduleId}-${
						collection === "curriculum"
							? "curriculum"
							: "supplemental"
					}-${item.title}`
				);
				item.aliases = [
					...new Set([...(item.aliases ?? []), item.title])
				];
				item.title = title;
			}
		}
	}
}
