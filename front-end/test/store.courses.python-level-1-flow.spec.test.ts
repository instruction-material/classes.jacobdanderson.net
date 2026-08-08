import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import { pythonLevel1Course } from "@/stores/courses/python-level-1";

const EXPECTED_TEACHING_MODULES = [
	"First 10 Days: Show, Play, Then Explain",
	"GrS1 Coordinates and Movement",
	"GrS2 Loops",
	"GrS3 Variables and Random Numbers",
	"GrS4 Conditionals Part 1",
	"Check-In #1",
	"GrS5 Loops with Variables",
	"GrS6 Nested Loops Part 1",
	"GrS7 Functions Part 1",
	"GrS8 Event Listeners",
	"Check-In #2",
	"GrS9 Functions Part 2",
	"GrS10 Nested Loops Part 2",
	"GrS11 Conditionals Part 2",
	"GrS12 Lists",
	"GrS13 Game Mechanics",
	"Check-In #3",
	"GrS14 Space Eater",
	"GrS15 Master Project"
];

function requireSourceModule(title: string) {
	const module = pythonLevel1Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Python Level 1 module ${title}.`);
	return module;
}

describe("Python Level 1 learner flow", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("keeps the authored teaching sequence without the media backlog", () => {
		expect(pythonLevel1Course.modules.map(module => module.title)).toEqual(
			EXPECTED_TEACHING_MODULES
		);
		expect(
			pythonLevel1Course.modules.some(
				module => module.title === "Pending Demo Media"
			)
		).toBe(false);
	});

	it("gives every teaching module pacing, command targets, and explicit paths", () => {
		for (const module of pythonLevel1Course.modules) {
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

	it("keeps authored projects core and only supplemental work optional", () => {
		const requiredCount = pythonLevel1Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const choiceAndChallengeCount = pythonLevel1Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(66);
		expect(choiceAndChallengeCount).toBe(57);

		const loops = requireSourceModule("GrS2 Loops");
		expect(loops.curriculum.map(item => item.title)).toEqual([
			"GrS2 Project 1: Basic Shapes",
			"GrS2 Project 2: Smiley Face",
			"GrS2 Project 3: Open Ended Project - Drawing with Loops"
		]);
		expect(
			loops.curriculum.find(
				item => item.title === "GrS2 Project 2: Smiley Face"
			)?.learningPath
		).toBe("core");
		expect(
			loops.curriculum.find(
				item =>
					item.title ===
					"GrS2 Project 3: Open Ended Project - Drawing with Loops"
			)?.learningPath
		).toBe("core");
	});

	it("adds validated Turtle input before event-driven game work", () => {
		const variables = requireSourceModule(
			"GrS3 Variables and Random Numbers"
		);
		const inputProject = variables.curriculum.find(
			item =>
				item.title === "GrS3 Guided Project: User Input Shape Designer"
		);

		expect(inputProject?.content).toContain("screen.textinput()");
		expect(inputProject?.content).toContain("screen.numinput()");
		expect(inputProject?.content).toContain("safe default");
		expect(inputProject?.content).toContain("outside the accepted range");
	});

	it("preserves project progress IDs in the core listing", async () => {
		const course = await useCoursesStore().loadCourseById("python-level-1");
		expect(course).not.toBeNull();

		const loops = course!.modules.find(
			module => module.title === "GrS2 Loops"
		);
		const smiley = loops?.curriculum.find(
			item => item.title === "GrS2 Project 2: Smiley Face"
		);

		expect(smiley?.id).toBe(
			"python-level-1-grs2-loops-curriculum-grs2-project-2-smiley-face"
		);
		expect(smiley?.aliases).toBeUndefined();
	});

	it("keeps references and the normalized learner path intact", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();

		const text = JSON.stringify(course);
		expect(text).toContain("https://trinket.io/docs/colors");
		expect(text).toContain(
			"https://www.w3schools.com/python/python_ref_list.asp"
		);
		expect(
			course!.modules.filter(module => module.kind !== "appendix").length
		).toBe(EXPECTED_TEACHING_MODULES.length);
		for (const module of course!.modules.filter(
			candidate => candidate.kind !== "appendix"
		)) {
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
		expect(text).not.toContain("Pending Python Level 1 Demo Media");
	});
});
