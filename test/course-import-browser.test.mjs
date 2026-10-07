import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
// This workflow is run by node --test in CI, outside Vitest.
// eslint-disable-next-line test/no-import-node-test -- Uses the native CI test runner.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { confirmProjectImport, downloadProjectZip, openProjectSidebar } from "./ide-workspace-controls.mjs";
import { runAxeInPage } from "../scripts/a11y-axe-runtime.mjs";
import { exerciseTicTacToe } from "./course-tic-tac-toe-workflow.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const axeSource = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
// Production builds include page analytics. Keep that service blocked when
// worker execution requires releasing page-level fixture interception.
const productionAnalyticsPattern = "*://analytics.jacobdanderson.net/*";
// Exact published learner source, not synthetic answers or mutable main bytes.
const searchSourceRevision = "2473272796d28401c2b8a3f50b472070d9272e3a";
const searchPacks = [
	{
		folder: "AM7-Reverse-Number-Guesser",
		digests: {
			"main.py":
				"851956a342785f81798d9677d38939acb1e58f384061ada657526f5e19feb504",
			"README.md":
				"77b7b89d7b0b26edd235248706f21c2ec2251d41839f7bf226ceee2d2962112e"
		},
		reminder: "Implement the four tasks in README.md"
	},
	{
		folder: "AM7-Number-Guesser",
		digests: {
			"main.py":
				"5feb8b0ad3a81d75df5ecd5bdee603e85704ba8ecbea8126e5ee46b8fbeb5ce1",
			"README.md":
				"31a0223de38812330d1d0d015b60a26769f1eece5da61487d1a7bad875461bec"
		},
		reminder: "Implement the three tasks in README.md"
	},
	{
		folder: "AM7-Runtime-Comparator",
		digests: {
			"main.py":
				"177a2debc4ae16fbb684ddfd7adcb4b3785ac2fb5c3df6db93a062acec9fc22e",
			"README.md":
				"d291662971b988908ae513c30ac32aa72382ed9716aaf2057b98276b815ad910"
		},
		reminder: "Implement the five core tasks in README.md"
	},
	{
		folder: "AM12-Crazy-Name-Tags-Printer",
		revision: "efd0cdfb190a9110ec1a160786e13f724a60153f",
		digests: {
			"main.py":
				"dc6ba7303df926a4c66b10852981899e41f7b04ba7aff6232156658df43b8f92",
			"README.md":
				"04b01b7669f42a0cf6aed44ee23a65e5ed5dce686801ebcfa236271eec661d7b"
		},
		reminder: "Implement the four core tasks in README.md"
	},
	{
		folder: "AM13-Conways-Game-of-Life",
		revision: "5e32ed800087ac4d9b0a45d28a3e815e28d58a24",
		digests: {
			"README.md":
				"5d5c2daf1ea8ca915a0d125d5d49ecc9dc4b61f090df315097854095da6dcb9a",
			"b-heptomino-shuttle.in":
				"7a36638a57420f796c466c4395b1231e61ba0404f29d88b309d33c56a225fbf4",
			"boat.in":
				"68fb15811ce8e5c1f3b118dd7d95b57fbf26bad89c6ea171261aa5c49c348013",
			"design1.in":
				"7923908dd9291bf04ef3d3ca2b303d07ece53192dd8d5c148c9560ea175b1e8a",
			"f-pentomino.in":
				"9869ce538ea1808027456e429a39a2997fe7f8852b36f7d79cbff89032cd9c70",
			"hertz-oscillator.in":
				"600584759ce1122384b96c56b26be689af4b7906aa508477f5a80b9a05e3c345",
			"main.py":
				"783872ec6400014416a5a1b6068c59bf597ae376f0c7ead0ebb9d55f9219f83f",
			"repeat.in":
				"48e3ffa23891bc27613df3aa2ec73f5fc0542f34ecca3323261635e724433377",
			"spaceship.in":
				"21eeb302c63a9d362add7b82e7fd146b7764fc320cff64e5cf13e0429008f654",
			"square.in":
				"4cb6c005cc3d39e44353c489a4dc13776903d270a50186e8fe05a018537fa6e7"
		},
		reminder: "Implement the ten tasks in README.md"
	},
	{
		folder: "AM13-Two-Player-Conways",
		revision: "5e32ed800087ac4d9b0a45d28a3e815e28d58a24",
		digests: {
			"README.md":
				"6d0ae407fd9c71bf5a59d2d1fe6acfb5b15f81bfe91f496b917054cbda95fee5",
			"main.py":
				"ebc0dffcc1709373ea12808b194fe7774f2f22d29fd34559cf13d0aa18710475",
			"player1.in":
				"b0352395372fd463e6a0c9a2f10a8be4650978fa1bb0c4ef9865f18ef267683b",
			"player2.in":
				"43cd440da61a1ed7d770c2bdfa3dc552085337d1c866c1881cbe3e49c72932f3"
		},
		reminder: "Implement the fourteen tasks in README.md"
	},
	{
		folder: "AM14-Tic-Tac-Toe-UI",
		revision: "94ddb35a81a5f768ef0a44d91e107cf1b4e66cf5",
		digests: {
			"main.py": "24e8ef82aebb2e2b3f11109c55d0365b32970e2cbe66435d01638779145463c4",
			"README.md": "6763f69906246f05975c5e2587fd3a7a3dc1bb92d11693937a1fd6b30b43073e"
		},
		reminder: "Read README.md, implement the learner functions"
	},
	{
		folder: "AM14-Tic-Tac-Toe-AI",
		revision: "94ddb35a81a5f768ef0a44d91e107cf1b4e66cf5",
		digests: {
			"main.py": "bc44c26a98bc76050200bcdc7e696f1d5da2cab53de98127d2515b8874b0e641",
			"README.md": "6a42e1d4633f19a4adbe6c99485b6357f9d8261f45f95f72c61821a1972983ac"
		},
		reminder: "Read README.md, implement the learner functions"
	},
	{
		folder: "AM14-Tic-Tac-Toe-AI-Test",
		revision: "94ddb35a81a5f768ef0a44d91e107cf1b4e66cf5",
		digests: {
			"main.py": "a53ecc93875007e9a36b3816aa9c5765e92062bb9668e063e1ecfa2e3be51082",
			"README.md": "81f6694dda40a8e561c2b6708adfae97f6c264e4a4442399289b045bc6428844"
		},
		reminder: "Read README.md, implement the learner functions"
	},
	{
		folder: "AM14-Tic-Tac-Toe-AI-with-Forks",
		revision: "94ddb35a81a5f768ef0a44d91e107cf1b4e66cf5",
		digests: {
			"main.py": "0464e05b3f82523de32d561fd09aec65cc3969964cf4f6bd137db9cc303558e6",
			"README.md": "40de3dae1da8cbc87b4441987aca074f0ef4d8c019fd89acdc3d213b1d721e9f"
		},
		reminder: "Read README.md, implement the learner functions"
	}
];

