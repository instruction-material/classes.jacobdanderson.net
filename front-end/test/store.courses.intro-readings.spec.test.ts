import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { aiLevel1Course } from "@/stores/courses/ai-level-1";
import { apComputerScienceACourse } from "@/stores/courses/ap-computer-science-a";

it("keeps authored introductory readings in Learn for learners and instructors", async () => {
	const cases = [
		{
			id: "ai-level-1",
			source: aiLevel1Course,
			titles: [
				"Bridge Positioning between Core Python and ML",
				"How to Read an AI Problem Statement"
			]
		},
		{
			id: "ap-computer-science-a",
			source: apComputerScienceACourse,
			titles: ["Current Four-Unit Framework and Digital Exam"]
		}
	];
	for (const role of ["learner", "instructor"]) {
		setActivePinia(createPinia());
		const app = useAppStore();
		const person = {
			_id: "reading-fixture",
			name: "Reader",
			email: "reader@example.invalid",
			age: 18,
			state: "GA",
			saveEdit: "Save"
		};
		if (role === "instructor") {
			app.setCurrentTutor({
				...person,
				coursePermissions: cases.map(entry => entry.id),
				usersOfTutorLength: 0,
				editTutors: false
			});
		} else {
			app.setCurrentUser({
				...person,
				courseAccess: cases.map(entry => entry.id),
				editUsers: false
			});
		}
		for (const entry of cases) {
			const course = (await useCoursesStore().loadCourseById(entry.id))!;
			for (const title of entry.titles) {
				const authored = entry.source.modules[0].curriculum.find(
					item => item.title === title
				)!;
				const displayed = course.modules[0].curriculum.find(
					item => item.title === title
				)!;
				expect(displayed.content, `${role}: ${title}`).toBe(
					authored.content
				);
				expect(displayed.contentKind, title).toBe("reading");
				expect(isLessonLearningItem(displayed), title).toBe(true);
				expect(displayed.projectLink, title).toBe(authored.projectLink);
			}
		}
	}
});
