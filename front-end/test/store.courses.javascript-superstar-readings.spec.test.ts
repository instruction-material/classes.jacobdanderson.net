import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import maintenance from "../../test/fixtures/javascript-superstar-maintenance-identities.json";
import fixture from "../../test/fixtures/javascript-superstar-worked-reading-cases.json";

const id = "javascript-level-1-javascript-superstar";

describe("complete JavaScript Superstar readings", () => {
	it.each(["learner", "instructor"])(
		"retains full explanations and historical identities for %s",
		async role => {
			setActivePinia(createPinia());
			const app = useAppStore();
			app.setCurrentUser({
				_id: "reading-learner",
				name: "Learner",
				email: "learner@example.invalid",
				age: 14,
				state: "GA",
				courseAccess: [id],
				editUsers: false,
				saveEdit: "Save"
			});
			if (role === "instructor")
				app.setCurrentTutor({
					_id: "reading-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: [id],
					editTutors: false,
					saveEdit: "Save"
				});
			const course = await useCoursesStore().loadCourseById(id);
			expect(course).toBeDefined();
			const all = course!.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			expect(all).toHaveLength(157);
			for (const row of fixture.cases) {
				const module = course!.modules.find(
					candidate => candidate.id === row.moduleId
				);
				const item = [
					...(module?.curriculum ?? []),
					...(module?.supplementalProjects ?? [])
				].find(candidate => candidate.title === row.title);
				const bytes = fs.readFileSync(
					path.resolve(
						__dirname,
						"../src/stores/courses/readings/javascript-superstar",
						row.file
					)
				);
				expect(
					createHash("sha256").update(bytes).digest("hex"),
					row.title
				).toBe(row.sourceSHA256);
				expect(item?.content, row.title).toBe(bytes.toString().trim());
				expect(item?.contentKind, row.title).toBe(
					row.view === 3 ? "reading" : "assignment"
				);
				if (row.view === 2) {
					expect(item?.projectLink, row.title).toMatch(/^https:\/\//);
					expect(item?.datasetLink, row.title).toBeUndefined();
					expect(item?.mediaLink, row.title).toBeUndefined();
				}
			}
			for (const record of maintenance) {
				const module = course!.modules.find(
					candidate => candidate.title === record.module
				);
				const item = module?.supplementalProjects.find(
					candidate => candidate.id === record.id
				);
				expect(item?.internal, record.title).toBe(true);
				expect(item?.title, record.title).toBe(record.title);
				expect(item?.aliases ?? [], record.title).toEqual(
					expect.arrayContaining(record.aliases)
				);
			}
			const visible = course!.modules
				.filter(module => !module.internal)
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.filter(item => !item.internal);
			expect(visible).toHaveLength(115);
			const text = visible.map(item => item.content).join("\n");
			expect(text).not.toMatch(
				/\b(?:SwiftUI|Xcode|signing)\b|then examines for|Add one icon and shows/
			);
			expect(text).not.toMatch(
				/\*\*(Course flow|Standards route|Evidence gate|Concept path|Failure modes):\*\*/
			);
			expect(text).toContain(
				"containing one through nine shields for 45 shields total"
			);
			expect(text).toContain("Materialize 1.0.0");
			expect(text).toContain("D3 6.1.1");
			if (role === "learner")
				expect(all.every(item => !item.solutionLink)).toBe(true);
		}
	);

	it("keeps all six original checkpoint prompts complete", async () => {
		const course = (await loadRawCourse(id))!;
		const module = course.modules.find(
			candidate => candidate.title === "Check-In #1"
		)!;
		const text = module.curriculum.map(item => item.content).join("\n");
		for (const detail of [
			"userColor",
			"1 through 256",
			"0 through 20",
			"less than or equal to 50",
			"x=100",
			"four stars, then three, then two, then one"
		])
			expect(text).toContain(detail);
	});

	it("preserves actual animation headings instead of flattening them into list items", async () => {
		const course = (await loadRawCourse(id))!;
		const module = course.modules.find(
			candidate => candidate.title === "JSS10 Animations in JavaScript"
		)!;
		const item = module.curriculum.find(
			candidate => candidate.title === "JSS10 Project 2: Bouncing Ball"
		)!;
		expect(item.content).toContain("\n\n## Run and coordinate space\n");
		expect(item.content).toContain("\n\n## D3 transitions and events\n");
		expect(item.content).not.toContain("- ## ");
	});
});
