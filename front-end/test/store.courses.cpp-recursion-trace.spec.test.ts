import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";
import { cppRecursionTraceWorksheet } from "@/stores/courses/cppRecursionTraceWorksheet";
import type { CourseDefinition } from "@/stores/courses/types";

const title = "CPPI2 Project 2: Recursion Trace Drill";
const source =
	"https://github.com/instruction-material/CPP-Level-3/blob/main/CPPI2-Recursion-Trace-Drill/";
const findWorksheet = (course: CourseDefinition) =>
	course.modules
		.find(item => item.title === "CPPI2 Recursion and the Call Stack")!
		.supplementalProjects.find(item => item.title === title)!;

describe("optional recursion evidence worksheet", () => {
	it("preserves its optional identity and complete learner material without a printer import", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const worksheet = findWorksheet(course);
		expect(worksheet.id).toBe(
			"cpp-level-3-cppi2-recursion-and-the-call-stack-supplemental-cppi2-project-2-recursion-trace-drill"
		);
		expect(worksheet.learningPath).toBe("choice");
		expect(worksheet.ideImport).toBe(false);
		expect(worksheet.projectLink).toBe(source + "starter/WORKSHEET.md");
		expect(worksheet.solutionLink).toBeUndefined();
		for (const section of [
			"Preparation and trace rules",
			"Predict before running",
			"Case A: Adjacent cells",
			"Case B: Branch choices",
			"Case C: A loop and a separated exit",
			"Run the saved maze and record evidence",
			"Extend and review"
		])
			expect(worksheet.content).toContain(`## ${section}`);
		for (const requirement of [
			"[record]",
			"16384 bytes",
			"status 3",
			"Successful",
			"not a live stack",
			"ASAN_OPTIONS=detect_leaks=0",
			"two custom cases"
		])
			expect(worksheet.content.toLowerCase()).toContain(
				requirement.toLowerCase()
			);
		expect(worksheet.content).not.toContain("Enter 0 0\nEnter 0 1");
		expect(worksheet.content).not.toContain("WORKED-TRACE.md");
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

	it("reopens the normal saved maze key and tells separate-pack users to select their attempt", () => {
		const href =
			cppRecursionTraceWorksheet.match(/\]\((\/ide\?[^)]+)\)/)![1];
		const params = new URL(href, "https://classes.local").searchParams;
		expect(params.get("course")).toBe("cpp-level-3");
		expect(params.get("mode")).toBe("cpp");
		expect(params.get("projectKey")).toBe(
			"cpp-level-3:cpp-level-3-cppi2-recursion-and-the-call-stack-curriculum-cppi2-project-recursive-maze-or-word-search:starter"
		);
		expect(params.get("starterUrl")).toBe(
			"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursive-Maze-Search/starter"
		);
		expect(params.get("lesson")).toBe(
			"cpp-level-3-cppi2-recursion-and-the-call-stack"
		);
		expect(cppRecursionTraceWorksheet).toContain(
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
			source + "solution/WORKED-TRACE.md"
		);
		expect(findWorksheet(course).ideImport).toBe(false);
	});
});
