import assert from "node:assert/strict";

const literal = ["Hello World!", "<b>Literal text</b>", "X".repeat(300)];
const row = (name, inputs, text, extra = {}) => ({ name, inputs, text, ...extra });
const warning = (level, messages, hours) => `Uh oh! ${messages} messages in ${hours} hours might be bugging ${level === "acquaintance" ? "an" : "a"} ${level}.`;
const houses = [["Gryffindor", "bravery"], ["Slytherin", "cunning"], ["Ravenclaw", "wisdom"], ["Hufflepuff", "hard work"]];
export function scenarios(resource) {
	if (resource.role === "starter") {
		if (resource.project === "debugging-bugging-friends") {
			const wrong = [warning("acquaintance", "25", "1"), warning("best friend", "25", "1")];
			return [
				row("preserved-compound-bugs", ["friend", "25", "1"], wrong, { intentionalStarterLogicBug: true }),
				row("preserved-compound-helper", ["friend", "25", "1"], [...wrong, ...literal], { intentionalStarterLogicBug: true, probe: "text" })
			];
		}
		return [row("unfinished-starter", [], []), row("supplied-helper", [], literal, { probe: "text" })];
	}
	if (resource.project === "sorting-hat") {
		return [
			...houses.map(([house, quality]) => row(`matching-${house}`, [house, quality], [`You get ${house}! Congratulations!`])),
			...houses.map(([house]) => row(`mismatch-${house}`, [house, "another quality"], [`Aw... Looks like ${house} is not for you. Try again!`])),
			row("unknown-house", ["unknown", "bravery"], ["Strange... That might be a new house..."]),
			row("case-sensitive-house", ["gryffindor", "bravery"], ["Strange... That might be a new house..."]),
			row("case-sensitive-quality", ["Gryffindor", "Bravery"], ["Aw... Looks like Gryffindor is not for you. Try again!"]),
			row("canceled-house", [null], ["Sorting canceled."]),
			row("canceled-quality", ["Ravenclaw", null], ["Sorting canceled."])
		];
	}
	if (resource.project === "fizzbuzz") {
		const text = Array.from({ length: 50 }, (_, index) => {
			const value = index + 1;
			return value % 15 === 0 ? "FizzBuzz" : value % 3 === 0 ? "Fizz" : value % 5 === 0 ? "Buzz" : String(value);
		});
		return [row("all-fifty-values", [], text)];
	}
	if (resource.project === "gcf-two-numbers") {
		const invalid = ["Enter two positive whole numbers from 1 through 1000000."];
		return [
			...[["36", "24", "12"], ["24", "36", "12"], ["8", "15", "1"], ["18", "18", "18"], ["1", "1000000", "1"], ["1000000", "1000000", "1000000"], [" 36 ", "24", "12"]].map(([a, b, answer], index) => row(`factor-${index}`, [a, b], [answer])),
			...["", " ", "0", "-12", "1.5", "abc", "Infinity", "1000001"].flatMap((value, index) => [row(`invalid-first-${index}`, [value, "24"], invalid), row(`invalid-second-${index}`, ["36", value], invalid)]),
			row("canceled-first", [null], ["GCF entry canceled."]),
			row("canceled-second", ["36", null], ["GCF entry canceled."])
		];
	}
	if (resource.project === "animal-sounds") {
		return [
			...[["dog", "woof"], ["cat", "meow"], ["cow", "moo"], ["bee", "buzz"], ["frog", "ribbit"], ["fox", "ring ding ding ding ding"]].map(([animal, sound]) => row(`animal-${animal}`, [animal], [sound])),
			...["unknown", "Dog", "", "<b>cat</b>"].map((animal, index) => row(`unknown-animal-${index}`, [animal], ["huh?"])),
			row("canceled-animal", [null], ["Animal entry canceled."])
		];
	}
	if (resource.project === "debugging-bugging-friends") {
		const okay = ["You should be good!"];
		const invalid = ["Enter a nonnegative safe whole message count and finite hours greater than zero."];
		return [
			...[["acquaintance", 10], ["friend", 25], ["good friend", 50], ["best friend", 200]].flatMap(([level, threshold]) => [-1, 0, 1].map(delta => row(`${level}-${delta}`, [level, String(threshold + delta), "1"], delta > 0 ? [warning(level, String(threshold + delta), "1")] : okay))),
			row("fractional-hour-equality", ["friend", "50", "2"], okay),
			row("fractional-rate-above", ["friend", "51", "2"], [warning("friend", "51", "2")]),
			row("half-hour-equality", ["friend", "5", "0.2"], okay),
			row("zero-messages", ["acquaintance", "0", "1"], okay),
			...[["", "1"], [" ", "1"], ["-1", "1"], ["0.5", "1"], ["Infinity", "1"], ["9007199254740992", "1"], ["abc", "1"], ["26", ""], ["26", " "], ["26", "0"], ["26", "-1"], ["26", "Infinity"], ["26", "abc"]].map(([messages, hours], index) => row(`invalid-rate-${index}`, ["friend", messages, hours], invalid)),
			...["unknown", "Friend", ""].map((level, index) => row(`unknown-level-${index}`, [level], ["Choose acquaintance, friend, good friend, or best friend."])),
			...[[null], ["friend", null], ["friend", "26", null]].map((inputs, index) => row(`canceled-message-${index}`, inputs, ["Message entry canceled."]))
		];
	}
	assert.fail(`Missing advanced conditional scenarios for ${resource.project}`);
}

export async function probeHelper(page) {
	await page.evaluate(() => {
		for (const value of ["Hello World!", "<b>Literal text</b>", "X".repeat(300)]) window.printToScreen(value);
	});
}
