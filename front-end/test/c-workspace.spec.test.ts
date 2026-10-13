import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";
import { cBuildInstructions } from "@/modules/cBuildInstructions";
import {
	c17CourseProjectKey,
	c17CourseResource,
	c17ImportFiles,
	c17VerifiedPacks,
	c17OpeningPacks,
	c17SourceRevision
} from "@/modules/c17ProjectResources";
import { getCodeIdeProjectSubtitle } from "@/modules/codeIdeProjectLabels";
import { createProjectArchive } from "@/modules/projectArchive";
import { pythonIdeCompletionsForMode } from "@/modules/pythonCodeMirror";
import { sandboxRun } from "@/modules/pythonSandbox";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	getPythonIdeFileKindLabel,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseId,
	pythonIdeModeForCourseResource,
	pythonIdeProjectToPayload,
	saveLocalPythonProjects
} from "@/modules/pythonIde";

const fixture = JSON.parse(
	readFileSync(
		resolve(process.cwd(), "../test/fixtures/c17-opening-contracts.json"),
		"utf8"
	)
) as {
	revision: string;
	revisions: Record<string, string>;
	files: Record<string, { content: string; sha256: string }>;
};
const root = `https://github.com/instruction-material/C-Systems-Engineering/tree/${c17SourceRevision}/`;
const roles = c17VerifiedPacks.flatMap(
	({ pack, revision, roleFiles, supportFiles }) =>
		(["starter", "solution"] as const).map(role => ({
			pack,
			role,
			revision,
			fileCount: roleFiles.length + supportFiles.length
		}))
);

afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

