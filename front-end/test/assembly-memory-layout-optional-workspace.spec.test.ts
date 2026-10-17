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
			"../test/fixtures/assembly-memory-layout-optional-contracts.json"
		),
		"utf8"
	)
) as {
	pack: string;
	revision: string;
	mode: "table" | "overlap";
	moduleId: string;
	itemId: string;
	continuationItemId?: string;
	files: Record<string, { content: string; sha256: string }>;
}[];
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("keeps distinct pointer-table and overlap-copy investigations optional with all published identities and the required string project intact", async () => {
	expect(fixtures.map(fixture => fixture.mode)).toEqual(["table", "overlap"]);
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "memory-layout-tutor",
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
				"curriculum-project-string-length-and-copy-routines"
			)
		)?.projectLink
	).toContain(
		"3d66cd9cd20139f8176098475193b791edd2bcd8/ASM3-String-Length-and-Copy/starter"
	);
	for (const fixture of fixtures) {
		const item = module.supplementalProjects.find(
			item => item.id === fixture.itemId
		)!;
		expect(item.learningPath).toBe(
			fixture.mode === "overlap" ? "challenge" : "choice"
		);
		expect(item.ideImport).toBe(true);
		expect(item.content).toContain(
			fixture.files[fixture.pack + "/README.md"].content.trim()
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

it.each(
	fixtures.flatMap(fixture =>
		["starter", "solution"].map(role => ({ fixture, role }))
	)
)(
	"imports and persists $fixture.mode/$role bytes without replacing earlier or opposite-role work",
	async ({ fixture, role }) => {
		const requests: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: string | URL) => {
				const url = String(input);
				requests.push(url);
				const file =
					fixture.files[url.split("/" + fixture.revision + "/")[1]];
				return new Response(file?.content ?? "missing", {
					status: file ? 200 : 404
				});
			})
		);
		const url = `https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/${role}`;
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url,
			"assembly"
		);
		expect(requests).toHaveLength(9);
		expect(files).toHaveLength(9);
		for (const file of files) {
			const expected = fixture.files[fixture.pack + "/" + file.name];
			expect(file.content).toBe(expected.content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(expected.sha256);
		}
		const key = assemblyCourseProjectKey(
			"assembly",
			fixture.itemId,
			role === "starter" ? "starter" : "reference",
			url
		);
		const earlier = createPythonIdeProject("python", {
			title: "Earlier memory-layout attempt",
			courseProjectKey: key.replace(/:native-assembly$/, "")
		});
		const opposite = createPythonIdeProject("assembly", {
			title: "Separate opposite role",
			courseProjectKey: key.replace(
				role === "starter" ? ":starter:" : ":reference:",
				role === "starter" ? ":reference:" : ":starter:"
			)
		});
		const project = createPythonIdeProject("assembly", {
			files,
			starterUrl: url,
			courseProjectKey: key
		});
		expect(project.activeFileName).toBe(role + "/routine.S");
		const archive = createProjectArchive(project);
		const directory = process.env.ASSEMBLY_EXPORT_PROOF_DIR;
		if (directory) {
			mkdirSync(directory, { recursive: true });
			writeFileSync(
				join(directory, fixture.pack + "-" + role + ".zip"),
				archive
			);
		}
		project.files = project.files.map(file => ({
			...file,
			content:
				file.content +
				(file.name === role + "/routine.S"
					? "\n/* Saved pointer or byte-copy observation. */\n"
					: file.name === role + "/trace.md"
						? "\nSaved owned-memory and address evidence.\n"
						: "")
		}));
		project.activeFileName = role + "/trace.md";
		saveLocalPythonProjects([earlier, opposite, project]);
		const restored = loadLocalPythonProjects();
		expect(restored.find(item => item._id === earlier._id)).toEqual(
			earlier
		);
		expect(restored.find(item => item._id === opposite._id)).toEqual(
			opposite
		);
		const saved = restored.find(item => item._id === project._id)!;
		expect(saved.files).toEqual(project.files);
		expect(saved.activeFileName).toBe(role + "/trace.md");
		const entries = unzipSync(createProjectArchive(saved));
		expect(Object.keys(entries)).toHaveLength(9);
		for (const file of saved.files)
			expect(strFromU8(entries[saved.title + "/" + file.name])).toBe(
				file.content
			);
		const instructions = assemblyBuildInstructions(files, url).join("\n");
		for (const token of [
			"Linux x86-64",
			"objdump",
			"gdb",
			"trace.md",
			"lab_operation",
			"build-Release",
			"unchanged"
		])
			expect(instructions).toContain(token);
		expect(instructions).toContain(
			fixture.mode === "table" ? "POINTER_LOOKUP" : "COPY_DIRECTION"
		);
		expect(instructions).not.toContain(
			fixture.mode === "table" ? "COPY_DIRECTION" : "POINTER_LOOKUP"
		);
		expect(instructions).not.toMatch(/ARGUMENT_REGISTER|STACK_ARGUMENT/);
		for (const observation of fixture.mode === "table"
			? ["lab_lookup", "eight-byte pointer slot", "sixteen-byte C record"]
			: ["lab_ready", "all sixteen original bytes", "clamped count"])
			expect(instructions).toContain(observation);
		expect(
			assemblyBuildInstructions(
				files.filter(file => file.name !== role + "/abi_checks.S"),
				url
			).join("\n")
		).toContain("incomplete");
		expect(
			assemblyCourseResource(url.replace(fixture.revision, "main"))
		).toBeNull();
	}
);
