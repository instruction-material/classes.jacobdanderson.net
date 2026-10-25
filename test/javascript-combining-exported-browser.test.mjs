import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Actual selected-role ZIP execution.
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { probeHelper, scenarios } from "./javascript-combining-browser-cases.mjs";

const sha = value => createHash("sha256").update(value).digest("hex");
test(
	"executes every accumulator role from its actual saved browser ZIPs",
	{ timeout: 360000 },
	async () => {
		const output
			= process.env.JAVASCRIPT_COMBINING_BROWSER_DIR
				?? "output/javascript-combining-browser";
		const fixture = JSON.parse(
			await readFile(
				new URL(
					"./fixtures/javascript-combining-sources.json",
					import.meta.url,
				),
				"utf8",
			),
		);
		const resources = fixture.resources;
		assert.equal(resources.length, 8);
		const projects = [...new Set(resources.map(r => r.project))];
		const temporary = await mkdtemp(join(tmpdir(), "classes-jss4-native-"));
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID ?? "javascript-combining-native-ci";
		const startedAt = new Date().toISOString();
		const results = [];
		const exports = [];
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
				timeoutSeconds: 360,
			}),
		);
		try {
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				await puppeteer.executablePath(),
				"/usr/bin/google-chrome",
				"/usr/bin/chromium",
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
			].find(p => typeof p === "string" && p && existsSync(p));
			assert.ok(executablePath);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox", "--disable-dev-shm-usage"],
			});
			browserPID = browser.process()?.pid;
			console.log(
				JSON.stringify({
					event: "browser-start",
					taskId,
					parentPid: process.pid,
					pid: browserPID,
					command: browser.process()?.spawnargs,
					at: new Date().toISOString(),
				}),
			);
			for (const project of projects) {
				const projectOutput = join(output, project);
				const proof = JSON.parse(
					await readFile(
						join(projectOutput, `web-javascript-${project}-course-proof.json`),
						"utf8",
					),
				);
				const selected = resources.filter(r => r.project === project);
				assert.equal(proof.profiles.length, selected.length * 2);
				assert.deepEqual(
					new Set(proof.profiles.map(p => `${p.role}:${p.width}`)),
					new Set(
						selected.flatMap(r =>
							[390, 1280].map(
								w => `${r.role === "starter" ? "starter" : "solution"}:${w}`,
							),
						),
					),
				);
				for (const profile of proof.profiles) {
					const role = profile.role === "starter" ? "starter" : "reference";
					const resource = selected.find(r => r.role === role);
					assert.equal(profile.revision, fixture.revision);
					assert.ok(
						profile.consentBeforeFetch
						&& profile.sameAttemptReused
						&& profile.previousWorkPreserved,
					);
					assert.equal(profile.additionalSourceRequests, 0);
					assert.equal(profile.remoteWrites, 0);
					for (const kind of ["exact", "edited"]) {
						const raw = await readFile(
							join(projectOutput, profile[`${kind}Archive`]),
						);
						assert.equal(sha(raw), profile[`${kind}ArchiveSha256`]);
						const archive = unzipSync(raw);
						const files
							= profile[kind === "exact" ? "sourceFiles" : "editedFiles"];
						assert.equal(files.length, resource.files.length);
						assert.equal(Object.keys(archive).length, files.length);
						const label = `${project}-${role}-${profile.width}-${kind}`;
						const directory = join(temporary, label);
						await mkdir(directory);
						for (const file of files) {
							assert.ok(resource.files.some(f => f.name === file.name));
							assert.ok(
								!file.name.startsWith("/")
								&& !file.name.includes("\\")
								&& !file.name.split("/").includes(".."),
							);
							const entries = Object.keys(archive).filter(n =>
								n.endsWith(`/${file.name}`),
							);
							assert.equal(entries.length, 1);
							const bytes = archive[entries[0]];
							assert.equal(sha(bytes), file.sha256);
							if (kind === "exact") {
								assert.equal(
									sha(bytes),
									resource.files.find(f => f.name === file.name).sha256,
								);
							}
							const target = join(directory, file.name);
							await mkdir(join(target, ".."), { recursive: true });
							await writeFile(target, bytes);
						}
						exports.push({ label, archiveSHA256: sha(raw), files });
						const selectedScenarios = scenarios(resource);
						for (const scenario of selectedScenarios) {
							const context = await browser.createBrowserContext();
							const page = await context.newPage();
							const errors = [];
							const logs = [];
							const prompts = [];
							const alerts = [];
							let outsideRequests = 0;
							try {
								await page.setViewport({ width: profile.width, height: 900 });
								page.on("pageerror", e => errors.push(String(e)));
								page.on("console", (m) => {
									if (m.type() === "log") logs.push(m.text());
								});
								page.on("dialog", (d) => {
									if (d.type() === "alert") {
										alerts.push(d.message());
										void d.dismiss();
										return;
									}
									assert.equal(d.type(), "prompt");
									const answer = scenario.inputs[prompts.length];
									prompts.push(d.message());
									void (answer === null ? d.dismiss() : d.accept(answer));
								});
								await page.setRequestInterception(true);
								const allowed = pathToFileURL(`${directory}/`).href;
								page.on("request", (r) => {
									if (r.url().startsWith(allowed)) {
										void r.continue();
									}
									else {
										outsideRequests++;
										void r.abort();
									}
								});
								await page.evaluateOnNewDocument((value) => {
									Math.random = () => value;
								}, scenario.random ?? 0.5);
								await page.goto(
									pathToFileURL(join(directory, "index.html")).href,
									{ waitUntil: "load" },
								);
								if (scenario.probe) await probeHelper(page, scenario.probe);
								const svgCount = await page.evaluate(() => document.querySelectorAll("svg").length);
								assert.equal(svgCount, 0);
								const rendered = await page.evaluate(() => ({
									text: [...document.querySelectorAll(".course-output")].map(
										n => n.textContent,
									),
									markupElements: document.querySelectorAll("b").length,
									noHorizontalOverflow:
										document.documentElement.scrollWidth <= innerWidth,
									textWithinViewport: [
										...document.querySelectorAll(".course-output"),
									].every((n) => {
										const range = document.createRange();
										range.selectNodeContents(n);
										return [...range.getClientRects()].every(
											r => r.left >= 0 && r.right <= innerWidth + 1,
										);
									}),
									readableSize: [
										...document.querySelectorAll(".course-output"),
									].every(
										n =>
											Number.parseFloat(getComputedStyle(n).fontSize) >= 16,
									),
								}));
								assert.equal(outsideRequests, 0);
								assert.equal(prompts.length, scenario.inputs.length);
								assert.deepEqual(alerts, scenario.alerts ?? []);
								assert.deepEqual(logs, scenario.logs ?? []);
								if (scenario.expectedReferenceError) {
									assert.ok(
										errors.length === 1 && /ReferenceError/.test(errors[0]),
									);
								}
								else {
									assert.deepEqual(errors, []);
								}
								if (scenario.lastNumberApprox !== undefined) {
									assert.equal(rendered.text.length, scenario.text.length + 1);
									assert.deepEqual(rendered.text.slice(0, -1), scenario.text);
									const number = Number(rendered.text.at(-1));
									assert.ok(Number.isFinite(number) && Math.abs(number / scenario.lastNumberApprox - 1) < 1e-12);
								}
								else { assert.deepEqual(rendered.text, scenario.text); }
								assert.equal(rendered.markupElements, 0);
								assert.ok(
									rendered.noHorizontalOverflow
									&& rendered.textWithinViewport
									&& rendered.readableSize,
								);
								let screenshot;
								if (
									kind === "exact"
									&& (scenario.probe
										|| (role === "reference"
											&& (scenario === selectedScenarios[0]
												|| scenario.name === "long-word")))
								) {
									screenshot = join(
										projectOutput,
										`native-${role}-${profile.width}-${scenario.name}.png`,
									);
									await page.screenshot({ path: screenshot, fullPage: true });
								}
								results.push({
									label,
									scenario: scenario.name,
									passed: true,
									suppliedHelperProbe: Boolean(scenario.probe),
									intentionalStarterReferenceError: Boolean(
										scenario.expectedReferenceError,
									),
									prompts,
									alerts,
									logs,
									errors,
									rendered,
									svgCount,
									outsideRequests,
									screenshot,
								});
							}
							finally {
								await page.close().catch(() => {});
								await context.close().catch(() => {});
							}
						}
					}
				}
			}
			assert.equal(exports.length, 32);
			assert.equal(results.length, 176);
			assert.equal(
				results.filter(r => r.intentionalStarterReferenceError).length,
				8,
			);
			await writeFile(
				join(output, "native-browser-proof.json"),
				`${JSON.stringify({ accepted: true, revision: fixture.revision, exports, actualNativeExecutions: results.length, intentionalDebuggingStarterCases: 8, results, allNativeRequestsOffline: true, browserVersion: await browser.version(), platform: process.platform, architecture: process.arch, assets: temporary }, null, 2)}\n`,
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
					timeoutSeconds: 360,
					cleanup:
						"All owned pages, contexts and browser closed; no server started",
				}),
			);
		}
	},
);
