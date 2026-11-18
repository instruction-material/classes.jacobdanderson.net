import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { createServer, preview } from "vite";
import { confirmProjectImport } from "./ide-workspace-controls.mjs";
import {
	exportedBytes,
	savedProjects,
	waitSaved
} from "./pygames-core-browser-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/pythonic-opening-code-packs.json", import.meta.url),
		"utf8"
	)
);
const output = resolve(
	process.env.PYTHONIC_OPENING_BROWSER_PROOF_DIR ?? "output/pythonic-opening"
);
const sourceMode = process.env.PYTHONIC_OPENING_BROWSER_SOURCE_MODE ?? "build";
const digest = value => createHash("sha256").update(value).digest("hex");
const storageKey = "classes-python-ide-projects:anonymous";
const courseID = "pythonic-design-patterns";

function account(path, instructor, inIde) {
	if (inIde) return {};
	const learner = {
		_id: "pythonic-browser-learner",
		name: "Learner",
		email: "learner@example.invalid",
		age: 14,
		state: "GA",
		courseAccess: [courseID],
		courseProgress: []
	};
	if (path === "/api/accounts/me") {
		return instructor
			? { tutorID: "pythonic-browser-tutor" }
			: { userID: learner._id };
	}
	if (path === "/api/users/loggedin" && !instructor)
		return { currentUser: learner };
	if (path === "/api/tutors/loggedin" && instructor) {
		return {
			currentTutor: {
				_id: "pythonic-browser-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				coursePermissions: [courseID],
				usersOfTutorLength: 1,
				editTutors: false,
				saveEdit: "Save"
			}
		};
	}
	if (path === "/api/users/oftutor/pythonic-browser-tutor") return [learner];
	return {};
}

async function openingAction(page, origin, activity, key) {
	await page.goto(`${origin}/courses#${activity.module}`, {
		waitUntil: "domcontentloaded"
	});
	await page.waitForSelector(".lesson-view-toggle button");
	const position = activity.item.includes("-supplemental-") ? 2 : 1;
	const button = `.lesson-view-toggle button:nth-child(${position})`;
	await page.locator(button).click();
	await page.waitForSelector(`${button}[aria-pressed='true']`);
	const card = `#${activity.module}-${activity.item}`;
	await page.waitForSelector(card);
	await page.waitForFunction(({ selector, expectedKey }) => [...document.querySelectorAll(`${selector} a`)].some((link) => {
		const url = new URL(link.href);
		return url.pathname === "/ide" && url.searchParams.get("projectKey") === expectedKey;
	}), {}, { selector: card, expectedKey: key });
	const href = await page.$eval(
		card,
		(element, expectedKey) =>
			[...element.querySelectorAll("a")]
				.find((link) => {
					const url = new URL(link.href);
					return (
						url.pathname === "/ide"
						&& url.searchParams.get("projectKey") === expectedKey
					);
				})
				?.getAttribute("href"),
		key
	);
	assert.ok(href, `Missing actual opening action: ${activity.name} ${JSON.stringify(await page.$$eval(`${card} a`, elements => elements.map(element => ({ text: element.textContent, href: element.getAttribute("href") }))))}`);
	return href;
}

async function runPython(page, width, unfinished, marker = "") {
	if (width < 900) {
		await page
			.locator(".mobile-view-picker button[data-view='code']")
			.click();
	}
	await page.locator("button.run-control").click();
	if (width < 900) {
		await page
			.locator(".mobile-view-picker button[data-view='console']")
			.click();
	}
	await page.waitForFunction(({ unfinished, marker }) => {
		const status = document.querySelector("[data-testid='ide-run-status']")?.textContent.trim();
		if (status === "Run failed" || status === "Run finished with issues") return true;
		const stdout = [...document.querySelectorAll(".output-line--stdout")].map(node => node.textContent).join("\n");
		return status === "Run complete" && stdout.includes(marker || (unfinished ? "PDP1 starter unfinished:" : "Design Patterns"));
	}, { timeout: 90000 }, { unfinished, marker });

	const result = await page.evaluate(() => ({
		status: document
			.querySelector("[data-testid='ide-run-status']")
			?.textContent
			.trim(),
		stdout: [...document.querySelectorAll(".output-line--stdout")]
			.map(node => node.textContent)
			.join("\n"),
		stderr: [...document.querySelectorAll(".output-line--stderr")]
			.map(node => node.textContent)
			.join("\n")
	}));
	assert.equal(result.status, "Run complete", JSON.stringify(result));
	assert.equal(result.stderr, "");
	if (unfinished) {
		assert.match(result.stdout, /PDP1 starter unfinished:/);
	}
	else {
		assert.match(result.stdout, /Design Patterns/);
		assert.match(result.stdout, /LOG: design patterns/);
		assert.ok(!result.stdout.includes("starter unfinished"));
	}
	if (marker) assert.ok(result.stdout.includes(marker), result.stdout);
	return result;
}

