import { describe, expect, it } from "vitest";
import { designPatternsInJavaCourse } from "@/stores/courses/design-patterns-in-java";

const EXPECTED_PRIMARY_SEQUENCE = [
	"DPJ1 What Patterns Are and What They Are Not",
	"DPJ2 Java Design Foundations",
	"DPJ3 Creational Patterns I",
	"DPJ4 Creational Patterns II and Boundary Patterns",
	"DPJ5 Structural Patterns in Depth",
	"DPJ6 Behavioral Patterns I",
	"DPJ7 Behavioral Patterns II",
	"DPJ8 Modern Extensions and Architecture-Level Patterns",
	"DPJ9 Pattern Selection and Refactoring Judgment",
	"DPJ10 Capstone Refactor"
];

function requireModule(title: string) {
	const module = designPatternsInJavaCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) {
		throw new Error(`Expected Design Patterns in Java module ${title}.`);
	}
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function courseText() {
	return designPatternsInJavaCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return designPatternsInJavaCourse.modules
		.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])
		.flatMap(item => [
			item.projectLink,
			item.solutionLink,
			item.datasetLink,
			item.mediaLink
		])
		.filter(Boolean)
		.join("\n");
}

describe("Design Patterns in Java learner flow", () => {
	it("uses a ten-stage judgment spine and one optional studio appendix", () => {
		expect(
			designPatternsInJavaCourse.modules
				.slice(0, 10)
				.map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(designPatternsInJavaCourse.modules).toHaveLength(11);
		expect(designPatternsInJavaCourse.modules.at(-1)).toMatchObject({
			kind: "appendix",
			title: "Optional Applied Java Pattern Studios"
		});
	});

	it("gives every required stage pacing, milestones, and explicit paths", () => {
		for (const module of designPatternsInJavaCourse.modules.slice(0, 10)) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(6);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("preserves every original project and all three applied studios", () => {
		const curriculumTitles = designPatternsInJavaCourse.modules.flatMap(
			module => module.curriculum.map(item => item.title)
		);
		const optionTitles = designPatternsInJavaCourse.modules.flatMap(
			module => module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumTitles).toHaveLength(62);
		expect(optionTitles).toHaveLength(51);
		for (const title of [
			"Core Project: What Patterns Are and What They Are Not",
			"Core Project: Structural Patterns in Depth",
			"Core Project: Capstone Refactor",
			"Strategy Selection Refactor: Core Project",
			"Structural Wrapper Refactor: Core Project",
			"Architecture Judgment Capstone: Core Project",
			"Strategy Selection Refactor Transfer Practice",
			"Structural Wrapper Refactor Extension Practice",
			"Architecture Judgment Capstone Extension Practice"
		]) {
			const collection =
				title.includes("DPJ") || title.startsWith("Core Project:")
					? curriculumTitles
					: optionTitles;
			expect(collection, title).toContain(title);
		}
		const studios = designPatternsInJavaCourse.modules.find(
			module => module.title === "Optional Applied Java Pattern Studios"
		)!;
		expect(studios.supplementalProjects).toHaveLength(21);
		expect(
			new Set(studios.supplementalProjects.map(item => item.projectLink))
				.size
		).toBe(3);
		expect(moduleText("Optional Applied Java Pattern Studios")).toContain(
			"helper-only"
		);
	});

	it("retains the full pattern map while teaching selection costs", () => {
		const text = courseText();

		for (const pattern of [
			"Factory Method",
			"Abstract Factory",
			"Builder",
			"Prototype",
			"Singleton",
			"Adapter",
			"Facade",
			"Bridge",
			"Composite",
			"Decorator",
			"Proxy",
			"Flyweight",
			"Strategy",
			"State",
			"Template Method",
			"Iterator",
			"Observer",
			"Command",
			"Chain of Responsibility",
			"Mediator",
			"Memento",
			"Visitor"
		]) {
			expect(text, pattern).toContain(pattern);
		}
		expect(text).toContain("smallest useful change");
		expect(text).toContain(
			"navigation, indirection, testing, and future changes"
		);
		expect(text).toContain(
			"chosen design, rejected alternative, cost, and a test"
		);
		expect(text).toContain("one plain method would be sufficient");
		expect(text).toContain(
			"A design pattern describes a recurring arrangement"
		);
	});

	it("uses modern Java features when they are smaller than classic patterns", () => {
		const foundations = moduleText("DPJ2 Java Design Foundations");
		const behavior = moduleText("DPJ6 Behavioral Patterns I");
		const architecture = moduleText(
			"DPJ8 Modern Extensions and Architecture-Level Patterns"
		);

		expect(foundations).toContain("record");
		expect(foundations).toContain("sealed interface");
		expect(foundations).toContain("enum");
		expect(foundations).toContain("lambdas");
		expect(behavior).toContain("functional interface");
		expect(behavior).toContain("lambda");
		expect(behavior).toContain("method reference");
		expect(architecture).toContain("ServiceLoader");
		expect(architecture).toContain("META-INF/services");
		expect(architecture).toContain("zero, one, and multiple providers");
		expect(architecture).toContain("not safe for concurrent use");
		expect(foundations).toContain("java/lang/Record.html");
		expect(foundations).toContain("jls-8.html#jls-8.1.1.2");
		expect(architecture).toContain("java/util/ServiceLoader.html");
	});

	it("makes every refactor test-backed, measurable, and reversible", () => {
		const setup = moduleText(
			"DPJ1 What Patterns Are and What They Are Not"
		);
		const judgment = moduleText(
			"DPJ9 Pattern Selection and Refactoring Judgment"
		);
		const capstone = moduleText("DPJ10 Capstone Refactor");

		expect(setup).toContain("java ContractTests base");
		expect(setup).toContain("baseline harness reports 20052 passed");
		expect(setup).toContain(
			"overnight shipping for all regular/member customers"
		);
		expect(judgment).toContain("one behavior-preserving step per commit");
		expect(judgment).toContain("files touched");
		expect(judgment).toContain("duplicated rules");
		expect(capstone).toContain("Tag or commit this baseline");
		expect(capstone).toContain("before-and-after measurements");
		expect(capstone).toContain("pattern deliberately not used");
		expect(capstone).toContain("clear rollback point");
		expect(resourceText()).toContain("docs.junit.org/current/user-guide");
	});
});
