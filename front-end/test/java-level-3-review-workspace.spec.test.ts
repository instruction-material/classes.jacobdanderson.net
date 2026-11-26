import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaLevel3ProjectKey,
	javaReviewProjects,
	javaReviewURL,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("preserves the 14 Java review project roles and two shared extensions", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const getArchive = async () =>
		(await catalog.loadCourseById("java-level-3"))?.modules.find(
			module => module.title === "Java Foundations Reference Archive"
		);
	const learner = await getArchive();
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await getArchive();
	if (!learner || !tutor) throw new Error("Missing Java review appendix");

	const items = [...tutor.curriculum, ...tutor.supplementalProjects];
	const learnerItems = [
		...learner.curriculum,
		...learner.supplementalProjects
	];
	expect(tutor.kind).toBe("appendix");
	expect(javaReviewProjects).toHaveLength(14);
	const teaching = items
		.filter(item => !item.projectLink)
		.map(item => item.content)
		.join("\n");
	expect(teaching).toContain("7.0 / 2 gives 3.5");
	expect(teaching).toContain("grid[1][2] is 12");
	expect(teaching).toContain("stores its Size");

	for (const { id, pack } of javaReviewProjects) {
		const starter = javaReviewURL(pack, "starter");
		const solution = javaReviewURL(pack, "solution");
		expect(
			items.find(item => item.id === id),
			id
		).toMatchObject({
			projectLink: starter,
			solutionLink: solution,
			ideImport: true,
			contentKind: "assignment"
		});
		expect(
			learnerItems.find(item => item.id === id)?.solutionLink
		).toBeUndefined();
		for (const role of [starter, solution]) {
			expect(
				javaSearchImportFiles(role)?.map(entry => entry.name)
			).toEqual(["Main.java", "ContractTests.java", "README.md"]);
		}
	}
	for (const [project, mode] of [
		[javaReviewProjects[0], "headline"],
		[javaReviewProjects[8], "attendance"]
	] as const) {
		const starter = javaReviewURL(project.pack, "starter");
		const extension = tutor.supplementalProjects.find(
			item => item.projectLink === starter
		);
		expect(extension?.content).toContain("java ContractTests " + mode);
		const original = javaLevel3ProjectKey(
			"java-level-3",
			project.id,
			"starter",
			starter
		);
		expect(
			javaLevel3ProjectKey(
				"java-level-3",
				extension?.id ?? "",
				"starter",
				starter
			)
		).toBe(original);
		expect(
			javaNativeBuildInstructions(original, starter)?.join("\n")
		).toContain(mode);
	}
});
