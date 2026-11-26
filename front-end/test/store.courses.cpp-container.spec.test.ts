import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { normalizeInlineCourseMarkdown } from "@/modules/courseMarkdown";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { cppContainerLessons } from "@/stores/courses/cppContainerLessons";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";
import { cppContainerAuditWorksheet } from "@/stores/courses/cppContainerAuditWorksheet";
import type { CourseDefinition } from "@/stores/courses/types";

const title = "CPPI3 Project 2: Container Tradeoff Mini-Audit";
const source =
	"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI3-Container-Tradeoff-Audit/";
const findWorksheet = (course: CourseDefinition) =>
	course.modules
		.find(
			item =>
				item.title === "CPPI3 STL Containers, Iterators, and Algorithms"
		)!
		.supplementalProjects.find(item => item.title === title)!;

describe("optional container evidence worksheet", () => {
	it("preserves its optional identity and complete learner material without a printer import", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const worksheet = findWorksheet(course);
		expect(worksheet.id).toBe(
			"cpp-level-3-cppi3-stl-containers-iterators-and-algorithms-supplemental-cppi3-project-2-container-tradeoff-mini-audit"
		);
		expect(worksheet.learningPath).toBe("choice");
		expect(worksheet.ideImport).toBe(false);
		expect(worksheet.projectLink).toBe(source + "starter/WORKSHEET.md");
		expect(worksheet.solutionLink).toBeUndefined();
		for (const section of [
			"Prepare and establish the behavior",
			"Map the real operations",
			"Predict three probes",
			"Propose one bounded change",
			"Review the decision"
		])
			expect(worksheet.content).toContain(`## ${section}`);
		for (const requirement of [
			"Different orders",
			"Empty inventory",
			"Duplicate names",
			"copy-only",
			"[record]",
			"stdout",
			"stderr",
			"exit status",
			"Two custom cases"
		])
			expect(worksheet.content).toContain(requirement);
		expect(worksheet.content).not.toContain("WORKED-AUDIT.md");
		expect(worksheet.content).not.toContain("Verified probe transcript");
		expect(
			cppLevel3Course.modules.reduce(
				(count, item) => count + item.curriculum.length,
				0
			)
		).toBe(22);
		expect(
			cppLevel3Course.modules.reduce(
				(count, item) => count + item.supplementalProjects.length,
				0
			)
		).toBe(14);
	});

	it("reopens the normal saved inventory key and tells separate-pack users to select their attempt", () => {
		const href =
			cppContainerAuditWorksheet.match(/\]\((\/ide\?[^)]+)\)/)![1];
		const params = new URL(href, "https://classes.local").searchParams;
		expect(params.get("course")).toBe("cpp-level-3");
		expect(params.get("mode")).toBe("cpp");
		expect(params.get("projectKey")).toBe(
			"cpp-level-3:cpp-level-3-cppi3-stl-containers-iterators-and-algorithms-curriculum-cppi3-project-inventory-indexer:starter"
		);
		expect(params.get("starterUrl")).toBe(
			"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Inventory-Indexer/starter"
		);
		expect(params.get("lesson")).toBe(
			"cpp-level-3-cppi3-stl-containers-iterators-and-algorithms"
		);
		expect(cppContainerAuditWorksheet).toContain(
			"choose that saved\nproject in Projects"
		);
	});

	it("exposes the worked comparison only through authorized staff course access", async () => {
		setActivePinia(createPinia());
		useAppStore().setCurrentTutor({
			_id: "tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["cpp-level-3"],
			editTutors: false,
			saveEdit: "Save"
		});
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		expect(findWorksheet(course).solutionLink).toBe(
			source + "solution/WORKED-AUDIT.md"
		);
		expect(findWorksheet(course).ideImport).toBe(false);
	});
});

describe("complete CPPI3 container teaching and primary project", () => {
	it("supplies both lessons, exact view rules, build commands and safe mutation guidance", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const module = course.modules.find(
			item =>
				item.title === "CPPI3 STL Containers, Iterators, and Algorithms"
		)!;
		const [containers, algorithms, project] = module.curriculum;
		for (const lesson of [containers, algorithms]) {
			expect(lesson.content).toContain(
				"## Guided checks and independent study"
			);
			expect(lesson.content).toContain("c++ -std=c++20");
			expect(lesson.content).toContain("```cpp");
			expect(lesson.content).toContain("```text");
		}
		expect(containers.content).toContain("old end iterator is invalidated");
		expect(containers.content).toContain("worst-case linear");
		expect(algorithms.content).toContain(
			"reserve alone does not change vector size"
		);
		expect(algorithms.content).toContain("not a full relational database");
		expect(project.learningPath).toBe("core");
		expect(project.ideImport).toBe(true);
		expect(project.projectLink).toBe(
			"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Inventory-Indexer/starter"
		);
		expect(project.solutionLink).toBeUndefined();
		for (const requirement of [
			"Data and behavior",
			"Work sequence",
			"Build and verification",
			"Preserve an earlier",
			"Completion and walkthrough evidence",
			"Duplicate names remain",
			"unchanged-name request",
			"allocation fails",
			"Open current pack separately",
			"empty inventory"
		])
			expect(project.content.toLowerCase()).toContain(
				requirement.toLowerCase()
			);
	});
});

describe("container learning-view placement", () => {
	it.each(["learner", "instructor"])(
		"keeps both complete lessons in Learn for %s access",
		async role => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: ["cpp-level-3"],
					editTutors: false,
					saveEdit: "Save"
				});
			const course =
				(await useCoursesStore().loadCourseById("cpp-level-3"))!;
			const module = course.modules.find(
				item =>
					item.title ===
					"CPPI3 STL Containers, Iterators, and Algorithms"
			)!;
			const [containers, algorithms, project] = module.curriculum;
			const programs = (content: string) =>
				content.match(/```(?:cpp|text)[\s\S]*?```/g);
			for (const [lesson, original] of [
				[containers, cppContainerLessons.containers],
				[algorithms, cppContainerLessons.algorithms]
			] as const) {
				expect(isLessonLearningItem(lesson)).toBe(true);
				expect(lesson.content).toMatch(/^\*\*Concept focus:\*\*/);
				expect(lesson.projectLink).toBeUndefined();
				expect(lesson.ideImport).not.toBe(true);
				expect(programs(lesson.content)).toEqual(programs(original));
			}
			expect(containers.content).toMatch(
				/^\*\*Concept focus:\*\*[^\n]+\n\n\*\*Course flow:\*\*/
			);
			expect(normalizeInlineCourseMarkdown(containers.content)).toContain(
				"2. Replace the searched value with `8`. Predict the result before running."
			);
			expect(isLessonLearningItem(project)).toBe(false);
			expect(isLessonLearningItem(findWorksheet(course))).toBe(false);
		}
	);
});
