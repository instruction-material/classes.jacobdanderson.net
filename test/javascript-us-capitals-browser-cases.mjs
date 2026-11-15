/* global game, loading, suppliedJSON */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-us-capitals-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
export function editedQuizSource(resource, filename) {
	const source = fixture.files[resource.project][resource.role][filename];
	if (filename === "index.html") {
		return source.replace(
			`<h1>${resource.title}</h1>`,
			`<h1>Saved ${resource.title}</h1>`
		);
	}
	if (filename === "styles.css")
		return `${source}\nmain { outline: 3px solid #334155; }\n`;
	if (filename === "model.js") {
		return `${
			fixture.files[resource.project].reference[filename]
		}\n// Saved completed state-capitals quiz.\n`;
	}
}
async function pixels(page) {
	return page.$eval("#map", (canvas) => {
		const ctx = canvas.getContext("2d");
		const bytes = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		const counts = { green: 0, red: 0, unanswered: 0 };
		for (let i = 0; i < bytes.length; i += 4) {
			if (bytes[i] === 34 && bytes[i + 1] === 131 && bytes[i + 2] === 76)
				counts.green++;
			if (bytes[i] === 189 && bytes[i + 1] === 48 && bytes[i + 2] === 48)
				counts.red++;
			if (
				bytes[i] === 229
				&& bytes[i + 1] === 231
				&& bytes[i + 2] === 235
			) {
				counts.unanswered++;
			}
		}
		return counts;
	});
}
async function answer(page, value) {
	await page.evaluate((value) => {
		document.querySelector("#answer").value = value;
		document.querySelector("#answer-form").requestSubmit();
	}, value);
}
async function upload(page, filename, content, directory) {
	const path = join(directory, filename);
	await writeFile(path, content);
	const input = await page.$("#dataset");
	await input.uploadFile(path);
	await page.waitForFunction(() => !loading);
}
export async function inspectQuiz(page, resource, kind, url, width, options) {
	const complete = resource.role === "reference" || kind === "edited";
	await page.goto(url, { waitUntil: "load" });
	await page.waitForSelector("#start");
	assert.equal(await page.evaluate(() => game.dataset.states.length), 50);
	const neutral = await pixels(page);
	assert.ok(neutral.unanswered > 1000);
	assert.equal(neutral.green, 0);
	assert.equal(neutral.red, 0);
	await page.click("#start");
	if (!complete) {
		assert.match(
			await page.$eval("#status", e => e.textContent),
			/Complete chooseQuestion in model.js/
		);
		assert.equal(await page.evaluate(() => game.answers.length), 0);
		assert.equal(await page.evaluate(() => game.phase), "ready");
		return {
			complete,
			initial50StateMapRendered: true,
			scaffoldTaskExplained: true
		};
	}
	assert.equal(
		await page.$eval("#answer", e => e === document.activeElement),
		true
	);
	await answer(page, "");
	assert.equal(await page.evaluate(() => game.answers.length), 0);
	// Bypass only HTML's length gate to exercise the model's independent boundary.
	await page.evaluate(() => {
		const input = document.querySelector("#answer");
		input.value = "x".repeat(101);
		document
			.querySelector("#answer-form")
			.dispatchEvent(new Event("submit", { cancelable: true }));
	});
	assert.equal(await page.evaluate(() => game.answers.length), 0);
	assert.match(
		await page.$eval("#status", e => e.textContent),
		/1–100 characters/
	);
	await page.$eval("#answer", (input) => {
		input.value = "";
	});
	await page.focus("#answer");
	await page.keyboard.type("  MONTGOMERY  ");
	await page.keyboard.press("Enter");
	assert.equal(await page.evaluate(() => game.phase), "feedback");
	assert.equal(await page.evaluate(() => game.answers.length), 1);
	assert.equal(
		await page.$eval("#next", e => e === document.activeElement),
		true
	);
	assert.match(
		await page.$eval("#question", e => e.textContent),
		/Correct.*Alabama.*Montgomery/
	);
	const firstColor = await pixels(page);
	assert.ok(firstColor.green > 100);
	await page.evaluate(() =>
		document
			.querySelector("#answer-form")
			.dispatchEvent(new Event("submit", { cancelable: true }))
	);
	assert.equal(await page.evaluate(() => game.answers.length), 1);
	await page.keyboard.press("Enter");
	assert.equal(await page.evaluate(() => game.question.name), "Alaska");
	await answer(page, "Wrong");
	assert.match(
		await page.$eval("#question", e => e.textContent),
		/Incorrect.*Alaska.*Juneau/
	);
	const wrongColor = await pixels(page);
	assert.ok(wrongColor.red > 100);
	await page.click("#next");
	for (let index = 2; index < 50; index++) {
		const capital = await page.evaluate(() => game.question.capital);
		await answer(page, capital);
		assert.equal(await page.evaluate(() => game.answers.length), index + 1);
		if (index === 49) {
			assert.equal(
				await page.$eval("#next", e => e.textContent),
				"Finish quiz"
			);
		}
		await page.click("#next");
	}
	assert.equal(await page.evaluate(() => game.phase), "complete");
	assert.equal(await page.evaluate(() => game.question), null);
	assert.equal(
		await page.$eval("#progress", e => e.textContent),
		"49 correct out of 50."
	);
	assert.equal(await page.$$eval("#results li", items => items.length), 50);
	assert.equal(
		await page.$$eval(
			"#results li",
			items => new Set(items.map(item => item.dataset.stateId)).size
		),
		50
	);
	assert.equal(
		await page.$$eval(
			"#results li[data-correct='false']",
			items => items.length
		),
		1
	);
	assert.equal(
		await page.$eval("#reset", e => e === document.activeElement),
		true
	);
	await page.screenshot({
		path: options.completedScreenshot,
		fullPage: true
	});
	const original = await page.evaluate(() => JSON.stringify(game));
	await mkdir(options.fixtureDirectory, { recursive: true });
	await page.click("details summary");
	for (const [name, body] of [
		["broken.json", "{broken"],
		[
			"empty.json",
			JSON.stringify({
				schemaVersion: 1,
				viewBox: [0, 0, 100, 100],
				states: []
			})
		],
		["oversized.json", "x".repeat(1048577)]
	]) {
		await upload(page, name, body, options.fixtureDirectory);
		assert.match(
			await page.$eval("#status", e => e.textContent),
			/Dataset rejected/
		);
		assert.equal(await page.evaluate(() => JSON.stringify(game)), original);
	}
	const dataset = await page.evaluate(() => JSON.parse(suppliedJSON));
	dataset.states = dataset.states.slice(0, 1);
	await upload(
		page,
		"one-state.json",
		JSON.stringify(dataset),
		options.fixtureDirectory
	);
	assert.equal(await page.evaluate(() => game.dataset.states.length), 1);
	await page.click("#start");
	await answer(page, "Montgomery");
	await page.click("#next");
	assert.equal(
		await page.$eval("#progress", e => e.textContent),
		"1 correct out of 1."
	);
	await page.click("#reset");
	assert.equal(await page.evaluate(() => game.answers.length), 0);
	assert.equal(
		await page.$eval("#start", e => e === document.activeElement),
		true
	);
	await page.evaluate(() => {
		window.originalQuizFileText = File.prototype.text;
		File.prototype.text = function () {
			return new Promise((resolve) => {
				window.finishQuizFile = resolve;
			});
		};
	});
	const late = join(options.fixtureDirectory, "late.json");
	await writeFile(late, JSON.stringify(dataset));
	await (await page.$("#dataset")).uploadFile(late);
	await page.waitForFunction(() => loading);
	await page.click("#supplied");
	await page.evaluate(() => {
		window.finishQuizFile("{\"schemaVersion\":99}");
		File.prototype.text = window.originalQuizFileText;
	});
	await page.waitForFunction(() => !loading);
	assert.equal(await page.evaluate(() => game.dataset.states.length), 50);
	assert.equal(await page.$eval("#status", e => e.textContent), "");
	const disabled = await page.evaluateOnNewDocument(() => {
		HTMLCanvasElement.prototype.getContext = () => null;
	});
	await page.reload({ waitUntil: "load" });
	assert.equal(await page.$eval("#map-region", e => e.hidden), true);
	await page.click("#start");
	await answer(page, "Montgomery");
	assert.equal(await page.evaluate(() => game.answers.length), 1);
	assert.match(await page.$eval("#question", e => e.textContent), /Correct/);
	await page.removeScriptToEvaluateOnNewDocument(disabled.identifier);
	await page.reload({ waitUntil: "load" });
	assert.equal(await page.$eval("#map-region", e => e.hidden), false);
	assert.equal(await page.evaluate(() => game.phase), "ready");
	assert.equal(
		await page.$eval("h1", e => e.textContent),
		(kind === "edited" ? "Saved " : "") + resource.title
	);
	if (kind === "edited") {
		assert.equal(
			await page.$eval("main", e => getComputedStyle(e).outlineWidth),
			"3px"
		);
	}
	return {
		complete,
		initial50StateMapRendered: true,
		actualCanvasGreenPixels: firstColor.green,
		actualCanvasRedPixels: wrongColor.red,
		exact50QuestionsAndNo51st: true,
		score: 49,
		duplicateSubmitIgnored: true,
		keyboardEnterSubmission: true,
		keyboardFeedbackContinuation: true,
		blankAndLengthBoundaries: true,
		all50UniqueResultIds: true,
		malformedEmptyOversizedPreservePriorQuiz: true,
		actualSubsetTotal: true,
		resetAndFocus: true,
		lateFileCannotReplaceSuppliedData: true,
		canvasUnavailableTextWorkflow: true,
		width
	};
}
