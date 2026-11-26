import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaAdvancedSequenceModuleID,
	javaCollectionPipelinesProjects,
	javaCollectionPipelinesURL,
	javaLevel3ProjectKey,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("keeps all AJ20 and AJ21 projects optional and imports the source and data roles intact", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const current = async () =>
		(await catalog.loadCourseById("java-level-3"))?.modules.find(
			item => item.id === javaAdvancedSequenceModuleID
		);
	const learner = await current();
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await current();
	if (!learner || !tutor) throw new Error("Missing advanced Java appendix");
	const extras = [
		[
			"Identified.java",
			"CourseRecord.java",
			"StudentRecord.java",
			"Repository.java"
		],
		[],
		[],
		["events.txt"],
		["records.csv"],
		[]
	];
	expect(javaCollectionPipelinesProjects).toHaveLength(6);
	for (const [index, entry] of javaCollectionPipelinesProjects.entries()) {
		const starter = javaCollectionPipelinesURL(entry.pack, "starter");
		const solution = javaCollectionPipelinesURL(entry.pack, "solution");
		expect(
			tutor.supplementalProjects.find(item => item.id === entry.id)
		).toMatchObject({
			projectLink: starter,
			solutionLink: solution,
			contentKind: "assignment",
			ideImport: true
		});
		expect(
			tutor.curriculum.find(item => item.id === entry.id)
		).toBeUndefined();
		expect(
			learner.supplementalProjects.find(item => item.id === entry.id)
				?.solutionLink
		).toBeUndefined();
		for (const url of [starter, solution]) {
			expect(javaSearchImportFiles(url)?.map(file => file.name)).toEqual([
				"Main.java",
				"ContractTests.java",
				"README.md",
				...extras[index]!
			]);
		}
		const key = javaLevel3ProjectKey(
			"java-level-3",
			entry.id,
			"starter",
			starter
		);
		expect(javaNativeBuildInstructions(key, starter)).toContain(
			index === 0
				? "javac --release 21 -Xlint:all -Werror *.java"
				: "javac --release 21 -Xlint:all -Werror Main.java ContractTests.java"
		);
	}
});
