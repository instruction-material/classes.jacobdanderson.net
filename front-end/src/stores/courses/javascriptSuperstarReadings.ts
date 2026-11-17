import type { RawCourse, RawCourseModuleItem } from "./types";
import history from "./javascriptSuperstarMaintenanceItems.json";
import accumulators from "./readings/javascript-superstar/accumulators-and-functions.md?raw";
import advanced from "./readings/javascript-superstar/advanced-conditionals.md?raw";
import characters from "./readings/javascript-superstar/character-codes.md?raw";
import conditionals from "./readings/javascript-superstar/conditionals.md?raw";
import selectorsPractice from "./readings/javascript-superstar/css-selectors-practice.md?raw";
import flexboxPractice from "./readings/javascript-superstar/flexbox-practice.md?raw";
import forLoops from "./readings/javascript-superstar/for-loops.md?raw";
import operators from "./readings/javascript-superstar/operators-and-randomness.md?raw";
import variables from "./readings/javascript-superstar/variables-and-input.md?raw";
import whileLoops from "./readings/javascript-superstar/while-loops.md?raw";

const readings = [
	[
		"JSS1 Variables and Data Types",
		"Variables and Data Types Core Concepts",
		variables
	],
	["JSS2 Operators and Math", "Math Methods", operators],
	[
		"JSS3 For and While Loops",
		"JavaScript Level 1: JavaScript Superstar For Loops",
		forLoops
	],
	[
		"JSS3 For and While Loops",
		"JavaScript Level 1: JavaScript Superstar While Loops",
		whileLoops
	],
	[
		"JSS4 Combining Loops and Variables",
		"Combining Loops and Variables",
		accumulators
	],
	["JSS4 Combining Loops and Variables", "ASCII", characters],
	["JSS5 Conditionals", "Conditionals Core Concepts", conditionals],
	[
		"JSS6 Advanced Conditionals",
		"Advanced Conditionals Core Concepts",
		advanced
	]
] as const;

export function applyJavaScriptSuperstarReadings(
	course: RawCourse,
	rawCourse: RawCourse
) {
	const find = (moduleTitle: string, title: string) => {
		const module = course.modules.find(
			candidate => candidate.title === moduleTitle
		);
		const item = module?.curriculum.find(
			candidate => candidate.title === title
		);
		if (!item)
			throw new Error(`Missing JavaScript Superstar reading: ${title}`);
		return item;
	};
	const setText = (item: RawCourseModuleItem, content: string) => {
		item.content = content;
		item.preserveInstructions = true;
		item.preserveAssignment = true;
	};

	// Retain authored explanations after generic enrichment and display compaction.
	for (const module of course.modules) {
		const authored = rawCourse.modules.find(
			candidate => candidate.title === module.title
		);
		if (!authored) continue;
		const originals = [
			...authored.curriculum,
			...authored.supplementalProjects
		];
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			const names = new Set([item.title, ...(item.aliases ?? [])]);
			const original = originals.find(candidate =>
				names.has(candidate.title)
			);
			if (original) setText(item, original.content);
		}
	}
	for (const [moduleTitle, title, content] of readings) {
		const item = find(moduleTitle, title);
		setText(item, content);
		item.contentKind = "reading";
	}

	const checkpoint = rawCourse.modules.find(
		module => module.title === "Check-In #1"
	);
	if (!checkpoint) throw new Error("Missing JavaScript Superstar checkpoint");
	const groups = [
		[
			"JavaScript Level 1: JavaScript Superstar Check-In 1 Core Concepts",
			[
				"Check-In #1: Variables",
				"Check-In #1: Mathematical Operators and Randomness",
				"Check-In #1: Loops"
			]
		],
		[
			"Check-In 1 Application Check",
			[
				"Check-In #1: Conditionals",
				"Check-In #1: Drawing in JavaScript",
				"Check-In #1: Nested Loops"
			]
		]
	] as const;
	for (const [title, names] of groups) {
		const content = names
			.map(name => {
				const original = checkpoint.curriculum.find(
					item => item.title === name
				);
				if (!original) {
					throw new Error(
						`Missing JavaScript checkpoint task: ${name}`
					);
				}
				return `## ${name}\n\n${original.content}`;
			})
			.join("\n\n");
		setText(find("Check-In #1", title), content);
	}
	setText(
		find(
			"JSS15 Master Project",
			"Verification Review: JavaScript Superstar"
		),
		"Save the finished website and reopen the same project. Check every navigation target and interactive control, an empty or invalid form entry where input is accepted, and the layout at narrow and wide widths. Use the keyboard to reach controls and check the browser console for errors. Export the complete workspace and reopen its index.html with the accompanying files. Compare the result with the project requirements, then identify one correction and explain the JavaScript or CSS rule behind it."
	);

	const conceptTitles = new Set([
		"Introduction to Operators",
		"Introduction to D3",
		"Drawing Arcs",
		"Nested Loops",
		"Introduction to HTML",
		"The Box Model",
		"Introduction to CSS Grid",
		"Manipulating HTML with JavaScript",
		"JavaScript Components",
		"Recommended Next Course Path",
		"JavaScript Superstar Course Recap"
	]);
	for (const module of course.modules) {
		for (const item of module.curriculum) {
			if (conceptTitles.has(item.title)) item.contentKind = "reading";
		}
	}
	for (const title of [
		"JavaScript Level 1: JavaScript Superstar Check-In 1 Core Concepts",
		"Check-In 1 Application Check"
	]) {
		find("Check-In #1", title).contentKind = "assignment";
	}
	const htmlModule = course.modules.find(
		module => module.title === "JSS9 Introduction to HTML & CSS"
	);
	for (const [title, content] of [
		[
			"JSS9 Supplemental Project 1: Practice with CSS Selectors",
			selectorsPractice
		],
		["JSS9 Supplemental Project 2: Practice with Flexbox", flexboxPractice]
	]) {
		const item = htmlModule?.supplementalProjects.find(
			candidate => candidate.title === title
		);
		if (!item) throw new Error(`Missing JavaScript CSS practice: ${title}`);
		setText(item, content);
		item.contentKind = "assignment";
		delete item.datasetLink;
		delete item.mediaLink;
	}
	setText(
		find("Check-In #2", "Check-In #2: Website Layout"),
		"Compare a page section with a layout container, then build two small examples: a 3-by-3 CSS Grid with alternating colors and a 3-by-3 Materialize grid with numbers 1 through 9. Keep the HTML in row order and place the same numbers in the same positions in both versions. Use the version supplied with the workspace when choosing Materialize classes. Add one icon and show how its placement changes on a smaller screen.\n\nCompletion checks: each grid has exactly nine cells and three columns at its intended wide layout. Confirm that numbers remain legible at narrow widths and that the page stays within the viewport. Explain which CSS or library class sets each column's width, save the project and reopen the same attempt."
	);
	find("Check-In #2", "Check-In #2: Website Layout").contentKind =
		"assignment";

	// Keep maintenance records and historical progress identities outside the learner sequence.
	for (const module of course.modules) {
		if (module.kind === "appendix") module.internal = true;
	}

	for (const record of history) {
		const module = course.modules.find(
			candidate => candidate.title === record.module
		);
		const item = module?.supplementalProjects.find(
			candidate => candidate.title === record.title
		);
		if (!item) {
			throw new Error(
				`Missing historical JavaScript extension: ${record.title}`
			);
		}
		item.internal = true;
		item.preserveAssignment = true;
	}
}
