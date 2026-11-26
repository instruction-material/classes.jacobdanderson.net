import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel1Course } from "@/stores/courses/cpp-level-1";
import {
	cppParameterLessonBriefs,
	cppParameterProjectBriefs
} from "@/stores/courses/cppParameterProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const title = "CPPF6 Structs and Parameter Passing";
const sequence = [
	"References, Const References, and Function Boundaries",
	"CPPF6 Project 1: Parameter Passing Tracing",
	"Structs for Small Records",
	"CPPF6 Project 2: Defanging a Website Address",
	"CPPF6 Project 3: Chaos Monkeys"
];

describe("original C++ parameter-passing assignments", () => {
	it("keeps all three Juni projects required with distinct starter/reference packs", async () => {
		const normalized = await loadRawCourse("c-level-1");
		for (const course of [cppLevel1Course, normalized!]) {
			const module = course.modules.find(
				module => module.title === title
			)!;
			expect(module.curriculum.map(item => item.title)).toEqual(sequence);
			expect(module.supplementalProjects).toEqual([]);
			for (const [name, folder, key] of [
				[sequence[1], "CPPF6-Parameter-Passing", "tracing"],
				[sequence[3], "CPPF6-Defanging-a-Website-URL", "defang"],
				[sequence[4], "CPPF6-Chaos-Monkeys", "chaos"]
			] as const) {
				const item = module.curriculum.find(
					item => item.title === name
				)!;
				expect(item.learningPath, name).toBe("core");
				expect(item.projectLink).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/starter`
				);
				expect(item.solutionLink).toBe(
					`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}/solution`
				);
				expect(item.content).toContain(cppParameterProjectBriefs[key]);
			}
		}
	});

	it("shows both complete lessons without presenting them as unfinished starters", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const module = course!.modules.find(module => module.title === title)!;
		for (const [name, key, folder] of [
			[
				sequence[0],
				"introduction",
				"CPPF6-Parameter-Passing-Introduction"
			],
			[sequence[2], "structs", "CPPF6-Structs-Example"]
		] as const) {
			const item = module.curriculum.find(item => item.title === name)!;
			expect(item.projectLink).toMatch(new RegExp(`/${folder}$`));
			expect(item.contentKind).toBe("reading");
			expect(item.solutionLink).toBeUndefined();
			expect(item.content).toContain(
				`https://github.com/instruction-material/CPP-Level-1/tree/main/${folder}`
			);
			const programs = [
				...cppParameterLessonBriefs[key].matchAll(
					/```cpp\n([\s\S]*?)\n```/g
				)
			];
			expect(programs).toHaveLength(1);
			expect(item.content).toContain(programs[0][1]);
		}
	});

	it("preserves the two core IDs and the former supplemental Chaos Monkeys progress", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const items = course!.modules.find(
			module => module.title === title
		)!.curriculum;
		for (const [name, id] of [
			[
				sequence[1],
				"c-level-1-cppf6-structs-and-parameter-passing-curriculum-cppf6-project-1-parameter-passing-tracing"
			],
			[
				sequence[3],
				"c-level-1-cppf6-structs-and-parameter-passing-curriculum-cppf6-project-2-defanging-a-website-address"
			],
			[
				sequence[4],
				"c-level-1-cppf6-structs-and-parameter-passing-supplemental-structs-and-parameter-passing-string-mutation-lab"
			]
		])
			expect(items.find(item => item.title === name)?.id).toBe(id);
		expect(
			items.find(item => item.title === sequence[4])?.aliases
		).toContain(
			"c-level-1-cppf6-structs-and-parameter-passing-curriculum-cppf6-project-3-chaos-monkeys"
		);
	});

	it("states caller preservation, literal expansion, bounded growth and native workflow", () => {
		expect(cppParameterProjectBriefs.tracing).toContain(
			"prediction comments and test driver are\nunfinished"
		);
		expect(cppParameterProjectBriefs.tracing).toContain(
			"dangling reference"
		);
		expect(cppParameterProjectBriefs.defang).toContain("not idempotent");
		expect(cppParameterProjectBriefs.defang).toContain(
			"Missing website address."
		);
		expect(cppParameterProjectBriefs.defang).toContain(
			"Website address is too long."
		);
		expect(cppParameterProjectBriefs.defang).toContain(
			"including UTF-8 bytes"
		);
		expect(cppParameterProjectBriefs.chaos).toContain(
			"Snapshot the original size"
		);
		expect(cppParameterProjectBriefs.chaos).toContain("positions 1, 3, 5");
		expect(cppParameterProjectBriefs.chaos).toContain(
			"not uniform probabilities"
		);
		for (const brief of Object.values(cppParameterProjectBriefs)) {
			expect(brief).toContain("exits with status 2");
			expect(brief).toContain("Save/export the attempt");
			expect(brief).toContain("native C++20 compiler");
		}
	});
});
