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

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-html-css-sources.json"), "utf8"));
const originals = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-html-css-originals.json"), "utf8"));
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

		for (const [panel, key] of [["HTML", "html"], ["CSS", "css"], ["JavaScript", "javascript"]] as const) expect(sha(original.panels[panel])).toBe(resource.originalSourceHashes[key]);
		const key = javascriptCourseProjectKey(fixture.courseId, resource.itemId, resource.role, url);
		for (const alias of resource.urls) expect(javascriptCourseProjectKey(fixture.courseId, resource.itemId, resource.role, alias)).toBe(key);
		const earlier = createPythonIdeProject("web", { files: [{ name: "index.html", content: "// Earlier HTML/CSS work\n", encoding: "text" }], courseID: fixture.courseId, courseProjectKey: `${key}:earlier` });
		const project = createPythonIdeProject("web", { files, courseID: fixture.courseId, courseProjectKey: key, starterUrl: url });
		project.files.find(file => file.name === "index.html")!.content += "\n<!-- Saved markup change -->\n";
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
	it(`keeps the HTML/CSS assignments and reference boundaries for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({ _id: "HTML/CSSs-course-tutor", name: "Tutor", email: "tutor@example.invalid", age: 30, state: "GA", usersOfTutorLength: 0, coursePermissions: [fixture.courseId], editTutors: false, saveEdit: "Save" });
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

function parsed(resource: { files: { name: string; path: string }[] }) {
	const html = readFileSync(resolve(root, resource.files.find(file => file.name === "index.html")!.path), "utf8");
	return new DOMParser().parseFromString(html, "text/html");
}

it("preserves the original 24-box display and table structure", () => {
	const resource = fixture.resources.find((row: { project: string; role: string }) => row.project === "box-inception" && row.role === "reference");
	const original = originals.resources.find((row: { project: string; role: string }) => row.project === "box-inception" && row.role === "reference");
	const current = parsed(resource);
	const source = new DOMParser().parseFromString(original.panels.HTML, "text/html");
	const structure = (doc: Document) => [...doc.body.querySelectorAll("*")].map(node => [node.tagName, node.className, node.children.length]);
	expect(structure(current)).toEqual(structure(source));
	expect(current.querySelectorAll(".box-block")).toHaveLength(6);
	expect(current.querySelectorAll(".box-inline-block")).toHaveLength(18);
	expect(current.querySelectorAll("table tr")).toHaveLength(3);
	for (const row of current.querySelectorAll("table tr")) expect(row.querySelectorAll("td")).toHaveLength(2);
	const css = readFileSync(resolve(root, resource.files.find((file: { name: string }) => file.name === "styles.css").path), "utf8");
	expect(css.trim()).toBe(original.panels.CSS.trim());
});

it("repairs the original relative link and image alternative while preserving the name structures", () => {
	const resource = fixture.resources.find((row: { project: string; role: string }) => row.project === "html-css-basics" && row.role === "reference");
	const doc = parsed(resource);
	expect(doc.querySelectorAll("div")).toHaveLength(7);
	expect([...doc.querySelectorAll("span")].map(node => node.textContent)).toEqual(["Alan", "Turing"]);
	expect(doc.querySelectorAll("br")).toHaveLength(2);
	expect(doc.querySelector("a")!.getAttribute("href")).toBe("https://www.wikipedia.org/");
	expect(doc.querySelector("img")!.getAttribute("alt")).toBe("Blue mountains and a gold sun");
	expect(doc.querySelector("img")!.getAttribute("src")).toBe("landscape.svg");
	expect(doc.querySelector("meta[name='viewport']")).toBeTruthy();
});

for (const project of ["html-css-basics", "box-inception"]) {
	it(`retains an unfinished ${project} starter with a complete local brief`, () => {
		const resource = fixture.resources.find((row: { project: string; role: string }) => row.project === project && row.role === "starter");
		expect(parsed(resource).body.children).toHaveLength(0);
		const readme = readFileSync(resolve(root, resource.files.find((file: { name: string }) => file.name === "README.md").path), "utf8");
		if (project === "html-css-basics") {
			for (const step of Array.from({ length: 10 }, (_, index) => `${index + 1}. `)) expect(readme).toContain(step);
		}
		else {
			for (const heading of ["Block Display", "Inline Block Display", "Grid", "Table", "50 by 50", "three rows and two cells"]) expect(readme).toContain(heading);
		}
	});
}

it("keeps legacy lesson ids when naming the two original projects", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(fixture.courseId))!;
	const module = course.modules.find(module => module.id === fixture.moduleId)!;
	for (const resource of fixture.resources.filter((row: { role: string }) => row.role === "starter")) {
		const item = module.curriculum.find(item => item.id === resource.itemId)!;
		expect(item.title).toBe(resource.assignmentTitle);
		expect(item.aliases).toContain(`${fixture.moduleId}-curriculum-${resource.assignmentTitle.toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-")}`);
	}
});
