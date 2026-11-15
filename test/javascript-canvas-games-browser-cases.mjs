/* global game, keys, canvas */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-canvas-games-sources.json", import.meta.url), "utf8"));

export function editedCanvasGameSource(resource, filename) {
	const source = fixture.files[resource.project][resource.role][filename];
	if (filename === "index.html") return source.replace(`<h1>${resource.title}</h1>`, `<h1>Saved ${resource.title}</h1>`);
	if (filename === "styles.css") return `${source}\ncanvas { outline: 3px solid #334155; }\n`;
	if (filename === "script.js") {
		const complete = fixture.files[resource.project].reference[filename];
		return resource.project === "falling-skies"
			? complete.replace("'blue'", "'purple'")
			: resource.project === "breakout"
				? complete.replaceAll("#0095DD", "#7c3aed")
				: resource.project === "asteroids"
					? complete.replaceAll("'black'", "'purple'")
					: complete.replace("#ffffff", "#ffff00");
	}
}

export async function inspectCanvasGame(page, resource, kind, url, width) {
	const complete = resource.role === "reference" || kind === "edited";
	await page.goto(url, { waitUntil: "load" });
	await page.waitForSelector("canvas");
	const project = resource.project;
	const expectedColor = project === "falling-skies"
		? (kind === "edited" ? [128, 0, 128] : [0, 0, 255])
		: project === "breakout"
			? (kind === "edited" ? [124, 58, 237] : [0, 149, 221])
			: project === "asteroids"
				? (kind === "edited" ? [128, 0, 128] : [0, 0, 0])
				: (kind === "edited" ? [255, 255, 0] : [255, 255, 255]);
	const paint = await page.$eval("canvas", (canvas, color) => {
		const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
		let count = 0;
		for (let i = 0; i < pixels.length; i += 4) {
			if (pixels[i] === color[0] && pixels[i + 1] === color[1] && pixels[i + 2] === color[2] && pixels[i + 3] > 200) count++;
		}
		return { count, width: canvas.width, height: canvas.height };
	}, expectedColor);
	assert.ok(paint.count > 30, `${project}: required paint ${JSON.stringify(paint)}`);
	assert.equal(paint.width, project === "breakout" ? 480 : 550);
	assert.equal(paint.height, project === "breakout" ? 320 : 500);
	let behavior;
	if (!complete) {
		const initial = await page.evaluate(() => JSON.stringify(game));
		await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
		assert.equal(await page.evaluate(() => JSON.stringify(game)), initial);
		behavior = { suppliedStaticStarter: true };
	}
	else if (project === "falling-skies") {
		await page.keyboard.down("ArrowLeft");
		await page.waitForFunction(() => game.x === 0);
		await page.keyboard.up("ArrowLeft");
		await page.keyboard.down("ArrowRight");
		await page.waitForFunction(() => game.x === 520);
		await page.evaluate(() => window.dispatchEvent(new Event("blur")));
		assert.ok(await page.evaluate(() => Object.values(keys).every(value => value === false)));
		await page.keyboard.up("ArrowRight");
		await page.click("#restart");
		await page.waitForFunction(() => game.status === "lost", { timeout: 10000 });
		assert.match(await page.$eval("[role=status]", e => e.textContent), /You Lose/);
		const lost = await page.evaluate(() => JSON.stringify(game));
		await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
		assert.equal(await page.evaluate(() => JSON.stringify(game)), lost);
		await page.click("#restart");
		assert.equal(await page.evaluate(() => game.score), 0);
		behavior = { naturalCountdownAndCollision: true, keyboardBounds: true, focusRelease: true, stoppedAndRestarted: true };
	}
	else if (project === "breakout") {
		const bounds = await page.$eval("canvas", (e) => {
			const r = e.getBoundingClientRect();
			return { left: r.left, top: r.top, width: r.width, height: r.height };
		});
		await page.mouse.move(bounds.left + 1, bounds.top + bounds.height / 2);
		assert.equal(await page.evaluate(() => game.paddleX), 0);
		await page.mouse.move(bounds.left + bounds.width - 1, bounds.top + bounds.height / 2);
		assert.equal(await page.evaluate(() => game.paddleX), 405);
		for (let lives = 2; lives >= 0; lives--) {
			await page.evaluate(() => Object.assign(game, { x: 20, y: 332, dx: 0, dy: 3, paddleX: 400 }));
			await page.waitForFunction(expected => game.lives === expected, {}, lives);
		}
		assert.equal(await page.evaluate(() => game.status), "lost");
		assert.equal(await page.$eval("[role=status]", e => e.textContent), "GAME OVER");
		const lost = await page.evaluate(() => JSON.stringify(game));
		await page.keyboard.down("ArrowLeft");
		await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
		await page.keyboard.up("ArrowLeft");
		assert.equal(await page.evaluate(() => JSON.stringify(game)), lost);
		await page.click("#restart");
		await page.evaluate(() => {
			game.bricks.forEach(b => b.alive = false);
			game.bricks[0].alive = true;
			Object.assign(game, { score: 14, x: 40, y: 61, dx: 0, dy: -2 });
		});
		await page.waitForFunction(() => game.status === "won");
		assert.equal(await page.$eval("[role=status]", e => e.textContent), "YOU WIN, CONGRATS!");
		behavior = { pointerScaleAndBounds: true, configuredThreeMissesAndFinalBrick: true, stableLossAndWin: true, naturalFullGameClaimed: false };
	}
	else if (project === "asteroids") {
		await page.keyboard.down("w");
		await page.waitForFunction(() => game.player.y < 95);
		await page.keyboard.up("w");
		await page.keyboard.down("d");
		await page.waitForFunction(() => game.player.angle >= 15);
		await page.keyboard.up("d");
		await page.click("#restart");
		await page.evaluate(() => {
			game.circles = [{ x: 100, y: 20, radius: 50, heading: 90 }];
		});
		await page.keyboard.down("f");
		await page.waitForFunction(() => game.score === 1);
		await page.keyboard.up("f");
		assert.deepEqual(await page.evaluate(() => game.circles.map(c => c.radius)), [25, 25]);
		await page.evaluate(() => {
			game.circles = [{ x: game.player.x, y: game.player.y, radius: 50, heading: 0 }];
		});
		await page.waitForFunction(() => game.status === "lost");
		const lost = await page.evaluate(() => JSON.stringify(game));
		await page.keyboard.down(" ");
		await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
		await page.keyboard.up(" ");
		assert.equal(await page.evaluate(() => JSON.stringify(game)), lost);
		await page.click("#restart");
		assert.equal(await page.evaluate(() => game.circles.length), 0);
		behavior = { keyboardThrustAndRotation: true, actualShotAtConfiguredAsteroid: true, splitScoredOnce: true, configuredDeathFreezesAllSystems: true, restarted: true };
	}
	else {
		const initial = await page.evaluate(() => game.stars[0].y);
		await page.waitForFunction(y => game.stars[0].y !== y, {}, initial);
		await page.setViewport({ width: width === 390 ? 430 : 1100, height: 800 });
		await page.waitForFunction(() => game.width === canvas.width && game.height === canvas.height && game.width !== 550);
		assert.equal(await page.evaluate(() => game.stars.length), 100);
		assert.ok(await page.evaluate(() => game.stars.every(s => s.x >= 0 && s.x <= game.width && s.y >= 0 && s.y <= game.height)));
		await page.click("#restart");
		assert.equal(await page.evaluate(() => game.stars.length), 100);
		behavior = { naturalMotion: true, actualViewportResize: true, densityPreserved: true, restarted: true };
	}
	assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
	if (kind === "edited") {
		assert.equal(await page.$eval("h1", e => e.textContent), `Saved ${resource.title}`);
		assert.equal(await page.$eval("canvas", e => getComputedStyle(e).outlineWidth), "3px");
	}
	return { complete, paint, behavior };
}
