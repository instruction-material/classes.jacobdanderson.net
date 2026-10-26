import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContext, runInContext, Script } from "node:vm";
import { expect, it } from "vitest";

const root = resolve("public/course-assets/javascript-level-2/functions-v1");
function source(project: string, role = "reference") {
	return readFileSync(resolve(root, project, role, "script.js.txt"), "utf8");
}
function example(project: string, random = () => 0.5) {
	const printed: string[] = [];
	const choice = { value: "" };
	const math = Object.create(Math);
	math.random = random;
	const context = createContext({
		Math: math,
		printToScreen: (value: unknown) => printed.push(String(value)),
		document: { querySelector: () => choice }
	});
	runInContext(source(project), context, { timeout: 1000 });
	return {
		printed,
		choice,
		math,
		read: (text: string) => runInContext(text, context, { timeout: 1000 })
	};
}

it("returns arithmetic values with independent factorial and power state", () => {
	const e = example("functions-practice");
	expect(
		e.read("[add(13,18),subtract(13,18),multiply(13,18,10),average(13,18)]")
	).toEqual([31, -5, 2340, 15.5]);
	expect(
		e.read(
			"[factorial(0),factorial(4),exponent(2,0),exponent(2,1),exponent(2,5),factorial(3)]"
		)
	).toEqual([1, 24, 1, 2, 32, 6]);
	expect(e.read("typeof answer")).toBe("undefined");
	for (const call of [
		"factorial(-1)",
		"factorial(1.5)",
		"factorial(171)",
		"exponent(2,-1)",
		"exponent(2,1.5)",
		"exponent(10,1000)"
	])
		expect(() => e.read(call)).toThrow();
});

it("compares the original sample fares at the whole-ride break-even boundary", () => {
	const e = example("which-metrocard");
	expect(
		e.read(
			"[calculateSavings(30),calculateSavings(45),calculateSavings(60),calculateSavings(46),calculateSavings(47)]"
		)
	).toEqual([-44.5, -3.25, 38, -0.5, 2.25]);
	expect(e.read("suggestCard(0)")).toBe("Both plans cost the same.");
	for (const call of [
		"calculateSavings(-1)",
		"calculateSavings(1.5)",
		"calculateSavings(null)",
		"calculateSavings(Infinity)"
	])
		expect(() => e.read(call)).toThrow();
});

it("checks all nine RPS results and preserves scores and randomness on cancel", () => {
	let draws = 0;
	const e = example("rock-paper-scissors", () => {
		draws++;
		return 0;
	});
	expect(
		e.read(
			"['rock','paper','scissors'].flatMap(p=>['rock','paper','scissors'].map(c=>findResult(p,c)))"
		)
	).toEqual([
		"tie",
		"lose",
		"win",
		"win",
		"tie",
		"lose",
		"lose",
		"win",
		"tie"
	]);
	expect(e.read("findResult('nothing','rock')")).toBe("invalid");
	expect(e.read("playRound()")).toMatchObject({
		result: "cancelled",
		round: 1,
		playerWins: 0,
		computerWins: 0
	});
	expect(draws).toBe(0);
	e.choice.value = "invalid";
	expect(e.read("playRound()")).toMatchObject({
		result: "invalid",
		round: 1,
		playerWins: 0,
		computerWins: 0
	});
	expect(draws).toBe(0);
	e.choice.value = "rock";
	expect(e.read("playRound()")).toMatchObject({
		result: "tie",
		round: 1,
		playerWins: 0,
		computerWins: 0
	});
	e.choice.value = "paper";
	for (let round = 2; round <= 4; round++)
		expect(e.read("playRound()")).toMatchObject({
			result: "win",
			round,
			playerWins: round - 1
		});
	const finishedDraws = draws;
	expect(e.read("playRound()")).toMatchObject({
		result: "finished",
		playerWins: 3,
		computerWins: 0,
		finished: true
	});
	expect(draws).toBe(finishedDraws);
	e.read("resetMatch()");
	e.choice.value = "scissors";
	for (let round = 1; round <= 3; round++)
		expect(e.read("playRound()")).toMatchObject({
			result: "lose",
			round,
			computerWins: round
		});
	expect(e.read("playRound()")).toMatchObject({
		result: "finished",
		playerWins: 0,
		computerWins: 3
	});
});

