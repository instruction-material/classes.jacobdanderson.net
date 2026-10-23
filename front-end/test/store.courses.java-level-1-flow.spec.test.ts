import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { javaLevel1Course } from "@/stores/courses/java-level-1";

const EXPECTED_PRIMARY_SEQUENCE = [
	"J1A Visual Java Launch: Karel Robot Worlds",
	"J1B Visual Java Syntax: Types, Objects, and Methods",
	"J1C Text Bridge: Variables, Strings, and Input",
	"J1D Text Bridge: Casting, Operators, and Coordinate Reasoning",
	"J1E Branching Logic: Console Choices and Visual Decisions",
	"J1F Repetition: Console Patterns and Grid Moves",
	"J1G Loops, Conditionals, and Randomized Games",
	"J1H Check-In: Visual-to-Text Foundations",
	"J1I Methods: Helpers, Parameters, and Reuse",
	"J1J Lists of State: Arrays and ArrayLists",
	"J1K Grid Data: Two-Dimensional Arrays",
	"J1L Check-In: Methods and Data Structures",
	"J1M Master Project: Battleship Grid Game"
];

const JUNI_CORE_PROJECTS = [
	"JS1 Project 2: First Middle Last",
	"JS3 Project 2: Color Mixer",
	"JS4 Project 2: Nested Loops",
	"JS5 Project 2: Mathematical Challenges",
	"JS7 Project 2: Fortune Teller",
	"JS7 Project 4: High Score List",
	"JS8 Project 2: Grid Drawer",
	"JS9 Master Project: Advanced Battleship"
];

const ORIGINAL_MODULE_TITLES = [
	"JS1 Variable Types & Input/Output",
	"JS2 Casting and Operators",
	"JS3 Conditionals",
	"JS4 Loops",
	"JS5 Practice with Loops & Conditionals",
	"Check-In #1",
	"JS6 Methods",
	"JS7 Arrays and ArrayLists",
	"JS8 Two-Dimensional Arrays",
	"Check-In #2",
	"JS9 Master Project: Battleship"
];

function requireModule(title: string) {
	const module = javaLevel1Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Java Level 1 module ${title}.`);
	return module;
}

describe("Java Level 1 learner flow", () => {
	it("recognizes saved IDs from the original Java modules and lessons", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("java-level-1");
		expect(course).not.toBeNull();
		for (const [index, title] of ORIGINAL_MODULE_TITLES.entries()) {
			const module = course!.modules[index + 2];
			const originalId = `java-level-1-${title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "")}`;
			expect(module.aliases, title).toContain(originalId);
			const lesson = module.curriculum[0];
			const originalLessonId = `${originalId}-curriculum-${lesson.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "")}`;
			expect(lesson.aliases, title).toContain(originalLessonId);
		}
		const karel = course!.modules[0];
		expect(karel.aliases).toContain(
			"java-level-1-j1a-visual-java-launch-carol-karel-robot-worlds"
		);
		expect(
			karel.curriculum.some(item =>
				item.aliases?.includes(
					"java-level-1-j1a-visual-java-launch-carol-karel-robot-worlds-curriculum-carol-karel-robot-worlds-core-concepts"
				)
			)
		).toBe(true);
	});

	it("keeps thirteen paced core modules followed by explicit optional appendices", () => {
		expect(
			javaLevel1Course.modules.slice(0, 13).map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(javaLevel1Course.modules).toHaveLength(18);
		expect(javaLevel1Course.modules[13]).toMatchObject({
			kind: "appendix",
			title: "Optional Java Foundations Practice Archive"
		});
		expect(
			javaLevel1Course.modules
				.slice(14, 17)
				.map(module => [module.kind, module.title])
		).toEqual([
			[
				"appendix",
				"Java Level 1 Graphics Extension: Visual Project Setup"
			],
			[
				"appendix",
				"Java Level 1 Graphics Extension: Coordinates, Color, and Shapes"
			],
			[
				"appendix",
				"Java Level 1 Graphics Extension: Loops, Methods, and Scene Composition"
			]
		]);
		expect(javaLevel1Course.modules[17]).toMatchObject({
			kind: "appendix",
			title: "Pending Demo Media"
		});
	});

	it("gives every core module pacing, milestones, and explicit learning paths", () => {
		for (const module of javaLevel1Course.modules.slice(0, 13)) {
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

	it("keeps original Juni projects in core and supplemental work in practice", () => {
		const curriculumCount = javaLevel1Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = javaLevel1Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const curriculumTitles = javaLevel1Course.modules.flatMap(module =>
			module.curriculum.map(item => item.title)
		);
		const optionTitles = javaLevel1Course.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumCount).toBe(70);
		expect(optionCount).toBe(106);
		for (const title of JUNI_CORE_PROJECTS) {
			expect(curriculumTitles, title).toContain(title);
			expect(optionTitles, title).not.toContain(title);
		}
		expect(optionTitles).toContain(
			"J1X02 Java Foundations Build 13: Core Project"
		);
		expect(optionTitles).toContain("Temperature Converter: Core Project");
	});

	it("pins Java 21 and makes input, randomness, and a small class testable", () => {
		const input = requireModule(
			"J1C Text Bridge: Variables, Strings, and Input"
		);
		const random = requireModule(
			"J1G Loops, Conditionals, and Randomized Games"
		);
		const methods = requireModule(
			"J1I Methods: Helpers, Parameters, and Reuse"
		);
		const readiness = input.curriculum.find(
			item => item.title === "Java 21 Toolchain and Input Readiness"
		);
		const chatbot = input.curriculum.find(
			item => item.title === "JS1 Project 1: Chat Bot"
		);
		const randomLesson = random.curriculum.find(
			item => item.title === "Random Numbers and Letters"
		);
		const classBoundary = methods.curriculum.find(
			item => item.title === "Small Class Boundary: State and Behavior"
		);

		expect(readiness?.content).toContain("Java 21");
		expect(readiness?.content).toContain("javac -Xlint:all");
		expect(readiness?.content).toContain("Scanner.nextLine()");
		expect(readiness?.content).toContain("invalid numeric input");
		expect(chatbot?.content).toContain("fictional, non-sensitive");
		expect(randomLesson?.content).toContain("java.util.Random");
		expect(randomLesson?.content).toContain("fixed seed");
		expect(classBoundary?.content).toContain("Private state");
		expect(classBoundary?.content).toContain(
			"independence between two instances"
		);
	});

	it("ends with one bounded, deterministic, testable Battleship capstone", () => {
		const capstone = requireModule(
			"J1M Master Project: Battleship Grid Game"
		);
		const contract = capstone.curriculum.find(
			item => item.title === "Simple Battleship Completion Contract"
		);
		const advanced = capstone.curriculum.find(
			item => item.title === "JS9 Master Project: Advanced Battleship"
		);

		expect(contract?.content).toContain("local, single-player game");
		expect(contract?.content).toContain("duplicate shot");
		expect(contract?.content).toContain("edge and corner coordinates");
		expect(contract?.content).toContain("fresh-game reset");
		expect(advanced?.learningPath).toBe("core");
	});
});
