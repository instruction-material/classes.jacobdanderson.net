import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Execute the actual saved course ZIPs offline.
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { inspectBasicLayout } from "./javascript-basic-layout-browser-cases.mjs";

const sha = value => createHash("sha256").update(value).digest("hex");
test(
	"executes actual Basic Layout ZIPs and visible saved edits offline",
	{ timeout: 240000 },
	async () => {
		const output
			= process.env.JAVASCRIPT_BASIC_LAYOUT_BROWSER_DIR
				?? "output/javascript-basic-layout-browser";
		const fixture = JSON.parse(
			await readFile(
				new URL(
					"./fixtures/javascript-basic-layout-sources.json",
					import.meta.url
				),
				"utf8"
			)
		);
		assert.equal(fixture.resources.length, 10);
		const temporary = await mkdtemp(join(tmpdir(), "classes-jss12-native-"));
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID
				?? "javascript-basic-layout-native-ci";
		const startedAt = new Date().toISOString();
		const exports = [];
		const results = [];
		let browser;
		let browserPID;
		let outcome = "failed";
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				parentPid: process.ppid,
				pid: process.pid,
				cwd: process.cwd(),
				command: process.argv,
				startedAt,
				timeoutSeconds: 240
			})
		);
		try {
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				await puppeteer.executablePath(),
				"/usr/bin/google-chrome",
				"/usr/bin/chromium",
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
			].find(p => typeof p === "string" && p && existsSync(p));
			assert.ok(executablePath);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox", "--disable-dev-shm-usage"]
			});
			browserPID = browser.process()?.pid;
			console.log(
				JSON.stringify({
					event: "browser-start",
					taskId,
					parentPid: process.pid,
					pid: browserPID,
					command: browser.process()?.spawnargs,
					at: new Date().toISOString()
				})
			);
			for (const project of new Set(
				fixture.resources.map(r => r.project)
			)) {
				const directory = join(output, project);
				const proof = JSON.parse(
					await readFile(
						join(
							directory,
							`web-javascript-${project}-course-proof.json`
						),
						"utf8"
					)
				);
				assert.equal(proof.profiles.length, 4);
				assert.deepEqual(
					new Set(proof.profiles.map(p => `${p.role}:${p.width}`)),
					new Set([
						"starter:390",
						"starter:1280",
						"solution:390",
						"solution:1280"
					])
				);
				for (const profile of proof.profiles) {
					const role
						= profile.role === "starter" ? "starter" : "reference";
					const resource = fixture.resources.find(
						r => r.project === project && r.role === role
					);
					assert.equal(profile.revision, fixture.revision);
					assert.ok(
						profile.consentBeforeFetch
						&& profile.sameAttemptReused
						&& profile.previousWorkPreserved
					);
					assert.equal(profile.additionalSourceRequests, 0);
					assert.equal(profile.remoteWrites, 0);
					for (const kind of ["exact", "edited"]) {
						const raw = await readFile(
							join(directory, profile[`${kind}Archive`])
						);
						assert.equal(sha(raw), profile[`${kind}ArchiveSha256`]);
						const archive = unzipSync(raw);
						const files
							= profile[
								kind === "exact" ? "sourceFiles" : "editedFiles"
							];
						assert.equal(files.length, resource.files.length);
						assert.equal(Object.keys(archive).length, resource.files.length);
						const label = `${project}-${role}-${profile.width}-${kind}`;
						const targetRoot = join(temporary, label);
						for (const file of files) {
							assert.ok(
								resource.files.some(f => f.name === file.name)
							);
							assert.ok(
								!file.name.startsWith("/")
								&& !file.name.includes("\\")
								&& !file.name.split("/").includes("..")
							);
							const names = Object.keys(archive).filter(n =>
								n.endsWith(`/${file.name}`)
							);
							assert.equal(names.length, 1);
							const bytes = archive[names[0]];
							assert.equal(sha(bytes), file.sha256);
							if (kind === "exact") {
								assert.equal(
									sha(bytes),
									resource.files.find(
										f => f.name === file.name
									).sha256
								);
							}
							const target = join(targetRoot, file.name);
							await mkdir(join(target, ".."), {
								recursive: true
							});
							await writeFile(target, bytes);
						}
						exports.push({ label, archiveSHA256: sha(raw), files });
						const context = await browser.createBrowserContext();
						let page;
						try {
							page = await context.newPage();
							await page.setViewport({
								width: profile.width,
								height: 900
							});
							const errors = [];
							let outsideRequests = 0;
							page.on("pageerror", error =>
								errors.push(String(error)));
							await page.setRequestInterception(true);
							const allowed = pathToFileURL(
								`${targetRoot}/`
							).href;
							const embeddedFontURL = resource.project === "reverse-the-rainbow"
								? (await readFile(join(targetRoot, "vendor/material-icons.css"), "utf8")).match(/url\((data:font\/woff2;base64,[^)]+)\)/)?.[1]
								: undefined;
							if (resource.project === "reverse-the-rainbow") assert.ok(embeddedFontURL);
							page.on("request", (request) => {
								if (request.url().startsWith(allowed) || request.url() === embeddedFontURL) {
									void request.continue();
								}
								else {
									outsideRequests++;
									void request.abort();
								}
							});
							await page.goto(
								pathToFileURL(join(targetRoot, "index.html"))
									.href,
								{ waitUntil: "load" }
							);
							assert.equal(outsideRequests, 0);
							assert.deepEqual(errors, []);
							const rendered = await inspectBasicLayout(
								page,
								resource,
								kind
							);
							const breakpointChecks = [];
							if (resource.project === "reverse-the-rainbow") {
								for (const width of [992, 993]) {
									await page.setViewport({ width, height: 900 });
									breakpointChecks.push({ width, rendered: await inspectBasicLayout(page, resource, kind) });
								}
								await page.setViewport({ width: profile.width, height: 900 });
							}
							let screenshot;
							if (
								(kind === "exact" && role === "reference")
								|| (kind === "edited" && role === "starter")
								|| (resource.project === "my-javascript-art-part-2" && kind === "exact" && role === "starter")
							) {
								screenshot = join(
									directory,
									`offline-${role}-${profile.width}-${kind}.png`
								);
								await page.screenshot({
									path: screenshot,
									fullPage: true
								});
							}
							const zoomedReflow = await page.evaluate(() => {
								document.body.style.zoom = "2";
								const fits = { accepted: document.documentElement.scrollWidth <= innerWidth, viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, body: document.body.getBoundingClientRect().toJSON(), overflow: [...document.querySelectorAll("body *")].map(node => ({ tag: node.tagName, text: node.textContent.slice(0, 50), box: node.getBoundingClientRect().toJSON() })).filter(node => node.box.right > innerWidth + 1) };
								document.body.style.zoom = "";
								return fits;
							});
							assert.ok(zoomedReflow.accepted, `${label}: ${JSON.stringify(zoomedReflow)}`);
							if (resource.project === "my-javascript-art-part-2") {
								await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
								await page.reload({ waitUntil: "load" });
								const reducedRendered = await inspectBasicLayout(page, resource, kind);
								assert.ok(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches));
								results.push({ label, reducedMotion: true, passed: true, savedVisualEdit: kind === "edited", outsideRequests, errors, rendered: reducedRendered });
							}
							results.push({
								reducedMotion: false,
								breakpointChecks,
								zoomedReflow,
								label,
								passed: true,
								savedVisualEdit: kind === "edited",
								outsideRequests,
								errors,
								rendered,
								screenshot
							});
						}
						finally {
							await page?.close().catch(() => {});
							await context.close();
						}
					}
				}
			}
			assert.equal(exports.length, 40);
			assert.equal(results.length, 48);
			assert.equal(results.filter(r => r.savedVisualEdit).length, 24);
			await writeFile(
				join(output, "native-browser-proof.json"),
				`${JSON.stringify({ accepted: true, revision: fixture.revision, exports, actualNativeExecutions: 48, savedVisualEdits: 20, results, allNativeRequestsOffline: true, browserVersion: await browser.version(), platform: process.platform, architecture: process.arch, assets: temporary }, null, 2)}\n`
			);
			outcome = "passed";
		}
		finally {
			await browser?.close();
			console.log(
				JSON.stringify({
					event: "end",
					taskId,
					parentPid: process.ppid,
					pid: process.pid,
					browserPID,
					cwd: process.cwd(),
					command: process.argv,
					startedAt,
					endedAt: new Date().toISOString(),
					outcome,
					exitCode: outcome === "passed" ? 0 : 1,
					timeoutSeconds: 240,
					cleanup:
						"Owned pages, contexts and browser closed; no server started"
				})
			);
		}
	}
);
