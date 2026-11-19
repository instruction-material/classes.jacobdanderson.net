import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { unzipSync } from "fflate";
import MarkdownIt from "markdown-it";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { confirmProjectImport } from "./ide-workspace-controls.mjs";
import {
	courseAction,
	exportedBytes,
	savedProjects,
	waitSaved
} from "./pygames-core-browser-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const output = resolve(
	process.env.DATA_SCIENCE_FOUNDATIONS_BROWSER_PROOF_DIR
	?? "output/data-science-foundations"
);
const fixture = JSON.parse(
	await readFile(
		new URL(
			"./fixtures/data-science-foundations-verification.json",
			import.meta.url
		),
		"utf8"
	)
);
const guidance = JSON.parse(
	await readFile(
		join(
			root,
			"src/stores/courses/dataScienceFoundationsGuidanceData.json"
		),
		"utf8"
	)
);
const sources = JSON.parse(
	await readFile(join(output, "pinned-sources.json"), "utf8")
);
const hash = value => createHash("sha256").update(value).digest("hex");
const courseID = "data-science-in-python";
const site = execFileSync("git", ["rev-parse", "HEAD"], {
	encoding: "utf8"
}).trim();
const markdown = new MarkdownIt();
const bodies = fixture.bodies.map((body, index) => {
	const lesson = guidance[index];
	assert.equal(hash(lesson.content), body.contentSHA256, lesson.title);
	return { ...lesson, ...body };
});

