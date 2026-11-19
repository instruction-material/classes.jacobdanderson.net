import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { dataScienceFoundationsProjectKey } from "@/modules/dataScienceFoundationsResources";
import { dataScienceInPythonCourse } from "@/stores/courses/data-science-in-python";
import { loadRawCourse } from "@/stores/courses/index";
import { useCoursesStore } from "@/stores/courses";

const EXPECTED_TEACHING_MODULES = [
	"DSP0 Setup and Tooling",
	"Module 1: What Data Science Is",
	"Module 2: Notebook Workflow and Reproducibility",
	"Module 3: pandas Foundations",
	"DSP10 Applied Studio: CSV Summaries and Sanity Checks",
	"Module 4: Cleaning and Validation",
	"DSP11 Applied Studio: Cleaning Missing and Invalid Rows",
	"DSP12 Applied Studio: Grouped Summaries by Category",
	"Module 5: Visualization and Statistics in Context",
	"DSP13 Applied Studio: Visualization Choice and Chart Integrity",
	"Module 6: Storytelling with Data",
	"DSP14 Applied Studio: Reproducible Mini Reports",
	"Module 7: Dashboards with Altair and Streamlit",
	"DSP15 Applied Studio: Lightweight Dashboards and Filters",
	"Module 8: Domain Projects",
	"DSP16 Applied Studio: Capstone Data Story Readiness",
	"Module 9: Data Science Capstone"
];

const PUBLISHED_APPLIED_STUDIO_MODULE_IDS = [
	"data-science-in-python-dsp10-applied-studio-csv-summaries-and-sanity-checks",
	"data-science-in-python-dsp11-applied-studio-cleaning-missing-and-invalid-rows",
	"data-science-in-python-dsp12-applied-studio-grouped-summaries-by-category",
	"data-science-in-python-dsp13-applied-studio-visualization-choice-and-chart-integrity",
	"data-science-in-python-dsp14-applied-studio-reproducible-mini-reports",
	"data-science-in-python-dsp15-applied-studio-lightweight-dashboards-and-filters",
	"data-science-in-python-dsp16-applied-studio-capstone-data-story-readiness"
];

