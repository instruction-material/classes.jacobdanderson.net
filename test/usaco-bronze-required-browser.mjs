import assert from "node:assert/strict";
import {
	bronzeChangedCases,
	bronzePackForFixture,
	completedBronzeLearner
} from "./usaco-bronze-required-native.mjs";
import { openProjectSidebar } from "./ide-workspace-controls.mjs";

async function openCodeView(page) {
	await page.waitForSelector("button.run-control:not([disabled])");
	if (
		await page.evaluate(
			() => window.matchMedia("(max-width: 900px)").matches
		)
	)
		await page
			.locator(".mobile-view-picker button[data-view='code']")
			.click();
	await page.waitForSelector(".cm-content", { visible: true });
}

async function editFile(page, key, name, content) {
	await openCodeView(page);
	await page.select("select[aria-label='Active project file']", name);
	await page.click(".cm-content");
	const modifier = await page.evaluate(() =>
		/Mac/.test(navigator.platform) ? "Meta" : "Control"
	);
	await page.keyboard.down(modifier);
	await page.keyboard.press("a");
	await page.keyboard.up(modifier);
	await page.keyboard.sendCharacter(content);
	await page.keyboard.down(modifier);
	await page.keyboard.press("s");
	await page.keyboard.up(modifier);
	await page.waitForFunction(
		(key, name, content) =>
			JSON.parse(
				localStorage.getItem("classes-python-ide-projects:anonymous") ??
					"[]"
			).some(
				project =>
					project.courseProjectKey === key &&
					project.files.some(
						file => file.name === name && file.content === content
					)
			),
		{},
		key,
		name,
		content
	);
}

async function runFileIo(page, origin) {
	await page.waitForSelector("button.run-control:not([disabled])");
	const network = await page.createCDPSession();
	try {
		await network.send("Network.enable");
		await network.send("Network.setBlockedURLs", {
			urls: [
				`${origin}/api/*`,
				"*://*.jacobdanderson.net/*",
				"*://cs.avasan.org/*",
				"*://api.github.com/*",
				"*://raw.githubusercontent.com/*"
			]
		});
		// Allow the real worker to load while retaining service request blocks.
		await page.setRequestInterception(false);
		await page.$eval("[data-testid='ide-run-status']", element => {
			element.dataset.bronzeStarted = "false";
			const observer = new MutationObserver(() => {
				if (element.textContent.trim() === "Starting Python") {
					element.dataset.bronzeStarted = "true";
					observer.disconnect();
				}
			});
			observer.observe(element, {
				childList: true,
				characterData: true,
				subtree: true
			});
		});
		await page.click("button.run-control");
		await page.waitForFunction(
			() => {
				const status = document.querySelector(
					"[data-testid='ide-run-status']"
				);
				return (
					status?.dataset.bronzeStarted === "true" &&
					/Run complete|Run failed/.test(status.textContent ?? "")
				);
			},
			{ timeout: 120000 }
		);
		return await page.evaluate(() => ({
			status: document
				.querySelector("[data-testid='ide-run-status']")
				?.textContent.trim(),
			stderr: [...document.querySelectorAll(".output-line--stderr")]
				.map(element => element.textContent)
				.join("\n"),
			stdout: [...document.querySelectorAll(".output-line--stdout")]
				.map(element => element.textContent)
				.join("\n")
		}));
	} finally {
		await page.setRequestInterception(true);
		await network.send("Network.setBlockedURLs", { urls: [] });
		await network.detach();
	}
}