it("checks triangle validity, side ordering and scale-independent right angles", () => {
	const e = example("geometry-functions");
	expect(e.read("circumference(1)")).toBeCloseTo(2 * Math.PI);
	expect(e.read("circleArea(1)")).toBeCloseTo(Math.PI);
	expect(e.read("equilateralTriangleArea(2)")).toBeCloseTo(Math.sqrt(3));
	expect(
		e.read(
			"[triangleType(3,3,3),triangleType(3,3,4),triangleType(3,4,5),triangleType(1,2,3),triangleType(0,4,5)]"
		)
	).toEqual([
		"equilateral",
		"isosceles",
		"scalene",
		"invalid triangle",
		"invalid triangle"
	]);
	for (const sides of [
		"3,4,5",
		"5,3,4",
		"4,5,3",
		"3e-9,4e-9,5e-9",
		"3e100,4e100,5e100"
	])
		expect(e.read(`isRightTriangle(${sides})`)).toBe(true);
	expect(e.read("isRightTriangle(1e-9,1e-9,1e-9)")).toBe(false);
	expect(e.read("isRightTriangle(1,2,10)")).toBe(false);
	expect(() => e.read("circumference(-1)")).toThrow();
});

it("keeps fuel arithmetic numeric and rejects unusable units", () => {
	const e = example("pain-at-the-pump");
	expect(
		e.read(
			"[totalCost(10,10000,3),totalCost(25,10000,3),totalCost(50,10000,3)]"
		)
	).toEqual([3000, 1200, 600]);
	expect(e.read("typeof totalCost(25,10000,3)")).toBe("number");
	expect(e.read("totalCost(25,0,3)")).toBe(0);
	for (const call of [
		"totalCost(0,10000,3)",
		"totalCost(-1,10000,3)",
		"totalCost(25,-1,3)",
		"totalCost(25,10000,NaN)"
	])
		expect(() => e.read(call)).toThrow();
});

it("draws valid ranks and suits at the random boundaries and scores ten rounds", () => {
	let index = 0;
	const sequence = [0, 0, 0.999999, 0.999999];
	const e = example("game-of-war", () => sequence[index++ % sequence.length]);
	expect(e.read("[p1Score,p2Score]")).toEqual([10, 0]);
	expect(e.printed.filter(line => line.includes(" drew a "))).toHaveLength(
		20
	);
	expect(e.printed.at(-1)).toBe("Player 1 wins the simulation.");
	for (const [suit, value] of [
		["Spades", 0],
		["Clubs", 0.25],
		["Hearts", 0.5],
		["Diamonds", 0.75]
	] as const) {
		let draw = 0;
		e.math.random = () => (draw++ % 2 ? value : 0);
		expect(e.read("drawCard('Player 1')")).toBe(14);
		expect(e.printed.at(-1)).toBe(`Player 1 drew a Ace of ${suit}!`);
	}
});

it("uses whole-pack purchasing and finds the first qualifying coffee quantity", () => {
	const e = example("debugging-functions");
	expect(e.read("dailyCost(0)")).toBe(130);
	expect(e.read("calculateProfit(81)")).toBe(-0.99);
	expect(e.read("calculateProfit(82)")).toBe(0.99);
	expect(e.read("calculateProfit(100)")).toBe(36.63);
	expect(e.read("calculateProfit(101)")).toBe(36.12);
	for (const goal of [0, 200, 1000, 10000]) {
		const cups = e.read(`reachProfitGoal(${goal})`);
		expect(e.read(`calculateProfit(${cups})`)).toBeGreaterThanOrEqual(goal);
		expect(
			e.read(
				`Array.from({length:${cups}},(_,n)=>calculateProfit(n)).every(profit=>profit<${goal})`
			)
		).toBe(true);
	}
	for (const call of [
		"reachProfitGoal(-1)",
		"reachProfitGoal(Infinity)",
		"dailyCost(1.5)"
	])
		expect(() => e.read(call)).toThrow();
});

it("retains the intentional coffee syntax exercise and keeps the other starters parseable", () => {
	expect(
		() => new Script(source("debugging-functions", "starter"))
	).toThrow();
	for (const project of [
		"functions-practice",
		"which-metrocard",
		"rock-paper-scissors",
		"geometry-functions",
		"pain-at-the-pump",
		"game-of-war"
	])
		expect(() => new Script(source(project, "starter"))).not.toThrow();
});
