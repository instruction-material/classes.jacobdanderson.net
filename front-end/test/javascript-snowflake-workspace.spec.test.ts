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
		resolve("../test/fixtures/javascript-snowflake-sources.json"),
		"utf8"
	)
);
const originals = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-snowflake-originals.json"),
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

		if (original) {
			for (const [panel, key] of [
				["HTML", "html"],
				["CSS", "css"],
				["JavaScript", "javascript"]
			] as const)
				expect(sha(original.panels[panel])).toBe(
					resource.originalSourceHashes[key]
				);
		} else {
			expect(resource.independentlyAuthoredStarter).toBe(true);
			expect(resource.project).toBe("my-javascript-art-part-3");
			expect(resource.role).toBe("starter");
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
		if (resource.project === "art-gallery") {
			// Real-browser acceptance covers IndexedDB; the legacy mirror has a 5 MB quota.
			await saveLocalPythonProjects([earlier]);
			expect(() => saveLocalPythonProjects([earlier, project])).toThrow();
			expect(loadLocalPythonProjects()).toEqual([earlier]);
		} else {
			await saveLocalPythonProjects([earlier, project]);
			const saved = await loadLocalPythonProjects();
			expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
			reopened = saved.find(row => row._id === project._id)!;
			expect(reopened).toEqual(project);
		}
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
	it(`keeps the snowflake pattern assignments and reference boundaries for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "Snowflake-course-tutor",
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
			expect(item.aliases).toContain("check-in-2-additional-practice-project");
			for (const row of fixture.targetRows) expect(item.content).toContain(row);
			expect(item.content).toContain("64 tiles");
			expect(item.content).toContain("34 snowflake icons");
			expect(item.content).not.toMatch(/D3 shapes|animate at least/);
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

it("preserves every occupied cell of the original reference", () => {
 const original = originals.resources.find((row: {role:string}) => row.role === "reference");
 const reference = fixture.resources.find((row: {role:string}) => row.role === "reference");
 const parse = (html:string) => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return [...template.content.querySelectorAll(".tile")].map(tile => tile.textContent!.trim() === "ac_unit");
 };
 const index = reference.files.find((row: {name:string}) => row.name === "index.html");
 const adapted = readFileSync(resolve(root,index.path),"utf8");
 expect(parse(adapted)).toEqual(parse(original.panels.HTML));
 expect(parse(adapted)).toHaveLength(64);
 expect(parse(adapted).filter(Boolean)).toHaveLength(34);
 expect(adapted).not.toMatch(/(?:src|href)="https?:/);
});

it("keeps the newly recovered starter and reference in their assigned roles", () => {
 const starter=fixture.resources.find((row: {role:string}) => row.role === "starter");
 const reference=fixture.resources.find((row: {role:string}) => row.role === "reference");
 expect(()=>javascriptCourseProjectKey(fixture.courseId,starter.itemId,"starter",reference.urls[0])).toThrow();
 expect(()=>javascriptCourseProjectKey(fixture.courseId,reference.itemId,"reference",starter.urls[0])).toThrow();
 expect(pythonIdeModeForCourseResource("a-different-course",starter.urls[0])).toBeNull();
});
