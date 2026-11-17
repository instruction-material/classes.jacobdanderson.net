import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Actual course imports and exported Python projects.
import { test } from "node:test";
import MarkdownIt from "markdown-it";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/machine-learning-neuron-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
const selected
	= process.env.ML_NEURON_PROJECTS?.split(",").filter(Boolean) ?? [];
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
		}: consent, full task, nested inputs, Python execution and saved ZIPs`,
		{ timeout: 600000 },
		async (t) => {
			const file = (role, name) =>
				fixture.files[`${project.sources[role]}/${name}`];
			const marker = `ML workflow verified: ${project.caseId}`;
			await runAssemblyCoreCourseWorkflow(t, {
				kind: project.caseId,
				previousProject: () => ({
					_id: `earlier-${project.caseId}`,
					title: "Earlier work",
					mode: "python",
					files: [
						{
							name: "main.py",
							content: "# earlier work\n",
							encoding: "text"
						}
					],
					activeFileName: "main.py",
					courseID: fixture.courseId,
					courseProjectKey: `${fixture.courseId}:earlier-${
						project.caseId
					}:starter`,
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				courseID: fixture.courseId,
				moduleID: project.moduleId,
				coreID: project.itemId,
				mode: "data",
				sourceRepository: fixture.repository,
				pack: project.folder,
				fixturePath: "./fixtures/machine-learning-neuron-sources.json",
				roles: ["starter", "solution"],
				sameTab: true,
				githubDirectory: true,
				allowPythonRuntime: true,
				nativeInstructions: false,
				flatFiles: true,
				sharedFiles: [],
				initialFile: "main.py",
				primaryFile: "main.py",
				taskFile: "README.md",
				sourceUrl: role =>
					`${base
					}tree/${
						fixture.revision
					}/${
						project.sources[role]}`,
				fileCount: role =>
					Object.keys(fixture.files).filter(path =>
						path.startsWith(`${project.sources[role]}/`)
					).length,
				expectedFile: file,
				githubRawFile: ({ url, role }) => {
					const prefix = `/instruction-material/AI-Level-2/${
						fixture.revision}/${project.sources[role]}/`;
					const name = decodeURIComponent(url.pathname.slice(prefix.length));
					const valid = url.pathname.startsWith(prefix)
						&& !name.split("/").some(part => ["", ".", ".."].includes(part));
					return {
						name,
						file: valid ? fixture.files[`${project.sources[role]}/${name}`] : null
					};
				},
				githubDirectoryListing: ({ url, role }) => {
					const prefix
						= "/repos/instruction-material/AI-Level-2/contents/";
					const directory = decodeURIComponent(
						url.pathname.slice(prefix.length)
					);
					const root = project.sources[role];
					const valid
						= url.pathname.startsWith(prefix)
							&& url.searchParams.get("ref") === fixture.revision
							&& (directory === root
								|| directory.startsWith(`${root}/`))
							&& !directory
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
				beforeImport: async (page, { role, width }) => {
					const selector = `#${project.moduleId}-${
						project.itemId
					} .item-content-markdown`;
					await page.waitForFunction(
						value =>
							Boolean(
								document
									.querySelector(value)
									?.textContent
									.trim()
							),
						{ timeout: 15000 },
						selector
					);
					const expected = await page.evaluate((html) => {
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
					const originalView = await page.$$eval(
						".lesson-view-toggle button",
						buttons =>
							buttons.findIndex(
								button =>
									button.getAttribute("aria-pressed")
									=== "true"
							) + 1
					);
					assert.ok(originalView > 0);
					await page
						.locator(".lesson-view-toggle button:nth-child(3)")
						.click();
					await page.waitForSelector(
						".lesson-view-toggle button:nth-child(3)[aria-pressed='true']"
					);
					const coreSelector
						= `#${
							project.moduleId
						}-${
							fixture.coreReading.itemId
						} .item-content-markdown`;
					await page.waitForSelector(coreSelector);
					await page.$eval(coreSelector, element =>
						element.scrollIntoView({ block: "start" }));
					const expectedCore = await page.evaluate((html) => {
						const element = document.createElement("div");
						element.innerHTML = html;
						return element.textContent.replace(/\s+/g, " ").trim();
					}, new MarkdownIt().render(fixture.coreReading.content));
					await page.waitForFunction(
						({ selector, expected }) =>
							document
								.querySelector(selector)
								?.textContent
								.replace(/\s+/g, " ")
								.trim() === expected,
						{},
						{ selector: coreSelector, expected: expectedCore }
					);
					const actualCore = await page.$eval(
						coreSelector,
						element => ({
							text: element.textContent
								.replace(/\s+/g, " ")
								.trim(),
							overflow:
								element.scrollWidth > element.clientWidth + 1
						})
					);
					assert.equal(actualCore.text, expectedCore);
					assert.equal(actualCore.overflow, false);
					const screenshots = join(
						process.env.ML_NEURON_BROWSER_DIR
						?? "output/machine-learning-neuron-browser",
						project.caseId
					);
					mkdirSync(screenshots, { recursive: true });
					await page.screenshot({
						path: join(
							screenshots,
							`core-${role}-${width}-top.png`
						)
					});
					await page.$eval(coreSelector, element =>
						element.lastElementChild.scrollIntoView({
							block: "end"
						}));
					await page.screenshot({
						path: join(
							screenshots,
							`core-${role}-${width}-bottom.png`
						)
					});
					await page
						.locator(
							`.lesson-view-toggle button:nth-child(${
								originalView
							})`
						)
						.click();
					await page.waitForSelector(
						`.lesson-view-toggle button:nth-child(${
							originalView
						})[aria-pressed='true']`
					);
					await page.waitForSelector(selector);
					return {
						completeAssignmentText: true,
						completeCoreReadingText: true,
						characters: actual.text.length
					};
				},
				editFiles: project.multipleModules
					? ["main.py", "model.py"]
					: ["main.py"],
				editContent: ({ filename }) =>
					file("solution", filename).content.replaceAll(
						/\r\n?/g,
						"\n"
					)
					+ (filename === "main.py"
						? `\nprint(${JSON.stringify(marker)})\n`
						: "\n# Saved ML model edit\n"),
				continuationIDs: [project.itemId],
				projectKey: role =>
					`${fixture.courseId}:${project.itemId}:${
						role === "starter" ? "starter" : "reference"
					}`,
				verifyRun: async (page, { role }) => {
					if (role !== "starter") return;
					await page
						.locator("button.run-control:not([disabled])")
						.click();
					await page.waitForFunction(
						() =>
							document
								.querySelector(".output-panel")
								?.textContent
								.includes("NotImplementedError"),
						{ timeout: 90000 }
					);
					await page.waitForSelector(
						"button.run-control:not([disabled])"
					);
					await page.evaluate(() => {
						window.__mlInitialExerciseRan = true;
					});
				},
				afterEdit: async (page) => {
					await page.select(
						"select[aria-label='Active project file']",
						"main.py"
					);
					await page
						.locator("button.run-control:not([disabled])")
						.click();
					await page.waitForFunction(
						value =>
							document
								.querySelector(".output-panel")
								?.textContent
								.includes(value),
						{ timeout: 90000 },
						marker
					);
					const output = await page.$eval(
						".output-panel",
						element => element.textContent
					);
					assert.doesNotMatch(
						output,
						/Traceback|(?:Syntax|Runtime|Type|Name|Import)Error:/
					);
					return {
						completedAlgorithmExecuted: true,
						initialExerciseErrorObserved: await page.evaluate(() =>
							Boolean(window.__mlInitialExerciseRan)
						),
						nestedModuleEdited: project.multipleModules,
						output
					};
				},
				instructionTokens: [],
				starterToken: "",
				referenceToken: "",
				readyToken: "",
				outputEnv: "ML_NEURON_BROWSER_DIR",
				outputSubdirectory: project.caseId,
				defaultOutput: "output/machine-learning-neuron-browser"
			});
		}
	);
}
