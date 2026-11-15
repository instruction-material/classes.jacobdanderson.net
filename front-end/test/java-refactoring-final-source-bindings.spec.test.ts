import { createHash, webcrypto } from "node:crypto";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "./fixtures/java-refactoring-final-sources.json";
import { javaRefactoringFinalUnits } from "@/modules/javaRefactoringFinalUnits";
import {
	javaRefactoringUnitProjectKey,
	javaRefactoringUnitURL
} from "@/modules/javaRefactoringUnits";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";

const sources: Record<string, { content: string; sha256: string }> =
	fixture.files;
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

for (const unit of javaRefactoringFinalUnits) {
	it.each(["starter", "solution"] as const)(
		unit.id +
			": imports exact %s bytes and retains edits through save/reopen/export",
		async role => {
			vi.stubGlobal("crypto", webcrypto);
			const prefix =
				"https://raw.githubusercontent.com/" +
				fixture.repository +
				"/" +
				fixture.revision +
				"/";
			const fetched: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (input: string) => {
					expect(input.startsWith(prefix)).toBe(true);
					const path = input.slice(prefix.length);
					expect(sources[path], path).toBeDefined();
					fetched.push(path);
					return new Response(sources[path].content);
				})
			);
			const url = javaRefactoringUnitURL(unit.id, role);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				url,
				"java"
			);
			expect(files.map(file => file.name)).toEqual(unit.files[role]);
			expect(fetched).toHaveLength(unit.files[role].length);
			for (const file of files) {
				const source =
					sources[unit.pack + "/" + role + "/" + file.name];
				expect(file.content).toBe(source.content);
				expect(
					createHash("sha256").update(file.content).digest("hex")
				).toBe(source.sha256);
			}
			const roleKey = role === "starter" ? "starter" : "reference";
			const project = createPythonIdeProject("java", {
				files,
				courseID: unit.courseID,
				courseProjectKey: javaRefactoringUnitProjectKey(
					unit.courseID,
					unit.coreID,
					roleKey,
					url
				)
			});
			expect(project.activeFileName).toBe("Main.java");
			project.files.find(file => file.name === "Main.java")!.content +=
				"\n// Saved source-binding attempt\n";
			await saveLocalPythonProjects([project]);
			const reopened = (await loadLocalPythonProjects()).find(
				value => value._id === project._id
			)!;
			expect(reopened).toEqual(project);
			const zip = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(zip)).toHaveLength(files.length);
			for (const file of reopened.files) {
				const member = Object.keys(zip).find(name =>
					name.endsWith("/" + file.name)
				)!;
				expect(strFromU8(zip[member])).toBe(file.content);
			}
		}
	);

	it(
		unit.id +
			": shares core continuations and separates optional projects and references",
		() => {
			const url = (role: "starter" | "solution") =>
				javaRefactoringUnitURL(unit.id, role);
			const keys = (role: "starter" | "reference") =>
				unit.sourceItems.map(item =>
					javaRefactoringUnitProjectKey(
						unit.courseID,
						item,
						role,
						url(role === "starter" ? "starter" : "solution")
					)
				);
			const starters = keys("starter"),
				references = keys("reference");
			expect(new Set(starters).size).toBe(3);
			expect(new Set(references).size).toBe(3);
			expect(new Set([...starters, ...references]).size).toBe(6);
			const core = javaRefactoringUnitProjectKey(
				unit.courseID,
				unit.coreID,
				"starter",
				url("starter")
			);
			for (const item of unit.sourceItems) {
				if (
					!(unit.independentItems as readonly string[]).includes(item)
				) {
					expect(
						javaRefactoringUnitProjectKey(
							unit.courseID,
							item,
							"starter",
							url("starter")
						)
					).toBe(core);
				}
			}
			for (const [index, item] of unit.independentItems.entries()) {
				const key = javaRefactoringUnitProjectKey(
					unit.courseID,
					item,
					"starter",
					url("starter")
				);
				const commands = javaNativeBuildInstructions(key)!.join("\n");
				expect(commands).toContain(
					"ContractChecks " + (index === 0 ? "transfer" : "extension")
				);
				expect(commands).toContain("sources.txt");
			}
			expect(
				javaRefactoringUnitProjectKey(
					"another-course",
					unit.coreID,
					"starter",
					url("starter")
				)
			).toBe(["another-course", unit.coreID, "starter"].join(":"));
			if (unit.id === "capstone-refactoring") {
				expect(javaNativeBuildInstructions(core)!.join("\n")).toContain(
					"script-core < sample-input.txt"
				);
				expect(
					javaNativeBuildInstructions(core)!.join("\n")
				).not.toContain("These programs read no standard input");
			}
		}
	);
}
it("pins all 262 declared files to the qualified final source revision", () => {
	expect(javaRefactoringFinalUnits).toHaveLength(8);
	expect(Object.keys(sources)).toHaveLength(262);
	expect(
		javaRefactoringFinalUnits.every(
			unit => unit.revision === fixture.revision
		)
	).toBe(true);
	expect(new Set(javaRefactoringFinalUnits.map(unit => unit.id)).size).toBe(
		8
	);
});