describe("native C17 source workspace", () => {
	it("retains the two opening core cards and retains their progress identities", async () => {
		setActivePinia(createPinia());
		useAppStore().setCurrentTutor({
			_id: "c17-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["c-systems-engineering"],
			editTutors: false,
			saveEdit: "Save"
		});
		const course = await useCoursesStore().loadCourseById(
			"c-systems-engineering"
		);
		const core = course!.modules
			.flatMap(module => module.curriculum)
			.filter(item => item.projectLink?.includes(c17SourceRevision));
		expect(core.map(item => item.id)).toEqual([
			"c-systems-engineering-cse0-setup-and-tooling-curriculum-core-project-c-systems-engineering",
			"c-systems-engineering-unit-1-why-c-for-systems-work-curriculum-core-project-why-c-for-systems-work"
		]);
		const notebooks = course!.modules
			.flatMap(module => module.supplementalProjects)
			.filter(item => item.projectLink?.includes(c17SourceRevision));
		expect(notebooks).toHaveLength(2);
		for (const item of notebooks) {
			expect(item.projectLink).toMatch(
				/\/blob\/[^/]+\/CSE-0[56]-[^/]+\/README\.md$/
			);
			expect(item.ideImport).not.toBe(true);
			expect(item.solutionLink).toBeUndefined();
		}
		for (const item of core) {
			expect(item.ideImport).toBe(true);
			expect(item.content).toContain("exits 78");
			expect(item.content).toContain("ctest --test-dir build");
			const pack = new URL(item.projectLink!).pathname.split("/").at(-2)!;
			const executable = fixture.files[
				`${pack}/starter/CMakeLists.txt`
			].content.match(/^add_executable\((\w+) main\.c/m)![1];
			expect(item.content).toContain(`./build/${executable}`);
			expect(
				pythonIdeModeForCourseResource(course!.id, item.projectLink!)
			).toBe("c");
			expect(
				pythonIdeModeForCourseResource(course!.id, item.solutionLink!)
			).toBe("c");
		}
		useAppStore().setCurrentTutor(null);
		const learnerCourse = await useCoursesStore().loadCourseById(
			"c-systems-engineering"
		);
		const learnerCore = learnerCourse!.modules
			.flatMap(module => module.curriculum)
			.filter(item => item.projectLink?.includes(c17SourceRevision));
		expect(learnerCore.map(item => item.id)).toEqual(
			core.map(item => item.id)
		);
		expect(learnerCore.every(item => item.solutionLink === undefined)).toBe(
			true
		);
	});

	it("connects all six verified core packs with complete reading, guide-only notebooks, and separate reference visibility", async () => {
		setActivePinia(createPinia());
		useAppStore().setCurrentTutor({
			_id: "c17-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["c-systems-engineering"],
			editTutors: false,
			saveEdit: "Save"
		});
		const course = await useCoursesStore().loadCourseById(
			"c-systems-engineering"
		);
		const core = course!.modules
			.flatMap(module => module.curriculum)
			.filter(item => c17CourseResource(item.projectLink ?? ""));
		expect(core).toHaveLength(6);
		const ids = core.map(item => item.id);
		expect(ids).toEqual([
			"c-systems-engineering-cse0-setup-and-tooling-curriculum-core-project-c-systems-engineering",
			"c-systems-engineering-unit-1-why-c-for-systems-work-curriculum-core-project-why-c-for-systems-work",
			"c-systems-engineering-unit-3-bitwise-operations-curriculum-project-bitflag-configuration-parser",
			"c-systems-engineering-unit-8-function-pointers-and-dispatch-curriculum-core-project-function-pointers-and-dispatch",
			"c-systems-engineering-unit-10-engineering-math-in-code-curriculum-core-project-engineering-math-in-code",
			"c-systems-engineering-unit-11-systems-tooling-curriculum-core-project-systems-tooling"
		]);
		for (const item of core.slice(2)) {
			const selected = c17CourseResource(item.projectLink!)!;
			const guide = fixture.files[`${selected.pack}/README.md`].content;
			expect(item.content).toContain(
				guide
					.slice(guide.indexOf("\n") + 1)
					.replaceAll("An instructor", "A course facilitator")
					.replaceAll("instructor", "course facilitator")
					.replaceAll(
						"The existing dispatcher should accept it without",
						"The existing dispatcher accepts it without"
					)
					.replaceAll(
						"the two TODO comments in",
						"the two `TODO` comments in"
					)
					.replaceAll(
						"the TODO in `main.c`",
						"the `TODO` in `main.c`"
					)
					.replaceAll(
						"Use `starter` for the learner attempt.",
						"The `starter` directory contains the implementation to complete."
					)
					.replaceAll(
						"Unlike earlier learners,",
						"Unlike earlier starter projects,"
					)
					.trim()
			);
			expect(item.ideImport).toBe(true);
			expect(item.content).toContain("Completion evidence");
			expect(
				pythonIdeModeForCourseResource(course!.id, item.solutionLink!)
			).toBe("c");
			const notebook = course!.modules
				.flatMap(module => module.supplementalProjects)
				.find(candidate =>
					candidate.projectLink?.includes(
						`/${selected.pack}/README.md`
					)
				)!;
			expect(notebook).toBeDefined();
			expect(notebook.projectLink).toContain(
				`/blob/${selected.resource.ref}/`
			);
			expect(notebook.ideImport).not.toBe(true);
			expect(notebook.solutionLink).toBeUndefined();
		}
		useAppStore().setCurrentTutor(null);
		const learner = await useCoursesStore().loadCourseById(
			"c-systems-engineering"
		);
		const learnerCore = learner!.modules
			.flatMap(module => module.curriculum)
			.filter(item => c17CourseResource(item.projectLink ?? ""));
		expect(learnerCore.map(item => item.id)).toEqual(ids);
		expect(learnerCore.every(item => item.solutionLink === undefined)).toBe(
			true
		);
	});

	it("keeps the inspector optional with its original identity, complete reading and a guide-only notebook", async () => {
		setActivePinia(createPinia());
		useAppStore().setCurrentTutor({
			_id: "c17-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["c-systems-engineering"],
			editTutors: false,
			saveEdit: "Save"
		});
		const course = await useCoursesStore().loadCourseById(
			"c-systems-engineering"
		);
		const module = course!.modules.find(
			item =>
				item.title === "Unit 2: Binary, Hex, and Number Representation"
		)!;
		expect(
			module.curriculum.some(item =>
				item.projectLink?.includes("CSE1-Hex-and-Binary-Inspector")
			)
		).toBe(false);
		const item = module.supplementalProjects.find(
			candidate => candidate.title === "Project: Hex and Binary Inspector"
		)!;
		const id =
			"c-systems-engineering-unit-2-binary-hex-and-number-representation-curriculum-project-hex-and-binary-inspector";
		expect(item.id).toBe(id);
		expect(item.learningPath).toBe("choice");
		expect(item.ideImport).toBe(true);
		const selected = c17CourseResource(item.projectLink!)!;
		expect(selected.pack).toBe("CSE1-Hex-and-Binary-Inspector");
		expect(selected.resource.ref).toBe(
			"24c52499af8db18b93f5f2807b9631fbe931620c"
		);
		const guide = fixture.files[selected.pack + "/README.md"].content;
		expect(item.content).toContain(
			guide
				.slice(guide.indexOf("\n") + 1)
				.trim()
				.replace("an instructor-guided", "a course-facilitated")
		);
		expect(item.content).toContain("all 65536 bit patterns");
		const notebook = module.supplementalProjects.find(candidate =>
			candidate.projectLink?.includes("/" + selected.pack + "/README.md")
		)!;
		expect(notebook.projectLink).toBe(
			"https://github.com/instruction-material/C-Systems-Engineering/blob/" +
				selected.resource.ref +
				"/" +
				selected.pack +
				"/README.md"
		);
		expect(notebook.ideImport).not.toBe(true);
		expect(notebook.solutionLink).toBeUndefined();
		for (const role of ["starter", "reference"] as const) {
			const url =
				role === "starter" ? item.projectLink! : item.solutionLink!;
			const key = c17CourseProjectKey(course!.id, id, role, url);
			expect(key).toBe(
				course!.id + ":" + id + ":" + role + ":native-c17"
			);
		}
		useAppStore().setCurrentTutor(null);
		const learner = await useCoursesStore().loadCourseById(
			"c-systems-engineering"
		);
		const learnerItem = learner!.modules
			.flatMap(m => m.supplementalProjects)
			.find(candidate => candidate.id === id)!;
		expect(learnerItem).toBeDefined();
		expect(learnerItem.solutionLink).toBeUndefined();
	});

	it("shows the inspector input and unfinished-task contracts in native build instructions", () => {
		const definition = c17VerifiedPacks.find(
			item => item.pack === "CSE1-Hex-and-Binary-Inspector"
		)!;
		const files = definition.roleFiles.map(name => ({
			name: "starter/" + name,
			content: fixture.files[definition.pack + "/starter/" + name].content
		}));
		const url =
			"https://github.com/instruction-material/C-Systems-Engineering/tree/" +
			definition.revision +
			"/" +
			definition.pack +
			"/starter";
		const text = cBuildInstructions(files, url).join("\n");
		expect(text).toContain("With valid input");
		expect(text).toContain("exits 78");
		expect(text).toContain(
			"Invalid input exits 2 without printing a result"
		);
		expect(text).toContain("complete input grammar");
		expect(text).toContain("ctest --test-dir build");
		expect(text).not.toContain("debugger pass");
	});

	it("explains the required byte parser's valid layout and incomplete learner separately from bad input", () => {
		const definition = c17VerifiedPacks.find(
			item => item.pack === "CSE2-Bitflag-Configuration-Parser"
		)!;
		const url = `https://github.com/instruction-material/C-Systems-Engineering/tree/${definition.revision}/${definition.pack}/starter`;
		const files = c17ImportFiles(url)!.map(({ name }) => ({
			name,
			content: fixture.files[`${definition.pack}/${name}`].content
		}));
		const text = cBuildInstructions(files, url).join("\n");
		expect(text).toContain(
			"All byte values 0..255 and all four modes are valid"
		);
		expect(text).toContain("Reserved bits produce a warning");
		expect(text).toContain("encryption flag only reports a bit");
		expect(text).toContain("three configuration functions");
		expect(text).toContain("Invalid input exits 2");
		expect(text).not.toContain("debugger pass");
	});

	it.each(c17VerifiedPacks)(
		"rejects a mismatched accepted revision for $pack without fetching source",
		async ({ pack, revision }) => {
			const wrong =
				revision === c17SourceRevision
					? "aa4ccdf9398472351985c8cce3d20a719addca5a"
					: c17SourceRevision;
			const url = `${root.replace(c17SourceRevision, wrong)}${pack}/starter`;
			const fetcher = vi.fn();
			vi.stubGlobal("fetch", fetcher);
			expect(c17CourseResource(url)).toBeNull();
			await expect(
				loadPythonIdeStarterFilesFromGitHub(url, "c")
			).rejects.toThrow("no verified site import");
			expect(fetcher).not.toHaveBeenCalled();
		}
	);

	it("describes the deliberate tooling compilation failure before its link and sanitizer repairs", async () => {
		const pack = c17VerifiedPacks[4];
		const url = `${root.replace(c17SourceRevision, pack.revision)}${pack.pack}/starter`;
		const files = [
			...pack.roleFiles.map(name => ({
				name: `starter/${name}`,
				content: fixture.files[`${pack.pack}/starter/${name}`].content
			})),
			{
				name: "README.md",
				content: fixture.files[`${pack.pack}/README.md`].content
			}
		];
		const text = cBuildInstructions(files, url).join("\n");
		expect(text).toContain("intentionally fails strict compilation");
		expect(text).toContain("missing symbol");
		expect(text).toContain("signed overflow");
		expect(text).not.toContain("exits 78");
		expect(cBuildInstructions(files).join("\n")).not.toContain("exits 78");
	});

	it.each(roles)(
		"imports and exports exact $pack/$role bytes with only the selected role",
		async ({ pack, role, revision, fileCount }) => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (url: string) => {
					requests.push(url);
					const prefix = `https://raw.githubusercontent.com/instruction-material/C-Systems-Engineering/${revision}/`;
					expect(url.startsWith(prefix)).toBe(true);
					const source = fixture.files[url.slice(prefix.length)];
					if (!source)
						throw new Error(`Unexpected source request: ${url}`);
					return new Response(source.content);
				})
			);
			expect(fixture.revision).toBe(c17SourceRevision);
			const url = `${root.replace(c17SourceRevision, revision)}${pack}/${role}`;
			expect(
				pythonIdeModeForCourseResource("c-systems-engineering", url)
			).toBe("c");
			const files = await loadPythonIdeStarterFilesFromGitHub(url, "c");
			const key = c17CourseProjectKey(
				"c-systems-engineering",
				"lesson",
				role === "starter" ? "starter" : "reference",
				url
			);
			const project = createPythonIdeProject("c", {
				courseID: "c-systems-engineering",
				courseProjectKey: key,
				files
			});
			expect(project.activeFileName).toBe(`${role}/main.c`);
			expect(getCodeIdeProjectSubtitle(project)).toBe(
				`${role === "starter" ? "Learner" : "Reference"} · C17`
			);
			saveLocalPythonProjects([project]);
			const [saved] = loadLocalPythonProjects();
			expect(saved.files).toEqual(files);
			expect(pythonIdeProjectToPayload(saved).mode).toBe("c");
			const bytes = createProjectArchive(saved);
			if (process.env.C17_EXPORT_PROOF_DIR) {
				mkdirSync(process.env.C17_EXPORT_PROOF_DIR, {
					recursive: true
				});
				writeFileSync(
					resolve(
						process.env.C17_EXPORT_PROOF_DIR,
						`${pack}-${role}.zip`
					),
					bytes
				);
			}
			const archive = unzipSync(bytes);
			for (const file of files) {
				const source = fixture.files[`${pack}/${file.name}`];
				expect(file.content).toBe(source.content);
				const exported = archive[`${saved.title}/${file.name}`]!;
				expect(strFromU8(exported)).toBe(source.content);
				expect(
					createHash("sha256").update(exported).digest("hex")
				).toBe(source.sha256);
			}
			expect(files).toHaveLength(fileCount);
			expect(
				requests.some(url =>
					url.includes(
						`/${role === "starter" ? "solution" : "starter"}/`
					)
				)
			).toBe(false);
			expect(cBuildInstructions(files, url).join("\n")).toContain(
				`cd ${role}`
			);
			expect(cBuildInstructions(files, url).join("\n")).toContain(
				"ctest --test-dir build"
			);
			expect(
				cBuildInstructions(files, url)
					.join("\n")
					.includes("unsafe_probe.c")
			).toBe(pack === c17OpeningPacks[0]);
		}
	);

	it.each([
		root.replace(c17SourceRevision, "main") +
			c17OpeningPacks[0] +
			"/starter",
		root + "CSE-07-unit-8-function-pointers-and-dispatch/starter",
		root + c17OpeningPacks[0] + "/starter/main.c",
		root.replace("instruction-material", "unverified-owner") +
			c17OpeningPacks[0] +
			"/starter"
	])(
		"rejects unverified C imports before a source request: %s",
		async url => {
			const fetcher = vi.fn();
			vi.stubGlobal("fetch", fetcher);
			expect(
				pythonIdeModeForCourseResource("c-systems-engineering", url)
			).toBeNull();
			await expect(
				loadPythonIdeStarterFilesFromGitHub(url, "c")
			).rejects.toThrow("no verified site import");
			expect(fetcher).not.toHaveBeenCalled();
		}
	);

	it("keeps native C separate from Python execution and the legacy C++ course", () => {
		expect(pythonIdeModeForCourseId("c-level-1")).toBe("cpp");
		expect(pythonIdeModeForCourseId("c-systems-engineering")).toBe("c");
		for (const template of [
			"blank",
			"course",
			"demo",
			"outline"
		] as const) {
			const project = createPythonIdeProject("c", { template });
			expect(project.activeFileName).toBe("main.c");
			expect(project.files.some(file => file.name.endsWith(".py"))).toBe(
				false
			);
			expect(
				sandboxRun({
					mode: "c",
					files: project.files,
					activeFileName: "main.c",
					inputText: ""
				})
			).toBeNull();
		}
		expect(pythonIdeCompletionsForMode("c")).toEqual([]);
		expect(getPythonIdeFileKindLabel("starter/main.c")).toBe("C");
		expect(getPythonIdeFileKindLabel("starter/CMakeLists.txt")).toBe(
			"Build file"
		);
	});

	it("retains safe C paths without allowing arbitrary nested data or shell paths", () => {
		for (const path of [
			"starter/main.c",
			"solution/reading.h",
			"starter/CMakeLists.txt",
			"unsafe_probe.c",
			"README.md"
		])
			expect(isValidPythonFileName(path)).toBe(true);
		for (const path of [
			"../main.c",
			"/main.c",
			"src//main.c",
			"images/main.c",
			"images/CMakeLists.txt",
			"src/notes.txt",
			"src/README.md",
			"main';echo.c",
			"turtle.py"
		])
			expect(isValidPythonFileName(path)).toBe(false);
	});

	it.each(c17VerifiedPacks)(
		"preserves earlier attempts when $pack learner and reference keys are created",
		({ pack, revision }) => {
			const existing = createPythonIdeProject("python", {
				courseProjectKey: "c-systems-engineering:lesson:starter"
			});
			existing.files[0].content = "# saved before native imports\n";
			const original = structuredClone(existing);
			const learner = createPythonIdeProject("c", {
				courseProjectKey: c17CourseProjectKey(
					"c-systems-engineering",
					"lesson",
					"starter",
					`${root.replace(c17SourceRevision, revision)}${pack}/starter`
				)
			});
			const reference = createPythonIdeProject("c", {
				courseProjectKey: c17CourseProjectKey(
					"c-systems-engineering",
					"lesson",
					"reference",
					`${root.replace(c17SourceRevision, revision)}${pack}/solution`
				)
			});
			expect(
				new Set([
					existing.courseProjectKey,
					learner.courseProjectKey,
					reference.courseProjectKey
				]).size
			).toBe(3);
			saveLocalPythonProjects([existing, learner, reference]);
			expect(loadLocalPythonProjects()[0]).toEqual(original);
		}
	);
});
