import { describe, expect, it } from "vitest";
import { javaLevel3Course } from "@/stores/courses/java-level-3";

const EXPECTED_PRIMARY_SEQUENCE = [
	"AJ0 Visual Foundations Audit",
	"AJ4 Recursion",
	"AJ5 Linear Search and Big-O Notation",
	"AJ6 Binary Search",
	"Check-In #1",
	"AJ7 Selection and Insertion Sort",
	"AJ9 Merge Sort",
	"Check-In #2",
	"AJ10 Sustainable Programming",
	"AJ11 Linked Lists",
	"AJ12 Stacks and Queues",
	"AJ13 Priority Queues and Maps",
	"Check-In #3",
	"AJ14 Binary Search Trees",
	"AJ15 Hash Tables",
	"AJ16 Graphs",
	"Check-In #4",
	"AJ17 Master Project: Google Maps"
];

const JUNI_CORE_PROJECTS = [
	"AJ4 Project 2: Divisible by 7",
	"AJ5 Project 2: Big-O Practice",
	"AJ6 Project 2: Binary Search with Recursion",
	"AJ6 Project 3: Precise Square Roots",
	"Check-In #1: Additional Practice Project",
	"Check-In #2: Additional Practice Project",
	"AJ10 Project 2: Anything Array",
	"AJ10 Project 3: Exception Practice",
	"AJ11 Project 2: Doubly Linked List",
	"Check-In #3: Additional Practice Project",
	"AJ14 Project 3: BST Clear and Remove",
	"AJ15 Project 2: Mini Search Engine",
	"Check-In #4: Additional Practice Project"
];

function requireModule(title: string) {
	const module = javaLevel3Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Java Level 3 module ${title}.`);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

describe("Java Level 3 learner flow", () => {
	it("keeps one eighteen-module algorithm spine and three explicit appendices", () => {
		expect(
			javaLevel3Course.modules.slice(0, 18).map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(javaLevel3Course.modules).toHaveLength(21);
		expect(javaLevel3Course.modules.slice(18)).toMatchObject([
			{
				kind: "appendix",
				title: "Java Foundations Reference Archive"
			},
			{
				kind: "appendix",
				title: "Optional Advanced Java Engineering Sequence"
			},
			{
				kind: "appendix",
				title: "Pending Demo Media"
			}
		]);
	});

	it("gives every required module pacing, milestones, and explicit paths", () => {
		for (const module of javaLevel3Course.modules.slice(0, 18)) {
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
		const curriculumCount = javaLevel3Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = javaLevel3Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const curriculumTitles = javaLevel3Course.modules.flatMap(module =>
			module.curriculum.map(item => item.title)
		);
		const optionTitles = javaLevel3Course.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumCount).toBe(142);
		expect(optionCount).toBe(93);
		for (const title of JUNI_CORE_PROJECTS) {
			expect(curriculumTitles, title).toContain(title);
			expect(optionTitles, title).not.toContain(title);
		}
		expect(curriculumTitles).toContain("AJ1 Project 1: Mad Libs");
		expect(curriculumTitles).toContain(
			"AJ8 Project 1: Bubble Sort Implementation"
		);
		expect(curriculumTitles).toContain("Check-In #2: Bubble Sort");
		expect(curriculumTitles).toContain(
			"AJ18 Repo Extension, Starter, and Capstone Library: Core Project"
		);
		expect(optionTitles).toContain(
			"AJ22 Project 2: Event-Driven Simulation Capstone"
		);
	});

	it("adds reproducible algorithm and data-structure contracts", () => {
		expect(moduleText("AJ0 Visual Foundations Audit")).toContain("Java 21");
		expect(moduleText("AJ0 Visual Foundations Audit")).toContain(
			"fixed seed"
		);
		expect(moduleText("AJ4 Recursion")).toContain("strictly decreases");
		expect(moduleText("AJ6 Binary Search")).toContain(
			"low + (high - low) / 2"
		);
		expect(moduleText("AJ9 Merge Sort")).toContain(
			"unchanged element counts"
		);
		expect(moduleText("AJ9 Merge Sort")).toContain(
			"does not establish an asymptotic complexity class"
		);
		expect(moduleText("AJ12 Stacks and Queues")).toContain("ArrayDeque");
		expect(moduleText("AJ14 Binary Search Trees")).toContain(
			"ordering, reachability, node count"
		);
		expect(moduleText("AJ15 Hash Tables")).toContain("Math.floorMod");
		expect(moduleText("AJ15 Hash Tables")).toContain(
			"rehashing preserves every key-value pair exactly once"
		);
	});

	it("bounds graph work, route data, and the advanced continuation", () => {
		const graphs = moduleText("AJ16 Graphs");
		const capstone = moduleText("AJ17 Master Project: Google Maps");
		const advanced = moduleText(
			"Optional Advanced Java Engineering Sequence"
		);

		expect(graphs).toContain("rejects negative weights");
		expect(graphs).toContain("skips stale queue entries");
		expect(graphs).toContain("explicit unreachable result");
		expect(capstone).toContain("course-owned or openly licensed");
		expect(capstone).toContain("no live location");
		expect(capstone).toContain("no unbounded background compute");
		expect(advanced).toContain("AJ19 Post-C++ Java Tooling");
		expect(advanced).toContain("AJ22 Concurrency");
		expect(advanced).toContain("bounded executors");
		expect(advanced).toContain("explicit shutdown and interrupt policy");
	});
});
