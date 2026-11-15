import type { RawCourse, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";

type ReferenceEntry = RawCourseModuleItem & {
	caseSection?: string;
	caseAsset?: string;
	sourceUnit?: string;
};
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

const appendixEntries: Record<string, ReferenceEntry[]> = {
	"Course Roadmap": [
		{
			id: "design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-follow-up-path",
			title: "Design Patterns in Java Part 2: Refactoring Follow-Up Path",
			aliases: [
				"design-patterns-in-java-part-2-refactoring-module-options",
				"design-patterns-in-java-part-2-refactoring-next-module-ideas",
				"design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-module-options",
				"design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-next-module-ideas",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-follow-up-path",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-module-options",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-next-module-ideas"
			],
			content:
				"DPR1 establishes an observed baseline and recoverable changes. DPR2 extracts methods; DPR3 moves behavior with its data; DPR4 protects representation; DPR5 and DPR6 simplify decisions and public calls; DPR7 evaluates inheritance; DPR8 compares useful pattern destinations; DPR9 isolates effects. DPR10 uses those skills in one explained sequence over a working application.\n\nUse Clinics 11-17 after a matching diagnosis: ownership, variants, coherent parameters, pure calculations, workflow hooks, explicit absence or a combined sequence. Their guide names the relevant preceding unit. Transfer and extension tasks are optional independent attempts. Further persistence, network and concurrent behavior each need their own new contracts.",
			contentKind: "reading",
			learningPath: "choice",
			preserveInstructions: true
		},
		{
			id: "design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-resource-map",
			title: "Design Patterns in Java Part 2: Refactoring Resource Map",
			aliases: [
				"design-patterns-in-java-part-2-refactoring-resources",
				"design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-resources",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-resource-map",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-resources"
			],
			content:
				"Each supplied Java project includes the complete package tree, sources.txt, a README contract and executable checks. The starter protects the before behavior and leaves specified work unfinished; reference code supplies one possible completed design. Keep the selected folder together and add extracted Java files to its source manifest.\n\nDPR10 also includes sample-input.txt for its two script modes and REFACTORING.md for the change record. The clinics use small standard-library models with their own exact limits, errors and examples. The optional practice projects reuse the preceding pattern course's pricing, editor, report-creation and notebook packs. They retain those packs' complete core requirements and separate optional features.",
			contentKind: "reading",
			learningPath: "choice",
			preserveInstructions: true
		},
		{
			id: "design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-module-alignment-guide",
			title: "Design Patterns in Java Part 2: Refactoring Module Alignment Guide",
			aliases: [
				"design-patterns-in-java-part-2-refactoring-readiness-checklist",
				"design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-readiness-checklist",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-module-alignment-guide",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-readiness-checklist"
			],
			content:
				"Match an observed difficulty to a protected case before choosing more work. An incorrect route total belongs with ownership and Manhattan distance; a changed exception after grouping arguments belongs with the parameter boundary; a formatter that changes state belongs with query/command separation. A pattern name alone does not identify the next exercise.\n\nAt each checkpoint, predict one ordinary value, one boundary or failure and one state/effect observation. Run them on the before design, make one located transformation, and compare the same observations. Then explain which responsibility moved and why the result is easier to change. A green result and an explained structural change provide different evidence.",
			contentKind: "reading",
			learningPath: "choice",
			preserveInstructions: true
		},
		{
			id: "design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-reference-map",
			title: "Design Patterns in Java Part 2: Refactoring Reference Map",
			aliases: [
				"design-patterns-in-java-part-2-refactoring-reference-refresh",
				"design-patterns-in-java-part-2-refactoring-resource-updates",
				"design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-reference-refresh",
				"design-patterns-in-java-part-2-course-roadmap-curriculum-design-patterns-in-java-part-2-refactoring-resource-updates",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-reference-map",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-reference-refresh",
				"design-patterns-in-java-part-2-course-next-steps-curriculum-design-patterns-in-java-part-2-refactoring-resource-updates"
			],
			content:
				"Use the Reference Guide for the Java 21 compiler command, immutable-value caveats and refactoring vocabulary. Use the chosen project's README for its actual public signatures, input domain, validation priority, output punctuation and failure policy. Its Main supplies a small demonstration; its frozen checks cover a larger stated set of observations.\n\nUse the project-specific Case inputs before the Project self-check when predicting traces. Keep the exact source revision attached to the project and retain the compiler/runtime versions with results. A general catalog example can suggest a transformation; compatibility is decided against the selected application's own observable contract.",
			contentKind: "reading",
			learningPath: "choice",
			preserveInstructions: true
		},
		{
			id: "design-patterns-in-java-part-2-course-roadmap-supplemental-design-patterns-in-java-part-2-refactoring-prerequisite-map",
			title: "Design Patterns in Java Part 2: Refactoring Prerequisite Map",
			aliases: [
				"design-patterns-in-java-part-2-refactoring-dependency-graph",
				"design-patterns-in-java-part-2-course-roadmap-supplemental-design-patterns-in-java-part-2-refactoring-dependency-graph",
				"design-patterns-in-java-part-2-course-next-steps-supplemental-design-patterns-in-java-part-2-refactoring-prerequisite-map",
				"design-patterns-in-java-part-2-course-next-steps-supplemental-design-patterns-in-java-part-2-refactoring-dependency-graph"
			],
			content:
				"Draw a prerequisite path from a working public Java client to the workshop capstone. Include characterization, method extraction, state ownership, representation/argument boundaries, variant selection and controlled effects. Place the route, parameter, workflow and absence clinics at useful points; leave each as an optional response to a diagnosed need.\n\n**Completion evidence:** Provide the ordered core path, four clinic-to-prerequisite edges and a protected observation supporting each edge. Compare the supplied worked map and explain one acceptable alternative.",
			caseSection: "refactoring-prerequisite-map",
			contentKind: "assignment",
			learningPath: "choice",
			preserveInstructions: true,
			preserveAssignment: true
		},
		{
			id: "design-patterns-in-java-part-2-course-roadmap-supplemental-design-patterns-in-java-part-2-refactoring-resource-inventory",
			title: "Design Patterns in Java Part 2: Refactoring Resource Inventory",
			aliases: [
				"design-patterns-in-java-part-2-refactoring-materials-readiness",
				"design-patterns-in-java-part-2-refactoring-resource-checklist",
				"design-patterns-in-java-part-2-course-roadmap-supplemental-design-patterns-in-java-part-2-refactoring-materials-readiness",
				"design-patterns-in-java-part-2-course-roadmap-supplemental-design-patterns-in-java-part-2-refactoring-resource-checklist",
				"design-patterns-in-java-part-2-course-next-steps-supplemental-design-patterns-in-java-part-2-refactoring-resource-inventory",
				"design-patterns-in-java-part-2-course-next-steps-supplemental-design-patterns-in-java-part-2-refactoring-materials-readiness",
				"design-patterns-in-java-part-2-course-next-steps-supplemental-design-patterns-in-java-part-2-refactoring-resource-checklist"
			],
			content:
				"Prepare an inventory for one workshop starter and one optional practice source pack. Identify Main, the public API/client, frozen checks, the full source manifest, the README, editable implementation files and the saved change record when supplied. Separate code, task inputs, worked self-check and reference.\n\nFor the workshop, identify which modes read sample-input.txt and which need no input. Predict what must change in sources.txt after extracting SessionBook.java. For the editor practice, identify the complete core contract before selecting the event or undo review.\n\n**Completion evidence:** Provide the two inventories, a compile command, the script-input distinction and the updated manifest entry. Confirm the file roles against the exact selected source folder.",
			caseSection: "refactoring-resource-inventory",
			contentKind: "assignment",
			learningPath: "choice",
			preserveInstructions: true,
			preserveAssignment: true
		}
	],
	"Project Practice Guide": [
		{
			id: "design-patterns-in-java-part-2-project-practice-guide-curriculum-design-patterns-in-java-part-2-refactoring-project-ladder",
			title: "Design Patterns in Java Part 2: Refactoring Project Ladder",
			content:
				"Begin optional practice with the pricing app: compare one common helper with a selected PricingRule. The report-creation app then contrasts direct construction, a factory selection and a creation hook. The editor app adds captured listener order and command phases. The notebook studio asks whether an injected storage boundary earns its added setup.\n\nEach practice card names its complete source pack and a focused review. Complete that pack's core contract before evaluating the selected concern. The cards keep independent attempts so an event experiment cannot replace an undo experiment. Use DPR10 for a longer before/after portfolio after these smaller design decisions can be explained.",
			contentKind: "reading",
			learningPath: "choice",
			preserveInstructions: true
		},
		{
			id: "design-patterns-in-java-part-2-project-practice-guide-curriculum-design-patterns-in-java-part-2-refactoring-checkpoints",
			title: "Design Patterns in Java Part 2: Refactoring Checkpoints",
			content:
				"Retain the actual starting source, compiler command and before result. Before each change, state the next responsibility to move, one risk, the focused observation and a rollback point. Compile the whole source manifest after adding or moving a type; compare ordinary, boundary and rejected-input behavior before widening the change.\n\nFor effects, keep call order, return values and committed state beside the source trace. For returned collections, keep an earlier snapshot and test the input after later changes. Finish with a separately compiled public client and an account of the remaining risks. A final passing run cannot reconstruct missing intermediate source states.",
			contentKind: "reading",
			learningPath: "choice",
			preserveInstructions: true
		},
		{
			id: "design-patterns-in-java-part-2-project-practice-guide-curriculum-design-patterns-in-java-part-2-refactoring-rubric",
			title: "Design Patterns in Java Part 2: Refactoring Rubric",
			content:
				"Evaluate behavior, structure and judgment separately. Behavior evidence reproduces the selected values, validation priority, exceptions, state changes, effect order and snapshot promises. Structural evidence locates the responsibility before and after, shows dependency arrows and retains small passing source steps. Judgment explains why the added abstraction earns its cost for a concrete change.\n\nA complete submission includes reproducible commands, the before design, focused and final results, actual source checkpoints, a rollback target, a simpler alternative and a remaining risk. A solution can use different private classes from the reference while preserving the public contract. More patterns or more classes do not raise the result by themselves.",
			contentKind: "reading",
			learningPath: "choice",
			preserveInstructions: true
		},
		{
			id: "design-patterns-in-java-part-2-project-practice-guide-curriculum-design-patterns-in-java-part-2-refactoring-capstone-gate",
			title: "Design Patterns in Java Part 2: Refactoring Capstone Gate",
			content:
				"Start DPR10 when a working Java application can be compiled reproducibly, its public behavior can be observed and several interacting responsibilities can be located. Use the supplied workshop app or a suitable medium codebase with its own controlled baseline. Record the ordinary inputs, failures, nondeterminism and dependencies before choosing a transformation.\n\nFor the workshop, baseline and core behavior checks already pass in the starter. The capstone therefore needs actual refactoring steps, an ownership/dependency comparison and defended decisions as well as green tests. Preserve queue order, error priority, histories and snapshots. Keep a requested feature or bug fix in its own behavior-changing work, with a new expectation.",
			contentKind: "reading",
			learningPath: "choice",
			preserveInstructions: true
		},
		{
			id: "design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-if-else-behavior-into-strategy",
			title: "Practice Project: Refactor If/else Behavior Into Strategy",
			content:
				"Use the DPJ-Studio-Strategy-Selection-Packs project from the preceding pattern course. Complete its required core contract before this focused review; its other optional task remains separate.\n\nContinue the Strategy Selection studio's pricing refactor. Locate the duplicate BULK/FLAT/MEMBER calculations in quote and receipt. First route both through one helper, then compare that intermediate with PricingRule collaborators and a single Plan selector. Keep the supplied prices and validation order.\n\nPredict BULK totals for 4,5,9,10 units and MEMBER for 6. Compare receipt(BULK,6) with quote(BULK,6). Run core after each step and record the actual rule locations and added setup cost. The optional caller-supplied rule remains separate from this core refactor.",
			caseSection: "strategy",
			caseAsset: "appendix-checks",
			projectLink:
				"https://github.com/instruction-material/Java-Level-3/tree/863f2ba2ad2fe6c8c20681e3fdff6eeeb7170be9/DPJ-Studio-Strategy-Selection-Packs/starter",
			solutionLink:
				"https://github.com/instruction-material/Java-Level-3/tree/863f2ba2ad2fe6c8c20681e3fdff6eeeb7170be9/DPJ-Studio-Strategy-Selection-Packs/solution",
			ideImport: true,
			contentKind: "assignment",
			learningPath: "choice",
			preserveInstructions: true,
			preserveAssignment: true
		},
		{
			id: "design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-add-observer-events-to-a-small-model",
			title: "Practice Project: Add Observer Events to a Small Model",
			content:
				"Use the DPJ7-Editor-Collaboration-Packs project from the preceding pattern course. Complete its required core contract before this focused review; its other optional task remains separate.\n\nContinue DPJ7's editor project by completing EventBus.publish according to its captured-list contract. Each subscription is an independent registration. Capture listeners in order at publication; changes to subscriptions affect later captured lists. A listener exception stops the remaining callbacks and propagates.\n\nTrace A and B subscribed in that order. During A's callback, close B's registration. B still receives this already captured event; only A receives the next event. Then trace an exception from A before B runs. Keep that failure distinct from EditorMediator's committed model/history state. Run core and retain callback order beside the source.",
			caseSection: "observer",
			caseAsset: "appendix-checks",
			projectLink:
				"https://github.com/instruction-material/Java-Level-3/tree/c137b8cb5a0fec3c3a2effde9fc72d5e86ce394e/DPJ7-Editor-Collaboration-Packs/starter",
			solutionLink:
				"https://github.com/instruction-material/Java-Level-3/tree/c137b8cb5a0fec3c3a2effde9fc72d5e86ce394e/DPJ7-Editor-Collaboration-Packs/solution",
			ideImport: true,
			contentKind: "assignment",
			learningPath: "choice",
			preserveInstructions: true,
			preserveAssignment: true
		},
		{
			id: "design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-convert-duplicate-constructors-to-factory",
			title: "Practice Project: Convert Duplicate Constructors to Factory",
			content:
				"Use the DPJ3-Report-Creation-Packs project from the preceding pattern course. Complete its required core contract before this focused review; its other optional task remains separate.\n\nContinue DPJ3's report-creation project. Compare direct construction with RendererFactory.forStyle and the Exporter.createRenderer hook. Complete the boxed Heading/BodyLine products, the boxed exporter's creation hook and required Builder methods. Matching product metadata is part of the contract.\n\nFor title Notes and body [one,two], predict the BOXED output. Add includeCount=true and footer End, then compare the complete output with Main. Test a mixed-style product pair and an empty body. Explain which selection pressure justifies the factory and when the direct ReportJob constructor remains simpler.",
			caseSection: "factory",
			caseAsset: "appendix-checks",
			projectLink:
				"https://github.com/instruction-material/Java-Level-3/tree/b82c4e7e50be39652407661e402d1e17c75c65a7/DPJ3-Report-Creation-Packs/starter",
			solutionLink:
				"https://github.com/instruction-material/Java-Level-3/tree/b82c4e7e50be39652407661e402d1e17c75c65a7/DPJ3-Report-Creation-Packs/solution",
			ideImport: true,
			contentKind: "assignment",
			learningPath: "choice",
			preserveInstructions: true,
			preserveAssignment: true
		},
		{
			id: "design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-implement-command-based-undo",
			title: "Practice Project: Implement Command-based Undo",
			content:
				"Use the DPJ7-Editor-Collaboration-Packs project from the preceding pattern course. Complete its required core contract before this focused review; its other optional task remains separate.\n\nContinue DPJ7's editor project by completing ReplaceCommand.execute and undo. A new command snapshots the document, applies its replacement and enters DONE. Undo requires DONE and text still equal to the applied replacement; it restores the snapshot and enters UNDONE. A rejected stale undo remains DONE. Commands are one-shot.\n\nTrace Ready to Checked and undo, then try executing that consumed command again. Separately trace an outside change to Other before undo and explain why it is rejected. Compare the mediator's private document/history ownership with a directly exposed mutable document. Run core and retain both phase and text traces.",
			caseSection: "command",
			caseAsset: "appendix-checks",
			projectLink:
				"https://github.com/instruction-material/Java-Level-3/tree/c137b8cb5a0fec3c3a2effde9fc72d5e86ce394e/DPJ7-Editor-Collaboration-Packs/starter",
			solutionLink:
				"https://github.com/instruction-material/Java-Level-3/tree/c137b8cb5a0fec3c3a2effde9fc72d5e86ce394e/DPJ7-Editor-Collaboration-Packs/solution",
			ideImport: true,
			contentKind: "assignment",
			learningPath: "choice",
			preserveInstructions: true,
			preserveAssignment: true
		},
		{
			id: "design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-a-mini-app-with-tests-before-and-after",
			title: "Practice Project: Refactor a Mini-App with Tests Before and After",
			content:
				"Use the DPJ-Studio-Architecture-Judgment-Packs project from the preceding pattern course. Complete its required core contract before this focused review; its other optional task remains separate.\n\nContinue the Architecture Judgment notebook studio. Preserve create, edit, find and all while comparing a helper-only cleanup with an injected NoteRepository. Compile the application with fake storage, without MemoryNotes or Composition, and inspect the source dependency arrows.\n\nTrace a successful version-1 edit, a stale version-1 edit after it, and audit failure after a committed save. Capture an immutable snapshot before editing. Run core for the original and selected designs, and record added files/setup against the demonstrated substitution. Optional versioned removal is a separate extension.",
			caseSection: "notebook",
			caseAsset: "appendix-checks",
			projectLink:
				"https://github.com/instruction-material/Java-Level-3/tree/863f2ba2ad2fe6c8c20681e3fdff6eeeb7170be9/DPJ-Studio-Architecture-Judgment-Packs/starter",
			solutionLink:
				"https://github.com/instruction-material/Java-Level-3/tree/863f2ba2ad2fe6c8c20681e3fdff6eeeb7170be9/DPJ-Studio-Architecture-Judgment-Packs/solution",
			ideImport: true,
			contentKind: "assignment",
			learningPath: "choice",
			preserveInstructions: true,
			preserveAssignment: true
		}
	]
};

export function applyJavaRefactoringReferences(course: RawCourse) {
	for (const module of course.modules) {
		const selected =
			module.title === "Standards Map"
				? entries
				: appendixEntries[module.title];
		if (!selected) continue;
		const complete = (entry: ReferenceEntry) => {
			const { caseSection, caseAsset, ...item } = entry;
			let content = item.content;
			if (caseSection) {
				const input = caseAsset
					? `${caseAsset}.md#${caseSection}-inputs`
					: `refactoring-final-inputs.md#${caseSection}`;
				const answer = caseAsset
					? `${caseAsset}.md#${caseSection}-answers`
					: `refactoring-final-answers.md#${caseSection}`;
				content += `\n\n[Case inputs](${courseAssetViewerUrl(
					`/course-assets/design-patterns-in-java/${input}`
				)}) · [Project self-check](${courseAssetViewerUrl(
					`/course-assets/design-patterns-in-java/${answer}`
				)})`;
			}
			return { ...item, content };
		};
		module.curriculum = selected
			.filter(item => item.contentKind === "reading")
			.map(complete);
		module.supplementalProjects = selected
			.filter(item => item.contentKind === "assignment")
			.map(complete);
	}
}
