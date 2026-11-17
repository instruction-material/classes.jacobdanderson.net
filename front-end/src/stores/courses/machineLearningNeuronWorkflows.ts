import type { RawCourse } from "./types";
import coreReading from "./readings/machine-learning-neurons/core-concepts.md?raw";
import forwardPassReading from "./readings/machine-learning-neurons/forward-pass.md?raw";
import neuronClassReading from "./readings/machine-learning-neurons/neuron-class.md?raw";

const sourceBase =
	"https://github.com/instruction-material/AI-Level-2/tree/7c7ee0ccee9967b38cb0a0fa4a22c6621b7c7a9b";

export function applyMachineLearningNeuronWorkflows(course: RawCourse) {
	const module = course.modules.find(
		candidate => candidate.title === "ML4 Neural Networks"
	);
	if (!module) throw new Error("Missing Machine Learning neuron module");
	const definitions = [
		{ title: "Neural Networks Core Concepts", content: coreReading },
		{
			title: "ML4 Project 1: Build a Neuron Class",
			content: neuronClassReading,
			source: "ML4-Neuron-Implementation"
		},
		{
			title: "ML4 Project 2: Simple Neural Network Simulation",
			content: forwardPassReading,
			source: "ML4-Simple-Neural-Network"
		}
	];
	for (const definition of definitions) {
		const item = module.curriculum.find(
			candidate => candidate.title === definition.title
		);
		if (!item)
			throw new Error(`Missing neuron lesson: ${definition.title}`);
		item.content = definition.content;
		item.contentKind = definition.source ? "assignment" : "reading";
		item.preserveInstructions = true;
		item.preserveAssignment = true;
		if (definition.source) {
			item.projectLink = `${sourceBase}/${definition.source}-Starter`;
			item.solutionLink = `${sourceBase}/${definition.source}`;
			item.ideImport = true;
			delete item.datasetLink;
		}
	}
}
