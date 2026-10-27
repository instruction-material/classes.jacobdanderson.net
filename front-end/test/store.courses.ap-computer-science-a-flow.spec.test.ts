import fs from "node:fs";
import { describe, expect, it } from "vitest";
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
	"Required Textbook",
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
