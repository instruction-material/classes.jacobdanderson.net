import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

// Exhaustive tiny models are separate from the preserved solver algorithms.
function hpsAnswer(input) {
	const words = input.trim().split(/\s+/);
	const [n, budget] = words.splice(0, 2).map(Number);
	assert.ok(n <= 8);
	assert.equal(words.length, n);
	let best = 0;
	const beats = { H: "S", P: "H", S: "P" };
	// Enumerate literal gestures, rather than the reference's relabeled DP states.
	const visit = (round, previous, changes, wins) => {
		if (changes > budget) return;
		if (round === n) {
			best = Math.max(best, wins);
			return;
		}
		for (const gesture of ["H", "P", "S"]) {
			visit(
				round + 1,
				gesture,
				changes + Number(previous !== null && previous !== gesture),
				wins + Number(beats[gesture] === words[round])
			);
		}
	};
	visit(0, null, 0, 0);
	return `${best}\n`;
}

function cowAnswer(input) {
	const words = input.trim().split(/\s+/).map(Number);

	const [start, end, count] = words.splice(0, 3);
	const edges = [];
	const cities = new Set([start, end]);

	for (let r = 0; r < count; r++) {
		const [price, size] = words.splice(0, 2);
		const stops = words.splice(0, size);

		stops.forEach(city => cities.add(city));

		for (let i = 0; i < size; i++) {
			for (let j = i + 1; j < size; j++)
				edges.push([stops[i], stops[j], price, j - i]);
		}
	}

	assert.equal(words.length, 0);

	let best = new Map([[start, [0, 0]]]);

	for (let pass = 0; pass < cities.size - 1; pass++) {
		const next = new Map(best);

		for (const [a, b, money, flights] of edges) {
			if (!best.has(a)) continue;

			const value = [best.get(a)[0] + money, best.get(a)[1] + flights];
			const old = next.get(b);

			if (
				!old
				|| value[0] < old[0]
				|| (value[0] === old[0] && value[1] < old[1])
			) {
				next.set(b, value);
			}
		}

		best = next;
	}

	return `${(best.get(end) ?? [-1, -1]).join(" ")}\n`;
}
function irrigationAnswer(input) {
	const words = input.trim().split(/\s+/).map(Number);
	const [n, cutoff] = words.splice(0, 2);

	assert.ok(n <= 5);

	const points = Array.from({ length: n }, () => words.splice(0, 2));
	const edges = [];

	for (let a = 0; a < n; a++) {
		for (let b = a + 1; b < n; b++) {
			const cost
				= (points[a][0] - points[b][0]) ** 2
					+ (points[a][1] - points[b][1]) ** 2;

			if (cost >= cutoff) edges.push([a, b, cost]);
		}
	}

	let best = Infinity;

	for (let mask = 0; mask < 2 ** edges.length; mask++) {
		const chosen = edges.filter((_, i) => mask & (1 << i));

		if (chosen.length !== n - 1) continue;

		const reached = new Set([0]);

		for (let pass = 0; pass < n; pass++) {
			for (const [a, b] of chosen) {
				if (reached.has(a)) reached.add(b);
				if (reached.has(b)) reached.add(a);
			}
		}

		if (reached.size === n) {
			best = Math.min(
				best,
				chosen.reduce((sum, edge) => sum + edge[2], 0)
			);
		}
	}

	return `${Number.isFinite(best) ? best : -1}\n`;
}
function walkAnswer(input) {
	const [n, k] = input.trim().split(/\s+/).map(Number);
	assert.ok(n <= 7);

	const groups = Array.from({ length: n }).fill(0);
	let best = 0;

	const edge = (a, b) =>
		Number(
			(2019201913n * BigInt(a) + 2019201949n * BigInt(b)) % 2019201997n
		);

	const visit = (index, count) => {
		if (index === n) {
			if (count !== k) return;
			let spacing = Infinity;
			for (let a = 0; a < n; a++) {
				for (let b = a + 1; b < n; b++) {
					if (groups[a] !== groups[b])
						spacing = Math.min(spacing, edge(a + 1, b + 1));
				}
			}
			best = Math.max(best, spacing);
			return;
		}

		for (let group = 0; group < Math.min(count + 1, k); group++) {
			groups[index] = group;
			visit(index + 1, Math.max(count, group + 1));
		}
	};

	visit(0, 0);
	return `${best}\n`;
}
function talentAnswer(input) {
	const words = input.trim().split(/\s+/).map(Number);
	const [n, threshold] = words.splice(0, 2);
	assert.ok(n <= 18);

	const cows = Array.from({ length: n }, () => words.splice(0, 2));
	let best = 0;

	for (let mask = 1; mask < 2 ** n; mask++) {
		let weight = 0;
		let talent = 0;
		cows.forEach(([w, t], i) => {
			if (mask & (1 << i)) {
				weight += w;
				talent += t;
			}
		});

		if (weight >= threshold)
			best = Math.max(best, Math.floor((1000 * talent) / weight));
	}

	return `${best}\n`;
}

