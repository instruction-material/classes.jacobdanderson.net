import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI runner.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { usacoFixtures } from "./fixtures/usaco-restored-packs.mjs";
import { confirmProjectImport, downloadProjectZip, openProjectSidebar } from "./ide-workspace-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "usaco-course-import-browser-ci";
const changes = {
	"UG23-Balanced-Photo": ["3\n1\n3\n2\n", "2\n"],
	"UG25-Sleepy-Cow-Sorting": ["3\n3 2 1\n", "2\n2 1"],
	"UG26-Out-of-Sorts": ["3\n2\n1\n1\n", "1\n"],
	"UG24-Why-Did-the-Cow-Cross-the-Road-III": ["3\n1\n2\n3\n1\n2\n3\n", "3\n"],
	"UG27-Snow-Boots": ["4 3\n0 8 8 0\n0 2\n0 3\n8 1\n", "0\n1\n1\n"],
	"UG21-Moo-Tube": ["5 4\n1 2 7\n2 3 7\n3 4 7\n4 5 7\n8 3\n7 5\n1 1\n7 2\n", "0\n4\n4\n4\n"],
	"UG0-Contest-Contract": ["3\n-1000000000 -1000000000 -1000000000\n", "-3000000000\n"],
	"UG22-Binary-Indexed-Tree-Fenwick-Tree": ["2 5\n1000000000 1000000000\nPREFIX -1\nADD 0 1000000000\nRANGE 0 1\nADD 1 -1000000000\nPREFIX 1\n", "0\n3000000000\n2000000000\n"],
	"UG14-MST": ["4 5\n0 1 999999999\n0 1 1000000000\n1 2 1000000000\n2 3 1000000000\n3 3 0\n", "1 0\n2 1\n3 2\nTotal Distance: 2999999999\n"],
	"UG9-Dijkstras-Algorithm": ["5 5\n0 1 999999999\n0 1 1000000000\n1 2 1000000000\n2 3 1000000000\n3 3 0\n", "0 1 Distance: 999999999\n0 1 2 Distance: 1999999999\n0 1 2 3 Distance: 2999999999\nUnreachable: 4\n"],
	"US9-Number-Triangles": ["3\n1\n100 99\n0 0 100\n", "200\n"],
	"UG7-Treasure-Chest": ["4\n8\n15\n3\n7\n", "22\n"],
	"UB1-Square-Pasture": ["0 0 1 1\n2 0 3 1\n", "9"],
	"UB62-Cow-College": ["2\n1 2\n", "2 1\n"],
	"UB63-Feeding-the-Cows": ["1\n2 1\nGH\n", [2]],
	"US18-Counting-Haybales": ["3 3\n0 5 10\n0 0\n6 9\n0 10\n", "1\n0\n3\n"],
	"US21-Priority-Queues": ["3\n9 z\n9 a\n-1 urgent\n", "urgent\nz\na\n"],
	"US22-Prefix-Sums": ["3 3\n1 -2 4\n0 0\n0 3\n1 2\n", "0\n3\n-2\n"],
	"UG1-Dynamic-Programming-with-Fibonacci": ["0\n", "0\n"],
	"UG3-Teamwork": ["3 2\n1\n10\n1\n", "21\n"],
	"UG5-Marathon": ["3 3\n0 0\n1 1\n2 0\nQ 1 3\nU 3 5 0\nQ 1 3\n", "2\n5\n"],
	"UG8-Bookshelf": ["3 1000000000\n1000000 800000000\n1000000 800000000\n1000000 800000000\n", "3000000\n"]
};

function record(event, fields = {}) {
	console.log(JSON.stringify({ event, parentTaskId: taskId, cwd: root, parentPid: process.pid, time: new Date().toISOString(), ...fields }));
}

async function verifyGoldPracticePlacement(page, origin, fixture, screenshotRoot) {
	const old = "usaco-gold-usg0-setup-contest-contract-and-gold-mindset";
	const connectivity = "usaco-gold-unit-3-msts-dsu-and-connectivity-proofs";
	const ordering = "usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure";
	const rows = [
		[connectivity, `${old}-curriculum-core-project-setup-and-gold-mindset`, "UG21-Moo-Tube"],
		[connectivity, `${old}-supplemental-gold-log-setup-and-gold-mindset`, "UG21-Moo-Tube"],
		[ordering, `${old}-supplemental-why-did-the-cow-cross-the-road-iii`, "UG24-Why-Did-the-Cow-Cross-the-Road-III"],
		[ordering, `${old}-supplemental-snow-boots`, "UG27-Snow-Boots"]
	];
	for (const [index, [module, item, folder]] of rows.entries()) {
		await page.goto(`${origin}/courses#${module}`, { waitUntil: "domcontentloaded" });
		await page.waitForSelector(".lesson-view-toggle button:nth-child(2)");
		await page.click(".lesson-view-toggle button:nth-child(2)");
		const selector = `#${module}-${item}`;
		await page.waitForSelector(selector);
		await page.waitForFunction(selector => [...document.querySelector(selector)?.querySelectorAll(".item-content-markdown h2") ?? []].some(heading => heading.textContent === "Open, save and run"), {}, selector);
		const card = await page.$eval(selector, item => ({ text: item.textContent, links: [...item.querySelectorAll("a")].map(link => ({ href: link.getAttribute("href"), import: link.classList.contains("is-ide-starter") })) }));
		assert.ok(card.links.some(link => link.href === `https://github.com/instruction-material/USACO-Gold/tree/main/${folder}/starter`));
		const confirmed = true;
		if (confirmed) {
			assert.ok(card.links.some(link => link.import && new URL(link.href, origin).searchParams.get("projectKey") === `usaco-gold:${item}:starter`));
		}
		else {
			assert.ok(card.links.every(link => !link.import), "README-only legacy packs must not offer a confirmed import");
		}
		if (!fixture.reference) assert.ok(card.links.every(link => !link.href.includes("/solution")));
		assert.match(card.text, /Contract and reasoning/);
		assert.match(card.text, /Check and explain/);
		if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
			const element = await page.$(selector);
			await element.screenshot({ path: join(screenshotRoot, process.env.COURSE_IMPORT_SCREENSHOT_DIR, `course-import-usaco-gold-legacy-setup-${index}-${fixture.reference ? "reference" : "learner"}-lesson.png`) });
		}
		record("verified-gold-setup-placement", { preservedItemId: item, destination: module, sourceFolder: folder, role: fixture.reference ? "reference" : "learner", viewportWidth: page.viewport().width, confirmedIdeImport: confirmed });
	}
}

