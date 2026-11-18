import type { RawCourse } from "./types";
import content8 from "./readings/machine-learning-worked-cores/capstone-examples.md?raw";
import content7 from "./readings/machine-learning-worked-cores/capstone-planning.md?raw";
import content9 from "./readings/machine-learning-worked-cores/capstone-presentation.md?raw";
import dataWorkflow from "./readings/machine-learning-worked-cores/data-workflow.md?raw";
import content3 from "./readings/machine-learning-worked-cores/decision-trees.md?raw";
import evaluationContract from "./readings/machine-learning-worked-cores/evaluation-contract.md?raw";
import content6 from "./readings/machine-learning-worked-cores/historical-health-audit.md?raw";
import content5 from "./readings/machine-learning-worked-cores/image-classification.md?raw";
import content2 from "./readings/machine-learning-worked-cores/least-squares.md?raw";
import content1 from "./readings/machine-learning-worked-cores/naive-bayes.md?raw";
import content0 from "./readings/machine-learning-worked-cores/nearest-neighbors.md?raw";
import content4 from "./readings/machine-learning-worked-cores/neural-regression.md?raw";

const definitions = [
	{
		moduleTitle: "ML0 Setup, Tooling, and Data Workflow",
		title: "Setup, Tooling, and Data Workflow Core Concepts",
		content: dataWorkflow,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
		title: "5 Model Evaluation, Comparison, and Dataset Strategy Core Concepts",
		content: evaluationContract,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML2 K-Nearest Neighbors",
		title: "K-Nearest Neighbors Core Concepts",
		content: content0,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML3 Naive Bayes",
		title: "Naive Bayes Overview",
		content: content1,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML5 Introduction to Regression",
		title: "Introduction to Regression Core Concepts",
		content: content2,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML3.5 Decision Trees and Interpretable Models",
		title: "5 Decision Trees and Interpretable Models Core Concepts",
		content: content3,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML6 Regression with Neural Networks",
		title: "Neural Networks for Regression",
		content: content4,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML7 Image Classifier",
		title: "Image Data and Classification",
		content: content5,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML4 Neural Networks",
		title: "ML4 Choice Audit: Historical Diabetes-Risk Dataset",
		content: content6,
		staticAudit: true,
		projectLink:
			"https://github.com/instruction-material/AI-Level-2/tree/7c7ee0ccee9967b38cb0a0fa4a22c6621b7c7a9b/ML4-Diabetes-Diagnosis-With-Neural-Networks"
	},
	{
		moduleTitle: "ML8 Master Project",
		title: "Master Project Planning",
		content: content7,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML8 Master Project",
		title: "Master Project Examples",
		content: content8,
		staticAudit: false,
		projectLink: null
	},
	{
		moduleTitle: "ML8 Master Project",
		title: "Machine Learning Master Project Presentation",
		content: content9,
		staticAudit: false,
		projectLink: null
	}
];

export function applyMachineLearningWorkedCoreReadings(course: RawCourse) {
	for (const definition of definitions) {
		const module = course.modules.find(
			candidate => candidate.title === definition.moduleTitle
		);
		const item = module?.curriculum.find(
			candidate => candidate.title === definition.title
		);
		if (!item) {
			throw new Error(
				`Missing Machine Learning worked reading: ${definition.title}`
			);
		}
		item.content = definition.content;
		item.contentKind = definition.staticAudit ? "assignment" : "reading";
		item.preserveInstructions = true;
		item.preserveAssignment = true;
		if (definition.staticAudit && definition.projectLink) {
			item.projectLink = definition.projectLink;
			delete item.solutionLink;
			delete item.datasetLink;
			item.ideImport = false;
			item.learningPath = "choice";
		}
	}
}
