import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import {
	javascriptCourseProjectKey,
	javascriptCourseResource
} from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-business-directory-sources.json"),
		"utf8"
	)
);
const prefix = "/course-assets/javascript-level-2/";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(
		"imports complete local Businesses II " +
			resource.role +
			" and preserves edited work through reopening and ZIP export",
		async () => {
			vi.stubGlobal("crypto", webcrypto);
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (url: string, options: RequestInit) => {
					expect(url.startsWith(prefix)).toBe(true);
					expect(options).toMatchObject({
						credentials: "omit",
						redirect: "error"
					});
					requests.push(url);
					return new Response(
						readFileSync(
							resolve(
								"public/course-assets/javascript-level-2",
								url.slice(prefix.length)
							)
						)
					);
				})
			);
			expect(
				pythonIdeModeForCourseResource(
					fixture.courseId,
					resource.urls[0]
				)
			).toBe("web");
			expect(requests).toHaveLength(0);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				resource.urls[0],
				"web"
			);
			expect(files).toHaveLength(18);
			for (const file of files) {
				const expected = resource.files.find(
					(f: { name: string }) => f.name === file.name
				);
				expect(file.content).toBe(
					fixture.files[resource.role][file.name]
				);
				expect(sha(file.content)).toBe(expected.sha256);
			}
			const key = javascriptCourseProjectKey(
				fixture.courseId,
				fixture.itemId,
				resource.role,
				resource.urls[0]
			);
			for (const alias of resource.urls)
				expect(
					javascriptCourseProjectKey(
						fixture.courseId,
						fixture.itemId,
						resource.role,
						alias
					)
				).toBe(key);
			const earlier = createPythonIdeProject("web", {
				courseID: fixture.courseId,
				courseProjectKey: key + ":earlier",
				files: [
					{
						name: "index.html",
						content: "Earlier object planning",
						encoding: "text"
					}
				]
			});
			const project = createPythonIdeProject("web", {
				courseID: fixture.courseId,
				courseProjectKey: key,
				starterUrl: resource.urls[0],
				files
			});
			project.files.find(file => file.name === "README.md")!.content +=
				"\nObserved all business and product records.\n";
			await saveLocalPythonProjects([earlier, project]);
			const saved = await loadLocalPythonProjects();
			expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
			const reopened = saved.find(row => row._id === project._id)!;
			expect(reopened).toEqual(project);
			const archive = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(archive)).toHaveLength(18);
			for (const file of reopened.files) {
				const name = Object.keys(archive).find(n =>
					n.endsWith("/" + file.name)
				)!;
				expect(strFromU8(archive[name])).toBe(file.content);
			}
		}
	);
}

for (const role of ["learner", "instructor"] as const) {
	it(
		"preserves the published Businesses II identity and source role for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "businesses-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: [fixture.courseId],
					editTutors: false,
					saveEdit: "Save"
				});
			const course = (await useCoursesStore().loadCourseById(
				fixture.courseId
			))!;
			const module = course.modules.find(m => m.id === fixture.moduleId)!;
			expect(module).toBeDefined();
			const item = module.supplementalProjects.find(
				i => i.id === fixture.itemId
			)!;
			expect(item.learningPath).toBe("choice");
			expect(item.title).toBe(
				"JSM6 Supplemental Project 1: My Favorite Businesses II"
			);
			for (const token of [
				"at least three business objects",
				"autocomplete",
				"logo_image",
				"display_image",
				"No business found.",
				"fictional",
				"CASES.md"
			])
				expect(item.content).toContain(token);
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.project).toBe(
				"my-favorite-businesses-ii"
			);
			expect(
				pythonIdeModeForCourseResource(
					"javascript-level-1-javascript-superstar",
					item.projectLink!
				)
			).toBeNull();
		}
	);
}

it("retains distinct unfinished and complete roles with complete offline sources", () => {
	for (const resource of fixture.resources) {
		for (const file of resource.files) {
			const content = readFileSync(
				resolve("public/course-assets/javascript-level-2", file.path),
				"utf8"
			);
			expect(content).toBe(fixture.files[resource.role][file.name]);
			expect(sha(content)).toBe(file.sha256);
			expect(new TextEncoder().encode(content)).toHaveLength(
				file.byteLength
			);
		}
		expect(fixture.files[resource.role]["index.html"]).not.toMatch(
			/(?:src|href)=["']https?:/
		);
		expect(fixture.files[resource.role]["SOURCES.md"]).toContain(
			"M.Autocomplete"
		);
		expect(
			fixture.files[resource.role]["vendor/d3.min.js"].slice(0, 100)
		).toContain("v7.9.0");
		expect(
			fixture.files[resource.role]["LICENSE-Materialize.txt"]
		).toContain("MIT");
	}
	expect(fixture.files.starter["script.js"]).toContain(
		"const businesses = [];"
	);
	expect(fixture.files.starter["script.js"]).toContain("// TODO:");
	expect(fixture.files.reference["script.js"]).toContain(
		"No business found."
	);
	expect(
		javascriptCourseProjectKey(
			fixture.courseId,
			fixture.itemId,
			"starter",
			fixture.resources[0].urls[0]
		)
	).not.toBe(
		javascriptCourseProjectKey(
			fixture.courseId,
			fixture.itemId,
			"reference",
			fixture.resources[1].urls[0]
		)
	);
});
