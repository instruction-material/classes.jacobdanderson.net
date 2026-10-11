import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	getPythonIdeFileKindLabel,
	getPythonIdeDefaultFileContent,
	isPythonIdeTextFile,
	isValidPythonFileName,
	pythonIdeModeForCourseResource
} from "@/modules/pythonIde";
import {
	silverJavaPacks,
	silverJavaProjectKey
} from "@/modules/usacoSilverJavaPacks";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

describe("Silver native Java lessons", () => {
	beforeEach(() => setActivePinia(createPinia()));
	it("preserves placements, progress IDs and distinct transition/capstone purposes", async () => {
		for (const tutor of [false, true]) {
			useAppStore().currentTutor = tutor ? ({} as never) : null;
			const course =
				(await useCoursesStore().loadCourseById("usaco-silver"))!;
			expect(course.modules).toHaveLength(12);
			expect(
				course.modules.flatMap(module => module.curriculum)
			).toHaveLength(42);
			expect(
				course.modules.flatMap(module => module.supplementalProjects)
			).toHaveLength(106);
			for (const pack of silverJavaPacks)
				for (const assignment of pack.assignments) {
					const module = course.modules.find(
						module => module.id === assignment.moduleId
					)!;
					const item = module[assignment.section].find(
						item => item.id === assignment.itemId
					)!;
					expect(item.learningPath).toBe(assignment.learningPath);
					expect(item.title).toBe(assignment.title);
					expect(item.ideImport).toBe(true);
					expect(item.projectLink).toBe(
						`https://github.com/instruction-material/USACO-Silver/tree/${pack.revision}/${pack.folder}/starter`
					);
					if (tutor)
						expect(item.solutionLink).toBe(
							`https://github.com/instruction-material/USACO-Silver/tree/${pack.revision}/${pack.folder}/solution`
						);
					else {
						expect(item.solutionLink).toBeUndefined();
						expect(item.content).not.toContain("/solution");
					}
					for (const detail of [
						"Contract and reasoning",
						"Guided implementation",
						"Check and explain",
						"Open, save and run",
						pack.input,
						pack.mainFile,
						"JDK 17 or newer",
						"exits 2",
						"does not execute this native Java exercise"
					])
						expect(item.content).toContain(detail);
					if (assignment.variant === "core")
						expect(item.content).toContain(
							"Required implementation checkpoint"
						);
					else expect(item.content).toContain(pack.retry);
					if (assignment.variant === "log")
						expect(item.content).toContain("one Bronze habit");
					if (pack.slug === "gifts") {
						expect(item.content).toContain("Output IDs may repeat");
						expect(item.content).toContain(
							"protected Silver sets, postmortems or Gold readiness"
						);
					}
				}
		}
	});
	it("isolates only exact native source bindings and keeps other modes unchanged", () => {
		for (const pack of silverJavaPacks)
			for (const assignment of pack.assignments)
				for (const role of ["starter", "reference"] as const) {
					const base = `usaco-silver:${assignment.itemId}:${role}`;
					const source = `https://github.com/instruction-material/USACO-Silver/tree/${pack.revision}/${pack.folder}/${role === "reference" ? "solution" : "starter"}`;
					expect(
						silverJavaProjectKey(
							"usaco-silver",
							assignment.itemId,
							role,
							source
						)
					).toBe(base + ":native-java");
					expect(
						silverJavaProjectKey(
							"usaco-silver",
							assignment.itemId,
							role,
							source.replace(pack.revision, "main")
						)
					).toBe(base);
					expect(
						pythonIdeModeForCourseResource("usaco-silver", source)
					).toBe("java");
					const instructions = javaNativeBuildInstructions(
						base + ":native-java"
					)!.join("\n");
					expect(instructions).toContain(
						`-d target/classes ${pack.mainFile}`
					);
					expect(
						javaNativeBuildInstructions(base + ":other")
					).toBeNull();
					expect(
						javaNativeBuildInstructions(base + ":native-java:extra")
					).toBeNull();
					expect(
						javaNativeBuildInstructions(
							base.replace("usaco-silver", "usaco-gold")
						)
					).toBeNull();
					if (pack.slug === "gifts") {
						expect(instructions).toContain("Main < input.txt");
						expect(instructions).toContain("answer.tmp");
						expect(instructions).toContain(
							"Direct > answer.txt truncates"
						);
					}
				}
		expect(
			javaNativeBuildInstructions(
				"usaco-silver:other:starter:native-java"
			)
		).toBeNull();
	});
	it("retains native text fixtures while keeping traversal and binary names forbidden", () => {
		for (const name of [
			"sample.expected",
			"maxcross.expected",
			"cowdance.expected",
			"pom.xml"
		]) {
			expect(isValidPythonFileName(name)).toBe(true);
			expect(isPythonIdeTextFile(name)).toBe(true);
			expect(getPythonIdeFileKindLabel(name)).toBe("Text");
			expect(getPythonIdeDefaultFileContent(name)).toBe("");
		}
		expect(isValidPythonFileName("src/main/java/Main.java")).toBe(true);
		for (const name of [
			"../sample.expected",
			"/pom.xml",
			"src/pom.xml",
			"nested/sample.expected",
			"a.exe"
		])
			expect(isValidPythonFileName(name)).toBe(false);
	});
});
