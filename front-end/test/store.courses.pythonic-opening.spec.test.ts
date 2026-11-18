import { describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { normalizeRawCourse } from "@/stores/courses/normalization";
import { pythonicDesignPatternsCourse } from "@/stores/courses/pythonic-design-patterns";

const current = () =>
	normalizeRawCourse(
		"pythonic-design-patterns",
		pythonicDesignPatternsCourse
	);
const opening = () => current().modules.slice(0, 2);

describe("Pythonic opening independent teaching and source roles", () => {
	it("places seven complete readings in Learn and retains the two core tasks", () => {
		const items = opening().flatMap(module => module.curriculum);
		const readings = items.filter(item => isLessonLearningItem(item));
		expect(readings).toHaveLength(7);
		expect(
			items
				.filter(item => !isLessonLearningItem(item))
				.map(item => item.title)
		).toEqual([
			"Core Project: Pythonic Design Patterns",
			"Core Project: Why Python Changes the Design-Patterns Conversation"
		]);
		expect(readings.every(item => item.content.length > 600)).toBe(true);
		expect(readings.map(item => item.content).join("\n")).toContain(
			"def make_prefix(prefix):"
		);
	});

	it("keeps setup and journals as written artifacts without unrelated IDE sources", () => {
		const items = opening().flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const journals = items.filter(item =>
			item.title.startsWith("Pattern Journal:")
		);
		expect(journals).toHaveLength(2);
		for (const journal of journals) {
			expect(journal.projectLink).toBeUndefined();
			expect(journal.solutionLink).toBeUndefined();
			expect(journal.content).not.toContain("program accepted data");
		}
		expect(journals[1].content).toContain("removal trigger");
		expect(opening()[0].curriculum.at(-1)?.projectLink).toBeUndefined();
	});

	it("offers distinct current learner imports while retaining older saved projects", () => {
		const module = opening()[1];
		const coding = [
			...module.curriculum,
			...module.supplementalProjects
		].filter(item =>
			item.projectLink?.includes("Pythonic-Design-Patterns/tree/main/")
		);
		expect(coding).toHaveLength(3);
		const keys = new Set<string>();
		for (const item of coding) {
			const match = item.content.match(
				/\[Open current learner pack separately\]\((\/ide\?[^)]+)\)/
			);
			expect(match, item.title).not.toBeNull();
			expect(
				item.content
					.split("[Open current learner pack separately]")[0]
					.endsWith(String.fromCharCode(10, 10))
			).toBe(true);
			const url = new URL(match![1], "https://course.example.invalid");
			expect(url.searchParams.get("course")).toBe(
				"pythonic-design-patterns"
			);
			expect(url.searchParams.get("mode")).toBe("python");
			expect(url.searchParams.get("starterUrl")).toBe(item.projectLink);
			expect(item.projectLink).toMatch(/\/starter$/);
			expect(item.solutionLink).toBe(
				item.projectLink?.replace(/\/starter$/, "/solution")
			);
			expect(url.searchParams.get("lesson")).toBe(
				"pythonic-design-patterns-pdp1-why-python-changes-the-design-patterns-conversation"
			);
			const key = url.searchParams.get("projectKey")!;
			expect(key).toContain(":current-pack-v2");
			keys.add(key);
		}
		expect(keys.size).toBe(3);
	});

	it("provides the pinned native setup and exact observable lab cases", () => {
		const text = opening()
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.map(item => item.content)
			.join("\n");
		expect(text).toContain("python3.14 -m venv .venv");
		expect(text).toContain("-m pip install -r requirements-dev.txt");
		expect(text).toContain(
			"-m mypy --strict --no-incremental --python-version 3.14 main.py"
		);
		expect(text).toContain("-p test_contract.py");
		expect(text).toContain('["Design Patterns", ""]');
		expect(text).toContain('["LOG: design patterns", "LOG: "]');
		expect(text).toContain("An unknown name raises");
		expect(text).not.toContain(
			"adding, reading, updating, and checking for a missing key"
		);
	});
});
