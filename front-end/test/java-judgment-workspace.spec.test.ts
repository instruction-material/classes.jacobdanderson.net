import {
	javaArchitectureCoreID,
	javaArchitectureProjectKey,
	javaArchitectureURL
} from "@/modules/javaArchitectureResources";
import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../test/fixtures/java-judgment-sources.json";
import originals from "./fixtures/java-judgment-identities.json";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaJudgmentPreviewID,
	javaJudgmentCoreID,
	javaJudgmentExtensionID,
	javaJudgmentFiles,
	javaJudgmentImportFiles,
	javaJudgmentModuleID,
	javaJudgmentProjectKey,
	javaJudgmentReadingID,
	javaJudgmentReferenceItems,
	javaJudgmentResource,
	javaJudgmentURL
} from "@/modules/javaJudgmentResources";
import {
	javaPatternsPricingID,
	javaPatternsProjectKey,
	javaPatternsURL
} from "@/modules/javaPatternsResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { designPatternsInJavaCourse } from "@/stores/courses/design-patterns-in-java";
import { useCoursesStore } from "@/stores/courses";

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});
const sources: Record<string, { content: string; sha256: string }> =
	fixture.files;
it.each(["starter", "solution"] as const)(
	"preserves all 9 packaged %s files through import/save/ZIP",
	async role => {
		vi.stubGlobal("crypto", webcrypto);
		const requested: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string) => {
				const prefix =
					"https://raw.githubusercontent.com/" +
					fixture.repository +
					"/" +
					fixture.revision +
					"/";
				expect(url.startsWith(prefix)).toBe(true);
				const path = url.slice(prefix.length);
				requested.push(path);
				expect(sources[path], path).toBeDefined();
				return new Response(sources[path].content);
			})
		);
		const url = javaJudgmentURL(role);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "java");
		expect(files.map(file => file.name)).toEqual(javaJudgmentFiles);
		expect(files).toHaveLength(9);
		const folder = "DPJ9-Checkout-Judgment-Packs/" + role + "/";
		expect(requested).toEqual(javaJudgmentFiles.map(name => folder + name));
		for (const file of files) {
			expect(file.content).toBe(sources[folder + file.name].content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(sources[folder + file.name].sha256);
		}
		const project = createPythonIdeProject("java", {
			files,
			courseProjectKey: "judgment-" + role
		});
		expect(project.activeFileName).toBe("Main.java");
		project.files[0].content += "\n// saved package trace\n";
		const decisions = project.files.find(
			file => file.name === "DECISIONS.md"
		)!;
		decisions.content += "\nSaved design decision\n";
		const old = createPythonIdeProject("java", {
			files: [
				{
					name: "Main.java",
					content: "// earlier project",
					encoding: "text"
				}
			],
			courseProjectKey: "legacy"
		});
		await saveLocalPythonProjects([old, project]);
		expect(await loadLocalPythonProjects()).toEqual([old, project]);
		const archive = unzipSync(await createProjectArchive(project));
		expect(Object.keys(archive)).toHaveLength(9);
		for (const file of project.files) {
			const path = Object.keys(archive).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	}
);
it("preserves all 10 published judgment identities and complete source bodies", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const module = course.modules.find(
		module => module.id === javaJudgmentModuleID
	)!;
	const raw = designPatternsInJavaCourse.modules.find(
		module => module.id === javaJudgmentModuleID
	)!;
	for (const section of ["curriculum", "supplementalProjects"] as const) {
		expect(
			module[section].map(({ id, aliases, title }) => ({
				id,
				...(aliases ? { aliases } : {}),
				title
			}))
		).toEqual(originals[section]);
		for (const item of module[section]) {
			expect(item.content).toBe(
				raw[section].find(row => row.id === item.id)!.content.trim()
			);
			expect(item.contentKind).toBe(
				item.id === javaJudgmentReadingID ? "reading" : "assignment"
			);
			const links = [
				...item.content.matchAll(
					/\[[^\]]+\]\((\/course-resource\?[^)]+)\)/g
				)
			];
			expect(links).toHaveLength(
				item.contentKind === "assignment" ? 2 : 0
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
				).toContain(
					"## " +
						anchor
							.replaceAll("-", " ")
							.replace(/^./, c => c.toUpperCase())
				);
			}
		}
	}
	expect(module.curriculum).toHaveLength(7);
	expect(module.supplementalProjects).toHaveLength(3);
	for (const item of module.supplementalProjects.slice(0, 2)) {
		expect(item.projectLink).toBeUndefined();
		expect(item.solutionLink).toBeUndefined();
	}
	expect(module.curriculum[0].content).toContain(
		sources["DPJ9-Judgment-Worked-Example/Main.java"].content.trim()
	);
});
it("shares core continuations, keeps the reference separate and preserves DPJ1 keys", () => {
	const core = javaJudgmentProjectKey(
		"design-patterns-in-java",
		javaJudgmentCoreID,
		"starter",
		javaJudgmentURL("starter")
	);
	for (const item of [javaJudgmentPreviewID, javaJudgmentExtensionID])
		expect(
			javaJudgmentProjectKey(
				"design-patterns-in-java",
				item,
				"starter",
				javaJudgmentURL("starter")
			)
		).toBe(core);
	const reference = javaJudgmentProjectKey(
		"design-patterns-in-java",
		javaJudgmentReadingID,
		"reference",
		javaJudgmentURL("solution")
	);
	expect(reference).not.toBe(core);
	for (const item of javaJudgmentReferenceItems)
		expect(
			javaJudgmentProjectKey(
				"design-patterns-in-java",
				item,
				"reference",
				javaJudgmentURL("solution")
			)
		).toBe(reference);
	for (const key of [core, reference]) {
		expect(javaNativeBuildInstructions(key)?.join("\n")).toContain(
			"-d classes @sources.txt"
		);
		expect(
			javaNativeBuildInstructions(
				key.replace(":native-java-judgment", "")
			)
		).toBeNull();
	}
	for (const role of ["starter", "reference"] as const) {
		const url = javaPatternsURL(
			"pricing",
			role === "starter" ? "starter" : "solution"
		);
		expect(
			javaJudgmentProjectKey(
				"design-patterns-in-java",
				javaPatternsPricingID,
				role,
				url
			)
		).toBe(
			javaPatternsProjectKey(
				"design-patterns-in-java",
				javaPatternsPricingID,
				role,
				url
			)
		);
	}
	for (const role of ["starter", "reference"] as const) {
		const url = javaArchitectureURL(
			role === "starter" ? "starter" : "solution"
		);
		expect(
			javaJudgmentProjectKey(
				"design-patterns-in-java",
				javaArchitectureCoreID,
				role,
				url
			)
		).toBe(
			javaArchitectureProjectKey(
				"design-patterns-in-java",
				javaArchitectureCoreID,
				role,
				url
			)
		);
	}
	for (const url of [
		javaJudgmentURL("starter") + "/extra",
		javaJudgmentURL("starter").replace(fixture.revision, "main"),
		javaJudgmentURL("starter").replace("Java-Level-3", "Other"),
		javaJudgmentURL("starter").replace("/starter", "/reference")
	]) {
		expect(javaJudgmentResource(url)).toBeNull();
		expect(javaJudgmentImportFiles(url)).toBeNull();
	}
});

