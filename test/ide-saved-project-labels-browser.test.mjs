import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
// This browser workflow uses the native CI test runner, outside Vitest.
// eslint-disable-next-line test/no-import-node-test -- Exercise real browser selection and deletion.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { openProjectSidebar } from "./ide-workspace-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "ide-saved-project-labels";
const storeKey = "classes-python-ide-projects:anonymous";
const fixtures = [
	["cpp-learner", "cpp", "starter", "Learner · C++"],
	["cpp-reference", "cpp", "reference", "Reference · C++"],
	["java-learner", "java", "starter:native-java", "Learner · Java"],
	["java-reference", "java", "reference:native-java", "Reference · Java"]
].map(([id, mode, role, subtitle]) => ({
	subtitle,
	project: {
		_id: `local-${id}`,
		title: "Saved comparison",
		mode,
		courseID: "usaco-silver",
		courseProjectKey: `usaco-silver:gifts:${role}`,
		files: [
			{
				name: mode === "cpp" ? "main.cpp" : "Main.java",
				content: `// Preserved ${id} edits\n`
			}
		],
		activeFileName: mode === "cpp" ? "main.cpp" : "Main.java",
		createdAt: "2026-10-01T12:00:00.000Z",
		updatedAt: "2026-10-02T12:00:00.000Z"
	}
}));
fixtures.push({
	subtitle: "Python",
	project: {
		_id: "local-ordinary",
		title: "Reference practice",
		mode: "python",
		files: [{ name: "main.py", content: "# Ordinary saved notes\n" }],
		activeFileName: "main.py",
		createdAt: "2026-10-01T12:00:00.000Z",
		updatedAt: "2026-10-02T12:00:00.000Z"
	}
});

function record(event, fields = {}) {
	console.log(
		JSON.stringify({
			event,
			parentTaskId: taskId,
			cwd: root,
			pid: process.pid,
			time: new Date().toISOString(),
			...fields
		})
	);
}

function selectionLabel(fixture) {
	return `${fixture.project.title} (${fixture.subtitle})`;
}

