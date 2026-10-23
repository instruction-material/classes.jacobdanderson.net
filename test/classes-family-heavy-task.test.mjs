import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { platform } from "node:process";
import test from "node:test";

const wrapperPath = join(
	import.meta.dirname,
	"../scripts/classes-family-heavy-task.mjs"
);

function waitForExit(child, timeoutMs) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(
			() => reject(new Error("Heavy-task wrapper did not exit")),
			timeoutMs
		);
		child.once("exit", (code, signal) => {
			clearTimeout(timer);
			resolve({ code, signal });
		});
		child.once("error", error => {
			clearTimeout(timer);
			reject(error);
		});
	});
}

async function waitForFile(path, timeoutMs) {
	const deadline = Date.now() + timeoutMs;
	while (!existsSync(path) && Date.now() < deadline)
		await new Promise(resolve => setTimeout(resolve, 25));
	assert.ok(existsSync(path), `Expected ${path} to exist`);
}

function isAlive(processId) {
	try {
		process.kill(processId, 0);
		return true;
	} catch {
		return false;
	}
}

test("a completed task clears its lock without waiting for timeout", async () => {
	const directory = mkdtempSync(join(tmpdir(), "classes-heavy-complete-"));
	const lockPath = join(directory, "lock");
	const logPath = join(directory, "events.jsonl");
	let wrapper;
	try {
		wrapper = spawn(
			process.execPath,
			[wrapperPath, "--", process.execPath, "-e", "process.exit(0)"],
			{
				env: {
					...process.env,
					CLASSES_FAMILY_ALLOW_HIGH_LOAD: "1",
					CLASSES_FAMILY_HEAVY_LOG: logPath,
					CLASSES_FAMILY_HEAVY_TIMEOUT_MS: "10000",
					CLASSES_FAMILY_LOCK: lockPath
				},
				stdio: "ignore"
			}
		);
		assert.deepEqual(await waitForExit(wrapper, 5000), {
			code: 0,
			signal: null
		});
		assert.equal(existsSync(lockPath), false);
		assert.match(readFileSync(logPath, "utf8"), /"event":"end"/);
	} finally {
		wrapper?.kill("SIGKILL");
		rmSync(directory, { recursive: true, force: true });
	}
});

test(
	"timeout kills a SIGTERM-resistant descendant before releasing its lock",
	{ skip: platform === "win32", timeout: 20000 },
	async () => {
		const directory = mkdtempSync(join(tmpdir(), "classes-heavy-timeout-"));
		const lockPath = join(directory, "lock");
		const logPath = join(directory, "events.jsonl");
		const descendantPidPath = join(directory, "descendant.pid");
		const descendantSource =
			'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000);';
		const childSource = [
			'const { spawn } = require("node:child_process");',
			'const { writeFileSync } = require("node:fs");',
			'process.on("SIGTERM", () => {});',
			`const descendant = spawn(process.execPath, ["-e", ${JSON.stringify(descendantSource)}], { stdio: "ignore" });`,
			"writeFileSync(process.env.TEST_DESCENDANT_PID_PATH, String(descendant.pid));",
			"setInterval(() => {}, 1000);"
		].join("\n");
		let wrapper;
		let descendantPid;
		try {
			wrapper = spawn(
				process.execPath,
				[wrapperPath, "--", process.execPath, "-e", childSource],
				{
					env: {
						...process.env,
						CLASSES_FAMILY_ALLOW_HIGH_LOAD: "1",
						CLASSES_FAMILY_HEAVY_LOG: logPath,
						CLASSES_FAMILY_HEAVY_TIMEOUT_MS: "3000",
						CLASSES_FAMILY_LOCK: lockPath,
						TEST_DESCENDANT_PID_PATH: descendantPidPath
					},
					stdio: "ignore"
				}
			);
			const exited = waitForExit(wrapper, 12000);
			await waitForFile(descendantPidPath, 5000);
			descendantPid = Number(readFileSync(descendantPidPath, "utf8"));
			assert.ok(Number.isInteger(descendantPid) && descendantPid > 0);
			assert.deepEqual(await exited, { code: 124, signal: null });
			assert.equal(existsSync(lockPath), false);
			const events = readFileSync(logPath, "utf8");
			assert.match(events, /"event":"timeout"/);
			assert.match(events, /"exitCode":124/);
			const deadline = Date.now() + 2000;
			while (isAlive(descendantPid) && Date.now() < deadline)
				await new Promise(resolve => setTimeout(resolve, 25));
			assert.equal(isAlive(descendantPid), false);
		} finally {
			wrapper?.kill("SIGKILL");
			if (descendantPid && isAlive(descendantPid))
				process.kill(descendantPid, "SIGKILL");
			rmSync(directory, { recursive: true, force: true });
		}
	}
);
