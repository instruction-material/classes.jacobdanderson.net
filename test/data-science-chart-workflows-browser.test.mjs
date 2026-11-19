import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
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
import { courseAction, exportedBytes, savedProjects, waitSaved } from "./pygames-core-browser-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixture = JSON.parse(await readFile(new URL("./fixtures/data-science-chart-code-packs.json", import.meta.url), "utf8"));
const output = resolve(process.env.DATA_SCIENCE_CHART_BROWSER_PROOF_DIR ?? "output/data-science-chart");
const courseID = "data-science-in-python";
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const digest = value => createHash("sha256").update(value).digest("hex");
const keyFor = (activity, role = "starter") => `${courseID}:${activity.folder}:${role}:chart-studio-v1`;
const markdown = new MarkdownIt();

function account(path, role, inIde) {
	if (inIde) return {};
	const learner = { _id: "csv-learner", name: "Learner", email: "learner@example.invalid", age: 14, state: "GA", courseAccess: [courseID], courseProgress: [] };
	if (path === "/api/accounts/me") return role === "instructor" ? { tutorID: "csv-tutor" } : { userID: learner._id };
	if (path === "/api/users/loggedin" && role === "learner") return { currentUser: learner };
	if (path === "/api/tutors/loggedin" && role === "instructor") return { currentTutor: { _id: "csv-tutor", name: "Tutor", email: "tutor@example.invalid", age: 30, state: "GA", coursePermissions: [courseID], usersOfTutorLength: 1, editTutors: false, saveEdit: "Save" } };
	if (path === "/api/users/oftutor/csv-tutor") return [learner];
	return {};
}

function directory(path) {
	const children = new Map();
	for (const [name, file] of Object.entries(fixture.files)) {
		if (!name.startsWith(`${path}/`)) continue;
		const suffix = name.slice(path.length + 1);
		const first = suffix.split("/")[0];
		children.set(first, suffix.includes("/")
			? { type: "dir", name: first, path: `${path}/${first}` }
			: {
					type: "file",
					name: first,
					path: name,
					size: file.bytes,
					html_url: `https://github.com/${fixture.repository}/blob/${fixture.revision}/${name}`,
					download_url: `https://raw.githubusercontent.com/${fixture.repository}/${fixture.revision}/${name}`
				});
	}
	return [...children.values()];
}

async function edit(page, width, key, filename, content) {
	if (width < 900) await page.locator(".mobile-view-picker button[data-view='code']").click();
	await page.select("select[aria-label='Active project file']", filename);
	await page.waitForSelector(".cm-content", { visible: true });
	await page.focus(".cm-content");
	const modifier = await page.evaluate(() => /Mac/.test(navigator.platform) ? "Meta" : "Control");
	await page.keyboard.down(modifier);
	await page.keyboard.press("a");
	await page.keyboard.up(modifier);
	await page.keyboard.sendCharacter(content);
	await page.keyboard.down(modifier);
	await page.keyboard.press("s");
	await page.keyboard.up(modifier);
	return waitSaved(page, key, project => project.files.some(file => file.name === filename && file.content === content));
}

function normalizePaths(text) {
	return text.replace(/^(Chart saved as|Weak comparison saved as) .*[/\\]([^/\\]+)$/gm, "$1 $2");
}

function assertSVG(svg, metric = "mean", weak = false) {
	assert.ok(svg.includes("<svg"));
	const wanted = weak ? ["Deliberately weak comparison"] : [
		metric === "total" ? "Total recorded trips by site" : "Mean recorded trips by site",
		metric === "total" ? "Total recorded trips" : "Mean trips per record",
		"Synthetic collection site", "north", "south", "west",
		...(metric === "total" ? ["6 (n=2)", "8 (n=1)", "18 (n=3)"] : ["3 (n=2)", "8 (n=1)", "6 (n=3)"])
	];
	for (const label of wanted) assert.ok(svg.includes(label), label);
	if (weak) return { deliberatelyWeak: true };
	const geometry = [2, 3, 4].map(index => {
		const group = svg.match(new RegExp(`<g id="patch_${index}">([\\s\\S]*?)<\\/g>`));
		assert.ok(group, `bar ${index}`);
		const path = group[1].match(/d="([^"]+)"/)[1];
		const points = [...path.matchAll(/[ML]\s+([-\d.]+)\s+([-\d.]+)/g)].map(match => match.slice(1).map(Number));
		assert.equal(points.length, 4);
		assert.equal(points[0][1], points[1][1]);
		assert.equal(points[2][1], points[3][1]);
		return { bottom: points[0][1], height: points[0][1] - points[2][1] };
	});
	const heights = metric === "total" ? [6, 8, 18] : [3, 8, 6];
	for (const [i, bar] of geometry.entries()) {
		assert.ok(Math.abs(bar.bottom - geometry[0].bottom) < 0.001);
		assert.ok(Math.abs(bar.height / geometry[0].height - heights[i] / heights[0]) < 0.001);
	}
	return { metric, geometry, labels: wanted };
}

