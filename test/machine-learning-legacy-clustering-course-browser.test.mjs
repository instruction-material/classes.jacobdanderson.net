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
			"./fixtures/machine-learning-legacy-clustering-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
const selected
	= process.env.ML_LEGACY_PROJECTS?.split(",").filter(Boolean) ?? [];
assert.ok(
	selected.every(key => fixture.projects.some(project => project.caseId === key))
);
const base = "https://github.com/instruction-material/AI-Level-2/";

for (const project of fixture.projects.filter(
	project => !selected.length || selected.includes(project.caseId)
)) {
	test(
		`ML ${
			project.caseId
		}: consent, full task, standalone inputs, charts and saved ZIPs`,
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
					courseProjectKey:
						`${fixture.courseId
						}:earlier-${
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
				pack: project.caseId,
				fixturePath: "./fixtures/machine-learning-legacy-clustering-sources.json",
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
				sourceUrl: role => `${base}tree/${fixture.revision}/${project.sources[role]}`,
				fileCount: role =>
					Object.keys(fixture.files).filter(path =>
						path.startsWith(`${project.sources[role]}/`)
					).length,
				expectedFile: file,
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
							fixture.sourceInventory
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
											html_url:
												`${base
												}tree/${
													fixture.revision
												}/${
													child}`
										}
									: {
											type: "file",
											name,
											path: child,
											size: value.byteLength,
											sha: value.gitBlob,
											html_url:
												`${base
												}blob/${
													fixture.revision
												}/${
													child}`,
											download_url:
												`https://raw.githubusercontent.com/instruction-material/AI-Level-2/${
													fixture.revision
												}/${
													child}`
										}
							);
						}
					}
					return { valid, entries: [...entries.values()] };
				},

				githubRawFile: ({ url, role }) => {
					const prefix = `/instruction-material/AI-Level-2/${fixture.revision}/${project.sources[role]}/`;
					const relative = decodeURIComponent(url.pathname.slice(prefix.length));
					const valid = url.pathname.startsWith(prefix) && !relative.split("/").some(part => ["", ".", ".."].includes(part));
					return { name: `${role}/${relative}`, file: valid ? fixture.files[`${project.sources[role]}/${relative}`] : null };
				},
				beforeImport: async (page) => {
					const selector
						= `#${
							project.moduleId
						}-${
							project.itemId
						} .item-content-markdown`;
					await page.waitForFunction(
						value => Boolean(document.querySelector(value)?.textContent.trim()),
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
					return {
						completeAssignmentText: true,
						characters: actual.text.length
					};
				},
				editFiles: ["main.py"],

				editContent: () => {
					const check = project.kind === "customer"
						? "\n_hand = fit_kmeans([[0], [2], [10], [12]], 2, initial=[[0], [10]], max_iter=1)\nassert _hand[\"centers\"] == [[1.0], [11.0]]\nassert abs(_hand[\"inertia\"] - 4) < 1e-9\n"
						: "\n_hand = fit_model([[0, 0], [2, 0], [10, 10], [12, 10]], 2, 7)\n_centers = _hand.named_steps[\"scale\"].inverse_transform(_hand.named_steps[\"cluster\"].cluster_centers_)\nassert sorted([list(map(lambda v: round(float(v), 8), row)) for row in _centers]) == [[1.0, 0.0], [11.0, 10.0]]\n";
					return `${file("solution", "main.py").content.replaceAll(/\r\n?/g, "\n") + check}\nprint(${JSON.stringify(marker)})\n`;
				},
				continuationIDs: [project.itemId],
				projectKey: role =>
					`${fixture.courseId
					}:${
						project.itemId
					}:${
						role === "starter" ? "starter" : "reference"}`,

				verifyRun: async (page, { role }) => {
					await page.locator("button.run-control:not([disabled])").click();
					const token = role === "starter" && project.exercise ? "NotImplementedError" : `"rows": ${project.rows}`;
					await page.waitForFunction(
						value => document.querySelector(".output-panel")?.textContent.includes(value),
						{ timeout: 120000 },
						token
					);
					await page.waitForSelector("button.run-control:not([disabled])");
					if (role === "starter" && project.exercise) {
						const output = await page.$eval(".output-panel", element => element.textContent);
						assert.ok(output.includes(project.exercise));
						await page.evaluate(() => {
							window.__mlInitialExerciseRan = true;
						});
					}
				},
				afterEdit: async (page, { readProject }) => {
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
					await page.waitForSelector("button.run-control:not([disabled])");
					const output = await page.$eval(
						".output-panel",
						element => element.textContent
					);
					assert.doesNotMatch(
						output,
						/Traceback|(?:Syntax|Runtime|Type|Name|Import)Error:/
					);

					if (await page.evaluate(() => window.innerWidth < 900)) {
						await page.locator(".mobile-view-picker button[data-view='canvas']").click();
					}
					const frameElement = await page.waitForSelector(".python-sandbox-host iframe", { visible: true });
					const frame = await frameElement.contentFrame();
					assert.ok(frame);
					await frame.waitForFunction(() => {
						const images = [...document.querySelectorAll(".artifact-card img")];
						return images.length === 2 && images.every(image => image.complete && image.naturalWidth > 100 && image.naturalHeight > 100);
					}, { timeout: 15000 });
					const saved = await readProject(value => value.files.some(row => row.name === "clustering-report.json"));
					const report = JSON.parse(saved.files.find(row => row.name === "clustering-report.json").content);
					assert.equal(report.rows, project.rows);
					assert.equal(report.runs.length, 6);
					assert.deepEqual([...new Set(report.runs.map(row => row.seed))].sort((a, b) => a - b), [7, 19, 31]);
					assert.ok(report.runs.every(row => Number.isFinite(row.inertia) && row.inertia >= 0));
					return {
						reportRows: report.rows,
						actualRunCount: report.runs.length,
						generatedTextFiles: ["clustering-report.json"],
						renderedChartCount: 2,
						numericalHandCheckExecuted: true,
						completedAlgorithmExecuted: true,
						initialExerciseErrorObserved: await page.evaluate(() => Boolean(window.__mlInitialExerciseRan)),
						nestedModuleEdited: false,
						output
					};
				},
				instructionTokens: [],
				starterToken: "",
				referenceToken: "",
				readyToken: "",
				outputEnv: "ML_LEGACY_BROWSER_DIR",
				outputSubdirectory: project.caseId,
				defaultOutput: "output/machine-learning-legacy-browser"
			});
		}
	);
}
