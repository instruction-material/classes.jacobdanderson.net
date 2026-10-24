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

const sha = value => createHash("sha256").update(value).digest("hex");
function story(words) {
	return `The cafeteria at our school is very ${words[0]}. For example, they serve ${words[1]} pizza. They also serve ${words[2]}. One time, I saw somebody ${words[3]} across the cafeteria. Everybody ${words[4]}!`;
}
const words = ["quiet", "warm", "noodles", "dance", "laughed"];
const survey = ["Avery", "otter", "teal", "mango"];
function scenarios(resource) {
	if (resource.role === "starter") {
		return resource.intentionalSyntaxError
			? [
					{
						name: "intentional-debugging-starter",
						inputs: [],
						text: [],
						expectedSyntaxError: true,
					},
				]
			: [
					{ name: "unfinished-starter", inputs: [], text: [] },
					{ name: "supplied-helper", inputs: [], probe: true },
				];
	}
	if (resource.project === "mad-libs") {
		const long = ["x".repeat(300), ...words.slice(1)];
		const literal = ["<b>quiet</b>", ...words.slice(1)];
		return [
			{ name: "story", inputs: words, text: [story(words)] },
			...[0, 1, 2, 3, 4].map(i => ({
				name: `cancel-${i}`,
				inputs: words.map((w, j) => (i === j ? null : w)),
				text: [],
				logs: ["Story canceled."],
			})),
			{
				name: "blank-word",
				inputs: ["", ...words.slice(1)],
				text: [],
				logs: ["Enter a word for each prompt."],
			},
			{ name: "long-word", inputs: long, text: [story(long)] },
			{ name: "literal-text", inputs: literal, text: [story(literal)] },
		];
	}
	if (resource.project === "cookie-math") {
		return [
			{
				name: "recipe",
				inputs: ["4.5"],
				text: ["You will need 3 eggs and 6 cups of chocolate chips"],
			},
			{
				name: "zero",
				inputs: ["0"],
				text: ["You will need 0 eggs and 0 cups of chocolate chips"],
			},
			{
				name: "decimal",
				inputs: ["1.5"],
				text: ["You will need 1 eggs and 2 cups of chocolate chips"],
			},
			...["abc", "", "-3"].map(value => ({
				name: `invalid-${value || "blank"}`,
				inputs: [value],
				text: [],
				logs: ["Enter a nonnegative finite number of cups of flour."],
			})),
			{ name: "cancel", inputs: [null], text: [], logs: ["Recipe canceled."] },
		];
	}
	if (resource.project === "hello-world")
		return [{ name: "indexed-characters", inputs: [], text: ["Hello World!"] }];
	if (resource.project === "debugging-survey") {
		return [
			{
				name: "repaired-survey",
				inputs: survey,
				text: [],
				logs: [
					"Avery's favorite animal is a(n) otter, their favorite color is teal, and their favorite flavor of ice cream is mango.",
				],
			},
			...[0, 1, 2, 3].map(i => ({
				name: `cancel-${i}`,
				inputs: survey.map((w, j) => (i === j ? null : w)),
				text: [],
				logs: ["Survey canceled."],
			})),
		];
	}
	assert.fail(`Missing source scenarios for ${resource.project}`);
}

test(
	"executes every additional first-module role from its actual saved browser ZIPs",
	{ timeout: 360000 },
	async () => {
		const output
			= process.env.JAVASCRIPT_FIRST_MODULE_BROWSER_DIR
				?? "output/javascript-first-module-browser";
		const fixture = JSON.parse(
			await readFile(
				new URL(
					"./fixtures/javascript-first-module-sources.json",
					import.meta.url,
				),
				"utf8",
			),
		);
		const resources = fixture.resources.filter(
			r => r.project !== "welcome-survey",
		);
		assert.equal(resources.length, 10);
		const projects = [...new Set(resources.map(r => r.project))];
		const temporary = await mkdtemp(join(tmpdir(), "classes-jss1-native-"));
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID ?? "javascript-first-module-native-ci";
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
							let outsideRequests = 0;
							try {
								await page.setViewport({ width: profile.width, height: 900 });
								page.on("pageerror", e => errors.push(String(e)));
								page.on("console", (m) => {
									if (m.type() === "log") logs.push(m.text());
								});
								page.on("dialog", (d) => {
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
								await page.goto(
									pathToFileURL(join(directory, "index.html")).href,
									{ waitUntil: "load" },
								);
								if (scenario.probe) {
									await page.evaluate((project) => {
										if (project === "variables-and-data-types") {
											for (const value of ["Avery", 300, true, null, undefined])
												window.printToScreen(value);
										}
										else {
											window.printToScreen("Hello World!");
											window.printToScreen("<b>Literal text</b>");
											window.printToScreen("X".repeat(300));
										}
									}, project);
								}
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
								assert.deepEqual(logs, scenario.logs ?? []);
								if (scenario.expectedSyntaxError) {
									assert.ok(
										errors.length === 1 && /SyntaxError/.test(errors[0]),
									);
								}
								else {
									assert.deepEqual(errors, []);
								}
								if (scenario.probe) {
									assert.deepEqual(
										rendered.text,
										project === "variables-and-data-types"
											? [
													"Avery has type \"string\".",
													"300 has type \"number\".",
													"true has type \"boolean\".",
													"null is a primitive value; typeof null returns \"object\".",
													"undefined has type \"undefined\".",
												]
											: [
													"Hello World!",
													"<b>Literal text</b>",
													"X".repeat(300),
												],
									);
								}
								else {
									assert.deepEqual(rendered.text, scenario.text);
								}
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
									intentionalStarterSyntaxError: Boolean(
										scenario.expectedSyntaxError,
									),
									prompts,
									logs,
									errors,
									rendered,
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
			assert.equal(exports.length, 40);
			assert.equal(results.length, 132);
			assert.equal(
				results.filter(r => r.intentionalStarterSyntaxError).length,
				4,
			);
			await writeFile(
				join(output, "native-browser-proof.json"),
				`${JSON.stringify({ accepted: true, revision: fixture.revision, exports, actualNativeExecutions: results.length, intentionalDebuggingStarterCases: 4, results, allNativeRequestsOffline: true, browserVersion: await browser.version(), platform: process.platform, architecture: process.arch, assets: temporary }, null, 2)}\n`,
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
