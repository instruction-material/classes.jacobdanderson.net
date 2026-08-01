import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import type {
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "@/stores/courses/types";
import { loadRawCourse } from "@/stores/courses/index";

const classroomTemplates = new Set([
	"circle-art",
	"classroom-project",
	"firework-festival",
	"flower-garden",
	"maze-explorer",
	"neon-trail",
	"picasso",
	"spiral-galaxy",
	"triangle-motion",
	"turtle-race"
]);

function isClassroomProject(
	module: RawCourseModule,
	item: RawCourseModuleItem
) {
	if (module.kind === "appendix") return false;

	return (
		!!item.projectLink ||
		!!item.solutionLink ||
		/\b(?:project|practice|exploration|recap)\b/i.test(item.title) ||
		/^Check-In #\d+:/i.test(item.title)
	);
}

function classroomProjects(course: RawCourse) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects]
			.filter(item => isClassroomProject(module, item))
			.map(item => ({ item, module }))
	);
}

describe("Python Level 1 classroom edition", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("preserves the full course sequence after its classroom launch", async () => {
		const [baseCourse, classroomCourse] = await Promise.all([
			loadRawCourse("python-level-1"),
			loadRawCourse("python-level-1-classroom")
		]);
		expect(baseCourse).not.toBeNull();
		expect(classroomCourse).not.toBeNull();

		expect(classroomCourse!.name).toBe("Python Level 1: Classroom Edition");
		expect(classroomCourse!.modules[0]?.title).toBe(
			"Classroom Launch: Normal and Hard Projects"
		);
		expect(
			classroomCourse!.modules.slice(1).map(module => module.title)
		).toEqual(baseCourse!.modules.slice(1).map(module => module.title));

		const launchModule = classroomCourse!.modules[0]!;
		const launchProjects = [
			...launchModule.curriculum,
			...launchModule.supplementalProjects
		].filter(item => /^Launch Project \d+:/.test(item.title));
		expect(launchProjects).toHaveLength(9);
		expect(launchProjects.map(item => item.title)).toEqual([
			"Launch Project 1: Color Circle Art",
			"Launch Project 2: Picasso Keyboard Painter",
			"Launch Project 3: Triangle Motion",
			"Launch Project 4: Neon Trail Painter",
			"Launch Project 5: Firework Festival",
			"Launch Project 6: Spiral Galaxy",
			"Launch Project 7: Turtle Race Day",
			"Launch Project 8: Flower Garden Clicker",
			"Launch Project 9: Maze Explorer"
		]);
		expect(launchModule.estimatedTime).toBe(
			"2–3 sessions · 45–60 minutes each"
		);
		expect(launchModule.keyBlocks).toHaveLength(5);
		expect(launchModule.curriculum.map(item => item.title)).toEqual([
			"Classroom Workflow: Run, Normal, Hard",
			"Launch Project 1: Color Circle Art",
			"Launch Project 2: Picasso Keyboard Painter",
			"Classroom Debugging and Showcase Routine"
		]);
		expect(
			launchModule.curriculum.every(item => item.learningPath === "core")
		).toBe(true);
		expect(
			launchModule.supplementalProjects.filter(
				item => item.learningPath === "choice"
			)
		).toHaveLength(5);
		expect(
			launchModule.supplementalProjects.filter(
				item => item.learningPath === "challenge"
			)
		).toHaveLength(4);
	});

	it("gives every classroom project Normal and Hard work areas", async () => {
		const classroomCourse = await loadRawCourse("python-level-1-classroom");
		expect(classroomCourse).not.toBeNull();

		const projects = classroomProjects(classroomCourse!);
		expect(projects.length).toBeGreaterThan(100);

		for (const { item, module } of projects) {
			expect(item.content, `${module.title} / ${item.title}`).toContain(
				"**Normal:**"
			);
			expect(item.content, `${module.title} / ${item.title}`).toContain(
				"**Hard:**"
			);
			expect(item.projectLink, `${module.title} / ${item.title}`).toMatch(
				/^\/ide\?/
			);

			const projectUrl = new URL(
				item.projectLink!,
				"https://example.com"
			);
			expect(projectUrl.searchParams.get("classroom")).toBe("1");
			expect(projectUrl.searchParams.get("course")).toBe(
				"python-level-1-classroom"
			);
			expect(projectUrl.searchParams.get("mode")).toBe("turtle");
			expect(
				classroomTemplates.has(
					projectUrl.searchParams.get("template") ?? ""
				),
				`${module.title} / ${item.title}`
			).toBe(true);
			expect(projectUrl.searchParams.get("projectKey")).toContain(
				"python-level-1-classroom:"
			);
		}

		expect(JSON.stringify(classroomCourse)).not.toMatch(/\bbeginner\b/i);
	});

	it("keeps launch guidance focused on visible Turtle behavior", async () => {
		const classroomCourse = await loadRawCourse("python-level-1-classroom");
		const launchModule = classroomCourse?.modules[0];
		expect(launchModule).toBeDefined();

		const launchText = JSON.stringify(launchModule);
		expect(launchText).toContain("**Course flow:**");
		expect(launchText).toContain("canvas");
		expect(launchText).toContain("clean start");
		expect(launchText).not.toMatch(
			/input surface|file data|empty value, duplicate value|casing issue|punctuation issue|messy input/i
		);
	});

	it("preserves progress IDs when launch projects become optional", async () => {
		const course = await useCoursesStore().loadCourseById(
			"python-level-1-classroom"
		);
		const launchModule = course?.modules.find(
			module =>
				module.title === "Classroom Launch: Normal and Hard Projects"
		);
		const triangle = launchModule?.supplementalProjects.find(
			item => item.title === "Launch Project 3: Triangle Motion"
		);

		expect(triangle?.id).toBe(
			"python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-3-triangle-motion"
		);
		expect(triangle?.aliases).toContain(
			"python-level-1-classroom-classroom-launch-normal-and-hard-projects-supplemental-launch-project-3-triangle-motion"
		);
	});

	it("uses completed source projects when available and keeps source attribution", async () => {
		const classroomCourse = await loadRawCourse("python-level-1-classroom");
		expect(classroomCourse).not.toBeNull();

		const movementModule = classroomCourse!.modules.find(
			module => module.title === "GrS1 Coordinates and Movement"
		);
		const exploration = movementModule?.curriculum.find(item =>
			item.title.includes("Turtle Exploration")
		);
		expect(exploration).toBeDefined();
		expect(exploration!.content).toContain("**Original project files:**");
		expect(exploration!.content).toContain(
			"Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/starter"
		);

		const projectUrl = new URL(
			exploration!.projectLink!,
			"https://example.com"
		);
		expect(projectUrl.searchParams.get("template")).toBe(
			"classroom-project"
		);
		expect(projectUrl.searchParams.get("classroomSource")).toBe(
			"Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/solution"
		);
	});
});
