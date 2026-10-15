import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import {
	confirmProjectImport,
	downloadProjectZip
} from "./ide-workspace-controls.mjs";
import { pythonFrame } from "./python-frame-fixture.mjs";
const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixtures = JSON.parse(
	await readFile(
		new URL("./fixtures/pygames-juni-programs.json", import.meta.url),
		"utf8"
	)
);
const storageKey = "classes-python-ide-projects:anonymous";
const digest = value => createHash("sha256").update(value).digest("hex");
const sourceUrl = name =>
	`https://github.com/instruction-material/PyGames/blob/${fixtures.programs[name].revision ?? fixtures.revision}/${name}`;
const sourceError =
	/Traceback \(most recent call last\)|(?:Name|Type|Attribute|FileNotFound|Key|Syntax|Import|Value|Index|Runtime)Error:|Could not load shared PyGame/;
const bounce =
	"pygames-pyg1-object-oriented-programming-actors-curriculum-pyg1-project-2-bouncing-alien";
const launch =
	"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-1-bouncing-alien";
const practice =
	"pygames-pyg2-event-handling-supplemental-event-handling-transfer-practice";
const activities = [
	{
		name: "independent-build",
		course: "pygames",
		module: "pygames-pyg1-object-oriented-programming-actors",
		item: bounce,
		key: `pygames:${bounce}:starter`,
		file: null,
		staff: false
	},
	{
		name: "independent-reference",
		course: "pygames",
		module: "pygames-pyg1-object-oriented-programming-actors",
		item: bounce,
		key: `pygames:${bounce}:reference`,
		file: "PyG1-Bouncing-Alien.py",
		staff: true
	},
	{
		name: "classroom-framework",
		course: "pygames-classroom",
		module: "pygames-pyg1-object-oriented-programming-actors",
		item: bounce,
		key: `pygames-classroom:${launch}:starter`,
		file: "PyG1-Bouncing-Alien.py",
		staff: false
	},
	{
		name: "independent-transfer",
		course: "pygames",
		module: "pygames-pyg2-event-handling",
		item: practice,
		key: `pygames:${practice}:starter:juni-pygames`,
		file: "PyG2-Apple-Collector.py",
		staff: false
	},
	{
		name: "classroom-transfer",
		course: "pygames-classroom",
		module: "pygames-pyg2-event-handling",
		item: practice,
		key: `pygames-classroom:${practice}:starter:juni-pygames`,
		file: "PyG2-Apple-Collector.py",
		staff: false
	}
];
const earlier = {
	_id: "earlier-pygames-work",
	title: "Earlier arithmetic attempt",
	mode: "pgzero",
	courseID: "pygames",
	courseProjectKey: `pygames:${practice}:starter`,
	activeFileName: "main.py",
	files: [{ name: "main.py", content: "# earlier work retained\n" }],
	createdAt: "2026-10-01T12:00:00.000Z",
	updatedAt: "2026-10-01T12:00:00.000Z"
};
async function savedProjects(page) {
	return page.evaluate(
		key =>
			new Promise((resolve, reject) => {
				const opening = indexedDB.open("classes-python-ide", 1);
				opening.onupgradeneeded = () => {
					opening.transaction.abort();
					reject(
						new Error("Primary project store is not initialized")
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

async function exportedBytes(page) {
	await page.evaluate(() => {
		delete window.__pyGamesArchive;
	});
	await downloadProjectZip(page);
	await page.waitForFunction(() => window.__pyGamesArchive instanceof Blob);
	return Uint8Array.from(
		await page.evaluate(async () =>
			Array.from(
				new Uint8Array(await window.__pyGamesArchive.arrayBuffer())
			)
		)
	);
}

async function waitSaved(page, key, accepts = () => true) {
	const deadline = Date.now() + 12000;
	while (Date.now() < deadline) {
		const project = (await savedProjects(page)).find(
			p => p.courseProjectKey === key
		);
		if (project && accepts(project)) return project;
		await new Promise(resolve => setTimeout(resolve, 50));
	}
	assert.fail(`Saved project was not ready: ${key}`);
}
function assertSource(project, name, classroom) {
	const file = project.files.find(f => f.name === project.activeFileName);
	assert.ok(file);
	const original = fixtures.programs[name].content;
	if (!classroom) assert.equal(file.content, original);
	else {
		assert.ok(file.content.includes("###   NORMAL SECTION"));
		assert.ok(file.content.includes("###   HARD SECTION"));
		const lines = file.content.split("\n");
		let at = 0;
		for (const line of original.split("\n").filter(s => s.trim())) {
			const next = lines.indexOf(line, at);
			assert.ok(next >= at, `${name}: original line retained`);
			at = next + 1;
		}
	}
	return file;
}
async function retainArchive(page, project, output, name) {
	const bytes = await exportedBytes(page);
	const entries = unzipSync(bytes);
	assert.equal(Object.keys(entries).length, project.files.length);
	for (const file of project.files) {
		const paths = Object.keys(entries).filter(p =>
			p.endsWith(`/${file.name}`)
		);
		assert.equal(paths.length, 1);
		assert.equal(strFromU8(entries[paths[0]]), file.content);
	}
	const filename = `${name}.zip`;
	await writeFile(join(output, filename), bytes);
	return { name: filename, sha256: digest(bytes) };
}
async function courseAction(page, origin, activity) {
	await page.goto(`${origin}/courses#${activity.module}`, {
		waitUntil: "domcontentloaded"
	});
	await page.waitForSelector(".lesson-view-toggle button");
	const card = `#${activity.module}-${activity.item}`;
	for (const position of [1, 2, 3]) {
		await page
			.locator(`.lesson-view-toggle button:nth-child(${position})`)
			.click();
		if (!(await page.$(card))) continue;
		const href = await page.$eval(
			card,
			(element, key) =>
				[...element.querySelectorAll("a")]
					.find(a => {
						const u = new URL(a.href);
						return (
							u.pathname === "/ide" &&
							u.searchParams.get("projectKey") === key
						);
					})
					?.getAttribute("href"),
			activity.key
		);
		if (href) return href;
	}
	assert.fail(`Missing actual course action: ${activity.name}`);
}
nodeTest(
	"PyGames actual course buttons, confirmed source, persistence, exports and original game runtime",
	{ timeout: 2100000 },
	async t => {
		const taskId =
			process.env.CLASSES_FAMILY_TASK_ID ?? "pygames-course-workflows-ci";
		const startedAt = new Date().toISOString();
		let server, browser, context;
		let outcome = "failed";
		const output =
			process.env.PYGAMES_BROWSER_EXPORT_PROOF_DIR ??
			"output/pygames-exports";
		const profiles = [];
		const runtimeProfiles = [];
		const mediaRequests = new Set();
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
				timeoutMs: 2100000
			})
		);
		try {
			await mkdir(output, { recursive: true });
			for (const [name, file] of Object.entries(fixtures.programs)) {
				const bytes = Buffer.from(file.content);
				assert.equal(bytes.length, file.size);
				assert.equal(
					createHash("sha1")
						.update(
							Buffer.concat([
								Buffer.from(`blob ${bytes.length}\0`),
								bytes
							])
						)
						.digest("hex"),
					file.gitBlob,
					name
				);
			}
			server = await preview({
				root,
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
			const manifest = await (
				await fetch(`${origin}/ide/assets/manifest.json`)
			).json();
			assert.ok(manifest.assets.length > 100);
			const assetEvidence = [];
			for (const asset of manifest.assets) {
				const response = await fetch(`${origin}${asset.url}`);
				assert.equal(response.status, 200, asset.name);
				const bytes = Buffer.from(await response.arrayBuffer());
				assert.equal(bytes.length, asset.byteLength, asset.name);
				const local = await readFile(
					join(root, "public", asset.url.slice(1))
				);
				assert.equal(digest(bytes), digest(local));
				assetEvidence.push({
					name: asset.name,
					sha256: digest(bytes),
					bytes: bytes.length
				});
			}
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(p => p && existsSync(p));
			assert.ok(executablePath);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			async function openPage(course, staff, width) {
				context = await browser.createBrowserContext();
				const page = await context.newPage();
				await page.setViewport({ width, height: 950 });
				const state = { catalog: true, requests: [], remoteWrites: 0 };
				const learner = {
					_id: "pygames-learner",
					name: "Learner fixture",
					email: "learner@example.invalid",
					age: 14,
					state: "GA",
					courseAccess: [course],
					courseProgress: []
				};
				const tutor = {
					_id: "pygames-tutor",
					name: "Tutor fixture",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 1,
					coursePermissions: [course],
					editTutors: false,
					saveEdit: "Save"
				};
				await page.evaluateOnNewDocument(
					(key, old) => {
						if (window !== window.top) return;
						if (localStorage.getItem(key) === null)
							localStorage.setItem(key, JSON.stringify([old]));
						const create = URL.createObjectURL;
						URL.createObjectURL = blob => {
							if (blob.type === "application/zip")
								window.__pyGamesArchive = blob;
							return create(blob);
						};
						const click = HTMLAnchorElement.prototype.click;
						HTMLAnchorElement.prototype.click = function () {
							if (
								this.download.endsWith(".zip") &&
								this.href.startsWith("blob:")
							)
								return;
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
						const match = url.pathname.match(
							/^\/instruction-material\/PyGames\/([a-f0-9]{40})\/(.+)$/
						);
						const name = match ? decodeURIComponent(match[2]) : "";
						const file = fixtures.programs[name];
						const valid =
							match &&
							file &&
							match[1] === (file.revision ?? fixtures.revision);
						state.requests.push({
							name,
							revision: match?.[1],
							valid: !!valid
						});
						void request.respond({
							status: valid ? 200 : 404,
							contentType: "text/plain",
							headers: { "access-control-allow-origin": "*" },
							body: valid ? file.content : "Unrecognized source"
						});
					} else if (url.pathname.startsWith("/api/")) {
						if (!["GET", "OPTIONS"].includes(request.method()))
							state.remoteWrites++;
						let body = {};
						if (
							state.catalog &&
							url.pathname === "/api/accounts/me"
						)
							body = staff
								? { tutorID: tutor._id }
								: { userID: learner._id };
						if (
							state.catalog &&
							url.pathname === "/api/users/loggedin"
						)
							body = { currentUser: learner };
						if (
							state.catalog &&
							url.pathname === "/api/tutors/loggedin"
						)
							body = { currentTutor: tutor };
						if (
							state.catalog &&
							url.pathname === `/api/users/oftutor/${tutor._id}`
						)
							body = [learner];
						void request.respond({
							status: 200,
							contentType: "application/json",
							body: JSON.stringify(body)
						});
					} else {
						if (
							url.origin === origin &&
							/\/(?:python-ide|ide)\/assets\//.test(url.pathname)
						)
							mediaRequests.add(url.pathname);
						void request.continue();
					}
				});
				return { page, state };
			}
			for (const activity of activities)
				for (const width of [390, 1280]) {
					const { page, state } = await openPage(
						activity.course,
						activity.staff,
						width
					);
					try {
						const href = await courseAction(page, origin, activity);
						const params = new URL(href, origin).searchParams;
						assert.equal(params.get("course"), activity.course);
						assert.equal(params.get("mode"), "pgzero");
						assert.equal(
							params.get("starterUrl"),
							activity.file ? sourceUrl(activity.file) : null
						);
						assert.equal(
							params.get("classroom"),
							activity.course.endsWith("classroom") ? "1" : null
						);
						assert.equal(state.requests.length, 0);
						state.catalog = false;
						// Keep the observed href and actual button; navigate its target in this controlled tab.
						await page.$eval(
							`a[href=${JSON.stringify(href)}]`,
							a => {
								a.target = "_self";
							}
						);
						await page
							.locator(`a[href=${JSON.stringify(href)}]`)
							.click();
						await page.waitForSelector(
							"[data-testid='ide-route-import-confirm']"
						);
						assert.equal(state.requests.length, 0);
						assert.equal(
							(await savedProjects(page)).filter(
								p => p.courseProjectKey === activity.key
							).length,
							0
						);
						await confirmProjectImport(page);
						await page.waitForSelector(
							"select[aria-label='Active project file']"
						);
						const saved = await waitSaved(page, activity.key);
						if (activity.file)
							assertSource(
								saved,
								activity.file,
								activity.course.endsWith("classroom")
							);
						assert.equal(
							state.requests.length,
							activity.file ? 1 : 0
						);
						assert.ok(state.requests.every(r => r.valid));
						const label = `${activity.name}-${width}`;
						const exact = await retainArchive(
							page,
							saved,
							output,
							`${label}-exact`
						);
						if (width < 900)
							await page
								.locator(
									".mobile-view-picker button[data-view='code']"
								)
								.click();
						await page.waitForSelector(".cm-content", {
							visible: true
						});
						await page.focus(".cm-content");
						const changed =
							saved.files.find(
								f => f.name === saved.activeFileName
							).content +
							`\n# Saved course observation ${label}\n`;
						const modifier = await page.evaluate(() =>
							/Mac/.test(navigator.platform) ? "Meta" : "Control"
						);
						await page.keyboard.down(modifier);
						await page.keyboard.press("a");
						await page.keyboard.up(modifier);
						await page.keyboard.sendCharacter(changed);
						await page.keyboard.down(modifier);
						await page.keyboard.press("s");
						await page.keyboard.up(modifier);
						const edited = await waitSaved(page, activity.key, p =>
							p.files.some(f => f.content === changed)
						);
						await page.reload({ waitUntil: "domcontentloaded" });
						await page.waitForSelector(".cm-content");
						assert.equal(
							await page.$(
								"[data-testid='ide-route-import-confirm']"
							),
							null
						);
						assert.deepEqual(
							(await waitSaved(page, activity.key)).files,
							edited.files
						);
						const editedArchive = await retainArchive(
							page,
							edited,
							output,
							`${label}-edited`
						);
						const previous = (await savedProjects(page)).find(
							p => p._id === earlier._id
						);
						assert.ok(previous);
						for (const key of Object.keys(earlier))
							assert.deepEqual(previous[key], earlier[key]);
						assert.equal(
							(await savedProjects(page)).filter(
								p => p.courseProjectKey === activity.key
							).length,
							1
						);
						assert.equal(state.remoteWrites, 0);
						assert.equal(
							await page.evaluate(
								() =>
									document.documentElement.scrollWidth <=
									innerWidth
							),
							true
						);
						await page.screenshot({
							path: join(output, `${label}.png`),
							fullPage: true
						});
						profiles.push({
							activity: activity.name,
							course: activity.course,
							width,
							key: activity.key,
							source: activity.file
								? sourceUrl(activity.file)
								: null,
							classroom: activity.course.endsWith("classroom"),
							consentBeforeFetch: true,
							primaryStoreRead: true,
							priorWorkPreserved: true,
							editReopened: true,
							exact,
							editedArchive,
							sourceFiles: saved.files,
							editedFiles: edited.files,
							remoteWrites: state.remoteWrites
						});
					} finally {
						await page.close();
						await context.close();
						context = null;
					}
				}
			const gameNames = Object.keys(fixtures.programs).filter(
				name =>
					![
						"PyG0-Template.py",
						"PyG12-Master-Project.py",
						"Check-in-2-Solution.py"
					].includes(name)
			);
			assert.equal(gameNames.length, 43);
			for (const name of gameNames)
				for (const classroom of [false, true]) {
					const course = classroom ? "pygames-classroom" : "pygames";
					const { page, state } = await openPage(course, false, 1280);
					state.catalog = false;
					const key = `${course}:runtime-${name}:starter`;
					const params = new URLSearchParams({
						course,
						mode: "pgzero",
						projectKey: key,
						starterUrl: sourceUrl(name)
					});
					if (classroom) params.set("classroom", "1");
					try {
						await page.goto(`${origin}/ide?${params}`, {
							waitUntil: "domcontentloaded"
						});
						await page.waitForSelector(
							"[data-testid='ide-route-import-confirm']"
						);
						assert.equal(state.requests.length, 0);
						await confirmProjectImport(page);
						await page.waitForSelector(
							"button.run-control:not([disabled])"
						);
						const saved = await waitSaved(page, key);
						const source = assertSource(saved, name, classroom);
						const archive = await retainArchive(
							page,
							saved,
							output,
							`runtime-${classroom ? "classroom" : "original"}-${name}`
						);
						await page.locator("button.run-control").click();
						const frame = await pythonFrame(page);
						try {
							await frame.waitForFunction(
								() => {
									const c = document.querySelector(
										"canvas.turtle-canvas--game"
									);
									if (!c || !c.width || !c.height)
										return false;
									const pixels = c
										.getContext("2d")
										.getImageData(
											0,
											0,
											c.width,
											c.height
										).data;
									for (let i = 0; i < pixels.length; i += 4)
										if (
											pixels[i + 3] > 0 &&
											(pixels[i] ||
												pixels[i + 1] ||
												pixels[i + 2])
										)
											return true;
									return false;
								},
								{ timeout: 90000 }
							);
							const canvas = await frame.$(
								"canvas.turtle-canvas--game"
							);
							const box = await canvas.boundingBox();
							assert.ok(box);
							await page.mouse.click(
								box.x + box.width / 2,
								box.y + box.height / 2
							);
							for (const key of [
								"Enter",
								"ArrowLeft",
								"ArrowRight",
								"ArrowUp",
								"Space"
							])
								await page.keyboard.press(key);
							await new Promise(resolve =>
								setTimeout(resolve, 1200)
							);
							const outputText = await page.$eval(
								".output-panel",
								e => e.textContent
							);
							assert.ok(
								!sourceError.test(outputText),
								`${name}: ${outputText}`
							);
							assert.equal(
								await page.$eval("button.run-control", e =>
									e.textContent.trim()
								),
								"Stop"
							);
							await (
								await frame.$("canvas.turtle-canvas--game")
							).screenshot({
								path: join(
									output,
									`runtime-${classroom ? "classroom" : "original"}-${name}.png`
								)
							});
							await page.locator("button.run-control").click();
							await page.waitForFunction(
								() =>
									document
										.querySelector("button.run-control")
										?.textContent.trim() === "Run"
							);
							runtimeProfiles.push({
								name,
								classroom,
								source: sourceUrl(name),
								gitBlob: fixtures.programs[name].gitBlob,
								savedSourceSha256: digest(source.content),
								archive,
								canvasRendered: true,
								keyboardAndMouseDispatched: true,
								stopped: true,
								sourceFiles: saved.files
							});
						} catch (error) {
							throw new Error(
								`${name} classroom=${classroom}: ${error.message}\n${await page.$eval(".output-panel", e => e.textContent).catch(() => "")}`
							);
						}
						assert.equal(state.remoteWrites, 0);
					} finally {
						await page.close();
						await context.close();
						context = null;
					}
				}
			assert.equal(profiles.length, 10);
			assert.equal(runtimeProfiles.length, 86);
			assert.ok([...mediaRequests].some(p => /\/images\//.test(p)));
			await writeFile(
				join(output, "pygames-browser-proof.json"),
				JSON.stringify(
					{
						profiles,
						runtimeProfiles,
						assetEvidence,
						mediaRequests: [...mediaRequests],
						sourceRevision: fixtures.revision,
						nonRuntimeSources: fixtures.provenanceNotes,
						scope: "Real source imports and course media, saved source and exact ZIPs; startup and input dispatch do not certify every game mechanic."
					},
					null,
					2
				) + "\n"
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
					timeoutMs: 2100000,
					childProcessGroupCleanup:
						"pages, contexts, browser and owned preview server closed"
				})
			);
		}
	}
);
