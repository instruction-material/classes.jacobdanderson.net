import type {
	CourseDefinition,
	CourseModule,
	CourseModuleItem,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "@/stores/courses/types";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { isJuniScratchProjectTitle } from "@/stores/courses/juniScratchProjects";
import { scratchLevel1Course } from "@/stores/courses/scratch-level-1";
import { scratchLevel2Course } from "@/stores/courses/scratch-level-2";

function matchingModule(
	course: CourseDefinition,
	rawModule: RawCourseModule
): CourseModule {
	const module = course.modules.find(
		candidate =>
			candidate.id === rawModule.id ||
			(rawModule.id && candidate.aliases?.includes(rawModule.id)) ||
			candidate.title === rawModule.title
	);

	if (!module) {
		throw new Error(`Missing normalized Scratch module ${rawModule.title}.`);
	}

	return module;
}

function matchingItem(
	items: CourseModuleItem[],
	rawItem: RawCourseModuleItem
): CourseModuleItem | undefined {
	return items.find(
		candidate =>
			candidate.id === rawItem.id ||
			(rawItem.id && candidate.aliases?.includes(rawItem.id)) ||
			candidate.title === rawItem.title
	);
}

function expectProjectInstructionsPreserved(
	courseId: string,
	rawCourse: RawCourse,
	displayCourse: CourseDefinition
) {
	let projectCount = 0;

	for (const rawModule of rawCourse.modules) {
		const displayModule = matchingModule(displayCourse, rawModule);

		for (const section of [
			"curriculum",
			"supplementalProjects"
		] as const) {
			const otherSection =
				section === "curriculum"
					? "supplementalProjects"
					: "curriculum";

			for (const rawItem of rawModule[section].filter(item =>
				isJuniScratchProjectTitle(courseId, item.title)
			)) {
				projectCount += 1;
				const displayItem = matchingItem(
					displayModule[section],
					rawItem
				);

				expect(displayItem, rawItem.title).toBeDefined();
				expect(
					isJuniScratchProjectTitle(
						courseId,
						displayItem?.title ?? ""
					),
					`${rawItem.title} -> ${displayItem?.title}`
				).toBe(true);
				expect(displayItem?.content.trim(), rawItem.title).toBe(
					rawItem.content.trim()
				);
				expect(
					matchingItem(displayModule[otherSection], rawItem),
					rawItem.title
				).toBeUndefined();
			}
		}
	}

	expect(projectCount).toBe(44);
}

describe("original Juni Scratch project instructions", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	for (const [courseId, rawCourse] of [
		["scratch-level-1", scratchLevel1Course],
		["scratch-level-2", scratchLevel2Course]
	] as const) {
		it(`preserves every ${courseId} project through learner display`, async () => {
			const displayCourse =
				await useCoursesStore().loadCourseById(courseId);

			expect(displayCourse).not.toBeNull();
			expectProjectInstructionsPreserved(
				courseId,
				rawCourse,
				displayCourse!
			);
		});
	}
});
