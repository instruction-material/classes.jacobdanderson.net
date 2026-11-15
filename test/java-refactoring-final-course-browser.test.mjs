import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// eslint-disable-next-line test/no-import-node-test -- Actual course/IDE/export workflow.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
import { openProjectSidebar } from "./ide-workspace-controls.mjs";

const fixture = JSON.parse(await readFile(new URL("./fixtures/java-refactoring-final-sources.json", import.meta.url), "utf8"));
const plans = JSON.parse(await readFile(new URL("./fixtures/java-refactoring-final-projects.json", import.meta.url), "utf8")).plans;
for (const plan of plans) {
const unit = { ...plan.unit, ...plan };
const source = (role, name) => fixture.files[`${unit.pack}/${role}/${name}`].content;
const names = role => Object.keys(fixture.files).filter(n => n.startsWith(`${unit.pack}/${role}/`)).map(n => n.slice((`${unit.pack}/${role}/`).length));
function keys(role, group) {
	return [unit.courseID, group === "core" ? role === "starter" ? unit.coreID : unit.readingID : unit.groups[group].itemID, role === "starter" ? "starter" : "reference", "native-java-" + unit.id].join(":");
}
async function enterSource(page, content) {
	await page.waitForSelector(".cm-content", { visible: true });
	await page.focus(".cm-content");
	const modifier = await page.evaluate(() => /Mac/.test(navigator.platform) ? "Meta" : "Control");
	await page.keyboard.down(modifier);
	await page.keyboard.press("a");
	await page.keyboard.up(modifier);
	await page.keyboard.sendCharacter(content);
	await page.keyboard.down(modifier);
	await page.keyboard.press("s");
	await page.keyboard.up(modifier);
}
for (const [group, selected] of Object.entries(unit.groups)) {
	for (const role of ["starter", "solution"]) {
		const initialNames = names(role);
		const finalNames = role === "starter" ? initialNames.filter(n => !selected.remove.includes(n)).concat(selected.add).sort() : [...initialNames].sort();
		const editedNames = [...selected.replace, "sources.txt", "README.md", "REFACTORING.md"];
		test(`Java final refactoring ${group} ${role}: consent, dependency seams, saved packages and independent attempts`, { timeout: 240000 }, async (t) => {
			await runAssemblyCoreCourseWorkflow(t, {
				pack: unit.pack,
				coreID: selected.itemID,
				moduleID: unit.moduleID,
				courseID: unit.courseID,
				mode: "java",
				sourceRepository: "Java-Level-3",
				fixturePath: "./fixtures/java-refactoring-final-sources.json",
				roles: [role],
				continuationIDs: group === "core" ? unit.sourceItems.filter(id => !unit.independentItems.includes(id) && id !== unit.coreID) : [selected.itemID],
				sourceUrl: selectedRole => `https://github.com/${fixture.repository}/tree/${fixture.revision}/${unit.pack}/${selectedRole}`,
				projectKey: selectedRole => keys(selectedRole, group),
				previousProject: selectedRole => ({
					_id: "earlier-refactoring-attempt",
					title: "Earlier independent attempt",
					mode: "java",
					files: [{ name: "Main.java", content: "// Earlier saved work\n" }],
					activeFileName: "Main.java",
					courseID: unit.courseID,
					courseProjectKey: group === "core" ? [unit.courseID, unit.coreID, selectedRole === "starter" ? "starter" : "reference"].join(":") : keys(selectedRole, "core"),
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				nativeInstructions: true,
				flatFiles: true,
				sharedFiles: [],
				editFiles: editedNames,
				primaryFile: selected.primary,
				taskFile: "README.md",
				initialFile: "Main.java",
				fileCount: unit.roleFileCounts[role],
				expectedFile: (selectedRole, name) => fixture.files[`${unit.pack}/${selectedRole}/${name}`],
				editContent: ({ original, filename, width }) => {
					if (filename === "sources.txt") return `${finalNames.filter(n => n.endsWith(".java")).sort().join("\n")}\n`;
					const content = role === "starter" && selected.replace.includes(filename) ? source("solution", filename) : original;
					return `${content + (filename.endsWith(".java") ? "\n// Saved refactoring trace " : "\nSaved refactoring trace ") + group} ${width}\n`;
				},
				afterEdit: async (page, { width, edits, readProject }) => {
					if (role === "starter") {
						for (const filename of selected.remove) {
							await openProjectSidebar(page);
							await page.locator(`button[aria-label='Delete file ${filename}']`).click();
							await readProject(p => !p.files.some(f => f.name === filename));
						}
						for (const filename of selected.add) {
							await openProjectSidebar(page);
							const toggle = "button[aria-label='Add or import project files']";
							if (await page.$eval(toggle, b => b.getAttribute("aria-expanded")) !== "true") await page.locator(toggle).click();
							await page.locator("input[aria-label='New project file name']").fill(filename);
							await page.keyboard.press("Enter");
							await page.waitForFunction(name => document.querySelector("select[aria-label='Active project file']")?.value === name, {}, filename);
							await page.locator("button[aria-label='Collapse project sidebar']").click();
							if (width < 900) {
								assert.equal(await page.$eval(".mobile-workspace-navigation button", b => b.getAttribute("aria-expanded")), "false");
							}
							if (width < 900) await page.locator(".mobile-view-picker button[data-view='code']").click();
							const content = source("solution", filename);
							await enterSource(page, content);
							edits[filename] = content;
							await readProject(p => p.files.find(f => f.name === filename)?.content === content);
						}
					}
					const saved = await readProject(p => p.files.length === finalNames.length);
					assert.deepEqual(saved.files.map(f => f.name).sort(), finalNames);
					assert.equal(saved.files.find(f => f.name === "sources.txt").content, `${finalNames.filter(n => n.endsWith(".java")).sort().join("\n")}\n`);
					return { createdJavaFiles: role === "starter" ? selected.add : [], retiredJavaFiles: role === "starter" ? selected.remove : [], sourceManifestMatchesSavedFiles: true };
				},
				verifyRun: async (page) => {
					await page.locator("button.run-control:not([disabled])").click();
					await page.waitForFunction(mode => document.querySelector(".output-panel")?.textContent?.includes(`java -ea -cp out ContractChecks ${mode}`), {}, group);
					assert.equal(await page.$(".stdin-panel"), null);
				},
				outputEnv: "JAVA_REFACTORING_FINAL_BROWSER_PROOF_DIR",
				defaultOutput: "output/java-refactoring-final",
				outputSubdirectory: unit.id + "/" + group,
				kind: unit.id + "-" + group + "-" + role,
				afterImport: async () => ({ nativeContractAcceptance: "JDK21-actual-browser-exports", independentProject: group, coreAlreadyBehaviorallyGreen: !unit.unfinished.core })
			});
		});
	}
}

}
