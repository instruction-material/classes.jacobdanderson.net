import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-checkpoint-sources.json", import.meta.url), "utf8"));
export function editedCheckpointSource(resource, filename) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	const file = reference.files.find(row => row.name === filename);
	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${file.path}`, import.meta.url), "utf8");
	if (filename === "index.html") return source.replace("<main>", "<main data-saved-checkpoint=\"true\">");
	if (filename === "styles.css") return `${source}\nmain { outline: 2px solid #173b80; }\n`;
	return source;
}
async function playGolfCase(page, guesses, randoms) {
	const answers = [...guesses];
	const alerts = [];
	let prompts = 0;
	const onDialog = async (dialog) => {
		if (dialog.type() === "prompt") {
			prompts++;
			assert.ok(answers.length, "Unexpected extra guess prompt");
			const answer = answers.shift();
			if (answer === null) await dialog.dismiss();
			else await dialog.accept(answer);
		}
		else {
			alerts.push(dialog.message());
			await dialog.accept();
		}
	};
	page.on("dialog", onDialog);
	try {
		await page.evaluate((values) => {
			const queue = [...values];
			Math.random = () => {
				if (!queue.length) throw new Error("Extra secret chosen");
				return queue.shift();
			};
		}, randoms);
		await page.click("#start");
		return { prompts, alerts, remaining: answers.length, output: await page.$$eval("#output li", nodes => nodes.map(node => node.textContent)) };
	}
	finally { page.off("dialog", onDialog); }
}
export async function inspectCheckpoint(page, resource, kind) {
	const solved = resource.role === "reference" || kind === "edited";
	let result;
	if (resource.project === "guessing-golf") {
		if (!solved) {
			await page.click("#start");
			result = { starter: await page.$eval("#output", el => el.textContent) };
			assert.match(result.starter, /Implement the three rounds/);
		}
		else {
			const scoring = await playGolfCase(page, ["0", "1", "2", "10", "8", "14", "19", "0", "10"], [0, 0.5, 0.999999]);
			assert.equal(scoring.prompts, 9);
			assert.equal(scoring.remaining, 0);
			assert.equal(scoring.output.at(-1), "Final total: 37. Lower scores are better.");
			const invalid = await playGolfCase(page, ["", "bad", "1.5", "-1", "20", "0", null], [0]);
			assert.equal(invalid.prompts, 7);
			assert.equal(invalid.alerts.length, 5);
			assert.deepEqual(invalid.output, ["Round 1, guess 1: 0 points.", "Game ended. Completed-round total: 0."]);
			result = { scoring, invalid };
		}
	}
	else if (!solved) {
		result = { tiles: await page.$$(".tile").then(n => n.length), modal: await page.$(".modal") };
		assert.equal(result.tiles, 0);
		assert.equal(result.modal, null);
	}
	else {
		await page.evaluate(() => document.fonts.ready);
		await page.waitForFunction(() => Number(document.querySelector("#drawing rect")?.getAttribute("width")) === 100);
		const state = await page.evaluate(() => ({
			tiles: [...document.querySelectorAll(".tile")].map(n => n.classList.contains("dark")),
			numbers: [...document.querySelectorAll(".numbered-grid .card")].map(n => n.textContent),
			grid: getComputedStyle(document.querySelector(".board")).display,
			icon: [...document.querySelectorAll(".material-icons")].filter(n => n.getBoundingClientRect().width > 0).map(n => n.textContent),
			font: document.fonts.check("16px \"Material Icons\""),
			width: Number(document.querySelector("#drawing rect").getAttribute("width")),
			height: Number(document.querySelector("#drawing rect").getAttribute("height")),
			x: Number(document.querySelector("#drawing rect").getAttribute("x")),
			y: Number(document.querySelector("#drawing rect").getAttribute("y")),
			fixed: getComputedStyle(document.querySelector(".blue")).position,
			yellowWidth: document.querySelector(".yellow").getBoundingClientRect().width
		}));
		assert.deepEqual(state.tiles, [false, true, false, true, false, true, false, true, false]);
		assert.deepEqual(state.numbers, ["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
		assert.equal(state.grid, "grid");
		assert.ok(state.font);
		assert.deepEqual(state.icon, [(await page.viewport()).width <= 992 ? "bug_report" : "face"]);
		assert.equal(state.width, 100);
		assert.equal(state.height, 100);
		assert.equal(state.x, 100);
		assert.equal(state.y, 100);
		assert.equal(state.fixed, "fixed");
		assert.equal(state.yellowWidth, 106);
		await page.evaluate(() => document.querySelector("#drawing rect").dispatchEvent(new MouseEvent("mouseover")));
		await page.waitForFunction(() => getComputedStyle(document.querySelector("#drawing rect")).fill === "rgb(0, 128, 0)");
		await page.evaluate(() => document.querySelector("#drawing rect").dispatchEvent(new MouseEvent("mouseout")));
		await page.waitForFunction(() => getComputedStyle(document.querySelector("#drawing rect")).fill === "rgb(255, 0, 0)");
		await page.focus(".modal-trigger");
		await page.keyboard.press("Enter");
		await page.waitForFunction(() => document.querySelector(".modal").classList.contains("open"));
		await page.focus(".modal-close");
		await page.keyboard.press("Enter");
		await page.waitForFunction(() => !document.querySelector(".modal").classList.contains("open") && getComputedStyle(document.querySelector(".modal")).display === "none");
		await page.focus(".modal-trigger");
		await page.keyboard.press("Enter");
		await page.waitForFunction(() => document.querySelector(".modal").classList.contains("open"));
		await page.keyboard.press("Escape");
		await page.waitForFunction(() => !document.querySelector(".modal").classList.contains("open") && getComputedStyle(document.querySelector(".modal")).display === "none");
		result = { ...state, modalKeyboardAndEscape: true, hoverRestoresRed: true };
	}
	const layout = await page.evaluate(() => ({
		fits: document.documentElement.scrollWidth <= innerWidth,
		saved: document.querySelector("main").dataset.savedCheckpoint === "true",
		outline: getComputedStyle(document.querySelector("main")).outlineStyle
	}));
	assert.ok(layout.fits);
	if (kind === "edited") {
		assert.ok(layout.saved);
		assert.equal(layout.outline, "solid");
	}
	return { ...result, ...layout };
}
