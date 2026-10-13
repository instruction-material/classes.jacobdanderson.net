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
import {
	confirmProjectImport,
	downloadProjectZip
} from "./ide-workspace-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixtures = await Promise.all(["assembly-opening-contracts.json", "assembly-calculator-contracts.json"].map(async name => JSON.parse(await readFile(new URL(`./fixtures/${name}`, import.meta.url), "utf8"))));
let fixture = fixtures[0];

const storageKey = "classes-python-ide-projects:anonymous";
const legacy = {
	_id: "earlier-assembly",
	title: "Earlier attempt",
	mode: "python",
	files: [{ name: "main.py", content: "# preserved work\n" }],
	activeFileName: "main.py",
	courseID: "assembly",
	courseProjectKey: "assembly:opening:starter",
	createdAt: "2026-10-01T12:00:00.000Z",
	updatedAt: "2026-10-01T12:00:00.000Z"
};

test(
	"Assembly consent, exact role imports, saved edits, native exports and lesson return",
	{ timeout: 180_000 },
	async () => {
		let server, browser, context, page;
		const captures
			= process.env.COURSE_IMPORT_SCREENSHOT_DIR ?? "output/playwright";
		const exports
			= process.env.ASSEMBLY_BROWSER_EXPORT_PROOF_DIR
				?? "output/assembly-exports";
		const proof = [];
		await mkdir(captures, { recursive: true });
		await mkdir(exports, { recursive: true });
		try {
			server = await preview({
				root,
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(path => path && existsSync(path));
			assert.ok(
				executablePath,
				"An existing Chrome installation is required"
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			context = await browser.createBrowserContext();
			page = await context.newPage();
			await page.evaluateOnNewDocument(
				(key, existing) => {
					if (localStorage.getItem(key) === null)
						localStorage.setItem(key, JSON.stringify([existing]));
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
					const create = URL.createObjectURL;
					URL.createObjectURL = (blob) => {
						if (blob.type === "application/zip")
							window.__assemblyArchive = blob;
						return create(blob);
					};
				},
				storageKey,
				legacy
			);
			await page.setRequestInterception(true);
			let requests = [];
			page.on("request", (request) => {
				const url = new URL(request.url());
				if (url.hostname === "raw.githubusercontent.com") {
					requests.push(url.pathname);
					const prefix = `/instruction-material/Assembly/${fixture.revision}/`;
					const file = url.pathname.startsWith(prefix)
						? fixture.files[url.pathname.slice(prefix.length)]
						: null;
					void request.respond({
						status: file ? 200 : 404,
						contentType: "text/plain",
						headers: { "access-control-allow-origin": "*" },
						body: file?.content ?? "Unknown source"
					});
				}
				else if (
					url.origin !== origin
					|| url.pathname.startsWith("/api/")
				) {
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: "{}"
					});
				}
				else {
					void request.continue();
				}
			});
			for (const current of fixtures) {
				fixture = current;
				const calculator = fixture.pack === "ASM1-Integer-Calculator";
				const primary = calculator ? "calculator.S" : "routine.S";
				for (const width of [1280, 360]) {
					for (const theme of ["light", "dark"]) {
						for (const role of ["starter", "solution"]) {
							await page.setViewport({ width, height: 900 });
							await page.emulateMediaFeatures([
								{ name: "prefers-color-scheme", value: theme }
							]);
							const key = `assembly:${fixture.pack}-${width}-${theme}:${role === "starter" ? "starter" : "reference"}:native-assembly`;
							const lesson = calculator ? "assembly-unit-2-registers-and-data-movement-assembly-unit-2-registers-and-data-movement-curriculum-project-integer-calculator-in-assembly" : "assembly-asm0-setup-and-tooling-assembly-asm0-setup-and-tooling-curriculum-core-project-assembly";
							const params = new URLSearchParams({
								course: "assembly",
								mode: "assembly",
								projectKey: key,
								lesson,
								starterUrl: `https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/${role}`,
								starterTitle: calculator ? "Integer Calculator in Assembly" : "Build and Trace a Linux x86-64 Function"
							});
							requests = [];
							await page.goto(`${origin}/ide?${params}`, {
								waitUntil: "domcontentloaded"
							});
							await page.waitForSelector(
								"[data-testid='ide-route-import-confirm']"
							);
							assert.equal(
								requests.length,
								0,
								"Source requires confirmation"
							);
							await page.keyboard.press("Escape");
							assert.equal(
								requests.length,
								0,
								"Cancelling must not fetch source"
							);
							await page.goto(`${origin}/ide?${params}`, {
								waitUntil: "domcontentloaded"
							});
							await page.waitForSelector(
								"[data-testid='ide-route-import-confirm']"
							);
							await confirmProjectImport(page);
							await page.waitForFunction(
								(s, k) =>
									JSON.parse(
										localStorage.getItem(s) ?? "[]"
									).some(p => p.courseProjectKey === k),
								{},
								storageKey,
								key
							);
							const projects = await page.evaluate(
								s => JSON.parse(localStorage.getItem(s)),
								storageKey
							);
							assert.deepEqual(
								projects.find(p => p._id === legacy._id),
								legacy
							);
							const saved = projects.find(
								p => p.courseProjectKey === key
							);
							assert.equal(saved.mode, "assembly");
							assert.equal(saved.activeFileName, `${role}/${primary}`);
							assert.equal(saved.files.length, 7);
							assert.equal(requests.length, 7);
							assert.ok(
								requests.every(
									path =>
										!path.includes(
											role === "starter"
												? "/solution/"
												: "/starter/"
										)
								)
							);
							if (width < 900) {
								await page
									.locator(
										".mobile-view-picker button[data-view='code']"
									)
									.click();
							}
							await page.waitForSelector(".cm-content", {
								visible: true
							});
							assert.equal(
								await page.$(
									".mobile-view-picker button[data-view='canvas']"
								),
								null
							);
							await page.waitForSelector(
								"button.run-control:not([disabled])"
							);
							assert.equal(
								await page.$eval("button.run-control", b =>
									b.textContent.trim()),
								"Build instructions"
							);
							await page.click("button.run-control");
							await page.waitForFunction(() =>
								[...document.querySelectorAll(".output-line")].some(
									line =>
										line.textContent.includes(
											"ctest --test-dir build"
										)
								)
							);
							assert.ok(
								await page.$eval(
									".result-panel",
									(p, { role, calculator }) =>
										p.textContent.includes("Linux x86-64")
										&& p.textContent.includes(
											role === "starter"
												? "exits 78"
												: calculator ? "12,589" : "total=100"
										),
									{ role, calculator }
								)
							);
							assert.equal(
								await page.$(
									"iframe[title='Isolated Python output']"
								),
								null
							);
							await downloadProjectZip(page);
							const base64 = await page.evaluate(async () =>
								btoa(
									Array.from(
										new Uint8Array(
											await window.__assemblyArchive.arrayBuffer()
										),
										byte => String.fromCharCode(byte)
									).join("")
								)
							);
							const entries = unzipSync(
								Buffer.from(base64, "base64")
							);
							assert.equal(Object.keys(entries).length, 7);
							for (const file of saved.files) {
								const source
									= fixture.files[`${fixture.pack}/${file.name}`];
								const path = Object.keys(entries).find(path =>
									path.endsWith(`/${file.name}`)
								);
								assert.equal(file.content, source.content);
								assert.equal(
									strFromU8(entries[path]),
									source.content
								);
								assert.equal(
									createHash("sha256")
										.update(entries[path])
										.digest("hex"),
									source.sha256
								);
							}
							if (width === 1280 && theme === "light") {
								await writeFile(
									join(exports, `${fixture.pack}-${role}.zip`),
									Buffer.from(base64, "base64")
								);
							}
							if (width < 900) {
								await page
									.locator(
										".mobile-view-picker button[data-view='code']"
									)
									.click();
							}
							const name = `${role}/${primary}`;
							const edit = `${saved.files.find(file => file.name === name).content}\n/* Saved Assembly attempt. */\n`;
							await page.click(".cm-content");
							const modifier = await page.evaluate(() =>
								/Mac/.test(navigator.platform) ? "Meta" : "Control"
							);
							await page.keyboard.down(modifier);
							await page.keyboard.press("a");
							await page.keyboard.up(modifier);
							await page.keyboard.sendCharacter(edit);
							await page.keyboard.down(modifier);
							await page.keyboard.press("s");
							await page.keyboard.up(modifier);
							await page.waitForFunction(
								(s, k, n, c) =>
									JSON.parse(localStorage.getItem(s))
										.find(p => p.courseProjectKey === k)
										?.files
										.some(
											f => f.name === n && f.content === c
										),
								{},
								storageKey,
								key,
								name,
								edit
							);
							await page.reload({ waitUntil: "domcontentloaded" });
							await page.waitForSelector(
								"button.run-control:not([disabled])"
							);
							const reloaded = await page.evaluate(
								(s, k) =>
									JSON.parse(localStorage.getItem(s)).find(
										p => p.courseProjectKey === k
									),
								storageKey,
								key
							);
							assert.deepEqual(
								reloaded.files,
								saved.files.map(file =>
									file.name === name
										? { ...file, content: edit }
										: file
								)
							);
							assert.equal(
								requests.length,
								7,
								"Reload reuses saved work without fetching source"
							);
							await downloadProjectZip(page);
							const edited = await page.evaluate(async () =>
								btoa(
									Array.from(
										new Uint8Array(
											await window.__assemblyArchive.arrayBuffer()
										),
										byte => String.fromCharCode(byte)
									).join("")
								)
							);
							const editedEntries = unzipSync(
								Buffer.from(edited, "base64")
							);
							for (const file of reloaded.files) {
								assert.equal(
									strFromU8(
										editedEntries[
											Object.keys(editedEntries).find(path =>
												path.endsWith(`/${file.name}`)
											)
										]
									),
									file.content
								);
							}
							const returnHref = await page.$$eval("a", links =>
								links
									.find(
										link =>
											link.textContent.trim()
											=== "Return to lesson"
									)
									?.getAttribute("href"));
							assert.equal(returnHref, `/courses#${lesson}`);
							assert.ok(
								await page.evaluate(
									() =>
										document.documentElement.scrollWidth
										<= innerWidth + 1
								)
							);
							const capture = `course-import-assembly-${fixture.pack}-${role}-${width}-${theme}.png`;
							await page.screenshot({
								path: join(captures, capture),
								fullPage: true
							});
							proof.push({ pack: fixture.pack, role, width, theme, files: saved.files.map(f => ({
								name: f.name,
								sha256: createHash("sha256")
									.update(f.content)
									.digest("hex")
							})), confirmedBeforeFetch: true, savedEditReloaded: true, editedExportExact: true, legacyPreserved: true, returnHref, capture });
						}
					}
				}
			}
			await writeFile(
				join(captures, "assembly-workflow-proof.json"),
				`${JSON.stringify(proof, null, 2)}\n`
			);
		}
		catch (error) {
			if (page) {
				await page.screenshot({ path: join(captures, "assembly-failure.png"), fullPage: true });
				await writeFile(join(captures, "assembly-failure.json"), JSON.stringify(await page.evaluate(s => ({ url: location.href, body: (document.body.textContent ?? "").slice(-7000), storage: localStorage.getItem(s) }), storageKey), null, 2));
			}
			throw error;
		}
		finally {
			await page?.close();
			await context?.close();
			await browser?.close();
			await server?.httpServer?.close();
		}
	}
);