async function savedFigures(page, key, names) {
	const project = await waitSaved(page, key, project => names.every(name => project.files.some(file => file.name === name)));
	const figures = names.map(name => {
		const file = project.files.find(file => file.name === name);
		return { name, sha256: digest(file.content), ...assertSVG(file.content, name === "totals.svg" ? "total" : "mean", name.endsWith("-weak.svg")) };
	});
	await page.waitForFunction(count => [...document.querySelectorAll(".artifact-card img")].filter(image => image.complete && image.naturalWidth > 0).length === count, {}, names.length);
	return { project, figures };
}

async function run(page, width, expectedText) {
	// Console batching omits empty lines; the exported files retain their bytes.
	const expected = expectedText.split("\n").filter(line => line !== "").join("\n");
	if (width < 900) await page.locator(".mobile-view-picker button[data-view='code']").click();
	await page.locator("button.run-control").click();
	if (width < 900) await page.locator(".mobile-view-picker button[data-view='console']").click();
	await page.waitForFunction((expected) => {
		const status = document.querySelector("[data-testid='ide-run-status']")?.textContent.trim();
		const stdout = [...document.querySelectorAll(".output-line--stdout")].map(node => node.textContent).join("\n").replace(/^(Chart saved as|Weak comparison saved as) .*[/\\]([^/\\]+)$/gm, "$1 $2");
		return ["Run failed", "Run finished with issues"].includes(status) || (status === "Analysis ready" && stdout === expected);
	}, { timeout: 90000 }, expected);
	const observed = await page.evaluate(() => ({
		status: document.querySelector("[data-testid='ide-run-status']")?.textContent.trim(),
		stdout: [...document.querySelectorAll(".output-line--stdout")].map(node => node.textContent).join("\n"),
		stderr: [...document.querySelectorAll(".output-line--stderr")].map(node => node.textContent).join("\n")
	}));
	assert.equal(observed.status, "Analysis ready", JSON.stringify(observed));
	assert.equal(observed.stderr, "");
	assert.equal(normalizePaths(observed.stdout), expected, JSON.stringify(observed));
	return observed;
}

async function zip(page, project, label) {
	const bytes = await exportedBytes(page);
	const entries = unzipSync(bytes);
	assert.equal(Object.keys(entries).length, project.files.length);
	for (const file of project.files) {
		const names = Object.keys(entries).filter(name => name.endsWith(`/${file.name}`));
		assert.equal(names.length, 1);
		assert.deepEqual(Buffer.from(entries[names[0]]), Buffer.from(file.content, "utf8"));
	}
	await writeFile(join(output, `${label}.zip`), bytes);
	return { file: `${label}.zip`, sha256: digest(bytes), members: Object.fromEntries(Object.entries(entries).map(([name, bytes]) => [name, digest(bytes)])) };
}

const table = "Synthetic recorded trips by site\nsite | records | total trips | mean trips per record\nnorth | 2 | 6 | 3.00\nsouth | 1 | 8 | 8.00\nwest | 3 | 18 | 6.00\n";
const question = metric => table + (metric === "total" ? "Question: How many total trips were recorded at each site?" : "Question: What mean trip count was recorded at each site?") + "\nSynthetic practice records; unequal record counts describe no real site or population.";
const result = (activity, role, metric = "mean", filename = "chart.svg") => question(metric)
	+ (activity.title === "Weak Chart Redesign" ? "\nWeak comparison saved as chart-weak.svg" : "")
	+ (role === "starter" ? "\nTODO: make the labeled zero-baseline chart" : `\nChart saved as ${filename}`);

