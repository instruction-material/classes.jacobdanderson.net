import { readFileSync } from "node:fs";
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
import { swiftBuildInstructions } from "@/modules/swiftBuildInstructions";
import {
	swiftCourseProjectKey,
	swiftCourseResource,
	swiftImportFiles,
	swiftDataTrackerRoot,
	swiftTrackerRoot,
	swiftWelcomeRoot
} from "@/modules/swiftProjectResources";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";

const definitions = [
	{
		label: "tracker",
		root: swiftTrackerRoot,
		projectKey: "simple-tracker",
		module: "SW10 Lists, Forms, and CRUD",
		title: "Project: Simple Tracker App",
		app: "SimpleTrackerApp.swift",
		model: "TrackerItem.swift",
		store: "TrackerStore.swift",
		shared: [
			"README.md",
			"verify-tracker.py",
			"tests/TrackerContracts.swift"
		]
	},
	{
		label: "swiftdata",
		root: swiftDataTrackerRoot,
		projectKey: "swiftdata-tracker",
		module: "SW11 Persistence with SwiftData",
		title: "Project Pass: Persist the Simple Tracker App",
		app: "PersistentTrackerApp.swift",
		model: "TrackerRecord.swift",
		store: "TrackerPersistence.swift",
		shared: [
			"README.md",
			"verify-persistence.py",
			"tests/PersistenceContracts.swift",
			"Package.swift",
			"tests/PersistenceTests.swift"
		]
	}
];
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

