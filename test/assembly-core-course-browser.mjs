import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import {
	confirmProjectImport,
	downloadProjectZip
} from "./ide-workspace-controls.mjs";

export async function runAssemblyCoreCourseWorkflow(t, definition) {
	const root = fileURLToPath(new URL("../front-end/", import.meta.url));
	const fixture = JSON.parse(
		await readFile(new URL(definition.fixturePath, import.meta.url), "utf8")
	);
	const storageKey = "classes-python-ide-projects:anonymous";
	const moduleID = definition.moduleID;
	const coreID = definition.coreID;
	const courseID = definition.courseID ?? "assembly";
	const mode = definition.mode ?? "assembly";
	const sourceRepository = definition.sourceRepository ?? "Assembly";
	const primaryFile = definition.primaryFile ?? "routine.S";
	const taskFile = definition.taskFile ?? "trace.md";
	const initialFile = definition.initialFile ?? primaryFile;
	const digest = value => createHash("sha256").update(value).digest("hex");
	async function savedProjects(page) {
		return page.evaluate(
			key =>
				new Promise((resolve, reject) => {
					const opening = indexedDB.open("classes-python-ide", 1);
					opening.onupgradeneeded = () => {
						opening.transaction.abort();
						reject(
							new Error(
								"Primary project store is not initialized"
							)
						);
					};
					opening.onerror = () => reject(opening.error);
					opening.onsuccess = () => {
						const database = opening.result;
						const transaction = database.transaction(
							"projectStores",
							"readonly"
						);
						const request = transaction
							.objectStore("projectStores")
							.get(key);
						let projects;
						request.onsuccess = () => {
							projects = request.result?.projects;
						};
						transaction.oncomplete = () => {
							database.close();
							resolve(Array.isArray(projects) ? projects : []);
						};
						transaction.onerror = transaction.onabort = () => {
							database.close();
							reject(
								transaction.error ??
									new Error("Primary store read failed")
							);
						};
					};
				}),
			storageKey
		);
	}

	async function action(page, origin, itemID, role) {
		await page.goto(`${origin}/courses#${moduleID}`, {
			waitUntil: "domcontentloaded"
		});
		await page.waitForSelector(".lesson-view-toggle button");
		const card = `#${moduleID}-${itemID}`;
		for (const position of [1, 2, 3]) {
			const toggle = `.lesson-view-toggle button:nth-child(${position})`;
			await page.locator(toggle).click();
			await page.waitForSelector(`${toggle}[aria-pressed='true']`);
			if (!(await page.$(card))) continue;
			const href = await page.$eval(
				card,
				(element, role) =>
					[...element.querySelectorAll("a.is-ide-starter")]
						.find(link =>
							new URL(link.href).searchParams
								.get("starterUrl")
								?.endsWith(`/${role}`)
						)
						?.getAttribute("href"),
				role
			);
			if (href) {
				return {
					href,
					selector: `${card} a.is-ide-starter[href=${JSON.stringify(href)}]`
				};
			}
		}
		assert.fail(`Missing ${role} course action for ${itemID}`);
	}
	async function project(page, key, predicate = () => true) {
		const deadline = Date.now() + 10000;
		while (Date.now() < deadline) {
			const saved = (await savedProjects(page)).find(
				p => p.courseProjectKey === key
			);
			if (saved && predicate(saved)) return saved;
			await new Promise(resolve => setTimeout(resolve, 50));
		}
		assert.fail(
			"Expected saved project state did not reach the primary store"
		);
	}
	async function archive(page) {
		await page.evaluate(() => {
			delete window.__recordArchive;
		});
		await downloadProjectZip(page);
		await page.waitForFunction(
			() => window.__recordArchive instanceof Blob
		);
		return Uint8Array.from(
			await page.evaluate(async () =>
				Array.from(
					new Uint8Array(await window.__recordArchive.arrayBuffer())
				)
			)
		);
	}
	function checkArchive(bytes, files) {
		const entries = unzipSync(bytes);
		assert.equal(Object.keys(entries).length, files.length);
		for (const file of files) {
			const matches = Object.keys(entries).filter(path =>
				path.endsWith(`/${file.name}`)
			);
			assert.equal(matches.length, 1);
			assert.equal(strFromU8(entries[matches[0]]), file.content);
		}
	}

	let server, browser, context;
	let outcome = "failed";
	const taskId =
		process.env.CLASSES_FAMILY_TASK_ID ??
		`${mode}-${definition.kind}-course-ci`;
	const startedAt = new Date().toISOString();
	const output =
		process.env[definition.outputEnv] ?? definition.defaultOutput;
	const screenshots = process.env.COURSE_IMPORT_SCREENSHOT_DIR;
	const profiles = [];
	const cleanup = async () => {
		if (context) {
			await context.close().catch(() => {});
			context = null;
		}
		if (browser) {
			await browser.close();
			browser = null;
		}
		if (server) {
			await server.close();
			server = null;
		}
	};
	t.signal.addEventListener(
		"abort",
		() => {
			void cleanup();
		},
		{ once: true }
	);
	console.log(
		JSON.stringify({
			event: "start",
			taskId,
			cwd: root,
			command: process.argv,
			pid: process.pid,
			parentPid: process.ppid,
			startedAt,
			timeoutMs: 180000
		})
	);
	try {
		await mkdir(output, { recursive: true });
		if (screenshots) await mkdir(screenshots, { recursive: true });
		server = await preview({
			root,
			preview: { host: "127.0.0.1", port: 0, strictPort: true }
		});
		const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
		const executablePath = [
			process.env.PUPPETEER_EXECUTABLE_PATH,
			await puppeteer.executablePath(),
			"/usr/bin/google-chrome",
			"/usr/bin/chromium",
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
		].find(path => typeof path === "string" && path && existsSync(path));
		assert.ok(
			executablePath,
			"An existing Chrome installation is required"
		);
		browser = await puppeteer.launch({
			executablePath,
			headless: true,
			args: ["--no-sandbox"]
		});
		for (const width of [390, 1280]) {
			for (const role of ["starter", "solution"]) {
				const continuationIDs = definition.continuationsByRole?.[
					role
				] ??
					definition.continuationIDs ?? [definition.traceID];
				const selectedFileName = name =>
					definition.flatFiles ||
					(definition.sharedFiles ?? ["README.md"]).includes(name)
						? name
						: `${role}/${name}`;
				const sourceFileName = name =>
					definition.flatFiles &&
					!(definition.sharedFiles ?? ["README.md"]).includes(name)
						? `${role}/${name}`
						: name;
				const key =
					definition.projectKey?.(role) ??
					`${courseID}:${coreID}:${role === "starter" ? "starter" : "reference"}:native-${mode}`;
				const earlier = definition.previousProject?.(role) ?? {
					_id: "earlier-record-attempt",
					title: "Earlier work",
					mode: "python",
					files: [{ name: "main.py", content: "# earlier work\n" }],
					activeFileName: "main.py",
					courseID,
					courseProjectKey: key.replace(
						new RegExp(`:native-${mode}$`),
						""
					),
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				};
				context = await browser.createBrowserContext();
				const page = await context.newPage();
				const requests = [];
				let catalog = true;
				let remoteWrites = 0;
				const learner = {
					_id: "record-learner",
					name: "Learner fixture",
					email: "learner@example.invalid",
					age: 14,
					state: "GA",
					courseAccess: [courseID],
					courseProgress: []
				};
				const tutor = {
					_id: "record-tutor",
					name: "Tutor fixture",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 1,
					coursePermissions: [courseID],
					editTutors: false,
					saveEdit: "Save"
				};
				const name = `${role}-${width}`;
				try {
					await page.setViewport({ width, height: 900 });
					await page.evaluateOnNewDocument(
						(key, earlier) => {
							if (localStorage.getItem(key) === null) {
								localStorage.setItem(
									key,
									JSON.stringify([earlier])
								);
							}
							const create = URL.createObjectURL;
							URL.createObjectURL = blob => {
								if (blob.type === "application/zip")
									window.__recordArchive = blob;
								return create(blob);
							};
							const click = HTMLAnchorElement.prototype.click;
							HTMLAnchorElement.prototype.click = function () {
								if (
									this.download.endsWith(".zip") &&
									this.href.startsWith("blob:")
								) {
									return;
								}
								return click.call(this);
							};
						},
						storageKey,
						earlier
					);
					await page.setRequestInterception(true);
					page.on("request", request => {
						const url = new URL(request.url());
						if (url.hostname === "raw.githubusercontent.com") {
							const prefix = `/instruction-material/${sourceRepository}/${fixture.revision}/${fixture.pack}/`;
							const name = decodeURIComponent(
								url.pathname.slice(prefix.length)
							);
							const file =
								url.pathname.startsWith(prefix) &&
								((
									definition.sharedFiles ?? ["README.md"]
								).includes(name) ||
									name.startsWith(`${role}/`))
									? fixture.files[`${fixture.pack}/${name}`]
									: null;
							requests.push(name);
							void request.respond({
								status: file ? 200 : 404,
								contentType: "text/plain",
								headers: {
									"access-control-allow-origin": "*"
								},
								body: file?.content ?? "Unknown source"
							});
						} else if (
							url.origin !== origin ||
							url.pathname.startsWith("/api/")
						) {
							if (
								!["GET", "OPTIONS"].includes(request.method())
							) {
								remoteWrites++;
							}
							let body = {};
							if (
								catalog &&
								url.pathname === "/api/accounts/me"
							) {
								body =
									role === "starter"
										? { userID: learner._id }
										: { tutorID: tutor._id };
							}
							if (
								catalog &&
								url.pathname === "/api/users/loggedin"
							) {
								body = { currentUser: learner };
							}
							if (
								catalog &&
								url.pathname === "/api/tutors/loggedin"
							) {
								body = { currentTutor: tutor };
							}
							if (
								catalog &&
								url.pathname ===
									`/api/users/oftutor/${tutor._id}`
							) {
								body = [learner];
							}
							void request.respond({
								status: 200,
								contentType: "application/json",
								body: JSON.stringify(body)
							});
						} else {
							void request.continue();
						}
					});
					const core = await action(page, origin, coreID, role);
					const params = new URL(core.href, origin).searchParams;
					assert.equal(params.get("projectKey"), key);
					assert.equal(params.get("mode"), mode);
					assert.equal(
						params.get("starterUrl"),
						`https://github.com/instruction-material/${sourceRepository}/tree/${fixture.revision}/${fixture.pack}/${role}`
					);
					assert.equal(requests.length, 0);
					catalog = false;
					await page.locator(core.selector).click();
					await page.waitForSelector(
						"[data-testid='ide-route-import-confirm']"
					);
					assert.equal(
						requests.length,
						0,
						"Source fetch requires consent"
					);
					assert.equal(
						(await savedProjects(page)).filter(
							p => p.courseProjectKey === key
						).length,
						0
					);
					await confirmProjectImport(page);
					await page.waitForSelector(
						"select[aria-label='Active project file']"
					);
					const saved = await project(page, key);
					assert.equal(saved.mode, mode);
					assert.equal(
						saved.activeFileName,
						selectedFileName(initialFile)
					);
					assert.equal(
						saved.files.length,
						typeof definition.fileCount === "function"
							? definition.fileCount(role)
							: definition.fileCount
					);
					assert.deepEqual(
						requests
							.map(name =>
								definition.flatFiles &&
								name.startsWith(`${role}/`)
									? name.slice(role.length + 1)
									: name
							)
							.sort(),
						saved.files.map(file => file.name).sort()
					);
					for (const file of saved.files) {
						assert.equal(
							digest(file.content),
							fixture.files[
								`${fixture.pack}/${sourceFileName(file.name)}`
							].sha256
						);
					}
					const exact = await archive(page);
					checkArchive(exact, saved.files);
					await writeFile(join(output, `${name}-exact.zip`), exact);
					await page
						.locator("button.run-control:not([disabled])")
						.click();
					await page.waitForFunction(
						token =>
							document
								.querySelector(".output-panel")
								?.textContent.includes(token),
						{},
						definition.readyToken
					);
					const instructions = await page.$eval(
						".output-panel",
						element => element.textContent
					);
					for (const token of [
						...definition.instructionTokens,
						role === "starter"
							? definition.starterToken
							: definition.referenceToken
					])
						assert.ok(instructions.includes(token), token);
					if (width < 900) {
						await page
							.locator(
								".mobile-view-picker button[data-view='code']"
							)
							.click();
					}
					const modifier = await page.evaluate(() =>
						/Mac/.test(navigator.platform) ? "Meta" : "Control"
					);
					const edits = {};
					for (const filename of [
						selectedFileName(primaryFile),
						selectedFileName(taskFile)
					]) {
						await page.select(
							"select[aria-label='Active project file']",
							filename
						);
						await page.waitForFunction(
							text =>
								document
									.querySelector(".cm-content")
									?.textContent.includes(text),
							{},
							saved.files
								.find(file => file.name === filename)
								.content.split("\n")[0]
						);
						await page.waitForSelector(".cm-content", {
							visible: true
						});
						await page.focus(".cm-content");
						const note = /\.(?:S|rs|m?js|swift)$/.test(filename)
							? `\n/* Independent ${definition.kind} observation ${width} */\n`
							: `\n# Independent ${definition.kind} observation ${width}\n`;
						const content =
							saved.files.find(file => file.name === filename)
								.content + note;
						edits[filename] = content;
						await page.keyboard.down(modifier);
						await page.keyboard.press("a");
						await page.keyboard.up(modifier);
						await page.keyboard.sendCharacter(content);
						await page.keyboard.down(modifier);
						await page.keyboard.press("s");
						await page.keyboard.up(modifier);
						await project(
							page,
							key,
							p =>
								p.files.find(file => file.name === filename)
									?.content === content
						);
					}
					const edited = await project(page, key);
					await page.reload({ waitUntil: "domcontentloaded" });
					await page.waitForSelector(".cm-content");
					assert.equal(
						await page.$(
							"[data-testid='ide-route-import-confirm']"
						),
						null
					);
					assert.deepEqual(
						(await project(page, key)).files,
						edited.files
					);
					const continuationActions = [];
					let trace;
					const before = requests.length;
					for (const itemID of continuationIDs) {
						catalog = true;
						trace = await action(page, origin, itemID, role);
						assert.equal(
							new URL(trace.href, origin).searchParams.get(
								"projectKey"
							),
							key
						);
						catalog = false;
						await page.locator(trace.selector).click();
						await page.waitForSelector(".cm-content");
						assert.equal(
							await page.$(
								"[data-testid='ide-route-import-confirm']"
							),
							null
						);
						const reused = await project(page, key);
						assert.equal(reused._id, edited._id);
						assert.deepEqual(reused.files, edited.files);
						assert.equal(requests.length, before);
						for (const [filename, content] of Object.entries(
							edits
						)) {
							assert.equal(
								reused.files.find(
									file => file.name === filename
								)?.content,
								content
							);
						}
						const returnHref = await page.$$eval("a", links =>
							links
								.find(
									link =>
										link.textContent.trim() ===
										"Return to lesson"
								)
								?.getAttribute("href")
						);
						assert.equal(
							returnHref,
							`/courses#${moduleID}-${itemID}`
						);
						continuationActions.push({
							itemID,
							href: trace.href,
							sameAttemptReused: true,
							additionalSourceRequests: requests.length - before,
							returnHref
						});
					}
					const reused = await project(page, key);
					const editedBytes = await archive(page);
					checkArchive(editedBytes, reused.files);
					await writeFile(
						join(output, `${name}-edited.zip`),
						editedBytes
					);
					const projects = await savedProjects(page);
					assert.equal(
						projects.filter(p => p.courseProjectKey === key).length,
						1
					);
					const old = projects.find(p => p._id === earlier._id);
					assert.ok(old);
					for (const [name, value] of Object.entries(earlier))
						assert.deepEqual(old[name], value);
					assert.equal(remoteWrites, 0);
					assert.ok(
						await page.evaluate(
							() =>
								document.documentElement.scrollWidth <=
								innerWidth
						)
					);
					if (screenshots) {
						await page.screenshot({
							path: join(
								screenshots,
								`course-import-${mode}-${definition.kind}-${name}.png`
							),
							fullPage: true
						});
					}
					profiles.push({
						role,
						width,
						revision: fixture.revision,
						key,
						coreAction: core.href,
						worksheetAction: trace?.href ?? null,
						continuationActions,
						sourceFiles: saved.files.map(file => ({
							name: file.name,
							sha256: digest(file.content)
						})),
						exactArchive: `${name}-exact.zip`,
						exactArchiveSha256: digest(exact),
						editedArchive: `${name}-edited.zip`,
						editedArchiveSha256: digest(editedBytes),
						editedFiles: reused.files.map(file => ({
							name: file.name,
							sha256: digest(file.content)
						})),
						consentBeforeFetch: true,
						primaryStoreRead: true,
						codeAndTraceSaved: true,
						sameAttemptReused: true,
						additionalSourceRequests: requests.length - before,
						previousWorkPreserved: true,
						nativeInstructions: true,
						remoteWrites
					});
				} catch (error) {
					await page
						.screenshot({
							path: join(output, `${name}-failed.png`),
							fullPage: true
						})
						.catch(() => {});
					await writeFile(
						join(output, `${name}-failed.json`),
						JSON.stringify(
							{
								url: page.url(),
								requests,
								error: String(error),
								profiles
							},
							null,
							2
						)
					);
					throw error;
				} finally {
					await page.close();
					await context.close();
					context = null;
				}
			}
		}
		assert.equal(profiles.length, 4);
		await writeFile(
			join(output, `${mode}-${definition.kind}-course-proof.json`),
			`${JSON.stringify({ profiles }, null, 2)}\n`
		);
		outcome = "passed";
	} finally {
		await cleanup();
		console.log(
			JSON.stringify({
				event: "end",
				taskId,
				cwd: root,
				command: process.argv,
				pid: process.pid,
				parentPid: process.ppid,
				startedAt,
				endedAt: new Date().toISOString(),
				exitCode: outcome === "passed" ? 0 : 1,
				timeoutMs: 180000,
				childProcessGroupCleanup:
					"pages, contexts, browser and owned preview closed"
			})
		);
	}
}
