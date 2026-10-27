import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContext, runInContext, Script } from "node:vm";
import { expect, it } from "vitest";

const root = resolve(
	"public/course-assets/javascript-level-2/complex-conditionals-v1"
);
function source(project: string, role = "reference") {
	return readFileSync(resolve(root, project, role, "script.js.txt"), "utf8");
}
function example(project: string, role = "reference") {
	const printed: string[] = [];
	const context = createContext({
		printToScreen: (value: unknown) => printed.push(String(value))
	});
	runInContext(source(project, role), context, { timeout: 1000 });
	return {
		printed,
		read: (text: string) => runInContext(text, context, { timeout: 1000 })
	};
}

it("preserves all four original ternary decisions including empty strings", () => {
	const starter = example("ternary-operators-practice", "starter");
	const reference = example("ternary-operators-practice");
	for (const draw of [0, 0.25, 0.5, 0.75, 0.999999]) {
		const expected =
			draw > 0.5 ? ["Hello!", "Kevin"] : ["Goodbye!", "Katy"];
		for (const e of [starter, reference])
			expect(e.read(`[greeting(${draw}), chooseName(${draw})]`)).toEqual(
				expected
			);
	}
	for (const color of [null, "", "violet", "0", "false"]) {
		const expected =
			color === null
				? "Didn't quite get that!"
				: `Wow, ${color} is my favorite color too!`;
		for (const e of [starter, reference])
			expect(e.read(`colorMessage(${JSON.stringify(color)})`)).toBe(
				expected
			);
	}
	for (const e of [starter, reference])
		expect(
			e.read("[greaterThan50(49),greaterThan50(50),greaterThan50(51)]")
		).toEqual([false, false, true]);
	expect(source("ternary-operators-practice")).toContain(
		"// if(color===null)"
	);
});

it("corrects primality and whole-price search while applying at most two discounts", () => {
	const e = example("department-store-discounts");
	for (const n of [-3, 0, 1, 1.5, 4, 9, 15, 15.3, 100])
		expect(e.read(`isPrime(${n})`)).toBe(false);
	for (const n of [2, 3, 17, 97]) expect(e.read(`isPrime(${n})`)).toBe(true);
	expect(
		e.read(
			"[isPerfectSquare(0),isPerfectSquare(1),isPerfectSquare(4),isPerfectSquare(15.3),isPerfectSquare(-4)]"
		)
	).toEqual([true, true, true, false, false]);
	expect(
		e.read(
			"[increasePrice(15.3),increasePrice(20),increasePrice(22.5),increasePrice(23)]"
		)
	).toEqual([16, 23, 23, 23]);
	for (const [price, category, first, rounded, final] of [
		[20, "program", 16, 16, 12.8],
		[25, "elementary", 22.5, 22, 23],
		[15.3, "none", 15.3, 15, 16],
		[10, "none", 10, 10, 11],
		[0, "college", 0, 0, 0]
	] as const) {
		const actual = e.read(
			`calculatePrice(${price},${JSON.stringify(category)})`
		);
		expect(actual).toMatchObject({
			originalPrice: price,
			firstPrice: first,
			roundedPrice: rounded
		});
		expect(actual.finalPrice).toBeCloseTo(final, 10);
	}
	expect(e.read('calculatePrice(100," COLLEGE ").discount')).toBe(16);
	for (const call of [
		'calculatePrice(-1,"none")',
		'calculatePrice(1000001,"none")',
		'calculatePrice(null,"none")',
		'calculatePrice(20,"__proto__")',
		'calculatePrice(20,"unknown")',
		"increasePrice(NaN)",
		"applyDiscount(20,101)"
	])
		expect(() => e.read(call)).toThrow();
});

