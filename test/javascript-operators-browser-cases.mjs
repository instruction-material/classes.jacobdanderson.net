import assert from "node:assert/strict";

const low = 0;
const high = 1 - Number.EPSILON;
const success = "You have been successfully logged in. Congratulations!";
const literal = ["Hello World!", "<b>Literal text</b>", "X".repeat(300)];
const mealError = "Enter nonnegative finite numbers for the cost and percentages.";
const pieError = "Enter a nonnegative safe whole number of pies.";
const partyLow = "The party will take place on 5/1 at 10:00.";
const partyHigh = "The party will take place on 7/30 at 20:59.";
const initialMath = ["The random number is -10", "The new number is -13"];
const row = (name, inputs, text, extra = {}) => ({ name, inputs, text, ...extra });

export function scenarios(resource) {
	if (resource.role === "starter") {
		if (resource.intentionalSyntaxError)
			return [row("intentional-debugging-starter", [], [], { expectedSyntaxError: true })];
		const probe = resource.project === "arc-circles"
			? { probe: "arc", arcs: [[0, -150, 150, 150]], text: ["Enter finite start and end angles in radians."] }
			: resource.project === "math-password"
				? { probe: "password", text: ["Incorrect password!", success] }
				: { probe: "text", text: literal };
		return [row("unfinished-starter", [], [], { arcs: [] }), row("supplied-helper", [], probe.text, probe)];
	}
	if (resource.project === "tips-and-taxes") {
		return [
			row("meal", ["20", "10", "15"], ["The total cost of the meal is $25.00"]),
			row("decimal", ["10.1", "8.25", "15"], ["The total cost of the meal is $12.45"]),
			row("zero", ["0", "0", "0"], ["The total cost of the meal is $0.00"]),
			...[0, 1, 2].map(i => row(`cancel-${i}`, ["20", "10", "15"].map((v, j) => i === j ? null : v), ["Meal calculation canceled."])),
			...["", "abc", "-1", "Infinity"].map((v, i) => row(`invalid-cost-${i}`, [v, "10", "15"], [mealError])),
			row("invalid-tax", ["20", "abc", "15"], [mealError]),
			row("invalid-tip", ["20", "10", "-1"], [mealError]),
			row("overflow", ["1.7976931348623157e308", "100", "100"], ["The meal total must be a finite number."]),
		];
	}
	if (resource.project === "math-password")
		return [row("password", [], [success]), row("incorrect-helper", [], [success, "Incorrect password!"], { probe: "wrong-password" })];
	if (resource.project === "pie-eating-contest") {
		return [
			...[[0, 0, 0], [3, 0, 3], [4, 1, 0], [10, 2, 2], [13, 3, 1], [9007199254740991, 2251799813685247, 3]].map(([n, q, r]) => row(`pies-${n}`, [String(n)], [`There were ${n} pie(s) received, so each contestant received ${q} pies each and we had ${r} leftover pies.`])),
			...["", "-1", "4.5", "abc", "9007199254740992"].map((v, i) => row(`invalid-pies-${i}`, [v], [pieError])),
			row("cancel", [null], ["Pie allocation canceled."]),
		];
	}
	if (resource.project === "random-party") {
		const invalid = "Enter a whole birth month from 1 through 12.";
		return [
			row("lower-bound", [], [partyLow], { random: low }),
			row("upper-bound", [], [partyHigh], { random: high }),
			row("midpoint", [], ["The party will take place on 6/16 at 15:30."], { random: 0.5 }),
			row("challenge-january", ["1"], [partyLow, "The party will take place on 12/1 at 10:00."], { random: low, enableChallenge: true }),
			row("challenge-december", ["12"], [partyHigh, "The party will take place on 1/30 at 20:59."], { random: high, enableChallenge: true }),
			...["0", "13", "1.5", "", "abc"].map((v, i) => row(`invalid-month-${i}`, [v], [partyLow, invalid], { random: low, enableChallenge: true })),
			row("cancel-month", [null], [partyLow, "Party planning canceled."], { random: low, enableChallenge: true }),
		];
	}
	if (resource.project === "random-practice") {
		return [
			row("lower-bounds", [], ["0", "1", "20", "0", "51"], { random: low }),
			row("upper-bounds", [], ["5", "10", "50", "50", "101"], { random: high }),
			row("midpoints", [], ["3", "6", "35", "26", "77"], { random: 0.5 }),
		];
	}
	if (resource.project === "arc-circles")
		return [row("three-arcs", [], [], { arcs: [[-150, -150, 300, 150], [-150, -150, 300, 300], [-150, -150, 300, 300]] }), row("invalid-angle", [], ["Enter finite start and end angles in radians."], { probe: "invalid-arc", arcs: [[-150, -150, 300, 150], [-150, -150, 300, 300], [-150, -150, 300, 300]] })];
	if (resource.project === "debugging-math") {
		return [
			row("signed-remainder", ["2"], [...initialMath, "The number to the power of your number is 169", "After being divided by 11, rounding up, your number is 16"], { random: low }),
			row("upper-range", ["2"], ["The random number is 50", "The new number is 51", "The number to the power of your number is 2601", "After being divided by 11, rounding up, your number is 237"], { random: high }),
			row("exponent-zero", ["0"], [...initialMath, "The number to the power of your number is 1", "After being divided by 11, rounding up, your number is 1"], { random: low }),
			row("cancel", [null], [...initialMath, "Math practice canceled."], { random: low }),
			...["", "abc", "Infinity"].map((v, i) => row(`invalid-exponent-${i}`, [v], [...initialMath, "Enter a finite exponent."], { random: low })),
			...["0.5", "1000"].map((v, i) => row(`invalid-power-${i}`, [v], [...initialMath, "The power must be a finite real number."], { random: low })),
		];
	}
	assert.fail(`Missing source scenarios for ${resource.project}`);
}