async function runNative(command, args, directory, environment = {}, input) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			cwd: directory,
			detached: true,
			env: { ...process.env, ...environment },
			stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"]
		});
		if (input !== undefined) child.stdin.end(input);
		record("start", { command: [command, ...args], cwd: directory, pid: child.pid, timeoutMs: 30000 });
		let stdout = "";
		let stderr = "";
		child.stdout.on("data", data => stdout += data);
		child.stderr.on("data", data => stderr += data);
		const timer = setTimeout(() => {
			try {
				process.kill(-child.pid, "SIGKILL");
			}
			catch {}
			record("child-process-group-cleanup", { pid: child.pid, reason: "timeout" });
		}, 30000);
		child.once("error", (error) => {
			clearTimeout(timer);
			reject(error);
		});
		child.once("close", (code) => {
			clearTimeout(timer);
			record("end", { pid: child.pid, exitCode: code });
			resolve({ code, stdout, stderr });
		});
	});
}

function verifyStdioAnswer(fixture, input, output, expected) {
	if (!fixture.folder.startsWith("UB63-Feeding-the-Cows/")) {
		assert.equal(output, expected);
		return;
	}
	const tokens = input.trim().split(/\s+/);
	const caseCount = Number(tokens.shift());
	assert.equal(caseCount, expected.length);
	const lines = output.replaceAll("\r\n", "\n").trimEnd().split("\n");
	assert.equal(lines.length, 2 * caseCount);
	for (let i = 0; i < caseCount; i++) {
		const n = Number(tokens.shift());
		const k = Number(tokens.shift());
		const cows = tokens.shift();
		const layout = lines[2 * i + 1];
		assert.match(lines[2 * i], /^\d+$/);
		assert.equal(
			Number(lines[2 * i]),
			expected[i],
			"The count must be optimal"
		);
		assert.equal(layout.length, n);
		assert.match(layout, /^[.GH]+$/);
		assert.equal(
			[...layout].filter(breed => breed !== ".").length,
			expected[i]
		);
		for (let position = 0; position < n; position++) {
			assert.ok(
				[...layout].some(
					(patch, index) =>
						patch === cows[position]
						&& Math.abs(index - position) <= k
				),
				"Every cow needs a matching patch within K"
			);
		}
	}
	assert.equal(tokens.length, 0);
}

async function sourceFiles(fixture) {
	const files = {};
	for (const [name, hash] of Object.entries(fixture.hashes)) {
		const url = `https://raw.githubusercontent.com/${fixture.repository}/${fixture.revision}/${fixture.folder}/${name}`;
		const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
		assert.equal(response.status, 200, url);
		const bytes = new Uint8Array(await response.arrayBuffer());
		assert.equal(createHash("sha256").update(bytes).digest("hex"), hash, url);
		files[name] = new TextDecoder().decode(bytes);
	}
	return files;
}

async function exportedFiles(page) {
	await page.evaluate(() => {
		window.__usacoZip = null;
		if (window.__usacoZipHook) return;
		window.__usacoZipHook = true;
		const original = HTMLAnchorElement.prototype.click;
		HTMLAnchorElement.prototype.click = function () {
			if (this.download.endsWith(".zip") && this.href.startsWith("blob:")) {
				void fetch(this.href).then(response => response.arrayBuffer()).then(bytes => window.__usacoZip = Array.from(new Uint8Array(bytes)));
				return;
			}
			return original.call(this);
		};
	});
	await downloadProjectZip(page);
	await page.waitForFunction(() => Array.isArray(window.__usacoZip));
	const zip = unzipSync(Uint8Array.from(await page.evaluate(() => window.__usacoZip)));
	return Object.fromEntries(Object.entries(zip).map(([path, bytes]) => [path.slice(path.indexOf("/") + 1), strFromU8(bytes)]));
}

function verifyFenwickPracticeAnswer(fixture, data, output) {
	const [n, ...values] = data.trim().split(/\s+/).map(Number);
	assert.equal(values.length, n);
	const tokens = output.trim().split(/\s+/);
	assert.ok(tokens.every(token => /^\d+$/.test(token)));
	const numbers = tokens.map(Number);
	if (fixture.folder.startsWith("UG25-")) {
		const goal = [...values].sort((a, b) => a - b).join(",");
		const queue = [[values, 0]];
		const seen = new Set([values.join(",")]);
		let minimum;
		for (let next = 0; next < queue.length; next++) {
			const [state, distance] = queue[next];
			if (state.join(",") === goal) {
				minimum = distance;
				break;
			}
			for (let k = 1; k < n; k++) {
				const moved = state.slice(1);
				moved.splice(k, 0, state[0]);
				const key = moved.join(",");
				if (!seen.has(key)) {
					seen.add(key);
					queue.push([moved, distance + 1]);
				}
			}
		}
		assert.equal(numbers[0], minimum, "The move count must be independently minimal");
		assert.equal(numbers.length, minimum + 1);
		const row = [...values];
		for (const k of numbers.slice(1)) {
			assert.ok(k >= 1 && k < n, "Only legal front-cow moves are allowed");
			row.splice(k, 0, row.shift());
		}
		assert.equal(row.join(","), goal, "Any optimal sequence must sort the row");
		return;
	}
	assert.equal(numbers.length, 1);
	let expected = 0;
	if (fixture.folder.startsWith("UG23-")) {
		for (let i = 0; i < n; i++) {
			const left = values.slice(0, i).filter(height => height > values[i]).length;
			const right = values.slice(i + 1).filter(height => height > values[i]).length;
			if (Math.max(left, right) > 2 * Math.min(left, right)) expected++;
		}
	}
	else {
		const row = [...values];
		do {
			expected++;
			for (let i = 0; i + 1 < n; i++) {
				if (row[i] > row[i + 1]) [row[i], row[i + 1]] = [row[i + 1], row[i]];
			}
			for (let i = n - 2; i >= 0; i--) {
				if (row[i] > row[i + 1]) [row[i], row[i + 1]] = [row[i + 1], row[i]];
			}
		} while (row.some((value, i) => i > 0 && row[i - 1] > value));
	}
	assert.equal(numbers[0], expected);
}

