import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-master-canvas-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
export function editedCanvasSource(resource, filename) {
	const reference = fixture.resources.find(
		r => r.project === resource.project && r.role === "reference"
	);
	const source = readFileSync(
		new URL(
			`../front-end/public/course-assets/javascript-level-2/${reference.files.find(f => f.name === filename).path}`,
			import.meta.url
		),
		"utf8"
	);
	if (filename === "index.html") {
		return source
			.replace("<title>", "<title>Saved ")
			.replace("<h1>", "<h1 data-saved-edit=\"true\">Saved ");
	}
	if (filename === "script.js")
		return `${source}\ndocument.querySelector("h1").style.color = "#7c3aed";\ndocument.querySelector("h1").dataset.savedScript = "true";\n`;
	return `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

export async function inspectCanvas(page, resource, kind) {
	await page.waitForFunction(
		() => document.querySelector("main")?.dataset.state === "loaded"
	);
	const rendered = await page.evaluate(() => {
		const canvas = document.querySelector("canvas");
		const context = canvas.getContext("2d");
		const data = context.getImageData(
			0,
			0,
			canvas.width,
			canvas.height
		).data;
		let painted = 0;
		for (let i = 3; i < data.length; i += 4) {
			if (data[i] > 0) painted++;
		}
		const pixel = (x, y) =>
			Array.from(context.getImageData(x, y, 1, 1).data);
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			let gold = 0;
			const left = 200 * i - 75;
			for (let y = 100; y < 250; y++) {
				for (let x = left; x < left + 150; x++) {
					if (x >= canvas.width || y >= canvas.height) continue;
					const offset = (y * canvas.width + x) * 4;
					if (
						data[offset] > 240
						&& data[offset + 1] > 180
						&& data[offset + 2] < 30
						&& data[offset + 3] > 200
					) {
						gold++;
					}
				}
			}
			stars.push(gold);
		}
		const points
			= document.body.dataset.project === "basic-shapes"
				? [
						[150, 150],
						[300, 150],
						[480, 170]
					]
				: document.body.dataset.project === "canvas-text"
					? [
							[60, 20],
							[350, 180]
						]
					: document.body.dataset.project === "loopy-landscape"
						? [
								[1, 1],
								[790, 790],
								[600, 200],
								[60, 300],
								[160, 300],
								[260, 300],
								[60, 750]
							]
						: document.body.dataset.project === "jni-stock-price"
							? [
									[350, 375],
									[450, 400],
									[550, 300]
								]
							: [];
		return {
			width: canvas.width,
			height: canvas.height,
			display: canvas.getBoundingClientRect().toJSON(),
			painted,
			stars,
			pixels: points.map(([x, y]) => pixel(x, y)),
			description: document.querySelector("figcaption").textContent,
			describedBy: canvas.getAttribute("aria-describedby"),
			errorVisible: !document.querySelector("#source-error").hidden,
			noHorizontalOverflow:
				document.documentElement.scrollWidth <= innerWidth,
			table: Array.from(document.querySelectorAll("tbody tr")).map(row =>
				Array.from(row.children).map(cell => cell.textContent)
			),
			saved: document.querySelector("h1").dataset.savedScript
		};
	});
	assert.ok(rendered.noHorizontalOverflow);
	assert.equal(rendered.errorVisible, false);
	assert.equal(rendered.describedBy, "drawing-description");
	assert.equal(rendered.width, resource.logicalCanvas.width);
	assert.equal(rendered.height, resource.logicalCanvas.height);
	assert.ok(rendered.display.width > 0 && rendered.display.height > 0);
	if (resource.project === "jni-stock-price") {
		assert.deepEqual(rendered.table, [
			["1/1", "100"],
			["1/4", "300"],
			["1/7", "150"],
			["1/10", "250"],
			["1/13", "350"]
		]);
	}
	if (resource.role === "starter" && kind === "exact") {
		assert.equal(rendered.painted, 0);
		assert.match(rendered.description, /Blank canvas/);
		return { ...rendered, originalDrawingTaskUnfinished: true };
	}
	assert.ok(rendered.painted > 1000);
	if (kind === "edited") assert.equal(rendered.saved, "true");
	if (resource.project === "basic-shapes") {
		assert.ok(
			rendered.pixels[0][0] > 240
			&& rendered.pixels[0][1] < 20
			&& rendered.pixels[0][3] >= 120
		);
		assert.ok(rendered.pixels[1][2] > 240 && rendered.pixels[1][0] < 20);
		assert.ok(rendered.pixels[2][1] > 240 && rendered.pixels[2][0] < 20);
	}
	else if (resource.project === "shining-stars") {
		assert.ok(rendered.stars.every(count => count > 1000));
		assert.equal(rendered.width, 1200);
		assert.match(rendered.description, /Five gold stars/);
	}
	else if (resource.project === "canvas-text") {
		assert.deepEqual(rendered.pixels[0], [255, 192, 203, 255]);
		assert.deepEqual(rendered.pixels[1], [255, 0, 0, 255]);
		assert.match(rendered.description, /Happy Valentine's Day/);
	}
	else if (resource.project === "loopy-landscape") {
		assert.deepEqual(rendered.pixels[0], [0, 0, 255, 255]);
		assert.deepEqual(rendered.pixels[1], [0, 128, 0, 255]);
		assert.deepEqual(rendered.pixels[2], [255, 255, 0, 255]);
		for (const pixel of rendered.pixels.slice(3, 6))
			assert.deepEqual(pixel, [0, 255, 0, 255]);
		assert.deepEqual(rendered.pixels[6], [165, 42, 42, 255]);
	}
	else if (resource.project === "jni-stock-price") {
		for (const pixel of rendered.pixels)
			assert.deepEqual(pixel, [38, 62, 75, 255]);
		assert.match(rendered.description, /January 1, 4, 7, 10 and 13/);
	}
	return { ...rendered, actualCanvasPixelsAccepted: true };
}
