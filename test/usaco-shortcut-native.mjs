import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Enumerate routes toward the barn, independently of the supplied queue helper.
function tinyShortcutModel(input) {
	const words = input.trim().split(/\s+/).map(Number);
	const [n, m, t] = words.splice(0, 3);
	assert.ok(n <= 8, "Exhaustive route enumeration stays a tiny-case oracle");
	const cows = words.splice(0, n);
	const roads = Array.from({ length: n }, () => []);
	for (let i = 0; i < m; i++) {
		const [a, b, weight] = words.splice(0, 3);
		roads[a - 1].push([b - 1, weight]);
		roads[b - 1].push([a - 1, weight]);
	}
	assert.equal(words.length, 0);
	const paths = [],
		distance = [],
		parent = [];
	for (let origin = 0; origin < n; origin++) {
		let best = Infinity,
			chosen;
		function visit(field, total, path) {
			if (field === 0) {
				const firstDifference = chosen
					? path.findIndex((value, i) => value !== chosen[i])
					: -1;
				if (
					total < best ||
					(total === best &&
						firstDifference >= 0 &&
						path[firstDifference] < chosen[firstDifference])
				) {
					best = total;
					chosen = path;
				}
				return;
			}
			for (const [next, weight] of roads[field]) {
				if (!path.includes(next))
					visit(next, total + weight, [...path, next]);
			}
		}
		visit(origin, 0, [origin]);
		assert.ok(chosen && Number.isFinite(best));
		paths.push(chosen);
		distance.push(best);
		parent.push(origin === 0 ? -1 : chosen[1]);
	}
	let answer = 0n;
	for (let candidate = 0; candidate < n; candidate++) {
		let saving = 0n;
		for (let origin = 0; origin < n; origin++) {
			if (paths[origin].includes(candidate))
				saving +=
					BigInt(cows[origin]) *
					BigInt(Math.max(0, distance[candidate] - t));
		}
		if (saving > answer) answer = saving;
	}
	return { input, distance, parent, expected: answer + "\n" };
}

function shortcutCases(sample) {
	const cases = [
		sample,
		"1 0 1\n10000\n",
		"2 1 10000\n0 4\n1 2 3\n",
		"2 2 1\n0 9\n1 2 7\n2 1 2\n",
		"3 3 1\n0 0 4\n1 1 9\n1 2 2\n2 3 3\n",
		"4 4 1\n0 1 1 9\n1 2 2\n1 3 2\n2 4 3\n3 4 3\n",
		"5 6 2\n0 0 0 4 5\n1 2 5\n1 3 3\n2 4 3\n3 4 5\n4 5 2\n3 5 7\n"
	].map(tinyShortcutModel);
	assert.equal(cases[0].expected, "40\n");
	assert.equal(cases[0].parent[3], 1);
	assert.equal(cases[0].parent[4], 2);
	let seed = 899;
	const next = bound => {
		seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
		return seed % bound;
	};
	for (let test = 0; test < 20; test++) {
		const n = 1 + next(7),
			rows = [];
		for (let b = 2; b <= n; b++)
			rows.push(`${1 + next(b - 1)} ${b} ${1 + next(9)}`);
		for (let a = 1; a <= n; a++)
			for (let b = a; b <= n; b++)
				if (next(4) === 0) rows.push(`${b} ${a} ${1 + next(9)}`);
		cases.push(
			tinyShortcutModel(
				`${n} ${rows.length} ${1 + next(12)}\n${Array.from({ length: n }, () => next(7)).join(" ")}\n${rows.length ? rows.join("\n") + "\n" : ""}`
			)
		);
	}
	const tinyCount = cases.length;
	const n = 10000;
	const chain = Array.from(
		{ length: n - 1 },
		(_, i) => `${i + 1} ${i + 2} 25000`
	);
	let best = 0n;
	for (let i = 1; i < n; i++) {
		const gain = BigInt(n - i) * 10000n * (BigInt(i) * 25000n - 1n);
		if (gain > best) best = gain;
	}
	cases.push({
		input: `${n} ${n - 1} 1\n${Array(n).fill(10000).join(" ")}\n${chain.join("\n")}\n`,
		expected: best + "\n",
		distance: Array.from({ length: n }, (_, i) => i * 25000),
		parent: Array.from({ length: n }, (_, i) => i - 1)
	});
	const star = Array.from({ length: n - 1 }, (_, i) => `1 ${i + 2} 25000`);
	while (star.length < 50000) star.push("1 1 1");
	cases.push({
		input: `${n} 50000 1\n${Array(n).fill(10000).join(" ")}\n${star.join("\n")}\n`,
		expected: "249990000\n",
		distance: Array.from({ length: n }, (_, i) => (i ? 25000 : 0)),
		parent: Array.from({ length: n }, (_, i) => (i ? 0 : -1))
	});
	cases.push({
		input: "1 50000 10000\n10000\n" + "1 1 25000\n".repeat(50000),
		expected: "0\n",
		distance: [0],
		parent: [-1]
	});
	return { cases, tinyCount };
}

