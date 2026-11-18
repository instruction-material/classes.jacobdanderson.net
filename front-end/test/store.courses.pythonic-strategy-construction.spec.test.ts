import { describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { normalizeRawCourse } from "@/stores/courses/normalization";
import { pythonicDesignPatternsCourse } from "@/stores/courses/pythonic-design-patterns";

const units = () =>
	normalizeRawCourse("pythonic-design-patterns", pythonicDesignPatternsCourse)
		.modules.slice(3, 5);

describe("Pythonic Strategy and construction teaching and source roles", () => {
	it("moves the seven concept and boundary bodies into complete readings", () => {
		const modules = units();
		expect(modules.map(module =>
			module.curriculum.filter(isLessonLearningItem).length
		)).toEqual([3, 4]);
		const readings = modules.flatMap(module =>
			module.curriculum.filter(isLessonLearningItem)
		);
		expect(readings.every(item => item.content.includes("```python"))).toBe(true);
		expect(readings.every(item => item.content.includes("```text"))).toBe(true);
		expect(modules.flatMap(module => module.curriculum)
			.filter(item => !isLessonLearningItem(item))
			.map(item => item.title)).toEqual([
			"Core Project: Strategy Without Ceremony",
			"Core Project: Factory and Builder in Python"
		]);
	});

	it("gives the core refactors and optional client exercises distinct deliverables", () => {
		const [strategy, construction] = units();
		const core = [strategy, construction].map(module =>
			module.curriculum.find(item => !isLessonLearningItem(item))!
		);
		expect(core[0].content).toContain("starter already runs and passes seven contracts");
		expect(core[1].content).toContain("working **Factory and Builder Config Kit** baseline");
		expect(strategy.supplementalProjects[0].content).toContain("twenty-percent");
		expect(strategy.supplementalProjects[0].content).toContain("fifty-percent");
		expect(construction.supplementalProjects[0].content).toContain("two independent report variants");
		expect(construction.supplementalProjects[0].content).toContain("outside");
		expect([strategy, construction].flatMap(module =>
			module.supplementalProjects
		)).toHaveLength(6);
	});

	it("offers eight independent attempts backed by the six corresponding families", () => {
		const keys = new Set<string>();
		const folders = new Set<string>();
		for (const module of units()) {
			const activities = [...module.curriculum, ...module.supplementalProjects]
				.filter(item => !isLessonLearningItem(item));
			expect(activities).toHaveLength(4);
			for (const activity of activities) {
				const match = activity.content.match(/\[Open current learner pack separately\]\((\/ide\?[^)]+)\)/);
				expect(match, activity.title).not.toBeNull();
				const url = new URL(match![1], "https://course.example.invalid");
				expect(url.searchParams.get("starterUrl")).toBe(activity.projectLink);
				expect(url.searchParams.get("lesson")).toBe(module.title.startsWith("PDP3 ") ? "pythonic-design-patterns-pdp3-strategy-without-ceremony" : "pythonic-design-patterns-pdp4-factory-and-builder-in-python");
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

	it("states ownership, selection and provider failure boundaries without generic briefs", () => {
		const text = units().flatMap(module => [
			...module.curriculum, ...module.supplementalProjects
		]).map(item => item.content).join("\n");
		for (const value of [
			"49.50", "44.55", "41.50", "KeyError", "ValueError",
			"first binding", "separate cart list", "independent report",
			"ProviderLoadError", "__cause__", "before loading",
			"callable with the wrong signature", "--strict --no-incremental"
		]) expect(text).toContain(value);
		expect(text).not.toContain("software design tradeoffs involving naming");
		expect(text).not.toContain("program accepted data");
	});
});
