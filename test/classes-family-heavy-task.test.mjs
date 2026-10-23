import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { platform } from "node:process";
import test from "node:test";

const wrapperPath = process.env.CLASSES_FAMILY_WRAPPER_UNDER_TEST ?? join(
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
		let ownedGroupId;
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
			const exited = waitForExit(wrapper, 15000);
			await waitForFile(descendantPidPath, 5000);
			ownedGroupId = JSON.parse(readFileSync(join(lockPath, "owner.json"), "utf8")).childPid;
			descendantPid = Number(readFileSync(descendantPidPath, "utf8"));
			assert.ok(Number.isInteger(descendantPid) && descendantPid > 0);
			assert.deepEqual(await exited, { code: 124, signal: null }, readFileSync(logPath, "utf8"));
			assert.equal(existsSync(lockPath), false);
			const events = readFileSync(logPath, "utf8");
			assert.match(events, /"event":"timeout"/);
			assert.match(events, /"exitCode":124/);
			const completed = events.trim().split("\n").map(line => JSON.parse(line))
				.find(event => event.event === "end");
			assert.equal(completed.childExitObserved, true);
			assert.equal(completed.processGroupAlive, false);
			assert.equal(completed.childProcessGroupCleanup, "terminated and reaped");
			assert.equal(isAlive(descendantPid), false);
		} finally {
			wrapper?.kill("SIGKILL");
			if (ownedGroupId && isAlive(-ownedGroupId)) {
				try { process.kill(-ownedGroupId, "SIGKILL"); }
				catch (error) { if (error.code !== "ESRCH") throw error; }
			}
			if (descendantPid && isAlive(descendantPid))
				process.kill(descendantPid, "SIGKILL");
			rmSync(directory, { recursive: true, force: true });
		}
	}
);

test(
	"an exited owner cannot release an active child group's lock",
	{ skip: platform === "win32", timeout: 10000 },
	async () => {
		const directory = mkdtempSync(join(tmpdir(), "classes-heavy-stale-"));
		const lockPath = join(directory, "lock");
		const env = {
			...process.env,
			CLASSES_FAMILY_ALLOW_HIGH_LOAD: "1",
			CLASSES_FAMILY_HEAVY_LOG: join(directory, "events.jsonl"),
			CLASSES_FAMILY_LOCK: lockPath
		};
		let owner;
		let active;
		let contender;
		try {
			owner = spawn(process.execPath, ["-e", "process.exit(0)"], { stdio: "ignore" });
			await waitForExit(owner, 3000);
			active = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { detached: true, stdio: "ignore" });
			const activeExit = waitForExit(active, 7000);
			mkdirSync(lockPath);
			writeFileSync(join(lockPath, "owner.json"), JSON.stringify({ parentPid: owner.pid, childPid: active.pid }));
			contender = spawn(process.execPath, [wrapperPath, "--", process.execPath, "-e", "process.exit(0)"], { env, stdio: "ignore" });
			assert.deepEqual(await waitForExit(contender, 3000), { code: 75, signal: null });
			assert.equal(existsSync(lockPath), true);
			assert.equal(isAlive(active.pid), true);
			process.kill(-active.pid, "SIGKILL");
			await activeExit;
			contender = spawn(process.execPath, [wrapperPath, "--", process.execPath, "-e", "process.exit(0)"], { env, stdio: "ignore" });
			assert.deepEqual(await waitForExit(contender, 3000), { code: 0, signal: null });
			assert.equal(existsSync(lockPath), false);
		} finally {
			owner?.kill("SIGKILL");
			contender?.kill("SIGKILL");
			if (active?.pid && isAlive(-active.pid)) {
				process.kill(-active.pid, "SIGKILL");
				await new Promise(resolve => active.once("exit", resolve));
			}
			rmSync(directory, { recursive: true, force: true });
		}
	}
);
