import assert from "node:assert/strict";

import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-animation-sources.json", import.meta.url), "utf8"));

export const editedColor = "#7c3aed";

export function editedAnimationSource(resource) {
	const reference = fixture.resources.find(r => r.project === resource.project && r.role === "reference") ?? resource;

	const file = reference.files.find(f => f.name === "script.js");

	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${file.path}`, import.meta.url), "utf8");

	const color = ["car", "moving-car-example"].includes(resource.project)
		? "#ff2800"
		: ["bouncing-ball", "bouncing-and-growing"].includes(resource.project)
				? "steelblue"
				: resource.project === "dom-events-example" ? "pink" : "red";

	assert.ok(source.includes(`"${color}"`));

	return source.replace(`"${color}"`, `"${editedColor}"`);
}
const colorValue = (name, edited) => edited ? "rgb(124, 58, 237)" : name;

const readCircle = page => page.$eval("circle", n => ({ x: +n.getAttribute("cx"), y: +n.getAttribute("cy"), r: +n.getAttribute("r"), fill: getComputedStyle(n).fill }));

async function radius(page, target) {
	await page.waitForFunction(r => Math.abs(+document.querySelector("circle").getAttribute("r") - r) < 0.01, { timeout: 2000 }, target);

	assert.ok(Math.abs((await readCircle(page)).r - target) < 0.01);
}
export async function inspectAnimation(page, resource, kind, reducedMotion = false) {
	const state = await page.evaluate(() => ({
		noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
		version: globalThis.d3.version,
		svgCount: document.querySelectorAll("svg").length,
		viewBox: document.querySelector("svg")?.getAttribute("viewBox")
	}));

	assert.ok(state.noHorizontalOverflow);

	assert.equal(state.version, "7.9.0");

	const edited = kind === "edited";

	if (resource.role === "starter" && resource.kind !== "example" && !edited) {
		assert.equal(state.svgCount, 0);

		if (resource.project === "rainbow") {
			const radians = await page.evaluate(() => [0, 90, -60, 180].map(globalThis.degreesToRadians));

			[0, Math.PI / 2, -Math.PI / 3, Math.PI].forEach((n, i) => assert.ok(Math.abs(n - radians[i]) < 1e-12));
		}
		return state;
	}
	assert.equal(state.svgCount, 1);

	if (["car", "moving-car-example"].includes(resource.project)) {
		assert.equal(state.viewBox, resource.project === "car" ? "0 0 800 500" : "0 0 1400 500");

		const shapes = await page.evaluate(() => [...document.querySelectorAll("svg circle,svg rect,svg line")].map(n => ({ tag: n.tagName, x: n.getAttribute("cx"), y: n.getAttribute("cy"), r: n.getAttribute("r"), fill: getComputedStyle(n).fill })));

		assert.equal(shapes.length, 9);

		assert.deepEqual(shapes.slice(0, 4).map(n => [n.x, n.y, n.r]), [["125", "375", "50"], ["125", "375", "40"], ["375", "375", "50"], ["375", "375", "40"]]);

		assert.equal(shapes[4].fill, colorValue("rgb(255, 40, 0)", edited));

		if (resource.project === "moving-car-example") {
			if (!reducedMotion) {
				await page.waitForFunction(() => {
					const x = document.querySelector("circle").transform.baseVal.consolidate()?.matrix.e ?? 0;
					return x > 1 && x < 699;
				}, { timeout: 2000 });
			}
			await page.waitForFunction(() => [...document.querySelectorAll("svg > *")].every(n => Math.abs((n.transform.baseVal.consolidate()?.matrix.e ?? 0) - 700) < 0.01), { timeout: 2500 });

			state.allNinePartsTranslated = 700;
		}
	}
	else if (["bouncing-ball", "bouncing-and-growing"].includes(resource.project)) {
		const growing = resource.project === "bouncing-and-growing";

		assert.equal(state.viewBox, growing ? "0 0 1000 500" : "0 0 960 500");

		const start = await readCircle(page);

		assert.equal(start.y, growing ? 100 : 250);

		assert.equal(start.fill, colorValue("rgb(70, 130, 180)", edited));

		if (reducedMotion) {
			assert.equal(start.x, 40);
			assert.equal(start.r, 20);

			await new Promise(resolve => setTimeout(resolve, 80));

			assert.deepEqual(await readCircle(page), start);
		}
		else {
			assert.ok(start.x >= 40 && start.x < 100);

			await page.waitForFunction(() => {
				const x = +document.querySelector("circle").getAttribute("cx");
				return x > 100 && x < 400;
			}, { timeout: 1800 });

			const intermediate = await readCircle(page);

			await page.waitForFunction(target => +document.querySelector("circle").getAttribute("cx") >= target, { timeout: 2500 }, growing ? 498 : 915);

			const far = await readCircle(page);

			assert.ok(Math.abs(far.r - (growing ? 40 : 20)) < 0.2);

			await page.waitForFunction(() => Math.abs(+document.querySelector("circle").getAttribute("cx") - 40) < 0.01, { timeout: 3000 });

			const end = await readCircle(page);
			assert.equal(end.y, start.y);
			assert.ok(Math.abs(end.r - 20) < 0.01);

			state.travel = { start, intermediate, far, end };
		}
	}
	else if (resource.project === "growing-ball") {
		assert.equal(state.viewBox, "0 0 750 750");

		assert.deepEqual(await readCircle(page), { x: 200, y: 200, r: 110, fill: colorValue("rgb(255, 0, 0)", edited) });

		await page.focus("button");
		await page.keyboard.press("Enter");
		await radius(page, 200);

		assert.equal(await page.$eval("button", n => n.textContent), "Shrink ball");

		await page.keyboard.press("Space");
		await radius(page, 110);

		await page.hover("circle");
		await radius(page, 200);

		await page.mouse.move(1, 899);
		await radius(page, 110);

		await page.hover("circle");
		await page.mouse.move(1, 899);
		await page.hover("circle");
		await page.mouse.move(1, 899);
		await radius(page, 110);

		if (page.viewport().hasTouch) {
			await page.tap("button");
			await radius(page, 200);
			await page.tap("button");
			await radius(page, 110);
		}
		const end = await readCircle(page);
		assert.equal(end.x, 200);
		assert.equal(end.y, 200);

		state.keyboardPointerRapidAndTouchResizing = true;
	}
	else if (resource.project === "dom-events-example") {
		assert.equal(state.viewBox, "0 0 750 750");

		const target = colorValue("rgb(255, 192, 203)", edited);

		const filled = async () => {
			await page.waitForFunction(color => getComputedStyle(document.querySelector("rect")).fill === color, { timeout: 2000 }, target);
		};

		await page.keyboard.press("Tab");
		assert.ok(await page.$eval("rect", n => document.activeElement === n));
		await page.keyboard.press("Enter");
		await filled();

		await page.reload({ waitUntil: "load" });
		await page.keyboard.press("Tab");
		assert.ok(await page.$eval("rect", n => document.activeElement === n));
		await page.keyboard.press("Space");
		await filled();

		await page.reload({ waitUntil: "load" });
		await page.click("rect");
		await filled();
		await page.click("rect");
		await filled();

		if (page.viewport().hasTouch) {
			await page.reload({ waitUntil: "load" });
			await page.tap("rect");
			await filled();
		}
		state.keyboardClickAndTouchColor = target;
	}
	else {
		assert.equal(resource.project, "rainbow");
		assert.equal(state.viewBox, "0 0 800 450");

		const reveal = await page.evaluate(async (reduce) => {
			const paths = [...document.querySelectorAll("svg path")];
			const seen = Array.from({ length: 6 }).fill(null);
			const start = performance.now();

			await new Promise((resolve, reject) => {
				const check = () => {
					paths.forEach((p, i) => {
						if (+getComputedStyle(p).opacity > 0 && seen[i] === null)seen[i] = performance.now() - start;
					});
					if (paths.every(p => +getComputedStyle(p).opacity === 1))resolve();
					else if (performance.now() - start > 2500)reject(new Error("Rainbow did not finish"));
					else requestAnimationFrame(check);
				};
				check();
			});

			return { reduced: reduce, firstVisibleMs: seen, paths: paths.map(p => ({ d: p.getAttribute("d"), fill: getComputedStyle(p).fill, opacity: +getComputedStyle(p).opacity })), center: document.querySelector("svg g").getAttribute("transform") };
		}, reducedMotion);

		assert.equal(reveal.paths.length, 6);
		assert.equal(reveal.center, "translate(300,300)");

		const colors = [colorValue("rgb(255, 0, 0)", edited), "rgb(255, 165, 0)", "rgb(255, 255, 0)", "rgb(0, 128, 0)", "rgb(0, 0, 255)", "rgb(238, 130, 238)"];

		reveal.paths.forEach((p, i) => {
			const outer = 300 - i * 20;
			assert.ok(p.d.includes(`A${outer},${outer},`) && p.d.includes(`A${outer - 20},${outer - 20},`));
			const point = p.d.slice(1).split("A")[0].split(",").map(Number);
			assert.ok(Math.abs(point[0] + outer * Math.sqrt(3) / 2) < 0.001);
			assert.ok(Math.abs(point[1] + outer / 2) < 0.001);
			assert.equal(p.fill, colors[i]);
			assert.equal(p.opacity, 1);
			if (!reducedMotion && i)assert.ok(reveal.firstVisibleMs[i] - reveal.firstVisibleMs[i - 1] > 80);
		});

		state.reveal = reveal;
	}
	assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

	return state;
}
