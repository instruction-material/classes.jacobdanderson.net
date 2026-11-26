import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaLevel3ProjectKey,
	javaSearchImportFiles,
	javaStackQueueModuleID,
	javaStackQueueProjects,
	javaStackQueueURL
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("preserves AJ12 progress identities and imports distinct starter and instructor-reference workspaces", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const learner = await catalog.loadCourseById("java-level-3");
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await catalog.loadCourseById("java-level-3");
	const find = (course: typeof tutor) =>
		course?.modules.find(item => item.id === javaStackQueueModuleID);
	const module = find(tutor);
	const learnerModule = find(learner);
	if (!module || !learnerModule) throw new Error("Expected AJ12 module");

	const items = [...module.curriculum, ...module.supplementalProjects];
	const learnerItems = [
		...learnerModule.curriculum,
		...learnerModule.supplementalProjects
	];
	expect(
		module.curriculum
			.filter(item => item.contentKind === "reading")
			.map(item => item.id)
	).toEqual([
		javaStackQueueModuleID + "-curriculum-java-level-3-stacks",
		javaStackQueueModuleID + "-curriculum-queues"
	]);
	expect(module.curriculum[0]?.content).toContain(
		"is also the next free index"
	);
	expect(module.curriculum[2]?.content).toContain(
		"physical slots [40, 20, 30]"
	);
	expect(module.curriculum[0]?.aliases).toContain("stacks");
	expect(module.curriculum.filter(item => item.ideImport)).toHaveLength(2);
	expect(
		module.supplementalProjects.filter(item => item.ideImport)
	).toHaveLength(3);
	for (const project of javaStackQueueProjects) {
		const starter = javaStackQueueURL(project.pack, "starter");
		const solution = javaStackQueueURL(project.pack, "solution");
		expect(items.find(item => item.id === project.id)).toMatchObject({
			ideImport: true,
			projectLink: starter,
			solutionLink: solution
		});
		expect(learnerItems.find(item => item.id === project.id)).toMatchObject(
			{
				ideImport: true,
				projectLink: starter
			}
		);
		expect(
			learnerItems.find(item => item.id === project.id)?.solutionLink
		).toBeUndefined();
		for (const source of [starter, solution]) {
			expect(
				javaSearchImportFiles(source)?.map(entry => entry.name)
			).toEqual(["Main.java", "ContractTests.java", "README.md"]);
		}
		const starterKey = javaLevel3ProjectKey(
			"java-level-3",
			project.id,
			"starter",
			starter
		);
		const referenceKey = javaLevel3ProjectKey(
			"java-level-3",
			project.id,
			"reference",
			solution
		);
		expect(referenceKey).not.toBe(starterKey);
		expect(javaNativeBuildInstructions(starterKey, starter)).toContain(
			"javac --release 21 -Xlint:all -Werror Main.java ContractTests.java"
		);
	}
});
