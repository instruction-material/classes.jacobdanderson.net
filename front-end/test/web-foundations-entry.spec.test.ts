import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";

const courseId = "web-development-foundations";
const modules = [
	{
		id: "web-development-foundations-wdf0-setup-and-tooling",
		guide: "web-project-setup.md",
		title: "WDF0 Setup and Tooling"
	},
	{
		id: "web-development-foundations-wdf1-positioning-goals-and-suggested-course-family",
		guide: "web-request-boundaries.md",
		title: "WDF1 Browser, Server, and Data Boundaries"
	},
	{
		id: "web-development-foundations-wdf2-stage-1-strengthen-the-existing-javascript-courses",
		guide: "web-files-git-debugging.md",
		title: "WDF2 Files, Git, and Browser Debugging"
	}
];
const source = JSON.parse(
	readFileSync(resolve("../test/fixtures/web-portfolio-source.json"), "utf8")
);
const root = `https://github.com/instruction-material/Web-Development-Foundations/tree/${source.revision}/${source.pack}`;

describe("web foundations entry progression", () => {
	it("preserves every published module/activity/section identity", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById(courseId))!;
		const published = JSON.parse(
			readFileSync(
				resolve("../test/fixtures/catalog-published-identities.json"),
				"utf8"
			)
		)[courseId];
		const rows = course.modules.flatMap(module =>
			(["curriculum", "supplementalProjects"] as const).flatMap(section =>
				module[section].map(item => ({
					moduleId: module.id,
					id: item.id,
					section: section === "curriculum" ? "core" : "optional"
				}))
			)
		);
		expect(rows).toHaveLength(published.items);
		expect(
			createHash("sha256").update(JSON.stringify(rows)).digest("hex")
		).toBe(published.sha256);
	});

	it.each(modules)(
		"supplies a complete learner reading for $title",
		async lesson => {
			const course = (await loadRawCourse(courseId))!;
			const module = course.modules.find(row => row.id === lesson.id)!;
			expect(module.title).toBe(lesson.title);
			expect(module.curriculum[0].content).toBe(
				readFileSync(
					resolve("src/assets/course-guides", lesson.guide),
					"utf8"
				).trim()
			);
			expect(module.curriculum.map(row => row.learningPath)).toEqual([
				undefined,
				"core",
				"core"
			]);
			expect(
				module.supplementalProjects.map(row => row.learningPath)
			).toEqual(["choice", "choice", "challenge"]);
			const items = [
				...module.curriculum,
				...module.supplementalProjects
			];
			expect(new Set(items.map(row => row.title)).size).toBe(6);
			expect(new Set(items.map(row => row.content)).size).toBe(6);
			const text = items
				.map(row => `${row.title}\n${row.content}`)
				.join("\n");
			expect(text).not.toMatch(
				/Position this course|Strengthen the Existing JavaScript Courses|suggested course family/i
			);
			for (const item of items.filter(row => row.projectLink)) {
				expect(item.projectLink).toBe(`${root}/starter`);
				expect(item.solutionLink).toBe(`${root}/solution`);
				expect(item.projectLink).not.toContain("/WDF-0");
			}
		}
	);

	it("keeps source references staff-only while retaining readings and published activity IDs", async () => {
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "web-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: [courseId],
			editTutors: false,
			saveEdit: "Save"
		});
		const store = useCoursesStore();
		const staff = (await store.loadCourseById(courseId))!;
		app.setCurrentTutor(null);
		const learner = (await store.loadCourseById(courseId))!;
		for (const lesson of modules) {
			const staffModule = staff.modules.find(
				row => row.id === lesson.id
			)!;
			const learnerModule = learner.modules.find(
				row => row.id === lesson.id
			)!;
			const staffItems = [
				...staffModule.curriculum,
				...staffModule.supplementalProjects
			];
			const learnerItems = [
				...learnerModule.curriculum,
				...learnerModule.supplementalProjects
			];
			expect(learnerItems.map(row => row.id)).toEqual(
				staffItems.map(row => row.id)
			);
			expect(learnerItems.map(row => row.content)).toEqual(
				staffItems.map(row => row.content)
			);
			expect(staffItems.filter(row => row.solutionLink)).toHaveLength(4);
			expect(learnerItems.every(row => !row.solutionLink)).toBe(true);
		}
	});
});