async function editMain(page, width, key, content) {
	if (width < 900) {
		await page
			.locator(".mobile-view-picker button[data-view='code']")
			.click();
	}
	await page.select("select[aria-label='Active project file']", "main.py");
	await page.waitForSelector(".cm-content", { visible: true });
	await page.focus(".cm-content");
	const modifier = await page.evaluate(() =>
		/Mac/.test(navigator.platform) ? "Meta" : "Control"
	);
	await page.keyboard.down(modifier);
	await page.keyboard.press("a");
	await page.keyboard.up(modifier);
	await page.keyboard.sendCharacter(content);
	await page.keyboard.down(modifier);
	await page.keyboard.press("s");
	await page.keyboard.up(modifier);
	return waitSaved(page, key, project =>
		project.files.some(
			file => file.name === "main.py" && file.content === content
		));
}

async function retainZip(page, project, label) {
	const bytes = await exportedBytes(page);
	const members = unzipSync(bytes);
	assert.equal(Object.keys(members).length, 4);
	for (const file of project.files) {
		const names = Object.keys(members).filter(path =>
			path.endsWith(`/${file.name}`)
		);
		assert.equal(names.length, 1, file.name);
		assert.ok(
			!names[0].startsWith("/") && !names[0].split("/").includes("..")
		);
		assert.deepEqual(
			Buffer.from(members[names[0]]),
			Buffer.from(file.content, "utf8"),
			file.name
		);
	}
	await writeFile(join(output, `${label}.zip`), bytes);
	return {
		file: `${label}.zip`,
		sha256: digest(bytes),
		members: Object.fromEntries(
			Object.entries(members).map(([name, content]) => [
				name,
				digest(content)
			])
		)
	};
}

