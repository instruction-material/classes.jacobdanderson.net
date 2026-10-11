import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const modulus = 1000000007n;
function power(base, exponent) {
	let answer = 1n;
	for (; exponent > 0; exponent = Math.floor(exponent / 2)) {
		if (exponent % 2) answer = (answer * base) % modulus;
		base = (base * base) % modulus;
	}
	return answer;
}

// Enumerate actual ordered words, independently of the prefix DP.
function poetry(words, k, scheme) {
	const endings = new Map();
	const visit = (left, last) => {
		if (left === 0) {
			endings.set(last, (endings.get(last) ?? 0n) + 1n);
			return;
		}
		for (const [size, rhyme] of words) {
			if (size <= left) visit(left - size, rhyme);
		}
	};
	visit(k, -1);
	let answer = 1n;
	for (const letter of new Set(scheme)) {
		const frequency = [...scheme].filter(value => value === letter).length;
		const group = [...endings.values()].reduce(
			(sum, count) => (sum + power(count, frequency)) % modulus,
			0n
		);
		answer = (answer * group) % modulus;
	}
	return answer.toString();
}

// Use points and straight segments rather than the exported line-state graph.
function mirrors(start, barn, posts) {
	const points = [start, ...posts, barn];
	const distance = Array.from({ length: points.length }).fill(-1);
	const queue = [0];
	distance[0] = 0;
	for (let position = 0; position < queue.length; position++) {
		const current = queue[position];
		for (let next = 0; next < points.length; next++) {
			if (
				distance[next] < 0
				&& (points[current][0] === points[next][0]
					|| points[current][1] === points[next][1])
			) {
				distance[next] = distance[current] + 1;
				queue.push(next);
			}
		}
	}
	return distance.at(-1) < 0 ? -1 : distance.at(-1) - 1;
}

function positions(start, path) {
	const result = [start];
	const changes = { N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0] };
	for (const letter of path) {
		const [x, y] = result.at(-1);
		const [dx, dy] = changes[letter];
		result.push([x + dx, y + dy]);
	}
	assert.ok(
		result.every(([x, y]) => x >= 0 && x <= 1000 && y >= 0 && y <= 1000)
	);
	return result;
}

// Enumerate joint movement schedules; use a rolling table only at the full limit.
function radio(first, second, rolling = false) {
	const cost = (i, j) =>
		(first[i][0] - second[j][0]) ** 2 + (first[i][1] - second[j][1]) ** 2;
	const n = first.length - 1;
	const m = second.length - 1;
	const enumerate = (i, j) => {
		if (i === n && j === m) return 0;
		const choices = [];
		for (const [di, dj] of [
			[1, 0],
			[0, 1],
			[1, 1]
		]) {
			if (i + di <= n && j + dj <= m)
				choices.push(cost(i + di, j + dj) + enumerate(i + di, j + dj));
		}
		return Math.min(...choices);
	};
	if (!rolling) return enumerate(0, 0);
	let previous = Array.from({ length: m + 1 }).fill(0);
	for (let j = 1; j <= m; j++) previous[j] = previous[j - 1] + cost(0, j);
	for (let i = 1; i <= n; i++) {
		const next = [previous[0] + cost(i, 0), ...Array.from({ length: m }).fill(0)];
		for (let j = 1; j <= m; j++) {
			next[j]
				= Math.min(next[j - 1], previous[j], previous[j - 1])
					+ cost(i, j);
		}
		previous = next;
	}
	return previous[m];
}

