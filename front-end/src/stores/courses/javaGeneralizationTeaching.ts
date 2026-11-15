import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaGeneralizationUnit,
	javaRefactoringUnitURL
} from "@/modules/javaRefactoringUnits";
import { javaGeneralizationLesson } from "./javaGeneralizationLesson";

const entries: Array<
	RawCourseModuleItem & { caseSection: string | null; sourceProject: boolean }
> = [
	{
		id: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-dealing-with-generalization-core-concepts",
		title: "Dealing with Generalization Core Concepts",
		aliases: [
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-core-concepts-and-learning-sequence",
			"core-concepts",
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-core-concepts"
		],
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "core",
		content: "__LESSON__",
		caseSection: null,
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-dealing-with-generalization-application-check",
		title: "Dealing with Generalization Application Check",
		aliases: [
			"application-check",
			"mini-lab-repair-a-parallel-hierarchy",
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-application-check",
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-mini-lab-repair-a-parallel-hierarchy"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Run Main baseline and ContractChecks baseline. Predict the four printed lines for Ada(3 sessions), Bo(4 sessions,2 mentoring slots) and North Lab. Draw the member/formatter pairs: Volunteer with VolunteerFormatter, Mentor with MentorFormatter. Extract Member and LineSource, move the common layout to Member.line and retire the three formatter files. Keep public enrollment calls unchanged.\n\n**Completion evidence:** Retain before/after type maps, matching output, constructor-validation order and updated sources.txt. Explain why a new legitimate member role now needs one subtype instead of a matching formatter family.",
		caseSection: "parallel",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-reflection-question-which-abstraction-actually-earned-its-place",
		title: "Reflection Question: Which Abstraction Actually Earned Its Place?",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Compare Member, LineSource, RoleFormatter and DefaultEventBuffer. Identify what common data or behavior each abstraction owns, which independent types can use it, and what changes when the unnecessary layer is removed. Compare the open Member design with the supplied sealed declaration; distinguish permitted types from valid subtype behavior.\n\n**Completion evidence:** Use the volunteer, sponsor, CSV and named-counter examples to justify one extracted superclass, one interface and one removed abstraction. Explain which shared contract still needs testing after sealing.",
		caseSection: "judgment",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-substitutability-and-hierarchy-exit-contract",
		title: "Substitutability and Hierarchy-Exit Contract",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Write a small separate subtype probe using the provided input table, then run the shared core checks. Test volunteers and mentors at zero/max sessions, mentors at zero/max slots, and invalid name plus invalid counts. Record the first exception and unchanged roster state. In the separately completed optional event project, exercise Counter and NamedCounter through the same add/value/reset contract, including failed overflow.\n\n**Completion evidence:** Retain the probe, constructor/error-order results, immutable earlier snapshot and counter lifecycle trace. State when direct inherited List callers would need migration before a hierarchy exit could be called compatible.",
		caseSection: "contracts",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-core-project-dealing-with-generalization",
		title: "Core Project: Dealing with Generalization",
		aliases: [
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-core-project",
			"dpr7-dealing-with-generalization-core-project",
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-dpr7-dealing-with-generalization-core-project"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		content:
			"Finish the roster refactor without editing the frozen Legacy classes, APIs, CompatibilityClient or ContractChecks. Create Member and LineSource, move shared fields/constructor work/methods to Member, retain role-specific credits in Volunteer/Mentor, and remove the parallel formatter family. Update sources.txt and clean only earlier generated output after deleting classes. Run core with -ea and -da; compare both Main modes.\n\n**Completion evidence:** Preserve all four worked output lines, ordered errors, immutable snapshots and the extracted type relationships. Record the five core techniques and which seven further techniques the optional worked projects illustrate. Optional project completion is separate from core completion.",
		caseSection: "core",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-understanding-check-dealing-with-generalization",
		title: "Understanding Check: Dealing with Generalization",
		aliases: [
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-dpr7-dealing-with-generalization-diagnostic-checkpoint",
			"diagnostic-checkpoint-dealing-with-generalization",
			"diagnostic-checkpoint",
			"understanding-check",
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-diagnostic-checkpoint-dealing-with-generalization",
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-diagnostic-checkpoint",
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-understanding-check"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"Decide whether SponsorBanner belongs under Member or shares LineSource. Then classify moving the CSV delimiter, removing DefaultEventBuffer and sealing Member. Explain which change moves responsibility, which removes an empty layer, and which restricts future direct subtypes.\n\n**Completion evidence:** Give the smallest correct abstraction for each supplied case and one concrete counterexample to the rejected choice. Include why unchanged example output alone does not establish the intended hierarchy.",
		caseSection: "understanding",
		sourceProject: false,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-dealing-with-generalization-transfer-practice",
		title: "Dealing with Generalization Transfer Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-transfer-practice-dealing-with-generalization",
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-transfer-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"In a separate optional attempt, refactor ReportService's format branch into PlainReport and CsvReport under Report. Give Report a final validate/header/row/footer algorithm. Push delimiter and quoteLabel into CsvReport. Preserve format/rows/row validation order, exact labels, input values and all output newlines. Use the two-row inventory, empty input, embedded quote and embedded newline cases.\n\n**Completion evidence:** Retain both identical before/after reports and transfer checks under -ea/-da. Show the two concrete subtypes, common template and CSV-only members. Complete this while the roster can remain in its starter design.",
		caseSection: "transfer",
		sourceProject: true,
		preserveAssignment: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-dealing-with-generalization-extension-practice",
		title: "Dealing with Generalization Extension Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-extension-practice-dealing-with-generalization",
			"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-extension-practice"
		],
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		content:
			"In a separate optional attempt, replace EventBuffer's List inheritance with private collection ownership, remove DefaultEventBuffer and simplify its factory, then make NamedCounter inherit the complete unchanged Counter contract. Preserve bounded FIFO behavior, invalid-input/no-mutation rules, snapshots, checked overflow and reset. Compare the explicit indexed-add client before and after.\n\n**Completion evidence:** Retain the A/B/C sequence, previous snapshot, repeated-empty failure, named-counter trace and extension checks under -ea/-da. Identify the deliberate removal of the extra List surface and the migration it requires for direct List callers. Explain why NamedCounter remains substitutable when every Counter operation stays available.",
		caseSection: "extension",
		sourceProject: true,
		preserveAssignment: true
	}
];
export function completeJavaGeneralization(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPR7 Dealing with Generalization") return module;
	const complete = (entry: (typeof entries)[number]): RawCourseModuleItem => {
		const { caseSection, sourceProject, ...item } = entry;
		let content =
			item.content === "__LESSON__"
				? javaGeneralizationLesson
				: String(item.content);
		if (caseSection) {
			content += `\n\n[Case inputs](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/generalization-inputs.md#${
					caseSection
				}`
			)}) · [Project self-check](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/generalization-answers.md#${
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
							javaGeneralizationUnit.id,
							"starter"
						),
						solutionLink: javaRefactoringUnitURL(
							javaGeneralizationUnit.id,
							"solution"
						)
					}
				: {})
		};
	};
	return {
		...module,
		id: javaGeneralizationUnit.moduleID,
		curriculum: entries.slice(0, 5).map(complete),
		supplementalProjects: entries.slice(5).map(complete)
	};
}
