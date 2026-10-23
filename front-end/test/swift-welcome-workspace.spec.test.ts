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
	normalizePythonIdeMode,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { swiftBuildInstructions } from "@/modules/swiftBuildInstructions";
import {
	swiftCourseProjectKey,
	swiftCourseResource,
	swiftWelcomeRoot
} from "@/modules/swiftProjectResources";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(resolve("../test/fixtures/swift-welcome-source.json"), "utf8")
);

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("Swift source workspace", () => {
	it("teaches the first app with the maintained reading without changing published activity identity", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById(
			"intro-to-swift-app-development"
		))!;
		const module = course.modules.find(
			row =>
				row.id ===
				"intro-to-swift-app-development-sw3-swiftui-views-layout-and-modifiers"
		)!;
		const project = module.curriculum.find(
			row => row.title === "Project: Welcome Profile App"
		)!;
		expect(project.id).toBe(
			`${module.id}-curriculum-project-welcome-profile-app`
		);
		expect(project.content).toBe(
			fixture.files[`${fixture.pack}/README.md`].content.trim()
		);
		expect(project.ideImport).toBe(true);
		expect(project.learningPath).toBe("core");
	});

	it.each(["starter", "solution"] as const)(
		"imports and retains the complete %s role, saved edits and exact ZIP contents",
		async role => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (input: string | URL) => {
					const url = String(input);
					requests.push(url);
					const file =
						fixture.files[url.split(`/${fixture.revision}/`)[1]];
					return new Response(file?.content ?? "missing", {
						status: file ? 200 : 404
					});
				})
			);
			const source = `${swiftWelcomeRoot}/${role}`;
			const files = await loadPythonIdeStarterFilesFromGitHub(
				source,
				"swift"
			);
			expect(files.map(file => file.name)).toEqual([
				`${role}/ContentView.swift`,
				`${role}/WelcomeProfileApp.swift`,
				"README.md"
			]);
			expect(requests).toHaveLength(3);
			expect(requests.every(url => url.includes(fixture.revision))).toBe(
				true
			);
			const project = createPythonIdeProject("swift", {
				files,
				courseID: "intro-to-swift-app-development",
				courseProjectKey: swiftCourseProjectKey(
					"intro-to-swift-app-development",
					"original-activity",
					role === "starter" ? "starter" : "reference",
					source
				),
				starterUrl: source
			});
			expect(project.activeFileName).toBe(`${role}/ContentView.swift`);
			project.files[0].content += "\n// Retained learner observation\n";
			saveLocalPythonProjects([project]);
			const [reopened] = loadLocalPythonProjects();
			expect(reopened.mode).toBe("swift");
			expect(reopened.files).toEqual(project.files);
			const archive = unzipSync(await createProjectArchive(project));
			for (const file of project.files) {
				const name = Object.keys(archive).find(name =>
					name.endsWith(`/${file.name}`)
				)!;
				expect(strFromU8(archive[name])).toBe(file.content);
			}
			expect(swiftBuildInstructions(project.files).join("\n")).toContain(
				"one @main"
			);
			expect(
				swiftCourseProjectKey(
					"intro-to-swift-app-development",
					"later-readiness",
					role === "starter" ? "starter" : "reference",
					source
				)
			).toBe(project.courseProjectKey);
		}
	);

	it("keeps incompatible source links outside the verified import and enforces Swift text paths", () => {
		expect(normalizePythonIdeMode("swift")).toBe("swift");
		expect(
			swiftCourseResource(
				`${swiftWelcomeRoot.replace(fixture.revision, "main")}/starter`
			)?.resource.ref
		).toBe(fixture.revision);
		for (const path of [
			"SAD-28-sad15-networking-and-data-loading-supplemental-2/solution",
			"Mod1Pro1",
			"SAD5-Persistent-Tracker-App/solution"
		])
			expect(
				pythonIdeModeForCourseResource(
					"intro-to-swift-app-development",
					`https://github.com/instruction-material/Swift/tree/main/${path}`
				)
			).toBeNull();
		for (const path of [
			"starter/ContentView.swift",
			"Views/Profile.swift",
			"fixtures/case.json",
			"README.md",
			"Info.plist"
		])
			expect(isValidPythonFileName(path, "swift")).toBe(true);
		for (const path of [
			"../ContentView.swift",
			"Views//Profile.swift",
			"secret.env",
			"main.py",
			"app.png"
		])
			expect(isValidPythonFileName(path, "swift")).toBe(false);
		expect(isValidPythonFileName("ContentView.swift", "python")).toBe(
			false
		);
	});
});
