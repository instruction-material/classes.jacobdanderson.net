import { describe, expect, it } from "vitest";
import { cSystemsEngineeringCourse } from "@/stores/courses/c-systems-engineering";

const EXPECTED_PRIMARY_SEQUENCE = [
	"CSE0 Setup and Tooling",
	"Unit 1: Why C for Systems Work",
	"Unit 2: Binary, Hex, and Number Representation",
	"Unit 3: Bitwise Operations",
	"Unit 4: Memory and Layout",
	"Unit 5: Strings and Byte Buffers",
	"Unit 6: Files, Streams, and Parsing",
	"Unit 7: Dynamic Memory and Lifetime",
	"Unit 8: Function Pointers and Dispatch",
	"Unit 9: Data Structures in C",
	"Unit 10: Engineering Math in Code",
	"Unit 11: Systems Tooling",
	"Unit 12: Capstone Engineering Utility"
];

function requireModule(title: string) {
	const module = cSystemsEngineeringCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected C Systems module ${title}.`);
	return module;
}

describe("C Systems Engineering learner flow", () => {
	it("keeps thirteen distinct units and one optional systems archive", () => {
		expect(
			cSystemsEngineeringCourse.modules
				.slice(0, 13)
				.map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(cSystemsEngineeringCourse.modules).toHaveLength(14);
		expect(cSystemsEngineeringCourse.modules[13]).toMatchObject({
			kind: "appendix",
			title: "Optional Systems Build and Transfer Archive"
		});
	});

	it("gives every primary unit pacing, systems targets, and explicit paths", () => {
		for (const module of cSystemsEngineeringCourse.modules.slice(0, 13)) {
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

	it("moves repetitive studios and secondary builds out of the required path", () => {
		const archive = requireModule(
			"Optional Systems Build and Transfer Archive"
		);
		const curriculumCount = cSystemsEngineeringCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = cSystemsEngineeringCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const options = cSystemsEngineeringCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => ({
				path: item.learningPath,
				title: item.title
			}))
		);

		expect(curriculumCount).toBe(59);
		expect(optionCount).toBe(70);
		expect(archive.supplementalProjects).toHaveLength(28);
		expect(options).toContainEqual({
			path: "choice",
			title: "Project: Hex and Binary Inspector"
		});
		expect(options).toContainEqual({
			path: "challenge",
			title: "Project: XOR Encoder Decoder"
		});
		expect(options).toContainEqual({
			path: "challenge",
			title: "Project: Fixed Size Log File Reader"
		});
	});

	it("activates warnings and memory diagnostics before unsafe buffers", () => {
		const setup = requireModule("CSE0 Setup and Tooling");
		const buffers = requireModule("Unit 5: Strings and Byte Buffers");
		const dynamicMemory = requireModule(
			"Unit 7: Dynamic Memory and Lifetime"
		);
		const readiness = setup.curriculum.find(
			item =>
				item.title === "CSE0 Project 0: C17 Safety Toolchain Readiness"
		);

		expect(readiness?.content).toContain("-Wall -Wextra -Wpedantic");
		expect(readiness?.content).toContain(
			"AddressSanitizer/UndefinedBehaviorSanitizer"
		);
		expect(buffers.curriculum[0]?.content).toContain(
			"one-byte-short, embedded-zero, nonterminated"
		);
		expect(dynamicMemory.curriculum[0]?.content).toContain(
			"Preserve the original pointer when `realloc` fails"
		);
		expect(dynamicMemory.curriculum[0]?.content).toContain(
			"allocation-failure"
		);
	});

	it("ends with atomic parsing, bounded arithmetic, and failure-safe output", () => {
		const parsing = requireModule("Unit 6: Files, Streams, and Parsing");
		const math = requireModule("Unit 10: Engineering Math in Code");
		const capstone = requireModule("Unit 12: Capstone Engineering Utility");
		const contract = capstone.curriculum.find(
			item => item.title === "CSE12 Capstone Completion Contract"
		);

		expect(parsing.curriculum[0]?.content).toContain(
			"truncation at every field boundary"
		);
		expect(math.curriculum[0]?.content).toContain(
			"Check for overflow before signed operations"
		);
		expect(contract?.content).toContain(
			"Previous trusted output remains intact"
		);
		expect(contract?.content).toContain(
			"Warning-clean and sanitizer-clean results"
		);
	});
});
