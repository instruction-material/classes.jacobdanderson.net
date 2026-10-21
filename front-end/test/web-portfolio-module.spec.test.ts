import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { JSDOM } from "jsdom";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { webBuildInstructions } from "@/modules/webBuildInstructions";
import {
	webCourseProjectKey,
	webCourseResourceUrl,
	webModulePortfolioRoot,
	webPortfolioRoot
} from "@/modules/webProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/web-portfolio-module-source.json"),
		"utf8"
	)
);
const legacy = JSON.parse(
	readFileSync(resolve("../test/fixtures/web-portfolio-source.json"), "utf8")
);
const moduleId =
	"web-development-foundations-wdf3-stage-2-web-development-foundations";

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("web portfolio module edition", () => {
	it("retains the full reading and separates required work, choices and staff reference", async () => {
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "web-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["web-development-foundations"],
			editTutors: false,
			saveEdit: "Save"
		});
		const store = useCoursesStore();
		const staff = (await store.loadCourseById(
			"web-development-foundations"
		))!.modules.find(row => row.id === moduleId)!;
		app.setCurrentTutor(null);
		const learner = (await store.loadCourseById(
			"web-development-foundations"
		))!.modules.find(row => row.id === moduleId)!;
		expect(learner.title).toBe(
			"WDF3 Accessible Portfolio, Modules, and Forms"
		);
		const sourceReading =
			fixture.files[`${fixture.pack}/README.md`].content;
		const [sourceIntroduction, sourceWorkflow] = sourceReading.split(
			"## Run from the complete repository"
		);
		expect(learner.curriculum[0].content.replaceAll("`TODO`", "TODO")).toContain(
			sourceIntroduction
				.replace(
					"(basics/README.md)",
					`(https://github.com/instruction-material/Web-Development-Foundations/tree/${fixture.revision}/${fixture.pack}/basics)`
				)
				.trim()
		);
		expect(learner.curriculum[0].content).toContain(
			`## Run from the complete repository${sourceWorkflow}`.trim()
		);
		expect(learner.curriculum[0].content).toContain(
			`git switch --detach ${fixture.revision}`
		);
		expect(learner.curriculum[0].content).toBe(
			readFileSync(
				resolve(
					"src/assets/course-guides/web-portfolio-modules-forms.md"
				),
				"utf8"
			).trim()
		);
		expect(learner.curriculum.map(row => row.learningPath)).toEqual([
			undefined,
			"core",
			"core"
		]);
		expect(
			learner.supplementalProjects.map(row => row.learningPath)
		).toEqual(["choice", "choice", "challenge"]);
		expect(staff.curriculum[2].solutionLink).toBe(
			`${webModulePortfolioRoot}/solution`
		);
		expect(learner.curriculum[2].solutionLink).toBeUndefined();
		for (const item of [
			...learner.curriculum,
			...learner.supplementalProjects
		].filter(row => row.projectLink)) {
			expect(item.projectLink).toBe(`${webModulePortfolioRoot}/starter`);
			expect(item.ideImport).toBe(true);
		}
		expect(staff.supplementalProjects.every(row => !row.solutionLink)).toBe(
			true
		);
		expect(learner.curriculum.map(row => row.id)).toEqual(
			staff.curriculum.map(row => row.id)
		);
	});

	it.each(["starter", "solution"] as const)(
		"imports all %s modules and preserves the earlier saved edition through ZIP/reopen",
		async role => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (input: string | URL) => {
					const url = String(input);
					requests.push(url);
					const file =
						fixture.files[url.split(`/${fixture.revision}/`)[1]];
					return new Response(file?.content ?? "missing", {
						status: file ? 200 : 404
					});
				})
			);
			const url = `${webModulePortfolioRoot}/${role}`;
			expect(webCourseResourceUrl(url)).toBe(url);
			const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
			expect(files.map(row => row.name)).toEqual([
				"index.html",
				"main.js",
				"styles.css",
				"package.json",
				"project-idea.js",
				"README.md"
			]);
			expect(requests).toHaveLength(6);
			const kind = role === "starter" ? "starter" : "reference";
			const oldKey = webCourseProjectKey(
				"web-development-foundations",
				"setup",
				kind,
				`${webPortfolioRoot}/${role}`
			);
			const key = webCourseProjectKey(
				"web-development-foundations",
				moduleId,
				kind,
				url
			);
			expect(oldKey).toBe(
				`web-development-foundations:portfolio:${kind}:web-source-v1`
			);
			expect(key).toBe(
				`web-development-foundations:portfolio:${kind}:web-source-v2`
			);
			const prior = createPythonIdeProject("web", {
				courseProjectKey: oldKey,
				starterUrl: `${webPortfolioRoot}/${role}`,
				files: Object.entries(
					legacy.files as Record<string, { content: string }>
				)
					.filter(
						([path]) =>
							path.includes(`/${role}/`) ||
							path === `${legacy.pack}/README.md`
					)
					.map(([path, row]) => ({
						name: path.split("/").at(-1)!,
						content: row.content,
						encoding: "text"
					}))
			});
			const original = structuredClone(prior);
			const project = createPythonIdeProject("web", {
				files,
				courseProjectKey: key,
				starterUrl: url
			});
			for (const file of files) {
				const path =
					file.name === "README.md"
						? `${fixture.pack}/README.md`
						: `${fixture.pack}/${role}/${file.name}`;
				expect(file.content).toBe(fixture.files[path].content);
			}
			project.files.find(
				row => row.name === "project-idea.js"
			)!.content += "\n// Saved module observation\n";
			project.activeFileName = "project-idea.js";
			await saveLocalPythonProjects([prior, project]);
			const reopened = await loadLocalPythonProjects();
			expect(reopened.find(row => row._id === prior._id)).toEqual(
				original
			);
			const saved = reopened.find(row => row._id === project._id)!;
			expect(saved).toEqual(project);
			const zip = unzipSync(createProjectArchive(saved));
			expect(Object.keys(zip)).toHaveLength(6);
			for (const file of saved.files) {
				const name = Object.keys(zip).find(name =>
					name.endsWith(`/${file.name}`)
				)!;
				expect(strFromU8(zip[name])).toBe(file.content);
			}
			expect(webBuildInstructions(url).join("\n")).toContain(
				fixture.revision
			);
			expect(
				requests.some(request =>
					request.includes(
						role === "starter" ? "/solution/" : "/starter/"
					)
				)
			).toBe(false);
		}
	);

	it.each(["starter", "solution"] as const)(
		"executes the actual %s DOM events, safe rendering, focus and reset",
		role => {
			const root = `${fixture.pack}/${role}/`;
			const dom = new JSDOM(fixture.files[root + "index.html"].content, {
				url: "https://example.invalid"
			});
			try {
				const { document, FormData } = dom.window;
				const code =
					fixture.files[root + "project-idea.js"].content.replace(
						"export function ",
						"function "
					) +
					"\n" +
					fixture.files[root + "main.js"].content.replace(
						'import { validateProjectIdea } from "./project-idea.js";',
						""
					);
				runInNewContext(code, { document, FormData, Date });
				const form = document.querySelector("form")!;
				const field = (name: string) =>
					form.elements.namedItem(name) as HTMLInputElement;
				field("projectTitle").value = "  雪の星  ";
				field("projectType").value = "game";
				field("goal").value = "<b>literal text</b>";
				form.requestSubmit();
				const summary = document.querySelector("#idea-summary")!;
				const status = document.querySelector("#idea-status")!;
				expect(
					document.querySelectorAll("#deployment-list li")
				).toHaveLength(role === "starter" ? 3 : 4);
				expect(document.querySelector("#year")!.textContent).toMatch(
					/Updated/
				);
				if (role === "starter") {
					expect(summary.children).toHaveLength(0);
					expect(status.textContent).toMatch(/Complete/);
					expect(document.activeElement).toBe(field("projectTitle"));
				} else {
					expect(summary.querySelector("b")).toBeNull();
					expect(
						[...summary.querySelectorAll("dd")].map(
							node => node.textContent
						)
					).toEqual(["雪の星", "game", "<b>literal text</b>"]);
					field("projectTitle").value = "   ";
					form.requestSubmit();
					expect(summary.children).toHaveLength(0);
					expect(status.textContent).toMatch(/1 to 60/);
					expect(document.activeElement).toBe(field("projectTitle"));
					field("projectTitle").value = "Another idea";
					form.requestSubmit();
					form.requestSubmit();
					expect(summary.querySelectorAll("dd")).toHaveLength(3);
				}
				form.reset();
				expect(summary.children).toHaveLength(0);
				expect(field("projectTitle").value).toBe("");
				expect(field("projectType").value).toBe("");
				expect(status.textContent).toMatch(/cleared/);
			} finally {
				dom.window.close();
			}
		}
	);
});
