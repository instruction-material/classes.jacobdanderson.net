import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { assemblyBuildInstructions } from "@/modules/assemblyBuildInstructions";
import {
	assemblyCourseProjectKey,
	assemblyCourseResource,
	assemblyOpeningPack,
	assemblySourceRevision
} from "@/modules/assemblyProjectResources";
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
	normalizePythonFileName,
	pythonIdeModeForCourseId,
	pythonIdeModeForCourseResource,
	pythonIdeProjectToPayload,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/assembly-opening-contracts.json"
		),
		"utf8"
	)
) as {
	revision: string;
	files: Record<string, { content: string; sha256: string }>;
};
const root = `https://github.com/instruction-material/Assembly/tree/${assemblySourceRevision}/${assemblyOpeningPack}`;

afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

describe("Assembly native source workspace", () => {
	it("retains the opening progress identity, complete contract and guide-only notebook", async () => {
		setActivePinia(createPinia());
		useAppStore().setCurrentTutor({
			_id: "assembly-tutor",
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
		const items = course.modules.flatMap(module => module.curriculum);
		expect(items).toHaveLength(49);
		const core = items.find(
			item => item.projectLink === `${root}/starter`
		)!;
		expect(core.id).toBe(
			"assembly-asm0-setup-and-tooling-curriculum-core-project-assembly"
		);
		expect(core.ideImport).toBe(true);
		expect(core.solutionLink).toBe(`${root}/solution`);
		expect(core.content).toContain(
			fixture.files[`${assemblyOpeningPack}/README.md`].content
				.split("\n")
				.slice(1)
				.join("\n")
				.trim()
		);
		expect(core.content).toContain("exits 78");
		expect(core.content).toContain("total=100");
		const notebook = course.modules
			.flatMap(module => module.supplementalProjects)
			.find(item =>
				item.projectLink?.endsWith(`/${assemblyOpeningPack}/README.md`)
			)!;
		expect(notebook).toBeDefined();
		expect(notebook.solutionLink).toBeUndefined();
		expect(notebook.ideImport).not.toBe(true);
		expect(
			pythonIdeModeForCourseResource("assembly", notebook.projectLink!)
		).toBeNull();
		useAppStore().setCurrentTutor(null);
		const learner = (await useCoursesStore().loadCourseById("assembly"))!;
		expect(
			learner.modules
				.flatMap(module => module.curriculum)
				.map(item => item.id)
		).toEqual(items.map(item => item.id));
		expect(
			learner.modules
				.flatMap(module => module.curriculum)
				.find(item => item.id === core.id)?.solutionLink
		).toBeUndefined();
	});

	it.each(["starter", "solution"] as const)(
		"imports, saves and exports exact %s source without reading the other role",
		async role => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (url: string) => {
					requests.push(url);
					const prefix = `https://raw.githubusercontent.com/instruction-material/Assembly/${fixture.revision}/`;
					expect(url.startsWith(prefix)).toBe(true);
					const source = fixture.files[url.slice(prefix.length)];
					if (!source) throw new Error(`Unexpected source: ${url}`);
					return new Response(source.content);
				})
			);
			const url = `${root}/${role}`;
			expect(pythonIdeModeForCourseResource("assembly", url)).toBe(
				"assembly"
			);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				url,
				"assembly"
			);
			const key = assemblyCourseProjectKey(
				"assembly",
				"opening",
				role === "starter" ? "starter" : "reference",
				url
			);
			const old = createPythonIdeProject("python", {
				courseID: "assembly",
				courseProjectKey: key.replace(/:native-assembly$/, "")
			});
			const project = createPythonIdeProject("assembly", {
				courseID: "assembly",
				courseProjectKey: key,
				files
			});
			expect(project.activeFileName).toBe(`${role}/routine.S`);
			expect(getCodeIdeProjectSubtitle(project)).toBe(
				`${role === "starter" ? "Learner" : "Reference"} · Assembly`
			);
			saveLocalPythonProjects([old, project]);
			const [legacy, saved] = loadLocalPythonProjects();
			expect(legacy).toEqual(old);
			expect(saved.files).toEqual(files);
			expect(pythonIdeProjectToPayload(saved).mode).toBe("assembly");
			const bytes = createProjectArchive(saved);
			if (process.env.ASSEMBLY_EXPORT_PROOF_DIR) {
				mkdirSync(process.env.ASSEMBLY_EXPORT_PROOF_DIR, {
					recursive: true
				});
				writeFileSync(
					resolve(
						process.env.ASSEMBLY_EXPORT_PROOF_DIR,
						`${assemblyOpeningPack}-${role}.zip`
					),
					bytes
				);
			}
			const archive = unzipSync(bytes);
			expect(Object.keys(archive)).toHaveLength(7);
			for (const file of files) {
				const source =
					fixture.files[`${assemblyOpeningPack}/${file.name}`];
				const exported = archive[`${saved.title}/${file.name}`];
				expect(file.content).toBe(source.content);
				expect(strFromU8(exported)).toBe(source.content);
				expect(
					createHash("sha256").update(exported).digest("hex")
				).toBe(source.sha256);
			}
			expect(files).toHaveLength(7);
			expect(requests).toHaveLength(7);
			expect(
				requests.some(url =>
					url.includes(
						role === "starter" ? "/solution/" : "/starter/"
					)
				)
			).toBe(false);
			expect(assemblyBuildInstructions(files, url).join("\n")).toContain(
				`cd ${role}`
			);
			expect(assemblyBuildInstructions(files, url).join("\n")).toContain(
				role === "starter" ? "exits 78" : "total=100"
			);
		}
	);

	it.each([
		root.replace(assemblySourceRevision, "main") + "/starter",
		root + "/starter/routine.S",
		root.replace("instruction-material", "other-owner") + "/starter",
		root.replace(assemblyOpeningPack, "ASM-05-other") + "/starter"
	])("rejects an unverified source before fetching: %s", async url => {
		const fetcher = vi.fn();
		vi.stubGlobal("fetch", fetcher);
		expect(assemblyCourseResource(url)).toBeNull();
		expect(pythonIdeModeForCourseResource("assembly", url)).toBeNull();
		await expect(
			loadPythonIdeStarterFilesFromGitHub(url, "assembly")
		).rejects.toThrow("no verified site import");
		expect(fetcher).not.toHaveBeenCalled();
	});

	it("uses Assembly defaults and retains preprocessed .S names through normalization", () => {
		expect(pythonIdeModeForCourseId("assembly")).toBe("assembly");
		for (const template of [
			"blank",
			"course",
			"demo",
			"outline"
		] as const) {
			const project = createPythonIdeProject("assembly", { template });
			expect(project.activeFileName).toBe("routine.S");
			if (template === "blank" && process.env.ASSEMBLY_EXPORT_PROOF_DIR) {
				mkdirSync(process.env.ASSEMBLY_EXPORT_PROOF_DIR, {
					recursive: true
				});
				writeFileSync(
					resolve(
						process.env.ASSEMBLY_EXPORT_PROOF_DIR,
						"assembly-default.zip"
					),
					createProjectArchive(project)
				);
			}
			expect(project.files.map(file => file.name)).toEqual([
				"routine.S",
				"main.c",
				"README.md"
			]);
			expect(
				sandboxRun({
					mode: "assembly",
					files: project.files,
					activeFileName: "routine.S",
					inputText: ""
				})
			).toBeNull();
		}
		expect(pythonIdeCompletionsForMode("assembly")).toEqual([]);
		expect(normalizePythonFileName("starter/routine.S", ".S")).toBe(
			"starter/routine.S"
		);
		expect(normalizePythonFileName("extra", ".S")).toBe("extra.S");
		expect(getPythonIdeFileKindLabel("starter/routine.S")).toBe("Assembly");
		for (const path of [
			"../routine.S",
			"/routine.S",
			"src//routine.S",
			"images/routine.S",
			"starter/notes.txt",
			"turtle.py"
		])
			expect(isValidPythonFileName(path)).toBe(false);
	});
});
