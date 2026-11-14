import {
	javaCollaborationCoreID,
	javaCollaborationProjectKey,
	javaCollaborationURL
} from "@/modules/javaCollaborationResources";
import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../test/fixtures/java-architecture-sources.json";
import originals from "./fixtures/java-architecture-identities.json";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaArchitectureApplicationID,
	javaArchitectureCoreID,
	javaArchitectureExtensionID,
	javaArchitecturePluginID,
	javaArchitectureFiles,
	javaArchitectureImportFiles,
	javaArchitectureModuleID,
	javaArchitectureProjectKey,
	javaArchitectureReadingID,
	javaArchitectureReferenceItems,
	javaArchitectureResource,
	javaArchitectureURL
} from "@/modules/javaArchitectureResources";
import {
	javaPatternsPricingID,
	javaPatternsProjectKey,
	javaPatternsURL
} from "@/modules/javaPatternsResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	isValidPythonFileName,
	isPythonIdeTextFile,
	normalizePythonFileName,
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
	"preserves all 15 packaged %s files through import/save/ZIP",
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
		const url = javaArchitectureURL(role);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "java");
		expect(files.map(file => file.name)).toEqual(javaArchitectureFiles);
		expect(files).toHaveLength(15);
		const folder = "DPJ8-Notebook-Architecture-Packs/" + role + "/";
		expect(requested).toEqual(
			javaArchitectureFiles.map(name => folder + name)
		);
		for (const file of files) {
			expect(file.content).toBe(sources[folder + file.name].content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(sources[folder + file.name].sha256);
		}
		const project = createPythonIdeProject("java", {
			files,
			courseProjectKey: "architecture-" + role
		});
		expect(project.activeFileName).toBe("Main.java");
		project.files[0].content += "\n// saved package trace\n";
		const descriptor = project.files.find(
			file => file.name === "META-INF/services/notes.plugins.TextPlugin"
		)!;
		descriptor.content += "\n# saved provider trace\n";
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
		expect(Object.keys(archive)).toHaveLength(15);
		for (const file of project.files) {
			const path = Object.keys(archive).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	}
);
it("preserves all 9 published architecture identities and complete source bodies", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const module = course.modules.find(
		module => module.id === javaArchitectureModuleID
	)!;
	const raw = designPatternsInJavaCourse.modules.find(
		module => module.id === javaArchitectureModuleID
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
				item.id === javaArchitectureReadingID ? "reading" : "assignment"
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
	expect(module.curriculum).toHaveLength(6);
	expect(module.supplementalProjects).toHaveLength(3);
	for (const item of module.supplementalProjects.slice(0, 2)) {
		expect(item.projectLink).toBeUndefined();
		expect(item.solutionLink).toBeUndefined();
	}
	expect(module.curriculum[0].content).toContain(
		sources["DPJ8-Architecture-Worked-Example/Main.java"].content.trim()
	);
});
it("shares core continuations, keeps the reference separate and preserves DPJ1 keys", () => {
	const core = javaArchitectureProjectKey(
		"design-patterns-in-java",
		javaArchitectureCoreID,
		"starter",
		javaArchitectureURL("starter")
	);
	for (const item of [
		javaArchitectureApplicationID,
		javaArchitectureExtensionID
	])
		expect(
			javaArchitectureProjectKey(
				"design-patterns-in-java",
				item,
				"starter",
				javaArchitectureURL("starter")
			)
		).toBe(core);
	const reference = javaArchitectureProjectKey(
		"design-patterns-in-java",
		javaArchitectureReadingID,
		"reference",
		javaArchitectureURL("solution")
	);
	expect(reference).not.toBe(core);
	for (const item of javaArchitectureReferenceItems)
		expect(
			javaArchitectureProjectKey(
				"design-patterns-in-java",
				item,
				"reference",
				javaArchitectureURL("solution")
			)
		).toBe(reference);
	for (const key of [core, reference]) {
		expect(javaNativeBuildInstructions(key)?.join("\n")).toContain(
			"-d classes @sources.txt"
		);
		expect(
			javaNativeBuildInstructions(
				key.replace(":native-java-architecture", "")
			)
		).toBeNull();
	}
	for (const role of ["starter", "reference"] as const) {
		const url = javaPatternsURL(
			"pricing",
			role === "starter" ? "starter" : "solution"
		);
		expect(
			javaArchitectureProjectKey(
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
		const url = javaCollaborationURL(
			role === "starter" ? "starter" : "solution"
		);
		expect(
			javaCollaborationProjectKey(
				"design-patterns-in-java",
				javaCollaborationCoreID,
				role,
				url
			)
		).toBe(
			javaCollaborationProjectKey(
				"design-patterns-in-java",
				javaCollaborationCoreID,
				role,
				url
			)
		);
	}
	for (const url of [
		javaArchitectureURL("starter") + "/extra",
		javaArchitectureURL("starter").replace(fixture.revision, "main"),
		javaArchitectureURL("starter").replace("Java-Level-3", "Other"),
		javaArchitectureURL("starter").replace("/starter", "/reference")
	]) {
		expect(javaArchitectureResource(url)).toBeNull();
		expect(javaArchitectureImportFiles(url)).toBeNull();
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
		module => module.id === javaArchitectureModuleID
	)!.curriculum[0];
	expect(reading.projectLink).toBe(javaArchitectureURL("example"));
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
		files.map(file => "DPJ8-Architecture-Worked-Example/" + file.name)
	);
	const project = createPythonIdeProject("java", {
		files,
		courseProjectKey: javaArchitectureProjectKey(
			"design-patterns-in-java",
			javaArchitectureReadingID,
			"starter",
			reading.projectLink!
		)
	});
	expect(project.activeFileName).toBe("Main.java");
	expect(
		javaNativeBuildInstructions(project.courseProjectKey)?.join("\n")
	).toContain("Architecture worked contracts: 39 passed");
	expect(
		javaNativeBuildInstructions(project.courseProjectKey)?.join("\n")
	).toContain("Main.java ContractTests.java");
	const archive = unzipSync(await createProjectArchive(project));
	expect(Object.keys(archive)).toHaveLength(3);
	for (const file of files) {
		expect(file.content).toBe(
			sources["DPJ8-Architecture-Worked-Example/" + file.name].content
		);
		const path = Object.keys(archive).find(path =>
			path.endsWith("/" + file.name)
		)!;
		expect(strFromU8(archive[path])).toBe(file.content);
	}
});

it("preserves Java service descriptor names while retaining path and mode boundaries", () => {
	const path = "META-INF/services/notes.plugins.TextPlugin";
	expect(normalizePythonFileName(path, ".java", "java")).toBe(path);
	expect(normalizePythonFileName(path)).toBe(path);
	expect(isValidPythonFileName(path, "java")).toBe(true);
	expect(isPythonIdeTextFile(path)).toBe(true);
	expect(isValidPythonFileName(path, "python")).toBe(false);
	for (const bad of [
		"../" + path,
		"/" + path,
		"META-INF//services/notes.plugins.TextPlugin",
		"META-INF/services/../notes.plugins.TextPlugin",
		"META-INF/services/.notes.plugins.TextPlugin",
		"META-INF/services/notes..TextPlugin",
		"META-INF/services/notes.plugins.TextPlugin/extra",
		"meta-inf/services/notes.plugins.TextPlugin",
		"META-INF/services/notes.plugins.TextPlugin" + String.fromCharCode(0)
	]) {
		expect(isValidPythonFileName(bad, "java"), bad).toBe(false);
	}
	expect(
		normalizePythonFileName("src/notes/domain/Note.java", ".java", "java")
	).toBe("src/notes/domain/Note.java");
	expect(isValidPythonFileName("src/notes/domain/Note.java", "java")).toBe(
		true
	);
});
