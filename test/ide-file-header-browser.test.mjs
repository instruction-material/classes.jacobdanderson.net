import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Verify the actual responsive IDE control bounds and keyboard interaction.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { preview } from "vite";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const filename = "Check_in_3_Additional_Practice_Solution.py";

test("keeps the full Shortcuts control reachable beside a long filename", { timeout: 120000 }, async () => {
	const startedAt = new Date().toISOString();
	const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "ide-file-header-browser";
	const output = process.env.IDE_FILE_HEADER_BROWSER_DIR ?? "output/ide-file-header";
	await mkdir(output, { recursive: true });
	const profiles = [];
	let browser;
	let server;
	let outcome = "failed";
	let browserPID;
	console.log(JSON.stringify({ event: "start", taskId, parentPid: process.ppid, pid: process.pid, cwd: process.cwd(), command: process.argv, startedAt, timeoutSeconds: 120 }));
	try {
		server = await preview({ root, preview: { host: "127.0.0.1", port: 0, strictPort: true } });
		const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
		const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, await puppeteer.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(path => typeof path === "string" && path && existsSync(path));
		assert.ok(executablePath);
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
		browserPID = browser.process()?.pid;
		console.log(JSON.stringify({ event: "browser-start", taskId, parentPid: process.pid, pid: browserPID, cwd: process.cwd(), command: browser.process()?.spawnargs, at: new Date().toISOString() }));
		for (const width of [390, 320, 1280]) {
			const context = await browser.createBrowserContext();
			let page;
			try {
				page = await context.newPage();
				await page.setViewport({ width, height: 1000 });
				let remoteWrites = 0;
				const errors = [];
				page.on("pageerror", error => errors.push(error.message));
				await page.setRequestInterception(true);
				page.on("request", (request) => {
					const url = new URL(request.url());
					if (!["GET", "HEAD"].includes(request.method())) {
						remoteWrites += 1;
						void request.abort();
					}
					else if (url.pathname.startsWith("/api/")) {
						void request.respond({ status: 200, contentType: "application/json", body: "{}" });
					}
					else if (/\/(?:python-ide|ide)\/assets\/manifest\.json/.test(url.pathname)) {
						void request.respond({ status: 200, contentType: "application/json", body: "{\"assets\":[]}" });
					}
					else if (url.origin === origin || ["data:", "blob:", "about:"].includes(url.protocol)) {
						void request.continue();
					}
					else {
						void request.abort();
					}
				});
				await page.evaluateOnNewDocument((name) => {
					if (window !== window.top) return;
					localStorage.setItem("classes-python-ide-projects:anonymous", JSON.stringify([{
						_id: "local-long-file-header",
						title: "Long filename",
						mode: "pgzero",
						activeFileName: name,
						files: [{ name, content: "# Layout fixture\n", encoding: "text" }],
						createdAt: "2026-10-01T12:00:00.000Z",
						updatedAt: "2026-10-01T12:00:00.000Z"
					}]));
				}, filename);
				await page.goto(`${origin}/ide`, { waitUntil: "networkidle2" });
				await page.waitForSelector(".cm-content");
				await page.waitForFunction(name => document.querySelector(".code-panel .panel-header > span")?.textContent === name, {}, filename);
				await page.evaluate(() => document.fonts.ready);
				const bounds = await page.evaluate(() => {
					const header = document.querySelector(".code-panel .panel-header");
					const label = header.querySelector(":scope > span");
					const trigger = header.querySelector(".editor-shortcuts button,.editor-shortcuts summary");
					return { header: header.getBoundingClientRect().toJSON(), label: label.getBoundingClientRect().toJSON(), trigger: trigger.getBoundingClientRect().toJSON(), text: trigger.textContent.trim(), filename: label.textContent, title: label.getAttribute("title"), viewport: innerWidth, ancestors: [header.parentElement, header.parentElement.parentElement, header.parentElement.parentElement.parentElement, header.parentElement.parentElement.parentElement.parentElement].map(node => ({ tag: node.tagName, classes: node.className, box: node.getBoundingClientRect().toJSON(), minWidth: getComputedStyle(node).minWidth, columns: getComputedStyle(node).gridTemplateColumns, overflow: getComputedStyle(node).overflowX })) };
				});
				const screenshot = join(output, `header-${width}.png`);
				await page.screenshot({ path: screenshot, fullPage: true });
				const row = { width, bounds, screenshot, remoteWrites, errors, accepted: false };
				profiles.push(row);
				await writeFile(join(output, "proof.json"), `${JSON.stringify({ accepted: false, profiles }, null, 2)}\n`);
				assert.equal(bounds.text, "Shortcuts");
				assert.ok(bounds.trigger.left >= bounds.header.left && bounds.trigger.right <= bounds.header.right + 1 && bounds.trigger.right <= width, JSON.stringify(bounds));
				assert.ok(bounds.label.right <= bounds.trigger.left + 1, JSON.stringify(bounds));
				assert.ok(bounds.trigger.width >= 44 && bounds.trigger.height >= 32);
				assert.equal(bounds.filename, filename);
				assert.equal(bounds.title, filename);
				await page.focus(".editor-shortcuts button,.editor-shortcuts summary");
				await page.keyboard.press("Enter");
				await page.waitForFunction(() => document.querySelector(".editor-shortcuts [aria-expanded]")?.getAttribute("aria-expanded") === "true");
				const panel = await page.$eval(".editor-shortcuts [aria-expanded]", node => document.getElementById(node.getAttribute("aria-controls")).getBoundingClientRect().toJSON());
				assert.ok(panel.width > 0 && panel.left >= 0 && panel.right <= width + 1);
				await page.keyboard.press("Escape");
				await page.waitForFunction(() => document.querySelector(".editor-shortcuts [aria-expanded]")?.getAttribute("aria-expanded") === "false");
				assert.ok(await page.$eval(".editor-shortcuts", node => node.contains(document.activeElement)));
				assert.equal(remoteWrites, 0);
				assert.deepEqual(errors, []);
				row.accepted = true;
				row.keyboardDisclosurePassed = true;
			}
			finally {
				await page?.close().catch(() => {});
				await context.close();
			}
		}
		assert.equal(profiles.length, 3);
		await writeFile(join(output, "proof.json"), `${JSON.stringify({ accepted: true, profiles }, null, 2)}\n`);
		outcome = "passed";
	}
	finally {
		await browser?.close();
		await new Promise(resolve => server ? server.httpServer.close(resolve) : resolve());
		console.log(JSON.stringify({ event: "end", taskId, parentPid: process.ppid, pid: process.pid, browserPID, cwd: process.cwd(), command: process.argv, startedAt, endedAt: new Date().toISOString(), outcome, exitCode: outcome === "passed" ? 0 : 1, timeoutSeconds: 120, cleanup: "Owned pages, contexts, browser and preview server closed" }));
	}
});
