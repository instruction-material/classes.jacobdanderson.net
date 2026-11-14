import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// eslint-disable-next-line test/no-import-node-test -- Actual course/IDE/export workflow.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const fixture = JSON.parse(await readFile(new URL("./fixtures/java-conditional-flow-sources.json", import.meta.url), "utf8"));
const unit = { pack: "DPR5-Conditional-Flow-Packs", moduleID: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions", courseID: "design-patterns-in-java-part-2", coreID: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-core-project-simplifying-conditional-expressions", readingID: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-simplifying-conditional-expressions-core-concepts", sourceItems: ["design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-simplifying-conditional-expressions-application-check", "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-decision-table-and-branch-equivalence-contract", "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-core-project-simplifying-conditional-expressions", "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-simplifying-conditional-expressions-extension-practice"], independentItems: ["design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-simplifying-conditional-expressions-extension-practice"] };
const optionalID = unit.independentItems[0];
function keys(role, group) {
	return [unit.courseID, group === "optional" ? optionalID : role === "starter" ? unit.coreID : unit.readingID, role === "starter" ? "starter" : "reference", "native-java-conditional-flow"].join(":");
}
for (const group of ["core", "optional"]) {
	for (const role of ["starter", "solution"]) {
		const edits = group === "core"
			? ["src/lab/GatePolicy.java", "README.md", "REFACTORING.md"]
			: ["src/lab/GatePolicy.java", "src/lab/optional/FeePolicies.java", "src/lab/optional/OptionalWorkflow.java", "README.md", "REFACTORING.md"];
		test(`Java conditional ${group} ${role}: consent, saved packages and separate attempts`, { timeout: 180000 }, async (t) => {
			await runAssemblyCoreCourseWorkflow(t, {
				pack: unit.pack,
				coreID: group === "core" ? unit.coreID : optionalID,
				moduleID: unit.moduleID,
				courseID: unit.courseID,
				mode: "java",
				sourceRepository: "Java-Level-3",
				fixturePath: "./fixtures/java-conditional-flow-sources.json",
				roles: [role],
				continuationIDs: group === "core" ? unit.sourceItems.filter(id => id !== optionalID && id !== unit.coreID) : [optionalID],
				sourceUrl: selected => `https://github.com/${fixture.repository}/tree/${fixture.revision}/${unit.pack}/${selected}`,
				projectKey: selected => keys(selected, group),
				previousProject: selected => ({
					_id: "earlier-conditional-attempt",
					title: "Earlier completed core",
					mode: "java",
					files: [{ name: "src/lab/GatePolicy.java", content: "// Earlier completed core remains saved\n" }],
					activeFileName: "src/lab/GatePolicy.java",
					courseID: unit.courseID,
					courseProjectKey: group === "optional" ? keys(selected, "core") : [unit.courseID, unit.coreID, selected === "starter" ? "starter" : "reference"].join(":"),
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				nativeInstructions: true,
				flatFiles: true,
				sharedFiles: [],
				editFiles: edits,
				primaryFile: "src/lab/GatePolicy.java",
				taskFile: "README.md",
				initialFile: "src/lab/GatePolicy.java",
				fileCount: 18,
				expectedFile: (selected, name) => fixture.files[`${unit.pack}/${selected}/${name}`],
				editContent: ({ original, filename, width }) => {
					const source = role === "starter" && filename.endsWith(".java")
						? fixture.files[`${unit.pack}/solution/${filename}`].content
						: original;
					return `${source + (filename.endsWith(".java") ? "\n// Saved conditional trace " : "\nSaved conditional trace ") + group} ${width}\n`;
				},
				verifyRun: async (page) => {
					await page.locator("button.run-control:not([disabled])").click();
					await page.waitForFunction(() => document.querySelector(".output-panel")?.textContent?.includes("java -ea -cp out lab.CoreChecks core"));
					assert.equal(await page.$(".stdin-panel"), null);
				},
				outputEnv: "JAVA_CONDITIONAL_FLOW_BROWSER_PROOF_DIR",
				defaultOutput: "output/java-conditional-flow",
				outputSubdirectory: group,
				kind: `conditional-flow-${group}-${role}`,
				afterImport: async () => ({ fullContractAcceptance: "native-JDK21-actual-exports", separateOptionalAttempt: group === "optional", runnableStarterBaseline: true, starterInitiallyUnfinished: role === "starter" })
			});
		});
	}
}
