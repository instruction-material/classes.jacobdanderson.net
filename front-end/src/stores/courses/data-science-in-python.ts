import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { staticMediaUrl } from "./staticMedia";

const DATA_SCIENCE_LIFE_EXPECTANCY_DATASET = staticMediaUrl(
	"life_expectancy.csv"
);

interface AppliedDataScienceLab {
	number: number;
	title: string;
	focus: string;
	coreConcepts: string;
	example: string;
	coreProjectTitle: string;
	project: string;
	reviewTitle: string;
	review: string;
	extensionTitle: string;
	extension: string;
	supplemental2Title: string;
	supplemental2: string;
	supplemental3Title: string;
	supplemental3: string;
}

function stableVariantIndex(seed: string, count: number) {
	let hash = 2166136261;

	for (const character of seed) {
		hash ^= character.charCodeAt(0);
		hash = Math.imul(hash, 16777619) >>> 0;
	}

	return hash % count;
}

const appliedDataScienceLabs: AppliedDataScienceLab[] = [
	{
		number: 11,
		title: "DSP10 Applied Studio: CSV Summaries and Sanity Checks",
		focus: "CSV loading, numeric summaries, empty-dataset behavior, and sanity checks before a result is trusted.",
		coreConcepts:
			"This studio makes the smallest useful data pipeline explicit: load rows, convert text values into numbers, compute count, total, and mean, then verify that each number has the expected meaning. A summary is not just a calculator result; it is a claim about the rows that were actually read. Check the file path, column name, type conversion, row count, and empty-input behavior before interpreting the average.",
		example:
			"Trace a three-row CSV by hand before running the code. Write the expected list of values, expected total, expected count, and expected average, then compare that hand trace to the program output. Add one custom CSV with no rows or one row so the difference between normal data and boundary data is visible.",
		coreProjectTitle: "CSV Summary Builder",
		project:
			"Complete the CSV summary program so it returns accurate count, total, and average values for the provided data. Include safe empty-list behavior and one short verification note explaining how the expected output was checked.",
		reviewTitle: "Review: CSV Summaries and Sanity Checks",
		review: "Review the result by naming the exact file, column, values used, output dictionary, and boundary case. A strong review explains why the average is valid for the loaded rows and what would need to change if the CSV column name or units changed.",
		extensionTitle: "Min-Max and Outlier Extension",
		extension:
			"Extend the summary with minimum, maximum, and range. Then add one intentionally surprising value and explain whether it is a valid outlier, a data-entry error, or a value that requires more context before removal.",
		supplemental2Title: "Median and Mode Practice",
		supplemental2:
			"Create a second summary function for median and mode using the same loaded values. Compare mean and median on a balanced dataset and on a dataset with one extreme value.",
		supplemental3Title: "Readable Summary Report",
		supplemental3:
			"Create a small command-line report that prints the summary in readable sentences instead of a raw dictionary. Include the file name, row count, and one caution about interpreting the result."
	},
	{
		number: 12,
		title: "DSP11 Applied Studio: Cleaning Missing and Invalid Rows",
		focus: "Data validation, missing values, invalid numeric fields, cleaning logs, and the difference between dropping and repairing records.",
		coreConcepts:
			"Cleaning is an analytical decision, not a cosmetic step. Each missing or invalid value needs a classification before it is removed, replaced, or preserved. Track how many rows are affected and why the chosen cleaning rule is reasonable for the question being asked.",
		example:
			"Start with a small table containing one blank value, one nonnumeric value, one negative value, and several valid values. Predict which rows are accepted, rejected, or flagged, then run the cleaning code and compare the counts.",
		coreProjectTitle: "Cleaning Report Builder",
		project:
			"Adapt the CSV starter into a cleaner that returns valid numeric values plus a short cleaning report. Include rows loaded, rows accepted, rows rejected, and at least one reason for rejection.",
		reviewTitle: "Cleaning Rule Review",
		review: "Review the cleaning rule by explaining what it protects against and what it might accidentally remove. The conclusion names whether the cleaned dataset is still large and representative enough for the original question.",
		extensionTitle: "Safe Repair Rule Extension",
		extension:
			"Add a repair rule for one safe case, such as trimming whitespace or converting commas in numbers, while still rejecting values that cannot be justified.",
		supplemental2Title: "Data-Quality Checklist",
		supplemental2:
			"Build a data-quality checklist for a CSV before analysis begins. Include schema, units, missing values, duplicates, impossible values, and date or category consistency.",
		supplemental3Title: "Before-and-After Cleaning Summary",
		supplemental3:
			"Write a before-and-after cleaning summary that compares the original and cleaned datasets and identifies one conclusion that would change if invalid rows were kept."
	},
	{
		number: 13,
		title: "DSP12 Applied Studio: Grouped Summaries by Category",
		focus: "Grouping rows, category labels, per-group counts, per-group averages, and comparisons that avoid mixing unlike cases.",
		coreConcepts:
			"Grouped summaries answer different questions than whole-dataset summaries. Before comparing groups, verify the category column, group sizes, and whether each group has enough data to support a claim. A large difference in averages is less persuasive when one group contains only one row.",
		example:
			"Use a table with categories such as region, class period, product type, or team. Compute one overall average and then per-category averages. Compare the two outputs and identify what the overall average hides.",
		coreProjectTitle: "Grouped Summary Builder",
		project:
			"Extend the starter so values can be grouped by a category column and summarized per group. Each group reports count, total, and average, with sorted or formatted output so comparisons are easy to read.",
		reviewTitle: "Grouped Comparison Review",
		review: "Review the grouping by naming the strongest comparison and the weakest comparison. The strongest comparison has enough rows and a clear category meaning; the weakest may be distorted by small sample size or inconsistent labels.",
		extensionTitle: "Label Normalization Extension",
		extension:
			"Add a normalization step that merges inconsistent labels such as `north`, `North`, and `NORTH`, then explain how label cleanup changes the grouped result.",
		supplemental2Title: "Grouped Notebook Table",
		supplemental2:
			"Create a grouped-summary notebook cell that displays the same result as both a table and a short written interpretation.",
		supplemental3Title: "Second-Metric Comparison",
		supplemental3:
			"Add a second metric, such as median or maximum, and explain when that metric tells a better story than average."
	},
	{
		number: 14,
		title: "DSP13 Applied Studio: Visualization Choice and Chart Integrity",
		focus: "Selecting chart types, encoding variables honestly, labeling axes, avoiding misleading scales, and connecting visuals to a specific question.",
		coreConcepts:
			"A chart is an argument about the comparison being made. Choose bar charts for category comparison, line charts for ordered time-like trends, scatterplots for relationships between two numeric variables, and tables when exact values matter more than visual pattern. Every chart needs labels, units, and a sentence explaining the intended comparison.",
		example:
			"Create two possible charts for the same small dataset and decide which one better answers the question. Then intentionally remove an axis label or change the scale to see how quickly a technically correct chart can become misleading.",
		coreProjectTitle: "Chart Integrity Build",
		project:
			"Turn the summary output into one clear visualization with a title, labeled axes, and a short interpretation. The project is complete when the chart answers a named question and the explanation states one limitation of the visual.",
		reviewTitle: "Chart Integrity Review",
		review: "Review the visualization by checking whether the chart type matches the data types, whether labels and units are present, and whether the conclusion overstates what the chart proves.",
		extensionTitle: "Second-Question Chart Extension",
		extension:
			"Create a second chart that answers a different question from the same data, then compare which chart is better for exploration and which is better for presentation.",
		supplemental2Title: "Weak Chart Redesign",
		supplemental2:
			"Redesign a weak chart by improving labels, scale, color, ordering, or annotation while keeping the underlying data unchanged.",
		supplemental3Title: "Chart Critique",
		supplemental3:
			"Write a chart critique that identifies the intended audience, the visual claim, the evidence, and one way the chart could mislead a reader."
	},
	{
		number: 15,
		title: "DSP14 Applied Studio: Reproducible Mini Reports",
		focus: "Combining code, tables, charts, markdown conclusions, file paths, and rerun discipline into one reproducible analysis artifact.",
		coreConcepts:
			"A data report lets another reader rerun the analysis and understand the reasoning without asking what happened off screen. Keep imports visible, load data from a documented path, state the question, show the cleaned or summarized output, include one chart or table, and end with a conclusion plus limitation.",
		example:
			"Take a short analysis that only prints a dictionary and convert it into a mini report: question, data source, method, result table, interpretation, limitation, and next question. Restart and rerun to confirm there is no hidden state.",
		coreProjectTitle: "Reproducible Mini Report",
		project:
			"Create a mini report around the CSV starter. Include a question, a reproducible run path, the computed summary, one visual or formatted table, and a conclusion that does not exceed the evidence.",
		reviewTitle: "Mini Report Review",
		review: "Review the report by checking whether a reader can identify the data source, rerun the code, find the main result, and understand one important caveat.",
		extensionTitle: "Reproducibility Appendix",
		extension:
			"Add a small appendix that records package versions, file names, or command-line run instructions so the analysis can be repeated later.",
		supplemental2Title: "Script and Markdown Conversion",
		supplemental2:
			"Convert a notebook-style analysis into a script plus a short markdown report, preserving the same result while improving organization.",
		supplemental3Title: "Mini Report Peer Review",
		supplemental3:
			"Create a peer-review checklist for mini reports and apply it to one previous project."
	},
	{
		number: 16,
		title: "DSP15 Applied Studio: Lightweight Dashboards and Filters",
		focus: "Turning analysis outputs into a small interactive view with filtering, summary cards, and user-facing explanations.",
		coreConcepts:
			"A dashboard is useful when it helps a reader ask a focused follow-up question without editing the code. Keep the first version small: one dataset, one filter, one summary table or chart, and one explanation of what changes when the filter changes.",
		example:
			"Start with a printed summary, then add a simple filter such as category, date range, or minimum value. Compare the all-data result to the filtered result and explain what changed.",
		coreProjectTitle: "Filtered Dashboard Build",
		project:
			"Build a lightweight dashboard or console menu around the CSV analysis. The interface lets the user choose at least one filter and updates the summary output in a way that can be checked by hand on a small dataset.",
		reviewTitle: "Dashboard Behavior Review",
		review: "Review the dashboard by naming the user question it supports, the filter behavior, the default state, and one case where the interface warns that too little data remains.",
		extensionTitle: "Second Filter or Summary Card",
		extension:
			"Add a second filter or a summary card that updates with the selected data. Keep the explanation close to the output so the interface does not become a pile of disconnected widgets.",
		supplemental2Title: "Dashboard Test Plan",
		supplemental2:
			"Create a dashboard test plan with three scenarios: default data, a normal filter, and a filter that leaves no matching rows.",
		supplemental3Title: "Filtered Summary Export",
		supplemental3:
			"Add export behavior that writes the filtered summary to a small text or CSV report and verify the exported result."
	},
	{
		number: 17,
		title: "DSP16 Applied Studio: Capstone Data Story Readiness",
		focus: "Project scoping, dataset readiness, analysis question design, evidence selection, limitations, and presentation planning.",
		coreConcepts:
			"A capstone data story begins with a question that can be answered with available evidence. Before building the final artifact, confirm the dataset source, column meanings, cleaning needs, expected analysis steps, chart candidates, and likely limitations. A narrow, well-supported question is stronger than a broad claim with weak evidence.",
		example:
			"Compare two possible capstone questions for the same dataset. Identify which one has clearer columns, a better analysis path, fewer hidden assumptions, and a more realistic final output.",
		coreProjectTitle: "Capstone Readiness Brief",
		project:
			"Create a capstone readiness brief that defines the question, dataset, columns, cleaning plan, summary or visualization plan, evidence of correctness, and final presentation format. The brief is detailed enough to start the capstone without redesigning the whole project.",
		reviewTitle: "Capstone Scope Review",
		review: "Review the brief by checking whether the proposed claim can actually be supported by the dataset. If the question is too broad, revise it into a narrower comparison, trend, or relationship.",
		extensionTitle: "Tiny Capstone Prototype",
		extension:
			"Build a tiny prototype using five to ten rows or a filtered slice of the dataset to prove the full capstone path is feasible.",
		supplemental2Title: "Capstone Risk Register",
		supplemental2:
			"Create a risk register for the capstone with likely data problems, interpretation risks, and fallback plans.",
		supplemental3Title: "First Slide or README Section",
		supplemental3:
			"Create the first slide or README section for the capstone, including the question, why it matters, and what evidence will be shown."
	}
];