async function verifyFenwickPracticeExport(fixture, files, directory) {
	assert.match(files["README.md"], /javac -encoding UTF-8 Main.java/);
	assert.doesNotMatch(files["README.md"], /\.\.\/README\.md/);
	assert.ok(files["README.md"].includes(fixture.input) && files["README.md"].includes(fixture.output));
	const javaHome = process.env.JAVA_HOME_21_X64 ?? process.env.JAVA_HOME;
	const javac = process.env.JAVAC ?? (javaHome ? join(javaHome, "bin/javac") : "javac");
	const java = process.env.JAVA ?? (javaHome ? join(javaHome, "bin/java") : "java");
	const compile = await runNative(javac, ["--release", "17", "-encoding", "UTF-8", "-Xlint:all", "-Werror", "Main.java"], directory);
	assert.equal(compile.code, 0, compile.stderr);
	const input = join(directory, fixture.input);
	const output = join(directory, fixture.output);
	const args = ["-ea", "-Xmx256m", "Main"];
	const [changedInput] = changes[fixture.folder.split("/")[0]];
	const single = fixture.folder.startsWith("UG25-") ? "1\n1\n" : "1\n0\n";
	if (fixture.reference) await writeFile(output, "Earlier saved answer\n");
	for (const data of [files[fixture.sample], changedInput, single]) {
		await writeFile(input, data);
		const result = await runNative(java, args, directory);
		assert.equal(result.stdout, "");
		if (fixture.reference) {
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			verifyFenwickPracticeAnswer(fixture, data, await readFile(output, "utf8"));
		}
		else {
			assert.equal(result.code, 2);
			assert.match(result.stderr, /Complete the five .+ tasks before producing an answer/);
			if (data === files[fixture.sample]) assert.equal(existsSync(output), false);
			else assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
			await writeFile(output, "Earlier saved answer\n");
		}
	}
	if (!fixture.reference) {
		await writeFile(input, "broken\n");
		const refused = await runNative(java, args, directory);
		assert.equal(refused.code, 2);
		assert.equal(refused.stdout, "");
		assert.ok(refused.stderr.startsWith(`Cannot solve ${fixture.input}:`));
		assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
		await rm(input);
		const missing = await runNative(java, args, directory);
		assert.equal(missing.code, 2);
		assert.equal(missing.stdout, "");
		assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
	}
	for (const name of ["Main.java", "README.md", fixture.sample]) assert.equal(await readFile(join(directory, name), "utf8"), files[name]);
}

