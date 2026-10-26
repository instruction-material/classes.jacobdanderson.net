import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-nested-loops-sources.json", import.meta.url), "utf8"));

export function editedNestedLoopsSource(resource) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	let source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${reference.files.find(file => file.name === "script.js").path}`, import.meta.url), "utf8");
	const substitutions = {
		"multiplication-tables": ["i <= 10", "i <= 9"],
		"pattern-production": ["i < 6", "i < 4"],
		"armstrong-numbers": ["i = 100", "i = 200"],
		"archery-simulator": ["numRounds = 5", "numRounds = 4"],
		"tower-of-boxes": ["i < 4", "i < 3"],
		"shield-debugging": ["i < 10", "i < 4"]
	};
	const [before, after] = substitutions[resource.project];
	assert.ok(source.includes(before));
	source = source.replaceAll(before, after);
	return source;
}

export async function inspectNestedLoops(page, resource, kind) {
	const state = await page.evaluate(() => {
		const all = selector => [...document.querySelectorAll(selector)];
		const svgs = all("svg");
		const bounds = (node) => {
			const box = node.getBoundingClientRect();
			return { x: box.x, y: box.y, right: box.right, bottom: box.bottom, width: box.width, height: box.height };
		};
		return {
			viewportWidth: innerWidth,
			noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
			lines: all("pre").map(node => node.textContent),
			lineBounds: all("pre").map(bounds),
			canvases: svgs.map(node => ({ ...bounds(node), viewBox: node.getAttribute("viewBox"), role: node.getAttribute("role"), label: node.getAttribute("aria-label") })),
			circles: all("circle").map(node => ["cx", "cy", "r", "fill"].map(name => node.getAttribute(name))),
			paths: all("path").map(node => ["transform", "fill", "d"].map(name => node.getAttribute(name))),
			shapeBounds: all("circle,path").map(bounds)
		};
	});
	assert.ok(state.noHorizontalOverflow);
	for (const line of state.lineBounds) assert.ok(line.x >= 0 && line.right <= state.viewportWidth + 1);
	const unfinished = resource.role === "starter" && kind === "exact";
	if (unfinished) {
		assert.deepEqual(state.lines, []);
		assert.equal(state.circles.length + state.paths.length, 0);
		assert.equal(state.canvases.length, resource.project === "shield-debugging" ? 1 : 0);
		return state;
	}
	const edited = kind === "edited";
	if (resource.project === "multiplication-tables") {
		assert.ok(state.lineBounds.every(line => line.height <= 24.5), "All ten products must stay on one visible row");
		assert.deepEqual(state.lines.map(line => line.trim().split(/\s+/u).map(Number)), Array.from({ length: edited ? 9 : 10 }, (_, row) => Array.from({ length: 10 }, (_, col) => (row + 1) * (col + 1))));
	}
	else if (resource.project === "armstrong-numbers") {
		assert.deepEqual(state.lines, edited ? ["370", "371", "407"] : ["153", "370", "371", "407"]);
	}
	else if (resource.project === "archery-simulator") {
		const rounds = edited ? 4 : 5;
		assert.equal(state.lines.length, rounds * 3 + 2);
		const shots = state.lines.slice(1, -1);
		shots.forEach((line, index) => assert.match(line, new RegExp(`^Round ${Math.floor(index / 3) + 1}, arrow ${index % 3 + 1}: [XO]$`, "u")));
		assert.equal(state.lines.at(-1), `Total arrows hit: ${shots.filter(line => line.endsWith(": X")).length}`);
	}
	else if (resource.project === "tower-of-boxes") {
		const expected = [];
		for (let size = 3; size <= (edited ? 5 : 6); size++) expected.push("#".repeat(size), ...Array.from({ length: size - 2 }, () => `#${"_".repeat(size - 2)}#`), "#".repeat(size), "");
		assert.deepEqual(state.lines, expected);
	}
	else {
		const shield = resource.project === "shield-debugging";
		const rows = shield ? edited ? 3 : 9 : edited ? 3 : 5;
		const count = rows * (rows + 1) / 2;
		assert.equal(state.canvases.length, 1);
		const canvas = state.canvases[0];
		assert.equal(canvas.viewBox, shield ? "0 0 2000 2000" : "0 0 800 850");
		assert.equal(canvas.role, "img");
		assert.ok(canvas.label);
		assert.ok(canvas.width > 0 && canvas.height > 0 && canvas.right <= state.viewportWidth + 1);
		assert.equal(state.paths.length, count);
		assert.equal(state.circles.length, shield ? count * 4 : 0);
		if (!shield) assert.deepEqual(state.lines, Array.from({ length: rows }, (_, row) => "*".repeat(row + 1)));
		let index = 0;
		for (let row = 1; row <= rows; row++) {
			for (let column = 0; column < row; column++, index++) {
				const x = shield ? 200 + column * 210 : 100 + column * 150;
				const y = shield ? row * 210 : row * 150;
				assert.equal(state.paths[index][0], `translate(${x},${y})`);
				assert.equal(state.paths[index][1], shield ? "white" : "yellow");
				assert.ok(state.paths[index][2]?.length && !/NaN|Infinity/u.test(state.paths[index][2]));
				if (shield) assert.deepEqual(state.circles.slice(index * 4, index * 4 + 4), [[String(x), String(y), "110", "red"], [String(x), String(y), "90", "white"], [String(x), String(y), "70", "red"], [String(x), String(y), "50", "blue"]]);
			}
		}
		for (const shape of state.shapeBounds) {
			assert.ok(Object.values(shape).every(Number.isFinite));
			assert.ok(shape.x >= canvas.x - 1 && shape.right <= canvas.right + 1 && shape.y >= canvas.y - 1 && shape.bottom <= canvas.bottom + 1);
		}
	}
	return state;
}
