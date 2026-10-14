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
const fixtures = await Promise.all(
	[
		"assembly-opening-contracts.json",
		"assembly-calculator-contracts.json",
		"assembly-array-contracts.json",
		"assembly-string-contracts.json",
		"assembly-helper-contracts.json",
		"assembly-parser-contracts.json",
		"assembly-reverse-contracts.json",
		"assembly-stack-contracts.json",
		"assembly-compiler-contracts.json",
		"assembly-debug-contracts.json",
		"assembly-performance-contracts.json",
		"assembly-hardening-contracts.json"
	].map(async name =>
		JSON.parse(
			await readFile(
				new URL(`./fixtures/${name}`, import.meta.url),
				"utf8"
			)
		)
	)
);
const hardening = fixtures.find(row => row.pack === "ASM-25-unit-12-security-and-reliability-visibility-supplemental-2");
fixtures.push({ ...hardening, pack: "ASM-26-unit-12-security-and-reliability-visibility-supplemental-3", sourcePack: hardening.pack });
let fixture = fixtures[0];
const workflowDefinitions = {
	"ASM-04-asm0-setup-and-tooling": {
		primary: "routine.S",
		title: "Build and Trace a Linux x86-64 Function",
		lesson: "assembly-asm0-setup-and-tooling-assembly-asm0-setup-and-tooling-curriculum-core-project-assembly",
		referenceToken: "total=100"
	},
	"ASM1-Integer-Calculator": {
		primary: "calculator.S",
		title: "Integer Calculator in Assembly",
		lesson: "assembly-unit-2-registers-and-data-movement-assembly-unit-2-registers-and-data-movement-curriculum-project-integer-calculator-in-assembly",
		referenceToken: "12,589"
	},
	"ASM2-Array-Sum-and-Search": {
		primary: "array_routines.S",
		title: "Array Sum and Search Routines",
		lesson: "assembly-unit-4-branching-and-loops-assembly-unit-4-branching-and-loops-curriculum-project-array-sum-and-search-routines",
		referenceToken: "11,280"
	},
	"ASM3-String-Length-and-Copy": {
		primary: "string_routines.S",
		title: "String Length and Copy Routines",
		lesson: "assembly-unit-7-memory-addressing-and-data-structures-assembly-unit-7-memory-addressing-and-data-structures-curriculum-project-string-length-and-copy-routines",
		referenceToken: "35,900"
	},
	"ASM4-Call-C-Helper-from-Assembly": {
		primary: "scale_and_clamp.S",
		title: "Call a C Helper from Assembly",
		lesson: "assembly-unit-6-calling-conventions-and-abi-assembly-unit-6-calling-conventions-and-abi-curriculum-project-call-a-c-helper-from-assembly",
		referenceToken: "11,280"
	},
	"ASM5-Tiny-Command-Line-Parser": {
		primary: "parser.S",
		title: "Tiny Command-Line Parser",
		lesson: "assembly-unit-8-system-calls-and-runtime-interaction-assembly-unit-8-system-calls-and-runtime-interaction-curriculum-project-tiny-command-line-parser",
		referenceToken: "9,157"
	},
	"ASM6-Reverse-Engineering-Toy-Program": {
		primary: "reconstructed.c",
		title: "Reverse-Engineer a Toy Program Back into Pseudocode",
		lesson: "assembly-unit-12-security-and-reliability-visibility-assembly-unit-12-security-and-reliability-visibility-curriculum-project-reverse-engineer-a-toy-program-back-into-pseudocode",
		referenceToken: "10,033"
	},
	"ASM-07-unit-5-the-stack-and-function-calls": {
		primary: "routine.S",
		title: "Core Project: The Stack and Function Calls",
		lesson: "assembly-unit-5-the-stack-and-function-calls-assembly-unit-5-the-stack-and-function-calls-curriculum-core-project-the-stack-and-function-calls",
		referenceToken: "10,012"
	},
	"ASM-08-unit-9-reading-compiler-output": { primary: "model.c", taskFile: "analysis.md", title: "Core Project: Reading Compiler Output", lesson: "assembly-unit-9-reading-compiler-output-assembly-unit-9-reading-compiler-output-curriculum-core-project-reading-compiler-output", referenceToken: "10,013", starterToken: "analysis.md" },
	"ASM-09-unit-10-debugging-at-instruction-level": { primary: "routine.S", taskFile: "analysis.md", title: "Core Project: Debugging at Instruction Level", lesson: "assembly-unit-10-debugging-at-instruction-level-assembly-unit-10-debugging-at-instruction-level-curriculum-core-project-debugging-at-instruction-level", referenceToken: "10,019", starterToken: "exits 1" },
	"ASM-10-unit-11-performance-and-code-shape": { primary: "loops.S", taskFile: "analysis.md", title: "Core Project: Performance and Code Shape", lesson: "assembly-unit-11-performance-and-code-shape-assembly-unit-11-performance-and-code-shape-curriculum-core-project-performance-and-code-shape", referenceToken: "10,026", starterToken: "analysis.md" },
	"ASM-25-unit-12-security-and-reliability-visibility-supplemental-2": { primary: "analysis.md", taskFile: "analysis.md", title: "Binary Hardening Evidence Lab", lesson: "assembly-unit-12-security-and-reliability-visibility-assembly-unit-12-security-and-reliability-visibility-supplemental-reliability-visibility-transfer-practice", referenceToken: "10,079", starterToken: "analysis.md" },
	"ASM-26-unit-12-security-and-reliability-visibility-supplemental-3": { primary: "trace.md", taskFile: "trace.md", title: "Runtime Hardening Trace Companion", lesson: "assembly-unit-12-security-and-reliability-visibility-assembly-unit-12-security-and-reliability-visibility-supplemental-reliability-visibility-extension-practice", referenceToken: "10,079", starterToken: "trace.md" }
};

