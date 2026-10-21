import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
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
	webContactRoleFiles,
	webContactRoot,
	webCourseProjectKey,
	webCourseResourceUrl
} from "@/modules/webProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(resolve("../test/fixtures/web-contact-source.json"), "utf8")
);
const moduleId = "web-development-foundations-wdf5-stage-4-back-end-basics";
const names = [...webContactRoleFiles, "README.md"];

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("contact API course workspace", () => {
	it.each([true, false])(
		"executes the documented cancellation fixture with generation protection=%s",
		async protectedResponse => {
			setActivePinia(createPinia());
			const course = (await useCoursesStore().loadCourseById(
				"web-development-foundations"
			))!;
			const challenge = course.modules.find(row => row.id === moduleId)!
				.supplementalProjects[2];
			const fixtureCode = challenge.content.match(
				/```js\n([\s\S]*?)\n```/
			)![1];
			const role = `${fixture.pack}/solution/`;
			const dom = new JSDOM(
				fixture.files[role + "public/index.html"].content,
				{ url: "http://127.0.0.1:3002", runScripts: "outside-only" }
			);
			const { window } = dom;
			const realFetch = vi.fn(
				async () => new Response("unexpected request", { status: 404 })
			);
			Object.assign(window, { fetch: realFetch, Response });
			try {
				window.eval(fixtureCode);
				let client = fixture.files[role + "public/app.js"].content;
				const marker =
					"        if (current !== generation) return;\n        if (response.status === 202";
				expect(client.split(marker)).toHaveLength(2);
				if (!protectedResponse)
					client = client.replace(
						marker,
						"        if (response.status === 202"
					);
				window.eval(client);
				const form = window.document.querySelector("form")!;
				const fill = (name: string) => {
					for (const [key, value] of Object.entries({
						name,
						replyTo: "reader@example.invalid",
						topic: "project",
						message: "A fictional request."
					})) {
						(
							form.elements.namedItem(key) as HTMLInputElement
						).value = value;
					}
				};
				fill("Older Reader");
				form.dispatchEvent(
					new window.Event("submit", { cancelable: true })
				);
				form.reset();
				fill("Current Reader");
				form.dispatchEvent(
					new window.Event("submit", { cancelable: true })
				);
				const release = (
					window as unknown as {
						releaseContact: (index: number) => void;
					}
				).releaseContact;
				release(0);
				for (let step = 0; step < 4; step++)
					await new Promise(resolve => setTimeout(resolve, 0));
				const status = window.document.querySelector("#status")!;
				await vi.waitFor(() =>
					expect(status.textContent).toBe(
						protectedResponse
							? "Submitting..."
							: "Recorded locally. No email was sent."
					)
				);
				expect(
					(
						window.document.querySelector(
							'[type="submit"]'
						) as HTMLButtonElement
					).disabled
				).toBe(true);
				release(1);
				await vi.waitFor(() =>
					expect(status.textContent).toBe(
						"Recorded locally. No email was sent."
					)
				);
				await vi.waitFor(() =>
					expect(
						(
							window.document.querySelector(
								'[type="submit"]'
							) as HTMLButtonElement
						).disabled
					).toBe(false)
				);
				expect(realFetch).not.toHaveBeenCalled();
			} finally {
				window.close();
			}
		}
	);

	it("retains the five published activities, complete readings and staff-only core reference", async () => {
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "contact-tutor",
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
			`${moduleId}-curriculum-back-end-basics-core-concepts`,
			`${moduleId}-curriculum-core-project-back-end-basics`
		]);
		expect(learner.supplementalProjects.map(row => row.id)).toEqual([
			`${moduleId}-supplemental-project-booking-or-contact-app-with-email-integration`,
			`${moduleId}-supplemental-back-end-basics-transfer-practice`,
			`${moduleId}-supplemental-back-end-basics-extension-practice`
		]);
		const reading = ["runtime", "routes", "contract", "identity"]
			.map(name =>
				readFileSync(
					resolve(`src/assets/course-guides/web-contact-${name}.md`),
					"utf8"
				).trim()
			)
			.join("\n\n---\n\n");
		expect(learner.curriculum[0].content).toBe(reading);
		for (const token of [
			"process.env",
			"express.json",
			"parseContact",
			"8192",
			"750 ms",
			"Authentication",
			"Authorization",
			"session",
			"Bearer",
			"ownership"
		])
			expect(reading).toContain(token);
		expect(learner.curriculum[1].projectLink).toBe(
			`${webContactRoot}/starter`
		);
		expect(staff.curriculum[1].solutionLink).toBe(
			`${webContactRoot}/solution`
		);
		expect(learner.curriculum[1].solutionLink).toBeUndefined();
		expect(learner.curriculum[1].learningPath).toBe("core");
		expect(
			learner.supplementalProjects.map(row => row.learningPath)
		).toEqual(["choice", "choice", "challenge"]);
		expect(staff.supplementalProjects.every(row => !row.solutionLink)).toBe(
			true
		);
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
			const url = `${webContactRoot}/${role}`;
			expect(webCourseResourceUrl(url)).toBe(url);
			expect(
				webCourseResourceUrl(url.replace(fixture.revision, "main"))
			).toBe(url);
			const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
			expect(files.map(row => row.name)).toEqual(names);
			expect(requests).toHaveLength(9);
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
			const earlierContact = createPythonIdeProject("web", {
				title: "Earlier contact attempt",
				courseProjectKey: `web-development-foundations:${moduleId}-curriculum-core-project-back-end-basics:${role === "starter" ? "starter" : "reference"}`,
				files: [
					{
						name: "src/validation.js",
						content: "// Original contact work\n",
						encoding: "text"
					}
				]
			});
			const originalContact = structuredClone(earlierContact);
			const key = webCourseProjectKey(
				"web-development-foundations",
				moduleId,
				role === "starter" ? "starter" : "reference",
				url
			);
			expect(key).toBe(
				`web-development-foundations:contact-api:${role === "starter" ? "starter" : "reference"}:web-source-v1`
			);
			const project = createPythonIdeProject("web", {
				files,
				courseProjectKey: key,
				starterUrl: url
			});
			expect(project.activeFileName).toBe("src/validation.js");
			const validator = project.files.find(
				file => file.name === "src/validation.js"
			)!;
			validator.content =
				(role === "starter"
					? fixture.completedStarter
					: validator.content) +
				"\n// Saved contact boundary investigation\n";
			await saveLocalPythonProjects([prior, earlierContact, project]);
			const reopened = await loadLocalPythonProjects();
			expect(reopened.find(row => row._id === prior._id)).toEqual(
				original
			);
			expect(
				reopened.find(row => row._id === earlierContact._id)
			).toEqual(originalContact);
			const saved = reopened.find(row => row._id === project._id)!;
			expect(saved).toEqual(project);
			const bytes = createProjectArchive(saved);
			const zip = unzipSync(bytes);
			expect(Object.keys(zip)).toHaveLength(9);
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
				"127.0.0.1:3002",
				"501",
				"CONTACT_SCENARIO"
			])
				expect(instructions).toContain(token);
			expect(instructions).not.toContain("npm ci --workspace");
			if (process.env.WEB_CONTACT_EXPORT_DIR) {
				mkdirSync(process.env.WEB_CONTACT_EXPORT_DIR, {
					recursive: true
				});
				writeFileSync(
					resolve(process.env.WEB_CONTACT_EXPORT_DIR, `${role}.zip`),
					bytes
				);
				writeFileSync(
					resolve(process.env.WEB_CONTACT_EXPORT_DIR, `${role}.json`),
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
