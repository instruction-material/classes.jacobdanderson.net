import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import HistoricalCourseProgress from "@/components/HistoricalCourseProgress.vue";
import { unmatchedCourseProgress } from "@/modules/courseProgressHistory";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { javascriptLevel1Course } from "@/stores/courses/javascript-level-1";

const courseId = "javascript-level-1-javascript-superstar";
const moduleTitle = "JSS4 Combining Loops and Variables";
const moduleId = `${courseId}-jss4-combining-loops-and-variables`;
const retiredIds = ["transfer-practice", "extension-practice"].flatMap(
	suffix => [
		`${moduleId}-supplemental-combining-loops-and-variables-${suffix}`,
		`${moduleId}-supplemental-${suffix}`
	]
);
const originalTitles = [
	"JSS4 Project 1: Totaling Up",
	"JSS4 Project 2: Coin Machine",
	"JSS4 Project 3: Random Password",
	"JSS4 Supplemental Project 1: Debugging Football"
];

async function load(role: "learner" | "instructor") {
	setActivePinia(createPinia());
	if (role === "instructor") {
		useAppStore().setCurrentTutor({
			_id: "consolidation-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: [courseId],
			editTutors: false,
			saveEdit: "Save"
		});
	}
	return (await useCoursesStore().loadCourseById(courseId))!;
}

describe("original JSS4 project set", () => {
	it("keeps only the original three projects and debugging supplement", () => {
		const module = javascriptLevel1Course.modules.find(
			module => module.title === moduleTitle
		)!;
		expect(
			[...module.curriculum, ...module.supplementalProjects]
				.filter(item => item.projectLink)
				.map(item => item.title)
		).toEqual(originalTitles);
		expect(module.supplementalProjects.map(item => item.title)).toEqual([
			originalTitles[3]
		]);
	});

	for (const role of ["learner", "instructor"] as const) {
		it(`keeps the original project links without quota replacements for ${role}`, async () => {
			const course = await load(role);
			const module = course.modules.find(
				module => module.id === moduleId
			)!;
			expect(module.supplementalProjects.map(item => item.title)).toEqual(
				[originalTitles[3]]
			);
			const projects = [
				...module.curriculum,
				...module.supplementalProjects
			].filter(item => item.projectLink);
			expect(projects.map(item => item.title)).toEqual(originalTitles);
			for (const item of projects) {
				expect(item.projectLink).toMatch(
					/^https:\/\/codepen\.io\/junilearning\/pen\//u
				);
				if (role === "instructor") {
					expect(item.solutionLink).toMatch(
						/^https:\/\/codepen\.io\/junilearning\/pen\//u
					);
				}
				else {
					expect(item.solutionLink).toBeUndefined();
				}
			}
			expect(JSON.stringify(course)).not.toMatch(/JSS-0[56]-jss4/u);
		});

		it(`retains exact earlier completions without crediting another task for ${role}`, async () => {
			const course = await load(role);
			const currentIds = course.modules.flatMap(module =>
				[...module.curriculum, ...module.supplementalProjects].flatMap(
					item => [item.id, ...(item.aliases ?? [])]
				)
			);
			for (const retired of retiredIds)
				expect(currentIds).not.toContain(retired);
			const progress = {
				courseId,
				completedModuleIds: [],
				completedItemIds: [...retiredIds]
			};
			const before = structuredClone(progress);
			expect(unmatchedCourseProgress(course, progress)).toEqual(
				retiredIds.map(id => ({ id, kind: "item" }))
			);
			const wrapper = mount(HistoricalCourseProgress, {
				props: { course, progress }
			});
			expect(wrapper.text()).toContain("Earlier completions (4)");
			expect(wrapper.findAll("code").map(node => node.text())).toEqual(
				retiredIds
			);
			expect(
				wrapper.find("button[aria-label^=\"Remove earlier\"]").exists()
			).toBe(false);
			await wrapper
				.get(".workspace-disclosure__trigger")
				.trigger("click");
			expect(wrapper.emitted("remove")).toBeUndefined();
			expect(progress).toEqual(before);
			wrapper.unmount();
		});
	}
});
