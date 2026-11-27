import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { pythonIdeModeForCourseId, pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel1Course } from "@/stores/courses/cpp-level-1";
import { cppFoundationLessonBriefs } from "@/stores/courses/cppFoundationProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const projects = [
	["CPPF1 Project 1: Mad Libs", "CPPF1-Mad-Libs"],
	["CPPF1 Project 2: Chat Bot", "CPPF1-Chat-Bot"],
	["CPPF2 Project 1: Number Games", "CPPF2-Number-Games"],
	["CPPF2 Project 2: Rock, Paper, Scissors", "CPPF2-Rock-Paper-Scissors"],
	["CPPF2 Project 3: Fizz Buzz", "CPPF2-Fizz-Buzz"]
] as const;

describe("c++ foundation assignment contracts", () => {
	it("retains the authored concept sequence and compilable lesson examples", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const module = course!.modules[0];
		const titles = module.curriculum.map(item => item.title);
		const sequence = [
			"Program Setup, Syntax, and Compile-Run Cycle",
			"Primitive Types, Strings, and Console I/O",
			"Token Input, Full-Line Input, and Failure",
			projects[0][0],
			projects[1][0]
		];
		expect(titles.filter(title => sequence.includes(title))).toEqual(sequence);
		for (const [title, brief] of [
			[sequence[0], cppFoundationLessonBriefs.setup],
			[sequence[1], cppFoundationLessonBriefs.values],
			[sequence[2], cppFoundationLessonBriefs.input],
			["Branching and Repetition", cppFoundationLessonBriefs.branches]
		]) {
			const item = course!.modules.flatMap(module => module.curriculum)
				.find(item => item.title === title);
			const example = brief.match(/```cpp\n([\s\S]*?)\n```/)![1];
			expect(item?.content, title).toContain(example);
		}
		expect(module.curriculum[0].aliases).toContain(
			"c-level-1-cppf1-variables-types-strings-and-input-output-curriculum-variables-types-strings-and-input-output-core-concepts"
		);
	});

	it("exposes all five original core projects with matched source roles", async () => {
		const normalized = await loadRawCourse("c-level-1");
		expect(normalized).not.toBeNull();
		for (const course of [cppLevel1Course, normalized!]) {
			const foundation = course.modules.filter(module =>
				/^CPPF[12] /.test(module.title)
			);
			const items = foundation.flatMap(module => module.curriculum);
			for (const [title, folder] of projects) {
				const item = items.find(item => item.title === title);
				expect(item, title).toBeDefined();
				expect(item?.learningPath, title).toBe("core");
				expect(item?.projectLink, title).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/starter`
				);
				expect(item?.solutionLink, title).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/solution`
				);
				expect(item?.content, title).toContain("c++ -std=c++20");
				expect(item?.content, title).toMatch(/fixture|verification/i);
				expect(item?.content, title).toMatch(/TODO|incomplete|reminder/i);
			}
			for (const module of foundation)
				expect(module.supplementalProjects).toEqual([]);
		}
		expect(pythonIdeModeForCourseId("c-level-1")).toBe("cpp");
	});

	it("offers all ten complete demonstrations as learner-visible IDE readings", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const items = course!.modules.flatMap(module => module.curriculum);
		const references = items.filter(item => item.contentKind === "reading" && item.ideImport);
		expect(references.map(item => item.projectLink!.split("/").at(-1))).toEqual([
			"CPPF1-Primitive-Types-and-Strings-Reference",
			"CPPF2-For-Loop-Practice",
			"CPPF2-While-Loop-Practice",
			"CPPF3-rand-Reference",
			"CPPF4-Point-Class",
			"CPPF4-Person-Class-with-BMI",
			"CPPF5-Vectors-Reference",
			"CPPF6-Parameter-Passing-Introduction",
			"CPPF6-Structs-Example",
			"CPPF7-Grids-and-2D-Vectors-Reference"
		]);
		for (const item of references) {
			expect(item.learningPath, item.title).toBe("core");
			expect(item.solutionLink, item.title).toBeUndefined();
			expect(pythonIdeModeForCourseResource("c-level-1", item.projectLink!), item.title).toBe("cpp");
		}
		const whileLoops = items.find(item => item.title === "While-Loop Reference and State Tracing");
		expect(whileLoops?.content).toContain("c++ -std=c++20");
		expect(whileLoops?.content).toContain("3628800");
		expect(whileLoops?.content).toContain("zero");
		expect(JSON.stringify(items)).not.toContain(
			"Variables-Types-and-Input-and-Output-Supplemental-2"
		);
	});

	it("states cancellation, input and arithmetic contracts in the learner briefs", () => {
		const items = cppLevel1Course.modules.flatMap(module => module.curriculum);
		const content = (title: string) => items.find(item => item.title === title)!.content;
		expect(content(projects[0][0])).toContain("print no partial story");
		expect(content(projects[1][0])).toContain("fictional fixed exercise data");
		expect(content(projects[1][0])).toContain("One-character and Unicode text");
		expect(content(projects[1][0])).toContain("32x");
		expect(content(projects[2][0])).toContain("average\n`undefined`");
		expect(content(projects[2][0])).toContain("Do not swap reversed endpoints");
		expect(content(projects[3][0])).toContain("Invalid inputs never award a");
		expect(content(projects[4][0])).toContain("exactly 50 newline-terminated");
		expect(content(projects[4][0])).toContain("pointer cast never converts");
	});
});
