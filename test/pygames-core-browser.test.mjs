import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { freemem, totalmem } from "node:os";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { confirmProjectImport } from "./ide-workspace-controls.mjs";
import {
	courseAction,
	exportedBytes,
	savedProjects,
	waitSaved
} from "./pygames-core-browser-controls.mjs";
import { pythonFrame } from "./python-frame-fixture.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixture = JSON.parse(
	await readFile(
		new URL(
			"./fixtures/pygames-core-verified-source.json",
			import.meta.url
		),
		"utf8"
	)
);
const cases = JSON.parse(
	await readFile(
		new URL("./fixtures/pygames-core-browser-cases.json", import.meta.url),
		"utf8"
	)
);
const keys = JSON.parse(
	await readFile(
		new URL(
			"./fixtures/pygames-core-published-workspace-keys.json",
			import.meta.url
		),
		"utf8"
	)
).courses;
const storageKey = "classes-python-ide-projects:anonymous";
const digest = value => createHash("sha256").update(value).digest("hex");
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const sourceError
	= /Traceback \(most recent call last\)|(?:Name|Type|Attribute|FileNotFound|Key|Syntax|Import|Value|Index|Runtime)Error:|Could not load shared PyGame/;
const disabledLibraryNotice
	= "Could not load shared PyGame Zero assets: Unable to load PyGame Zero assets (/ide/assets/manifest.json contained no usable assets; /python-ide/assets/manifest.json contained no usable assets).";
function sourceBytes(path) {
	return Buffer.from(fixture.files[path].contentBase64, "base64");
}
function expectedSource(pack, role, name) {
	return sourceBytes(
		name === "README.md" ? `${pack}/README.md` : `${pack}/${role}/${name}`
	);
}
const variants = cases.packs.flatMap(pack => [
	{ ...pack, course: "pygames", variant: "starter", sourceRole: "starter" },
	{
		...pack,
		course: "pygames-classroom",
		variant: "classroom",
		sourceRole: "solution"
	},
	{
		...pack,
		course: "pygames",
		variant: "reference",
		sourceRole: "solution",
		staff: true
	},
	{ ...pack, course: "pygames", variant: "completed", sourceRole: "starter" },
	{ ...pack, course: "pygames", variant: "legacy", legacy: true },
	{ ...pack, course: "pygames-classroom", variant: "legacy", legacy: true }
]);

function projectKey(activity) {
	const key = keys[activity.course][activity.item];
	return activity.variant === "reference"
		? key.replace(/:starter(?=:|$)/, ":reference")
		: key;
}

function earlierProject(activity, key) {
	return {
		_id: "earlier-core-work",
		title: "Saved game",
		mode: "pgzero",
		courseID: activity.course,
		courseProjectKey: activity.legacy
			? key
			: `${activity.course}:earlier-work:starter`,
		activeFileName: "main.py",
		files: [
			{
				name: "main.py",
				content:
					"WIDTH = 640\nHEIGHT = 480\n\ndef draw():\n    screen.fill((21, 41, 61))\n\n# Saved game retained\n"
			}
		],
		createdAt: "2026-10-01T12:00:00.000Z",
		updatedAt: "2026-10-01T12:00:00.000Z"
	};
}

async function selectFile(page, key, name) {
	await page.select("select[aria-label='Active project file']", name);
	await waitSaved(page, key, project => project.activeFileName === name);
}

async function editFile(page, width, key, name, content) {
	if (width < 900) {
		await page
			.locator(".mobile-view-picker button[data-view='code']")
			.click();
	}
	await selectFile(page, key, name);
	await page.waitForSelector(".cm-content", { visible: true });
	await page.focus(".cm-content");
	const modifier = await page.evaluate(() =>
		/Mac/.test(navigator.platform) ? "Meta" : "Control"
	);
	await page.keyboard.down(modifier);
	await page.keyboard.press("a");
	await page.keyboard.up(modifier);
	await page.keyboard.sendCharacter(content);
	await page.keyboard.down(modifier);
	await page.keyboard.press("s");
	await page.keyboard.up(modifier);
	await waitSaved(page, key, project =>
		project.files.some(
			file => file.name === name && file.content === content
		));
	await selectFile(page, key, "main.py");
}

async function retainZip(page, project, output, label) {
	const bytes = await exportedBytes(page);
	const entries = unzipSync(bytes);
	for (const file of project.files) {
		const expected = Buffer.from(
			file.content,
			file.encoding === "base64" ? "base64" : "utf8"
		);
		const matching = Object.keys(entries).filter(path =>
			path.endsWith(`/${file.name}`)
		);
		assert.equal(matching.length, 1);
		assert.ok(
			!matching[0].startsWith("/")
			&& !matching[0].split("/").includes("..")
		);
		assert.deepEqual(Buffer.from(entries[matching[0]]), expected);
	}
	assert.equal(Object.keys(entries).length, project.files.length);
	const name = `${label}.zip`;
	await writeFile(join(output, name), bytes);
	return { name, sha256: digest(bytes), files: project.files.length };
}

