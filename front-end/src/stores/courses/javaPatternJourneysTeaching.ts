import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaPatternJourneysUnit,
	javaRefactoringUnitURL
} from "@/modules/javaRefactoringUnits";
import { javaPatternJourneysLesson } from "./javaPatternJourneysLesson";

const entries: Array<
	RawCourseModuleItem & { caseSection: string | null; sourceProject: boolean }
> = [
	{
		id: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-refactoring-toward-patterns-core-concepts",
		title: "Refactoring Toward Patterns Core Concepts",
		aliases: [
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-core-concepts-and-learning-sequence",
			"core-concepts",
			"mini-lab-refactor-until-the-pattern-is-obvious",
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-core-concepts",
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-mini-lab-refactor-until-the-pattern-is-obvious"
		],
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "core",
		content: "__LESSON__",
		caseSection: null,
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-tradeoff-review-pattern-arrival-versus-pattern-forcing",
		title: "Tradeoff Review: Pattern Arrival Versus Pattern Forcing",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Compare the working notice conditional with the extracted method, static creator selection and subclass-based Factory Method. Use a third pipe-delimited creator and a caller-selected label ordering as change pressure. Then compare the fixed two-format requirement.\n\n**Completion evidence:** Retain exact before/after output, changed-file lists, the smallest useful stopping point, one cost of the larger design and a concrete trigger for simplifying it again.",
		caseSection: "tradeoffs",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-reflection-question-which-step-made-the-biggest-difference",
		title: "Reflection Question: Which Step Made the Biggest Difference?",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Perform the first row-method extraction in NoticeService before creating new types. Record which responsibility became easier to read or change. Compare that result with moving formatting into a product and centralizing the common traversal.\n\n**Completion evidence:** Preserve the last passing intermediate version, its baseline command/result and one example explaining which step delivered the largest improvement.",
		caseSection: "steps",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-pattern-arrival-evidence-and-exit-trigger",
		title: "Pattern Arrival Evidence and Exit Trigger",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Run Main baseline and ContractChecks baseline with assertions enabled and disabled. Predict the reversed bracket report for lamp(2),kit(3), then extract the creator/product, template and ordering seams one step at a time. Preserve validation order and the caller's list.\n\n**Completion evidence:** Retain passing intermediate checks, unchanged four-line output, a responsibility map and a justified arrival/exit decision. Distinguish the static selection function from the overridable creation method.",
		caseSection: "arrival",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-core-project-refactoring-toward-patterns",
		title: "Core Project: Refactoring Toward Patterns",
		aliases: [
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-core-project",
			"dpr8-refactoring-toward-patterns-core-project",
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-dpr8-refactoring-toward-patterns-core-project"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Complete the notice journey in src/notices. Extract NoticeLine, NoticeCreator, TextCreator, BracketCreator, Ordering, OriginalOrder and ReversedOrder; refactor NoticeService and update sources.txt. Keep frozen APIs, baseline, values and checks unchanged. Compare Main baseline/core and run ContractChecks core under -ea and -da.\n\n**Completion evidence:** Preserve both formats, both orderings, empty input, punctuation/Unicode, ordered invalid-input errors and unchanged caller data. Explain the retained boundary switch and demonstrate a third creator or ordering through the shared algorithm. Ticket and editor completion remain optional.",
		caseSection: "core",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-understanding-check-refactoring-toward-patterns",
		title: "Understanding Check: Refactoring Toward Patterns",
		aliases: [
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-dpr8-refactoring-toward-patterns-diagnostic-checkpoint",
			"diagnostic-checkpoint-refactoring-toward-patterns",
			"diagnostic-checkpoint",
			"understanding-check",
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-diagnostic-checkpoint-refactoring-toward-patterns",
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-diagnostic-checkpoint",
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-understanding-check"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Decide whether the fixed two-format renderer needs a creator hierarchy and whether the three-transition ticket needs polymorphic states. Identify what a static factory, Factory Method, Strategy, State, Adapter, Local Extension, Command and Memento each represent in the supplied examples.\n\n**Completion evidence:** Match each concept to its concrete operation and give one future requirement that earns an extra abstraction. Use a guard-only stopping point where the behavior is stable.",
		caseSection: "understanding",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-refactoring-toward-patterns-transfer-practice",
		title: "Refactoring Toward Patterns Transfer Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-transfer-practice-refactoring-toward-patterns",
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-transfer-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Complete the independent ticket project: move the current state code into TicketState enum objects, retain TicketAPI, ordered transitions, rejected-action results and immutable histories. Compare the same input sequences with GuardTicket and StrategyTicket.standard. Run ContractChecks transfer with both assertion settings.\n\n**Completion evidence:** Preserve the full DRAFT/READY/DONE table, the five-action worked trace, one invalid action with unchanged state and a prior history snapshot. Give a specific requirement favoring each of guards, a selectable policy and state-owned behavior. The notice/editor files can remain at starter.",
		caseSection: "transfer",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-refactoring-toward-patterns-extension-practice",
		title: "Refactoring Toward Patterns Extension Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-extension-practice-refactoring-toward-patterns",
			"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-extension-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Complete the independent editor project: wrap the supplied date API, adapt it to NoteDate, extract TextBuffer with opaque owner-bound Memento, encapsulate append in a command and move undo/redo stacks to CommandHistory. Keep Editor as the client facade. Update sources.txt and run ContractChecks extension with -ea and -da.\n\n**Completion evidence:** Preserve the dated two-line text, undo/redo trace, invalid append after undo, successful branch replacement, Unicode/newlines and Gregorian boundaries. Identify the different Command and Memento responsibilities; explain when a direct adapter or simple snapshot stacks are enough. Other projects can remain at starter.",
		caseSection: "extension",
		sourceProject: true,
		preserveAssignment: true
	}
];
export function completeJavaPatternJourneys(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPR8 Refactoring Toward Patterns") return module;
	const complete = (entry: (typeof entries)[number]): RawCourseModuleItem => {
		const { caseSection, sourceProject, ...item } = entry;
		let content =
			item.content === "__LESSON__"
				? javaPatternJourneysLesson
				: String(item.content);
		if (caseSection) {
			content += `\n\n[Case inputs](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/pattern-journeys-inputs.md#${
					caseSection
				}`
			)}) · [Project self-check](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/pattern-journeys-answers.md#${
					caseSection
				}`
			)})`;
		}
		return {
			...item,
			content,
			...(sourceProject
				? {
						ideImport: true,
						projectLink: javaRefactoringUnitURL(
							javaPatternJourneysUnit.id,
							"starter"
						),
						solutionLink: javaRefactoringUnitURL(
							javaPatternJourneysUnit.id,
							"solution"
						)
					}
				: {})
		};
	};
	return {
		...module,
		id: javaPatternJourneysUnit.moduleID,
		curriculum: entries.slice(0, 5).map(complete),
		supplementalProjects: entries.slice(5).map(complete)
	};
}
