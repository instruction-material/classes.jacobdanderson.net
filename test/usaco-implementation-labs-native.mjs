import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

// Enumerate edge subsets and test reachability, independently of Prim and DSU.
function minimumTree(input) {
	const words = input.trim().split(/\s+/).map(Number);
	const [n, m] = words.splice(0, 2);
	assert.ok(n <= 6 && m <= 11);
	const edges = [];
	for (let i = 0; i < m; i++) edges.push(words.splice(0, 3));
	assert.equal(words.length, 0);
	let best = Infinity;
	for (let mask = 0; mask < 2 ** m; mask++) {
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
	assert.ok(Number.isFinite(best));
	return best;
}

function verifyTree(input, output, prim, expected) {
	const words = input.trim().split(/\s+/).map(Number);
	const [n, m] = words;
	const weights = new Map();
	for (let i = 0; i < m; i++) {
		const [a, b, w] = words.slice(2 + i * 3, 5 + i * 3);
		const pair = [Math.min(a, b), Math.max(a, b)].join(":");
		weights.set(pair, Math.min(w, weights.get(pair) ?? Infinity));
	}
	const lines = output.trim() ? output.trim().split(/\r?\n/) : [];
	if (prim) {
		assert.equal(lines.pop(), `Total Distance: ${expected}`);
	}
	assert.equal(lines.length, n - 1);
	const links = Array.from({ length: n }, () => []);
	let total = 0;
	for (const line of lines) {
		assert.match(line, /^\d+ \d+$/);
		const [a, b] = line.split(" ").map(Number);
		assert.ok(a < n && b < n && a !== b);
		const weight = weights.get([Math.min(a, b), Math.max(a, b)].join(":"));
		assert.notEqual(weight, undefined);
		total += weight;
		links[a].push(b);
		links[b].push(a);
	}
	const reached = new Set([0]);
	const queue = [0];
	for (let i = 0; i < queue.length; i++) {
		for (const neighbor of links[queue[i]]) {
			if (!reached.has(neighbor)) {
				reached.add(neighbor);
				queue.push(neighbor);
			}
		}
	}
	assert.equal(reached.size, n);
	assert.equal(total, expected);
}

function dpExpected(array, rows, columns, items, capacity) {
	let sum = 0;
	for (let start = 0; start < array.length; start++) {
		for (let end = start; end < array.length; end++) {
			sum = Math.max(
				sum,
				array.slice(start, end + 1).reduce((a, b) => a + b, 0)
			);
		}
	}
	let paths = 1;
	for (let i = 1; i < rows; i++) paths = (paths * (columns - 1 + i)) / i;
	let value = 0;
	for (let mask = 0; mask < 2 ** items.length; mask++) {
		const selected = items.filter((_, i) => mask & (1 << i));
		if (selected.reduce((a, b) => a + b[0], 0) <= capacity) {
			value = Math.max(
				value,
				selected.reduce((a, b) => a + b[1], 0)
			);
		}
	}
	return `${sum}\n${paths}\n${value}\n`;
}

export async function verifyImplementationLabExport(
	fixture,
	files,
	directory,
	{ runNative, record }
) {
	const javaHome = process.env.JAVA_HOME_21_X64 ?? process.env.JAVA_HOME;
	const javac
		= process.env.JAVAC ?? (javaHome ? join(javaHome, "bin/javac") : "javac");
	const java
		= process.env.JAVA ?? (javaHome ? join(javaHome, "bin/java") : "java");
	const flags = [
		"--release",
		"17",
		"-encoding",
		"UTF-8",
		"-Xlint:all",
		"-Werror"
	];
	const args = ["-ea", "-Xmx256m", "Main"];
	for (const text of [
		"## Contract",
		"## Prediction",
		"## Tasks and walkthrough",
		"## Build and run",
		"## Independent checks",
		"JDK 17",
		"javac --release 17"
	])
		assert.ok(files["README.md"].includes(text), text);
	assert.equal(
		(await runNative(javac, [...flags, "Main.java"], directory)).code,
		0
	);
	let independentCases = 0;
	let preserved = false;
	let maximumVertices = 0;
	if (fixture.demonstration) {
		const result = await runNative(java, args, directory);
		assert.equal(result.code, fixture.reference ? 0 : 2, result.stderr);
		assert.equal(result.stdout, fixture.reference ? "11\n3\n16\n" : "");
		if (fixture.reference) {
			const cases = [
				[[], 1, 1, [], 0],
				[[-4, -2], 1, 6, [[1, 5]], 1],
				[
					[3, -4, 6],
					6,
					1,
					[
						[0, 8],
						[0, 3],
						[1, 20]
					],
					0
				],
				[[2, -1, 4], 4, 4, [[2, 3]], 4],
				[
					[5, -5, 6, 2, 3],
					3,
					2,
					[
						[1, 5],
						[2, 3],
						[4, 5],
						[2, 3],
						[5, 2]
					],
					10
				],
				[
					[1000000, -1],
					15,
					15,
					[
						[0, 1000000],
						[0, 1000000]
					],
					0
				]
			];
			const array = a => `{${a.join(",")}}`;
			let probe
				= "class Probe { public static void main(String[] args) {\n";
			for (const [values, rows, columns, items, capacity] of cases) {
				probe += `System.out.println(Main.maxSubarraySum(new int[]${array(values)}));\n`;
				probe += `System.out.println(Main.numPaths(${rows}, ${columns}));\n`;
				probe += `System.out.println(Main.knapsackRecursive(${items.length - 1}, ${capacity}, new int[][]{${items.map(array).join(",")}}));\n`;
			}
			probe += "} }\n";
			await writeFile(join(directory, "Probe.java"), probe);
			assert.equal(
				(
					await runNative(
						javac,
						[...flags, "Main.java", "Probe.java"],
						directory
					)
				).code,
				0
			);
			const changed = await runNative(
				java,
				["-ea", "-Xmx256m", "Probe"],
				directory
			);
			assert.equal(changed.code, 0, changed.stderr);
			assert.equal(
				changed.stdout,
				cases.map(data => dpExpected(...data)).join("")
			);
			independentCases = cases.length;
		}
	}
	else {
		const prim = fixture.implementationLab === "UG14-MST-II";
		const input = join(directory, fixture.input);
		const output = join(directory, fixture.output);
		const cases = [
			files[fixture.input],
			"1 0\n",
			"2 2\n0 1 1\n0 1 9\n",
			"4 4\n0 1 1000000000\n1 2 1000000000\n2 3 1000000000\n3 3 0\n",
			"4 5\n0 1 0\n0 2 0\n1 3 1\n2 3 1\n0 0 0\n"
		];
		await rm(output, { force: true });
		const untouched = await runNative(java, args, directory);
		assert.equal(
			untouched.code,
			fixture.reference ? 0 : 2,
			untouched.stderr
		);
		if (!fixture.reference) assert.equal(existsSync(output), false);
		for (const data of cases) {
			await writeFile(input, data);
			await writeFile(output, "Earlier saved answer\n");
			const result = await runNative(java, args, directory);
			assert.equal(result.code, fixture.reference ? 0 : 2, result.stderr);
			assert.equal(result.stdout, "");
			if (fixture.reference) {
				verifyTree(
					data,
					await readFile(output, "utf8"),
					prim,
					minimumTree(data)
				);
			}
			else {
				assert.equal(
					await readFile(output, "utf8"),
					"Earlier saved answer\n"
				);
			}
		}
		independentCases = fixture.reference ? cases.length : 0;
		if (fixture.reference) {
			const n = prim ? 2000 : 200000;
			const rows = [`${n} ${n - 1}`];
			for (let i = 1; i < n; i++) rows.push(`${i - 1} ${i} 1000000000`);
			const data = `${rows.join("\n")}\n`;
			await writeFile(input, data);
			const result = await runNative(java, args, directory);
			assert.equal(result.code, 0, result.stderr);
			verifyTree(
				data,
				await readFile(output, "utf8"),
				prim,
				(n - 1) * 1000000000
			);
			maximumVertices = n;
		}
		await writeFile(output, "Earlier saved answer\n");
		await writeFile(input, "3 1\n0 1 1\n");
		const disconnected = await runNative(java, args, directory);
		assert.notEqual(disconnected.code, 0);
		assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
		preserved = true;
		if (!fixture.reference) {
			await rm(input);
			assert.equal((await runNative(java, args, directory)).code, 2);
			assert.equal(
				await readFile(output, "utf8"),
				"Earlier saved answer\n"
			);
		}
		await writeFile(input, files[fixture.input]);
	}
	for (const name of [
		"Main.java",
		"README.md",
		...(fixture.demonstration ? [] : [fixture.input])
	]) {
		assert.equal(
			await readFile(join(directory, name), "utf8"),
			files[name]
		);
	}
	record("verified-implementation-lab-native-role", {
		folder: fixture.implementationLab,
		role: fixture.reference ? "reference" : "learner",
		independentCases,
		maximumVertices,
		previousAnswerPreserved: preserved,
		learnerRemainsUnfinished: !fixture.reference,
		sourceFilesUnchanged: true,
		standaloneContract: true
	});
}
