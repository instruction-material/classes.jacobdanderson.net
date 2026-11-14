import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Actual assigned course-source workflows.
import { test } from "node:test";
import MarkdownIt from "markdown-it";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
import { editedCheckpointOneSource } from "./javascript-master-checkpoint-one-browser-cases.mjs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-master-checkpoint-one-sources.json",
			import.meta.url
		),
		"utf8"
	)
);

const resources = fixture.resources;
const projects = [...new Set(resources.map(row => row.project))];
assert.equal(resources.length, 4);
assert.equal(projects.length, 2);
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
				fixturePath:
					"./fixtures/javascript-master-checkpoint-one-sources.json",
				sourceUrl: role =>
					select(role).urls[
						project === "master-checkpoint-one"
						&& role === "solution"
							? 1
							: 0
					],
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
					...(project === "master-checkpoint-one"
						? [
								"functions.js",
								"arrays.js",
								"objects.js",
								"script.js"
							]
						: ["board.js", "script.js"])
				],
				editContent: ({ role, filename }) =>
					editedCheckpointOneSource(select(role), filename),

				beforeImport: async (page, { role, width }) => {
					const texts = [];
					for (const itemID of [
						projectContract.itemId,
						...projectContract.continuationIds
					]) {
						const selector = `#${projectContract.moduleId}-${itemID} .item-content-markdown`;
						const html = new MarkdownIt().render(
							fixture.assignmentTexts[itemID]
						);
						await page.waitForSelector(selector);
						const actual = await page.$eval(
							selector,
							(element, html) => {
								const expected = document.createElement("div");
								expected.innerHTML = html;
								const normalize = text =>
									text.replace(/\s+/gu, " ").trim();
								if (
									!normalize(element.textContent).includes(
										normalize(expected.textContent)
									)
								) {
									throw new Error(
										"The complete checkpoint assignment did not render."
									);
								}
								return element.textContent;
							},
							html
						);
						texts.push({ itemID, text: actual });
					}
					await page.screenshot({
						path: join(
							process.env
								.JAVASCRIPT_MASTER_CHECKPOINT_ONE_BROWSER_DIR
								|| "output/javascript-master-checkpoint-one-browser",
							project,
							`assignment-${role}-${width}.png`
						),
						fullPage: true
					});
					return {
						fullAssignmentRendered: true,
						assignmentTexts: texts
					};
				},

				afterImport: async (_page, { saved }) => {
					const guide = saved.files.find(
						file => file.name === "README.md"
					).content;
					for (const token of [
						"index.html",
						project === "master-checkpoint-one"
							? "arrays.js"
							: "board.js"
					])
						assert.ok(guide.includes(token));
					return { completeCheckpointInputs: true };
				},
				taskFile: "README.md",
				continuationIDs: [
					selected[0].itemId,
					...projectContract.continuationIds
				],
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
				outputEnv: "JAVASCRIPT_MASTER_CHECKPOINT_ONE_BROWSER_DIR",
				outputSubdirectory: project,
				defaultOutput: "output/javascript-master-checkpoint-one-browser"
			});
		}
	);
}