async function canvasState(frame) {
	return frame.$eval(
		"canvas.turtle-canvas--game",
		(canvas, rgb) => {
			const pixels = canvas
				.getContext("2d")
				.getImageData(0, 0, canvas.width, canvas.height)
				.data;
			let count = 0;
			let left = canvas.width;
			let top = canvas.height;
			let right = -1;
			let bottom = -1;
			let shots = 0;
			for (let y = 0; y < canvas.height; y++) {
				for (let x = 0; x < canvas.width; x++) {
					const offset = (y * canvas.width + x) * 4;
					if (
						pixels[offset] === 255
						&& pixels[offset + 1] === 220
						&& pixels[offset + 2] === 70
					) {
						shots++;
					}
					if (
						pixels[offset] !== rgb[0]
						|| pixels[offset + 1] !== rgb[1]
						|| pixels[offset + 2] !== rgb[2]
					) {
						continue;
					}
					count++;
					left = Math.min(left, x);
					top = Math.min(top, y);
					right = Math.max(right, x);
					bottom = Math.max(bottom, y);
				}
			}
			return {
				width: canvas.width,
				height: canvas.height,
				bodyPixels: count,
				bodyBounds: count ? [left, top, right, bottom] : null,
				shotPixels: shots,
				pngBase64: canvas.toDataURL("image/png").split(",")[1]
			};
		},
		cases.sprite.bodyRgb
	);
}

// Sample only this test's browser process tree. RSS can count shared pages
// more than once; these observations diagnose CI pressure, not a memory limit.
async function browserResources(browser) {
	const rootPid = browser?.process()?.pid;
	const result = {
		recordedAt: new Date().toISOString(),
		browserPid: rootPid,
		harnessRssBytes: process.memoryUsage().rss,
		hostFreeBytes: freemem(),
		hostTotalBytes: totalmem(),
		observedProcessCount: 0,
		observedRssKiB: null,
		processSampleTruncated: false
	};
	if (process.platform !== "linux" || !rootPid) return result;
	const pending = [rootPid];
	const seen = new Set();
	let rss = 0;
	while (pending.length && seen.size < 64) {
		const pid = pending.shift();
		if (seen.has(pid)) continue;
		seen.add(pid);
		const [status, children] = await Promise.all([
			readFile(`/proc/${pid}/status`, "utf8").catch(() => ""),
			readFile(`/proc/${pid}/task/${pid}/children`, "utf8").catch(
				() => ""
			)
		]);
		const resident = status.match(/^VmRSS:\s+(\d+) kB$/m);
		if (resident) {
			rss += Number(resident[1]);
			result.observedProcessCount++;
		}
		for (const child of children.trim().split(/\s+/)) {
			const value = Number(child);
			if (Number.isSafeInteger(value) && value > 0 && !seen.has(value))
				pending.push(value);
		}
	}
	result.observedRssKiB = result.observedProcessCount ? rss : null;
	result.processSampleTruncated = pending.length > 0;
	return result;
}

async function boundedRuntimeDiagnostic(action) {
	let timer;
	try {
		return await Promise.race([
			action(),
			new Promise((resolve) => {
				timer = setTimeout(resolve, 5000, {
					diagnosticError: "Five-second diagnostic deadline"
				});
			})
		]);
	}
	catch (error) {
		return { diagnosticError: error.message };
	}
	finally {
		clearTimeout(timer);
	}
}

async function waitForOwnedChild(child, timeoutMs) {
	if (!child || child.exitCode !== null || child.signalCode !== null)
		return true;
	let onExit;
	let timer;
	const exited = new Promise((resolve) => {
		onExit = () => resolve(true);
		child.once("exit", onExit);
	});
	try {
		return await Promise.race([
			exited,
			new Promise((resolve) => {
				timer = setTimeout(resolve, timeoutMs, false);
			})
		]);
	}
	finally {
		clearTimeout(timer);
		child.removeListener("exit", onExit);
	}
}

