import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
import { openProjectSidebar } from "./ide-workspace-controls.mjs";

const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-composing-methods-sources.json", import.meta.url),
		"utf8"
	)
);
const moduleID = "design-patterns-in-java-part-2-dpr2-composing-methods";
const readingID = "design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-composing-methods-core-concepts";
const coreID = "design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-core-project-composing-methods";
const continuationIDs = ["design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-composing-methods-core-concepts", "design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-composing-methods-application-check", "design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-extraction-semantic-preservation-contract", "design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-understanding-check-composing-methods", "design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-composing-methods-extension-practice"];
const probeName = "src/reports/experiment/Probe.java";
const probeContent
	= "package reports.experiment;\npublic final class Probe {\n    public static void main(String[] args) { System.out.println(\"Saved refactor probe\"); }\n}\n";
for (const role of ["starter", "solution"]) {
	test(
		`Java composing methods ${
			role
		} consent, added package source, checkpoints and saved continuations`,
		{ timeout: 180000 },
		async (t) => {
			await runAssemblyCoreCourseWorkflow(t, {
				pack: "DPR2-Composing-Methods-Packs",
				coreID,
				moduleID,
				courseID: "design-patterns-in-java-part-2",
				mode: "java",
				sourceRepository: "Java-Level-3",
				fixturePath: "./fixtures/java-composing-methods-sources.json",
				roles: [role],
				continuationIDs,
				sourceUrl: selected =>
					`https://github.com/${
						fixture.repository
					}/tree/${
						fixture.revision
					}/DPR2-Composing-Methods-Packs/${
						selected}`,
				projectKey: selected =>
					[
						"design-patterns-in-java-part-2",
						selected === "starter" ? coreID : readingID,
						selected === "starter" ? "starter" : "reference",
						"native-java-composing"
					].join(":"),
				previousProject: selected => ({
					_id: `earlier-refactoring-${selected}`,
					title: "Earlier refactoring attempt",
					mode: "java",
					files: [
						{ name: "Main.java", content: "// Earlier source\n" }
					],
					activeFileName: "Main.java",
					courseID: "design-patterns-in-java-part-2",
					courseProjectKey: [
						"design-patterns-in-java-part-2",
						coreID,
						selected === "starter" ? "starter" : "reference"
					].join(":"),
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				nativeInstructions: true,
				flatFiles: true,
				sharedFiles: [],
				editFiles: [
					"src/reports/ComposedReport.java",
					"DECISIONS.md",
					"CHECKPOINTS.md",
					"README.md",
					"sources.txt"
				],
				primaryFile: "Main.java",
				taskFile: "README.md",
				initialFile: "Main.java",
				fileCount: 10,
				expectedFile: (selected, name) =>
					fixture.files[
						`DPR2-Composing-Methods-Packs/${selected}/${name}`
					],
				editContent: ({ original, filename, width }) =>
					filename === "sources.txt"
						? `${original}\n${probeName}\n`
						: original
							+ (filename.endsWith(".java")
								? `\n// Saved composing trace ${width}\n`
								: `\nSaved composing trace ${width}\n`),
				afterEdit: async (page, { width, edits, readProject }) => {
					await openProjectSidebar(page);
					const toggle
						= "button[aria-label='Add or import project files']";
					if (
						(await page.$eval(toggle, button =>
							button.getAttribute("aria-expanded"))) !== "true"
					) {
						await page.locator(toggle).click();
					}
					const input = "input[aria-label='New project file name']";
					await page.waitForSelector(input, { visible: true });
					await page.locator(input).fill(probeName);
					await page.keyboard.press("Enter");
					await page.waitForFunction(
						name =>
							document.querySelector(
								"select[aria-label='Active project file']"
							)?.value === name,
						{},
						probeName
					);
					await page
						.locator(
							"button[aria-label='Collapse project sidebar']"
						)
						.click();
					if (width < 900) {
						await page
							.locator(
								".mobile-view-picker button[data-view='code']"
							)
							.click();
					}
					await page.waitForSelector(".cm-content", {
						visible: true
					});
					await page.focus(".cm-content");
					const modifier = await page.evaluate(() =>
						/Mac/.test(navigator.platform) ? "Meta" : "Control"
					);
					await page.keyboard.down(modifier);
					await page.keyboard.press("a");
					await page.keyboard.up(modifier);
					await page.keyboard.sendCharacter(probeContent);
					await page.keyboard.down(modifier);
					await page.keyboard.press("s");
					await page.keyboard.up(modifier);
					edits[probeName] = probeContent;
					const saved = await readProject(
						project =>
							project.files.find(file => file.name === probeName)
								?.content === probeContent
					);
					assert.ok(
						saved.files
							.find(file => file.name === "sources.txt")
							.content.includes(probeName)
					);
					return {
						newNestedJavaFileCreatedViaUI: true,
						sourceManifestEditedInUI: true
					};
				},
				verifyRun: async (page) => {
					await page
						.locator("button.run-control:not([disabled])")
						.click();
					await page.waitForFunction(() =>
						document
							.querySelector(".output-panel")
							?.textContent
							.includes(
								"java -cp classes ContractTests core"
							)
					);
					assert.equal(
						await page.$eval("button.run-control", button =>
							button.textContent.trim()),
						"Run"
					);
					assert.equal(await page.$(".stdin-panel"), null);
				},
				outputEnv: "JAVA_COMPOSING_BROWSER_PROOF_DIR",
				defaultOutput: "output/java-composing-methods",
				outputSubdirectory: "reports",
				kind: `composing-${role}`,
				afterImport: async () => ({
					fullContractAcceptance: "native-JDK21-exported-source",
					browserPreviewChecked: false,
					runnableStarterBaseline: true
				})
			});
		}
	);
}
