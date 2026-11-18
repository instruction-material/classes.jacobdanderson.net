import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import fixture from "../../test/fixtures/machine-learning-tree-selection-sources.json";

for (const role of ["learner", "instructor"] as const) {
	it(`retains the original tree core identity and correct source role for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "tree-course-tutor",
				name: "Instructor",
				email: "tree@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["machine-learning"],
				editTutors: false,
				saveEdit: "Save"
			});
		const course =
			(await useCoursesStore().loadCourseById("machine-learning"))!;
		const project = fixture.projects[0]!;
		const module = course.modules.find(row => row.id === project.moduleId)!;
		const item = module.curriculum.find(row => row.id === project.itemId)!;
		expect(item.content).toBe(project.assignmentText.trim());
		expect(item.ideImport).toBe(true);
		const base = `https://github.com/instruction-material/AI-Level-2/tree/${fixture.revision}/`;
		expect(item.projectLink).toBe(base + project.sources.starter);
		expect(item.solutionLink).toBe(
			role === "instructor" ? base + project.sources.solution : undefined
		);
		const lab = module.curriculum.find(
			row => row.id === fixture.coreReading.itemId
		)!;
		expect(lab.content).toBe(fixture.coreReading.content.trim());
		expect(lab.contentKind).toBe("reading");
		expect(lab.ideImport).toBe(false);
		const extension = module.supplementalProjects.find(row =>
			row.title.startsWith("Extension Challenge:")
		)!;
		expect(extension.content).toContain("[5.51,0]");
		expect(extension.ideImport).toBe(false);
		const codeTasks = module.supplementalProjects.filter(
			row => row.ideImport
		);
		expect(codeTasks.map(row => row.title)).toEqual([
			"Transfer Practice: Decision Trees and Interpretable Models",
			"Extension Practice: Decision Trees and Interpretable Models"
		]);
		expect(
			codeTasks
				.map(row => row.projectLink)
				.every(link => link?.includes("/ML-0"))
		).toBe(true);
	});
}
