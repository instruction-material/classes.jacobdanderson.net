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
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { webBuildInstructions } from "@/modules/webBuildInstructions";
import {
	webNotesRoleFiles,
	webNotesRoot,
	webCourseProjectKey,
	webCourseResourceUrl
} from "@/modules/webProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(resolve("../test/fixtures/web-notes-source.json"), "utf8")
);
const moduleId =
	"web-development-foundations-wdf6-stage-5-databases-and-data-models";
const names = [...webNotesRoleFiles, "README.md"];

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("notes API course workspace", () => {
	it("retains the five published activities, complete readings and staff-only core reference", async () => {
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "notes-tutor",
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
			`${moduleId}-curriculum-databases-and-data-models-core-concepts`,
			`${moduleId}-curriculum-core-project-databases-and-data-models`
		]);
		expect(learner.supplementalProjects.map(row => row.id)).toEqual([
			`${moduleId}-supplemental-project-blog-or-notes-app-with-mongodb`,
			`${moduleId}-supplemental-database-models-transfer-practice`,
			`${moduleId}-supplemental-database-models-extension-practice`
		]);
		const reading = ["models", "storage", "recovery", "project"]
			.map(name =>
				readFileSync(
					resolve(`src/assets/course-guides/web-notes-${name}.md`),
					"utf8"
				).trim()
			)
			.join("\n\n---\n\n");
		expect(learner.curriculum[0].content).toBe(reading);
		for (const token of [
			"validateNoteInput",
			"replaceMemoryNote",
			"Mongoose",
			"unique",
			"PUT",
			"snapshot",
			"schemaVersion",
			"NOTES_SEED_FILE",
			"relational",
			"1 MiB",
			"MongoDB",
			"createdAt"
		])
			expect(reading).toContain(token);
		expect(learner.curriculum[1].projectLink).toBe(
			`${webNotesRoot}/starter`
		);
		expect(staff.curriculum[1].solutionLink).toBe(
			`${webNotesRoot}/solution`
		);
		expect(learner.curriculum[1].solutionLink).toBeUndefined();
		expect(learner.curriculum[1].learningPath).toBe("core");
		expect(
			learner.supplementalProjects.map(row => row.learningPath)
		).toEqual(["choice", "choice", "challenge"]);
		expect(staff.supplementalProjects.every(row => !row.solutionLink)).toBe(
			true
		);
		const blocks = [
			...learner.supplementalProjects[2].content.matchAll(
				/```json\n([\s\S]*?)\n```/g
			)
		].map(match => JSON.parse(match[1]));
		expect(blocks).toHaveLength(2);
		expect(new Date(blocks[0].records[0].createdMs).toISOString()).toBe(
			blocks[1].notes[0].createdAt
		);
		expect(blocks[0].records[0].labels).toEqual(blocks[1].notes[0].tags);
		if (process.env.WEB_NOTES_EXPORT_DIR) {
			mkdirSync(process.env.WEB_NOTES_EXPORT_DIR, { recursive: true });
			writeFileSync(
				resolve(
					process.env.WEB_NOTES_EXPORT_DIR,
					"lesson-fixtures.json"
				),
				JSON.stringify(
					{ legacy: blocks[0], converted: blocks[1] },
					null,
					2
				)
			);
		}
	});

	it.each(["starter", "solution"] as const)(
		"round-trips the complete nested %s files while retaining earlier work",
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
			const url = `${webNotesRoot}/${role}`;
			expect(webCourseResourceUrl(url)).toBe(url);
			expect(
				webCourseResourceUrl(url.replace(fixture.revision, "main"))
			).toBe(url);
			const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
			expect(files.map(row => row.name)).toEqual(names);
			expect(requests).toHaveLength(10);
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
			expect(files.some(file => file.name.startsWith(".env"))).toBe(
				false
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
			const original = structuredClone(prior);
			const earlierNotes = createPythonIdeProject("web", {
				title: "Earlier notes attempt",
				courseProjectKey: `web-development-foundations:${moduleId}-curriculum-core-project-databases-and-data-models:${role === "starter" ? "starter" : "reference"}`,
				files: [
					{
						name: "src/models/note.js",
						content: "// Original notes work\n",
						encoding: "text"
					}
				]
			});
			const originalNotes = structuredClone(earlierNotes);
			const key = webCourseProjectKey(
				"web-development-foundations",
				moduleId,
				role === "starter" ? "starter" : "reference",
				url
			);
			expect(key).toBe(
				`web-development-foundations:notes-api:${role === "starter" ? "starter" : "reference"}:web-source-v1`
			);
			const project = createPythonIdeProject("web", {
				files,
				courseProjectKey: key,
				starterUrl: url
			});
			expect(project.activeFileName).toBe("src/models/note.js");
			for (const name of ["src/models/note.js", "src/store.js"]) {
				const file = project.files.find(file => file.name === name)!;
				file.content =
					(role === "starter"
						? fixture.completedStarter[name]
						: file.content) +
					"\n// Saved notes identity investigation\n";
			}
			project.files.find(file => file.name === "README.md")!.content +=
				"\nSaved restore comparison.\n";
			await saveLocalPythonProjects([prior, earlierNotes, project]);
			const reopened = await loadLocalPythonProjects();
			expect(reopened.find(row => row._id === prior._id)).toEqual(
				original
			);
			expect(reopened.find(row => row._id === earlierNotes._id)).toEqual(
				originalNotes
			);
			const saved = reopened.find(row => row._id === project._id)!;
			expect(saved).toEqual(project);
			const bytes = createProjectArchive(saved);
			const zip = unzipSync(bytes);
			expect(Object.keys(zip)).toHaveLength(10);
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
				`npm run start --workspace ${fixture.pack}/${role}`,
				"root lockfile",
				"127.0.0.1:3001",
				"501",
				"NOTES_SCENARIO"
			])
				expect(instructions).toContain(token);
			expect(instructions).not.toContain("npm ci --workspace");
			if (process.env.WEB_NOTES_EXPORT_DIR) {
				mkdirSync(process.env.WEB_NOTES_EXPORT_DIR, {
					recursive: true
				});
				writeFileSync(
					resolve(process.env.WEB_NOTES_EXPORT_DIR, `${role}.zip`),
					bytes
				);
				writeFileSync(
					resolve(process.env.WEB_NOTES_EXPORT_DIR, `${role}.json`),
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
