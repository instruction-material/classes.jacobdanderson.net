import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";
import { cppResourceSafetyLessons } from "@/stores/courses/cppResourceSafetyLessons";

const base = "https://github.com/instruction-material/CPP-Level-3/";
const anchor =
	"cpp-level-3-cppi4-raii-smart-pointers-and-robust-error-handling";

describe("complete resource safety teaching and saved ownership reflection", () => {
	beforeEach(() => setActivePinia(createPinia()));
	for (const role of ["learner", "instructor"] as const) {
		it(`preserves project scope and separates worked material for ${role}`, async () => {
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "resource-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: ["cpp-level-3"],
					editTutors: false,
					saveEdit: "Save"
				});
			const course =
				(await useCoursesStore().loadCourseById("cpp-level-3"))!;
			const module = course.modules.find(item =>
				item.title.startsWith("CPPI4 ")
			)!;
			const [ownership, errors, project] = module.curriculum;
			for (const lesson of [ownership, errors]) {
				expect(isLessonLearningItem(lesson)).toBe(true);
				expect(lesson.content).toContain("```cpp");
				expect(lesson.content).toContain("c++ -std=c++20");
			}
			expect(ownership.content).toContain("first empty: true");
			expect(ownership.content).toContain(
				"incomplete object's destructor does not run"
			);
			expect(errors.content).toContain("accepted.swap(candidate)");
			expect(errors.content).toContain("Accepted: 84");
			expect(project.id).toBe(
				anchor +
					"-curriculum-cppi4-project-resource-safe-file-processor"
			);
			expect(project.learningPath).toBe("core");
			expect(project.ideImport).toBe(true);
			expect(project.projectLink).toBe(
				base + "tree/main/CPPI4-Resource-Safe-File-Processor/starter"
			);
			expect(project.solutionLink).toBe(
				role === "instructor"
					? base +
							"tree/main/CPPI4-Resource-Safe-File-Processor/solution"
					: undefined
			);
			for (const requirement of [
				"parseScoreRow",
				"readScores",
				"writeReport",
				"processFile",
				"CPPI4_SCORES_V1",
				"CPPI4_REPORT_V1",
				"16,384",
				"128 bytes",
				"100 records",
				"successful rename",
				"Unfinished task",
				"Open current pack separately"
			])
				expect(project.content.replace(/\s+/g, " ")).toContain(
					requirement
				);
			const worksheet = module.supplementalProjects[0];
			expect(worksheet.id).toBe(
				anchor +
					"-supplemental-cppi4-project-2-ownership-rewrite-reflection"
			);
			expect(worksheet.learningPath).toBe("choice");
			expect(worksheet.ideImport).toBe(false);
			expect(worksheet.projectLink).toBe(
				base +
					"blob/main/CPPI4-Ownership-Rewrite-Reflection/starter/NOTES.md"
			);
			expect(worksheet.solutionLink).toBe(
				role === "instructor"
					? base +
							"blob/main/CPPI4-Ownership-Rewrite-Reflection/solution/WORKED.md"
					: undefined
			);
			expect(worksheet.content).toContain(
				"Continue saved file processor"
			);
			expect(worksheet.content).not.toContain("WORKED.md");
		});
	}
	it("reopens the stable primary key and offers a separate current pack", () => {
		const parameters = (text: string) =>
			new URL(
				text.match(/\]\((\/ide\?[^)]+)\)/)![1],
				"https://classes.local"
			).searchParams;
		const saved = parameters(cppResourceSafetyLessons.worksheet);
		expect(saved.get("projectKey")).toBe(
			"cpp-level-3:" +
				anchor +
				"-curriculum-cppi4-project-resource-safe-file-processor:starter"
		);
		expect(saved.get("starterUrl")).toBe(
			base + "tree/main/CPPI4-Resource-Safe-File-Processor/starter"
		);
		expect(saved.get("lesson")).toBe(anchor);
		const fresh = parameters(cppResourceSafetyLessons.project);
		expect(fresh.get("projectKey")).toBe(
			"cpp-level-3:cppi4-resource-safe-file-processor:current-pack-v1"
		);
		expect(
			cppLevel3Course.modules.reduce(
				(count, module) => count + module.curriculum.length,
				0
			)
		).toBe(22);
		expect(
			cppLevel3Course.modules.reduce(
				(count, module) => count + module.supplementalProjects.length,
				0
			)
		).toBe(14);
	});
	it("keeps only the exact known worksheet out of program imports", () => {
		for (const path of [
			"tree/main/CPPI4-Ownership-Rewrite-Reflection/starter",
			"blob/main/CPPI4-Ownership-Rewrite-Reflection/starter/NOTES.md",
			"blob/main/CPPI4-Ownership-Rewrite-Reflection/solution/WORKED.md",
			"blob/main/CPPI4-Ownership-Rewrite-Reflection/solution/main.cpp"
		])
			expect(
				pythonIdeModeForCourseResource("cpp-level-3", base + path)
			).toBeNull();
		for (const url of [
			base + "tree/main/CPPI4-Resource-Safe-File-Processor/starter",
			base + "tree/main/CPPI4-Ownership-Rewrite-Reflection-Extra/starter",
			"https://github.com/another-owner/CPP-Level-3/tree/main/CPPI4-Ownership-Rewrite-Reflection/starter"
		])
			expect(pythonIdeModeForCourseResource("cpp-level-3", url)).toBe(
				"cpp"
			);
	});
});
