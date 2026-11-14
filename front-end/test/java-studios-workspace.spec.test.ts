import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "./fixtures/java-studios-native-source.json";
import originals from "./fixtures/java-studios-published-identities.json";
import {
	javaStudios,
	javaStudioURL,
	javaStudioResource,
	javaStudioProjectKey,
	javaStudioImportFiles
} from "@/modules/javaStudioResources";
import {
	javaCapstoneCoreID,
	javaCapstoneURL,
	javaCapstoneProjectKey
} from "@/modules/javaCapstoneResources";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
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
const roles = javaStudios.flatMap(studio =>
	(["starter", "solution"] as const).map(role => ({ studio, role }))
);
it.each(roles)(
	"imports and preserves exact $studio.key $role sources through edit/save/export",
	async ({ studio, role }) => {
		vi.stubGlobal("crypto", webcrypto);
		const prefix =
			"https://raw.githubusercontent.com/" +
			fixture.repository +
			"/" +
			fixture.revision +
			"/";
		const requested: string[] = [];
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
			javaStudioURL(studio.key, role),
			"java"
		);
		expect(files.map(file => file.name)).toEqual(studio.files[role]);
		expect(requested).toEqual(
			studio.files[role].map(
				name => studio.pack + "/" + role + "/" + name
			)
		);
		for (const file of files) {
			const original =
				sources[studio.pack + "/" + role + "/" + file.name];
			expect(file.content).toBe(original.content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(original.sha256);
		}
		const key = javaStudioProjectKey(
			"design-patterns-in-java",
			studio.items[2],
			role === "starter" ? "starter" : "reference",
			javaStudioURL(studio.key, role)
		);
		const project = createPythonIdeProject("java", {
			files,
			courseProjectKey: key
		});
		expect(project.activeFileName).toBe("Main.java");
		project.files.find(file => file.name === "DECISIONS.md")!.content +=
			"\nMeasured responsibility boundaries\n";
		project.files.push({
			name: "src/studio/Probe.java",
			content: "package studio; public final class Probe {}\n",
			encoding: "text"
		});
		project.files.find(file => file.name === "sources.txt")!.content +=
			"src/studio/Probe.java\n";
		const old = createPythonIdeProject("java", {
			files: [
				{
					name: "Main.java",
					content: "// earlier work",
					encoding: "text"
				}
			],
			courseProjectKey: "existing"
		});
		await saveLocalPythonProjects([old, project]);
		expect(await loadLocalPythonProjects()).toEqual([old, project]);
		const archive = unzipSync(await createProjectArchive(project));
		expect(Object.keys(archive)).toHaveLength(
			studio.files[role].length + 1
		);
		for (const file of project.files) {
			const path = Object.keys(archive).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	}
);
it("retains all 22 published identities and complete teaching with concrete case/answer sections", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const module = course.modules.find(
		module => module.title === "Optional Applied Java Pattern Studios"
	)!;
	const raw = designPatternsInJavaCourse.modules.find(
		module => module.title === "Optional Applied Java Pattern Studios"
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
				raw[section][module[section].indexOf(item)].content.trim()
			);
			expect(item.content).not.toMatch(
				/build target to object roles|Keep .* concrete: the concept is complete/
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
				const text = readFileSync(
					resolve("public", path.slice(1)),
					"utf8"
				);
				expect(text).toContain("## " + anchor + "\n");
			}
		}
	}
	expect(
		module.supplementalProjects.filter(i => i.contentKind === "reading")
	).toHaveLength(6);
	expect(
		module.supplementalProjects.filter(i => i.contentKind === "assignment")
	).toHaveLength(15);
});
it.each(javaStudios)(
	"shares $key learner continuations and keeps references and other studios separate",
	studio => {
		const learner = studio.items.map(id =>
			javaStudioProjectKey(
				"design-patterns-in-java",
				id,
				"starter",
				javaStudioURL(studio.key, "starter")
			)
		);
		const reference = studio.items.map(id =>
			javaStudioProjectKey(
				"design-patterns-in-java",
				id,
				"reference",
				javaStudioURL(studio.key, "solution")
			)
		);
		expect(new Set(learner).size).toBe(1);
		expect(new Set(reference).size).toBe(1);
		expect(learner[0]).not.toBe(reference[0]);
		expect(javaNativeBuildInstructions(learner[0])).toContain(
			"java -cp classes ContractTests core"
		);
		expect(
			javaStudioResource(
				javaStudioURL(studio.key, "starter").replace(
					fixture.revision,
					"main"
				)
			)
		).toBeNull();
		expect(
			javaStudioImportFiles(
				javaStudioURL(studio.key, "solution") + "/nested"
			)
		).toBeNull();
	}
);
it("preserves the accepted capstone workspace fallback", () => {
	const url = javaCapstoneURL("starter");
	expect(
		javaStudioProjectKey(
			"design-patterns-in-java",
			javaCapstoneCoreID,
			"starter",
			url
		)
	).toBe(
		javaCapstoneProjectKey(
			"design-patterns-in-java",
			javaCapstoneCoreID,
			"starter",
			url
		)
	);
	expect(
		new Set(
			javaStudios.map(studio =>
				javaStudioProjectKey(
					"design-patterns-in-java",
					studio.items[2],
					"starter",
					javaStudioURL(studio.key, "starter")
				)
			)
		).size
	).toBe(3);
});
