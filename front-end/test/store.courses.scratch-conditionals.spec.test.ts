import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

describe("Scratch conditional project support", () => {
	beforeEach(() => setActivePinia(createPinia()));

	for (const role of ["learner", "instructor"] as const) {
		it(`keeps complete support in the ${role} learning view and retains project identities`, async () => {
			if (role === "instructor") {
				useAppStore().setCurrentTutor({
					_id: "conditional-fixture",
					name: "Course fixture",
					email: "course@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: ["scratch-level-1"],
					editTutors: false,
					saveEdit: "Save"
				});
			}
			const course =
				await useCoursesStore().loadCourseById("scratch-level-1");
			const module = course!.modules.find(
				item => item.title === "GS7 Basic Conditionals"
			)!;
			const dinoIndex = module.curriculum.findIndex(
				item =>
					item.projectLink ===
					"https://scratch.mit.edu/projects/291223299/"
			);
			const noisyIndex = module.curriculum.findIndex(
				item =>
					item.projectLink ===
					"https://scratch.mit.edu/projects/291542721/"
			);
			const dinoLesson = module.curriculum[dinoIndex - 1];
			const noisyLesson = module.curriculum[noisyIndex - 1];
			expect(isLessonLearningItem(dinoLesson)).toBe(true);
			expect(
				isLessonLearningItem(noisyLesson),
				`${noisyLesson.title}: ${noisyLesson.content.slice(0, 250)}`
			).toBe(true);
			for (const requirement of [
				"eyedropper",
				"last matching check wins",
				"grey, blue, yellow, red",
				"empty message",
				"all four regions"
			])
				expect(dinoLesson.content).toContain(requirement);
			for (const requirement of [
				"Thunder Storm",
				"play sound",
				"until done",
				"go to Cloud",
				"wait until not touching Ball?",
				"different Thunder Storm recordings"
			])
				expect(noisyLesson.content).toContain(requirement);
			for (const [index, slug, reference] of [
				[dinoIndex, "project-1-dino-s-colors", "291220849"],
				[noisyIndex, "project-2-noisy-reactions", "291530292"]
			] as const) {
				const project = module.curriculum[index];
				expect(project.id).toBe(
					`scratch-level-1-gs5-basic-conditionals-curriculum-${slug}`
				);
				expect(project.learningPath).toBe("core");
				expect(project.solutionLink).toBe(
					role === "instructor"
						? `https://scratch.mit.edu/projects/${reference}/`
						: undefined
				);
			}
			const challenge = module.supplementalProjects.find(item =>
				item.title.includes("Concurrent Lightning")
			)!;
			expect(challenge.learningPath).toBe("challenge");
			expect(challenge.projectLink).toBeUndefined();
			expect(challenge.solutionLink).toBeUndefined();
			expect(challenge.content).toContain(
				"broadcast lightning strike and wait"
			);
			expect(challenge.content).toContain("both motion and sound finish");
			expect(challenge.content).toContain(
				"Keep both receiver stacks finite"
			);
		});
	}
});
