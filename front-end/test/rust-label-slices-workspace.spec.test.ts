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
	rustLabelSlicesItemIds,
	rustLabelSlicesModuleId,
	rustLabelSlicesPack,
	rustLabelSlicesRevision,
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
			"../test/fixtures/rust-label-slices-contracts.json"
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
const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustLabelSlicesRevision}/${rustLabelSlicesPack}`;
const cargoRoot = `https://github.com/instruction-material/Low-Level-Security/tree/${rustCargoRevision}/${rustCargoPack}`;
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("gives the label-slices module four distinct, complete activities without exposing the reference to a learner", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "label-slices-tutor",
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
		item => item.id === rustLabelSlicesModuleId
	)!;
	const items = [...module.curriculum, ...module.supplementalProjects];
	const concepts = module.curriculum.find(item =>
		item.title.endsWith("Core Concepts")
	)!;
	expect(concepts.content).toContain("a🦀bc");
	expect(concepts.content).toContain("NotCharBoundary");
	expect(concepts.content).toContain("half-open");

	for (const [kind, id] of Object.entries(rustLabelSlicesItemIds)) {
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
			fixture.files[fixture.pack + "/README.md"].content
				.trim()
				.replace("one-byte byte slice", "one-byte slice")
		);
		expect(item.projectLink).toBe(root + "/starter");
		expect(item.solutionLink).toBe(root + "/solution");
		expect(item.ideImport).toBe(true);
	}
	expect(
		items.find(item => item.id === rustLabelSlicesItemIds.core)!.content
	).toContain("CORE, LABEL CASES, PREDICT, CHECKS and LIMITS");
	expect(
		items.find(item => item.id === rustLabelSlicesItemIds.workflow)!.content
	).toContain("complete WINDOWS");
	expect(
		items.find(item => item.id === rustLabelSlicesItemIds.choice)!.content
	).toContain("char_window");
	expect(
		items.find(item => item.id === rustLabelSlicesItemIds.challenge)!
			.content
	).toContain("status 101");
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
	"preserves all fourteen %s role files and the earlier Cargo attempt through editing, reopen and export",
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
		expect(files).toHaveLength(14);
		expect(requests).toHaveLength(14);
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
			"str_window",
			"NotCharBoundary",
			"E0277",
			"status 101"
		])
			expect(instructions).toContain(token);
		expect(
			rustBuildInstructions(
				files.filter(file => !file.name.endsWith("string-index.rs")),
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
				rustLabelSlicesItemIds.core,
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
					? "\nSaved label-slices observations.\n"
					: file.name.endsWith("src/lib.rs")
						? "\n// Saved label-slices source.\n"
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
		expect(Object.keys(entries)).toHaveLength(14);
		for (const file of saved.files)
			expect(strFromU8(entries[saved.title + "/" + file.name])).toBe(
				file.content
			);
		for (const id of Object.values(rustLabelSlicesItemIds))
			expect(
				rustCourseProjectKey(
					"rust-systems-security",
					id,
					role === "starter" ? "starter" : "reference",
					url
				)
			).toBe(project.courseProjectKey);
		if (process.env.RUST_LABEL_SLICES_EXPORT_PROOF_DIR) {
			const { mkdirSync, writeFileSync } = await import("node:fs");
			mkdirSync(process.env.RUST_LABEL_SLICES_EXPORT_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				resolve(
					process.env.RUST_LABEL_SLICES_EXPORT_PROOF_DIR,
					role + ".zip"
				),
				createProjectArchive(
					createPythonIdeProject("rust", {
						files,
						starterUrl: url,
						title: "LabelSlices lesson"
					})
				)
			);
		}
	}
);

it("requires the label-slices pack's exact accepted revision and keeps lesson keys independent", () => {
	for (const url of [
		root.replace(rustLabelSlicesRevision, "main") + "/starter",
		root.replace(rustLabelSlicesRevision, rustCargoRevision) + "/starter",
		root + "/starter/src/lib.rs"
	])
		expect(rustCourseResource(url)).toBeNull();
	expect(rustCourseResource(cargoRoot + "/starter")?.definition.kind).toBe(
		"cargo"
	);
	expect(rustCourseResource(root + "/starter")?.definition.kind).toBe(
		"label-slices"
	);
	const key = rustCourseProjectKey(
		"rust-systems-security",
		rustCargoItemIds.choice,
		"starter",
		root + "/starter"
	);
	expect(key).not.toContain(rustLabelSlicesItemIds.core);
});
