import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import MarkdownIt from "markdown-it";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import {
	silverFoundationAssignment,
	silverFoundationPacks
} from "@/modules/usacoSilverFoundationPacks";
import { silverJavaProjectKey } from "@/modules/usacoSilverJavaPacks";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

// These identities predate the revised titles and must retain saved progress.
const prior = [
	{
		module: "usaco-silver-unit-1-maps-sets-and-problem-modeling",
		core: "usaco-silver-unit-1-maps-sets-and-problem-modeling-curriculum-core-project-data-structures-and-problem-modeling",
		retry: "usaco-silver-unit-1-maps-sets-and-problem-modeling-supplemental-problem-exam-and-bankaccount-classes",
		entry: "Main",
		input: null,
		output: "answer.txt"
	},
	{
		module: "usaco-silver-unit-2-dfs-bfs-flood-fill-trees-and-functional-graphs",
		core: "usaco-silver-unit-2-dfs-bfs-flood-fill-trees-and-functional-graphs-curriculum-core-project-dfs-bfs-and-graph-traversal",
		retry: "usaco-silver-unit-2-dfs-bfs-flood-fill-trees-and-functional-graphs-supplemental-problem-mothers-milk",
		entry: "milk3",
		input: "milk3.in",
		output: "milk3.out"
	},
	{
		module: "usaco-silver-unit-3-sorting-two-pointers-compression-and-binary-search",
		core: "usaco-silver-unit-3-sorting-two-pointers-compression-and-binary-search-curriculum-core-project-sorting-searching-and-binary-search",
		retry: "usaco-silver-unit-3-sorting-two-pointers-compression-and-binary-search-supplemental-problem-prime-palindromes",
		entry: "pprime",
		input: "pprime.in",
		output: "pprime.out"
	}
] as const;
const revision = "8891c9ffbb61f101edb01d18cfbcba75905de141";

describe("Silver foundation native imports", () => {
	beforeEach(() => setActivePinia(createPinia()));
	it.each([false, true])(
		"preserves progress, placements and reference access for tutor=%s",
		async tutor => {
			useAppStore().currentTutor = tutor
				? ({ coursePermissions: ["usaco-silver"] } as never)
				: null;
			const course =
				(await useCoursesStore().loadCourseById("usaco-silver"))!;
			expect(course.modules).toHaveLength(12);
			expect(
				course.modules.flatMap(module => module.curriculum)
			).toHaveLength(42);
			expect(
				course.modules.flatMap(module => module.supplementalProjects)
			).toHaveLength(106);
			for (const identity of prior) {
				const module = course.modules.find(
					module => module.id === identity.module
				)!;
				for (const [id, section, path] of [
					[identity.core, "curriculum", "core"],
					[identity.retry, "supplementalProjects", "choice"]
				] as const) {
					const item = module[section].find(item => item.id === id)!;
					expect(item).toBeDefined();
					expect(item.learningPath).toBe(path);
					expect(item.ideImport).toBe(true);
					expect(item.projectLink).toContain(`/tree/${revision}/`);
					if (tutor)
						expect(item.solutionLink).toBe(
							item.projectLink!.replace(/\/starter$/, "/solution")
						);
					else {
						expect(item.solutionLink).toBeUndefined();
						expect(item.content).not.toContain("/solution");
					}
					const html = new MarkdownIt().render(item.content!);
					for (const heading of [
						"Contract and reasoning",
						"Guided implementation",
						"Check and explain",
						"Unit completion requirements",
						"Open, save and run"
					])
						expect(html).toContain(`<h2>${heading}</h2>`);
					expect(html).toContain('class="language-sh"');
					for (const detail of [
						`entry class ${identity.entry}`,
						identity.output,
						"sample.expected",
						"exits 2",
						"preserves an earlier answer",
						"separately from an earlier C++ attempt"
					])
						expect(item.content).toContain(detail);
					if (identity.input)
						expect(item.content).toContain(identity.input);
					else
						expect(item.content).toContain(
							"reads no input file or standard input"
						);
					if (path === "core")
						expect(item.content).toContain(
							"Required implementation checkpoint"
						);
					else {
						expect(item.content).not.toContain(
							"Required implementation checkpoint"
						);
						expect(item.content).toContain(
							"Optional changed-case reconstruction"
						);
						expect(item.content).toContain(
							"Repeating the original sample does not complete"
						);
					}
				}
			}
		}
	);
	it("covers the actual contracts and explains the wider unit work", () => {
		const [records, milk, prime] = silverFoundationPacks;
		expect(records.contract).toContain(
			"Integer.MIN_VALUE and Integer.MAX_VALUE"
		);
		expect(records.tasks).toContain("compareBankAccounts");
		expect(records.requirements).toContain("equals and hashCode");
		expect(records.requirements).toContain("frequency map");
		expect(milk.contract).toContain("1..20");
		expect(milk.tasks).toContain("all six ordered pours");
		expect(milk.prediction).toContain("12 different states");
		expect(milk.retry).toContain("1 2 3 4 5 6 7");
		expect(milk.requirements).toContain(
			"BFS minimum edge count on unweighted graphs"
		);
		expect(prime.contract).toContain("5 <= lower <= upper <= 100000000");
		expect(prime.contract).toContain("empty output file");
		expect(prime.tasks).toContain("11110");
		expect(prime.retry).toContain("11,33,55,77,99");
		expect(prime.requirements).toContain("[2,0,2,1]");
		expect(prime.requirements).toContain(
			"Primality over consecutive integers is not monotone"
		);
	});
	it("keeps old attempts and isolates native Java only for the exact pinned source", () => {
		for (const pack of silverFoundationPacks)
			for (const assignment of pack.assignments) {
				expect(
					silverFoundationAssignment(assignment.itemId)?.pack
				).toBe(pack);
				for (const role of ["starter", "reference"] as const) {
					const base = `usaco-silver:${assignment.itemId}:${role}`;
					const source = `https://github.com/instruction-material/USACO-Silver/tree/${revision}/${pack.folder}/${role === "starter" ? "starter" : "solution"}`;
					expect(
						silverJavaProjectKey(
							"usaco-silver",
							assignment.itemId,
							role,
							source
						)
					).toBe(`${base}:native-java`);
					for (const other of [
						source.replace(revision, "main"),
						source + "/extra",
						source.replace("github.com", "example.com")
					])
						expect(
							silverJavaProjectKey(
								"usaco-silver",
								assignment.itemId,
								role,
								other
							)
						).toBe(base);
					expect(
						pythonIdeModeForCourseResource("usaco-silver", source)
					).toBe("java");
					for (const key of [base, `${base}:native-java`]) {
						const instructions =
							javaNativeBuildInstructions(key)!.join("\n");
						expect(instructions).toContain(pack.guard);
						expect(instructions).toContain(
							`entry class ${pack.entryClass}`
						);
					}
					for (const key of [
						`${base}:other`,
						`${base}:native-java:extra`,
						base.replace("usaco-silver:", "usaco-gold:"),
						base.replace(/:(starter|reference)$/, ":unknown")
					])
						expect(javaNativeBuildInstructions(key)).toBeNull();
				}
			}
		expect(
			javaNativeBuildInstructions(
				"usaco-silver:unknown:starter:native-java"
			)
		).toBeNull();
		expect(silverFoundationAssignment("unknown")).toBeUndefined();
	});
});
