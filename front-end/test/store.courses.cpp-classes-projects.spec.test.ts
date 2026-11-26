import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel1Course } from "@/stores/courses/cpp-level-1";
import {
	cppClassesLessonBriefs,
	cppClassesProjectBriefs
} from "@/stores/courses/cppClassesProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const title = "CPPF4 Classes and Objects";
const sequence = [
	"Classes, Objects, and Encapsulated State",
	"Point Declarations, Definitions, and State Tracing",
	"CPPF4 Project 1: Person Class",
	"Person Constructors and Member-Initializer Lists",
	"CPPF4 Project 2: Cat Class"
];

describe("original C++ classes assignments", () => {
	it("retains Person and Cat as required, distinct starter/reference pairs", async () => {
		const normalized = await loadRawCourse("c-level-1");
		for (const course of [cppLevel1Course, normalized!]) {
			const module = course.modules.find(
				module => module.title === title
			)!;
			for (const [name, stem, key] of [
				[sequence[2], "CPPF4-Person-Class", "person"],
				[sequence[4], "CPPF4-Cat-Class", "cat"]
			] as const) {
				const item = module.curriculum.find(
					item => item.title === name
				)!;
				expect(item?.learningPath, name).toBe("core");
				expect(item?.projectLink).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${stem}/starter`
				);
				expect(item?.solutionLink).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${stem}/solution`
				);
				expect(item?.content).toContain(cppClassesProjectBriefs[key]);
			}
			expect(module.supplementalProjects).toEqual([]);
		}
	});

	it("keeps the Point, Person, initializer, Cat learning order", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const module = course!.modules.find(module => module.title === title)!;
		expect(
			module.curriculum
				.map(item => item.title)
				.filter(item => sequence.includes(item))
		).toEqual(sequence);
		for (const [name, key, folder] of [
			[sequence[1], "point", "CPPF4-Point-Class"],
			[sequence[3], "initializers", "CPPF4-Person-Class-with-BMI"]
		] as const) {
			const item = module.curriculum.find(item => item.title === name)!;
			expect(item.projectLink).toMatch(new RegExp(`/${folder}$`));
			expect(item.contentKind).toBe("reading");
			expect(item.solutionLink).toBeUndefined();
			expect(item.content).toContain(
				`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}`
			);
			const programs = [
				...cppClassesLessonBriefs[key].matchAll(
					/```cpp\n([\s\S]*?)\n```/g
				)
			];
			expect(programs).toHaveLength(3);
			for (const program of programs)
				expect(item.content).toContain(program[1]);
		}
	});

	it("preserves old Cat, multi-file and supplemental initializer progress", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const items = course!.modules.find(
			module => module.title === title
		)!.curriculum;
		for (const [name, alias] of [
			[
				sequence[1],
				"c-level-1-cppf4-classes-and-objects-curriculum-multi-file-class-implementation"
			],
			[
				sequence[3],
				"c-level-1-cppf4-classes-and-objects-supplemental-classes-and-objects-bmi-extension"
			],
			[
				sequence[4],
				"c-level-1-cppf4-classes-and-objects-curriculum-cppf4-project-cat-class"
			]
		]) {
			expect(
				items.find(item => item.title === name)?.aliases,
				name
			).toContain(alias);
		}
	});

	it("states multi-file linking and the authored state contracts", () => {
		expect(cppClassesProjectBriefs.person).toContain(
			"all eight accessor methods"
		);
		expect(cppClassesProjectBriefs.person).toContain("main.cpp person.cpp");
		expect(cppClassesProjectBriefs.cat).toContain("breed `unknown`");
		expect(cppClassesProjectBriefs.cat).toContain("for exactly age 1");
		expect(cppClassesProjectBriefs.cat).toContain(
			"retains signed integer ages without validation"
		);
		expect(cppClassesProjectBriefs.cat).toContain("main.cpp cat.cpp");
		expect(cppClassesLessonBriefs.initializers).toContain(
			"public interface, accessor"
		);
		expect(cppClassesLessonBriefs.objects).toContain(
			"Encapsulation alone does not validate values"
		);
	});
});
