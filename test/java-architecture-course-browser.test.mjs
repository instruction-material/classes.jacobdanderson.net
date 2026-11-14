// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-architecture-sources.json", import.meta.url),
		"utf8"
	)
);
const moduleID =
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns";
const coreID =
	moduleID +
	"-curriculum-core-project-modern-extensions-and-architecture-level-patterns";
const readingID =
	moduleID +
	"-curriculum-modern-extensions-and-architecture-level-patterns-core-concepts";
const blobID =
	moduleID +
	"-curriculum-modern-extensions-and-architecture-level-patterns-application-check";
const pluginID = moduleID + "-curriculum-serviceloader-plugin-boundary";
const extensionID =
	moduleID +
	"-supplemental-modern-extensions-and-architecture-level-patterns-extension-practice";
test(
	"Java architecture patterns actual consent, package tree, saved source and ZIPs",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ8-Notebook-Architecture-Packs",
			coreID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			fixturePath: "./fixtures/java-architecture-sources.json",
			continuationsByRole: {
				starter: [blobID, pluginID, extensionID],
				solution: [readingID, blobID, pluginID, extensionID]
			},
			sourceUrl: role =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ8-Notebook-Architecture-Packs/" +
				role,
			projectKey: role =>
				"design-patterns-in-java:" +
				(role === "starter" ? coreID : readingID) +
				":" +
				(role === "starter" ? "starter" : "reference") +
				":native-java-architecture",
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
				"src/notes/infra/InMemoryNotes.java",
				"src/notes/plugins/PluginCatalog.java",
				"src/notes/application/NoteService.java",
				"src/notes/ui/NoteViewModel.java",
				"META-INF/services/notes.plugins.TextPlugin",
				"README.md"
			],
			primaryFile: "Main.java",
			taskFile: "README.md",
			initialFile: "Main.java",
			fileCount: 15,
			expectedFile: (role, name) =>
				fixture.files[
					"DPJ8-Notebook-Architecture-Packs/" + role + "/" + name
				],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.startsWith("META-INF/services/")
					? "\n# Saved architecture trace " + width + "\n"
					: filename.endsWith(".java")
						? "\n// Saved architecture trace " + width + "\n"
						: "\nSaved architecture trace " + width + "\n"),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"jar --create --file notebook.jar -C classes . -C . META-INF"
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
			outputEnv: "JAVA_ARCHITECTURE_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-architecture",
			outputSubdirectory: "notebook",
			kind: "architecture",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false
			})
		});
	}
);

test(
	"Java architecture patterns public worked-code action, consent and exports",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ8-Architecture-Worked-Example",
			coreID: readingID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			roles: ["starter"],
			continuationIDs: [],
			fixturePath: "./fixtures/java-architecture-sources.json",
			sourceUrl: () =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ8-Architecture-Worked-Example",
			projectKey: () =>
				"design-patterns-in-java:" +
				readingID +
				":starter:native-java-architecture",
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
				fixture.files["DPJ8-Architecture-Worked-Example/" + name],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.startsWith("META-INF/services/")
					? "\n# Saved architecture trace " + width + "\n"
					: filename.endsWith(".java")
						? "\n// Saved architecture trace " + width + "\n"
						: "\nSaved architecture trace " + width + "\n"),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"Architecture worked contracts: 39 passed"
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
			outputEnv: "JAVA_ARCHITECTURE_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-architecture",
			outputSubdirectory: "worked-example",
			kind: "architecture-example",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false,
				workedExample: true
			})
		});
	}
);
