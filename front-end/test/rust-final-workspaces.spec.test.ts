import { readingWithoutFilenameFormatting } from "./course-reading-format";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { rustBuildInstructions } from "@/modules/rustBuildInstructions";
import { isRustProjectTextPath } from "@/modules/rustProjectFiles";
import * as resources from "@/modules/rustProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { isRustProjectTextPath as apiRustProjectTextPath } from "../../back-end/src/utils/rustProjectFiles";

interface SourceFixture {
	revision: string;
	pack: string;
	files: Record<string, { content: string }>;
}

function sourceFixture(kind: string): SourceFixture {
	return JSON.parse(
		readFileSync(
			resolve(
				process.cwd(),
				`../test/fixtures/rust-${kind}-contracts.json`
			),
			"utf8"
		)
	);
}

const lessons = [
	{
		kind: "concurrency",
		moduleId: resources.rustConcurrencyModuleId,
		ids: resources.rustConcurrencyItemIds,
		count: 11,
		legacyPack:
			"RUST-17-rss8-concurrency-and-race-reduction-supplemental-2",
		tokens: ["capacity-two", "joined", "E0277"]
	},
	{
		kind: "boundary-review",
		moduleId: resources.rustBoundaryReviewModuleId,
		ids: resources.rustBoundaryReviewItemIds,
		count: 12,
		legacyPack:
			"RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2",
		tokens: ["raw_sum", "E0133", "miri-dangling.rs"]
	},
	{
		kind: "record-hardening",
		moduleId: resources.rustRecordHardeningModuleId,
		ids: resources.rustRecordHardeningItemIds,
		count: 7,
		legacyPack:
			"RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2",
		tokens: ["parse_record", "--case combined", "owned"]
	}
] as const;

function selected(fixture: SourceFixture, role: string) {
	return Object.entries(fixture.files)
		.filter(
			([name]) =>
				name === `${fixture.pack}/README.md`
				|| name.startsWith(`${fixture.pack}/${role}/`)
		)
		.map(([name, row]) => ({
			name: name.slice(fixture.pack.length + 1),
			content: row.content
		}));
}

function sourceRoot(fixture: SourceFixture) {
	return `https://github.com/instruction-material/Low-Level-Security/tree/${fixture.revision}/${fixture.pack}`;
}

afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

