import assert from "node:assert/strict";

const literal = ["Hello World!", "<b>Literal text</b>", "X".repeat(300)];
const row = (name, inputs, text, extra = {}) => ({ name, inputs, text, ...extra });
const fruitIntro = "Choose a color and taste to follow the exercise's fruit rules.";
const starterFruitIntro = "Tell me what your favorite color and taste is and I'll tell you what your favorite fruit is!";
export function scenarios(resource) {
	if (resource.role === "starter") {
		if (resource.project === "login-credentials") return [row("unfinished-starter", [], [])];
		if (resource.project === "debugging-favorite-fruit") {
			return [
				row("preserved-nesting-bug", ["red", "sour"], ["Nice! So your favorite fruit(s) are ."], { alerts: [starterFruitIntro] }),
				row("debugging-helper", ["red", "sour"], ["Nice! So your favorite fruit(s) are .", ...literal], { alerts: [starterFruitIntro], probe: "text" })
			];
		}
		return [row("unfinished-starter", [], []), row("supplied-helper", [], literal, { probe: "text" })];
	}
	if (resource.project === "a-checker") {
		return [
			row("contains-a", ["banana"], ["banana has an 'a' in it!"]),
			row("missing-a", ["kiwi"], ["kiwi does not have an 'a' in it!"]),
			row("case-sensitive", ["ARROW"], ["ARROW does not have an 'a' in it!"]),
			row("literal-input", ["<b>a</b>"], ["<b>a</b> has an 'a' in it!"]),
			row("canceled-word", [null], ["Word entry canceled."]),
			...["", "  "].map((s, i) => row(`blank-word-${i}`, [s], ["Enter a nonempty word."]))
		];
	}
	if (resource.project === "grade-checker") {
		return [
			...[["0", "F"], ["59.99", "F"], ["60", "D"], ["69.99", "D"], ["70", "C"], ["79.99", "C"], ["80", "B"], ["89.99", "B"], ["90", "A"], ["100", "A"]].map(([s, grade]) => row(`grade-${s}`, [s], [`The grade is ${grade === "A" || grade === "F" ? "an" : "a"} ${grade}`])),
			...["", "  ", "abc", "Infinity", "-1", "100.1"].map((s, i) => row(`invalid-grade-${i}`, [s], ["Enter a finite percentage from 0 through 100."])),
			row("canceled-grade", [null], ["Grade entry canceled."])
		];
	}
	if (resource.project === "wholesome-memes") {
		return [
			row("sentence", ["HELLO WORLD"], ["hElLo wOrLd"]),
			row("spaces-count-as-positions", ["a b!"], ["a b!"]),
			row("canceled-conversion", [null], ["Conversion canceled."]),
			row("blank-conversion", [" "], ["Enter a nonempty word or sentence."]),
			row("long-word", ["X".repeat(300)], ["xX".repeat(150)])
		];
	}
	if (resource.project === "login-credentials") {
		const canceled = ["Demo login canceled."];
		const accepted = ["Demo login accepted."];
		return [
			row("matching-demo", ["otter", "river", "otter", "river"], [], { alerts: accepted }),
			row("retry-both", ["otter", "river", "wrong", "otter", "wrong", "river"], [], { alerts: accepted }),
			row("case-sensitive-demo", ["Otter", "River", "otter", "Otter", "river", "River"], [], { alerts: accepted }),
			row("spaces-preserved", [" otter ", " river ", "otter", " otter ", "river", " river "], [], { alerts: accepted }),
			row("blank-username", ["  "], [], { alerts: ["Choose a nonblank fictional username."] }),
			row("blank-password", ["otter", ""], [], { alerts: ["Choose a nonblank fictional password."] }),
			...[[null], ["otter", null], ["otter", "river", null], ["otter", "river", "wrong", null], ["otter", "river", "otter", null], ["otter", "river", "otter", "wrong", null]].map((inputs, i) => row(`canceled-demo-${i}`, inputs, [], { alerts: canceled }))
		];
	}
	if (resource.project === "snake-eyes") {
		return [
			row("one-sided", ["1"], ["Roll 1: 1 and 1", "It took 1 rolls to get two 1's"], { random: 1 - Number.EPSILON, randomCalls: 2 }),
			row("minimum-roll", ["6"], ["Roll 1: 1 and 1", "It took 1 rolls to get two 1's"], { random: 0, randomCalls: 2 }),
			row("independent-pairs", ["6"], ["Roll 1: 4 and 1", "Roll 2: 1 and 1", "It took 2 rolls to get two 1's"], { randomSequence: [0.5, 0, 0, 0], randomCalls: 4 }),
			row("maximum-side-bound", ["100"], ["Roll 1: 100 and 1", "Roll 2: 1 and 1", "It took 2 rolls to get two 1's"], { randomSequence: [1 - Number.EPSILON, 0, 0, 0], randomCalls: 4 }),
			row("stop-long-roll", ["100"], ["Roll 1: 51 and 51", "Roll 2: 51 and 51", "Roll 3: 51 and 51"], { random: 0.5, stopRolling: true }),
			...["", "  ", "0", "-1", "1.5", "abc", "Infinity", "101"].map((s, i) => row(`invalid-dice-${i}`, [s], ["Enter a whole number of sides from 1 through 100."], { randomCalls: 0 })),
			row("canceled-dice", [null], ["Dice entry canceled."], { randomCalls: 0 })
		];
	}
	if (resource.project === "debugging-favorite-fruit") {
		return [
			...[["red", "sour", "cherries"], ["yellow", "sour", "pineapples"], ["green", "sour", "lime"], ["blue", "sweet", "blueberries"], ["yellow", "sweet", "mango"], [" YELLOW ", " SWEET ", "mango"]].map(([color, taste, fruit], i) => row(`fruit-${i}`, [color, taste], [`Nice! So your favorite fruit(s) are ${fruit}.`], { alerts: [fruitIntro] })),
			row("unmatched-pair", ["red", "sweet"], ["No fruit matches that color and taste in this exercise."], { alerts: [fruitIntro] }),
			row("blank-pair", ["", ""], ["No fruit matches that color and taste in this exercise."], { alerts: [fruitIntro] }),
			row("canceled-color", [null], ["Fruit entry canceled."], { alerts: [fruitIntro] }),
			row("canceled-taste", ["red", null], ["Fruit entry canceled."], { alerts: [fruitIntro] })
		];
	}
	assert.fail(`Missing conditional scenarios for ${resource.project}`);
}
export async function probeHelper(page) {
	await page.evaluate(() => {
		for (const value of ["Hello World!", "<b>Literal text</b>", "X".repeat(300)]) window.printToScreen(value);
	});
}
