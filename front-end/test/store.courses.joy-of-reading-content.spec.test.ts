import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { earlyElementaryJoyOfReadingCourse } from "@/stores/courses/source-library-courses";
import { joyOfReadingGuidance } from "@/stores/courses/joyOfReadingGuidance";

describe("Joy of Reading on-site explanations and practice", () => {
	it("preserves the source sequence and supplies eight worked explanations", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		const modules = course!.modules.filter(
			module => module.kind !== "appendix"
		);
		expect(modules.map(module => module.title)).toEqual(
			joyOfReadingGuidance.map(unit => unit.module)
		);
		for (const material of joyOfReadingGuidance) {
			const module = modules.find(
				module => module.title === material.module
			)!;
			expect(module.curriculum[0].contentKind).toBe("reading");
			expect(module.curriculum[0].content).toContain(material.method);
			expect(module.curriculum[0].content).toContain(material.worked);
			for (const kind of ["practice", "challenge"] as const)
				expect(
					module.supplementalProjects.some(item =>
						item.content.includes(material[kind].prompt)
					)
				).toBe(true);
		}
	});
	it("restores both character assignments while preserving the reading identity", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		const module = course!.modules.find(
			module => module.title === "JoR1 Characters"
		)!;
		expect(module.curriculum.map(item => item.title)).toEqual([
			"Characters Core Concepts",
			"Character Investigator Report",
			"Character Inference Report"
		]);
		expect(
			module.curriculum
				.slice(1)
				.every(
					item =>
						item.contentKind === "assignment" &&
						item.preserveAssignment &&
						item.preserveInstructions
				)
		).toBe(true);
	});
	it("requires a finished chosen capstone response and retains both original options", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		const module = course!.modules.find(
			module => module.title === "JoR6 Master Project"
		)!;
		expect(module.curriculum[1].content).toContain(
			"Complete the selected response and document one revision."
		);
		const originalTitles = [
			"Bacon and Mittens Review or Figurative Art",
			"Dinosaur Footprint Interview or News Report"
		];
		const choices = module.supplementalProjects.filter(item =>
			originalTitles.some(
				title => item.title === title || item.aliases?.includes(title)
			)
		);
		expect(choices).toHaveLength(2);
		for (const title of [
			"Practice Map: Master Project",
			"Extension Review: Master Project"
		]) {
			expect(
				module.supplementalProjects.find(item => item.title === title)
					?.internal,
				title
			).toBe(true);
		}
		expect(
			choices.every(
				item =>
					item.learningPath === "choice" &&
					item.contentKind === "assignment"
			)
		).toBe(true);
	});
	it("provides sentence context without forcing an unsupported personification label", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		const module = course!.modules.find(
			module => module.title === "JoR5 Figurative Language"
		)!;
		expect(module.curriculum[0].content).toContain(
			"Categories can overlap"
		);
		expect(module.curriculum[1].content).toContain(
			"The wind whispered a secret"
		);
		expect(module.curriculum[1].content).toContain(
			"strong motion alone does not establish human behavior"
		);
		expect(module.curriculum[1].content).toContain("Project self-check");
	});
	it("gives all ten text-dependent tasks a complete supplied passage", async () => {
		const course = (await loadRawCourse("early-elementary-a-reading"))!;
		const visible = course.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.filter(item => !item.internal);
		const cases = [
			["Character Investigator Report", "Eli’s boots were yellow"],
			["Sweet Sixteen Character Evidence", "Mara ran toward the gate"],
			[
				"Faithful Friend Plot Diagram",
				"A class needs a sign for its garden"
			],
			[
				"Happy Halloween Plot and Character Check",
				"Tavi’s group has to move a stack of books"
			],
			[
				"Groceries Storyboard",
				"Pia promises a banner for the class play"
			],
			[
				"Megalodon News Report",
				"Brook Library team added four low shelves"
			],
			["Kevin's Crafts Story Review", "Mina says her first drawing"],
			["Lab-Grown Meat Main Idea Report", "A school tried two labels"],
			[
				"Bacon and Mittens Review or Figurative Art",
				"Omi wants a display that can travel"
			],
			[
				"Dinosaur Footprint Interview or News Report",
				"Pine School club placed six new route signs"
			]
		];
		for (const [originalTitle, passage] of cases) {
			const matches = visible.filter(
				item =>
					item.title === originalTitle ||
					item.aliases?.includes(originalTitle)
			);
			expect(matches, originalTitle).toHaveLength(1);
			expect(matches[0].content, originalTitle).toContain(passage);
			expect(matches[0].content, originalTitle).toContain(
				"Project self-check"
			);
			expect(matches[0].contentKind).toBe("assignment");
		}
	});
	it("uses supplied complete text while retaining original Juni task records", async () => {
		const course = (await loadRawCourse("early-elementary-a-reading"))!;
		const original = JSON.stringify(earlyElementaryJoyOfReadingCourse);
		expect(original).toContain("The Secret Ingredient");
		expect(original).toContain("Moira, Sunli, and Zaira");
		const first = course.modules.find(
			module => module.title === "JoR1 Characters"
		)!;
		expect(first.curriculum[1].content).toContain(
			"Eli’s boots were yellow"
		);
		expect(first.curriculum[2].content).toContain(
			"Mara ran toward the gate"
		);
		expect(first.curriculum[2].aliases).toContain(
			"Sweet Sixteen Character Evidence"
		);
		expect(first.curriculum[2].content).toContain("Compare Mara with Eli");
		const visible = course.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.filter(item => !item.internal);
		expect(visible.map(item => item.content).join("\n")).not.toMatch(
			/require a separate copy|Read The Secret Ingredient|Read Sweet Sixteen/
		);
	});
});
