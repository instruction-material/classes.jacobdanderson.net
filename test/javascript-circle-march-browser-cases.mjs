import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-circle-march-sources.json",
			import.meta.url
		),
		"utf8"
	)
);

export function editedCircleSource(resource, filename) {
	if (filename === "index.html") {
		return fixture.files.reference[filename].replace(
			/<title>[^<]*<\/title>/,
			"<title>Saved Circle March</title>"
		);
	}
	if (filename === "styles.css") {
		return [fixture.files[resource.role][filename], "canvas { outline: 3px solid #334155; }\n"].join("");
	}
	if (filename === "script.js") {
		return fixture.files.reference[filename]
			.replace("const rad = 5;", "const rad = 7;")
			.replace("c.x += 1;", "c.x += 2;")
			.replace("c.y += 1;", "c.y += 2;");
	}
	return undefined;
}

export async function inspectCircles(page, resource, kind, url) {
	// Control timing and random inputs while using the browser's real Canvas.
	await page.evaluateOnNewDocument(() => {
		const queued = [];
		let randomCalls = 0;
		Math.random = () => ((randomCalls++ * 73) % 256) / 256;
		window.requestAnimationFrame = (callback) => {
			queued.push(callback);
			return queued.length;
		};
		window.__circleTest = {
			get randomCalls() {
				return randomCalls;
			},
			get callbacks() {
				return queued.length;
			},
			step() {
				if (queued.length !== 1)
					throw new Error("Expected one animation chain");
				queued.shift()(0);
			}
		};
	});
	await page.goto(url, { waitUntil: "load" });
	const complete = resource.role === "reference" || kind === "edited";
	if (!complete) {
		assert.equal(await page.$("canvas"), null);
		const state = await page.evaluate(() => ({
			randomCalls: window.__circleTest.randomCalls,
			callbacks: window.__circleTest.callbacks
		}));
		assert.deepEqual(state, { randomCalls: 0, callbacks: 0 });
		return { complete: false, originalStarterUnfinished: true, state };
	}
	await page.waitForSelector("#canvas");
	const step = kind === "edited" ? 2 : 1;
	const radius = kind === "edited" ? 7 : 5;
	const evidence = await page.evaluate(
		({ step, radius }) => {
			const canvas = document.getElementById("canvas");
			const ctx = canvas.getContext("2d");
			// eslint-disable-next-line no-undef -- Read the original script\'s global lexical array in the real page.
			const sourceCircles = circles;
			if (
				!(canvas instanceof HTMLCanvasElement)
				|| !(ctx instanceof CanvasRenderingContext2D)
			) {
				throw new TypeError("Native Canvas is required");
			}
			if (
				canvas.width !== 500
				|| canvas.height !== 200
				|| sourceCircles.length !== 250
			) {
				throw new Error("Incorrect drawing resolution or circle count");
			}
			const wrap = (value, limit) => ((value - 1) % limit) + 1;
			let pixelChecks = 0;
			let positionChecks = 0;
			const boundaries = [];
			for (let frame = 1; frame <= 1001; frame++) {
				if (frame > 1) window.__circleTest.step();
				if (
					window.__circleTest.callbacks !== 1
					|| window.__circleTest.randomCalls !== 750
				) {
					throw new Error(
						"Animation chain or per-circle color assignment changed"
					);
				}
				for (let index = 0; index < 250; index++) {
					const x = wrap(
						Math.floor(index / 10) * 20 + step * frame,
						500
					);
					const y = wrap((index % 10) * 20 + step * frame, 200);
					const circle = sourceCircles[index];
					const color = [0, 1, 2].map(
						channel => ((index * 3 + channel) * 73) % 256
					);
					if (
						circle.x !== x
						|| circle.y !== y
						|| circle.radius !== radius
						|| circle.color !== `rgb(${color.join(",")})`
					) {
						throw new Error(
							`Frame ${
								frame
							}, circle ${
								index
							}: object changed`
						);
					}
					positionChecks++;
					const pixel = [
						...ctx.getImageData(
							Math.min(x, 499),
							Math.min(y, 199),
							1,
							1
						).data
					];
					if (
						pixel.some(
							(value, channel) =>
								value !== [...color, 255][channel]
						)
					) {
						throw new Error(
							`Frame ${
								frame
							}, circle ${
								index
							}: native paint ${
								pixel}`
						);
					}
					pixelChecks++;
				}
				// The grid's ten-pixel gaps remain clear even after the previous frame.
				const first = sourceCircles[0];
				const gapX = ((first.x + 10 - 1) % 500) + 1;
				const gapY = ((first.y + 10 - 1) % 200) + 1;
				if (
					ctx.getImageData(
						Math.min(gapX, 499),
						Math.min(gapY, 199),
						1,
						1
					).data[3] !== 0
				) {
					throw new Error("Previous frame was not cleared");
				}
				if (
					[
						1,
						20,
						21,
						100,
						101,
						200,
						201,
						250,
						251,
						500,
						501,
						1000,
						1001
					].includes(frame)
				) {
					boundaries.push({
						frame,
						first: { ...sourceCircles[0] },
						last: { ...sourceCircles[249] }
					});
				}
			}
			return {
				complete: true,
				nativeCanvasPaint: true,
				frames: 1001,
				pixelChecks,
				positionChecks,
				radius,
				step,
				boundaries,
				randomCalls: window.__circleTest.randomCalls,
				animationCallbacks: window.__circleTest.callbacks
			};
		},
		{ step, radius }
	);
	assert.equal(evidence.pixelChecks, 250250);
	assert.equal(evidence.positionChecks, 250250);
	assert.equal(
		await page.title(),
		kind === "edited" ? "Saved Circle March" : "Circle March reference"
	);
	return { ...evidence, editedOutputVerified: kind === "edited" };
}
