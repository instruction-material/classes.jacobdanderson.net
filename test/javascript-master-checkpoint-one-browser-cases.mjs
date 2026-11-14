import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-master-checkpoint-one-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
export function editedCheckpointOneSource(resource, name) {
	const reference = fixture.files[resource.project].reference[name];
	if (name === "index.html") {
		return reference.replace(
			`<h1>${resource.title}</h1>`,
			`<h1>Saved ${resource.title}</h1>`
		);
	}
	if (name === "styles.css")
		return `${reference}\nmain { outline:3px solid #334155; }\n`;
	if (name.endsWith(".js"))
		return `${reference}\n// Saved completed checkpoint task.\n`;
	return undefined;
}
export async function inspectCheckpointOne(page, resource, kind, url, width) {
	const complete = resource.role === "reference" || kind === "edited";
	await page.goto(url, { waitUntil: "load" });
	assert.equal(
		await page.$eval("h1", e => e.textContent),
		(kind === "edited" ? "Saved " : "") + resource.title
	);
	let result;
	if (resource.project === "master-checkpoint-one") {
		await page.click("#functions");
		if (!complete) {
			await page.waitForFunction(() =>
				document
					.querySelector("#status")
					.textContent
					.includes("Complete rollDie")
			);
			assert.equal(
				await page.$eval("#function-results", e => e.textContent),
				""
			);
			result = { starterExplained: true };
		}
		else {
			await page.waitForFunction(() =>
				document
					.querySelector("#function-results")
					.textContent
					.includes("Sixes:")
			);
			await page.click("#arrays");
			await page.click("#cards");
			result = await page.evaluate(() => {
				const f = window.CheckInOne;
				const original = [1, 2, 3, 4, 5, 6];
				const doubled = f.doubleResults(original);
				return {
					bounds: [f.rollDie(() => 0), f.rollDie(() => 0.999999)],
					messages: [
						[4, 5],
						[4, 6],
						[6, 6]
					].map(v => f.playJackpot(...v)),
					sum: f.sum(2, 3),
					odd: [-3, 0, 2, 3].map(n => f.isOdd(n)),
					original,
					doubled,
					even: f.countEvenRolls(original),
					empty: [f.countEvenRolls([]), f.doubleResults([])],
					cards: f.createCards(() => 0),
					upperCards: f.createCards(() => 0.999999),
					car: f.createCar(),
					functionText:
						document.querySelector("#function-results").textContent,
					arrayText:
						document.querySelector("#array-results").textContent,
					cardText: [
						...document.querySelectorAll("#card-results li")
					].map(e => e.textContent),
					canvas: [
						document.querySelector("#canvas").width,
						document.querySelector("#canvas").height
					]
				};
			});
			assert.deepEqual(result.bounds, [1, 6]);
			assert.deepEqual(result.messages, [
				"Better luck next time!",
				"Jackpot!",
				"Jackpot!"
			]);
			assert.equal(result.sum, 5);
			assert.deepEqual(result.odd, [true, false, false, true]);
			assert.deepEqual(result.original, [1, 2, 3, 4, 5, 6]);
			assert.deepEqual(result.doubled, [2, 4, 6, 8, 10, 12]);
			assert.equal(result.even, 3);
			assert.deepEqual(result.empty, [0, []]);
			assert.deepEqual(result.canvas, [1200, 1200]);
			assert.equal(result.car.year, 1999);
			assert.equal(result.cards.length, 4);
			assert.ok(result.cards.every(c => c.text === 1));
			assert.ok(result.upperCards.every(c => c.text === 100));
			assert.deepEqual(
				result.cards.map(c => [c.x, c.y, c.width, c.height]),
				[
					[50, 0, 200, 100],
					[50, 150, 200, 100],
					[50, 300, 200, 100],
					[50, 450, 200, 100]
				]
			);
			const rolls = result.functionText.match(
				/^100 rolls: (.+)\nSixes: (\d+)/
			);
			assert.ok(rolls);
			const values = rolls[1].split(", ").map(Number);
			assert.equal(values.length, 100);
			assert.ok(
				values.every(n => Number.isInteger(n) && n >= 1 && n <= 6)
			);
			assert.equal(values.filter(n => n === 6).length, Number(rolls[2]));
			assert.equal(result.cardText.length, 4);
			const pixel = await page.$eval("#canvas", canvas => [
				...canvas.getContext("2d").getImageData(60, 10, 1, 1).data
			]);
			assert.ok(pixel[2] > 0 && pixel[3] > 0);
			const fallback = await page.evaluate(() => {
				const original = HTMLCanvasElement.prototype.getContext;
				HTMLCanvasElement.prototype.getContext = () => null;
				try {
					document.querySelector("#cards").click();
					return {
						text: document.querySelectorAll("#card-results li")
							.length,
						status: document.querySelector("#status").textContent
					};
				}
				finally {
					HTMLCanvasElement.prototype.getContext = original;
				}
			});
			assert.deepEqual(fallback, { text: 4, status: "" });
			result.canvasPixel = pixel;
			result.canvasUnavailableText = true;
		}
	}
	else {
		await page.click("#once");
		if (!complete) {
			await page.waitForFunction(() =>
				document
					.querySelector("#status")
					.textContent
					.includes("Complete createBoard")
			);
			result = { starterExplained: true };
		}
		else {
			result = await page.evaluate(() => {
				const f = window.ShapeBoard;
				const circles = f.createBoard(() => 0);
				const squares = f.createBoard(() => 0.75);
				let n = 0;
				const mixed = f.createBoard(() => (n++ % 2 ? 0.75 : 0));
				return {
					circles,
					squares,
					matches: [
						f.boardComplete(circles),
						f.boardComplete(squares),
						f.boardComplete(mixed),
						f.boardComplete([]),
						f.boardComplete(circles.slice(0, 8)),
						f.boardComplete(
							Array.from({ length: 9 }, () => ({
								type: "triangle"
							}))
						)
					]
				};
			});
			assert.deepEqual(result.matches, [
				true,
				true,
				false,
				false,
				false,
				false
			]);
			assert.equal(result.circles.length, 9);
			assert.deepEqual(result.circles[8], {
				type: "circle",
				x: 120,
				y: 120,
				radius: 20,
				color: "green"
			});
			assert.deepEqual(result.squares[8], {
				type: "square",
				x: 100,
				y: 100,
				length: 40,
				color: "red"
			});
			const controller = await page.evaluate(() => {
				const f = window.ShapeBoard;
				const create = f.createBoard;
				const raf = window.requestAnimationFrame;
				const caf = window.cancelAnimationFrame;
				const frames = new Map();
				let id = 0;
				window.requestAnimationFrame = (fn) => {
					frames.set(++id, fn);
					return id;
				};
				window.cancelAnimationFrame = id => frames.delete(id);
				try {
					f.createBoard = () => {
						let n = 0;
						return create(() => (n++ % 2 ? 0.75 : 0));
					};
					const click = id => document.querySelector(id).click();
					click("#start");
					let callbacks = 0;
					while (frames.size) {
						const [id, callback] = frames.entries().next().value;
						frames.delete(id);
						callback();
						if (++callbacks > 2000)
							throw new Error("Unbounded board");
					}
					const limit = document.querySelector("#status").textContent;
					click("#start");
					click("#stop");
					const stopped = {
						pending: frames.size,
						text: document.querySelector("#status").textContent
					};
					click("#start");
					click("#once");
					const onePending = frames.size;
					f.createBoard = () => create(() => 0);
					click("#start");
					return {
						limit,
						callbacks,
						stopped,
						onePending,
						match: document.querySelector("#status").textContent,
						pending: frames.size,
						cells: document.querySelectorAll("#board-results li")
							.length,
						declaredState: window.board === undefined
					};
				}
				finally {
					f.createBoard = create;
					window.requestAnimationFrame = raf;
					window.cancelAnimationFrame = caf;
				}
			});
			assert.equal(
				controller.limit,
				"Stopped at 2000 attempts without a match."
			);
			assert.equal(controller.callbacks, 1999);
			assert.deepEqual(controller.stopped, {
				pending: 0,
				text: "Stopped after 1 attempt(s)."
			});
			assert.equal(controller.onePending, 0);
			assert.equal(controller.match, "Match after 1 attempt(s).");
			assert.equal(controller.pending, 0);
			assert.equal(controller.cells, 9);
			assert.ok(controller.declaredState);
			const pixel = await page.$eval("#canvas", canvas => [
				...canvas.getContext("2d").getImageData(20, 20, 1, 1).data
			]);
			assert.ok(pixel[1] > 0 && pixel[3] > 0);
			result.controller = controller;
			result.canvasPixel = pixel;
		}
	}
	assert.ok(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth + 1
		),
		`${width}px no horizontal overflow`
	);
	return { complete, ...result };
}
