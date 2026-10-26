/* global calculateProfit */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-master-functions-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
export function editedFunctionsSource(resource, filename) {
	const reference = fixture.resources.find(
		row => row.project === resource.project && row.role === "reference"
	);
	const source = readFileSync(
		new URL(
			`../front-end/public/course-assets/javascript-level-2/${reference.files.find(file => file.name === filename).path}`,
			import.meta.url
		),
		"utf8"
	);
	if (filename === "index.html") {
		return source
			.replace("<title>", "<title>Saved ")
			.replace("<h1>", "<h1 data-saved-edit=\"true\">Saved ");
	}
	if (filename === "script.js")
		return `${source}\ndocument.querySelector("h1").style.color = "#7c3aed";\ndocument.querySelector("h1").dataset.savedScript = "true";\n`;
	return `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}
async function activate(page, selector) {
	await page.focus(selector);
	await page.keyboard.press("Enter");
}
async function lines(page) {
	return page.$$eval("#output p", nodes =>
		nodes.map(node => node.textContent));
}
async function submit(page) {
	await activate(page, "#run");
}
async function fill(page, values) {
	for (const [id, value] of Object.entries(values)) {
		await page.$eval(
			`#${id}`,
			(node, value) => {
				node.value = value;
			},
			String(value)
		);
	}
}
export async function inspectFunctions(page, resource, kind) {
	await page.waitForFunction(
		() => document.querySelector("main")?.dataset.state
	);
	const edited = kind === "edited";
	const complete = resource.role === "reference" || edited;
	const state = await page.evaluate(() => ({
		noHorizontalOverflow:
			document.documentElement.scrollWidth <= innerWidth,
		reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
		width: innerWidth
	}));
	assert.ok(state.noHorizontalOverflow);
	if (!complete) {
		assert.ok(await page.$eval("#run", node => node.disabled));
		if (resource.project === "debugging-functions") {
			const diagnostic = await page.$eval("#source-error", node => ({
				name: node.dataset.errorName,
				text: node.textContent,
				visible: !node.hidden
			}));
			assert.ok(diagnostic.visible);
			if (new URL(page.url()).protocol === "file:" && diagnostic.name === "Error") {
				// File origins can mask the underlying script error type.
				// The native ZIP check separately parses the actual script bytes.
				assert.match(diagnostic.text, /could not run\. Check script\.js/);
				state.browserErrorTypeMasked = true;
			}
			else {
				assert.equal(diagnostic.name, "SyntaxError");
				assert.match(diagnostic.text, /Repair the starter functions/);
			}
			state.intentionalDebuggingDiagnosticRetained = true;
		}
		else {
			assert.equal(
				await page.$eval("main", node => node.dataset.state),
				"starter"
			);
			assert.match(
				await page.$eval("#status", node => node.textContent),
				/Complete the functions/
			);
			state.originalStarterUnfinished = true;
		}
		return state;
	}
	assert.equal(await page.$eval("main", node => node.dataset.state), "ready");
	assert.ok(await page.$eval("#source-error", node => node.hidden));
	assert.equal(await page.$eval("#run", node => node.disabled), false);
	if (resource.project === "functions-practice") {
		await submit(page);
		assert.deepEqual(await lines(page), [
			"Sum: 31",
			"Difference: -5",
			"Product: 2340",
			"Average: 15.5",
			"Factorial: 24",
			"Exponent: 32"
		]);
		assert.equal(await page.evaluate(() => typeof answer), "undefined");
		await fill(page, { "factorial-input": 0, "power": 0 });
		await submit(page);
		assert.deepEqual((await lines(page)).slice(-2), [
			"Factorial: 1",
			"Exponent: 1"
		]);
		state.arithmeticAndEmptyProductCasesPassed = true;
	}
	else if (resource.project === "which-metrocard") {
		await submit(page);
		assert.deepEqual(await lines(page), [
			"Rides: 30",
			"Monthly: $127.00",
			"Pay per ride: $82.50",
			"Pay per ride saves $44.50."
		]);
		await fill(page, { rides: 47 });
		await submit(page);
		assert.deepEqual(await lines(page), [
			"Rides: 47",
			"Monthly: $127.00",
			"Pay per ride: $129.25",
			"Monthly pass saves $2.25."
		]);
		state.sampleFareBoundaryPassed = true;
	}
	else if (resource.project === "rock-paper-scissors") {
		await page.evaluate(() => {
			window.__functionRandomDraws = 0;
			Math.random = () => {
				window.__functionRandomDraws++;
				return 0;
			};
		});
		await activate(page, "#cancel");
		assert.equal(
			await page.evaluate(() => window.__functionRandomDraws),
			0
		);
		assert.equal((await lines(page)).length, 0);
		await page.select("#choice", "paper");
		await submit(page);
		const first = await lines(page);
		await activate(page, "#cancel");
		assert.deepEqual(await lines(page), first);
		assert.equal(
			await page.evaluate(() => window.__functionRandomDraws),
			1
		);
		assert.match(
			await page.$eval("#status", node => node.textContent),
			/player 1, computer 0/
		);
		await page.select("#choice", "paper");
		await submit(page);
		await submit(page);
		assert.equal(
			await page.$eval("#status", node => node.textContent),
			"Player wins the match."
		);
		assert.equal((await lines(page)).length, 3);
		assert.ok(await page.$eval("#run", node => node.disabled));
		assert.equal(
			await page.evaluate(() => document.activeElement.id),
			"reset"
		);
		await activate(page, "#reset");
		assert.equal(
			await page.evaluate(() => document.activeElement.id),
			"choice"
		);
		await page.select("#choice", "scissors");
		for (let round = 0; round < 3; round++) await submit(page);
		assert.equal(
			await page.$eval("#status", node => node.textContent),
			"Computer wins the match."
		);
		await activate(page, "#reset");
		state.cancelPreservesScoreRoundAndRandomness = true;
		state.bothFirstToThreeMatchesAndResetPassed = true;
	}
	else if (resource.project === "geometry-functions") {
		await submit(page);
		let result = await lines(page);
		assert.ok(
			result.includes("Triangle type: scalene")
			&& result.includes("Right triangle: true")
		);
		await fill(page, { "side-a": 5, "side-b": 3, "side-c": 4 });
		await submit(page);
		assert.ok((await lines(page)).includes("Right triangle: true"));
		await fill(page, { "side-a": 1, "side-b": 2, "side-c": 3 });
		await submit(page);
		result = await lines(page);
		assert.ok(
			result.includes("Triangle type: invalid triangle")
			&& result.includes("Right triangle: false")
		);
		state.validityAndHypotenuseOrderPassed = true;
	}
	else if (resource.project === "pain-at-the-pump") {
		await fill(page, { mpg: 25, miles: 10000, gas: 3 });
		await submit(page);
		assert.deepEqual(await lines(page), [
			"Distance: 10000 miles",
			"Efficiency: 25 MPG",
			"Fuel needed: 400 gallons",
			"Fuel price: $3.00 per gallon",
			"Total fuel cost: $1,200.00"
		]);
		const old = await lines(page);
		await fill(page, { mpg: 0 });
		await submit(page);
		assert.deepEqual(await lines(page), old);
		assert.match(
			await page.$eval("#status", node => node.textContent),
			/positive MPG/
		);
		await fill(page, { mpg: 25, miles: 0 });
		await submit(page);
		assert.ok((await lines(page)).includes("Total fuel cost: $0.00"));
		state.numericUnitsAndRejectedZeroMpgPassed = true;
	}
	else if (resource.project === "game-of-war") {
		const result = await lines(page);
		assert.equal(
			result.filter(line => line.includes(" drew a ")).length,
			20
		);
		assert.equal(
			result.filter(line => /wins this round!|It's a tie!/.test(line))
				.length,
			10
		);
		assert.equal(result.filter(line => / drew a 0 /.test(line)).length, 0);
		await page.evaluateOnNewDocument(() => {
			Math.random = () => 0;
		});
		await Promise.all([
			page.waitForNavigation({ waitUntil: "load" }),
			submit(page)
		]);
		await page.waitForFunction(
			() => document.querySelector("main")?.dataset.state === "ready"
		);
		const repeated = await lines(page);
		assert.equal(
			repeated.filter(line => line.includes(" drew a Ace of Spades!"))
				.length,
			20
		);
		assert.ok(
			repeated.includes("Player 1's final score: 0")
			&& repeated.includes("Player 2's final score: 0")
		);
		assert.equal(repeated.at(-1), "The ten-round simulation is tied.");
		state.tenRoundsAceBoundaryAndRerunPassed = true;
	}
	else if (resource.project === "debugging-functions") {
		await submit(page);
		assert.deepEqual(await lines(page), [
			"Profit goal: $0.00",
			"Minimum cups: 82",
			"Daily cost: $162.19",
			"Revenue: $163.18",
			"Profit: $0.99"
		]);
		await fill(page, { goal: 200 });
		await submit(page);
		const minimum = Number(
			(await lines(page))
				.find(line => line.startsWith("Minimum cups:"))
				.split(": ")[1]
		);
		assert.ok(
			await page.evaluate(
				n =>
					calculateProfit(n) >= 200
					&& Array.from({ length: n }, (_, i) =>
						calculateProfit(i)).every(p => p < 200),
				minimum
			)
		);
		state.wholePackCostsAndMinimumProfitPassed = true;
	}
	if (!["rock-paper-scissors", "game-of-war"].includes(resource.project)) {
		const previous = await lines(page);
		const first = await page.$eval("input", node => node.id);
		const originalValue = await page.$eval("input", node => node.value);
		await fill(page, { [first]: "" });
		await submit(page);
		assert.deepEqual(await lines(page), previous);
		assert.match(
			await page.$eval("#status", node => node.textContent),
			/Enter a valid/
		);
		state.blankInputPreservesLastValidOutput = true;
		await fill(page, { [first]: originalValue });
		await submit(page);
	}
	if (edited) {
		assert.ok(
			await page.$eval(
				"h1",
				node =>
					node.dataset.savedScript === "true"
					&& node.dataset.savedEdit === "true"
					&& node.textContent.startsWith("Saved ")
			)
		);
		state.visibleSavedEdits = true;
	}
	state.actualKeyboardFormControlsPassed = true;
	await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
	return state;
}
