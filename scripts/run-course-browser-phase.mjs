import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";

const [testArgument, stateArgument] = process.argv.slice(2);
assert.ok(testArgument && stateArgument && process.argv.length === 4);
const testFile = resolve(testArgument);
const stateFile = resolve(stateArgument);
assert.ok(testFile.endsWith(".test.mjs") && existsSync(testFile));
assert.ok(!existsSync(stateFile), "Every browser phase must start with fresh rerun state");
mkdirSync(dirname(stateFile), { recursive: true });
const digest = () => createHash("sha256").update(readFileSync(testFile)).digest("hex");
const originalDigest = digest();
const attempts = [];
const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "course-browser-phase";
const args = ["--test", "--test-concurrency=1", `--test-rerun-failures=${stateFile}`, testFile];

async function run(attempt) {
	assert.equal(digest(), originalDigest, "The tested file changed between attempts");
	const child = spawn(process.execPath, args, {
		stdio: "inherit",
		env: { ...process.env, COURSE_BROWSER_PHASE_ATTEMPT: String(attempt) }
	});
	const startedAt = new Date().toISOString();
	const record = {
		taskId,
		attempt,
		cwd: process.cwd(),
		command: [process.execPath, ...args],
		pid: child.pid,
		parentPid: process.pid,
		startedAt,
		timeoutMs: Number(process.env.CLASSES_FAMILY_HEAVY_TIMEOUT_MS) || 2700000,
		testFileSHA256: originalDigest,
		childProcessGroup: "inherited supervised phase group"
	};
	console.log(JSON.stringify({ event: "start", ...record }));
	const forward = signal => child.kill(signal);
	const onTerm = () => forward("SIGTERM");
	const onInt = () => forward("SIGINT");
	process.once("SIGTERM", onTerm);
	process.once("SIGINT", onInt);
	try {
		const result = await new Promise((resolveExit, reject) => {
			child.once("error", reject);
			child.once("exit", (code, signal) => resolveExit({ code, signal }));
		});
		Object.assign(record, { endedAt: new Date().toISOString(), exitCode: result.code, signal: result.signal, childProcessGroupCleanup: "test process exited; owned browser cleanup remains required by its harness" });
		attempts.push(record);
		console.log(JSON.stringify({ event: "end", ...record }));
		return result;
	}
	finally {
		process.removeListener("SIGTERM", onTerm);
		process.removeListener("SIGINT", onInt);
	}
}

let result = await run(1);
if (result.code === 1 && !result.signal && existsSync(stateFile)) {
	console.log(JSON.stringify({ event: "retry failed browser cases once", taskId, completedCasesRetained: true }));
	result = await run(2);
}
writeFileSync(`${stateFile}.attempts.json`, `${JSON.stringify({
	taskId,
	initialStateFileAbsent: true,
	maximumAttempts: 2,
	testFileUnchanged: digest() === originalDigest,
	attempts,
	accepted: result.code === 0 && !result.signal
}, null, 2)}\n`);
process.exitCode = result.code ?? 1;
