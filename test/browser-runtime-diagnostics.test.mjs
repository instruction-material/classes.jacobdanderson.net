import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native browser regression entrypoint.
import { test } from "node:test";
import puppeteer from "puppeteer";
import { waitForChildExitWithin } from "../scripts/wait-for-child-exit.mjs";
import {
	browserPageFailure,
	captureBrowserDiagnostics,
	recordBrowserPageFailure
} from "./browser-runtime-diagnostics.mjs";

test(
	"retains an owned renderer crash instead of a later control timeout",
	{ timeout: 45000 },
	async (t) => {
		const output
			= process.env.PYGAMES_CORE_BROWSER_PROOF_DIR
				?? "output/pygames-core-exports";
		await mkdir(output, { recursive: true });
		const record = {
			parentTaskId: "browser-crash-regression",
			parentPid: process.pid,
			cwd: process.cwd(),
			startedAt: new Date().toISOString(),
			timeoutMs: 45000,
			intentionalOwnedBlankPageCrash: true,
			passed: false
		};
		let browser, dispose, child, timer, cleanupPromise;
		const cleanup = () => {
			if (cleanupPromise) return cleanupPromise;
			cleanupPromise = (async () => {
				clearTimeout(timer);
				let deadline;
				const close = (async () => {
					if (dispose) await dispose();
					if (browser) await browser.close();
				})().catch(() => {});
				try {
					await Promise.race([
						close,
						new Promise((resolve) => {
							deadline = setTimeout(resolve, 3000);
						})
					]);
				}
				finally {
					clearTimeout(deadline);
				}
				if (child && !(await waitForChildExitWithin(child, 1000))) {
					child.kill("SIGTERM");
					if (!(await waitForChildExitWithin(child, 3000))) {
						child.kill("SIGKILL");
						assert.ok(await waitForChildExitWithin(child, 3000));
					}
				}
				Object.assign(record, {
					endedAt: new Date().toISOString(),
					exitCode: child?.exitCode,
					signalCode: child?.signalCode,
					childProcessGroupCleanup: "owned browser and pages closed"
				});
				await writeFile(
					join(output, "owned-renderer-crash-regression.json"),
					JSON.stringify(record, null, 2)
				);
			})();
			return cleanupPromise;
		};
		t.signal.addEventListener(
			"abort",
			() => {
				void cleanup();
			},
			{ once: true }
		);
		try {
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				"/usr/bin/google-chrome",
				"/usr/bin/chromium",
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				puppeteer.executablePath()
			].find(path => path && existsSync(path));
			assert.ok(executablePath, "An installed Chrome is required");
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			child = browser.process();
			Object.assign(record, { pid: child.pid, command: child.spawnargs });
			const diagnostics = await captureBrowserDiagnostics(
				browser,
				record
			);
			dispose = diagnostics.dispose;
			const page = await browser.newPage();
			const crashed = new Promise(resolve =>
				page.once("error", (error) => {
					recordBrowserPageFailure(page, error);
					resolve(error);
				})
			);
			const session = await page.createCDPSession();
			void session.send("Page.crash").catch(() => {});
			const [, failure] = await Promise.race([
				Promise.all([diagnostics.rendererCrash, crashed]),
				new Promise((_, reject) => {
					timer = setTimeout(
						() =>
							reject(
								new Error(
									"The owned renderer did not report its crash"
								)
							),
						15000
					);
				})
			]);
			assert.match(failure.message, /crash/i);
			assert.equal(
				browserPageFailure(page, new Error("Later control timeout")),
				failure
			);
			assert.ok(record.rendererCrashes.length > 0);
			assert.ok(
				record.rendererCrashes.every(
					event =>
						typeof event.status === "string"
						&& Number.isInteger(event.errorCode)
				)
			);
			assert.ok(record.browserVersion);
			record.passed = true;
		}
		finally {
			await cleanup();
		}
	}
);
