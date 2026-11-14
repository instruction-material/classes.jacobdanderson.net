import { describe, expect, it } from "vitest";
import {
	ORBIT_MODEL,
	advanceOrbitTrial,
	changeRetrieverSpeed,
	createOrbitTrial,
	orbitCircumference,
	orbitPosition
} from "@/modules/orbitExperiment";

describe("classroom orbit experiment", () => {
	it("starts on opposite axes with the supplied radius, units and speed", () => {
		const start = createOrbitTrial(2);
		expect(orbitPosition(2, start.teslaTurns).x).toBe(2);
		expect(orbitPosition(2, start.retrieverTurns).x).toBe(-2);
		expect(start.speed).toBe(60000);
		expect(orbitCircumference(2)).toBe(1230880000);
	});
	it("retains a half-lap separation at equal speeds", () => {
		const result = advanceOrbitTrial(
			createOrbitTrial(),
			1230880000 / 60000
		);
		expect(result.interceptHours).toBeNull();
		expect(result.teslaTurns).toBeCloseTo(1, 12);
		expect(result.retrieverTurns).toBeCloseTo(1.5, 12);
	});
	it("never calls an angular alignment an intercept on different circles", () => {
		for (const radius of [0.5, 1, 1.9, 2.1, 3]) {
			const result = advanceOrbitTrial(
				changeRetrieverSpeed(createOrbitTrial(radius), 1),
				10000000
			);
			expect(result.interceptHours).toBeNull();
			const p = orbitPosition(radius, result.retrieverTurns);
			expect(Math.hypot(p.x, p.y)).toBeCloseTo(radius, 10);
		}
	});
	it("stops at the first meeting inside a large time step", () => {
		const result = advanceOrbitTrial(
			changeRetrieverSpeed(createOrbitTrial(), 1),
			10000000
		);
		const expectedHours = 615440000 / 150;
		expect(result.hours).toBeCloseTo(expectedHours, 4);
		expect(result.interceptHours).toBe(result.hours);
		expect(result.teslaTurns).toBeCloseTo(200, 8);
		expect(result.retrieverTurns).toBeCloseTo(201, 8);
		expect(result.retrieverTurns - 0.5).toBeCloseTo(200.5, 8);
		expect(orbitPosition(2, result.teslaTurns).x).toBeCloseTo(2, 8);
		expect(orbitPosition(2, result.teslaTurns).y).toBeCloseTo(0, 8);
	});
	it("preserves traveled positions when speed changes mid-trial", () => {
		const equal = advanceOrbitTrial(createOrbitTrial(), 1000);
		const faster = changeRetrieverSpeed(equal, 1);
		expect(faster.hours).toBe(equal.hours);
		expect(faster.teslaTurns).toBe(equal.teslaTurns);
		expect(faster.retrieverTurns).toBe(equal.retrieverTurns);
		const result = advanceOrbitTrial(faster, 10000000);
		expect(result.interceptHours).toBeCloseTo(1000 + 615440000 / 150, 4);
	});
	it("also detects Tesla meeting a slower or stationary retriever", () => {
		const result = advanceOrbitTrial(
			changeRetrieverSpeed(createOrbitTrial(), -400),
			1000000
		);
		expect(result.interceptHours).toBeCloseTo(615440000 / 60000, 7);
		expect(orbitPosition(2, result.teslaTurns).x).toBeCloseTo(-2, 8);
		expect(orbitPosition(2, result.retrieverTurns).x).toBeCloseTo(-2, 8);
	});
	it("has the same event across coarse and fine time partitions", () => {
		let fine = changeRetrieverSpeed(createOrbitTrial(), 2);
		for (let i = 0; i < 100; i++) fine = advanceOrbitTrial(fine, 50000);
		const coarse = advanceOrbitTrial(
			changeRetrieverSpeed(createOrbitTrial(), 2),
			5000000
		);
		expect(fine.interceptHours).toBeCloseTo(coarse.interceptHours!, 4);
		expect(fine.teslaTurns).toBeCloseTo(100, 8);
		expect(advanceOrbitTrial(fine, 1)).toBe(fine);
	});
	it("rejects invalid inputs and caps long-running trials and speeds", () => {
		for (const r of [NaN, Infinity, 0.49, 3.01])
			expect(() => createOrbitTrial(r)).toThrow(RangeError);
		for (const h of [NaN, Infinity, -1, ORBIT_MODEL.maxHours + 1])
			expect(() => advanceOrbitTrial(createOrbitTrial(), h)).toThrow(
				RangeError
			);
		expect(() => changeRetrieverSpeed(createOrbitTrial(), 0.5)).toThrow(
			RangeError
		);
		expect(changeRetrieverSpeed(createOrbitTrial(), -10000).speed).toBe(0);
		expect(changeRetrieverSpeed(createOrbitTrial(), 10000).speed).toBe(
			300000
		);
		const end = advanceOrbitTrial(
			createOrbitTrial(3),
			ORBIT_MODEL.maxHours
		);
		expect(advanceOrbitTrial(end, 10).hours).toBe(ORBIT_MODEL.maxHours);
	});
});
