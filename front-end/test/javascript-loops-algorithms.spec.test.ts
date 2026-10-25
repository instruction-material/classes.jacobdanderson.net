import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-loops-sources.json"), "utf8"));
function core(project: string, role = "reference") {
	const resource = fixture.resources.find((r: { project: string; role: string }) => r.project === project && r.role === role);
	const file = resource.files.find((f: { name: string }) => f.name === "script.js");
	return readFileSync(resolve("public/course-assets/javascript-level-1", file.path), "utf8").split(/\/\/\s*do not alter code[^\n]*/iu)[0];
}
function run(project: string, inputs: (string | null)[] = [], random = 0.5) {
	const output: unknown[] = [];
	let input = 0;
	let randomCalls = 0;
	const math = Object.create(Math);
	math.random = () => {
		randomCalls++;
		return random;
	};
	new vm.Script(core(project)).runInNewContext({ Math: math, prompt: () => inputs[input++] ?? null, printToScreen: (value: unknown) => output.push(value) }, { timeout: 500 });
	return { output, randomCalls };
}
describe("source-faithful loop references", () => {
	it("retains four base sequences and both original optional challenges", () => {
		const expected = [...Array.from({ length: 50 }, (_, i) => i + 1), ...Array.from({ length: 50 }, (_, i) => 50 - i), ...Array.from({ length: 50 }, (_, i) => 2 * (i + 1)), ...Array.from({ length: 50 }, (_, i) => 99 - 2 * i), 1, 3, 9, 27, 81, 500, 100, 20, 4];
		expect(run("for-loops").output).toEqual(expected);
		expect(expected).toHaveLength(209);
	});
	it.each(["A", "loop", "<b>x</b>", "😀a"])("prints indexed %s forward and backward", (word) => {
		const units = word.split("");
		expect(run("string-reversal", [word]).output).toEqual([...units, ...units.toReversed()]);
	});
	it.each(["", "   "])("rejects blank word %j", (word) => {
		expect(run("string-reversal", [word]).output).toEqual(["Enter a nonempty word."]);
	});
	it("cancels the word task without dereferencing null", () => {
		expect(run("string-reversal", [null]).output).toEqual(["Word entry canceled."]);
	});
	it("retains all twelve colored squares in order", () => {
		expect(run("looping-squares").output).toEqual([...Array.from({ length: 2 }).fill("red"), ...Array.from({ length: 3 }).fill("yellow"), ...Array.from({ length: 4 }).fill("blue"), ...Array.from({ length: 3 }).fill("purple")]);
	});
	it("prints only powers below 5000", () => {
		expect(run("powers-of-three").output).toEqual([1, 3, 9, 27, 81, 243, 729, 2187]);
	});
	it.each([
		["3", "4", 12],
		["3", "2.5", 7.5],
		["2.5", "3", 7.5],
		["2", "-3", -6],
		["-3", "2.5", -7.5],
		["-0.5", "-2", 1],
		["0", "1000000000000", 0],
		["1", "42", 42],
		["10000", "10001", 100010000]
	])("multiplies %s and %s by repeated addition", (a, b, expected) => {
		expect(run("repeated-addition", [String(a), String(b)]).output).toEqual([expected]);
	});
	it.each([["0.5", "0.25"], ["10001", "10002"]])("reports an unsupported repeat domain for %s and %s", (a, b) => {
		expect(run("repeated-addition", [a, b]).output).toEqual(["At least one input must be a whole repeat count from -10000 through 10000."]);
	});
	it.each([["", "3"], ["3", "abc"], ["Infinity", "3"], ["3", "Infinity"]])("rejects nonfinite or invalid %s and %s before looping", (a, b) => {
		expect(run("repeated-addition", [a, b]).output).toEqual(["Enter two finite numbers."]);
	});
	it.each([[null, "3"], ["3", null]])("distinguishes canceled multiplication input %j", (a, b) => {
		expect(run("repeated-addition", [a, b]).output).toEqual(["Multiplication canceled."]);
	});
	it("reports overflow without claiming a finite product", () => {
		expect(run("repeated-addition", ["1e308", "3"]).output).toEqual(["The product must be a finite number."]);
	});
	it("keeps multiplication operators out of the reference algorithm", () => {
		expect(core("repeated-addition").replace(/\/\/[^\n]*/gu, "")).not.toContain("*");
	});
	it.each([["minimum", 0, 50], ["maximum", 1 - Number.EPSILON, 500], ["midpoint", 0.5, 300]])("simulates five complete races at the %s random boundary", (_label, random, total) => {
		const result = run("debugging-loops", [], Number(random));
		expect(result.randomCalls).toBe(750);
		expect(result.output).toHaveLength(75);
		for (let race = 0; race < 5; race++) {
			expect(result.output.slice(race * 15, race * 15 + 15)).toEqual([
				`Race ${race + 1} begins in: `,
				...Array.from({ length: 10 }, (_, i) => `${10 - i}...`),
				"GO!!!!!!!!!",
				...[1, 2, 3].map(i => `Racer ${i} made it a total of ${total} feet!`)
			]);
		}
	});
	it("keeps the deliberate debugging starter syntax error", () => {
		let compiled: unknown;
		let error: unknown;
		try {
			compiled = new vm.Script(core("debugging-loops", "starter"));
		}
		catch (e) { error = e; }
		expect(compiled).toBeUndefined();
		expect(error).toMatchObject({ name: "SyntaxError" });
	});
});
