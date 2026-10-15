import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const urls = vi.hoisted(() => [
	"https://github.com/instruction-material/Python-Level-2/blob/main/main.py",
	"https://github.com/instruction-material/Java-Level-2/blob/main/Person.java#L12",
	"https://github.com/instruction-material/CPP-Level-2/blob/main/include/person.h",
	"https://github.com/instruction-material/Data-Science-in-Python/blob/main/scores.csv",
	"https://github.com/instruction-material/Network-Systems/blob/main/README.md",
	"https://github.com/example/lesson/blob/0123456789012345678901234567890123456789/WORKSHEET.md?plain=1#case-a"
]);

function referenceUrl(url: string) {
	const target = new URL(url);
	target.searchParams.set("reference", "1");
	return target.toString();
}

vi.mock("@/stores/courses/index", () => ({
	courseCatalog: [{ id: "file-resources", name: "File resources" }],
	loadRawCourse: vi.fn(async () => ({
		name: "File resources",
		modules: [
			{
				title: "Resources",
				curriculum: [
					...urls.map((url, index) => ({
						title: `Project ${index}: Source review`,
						content: "Use the linked source or reading.",
						projectLink: url,
						solutionLink: referenceUrl(url)
					})),
					{
						title: "Project: Biology CER Presentation",
						content:
							"Review the reference after recording a prediction.",
						solutionLink: urls[0]
					}
				],
				supplementalProjects: []
			}
		]
	}))
}));

it("preserves exact file, query and fragment targets through the real course store", async () => {
	setActivePinia(createPinia());
	useAppStore().setCurrentTutor({
		_id: "file-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["file-resources"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById("file-resources"))!;
	for (const [index, item] of course.modules[0].curriculum
		.slice(0, urls.length)
		.entries()) {
		expect(item.projectLink).toBe(urls[index]);
		expect(item.solutionLink).toBe(referenceUrl(urls[index]));
	}
	const reference = course.modules[0].curriculum.at(-1)!;
	expect(reference.solutionLink).toBe(urls[0]);
	expect(reference.projectLink).toBeUndefined();
	useAppStore().setCurrentTutor(null);
	useAppStore().setCurrentUser({
		_id: "learner",
		name: "Learner",
		email: "learner@example.invalid",
		age: 14,
		state: "GA",
		courseAccess: ["file-resources"],
		editUsers: false,
		saveEdit: "Save"
	});
	const learner = (await useCoursesStore().loadCourseById("file-resources"))!;
	expect(learner.modules[0].curriculum.map(item => item.id)).toEqual(
		course.modules[0].curriculum.map(item => item.id)
	);
	expect(learner.modules[0].curriculum.at(-1)!.solutionLink).toBeUndefined();
	expect(learner.modules[0].curriculum.at(-1)!.projectLink).toBeUndefined();
});
