import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { describe, expect, it } from "vitest";
import { designPatternsInCppCourse } from "@/stores/courses/design-patterns-in-cpp";

const EXPECTED_PRIMARY_SEQUENCE = [
	"DPC0 Setup and Tooling",
	"DPC1 Why Patterns Look Different in Modern C++",
	"DPC2 Design Foundations",
	"DPC3 Factory Method, Abstract Factory, and Builder",
	"DPC4 Strategy and Policy-Based Design",
	"DPC5 Observer and Event Flow",
	"DPC6 Decorator, Adapter, and Facade",
	"DPC7 Command and State",
	"DPC8 Composite and Iterator",
	"DPC9 Singleton, Global State, and Dependency Injection",
	"DPC10 Patterns for Resource Management",
	"DPC11 Legacy Refactoring Lab",
	"DPC12 Capstone Studio"
];

function requireModule(title: string) {
	const module = designPatternsInCppCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) {
		throw new Error(`Expected Design Patterns in C++ module ${title}.`);
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
	return designPatternsInCppCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return designPatternsInCppCourse.modules
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

describe("Design Patterns in C++ learner flow", () => {
	it("uses a thirteen-stage C++ judgment spine and one optional studio appendix", () => {
		expect(
			designPatternsInCppCourse.modules
				.slice(0, 13)
				.map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(designPatternsInCppCourse.modules).toHaveLength(14);
		expect(designPatternsInCppCourse.modules.at(-1)).toMatchObject({
			kind: "appendix",
			title: "Optional Applied C++ Pattern Studios"
		});
	});

	it("gives every required stage pacing, milestones, and explicit paths", () => {
		for (const module of designPatternsInCppCourse.modules.slice(0, 13)) {
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

	it("preserves every original project and all four applied studios", () => {
		const curriculumTitles = designPatternsInCppCourse.modules.flatMap(
			module => module.curriculum.map(item => item.title)
		);
		const optionTitles = designPatternsInCppCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumTitles).toHaveLength(84);
		expect(optionTitles).toHaveLength(67);
		for (const title of [
			"DPC0 Setup and Tooling: Core Project",
			"DPC5 Observer and Event Flow: Core Project",
			"DPC12 Capstone Studio: Core Project",
			"Ownership-Aware Refactor Project",
			"Runtime Variation Project",
			"Structural Boundary Project",
			"Refactoring Capstone Project",
			"Ownership Refactor Transfer Practice",
			"Runtime Variation Extension Practice",
			"Structural Boundary Extension Practice",
			"Refactoring Capstone Extension Practice"
		]) {
			const collection = title.startsWith("DPC")
				? curriculumTitles
				: optionTitles;
			expect(collection, title).toContain(title);
		}
		const studioGuide = moduleText("Optional Applied C++ Pattern Studios");
		for (const detail of [
			"Build the starter and record its baseline",
			"Ownership-Aware Refactor Studio.** Choose after DPC2 or DPC10",
			"Runtime Variation Studio.** Choose after DPC4",
			"Structural Boundary Studio.** Choose after DPC6",
			"Refactoring Capstone Studio.** Choose after DPC11"
		]) {
			expect(studioGuide).toContain(detail);
		}
	});

	it("makes C++ ownership, copy, move, and polymorphic lifetime contractual", () => {
		const text = courseText();
		const foundations = moduleText("DPC2 Design Foundations");
		const resources = moduleText("DPC10 Patterns for Resource Management");

		for (const contract of [
			"Rule of Zero",
			"Rule-of-Five contract",
			"Raw pointers and references represent borrowing",
			"public virtual destructor",
			"protected non-virtual destructor",
			"accidental slicing",
			"no-throw, strong, or basic exception guarantee",
			"valid moved-from state",
			"break back-edges with `weak_ptr`"
		]) {
			expect(text, contract).toContain(contract);
		}
		expect(foundations).toContain("concept-constrained template");
		expect(foundations).toContain("stable ABI");
		expect(resources).toContain("out-of-line destructor");
		expect(resourceText()).toContain("CppCoreGuidelines");
	});

	it("selects patterns from C++-specific variation and boundary evidence", () => {
		const creation = moduleText(
			"DPC3 Factory Method, Abstract Factory, and Builder"
		);
		const strategy = moduleText("DPC4 Strategy and Policy-Based Design");
		const observer = moduleText("DPC5 Observer and Event Flow");
		const composite = moduleText("DPC8 Composite and Iterator");

		expect(creation).toContain("Return a value");
		expect(creation).toContain("`unique_ptr<Base>`");
		expect(creation).toContain("Never return a raw owning pointer");
		expect(strategy).toContain("virtual Strategy");
		expect(strategy).toContain("focused callable");
		expect(strategy).toContain("concept-constrained template policy");
		expect(observer).toContain("move-only RAII subscription token");
		expect(observer).toContain("removal during publication");
		expect(composite).toContain("iterator invalidation");
		expect(composite).toContain("mutation during traversal");
		expect(courseText()).toContain("removal trigger");
	});

	it("makes refactoring test-backed, sanitizer-checked, measurable, and reversible", () => {
		const setup = moduleText("DPC0 Setup and Tooling");
		const refactor = moduleText("DPC11 Legacy Refactoring Lab");
		const capstone = moduleText("DPC12 Capstone Studio");
		const resources = resourceText();

		expect(setup).toContain(
			"ctest --test-dir cmake-build --output-on-failure"
		);
		expect(setup).toContain("warnings-as-errors");
		expect(setup).toContain("AddressSanitizer");
		expect(setup).toContain("UndefinedBehaviorSanitizer");
		expect(refactor).toContain("one named transformation per commit");
		expect(refactor).toContain("diff cannot be reviewed");
		expect(refactor).toContain("last green commit");
		expect(capstone).toContain("two realistic change scenarios");
		expect(capstone).toContain("before-and-after measurements");
		expect(capstone).toContain("pattern deliberately not used");
		expect(capstone).toContain("clear rollback point");
		expect(resources).toContain("cmake.org/cmake/help/latest");
		expect(resources).toContain("clang.llvm.org/docs/AddressSanitizer");
		expect(resources).toContain(
			"clang.llvm.org/docs/UndefinedBehaviorSanitizer"
		);
	});
});

it("keeps the factory and service assignments distinct in the student reader", async () => {
	setActivePinia(createPinia());
	const course = await useCoursesStore().loadCourseById("design-patterns-in-cpp");
	expect(course).toBeTruthy();
	const modules = course!.modules.filter(module =>
		/^(DPC3 Factory|DPC9 Singleton)/.test(module.title)
	);
	expect(modules).toHaveLength(2);
	for (const module of modules) {
		const core = module.curriculum.filter(item => item.projectLink?.endsWith("/starter"));
		const options = module.supplementalProjects;
		expect(core).toHaveLength(1);
		expect(options).toHaveLength(3);
		const projects = [...core, ...options];
		expect(new Set(projects.map(item => item.projectLink)).size).toBe(3);
		expect(new Set(projects.map(item => item.content)).size).toBe(4);
		for (const project of projects) {
			expect(project.projectLink).toMatch(/\/tree\/[0-9a-f]{40}\/[^/]+\/starter$/);
			expect(project.solutionLink).toBeFalsy();
			expect(project.content).toContain("**Checkpoints:**");
			expect(project.content).not.toMatch(/diagnostic run|tooling check/);
		}
	}
});
