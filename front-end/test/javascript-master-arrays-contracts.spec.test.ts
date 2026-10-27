import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContext, runInContext } from "node:vm";
import { expect, it } from "vitest";

const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-master-arrays-sources.json"),
		"utf8"
	)
);
function run(project: string, random = 0.5) {
	const output: string[] = [];
	const shapes: {
		x: number;
		y: number;
		w: number;
		h: number;
		color: string;
	}[] = [];
	const ctx = {
		fillStyle: "",
		beginPath() {},
		closePath() {},
		rect(x: number, y: number, w: number, h: number) {
			shapes.push({ x, y, w, h, color: "" });
		},
		fill() {
			shapes[shapes.length - 1].color = this.fillStyle;
		}
	};
	const canvas = { width: 0, height: 0, getContext: () => ctx };
	const description = {
		textContent: "",
		append: (line: { textContent: string }) => output.push(line.textContent)
	};
	const context = createContext({
		console: { log: (value: unknown) => output.push(String(value)) },
		Math: Object.assign(Object.create(Math), { random: () => random }),
		document: {
			getElementById: (id: string) =>
				id === "my-canvas" ? canvas : description,
			createElement: () => ({ textContent: "" })
		},
		d3: {
			select: () => ({
				append: () => ({ text: (value: string) => output.push(value) })
			})
		}
	});
	const resource = fixture.resources.find(
		(r: { project: string; role: string }) =>
			r.project === project && r.role === "reference"
	);
	const source = readFileSync(
		resolve(
			"public/course-assets/javascript-level-2",
			resource.files.find((f: { name: string }) => f.name === "script.js")
				.path
		),
		"utf8"
	);
	runInContext(source, context, { timeout: 1000 });
	return { context, output, shapes };
}

it("handles exact squares, nonmutating slices, empty endpoints and both random limits", () => {
	for (const random of [0, 0.999999]) {
		const result = run("foray-into-arrays", random);
		expect(JSON.parse(result.output[1])).toEqual(
			Array.from({ length: 20 }, (_, i) => (i + 1) ** 2)
		);
		expect(JSON.parse(result.output[2])).toEqual(
			Array.from({ length: 11 }, (_, i) => (i + 5) ** 2)
		);
		expect(runInContext("sumOfArray([])", result.context)).toBe(0);
		expect(
			runInContext(
				"[hasSameFirstAndLast([]),hasSameFirstAndLast([7]),hasSameFirstAndLast([7,2,7]),hasSameFirstAndLast([7,2])]",
				result.context
			)
		).toEqual([false, true, true, false]);
		expect(JSON.parse(result.output[5])).toEqual(
			Array(10).fill(random === 0 ? 11 : 15)
		);
	}
});
it("preserves transform input, mutates digits, sums empty/even data and skips inherited functions", () => {
	const { context } = run("integrating-iterators");
	expect(runInContext("JSON.stringify(arrayOne)", context)).toBe(
		"[-1,0,8,2,6]"
	);
	expect(runInContext("JSON.stringify(arrayTwo)", context)).toBe(
		"[9,1,3,0,2]"
	);
	expect(runInContext("problem4([])", context)).toBe(0);
	expect(runInContext("problem4([-2,3,4])", context)).toBe(2);
	expect(runInContext("JSON.stringify(problem5([1,2],3))", context)).toBe(
		"[]"
	);
	expect(() => runInContext("problem5([1],0)", context)).toThrow(
		"nonzero integer"
	);
	expect(() => runInContext("problem5([1],1.5)", context)).toThrow(
		"nonzero integer"
	);
	expect(
		runInContext(
			"let inherited=0;let own=0;const obj=Object.create({bad:()=>inherited++});obj.good=()=>own++;problem3(obj);JSON.stringify([own,inherited])",
			context
		)
	).toBe("[1,0]");
});
it("keeps row and column ownership and original card bounds", () => {
	const row = run("colorful-cards").shapes;
	expect(row).toHaveLength(5);
	expect(row[4]).toMatchObject({
		x: 800,
		y: 150,
		w: 150,
		h: 100,
		color: "cyan"
	});
	const grid = run("colorful-cards-2d").shapes;
	expect(grid).toHaveLength(25);
	expect(grid[13]).toMatchObject({ x: 600, y: 450, color: "green" });
	expect(grid[24]).toMatchObject({ x: 800, y: 750, color: "yellow" });
});
it("keeps the original six tuple operations in order and corrects the data type", () => {
	const { context, output } = run("pokemon-master");
	expect(output.slice(0, 3)).toEqual(["Psyduck", "175", "fire"]);
	expect(
		runInContext("JSON.stringify(pokemon.map(row=>row[1]))", context)
	).toBe('["Charmander","Pikachu","Psyduck","Togepi","Skitty"]');
	expect(runInContext("pokemon.find(row=>row[0]===54)[2]", context)).toBe(
		"water"
	);
	expect(output).toHaveLength(8);
});
