import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaBinarySearchModuleID,
	javaBinarySearchProjects,
	javaBinarySearchURL,
	javaCheckIn1ModuleID,
	javaCheckIn1Projects,
	javaCheckIn1URL,
	javaLevel3ProjectKey,
	javaSearchImportFiles,
	javaSearchProjects,
	javaSearchRevision,
	javaSearchURL
} from "@/modules/javaSearchResources";

describe("AJ5 native workspace", () => {
	it("preserves the main search key for the all-matches continuation", () => {
		const search = javaSearchProjects[0];
		const url = javaSearchURL(search.pack, "starter");
		const core = javaLevel3ProjectKey(
			"java-level-3",
			search.id,
			"starter",
			url
		);
		const continuation = javaLevel3ProjectKey(
			"java-level-3",
			"java-level-3-aj5-linear-search-and-big-o-notation-supplemental-extension-challenge-linear-search-and-big-o-notation",
			"starter",
			url
		);
		expect(continuation).toBe(core);
		expect(javaNativeBuildInstructions(core, url)).toContain(
			"javac --release 21 -Xlint:all -Werror Main.java ContractTests.java"
		);
		const reference = javaSearchURL(search.pack, "solution");
		expect(
			javaLevel3ProjectKey(
				"java-level-3",
				search.id,
				"reference",
				reference
			)
		).not.toBe(core);
	});

	it("uses the three files belonging to the exact source role and revision", () => {
		for (const project of javaSearchProjects) {
			for (const role of ["starter", "solution"] as const) {
				const url = javaSearchURL(project.pack, role);
				const files = javaSearchImportFiles(url);
				expect(files?.map(entry => entry.name)).toEqual([
					"Main.java",
					"ContractTests.java",
					"README.md"
				]);
				for (const entry of files ?? []) {
					expect(entry.file.path).toBe(
						`${project.pack}/${role}/${entry.name}`
					);
				}
				expect(
					javaSearchImportFiles(
						url.replace(/tree\/[^/]+/, "tree/main")
					)
				).toBeNull();
			}
		}
	});
});

describe("AJ6 native workspace", () => {
	it("attaches five exact starter and reference pairs to the established items", async () => {
		setActivePinia(createPinia());
		const catalog = useCoursesStore();
		const student = await catalog.loadCourseById("java-level-3");
		const studentModule = student?.modules.find(
			item => item.id === javaBinarySearchModuleID
		);
		expect(studentModule?.curriculum[1]?.projectLink).toBeTruthy();
		expect(studentModule?.curriculum[1]?.solutionLink).toBeUndefined();
		useAppStore().currentTutor = {
			coursePermissions: ["java-level-3"]
		} as never;
		const course = await catalog.loadCourseById("java-level-3");
		const module = course?.modules.find(
			item => item.id === javaBinarySearchModuleID
		);
		expect(module?.curriculum).toHaveLength(5);
		expect(module?.supplementalProjects).toHaveLength(3);
		const items = [
			...(module?.curriculum ?? []),
			...(module?.supplementalProjects ?? [])
		];
		const rolePaths = ["starter", "solution"] as const;
		for (const project of javaBinarySearchProjects) {
			const item = items.find(candidate => candidate.id === project.id);
			expect(item?.ideImport, project.id).toBe(true);
			expect(item?.learningPath, project.id).toEqual(
				project.id.includes("-curriculum-")
					? "core"
					: expect.stringMatching(/^(choice|challenge)$/u)
			);
			expect([item?.projectLink, item?.solutionLink]).toEqual(
				rolePaths.map(role => javaBinarySearchURL(project.pack, role))
			);
			for (const role of rolePaths) {
				const url = javaBinarySearchURL(project.pack, role);
				const files = javaSearchImportFiles(url);
				expect(files?.map(file => file.file.path)).toEqual(
					["Main.java", "ContractTests.java", "README.md"].map(
						filename => `${project.pack}/${role}/${filename}`
					)
				);
				expect(
					javaSearchImportFiles(
						url.replace(
							/tree\/[^/]+/u,
							`tree/${javaSearchRevision}`
						)
					)
				).toBeNull();
				const key = javaLevel3ProjectKey(
					"java-level-3",
					project.id,
					role === "starter" ? role : "reference",
					url
				);
				expect(javaNativeBuildInstructions(key, url)).toContain(
					"java ContractTests"
				);
			}
		}
		const main = module?.curriculum[1];
		const extension = module?.supplementalProjects[0];
		expect(extension?.id).toBe(
			`${javaBinarySearchModuleID}-supplemental-extension-challenge-binary-search`
		);
		expect(extension?.projectLink).toBe(main?.projectLink);
		expect(extension?.solutionLink).toBe(main?.solutionLink);
		if (!main || !extension)
			throw new Error("Missing iterative project or extension");
		const url = javaBinarySearchURL(
			javaBinarySearchProjects[0].pack,
			"starter"
		);
		const key = javaLevel3ProjectKey(
			"java-level-3",
			main.id,
			"starter",
			url
		);
		expect(
			javaLevel3ProjectKey("java-level-3", extension.id, "starter", url)
		).toBe(key);
		expect(
			javaNativeBuildInstructions(key, url)?.some(line =>
				line.includes("java ContractTests count")
			)
		).toBe(true);
	});
});

