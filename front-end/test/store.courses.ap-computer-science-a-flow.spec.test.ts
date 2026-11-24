import fs from "node:fs";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import {
	apAdvancedPracticeResources,
	apBinarySearchResources,
	apBlobEraseResources,
	apCheckInAndFrqResources,
	apClassesAndArraysResources,
	apComputerScienceAProjectKey,
	apElevatorWarningResources,
	apEnrichmentResources,
	apExpressionsAndClassResources,
	apFoundationsSupplementalResources,
	apIntroductoryResources,
	apListsAndAlgorithmsResources,
	apMergeSortResources,
	apRecursionPracticeResources,
	apRecursionReferenceResources,
	apRemainingCoreResources,
	apStudentClassResources,
	apVariablesAndLoopsResources
} from "@/modules/apComputerScienceAResources";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useCoursesStore } from "@/stores/courses";
import { apComputerScienceACourse } from "@/stores/courses/ap-computer-science-a";
import { loadRawCourse } from "@/stores/courses/index";

const EXPECTED_PRIMARY_SEQUENCE = [
	"General: Course Introduction and Setup",
	"Check-In #1",
	"APCS1 Variables and Input/Output",
	"APCS2 Operators",
	"APCS3 Conditionals and Packages",
	"APCS4 Selection, Iteration, and Runtime Reasoning",
	"Check-In #2",
	"APCS5 Classes Part I",
	"APCS6 Classes Part II",
	"Check-In #3",
	"APCS9 Software Development Lifecycle",
	"APCS10 Arrays",
	"APCS11 ArrayLists",
	"Check-In #4",
	"APCS12 Wrapper Classes",
	"APCS13 Algorithmic Runtime and Linear Search",
	"APCS14 Selection and Insertion Sort",
	"APCS15 Recursion",
	"APCS16 Binary Search and Merge Sort",
	"APCS17 Master Projects and Test Prep"
];

const MOVED_REFERENCE_TITLES = [
	"Practice Resources",
	"Reference Pack",
	"Loop Reference Pack",
	"Array Reference Pack",
	"ArrayList Reference Pack",
	"Recursion Reference Pack",
	"Next Course Positioning"
];