describe.each(lessons)("rust $kind workspace", (lesson) => {
	const fixture = sourceFixture(lesson.kind);
	const root = sourceRoot(fixture);

	it("retains four distinct published activities, complete reading and staff-only references", async () => {
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "rust-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["rust-systems-security"],
			editTutors: false,
			saveEdit: "Save"
		});
		const staff = (await useCoursesStore().loadCourseById(
			"rust-systems-security"
		))!;
		const module = staff.modules.find(item => item.id === lesson.moduleId)!;
		expect(module).toBeDefined();
		const items = [...module.curriculum, ...module.supplementalProjects];
		const activities = Object.entries(lesson.ids).map(([kind, id]) => {
			const item = items.find(candidate => candidate.id === id)!;
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
					fixture.files[`${fixture.pack}/README.md`].content.trim()
				)
			);
			expect(item.projectLink).toBe(`${root}/starter`);
			expect(item.solutionLink).toBe(`${root}/solution`);
			expect(item.ideImport).toBe(true);
			return item;
		});
		expect(new Set(activities.map(item => item.title)).size).toBe(4);
		expect(
			new Set(activities.map(item => item.content?.split("\n\n")[0])).size
		).toBe(4);
		app.setCurrentTutor(null);
		const learner = (await useCoursesStore().loadCourseById(
			"rust-systems-security"
		))!;
		const learnerModule = learner.modules.find(
			item => item.id === lesson.moduleId
		)!;
		for (const id of Object.values(lesson.ids)) {
			const item = [
				...learnerModule.curriculum,
				...learnerModule.supplementalProjects
			].find(item => item.id === id)!;
			expect(item.solutionLink).toBeUndefined();
			expect(item.content).toBe(
				activities.find(activity => activity.id === id)!.content
			);
		}
	});

	it.each(["starter", "solution"] as const)(
		"imports the complete %s role, preserves earlier work, edits, reopens and exports",
		async (role) => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (input: string | URL) => {
					const url = String(input);
					requests.push(url);
					const row
						= fixture.files[url.split(`/${fixture.revision}/`)[1]];
					return new Response(row?.content ?? "missing", {
						status: row ? 200 : 404
					});
				})
			);
			const url = `${root}/${role}`;
			const files = await loadPythonIdeStarterFilesFromGitHub(
				url,
				"rust"
			);
			expect(files).toHaveLength(lesson.count);
			expect(requests).toHaveLength(lesson.count);
			expect(files).toEqual(
				expect.arrayContaining(
					selected(fixture, role).map(file =>
						expect.objectContaining(file)
					)
				)
			);
			for (const file of files) {
				expect(file.encoding).toBe("text");
				expect(isValidPythonFileName(file.name, "rust")).toBe(true);
				expect(isRustProjectTextPath(file.name)).toBe(
					file.name !== "README.md"
				);
				expect(apiRustProjectTextPath(file.name)).toBe(
					file.name !== "README.md"
				);
			}
			const instructions = rustBuildInstructions(files, url).join("\n");
			for (const token of [
				"1.97.1",
				"edition 2024",
				"cargo test --locked --offline",
				...lesson.tokens
			])
				expect(instructions).toContain(token);
			expect(
				rustBuildInstructions(
					files.filter(file => file.name !== `${role}/src/lib.rs`),
					url
				).join("\n")
			).toContain("incomplete");

			const cargo = sourceFixture("cargo");
			const cargoURL = `${sourceRoot(cargo)}/starter`;
			const earlier = createPythonIdeProject("rust", {
				files: selected(cargo, "starter"),
				starterUrl: cargoURL,
				courseID: "rust-systems-security",
				courseProjectKey: resources.rustCourseProjectKey(
					"rust-systems-security",
					resources.rustCargoItemIds.core,
					"starter",
					cargoURL
				)
			});
			const projectRole = role === "starter" ? "starter" : "reference";
			const legacyURL = `https://github.com/instruction-material/Low-Level-Security/tree/main/${lesson.legacyPack}/${role}`;
			const legacy = createPythonIdeProject("rust", {
				files: [
					{
						name: "main.rs",
						content: "fn main() { /* Earlier work */ }\n"
					}
				],
				starterUrl: legacyURL,
				courseID: "rust-systems-security",
				courseProjectKey: resources.rustCourseProjectKey(
					"rust-systems-security",
					lesson.ids.core,
					projectRole,
					legacyURL
				)
			});
			const project = createPythonIdeProject("rust", {
				files,
				starterUrl: url,
				courseID: "rust-systems-security",
				courseProjectKey: resources.rustCourseProjectKey(
					"rust-systems-security",
					lesson.ids.core,
					projectRole,
					url
				)
			});
			expect(project.activeFileName).toBe(`${role}/observations.md`);
			expect(
				new Set([
					earlier.courseProjectKey,
					legacy.courseProjectKey,
					project.courseProjectKey
				]).size
			).toBe(3);
			expect(project.courseProjectKey).toBe(
				`${legacy.courseProjectKey}:native-rust`
			);
			project.files = files.map(file => ({
				...file,
				content:
					file.content
					+ (file.name.endsWith("observations.md")
						? "\nSaved observations.\n"
						: file.name.endsWith("src/lib.rs")
							? "\n// Saved source.\n"
							: "")
			}));
			saveLocalPythonProjects([earlier, legacy, project]);
			const restored = loadLocalPythonProjects();
			expect(restored).toHaveLength(3);
			for (const previous of [earlier, legacy]) {
				expect(
					restored.find(item => item._id === previous._id)
				).toEqual(previous);
			}
			const saved = restored.find(item => item._id === project._id)!;
			expect(saved).toEqual(project);
			const entries = unzipSync(createProjectArchive(saved));
			expect(Object.keys(entries)).toHaveLength(lesson.count);
			for (const file of saved.files) {
				expect(strFromU8(entries[`${saved.title}/${file.name}`])).toBe(
					file.content
				);
			}
			for (const id of Object.values(lesson.ids)) {
				expect(
					resources.rustCourseProjectKey(
						"rust-systems-security",
						id,
						projectRole,
						url
					)
				).toBe(project.courseProjectKey);
			}
			if (process.env.RUST_FINAL_EXPORT_PROOF_DIR) {
				const directory = resolve(
					process.env.RUST_FINAL_EXPORT_PROOF_DIR,
					`rust-${lesson.kind}-exports`
				);
				mkdirSync(directory, { recursive: true });
				writeFileSync(
					resolve(directory, `${role}.zip`),
					createProjectArchive(
						createPythonIdeProject("rust", {
							files,
							starterUrl: url,
							title: `${lesson.kind} lesson`
						})
					)
				);
			}
		}
	);

	it("requires the accepted revision and role root without grouping an unrelated activity", () => {
		for (const url of [
			`${root.replace(fixture.revision, "main")}/starter`,
			`${root.replace(
				fixture.revision,
				resources.rustCargoRevision
			)}/starter`,
			`${root}/starter/src/lib.rs`
		])
			expect(resources.rustCourseResource(url)).toBeNull();
		expect(
			resources.rustCourseResource(`${root}/starter`)?.definition.kind
		).toBe(lesson.kind);
		expect(
			resources.rustCourseProjectKey(
				"rust-systems-security",
				resources.rustCargoItemIds.core,
				"starter",
				`${root}/starter`
			)
		).not.toContain(lesson.ids.core);
	});
});
