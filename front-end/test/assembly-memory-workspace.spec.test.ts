import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { assemblyBuildInstructions } from "@/modules/assemblyBuildInstructions";
import {
	assemblyCourseProjectKey
} from "@/modules/assemblyProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
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
    "label": "array",
    "stem": "Array",
    "pack": "ASM2-Array-Sum-and-Search",
    "revision": "4e82e4d5f02067a830f92c19e148d0822220ffe9",
    "source": "array_routines.S",
    "header": "array_routines.h",
    "executable": "assembly_array",
    "title": "Project: Array Sum and Search Routines",
    "module": "unit-4-branching-and-loops",
    "item": "assembly-unit-4-branching-and-loops-curriculum-project-array-sum-and-search-routines",
    "worksheet": "Register-Trace Worksheet: Branching and Loops",
    "reading": "assemblyArrayProjectReading",
    "token": "11,280",
    "task": "Complete ARRAY_SEARCH in array_routines.S; summation already works. The untouched demo exits 78 with no successful rows.",
    "reference": "The reference prints sum=48 and first-match indices 0, 3 and -1 and passes 11,280 array cases.",
    "contract": "count <= 0",
    "marker": "ARRAY_SEARCH"
  },
  {
    "label": "string",
    "stem": "String",
    "pack": "ASM3-String-Length-and-Copy",
    "revision": "3d66cd9cd20139f8176098475193b791edd2bcd8",
    "source": "string_routines.S",
    "header": "string_routines.h",
    "executable": "assembly_strings",
    "title": "Project: String Length and Copy Routines",
    "module": "unit-7-memory-addressing-and-data-structures",
    "item": "assembly-unit-7-memory-addressing-and-data-structures-curriculum-project-string-length-and-copy-routines",
    "worksheet": "Register-Trace Worksheet: Memory Addressing and Data Structures",
    "reading": "assemblyStringProjectReading",
    "token": "35,900",
    "task": "Complete COPY_SOURCE_LENGTH in string_routines.S; length and bounded-copy loops are present. The untouched demo exits 78 with no successful rows.",
    "reference": "The reference returns source length 8 for full, truncated and zero-capacity copies, stores assem in the six-byte buffer and passes 35,900 string cases.",
    "contract": "capacity == 0",
    "marker": "COPY_SOURCE_LENGTH"
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
it("keeps the memory project's progress identity, complete guide and separate reference visibility", async () => {
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
	const project = items.find(item => item.projectLink === `${root}/starter`)!;
	expect(project.id).toBe(
		row.item
	);
	expect(project.ideImport).toBe(true);
	expect(project.solutionLink).toBe(`${root}/solution`);
	expect(project.content).toContain(
		fixture.files[`${assemblyCalculatorPack}/README.md`].content
			.split("\n")
			.slice(1)
			.join("\n")
			.replaceAll("For an instructor-guided session, first predict the fixed trace together, then have the learner implement the search and explain the first failing case.", "A guided session starts with a shared prediction of the fixed trace, followed by learner implementation of the search and an explanation of the first failing case.")
.replaceAll("In an instructor-guided session, discuss the capacity table before editing and have the learner explain the first failed assertion.", "A guided session starts with a discussion of the capacity table before editing and a learner explanation of the first failed assertion.")
.replaceAll("an instructor", "a course facilitator")
			.replaceAll("AND and", "`AND` and")
			.trim()
	);
	expect(project.content).toContain(row.marker);
	expect(project.content).toContain(row.contract);
	const guide = course.modules
		.flatMap(module => module.supplementalProjects)
		.find(item =>
			item.projectLink?.endsWith(`/${assemblyCalculatorPack}/README.md`)
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
	"imports and exports exact memory project %s files and preserves earlier work",
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
		expect(pythonIdeModeForCourseResource("assembly", url)).toBe(
			"assembly"
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url,
			"assembly"
		);
		expect(files).toHaveLength(7);
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
		expect(Object.keys(entries)).toHaveLength(7);
		for (const file of files) {
			const expected =
				fixture.files[`${assemblyCalculatorPack}/${file.name}`];
			const exported = entries[`${saved.title}/${file.name}`];
			expect(strFromU8(exported)).toBe(expected.content);
			expect(createHash("sha256").update(exported).digest("hex")).toBe(
				expected.sha256
			);
		}
		expect(requests).toHaveLength(7);
		expect(
			requests.some(url =>
				url.includes(role === "starter" ? "/solution/" : "/starter/")
			)
		).toBe(false);
		const instructions = assemblyBuildInstructions(files, url).join("\n");
		expect(instructions).toContain("./build/" + row.executable);
		expect(instructions).toContain(
			role === "starter" ? row.marker : row.token
		);
		expect(instructions).not.toContain("total=100");
	}
);

});
