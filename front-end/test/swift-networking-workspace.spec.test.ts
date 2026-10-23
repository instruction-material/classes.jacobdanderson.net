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
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { swiftBuildInstructions } from "@/modules/swiftBuildInstructions";
import {
	swiftCourseProjectKey,
	swiftCourseResource,
	swiftNetworkingRoot,
	swiftSourceRevision,
	swiftWelcomeRoot
} from "@/modules/swiftProjectResources";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";

const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/swift-networking-source.json"),
		"utf8"
	)
);

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("Swift networking workspace", () => {
	it("adapts the maintained reading to neutral course copy and keeps its published identity", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById(
			"intro-to-swift-app-development"
		))!;
		const module = course.modules.find(
			row => row.title === "SW12 Networking and Data Loading"
		)!;
		const project = module.curriculum.find(
			row => row.title === "Project: API-Powered Reference App"
		)!;
		expect(project.id).toBe(
			module.id + "-curriculum-project-api-powered-reference-app"
		);
		expect(project.content).toBe(
			fixture.files[fixture.pack + "/README.md"].content
				.trim()
				.replace(
					"Both roles start with",
					"Both roles initially display"
				)
				.replace("For an instructor walkthrough, pause", "Pause")
		);
		expect(project.ideImport).toBe(true);
		expect(project.learningPath).toBe("core");
		expect(project.projectLink).toBe(swiftNetworkingRoot + "/starter");
		expect(project.solutionLink).toBeUndefined();
		const raw = (await loadRawCourse("intro-to-swift-app-development"))!;
		const reference = raw.modules
			.flatMap(row => row.curriculum)
			.find(row => row.title === "Project: API-Powered Reference App")!;
		expect(reference.solutionLink).toBe(swiftNetworkingRoot + "/solution");
		const readiness = module.supplementalProjects.find(
			row =>
				row.title ===
				"SW12 Networking and Data Loading: Readiness Check"
		)!;
		expect(readiness.id).toBe(
			module.id +
				"-supplemental-sw12-networking-and-data-loading-readiness-check"
		);
		expect(readiness.ideImport).toBe(true);
		expect(readiness.projectLink).toBe(swiftNetworkingRoot + "/starter");
		expect(readiness.solutionLink).toBeUndefined();
		expect(
			swiftCourseProjectKey(
				course.id,
				readiness.id,
				"starter",
				readiness.projectLink!
			)
		).toBe(
			swiftCourseProjectKey(
				course.id,
				project.id,
				"starter",
				project.projectLink!
			)
		);
	});

	it.each(["starter", "solution"] as const)(
		"retains the complete single-role %s pack through editing, save/reopen and ZIP export",
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
			const source = swiftNetworkingRoot + "/" + role;
			const files = await loadPythonIdeStarterFilesFromGitHub(
				source,
				"swift"
			);
			const names = [
				role + "/ContentView.swift",
				role + "/APIReferenceApp.swift",
				role + "/ReferenceClient.swift",
				role + "/ReferenceStore.swift",
				"README.md",
				"verify-networking.py",
				"tests/ReferenceContracts.swift"
			];
			expect(files.map(file => file.name)).toEqual(names);
			expect(requests).toHaveLength(7);
			expect(requests.every(url => url.includes(fixture.revision))).toBe(
				true
			);
			const keyRole = role === "starter" ? "starter" : "reference";
			const key = swiftCourseProjectKey(
				"intro-to-swift-app-development",
				"core",
				keyRole,
				source
			);
			expect(key).toBe(
				"intro-to-swift-app-development:api-reference:" +
					keyRole +
					":native-swift-v1"
			);
			expect(
				swiftCourseProjectKey(
					"intro-to-swift-app-development",
					"readiness",
					keyRole,
					source
				)
			).toBe(key);
			expect(
				swiftCourseProjectKey(
					"intro-to-swift-app-development",
					"readiness",
					keyRole,
					swiftWelcomeRoot + "/" + role
				)
			).not.toBe(key);
			const project = createPythonIdeProject("swift", {
				files,
				starterUrl: source,
				courseProjectKey: key,
				courseID: "intro-to-swift-app-development"
			});
			expect(project.activeFileName).toBe(role + "/ContentView.swift");
			project.files[0].content += "\n// Retained search observation\n";
			saveLocalPythonProjects([project]);
			const [reopened] = loadLocalPythonProjects();
			expect(reopened.files).toEqual(project.files);
			expect(reopened.courseProjectKey).toBe(key);
			const archive = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(archive)).toHaveLength(7);
			for (const file of reopened.files) {
				const path = Object.keys(archive).find(path =>
					path.endsWith("/" + file.name)
				)!;
				expect(strFromU8(archive[path])).toBe(file.content);
			}
			const instructions = swiftBuildInstructions(files).join("\n");
			expect(instructions).toContain("only the four Swift files");
			expect(instructions).toContain(
				"Keep tests/ReferenceContracts.swift outside the app target"
			);
			expect(instructions).toContain("python3 verify-networking.py");
		}
	);

	it("accepts only the exact verifier path and each pack's own immutable revision", () => {
		for (const path of [
			"verify-networking.py",
			"tests/ReferenceContracts.swift"
		])
			expect(isValidPythonFileName(path, "swift")).toBe(true);
		for (const path of [
			"main.py",
			"tools/verify-networking.py",
			"Verify-networking.py",
			"../verify-networking.py"
		])
			expect(isValidPythonFileName(path, "swift")).toBe(false);
		expect(
			swiftCourseResource(
				swiftNetworkingRoot.replace(fixture.revision, "main") +
					"/starter"
			)?.resource.ref
		).toBe(fixture.revision);
		expect(
			swiftCourseResource(
				swiftNetworkingRoot.replace(
					fixture.revision,
					swiftSourceRevision
				) + "/starter"
			)
		).toBeNull();
		expect(
			swiftCourseResource(
				swiftWelcomeRoot.replace(
					swiftSourceRevision,
					fixture.revision
				) + "/starter"
			)
		).toBeNull();
		expect(
			pythonIdeModeForCourseResource(
				"intro-to-swift-app-development",
				swiftNetworkingRoot + "/starter"
			)
		).toBe("swift");
	});
});