async function observeRun(
	page,
	activity,
	width,
	complete,
	controls,
	output,
	label
) {
	console.log(
		JSON.stringify({
			event: "core-runtime-start",
			label,
			complete,
			controls,
			time: new Date().toISOString()
		})
	);
	const captures = [];
	const pointerTargets = [];
	let pointerEvents = [];
	let runtimeSucceeded = false;
	await page.locator("button.run-control").click();
	if (width < 900) {
		await page
			.locator(".mobile-view-picker button[data-view='canvas']")
			.click();
	}
	try {
		await page.waitForFunction(
			() =>
				/^(?:Game running|Run failed)$/.test(
					document
						.querySelector("[data-testid='ide-run-status']")
						?.textContent
						.trim() ?? ""
				),
			{ timeout: 90000 }
		);
		assert.equal(
			await page.$eval("[data-testid='ide-run-status']", element =>
				element.textContent.trim()),
			"Game running",
			await page.$eval(".output-panel", element => element.textContent)
		);
		const frame = await pythonFrame(page);
		const expectedWidth
			= activity.kind === "setup" && !complete ? 320 : 640;
		const expectedHeight
			= activity.kind === "setup" && !complete ? 240 : 480;
		await frame.waitForFunction(
			(rgb, w, h, expected) => {
				const c = document.querySelector("canvas.turtle-canvas--game");
				if (!c || c.width !== w || c.height !== h) return false;
				const p = c.getContext("2d").getImageData(0, 0, w, h).data;
				let count = 0;
				for (let i = 0; i < p.length; i += 4) {
					if (
						p[i] === rgb[0]
						&& p[i + 1] === rgb[1]
						&& p[i + 2] === rgb[2]
					) {
						count++;
					}
				}
				return count === expected;
			},
			{ timeout: 90000 },
			cases.sprite.bodyRgb,
			expectedWidth,
			expectedHeight,
			cases.sprite.bodyPixels
		);
		async function capture(name) {
			const value = await canvasState(frame);
			const bytes = Buffer.from(value.pngBase64, "base64");
			delete value.pngBase64;
			const filename = `${label}-${name}.png`;
			await writeFile(join(output, filename), bytes);
			const record = {
				name,
				...value,
				screenshot: filename,
				screenshotSha256: digest(bytes)
			};
			captures.push(record);
			return record;
		}
		const startup = await capture("startup");
		const canvas = await frame.$("canvas.turtle-canvas--game");
		const box = await canvas.boundingBox();
		assert.ok(box);
		if (controls && activity.kind === "sprites") {
			await canvas.evaluate((element) => {
				window.__corePointerProof = [];
				element.addEventListener("mousedown", (event) => {
					const rect = element.getBoundingClientRect();
					window.__corePointerProof.push({
						clientX: event.clientX,
						clientY: event.clientY,
						button: event.button,
						rect: rect.toJSON(),
						x: Math.floor(
							((event.clientX - rect.left) / rect.width) * 640
						),
						y: Math.floor(
							((event.clientY - rect.top) / rect.height) * 480
						)
					});
				});
			});
			async function clickCorner(name, lower) {
				const target = await canvas.evaluate((element, lower) => {
					const rect = element.getBoundingClientRect();
					// One pixel from the box corner lies outside its rounded hit area.
					const x = lower ? rect.width - 5 : 5;
					const y = lower ? rect.height - 5 : 5;
					return {
						x,
						y,
						logicalX: (x / rect.width) * 640,
						logicalY: (y / rect.height) * 480,
						hitCanvas:
							document.elementFromPoint(
								rect.left + x,
								rect.top + y
							) === element
					};
				}, lower);
				assert.equal(
					target.hitCanvas,
					true,
					`Canvas must receive ${name} input`
				);
				assert.ok(
					lower
						? target.logicalX > 607 && target.logicalY > 434
						: target.logicalX < 33 && target.logicalY < 46
				);
				pointerTargets.push({ name, ...target });
				await page.mouse.click(box.x + target.x, box.y + target.y);
				pointerEvents = await frame.evaluate(
					() => window.__corePointerProof
				);
			}
			await clickCorner("top-left", false);
			await pause(120);
			const upper = await capture("top-left");
			assert.equal(
				upper.bodyPixels === cases.sprite.bodyPixels,
				complete
			);
			if (complete)
				assert.deepEqual(upper.bodyBounds, cases.sprite.bodyBounds);
			await clickCorner("bottom-right", true);
			await pause(120);
			const lower = await capture("bottom-right");
			assert.equal(
				lower.bodyPixels === cases.sprite.bodyPixels,
				complete
			);
			if (complete)
				assert.deepEqual(lower.bodyBounds, [576, 444, 634, 478]);
			await page.mouse.click(
				box.x + box.width / 2,
				box.y + box.height / 2,
				{ button: "right" }
			);
			await pause(120);
			const rightClick = await capture("right-click");
			assert.equal(rightClick.screenshotSha256, lower.screenshotSha256);
			await page.mouse.click(
				box.x + box.width / 2,
				box.y + box.height / 2
			);
			await pause(120);
			const center = await capture("center");
			pointerEvents = await frame.evaluate(
				() => window.__corePointerProof
			);
			assert.deepEqual(
				pointerEvents.map(event => event.button),
				[0, 0, 2, 0]
			);
			const centerInput = pointerEvents[3];
			assert.equal(center.bodyPixels, cases.sprite.bodyPixels);
			assert.deepEqual(center.bodyBounds, [
				centerInput.x - 31,
				centerInput.y + 10,
				centerInput.x + 27,
				centerInput.y + 44
			]);
		}
		else if (controls && activity.kind === "master") {
			await page.mouse.click(
				box.x + box.width / 2,
				box.y + box.height / 2
			);
			await page.keyboard.press("Enter");
			await pause(120);
			await page.keyboard.down("ArrowRight");
			await pause(240);
			await page.keyboard.up("ArrowRight");
			const moved = await capture("held-right");
			assert.equal(moved.bodyBounds[0] > startup.bodyBounds[0], complete);
			await page.keyboard.press("Escape");
			await pause(120);
			const paused = await capture("paused");
			await pause(180);
			const pausedAgain = await capture("paused-again");
			assert.deepEqual(pausedAgain.bodyBounds, paused.bodyBounds);
			await page.keyboard.press("r");
			await pause(120);
			const restarted = await capture("restart");
			assert.deepEqual(restarted.bodyBounds, startup.bodyBounds);
			await page.keyboard.press("Space");
			if (complete) {
				await frame.waitForFunction(
					() => {
						const c = document.querySelector(
							"canvas.turtle-canvas--game"
						);
						const p = c
							.getContext("2d")
							.getImageData(0, 0, c.width, c.height)
							.data;
						for (let i = 0; i < p.length; i += 4) {
							if (
								p[i] === 255
								&& p[i + 1] === 220
								&& p[i + 2] === 70
							) {
								return true;
							}
						}
						return false;
					},
					{ timeout: 4000 }
				);
			}
			else {
				await pause(120);
			}
			const fired = await capture("fired");
			assert.equal(fired.shotPixels > 0, complete);
			await page.keyboard.press("r");
			await pause(120);
			const reset = await capture("reset-after-fire");
			assert.deepEqual(reset.bodyBounds, startup.bodyBounds);
			assert.equal(reset.shotPixels, 0);
		}
		assert.ok(
			!sourceError.test(
				(
					await page.$eval(
						".output-panel",
						element => element.textContent
					)
				).replaceAll(disabledLibraryNotice, "")
			)
		);
		assert.equal(
			await page.$eval("button.run-control", element =>
				element.textContent.trim()),
			"Stop"
		);
		let workspaceEvidence = null;
		if (label.endsWith("-reopened")) {
			const bounds = await canvas.boundingBox();
			assert.ok(bounds);
			const layout = await page.evaluate(() => ({
				x: scrollX,
				y: scrollY,
				fits: document.documentElement.scrollWidth <= innerWidth
			}));
			assert.equal(layout.fits, true);
			const status = await page.$eval(
				"[data-testid='ide-run-status']",
				element => element.textContent.trim()
			);
			assert.equal(status, "Game running");
			const image = label.replace(/-reopened$/, "-workspace.png");
			await page.screenshot({
				path: join(output, image),
				fullPage: true
			});
			workspaceEvidence = {
				image,
				status,
				canvasBounds: {
					...bounds,
					x: bounds.x + layout.x,
					y: bounds.y + layout.y
				}
			};
		}
		runtimeSucceeded = true;
		return {
			label,
			complete,
			controls,
			captures,
			pointerTargets,
			pointerEvents,
			workspaceEvidence,
			realCanvasPixels: true
		};
	}
	catch (error) {
		const diagnostic = await boundedRuntimeDiagnostic(async () => {
			const frame = await pythonFrame(page).catch(() => null);
			const pixels = frame
				? await canvasState(frame).catch(() => null)
				: null;
			if (pixels) {
				await writeFile(
					join(output, `${label}-active-failure-canvas.png`),
					Buffer.from(pixels.pngBase64, "base64")
				);
				delete pixels.pngBase64;
			}
			await writeFile(
				join(output, `${label}-active-failure.json`),
				JSON.stringify(
					{
						label,
						error: String(error),
						captures,
						pointerTargets,
						pointerEvents,
						pixels,
						frame: frame
							? await frame
									.evaluate(() => {
										const canvas = document.querySelector(
											"canvas.turtle-canvas--game"
										);
										const rect
											= canvas?.getBoundingClientRect();
										return {
											url: location.href,
											canvas: canvas
												? {
														width: canvas.width,
														height: canvas.height,
														style: canvas.getAttribute(
															"style"
														),
														rect: rect?.toJSON(),
														devicePixelRatio
													}
												: null
										};
									})
									.catch(() => null)
							: null,
						status: await page
							.$eval(
								"[data-testid='ide-run-status']",
								element => element.textContent
							)
							.catch(() => "unavailable"),
						output: await page
							.$eval(
								".output-panel",
								element => element.textContent
							)
							.catch(() => "unavailable")
					},
					null,
					2
				)
			);
			await page
				.screenshot({
					path: join(output, `${label}-active-failure.png`),
					fullPage: true
				})
				.catch(() => {});
			return true;
		});
		if (diagnostic?.diagnosticError) {
			await writeFile(
				join(output, `${label}-diagnostic-timeout.json`),
				JSON.stringify(
					{ label, error: String(error), ...diagnostic },
					null,
					2
				)
			);
		}
		throw error;
	}
	finally {
		if (
			runtimeSucceeded
			&& (await page
				.$eval("button.run-control", element =>
					element.textContent.trim())
				.catch(() => "")) === "Stop"
		) {
			await page.locator("button.run-control").click();
			await page.waitForFunction(
				() =>
					document
						.querySelector("button.run-control")
						?.textContent
						.trim() === "Run"
			);
		}
	}
}

