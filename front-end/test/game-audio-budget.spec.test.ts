import { expect, it } from "vitest";
import { createGameAudioBudget } from "@/modules/gameAudioBudget";

it("limits concurrent sounds and tones without rejecting ordinary overlap", () => {
	const budget = createGameAudioBudget();
	const releases = Array.from({ length: 32 }, () => budget.acquire(0));
	expect(releases.every(Boolean)).toBe(true);
	expect(budget.acquire(0)).toBeNull();
	releases[0]?.();
	expect(budget.acquire(0)).not.toBeNull();
});

it("bounds rapid stop and replay without leaking capacity", () => {
	const budget = createGameAudioBudget();
	for (let count = 0; count < 64; count += 1) {
		const release = budget.acquire(0);
		expect(release).not.toBeNull();
		release?.();
		release?.();
	}
	expect(budget.acquire(0)).toBeNull();
	expect(budget.acquire(500)).not.toBeNull();
});

it("charges finite sound repeats against the same start limit", () => {
	const budget = createGameAudioBudget();
	const releases = Array.from({ length: 32 }, () => budget.acquire(0));
	expect(releases.every(Boolean)).toBe(true);
	for (let count = 0; count < 32; count += 1)
		expect(budget.allowRestart(0)).toBe(true);
	expect(budget.allowRestart(0)).toBe(false);
	expect(budget.allowRestart(1000)).toBe(true);
	releases.forEach(release => release?.());
});
