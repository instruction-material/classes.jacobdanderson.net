import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "./fixtures/java-value-data-sources.json";
import identities from "./fixtures/java-value-data-identities.json";
import {
	javaValueDataUnit,
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

const url = (role: "starter" | "solution") =>
	javaRefactoringUnitURL(javaValueDataUnit.id, role);
const sources: Record<string, { content: string; sha256: string }> =
	fixture.files;
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});
it.each(["starter", "solution"] as const)(
	"retains every %s data source, saved package edit and ZIP member",
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
				expect(sources[path], path).toBeDefined();
				fetched.push(path);
				return new Response(sources[path].content);
			})
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url(role),
			"java"
		);
		expect(files.map(file => file.name)).toEqual(
			javaValueDataUnit.files[role]
		);
		expect(files).toHaveLength(13);
		for (const file of files) {
			const path = javaValueDataUnit.pack + "/" + role + "/" + file.name;
			expect(fetched).toContain(path);
			expect(file.content).toBe(sources[path].content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(sources[path].sha256);
		}
		const project = createPythonIdeProject("java", {
			files,
			courseProjectKey: javaRefactoringUnitProjectKey(
				javaValueDataUnit.courseID,
				javaValueDataUnit.coreID,
				role === "starter" ? "starter" : "reference",
				url(role)
			)
		});
		expect(project.activeFileName).toBe("Main.java");
		project.files.find(
			file => file.name === "src/supplies/SupplyRequest.java"
		)!.content += "\n// Saved representation trace\n";
		project.files.find(file => file.name === "CHECKPOINTS.md")!.content +=
			"\nSnapshot checkpoint retained\n";
		project.files.push({
			name: "src/supplies/experiment/Probe.java",
			content:
				"package supplies.experiment; public final class Probe {}\n",
			encoding: "text"
		});
		project.files.find(file => file.name === "sources.txt")!.content +=
			"src/supplies/experiment/Probe.java\n";
		await saveLocalPythonProjects([project]);
		expect(await loadLocalPythonProjects()).toEqual([project]);
		const zip = unzipSync(await createProjectArchive(project));
		expect(Object.keys(zip)).toHaveLength(14);
		for (const file of project.files) {
			const member = Object.keys(zip).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(zip[member])).toBe(file.content);
		}
	}
);
it("preserves all9published identities and complete eight input/self-check pairs", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(
		javaValueDataUnit.courseID
	))!;
	const module = course.modules.find(
		module => module.id === javaValueDataUnit.moduleID
	)!;
	const raw = designPatternsInJavaPart2Course.modules.find(
		module => module.id === javaValueDataUnit.moduleID
	)!;
	let projectCount = 0;
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
				raw[section].find(raw => raw.id === item.id)!.content.trim()
			);
			const links = [
				...item.content.matchAll(
					/\[[^\]]+\]\((\/course-resource\?[^)]+)\)/g
				)
			];
			expect(links).toHaveLength(
				item.id === javaValueDataUnit.readingID ? 0 : 2
			);
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
			if (item.projectLink) {
				projectCount++;
				expect(item.projectLink).toBe(url("starter"));
				expect(item.solutionLink).toBeUndefined();
			}
			expect(item.content).not.toMatch(
				/Build a compact working version|a concrete worked example|expected file format/
			);
		}
	}
	expect(projectCount).toBe(6);
	expect(module.curriculum[0].contentKind).toBe("reading");
	for (const evidence of [
		"Replace Array with Object",
		"Duplicate Observed Data",
		"Change Value to Reference",
		"1673",
		"1704",
		"1709",
		"List.copyOf",
		"LAB|0|",
		"ClientCompatibility",
		"final field alone",
		"existing hash calculation"
	])
		expect(module.curriculum[0].content).toContain(evidence);
});
it("shares one learner continuation, separates references and preserves rejection boundaries", async () => {
	setActivePinia(createPinia());
	useAppStore().setCurrentTutor({
		_id: "data-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: [javaValueDataUnit.courseID],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById(
		javaValueDataUnit.courseID
	))!;
	const module = course.modules.find(
		module => module.id === javaValueDataUnit.moduleID
	)!;
	const items = [...module.curriculum, ...module.supplementalProjects].filter(
		item => item.projectLink
	);
	const learner = new Set<string>(),
		reference = new Set<string>();
	for (const item of items) {
		expect(item.solutionLink).toBe(url("solution"));
		const key = javaRefactoringUnitProjectKey(
			course.id,
			item.id,
			"starter",
			item.projectLink!
		);
		learner.add(key);
		reference.add(
			javaRefactoringUnitProjectKey(
				course.id,
				item.id,
				"reference",
				item.solutionLink!
			)
		);
		expect(javaNativeBuildInstructions(key)).toContain(
			"java -cp classes ContractTests core"
		);
		expect(javaNativeBuildInstructions(key)?.join("\n")).toContain(
			"src/supplies"
		);
		expect(javaNativeBuildInstructions(key)?.join("\n")).not.toContain(
			"src/contacts"
		);
	}
	expect(items).toHaveLength(6);
	expect(learner.size).toBe(1);
	expect(reference.size).toBe(1);
	expect([...learner][0]).not.toBe([...reference][0]);
	for (const changed of [
		url("starter").replace(fixture.revision, "main"),
		url("starter") + "/extra",
		url("starter").replace("instruction-material", "other")
	])
		expect(javaRefactoringUnitResource(changed)).toBeNull();
});
