import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel1Course } from "@/stores/courses/cpp-level-1";
import {
	cppFunctionsLessonBriefs,
	cppFunctionsProjectBriefs
} from "@/stores/courses/cppFunctionsProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const projects = [
	[
		"CPPF3 Project 1: Function Practice",
		"CPPF3-Function-Practice",
		"functionPractice"
	],
	[
		"CPPF3 Project 2: Probability Events and Random",
		"CPPF3-Probability-Functions",
		"probability"
	],
	["CPPF3 Project 3: Number Guesser", "CPPF3-Number-Guesser", "numberGuesser"]
] as const;

describe("original C++ functions assignments", () => {
	it("restores all three required projects with separate source roles", async () => {
		const normalized = await loadRawCourse("c-level-1");
		expect(normalized).not.toBeNull();
		for (const course of [cppLevel1Course, normalized!]) {
			const module = course.modules.find(
				module => module.title === "CPPF3 Functions"
			)!;
			for (const [title, folder, key] of projects) {
				const item = module.curriculum.find(
					item => item.title === title
				);
				expect(item, title).toBeDefined();
				expect(item?.learningPath, title).toBe("core");
				expect(item?.projectLink, title).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/starter`
				);
				expect(item?.solutionLink, title).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/solution`
				);
				// Display copy uses the catalog's neutral role label; preserve
				// the complete brief and the person implementing the program.
				const brief =
					course === cppLevel1Course
						? cppFunctionsProjectBriefs[key]
						: cppFunctionsProjectBriefs[key].replace(
								/\bInstructor\b/g,
								"Course facilitator"
							);
				expect(item?.content, title).toContain(brief);
				expect(item?.content, title).not.toContain(
					"the work implements"
				);
			}
			expect(module.supplementalProjects).toEqual([]);
			expect(JSON.stringify(module)).not.toContain(
				"Functions-Supplemental-2"
			);
		}
	});

	it("keeps the original deterministic-before-random learning sequence", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const module = course!.modules.find(
			module => module.title === "CPPF3 Functions"
		)!;
		const sequence = [
			"Function Signatures, Return Values, and Decomposition",
			projects[0][0],
			"Randomness and Small Simulation Helpers",
			projects[1][0],
			projects[2][0]
		];
		expect(
			module.curriculum
				.map(item => item.title)
				.filter(title => sequence.includes(title))
		).toEqual(sequence);
		for (const [title, brief] of [
			[sequence[0], cppFunctionsLessonBriefs.functions],
			[sequence[2], cppFunctionsLessonBriefs.random]
		]) {
			const example = brief.match(/```cpp\n([\s\S]*?)\n```/)![1];
			expect(
				module.curriculum.find(item => item.title === title)?.content
			).toContain(example);
		}
		const reference = module.curriculum.find(
			item => item.title === sequence[2]
		);
		expect(reference?.projectLink).toMatch(/\/CPPF3-rand-Reference$/);
		expect(reference?.contentKind).toBe("reading");
		expect(reference?.solutionLink).toBeUndefined();
		expect(reference?.content).toContain(
			"[documented random-number reference](https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-rand-Reference)"
		);
		const raw = await loadRawCourse("c-level-1");
		const rawReference = raw!.modules
			.find(module => module.title === "CPPF3 Functions")!
			.curriculum.find(item => item.title === sequence[2]);
		expect(rawReference?.projectLink).toMatch(/\/CPPF3-rand-Reference$/);
		expect(rawReference?.solutionLink).toBeUndefined();
	});

	it("retains old project and concept identities as progress aliases", async () => {
		const course = await loadRawCourse("c-level-1");
		const items = course!.modules.find(
			module => module.title === "CPPF3 Functions"
		)!.curriculum;
		for (const [title, alias] of [
			[
				projects[1][0],
				"c-level-1-cppf3-functions-curriculum-cppf3-project-1-probability-functions"
			],
			[
				projects[2][0],
				"c-level-1-cppf3-functions-curriculum-cppf3-project-2-number-guesser"
			],
			[
				"Function Signatures, Return Values, and Decomposition",
				"c-level-1-cppf3-functions-curriculum-functions-core-concepts"
			],
			[
				"Randomness and Small Simulation Helpers",
				"c-level-1-cppf3-functions-curriculum-functions-application-check"
			]
		]) {
			expect(
				items.find(item => item.title === title)?.aliases,
				title
			).toContain(alias);
		}
	});

	it("states the arithmetic, randomness and cancellation boundaries", () => {
		expect(cppFunctionsProjectBriefs.functionPractice).toContain(
			"factorial input is 1 through 12"
		);
		expect(cppFunctionsProjectBriefs.functionPractice).toContain(
			"Print no calculated result if any field is invalid"
		);
		expect(cppFunctionsProjectBriefs.probability).toContain(
			"two independent six-sided dice"
		);
		expect(cppFunctionsProjectBriefs.probability).toContain(
			"Distribution mappings can differ"
		);
		expect(cppFunctionsProjectBriefs.numberGuesser).toContain(
			"five guesses"
		);
		expect(cppFunctionsProjectBriefs.numberGuesser).toContain(
			"cancellation must not claim"
		);
	});
});
