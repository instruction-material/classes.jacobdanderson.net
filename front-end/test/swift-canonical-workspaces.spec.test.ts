import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { swiftBuildInstructions } from "@/modules/swiftBuildInstructions";
import {
	swiftCapstoneRoot,
	swiftCourseProjectKey,
	swiftCourseResource,
	swiftGalleryRoot,
	swiftHobbyRoot,
	swiftMapRoot
} from "@/modules/swiftProjectResources";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";

const projects = [
	{
		name: "gallery",
		title: "Project: Media Gallery App",
		root: swiftGalleryRoot,
		key: "media-gallery",
		app: "MediaGalleryApp.swift"
	},
	{
		name: "hobby",
		title: "Project: Multi-Tab Hobby App",
		root: swiftHobbyRoot,
		key: "multi-tab-hobby",
		app: "MultiTabHobbyApp.swift"
	},
	{
		name: "map",
		title: "Project: Map Places App",
		root: swiftMapRoot,
		key: "map-places",
		app: "MapPlacesApp.swift"
	},
	{
		name: "capstone",
		title: "Project: Publish-Ready Capstone App",
		root: swiftCapstoneRoot,
		key: "publish-ready-capstone",
		app: "PublishReadyCapstoneApp.swift"
	}
];

function fixtureFor(name: string) {
	return JSON.parse(
		readFileSync(
			resolve(`../test/fixtures/swift-${name}-source.json`),
			"utf8"
		)
	);
}

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("canonical Swift app workspaces", () => {
	it("retains the earlier Hobby source without replacing saved work", () => {
		const revision = "97028a411bf4752f06ce7bab228211958b3fca9b";
		const url = `https://github.com/instruction-material/Swift/tree/${revision}/SAD3-Multi-Tab-Hobby-App/solution`;
		expect(swiftCourseResource(url)?.revision).toBe(revision);
		expect(
			swiftCourseResource(`${swiftHobbyRoot}/solution`)?.revision
		).toBe("9c4599f12037847388a7760e82409c4481e0faf7");
	});
	it.each([
		"18bb2a5055a144cf545fa416f6bde6f00e863f36",
		"58d17abb7a09185558a74c44f0ba2e43a18f42c2"
	])("retains the earlier Gallery source at %s", revision => {
		const url = `https://github.com/instruction-material/Swift/tree/${revision}/SAD2-Media-Gallery-App/solution`;
		expect(swiftCourseResource(url)?.revision).toBe(revision);
		expect(
			swiftCourseResource(`${swiftGalleryRoot}/solution`)?.revision
		).not.toBe(revision);
	});
	it.each([
		"18bb2a5055a144cf545fa416f6bde6f00e863f36",
		"58d17abb7a09185558a74c44f0ba2e43a18f42c2"
	])("retains the earlier Hobby source at %s", revision => {
		const url = `https://github.com/instruction-material/Swift/tree/${revision}/SAD3-Multi-Tab-Hobby-App/solution`;
		expect(swiftCourseResource(url)?.revision).toBe(revision);
		expect(
			swiftCourseResource(`${swiftHobbyRoot}/solution`)?.revision
		).not.toBe(revision);
	});
	it.each([
		"18bb2a5055a144cf545fa416f6bde6f00e863f36",
		"58d17abb7a09185558a74c44f0ba2e43a18f42c2"
	])("retains the earlier Capstone source at %s", revision => {
		const url = `https://github.com/instruction-material/Swift/tree/${revision}/SAD7-Publish-Ready-Capstone/starter`;
		expect(swiftCourseResource(url)?.revision).toBe(revision);
		expect(
			swiftCourseResource(`${swiftCapstoneRoot}/starter`)?.revision
		).not.toBe(revision);
	});
	it.each(projects)(
		"keeps the $name lesson's identity, source and complete instructions",
		async project => {
			setActivePinia(createPinia());
			const course = (await useCoursesStore().loadCourseById(
				"intro-to-swift-app-development"
			))!;
			const item = course.modules
				.flatMap(module => module.curriculum)
				.find(item => item.title === project.title)!;
			const raw = (await loadRawCourse(course.id))!;
			const source = raw.modules
				.flatMap(module => module.curriculum)
				.find(item => item.title === project.title)!;
			const fixture = fixtureFor(project.name);
			expect(item).toBeDefined();
			expect(
				item.id.endsWith(
					`-curriculum-${project.title
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/-$/g, "")}`
				)
			).toBe(true);
			expect(source.aliases).toContain(project.title);
			expect(item.learningPath).toBe("core");
			expect(item.ideImport).toBe(true);
			expect(source.preserveInstructions).toBe(true);
			expect(item.projectLink).toBe(`${project.root}/starter`);
			expect(item.solutionLink).toBeUndefined();
			expect(source.solutionLink).toBe(`${project.root}/solution`);
			expect(source.content).toBe(
				fixture.files[`${fixture.pack}/README.md`].content
					.trim()
					.replaceAll("TODO", "`TODO`")
			);
			expect(source.content).toContain("## Run one source role");
			expect(source.content).toContain("## Core project");
			expect(source.content).not.toMatch(
				/your (?:student|instructor)|Julio/i
			);
			expect(fixture.revision).toBe(
				swiftCourseResource(`${project.root}/starter`)?.revision
			);
			for (const file of Object.values(fixture.files) as {
				content: string;
				sha256: string;
				size: number;
			}[]) {
				expect(
					createHash("sha256").update(file.content).digest("hex")
				).toBe(file.sha256);
				expect(Buffer.byteLength(file.content)).toBe(file.size);
			}
			expect(
				swiftCourseResource(
					`${project.root.replace(fixture.revision, "main")}/starter`
				)?.revision
			).toBe(fixture.revision);
			expect(
				swiftCourseResource(
					`${project.root.replace(
						fixture.revision,
						"d632ceb25abfac35ec4604babc9ea385a6afbcc2"
					)}/starter`
				)
			).toBeNull();
		}
	);

	for (const project of projects) {
		it.each(["starter", "solution"] as const)(
			`${
				project.name
			}: preserves a complete %s role through edit, reopen and ZIP export`,
			async role => {
				const fixture = fixtureFor(project.name);
				const requests: string[] = [];
				vi.stubGlobal(
					"fetch",
					vi.fn(async (input: string | URL) => {
						const url = String(input);
						requests.push(url);
						const file =
							fixture.files[
								url.split(`/${fixture.revision}/`)[1]
							];
						return new Response(file?.content ?? "missing", {
							status: file ? 200 : 404
						});
					})
				);
				const url = `${project.root}/${role}`;
				expect(
					pythonIdeModeForCourseResource(
						"intro-to-swift-app-development",
						url
					)
				).toBe("swift");
				const files = await loadPythonIdeStarterFilesFromGitHub(
					url,
					"swift"
				);
				expect(files.map(file => file.name)).toEqual([
					`${role}/ContentView.swift`,
					`${role}/${project.app}`,
					"README.md"
				]);
				expect(requests).toHaveLength(3);
				expect(
					requests.every(url => url.includes(`/${fixture.revision}/`))
				).toBe(true);
				const key = swiftCourseProjectKey(
					"intro-to-swift-app-development",
					"core",
					role === "starter" ? "starter" : "reference",
					url
				);
				expect(key).toBe(
					`intro-to-swift-app-development:${project.key}:${
						role === "starter" ? "starter" : "reference"
					}:native-swift-v1`
				);
				expect(
					swiftCourseProjectKey(
						"intro-to-swift-app-development",
						"readiness",
						role === "starter" ? "starter" : "reference",
						url
					)
				).toBe(key);
				const earlier = createPythonIdeProject("python", {
					files: [
						{ name: "main.py", content: "# Earlier course work\n" }
					],
					courseProjectKey: "earlier-course-attempt"
				});
				const attempt = createPythonIdeProject("swift", {
					files,
					starterUrl: url,
					courseProjectKey: key,
					courseID: "intro-to-swift-app-development"
				});
				const earlierBytes = JSON.stringify(earlier);
				attempt.files[0].content +=
					"\n// Retained canonical project observation\n";
				saveLocalPythonProjects([earlier, attempt]);
				const reopened = loadLocalPythonProjects();
				expect(
					JSON.stringify(
						reopened.find(item => item._id === earlier._id)
					)
				).toBe(earlierBytes);
				const saved = reopened.find(
					item => item.courseProjectKey === key
				)!;
				expect(saved.files).toEqual(attempt.files);
				expect(saved.activeFileName).toBe(`${role}/ContentView.swift`);
				const archive = unzipSync(await createProjectArchive(saved));
				expect(Object.keys(archive)).toHaveLength(3);
				for (const file of saved.files) {
					const path = Object.keys(archive).find(path =>
						path.endsWith(`/${file.name}`)
					)!;
					expect(strFromU8(archive[path])).toBe(file.content);
				}
				expect(
					swiftBuildInstructions(saved.files).join("\n")
				).toContain("one @main");
			}
		);
	}

	it("describes the implemented starter behavior and reference boundaries", () => {
		const guide = (name: string) => {
			const fixture = fixtureFor(name);
			return fixture.files[`${fixture.pack}/README.md`].content as string;
		};
		expect(guide("gallery")).toContain("The starter already");
		expect(guide("gallery")).toContain(
			"starter already implements this filter"
		);
		expect(guide("hobby")).toContain(
			"additional sheet remains an assignment"
		);
		expect(guide("map")).toContain("initially has no selected detail");
		expect(guide("capstone")).toContain("strings are fixtures");
		expect(guide("capstone")).toContain(
			"does not implement every learner's"
		);
	});
});
