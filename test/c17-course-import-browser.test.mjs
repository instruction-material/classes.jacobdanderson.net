import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI runner.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { confirmProjectImport, downloadProjectZip } from "./ide-workspace-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixture = JSON.parse(await readFile(new URL("./fixtures/c17-opening-contracts.json", import.meta.url), "utf8"));
const packs = [...new Set(Object.keys(fixture.files).map(path => path.split("/")[0]))];
const primarySources = {
	"CSE-05-cse0-setup-and-tooling": "main.c",
	"CSE-06-unit-1-why-c-for-systems-work": "labels.c",
	"CSE-07-unit-8-function-pointers-and-dispatch": "dispatch.c",
	"CSE-08-unit-10-engineering-math-in-code": "engineering_math.c",
	"CSE-09-unit-11-systems-tooling": "engineering_math.c",
	"CSE1-Hex-and-Binary-Inspector": "representation.c",
	"CSE2-Bitflag-Configuration-Parser": "configuration.c",
	"CSE3-XOR-Encoder-Decoder": "transform.c"
};
const storageKey = "classes-python-ide-projects:anonymous";
const preserved = { _id: "c17-preserved-attempt", title: "Earlier attempt", mode: "python", files: [{ name: "main.py", content: "# retain this attempt\n" }], activeFileName: "main.py", courseProjectKey: "c-systems-engineering:setup:starter" };
const legacyAttempts = [1280, 360].flatMap(width =>
	["light", "dark"].flatMap(theme =>
		packs.flatMap(pack =>
			["starter", "reference"].map((role) => {
				const key = `c-systems-engineering:${pack}-${width}-${theme}:${role}`;
				return { ...preserved, _id: `legacy:${key}`, title: "Earlier matching attempt", courseProjectKey: key };
			})
		)
	)
);

