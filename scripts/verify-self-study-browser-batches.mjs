import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { appendFile, copyFile, mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";
import { aggregateProofs, browserTimeoutMs, planBatches } from "./self-study-browser-batch-proof.mjs";

const output = resolve(process.env.SELF_STUDY_BROWSER_PROOF_DIR ?? "output/self-study-browser");
const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "self-study-browser-batches";
const journal = join(output, "batch-processes.jsonl");
const manifests = {};
for (const file of (await readdir(output)).filter(file => file.endsWith("-learner.json"))) {
	const learner = JSON.parse(await readFile(join(output, file), "utf8"));
	const instructor = JSON.parse(await readFile(join(output, `${learner.id}-instructor.json`), "utf8"));
	assert.equal(learner.role, "learner");
	assert.equal(instructor.role, "instructor");
	assert.equal(learner.id, instructor.id);
	manifests[learner.id] = { learner, instructor };
}
const requested = process.env.SELF_STUDY_BROWSER_COURSES;
const ids = requested ? requested.split(",") : Object.keys(manifests).sort();
assert.ok(ids.every(id => manifests[id]));
const batches = planBatches(ids);
const sourceCommit = process.env.GITHUB_SHA ?? manifests[ids[0]].learner.sourceCommit;
const sourceMode = process.env.SELF_STUDY_BROWSER_SOURCE_MODE ?? "build";
assert.ok(["build", "dev"].includes(sourceMode));
assert.match(sourceCommit, /^[a-f0-9]{40}$/);
for (const id of ids) {
	for (const role of ["learner", "instructor"])
		assert.equal(manifests[id][role].sourceCommit, sourceCommit);
}
const scope = { ids, sourceCommit, sourceMode, manifests };
const results = [];
const batchRecords = [];
assert.ok(!existsSync(join(output, "browser-proof.json")), "Use a fresh evidence directory; preserve earlier results");

async function runBatch(batch, directory) {
	const argv = ["--test", "test/self-study-course-browser.test.mjs"];
	const startTime = new Date().toISOString();
	const child = spawn(process.execPath, argv, {
		cwd: process.cwd(),
		env: { ...process.env, SELF_STUDY_BROWSER_COURSES: batch.join(","), SELF_STUDY_BROWSER_PROOF_DIR: directory },
		detached: true,
		stdio: "inherit"
	});
	const completion = new Promise((accept, reject) => {
		child.once("error", reject);
		child.once("close", (exitCode, signal) => accept({ exitCode, signal }));
	});
	const record = { parentTask: taskId, parentPid: process.pid, cwd: process.cwd(), command: [process.execPath, ...argv], pid: child.pid, startTime, timeoutMs: browserTimeoutMs(batch, manifests) + 30000, courses: batch };
	await appendFile(journal, `${JSON.stringify({ ...record, event: "start" })}\n`);
	let stopped = false;
	const stop = (signal) => {
		stopped = true;
		try {
			process.kill(-child.pid, signal);
			return true;
		}
		catch (error) {
			if (error.code !== "ESRCH") throw error;
			return false;
		}
	};
	let escalation;
	const cancelled = () => {
		stop("SIGTERM");
		escalation ??= setTimeout(stop, 3000, "SIGKILL");
	};
	const timeout = setTimeout(cancelled, record.timeoutMs);
	process.once("SIGINT", cancelled);
	process.once("SIGTERM", cancelled);
	let exitCode, signal;
	try {
		({ exitCode, signal } = await completion);
	}
	finally {
		clearTimeout(timeout);
		clearTimeout(escalation);
		process.removeListener("SIGINT", cancelled);
		process.removeListener("SIGTERM", cancelled);
		// Reap the child's remaining browser/server group after failure or cancellation.
		if (exitCode !== 0 || stopped) {
			if (stop("SIGTERM")) {
				await new Promise(resolve => setTimeout(resolve, 3000));
				stop("SIGKILL");
			}
		}
		await appendFile(journal, `${JSON.stringify({ ...record, event: "end", endTime: new Date().toISOString(), exitCode: exitCode ?? null, signal: signal ?? null, childProcessGroupCleanup: stopped ? "owned process group terminated" : "child completed with browser/server cleanup" })}\n`);
	}
	assert.equal(exitCode, 0, "The complete browser batch must pass");
}

async function retainAggregate(error) {
	const proof = aggregateProofs(scope, results);
	await writeFile(join(output, "browser-proof.json"), `${JSON.stringify({
		...proof,
		...(error ? { complete: false, error: String(error) } : {}),
		batchCount: batches.length,
		completedBatches: results.length,
		maximumConcurrentBrowserRuns: 1,
		batches: batchRecords
	}, null, 2)}\n`);
}

try {
	for (const [index, batch] of batches.entries()) {
		const directory = join(output, "batches", String(index + 1).padStart(2, "0"));
		await mkdir(directory, { recursive: true });
		for (const id of batch) {
			for (const role of ["learner", "instructor"])
				await copyFile(join(output, `${id}-${role}.json`), join(directory, `${id}-${role}.json`));
		}
		await runBatch(batch, directory);
		const proof = JSON.parse(await readFile(join(directory, "browser-proof.json"), "utf8"));
		assert.deepEqual(proof.selectedCourseIds, batch);
		aggregateProofs(scope, [...results, proof]);
		results.push(proof);
		batchRecords.push({ courses: batch, proof: join("batches", String(index + 1).padStart(2, "0"), "browser-proof.json") });
		await retainAggregate();
		for (const file of (await readdir(directory)).filter(file => file.endsWith(".png"))) {
			assert.ok(!existsSync(join(output, file)), "Keep every distinct screenshot");
			await rename(join(directory, file), join(output, file));
		}
	}
	const aggregate = aggregateProofs(scope, results);
	assert.equal(aggregate.complete, true);
	assert.equal(aggregate.profiles.length, aggregate.expectedProfiles);
	assert.equal(aggregate.profiles.reduce((sum, p) => sum + p.completeReadings.length, 0), aggregate.expectedReadingViews);
}
catch (error) {
	await retainAggregate(error);
	throw error;
}