async function verifyNativeExport(fixture, files, directory) {
	await mkdir(directory);
	for (const [name, content] of Object.entries(files)) await writeFile(join(directory, name), content);
	if (fixture.mode === "java") {
		if (fixture.fenwickPracticePack) {
			await verifyFenwickPracticeExport(fixture, files, directory);
			return;
		}
		if (fixture.orderingPack) {
			assert.match(files["README.md"], /javac --release 17 -encoding UTF-8/);
			assert.doesNotMatch(files["README.md"], /\.\.\/README\.md/);
			assert.ok(files["README.md"].includes(fixture.input) && files["README.md"].includes(fixture.output));
			const javaHome = process.env.JAVA_HOME_21_X64 ?? process.env.JAVA_HOME;
			const javac = process.env.JAVAC ?? (javaHome ? join(javaHome, "bin/javac") : "javac");
			const java = process.env.JAVA ?? (javaHome ? join(javaHome, "bin/java") : "java");
			const compile = await runNative(javac, ["--release", "17", "-encoding", "UTF-8", "-Xlint:all", "-Werror", "Main.java"], directory);
			assert.equal(compile.code, 0, compile.stderr);
			const input = join(directory, fixture.input);
			const output = join(directory, fixture.output);
			const args = ["-ea", "-Xmx256m", "Main"];
			const [changedInput, changedAnswer] = changes[fixture.folder.split("/")[0]];
			for (const [data, expected] of [[files[fixture.sample], fixture.expected], [changedInput, changedAnswer]]) {
				await writeFile(input, data);
				const result = await runNative(java, args, directory);
				if (fixture.reference) {
					assert.equal(result.code, 0, result.stderr);
					assert.equal(result.stderr, "");
					assert.equal(await readFile(output, "utf8"), expected);
					if (fixture.orderingPack === "Snow Boots") {
						const [n, b] = data.trim().split(/\s+/).map(Number);
						const diagnostics = result.stdout.trim().split(/\s+/).map(Number);
						assert.equal(diagnostics.length, b);
						assert.ok(diagnostics.every(gap => Number.isInteger(gap) && gap >= 1 && gap < n));
					}
					else {
						assert.equal(result.stdout, "");
					}
				}
				else {
					assert.equal(result.code, 2);
					assert.equal(result.stdout, "");
					assert.match(result.stderr, /Complete the (five CircleCross|six Snow Boots) tasks before producing an answer/);
					if (data === files[fixture.sample]) assert.equal(existsSync(output), false);
					else assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
					await writeFile(output, "Earlier saved answer\n");
				}
			}
			if (!fixture.reference) {
				await writeFile(input, "broken\n");
				const result = await runNative(java, args, directory);
				assert.equal(result.code, 2);
				assert.equal(result.stdout, "");
				assert.ok(result.stderr.startsWith(`Cannot solve ${fixture.input}:`));
				assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
			}
			assert.equal(await readFile(join(directory, fixture.sample), "utf8"), files[fixture.sample]);
			return;
		}
		const mootube = fixture.folder.startsWith("UG21-Moo-Tube/");
		if (mootube) {
			assert.match(files["README.md"], /with both between\s+1 and 100000/);
			assert.match(files["README.md"], /javac --release 17 -encoding UTF-8/);
			assert.doesNotMatch(files["README.md"], /\.\.\/README\.md/);
			const javaHome = process.env.JAVA_HOME_21_X64 ?? process.env.JAVA_HOME;
			const javac = process.env.JAVAC ?? (javaHome ? join(javaHome, "bin/javac") : "javac");
			const java = process.env.JAVA ?? (javaHome ? join(javaHome, "bin/java") : "java");
			const compile = await runNative(javac, ["--release", "17", "-encoding", "UTF-8", "-Xlint:all", "-Werror", "Main.java"], directory);
			assert.equal(compile.code, 0, compile.stderr);
			const input = join(directory, fixture.input);
			const output = join(directory, fixture.output);
			await writeFile(input, files[fixture.sample]);
			const args = ["-ea", "-Xmx256m", "Main"];
			const result = await runNative(java, args, directory);
			assert.equal(result.stdout, "");
			if (fixture.reference) {
				assert.equal(result.code, 0, result.stderr);
				assert.equal(result.stderr, "");
				assert.equal(await readFile(output, "utf8"), fixture.expected);
				const [changedInput, expected] = changes["UG21-Moo-Tube"];
				await writeFile(input, changedInput);
				const changed = await runNative(java, args, directory);
				assert.equal(changed.code, 0, changed.stderr);
				assert.equal(changed.stderr, "");
				assert.equal(changed.stdout, "");
				assert.equal(await readFile(output, "utf8"), expected);
			}
			else {
				assert.equal(result.code, 2);
				assert.equal(result.stderr, "Cannot solve mootube.in: Complete the six MooTube tasks before producing an answer\n");
				assert.equal(existsSync(output), false);
				await writeFile(output, "Earlier saved answer\n");
				await writeFile(input, "1 1\n0 1\n");
				const refused = await runNative(java, args, directory);
				assert.equal(refused.code, 2);
				assert.equal(refused.stdout, "");
				assert.match(refused.stderr, /^Cannot solve mootube.in:/);
				assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
			}
			assert.equal(await readFile(join(directory, fixture.sample), "utf8"), files[fixture.sample]);
			return;
		}
		const setup = fixture.folder.startsWith("UG0-Contest-Contract/");
		assert.match(files["README.md"], setup ? /0 <= N <= 200000/ : fixture.stdio ? /1 <= N <= 200000/ : /1 <= N <= 2000/);
		assert.match(files["README.md"], /javac -encoding UTF-8 Main.java/);
		assert.doesNotMatch(files["README.md"], /\.\.\/README\.md/);
		const javaHome = process.env.JAVA_HOME_21_X64 ?? process.env.JAVA_HOME;
		const javac = process.env.JAVAC ?? (javaHome ? join(javaHome, "bin/javac") : "javac");
		const java = process.env.JAVA ?? (javaHome ? join(javaHome, "bin/java") : "java");
		const compile = await runNative(javac, ["--release", "17", "-encoding", "UTF-8", "-Xlint:all", "-Werror", "Main.java"], directory);
		assert.equal(compile.code, 0, compile.stderr);
		const output = join(directory, fixture.output);
		const args = ["-ea", "-Xmx256m", "Main"];
		if (fixture.stdio) {
			const sentinel = join(directory, "earlier-answer.txt");
			await writeFile(sentinel, "Earlier saved answer\n");
			const originalEntries = (await readdir(directory)).sort();
			const result = await runNative(
				java,
				args,
				directory,
				{},
				files[fixture.input]
			);
			if (fixture.reference) {
				assert.equal(result.code, 0, result.stderr);
				assert.equal(result.stderr, "");
				verifyStdioAnswer(
					fixture,
					files[fixture.input],
					result.stdout,
					fixture.expected
				);
				const [input, expected] = changes[fixture.folder.split("/")[0]];
				const changed = await runNative(
					java,
					args,
					directory,
					{},
					input
				);
				assert.equal(changed.code, 0, changed.stderr);
				assert.equal(changed.stderr, "");
				verifyStdioAnswer(fixture, input, changed.stdout, expected);
				if (setup) {
					const emptyList = await runNative(java, args, directory, {}, "0\n");
					assert.equal(emptyList.code, 0, emptyList.stderr);
					assert.equal(emptyList.stderr, "");
					assert.equal(emptyList.stdout, "0\n");
				}
			}
			else {
				assert.equal(result.code, 2);
				assert.equal(
					result.stderr,
					setup ? "Cannot solve setup input: Complete the setup total task before producing an answer\n" : "Cannot solve Fenwick input: Complete the four Fenwick tasks before producing an answer\n"
				);
				assert.equal(result.stdout, "");
			}
			for (const input of setup ? ["0 7\n", "1 1000000001\n", ""] : ["2 2\n1 2\nPREFIX 1\nADD -1 3\n", ""]) {
				const refused = await runNative(
					java,
					args,
					directory,
					{},
					input
				);
				assert.equal(refused.code, 2);
				assert.match(refused.stderr, setup ? /^Cannot solve setup input:/ : /^Cannot solve Fenwick input:/);
				assert.equal(
					refused.stdout,
					"",
					"Refused input must not print partial answers"
				);
			}
			assert.equal(
				await readFile(sentinel, "utf8"),
				"Earlier saved answer\n"
			);
			assert.deepEqual(
				(await readdir(directory)).sort(),
				originalEntries,
				"Native execution creates no answer file"
			);
			assert.equal(
				await readFile(join(directory, fixture.input), "utf8"),
				files[fixture.input]
			);
			return;
		}
		const result = await runNative(java, args, directory);
		assert.equal(result.stdout, "");
		if (fixture.reference) {
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			assert.equal(await readFile(output, "utf8"), fixture.expected);
			const [input, expected] = changes[fixture.folder.split("/")[0]];
			await writeFile(join(directory, fixture.input), input);
			const changed = await runNative(java, args, directory);
			assert.equal(changed.code, 0, changed.stderr);
			assert.equal(changed.stderr, "");
			assert.equal(changed.stdout, "");
			assert.equal(await readFile(output, "utf8"), expected);
			await writeFile(join(directory, fixture.input), "2 1\n0 1 -1\n");
			const refused = await runNative(java, args, directory);
			assert.equal(refused.code, 2);
			assert.ok(refused.stderr.startsWith(`Cannot solve ${fixture.input}:`));
			assert.equal(refused.stdout, "");
			assert.equal(await readFile(output, "utf8"), expected);
			if (fixture.folder.startsWith("UG14-MST/")) {
				await writeFile(join(directory, fixture.input), "2 0\n");
				const disconnected = await runNative(java, args, directory);
				assert.equal(disconnected.code, 2);
				assert.match(disconnected.stderr, /Graph is disconnected; no spanning tree/);
				assert.equal(disconnected.stdout, "");
				assert.equal(await readFile(output, "utf8"), expected);
			}
		}
		else {
			assert.equal(result.code, 2);
			assert.equal(result.stderr, `Cannot solve ${fixture.input}: Complete the four ${fixture.unfinishedTask ?? "Dijkstra"} tasks before producing an answer\n`);
			assert.equal(existsSync(output), false);
			await writeFile(output, "Earlier saved answer\n");
			const refused = await runNative(java, args, directory);
			assert.equal(refused.code, 2);
			assert.equal(refused.stderr, result.stderr);
			assert.equal(refused.stdout, "");
			assert.equal(await readFile(output, "utf8"), "Earlier saved answer\n");
		}
		return;
	}
	if (fixture.stdio) {
		const input = files[fixture.input];
		const result = await runNative(
			"python3",
			["main.py"],
			directory,
			{},
			input
		);
		if (fixture.reference) {
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			verifyStdioAnswer(fixture, input, result.stdout, fixture.expected);
			const [changedInput, expected]
				= changes[fixture.folder.split("/")[0]];
			const changed = await runNative(
				"python3",
				["main.py"],
				directory,
				{},
				changedInput
			);
			assert.equal(changed.code, 0, changed.stderr);
			assert.equal(changed.stderr, "");
			verifyStdioAnswer(fixture, changedInput, changed.stdout, expected);
		}
		else {
			assert.equal(result.code, 1);
			assert.match(result.stderr, /NotImplementedError/);
			assert.equal(
				result.stdout,
				"",
				"An unfinished learner must not print an answer"
			);
		}
		return;
	}
	const source = fixture.mode === "python" ? "main.py" : "main.cpp";
	for (const sanitized of fixture.mode === "cpp" ? [false, true] : [false]) {
		if (fixture.mode === "cpp") {
			const compiler = await runNative("c++", ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", ...(sanitized ? ["-fsanitize=address,undefined", "-fno-omit-frame-pointer"] : []), source, "-o", "project"], directory);
			assert.equal(compiler.code, 0, compiler.stderr);
		}
		await rm(join(directory, fixture.output), { force: true });
		const command = fixture.mode === "python" ? "python3" : join(directory, "project");
		const args = fixture.mode === "python" ? [source] : [];
		const environment = sanitized ? { ASAN_OPTIONS: process.platform === "darwin" ? "detect_leaks=0" : "detect_leaks=1", UBSAN_OPTIONS: "halt_on_error=1" } : {};
		const result = await runNative(command, args, directory, environment);
		assert.doesNotMatch(result.stderr, /AddressSanitizer|runtime error:/);
		if (fixture.reference) {
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			assert.equal(await readFile(join(directory, fixture.output), "utf8"), fixture.expected);
			const [input, output] = changes[fixture.folder.split("/")[0]];
			await writeFile(join(directory, fixture.input), input);
			await rm(join(directory, fixture.output));
			const changed = await runNative(command, args, directory, environment);
			assert.equal(changed.code, 0, changed.stderr);
			assert.equal(changed.stderr, "");
			assert.equal(await readFile(join(directory, fixture.output), "utf8"), output);
			await writeFile(join(directory, fixture.input), files[fixture.input]);
		}
		else {
			assert.equal(result.code, fixture.mode === "cpp" ? 2 : 1, "An untouched learner must report its unfinished helper");
			assert.match(result.stderr, /TODO|NotImplementedError|unfinished|Complete .+ before (?:running the starter|checking \w+\.out)/i);
			assert.equal(existsSync(join(directory, fixture.output)), false);
		}
	}
}

nodeTest(
	"pinned USACO packs preserve unfinished helpers and native input/output contracts",
	{ timeout: 180000 },
	async () => {
		const temporary = await mkdtemp(join(tmpdir(), "usaco-pinned-native-"));
		const verified = new Set();
		try {
			const feeding = usacoFixtures.find(
				fixture => fixture.folder === "UB63-Feeding-the-Cows/solution"
			);
			verifyStdioAnswer(feeding, "1\n2 1\nGH\n", "2\nGH\n", [2]);
			verifyStdioAnswer(feeding, "1\n2 1\nGH\n", "2\nHG\n", [2]);
			assert.throws(() =>
				verifyStdioAnswer(feeding, "1\n2 1\nGH\n", "2\nGG\n", [2])
			);
			assert.throws(() =>
				verifyStdioAnswer(feeding, "1\n2 1\nGH\n", "1\nG.\n", [2])
			);
			for (const fixture of usacoFixtures) {
				const key = `${fixture.repository}/${fixture.folder}`;
				if (verified.has(key)) continue;
				await verifyNativeExport(fixture, await sourceFiles(fixture), join(temporary, String(verified.size)));
				verified.add(key);
			}
			assert.equal(verified.size, 44);
			record("verified-usaco-pinned-native-contracts", {
				roles: verified.size,
				packs: 22,
				nativeJava: true,
				samplesAndChangedInputs: true,
				ordinaryAndSanitizedCpp: true,
				nativeStdio: true,
				anyOptimalFeedingLayout: true,
				anyOptimalSleepyPlan: true,
				goldBidirectionalSweepsAndDuplicates: true
			});
		}
		finally {
			await rm(temporary, { recursive: true, force: true });
			record("cleanup", { command: "usaco-pinned-native", pid: process.pid });
		}
	}
);

nodeTest(
	"restored USACO roles confirm, preserve edits and export correct native I/O",
	{ timeout: 600000 },
	async () => {
		let browser;
		let server;
		let page;
		let temporary;
		let exitCode = 0;
		const previousDirectory = process.cwd();
		try {
			process.chdir(root);
			record("start", { command: "usaco-course-import-browser", pid: process.pid, timeoutMs: 600000 });
			assert.ok(existsSync(join(root, "dist/index.html")), "Build this exact front end before the browser check");
			temporary = await mkdtemp(join(tmpdir(), "usaco-course-workflow-"));
			server = await preview({ root, preview: { host: "127.0.0.1", port: 0, strictPort: true } });
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, await puppeteer.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(value => value && existsSync(value));
			assert.ok(executablePath, "Chrome is required");
			browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
			page = await browser.newPage();
			let fixture;
			let files;
			let catalog = true;
			let sourceRequests = 0;
			let remoteWrites = 0;
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				if (request.interceptResolutionState().action === "disabled") {
					if (!["GET", "OPTIONS"].includes(request.method())) remoteWrites++;
					return;
				}
				const url = new URL(request.url());
				const respond = (body, contentType = "application/json") => request.respond({ status: 200, contentType, headers: { "access-control-allow-origin": "*" }, body });
				if (url.hostname === "api.github.com") {
					sourceRequests++;
					assert.equal(url.pathname, `/repos/${fixture.repository}/contents/${fixture.folder}`);
					assert.equal(url.searchParams.get("ref"), "main");
					const paths = [...Object.keys(files), "ignored.out"];
					void respond(JSON.stringify(paths.map(name => ({ type: "file", name, path: `${fixture.folder}/${name}`, size: name === "ignored.out" ? 1 : Buffer.byteLength(files[name]), html_url: `https://github.com/${fixture.repository}/blob/main/${fixture.folder}/${name}`, download_url: `https://raw.githubusercontent.com/${fixture.repository}/main/${fixture.folder}/${name}` }))));
				}
				else if (url.hostname === "raw.githubusercontent.com") {
					sourceRequests++;
					const name = url.pathname.split("/").at(-1);
					assert.equal(url.pathname, `/${fixture.repository}/main/${fixture.folder}/${name}`);
					assert.ok(Object.hasOwn(files, name), "Only the selected role's allowed files can be fetched");
					void respond(files[name], "text/plain");
				}
				else if (
					request.method() === "GET"
					&& url.href.startsWith(
						"https://cdn.jsdelivr.net/pyodide/v314.0.0/full/"
					)
				) {
					void request.continue();
				}
				else if (url.origin !== origin || url.pathname.startsWith("/api/")) {
					if (!["GET", "OPTIONS"].includes(request.method())) remoteWrites++;
					let body = {};
					if (catalog && url.pathname === "/api/accounts/me") body = fixture.reference ? { tutorID: "usaco-tutor" } : { userID: "usaco-learner" };
					if (catalog && fixture.reference && url.pathname === "/api/tutors/loggedin") body = { currentTutor: { _id: "usaco-tutor", name: "Reference fixture", email: "reference@example.invalid", age: 30, state: "GA", coursePermissions: [fixture.courseId], usersOfTutorLength: 0 } };
					if (catalog && url.pathname === "/api/users/loggedin") body = { currentUser: { _id: "usaco-learner", name: "Learner fixture", email: "learner@example.invalid", age: 14, state: "GA", courseAccess: [fixture.courseId], courseProgress: [] } };
					if (catalog && fixture.reference && url.pathname === "/api/users/oftutor/usaco-tutor") body = [{ _id: "usaco-learner", name: "Learner fixture", email: "learner@example.invalid", age: 14, state: "GA", courseAccess: [fixture.courseId], courseProgress: [] }];
					void respond(JSON.stringify(body));
				}
				else {
					void request.continue();
				}
			});
			for (const [index, current] of usacoFixtures.entries()) {
				fixture = current;
				files = await sourceFiles(fixture);
				const sourceUrl = `https://github.com/${fixture.repository}/tree/main/${fixture.folder}`;
				const selector = fixture.folder.startsWith("UG21-Moo-Tube/")
					? `#${fixture.anchor}-${fixture.itemId} a[href='${sourceUrl}']`
					: `a[href='${sourceUrl}']`;
				const screenshotKey = `${fixture.courseId}-${fixture.folder.replaceAll("/", "-")}${fixture.identityLabel ? `-${fixture.identityLabel}` : ""}`;
				const before = sourceRequests;
				catalog = true;
				await page.setViewport({ width: index % 2 ? 1280 : 390, height: 900 });
				await page.goto(`${origin}/courses#${fixture.anchor}`, { waitUntil: "domcontentloaded" });
				await page.waitForSelector(".lesson-view-toggle button");
				for (const position of fixture.lessonView ? [fixture.lessonView] : [1, 2, 3]) {
					await page.click(`.lesson-view-toggle button:nth-child(${position})`);
					await page.waitForSelector(`.lesson-view-toggle button:nth-child(${position})[aria-pressed='true']`);
					if (await page.$(selector)) break;
				}
				await page.waitForSelector(selector);
				await page.waitForFunction(selector => ["Contract and reasoning", "Guided implementation", "Check and explain", "Open, save and run"].every(label => [...document.querySelector(selector)?.closest(".lesson-item")?.querySelectorAll(".item-content-markdown h2") ?? []].some(heading => heading.textContent === label)), { timeout: 15000 }, selector);
				const card = await page.$eval(selector, link => ({ text: link.closest(".lesson-item").textContent, links: [...link.closest(".lesson-item").querySelectorAll("a")].map(action => ({ text: action.textContent, href: action.getAttribute("href"), import: action.classList.contains("is-ide-starter") })) }));
				assert.match(card.text, /Contract and reasoning/);
				if (fixture.folder.startsWith("UG0-Contest-Contract/")) {
					assert.equal(await page.$$eval(".lesson-item a[href]", links => links.filter(link => /UG21-Moo-Tube|UG24-|UG27-/.test(link.getAttribute("href"))).length), 0, "Advanced practice must not remain in setup");
				}
				if (fixture.mode === "java") {
					assert.match(card.text, /JDK 17 or newer/);
					assert.match(card.text, fixture.folder.startsWith("UG0-Contest-Contract/") ? /does not execute this native input\/output checkpoint/ : fixture.stdio ? /does not execute this input-driven data structure/ : fixture.folder.startsWith("UG14-MST/") ? /does not execute this file-I\/O\/matrix program/ : fixture.folder.startsWith("UG21-Moo-Tube/") ? /does not execute this file-I\/O\/offline-connectivity program/ : fixture.orderingPack || fixture.fenwickPracticePack ? /does not execute this file-I\/O\/ordering program/ : /does not execute this file-I\/O\/priority-queue program/);
					assert.match(card.text, fixture.lessonView === 1 ? /Required implementation checkpoint/ : /optional practice/);
				}
				if (!fixture.reference) assert.ok(card.links.every(link => !link.href.includes("/solution")), "Learner view withholds reference resources");
				const href = card.links.find(link => link.import && new URL(link.href, origin).searchParams.get("starterUrl") === sourceUrl)?.href;
				assert.ok(href, `${fixture.folder} needs its own confirmed action`);
				const params = new URL(href, origin).searchParams;
				assert.equal(params.get("mode"), fixture.mode);
				assert.equal(params.get("projectKey"), `${fixture.courseId}:${fixture.itemId}:${fixture.reference ? "reference" : "starter"}`);
				assert.equal(sourceRequests, before);
				if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
					const directory = join(previousDirectory, process.env.COURSE_IMPORT_SCREENSHOT_DIR);
					await mkdir(directory, { recursive: true });
					const link = await page.$(selector);
					const element = await link.evaluateHandle(element => element.closest(".lesson-item"));
					await element.asElement().screenshot({ path: join(directory, `course-import-usaco-${screenshotKey}-lesson.png`) });
				}
				catalog = false;
				await page.goto(new URL(href, origin).href, { waitUntil: "domcontentloaded" });
				await page.waitForSelector("[data-testid='ide-route-import-confirm']");
				assert.equal(sourceRequests, before, "Source is not fetched before consent");
				const previous = await page.evaluate(() => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]"));
				await confirmProjectImport(page);
				const key = params.get("projectKey");
				await page.waitForFunction((key, files) => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").some(project => project.courseProjectKey === key && project.files.length === Object.keys(files).length && Object.entries(files).every(([name, content]) => project.files.some(file => file.name === name && file.content === content))), {}, key, files);
				assert.equal(sourceRequests, before + 1 + Object.keys(files).length);
				await openProjectSidebar(page);
				assert.deepEqual(await exportedFiles(page), files);
				const source = fixture.mode === "python" ? "main.py" : fixture.mode === "java" ? "Main.java" : "main.cpp";
				const edited = `${files[source]}\n${fixture.mode === "python" ? "#" : "//"} Saved USACO browser attempt\n`;
				await page.select("select[aria-label='Active project file']", source);
				await page.click(".cm-content");
				const modifier = await page.evaluate(() => /Mac/.test(navigator.platform) ? "Meta" : "Control");
				await page.keyboard.down(modifier);
				await page.keyboard.press("a");
				await page.keyboard.up(modifier);
				await page.keyboard.sendCharacter(edited);
				await page.keyboard.down(modifier);
				await page.keyboard.press("s");
				await page.keyboard.up(modifier);
				await page.waitForFunction((key, edited, source) => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").some(project => project.courseProjectKey === key && project.files.some(file => file.name === source && file.content === edited)), {}, key, edited, source);
				if (fixture.mode === "cpp") {
					await page.click("button.run-control");
					await page.waitForFunction(() => document.querySelector(".output-panel")?.textContent.includes("-std=c++20"));
					assert.match(await page.$eval(".output-panel", element => element.textContent), /does not compile or execute/);
				}
				if (fixture.mode === "java") {
					await page.click("button.run-control");
					await page.waitForFunction(() => document.querySelector("[data-testid='ide-run-status']")?.textContent.trim() === "Native build instructions");
					assert.equal(await page.$(".stdin-panel"), null, "Native Java must not offer browser Turtle/Scanner input");
					const output = await page.$eval(".output-panel", element => element.textContent);
					assert.match(output, /javac -encoding UTF-8 Main.java/);
					assert.match(output, fixture.folder.startsWith("UG0-Contest-Contract/") ? /does not execute this native input\/output checkpoint/ : fixture.stdio ? /does not execute its input-driven data structure/ : fixture.folder.startsWith("UG14-MST/") ? /does not execute its file I\/O or matrix algorithm/ : fixture.folder.startsWith("UG21-Moo-Tube/") ? /does not execute its file I\/O or offline connectivity algorithm/ : fixture.orderingPack || fixture.fenwickPracticePack ? /does not execute its file I\/O or ordering algorithm/ : /does not execute its file I\/O or priority queue/);
					if (fixture.stdio) {
						assert.match(output, /java Main < sample.in/);
						assert.match(output, /creates no answer file/);
					}
					else {
						assert.ok(output.includes(fixture.input) && output.includes(fixture.output));
					}
					assert.equal(await page.$(".output-line--stdout"), null);
				}
				if (fixture.stdio && fixture.mode === "python") {
					const inputs = [
						files[fixture.input],
						...(fixture.reference
							? [changes[fixture.folder.split("/")[0]][0]]
							: [])
					];
					for (const [inputIndex, input] of inputs.entries()) {
						await page.$eval(
							".stdin-panel textarea",
							(element, input) => {
								element.value = input;
								element.dispatchEvent(
									new Event("input", { bubbles: true })
								);
							},
							input
						);
						await page.waitForSelector(
							"button.run-control:not([disabled])"
						);
						const runtimeNetwork = await page.createCDPSession();
						try {
							await runtimeNetwork.send("Network.enable");
							await runtimeNetwork.send("Network.setBlockedURLs", {
								urls: [
									`${origin}/api/*`,
									"*://*.jacobdanderson.net/*",
									"*://cs.avasan.org/*",
									"*://api.github.com/*",
									"*://raw.githubusercontent.com/*"
								]
							});
							// Chrome worker imports stall under page-level interception.
							// Retain service blocks while letting the real worker start.
							await page.setRequestInterception(false);
							await page.$eval("[data-testid='ide-run-status']", (element) => {
								element.dataset.usacoRunStarted = "false";
								const observer = new MutationObserver(() => {
									if (element.textContent.trim() === "Starting Python") {
										element.dataset.usacoRunStarted = "true";
										observer.disconnect();
									}
								});
								observer.observe(element, { childList: true, characterData: true, subtree: true });
							});
							await page.click("button.run-control");
							await page.waitForFunction(
								() => {
									const status = document.querySelector("[data-testid='ide-run-status']");
									return status?.dataset.usacoRunStarted === "true"
										&& /Run complete|Run failed/.test(status.textContent ?? "");
								},
								{ timeout: 120000 }
							);
						}
						finally {
							await page.setRequestInterception(true);
							await runtimeNetwork.send("Network.setBlockedURLs", { urls: [] });
							await runtimeNetwork.detach();
						}
						const status = await page.$eval(
							"[data-testid='ide-run-status']",
							element => element.textContent.trim()
						);
						const stderr = await page.$$eval(
							".output-line--stderr",
							elements =>
								elements
									.map(element => element.textContent)
									.join("\n")
						);
						const stdout = await page.$$eval(
							".output-line--stdout",
							elements =>
								elements
									.map(element => element.textContent)
									.join("\n") + (elements.length ? "\n" : "")
						);
						if (fixture.reference) {
							assert.equal(status, "Run complete", stderr);
							assert.equal(stderr, "");
							verifyStdioAnswer(
								fixture,
								input,
								stdout,
								inputIndex
									? changes[fixture.folder.split("/")[0]][1]
									: fixture.expected
							);
						}
						else {
							assert.equal(status, "Run failed");
							assert.match(stderr, /NotImplementedError/);
							assert.equal(stdout, "");
						}
					}
				}
				const expectedFiles = { ...files, [source]: edited };
				const exported = await exportedFiles(page);
				assert.deepEqual(exported, expectedFiles);
				await verifyNativeExport(fixture, exported, join(temporary, String(index)));
				await page.goto(new URL(href, origin).href, { waitUntil: "domcontentloaded" });
				await page.waitForSelector(".code-ide-workspace");
				assert.equal(await page.$("[data-testid='ide-route-import-confirm']"), null);
				const saved = await page.evaluate(key => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").find(project => project.courseProjectKey === key), key);
				assert.deepEqual(Object.fromEntries(saved.files.map(file => [file.name, file.content])), expectedFiles);
				const all = await page.evaluate(() => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]"));
				for (const project of previous) assert.deepEqual(all.find(item => item._id === project._id), project, "Other saved attempts are unchanged");
				assert.equal(sourceRequests, before + 1 + Object.keys(files).length, "Reopening never redownloads or overwrites edits");
				if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
					await page.screenshot({ path: join(previousDirectory, process.env.COURSE_IMPORT_SCREENSHOT_DIR, `course-import-usaco-${screenshotKey}-workspace.png`) });
				}
				if (fixture.folder.startsWith("UG0-Contest-Contract/") && fixture.lessonView === 2) {
					catalog = true;
					const sourceBeforePlacement = sourceRequests;
					await verifyGoldPracticePlacement(page, origin, fixture, previousDirectory);
					assert.equal(sourceRequests, sourceBeforePlacement, "Inspecting relocated legacy practice must not fetch source");
					// Restore the workspace so the next viewer gets a full catalog load.
					catalog = false;
					await page.goto(new URL(href, origin).href, { waitUntil: "domcontentloaded" });
					await page.waitForSelector(".code-ide-workspace");
					assert.equal(sourceRequests, sourceBeforePlacement, "Restoring the saved attempt must not fetch source");
				}
				record("verified-usaco-role", {
					course: fixture.courseId,
					itemId: fixture.itemId,
					folder: fixture.folder,
					revision: fixture.revision,
					mode: fixture.mode,
					savedKey: key,
					fileCount: Object.keys(files).length,
					preservedOtherAttempts: previous.length,
					ordinaryAndSanitized: fixture.mode === "cpp",
					unfinishedLearner: !fixture.reference,
					nativeFileIo: !fixture.stdio,
					nativeStdio: Boolean(fixture.stdio),
					browserStdio: Boolean(fixture.stdio) && fixture.mode === "python",
					nativeJava: fixture.mode === "java",
					browserNativeInstructions: fixture.mode === "java",
					browserInputPanelHidden: fixture.mode === "java"
				});
			}
			assert.equal(remoteWrites, 0);
			record("verified-usaco-workflows", {
				imports: usacoFixtures.length,
				packs: 22,
				nativeJava: true,
				roleSeparation: true,
				consentBeforeSource: true,
				savedAndExported: true,
				nativeStdio: true,
				browserStdio: true,
				remoteWrites
			});
		}
		catch (error) {
			exitCode = 1;
			if (page && !page.isClosed()) {
				record("failed-usaco-browser-state", await page.evaluate(() => ({
					runStatus: document.querySelector("[data-testid='ide-run-status']")?.textContent,
					consoleOutput: document.querySelector(".output-panel")?.textContent,
					frames: [...document.querySelectorAll("iframe")].map(frame => ({ src: frame.getAttribute("src"), title: frame.title }))
				})));
			}
			throw error;
		}
		finally {
			if (page) await page.close();
			if (browser) await browser.close();
			if (server) await server.close();
			if (temporary) await rm(temporary, { recursive: true, force: true });
			process.chdir(previousDirectory);
			record("cleanup", { pid: process.pid, exitCode });
		}
	}
);
