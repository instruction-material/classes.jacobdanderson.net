import type { RawCourse, RawCourseModuleItem } from "./types";
import reading from "../../assets/course-guides/web-portfolio-modules-forms.md?raw";
import { webModulePortfolioRoot } from "../../modules/webProjectResources";

const id =
	"web-development-foundations-wdf3-stage-2-web-development-foundations";

export function applyWebPortfolioModuleWorkflow(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "web-development-foundations") return;
	const module = course.modules.find(
		row => row.title === "WDF3 Stage 2: Web Development Foundations"
	);
	if (!module) return;
	if (
		module.curriculum.length !== 3 ||
		module.supplementalProjects.length !== 3
	) {
		throw new Error(
			`Unexpected portfolio module activities: ${JSON.stringify({ curriculum: module.curriculum.map(row => row.title), optional: module.supplementalProjects.map(row => row.title) })}`
		);
	}
	module.id = id;
	module.title = "WDF3 Accessible Portfolio, Modules, and Forms";
	const [concepts, check, project] = module.curriculum;
	const [layout, transfer, challenge] = module.supplementalProjects;
	const update = (
		item: RawCourseModuleItem,
		suffix: string,
		title: string,
		content: string,
		path?: "core" | "choice" | "challenge"
	) => {
		item.id = `${id}-${suffix}`;
		item.title = title;
		item.content = content;
		item.preserveInstructions = true;
		item.learningPath = path;
		if (item.projectLink) {
			item.projectLink = `${webModulePortfolioRoot}/starter`;
			item.ideImport = true;
			if (path === "core")
				item.solutionLink = `${webModulePortfolioRoot}/solution`;
			else delete item.solutionLink;
		}
	};
	update(
		concepts,
		"curriculum-project-structure-and-front-end-workspace-habits",
		"Portfolio Modules and Form Validation",
		reading.trim()
	);
	update(
		check,
		"curriculum-web-development-foundations-core-concepts",
		"Application Check: Native Constraints and Script Results",
		"Compare an empty title with a title containing only spaces. Identify which input is rejected by the native required constraint and which reaches the JavaScript validator. Predict the error fields for an unknown projectType supplied directly to validateProjectIdea, then compare the observed result. Explain why a dropdown alone does not establish the function's input contract, why textContent displays markup literally, and why an omitted imported module can stop the original list and year updates as well as the form.\n\n**Checkpoints:** Retain each predicted error field, the actual validator result and focused control, and the list/year result after restoring the omitted module.",
		"core"
	);
	update(
		project,
		"curriculum-core-project-web-development-foundations",
		"Core Project: An Accessible Project-Idea Form",
		"Open the module edition of the portfolio as a separate saved project, retaining the WDF0-WDF2 attempt. Transfer intended portfolio content, add one original section, and implement validateProjectIdea in project-idea.js against the reading's exact field, trimming, type and length contract. Run the same supplied contract tests against the starter, then verify native constraints, whitespace-only input, all three project types, literal markup, error focus, repeated preview and clear. Check keyboard operation, visible focus, 200% zoom and 390/1280-pixel layouts. Build the selected workspace and repeat the form and asset checks in its local preview. Record observed results separately from predictions; public hosting and real personal data are unnecessary. The reference implements this form contract.",
		"core"
	);
	update(
		layout,
		"supplemental-project-portfolio-site-with-custom-domain-preparation",
		"Choice: Two Responsive Portfolio Layouts",
		"Continue the completed module-edition portfolio. Make a second CSS layout for the same project cards without changing semantic heading order or introducing extra focus stops. Compare both at 390 and 1280 CSS pixels and 200% zoom, including a long unbroken project title. Keep the clearer layout and record the reason from the observed result. The supplied code is the common starting point; this layout choice has no separate reference implementation.\n\n**Checkpoints:** Retain both viewport comparisons, original heading order, visible focus and the observed treatment of the longest title.",
		"choice"
	);
	update(
		transfer,
		"supplemental-web-foundations-transfer-practice",
		"Choice: A Checklist Data Module",
		"Continue the saved portfolio. Move deploymentChecklist from main.js into a new checklist.js file, export that array, and import it into main.js. Keep the original list text, order and year output. Save and export every module, then verify the source dependency request, fresh page and rebuilt preview. Explain why omitting checklist.js breaks the import before the script can update the page. Restore the file after the deliberate fault. The core reference does not include this optional refactor.\n\n**Checkpoints:** Include the new file, its matching import/export, the observed missing-file error and the corrected source and rebuilt-preview results.",
		"choice"
	);
	update(
		challenge,
		"supplemental-web-foundations-extension-practice",
		"Challenge: Public Configuration Across Builds",
		"In the native exercise workspace, use only fictional public text: add VITE_PORTFOLIO_LABEL=Local workshop to .env.local, then assign import.meta.env.VITE_PORTFOLIO_LABEL to a heading's textContent. Restart the development server after changing the environment file. Build once, change the label, and compare development with the existing built preview before rebuilding. Explain when each value is read. Keep .env.local out of Git and the IDE export; do not put any password, token or email credential in a VITE_ value. Return to the ordinary heading and remove the exercise file when finished. The supplied reference contains no environment file or implementation of this optional experiment.",
		"challenge"
	);
}