nodeTest(
	"PyGames core course consent, self-contained PNG, edits, native-equivalent run and saved continuation",
	{ timeout: 1500000 },
	async (t) => {
		const output
			= process.env.PYGAMES_CORE_BROWSER_PROOF_DIR
				?? "output/pygames-core-exports";
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID ?? "pygames-core-browser";
		const startedAt = new Date().toISOString();
		const profiles = [];
		let server, browser, context;
		let outcome = 1;
		const browserSessions = [];
		let currentBrowserSession;
		let closingBrowser;
		async function closeBrowser(reason) {
			if (closingBrowser) return closingBrowser;
			const owned = browser;
			const session = currentBrowserSession;
			if (!owned) return;
			browser = null;
			currentBrowserSession = null;
			closingBrowser = (async () => {
				const child = owned.process();
				const closed = await boundedRuntimeDiagnostic(async () => {
					await owned.close();
					return true;
				});
				let cleanup
					= closed === true
						? "closed through browser API"
						: "browser close did not complete";
				if (!(await waitForOwnedChild(child, 1000))) {
					child.kill("SIGTERM");
					cleanup = "terminated owned browser after close deadline";
					if (!(await waitForOwnedChild(child, 3000))) {
						child.kill("SIGKILL");
						cleanup
							= "killed owned browser after termination deadline";
					}
					assert.ok(
						await waitForOwnedChild(child, 3000),
						"Owned browser did not exit"
					);
				}
				Object.assign(session, {
					endedAt: new Date().toISOString(),
					exitCode: child?.exitCode ?? null,
					signalCode: child?.signalCode ?? null,
					childProcessCleanup: cleanup,
					reason
				});
				console.log(
					JSON.stringify({ event: "browser-end", taskId, ...session })
				);
				await writeFile(
					join(output, "core-browser-sessions.json"),
					JSON.stringify(
						{
							maxProfilesPerBrowser: 2,
							maxRuntimeRunsPerBrowser: 6,
							sessions: browserSessions
						},
						null,
						2
					)
				);
			})();
			try {
				await closingBrowser;
			}
			finally {
				closingBrowser = null;
			}
		}
		async function ensureBrowser(executablePath) {
			if (browser && currentBrowserSession.completedProfiles >= 2)
				await closeBrowser("core profile batch complete");
			if (browser) return;
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			const child = browser.process();
			currentBrowserSession = {
				id: browserSessions.length,
				pid: child?.pid,
				parentPid: process.pid,
				cwd: root,
				command: child?.spawnargs,
				startedAt: new Date().toISOString(),
				timeoutMs: 1500000,
				completedProfiles: 0,
				completedRuntimeRuns: 0,
				resources: [],
				events: []
			};
			const session = currentBrowserSession;
			browserSessions.push(session);
			browser.on("disconnected", () => {
				session.events.push({
					event: "browser-disconnected",
					at: new Date().toISOString()
				});
			});
			console.log(
				JSON.stringify({ event: "browser-start", taskId, ...session })
			);
		}
		let cleanupPromise;
		const cleanup = () => {
			if (cleanupPromise) return cleanupPromise;
			cleanupPromise = (async () => {
				const ownedContext = context;
				const ownedServer = server;
				context = server = null;
				if (ownedContext)
					await boundedRuntimeDiagnostic(() => ownedContext.close());
				await closeBrowser("test cleanup");
				if (ownedServer) await ownedServer.close();
			})();
			return cleanupPromise;
		};
		t.signal.addEventListener(
			"abort",
			() => {
				void cleanup();
			},
			{ once: true }
		);
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				cwd: root,
				command: process.argv,
				pid: process.pid,
				parentPid: process.ppid,
				startedAt,
				timeoutMs: 1500000
			})
		);
		try {
			await mkdir(output, { recursive: true });
			for (const [name, source] of Object.entries(fixture.files)) {
				const data = Buffer.from(source.contentBase64, "base64");
				assert.equal(data.length, source.byteLength, name);
				assert.equal(digest(data), source.sha256, name);
			}
			const emptyManifest = JSON.parse(
				await readFile(
					join(root, "public/ide/assets/manifest.json"),
					"utf8"
				)
			);
			emptyManifest.assets = [];
			server = await preview({
				root,
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(path => path && existsSync(path));
			assert.ok(executablePath);
			for (const activity of variants) {
				for (const width of [390, 1280]) {
					await ensureBrowser(executablePath);
					const session = currentBrowserSession;
					const firstProfileCount = profiles.length;
					const key = projectKey(activity);
					const seed = earlierProject(activity, key);
					const label = `${activity.course}-${activity.kind}-${activity.variant}-${width}`;
					console.log(
						JSON.stringify({
							event: "core-profile",
							label,
							time: new Date().toISOString()
						})
					);
					context = await browser.createBrowserContext();
					const page = await context.newPage();
					for (const event of ["error", "pageerror"]) {
						page.on(event, (error) => {
							session.events.push({
								event,
								label,
								at: new Date().toISOString(),
								message: String(error).slice(0, 3000)
							});
						});
					}
					const state = {
						catalog: true,
						requests: [],
						sharedAssetFallbacks: [],
						remoteWrites: 0
					};
					try {
						await page.setViewport({ width, height: 950 });
						await page.evaluateOnNewDocument(
							(storage, earlier) => {
								if (window !== window.top) return;
								if (localStorage.getItem(storage) === null) {
									localStorage.setItem(
										storage,
										JSON.stringify([earlier])
									);
								}
								const create = URL.createObjectURL;
								URL.createObjectURL = (blob) => {
									if (blob.type === "application/zip")
										window.__pyGamesArchive = blob;
									return create(blob);
								};
								const click = HTMLAnchorElement.prototype.click;
								HTMLAnchorElement.prototype.click
									= function () {
										if (
											this.download.endsWith(".zip")
											&& this.href.startsWith("blob:")
										) {
											return;
										}
										return click.call(this);
									};
							},
							storageKey,
							seed
						);
						const learner = {
							_id: "core-learner",
							name: "Learner",
							email: "learner@example.invalid",
							age: 14,
							state: "GA",
							courseAccess: [activity.course],
							courseProgress: []
						};
						const tutor = {
							_id: "core-tutor",
							name: "Tutor",
							email: "tutor@example.invalid",
							age: 30,
							state: "GA",
							usersOfTutorLength: 1,
							coursePermissions: [activity.course],
							editTutors: false,
							saveEdit: "Save"
						};
						await page.setRequestInterception(true);
						page.on("request", (request) => {
							const url = new URL(request.url());
							if (url.hostname === "raw.githubusercontent.com") {
								const match = url.pathname.match(
									/^\/instruction-material\/PyGames\/([a-f0-9]{40})\/(.+)$/
								);
								const name = match
									? decodeURIComponent(match[2])
									: "";
								const source = fixture.files[name];
								const valid
									= !!source && match[1] === fixture.revision;
								state.requests.push({
									path: name,
									revision: match?.[1],
									valid
								});
								void request.respond({
									status: valid ? 200 : 404,
									contentType: name.endsWith(".png")
										? "image/png"
										: "text/plain",
									headers: {
										"access-control-allow-origin": "*"
									},
									body: valid
										? Buffer.from(
												source.contentBase64,
												"base64"
											)
										: "Unknown source"
								});
							}
							else if (
								/\/(?:python-ide|ide)\/assets\/manifest\.json$/.test(
									url.pathname
								)
							) {
								void request.respond({
									status: 200,
									contentType: "application/json",
									headers: {
										"access-control-allow-origin": "*"
									},
									body: JSON.stringify(emptyManifest)
								});
							}
							else if (
								/\/(?:python-ide|ide)\/assets\/(?:images|sounds|music)\//.test(
									url.pathname
								)
							) {
								state.sharedAssetFallbacks.push(url.pathname);
								void request.respond({
									status: 404,
									body: "Shared course media is deliberately unavailable in this test."
								});
							}
							else if (url.pathname.startsWith("/api/")) {
								if (
									!["GET", "OPTIONS"].includes(
										request.method()
									)
								) {
									state.remoteWrites++;
								}
								let body = {};
								if (
									state.catalog
									&& url.pathname === "/api/accounts/me"
								) {
									body = activity.staff
										? { tutorID: tutor._id }
										: { userID: learner._id };
								}
								if (
									state.catalog
									&& url.pathname === "/api/users/loggedin"
								) {
									body = { currentUser: learner };
								}
								if (
									state.catalog
									&& url.pathname === "/api/tutors/loggedin"
								) {
									body = { currentTutor: tutor };
								}
								if (
									state.catalog
									&& url.pathname
									=== `/api/users/oftutor/${tutor._id}`
								) {
									body = [learner];
								}
								void request.respond({
									status: 200,
									contentType: "application/json",
									body: JSON.stringify(body)
								});
							}
							else {
								void request.continue();
							}
						});
						const href = await courseAction(page, origin, {
							...activity,
							key,
							name: label
						});
						const params = new URL(href, origin).searchParams;
						assert.equal(params.get("projectKey"), key);
						assert.equal(state.requests.length, 0);
						state.catalog = false;
						await page.$eval(
							`a[href=${JSON.stringify(href)}]`,
							(element) => {
								element.target = "_self";
							}
						);
						await page
							.locator(`a[href=${JSON.stringify(href)}]`)
							.click();
						await page.waitForSelector(
							"select[aria-label='Active project file'], [data-testid='ide-route-import-confirm']"
						);
						if (activity.legacy) {
							await page.waitForSelector(
								"select[aria-label='Active project file']"
							);
							assert.equal(
								await page.$(
									"[data-testid='ide-route-import-confirm']"
								),
								null
							);
							const saved = await waitSaved(page, key);
							assert.equal(saved._id, seed._id);
							assert.deepEqual(saved.files, seed.files);
							assert.equal(state.requests.length, 0);
							const archive = await retainZip(
								page,
								saved,
								output,
								`${label}-legacy`
							);
							profiles.push({
								label,
								course: activity.course,
								kind: activity.kind,
								variant: activity.variant,
								width,
								key,
								href,
								original: seed,
								saved,
								archive,
								sourceRequests: state.requests,
								legacyUnchanged: true
							});
							continue;
						}
						await page.waitForSelector(
							"[data-testid='ide-route-import-confirm']"
						);
						assert.equal(state.requests.length, 0);
						assert.ok(
							!(await savedProjects(page)).some(
								project => project.courseProjectKey === key
							)
						);
						await confirmProjectImport(page);
						await page.waitForSelector(
							"select[aria-label='Active project file']"
						);
						const initial = await waitSaved(
							page,
							key,
							project => project.files.length === 7
						);
						assert.equal(initial.activeFileName, "main.py");
						assert.equal(state.requests.length, 7);
						assert.ok(
							state.requests.every(request => request.valid)
						);
						assert.deepEqual(
							initial.files.map(file => file.name),
							[
								"main.py",
								activity.task,
								"contracts.py",
								"requirements.txt",
								"observations.md",
								"images/alien.png",
								"README.md"
							]
						);
						for (const file of initial.files) {
							const data = Buffer.from(
								file.content,
								file.encoding === "base64" ? "base64" : "utf8"
							);
							if (
								activity.variant === "classroom"
								&& file.name === "main.py"
							) {
								assert.ok(
									file.content.includes(
										"###   NORMAL SECTION"
									)
									&& file.content.includes(
										"###   HARD SECTION"
									)
								);
							}
							else {
								assert.deepEqual(
									data,
									expectedSource(
										activity.pack,
										activity.sourceRole,
										file.name
									)
								);
							}
						}
						const exact = await retainZip(
							page,
							initial,
							output,
							`${label}-exact`
						);
						const initialComplete
							= activity.sourceRole === "solution";
						const before = await observeRun(
							page,
							activity,
							width,
							initialComplete,
							false,
							output,
							`${label}-before-edit`
						);
						const task = initial.files.find(
							file => file.name === activity.task
						);
						const text = `${
							activity.variant === "completed"
								? expectedSource(
										activity.pack,
										"solution",
										activity.task
									).toString("utf8")
								: task.content
						}\n# Saved browser observation ${label}\n`;
						await editFile(page, width, key, activity.task, text);
						const edited = await waitSaved(
							page,
							key,
							project =>
								project.activeFileName === "main.py"
								&& project.files.some(
									file =>
										file.name === activity.task
										&& file.content === text
								)
						);
						const complete
							= initialComplete || activity.variant === "completed";
						const after = await observeRun(
							page,
							activity,
							width,
							complete,
							true,
							output,
							`${label}-after-edit`
						);
						await page.reload({ waitUntil: "domcontentloaded" });
						await page.waitForSelector(
							"select[aria-label='Active project file']"
						);
						assert.equal(
							await page.$(
								"[data-testid='ide-route-import-confirm']"
							),
							null
						);
						const reopened = await waitSaved(page, key);
						assert.deepEqual(reopened.files, edited.files);
						const reopenedRuntime = await observeRun(
							page,
							activity,
							width,
							complete,
							true,
							output,
							`${label}-reopened`
						);
						const editedArchive = await retainZip(
							page,
							reopened,
							output,
							`${label}-edited`
						);
						const all = await savedProjects(page);
						assert.deepEqual(
							all.find(project => project._id === seed._id).files,
							seed.files
						);
						assert.equal(
							all.filter(
								project => project.courseProjectKey === key
							).length,
							1
						);
						assert.equal(state.remoteWrites, 0);
						assert.equal(state.sharedAssetFallbacks.length, 0);
						assert.equal(state.requests.length, 7);
						assert.equal(
							await page.evaluate(
								() =>
									document.documentElement.scrollWidth
									<= innerWidth
							),
							true
						);
						profiles.push({
							label,
							course: activity.course,
							kind: activity.kind,
							pack: activity.pack,
							variant: activity.variant,
							sourceRole: activity.sourceRole,
							width,
							key,
							href,
							consentBeforeFetch: true,
							primaryIndexedDbRead: true,
							initialFiles: initial.files,
							editedFiles: edited.files,
							reopenedFiles: reopened.files,
							exact,
							editedArchive,
							sourceRequests: state.requests,
							before,
							after,
							reopenedRuntime,
							sharedAssetFallbacks: state.sharedAssetFallbacks,
							remoteWrites: state.remoteWrites,
							priorWorkPreserved: true,
							helperRerunAndReopenVerified: true
						});
					}
					catch (error) {
						const diagnostic = await boundedRuntimeDiagnostic(
							async () => ({
								outputText: await page
									.$eval(
										".output-panel",
										element => element.textContent
									)
									.catch(() => "unavailable"),
								runStatus: await page
									.$eval(
										"[data-testid='ide-run-status']",
										element => element.textContent
									)
									.catch(() => "unavailable"),
								projects: await savedProjects(page).catch(
									() => []
								)
							})
						);
						await writeFile(
							join(output, `${label}-failure.json`),
							JSON.stringify(
								{
									label,
									state,
									message: String(error),
									profilesCompleted: profiles.length,
									...diagnostic,
									browserSession: session.id,
									resources: await browserResources(browser),
									events: session.events
								},
								null,
								2
							)
						);
						await boundedRuntimeDiagnostic(() =>
							page.screenshot({
								path: join(output, `${label}-failure.png`),
								fullPage: true
							})
						);
						throw error;
					}
					finally {
						const ownedContext = context;
						context = null;
						const contextClosed = await boundedRuntimeDiagnostic(
							async () => {
								if (ownedContext) await ownedContext.close();
								return true;
							}
						);
						if (contextClosed !== true)
							await closeBrowser("context cleanup deadline");
						if (profiles.length === firstProfileCount + 1) {
							session.completedProfiles++;
							if (!profiles.at(-1).legacyUnchanged)
								session.completedRuntimeRuns += 3;
						}
						session.resources.push({
							profilesCompleted: profiles.length,
							...(await browserResources(browser))
						});
						await writeFile(
							join(output, "core-browser-partial-proof.json"),
							JSON.stringify(
								{
									sourceRevision: fixture.revision,
									profiles,
									browserSessions
								},
								null,
								2
							)
						);
					}
				}
			}
			await closeBrowser("all core profiles complete");
			assert.equal(profiles.length, 36);
			assert.equal(
				browserSessions.reduce(
					(sum, session) => sum + session.completedProfiles,
					0
				),
				36
			);
			assert.equal(
				browserSessions.reduce(
					(sum, session) => sum + session.completedRuntimeRuns,
					0
				),
				72
			);
			assert.ok(
				browserSessions.every(
					session =>
						session.completedProfiles <= 2
						&& session.completedRuntimeRuns <= 6
						&& session.endedAt
						&& session.exitCode === 0
				)
			);
			assert.equal(
				profiles.filter(profile => profile.legacyUnchanged).length,
				12
			);
			await writeFile(
				join(output, "core-browser-proof.json"),
				JSON.stringify(
					{
						sourceRevision: fixture.revision,
						profiles,
						browserSessions,
						maxProfilesPerBrowser: 2,
						maxRuntimeRunsPerBrowser: 6,
						failureDiagnosticDeadlineMs: 5000,
						sharedLibraryDisabled: true,
						workspaceImagesCapturedDuringRun: true,
						expectedSourceFiles: fixture.files,
						scope: "Actual course actions and prefetch consent, complete role/PNG imports, primary IndexedDB, edited helper reruns, reopened work, exact/edited ZIPs, real canvas pixels and input. Native terminal-state contracts are separately validated."
					},
					null,
					2
				)
			);
			outcome = 0;
		}
		finally {
			await cleanup();
			console.log(
				JSON.stringify({
					event: "end",
					taskId,
					cwd: root,
					command: process.argv,
					pid: process.pid,
					parentPid: process.ppid,
					startedAt,
					endedAt: new Date().toISOString(),
					exitCode: outcome,
					timeoutMs: 1500000,
					childProcessGroupCleanup:
						"owned pages, contexts, browser and preview server closed"
				})
			);
		}
	}
);
