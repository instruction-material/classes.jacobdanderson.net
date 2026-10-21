import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { createProjectArchive } from "@/modules/projectArchive";
import { rustBuildInstructions } from "@/modules/rustBuildInstructions";
import {
	rustCargoItemIds,
	rustCargoPack,
	rustCargoRevision,
	rustTraitPipelineItemIds,
	rustTraitPipelineModuleId,
	rustTraitPipelinePack,
	rustTraitPipelineRevision,
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
			"../test/fixtures/rust-trait-pipeline-contracts.json"
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
const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustTraitPipelineRevision}/${rustTraitPipelinePack}`;
const cargoRoot = `https://github.com/instruction-material/Low-Level-Security/tree/${rustCargoRevision}/${rustCargoPack}`;
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("gives the trait-pipeline module four distinct, complete activities without exposing the reference to a learner", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "trait-pipeline-tutor",
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
		item => item.id === rustTraitPipelineModuleId
	)!;
	const items = [...module.curriculum, ...module.supplementalProjects];
	const concepts = module.curriculum.find(item =>
		item.title.endsWith("Core Concepts")
	)!;
	expect(concepts.content).toContain("RowSource");
	expect(concepts.content).toContain("try_fold");
	expect(concepts.content).toContain("finite sequence");

	for (const [kind, id] of Object.entries(rustTraitPipelineItemIds)) {
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
		items.find(item => item.id === rustTraitPipelineItemIds.core)!.content
	).toContain("Complete CORE and LIMITS");
	expect(
		items.find(item => item.id === rustTraitPipelineItemIds.workflow)!
			.content
	).toContain("complete WORKFLOW");
	expect(
		items.find(item => item.id === rustTraitPipelineItemIds.choice)!.content
	).toContain("all_records");
	expect(
		items.find(item => item.id === rustTraitPipelineItemIds.challenge)!
			.content
	).toContain("E0505");
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
			"RowSource",
			"try_fold",
			"E0046",
			"E0505"
		])
			expect(instructions).toContain(token);
		expect(
			rustBuildInstructions(
				files.filter(file => !file.name.endsWith("missing-method.rs")),
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
				rustTraitPipelineItemIds.core,
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
					? "\nSaved trait-pipeline observations.\n"
					: file.name.endsWith("src/lib.rs")
						? "\n// Saved trait-pipeline source.\n"
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
		for (const id of Object.values(rustTraitPipelineItemIds))
			expect(
				rustCourseProjectKey(
					"rust-systems-security",
					id,
					role === "starter" ? "starter" : "reference",
					url
				)
			).toBe(project.courseProjectKey);
		if (process.env.RUST_TRAIT_PIPELINE_EXPORT_PROOF_DIR) {
			const { mkdirSync, writeFileSync } = await import("node:fs");
			mkdirSync(process.env.RUST_TRAIT_PIPELINE_EXPORT_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				resolve(
					process.env.RUST_TRAIT_PIPELINE_EXPORT_PROOF_DIR,
					role + ".zip"
				),
				createProjectArchive(
					createPythonIdeProject("rust", {
						files,
						starterUrl: url,
						title: "TraitPipeline lesson"
					})
				)
			);
		}
	}
);

it("requires the trait-pipeline pack's exact accepted revision and keeps lesson keys independent", () => {
	for (const url of [
		root.replace(rustTraitPipelineRevision, "main") + "/starter",
		root.replace(rustTraitPipelineRevision, rustCargoRevision) + "/starter",
		root + "/starter/src/lib.rs"
	])
		expect(rustCourseResource(url)).toBeNull();
	expect(rustCourseResource(cargoRoot + "/starter")?.definition.kind).toBe(
		"cargo"
	);
	expect(rustCourseResource(root + "/starter")?.definition.kind).toBe(
		"trait-pipeline"
	);
	const key = rustCourseProjectKey(
		"rust-systems-security",
		rustCargoItemIds.choice,
		"starter",
		root + "/starter"
	);
	expect(key).not.toContain(rustTraitPipelineItemIds.core);
});

it("preserves the same lesson's earlier sanitizer attempt under its legacy key", () => {
	const legacyUrl =
		"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/starter";
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
			rustTraitPipelineItemIds.core,
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
			rustTraitPipelineItemIds.core,
			"starter",
			root + "/starter"
		)
	});
	expect(legacy.courseProjectKey).toBe(
		`rust-systems-security:${rustTraitPipelineItemIds.core}:starter`
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
