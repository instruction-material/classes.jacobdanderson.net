import type { RawCourse, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";

type ReferenceEntry = RawCourseModuleItem & { caseSection?: string };
const entries: ReferenceEntry[] = [
	{
		id: "design-patterns-in-java-part-2-standards-map-curriculum-design-patterns-in-java-part-2-refactoring-reference-guide",
		title: "Design Patterns in Java Part 2: Refactoring Reference Guide",
		aliases: [
			"design-patterns-in-java-part-2-refactoring-source-map",
			"design-patterns-in-java-part-2-standards-map-curriculum-design-patterns-in-java-part-2-refactoring-source-map",
			"design-patterns-in-java-part-2-course-foundations-curriculum-design-patterns-in-java-part-2-refactoring-reference-guide",
			"design-patterns-in-java-part-2-course-foundations-curriculum-design-patterns-in-java-part-2-refactoring-source-map"
		],
		content:
			"The supplied projects target Java 21. The [javac manual](https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html) explains compiling the complete package tree with --release 21, -d out and @sources.txt. Keep the selected role folder together; a newly extracted Java type must appear in the source manifest. The site's native Run view displays these commands, and the exported files can be compiled with JDK 21.\n\n[Records](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Record.html) carry fixed components but do not recursively freeze mutable values. [List.copyOf](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html) supplies an unmodifiable membership snapshot; the workshop and route projects pair that with immutable element values. Their README files define the exercise-specific limits, error messages and ordering.\n\nThe [Refactoring.Guru catalog](https://refactoring.guru/refactoring) organizes smells and transformations. Use a located problem, protected behavior and small change to select a technique. The catalog names a vocabulary; the supplied before/reference programs and stated cases make the course's particular contracts reproducible.",
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "choice"
	},
	{
		id: "design-patterns-in-java-part-2-standards-map-curriculum-design-patterns-in-java-part-2-refactoring-core-skills",
		title: "Design Patterns in Java Part 2: Refactoring Core Skills",
		aliases: [
			"design-patterns-in-java-part-2-course-foundations-curriculum-design-patterns-in-java-part-2-refactoring-core-skills"
		],
		content:
			"| Skill | Concrete checkpoint | Preserved observation |\n| --- | --- | --- |\n| Characterization | Run the before design and retain a small source checkpoint. | Existing values, errors and event order stay explained. |\n| Ownership | Move route decisions beside owned immutable points in Clinic 11. | The original PlannerAPI client still reports distance 7. |\n| API migration | Introduce RangeSpec while retaining the integer adapters in Clinic 13. | (2,9,3) still yields [2,5,8]. |\n| Calculation semantics | Split raw and usable energy before query extraction in Clinic 14. | (33,3,50) remains (99,49,50). |\n| Workflow variation | Extract the common skeleton in Clinic 15. | Header, ordered body calls and footer keep their declared sequence. |\n| Absence policy | Put the intentional guest choice at one boundary in Clinic 16. | A real guest/email profile remains present. |\n| Design judgment | Compare the workshop's state owner and report helper with larger alternatives. | FIFO and snapshot promises remain unchanged. |\n\nFor a refactoring claim, retain both the protected observation and the actual responsibility change. A passing final output establishes a different part of the argument from the step log and dependency sketch.",
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "choice"
	},
	{
		id: "design-patterns-in-java-part-2-standards-map-curriculum-design-patterns-in-java-part-2-refactoring-next-topics",
		title: "Design Patterns in Java Part 2: Refactoring Next Topics",
		aliases: [
			"design-patterns-in-java-part-2-course-foundations-curriculum-design-patterns-in-java-part-2-refactoring-next-topics"
		],
		content:
			"Choose further work from a demonstrated limit in a completed project. A caller-supplied rendering policy fits the variant clinic; a new promotion policy needs new queue expectations; persistent storage needs serialization and failure contracts; concurrent changes need an atomic state/version policy. State the changed behavior and its ordinary/failure cases before choosing a tool.\n\nKeep that future work separate from the refactor that preserved the original baseline. The workshop's in-memory single-process behavior does not establish a durable or concurrent service. A different medium application can be a suitable capstone when it has a reproducible baseline and enough interacting responsibilities to justify a meaningful sequence.",
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "choice"
	},
	{
		id: "design-patterns-in-java-part-2-standards-map-curriculum-design-patterns-in-java-part-2-refactoring-boundaries",
		title: "Design Patterns in Java Part 2: Refactoring Boundaries",
		aliases: [
			"design-patterns-in-java-part-2-course-foundations-curriculum-design-patterns-in-java-part-2-refactoring-boundaries"
		],
		content:
			"The preceding Design Patterns in Java course develops object collaborations and compares pattern choices. This course starts with working, awkward code and studies diagnosis, small transformations, compatibility, validation order, ownership and evidence that the behavior stayed stable. Related vocabulary serves these different project purposes.\n\nDPR1-DPR9 build the refactoring skills used in DPR10. Clinics 11-17 are optional focused practice after a matching unit or capstone diagnosis, rather than seven additional required units. Choose them for an observed need. The capstone permits the supplied workshop app or another suitable medium codebase with its own protected contracts.\n\nA bug fix changes incorrect behavior; a feature adds behavior; a refactor preserves the selected observable contract. Keep those expectations and source changes distinct. Database/network production guarantees and other languages' ownership models require their own prerequisites and validation.",
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "choice"
	},
	{
		id: "design-patterns-in-java-part-2-standards-map-supplemental-design-patterns-in-java-part-2-refactoring-prerequisite-check",
		title: "Design Patterns in Java Part 2: Refactoring Prerequisite Check",
		aliases: [
			"design-patterns-in-java-part-2-refactoring-standards-checkpoint",
			"design-patterns-in-java-part-2-refactoring-readiness-check",
			"design-patterns-in-java-part-2-standards-map-supplemental-design-patterns-in-java-part-2-refactoring-standards-checkpoint",
			"design-patterns-in-java-part-2-standards-map-supplemental-design-patterns-in-java-part-2-refactoring-readiness-check",
			"design-patterns-in-java-part-2-course-foundations-supplemental-design-patterns-in-java-part-2-refactoring-prerequisite-check",
			"design-patterns-in-java-part-2-course-foundations-supplemental-design-patterns-in-java-part-2-refactoring-standards-checkpoint",
			"design-patterns-in-java-part-2-course-foundations-supplemental-design-patterns-in-java-part-2-refactoring-readiness-check"
		],
		content:
			"Trace these cases before a larger refactor.\n\n1. Create List.copyOf from [ana], then append bo to the original list. State the snapshot membership.\n2. A desk has an existing valid room. Call join(null,null); identify the first error and whether the call changes that room.\n3. Compare extracting an unchanged membership helper with sorting waiting participants [cy,bo] before promotion.\n\nRecord the predicted value/error/state for each case, then compare the worked self-check. Revisit the ownership, validation and characterization units when a result is unclear.",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		preserveAssignment: true,
		caseSection: "refactoring-prerequisites"
	},
	{
		id: "design-patterns-in-java-part-2-standards-map-supplemental-design-patterns-in-java-part-2-refactoring-pathway-map",
		title: "Design Patterns in Java Part 2: Refactoring Pathway Map",
		aliases: [
			"design-patterns-in-java-part-2-refactoring-sequence-map",
			"design-patterns-in-java-part-2-refactoring-learning-sequence",
			"design-patterns-in-java-part-2-standards-map-supplemental-design-patterns-in-java-part-2-refactoring-sequence-map",
			"design-patterns-in-java-part-2-standards-map-supplemental-design-patterns-in-java-part-2-refactoring-learning-sequence",
			"design-patterns-in-java-part-2-course-foundations-supplemental-design-patterns-in-java-part-2-refactoring-pathway-map",
			"design-patterns-in-java-part-2-course-foundations-supplemental-design-patterns-in-java-part-2-refactoring-sequence-map",
			"design-patterns-in-java-part-2-course-foundations-supplemental-design-patterns-in-java-part-2-refactoring-learning-sequence"
		],
		content:
			"Choose a learning path from a concrete diagnosis.\n\n- A client repeatedly passes start/end/step together.\n- A renderer must accept a new caller-supplied output rule.\n- A task-board report duplicates calculations and mixes formatting with analysis.\n\nFor each, name the matching core unit or optional clinic, a small first step, the existing observation to preserve and the next review decision. Connect the chosen practice to the capstone's baseline/ledger approach. Another justified path is acceptable when it protects the same behavior and explains its prerequisite.",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		preserveAssignment: true,
		caseSection: "refactoring-pathways"
	}
];

export function applyJavaRefactoringReferences(course: RawCourse) {
	const module = course.modules.find(
		value => value.title === "Standards Map"
	);
	if (!module) throw new Error("Missing refactoring reference module");
	const complete = (entry: ReferenceEntry): RawCourseModuleItem => {
		const { caseSection, ...item } = entry;
		let content = item.content;
		if (caseSection) {
			content += `\n\n[Case inputs](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/refactoring-final-inputs.md#${
					caseSection
				}`
			)}) · [Project self-check](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/refactoring-final-answers.md#${
					caseSection
				}`
			)})`;
		}
		return { ...item, content };
	};
	module.curriculum = entries.slice(0, 4).map(complete);
	module.supplementalProjects = entries.slice(4).map(complete);
}
