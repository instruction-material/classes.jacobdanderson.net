import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createIdeDiagnostics } from "@/modules/ideDiagnostics";
import { createProjectArchive } from "@/modules/projectArchive";
import { pythonIdeCompletionsForMode } from "@/modules/pythonCodeMirror";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	getPythonIdeDefaultFileContent,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	normalizePythonIdeMode,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { webBuildInstructions } from "@/modules/webBuildInstructions";
import { isWebProjectTextPath } from "@/modules/webProjectFiles";
import {
	webCourseProjectKey,
	webCourseResource,
	webMaintainedSourceRevision,
	webPortfolioRoot
} from "@/modules/webProjectResources";
import { isWebProjectTextPath as apiWebProjectTextPath } from "../../back-end/src/utils/webProjectFiles";

const fixture = JSON.parse(
	readFileSync(resolve("../test/fixtures/web-portfolio-source.json"), "utf8")
);
const original = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/web-portfolio-original-source.json"),
		"utf8"
	)
);

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("web portfolio source workspace", () => {
	it.each(
		[fixture, original].flatMap(source =>
			(["starter", "solution"] as const).map(role => ({
				edition:
					source.revision === fixture.revision
						? "maintained"
						: "original",
				source,
				role
			}))
		)
	)(
		"imports and round-trips exact $edition $role source, edits and ZIP files",
		async ({ role, source }) => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (input: string | URL) => {
					const url = String(input);
					requests.push(url);
					const file =
						source.files[url.split(`/${source.revision}/`)[1]];
					return new Response(file?.content ?? "missing", {
						status: file ? 200 : 404
					});
				})
			);
			const url = `https://github.com/instruction-material/Web-Development-Foundations/tree/${source.revision}/${source.pack}/${role}`;
			const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
			expect(files.map(file => file.name)).toEqual([
				"index.html",
				"main.js",
				"styles.css",
				"package.json",
				"README.md"
			]);
			expect(requests).toHaveLength(5);
			for (const file of files) {
				const path =
					file.name === "README.md"
						? `${source.pack}/README.md`
						: `${source.pack}/${role}/${file.name}`;
				expect(file.content).toBe(source.files[path].content);
				expect(file.encoding).toBe("text");
				expect(isValidPythonFileName(file.name, "web")).toBe(true);
			}
			expect(
				requests.every(
					request =>
						!request.includes(
							role === "starter" ? "/solution/" : "/starter/"
						)
				)
			).toBe(true);
			const key = webCourseProjectKey(
				"web-development-foundations",
				"first-activity",
				role === "starter" ? "starter" : "reference",
				url
			);
			const prior = createPythonIdeProject("python", {
				title: "Earlier attempt",
				courseID: "web-development-foundations",
				courseProjectKey: "web-development-foundations:earlier:starter"
			});
			const original = structuredClone(prior);
			const project = createPythonIdeProject("web", {
				files,
				starterUrl: url,
				courseID: "web-development-foundations",
				courseProjectKey: key
			});
			expect(project.activeFileName).toBe("index.html");
			project.files.find(file => file.name === "main.js")!.content +=
				"\n// Saved web observation\n";
			project.activeFileName = "main.js";
			await saveLocalPythonProjects([prior, project]);
			const reopened = await loadLocalPythonProjects();
			expect(reopened.find(row => row._id === prior._id)).toEqual(
				original
			);
			const saved = reopened.find(row => row._id === project._id)!;
			expect(saved).toEqual(project);
			const archive = unzipSync(createProjectArchive(saved));
			expect(Object.keys(archive)).toHaveLength(5);
			for (const file of saved.files) {
				const name = Object.keys(archive).find(name =>
					name.endsWith(`/${file.name}`)
				)!;
				expect(strFromU8(archive[name])).toBe(file.content);
			}
			const commands = webBuildInstructions(url).join("\n");
			expect(commands).toContain(
				`npm ci --workspace ${fixture.pack}/${role}`
			);
			expect(commands).toContain("not a standalone npm ci checkout");
			expect(commands).toContain(webMaintainedSourceRevision);
			expect(commands).toContain(
				"retain that checkout's workspace package.json"
			);
			expect(commands).toContain("--host 127.0.0.1");
		}
	);

	it.each([
		{
			revision: original.revision,
			pack: original.pack,
			project: "portfolio",
			version: 1
		},
		{
			revision: "6bfe60b31c07cbfabbc396790f1251503b1f4f7d",
			pack: original.pack,
			project: "portfolio",
			version: 2
		},
		{
			revision: "c18190dcca466f35f1e4a7ed677d922fa80daff8",
			pack: "WDF4-Realtime-Chat-App/local-client",
			project: "notification-state",
			version: 1
		},
		{
			revision: "26aa4f20a2230f5b422b0afa67b3d06426875adf",
			pack: "WDF4-Realtime-Chat-App/local-client",
			project: "notification-state",
			version: 1
		}
	])(
		"retains both saved-role keys for historical $revision",
		({ revision, pack, project, version }) => {
			for (const role of ["starter", "solution"] as const) {
				const url = `https://github.com/instruction-material/Web-Development-Foundations/tree/${revision}/${pack}/${role}`;
				expect(webCourseResource(url)).toMatchObject({
					resource: { ref: revision },
					pack,
					role,
					definition: { project, version }
				});
				const keyRole = role === "starter" ? "starter" : "reference";
				expect(
					webCourseProjectKey(
						"web-development-foundations",
						"new-activity",
						keyRole,
						url
					)
				).toBe(
					`web-development-foundations:${project}:${keyRole}:web-source-v${version}`
				);
				if (project === "portfolio") {
					const pack = version === 1 ? fixture.pack : original.pack;
					expect(webBuildInstructions(url).join("\n")).toContain(
						`npm ci --workspace ${pack}/${role}`
					);
				}
			}
		}
	);

	it("keeps original floating links on their saved edition and new paths on the maintained source", () => {
		for (const role of ["starter", "solution"]) {
			const root =
				"https://github.com/instruction-material/Web-Development-Foundations/tree/main";
			expect(
				webCourseResource(`${root}/${original.pack}/${role}`)
			).toMatchObject({
				resource: { ref: original.revision },
				definition: { version: 1 }
			});
			for (const pack of [
				fixture.pack,
				"WDF4-Realtime-Chat-App/local-client"
			]) {
				expect(
					webCourseResource(`${root}/${pack}/${role}`)?.resource.ref
				).toBe(webMaintainedSourceRevision);
			}
		}
	});

	it("keeps one saved continuation per role while leaving unknown sources unavailable", () => {
		for (const role of ["starter", "reference"] as const) {
			const url = `${webPortfolioRoot}/${role === "starter" ? "starter" : "solution"}`;
			expect(
				webCourseProjectKey(
					"web-development-foundations",
					"setup",
					role,
					url
				)
			).toBe(
				webCourseProjectKey(
					"web-development-foundations",
					"debugging",
					role,
					url
				)
			);
		}
		expect(
			webCourseResource(
				webPortfolioRoot.replace(fixture.revision, "main") + "/starter"
			)?.resource.ref
		).toBe(fixture.revision);
		expect(
			pythonIdeModeForCourseResource(
				"web-development-foundations",
				`${webPortfolioRoot}/starter`
			)
		).toBe("web");
		for (const url of [
			webPortfolioRoot + "/starter/main.js",
			webPortfolioRoot.replace(
				fixture.pack,
				"WDF2-Notes-App-with-MongoDB"
			) + "/starter",
			webPortfolioRoot.replace(fixture.revision, "unknown") + "/starter"
		])
			expect(
				pythonIdeModeForCourseResource(
					"web-development-foundations",
					url
				)
			).toBeNull();
	});

	it("uses web files and source-editor diagnostics without Python templates or completions", () => {
		const project = createPythonIdeProject("web");
		expect(normalizePythonIdeMode("web")).toBe("web");
		expect(project.activeFileName).toBe("index.html");
		expect(project.files.map(file => file.name)).toEqual([
			"index.html",
			"main.js",
			"styles.css"
		]);
		expect(getPythonIdeDefaultFileContent("helpers.js", "web")).toBe("");
		expect(pythonIdeCompletionsForMode("web")).toEqual([]);
		expect(
			createIdeDiagnostics("web", "idle", null, "3.13").runtime
		).toMatchObject({
			engine: "source-editor",
			pythonVersion: "not-loaded"
		});
	});

	it("keeps frontend/API path policies aligned and rejects traversal and unrelated code", () => {
		for (const name of [
			"index.html",
			"src/main.js",
			"styles.css",
			"package.json",
			"README.md",
			"data.txt"
		]) {
			expect(isWebProjectTextPath(name)).toBe(
				apiWebProjectTextPath(name)
			);
			expect(isValidPythonFileName(name, "web")).toBe(true);
		}
		for (const name of [
			"../main.js",
			"/index.html",
			"src//main.js",
			"main.py",
			"secrets.env",
			"src\\main.js",
			"image.png"
		])
			expect(isValidPythonFileName(name, "web")).toBe(false);
		expect(isValidPythonFileName("main.js", "python")).toBe(false);
		expect(isValidPythonFileName("index.html", "rust")).toBe(false);
	});
});
