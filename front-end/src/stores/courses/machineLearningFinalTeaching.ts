import type { RawCourse } from "./types";
import content1 from "./readings/machine-learning-worked-cores/capstone-frozen-probe.md?raw";
import treeProbe from "./readings/machine-learning-worked-cores/decision-tree-boundary-probe.md?raw";
import treeLab from "./readings/machine-learning-worked-cores/decision-tree-lab.md?raw";
import treeSelection from "./readings/machine-learning-worked-cores/decision-tree-selection.md?raw";
import content0 from "./readings/machine-learning-worked-cores/neuron-sensitivity.md?raw";

const sourceBase =
	"https://github.com/instruction-material/AI-Level-2/tree/9a33bdc17dfd9012c86afc133818ea55f125e75e";

const definitions = [
	{
		moduleTitle: "ML4 Neural Networks",
		title: "Extension Challenge: Neural Networks",
		collection: "supplementalProjects" as const,
		content: content0
	},
	{
		moduleTitle: "ML8 Master Project",
		title: "Extension Challenge: Machine Learning",
		collection: "supplementalProjects" as const,
		content: content1
	},
	{
		moduleTitle: "ML3.5 Decision Trees and Interpretable Models",
		title: "Decision Tree Lab",
		collection: "curriculum" as const,
		content: treeLab,
		reading: true
	},
	{
		moduleTitle: "ML3.5 Decision Trees and Interpretable Models",
		title: "Core Project: 5 Decision Trees and Interpretable Models",
		collection: "curriculum" as const,
		content: treeSelection,
		source: "ML35-Decision-Tree-Selection"
	},
	{
		moduleTitle: "ML3.5 Decision Trees and Interpretable Models",
		title: "Extension Challenge: 5 Decision Trees and Interpretable Models",
		collection: "supplementalProjects" as const,
		content: treeProbe
	}
];

export function applyMachineLearningFinalTeaching(
	course: RawCourse,
	progressId: (value: string) => string
) {
	for (const definition of definitions) {
		const module = course.modules.find(
			candidate => candidate.title === definition.moduleTitle
		);
		const item = module?.[definition.collection].find(
			candidate =>
				candidate.title === definition.title ||
				candidate.aliases?.includes(definition.title)
		);
		if (!item) {
			throw new Error(
				`Missing Machine Learning task: ${definition.title}`
			);
		}
		item.content = definition.content;
		item.contentKind = definition.reading ? "reading" : "assignment";
		item.preserveInstructions = true;
		item.preserveAssignment = true;
		item.ideImport = Boolean(definition.source);
		delete item.projectLink;
		delete item.solutionLink;
		delete item.datasetLink;
		delete item.mediaLink;
		if (definition.source) {
			item.projectLink = `${sourceBase}/${definition.source}/starter`;
			item.solutionLink = `${sourceBase}/${definition.source}/solution`;
		}
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
