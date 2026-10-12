import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { delimiter, dirname, join } from "node:path";
import { bronzeRequiredPacks } from "../front-end/src/modules/usacoBronzeRequiredPacks.ts";

// Tiny cases are independently checkable by state traces, interval merging,
// permutations or direct comparison. They do not reuse the supplied algorithms.
export const bronzeChangedCases = Object.freeze({
	crossroad: [
		["5\n1 0\n10 1\n1 1\n10 0\n1 1\n", "2\n"],
		["1\n10 1\n", "0\n"]
	],
	// A reflection followed by a quarter-turn wins over no change in this symmetric case.
	transform: [
		["2\n@-\n--\n@-\n--\n", "5\n"],
		["1\n@\n@\n", "1\n"],
		["3\n@--\n-@@\n@-@\n@--\n-@@\n@-@\n", "6\n"]
	],
	wormhole: [
		["2\n0 0\n1 0\n", "1\n"],
		["2\n0 0\n1 1\n", "0\n"]
	],
	lostcow: [
		["3 1\n", "4\n"],
		["3 5\n", "8\n"]
	],
	diamond: [
		["3 3\n1\n4\n5\n", "2\n"],
		["4 0\n5\n5\n5\n5\n", "4\n"]
	],
	milkorder: [
		["4 2 1\n2 3\n4 2\n", "1\n"],
		["3 2 1\n1 2\n3 1\n", "2\n"]
	],
	family: [
		["1 A B\nA B\n", "A is the mother of B\n"],
		["2 A B\nM A\nM B\n", "SIBLINGS\n"]
	],
	milk2: [
		["3\n1 3\n3 5\n9 10\n", "4 4\n"],
		["2\n0 10\n2 5\n", "10 0\n"]
	]
});

const tasks = Object.freeze({
	transform: ["rotate90", "reflect"],
	wormhole: ["generate_next_on_right", "main"],
	lostcow: ["main"],
	diamond: ["calc_num_diamonds", "calc_max_diamonds"],
	milkorder: ["check"],
	family: ["main"],
	milk2: ["calc_times"]
});

export function bronzePackForFixture(fixture) {
	const pack = bronzeRequiredPacks.find(
		pack => pack.slug === fixture.bronzeRequiredPack
	);
	assert.ok(pack);
	assert.equal(fixture.revision, pack.revision);
	assert.equal(
		fixture.folder,
		`${pack.folder}/${fixture.reference ? "solution" : "starter"}`
	);
	return pack;
}

export function documentedBronzeGuard(fixture, guide) {
	const pack = bronzePackForFixture(fixture);
	const matches = [...guide.matchAll(/```sh\n([\s\S]*?)\n```/g)];
	assert.equal(matches.length, 1);
	assert.equal(
		matches[0][1],
		pack.guard,
		"Downloaded guide command differs from the checked-in guard"
	);
	// Only the literal checked into the application is ever shell input.
	return pack.guard;
}

const completePythonTasks = String.raw`import ast, json, pathlib, sys
learner_path, reference_path, destination, names_json = sys.argv[1:]
learner = pathlib.Path(learner_path).read_text()
reference = pathlib.Path(reference_path).read_text()
names = json.loads(names_json)
functions = {n.name: n for n in ast.parse(reference).body if isinstance(n, ast.FunctionDef)}
lines = learner.splitlines(keepends=True)
reference_lines = reference.splitlines(keepends=True)
edits = []
for function in ast.parse(learner).body:
    if isinstance(function, ast.FunctionDef) and function.name in names:
        assert any(isinstance(n, ast.Raise) for n in ast.walk(function))
        original = functions[function.name]
        assert ast.dump(function.args) == ast.dump(original.args)
        body = reference_lines[original.body[0].lineno - 1:original.end_lineno]
        edits.append((function.body[0].lineno - 1, function.end_lineno, body))
assert len(edits) == len(names)
for start, end, body in sorted(edits, reverse=True):
    lines[start:end] = body
completed = ''.join(lines)
assert 'raise NotImplementedError' not in completed
pathlib.Path(destination).write_text(completed)
`;

export async function completedBronzeLearner(
	fixture,
	files,
	referenceSource,
	directory,
	runNative
) {
	const pack = bronzePackForFixture(fixture);
	assert.equal(fixture.reference, false);
	const original = files[pack.mainFile];
	if (pack.mode === "java") {
		const marker =
			'        throw new UnsupportedOperationException("TASK: crossing transitions"); // ADDED';
		assert.equal(original.split(marker).length, 2);
		return original.replace(
			marker,
			`        int[] previous = new int[10];
        java.util.Arrays.fill(previous, -1);
        int total = 0;
        for (int[] observation : observations) {
            int index = observation[0] - 1;
            int side = observation[1];
            if (previous[index] != -1 && previous[index] != side) total++;
            previous[index] = side;
        }
        return total;`
		);
	}
	await mkdir(directory, { recursive: true });
	await writeFile(join(directory, "learner.py"), original);
	await writeFile(join(directory, "reference.py"), referenceSource);
	await writeFile(join(directory, "complete.py"), completePythonTasks);
	const result = await runNative(
		"python3",
		[
			"complete.py",
			"learner.py",
			"reference.py",
			"completed.py",
			JSON.stringify(tasks[pack.slug])
		],
		directory
	);
	assert.equal(result.code, 0, result.stderr);
	return readFile(join(directory, "completed.py"), "utf8");
}

