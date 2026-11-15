import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Actual assigned course-source workflows.
import { test } from "node:test";
import MarkdownIt from "markdown-it";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
import { editedQuizSource } from "./javascript-us-capitals-browser-cases.mjs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-us-capitals-sources.json",
			import.meta.url
		),
		"utf8"
	)
);

const resources = fixture.resources;
const projects = [...new Set(resources.map(row => row.project))];
assert.equal(resources.length, 2);
assert.equal(projects.length, 1);
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
				fixturePath: "./fixtures/javascript-us-capitals-sources.json",
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
					"model.js"
				],
				editContent: ({ role, filename, original }) =>
					["index.html", "styles.css", "model.js"].includes(filename)
						? editedQuizSource(select(role), filename, original)
						: undefined,

				beforeImport: async (page, { role, width }) => {
					const card
						= `#${projectContract.moduleId}-${fixture.itemId}`;
					const guide = fixture.files[project].starter["README.md"]
						.split("\n\n")
						.slice(1)
						.join("\n\n")
						.split("\n\nComplete the three task functions")[0];
					const html = new MarkdownIt().render(guide);
					const selector = `${card} .item-content-markdown`;
					await page.waitForSelector(selector);
					await page.waitForFunction(
						(selector, html) => {
							const expected = document.createElement("div");
							expected.innerHTML = html;
							const normalize = text =>
								text.replace(/\s+/gu, " ").trim();
							return normalize(
								document.querySelector(selector)?.textContent
								|| ""
							).includes(normalize(expected.textContent));
						},
						{},
						selector,
						html
					);
					const actual = await page.$eval(
						selector,
						e => e.textContent
					);
					await page.screenshot({
						path: join(
							process.env.JAVASCRIPT_US_CAPITALS_BROWSER_DIR
							|| "output/javascript-us-capitals-browser",
							project,
							`assignment-${role}-${width}.png`
						),
						fullPage: true
					});
					return {
						fullAssignmentRendered: true,
						assignmentText: actual
					};
				},
				afterImport: async (_page, { saved }) => {
					const guide = saved.files.find(
						file => file.name === "README.md"
					).content;
					for (const token of ["index.html", "CASES.md"])
						assert.ok(guide.includes(token));
					return { completeQuizInputs: true };
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
				instructionTokens: [
					"index.html",
					"README.md",
					"without a server"
				],
				starterToken: "index.html",
				referenceToken: "index.html",
				readyToken: "Open index.html",
				outputEnv: "JAVASCRIPT_US_CAPITALS_BROWSER_DIR",
				outputSubdirectory: project,
				defaultOutput: "output/javascript-us-capitals-browser"
			});
		}
	);
}
