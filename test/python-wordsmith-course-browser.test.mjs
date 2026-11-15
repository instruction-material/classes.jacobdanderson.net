import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Actual course import and execution.
import { test } from "node:test";
import { gunzipSync } from "node:zlib";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/python-wordsmith-sources.json", import.meta.url), "utf8"));
const dictionary = gunzipSync(readFileSync(new URL("./fixtures/wordsmith-valid-words.txt.gz", import.meta.url))).toString("utf8");
const sha = value => createHash("sha256").update(value).digest("hex");
const source = (role, name) => fixture.files[`${fixture.pack}/${role}/${name}`];
const completed = source("solution", "main.py").content;
const edited = completed
	.replace("return set(rng.sample(alphabet, 7))", "return set(\"aceinrt\")")
	.replace("return len(word)", "return len(word) * 2");
assert.notEqual(edited, completed);
async function execute(page, expectedScore) {
	const input = ".stdin-panel textarea";
	await page.waitForSelector(input);
	await page.$eval(input, (element, value) => {
		element.value = value;
		element.dispatchEvent(new Event("input", { bubbles: true }));
	}, expectedScore === 0 ? "\n:quit\n" : "\ncat\ncat\ncrate\n:quit\n");
	await page.locator("button.run-control:not([disabled])").click();
	await page.waitForFunction(score => document.querySelector(".output-panel")?.textContent.includes(`Final score: ${score}`), { timeout: 90000 }, expectedScore);
	const output = await page.$eval(".output-panel", element => element.textContent);
	assert.doesNotMatch(output, /Traceback|(?:Syntax|Runtime|Type|Name|Import)Error:/);
	if (expectedScore === 16) {
		assert.ok(output.includes("Valid word! Your score: 6"));
		assert.ok(output.includes("Rejected: already entered. Your score: 6"));
		assert.ok(output.includes("Accepted words: cat, crate"));
	}
	return output;
}
for (const classroom of [false, true]) {
	const courseID = classroom ? "python-level-2-classroom" : "python-level-2";
	const moduleID = classroom
		? "python-level-2-classroom-classroom-launch-build-extend-explain"
		: "python-level-2-ps13-wordsmith";
	const coreID = moduleID + (classroom
		? "-curriculum-launch-project-7-wordsmith-challenge"
		: "-curriculum-ps13-project-1-wordsmith");
	test(`${courseID} Wordsmith: complete dictionary, consent, saved edits, classroom hooks and ZIPs`, { timeout: 600000 }, async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: classroom ? "wordsmith-classroom" : "wordsmith",
			courseID,
			moduleID,
			coreID,
			previousProject: () => ({
				_id: "earlier-wordsmith-project",
				title: "Earlier work",
				mode: "python",
				files: [{ name: "main.py", content: "# earlier work\\n", encoding: "text" }],
				activeFileName: "main.py",
				courseID,
				courseProjectKey: `${courseID}:earlier-wordsmith:starter`,
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			mode: "python",
			sourceRepository: fixture.repository,
			fixturePath: "./fixtures/python-wordsmith-sources.json",
			roles: ["starter", "solution"],
			sourceRole: role => classroom ? "solution" : role,
			sourceUrl: role => `https://github.com/instruction-material/${fixture.repository}/tree/${fixture.revision}/${fixture.pack}/${classroom ? "solution" : role}`,
			prepareFixture: (data) => {
				for (const role of ["starter", "solution"]) {
					const file = data.files[`${fixture.pack}/${role}/valid_words.txt`];
					file.content = dictionary;
					assert.equal(Buffer.byteLength(dictionary), file.byteLength);
					assert.equal(sha(dictionary), file.sha256);
				}
			},
			sameTab: true,
			githubDirectory: true,
			allowPythonRuntime: true,
			flatFiles: true,
			sharedFiles: [],
			fileCount: 4,
			initialFile: "main.py",
			primaryFile: "main.py",
			expectedFile: (role, name) => source(classroom ? "solution" : role, name),
			editFiles: ["main.py"],
			editContent: () => edited,
			taskFile: "README.md",
			continuationIDs: [coreID],
			projectKey: role => `${courseID}:${coreID}:${classroom || role === "starter" ? "starter" : "reference"}`,
			afterImport: async (_page, { saved }) => {
				assert.equal(sha(saved.files.find(file => file.name === "valid_words.txt").content), "d4e5064c60c1a9ff68fe77d12d32b1ebc3bec50a7ce2bd077adb6dae900bb36f");
				return { completeOriginalDictionary: true, originalDictionaryBytes: 613188 };
			},
			verifyRun: async (page, { role }) => {
				if (classroom || role === "solution") await execute(page, 0);
			},
			afterEdit: async page => ({ output: await execute(page, 16), normalHookChangedActualScore: true }),
			instructionTokens: [],
			starterToken: "",
			referenceToken: "",
			readyToken: "",
			outputEnv: "PYTHON_WORDSMITH_BROWSER_DIR",
			outputSubdirectory: courseID,
			defaultOutput: "output/python-wordsmith-browser"
		});
	});
}
