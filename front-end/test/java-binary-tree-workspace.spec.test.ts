import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaLevel3ProjectKey,
	javaBinaryTreeModuleID,
	javaBinaryTreeProjects,
	javaBinaryTreeURL,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("keeps all five AJ14 project pairs, complete lessons and the shared ceiling-search extension", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const learner = await catalog.loadCourseById("java-level-3");
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await catalog.loadCourseById("java-level-3");
	const find = (course: typeof tutor) =>
		course?.modules.find(item => item.id === javaBinaryTreeModuleID);
	const module = find(tutor),
		learnerModule = find(learner);
	if (!module || !learnerModule)
		throw new Error("Expected the required AJ14 module");
	const items = [...module.curriculum, ...module.supplementalProjects];
	const learnerItems = [
		...learnerModule.curriculum,
		...learnerModule.supplementalProjects
	];

	expect(
		module.curriculum.filter(item => item.contentKind === "reading")
	).toHaveLength(5);
	expect(module.curriculum.filter(item => item.ideImport)).toHaveLength(3);
	expect(
		module.supplementalProjects.filter(item => item.ideImport)
	).toHaveLength(3);

	expect(module.curriculum[0]).toMatchObject({
		id:
			javaBinaryTreeModuleID +
			"-curriculum-binary-search-trees-core-concepts",
		aliases: expect.arrayContaining(["core-concepts"])
	});
	expect(module.curriculum[0]?.content).toContain(
		"The height of this tree is 2 edges"
	);
	expect(
		module.curriculum.find(item => item.title === "Depth First Search")
			?.content
	).toContain("Postorder gives");
	expect(
		module.curriculum.find(
			item => item.title === "BST Invariant and Mutation Contract"
		)?.content
	).toContain("ordering, reachability, node count");
	for (const project of javaBinaryTreeProjects) {
		const starter = javaBinaryTreeURL(project.pack, "starter");
		const reference = javaBinaryTreeURL(project.pack, "solution");
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
	const basics = javaBinaryTreeProjects[0];
	const source = javaBinaryTreeURL(basics.pack, "starter");
	const core = javaLevel3ProjectKey(
		"java-level-3",
		basics.id,
		"starter",
		source
	);
	const extension = module.supplementalProjects.find(
		item => item.projectLink === source
	);
	expect(extension?.id).toContain("extension-challenge-binary-search-trees");
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
		"java ContractTests ceiling"
	);
});