assert.equal(
	fixtures.length,
	13,
	"All thirteen verified assignment workspaces require browser coverage"
);
assert.deepEqual(
	fixtures.map(row => row.pack).sort(),
	Object.keys(workflowDefinitions).sort(),
	"Browser fixtures must cover every workflow definition"
);
const expectedProfiles = fixtures.length * 2 * 2 * 2;

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

async function verifyHardeningCourseButton(page, origin, definition, fixture, storageKey, sourceRequests, setCatalog) {
	const moduleId = "assembly-unit-12-security-and-reliability-visibility";
	const sourceUrl = `https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/starter`;
	setCatalog(true);
	await page.goto(`${origin}/courses#${moduleId}`, { waitUntil: "domcontentloaded" });
	await page.waitForSelector(".lesson-view-toggle button");
	let href;
	for (const position of [1, 2, 3]) {
		await page.locator(`.lesson-view-toggle button:nth-child(${position})`).click();
		await page.waitForSelector(`.lesson-view-toggle button:nth-child(${position})[aria-pressed='true']`);
		if (!(await page.$(`#${definition.lesson}`))) continue;
		href = await page.$eval(`#${definition.lesson}`, (card, expected) =>
			[...card.querySelectorAll("a")].find((link) => {
				const url = new URL(link.href);
				return url.pathname === "/ide" && url.searchParams.get("starterUrl") === expected;
			})?.getAttribute("href"), sourceUrl);
		if (href) break;
	}
	assert.ok(href, "The actual optional lesson must provide its confirmed IDE action");
	const params = new URL(href, origin).searchParams;
	const itemId = definition.lesson.slice(moduleId.length + 1);
	const key = `assembly:${itemId}:starter:native-assembly`;
	assert.equal(params.get("projectKey"), key);
	assert.equal(params.get("mode"), "assembly");
	assert.equal(sourceRequests(), 0, "The course page must not fetch source");
	setCatalog(false);
	await page.locator(`a[href=${JSON.stringify(href)}]`).click();
	await page.waitForSelector("[data-testid='ide-route-import-confirm']");
	assert.equal(sourceRequests(), 0, "Opening the action must still require consent");
	await confirmProjectImport(page);
	await page.waitForFunction((storage, projectKey) => JSON.parse(localStorage.getItem(storage) ?? "[]").some(p => p.courseProjectKey === projectKey), {}, storageKey, key);
	const saved = await page.evaluate((storage, projectKey) => JSON.parse(localStorage.getItem(storage)).find(p => p.courseProjectKey === projectKey), storageKey, key);
	assert.equal(saved.activeFileName, `starter/${definition.primary}`);
	assert.equal(saved.files.length, 10);
	assert.equal(sourceRequests(), 10);
	return { pack: fixture.pack, itemId, key, activeFile: saved.activeFileName, actualCourseAction: true, consentBeforeFetch: true, importedFiles: 10 };
}

