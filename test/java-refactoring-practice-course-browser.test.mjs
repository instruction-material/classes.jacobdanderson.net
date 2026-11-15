import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// eslint-disable-next-line test/no-import-node-test -- Actual consent, persistence and ZIP workflow.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const plans = JSON.parse(await readFile(new URL("./fixtures/java-refactoring-practice-projects.json", import.meta.url), "utf8"));
for (const plan of plans) {
    const unit = plan.unit;
    const fixture = JSON.parse(await readFile(new URL(plan.fixture, import.meta.url), "utf8"));
    for (const [index, item] of unit.sourceItems.entries()) {
        for (const role of ["starter", "solution"]) {
            const projectKey = selected => [unit.courseID, item, selected === "starter" ? "starter" : "reference", "native-java-" + unit.id].join(":");
            test("Optional refactoring " + unit.id + " " + index + " " + role + " saved source and native exports", { timeout: 240000 }, async t => {
                await runAssemblyCoreCourseWorkflow(t, {
                    pack: unit.pack, coreID: item, moduleID: unit.moduleID, courseID: unit.courseID,
                    mode: "java", sourceRepository: "Java-Level-3", fixturePath: plan.fixture, roles: [role],
                    continuationIDs: [item], sourceUrl: selected => "https://github.com/" + fixture.repository + "/tree/" + fixture.revision + "/" + unit.pack + "/" + selected,
                    projectKey,
                    previousProject: selected => ({
                        _id: "earlier-practice-attempt", title: "Earlier practice attempt", mode: "java",
                        files: [{ name: "Main.java", content: "// Earlier saved work\n" }], activeFileName: "Main.java",
                        courseID: unit.courseID, courseProjectKey: [unit.courseID, item, selected === "starter" ? "starter" : "reference"].join(":"),
                        createdAt: "2026-10-01T12:00:00.000Z", updatedAt: "2026-10-01T12:00:00.000Z"
                    }),
                    nativeInstructions: true, flatFiles: true, sharedFiles: [],
                    editFiles: [plan.primary, "README.md"], primaryFile: plan.primary, taskFile: "README.md", initialFile: "Main.java",
                    fileCount: unit.files[role].length,
                    expectedFile: (selected, name) => fixture.files[unit.pack + "/" + selected + "/" + name],
                    editContent: ({original, filename, width}) => original + (filename.endsWith(".java") ? "\n// Saved practice trace " : "\nSaved practice trace ") + width + "\n",
                    verifyRun: async page => {
                        await page.locator("button.run-control:not([disabled])").click();
                        await page.waitForFunction(() => document.querySelector(".output-panel")?.textContent?.includes("java -ea -cp classes ContractTests core"));
                        assert.equal(await page.$(".stdin-panel"), null);
                    },
                    outputEnv: "JAVA_REFACTORING_PRACTICE_BROWSER_PROOF_DIR", defaultOutput: "output/java-refactoring-practice",
                    outputSubdirectory: unit.id + "/" + index, kind: unit.id + "-" + index + "-" + role,
                    afterImport: async () => ({ priorQualifiedNativeSourceReused: true, independentPracticeItem: item })
                });
            });
        }
    }
}
