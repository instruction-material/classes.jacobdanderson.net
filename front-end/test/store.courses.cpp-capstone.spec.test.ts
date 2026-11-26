import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";
import { cppCapstoneLessons } from "@/stores/courses/cppCapstoneLessons";

const base = "https://github.com/instruction-material/CPP-Level-3/";
const anchor = "cpp-level-3-cppi6-polymorphism-and-bridge-to-advanced-c";
const primary = "CPPI6-Saveable-Command-Simulation";
const optional = "CPPI6-Enum-vs-Polymorphic-State-Review";
const programs = (text: string) =>
	[...text.matchAll(/```cpp\n([\s\S]*?)\n```/g)].map(match => match[1]);
const links = (text: string) =>
	[...text.matchAll(/\]\((\/ide\?[^)]+)\)/g)].map(
		match => new URL(match[1], "https://classes.local").searchParams
	);

describe("complete rover teaching and separate optional state practice", () => {
	beforeEach(() => setActivePinia(createPinia()));
	for (const role of ["learner", "instructor"] as const) {
		it(`retains course scope and readable teaching for ${role}`, async () => {
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "rover-tutor",
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
			const module = course.modules.find(item =>
				item.title.startsWith("CPPI6 ")
			)!;
			const [dispatch, pathways, project] = module.curriculum;
			for (const lesson of [dispatch, pathways]) {
				expect(isLessonLearningItem(lesson)).toBe(true);
				expect(programs(lesson.content)).toHaveLength(1);
				expect(lesson.content).toContain("Concept focus");
			}
			for (const term of ["virtual", "override", "unique_ptr", "slicing"])
				expect(dispatch.content).toContain(term);
			for (const term of [
				"Data Structures and Algorithms in C++",
				"Design Patterns in C++",
				"C Systems Engineering",
				"entered"
			])
				expect(pathways.content).toContain(term);
			for (const term of [
				"parseCommand",
				"nextPhase",
				"visitRoute",
				"decodeSnapshot",
				"65,536",
				"rover-stage"
			])
				expect(project.content).toContain(term);
			for (const lesson of [dispatch, pathways])
				expect(lesson.ideImport).not.toBe(true);
			for (const [lesson, key] of [
				[dispatch, "dispatch"],
				[pathways, "pathways"]
			] as const)
				expect(programs(lesson.content)).toEqual(
					programs(cppCapstoneLessons[key])
				);
			expect(project.id).toBe(
				`${anchor}-curriculum-cppi6-capstone-saveable-command-driven-simulation`
			);
			expect(project.learningPath).toBe("core");
			expect(project.ideImport).toBe(true);
			expect(project.projectLink).toBe(
				`${base}tree/main/${primary}/starter`
			);
			expect(project.solutionLink).toBe(
				role === "instructor"
					? `${base}tree/main/${primary}/solution`
					: undefined
			);
			const worksheet = module.supplementalProjects[0];
			expect(worksheet.ideImport).toBe(false);
			expect(worksheet.learningPath).not.toBe("core");
			expect(worksheet.projectLink).toBe(
				`${base}blob/main/${optional}/WORKSHEET.md`
			);
			expect(worksheet.content).toContain(
				"Reading this worksheet imports no code"
			);
			expect(worksheet.content).toContain(
				"Open separate state review practice"
			);
			expect(worksheet.content).not.toContain("reference-pack-v1");
			if (role === "instructor") {
				const reference = new URL(
					worksheet.solutionLink!,
					"https://classes.local"
				).searchParams;
				expect(reference.get("starterUrl")).toBe(
					`${base}tree/main/${optional}/solution`
				);
				expect(reference.get("projectKey")).toBe(
					"cpp-level-3:cppi6-state-review:reference-pack-v1"
				);
			} else expect(worksheet.solutionLink).toBeUndefined();
		});
	}
	it("uses distinct current packs while reopening the existing primary identity", () => {
		const [saved, practice] = links(cppCapstoneLessons.worksheet);
		const [fresh] = links(cppCapstoneLessons.project);
		expect(saved.get("projectKey")).toBe(
			`cpp-level-3:${anchor}-curriculum-cppi6-capstone-saveable-command-driven-simulation:starter`
		);
		expect(fresh.get("projectKey")).toBe(
			"cpp-level-3:cppi6-rover:current-pack-v1"
		);
		expect(practice.get("projectKey")).toBe(
			"cpp-level-3:cppi6-state-review:current-pack-v1"
		);
		for (const action of [saved, fresh, practice])
			expect(action.get("lesson")).toBe(anchor);
		expect(
			cppLevel3Course.modules.reduce(
				(n, item) => n + item.curriculum.length,
				0
			)
		).toBe(22);
		expect(
			cppLevel3Course.modules.reduce(
				(n, item) => n + item.supplementalProjects.length,
				0
			)
		).toBe(14);
	});
	it("keeps both actual code packs importable while the worksheet remains reading", () => {
		expect(
			pythonIdeModeForCourseResource(
				"cpp-level-3",
				`${base}blob/main/${optional}/WORKSHEET.md`
			)
		).toBeNull();
		for (const folder of [primary, optional])
			for (const role of ["starter", "solution"])
				expect(
					pythonIdeModeForCourseResource(
						"cpp-level-3",
						`${base}tree/main/${folder}/${role}`
					)
				).toBe("cpp");
	});
});
