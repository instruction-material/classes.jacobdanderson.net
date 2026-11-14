// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-collaboration-sources.json", import.meta.url),
		"utf8"
	)
);
const appendixIDs = [
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-add-observer-events-to-a-small-model",
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-implement-command-based-undo"
];
const itemModules = {
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-add-observer-events-to-a-small-model":
		"design-patterns-in-java-project-practice-guide",
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-implement-command-based-undo":
		"design-patterns-in-java-project-practice-guide"
};
const moduleID = "design-patterns-in-java-dpj7-behavioral-patterns-ii";
const coreID = moduleID + "-curriculum-core-project-behavioral-patterns-ii";
const readingID = moduleID + "-curriculum-behavioral-patterns-ii-core-concepts";
const blobID =
	moduleID + "-curriculum-behavioral-patterns-ii-application-check";
const extensionID =
	moduleID + "-supplemental-behavioral-patterns-ii-extension-practice";
test(
	"Java collaboration patterns actual consent, package tree, saved source and ZIPs",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ7-Editor-Collaboration-Packs",
			coreID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			fixturePath: "./fixtures/java-collaboration-sources.json",
			itemModules,
			continuationsByRole: {
				starter: [blobID, extensionID, ...appendixIDs],
				solution: [readingID, blobID, extensionID, ...appendixIDs]
			},
			sourceUrl: role =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ7-Editor-Collaboration-Packs/" +
				role,
			projectKey: role =>
				"design-patterns-in-java:" +
				(role === "starter" ? coreID : readingID) +
				":" +
				(role === "starter" ? "starter" : "reference") +
				":native-java-collaboration",
			previousProject: role => ({
				_id: "earlier-creational-" + role,
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
				courseProjectKey:
					"design-patterns-in-java:" +
					coreID +
					":" +
					(role === "starter" ? "starter" : "reference"),
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			nativeInstructions: true,
			flatFiles: true,
			sharedFiles: [],
			editFiles: [
				"src/editor/TextDocument.java",
				"src/editor/EventBus.java",
				"src/editor/ReplaceCommand.java",
				"src/editor/Validation.java",
				"src/editor/EditorMediator.java",
				"src/editor/TextVisitor.java",
				"README.md"
			],
			primaryFile: "Main.java",
			taskFile: "README.md",
			initialFile: "Main.java",
			fileCount: 13,
			expectedFile: (role, name) =>
				fixture.files[
					"DPJ7-Editor-Collaboration-Packs/" + role + "/" + name
				],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved collaboration trace " + width + "\n"
					: "\nSaved collaboration trace " + width + "\n"),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"javac --release 21 -Xlint:all -Werror -d classes @sources.txt"
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
			outputEnv: "JAVA_COLLABORATION_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-collaboration",
			outputSubdirectory: "editor",
			kind: "collaboration",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false
			})
		});
	}
);

test(
	"Java collaboration patterns public worked-code action, consent and exports",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ7-Collaboration-Worked-Example",
			coreID: readingID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			roles: ["starter"],
			continuationIDs: [],
			fixturePath: "./fixtures/java-collaboration-sources.json",
			sourceUrl: () =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ7-Collaboration-Worked-Example",
			projectKey: () =>
				"design-patterns-in-java:" +
				readingID +
				":starter:native-java-collaboration",
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
				courseProjectKey:
					"design-patterns-in-java:" + readingID + ":starter",
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
				fixture.files["DPJ7-Collaboration-Worked-Example/" + name],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved collaboration trace " + width + "\n"
					: "\nSaved collaboration trace " + width + "\n"),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"Collaboration worked contracts: 50 passed"
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
			outputEnv: "JAVA_COLLABORATION_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-collaboration",
			outputSubdirectory: "worked-example",
			kind: "collaboration-example",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false,
				workedExample: true
			})
		});
	}
);