export async function verifyShortcutExport(
	fixture,
	files,
	directory,
	{ runNative, record }
) {
	const guide = files["README.md"].replace(/\s+/g, " ");
	for (const detail of [
		"N-1..50000",
		"1..10000",
		"0..10000",
		"1..25000",
		"toward the barn",
		"shortcut.in",
		"shortcut.out",
		"javac --release 17",
		"usual route"
	])
		assert.ok(
			guide.includes(detail),
			`Standalone role guide includes ${detail}`
		);
	const javaHome = process.env.JAVA_HOME_21_X64 ?? process.env.JAVA_HOME;
	const javac =
		process.env.JAVAC ?? (javaHome ? join(javaHome, "bin/javac") : "javac");
	const java =
		process.env.JAVA ?? (javaHome ? join(javaHome, "bin/java") : "java");
	const flags = [
		"--release",
		"17",
		"-encoding",
		"UTF-8",
		"-Xlint:all",
		"-Werror"
	];
	const compiled = await runNative(javac, [...flags, "Main.java"], directory);
	assert.equal(compiled.code, 0, compiled.stderr);
	const input = join(directory, "shortcut.in"),
		output = join(directory, "shortcut.out");
	const { cases, tinyCount } = shortcutCases(files[fixture.input]);
	await rm(output, { force: true });
	for (const [index, model] of cases.entries()) {
		await writeFile(input, model.input);
		const result = await runNative(
			java,
			["-ea", "-Xmx256m", "Main"],
			directory
		);
		assert.equal(result.stdout, "");
		if (fixture.reference) {
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			assert.equal(await readFile(output, "utf8"), model.expected);
		} else {
			assert.equal(result.code, 2, result.stderr);
			assert.match(
				result.stderr,
				/Complete the four Shortcut traffic tasks/
			);
			if (index === 0) assert.equal(existsSync(output), false);
			else
				assert.equal(
					await readFile(output, "utf8"),
					"Earlier saved answer\n"
				);
			await writeFile(output, "Earlier saved answer\n");
		}
	}
	if (!fixture.reference) {
		const probe = `import java.nio.file.Path; import java.util.Arrays;
class Probe {
 static String snapshot(Main.Problem p) {
  StringBuilder text = new StringBuilder(Arrays.toString(p.cows)).append(p.shortcutTime);
  for (var row : p.roads) { text.append('|'); for (var edge : row) text.append(edge.to).append(':').append(edge.weight).append(','); }
  return text.toString();
 }
 public static void main(String[] args) throws Exception {
  Main.Problem p = Main.readProblem(Path.of("shortcut.in")); String before = snapshot(p);
  Main.ShortestRoutes first = Main.shortestRoutes(p.roads);
  long[] distances = first.distance.clone(); int[] parents = first.parent.clone();
  Main.ShortestRoutes second = Main.shortestRoutes(p.roads);
  if (!before.equals(snapshot(p)) || !Arrays.equals(distances, first.distance) || !Arrays.equals(parents, first.parent)
      || !Arrays.equals(distances, second.distance) || !Arrays.equals(parents, second.parent)
      || first.distance == second.distance || first.parent == second.parent) throw new AssertionError("Leaked helper or input state");
  System.out.println(Arrays.toString(first.distance)); System.out.println(Arrays.toString(first.parent));
 }
}`;
		await writeFile(join(directory, "Probe.java"), probe);
		const checked = await runNative(
			javac,
			[...flags, "Main.java", "Probe.java"],
			directory
		);
		assert.equal(checked.code, 0, checked.stderr);
		for (const model of cases) {
			await writeFile(input, model.input);
			const result = await runNative(
				java,
				["-ea", "-Xmx256m", "Probe"],
				directory
			);
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			const lines = result.stdout.trimEnd().split("\n");
			assert.equal(lines.length, 2);
			assert.deepEqual(JSON.parse(lines[0]), model.distance);
			assert.deepEqual(JSON.parse(lines[1]), model.parent);
			assert.equal(
				await readFile(output, "utf8"),
				"Earlier saved answer\n"
			);
		}
		for (const data of [
			"0 0 1\n\n",
			"2 1 0\n0 1\n1 2 1\n",
			"2 1 1\n0 10001\n1 2 1\n",
			"2 1 1\n0 1\n1 3 1\n",
			"2 1 1\n0 1\n1 2 0\n",
			"3 2 1\n0 1 2\n1 2 1\n1 2 2\n",
			"2 1 1\n0 1\n1 2 1\nextra\n"
		]) {
			await writeFile(input, data);
			const refused = await runNative(
				java,
				["-ea", "-Xmx256m", "Main"],
				directory
			);
			assert.equal(refused.code, 2);
			assert.equal(refused.stdout, "");
			assert.match(refused.stderr, /Cannot solve Shortcut:/);
			assert.equal(
				await readFile(output, "utf8"),
				"Earlier saved answer\n"
			);
		}
		await rm(input);
		const missing = await runNative(
			java,
			["-ea", "-Xmx256m", "Main"],
			directory
		);
		assert.equal(missing.code, 2);
		assert.equal(missing.stdout, "");
		assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
		await writeFile(input, files[fixture.input]);
		const argument = await runNative(
			java,
			["-ea", "-Xmx256m", "Main", "unexpected"],
			directory
		);
		assert.equal(argument.code, 2);
		assert.equal(argument.stdout, "");
		assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
	}
	await writeFile(input, files[fixture.input]);
	for (const name of ["Main.java", "README.md", fixture.input])
		assert.equal(
			await readFile(join(directory, name), "utf8"),
			files[name]
		);
	record("verified-shortcut-native-role", {
		role: fixture.reference ? "reference" : "learner",
		fileCases: cases.length,
		tinyIndependentGraphs: tinyCount,
		maximumFields: 10000,
		maximumRoads: 50000,
		maximumFieldChain: true,
		maximumRoadCases: 2,
		longSavings: true,
		fixedUsualRoutes: true,
		towardBarnLexicographicTies: true,
		suppliedHelperParentsAndDistances: !fixture.reference,
		freshHelperSnapshots: !fixture.reference,
		standaloneContract: true,
		previousAnswerPreserved: !fixture.reference,
		learnerRemainsUnfinished: !fixture.reference,
		sourceFilesUnchanged: true
	});
}