async function readPublishedStarter(pack) {
	const entries = await Promise.all(
		Object.entries(pack.digests).map(async ([name, digest]) => {
			const url = `https://raw.githubusercontent.com/instruction-material/Python-Level-3/${pack.revision ?? searchSourceRevision}/${pack.folder}/starter/${name}`;
			const response = await fetch(url, {
				signal: AbortSignal.timeout(20000)
			});
			assert.equal(
				response.status,
				200,
				`Published starter is available: ${url}`
			);
			const bytes = Buffer.from(await response.arrayBuffer());
			assert.equal(
				createHash("sha256").update(bytes).digest("hex"),
				digest,
				`Unchanged source bytes for ${pack.folder}/${name}`
			);
			return [name, bytes.toString("utf8")];
		})
	);
	return Object.fromEntries(entries);
}

async function exerciseNameTags(page, learnerFiles) {
	// Test-only edits exercise one valid-name path in the real imported scaffold.
	// Native source tests independently verify full reference contracts/errors.
	// No completed solution is downloaded or put into the learner source folder.
	const edits = {
		"raise NotImplementedError(\"Implement name_variations from README.md\")":
			[
				"alternate = ''.join(c for i, c in enumerate(name) if i % 2 == 0)",
				"pending, reverse = list(name), []",
				"while pending:",
				"    reverse.append(pending.pop())",
				"return (name, alternate, ''.join(reverse))"
			],
		"raise NotImplementedError(\"Implement format_tags from README.md\")": [
			"lines = []",
			"for variation in name_variations(name):",
			"    lines.extend(variation)",
			"    lines.append('')",
			"return '\\n'.join(lines) + '\\n'"
		],
		"raise NotImplementedError(\"Implement write_tags from README.md\")": [
			"text = format_tags(name)",
			"with open(path, 'w', encoding='utf-8', newline='\\n') as output:",
			"    output.write(text)"
		],
		"raise NotImplementedError(\"Implement main from README.md\")": [
			"name = input('What is your name? ')",
			"write_tags(name, path)",
			"print('NAME_TAG_WORKFLOW_WRITTEN')",
			"return {'status': 'written', 'path': path}"
		]
	};
	let edited = learnerFiles["main.py"];
	for (const [placeholder, lines] of Object.entries(edits)) {
		assert.equal(edited.split(placeholder).length, 2);
		edited = edited.replace(placeholder, lines.join("\n    "));
	}
	const reminder
		= "print(\"Implement the four core tasks in README.md; separate files are optional.\")";
	assert.equal(edited.split(reminder).length, 2);
	edited = edited.replace(reminder, "main()");
	const modifier = await page.evaluate(() =>
		/Mac/.test(navigator.platform) ? "Meta" : "Control"
	);
	await page.click(".cm-content");
	await page.keyboard.down(modifier);
	await page.keyboard.press("a");
	await page.keyboard.up(modifier);
	await page.keyboard.sendCharacter(edited);
	await page.$eval(".stdin-panel textarea", (element) => {
		element.value = "é A😀\n";
		element.dispatchEvent(new Event("input", { bubbles: true }));
	});
	await page.waitForFunction(
		(source) => {
			const projects = JSON.parse(
				localStorage.getItem("classes-python-ide-projects:anonymous")
				?? "[]"
			);
			return projects.some(
				project =>
					project.courseProjectKey
					=== "browser:AM12-Crazy-Name-Tags-Printer:starter"
					&& project.files.some(
						file =>
							file.name === "main.py" && file.content === source
					)
			);
		},
		{},
		edited
	);
	await page.click("button.run-control");
	await page.waitForFunction(
		() =>
			document
				.querySelector(".output-panel")
				?.textContent
				.includes("NAME_TAG_WORKFLOW_WRITTEN")
				&& document
					.querySelector("[data-testid='ide-run-status']")
					?.textContent
					.includes("Run complete"),
		{ timeout: 90000 }
	);
	const expected = "é\n \nA\n😀\n\né\nA\n\n😀\nA\n \né\n\n";
	const clickOutput = async () => {
		const index = await page.$$eval(".file-button", buttons =>
			buttons.findIndex(
				button =>
					button.querySelector("span")?.textContent === "output.txt"
			));
		assert.ok(index >= 0, "Name Tags generated a real output.txt");
		const buttons = await page.$$(".file-button");
		await buttons[index].click();
		for (const button of buttons) await button.dispose();
		await page.waitForFunction(
			() =>
				document.querySelector(".file-button.is-active span")
					?.textContent === "output.txt"
		);
		assert.deepEqual(
			await page.$$eval(".cm-content .cm-line", lines =>
				lines.map(line => line.textContent)),
			expected.split("\n")
		);
	};
	await page.waitForFunction(
		(expected) => {
			const projects = JSON.parse(
				localStorage.getItem("classes-python-ide-projects:anonymous")
				?? "[]"
			);
			return projects.some(
				project =>
					project.courseProjectKey
					=== "browser:AM12-Crazy-Name-Tags-Printer:starter"
					&& project.files.some(
						file =>
							file.name === "output.txt"
							&& file.content === expected
					)
			);
		},
		{},
		expected
	);
	assert.doesNotMatch(
		await page.$eval(".output-panel", element => element.textContent),
		/Traceback|EOFError|NotImplementedError/
	);
	await clickOutput();
	await page.evaluate(() => {
		const originalClick = HTMLAnchorElement.prototype.click;
		HTMLAnchorElement.prototype.click = function () {
			if (
				this.download.endsWith(".zip")
				&& this.href.startsWith("blob:")
			) {
				void fetch(this.href)
					.then(response => response.arrayBuffer())
					.then((bytes) => {
						window.__nameTagsDownloadedZip = Array.from(
							new Uint8Array(bytes)
						);
					});
				return;
			}
			return originalClick.call(this);
		};
	});
	await downloadProjectZip(page);
	await page.waitForFunction(() =>
		Array.isArray(window.__nameTagsDownloadedZip)
	);
	const zip = unzipSync(
		Uint8Array.from(
			await page.evaluate(() => window.__nameTagsDownloadedZip)
		)
	);
	const archived = (name) => {
		const keys = Object.keys(zip).filter(path => path.endsWith(`/${name}`));
		assert.equal(keys.length, 1, `Exactly one exported ${name}`);
		return strFromU8(zip[keys[0]]);
	};
	assert.equal(archived("main.py"), edited);
	assert.equal(archived("README.md"), learnerFiles["README.md"]);
	assert.equal(archived("output.txt"), expected);
	assert.equal(
		Object.keys(zip).filter(path => path.endsWith(".txt")).length,
		1,
		"Optional outputs are not generated by the core workflow"
	);
	await page.reload({ waitUntil: "domcontentloaded" });
	await openProjectSidebar(page);
	await page.waitForSelector(".file-button");
	await clickOutput();
	console.log(
		"Name Tags imported scaffold edited, console input executed, exact Unicode/LF output reopened, ZIP exported and saved work reopened"
	);
}
async function exerciseConway(page, pack, learnerFiles) {
	// Test-only valid-path edits verify the real file/console worker workflow.
	// Independent source tests verify full domains, rules and game outcomes.
	const owned = pack.folder === "AM13-Two-Player-Conways";
	const edits = {
		parse_coordinates: [
			"return [tuple(map(int, line.split())) for line in lines if line.strip()]"
		],
		read_coordinates: [
			"with open(path, 'r', encoding='utf-8') as source:",
			"    return parse_coordinates(source.readlines(), height, width)"
		],
		make_grid: owned
			? [
					"board = [[0] * width for _ in range(height)]",
					"for owner, points in ((1, player1_coords), (2, player2_coords)):",
					"    for row, col in points:",
					"        board[row][col] = owner",
					"return board"
				]
			: [
					"board = [[False] * width for _ in range(height)]",
					"for row, col in coords:",
					"    board[row][col] = True",
					"return board"
				],
		next_generation: [
			"result = []",
			"for row in range(len(grid)):",
			"    line = []",
			"    for col in range(len(grid[0])):",
			"        nearby = [grid[row+dr][col+dc] for dr in (-1,0,1) for dc in (-1,0,1)",
			"                  if (dr,dc) != (0,0) and 0 <= row+dr < len(grid) and 0 <= col+dc < len(grid[0])]",
			"        count = sum(bool(cell) for cell in nearby)",
			owned
				? "        value = (grid[row][col] if count in (2,3) else 0) if grid[row][col] else ((1 if nearby.count(1) > nearby.count(2) else 2) if count == 3 else 0)"
				: "        value = count == 3 or (grid[row][col] and count == 2)",
			"        line.append(value)",
			"    result.append(line)",
			"return result"
		],
		main: owned
			? [
					"first = read_coordinates(player1_path, height, width)",
					"second = read_coordinates(player2_path, height, width)",
					"assert len(first) == len(second) == 5",
					"board = make_grid(first, second, height, width)",
					"grow = parse_coordinates([input('grow: ')], height, width)[0]",
					"kill = parse_coordinates([input('kill: ')], height, width)[0]",
					"assert board[grow[0]][grow[1]] == 0 and board[kill[0]][kill[1]] == 2",
					"board[grow[0]][grow[1]], board[kill[0]][kill[1]] = 1, 0",
					"board = next_generation(board)",
					"print('CONWAY_WORKFLOW_OWNED', len(board), len(board[0]))",
					"with open(player1_path, 'rb') as source, open('workflow.in', 'wb') as probe:",
					"    probe.write(source.read())"
				]
			: [
					"coords = read_coordinates(path, height, width)",
					"assert len(coords) == 4",
					"board = next_generation(make_grid(coords, height, width))",
					"print('CONWAY_WORKFLOW_SINGLE', len(board), len(board[0]))",
					"with open(path, 'rb') as source, open('workflow.in', 'wb') as probe:",
					"    probe.write(source.read())"
				]
	};
	let edited = learnerFiles["main.py"];
	for (const [name, lines] of Object.entries(edits)) {
		const placeholder = `raise NotImplementedError("Implement ${name} from README.md")`;
		assert.equal(edited.split(placeholder).length, 2);
		edited = edited.replace(placeholder, lines.join("\n    "));
	}
	const reminder = owned
		? "print(\"Implement the fourteen tasks in README.md; then select a bounded or continuous game.\")"
		: "print(\"Implement the ten tasks in README.md; then select a bounded or continuous run.\")";
	assert.equal(edited.split(reminder).length, 2);
	edited = edited.replace(reminder, "main()");
	const modifier = await page.evaluate(() =>
		/Mac/.test(navigator.platform) ? "Meta" : "Control"
	);
	await page.click(".cm-content");
	await page.keyboard.down(modifier);
	await page.keyboard.press("a");
	await page.keyboard.up(modifier);
	await page.keyboard.sendCharacter(edited);
	if (owned) {
		await page.$eval(".stdin-panel textarea", (element) => {
			element.value = "0 0\n4 8\n";
			element.dispatchEvent(new Event("input", { bubbles: true }));
		});
	}
	await page.waitForFunction(
		(key, source) =>
			JSON.parse(
				localStorage.getItem("classes-python-ide-projects:anonymous")
				?? "[]"
			).some(
				project =>
					project.courseProjectKey === key
					&& project.files.some(
						file =>
							file.name === "main.py" && file.content === source
					)
			),
		{},
		`browser:${pack.folder}:starter`,
		edited
	);
	await page.click("button.run-control");
	await page.waitForFunction(
		marker =>
			document
				.querySelector(".output-panel")
				?.textContent
				.includes(marker)
				&& document
					.querySelector("[data-testid='ide-run-status']")
					?.textContent
					.includes("Run complete"),
		{ timeout: 90000 },
		owned ? "CONWAY_WORKFLOW_OWNED 10 10" : "CONWAY_WORKFLOW_SINGLE 30 60"
	);
	assert.doesNotMatch(
		await page.$eval(".output-panel", element => element.textContent),
		/Traceback|EOFError|NotImplementedError/
	);
	const expectedProbe = learnerFiles[owned ? "player1.in" : "repeat.in"];
	await page.waitForFunction(
		(key, text) =>
			JSON.parse(
				localStorage.getItem("classes-python-ide-projects:anonymous")
				?? "[]"
			).some(
				project =>
					project.courseProjectKey === key
					&& project.files.some(
						file =>
							file.name === "workflow.in" && file.content === text
					)
			),
		{},
		`browser:${pack.folder}:starter`,
		expectedProbe
	);
	await page.evaluate(() => {
		const originalClick = HTMLAnchorElement.prototype.click;
		HTMLAnchorElement.prototype.click = function () {
			if (
				this.download.endsWith(".zip")
				&& this.href.startsWith("blob:")
			) {
				void fetch(this.href)
					.then(response => response.arrayBuffer())
					.then((bytes) => {
						window.__conwayDownloadedZip = Array.from(
							new Uint8Array(bytes)
						);
					});
				return;
			}
			return originalClick.call(this);
		};
	});
	await downloadProjectZip(page);
	await page.waitForFunction(() =>
		Array.isArray(window.__conwayDownloadedZip)
	);
	const zip = unzipSync(
		Uint8Array.from(await page.evaluate(() => window.__conwayDownloadedZip))
	);
	const archived = (name) => {
		const keys = Object.keys(zip).filter(path => path.endsWith(`/${name}`));
		assert.equal(keys.length, 1);
		return strFromU8(zip[keys[0]]);
	};
	for (const [name, text] of Object.entries(learnerFiles))
		assert.equal(archived(name), name === "main.py" ? edited : text);
	assert.equal(archived("workflow.in"), expectedProbe);
	await page.reload({ waitUntil: "domcontentloaded" });
	await openProjectSidebar(page);
	await page.waitForSelector(".file-button");
	const saved = await page.evaluate(
		key =>
			JSON.parse(
				localStorage.getItem("classes-python-ide-projects:anonymous")
				?? "[]"
			).find(project => project.courseProjectKey === key)?.files,
		`browser:${pack.folder}:starter`
	);
	for (const [name, text] of Object.entries(learnerFiles)) {
		assert.equal(
			saved.find(file => file.name === name)?.content,
			name === "main.py" ? edited : text
		);
	}
	assert.equal(
		saved.find(file => file.name === "workflow.in")?.content,
		expectedProbe
	);
	console.log(
		`Conway original patterns imported, file/console generation executed, exact ZIP exported and saved files reopened: ${pack.folder}`
	);
}
// Synthetic workflow fixture, not a completed course sorting assignment.
const fileIoInput = "b\n \nA\nb";
const fileIoOutput = "B\n \nA\nB\n";
const fileIoSource = [
	"from pathlib import Path",
	"source = Path('input.txt').read_text(encoding='utf-8')",
	"with open('output.txt', 'w', encoding='utf-8', newline='\\n') as output:",
	"    for letter in source.splitlines():",
	"        output.write(letter.upper() + '\\n')",
	"print('COURSE_FILE_IO_PASS')",
	""
].join("\n");

