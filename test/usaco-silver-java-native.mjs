import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

// Deliberately independent: enumerate windows, scan ordinary slots, enumerate
// complete gift permutations. No prefix/heap/search/reachability implementation.
function repairs(n, k, broken) {
	let best = k;
	for (let start = 1; start <= n - k + 1; start++) {
		best = Math.min(
			best,
			broken.filter(id => id >= start && id < start + k).length
		);
	}
	return best;
}

function dance(durations, limit) {
	for (let k = 1; k <= durations.length; k++) {
		const slots = Array.from({ length: k }, () => 0);
		for (const duration of durations) {
			const first = slots.indexOf(Math.min(...slots));
			slots[first] += duration;
		}
		if (Math.max(...slots) <= limit) return k;
	}
	throw new Error("Invalid oracle input");
}

function gifts(rows) {
	const n = rows.length;
	const best = Array.from({ length: n }, (_, i) => i + 1);
	const used = new Set();
	const chosen = [];
	const visit = cow => {
		if (cow === n) {
			for (let i = 0; i < n; i++) {
				if (rows[i].indexOf(chosen[i]) < rows[i].indexOf(best[i]))
					best[i] = chosen[i];
			}
			return;
		}
		for (const gift of rows[cow].slice(0, rows[cow].indexOf(cow + 1) + 1)) {
			if (used.has(gift)) continue;
			used.add(gift);
			chosen.push(gift);
			visit(cow + 1);
			chosen.pop();
			used.delete(gift);
		}
	};
	visit(0);
	return `${best.join("\n")}\n`;
}

