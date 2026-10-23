export const turtleMaximumSteps = 4096;
export const turtleMaximumAnimationMs = 15_000;

export interface TurtleAnimationBudget {
	steps: number;
	durationMs: number;
}

export function createTurtleAnimationBudget(): TurtleAnimationBudget {
	return { steps: 0, durationMs: 0 };
}

export function assertTurtleStepAvailable(budget: TurtleAnimationBudget) {
	if (budget.steps >= turtleMaximumSteps) {
		throw new Error(
			"Turtle drawing limit reached (4,096 steps). Start a new run or draw fewer steps."
		);
	}
}

export function reserveTurtleAnimationStep(
	budget: TurtleAnimationBudget,
	requestedDurationMs: number
): { budget: TurtleAnimationBudget; durationMs: number } {
	assertTurtleStepAvailable(budget);

	const durationMs = Math.min(
		Number.isFinite(requestedDurationMs)
			? Math.max(0, requestedDurationMs)
			: 0,
		Math.max(0, turtleMaximumAnimationMs - budget.durationMs)
	);
	return {
		budget: {
			steps: budget.steps + 1,
			durationMs: budget.durationMs + durationMs
		},
		durationMs
	};
}