test(
	"Pythonic opening consent, preserved attempts, actual Python and complete exports",
	{ timeout: 1200000 },
	async (t) => {
		const previousDirectory = process.cwd();
		const startedAt = new Date().toISOString();
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID ?? "pythonic-opening-browser";
		const profiles = [];
		const errors = [];
		const browserProcesses = [];
		let server;
		let browser;
		let context;
		let page;
		let currentLabel = "";
		let exitCode = 1;
		async function cleanup() {
			if (context) await context.close().catch(() => {});
			context = null;
			if (browser) await browser.close().catch(() => {});
			browser = null;
			if (server) await server.close();
			server = null;
		}
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
				timeoutMs: 1200000
			})
		);
		try {
			assert.ok(["build", "dev"].includes(sourceMode));
			await mkdir(output, { recursive: true });
			process.chdir(root);
			for (const [path, file] of Object.entries(fixture.files)) {
				assert.equal(Buffer.byteLength(file.content), file.bytes, path);
				assert.equal(digest(file.content), file.sha256, path);
			}
			if (sourceMode === "dev") {
				server = await createServer({
					root,
					server: {
						host: "127.0.0.1",
						port: 0,
						strictPort: true,
						open: false
					}
				});
				await server.listen();
			}
			else {
				assert.ok(existsSync(join(root, "dist/index.html")));
				server = await preview({
					root,
					preview: { host: "127.0.0.1", port: 0, strictPort: true }
				});
			}
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(path => path && existsSync(path));
			assert.ok(executablePath, "Chrome is required");
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			browserProcesses.push({
				pid: browser.process()?.pid,
				parentPid: process.pid,
				command: browser.process()?.spawnargs,
				startedAt: new Date().toISOString()
			});
			for (const role of ["learner", "instructor"]) {
				for (const width of [390, 1280]) {
					for (const [
						index,
						activity
					] of fixture.activities.entries()) {
						currentLabel = `${role}-${width}-${index}`;
						context = await browser.createBrowserContext();
						page = await context.newPage();
						page.setDefaultTimeout(30000);
						await page.setViewport({ width, height: 950 });
						const key = `${courseID}:${activity.folder}:${activity.name}:current-pack-v2`;
						const earlier = {
							_id: "preserved-pythonic-work",
							title: "Earlier Pythonic work",
							mode: "python",
							courseID,
							courseProjectKey: key.replace(
								":current-pack-v2",
								""
							),
							activeFileName: "main.py",
							files: [
								{
									name: "main.py",
									content: "print('earlier work retained')\n",
									encoding: "text"
								}
							],
							createdAt: "2026-10-01T12:00:00.000Z",
							updatedAt: "2026-10-01T12:00:00.000Z"
						};
						await page.evaluateOnNewDocument(
							(storage, previous) => {
								if (window !== window.top) return;
								if (localStorage.getItem(storage) === null) {
									localStorage.setItem(
										storage,
										JSON.stringify([previous])
									);
								}
								const create = URL.createObjectURL;
								URL.createObjectURL = (blob) => {
									if (blob.type === "application/zip")
										window.__pyGamesArchive = blob;
									return create(blob);
								};
								const click = HTMLAnchorElement.prototype.click;
								HTMLAnchorElement.prototype.click
									= function () {
										if (
											this.download.endsWith(".zip")
											&& this.href.startsWith("blob:")
										) {
											return;
										}
										return click.call(this);
									};
							},
							storageKey,
							earlier
						);
						const requests = [];
						const pageErrors = [];
						let writes = 0;
						let inIde = false;
						page.on("pageerror", error =>
							pageErrors.push(String(error)));
						await page.setRequestInterception(true);
						page.on("request", (request) => {
							void (async () => {
								const url = new URL(request.url());
								const headers = {
									"access-control-allow-origin": "*"
								};
								const prefix = `/repos/${fixture.repository}/contents/`;
								if (url.hostname === "api.github.com") {
									const path = decodeURIComponent(
										url.pathname.slice(prefix.length)
									);
									const valid
										= url.pathname.startsWith(prefix)
											&& url.searchParams.get("ref") === "main";
									const files = valid
										? Object.entries(fixture.files)
												.filter(([name]) =>
													name.startsWith(`${path}/`)
												)
												.map(([name, file]) => ({
													type: "file",
													name: name
														.split("/")
														.at(-1),
													path: name,
													size: file.bytes,
													html_url: `https://github.com/${fixture.repository}/blob/main/${name}`,
													download_url: `https://raw.githubusercontent.com/${fixture.repository}/main/${name}`
												}))
										: [];
									assert.equal(files.length, 4, path);
									requests.push({
										type: "directory",
										path,
										inIde
									});
									await request.respond({
										status: 200,
										contentType: "application/json",
										headers,
										body: JSON.stringify(files)
									});
								}
								else if (
									url.hostname === "raw.githubusercontent.com"
								) {
									const rawPrefix = `/${fixture.repository}/main/`;
									assert.ok(
										url.pathname.startsWith(rawPrefix)
									);
									const path = decodeURIComponent(
										url.pathname.slice(rawPrefix.length)
									);
									const file = fixture.files[path];
									assert.ok(file, path);
									requests.push({
										type: "file",
										path,
										inIde,
										sha256: file.sha256
									});
									await request.respond({
										status: 200,
										contentType: "text/plain",
										headers,
										body: file.content
									});
								}
								else if (url.pathname.startsWith("/api/")) {
									if (
										!["GET", "OPTIONS"].includes(
											request.method()
										)
									) {
										writes++;
									}
									await request.respond({
										status: 200,
										contentType: "application/json",
										body: JSON.stringify(
											account(
												url.pathname,
												role === "instructor",
												inIde
											)
										)
									});
								}
								else {
									await request.continue();
								}
							})().catch((error) => {
								pageErrors.push(String(error));
								void request.abort().catch(() => {});
							});
						});
						const href = await openingAction(
							page,
							origin,
							activity,
							key
						);
						assert.ok(href.includes("current-pack-v2"));
						assert.equal(
							new URL(href, origin).searchParams.get(
								"starterUrl"
							),
							`https://github.com/${fixture.repository}/tree/main/${activity.folder}/starter`
						);
						const card = `#${activity.module}-${activity.item}`;
						const sourceLinks = await page.$$eval(
							`${card} a`,
							elements =>
								elements
									.map(element =>
										element.getAttribute("href")
									)
									.filter(Boolean)
						);
						if (role === "instructor") {
							assert.ok(
								sourceLinks.some(link =>
									link.includes("/solution")
								),
								"Instructor reference remains available"
							);
						}
						assert.equal(requests.length, 0);
						await page.$eval(card, element =>
							element.scrollIntoView({ block: "center" }));
						await page.screenshot({
							path: join(output, `${currentLabel}-course.png`)
						});
						const selector = `${card} a[href=${JSON.stringify(href)}]`;
						await page.$eval(selector, (element) => {
							element.target = "_self";
						});
						inIde = true;
						await page.locator(selector).click();
						await page.waitForSelector(
							"[data-testid='ide-route-import-confirm']"
						);
						assert.equal(requests.length, 0);
						await page
							.locator(
								".code-ide-route-import-actions button:nth-child(2)"
							)
							.click();
						await page.waitForSelector(
							"[data-testid='ide-route-import-confirm']",
							{ hidden: true }
						);
						assert.equal(requests.length, 0);
						assert.ok(
							!(await savedProjects(page)).some(
								project => project.courseProjectKey === key
							)
						);
						await page.goto(origin + href, {
							waitUntil: "domcontentloaded"
						});
						await page.waitForSelector(
							"[data-testid='ide-route-import-confirm']"
						);
						assert.equal(requests.length, 0);
						await confirmProjectImport(page);
						const imported = await waitSaved(
							page,
							key,
							project => project.files.length === 4
						);
						assert.equal(imported.mode, "python");
						assert.deepEqual(
							imported.files.map(file => file.name).sort(),
							[
								"README.md",
								"main.py",
								"requirements-dev.txt",
								"test_contract.py"
							]
						);
						for (const file of imported.files) {
							assert.equal(
								file.content,
								fixture.files[
									`${activity.folder}/starter/${file.name}`
								].content,
								file.name
							);
						}
						assert.equal(requests.length, 5);
						assert.ok(requests.every(request => request.inIde));
						const originalExport = await retainZip(
							page,
							imported,
							`${currentLabel}-original`
						);
						const before = await runPython(page, width, true);
						const marker = `pythonic_browser_edit_${currentLabel.replaceAll("-", "_")}`;
						const completed = `${fixture.files[`${activity.folder}/solution/main.py`].content}\nprint(${JSON.stringify(marker)})\n`;
						const edited = await editMain(
							page,
							width,
							key,
							completed
						);
						const after = await runPython(
							page,
							width,
							false,
							marker
						);
						await page.reload({ waitUntil: "domcontentloaded" });
						await page.waitForSelector(
							"select[aria-label='Active project file']"
						);
						assert.equal(
							await page.$(
								"[data-testid='ide-route-import-confirm']"
							),
							null
						);
						const reopened = await waitSaved(page, key);
						assert.equal(reopened._id, imported._id);
						assert.deepEqual(reopened.files, edited.files);
						const resumed = await runPython(
							page,
							width,
							false,
							marker
						);
						const editedExport = await retainZip(
							page,
							reopened,
							`${currentLabel}-edited`
						);
						const preserved = (await savedProjects(page)).find(
							project => project._id === earlier._id
						);
						assert.deepEqual(preserved.files, earlier.files);
						assert.equal(
							requests.length,
							5,
							"Reopening retains edits without a new source fetch"
						);
						assert.equal(writes, 0);
						assert.deepEqual(pageErrors, []);
						await page.screenshot({
							path: join(output, `${currentLabel}-workspace.png`)
						});
						profiles.push({
							label: currentLabel,
							role,
							width,
							activity: activity.item,
							key,
							href,
							sourceLinks,
							requests,
							cancelledBeforeImport: true,
							earlierAttemptPreserved: true,
							originalExport,
							before,
							after,
							resumed,
							editedExport,
							writes,
							pageErrors
						});
						await context.close();
						context = null;
						console.log(
							JSON.stringify({
								event: "verified-pythonic-opening-workflow",
								label: currentLabel
							})
						);
					}
				}
			}
			assert.equal(profiles.length, 12);
			exitCode = 0;
		}
		catch (error) {
			errors.push({
				label: currentLabel,
				message: String(error),
				stack: error.stack
			});
			if (page && !page.isClosed()) {
				await page
					.screenshot({
						path: join(output, "failure.png"),
						fullPage: true
					})
					.catch(() => {});
			}
			throw error;
		}
		finally {
			await cleanup();
			process.chdir(previousDirectory);
			const endedAt = new Date().toISOString();
			await writeFile(
				join(output, "summary.json"),
				`${JSON.stringify({ taskId, sourceCommit: process.env.GITHUB_SHA ?? null, sourceMode, fixtureRepository: fixture.repository, fixtureRevision: fixture.revision, scope: fixture.scope, pid: process.pid, startedAt, endedAt, exitCode, profiles, browserProcesses, errors, cleanup: "contexts, browser and server closed" }, null, 2)}\n`
			);
			console.log(
				JSON.stringify({
					event: "end",
					taskId,
					pid: process.pid,
					startedAt,
					endedAt,
					exitCode,
					cleanup: "contexts, browser and server closed"
				})
			);
		}
	}
);
