import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
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
import {
	webDeploymentRoot,
	webCourseProjectKey,
	webCourseResourceUrl
} from "@/modules/webProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(resolve("../test/fixtures/web-deployment-source.json"), "utf8")
);
const moduleId =
	"web-development-foundations-wdf7-stage-6-hosting-and-deployment";
const coreId = `${moduleId}-curriculum-core-project-hosting-and-deployment`;

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("separate deployment course workspace", () => {
	it("preserves published activities and restricts only the genuine core reference", async () => {
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "deployment-tutor",
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
		expect(learner.curriculum.map(row => row.id)).toEqual([
			`${moduleId}-curriculum-hosting-and-deployment-core-concepts`,
			coreId
		]);
		expect(learner.supplementalProjects.map(row => row.id)).toEqual([
			`${moduleId}-supplemental-project-ship-a-front-end-and-back-end-separately`,
			`${moduleId}-supplemental-hosting-deployment-transfer-practice`,
			`${moduleId}-supplemental-hosting-deployment-extension-practice`
		]);
		const reading = ["foundations", "project", "operations"]
			.map(name =>
				readFileSync(
					resolve(
						`src/assets/course-guides/web-deployment-${name}.md`
					),
					"utf8"
				).trim()
			)
			.join("\n\n---\n\n");
		expect(learner.curriculum[0].content).toBe(reading);
		for (const token of [
			"DNS",
			"TLS",
			"CORS",
			"FRONTEND_ORIGIN",
			"digestBytes",
			"assertInventory",
			"manifestSHA256",
			"not-a-status-prefix",
			"readiness",
			"rollback",
			"1 MiB",
			"Node.js 24"
		])
			expect(reading).toContain(token);
		expect(learner.curriculum[0].projectLink).toBeUndefined();
		expect(learner.curriculum[1].projectLink).toBe(
			`${webDeploymentRoot}/starter`
		);
		expect(staff.curriculum[1].solutionLink).toBe(
			`${webDeploymentRoot}/solution`
		);
		expect(learner.curriculum[1].solutionLink).toBeUndefined();
		expect(learner.curriculum[1].learningPath).toBe("core");
		expect(
			learner.supplementalProjects.map(row => row.learningPath)
		).toEqual(["choice", "choice", "challenge"]);
		expect(staff.supplementalProjects.every(row => !row.solutionLink)).toBe(
			true
		);
		for (const row of [
			learner.curriculum[1],
			...learner.supplementalProjects
		]) {
			expect(row.ideImport).toBe(true);
			expect(
				pythonIdeModeForCourseResource(
					"web-development-foundations",
					row.projectLink!
				)
			).toBe("web");
		}
		expect(learner.supplementalProjects[0].content).toContain(
			"deployment-probe.mjs"
		);
		expect(learner.supplementalProjects[1].content).toContain(
			"compare-releases.mjs"
		);
		expect(learner.supplementalProjects[2].content).toContain(
			"stage-recovery.mjs"
		);
	});

	it.each(["starter", "solution"] as const)(
		"round-trips every selected-role %s file without replacing earlier work",
		async role => {
			const names = [...fixture.roleFiles[role], ...fixture.sharedFiles];
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
			const url = `${webDeploymentRoot}/${role}`;
			expect(webCourseResourceUrl(url)).toBe(url);
			expect(
				webCourseResourceUrl(url.replace(fixture.revision, "main"))
			).toBe(url);
			const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
			expect(files.map(row => row.name)).toEqual(names);
			expect(requests).toHaveLength(role === "starter" ? 9 : 10);
			for (const file of files) {
				const source =
					fixture.files[
						`${fixture.pack}/${file.name === "README.md" ? "" : role + "/"}${file.name}`
					];
				expect(file.content).toBe(source.content);
				expect(
					createHash("sha256").update(file.content).digest("hex")
				).toBe(source.sha256);
			}
			expect(
				requests.some(row =>
					row.includes(
						role === "starter" ? "/solution/" : "/starter/"
					)
				)
			).toBe(false);
			expect(names.includes("frontend/env.template.js")).toBe(
				role === "starter"
			);
			expect(names.includes("frontend/env.js")).toBe(role === "solution");
			expect(names.includes("frontend/styles.css")).toBe(
				role === "solution"
			);
			const prior = createPythonIdeProject("web", {
				title: "Earlier portfolio",
				courseProjectKey:
					"web-development-foundations:portfolio:starter:web-source-v1",
				files: [
					{
						name: "main.js",
						content: "// Earlier independent work\n",
						encoding: "text"
					}
				]
			});
			const earlier = createPythonIdeProject("web", {
				title: "Earlier deployment attempt",
				courseProjectKey: `web-development-foundations:${coreId}:${role === "starter" ? "starter" : "reference"}`,
				files: [
					{
						name: "release-model.mjs",
						content: "// Original deployment attempt\n",
						encoding: "text"
					}
				]
			});
			const originals = structuredClone([prior, earlier]);
			const key = webCourseProjectKey(
				"web-development-foundations",
				coreId,
				role === "starter" ? "starter" : "reference",
				url
			);
			expect(key).toBe(
				`web-development-foundations:deployment:${role === "starter" ? "starter" : "reference"}:web-source-v1`
			);
			const project = createPythonIdeProject("web", {
				files,
				courseProjectKey: key,
				starterUrl: url
			});
			expect(project.activeFileName).toBe("backend/package.json");
			const model = project.files.find(
				row => row.name === "release-model.mjs"
			)!;
			model.content =
				(role === "starter"
					? fixture.completedStarter["release-model.mjs"]
					: model.content) + "\n// Saved deployment investigation\n";
			project.files.find(row => row.name === "README.md")!.content +=
				"\nSaved retained-release comparison.\n";
			await saveLocalPythonProjects([prior, earlier, project]);
			const reopened = await loadLocalPythonProjects();
			for (const original of originals)
				expect(reopened.find(row => row._id === original._id)).toEqual(
					original
				);
			const saved = reopened.find(row => row._id === project._id)!;
			expect(saved).toEqual(project);
			const bytes = createProjectArchive(saved);
			const zip = unzipSync(bytes);
			expect(Object.keys(zip)).toHaveLength(names.length);
			for (const file of saved.files) {
				const name = Object.keys(zip).find(name =>
					name.endsWith(`/${file.name}`)
				)!;
				expect(strFromU8(zip[name])).toBe(file.content);
			}
			const instructions = webBuildInstructions(url).join("\n");
			for (const token of [
				fixture.revision,
				"npm ci",
				`npm run start --workspace ${fixture.pack}/${role}/backend`,
				`node ${fixture.pack}/${role}/frontend/serve.mjs`,
				"root dependency lockfile",
				"127.0.0.1:4173",
				"127.0.0.1:4001",
				"restore"
			])
				expect(instructions).toContain(token);
			expect(instructions).not.toContain("CONTACT_SCENARIO");
			expect(instructions).not.toContain("npm ci --workspace");
			if (process.env.WEB_DEPLOYMENT_EXPORT_DIR) {
				mkdirSync(process.env.WEB_DEPLOYMENT_EXPORT_DIR, {
					recursive: true
				});
				writeFileSync(
					resolve(
						process.env.WEB_DEPLOYMENT_EXPORT_DIR,
						`${role}.zip`
					),
					bytes
				);
				writeFileSync(
					resolve(
						process.env.WEB_DEPLOYMENT_EXPORT_DIR,
						`${role}.json`
					),
					JSON.stringify(
						{
							role,
							sourceRevision: fixture.revision,
							courseProjectKey: key,
							files: saved.files
						},
						null,
						2
					)
				);
			}
		}
	);
});