it("matches independent digit and divisor oracles over the original special-number ranges", () => {
	const e = example("special-numbers");
	const self = (n: number) =>
		n > 0 &&
		[...String(n)].every(d => Number(d) !== 0 && n % Number(d) === 0);
	const palindrome = (n: number) =>
		n > 0 && String(n) === [...String(n)].reverse().join("");
	const range = (start: number, end: number, test: (n: number) => boolean) =>
		Array.from({ length: end - start + 1 }, (_, i) => start + i).filter(
			test
		);
	expect(e.read('matchingNumbers("self-dividing",300,700)')).toEqual(
		range(300, 700, self)
	);
	expect(e.read('matchingNumbers("palindrome",700,2000)')).toEqual(
		range(700, 2000, palindrome)
	);
	expect(e.read('matchingNumbers("perfect",1,9000)')).toEqual([
		6, 28, 496, 8128
	]);
	for (let n = 1; n <= 300; n++) {
		let sum = 0;
		for (let i = 1; i < n; i++) if (n % i === 0) sum += i;
		expect(e.read(`[isPerfect(${n}),isPerfect2(${n})]`)).toEqual([
			sum === n,
			sum === n
		]);
	}
	for (const n of [0, -128, 1.5, 100001])
		expect(
			e.read(
				`[isSelfDividing(${n}),isPerfect(${n}),isPerfect2(${n}),isPalindrome(${n})]`
			)
		).toEqual([false, false, false, false]);
	expect(
		e.read(
			"[isSelfDividing(102),isSelfDividing(128),isPalindrome(11011),isPalindrome(120)]"
		)
	).toEqual([false, true, true, false]);
	for (const call of [
		'matchingNumbers("perfect",30,1)',
		'matchingNumbers("perfect",0,10)',
		'matchingNumbers("perfect",1,10001)',
		'matchingNumbers("perfect",99999,100001)',
		'matchingNumbers("__proto__",1,10)'
	])
		expect(() => e.read(call)).toThrow();
	expect(e.printed[1]).toBe(
		"Perfect numbers, 1 through 9000: 6, 28, 496, 8128"
	);
});

it("keeps five independent age boundaries and rejects missing or invalid values", () => {
	const e = example("age-milestones");
	for (const age of [0, 2, 3, 4, 5, 15, 16, 34, 35, 64, 65, 150]) {
		const lines = e.read(`milestoneMessages(${age})`);
		expect(lines).toEqual([
			`Practice age: ${age}`,
			`Baby example (0–2): ${age <= 2 ? "yes" : "no"}`,
			`Toddler example (3–4): ${age > 2 && age < 5 ? "yes" : "no"}`,
			`Milestone at 16: ${age >= 16 ? "reached" : "not yet"}`,
			`Milestone at 35: ${age >= 35 ? "reached" : "not yet"}`,
			`Milestone at 65: ${age >= 65 ? "reached" : "not yet"}`
		]);
	}
	for (const call of [
		"milestoneMessages(null)",
		'milestoneMessages("")',
		"milestoneMessages(-1)",
		"milestoneMessages(1.5)",
		"milestoneMessages(151)",
		"milestoneMessages(NaN)"
	])
		expect(() => e.read(call)).toThrow();
});

it("keeps all eight source roles parseable and the three original D3 versions pinned", () => {
	const fixture = JSON.parse(
		readFileSync(
			resolve(
				"../test/fixtures/javascript-master-conditionals-sources.json"
			),
			"utf8"
		)
	);
	expect(fixture.resources).toHaveLength(8);
	for (const r of fixture.resources) {
		expect(() => new Script(source(r.project, r.role))).not.toThrow();
		const original = JSON.parse(
			readFileSync(
				resolve(
					"../test/fixtures/javascript-master-conditionals-originals.json"
				),
				"utf8"
			)
		).find(
			(o: { project: string; role: string }) =>
				o.project === r.project && o.role === r.role
		);
		expect(original.settings.JavaScript.resources).toEqual([
			`https://cdnjs.cloudflare.com/ajax/libs/d3/${r.vendorVersion}/d3.min.js`
		]);
		const vendor = r.files.find(
			(f: { name: string }) => f.name === "vendor/d3.min.js"
		);
		expect(
			readFileSync(
				resolve("public/course-assets/javascript-level-2", vendor.path),
				"utf8"
			).slice(0, 200)
		).toContain(`v${r.vendorVersion}`);
	}
});