function dataScienceLabFolder(lab: AppliedDataScienceLab) {
	const labNumber = String(lab.number - 10).padStart(2, "0");
	return `DSP-${labNumber}-data-analysis-lab-${lab.number}`;
}

function dataScienceAppliedStudioUrl(
	lab: AppliedDataScienceLab,
	kind: "starter" | "solution"
) {
	return `https://github.com/instruction-material/Data-Science/tree/main/${dataScienceLabFolder(lab)}/${kind}`;
}

function dataScienceAppliedSupplementUrl(
	lab: AppliedDataScienceLab,
	supplementNumber: 2 | 3,
	kind: "starter" | "solution"
) {
	const baseNumber = 20 + (lab.number - 11) * 2 + (supplementNumber - 2);
	return `https://github.com/instruction-material/Data-Science/tree/main/DSP-${baseNumber}-applied-studio-${
		lab.number
	}-data-analysis-lab-${lab.number}-supplemental-${supplementNumber}/${kind}`;
}

function dataScienceAppliedTopic(lab: AppliedDataScienceLab) {
	return lab.title.replace(/^DSP\d+\s+Applied Studio:\s*/u, "");
}

function dataScienceStudioContent(
	lab: AppliedDataScienceLab,
	sectionTitle: string,
	body: string
) {
	const focus = lab.focus.replace(/[.!?]\s*$/, "");
	const resultQuality = [
		`**Result quality:** ${lab.title} states the question, input data, transformation, result, and limitation clearly enough to review without reading every line of code.`,
		`**Result quality:** ${sectionTitle} names the dataset, relevant columns, calculation or visual step, conclusion, and one caveat before treating the result as evidence.`,
		`**Result quality:** The ${lab.title} writeup separates source data, cleaning or transformation choices, computed result, interpretation, and limitation.`,
		`**Result quality:** ${sectionTitle} is complete when a reader can identify the question, the rows or features used, the evidence produced, and the boundary of the claim.`
	][stableVariantIndex(`${lab.number}|${sectionTitle}`, 4)];

	return [
		body,
		`**Verification focus:** ${focus}. Include one small hand-checkable case before accepting any larger dataset result.`,
		resultQuality
	].join("\n\n");
}

