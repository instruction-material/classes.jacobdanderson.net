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
		resolve("../test/fixtures/javascript-weather-sources.json"),
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
		"imports complete local weather " +
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
			expect(files).toHaveLength(15);
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
						content: "Earlier weather planning",
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
				"\nObserved all five weather cases.\n";
			await saveLocalPythonProjects([earlier, project]);
			const saved = await loadLocalPythonProjects();
			expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
			const reopened = saved.find(row => row._id === project._id)!;
			expect(reopened).toEqual(project);
			const archive = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(archive)).toHaveLength(15);
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
		"offers the correct weather source and keeps reference access separate for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "weather-tutor",
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
			const item = module.curriculum.find(i => i.id === fixture.itemId)!;
			expect(item.title).toBe("Materialize and D3 Interaction");
			expect(item.content).toContain("weather");
			expect(item.content).toContain("five");
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.courseId).toBe(
				fixture.courseId
			);
		}
	);
}
it("keeps starter work distinct from the five-case local reference and complete local assets", () => {
	expect(() =>
		javascriptCourseProjectKey(
			fixture.courseId,
			fixture.itemId,
			"starter",
			fixture.resources[1].urls[0]
		)
	).toThrow();
	expect(
		pythonIdeModeForCourseResource(
			"another-course",
			fixture.resources[0].urls[0]
		)
	).toBeNull();
	for (const role of ["starter", "reference"]) {
		const files = fixture.files[role];
		expect(files["index.html"]).not.toMatch(/(?:src|href)=["']https?:/);
		expect(files["script.js"]).not.toContain("https://");
		expect(files["vendor/d3.min.js"].slice(0, 100)).toContain("v7.9.0");
		for (const name of [
			"sunglasses",
			"umbrella",
			"boots",
			"jacket",
			"windbreaker"
		])
			expect(files["assets/" + name + ".svg"]).toContain("<svg");
	}
	expect(fixture.files.starter["script.js"]).not.toContain(
		'd3.select("#submit")'
	);
	expect(fixture.files.reference["script.js"]).toContain('input == "wind"');
	expect(fixture.files.reference["script.js"]).toContain(
		'.property("hidden", true)'
	);
});