function requireModule(title: string) {
	const module = apComputerScienceACourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected AP CSA module ${title}.`);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function moduleResourceText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.flatMap(item => [
			item.projectLink,
			item.solutionLink,
			item.datasetLink,
			item.mediaLink
		])
		.filter(Boolean)
		.join("\n");
}

function courseText() {
	return apComputerScienceACourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

describe("AP Computer Science A learner flow", () => {
	it("keeps the exam-framework reading separate from generated coding tasks", async () => {
		const title = "Current Four-Unit Framework and Digital Exam";
		const authored = apComputerScienceACourse.modules[0].curriculum.find(
			item => item.title === title
		)!;
		const course = (await loadRawCourse("ap-computer-science-a"))!;
		const displayed = course.modules[0].curriculum.find(
			item => item.title === title
		)!;
		expect(displayed.content).toBe(authored.content);
		expect(displayed.contentKind).toBe("reading");
		expect(displayed.content).not.toContain("Java checkpoint");
	});

	it("keeps the authored prerequisites and diagnostics in the displayed course", async () => {
		const course = await loadRawCourse("ap-computer-science-a");
		expect(course).not.toBeNull();
		expect(
			course!.modules
				.filter(module => module.kind !== "appendix")
				.map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
	});

	it("uses one twenty-module current-AP spine and one explicit enrichment appendix", () => {
		expect(
			apComputerScienceACourse.modules
				.slice(0, 20)
				.map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(apComputerScienceACourse.modules).toHaveLength(21);
		expect(apComputerScienceACourse.modules[20]).toMatchObject({
			kind: "appendix",
			title: "Optional Inheritance and Polymorphism Enrichment"
		});
		expect(
			apComputerScienceACourse.modules
				.slice(0, 20)
				.map(module => module.title)
		).not.toContain("APCS7 Inheritance");
		expect(
			apComputerScienceACourse.modules
				.slice(0, 20)
				.map(module => module.title)
		).not.toContain("APCS8 Polymorphism");
	});

	it("gives every required module pacing, milestones, and explicit paths", () => {
		for (const module of apComputerScienceACourse.modules.slice(0, 20)) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("keeps the binary-search trace runnable and recursive writing optional", () => {
		const search = requireModule("APCS16 Binary Search and Merge Sort");
		const trace = search.curriculum.find(
			item => item.title === "Core Project: Binary Search"
		)!;
		expect(trace).toMatchObject({ ideImport: true, learningPath: "core" });
		expect(trace.content).toContain("Trace the missing target 7");
		expect(trace.projectLink).toMatch(
			/\/tree\/[a-f0-9]{40}\/APCS16-Binary-Search\/starter$/
		);
		expect(trace.solutionLink).toBe(
			trace.projectLink!.replace(/\/starter$/, "/solution")
		);
		expect(
			pythonIdeModeForCourseResource("ap-computer-science-a", trace.projectLink!)
		).toBe("java");
		for (const item of [
			...requireModule("APCS15 Recursion").supplementalProjects.filter(
				row => /Recursion Practice|Blob Erase/.test(row.title)
			),
			...search.supplementalProjects
		]) {
			expect(item.learningPath, item.title).toBe("challenge");
		}
	});

	it("opens the runnable pack separately from both legacy role workspaces", () => {
		const course = "ap-computer-science-a";
		const item = "binary-search";
		for (const role of ["starter", "reference"] as const) {
			const url = apBinarySearchResources[role];
			const previousSource = url.replace(/\/tree\/[a-f0-9]{40}\//, "/tree/main/");
			const previousKey = apComputerScienceAProjectKey(
				course,
				item,
				role,
				previousSource
			);
			expect(previousKey).toBe(`${course}:${item}:${role}`);
			expect(apComputerScienceAProjectKey(course, item, role, url)).toBe(
				`${previousKey}:binary-search-trace`
			);
		}
	});

	it("opens restored required and optional roles as distinct Java projects", () => {
		const recursion = requireModule("APCS15 Recursion");
		const sorting = requireModule("APCS16 Binary Search and Merge Sort");
		const tasks = [
			[
				sorting.curriculum, "Merge Step Visual", "core",
				apMergeSortResources, "merge-sort"
			],
			[
				recursion.supplementalProjects, "Project: Recursion Practice", "challenge",
				apRecursionPracticeResources, "recursion-practice"
			],
			[
				recursion.supplementalProjects, "Recursion Reference Pack", "choice",
				apRecursionReferenceResources, "recursion-reference"
			],
			[
				recursion.supplementalProjects, "Project: Blob Erase", "challenge",
				apBlobEraseResources, "blob-erase"
			],
			[
				sorting.supplementalProjects, "Project: Merge Sort", "challenge",
				apMergeSortResources, "merge-sort"
			],
			[
				requireModule("APCS3 Conditionals and Packages").curriculum,
				"Core Project: Elevator Warning", "core",
				apElevatorWarningResources, "elevator-warning"
			],
			[
				requireModule("APCS5 Classes Part I").curriculum,
				"Core Project: Student Class", "core",
				apStudentClassResources, "student-class"
			],
			[
				requireModule("APCS1 Variables and Input/Output").supplementalProjects,
				"Project: Rounding It Off", "choice",
				apIntroductoryResources.rounding, "rounding"
			],
			[
				requireModule("APCS1 Variables and Input/Output").supplementalProjects,
				"Project: Hospital Survey", "choice",
				apIntroductoryResources["hospital-survey"], "hospital-survey"
			],
			[
				requireModule("APCS2 Operators").supplementalProjects,
				"Project: Quotient and Remainder", "choice",
				apIntroductoryResources["quotient-and-remainder"], "quotient-and-remainder"
			],
			[
				requireModule("APCS2 Operators").supplementalProjects,
				"Project: Two in One", "choice",
				apIntroductoryResources["two-in-one"], "two-in-one"
			]
		] as const;
		for (const [items, title, learningPath, links, projectKind] of tasks) {
			const task = items.find(item => item.title === title);
			expect(task).toMatchObject({
				learningPath,
				ideImport: true,
				preserveInstructions: true,
				projectLink: links.starter,
				solutionLink: links.reference
			});
			for (const role of ["starter", "reference"] as const) {
				const course = "ap-computer-science-a";
				expect(pythonIdeModeForCourseResource(course, links[role])).toBe("java");
				expect(apComputerScienceAProjectKey(course, title, role, links[role])).toBe(
					`${course}:${title}:${role}:${projectKind}`
				);
			}
		}
	});

	it.each([
		["APCS6 Classes Part II", "Vending Machine Class", "vending-machine", "Vending an empty item"],
		["APCS10 Arrays", "Practice With Arrays", "array-practice", "For an empty array"],
		["APCS11 ArrayLists", "Practice With ArrayLists", "array-list-practice", "Remove it by index"],
		["APCS14 Selection and Insertion Sort", "Selection Sort", "selection-sort", "4 + 3 + 2 + 1"],
		["APCS17 Master Projects and Test Prep", "Spaceships", "spaceships", "two distinct passengers named Ada"]
	] as const)("opens the complete project in %s", (moduleTitle, title, key, checkpoint) => {
		const task = requireModule(moduleTitle).curriculum.find(
			item => item.title === `Core Project: ${title}`
		);
		const resources = apRemainingCoreResources[key];
		expect(task).toMatchObject({
			learningPath: "core",
			ideImport: true,
			preserveInstructions: true,
			preserveAssignment: true,
			projectLink: resources.starter,
			solutionLink: resources.reference
		});
		expect(task?.content).toContain(checkpoint);
		for (const role of ["starter", "reference"] as const) {
			const course = "ap-computer-science-a";
			expect(pythonIdeModeForCourseResource(course, resources[role])).toBe("java");
			expect(apComputerScienceAProjectKey(course, title, role, resources[role])).toBe(
				`${course}:${title}:${role}:${key}`
			);
		}
	});


	it.each([
		[
			"APCS1 Variables and Input/Output",
			"Strings and Printing Reference",
			"strings-printing",
			"APCS1-Strings-and-Printing-Reference"
		],
		[
			"APCS2 Operators",
			"Project: Too Chicken to Cross the Road",
			"boolean-crossing",
			"APCS2-Too-Chicken-To-Cross-The-Road"
		],
		[
			"APCS3 Conditionals and Packages",
			"Reference Pack",
			"conditionals-reference",
			"APCS3-Conditionals-Reference"
		],
		[
			"APCS3 Conditionals and Packages",
			"Project: Too Chicken Take Two",
			"conditional-crossing",
			"APCS3-Too-Chicken-Take-Two"
		],
		[
			"APCS3 Conditionals and Packages",
			"Reference: Math Package",
			"math-reference",
			"APCS3-Math-Package-Reference"
		],
		[
			"APCS3 Conditionals and Packages",
			"Reference: Random Numbers",
			"random-range",
			"APCS3-Random-Numbers-Reference"
		],
		[
			"APCS3 Conditionals and Packages",
			"Project: Math Demo",
			"math-demo",
			"APCS3-Math-Fun"
		],
		[
			"General: Course Introduction and Setup",
			"Reference Pack",
			"variables-reference",
			"APCS1-Variables-Reference"
		],
		[
			"General: Course Introduction and Setup",
			"Casting Reference",
			"casting-reference",
			"APCS1-Casting-Reference"
		],
		[
			"Check-In #1",
			"Additional Practice: FizzBuzz",
			"fizzbuzz",
			"APCS-Check-in-1-Additional-Practice-Project"
		],
		[
			"APCS4 Selection, Iteration, and Runtime Reasoning",
			"Loop Reference Pack",
			"loop-reference",
			"APCS4-Loops-Reference"
		],
		[
			"APCS4 Selection, Iteration, and Runtime Reasoning",
			"Project: For Loop Practice",
			"for-loop-practice",
			"APCS4-For-Loop-Practice"
		],
		[
			"APCS4 Selection, Iteration, and Runtime Reasoning",
			"Project: While Loop and Nested Loop Practice",
			"while-nested-practice",
			"APCS4-While-Loop-and-Nested-Loop-Practice"
		],
		[
			"APCS4 Selection, Iteration, and Runtime Reasoning",
			"Reference: While Loops and Nested Loops",
			"nested-loop-reference",
			"APCS4-While-Loops-and-Nested-Loops-Reference"
		]
	] as const)("opens both Java roles for the %s supplemental item %s", (moduleTitle, title, key, pack) => {
		const task = requireModule(moduleTitle).supplementalProjects.find(
			item => item.title === title
		);
		const resources = { ...apFoundationsSupplementalResources, ...apVariablesAndLoopsResources }[key];
		expect(task).toMatchObject({
			learningPath: "choice",
			ideImport: true,
			preserveInstructions: true,
			preserveAssignment: true,
			projectLink: resources.starter,
			solutionLink: resources.reference
		});
		const course = "ap-computer-science-a";
		for (const role of ["starter", "reference"] as const) {
			const baseKey = `${course}:${title}:${role}`;
			const folder = role === "starter" ? "starter" : "solution";
			const rolePath = `${pack}/${folder}`;
			expect(resources[role]).toMatch(
				new RegExp(`/tree/[0-9a-f]{40}/${rolePath}$`)
			);
			expect(pythonIdeModeForCourseResource(course, resources[role])).toBe("java");
			expect(apComputerScienceAProjectKey(course, title, role, resources[role])).toBe(
				`${baseKey}:${key}`
			);
			expect(apComputerScienceAProjectKey(course, title, role, `https://github.com/instruction-material/APCS/tree/main/${rolePath}`)).toBe(baseKey);
		}
	});


	it.each([
		["General: Course Introduction and Setup", "Strings and Printing Reference", "APCS1 Variables and Input/Output", "Strings and Printing Reference"],
		["Check-In #1", "Variables Reference", "General: Course Introduction and Setup", "Reference Pack"],
		["Check-In #1", "Loops Reference", "APCS4 Selection, Iteration, and Runtime Reasoning", "Loop Reference Pack"]
	])("links %s / %s to the shared Java workspace", async (from, title, to, target) => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("ap-computer-science-a"))!;
		const fromModule = course.modules.find(module => module.title === from)!;
		const toModule = course.modules.find(module => module.title === to)!;
		const entry = fromModule.supplementalProjects.find(item => item.title === title)!;
		const canonical = toModule.supplementalProjects.find(item => item.title === target)!;
		expect(entry.contentKind).toBe("reading");
		expect(entry.content).toContain(`/courses#${toModule.id}-${canonical.id}`);
		expect(entry.projectLink).toBeUndefined();
		expect(entry.solutionLink).toBeUndefined();
		expect(canonical.ideImport).toBe(true);
	});

	it.each([
		[
			"APCS2 Operators",
			"Core Project: Verifying Expressions",
			"verifying-expressions",
			"ap-computer-science-a-apcs2-operators-curriculum-core-project-verifying-expressions",
			"core",
			null
		],
		[
			"APCS4 Selection, Iteration, and Runtime Reasoning",
			"Core Project: Translating Loops",
			"translating-loops",
			"ap-computer-science-a-apcs4-selection-iteration-and-runtime-reasoning-curriculum-core-project-translating-loops",
			"core",
			null
		],
		[
			"APCS5 Classes Part I",
			"Project: Method Practice",
			"method-practice",
			"ap-computer-science-a-apcs5-classes-part-i-supplemental-project-method-practice",
			"choice",
			null
		],
		[
			"APCS5 Classes Part I",
			"Project: Store Class",
			"store-class",
			"ap-computer-science-a-apcs5-classes-part-i-supplemental-project-store-class",
			"choice",
			"Store.java"
		],
		[
			"APCS5 Classes Part I",
			"Supplemental: Spreadsheet Width",
			"spreadsheet-width",
			"ap-computer-science-a-apcs5-classes-part-i-supplemental-supplemental-spreadsheet-width",
			"choice",
			null
		],
		[
			"Check-In #2",
			"Class Example",
			"class-constructor",
			"ap-computer-science-a-check-in-2-supplemental-class-example",
			"choice",
			"TestClass.java"
		],
		[
			"Check-In #2",
			"This Reference",
			"this-fields",
			"ap-computer-science-a-check-in-2-supplemental-this-reference",
			"choice",
			"Counter.java"
		],
		[
			"APCS6 Classes Part II",
			"Project: Bank Account Class",
			"bank-account",
			"ap-computer-science-a-apcs6-classes-part-ii-supplemental-project-bank-account-class",
			"choice",
			"BankAccount.java"
		],
		[
			"APCS6 Classes Part II",
			"Reference: Getters and Setters",
			"time-accessors",
			"ap-computer-science-a-apcs6-classes-part-ii-supplemental-reference-getters-and-setters",
			"choice",
			"Time.java"
		],
		[
			"Check-In #3",
			"Additional Practice: Letter Shifter",
			"letter-shifter",
			"ap-computer-science-a-check-in-3-supplemental-additional-practice-letter-shifter",
			"challenge",
			"Shifter.java UpShifter.java DownShifter.java"
		],
		[
			"APCS10 Arrays",
			"Project: Random Mad Libs",
			"random-mad-libs",
			"ap-computer-science-a-apcs10-arrays-supplemental-project-random-mad-libs",
			"choice",
			null
		],
		[
			"APCS10 Arrays",
			"Project: Practice With Two-Dimensional Arrays",
			"two-dimensional-arrays",
			"ap-computer-science-a-apcs10-arrays-supplemental-project-practice-with-two-dimensional-arrays",
			"choice",
			null
		],
		[
			"APCS10 Arrays",
			"Project: Matrix Arithmetic",
			"matrix-arithmetic",
			"ap-computer-science-a-apcs10-arrays-supplemental-project-matrix-arithmetic",
			"choice",
			null
		],
		[
			"APCS10 Arrays",
			"Array Reference Pack",
			"array-reference",
			"ap-computer-science-a-apcs10-arrays-supplemental-array-reference-pack",
			"choice",
			null
		],
		[
			"APCS11 ArrayLists",
			"ArrayList Reference Pack",
			"array-list-reference",
			"ap-computer-science-a-apcs11-arraylists-supplemental-arraylist-reference-pack",
			"choice",
			null
		],
		[
			"APCS11 ArrayLists",
			"Project: Fortune Teller",
			"fortune-teller",
			"ap-computer-science-a-apcs11-arraylists-supplemental-project-fortune-teller",
			"choice",
			"FortuneTeller.java"
		],
		[
			"APCS11 ArrayLists",
			"Card and Deck Classes",
			"card-and-deck",
			"ap-computer-science-a-apcs11-arraylists-supplemental-card-and-deck-classes",
			"choice",
			"Card.java Deck.java LuckGame.java"
		],
		[
			"APCS12 Wrapper Classes",
			"Project: Minimum and Maximum Search",
			"minimum-and-maximum",
			"ap-computer-science-a-apcs12-wrapper-classes-supplemental-project-minimum-and-maximum-search",
			"choice",
			null
		],
		[
			"APCS12 Wrapper Classes",
			"Project: Deck Class",
			"deck-class",
			"ap-computer-science-a-apcs12-wrapper-classes-supplemental-project-deck-class",
			"choice",
			"Card.java Deck.java Luck.java Suit.java"
		],
		[
			"APCS13 Algorithmic Runtime and Linear Search",
			"Project: Linear Search Implementation",
			"linear-search",
			"ap-computer-science-a-apcs13-algorithmic-runtime-and-linear-search-supplemental-project-linear-search-implementation",
			"challenge",
			null
		],
		[
			"APCS14 Selection and Insertion Sort",
			"Project: Insertion Sort",
			"insertion-sort",
			"ap-computer-science-a-apcs14-selection-and-insertion-sort-supplemental-project-insertion-sort",
			"challenge",
			null
		],
		[
			"Check-In #1",
			"Core Check-In Prompt Bank",
			"check-in-1",
			"ap-computer-science-a-check-in-1-curriculum-core-check-in-prompt-bank",
			"core",
			null
		],
		[
			"Check-In #2",
			"Core Check-In Prompt Bank",
			"check-in-2",
			"ap-computer-science-a-check-in-2-curriculum-core-check-in-prompt-bank",
			"core",
			null
		],
		[
			"Check-In #3",
			"Core Check-In Prompt Bank",
			"check-in-3",
			"ap-computer-science-a-check-in-3-curriculum-core-check-in-prompt-bank",
			"core",
			"SupplyBin.java"
		],
		[
			"Check-In #4",
			"Core Check-In Prompt Bank",
			"check-in-4",
			"ap-computer-science-a-check-in-4-curriculum-core-check-in-prompt-bank",
			"core",
			null
		],
		[
			"APCS5 Classes Part I",
			"Free Response Prep",
			"step-tracker-frq",
			"ap-computer-science-a-apcs5-classes-part-i-curriculum-free-response-prep",
			"core",
			"StepTracker.java"
		],
		[
			"APCS6 Classes Part II",
			"Free Response and Multiple Choice Support",
			"calendar-frq",
			"ap-computer-science-a-apcs6-classes-part-ii-curriculum-free-response-and-multiple-choice-support",
			"core",
			"APCalendar.java"
		],
		[
			"APCS11 ArrayLists",
			"Free Response Practice",
			"delimiters-frq",
			"ap-computer-science-a-apcs11-arraylists-supplemental-free-response-practice",
			"choice",
			"Delimiters.java"
		],
		[
			"Check-In #4",
			"Additional Practice: Inversion Counting",
			"inversion-counting",
			"ap-computer-science-a-check-in-4-supplemental-additional-practice-inversion-counting",
			"challenge",
			null
		],
		[
			"APCS15 Recursion",
			"Reference: Stack Overflow",
			"stack-overflow-reference",
			"ap-computer-science-a-apcs15-recursion-supplemental-reference-stack-overflow",
			"choice",
			null
		],
		[
			"APCS17 Master Projects and Test Prep",
			"Master Project: Decode",
			"decode",
			"ap-computer-science-a-apcs17-master-projects-and-test-prep-supplemental-master-project-decode",
			"challenge",
			"Message.java Tower.java"
		],
		[
			"APCS17 Master Projects and Test Prep",
			"Master Project: Elevens",
			"elevens",
			"ap-computer-science-a-apcs17-master-projects-and-test-prep-supplemental-master-project-elevens",
			"challenge",
			"Card.java Deck.java Elevens.java Suit.java"
		],
		[
			"Check-In #2",
			"Additional Practice: Animal Kingdom",
			"animal-kingdom",
			"ap-computer-science-a-check-in-2-supplemental-additional-practice-animal-kingdom",
			"challenge",
			"Animal.java Mammal.java Primate.java"
		],
		[
			"Optional Inheritance and Polymorphism Enrichment",
			"Core Project: Book and PictureBook Class",
			"picture-books",
			"ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-core-project-book-and-picturebook-class",
			"challenge",
			"Book.java PictureBook.java"
		],
		[
			"Optional Inheritance and Polymorphism Enrichment",
			"Project: Pet Class",
			"pets",
			"ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-project-pet-class",
			"challenge",
			"Pet.java Dog.java Cat.java Fish.java"
		],
		[
			"Optional Inheritance and Polymorphism Enrichment",
			"Project: Pet Special Methods",
			"dog-methods",
			"ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-project-pet-special-methods",
			"challenge",
			"Dog.java Poodle.java MiniPoodle.java Pug.java"
		]
	] as const)("opens both Java roles for %s / %s", async (moduleTitle, title, kind, itemId, path, classFile) => {
		setActivePinia(createPinia());
		const courseId = "ap-computer-science-a";
		const course = (await useCoursesStore().loadCourseById(courseId))!;
		const module = course.modules.find(candidate => candidate.title === moduleTitle)!;
		const items = path === "core" ? module.curriculum : module.supplementalProjects;
		const item = items.find(candidate => candidate.title === title)!;
		const rawModule = requireModule(moduleTitle);
		const rawItems = path === "core" ? rawModule.curriculum : rawModule.supplementalProjects;
		const rawItem = rawItems.find(candidate => candidate.title === title)!;
		const links = {
			...apExpressionsAndClassResources,
			...apClassesAndArraysResources,
			...apListsAndAlgorithmsResources,
			...apCheckInAndFrqResources,
			...apAdvancedPracticeResources,
			...apEnrichmentResources
		}[kind];
		expect(item.id).toBe(itemId);
		expect(rawItem).toMatchObject({
			learningPath: path,
			ideImport: true,
			projectLink: links.starter,
			solutionLink: links.reference
		});

		for (const role of ["starter", "reference"] as const) {
			const base = `${courseId}:${itemId}:${role}`;
			const key = apComputerScienceAProjectKey(courseId, itemId, role, links[role]);
			expect(key).toBe(`${base}:${kind}`);
			expect(javaNativeBuildInstructions(base)).toBeNull();
			if (classFile) {
				expect(javaNativeBuildInstructions(key)).toContain(`javac Main.java ${classFile}`);
				expect(javaNativeBuildInstructions(key)).toContain("java Main");
				expect(javaNativeBuildInstructions(`${key}:extra`)).toBeNull();
			} else {
				expect(javaNativeBuildInstructions(key)).toBeNull();
			}
		}
	});

	it.each([
		["Check-In #3", "ArrayList Reference", "APCS11 ArrayLists", "ArrayList Reference Pack"],
		["Check-In #4", "Project: Minimum and Maximum", "APCS12 Wrapper Classes", "Project: Minimum and Maximum Search"],
		[
			"Optional Inheritance and Polymorphism Enrichment",
			"Project: More Pets",
			"Optional Inheritance and Polymorphism Enrichment",
			"Project: Pet Class"
		]
	])("keeps %s / %s as a recap leading to the single runnable project", async (checkIn, recapTitle, targetModule, targetTitle) => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("ap-computer-science-a"))!;
		const raw = requireModule(checkIn).supplementalProjects.find(item => item.title === recapTitle)!;
		const module = course.modules.find(candidate => candidate.title === targetModule)!;
		const target = module.supplementalProjects.find(item => item.title === targetTitle)!;
		expect(raw.contentKind).toBe("reading");
		expect(raw.projectLink).toBeUndefined();
		expect(raw.solutionLink).toBeUndefined();
		expect(raw.content).toContain(`/courses#${module.id}-${target.id}`);
	});

	it("preserves inherited source projects while moving references out of the required path", () => {
		const curriculumTitles = apComputerScienceACourse.modules.flatMap(
			module => module.curriculum.map(item => item.title)
		);
		const optionTitles = apComputerScienceACourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumTitles).toHaveLength(76);
		expect(optionTitles).toHaveLength(76);
		for (const title of MOVED_REFERENCE_TITLES) {
			expect(curriculumTitles, title).not.toContain(title);
			expect(optionTitles, title).toContain(title);
		}
		for (const title of [
			"Core Project: Book and PictureBook Class",
			"Project: Pet Class",
			"Project: More Pets",
			"Project: Pet Special Methods",
			"Core Project: Many Shapes",
			"Polymorphism Reference"
		]) {
			expect(optionTitles, title).toContain(title);
		}
	});

	it.each([
		["APCS7 Inheritance Multiple Choice Reference", "1B, 2A, 3C"],
		["Polymorphism Reference", "ClassCastException"],
		["APCS8 Polymorphism Multiple Choice Reference", "43, 32"],
		["APCS11 ArrayList Multiple Choice Reference", "[2, 4, 2, 1, 8]"],
		["Deck Spec / Specification", "both scores"],
		["2020 Repo Practice Exam", "first Oak/6 object"]
	])("provides %s as a worksheet with checks and no IDE imports", (title, check) => {
		const item = apComputerScienceACourse.modules
			.flatMap(module => module.supplementalProjects)
			.find(item => item.title === title);

		expect(item?.contentKind).toBe("reading");
		expect(item?.content).toContain(check);
		expect(item?.projectLink).toBeUndefined();
		expect(item?.solutionLink).toBeUndefined();
		expect(item?.ideImport).toBeUndefined();
	});

	it("routes the introductory legacy exam entry to the complete worksheet", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"ap-computer-science-a"
		);
		const module = course!.modules.find(
			module => module.title === "APCS17 Master Projects and Test Prep"
		)!;
		const target = module.supplementalProjects.find(
			item => item.title === "2020 Repo Practice Exam"
		)!;
		const intro = requireModule(
			"General: Course Introduction and Setup"
		).supplementalProjects.find(item => item.title === "2020 Practice Exam")!;

		expect(intro.content).toContain(`/courses#${module.id}-${target.id}`);
		expect(intro.contentKind).toBe("reading");
		expect(intro.projectLink).toBeUndefined();
		expect(intro.solutionLink).toBeUndefined();
	});

	it("matches the current four-unit, digital-exam, and Java scope contract", () => {
		const text = courseText();

		expect(text).toContain("Unit 1 Using Objects and Methods");
		expect(text).toContain("Unit 2 Selection and Iteration");
		expect(text).toContain("Unit 3 Class Creation");
		expect(text).toContain("Unit 4 Data Collections");
		expect(text).toContain("42 multiple-choice questions");
		expect(text).toContain("Methods and Control Structures");
		expect(text).toContain("Class Design");
		expect(text).toContain("Data Analysis with ArrayList");
		expect(text).toContain("2D Array");
		expect(text).toContain("Java 22");
		expect(text).toContain("Java 17");
		expect(text).toContain("lambdas, streams");
		expect(text).toContain(
			"accepting keyboard input is outside current AP exam scope"
		);
		expect(text).toContain("nonrectangular 2D arrays");
		expect(text).toContain(
			"other search and sort families stay outside exam scope"
		);
	});

	it("aligns checkpoints, file input, responsible computing, references, and legacy practice", () => {
		const checkIn2 = moduleText("Check-In #2");
		const checkIn3 = moduleText("Check-In #3");
		const checkIn4 = moduleText("Check-In #4");
		const unit4 = moduleText("APCS9 Software Development Lifecycle");
		const finalPrep = moduleText("APCS17 Master Projects and Test Prep");
		const setupResources = moduleResourceText(
			"General: Course Introduction and Setup"
		);
		const finalResources = moduleResourceText(
			"APCS17 Master Projects and Test Prep"
		);
		const guide = fs.readFileSync(
			"public/course-assets/apcs/apcs-pacing-tracks.md",
			"utf8"
		);

		expect(setupResources).toContain(
			"ap-computer-science-a-course-and-exam-description.pdf"
		);
		expect(setupResources).toContain(
			"ap-computer-science-a-java-quick-reference.pdf"
		);
		expect(checkIn2).toContain("closes Units 1 and 2");
		expect(checkIn3).toContain("closes Unit 3 Class Creation");
		expect(checkIn4).toContain("Data Analysis with ArrayList response");
		expect(unit4).toContain("File");
		expect(unit4).toContain("Scanner");
		expect(unit4).toContain("data provenance");
		expect(unit4).toContain("privacy");
		expect(unit4).toContain("complete protected check-ins");
		expect(finalResources).toContain("ap26-frq-computer-science-a.pdf");
		expect(finalPrep).toContain("2022 FRQs");
		expect(finalPrep).toContain("2020 repository exam");
		expect(guide).toContain(
			"inheritance/polymorphism appendix is optional Java enrichment"
		);
		expect(guide).toContain(
			"Unit 4 includes text-file reading with `File` and `Scanner`"
		);
	});
});
