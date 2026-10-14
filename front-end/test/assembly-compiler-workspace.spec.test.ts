import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { assemblyBuildInstructions } from "@/modules/assemblyBuildInstructions";
import { assemblyCourseProjectKey } from "@/modules/assemblyProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

describe.each([
	{
		label: "compiler",
		stem: "Compiler",
		pack: "ASM-08-unit-9-reading-compiler-output",
		revision: "4fabbbe92deb893d14e2572121fc2393ae426c7b",
		source: "model.c",
		header: "model.h",
		roleFiles: [
			"model.c",
			"model.h",
			"main.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"analysis.md"
		],
		executable: "assembly_compiler",
		title: "Unit 9: Reading Compiler Output: Core Project",
		displayTitle: "Core Project: Reading Compiler Output",
		module: "unit-9-reading-compiler-output",
		item: "assembly-unit-9-reading-compiler-output-curriculum-core-project-reading-compiler-output",
		worksheet: "Register-Trace Worksheet: Reading Compiler Output",
		reading: "assemblyCompilerProjectReading",
		token: "10,013",
		marker: "analysis.md",
		contract: "compiled_score",
		task: "Complete analysis.md with the actual target/flags, four predictions, instruction mapping, optimization comparison, an independent changed case, a debugger trace and a bounded explanation. Keep model.c unchanged for the primary comparison.",
		reference:
			"The reference analysis.md supplies portable reasoning and a changed-case example; record the current compiler version, real listings and debugger addresses separately."
	}
])("$label native workspace", row => {
	const assemblyCalculatorRevision = row.revision;
	const assemblyCalculatorPack = row.pack;
	const fixture = JSON.parse(
		readFileSync(
			resolve(
				process.cwd(),
				`../test/fixtures/assembly-${row.label}-contracts.json`
			),
			"utf8"
		)
	) as { files: Record<string, { content: string; sha256: string }> };
	const root = `https://github.com/instruction-material/Assembly/tree/${assemblyCalculatorRevision}/${assemblyCalculatorPack}`;
	it("accepts the role worksheet while keeping traversal and unrelated nested text invalid", () => {
		for (const role of ["starter", "solution"])
			expect(isValidPythonFileName(`${role}/analysis.md`)).toBe(true);
		for (const name of [
			"../analysis.md",
			"starter/../analysis.md",
			"starter//analysis.md",
			"images/analysis.md",
			"starter/notes.md",
			"starter/nested/analysis.md"
		])
			expect(isValidPythonFileName(name)).toBe(false);
	});
	it("keeps the project's progress identity, complete guide and separate reference visibility", async () => {
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "calculator-tutor",
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
		const project = items.find(
			item => item.projectLink === `${root}/starter`
		)!;
		expect(project.id).toBe(row.item);
		expect(project.ideImport).toBe(true);
		expect(project.solutionLink).toBe(`${root}/solution`);
		expect(project.content).toContain(
			fixture.files[`${assemblyCalculatorPack}/README.md`].content
				.split("\n")
				.slice(1)
				.join("\n")
				.replaceAll(
					"For an instructor-guided session, first predict the fixed trace together, then have the learner implement the search and explain the first failing case.",
					"A guided session starts with a shared prediction of the fixed trace, followed by learner implementation of the search and an explanation of the first failing case."
				)
				.replaceAll(
					"In an instructor-guided session, discuss the capacity table before editing and have the learner explain the first failed assertion.",
					"A guided session starts with a discussion of the capacity table before editing and a learner explanation of the first failed assertion."
				)
				.replaceAll("an instructor", "a course facilitator")
				.replaceAll("AND and", "`AND` and")
				.trim()
		);
		expect(project.content).toContain(row.marker);
		expect(fixture.files[`${row.pack}/starter/model.c`].content).toBe(
			fixture.files[`${row.pack}/solution/model.c`].content
		);
		expect(
			fixture.files[`${row.pack}/starter/model.c`].content
		).not.toContain("TODO");
		for (const key of [
			"TARGET",
			"PREDICT",
			"MAP",
			"COMPARE",
			"CASE",
			"TRACE",
			"EXPLAIN"
		])
			expect(
				fixture.files[`${row.pack}/starter/analysis.md`].content
			).toContain("TODO " + key);
		expect(
			fixture.files[`${row.pack}/solution/analysis.md`].content
		).not.toContain("TODO");
		expect(project.content).toContain(row.contract);
		if (row.label === "parser") {
			expect(project.content).toContain("9223372036854775807");
			expect(project.content).toContain(
				"without changing the output slot"
			);
		}

		const guide = course.modules
			.flatMap(module => module.supplementalProjects)
			.find(item =>
				item.projectLink?.endsWith(
					`/${assemblyCalculatorPack}/README.md`
				)
			)!;
		expect(guide).toBeDefined();
		expect(guide.solutionLink).toBeUndefined();
		expect(
			pythonIdeModeForCourseResource("assembly", guide.projectLink!)
		).toBeNull();
		app.setCurrentTutor(null);
		const learner = (await useCoursesStore().loadCourseById("assembly"))!;
		expect(
			learner.modules
				.flatMap(module => module.curriculum)
				.map(item => item.id)
		).toEqual(items.map(item => item.id));
		expect(
			learner.modules
				.flatMap(module => module.curriculum)
				.find(item => item.id === project.id)?.solutionLink
		).toBeUndefined();
	});

	it.each(["starter", "solution"] as const)(
		"imports and exports exact project %s files and preserves earlier work",
		async role => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (url: string) => {
					requests.push(url);
					const prefix = `https://raw.githubusercontent.com/instruction-material/Assembly/${assemblyCalculatorRevision}/`;
					expect(url.startsWith(prefix)).toBe(true);
					const file = fixture.files[url.slice(prefix.length)];
					if (!file) throw new Error(`Unexpected file: ${url}`);
					return new Response(file.content);
				})
			);
			const url = `${root}/${role}`;
			const expectedFiles = Object.keys(fixture.files).filter(
				path =>
					path.startsWith(`${row.pack}/${role}/`) ||
					path === `${row.pack}/README.md`
			);
			expect(pythonIdeModeForCourseResource("assembly", url)).toBe(
				"assembly"
			);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				url,
				"assembly"
			);
			expect(
				files.map(file => `${row.pack}/${file.name}`).sort()
			).toEqual(expectedFiles.sort());
			const key = assemblyCourseProjectKey(
				"assembly",
				row.item,
				role === "starter" ? "starter" : "reference",
				url
			);
			const old = createPythonIdeProject("python", {
				courseProjectKey: key.replace(/:native-assembly$/, "")
			});
			const project = createPythonIdeProject("assembly", {
				files,
				courseID: "assembly",
				starterUrl: url,
				courseProjectKey: key
			});
			expect(project.activeFileName).toBe(`${role}/${row.source}`);
			saveLocalPythonProjects([old, project]);
			const restored = loadLocalPythonProjects();
			expect(restored.find(p => p._id === old._id)).toEqual(old);
			const saved = restored.find(p => p._id === project._id)!;
			expect(saved.files).toEqual(files);
			const archive = createProjectArchive(saved);
			if (process.env.ASSEMBLY_EXPORT_PROOF_DIR) {
				mkdirSync(process.env.ASSEMBLY_EXPORT_PROOF_DIR, {
					recursive: true
				});
				writeFileSync(
					resolve(
						process.env.ASSEMBLY_EXPORT_PROOF_DIR,
						`${assemblyCalculatorPack}-${role}.zip`
					),
					archive
				);
			}
			const entries = unzipSync(archive);
			expect(Object.keys(entries)).toHaveLength(expectedFiles.length);
			for (const file of files) {
				const expected =
					fixture.files[`${assemblyCalculatorPack}/${file.name}`];
				const exported = entries[`${saved.title}/${file.name}`];
				expect(strFromU8(exported)).toBe(expected.content);
				expect(
					createHash("sha256").update(exported).digest("hex")
				).toBe(expected.sha256);
			}
			expect(requests).toHaveLength(expectedFiles.length);
			expect(
				requests.some(url =>
					url.includes(
						role === "starter" ? "/solution/" : "/starter/"
					)
				)
			).toBe(false);
			const instructions = assemblyBuildInstructions(files, url).join(
				"\n"
			);
			expect(instructions).toContain("./build-O0/" + row.executable);
			expect(instructions).toContain(
				role === "starter" ? row.marker : row.token
			);
			expect(instructions).not.toContain("total=100");
			expect(instructions).not.toContain("exits 78");
			expect(instructions).toContain(
				"Both supplied roles work immediately"
			);
			expect(instructions).toContain(
				"does not complete the analysis worksheet"
			);
			expect(instructions).toContain(
				'-DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG"'
			);
			expect(instructions).toContain(
				"-S -masm=intel -fverbose-asm model.c"
			);
		}
	);
});
