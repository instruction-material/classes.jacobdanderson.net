import assert from "node:assert/strict";

// Capture document coordinates without ElementHandle.screenshot resizing a
// viewport around a tall lesson and invalidating its measured position.
export async function captureLessonScreenshot(page, element, path) {
	await page.evaluate(() => document.fonts.ready);
	await element.evaluate((element) => {
		element.scrollIntoView({ block: "start", behavior: "instant" });
	});
	await page.waitForFunction(
		(element) => {
			const box = element.getBoundingClientRect();
			const bounds = JSON.stringify([
				box.x + scrollX,
				box.y + scrollY,
				box.width,
				box.height
			]);
			const prior = window.__lessonCaptureBounds;
			const stable = prior?.bounds === bounds ? prior.stable + 1 : 0;
			window.__lessonCaptureBounds = { bounds, stable };
			return stable >= 4 && box.width > 0 && box.height > 0;
		},
		{ polling: "raf", timeout: 15000 },
		element
	);
	const clip = await element.evaluate((element) => {
		const box = element.getBoundingClientRect();
		return {
			x: box.x + scrollX,
			y: box.y + scrollY,
			width: box.width,
			height: box.height
		};
	});
	assert.ok(Object.values(clip).every(Number.isFinite));
	assert.ok(clip.x >= 0 && clip.y >= 0);
	assert.ok(clip.width > 0 && clip.height > 0);
	await page.screenshot({ path, clip, captureBeyondViewport: true });
	return { ...clip, viewportWidth: page.viewport().width };
}
