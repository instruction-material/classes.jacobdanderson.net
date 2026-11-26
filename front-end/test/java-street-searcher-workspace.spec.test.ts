import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaLevel3ProjectKey,
	javaSearchImportFiles,
	javaStreetSearcherModuleID,
	javaStreetSearcherProjects,
	javaStreetSearcherURL
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("preserves AJ17 lesson links and reuses the saved capstone across all stages", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const got = async () =>
		(await catalog.loadCourseById("java-level-3"))?.modules.find(
			module => module.id === javaStreetSearcherModuleID
		);
	const learner = await got();
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const instructor = await got();
	if (!learner || !instructor) throw new Error("Missing AJ17 module");

	const sections = (items: { id: string }[]) =>
		items.map(item =>
			item.id.replace(javaStreetSearcherModuleID + "-", "")
		);
	const required = [
		"curriculum-aj17-project-1-weighted-graph",
		"curriculum-aj17-project-2-loading-data",
		"curriculum-aj17-project-3-finding-shortest-paths"
	];
	const option = "supplemental-extension-challenge-google-maps";
	expect(sections(instructor.curriculum)).toEqual([
		"curriculum-introduction-to-street-searcher",
		...required,
		"curriculum-street-searcher-capstone-definition-of-done",
		"curriculum-google-maps-course-recap"
	]);
	expect(sections(instructor.supplementalProjects)).toEqual([
		option,
		"supplemental-google-maps-transfer-practice",
		"supplemental-google-maps-extension-practice"
	]);
	expect(instructor.curriculum[5]?.aliases).toContain("course-recap");
	expect(instructor.curriculum[5]?.content).toContain(
		"Graphs** Model direction and weights"
	);
	expect(
		instructor.curriculum.filter(item => item.contentKind === "reading")
	).toHaveLength(3);

	const assignments = [
		...instructor.curriculum,
		...instructor.supplementalProjects
	].filter(item => item.ideImport);
	expect(assignments).toHaveLength(6);
	expect(
		[...learner.curriculum, ...learner.supplementalProjects].filter(
			item => item.solutionLink
		)
	).toEqual([]);

	const [capstone, ...practice] = javaStreetSearcherProjects;
	const starter = javaStreetSearcherURL(capstone.pack, "starter");
	const reference = javaStreetSearcherURL(capstone.pack, "solution");
	const key = javaLevel3ProjectKey(
		"java-level-3",
		capstone.id,
		"starter",
		starter
	);
	for (const suffix of [...required, option]) {
		const id = javaStreetSearcherModuleID + "-" + suffix;
		expect(assignments.find(item => item.id === id)).toMatchObject({
			projectLink: starter,
			solutionLink: reference
		});
		expect(
			javaLevel3ProjectKey("java-level-3", id, "starter", starter)
		).toBe(key);
		expect(
			javaLevel3ProjectKey("java-level-3", id, "reference", reference)
		).not.toBe(key);
	}
	for (const url of [starter, reference]) {
		expect(javaSearchImportFiles(url)?.map(file => file.name)).toEqual([
			"Main.java",
			"ContractTests.java",
			"README.md",
			"StreetGraph.java",
			"RoadFile.java",
			"RouteFinder.java",
			"roads.txt"
		]);
	}
	expect(javaNativeBuildInstructions(key, starter)).toEqual(
		expect.arrayContaining([
			"javac --release 21 -Xlint:all -Werror *.java",
			"java ContractTests graph",
			"java ContractTests load",
			"java ContractTests route"
		])
	);
	for (const project of practice) {
		const practiceStarter = javaStreetSearcherURL(project.pack, "starter");
		const practiceReference = javaStreetSearcherURL(
			project.pack,
			"solution"
		);
		expect(assignments.find(item => item.id === project.id)).toMatchObject({
			projectLink: practiceStarter,
			solutionLink: practiceReference
		});
		expect(
			javaSearchImportFiles(practiceStarter)?.map(file => file.name)
		).toEqual(["Main.java", "ContractTests.java", "README.md"]);
	}
});