export async function verifyBronzePythonBrowser({
	page,
	origin,
	fixture,
	files,
	expectedFiles,
	key,
	referenceSource,
	directory,
	runNative,
	exportedFiles,
	record
}) {
	const pack = bronzePackForFixture(fixture);
	assert.equal(pack.mode, "python");
	assert.equal(
		await page.$(".stdin-panel"),
		null,
		"Named-file exercises must not invite unrelated standard input"
	);
	const guidance = await page.$eval(
		".file-io-guidance",
		element => element.textContent
	);
	assert.ok(guidance.includes(pack.input) && guidance.includes(pack.output));
	assert.match(guidance, /successful run/);
	const previous = "Earlier learner prediction and saved answer\n";
	if (!Object.hasOwn(files, pack.output)) {
		await openProjectSidebar(page);
		if (!(await page.$("input[aria-label='New project file name']")))
			await page.click(
				"button[aria-label='Add or import project files']"
			);
		await page.type(
			"input[aria-label='New project file name']",
			pack.output
		);
		await page.keyboard.press("Enter");
		await page.waitForFunction(
			name =>
				[
					...document.querySelectorAll(
						"select[aria-label='Active project file'] option"
					)
				].some(option => option.value === name),
			{},
			pack.output
		);
	}
	await editFile(page, key, pack.output, previous);
	expectedFiles[pack.output] = previous;
	let executions = 0;
	if (!fixture.reference) {
		await page.select(
			"select[aria-label='Active project file']",
			pack.mainFile
		);
		const result = await runFileIo(page, origin);
		executions++;
		assert.equal(result.status, "Run failed");
		assert.match(result.stderr, /NotImplementedError/);
		assert.equal(result.stdout, "");
		assert.deepEqual(
			await exportedFiles(page),
			expectedFiles,
			"Untouched work preserves the earlier answer and all source files"
		);
		const completed = await completedBronzeLearner(
			fixture,
			{ ...files, [pack.mainFile]: expectedFiles[pack.mainFile] },
			referenceSource,
			directory,
			runNative
		);
		await editFile(page, key, pack.mainFile, completed);
		expectedFiles[pack.mainFile] = completed;
	}
	for (const [input, answer] of [
		[pack.sampleInput, pack.sampleExpected],
		...bronzeChangedCases[pack.slug]
	]) {
		await editFile(page, key, pack.input, input);
		expectedFiles[pack.input] = input;
		await page.select(
			"select[aria-label='Active project file']",
			pack.mainFile
		);
		const result = await runFileIo(page, origin);
		executions++;
		assert.equal(result.status, "Run complete", result.stderr);
		assert.equal(result.stderr, "");
		assert.equal(
			result.stdout,
			"",
			"Answers belong in the named output file"
		);
		expectedFiles[pack.output] = answer;
		assert.deepEqual(
			await exportedFiles(page),
			expectedFiles,
			"Actual worker results and every user edit survive ZIP export"
		);
		await openCodeView(page);
		await page.select(
			"select[aria-label='Active project file']",
			pack.output
		);
		assert.equal(
			await page.$eval(".cm-content", element => element.textContent),
			answer.trimEnd()
		);
	}
	await editFile(page, key, pack.input, pack.sampleInput);
	expectedFiles[pack.input] = pack.sampleInput;
	await page.select(
		"select[aria-label='Active project file']",
		pack.mainFile
	);
	let result = await runFileIo(page, origin);
	executions++;
	assert.equal(result.status, "Run complete", result.stderr);
	expectedFiles[pack.output] = pack.sampleExpected;
	if (!fixture.reference) {
		const originalEdit =
			files[pack.mainFile] + "\n# Saved USACO browser attempt\n";
		await editFile(page, key, pack.mainFile, originalEdit);
		expectedFiles[pack.mainFile] = originalEdit;
		result = await runFileIo(page, origin);
		executions++;
		assert.equal(result.status, "Run failed");
		assert.match(result.stderr, /NotImplementedError/);
	}
	assert.deepEqual(
		await exportedFiles(page),
		expectedFiles,
		"A failed revision preserves the last successful result"
	);
	record("verified-bronze-python-worker", {
		itemId: fixture.itemId,
		key,
		pack: pack.slug,
		role: fixture.reference ? "reference" : "learner",
		executions,
		namedInput: pack.input,
		namedOutput: pack.output,
		samplesAndChangedCases: true,
		unfinishedPreservesEarlierAnswer: !fixture.reference,
		completedOnlyNamedTasks: !fixture.reference,
		zipRetainsGeneratedOutput: true
	});
}