test(
	"Assembly consent, exact role imports, saved edits, native exports and lesson return",
	{ timeout: 360_000 },
	async () => {
		let server, browser, context, page;
		const captures
			= process.env.COURSE_IMPORT_SCREENSHOT_DIR ?? "output/playwright";
		const exports
			= process.env.ASSEMBLY_BROWSER_EXPORT_PROOF_DIR
				?? "output/assembly-exports";
		const proof = [];
		const courseButtons = [];
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
			let catalog = false;
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
					let body = {};
					if (catalog && url.pathname === "/api/accounts/me") body = { userID: "assembly-learner" };
					if (catalog && url.pathname === "/api/users/loggedin") body = { currentUser: { _id: "assembly-learner", name: "Learner fixture", email: "learner@example.invalid", age: 14, state: "GA", courseAccess: ["assembly"], courseProgress: [] } };
					void request.respond({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
				}
				else {
					void request.continue();
				}
			});
			for (const current of fixtures) {
				fixture = current;
				const sourcePack = fixture.sourcePack ?? fixture.pack;
				const definition = workflowDefinitions[fixture.pack];
				const { primary, referenceToken, starterToken = "exits 78", taskFile } = definition;
				for (const width of [1280, 360]) {
					for (const theme of ["light", "dark"]) {
						for (const role of ["starter", "solution"]) {
							if (width === 1280 && theme === "light" && role === "starter" && fixture.pack.startsWith("ASM-2") && ["analysis.md", "trace.md"].includes(primary)) {
								requests = [];
								courseButtons.push(await verifyHardeningCourseButton(page, origin, definition, fixture, storageKey, () => requests.length, value => catalog = value));
							}
							const expectedFiles = Object.keys(
								fixture.files
							).filter(
								path =>
									path.startsWith(
										`${sourcePack}/${role}/`
									) || path === `${sourcePack}/README.md`
							);
							await page.setViewport({ width, height: 900 });
							await page.emulateMediaFeatures([
								{ name: "prefers-color-scheme", value: theme }
							]);
							const key = `assembly:${fixture.pack}-${width}-${theme}:${role === "starter" ? "starter" : "reference"}:native-assembly`;
							const lesson = definition.lesson;
							const params = new URLSearchParams({
								course: "assembly",
								mode: "assembly",
								projectKey: key,
								lesson,
								starterUrl: `https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/${role}`,
								starterTitle: definition.title
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
							assert.equal(
								saved.activeFileName,
								`${role}/${primary}`
							);
							assert.deepEqual(
								saved.files
									.map(
										file => `${sourcePack}/${file.name}`
									)
									.sort(),
								expectedFiles.sort()
							);
							assert.equal(requests.length, expectedFiles.length);
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
								[
									...document.querySelectorAll(".output-line")
								].some(line =>
									line.textContent.includes(
										"ctest --test-dir build"
									)
								)
							);
							assert.ok(
								await page.$eval(
									".result-panel",
									(p, { role, referenceToken, starterToken }) =>
										p.textContent.includes(
											"Linux x86-64"
										)
										&& p.textContent.includes(
											role === "starter"
												? starterToken
												: referenceToken
										),
									{ role, referenceToken, starterToken }
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
							assert.equal(
								Object.keys(entries).length,
								expectedFiles.length
							);
							for (const file of saved.files) {
								const source
									= fixture.files[
										`${sourcePack}/${file.name}`
									];
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
									join(
										exports,
										`${fixture.pack}-${role}.zip`
									),
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
							const name = `${role}/${taskFile ?? primary}`;
							if (taskFile) {
								await page.select("select[aria-label='Active project file']", name);
								await page.waitForFunction(name => document.querySelector("select[aria-label='Active project file']")?.value === name, {}, name);
							}
							const edit = `${saved.files.find(file => file.name === name).content}${taskFile ? "\nSaved worksheet observation: record the actual compiler and trace.\n" : "\n/* Saved Assembly attempt. */\n"}`;
							await page.click(".cm-content");
							const modifier = await page.evaluate(() =>
								/Mac/.test(navigator.platform)
									? "Meta"
									: "Control"
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
											f =>
												f.name === n && f.content === c
										),
								{},
								storageKey,
								key,
								name,
								edit
							);
							await page.reload({
								waitUntil: "domcontentloaded"
							});
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
								expectedFiles.length,
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
											Object.keys(editedEntries).find(
												path =>
													path.endsWith(
														`/${file.name}`
													)
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
							proof.push({
								pack: fixture.pack,
								sourcePack,
								initialFile: saved.activeFileName,
								role,
								width,
								theme,
								files: saved.files.map(f => ({
									name: f.name,
									sha256: createHash("sha256")
										.update(f.content)
										.digest("hex")
								})),
								confirmedBeforeFetch: true,
								savedEditReloaded: true,
								editedExportExact: true,
								legacyPreserved: true,
								returnHref,
								capture
							});
						}
					}
				}
			}
			assert.equal(courseButtons.length, 2);
			await writeFile(join(captures, "assembly-course-buttons-proof.json"), JSON.stringify(courseButtons, null, 2));
			assert.equal(
				proof.length,
				expectedProfiles,
				"Every pack, role, width and theme must complete"
			);
			await writeFile(
				join(captures, "assembly-workflow-proof.json"),
				`${JSON.stringify(proof, null, 2)}\n`
			);
		}
		catch (error) {
			await writeFile(join(captures, "assembly-workflow-partial.json"), JSON.stringify(proof, null, 2));
			if (page) {
				const geometry = await page.evaluate(() => ({
					url: location.href,
					viewport: innerWidth,
					documentWidth: document.documentElement.scrollWidth,
					overflow: [...document.querySelectorAll("body *")].map((node) => {
						const box = node.getBoundingClientRect();
						const style = getComputedStyle(node);
						return { tag: node.tagName, className: (node.getAttribute("class") ?? "").slice(0, 140), right: box.right, width: box.width, minWidth: style.minWidth, overflowX: style.overflowX };
					}).filter(node => node.width > 0 && node.right > innerWidth + 1).slice(0, 20)
				}));
				console.log(JSON.stringify({ event: "assembly-browser-failure-geometry", ...geometry }));
				await writeFile(join(captures, "assembly-failure-geometry.json"), JSON.stringify(geometry, null, 2));
			}
			if (page) {
				await page.screenshot({
					path: join(captures, "assembly-failure.png"),
					fullPage: true
				});
				await writeFile(
					join(captures, "assembly-failure.json"),
					JSON.stringify(
						await page.evaluate(
							s => ({
								url: location.href,
								body: (document.body.textContent ?? "").slice(
									-7000
								),
								storage: localStorage.getItem(s)
							}),
							storageKey
						),
						null,
						2
					)
				);
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