for (const definition of definitions) {
	const fixture = JSON.parse(
		readFileSync(
			resolve(`../test/fixtures/swift-${definition.label}-source.json`),
			"utf8"
		)
	);
	describe(`Swift ${definition.label} workspace`, () => {
		it("keeps published activity identities, complete reading and one saved continuation per role", async () => {
			setActivePinia(createPinia());
			const raw = (await loadRawCourse(
				"intro-to-swift-app-development"
			))!;
			const module = raw.modules.find(
				row => row.title === definition.module
			)!;
			const project = module.curriculum.find(
				row => row.title === definition.title
			)!;
			expect(project.content).toBe(
				fixture.files[fixture.pack + "/README.md"].content
					.trim()
					.replace(
						"../SAD5-SwiftData-Tracker-App/README.md",
						"/courses#intro-to-swift-app-development-sw11-persistence-with-swiftdata"
					)
			);
			expect(project.ideImport).toBe(true);
			expect(project.projectLink).toBe(definition.root + "/starter");
			expect(project.solutionLink).toBe(definition.root + "/solution");
			const visible = (await useCoursesStore().loadCourseById(
				"intro-to-swift-app-development"
			))!;
			const active = visible.modules.find(
				row => row.title === definition.module
			)!;
			const core = active.curriculum.find(
				row => row.title === definition.title
			)!;
			const suffix =
				definition.label === "tracker"
					? "project-simple-tracker-app"
					: "project-pass-persist-the-simple-tracker-app";
			expect(core.id).toBe(active.id + "-curriculum-" + suffix);
			const ready = active.supplementalProjects.find(row =>
				row.title.endsWith(": Readiness Check")
			)!;
			expect(ready.ideImport).toBe(true);
			expect(ready.projectLink).toBe(definition.root + "/starter");
			expect(core.solutionLink).toBeUndefined();
			for (const role of ["starter", "reference"] as const) {
				const key = swiftCourseProjectKey(
					visible.id,
					core.id,
					role,
					core.projectLink!
				);
				expect(
					swiftCourseProjectKey(
						visible.id,
						ready.id,
						role,
						ready.projectLink!
					)
				).toBe(key);
				expect(key).toBe(
					`${visible.id}:${definition.projectKey}:${role}:native-swift-v1`
				);
				for (const other of [
					swiftWelcomeRoot,
					...definitions
						.filter(row => row.label !== definition.label)
						.map(row => row.root)
				])
					expect(
						swiftCourseProjectKey(
							visible.id,
							core.id,
							role,
							other + "/starter"
						)
					).not.toBe(key);
			}
		});
		it.each(["starter", "solution"] as const)(
			"imports, edits, reopens and exports only the complete %s role",
			async role => {
				const requests: string[] = [];
				vi.stubGlobal(
					"fetch",
					vi.fn(async (input: string | URL) => {
						const url = String(input);
						requests.push(url);
						const file =
							fixture.files[
								url.split("/" + fixture.revision + "/")[1]
							];
						return new Response(file?.content ?? "missing", {
							status: file ? 200 : 404
						});
					})
				);
				const files = await loadPythonIdeStarterFilesFromGitHub(
					definition.root + "/" + role,
					"swift"
				);
				const names = [
					"ContentView.swift",
					definition.app,
					definition.model,
					definition.store
				]
					.map(name => role + "/" + name)
					.concat(definition.shared);
				expect(files.map(file => file.name)).toEqual(names);
				expect(requests).toHaveLength(names.length);
				expect(
					requests.every(url => url.includes(fixture.revision))
				).toBe(true);
				const key = swiftCourseProjectKey(
					"intro-to-swift-app-development",
					"core",
					role === "starter" ? "starter" : "reference",
					definition.root + "/" + role
				);
				const project = createPythonIdeProject("swift", {
					files,
					starterUrl: definition.root + "/" + role,
					courseProjectKey: key,
					courseID: "intro-to-swift-app-development"
				});
				project.files[0].content += "\n// Saved tracker observation\n";
				saveLocalPythonProjects([project]);
				const [reopened] = loadLocalPythonProjects();
				expect(reopened.files).toEqual(project.files);
				expect(reopened.courseProjectKey).toBe(key);
				const archive = unzipSync(await createProjectArchive(reopened));
				expect(Object.keys(archive)).toHaveLength(names.length);
				for (const file of reopened.files) {
					const path = Object.keys(archive).find(path =>
						path.endsWith("/" + file.name)
					)!;
					expect(strFromU8(archive[path])).toBe(file.content);
				}
				const instructions = swiftBuildInstructions(files).join("\n");
				expect(instructions).toContain("only the four Swift files");
				expect(instructions).toContain("one @main");
				expect(instructions).toContain(
					"python3 " + definition.shared[1]
				);
				expect(instructions).toContain(
					"Keep " + definition.shared[2] + " outside the app target"
				);
				if (definition.label === "swiftdata") {
					expect(instructions).toContain(
						"Keep Package.swift and tests/PersistenceTests.swift outside"
					);
					expect(instructions).toContain("swift test");
					expect(instructions).toContain("starter uses memory");
				}
			}
		);
		it.each([
			"23e1cae59dd989b6f97d8d13ebb5f4718223424d",
			"73fdbeaf3f3358d4a3ce6bb8086612d52689e41a",
			"ff14c210700f7297d69ddfcab570a0315e9ac234"
		])(
			"keeps earlier %s links complete and resumes the same saved role",
			earlier => {
				const oldRoot = definition.root.replace(
					fixture.revision,
					earlier
				);
				for (const role of ["starter", "solution"] as const) {
					const url = oldRoot + "/" + role;
					expect(swiftCourseResource(url)?.resource.ref).toBe(
						earlier
					);
					expect(swiftCourseResource(url)?.revision).toBe(earlier);
					const files = swiftImportFiles(url)!;
					expect(files).toHaveLength(definition.shared.length + 4);
					expect(
						files.every(file =>
							file.file.rawUrl.includes("/" + earlier + "/")
						)
					).toBe(true);
					const keyRole =
						role === "starter" ? "starter" : "reference";
					expect(
						swiftCourseProjectKey(
							"intro-to-swift-app-development",
							"core",
							keyRole,
							url
						)
					).toBe(
						swiftCourseProjectKey(
							"intro-to-swift-app-development",
							"core",
							keyRole,
							definition.root + "/" + role
						)
					);
				}
			}
		);
		it("pins only its own source and accepts no arbitrary Python helper", () => {
			expect(
				swiftCourseResource(
					definition.root.replace(fixture.revision, "main") +
						"/starter"
				)?.resource.ref
			).toBe(fixture.revision);
			expect(
				swiftCourseResource(
					definition.root.replace(
						fixture.revision,
						"d8110b0b359a7499a9de9fc3c31dfac26b411b3e"
					) + "/starter"
				)
			).toBeNull();
			for (const name of definition.shared)
				expect(isValidPythonFileName(name, "swift")).toBe(true);
			for (const name of [
				"main.py",
				"tools/" + definition.shared[1],
				"../" + definition.shared[1],
				definition.shared[1].toUpperCase()
			])
				expect(isValidPythonFileName(name, "swift")).toBe(false);
		});
	});
}
