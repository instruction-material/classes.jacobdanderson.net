import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";
import { cppValueTemplateLessons } from "@/stores/courses/cppValueTemplateLessons";

const base = "https://github.com/instruction-material/CPP-Level-3/";
const anchor =
	"cpp-level-3-cppi5-value-types-operator-overloading-and-templates";
const programs = (text: string) =>
	[...text.matchAll(/```cpp\n([\s\S]*?)\n```/g)].map(match => match[1]);
const links = (text: string) =>
	[...text.matchAll(/\]\((\/ide\?[^)]+)\)/g)].map(
		match => new URL(match[1], "https://classes.local").searchParams
	);

describe("complete value and template teaching with separate diagnostic practice", () => {
	beforeEach(() => setActivePinia(createPinia()));
	for (const role of ["learner", "instructor"] as const) {
		it(`preserves scope, full programs and separate references for ${role}`, async () => {
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "value-tutor",
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
				item.title.startsWith("CPPI5 ")
			)!;
			const [values, templates, project] = module.curriculum;
			for (const [lesson, key] of [
				[values, "values"],
				[templates, "templates"]
			] as const) {
				expect(isLessonLearningItem(lesson)).toBe(true);
				expect(programs(lesson.content)).toEqual(
					programs(cppValueTemplateLessons[key])
				);
			}
			expect(programs(values.content)).toHaveLength(1);
			expect(programs(templates.content)).toHaveLength(2);
			expect(templates.content).toContain("class ValueBox");
			expect(templates.content).toContain("const T& value() const");
			expect(project.id).toBe(
				`${anchor}-curriculum-cppi5-project-score-or-fraction-toolkit`
			);
			expect(project.title).toBe("CPPI5 Project: Fraction Toolkit");
			expect(project.learningPath).toBe("core");
			expect(project.ideImport).toBe(true);
			expect(isLessonLearningItem(project)).toBe(false);
			expect(project.projectLink).toBe(
				`${base}tree/main/CPPI5-Fraction-Toolkit/starter`
			);
			expect(project.solutionLink).toBe(
				role === "instructor"
					? `${base}tree/main/CPPI5-Fraction-Toolkit/solution`
					: undefined
			);
			for (const word of [
				"constructFraction",
				"compareFraction",
				"addFraction",
				"multiplyFraction",
				"chooseSmaller",
				"1,000,000",
				"Unfinished task",
				"Open current pack separately",
				"no result output"
			])
				expect(project.content).toContain(word);
			const worksheet = module.supplementalProjects[0];
			expect(worksheet.learningPath).toBe("challenge");
			expect(worksheet.ideImport).toBe(false);
			expect(worksheet.projectLink).toBe(
				`${base}blob/main/CPPI5-Template-Error-Reading-Drill/WORKSHEET.md`
			);
			expect(worksheet.content).toContain(
				"Reading this worksheet imports no code"
			);
			expect(worksheet.content).toContain("CPPI5_TRIGGER_TEMPLATE_ERROR");
			expect(worksheet.content).toContain(
				"Open separate template practice"
			);
			expect(worksheet.content).not.toContain("reference-pack-v1");
			if (role === "instructor") {
				const reference = new URL(
					worksheet.solutionLink!,
					"https://classes.local"
				).searchParams;
				expect(reference.get("starterUrl")).toBe(
					`${base}tree/main/CPPI5-Template-Error-Reading-Drill/solution`
				);
				expect(reference.get("projectKey")).toBe(
					"cpp-level-3:cppi5-template-diagnostic:reference-pack-v1"
				);
			} else expect(worksheet.solutionLink).toBeUndefined();
		});
	}
	it("retains the normal primary identity and independent current/practice identities", () => {
		const [saved, practice] = links(cppValueTemplateLessons.worksheet);
		const [fresh] = links(cppValueTemplateLessons.project);
		expect(saved.get("projectKey")).toBe(
			`cpp-level-3:${anchor}-curriculum-cppi5-project-score-or-fraction-toolkit:starter`
		);
		expect(fresh.get("projectKey")).toBe(
			"cpp-level-3:cppi5-fraction-toolkit:current-pack-v1"
		);
		expect(practice.get("projectKey")).toBe(
			"cpp-level-3:cppi5-template-diagnostic:current-pack-v1"
		);
		for (const action of [saved, fresh, practice])
			expect(action.get("lesson")).toBe(anchor);
		expect(
			cppLevel3Course.modules.reduce(
				(n, item) => n + item.curriculum.length,
				0
			)
		).toBe(22);
		expect(
			cppLevel3Course.modules.reduce(
				(n, item) => n + item.supplementalProjects.length,
				0
			)
		).toBe(14);
	});
	it("keeps the actual diagnostic packs importable", () => {
		expect(
			pythonIdeModeForCourseResource(
				"cpp-level-3",
				`${base}blob/main/CPPI5-Template-Error-Reading-Drill/WORKSHEET.md`
			)
		).toBeNull();
		for (const folder of [
			"CPPI5-Fraction-Toolkit",
			"CPPI5-Template-Error-Reading-Drill"
		]) {
			for (const role of ["starter", "solution"])
				expect(
					pythonIdeModeForCourseResource(
						"cpp-level-3",
						`${base}tree/main/${folder}/${role}`
					)
				).toBe("cpp");
		}
	});
});
