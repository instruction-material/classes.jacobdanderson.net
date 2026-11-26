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

it("keeps introductory, check-in, inheritance, map, and concurrency workbooks in their original sections with separate role imports", async () => {
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
		"J2-06-jm5-maps-supplemental-3": "After second: {folder=2, pen=3}",
		"JM6-Try-Catch-Practice": "Quotient: 6",
		"JM6-Bouncing-Zeros": "Animation complete.",
		"JM6-Supplemental-Project-1-Barnyard-Orchestra": "cow: [moo, moo]",
		"J2-07-jm6-threading-and-error-handling-supplemental-2": "Hill: min -3, max 5",
		"J2-08-jm6-threading-and-error-handling-supplemental-3": "Second job: Cancelled",
		"JM-Check-in-2-Updated": "Roman Time: VIII",
		"JM-Check-in-2-Additional-Project": "Time: 1:00",
		"JM-Check-in-2-Clock-Playback": "Hours: [11, 12, 1, 2]",
		"J2-09-check-in-2-supplemental-2": "After retry: -2",
		"J2-10-check-in-2-supplemental-3": "At 1: {Harbor=5, Ridge=22}",
		"JM7-Bank-Account": "DEMO-A: 250 cents",
		"JM7-Calculator": "5!: 120",
		"J2-11-jm7-bank-account-supplemental-2": "Balances: {DEMO-A=70, DEMO-B=80}",
		"J2-12-jm7-bank-account-supplemental-3": "Summary: {supplies=200, travel=50}",
		"JM8-Writing-to-a-File": "After append: [A, Café, End]",
		"JM8-Project-1-Crazy-Name-Tags-Printer": "Tags: [ZOË, Zë, ëoZ]",
		"JM8-Reading-from-a-File": "Total: 15",
		"JM8-Project-2-File-IO-and-Maps": "Pairs: {pen=blue, folder=green}",
		"JM8-Supplemental-Project-Bank-Account": "Reopened: {DEMO-A=275, DEMO-B=50}",
		"J2-13-jm8-file-i-o-supplemental-2": "Counts: {cedar=2, fern=1}",
		"J2-14-jm8-file-i-o-supplemental-3": "Added: [Workshop]",
		"Maze-Reader": "Start: (1, 1)",
		"Maze-Runner-Part-2": "Congratulations! You've reached the exit!",
		"Maze-Runner-Part-3": "Time's up! You failed to reach the exit.",
		"J2-15-jm9-maze-runner-supplemental-2": "Accepted: 2, rejected: 1, escaped: true",
		"J2-16-jm9-maze-runner-supplemental-3": "practice: Ready at (1, 1)",
		"JM10-Tic-Tac-Toe-Console": "Winner: X",
		"JM10-Save-Round-Results": "Reopened: [X_WINS, TIE, O_WINS]",
		"J2-17-jm10-master-project-supplemental-2": "Open checks: [restart, tie]",
		"J2-18-jm10-master-project-supplemental-3": "Double: 14",
		"J2-19-applied-studio-14-jm-master-project-example-quiz-game-supplemental-2": "Science: 2/3",
		"J2-20-applied-studio-14-jm-master-project-example-quiz-game-supplemental-3": "Practice: [What orbits Earth?, What is a solid?]",
		"J2-21-applied-studio-15-jm-maze-runner-project-supplemental-2": "From middle: [A, D]",
		"J2-22-applied-studio-15-jm-maze-runner-project-supplemental-3": "Shortest route: [D, D]",
		"Archive-Console-Echo": "Echo: [  red fox  ]",
		"Archive-Counted-Sum": "Sum: 9",
		"Archive-Integer-File": "Values: [12, -3, 0, 7]",
		"Archive-Dog-Birthdays": "Dog: Fido (6)",
		"Archive-Fictional-Accounts": "Alias: Luna",
		"Archive-Quiz-Round": "Correct: 2/3",
		"Archive-Quiz-Leaderboard": "Top: [Lee (3), Ari (3)]"
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

	const archive = tutor?.modules.find(module =>
		module.title === "Optional Java Level 2 Practice and Reference Archive"
	);
	for (const [suffix, targetPack] of [
		["extension-tic-tac-toe-console", "JM10-Tic-Tac-Toe-Console"],
		["core-project-jm-maze-runner-project", "Maze-Runner-Part-3"]
	]) {
		const walkthrough = archive?.supplementalProjects.find(item => item.id.endsWith(suffix));
		const target = javaObjectWorkbooks.find(pack => pack.pack === targetPack);
		const module = tutor?.modules.find(module =>
			[...module.curriculum, ...module.supplementalProjects].some(item => item.id === target?.id)
		);
		expect(walkthrough).toMatchObject({ contentKind: "reading" });
		expect(walkthrough?.projectLink).toBeUndefined();
		expect(walkthrough?.solutionLink).toBeUndefined();
		expect(module).toBeDefined();
		expect(walkthrough?.content).toContain("/courses#" + module?.id + "-" + target?.id);
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
