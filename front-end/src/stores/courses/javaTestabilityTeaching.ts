import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaRefactoringUnitURL,
	javaTestabilityUnit
} from "@/modules/javaRefactoringUnits";
import { javaTestabilityLesson } from "./javaTestabilityLesson";

const entries: Array<
	RawCourseModuleItem & { caseSection: string | null; sourceProject: boolean }
> = [
	{
		id: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-testability-di-and-refactoring-with-confidence-core-concepts",
		title: "Testability, DI, and Refactoring with Confidence Core Concepts",
		aliases: [
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-core-concepts-and-learning-sequence",
			"core-concepts",
			"mini-lab-characterization-test-then-structural-change",
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-core-concepts",
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-mini-lab-characterization-test-then-structural-change"
		],
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "core",
		content: "__LESSON__",
		caseSection: null,
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-design-review-refactoring-pace-and-reviewability",
		title: "Design Review: Refactoring Pace and Reviewability",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Plan three reviewable changes to DispatchJournal: isolate time, isolate identifiers, then isolate output. Keep the default constructor and record(label,count) available after each change. Compare a private helper with an externally supplied dependency seam. Treat the retry wrapper as a separate new feature because the core still promises one output attempt.\n\n**Completion evidence:** For each step, retain its small source diff, baseline command/result, protected behavior promise and one rollback point. Explain which injected check becomes possible at that step and why a failing sink does not imply that an external effect was rolled back.",
		caseSection: "pace",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-reflection-question-what-let-you-move-faster-safely",
		title: "Reflection Question: What Let You Move Faster Safely?",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Choose one concrete dependency whose seam most reduced uncertainty in the supplied journal. Compare its original process-wide control with a fixed or recording collaborator. Use lamp(2), a fixed instant and ID 17 to explain one exact result, then repeat with an invalid label and count -1 to expose validation order.\n\n**Completion evidence:** Retain the before/after test setup, the observed call trace, a failure that the new check detects and a limitation of the fake. Explain why a passing fake-based test establishes the declared calls but does not establish a real external service's reliability.",
		caseSection: "confidence",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-legacy-side-effect-seam-catalog",
		title: "Legacy Side-Effect Seam Catalog",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Run ContractChecks baseline with assertions enabled and disabled, then run Main baseline. Record the actual time and ID in that capture and identify the fields that legitimately vary. Catalog the three side-effect seams in DispatchJournal and compare the frozen LegacyJournal entry point. Before editing, predict which dependency calls invalid input should make.\n\n**Completion evidence:** Retain the real capture, field-level promises, ordered label/count errors, dependency map and one small proposed extraction. Preserve returned Entry and console agreement. Name the test that protects default construction while the injectable constructor is added; a private extraction alone does not make time caller-controlled.",
		caseSection: "seams",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-characterization-test-quality-contract",
		title: "Characterization Test Quality Contract",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Write Probe.java as a separate check using the complete example in the reading, then add one valid Unicode/spaces case and one invalid-input/no-sink-call case. Supply Clock.fixed, an IntSupplier and a recording EntrySink. Preserve the frozen oracle and compile the probe alongside the completed candidate. Compare exact injected checks with the volatile default characterization.\n\n**Completion evidence:** Retain exact expected/observed output, constructor argument errors, clock/id/sink order and a failing-output cause. Demonstrate a changed-count defect that fails an explicit check under both assertion settings. Explain why broadly erasing changing text would also conceal meaningful behavior.",
		caseSection: "checks",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-core-project-testability-di-and-refactoring-with-confidence",
		title: "Core Project: Testability, DI, and Refactoring with Confidence",
		aliases: [
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-core-project",
			"dpr9-testability-di-and-refactoring-with-confidence-core-project",
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-dpr9-testability-di-and-refactoring-with-confidence-core-project"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Refactor DispatchJournal in src/journal while retaining its no-argument construction and record API. Add the Clock, IntSupplier and EntrySink constructor, validate constructor arguments in that order, and preserve label-before-count validation before all dependency calls. Obtain time, obtain the ID, write once and return the same immutable Entry. Keep frozen APIs, LegacyJournal, values and checks unchanged.\n\n**Completion evidence:** Run baseline/core with -ea and -da; retain the exact fixed-time/ID line, recording call order, invalid-input/no-call result and UncheckedIOException cause. Include a separate learner-written probe and explain the default constructor's assembly role. The optional normalization and retry tasks remain independent.",
		caseSection: "core",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-understanding-check-testability-di-and-refactoring-with-confidence",
		title: "Understanding Check: Testability, DI, and Refactoring with Confidence",
		aliases: [
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-dpr9-testability-di-and-refactoring-with-confidence-diagnostic-checkpoint",
			"diagnostic-checkpoint-testability-di-and-refactoring-with-confidence",
			"diagnostic-checkpoint",
			"understanding-check",
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-diagnostic-checkpoint-testability-di-and-refactoring-with-confidence",
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-diagnostic-checkpoint",
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-understanding-check"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"For the supplied journal, distinguish default characterization, an exact deterministic injected check and a recording fake. Explain why constructor injection works with no framework container, and identify the three dependencies and the assembly point. Compare AssertionError-based explicit checks with the Java assert keyword when assertions are disabled.\n\n**Completion evidence:** Use the fixed instant, ID 17 and lamp(2) to predict a returned Entry and sink line. Name one invalid-input check, one failed-output check and one fact about a real external service that a fake cannot prove. Explain why the optional retry changes behavior and requires its stated no-commit failure contract.",
		caseSection: "understanding",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-testability-di-and-refactoring-with-confidence-transfer-practice",
		title: "Testability, DI, and Refactoring with Confidence Transfer Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-transfer-practice-testability-di-and-refactoring-with-confidence",
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-transfer-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Complete CaptureNormalizer independently of the journal refactor. Accept one canonical four-field journal line with its final newline, validate every field and mask only the instant and ID. Preserve label spaces, punctuation, Unicode and count exactly. Reject malformed captures and noncanonical integers using the errors specified in the reading.\n\n**Completion evidence:** Run ContractChecks transfer with -ea and -da. Retain an actual default capture, its normalized approval, two valid volatile values that normalize identically, a changed-count counterexample and one malformed input. Explain why an empty approval or a rule removing every number hides defects. Journal and retry files may remain at starter.",
		caseSection: "transfer",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-testability-di-and-refactoring-with-confidence-extension-practice",
		title: "Testability, DI, and Refactoring with Confidence Extension Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-extension-practice-testability-di-and-refactoring-with-confidence",
			"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-extension-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Complete RetryingSink independently as an explicit new feature. With the supplied no-commit-on-IOException delegate contract, retry the same immutable Entry exactly once after an IOException. Preserve one call on first success or runtime failure, two calls on a transient failure and success, and two calls when both attempts fail. Propagate the second IOException and retain the first as suppressed when the objects differ.\n\n**Completion evidence:** Run ContractChecks extension under both assertion settings with recording fakes. Retain all four traces, null-argument checks and exception identities. Explain the idempotence or reconciliation requirement for a real partially writing or acknowledgment-losing sink. Keep the behavior-preserving core's one-attempt promise separate.",
		caseSection: "extension",
		sourceProject: true,
		preserveAssignment: true
	}
];
export function completeJavaTestability(
	module: RawCourseModule
): RawCourseModule {
	if (
		module.title !== "DPR9 Testability, DI, and Refactoring with Confidence"
	)
		return module;
	const complete = (entry: (typeof entries)[number]): RawCourseModuleItem => {
		const { caseSection, sourceProject, ...item } = entry;
		let content =
			item.content === "__LESSON__"
				? javaTestabilityLesson
				: String(item.content);
		if (caseSection) {
			content += `\n\n[Case inputs](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/testability-inputs.md#${
					caseSection
				}`
			)}) · [Project self-check](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/testability-answers.md#${
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
							javaTestabilityUnit.id,
							"starter"
						),
						solutionLink: javaRefactoringUnitURL(
							javaTestabilityUnit.id,
							"solution"
						)
					}
				: {})
		};
	};
	return {
		...module,
		id: javaTestabilityUnit.moduleID,
		curriculum: entries.slice(0, 6).map(complete),
		supplementalProjects: entries.slice(6).map(complete)
	};
}
