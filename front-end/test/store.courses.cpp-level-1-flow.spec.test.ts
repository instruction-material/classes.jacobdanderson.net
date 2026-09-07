import { describe, expect, it } from "vitest";
import { cppLevel1Course } from "@/stores/courses/cpp-level-1";

const EXPECTED_MODULE_SEQUENCE = [
	"CPPF1 Variables, Types, Strings, and Input/Output",
	"CPPF2 Loops and Conditionals",
	"CPPF3 Functions",
	"CPPF4 Classes and Objects",
	"CPPF5 Vectors and Collection Patterns",
	"CPPF6 Structs and Parameter Passing",
	"CPPF7 Grids and 2D Vectors",
	"CPPF8 Master Project: Profile Posts"
];

function requireModule(title: string) {
	const module = cppLevel1Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected C++ Level 1 module ${title}.`);
	return module;
}

describe("C++ Level 1 learner flow", () => {
	it("keeps a safe fundamentals-to-capstone sequence", () => {
		expect(cppLevel1Course.modules.map(module => module.title)).toEqual(
			EXPECTED_MODULE_SEQUENCE
		);
		expect(
			EXPECTED_MODULE_SEQUENCE.indexOf(
				"CPPF5 Vectors and Collection Patterns"
			)
		).toBeLessThan(
			EXPECTED_MODULE_SEQUENCE.indexOf("CPPF7 Grids and 2D Vectors")
		);
	});

	it("gives every module pacing, C++ targets, and explicit paths", () => {
		for (const module of cppLevel1Course.modules) {
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
		const requiredCount = cppLevel1Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = cppLevel1Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const options = cppLevel1Course.modules.flatMap(module =>
			module.supplementalProjects.map(item => ({
				path: item.learningPath,
				title: item.title
			}))
		);
		const curriculum = cppLevel1Course.modules.flatMap(module =>
			module.curriculum.map(item => ({
				path: item.learningPath,
				title: item.title
			}))
		);

		expect(requiredCount).toBe(29);
		expect(optionCount).toBe(9);
		for (const project of [
			"CPPF1 Project 2: Chat Bot",
			"CPPF2 Project 2: Rock, Paper, Scissors",
			"CPPF3 Project 2: Number Guesser",
			"CPPF5 Project 2: Bank Accounts",
			"CPPF6 Project 2: Defanging a Website Address"
		]) {
			expect(curriculum).toContainEqual({
				path: "core",
				title: project
			});
			expect(options.map(item => item.title)).not.toContain(project);
		}
		expect(curriculum).toContainEqual({
			path: "core",
			title: "CPPF2 Project 3: Fizz Buzz"
		});
	});

	it("uses a warning-clean C++20 workflow and reproducible randomness", () => {
		const firstModule = requireModule(
			"CPPF1 Variables, Types, Strings, and Input/Output"
		);
		const functions = requireModule("CPPF3 Functions");
		const functionsText = functions.curriculum
			.map(item => item.content)
			.join("\n");

		expect(
			firstModule.curriculum.find(
				item =>
					item.title === "C++20 Toolchain and Input Readiness Check"
			)?.content
		).toContain("-Wall -Wextra -Wpedantic");
		expect(functionsText).toContain("std::mt19937");
		expect(functionsText).toContain("fixed seed for reproducible tests");
		expect(functionsText).toContain(
			"`rand()` can be recognized in older code"
		);
		expect(functionsText).not.toContain(
			"`rand()` belongs after basic function calls"
		);
	});

	it("ends with a private, testable Profile Posts application", () => {
		const capstone = requireModule("CPPF8 Master Project: Profile Posts");
		const contract = capstone.curriculum.find(
			item => item.title === "Profile Posts Completion Contract"
		);

		expect(capstone.curriculum[0]?.content).toContain(
			"fictional, local-only profile manager"
		);
		expect(capstone.curriculum[0]?.content).toContain(
			"networking, public posting, and real personal data are out of scope"
		);
		expect(contract?.content).toContain(
			"add, view, update, remove, invalid index, invalid command, empty profile, and quit behavior"
		);
	});
});
