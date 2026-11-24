import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import {
	webContactRoot,
	webCourseProjectKey,
	webCourseResource,
	webNotesRoot,
	webImportFiles
} from "@/modules/webProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("offers runnable starters and role-appropriate keys throughout Web Foundations", async () => {
	const courseId = "web-development-foundations";
	setActivePinia(createPinia());
	const store = useCoursesStore();
	const student = (await store.loadCourseById(courseId))!;
	useAppStore().setCurrentTutor({
		_id: "web-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: [courseId],
		editTutors: false,
		saveEdit: "Save"
	});
	const tutor = (await store.loadCourseById(courseId))!;
	for (const [index, module] of student.modules.entries()) {
		const staffModule = tutor.modules[index];
		const rows = [...module.curriculum, ...module.supplementalProjects];
		const staff = [
			...staffModule.curriculum,
			...staffModule.supplementalProjects
		];
		const reading = module.curriculum[0];
		if (module.kind !== "appendix") {
			expect(reading.contentKind).toBe("reading");
			expect(reading.datasetLink).toMatch(/practice-pack\.md#.+-case$/);
			expect(staffModule.curriculum[0].solutionLink?.split("#")[1]).toBe(
				reading.datasetLink?.split("#")[1].replace(/-case$/, "-key")
			);
		}
		for (const [i, item] of rows.entries()) {
			expect(staff[i].id).toBe(item.id);
			expect(item.solutionLink).toBeUndefined();
			expect(item.content).not.toContain("verification-guide.md#");
			if (item.projectLink) {
				expect(
					webCourseResource(item.projectLink)?.role,
					item.title
				).toBe("starter");
				expect(item.ideImport).toBe(true);
			}
		}
		if (module.title.startsWith("Full-Stack Web Lab")) {
			const root = module.title.includes("API Integration")
				? webContactRoot
				: webNotesRoot;
			const projects = rows.filter(row => row.projectLink);
			expect(projects).toHaveLength(4);
			for (const item of projects) {
				expect(item.projectLink).toBe(root + "/starter");
				expect(item.datasetLink).toBe(reading.datasetLink);
				expect(
					webImportFiles(item.projectLink!)?.map(file => file.name)
				).toContain("src/server.js");
			}
			const core = staff.find(item =>
				item.title.startsWith("Core Project:")
			)!;
			expect(core.solutionLink).toBe(root + "/solution");
			expect(
				webCourseProjectKey(
					courseId,
					core.id,
					"starter",
					core.projectLink!
				)
			).not.toBe(
				webCourseProjectKey(
					courseId,
					core.id,
					"reference",
					core.solutionLink!
				)
			);
			expect(
				staff.filter(item => item.projectLink && item.solutionLink)
			).toEqual([core]);
		}
		if (module.title === "Project Practice Guide") {
			expect(module.supplementalProjects).toHaveLength(5);
			expect(
				module.supplementalProjects.every(
					item => item.datasetLink && item.projectLink
				)
			).toBe(true);
		}
	}
});