export async function probeHelper(page, probe) {
	await page.evaluate((kind) => {
		if (kind === "password") {
			window.printToScreen(0);
			window.printToScreen(0.09625672175876687);
		}
		else if (kind === "wrong-password") {
			window.printToScreen(0);
		}
		else if (kind === "arc") {
			window.printToScreen(0, Math.PI / 2);
			window.printToScreen(Number.NaN, 1);
		}
		else if (kind === "invalid-arc") {
			window.printToScreen(0, Number.POSITIVE_INFINITY);
		}
		else {
			for (const value of ["Hello World!", "<b>Literal text</b>", "X".repeat(300)]) window.printToScreen(value);
		}
	}, probe);
}

export async function checkArcs(page, expected = []) {
	const arcs = await page.evaluate(() => [...document.querySelectorAll("svg")].map((svg) => {
		const path = svg.querySelector("path");
		const b = path.getBBox();
		const box = svg.getBoundingClientRect();
		return { viewBox: svg.getAttribute("viewBox"), role: svg.getAttribute("role"), title: svg.querySelector("title")?.textContent, label: svg.getAttribute("aria-label"), fill: path.getAttribute("fill"), transform: path.parentElement.getAttribute("transform"), path: path.getAttribute("d"), bounds: [b.x, b.y, b.width, b.height], withinViewport: box.left >= 0 && box.right <= innerWidth + 1 };
	}));
	assert.equal(arcs.length, expected.length);
	for (const [i, arc] of arcs.entries()) {
		assert.equal(arc.viewBox, "0 0 800 400");
		assert.equal(arc.role, "img");
		assert.equal(arc.title, arc.label);
		assert.match(arc.title, /^Arc from .* radians$/u);
		assert.equal(arc.fill, "blue");
		assert.equal(arc.transform, "translate(400,200)");
		assert.match(arc.path, /A150,150/u);
		assert.match(arc.path, /A100,100/u);
		assert.ok(!/NaN|Infinity/u.test(arc.path));
		assert.ok(arc.withinViewport);
		for (let j = 0; j < 4; j++) assert.ok(Math.abs(arc.bounds[j] - expected[i][j]) < 0.01, JSON.stringify({ i, observed: arc.bounds, expected: expected[i] }));
	}
	return arcs;
}
