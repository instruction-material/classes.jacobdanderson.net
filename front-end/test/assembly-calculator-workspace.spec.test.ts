import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { assemblyBuildInstructions } from "@/modules/assemblyBuildInstructions";
import {
	assemblyCalculatorPack,
	assemblyCalculatorRevision,
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

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/assembly-calculator-contracts.json"
		),
		"utf8"
	)
) as { files: Record<string, { content: string; sha256: string }> };
const root = `https://github.com/instruction-material/Assembly/tree/${assemblyCalculatorRevision}/${assemblyCalculatorPack}`;
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("keeps the calculator's progress identity, complete guide and separate reference visibility", async () => {
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
		"assembly-unit-2-registers-and-data-movement-curriculum-project-integer-calculator-in-assembly"
	);
	expect(project.ideImport).toBe(true);
	expect(project.solutionLink).toBe(`${root}/solution`);
	expect(project.content).toContain(
		fixture.files[`${assemblyCalculatorPack}/README.md`].content
			.split("\n")
			.slice(1)
			.join("\n")
			.replaceAll("an instructor", "a course facilitator")
			.replaceAll("AND and", "`AND` and")
			.trim()
	);
	expect(project.content).toContain("CALC_DIV");
	expect(project.content).toContain("INT64_MIN / -1");
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
	"imports and exports exact calculator %s files and preserves earlier work",
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
			"calculator",
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
		expect(project.activeFileName).toBe(`${role}/calculator.S`);
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
		expect(instructions).toContain("./build/assembly_calculator");
		expect(instructions).toContain("INT64_MIN / -1");
		expect(instructions).toContain(
			role === "starter" ? "CALC_DIV" : "12,589"
		);
		expect(instructions).not.toContain("total=100");
	}
);

it("chooses an Assembly source for new Assembly work without changing C-file priority", () => {
	const files = [
		{ name: "main.c", content: "int main(void) { return 0; }" },
		{ name: "calculator.S", content: "ret\n" }
	];
	expect(createPythonIdeProject("assembly", { files }).activeFileName).toBe(
		"calculator.S"
	);
	expect(createPythonIdeProject("c", { files }).activeFileName).toBe(
		"main.c"
	);
});
