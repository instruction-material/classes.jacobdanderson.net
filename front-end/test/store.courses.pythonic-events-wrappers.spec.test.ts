import { describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { normalizeRawCourse } from "@/stores/courses/normalization";
import { pythonicDesignPatternsCourse } from "@/stores/courses/pythonic-design-patterns";

const units = () =>
	normalizeRawCourse("pythonic-design-patterns", pythonicDesignPatternsCourse)
		.modules.slice(5, 7);

describe("Pythonic events and wrapper teaching and source roles", () => {
	it("places six complete concepts in Learn and retains two core project identities", () => {
		const modules = units();
		expect(modules.map(module =>
			module.curriculum.filter(isLessonLearningItem).length
		)).toEqual([3, 3]);
		const readings = modules.flatMap(module =>
			module.curriculum.filter(isLessonLearningItem)
		);
		expect(readings.every(item => item.content.includes("```python"))).toBe(true);
		expect(readings.every(item => item.content.includes("```text"))).toBe(true);
		expect(modules.flatMap(module => module.curriculum)
			.filter(item => !isLessonLearningItem(item))
			.map(item => item.title)).toEqual([
			"Core Project: Observer, Events, and Callbacks",
			"Core Project: Decorator, Proxy, and Facade"
		]);
	});

	it("defines working refactors and separate optional client outcomes", () => {
		const [events, wrappers] = units();
		const core = [events, wrappers].map(module =>
			module.curriculum.find(item => !isLessonLearningItem(item))!
		);
		expect(core[0].content).toContain("complete working baseline");
		expect(core[0].content).toContain("private registry");
		expect(core[1].content).toContain("twelve public contract");
		expect(core[1].content).toContain("cache_result");
		expect(events.supplementalProjects[0].content).toContain("B-205");
		expect(events.supplementalProjects[0].content).toContain("three audit deliveries and two dashboard deliveries");
		expect(wrappers.supplementalProjects[0].content).toContain("loads is 2");
		expect(wrappers.supplementalProjects[0].content).toContain("PermissionError");
		expect([events, wrappers].flatMap(module =>
			module.supplementalProjects
		)).toHaveLength(6);
	});

	it("offers eight independent attempts from the six appropriate source families", () => {
		const keys = new Set<string>();
		const folders = new Set<string>();
		const lessonIds = [
			"pythonic-design-patterns-pdp5-observer-events-and-callbacks",
			"pythonic-design-patterns-pdp6-decorator-proxy-and-facade"
		];
		for (const [index, module] of units().entries()) {
			const activities = [...module.curriculum, ...module.supplementalProjects]
				.filter(item => !isLessonLearningItem(item));
			expect(activities).toHaveLength(4);
			for (const activity of activities) {
				const match = activity.content.match(/\[Open current learner pack separately\]\((\/ide\?[^)]+)\)/);
				expect(match, activity.title).not.toBeNull();
				const url = new URL(match![1], "https://course.example.invalid");
				expect(url.searchParams.get("starterUrl")).toBe(activity.projectLink);
				expect(url.searchParams.get("lesson")).toBe(lessonIds[index]);
				expect(url.searchParams.get("mode")).toBe("python");
				expect(activity.solutionLink).toBe(activity.projectLink!.replace(/\/starter$/, "/solution"));
				expect(url.searchParams.get("projectKey")).toContain(":current-pack-v2");
				keys.add(url.searchParams.get("projectKey")!);
				folders.add(activity.projectLink!.split("/").at(-2)!);
			}
		}
		expect(keys.size).toBe(8);
		expect(folders.size).toBe(6);
	});

	it("states delivery, lifetime, deferred-call and cleanup boundaries explicitly", () => {
		const text = units().flatMap(module => [
			...module.curriculum, ...module.supplementalProjects
		]).map(item => item.content).join("\n");
		for (const value of [
			"WeakMethod", "snapshot", "nested", "zero tasks", "cancel",
			"RuntimeError", "standard Python 3.14", "__wrapped__",
			"asend", "athrow", "aclose", "hashable", "invalidation",
			"PermissionError", "ExitStack", "suppressed", "reverse"
		]) expect(text).toContain(value);
		expect(text).not.toContain("software design tradeoffs involving naming");
		expect(text).not.toContain("program accepted data");
	});
});
