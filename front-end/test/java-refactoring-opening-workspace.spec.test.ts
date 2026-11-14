import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "./fixtures/java-refactoring-opening-sources.json";
import originals from "./fixtures/java-refactoring-opening-identities.json";
import courseIdentities from "./fixtures/java-refactoring-published-course-identities.json";
import {
	javaRefactoringURL,
	javaRefactoringResource,
	javaRefactoringProjectKey,
	javaRefactoringFiles,
	javaRefactoringSourceItems,
	javaRefactoringCoreID,
	javaRefactoringModuleID,
	javaRefactoringReadingID
} from "@/modules/javaRefactoringResources";
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
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});
const sources: Record<string, { content: string; sha256: string }> =
	fixture.files;
it.each(["starter", "solution"] as const)(
	"preserves complete %s native source, edits, checkpoints and ZIPs",
	async role => {
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
			javaRefactoringURL(role),
			"java"
		);
		expect(files.map(file => file.name)).toEqual(javaRefactoringFiles);
		const folder = "DPR1-Safe-Refactoring-Packs/" + role + "/";
		expect(requested).toEqual(
			javaRefactoringFiles.map(name => folder + name)
		);
		for (const file of files) {
			const source = sources[folder + file.name];
			expect(file.content).toBe(source.content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(source.sha256);
		}
		const key = javaRefactoringProjectKey(
			"design-patterns-in-java-part-2",
			javaRefactoringCoreID,
			role === "starter" ? "starter" : "reference",
			javaRefactoringURL(role)
		);
		const project = createPythonIdeProject("java", {
			files,
			courseProjectKey: key
		});
		expect(project.activeFileName).toBe("Main.java");
		project.files.find(f => f.name === "CHECKPOINTS.md")!.content +=
			"\nExact green checkpoint retained\n";
		project.files.find(
			f => f.name === "src/loans/LoanDesk.java"
		)!.content += "\n// Saved structural step\n";
		project.files.push({
			name: "src/loans/experiment/Probe.java",
			content: "package loans.experiment; public final class Probe {}\n",
			encoding: "text"
		});
		project.files.find(f => f.name === "sources.txt")!.content +=
			"src/loans/experiment/Probe.java\n";
		await saveLocalPythonProjects([project]);
		expect(await loadLocalPythonProjects()).toEqual([project]);
		const zip = unzipSync(await createProjectArchive(project));
		expect(Object.keys(zip)).toHaveLength(10);
		for (const file of project.files) {
			const path = Object.keys(zip).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(zip[path])).toBe(file.content);
		}
	}
);
it("preserves all9original identities, complete teaching and eight input/answer pairs", async () => {
	setActivePinia(createPinia());
	const c = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java-part-2"
	))!;
	const module = c.modules.find(m => m.id === javaRefactoringModuleID)!;
	const raw = designPatternsInJavaPart2Course.modules.find(
		m => m.id === javaRefactoringModuleID
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
				raw[section].find(i => i.id === item.id)!.content.trim()
			);
			const links = [
				...item.content.matchAll(
					/\[[^\]]+\]\((\/course-resource\?[^)]+)\)/g
				)
			];
			expect(links).toHaveLength(
				item.id === javaRefactoringReadingID ? 0 : 2
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
			if (
				(javaRefactoringSourceItems as readonly string[]).includes(
					item.id
				)
			) {
				expect(item.projectLink).toBe(javaRefactoringURL("starter"));
				expect(item.solutionLink).toBeUndefined();
			} else expect(item.projectLink).toBeUndefined();
		}
	}
	expect(module.curriculum[0].contentKind).toBe("reading");
	for (const term of [
		"24190",
		"48380",
		"48389",
		"Duplicate Code",
		"Refused Bequest",
		"Shotgun Surgery",
		"Feature Envy",
		"cannot"
	]) {
		expect(module.curriculum[0].content).toContain(term);
	}
});
it("shares all six source continuations and retains separate permitted references", async () => {
	setActivePinia(createPinia());
	useAppStore().currentTutor = {
		coursePermissions: ["design-patterns-in-java-part-2"]
	} as never;
	const c = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java-part-2"
	))!;
	const items = c.modules.find(m => m.id === javaRefactoringModuleID)!;
	const all = [...items.curriculum, ...items.supplementalProjects].filter(i =>
		(javaRefactoringSourceItems as readonly string[]).includes(i.id)
	);
	const learner = new Set<string>(),
		references = new Set<string>();
	for (const item of all) {
		expect(item.solutionLink).toBe(javaRefactoringURL("solution"));
		const key = javaRefactoringProjectKey(
			c.id,
			item.id,
			"starter",
			item.projectLink!
		);
		const reference = javaRefactoringProjectKey(
			c.id,
			item.id,
			"reference",
			item.solutionLink!
		);
		learner.add(key);
		references.add(reference);
		expect(javaNativeBuildInstructions(key)).toContain(
			"java -cp classes ContractTests core"
		);
		expect(javaNativeBuildInstructions(reference)).not.toBeNull();
	}
	expect(all).toHaveLength(6);
	expect(learner.size).toBe(1);
	expect(references.size).toBe(1);
	expect([...learner][0]).not.toBe([...references][0]);
	expect(
		javaRefactoringResource(
			javaRefactoringURL("starter").replace(fixture.revision, "main")
		)
	).toBeNull();
});

it("retains all159published refactoring course item identities", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java-part-2"
	))!;
	let count = 0;
	for (const module of course.modules) {
		const expected =
			courseIdentities[module.id as keyof typeof courseIdentities];
		expect(expected, module.id).toBeDefined();
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			const metadata = module[section].map(({ id, title, aliases }) => ({
				id,
				title,
				...(aliases ? { aliases } : {})
			}));
			expect(metadata).toEqual(expected[section]);
			count += metadata.length;
		}
	}
	expect(course.modules).toHaveLength(14);
	expect(count).toBe(159);
});
