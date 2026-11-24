import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Exercises the real course and Python IDE in Chrome.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const fixturePath = "./fixtures/python-level-3-course-workflow-sources.json";
const fixture = JSON.parse(readFileSync(new URL(fixturePath, import.meta.url), "utf8"));
const courseID = "python-level-3";
const marker = "Verified Python Level 3 edit";
const sha256 = data => createHash("sha256").update(data).digest("hex");

async function observeRun(page, expected) {
	await page.locator("button.run-control:not([disabled])").click();
	const result = await page.waitForFunction((tokens) => {
		const status = document.querySelector("[data-testid='ide-run-status']")?.textContent.trim();
		if (!["Run complete", "Run failed", "Run finished with issues"].includes(status)) {
			return false;
		}
		const output = [...document.querySelectorAll(".output-line--stdout")]
			.map(line => line.textContent)
			.join("\n");
		// A second click can briefly see the previous run while saving the edit.
		if (status === "Run complete" && !tokens.every(token => output.includes(token))) {
			return false;
		}
		return {
			status,
			output,
			errors: [...document.querySelectorAll(".output-line--stderr")].map(line => line.textContent).join("\n")
		};
	}, { timeout: 90000 }, expected).catch(async (error) => {
		const observed = await page.$$eval(".output-line", lines =>
			lines.map(line => line.textContent).join("\n")
		);
		throw new Error(`Expected Python output ${JSON.stringify(expected)}. Observed:\n${observed}`, { cause: error });
	});
	const run = await result.jsonValue();
	await result.dispose();
	assert.equal(run.status, "Run complete", JSON.stringify(run));
	assert.equal(run.errors, "");
	for (const token of expected) assert.ok(run.output.includes(token), token);
	return run.output;
}

for (const exercise of fixture.exercises) {
	const { pack, moduleId, itemId, expected, generatedOutput } = exercise;
	test(`Python Level 3 ${pack}: consent, run, save and export`, { timeout: 360000 }, async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: pack.toLowerCase(),
			courseID,
			moduleID: moduleId,
			coreID: itemId,
			pack,
			fixturePath,
			mode: "python",
			sourceRepository: fixture.repository,
			sameTab: true,
			githubDirectory: true,
			allowPythonRuntime: true,
			flatFiles: true,
			sharedFiles: [],
			primaryFile: "main.py",
			fileCount: role => Object.keys(fixture.files).filter(path => path.startsWith(`${pack}/${role}/`)).length,
			expectedFile: (role, name) => fixture.files[`${pack}/${role}/${name}`],
			editFiles: ["main.py"],
			editContent: ({ original }) => `${original.trimEnd()}\n\nprint(${JSON.stringify(marker)})\n`,
			continuationIDs: [itemId],
			projectKey: role => `${courseID}:${itemId}:${role === "starter" ? "starter" : "reference"}`,
			previousProject: () => ({
				_id: "earlier-python-level-3-project",
				title: "Earlier work",
				mode: "python",
				files: [{ name: "main.py", content: "print('Earlier work')\n" }],
				activeFileName: "main.py",
				courseID,
				courseProjectKey: `${courseID}:earlier-python-level-3-project:starter`,
				createdAt: "2026-11-01T12:00:00.000Z",
				updatedAt: "2026-11-01T12:00:00.000Z"
			}),
			verifyRun: (page, { role }) => observeRun(page, expected[role]),
			afterEdit: async (page, { role, readProject }) => {
				const output = await observeRun(page, [...expected[role], marker]);
				if (!generatedOutput || role !== "solution") return { output };
				const saved = await readProject(project => project.files.some(file =>
					file.name === generatedOutput.name && sha256(file.content) === generatedOutput.sha256
				));
				const unchangedInput = saved.files.find(file => file.name === "input_no_punctuation.txt");
				assert.equal(sha256(unchangedInput?.content), fixture.files[`${pack}/solution/input_no_punctuation.txt`].sha256);
				return { output, generatedOutput };
			},
			outputEnv: "PYTHON_LEVEL_3_BROWSER_PROOF_DIR",
			outputSubdirectory: pack,
			defaultOutput: "output/python-level-3-browser"
		});
	});
}