function apiResponse(path, role, inIde) {
	if (inIde) return {};
	const learner = {
		_id: "ds-learner",
		name: "Learner",
		email: "learner@example.invalid",
		age: 14,
		state: "GA",
		courseAccess: [courseID],
		courseProgress: []
	};
	if (path === "/api/accounts/me") {
		return role === "instructor"
			? { tutorID: "ds-tutor" }
			: { userID: learner._id };
	}
	if (path === "/api/users/loggedin" && role === "learner")
		return { currentUser: learner };
	if (path === "/api/tutors/loggedin" && role === "instructor") {
		return {
			currentTutor: {
				_id: "ds-tutor",
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
	if (path === "/api/users/oftutor/ds-tutor") return [learner];
	return {};
}

function directory(revision, path) {
	const children = new Map();
	for (const [name, content] of Object.entries(sources[revision])) {
		if (!name.startsWith(`${path}/`)) continue;
		const relative = name.slice(path.length + 1);
		const first = relative.split("/")[0];
		children.set(
			first,
			relative.includes("/")
				? { type: "dir", name: first, path: `${path}/${first}` }
				: {
						type: "file",
						name: first,
						path: name,
						size: new TextEncoder().encode(content).length,
						html_url:
							`https://github.com/${
								fixture.repository
							}/blob/${
								revision
							}/${
								name}`,
						download_url:
							`https://raw.githubusercontent.com/${
								fixture.repository
							}/${
								revision
							}/${
								name}`
					}
		);
	}
	assert.ok(children.size > 0, `${revision}:${path}`);
	return [...children.values()];
}

async function show(page, width, view) {
	if (width < 900) {
		await page
			.locator(`.mobile-view-picker button[data-view='${view}']`)
			.click();
	}
}

async function runProject(page, width, stdout) {
	const expected = stdout.trimEnd();
	await show(page, width, "code");
	await page.locator("button.run-control").click();
	await show(page, width, "console");
	const extract = () => {
		const raw = [...document.querySelectorAll(".output-line--stdout")].map(
			node => node.textContent
		);
		const program = [...raw];
		while (/^(?:Loading|Loaded) [\w ,.-]+$/u.test(program[0] ?? ""))
			program.shift();
		return {
			status: document
				.querySelector("[data-testid='ide-run-status']")
				?.textContent
				.trim(),
			stderr: [...document.querySelectorAll(".output-line--stderr")]
				.map(node => node.textContent)
				.join("\n"),
			stdout: raw.join("\n"),
			program: program.join("\n")
		};
	};
	const until = Date.now() + 120000;
	let result;
	do {
		result = await page.evaluate(extract);
		if (result.status === "Analysis ready" && result.program === expected)
			break;
		if (["Run failed", "Run finished with issues"].includes(result.status))
			break;
		await new Promise(resolve => setTimeout(resolve, 200));
	} while (Date.now() < until);
	assert.equal(result.status, "Analysis ready", JSON.stringify(result));
	assert.equal(result.stderr, "");
	assert.equal(result.program, expected, JSON.stringify(result));
	return result;
}

async function replaceMain(page, width, key, content) {
	await show(page, width, "code");
	await page.select("select[aria-label='Active project file']", "main.py");
	await page.waitForSelector(".cm-content", { visible: true });
	await page.focus(".cm-content");
	await page.keyboard.down("Control");
	await page.keyboard.press("a");
	await page.keyboard.up("Control");
	await page.keyboard.sendCharacter(content);
	await page.keyboard.down("Control");
	await page.keyboard.press("s");
	await page.keyboard.up("Control");
	await waitSaved(page, key, project =>
		project.files.some(
			file => file.name === "main.py" && file.content === content
		));
}

function fileHashes(project) {
	return Object.fromEntries(
		project.files.map(file => [file.name, hash(file.content)])
	);
}

async function exportProject(page, name, expected, observed) {
	const bytes = await exportedBytes(page);
	const entries = unzipSync(bytes);
	const paths = Object.keys(entries);
	const tops = new Set(paths.map(path => path.split("/")[0]));
	assert.equal(tops.size, 1);
	assert.equal(paths.length, Object.keys(expected).length);
	const files = Object.fromEntries(
		paths.map(path => [
			path.split("/").slice(1).join("/"),
			hash(entries[path])
		])
	);
	assert.deepEqual(files, expected, name);
	await writeFile(join(output, name), bytes);
	return {
		name,
		sha256: hash(bytes),
		programStdout: observed.program,
		rawStdout: observed.stdout
	};
}

test(
	"Data Science foundations on learner and instructor routes",
	{ timeout: 1500000 },
	async (t) => {
		const views = [];
		const imports = [];
		const screenshots = [];
		const previousDirectory = process.cwd();
		let browser, server, context, page, failing;
		let complete = false;
		let failure;
		async function cleanup() {
			await context?.close().catch(() => {});
			context = null;
			await browser?.close().catch(() => {});
			browser = null;
			await server?.close();
			server = null;
		}
		t.signal.addEventListener(
			"abort",
			() => {
				void cleanup();
			},
			{ once: true }
		);
		try {
			await mkdir(output, { recursive: true });
			assert.equal(bodies.length, 26);
			assert.equal(Object.keys(fixture.packs).length, 9);
			process.chdir(root);
			assert.ok(existsSync(join(root, "dist/index.html")));
			server = await preview({
				root,
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin
				= `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(path => typeof path === "string" && existsSync(path));
			assert.ok(executablePath, "Chrome is required");
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			console.log(
				JSON.stringify({
					event: "browser-start",
					pid: browser.process()?.pid,
					parentPid: process.pid,
					cwd: root,
					command: browser.process()?.spawnargs,
					startedAt: new Date().toISOString()
				})
			);
			for (const role of ["learner", "instructor"]) {
				for (const width of [390, 1280]) {
					context = await browser.createBrowserContext();
					page = await context.newPage();
					page.setDefaultTimeout(30000);
					await page.setViewport({ width, height: 950 });
					const errors = [];
					let inIde = false;
					let fetches = 0;
					let writes = 0;
					const first = bodies.find(body => body.folder);
					const earlier = {
						_id: "earlier-ds-attempt",
						title: "Earlier CSV work",
						mode: "data",
						courseID,
						courseProjectKey:
							`${courseID}:${first.item}:starter`,
						activeFileName: "main.py",
						files: [
							{
								name: "main.py",
								content: "print('earlier attempt')\n",
								encoding: "text"
							}
						],
						createdAt: "2026-10-01T12:00:00.000Z",
						updatedAt: "2026-10-01T12:00:00.000Z"
					};
					await page.evaluateOnNewDocument((previous) => {
						if (window !== window.top) return;
						const storage = "classes-python-ide-projects:anonymous";
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
						HTMLAnchorElement.prototype.click = function () {
							if (
								this.download.endsWith(".zip")
								&& this.href.startsWith("blob:")
							) {
								return;
							}
							return click.call(this);
						};
					}, earlier);
					page.on("pageerror", error => errors.push(String(error)));
					await page.setRequestInterception(true);
					page.on("request", (request) => {
						void (async () => {
							const url = new URL(request.url());
							const cors = { "access-control-allow-origin": "*" };
							if (url.hostname === "api.github.com") {
								assert.ok(
									inIde,
									"Source lookup occurred before the IDE"
								);
								const prefix
									= `/repos/${
										fixture.repository
									}/contents/`;
								assert.ok(url.pathname.startsWith(prefix));
								const revision = url.searchParams.get("ref");
								assert.ok(Object.hasOwn(sources, revision));
								fetches++;
								await request.respond({
									status: 200,
									contentType: "application/json",
									headers: cors,
									body: JSON.stringify(
										directory(
											revision,
											decodeURIComponent(
												url.pathname.slice(
													prefix.length
												)
											)
										)
									)
								});
							}
							else if (
								url.hostname === "raw.githubusercontent.com"
							) {
								assert.ok(inIde);
								const prefix = `/${fixture.repository}/`;
								assert.ok(url.pathname.startsWith(prefix));
								const [revision, ...path] = decodeURIComponent(
									url.pathname.slice(prefix.length)
								).split("/");
								const content
									= sources[revision]?.[path.join("/")];
								assert.equal(
									typeof content,
									"string",
									url.pathname
								);
								fetches++;
								await request.respond({
									status: 200,
									contentType: "text/plain",
									headers: cors,
									body: content
								});
							}
							else if (
								url.origin === origin
								&& url.pathname.startsWith("/api/")
							) {
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
										apiResponse(url.pathname, role, inIde)
									)
								});
							}
							else {
								await request.continue();
							}
						})().catch((error) => {
							errors.push(String(error));
							void request.abort().catch(() => {});
						});
					});
					for (const body of bodies) {
						failing = `${role}-${width}-${body.title}`;
						await page.goto(`${origin}/courses#${body.module}`, {
							waitUntil: "domcontentloaded"
						});
						const reading = body.contentKind === "reading";
						const position = reading
							? 3
							: body.group === "curriculum"
								? 1
								: 2;
						const button
							= `.lesson-view-toggle button:nth-child(${
								position
							})`;
						await page.locator(button).click();
						await page.waitForSelector(
							`${button}[aria-pressed='true']`
						);
						const card = `#${body.module}-${body.item}`;
						await page.waitForSelector(card);
						const markup = reading
							? body.content
							: `### Assignment\n\n${
								body.content.replace(
									/^\*\*Verification:\*\*/gmu,
									"### Verification\n\n"
								)}`;
						const expected = await page.evaluate((html) => {
							const node = document.createElement("div");
							node.innerHTML = html;
							return node.textContent
								.replace(/\s+/gu, " ")
								.trim();
						}, markdown.render(markup));
						const selector
							= card
								+ (reading
									? " .item-content-markdown"
									: " .assignment-content");
						const textMode = reading ? "textContent" : "innerText";
						await page.waitForSelector(selector);
						const actual = await page.$eval(
							selector,
							(node, mode) =>
								node[mode].replace(/\s+/gu, " ").trim(),
							textMode
						);
						assert.equal(actual, expected, failing);
						const keys = await page.$$eval(`${card} a`, links =>
							links
								.map(link => new URL(link.href))
								.filter(url => url.pathname === "/ide")
								.map(url => url.searchParams.get("projectKey")));
						if (!body.folder) {
							assert.deepEqual(keys, []);
						}
						else if (role === "learner") {
							assert.ok(
								keys.every(
									key => key && !key.includes(":reference:")
								)
							);
						}
						assert.equal(
							await page.evaluate(
								() =>
									document.documentElement.scrollWidth
									<= innerWidth
							),
							true
						);
						views.push({
							item: body.item,
							role,
							width,
							textSHA256: hash(actual)
						});
					}
					const readingScreenshot
						= `${role}-${width}-lesson.png`;
					await page.screenshot({
						path: join(output, readingScreenshot)
					});
					screenshots.push(readingScreenshot);
					assert.equal(fetches, 0);
					for (const [index, body] of bodies
						.filter(item => item.folder)
						.entries()) {
						const pack = fixture.packs[body.folder];
						if (pack.item !== body.item)
							throw new Error("Unexpected source owner");
						for (const sourceRole of role === "learner"
							? ["starter"]
							: ["starter", "solution"]) {
							const mobile
								= (index
									+ (role === "instructor" ? 1 : 0)
									+ (sourceRole === "solution" ? 1 : 0))
								% 2
								=== 0;
							if ((width === 390) !== mobile) continue;
							const label
								= `${role
								}-${
									width
								}-${
									index
								}-${
									sourceRole}`;
							failing = label;
							console.log(
								JSON.stringify({
									event: "import",
									label,
									activity: body.title
								})
							);
							const key
								= `${courseID
								}:${
									body.folder
								}:${
									sourceRole === "starter"
										? "starter"
										: "reference"
								}:${
									pack.keySuffix}`;
							inIde = false;
							const href = await courseAction(page, origin, {
								...body,
								key,
								name: body.title
							});
							assert.equal(
								new URL(href, origin).searchParams.get(
									"starterUrl"
								),
								`https://github.com/${
									fixture.repository
								}/tree/${
									pack.revision
								}/${
									body.folder
								}/${
									sourceRole}`
							);
							const beforeFetch = fetches;
							inIde = true;
							await page.goto(origin + href, {
								waitUntil: "domcontentloaded"
							});
							await page.waitForSelector(
								"[data-testid='ide-route-import-confirm']"
							);
							assert.equal(fetches, beforeFetch);
							await page
								.locator(
									".code-ide-route-import-actions button:nth-child(2)"
								)
								.click();
							assert.equal(fetches, beforeFetch);
							assert.ok(
								!(await savedProjects(page)).some(
									project => project.courseProjectKey === key
								)
							);
							await page.goto(origin + href, {
								waitUntil: "domcontentloaded"
							});
							await confirmProjectImport(page);
							const initial = pack.roles[sourceRole];
							const imported = await waitSaved(
								page,
								key,
								project =>
									project.files.length
									=== Object.keys(initial.files).length
							);
							assert.equal(imported.mode, "data");
							assert.deepEqual(
								fileHashes(imported),
								initial.files
							);
							const observed = await runProject(
								page,
								width,
								initial.stdout
							);
							const originalFiles = {
								...initial.files,
								...initial.generated
							};
							await waitSaved(page, key, project =>
								Object.keys(originalFiles).every(
									name =>
										fileHashes(project)[name]
										=== originalFiles[name]
								));
							const exports = {
								original: await exportProject(
									page,
									`${label}-original.zip`,
									originalFiles,
									observed
								)
							};
							const marker
								= `saved_${label.replaceAll("-", "_")}`;
							if (sourceRole === "starter") {
								const completed
									= `${sources[pack.revision][
										`${body.folder}/solution/main.py`
									]
									}\nprint(${
										JSON.stringify(marker)
									})\n`;
								await replaceMain(page, width, key, completed);
								const expected = pack.roles.solution;
								const completedFiles = {
									...initial.files,
									"main.py": hash(completed),
									...expected.generated
								};
								await runProject(
									page,
									width,
									`${expected.stdout + marker}\n`
								);
								await waitSaved(page, key, project =>
									Object.keys(completedFiles).every(
										name =>
											fileHashes(project)[name]
											=== completedFiles[name]
									));
								const count = fetches;
								await page.reload({
									waitUntil: "domcontentloaded"
								});
								await page.waitForSelector(
									"select[aria-label='Active project file']"
								);
								const restored = await waitSaved(page, key);
								assert.equal(restored._id, imported._id);
								assert.deepEqual(
									fileHashes(restored),
									completedFiles
								);
								assert.equal(
									await page.$(
										"[data-testid='ide-route-import-confirm']"
									),
									null
								);
								assert.equal(fetches, count);
								const replay = await runProject(
									page,
									width,
									`${expected.stdout + marker}\n`
								);
								exports.edited = await exportProject(
									page,
									`${label}-edited.zip`,
									completedFiles,
									replay
								);
							}
							assert.deepEqual(
								(await savedProjects(page)).find(
									project => project._id === earlier._id
								)?.files,
								earlier.files
							);
							if (sourceRole === "starter" && index === 0) {
								const screenshot = `${label}-ide.png`;
								await page.screenshot({
									path: join(output, screenshot)
								});
								screenshots.push(screenshot);
							}
							imports.push({
								folder: body.folder,
								role,
								width,
								sourceRole,
								marker,
								exports,
								consentChecked: true,
								priorWorkRetained: true
							});
						}
					}
					assert.deepEqual(errors, []);
					assert.equal(writes, 0);
					await context.close();
					context = null;
				}
			}
			assert.equal(views.length, 104);
			assert.equal(imports.length, 27);
			complete = true;
		}
		catch (error) {
			failure = {
				profile: failing,
				message: String(error),
				stack: error.stack
			};
			if (page && !page.isClosed()) {
				await page
					.screenshot({ path: join(output, "failure.png") })
					.catch(() => {});
			}
			throw error;
		}
		finally {
			await cleanup();
			process.chdir(previousDirectory);
			await writeFile(
				join(output, "browser-proof.json"),
				`${JSON.stringify(
					{ site, complete, views, imports, screenshots, failure },
					null,
					2
				)}\n`
			);
		}
	}
);
