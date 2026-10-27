import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";

const baseline = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/catalog-published-identities.json"
		),
		"utf8"
	)
) as Record<string, { items: number; sha256: string }>;

const publishedAPModuleOrder = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/ap-csa-published-module-order.json"
		),
		"utf8"
	)
) as { moduleIds: string[] };

it("preserves published assignment identities across the complete catalog", async () => {
	const output = process.env.COURSE_CATALOG_PROOF_DIR;
	if (output) mkdirSync(output, { recursive: true });
	const results: { id: string; items: number; learnerSafe: boolean }[] = [];
	for (const [id, identities] of Object.entries(baseline)) {
		expect(
			courseCatalog.some(course => course.id === id),
			id
		).toBe(true);
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "catalog-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: [id],
			editTutors: false,
			saveEdit: "Save"
		});
		const staff = (await useCoursesStore().loadCourseById(id))!;
		expect(staff, id).not.toBeNull();
		const actual = staff.modules.flatMap(module =>
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
		expect(actual.length, id).toBe(identities.items);
		// AP's authored progression replaces the stale display order. Reconstruct
		// only its published module order to verify every original identity and
		// section; the AP flow regression separately checks the corrected order.
		const publishedIdentities =
			id === "ap-computer-science-a"
				? publishedAPModuleOrder.moduleIds.flatMap(moduleId =>
						actual.filter(item => item.moduleId === moduleId)
					)
				: actual;
		expect(publishedIdentities.length, id).toBe(actual.length);
		expect(
			createHash("sha256")
				.update(JSON.stringify(publishedIdentities))
				.digest("hex"),
			id
		).toBe(identities.sha256);
		app.setCurrentTutor(null);
		app.setCurrentUser({
			_id: "catalog-learner",
			name: "Learner",
			email: "learner@example.invalid",
			age: 14,
			state: "GA",
			courseAccess: [id],
			editUsers: false,
			saveEdit: "Save"
		});
		const learner = (await useCoursesStore().loadCourseById(id))!;
		expect(learner, id).not.toBeNull();
		const learnerItems = learner.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(
			learnerItems.every(item => !item.solutionLink),
			id
		).toBe(true);
		results.push({ id, items: actual.length, learnerSafe: true });
		if (output)
			writeFileSync(
				resolve(output, `${id}.json`),
				JSON.stringify({ id, staff, learner }, null, 2) + "\n"
			);
	}
	expect(results).toHaveLength(77);
	if (output)
		writeFileSync(
			resolve(output, "catalog-proof.json"),
			JSON.stringify(
				{
					courses: results,
					scope: "Actual normalized staff and learner catalog; published assignment identities and hidden learner reference fields. Content completeness, source accuracy and runtime behavior require separate checks."
				},
				null,
				2
			) + "\n"
		);
}, 180000);
