import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaConditionalFlowUnit,
	javaRefactoringUnitURL
} from "@/modules/javaRefactoringUnits";
import { javaConditionalFlowLesson } from "./javaConditionalFlowLesson";

const entries: Array<
	RawCourseModuleItem & { caseSection: string | null; sourceProject: boolean }
> = [
	{
		id: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-simplifying-conditional-expressions-core-concepts",
		title: "Simplifying Conditional Expressions Core Concepts",
		aliases: [
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-core-concepts-and-learning-sequence",
			"core-concepts",
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-core-concepts"
		],
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "core",
		content: javaConditionalFlowLesson,
		caseSection: null,
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-simplifying-conditional-expressions-application-check",
		title: "Simplifying Conditional Expressions Application Check",
		aliases: [
			"application-check",
			"mini-lab-conditional-tangle-rescue",
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-application-check",
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-mini-lab-conditional-tangle-rescue"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Start the supplied nested baseline. Predict the approved LASER and supervised busy CNC outputs before running CoreDemo baseline. Record the returned reason/minutes and exact audit events in REFACTORING.md. Implement blocked and ready without changing short-circuit behavior. Continue the required guard-clause work in the same saved project.\n\n**Completion evidence:** Save both four-line demo outputs and a before/after trace for each helper. Identify the supervised case whose training probe stays absent, and explain why both helpers preserve the decision table.",
		caseSection: "baseline",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-reflection-question-when-does-a-conditional-signal-a-missing-type",
		title: "Reflection Question: When Does a Conditional Signal a Missing Type?",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Compare two changes: replacing the inactive denial OR with a helper, and moving machine-specific fee formulas into variants. Explain why only the latter needs the supplied fee interface. Name the factory dispatch that remains. Explain why guest, closed and busy are ordered decisions rather than interchangeable fee types. Use the supplied cases to support the distinction.\n\n**Completion evidence:** Classify all three cases by responsibility and variation. Identify the conditional that remains, the algorithm boundary that changes, and one observable contract each design must preserve.",
		caseSection: "judgment",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-decision-table-and-branch-equivalence-contract",
		title: "Decision Table and Branch-Equivalence Contract",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Complete the supplied decision table, including every denial, approval, overlapping conditions, skipped probes and validation errors. Compare baseline and core on all seven valid rows. Check that missing audit wins over missing machine and invalid duration. Preserve seed history and exactly one final event on every valid evaluation. Continue in the same saved required project.\n\n**Completion evidence:** Submit one row per valid reason, two overlapping-condition rows and both invalid-argument examples. Include the result, granted minutes and complete ordered event list, or the first exception.",
		caseSection: "decision-table",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-core-project-simplifying-conditional-expressions",
		title: "Core Project: Simplifying Conditional Expressions",
		aliases: [
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-core-project",
			"dpr5-simplifying-conditional-expressions-core-project",
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-dpr5-simplifying-conditional-expressions-core-project"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Finish GatePolicy.evaluate, blocked and ready. Preserve the supplied baseline, audit and stable caller. Recompile; run CoreChecks baseline and core, with core checked under both -ea and -da. The completed core reports 144000 rows and 576017 checks. Record the exact commands and output in REFACTORING.md. Core acceptance is independent of unfinished fee/reporter TODOs.\n\n**Completion evidence:** Retain the baseline and core summaries, unchanged client output, a reused-audit comparison and the rejected snapshot mutation. Explain one evaluation-order regression that the explicit checks would reject.",
		caseSection: "core",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-understanding-check-simplifying-conditional-expressions",
		title: "Understanding Check: Simplifying Conditional Expressions",
		aliases: [
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-dpr5-simplifying-conditional-expressions-diagnostic-checkpoint",
			"diagnostic-checkpoint-simplifying-conditional-expressions",
			"diagnostic-checkpoint",
			"understanding-check",
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-diagnostic-checkpoint-simplifying-conditional-expressions",
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-diagnostic-checkpoint",
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-understanding-check"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Diagnose four proposed rewrites: inactive uses AND; training is evaluated before supervision; finish is called twice; a missing required audit becomes a no-op. State the smallest input exposing each change, the expected reason/error and exact audit effect. Write a diagnosis for this understanding check.\n\n**Completion evidence:** Supply four counterexample requests and their expected baseline outcomes. For each proposed rewrite, identify whether it changes eligibility, event order, event count or required validation, and explain the failing observation.",
		caseSection: "diagnostic",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-simplifying-conditional-expressions-transfer-practice",
		title: "Simplifying Conditional Expressions Transfer Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-transfer-practice-simplifying-conditional-expressions",
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-transfer-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"For unsupervised STANDARD with an active level 0 member and 1 minute, explain why training must still be probed. Contrast a supervised CNC booking with insufficient training and a busy machine. Predict behavior when a too-long duration overlaps both conditions. Support each answer with the supplied decision order and events. This is a separate trace-and-judgment exercise.\n\n**Completion evidence:** Save all three predictions and exact ordered event lists. Name the first decisive condition in each case and explain which later probe would become incorrect if moved before that condition.",
		caseSection: "transfer",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-simplifying-conditional-expressions-extension-practice",
		title: "Simplifying Conditional Expressions Extension Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-extension-practice-simplifying-conditional-expressions",
			"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-extension-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "challenge",
		content:
			"Optional after the required core: this action imports a separate saved attempt. Copy the completed src/lab/GatePolicy.java from the core attempt into it. Implement the three FeePolicies variants and OptionalWorkflow using StatusReporter.none() for an absent observer. Preserve the required audit, guest denial, callback order and original exception. Run OptionalChecks baseline then full; the full reference reports 720 workflow rows and 2899 checks. Compare all fee boundaries and both reporter choices. Keep the original completed core attempt available.\n\n**Completion evidence:** Preserve the passing core, report five fee-boundary values, and compare observer-present, observer-absent and required-audit failure traces. Record the original exception that the workflow rethrows.",
		caseSection: "extension",
		sourceProject: true,
		preserveAssignment: true
	}
];
export function completeJavaConditionalFlow(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPR5 Simplifying Conditional Expressions")
		return module;
	const complete = (entry: (typeof entries)[number]): RawCourseModuleItem => {
		const { caseSection, sourceProject, ...item } = entry;
		let content = String(item.content);
		if (caseSection) {
			content += `\n\n[Case inputs](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/conditional-flow-inputs.md#${
					caseSection
				}`
			)}) · [Project self-check](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/conditional-flow-answers.md#${
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
							javaConditionalFlowUnit.id,
							"starter"
						),
						solutionLink: javaRefactoringUnitURL(
							javaConditionalFlowUnit.id,
							"solution"
						)
					}
				: {})
		};
	};
	return {
		...module,
		id: javaConditionalFlowUnit.moduleID,
		curriculum: entries.slice(0, 5).map(complete),
		supplementalProjects: entries.slice(5).map(complete)
	};
}
