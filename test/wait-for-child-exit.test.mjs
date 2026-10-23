import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { waitForChildExitWithin } from "../scripts/wait-for-child-exit.mjs";

function child() {
	const process = new EventEmitter();
	process.exitCode = null;
	process.signalCode = null;
	return process;
}

test("returns immediately for an already exited child", async () => {
	const process = child();
	process.exitCode = 0;
	assert.equal(await waitForChildExitWithin(process, 1000), true);
	assert.equal(process.listenerCount("exit"), 0);
});

test("removes its exit listener after a bounded timeout", async () => {
	const process = child();
	assert.equal(await waitForChildExitWithin(process, 10), false);
	assert.equal(process.listenerCount("exit"), 0);
});

test("clears its timeout when the child exits early", async () => {
	const process = child();
	const finished = waitForChildExitWithin(process, 1000);
	process.exitCode = 0;
	process.emit("exit", 0);
	assert.equal(await finished, true);
	assert.equal(process.listenerCount("exit"), 0);
});
