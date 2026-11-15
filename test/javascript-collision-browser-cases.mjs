import assert from "node:assert/strict";

import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-collision-sources.json", import.meta.url), "utf8"));

export function editedCollisionSource(resource, filename) {
	const source = fixture.files[resource.project][resource.role][filename];

	if (filename === "index.html") return source.replace(`<h1>${resource.title}</h1>`, `<h1>Saved ${resource.title}</h1>`);

	if (filename === "styles.css") return `${source}\ncanvas { outline: 3px solid #334155; }\n`;

	if (filename === "script.js") {
		const complete = fixture.files[resource.project].reference[filename];

		return resource.project === "circles-collide"
			? complete.replace("\"blue\"", "\"purple\"")
			: resource.project === "bouncy-ball" ? complete.replace("\"green\"", "\"red\"") : complete.replace("\"black\"", "\"purple\"");
	}
}
export async function inspectCollision(page, resource, kind, url, width) {
	const complete = resource.role === "reference" || kind === "edited";

	const color = resource.project === "bouncy-ball" ? (kind === "edited" ? [255, 0, 0] : [0, 128, 0]) : (kind === "edited" ? [128, 0, 128] : [0, 0, 255]);

	await page.goto(url, { waitUntil: "load" });

	await page.waitForSelector("#my-canvas");

	const sizes = resource.project === "circles-collide" ? [800, 500] : resource.project === "rectangle-collision" ? [550, 500] : [480, 320];

	assert.deepEqual(await page.$eval("#my-canvas", c => [c.width, c.height]), sizes);

	let observed;

	if (resource.project === "circles-collide") {
		if (complete) {
			await page.waitForFunction((rgb) => {
				const c = document.querySelector("canvas");
				const d = c.getContext("2d").getImageData(0, 250, c.width, 1).data;

				for (let i = 0;
					i < d.length;
					i += 4) {
					if (d[i] === rgb[0] && d[i + 1] === rgb[1] && d[i + 2] === rgb[2] && d[i + 3] > 200) return true;
				}
				return false;
			}, { timeout: 15000 }, color);

			await page.waitForFunction((rgb) => {
				const c = document.querySelector("canvas");
				const d = c.getContext("2d").getImageData(0, 250, c.width, 1).data;
				let black = 0;
				let colored = 0;

				for (let i = 0;
					i < d.length;
					i += 4) {
					if (d[i + 3] > 200 && d[i] === 0 && d[i + 1] === 0 && d[i + 2] === 0)black++;
					if (d[i + 3] > 200 && d[i] === rgb[0] && d[i + 1] === rgb[1] && d[i + 2] === rgb[2])colored++;
				}
				return black > 40 && colored === 0;
			}, { timeout: 15000 }, color);

			observed = { paintedContactThenSeparation: true };
		}
		else {
			observed = await page.$eval("canvas", (c) => {
				const ctx = c.getContext("2d");
				return [50, 500].map(x => [...ctx.getImageData(x, 250, 1, 1).data]);
			});

			assert.deepEqual(observed, [[0, 0, 0, 255], [0, 0, 0, 255]]);
		}
	}
	else if (resource.project === "rectangle-collision") {
		const expected = complete && width === 390 ? "The rectangles are colliding!" : "The rectangles are separated.";

		assert.equal(await page.$eval("canvas", c => c.getAttribute("aria-label")), expected);

		observed = { result: expected, shapesWhollyVisible: true };

		const pixels = await page.$eval("canvas", (c) => {
			const ctx = c.getContext("2d");
			return [[75, 75], [225, 225], [425, 375]].map(([x, y]) => [...ctx.getImageData(x, y, 1, 1).data]);
		});

		assert.ok(pixels.some(p => p[3] === 255));

		if (width === 1280) {
			assert.equal(pixels[0][3], 255);
			assert.equal(pixels[2][3], 255);
		}
	}
	else {
		observed = await page.evaluate(async ({ color, complete }) => {
			const canvas = document.querySelector("canvas");
			const ctx = canvas.getContext("2d");

			const sample = () => {
				const d = ctx.getImageData(0, 0, 480, 320).data;
				let x0 = 480;
				let x1 = -1;
				let y0 = 320;
				let y1 = -1;
				let count = 0;

				for (let y = 0;
					y < 320;
					y++) {
					for (let x = 0;
						x < 480;
						x++) {
						const i = (y * 480 + x) * 4;
						if (d[i] === color[0] && d[i + 1] === color[1] && d[i + 2] === color[2] && d[i + 3] > 200) {
							x0 = Math.min(x0, x);
							x1 = Math.max(x1, x);
							y0 = Math.min(y0, y);
							y1 = Math.max(y1, y);
							count++;
						}
					}
				}
				return { x: (x0 + x1 + 1) / 2, y: (y0 + y1 + 1) / 2, count, bounds: [x0, y0, x1, y1] };
			};

			const first = sample();
			let previous = first;
			let up = false;
			let down = false;
			let floor = false;
			let stable = 0;
			let frames = 0;

			for (;
				frames < (complete ? 2400 : 20);
				frames++) {
				await new Promise(resolve => requestAnimationFrame(resolve));

				const next = sample();

				if (next.count < 300 || next.bounds[0] < 0 || next.bounds[1] < 0 || next.bounds[2] >= 480 || next.bounds[3] >= 320) throw new Error("Ball paint left its canvas or disappeared");

				if (next.y < first.y - 5)up = true;

				if (up && next.y > previous.y + 0.1)down = true;

				if (next.y >= 304.5)floor = true;

				stable = floor && next.y >= 304.5 && next.x === previous.x && next.y === previous.y ? stable + 1 : 0;

				previous = next;

				if (complete && stable >= 40) break;
			}
			return { first, last: previous, up, down, floor, stable, frames };
		}, { color, complete });

		if (complete) {
			assert.ok(observed.up && observed.down && observed.floor && observed.stable >= 40, JSON.stringify(observed));
		}
		else {
			assert.equal(observed.first.x, 240);
			assert.equal(observed.first.y, 290);
			assert.deepEqual(observed.last, observed.first);
		}
	}
	assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

	if (kind === "edited") {
		assert.equal(await page.$eval("h1", e => e.textContent), `Saved ${resource.title}`);
		assert.equal(await page.$eval("canvas", c => getComputedStyle(c).outlineWidth), "3px");
	}

	return { complete, observed };
}
