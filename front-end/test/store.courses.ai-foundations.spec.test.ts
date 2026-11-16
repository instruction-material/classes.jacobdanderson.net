import { execFileSync } from "node:child_process";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import readings from "@/stores/courses/aiFoundationReadingsData.json";

it("executes the published Python examples against independent graph, state, game and puzzle cases", () => {
	const result = JSON.parse(
		execFileSync(
			"python3",
			["../test/ai-foundation-reading-contracts.py"],
			{ encoding: "utf8" }
		)
	);
	expect(result.allChecksPassed).toBe(true);
	expect(result.BFSRequests).toBe(576);
	expect(result.stateTransitionCases).toBe(24);
});
it("retains complete worked readings and precise assignments after normalization", async () => {
	const course = (await loadRawCourse("ai-level-1"))!;
	for (const entry of readings) {
		const item = course.modules
			.flatMap(m => [...m.curriculum, ...m.supplementalProjects])
			.find(
				i =>
					i.title ===
					("displayTitle" in entry ? entry.displayTitle : entry.title)
			);
		expect(item, entry.title).toBeDefined();
		expect(item!.content, entry.title).toBe(entry.content);
		expect(item!.contentKind, entry.title).toBe(entry.contentKind);
	}
	const core = course.modules.find(
		m => m.title === "Unit 3: DFS, BFS, and Reachability"
	)!;
	expect(core.curriculum[0].content).toContain(
		"from collections import deque"
	);
	expect(core.curriculum[1].content).toContain("S,B,G");
	expect(core.curriculum[1].content).not.toContain("data-quality");
});
it("keeps planning archives internal and supplied projects available to learner and instructor", async () => {
	for (const role of ["learner", "instructor"]) {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "ai-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["ai-level-1"],
				editTutors: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById("ai-level-1"))!;
		expect(course.modules.filter(m => m.internal)).toHaveLength(6);
		expect(
			course.modules.find(m => m.id === "ai-level-1-standards-map")?.title
		).toBe("AI Level 1 Reference");
		for (const module of course.modules.filter(
			m => !m.internal && m.kind !== "appendix"
		)) {
			expect(
				module.curriculum.some(i => i.contentKind === "reading"),
				module.title
			).toBe(true);
			expect(
				module.curriculum.some(i => i.contentKind === "assignment"),
				module.title
			).toBe(true);
		}
		const studio = course.modules.find(
			m => m.title === "AI Search Lab 15: Practice Studio"
		)!;
		expect(
			studio.curriculum.find(i => i.title.startsWith("Core Project:"))
				?.projectLink
		).toContain("/AI-03-ai-search-lab-15/starter");
	}
});