export async function verifySilverJavaExport(
	fixture,
	files,
	directory,
	runNative,
	record
) {
	const slug = fixture.silverJavaPack;
	assert.ok(["maxcross", "cowdance", "gifts"].includes(slug));
	assert.doesNotMatch(files["README.md"], /\.\.\/README\.md/);
	assert.match(files["README.md"], /Contract/);
	assert.match(files["README.md"], /Independent/);
	assert.ok(Object.hasOwn(files, fixture.mainFile));
	if (fixture.reference)
		assert.ok(
			Object.hasOwn(
				files,
				slug === "gifts" ? "sample.expected" : `${slug}.expected`
			)
		);
	if (slug === "gifts" && fixture.reference)
		assert.ok(Object.hasOwn(files, "pom.xml"));
	const java = process.env.COURSE_IMPORT_JAVA ?? "java";
	const javac = process.env.COURSE_IMPORT_JAVAC ?? "javac";
	await mkdir(join(directory, "target/classes"), { recursive: true });
	const compile = await runNative(
		javac,
		[
			"--release",
			"17",
			"-encoding",
			"UTF-8",
			"-Xlint:all",
			"-Werror",
			"-d",
			"target/classes",
			fixture.mainFile
		],
		directory
	);
	assert.equal(compile.code, 0, compile.stderr);
	const args = ["-ea", "-Xmx256m", "-cp", "target/classes", "Main"];
	const cases = [
		{
			input: files[fixture.input],
			expected: fixture.expected,
			maximum: false
		}
	];
	const add = (input, expected, maximum = false) =>
		cases.push({
			input,
			expected: `${expected}`.endsWith("\n")
				? `${expected}`
				: `${expected}\n`,
			maximum
		});
	if (slug === "maxcross") {
		for (const [n, k, broken] of [
			[1, 1, [1]],
			[5, 3, [2, 1]],
			[4, 2, [4, 2, 1, 3]],
			[5, 5, [3]],
			[8, 1, [8, 3]],
			[8, 3, [8, 7, 6]],
			[8, 3, [1, 2, 3]]
		]) {
			add(
				`${n} ${k} ${broken.length}\n${broken.join("\n")}\n`,
				repairs(n, k, broken)
			);
		}
		add(
			`100000 100000 100000\n${Array.from({ length: 100000 }, (_, i) => 100000 - i).join("\n")}\n`,
			100000,
			true
		);
		add("100000 99999 1\n1\n", 0, true);
	} else if (slug === "cowdance") {
		for (const [durations, limit] of [
			[[4, 7, 8, 6, 4], 11],
			[[4, 7, 8, 6, 4], 16],
			[[7], 7],
			[[3, 3, 3, 3], 6],
			[[3, 3, 3, 3], 3],
			[[4, 1, 1], 6],
			[[6, 1, 5, 2], 7],
			[[4, 3, 2, 1], 5]
		]) {
			add(
				`${durations.length} ${limit}\n${durations.join("\n")}\n`,
				dance(durations, limit)
			);
		}
		for (const [duration, limit, k] of [
			[100000, 100000, 10000],
			[100000, 1000000, 1000],
			[1, 1000000, 1]
		]) {
			add(
				`10000 ${limit}\n${Array.from({ length: 10000 }).fill(duration).join("\n")}\n`,
				k,
				true
			);
		}
	} else {
		for (const rows of [
			[[1]],
			[
				[2, 3, 1],
				[1, 3, 2],
				[1, 2, 3]
			],
			[
				[2, 3, 1],
				[1, 3, 2],
				[3, 1, 2]
			],
			[
				[1, 2, 3],
				[2, 3, 1],
				[3, 1, 2]
			],
			[
				[2, 1],
				[2, 1]
			],
			[
				[2, 3, 4, 1],
				[3, 4, 1, 2],
				[4, 1, 2, 3],
				[1, 2, 3, 4]
			]
		]) {
			add(
				`${rows.length}\n${rows.map(row => row.join(" ")).join("\n")}\n`,
				gifts(rows)
			);
		}
		const ids = Array.from({ length: 500 }, (_, i) => i + 1);
		add(
			`500\n${Array.from({ length: 500 }).fill(ids.join(" ")).join("\n")}\n`,
			`${ids.join("\n")}\n`,
			true
		);
		const cycle = ids.map((id, i) => [
			i === 499 ? 1 : id + 1,
			...ids.filter(gift => gift !== (i === 499 ? 1 : id + 1))
		]);
		add(
			`500\n${cycle.map(row => row.join(" ")).join("\n")}\n`,
			`${[...ids.slice(1), 1].join("\n")}\n`,
			true
		);
	}
	const output = join(directory, fixture.output);
	const execute = async input => {
		if (!fixture.stdio)
			await writeFile(join(directory, fixture.input), input);
		return runNative(
			java,
			args,
			directory,
			{},
			fixture.stdio ? input : undefined
		);
	};
	if (fixture.reference) {
		for (const item of cases) {
			if (!fixture.stdio) await rm(output, { force: true });
			const run = await execute(item.input);
			assert.equal(run.code, 0, run.stderr);
			assert.equal(
				fixture.stdio ? run.stdout : await readFile(output, "utf8"),
				item.expected
			);
			if (!fixture.stdio) assert.equal(run.stdout, "");
		}
	} else {
		if (!fixture.stdio) {
			await rm(output, { force: true });
			const unfinished = await execute(files[fixture.input]);
			assert.equal(unfinished.code, 2);
			assert.equal(existsSync(output), false);
		}
		const invalid =
			slug === "maxcross"
				? ["0 1 1\n1\n", "5 3 2\n1 1\n", "5 3 1\n6\n"]
				: slug === "cowdance"
					? ["0 1\n", "1 3\n4\n", "2 6\n3\n"]
					: ["0\n", "2\n1 1\n1 2\n", "2\n1 2\n1 3\n"];
		const inputs = [
			files[fixture.input],
			cases[1].input,
			...invalid,
			`${files[fixture.input]}99\n`
		];
		for (const input of inputs) {
			if (!fixture.stdio)
				await writeFile(output, "Earlier saved answer\n");
			const run = await execute(input);
			assert.equal(run.code, 2);
			assert.equal(run.stdout, "");
			assert.ok(run.stderr.length > 0);
			if (!fixture.stdio)
				assert.equal(
					await readFile(output, "utf8"),
					"Earlier saved answer\n"
				);
		}
		if (!fixture.stdio) {
			await rm(join(directory, fixture.input));
			const missing = await runNative(java, args, directory);
			assert.equal(missing.code, 2);
			assert.equal(missing.stdout, "");
			assert.equal(
				await readFile(output, "utf8"),
				"Earlier saved answer\n"
			);
		}
		const probe = await readFile(
			new URL(
				`./fixtures/silver-java-${slug}-probe.java.txt`,
				import.meta.url
			)
		);
		await writeFile(join(directory, "LearnerProbe.java"), probe);
		const built = await runNative(
			javac,
			[
				"--release",
				"17",
				"-encoding",
				"UTF-8",
				"-Xlint:all",
				"-Werror",
				"-cp",
				"target/classes",
				"-d",
				"target/classes",
				"LearnerProbe.java"
			],
			directory
		);
		assert.equal(built.code, 0, built.stderr);
		const tested = await runNative(
			java,
			[...args.slice(0, -1), "LearnerProbe"],
			directory
		);
		assert.equal(tested.code, 0, tested.stderr);
		assert.equal(
			tested.stdout,
			"Supplied helpers and unfinished tasks verified.\n"
		);
	}
	await writeFile(join(directory, fixture.input), files[fixture.input]);
	if (fixture.stdio) {
		await writeFile(
			join(directory, "answer.txt"),
			"Earlier saved answer\n"
		);
		const guarded = await runNative(
			"bash",
			[
				"-c",
				'if "$1" -ea -cp target/classes Main < input.txt > answer.tmp; then mv answer.tmp answer.txt; else rm -f answer.tmp; exit 2; fi',
				"silver-answer-guard",
				java
			],
			directory
		);
		assert.equal(guarded.code, fixture.reference ? 0 : 2, guarded.stderr);
		assert.equal(
			await readFile(join(directory, "answer.txt"), "utf8"),
			fixture.reference ? fixture.expected : "Earlier saved answer\n"
		);
		assert.equal(existsSync(join(directory, "answer.tmp")), false);
	}

	for (const [name, content] of Object.entries(files))
		assert.equal(await readFile(join(directory, name), "utf8"), content);
	assert.equal(existsSync(join(directory, "gifts.out")), false);
	record("verified-silver-java-native-role", {
		pack: slug,
		variant: fixture.coreVariant,
		role: fixture.reference ? "reference" : "learner",
		sourceFilesUnchanged: true,
		standaloneGuide: true,
		nestedMain: fixture.mainFile.includes("/"),
		nativeStdio: Boolean(fixture.stdio),
		callerGuardVerified: Boolean(fixture.stdio),
		referenceCases: fixture.reference ? cases.length : 0,
		maximumNCases: fixture.reference
			? cases.filter(item => item.maximum).length
			: 0,
		learnerRemainsUnfinished: !fixture.reference,
		suppliedHelpersVerified: !fixture.reference,
		previousAnswerPreserved: !fixture.reference && !fixture.stdio
	});
}
