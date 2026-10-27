import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContext, runInContext } from "node:vm";
import { expect, it } from "vitest";

function drawing(project: string, role = "reference") {
	const source = readFileSync(
		resolve(
			"public/course-assets/javascript-level-2/canvas-v1",
			project,
			role,
			"script.js.txt"
		),
		"utf8"
	);
	const calls: { name: string; args: unknown[] }[] = [];
	const properties: Record<string, unknown> = {};
	const context = new Proxy(properties, {
		get:
			(_target, name: string) =>
			(...args: unknown[]) =>
				calls.push({ name, args }),
		set: (target, name: string, value) => {
			target[name] = value;
			return true;
		}
	});
	const canvas = { width: 300, height: 150, getContext: () => context };
	const caption = { textContent: "" };
	const scope = createContext({
		document: {
			getElementById: (id: string) =>
				id === "my-canvas" ? canvas : caption
		},
		window: { innerWidth: 390, innerHeight: 844 },
		Math
	});
	runInContext(source, scope, { timeout: 1000 });
	return {
		canvas,
		calls,
		properties,
		caption,
		read: (expression: string) =>
			runInContext(expression, scope, { timeout: 1000 })
	};
}

it("isolates the three independent shape paths and preserves the original coordinates", () => {
	const d = drawing("basic-shapes");
	expect(d.canvas).toMatchObject({ width: 1000, height: 500 });
	expect(d.calls.filter(c => c.name === "beginPath")).toHaveLength(2);
	expect(d.calls.find(c => c.name === "arc")?.args).toEqual([
		300,
		150,
		50,
		0,
		Math.PI * 2
	]);
	expect(d.calls.find(c => c.name === "fillRect")?.args).toEqual([
		100, 100, 100, 100
	]);
	expect(d.read("degreesToRadians(180)")).toBe(Math.PI);
});
it("keeps all five stars within a logical canvas even when the viewport is390pixels", () => {
	const d = drawing("shining-stars");
	expect(d.canvas).toMatchObject({ width: 1200, height: 320 });
	expect(d.calls.filter(c => c.name === "moveTo").map(c => c.args)).toEqual([
		[200, 100],
		[400, 100],
		[600, 100],
		[800, 100],
		[1000, 100]
	]);
	const coordinates = d.calls.filter(
		c => c.name === "moveTo" || c.name === "lineTo"
	);
	expect(Math.max(...coordinates.map(c => Number(c.args[0])))).toBe(1075);
	expect(d.calls.filter(c => c.name === "stroke")).toHaveLength(5);
});
it("retains the original card message while using dark text over the pink card", () => {
	const d = drawing("canvas-text");
	expect(d.calls.filter(c => c.name === "fillText").map(c => c.args)).toEqual(
		[["Happy Valentine's Day!", 350, 350]]
	);
	expect(d.properties.fillStyle).toBe("#6b1731");
	expect(d.caption.textContent).toContain("Happy Valentine's Day!");
});
it("repeats the three original landscape tree positions through one loop", () => {
	const d = drawing("loopy-landscape");
	expect(d.calls.filter(c => c.name === "moveTo").map(c => c.args)).toEqual([
		[10, 600],
		[110, 550],
		[210, 600]
	]);
	expect(
		d.calls
			.filter(c => c.name === "fillRect")
			.slice(2)
			.map(c => c.args)
	).toEqual([
		[50, 550, 20, 250],
		[150, 500, 20, 250],
		[250, 550, 20, 250]
	]);
	expect(d.calls.find(c => c.name === "arc")?.args).toEqual([
		600,
		200,
		100,
		0,
		Math.PI * 2
	]);
});
it("uses consistent price/date ticks for the original five plotted stock coordinates", () => {
	const d = drawing("jni-stock-price");
	expect(d.read("[priceToY(0),priceToY(100),priceToY(400)]")).toEqual([
		600, 500, 200
	]);
	expect(
		d.calls
			.filter(c => c.name === "lineTo")
			.slice(0, 4)
			.map(c => c.args)
	).toEqual([
		[300, 300],
		[400, 450],
		[500, 350],
		[600, 250]
	]);
	const labels = d.calls.filter(c => c.name === "fillText");
	expect(labels.slice(1, 6).map(c => c.args)).toEqual([
		["0", 140, 600],
		["100", 140, 500],
		["200", 140, 400],
		["300", 140, 300],
		["400", 140, 200]
	]);
	expect(labels.slice(6, 11).map(c => c.args)).toEqual([
		["1/1", 200, 650],
		["1/4", 300, 650],
		["1/7", 400, 650],
		["1/10", 500, 650],
		["1/13", 600, 650]
	]);
});