function applyDataScienceAppliedLabs(course: RawCourse) {
	for (const lab of appliedDataScienceLabs) {
		const legacyTitle = `Data Analysis Lab ${lab.number}: ${["Implementation", "Lab"].join(" ")}`;
		const practiceTitle = `Data Analysis Lab ${lab.number}: Practice Studio`;
		const module = course.modules.find(
			({ title }) =>
				title === legacyTitle ||
				title === practiceTitle ||
				title === lab.title
		);
		if (!module) continue;

		module.title = lab.title;
		module.curriculum = [
			{
				title: `${dataScienceAppliedTopic(lab)} Concepts`,
				aliases: ["Concept Path"],
				content: dataScienceStudioContent(
					lab,
					"Concept Path",
					[
						`**Focus:** ${lab.focus}`,
						lab.coreConcepts,
						`**Expected outcome:** A runnable ${lab.title} artifact plus a short written explanation that names the data source, the calculation or transformation, one verification case, and one limitation.`
					].join("\n\n")
				)
			},
			{
				title: `${dataScienceAppliedTopic(lab)} Worked Example`,
				aliases: ["Worked Example"],
				content: dataScienceStudioContent(
					lab,
					"Worked Example",
					lab.example
				)
			},
			{
				title: lab.coreProjectTitle,
				aliases: [`Core Project: ${dataScienceAppliedTopic(lab)}`],
				content: dataScienceStudioContent(
					lab,
					"Core Project",
					lab.project
				),
				projectLink: dataScienceAppliedStudioUrl(lab, "starter"),
				solutionLink: dataScienceAppliedStudioUrl(lab, "solution")
			},
			{
				title: lab.reviewTitle,
				aliases: [`Review: ${dataScienceAppliedTopic(lab)}`],
				content: dataScienceStudioContent(
					lab,
					"Review and Reflection",
					lab.review
				)
			}
		];
		module.supplementalProjects = [
			{
				title: lab.extensionTitle,
				aliases: [
					`Extension Challenge: ${dataScienceAppliedTopic(lab)}`
				],
				content: dataScienceStudioContent(
					lab,
					"Extension Challenge",
					lab.extension
				),
				projectLink: dataScienceAppliedStudioUrl(lab, "starter"),
				solutionLink: dataScienceAppliedStudioUrl(lab, "solution")
			},
			{
				title: lab.supplemental2Title,
				aliases: [`Transfer Practice: ${dataScienceAppliedTopic(lab)}`],
				content: dataScienceStudioContent(
					lab,
					"Supplemental Project 2",
					lab.supplemental2
				),
				projectLink: dataScienceAppliedSupplementUrl(lab, 2, "starter"),
				solutionLink: dataScienceAppliedSupplementUrl(
					lab,
					2,
					"solution"
				)
			},
			{
				title: lab.supplemental3Title,
				aliases: [
					`Extension Practice: ${dataScienceAppliedTopic(lab)}`
				],
				content: dataScienceStudioContent(
					lab,
					"Supplemental Project 3",
					lab.supplemental3
				),
				projectLink: dataScienceAppliedSupplementUrl(lab, 3, "starter"),
				solutionLink: dataScienceAppliedSupplementUrl(
					lab,
					3,
					"solution"
				)
			}
		];
	}
}

