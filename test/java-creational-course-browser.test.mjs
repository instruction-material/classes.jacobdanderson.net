// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-creational-sources.json", import.meta.url),
		"utf8"
	)
);
const appendixIDs = [
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-convert-duplicate-constructors-to-factory"
];
const itemModules = {
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-convert-duplicate-constructors-to-factory":
		"design-patterns-in-java-project-practice-guide"
};
const moduleID = "design-patterns-in-java-dpj3-creational-patterns-i";
const coreID = moduleID + "-curriculum-core-project-creational-patterns-i";
const readingID = moduleID + "-curriculum-creational-patterns-i-core-concepts";
const blobID = moduleID + "-curriculum-builder";
const extensionID =
	moduleID + "-supplemental-creational-patterns-i-extension-practice";
test(
	"Java creational patterns actual consent, package tree, saved source and ZIPs",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ3-Report-Creation-Packs",
			coreID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			fixturePath: "./fixtures/java-creational-sources.json",
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
				"/DPJ3-Report-Creation-Packs/" +
				role,
			projectKey: role =>
				"design-patterns-in-java:" +
				(role === "starter" ? coreID : readingID) +
				":" +
				(role === "starter" ? "starter" : "reference") +
				":native-java-creational",
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
				"src/creation/Families.java",
				"src/creation/Exporters.java",
				"src/creation/ReportJob.java",
				"README.md"
			],
			primaryFile: "Main.java",
			taskFile: "README.md",
			initialFile: "Main.java",
			fileCount: 14,
			expectedFile: (role, name) =>
				fixture.files[
					"DPJ3-Report-Creation-Packs/" + role + "/" + name
				],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved creational trace " + width + "\n"
					: "\nSaved creational trace " + width + "\n"),
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
			outputEnv: "JAVA_CREATIONAL_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-creational",
			outputSubdirectory: "report-creation",
			kind: "creational",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false
			})
		});
	}
);

test(
	"Java creational patterns public worked-code action, consent and exports",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ3-Creation-Worked-Example",
			coreID: readingID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			roles: ["starter"],
			continuationIDs: [],
			fixturePath: "./fixtures/java-creational-sources.json",
			sourceUrl: () =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ3-Creation-Worked-Example",
			projectKey: () =>
				"design-patterns-in-java:" +
				readingID +
				":starter:native-java-creational",
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
				fixture.files["DPJ3-Creation-Worked-Example/" + name],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved creational trace " + width + "\n"
					: "\nSaved creational trace " + width + "\n"),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"Creation worked contracts: 31 passed"
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
			outputEnv: "JAVA_CREATIONAL_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-creational",
			outputSubdirectory: "worked-example",
			kind: "creational-example",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false,
				workedExample: true
			})
		});
	}
);
