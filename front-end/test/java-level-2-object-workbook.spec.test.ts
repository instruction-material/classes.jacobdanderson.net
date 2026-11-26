import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaCourseProjectKey,
	javaObjectWorkbooks,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("keeps the JM1 and JM2 assignments in their original sections with separate role imports", async () => {
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

	const samples = {
		"JM1-Dog-Class": "Name: Fido, Age: 5",
		"JM1-Supplemental-Project-1-Employee": "ID Number: 76544",
		"JM2-Person-Class": "Name: Jack, Grade: 6, Age: 12",
		"JM2-Book-Class": "Same title and author: true",
		"JM2-Supplemental-Project-2-Boba": "Matches the most popular order."
	};
	expect(javaObjectWorkbooks.map(pack => pack.pack)).toEqual(
		Object.keys(samples)
	);
	for (const pack of javaObjectWorkbooks) {
		const locate = (course: typeof tutor) =>
			course?.modules
				.flatMap(module =>
					!pack.pack.includes("Supplemental")
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
			samples[pack.pack as keyof typeof samples]
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
				javaSearchImportFiles(url.replace(pack.revision, "main"))
			).toBeNull();
		}
		expect(
			javaCourseProjectKey(courseID, pack.id, "reference", starter)
		).toBe(`${courseID}:${pack.id}:reference`);
	}
});
