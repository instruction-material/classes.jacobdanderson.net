import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { createProjectArchive } from "@/modules/projectArchive";
import { isRustProjectTextPath } from "@/modules/rustProjectFiles";
import { isRustProjectTextPath as apiRustProjectTextPath } from "../../back-end/src/utils/rustProjectFiles";
import { rustBuildInstructions } from "@/modules/rustBuildInstructions";
import {
	rustCargoItemIds,
	rustCargoPack,
	rustCargoRevision,
	rustBoundedCliItemIds,
	rustBoundedCliModuleId,
	rustBoundedCliPack,
	rustBoundedCliRevision,
	rustCourseProjectKey,
	rustCourseResource
} from "@/modules/rustProjectResources";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/rust-bounded-cli-contracts.json"
		),
		"utf8"
	)
);
const cargo = JSON.parse(
	readFileSync(
		resolve(process.cwd(), "../test/fixtures/rust-cargo-contracts.json"),
		"utf8"
	)
);
const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustBoundedCliRevision}/${rustBoundedCliPack}`;
const cargoRoot = `https://github.com/instruction-material/Low-Level-Security/tree/${rustCargoRevision}/${rustCargoPack}`;
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("gives the bounded-cli module four distinct, complete activities without exposing the reference to a learner", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "bounded-cli-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["rust-systems-security"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById(
		"rust-systems-security"
	))!;
	const module = course.modules.find(
		item => item.id === rustBoundedCliModuleId
	)!;
	const items = [...module.curriculum, ...module.supplementalProjects];
	const concepts = module.curriculum.find(item =>
		item.title.endsWith("Core Concepts")
	)!;
	expect(concepts.content).toContain("acquire");
	expect(concepts.content).toContain("Read::take");
	expect(concepts.content).toContain("64-byte");

	for (const [kind, id] of Object.entries(rustBoundedCliItemIds)) {
		const item = items.find(item => item.id === id)!;
		expect(item).toBeDefined();
		expect(item.learningPath).toBe(
			kind === "choice"
				? "choice"
				: kind === "challenge"
					? "challenge"
					: "core"
		);
		expect(item.content).toContain(
			fixture.files[fixture.pack + "/README.md"].content.trim()
		);
		expect(item.projectLink).toBe(root + "/starter");
		expect(item.solutionLink).toBe(root + "/solution");
		expect(item.ideImport).toBe(true);
	}
	expect(
		items.find(item => item.id === rustBoundedCliItemIds.core)!.content
	).toContain("Complete CORE and LIMITS");
	expect(
		items.find(item => item.id === rustBoundedCliItemIds.workflow)!.content
	).toContain("complete WORKFLOW");
	expect(
		items.find(item => item.id === rustBoundedCliItemIds.choice)!.content
	).toContain("Read");
	expect(
		items.find(item => item.id === rustBoundedCliItemIds.challenge)!.content
	).toContain("status 66");
	app.setCurrentTutor(null);
	const learner = (await useCoursesStore().loadCourseById(
		"rust-systems-security"
	))!;
	for (const module of learner.modules)
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		])
			expect(item.solutionLink).toBeUndefined();
});

it.each(["starter", "solution"] as const)(
	"preserves all eleven %s role files and the earlier Cargo attempt through editing, reopen and export",
	async role => {
		const requests: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: string | URL) => {
				const url = String(input);
				requests.push(url);
				const row =
					fixture.files[url.split("/" + fixture.revision + "/")[1]];
				return new Response(row?.content ?? "missing", {
					status: row ? 200 : 404
				});
			})
		);
		const url = root + "/" + role;
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "rust");
		expect(files).toHaveLength(11);
		expect(requests).toHaveLength(11);
		for (const file of files) {
			expect(isValidPythonFileName(file.name, "rust")).toBe(true);
			expect(file.content).toBe(
				fixture.files[fixture.pack + "/" + file.name].content
			);
		}
		const instructions = rustBuildInstructions(files, url).join("\n");
		for (const token of [
			"1.97.1",
			"edition 2024",
			"cargo test --locked --offline",
			"acquire",
			"Read::take",
			"--file cap.txt",
			"status 66"
		])
			expect(instructions).toContain(token);
		expect(
			rustBuildInstructions(
				files.filter(file => !file.name.endsWith("fixtures/over.txt")),
				url
			).join("\n")
		).toContain("incomplete");
		const earlierFiles = Object.entries(
			cargo.files as Record<string, { content: string }>
		)
			.filter(
				([name]) =>
					name.startsWith(cargo.pack + "/starter/") ||
					name === cargo.pack + "/README.md"
			)
			.map(([name, row]) => ({
				name: name.slice(cargo.pack.length + 1),
				content: row.content
			}));
		const earlier = createPythonIdeProject("rust", {
			files: earlierFiles,
			starterUrl: cargoRoot + "/starter",
			courseID: "rust-systems-security",
			courseProjectKey: rustCourseProjectKey(
				"rust-systems-security",
				rustCargoItemIds.core,
				"starter",
				cargoRoot + "/starter"
			)
		});
		const project = createPythonIdeProject("rust", {
			files,
			starterUrl: url,
			courseID: "rust-systems-security",
			courseProjectKey: rustCourseProjectKey(
				"rust-systems-security",
				rustBoundedCliItemIds.core,
				role === "starter" ? "starter" : "reference",
				url
			)
		});
		expect(project.activeFileName).toBe(role + "/observations.md");
		expect(project.courseProjectKey).not.toBe(earlier.courseProjectKey);
		project.files = files.map(file => ({
			...file,
			content:
				file.content +
				(file.name.endsWith("observations.md")
					? "\nSaved bounded-cli observations.\n"
					: file.name.endsWith("src/lib.rs")
						? "\n// Saved bounded-cli source.\n"
						: "")
		}));
		saveLocalPythonProjects([earlier, project]);
		const restored = loadLocalPythonProjects();
		expect(restored.find(item => item._id === earlier._id)).toEqual(
			earlier
		);
		const saved = restored.find(item => item._id === project._id)!;
		expect(saved.files).toEqual(project.files);
		expect(saved.mode).toBe("rust");
		const entries = unzipSync(createProjectArchive(saved));
		expect(Object.keys(entries)).toHaveLength(11);
		for (const file of saved.files)
			expect(strFromU8(entries[saved.title + "/" + file.name])).toBe(
				file.content
			);
		for (const id of Object.values(rustBoundedCliItemIds))
			expect(
				rustCourseProjectKey(
					"rust-systems-security",
					id,
					role === "starter" ? "starter" : "reference",
					url
				)
			).toBe(project.courseProjectKey);
		if (process.env.RUST_BOUNDED_CLI_EXPORT_PROOF_DIR) {
			const { mkdirSync, writeFileSync } = await import("node:fs");
			mkdirSync(process.env.RUST_BOUNDED_CLI_EXPORT_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				resolve(
					process.env.RUST_BOUNDED_CLI_EXPORT_PROOF_DIR,
					role + ".zip"
				),
				createProjectArchive(
					createPythonIdeProject("rust", {
						files,
						starterUrl: url,
						title: "BoundedCli lesson"
					})
				)
			);
		}
	}
);

