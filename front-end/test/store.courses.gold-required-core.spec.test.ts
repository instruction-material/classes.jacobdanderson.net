import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { goldHistoricalProjectKey } from "@/modules/usacoHistoricalPacks";
import { goldRequiredCorePacks } from "@/modules/usacoRequiredCorePacks";
import { usacoGoldCourse } from "@/stores/courses/usaco-gold";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

describe("required Gold projects and changed-case retries", () => {
	beforeEach(() => setActivePinia(createPinia()));

	it("retains six existing identities, required placements and distinct retry tasks", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		expect(usacoGoldCourse.modules).toHaveLength(11);
		expect(
			usacoGoldCourse.modules.flatMap(module => module.curriculum)
		).toHaveLength(61);
		expect(
			usacoGoldCourse.modules.flatMap(
				module => module.supplementalProjects
			)
		).toHaveLength(96);
		for (const pack of goldRequiredCorePacks)
			for (const assignment of pack.assignments) {
				const module = course.modules.find(
					module => module.id === assignment.moduleId
				)!;
				const item = module[assignment.section].find(
					item => item.id === assignment.itemId
				)!;
				expect(item.title).toBe(assignment.title);
				expect(item.learningPath).toBe(assignment.learningPath);
				expect(item.ideImport).toBe(true);
				expect(item.solutionLink).toBeUndefined();
				expect(item.content).not.toContain("/solution");
				expect(item.projectLink).toBe(
					`https://github.com/instruction-material/USACO-Gold/tree/${pack.revision}/${pack.folder}/starter`
				);
				for (const detail of [
					"Contract and reasoning",
					"Guided implementation",
					"Check and explain",
					"Open, save and run",
					pack.input,
					pack.output,
					"exits 2",
					"Protected mocks and active contests",
					"PowerShell",
					"does not execute this native Java exercise"
				])
					expect(item.content).toContain(detail);
				if (assignment.variant === "retry") {
					expect(item.content).toContain(pack.retry);
					expect(item.content).toContain(
						"Repeating the original sample does not complete this retry"
					);
				} else
					expect(item.content).toContain(
						"Required implementation checkpoint"
					);
			}
	});

	it("withholds references from learners and retains instructor access", async () => {
		const app = useAppStore();
		for (const instructor of [false, true]) {
			app.currentTutor = instructor ? ({} as never) : null;
			const course =
				(await useCoursesStore().loadCourseById("usaco-gold"))!;
			for (const pack of goldRequiredCorePacks)
				for (const assignment of pack.assignments) {
					const item = course.modules
						.flatMap(module => [
							...module.curriculum,
							...module.supplementalProjects
						])
						.find(item => item.id === assignment.itemId)!;
					if (instructor)
						expect(item.solutionLink).toBe(
							`https://github.com/instruction-material/USACO-Gold/tree/${pack.revision}/${pack.folder}/solution`
						);
					else expect(item.solutionLink).toBeUndefined();
				}
		}
	});

	it("isolates native keys and refuses lookalike course, role and source bindings", () => {
		for (const pack of goldRequiredCorePacks)
			for (const assignment of pack.assignments)
				for (const role of ["starter", "reference"] as const) {
					const base = `usaco-gold:${assignment.itemId}:${role}`;
					const path = role === "reference" ? "solution" : "starter";
					const source = `https://github.com/instruction-material/USACO-Gold/tree/${pack.revision}/${pack.folder}/${path}`;
					expect(
						goldHistoricalProjectKey(
							"usaco-gold",
							assignment.itemId,
							role,
							source
						)
					).toBe(base + ":native-java");
					expect(
						goldHistoricalProjectKey(
							"usaco-gold",
							assignment.itemId,
							role,
							source.replace(pack.revision, "main")
						)
					).toBe(base);
					expect(
						goldHistoricalProjectKey(
							"usaco-gold",
							assignment.itemId,
							role,
							source.replace(
								`/${path}`,
								path === "solution" ? "/starter" : "/solution"
							)
						)
					).toBe(base);
					expect(
						pythonIdeModeForCourseResource("usaco-gold", source)
					).toBe("java");
					for (const key of [base, base + ":native-java"]) {
						const lines = javaNativeBuildInstructions(key)!;
						expect(Array.isArray(lines)).toBe(true);
						expect(lines.every(line => line.length > 1)).toBe(true);
						expect(lines.join("\n")).toContain(
							"javac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java &&"
						);
						expect(lines.join("\n")).toContain(pack.input);
					}
					for (const key of [
						base + ":cpp",
						base + ":native-java:extra",
						base.replace("usaco-gold:", "java:"),
						base.replace(`:${role}`, ":unknown")
					])
						expect(javaNativeBuildInstructions(key)).toBeNull();
				}
		expect(
			javaNativeBuildInstructions("java-level-1:ordinary:starter")
		).toBeNull();
	});
});
