import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { appendFileSync, existsSync } from "node:fs";
import { cp, lstat, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";

async function main() {
	const repository = fileURLToPath(new URL("../", import.meta.url));
	function option(name, fallback) {
		const index = process.argv.indexOf(name);
		return index < 0 ? fallback : process.argv[index + 1];
	}
	const source = path.resolve(option("--source", "output/web-deployment-native-source"));
	const exportsPath = path.resolve(option("--exports", "front-end/output/web-deployment-exports"));
	const browserPath = path.resolve(option("--browser", "output/web-deployment-browser"));
	const proofPath = path.resolve(option("--proof", "output/web-deployment-native/proof.json"));
	const fixture = JSON.parse(await readFile(new URL("./fixtures/web-deployment-source.json", import.meta.url), "utf8"));
	const sha = bytes => createHash("sha256").update(bytes).digest("hex");
	const proof = { accepted: false, sourceRevision: fixture.revision, profiles: [], dependencyInputs: fixture.dependencyInputs, releaseCandidate: false };
	const cleanups = new Set();
	const task = process.env.CLASSES_FAMILY_TASK_ID ?? "web-deployment-exports";
	function log(row) {
		const event = { parentTaskId: task, parentPid: process.pid, time: new Date().toISOString(), ...row };
		if (process.env.DEPLOYMENT_EXPORT_PROCESS_LOG) {
			appendFileSync(process.env.DEPLOYMENT_EXPORT_PROCESS_LOG, `${JSON.stringify(event)}\n`);
		}
		else {
			console.log(JSON.stringify(event));
		}
	}
	async function cleanupAll() {
		await Promise.allSettled([...cleanups].map(cleanup => cleanup()));
	}
	for (const signal of ["SIGINT", "SIGTERM"]) {
		process.once(signal, async () => {
			await cleanupAll();
			process.exit(signal === "SIGINT" ? 130 : 143);
		});
	}
	async function start(file, env = {}, cwd = repository) {
		const command = [process.execPath, file];
		const child = spawn(command[0], command.slice(1), {
			cwd,
			env: { ...process.env, PORT: "0", ...env },
			stdio: ["ignore", "pipe", "pipe"],
			detached: process.platform !== "win32",
		});
		const exited = once(child, "exit");
		const kill = (signal) => {
			if (!child.pid || child.exitCode !== null || child.signalCode !== null) return;
			if (process.platform === "win32") child.kill(signal);
			else process.kill(-child.pid, signal);
		};
		const lifetime = setTimeout(kill, 60000, "SIGKILL");
		let stopPromise;
		const stop = () => stopPromise ??= (async () => {
			kill("SIGTERM");
			const timer = setTimeout(kill, 1500, "SIGKILL");
			try {
				await exited;
			}
			finally {
				clearTimeout(timer);
				clearTimeout(lifetime);
				cleanups.delete(stop);
				log({ event: "end", cwd, command, pid: child.pid, exitCode: child.exitCode, signal: child.signalCode, cleanup: "owned child process group exited and reaped" });
			}
			assert.equal(child.exitCode, 0, "Owned service did not shut down cleanly");
		})();
		cleanups.add(stop);
		let pending = "";
		let deadline;
		try {
			log({ event: "start", cwd, command, pid: child.pid, startupTimeoutMs: 10000, timeoutMs: 60000 });
			const ready = await new Promise((resolve, reject) => {
				deadline = setTimeout(() => reject(new Error(`No ready event from ${file}`)), 10000);
				child.once("error", reject);
				child.once("exit", () => reject(new Error(`Service exited before ready: ${file}`)));
				child.stderr.on("data", () => {});
				child.stdout.on("data", (bytes) => {
					pending += bytes;
					if (pending.length > 65536) return reject(new Error("Unbounded service output"));
					while (pending.includes("\n")) {
						const newline = pending.indexOf("\n");
						const line = pending.slice(0, newline);
						pending = pending.slice(newline + 1);
						try {
							const event = JSON.parse(line);
							if (event.event === "ready") resolve(event);
						}
						catch {}
					}
				});
			});
			assert.equal(ready.host, "127.0.0.1");
			assert.ok(Number.isInteger(ready.port) && ready.port > 0);
			return { ready, pid: child.pid, url: `http://127.0.0.1:${ready.port}`, stop };
		}
		catch (error) {
			await stop();
			throw error;
		}
		finally { clearTimeout(deadline); }
	}
	const request = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(2000) });

	function artifactCLI(project, args, expectedExit = 0) {
		const command = [process.execPath, path.join(project, "release.mjs"), ...args];
		const startedAt = new Date().toISOString();
		const result = spawnSync(command[0], command.slice(1), {
			cwd: project,
			encoding: "utf8",
			timeout: 10000,
			killSignal: "SIGKILL",
			maxBuffer: 1024 * 1024,
		});
		const accepted = !result.error && result.status === expectedExit;
		log({ event: "run", kind: "artifact-cli", cwd: project, command, pid: result.pid, startedAt, finishedAt: new Date().toISOString(), timeoutMs: 10000, expectedExit, exitCode: result.status, signal: result.signal, accepted, cleanup: "synchronous child exited and reaped; no descendants" });
		assert.ifError(result.error);
		assert.equal(result.status, expectedExit, result.stderr || result.stdout);
		const value = JSON.parse(expectedExit === 0 ? result.stdout : result.stderr);
		assert.equal(value.ok, expectedExit === 0);
		return value;
	}

	function metadata(args) {
		const command = ["git", ...args];
		const startedAt = new Date().toISOString();
		const result = spawnSync(command[0], command.slice(1), { cwd: source, encoding: "utf8", timeout: 5000, killSignal: "SIGKILL", maxBuffer: 2 * 1024 * 1024 });
		log({ event: "run", kind: "source-metadata", command, cwd: source, pid: result.pid, startedAt, finishedAt: new Date().toISOString(), timeoutMs: 5000, exitCode: result.status, signal: result.signal, cleanup: "synchronous metadata child exited and reaped" });
		assert.ifError(result.error);
		assert.equal(result.status, 0, result.stderr);
		return result.stdout;
	}
	function unpack(bytes, role, expected) {
		const entries = unzipSync(bytes);
		const names = [...fixture.roleFiles[role], ...fixture.sharedFiles];
		assert.equal(Object.keys(entries).length, names.length);
		const files = new Map();
		for (const name of names) {
			const matches = Object.keys(entries).filter(row => row === name || row.endsWith(`/${name}`));
			assert.equal(matches.length, 1, name);
			const data = Buffer.from(entries[matches[0]]);
			const record = expected.find(row => row.name === name);
			assert.ok(record, name);
			assert.equal(sha(data), record.sha256 ?? sha(record.content), name);
			files.set(name, data);
		}
		return files;
	}
	async function runProfile(root, row, browser) {
		const files = unpack(row.bytes, row.role, row.expected);
		await mkdir(root, { recursive: true });
		for (const [name, bytes] of files) {
			await mkdir(path.dirname(path.join(root, name)), { recursive: true });
			await writeFile(path.join(root, name), bytes);
		}
		await symlink(path.join(source, "node_modules"), path.join(root, "node_modules"), "dir");
		const modelPath = path.join(root, "release-model.mjs");
		const beforeModel = await readFile(modelPath, "utf8");
		if (row.role === "starter") {
			await cp(path.join(root, "frontend/env.template.js"), path.join(root, "frontend/env.js"));
		}
		let starterCompletionApplied = false;
		if (row.role === "starter" && beforeModel.includes("throw artifactError(\"not_implemented_digest\");")) {
			const refused = path.join(root, "unfinished-artifact");
			assert.equal(artifactCLI(root, ["build", refused], 1).error, "not_implemented_digest");
			await assert.rejects(lstat(refused), { code: "ENOENT" });
			const original = fixture.files[`${fixture.pack}/starter/release-model.mjs`].content;
			assert.ok(beforeModel.startsWith(original), "Preserve the actual browser edit while completing only the disposable starter model");
			await writeFile(modelPath, fixture.completedStarter["release-model.mjs"] + beforeModel.slice(original.length));
			starterCompletionApplied = true;
		}
		const model = await import(pathToFileURL(modelPath));
		assert.equal(model.digestBytes(Buffer.from("abc")), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
		let frontend, api, page;
		try {
			frontend = await start(path.join(root, "frontend/serve.mjs"), {}, root);
			api = await start(path.join(root, "backend/src/server.js"), { FRONTEND_ORIGIN: frontend.url, REGION: "local" }, root);
			const frontendPort = frontend.ready.port;
			const originalApiPid = api.pid;
			const config = path.join(root, "frontend/env.js");
			await writeFile(config, `window.__APP_CONFIG__ = ${JSON.stringify({ apiBaseUrl: api.url })};\n`);
			const a = path.join(root, "release-a");
			const built = artifactCLI(root, ["build", a]);
			assert.equal(artifactCLI(root, ["verify", a]).manifestSHA256, built.manifestSHA256);
			const aManifest = await readFile(path.join(a, "artifact-manifest.json"));
			await frontend.stop();
			frontend = await start(path.join(a, "serve.mjs"), { PORT: String(frontendPort) }, a);
			page = await browser.newPage();
			await page.setViewport({ width: row.width ?? 1280, height: 900 });
			const reload = async (expected) => {
				await page.goto(frontend.url, { waitUntil: "networkidle0" });
				await page.waitForFunction(text => document.querySelector("#status")?.textContent.includes(text), { timeout: 5000 }, expected);
			};
			await reload("API is running.");
			assert.equal((await request(`${frontend.url}/artifact-manifest.json`)).status, 404);
			const payload = await request(`${api.url}/api/status`, { headers: { Origin: frontend.url } });
			assert.equal(payload.headers.get("access-control-allow-origin"), frontend.url);
			assert.equal((await payload.json()).message, row.role === "starter" ? "Starter API is running." : "Solution API is running.");
			const badConfig = `window.__APP_CONFIG__ = ${JSON.stringify({ apiBaseUrl: `${api.url}/not-a-status-prefix` })};\n`;
			await writeFile(config, badConfig);
			const b = path.join(root, "release-b");
			artifactCLI(root, ["build", b]);
			artifactCLI(root, ["verify", b]);
			await frontend.stop();
			frontend = await start(path.join(b, "serve.mjs"), { PORT: String(frontendPort) }, b);
			await reload("Could not reach the API.");
			assert.equal((await request(`${api.url}/api/status`)).status, 200);
			assert.equal(api.pid, originalApiPid);
			const restored = path.join(root, "restored-a");
			assert.equal(artifactCLI(root, ["restore", a, restored]).manifestSHA256, built.manifestSHA256);
			artifactCLI(root, ["verify", restored]);
			for (const name of [...model.FILE_NAMES, "artifact-manifest.json"]) assert.deepEqual(await readFile(path.join(restored, name)), await readFile(path.join(a, name)));
			await frontend.stop();
			frontend = await start(path.join(restored, "serve.mjs"), { PORT: String(frontendPort) }, restored);
			await reload("API is running.");
			assert.equal(api.pid, originalApiPid);
			assert.equal(await readFile(config, "utf8"), badConfig);
			const changed = path.join(root, "changed-copy");
			await cp(a, changed, { recursive: true });
			await writeFile(path.join(changed, "main.js"), "changed");
			assert.equal(artifactCLI(root, ["verify", changed], 1).error, "artifact_integrity_mismatch");
			const rejected = path.join(root, "rejected-restore");
			assert.equal(artifactCLI(root, ["restore", changed, rejected], 1).error, "artifact_integrity_mismatch");
			await assert.rejects(lstat(rejected), { code: "ENOENT" });
			assert.deepEqual(await readFile(path.join(a, "artifact-manifest.json")), aManifest);
			const apiPort = api.ready.port;
			await api.stop();
			await reload("Could not reach the API.");
			assert.equal((await request(frontend.url)).status, 200);
			api = await start(path.join(root, "backend/src/server.js"), { PORT: String(apiPort), FRONTEND_ORIGIN: frontend.url, REGION: "local" }, root);
			await reload("API is running.");
			return { name: row.name, role: row.role, width: row.width ?? 1280, archiveSHA256: sha(row.bytes), files: files.size, sourceBytesVerified: true, starterCompletionApplied, preservedExportedModelSHA256: sha(beforeModel), executedModelSHA256: sha(await readFile(modelPath)), configuredOnlyOwnedLoopbackOrigins: true, manifestSHA256: built.manifestSHA256, verifiedBadConfigurationRejectedByBrowser: true, retainedBytesEqual: true, retainedApiProcessDuringFrontendRollback: true, tamperedCopyRejected: true, unavailableApiRecovered: true, passed: true };
		}
		finally {
			await page?.close();
			await api?.stop();
			await frontend?.stop();
		}
	}
	let scratch, browser;
	try {
		assert.equal(metadata(["rev-parse", "HEAD"]).trim(), fixture.revision);
		for (const [name, digest] of Object.entries(fixture.dependencyInputs)) {
			const pinned = metadata(["show", `${fixture.revision}:${name}`]);
			assert.equal(sha(pinned), digest);
			assert.deepEqual(JSON.parse(await readFile(path.join(source, name), "utf8")), JSON.parse(pinned));
		}
		metadata(["diff", "--exit-code", "--", ...Object.keys(fixture.dependencyInputs)]);
		const rows = [];
		for (const role of ["starter", "solution"]) {
			const saved = JSON.parse(await readFile(path.join(exportsPath, `${role}.json`), "utf8"));
			assert.equal(saved.sourceRevision, fixture.revision);
			rows.push({ name: `saved-${role}`, role, bytes: await readFile(path.join(exportsPath, `${role}.zip`)), expected: saved.files });
		}
		const browserProof = JSON.parse(await readFile(path.join(browserPath, "web-deployment-course-proof.json"), "utf8"));
		assert.equal(browserProof.profiles.length, 4);
		assert.deepEqual(browserProof.profiles.map(row => `${row.role}:${row.width}`).sort(), ["solution:1280", "solution:390", "starter:1280", "starter:390"]);
		for (const row of browserProof.profiles) {
			assert.equal(row.revision, fixture.revision);
			assert.ok(row.consentBeforeFetch && row.sameAttemptReused && row.previousWorkPreserved);
			for (const kind of ["exact", "edited"]) {
				const bytes = await readFile(path.join(browserPath, row[`${kind}Archive`]));
				assert.equal(sha(bytes), row[`${kind}ArchiveSha256`]);
				rows.push({ name: `${kind}-${row.role}-${row.width}`, role: row.role, width: row.width, bytes, expected: row[kind === "exact" ? "sourceFiles" : "editedFiles"] });
			}
		}
		assert.equal(rows.length, 10);
		await mkdir(path.dirname(proofPath), { recursive: true });
		scratch = await mkdtemp(path.join(path.dirname(proofPath), "deployment-exports-"));
		const executablePath = [
			process.env.PUPPETEER_EXECUTABLE_PATH,
			await puppeteer.executablePath(),
			"/usr/bin/google-chrome",
			"/usr/bin/chromium",
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
		].find(candidate => typeof candidate === "string" && candidate && existsSync(candidate));
		assert.ok(executablePath, "An existing Chrome installation is required");
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
		const browserProcess = browser.process();
		let closing;
		const closeBrowser = () => closing ??= (async () => {
			await browser.close();
			cleanups.delete(closeBrowser);
			log({ event: "end", kind: "browser", cwd: repository, command: browserProcess.spawnargs, pid: browserProcess.pid, exitCode: browserProcess.exitCode, signal: browserProcess.signalCode, cleanup: "owned browser closed and reaped" });
		})();
		cleanups.add(closeBrowser);
		log({ event: "start", kind: "browser", cwd: repository, command: browserProcess.spawnargs, pid: browserProcess.pid, timeoutMs: 300000 });
		for (const row of rows) {
			proof.profiles.push(await runProfile(path.join(scratch, row.name), row, browser));
			await writeFile(proofPath, `${JSON.stringify(proof, null, 2)}\n`);
		}
		await closeBrowser();
		proof.accepted = true;
	}
	finally {
		await cleanupAll();
		if (scratch) await rm(scratch, { recursive: true, force: true });
		await mkdir(path.dirname(proofPath), { recursive: true });
		await writeFile(proofPath, `${JSON.stringify(proof, null, 2)}\n`);
	}
	console.log(JSON.stringify({ accepted: proof.accepted, profiles: proof.profiles.length, sourceRevision: fixture.revision, releaseCandidate: false }));
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
