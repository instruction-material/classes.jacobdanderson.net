import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const sequence = values => `${values.length}\n${values.join("\n")}\n`;
const coordinates = values =>
	`${values.length}\n${values.map(point => point.join(" ")).join("\n")}\n`;
const grid = (a, b, xs, ys) =>
	`${a} ${b} ${xs.length} ${ys.length}\n${[...xs, ...ys].join("\n")}\n`;

// Enumerate actual eliminations, not Prim's crossing-edge invariant.
function eliminationScore(values) {
	const memo = new Map();
	const visit = remaining => {
		if (remaining.length < 2) return 0;
		const key = remaining.join(",");
		if (memo.has(key)) return memo.get(key);
		let best = 0;
		for (let a = 0; a < remaining.length; a++) {
			for (let b = a + 1; b < remaining.length; b++) {
				const score = values[remaining[a]] ^ values[remaining[b]];
				for (const loser of [a, b])
					best = Math.max(
						best,
						score + visit(remaining.filter((_, i) => i !== loser))
					);
			}
		}
		memo.set(key, best);
		return best;
	};
	return visit(values.map((_, i) => i));
}

// Search thresholds using flood fill without constructing a spanning tree.
function broadcastPower(points) {
	const distances = points.map(([x, y]) =>
		points.map(([a, b]) => (x - a) ** 2 + (y - b) ** 2)
	);
	for (const threshold of [...new Set(distances.flat())].sort(
		(a, b) => a - b
	)) {
		const seen = new Set([0]);
		const queue = [0];
		while (queue.length) {
			const v = queue.pop();
			for (const [u, distance] of distances[v].entries()) {
				if (distance <= threshold && !seen.has(u)) {
					seen.add(u);
					queue.push(u);
				}
			}
		}
		if (seen.size === points.length) return threshold;
	}
	throw new Error("No connected threshold");
}

// Enumerate legal adjacent moves, independently of interval DP.
function reachableTile(values) {
	const queue = [values];
	const seen = new Set([values.join(",")]);
	let answer = Math.max(...values);
	while (queue.length) {
		const state = queue.pop();
		for (let i = 0; i < state.length - 1; i++) {
			if (state[i] !== state[i + 1]) continue;
			const next = [
				...state.slice(0, i),
				state[i] + 1,
				...state.slice(i + 2)
			];
			answer = Math.max(answer, state[i] + 1);
			const key = next.join(",");
			if (!seen.has(key)) {
				seen.add(key);
				queue.push(next);
			}
		}
	}
	return answer;
}

// Enumerate spanning subsets and flood fill tiny region grids, without DSU.
function removedFence([a, b, vertical, horizontal]) {
	const xs = [0, ...vertical, a].sort((x, y) => x - y);
	const ys = [0, ...horizontal, b].sort((x, y) => x - y);
	const columns = xs.length - 1;
	const rows = ys.length - 1;
	const count = columns * rows;
	assert.ok(count <= 9);
	const edges = [];
	for (let x = 0; x < columns; x++) {
		for (let y = 0; y < rows; y++) {
			const v = x + y * columns;
			if (x + 1 < columns) edges.push([v, v + 1, ys[y + 1] - ys[y]]);
			if (y + 1 < rows) edges.push([v, v + columns, xs[x + 1] - xs[x]]);
		}
	}
	let best = Number.POSITIVE_INFINITY;
	const visit = (position, selected, cost) => {
		if (selected.length === count - 1) {
			const neighbors = Array.from({ length: count }, () => []);
			for (const [v, u] of selected) {
				neighbors[v].push(u);
				neighbors[u].push(v);
			}
			const seen = new Set([0]);
			const queue = [0];
			while (queue.length) {
				for (const next of neighbors[queue.pop()]) {
					if (!seen.has(next)) {
						seen.add(next);
						queue.push(next);
					}
				}
			}
			if (seen.size === count) best = Math.min(best, cost);
			return;
		}
		if (edges.length - position < count - 1 - selected.length) return;
		for (let i = position; i < edges.length; i++)
			visit(i + 1, [...selected, edges[i]], cost + edges[i][2]);
	};
	visit(0, [], 0);
	assert.ok(Number.isFinite(best));
	return best;
}