it("offers the complete worked example to a learner and imports its three files", async () => {
	setActivePinia(createPinia());
	vi.stubGlobal("crypto", webcrypto);
	const requested: string[] = [];
	const prefix =
		"https://raw.githubusercontent.com/" +
		fixture.repository +
		"/" +
		fixture.revision +
		"/";
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) => {
			expect(url.startsWith(prefix)).toBe(true);
			const path = url.slice(prefix.length);
			requested.push(path);
			expect(sources[path], path).toBeDefined();
			return new Response(sources[path].content);
		})
	);
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const reading = course.modules.find(
		module => module.id === javaJudgmentModuleID
	)!.curriculum[0];
	expect(reading.projectLink).toBe(javaJudgmentURL("example"));
	const files = await loadPythonIdeStarterFilesFromGitHub(
		reading.projectLink!,
		"java"
	);
	expect(files.map(file => file.name)).toEqual([
		"Main.java",
		"ContractTests.java",
		"README.md"
	]);
	expect(requested).toEqual(
		files.map(file => "DPJ9-Judgment-Worked-Example/" + file.name)
	);
	const project = createPythonIdeProject("java", {
		files,
		courseProjectKey: javaJudgmentProjectKey(
			"design-patterns-in-java",
			javaJudgmentReadingID,
			"starter",
			reading.projectLink!
		)
	});
	expect(project.activeFileName).toBe("Main.java");
	expect(
		javaNativeBuildInstructions(project.courseProjectKey)?.join("\n")
	).toContain("Judgment worked contracts: 49 passed");
	expect(
		javaNativeBuildInstructions(project.courseProjectKey)?.join("\n")
	).toContain("Main.java ContractTests.java");
	const archive = unzipSync(await createProjectArchive(project));
	expect(Object.keys(archive)).toHaveLength(3);
	for (const file of files) {
		expect(file.content).toBe(
			sources["DPJ9-Judgment-Worked-Example/" + file.name].content
		);
		const path = Object.keys(archive).find(path =>
			path.endsWith("/" + file.name)
		)!;
		expect(strFromU8(archive[path])).toBe(file.content);
	}
});
