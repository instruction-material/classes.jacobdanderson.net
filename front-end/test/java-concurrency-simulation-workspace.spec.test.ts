import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaAdvancedSequenceModuleID,
	javaConcurrencySimulationProjects,
	javaConcurrencySimulationURL,
	javaLevel3ProjectKey,
	javaSearchImportFiles,
	javaSimulationExtensionID
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("opens all advanced Java tasks with verified roles and reuses the saved simulation for the extension", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const read = async () =>
		(await catalog.loadCourseById("java-level-3"))?.modules.find(
			item => item.id === javaAdvancedSequenceModuleID
		);
	const learner = await read();
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await read();
	if (!tutor || !learner)
		throw new Error("Missing optional Java engineering sequence");

	const projects = tutor.supplementalProjects.filter(
		item => item.projectLink
	);
	expect(projects).toHaveLength(12);
	for (const item of projects) {
		expect(item).toMatchObject({
			contentKind: "assignment",
			ideImport: true
		});
		expect(javaSearchImportFiles(item.projectLink!)).toBeDefined();
		expect(javaSearchImportFiles(item.solutionLink!)).toBeDefined();
		expect(
			learner.supplementalProjects.find(
				candidate => candidate.id === item.id
			)?.solutionLink
		).toBeUndefined();
	}

	const [runner, simulation] = javaConcurrencySimulationProjects;
	for (const pack of [runner, simulation]) {
		const starter = javaConcurrencySimulationURL(pack.pack, "starter");
		const reference = javaConcurrencySimulationURL(pack.pack, "solution");
		for (const url of [starter, reference]) {
			expect(javaSearchImportFiles(url)?.map(file => file.name)).toEqual(
				pack.files
			);
		}
		const key = javaLevel3ProjectKey(
			"java-level-3",
			pack.id,
			"starter",
			starter
		);
		expect(javaNativeBuildInstructions(key, starter)).toContain(
			"javac --release 21 -Xlint:all -Werror -d out @sources.txt"
		);
	}
	const starter = javaConcurrencySimulationURL(simulation.pack, "starter");
	const extension = projects.find(
		item => item.id === javaSimulationExtensionID
	);
	expect(extension?.projectLink).toBe(starter);
	expect(extension?.content).toContain("checks.ContractTests extension");
	const saved = javaLevel3ProjectKey(
		"java-level-3",
		simulation.id,
		"starter",
		starter
	);
	expect(
		javaLevel3ProjectKey(
			"java-level-3",
			javaSimulationExtensionID,
			"starter",
			starter
		)
	).toBe(saved);
	expect(simulation.files).toContain("requests.txt");
});
