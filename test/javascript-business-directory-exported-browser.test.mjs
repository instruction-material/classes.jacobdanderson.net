import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Run the actual downloaded workspaces with Node.
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";
import {
	editedBusinessDirectorySource,
	inspectBusinessDirectory
} from "./javascript-business-directory-browser-cases.mjs";

const sha = value => createHash("sha256").update(value).digest("hex");
test(
	"runs every actual BusinessDirectory ZIP offline with valid searches, autocomplete, no-match recovery, image fallback and saved edits",
	{ timeout: 300000 },
	async () => {
		const output
			= process.env.JAVASCRIPT_BUSINESS_DIRECTORY_BROWSER_DIR
				|| "output/javascript-business-directory-browser";
		const fixture = JSON.parse(
			await readFile(
				new URL(
					"./fixtures/javascript-business-directory-sources.json",
					import.meta.url
				),
				"utf8"
			)
		);
		const project = "my-favorite-businesses-ii";
		const directory = join(output, project);
		const proof = JSON.parse(
			await readFile(
				join(directory, `web-javascript-${project}-course-proof.json`),
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
		const temporary = await mkdtemp(
			join(tmpdir(), "classes-businesses-native-")
		);
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID
				|| "javascript-business-directory-native";
		const startedAt = new Date().toISOString();
		const exports = [];
		const results = [];
		let browser;
		let outcome = "failed";
		let browserPID;
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				parentPid: process.ppid,
				pid: process.pid,
				cwd: process.cwd(),
				command: process.argv,
				startedAt,
				timeoutSeconds: 300
			})
		);
		try {
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/usr/bin/google-chrome",
				"/usr/bin/chromium",
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
			].find(p => typeof p === "string" && existsSync(p));
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
					startedAt: new Date().toISOString()
				})
			);
			for (const profile of proof.profiles) {
				const role
					= profile.role === "starter" ? "starter" : "reference";
				const resource = fixture.resources.find(r => r.role === role);
				assert.equal(profile.revision, fixture.revision);
				assert.ok(
					profile.consentBeforeFetch
					&& profile.sameAttemptReused
					&& profile.previousWorkPreserved
				);
				assert.equal(profile.remoteWrites, 0);
				assert.equal(profile.additionalSourceRequests, 0);
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
					assert.equal(files.length, 18);
					assert.equal(Object.keys(archive).length, 18);
					const label = `${role}-${profile.width}-${kind}`;
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
						const names = Object.keys(archive).filter(name =>
							name.endsWith(`/${file.name}`)
						);
						assert.equal(names.length, 1);
						const bytes = archive[names[0]];
						assert.equal(sha(bytes), file.sha256);
						const expected
							= kind === "exact"
								? fixture.files[role][file.name]
								: [
										"index.html",
										"styles.css",
										"script.js"
									].includes(file.name)
										? editedBusinessDirectorySource(
												resource,
												file.name
											)
										: file.name === "README.md"
											? undefined
											: fixture.files[role][file.name];
						if (expected !== undefined) {
							assert.equal(sha(bytes), sha(expected));
						}
						else {
							assert.ok(
								Buffer.from(bytes)
									.toString("utf8")
									.startsWith(
										fixture.files[role]["README.md"]
									)
							);
						}

						if (kind === "exact") {
							assert.equal(
								sha(bytes),
								resource.files.find(f => f.name === file.name)
									.sha256
							);
						}
						const target = join(targetRoot, file.name);
						await mkdir(join(target, ".."), { recursive: true });
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
						page.setDefaultTimeout(10000);
						const errors = [];
						let outsideRequests = 0;
						page.on("pageerror", error =>
							errors.push(String(error)));
						await page.setRequestInterception(true);
						const allowed = pathToFileURL(targetRoot + sep).href;
						page.on("request", (request) => {
							if (
								request.url().startsWith(allowed)
								|| request.url().startsWith("data:")
							) {
								void request.continue();
							}
							else {
								outsideRequests++;
								void request.abort();
							}
						});
						const rendered = await inspectBusinessDirectory(
							page,
							resource,
							kind,
							pathToFileURL(join(targetRoot, "index.html")).href
						);
						const zoomedReflow = await page.evaluate(() => {
							document.body.style.zoom = "2";
							const result = {
								accepted:
									document.documentElement.scrollWidth
									<= innerWidth + 1,
								scrollWidth:
									document.documentElement.scrollWidth,
								viewport: innerWidth,
								offenders: [
									...document.querySelectorAll(
										"main, h1, form, input, button, article, .autocomplete-content, img, p"
									)
								]
									.map(element => ({
										tag: element.tagName,
										id: element.id,
										width: element.getBoundingClientRect()
											.width,
										right: element.getBoundingClientRect()
											.right
									}))
									.filter(
										element =>
											element.right > innerWidth + 1
									)
							};
							document.body.style.zoom = "";
							return result;
						});
						assert.ok(
							zoomedReflow.accepted,
							`${label}: ${JSON.stringify(zoomedReflow)}`
						);
						assert.deepEqual(errors, []);
						assert.equal(outsideRequests, 0);
						const screenshot = join(
							directory,
							`offline-${label}.png`
						);
						await page.screenshot({
							path: screenshot,
							fullPage: true
						});
						results.push({
							label,
							passed: true,
							rendered,
							zoomedReflow,
							errors,
							outsideRequests,
							screenshot,
							savedVisualEdit: kind === "edited"
						});
					}
					catch (error) {
						await page
							?.screenshot({
								path: join(
									directory,
									`offline-${label}-failed.png`
								),
								fullPage: true
							})
							.catch(() => {});
						await writeFile(
							join(directory, `offline-${label}-failed.json`),
							`${JSON.stringify(
								{ label, error: String(error) },
								null,
								2
							)}\n`
						);
						throw error;
					}
					finally {
						await page?.close().catch(() => {});
						await context.close();
					}
				}
			}
			assert.equal(exports.length, 8);
			assert.equal(results.length, 8);
			assert.equal(results.filter(r => r.savedVisualEdit).length, 4);
			await writeFile(
				join(output, "native-browser-proof.json"),
				`${JSON.stringify(
					{
						accepted: true,
						revision: fixture.revision,
						exports,
						results,
						actualNativeExecutions: 8,
						savedVisualEdits: 4,
						membersChecked: 144,
						allNativeRequestsOffline: true,
						browserVersion: await browser.version()
					},
					null,
					2
				)}\n`
			);
			outcome = "passed";
		}
		finally {
			try {
				await browser?.close();
			}
			finally {
				await rm(temporary, { recursive: true, force: true });
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
						timeoutSeconds: 300,
						cleanup:
							"Owned pages,contexts,browser and temporary decoded ZIPs closed/removed;no server started"
					})
				);
			}
		}
	}
);
