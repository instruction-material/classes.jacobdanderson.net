import { describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { normalizeRawCourse } from "@/stores/courses/normalization";
import { pythonicDesignPatternsCourse } from "@/stores/courses/pythonic-design-patterns";

const course = () => normalizeRawCourse("pythonic-design-patterns", pythonicDesignPatternsCourse);

describe("pythonic final modules and support workflows", () => {
	it("keeps concepts in Learn and gives each final module one required project", () => {
		const modules = course().modules.slice(9, 13);
		expect(modules.map(module => module.curriculum.filter(isLessonLearningItem).length)).toEqual([3, 2, 2, 4]);
		for (const module of modules) {
			const projects = module.curriculum.filter(item => !isLessonLearningItem(item));
			expect(projects).toHaveLength(1);
			expect(projects[0].title).toMatch(/^Core Project:/);
			expect(module.supplementalProjects.every(item => !isLessonLearningItem(item))).toBe(true);
		}
	});

	it("retains the journal and optional written maps without artificial code imports", () => {
		const modules = course().modules;
		const journal = modules[10].supplementalProjects[0];
		expect(journal.title).toMatch(/^Pattern Journal:/);
		expect(journal.projectLink).toBeUndefined();
		expect(journal.solutionLink).toBeUndefined();
		expect(journal.content).not.toContain("/ide?");
		for (const module of modules.slice(13, 15)) {
			expect(module.curriculum.every(isLessonLearningItem)).toBe(true);
			expect(module.supplementalProjects.every(item => !isLessonLearningItem(item))).toBe(true);
			expect(module.supplementalProjects.every(item => !item.projectLink && !item.solutionLink)).toBe(true);
		}
	});

	it("offers twenty independently saved final and practice activities with matching reference folders", () => {
		const tasks = course().modules.slice(9).flatMap(module => [...module.curriculum, ...module.supplementalProjects]).filter(item => item.projectLink);
		expect(tasks).toHaveLength(20);
		const keys = new Set<string>();
		const folders = new Set<string>();
		for (const task of tasks) {
			const action = task.content.match(/\[Open current learner pack separately\]\((\/ide\?[^)]+)\)/);
			expect(action, task.title).not.toBeNull();
			const url = new URL(action![1], "https://course.example.invalid");
			expect(url.searchParams.get("starterUrl")).toBe(task.projectLink);
			expect(task.solutionLink).toBe(task.projectLink!.replace(/\/starter$/, "/solution"));
			expect(url.searchParams.get("mode")).toBe("python");
			keys.add(url.searchParams.get("projectKey")!);
			folders.add(task.projectLink!.split("/").at(-2)!);
		}
		expect(keys.size).toBe(20);
		expect(folders.size).toBe(14);
	});

	it("preserves the refactor oracle and distinguishes the extraction, studio and integration deliverables", () => {
		const modules = course().modules;
		const extraction = modules[11].curriculum.find(item => !isLessonLearningItem(item))!;
		const studio = modules[12].curriculum.find(item => !isLessonLearningItem(item))!;
		expect(extraction.projectLink).toBe(studio.projectLink);
		expect(extraction.content).toContain("One behavior-preserving extraction");
		expect(studio.content).toContain("complete modular refactor");
		expect(modules[12].supplementalProjects[0].content).toContain("explicitly injected reader");
		const text = modules.slice(9).flatMap(module => [...module.curriculum, ...module.supplementalProjects]).map(item => item.content).join("\n");
		expect(text).toContain("72");
		expect(text).toContain("baseline_original.py");
		expect(text).not.toContain("network-systems checkpoint");
		expect(text).not.toContain("ISO C++ Core Guidelines");
	});
});
