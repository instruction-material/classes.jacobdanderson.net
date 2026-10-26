import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { javascriptCourseProjectKey, javascriptCourseResource } from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import { clearLocalPythonProjects, createPythonIdeProject, loadLocalPythonProjects, loadPythonIdeStarterFilesFromGitHub, pythonIdeModeForCourseResource, saveLocalPythonProjects } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-nested-loops-sources.json"), "utf8"));
const originals = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-nested-loops-originals.json"), "utf8"));
const root = resolve("public/course-assets/javascript-level-1");
const prefix = "/course-assets/javascript-level-1/";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(`imports, saves and exports the assigned ${resource.project} ${resource.role}`, async () => {
		vi.stubGlobal("crypto", webcrypto);
		const requested: string[] = [];
		vi.stubGlobal("fetch", vi.fn(async (value: string, options: RequestInit) => {
			expect(value.startsWith(prefix)).toBe(true);
			expect(options).toMatchObject({ credentials: "omit", redirect: "error" });
			requested.push(value);
			return new Response(readFileSync(resolve(root, value.slice(prefix.length))));
		}));
		const url = resource.urls[0];
		expect(javascriptCourseResource(url)).toMatchObject({ project: resource.project, role: resource.role });
		expect(pythonIdeModeForCourseResource(fixture.courseId, url)).toBe("web");
		expect(requested).toHaveLength(0);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
		expect(files).toHaveLength(resource.files.length);
		expect(requested).toHaveLength(resource.files.length);
		for (const file of files) {
			const declared = resource.files.find((row: { name: string }) => row.name === file.name);
			expect(file.content).toBe(readFileSync(resolve(root, declared.path), "utf8"));
			expect(sha(file.content)).toBe(declared.sha256);
		}
		const original = originals.resources.find((row: { url: string }) => row.url === url);
		expect(sha(original.panels.JavaScript)).toBe(resource.originalSourceSHA256);
		const script = files.find(file => file.name === "script.js")!.content;
		expect(sha(script)).toBe(resource.expectedScriptSHA256);
		const key = javascriptCourseProjectKey(fixture.courseId, resource.itemId, resource.role, url);
		for (const alias of resource.urls) expect(javascriptCourseProjectKey(fixture.courseId, resource.itemId, resource.role, alias)).toBe(key);
		const earlier = createPythonIdeProject("web", { files: [{ name: "script.js", content: "// Earlier nested-loop work\n", encoding: "text" }], courseID: fixture.courseId, courseProjectKey: `${key}:earlier` });
		const project = createPythonIdeProject("web", { files, courseID: fixture.courseId, courseProjectKey: key, starterUrl: url });
		project.files.find(file => file.name === "script.js")!.content += "\n// Saved loop change\n";
		await saveLocalPythonProjects([earlier, project]);
		const saved = await loadLocalPythonProjects();
		expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
		const reopened = saved.find(row => row._id === project._id)!;
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
	it(`keeps the nested-loop assignments and reference boundaries for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({ _id: "nested-loops-course-tutor", name: "Tutor", email: "tutor@example.invalid", age: 30, state: "GA", usersOfTutorLength: 0, coursePermissions: [fixture.courseId], editTutors: false, saveEdit: "Save" });
		}
		const course = (await useCoursesStore().loadCourseById(fixture.courseId))!;
		const module = course.modules.find(module => module.id === fixture.moduleId)!;
		expect(module).toBeDefined();
		for (const resource of fixture.resources) {
			const items = resource.section === "core" ? module.curriculum : module.supplementalProjects;
			const item = items.find(item => item.id === resource.itemId)!;
			expect(item, resource.assignmentTitle).toBeDefined();
			expect(item.title).toBe(resource.assignmentTitle);
			if (resource.role === "starter") expect(item.projectLink).toBe(resource.urls[0]);
			else if (role === "instructor") expect(item.solutionLink).toBe(resource.urls[0]);
			else expect(item.solutionLink).toBeUndefined();
		}
	});
}

function execute(project: string, role = "reference", original = false, random = 0.5, suffix = "") {
	const resource = fixture.resources.find((row: { project: string; role: string }) => row.project === project && row.role === role);
	const script = original
		? originals.resources.find((row: { project: string; role: string }) => row.project === project && row.role === role).panels.JavaScript.split("// DO NOT ALTER")[0]
		: readFileSync(resolve(root, resource.files.find((file: { name: string }) => file.name === "script.js").path), "utf8").split("// Provided output helper.")[0];
	const output: string[] = [];
	const math = Object.create(Math);
	math.random = () => random;
	const d3 = readFileSync(resolve(root, "first-module-shared-v1/vendor/d3.min.js.txt"), "utf8");
	const context = { document, Math: math, printToScreen: (value: unknown) => output.push(String(value)), degreesToRadians: (value: number) => value * Math.PI / 180 };
	runInNewContext(`${d3}\n${script}\n${suffix}`, context, { timeout: 1000 });
	return output;
}

it("preserves every multiplication product and every hollow box row from the originals", () => {
	const table = execute("multiplication-tables");
	expect(table).toEqual(execute("multiplication-tables", "reference", true).map(row => row.trim().replace(/\s+/gu, " ")));
	expect(table.map(row => row.trim().split(/\s+/u).map(Number))).toEqual(Array.from({ length: 10 }, (_, row) => Array.from({ length: 10 }, (_, col) => (row + 1) * (col + 1))));
	const boxes = execute("tower-of-boxes");
	expect(boxes).toEqual(execute("tower-of-boxes", "reference", true));
	expect(boxes).toEqual(["###", "#_#", "###", "", "####", "#__#", "#__#", "####", "", "#####", "#___#", "#___#", "#___#", "#####", "", "######", "#____#", "#____#", "#____#", "#____#", "######", ""]);
});

it("removes only the unintended empty pattern row and retains all 15 Pac-Man arcs", () => {
	const originalOutput = execute("pattern-production", "reference", true);
	const originalPaths = [...document.querySelectorAll("path")].map(node => [node.getAttribute("d"), node.getAttribute("transform"), node.getAttribute("fill")]);
	document.body.replaceChildren();
	expect(execute("pattern-production")).toEqual(["*", "**", "***", "****", "*****"]);
	expect(originalOutput).toEqual(["", "*", "**", "***", "****", "*****"]);
	const paths = [...document.querySelectorAll("path")].map(node => [node.getAttribute("d"), node.getAttribute("transform"), node.getAttribute("fill")]);
	expect(paths).toHaveLength(15);
	expect(paths).toEqual(originalPaths);
	expect(document.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 800 850");
});

it("retains both Armstrong algorithms while printing each of the four matches once", () => {
	const expected = ["153", "370", "371", "407"];
	expect(execute("armstrong-numbers", "reference", true)).toEqual([...expected, ...expected]);
	expect(execute("armstrong-numbers")).toEqual(expected);
	expect(execute("armstrong-numbers", "reference", false, 0.5, "findByDigits();")).toEqual([...expected, ...expected]);
});

for (const [random, hit] of [[0, false], [1 / 3, true], [0.5, true], [2 / 3, false], [0.999999, false]] as const) {
	it(`retains the one-in-three archery rule at random value ${random}`, () => {
		const result = execute("archery-simulator", "reference", false, random);
		expect(result).toHaveLength(17);
		expect(result.slice(1, -1)).toEqual(Array.from({ length: 15 }, (_, i) => `Round ${Math.floor(i / 3) + 1}, arrow ${i % 3 + 1}: ${hit ? "X" : "O"}`));
		expect(result.at(-1)).toBe(`Total arrows hit: ${hit ? 15 : 0}`);
		expect(result).toEqual(execute("archery-simulator", "reference", true, random).map(line => line.replace("Arrrow", "arrow")));
	});
}

it("retains all original shield geometry and the starter's intentional loop failure", () => {
	expect(() => execute("shield-debugging", "starter", true)).toThrow(/j is not defined/u);
	document.body.replaceChildren();
	expect(() => execute("shield-debugging", "starter")).toThrow(/j is not defined/u);
	document.body.replaceChildren();
	execute("shield-debugging", "reference", true);
	const original = document.querySelector("svg")!.innerHTML;
	document.body.replaceChildren();
	execute("shield-debugging");
	expect(document.querySelector("svg")!.innerHTML).toBe(original);
	expect(document.querySelectorAll("circle")).toHaveLength(180);
	expect(document.querySelectorAll("path")).toHaveLength(45);
	expect(document.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 2000 2000");
});

for (const resource of fixture.resources) {
	it(`runs the offline renderer for ${resource.project} ${resource.role}`, () => {
		const code = readFileSync(resolve(root, resource.files.find((file: { name: string }) => file.name === "script.js").path), "utf8");
		const d3 = readFileSync(resolve(root, "first-module-shared-v1/vendor/d3.min.js.txt"), "utf8");
		const run = () => runInNewContext(`${d3}\n${code}`, { document, Math }, { timeout: 1000 });
		if (resource.intentionalRuntimeError) expect(run).toThrow(/j is not defined/u);
		else run();
		for (const pre of document.querySelectorAll("pre")) expect(pre.className).toBe("output-line");
		expect(code).not.toContain(".transition()");
		expect(code).not.toContain("Math.floor(Math.floor(Math.random()");
	});
}

it("provides an executable nested-loop lesson before the projects", async () => {
	const { javascriptLevel1Course } = await import("@/stores/courses/javascript-level-1");
	const lesson = javascriptLevel1Course.modules.find(module => module.title === "JSS8 Nested Loops")!.curriculum.find(item => item.title === "Nested Loops")!;
	const code = /```javascript\n([\s\S]*?)```/u.exec(lesson.content ?? "")?.[1];
	expect(code).toBeTruthy();
	const output: string[] = [];
	runInNewContext(code!, { printToScreen: (line: string) => output.push(line) }, { timeout: 1000 });
	expect(output).toEqual(["(1,1) (1,2) (1,3)", "(2,1) (2,2) (2,3)"]);
});
