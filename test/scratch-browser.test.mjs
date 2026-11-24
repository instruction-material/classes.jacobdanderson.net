import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
// This browser workflow runs in the native CI test runner, outside Vitest.
// eslint-disable-next-line test/no-import-node-test -- Native CI workflow.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import {
	createProject,
	generateProjects,
	lessons
} from "../front-end/scripts/scratch/generate-projects.mjs";
import { checkScratchCheckpointTasks } from "./scratch-checkpoint-task-check.mjs";
import { checkClassroomRemixes } from "./scratch-classroom-remix-vm-checks.mjs";
import { checkScratchConceptReadings } from "./scratch-concept-reading-check.mjs";
import { checkScratchConditionalCourse, scratchCourseAccount } from "./scratch-conditional-course-checks.mjs";
import { checkScratchEducationalQuiz } from "./scratch-educational-quiz-checks.mjs";
import { checkScratchGameProgression } from "./scratch-game-progression-checks.mjs";
import { checkScratchCoordinateReading, checkScratchEventReading, checkScratchOriginalImports } from "./scratch-original-import-checks.mjs";
import { checkScratchPublishedTasks } from "./scratch-published-task-check.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
nodeTest(
	process.env.SCRATCH_BROWSER_READING_ONLY === "1" ? "scratch course readings work in both roles and screen sizes" : "scratch imports classroom projects, runs events and exports reusable files in isolation",
	{ timeout: 900000 },
	async () => {
		let server, browser;
		const previous = process.cwd();
		const files = await mkdtemp(
			path.join(tmpdir(), "classes-scratch-browser-")
		);
		try {
			process.chdir(root);
			const headerMaps = await readFile(
				new URL(
					"../deploy/native/classes-http-maps.conf",
					import.meta.url
				),
				"utf8"
			);
			const productionCsp = headerMaps
				.split("\n")
				.find(line => line.includes("(?:ide|python-ide|bluej)"))
				?.split("\"")[1];
			assert.ok(productionCsp);
			server = await createServer({
				root,
				// Course lessons load Markdown after the standalone editor checks.
				// Optimize it up front so discovery cannot invalidate an open page.
				optimizeDeps: { include: ["markdown-it"] },
				plugins: [
					{
						name: "production-ide-policy-fixture",
						configureServer(server) {
							server.middlewares.use(
								(request, response, next) => {
									if (request.url?.startsWith("/ide?")) {
										response.setHeader(
											"Content-Security-Policy",
											productionCsp
										);
									}
									next();
								}
							);
						}
					}
				],
				server: { host: "127.0.0.1", port: 5198, strictPort: true, watch: null }
			});
			await server.listen();
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome"
			].find(p => p && existsSync(p));
			browser = await puppeteer.launch({
				executablePath,
				headless: true
			});
			const page = await browser.newPage();
			await page.setViewport({ width: 1440, height: 1080 });
			const errors = [];
			const scopeFailures = [];
			page.on("pageerror", error => errors.push(error.message));
			async function verifyScope(scope, verify) {
				try {
					await verify();
				}
				catch (error) {
					const output = process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR || process.env.SCRATCH_SCREENSHOT_DIR || files;
					await mkdir(output, { recursive: true });
					const failure = { scope, error: String(error), stack: error.stack, url: page.url(), viewport: page.viewport(), pageErrors: [...errors] };
					scopeFailures.push(failure);
					const state = await page.evaluate(() => ({ headings: [...document.querySelectorAll("h5")].map(heading => heading.textContent), lessons: [...document.querySelectorAll(".lesson-item")].map(item => ({ title: item.querySelector("h5")?.textContent, markdown: [...item.querySelectorAll(".item-content-markdown")].map(section => section.textContent.slice(0, 300)) })) })).catch(() => null);
					await writeFile(path.join(output, `${scope}-failure.json`), `${JSON.stringify({ ...failure, state }, null, 2)}\n`);
					await page.screenshot({ path: path.join(output, `${scope}-failure.png`) }).catch(() => {});
				}
			}
			let acceptDialogs = true;
			page.on("dialog", dialog => acceptDialogs ? dialog.accept() : dialog.dismiss());
			const adapter = await readFile(new URL("../front-end/public/scratch-runtime/editor.js", import.meta.url), "utf8");
			assert.equal(adapter.split("vm = value;").length, 2);
			const observedAdapter = adapter.replace("vm = value;", "vm = value; window.__courseTestVm = vm;");
			await page.setRequestInterception(true);
			let courseRole = null;
			page.on("request", (request) => {
				if (new URL(request.url()).pathname === "/scratch-runtime/editor.js") {
					void request.respond({ status: 200, contentType: "application/javascript", headers: { "Access-Control-Allow-Origin": "*" }, body: observedAdapter });
				}
				else if (new URL(request.url()).pathname.startsWith("/api/")) {
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: JSON.stringify(scratchCourseAccount(new URL(request.url()).pathname, courseRole))
					});
				}
				else {
					void request.continue();
				}
			});
			if (process.env.SCRATCH_BROWSER_READING_ONLY === "1") {
				const readingOptions = { origin: "http://127.0.0.1:5198", files, setRole: (role) => {
					courseRole = role;
				} };
				await verifyScope("event-reading", () => checkScratchEventReading(page, readingOptions));
				await verifyScope("coordinate-reading", () => checkScratchCoordinateReading(page, readingOptions));
				await verifyScope("concept-readings", () => checkScratchConceptReadings(page, readingOptions));
				await verifyScope("published-tasks", () => checkScratchPublishedTasks(page, readingOptions));
				await verifyScope("checkpoint-tasks", () => checkScratchCheckpointTasks(page, readingOptions));
				assert.deepEqual(scopeFailures, [], "Every requested Scratch reading scope must pass");
				assert.deepEqual(errors, []);
				return;
			}
			const client = await page.createCDPSession();
			await client.send("Browser.setDownloadBehavior", {
				behavior: "allow",
				downloadPath: files,
				eventsEnabled: true
			});
			async function downloadProject(filename) {
				// File creation and the page's status precede Chrome's final write.
				// Wait for the matching browser download to finish before reading it.
				let guid, timer;
				let began, progressed;
				const completed = new Promise((resolve, reject) => {
					began = (event) => {
						if (event.suggestedFilename === filename) guid = event.guid;
					};
					progressed = (event) => {
						if (event.guid !== guid) return;
						if (event.state === "completed") resolve();
						if (event.state === "canceled")
							reject(new Error(`Download canceled: ${filename}`));
					};
					client.on("Browser.downloadWillBegin", began);
					client.on("Browser.downloadProgress", progressed);
					timer = setTimeout(() =>
						reject(new Error(`Download did not finish: ${filename}`)), 20000);
				});
				try {
					await Promise.all([
						completed,
						page.locator("::-p-text(Download project)").click()
					]);
				}
				finally {
					clearTimeout(timer);
					client.off("Browser.downloadWillBegin", began);
					client.off("Browser.downloadProgress", progressed);
				}
			}
			await page.goto(
				"http://127.0.0.1:5198/ide?mode=scratch&starter=two-arrows",
				{ waitUntil: "networkidle2" }
			);
			const loaded = () =>
				page.waitForFunction(
					() =>
						document
							.querySelector(".scratch-status[role=status]")
							?.textContent
							.includes("Project open"),
					{ timeout: 20000 }
				);
			await loaded();
			async function setProjectMenuOpen(open) {
				if (
					(await page.$eval(
						".scratch-project-menu > .workspace-disclosure__trigger",
						menu => menu.getAttribute("aria-expanded") === "true"
					)) !== open
				) {
					await page.click(".scratch-project-menu > .workspace-disclosure__trigger");
				}
				await page.waitForFunction(
					open =>
						(document.querySelector(".scratch-project-menu > .workspace-disclosure__trigger")
							?.getAttribute("aria-expanded") === "true") === open,
					{},
					open
				);
			}
			async function selectStarter(id) {
				await setProjectMenuOpen(true);
				await page.select(".scratch-starters select", id);
				await page.locator(".scratch-starters button").click();
				await loaded();
				await setProjectMenuOpen(false);
			}
			const frame = page.frames().find(f => f !== page.mainFrame());
			assert.equal(
				await page.$eval(".scratch-workspace iframe", e =>
					e.getAttribute("sandbox")),
				"allow-scripts allow-downloads"
			);
			assert.equal(
				await frame.evaluate(() => {
					try {
						void parent.document.body;
						return false;
					}
					catch {
						return true;
					}
				}),
				true
			);
			const stageSelector = "[class*=\"stage_stage_\"] > div > canvas";
			// Enter directly from the host, without priming focus in a child
			// input. Scratch cancels the stage's native mouse focus transfer.
			await page.focus(".scratch-toolbar input[maxlength=\"120\"]");
			await frame.click(stageSelector);
			await page.keyboard.press("ArrowRight");
			await frame.waitForFunction(
				() =>
					document.querySelector("input[placeholder=\"x\"]")?.value
					=== "10"
			);
			assert.equal(
				await page.evaluate(() => document.activeElement.tagName),
				"IFRAME"
			);
			// Editor fields must retain their own arrow-key behavior.
			await frame.click("input[placeholder=\"x\"]");
			await page.keyboard.press("ArrowRight");
			assert.equal(
				await frame.$eval(
					"input[placeholder=\"x\"]",
					input => input.value
				),
				"10"
			);
			// Returning after a host-toolbar action must work repeatedly.
			await page.focus(".scratch-toolbar input[maxlength=\"120\"]");
			await frame.click(stageSelector);
			await page.keyboard.press("ArrowRight");
			await frame.waitForFunction(
				() =>
					document.querySelector("input[placeholder=\"x\"]")?.value
					=== "20"
			);
			// Green flag entry also leaves keyboard events in the editor.
			await page.focus(".scratch-toolbar input[maxlength=\"120\"]");
			await frame.locator("[title=\"Go\"]").click();
			await page.keyboard.press("ArrowLeft");
			await frame.waitForFunction(
				() =>
					document.querySelector("input[placeholder=\"x\"]")?.value
					=== "10"
			);
			// Editing a sprite position is unsaved student work; cancelling
			// replacement must preserve it.
			await frame.locator("input[placeholder=\"x\"]").fill("20");
			await page.keyboard.press("Enter");
			await frame.click("canvas");
			await page.waitForFunction(() =>
				document
					.querySelector(".scratch-status[role=status]")
					?.textContent
					.includes("Unsaved changes")
			);
			await setProjectMenuOpen(true);
			page.removeAllListeners("dialog");
			const cancelledReplacement = new Promise(resolve =>
				page.once("dialog", async (dialog) => {
					await dialog.dismiss();
					resolve();
				})
			);
			await page.locator("::-p-text(New project)").click();
			await cancelledReplacement;
			assert.equal(
				await page.$eval(
					".scratch-starters select",
					select => select.value
				),
				"two-arrows"
			);
			assert.equal(
				await frame.$eval(
					"input[placeholder=\"x\"]",
					input => input.value
				),
				"20"
			);
			await setProjectMenuOpen(false);
			page.on("dialog", dialog => acceptDialogs ? dialog.accept() : dialog.dismiss());
			await downloadProject("Two Arrows.sb3");
			await page.waitForFunction(() =>
				document
					.querySelector(".scratch-status[role=status]")
					?.textContent
					.includes("Downloaded")
			);
			const exported = path.join(files, "Two Arrows.sb3");
			const project = JSON.parse(
				strFromU8(
					unzipSync(new Uint8Array(await readFile(exported)))[
						"project.json"
					]
				)
			);
			assert.equal(project.targets.find(t => t.name === "Player").x, 20);
			// The official editor validator, not just our own schema checks, opens
			// every starter and every teacher reference completion.
			await setProjectMenuOpen(true);
			for (const lesson of lessons) {
				for (const solution of [false, true]) {
					const filename = path.join(
						files,
						`${lesson.id}${solution ? "-solution" : ""}.sb3`
					);
					await writeFile(
						filename,
						createProject(lesson.id, solution).archive
					);
					await (
						await page.$(".file-control input")
					).uploadFile(filename);
					await loaded();
				}
			}
			await setProjectMenuOpen(false);
			const teachers = path.join(files, "teacher-solutions");
			await generateProjects(path.join(files, "starters"), teachers);
			await checkClassroomRemixes(frame, teachers);
			await checkScratchGameProgression(page, frame, files, async (filename) => {
				await setProjectMenuOpen(true);
				await (await page.$(".file-control input")).uploadFile(filename);
				await loaded();
				await setProjectMenuOpen(false);
			});
			// September 30 first lesson: sprite clicks are local, size changes
			// accumulate, and the documented green-flag reset restores the scene.
			await selectStarter("animate-word");
			const stageCanvas = await frame.$("canvas");
			const stageBox = await stageCanvas.boundingBox();
			assert.ok(stageBox);
			const clickLetterE = () =>
				page.mouse.click(
					stageBox.x + stageBox.width * (0.5 + 135 / 480),
					stageBox.y + stageBox.height / 2
				);
			const nameFile = path.join(files, "Animate Your Name.sb3");
			async function exportName() {
				await rm(nameFile, { force: true });
				await downloadProject("Animate Your Name.sb3");
				return JSON.parse(
					strFromU8(
						unzipSync(new Uint8Array(await readFile(nameFile)))[
							"project.json"
						]
					)
				);
			}
			await clickLetterE();
			await new Promise(resolve => setTimeout(resolve, 250));
			let nameProject = await exportName();
			assert.equal(
				nameProject.targets.find(target => target.name === "E").size,
				80
			);
			assert.equal(
				nameProject.targets.find(target => target.name === "C").size,
				70
			);
			assert.equal(
				nameProject.targets.find(target => target.isStage)
					.currentCostume,
				1
			);
			await clickLetterE();
			await new Promise(resolve => setTimeout(resolve, 250));
			nameProject = await exportName();
			assert.equal(
				nameProject.targets.find(target => target.name === "E").size,
				90
			);
			await frame.locator("[title=\"Go\"]").click();
			await new Promise(resolve => setTimeout(resolve, 250));
			nameProject = await exportName();
			assert.equal(
				nameProject.targets.find(target => target.name === "E").size,
				70
			);
			assert.equal(
				nameProject.targets.find(target => target.isStage)
					.currentCostume,
				0
			);
			await selectStarter("dress-up");
			// Independent work opens a fresh workspace through the host, even
			// though the embedded upstream New menu is intentionally disabled.
			await setProjectMenuOpen(true);
			await page.locator("::-p-text(New project)").click();
			await loaded();
			await setProjectMenuOpen(false);
			const blankFile = path.join(files, "Independent Mini-Game.sb3");
			await downloadProject("Independent Mini-Game.sb3");
			const blankProject = JSON.parse(
				strFromU8(
					unzipSync(new Uint8Array(await readFile(blankFile)))[
						"project.json"
					]
				)
			);
			assert.equal(blankProject.targets.length, 2);
			for (const target of blankProject.targets)
				assert.deepEqual(target.blocks, {});
			await setProjectMenuOpen(true);
			await (await page.$(".file-control input")).uploadFile(blankFile);
			await loaded();
			await setProjectMenuOpen(false);
			// The course's direct launch opens the same code-free project.
			await page.goto(
				"http://127.0.0.1:5198/ide?mode=scratch&starter=blank",
				{ waitUntil: "networkidle2" }
			);
			await loaded();
			assert.equal(
				await page.$eval(
					".scratch-toolbar input",
					input => input.value
				),
				"Independent Mini-Game"
			);
			const blankFrame = page.frames().find(f => f !== page.mainFrame());
			await blankFrame.locator("::-p-text(Costumes)").click();
			await blankFrame.waitForSelector("canvas");
			await page.screenshot({
				path: "/tmp/scratch-classroom-editor.png"
			});
			await verifyScope("event-reading", () => checkScratchEventReading(page, {
				origin: "http://127.0.0.1:5198",
				files,
				setRole: (role) => {
					courseRole = role;
				}
			}));
			await verifyScope("coordinate-reading", () => checkScratchCoordinateReading(page, {
				origin: "http://127.0.0.1:5198",
				files,
				setRole: (role) => {
					courseRole = role;
				}
			}));
			await verifyScope("concept-readings", () => checkScratchConceptReadings(page, {
				origin: "http://127.0.0.1:5198",
				files,
				setRole: (role) => {
					courseRole = role;
				}
			}));
			await verifyScope("published-tasks", () => checkScratchPublishedTasks(page, {
				origin: "http://127.0.0.1:5198",
				files,
				setRole: (role) => {
					courseRole = role;
				}
			}));
			await verifyScope("checkpoint-tasks", () => checkScratchCheckpointTasks(page, { origin: "http://127.0.0.1:5198", files, setRole: (role) => {
				courseRole = role;
			} }));
			await verifyScope("originals", () => checkScratchOriginalImports(page, {
				origin: "http://127.0.0.1:5198",
				files,
				loaded,
				downloadProject,
				openFile: async (filename) => {
					await setProjectMenuOpen(true);
					await (await page.$(".file-control input")).uploadFile(filename);
					await loaded();
					await setProjectMenuOpen(false);
				},
				newProject: async () => {
					await setProjectMenuOpen(true);
					await page.locator("::-p-text(New project)").click();
					await loaded();
					await setProjectMenuOpen(false);
				},
				setRole: (role) => {
					courseRole = role;
				},
				acceptDialogs: (value) => { acceptDialogs = value; }
			}));
			await verifyScope("conditional-course", () => checkScratchConditionalCourse(page, "http://127.0.0.1:5198", (role) => {
				courseRole = role;
			}));
			await verifyScope("quiz", () => checkScratchEducationalQuiz(page, "http://127.0.0.1:5198", files, loaded, async (filename) => {
				await setProjectMenuOpen(true);
				await (await page.$(".file-control input")).uploadFile(filename);
				await loaded();
				await setProjectMenuOpen(false);
			}));

			assert.deepEqual(scopeFailures, [], "Every Scratch browser scope must pass");
			assert.deepEqual(errors, []);
		}
		finally {
			await browser?.close();
			await server?.close();
			process.chdir(previous);
			await rm(files, { recursive: true, force: true });
		}
	}
);
