import { describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { normalizeRawCourse } from "@/stores/courses/normalization";
import { pythonicDesignPatternsCourse } from "@/stores/courses/pythonic-design-patterns";

const units = () =>
	normalizeRawCourse("pythonic-design-patterns", pythonicDesignPatternsCourse)
		.modules.slice(7, 9);

describe("Pythonic state, command and adapter teaching and workflows", () => {
	it("places five complete worked concepts in Learn and keeps required projects", () => {
		const modules = units();
		expect(modules.map(module => module.curriculum.filter(isLessonLearningItem).length)).toEqual([3, 2]);
		const readings = modules.flatMap(module => module.curriculum.filter(isLessonLearningItem));
		expect(readings.every(item => item.content.includes("## Worked example"))).toBe(true);
		expect(readings.every(item => item.content.includes("```python") && item.content.includes("```text"))).toBe(true);
		expect(modules.flatMap(module => module.curriculum).filter(item => !isLessonLearningItem(item)).map(item => item.title)).toEqual([
			"Core Project: State and Command",
			"Core Project: Adapter and Integration Boundaries"
		]);
	});

	it("defines complete refactoring baselines and distinct optional comparison clients", () => {
		const [quest, adapter] = units();
		const core = [quest, adapter].map(module => module.curriculum.find(item => !isLessonLearningItem(item))!);
		expect(core.every(item => item.content.includes("complete working baseline"))).toBe(true);
		expect(core[0].content).toContain("twelve public contract");
		expect(core[1].content).toContain("ten public contract");
		expect(quest.supplementalProjects[0].content).toContain("undo floor: 4");
		expect(quest.supplementalProjects[0].content).toContain("separate native Python process");
		expect(adapter.supplementalProjects[0].content).toContain("custom score: 9");
		expect(adapter.supplementalProjects[0].content).toContain("solution/README.md");
		expect([quest, adapter].flatMap(module => module.supplementalProjects)).toHaveLength(6);
	});

	it("offers eight separate attempts from six appropriate source families", () => {
		const keys = new Set<string>();
		const folders = new Set<string>();
		for (const module of units()) {
			const tasks = [...module.curriculum, ...module.supplementalProjects].filter(item => !isLessonLearningItem(item));
			expect(tasks).toHaveLength(4);
			for (const task of tasks) {
				const match = task.content.match(/\[Open current learner pack separately\]\((\/ide\?[^)]+)\)/);
				expect(match, task.title).not.toBeNull();
				const url = new URL(match![1], "https://course.example.invalid");
				expect(url.searchParams.get("starterUrl")).toBe(task.projectLink);
				expect(task.solutionLink).toBe(task.projectLink!.replace(/\/starter$/, "/solution"));
				expect(url.searchParams.get("mode")).toBe("python");
				expect(url.searchParams.get("lesson")).toContain("pythonic-design-patterns-pdp");
				keys.add(url.searchParams.get("projectKey")!);
				folders.add(task.projectLink!.split("/").at(-2)!);
			}
		}
		expect(keys.size).toBe(8);
		expect(folders.size).toBe(6);
	});

	it("explains lifecycle, recovery, schemas, causes and normalization boundaries", () => {
		const text = units().flatMap(module => [...module.curriculum, ...module.supplementalProjects]).map(item => item.content).join("\n");
		for (const term of ["one-shot", "65536", "1000", "cancel", "snapshot", "evicted", "fresh", "cannot be undone", "AdapterError", "IntegrationError", "TimeoutError", "cause", "round-trip", "UTC", "Kelvin", "default", "bool"])
			expect(text).toContain(term);
		expect(text).not.toContain("software design tradeoffs involving naming");
	});
});
