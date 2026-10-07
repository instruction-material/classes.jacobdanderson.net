import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";
import { cppBuildDebugProjectBrief } from "@/stores/courses/cppBuildDebugProjectBrief";

const source =
	"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI0-Build-and-Debug-Checkpoint/";
const moduleTitle = "CPPI0 Bridge Course Setup and Positioning";
const projectTitle = "CPPI0 Project: Build and Debug Checkpoint";

describe("C++ Level 3 build checkpoint", () => {
	it("keeps the principal checkpoint and confirmed learner/reference imports", async () => {
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
		for (const course of [
			cppLevel3Course,
			(await useCoursesStore().loadCourseById("cpp-level-3"))!
		]) {
			const module = course.modules.find(
				item => item.title === moduleTitle
			)!;
			const project = module.curriculum.find(
				item => item.title === projectTitle
			)!;
			expect(project.learningPath).toBe("core");
			expect(project.projectLink).toBe(source + "starter");
			expect(project.solutionLink).toBe(source + "solution");
			expect(project.ideImport).toBe(true);
			expect(project.content).toContain("score_ledger.cpp");
			expect(project.content).toContain("score_tools.cpp");
			expect(project.content).toContain("--trace");
			expect(project.content).toContain("Total: 180");
			expect(project.content).toContain("seven passing checks");
			expect(project.content).toContain(
				"does not declare the learner's repair complete"
			);
		}
	});

	it("preserves older saved attempts and withholds the reference from learners", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const module = course.modules.find(item => item.title === moduleTitle)!;
		const project = module.curriculum.find(
			item => item.title === projectTitle
		)!;
		expect(project.solutionLink).toBeUndefined();
		expect(project.projectLink).toBe(source + "starter");
		const href =
			cppBuildDebugProjectBrief.match(/\]\((\/ide\?[^)]+)\)/)![1];
		const params = new URL(href, "https://classes.local").searchParams;
		expect(params.get("course")).toBe("cpp-level-3");
		expect(params.get("mode")).toBe("cpp");
		expect(params.get("starterUrl")).toBe(source + "starter");
		expect(params.get("projectKey")).toBe(
			"cpp-level-3:cppi0-build-and-debug-checkpoint:current-pack-v1"
		);
		expect(params.get("lesson")).toBe(
			"cpp-level-3-cppi0-bridge-course-setup-and-positioning"
		);
		expect(cppBuildDebugProjectBrief).toContain(
			"earlier project\nremains available in Projects"
		);
		expect(cppBuildDebugProjectBrief).not.toContain(
			"starts visiting elements at index 1"
		);
	});
});
