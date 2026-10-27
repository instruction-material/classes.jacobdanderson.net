import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

it.each(["learner", "instructor"])(
	"keeps the Delivery Map project mathematical for the %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "math-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["algebra-1a"],
				editTutors: false,
				saveEdit: "Save"
			});
		}
		const course = await useCoursesStore().loadCourseById("algebra-1a");
		const project = course?.modules
			.flatMap(module => module.curriculum)
			.find(item => item.title === "Project 2A: Delivery Map");
		expect(project).toBeDefined();
		expect(project?.id).toBe(
			"algebra-1a-algebra-1a-kick-off-projects-curriculum-project-2a-delivery-map"
		);
		expect(project?.content).toContain("(6 - 5) / (4 - (-3)) = 1/7");
		const outcome = project?.content
			.split("**Outcome:**")[1]
			?.split("**Checkpoints:**")[0];
		expect(outcome).toMatch(/givens|known values|Translate the situation/);
		expect(outcome).not.toMatch(/insertion|lookup|membership|priority/);
		const checkpoint = course?.modules
			.flatMap(module => module.curriculum)
			.find(
				item => item.title === "Graphing Linear Equations: y = 3x - 2"
			);
		const quickCheck = checkpoint?.content.split("**Quick check:**")[1];
		expect(quickCheck).toContain("y = 3x - 2");
		expect(checkpoint?.content).not.toContain("y = 3x: 2");
	}
);
