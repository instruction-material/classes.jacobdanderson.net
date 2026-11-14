import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "./fixtures/java-conditional-flow-sources.json";
import identities from "./fixtures/java-conditional-flow-identities.json";
import {
	javaConditionalFlowUnit as unit,
	javaRefactoringUnitURL,
	javaRefactoringUnitResource,
	javaRefactoringUnitProjectKey
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
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";
import { designPatternsInJavaPart2Course } from "@/stores/courses/design-patterns-in-java-part-2";

const sourceFiles: Record<string, { content: string; sha256: string }> =
	fixture.files;
const url = (role: "starter" | "solution") =>
	javaRefactoringUnitURL(unit.id, role);
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

it.each(["starter", "solution"] as const)(
	"retains all %s package sources through import, save, reopen and ZIP",
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
			vi.fn(async (source: string) => {
				expect(source.startsWith(prefix)).toBe(true);
				const path = source.slice(prefix.length);
				expect(sourceFiles[path], path).toBeDefined();
				fetched.push(path);
				return new Response(sourceFiles[path].content);
			})
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url(role),
			"java"
		);
		expect(files.map(f => f.name)).toEqual(unit.files[role]);
		expect(files).toHaveLength(18);
		expect(fetched).toHaveLength(18);
		for (const file of files) {
			const expected =
				sourceFiles[unit.pack + "/" + role + "/" + file.name];
			expect(file.content).toBe(expected.content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(expected.sha256);
		}
		const project = createPythonIdeProject("java", {
			files,
			courseID: unit.courseID,
			courseProjectKey: javaRefactoringUnitProjectKey(
				unit.courseID,
				unit.coreID,
				role === "starter" ? "starter" : "reference",
				url(role)
			)
		});
		expect(project.activeFileName).toBe("src/lab/GatePolicy.java");
		project.files.find(
			f => f.name === "src/lab/GatePolicy.java"
		)!.content += "\n// Saved guard experiment\n";
		project.activeFileName = "src/lab/GatePolicy.java";
		await saveLocalPythonProjects([project]);
		const reopened = (await loadLocalPythonProjects()).find(
			p => p._id === project._id
		)!;
		expect(reopened).toEqual(project);
		const zip = unzipSync(await createProjectArchive(reopened));
		expect(Object.keys(zip)).toHaveLength(18);
		for (const file of reopened.files) {
			const name = Object.keys(zip).find(n =>
				n.endsWith("/" + file.name)
			)!;
			expect(strFromU8(zip[name])).toBe(file.content);
		}
	}
);
it.each(["learner", "instructor"] as const)(
	"preserves published identities and complete case inputs for %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "conditional-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [unit.courseID],
				editTutors: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(unit.courseID))!;
		const module = course.modules.find(m => m.id === unit.moduleID)!;
		const raw = designPatternsInJavaPart2Course.modules.find(
			m => m.id === unit.moduleID
		)!;
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			expect(
				module[section].map(({ id, title, aliases }) => ({
					id,
					title,
					...(aliases ? { aliases } : {})
				}))
			).toEqual(identities[section]);
			for (const item of module[section]) {
				expect(item.content).toBe(
					raw[section].find(r => r.id === item.id)!.content.trim()
				);
				const links = [
					...item.content.matchAll(
						/\[[^\]]+\]\((\/course-resource\?[^)]+)\)/g
					)
				];
				expect(links).toHaveLength(item.id === unit.readingID ? 0 : 2);
				for (const [, href] of links) {
					const [path, anchor] = new URL(
						href,
						"https://example.invalid"
					).searchParams
						.get("asset")!
						.split("#");
					expect(
						readFileSync(resolve("public", path.slice(1)), "utf8")
					).toContain("## " + anchor + "\n");
				}
				if ((unit.sourceItems as readonly string[]).includes(item.id)) {
					expect(item.projectLink).toBe(url("starter"));
					expect(item.solutionLink).toBe(
						role === "instructor" ? url("solution") : undefined
					);
				}
			}
		}
		expect(module.curriculum).toHaveLength(5);
		expect(module.supplementalProjects).toHaveLength(3);
		expect(module.curriculum[0].contentKind).toBe("reading");
		for (const term of [
			"Decompose Conditional",
			"Consolidate Conditional Expression",
			"Consolidate Duplicate Conditional Fragments",
			"Remove Control Flag",
			"Replace Nested Conditional with Guard Clauses",
			"Replace Conditional with Polymorphism",
			"Introduce Null Object",
			"Introduce Assertion",
			"NullPointerException",
			"144,000",
			"-ea",
			"-da",
			"availability:busy=true"
		])
			expect(module.curriculum[0].content).toContain(term);
	}
);
it("shares core continuations while keeping optional work, references and earlier attempts distinct", () => {
	const optional = unit.independentItems[0];
	const coreKeys = unit.sourceItems
		.filter(id => id !== optional)
		.map(id =>
			javaRefactoringUnitProjectKey(
				unit.courseID,
				id,
				"starter",
				url("starter")
			)
		);
	expect(new Set(coreKeys).size).toBe(1);
	const extra = javaRefactoringUnitProjectKey(
		unit.courseID,
		optional,
		"starter",
		url("starter")
	);
	const reference = javaRefactoringUnitProjectKey(
		unit.courseID,
		unit.coreID,
		"reference",
		url("solution")
	);
	expect(extra).not.toBe(coreKeys[0]);
	expect(reference).not.toBe(coreKeys[0]);
	expect(extra).not.toBe(reference);
	for (const key of [coreKeys[0], extra, reference])
		expect(javaNativeBuildInstructions(key)?.join("\n")).toContain(
			"java -ea -cp out lab.CoreChecks core"
		);
	expect(coreKeys[0]).not.toBe(
		[unit.courseID, unit.coreID, "starter"].join(":")
	);
	for (const changed of [
		url("starter").replace(fixture.revision, "main"),
		url("starter") + "/extra",
		url("starter").replace("instruction-material", "other")
	])
		expect(javaRefactoringUnitResource(changed)).toBeNull();
});
