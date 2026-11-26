import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel1Course } from "@/stores/courses/cpp-level-1";
import {
	cppGridLessonBrief,
	cppGridProjectBriefs
} from "@/stores/courses/cppGridProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const title = "CPPF7 Grids and 2D Vectors";
const lessonTitle = "Nested Vectors, Grid Traversal, and Nested Loop Patterns";
const projects = [
	[
		"curriculum",
		"CPPF7 Project: Matrix Addition",
		"matrix",
		"CPPF7-Matrix-Addition",
		"core",
		"c-level-1-cppf7-grids-and-2d-vectors-curriculum-cppf7-project-matrix-addition"
	],
	[
		"supplementalProjects",
		"CPPF7 Project 2: Grid Statistics",
		"statistics",
		"CPPF7-Grid-Statistics",
		"choice",
		"c-level-1-cppf7-grids-and-2d-vectors-supplemental-cppf7-project-2-grid-statistics"
	]
] as const;

describe("C++ grid assignments and readable reference", () => {
	it("keeps required addition and one purposeful optional statistics project", async () => {
		const normalized = await loadRawCourse("c-level-1");
		for (const course of [cppLevel1Course, normalized!]) {
			const module = course.modules.find(
				module => module.title === title
			)!;
			expect(module.curriculum.map(item => item.title)).toEqual([
				lessonTitle,
				projects[0][1]
			]);
			expect(module.supplementalProjects.map(item => item.title)).toEqual(
				[projects[1][1]]
			);
			for (const [section, name, key, folder, path] of projects) {
				const item = module[section].find(item => item.title === name)!;
				expect(item.learningPath).toBe(path);
				expect(item.content).toContain(cppGridProjectBriefs[key]);
				expect(item.projectLink).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/starter`
				);
				expect(item.solutionLink).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/solution`
				);
			}
		}
	});
	it("preserves both actual public project progress IDs", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const module = course!.modules.find(module => module.title === title)!;
		for (const [section, name, , , path, id] of projects) {
			const item = module[section].find(item => item.title === name)!;
			expect(item.id).toBe(id);
			expect(item.learningPath).toBe(path);
			expect(item.projectLink).toMatch(/\/starter$/);
			expect(item.solutionLink).toBeUndefined();
		}
	});
	it("shows the complete lesson and exact supplied program with a worked example import", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const item = course!.modules.find(module => module.title === title)!
			.curriculum[0];
		expect(item.title).toBe(lessonTitle);
		expect(item.projectLink).toMatch(/\/CPPF7-Grids-and-2D-Vectors-Reference$/);
		expect(item.contentKind).toBe("reading");
		expect(item.solutionLink).toBeUndefined();
		expect(item.content).toContain("/CPPF7-Grids-and-2D-Vectors-Reference");
		const programs = [
			...cppGridLessonBrief.matchAll(/```cpp\n([\s\S]*?)\n```/g)
		];
		expect(programs).toHaveLength(1);
		expect(item.content).toContain(programs[0][1]);
	});
	it("distinguishes rejected matrix input from the optional rectangular helper domain", () => {
		expect(cppGridProjectBriefs.matrix).toContain(
			"Rows and columns are\nboth from 1 through 100"
		);
		expect(cppGridProjectBriefs.matrix).toContain(
			"Cancel immediately, before printing a sum matrix"
		);
		expect(cppGridProjectBriefs.statistics).toContain(
			"Ragged-grid validation remains\nan optional extension"
		);
		expect(cppGridProjectBriefs.statistics).toContain(
			"rows but zero\ncolumns"
		);
		expect(cppGridProjectBriefs.statistics).toContain(
			"first location in row-major order"
		);
	});
});
