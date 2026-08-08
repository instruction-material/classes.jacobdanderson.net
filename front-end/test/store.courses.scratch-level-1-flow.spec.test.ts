import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { scratchLevel1Course } from "@/stores/courses/scratch-level-1";

const EXPECTED_MODULE_SEQUENCE = [
	"GS1 Starting in Scratch",
	"GS2 Event Listeners",
	"GS3 X & Y Coordinates",
	"GS4 Pen with Event Listeners",
	"GS5 Loops",
	"GS6 Variables",
	"GS7 Basic Conditionals",
	"GS8 Advanced Conditionals",
	"GS9 User Input",
	"GS10 Message Broadcasting",
	"GS11 Hedgehog Race",
	"GS12 Asteroid Dodge",
	"GS13 Mini Game Polish Studio",
	"GS14 Interactive Story Studio",
	"GS15 Debugging and Remix Studio",
	"GS16 Master Project",
	"GS17 Scratch-to-Python Bridge"
];

function requireModule(title: string) {
	const module = scratchLevel1Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Scratch module ${title}.`);
	return module;
}

describe("Scratch Level 1 learner flow", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("orders prerequisites before synthesis, studios, capstone, and transition", () => {
		expect(scratchLevel1Course.modules.map(module => module.title)).toEqual(
			EXPECTED_MODULE_SEQUENCE
		);
		expect(
			scratchLevel1Course.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);

		const bridge = requireModule("GS17 Scratch-to-Python Bridge");
		expect(bridge.kind).toBe("transition");
		expect(bridge.estimatedTime).toContain("optional");
	});

	it("gives every module pacing and a concise block checklist", () => {
		for (const module of scratchLevel1Course.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(4);
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

	it("keeps authored projects core and supplemental work in practice", () => {
		const events = requireModule("GS2 Event Listeners");
		expect(events.curriculum.map(item => item.title)).toEqual([
			"Basic event listeners",
			"Project 1 – Spinner",
			"Project 2 – Bouncy Ball Room",
			"Project 3 – Dragonfly Events"
		]);
		expect(
			events.supplementalProjects.find(item =>
				item.title.includes("Extension Challenge")
			)?.learningPath
		).toBe("challenge");

		const loops = requireModule("GS5 Loops");
		expect(loops.curriculum.map(item => item.title)).toEqual([
			"Introduction to loops",
			"Project 1 – Elephant Effects",
			"Project 2 – Hot Cross Buns",
			"Project 3 – Drawing Mouse"
		]);
		expect(loops.supplementalProjects.map(item => item.title)).toEqual(
			expect.arrayContaining([
				"GS5 Supplemental Project 1 – Shapify",
				"Loops: Fluency Drill"
			])
		);
	});

	it("builds Hungry Hippo in stages after each prerequisite", () => {
		const hungryHippo = requireModule(
			"GS1 Starting in Scratch"
		).curriculum.find(item => item.title.includes("Hungry Hippo"));
		expect(hungryHippo?.content).toContain("Stage 1 — start and movement");
		expect(hungryHippo?.content).toContain(
			"leave scoring, collision rules, and timing for later modules"
		);
		expect(hungryHippo?.content).not.toContain(
			"Create a score variable that increases"
		);

		for (const [moduleTitle, expectedReturn] of [
			["GS2 Event Listeners", "arrow key"],
			["GS3 X & Y Coordinates", "start coordinates"],
			["GS6 Variables", "score and timer variables"],
			["GS7 Basic Conditionals", "touches the collectable"],
			["GS10 Message Broadcasting", "game-over message"]
		]) {
			expect(
				requireModule(moduleTitle).curriculum[0]?.content,
				moduleTitle
			).toContain(`**Hungry Hippo return:**`);
			expect(
				requireModule(moduleTitle).curriculum[0]?.content,
				moduleTitle
			).toContain(expectedReturn);
		}
	});

	it("preserves progress IDs while adding aliases for the new sequence", async () => {
		const course =
			await useCoursesStore().loadCourseById("scratch-level-1");
		expect(course).not.toBeNull();

		const coordinates = course!.modules.find(
			module => module.title === "GS3 X & Y Coordinates"
		);
		expect(coordinates?.id).toBe("scratch-level-1-gs8-x-y-coordinates");
		expect(coordinates?.aliases).toContain(
			"scratch-level-1-gs3-x-y-coordinates"
		);

		const cakeChaser = coordinates?.curriculum.find(item =>
			item.title.includes("Cake Chaser")
		);
		expect(cakeChaser?.id).toBe(
			"scratch-level-1-gs8-x-y-coordinates-curriculum-project-2-cake-chaser"
		);
		expect(cakeChaser?.aliases).toContain(
			"scratch-level-1-gs3-x-y-coordinates-curriculum-project-2-cake-chaser"
		);

		const capstone = course!.modules.find(
			module => module.title === "GS16 Master Project"
		);
		expect(capstone?.id).toBe("scratch-level-1-gs13-master-project");
		expect(capstone?.aliases).toContain(
			"scratch-level-1-gs16-master-project"
		);
	});
});