nodeTest(
	"confirmed imports, accessible resource roles, and saved Python file exports",
	{ timeout: 300000 },
	async () => {
		let browser;
		let server;
		const previousDirectory = process.cwd();
		const startedAt = new Date().toISOString();
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID ?? "course-import-browser-ci";
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				cwd: root,
				command: "course-import-browser",
				pid: process.pid,
				startedAt,
				timeoutMs: 300000
			})
		);
		try {
			process.chdir(root);
			// CI builds this checkout before browser workflows. Serve those assets
			// so dependency discovery cannot reload the document during an import.
			assert.ok(existsSync(join(root, "dist/index.html")), "Build the front end before the browser check");
			server = await preview({
				root,
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				await puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(
				value => typeof value === "string" && value && existsSync(value)
			);
			assert.ok(
				executablePath,
				"Chrome is required for course import browser checks"
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			const page = await browser.newPage();
			try {
				let failDownload = true;
				let sourceRequests = 0;
				let remoteWrites = 0;
				const remoteWriteDestinations = [];
				let courseFixture = false;
				let fileIoFixture = false;
				let searchPack = null;
				let searchFiles = null;
				await page.setRequestInterception(true);
				page.on("request", (request) => {
					if (
						request.interceptResolutionState().action === "disabled"
					) {
						if (!["GET", "OPTIONS"].includes(request.method())) {
							remoteWrites++;
							const url = new URL(request.url());
							remoteWriteDestinations.push(`${request.method()} ${url.origin}${url.pathname}`);
						}
						const hostname = new URL(request.url()).hostname;
						if (
							[
								"api.github.com",
								"raw.githubusercontent.com"
							].includes(hostname)
						) {
							sourceRequests++;
						}
						return;
					}
					const url = new URL(request.url());
					if (url.hostname === "api.github.com") {
						sourceRequests++;
						if (searchPack) {
							assert.equal(
								url.pathname,
								`/repos/instruction-material/Python-Level-3/contents/${searchPack.folder}/starter`
							);
							assert.equal(url.searchParams.get("ref"), "main");
							void request.respond({
								status: 200,
								contentType: "application/json",
								headers: { "access-control-allow-origin": "*" },
								body: JSON.stringify(
									Object.entries(searchFiles).map(
										([name, source]) => ({
											type: "file",
											name,
											path: `${searchPack.folder}/starter/${name}`,
											size: Buffer.byteLength(source),
											html_url: `https://github.com/instruction-material/Python-Level-3/blob/main/${searchPack.folder}/starter/${name}`,
											download_url: `https://raw.githubusercontent.com/instruction-material/Python-Level-3/main/${searchPack.folder}/starter/${name}`
										})
									)
								)
							});
							return;
						}
						void request.respond({
							status: failDownload ? 503 : 200,
							contentType: "application/json",
							headers: { "access-control-allow-origin": "*" },
							body: failDownload
								? "{}"
								: JSON.stringify(
										fileIoFixture
											? [
													...[
														"main.py",
														"input.txt"
													].map(name => ({
														type: "file",
														name,
														path: `starter/${name}`,
														size:
															name === "main.py"
																? Buffer.byteLength(
																		fileIoSource
																	)
																: Buffer.byteLength(
																		fileIoInput
																	),
														html_url: `https://github.com/example/course/blob/main/starter/${name}`,
														download_url: `https://raw.githubusercontent.com/example/course/main/starter/${name}`
													}))
												]
											: [
													{
														type: "file",
														name: "main.py",
														path: "starter/main.py",
														size: 29,
														html_url:
															"https://github.com/example/course/blob/main/starter/main.py",
														download_url:
															"https://raw.githubusercontent.com/example/course/main/starter/main.py"
													}
												]
									)
						});
					}
					else if (url.hostname === "raw.githubusercontent.com") {
						sourceRequests++;
						if (searchPack) {
							const name = url.pathname.split("/").at(-1);
							assert.equal(
								url.pathname,
								`/instruction-material/Python-Level-3/main/${searchPack.folder}/starter/${name}`
							);
							assert.ok(Object.hasOwn(searchFiles, name));
							void request.respond({
								status: 200,
								contentType: "text/plain",
								headers: { "access-control-allow-origin": "*" },
								body: searchFiles[name]
							});
							return;
						}
						void request.respond({
							status: 200,
							contentType: "text/plain",
							headers: { "access-control-allow-origin": "*" },
							body: fileIoFixture
								? url.pathname.endsWith("/input.txt")
									? fileIoInput
									: fileIoSource
								: "print('course source marker')\n"
						});
					}
					else if (
						url.origin !== origin
						|| url.pathname.startsWith("/api/")
					) {
						if (
							request.method() !== "GET"
							&& request.method() !== "OPTIONS"
						) {
							remoteWrites++;
							remoteWriteDestinations.push(`${request.method()} ${url.origin}${url.pathname}`);
						}
						// All APIs and external services are fixtures, never production requests.
						let body = {};
						if (
							courseFixture
							&& url.pathname === "/api/accounts/me"
						) {
							body = { userID: "course-fixture" };
						}
						else if (
							courseFixture
							&& url.pathname === "/api/users/loggedin"
						) {
							body = {
								currentUser: {
									_id: "course-fixture",
									name: "Course fixture",
									email: "course@example.invalid",
									courseAccess: ["python-level-3"],
									courseProgress: []
								}
							};
						}
						void request.respond({
							status: 200,
							contentType: "application/json",
							body: JSON.stringify(body)
						});
					}
					else {
						void request.continue();
					}
				});
				for (const width of [390, 1280]) {
					await page.setViewport({ width, height: 900 });
					const before = sourceRequests;
					const params = new URLSearchParams({
						mode: "python",
						projectKey: `browser:${width}:starter`,
						starterUrl:
							"https://github.com/example/course/tree/main/starter",
						starterTitle: "Course import fixture"
					});
					await page.goto(`${origin}/ide?${params}`, {
						waitUntil: "domcontentloaded"
					});
					await page.waitForSelector(
						"[data-testid='ide-route-import-confirm']"
					);
					assert.equal(
						sourceRequests,
						before,
						"No source download before confirmation"
					);
					await confirmProjectImport(page);
					await page.waitForSelector(
						"[data-testid='ide-route-import-error']"
					);
					assert.match(
						await page.$eval(
							"[data-testid='ide-route-import-error']",
							element => element.textContent
						),
						/GitHub returned 503/
					);
					assert.equal(
						await page.$(".code-ide-workspace"),
						null,
						"No replacement demo after a failed import"
					);
					assert.equal(
						await page.evaluate(
							() =>
								document.documentElement.scrollWidth
								<= innerWidth
						),
						true
					);
					await page.addScriptTag({ path: axeSource });
					assert.deepEqual(
						(await runAxeInPage(page)).violations,
						[],
						`Import error accessibility at ${width}px`
					);
					if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
						const directory = join(
							previousDirectory,
							process.env.COURSE_IMPORT_SCREENSHOT_DIR
						);
						await mkdir(directory, { recursive: true });
						await page.screenshot({
							path: join(
								directory,
								`course-import-error-${width}.png`
							),
							fullPage: true
						});
					}
				}
				failDownload = false;
				await confirmProjectImport(page);
				await page.waitForSelector(".code-ide-workspace .cm-content");
				await page.waitForFunction(() =>
					document
						.querySelector(".cm-content")
						?.textContent
						.includes("course source marker")
				);
				assert.equal(
					await page.$("[data-testid='ide-route-import-prompt']"),
					null
				);
				assert.equal(remoteWrites, 0, "Anonymous imports remain local");
				assert.equal(
					sourceRequests,
					4,
					"Two failed downloads plus one complete retry"
				);
				courseFixture = true;
				for (const width of [390, 1280]) {
					await page.setViewport({ width, height: 900 });
					await page.goto(
						`${origin}/courses#python-level-3-am6-introduction-to-algorithms-runtime-analysis`,
						{ waitUntil: "domcontentloaded" }
					);
					const worksheetSelector
						= "a[href*='AM6-Big-O-Analysis/starter']";
					const analysisSelector
						= "a[href*='AM6-Function-Analysis/starter']";
					await page.waitForSelector(worksheetSelector);
					await page.waitForSelector(analysisSelector);
					assert.match(
						await page.$eval(
							worksheetSelector,
							link => link.textContent
						),
						/Worksheet/
					);
					assert.equal(
						await page.$eval(worksheetSelector, (link) => {
							return [
								...link
									.closest(".lesson-item")
									.querySelectorAll("button")
							].some(button =>
								/Preview starter code/.test(button.textContent)
							);
						}),
						false,
						"A worksheet does not offer a code preview"
					);
					assert.equal(
						await page.$eval(
							worksheetSelector,
							link =>
								link
									.closest(".lesson-item")
									.querySelectorAll(".is-ide-starter")
									.length
						),
						0,
						"The mathematical worksheet keeps its readable source link without an IDE shortcut"
					);
					const analysisHref = await page.$eval(
						analysisSelector,
						link =>
							link
								.closest(".lesson-item")
								.querySelector(".is-ide-starter")
								.getAttribute("href")
					);
					const query = new URL(analysisHref, origin).searchParams;
					assert.equal(query.get("mode"), "python");
					assert.equal(
						query.get("starterUrl"),
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Function-Analysis/starter"
					);
					assert.equal(
						sourceRequests,
						4,
						"Reading course instructions does not download code"
					);
					if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
						const directory = join(
							previousDirectory,
							process.env.COURSE_IMPORT_SCREENSHOT_DIR
						);
						for (const [role, selector] of [
							["worksheet", worksheetSelector],
							["analysis", analysisSelector]
						]) {
							const link = await page.$(selector);
							const card = await link.evaluateHandle(element =>
								element.closest(".lesson-item")
							);
							await card.asElement().screenshot({
								path: join(
									directory,
									`course-import-${role}-${width}.png`
								)
							});
							await card.dispose();
							await link.dispose();
						}
					}
					await page.goto(new URL(analysisHref, origin).href, {
						waitUntil: "domcontentloaded"
					});
					await page.waitForSelector(
						"[data-testid='ide-route-import-confirm']"
					);
					assert.equal(
						sourceRequests,
						4,
						"Supplied-code analysis still requires confirmation before downloading"
					);
				}
				assert.equal(
					remoteWrites,
					0,
					"Resource inspection never writes to production"
				);

				// Real Python execution: release page-level interception only after
				// importing controlled source. CDP still blocks APIs and production
				// hosts; worker runtime imports otherwise stall under interception.
				courseFixture = false;
				fileIoFixture = true;
				const fileParams = new URLSearchParams({
					mode: "python",
					projectKey: "browser:file-io:starter",
					starterUrl:
						"https://github.com/example/course/tree/main/starter",
					starterTitle: "File workflow fixture"
				});
				await page.goto(`${origin}/ide?${fileParams}`, {
					waitUntil: "domcontentloaded"
				});
				await page.waitForSelector(
					"[data-testid='ide-route-import-confirm']"
				);
				assert.equal(
					sourceRequests,
					4,
					"File source also waits for confirmation"
				);
				await confirmProjectImport(page);
				await page.waitForFunction(() =>
					document
						.querySelector(".cm-content")
						?.textContent
						.includes("COURSE_FILE_IO_PASS")
				);
				await openProjectSidebar(page);
				await page.waitForFunction(() =>
					[...document.querySelectorAll(".file-button")].some(
						button => button.textContent.includes("input.txt")
					)
				);
				assert.equal(
					sourceRequests,
					7,
					"One directory plus two exact source files"
				);
				const cdp = await page.createCDPSession();
				try {
					await cdp.send("Network.enable");
					await cdp.send("Network.setBlockedURLs", {
						urls: [
							productionAnalyticsPattern,
							`${origin}/api/*`,
							"*://classes.jacobdanderson.net/*",
							"*://scheduler.classes.jacobdanderson.net/*",
							"*://api.github.com/*",
							"*://raw.githubusercontent.com/*"
						]
					});
					await page.setRequestInterception(false);
					await page.waitForSelector(
						"button.run-control:not([disabled])"
					);
					assert.equal(
						await page.$eval(
							"[data-testid='ide-run-status']",
							element => element.getAttribute("role")
						),
						"status",
						"Run results remain a live status in the compact workspace"
					);
					await page.click("button.run-control");
					await page.waitForFunction(
						() =>
							document
								.querySelector(".output-panel")
								?.textContent
								.includes("COURSE_FILE_IO_PASS")
								&& document
									.querySelector("[data-testid='ide-run-status']")
									?.textContent
									.includes("Run complete"),
						{ timeout: 90000 }
					);
					await page.waitForFunction(
						(expected) => {
							const projects = JSON.parse(
								localStorage.getItem(
									"classes-python-ide-projects:anonymous"
								) ?? "[]"
							);
							return projects.some(project =>
								project.files.some(
									file =>
										file.name === "output.txt"
										&& file.content === expected
								)
							);
						},
						{},
						fileIoOutput
					);
					const clickFile = async (name) => {
						const index = await page.$$eval(
							".file-button",
							(buttons, name) =>
								buttons.findIndex(
									button =>
										button.querySelector("span")
											?.textContent === name
								),
							name
						);
						assert.ok(
							index >= 0,
							`Project file ${name} is available`
						);
						const buttons = await page.$$(".file-button");
						await buttons[index].click();
						for (const button of buttons) await button.dispose();
					};
					await clickFile("output.txt");
					await page.waitForFunction(
						() =>
							document.querySelector(
								".file-button.is-active span"
							)?.textContent === "output.txt"
					);
					assert.deepEqual(
						await page.$$eval(".cm-content .cm-line", lines =>
							lines.map(line => line.textContent)),
						fileIoOutput.split("\n"),
						"Generated output reopens in the editor with its space and final newline"
					);
					if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
						const directory = join(
							previousDirectory,
							process.env.COURSE_IMPORT_SCREENSHOT_DIR
						);
						await mkdir(directory, { recursive: true });
						await page.screenshot({
							path: join(
								directory,
								"course-import-file-io-1280.png"
							),
							fullPage: true
						});
					}
					// Capture the actual ZIP triggered by the UI, not a reconstruction
					// from localStorage or a direct call to the archive helper.
					await page.evaluate(() => {
						const originalClick = HTMLAnchorElement.prototype.click;
						HTMLAnchorElement.prototype.click = function () {
							if (
								this.download.endsWith(".zip")
								&& this.href.startsWith("blob:")
							) {
								void fetch(this.href)
									.then(response => response.arrayBuffer())
									.then((bytes) => {
										window.__courseDownloadedZip
											= Array.from(new Uint8Array(bytes));
									});
								return;
							}
							return originalClick.call(this);
						};
					});
					await downloadProjectZip(page);
					await page.waitForFunction(() =>
						Array.isArray(window.__courseDownloadedZip)
					);
					const zip = unzipSync(
						Uint8Array.from(
							await page.evaluate(
								() => window.__courseDownloadedZip
							)
						)
					);
					const archivedFile = (name) => {
						const key = Object.keys(zip).find(path =>
							path.endsWith(`/${name}`)
						);
						assert.ok(key, `Export contains ${name}`);
						return strFromU8(zip[key]);
					};
					assert.equal(archivedFile("main.py"), fileIoSource);
					assert.equal(
						archivedFile("input.txt"),
						fileIoInput,
						"Original input bytes survive execution/export"
					);
					assert.equal(
						archivedFile("output.txt"),
						fileIoOutput,
						"Export retains generated file bytes"
					);
					console.log(
						"Real Python input, generated output, and exported ZIP bytes verified"
					);
					await page.reload({ waitUntil: "domcontentloaded" });
					await openProjectSidebar(page);
					await page.waitForSelector(".file-button");
					await clickFile("output.txt");
					await page.waitForFunction(
						() =>
							document.querySelector(
								".file-button.is-active span"
							)?.textContent === "output.txt"
					);
					assert.deepEqual(
						await page.$$eval(".cm-content .cm-line", lines =>
							lines.map(line => line.textContent)),
						fileIoOutput.split("\n"),
						"Generated file persists after reopening the workspace"
					);
					assert.equal(
						sourceRequests,
						7,
						"Reopening saved work does not redownload the starter"
					);
					assert.equal(
						await page.$("[data-testid='ide-route-import-prompt']"),
						null
					);
					assert.equal(
						remoteWrites,
						0,
						"File execution and export remain local"
					);
				}
				finally {
					await cdp.send("Network.setBlockedURLs", { urls: [productionAnalyticsPattern] });
					await cdp.detach();
				}

				// Exercise actual published incomplete starters, not reference answers.
				// The browser receives frozen checked bytes through controlled reads;
				// no download is initiated by the learner workflow before confirmation.
				for (const pack of searchPacks) {
					searchFiles = await readPublishedStarter(pack);
					searchPack = pack;
					fileIoFixture = false;
					const before = sourceRequests;
					await page.setRequestInterception(true);
					const params = new URLSearchParams({
						mode: "python",
						projectKey: `browser:${pack.folder}:starter`,
						starterUrl: `https://github.com/instruction-material/Python-Level-3/tree/main/${pack.folder}/starter`,
						starterTitle: pack.folder
					});
					await page.goto(`${origin}/ide?${params}`, {
						waitUntil: "domcontentloaded"
					});
					await page.waitForSelector(
						"[data-testid='ide-route-import-confirm']"
					);
					assert.equal(
						sourceRequests,
						before,
						`${pack.folder} waits for confirmation`
					);
					await confirmProjectImport(page);
					await page.waitForFunction(() =>
						document
							.querySelector(".cm-content")
							?.textContent
							.includes("NotImplementedError")
					);
					await openProjectSidebar(page);
					await page.waitForFunction(() =>
						[...document.querySelectorAll(".file-button")].some(
							button => button.textContent.includes("README.md")
						)
					);
					assert.equal(
						sourceRequests,
						before + 1 + Object.keys(searchFiles).length,
						"Exactly one directory and every learner file"
					);
					await page.waitForFunction(
						({ projectKey, fileCount }) =>
							JSON.parse(
								localStorage.getItem(
									"classes-python-ide-projects:anonymous"
								) ?? "[]"
							).some(
								project =>
									project.courseProjectKey === projectKey
									&& project.files.length === fileCount
							),
						{},
						{
							projectKey: `browser:${pack.folder}:starter`,
							fileCount: Object.keys(searchFiles).length
						}
					);
					const savedFiles = await page.evaluate((projectKey) => {
						const projects = JSON.parse(
							localStorage.getItem(
								"classes-python-ide-projects:anonymous"
							) ?? "[]"
						);
						return projects.find(
							project => project.courseProjectKey === projectKey
						)?.files;
					}, `browser:${pack.folder}:starter`);
					assert.ok(
						savedFiles,
						"Imported starter saved under its distinct project key"
					);
					assert.deepEqual(
						savedFiles.map(file => file.name).sort(),
						Object.keys(searchFiles).sort()
					);
					for (const file of savedFiles) {
						assert.equal(
							file.content,
							searchFiles[file.name],
							"Imported exact published incomplete bytes"
						);
					}
					const runtimeCdp = await page.createCDPSession();
					try {
						await runtimeCdp.send("Network.enable");
						await runtimeCdp.send("Network.setBlockedURLs", {
							urls: [
								productionAnalyticsPattern,
								`${origin}/api/*`,
								"*://classes.jacobdanderson.net/*",
								"*://scheduler.classes.jacobdanderson.net/*",
								"*://api.github.com/*",
								"*://raw.githubusercontent.com/*"
							]
						});
						await page.setRequestInterception(false);
						await page.waitForSelector(
							"button.run-control:not([disabled])"
						);
						await page.click("button.run-control");
						await page.waitForFunction(
							reminder =>
								document
									.querySelector(".output-panel")
									?.textContent
									.includes(reminder)
									&& document
										.querySelector(
											"[data-testid='ide-run-status']"
										)
										?.textContent
										.includes("Run complete"),
							{ timeout: 90000 },
							pack.reminder
						);
						assert.doesNotMatch(
							await page.$eval(
								".output-panel",
								element => element.textContent
							),
							/Traceback|EOFError|NotImplementedError/,
							"Initial Run only prints the learner reminder"
						);
						if (pack.folder === "AM12-Crazy-Name-Tags-Printer") {
							await exerciseNameTags(page, searchFiles);
						}
						if (pack.folder.startsWith("AM13-")) {
							await exerciseConway(page, pack, searchFiles);
						}
						if (pack.folder.startsWith("AM14-")) {
							await exerciseTicTacToe(page, pack, searchFiles);
						}
						if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
							const directory = join(
								previousDirectory,
								process.env.COURSE_IMPORT_SCREENSHOT_DIR
							);
							await mkdir(directory, { recursive: true });
							await page.screenshot({
								path: join(
									directory,
									`course-import-${pack.folder}-1280.png`
								),
								fullPage: true
							});
						}
						await page.reload({ waitUntil: "domcontentloaded" });
						await openProjectSidebar(page);
						await page.waitForSelector(".file-button");
						assert.equal(
							await page.$(
								"[data-testid='ide-route-import-confirm']"
							),
							null,
							"Saved starter reopens without replacement"
						);
						assert.equal(
							sourceRequests,
							before + 1 + Object.keys(searchFiles).length,
							"Reopening never redownloads the starter"
						);
						console.log(
							`Exact published learner source imported, run and reopened: ${pack.folder}@${pack.revision ?? searchSourceRevision}`
						);
					}
					finally {
						await runtimeCdp.send("Network.setBlockedURLs", {
							urls: [productionAnalyticsPattern]
						});
						await runtimeCdp.detach();
					}
				}
				assert.equal(
					remoteWrites,
					0,
					`All imported starter work remains local; unexpected destinations: ${JSON.stringify(remoteWriteDestinations)}`
				);
			}
			finally {
				await page.close();
			}
		}
		finally {
			if (browser) await browser.close();
			if (server) await server.close();
			process.chdir(previousDirectory);
			console.log(
				JSON.stringify({
					event: "cleanup",
					taskId,
					pid: process.pid,
					startedAt,
					endedAt: new Date().toISOString()
				})
			);
		}
	}
);
