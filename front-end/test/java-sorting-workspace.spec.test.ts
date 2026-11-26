import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaElementarySortingModuleID,
	javaElementarySortingProjects,
	javaLevel3ProjectKey,
	javaMergeSortingModuleID,
	javaMergeSortingProjects,
	javaSearchImportFiles,
	javaSortingURL
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const units = [
	{
		id: javaElementarySortingModuleID,
		readingSlug: "selection-and-insertion-sort-core-concepts",
		projectCount: 2,
		readingCount: 4,
		projects: javaElementarySortingProjects
	},
	{
		id: javaMergeSortingModuleID,
		readingSlug: "merge-sort-core-concepts",
		projectCount: 3,
		readingCount: 2,
		projects: javaMergeSortingProjects
	}
];

describe("Java Level 3 sorting workspaces", () => {
	it("preserves earlier reading anchors and uses the exact role packs", async () => {
		setActivePinia(createPinia());
		const catalog = useCoursesStore();
		const learner = await catalog.loadCourseById("java-level-3");
		useAppStore().currentTutor = {
			coursePermissions: ["java-level-3"]
		} as never;
		const tutor = await catalog.loadCourseById("java-level-3");
		for (const unit of units) {
			const module = tutor?.modules.find(item => item.id === unit.id);
			if (!module) throw new Error("Missing sorting module " + unit.id);
			expect(
				module.curriculum.filter(item => item.projectLink)
			).toHaveLength(unit.projectCount);
			expect(
				module.curriculum.filter(item => item.contentKind === "reading")
			).toHaveLength(unit.readingCount);
			expect(module.curriculum[0]).toMatchObject({
				id: unit.id + "-curriculum-" + unit.readingSlug,
				aliases: expect.arrayContaining([
					unit.id + "-curriculum-core-concepts"
				])
			});
			const all = [...module.curriculum, ...module.supplementalProjects];
			const learnerModule = learner?.modules.find(
				item => item.id === unit.id
			);
			const learnerItems = [
				...(learnerModule?.curriculum ?? []),
				...(learnerModule?.supplementalProjects ?? [])
			];
			for (const project of unit.projects) {
				const item = all.find(entry => entry.id === project.id);
				const starter = javaSortingURL(project.pack, "starter");
				const reference = javaSortingURL(project.pack, "solution");
				expect(item, project.id).toMatchObject({
					ideImport: true,
					projectLink: starter,
					solutionLink: reference
				});
				expect(
					learnerItems.find(entry => entry.id === project.id)
						?.solutionLink
				).toBeUndefined();
				for (const [url, role] of [
					[starter, "starter"],
					[reference, "solution"]
				] as const) {
					expect(
						javaSearchImportFiles(url)?.map(
							entry => entry.file.path
						)
					).toEqual(
						["Main.java", "ContractTests.java", "README.md"].map(
							name => `${project.pack}/${role}/${name}`
						)
					);
				}
			}
		}
	});

	it("opens the integer merge workspace again for stable record merging", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("java-level-3");
		const merge = course?.modules.find(
			module => module.id === javaMergeSortingModuleID
		);
		const extension = merge?.supplementalProjects[0];
		const primary = javaMergeSortingProjects[0];
		const source = javaSortingURL(primary.pack, "starter");
		expect(extension?.id).toBe(
			javaMergeSortingModuleID +
				"-supplemental-extension-challenge-merge-sort"
		);
		expect(extension?.projectLink).toBe(source);
		const key = javaLevel3ProjectKey(
			"java-level-3",
			primary.id,
			"starter",
			source
		);
		expect(
			javaLevel3ProjectKey(
				"java-level-3",
				extension?.id ?? "",
				"starter",
				source
			)
		).toBe(key);
		expect(javaNativeBuildInstructions(key, source)?.join("\n")).toContain(
			"java ContractTests stable"
		);
	});
});
