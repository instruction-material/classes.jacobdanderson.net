import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-dynamic-events-sources.json", import.meta.url), "utf8"));

export function editedDynamicEventsSource(resource, filename) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${reference.files.find(file => file.name === filename).path}`, import.meta.url), "utf8");
	if (filename === "script.js") return source.replace(".attr(\"fill\", \"black\")", ".attr(\"fill\", \"purple\")").replace("\"You hit \"", "\"Your score: \"");
	return filename === "index.html"
		? source.replace("<title>", "<title>Saved ").replace("<h1", "<h1 data-saved-edit=\"true\"")
		: `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

export async function inspectDynamicEvents(page, resource, kind) {
	const unfinished = resource.role === "starter" && kind === "exact";
	const state = await page.evaluate(() => ({
		noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
		headingCount: document.querySelectorAll("h1").length,
		savedHeading: !!document.querySelector("h1[data-saved-edit]"),
		borderTop: getComputedStyle(document.body).borderTopColor,
		ids: [...document.querySelectorAll("[id]")].map(node => node.id)
	}));
	assert.ok(state.noHorizontalOverflow);
	assert.equal(state.headingCount, 1);
	assert.equal(new Set(state.ids).size, state.ids.length);
	if (kind === "edited") {
		assert.ok(state.savedHeading);
		assert.equal(state.borderTop, "rgb(124, 58, 237)");
	}
	if (resource.project === "calculator") {
		assert.equal(await page.$$eval("#calculator svg rect", nodes => nodes.length), 2);
		assert.equal(await page.$eval("#calculator svg rect", node => node.getAttribute("fill")), kind === "edited" ? "purple" : "black");
		assert.equal(await page.$$eval("svg input", nodes => nodes.length), 0);
		assert.equal(await page.$$eval("label", nodes => nodes.filter(node => document.getElementById(node.htmlFor)).length), 2);
		await page.focus("#number");
		await page.keyboard.type("12");
		await page.keyboard.press("Tab");
		assert.equal(await page.evaluate(() => document.activeElement.id), "number-two");
		await page.keyboard.type("3");
		await page.keyboard.press("Tab");
		assert.equal(await page.evaluate(() => document.activeElement.id), "add");
		assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), "solid");
		await page.keyboard.press("Enter");
		assert.equal(await page.$eval("#output", node => node.textContent), unfinished ? "12" : "15");
		if (unfinished) {
			await page.click("#sub");
			assert.equal(await page.$eval("#output", node => node.textContent), "12");
			state.unfinishedStarterPreserved = true;
			return state;
		}
		const checks = [
			["12", "3", "add", "Result: 15"],
			["12", "3", "sub", "Result: 9"],
			["-4", "2.5", "mult", "Result: -10"],
			["9", "4", "div", "Result: 2.25"],
			["0", "-3", "add", "Result: -3"],
			[" 2 ", "3", "add", "Result: 5"],
			["", "3", "add", "Enter two finite numbers."],
			["2", "", "mult", "Enter two finite numbers."],
			[" ", "3", "sub", "Enter two finite numbers."],
			["words", "3", "add", "Enter two finite numbers."],
			["Infinity", "3", "add", "Enter two finite numbers."],
			["1", "0", "div", "Cannot divide by zero."],
			["1", "-0", "div", "Cannot divide by zero."],
			["1e308", "1e308", "mult", "The result is too large to represent as a finite number."],
			["2", "3", "add", "Result: 5"]
		];
		for (const [first, second, operation, expected] of checks) {
			await page.evaluate((a, b) => {
				document.querySelector("#number").value = a;
				document.querySelector("#number-two").value = b;
			}, first, second);
			await page.click(`#${operation}`);
			assert.equal(await page.$eval("#result-message", node => node.textContent), expected);
		}
		const svgState = await page.$eval("#calculator svg", (node) => {
			const box = node.querySelector("text").getBBox();
			return { viewBox: node.getAttribute("viewBox"), title: document.getElementById(node.getAttribute("aria-labelledby").split(" ")[0]).textContent, display: { x: box.x, width: box.width } };
		});
		assert.equal(svgState.viewBox, "0 0 300 400");
		assert.ok(svgState.title);
		assert.ok(svgState.display.x >= 75 && svgState.display.x + svgState.display.width <= 225);
		state.calculatorChecks = checks.length;
	}
	else {
		assert.equal(resource.project, "strength-tester");
		if (unfinished) {
			assert.equal(await page.$("#button"), null);
			state.unfinishedStarterPreserved = true;
			return state;
		}
		assert.ok(await page.$eval("#prize-image", node => node.hidden));
		const tiers = [[0, "yo-yo"], [100, "yo-yo"], [101, "frisbee"], [200, "frisbee"], [201, "football"], [300, "football"], [301, "basketball"], [400, "basketball"], [401, "teddy bear"], [500, "teddy bear"]];
		for (const [score, prize] of tiers) {
			await page.evaluate((value) => {
				Math.random = () => (value + 0.25) / 501;
			}, score);
			await page.focus("#button");
			await page.keyboard.press("Space");
			await page.waitForFunction(expected => document.querySelector("#prize-image").alt === expected && document.querySelector("#prize-image").complete && document.querySelector("#prize-image").naturalWidth > 0, {}, prize);
			assert.equal(await page.$eval("#strength-level", node => node.textContent), `${kind === "edited" ? "Your score: " : "You hit "}${score}`);
			assert.equal(await page.$eval("#prize-message", node => node.textContent), `You won a ${prize}!`);
			assert.ok(await page.$eval("#prize-image", node => !node.hidden && node.getBoundingClientRect().width > 0));
		}
		assert.equal(await page.evaluate(() => document.activeElement.id), "button");
		assert.equal(await page.$eval("[role=\"status\"]", node => node.getAttribute("aria-live")), "polite");
		state.prizeBoundaryChecks = tiers.length;
		await page.evaluate(() => {
			Math.random = () => 0;
		});
		await page.click("#button");
		await page.waitForFunction(() => document.querySelector("#prize-image").alt === "yo-yo" && document.querySelector("#prize-image").complete);
	}
	return state;
}