it("requires the bounded-cli pack's exact accepted revision and keeps lesson keys independent", () => {
	for (const url of [
		root.replace(rustBoundedCliRevision, "main") + "/starter",
		root.replace(rustBoundedCliRevision, rustCargoRevision) + "/starter",
		root + "/starter/src/lib.rs"
	])
		expect(rustCourseResource(url)).toBeNull();
	expect(rustCourseResource(cargoRoot + "/starter")?.definition.kind).toBe(
		"cargo"
	);
	expect(rustCourseResource(root + "/starter")?.definition.kind).toBe(
		"bounded-cli"
	);
	const key = rustCourseProjectKey(
		"rust-systems-security",
		rustCargoItemIds.choice,
		"starter",
		root + "/starter"
	);
	expect(key).not.toContain(rustBoundedCliItemIds.core);
});

it("preserves the same lesson's earlier sanitizer attempt under its legacy key", () => {
	const legacyUrl =
		"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/starter";
	const legacy = createPythonIdeProject("rust", {
		files: [
			{
				name: "main.rs",
				content: "fn main() { /* Earlier learner work */ }\n"
			}
		],
		starterUrl: legacyUrl,
		courseID: "rust-systems-security",
		courseProjectKey: rustCourseProjectKey(
			"rust-systems-security",
			rustBoundedCliItemIds.core,
			"starter",
			legacyUrl
		)
	});
	const files = Object.entries(
		fixture.files as Record<string, { content: string }>
	)
		.filter(
			([name]) =>
				name === fixture.pack + "/README.md" ||
				name.startsWith(fixture.pack + "/starter/")
		)
		.map(([name, row]) => ({
			name: name.slice(fixture.pack.length + 1),
			content: row.content
		}));
	const current = createPythonIdeProject("rust", {
		files,
		starterUrl: root + "/starter",
		courseID: "rust-systems-security",
		courseProjectKey: rustCourseProjectKey(
			"rust-systems-security",
			rustBoundedCliItemIds.core,
			"starter",
			root + "/starter"
		)
	});
	expect(legacy.courseProjectKey).toBe(
		`rust-systems-security:${rustBoundedCliItemIds.core}:starter`
	);
	expect(current.courseProjectKey).toBe(
		legacy.courseProjectKey + ":native-rust"
	);
	saveLocalPythonProjects([legacy, current]);
	const restored = loadLocalPythonProjects();
	expect(restored).toHaveLength(2);
	expect(restored.find(project => project._id === legacy._id)).toEqual(
		legacy
	);
	expect(restored.find(project => project._id === current._id)).toEqual(
		current
	);
});

it.each([
	["starter/fixtures/empty.txt", true],
	["solution/fixtures/custom_1.txt", true],
	["fixtures/new-case.txt", true],
	["fixtures/a.b.txt", false],
	["fixtures/../valid.txt", false],
	["fixtures/a/b.txt", false],
	["other/valid.txt", false],
	["fixtures/.txt", false],
	["fixtures/" + "a".repeat(29) + ".txt", false],
	["fixtures/valid.bin", false]
])(
	"keeps browser and API fixture boundaries aligned for %s",
	(name, allowed) => {
		expect(isRustProjectTextPath(name as string)).toBe(allowed);
		expect(apiRustProjectTextPath(name as string)).toBe(allowed);
		expect(isValidPythonFileName(name as string, "rust")).toBe(allowed);
	}
);
