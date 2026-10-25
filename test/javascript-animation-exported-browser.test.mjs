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
import { inspectAnimation } from "./javascript-animation-browser-cases.mjs";

const sha = value => createHash("sha256").update(value).digest("hex");
test(
	"executes actual animation ZIPs and visible saved edits offline",
	{ timeout: 480000 },
	async () => {
		const output
			= process.env.JAVASCRIPT_ANIMATION_BROWSER_DIR
				?? "output/javascript-animation-browser";
		const fixture = JSON.parse(
			await readFile(
				new URL(
					"./fixtures/javascript-animation-sources.json",
					import.meta.url
				),
				"utf8"
			)
		);
		assert.equal(fixture.resources.length, 12);
		const temporary = await mkdtemp(join(tmpdir(), "classes-jss7-native-"));
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID
				?? "javascript-animation-native-ci";
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
				timeoutSeconds: 480
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
				const selectedRoles = fixture.resources.filter(r => r.project === project);
				assert.equal(proof.profiles.length, selectedRoles.length * 2);
				assert.deepEqual(new Set(proof.profiles.map(p => `${p.role}:${p.width}`)), new Set(selectedRoles.flatMap(r => [390, 1280].map(w => `${r.role === "reference" ? "solution" : "starter"}:${w}`))));
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
						assert.equal(files.length, 6);
						assert.equal(Object.keys(archive).length, 6);
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
						for (const reducedMotion of [false, true]) {
							const context = await browser.createBrowserContext();
							let page;
							try {
								page = await context.newPage();
								await page.setViewport({
									width: profile.width,
									height: 900,
									hasTouch: profile.width === 390
								});
								await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reducedMotion ? "reduce" : "no-preference" }]);
								const errors = [];
								let outsideRequests = 0;
								page.on("pageerror", error =>
									errors.push(String(error)));
								await page.setRequestInterception(true);
								const allowed = pathToFileURL(
									`${targetRoot}/`
								).href;
								page.on("request", (request) => {
									if (request.url().startsWith(allowed)) {
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
								const intentionalError = false;
								assert.deepEqual(errors, []);
								const rendered = await inspectAnimation(
									page,
									resource,
									kind,
									reducedMotion
								);
								assert.deepEqual(errors, []);
								assert.equal(outsideRequests, 0);
								let screenshot;
								if (
									(kind === "exact" && role === "reference")
									|| (kind === "edited" && role === "starter")
									|| intentionalError
								) {
									screenshot = join(
										directory,
										`offline-${role}-${profile.width}-${kind}-${reducedMotion ? "reduced" : "motion"}.png`
									);
									await page.screenshot({
										path: screenshot,
										fullPage: true
									});
								}
								results.push({
									label,
									reducedMotion,
									passed: true,
									intentionalStarterRuntimeError:
									intentionalError,
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
			}
			assert.equal(exports.length, 48);
			assert.equal(results.length, 96);
			assert.equal(
				results.filter(r => r.intentionalStarterRuntimeError).length,
				0
			);
			assert.equal(results.filter(r => r.savedVisualEdit).length, 48);
			await writeFile(
				join(output, "native-browser-proof.json"),
				`${JSON.stringify({ accepted: true, revision: fixture.revision, exports, actualNativeExecutions: 96, savedVisualEdits: 24, reducedMotionExecutions: 48, intentionalDebuggingStarterCases: 0, results, allNativeRequestsOffline: true, browserVersion: await browser.version(), platform: process.platform, architecture: process.arch, assets: temporary }, null, 2)}\n`
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
					timeoutSeconds: 480,
					cleanup:
						"Owned pages, contexts and browser closed; no server started"
				})
			);
		}
	}
);
