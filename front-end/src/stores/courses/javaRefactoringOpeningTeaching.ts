import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaRefactoringModuleID,
	javaRefactoringURL
} from "@/modules/javaRefactoringResources";

const entries: Array<
	RawCourseModuleItem & { caseSection: string | null; sourceProject: boolean }
> = [
	{
		id: "design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-code-smells-and-safe-refactoring-workflow-core-concepts",
		title: "Code Smells and Safe Refactoring Workflow Core Concepts",
		aliases: [
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-core-concepts-and-learning-sequence",
			"core-concepts",
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-core-concepts"
		],
		content:
			'**Course flow:** Diagnose a concrete code smell, protect observable behavior, and compare small refactoring steps. Later units develop method, object, data, conditional, API and hierarchy transformations. The preceding pattern course explains collaboration choices; this course practices the sequence that safely changes existing Java code. Multi-file Java, interfaces, collections, exceptions and basic tests are prerequisites.\n\n### Behavior and structure\n\nA refactor preserves the selected observable contract while changing internal structure. A feature intentionally changes a rule. A bug fix corrects behavior that violates a requirement. A performance change targets measured resource use or time; it can also be a refactor when the observable contract stays the same. State the purpose and boundary rather than treating the labels as mutually exclusive.\n\nCharacterization records what the current program does. An independent oracle states what it is required to do. A copied baseline and target can share a mistake. Here LegacyLoanDesk is preserved for comparison, while ContractTests checks a separately stated fee formula and exact output templates. The starter is runnable; the design work removes duplicated decisions.\n\n### Smell survey\n\nA smell is evidence to investigate. Choose the dominant change pressure before selecting a technique. Several observations can describe the same code; a smaller method or shared operation may resolve it without a pattern.\n\n**Bloaters**\n\n| Smell | Meaning in a Java design |\n| --- | --- |\n| Long Method | One method performs independently meaningful steps. |\n| Large Class | One class owns responsibilities with different reasons to change. |\n| Primitive Obsession | Raw strings/numbers carry scattered domain rules. |\n| Long Parameter List | A call exposes many values or configuration decisions. |\n| Data Clumps | The same related values repeatedly travel together. |\n\n**Object-orientation abusers**\n\n| Smell | Meaning in a Java design |\n| --- | --- |\n| Alternative Classes with Different Interfaces | Similar services force different client call shapes. |\n| Refused Bequest | A subtype rejects behavior its parent promises. |\n| Switch Statements | Repeated selection logic can drift as variants change. |\n| Temporary Field | An object\'s fields matter only in a particular workflow phase. |\n\n**Change preventers**\n\n| Smell | Meaning in a Java design |\n| --- | --- |\n| Divergent Change | Several unrelated changes repeatedly affect one class. |\n| Shotgun Surgery | One change repeatedly touches many classes. |\n| Parallel Inheritance Hierarchies | Adding one subtype forces a matching subtype elsewhere. |\n\n**Dispensables**\n\n| Smell | Meaning in a Java design |\n| --- | --- |\n| Duplicate Code | Multiple sites own the same rule. |\n| Dead Code | Unused behavior remains without a current role. |\n| Lazy Class | An abstraction contributes too little to justify its cost. |\n| Speculative Generality | Extension machinery serves an unrequired variation. |\n| Comments | A comment compensates for unclear code; useful rationale can remain. |\n| Data Class | Behavior may live away from its data; an intentional immutable value record is still useful. |\n\n**Coupling and boundary problems**\n\n| Smell | Meaning in a Java design |\n| --- | --- |\n| Feature Envy | A method depends heavily on another object\'s data. |\n| Inappropriate Intimacy | Classes rely on each other\'s private representation. |\n| Message Chains | A client navigates several objects to obtain one service. |\n| Middle Man | A layer delegates without a useful boundary or policy. |\n| Incomplete Library Class | A needed library operation is missing and the library cannot be changed directly. |\n\nA report client that repeatedly reads a book\'s title, pages and edition to build a description suggests investigating behavior ownership before adding Strategy. A subtype whose inherited save method always throws exposes a substitutability problem. LoanDesk instead has three matching fee calculations: one fixed rule with duplicated ownership. Consolidating the existing fee operation addresses that pressure.\n\nThe [smell catalog](https://refactoring.guru/refactoring/smells) supplies vocabulary; [Extract Method](https://refactoring.guru/extract-method) separates meaningful calculations with explicit inputs/results. The concrete reminder behavior below is this exercise\'s supplied contract.\n\n### Complete source layout\n\nThe pack has nine files: Main.java, ContractTests.java, README.md, DECISIONS.md, CHECKPOINTS.md, sources.txt and three package files under src/loans: Loan.java, LegacyLoanDesk.java and LoanDesk.java. Keep the package tree intact. The complete driver is:\n\n```java\nimport loans.Loan;\nimport loans.LoanDesk;\nimport loans.LegacyLoanDesk;\n\npublic final class Main {\n    private Main() {}\n    public static void main(String[] args) {\n        boolean base = args.length > 0 && args[0].equals("base");\n        Loan loan = new Loan("Mira", "Atlas", 4, false);\n        System.out.println(base ? LegacyLoanDesk.fee(4, false) : LoanDesk.fee(4, false));\n        System.out.println(base ? LegacyLoanDesk.notice(loan) : LoanDesk.notice(loan));\n        System.out.println(base ? LegacyLoanDesk.ledger(loan) : LoanDesk.ledger(loan));\n        System.out.println(base ? LegacyLoanDesk.fee(365, true) : LoanDesk.fee(365, true));\n    }\n}\n```\n\nThis working reminder program has one fee rule copied into three public operations. Preserve its behavior while centralizing that rule. The reference uses the existing fee operation; it adds no strategy hierarchy or discovery mechanism. The task begins with runnable code.\n\n## Protected contract\n\nLoan is an immutable record of borrower, book, lateDays and staff. Borrower is non-null, nonblank, at most 40 Unicode code points; book has the same rules with maximum 80. Text excludes CR, LF and pipe. Accepted text is retained exactly, including leading/trailing spaces. Constructor validation checks borrower, then book, then days. Null text raises NullPointerException; other invalid values raise IllegalArgumentException.\n\nDays is a whole int from 0 through 365. fee validates that range even for staff. The first 3 days are free; each later day costs 25 integer cents. Staff always pay 0. These are fictional exercise rules. Operations read no input and write no files.\n\n- fee(days,staff) returns integer cents.\n- notice(loan) returns exactly: To BORROWER: BOOK | overdue=DAYS | charge=CENTS\n- ledger(loan) returns exactly: BORROWER|BOOK|DAYS|CENTS|STAFF or READER\n- notice/ledger reject a null Loan with NullPointerException.\n- Calls are independent and leave Loan unchanged.\n\n| Days | Reader cents | Staff cents |\n| --- | --- | --- |\n| 0 | 0 | 0 |\n| 3 | 0 | 0 |\n| 4 | 25 | 0 |\n| 12 | 225 | 0 |\n| 365 | 9050 | 0 |\n\n## Build and compare\n\nUse JDK 21 and the complete role folder:\n\n```sh\njavac --release 21 -Xlint:all -Werror -d classes @sources.txt\njava -cp classes ContractTests base\njava -cp classes Main base\njava -cp classes ContractTests core\njava -cp classes Main\n```\n\nBoth Main modes print:\n\n```text\n25\nTo Mira: Atlas | overdue=4 | charge=25\nMira|Atlas|4|25|READER\n0\n```\n\nBaseline checks LegacyLoanDesk against an independently stated fee formula and exact output templates. Core additionally checks LoanDesk across every allowed day/staff pair, several names, invalid inputs, text preservation and repeat calls. Both roles already pass core. Green behavior alone does not demonstrate a structural improvement or justify a pattern.\n\nAfter export, commit the green baseline separately. Name one transformation per commit, such as the consistent rename or notice delegation. Protect return values, output text, exceptions, validation order, effects, ownership and the public API. If unrelated changes cannot be rolled back independently, separate their checkpoints before accepting them.\n\n## Small refactor sequence\n\nKeep LegacyLoanDesk, Loan, Main and ContractTests unchanged. Capture baseline commands/results in CHECKPOINTS.md before edits.\n\n1. Locate the three fee calculation sites and describe their drift risk.\n2. Rename one local variable consistently, compile and run core.\n3. In notice, replace only the duplicated calculation with fee; run core.\n4. Do the same in ledger and rerun core/Main.\n5. Name the grace/rate constants and compare the source dependency map.\n6. Record the observed rule locations, public API and a simpler alternative in\n   DECISIONS.md. Retain the last green source separately from a failed change.\n\nChanging the free period from 3 to 7 days is a feature change, not this refactor. For a reader at 4 days that new policy gives 0 instead of 25; at 12 days it gives 125 instead of 225. State that changed contract separately during written transfer.\n\n## Optional immutable batch\n\nImplement noticeAll(List<Loan>). Snapshot the non-null list; a null element raises NullPointerException. Return notices in input order, preserving duplicates in an unmodifiable list. Leave the input unchanged; later input-list changes leave the returned strings unchanged. Empty input returns an empty unmodifiable list. The method uses the same notice contract. Core remains complete without it.\n\n```sh\njava -cp classes ContractTests\n```\n\nExtension evidence: pass [Mira/Atlas/4/reader,Sol/Maps/12/staff,Mira/Atlas/4/reader], try changing the returned list, then clear the input. Retain exact lines, duplicate order, immutability and unchanged core output.\n\nConcept references: [small clean designs](https://refactoring.guru/refactoring/what-is-refactoring) and [Extract Method](https://refactoring.guru/extract-method). The concrete LoanDesk contract above is supplied for this exercise.\n\nBaseline reports 24190 passed; core reports 48380 passed. The complete reference reports 48389 passed. All valid day/staff pairs, several text cases, invalid inputs and repeats are checked. Behavioral agreement does not by itself establish structural improvement or design suitability.\n',
		contentKind: "reading",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: null,
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-code-smells-and-safe-refactoring-workflow-application-check",
		title: "Code Smells and Safe Refactoring Workflow Application Check",
		aliases: [
			"application-check",
			"mini-lab-write-the-refactor-plan-before-touching-code",
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-application-check",
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-mini-lab-write-the-refactor-plan-before-touching-code"
		],
		content:
			"Trace the working LoanDesk before editing. For a reader at 3, 4 and 12 days, calculate the fee, notice suffix and ledger fourth field. Repeat the 12-day case for staff. Mark the three independent fee calculation sites and identify the drift risk if only one changes.\n\nCompare three source states: a consistent local rename, notice delegating to fee while ledger still has its copy, and both formatting entrypoints delegating. Predict whether each retains the supplied behavior. Compile and run core after each coherent step, retaining the exact source identity.\n\n**Completion evidence:** Record the fixed values, rule locations and command results in CHECKPOINTS.md. Explain why an unchanged output supports a safe step while source comparison establishes the responsibility change. The later core task continues this saved project.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: "application",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-reflection-question-what-makes-a-refactor-reckless",
		title: "Reflection Question: What Makes a Refactor Reckless?",
		content:
			"Use the reminder program to compare a planned refactor with a risky rewrite. A safe plan identifies the three fee sites, preserves the exact text/error contract and verifies one change at a time. A rewrite that simultaneously changes fee rules, output templates and package structure makes a failure harder to locate.\n\nExplain what a green baseline proves and why it cannot establish every untested case. For an incomplete local rename, state what failed, which last green source to restore and which commands establish recovery. For a compiled change that makes day 4 free, identify the contradicted rule and the need for a separate behavior decision.\n\n**Completion evidence:** Submit the two failure/recovery traces and one specific reason to reduce a planned step's scope.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: "reflection",
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-refactor-bug-fix-feature-or-performance-change",
		title: "Refactor, Bug Fix, Feature, or Performance Change?",
		content:
			"Classify four proposed changes. A changes only a local variable name consistently. B extends the free period from 3 to 7 days. C corrects ledger's fee field when it incorrectly reports zero for a reader at 4 days. D substitutes an equivalent faster calculation while preserving the contract and presenting measured timing evidence.\n\nState the purpose, expected visible result and required evidence for each. A performance improvement can also preserve behavior; the labels need not be exclusive. A passing sample alone cannot establish the complete equivalence claimed for D.\n\n**Completion evidence:** Include reader outcomes for days 4 and 12 under the current and proposed grace periods. Keep B's changed business rule separate from the core refactor.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: "classification",
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-behavior-inventory-and-reversible-commit-contract",
		title: "Behavior Inventory and Reversible Commit Contract",
		content:
			"Inventory fee, notice and ledger before structural work. Record valid domains, null/invalid behavior, exact delimiters, field order, whitespace preservation and mutation/effect rules. The protected files define the comparison boundary: Loan, LegacyLoanDesk, Main and ContractTests remain unchanged.\n\nIn CHECKPOINTS.md, retain the untouched source identity, native compile/core command, observed result and interpretation. Save each coherent green step separately after export. If compilation fails or a required output changes without explanation, restore the last green source and re-plan. DECISIONS.md records rule locations, a concrete drift scenario and why a shared operation is adequate.\n\n**Completion evidence:** Include normal, threshold, staff and invalid-input cases. Distinguish output evidence from the source map and from a proposed optional feature.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: "inventory",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-core-project-code-smells-and-safe-refactoring-workflow",
		title: "Core Project: Code Smells and Safe Refactoring Workflow",
		aliases: [
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-core-project",
			"dpr1-code-smells-and-safe-refactoring-workflow-core-project",
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-dpr1-code-smells-and-safe-refactoring-workflow-core-project"
		],
		content:
			"Refactor LoanDesk without changing core behavior. Start from the working target and unchanged LegacyLoanDesk. Identify the duplicated calculation in fee, notice and ledger. Rename one local consistently, then make notice delegate its fee calculation and verify core. Make ledger delegate next, then name the fixed grace period and rate constants.\n\nPreserve the public API, validation behavior, exact text and immutable Loan values. Keep all nine files together and update sources.txt if a source move is later selected. The reference demonstrates one rule location without a strategy hierarchy.\n\n**Completion evidence:** Keep core at 48380 passed, matching four Main lines, each intermediate source/result, the before/after rule map and the simpler-alternative decision. Complete core before optional noticeAll work.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: "core",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-understanding-check-code-smells-and-safe-refactoring-workflow",
		title: "Understanding Check: Code Smells and Safe Refactoring Workflow",
		aliases: [
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-dpr1-code-smells-and-safe-refactoring-workflow-diagnostic-checkpoint",
			"diagnostic-checkpoint-code-smells-and-safe-refactoring-workflow",
			"diagnostic-checkpoint",
			"understanding-check",
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-diagnostic-checkpoint-code-smells-and-safe-refactoring-workflow",
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-diagnostic-checkpoint",
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-understanding-check"
		],
		content:
			"Diagnose a smell before selecting machinery. Three supplied methods repeat one fixed fee rule. Explain why using the existing fee operation removes the drift risk. Compare that with a strategy hierarchy when there is no independently varying policy in the stated contract.\n\nDistinguish a consistent rename from a compiled change to the grace period. For a reader at day 4, predict the current fee and the result if grace becomes 7 days. State which check reveals that difference and why several unrelated changes together hide its cause.\n\n**Completion evidence:** Give the dominant smell, the smallest useful next step, the expected value and a reason to reject a speculative abstraction.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "choice",
		caseSection: "diagnostic",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-code-smells-and-safe-refactoring-workflow-transfer-practice",
		title: "Code Smells and Safe Refactoring Workflow Transfer Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-transfer-practice-code-smells-and-safe-refactoring-workflow",
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-transfer-practice"
		],
		content:
			"Written transfer: a proposed reminder policy has seven free days, then 25 cents per later day, with the same staff waiver and input/error rules. Predict reader values for days 0, 4, 7, 8 and 12; compare the current policy. State which public outputs change together.\n\nPrepare a behavior-change note before modifying source. The current core harness intentionally protects the existing policy, so a new policy needs its own agreed expectation table and review. The refactor makes that later change local without authorizing it.\n\n**Completion evidence:** Submit both tables, the changed requirement and checks that distinguish a deliberate policy change from a broken refactor.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "choice",
		caseSection: "transfer",
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-code-smells-and-safe-refactoring-workflow-extension-practice",
		title: "Code Smells and Safe Refactoring Workflow Extension Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-extension-practice-code-smells-and-safe-refactoring-workflow",
			"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-extension-practice"
		],
		content:
			"Implement optional noticeAll after core. Snapshot the non-null list, reject null entries and produce notice strings in input order. Preserve duplicates and return an unmodifiable list. Leave the input unchanged; later membership changes leave returned strings unchanged. Empty input yields an empty unmodifiable list.\n\nUse the fixed three-loan case, attempt to modify the returned list, clear the input and inspect the retained result. Include a null list and a list containing a null element. Run core before and after optional work, then the complete harness.\n\n**Completion evidence:** Keep exact ordered lines, duplicate retention, input ownership, output immutability and unchanged core output. The complete reference reports 48389 passed.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "challenge",
		caseSection: "extension",
		sourceProject: true
	}
];
export function completeJavaRefactoringOpening(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPR1 Code Smells and Safe Refactoring Workflow")
		return module;
	const complete = (entry: (typeof entries)[number]): RawCourseModuleItem => {
		const { caseSection, sourceProject, ...item } = entry;
		let content = item.content;
		if (caseSection) {
			const path = `/course-assets/design-patterns-in-java/refactoring-opening-checks.md#${
				caseSection
			}`;
			content += `\n\n[Case inputs](${courseAssetViewerUrl(`${path}-inputs`)}) · [Project self-check](${courseAssetViewerUrl(`${path}-answers`)})`;
		}
		return {
			...item,
			content,
			...(sourceProject
				? {
						ideImport: true,
						projectLink: javaRefactoringURL("starter"),
						solutionLink: javaRefactoringURL("solution")
					}
				: {})
		};
	};
	return {
		...module,
		id: javaRefactoringModuleID,
		curriculum: entries.slice(0, 6).map(complete),
		supplementalProjects: entries.slice(6).map(complete)
	};
}
