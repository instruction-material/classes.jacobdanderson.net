import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";
import { cppMazeSearchBriefs } from "@/stores/courses/cppMazeSearchBriefs";

const moduleTitle = "CPPI2 Recursion and the Call Stack";
const title = "CPPI2 Project: Recursive Maze Search";
const source = "https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursive-Maze-Search/";

describe("required recursive maze search", () => {
	it("keeps the existing required-project identity, route and course counts", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const module = course.modules.find(item => item.title === moduleTitle)!;
		const project = module.curriculum.find(item => item.title === title)!;
		expect(project.id).toBe("cpp-level-3-cppi2-recursion-and-the-call-stack-curriculum-cppi2-project-recursive-maze-or-word-search");
		expect(project.learningPath).toBe("core");
		expect(project.ideImport).toBe(true);
		expect(project.projectLink).toBe(`${source}starter`);
		expect(project.solutionLink).toBeUndefined();
		expect(cppLevel3Course.modules.reduce((count, item) => count + item.curriculum.length, 0)).toBe(22);
		expect(cppLevel3Course.modules.reduce((count, item) => count + item.supplementalProjects.length, 0)).toBe(14);
	});

	it("retains complete stack/backtracking lessons and the actual bounded contract", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const module = course.modules.find(item => item.title === moduleTitle)!;
		for (const lesson of module.curriculum.slice(0, 2)) expect(lesson.content.length).toBeGreaterThan(4500);
		expect(module.curriculum[0].content).toContain("Guided trace and self-checks");
		expect(module.curriculum[0].content).toContain("countdown(2): childCount is 1; return 2");
		expect(module.curriculum[1].content).toContain("Visited state and the current path");
		expect(module.curriculum[1].content).toContain("O(rows ×");
		const project = module.curriculum.find(item => item.title === title)!;
		expect(project.content.length).toBeGreaterThan(7500);
		for (const contract of ["visit", "maze_search.cpp", "up, right,", "16384", "20×20", "UNFINISHED", "status 3", "fresh", "does not promise a shortest path", "## Preserve an earlier attempt"])
			expect(project.content).toContain(contract);
		expect(project.content).toContain("The earlier project\nremains available in Projects");
	});

	it("offers a distinct confirmed current-pack import without changing the saved key", () => {
		const href = cppMazeSearchBriefs.project.match(/\]\((\/ide\?[^)]+)\)/)![1];
		const params = new URL(href, "https://classes.local").searchParams;
		expect(params.get("course")).toBe("cpp-level-3");
		expect(params.get("mode")).toBe("cpp");
		expect(params.get("lesson")).toBe("cpp-level-3-cppi2-recursion-and-the-call-stack");
		expect(params.get("starterUrl")).toBe(`${source}starter`);
		expect(params.get("projectKey")).toBe("cpp-level-3:cppi2-recursive-maze-search:current-pack-v1");
	});

	it("provides the comparison reference through authorized instructor access", async () => {
		setActivePinia(createPinia());
		useAppStore().setCurrentTutor({ _id: "tutor", name: "Tutor", email: "tutor@example.invalid", age: 30, state: "GA", usersOfTutorLength: 0, coursePermissions: ["cpp-level-3"], editTutors: false, saveEdit: "Save" });
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const project = course.modules.find(item => item.title === moduleTitle)!.curriculum.find(item => item.title === title)!;
		expect(project.solutionLink).toBe(`${source}solution`);
	});
});
