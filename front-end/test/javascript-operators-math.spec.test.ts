import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-operators-sources.json"), "utf8"));
const root = resolve("public/course-assets/javascript-level-1");
function core(project: string, role = "reference") {
	const resource = fixture.resources.find((row: { project: string; role: string }) => row.project === project && row.role === role);
	const file = resource.files.find((row: { name: string }) => row.name === "script.js");
	return readFileSync(resolve(root, file.path), "utf8").split(/\/\/\s*do not alter code[^\n]*/iu)[0];
}
function run(project: string, inputs: (string | null)[] = [], random = 0.5, challenge = false) {
	const outputs: unknown[][] = [];
	const math = Object.create(Math);
	math.random = () => random;
	let index = 0;
	let source = core(project);
	if (challenge) source = source.replace("/*", "").replace("*/", "");
	new vm.Script(source).runInNewContext({ Math: math, prompt: () => inputs[index++] ?? null, printToScreen: (...args: unknown[]) => outputs.push(args) }, { timeout: 500 });
	return outputs;
}

describe("source-faithful math references", () => {
	it("calculates tax and tip from the entree and formats only the result", () => {
		expect(run("tips-and-taxes", ["20", "10", "15"])).toEqual([["The total cost of the meal is $25.00"]]);
		expect(run("tips-and-taxes", ["10.1", "8.25", "15"])).toEqual([["The total cost of the meal is $12.45"]]);
		expect(run("tips-and-taxes", ["0", "0", "0"])).toEqual([["The total cost of the meal is $0.00"]]);
	});
	it.each(["abc", "", "-1", "Infinity"])("rejects invalid meal input %s", (input) => {
		expect(run("tips-and-taxes", [input, "10", "15"])).toEqual([["Enter nonnegative finite numbers for the cost and percentages."]]);
	});
	it("distinguishes cancellation and numeric overflow", () => {
		expect(run("tips-and-taxes")).toEqual([["Meal calculation canceled."]]);
		expect(run("tips-and-taxes", ["1.7976931348623157e308", "100", "100"])).toEqual([["The meal total must be a finite number."]]);
	});
	it("preserves the exact mathematical password", () => {
		expect(run("math-password")).toEqual([[0.09625672175876687]]);
	});
	it.each([0, 3, 4, 10, 13, Number.MAX_SAFE_INTEGER])("divides %s whole pies among four contestants", (pies) => {
		const quotient = Math.floor(pies / 4);
		const remainder = pies - quotient * 4;
		expect(run("pie-eating-contest", [String(pies)])).toEqual([[`There were ${pies} pie(s) received, so each contestant received ${quotient} pies each and we had ${remainder} leftover pies.`]]);
	});
	it.each(["", "-1", "4.5", "abc", "9007199254740992"])("rejects invalid pie count %s", (input) => {
		expect(run("pie-eating-contest", [input])).toEqual([["Enter a nonnegative safe whole number of pies."]]);
	});
	it("does not turn a canceled pie count into zero", () => {
		expect(run("pie-eating-contest")).toEqual([["Pie allocation canceled."]]);
	});
	it("covers all five integer range endpoints", () => {
		expect(run("random-practice", [], 0)).toEqual([[0], [1], [20], [0], [51]]);
		expect(run("random-practice", [], 1 - Number.EPSILON)).toEqual([[5], [10], [50], [50], [101]]);
	});
	it("retains the daytime party limits and clock formatting", () => {
		expect(run("random-party", [], 0)).toEqual([["The party will take place on 5/1 at 10:00."]]);
		expect(run("random-party", [], 1 - Number.EPSILON)).toEqual([["The party will take place on 7/30 at 20:59."]]);
		expect(run("random-party", ["1"], 0, true).at(-1)).toEqual(["The party will take place on 12/1 at 10:00."]);
		expect(run("random-party", ["12"], 1 - Number.EPSILON, true).at(-1)).toEqual(["The party will take place on 1/30 at 20:59."]);
	});
	it.each(["0", "13", "1.5", "", "abc"])("rejects invalid challenge birth month %s", (input) => {
		expect(run("random-party", [input], 0, true).at(-1)).toEqual(["Enter a whole birth month from 1 through 12."]);
	});
	it("retains three arc sweeps and their radians", () => {
		const arcs = run("arc-circles");
		expect(arcs).toHaveLength(3);
		for (const [i, degrees] of [[-90, 90], [0, 360], [0, 270]].entries()) {
			expect(arcs[i][0]).toBeCloseTo(degrees[0] * Math.PI / 180, 12);
			expect(arcs[i][1]).toBeCloseTo(degrees[1] * Math.PI / 180, 12);
		}
	});
	it("preserves signed remainder, exponent order and rounding up", () => {
		expect(run("debugging-math", ["2"], 0).at(-1)).toEqual(["After being divided by 11, rounding up, your number is 16"]);
		expect(run("debugging-math", ["2"], 1 - Number.EPSILON).at(-1)).toEqual(["After being divided by 11, rounding up, your number is 237"]);
		expect(run("debugging-math", [], 0).at(-1)).toEqual(["Math practice canceled."]);
		expect(run("debugging-math", ["abc"], 0).at(-1)).toEqual(["Enter a finite exponent."]);
		expect(run("debugging-math", ["0.5"], 0).at(-1)).toEqual(["The power must be a finite real number."]);
	});
	it("keeps the deliberate debugging starter syntax error", () => {
		let failure: unknown;
		let compiled: unknown;
		try {
			compiled = new vm.Script(core("debugging-math", "starter"));
		}
		catch (error) {
			failure = error;
		}
		expect(failure).toMatchObject({ name: "SyntaxError" });
		expect(compiled).toBeUndefined();
	});
});
