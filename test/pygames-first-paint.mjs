import assert from "node:assert/strict";

/** Wait for visible program output rather than the initial canvas background. */
export function readPygamesFirstPaint() {
	const canvas = document.querySelector("canvas.turtle-canvas--game");
	if (!canvas || !canvas.width || !canvas.height) return false;
	const pixels = canvas
		.getContext("2d")
		.getImageData(0, 0, canvas.width, canvas.height)
		.data;
	if (pixels[3] < 200) return false;
	let foregroundPixels = 0;
	for (let i = 4; i < pixels.length; i += 4) {
		if (
			pixels[i + 3] >= 200
			&& Math.max(
				Math.abs(pixels[i] - pixels[0]),
				Math.abs(pixels[i + 1] - pixels[1]),
				Math.abs(pixels[i + 2] - pixels[2])
			) > 20
		) {
			foregroundPixels += 1;
			if (foregroundPixels >= 16) {
				return {
					width: canvas.width,
					height: canvas.height,
					foregroundPixelsAtLeast: foregroundPixels
				};
			}
		}
	}
	return false;
}

export async function verifyPygamesFirstPaintControls(browser) {
	const page = await browser.newPage();
	try {
		await page.setContent(
			"<canvas class=\"turtle-canvas--game\" width=\"640\" height=\"400\"></canvas>"
		);
		for (const background of [null, "#111827", "white"]) {
			await page.evaluate((background) => {
				const canvas = document.querySelector("canvas");
				const context = canvas.getContext("2d");
				context.clearRect(0, 0, canvas.width, canvas.height);
				if (background) {
					context.fillStyle = background;
					context.fillRect(0, 0, canvas.width, canvas.height);
				}
			}, background);
			assert.equal(await page.evaluate(readPygamesFirstPaint), false);
		}
		await page.evaluate(() => {
			const context = document.querySelector("canvas").getContext("2d");
			context.fillStyle = "#64ff96";
			context.fillRect(5, 5, 200, 20);
		});
		assert.ok(await page.evaluate(readPygamesFirstPaint));
		return { emptyCanvasesRejected: 3, paintedCanvasAccepted: true };
	}
	finally {
		await page.close();
	}
}
