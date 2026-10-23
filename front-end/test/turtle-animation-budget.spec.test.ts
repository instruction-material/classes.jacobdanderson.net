import { describe, expect, it } from "vitest";
import {
	createTurtleAnimationBudget,
	reserveTurtleAnimationStep,
	turtleMaximumAnimationMs,
	turtleMaximumSteps
} from "../src/modules/turtleAnimationBudget";

describe("Turtle animation budget", () => {
	it("bounds retained steps even when a drawing is repeatedly cleared", () => {
		let budget = createTurtleAnimationBudget();
		for (let step = 0; step < turtleMaximumSteps; step += 1)
			budget = reserveTurtleAnimationStep(budget, 0).budget;

		expect(budget.steps).toBe(turtleMaximumSteps);
		expect(() => reserveTurtleAnimationStep(budget, 0)).toThrow(
			"Turtle drawing limit reached"
		);
		expect(createTurtleAnimationBudget()).toEqual({
			steps: 0,
			durationMs: 0
		});
	});

	it("caps cumulative animation time but still accepts later drawing", () => {
		const first = reserveTurtleAnimationStep(
			createTurtleAnimationBudget(),
			turtleMaximumAnimationMs - 1
		);
		const second = reserveTurtleAnimationStep(first.budget, 900);
		const third = reserveTurtleAnimationStep(second.budget, 900);

		expect(first.durationMs).toBe(turtleMaximumAnimationMs - 1);
		expect(second.durationMs).toBe(1);
		expect(third.durationMs).toBe(0);
		expect(third.budget).toEqual({
			steps: 3,
			durationMs: turtleMaximumAnimationMs
		});
	});

	it("does not introduce nonfinite or negative animation time", () => {
		let budget = createTurtleAnimationBudget();
		for (const requested of [Number.NaN, Infinity, -500]) {
			const admitted = reserveTurtleAnimationStep(budget, requested);
			expect(admitted.durationMs).toBe(0);
			budget = admitted.budget;
		}
		expect(budget).toEqual({ steps: 3, durationMs: 0 });
	});
});
