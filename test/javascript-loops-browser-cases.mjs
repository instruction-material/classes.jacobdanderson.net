import assert from "node:assert/strict";

const literal = ["Hello World!", "<b>Literal text</b>", "X".repeat(300)];
const colors = [...Array.from({ length: 2 }).fill("red"), ...Array.from({ length: 3 }).fill("yellow"), ...Array.from({ length: 4 }).fill("blue"), ...Array.from({ length: 3 }).fill("purple")];
const sequences = [...Array.from({ length: 50 }, (_, i) => i + 1), ...Array.from({ length: 50 }, (_, i) => 50 - i), ...Array.from({ length: 50 }, (_, i) => 2 * (i + 1)), ...Array.from({ length: 50 }, (_, i) => 99 - 2 * i), 1, 3, 9, 27, 81, 500, 100, 20, 4].map(String);
const countError = "At least one input must be a whole repeat count from -10000 through 10000.";
const row = (name, inputs, text, extra = {}) => ({ name, inputs, text, ...extra });
export function scenarios(resource) {
	if (resource.role === "starter") {
		if (resource.intentionalSyntaxError) return [row("intentional-debugging-starter", [], [], { expectedSyntaxError: true })];
		const probe = resource.project === "looping-squares" ? { probe: "square", colors: ["green"], text: ["Enter a valid CSS color.", "Enter a valid CSS color."] } : { probe: "text", text: literal };
		return [row("unfinished-starter", [], []), row("supplied-helper", [], probe.text, probe)];
	}
	if (resource.project === "for-loops") return [row("six-sequences", [], sequences), row("literal-helper", [], [...sequences, ...literal], { probe: "text" })];
	if (resource.project === "string-reversal") {
		const words = [["word", "loop"], ["one-letter", "A"], ["literal-text", "<b>x</b>"], ["long-word", "z".repeat(300)], ["zero-word", "0"]];
		return [...words.map(([name, word]) => row(name, [word], [...word.split(""), ...word.split("").toReversed()])), row("empty", [""], ["Enter a nonempty word."]), row("spaces", ["   "], ["Enter a nonempty word."]), row("cancel", [null], ["Word entry canceled."])];
	}
	if (resource.project === "looping-squares") return [row("twelve-squares", [], [], { colors }), row("invalid-color", [], ["Enter a valid CSS color.", "Enter a valid CSS color."], { colors, probe: "invalid-square" })];
	if (resource.project === "powers-of-three") return [row("powers-below-5000", [], ["1", "3", "9", "27", "81", "243", "729", "2187"])];
	if (resource.project === "repeated-addition") {
		return [
			...[["3", "4", "12"], ["3", "2.5", "7.5"], ["2.5", "3", "7.5"], ["2", "-3", "-6"], ["-3", "2.5", "-7.5"], ["0", "1000000000000", "0"], ["10000", "10001", "100010000"], ["-0.5", "-2", "1"]].map(([a, b, result], i) => row(`product-${i}`, [a, b], [result])),
			...[["0.5", "0.25"], ["10001", "10002"]].map((inputs, i) => row(`unsupported-count-${i}`, inputs, [countError])),
			...[["", "3"], ["3", "abc"], ["Infinity", "3"], ["3", "Infinity"]].map((inputs, i) => row(`invalid-input-${i}`, inputs, ["Enter two finite numbers."])),
			row("cancel-first", [null, "3"], ["Multiplication canceled."]),
			row("cancel-second", ["3", null], ["Multiplication canceled."]),
			row("overflow", ["1e308", "3"], ["The product must be a finite number."])
		];
	}
	if (resource.project === "debugging-loops") return [["minimum", 0, 50], ["maximum", 1 - Number.EPSILON, 500], ["midpoint", 0.5, 300]].map(([name, random, total]) => row(`five-races-${name}`, [], Array.from({ length: 5 }, (_, i) => [`Race ${i + 1} begins in: `, ...Array.from({ length: 10 }, (_, j) => `${10 - j}...`), "GO!!!!!!!!!", ...[1, 2, 3].map(r => `Racer ${r} made it a total of ${total} feet!`)]).flat(), { random }));
	assert.fail(`Missing loop scenarios for ${resource.project}`);
}
export async function probeHelper(page, probe) {
	await page.evaluate((kind) => {
		if (kind === "square")window.printToScreen("green");
		if (kind === "square" || kind === "invalid-square") {
			window.printToScreen("<b>red</b>");
			window.printToScreen("url(https://example.invalid/paint)");
		}
		else {
			for (const value of ["Hello World!", "<b>Literal text</b>", "X".repeat(300)])window.printToScreen(value);
		}
	}, probe);
}
export async function checkSquares(page, expected = []) {
	const squares = await page.evaluate(() => [...document.querySelectorAll("svg")].map((svg) => {
		const rect = svg.querySelector("rect");
		const b = rect.getBBox();
		const s = svg.getBoundingClientRect();
		return { viewBox: svg.getAttribute("viewBox"), role: svg.getAttribute("role"), title: svg.querySelector("title")?.textContent, label: svg.getAttribute("aria-label"), color: rect.getAttribute("fill"), renderedColor: getComputedStyle(rect).fill, bounds: [b.x, b.y, b.width, b.height], withinViewport: s.left >= 0 && s.right <= innerWidth + 1 && s.width >= 99 && s.height >= 99 };
	}));
	assert.equal(squares.length, expected.length);
	const rgb = { red: "rgb(255, 0, 0)", yellow: "rgb(255, 255, 0)", blue: "rgb(0, 0, 255)", purple: "rgb(128, 0, 128)", green: "rgb(0, 128, 0)" };
	for (const [i, square] of squares.entries()) {
		assert.equal(square.viewBox, "0 0 100 100");
		assert.equal(square.role, "img");
		assert.equal(square.title, `${expected[i]} square`);
		assert.equal(square.label, square.title);
		assert.equal(square.color, expected[i]);
		assert.equal(square.renderedColor, rgb[expected[i]]);
		assert.deepEqual(square.bounds, [0, 0, 100, 100]);
		assert.ok(square.withinViewport);
	}
	return squares;
}
