import { expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import originals from "./fixtures/java-pattern-appendix-identities.json";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";
import {
	javaStudioProjectKey,
	javaPatternAppendixProjectFamily
} from "@/modules/javaStudioResources";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
it("retains all21appendix identities with Java-specific complete references and fixed cases", async () => {
	setActivePinia(createPinia());
	useAppStore().currentTutor = {
		coursePermissions: ["design-patterns-in-java"]
	} as never;
	const c = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	let count = 0,
		reading = 0,
		assignments = 0,
		projects = 0;
	for (const [title, baseline] of Object.entries(originals)) {
		const module = c.modules.find(module => module.title === title)!;
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			expect(
				module[section].map(({ id, title, aliases }) => ({
					id,
					title,
					...(aliases ? { aliases } : {})
				}))
			).toEqual(baseline[section]);
			for (const item of module[section]) {
				count++;
				expect(item.content).not.toMatch(
					/ISO C\+\+ Core Guidelines|Python Tutorial|A strong Design Patterns|Alignment test:|Inventory purpose:/
				);
				expect(item.learningPath).toBe("choice");
				const links = [
					...item.content.matchAll(
						/\[[^\]]+\]\((\/course-resource\?[^)]+)\)/g
					)
				];
				if (item.contentKind === "assignment") {
					assignments++;
					expect(links).toHaveLength(2);
				} else {
					reading++;
					expect(links).toHaveLength(0);
				}
				for (const [, href] of links) {
					const [path, anchor] = new URL(
						href,
						"https://example.invalid"
					).searchParams
						.get("asset")!
						.split("#");
					expect(
						readFileSync(resolve("public", path.slice(1)), "utf8")
					).toContain("## " + anchor + "\n");
				}
				if (item.projectLink) {
					projects++;
					expect(
						javaPatternAppendixProjectFamily[item.id]
					).toBeDefined();
					const learner = javaStudioProjectKey(
						c.id,
						item.id,
						"starter",
						item.projectLink
					);
					const reference = javaStudioProjectKey(
						c.id,
						item.id,
						"reference",
						item.solutionLink!
					);
					expect(learner).not.toBe(reference);
					expect(javaNativeBuildInstructions(learner)).not.toBeNull();
					expect(
						javaNativeBuildInstructions(reference),
						item.title + " " + reference + " " + item.solutionLink
					).not.toBeNull();
					expect(learner.split(":")[1]).not.toBe(item.id);
				}
			}
		}
	}
	expect({ count, reading, assignments, projects }).toEqual({
		count: 21,
		reading: 15,
		assignments: 6,
		projects: 5
	});
});

it("keeps reference code restricted to permitted instructors", async () => {
	setActivePinia(createPinia());
	const c = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const items = c.modules.find(
		m => m.title === "Project Practice Guide"
	)!.supplementalProjects;
	expect(items).toHaveLength(5);
	for (const item of items) {
		expect(item.projectLink).toBeDefined();
		expect(item.solutionLink).toBeUndefined();
	}
});
