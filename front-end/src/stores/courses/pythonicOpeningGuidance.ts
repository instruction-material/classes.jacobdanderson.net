import type { RawCourse, RawCourseModuleItem } from "./types";
import opening from "./pythonicOpeningGuidanceData.json";

const folders = {
	callables:
		"PDP-01-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-2",
	registry:
		"PDP-02-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-3"
};
interface OpeningItem {
	kind: "reading" | "assignment";
	content: string;
	lab?: keyof typeof folders;
}

export function applyPythonicOpeningGuidance(
	course: RawCourse,
	progressId: (value: string) => string
) {
	const expected = new Set<string>();
	const seen = new Set<string>();
	for (const [title, items] of Object.entries(opening)) {
		for (const name of Object.keys(items)) expected.add(`${title}/${name}`);
	}
	for (const module of course.modules) {
		const items = (opening as Record<string, Record<string, OpeningItem>>)[
			module.title
		];
		if (!items) continue;
		const apply = (item: RawCourseModuleItem) => {
			const entry = items[item.title];
			if (!entry) {
				throw new Error(
					`Unreviewed Pythonic opening item: ${item.title}`
				);
			}
			seen.add(`${module.title}/${item.title}`);
			item.content = entry.content;
			item.contentKind = entry.kind;
			item.preserveInstructions = true;
			item.preserveAssignment = true;
			if (entry.lab) {
				const folder = folders[entry.lab];
				const url = `https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/${
					folder
				}`;
				item.projectLink = `${url}/starter`;
				item.solutionLink = `${url}/solution`;
				const params = new URLSearchParams({
					course: "pythonic-design-patterns",
					mode: "python",
					projectKey: `pythonic-design-patterns:${folder}:${
						item.title
					}:current-pack-v2`,
					starterUrl: item.projectLink,
					starterTitle:
						entry.lab === "callables"
							? "Callable comparison"
							: "Named callable registry",
					starterLabel: "Current learner starter",
					lesson: progressId(
						`pythonic-design-patterns-${module.title}`
					)
				});
				item.content += `\n\n[Open current learner pack separately](/ide?${params.toString()}). Confirming this import creates a separate saved project and retains the earlier attempt.`;
			} else {
				delete item.projectLink;
				delete item.solutionLink;
				delete item.ideImport;
			}
			return item;
		};
		module.curriculum = module.curriculum.map(apply);
		module.supplementalProjects = module.supplementalProjects.map(apply);
	}
	if (
		expected.size !== seen.size ||
		[...expected].some(key => !seen.has(key))
	) {
		throw new Error("Pythonic opening coverage drifted.");
	}
}
