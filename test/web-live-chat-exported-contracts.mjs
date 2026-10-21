import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { appendFileSync, existsSync } from "node:fs";
import { mkdir, readFile, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";

async function main() {
	const { values } = parseArgs({
		options: {
			source: { type: "string" },
			exports: { type: "string" },
			browser: { type: "string" },
			proof: { type: "string" }
		}
	});
	for (const name of ["source", "exports", "browser", "proof"])
		assert.ok(values[name], `Missing --${name}`);
	const source = path.resolve(values.source);
	const proofPath = path.resolve(values.proof);
	const output = path.dirname(proofPath);
	await mkdir(output, { recursive: true });
	const logPath = path.join(output, "owned-processes.jsonl");
	const fixture = JSON.parse(
		await readFile(
			new URL("./fixtures/web-live-chat-source.json", import.meta.url),
			"utf8"
		)
	);
	const digest = bytes => createHash("sha256").update(bytes).digest("hex");
	for (const [name, hash] of Object.entries(fixture.rootInputs)) {
		assert.equal(
			digest(
				(await readFile(path.join(source, name), "utf8")).replaceAll(
					"\r\n",
					"\n"
				)
			),
			hash,
			`Pinned dependency input ${name}`
		);
	}
	for (const [name, file] of Object.entries(fixture.files)) {
		assert.equal(
			digest(
				(await readFile(path.join(source, name), "utf8")).replaceAll(
					"\r\n",
					"\n"
				)
			),
			file.sha256,
			`Pinned source ${name}`
		);
	}
	assert.ok(
		existsSync(path.join(source, "node_modules")),
		"Install the maintained root dependencies before native checks"
	);
	const courseProof = JSON.parse(
		await readFile(
			path.join(values.browser, "web-live-chat-course-proof.json"),
			"utf8"
		)
	);
	assert.equal(courseProof.profiles.length, 4);
	let profileSource, profileName;
	async function prepareArchive(archive, role, name, hashes) {
		const bytes = await readFile(archive);
		const entries = unzipSync(bytes);
		const expected = Object.keys(fixture.files)
			.filter(name => name.startsWith(`${fixture.pack}/${role}/`))
			.map(name => name.slice(`${fixture.pack}/${role}/`.length))
			.concat("README.md");
		assert.equal(Object.keys(entries).length, expected.length);
		const root = path.join(output, "workspaces", `${process.pid}-${name}`);
		const destination = path.join(root, fixture.pack, role);
		await mkdir(destination, { recursive: true });
		const found = new Set();
		for (const [entry, content] of Object.entries(entries)) {
			assert.ok(
				!entry.startsWith("/")
				&& !entry.includes("\\")
				&& !entry.split("/").includes("..")
			);
			const matches = expected.filter(name => entry.endsWith(`/${name}`));
			assert.equal(matches.length, 1);
			const name = matches[0];
			assert.ok(!found.has(name));
			found.add(name);
			if (hashes) {
				assert.equal(
					digest(content),
					hashes.find(row => row.name === name)?.sha256
				);
			}
			const file = path.join(destination, name);
			await mkdir(path.dirname(file), { recursive: true });
			await writeFile(file, content);
		}
		assert.deepEqual([...found].sort(), expected.sort());
		await symlink(
			path.join(source, "node_modules"),
			path.join(root, "node_modules"),
			"dir"
		);
		return {
			root,
			archiveSHA256: digest(bytes),
			sourceFiles: expected.length
		};
	}
	const task = process.env.CLASSES_FAMILY_TASK_ID ?? "web-live-chat-native-ci";
	const cleanups = new Set();
	const proof = {
		accepted: false,
		sourceRevision: fixture.revision,
		profiles: [],
		runnerPid: process.pid,
		nativeLearningProject: true
	};
	function log(row) {
		return appendFileSync(
			logPath,
			`${JSON.stringify({
				task,
				parentPid: process.pid,
				at: new Date().toISOString(),
				...row
			})}\n`
		);
	}
	async function cleanupAll() {
		await Promise.allSettled([...cleanups].map(stop => stop()));
	}
	const runtimeTimer = setTimeout(() => {
		void cleanupAll().finally(() => process.exit(124));
	}, 360000);
	runtimeTimer.unref();
	for (const signal of ["SIGINT", "SIGTERM"]) {
		process.once(signal, async () => {
			await cleanupAll();
			process.exit(signal === "SIGINT" ? 130 : 143);
		});
	}
	async function start(role, port = 0) {
		const file = path.join(
			profileSource,
			"WDF4-Realtime-Chat-App",
			role,
			"src/server.js"
		);
		const command = [process.execPath, file];
		const child = spawn(command[0], command.slice(1), {
			cwd: profileSource,
			env: { ...process.env, PORT: String(port) },
			stdio: ["ignore", "pipe", "pipe"],
			detached: true
		});
		const exited = once(child, "exit");
		exited.catch(() => {});
		const kill = (signal) => {
			if (
				child.pid
				&& child.exitCode === null
				&& child.signalCode === null
			) {
				try {
					process.kill(-child.pid, signal);
				}
				catch (error) {
					if (error.code !== "ESRCH") throw error;
				}
			}
		};
		const lifetime = setTimeout(kill, 180000, "SIGKILL");
		let stopping;
		const stop = () =>
			(stopping ??= (async () => {
				kill("SIGTERM");
				const timer = setTimeout(kill, 2000, "SIGKILL");
				try {
					await exited;
				}
				finally {
					clearTimeout(lifetime);
					clearTimeout(timer);
					cleanups.delete(stop);
					log({
						event: "end",
						command,
						cwd: profileSource,
						pid: child.pid,
						exitCode: child.exitCode,
						signal: child.signalCode,
						cleanup: "owned server process group exited and reaped"
					});
				}
				assert.equal(child.exitCode, 0);
			})());
		cleanups.add(stop);
		let stdout = "";
		let stderr = "";
		let deadline;
		child.stdout.on("data", (data) => {
			stdout += data;
			if (stdout.length > 65536) kill("SIGKILL");
		});
		child.stderr.on("data", (data) => {
			stderr += data;
			if (stderr.length > 65536) kill("SIGKILL");
		});
		try {
			log({
				event: "start",
				command,
				cwd: profileSource,
				pid: child.pid,
				timeoutMs: 180000
			});
			const ready = await new Promise((resolve, reject) => {
				deadline = setTimeout(
					() => reject(new Error("Server readiness timeout")),
					10000
				);
				child.once("error", reject);
				child.once("exit", () =>
					reject(new Error(stderr || "Server exited before ready")));
				child.stdout.on("data", () => {
					for (const line of stdout.split("\n")) {
						try {
							const row = JSON.parse(line);
							if (row.event === "ready") resolve(row);
						}
						catch {}
					}
				});
			});
			assert.equal(ready.host, "127.0.0.1");
			assert.equal(ready.pid, child.pid);
			return {
				url: `http://127.0.0.1:${ready.port}`,
				port: ready.port,
				stop
			};
		}
		catch (error) {
			await stop();
			throw error;
		}
		finally {
			clearTimeout(deadline);
		}
	}
	async function waitText(page, selector, text) {
		await page.waitForFunction(
			(s, value) =>
				document.querySelector(s)?.textContent.includes(value),
			{ timeout: 12000, polling: 50 },
			selector,
			text
		);
	}
	async function setValue(page, selector, text) {
		await page.$eval(
			selector,
			(el, value) => {
				el.value = value;
				el.dispatchEvent(new Event("input", { bubbles: true }));
			},
			text
		);
	}
	async function submit(page, selector) {
		await page.$eval(selector, form =>
			form.dispatchEvent(
				new Event("submit", { bubbles: true, cancelable: true })
			));
	}
	async function oneCopy(page, value) {
		await page.waitForFunction(
			text =>
				[...document.querySelectorAll("#messages li")].filter(row =>
					row.textContent.includes(text)
				).length === 1,
			{ timeout: 10000, polling: 50 },
			value
		);
	}
	async function profile(browser, role, width) {
		let service, context;
		let pages = [];
		const unexpected = [];
		const errors = [];
		try {
			service = await start(role);
			const origin = service.url;
			context = await browser.createBrowserContext();
			pages = await Promise.all([context.newPage(), context.newPage()]);
			for (const page of pages) {
				await page.setViewport({ width, height: 850 });
				await page.setRequestInterception(true);
				page.on("request", (request) => {
					const url = new URL(request.url());
					if (
						url.hostname === "127.0.0.1"
						&& url.port === String(service.port)
					) {
						request.continue();
					}
					else {
						unexpected.push(request.url());
						request.abort();
					}
				});
				page.on("pageerror", error => errors.push(String(error)));
				// Record actual app-created Socket.IO instances without changing their protocol.
				await page.evaluateOnNewDocument(() => {
					let original;
					window.__chatTestSockets = [];
					Object.defineProperty(window, "io", {
						configurable: true,
						get:
							() =>
								(...args) => {
									const socket = original(...args);
									window.__chatTestSockets.push(socket);
									return socket;
								},
						set: (value) => {
							original = value;
						}
					});
				});
				await page.goto(origin, {
					waitUntil: "networkidle2",
					timeout: 20000
				});
				await waitText(page, "#connection-status", "Connected");
				assert.equal(
					await page.$eval(
						"label[for=\"message\"]",
						el => el.textContent
					),
					"Message"
				);
				assert.equal(
					await page.$eval("#chat-form button", el => el.disabled),
					false
				);
			}
			const [a, b] = pages;
			log({
				event: "stage",
				role,
				width,
				stage: "both-clients-connected"
			});
			if (role === "solution") {
				for (const [page, name] of [
					[a, "Orbit"],
					[b, "Comet"]
				]) {
					await setValue(page, "#nickname", name);
					await submit(page, "#identity-form");
					await page.waitForFunction(
						() => document.querySelector("#nickname").value === "",
						{ polling: 50, timeout: 12000 }
					);
				}
				await setValue(a, "#nickname", "Nova");
				await submit(a, "#identity-form");
				await waitText(b, "#messages", "Orbit is now Nova.");
			}
			const literal = "<img src=x onerror=\"window.__unsafeChat=true\">";
			await setValue(a, "#message", literal);
			await submit(a, "#chat-form");
			for (const page of pages) {
				await oneCopy(page, literal);
				assert.equal(await page.$("#messages img"), null);
				assert.equal(
					await page.evaluate(() => window.__unsafeChat),
					undefined
				);
			}
			await a.waitForFunction(
				() => document.querySelector("#message").value === "",
				{ polling: 50, timeout: 12000 }
			);
			// A newer edit must survive the acknowledgement for the previous draft.
			await a.evaluate(() => {
				const input = document.querySelector("#message");
				input.value = "Previous draft";
				document
					.querySelector("#chat-form")
					.dispatchEvent(
						new Event("submit", { bubbles: true, cancelable: true })
					);
				input.value = "Newer unsent draft";
			});
			await oneCopy(b, "Previous draft");
			await a.waitForFunction(
				() => !document.querySelector("#chat-form button").disabled,
				{ polling: 50, timeout: 12000 }
			);
			assert.equal(
				await a.$eval("#message", el => el.value),
				"Newer unsent draft"
			);
			const before = await b.$$eval("#messages li", rows => rows.length);
			log({
				event: "stage",
				role,
				width,
				stage: "message-and-newer-draft-verified"
			});
			const invalid = await a.evaluate(async (reference) => {
				const probe = window.io({ reconnection: false });
				try {
					await new Promise((resolve, reject) => {
						probe.once("connect", resolve);
						probe.once("connect_error", reject);
					});
					const emit = (name, value) =>
						new Promise((resolve, reject) =>
							probe
								.timeout(3000)
								.emit(name, value, (error, result) =>
									error ? reject(error) : resolve(result))
						);
					const bad = [null, {}, [], 5, "", "  ", "x".repeat(281)];
					const results = [];
					for (const value of bad)
						results.push(await emit("chat:message", value));
					if (reference) {
						for (const value of [
							null,
							{},
							[],
							5,
							"",
							"  ",
							"x".repeat(33)
						])
							results.push(await emit("chat:join", value));
					}
					return results;
				}
				finally {
					probe.disconnect();
				}
			}, role === "solution");
			assert.ok(invalid.every(row => row.ok === false));
			assert.equal(
				await b.$$eval("#messages li", rows => rows.length),
				before
			);
			log({
				event: "stage",
				role,
				width,
				stage: "malformed-events-rejected"
			});
			// Close the real connection after submission to exercise failed ACK handling.
			await a.evaluate(() => {
				const socket = window.__chatTestSockets[0];
				socket.io.reconnection(false);
				document.querySelector("#message").value
					= "Keep this offline draft";
				document
					.querySelector("#chat-form")
					.dispatchEvent(
						new Event("submit", { bubbles: true, cancelable: true })
					);
				socket.io.engine.transport.close();
			});
			await waitText(a, "#connection-status", "Disconnected");
			await waitText(a, "#chat-error", "not acknowledge");
			assert.equal(
				await a.$eval("#message", el => el.value),
				"Keep this offline draft"
			);
			await submit(a, "#chat-form");
			assert.equal(
				await a.evaluate(
					() => window.__chatTestSockets[0].sendBuffer.length
				),
				0
			);
			const port = service.port;
			await service.stop();
			await waitText(b, "#connection-status", "Disconnected");
			service = await start(role, port);
			log({ event: "stage", role, width, stage: "server-restarted" });
			for (const page of pages) {
				const disconnected = await page.$eval(
					"#reconnect",
					el => !el.disabled
				);
				if (disconnected) {
					await page.bringToFront();
					await page.click("#reconnect");
				}
				await waitText(page, "#connection-status", "Connected");
			}
			log({
				event: "stage",
				role,
				width,
				stage: "both-clients-reconnected"
			});
			assert.equal(
				await a.$eval("#message", el => el.value),
				"Keep this offline draft"
			);
			await setValue(a, "#message", "Recovery marker");
			await submit(a, "#chat-form");
			for (const page of pages) await oneCopy(page, "Recovery marker");
			await a.evaluate(async () => {
				const socket = window.__chatTestSockets[0];
				for (let index = 0; index < 110; index++) {
					await new Promise((resolve, reject) =>
						socket
							.timeout(3000)
							.emit(
								"chat:message",
								`history-${index}`,
								(error, result) =>
									error || !result?.ok
										? reject(
												error
												|| new Error(
													"Message rejected"
												)
											)
										: resolve()
							)
					);
				}
			});
			for (const page of pages) {
				await waitText(page, "#messages", "history-109");
				assert.equal(
					await page.$$eval("#messages li", rows => rows.length),
					100
				);
				assert.equal(
					await page.evaluate(
						() =>
							document.documentElement.scrollWidth
							<= innerWidth + 1
					),
					true
				);
				assert.equal(
					await page.evaluate(() => {
						const log = document.querySelector("#messages");
						const last
							= log.lastElementChild.getBoundingClientRect();
						const pane = log.getBoundingClientRect();
						return (
							last.bottom <= pane.bottom + 2
							&& last.top >= pane.top - 2
							&& document
								.querySelector("#chat-form")
								.getBoundingClientRect()
								.bottom <= innerHeight
						);
					}),
					true,
					"The composer and newest message remain reachable at a full history"
				);
			}
			await a.$eval("#messages", (log) => {
				log.scrollTop = 0;
			});
			await b.evaluate(async () => {
				const socket = window.__chatTestSockets[0];
				await new Promise((resolve, reject) =>
					socket
						.timeout(3000)
						.emit(
							"chat:message",
							"Reader scroll check",
							(error, result) =>
								error || !result?.ok
									? reject(error || new Error("Rejected"))
									: resolve()
						)
				);
			});
			await waitText(a, "#messages", "Reader scroll check");
			assert.equal(
				await a.$eval(
					"#messages",
					log =>
						log.scrollTop < log.scrollHeight - log.clientHeight - 20
				),
				true
			);
			await a.$eval("#messages", (log) => {
				log.scrollTop = log.scrollHeight;
			});
			await a.bringToFront();
			await a.screenshot({
				path: path.join(output, `${profileName}.png`),
				fullPage: false
			});
			if (role === "solution") {
				await b.close();
				await waitText(a, "#messages", "Comet left the room.");
			}
			assert.deepEqual(unexpected, []);
			assert.deepEqual(errors, []);
			return {
				name: profileName,
				role,
				width,
				twoActualClients: true,
				noExternalClientFetch: true,
				safeLiteralText: true,
				newerEditPreserved: true,
				malformedEventsRejected: invalid.length,
				failedAcknowledgementPreservedDraft: true,
				offlineEventsNotBuffered: true,
				restartRecovered: true,
				recoveryMessageExactlyOneCopy: true,
				renderedHistoryBound: 100,
				composerVisibleAtFullHistory: true,
				readerScrollPreserved: true,
				passed: true
			};
		}
		catch (failure) {
			const states = await Promise.all(
				pages
					.filter(page => !page.isClosed())
					.map(async (page) => {
						await page.screenshot({
							path: path.join(
								output,
								`failure-${profileName}-${pages.indexOf(
									page
								)}.png`
							)
						});
						return page.evaluate(() => ({
							status: document.querySelector("#connection-status")
								?.textContent,
							error: document.querySelector("#chat-error")
								?.textContent,
							input: document.querySelector("#message")?.value,
							messages: [
								...document.querySelectorAll("#messages li")
							].map(el => el.textContent),
							sockets: window.__chatTestSockets?.map(socket => ({
								connected: socket.connected,
								buffered: socket.sendBuffer.length
							}))
						}));
					})
			);
			await writeFile(
				path.join(output, `failure-${profileName}.json`),
				JSON.stringify(
					{
						role,
						width,
						failure: String(failure),
						states,
						unexpected,
						errors
					},
					null,
					2
				)
			);
			throw failure;
		}
		finally {
			await context?.close();
			await service?.stop();
		}
	}
	let browser;
	try {
		await mkdir(output, { recursive: true });
		const executablePath = [
			process.env.PUPPETEER_EXECUTABLE_PATH,
			await puppeteer.executablePath(),
			"/usr/bin/google-chrome",
			"/usr/bin/chromium",
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
		].find(
			value => typeof value === "string" && value && existsSync(value)
		);
		assert.ok(
			executablePath,
			"An existing Chrome installation is required"
		);
		browser = await puppeteer.launch({
			executablePath,
			protocolTimeout: 30000,
			headless: true,
			args: ["--no-sandbox"]
		});
		const browserProcess = browser.process();
		let stopping;
		const close = () =>
			(stopping ??= (async () => {
				await browser.close();
				cleanups.delete(close);
				log({
					event: "end",
					kind: "browser",
					command: browserProcess.spawnargs,
					cwd: process.cwd(),
					pid: browserProcess.pid,
					exitCode: browserProcess.exitCode,
					signal: browserProcess.signalCode,
					cleanup: "owned browser closed and reaped"
				});
			})());
		cleanups.add(close);
		log({
			event: "start",
			kind: "browser",
			command: browserProcess.spawnargs,
			cwd: process.cwd(),
			pid: browserProcess.pid,
			timeoutMs: 360000
		});
		const cases = [
			...["starter", "solution"].map(role => ({
				role,
				width: 1280,
				name: `unit-${role}`,
				archive: path.join(values.exports, `${role}.zip`)
			})),
			...courseProof.profiles.map((row) => {
				assert.ok(
					row.consentBeforeFetch
					&& row.previousWorkPreserved
					&& row.codeAndTraceSaved
					&& row.sameAttemptReused
				);
				assert.equal(row.revision, fixture.revision);
				assert.ok(["starter", "solution"].includes(row.role));
				assert.ok([390, 1280].includes(row.width));
				assert.ok(/^[a-z0-9-]+\.zip$/.test(row.editedArchive));
				return {
					role: row.role,
					width: row.width,
					name: `browser-${row.role}-${row.width}`,
					archive: path.join(values.browser, row.editedArchive),
					expectedArchiveHash: row.editedArchiveSha256,
					files: row.editedFiles
				};
			})
		];
		assert.equal(new Set(cases.map(row => row.name)).size, 6);
		for (const item of cases) {
			const retained = await prepareArchive(
				item.archive,
				item.role,
				item.name,
				item.files
			);
			if (item.expectedArchiveHash)
				assert.equal(retained.archiveSHA256, item.expectedArchiveHash);
			profileSource = retained.root;
			profileName = item.name;
			proof.profiles.push({
				...(await profile(browser, item.role, item.width)),
				...retained
			});
			await writeFile(proofPath, `${JSON.stringify(proof, null, 2)}\n`);
		}
		await close();
		proof.accepted = true;
	}
	finally {
		await cleanupAll();
		clearTimeout(runtimeTimer);
		await mkdir(output, { recursive: true });
		await writeFile(proofPath, `${JSON.stringify(proof, null, 2)}\n`);
	}
	console.log(
		JSON.stringify({
			accepted: proof.accepted,
			profiles: proof.profiles.length
		})
	);
}
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