export async function verifyBronzeRequiredExport(
	fixture,
	files,
	directory,
	{ runNative, record, referenceSource }
) {
	const pack = bronzePackForFixture(fixture);
	const script = documentedBronzeGuard(fixture, files["README.md"]);
	assert.equal(files["sample.expected"], pack.sampleExpected);
	assert.equal(files[pack.input], pack.sampleInput);
	for (const malicious of [
		script + "\nprintf injected",
		script.replace(pack.mainFile, `${pack.mainFile}; printf injected`)
	]) {
		assert.throws(
			() =>
				documentedBronzeGuard(
					fixture,
					files["README.md"].replace(script, malicious)
				),
			/Downloaded guide command differs/
		);
	}
	const earlier = "Earlier saved answer\n";
	const environment = {
		PATH: [
			process.env.JAVAC && dirname(process.env.JAVAC),
			process.env.JAVA && dirname(process.env.JAVA),
			process.env.PATH
		]
			.filter(Boolean)
			.join(delimiter)
	};
	const variants = fixture.reference
		? [["reference", files[pack.mainFile]]]
		: [
				["unfinished", files[pack.mainFile]],
				[
					"completed-learner",
					await completedBronzeLearner(
						fixture,
						files,
						referenceSource,
						join(directory, "completion"),
						runNative
					)
				]
			];
	for (const [variant, source] of variants) {
		const work = join(directory, variant);
		await mkdir(work);
		await writeFile(join(work, pack.mainFile), source);
		if (pack.mode === "java") {
			await mkdir(join(work, "classes"));
			const result = await runNative(
				"javac",
				[
					"--release",
					"17",
					"-encoding",
					"UTF-8",
					"-Xlint:all",
					"-Werror",
					"-d",
					"classes",
					pack.mainFile
				],
				work,
				environment
			);
			assert.equal(result.code, 0, result.stderr);
		}
		for (const [input, expected] of [
			[pack.sampleInput, pack.sampleExpected],
			...bronzeChangedCases[pack.slug]
		]) {
			await writeFile(join(work, pack.input), input);
			await writeFile(join(work, pack.output), earlier);
			const result =
				pack.mode === "java"
					? await runNative(
							"java",
							["-cp", "classes", "Main"],
							work,
							environment
						)
					: await runNative("python3", [pack.mainFile], work);
			assert.equal(result.stdout, "");
			if (variant === "unfinished") {
				assert.equal(result.code, pack.mode === "java" ? 2 : 1);
				assert.match(
					result.stderr,
					pack.mode === "java"
						? /TASK: crossing transitions/
						: /NotImplementedError/
				);
				assert.equal(
					await readFile(join(work, pack.output), "utf8"),
					earlier
				);
			} else {
				assert.equal(result.code, 0, result.stderr);
				assert.equal(
					await readFile(join(work, pack.output), "utf8"),
					expected
				);
			}
		}
	}
	const source = variants.at(-1)[1];

	for (const variant of [
		"success",
		"wrong-expected",
		"syntax-error",
		...(fixture.reference ? [] : ["unfinished"])
	]) {
		const work = join(directory, `guard-${variant}`);
		await mkdir(work);
		await writeFile(
			join(work, pack.mainFile),
			variant === "syntax-error"
				? source + "\ninvalid syntax {\n"
				: variant === "unfinished"
					? files[pack.mainFile]
					: source
		);
		await writeFile(join(work, pack.input), pack.sampleInput);
		await writeFile(
			join(work, "sample.expected"),
			variant === "wrong-expected" ? "wrong\n" : pack.sampleExpected
		);
		await writeFile(join(work, pack.output), earlier);
		// The downloaded Markdown was compared above, never executed.
		const result = await runNative(
			"bash",
			["-c", script],
			work,
			environment
		);
		assert.equal(result.code === 0, variant === "success", result.stderr);
		assert.equal(
			await readFile(join(work, pack.output), "utf8"),
			variant === "success" ? pack.sampleExpected : earlier
		);
		assert.equal(existsSync(join(work, `${pack.output}.new`)), false);
	}
	record("verified-bronze-required-native-export", {
		pack: pack.slug,
		role: fixture.reference ? "reference" : "learner",
		cases: (1 + bronzeChangedCases[pack.slug].length) * variants.length,
		completedOnlyNamedTasks: !fixture.reference,
		ownedGuideGuard: true,
		adversarialGuidesRejected: 2,
		failurePreservesEarlierAnswer: true
	});
}
