import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
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
		resolve(
			"../test/fixtures/javascript-master-checkpoint-two-sources.json"
		),
		"utf8"
	)
);
const projectFixture = fixture;
const prefix = "/course-assets/javascript-level-2/";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(
		"imports complete original-aligned checkpoint two " +
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
			expect(files).toHaveLength(resource.files.length);
			for (const file of files) {
				const expected = resource.files.find(
					(f: { name: string }) => f.name === file.name
				);
				expect(file.content).toBe(
					fixture.files[resource.project][resource.role][file.name]
				);
				expect(sha(file.content)).toBe(expected.sha256);
			}
			const key = javascriptCourseProjectKey(
				fixture.courseId,
				resource.itemId,
				resource.role,
				resource.urls[0]
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
				courseID: fixture.courseId,
				courseProjectKey: key + ":earlier",
				files: [
					{
						name: "index.html",
						content: "Earlier square planning",
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
				"\nObserved the original-aligned workflow.\n";
			await saveLocalPythonProjects([earlier, project]);
			const saved = await loadLocalPythonProjects();
			expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
			const reopened = saved.find(row => row._id === project._id)!;
			expect(reopened).toEqual(project);
			const archive = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(archive)).toHaveLength(resource.files.length);
			for (const file of reopened.files) {
				const name = Object.keys(archive).find(n =>
					n.endsWith("/" + file.name)
				)!;
				expect(strFromU8(archive[name])).toBe(file.content);
			}
		}
	);
}

for (const project of projectFixture.projects) {
	for (const role of ["learner", "instructor"] as const) {
		it(
			"preserves " +
				project.project +
				" published identity and role boundary for " +
				role,
			async () => {
				setActivePinia(createPinia());
				if (role === "instructor")
					useAppStore().setCurrentTutor({
						_id: "checkpoint-tutor",
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
				const module = course.modules.find(
					m => m.id === project.moduleId
				)!;
				const item = module.curriculum.find(
					i => i.id === project.itemId
				)!;
				expect(item).toBeDefined();
				const starter = fixture.resources.find(
					r => r.project === project.project && r.role === "starter"
				);
				const reference = fixture.resources.find(
					r => r.project === project.project && r.role === "reference"
				);
				expect(item.projectLink).toBe(starter.urls[0]);
				if (role === "instructor")
					expect(reference.urls).toContain(item.solutionLink);
				else expect(item.solutionLink).toBeUndefined();
				expect(
					javascriptCourseResource(item.projectLink!)?.project
				).toBe(project.project);
				expect(item.contentKind).toBe("assignment");
				expect(item.content).toContain(
					project.project === "master-checkpoint-two-moves"
						? "countTypes"
						: "sumEvens"
				);
			}
		);
	}
}

it("retains complete authored tasks and shared saved identity across API and database continuations", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(fixture.courseId))!;
	const module = course.modules.find(m => m.id === fixture.moduleId)!;
	const overview = module.curriculum.find(
		i =>
			i.id ===
			fixture.moduleId +
				"-curriculum-" +
				fixture.courseId +
				"-check-in-2-overview"
	)!;
	expect(overview).toBeDefined();
	expect(overview.content).toContain(
		"Events, requests, and data checkpoint after JSM7"
	);
	for (const [id, content] of Object.entries(fixture.assignmentTexts)) {
		const item = module.curriculum.find(i => i.id === id)!;
		expect(item, id).toBeDefined();
		expect(item.content).toContain((content as string).trim());
		expect(item.contentKind).toBe("assignment");
	}
	const project = fixture.projects[0];
	for (const resource of fixture.resources.filter(
		r => r.project === project.project
	)) {
		const key = javascriptCourseProjectKey(
			fixture.courseId,
			project.itemId,
			resource.role,
			resource.urls[1]
		);
		for (const id of project.continuationIds) {
			const item = module.curriculum.find(i => i.id === id)!;
			expect(item.projectLink).toBeDefined();
			expect(
				javascriptCourseProjectKey(
					fixture.courseId,
					id,
					resource.role,
					resource.urls[1]
				)
			).toBe(key);
		}
	}
});

for (const project of fixture.projects) {
	it(
		"renders the actual " +
			project.project +
			" controller, with no automatic requests and preserved output after failed refresh",
		async () => {
			const files = fixture.files[project.project].reference;
			const dom = new JSDOM(files["index.html"], {
				runScripts: "outside-only",
				pretendToBeVisual: true
			});
			try {
				const w = dom.window as any;
				w.HTMLCanvasElement.prototype.getContext = () => null;
				const fetcher = vi.fn(async () => {
					throw new Error("Offline example");
				});
				w.fetch = fetcher;
				const scripts =
					project.project === "master-checkpoint-two"
						? ["remote.js", "fixture.js", "helpers.js", "script.js"]
						: [
								"remote.js",
								"fixture.js",
								"data.js",
								"moves.js",
								"script.js"
							];
				for (const name of scripts) w.eval(files[name]);
				expect(fetcher).not.toHaveBeenCalled();
				w.document.getElementById("fixture").click();
				if (project.project === "master-checkpoint-two") {
					w.document.getElementById("sum").click();
					expect(
						w.document.getElementById("sums").textContent
					).toContain("[-3,2] => 2");
					expect(
						w.document.getElementById("move").textContent
					).toContain("pound");
				} else {
					w.document.getElementById("type").value = " FIRE ";
					w.document
						.getElementById("query")
						.dispatchEvent(
							new w.Event("submit", { cancelable: true })
						);
					expect(
						w.document.getElementById("result").textContent
					).toContain("fire: 2 of 6");
					expect(
						w.document.getElementById("source").textContent
					).toContain("Practice fixture");
				}
				const id =
					project.project === "master-checkpoint-two"
						? "move"
						: "source";
				const previous = w.document.getElementById(id).textContent;
				w.document.getElementById("live").click();
				await vi.waitFor(() =>
					expect(w.document.getElementById("live").disabled).toBe(
						false
					)
				);
				expect(fetcher).toHaveBeenCalledTimes(1);
				expect(w.document.getElementById(id).textContent).toBe(
					previous
				);
				expect(
					w.document.getElementById("status").textContent
				).toContain("last valid");
			} finally {
				dom.window.close();
			}
		}
	);
}
