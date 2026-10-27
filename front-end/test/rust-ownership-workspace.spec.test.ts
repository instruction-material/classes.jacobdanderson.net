import { readingWithoutFilenameFormatting } from "./course-reading-format";
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
	rustOwnershipItemIds,
	rustOwnershipModuleId,
	rustOwnershipPack,
	rustOwnershipRevision,
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
			"../test/fixtures/rust-ownership-contracts.json"
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
const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustOwnershipRevision}/${rustOwnershipPack}`;
const cargoRoot = `https://github.com/instruction-material/Low-Level-Security/tree/${rustCargoRevision}/${rustCargoPack}`;
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("gives the ownership module four distinct, complete activities without exposing the reference to a learner", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "ownership-tutor",
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
		item => item.id === rustOwnershipModuleId
	)!;
	const items = [...module.curriculum, ...module.supplementalProjects];
	for (const [kind, id] of Object.entries(rustOwnershipItemIds)) {
		const item = items.find(item => item.id === id)!;
		expect(item).toBeDefined();
		expect(item.learningPath).toBe(
			kind === "choice"
				? "choice"
				: kind === "challenge"
					? "challenge"
					: "core"
		);
		expect(readingWithoutFilenameFormatting(item.content)).toContain(
			readingWithoutFilenameFormatting(
				fixture.files[fixture.pack + "/README.md"].content
					.trim()
					.replace(
						"Step through\neach helper with an instructor or annotate it independently.",
						"Step through\neach helper and annotate the ownership transfers."
					)
			)
		);
		expect(item.projectLink).toBe(root + "/starter");
		expect(item.solutionLink).toBe(root + "/solution");
		expect(item.ideImport).toBe(true);
	}
	expect(
		items.find(item => item.id === rustOwnershipItemIds.core)!.content
	).toContain("OWNER LEDGER, PREDICT, CHECKS and LIMITS");
	expect(
		items.find(item => item.id === rustOwnershipItemIds.workflow)!.content
	).toContain("Complete SCOPE");
	expect(
		items.find(item => item.id === rustOwnershipItemIds.choice)!.content
	).toContain("Add a named test");
	expect(
		items.find(item => item.id === rustOwnershipItemIds.challenge)!.content
	).toContain("E0204");
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
			"String, Vec and Packet",
			"ScopeTag",
			"E0382",
			"E0204"
		])
			expect(instructions).toContain(token);
		expect(
			rustBuildInstructions(
				files.filter(file => !file.name.endsWith("copy-owned.rs")),
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
				rustOwnershipItemIds.core,
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
					? "\nSaved ownership observations.\n"
					: file.name.endsWith("src/main.rs")
						? "\n// Saved ownership source.\n"
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
		for (const id of Object.values(rustOwnershipItemIds))
			expect(
				rustCourseProjectKey(
					"rust-systems-security",
					id,
					role === "starter" ? "starter" : "reference",
					url
				)
			).toBe(project.courseProjectKey);
		if (process.env.RUST_OWNERSHIP_EXPORT_PROOF_DIR) {
			const { mkdirSync, writeFileSync } = await import("node:fs");
			mkdirSync(process.env.RUST_OWNERSHIP_EXPORT_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				resolve(
					process.env.RUST_OWNERSHIP_EXPORT_PROOF_DIR,
					role + ".zip"
				),
				createProjectArchive(
					createPythonIdeProject("rust", {
						files,
						starterUrl: url,
						title: "Ownership lesson"
					})
				)
			);
		}
	}
);

it("requires the ownership pack's exact accepted revision and keeps lesson keys independent", () => {
	for (const url of [
		root.replace(rustOwnershipRevision, "main") + "/starter",
		root.replace(rustOwnershipRevision, rustCargoRevision) + "/starter",
		root + "/starter/src/main.rs"
	])
		expect(rustCourseResource(url)).toBeNull();
	expect(rustCourseResource(cargoRoot + "/starter")?.definition.kind).toBe(
		"cargo"
	);
	expect(rustCourseResource(root + "/starter")?.definition.kind).toBe(
		"ownership"
	);
	const key = rustCourseProjectKey(
		"rust-systems-security",
		rustCargoItemIds.choice,
		"starter",
		root + "/starter"
	);
	expect(key).not.toContain(rustOwnershipItemIds.core);
});
