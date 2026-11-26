import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaCourseProjectKey,
	javaObjectWorkbooks,
	javaObjectWorkbooksRevision,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("keeps the Dog assignment in Projects and gives tutors an independent reference for both JM1 workbooks", async () => {
	setActivePinia(createPinia());
	const courseID = "java-level-2";
	const read = () => useCoursesStore().loadCourseById(courseID);
	const learner = await read();
	useAppStore().currentTutor = { coursePermissions: [courseID] } as never;
	const tutor = await read();
	const bridge = tutor?.modules.find(
		module => module.title === "JM0 Visual-to-OOP Bridge"
	);
	expect(bridge?.curriculum.map(item => item.content).join("\n")).toContain(
		"After `fido.setAge(5)`, the ages are 5 and 2"
	);

	for (const [index, pack] of javaObjectWorkbooks.entries()) {
		const locate = (course: typeof tutor) =>
			course?.modules
				.flatMap(module =>
					index === 0
						? module.curriculum
						: module.supplementalProjects
				)
				.find(item => item.id === pack.id);
		const project = locate(tutor);
		expect(project).toMatchObject({
			contentKind: "assignment",
			ideImport: true
		});
		expect(locate(learner)?.solutionLink).toBeUndefined();
		expect(locate(learner)?.projectLink).toBe(project?.projectLink);
		expect(project?.content).toContain(
			index === 0 ? "Name: Fido, Age: 5" : "ID Number: 76544"
		);

		const starter = project?.projectLink ?? "";
		const reference = project?.solutionLink ?? "";
		expect(starter).not.toBe(reference);
		for (const [role, url] of [
			["starter", starter],
			["reference", reference]
		] as const) {
			const key = javaCourseProjectKey(courseID, pack.id, role, url);
			expect(key).toBe(
				`${courseID}:${pack.id}:${role}:native-java-objects`
			);
			expect(javaNativeBuildInstructions(key, url)).toContain(
				"java ContractTests"
			);
			expect(
				javaSearchImportFiles(url)?.map(entry => entry.name)
			).toEqual(pack.files);
			expect(
				javaSearchImportFiles(
					url.replace(javaObjectWorkbooksRevision, "main")
				)
			).toBeNull();
		}
		expect(
			javaCourseProjectKey(courseID, pack.id, "reference", starter)
		).toBe(`${courseID}:${pack.id}:reference`);
	}
});
