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
	files: Record<string, { content: string; sha256: string }>;
};
const root = `https://github.com/instruction-material/C-Systems-Engineering/tree/${c17SourceRevision}/`;
const roles = c17OpeningPacks.flatMap(pack =>
	(["starter", "solution"] as const).map(role => ({ pack, role }))
);

afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

describe("native C17 source workspace", () => {
	it("connects only the two verified core cards and retains their progress identities", async () => {
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

	it.each(roles)(
		"imports and exports exact $pack/$role bytes with only the selected role",
		async ({ pack, role }) => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (url: string) => {
					requests.push(url);
					const prefix = `https://raw.githubusercontent.com/instruction-material/C-Systems-Engineering/${c17SourceRevision}/`;
					expect(url.startsWith(prefix)).toBe(true);
					const source = fixture.files[url.slice(prefix.length)];
					if (!source)
						throw new Error(`Unexpected source request: ${url}`);
					return new Response(source.content);
				})
			);
			expect(fixture.revision).toBe(c17SourceRevision);
			const url = `${root}${pack}/${role}`;
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
			expect(files).toHaveLength(pack === c17OpeningPacks[0] ? 6 : 7);
			expect(
				requests.some(url =>
					url.includes(
						`/${role === "starter" ? "solution" : "starter"}/`
					)
				)
			).toBe(false);
			expect(cBuildInstructions(files).join("\n")).toContain(
				`cd ${role}`
			);
			expect(cBuildInstructions(files).join("\n")).toContain(
				"ctest --test-dir build"
			);
			expect(
				cBuildInstructions(files).join("\n").includes("unsafe_probe.c")
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

	it("preserves an existing attempt when learner and reference keys are created", () => {
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
				`${root}${c17OpeningPacks[0]}/starter`
			)
		});
		const reference = createPythonIdeProject("c", {
			courseProjectKey: c17CourseProjectKey(
				"c-systems-engineering",
				"lesson",
				"reference",
				`${root}${c17OpeningPacks[0]}/solution`
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
	});
});
