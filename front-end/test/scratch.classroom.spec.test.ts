import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "../src/stores/courses";
import { courseCatalog } from "../src/stores/courses/index";
import {
	scratchFrameDocument,
	scratchDownloadName
} from "../src/modules/scratch/frame";
import { scratchLevel1ClassroomCourse } from "../src/stores/courses/scratch-level-1-classroom";
import { lessonContentSections } from "../src/modules/courseLessonPresentation";

describe("Scratch classroom", () => {
	it("shows the full Normal and Hard instructions in the learner view", async () => {
		setActivePinia(createPinia());
		const entry = courseCatalog.find(
			course => course.name === "Scratch Level 1: Classroom Edition"
		);
		expect(entry).toBeDefined();
		const course = await useCoursesStore().loadCourseById(entry!.id);
		const first = course?.modules[0].curriculum.find(
			item => item.title === "Two Arrows"
		);
		expect(first?.content).toContain("**Normal:**");
		expect(first?.content).toContain("**Hard:**");
		expect(first?.content).toContain("**Check:**");
		const maze = course?.modules
			.flatMap(module => module.curriculum)
			.find(item => item.id === "maze-reset");
		expect(maze?.projectLink).toBe("/ide?mode=scratch&starter=maze-reset");
		expect(maze?.content).toContain("## Optional ending screen");
		expect(maze?.content).toContain("when green flag clicked -> hide");
		expect(maze?.content).toContain(
			"when I receive [Maze finished] -> go to front layer -> show"
		);
		expect(maze?.content).toContain(
			"broadcast [Maze finished] and wait, followed by stop all"
		);
		expect(maze?.content).toContain(
			"the ending must hide and the player must return to its start"
		);
		expect(maze?.content).toContain("it still retries");
	});
	it("keeps a small, ordered core sequence and separate practice", () => {
		const projects = scratchLevel1ClassroomCourse.modules.flatMap(module =>
			module.curriculum.filter(
				item =>
					item.projectLink &&
					item.id !== "scratch-classroom-independent-game"
			)
		);
		expect(projects).toHaveLength(12);
		expect(projects[0].title).toBe("Animate Your Name");
		expect(projects.at(-1)?.title).toBe("Build Your Collection Game");
		for (const project of projects) {
			expect(project.learningPath).toBe("core");
			expect(project.content).toContain("**Normal:**");
			expect(project.content).toContain("**Hard:**");
			expect(project.content).toContain("**Check:**");
			expect(project.projectLink).toMatch(
				/^\/ide\?mode=scratch&starter=[a-z-]+$/
			);
		}
	});
	it("launches independent work without starter scripts or a solution", () => {
		const independent = scratchLevel1ClassroomCourse.modules
			.flatMap(module => module.curriculum)
			.find(item => item.id === "scratch-classroom-independent-game");
		expect(independent?.projectLink).toBe(
			"/ide?mode=scratch&starter=blank"
		);
		expect(independent?.content).toContain("/scratch-projects/blank.sb3");
		expect(independent?.solutionLink).toBeUndefined();
	});
	it("keeps the three guided game continuations optional within the six existing units", () => {
		expect(scratchLevel1ClassroomCourse.modules.map(module => module.id)).toEqual(
			Array.from({ length: 6 }, (_, index) => `scratch-classroom-${index + 1}`)
		);
		const finalUnit = scratchLevel1ClassroomCourse.modules[5];
		const continuations = finalUnit.supplementalProjects?.filter(item => item.projectLink);
		expect(continuations?.map(item => item.id)).toEqual(["falling-catch", "projectile-state", "catch-levels"]);
		for (const item of continuations ?? []) {
			expect(item.learningPath).toBe("choice");
			expect(item.preserveInstructions).toBe(true);
			expect(item.projectLink).toBe(`/ide?mode=scratch&starter=${item.id}`);
			expect(item.content).toContain(`/scratch-projects/${item.id}.sb3`);
			expect(item.content).toContain("**Normal");
			expect(item.content).toContain("**Check");
			const sections = lessonContentSections(item.content);
			const optionalContent = sections.filter(section => section.kind === "optional").map(section => section.content).join("\n");
			expect(optionalContent).not.toContain("Download this starter");
			expect(optionalContent).not.toContain("**Explain");
			expect(sections.filter(section => section.kind === "assignment").some(section => section.content.includes(`/scratch-projects/${item.id}.sb3`))).toBe(true);
			expect(finalUnit.curriculum.some(core => core.id === item.id)).toBe(false);
		}
		expect(continuations?.[0].content).toContain("one drop from being counted as both");
		expect(continuations?.[1].content).toContain("Ready (0), Space pressed");
		expect(continuations?.[2].content).toContain("does not demote an earned level");
	});
	it("limits frame resources to the editor and public Scratch assets", () => {
		const frame = scratchFrameDocument("https://example.test", "channel");
		expect(frame).toContain(
			"connect-src https://example.test/scratch-runtime/ https://assets.scratch.mit.edu;"
		);
		expect(frame).toContain("worker-src 'none'");
		expect(frame).toContain("form-action 'none'");
		expect(frame).not.toContain("/api/");
		expect(frame).toContain('data-channel="channel"');
	});
	it("creates reusable safe project filenames", () => {
		expect(scratchDownloadName("Robot dress-up")).toBe(
			"Robot dress-up.sb3"
		);
		expect(scratchDownloadName("a/b\\c\n")).toBe("a-b-c-.sb3");
		expect(scratchDownloadName("")).toBe("Scratch project.sb3");
	});
});