function contract(slug) {
	if (slug === "superbull") {
		const cases = [
			[1],
			[1, 1073741823],
			[3, 6, 9, 10],
			[1073741823, 1073741822, 1, 2],
			[1, 2, 3, 4, 5, 6]
		];
		for (let i = 0; i < 20; i++)
			cases.push(
				Array.from(
					{ length: 2 + (i % 6) },
					(_, j) => 1 + i * 17 + j * 3
				)
			);
		return {
			tiny: cases.map(values => [
				sequence(values),
				eliminationScore(values)
			]),
			full: [
				[
					sequence([
						...Array.from({ length: 1999 }, (_, i) => i + 1),
						1073741823
					]),
					1999 * 1073741823 - (1999 * 2000) / 2
				]
			],
			refused: ["0\n", "2001\n", "2\n1\n1\n", "1\n0\n", "1\n1073741824\n"]
		};
	}
	if (slug === "moocast") {
		const cases = [
			[[0, 0]],
			[
				[0, 0],
				[0, 0]
			],
			[
				[0, 0],
				[25000, 25000]
			],
			[
				[1, 3],
				[5, 4],
				[7, 2],
				[6, 1]
			],
			[
				[0, 0],
				[1, 0],
				[2, 0]
			]
		];
		for (let i = 0; i < 20; i++)
			cases.push(
				Array.from({ length: 2 + (i % 7) }, (_, j) => [
					(j * 7 + i) % 11,
					(j * 3 + i * 2) % 13
				])
			);
		return {
			tiny: cases.map(points => [
				coordinates(points),
				broadcastPower(points)
			]),
			full: [
				[coordinates(Array.from({ length: 1000 }, () => [0, 0])), 0],
				[
					coordinates(
						Array.from({ length: 1000 }, (_, i) => [25 * i, 0])
					),
					625
				],
				[
					coordinates(
						Array.from({ length: 1000 }, (_, i) => [
							500 * (i % 20),
							500 * Math.floor(i / 20)
						])
					),
					250000
				]
			],
			refused: ["0\n", "1001\n", "1\n-1 0\n", "1\n25001 0\n", "1\n0\n"]
		};
	}
	if (slug === "248") {
		const cases = [
			[1, 1, 1, 2],
			[1, 1],
			[1, 2],
			[40, 40],
			Array(8).fill(1),
			[3, 2, 2, 3],
			[2, 1, 2]
		];
		for (let i = 0; i < 20; i++)
			cases.push(
				Array.from(
					{ length: 2 + (i % 7) },
					(_, j) => 1 + ((j * j + i) % 4)
				)
			);
		return {
			tiny: cases.map(values => [
				sequence(values),
				reachableTile(values)
			]),
			full: [
				[sequence(Array(248).fill(40)), 47],
				[
					sequence(
						Array.from({ length: 248 }, (_, i) => 1 + (i % 2))
					),
					2
				],
				[
					sequence(
						Array.from({ length: 248 }, (_, i) => 1 + (i % 40))
					),
					40
				]
			],
			refused: ["1\n1\n", "249\n", "2\n0\n1\n", "2\n41\n1\n", "2\n1\n"]
		};
	}
	assert.equal(slug, "fenced-in");
	const cases = [
		[1, 1, [], []],
		[8, 7, [], [3]],
		[8, 7, [3], []],
		[10, 12, [7, 2], [9, 4]],
		[9, 9, [6, 3], [6, 3]]
	];
	for (let n = 0; n <= 2; n++) {
		for (let k = 0; k <= 2; k++) {
			for (let i = 0; i < 3; i++) {
				const row = [
					9 + i,
					12 + i,
					[2, 5].slice(0, n).reverse(),
					[3, 7].slice(0, k).reverse()
				];
				cases.push(row, [row[1], row[0], row[3], row[2]]);
			}
		}
	}
	const unit = Array.from({ length: 2000 }, (_, i) => i + 1);
	const thousand = unit.map(x => x * 1000);
	const varied = unit.map(x => x * 2002 - (x * (x + 1)) / 2).reverse();
	return {
		tiny: cases.map(row => [grid(...row), removedFence(row)]),
		full: [
			[grid(2001, 2001, unit, unit), 4004000],
			[
				grid(
					2001000,
					6003000,
					thousand,
					unit.map(x => x * 3000)
				),
				4008000000
			],
			[
				grid(
					2003001,
					4006002,
					varied,
					unit.map(x => x * 2002)
				),
				4010006000
			],
			[grid(1000000000, 2001, [], unit), 2000000000000],
			[grid(2001, 1000000000, unit, []), 2000000000000]
		],
		refused: [
			"0 1 0 0\n",
			"1 1 2001 0\n",
			"10 10 2 0\n3\n3\n",
			"10 10 1 0\n10\n",
			"10 10 0 1\n0\n"
		]
	};
}