test(
	"saved project roles remain distinguishable during selection, rename and deletion",
	{ timeout: 120000 },
	async () => {
		let browser;
		let server;
		let exitCode = 0;
		const previousDirectory = process.cwd();
		try {
			process.chdir(root);
			record("start", {
				command: "ide-saved-project-labels-browser",
				timeoutMs: 120000
			});
			assert.ok(
				existsSync(join(root, "dist/index.html")),
				"Build this exact front end before the browser check"
			);
			server = await preview({
				root,
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(value => value && existsSync(value));
			assert.ok(executablePath, "Chrome is required");
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			for (const width of [1280, 390]) {
				for (const theme of ["light", "dark"]) {
					const context = await browser.createBrowserContext();
					try {
						const page = await context.newPage();
						await page.setViewport({ width, height: 900 });
						await page.emulateMediaFeatures([
							{ name: "prefers-reduced-motion", value: "reduce" }
						]);
						let sourceRequests = 0;
						let remoteWrites = 0;
						await page.setRequestInterception(true);
						page.on("request", (request) => {
							const url = new URL(request.url());
							if (
								url.hostname === "api.github.com"
								|| url.hostname === "raw.githubusercontent.com"
							) {
								sourceRequests++;
							}
							if (
								url.origin !== origin
								|| url.pathname.startsWith("/api/")
							) {
								if (
									!["GET", "OPTIONS"].includes(
										request.method()
									)
								) {
									remoteWrites++;
								}
								void request.respond({
									status: 200,
									contentType: "application/json",
									body: "{}"
								});
							}
							else if (
								url.pathname.endsWith("/assets/manifest.json")
							) {
								void request.respond({
									status: 200,
									contentType: "application/json",
									body: "{\"assets\":[]}"
								});
							}
							else {
								void request.continue();
							}
						});
						await page.evaluateOnNewDocument(
							(key, projects) => {
								if (
									window === window.top
									&& localStorage.getItem(key) === null
								) {
									localStorage.setItem(
										key,
										JSON.stringify(projects)
									);
								}
							},
							storeKey,
							fixtures.map(fixture => fixture.project)
						);
						await page.goto(`${origin}/ide`, {
							waitUntil: "networkidle2"
						});
						await openProjectSidebar(page);
						await page.evaluate(
							theme =>
								document.documentElement.classList.toggle(
									"dark",
									theme === "dark"
								),
							theme
						);
						const ax = await page.createCDPSession();
						try {
							const { nodes } = await ax.send(
								"Accessibility.getFullAXTree"
							);
							const names = nodes
								.filter(node => node.role?.value === "button")
								.map(node => node.name?.value);
							for (const fixture of fixtures) {
								const name = selectionLabel(fixture);
								assert.ok(
									names.includes(name),
									`Accessible selection: ${name}`
								);
								assert.ok(
									names.includes(`Delete project ${name}`),
									`Accessible deletion: ${name}`
								);
								const row = await page.$(
									`.project-button[aria-label="${name}"]`
								);
								assert.ok(row);
								assert.equal(
									await row.$eval(
										"span",
										span => span.textContent
									),
									fixture.project.title
								);
								assert.equal(
									await row.$eval(
										"small",
										small => small.textContent
									),
									fixture.subtitle
								);
							}
						}
						finally {
							await ax.detach();
						}
						const initial = await page.evaluate(
							key => JSON.parse(localStorage.getItem(key)),
							storeKey
						);
						for (const { project } of fixtures) {
							const saved = initial.find(
								item => item._id === project._id
							);
							for (const key of [
								"title",
								"mode",
								"courseID",
								"courseProjectKey",
								"createdAt",
								"updatedAt",
								"files"
							]) {
								assert.deepEqual(
									saved[key],
									project[key],
									`Displaying labels preserves ${key}`
								);
							}
						}
						const directory = process.env
							.COURSE_IMPORT_SCREENSHOT_DIR
							? join(
									previousDirectory,
									process.env.COURSE_IMPORT_SCREENSHOT_DIR
								)
							: null;
						if (directory) {
							await mkdir(directory, { recursive: true });
							await (
								await page.$(".project-list")
							).screenshot({
								path: join(
									directory,
									`course-import-usaco-project-labels-${width}-${theme}-sidebar.png`
								)
							});
						}
						for (const fixture of fixtures.slice(0, 4)) {
							await openProjectSidebar(page);
							await page
								.locator(
									`.project-button[aria-label="${selectionLabel(fixture)}"]`
								)
								.click();
							await page.waitForFunction(
								marker =>
									document
										.querySelector(".cm-content")
										?.textContent
										.includes(marker),
								{},
								`Preserved ${fixture.project._id.slice(6)} edits`
							);
						}
						// Rename the learner while the reference keeps its original name.
						await openProjectSidebar(page);
						await page
							.locator(
								`.project-button[aria-label="${selectionLabel(fixtures[2])}"]`
							)
							.click();
						await page.waitForFunction(
							name => document.querySelector(".project-button.is-active")?.getAttribute("aria-label") === name,
							{},
							selectionLabel(fixtures[2])
						);
						await page.click("button[aria-label='IDE settings']");
						await page.waitForSelector("#code-ide-project-title");
						await page.$eval("#code-ide-project-title", (input) => {
							input.value = "Renamed learner";
							input.dispatchEvent(
								new Event("input", { bubbles: true })
							);
						});
						await page.click("button[aria-label='IDE settings']");
						await openProjectSidebar(page);
						await page.waitForSelector(
							".project-button[aria-label=\"Renamed learner (Learner · Java)\"]"
						);
						await page.waitForFunction(
							key =>
								JSON.parse(localStorage.getItem(key)).some(
									project =>
										project._id === "local-java-learner"
										&& project.title === "Renamed learner"
								),
							{},
							storeKey
						);
						const beforeDelete = await page.evaluate(
							key => JSON.parse(localStorage.getItem(key)),
							storeKey
						);
						const renamed = beforeDelete.find(
							project => project._id === "local-java-learner"
						);
						assert.deepEqual(
							renamed.files,
							fixtures[2].project.files
						);
						assert.equal(
							renamed.courseProjectKey,
							fixtures[2].project.courseProjectKey
						);
						const name = selectionLabel(fixtures[3]);
						await page
							.locator(
								`button[aria-label="Delete project ${name}"]`
							)
							.click();
						await page.waitForSelector(".project-delete-confirm");
						assert.equal(
							await page.$eval(
								".project-delete-confirm strong",
								element => element.textContent.trim()
							),
							`Delete "${name}"?`
						);
						const confirmInput = `input[aria-label="Type confirm to delete project ${name}"]`;
						assert.ok(await page.$(confirmInput));
						assert.equal(
							await page.$eval(
								".project-delete-final",
								button => button.disabled
							),
							true
						);
						await page.type(confirmInput, "wrong");
						assert.equal(
							await page.$eval(
								".project-delete-final",
								button => button.disabled
							),
							true
						);
						if (directory) {
							await (
								await page.$(".project-row.is-confirming")
							).screenshot({
								path: join(
									directory,
									`course-import-usaco-project-labels-${width}-${theme}-delete.png`
								)
							});
						}
						await page.click(
							`button[aria-label="Cancel deletion of ${name}"]`
						);
						assert.equal(
							await page.$(".project-delete-confirm"),
							null
						);
						await page
							.locator(
								`button[aria-label="Delete project ${name}"]`
							)
							.click();
						await page.type(confirmInput, "confirm");
						await page
							.locator(
								`button[aria-label="Confirm delete project ${name}"]:not([disabled])`
							)
							.click();
						await page.waitForFunction(
							key =>
								!JSON.parse(localStorage.getItem(key)).some(
									project =>
										project._id === "local-java-reference"
								),
							{},
							storeKey
						);
						const afterDelete = await page.evaluate(
							key => JSON.parse(localStorage.getItem(key)),
							storeKey
						);
						assert.deepEqual(
							afterDelete,
							beforeDelete.filter(
								project =>
									project._id !== "local-java-reference"
							),
							"Only the confirmed project is removed"
						);
						assert.equal(
							sourceRequests,
							0,
							"Saved selection and rename never fetch a starter"
						);
						assert.equal(
							remoteWrites,
							0,
							"The anonymous workflow never writes to a remote account"
						);
						record("verified-saved-project-labels", {
							width,
							theme,
							labeledProjects: fixtures.length,
							accessibleSelections: fixtures.length,
							matchingNames: 4,
							renamedRolePreserved: true,
							onlyConfirmedProjectDeleted: true,
							otherSavedWorkUnchanged: true,
							sourceRequests,
							remoteWrites
						});
					}
					finally {
						await context.close();
					}
				}
			}
		}
		catch (error) {
			exitCode = 1;
			throw error;
		}
		finally {
			await browser?.close();
			await server?.close();
			process.chdir(previousDirectory);
			record("end", { exitCode, browserAndServerClosed: true });
		}
	}
);
