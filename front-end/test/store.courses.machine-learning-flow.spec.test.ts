import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import neuronFixture from "../../test/fixtures/machine-learning-neuron-sources.json";
import readingFixture from "../../test/fixtures/machine-learning-worked-reading-cases.json";
import { loadRawCourse } from "@/stores/courses/index";
import { machineLearningCourse } from "@/stores/courses/machine-learning";

const CORE_SEQUENCE = [
	"ML0 Setup, Tooling, and Data Workflow",
	"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
	"ML1 K-Means Clustering",
	"ML2 K-Nearest Neighbors",
	"ML3 Naive Bayes",
	"ML3.5 Decision Trees and Interpretable Models",
	"ML5 Introduction to Regression",
	"ML4 Neural Networks",
	"ML6 Regression with Neural Networks",
	"ML8 Master Project"
];

const APPENDICES = [
	"ML7 Image Classifier",
	"Customer Segmentation Starter Build: Practice Studio",
	"Customer Segmentation Interview: Practice Studio",
	"Customer Segmentation: Practice Studio",
	"Disney Movie Clustering Starter Build: Practice Studio",
	"Disney Movie Clustering: Practice Studio",
	"KNN Car Classification: Practice Studio",
	"Pending Static Assets"
];

const PRACTICE_SECTIONS = [
	"environment-and-data-card-case",
	"evaluation-contract-case",
	"clustering-stability-case",
	"distance-classification-case",
	"probabilistic-classification-case",
	"interpretable-tree-case",
	"regression-baseline-case",
	"neural-network-audit-case",
	"neural-regression-case",
	"model-comparison-capstone-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

function assetText(filename: string) {
	return fs.readFileSync(
		path.resolve(
			__dirname,
			`../public/course-assets/machine-learning/${filename}`
		),
		"utf8"
	);
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}\s+(.+)$/gmu)].map(([, heading]) =>
			heading
				.toLowerCase()
				.replace(/[`*_]/gu, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/gu, "-")
				.replace(/-+/gu, "-")
		)
	);
}

function moduleText(title: string) {
	const module = machineLearningCourse.modules.find(
		candidate => candidate.title === title
	);
	expect(module, title).toBeDefined();
	return JSON.stringify(module);
}

describe("Machine Learning learner flow", () => {
	it("places evaluation before models and keeps specializations optional", async () => {
		expect(
			machineLearningCourse.modules
				.filter(module => module.kind !== "appendix")
				.map(module => module.title)
		).toEqual(CORE_SEQUENCE);
		expect(
			machineLearningCourse.modules
				.filter(module => module.kind === "appendix")
				.map(module => module.title)
		).toEqual(APPENDICES);

		const loaded = await loadRawCourse("machine-learning");
		expect(
			loaded?.modules
				.slice(0, CORE_SEQUENCE.length)
				.map(module => module.title)
		).toEqual(CORE_SEQUENCE);
	});

	it("adds timing, six-part reasoning structure, and local evidence to every core module", () => {
		for (const module of machineLearningCourse.modules.filter(
			candidate => candidate.kind !== "appendix"
		)) {
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Evaluation contract:**"
			);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Local continuity:**"
			);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Current references:**"
			);
		}
	});

	it("makes local execution complete and Colab optional", () => {
		const setup = moduleText("ML0 Setup, Tooling, and Data Workflow");
		expect(setup).toContain("Python 3.14");
		expect(setup).toContain("scikit-learn 1.9");
		expect(setup).toContain("local Jupyter or VS Code");
		expect(setup).toContain("Google Colab remains an optional");
		expect(setup).not.toContain("Google Colab is the main IDE");
		expect(setup).not.toContain("Mount Google Drive");
	});

	it("uses leakage-safe pipelines, baselines, and task-appropriate models", () => {
		expect(moduleText("ML1 K-Means Clustering")).toContain(
			"maximum iteration count"
		);
		expect(moduleText("ML1 K-Means Clustering")).toContain(
			"Handle an empty cluster"
		);
		expect(moduleText("ML2 K-Nearest Neighbors")).toContain(
			"OneHotEncoder"
		);
		expect(moduleText("ML2 K-Nearest Neighbors")).toContain(
			"handle_unknown"
		);
		expect(moduleText("ML2 K-Nearest Neighbors")).toContain(
			"DummyClassifier"
		);
		expect(moduleText("ML3 Naive Bayes")).toContain("GaussianNB");
		expect(moduleText("ML3 Naive Bayes")).toContain(
			"Split raw message text before fitting the vectorizer"
		);
	});

	it("reframes legacy sensitive and deprecated examples as bounded audits", () => {
		const neural = moduleText("ML4 Neural Networks");
		const regression = moduleText("ML5 Introduction to Regression");
		const neuralRegression = moduleText(
			"ML6 Regression with Neural Networks"
		);
		expect(neural).toContain("This is not a diagnosis");
		expect(neural).toContain('learningPath":"choice');
		expect(regression).toContain("country-year");
		expect(regression).toContain("ecological fallacy");
		expect(neuralRegression).toContain("California housing");
		expect(neuralRegression).toContain("Boston Housing dataset");
		expect(neuralRegression).toContain("ethically problematic");
	});

	it("keeps image work optional, non-personal, split by source, and compute bounded", () => {
		const imageModule = machineLearningCourse.modules.find(
			module => module.title === "ML7 Image Classifier"
		);
		expect(imageModule?.kind).toBe("appendix");
		const text = JSON.stringify(imageModule);
		expect(text).toContain("non-personal");
		expect(text).toContain("Group originals and related images");
		expect(text).toContain("augmentation to training only");
		expect(text).toContain("twelve training CPU seconds");
		expect(text).toContain("260 trainable parameters");
		expect(text).toContain("32");
	});

	it("publishes all practice cases and answer keys", () => {
		const practice = assetText("machine-learning-practice-pack.md");
		const verification = assetText(
			"machine-learning-verification-guide.md"
		);
		const practiceHeadings = markdownHeadingSlugs(practice);
		const answerHeadings = markdownHeadingSlugs(verification);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceHeadings, section).toContain(section);
			expect(JSON.stringify(machineLearningCourse), section).toContain(
				`machine-learning-practice-pack.md#${section}`
			);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerHeadings, section).toContain(section);
			expect(JSON.stringify(machineLearningCourse), section).toContain(
				`machine-learning-verification-guide.md#${section}`
			);
		}
	});

	it("binds browser proof fixtures to complete current authored lesson bytes", async () => {
		const course = await loadRawCourse("machine-learning");
		const items = course!.modules.flatMap(module => module.curriculum);
		const readingRoot = path.resolve(
			__dirname,
			"../src/stores/courses/readings/machine-learning-worked-cores"
		);
		for (const entry of readingFixture.cases) {
			const content = fs.readFileSync(
				path.resolve(readingRoot, entry.file),
				"utf8"
			);
			expect(
				createHash("sha256").update(content).digest("hex"),
				entry.title
			).toBe(entry.sourceSHA256);
			expect(
				items.find(item => item.title === entry.title)?.content,
				entry.title
			).toBe(content);
		}
		expect(neuronFixture.coreReading.content).toBe(
			fs.readFileSync(
				path.resolve(
					readingRoot,
					"../machine-learning-neurons/core-concepts.md"
				),
				"utf8"
			)
		);
		for (const project of neuronFixture.projects) {
			expect(
				items.find(item => item.title === project.title)?.content,
				project.title
			).toBe(project.assignmentText);
		}
	});

	it("publishes honest source, safety, boundary, and capstone contracts", async () => {
		const course = await loadRawCourse("machine-learning");
		expect(course).not.toBeNull();
		const metadata = course?.developmentMetadata;
		expect(metadata?.toolchain).toHaveLength(5);
		expect(metadata?.standards.length).toBeGreaterThanOrEqual(5);
		expect(metadata?.safetyPolicy).toHaveLength(6);
		expect(metadata?.courseBoundaries).toHaveLength(4);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.sourcePolicy).toContain("substantive legacy");
		expect(metadata?.sourcePolicy).toContain("thirty numbered ML-*");
		expect(metadata?.sourcePolicy).toContain("Five offline core pairs");
		expect(metadata?.sourcePolicy).toContain(
			"complete local weather-pattern CNN"
		);
	});
});
