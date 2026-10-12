import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { delimiter, join } from "node:path";

// These reviewed commands are source code, never downloaded shell input.
const foundationGuards = Object.freeze({
	records: String.raw`if rm -rf target/classes \
    && mkdir -p target/classes \
    && javac --release 17 -encoding UTF-8 -Xlint:all -Werror -d target/classes Main.java \
    && java -cp target/classes Main > answer.new \
    && diff -u sample.expected answer.new; then
    mv answer.new answer.txt
else
    status=$?
    rm -f answer.new
    exit "$status"
fi`,
	milk3: String.raw`task_classes="$(pwd)/target/classes"
task_run=$(mktemp -d) || exit 1
trap 'rm -rf "$task_run"' EXIT
if rm -rf target/classes \
    && mkdir -p target/classes \
    && javac --release 17 -encoding UTF-8 -Xlint:all -Werror -d target/classes Main.java \
    && cp milk3.in "$task_run/milk3.in" \
    && (cd "$task_run" && java -cp "$task_classes" milk3) \
    && diff -u sample.expected "$task_run/milk3.out" \
    && cp "$task_run/milk3.out" milk3.out.new \
    && mv milk3.out.new milk3.out; then
    printf 'Verified milk3.out\n'
else
    task_status=$?
    rm -f milk3.out.new
    exit "$task_status"
fi`,
	pprime: String.raw`task_classes="$(pwd)/target/classes"
task_run=$(mktemp -d) || exit 1
trap 'rm -rf "$task_run"' EXIT
if rm -rf target/classes \
    && mkdir -p target/classes \
    && javac --release 17 -encoding UTF-8 -Xlint:all -Werror -d target/classes Main.java \
    && cp pprime.in "$task_run/pprime.in" \
    && (cd "$task_run" && java -cp "$task_classes" pprime) \
    && diff -u sample.expected "$task_run/pprime.out" \
    && cp "$task_run/pprime.out" pprime.out.new \
    && mv pprime.out.new pprime.out; then
    printf 'Verified pprime.out\n'
else
    task_status=$?
    rm -f pprime.out.new
    exit "$task_status"
fi`
});

function documentedFoundationGuard(slug, guide) {
	assert.ok(Object.hasOwn(foundationGuards, slug));
	const script = foundationGuards[slug];
	const matches = [...guide.matchAll(/```sh\n([\s\S]*?)\n```/g)];
	assert.equal(matches.length, 1);
	assert.equal(matches[0][1], script, "Downloaded guide command differs from the checked-in guard");
	return script;
}

function bucketAnswer(capacity) {
	const states = [[0, 0, capacity[2]]];
	const visited = new Set([states[0].join(",")]);
	const answer = new Set();
	for (let next = 0; next < states.length; next++) {
		const state = states[next];
		if (state[0] === 0) answer.add(state[2]);
		for (let from = 0; from < 3; from++) {
			for (let to = 0; to < 3; to++) {
				if (from === to) continue;
				const move = Math.min(state[from], capacity[to] - state[to]);
				const poured = [...state];
				poured[from] -= move;
				poured[to] += move;
				const key = poured.join(",");
				if (!visited.has(key)) {
					visited.add(key);
					states.push(poured);
				}
			}
		}
	}
	return `${[...answer].sort((a, b) => a - b).join(" ")}\n`;
}

function isPrime(value) {
	if (value < 2) return false;
	for (let divisor = 2; divisor * divisor <= value; divisor++) {
		if (value % divisor === 0) return false;
	}
	return true;
}

function primeAnswer(lower, upper) {
	const answers = [];
	if (upper <= 20000) {
		for (let value = lower; value <= upper; value++) {
			const text = String(value);
			if (text === [...text].reverse().join("") && isPrime(value))
				answers.push(value);
		}
	}
	else {
		// Independently mirror all half-seeds, then filter even candidates as well.
		for (let digits = 1; digits <= 8; digits++) {
			const half = Math.ceil(digits / 2);
			for (let seed = 10 ** (half - 1); seed < 10 ** half; seed++) {
				const left = String(seed);
				const suffix = [...(digits % 2 ? left.slice(0, -1) : left)]
					.reverse()
					.join("");
				const value = Number(left + suffix);
				if (value >= lower && value <= upper && isPrime(value))
					answers.push(value);
			}
		}
	}
	return answers.map(value => `${value}\n`).join("");
}

