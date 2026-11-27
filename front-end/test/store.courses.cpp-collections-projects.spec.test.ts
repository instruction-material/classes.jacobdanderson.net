import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel1Course } from "@/stores/courses/cpp-level-1";
import {
	cppCollectionsLessonBrief,
	cppCollectionsProjectBriefs
} from "@/stores/courses/cppCollectionsProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const title = "CPPF5 Vectors and Collection Patterns";

describe("C++ collection assignments", () => {
	it("keeps both projects required with separate incomplete starter/reference links", async () => {
		const normalized = await loadRawCourse("c-level-1");
		for (const course of [cppLevel1Course, normalized!]) {
			const module = course.modules.find(
				module => module.title === title
			)!;
			expect(module.supplementalProjects).toEqual([]);
			for (const [name, folder, key] of [
				[
					"CPPF5 Project 1: Vector Practice",
					"CPPF5-Vector-Practice",
					"vector"
				],
				[
					"CPPF5 Project 2: Bank Accounts",
					"CPPF5-Bank-Accounts",
					"bank"
				]
			] as const) {
				const item = module.curriculum.find(
					item => item.title === name
				)!;
				expect(item?.learningPath, name).toBe("core");
				expect(item.projectLink).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/starter`
				);
				expect(item.solutionLink).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/solution`
				);
				expect(item.content).toContain(
					cppCollectionsProjectBriefs[key]
				);
			}
		}
	});

	it("shows the complete vector lesson without presenting it as a starter", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const module = course!.modules.find(module => module.title === title)!;
		expect(module.curriculum.map(item => item.title)).toEqual([
			"Vectors as Growable Sequences and Function Inputs",
			"CPPF5 Project 1: Vector Practice",
			"CPPF5 Project 2: Bank Accounts"
		]);
		const lesson = module.curriculum[0];
		expect(lesson.projectLink).toMatch(/\/CPPF5-Vectors-Reference$/);
		expect(lesson.contentKind).toBe("reading");
		expect(lesson.solutionLink).toBeUndefined();
		expect(lesson.content).toContain(
			"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vectors-Reference"
		);
		const programs = [
			...cppCollectionsLessonBrief.matchAll(/```cpp\n([\s\S]*?)\n```/g)
		];
		expect(programs).toHaveLength(1);
		expect(lesson.content).toContain(programs[0][1]);
	});

	it("retains the two existing project progress identities", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const module = course!.modules.find(module => module.title === title)!;
		for (const [name, id] of [
			[
				"CPPF5 Project 1: Vector Practice",
				"c-level-1-cppf5-vectors-and-collection-patterns-curriculum-cppf5-project-1-vector-practice"
			],
			[
				"CPPF5 Project 2: Bank Accounts",
				"c-level-1-cppf5-vectors-and-collection-patterns-curriculum-cppf5-project-2-bank-accounts"
			]
		])
			expect(
				module.curriculum.find(item => item.title === name)?.id
			).toBe(id);
	});

	it("states bounded sums, ASCII length semantics and invalid-input cancellation", () => {
		expect(cppCollectionsProjectBriefs.vector).toContain(
			"false for an empty vector"
		);
		expect(cppCollectionsProjectBriefs.vector).toContain(
			"not a Unicode character or grapheme count"
		);
		expect(cppCollectionsProjectBriefs.vector).toContain(
			"1,000,000 total bytes"
		);
		expect(cppCollectionsProjectBriefs.bank).toContain("0 through 1,000");
		expect(cppCollectionsProjectBriefs.bank).toContain(
			"Invalid transaction count."
		);
		expect(cppCollectionsProjectBriefs.bank).toContain(
			"Invalid transaction amount."
		);
		expect(cppCollectionsProjectBriefs.bank).toContain(
			"Neither failure prints a balance"
		);
		expect(cppCollectionsProjectBriefs.bank).toContain(
			"negative and zero is a valid amount"
		);
	});
});
