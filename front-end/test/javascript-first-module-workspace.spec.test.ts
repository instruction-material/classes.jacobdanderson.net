import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { javascriptCourseProjectKey, javascriptCourseResource } from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import { clearLocalPythonProjects, createPythonIdeProject, loadLocalPythonProjects, loadPythonIdeStarterFilesFromGitHub, pythonIdeModeForCourseResource, saveLocalPythonProjects } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-first-module-sources.json"), "utf8"));
const originals = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-first-module-originals.json"), "utf8"));
const root = resolve("public/course-assets/javascript-level-1");
const prefix = "/course-assets/javascript-level-1/";
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const marker = /\/\/\s*DO NOT ALTER[^\n]*/;

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

for (const resource of fixture.resources) {
	it(`imports and preserves the assigned ${resource.project} ${resource.role} files`, async () => {
		vi.stubGlobal("crypto", webcrypto);
		const requests: string[] = [];
		vi.stubGlobal("fetch", vi.fn(async (value: string, options: RequestInit) => {
			expect(value.startsWith(prefix)).toBe(true);
			expect(options).toMatchObject({ credentials: "omit", redirect: "error" });
			requests.push(value);
			return new Response(readFileSync(resolve(root, value.slice(prefix.length))));
		}));
		const url = resource.urls[0];
		expect(javascriptCourseResource(url)).toMatchObject({ project: resource.project, role: resource.role, version: resource.version });
		expect(pythonIdeModeForCourseResource(fixture.courseId, url)).toBe("web");
		expect(requests).toHaveLength(0);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
		expect(files).toHaveLength(resource.files.length);
		expect(requests).toHaveLength(resource.files.length);
		for (const file of files) {
			const expected = resource.files.find((row: { name: string }) => row.name === file.name);
			expect(expected).toBeDefined();
			expect(file.content).toBe(readFileSync(resolve(root, expected.path), "utf8"));
			expect(digest(file.content)).toBe(expected.sha256);
		}
		const original = originals.resources.find((row: { url: string }) => row.url === url);
		expect(digest(original.panels.JavaScript)).toBe(resource.originalSourceSHA256);
		const source = files.find(file => file.name === "script.js")!.content;
		if (resource.role === "starter") {
			const found = marker.exec(original.panels.JavaScript);
			if (found) {
				expect(source.slice(0, marker.exec(source)!.index)).toBe(original.panels.JavaScript.slice(0, found.index));
			} else {
				expect(source).toBe(original.panels.JavaScript);
			}
		}
		const key = javascriptCourseProjectKey(fixture.courseId, resource.itemId, resource.role, url);
		for (const alias of resource.urls) {
			expect(javascriptCourseProjectKey(fixture.courseId, resource.itemId, resource.role, alias)).toBe(key);
		}
		const project = createPythonIdeProject("web", { files, courseID: fixture.courseId, starterUrl: url, courseProjectKey: key });
		project.files.find(file => file.name === "script.js")!.content += "\n// Saved exercise trace\n";
		project.activeFileName = "script.js";
		await saveLocalPythonProjects([project]);
		const reopened = (await loadLocalPythonProjects()).find(row => row._id === project._id)!;
		expect(reopened).toEqual(project);
		const archive = unzipSync(await createProjectArchive(reopened));
		expect(Object.keys(archive)).toHaveLength(resource.files.length);
		for (const file of reopened.files) {
			const path = Object.keys(archive).find(path => path.endsWith(`/${file.name}`))!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	});
}

for (const role of ["learner", "instructor"] as const) {
	it(`retains every first-module assignment and role boundary for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({ _id: "javascript-course-tutor", name: "Tutor", email: "tutor@example.invalid", age: 30, state: "GA", usersOfTutorLength: 0, coursePermissions: [fixture.courseId], editTutors: false, saveEdit: "Save" });
		}
		const course = (await useCoursesStore().loadCourseById(fixture.courseId))!;
		const module = course.modules.find(module => module.id === fixture.moduleId)!;
		for (const resource of fixture.resources) {
			const items = resource.section === "core" ? module.curriculum : module.supplementalProjects;
			const item = items.find(item => item.id === resource.itemId)!;
			expect(item, resource.assignmentTitle).toBeDefined();
			expect(item.title).toBe(resource.assignmentTitle);
			if (resource.role === "starter") expect(item.projectLink).toBe(resource.urls[0]);
			else if (role === "instructor") expect(item.solutionLink).toBe(resource.urls[0]);
			else expect(item.solutionLink).toBeUndefined();
		}
		const types = module.curriculum.find(item => item.title === "Variables and Data Types")!;
		expect(types.content).toContain("primitive value");
		expect(types.content).toContain("value === null");
		expect(types.content).toContain("1 + 1");
	});
}
