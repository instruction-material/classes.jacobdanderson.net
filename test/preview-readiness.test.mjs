import assert from "node:assert/strict";
import { createServer } from "node:http";
// eslint-disable-next-line test/no-import-node-test -- Native HTTP startup regression.
import { test } from "node:test";
import { waitForLoopbackPreview } from "../scripts/wait-for-loopback-preview.mjs";

async function fixture(t, handler) {
	const server = createServer(handler);
	await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
	t.after(async () => {
		server.closeAllConnections();
		await new Promise((resolve, reject) =>
			server.close(error => (error ? reject(error) : resolve()))
		);
	});
	return `http://127.0.0.1:${server.address().port}`;
}
test("preview readiness retries the observed closed-socket startup failure", async (t) => {
	let attempts = 0;
	const url = await fixture(t, (req, res) => {
		if (++attempts === 1) req.socket.destroy();
		else res.end("ready");
	});
	const result = await waitForLoopbackPreview(url, {
		timeoutMs: 2_000,
		intervalMs: 10,
		requestTimeoutMs: 200
	});
	assert.equal(attempts, 2);
	assert.equal(result.attempts, 2);
});
test("preview readiness waits through unavailable and redirect responses", async (t) => {
	let attempts = 0;
	const url = await fixture(t, (req, res) => {
		attempts++;
		res.statusCode = attempts === 1 ? 503 : attempts === 2 ? 302 : 200;
		if (attempts === 2)
			res.setHeader("Location", "https://example.invalid/");
		res.end();
	});
	const result = await waitForLoopbackPreview(url, {
		timeoutMs: 2_000,
		intervalMs: 10
	});
	assert.equal(result.attempts, 3);
});
test("preview readiness bounds a server that never returns headers", async (t) => {
	const url = await fixture(t, () => {});
	const started = performance.now();
	await assert.rejects(
		waitForLoopbackPreview(url, {
			timeoutMs: 140,
			intervalMs: 10,
			requestTimeoutMs: 35
		}),
		/not ready within 140ms/
	);
	assert.ok(performance.now() - started < 2_000);
});
test("preview readiness retains HTTP evidence when later attempts time out", async (t) => {
	let attempts = 0;
	t.mock.method(globalThis, "fetch", async (_target, { signal }) => {
		if (++attempts === 1) return new Response(null, { status: 503 });
		return new Promise((_resolve, reject) => {
			if (signal.aborted) reject(signal.reason);
			else signal.addEventListener("abort", () => reject(signal.reason), { once: true });
		});
	});
	await assert.rejects(
		waitForLoopbackPreview("http://127.0.0.1:3333", {
			timeoutMs: 100,
			intervalMs: 10,
			requestTimeoutMs: 35
		}),
		/last result: HTTP 503; last attempt: .*timeout/i
	);
	assert.ok(attempts >= 2);
});
test("preview readiness reports transport failures when no HTTP response arrived", async (t) => {
	t.mock.method(globalThis, "fetch", async () => {
		throw new TypeError("fetch failed", { cause: { code: "ECONNREFUSED" } });
	});
	await assert.rejects(
		waitForLoopbackPreview("http://127.0.0.1:3333", {
			timeoutMs: 50,
			intervalMs: 10
		}),
		/last result: fetch failed: ECONNREFUSED/
	);
});
test("preview readiness cancellation aborts a pending request", async (t) => {
	const url = await fixture(t, () => {});
	const controller = new AbortController();
	const timeout = setTimeout(
		() => controller.abort(new Error("fixture cancellation")),
		30
	);
	try {
		await assert.rejects(
			waitForLoopbackPreview(url, {
				timeoutMs: 5_000,
				signal: controller.signal
			}),
			/fixture cancellation/
		);
	}
	finally {
		clearTimeout(timeout);
	}
});
test("preview readiness rejects remote destinations before sending requests", async () => {
	for (const url of [
		"https://127.0.0.1:3333",
		"http://localhost:3333",
		"http://example.invalid",
		"http://name:secret@127.0.0.1:3333"
	]) {
		await assert.rejects(waitForLoopbackPreview(url), /HTTP loopback URL/);
	}
});
