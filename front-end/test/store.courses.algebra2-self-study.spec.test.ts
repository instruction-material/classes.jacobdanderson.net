import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import published from "../../test/fixtures/algebra-2-published-progress.json";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import {
	loadCourseAssetSection,
	resetCourseAssetPreviewCache
} from "@/modules/courseAssetPreview";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it.each(
	published.courses.flatMap(course =>
		["learner", "instructor"].map(role => ({ course, role }))
	)
)(
	"preserves $course.courseId progress, readings and usable reviews for $role",
	async ({ course: previous, role }) => {
		setActivePinia(createPinia());
		resetCourseAssetPreviewCache();
		const app = useAppStore();
		const courseId = previous.courseId;
		if (role === "instructor")
			app.setCurrentTutor({
				_id: "algebra-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [courseId],
				editTutors: false,
				saveEdit: "Save"
			});
		else
			app.setCurrentUser({
				_id: "algebra-learner",
				name: "Learner",
				email: "learner@example.invalid",
				age: 16,
				state: "GA",
				courseAccess: [courseId],
				editUsers: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(courseId))!;
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
		expect(previous.identities).toHaveLength(
			courseId === "algebra-2a" ? 95 : 84
		);
		expect(actual).toEqual(previous.identities);
		expect(course.modules.map(module => module.id)).toEqual(
			previous.modules.map(module => module.id)
		);
		for (const module of previous.modules) {
			const current = course.modules.find(item => item.id === module.id)!;
			expect(current.aliases ?? []).toEqual(
				expect.arrayContaining(module.aliases)
			);
			for (const section of [
				"curriculum",
				"supplementalProjects"
			] as const) {
				expect(
					current[section].map(item => ({
						id: item.id,
						title: item.title
					}))
				).toEqual(
					module[section].map(item => ({
						id: item.id,
						title: item.title
					}))
				);
				for (const old of module[section])
					expect(
						current[section].find(item => item.id === old.id)!
							.aliases ?? [],
						old.id
					).toEqual(expect.arrayContaining(old.aliases));
			}
		}
		const coreModules = course.modules.filter(
			module => module.kind !== "appendix"
		);
		const readings = coreModules
			.flatMap(module => module.curriculum)
			.filter(isLessonLearningItem);
		expect(readings).toHaveLength(courseId === "algebra-2a" ? 24 : 20);
		const optionalReadings = coreModules
			.flatMap(module => module.supplementalProjects)
			.filter(isLessonLearningItem);
		expect(optionalReadings).toHaveLength(
			courseId === "algebra-2a" ? 3 : 2
		);
		const practices = coreModules
			.flatMap(module => module.curriculum)
			.filter(item =>
				item.content.includes("[Check answers and reasoning]")
			);
		expect(practices).toHaveLength(courseId === "algebra-2a" ? 3 : 2);
		let total = 0;
		const anchors = new Set<string>();
		for (const practice of practices) {
			expect(isLessonLearningItem(practice)).toBe(false);
			expect(practice.learningPath).toBe("core");
			expect(practice.content).not.toContain("Answer-key highlights");
			const questions = practice.content.match(/^\d+\. .+/gm)!;
			total += questions.length;
			const href = practice.content.match(
				/\[Check answers and reasoning\]\(([^)]+)\)/
			)![1];
			const url = new URL(href, "https://example.invalid");
			expect(url.pathname).toBe("/course-resource");
			const section = await loadCourseAssetSection(
				url.searchParams.get("asset")!,
				"Self-check",
				async asset =>
					({
						ok: true,
						text: async () =>
							readFileSync(
								resolve(process.cwd(), "public" + asset),
								"utf8"
							)
					}) as Response
			);
			expect(section.content.match(/^## /gm)).toHaveLength(1);
			expect(section.content.match(/^\d+\. .+/gm)).toHaveLength(
				questions.length
			);
			expect(anchors.has(section.hash)).toBe(false);
			anchors.add(section.hash);
		}
		expect(total).toBe(courseId === "algebra-2a" ? 23 : 22);
		expect(
			coreModules
				.flatMap(module => module.curriculum)
				.filter(
					item =>
						item.title.startsWith("Capstone:") &&
						!isLessonLearningItem(item)
				)
		).toHaveLength(1);
		expect(coreModules.at(-1)!.supplementalProjects).toHaveLength(2);
	}
);

it("renders the corrected formulas and method conditions without losing mathematical comparisons", async () => {
	setActivePinia(createPinia());
	const store = useCoursesStore();
	const a = (await store.loadCourseById("algebra-2a"))!;
	const b = (await store.loadCourseById("algebra-2b"))!;
	const all = [a, b].flatMap(course =>
		course.modules.flatMap(module => module.curriculum)
	);
	for (const [title, text] of [
		[
			"Quadratic Functions Core Concepts",
			"x=(-b plus or minus sqrt(b^2-4ac))/(2a)"
		],
		["Correlation and Interpreting Scatter Plots", "Sxx>0 and Syy>0"],
		["Least-Squares Regression and r^2", "yhat = (16/37)x + 82/37"],
		[
			"Trig Identities and Function Values",
			"csc(60 degrees)=2/sqrt(3) approx 1.155"
		],
		["Piecewise Models and Continuity", "9+2c=6c+1"]
	]) {
		const item = all.find(item => item.title === title)!;
		const wrapper = mount(LazyMarkdownContent, {
			props: { content: item.content }
		});
		try {
			await vi.waitFor(() => expect(wrapper.text()).toContain(text));
		} finally {
			wrapper.unmount();
		}
	}
});
