import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaLevel3ProjectKey,
	javaSearchImportFiles,
	javaSustainableModuleID,
	javaSustainableProjects,
	javaSustainableURL
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("keeps all five author-approved AJ10 projects, older lesson links and the saved bakery", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const learner = await catalog.loadCourseById("java-level-3");
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await catalog.loadCourseById("java-level-3");
	const find = (course: typeof tutor) =>
		course?.modules.find(item => item.id === javaSustainableModuleID);
	const module = find(tutor),
		learnerModule = find(learner);
	if (!module || !learnerModule)
		throw new Error("Expected the required AJ10 module");
	const items = [...module.curriculum, ...module.supplementalProjects];
	const learnerItems = [
		...learnerModule.curriculum,
		...learnerModule.supplementalProjects
	];
	expect(
		module.curriculum.filter(item => item.contentKind === "reading")
	).toHaveLength(3);
	expect(module.curriculum[0]).toMatchObject({
		id:
			javaSustainableModuleID +
			"-curriculum-sustainable-programming-core-concepts",
		aliases: expect.arrayContaining([
			javaSustainableModuleID + "-curriculum-core-concepts"
		])
	});
	for (const [index, project] of javaSustainableProjects.entries()) {
		const starter = javaSustainableURL(project.pack, "starter");
		const reference = javaSustainableURL(project.pack, "solution");
		const files = ["Main.java", "ContractTests.java", "README.md"];
		if (index === 0) files.push("Bakery.java");
		if (index === 2) files.push("sample.txt");
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
	const bakery = javaSustainableProjects[0];
	const source = javaSustainableURL(bakery.pack, "starter");
	const core = javaLevel3ProjectKey(
		"java-level-3",
		bakery.id,
		"starter",
		source
	);
	const extension = module.supplementalProjects.find(
		item => item.projectLink === source
	);
	expect(extension?.id).toContain(
		"extension-challenge-sustainable-programming"
	);
	expect(
		javaLevel3ProjectKey(
			"java-level-3",
			extension?.id ?? "",
			"starter",
			source
		)
	).toBe(core);
	expect(javaNativeBuildInstructions(core, source)).toContain(
		"javac --release 21 -Xlint:all -Werror *.java"
	);
	expect(javaNativeBuildInstructions(core, source)?.join("\n")).toContain(
		"java ContractTests batches"
	);
});
