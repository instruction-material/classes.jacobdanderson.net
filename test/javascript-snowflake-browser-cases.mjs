import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-snowflake-sources.json", import.meta.url), "utf8"));
export function editedSnowflakeSource(resource, filename) {
	const reference = fixture.resources.find(row => row.role === "reference");
	const file = reference.files.find(row => row.name === filename);
	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${file.path}`, import.meta.url), "utf8");
	if (filename === "index.html") return source.replace("class=\"board\"", "class=\"board\" data-saved-grid=\"true\"");
	if (filename === "styles.css") return `${source}\n.board { outline: 1px solid #444; }\n`;
	return source;
}
export async function inspectSnowflake(page, resource, kind) {
	await page.evaluate(() => document.fonts.ready);
	const state = await page.evaluate(() => {
		const board = document.querySelector(".board");
		const tiles = [...document.querySelectorAll(".tile")];
		const rect = board?.getBoundingClientRect();
		return { tiles: tiles.length, rows: Array.from({ length: 8 }, (_, row) => tiles.slice(row * 8, row * 8 + 8).map(tile => tile.textContent.trim() === "ac_unit" ? "#" : ".").join("")), icons: document.querySelectorAll(".tile .material-icons").length, fits: document.documentElement.scrollWidth <= innerWidth, board: rect ? { width: rect.width, height: rect.height, left: rect.left, right: rect.right } : null, grid: board ? getComputedStyle(board).display : null, fontReady: document.fonts.check("16px \"Material Icons\""), saved: board?.getAttribute("data-saved-grid") === "true", outline: board ? getComputedStyle(board).outlineStyle : null };
	});
	assert.ok(state.fits);
	if (resource.role === "starter" && kind === "exact") {
		assert.equal(state.tiles, 0);
	}
	else {
		assert.equal(state.tiles, 64);
		assert.equal(state.icons, 34);
		assert.deepEqual(state.rows, fixture.targetRows);
		assert.equal(state.grid, "grid");
		assert.ok(state.fontReady);
		assert.ok(Math.abs(state.board.width - state.board.height) < 1);
		assert.ok(state.board.left >= 0 && state.board.right <= (await page.viewport()).width + 1);
		if (kind === "edited") {
			assert.ok(state.saved);
			assert.equal(state.outline, "solid");
		}
	}
	return state;
}
