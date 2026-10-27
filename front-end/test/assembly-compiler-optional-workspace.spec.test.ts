import { readingWithoutFilenameFormatting } from "./course-reading-format";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { assemblyBuildInstructions } from "@/modules/assemblyBuildInstructions";
import {
	assemblyCourseProjectKey,
	assemblyCourseResource
} from "@/modules/assemblyProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixtures = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/assembly-compiler-optional-contracts.json"
		),
		"utf8"
	)
) as {
	pack: string;
	revision: string;
	mode: "promotions" | "aliasing";
	moduleId: string;
	itemId: string;
	continuationItemId?: string;
	files: Record<string, { content: string; sha256: string }>;
}[];
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("keeps distinct byte-promotion and pointer-alias investigations optional with all published identities and the required compiler project intact", async () => {
	expect(fixtures.map(fixture => fixture.mode)).toEqual(["promotions", "aliasing"]);
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "compiler-optional-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["assembly"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById("assembly"))!;
	const identities = course.modules.flatMap(module =>
		(
			[
				["core", module.curriculum],
				["optional", module.supplementalProjects]
			] as const
		).flatMap(([section, items]) =>
			items.map(item => ({ moduleId: module.id, id: item.id, section }))
		)
	);
	expect(
		createHash("sha256").update(JSON.stringify(identities)).digest("hex")
	).toBe("96c875e17d62a6c7f527e2ee93557817fc261db4b683db1007c8741b0505b72c");
	expect(course.modules.flatMap(module => module.curriculum)).toHaveLength(
		50
	);
	const module = course.modules.find(
		module => module.id === fixtures[0].moduleId
	)!;
	expect(module.supplementalProjects).toHaveLength(3);
	expect(
		module.curriculum.find(item =>
			item.id.endsWith(
				"curriculum-core-project-reading-compiler-output"
			)
		)?.projectLink
	).toContain(
		"4fabbbe92deb893d14e2572121fc2393ae426c7b/ASM-08-unit-9-reading-compiler-output/starter"
	);
	for (const fixture of fixtures) {
		const item = module.supplementalProjects.find(
			item => item.id === fixture.itemId
		)!;
		expect(item.learningPath).toBe(
			fixture.mode === "aliasing" ? "challenge" : "choice"
		);
		expect(item.ideImport).toBe(true);
		expect(readingWithoutFilenameFormatting(item.content)).toContain(
			readingWithoutFilenameFormatting(
				fixture.files[fixture.pack + "/README.md"].content.trim()
			)
		);
		expect(item.projectLink).toBe(
			`https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/starter`
		);
		expect(item.solutionLink).toBe(
			`https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/solution`
		);
	}
	app.setCurrentTutor(null);
	const learner = (await useCoursesStore().loadCourseById("assembly"))!;
	for (const fixture of fixtures) {
		const item = learner.modules
			.flatMap(module => module.supplementalProjects)
			.find(item => item.id === fixture.itemId)!;
		expect(item.projectLink).toContain(fixture.revision);
		expect(item.solutionLink).toBeUndefined();
	}
});

it.each(fixtures.flatMap(fixture => ["starter", "solution"].map(role => ({fixture, role}))))(
  "keeps $fixture.mode/$role observation edits separate from executable source and earlier work",
  async ({fixture, role}) => {
    const requests: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL) => {
      const url = String(input); requests.push(url);
      const file = fixture.files[url.split("/" + fixture.revision + "/")[1]];
      return new Response(file?.content ?? "missing", {status: file ? 200 : 404});
    }));
    const url = `https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/${role}`;
    const files = await loadPythonIdeStarterFilesFromGitHub(url, "assembly");
    expect(files).toHaveLength(10); expect(requests).toHaveLength(10);
    for (const file of files) {
      const expected = fixture.files[`${fixture.pack}/${file.name}`];
      expect(file.content).toBe(expected.content);
      expect(createHash("sha256").update(file.content).digest("hex")).toBe(expected.sha256);
    }
    const key = assemblyCourseProjectKey("assembly", fixture.itemId, role === "starter" ? "starter" : "reference", url);
    const earlier = createPythonIdeProject("python", {courseProjectKey: key.replace(/:native-assembly$/, "")});
    const opposite = createPythonIdeProject("assembly", {courseProjectKey: key.replace(role === "starter" ? ":starter:" : ":reference:", role === "starter" ? ":reference:" : ":starter:")});
    const project = createPythonIdeProject("assembly", {files, starterUrl: url, courseProjectKey: key});
    expect(project.activeFileName).toBe(`${role}/analysis.md`);
    const exact = createProjectArchive(project);
    const directory = process.env.ASSEMBLY_EXPORT_PROOF_DIR;
    if (directory) { mkdirSync(directory, {recursive: true}); writeFileSync(join(directory, `${fixture.pack}-${role}.zip`), exact); }
    project.files = project.files.map(file => ({...file, content: file.content + (file.name === `${role}/analysis.md` ? "\nSaved compiler observation.\n" : "")}));
    saveLocalPythonProjects([earlier, opposite, project]);
    const restored = loadLocalPythonProjects();
    expect(restored.find(item => item._id === earlier._id)).toEqual(earlier);
    expect(restored.find(item => item._id === opposite._id)).toEqual(opposite);
    const saved = restored.find(item => item._id === project._id)!;
    expect(saved.activeFileName).toBe(`${role}/analysis.md`);
    expect(saved.files).toEqual(project.files);
    const entries = unzipSync(createProjectArchive(saved)); expect(Object.keys(entries)).toHaveLength(10);
    for (const file of saved.files) expect(strFromU8(entries[saved.title + "/" + file.name])).toBe(file.content);
    expect(saved.files.filter(file => file.content !== files.find(original => original.name === file.name)!.content).map(file => file.name)).toEqual([`${role}/analysis.md`]);
    const instructions = assemblyBuildInstructions(files, url).join("\n");
    for (const token of ["Linux x86-64", "Both role programs already work", "analysis.md", "baseline.c", "operation.c", "build-O0", "build-O2", "objdump", "gdb", "without LTO", "10269"]) expect(instructions).toContain(token);
    expect(instructions).not.toMatch(/POINTER_LOOKUP|COPY_DIRECTION|ARGUMENT_REGISTER|STACK_ARGUMENT/);
    expect(assemblyBuildInstructions(files.filter(file => file.name !== `${role}/baseline.c`), url).join("\n")).toContain("incomplete");
    expect(assemblyCourseResource(url.replace(fixture.revision, "main"))).toBeNull();
  }
);
