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
		resolve("../test/fixtures/javascript-css-practice-sources.json"),
		"utf8"
	)
);
const root = resolve("public/course-assets/javascript-level-1");
const prefix = "/course-assets/javascript-level-1/";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(`imports, saves and exports the authored ${resource.project} ${resource.role}`, async () => {
		vi.stubGlobal("crypto", webcrypto);
		const requested: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (value: string, options: RequestInit) => {
				expect(value.startsWith(prefix)).toBe(true);
				expect(options).toMatchObject({
					credentials: "omit",
					redirect: "error"
				});
				requested.push(value);
				return new Response(
					readFileSync(resolve(root, value.slice(prefix.length)))
				);
			})
		);
		const url = resource.urls[0];
		expect(javascriptCourseResource(url)).toMatchObject({
			project: resource.project,
			role: resource.role
		});
		expect(pythonIdeModeForCourseResource(fixture.courseId, url)).toBe(
			"web"
		);
		expect(requested).toHaveLength(0);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
		expect(files).toHaveLength(resource.files.length);
		expect(requested).toHaveLength(resource.files.length);
		for (const file of files) {
			const declared = resource.files.find(
				(row: { name: string }) => row.name === file.name
			);
			expect(file.content).toBe(
				readFileSync(resolve(root, declared.path), "utf8")
			);
			expect(sha(file.content)).toBe(declared.sha256);
		}
		const key = javascriptCourseProjectKey(
			fixture.courseId,
			resource.itemId,
			resource.role,
			url
		);
		for (const alias of resource.urls)
			expect(
				javascriptCourseProjectKey(
					fixture.courseId,
					resource.itemId,
					resource.role,
					alias
				)
			).toBe(key);
		const earlier = createPythonIdeProject("web", {
			files: [
				{
					name: "index.html",
					content: "// Earlier HTML/CSS work\n",
					encoding: "text"
				}
			],
			courseID: fixture.courseId,
			courseProjectKey: `${key}:earlier`
		});
		const project = createPythonIdeProject("web", {
			files,
			courseID: fixture.courseId,
			courseProjectKey: key,
			starterUrl: url
		});
		project.files.find(file => file.name === "index.html")!.content +=
			"\n<!-- Saved markup change -->\n";
		await saveLocalPythonProjects([earlier, project]);
		const saved = await loadLocalPythonProjects();
		expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
		const reopened = saved.find(row => row._id === project._id)!;
		expect(reopened).toEqual(project);
		const archive = unzipSync(await createProjectArchive(reopened));
		expect(Object.keys(archive)).toHaveLength(resource.files.length);
		for (const file of reopened.files) {
			const path = Object.keys(archive).find(path =>
				path.endsWith(`/${file.name}`)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	});
}

for (const role of ["learner", "instructor"] as const) {
	it(`keeps the HTML/CSS assignments and reference boundaries for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "css-practice-course-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [fixture.courseId],
				editTutors: false,
				saveEdit: "Save"
			});
		}
		const course = (await useCoursesStore().loadCourseById(
			fixture.courseId
		))!;
		const module = course.modules.find(
			module => module.id === fixture.moduleId
		)!;
		expect(module).toBeDefined();
		for (const resource of fixture.resources) {
			const items = module.supplementalProjects;
			const item = items.find(item => item.id === resource.itemId)!;
			expect(
				items.map(row => ({ id: row.id, title: row.title }))
			).toContainEqual(
				expect.objectContaining({
					id: resource.itemId,
					title: resource.assignmentTitle
				})
			);
			expect(item, resource.assignmentTitle).toBeDefined();
			expect(item.title).toBe(resource.assignmentTitle);
			if (resource.role === "starter")
				expect(item.projectLink).toBe(resource.urls[0]);
			else if (role === "instructor")
				expect(item.solutionLink).toBe(resource.urls[0]);
			else expect(item.solutionLink).toBeUndefined();
		}
	});
}

it("keeps role attempts separate and preserves the optional games", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(fixture.courseId))!;
	const module = course.modules.find(
		module => module.id === fixture.moduleId
	)!;
	for (const starter of fixture.resources.filter(
		(row: { role: string }) => row.role === "starter"
	)) {
		const reference = fixture.resources.find(
			(row: { project: string; role: string }) =>
				row.project === starter.project && row.role === "reference"
		);
		expect(
			javascriptCourseProjectKey(
				fixture.courseId,
				starter.itemId,
				"starter",
				starter.urls[0]
			)
		).not.toBe(
			javascriptCourseProjectKey(
				fixture.courseId,
				reference.itemId,
				"reference",
				reference.urls[0]
			)
		);
		const item = module.supplementalProjects.find(
			item => item.id === starter.itemId
		)!;
		expect(item.content).toContain(starter.optionalGame);
		expect(item.ideImport).toBe(true);
		expect(() =>
			javascriptCourseProjectKey(
				fixture.courseId,
				starter.itemId,
				"reference",
				starter.urls[0]
			)
		).toThrow();
	}
});

it("supplies complete local markup and leaves the starter CSS unfinished", () => {
	for (const resource of fixture.resources) {
		const text = (name: string) =>
			readFileSync(
				resolve(
					root,
					resource.files.find(
						(file: { name: string }) => file.name === name
					).path
				),
				"utf8"
			);
		const doc = new DOMParser().parseFromString(
			text("index.html"),
			"text/html"
		);
		expect(
			doc.querySelector('link[rel="stylesheet"]')?.getAttribute("href")
		).toBe("styles.css");
		expect(doc.querySelectorAll("script")).toHaveLength(0);
		if (resource.project === "css-practice-selectors") {
			for (const [selector, expected] of [
				[".menu > p", ["Soup", "Salad"]],
				[".menu p.special", ["Soup", "Pie"]],
				["#lunch + p", ["After"]]
			] as const) {
				expect(
					[...doc.querySelectorAll(selector)].map(
						node => node.textContent
					)
				).toEqual(expected);
			}
		} else
			expect(
				[...doc.querySelectorAll(".cards > .card")].map(
					node => node.textContent
				)
			).toEqual(["One", "Two", "Three"]);
		expect(text("README.md")).toContain("Save and reopen");
		expect(text("styles.css").includes("TODO:")).toBe(
			resource.role === "starter"
		);
	}
});
