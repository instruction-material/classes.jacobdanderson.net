import { Buffer } from "node:buffer";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

/** Preserve the original error even when a renderer stops answering diagnostics. */
export async function captureCourseWorkflowFailure({
	page,
	error,
	output,
	name,
	requests,
	profiles,
	readSavedProjects,
	browserSignals = {},
	timeoutMs = 2000
}) {
	const failures = [];
	const probe = async (label, operation, fallback = null) => {
		let timer;
		try {
			return await Promise.race([
				Promise.resolve().then(operation),
				new Promise((_, reject) => {
					timer = setTimeout(() => reject(new Error(`${label} diagnostic timed out`)), timeoutMs);
				})
			]);
		}
		catch (failure) {
			failures.push({ label, error: String(failure) });
			return fallback;
		}
		finally {
			clearTimeout(timer);
		}
	};
	const evidence = {
		url: page.url(),
		requests,
		error: String(error),
		profiles,
		browserSignals,
		diagnosticFailures: failures
	};
	const file = join(output, `${name}-failed.json`);
	// This write must happen before any operation that needs a live renderer.
	await writeFile(file, `${JSON.stringify(evidence, null, 2)}\n`);
	const [consoleOutput, mobileView, runtimeFrames, savedProjects] = await Promise.all([
		probe("output", () => page.$eval(".output-panel", element => element.textContent)),
		probe("mobile view", () => page.$eval(".mobile-view-picker", element => element.innerHTML)),
		probe("runtime frames", () => Promise.all(page.frames().map(async frame => ({
			url: frame.url(),
			charts: await probe("frame charts", () => frame.$$eval(".artifact-card img", images => images.map(image => ({
				complete: image.complete,
				width: image.naturalWidth,
				height: image.naturalHeight
			}))), [])
		}))), []),
		probe("saved projects", readSavedProjects, { unavailable: "Renderer diagnostics unavailable" })
	]);
	Object.assign(evidence, { output: consoleOutput, mobileView, runtimeFrames, savedProjects });
	const session = await probe("screenshot session", () => page.createCDPSession());
	if (session) {
		try {
			// The supported CDP timeout avoids Page.screenshot's closing-page guard.
			const screenshot = await probe("screenshot", () => session.send(
				"Page.captureScreenshot",
				{ format: "png", captureBeyondViewport: false },
				{ timeout: timeoutMs }
			));
			if (screenshot?.data)
				await writeFile(join(output, `${name}-failed.png`), Buffer.from(screenshot.data, "base64"));
		}
		finally {
			await probe("screenshot detach", () => session.detach());
		}
	}
	await writeFile(file, `${JSON.stringify(evidence, null, 2)}\n`);
	return evidence;
}