export async function verifyRequiredCorePackExport(
	fixture,
	files,
	directory,
	runNative,
	record
) {
	const slug = fixture.requiredCorePack;
	const input = join(directory, fixture.input);
	const output = join(directory, fixture.output);
	for (const heading of [
		"## Contract",
		"## Prediction",
		"## State and reasoning",
		"## Tasks and walkthrough",
		"## Independent checks",
		"## Build and run"
	])
		assert.ok(files["README.md"].includes(heading));
	const compilation = await runNative(
		process.env.JAVAC ?? "javac",
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
	assert.equal(compilation.code, 0, compilation.stderr);
	const cases = [];
	if (slug === "poetry") {
		for (const [words, k, scheme] of [
			[
				[
					[3, 1],
					[4, 1],
					[3, 2]
				],
				10,
				"ABA"
			],
			[
				[
					[1, 1],
					[1, 2]
				],
				1,
				"AB"
			],
			[
				[
					[1, 1],
					[1, 2]
				],
				1,
				"AA"
			],
			[
				[
					[1, 1],
					[1, 1]
				],
				1,
				"AA"
			],
			[
				[
					[2, 1],
					[2, 2]
				],
				3,
				"A"
			],
			[[[1, 1]], 1, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
		]) {
			cases.push({
				text: `${words.length} ${scheme.length} ${k}\n${words.map(w => w.join(" ")).join("\n")}\n${[...scheme].join("\n")}\n`,
				answer: poetry(words, k, scheme),
				full: false
			});
		}
		cases.push({
			text: `5000 100000 5000\n${"5000 1\n".repeat(5000)}${"A\n".repeat(100000)}`,
			answer: power(5000n, 100000).toString(),
			full: true
		});
	}
	else if (slug === "lasers") {
		for (const [start, barn, posts] of [
			[
				[0, 0],
				[7, 2],
				[
					[3, 2],
					[0, 2],
					[1, 6],
					[3, 0]
				]
			],
			[[0, 0], [1, 1], [[2, 2]]],
			[[0, 0], [1, 1], [[0, 1]]],
			[[0, 0], [0, 1000000000], [[1, 1]]],
			[[0, 0], [1000000000, 1000000000], [[0, 1000000000]]]
		]) {
			cases.push({
				text: `${posts.length} ${[...start, ...barn].join(" ")}\n${posts.map(p => p.join(" ")).join("\n")}\n`,
				answer: String(mirrors(start, barn, posts)),
				full: false
			});
		}
		cases.push({
			text: `100000 0 0 50001 50000\n${Array.from({ length: 100000 }, (_, index) => `${Math.ceil((index + 1) / 2)} ${Math.floor((index + 1) / 2)}\n`).join("")}`,
			answer: "100000",
			full: true
		});
	}
	else {
		assert.equal(slug, "radio");
		for (const [start, finish, fd, bd, full] of [
			[[3, 0], [5, 0], "NN", "NWWWWWN", false],
			[[0, 0], [0, 0], "E", "E", false],
			[[0, 0], [2, 0], "E", "W", false],
			[[0, 0], [0, 2], "E", "E", false],
			[[3, 3], [5, 5], "NNE", "SWW", false],
			[[0, 0], [1000, 1000], "E".repeat(1000), "W".repeat(1000), true]
		]) {
			cases.push({
				text: `${fd.length} ${bd.length}\n${start.join(" ")}\n${finish.join(" ")}\n${fd}\n${bd}\n`,
				answer: String(
					radio(positions(start, fd), positions(finish, bd), full)
				),
				full
			});
		}
	}
	let preserved = 0;
	let refused = 0;
	for (const test of cases) {
		await writeFile(input, test.text);
		if (fixture.reference) {
			await rm(output, { force: true });
			const result = await runNative(
				process.env.JAVA ?? "java",
				["-ea", "-Xmx256m", "Main"],
				directory
			);
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stdout, "");
			assert.equal(result.stderr, "");
			assert.equal((await readFile(output, "utf8")).trim(), test.answer);
		}
		else {
			for (const existing of [false, true]) {
				if (existing) await writeFile(output, "Earlier saved answer\n");
				else await rm(output, { force: true });
				const result = await runNative(
					process.env.JAVA ?? "java",
					["-ea", "-Xmx256m", "Main"],
					directory
				);
				assert.equal(result.code, 2);
				assert.equal(result.stdout, "");
				assert.match(result.stderr, /unfinished/);
				assert.ok(
					existing
						? (await readFile(output, "utf8"))
						=== "Earlier saved answer\n"
						: !existsSync(output)
				);
				preserved++;
			}
		}
	}
	if (!fixture.reference) {
		for (const invalid of [null, "x\n", `${cases[0].text}extra\n`]) {
			await writeFile(output, "Earlier saved answer\n");
			if (invalid === null) await rm(input, { force: true });
			else await writeFile(input, invalid);
			const result = await runNative(
				process.env.JAVA ?? "java",
				["-ea", "-Xmx256m", "Main"],
				directory
			);
			assert.equal(result.code, 2);
			assert.equal(result.stdout, "");
			assert.doesNotMatch(result.stderr, /unfinished/);
			assert.equal(
				await readFile(output, "utf8"),
				"Earlier saved answer\n"
			);
			refused++;
		}
	}
	await writeFile(input, files[fixture.input]);
	for (const name of ["Main.java", "README.md", fixture.input]) {
		assert.equal(
			await readFile(join(directory, name), "utf8"),
			files[name]
		);
	}
	record("verified-required-core-native-role", {
		pack: slug,
		variant: fixture.coreVariant,
		role: fixture.reference ? "reference" : "learner",
		independentCases: cases.length,
		fullLimitCases: cases.filter(c => c.full).length,
		previousAnswerPreserved: preserved,
		refusedInputs: refused,
		sourceFilesUnchanged: true,
		learnerRemainsUnfinished: !fixture.reference
	});
}
