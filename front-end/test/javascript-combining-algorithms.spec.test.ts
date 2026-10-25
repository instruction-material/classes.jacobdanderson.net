import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-combining-sources.json"), "utf8"));
function core(project: string, role = "reference") {
	const resource = fixture.resources.find((row: { project: string; role: string }) => row.project === project && row.role === role);
	const file = resource.files.find((row: { name: string }) => row.name === "script.js");
	return readFileSync(resolve("public/course-assets/javascript-level-1", file.path), "utf8").split(/\/\/\s*do not alter code[^\n]*/iu)[0];
}
function run(project: string, inputs: (string | null)[] = [], random = 0.5) {
	const output: unknown[] = [];
	const alerts: string[] = [];
	let promptCalls = 0;
	let randomCalls = 0;
	const math = Object.create(Math);
	math.random = () => {
		randomCalls++;
		return random;
	};
	new vm.Script(core(project)).runInNewContext({ Math: math, prompt: () => inputs[promptCalls++] ?? null, alert: (text: string) => alerts.push(text), printToScreen: (value: unknown) => output.push(value) }, { timeout: 500 });
	return { output, alerts, promptCalls, randomCalls };
}
describe("source-faithful accumulator references", () => {
	it.each([["0", 1], ["1", 1], ["5", 120], ["10", 3628800]])("keeps both sums and calculates %s factorial", (input, result) => {
		expect(run("totaling-up", [String(input)]).output).toEqual([5050, 338350, result]);
	});
	it("keeps 170 factorial finite and within floating-point precision of an exact integer oracle", () => {
		let exact = 1n;
		for (let i = 2n; i <= 170n; i++) exact *= i;
		const value = Number(run("totaling-up", ["170"]).output[2]);
		expect(Number.isFinite(value)).toBe(true);
		expect(Math.abs(value / Number(exact) - 1)).toBeLessThan(1e-12);
	});
	it.each(["", "   ", "-1", "1.5", "abc", "Infinity", "171"])("rejects invalid factorial input %j before looping", (input) => {
		expect(run("totaling-up", [input]).output).toEqual([5050, 338350, "Enter a whole number from 0 through 170."]);
	});
	it("reports cancellation after the two fixed sums", () => {
		expect(run("totaling-up", [null]).output).toEqual([5050, 338350, "Factorial entry canceled."]);
	});
	it.each([["0", [0, 0, 0, 0, 0]], ["4", [0, 0, 0, 0, 4]], ["25", [0, 1, 0, 0, 0]], ["41", [0, 1, 1, 1, 1]], ["99", [0, 3, 2, 0, 4]], ["100", [1, 0, 0, 0, 0]], ["187", [1, 3, 1, 0, 2]], ["1000000", [10000, 0, 0, 0, 0]]])("sorts %s pennies through all five denominations", (input, expected) => {
		const [dollars, quarters, dimes, nickels, pennies] = expected as number[];
		expect(run("coin-machine", [String(input)]).output).toEqual([`You have ${dollars} dollars, ${quarters} quarters, ${dimes} dimes, ${nickels} nickels, and ${pennies} pennies.`]);
		expect(dollars * 100 + quarters * 25 + dimes * 10 + nickels * 5 + pennies).toBe(Number(input));
	});
	it.each(["", "-1", "1.5", "abc", "Infinity", "1000001"])("rejects invalid penny input %j before repeated subtraction", (input) => {
		expect(run("coin-machine", [input]).output).toEqual(["Enter a whole number of pennies from 0 through 1000000."]);
	});
	it("reports canceled penny input", () => {
		expect(run("coin-machine", [null]).output).toEqual(["Penny entry canceled."]);
	});
	it.each([[0, "a0"], [1 - Number.EPSILON, "z9"], [0.5, "n5"]])("interleaves ten letters and ten digits at random boundary %s", (random, pair) => {
		const result = run("random-password", [], Number(random));
		expect(result.output).toEqual([String(pair).repeat(10)]);
		expect(result.randomCalls).toBe(20);
		expect(result.promptCalls).toBe(0);
	});
	it.each([[0, 1, -4], [1 - Number.EPSILON, 25, 10], [0.5, 13, 3]])("keeps the inclusive yard and gain bounds at %s", (random, start, gain) => {
		const result = run("debugging-football", ["N"], Number(random));
		expect(result.output).toEqual([`Our team is starting at yard number ${start}.`, ...[1, 2, 3, 4].map(i => `Our team on play number ${i} gained ${gain} yards! Wow!`), `The team advanced a total of ${4 * Number(gain)} yards, ending at yard ${Number(start) + 4 * Number(gain)}`]);
		expect(result.alerts).toEqual([`The amount of yards your team gained from those 4 plays was ${4 * Number(gain)}.`]);
		expect(result.randomCalls).toBe(5);
	});
	it.each([["Y", "N"], ["Y", null]])("keeps each round's gain distinct from the final yard with %j", (first, second) => {
		const result = run("debugging-football", [first, second], 1 - Number.EPSILON);
		expect(result.output).toHaveLength(10);
		expect(result.output.at(-1)).toBe("The team advanced a total of 80 yards, ending at yard 105");
		expect(result.alerts).toHaveLength(2);
		expect(result.randomCalls).toBe(9);
	});
	it("preserves the intended debugging starter's ReferenceError", () => {
		const output: unknown[] = [];
		let error: unknown;
		try {
			new vm.Script(core("debugging-football", "starter")).runInNewContext({ Math, printToScreen: (value: unknown) => output.push(value) }, { timeout: 500 });
		}
		catch (caught) { error = caught; }
		expect(error).toMatchObject({ name: "ReferenceError" });
		expect(String(error)).toContain("proceed");
		expect(output).toHaveLength(1);
	});
});