const contracts = {
	"hoof-paper-scissors": {
		oracle: hpsAnswer,
		cases: [
			"1 0\nH\n",
			"1 1\nP\n",
			"1 20\nS\n",
			"5 0\nP\nP\nH\nP\nS\n",
			"5 1\nP\nP\nH\nP\nS\n",
			"6 0\nH\nP\nS\nH\nP\nS\n",
			"6 2\nH\nP\nS\nH\nP\nS\n",
			"6 20\nH\nP\nS\nH\nP\nS\n"
		],
		refusedCases: [
			"1 -1\nH\n",
			"1 21\nH\n",
			"100001 0\nH\n",
			"1 0\nX\n",
			"1 0\nHH\n",
			"2 0\nH\n",
			"999999999999999999999999 0\nH\n"
		]
	},
	"cow-routing": {
		oracle: cowAnswer,
		cases: [
			"3 2 2\n1 4\n1 2 3 4\n1 2\n4 1\n",
			"1 3 2\n2 3\n1 2 3\n2 2\n1 3\n",
			"2 1 1\n1 2\n1 2\n",
			"1 1 1\n1 1\n1\n",
			"1 4 3\n1000000000 2\n1 2\n1000000000 2\n2 3\n1000000000 2\n3 4\n"
		]
	},
	"watering-the-fields": {
		oracle: irrigationAnswer,
		cases: [
			"1 1\n0 0\n",
			"2 25\n0 0\n3 4\n",
			"2 26\n0 0\n3 4\n",
			"3 11\n0 2\n5 0\n4 3\n",
			"4 1\n0 0\n0 1\n1 0\n1 1\n"
		]
	},
	"i-would-walk-500-miles": {
		oracle: walkAnswer,
		cases: ["2 2\n", "3 2\n", "3 3\n", "5 2\n", "5 5\n", "6 3\n"]
	},
	"talent-show": {
		oracle: talentAnswer,
		cases: [
			"3 15\n20 21\n10 11\n30 31\n",
			"1 10\n20 7\n",
			"1 10\n10 5\n",
			"2 9\n4 100\n9 1\n",
			"3 10\n6 7\n6 8\n2 1\n",
			"2 1000\n1000000 1000\n1 1\n"
		]
	}
};
export async function verifyHistoricalPackExport(
	fixture,
	files,
	directory,
	{ runNative, record }
) {
	const contract = contracts[fixture.historicalPack];
	assert.ok(contract);

	const home = process.env.JAVA_HOME_21_X64 ?? process.env.JAVA_HOME;

	const java = home ? join(home, "bin", "java") : "java";
	const javac = home ? join(home, "bin", "javac") : "javac";

	const compiled = await runNative(
		javac,
		[
			"--release",
			"17",
			"-encoding",
			"UTF-8",
			"-Xlint:all",
			"-Werror",
			"Main.java"
		],
		directory
	);

	assert.equal(compiled.code, 0, compiled.stderr);

	const output = join(directory, fixture.output);
	const input = join(directory, fixture.input);
	const args = ["-ea", "-Xmx256m", "Main"];
	const expectedStdout = answer =>
		fixture.reference && fixture.historicalPack === "hoof-paper-scissors"
			? answer
			: "";

	await rm(output, { force: true });

	const first = await runNative(java, args, directory);

	assert.equal(first.code, fixture.reference ? 0 : 2, first.stderr);
	assert.equal(first.stdout, expectedStdout(fixture.expected));

	if (fixture.reference) {
		assert.equal(await readFile(output, "utf8"), fixture.expected);
	}
	else {
		assert.equal(existsSync(output), false);
		await writeFile(output, "Earlier saved answer\n");
	}

	for (const data of contract.cases) {
		await writeFile(input, data);

		const result = await runNative(java, args, directory);
		const expected = fixture.reference ? contract.oracle(data) : "Earlier saved answer\n";

		assert.equal(result.code, fixture.reference ? 0 : 2, result.stderr);
		assert.equal(result.stdout, expectedStdout(expected));

		assert.equal(
			await readFile(output, "utf8"),
			expected
		);
	}
	let fullConstructionCases = 0;
	if (fixture.historicalPack === "hoof-paper-scissors") {
		const cycle = Array.from({ length: 100000 }, (_, i) => ["H", "P", "S"][i % 3]);
		const runs = Array.from({ length: 100000 }, (_, i) => ["H", "P", "S"][Math.floor(i * 21 / 100000) % 3]);
		for (const [data, answer] of [
			[`100000 20\n${"H\n".repeat(100000)}`, "100000\n"],
			[`100000 0\n${cycle.join("\n")}\n`, "33334\n"],
			[`100000 20\n${runs.join("\n")}\n`, "100000\n"]
		]) {
			await writeFile(input, data);
			const result = await runNative(java, args, directory);
			assert.equal(result.code, fixture.reference ? 0 : 2, result.stderr);
			assert.equal(result.stdout, expectedStdout(answer));
			assert.equal(await readFile(output, "utf8"), fixture.reference ? answer : "Earlier saved answer\n");
			fullConstructionCases++;
		}
	}

	if (fixture.reference && fixture.historicalPack === "talent-show") {
		assert.equal(contract.oracle(files["official-sample.in"]), "1066\n");

		await writeFile(input, files["official-sample.in"]);

		const sample = await runNative(java, args, directory);
		assert.equal(sample.code, 0, sample.stderr);

		assert.equal(await readFile(output, "utf8"), "1066\n");
	}

	if (!fixture.reference) {
		for (const data of [`${files[fixture.input]}extra\n`, "", "-1\n", ...(contract.refusedCases ?? [])]) {
			await writeFile(input, data);
			const refused = await runNative(java, args, directory);

			assert.equal(refused.code, 2);
			assert.equal(refused.stdout, "");
			assert.equal(
				await readFile(output, "utf8"),
				"Earlier saved answer\n"
			);
		}

		await rm(input);
		const missing = await runNative(java, args, directory);
		assert.equal(missing.code, 2);
		assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
	}

	await writeFile(input, files[fixture.input]);

	if (files[fixture.output] !== undefined)
		await writeFile(output, files[fixture.output]);
	else await rm(output, { force: true });

	for (const [name, content] of Object.entries(files))
		assert.equal(await readFile(join(directory, name), "utf8"), content);

	record("verified-historical-native-export", {
		pack: fixture.historicalPack,
		reference: fixture.reference,
		independentTinyCases: contract.cases.length,
		fullConstructionCases,
		preservedHistoricalTalentInput:
			fixture.historicalPack === "talent-show" && fixture.reference,
		learnerRemainsUnfinished: !fixture.reference,
		sourceFilesUnchanged: true
	});
}
