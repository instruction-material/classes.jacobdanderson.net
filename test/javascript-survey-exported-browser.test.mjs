import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Actual exported browser source verification.
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";

test("runs the actual exported survey roles offline and verifies the original cancellation regression", { timeout: 240000 }, async (t) => {
	const output = process.env.JAVASCRIPT_SURVEY_BROWSER_DIR ?? "output/javascript-survey-browser";
	const proof = JSON.parse(await readFile(join(output, "web-javascript-welcome-survey-course-proof.json"), "utf8"));
	const fixture = JSON.parse(await readFile(new URL("./fixtures/javascript-welcome-survey-source.json", import.meta.url), "utf8"));
	const original = JSON.parse(await readFile(new URL("./fixtures/javascript-welcome-survey-original-source.json", import.meta.url), "utf8"));
	const sha = value => createHash("sha256").update(value).digest("hex");
	assert.equal(proof.profiles.length, 4);
	assert.deepEqual(proof.profiles.map(profile => `${profile.role}:${profile.width}`).sort(), ["solution:1280", "solution:390", "starter:1280", "starter:390"]);
	const temporary = await mkdtemp(join(tmpdir(), "classes-survey-native-"));
	const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "javascript-survey-native-ci";
	const startedAt = new Date().toISOString();
	const baseInputs = ["Avery", "River", "2", "3", "mango"];
	const scenarios = [
		{ name: "integer", inputs: baseInputs, text: "Avery River", log: "The sum of your two numbers is 5.", alert: "The last letter of your favorite food is o." },
		{ name: "decimal", inputs: ["Avery", "River", "2.5", "0.75", "mango"], text: "Avery River", log: "The sum of your two numbers is 3.25.", alert: "The last letter of your favorite food is o." },
		{ name: "literal-text", inputs: ["<b>Avery</b>", "River", "2", "3", "mango"], text: "<b>Avery</b> River", log: "The sum of your two numbers is 5.", alert: "The last letter of your favorite food is o." },
		{ name: "long-name", inputs: ["Avery ".repeat(40).trim(), "River", "2", "3", "mango"], text: `${"Avery ".repeat(40).trim()} River`, log: "The sum of your two numbers is 5.", alert: "The last letter of your favorite food is o." },
		{ name: "long-word", inputs: ["A".repeat(300), "River", "2", "3", "mango"], text: `${"A".repeat(300)} River`, log: "The sum of your two numbers is 5.", alert: "The last letter of your favorite food is o." },
		...[0, 1, 2, 3, 4].map(index => ({ name: `cancel-${index + 1}`, inputs: baseInputs.map((value, i) => i === index ? null : value), text: "", log: "Survey canceled." })),
		{ name: "invalid-number", inputs: ["Avery", "River", "abc", "3", "mango"], text: "", log: "Enter two finite numbers." },
		{ name: "blank-number", inputs: ["Avery", "River", "", "3", "mango"], text: "", log: "Enter two finite numbers." },
		{ name: "empty-food", inputs: ["Avery", "River", "2", "3", ""], text: "Avery River", log: "The sum of your two numbers is 5.", alert: "No favorite food was entered." }
	];
	let browser;
	const results = [];
	const exports = [];
	let controlDirectory;
	let browserPID;
	let outcome = "failed";
	t.signal.addEventListener("abort", () => {
		void browser?.close();
	}, { once: true });
	console.log(JSON.stringify({ event: "start", taskId, parentPid: process.ppid, pid: process.pid, cwd: process.cwd(), command: process.argv, startedAt, timeoutSeconds: 240 }));
	try {
		const executablePath = [
			process.env.PUPPETEER_EXECUTABLE_PATH,
			await puppeteer.executablePath(),
			"/usr/bin/google-chrome",
			"/usr/bin/chromium",
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
		].find(path => typeof path === "string" && path && existsSync(path));
		assert.ok(executablePath, "An existing Chrome installation is required");
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
		browserPID = browser.process()?.pid;
		console.log(JSON.stringify({ event: "browser-start", taskId, parentPid: process.pid, pid: browserPID, command: browser.process()?.spawnargs, startedAt: new Date().toISOString() }));
		async function run(directory, label, width, scenario, expectOriginalError = false) {
			const context = await browser.createBrowserContext();
			const page = await context.newPage();
			const errors = [];
			const logs = [];
			const alerts = [];
			const prompts = [];
			let externalRequests = 0;
			try {
				await page.setViewport({ width, height: 900 });
				await page.evaluateOnNewDocument(() => {
					Math.random = () => 0.5;
				});
				page.on("pageerror", error => errors.push(String(error)));
				page.on("console", (message) => {
					if (message.type() === "log") logs.push(message.text());
				});
				page.on("dialog", (dialog) => {
					if (dialog.type() === "prompt") {
						const answer = scenario.inputs[prompts.length];
						prompts.push(dialog.message());
						void (answer === null || answer === undefined ? dialog.dismiss() : dialog.accept(answer));
					}
					else {
						alerts.push(dialog.message());
						void dialog.dismiss();
					}
				});
				await page.setRequestInterception(true);
				const allowed = pathToFileURL(`${directory}/`).href;
				page.on("request", (request) => {
					if (request.url().startsWith(allowed)) {
						void request.continue();
					}
					else {
						externalRequests++;
						void request.abort();
					}
				});
				await page.goto(pathToFileURL(join(directory, "index.html")).href, { waitUntil: "load" });
				if (scenario.text) await page.waitForFunction(expected => document.querySelector(".course-output, svg text")?.textContent === expected, { timeout: 10000 }, scenario.text);
				const rendered = await page.evaluate(() => {
					const output = document.querySelector(".course-output, svg text");
					const range = document.createRange();
					if (output) range.selectNodeContents(output);
					return { text: output?.textContent ?? "", markupElements: document.querySelectorAll("b").length, noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth, textWithinViewport: !output || [...range.getClientRects()].every(rect => rect.left >= 0 && rect.right <= innerWidth + 1), fontSize: output ? Number.parseFloat(getComputedStyle(output).fontSize) : null };
				});
				assert.equal(externalRequests, 0);
				assert.equal(prompts.length, scenario.inputs.length);
				assert.equal(rendered.text, scenario.text);
				assert.equal(rendered.markupElements, 0);
				if (!expectOriginalError) {
					assert.ok(rendered.noHorizontalOverflow);
					assert.ok(rendered.textWithinViewport);
					if (scenario.text) assert.ok(rendered.fontSize >= 16);
				}
				if (scenario.log) assert.deepEqual(logs, [scenario.log]);
				else assert.deepEqual(logs, []);
				assert.deepEqual(alerts, scenario.alert ? [scenario.alert] : []);
				if (expectOriginalError) assert.ok(errors.some(error => /null.*length|length.*null/.test(error)));
				else assert.deepEqual(errors, []);
				if (["integer", "long-name", "long-word"].includes(scenario.name) && label.includes("exact")) await page.screenshot({ path: join(output, `native-${label}${scenario.name === "integer" ? "" : `-${scenario.name}`}.png`), fullPage: true });
				return { label, scenario: scenario.name, width, passed: true, prompts: prompts.length, logs, alerts, rendered, externalRequests, errors, originalFailureExpected: expectOriginalError };
			}
			finally {
				await page.close().catch(() => {});
				await context.close().catch(() => {});
			}
		}
		for (const profile of proof.profiles) {
			assert.equal(profile.revision, fixture.revision);
			assert.ok(profile.consentBeforeFetch && profile.sameAttemptReused && profile.previousWorkPreserved);
			assert.equal(profile.additionalSourceRequests, 0);
			assert.equal(profile.remoteWrites, 0);
			const role = profile.role === "starter" ? "starter" : "reference";
			for (const kind of ["exact", "edited"]) {
				const bytes = await readFile(join(output, profile[`${kind}Archive`]));
				assert.equal(sha(bytes), profile[`${kind}ArchiveSha256`]);
				const archive = unzipSync(bytes);
				const files = profile[kind === "exact" ? "sourceFiles" : "editedFiles"];
				assert.equal(files.length, 6);
				assert.equal(Object.keys(archive).length, 6);
				const label = `${role}-${profile.width}-${kind}`;
				const directory = join(temporary, label);
				await mkdir(directory);
				for (const file of files) {
					assert.ok(fixture.files[role].some(expected => expected.name === file.name));
					assert.ok(!file.name.startsWith("/") && !file.name.includes("\\") && !file.name.split("/").includes(".."));
					const names = Object.keys(archive).filter(name => name.endsWith(`/${file.name}`));
					assert.equal(names.length, 1);
					assert.equal(sha(archive[names[0]]), file.sha256);
					const target = join(directory, file.name);
					await mkdir(join(target, ".."), { recursive: true });
					await writeFile(target, archive[names[0]]);
				}
				exports.push({ label, sha256: sha(bytes), sourceFiles: files });
				if (role === "starter") {
					results.push(await run(directory, label, profile.width, { name: "unfinished-starter", inputs: [], text: "" }));
				}
				else {
					for (const scenario of scenarios) results.push(await run(directory, label, profile.width, scenario));
				}
				if (role === "reference" && profile.width === 1280 && kind === "exact") controlDirectory = directory;
			}
		}
		assert.equal(exports.length, 8);
		assert.equal(results.length, 56);
		const control = join(temporary, "original-cancellation-control");
		await cp(controlDirectory, control, { recursive: true });
		const originalReference = original.roles.find(role => role.role === "reference");
		assert.equal(sha(originalReference.panels.JavaScript), originalReference.clipboardSourceSHA256);
		await writeFile(join(control, "script.js"), originalReference.panels.JavaScript);
		const originalFailure = await run(control, "original-reference-control", 1280, { name: "original-cancellation", inputs: ["Avery", "River", "2", "3", null], text: "Avery River", log: "The sum of your two numbers is 5." }, true);
		await writeFile(join(output, "native-browser-proof.json"), `${JSON.stringify({ accepted: true, revision: fixture.revision, revisionKind: fixture.revisionKind, originalRoleSourceHashes: fixture.sourcePanelHashes, exports, actualNativeExecutions: results.length, results, originalFailure, allNativeRequestsOffline: true, originalLibraryVersion: fixture.libraryVersion, originalLibrarySHA256: fixture.librarySHA256, originalLibraryLicenseRetained: true, browserVersion: await browser.version(), platform: process.platform, architecture: process.arch, assets: temporary }, null, 2)}\n`);
		outcome = "passed";
	}
	finally {
		if (browser) await browser.close();
		console.log(JSON.stringify({ event: "end", taskId, parentPid: process.ppid, pid: process.pid, browserPID, cwd: process.cwd(), command: process.argv, startedAt, endedAt: new Date().toISOString(), outcome, exitCode: outcome === "passed" ? 0 : 1, timeoutSeconds: 240, childProcessGroupCleanup: "Owned pages, contexts and browser closed; no server started" }));
	}
});
