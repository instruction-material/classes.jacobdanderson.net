import assert from "node:assert/strict";

const literal = ["Hello World!", "<b>Literal text</b>", "X".repeat(300)];
const row = (name, inputs, text, extra = {}) => ({ name, inputs, text, ...extra });
function coinText(counts) {
	const [dollars, quarters, dimes, nickels, pennies] = counts;
	return `You have ${dollars} dollars, ${quarters} quarters, ${dimes} dimes, ${nickels} nickels, and ${pennies} pennies.`;
}
function football(name, random, inputs, start, playGain, rounds) {
	const text = [`Our team is starting at yard number ${start}.`];
	const alerts = [];
	for (let round = 0; round < rounds; round++) {
		for (let play = 1; play <= 4; play++) text.push(`Our team on play number ${play} gained ${playGain} yards! Wow!`);
		alerts.push(`The amount of yards your team gained from those 4 plays was ${4 * playGain}.`);
	}
	const gain = rounds * 4 * playGain;
	text.push(`The team advanced a total of ${gain} yards, ending at yard ${start + gain}`);
	return row(name, inputs, text, { random, alerts });
}
export function scenarios(resource) {
	if (resource.role === "starter") {
		if (resource.intentionalReferenceError) {
			const text = ["Our team is starting at yard number 12.5."];
			return [row("intentional-debugging-starter", [], text, { expectedReferenceError: true }), row("debugging-helper", [], [...text, ...literal], { expectedReferenceError: true, probe: "text" })];
		}
		return [row("unfinished-starter", [], []), row("supplied-helper", [], literal, { probe: "text" })];
	}
	if (resource.project === "totaling-up") {
		const base = ["5050", "338350"];
		return [
			row("zero-factorial", ["0"], [...base, "1"]),
			row("one-factorial", ["1"], [...base, "1"]),
			row("five-factorial", ["5"], [...base, "120"]),
			row("maximum-finite-factorial", ["170"], base, { lastNumberApprox: 7.257415615307999e306 }),
			...["", "   ", "-1", "1.5", "abc", "Infinity", "171"].map((input, index) => row(`invalid-factorial-${index}`, [input], [...base, "Enter a whole number from 0 through 170."])),
			row("canceled-factorial", [null], [...base, "Factorial entry canceled."])
		];
	}
	if (resource.project === "coin-machine") {
		return [
			...[["0", [0, 0, 0, 0, 0]], ["4", [0, 0, 0, 0, 4]], ["25", [0, 1, 0, 0, 0]], ["41", [0, 1, 1, 1, 1]], ["99", [0, 3, 2, 0, 4]], ["100", [1, 0, 0, 0, 0]], ["187", [1, 3, 1, 0, 2]], ["1000000", [10000, 0, 0, 0, 0]]].map(([input, counts], index) => row(`coins-${index}`, [input], [coinText(counts)])),
			...["", "-1", "1.5", "abc", "Infinity", "1000001"].map((input, index) => row(`invalid-pennies-${index}`, [input], ["Enter a whole number of pennies from 0 through 1000000."])),
			row("canceled-pennies", [null], ["Penny entry canceled."])
		];
	}
	if (resource.project === "random-password") {
		return [row("minimum-random", [], ["a0".repeat(10)], { random: 0 }), row("maximum-random", [], ["z9".repeat(10)], { random: 1 - Number.EPSILON }), row("midpoint-random", [], ["n5".repeat(10)], { random: 0.5 }), row("literal-helper", [], ["n5".repeat(10), ...literal], { random: 0.5, probe: "text" })];
	}
	if (resource.project === "debugging-football") return [football("minimum-round", 0, ["N"], 1, -4, 1), football("maximum-round", 1 - Number.EPSILON, ["N"], 25, 10, 1), football("midpoint-round", 0.5, ["N"], 13, 3, 1), football("continue-two-rounds", 1 - Number.EPSILON, ["Y", "N"], 25, 10, 2), football("cancel-continuation", 0, [null], 1, -4, 1)];
	assert.fail(`Missing accumulator scenarios for ${resource.project}`);
}
export async function probeHelper(page) {
	await page.evaluate(() => {
		for (const value of ["Hello World!", "<b>Literal text</b>", "X".repeat(300)]) window.printToScreen(value);
	});
}