test("native C imports require consent and preserve source, saved attempts, roles and ZIP layout", { timeout: 600_000 }, async () => {
	let server;
	let browser;
	let context;
	let page;
	const captures = process.env.COURSE_IMPORT_SCREENSHOT_DIR ?? "output/playwright";
	await mkdir(captures, { recursive: true });
	const proof = [];
	try {
		server = await preview({ root, preview: { host: "127.0.0.1", port: 0, strictPort: true } });
		const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
		const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, puppeteer.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(path => path && existsSync(path));
		assert.ok(executablePath, "An existing Chrome installation is required");
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
		context = await browser.createBrowserContext();
		page = await context.newPage();
		await page.evaluateOnNewDocument((key, existing) => {
			// Seed every older attempt before the first IndexedDB migration.
			// Later navigations must use the editor's persisted project snapshot.
			if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(existing));
			const click = HTMLAnchorElement.prototype.click;
			HTMLAnchorElement.prototype.click = function () {
				if (this.download.endsWith(".zip") && this.href.startsWith("blob:")) return;
				return click.call(this);
			};
			const create = URL.createObjectURL;
			URL.createObjectURL = (blob) => {
				if (blob.type === "application/zip") window.__c17Archive = blob;
				return create(blob);
			};
		}, storageKey, [preserved, ...legacyAttempts]);
		await page.setRequestInterception(true);
		let sourceRequests = [];
		page.on("request", (request) => {
			const url = new URL(request.url());
			if (url.hostname === "raw.githubusercontent.com") {
				sourceRequests.push(url.pathname);
				const prefix = `/${fixture.repository}/`;
				const [revision, pack, ...parts] = url.pathname.slice(prefix.length).split("/");
				const file = url.pathname.startsWith(prefix) && revision === fixture.revisions[pack] ? fixture.files[`${pack}/${parts.join("/")}`] : null;
				void request.respond({ status: file ? 200 : 404, contentType: "text/plain", headers: { "access-control-allow-origin": "*" }, body: file?.content ?? "Unknown source" });
			}
			else if (url.origin !== origin || url.pathname.startsWith("/api/")) {
				void request.respond({ status: 200, contentType: "application/json", body: "{}" });
			}
			else {
				void request.continue();
			}
		});
		for (const width of [1280, 360]) {
			for (const theme of ["light", "dark"]) {
				for (const pack of packs) {
					const revision = fixture.revisions[pack];
					for (const role of ["starter", "solution"]) {
						await page.setViewport({ width, height: 900 });
						await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);
						// Each responsive case creates its own role key without changing any
						// previously saved project's files or the original course progress IDs.
						const item = `${pack}-${width}-${theme}`;
						const key = `c-systems-engineering:${item}:${role === "starter" ? "starter" : "reference"}:native-c17`;
						const params = new URLSearchParams({ course: "c-systems-engineering", mode: "c", projectKey: key, starterUrl: `https://github.com/${fixture.repository}/tree/${revision}/${pack}/${role}`, starterTitle: "C17 core project" });
						sourceRequests = [];
						await page.goto(`${origin}/ide?${params}`, { waitUntil: "domcontentloaded" });
						await page.waitForSelector("[data-testid='ide-route-import-confirm']");
						assert.equal(sourceRequests.length, 0, "No C source may be fetched before confirmation");
						await confirmProjectImport(page);
						await page.waitForFunction((storageKey, key) => JSON.parse(localStorage.getItem(storageKey) ?? "[]").some(project => project.courseProjectKey === key), {}, storageKey, key);
						const projects = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
						assert.deepEqual(projects.find(project => project._id === preserved._id), preserved);
						const legacyKey = key.replace(/:native-c17$/, "");
						const legacyAttempt = { ...preserved, _id: `legacy:${legacyKey}`, title: "Earlier matching attempt", courseProjectKey: legacyKey };
						assert.deepEqual(projects.find(project => project.courseProjectKey === legacyKey), legacyAttempt);
						const saved = projects.find(project => project.courseProjectKey === key);
						assert.equal(saved.mode, "c");
						assert.equal(saved.activeFileName, `${role}/main.c`);
						const expectedNames = Object.keys(fixture.files).filter(path => path.startsWith(`${pack}/${role}/`) || path === `${pack}/README.md` || path === `${pack}/unsafe_probe.c`).map(path => path.slice(pack.length + 1));
						assert.deepEqual(saved.files.map(file => file.name).sort(), expectedNames.sort());
						assert.equal(sourceRequests.length, saved.files.length);
						assert.ok(sourceRequests.every(path => !path.includes(role === "starter" ? "/solution/" : "/starter/")));
						for (const file of saved.files) assert.equal(file.content, fixture.files[`${pack}/${file.name}`].content);
						if (width < 900) await page.locator(".mobile-view-picker button[data-view='code']").click();
						await page.waitForSelector(".cm-content", { visible: true });
						await page.waitForSelector("button.run-control:not([disabled])");
						assert.equal(await page.$eval("button.run-control", button => button.textContent.trim()), "Build instructions");
						assert.equal(await page.$(".mobile-view-picker button[data-view='canvas']"), null);
						assert.equal(await page.$eval(".mobile-view-picker button[data-view='console']", button => button.textContent.trim()), "Instructions");
						assert.equal(await page.$eval(".result-panel .panel-header > span", span => span.textContent.trim()), "Build instructions");
						await page.click("button.run-control");
						await page.waitForFunction(() => [...document.querySelectorAll(".output-line")].some(line => line.textContent.includes("ctest --test-dir build")));
						if (pack.startsWith("CSE-09") && role === "starter") {
							assert.ok(await page.$eval(".result-panel", panel => panel.textContent.includes("intentionally fails strict compilation")));
						}
						if (pack === "CSE1-Hex-and-Binary-Inspector" && role === "starter") {
							assert.ok(await page.$eval(".result-panel", panel => panel.textContent.includes("Invalid input exits 2") && panel.textContent.includes("three representation functions")));
						}
						if (pack === "CSE2-Bitflag-Configuration-Parser") {
							assert.ok(await page.$eval(".result-panel", panel => panel.textContent.includes("all four modes are valid") && panel.textContent.includes("encryption flag only reports a bit")));
							if (role === "starter") assert.ok(await page.$eval(".result-panel", panel => panel.textContent.includes("Invalid input exits 2") && panel.textContent.includes("three configuration functions")));
						}
						if (pack === "CSE3-XOR-Encoder-Decoder") {
							assert.ok(await page.$eval(".result-panel", panel => panel.textContent.includes("at most 127 bytes") && panel.textContent.includes("empty messages are valid") && panel.textContent.includes("no secrecy or authentication")));
							if (role === "starter") assert.ok(await page.$eval(".result-panel", panel => panel.textContent.includes("select_xor_key and xor_byte") && panel.textContent.includes("Invalid input exits 2")));
						}
						assert.equal(await page.$("iframe[title='Isolated Python output']"), null);
						assert.ok(await page.$eval("body", body => body.textContent.includes("C17 build workflow") || document.querySelector("[aria-label='C17 build workflow']") !== null));
						await downloadProjectZip(page);
						const base64 = await page.evaluate(async () => {
							const bytes = new Uint8Array(await window.__c17Archive.arrayBuffer());
							return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(""));
						});
						const entries = unzipSync(Buffer.from(base64, "base64"));
						for (const file of saved.files) {
							const source = fixture.files[`${pack}/${file.name}`];
							const path = Object.keys(entries).find(path => path.endsWith(`/${file.name}`));
							assert.ok(path);
							assert.equal(strFromU8(entries[path]), source.content);
							assert.equal(createHash("sha256").update(entries[path]).digest("hex"), source.sha256);
						}
						if (width < 900) await page.locator(".mobile-view-picker button[data-view='code']").click();
						await page.waitForSelector(".cm-content", { visible: true });
						const editFile = `${role}/${primarySources[pack]}`;
						assert.ok(primarySources[pack], "Every verified pack identifies its actual learner implementation file");
						await page.select("select[aria-label='Active project file']", editFile);
						await page.waitForFunction((storageKey, key, name) => JSON.parse(localStorage.getItem(storageKey)).find(project => project.courseProjectKey === key)?.activeFileName === name, {}, storageKey, key, editFile);
						const edit = `${saved.files.find(file => file.name === editFile).content}\n/* Saved C editor attempt. */\n`;
						await page.click(".cm-content");
						const modifier = await page.evaluate(() => /Mac/.test(navigator.platform) ? "Meta" : "Control");
						await page.keyboard.down(modifier);
						await page.keyboard.press("a");
						await page.keyboard.up(modifier);
						await page.keyboard.sendCharacter(edit);
						await page.keyboard.down(modifier);
						await page.keyboard.press("s");
						await page.keyboard.up(modifier);
						await page.waitForFunction((storageKey, key, name, content) => JSON.parse(localStorage.getItem(storageKey)).find(project => project.courseProjectKey === key)?.files.some(file => file.name === name && file.content === content), {}, storageKey, key, editFile, edit);
						const expectedSavedFiles = saved.files.map(file => file.name === editFile ? { ...file, content: edit } : file);
						await downloadProjectZip(page);
						const editedZip = await page.evaluate(async () => {
							const bytes = new Uint8Array(await window.__c17Archive.arrayBuffer());
							return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(""));
						});
						const editedEntries = unzipSync(Buffer.from(editedZip, "base64"));
						assert.equal(Object.keys(editedEntries).length, expectedSavedFiles.length);
						for (const file of expectedSavedFiles) {
							const path = Object.keys(editedEntries).find(path => path.endsWith(`/${file.name}`));
							assert.ok(path);
							assert.equal(strFromU8(editedEntries[path]), file.content);
						}
						assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
						const capture = `course-import-c17-${pack}-${role}-${width}-${theme}.png`;
						await page.screenshot({ path: join(captures, capture), fullPage: true });
						await page.reload({ waitUntil: "domcontentloaded" });
						await page.waitForSelector("button.run-control:not([disabled])");
						const reloaded = await page.evaluate((storageKey, key) => JSON.parse(localStorage.getItem(storageKey)).find(project => project.courseProjectKey === key), storageKey, key);
						assert.deepEqual(reloaded.files, expectedSavedFiles);
						assert.equal(reloaded.activeFileName, editFile);
						const legacyReloaded = await page.evaluate((storageKey, legacyKey) => JSON.parse(localStorage.getItem(storageKey)).find(project => project.courseProjectKey === legacyKey), storageKey, legacyKey);
						assert.deepEqual(legacyReloaded, legacyAttempt);
						proof.push({ pack, revision, role, width, theme, editedFile: editFile, matchingLegacySlotPreserved: true, files: saved.files.length, capture, byteExact: true, editedExportPreserved: true, savedAttemptPreserved: true });
					}
				}
			}
		}
		assert.equal(proof.length, packs.length * 8);
		await writeFile(join(captures, "c17-workflow-proof.json"), `${JSON.stringify({ revisions: fixture.revisions, imports: proof.length, cases: proof }, null, 2)}\n`);
		console.log(JSON.stringify({ event: "c17-browser-workflow-accepted", sourceRevision: fixture.revision, sourceRevisions: fixture.revisions, packs: packs.length, imports: proof.length, exports: proof.length * 2, editedExports: proof.length, savedAttemptPreserved: true, legacySlotsPreserved: proof.length, primarySourceEdits: true }));
	}
	finally {
		await page?.close();
		await context?.close();
		await browser?.close();
		await new Promise(resolve => server?.httpServer ? server.httpServer.close(resolve) : resolve());
	}
});
