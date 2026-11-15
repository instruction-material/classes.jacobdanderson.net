import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaMethodCallsUnit,
	javaRefactoringUnitURL
} from "@/modules/javaRefactoringUnits";
import { javaMethodCallsLesson } from "./javaMethodCallsLesson";

const entries: Array<
	RawCourseModuleItem & { caseSection: string | null; sourceProject: boolean }
> = [
	{
		id: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-simplifying-method-calls-core-concepts",
		title: "Simplifying Method Calls Core Concepts",
		aliases: [
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-core-concepts-and-learning-sequence",
			"core-concepts",
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-core-concepts"
		],
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "core",
		content: "__LESSON__",
		caseSection: null,
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-simplifying-method-calls-application-check",
		title: "Simplifying Method Calls Application Check",
		aliases: [
			"application-check",
			"mini-lab-reduce-call-site-noise-in-a-service-layer",
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-application-check",
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-mini-lab-reduce-call-site-noise-in-a-service-layer"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			'Run Main baseline and ContractChecks baseline from the starter. Predict all six client lines before running. Trace two modern quote calls, then two sends for Parcel("A",500,1), STANDARD and discount 0. Implement quote and send without changing the supplied log. Continue in the same required project.\n\n**Completion evidence:** Retain predictions, the six-line baseline, two equal quotes with no writes, two recorded sends and the total 280. Explain why send remains a command even though it returns the recorded quote.',
		caseSection: "baseline",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-reflection-question-what-makes-a-call-site-honest",
		title: "Reflection Question: What Makes a Call Site Honest?",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			'Compare price("A",500,1,false,null), quote(parcel,STANDARD) and send(parcel,STANDARD). Identify each method\u2019s input, result and effect. Explain the difference between grouping loose parcel data and passing an already available Parcel. Decide whether the old setter can be removed while the supplied client still calls it.\n\n**Completion evidence:** Give one concrete call for each API, its exact log effect and one migration decision. Explain which compatibility promise the unchanged source client verifies and which binary or reflection promises it leaves unverified.',
		caseSection: "judgment",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-public-api-compatibility-contract",
		title: "Public API Compatibility Contract",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Implement CompatibilityDesk.price while retaining its five-argument signature, constructor and setter. Keep ClientCompatibility.java unchanged. Convert accepted parcel inputs and speed, call send once, and translate only parcel-validation errors to -1. Compare baseline and core output. Change discount after the first send and confirm the earlier log remains.\n\n**Completion evidence:** Retain both identical six-line outputs, the before/after history and the invalid-input/no-write result. Show that a failed setter leaves the previous configuration usable. Record how a later deprecation could retire this boundary.",
		caseSection: "compatibility",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-null-optional-and-exception-boundary",
		title: "Null, Optional, and Exception Boundary",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Compare invalid required input with a valid missing lookup. Use null, blank and absent labels; null parcel and speed; invalid grams plus invalid zone; and missing log plus bad discount. Predict the first exception or sentinel for each API. Retain explicit public validation when assertions are disabled.\n\n**Completion evidence:** Record the supplied boundary table with exact class/message, Optional or null result and log effect. Explain why a null Optional, a blanket catch and returning an empty result for an invalid required input would each hide a different contract.",
		caseSection: "boundaries",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-core-project-simplifying-method-calls",
		title: "Core Project: Simplifying Method Calls",
		aliases: [
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-core-project",
			"dpr6-simplifying-method-calls-core-project",
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-dpr6-simplifying-method-calls-core-project"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Finish the three required TODOs in DispatchService and CompatibilityDesk. Preserve LegacyDesk, ClientCompatibility, supplied types/log and checks. Run ContractChecks baseline and core, with core under -ea and -da; compare both Main modes. Core reports 576 rows and 9266 explicit checks and works independently of the optional queue.\n\n**Completion evidence:** Retain commands, summaries and `REFACTORING.md`. Include two queries/no-write, one write per send, immutable earlier snapshot, shared history across configurations and latest duplicate-label lookup. Explain the API changes using the fourteen techniques and identify the choices that belong at a compatibility boundary.",
		caseSection: "core",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-understanding-check-simplifying-method-calls",
		title: "Understanding Check: Simplifying Method Calls",
		aliases: [
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-dpr6-simplifying-method-calls-diagnostic-checkpoint",
			"diagnostic-checkpoint-simplifying-method-calls",
			"diagnostic-checkpoint",
			"understanding-check",
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-diagnostic-checkpoint-simplifying-method-calls",
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-diagnostic-checkpoint",
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-understanding-check"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Diagnose four proposed changes: quote appends a log record; CompatibilityDesk calls quote instead of send; setDiscount creates a fresh log; and modern find returns null when absent. Use the smallest supplied cases exposing each regression.\n\n**Completion evidence:** Give four counterexamples with exact expected result and history. Classify the regression as a query effect, missing command, lost ownership history or broken absence contract.",
		caseSection: "diagnostic",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-simplifying-method-calls-transfer-practice",
		title: "Simplifying Method Calls Transfer Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-transfer-practice-simplifying-method-calls",
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-transfer-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Apply the same modern quote method to EXPRESS parcels in zone 3 at 500,501,1000 and 1001 grams with discount 25. Predict all four charges, then explain whether passing surchargeCents separately would improve the API. Compare a client that already owns a Parcel with one that only has three loose inputs.\n\n**Completion evidence:** Retain the four charges and band counts. Identify Parameterize Method, Replace Parameter with Method Call, Introduce Parameter Object and Preserve Whole Object in your two caller sketches. State the invariant that prevents contradictory speed/surcharge pairs.",
		caseSection: "transfer",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-simplifying-method-calls-extension-practice",
		title: "Simplifying Method Calls Extension Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-extension-practice-simplifying-method-calls",
			"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-extension-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"In a separate optional attempt, complete QueueClient.printNext using hasNext before remove. Preserve FIFO order, Optional return values and required-null errors. Run the optional baseline and full checks under -ea and -da. This queue has one owner and one thread.\n\n**Completion evidence:** Retain the A140/B505/empty sequence, counts 1/0/0, repeated-empty result, strict remove exception and null-queue exception. Explain why a concurrent queue would need an atomic operation rather than this check-then-act sequence.",
		caseSection: "extension",
		sourceProject: true,
		preserveAssignment: true
	}
];
export function completeJavaMethodCalls(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPR6 Simplifying Method Calls") return module;
	const complete = (entry: (typeof entries)[number]): RawCourseModuleItem => {
		const { caseSection, sourceProject, ...item } = entry;
		let content =
			item.content === "__LESSON__"
				? javaMethodCallsLesson
				: String(item.content);
		if (caseSection) {
			content += `\n\n[Case inputs](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/method-calls-inputs.md#${
					caseSection
				}`
			)}) · [Project self-check](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/method-calls-answers.md#${
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
							javaMethodCallsUnit.id,
							"starter"
						),
						solutionLink: javaRefactoringUnitURL(
							javaMethodCallsUnit.id,
							"solution"
						)
					}
				: {})
		};
	};
	return {
		...module,
		id: javaMethodCallsUnit.moduleID,
		curriculum: entries.slice(0, 6).map(complete),
		supplementalProjects: entries.slice(6).map(complete)
	};
}
