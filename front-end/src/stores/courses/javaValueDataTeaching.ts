import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaRefactoringUnitURL,
	javaValueDataUnit
} from "@/modules/javaRefactoringUnits";
import { javaValueDataLesson } from "./javaValueDataLesson";

const entries: Array<
	RawCourseModuleItem & { caseSection: string | null; sourceProject: boolean }
> = [
	{
		id: "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-organizing-data-core-concepts",
		title: "Organizing Data Core Concepts",
		aliases: [
			"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-core-concepts-and-learning-sequence",
			"core-concepts",
			"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-core-concepts"
		],
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "core",
		content: javaValueDataLesson,
		sourceProject: false,
		caseSection: null
	},
	{
		id: "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-data-modeling-lab-upgrade-a-weak-domain-model",
		title: "Data Modeling Lab: Upgrade a Weak Domain Model",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Trace the supplied request LAB|1|PEN:2;PAD:1;PEN:3 from its parallel arrays to three RequestLine values. List the relationship protected by each new type. Start the existing starter with ContractTests base and Main; record 1673 passing baseline checks and the five supplied output lines.\n\nFinish ItemCode and RequestLine validation, then replace SupplyRequest's LegacySupplyRequest field with the typed representation. Keep the original constructor and client methods callable. Reject mismatched arrays before indexing them, preserve per-line validation order, and retain duplicate lines. Continue in the same saved project for the ownership and codec activities. \n\n**Completion evidence:** The completed representation must retain the client output and pass ContractTests core.",
		sourceProject: true,
		caseSection: "model",
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-reflection-question-when-is-a-primitive-no-longer-good-enough",
		title: "Reflection Question: When Is a Primitive No Longer Good Enough?",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			'Use the supplied destination LAB, item PEN, quantity 2 and service code 1. Explain which concepts need a named value type, which form one parameter object, and why the closed service classification fits ServiceLevel. Identify the invariant each proposed type owns.\n\n**Completion evidence:** Compare new ItemCode("PEN") with another separately constructed ItemCode("PEN"), and compare a value code with a mutable catalog entity having a persistent identity. State what equality and shared updates mean in each case. Explain why keeping destination as a checked String can be appropriate here, and describe a new requirement that would justify a destination type. This is a written reasoning check; it requires no new implementation.',
		sourceProject: false,
		caseSection: "primitive",
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-value-semantics-and-collection-ownership",
		title: "Value Semantics and Collection Ownership",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			'Implement SupplyRequest.fromLines and lines with an owned ordered snapshot. Use [RequestLine(ItemCode("PEN"),2)], create a request, then add PAD:1 through the caller\'s mutable list. The saved request must still have one line and remain findable as a HashMap key. Attempting to add or replace an element through lines() must raise UnsupportedOperationException.\n\n**Completion evidence:** Keep code/quantity array getters independent and preserve the original numeric hash calculation. Compare ordered equality, duplicate-line equality, and an equal request constructed from a transport row. A collection view cannot establish this ownership contract if its underlying mutable list remains shared. Run the supplied base and core modes after the representation change.',
		sourceProject: true,
		caseSection: "ownership",
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-data-migration-and-compatibility-check",
		title: "Data Migration and Compatibility Check",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			'Move transport interpretation into RequestCodec. Preserve three fields, canonical service/quantity text, empty-body requests and exact line order. Use LAB|0| and LAB|1|PEN:2;PAD:1 as valid round trips. Reject LAB|1, LAB|1||, LAB|01|, LAB|1|PEN:0 and a trailing empty entry with IllegalArgumentException("row").\n\n**Completion evidence:** Keep the old constructor/client methods as a conversion boundary for existing callers. Verify that malformed external rows expose the row error while direct constructor errors preserve their original field-specific order. Explain why split with a negative limit is needed for the empty final field. Run base and core without altering LegacySupplyRequest or ClientCompatibility.',
		sourceProject: true,
		caseSection: "migration",
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-core-project-organizing-data",
		title: "Core Project: Organizing Data",
		aliases: [
			"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-core-project",
			"dpr4-organizing-data-core-project",
			"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-dpr4-organizing-data-core-project"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Complete the supplied supply-request refactor. ItemCode validates a case-sensitive code; RequestLine binds code and quantity; ServiceLevel owns the finite dispatch rule; SupplyRequest owns immutable ordered values; RequestCodec preserves the old row boundary. Preserve all existing client methods, error order, line order, duplicates, getter ownership and the numeric hash calculation.\n\n**Completion evidence:** Retain the baseline and ClientCompatibility source. Export all 13 files, compile with Java 21 and warnings as errors, and run the 1673-check base and 1704-check completed core. Compare both Main modes with the five exact lesson lines. Record one mutation/lookup case and one malformed-row case in CHECKPOINTS.md. The optional merging feature can remain unfinished while this core passes.",
		sourceProject: true,
		caseSection: "core",
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-understanding-check-organizing-data",
		title: "Understanding Check: Organizing Data",
		aliases: [
			"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-dpr4-organizing-data-diagnostic-checkpoint",
			"diagnostic-checkpoint-organizing-data",
			"diagnostic-checkpoint",
			"understanding-check",
			"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-diagnostic-checkpoint-organizing-data",
			"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-diagnostic-checkpoint",
			"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-understanding-check"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Diagnose two proposed changes before editing the project. First, a record stores the caller's mutable List<RequestLine> directly and is inserted into a HashMap; the caller later adds another line. Second, equality compares the sets of lines instead of their ordered lists.\n\n**Completion evidence:** For each, state the broken invariant, a concrete input, the observable failure and the smallest repair. Include the distinct roles of final component references, immutable element values and a collection snapshot. Use the supplied ownership and ordering cases to check the reasoning; no extra implementation is required.",
		sourceProject: false,
		caseSection: "diagnostic",
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-organizing-data-transfer-practice",
		title: "Organizing Data Transfer Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-transfer-practice-organizing-data",
			"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-transfer-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			'Use the typed API to construct LAB/RUSH with PEN:2 followed by PAD:1. Construct an equivalent request through RequestCodec.decode("LAB|1|PEN:2;PAD:1"). Predict reference identity, value equality, hash equality and map lookup, then run those observations in the existing driver or a new package helper.\n\n**Completion evidence:** Repeat with the lines reversed and with the invalid lowercase code pen. Preserve the transport rejection message row and the typed ItemCode rejection message code. Record why two entry points can share a value contract without sharing parsing logic throughout the model. Continue the same saved core project; the reference\'s core contracts demonstrate these paths.',
		sourceProject: true,
		caseSection: "transfer",
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-organizing-data-extension-practice",
		title: "Organizing Data Extension Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-extension-practice-organizing-data",
			"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-extension-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "challenge",
		content:
			'After the representation-preserving core passes, implement the optional merged() feature. Combine duplicate codes in first-occurrence order and return a new request. LAB|1|PEN:2;PAD:1;PEN:3 becomes LAB|1|PEN:5;PAD:1, while the original remains unchanged.\n\n**Completion evidence:** Check empty input, a request with no duplicates, repeated merging, and PEN:999;PEN:1. The last case raises IllegalArgumentException("units") without changing the original. Retain all 1704 core checks and pass the complete 1709 checks. Keep this behavior change separate from the structural checkpoints in DECISIONS.md.',
		sourceProject: true,
		caseSection: "extension",
		preserveAssignment: true
	}
];
export function completeJavaValueData(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPR4 Organizing Data") return module;
	const complete = (entry: (typeof entries)[number]): RawCourseModuleItem => {
		const { caseSection, sourceProject, ...item } = entry;
		let content = String(item.content);
		if (caseSection) {
			content += `\n\n[Case inputs](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/value-data-inputs.md#${
					caseSection
				}`
			)}) · [Project self-check](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/value-data-answers.md#${
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
							javaValueDataUnit.id,
							"starter"
						),
						solutionLink: javaRefactoringUnitURL(
							javaValueDataUnit.id,
							"solution"
						)
					}
				: {})
		};
	};
	return {
		...module,
		id: javaValueDataUnit.moduleID,
		curriculum: entries.slice(0, 6).map(complete),
		supplementalProjects: entries.slice(6).map(complete)
	};
}