function orderingAnswer(scores, balances) {
	const names = ["Abdi", "Beyonce", "Camila", "Diego"];
	const bankNames = ["Emilia", "Farooq", "Gabrielle", "Hassan"];
	const nameOrder = (a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
	const exams = names
		.map((name, i) => [name, scores[i]])
		.sort((a, b) => a[1] - b[1] || nameOrder(a, b));
	const accounts = bankNames
		.map((name, i) => [name, balances[i]])
		.sort((a, b) => b[1] - a[1] || nameOrder(a, b));
	return `[${exams.map(([name, value]) => `Name: ${name} | score: ${value}`).join(", ")}]\n[${accounts.map(([name, value]) => `Name: ${name} | balance: ${value}`).join(", ")}]\n`;
}

function orderingSource(source, scores, balances) {
	for (const [kind, names, originals, values] of [
		[
			"Exam",
			["Abdi", "Beyonce", "Camila", "Diego"],
			[95, 100, 87, 87],
			scores
		],
		[
			"BankAccount",
			["Emilia", "Farooq", "Gabrielle", "Hassan"],
			[1000, 1050, 1200, 1050],
			balances
		]
	]) {
		for (let i = 0; i < names.length; i++) {
			const before = `new ${kind}("${names[i]}", ${originals[i]})`;
			assert.equal(source.split(before).length, 2);
			source = source.replace(
				before,
				`new ${kind}("${names[i]}", ${values[i]})`
			);
		}
	}
	return source;
}

export async function verifySilverFoundationExport(
	fixture,
	files,
	directory,
	runNative,
	record
) {
	const slug = fixture.silverFoundationPack;
	assert.ok(["records", "milk3", "pprime"].includes(slug));
	assert.match(files["README.md"], /Contract/);
	assert.match(files["README.md"], /Independent/);
	assert.doesNotMatch(files["README.md"], /\.\.\/README\.md/);
	assert.ok(Object.hasOwn(files, "sample.expected"));
	assert.equal(files["sample.expected"], fixture.expected);
	// CI selects the JDK through PATH; executable overrides must not run code.
	const java = "java";
	const javac = "javac";
	const script = documentedFoundationGuard(slug, files["README.md"]);
	for (const malicious of [
		`${script}\nprintf injected`,
		script.replace("javac --release", "printf injected; javac --release")
	]) {
		assert.throws(
			() => documentedFoundationGuard(slug, files["README.md"].replace(script, malicious)),
			/Downloaded guide command differs from the checked-in guard/
		);
	}
	const originalSource = files["Main.java"];
	const previous = "Earlier saved answer\n";
	const compile = async (cwd) => {
		await rm(join(cwd, "classes"), { recursive: true, force: true });
		await mkdir(join(cwd, "classes"));
		const result = await runNative(
			javac,
			[
				"--release",
				"17",
				"-encoding",
				"UTF-8",
				"-Xlint:all",
				"-Werror",
				"-d",
				"classes",
				"Main.java"
			],
			cwd
		);
		assert.equal(result.code, 0, result.stderr);
	};
	const cases = [];
	if (slug === "milk3") {
		for (const capacities of [
			[8, 9, 10],
			[1, 1, 1],
			[20, 20, 20],
			[4, 6, 7],
			[20, 1, 20],
			[1, 20, 20],
			[2, 3, 4],
			[7, 13, 20]
		]) {
			cases.push({
				input: `${capacities.join(" ")}\n`,
				expected: bucketAnswer(capacities)
			});
		}
	}
	else if (slug === "pprime") {
		for (const [lower, upper] of [
			[5, 5],
			[11, 11],
			[12, 100],
			[5, 500],
			[99, 111],
			[121, 131],
			[9000, 11000],
			[5, 100000000]
		]) {
			cases.push({
				input: `${lower} ${upper}\n`,
				expected: primeAnswer(lower, upper)
			});
		}
	}
	else {
		for (const [scores, balances] of [
			[
				[95, 100, 87, 87],
				[1000, 1050, 1200, 1050]
			],
			[
				[-2147483648, 0, 2147483647, 0],
				[-2147483648, 0, 2147483647, 0]
			],
			[
				[7, 7, 7, 7],
				[-1, -1, -1, -1]
			],
			[
				[4, 3, 2, 1],
				[1, 2, 3, 4]
			]
		]) {
			cases.push({
				source: orderingSource(originalSource, scores, balances),
				expected: orderingAnswer(scores, balances)
			});
		}
	}
	await compile(directory);
	for (const current of cases) {
		if (current.source) {
			await writeFile(join(directory, "Main.java"), current.source);
			await compile(directory);
		}
		if (fixture.input)
			await writeFile(join(directory, fixture.input), current.input);
		await writeFile(join(directory, fixture.output), previous);
		const result = await runNative(
			java,
			["-ea", "-Xmx256m", "-cp", "classes", fixture.entryClass],
			directory
		);
		if (fixture.reference) {
			assert.equal(result.code, 0, result.stderr);
			assert.equal(
				fixture.noInput
					? result.stdout
					: await readFile(join(directory, fixture.output), "utf8"),
				current.expected
			);
		}
		else {
			assert.equal(result.code, 2);
			assert.match(result.stderr, /Unfinished learner task: TASK/);
			assert.equal(result.stdout, "");
			assert.equal(
				await readFile(join(directory, fixture.output), "utf8"),
				previous
			);
		}
	}
	await writeFile(join(directory, "Main.java"), originalSource);
	if (fixture.input)
		await writeFile(join(directory, fixture.input), files[fixture.input]);
	await compile(directory);
	let malformedCases = 0;
	let directBankTaskRefusal = false;
	if (slug === "records" && !fixture.reference) {
		const probe = join(directory, "bank-task-probe");
		await mkdir(probe);
		await writeFile(
			join(probe, "BankTaskProbe.java"),
			`
class BankTaskProbe {
    public static void main(String[] args) {
        try {
            Main.compareBankAccounts(new BankAccount("first", 1), new BankAccount("second", 2));
        } catch (UnsupportedOperationException unfinished) {
            System.err.println(unfinished.getMessage());
            System.exit(2);
        }
    }
}
`
		);
		const compiled = await runNative(
			javac,
			[
				"--release",
				"17",
				"-cp",
				"classes",
				"-d",
				"bank-task-probe",
				"bank-task-probe/BankTaskProbe.java"
			],
			directory
		);
		assert.equal(compiled.code, 0, compiled.stderr);
		const refused = await runNative(
			java,
			["-cp", `classes${delimiter}bank-task-probe`, "BankTaskProbe"],
			directory
		);
		assert.equal(refused.code, 2);
		assert.match(refused.stderr, /TASK 2: bank account ordering/);
		assert.equal(refused.stdout, "");
		directBankTaskRefusal = true;
	}
	if (!fixture.reference && fixture.input) {
		const invalid
			= slug === "milk3"
				? ["", "8 9", "0 9 10", "8 21 10", "8 9 10 extra"]
				: ["", "5", "4 500", "500 5", "5 500 extra"];
		for (const input of invalid) {
			await writeFile(join(directory, fixture.input), input);
			await writeFile(join(directory, fixture.output), previous);
			const result = await runNative(
				java,
				["-cp", "classes", fixture.entryClass],
				directory
			);
			assert.equal(result.code, 2);
			assert.match(result.stderr, /Invalid input:/);
			assert.equal(result.stdout, "");
			assert.equal(
				await readFile(join(directory, fixture.output), "utf8"),
				previous
			);
			malformedCases++;
		}
		await writeFile(join(directory, fixture.input), files[fixture.input]);
	}
	let documentedGuards = 0;
	for (const variant of [
		"normal",
		"broken-compile",
		"missing-entry",
		...(fixture.reference ? ["wrong-oracle"] : [])
	]) {
		const work = join(directory, `guard-${variant}`);
		await mkdir(work);
		for (const [name, text] of Object.entries(files))
			await writeFile(join(work, name), text);
		await mkdir(join(work, "target/classes"), { recursive: true });
		const older = await runNative(
			javac,
			["--release", "17", "-d", "target/classes", "Main.java"],
			work
		);
		assert.equal(older.code, 0, older.stderr);
		if (variant === "broken-compile") {
			await writeFile(
				join(work, "Main.java"),
				`${originalSource}\nThis is not Java\n`
			);
		}
		if (variant === "missing-entry") {
			await writeFile(
				join(work, "Main.java"),
				originalSource.replace(
					`class ${fixture.entryClass} {`,
					"class MissingEntry {"
				)
			);
		}
		if (variant === "wrong-oracle") {
			await writeFile(
				join(work, "sample.expected"),
				"Incorrect sample oracle\n"
			);
		}
		await writeFile(join(work, fixture.output), previous);
		const result = await runNative("bash", ["-c", script], work);
		const answer = await readFile(join(work, fixture.output), "utf8");
		if (variant === "normal" && fixture.reference) {
			assert.equal(result.code, 0, result.stderr);
			assert.equal(answer, files["sample.expected"]);
		}
		else {
			assert.notEqual(result.code, 0);
			assert.equal(answer, previous);
		}
		await assert.rejects(
			readFile(
				join(
					work,
					fixture.noInput ? "answer.new" : `${fixture.output}.new`
				)
			),
			{ code: "ENOENT" }
		);
		documentedGuards++;
	}
	for (const [name, text] of Object.entries(files))
		assert.equal(await readFile(join(directory, name), "utf8"), text);
	record("verified-silver-foundation-native-role", {
		pack: slug,
		role: fixture.reference ? "reference" : "learner",
		cases: cases.length,
		malformedCases,
		documentedGuards,
		guideCommandRejections: 2,
		scriptFromRepository: true,
		maximumPrimeInterval: slug === "pprime" && fixture.reference,
		integerLimitOrdering: slug === "records",
		directBankTaskRefusal,
		standaloneContract: true,
		entryClass: fixture.entryClass,
		previousAnswerPreserved: true,
		learnerRemainsUnfinished: !fixture.reference,
		sourceFilesUnchanged: true
	});
}
