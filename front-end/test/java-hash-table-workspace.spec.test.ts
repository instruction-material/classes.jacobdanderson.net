import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaLevel3ProjectKey,
	javaHashTableModuleID,
	javaHashTableProjects,
	javaHashTableURL,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("keeps all four AJ15 project pairs, complete lessons and the shared compaction extension", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const learner = await catalog.loadCourseById("java-level-3");
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await catalog.loadCourseById("java-level-3");
	const find = (course: typeof tutor) =>
		course?.modules.find(item => item.id === javaHashTableModuleID);
	const module = find(tutor),
		learnerModule = find(learner);
	if (!module || !learnerModule)
		throw new Error("Expected the required AJ15 module");
	const items = [...module.curriculum, ...module.supplementalProjects];
	const learnerItems = [
		...learnerModule.curriculum,
		...learnerModule.supplementalProjects
	];

	expect(
		module.curriculum.filter(item => item.contentKind === "reading")
	).toHaveLength(5);
	expect(module.curriculum.filter(item => item.ideImport)).toHaveLength(2);
	expect(
		module.supplementalProjects.filter(item => item.ideImport)
	).toHaveLength(3);

	expect(module.curriculum[0]).toMatchObject({
		id: javaHashTableModuleID + "-curriculum-hash-tables-core-concepts",
		aliases: expect.arrayContaining(["core-concepts"])
	});
	expect(
		module.curriculum.find(item => item.title === "Dealing with Collisions")
			?.content
	).toContain("never-used slot ends");
	expect(
		module.curriculum.find(
			item =>
				item.id ===
				javaHashTableModuleID +
					"-curriculum-hash-tables-application-check"
		)?.content
	).toContain("rehashing preserves every key-value pair exactly once");
	for (const [index, project] of javaHashTableProjects.entries()) {
		const starter = javaHashTableURL(project.pack, "starter");
		const reference = javaHashTableURL(project.pack, "solution");
		const files = ["Main.java", "ContractTests.java", "README.md"];
		if (index < 2) files.push("HashMap.java", "Map.java");
		if (index === 1) files.push("corpus.txt");
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
	const map = javaHashTableProjects[0];
	const source = javaHashTableURL(map.pack, "starter");
	const core = javaLevel3ProjectKey(
		"java-level-3",
		map.id,
		"starter",
		source
	);
	const extension = module.supplementalProjects.find(
		item => item.projectLink === source
	);
	expect(extension?.id).toContain("extension-challenge-hash-tables");
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
		"java ContractTests compact"
	);
});
