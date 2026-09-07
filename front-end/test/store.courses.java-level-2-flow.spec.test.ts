import { describe, expect, it } from "vitest";
import { javaLevel2Course } from "@/stores/courses/java-level-2";

const EXPECTED_PRIMARY_SEQUENCE = [
	"JM0 Visual-to-OOP Bridge",
	"JM1 Instance Variables, Constructors, and Methods",
	"JM2 Overloaded Constructors & Comparison Methods",
	"JM3 Static Variables & Methods",
	"Check-In #1",
	"JM4 Subclasses & Inheritance",
	"JM5 Maps",
	"JM6 Exceptions and Failure Handling",
	"Check-In #2",
	"JM7 Bank Account",
	"JM8 File I/O",
	"JM9 Maze Runner",
	"JM10 Master Project"
];

const JUNI_CORE_PROJECTS = [
	"JM2 Project 1: Person Class",
	"Check-In #1: Additional Practice Project",
	"JM4 Project 2: Book and PictureBook Class",
	"JM4 Project 3: Vehicle Inheritance",
	"JM5 Project 2: Dealership Database",
	"Check-In #2: Additional Practice Project",
	"JM8 Project 1: Crazy Name Tags Printer"
];

function requireModule(title: string) {
	const module = javaLevel2Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Java Level 2 module ${title}.`);
	return module;
}

describe("Java Level 2 learner flow", () => {
	it("keeps thirteen OOP modules followed by concurrency, practice, and media appendices", () => {
		expect(
			javaLevel2Course.modules.slice(0, 13).map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(javaLevel2Course.modules).toHaveLength(16);
		expect(javaLevel2Course.modules.slice(13)).toMatchObject([
			{
				kind: "appendix",
				title: "Optional Java Concurrency Extension"
			},
			{
				kind: "appendix",
				title: "Optional Java Level 2 Practice and Reference Archive"
			},
			{
				kind: "appendix",
				title: "Pending Demo Media"
			}
		]);
	});

	it("gives every required module pacing, milestones, and explicit paths", () => {
		for (const module of javaLevel2Course.modules.slice(0, 13)) {
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
		const curriculumCount = javaLevel2Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = javaLevel2Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const curriculumTitles = javaLevel2Course.modules.flatMap(module =>
			module.curriculum.map(item => item.title)
		);
		const optionTitles = javaLevel2Course.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumCount).toBe(65);
		expect(optionCount).toBe(62);
		for (const title of JUNI_CORE_PROJECTS) {
			expect(curriculumTitles, title).toContain(title);
			expect(optionTitles, title).not.toContain(title);
		}
		expect(optionTitles).toContain(
			"JM Master Project Example Quiz Game: Core Project"
		);
		expect(optionTitles).toContain("JM Maze Runner Project: Core Project");
		expect(optionTitles).toContain("Reference: HashMaps Examples");
	});

	it("makes concurrency optional, bounded, and deterministic", () => {
		const requiredText = javaLevel2Course.modules
			.slice(0, 13)
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.map(item => `${item.title}\n${item.content}`)
			.join("\n");
		const concurrency = requireModule(
			"Optional Java Concurrency Extension"
		);
		const concurrencyText = [
			...concurrency.curriculum,
			...concurrency.supplementalProjects
		]
			.map(item => `${item.title}\n${item.content}`)
			.join("\n");

		expect(requiredText).not.toContain("Threading in Java");
		expect(requiredText).not.toContain("JM6 Project 2: Bouncing Zeros");
		expect(concurrencyText).toContain("Threading in Java");
		expect(concurrencyText).toContain("JM6 Project 2: Bouncing Zeros");
		expect(concurrencyText).toContain("Maze Runner Part 3");
		expect(concurrencyText).toContain("bounded `ExecutorService`");
		expect(concurrencyText).toContain(
			"Do not use `sleep()` to prove correctness"
		);
		expect(concurrencyText).toContain("leave no background worker running");
	});

	it("adds testable OOP, money, file, maze, and capstone contracts", () => {
		const readiness = requireModule("JM0 Visual-to-OOP Bridge");
		const comparisons = requireModule(
			"JM2 Overloaded Constructors & Comparison Methods"
		);
		const exceptions = requireModule("JM6 Exceptions and Failure Handling");
		const bank = requireModule("JM7 Bank Account");
		const files = requireModule("JM8 File I/O");
		const maze = requireModule("JM9 Maze Runner");
		const capstone = requireModule("JM10 Master Project");
		const moduleText = (
			module: (typeof javaLevel2Course.modules)[number]
		) => module.curriculum.map(item => item.content).join("\n");

		expect(moduleText(readiness)).toContain("Java 21");
		expect(moduleText(readiness)).toContain("javac -Xlint:all");
		expect(moduleText(comparisons)).toContain(
			"equal objects return the same `hashCode()`"
		);
		expect(moduleText(exceptions)).toContain("No empty catch blocks");
		expect(moduleText(bank)).toContain("integer cents or `BigDecimal`");
		expect(moduleText(bank)).toContain(
			"no password-like value is written to a file or log"
		);
		expect(moduleText(files)).toContain("temporary course-owned directory");
		expect(moduleText(files)).toContain("explicit UTF-8");
		expect(moduleText(maze)).toContain("missing start");
		expect(moduleText(capstone)).toContain(
			"interface or substitution boundary"
		);
		expect(moduleText(capstone)).toContain(
			"no real personal or credential data"
		);
	});
});
