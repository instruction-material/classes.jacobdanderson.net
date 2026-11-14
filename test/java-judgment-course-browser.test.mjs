import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-judgment-sources.json", import.meta.url),
		"utf8"
	)
);
const moduleID =
	"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment";
const coreID = `${
	moduleID
}-curriculum-core-project-pattern-selection-and-refactoring-judgment`;
const readingID = `${
	moduleID
}-curriculum-pattern-selection-and-refactoring-judgment-core-concepts`;
const previewID = `${
	moduleID
}-curriculum-refactoring-preview-pattern-selection-requires-safe-change`;
const extensionID = `${
	moduleID
}-supplemental-pattern-selection-and-refactoring-judgment-extension-practice`;
test(
	"Java refactoring judgment actual consent, package tree, saved source and ZIPs",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ9-Checkout-Judgment-Packs",
			coreID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			fixturePath: "./fixtures/java-judgment-sources.json",
			continuationsByRole: {
				starter: [previewID, extensionID],
				solution: [readingID, previewID, extensionID]
			},
			sourceUrl: role =>
				`https://github.com/${fixture.repository}/tree/${
					fixture.revision
				}/DPJ9-Checkout-Judgment-Packs/${role}`,
			projectKey: role =>
				`design-patterns-in-java:${
					role === "starter" ? coreID : readingID
				}:${
					role === "starter" ? "starter" : "reference"
				}:native-java-judgment`,
			previousProject: role => ({
				_id: `earlier-creational-${role}`,
				title: "Earlier creational work",
				mode: "java",
				files: [
					{
						name: "Main.java",
						content: "// Earlier foundation attempt\n"
					}
				],
				activeFileName: "Main.java",
				courseID: "design-patterns-in-java",
				courseProjectKey: `design-patterns-in-java:${coreID}:${
					role === "starter" ? "starter" : "reference"
				}`,
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			nativeInstructions: true,
			flatFiles: true,
			sharedFiles: [],
			editFiles: [
				"src/checkout/Checkout.java",
				"DECISIONS.md",
				"README.md"
			],
			primaryFile: "Main.java",
			taskFile: "README.md",
			initialFile: "Main.java",
			fileCount: 9,
			expectedFile: (role, name) =>
				fixture.files[`DPJ9-Checkout-Judgment-Packs/${role}/${name}`],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? `\n// Saved judgment trace ${width}\n`
					: `\nSaved judgment trace ${width}\n`),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"java -cp classes ContractTests base"
						)
				);
				assert.equal(
					await page.$eval("button.run-control", button =>
						button.textContent.trim()
					),
					"Run"
				);
				assert.equal(await page.$(".stdin-panel"), null);
			},
			outputEnv: "JAVA_JUDGMENT_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-judgment",
			outputSubdirectory: "checkout",
			kind: "judgment",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false
			})
		});
	}
);

test(
	"Java refactoring judgment public worked-code action, consent and exports",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ9-Judgment-Worked-Example",
			coreID: readingID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			roles: ["starter"],
			continuationIDs: [],
			fixturePath: "./fixtures/java-judgment-sources.json",
			sourceUrl: () =>
				`https://github.com/${fixture.repository}/tree/${
					fixture.revision
				}/DPJ9-Judgment-Worked-Example`,
			projectKey: () =>
				`design-patterns-in-java:${
					readingID
				}:starter:native-java-judgment`,
			previousProject: () => ({
				_id: "earlier-creational-worked",
				title: "Earlier worked example",
				mode: "java",
				files: [
					{
						name: "Main.java",
						content: "// Earlier worked example\n"
					}
				],
				activeFileName: "Main.java",
				courseID: "design-patterns-in-java",
				courseProjectKey: `design-patterns-in-java:${readingID}:starter`,
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			nativeInstructions: true,
			flatFiles: true,
			sharedFiles: ["Main.java", "ContractTests.java", "README.md"],
			primaryFile: "Main.java",
			taskFile: "README.md",
			initialFile: "Main.java",
			fileCount: 3,
			expectedFile: (_role, name) =>
				fixture.files[`DPJ9-Judgment-Worked-Example/${name}`],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? `\n// Saved judgment trace ${width}\n`
					: `\nSaved judgment trace ${width}\n`),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"Judgment worked contracts: 49 passed"
						)
				);
				assert.equal(
					await page.$eval("button.run-control", button =>
						button.textContent.trim()
					),
					"Run"
				);
				assert.equal(await page.$(".stdin-panel"), null);
			},
			outputEnv: "JAVA_JUDGMENT_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-judgment",
			outputSubdirectory: "worked-example",
			kind: "judgment-example",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false,
				workedExample: true
			})
		});
	}
);