export async function verifySpanningIntervalPackExport(
	fixture,
	files,
	directory,
	runNative,
	record
) {
	const checks = contract(fixture.spanningIntervalPack);
	const home = process.env.JAVA_HOME_21_X64 ?? process.env.JAVA_HOME;
	const javac = home ? join(home, "bin", "javac") : "javac";
	const java = home ? join(home, "bin", "java") : "java";
	const compile = await runNative(
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
	assert.equal(compile.code, 0, compile.stderr);
	const input = join(directory, fixture.input);
	const output = join(directory, fixture.output);
	const args = ["-ea", "-Xmx256m", "Main"];
	const saved = "Earlier saved answer\n";
	await rm(output, { force: true });
	const first = await runNative(java, args, directory);
	assert.equal(first.code, fixture.reference ? 0 : 2, first.stderr);
	assert.equal(first.stdout, "");
	if (fixture.reference)
		assert.equal(await readFile(output, "utf8"), fixture.expected);
	else {
		assert.equal(existsSync(output), false);
		await writeFile(output, saved);
	}
	for (const [data, answer] of [...checks.tiny, ...checks.full]) {
		await writeFile(input, data);
		const result = await runNative(java, args, directory);
		assert.equal(result.code, fixture.reference ? 0 : 2, result.stderr);
		assert.equal(result.stdout, "");
		assert.equal(
			await readFile(output, "utf8"),
			fixture.reference ? `${answer}\n` : saved
		);
	}
	if (!fixture.reference) {
		for (const data of [
			`${files[fixture.input]}extra\n`,
			"",
			"x\n",
			...checks.refused
		]) {
			await writeFile(input, data);
			const refused = await runNative(java, args, directory);
			assert.equal(refused.code, 2);
			assert.equal(refused.stdout, "");
			assert.equal(await readFile(output, "utf8"), saved);
		}
		await rm(input);
		const missing = await runNative(java, args, directory);
		assert.equal(missing.code, 2);
		assert.equal(await readFile(output, "utf8"), saved);
	}
	await writeFile(input, files[fixture.input]);
	if (files[fixture.output] !== undefined)
		await writeFile(output, files[fixture.output]);
	else await rm(output, { force: true });
	for (const [name, content] of Object.entries(files))
		assert.equal(await readFile(join(directory, name), "utf8"), content);
	record("verified-spanning-interval-native-export", {
		pack: fixture.spanningIntervalPack,
		reference: fixture.reference,
		independentTinyCases: checks.tiny.length,
		fullConstructionCases: checks.full.length,
		heapMiB: 256,
		learnerRemainsUnfinished: !fixture.reference,
		sourceFilesUnchanged: true
	});
}
