import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { lateElementaryBMaterials } from "@/stores/courses/lateElementaryBMaterials";
import { lateElementaryMathBCourse } from "@/stores/courses/source-library-courses";

describe("Late Elementary B complete math materials", () => {
	it("preserves the sequential source topics and supplies every full reading and case", async () => {
		const course = await loadRawCourse("late-elementary-b-math");
		const modules = course!.modules.filter(
			module => module.kind !== "appendix"
		);
		expect(modules.map(module => module.title.toLowerCase())).toEqual(
			lateElementaryMathBCourse.modules.map(module =>
				module.title.toLowerCase()
			)
		);
		expect(modules).toHaveLength(20);
		const core = modules.flatMap(module => module.curriculum);
		const optional = modules.flatMap(module => module.supplementalProjects);
		expect(
			core.filter(item => item.contentKind === "reading")
		).toHaveLength(20);
		expect(
			core.filter(item => item.contentKind === "assignment")
		).toHaveLength(26);
		expect(optional).toHaveLength(40);
		for (const material of lateElementaryBMaterials) {
			expect(
				core.some(item => item.content.includes(material.method))
			).toBe(true);
			expect(
				core.some(item => item.content.includes(material.worked))
			).toBe(true);
			for (const task of material.tasks)
				expect(
					core.find(item => item.title === task.title)?.content
				).toContain(task.prompt);
			expect(
				optional.some(item =>
					item.content.includes(material.practice.prompt)
				)
			).toBe(true);
			expect(
				optional.some(item =>
					item.content.includes(material.challenge.prompt)
				)
			).toBe(true);
		}
		const tasks = [
			...core.filter(item => item.contentKind === "assignment"),
			...optional
		];
		for (const item of tasks) {
			expect(item.preserveInstructions).toBe(true);
			expect(item.preserveAssignment).toBe(true);
			expect(item.content).toContain("Project self-check");
			expect(item.content).not.toContain("Break a typical problem");
		}
	});
	it("restores all ten merged tasks while retaining distinct readings", async () => {
		const course = await loadRawCourse("late-elementary-b-math");
		for (const [code, count] of [
			["LEB6 ", 2],
			["LEB10 ", 3],
			["LEB12 ", 2],
			["LEB18 ", 3]
		] as const) {
			const module = course!.modules.find(module =>
				module.title.startsWith(code)
			)!;
			expect(module.curriculum).toHaveLength(count + 1);
			expect(module.curriculum[0].contentKind).toBe("reading");
			expect(
				module.curriculum
					.slice(1)
					.every(item => item.contentKind === "assignment")
			).toBe(true);
		}
	});
	it("supplies discrete growth assumptions and the interactive orbit experiment", async () => {
		const course = await loadRawCourse("late-elementary-b-math");
		const growth = course!.modules.find(module =>
			module.title.startsWith("LEB17 ")
		)!;
		expect(growth.curriculum[1].content).toContain("exactly eight weeks");
		expect(growth.curriculum[1].content).toContain("Bracket it");
		const orbit = course!.modules.find(module =>
			module.title.startsWith("LEB18 ")
		)!;
		expect(orbit.curriculum[2].content).toContain(
			"[Tesla-Retriever experiment](/tesla-retriever)"
		);
		expect(orbit.curriculum[2].content).toContain("60150 mph");
		expect(orbit.curriculum[2].content).toContain("150-mph increments");
		expect(orbit.curriculum[2].content).toContain("observed result");
		expect(orbit.curriculum[0].content).toContain(
			"fictional course constant"
		);
	});
});