describe("Java Level 3 Check-In 1 workspace", () => {
	it("preserves the overview and four topic readings, role-aware projects and a shared extension", async () => {
		setActivePinia(createPinia());
		const catalog = useCoursesStore();
		const learner = await catalog.loadCourseById("java-level-3");
		const learnerModule = learner?.modules.find(
			item => item.id === javaCheckIn1ModuleID
		);
		expect(
			learnerModule?.curriculum.filter(item => !item.projectLink)
		).toHaveLength(5);
		expect(learnerModule?.curriculum[0]?.solutionLink).toBeUndefined();
		useAppStore().currentTutor = {
			coursePermissions: ["java-level-3"]
		} as never;
		const staff = await catalog.loadCourseById("java-level-3");
		const module = staff?.modules.find(
			item => item.id === javaCheckIn1ModuleID
		);
		if (!module) throw new Error("Missing the first Java check-in");
		expect(module.curriculum).toHaveLength(7);
		const [overview, workbook] = module.curriculum;
		expect(overview?.id).toBe(
			`${javaCheckIn1ModuleID}-curriculum-java-level-3-check-in-1-overview`
		);
		expect(overview?.contentKind).toBe("reading");
		expect(overview?.projectLink).toBeUndefined();
		expect(module.supplementalProjects).toHaveLength(3);
		for (const project of javaCheckIn1Projects) {
			const item = [
				...module.curriculum,
				...module.supplementalProjects
			].find(candidate => candidate.id === project.id);
			expect(item?.ideImport, project.id).toBe(true);
			expect(item?.projectLink).toBe(
				javaCheckIn1URL(project.pack, "starter")
			);
			expect(item?.solutionLink).toBe(
				javaCheckIn1URL(project.pack, "solution")
			);
			const entry = javaSearchImportFiles(item?.projectLink ?? "");
			expect(entry?.map(file => file.file.path)).toEqual(
				["Main.java", "ContractTests.java", "README.md"].map(
					name => `${project.pack}/starter/${name}`
				)
			);
		}
		const [extension] = module.supplementalProjects;
		expect(workbook?.projectLink).toBe(extension?.projectLink);
		expect(workbook?.solutionLink).toBe(extension?.solutionLink);
		const url = javaCheckIn1URL(javaCheckIn1Projects[0].pack, "starter");
		const key = javaLevel3ProjectKey(
			"java-level-3",
			javaCheckIn1Projects[0].id,
			"starter",
			url
		);
		expect(
			javaLevel3ProjectKey(
				"java-level-3",
				extension?.id ?? "",
				"starter",
				url
			)
		).toBe(key);
		expect(javaNativeBuildInstructions(key, url)?.join("\n")).toContain(
			"java ContractTests memo"
		);
		expect(javaNativeBuildInstructions(key, url)?.join("\n")).toContain(
			"java Main trace"
		);
	});
});
