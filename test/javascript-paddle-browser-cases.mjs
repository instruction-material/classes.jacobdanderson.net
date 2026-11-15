import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-paddle-sources.json", import.meta.url), "utf8"));
export function editedPaddleSource(resource, filename) {
	const source = fixture.files[resource.role][filename];
	if (filename === "index.html") return source.replace("<h1>Paddle</h1>", "<h1>Saved paddle controls</h1>");
	if (filename === "styles.css") return `${source}\ncanvas { outline: 3px solid #334155; }\n`;
	if (filename === "script.js") return fixture.files.reference[filename].replace("\"black\"", "\"purple\"").replace("speed: 10", "speed: 5");
	return undefined;
}
async function frames(page, count = 3) {
	await page.evaluate(count => new Promise((resolve) => {
		const next = () => {
			if (--count <= 0) resolve();
			else requestAnimationFrame(next);
		};
		requestAnimationFrame(next);
	}), count);
}
async function paintedPaddle(page) {
	return page.$eval("#my-canvas", (canvas) => {
		const data = canvas.getContext("2d").getImageData(0, 10, canvas.width, 1).data;
		const occupied = [];
		for (let x = 0; x < canvas.width; x++) {
			if (data[x * 4 + 3]) occupied.push(x);
		}
		const first = occupied[0];
		return { x: first, width: occupied.length, pixel: [...data.slice(first * 4, first * 4 + 4)], canvas: [canvas.width, canvas.height] };
	});
}
export async function inspectPaddle(page, resource, kind, url) {
	await page.goto(url, { waitUntil: "load" });
	await page.waitForSelector("#my-canvas");
	const complete = resource.role === "reference" || kind === "edited";
	const cases = [];
	const initial = await paintedPaddle(page);
	assert.deepEqual(initial, { x: 0, width: 100, pixel: kind === "edited" ? [128, 0, 128, 255] : [0, 0, 0, 255], canvas: [500, 500] });
	await page.click("#my-canvas");
	assert.equal(await page.$eval("#my-canvas", canvas => document.activeElement === canvas), true);
	async function waitAt(expected) {
		await page.waitForFunction((expected) => {
			const c = document.querySelector("#my-canvas");
			const d = c.getContext("2d").getImageData(0, 10, c.width, 1).data;
			for (let x = 0; x < c.width; x++) {
				if (d[x * 4 + 3]) return x === expected;
			}
			return false;
		}, { timeout: 10000 }, expected);
	}
	await page.keyboard.down("ArrowRight");
	if (complete) await waitAt(400);
	else await frames(page);
	await page.keyboard.up("ArrowRight");
	await frames(page);
	const actual = await paintedPaddle(page);
	assert.equal(actual.x, complete ? 400 : 0);
	cases.push({ name: "held-right-clamps", expectedX: complete ? 400 : 0, actualX: actual.x });
	await page.keyboard.down("ArrowRight");
	await frames(page);
	await page.keyboard.up("ArrowRight");
	assert.equal((await paintedPaddle(page)).x, complete ? 400 : 0);
	cases.push({ name: "right-boundary", expectedX: complete ? 400 : 0 });
	await page.keyboard.down("ArrowLeft");
	if (complete) await waitAt(0);
	else await frames(page);
	await page.keyboard.up("ArrowLeft");
	await frames(page);
	assert.equal((await paintedPaddle(page)).x, 0);
	cases.push({ name: "held-left-clamps", expectedX: 0 });
	await page.keyboard.down("ArrowLeft");
	await page.keyboard.down("ArrowRight");
	await frames(page);
	assert.equal((await paintedPaddle(page)).x, 0);
	await page.keyboard.up("ArrowLeft");
	await page.keyboard.up("ArrowRight");
	cases.push({ name: "both-directions-cancel", expectedX: 0 });
	await page.keyboard.press("a");
	await frames(page);
	assert.equal((await paintedPaddle(page)).x, 0);
	cases.push({ name: "unrelated-key", expectedX: 0 });
	await page.keyboard.down("ArrowRight");
	if (complete) {
		await page.waitForFunction(() => {
			const c = document.querySelector("#my-canvas");
			return c.getContext("2d").getImageData(0, 10, 1, 1).data[3] === 0;
		});
	}
	else {
		await frames(page);
	}
	await page.keyboard.up("ArrowRight");
	await frames(page);
	const released = await paintedPaddle(page);
	await frames(page, 5);
	assert.equal((await paintedPaddle(page)).x, released.x);
	cases.push({ name: "key-release-stops", expectedX: released.x });
	await page.keyboard.down("ArrowRight");
	await frames(page);
	await page.keyboard.press("Tab");
	assert.equal(await page.$eval("#my-canvas", canvas => document.activeElement === canvas), false);
	await frames(page);
	const blurred = await paintedPaddle(page);
	await frames(page, 5);
	assert.equal((await paintedPaddle(page)).x, blurred.x);
	await page.keyboard.up("ArrowRight");
	cases.push({ name: "real-tab-focus-loss-stops", expectedX: blurred.x });
	assert.equal(await page.$eval("h1", el => el.textContent), kind === "edited" ? "Saved paddle controls" : "Paddle");
	return { complete, initialPixels: initial, cases, realKeyboardCases: cases.length, realFocusLossVerified: true, savedColorEditVerified: kind === "edited" };
}
