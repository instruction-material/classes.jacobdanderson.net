import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
import { openProjectSidebar } from "./ide-workspace-controls.mjs";

const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-value-data-sources.json", import.meta.url),
		"utf8"
	)
);
const moduleID = "design-patterns-in-java-part-2-dpr4-organizing-data";
const readingID = "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-organizing-data-core-concepts";
const coreID = "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-core-project-organizing-data";
const continuationIDs = ["design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-data-modeling-lab-upgrade-a-weak-domain-model", "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-value-semantics-and-collection-ownership", "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-data-migration-and-compatibility-check", "design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-organizing-data-transfer-practice", "design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-organizing-data-extension-practice"];
for (const role of ["starter", "solution"]) {
	const probeName = "src/supplies/experiment/Probe.java";
	const probeContent = "package supplies.experiment;\npublic final class Probe {\n    public static void main(String[] args) { System.out.println(\"Saved value-data probe\"); }\n}\n";

	test(
		`Java value data ${
			role
		} consent, added package source, checkpoints and saved continuations`,
		{ timeout: 180000 },
		async (t) => {
			await runAssemblyCoreCourseWorkflow(t, {
				pack: "DPR4-Value-Data-Packs",
				coreID,
				moduleID,
				courseID: "design-patterns-in-java-part-2",
				mode: "java",
				sourceRepository: "Java-Level-3",
				fixturePath: "./fixtures/java-value-data-sources.json",
				roles: [role],
				continuationIDs,
				sourceUrl: selected =>
					`https://github.com/${
						fixture.repository
					}/tree/${
						fixture.revision
					}/DPR4-Value-Data-Packs/${
						selected}`,
				projectKey: selected =>
					[
						"design-patterns-in-java-part-2",
						selected === "starter" ? coreID : readingID,
						selected === "starter" ? "starter" : "reference",
						"native-java-value-data"
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
				editFiles: ["src/supplies/ItemCode.java", "src/supplies/RequestLine.java", "src/supplies/SupplyRequest.java", "src/supplies/RequestCodec.java", "DECISIONS.md", "CHECKPOINTS.md", "README.md", "sources.txt"],
				primaryFile: "Main.java",
				taskFile: "README.md",
				initialFile: "Main.java",
				fileCount: 13,
				expectedFile: (selected, name) =>
					fixture.files[
						`DPR4-Value-Data-Packs/${selected}/${name}`
					],
				editContent: ({ original, filename, width }) => {
					if (filename === "sources.txt") return `${original}\n${probeName}\n`;
					let source = original;
					if (role === "starter" && ["src/supplies/ItemCode.java", "src/supplies/RequestLine.java", "src/supplies/SupplyRequest.java", "src/supplies/RequestCodec.java"].includes(filename)) {
						source = fixture.files[`DPR4-Value-Data-Packs/solution/${filename}`].content;
						if (filename.endsWith("/SupplyRequest.java")) {
							source = `${source.slice(0, source.indexOf("    public SupplyRequest merged() {"))
							}    public SupplyRequest merged() {\n        throw new UnsupportedOperationException("Implement optional merge.");\n    }\n}\n`;
						}
					}
					return source + (filename.endsWith(".java") ? `\n// Saved value-data trace ${width}\n` : `\nSaved value-data trace ${width}\n`);
				},
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
						coreValueSourcesEditedInUI: role === "starter",
						newProbeCreatedViaUI: true,
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
				outputEnv: "JAVA_VALUE_DATA_BROWSER_PROOF_DIR",
				defaultOutput: "output/java-value-data",
				outputSubdirectory: "supplies",
				kind: `value-data-${role}`,
				afterImport: async () => ({
					fullContractAcceptance: "native-JDK21-exported-source",
					browserPreviewChecked: false,
					runnableStarterBaseline: true,
					starterCoreWorkInitiallyIncomplete: role === "starter"
				})
			});
		}
	);
}
