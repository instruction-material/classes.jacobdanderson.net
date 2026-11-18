import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import published from "../../test/fixtures/catalog-published-identities.json";
import restored from "../../test/fixtures/money-minded-restored-identities.json";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useCoursesStore } from "@/stores/courses";
import materials from "@/stores/courses/moneyMindedMaterials.json";
import { moneyMindedInvestingCourse } from "@/stores/courses/source-library-courses";

describe("complete Money-Minded teaching and activities", () => {
	it("retains progress identities and restores four separately assigned projects", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById(
			"money-minded-investing"
		))!;
		const identities = course.modules.flatMap(module =>
			(
				[
					["core", module.curriculum],
					["optional", module.supplementalProjects]
				] as const
			).flatMap(([section, items]) =>
				items.map(item => ({
					moduleId: module.id,
					id: item.id,
					section
				}))
			)
		);
		expect(identities).toHaveLength(57);
		for (const added of restored) {
			expect(identities.filter(item => item.id === added.id)).toEqual([
				added
			]);
			expect(
				course.modules.some(module =>
					module.curriculum.some(
						item =>
							item.contentKind === "reading" &&
							item.aliases?.includes(added.id)
					)
				)
			).toBe(false);
		}
		const original = identities.filter(
			item => !restored.some(added => added.id === item.id)
		);
		expect(
			createHash("sha256").update(JSON.stringify(original)).digest("hex")
		).toBe(published[course.id as keyof typeof published].sha256);
	});

	it("teaches the methods and supplies every original and optional activity with a local check", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById(
			"money-minded-investing"
		))!;
		const checks = readFileSync(
			"public/course-assets/money-minded/exercise-checks-v1.md",
			"utf8"
		);
		const modules = course.modules.filter(module => !module.internal);
		expect(modules).toHaveLength(11);
		expect(
			modules
				.flatMap(module => module.curriculum)
				.filter(isLessonLearningItem)
		).toHaveLength(11);
		expect(
			modules
				.flatMap(module => module.curriculum)
				.filter(item => !isLessonLearningItem(item))
		).toHaveLength(16);
		expect(
			modules.flatMap(module => module.supplementalProjects)
		).toHaveLength(29);
		for (const [index, module] of modules.entries()) {
			const source = moneyMindedInvestingCourse.modules[index];
			expect(module.curriculum.slice(1).map(item => item.title)).toEqual(
				source.curriculum.slice(1).map(item => item.title)
			);
			expect(module.curriculum[0].content).not.toMatch(
				/Key terms to watch|passage detail|grammar rule|draft choice|Define the important terms/
			);
			expect(
				module.curriculum[0].content.split(/\s+/).length
			).toBeGreaterThan(200);
			for (const task of [
				...module.curriculum.slice(1),
				...module.supplementalProjects
			]) {
				expect(task.contentKind, task.title).toBe("assignment");
				expect(isLessonLearningItem(task), task.title).toBe(false);
				const original = [
					...source.curriculum,
					...source.supplementalProjects
				].find(item => item.title === task.title)!;
				expect(task.learningPath, task.title).toBe(
					original.learningPath
				);
				const body = materials[index].tasks.find(
					item => item.title === task.title
				)!;
				expect(body, task.title).toBeDefined();
				expect(task.content, task.title).toContain(
					"[Project self-check](/course-resource?asset="
				);
				const href = task.content.match(
					/\[Project self-check\]\(([^)]+)\)/
				)![1];
				expect(
					new URL(href, "https://example.invalid").searchParams.get(
						"asset"
					),
					task.title
				).toContain(`#${body.anchor}`);
				expect(checks, task.title).toContain(`## ${task.title}\n\n`);
			}
		}
		expect(checks.match(/^## /gm)).toHaveLength(45);
	});

	it("keeps the crucial model assumptions and units visible", () => {
		const text = materials.map(unit => unit.reading).join("\n");
		expect(text).toContain("sample standard deviation");
		expect(text).toContain("n − 1");
		expect(text).toContain("next balance = current balance × 1.05 + 1,000");
		expect(text).toContain("not Bitcoin history");
		expect(text).toContain("40% C1, 30% C2, 30% C3");
		expect(text).toContain("fixed $5 total");
		expect(text).toContain("FY-C");
		expect(text).toContain("$86,350");
		expect(text).toContain("$106,450");
	});
});
