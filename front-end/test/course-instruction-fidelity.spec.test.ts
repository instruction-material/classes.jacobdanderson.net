import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import { normalizeRawCourse } from "@/stores/courses/normalization";

function normalize(content: string) {
	return normalizeRawCourse("instruction-fidelity", {
		name: "Instruction Fidelity",
		modules: [
			{
				title: "Trace and Explain",
				curriculum: [{ title: "Reasoning Task", content }],
				supplementalProjects: []
			}
		]
	}).modules[0].curriculum[0].content;
}

describe("complete explanation instructions", () => {
	for (const role of ["learner", "instructor"] as const) {
		it(`retains the loop explanation after the course-flow paragraph for ${role}`, async () => {
			setActivePinia(createPinia());
			if (role === "instructor") {
				useAppStore().setCurrentTutor({
					_id: "instruction-fidelity-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: ["java-level-1"],
					editTutors: false,
					saveEdit: "Save"
				});
			}
			const course = await useCoursesStore().loadCourseById("java-level-1");
			const loops = course?.modules.flatMap(module => module.curriculum)
				.find(item => item.title.endsWith("For Loops"));
			expect(loops).toBeDefined();
			expect(loops!.content).toContain("**Course flow:**");
			expect(loops!.content).toContain(
				"repeat code with a loop variable, a stopping condition, and an update step"
			);
			expect(loops!.content).toContain(
				"Practice counting forward, backward, and by larger increments."
			);
		});
	}

	it.each([
		"Explain that limit before generalizing the algorithm to names or multilingual text.",
		"Explain that wraparound before running it.",
		"Explain that \"byte count\" differs from a user-perceived character count.",
		"Explain that `sum` returns the low 64 bits."
	])("preserves the complete reasoning task: %s", (text) => {
		expect(normalize(text)).toContain(text);
	});
	it("still removes directions addressed to a teacher while preserving the task", () => {
		const result = normalize(
			"Teach students to compare signed branches. Explain that result before changing the input."
		);
		expect(result).not.toContain("Teach students");
		expect(result).toContain(
			"Explain that result before changing the input."
		);
	});
	it("retains the bridge assignment's actual ASCII boundary instruction", async () => {
		const course = await loadRawCourse("python-to-java-and-cpp-bridge");
		const contents = course!.modules
			.flatMap(module => module.curriculum)
			.map(item => item.content);
		expect(
			contents.some(content =>
				content.includes(
					"Explain that limit before generalizing the algorithm to names or multilingual text."
				)
			)
		).toBe(true);
	});
});
