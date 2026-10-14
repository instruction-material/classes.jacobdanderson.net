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
		label: "helper",
		stem: "Helper",
		pack: "ASM4-Call-C-Helper-from-Assembly",
		revision: "4519a6ecbdb0dc6e932932a8af50a24f2449c8ef",
		source: "scale_and_clamp.S",
		header: "helper.h",
		roleFiles: [
			"scale_and_clamp.S",
			"main.c",
			"helper.c",
			"helper.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		],
		executable: "assembly_helper",
		title: "Project: Call a C Helper from Assembly",
		module: "unit-6-calling-conventions-and-abi",
		item: "assembly-unit-6-calling-conventions-and-abi-curriculum-project-call-a-c-helper-from-assembly",
		worksheet: "Register-Trace Worksheet: Calling Conventions and ABI",
		reading: "assemblyHelperProjectReading",
		token: "11,280",
		marker: "CALL_CLAMP",
		contract: "min_value <= max_value",
		task: "Complete CALL_CLAMP in scale_and_clamp.S; the sum-and-scale loop is present. The untouched demo exits 78 with no successful rows.",
		reference:
			"The reference calls the actual C clamp helper, prints scaled and clamped=40 and scaled and clamped=25, and passes 11,280 helper cases."
	},
	{
		label: "parser",
		stem: "Parser",
		pack: "ASM5-Tiny-Command-Line-Parser",
		revision: "b87661c22a4bc08245cac18a0d6b8d672723eec8",
		source: "parser.S",
		header: "parser.h",
		roleFiles: [
			"parser.S",
			"main.c",
			"parser.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		],
		executable: "assembly_parser",
		title: "Project: Tiny Command-Line Parser",
		module: "unit-8-system-calls-and-runtime-interaction",
		item: "assembly-unit-8-system-calls-and-runtime-interaction-curriculum-project-tiny-command-line-parser",
		worksheet:
			"Register-Trace Worksheet: System Calls and Runtime Interaction",
		reading: "assemblyParserProjectReading",
		token: "9,157",
		marker: "PARSE_BOUND",
		contract: "-9223372036854775808",
		task: "Complete PARSE_SIGN and PARSE_BOUND in parser.S; equality and the digit loop are present. The untouched demo exits 78 with no successful rows.",
		reference:
			"The reference prints sum=15, max=12 and xor=-9, accepts the full signed 64-bit range and passes 9,157 parser/equality cases."
	},
	{
		label: "reverse",
		stem: "Reverse",
		pack: "ASM6-Reverse-Engineering-Toy-Program",
		revision: "8856f11c649863d5eee9914658c11cfb801ead4b",
		source: "reconstructed.c",
		header: "reverse.h",
		roleFiles: [
			"reconstructed.c",
			"mystery.S",
			"main.c",
			"reverse.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		],
		executable: "assembly_reverse",
		title: "Project: Reverse-Engineer a Toy Program Back into Pseudocode",
		module: "unit-12-security-and-reliability-visibility",
		item: "assembly-unit-12-security-and-reliability-visibility-curriculum-project-reverse-engineer-a-toy-program-back-into-pseudocode",
		worksheet:
			"Register-Trace Worksheet: Security and Reliability Visibility",
		reading: "assemblyReverseProjectReading",
		token: "10,033",
		marker: "RECONSTRUCT_THRESHOLD",
		contract: "INT64_MIN",
		task: "Complete RECONSTRUCT_THRESHOLD in reconstructed.c and record pseudocode for all three phases; keep mystery.S unchanged. The untouched demo exits 78 with no successful rows.",
		reference:
			"The reference matches all six demo rows and full-width changed cases, passes 10,033 reconstruction cases and retains C undefined-behavior checks."
	},
	{
		label: "stack",
		stem: "Stack",
		pack: "ASM-07-unit-5-the-stack-and-function-calls",
		revision: "005e375894ade846a1077e96d4880faea680aed8",
		source: "routine.S",
		header: "stack.h",
		roleFiles: [
			"routine.S",
			"main.c",
			"stack.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		],
		executable: "assembly_stack",
		title: "Unit 5: The Stack and Function Calls: Core Project",
		displayTitle: "Core Project: The Stack and Function Calls",
		module: "unit-5-the-stack-and-function-calls",
		item: "assembly-unit-5-the-stack-and-function-calls-curriculum-core-project-the-stack-and-function-calls",
		worksheet: "Register-Trace Worksheet: The Stack and Function Calls",
		reading: "assemblyStackProjectReading",
		token: "10,012",
		marker: "STACK_CALLS",
		contract: "stack_pair",
		task: "Complete STACK_CALLS in routine.S; keep both real leaf calls, live values, aligned call sites and balanced restoration. The untouched demo exits 78 with no successful rows.",
		reference:
			"The reference returns 30, 38, 10 and 8 in the four demo rows and passes 10,012 full-width pair cases, with actual ordered calls and aligned leaf entries."
	}
])("$label native workspace", (row) => {
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
		const items = course.modules.flatMap((module) => module.curriculum);
		expect(items).toHaveLength(49);
		const project = items.find(
			(item) => item.projectLink === `${root}/starter`
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
		expect(project.content).toContain(row.contract);
		if (row.label === "parser") {
			expect(project.content).toContain("9223372036854775807");
			expect(project.content).toContain(
				"without changing the output slot"
			);
		}

		const guide = course.modules
			.flatMap((module) => module.supplementalProjects)
			.find((item) =>
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
				.flatMap((module) => module.curriculum)
				.map((item) => item.id)
		).toEqual(items.map((item) => item.id));
		expect(
			learner.modules
				.flatMap((module) => module.curriculum)
				.find((item) => item.id === project.id)?.solutionLink
		).toBeUndefined();
	});

	it.each(["starter", "solution"] as const)(
		"imports and exports exact project %s files and preserves earlier work",
		async (role) => {
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
				(path) =>
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
				files.map((file) => `${row.pack}/${file.name}`).sort()
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
			expect(restored.find((p) => p._id === old._id)).toEqual(old);
			const saved = restored.find((p) => p._id === project._id)!;
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
				requests.some((url) =>
					url.includes(
						role === "starter" ? "/solution/" : "/starter/"
					)
				)
			).toBe(false);
			const instructions = assemblyBuildInstructions(files, url).join(
				"\n"
			);
			expect(instructions).toContain("./build/" + row.executable);
			expect(instructions).toContain(
				role === "starter" ? row.marker : row.token
			);
			expect(instructions).not.toContain("total=100");
		}
	);
});