function requireSourceModule(title: string) {
	const module = dataScienceInPythonCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Data Science module ${title}.`);
	return module;
}

describe("Data Science in Python learner flow", () => {
	it("assigns each lesson to one guidance file", () => {
		const files = import.meta.glob<
			{ module: string; group: string; title: string }[]
		>("../src/stores/courses/dataScience*GuidanceData.json", {
			eager: true,
			import: "default"
		});
		expect(Object.keys(files).length).toBeGreaterThan(1);
		const owners = new Map<string, string>();
		for (const [file, entries] of Object.entries(files)) {
			for (const { module, group, title } of entries) {
				const section =
					group === "curriculum" ? group : "supplementalProjects";
				const key = JSON.stringify([module, section, title]);
				expect(
					owners.get(key),
					`${title} appears again in ${file}`
				).toBeUndefined();
				owners.set(key, file);
			}
		}
	});

	it("gives each Domain Projects assignment a distinct starter", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"data-science-in-python"
		);
		const module = course!.modules.find(
			module => module.title === "Module 8: Domain Projects"
		)!;
		const core = module.curriculum.find(
			item => item.title === "Core Project: Domain Projects"
		)!;
		const warmup = module.supplementalProjects.find(
			item => item.title === "Project: Simple Sort and Ranking Warmup"
		)!;
		const transfer = module.supplementalProjects.find(
			item => item.title === "Transfer Practice: Domain Projects"
		)!;
		const extension = module.supplementalProjects.find(
			item => item.title === "Extension Practice: Domain Projects"
		)!;
		const projects = [core, warmup, transfer, extension];
		const keys = projects.map(item => {
			expect(item.contentKind).toBe("assignment");
			expect(item.projectLink).toBeDefined();
			expect(item.solutionLink).toBeUndefined();
			const key = dataScienceFoundationsProjectKey(
				"starter",
				item.projectLink!
			);
			expect(key).toMatch(/:starter:domain-v1$/);
			return key;
		});
		expect(new Set(keys).size).toBe(projects.length);
		expect(core.datasetLink).toMatch(/starter\/data\/sample\.csv$/);
		expect(warmup.datasetLink).toBeUndefined();
	});

	it("keeps the five practice projects optional with distinct role imports", async () => {
		const course = await loadRawCourse("data-science-in-python");
		const rawGuide = course!.modules.find(
			module => module.title === "Project Practice Guide"
		)!;
		setActivePinia(createPinia());
		const learner = await useCoursesStore().loadCourseById(
			"data-science-in-python"
		);
		const learnerGuide = learner!.modules.find(
			module => module.title === rawGuide.title
		)!;

		const sourceRoot =
			"https://github.com/instruction-material/Data-Science/tree/f61098dfc5e48ef13aeda2d138ffb49806f6ffdf";
		const names = [
			"public-dataset",
			"cleaning",
			"chart-redesign",
			"trend",
			"final"
		];
		expect(learnerGuide.supplementalProjects).toHaveLength(names.length);
		for (const [index, name] of names.entries()) {
			const item = learnerGuide.supplementalProjects[index];
			const folder = `DSP-practice-${name}`;
			const raw = rawGuide.supplementalProjects.find(
				candidate => candidate.title === item.title
			)!;
			expect(item.contentKind).toBe("assignment");
			expect(item.learningPath).toMatch(/^(choice|challenge)$/);
			expect(item.projectLink).toBe(`${sourceRoot}/${folder}/starter`);
			expect(item.solutionLink).toBeUndefined();
			expect(item.datasetLink).toContain(
				`/${folder}/starter/data/sample.csv`
			);
			expect(raw.solutionLink).toBe(`${sourceRoot}/${folder}/solution`);
			expect(
				dataScienceFoundationsProjectKey("starter", item.projectLink!)
			).toBe(`data-science-in-python:${folder}:starter:practice-v1`);
			expect(
				dataScienceFoundationsProjectKey("reference", raw.solutionLink!)
			).toBe(`data-science-in-python:${folder}:reference:practice-v1`);
		}
	});

	it("recognizes the published applied-studio progress IDs before title changes", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"data-science-in-python"
		);
		expect(course).not.toBeNull();
		for (const publishedModuleId of PUBLISHED_APPLIED_STUDIO_MODULE_IDS) {
			const module = course!.modules.find(candidate =>
				[candidate.id, ...(candidate.aliases ?? [])].includes(
					publishedModuleId
				)
			);
			expect(module, publishedModuleId).toBeDefined();
			const topicId = publishedModuleId.replace(
				/^data-science-in-python-dsp\d+-applied-studio-/,
				""
			);
			const historicalItems = [
				[module!.curriculum[2], `curriculum-core-project-${topicId}`],
				[module!.curriculum[3], `curriculum-review-${topicId}`],
				[
					module!.supplementalProjects[0],
					`supplemental-extension-challenge-${topicId}`
				],
				[
					module!.supplementalProjects[1],
					`supplemental-transfer-practice-${topicId}`
				],
				[
					module!.supplementalProjects[2],
					`supplemental-extension-practice-${topicId}`
				]
			] as const;

			for (const [item, historicalSuffix] of historicalItems) {
				expect(
					[item?.id, ...(item?.aliases ?? [])],
					`${publishedModuleId}-${historicalSuffix}`
				).toContain(`${publishedModuleId}-${historicalSuffix}`);
			}
		}
	});

	it("interleaves applied studios before the final capstone", () => {
		expect(
			dataScienceInPythonCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_TEACHING_MODULES);
		expect(
			dataScienceInPythonCourse.modules.some(
				module => module.title === "Static Data and Media Status"
			)
		).toBe(false);
	});

	it("gives every module pacing, evidence targets, and explicit paths", () => {
		for (const module of dataScienceInPythonCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("retains the full authored catalog while separating enrichment", () => {
		const requiredCount = dataScienceInPythonCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = dataScienceInPythonCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(78);
		expect(optionCount).toBe(51);
		expect(
			requireSourceModule(
				"DSP13 Applied Studio: Visualization Choice and Chart Integrity"
			).supplementalProjects.find(
				item => item.title === "Second-Question Chart Extension"
			)?.learningPath
		).toBe("challenge");
		expect(
			requireSourceModule(
				"Module 6: Storytelling with Data"
			).supplementalProjects.find(
				item => item.title === "Analysis Log: Storytelling with Data"
			)?.learningPath
		).toBe("choice");
	});

	it("places capstone readiness directly before capstone work", () => {
		const titles = dataScienceInPythonCourse.modules.map(
			module => module.title
		);
		expect(
			titles.indexOf(
				"DSP16 Applied Studio: Capstone Data Story Readiness"
			)
		).toBe(titles.indexOf("Module 9: Data Science Capstone") - 1);
		expect(
			requireSourceModule(
				"DSP16 Applied Studio: Capstone Data Story Readiness"
			).curriculum[0]?.content
		).toContain("tiny data slice");
	});

	it("retains the optional domain dataset separately from the bundled CSV exercise", async () => {
		const course = await loadRawCourse("data-science-in-python");
		const datasetReference = course!.modules
			.find(module => module.title === "Module 8: Domain Projects")
			?.curriculum.find(
				item => item.title === "Domain Projects Core Concepts"
			);
		expect(datasetReference?.datasetLink).toBe(
			"https://static.classes.jacobdanderson.net/life_expectancy.csv"
		);
		const summaryBuilder = course!.modules
			.find(
				module =>
					module.title ===
					"DSP10 Applied Studio: CSV Summaries and Sanity Checks"
			)
			?.curriculum.find(item => item.title === "CSV Summary Builder");
		expect(summaryBuilder?.datasetLink).toMatch(
			/\/starter\/data\/sample\.csv$/
		);
		expect(summaryBuilder?.content).toContain(
			"count 4, total 40 and average 10"
		);
	});

	it("keeps the normalized learner path free of asset backlog details", async () => {
		const course = await loadRawCourse("data-science-in-python");
		expect(course).not.toBeNull();

		const text = JSON.stringify(
			course!.modules.filter(module => module.kind !== "appendix")
		);
		expect(text).toContain(
			"https://static.classes.jacobdanderson.net/life_expectancy.csv"
		);
		expect(text).not.toContain("Data Science Asset Status");
		expect(text).not.toContain("building_permits.csv");
		expect(text).not.toContain("data_science_concept.png");
		const inventory = course!.modules.find(
			module => module.title === "Pending Source Media Inventory"
		);
		expect(inventory?.kind).toBe("appendix");
		expect(inventory?.curriculum[0]?.content).toContain(
			"building_permits.csv"
		);
	});
});
