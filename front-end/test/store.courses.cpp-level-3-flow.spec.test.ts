import { describe, expect, it } from "vitest";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";

const EXPECTED_MODULE_SEQUENCE = [
	"CPPI0 Bridge Course Setup and Positioning",
	"CPPI1 Command Architecture, File I/O, and Small Parsers",
	"CPPI2 Recursion and the Call Stack",
	"CPPI3 STL Containers, Iterators, and Algorithms",
	"CPPI4 RAII, Smart Pointers, and Robust Error Handling",
	"CPPI5 Value Types, Operator Overloading, and Templates",
	"CPPI6 Polymorphism and Bridge to Advanced C++"
];

function requireModule(title: string) {
	const module = cppLevel3Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected C++ Level 3 module ${title}.`);
	return module;
}

describe("C++ Level 3 learner flow", () => {
	it("keeps a medium-size architecture sequence from tooling to capstone", () => {
		expect(cppLevel3Course.modules.map(module => module.title)).toEqual(
			EXPECTED_MODULE_SEQUENCE
		);
		expect(
			EXPECTED_MODULE_SEQUENCE.indexOf(
				"CPPI3 STL Containers, Iterators, and Algorithms"
			)
		).toBeLessThan(
			EXPECTED_MODULE_SEQUENCE.indexOf(
				"CPPI6 Polymorphism and Bridge to Advanced C++"
			)
		);
	});

	it("gives every module pacing, architecture targets, and explicit paths", () => {
		for (const module of cppLevel3Course.modules) {
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

	it("keeps one principal build in every module without inflating the required path", () => {
		const requiredCount = cppLevel3Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = cppLevel3Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const options = cppLevel3Course.modules.flatMap(module =>
			module.supplementalProjects.map(item => ({
				path: item.learningPath,
				title: item.title
			}))
		);

		expect(requiredCount).toBe(22);
		expect(optionCount).toBe(8);
		expect(options).toContainEqual({
			path: "challenge",
			title: "CPPI1 Project 3: Mini Command Scanner"
		});
		expect(options).toContainEqual({
			path: "challenge",
			title: "CPPI5 Project 2: Template Error Reading Drill"
		});
		expect(options).toContainEqual({
			path: "choice",
			title: "CPPI6 Project 2: Enum State versus Polymorphic State Review"
		});
	});

	it("establishes a reproducible C++20 build before medium-size work", () => {
		const setup = requireModule(
			"CPPI0 Bridge Course Setup and Positioning"
		);
		const readiness = setup.curriculum.find(
			item =>
				item.title ===
				"CPPI0 Project 0: Reproducible Build and Test Readiness"
		);

		expect(readiness?.content).toContain("-Wall -Wextra -Wpedantic");
		expect(readiness?.content).toContain(
			"configure/build/test/run path from a clean checkout"
		);
		expect(readiness?.content).toContain(
			"exits unsuccessfully when a regression is introduced"
		);
		expect(readiness?.content).toContain("./checkpoint --check");
		expect(readiness?.content).toContain("expects 180 and reports FAIL");
		expect(readiness?.content).toContain("./checkpoint-debug --trace");
		expect(setup.curriculum[0]?.contentKind).toBe("reading");
		expect(setup.curriculum[0]?.content).toContain("## Separate three kinds of failure");
	});

	it("ends with robust persistence and safe polymorphic boundaries", () => {
		const capstone = requireModule(
			"CPPI6 Polymorphism and Bridge to Advanced C++"
		);
		const contract = capstone.curriculum.find(
			item => item.title === "CPPI6 Capstone Completion Contract"
		);
		const capstoneText = capstone.curriculum
			.map(item => item.content)
			.join("\n");

		expect(capstoneText).toContain("virtual destructors");
		expect(capstoneText).toContain("object-slicing avoidance");
		expect(contract?.content).toContain(
			"Save/reload round-trip equivalence"
		);
		expect(contract?.content).toContain(
			"malformed or corrupted-file recovery"
		);
		expect(contract?.content).toContain("no object slicing");
	});
});
