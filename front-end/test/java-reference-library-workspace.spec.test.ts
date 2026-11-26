import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaLevel3ProjectKey,
	javaReferenceLibraryProjects,
	javaReferenceLibraryURL,
	javaSearchImportFiles,
	javaStreetSearcherModuleID
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("keeps AJ18 labs optional and points legacy capstone entries at Street Searcher", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const loadArchive = async () =>
		(await catalog.loadCourseById("java-level-3"))?.modules.find(
			module => module.title === "Java Foundations Reference Archive"
		);
	const learner = await loadArchive();
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await loadArchive();
	if (!tutor || !learner) throw new Error("Missing Java reference appendix");

	const prefix = "java-level-3-java-foundations-reference-archive";
	const comparison = tutor.curriculum.find(
		item =>
			item.id ===
			prefix +
				"-curriculum-core-project-repo-extension-starter-and-capstone-library"
	);
	expect(comparison).toMatchObject({
		title: "Compare a Reference and an Attempt",
		contentKind: "reading",
		aliases: expect.arrayContaining([
			"aj18-repo-extension-starter-and-capstone-library-core-project"
		])
	});
	expect(comparison?.projectLink).toBeUndefined();
	for (const anchor of [
		"extension-google-maps-showcase",
		"starter-street-searcher",
		"starter-master-project"
	]) {
		const reading = tutor.supplementalProjects.find(
			item => item.id === prefix + "-supplemental-" + anchor
		);
		expect(reading?.contentKind).toBe("reading");
		expect(reading?.content).toContain(
			"/courses#" + javaStreetSearcherModuleID
		);
		expect(reading?.projectLink).toBeUndefined();
	}
	expect(
		tutor.supplementalProjects.find(
			item => item.title === "Reference: Open Addressing Hash Tables"
		)?.content
	).toContain("visit 1, 2, 1 and 2");
	expect(
		tutor.supplementalProjects.find(
			item => item.title === "Reference: Node Class"
		)?.content
	).toContain("kept can still reach B");

	for (const entry of javaReferenceLibraryProjects) {
		const starter = javaReferenceLibraryURL(entry.pack, "starter");
		const reference = javaReferenceLibraryURL(entry.pack, "solution");
		expect(
			tutor.curriculum.find(item => item.id === entry.id)
		).toBeUndefined();
		expect(
			tutor.supplementalProjects.find(item => item.id === entry.id)
		).toMatchObject({
			contentKind: "assignment",
			projectLink: starter,
			solutionLink: reference,
			ideImport: true
		});
		expect(
			learner.supplementalProjects.find(item => item.id === entry.id)
				?.solutionLink
		).toBeUndefined();
		const chained = entry === javaReferenceLibraryProjects[2];
		for (const url of [starter, reference]) {
			expect(javaSearchImportFiles(url)?.map(file => file.name)).toEqual([
				"Main.java",
				"ContractTests.java",
				"README.md",
				...(chained ? ["HashMap.java"] : [])
			]);
		}
		const key = javaLevel3ProjectKey(
			"java-level-3",
			entry.id,
			"starter",
			starter
		);
		expect(javaNativeBuildInstructions(key, starter)).toContain(
			chained
				? "javac --release 21 -Xlint:all -Werror *.java"
				: "javac --release 21 -Xlint:all -Werror Main.java ContractTests.java"
		);
	}
});
