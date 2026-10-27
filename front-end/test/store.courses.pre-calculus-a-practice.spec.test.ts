import { readFileSync } from "node:fs";
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

it.each(["learner", "instructor"])(
	"provides complete Pre-Calculus A practice and working self-check links for the %s",
	async role => {
		setActivePinia(createPinia());
		resetCourseAssetPreviewCache();
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "math-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["pre-calculus-a"],
				editTutors: false,
				saveEdit: "Save"
			});
		}
		const course =
			(await useCoursesStore().loadCourseById("pre-calculus-a"))!;
		const units = course.modules.filter(module =>
			/^PCTA\d+ /.test(module.title)
		);
		expect(units).toHaveLength(14);
		const practices = units.map(module => {
			const concept = module.curriculum.find(item =>
				item.title.startsWith("Concept:")
			)!;
			expect(concept.content, module.title).toContain(
				"**Worked example:**"
			);
			expect(isLessonLearningItem(concept), module.title).toBe(true);
			return module.curriculum.find(item =>
				item.title.startsWith("Problem Set:")
			)!;
		});
		practices.push(
			...course.modules
				.flatMap(module => module.curriculum)
				.filter(item => /^Check-In #[12]$/.test(item.title))
		);
		expect(practices).toHaveLength(16);
		const anchors = new Set<string>();
		for (const practice of practices) {
			expect(practice.learningPath, practice.title).toBe("core");
			expect(isLessonLearningItem(practice), practice.title).toBe(false);
			const questions = practice.content
				.split("**Problems:**")[1]
				?.split("[Check answers and reasoning]")[0];
			expect(questions, practice.title).toMatch(/\n?1\. /);
			expect(questions, practice.title).toMatch(/`[^`]+`/);
			const link = practice.content.match(
				/\[Check answers and reasoning\]\(([^)]+)\)/
			)?.[1];
			expect(link, practice.title).toBeDefined();
			const viewer = new URL(link!, "https://example.invalid");
			expect(viewer.pathname).toBe("/course-resource");
			const asset = viewer.searchParams.get("asset")!;
			const section = await loadCourseAssetSection(
				asset,
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
			anchors.add(section.hash);
			expect(section.content, practice.title).toMatch(/\n1\. /);
			expect(
				section.content.match(/^## /gm),
				practice.title
			).toHaveLength(1);
			expect(section.title, practice.title).toMatch(/PCTA|Check-In/);
			if (section.hash.startsWith("check-in-2"))
				expect(section.content).toContain("8. ");
		}
		expect(anchors.size).toBe(16);
	}
);
