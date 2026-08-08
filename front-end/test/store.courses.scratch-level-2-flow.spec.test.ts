import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { scratchLevel2Course } from "@/stores/courses/scratch-level-2";

const EXPECTED_MODULE_SEQUENCE = [
	"GM1 Level 1 Skills Review",
	"GM2 Nested Loops",
	"GM3 Complex Conditionals",
	"GM4 Cloning",
	"Check-In #1",
	"GM5 Strings",
	"GM6 Operators and Randomness",
	"GM7 Lists",
	"GM8 Custom Blocks and Functions",
	"Check-In #2",
	"GM9 Fish Food",
	"GM10 Treasure Cave",
	"GM11 Arcade Systems Studio",
	"GM12 Simulation and Data Studio",
	"GM13 Code Organization and Debugging Studio",
	"GM14 Master Project",
	"GM15 Scratch-to-Python Bridge"
];

function requireModule(title: string) {
	const module = scratchLevel2Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Scratch Level 2 module ${title}.`);
	return module;
}

describe("Scratch Level 2 learner flow", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("orders prerequisites, checkpoints, studios, capstone, and transition", () => {
		expect(scratchLevel2Course.modules.map(module => module.title)).toEqual(
			EXPECTED_MODULE_SEQUENCE
		);
		expect(
			scratchLevel2Course.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);

		const bridge = requireModule("GM15 Scratch-to-Python Bridge");
		expect(bridge.kind).toBe("transition");
		expect(bridge.estimatedTime).toContain("optional");
	});

	it("gives every module pacing, a block checklist, and path labels", () => {
		for (const module of scratchLevel2Course.modules) {
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
		}
	});

	it("keeps every authored project core and supplemental work separate", () => {
		const review = requireModule("GM1 Level 1 Skills Review");
		expect(
			review.curriculum
				.filter(item => item.projectLink)
				.map(item => item.title)
		).toEqual([
			"GM1 Project 1: Dragonfly Events",
			"GM1 Project 2: Drawing Mouse",
			"GM1 Project 3: Math Facts",
			"GM1 Project 4: Speed Click",
			"GM1 Project 5: Dance Off",
			"GM1 Project 6: Hedgehog Race",
			"GM1 Review Project: Asteroid Dodge Remix"
		]);
		expect(
			review.curriculum.find(
				item => item.title === "GM1 Project 1: Dragonfly Events"
			)?.learningPath
		).toBe("core");
		expect(
			review.curriculum.find(
				item => item.title === "GM1 Project 6: Hedgehog Race"
			)?.learningPath
		).toBe("core");

		for (const [moduleTitle, requiredProject, alternateProject] of [
			[
				"GM2 Nested Loops",
				"GM2 Project 1: Square Inception",
				"GM2 Project 2: Pyramid"
			],
			[
				"GM3 Complex Conditionals",
				"GM3 Project 1: Color Spotter",
				"GM3 Project 2: Strength Tester"
			],
			[
				"GM4 Cloning",
				"GM4 Project 1: Jackson Pollock Clones",
				"GM4 Project 2: Rainy Day"
			],
			[
				"GM5 Strings",
				"GM5 Project 1: Security Bot",
				"GM5 Project 2: Spelling Bee"
			],
			[
				"GM6 Operators and Randomness",
				"GM6 Project 1: Calculator",
				"GM6 Project 2: FizzBuzz"
			],
			[
				"GM7 Lists",
				"GM7 Project 1: Bucket List",
				"GM7 Project 3: Music Memory"
			],
			[
				"GM8 Custom Blocks and Functions",
				"GM8 Project 1: My First Functions",
				"GM8 Project 2: Talent Show II"
			]
		] as const) {
			const module = requireModule(moduleTitle);
			expect(
				module.curriculum.some(item => item.title === requiredProject),
				moduleTitle
			).toBe(true);
				expect(
					module.curriculum.some(
						item => item.title === alternateProject
					),
					moduleTitle
				).toBe(true);
		}
	});

	it("keeps review targeted and moves typing practice to the optional bridge", () => {
		const reviewProject = requireModule(
			"GM1 Level 1 Skills Review"
		).curriculum.find(item => item.title.includes("Asteroid Dodge Remix"));
		expect(reviewProject?.content).toContain(
			"not seven required review builds"
		);
		expect(reviewProject?.content).toContain("Readiness evidence");

		const capstone = requireModule("GM14 Master Project");
		expect(
			capstone.curriculum.some(item =>
				item.title.includes("Typing and Code Fluency")
			)
		).toBe(false);

		const typingPractice = requireModule(
			"GM15 Scratch-to-Python Bridge"
		).supplementalProjects.find(item =>
			item.title.includes("Typing and Code Fluency")
		);
		expect(typingPractice?.learningPath).toBe("choice");
		expect(typingPractice?.content).toContain("score = score + 1");
	});

	it("preserves progress IDs while adding aliases for the new sequence", async () => {
		const course =
			await useCoursesStore().loadCourseById("scratch-level-2");
		expect(course).not.toBeNull();

		const arcadeStudio = course!.modules.find(
			module => module.title === "GM11 Arcade Systems Studio"
		);
		expect(arcadeStudio?.id).toBe(
			"scratch-level-2-gm12-arcade-systems-studio"
		);
		expect(arcadeStudio?.aliases).toContain(
			"scratch-level-2-gm11-arcade-systems-studio"
		);

		const capstone = course!.modules.find(
			module => module.title === "GM14 Master Project"
		);
		expect(capstone?.id).toBe("scratch-level-2-gm11-master-project");
		expect(capstone?.aliases).toContain(
			"scratch-level-2-gm14-master-project"
		);

		const pyramid = course!.modules
			.find(module => module.title === "GM2 Nested Loops")
			?.curriculum.find(
				item => item.title === "GM2 Project 2: Pyramid"
			);
		expect(pyramid?.id).toBe(
			"scratch-level-2-gm2-nested-loops-curriculum-gm2-project-2-pyramid"
		);
		expect(pyramid?.aliases).toBeUndefined();
	});
});
