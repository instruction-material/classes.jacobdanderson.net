import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import {
	isLessonLearningItem,
	lessonContentSections
} from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { scratchLevel1BootcampCourse } from "@/stores/courses/source-library-courses";

it.each(["learner", "instructor"])(
	"keeps every Bootcamp task reachable beside its complete reading for %s",
	async role => {
		const id = "scratch-level-1-bootcamp";
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "bootcamp-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [id],
				editTutors: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(id))!;
		const required: Record<string, string[]> = {
			"Dragonfly Event Listener Remix": [
				"random position",
				"space key",
				"Buzzzz"
			],
			"Beetle Keyboard Drawing Controls": [
				"10 steps",
				"1 key",
				"2 key",
				"3 key"
			],
			"Elephant Repeat and Forever Effects": [
				"10 changes of size by 10",
				"size by -10",
				"wait 1 second"
			],
			"Mouse Shape Loops": ["1 key", "2 key", "octagon"],
			"Button Click Timer Game": [
				"Seconds left",
				"scoring inactive",
				"Pressed",
				"Regular"
			],
			"Bootcamp Game Selection": [
				"### Spider Smash",
				"### Hungry Shark",
				"### Save the Princess",
				"Bite sound",
				"Fish2",
				"subtract 1",
				"reset it to 3",
				"Reset Timer to 60"
			]
		};

		const modules = course.modules.filter(module => !module.internal);
		expect(modules.map(module => module.title)).toEqual(
			scratchLevel1BootcampCourse.modules.map(module => module.title)
		);
		let tasks = 0;
		let sourceLinks = 0;
		for (const original of scratchLevel1BootcampCourse.modules) {
			const module = modules.find(
				module => module.title === original.title
			)!;
			const readings = module.curriculum.filter(isLessonLearningItem);
			expect(readings, module.title).toHaveLength(1);
			expect(readings[0].content).not.toContain(
				"Define the important terms in plain language"
			);
			expect(readings[0].contentKind).toBe("reading");
			const rendered = mount(LazyMarkdownContent, {
				props: { content: readings[0].content }
			});
			try {
				await vi.waitFor(() =>
					expect(rendered.findAll("pre code")).toHaveLength(1)
				);
				expect(rendered.text()).toContain("Course flow:");
				expect(
					rendered.findAll(".item-content-markdown > p > br")
				).toHaveLength(0);
			} finally {
				rendered.unmount();
			}
			for (const section of [
				"curriculum",
				"supplementalProjects"
			] as const) {
				for (const project of original[section].filter(
					item => !item.title.startsWith("Concepts:")
				)) {
					const current = module[section].find(
						item => item.title === project.title
					)!;
					expect(current, project.title).toBeDefined();
					expect(isLessonLearningItem(current), project.title).toBe(
						false
					);
					expect(current.learningPath, project.title).toBe(
						project.learningPath
					);
					if (project.title === "Bootcamp Game Selection") {
						expect(current.ideImport).toBeUndefined();
						expect(current.solutionLink).toBeUndefined();
					}
					expect(current.projectLink, project.title).toBe(
						project.projectLink
					);
					if (project.solutionLink) {
						expect(current.solutionLink).toBe(
							role === "instructor"
								? project.solutionLink
								: undefined
						);
						expect(
							current.playableSolutionEmbedUrl
						).toBeUndefined();
					}
					const directive = project.content.match(
						/^\*\*Project goal:\*\*\s*([\s\S]+?)\s*\*\*Completion evidence:\*\*/
					)?.[1];
					if (directive) {
						const assignment = lessonContentSections(
							current.content
						)
							.filter(section => section.kind === "assignment")
							.map(section => section.content)
							.join("\n");
						expect(assignment, project.title).toContain(directive);
					}
					for (const text of required[project.title] ?? [])
						expect(current.content, project.title).toContain(text);
					tasks += 1;
					if (project.projectLink) sourceLinks += 1;
				}
			}
		}
		expect(tasks).toBe(22);
		expect(
			scratchLevel1BootcampCourse.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.filter(item => item.content.startsWith("**Project goal:**"))
		).toHaveLength(14);
		expect(sourceLinks).toBe(17);
	}
);
