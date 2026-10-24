import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import {
	javascriptCourseProjectKey,
	javascriptCourseResource,
	loadJavaScriptCourseFiles
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
import { webBuildInstructions } from "@/modules/webBuildInstructions";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-welcome-survey-source.json"), "utf8"));
const original = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-welcome-survey-original-source.json"), "utf8"));
const root = resolve("public/course-assets/javascript-level-1");
const courseId = "javascript-level-1-javascript-superstar";
const roleCases = ["starter", "reference"] as const;

function stubFiles(change?: (path: string, bytes: Uint8Array) => Uint8Array) {
	vi.stubGlobal("crypto", webcrypto);
	const fetcher = vi.fn(async (input: string | URL, _options?: RequestInit) => {
		const path = String(input);
		expect(path.startsWith("/course-assets/javascript-level-1/")).toBe(true);
		const file = path.split("/course-assets/javascript-level-1/")[1];
		const bytes = Uint8Array.from(readFileSync(resolve(root, file)));
		return new Response(change ? change(file, bytes) : bytes);
	});
	vi.stubGlobal("fetch", fetcher);
	return fetcher;
}

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

it.each(roleCases)("imports, edits, reopens and exports complete %s source", async (role) => {
	const fetcher = stubFiles();
	const url = fixture.sourceURL[role];
	expect(pythonIdeModeForCourseResource(courseId, url)).toBe("web");
	expect(javascriptCourseResource(url)?.role).toBe(role);
	expect(fetcher).not.toHaveBeenCalled();
	const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
	expect(files).toHaveLength(6);
	expect(fetcher).toHaveBeenCalledTimes(6);
	for (const file of files) {
		const expected = fixture.files[role].find((row: { name: string }) => row.name === file.name);
		expect(file.content).toBe(readFileSync(resolve(root, expected.path), "utf8"));
		expect(createHash("sha256").update(file.content).digest("hex")).toBe(expected.sha256);
	}
	for (const [input, options] of fetcher.mock.calls) {
		expect(input).not.toContain(role === "starter" ? "/reference/" : "/starter/");
		expect(options).toMatchObject({ credentials: "omit", redirect: "error" });
	}
	const prior = createPythonIdeProject("web", {
		title: "Welcome Survey v1",
		courseID: courseId,
		starterUrl: url,
		courseProjectKey: `${courseId}:${fixture.itemId}:${role}:welcome-survey:v1`,
		files: [{ name: "script.js", content: "// Earlier saved v1 work\n", encoding: "text" }]
	});
	const original = structuredClone(prior);
	const project = createPythonIdeProject("web", {
		files,
		courseID: courseId,
		courseProjectKey: javascriptCourseProjectKey(courseId, fixture.itemId, role, url),
		starterUrl: url
	});
	expect(project.courseProjectKey).not.toBe(prior.courseProjectKey);
	project.files.find(file => file.name === "script.js")!.content += "\n// Saved observation\n";
	project.files.push({ name: "notes.md", content: "Saved trace", encoding: "text" });
	project.activeFileName = "script.js";
	await saveLocalPythonProjects([prior, project]);
	const reopened = await loadLocalPythonProjects();
	expect(reopened.find(row => row._id === prior._id)).toEqual(original);
	const saved = reopened.find(row => row._id === project._id)!;
	expect(saved).toEqual(project);
	const archive = unzipSync(await createProjectArchive(saved));
	expect(Object.keys(archive)).toHaveLength(7);
	for (const file of saved.files) {
		const path = Object.keys(archive).find(path => path.endsWith(`/${file.name}`))!;
		expect(strFromU8(archive[path])).toBe(file.content);
	}
	expect(webBuildInstructions(url).join("\n")).toContain("without a server");
	expect(webBuildInstructions(url).join("\n")).toContain("vendor/d3.min.js");
});

it("keeps the published learner assignment and its unfinished starter", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(courseId))!;
	const item = course.modules.flatMap(module => module.curriculum).find(item => item.projectLink === fixture.sourceURL.starter)!;
	expect(item.id).toBe(`${courseId}-jss1-variables-and-data-types-curriculum-jss1-project-1-welcome-survey`);
	expect(item.solutionLink).toBeUndefined();
	const starter = readFileSync(resolve(root, fixture.files.starter.find((file: { name: string }) => file.name === "script.js").path), "utf8");
	const source = original.roles.find((row: { role: string }) => row.role === "starter").panels.JavaScript;
	expect(createHash("sha256").update(source).digest("hex")).toBe(fixture.sourcePanelHashes.starter);
	const marker = "// DO NOT ALTER CODE WRITTEN BELOW";
	expect(starter.split(marker)[0]).toBe(source.split(marker)[0]);
	expect(starter).toContain("// Enter your code below this line");
	expect(starter).not.toContain("let firstName = prompt");
});

it("uses the same reference key for its original and current shared URL", () => {
	const original = fixture.sourceURL.reference;
	const current = "https://codepen.io/junilearning/pen/pojNPeO/1efb04d2b3e13694f1bf614fef02c22c?editors=1111";
	expect(javascriptCourseProjectKey(courseId, "same-item", "reference", current)).toBe(javascriptCourseProjectKey(courseId, "same-item", "reference", original));
	expect(pythonIdeModeForCourseResource("javascript-level-2-javascript-master", original)).toBeNull();
	expect(() => javascriptCourseProjectKey(courseId, "same-item", "starter", original)).toThrow(/course role/);
});

it.each([
	"https://codepen.io/junilearning/pen/unknown",
	"http://codepen.io/junilearning/pen/OJMxyqw",
	"https://user:secret@codepen.io/junilearning/pen/OJMxyqw",
	"https://learner@codepen.io/junilearning/pen/OJMxyqw",
	"https://:example@codepen.io/junilearning/pen/OJMxyqw",
	"https://codepen.io.evil.invalid/junilearning/pen/OJMxyqw",
	"https://codepen.io:444/junilearning/pen/OJMxyqw"
])("refuses unregistered source without a request: %s", async (url) => {
	const fetcher = stubFiles();
	expect(javascriptCourseResource(url)).toBeNull();
	expect(await loadJavaScriptCourseFiles(url)).toBeNull();
	expect(fetcher).not.toHaveBeenCalled();
});

it.each(["truncated", "oversized", "changed"])("refuses %s source rather than importing a partial project", async (kind) => {
	stubFiles((path, bytes) => {
		if (!path.endsWith("/starter/script.js.txt")) return bytes;
		if (kind === "truncated") return bytes.slice(0, -1);
		if (kind === "oversized") return new Uint8Array(bytes.length + 1);
		bytes[0] ^= 1;
		return bytes;
	});
	await expect(loadJavaScriptCourseFiles(fixture.sourceURL.starter)).rejects.toThrow(/incomplete|too large|selected version/);
});
