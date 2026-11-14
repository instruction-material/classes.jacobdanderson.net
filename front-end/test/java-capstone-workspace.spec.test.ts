import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import MarkdownIt from "markdown-it";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../test/fixtures/java-capstone-sources.json";
import originals from "./fixtures/java-capstone-identities.json";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaCapstoneCoreID,
	javaCapstoneFiles,
	javaCapstoneImportFiles,
	javaCapstoneModuleID,
	javaCapstoneProjectKey,
	javaCapstoneReadingID,
	javaCapstoneResource,
	javaCapstoneURL,
	javaCapstoneWorkspaceItems
} from "@/modules/javaCapstoneResources";
import {
	javaJudgmentCoreID,
	javaJudgmentProjectKey,
	javaJudgmentURL
} from "@/modules/javaJudgmentResources";
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
	"preserves the complete %s role and new nested refactor files through save/ZIP",
	async role => {
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
		const files = await loadPythonIdeStarterFilesFromGitHub(
			javaCapstoneURL(role),
			"java"
		);
		expect(files.map(file => file.name)).toEqual(javaCapstoneFiles[role]);
		expect(files).toHaveLength(role === "starter" ? 13 : 18);
		const folder = "DPJ10-Dispatch-Refactor-Packs/" + role + "/";
		expect(requested).toEqual(
			javaCapstoneFiles[role].map(name => folder + name)
		);
		for (const file of files) {
			expect(file.content).toBe(sources[folder + file.name].content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(sources[folder + file.name].sha256);
		}
		const project = createPythonIdeProject("java", {
			files,
			courseProjectKey: "capstone-" + role
		});
		expect(project.activeFileName).toBe("Main.java");
		project.files.find(
			file => file.name === "src/dispatch/app/Desk.java"
		)!.content += "\n// Saved refactor checkpoint\n";
		project.files.find(file => file.name === "DECISIONS.md")!.content +=
			"\nMeasured rule locations\n";
		project.files.find(file => file.name === "CHECKPOINTS.md")!.content +=
			"\nBaseline identity retained\n";
		project.files.push({
			name: "src/dispatch/experiment/Probe.java",
			content:
				"package dispatch.experiment; public final class Probe {}\n",
			encoding: "text"
		});
		project.files.find(file => file.name === "sources.txt")!.content +=
			"\nsrc/dispatch/experiment/Probe.java\n";
		const old = createPythonIdeProject("java", {
			files: [
				{
					name: "Main.java",
					content: "// earlier work",
					encoding: "text"
				}
			],
			courseProjectKey: "legacy"
		});
		await saveLocalPythonProjects([old, project]);
		expect(await loadLocalPythonProjects()).toEqual([old, project]);
		const archive = unzipSync(await createProjectArchive(project));
		expect(Object.keys(archive)).toHaveLength(
			(role === "starter" ? 13 : 18) + 1
		);
		for (const file of project.files) {
			const path = Object.keys(archive).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	}
);
it("preserves all twelve capstone identities, complete reading bodies and eleven case pairs", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const module = course.modules.find(
		module => module.id === javaCapstoneModuleID
	)!;
	const raw = designPatternsInJavaCourse.modules.find(
		module => module.id === javaCapstoneModuleID
	)!;
	for (const section of ["curriculum", "supplementalProjects"] as const) {
		expect(
			module[section].map(({ id, title, aliases }) => ({
				id,
				title,
				...(aliases ? { aliases } : {})
			}))
		).toEqual(originals[section]);
		for (const item of module[section]) {
			expect(item.content).toBe(
				raw[section].find(row => row.id === item.id)!.content.trim()
			);
			expect(item.contentKind).toBe(
				item.id === javaCapstoneReadingID ? "reading" : "assignment"
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
	expect(module.curriculum).toHaveLength(9);
	expect(module.supplementalProjects).toHaveLength(3);
	for (const item of module.supplementalProjects.slice(0, 2)) {
		expect(item.projectLink).toBeUndefined();
		expect(item.solutionLink).toBeUndefined();
	}
	const reading = module.curriculum[0];
	expect(reading.projectLink).toBe(javaCapstoneURL("starter"));
	for (const name of [
		"Main.java",
		"src/dispatch/domain/Request.java",
		"src/dispatch/legacy/LegacyDesk.java"
	]) {
		expect(reading.content).toContain(
			sources[
				"DPJ10-Dispatch-Refactor-Packs/starter/" + name
			].content.trim()
		);
	}
	const md = new MarkdownIt({ linkify: true, html: false, breaks: true });
	const caseText = readFileSync(
		"public/course-assets/design-patterns-in-java/capstone-checks.md",
		"utf8"
	);
	for (const content of [reading.content, caseText]) {
		expect(md.render(content)).not.toMatch(
			/href="http:\/\/(?:README|CHECKPOINTS|DECISIONS)\.md"/i
		);
	}
});
it("shares the runnable baseline and followups while retaining an independent reference", () => {
	const learner = javaCapstoneProjectKey(
		"design-patterns-in-java",
		javaCapstoneCoreID,
		"starter",
		javaCapstoneURL("starter")
	);
	const reference = javaCapstoneProjectKey(
		"design-patterns-in-java",
		javaCapstoneReadingID,
		"reference",
		javaCapstoneURL("solution")
	);
	expect(reference).not.toBe(learner);
	for (const item of javaCapstoneWorkspaceItems) {
		expect(
			javaCapstoneProjectKey(
				"design-patterns-in-java",
				item,
				"starter",
				javaCapstoneURL("starter")
			)
		).toBe(learner);
		expect(
			javaCapstoneProjectKey(
				"design-patterns-in-java",
				item,
				"reference",
				javaCapstoneURL("solution")
			)
		).toBe(reference);
	}
	expect(javaNativeBuildInstructions(learner)?.join("\n")).toContain(
		"core reports 4854 passed"
	);
	expect(javaNativeBuildInstructions(reference)?.join("\n")).toContain(
		"java -cp classes ArchitectureTests"
	);
	for (const key of [learner, reference]) {
		expect(javaNativeBuildInstructions(key)?.join("\n")).toContain(
			"-d classes @sources.txt"
		);
		expect(
			javaNativeBuildInstructions(
				key.replace(":native-java-capstone", "")
			)
		).toBeNull();
	}
	for (const role of ["starter", "reference"] as const) {
		const url = javaJudgmentURL(
			role === "starter" ? "starter" : "solution"
		);
		expect(
			javaCapstoneProjectKey(
				"design-patterns-in-java",
				javaJudgmentCoreID,
				role,
				url
			)
		).toBe(
			javaJudgmentProjectKey(
				"design-patterns-in-java",
				javaJudgmentCoreID,
				role,
				url
			)
		);
	}
});
it("pins complete role imports to the exact verified repository revision", () => {
	for (const role of ["starter", "solution"] as const) {
		expect(
			javaCapstoneImportFiles(javaCapstoneURL(role))?.map(
				file => file.name
			)
		).toEqual(javaCapstoneFiles[role]);
	}
	for (const url of [
		javaCapstoneURL("starter") + "/extra",
		javaCapstoneURL("starter").replace(fixture.revision, "main"),
		javaCapstoneURL("starter").replace("Java-Level-3", "Other"),
		javaCapstoneURL("starter").replace("/starter", "/reference")
	]) {
		expect(javaCapstoneResource(url)).toBeNull();
		expect(javaCapstoneImportFiles(url)).toBeNull();
	}
});
