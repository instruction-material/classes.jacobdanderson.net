import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Exercise the actual Node test-runner retry state.
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const runner = fileURLToPath(new URL("../scripts/run-course-browser-phase.mjs", import.meta.url));
const fixture = `import { test } from "node:test";
import assert from "node:assert/strict";
import { appendFileSync, readFileSync } from "node:fs";
import process from "node:process";
const counts = process.env.COURSE_RECOVERY_COUNTS;
test("already passing case", () => appendFileSync(counts, "passing\\n"));
test("failing case", () => {
  appendFileSync(counts, "failing\\n");
  const attempts = readFileSync(counts, "utf8").split("\\n").filter(line => line === "failing").length;
  assert.ok(process.env.COURSE_RECOVERY_PERMANENT !== "1" && attempts > 1);
});
`;

async function withFixture(callback) {
	const directory = await mkdtemp(join(tmpdir(), "course-phase-recovery-"));
	try {
		const file = join(directory, "browser.test.mjs");
		const counts = join(directory, "counts.txt");
		const state = join(directory, "rerun-state.json");
		await writeFile(file, fixture);
		await writeFile(counts, "");
		const run = (extraEnv) => {
			const env = { ...process.env, COURSE_RECOVERY_COUNTS: counts, ...extraEnv };
			// This child represents the top-level CI command, outside this test worker.
			delete env.NODE_TEST_CONTEXT;
			return spawnSync(process.execPath, [runner, file, state], {
				cwd: directory,
				env,
				encoding: "utf8",
				timeout: 20000
			});
		};
		await callback({ run, counts, state });
	}
	finally {
		await rm(directory, { recursive: true, force: true });
	}
}

test("one fresh-state retry retains passing cases and records the failed attempt", async () => {
	await withFixture(async ({ run, counts, state }) => {
		const result = run();
		assert.equal(result.status, 0, result.stdout + result.stderr);
		assert.deepEqual((await readFile(counts, "utf8")).trim().split("\n"), ["passing", "failing", "failing"]);
		const evidence = JSON.parse(await readFile(`${state}.attempts.json`, "utf8"));
		assert.equal(evidence.accepted, true);
		assert.equal(evidence.initialStateFileAbsent, true);
		assert.equal(evidence.testFileUnchanged, true);
		assert.deepEqual(evidence.attempts.map(row => row.exitCode), [1, 0]);
	});
});

test("a persistent browser failure remains a failure after exactly two attempts", async () => {
	await withFixture(async ({ run, counts, state }) => {
		const result = run({ COURSE_RECOVERY_PERMANENT: "1" });
		assert.equal(result.status, 1, result.stdout + result.stderr);
		assert.deepEqual((await readFile(counts, "utf8")).trim().split("\n"), ["passing", "failing", "failing"]);
		const evidence = JSON.parse(await readFile(`${state}.attempts.json`, "utf8"));
		assert.equal(evidence.accepted, false);
		assert.deepEqual(evidence.attempts.map(row => row.exitCode), [1, 1]);
	});
});

test("previous rerun state is refused before any test executes", async () => {
	await withFixture(async ({ run, counts, state }) => {
		await writeFile(state, "previous state");
		const result = run();
		assert.equal(result.status, 1);
		assert.match(result.stderr, /fresh rerun state/);
		assert.equal(await readFile(counts, "utf8"), "");
	});
});
