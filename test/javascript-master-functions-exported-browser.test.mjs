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
import { Script } from "node:vm";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { inspectFunctions } from "./javascript-master-functions-browser-cases.mjs";

const sha = value => createHash("sha256").update(value).digest("hex");
test(
	"executes actual JSM2 functions ZIPs and visible saved edits offline",
	{ timeout: 600000 },
	async () => {
		const output
			= process.env.JAVASCRIPT_MASTER_FUNCTIONS_BROWSER_DIR
				?? "output/javascript-master-functions-browser";
		const fixture = JSON.parse(
			await readFile(
				new URL(
					"./fixtures/javascript-master-functions-sources.json",
					import.meta.url
				),
				"utf8"
			)
		);
		assert.equal(fixture.resources.length, 14);
		const temporary = await mkdtemp(
			join(tmpdir(), "classes-jsm2-functions-native-")
		);
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID
				?? "javascript-master-functions-native-ci";
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
				timeoutSeconds: 600
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
						assert.equal(
							Object.keys(archive).length,
							resource.files.length
						);
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
							if (
								resource.project === "debugging-functions"
								&& role === "starter"
								&& kind === "exact"
								&& file.name === "script.js"
							) {
								assert.throws(
									() => new Script(new TextDecoder().decode(bytes)),
									SyntaxError
								);
							}
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
							const blockedRequests = [];
							page.on("pageerror", error =>
								errors.push(String(error)));
							await page.setRequestInterception(true);
							const allowed = pathToFileURL(
								`${targetRoot}/`
							).href;
							page.on("request", (request) => {
								if (
									request.url().startsWith(allowed)
									|| request.url().startsWith("data:")
								) {
									void request.continue();
								}
								else {
									outsideRequests++;
									const requested = new URL(request.url());
									blockedRequests.push({
										protocol: requested.protocol,
										host: requested.host,
										path:
											requested.protocol === "data:"
												? "[embedded data]"
												: requested.pathname,
										hash: sha(request.url()),
										type: request.resourceType()
									});
									void request.abort();
								}
							});
							await page.goto(
								pathToFileURL(join(targetRoot, "index.html"))
									.href,
								{ waitUntil: "load" }
							);
							assert.equal(
								outsideRequests,
								0,
								JSON.stringify(blockedRequests)
							);
							assert.deepEqual(errors, []);
							const rendered = await inspectFunctions(
								page,
								resource,
								kind
							);
							let screenshot;
							if (
								(kind === "exact" && role === "reference")
								|| (kind === "edited" && role === "starter")
								|| (kind === "exact" && role === "starter")
							) {
								await page.evaluate(async () => {
									scrollTo({ top: 0, behavior: "instant" });
									await new Promise(requestAnimationFrame);
									await new Promise(requestAnimationFrame);
								});
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
								const fits = {
									accepted:
										document.documentElement.scrollWidth
										<= innerWidth,
									viewport: innerWidth,
									scrollWidth:
										document.documentElement.scrollWidth,
									body: document.body
										.getBoundingClientRect()
										.toJSON(),
									overflow: [
										...document.querySelectorAll("body *")
									]
										.map(node => ({
											tag: node.tagName,
											text: node.textContent.slice(0, 50),
											box: node
												.getBoundingClientRect()
												.toJSON()
										}))
										.filter(
											node =>
												node.box.right > innerWidth + 1
										)
								};
								document.body.style.zoom = "";
								return fits;
							});
							assert.ok(
								zoomedReflow.accepted,
								`${label}: ${JSON.stringify(zoomedReflow)}`
							);
							await page.emulateMediaFeatures([
								{
									name: "prefers-reduced-motion",
									value: "reduce"
								}
							]);
							await page.reload({ waitUntil: "load" });
							const reducedRendered = await inspectFunctions(
								page,
								resource,
								kind
							);
							assert.ok(
								await page.evaluate(
									() =>
										matchMedia(
											"(prefers-reduced-motion: reduce)"
										).matches
								)
							);
							results.push({
								label,
								reducedMotion: true,
								passed: true,
								savedVisualEdit: kind === "edited",
								outsideRequests,
								errors,
								rendered: reducedRendered
							});
							results.push({
								reducedMotion: false,
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
			assert.equal(exports.length, 56);
			assert.equal(results.length, 112);
			assert.equal(
				results.filter(r => r.savedVisualEdit && !r.reducedMotion)
					.length,
				28
			);
			await writeFile(
				join(output, "native-browser-proof.json"),
				`${JSON.stringify({ accepted: true, revision: fixture.revision, exports, actualNativeExecutions: 112, savedVisualEdits: 28, results, allCourseCompanionsOffline: true, browserVersion: await browser.version(), platform: process.platform, architecture: process.arch, assets: temporary }, null, 2)}\n`
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
					timeoutSeconds: 600,
					cleanup:
						"Owned pages, contexts and browser closed; no server started"
				})
			);
		}
	}
);
