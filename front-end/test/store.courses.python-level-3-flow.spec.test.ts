import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import { pythonLevel3Course } from "@/stores/courses/python-level-3";

const EXPECTED_TEACHING_MODULES = [
	"AM1 Review: Variables, Strings, Input, Loops, & Conditionals",
	"AM2 Review: Functions & Lists",
	"AM3 Review: Dictionaries & Recap",
	"AM4 Recursion Part 1",
	"AM5 Recursion Part 2",
	"Check-In #1",
	"AM6 Introduction to Algorithms & Runtime Analysis",
	"AM7 Binary Search",
	"AM8 Selection Sort & Insertion Sort",
	"Check-In #2",
	"AM9 Bubble Sort",
	"AM10 Merge Sort",
	"AM11 Quicksort",
	"AM12 File Input/Output",
	"Check-In #3",
	"AM13 Master Project: Conway's Game of Life",
	"AM14 Master Project: Tic Tac Toe AI"
];

function requireSourceModule(title: string) {
	const module = pythonLevel3Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Python Level 3 module ${title}.`);
	return module;
}

describe("Python Level 3 learner flow", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("keeps review, algorithms, I/O, simulation, and AI in dependency order", () => {
		expect(pythonLevel3Course.modules.map(module => module.title)).toEqual(
			EXPECTED_TEACHING_MODULES
		);
		expect(
			pythonLevel3Course.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
	});

	it("gives every module pacing, trace targets, and explicit paths", () => {
		for (const module of pythonLevel3Course.modules) {
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
		const requiredCount = pythonLevel3Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = pythonLevel3Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(83);
		expect(optionCount).toBe(7);
		expect(
			requireSourceModule("AM4 Recursion Part 1").curriculum.find(
				item =>
					item.title ===
					"AM4 Project 3: Recursive Fibonacci Numbers"
			)?.learningPath
		).toBe("core");
		expect(
			requireSourceModule("AM7 Binary Search").curriculum.find(
				item => item.title === "AM7 Project 2: Reverse Number Guesser"
			)?.learningPath
		).toBe("core");
		expect(
			requireSourceModule(
				"AM14 Master Project: Tic Tac Toe AI"
			).curriculum.find(
				item =>
					item.title ===
					"AM14 Project 4: Advanced Tic Tac Toe AI"
			)?.learningPath
		).toBe("core");
	});

	it("stages both capstones around testable minimum systems", () => {
		expect(
			requireSourceModule(
				"AM13 Master Project: Conway's Game of Life"
			).curriculum[0]?.content
		).toContain("simulation capstone");
		expect(
			requireSourceModule(
				"AM14 Master Project: Tic Tac Toe AI"
			).curriculum[0]?.content
		).toContain("AI capstone");
		expect(
			requireSourceModule(
				"AM14 Master Project: Tic Tac Toe AI"
			).keyBlocks
		).toContain("strategy test");
	});

	it("preserves project progress IDs in the core listing", async () => {
		const course =
			await useCoursesStore().loadCourseById("python-level-3");
		expect(course).not.toBeNull();

		const recursion = course!.modules.find(
			module => module.title === "AM4 Recursion Part 1"
		);
		const fibonacci = recursion?.curriculum.find(
			item =>
				item.title === "AM4 Project 3: Recursive Fibonacci Numbers"
		);

		expect(fibonacci?.id).toBe(
			"python-level-3-am4-recursion-part-1-curriculum-am4-project-3-recursive-fibonacci-numbers"
		);
		expect(fibonacci?.aliases).toBeUndefined();
	});

	it("keeps licensed sort animations and only available project media", async () => {
		const course = await loadRawCourse("python-level-3");
		expect(course).not.toBeNull();

		const items = course!.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const byTitle = new Map(items.map(item => [item.title, item]));
		expect(byTitle.get("Bubble Sort Introduction")?.mediaLink).toBe(
			"https://static.classes.jacobdanderson.net/py3_bubble_sort_wikimedia.gif"
		);
		expect(byTitle.get("Bubble Sort Introduction")?.content).toContain(
			"Wikimedia Commons"
		);
		expect(byTitle.get("AM1 Project 1: Mad Libs")?.mediaLink).toBe(
			"https://static.classes.jacobdanderson.net/am_1_mad_libs.mp4"
		);
		expect(
			byTitle.get("AM12 Project 2: File IO and Dictionaries")?.mediaLink
		).toBeUndefined();
		expect(JSON.stringify(course)).not.toContain(
			"Pending Python Level 3 Assets"
		);
	});
});
