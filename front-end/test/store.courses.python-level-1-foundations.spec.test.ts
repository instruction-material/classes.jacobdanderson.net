import type { CourseModuleItem } from "@/stores/courses/types";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import MarkdownIt from "markdown-it";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import {
	isLessonLearningItem,
	lessonContentSections
} from "@/modules/courseLessonPresentation";
import { normalizeInlineCourseMarkdown } from "@/modules/courseMarkdown";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";

const titles = ["Introduction and Setup", "GrS2 Project 1: Basic Shapes"];

const markdown = new MarkdownIt({ breaks: true, html: false, linkify: true });
function digest(text: string) {
	return createHash("sha256").update(text).digest("hex");
}
function rendered(text: string) {
	const container = document.createElement("div");
	container.innerHTML = markdown.render(normalizeInlineCourseMarkdown(text));
	return container;
}
function browserReading(item: CourseModuleItem) {
	const container = rendered(item.content);
	return {
		id: item.id,
		title: item.title,
		learningPath: item.learningPath,
		contentSHA256: digest(item.content),
		expectedText: container.textContent!.replace(/\s+/g, " ").trim(),
		tableRows: container.querySelectorAll("tbody tr").length,
		paragraphBreaks: container.querySelectorAll(":scope > p > br").length,
		images: []
	};
}
function browserCard(item: CourseModuleItem) {
	const complete = item.title === titles[1];
	const body = complete
		? lessonContentSections(item.content, item.contentKind ?? "assignment")
				.map(section => {
					const label =
						section.kind === "optional" &&
						section.label !== "Optional"
							? `Optional · ${section.label}`
							: section.label;
					return `### ${label}\n\n${section.content}`;
				})
				.join("\n\n")
		: "";
	return {
		id: item.id,
		title: item.title,
		learningPath: item.learningPath,
		selfChecks: [],
		assignmentTextScope: complete ? "complete" : "placement",
		directiveTextMode: "innerText",
		requiredDirective: complete
			? rendered(body).textContent!.replace(/\s+/g, " ").trim()
			: ""
	};
}

describe("python Turtle foundation teaching", () => {
	for (const id of ["python-level-1", "python-level-1-classroom"]) {
		for (const role of ["learner", "instructor"]) {
			it(`retains complete worked lessons for ${id} / ${role}`, async () => {
				setActivePinia(createPinia());
				if (role === "instructor") {
					useAppStore().setCurrentTutor({
						_id: "foundation-tutor",
						name: "Tutor",
						email: "tutor@example.invalid",
						age: 30,
						state: "GA",
						usersOfTutorLength: 0,
						coursePermissions: [id],
						editTutors: false,
						saveEdit: "Save"
					});
				} else {
					useAppStore().setCurrentUser({
						_id: "foundation-learner",
						name: "Learner",
						email: "learner@example.invalid",
						age: 14,
						state: "GA",
						courseAccess: [id],
						editUsers: false,
						saveEdit: "Save"
					});
				}
				const raw = (await loadRawCourse(id))!;
				const course = (await useCoursesStore().loadCourseById(id))!;
				const source = raw.modules.flatMap(module => module.curriculum);
				const items = course.modules.flatMap(
					module => module.curriculum
				);
				const selected = titles.map(title => {
					const expected = source.find(item => item.title === title)!;
					const actual = items.find(item => item.title === title)!;
					expect(actual, title).toBeDefined();
					expect(actual.content).toBe(expected.content.trim());
					expect(actual.content).toContain("```python");
					expect(actual.learningPath).toBe("core");
					if (role === "learner")
						expect(actual.solutionLink).toBeUndefined();
					return actual;
				});
				const browserDirectory =
					process.env.SELF_STUDY_BROWSER_PROOF_DIR;
				if (
					browserDirectory &&
					process.env.SELF_STUDY_BROWSER_COURSES?.split(",").includes(
						id
					)
				) {
					const modules = course.modules
						.filter(module => !module.internal)
						.map(module => ({
							id: module.id,
							title: module.title,
							kind: module.kind ?? "module",
							readings: module.curriculum
								.filter(item => item.title === titles[0])
								.map(browserReading),
							projects: module.curriculum
								.filter(item => !isLessonLearningItem(item))
								.map(browserCard),
							optional: module.supplementalProjects
								.filter(item => !isLessonLearningItem(item))
								.map(browserCard)
						}));
					const fixture = {
						schemaVersion: 1,
						id,
						role,
						sourceCommit:
							process.env.GITHUB_SHA ??
							execFileSync("git", ["rev-parse", "HEAD"], {
								encoding: "utf8"
							}).trim(),
						modules,
						reviewedModuleIds: course.modules
							.filter(module =>
								module.curriculum.some(item =>
									titles.includes(item.title)
								)
							)
							.map(module => module.id),
						referenceModules: modules.filter(
							module => module.kind === "appendix"
						),
						internalModules: course.modules
							.filter(module => module.internal)
							.map(module => ({
								id: module.id,
								title: module.title
							})),
						reviewScope:
							"Two foundation units only:complete coordinate/setup reading and Basic Shapes assignment;other cards in those units receive placement checks. Later content,original sources and IDE runtime remain separate."
					};
					mkdirSync(browserDirectory, { recursive: true });
					writeFileSync(
						join(browserDirectory, `${id}-${role}.json`),
						JSON.stringify(fixture, null, 2)
					);
				}

				const directory = process.env.PYTHON_FOUNDATIONS_PROOF_DIR;
				if (directory) {
					mkdirSync(directory, { recursive: true });
					writeFileSync(
						join(directory, `${id}-${role}.json`),
						JSON.stringify({ id, role, items: selected }, null, 2)
					);
				}
			});
		}
	}
	it("opens the Basic Shapes reference with matching classroom tasks", async () => {
		const raw = (await loadRawCourse("python-level-1-classroom"))!;
		const item = raw.modules
			.flatMap(module => module.curriculum)
			.find(item => item.title === titles[1])!;
		const url = new URL(item.projectLink!, "https://example.invalid");
		expect(url.searchParams.get("template")).toBe("classroom-project");
		expect(url.searchParams.get("classroomSource")).toMatch(
			/\/tree\/[a-f0-9]{40}\/GrS2-Basic-Shapes\/solution$/
		);
		expect(item.content).toContain("draw a 30-pixel triangle");
		expect(item.content).toContain(
			"Predict the exterior turn, 72 degrees"
		);
	});
});
