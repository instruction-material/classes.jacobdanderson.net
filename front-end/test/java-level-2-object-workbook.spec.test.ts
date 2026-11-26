import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaCheckIn1CarExtensionID,
	javaCourseProjectKey,
	javaObjectWorkbooks,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it("keeps introductory, check-in, inheritance, and map workbooks in their original sections with separate role imports", async () => {
	setActivePinia(createPinia());
	const courseID = "java-level-2";
	const read = () => useCoursesStore().loadCourseById(courseID);
	const learner = await read();
	useAppStore().currentTutor = { coursePermissions: [courseID] } as never;
	const tutor = await read();
	const bridge = tutor?.modules.find(
		module => module.title === "JM0 Visual-to-OOP Bridge"
	);
	expect(bridge?.curriculum.map(item => item.content).join("\n")).toContain(
		"After `fido.setAge(5)`, the ages are 5 and 2"
	);

	const samples = {
		"JM1-Dog-Class": "Name: Fido, Age: 5",
		"JM1-Supplemental-Project-1-Employee": "ID Number: 76544",
		"JM2-Person-Class": "Name: Jack, Grade: 6, Age: 12",
		"JM2-Book-Class": "Same title and author: true",
		"JM2-Supplemental-Project-2-Boba": "Matches the most popular order.",
		"JM3-Quiz-Class": "Quizzes created: 2",
		"JM3-House-Class": "Houses created: 3",
		"JM3-Supplemental-Project-1-Basketball-Statistics":
			"Riley | total 18 | fouls 6 | disqualified",
		"J2-01-jm3-static-variables-and-methods-supplemental-3":
			"Calling the scoring method",
		"J2-02-check-in-1-supplemental-2": "Issued: 2, redeemed: 1",
		"J2-03-check-in-1-supplemental-3":
			"Points view: [West, East, North, South]",
		"JM-Check-in-1": "Cars created: 3",
		"JM-Check-in-1-Additional-Project":
			"Sorted: [13 of clubs, 1 of hearts, 2 of hearts, 1 of spades]",
		"JM4-Rectangle-and-Square-Class": "Square: area 16, perimeter 16",
		"JM4-Book-and-Picture-Book-Class": "Same illustrated edition: false",
		"JM4-Project-3-Vehicle-Inheritance":
			"2019 Camry, wheels 4, miles 13.5, doors 4",
		"JM4-Supplemental-Project-1-Pet-Dog-and-Cat-Class": "Cheeto says Meow",
		"JM4-Lesson-and-DanceLesson-Class": "Ballet is easier: true",
		"J2-04-jm4-subclasses-and-inheritance-supplemental-3":
			"Market Lane: 800 cents",
		"JM5-Maps": "Inventory: {banana=79, bread=400}",
		"JM5-Letter-Frequencies": "Most frequent: a (2)",
		"JM5-PROJECT-2-DealershipDatabase": "Missing VIN: null",
		"JM5-Supplemental-Project-1-Lending-Library": "The Cat in the Hat",
		"J2-05-jm5-maps-supplemental-2": "Missing room: 0",
		"J2-06-jm5-maps-supplemental-3": "After second: {folder=2, pen=3}"
	};
	expect(javaObjectWorkbooks.map(pack => pack.pack)).toEqual(
		Object.keys(samples)
	);
	for (const pack of javaObjectWorkbooks) {
		const locate = (course: typeof tutor) =>
			course?.modules
				.flatMap(module =>
					!pack.id.includes("-supplemental-")
						? module.curriculum
						: module.supplementalProjects
				)
				.find(item => item.id === pack.id);
		const project = locate(tutor);
		expect(project, pack.pack).toMatchObject({
			contentKind: "assignment",
			ideImport: true
		});
		expect(locate(learner)?.solutionLink).toBeUndefined();
		expect(locate(learner)?.projectLink).toBe(project?.projectLink);
		expect(project?.content).toContain(
			samples[pack.pack as keyof typeof samples]
		);

		const starter = project?.projectLink ?? "";
		const reference = project?.solutionLink ?? "";
		expect(starter).not.toBe(reference);
		for (const [role, url] of [
			["starter", starter],
			["reference", reference]
		] as const) {
			const key = javaCourseProjectKey(courseID, pack.id, role, url);
			expect(key).toBe(
				`${courseID}:${pack.id}:${role}:native-java-objects`
			);
			expect(javaNativeBuildInstructions(key, url)).toContain(
				pack.pack === "JM4-Project-3-Vehicle-Inheritance" ||
				pack.pack === "JM5-PROJECT-2-DealershipDatabase"
					? "java -cp out vehicles.ContractTests"
					: "java ContractTests"
			);
			expect(
				javaSearchImportFiles(url)?.map(entry => entry.name)
			).toEqual(pack.files);
			expect(
				javaSearchImportFiles(url.replace(pack.revision, "main"))
			).toBeNull();
		}
		expect(
			javaCourseProjectKey(courseID, pack.id, "reference", starter)
		).toBe(`${courseID}:${pack.id}:reference`);
	}

	const car = javaObjectWorkbooks.find(
		pack => pack.pack === "JM-Check-in-1"
	)!;
	const module = tutor?.modules.find(
		candidate => candidate.id === "java-level-2-check-in-1"
	);
	const core = module?.curriculum.find(item => item.id === car.id);
	const extension = module?.supplementalProjects.find(
		item => item.id === javaCheckIn1CarExtensionID
	);
	expect(extension).toMatchObject({
		projectLink: core?.projectLink,
		solutionLink: core?.solutionLink,
		ideImport: true
	});
	expect(extension?.content).toContain("java ContractTests extension");
	expect(
		javaCourseProjectKey(
			courseID,
			extension!.id,
			"starter",
			extension!.projectLink!
		)
	).toBe(
		javaCourseProjectKey(courseID, car.id, "starter", core!.projectLink!)
	);
});
