import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaAdvancedSequenceModuleID,
	javaLevel3ProjectKey,
	javaPackageReviewProjects,
	javaPackageReviewURL,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("preserves the three AJ19 package layouts and separates learner and reference roles", async () => {
	setActivePinia(createPinia());
	const store = useCoursesStore();
	const module = async () =>
		(await store.loadCourseById("java-level-3"))?.modules.find(
			item => item.id === javaAdvancedSequenceModuleID
		);
	const learner = await module();
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await module();
	if (!learner || !tutor) throw new Error("Missing advanced Java appendix");

	const specs = [
		"src/gradebook/Gradebook.java",
		"src/commands/Parser.java",
		"src/quotes/Shipping.java"
	];
	for (const [index, entry] of javaPackageReviewProjects.entries()) {
		const starter = javaPackageReviewURL(entry.pack, "starter");
		const reference = javaPackageReviewURL(entry.pack, "solution");
		expect(
			tutor.supplementalProjects.find(item => item.id === entry.id)
		).toMatchObject({
			contentKind: "assignment",
			ideImport: true,
			projectLink: starter,
			solutionLink: reference
		});
		expect(
			learner.supplementalProjects.find(item => item.id === entry.id)
				?.solutionLink
		).toBeUndefined();
		expect(
			tutor.curriculum.find(item => item.id === entry.id)
		).toBeUndefined();
		for (const url of [starter, reference]) {
			expect(javaSearchImportFiles(url)?.map(file => file.name)).toEqual([
				specs[index],
				"src/runner/Main.java",
				"src/checks/ContractTests.java",
				"sources.txt",
				"README.md"
			]);
		}
		const key = javaLevel3ProjectKey(
			"java-level-3",
			entry.id,
			"starter",
			starter
		);
		const build = javaNativeBuildInstructions(key, starter);
		expect(build).toContain(
			"javac --release 21 -Xlint:all -Werror -d out @sources.txt"
		);
		expect(build).toContain("java -cp out checks.ContractTests");
		if (index === 2)
			expect(build?.join("\n")).toContain(
				"checks.ContractTests characterize"
			);
	}
});
