import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaBubbleCheckIn2URL,
	javaBubbleSortArchiveID,
	javaBubbleSortProjects,
	javaCheckIn2ModuleID,
	javaCheckIn2Projects,
	javaLevel3ProjectKey,
	javaSearchImportFiles
} from "@/modules/javaSearchResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const units = [
	{
		id: javaBubbleSortArchiveID,
		projects: javaBubbleSortProjects,
		extension: "bubble-sort",
		command: "last"
	},
	{
		id: javaCheckIn2ModuleID,
		projects: javaCheckIn2Projects,
		extension: "check-in-2",
		command: "range"
	}
];

const extras: Partial<Record<string, string[]>> = {
	[javaBubbleSortProjects[1].id]: ["words.txt"],
	[javaCheckIn2Projects[1].id]: [
		"BubbleSort.java",
		"InsertionSort.java",
		"ListGenerator.java",
		"MergeSort.java",
		"SelectionSort.java",
		"Sort.java"
	]
};

it("keeps the archived and required sorting projects behind the established course paths", async () => {
	setActivePinia(createPinia());
	const catalog = useCoursesStore();
	const learner = await catalog.loadCourseById("java-level-3");
	useAppStore().currentTutor = {
		coursePermissions: ["java-level-3"]
	} as never;
	const tutor = await catalog.loadCourseById("java-level-3");
	for (const unit of units) {
		const module = tutor?.modules.find(entry => entry.id === unit.id);
		const learnerModule = learner?.modules.find(
			entry => entry.id === unit.id
		);
		if (!module || !learnerModule) throw new Error("Expected " + unit.id);
		if (unit.id === javaBubbleSortArchiveID) {
			expect(module.kind).toBe("appendix");
			expect(
				module.curriculum.filter(item =>
					/^Bubble Sort/u.test(item.title)
				)
			).toHaveLength(2);
			expect(
				module.curriculum.find(
					item => item.title === "Check-In #2: Bubble Sort"
				)?.content
			).toContain("java ContractTests bubble");
		} else {
			expect(
				module.curriculum.filter(item => item.contentKind === "reading")
			).toHaveLength(3);
			const historical = module.curriculum.find(item =>
				item.aliases?.includes(
					javaCheckIn2ModuleID + "-curriculum-core-concepts"
				)
			);
			expect(historical?.id).toBe(
				javaCheckIn2ModuleID +
					"-curriculum-java-level-3-check-in-2-core-concepts"
			);
		}
		const items = [...module.curriculum, ...module.supplementalProjects];
		const learnerItems = [
			...learnerModule.curriculum,
			...learnerModule.supplementalProjects
		];
		for (const project of unit.projects) {
			const item = items.find(entry => entry.id === project.id);
			const starter = javaBubbleCheckIn2URL(project.pack, "starter");
			const solution = javaBubbleCheckIn2URL(project.pack, "solution");
			expect(item, project.id).toMatchObject({
				ideImport: true,
				projectLink: starter,
				solutionLink: solution
			});
			expect(
				learnerItems.find(entry => entry.id === project.id)
					?.solutionLink
			).toBeUndefined();
			for (const [url, role] of [
				[starter, "starter"],
				[solution, "solution"]
			] as const) {
				const files = [
					"Main.java",
					"ContractTests.java",
					"README.md",
					...(extras[project.id] ?? [])
				];
				expect(
					javaSearchImportFiles(url)?.map(file => file.file.path)
				).toEqual(files.map(file => `${project.pack}/${role}/${file}`));
			}
		}
		const source = javaBubbleCheckIn2URL(unit.projects[0].pack, "starter");
		const continuation = module.supplementalProjects.find(
			item => item.projectLink === source
		);
		expect(continuation?.id).toContain(unit.extension);
		const key = javaLevel3ProjectKey(
			"java-level-3",
			unit.projects[0].id,
			"starter",
			source
		);
		expect(
			javaLevel3ProjectKey(
				"java-level-3",
				continuation?.id ?? "",
				"starter",
				source
			)
		).toBe(key);
		expect(javaNativeBuildInstructions(key, source)?.join("\n")).toContain(
			"java ContractTests " + unit.command
		);
	}
	const source = javaBubbleCheckIn2URL(
		javaCheckIn2Projects[1].pack,
		"starter"
	);
	const key = javaLevel3ProjectKey(
		"java-level-3",
		javaCheckIn2Projects[1].id,
		"starter",
		source
	);
	expect(javaNativeBuildInstructions(key, source)).toContain(
		"javac --release 21 -Xlint:all -Werror *.java"
	);
});
