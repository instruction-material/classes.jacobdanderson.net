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
import { webBuildInstructions } from "@/modules/webBuildInstructions";
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
		resolve("../test/fixtures/javascript-master-project-sources.json"),
		"utf8"
	)
);
const originals = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-master-project-originals.json"),
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
	it(`imports, exports and preserves saved work for the assigned ${resource.project} ${resource.role}`, async () => {
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
		const original = originals.resources.find(
			(row: { url: string }) => row.url === url
		);

		expect(original).toBeDefined();
		for (const [panel, key] of [
			["HTML", "html"],
			["CSS", "css"],
			["JavaScript", "javascript"]
		] as const) {
			expect(sha(original.panels[panel])).toBe(
				resource.originalSourceHashes[key]
			);
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
					content: "// Earlier layout work\n",
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
		let reopened = project;
		await saveLocalPythonProjects([earlier, project]);
		const saved = await loadLocalPythonProjects();
		expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
		reopened = saved.find(row => row._id === project._id)!;
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
	it(`keeps the Master Project assignments and reference boundaries for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "MasterProject-course-tutor",
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
			const items =
				resource.section === "core"
					? module.curriculum
					: module.supplementalProjects;
			const item = items.find(item => item.id === resource.itemId)!;
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

it("keeps the original blank starter, exact D3 version and complete run instructions", () => {
	const starter = fixture.resources.find(
		(r: { role: string }) => r.role === "starter"
	);
	const reference = fixture.resources.find(
		(r: { role: string }) => r.role === "reference"
	);
	const read = (r: typeof starter, name: string) =>
		readFileSync(
			resolve(
				root,
				r.files.find((f: { name: string }) => f.name === name).path
			),
			"utf8"
		);
	const page = new DOMParser().parseFromString(
		read(starter, "index.html"),
		"text/html"
	);
	expect(page.querySelector("main")!.textContent?.trim()).toBe("");
	expect(read(starter, "index.html")).toContain(
		originals.resources
			.find((r: { role: string }) => r.role === "starter")
			.panels.HTML.trim()
	);
	expect(read(starter, "vendor/d3.min.js").slice(0, 100)).toContain("v6.1.1");
	expect(read(reference, "index.html")).not.toMatch(
		/hello@learnwithjuni|over 200 instructors|top-tier American/
	);
	const completed = new DOMParser().parseFromString(
		read(reference, "index.html"),
		"text/html"
	);
	expect(completed.querySelectorAll(".program")).toHaveLength(3);
	expect(completed.querySelectorAll(".collapsible-header")).toHaveLength(3);
	expect(completed.querySelectorAll("nav .sidenav")).toHaveLength(0);
	expect(
		completed.querySelectorAll(".sidenav-overlay,.drag-target")
	).toHaveLength(0);
	for (const role of fixture.resources) {
		const instructions = webBuildInstructions(role.urls[0]).join("\n");
		expect(instructions).toContain("Open index.html");
		expect(instructions).toContain("without a server");
		expect(
			role.files.some(
				(f: { name: string }) => f.name === "LICENSE-d3.txt"
			)
		).toBe(true);
		expect(read(role, "README.md")).toContain(
			"optional supplemental projects"
		);
	}
});