export const dataScienceInPythonCourse: RawCourse = {
	name: "Data Science in Python",
	modules: [
		{
			title: "DSP0 Setup and Tooling",
			curriculum: [
				{
					title: "Notebook-First and Script-First Workflow",
					content:
						"`Jupyter`, `VS Code`, `PyCharm`, and `Google Colab` are all acceptable workflows when the learning goals stay the same. Early lessons distinguish exploratory notebook work from cases where a script or small app structure is the better fit."
				},
				{
					title: "Python Packages for Data Work",
					content:
						"Install and verify `pandas`, `numpy`, `matplotlib`, `altair`, `streamlit`, and `scikit-learn` at the start. The course uses these tools in stages, and a stable environment keeps setup from interrupting the analysis flow."
				},
				{
					title: "Course Positioning between Python and Machine Learning",
					content:
						"This course bridges core Python and model-centered ML. The central work is loading, cleaning, inspecting, visualizing, and communicating with data before predictive systems enter the picture."
				},
				{
					title: "Analysis Habits and Reproducibility",
					content:
						"Use clear file naming, saved notebooks, lightweight markdown explanations, and explicit notes about assumptions. Reproducibility is part of data science itself, not an extra external requirement."
				},
				{
					title: "DSP0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "DSP0 Setup and Tooling",
						projectKind: "core",
						hasReference: false
					})
				}
			],
			supplementalProjects: [
				{
					title: "Reference Archive: Data Science in Python Workspace",
					aliases: [
						"Legacy Archive: Data Science in Python Workspace"
					],
					content:
						"The reference workspace is a course asset, not a replacement for the lesson sequence. It shows the expected folder layout, notebook and script organization, sample data locations, and completed variants that can be compared against current work. It is useful when a project needs a clean starter state, when a result needs to be checked against a known structure, or when an older classroom version explains a design choice that is still relevant. A useful comparison names the file being inspected, the input data it expects, the output it produces, and one limitation before copying any structure into current work.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main"
				},
				{
					title: "Setup and Tooling Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "DSP0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-dsp0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-dsp0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "DSP0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-dsp0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-dsp0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 1: What Data Science Is",
			curriculum: [
				{
					title: "Questions before Calculations",
					content:
						"Data science starts with answerable questions, relevant evidence, and clear communication about what the evidence can and cannot support. Begin every project with a question that matters more than the chart planned for the final output."
				},
				{
					title: "Evidence, Assumptions, and Scope",
					content:
						"Name where the data came from, what is missing, and what assumptions are being imposed during analysis. This helps prevent the common habit of treating a CSV file as a complete or neutral view of reality."
				},
				{
					title: "Data Science versus Machine Learning",
					content:
						"Separate descriptive analysis, visualization, and cleaning work from predictive modeling. Strong data science can provide real value before training any model."
				},
				{
					title: "Portfolio Mindset",
					content:
						"Frame the course around shareable outputs: notebooks, short writeups, dashboards, and presentations. The final goal is not merely to finish labs, but to build artifacts that show analytical thinking."
				},
				{
					title: "Module 1: What Data Science Is: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 1: What Data Science Is",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-1-what-data-science-is/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-1-what-data-science-is/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: What Data Science Is",
					content:
						"Keep a compact analysis log for what data science is that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about why the chosen question is worth answering with data in the first place. The log makes the question, assumptions, and value of the analysis visible before any code is judged.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-1-what-data-science-is/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-1-what-data-science-is/solution"
				},
				{
					title: "Module 1: What Data Science Is Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 1: What Data Science Is",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-module-1-what-data-science-is-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-module-1-what-data-science-is-supplemental-2/solution"
				},
				{
					title: "Module 1: What Data Science Is Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 1: What Data Science Is",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-module-1-what-data-science-is-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-module-1-what-data-science-is-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 2: Notebook Workflow and Reproducibility",
			curriculum: [
				{
					title: "Cells, Markdown, and Narrative Structure",
					content:
						"Notebooks are communication tools, not just places to run code. Combine code cells, markdown, and short conclusions so another person can follow the reasoning from question to result."
				},
				{
					title: "Restart-and-Run-All Discipline",
					content:
						"Make reproducibility visible by frequently restarting the kernel and rerunning the notebook from the top. This prevents hidden state from becoming part of the analysis and makes debugging much faster."
				},
				{
					title: "When to Graduate into Scripts or Apps",
					content:
						"A notebook has outgrown itself when repeated analysis, reusable functions, or user-facing outputs belong in a Python module, script, or dashboard app. Notebooks are ideal for exploration, but not always for long-term project structure."
				},
				{
					title: "Versioning Small Analyses",
					content:
						"Use lightweight Git or at least dated checkpoints for notebooks and datasets. Build the habit of saving iterations instead of overwriting analytical work with no trail."
				},
				{
					title: "Module 2: Notebook Workflow and Reproducibility: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 2: Notebook Workflow and Reproducibility",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-2-notebook-workflow-and-reproducibility/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-2-notebook-workflow-and-reproducibility/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Notebook Workflow and Reproducibility",
					content:
						"Keep a compact analysis log for notebook workflow and reproducibility that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which parts of the analysis are exploratory and which belong in stable steps. The log separates exploratory notebook work from stable steps that reproduce cleanly.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-2-notebook-workflow-and-reproducibility/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-2-notebook-workflow-and-reproducibility/solution"
				},
				{
					title: "Module 2: Notebook Workflow and Reproducibility Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 2: Notebook Workflow and Reproducibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-module-2-notebook-workflow-and-reproducibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-module-2-notebook-workflow-and-reproducibility-supplemental-2/solution"
				},
				{
					title: "Module 2: Notebook Workflow and Reproducibility Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 2: Notebook Workflow and Reproducibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-module-2-notebook-workflow-and-reproducibility-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-module-2-notebook-workflow-and-reproducibility-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 3: pandas Foundations",
			curriculum: [
				{
					title: "Loading CSVs and Inspecting Schema",
					content:
						"Use `pandas` to load tabular data, inspect columns, preview rows, and identify the shape of a dataset before deeper analysis begins. Stop treating raw data files as opaque blobs."
				},
				{
					title: "Selecting, Filtering, and Sorting",
					content:
						"Column selection, row filtering, sorting, and boolean masks form the basic grammar of tabular analysis. These operations become routine before grouping and aggregation are introduced."
				},
				{
					title: "Grouping and Aggregation",
					content:
						"Use grouped summaries to answer questions about segments, categories, and trends. Prefer a data-frame operation over a manual loop when it expresses the analytical intent more clearly."
				},
				{
					title: "Derived Columns and Transformations",
					content:
						"Create new columns from existing data, standardize labels, and compute simple metrics. This is the first place where analytical judgment starts to shape the dataset itself."
				},
				{
					title: "Module 3: pandas Foundations: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 3: pandas Foundations",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-3-pandas-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-3-pandas-foundations/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: pandas Foundations",
					content:
						"Keep a compact analysis log for pandas foundations that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which transformations are merely helpful and which ones materially change the meaning of the dataset. The log makes it possible to review both the calculation and the meaning of each transformation.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-3-pandas-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-3-pandas-foundations/solution"
				},
				{
					title: "Module 3: pandas Foundations Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 3: pandas Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-module-3-pandas-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-module-3-pandas-foundations-supplemental-2/solution"
				},
				{
					title: "Module 3: pandas Foundations Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 3: pandas Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-3-pandas-foundations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-3-pandas-foundations-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 4: Cleaning and Validation",
			curriculum: [
				{
					title: "Missing Values and Type Issues",
					content:
						"Inspect nulls, mixed types, empty strings, and malformed numeric data before building any chart or summary. Data cleaning protects evidence rather than serving as tedious prep work."
				},
				{
					title: "Duplicates and Inconsistent Categories",
					content:
						"Work through duplicate rows, inconsistent labels, whitespace issues, and accidental category splits. Small formatting defects can distort counts, averages, and rankings."
				},
				{
					title: "Validation Checks and Sanity Tests",
					content:
						"Use quick checks such as row counts, range bounds, category totals, and spot inspections of suspicious records. This catches silent errors before they become polished charts."
				},
				{
					title: "Documenting Cleaning Decisions",
					content:
						"Record what was dropped, changed, or imputed and why. A clean analysis includes a clean explanation of how the raw data was turned into something trustworthy enough to use."
				},
				{
					title: "Module 4: Cleaning and Validation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 4: Cleaning and Validation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-4-cleaning-and-validation/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-4-cleaning-and-validation/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Cleaning and Validation",
					content:
						"Keep a compact analysis log for cleaning and validation that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which cleaning decision had the biggest effect on the final answer. The log links the final answer back to the cleaning decisions that changed it most.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-4-cleaning-and-validation/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-4-cleaning-and-validation/solution"
				},
				{
					title: "Module 4: Cleaning and Validation Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 4: Cleaning and Validation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-4-cleaning-and-validation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-4-cleaning-and-validation-supplemental-2/solution"
				},
				{
					title: "Module 4: Cleaning and Validation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 4: Cleaning and Validation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-4-cleaning-and-validation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-4-cleaning-and-validation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 5: Visualization and Statistics in Context",
			curriculum: [
				{
					title: "Choosing the Right Chart",
					content:
						"Line, bar, scatter, histogram, box plot, and distribution views are tools for specific questions rather than decorations. Defend each chart choice in one sentence."
				},
				{
					title: "Misleading Scales and Weak Comparisons",
					content:
						"Compare intentionally weak charts to show how axis choices, poor bin sizes, inconsistent baselines, and decorative clutter can mislead viewers. This builds a stronger eye for honest presentation."
				},
				{
					title: "Averages, Spread, Correlation, and Outliers",
					content:
						"Descriptive statistics serve context. These measures can reveal useful structure, but a summary number can also hide important variation in the data."
				},
				{
					title: "Correlation Is Not Causation",
					content:
						"Keep causation claims disciplined by asking what the dataset can actually support. Write careful conclusions that do not overstate what a pattern proves."
				},
				{
					title: "Module 5: Visualization and Statistics in Context: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 5: Visualization and Statistics in Context",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Simple-Stats-Starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Simple-Stats"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Simple Stats Starter",
					content:
						"Start from a structured statistics starter and turn it into a working analysis that computes core summary measures cleanly. This is a direct warmup for later notebook-first investigations.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Simple-Stats-Starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Simple-Stats"
				},
				{
					title: "Project: Mode Finder",
					content:
						"Use a tight, focused statistics exercise to reinforce frequency tables, categorical reasoning, and the gap between raw counts and meaningful interpretation.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Mode"
				},
				{
					title: "Module 5: Visualization and Statistics in Context Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 5: Visualization and Statistics in Context",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-5-visualization-and-statistics-in-context-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-5-visualization-and-statistics-in-context-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 6: Storytelling with Data",
			curriculum: [
				{
					title: "Framing a Clear Analytical Claim",
					content:
						"Move from a vague topic like sports, movies, or weather into a crisp claim backed by evidence. Good data storytelling starts with a claim that can be tested and defended."
				},
				{
					title: "Selecting What Matters",
					content:
						"Choose which tables, plots, and metrics belong in the final explanation and which distract from the main question. This is where analysis becomes communication instead of accumulation."
				},
				{
					title: "Writing Short, Useful Conclusions",
					content:
						"Practice two- to four-sentence interpretations that connect a visual to an actual decision or insight. Avoid both chart dumping and dramatic overclaiming."
				},
				{
					title: "Audience-Aware Presentation",
					content:
						"Explain how the same data might be presented differently for a peer, a school club, an academic audience, or a portfolio reviewer. Tune explanations without changing the evidence."
				},
				{
					title: "Module 6: Storytelling with Data: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 6: Storytelling with Data",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Storytelling with Data",
					content:
						"Keep a compact analysis log for storytelling with data that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which part of the story is genuinely supported and which part is still only a hypothesis. The log separates supported claims from hypotheses that still need more evidence.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data/solution"
				},
				{
					title: "Module 6: Storytelling with Data Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 6: Storytelling with Data",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data-supplemental-2/solution"
				},
				{
					title: "Module 6: Storytelling with Data Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 6: Storytelling with Data",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-6-storytelling-with-data-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-6-storytelling-with-data-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 7: Dashboards with Altair and Streamlit",
			curriculum: [
				{
					title: "When Static Charts Stop Being Enough",
					content:
						"A notebook that only produces fixed outputs becomes limiting when the audience needs filtering, parameter changes, or rapid comparison. In those situations, a dashboard becomes the better communication tool."
				},
				{
					title: "Altair for Cleaner Chart Construction",
					content:
						"Declarative charting keeps the focus on encoding, axes, color, and interaction. Altair helps make chart structure explicit rather than buried in imperative plotting calls."
				},
				{
					title: "Streamlit for Interactive Exploration",
					content:
						"`Streamlit` wraps analyses in sliders, selectors, and filtered views. Dashboards are communication products, not just a fun extra."
				},
				{
					title: "Designing a Useful Analytical Interface",
					content:
						"Dashboard design needs restraint: clear controls, few charts, obvious labels, and a visible explanation of what the user is seeing. An overloaded dashboard is not a better dashboard."
				},
				{
					title: "Module 7: Dashboards with Altair and Streamlit: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 7: Dashboards with Altair and Streamlit",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-7-dashboards-with-altair-and-streamlit/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-7-dashboards-with-altair-and-streamlit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Dashboards with Altair and Streamlit",
					content:
						"Keep a compact analysis log for dashboards with Altair and Streamlit that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which interactions actually help the user answer the question faster. The log shows which controls sharpen the answer and which interactions only add noise.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-7-dashboards-with-altair-and-streamlit/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-7-dashboards-with-altair-and-streamlit/solution"
				},
				{
					title: "Module 7: Dashboards with Altair and Streamlit Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 7: Dashboards with Altair and Streamlit",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-7-dashboards-with-altair-and-streamlit-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-7-dashboards-with-altair-and-streamlit-supplemental-2/solution"
				},
				{
					title: "Module 7: Dashboards with Altair and Streamlit Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 7: Dashboards with Altair and Streamlit",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-15-module-7-dashboards-with-altair-and-streamlit-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-15-module-7-dashboards-with-altair-and-streamlit-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 8: Domain Projects",
			curriculum: [
				{
					title: "Pick a Domain with a Real Question",
					content:
						"Offer domain tracks such as sports, movies, finance, tutoring attendance, public weather data, or environmental datasets. The domain matters less than whether it leads to a specific question and a defensible analytical path."
				},
				{
					title: "Shape the Dataset to the Question",
					content:
						"Decide which columns matter, which records to filter, and what derived metrics are worth creating. This is the stage where an analysis becomes tailored rather than generic."
				},
				{
					title: "Compare Multiple Analytical Angles",
					content:
						"Include at least two complementary views of the same dataset, such as a trend chart plus a grouped comparison or a distribution plus a ranking. Learn that one chart rarely answers the whole question."
				},
				{
					title: "Make the Work Portfolio-Ready",
					content:
						"Package the project as a notebook, short deck, or dashboard with an introduction, method, findings, and reflection. The finished artifact is clear enough to show outside the class."
				},
				{
					title: "Module 8: Domain Projects: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 8: Domain Projects",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DM7-Simple-Sort"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Simple Sort and Ranking Warmup",
					content:
						"Use a compact sorting lab as a way to reason about ranking logic, ordering metrics, and what a leaderboard or sorted report is actually claiming about the data.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DM7-Simple-Sort"
				},
				{
					title: "Module 8: Domain Projects Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 8: Domain Projects",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-16-module-8-domain-projects-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-16-module-8-domain-projects-supplemental-2/solution"
				},
				{
					title: "Module 8: Domain Projects Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 8: Domain Projects",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-17-module-8-domain-projects-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-17-module-8-domain-projects-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 9: Data Science Capstone",
			curriculum: [
				{
					title: "Question, Dataset, and Scope Lock",
					content:
						"Finalize a capstone question, identify the dataset, and set a scope that can be finished well. Avoid open-ended ambition and instead commit to a question with a clear answer path."
				},
				{
					title: "Clean, Analyze, and Communicate",
					content:
						"Include the full pipeline: loading, cleaning, validation, analysis, visualization, and explanation. The capstone feels like a small real project rather than a disconnected set of charts."
				},
				{
					title: "Build a Dashboard or Narrative Notebook",
					content:
						"Choose the right final format for the question. Some capstones work better as a polished notebook with commentary; others work better as a compact Streamlit or Altair-backed dashboard."
				},
				{
					title: "Reflect on Next Steps",
					content:
						"The capstone reflection helps identify a next course such as `Machine Learning`, `AI Level 1`, `Web Development Foundations`, or a more advanced Python track. The reflection clarifies whether modeling, storytelling, or productizing data work is the strongest next direction."
				},
				{
					title: "Module 9: Data Science Capstone: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 9: Data Science Capstone",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-9-data-science-capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-9-data-science-capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Data Science Capstone",
					content:
						"Keep a compact analysis log for data science capstone that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about what claim the project ultimately makes and what evidence best supports it. The log turns the capstone into an evidence-backed argument rather than a collection of outputs.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-9-data-science-capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-9-data-science-capstone/solution"
				},
				{
					title: "Module 9: Data Science Capstone Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 9: Data Science Capstone",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-18-module-9-data-science-capstone-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-18-module-9-data-science-capstone-supplemental-2/solution"
				},
				{
					title: "Module 9: Data Science Capstone Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 9: Data Science Capstone",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-19-module-9-data-science-capstone-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-19-module-9-data-science-capstone-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 11: Practice Studio",
			curriculum: [
				{
					title: "Data Analysis Lab 11: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 11: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 11: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-data-analysis-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-data-analysis-lab-11/solution"
				},
				{
					title: "Data Analysis Lab 11: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 11: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-data-analysis-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-data-analysis-lab-11/solution"
				},
				{
					title: "Data Analysis Lab 11 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-20-applied-studio-11-data-analysis-lab-11-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-20-applied-studio-11-data-analysis-lab-11-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 11 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-21-applied-studio-11-data-analysis-lab-11-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-21-applied-studio-11-data-analysis-lab-11-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 12: Practice Studio",
			curriculum: [
				{
					title: "Data Analysis Lab 12: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 12: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 12: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-data-analysis-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-data-analysis-lab-12/solution"
				},
				{
					title: "Data Analysis Lab 12: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 12: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-data-analysis-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-data-analysis-lab-12/solution"
				},
				{
					title: "Data Analysis Lab 12 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-22-applied-studio-12-data-analysis-lab-12-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-22-applied-studio-12-data-analysis-lab-12-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 12 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-23-applied-studio-12-data-analysis-lab-12-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-23-applied-studio-12-data-analysis-lab-12-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 13: Practice Studio",
			curriculum: [
				{
					title: "Data Analysis Lab 13: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 13: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 13: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-data-analysis-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-data-analysis-lab-13/solution"
				},
				{
					title: "Data Analysis Lab 13: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 13: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-data-analysis-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-data-analysis-lab-13/solution"
				},
				{
					title: "Data Analysis Lab 13 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-24-applied-studio-13-data-analysis-lab-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-24-applied-studio-13-data-analysis-lab-13-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 13 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-25-applied-studio-13-data-analysis-lab-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-25-applied-studio-13-data-analysis-lab-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 14: Practice Studio",
			curriculum: [
				{
					title: "Data Analysis Lab 14: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 14: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 14: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-data-analysis-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-data-analysis-lab-14/solution"
				},
				{
					title: "Data Analysis Lab 14: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 14: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-data-analysis-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-data-analysis-lab-14/solution"
				},
				{
					title: "Data Analysis Lab 14 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-26-applied-studio-14-data-analysis-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-26-applied-studio-14-data-analysis-lab-14-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 14 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-27-applied-studio-14-data-analysis-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-27-applied-studio-14-data-analysis-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 15: Practice Studio",
			curriculum: [
				{
					title: "Data Analysis Lab 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-data-analysis-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-data-analysis-lab-15/solution"
				},
				{
					title: "Data Analysis Lab 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-data-analysis-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-data-analysis-lab-15/solution"
				},
				{
					title: "Data Analysis Lab 15 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-28-applied-studio-15-data-analysis-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-28-applied-studio-15-data-analysis-lab-15-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 15 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-29-applied-studio-15-data-analysis-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-29-applied-studio-15-data-analysis-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 16: Practice Studio",
			curriculum: [
				{
					title: "Data Analysis Lab 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-data-analysis-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-data-analysis-lab-16/solution"
				},
				{
					title: "Data Analysis Lab 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-data-analysis-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-data-analysis-lab-16/solution"
				},
				{
					title: "Data Analysis Lab 16 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-30-applied-studio-16-data-analysis-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-30-applied-studio-16-data-analysis-lab-16-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 16 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-31-applied-studio-16-data-analysis-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-31-applied-studio-16-data-analysis-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 17: Practice Studio",
			curriculum: [
				{
					title: "Data Analysis Lab 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-data-analysis-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-data-analysis-lab-17/solution"
				},
				{
					title: "Data Analysis Lab 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-data-analysis-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-data-analysis-lab-17/solution"
				},
				{
					title: "Data Analysis Lab 17 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-32-applied-studio-17-data-analysis-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-32-applied-studio-17-data-analysis-lab-17-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 17 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-33-applied-studio-17-data-analysis-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-33-applied-studio-17-data-analysis-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};

applyDataScienceAppliedLabs(dataScienceInPythonCourse);

interface DataScienceFlowConfig {
	title: string;
	estimatedTime: string;
	keyBlocks: string[];
	projectThread: string;
}

const DATA_SCIENCE_FLOW: DataScienceFlowConfig[] = [
	{
		title: "DSP0 Setup and Tooling",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"notebook / script choice",
			"package import",
			"data folder",
			"restart and rerun",
			"environment record"
		],
		projectThread:
			"Create one reproducible workspace that runs from a fresh start, records package and file assumptions, and keeps data, notebooks, scripts, and outputs in predictable locations."
	},
	{
		title: "Module 1: What Data Science Is",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"answerable question",
			"data provenance",
			"assumption",
			"descriptive vs predictive",
			"claim boundary"
		],
		projectThread:
			"Begin with a question and evidence inventory before choosing calculations or charts. The first artifact states the source, assumptions, intended audience, and what the data cannot establish."
	},
	{
		title: "Module 2: Notebook Workflow and Reproducibility",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"code cell",
			"markdown cell",
			"restart and run all",
			"relative path",
			"version checkpoint"
		],
		projectThread:
			"Build a notebook that reads top to bottom without hidden state, then rerun it from a clean kernel. Move repeated logic into a function or script only when that improves reproducibility."
	},
	{
		title: "Module 3: pandas Foundations",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"pd.read_csv()",
			"head() / info()",
			"boolean mask",
			"groupby()",
			"derived column"
		],
		projectThread:
			"Inspect schema and row counts before transforming data. Every filter, group, sort, and derived column must connect to the analytical question and retain a small hand-checkable example."
	},
	{
		title: "DSP10 Applied Studio: CSV Summaries and Sanity Checks",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"numeric conversion",
			"count / total / mean",
			"empty dataset",
			"hand trace",
			"sanity check"
		],
		projectThread:
			"Apply the first complete data pipeline to the provided life-expectancy CSV: load, convert, summarize, hand-check a small slice, and explain what the result does and does not represent."
	},
	{
		title: "Module 4: Cleaning and Validation",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"isna()",
			"duplicate check",
			"dtype conversion",
			"range validation",
			"cleaning log"
		],
		projectThread:
			"Profile missing, duplicated, malformed, and impossible values before changing them. Every drop, repair, or recode is counted and justified against the original question."
	},
	{
		title: "DSP11 Applied Studio: Cleaning Missing and Invalid Rows",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"accepted / rejected row",
			"validation reason",
			"safe repair",
			"before / after count",
			"representativeness"
		],
		projectThread:
			"Turn cleaning rules into an auditable report with rows loaded, accepted, rejected, and repaired. End by checking whether the cleaned data still supports the intended question."
	},
	{
		title: "DSP12 Applied Studio: Grouped Summaries by Category",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"category label",
			"group count",
			"group mean",
			"label normalization",
			"small-group warning"
		],
		projectThread:
			"Compare whole-dataset and grouped summaries, normalize inconsistent labels, and keep group sizes visible so an apparent difference is not separated from its denominator."
	},
	{
		title: "Module 5: Visualization and Statistics in Context",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"chart-data match",
			"axis and unit",
			"mean / median / spread",
			"outlier",
			"correlation limit"
		],
		projectThread:
			"Choose summaries and charts from the question and data types, not decoration. Test scale, labels, outliers, and alternative summaries before writing any interpretation."
	},
	{
		title: "DSP13 Applied Studio: Visualization Choice and Chart Integrity",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"bar / line / scatter",
			"axis label",
			"unit",
			"honest scale",
			"visual limitation"
		],
		projectThread:
			"Build one chart that answers a named question, then critique its type, encoding, scale, labels, and limitation. A technically rendered chart is not complete without an honest interpretation."
	},
	{
		title: "Module 6: Storytelling with Data",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"claim",
			"supporting evidence",
			"audience",
			"limitation",
			"next question"
		],
		projectThread:
			"Write the analytical claim only after selecting the evidence. Separate observation from explanation, match detail to the audience, and state one caveat beside the conclusion."
	},
	{
		title: "DSP14 Applied Studio: Reproducible Mini Reports",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"question",
			"data source",
			"method",
			"result table or chart",
			"conclusion and limitation"
		],
		projectThread:
			"Combine question, source, method, result, interpretation, and limitation into one rerunnable mini report. Restart and rerun before treating the report as finished."
	},
	{
		title: "Module 7: Dashboards with Altair and Streamlit",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Altair encoding",
			"Streamlit control",
			"filter state",
			"default view",
			"empty result"
		],
		projectThread:
			"Build the smallest useful interface around one analytical question. Every control must visibly change the relevant data or view and handle default and no-match states."
	},
	{
		title: "DSP15 Applied Studio: Lightweight Dashboards and Filters",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"one user question",
			"one filter",
			"summary card",
			"no-match warning",
			"scenario test"
		],
		projectThread:
			"Turn a known summary into a focused filtered view, then verify default data, a normal filter, and an empty result by hand before adding a second control or export."
	},
	{
		title: "Module 8: Domain Projects",
		estimatedTime: "3–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"domain question",
			"relevant columns",
			"two analytical views",
			"source note",
			"portfolio packaging"
		],
		projectThread:
			"Choose a domain because it supports a precise question and available evidence. Package two complementary analyses with source, method, result, limitation, and reproducible run notes."
	},
	{
		title: "DSP16 Applied Studio: Capstone Data Story Readiness",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"scope lock",
			"dataset readiness",
			"cleaning plan",
			"evidence plan",
			"risk and fallback"
		],
		projectThread:
			"Prove the capstone path on a tiny data slice before committing to the full build. The readiness brief links the question to columns, cleaning, analysis, visual evidence, limitations, and fallback scope."
	},
	{
		title: "Module 9: Data Science Capstone",
		estimatedTime: "6–10 sessions · 45–60 minutes each",
		keyBlocks: [
			"question and scope",
			"reproducible pipeline",
			"validated result",
			"notebook or dashboard",
			"presentation and reflection"
		],
		projectThread:
			"Build the approved narrow question through loading, cleaning, validation, analysis, visualization, and explanation. Ship a rerunnable artifact with a claim, evidence, limitation, and next question."
	}
];

const DATA_SCIENCE_CHALLENGE_TITLE_RE = /extension|tiny capstone/i;

function dataScienceSupplementalPath(
	item: Pick<RawCourseModuleItem, "title">
): CourseItemLearningPath {
	return DATA_SCIENCE_CHALLENGE_TITLE_RE.test(item.title)
		? "challenge"
		: "choice";
}

function configureDataScienceModule(
	module: RawCourseModule,
	config: DataScienceFlowConfig
) {
	for (const item of module.curriculum) item.learningPath = "core";
	for (const item of module.supplementalProjects) {
		item.learningPath = dataScienceSupplementalPath(item);
	}
	module.estimatedTime = config.estimatedTime;
	module.keyBlocks = [...config.keyBlocks];
	if (module.curriculum[0]) {
		module.curriculum[0].content = [
			module.curriculum[0].content,
			`**Course flow:** ${config.projectThread}`
		].join("\n\n");
	}
	return module;
}

function attachDataScienceDataset(course: RawCourse) {
	const studio = course.modules.find(
		module =>
			module.title ===
			"DSP10 Applied Studio: CSV Summaries and Sanity Checks"
	);
	const project = studio?.curriculum.find(
		item => item.title === "CSV Summary Builder"
	);
	if (!project) {
		throw new Error(
			"Data Science flow is missing the CSV Summary Builder."
		);
	}
	project.datasetLink = DATA_SCIENCE_LIFE_EXPECTANCY_DATASET;
	project.content = [
		project.content,
		`**Provided dataset:** ${DATA_SCIENCE_LIFE_EXPECTANCY_DATASET}`
	].join("\n\n");
}

function configureDataScienceFlow(course: RawCourse) {
	const modulesByTitle = new Map(
		course.modules.map(module => [module.title, module])
	);
	course.modules = DATA_SCIENCE_FLOW.map(config => {
		const module = modulesByTitle.get(config.title);
		if (!module) {
			throw new Error(`Data Science flow is missing ${config.title}.`);
		}
		return configureDataScienceModule(module, config);
	});
}

attachDataScienceDataset(dataScienceInPythonCourse);
configureDataScienceFlow(dataScienceInPythonCourse);
