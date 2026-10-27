import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import {
	loadCourseAssetSection,
	resetCourseAssetPreviewCache
} from "@/modules/courseAssetPreview";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const published = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/pre-calculus-b-published-progress.json"
		),
		"utf8"
	)
) as {
	sha256: string;
	reading: { id: string; aliases: string[] };
	identities: { moduleId: string; id: string; section: string }[];
};
const newPracticeId =
	"pre-calculus-b-pctb1-trigonometry-basics-curriculum-problem-set-unit-circle-reasoning";

it.each(["learner", "instructor"])(
	"supplies the complete Pre-Calculus B sequence with compatible progress for the %s",
	async role => {
		setActivePinia(createPinia());
		resetCourseAssetPreviewCache();
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "math-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["pre-calculus-a", "pre-calculus-b"],
				editTutors: false,
				saveEdit: "Save"
			});
		const store = useCoursesStore();
		const course = (await store.loadCourseById("pre-calculus-b"))!;
		const actual = course.modules.flatMap(module => [
			...module.curriculum.map(item => ({
				moduleId: module.id,
				id: item.id,
				section: "core"
			})),
			...module.supplementalProjects.map(item => ({
				moduleId: module.id,
				id: item.id,
				section: "optional"
			}))
		]);
		expect(
			createHash("sha256")
				.update(JSON.stringify(published.identities))
				.digest("hex")
		).toBe(published.sha256);
		for (const previous of published.identities)
			expect(
				actual.find(item => item.id === previous.id),
				previous.id
			).toEqual(previous);
		const previousIds = new Set(published.identities.map(item => item.id));
		expect(
			actual
				.filter(item => !previousIds.has(item.id))
				.map(item => item.id)
		).toEqual([newPracticeId]);
		const first = course.modules[0]!;
		const reading = first.curriculum.find(
			item => item.id === published.reading.id
		)!;
		expect(reading.aliases).toEqual(
			expect.arrayContaining(published.reading.aliases)
		);
		expect(isLessonLearningItem(reading)).toBe(true);
		expect(reading.content).not.toContain(
			"**Problem Set: Unit Circle Reasoning**"
		);
		const practice = first.curriculum.find(
			item => item.id === newPracticeId
		)!;
		expect(isLessonLearningItem(practice)).toBe(false);
		expect(practice.learningPath).toBe("core");
		const units = course.modules.filter(module =>
			/^PCTB\d+ /.test(module.title)
		);
		expect(units).toHaveLength(13);
		const problems = units.map((module, index) => {
			const concept =
				index === 0
					? reading
					: module.curriculum.find(item =>
							item.title.startsWith("Concept:")
						)!;
			expect(isLessonLearningItem(concept), module.title).toBe(true);
			expect(concept.content, module.title).toContain(
				"**Worked example:**"
			);
			return module.curriculum.find(item =>
				item.title.startsWith("Problem Set:")
			)!;
		});
		problems.push(
			...course.modules
				.filter(module => module.title.startsWith("Check-In #"))
				.flatMap(module => module.curriculum)
				.filter(item => item.title.endsWith("Review"))
		);
		expect(problems).toHaveLength(17);
		const anchors = new Set<string>();
		for (const item of problems) {
			expect(item.learningPath, item.title).toBe("core");
			expect(isLessonLearningItem(item), item.title).toBe(false);
			const questions = item.content
				.split("**Problems:**")[1]
				?.split("[Check answers and reasoning]")[0];
			expect(questions, item.title).toMatch(/\n?1\. /);
			expect(questions, item.title).toMatch(/`[^`]+`/);
			const href = item.content.match(
				/\[Check answers and reasoning\]\(([^)]+)\)/
			)?.[1];
			expect(href, item.title).toBeDefined();
			const viewer = new URL(href!, "https://example.invalid");
			expect(viewer.pathname).toBe("/course-resource");
			const section = await loadCourseAssetSection(
				viewer.searchParams.get("asset")!,
				"Self-check",
				async url =>
					({
						ok: true,
						text: async () =>
							readFileSync(
								resolve(process.cwd(), `public${url}`),
								"utf8"
							)
					}) as Response
			);
			expect(section.title, item.title).toMatch(/PCTB|Check-In/);
			expect(section.content.match(/^## /gm), item.title).toHaveLength(1);
			expect(section.content, item.title).toMatch(/\n1\. /);
			anchors.add(section.hash);
		}
		expect(anchors.size).toBe(17);
		const output = process.env.PRECALCULUS_B_ROLE_PROOF_DIR;
		if (output) {
			mkdirSync(output, { recursive: true });
			for (const id of ["pre-calculus-a", "pre-calculus-b"])
				writeFileSync(
					resolve(output, `${id}-${role}.json`),
					JSON.stringify(
						{ id, role, course: await store.loadCourseById(id) },
						null,
						2
					) + "\n"
				);
		}
	}
);
