import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-juggling-paddle-sources.json", import.meta.url), "utf8"));
export function editedJugglingSource(resource, filename) {
	const source = fixture.files[resource.role][filename];
	if (filename === "index.html") return source.replace("<h1>Juggling Paddle</h1>", "<h1>Saved juggling game</h1>");
	if (filename === "styles.css") return `${source}\ncanvas { outline: 3px solid #334155; }\n`;
	if (filename === "script.js") return fixture.files.reference[filename].replace("\"red\"", "\"blue\"");
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
async function painted(page, color) {
	return page.$eval("#my-canvas", (canvas, color) => {
		const ctx = canvas.getContext("2d");
		const column = ctx.getImageData(250, 0, 1, 500).data;
		const rows = [];
		for (let y = 0; y < 500; y++) {
			const at = y * 4;
			if (column[at] === color[0] && column[at + 1] === color[1] && column[at + 2] === color[2] && column[at + 3] > 200) rows.push(y);
		}
		const line = ctx.getImageData(0, 310, 500, 1).data;
		const black = [];
		for (let x = 0; x < 500; x++) {
			const at = x * 4;
			if (line[at] === 0 && line[at + 1] === 0 && line[at + 2] === 0 && line[at + 3] === 255) black.push(x);
		}
		const ballY = rows.length ? (rows[0] + rows.at(-1) + 1) / 2 : null;
		return { canvas: [canvas.width, canvas.height], paddleX: black[0], paddleWidth: black.length, ballY, ballPixel: ballY === null ? null : [...ctx.getImageData(250, Math.floor(ballY), 1, 1).data] };
	}, color);
}
export async function inspectJuggling(page, resource, kind, url) {
	const color = kind === "edited" ? [0, 0, 255] : [255, 0, 0];
	const complete = resource.role === "reference" || kind === "edited";
	await page.goto(url, { waitUntil: "load" });
	await page.waitForSelector("#my-canvas");
	const initial = await painted(page, color);
	assert.deepEqual(initial.canvas, [500, 500]);
	assert.equal(initial.paddleX, 200);
	assert.equal(initial.paddleWidth, 100);
	assert.ok(initial.ballY >= 100 && initial.ballY <= 290);
	assert.deepEqual(initial.ballPixel, [...color, 255]);
	const cases = [{ name: "original-geometry-and-painted-colors", observed: initial }];
	let cycle;
	if (complete) {
		cycle = await page.evaluate(async (color) => {
			const canvas = document.querySelector("#my-canvas");
			const ctx = canvas.getContext("2d");
			const sample = () => {
				const data = ctx.getImageData(250, 0, 1, 500).data;
				const ys = [];
				for (let y = 0; y < 500; y++) {
					const at = y * 4;
					if (data[at] === color[0] && data[at + 1] === color[1] && data[at + 2] === color[2] && data[at + 3] > 200) ys.push(y);
				}
				return ys.length ? (ys[0] + ys.at(-1) + 1) / 2 : null;
			};
			const samples = [];
			let previous = sample();
			let descended = false;
			let impact = null;
			let apex = null;
			for (let frame = 0; frame < 1000; frame++) {
				await new Promise(resolve => requestAnimationFrame(resolve));
				const y = sample();
				samples.push(y);
				if (y !== null && previous !== null) {
					if (y > previous) descended = true;
					if (impact === null && descended && y < previous) {
						impact = { previous, next: y, frame };
					}
					else if (impact !== null && y > previous) {
						apex = { previous, next: y, frame };
						break;
					}
				}
				previous = y;
			}
			return { samples, impact, apex };
		}, color);
		assert.ok(cycle.impact && cycle.apex, "Observed a complete native hit/upward/apex/downward cycle");
		assert.equal(cycle.impact.previous, 290);
		assert.equal(cycle.impact.next, 289);
		assert.equal(cycle.apex.previous, 50);
		assert.equal(cycle.apex.next, 51);
		cases.push({ name: "radius-aware-native-paddle-hit", observed: cycle.impact });
		cases.push({ name: "fixed-speed-native-apex-return", observed: cycle.apex });
	}
	else {
		await frames(page, 20);
		assert.equal((await painted(page, color)).ballY, 100);
		cases.push({ name: "starter-ball-update-unfinished", expectedY: 100 });
	}
	await page.click("#my-canvas");
	await page.keyboard.down("ArrowLeft");
	await page.waitForFunction(() => document.querySelector("#my-canvas").getContext("2d").getImageData(0, 310, 1, 1).data[3] === 255, { timeout: 10000 });
	await page.keyboard.up("ArrowLeft");
	await frames(page);
	assert.equal((await painted(page, color)).paddleX, 0);
	cases.push({ name: "real-keyboard-moves-paddle-away", expectedX: 0 });
	if (complete) {
		await page.waitForFunction((color) => {
			const c = document.querySelector("#my-canvas");
			const data = c.getContext("2d").getImageData(250, 0, 1, 500).data;
			for (let y = 0; y < 500; y++) {
				const at = y * 4;
				if (data[at] === color[0] && data[at + 1] === color[1] && data[at + 2] === color[2] && data[at + 3] > 200) return false;
			}
			return true;
		}, { polling: "raf", timeout: 18000 }, color);
		await frames(page, 20);
		assert.equal((await painted(page, color)).ballY, null);
		cases.push({ name: "miss-leaves-screen-without-auto-reset", ballY: null });
	}
	await page.keyboard.down("ArrowRight");
	await frames(page, 3);
	await page.keyboard.press("Tab");
	assert.equal(await page.$eval("#my-canvas", el => document.activeElement === el), false);
	await frames(page);
	const blurred = (await painted(page, color)).paddleX;
	await frames(page, 5);
	assert.equal((await painted(page, color)).paddleX, blurred);
	await page.keyboard.up("ArrowRight");
	cases.push({ name: "real-tab-focus-loss-stops", expectedX: blurred });
	await page.reload({ waitUntil: "load" });
	await page.waitForSelector("#my-canvas");
	assert.equal(await page.$eval("h1", el => el.textContent), kind === "edited" ? "Saved juggling game" : "Juggling Paddle");
	return { complete, initialPixels: initial, cases, cycle, realGameFlowVerified: complete, realFocusLossVerified: true, savedColorEditVerified: kind === "edited" };
}
