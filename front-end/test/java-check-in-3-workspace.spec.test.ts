import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaLevel3ProjectKey,
	javaCheckIn3ModuleID,
	javaCheckIn3Projects,
	javaCheckIn3URL,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("keeps all four Check-In 3 project pairs, complete lessons and the shared workbook extension", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const learner = await catalog.loadCourseById("java-level-3");
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await catalog.loadCourseById("java-level-3");
	const find = (course: typeof tutor) =>
		course?.modules.find(item => item.id === javaCheckIn3ModuleID);
	const module = find(tutor),
		learnerModule = find(learner);
	if (!module || !learnerModule)
		throw new Error("Expected the required Check-In 3 module");
	const items = [...module.curriculum, ...module.supplementalProjects];
	const learnerItems = [
		...learnerModule.curriculum,
		...learnerModule.supplementalProjects
	];

	expect(
		module.curriculum.filter(item => item.contentKind === "reading")
	).toHaveLength(6);
	expect(module.curriculum.filter(item => item.ideImport)).toHaveLength(2);
	expect(
		module.supplementalProjects.filter(item => item.ideImport)
	).toHaveLength(3);
	expect(module.curriculum[0]?.content).toContain(
		"Complete the workbook methods"
	);
	expect(module.curriculum[1]?.content).toContain("static nested type");

	expect(module.curriculum[1]).toMatchObject({
		id:
			javaCheckIn3ModuleID +
			"-curriculum-java-level-3-check-in-3-core-concepts",
		aliases: expect.arrayContaining(["core-concepts"])
	});
	expect(
		module.curriculum.find(
			item =>
				item.id ===
				javaCheckIn3ModuleID +
					"-curriculum-check-in-3-application-check"
		)?.content
	).toContain("the first removals are 2, 3 and 1");
	for (const project of javaCheckIn3Projects) {
		const starter = javaCheckIn3URL(project.pack, "starter");
		const reference = javaCheckIn3URL(project.pack, "solution");
		const files = ["Main.java", "ContractTests.java", "README.md"];
		expect(
			items.find(item => item.id === project.id),
			project.id
		).toMatchObject({
			ideImport: true,
			projectLink: starter,
			solutionLink: reference
		});
		expect(
			learnerItems.find(item => item.id === project.id)?.solutionLink
		).toBeUndefined();
		expect(
			javaSearchImportFiles(starter)?.map(entry => entry.name)
		).toEqual(files);
		expect(
			javaSearchImportFiles(reference)?.map(entry => entry.name)
		).toEqual(files);
	}
	const workbook = javaCheckIn3Projects[0];
	const source = javaCheckIn3URL(workbook.pack, "starter");
	const core = javaLevel3ProjectKey(
		"java-level-3",
		workbook.id,
		"starter",
		source
	);
	const extension = module.supplementalProjects.find(
		item => item.projectLink === source
	);
	expect(extension?.id).toContain("check-in-3-extension-challenge");
	expect(
		javaLevel3ProjectKey(
			"java-level-3",
			extension?.id ?? "",
			"starter",
			source
		)
	).toBe(core);
	expect(javaNativeBuildInstructions(core, source)).toContain(
		"javac --release 21 -Xlint:all -Werror Main.java ContractTests.java"
	);
	expect(javaNativeBuildInstructions(core, source)?.join("\n")).toContain(
		"java ContractTests groups"
	);
});
