import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// eslint-disable-next-line test/no-import-node-test -- Independent authored course-source regression checks.
import { test } from "node:test";
import vm from "node:vm";

const fixture = JSON.parse(
	await readFile(
		new URL(
			"./fixtures/javascript-master-checkpoint-two-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
const normalize = value => JSON.parse(JSON.stringify(value));
async function lesson(folder, role = "reference") {
	const context = vm.createContext({
		console,
		AbortController,
		setTimeout,
		clearTimeout
	});
	for (const name of folder === "Core"
		? ["remote.js", "fixture.js", "helpers.js"]
		: ["remote.js", "fixture.js", "data.js", "moves.js"]) {
		vm.runInContext(
			fixture.files[
				folder === "Core"
					? "master-checkpoint-two"
					: "master-checkpoint-two-moves"
			][role][name],
			context,
			{ filename: name }
		);
	}
	return context;
}
test("starter helpers explicitly identify unfinished work", async () => {
	const c = await lesson("Core", "starter");
	for (const name of ["sumEvens", "canvasPoint", "firstMove"])
		assert.throws(() => c.checkpoint[name](), /Complete/);
});
test("sumEvens handles original arrays, empty, odd-first and negative values without mutation", async () => {
	const c = await lesson("Core");
	const cases = [
		[[2, 1, 6, 91, -1], 8],
		[[0, 3, 2, 91, -1], 2],
		[[], 0],
		[[1, 2], 2],
		[[-3, 2], 2],
		[[-4, 2], -2]
	];
	for (const [values, expected] of cases) {
		const before = [...values];
		assert.equal(c.checkpoint.sumEvens(values), expected);
		assert.deepEqual(values, before);
	}
});
test("canvas translates CSS location and scale into actual buffer coordinates", async () => {
	const c = await lesson("Core");
	const canvas = {
		width: 500,
		height: 500,
		getBoundingClientRect: () => ({
			left: 40,
			top: 60,
			width: 250,
			height: 250
		})
	};
	assert.deepEqual(
		normalize(
			c.checkpoint.canvasPoint({ clientX: 165, clientY: 185 }, canvas)
		),
		{ x: 250, y: 250 }
	);
	assert.deepEqual(
		normalize(
			c.checkpoint.canvasPoint({ clientX: 40, clientY: 60 }, canvas)
		),
		{ x: 0, y: 0 }
	);
	assert.deepEqual(
		normalize(
			c.checkpoint.canvasPoint({ clientX: 290, clientY: 310 }, canvas)
		),
		{ x: 500, y: 500 }
	);
	assert.throws(
		() =>
			c.checkpoint.canvasPoint(
				{},
				{
					...canvas,
					getBoundingClientRect: () => ({ width: 0, height: 0 })
				}
			),
		/visible/
	);
});
test("fixture path and validation are usable without a network request", async () => {
	const c = await lesson("Core");
	assert.equal(c.checkpoint.firstMove(c.checkpointFixture), "pound");
	for (const value of [
		null,
		{},
		{ results: [] },
		{ results: [{}] },
		{ results: [{ name: "" }] }
	])
		assert.throws(() => c.checkpoint.firstMove(value), /results/);
});
test("successful requests cache only after validation; malformed and HTTP failures remain retryable", async () => {
	const c = await lesson("Core");
	let calls = 0;
	const request = () => {
		calls++;
		return Promise.resolve({
			ok: true,
			json: async () => ({ results: [{ name: "demo" }] })
		});
	};
	const remote = c.checkpointRemote;
	assert.equal(
		(await remote.requestJson("good", remote.validateList, request))
			.results[0].name,
		"demo"
	);
	await remote.requestJson("good", remote.validateList, request);
	assert.equal(calls, 1);
	let attempts = 0;
	const bad = async () => {
		attempts++;
		return { ok: true, json: async () => ({ results: [] }) };
	};
	await assert.rejects(
		remote.requestJson("bad", remote.validateList, bad),
		/results/
	);
	await assert.rejects(
		remote.requestJson("bad", remote.validateList, bad),
		/results/
	);
	assert.equal(attempts, 2);
	await assert.rejects(
		remote.requestJson("status", remote.validateList, async () => ({
			ok: false,
			status: 503,
			json() {
				throw new Error("Must not parse a failed response");
			}
		})),
		/HTTP 503/
	);
});
test("timeout aborts the actual request and leaves the same URL retryable", async () => {
	const c = await lesson("Core");
	let aborted = false;
	await assert.rejects(
		c.checkpointRemote.requestJson(
			"slow",
			x => x,
			(_url, { signal }) =>
				new Promise((_resolve, reject) => {
					signal.addEventListener("abort", () => {
						aborted = true;
						reject(new Error("aborted"));
					});
				}),
			15
		),
		/timed out/
	);
	assert.equal(aborted, true);
	assert.equal(
		await c.checkpointRemote.requestJson(
			"slow",
			x => x,
			async () => ({ ok: true, json: async () => 17 })
		),
		17
	);
});
test("move starter exposes two deliberate exercise functions", async () => {
	const c = await lesson("Move Analyzer", "starter");
	assert.throws(() => c.moveLesson.countTypes([]), /Complete/);
	assert.throws(() => c.moveLesson.countForType({}, "fire"), /Complete/);
});
test("move counting, input normalization and absent types match the complete six-record fixture", async () => {
	const c = await lesson("Move Analyzer");
	const before = JSON.stringify(c.moveFixture);
	const counts = c.moveLesson.countTypes(c.moveFixture);
	assert.deepEqual(normalize(counts), {
		fire: 2,
		water: 2,
		normal: 1,
		electric: 1
	});
	assert.equal(
		Object.values(counts).reduce((a, b) => a + b, 0),
		6
	);
	for (const input of ["fire", "Fire", " FIRE "]) {
		assert.deepEqual(normalize(c.moveLesson.countForType(counts, input)), {
			type: "fire",
			count: 2
		});
	}
	assert.equal(c.moveLesson.countForType(counts, " WATER ").count, 2);
	assert.equal(c.moveLesson.countForType(counts, "grass").count, 0);
	for (const input of ["", null, "   "])
		assert.throws(() => c.moveLesson.countForType(counts, input), /Enter/);
	assert.throws(
		() => c.moveLesson.countForType(counts, "<img src=x>"),
		/Unknown/
	);
	assert.equal(JSON.stringify(c.moveFixture), before);
	for (const moves of [
		[],
		[{}],
		[{ name: "bad", type: { name: "constructor" } }]
	])
		assert.throws(() => c.moveLesson.countTypes(moves), /Expected|needs/);
});
test("optional live sample waits for all six sequential GETs and reuses the exact cached records", async () => {
	const c = await lesson("Move Analyzer");
	let active = 0;
	let peak = 0;
	const urls = [];
	const fetcher = async (url) => {
		active++;
		peak = Math.max(peak, active);
		urls.push(url);
		await new Promise(resolve => setTimeout(resolve, 1));
		active--;
		return {
			ok: true,
			json: async () => ({
				name: `move-${urls.length}`,
				type: { name: "ghost" }
			})
		};
	};
	const result = await c.moveData.readLiveMoves(fetcher);
	assert.equal(result.length, 6);
	assert.equal(peak, 1);
	assert.equal(urls.length, 6);
	assert.deepEqual(
		urls.map(x => Number(x.split("/").at(-2))),
		[1, 2, 3, 4, 5, 6]
	);
	const again = await c.moveData.readLiveMoves(fetcher);
	assert.deepEqual(normalize(again), normalize(result));
	assert.equal(urls.length, 6);
});
test("a failed detail cannot produce a partial ready sample; only that response must be retried", async () => {
	const c = await lesson("Move Analyzer");
	let calls = 0;
	let fail = true;
	const fetcher = async (url) => {
		calls++;
		const id = Number(url.split("/").at(-2));
		if (id === 3 && fail) {
			fail = false;
			return { ok: true, json: async () => ({ name: "missing-type" }) };
		}
		return {
			ok: true,
			json: async () => ({ name: `move-${id}`, type: { name: "normal" } })
		};
	};
	await assert.rejects(c.moveData.readLiveMoves(fetcher), /needs/);
	assert.equal(calls, 3);
	const result = await c.moveData.readLiveMoves(fetcher);
	assert.equal(result.length, 6);
	assert.equal(calls, 7);
});
