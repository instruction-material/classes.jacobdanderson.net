import { describe, expect, it } from "vitest";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { pythonToJavaAndCppBridgeCourse } from "@/stores/courses/python-to-java-and-cpp-bridge";
import { loadRawCourse } from "@/stores/courses/index";

const EXPECTED_MODULE_SEQUENCE = [
	"PTJ0 Positioning and Workflow Translation",
	"PTJ1 Functions, Parameters, and Return Types",
	"PTJ2 Collections, Strings, and Indexing",
	"PTJ3 Classes and Objects across Languages",
	"PTJ4 Java-Specific Adaptation",
	"PTJ5 C++-Specific Adaptation",
	"Language Bridge Lab 17: Bridge Capstone Port Studio"
];

function requireModule(title: string) {
	const module = pythonToJavaAndCppBridgeCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected bridge module ${title}.`);
	return module;
}

function allItems() {
	return pythonToJavaAndCppBridgeCourse.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

describe("Python to Java and C++ Bridge learner flow", () => {
	it("keeps authored checkpoints and language choices free of generated tasks", async () => {
		const course = (await loadRawCourse("python-to-java-and-cpp-bridge"))!;
		const items = course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const sourceReview = items.find(
			item => item.title === "Project: Starter Source Review"
		)!;
		expect(sourceReview.content).toContain(
			"reading checkpoint within the warmup"
		);
		expect(sourceReview.projectLink).toBeUndefined();
		for (const item of items) {
			expect(item.content, item.title).not.toMatch(
				/^\*\*(?:Goal|Focus|Concept path|Optional · Extension):\*\*/m
			);
		}
	});

	it("keeps the authored capstone instructions specific to the chosen port", async () => {
		const course = await loadRawCourse("python-to-java-and-cpp-bridge");
		const capstone = course?.modules.find(
			module => module.title === EXPECTED_MODULE_SEQUENCE[6]
		);
		expect(capstone).toBeDefined();
		const items = [
			...capstone!.curriculum,
			...capstone!.supplementalProjects
		];
		expect(items).toHaveLength(8);
		for (const item of items) {
			expect(item.content).not.toMatch(
				/\*\*(?:Lab|Approach|Studio focus|Build steps):\*\*/
			);
		}
		expect(items[3]!.content).toContain(
			"One working Java or C++ task-tracker port"
		);
		expect(items[4]!.content).toContain("Starting Python behavior");
		expect(items[5]!.content).toContain("Use JDK 21");
		expect(items[6]!.content).toContain("Use a C++17 compiler");
		expect(items[7]!.content).toContain(
			"After completing the capstone in one target"
		);
	});

	it("keeps the published catalog free of generated replacement practice", async () => {
		const course = await loadRawCourse("python-to-java-and-cpp-bridge");
		expect(course?.modules.map(module => module.title)).toEqual(
			EXPECTED_MODULE_SEQUENCE
		);
		for (const module of course!.modules) {
			expect(module.supplementalProjects).toHaveLength(1);
			expect(module.supplementalProjects[0]?.learningPath).toBe(
				"challenge"
			);
		}
		const linked = course!.modules
			.flatMap(module => module.curriculum)
			.filter(item => item.projectLink);
		expect(linked).toHaveLength(12);
		const pythonBlocks = (contents: string[]) =>
			contents.flatMap(content =>
				[...content.matchAll(/```python\n([\s\S]*?)```/g)].map(
					// Visible Markdown normalizes paragraph spacing; preserve
					// source statements and their significant indentation.
					match => match[1]!.replace(/\n{3,}/g, "\n\n")
				)
			);
		expect(
			pythonBlocks(
				course!.modules.flatMap(module =>
					module.curriculum.map(item => item.content)
				)
			)
		).toEqual(pythonBlocks(allItems().map(item => item.content)));
		expect(JSON.stringify(course)).not.toMatch(
			/BRG-|Transfer Studio Archive/
		);
	});

	it("has a shared foundation, choose-one exit, and one real capstone", () => {
		expect(
			pythonToJavaAndCppBridgeCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		for (const title of EXPECTED_MODULE_SEQUENCE.slice(4, 6)) {
			const module = requireModule(title);
			expect(module.kind).toBe("transition");
			expect(
				module.curriculum.every(item => item.learningPath === "choice")
			).toBe(true);
		}
		expect(
			requireModule(EXPECTED_MODULE_SEQUENCE[3]!).curriculum.find(
				item => item.title === "Choose a Java or C++ Exit Branch"
			)?.content
		).toContain("unselected branch is labeled optional");
	});

	it("places language starter choices beside required briefs, with extensions supplemental", () => {
		for (const module of pythonToJavaAndCppBridgeCourse.modules) {
			expect(module.estimatedTime).toMatch(/session/);
			expect(module.keyBlocks?.length).toBeGreaterThanOrEqual(5);
			expect(module.curriculum[0]?.content).toContain("**Course flow:**");
			expect(
				module.supplementalProjects.every(
					item => item.learningPath === "challenge"
				)
			).toBe(true);
			expect(
				module.supplementalProjects.every(item => !item.projectLink)
			).toBe(true);
		}
		for (const index of [0, 1, 2, 3, 6]) {
			const module = requireModule(EXPECTED_MODULE_SEQUENCE[index]!);
			const choices = module.curriculum.filter(item => item.projectLink);
			expect(choices).toHaveLength(2);
			expect(choices.map(item => item.learningPath)).toEqual([
				"choice",
				"choice"
			]);
			expect(
				module.curriculum.some(
					item =>
						item.learningPath === "core" &&
						item.content.includes("Only one target is required.")
				)
			).toBe(true);
		}
	});

	it("imports exactly one typed folder per source choice and pairs its own reference", () => {
		const linked = allItems().filter(item => item.projectLink);
		expect(linked).toHaveLength(12);
		expect(new Set(linked.map(item => item.projectLink)).size).toBe(
			linked.length
		);
		for (const item of linked) {
			const starter = item.projectLink!;
			const expectedMode = /\/cpp$|PTJ6-/.test(starter) ? "cpp" : "java";
			expect(
				pythonIdeModeForCourseResource(
					"python-to-java-and-cpp-bridge",
					starter
				)
			).toBe(expectedMode);
			expect(item.solutionLink).toBe(
				starter.replace("/starter", "/solution")
			);
			if (/PTJ[1-4]-|PTJ7-/.test(starter)) {
				expect(starter).toMatch(/\/starter\/(?:java|cpp)$/);
			}
		}
	});

	it("provides full behavior, baseline, checks and native workflow for every project", () => {
		const briefs = allItems().filter(item =>
			item.content.includes("```python")
		);
		expect(briefs).toHaveLength(7);
		for (const item of briefs) {
			expect(item.content, item.title).toContain("## Checks");
			expect(item.content, item.title).toMatch(/(?:Workflow|workflow)/);
			expect(item.content, item.title).toMatch(
				/(?:Completion|completion) evidence|Completion requires/
			);
			expect(item.content, item.title).toMatch(
				/javac|c\+\+ -std=c\+\+17/
			);
			expect(item.content, item.title).toContain("working draft");
		}
		const capstone = requireModule(EXPECTED_MODULE_SEQUENCE[6]!);
		const brief = capstone.curriculum.find(
			item => item.title === "Language Bridge Lab 17: Core Project"
		)!;
		for (const promise of [
			"normalizeTitle",
			"addTask",
			"completeTask",
			"removeTask",
			"listTasks",
			"summary",
			"100 successful adds",
			"CRLF",
			"fresh",
			"unchanged state",
			"class TaskTracker",
			"native JDK"
		]) {
			expect(brief.content).toContain(promise);
		}
		expect(
			capstone.curriculum
				.filter(item => item.projectLink)
				.map(item => item.projectLink)
		).toEqual([
			"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ7-Task-Tracker-Capstone/starter/java",
			"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ7-Task-Tracker-Capstone/starter/cpp"
		]);
	});

	it("retires unsupported scoring clones and unrelated archives from the catalog", () => {
		const corpus = JSON.stringify(pythonToJavaAndCppBridgeCourse);
		expect(corpus).not.toMatch(
			/BRG-|computeScore|Transfer Studio Archive|Graphics Translation Studio|C Foundations Transfer Studio/
		);
		expect(
			allItems().find(
				item => item.title === "Project: Starter Source Review"
			)?.projectLink
		).toBeUndefined();
	});
});
