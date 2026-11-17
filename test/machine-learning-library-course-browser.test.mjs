import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Actual course imports and exported Python projects.
import { test } from "node:test";
import MarkdownIt from "markdown-it";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/machine-learning-library-workspaces.json",
			import.meta.url
		),
		"utf8"
	)
);
const selected =
	process.env.ML_LIBRARY_PROJECTS?.split(",").filter(Boolean) ?? [];
assert.ok(
	selected.every(key =>
		fixture.projects.some(project => project.caseId === key)
	)
);
const base = "https://github.com/instruction-material/AI-Level-2/";

for (const project of fixture.projects.filter(
	project => !selected.length || selected.includes(project.caseId)
)) {
	test(
		`ML ${
			project.caseId
		}: consent, full task, native instructions, fitting edits and saved ZIPs`,
		{ timeout: 600000 },
		async t => {
			const file = (role, name) =>
				fixture.files[`${project.sources[role]}/${name}`];
			const marker = `ML workflow verified: ${project.caseId}`;
			await runAssemblyCoreCourseWorkflow(t, {
				kind: project.caseId,
				previousProject: role => ({
					_id: `earlier-${project.caseId}`,
					title: "Earlier work",
					mode: "data",
					files: [
						{
							name: "main.py",
							content: "# earlier work\n",
							encoding: "text"
						}
					],
					activeFileName: "main.py",
					courseID: fixture.courseId,
					courseProjectKey: `${fixture.courseId}:${project.itemId}:${role === "starter" ? "starter" : "reference"}`,
					starterUrl: project.previousSources[role],
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				courseID: fixture.courseId,
				moduleID: project.moduleId,
				coreID: project.itemId,
				mode: "data",
				sourceRepository: fixture.repository,
				pack: project.caseId,
				fixturePath:
					"./fixtures/machine-learning-library-workspaces.json",
				roles: ["starter", "solution"],
				sameTab: true,
				githubDirectory: true,
				allowPythonRuntime: false,
				nativeInstructions: true,
				flatFiles: true,
				sharedFiles: [],
				initialFile: "main.py",
				primaryFile: "main.py",
				taskFile: "README.md",
				sourceUrl: role =>
					`${base}tree/${fixture.revision}/${project.sources[role]}`,
				fileCount: role =>
					Object.keys(fixture.files).filter(path =>
						path.startsWith(`${project.sources[role]}/`)
					).length,
				expectedFile: file,
				githubDirectoryListing: ({ url, role }) => {
					const prefix =
						"/repos/instruction-material/AI-Level-2/contents/";
					const directory = decodeURIComponent(
						url.pathname.slice(prefix.length)
					);
					const root = project.sources[role];
					const valid =
						url.pathname.startsWith(prefix) &&
						url.searchParams.get("ref") === fixture.revision &&
						(directory === root ||
							directory.startsWith(`${root}/`)) &&
						!directory
							.split("/")
							.some(part => ["", ".", ".."].includes(part));
					const entries = new Map();
					if (valid) {
						for (const [path, value] of Object.entries(
							fixture.files
						)) {
							if (!path.startsWith(`${directory}/`)) continue;
							const rest = path.slice(directory.length + 1);
							const name = rest.split("/")[0];
							const child = `${directory}/${name}`;
							entries.set(
								name,
								rest.includes("/")
									? {
											type: "dir",
											name,
											path: child,
											size: 0,
											sha: "",
											html_url: `${base}tree/${
												fixture.revision
											}/${child}`
										}
									: {
											type: "file",
											name,
											path: child,
											size: value.byteLength,
											sha: value.gitBlob,
											html_url: `${base}blob/${
												fixture.revision
											}/${child}`,
											download_url: `https://raw.githubusercontent.com/instruction-material/AI-Level-2/${
												fixture.revision
											}/${child}`
										}
							);
						}
					}
					return { valid, entries: [...entries.values()] };
				},

				githubRawFile: ({ url, role }) => {
					const prefix = `/instruction-material/AI-Level-2/${fixture.revision}/${project.sources[role]}/`;
					const relative = decodeURIComponent(
						url.pathname.slice(prefix.length)
					);
					const valid =
						url.pathname.startsWith(prefix) &&
						!relative
							.split("/")
							.some(part => ["", ".", ".."].includes(part));
					return {
						name: `${role}/${relative}`,
						file: valid
							? fixture.files[
									`${project.sources[role]}/${relative}`
								]
							: null
					};
				},
				beforeImport: async page => {
					const selector = `#${project.moduleId}-${
						project.itemId
					} .item-content-markdown`;
					await page.waitForFunction(
						value =>
							Boolean(
								document
									.querySelector(value)
									?.textContent.trim()
							),
						{ timeout: 15000 },
						selector
					);
					const expected = await page.evaluate(html => {
						const element = document.createElement("div");
						element.innerHTML = html;
						return element.textContent.replace(/\s+/g, " ").trim();
					}, new MarkdownIt().render(project.assignmentText));
					const actual = await page.$eval(selector, element => ({
						text: element.textContent.replace(/\s+/g, " ").trim(),
						overflow: element.scrollWidth > element.clientWidth + 1,
						clipped:
							Number.parseInt(
								getComputedStyle(element).webkitLineClamp,
								10
							) > 0
					}));
					assert.equal(actual.text, expected);
					assert.equal(actual.overflow, false);
					assert.equal(actual.clipped, false);
					return {
						completeAssignmentText: true,
						characters: actual.text.length
					};
				},
				editFiles: ["exercise.py", "README.md"],

				editContent: ({ filename, original, width }) =>
					filename === "exercise.py"
						? `${file("solution", "exercise.py").content.replaceAll(/\r\n?/g, "\n")}\nprint(${JSON.stringify(marker)})\n`
						: original +
							`\n# Independent library observation ${width}\n`,

				continuationIDs: [project.itemId],
				projectKey: role =>
					`${fixture.courseId}:${project.itemId}:${
						role === "starter" ? "starter" : "reference"
					}:ml-library-${project.project}-v1`,

				verifyRun: async page => {
					assert.equal(
						await page.$eval("button.run-control", element =>
							element.textContent.trim()
						),
						"Run instructions"
					);
					assert.ok(
						await page.$(
							"section[aria-label='Python execution workflow']"
						)
					);
					assert.equal(
						await page.$(
							".mobile-view-picker button[data-view='canvas']"
						),
						null
					);
					await page
						.locator("button.run-control:not([disabled])")
						.click();
					await page.waitForFunction(() =>
						document
							.querySelector(".output-panel")
							?.textContent.includes(
								"MPLBACKEND=Agg .venv/bin/python main.py"
							)
					);
					const output = await page.$eval(
						".output-panel",
						element => element.textContent
					);
					for (const token of [
						"Python 3.14",
						"--require-hashes",
						"exercise.py",
						"README.md"
					])
						assert.ok(output.includes(token));
					assert.doesNotMatch(
						output,
						/Starting Python|Running main\.py|Traceback/
					);
				},
				afterEdit: async (page, { readProject }) => {
					const saved = await readProject(value =>
						value.files.some(
							file =>
								file.name === "exercise.py" &&
								file.content.includes(marker)
						)
					);
					assert.ok(
						saved.files
							.find(file => file.name === "README.md")
							.content.includes("Independent library observation")
					);
					return {
						completedFittingFunctionSaved: true,
						completeREADMEKept: true,
						nativeInstructionsObserved: true,
						browserExecutionClaimed: false
					};
				},

				instructionTokens: ["--require-hashes"],
				starterToken: "",
				referenceToken: "",
				readyToken: ".venv/bin/python main.py",
				outputEnv: "ML_LIBRARY_BROWSER_DIR",
				outputSubdirectory: project.caseId,
				defaultOutput: "output/machine-learning-library-browser"
			});
		}
	);
}
