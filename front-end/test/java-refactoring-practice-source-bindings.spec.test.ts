import { createHash, webcrypto } from "node:crypto";
import { createPinia, setActivePinia } from "pinia";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, expect, it, vi } from "vitest";
import studios from "../../test/fixtures/java-studios-sources.json";
import collaboration from "../../test/fixtures/java-collaboration-sources.json";
import creational from "../../test/fixtures/java-creational-sources.json";
import { javaRefactoringPracticeUnits } from "@/modules/javaRefactoringPracticeUnits";
import { javaRefactoringProjectKey } from "@/modules/javaRefactoringResources";
import {
	javaRefactoringUnitProjectKey,
	javaRefactoringUnitURL
} from "@/modules/javaRefactoringUnits";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

for (const unit of javaRefactoringPracticeUnits) {
	const fixture =
		unit.id === "practice-collaboration"
			? collaboration
			: unit.id === "practice-creational"
				? creational
				: studios;
	const sources: Record<string, { content: string; sha256: string }> =
		fixture.files;
	it.each(["starter", "solution"] as const)(
		unit.id +
			": imports exact %s bytes and retains edits through save/reopen/export",
		async role => {
			vi.stubGlobal("crypto", webcrypto);
			const prefix =
				"https://raw.githubusercontent.com/" +
				fixture.repository +
				"/" +
				fixture.revision +
				"/";
			const fetched: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (input: string) => {
					expect(input.startsWith(prefix)).toBe(true);
					const path = input.slice(prefix.length);
					expect(sources[path], path).toBeDefined();
					fetched.push(path);
					return new Response(sources[path].content);
				})
			);
			const url = javaRefactoringUnitURL(unit.id, role);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				url,
				"java"
			);
			expect(files.map(file => file.name).sort()).toEqual(
				[...unit.files[role]].sort()
			);
			expect(fetched).toHaveLength(unit.files[role].length);
			for (const file of files) {
				const source =
					sources[unit.pack + "/" + role + "/" + file.name];
				expect(file.content).toBe(source.content);
				expect(
					createHash("sha256").update(file.content).digest("hex")
				).toBe(source.sha256);
			}
			const roleKey = role === "starter" ? "starter" : "reference";
			const project = createPythonIdeProject("java", {
				files,
				courseID: unit.courseID,
				courseProjectKey: javaRefactoringUnitProjectKey(
					unit.courseID,
					unit.coreID,
					roleKey,
					url
				)
			});
			expect(project.activeFileName).toBe("Main.java");
			project.files.find(file => file.name === "Main.java")!.content +=
				"\n// Saved source-binding attempt\n";
			await saveLocalPythonProjects([project]);
			const reopened = (await loadLocalPythonProjects()).find(
				value => value._id === project._id
			)!;
			expect(reopened).toEqual(project);
			const zip = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(zip)).toHaveLength(files.length);
			for (const file of reopened.files) {
				const member = Object.keys(zip).find(name =>
					name.endsWith("/" + file.name)
				)!;
				expect(strFromU8(zip[member])).toBe(file.content);
			}
		}
	);
}

it("keeps five practice attempts separate across both roles and uses the actual course action key", () => {
	const keys: string[] = [];
	for (const unit of javaRefactoringPracticeUnits) {
		for (const item of unit.sourceItems) {
			for (const role of ["starter", "reference"] as const) {
				const url = javaRefactoringUnitURL(
					unit.id,
					role === "starter" ? "starter" : "solution"
				);
				const key = javaRefactoringProjectKey(
					unit.courseID,
					item,
					role,
					url
				);
				expect(key).toBe(
					[unit.courseID, item, role, "native-java-" + unit.id].join(
						":"
					)
				);
				const instructions =
					javaNativeBuildInstructions(key)!.join("\n");
				expect(instructions).toContain("ContractTests core");
				expect(instructions).toContain("sources.txt");
				expect(instructions).toContain("role files");
				keys.push(key);
			}
		}
	}
	expect(new Set(keys).size).toBe(10);
});

it.each(["learner", "instructor"] as const)(
	"binds every optional practice card to its exact role source for %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "refactoring-practice-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["design-patterns-in-java-part-2"],
				editTutors: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(
			"design-patterns-in-java-part-2"
		))!;
		const module = course.modules.find(module =>
			module.id.endsWith("-project-practice-guide")
		)!;
		expect(module.supplementalProjects).toHaveLength(5);
		for (const item of module.supplementalProjects) {
			const unit = javaRefactoringPracticeUnits.find(unit =>
				(unit.sourceItems as readonly string[]).includes(item.id)
			)!;
			expect(unit, item.id).toBeDefined();
			expect(item.projectLink).toBe(
				javaRefactoringUnitURL(unit.id, "starter")
			);
			expect(item.solutionLink).toBe(
				role === "instructor"
					? javaRefactoringUnitURL(unit.id, "solution")
					: undefined
			);
			expect(item.learningPath).toBe("choice");
			expect(item.content).toContain("Case inputs");
			expect(item.content).toContain("Project self-check");
		}
	}
);
