import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";
import { cppTaskManagerBriefs } from "@/stores/courses/cppTaskManagerBriefs";

const moduleTitle = "CPPI1 Command Architecture, File I/O, and Small Parsers";
const projectTitle = "CPPI1 Project: Saveable Task Manager";
const source =
	"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Saveable-Task-Manager/";

describe("C++ task commands and persistence", () => {
	it("keeps the required project and its full boundaries before distinct extensions", () => {
		const module = cppLevel3Course.modules.find(
			item => item.title === moduleTitle
		)!;
		const project = module.curriculum.find(
			item => item.title === projectTitle
		)!;
		expect(project.learningPath).toBe("core");
		expect(project.ideImport).toBe(true);
		expect(project.projectLink).toBe(source + "starter");
		expect(project.solutionLink).toBe(source + "solution");
		for (const contract of [
			"command_parser.cpp",
			"task_storage.cpp",
			"CLASSES_TASKS_V1",
			"64 KiB",
			"Neither",
			"UNFINISHED",
			"a bad last row must leave the current list intact"
		])
			expect(project.content).toContain(contract);
		expect(module.supplementalProjects.map(item => item.title)).toEqual([
			"CPPI1 Project 2: Import and Reject Bad Rows",
			"CPPI1 Project 3: Mini Command Scanner"
		]);
		expect(module.curriculum[0]?.content).toContain(
			"syntactic validity from domain validity"
		);
		expect(module.curriculum[1]?.content).toContain(
			"A successful parse is a request"
		);
	});

	it("offers a separate confirmed current pack while keeping older attempt identity", async () => {
		const href =
			cppTaskManagerBriefs.project.match(/\]\((\/ide\?[^)]+)\)/)![1];
		const params = new URL(href, "https://classes.local").searchParams;
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const module = course.modules.find(item => item.title === moduleTitle)!;
		const project = module.curriculum.find(
			item => item.title === projectTitle
		)!;
		expect(module.id).toBe(
			"cpp-level-3-cppi1-command-architecture-file-i-o-and-small-parsers"
		);
		expect(project.id).toBe(
			"cpp-level-3-cppi1-command-architecture-file-i-o-and-small-parsers-curriculum-cppi1-project-saveable-task-manager"
		);
		expect(params.get("lesson")).toBe(module.id);
		expect(params.get("course")).toBe("cpp-level-3");
		expect(params.get("mode")).toBe("cpp");
		expect(params.get("starterUrl")).toBe(source + "starter");
		expect(params.get("projectKey")).toBe(
			"cpp-level-3:cppi1-saveable-task-manager:current-pack-v1"
		);
		expect(params.get("lesson")).toBe(
			"cpp-level-3-cppi1-command-architecture-file-i-o-and-small-parsers"
		);
		expect(cppTaskManagerBriefs.project).toContain(
			"earlier project\nremains available in Projects"
		);
	});

	it("withholds the reference from learners and exposes it to authorized staff", async () => {
		setActivePinia(createPinia());
		const learner =
			(await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const project = learner.modules
			.find(item => item.title === moduleTitle)!
			.curriculum.find(item => item.title === projectTitle)!;
		expect(project.solutionLink).toBeUndefined();
		expect(project.projectLink).toBe(source + "starter");
		useAppStore().setCurrentTutor({
			_id: "tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["cpp-level-3"],
			editTutors: false,
			saveEdit: "Save"
		});
		const staff = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		expect(
			staff.modules
				.find(item => item.title === moduleTitle)!
				.curriculum.find(item => item.title === projectTitle)!
				.solutionLink
		).toBe(source + "solution");
	});
});
