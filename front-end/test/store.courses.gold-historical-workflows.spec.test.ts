import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	goldHistoricalAssignment,
	goldHistoricalAssignments,
	goldHistoricalProjectKey
} from "@/modules/usacoHistoricalPacks";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

describe("historical Gold assignment migration", () => {
	beforeEach(() => setActivePinia(createPinia()));

	it("keeps eighteen lesson identities and distinct optional learning purposes", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const appendix = course.modules.find(module =>
			module.title.includes("Historical and Applied Gold Studios")
		)!;
		expect(goldHistoricalAssignments).toHaveLength(18);
		const items = course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		for (const definition of goldHistoricalAssignments) {
			const assignment = goldHistoricalAssignment(definition.id)!;
			const matches = items.filter(item => item.id === definition.id);
			expect(matches).toHaveLength(1);
			const item = matches[0]!;
			expect(appendix.supplementalProjects).toContain(item);
			expect(item.title).toBe(definition.title);
			expect(item.ideImport).toBe(true);
			expect(item.learningPath).toBe(
				definition.variant === "first" ? "choice" : "challenge"
			);
			expect(item.projectLink).toBe(
				`https://github.com/instruction-material/USACO-Gold/tree/${assignment.pack.revision}/${assignment.pack.folder}/starter`
			);
			expect(item.solutionLink).toBeUndefined();
			expect(item.content).not.toContain("/solution");
			for (const detail of [
				assignment.pack.input,
				assignment.pack.output,
				"JDK 17",
				"does not execute this native Java exercise",
				"older C++ attempts",
				"Protected mocks and active contests"
			])
				expect(item.content).toContain(detail);
			if (["model", "extension"].includes(definition.variant)) {
				expect(item.content).toContain("reuse its solver");
				expect(item.content).toContain(
					definition.variant === "model" ? "Verifier.java" : "After"
				);
			}
			if (definition.variant === "model") {
				expect(item.content).toContain("Main.java Verifier.java");
				expect(item.content).toContain("java -ea -Xmx256m Verifier");
				expect(item.content).toContain("ProcessBuilder");
			}
			if (definition.variant === "retry") {
				expect(item.content).toContain("at least two days");
				expect(item.content).toContain("different data");
			}
		}
		expect(items.some(item => item.projectLink?.includes("applied-studio-"))).toBe(false);
		const cow = items.find(item => item.id.endsWith("core-project-cow-routing"))!;
		const water = items.find(item => item.id.endsWith("core-project-watering-the-fields"))!;
		const walk = items.find(item => item.id.endsWith("i-would-walk-500-miles-extension-practice"))!;
		const talent = items.find(item => item.id.endsWith("core-project-talent-show"))!;
		expect(cow.content).toContain("January 2015 Silver");
		expect(water.content).toContain("March 2014 Silver");
		expect(walk.content).toContain("dense Prim implementation first");
		expect(walk.content).toContain("P-48*N-84*(K-1)");
		expect(talent.content).toContain("26706");
		expect(talent.content).toContain("1066");
		expect(talent.content).toContain("disposable reference working copy");
	});

	it("uses new Java keys only for the exact accepted role URLs", () => {
		for (const definition of goldHistoricalAssignments) {
			const { pack } = goldHistoricalAssignment(definition.id)!;
			for (const role of ["starter", "reference"] as const) {
				const base = `usaco-gold:${definition.id}:${role}`;
				const source = `https://github.com/instruction-material/USACO-Gold/tree/${pack.revision}/${pack.folder}/${role === "reference" ? "solution" : "starter"}`;
				const key = goldHistoricalProjectKey("usaco-gold", definition.id, role, source);
				expect(key).toBe(`${base}:native-java`);
				expect(key.length).toBeLessThanOrEqual(240);
				expect(javaNativeBuildInstructions(key)).not.toBeNull();
				expect(javaNativeBuildInstructions(base)).not.toBeNull();
				for (const wrong of [
					source.replace(pack.revision, "main"),
					source.replace("instruction-material", "other-owner"),
					source.replace(pack.folder, "UG-01-applied-studio-13-cow-routing-supplemental-2")
				])
					expect(goldHistoricalProjectKey("usaco-gold", definition.id, role, wrong)).toBe(base);
				for (const wrong of [
					`${key}:extra`, `${base}:cpp`, `${base}:`,
					key.replace("usaco-gold:", "usaco-silver:"),
					key.replace(`:${role}:`, ":solution:")
				])
					expect(javaNativeBuildInstructions(wrong)).toBeNull();
			}
		}
		expect(javaNativeBuildInstructions("usaco-gold:unknown:starter:native-java")).toBeNull();
	});

	it("exposes separate pinned references only in the instructor view", async () => {
		useAppStore().currentTutor = {
			_id: "historical-tutor", name: "Instructor", email: "instructor@example.invalid",
			age: 30, state: "GA", coursePermissions: ["usaco-gold"], usersOfTutorLength: 0
		};
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const items = course.modules.flatMap(module => [...module.curriculum, ...module.supplementalProjects]);
		for (const definition of goldHistoricalAssignments) {
			const { pack } = goldHistoricalAssignment(definition.id)!;
			const item = items.find(item => item.id === definition.id)!;
			expect(item.solutionLink).toBe(`https://github.com/instruction-material/USACO-Gold/tree/${pack.revision}/${pack.folder}/solution`);
		}
	});
});
