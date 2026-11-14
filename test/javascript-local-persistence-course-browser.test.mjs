import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Actual assigned course-source workflows.
import { test } from "node:test";
import MarkdownIt from "markdown-it";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
import { editedLocalProjectSource } from "./javascript-local-persistence-browser-cases.mjs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-local-persistence-sources.json",
			import.meta.url
		),
		"utf8"
	)
);

const resources = fixture.resources;
const projects = [...new Set(resources.map(row => row.project))];
assert.equal(resources.length, 10);
assert.equal(projects.length, 5);
for (const resource of resources) {
	for (const file of resource.files) {
		const bytes = readFileSync(
			new URL(
				`../front-end/public/course-assets/javascript-level-2/${file.path}`,
				import.meta.url
			)
		);
		assert.equal(bytes.length, file.byteLength);
		assert.equal(
			createHash("sha256").update(bytes).digest("hex"),
			file.sha256
		);
	}
}

for (const project of projects) {
	const selected = resources.filter(row => row.project === project);
	const projectContract = fixture.projects.find(
		row => row.project === project
	);
	const lessonReading = fixture.readings.find(
		row => row.moduleId === projectContract.moduleId
	);
	const readingHTML = new MarkdownIt().render(lessonReading.content);
	const roles = selected.some(row => row.role === "reference")
		? ["starter", "solution"]
		: ["starter"];
	const select = (role) => {
		const selectedRole = role === "starter" ? "starter" : "reference";
		const found = selected.filter(row => row.role === selectedRole);
		assert.equal(found.length, 1);
		return found[0];
	};
	test(
		`JavaScript ${project}: original assignment consent, saved source and complete ZIPs`,
		{ timeout: 180000 },
		async (t) => {
			await runAssemblyCoreCourseWorkflow(t, {
				kind: `javascript-${project}`,
				courseID: fixture.courseId,
				moduleID: projectContract.moduleId,
				coreID: selected[0].itemId,
				roles,
				mode: "web",
				fixturePath:
					"./fixtures/javascript-local-persistence-sources.json",
				sourceUrl: role => select(role).urls[0],
				localSource: {
					prefix: "/course-assets/javascript-level-2/",
					files: role => select(role).files
				},
				expectedFile: (role, name) =>
					select(role).files.find(file => file.name === name),
				flatFiles: true,
				fileCount: role => select(role).files.length,
				initialFile: "index.html",
				primaryFile: "index.html",
				editFiles: [
					"index.html",
					"styles.css",
					"README.md",
					"script.js"
				],
				editContent: ({ role, filename, original }) =>
					["index.html", "styles.css", "script.js"].includes(filename)
						? editedLocalProjectSource(
								select(role),
								filename,
								original
							)
						: undefined,
				beforeImport: async (page, { role, width }) => {
					if (!["todo-list", "message-board"].includes(project))
						return;
					const card = `#${projectContract.moduleId}-${lessonReading.id}`;
					const learn = ".lesson-view-toggle button:nth-child(3)";
					await page.locator(learn).click();
					await page.waitForSelector(`${learn}[aria-pressed='true']`);
					await page.waitForSelector(
						`${card} .item-content-markdown`
					);
					await page.waitForFunction(
						(selector, expectedHTML) => {
							const element = document.querySelector(selector);
							if (!element) return false;
							const expected = document.createElement("div");
							expected.innerHTML = expectedHTML;
							const normalize = text =>
								text.replace(/\s+/gu, " ").trim();
							return (
								normalize(element.textContent)
								=== normalize(expected.textContent)
							);
						},
						{},
						`${card} .item-content-markdown`,
						readingHTML
					);
					const reading = await page.$eval(
						`${card} .item-content-markdown`,
						(element, expectedHTML) => {
							const expected = document.createElement("div");
							expected.innerHTML = expectedHTML;
							const normalize = text =>
								text.replace(/\s+/gu, " ").trim();
							return {
								complete:
									normalize(element.textContent)
									=== normalize(expected.textContent),
								text: normalize(element.textContent)
							};
						},
						readingHTML
					);
					assert.ok(reading.complete, JSON.stringify(reading));
					await page.screenshot({
						path: join(
							process.env
								.JAVASCRIPT_LOCAL_PERSISTENCE_BROWSER_DIR
								|| "output/javascript-local-persistence-browser",
							project,
							`reading-${role}-${width}.png`
						),
						fullPage: true
					});
					const projects = ".lesson-view-toggle button:nth-child(1)";
					await page.locator(projects).click();
					await page.waitForSelector(
						`${projects}[aria-pressed='true']`
					);
					return { fullReadingRendered: reading };
				},
				afterImport: async (_page, { saved }) => {
					const guide = saved.files.find(
						file => file.name === "README.md"
					).content;
					for (const token of ["index.html", "CASES.md"])
						assert.ok(guide.includes(token));
					return { completeLocalDocumentInputs: true };
				},
				taskFile: "README.md",
				continuationIDs: [selected[0].itemId],
				projectKey: role =>
					`${fixture.courseId}:${select(role).itemId}:${select(role).role}:${project}:v${select(role).version}`,
				previousProject: () => ({
					_id: `earlier-${project}-attempt`,
					title: "Earlier work",
					mode: "web",
					files: [
						{
							name: "index.html",
							content: "// Earlier local project work\n",
							encoding: "text"
						}
					],
					activeFileName: "index.html",
					courseID: fixture.courseId,
					courseProjectKey: `${fixture.courseId}:earlier:${project}`,
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				instructionTokens: ["index.html", "README.md", "CASES.md"],
				starterToken: "index.html",
				referenceToken: "index.html",
				readyToken: "Open index.html",
				outputEnv: "JAVASCRIPT_LOCAL_PERSISTENCE_BROWSER_DIR",
				outputSubdirectory: project,
				defaultOutput: "output/javascript-local-persistence-browser"
			});
		}
	);
}
