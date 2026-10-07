import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel3Course } from "@/stores/courses/cpp-level-3";
import { cppRowImportProjectBrief } from "@/stores/courses/cppRowImportProjectBrief";

const moduleTitle = "CPPI1 Command Architecture, File I/O, and Small Parsers";
const title = "CPPI1 Project 2: Import and Reject Bad Rows";
const source
	= "https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Import-and-Reject-Bad-Rows/";

describe("optional C++ selective import", () => {
	it("extends the required build while preserving course order and path counts", () => {
		const module = cppLevel3Course.modules.find(item => item.title === moduleTitle)!;
		const project = module.supplementalProjects.find(item => item.title === title)!;
		expect(project.learningPath).toBe("challenge");
		expect(project.ideImport).toBe(true);
		expect(project.projectLink).toBe(`${source}starter`);
		expect(project.solutionLink).toBe(`${source}solution`);
		expect(module.curriculum.at(-1)?.title).toBe("CPPI1 Project: Saveable Task Manager");
		expect(cppLevel3Course.modules.reduce((count, item) => count + item.curriculum.length, 0)).toBe(22);
		expect(cppLevel3Course.modules.reduce((count, item) => count + item.supplementalProjects.length, 0)).toBe(8);
		for (const contract of ["selective import policy", "two TODOs", "task_import.cpp", "11-file pack", "CLASSES_TASKS_V1", "UNFINISHED", "Import changes only current memory", "Fixed pass counters"])
			expect(project.content).toContain(contract);
	});

	it("retains the whole learner brief, rejection table and fatal-state boundary", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const project = course.modules.find(item => item.title === moduleTitle)!.supplementalProjects.find(item => item.title === title)!;
		expect(project.content.length).toBeGreaterThan(9000);
		for (const section of ["## Selective acceptance and reports", "## Fatal errors and saved state", "## Guided implementation and prediction", "## Build and hand-in evidence", "## Preserve an earlier attempt"])
			expect(project.content).toContain(section);
		expect(project.content).toContain("| Check | Exact reason |");
		expect(project.content).toContain("ID must increase beyond the current last ID");
		expect(project.content).toContain("Preserve both the ledger and the caller");
		expect(project.content).toContain("65536/65537");
		expect(project.solutionLink).toBeUndefined();
	});

	it("preserves the existing identity and creates a distinct confirmed current-pack route", async () => {
		const href = cppRowImportProjectBrief.match(/\]\((\/ide\?[^)]+)\)/)![1];
		const params = new URL(href, "https://classes.local").searchParams;
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const module = course.modules.find(item => item.title === moduleTitle)!;
		const project = module.supplementalProjects.find(item => item.title === title)!;
		expect(project.id).toBe("cpp-level-3-cppi1-command-architecture-file-i-o-and-small-parsers-supplemental-cppi1-project-2-import-and-reject-bad-rows");
		expect(params.get("course")).toBe("cpp-level-3");
		expect(params.get("mode")).toBe("cpp");
		expect(params.get("lesson")).toBe(module.id);
		expect(params.get("starterUrl")).toBe(`${source}starter`);
		expect(params.get("projectKey")).toBe("cpp-level-3:cppi1-import-and-reject-bad-rows:current-pack-v1");
		expect(cppRowImportProjectBrief).toContain("earlier project\nremains available in Projects");
	});

	it("exposes the comparison reference through authorized staff access", async () => {
		setActivePinia(createPinia());
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
		const course = (await useCoursesStore().loadCourseById("cpp-level-3"))!;
		const project = course.modules.find(item => item.title === moduleTitle)!.supplementalProjects.find(item => item.title === title)!;
		expect(project.solutionLink).toBe(`${source}solution`);
	});
});
