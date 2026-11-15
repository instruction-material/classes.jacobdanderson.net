import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "./fixtures/java-testability-sources.json";
import identities from "./fixtures/java-testability-identities.json";
import {
	javaTestabilityUnit as unit,
	javaRefactoringUnitURL,
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

const sources: Record<string, { content: string; sha256: string }> =
	fixture.files;
const url = (role: "starter" | "solution") =>
	javaRefactoringUnitURL(unit.id, role);
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

it.each(["starter", "solution"] as const)(
	"retains exact %s testability sources through save, reopen and ZIP",
	async role => {
		vi.stubGlobal("crypto", webcrypto);
		const prefix = `https://raw.githubusercontent.com/${fixture.repository}/${fixture.revision}/`;
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
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url(role),
			"java"
		);
		expect(files.map(f => f.name)).toEqual(unit.files[role]);
		expect(fetched).toHaveLength(14);
		for (const file of files) {
			const source = sources[`${unit.pack}/${role}/${file.name}`];
			expect(file.content).toBe(source.content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(source.sha256);
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
		expect(project.activeFileName).toBe("Main.java");
		project.files.find(
			f => f.name === "src/journal/DispatchJournal.java"
		)!.content += "\n// Saved testability experiment\n";
		project.activeFileName = "src/journal/DispatchJournal.java";
		await saveLocalPythonProjects([project]);
		const reopened = (await loadLocalPythonProjects()).find(
			p => p._id === project._id
		)!;
		expect(reopened).toEqual(project);
		const zip = unzipSync(await createProjectArchive(reopened));
		expect(Object.keys(zip)).toHaveLength(files.length);
		for (const file of reopened.files) {
			const name = Object.keys(zip).find(n =>
				n.endsWith("/" + file.name)
			)!;
			expect(strFromU8(zip[name])).toBe(file.content);
		}
	}
);

it.each(["learner", "instructor"] as const)(
	"preserves all published identities and full teaching/case content for %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "testability-tutor",
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
				} else {
					expect(item.projectLink).toBeUndefined();
				}
			}
		}
		expect(module.curriculum).toHaveLength(6);
		expect(module.supplementalProjects).toHaveLength(3);
		const reading = module.curriculum[0];
		expect(reading.contentKind).toBe("reading");
		for (const term of [
			"Clock",
			"IntSupplier",
			"EntrySink",
			"LegacyJournal",
			"Constructor",
			"Probe.java",
			"CaptureNormalizer",
			"RetryingSink",
			"entry was not committed",
			"UncheckedIOException",
			"assert",
			"sources.txt",
			"-ea",
			"-da"
		])
			expect(reading.content).toContain(term);
	}
);

it("shares the core continuation and separates both optional attempts and references", () => {
	const starters = unit.sourceItems.map(id =>
		javaRefactoringUnitProjectKey(
			unit.courseID,
			id,
			"starter",
			url("starter")
		)
	);
	const references = unit.sourceItems.map(id =>
		javaRefactoringUnitProjectKey(
			unit.courseID,
			id,
			"reference",
			url("solution")
		)
	);
	const core = javaRefactoringUnitProjectKey(
		unit.courseID,
		unit.coreID,
		"starter",
		url("starter")
	);
	const reference = javaRefactoringUnitProjectKey(
		unit.courseID,
		unit.coreID,
		"reference",
		url("solution")
	);
	for (const id of unit.sourceItems.filter(
		id => !(unit.independentItems as readonly string[]).includes(id)
	))
		expect(
			javaRefactoringUnitProjectKey(
				unit.courseID,
				id,
				"starter",
				url("starter")
			)
		).toBe(core);
	expect(new Set(starters).size).toBe(3);
	expect(new Set(references).size).toBe(3);
	expect(new Set([...starters, ...references]).size).toBe(6);
	expect(reference).not.toBe(core);
	for (const [i, id] of unit.independentItems.entries()) {
		const key = javaRefactoringUnitProjectKey(
			unit.courseID,
			id,
			"starter",
			url("starter")
		);
		expect(javaNativeBuildInstructions(key)?.join("\n")).toContain(
			"ContractChecks " + (i === 0 ? "transfer" : "extension")
		);
		expect(javaNativeBuildInstructions(key)?.join("\n")).toContain(
			"including extracted types"
		);
	}
});
