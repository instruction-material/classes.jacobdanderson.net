import { describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { normalizeRawCourse } from "@/stores/courses/normalization";
import { pythonicDesignPatternsCourse } from "@/stores/courses/pythonic-design-patterns";

const foundations = () =>
	normalizeRawCourse("pythonic-design-patterns", pythonicDesignPatternsCourse)
		.modules[2];

describe("Pythonic foundations teaching and source roles", () => {
	it("supplies three worked readings and retains one core project", () => {
		const module = foundations();
		const readings = module.curriculum.filter(item =>
			isLessonLearningItem(item)
		);
		expect(readings).toHaveLength(3);
		expect(readings.every(item => item.content.includes("```python"))).toBe(
			true
		);
		expect(readings.map(item => item.content).join("\n")).toContain(
			"snapshot_task checks them again"
		);
		expect(
			module.curriculum
				.filter(item => !isLessonLearningItem(item))
				.map(item => item.title)
		).toEqual(["Core Project: Design Foundations in Python"]);
	});
	it("keeps the design journal written and removes unrelated executable links", () => {
		const journal = foundations().supplementalProjects.find(item =>
			item.title.startsWith("Pattern Journal:")
		)!;
		expect(journal.content).toContain("[09:30] ready");
		expect(journal.content).toContain("written record");
		expect(journal.projectLink).toBeUndefined();
		expect(journal.solutionLink).toBeUndefined();
		expect(journal.ideImport).toBeUndefined();
	});
	it("offers three separate learner attempts for the two matching source packs", () => {
		const module = foundations();
		const coding = [
			...module.curriculum,
			...module.supplementalProjects
		].filter(item =>
			item.projectLink?.includes("Pythonic-Design-Patterns")
		);
		expect(coding).toHaveLength(3);
		const keys = new Set<string>();
		for (const item of coding) {
			const match = item.content.match(
				/\[Open current learner pack separately\]\((\/ide\?[^)]+)\)/
			);
			expect(match, item.title).not.toBeNull();
			const url = new URL(match![1], "https://course.example.invalid");
			expect(url.searchParams.get("starterUrl")).toBe(item.projectLink);
			expect(url.searchParams.get("lesson")).toBe(
				"pythonic-design-patterns-pdp2-design-foundations-in-python"
			);
			expect(url.searchParams.get("mode")).toBe("python");
			expect(url.searchParams.get("projectKey")).toContain(
				":current-pack-v2"
			);
			keys.add(url.searchParams.get("projectKey")!);
			expect(item.solutionLink).toBe(
				item.projectLink!.replace(/\/starter$/, "/solution")
			);
		}
		expect(keys.size).toBe(3);
		expect(
			coding.filter(item => item.projectLink!.includes("PDP-03-"))
		).toHaveLength(2);
		expect(
			coding.filter(item => item.projectLink!.includes("PDP-04-"))
		).toHaveLength(1);
	});
	it("states exact delivery, ownership and failure cases", () => {
		const module = foundations();
		const body = [...module.curriculum, ...module.supplementalProjects]
			.map(item => item.content)
			.join("\n");
		for (const expected of [
			"[build] ready",
			"[build] ",
			"DELIVERY [ops] ready",
			"LookupError",
			"new_task",
			"snapshot_task",
			"five contracts",
			"--strict --no-incremental --python-version 3.14"
		])
			expect(body).toContain(expected);
		expect(body).not.toContain(
			"software design tradeoffs involving naming"
		);
	});
});
