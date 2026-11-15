import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// eslint-disable-next-line test/no-import-node-test -- Actual course/IDE/export workflow.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const fixture = JSON.parse(await readFile(new URL("./fixtures/java-method-calls-sources.json", import.meta.url), "utf8"));
const unit = { pack: "DPR6-Method-Calls-Packs", moduleID: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls", courseID: "design-patterns-in-java-part-2", coreID: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-core-project-simplifying-method-calls", readingID: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-simplifying-method-calls-core-concepts", sourceItems: ["design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-simplifying-method-calls-application-check", "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-public-api-compatibility-contract", "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-null-optional-and-exception-boundary", "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-core-project-simplifying-method-calls", "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-simplifying-method-calls-extension-practice"], independentItems: ["design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-simplifying-method-calls-extension-practice"] };
const optionalID = unit.independentItems[0];
function keys(role, group) {
	return [unit.courseID, group === "optional" ? optionalID : role === "starter" ? unit.coreID : unit.readingID, role === "starter" ? "starter" : "reference", "native-java-method-calls"].join(":");
}
for (const group of ["core", "optional"]) {
	for (const role of ["starter", "solution"]) {
		const primary = group === "core" ? "src/dispatch/DispatchService.java" : "src/dispatch/optional/QueueClient.java";
		const edits = group === "core"
			? ["src/dispatch/DispatchService.java", "src/dispatch/CompatibilityDesk.java", "README.md", "REFACTORING.md"]
			: ["src/dispatch/optional/QueueClient.java", "README.md", "REFACTORING.md"];
		test(`Java method calls ${group} ${role}: consent, saved packages and separate attempts`, { timeout: 180000 }, async (t) => {
			await runAssemblyCoreCourseWorkflow(t, {
				pack: unit.pack,
				coreID: group === "core" ? unit.coreID : optionalID,
				moduleID: unit.moduleID,
				courseID: unit.courseID,
				mode: "java",
				sourceRepository: "Java-Level-3",
				fixturePath: "./fixtures/java-method-calls-sources.json",
				roles: [role],
				continuationIDs: group === "core" ? unit.sourceItems.filter(id => id !== optionalID && id !== unit.coreID) : [optionalID],
				sourceUrl: selected => `https://github.com/${fixture.repository}/tree/${fixture.revision}/${unit.pack}/${selected}`,
				projectKey: selected => keys(selected, group),
				previousProject: selected => ({
					_id: "earlier-dispatch-attempt",
					title: "Earlier completed core",
					mode: "java",
					files: [{ name: "src/dispatch/DispatchService.java", content: "// Earlier completed core remains saved\n" }],
					activeFileName: "src/dispatch/DispatchService.java",
					courseID: unit.courseID,
					courseProjectKey: group === "optional" ? keys(selected, "core") : [unit.courseID, unit.coreID, selected === "starter" ? "starter" : "reference"].join(":"),
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				nativeInstructions: true,
				flatFiles: true,
				sharedFiles: [],
				editFiles: edits,
				primaryFile: primary,
				taskFile: "README.md",
				initialFile: "Main.java",
				fileCount: 18,
				expectedFile: (selected, name) => fixture.files[`${unit.pack}/${selected}/${name}`],
				editContent: ({ original, filename, width }) => {
					const source = role === "starter" && filename.endsWith(".java")
						? fixture.files[`${unit.pack}/solution/${filename}`].content
						: original;
					return `${source + (filename.endsWith(".java") ? "\n// Saved dispatch trace " : "\nSaved dispatch trace ") + group} ${width}\n`;
				},
				verifyRun: async (page) => {
					await page.locator("button.run-control:not([disabled])").click();
					await page.waitForFunction(() => document.querySelector(".output-panel")?.textContent?.includes("java -ea -cp out ContractChecks core"));
					assert.equal(await page.$(".stdin-panel"), null);
				},
				outputEnv: "JAVA_METHOD_CALLS_BROWSER_PROOF_DIR",
				defaultOutput: "output/java-method-calls",
				outputSubdirectory: group,
				kind: `method-calls-${group}-${role}`,
				afterImport: async () => ({ fullContractAcceptance: "native-JDK21-actual-exports", separateOptionalAttempt: group === "optional", runnableStarterBaseline: true, starterInitiallyUnfinished: role === "starter" })
			});
		});
	}
}