test("Data Science complete chart teaching, visible figures, saved continuation and exact native exports", { timeout: 1200000 }, async (t) => {
	const startedAt = new Date().toISOString();
	const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "data-science-chart-browser";
	const previousDirectory = process.cwd();
	const profiles = [];
	const readingViews = [];
	const errors = [];
	let browser, context, server, page;
	let currentLabel = "";
	let complete = false;
	async function cleanup() {
		if (context) await context.close().catch(() => {});
		context = null;
		if (browser) await browser.close().catch(() => {});
		browser = null;
		if (server) await server.close();
		server = null;
	}
	t.signal.addEventListener("abort", () => {
		void cleanup();
	}, { once: true });
	console.log(JSON.stringify({ event: "start", taskId, cwd: root, command: process.argv, pid: process.pid, parentPid: process.ppid, startedAt, timeoutMs: 1200000 }));
	try {
		await mkdir(output, { recursive: true });
		for (const [name, file] of Object.entries(fixture.files)) {
			assert.equal(digest(file.content), file.sha256, name);
			assert.equal(Buffer.byteLength(file.content), file.bytes, name);
		}
		process.chdir(root);
		assert.ok(existsSync(join(root, "dist/index.html")));
		server = await preview({ root, preview: { host: "127.0.0.1", port: 0, strictPort: true } });
		const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
		const executablePath = [
			process.env.PUPPETEER_EXECUTABLE_PATH,
			puppeteer.executablePath(),
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
			"/usr/bin/google-chrome",
			"/usr/bin/chromium"
		].find(path => typeof path === "string" && existsSync(path));
		assert.ok(executablePath, "Chrome is required");
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
		const browserPid = browser.process()?.pid;
		console.log(JSON.stringify({ event: "browser-start", taskId, pid: browserPid, parentPid: process.pid, command: browser.process()?.spawnargs, startTime: new Date().toISOString() }));
		for (const role of ["learner", "instructor"]) {
			for (const width of [390, 1280]) {
				context = await browser.createBrowserContext();
				page = await context.newPage();
				page.setDefaultTimeout(30000);
				await page.setViewport({ width, height: 950 });
				const pageErrors = [];
				const requests = [];
				let writes = 0;
				let inIde = false;
				const earlier = fixture.activities.slice(0, 1).map(activity => ({ _id: "earlier-csv-work", title: "Earlier cleaning work", mode: "data", courseID, courseProjectKey: `${courseID}:${activity.item}:starter`, activeFileName: "main.py", files: [{ name: "main.py", content: "print('earlier cleaning work retained')\n", encoding: "text" }], createdAt: "2026-10-01T12:00:00.000Z", updatedAt: "2026-10-01T12:00:00.000Z" }));
				await page.evaluateOnNewDocument((previous) => {
					if (window !== window.top) return;
					const storage = "classes-python-ide-projects:anonymous";
					if (localStorage.getItem(storage) === null) localStorage.setItem(storage, JSON.stringify(previous));
					const create = URL.createObjectURL;
					URL.createObjectURL = (blob) => {
						if (blob.type === "application/zip") window.__pyGamesArchive = blob;
						return create(blob);
					};
					const click = HTMLAnchorElement.prototype.click;
					HTMLAnchorElement.prototype.click = function () {
						if (this.download.endsWith(".zip") && this.href.startsWith("blob:")) return;
						return click.call(this);
					};
				}, earlier);
				page.on("pageerror", error => pageErrors.push(String(error)));
				await page.setRequestInterception(true);
				page.on("request", (request) => {
					void (async () => {
						const url = new URL(request.url());
						const headers = { "access-control-allow-origin": "*" };
						if (url.hostname === "api.github.com") {
							assert.equal(url.searchParams.get("ref"), fixture.revision);
							const prefix = `/repos/${fixture.repository}/contents/`;
							assert.ok(url.pathname.startsWith(prefix));
							const path = decodeURIComponent(url.pathname.slice(prefix.length));
							requests.push({ type: "directory", path, inIde });
							await request.respond({ status: 200, contentType: "application/json", headers, body: JSON.stringify(directory(path)) });
						}
						else if (url.hostname === "raw.githubusercontent.com") {
							const prefix = `/${fixture.repository}/${fixture.revision}/`;
							assert.ok(url.pathname.startsWith(prefix));
							const path = decodeURIComponent(url.pathname.slice(prefix.length));
							assert.ok(fixture.files[path], path);
							requests.push({ type: "file", path, inIde, sha256: fixture.files[path].sha256 });
							await request.respond({ status: 200, contentType: "text/plain", headers, body: fixture.files[path].content });
						}
						else if (url.pathname.startsWith("/api/")) {
							if (!["GET", "OPTIONS"].includes(request.method())) writes++;
							await request.respond({ status: 200, contentType: "application/json", body: JSON.stringify(account(url.pathname, role, inIde)) });
						}
						else {
							await request.continue();
						}
					})().catch((error) => {
						pageErrors.push(String(error));
						void request.abort().catch(() => {});
					});
				});
				for (const body of fixture.bodies) {
					currentLabel = `${role}-${width}-reading-${body.item}`;
					inIde = false;
					await page.goto(`${origin}/courses#${body.module}`, { waitUntil: "domcontentloaded" });
					const position = body.contentKind === "reading" ? 3 : body.group === "curriculum" ? 1 : 2;
					const view = `.lesson-view-toggle button:nth-child(${position})`;
					await page.locator(view).click();
					await page.waitForSelector(`${view}[aria-pressed='true']`);
					const selector = `#${body.module}-${body.item}`;
					await page.waitForSelector(selector);
					const displayedContent = body.contentKind === "reading"
						? body.content
						: `### Assignment\n\n${body.content.replace(/^\*\*Verification:\*\*/gm, "### Verification\n\n")}`;
					const expectedText = await page.evaluate((html) => {
						const div = document.createElement("div");
						div.innerHTML = html;
						return div.textContent.replace(/\s+/g, " ").trim();
					}, markdown.render(displayedContent));
					const contentSelector = `${selector} ${body.contentKind === "reading" ? ".item-content-markdown" : ".assignment-content"}`;
					const textMode = body.contentKind === "reading" ? "textContent" : "innerText";
					await page.waitForFunction(({ selector, text, mode }) => document.querySelector(selector)?.[mode].replace(/\s+/g, " ").trim() === text, {}, { selector: contentSelector, text: expectedText, mode: textMode })
						.catch(async (error) => {
							const actual = await page.$eval(contentSelector, (node, mode) => node[mode].replace(/\s+/g, " ").trim(), textMode);
							throw new Error(`${body.title}: complete text mismatch. Expected: ${expectedText}\nActual: ${actual}`, { cause: error });
						});
					if (body.sourceFree) assert.equal((await page.$$eval(`${selector} a`, links => links.map(link => link.getAttribute("href")))).filter(href => href?.startsWith("/ide?")).length, 0);
					assert.equal(await page.$("vite-error-overlay"), null);
					assert.ok((await page.title()).length > 0);
					assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
					readingViews.push({ role, width, item: body.item, completeTextSHA256: digest(expectedText), sourceFree: body.sourceFree });
					console.log(JSON.stringify({ event: "reading-accepted", role, width, item: body.item }));
				}
				assert.equal(requests.length, 0, "Reading does not download starter code");
				const unique = fixture.activities.filter(activity => activity.title !== "Second-Question Chart Extension");
				for (const activity of unique) {
					for (const sourceRole of role === "instructor" ? ["starter", "reference"] : ["starter"]) {
						currentLabel = `${role}-${width}-${unique.indexOf(activity)}-${sourceRole}`;
						console.log(JSON.stringify({ event: "ide-profile-start", label: currentLabel }));
						const key = keyFor(activity, sourceRole);
						inIde = false;
						const href = await courseAction(page, origin, { ...activity, key, name: activity.title });
						const sourcePathRole = sourceRole === "reference" ? "solution" : "starter";
						assert.equal(new URL(href, origin).searchParams.get("starterUrl"), `https://github.com/${fixture.repository}/tree/${fixture.revision}/${activity.folder}/${sourcePathRole}`);
						const requestCount = requests.length;
						inIde = true;
						await page.goto(origin + href, { waitUntil: "domcontentloaded" });
						await page.waitForSelector("[data-testid='ide-route-import-confirm']");
						assert.equal(requests.length, requestCount);
						await page.locator(".code-ide-route-import-actions button:nth-child(2)").click();
						assert.equal(requests.length, requestCount);
						assert.ok(!(await savedProjects(page)).some(project => project.courseProjectKey === key));
						await page.goto(origin + href, { waitUntil: "domcontentloaded" });
						await confirmProjectImport(page);
						const imported = await waitSaved(page, key, project => project.files.length === 4);
						assert.equal(imported.mode, "data");
						for (const file of imported.files) assert.equal(digest(file.content), fixture.files[`${activity.folder}/${sourcePathRole}/${file.name}`].sha256);
						const originalExport = await zip(page, imported, `${currentLabel}-original`);
						const before = await run(page, width, result(activity, sourceRole));
						const weak = activity.title === "Weak Chart Redesign";
						const beforeNames = [...(weak ? ["chart-weak.svg"] : []), ...(sourceRole === "reference" ? ["chart.svg"] : [])];
						const originalFigures = beforeNames.length ? (await savedFigures(page, key, beforeNames)).figures : [];
						const marker = `chart_saved_${currentLabel.replaceAll("-", "_")}`;
						const completed = `${fixture.files[`${activity.folder}/solution/main.py`].content}\nprint(${JSON.stringify(marker)})\n`;
						await edit(page, width, key, "main.py", completed);
						const after = await run(page, width, `${result(activity, "reference")}\n${marker}`);
						const saved = await savedFigures(page, key, [...(weak ? ["chart-weak.svg"] : []), "chart.svg"]);
						const edited = saved.project;
						await page.reload({ waitUntil: "domcontentloaded" });
						await page.waitForSelector("select[aria-label='Active project file']");
						const reopened = await waitSaved(page, key);
						assert.equal(reopened._id, imported._id);
						assert.deepEqual(reopened.files, edited.files);
						assert.equal(await page.$("[data-testid='ide-route-import-confirm']"), null);
						const resumed = await run(page, width, `${result(activity, "reference")}\n${marker}`);
						const retained = await savedFigures(page, key, [...(weak ? ["chart-weak.svg"] : []), "chart.svg"]);
						const editedExport = await zip(page, retained.project, `${currentLabel}-edited`);
						// SVGs contain runtime metadata and generated IDs; compare their labels and bar geometry.
						assert.deepEqual(retained.figures.map(({ sha256, ...value }) => value), saved.figures.map(({ sha256, ...value }) => value));
						if (activity.title === "Chart Integrity Build" && sourceRole === "starter") {
							const extension = fixture.activities.find(item => item.title === "Second-Question Chart Extension");
							inIde = false;
							const extensionHref = await courseAction(page, origin, { ...extension, key, name: extension.title });
							inIde = true;
							await page.goto(origin + extensionHref, { waitUntil: "domcontentloaded" });
							await page.waitForSelector("select[aria-label='Active project file']");
							assert.equal(await page.$("[data-testid='ide-route-import-confirm']"), null);
							const continued = await waitSaved(page, key);
							assert.equal(continued._id, imported._id);
							assert.deepEqual(continued.files, retained.project.files);
							const extensionCode = `${completed}main(["--metric", "total", "--output", str(PROJECT_DIR / "totals.svg")])\n`;
							await edit(page, width, key, "main.py", extensionCode);
							const extensionResult = await run(page, width, `${result(activity, "reference")}\n${marker}\n${result(activity, "reference", "total", "totals.svg")}`);
							const extensionFigures = await savedFigures(page, key, ["chart.svg", "totals.svg"]);
							const extensionExport = await zip(page, extensionFigures.project, `${currentLabel}-extension`);
							profiles.push({ label: `${currentLabel}-extension`, role, width, activity: extension.item, key, extensionOf: imported._id, originalExport: extensionExport, before: extensionResult, figures: extensionFigures.figures });
						}
						assert.deepEqual((await savedProjects(page)).find(project => project._id === earlier[0]._id).files, earlier[0].files);
						assert.ok(requests.every(request => request.inIde));
						assert.deepEqual(pageErrors, []);
						assert.equal(writes, 0);
						if (width < 900) await page.locator(".mobile-view-picker button[data-view='canvas']").click();
						await page.$eval(".artifact-card img", image => image.scrollIntoView({ block: "center", behavior: "instant" }));
						assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
						await page.screenshot({ path: join(output, `${currentLabel}.png`) });
						profiles.push({ label: currentLabel, role, width, activity: activity.item, sourceRole, key, originalExport, editedExport, before, after, resumed, consentVerified: true, earlierAttemptPreserved: true, continuedWithoutImport: true, originalFigures, figures: retained.figures });
					}
				}
				await context.close();
				context = null;
			}
		}
		assert.equal(readingViews.length, 28);
		assert.equal(profiles.length, 16);
		complete = true;
	}
	catch (error) {
		errors.push({ profile: currentLabel, error: String(error), stack: error.stack });
		if (page && !page.isClosed()) await page.screenshot({ path: join(output, "failure.png"), fullPage: true }).catch(() => {});
		throw error;
	}
	finally {
		await cleanup();
		process.chdir(previousDirectory);
		await mkdir(output, { recursive: true });
		await writeFile(join(output, "proof.json"), `${JSON.stringify({ startedAt, finishedAt: new Date().toISOString(), sourceCommit, sourceRevision: fixture.revision, complete, expectedReadingViews: 28, expectedProfiles: 16, profiles, readingViews, errors, wholeCourseAccepted: false, browserPath: "Browser plugin not available; existing repository Puppeteer workflow", targetFlow: "Course reading and task -> confirmed chart import -> actual Matplotlib figures -> edited saved work -> continued extension and exact ZIP", cleanup: "Pages, contexts, browser and preview server closed in finally." }, null, 2)}\n`);
		console.log(JSON.stringify({ event: "end", taskId, pid: process.pid, endedAt: new Date().toISOString(), exitCode: complete ? 0 : 1, childProcessGroupCleanup: "closed browser contexts, browser and preview server", profiles: profiles.length, readingViews: readingViews.length }));
	}
});
