import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-master-conditionals-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
export function editedConditionalsSource(resource, filename) {
	const reference = fixture.resources.find(
		r => r.project === resource.project && r.role === "reference"
	);
	const source = readFileSync(
		new URL(
			`../front-end/public/course-assets/javascript-level-2/${reference.files.find(f => f.name === filename).path}`,
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
function lines(page) {
	return page.$$eval("#output p", nodes => nodes.map(n => n.textContent));
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
async function run(page) {
	await page.focus("#run");
	await page.keyboard.press("Enter");
}
export async function inspectConditionals(page, resource, kind) {
	await page.waitForFunction(
		() => document.querySelector("main")?.dataset.state
	);
	const complete
		= resource.role === "reference"
			|| kind === "edited"
			|| resource.project === "ternary-operators-practice";
	const state = await page.evaluate(() => ({
		noHorizontalOverflow:
			document.documentElement.scrollWidth <= innerWidth,
		reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
		width: innerWidth
	}));
	assert.ok(state.noHorizontalOverflow);
	if (!complete) {
		assert.ok(await page.$eval("#run", n => n.disabled));
		assert.equal(await page.$eval("main", n => n.dataset.state), "starter");
		assert.match(
			await page.$eval("#status", n => n.textContent),
			/Complete the functions/
		);
		state.originalStarterUnfinished = true;
		return state;
	}
	assert.equal(await page.$eval("main", n => n.dataset.state), "ready");
	assert.ok(!(await page.$eval("#run", n => n.disabled)));
	if (resource.project === "ternary-operators-practice") {
		await fill(page, { draw: 0.25, color: "", number: 50 });
		await run(page);
		assert.deepEqual(await lines(page), [
			"Goodbye!",
			"Name: Katy",
			"Wow,  is my favorite color too!",
			"Number greater than 50: false"
		]);
		await page.focus("#cancel-color");
		await page.keyboard.press("Space");
		await run(page);
		assert.equal((await lines(page))[2], "Didn't quite get that!");
		await page.focus("#cancel-color");
		await page.keyboard.press("Space");
		await fill(page, { draw: 0.75, color: "violet", number: 51 });
		await run(page);
		assert.deepEqual(await lines(page), [
			"Hello!",
			"Name: Kevin",
			"Wow, violet is my favorite color too!",
			"Number greater than 50: true"
		]);
		await fill(page, { draw: 0.5 });
		await run(page);
		assert.equal((await lines(page))[0], "Goodbye!");
		const before = await lines(page);
		await fill(page, { draw: 1 });
		await run(page);
		assert.deepEqual(await lines(page), before);
		await fill(page, { draw: 0.75 });
		await run(page);
		state.strictNullAndEmptyStringPreserved = true;
		state.bothBranchesAndExactThresholdPassed = true;
	}
	else if (resource.project === "department-store-discounts") {
		for (const [price, category, total] of [
			[20, "program", "$12.80"],
			[25, "elementary", "$23.00"],
			[15.3, "none", "$16.00"],
			[10, "none", "$11.00"]
		]) {
			await fill(page, { price, "student-type": category });
			await run(page);
			assert.equal((await lines(page)).at(-1), `Final price: ${total}`);
		}
		const before = await lines(page);
		await fill(page, { price: -1 });
		await run(page);
		assert.deepEqual(await lines(page), before);
		assert.match(
			await page.$eval("#status", n => n.textContent),
			/between 0 and 1000000/
		);
		await fill(page, { "price": 20, "student-type": "program" });
		await run(page);
		state.originalDiscountOrderAndFractionalSearchPassed = true;
	}
	else if (resource.project === "special-numbers") {
		assert.match(
			(await lines(page)).join("\n"),
			/Perfect numbers, 1 through 9000: 6, 28, 496, 8128/
		);
		await fill(page, {
			number: 0,
			predicate: "perfect",
			start: 1,
			end: 30
		});
		await run(page);
		assert.deepEqual((await lines(page)).slice(0, 4), [
			"Number: 0",
			"Self-dividing: false",
			"Perfect: false",
			"Palindrome: false"
		]);
		assert.equal((await lines(page)).at(-1), "Matches (perfect): 6, 28");
		await fill(page, {
			number: 128,
			predicate: "self-dividing",
			start: 128,
			end: 128
		});
		await run(page);
		assert.equal((await lines(page))[1], "Self-dividing: true");
		assert.equal(
			(await lines(page)).at(-1),
			"Matches (self-dividing): 128"
		);
		const before = await lines(page);
		await fill(page, { start: 30, end: 1 });
		await run(page);
		assert.deepEqual(await lines(page), before);
		await fill(page, {
			number: 11011,
			predicate: "palindrome",
			start: 700,
			end: 2000
		});
		await run(page);
		assert.equal((await lines(page))[3], "Palindrome: true");
		assert.ok((await lines(page)).at(-1).endsWith("1991"));
		state.originalRangesInclusiveAndPositiveDomainPassed = true;
	}
	else {
		for (const age of [0, 2, 3, 4, 5, 15, 16, 34, 35, 64, 65]) {
			await fill(page, { age });
			await run(page);
			const result = await lines(page);
			assert.equal(result[0], `Practice age: ${age}`);
			assert.equal(
				result[1],
				`Baby example (0–2): ${age <= 2 ? "yes" : "no"}`
			);
			assert.equal(
				result[2],
				`Toddler example (3–4): ${age > 2 && age < 5 ? "yes" : "no"}`
			);
			assert.equal(
				result[3],
				`Milestone at 16: ${age >= 16 ? "reached" : "not yet"}`
			);
			assert.equal(
				result[4],
				`Milestone at 35: ${age >= 35 ? "reached" : "not yet"}`
			);
			assert.equal(
				result[5],
				`Milestone at 65: ${age >= 65 ? "reached" : "not yet"}`
			);
		}
		const before = await lines(page);
		for (const age of [-1, 1.5]) {
			await fill(page, { age });
			await run(page);
			assert.deepEqual(await lines(page), before);
		}
		await fill(page, { age: 65 });
		await run(page);
		state.fiveIndependentAgeBoundariesPassed = true;
	}
	const numeric
		= resource.project === "ternary-operators-practice"
			? "draw"
			: resource.project === "department-store-discounts"
				? "price"
				: resource.project === "special-numbers"
					? "number"
					: "age";
	const saved = await page.$eval(`#${numeric}`, n => n.value);
	const before = await lines(page);
	await fill(page, { [numeric]: "" });
	await run(page);
	assert.deepEqual(await lines(page), before);
	assert.match(
		await page.$eval("#status", n => n.textContent),
		/Enter a number/
	);
	await fill(page, { [numeric]: saved });
	await run(page);
	state.blankInputPreservesLastValidOutput = true;
	if (kind === "edited") {
		const saved = await page.$eval("h1", n => ({
			text: n.textContent,
			script: n.dataset.savedScript,
			color: getComputedStyle(n).color
		}));
		assert.ok(saved.text.startsWith("Saved "));
		assert.equal(saved.script, "true");
		assert.equal(saved.color, "rgb(124, 58, 237)");
		state.visibleSavedEdits = true;
	}
	state.actualKeyboardFormControlsPassed = true;
	return state;
}
