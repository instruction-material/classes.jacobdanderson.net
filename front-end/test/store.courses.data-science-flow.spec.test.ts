import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
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

	it("attaches the available dataset to the first complete analysis studio", () => {
		const csvStudio = requireSourceModule(
			"DSP10 Applied Studio: CSV Summaries and Sanity Checks"
		);
		const summaryBuilder = csvStudio.curriculum.find(
			item => item.title === "CSV Summary Builder"
		);

		expect(summaryBuilder?.datasetLink).toBe(
			"https://static.classes.jacobdanderson.net/life_expectancy.csv"
		);
		expect(summaryBuilder?.content).toContain("**Provided dataset:**");
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
