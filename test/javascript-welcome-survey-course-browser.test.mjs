import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
import { openProjectSidebar } from "./ide-workspace-controls.mjs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-welcome-survey-source.json", import.meta.url), "utf8"));
const roleName = role => role === "starter" ? "starter" : "reference";
const courseID = fixture.courseId;
const moduleID = `${courseID}-jss1-variables-and-data-types`;
const coreID = `${moduleID}-curriculum-jss1-project-1-welcome-survey`;
for (const files of Object.values(fixture.files)) {
	for (const file of files) {
		const path = new URL(`../front-end/public/course-assets/javascript-level-1/${file.path}`, import.meta.url);
		const raw = readFileSync(path);
		assert.equal(raw.length, file.byteLength);
		assert.equal(createHash("sha256").update(raw).digest("hex"), file.sha256);
	}
}

test("JavaScript survey: course consent, both roles, saved source and offline-ready ZIPs", { timeout: 180000 }, async (t) => {
	await runAssemblyCoreCourseWorkflow(t, {
		kind: "javascript-welcome-survey",
		courseID,
		moduleID,
		coreID,
		mode: "web",
		fixturePath: "./fixtures/javascript-welcome-survey-source.json",
		sourceUrl: role => fixture.sourceURL[roleName(role)],
		localSource: {
			prefix: "/course-assets/javascript-level-1/",
			files: role => fixture.files[roleName(role)]
		},
		expectedFile: (role, name) => fixture.files[roleName(role)].find(file => file.name === name),
		flatFiles: true,
		fileCount: 6,
		initialFile: "index.html",
		primaryFile: "script.js",
		taskFile: "README.md",
		continuationIDs: [coreID],
		projectKey: role => `${courseID}:${coreID}:${roleName(role)}:welcome-survey:v${fixture.version}`,
		previousProject: role => ({
			_id: "earlier-javascript-attempt",
			title: "JSS1 Project 1: Welcome Survey",
			mode: "web",
			starterUrl: fixture.sourceURL[roleName(role)],
			files: [{ name: "script.js", content: "// earlier v1 work\n" }],
			activeFileName: "script.js",
			courseID,
			courseProjectKey: `${courseID}:${coreID}:${roleName(role)}:welcome-survey:v1`,
			createdAt: "2026-10-01T12:00:00.000Z",
			updatedAt: "2026-10-01T12:00:00.000Z"
		}),
		afterImport: async (page, { role, width, earlier, saved }) => {
			assert.equal(earlier.title, saved.title);
			const roleLabel = role === "starter" ? "Learner" : "Reference";
			const oldLabel = `${earlier.title} (${roleLabel} · Web · v1)`;
			const newLabel = `${saved.title} (${roleLabel} · Web · v${fixture.version})`;
			await openProjectSidebar(page);
			const labels = await page.$$eval(".project-button", buttons => buttons.map(button => button.getAttribute("aria-label")));
			assert.ok(labels.includes(oldLabel));
			assert.ok(labels.includes(newLabel));
			await page.locator(`.project-button[aria-label=${JSON.stringify(oldLabel)}]`).click();
			await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent?.includes("earlier v1 work"));
			await openProjectSidebar(page);
			await page.locator(`.project-button[aria-label=${JSON.stringify(newLabel)}]`).click();
			await page.waitForFunction(() => document.querySelector("select[aria-label='Active project file']")?.value === "index.html");
			if (width < 900) {
				const toggle = ".mobile-workspace-navigation button";
				if (await page.$eval(toggle, button => button.getAttribute("aria-expanded")) === "true") await page.locator(toggle).click();
			}
			return { projectLabels: labels, olderVersionOpenedWithoutImport: true, newVersionReopened: true };
		},
		instructionTokens: ["index.html", "vendor/d3.min.js", "without a server"],
		starterToken: "script.js",
		referenceToken: "script.js",
		readyToken: "Open index.html",
		outputEnv: "JAVASCRIPT_SURVEY_BROWSER_DIR",
		defaultOutput: "output/javascript-survey-browser"
	});
});
