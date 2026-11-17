import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Verify diagnostics against an actual busy browser renderer.
import { test } from "node:test";
import puppeteer from "puppeteer";
import { captureCourseWorkflowFailure } from "./course-workflow-failure-evidence.mjs";

test("the original error is durable before unresponsive renderer probes start", async () => {
	const output = await mkdtemp(join(tmpdir(), "course-failure-evidence-"));
	try {
		const file = join(output, "stalled-failed.json");
		const never = async () => {
			const original = JSON.parse(await readFile(file, "utf8"));
			assert.equal(original.error, "Error: original run failure");
			return new Promise(() => {});
		};
		const page = { url: () => "http://127.0.0.1/ide", $eval: never, frames: () => [], createCDPSession: never };
		const started = Date.now();
		const evidence = await captureCourseWorkflowFailure({
			page,
			output,
			name: "stalled",
			error: new Error("original run failure"),
			requests: ["main.py"],
			profiles: [],
			readSavedProjects: never,
			timeoutMs: 40
		});
		assert.ok(Date.now() - started < 2000);
		assert.equal(evidence.error, "Error: original run failure");
		assert.ok(evidence.diagnosticFailures.length >= 4);
		assert.ok(evidence.diagnosticFailures.every(row => row.error.includes("timed out")));
		assert.deepEqual(JSON.parse(await readFile(file, "utf8")), evidence);
	}
	finally {
		await rm(output, { recursive: true, force: true });
	}
});

test("a busy real renderer cannot delay evidence capture or owned-browser cleanup", { timeout: 30000 }, async () => {
	const output = await mkdtemp(join(tmpdir(), "course-busy-browser-"));
	const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, await puppeteer.executablePath(), "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
		.find(path => path && existsSync(path));
	assert.ok(executablePath, "An existing Chrome installation is required");
	let browser;
	try {
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
		const page = await browser.newPage();
		await page.setContent("<p class=\"output-panel\">original output</p>");
		await captureCourseWorkflowFailure({ page, output, name: "responsive", error: new Error("sample"), requests: [], profiles: [], readSavedProjects: async () => [], timeoutMs: 1000 });
		assert.ok((await readFile(join(output, "responsive-failed.png"))).byteLength > 100);
		const started = Date.now();
		// Install the busy callback before issuing any diagnostic requests.
		await page.evaluate(() => setTimeout(() => {
			const until = Date.now() + 15000;
			while (Date.now() < until) { /* Deliberately occupy this owned renderer. */ }
		}, 0));
		const evidence = await captureCourseWorkflowFailure({ page, output, name: "busy", error: new Error("real run timeout"), requests: [], profiles: [], readSavedProjects: () => page.evaluate(() => []), timeoutMs: 200 });
		assert.ok(evidence.diagnosticFailures.some(row => row.label === "output"));
		assert.equal(evidence.error, "Error: real run timeout");
		await page.close();
		await browser.close();
		browser = null;
		assert.ok(Date.now() - started < 10000, "Renderer diagnostics and browser cleanup must finish before the busy loop");
	}
	finally {
		await browser?.close();
		await rm(output, { recursive: true, force: true });
	}
});
