import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import { goldHistoricalProjectKey } from "@/modules/usacoHistoricalPacks";
import {
	goldSpanningIntervalLegacyItemId,
	goldSpanningIntervalPacks
} from "@/modules/usacoSpanningIntervalPacks";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

describe("Gold spanning and interval source activation", () => {
	beforeEach(() => setActivePinia(createPinia()));

	it("retains observed identities and provides complete optional unit guidance", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		for (const pack of goldSpanningIntervalPacks) {
			const module = course.modules.find(
				module => module.title === pack.moduleTitle
			)!;
			const all = course.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			const matches = all.filter(item => item.id === pack.itemId);
			expect(matches).toHaveLength(1);
			const item = matches[0]!;
			expect(module.supplementalProjects).toContain(item);
			expect(module.curriculum).not.toContain(item);
			expect(item.title).toBe(pack.title);
			expect(item.learningPath).toBe(pack.learningPath);
			expect(item.ideImport).toBe(true);
			expect(item.projectLink).toBe(
				`https://github.com/instruction-material/USACO-Gold/tree/${pack.revision}/${pack.folder}/starter`
			);
			expect(item.solutionLink).toBeUndefined();
			expect(item.content).not.toContain("/solution");
			for (const detail of [
				"Contract and reasoning",
				"Guided implementation",
				"Check and explain",
				"Open, save and run",
				pack.input,
				pack.output,
				"older C++ attempts",
				"does not execute this native Java exercise",
				"JDK 17",
				"PowerShell",
				"task_course_status",
				"Protected mocks and active contests",
				"exits 2"
			])
				expect(item.content).toContain(detail);
		}
		const interval = course.modules
			.flatMap(module => module.supplementalProjects)
			.find(item => item.id === goldSpanningIntervalPacks[2].itemId)!;
		expect(interval.content).toContain("whole sequence does not collapse");
		expect(interval.content).not.toContain("Hoof Paper Scissors");
	});

	it("exposes separate pinned references only to the permitted instructor", async () => {
		useAppStore().currentTutor = {
			coursePermissions: ["usaco-gold"]
		} as never;
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		for (const pack of goldSpanningIntervalPacks) {
			const item = course.modules
				.flatMap(module => module.supplementalProjects)
				.find(item => item.id === pack.itemId)!;
			expect(item.solutionLink).toBe(
				`https://github.com/instruction-material/USACO-Gold/tree/${pack.revision}/${pack.folder}/solution`
			);
		}
	});

	it("uses distinct Java keys only for accepted role sources and guards native controls", () => {
		for (const pack of goldSpanningIntervalPacks) {
			for (const role of ["starter", "reference"] as const) {
				const base = `usaco-gold:${pack.itemId}:${role}`;
				const path = role === "reference" ? "solution" : "starter";
				const source = `https://github.com/instruction-material/USACO-Gold/tree/${pack.revision}/${pack.folder}/${path}`;
				expect(
					goldHistoricalProjectKey(
						"usaco-gold",
						pack.itemId,
						role,
						source
					)
				).toBe(`${base}:native-java`);
				expect(
					goldHistoricalProjectKey(
						"usaco-gold",
						pack.itemId,
						role,
						source.replace(pack.revision, "main")
					)
				).toBe(base);
				expect(
					goldHistoricalProjectKey(
						"usaco-gold",
						pack.itemId,
						role,
						source.replace(
							`/${path}`,
							path === "solution" ? "/starter" : "/solution"
						)
					)
				).toBe(base);
				for (const key of [base, `${base}:native-java`]) {
					const instructions = javaNativeBuildInstructions(key)!;
					expect(instructions).toContain(
						"javac --release 17 -encoding UTF-8 -Xlint:all -Werror Main.java &&"
					);
					expect(instructions).toContain("java -ea -Xmx256m Main");
					expect(instructions).toContain(pack.input);
				}
				for (const key of [
					`${base}:cpp`,
					`${base}:native-java:extra`,
					base.replace("usaco-gold:", "java:"),
					base.replace(`:${role}`, ":unknown")
				])
					expect(javaNativeBuildInstructions(key)).toBeNull();
			}
		}
		for (const pack of goldSpanningIntervalPacks)
			expect(goldSpanningIntervalLegacyItemId(pack.legacyAnchor)).toBe(
				pack.itemId
			);
		expect(
			goldSpanningIntervalLegacyItemId("usaco-gold-unknown")
		).toBeUndefined();
		expect(javaNativeBuildInstructions("java:hello:starter")).toBeNull();
	});
});
