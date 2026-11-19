import type { RawCourse, RawCourseModuleItem } from "./types";
import opening from "./pythonicOpeningGuidanceData.json";

const folders = {
	callables:
		"PDP-01-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-2",
	registry:
		"PDP-02-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-3",
	composition: "PDP-03-pdp2-design-foundations-in-python-supplemental-2",
	records: "PDP-04-pdp2-design-foundations-in-python-supplemental-3",
	pricing: "PDP1-Strategy-Rulebook",
	scoreRules: "PDP-05-pdp3-strategy-without-ceremony-supplemental-2",
	bestScores: "PDP-06-pdp3-strategy-without-ceremony-supplemental-3",
	reportKit: "PDP2-Factory-and-Builder-Config-Kit",
	immutableReport: "PDP-07-pdp4-factory-and-builder-in-python-supplemental-2",
	providers: "PDP-08-pdp4-factory-and-builder-in-python-supplemental-3",
	eventHub: "PDP3-Observer-Notification-Hub",
	eventSnapshot: "PDP-09-pdp5-observer-events-and-callbacks-supplemental-2",
	subscriptions: "PDP-10-pdp5-observer-events-and-callbacks-supplemental-3",
	wrapperToolkit: "PDP4-Decorator-Proxy-Facade-Toolkit",
	wrapperTrace: "PDP-11-pdp6-decorator-proxy-and-facade-supplemental-2",
	resourceStack: "PDP-12-pdp6-decorator-proxy-and-facade-supplemental-3",
	questLoop: "PDP5-State-Command-Quest-Loop",
	capturedQueue: "PDP-13-pdp7-state-and-command-supplemental-2",
	editorUndo: "PDP-14-pdp7-state-and-command-supplemental-3",
	leadPipeline: "PDP6-Adapter-Template-Import-Pipeline",
	measurementAdapter:
		"PDP-15-pdp8-adapter-and-integration-boundaries-supplemental-2",
	vendorBoundary:
		"PDP-16-pdp8-adapter-and-integration-boundaries-supplemental-3"
};
const labTitles: Record<keyof typeof folders, string> = {
	callables: "Callable comparison",
	registry: "Named callable registry",
	composition: "Composed notice delivery",
	records: "Owned mutable records",
	pricing: "Strategy Rulebook",
	scoreRules: "Configured Score Callables",
	bestScores: "Compare Named Score Rules",
	reportKit: "Factory and Builder Config Kit",
	immutableReport: "Immutable Report Construction",
	providers: "Provider Discovery Boundary",
	eventHub: "Observer Notification Hub",
	eventSnapshot: "Snapshot Event Fan-Out",
	subscriptions: "Owned Subscription Lifetime",
	wrapperToolkit: "Decorator, Proxy and Facade Toolkit",
	wrapperTrace: "Transparent Wrapper Order",
	resourceStack: "ExitStack Resource Lifecycle",
	questLoop: "State and Command Quest Loop",
	capturedQueue: "Captured Callable Queue",
	editorUndo: "Bounded Editor Undo",
	leadPipeline: "Adapter and Import Pipeline",
	measurementAdapter: "Versioned Measurement Adapter",
	vendorBoundary: "Injected Vendor Boundary"
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
					starterTitle: labTitles[entry.lab],
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
