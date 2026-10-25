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

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-more-html-css-sources.json"), "utf8"));
const originals = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-more-html-css-originals.json"), "utf8"));
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

		if (original) {
 for (const [panel, key] of [["HTML", "html"], ["CSS", "css"], ["JavaScript", "javascript"]] as const) expect(sha(original.panels[panel])).toBe(resource.originalSourceHashes[key]);
 } else { expect(resource.independentlyAuthoredStarter).toBe(true); expect(resource.project).toBe("box-inception-part-2"); expect(resource.role).toBe("starter"); }
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
			useAppStore().setCurrentTutor({ _id: "MoreHTMLCSS-course-tutor", name: "Tutor", email: "tutor@example.invalid", age: 30, state: "GA", usersOfTutorLength: 0, coursePermissions: [fixture.courseId], editTutors: false, saveEdit: "Save" });
		}
		const course = (await useCoursesStore().loadCourseById(fixture.courseId))!;
		const module = course.modules.find(module => module.id === fixture.moduleId)!;
		expect(module).toBeDefined();
		for (const resource of fixture.resources) {
			const items = resource.section === "core" ? module.curriculum : module.supplementalProjects;
			const item = items.find(item => item.id === resource.itemId)!;
			expect(item, resource.assignmentTitle).toBeDefined();
			expect(item.title).toBe(resource.assignmentTitle);
 const essential: Record<string, string> = { "box-inception-part-2": "110px", "my-hero-page": "Noto Sans", "my-javascript-art": "matchMedia", "berkshire-hathaway": "border-spacing" };
 expect(item.content).toContain(essential[resource.project]);
			if (resource.role === "starter") expect(item.projectLink).toBe(resource.urls[0]);
			else if (role === "instructor") expect(item.solutionLink).toBe(resource.urls[0]);
			else expect(item.solutionLink).toBeUndefined();
		}
	});
}


it("accepts only the explicitly bundled local starter path", () => {
 const local = fixture.resources.find((row: { independentlyAuthoredStarter: boolean }) => row.independentlyAuthoredStarter);
 expect(javascriptCourseResource(local.urls[0])).toMatchObject({project: "box-inception-part-2", role: "starter"});
 for (const value of [local.urls[0] + "?extra=1", local.urls[0].replace("/starter/", "/../starter/"), "/course-assets/javascript-level-1/unknown.txt", "//example.com" + local.urls[0]]) expect(javascriptCourseResource(value)).toBeNull();
 expect(pythonIdeModeForCourseResource("a-different-course", local.urls[0])).toBeNull();
});

it("retains the positioning lesson identity and restores the original core project", async () => {
 setActivePinia(createPinia());
 const course = (await useCoursesStore().loadCourseById(fixture.courseId))!;
 const module = course.modules.find(module => module.id === fixture.moduleId)!;
 const project = module.curriculum.find(item => item.id.endsWith("-the-position-property"))!;
 expect(project.title).toBe("JSS11 Project 1: Box Inception Part II");
 expect(project.aliases).toContain(`${fixture.moduleId}-curriculum-jss11-project-1-box-inception-part-ii`);
 expect(project.content).toContain("110px");
 expect(module.supplementalProjects.some(item => item.title.includes("Berkshire Hathaway"))).toBe(true);
});
