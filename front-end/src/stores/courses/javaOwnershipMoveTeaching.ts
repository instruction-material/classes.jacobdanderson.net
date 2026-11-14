import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaOwnershipUnit,
	javaRefactoringUnitURL
} from "@/modules/javaRefactoringUnits";

const entries: Array<
	RawCourseModuleItem & { caseSection: string | null; sourceProject: boolean }
> = [
	{
		id: "design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-moving-features-between-objects-core-concepts",
		title: "Moving Features Between Objects Core Concepts",
		aliases: [
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-core-concepts-and-learning-sequence",
			"core-concepts",
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-core-concepts"
		],
		content:
			'**Course flow:** DPR2 separated operations inside a method. DPR3 assigns fields, rules and behavior to coherent objects while preserving the existing client API. Trace the flat design, move one method with its old entrypoint intact, then extract the fields and invariant into Phone.\n\n### Eight transformations and their purpose\n\nThe [Moving Features Between Objects catalog](https://refactoring.guru/refactoring/techniques/moving-features-between-objects) groups these transformations:\n\n| Technique | Responsibility change |\n| --- | --- |\n| Move Method | Place behavior beside the data and rules it uses. |\n| Move Field | Transfer a field and redirect its existing accesses. |\n| Extract Class | Separate a cohesive cluster of state and operations. |\n| Inline Class | Fold an unhelpful boundary into its natural owner. |\n| Hide Delegate | Offer a meaningful operation without exposing a collaborator chain. |\n| Remove Middle Man | Let an appropriate caller use the useful collaborator directly. |\n| Introduce Foreign Method | Give client code a missing or awkward operation accepting a library object. |\n| Introduce Local Extension | Provide a coherent wrapper or eligible subtype around library behavior. |\n\nFeature Envy appears when a method depends heavily on another object\'s representation. A large class can also mix unrelated responsibilities. Count the fields read and the invariant enforced, then examine actual change pressure. Moving code to a utility class that still pulls every getter can relocate the coupling without improving ownership.\n\n### The supplied flat design\n\nMember initially stores name, area and number. ContactPrinter.telephone reads the two phone getters to build a string. Member.telephone forwards to that printer, so the model and printer depend on one another. LegacyMember and LegacyPrinter preserve the baseline. ClientCompatibility is an existing client whose source stays unchanged.\n\nFirst move the formatting body into Member.telephone and keep ContactPrinter.telephone as a **temporary delegating bridge**. Both entrypoints preserve the old output. This [Move Method](https://refactoring.guru/move-method) step compiles and runs before moving fields. It removes the model-to-printer dependency while keeping the client callable.\n\nThen extract Phone: its area and number belong with their validation and formatting. Member holds one Phone and delegates its old areaCode/localNumber getters. Member.telephone hides that representation. ContactPrinter owns the surrounding label; it asks for a telephone string rather than navigating a Phone. The final dependencies are ContactPrinter → Member → Phone. Phone knows nothing about Member or the printer.\n\nA phone-format rule now changes Phone; a name rule changes Member; a label layout changes ContactPrinter. That separation justifies this boundary. If a proposed extracted type contributes no invariant or behavior, compare Inline Class. If a wrapper merely forwards a large unrelated API, compare Remove Middle Man, including the callers that would then depend on the exposed type.\n\n### Complete contact contract\n\nMember(String name,String area,String number) validates name first, area second and number third. Name is non-null, nonblank according to String.isBlank, at most 60 Unicode code points, and contains no CR, LF, < or >. Area contains exactly 2–4 ASCII digits; number exactly 4–8 ASCII digits. Null raises NullPointerException. Other invalid input raises IllegalArgumentException.\n\nRetain accepted strings exactly, including name whitespace and leading zeros. displayName(), areaCode() and localNumber() retain the supplied String identities. telephone() returns exactly (AREA) NUMBER. ContactPrinter.telephone(Member) preserves the old entrypoint and the same value. ContactPrinter.label(Member), also used by ClientCompatibility.render, returns exactly NAME <(AREA) NUMBER>. Both printer operations reject a null Member with NullPointerException.\n\nchangePhone(nextArea,nextNumber) validates the next area before the next number, then replaces both. If either fails, retain both old fields. Repeating a valid identical update is allowed; name stays fixed. Calls have no external effects or shared static state. The model is sequential, without a concurrent-access guarantee. These are the supplied exercise formatting rules.\n\nWith Mira/212/5550100, the telephone is (212) 5550100 and label is Mira <(212) 5550100>. An update to 020/123 fails because the number is too short, leaving 212/5550100 unchanged. Construct the whole replacement Phone before assigning it; immutable components alone do not make an earlier partial assignment safe.\n\n### Source layout and complete driver\n\nThe starter has 13 files; reference 14. Both include Main.java, ContractTests.java, ClientCompatibility.java, README.md, DECISIONS.md, CHECKPOINTS.md and sources.txt. The contacts package has LegacyMember, LegacyPrinter, Member and ContactPrinter. The dates package has ForeignDateMethods and BusinessDate. The reference adds src/contacts/Phone.java. Add that path to sources.txt when creating the owner.\n\nThe supplied driver is complete:\n```java\nimport java.time.LocalDate;\nimport contacts.ContactPrinter;\nimport contacts.LegacyMember;\nimport contacts.LegacyPrinter;\nimport contacts.Member;\nimport dates.BusinessDate;\nimport dates.ForeignDateMethods;\n\npublic final class Main {\n    private Main() {}\n    public static void main(String[] args) {\n        if (args.length > 0 && args[0].equals("base")) {\n            LegacyMember member = new LegacyMember("Mira", "212", "5550100");\n            System.out.println(member.telephone());\n            System.out.println(LegacyPrinter.label(member));\n            member.changePhone("020", "70001234");\n            System.out.println(LegacyPrinter.label(member));\n            System.out.println(member.areaCode() + "|" + member.localNumber());\n        } else {\n            Member member = new Member("Mira", "212", "5550100");\n            System.out.println(ContactPrinter.telephone(member));\n            System.out.println(ClientCompatibility.render(member));\n            member.changePhone("020", "70001234");\n            System.out.println(ClientCompatibility.render(member));\n            System.out.println(ClientCompatibility.readLegacyFields(member));\n        }\n        LocalDate monday = LocalDate.of(2024, 1, 1);\n        System.out.println(ForeignDateMethods.followingMonday(monday));\n        System.out.println(new BusinessDate(monday).followingMonday().date());\n    }\n}\n```\n\nUse JDK 21 from the complete role folder:\n```sh\njavac --release 21 -Xlint:all -Werror -d classes @sources.txt\njava -cp classes ContractTests base\njava -cp classes ContractTests core\njava -cp classes Main base\njava -cp classes Main\n```\n\nBoth Main modes print:\n```text\n(212) 5550100\nMira <(212) 5550100>\nMira <(020) 70001234>\n020|70001234\n2024-01-08\n2024-01-08\n```\n\nBaseline reports 3253 passed; core reports 4911 passed for both roles. The starter is already runnable. Keep LegacyMember, LegacyPrinter, ContractTests, Main and ClientCompatibility unchanged. Record the actual method-only intermediate, field extraction and valid replacement in CHECKPOINTS.md. Save each diff, exact command, observed result and recoverable prior state.\n\nCompile the completed owner without printer, client or legacy source:\n```sh\njavac --release 21 -Xlint:all -Werror -d owner-classes src/contacts/Member.java src/contacts/Phone.java\n```\n\nCompare field ownership, package arrows, public calls and files changed by one realistic rule change. A passing client verifies compatibility; the decision record separately explains whether the boundary earns its setup cost. Existing public methods remain available during this exercise. Removing them later requires caller migration and a deliberate compatibility policy.\n\n### Library friction: compare the direct operation first\n\nJava\'s [LocalDate](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html) is immutable and final. It already supports date.with(TemporalAdjusters.next(MONDAY)). The [next adjuster](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/temporal/TemporalAdjusters.html#next(java.time.DayOfWeek)) finds a strictly later weekday; a Monday advances seven days.\n\nForeignDateMethods.followingMonday(LocalDate) gives that domain operation a static name. It rejects null with NullPointerException, preserves the input, and propagates DateTimeException when the next Monday exceeds the supported range. BusinessDate is a complete composition-based [local extension](https://refactoring.guru/introduce-local-extension): date() retains the immutable input reference, and followingMonday() returns a new wrapper around the same result as the foreign helper.\n\nCompare all three choices. The direct standard operation needs no additional type. A single named helper can avoid repeated awkward expressions. A coherent set of domain operations may earn a wrapper and its conversion/forwarding cost. This final JDK class uses composition rather than subclassing. The supplied 400-date oracle compares both examples against the standard adjuster, including week, month, year and leap-day boundaries, plus null and range overflow.\n\n### Optional masked formatting\n\nAfter core, implement Member.maskedTelephone(). Keep the area, one space and parentheses as in the ordinary format. Replace all number characters except the final two with one * each. Thus 212/5550100 produces (212) *****00; 020/01234567 produces (020) ******67. Keep the full number and ordinary label unchanged. After a valid update, mask the new number. The reference places this formatting rule on Phone and delegates through Member.\n\n```sh\njava -cp classes ContractTests\n```\n\nThe complete reference reports 4991 passed; core remains complete with masking unfinished. The site IDE saves and exports the package files. Run displays the native commands; execute the exported project with JDK 21. Source activities in this unit continue the same saved role workspace; permitted reference work remains separate.\n',
		contentKind: "reading",
		preserveInstructions: true,
		learningPath: "core",
		caseSection: null,
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-moving-features-between-objects-application-check",
		title: "Moving Features Between Objects Application Check",
		aliases: [
			"application-check",
			"mini-lab-re-home-behavior-without-breaking-clients",
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-application-check",
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-mini-lab-re-home-behavior-without-breaking-clients"
		],
		content:
			"Compare the three complete following-Monday versions: the direct TemporalAdjusters.next call, ForeignDateMethods and BusinessDate. Predict Monday 2024-01-01, Tuesday 2024-01-02 and Sunday 2024-01-07, then inspect null and LocalDate.MAX behavior. Keep the input unchanged.\n\n**Completion evidence:** Record the three expected dates, the seven-day Monday rule and the exception types. Explain the additional name or wrapper each version adds, when that cost is justified, and why the final LocalDate class uses composition. Then trace ContactPrinter's getter dependence before the ownership move.",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		preserveAssignment: true,
		caseSection: "application",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-reflection-question-behavior-ownership",
		title: "Reflection Question: Behavior Ownership",
		content:
			"Written ownership analysis: distinguish the member-name rule, phone-field validation, phone presentation and surrounding label layout. Assign each to an owner in the flat, method-only and extracted designs. Compare which source files change for one revised phone format versus one revised name limit.\n\n**Completion evidence:** Name the invariant that earns Phone, its added setup and a smaller alternative. Explain why moving the same getter chain into a static utility leaves the data dependence in place. Give a condition under which an extracted class could be inlined and a forwarding layer could be removed after client migration.",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		preserveAssignment: true,
		caseSection: "reflection",
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-ownership-move-and-client-compatibility-contract",
		title: "Ownership Move and Client-Compatibility Contract",
		content:
			"Preserve the original client while moving one responsibility at a time. Compile ClientCompatibility unchanged before and after the method-only bridge, then after Phone extraction. Compare direct Member.telephone, old ContactPrinter.telephone and ClientCompatibility.render. Test a failed second-field update and retain the old state.\n\n**Completion evidence:** Record exact output, the unchanged public signatures and String identities, validation order and both fields after failure. Draw Member → Phone and ContactPrinter → Member; compile the owner without printer/client/legacy files. Treat removal of old entrypoints as a separate compatibility change with caller migration.",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		preserveAssignment: true,
		caseSection: "compatibility",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-core-project-moving-features-between-objects",
		title: "Core Project: Moving Features Between Objects",
		aliases: [
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-core-project",
			"dpr3-moving-features-between-objects-core-project",
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-dpr3-moving-features-between-objects-core-project"
		],
		content:
			"Refactor the runnable Member/ContactPrinter pair. First move the telephone formatting body into Member and delegate the old printer entrypoint. Run core. Then extract immutable Phone with area/number validation and formatting, retain the old getters as delegates, and construct a valid replacement before assigning it. Add the new package source to sources.txt.\n\n**Completion evidence:** Preserve the baseline, driver, oracle and client. Retain 4911 passing core checks, exact six-line Main output and the isolated two-source owner compile. Record real diffs and recoverable checkpoints. Explain the demonstrated ownership gain and added class/setup cost. Optional masking remains independent.",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "core",
		preserveAssignment: true,
		caseSection: "core",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-understanding-check-moving-features-between-objects",
		title: "Understanding Check: Moving Features Between Objects",
		aliases: [
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-dpr3-moving-features-between-objects-diagnostic-checkpoint",
			"diagnostic-checkpoint-moving-features-between-objects",
			"diagnostic-checkpoint",
			"understanding-check",
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-diagnostic-checkpoint-moving-features-between-objects",
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-diagnostic-checkpoint",
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-understanding-check"
		],
		content:
			"Use the same saved project to distinguish Move Method, Move Field and Extract Class in the actual sequence. Identify the temporary bridge and the operation that hides Phone. Compare preserving that bridge now with removing an unhelpful forwarding layer after callers migrate.\n\n**Completion evidence:** Trace the dependency cycle before the move and the final dependency chain. Record the existing client's output for a normal phone, retained leading zeros and a rejected update. Explain why an immutable Phone still needs validation before replacement, and why a green value check alone cannot prove a better boundary.",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		preserveAssignment: true,
		caseSection: "understanding",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-moving-features-between-objects-transfer-practice",
		title: "Moving Features Between Objects Transfer Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-transfer-practice-moving-features-between-objects",
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-transfer-practice"
		],
		content:
			"Written transfer: a proposed design adds Member.phone() so every client can call phone.areaCode(), phone.localNumber() and assemble its own format. Another proposal replaces the phone before validating the next number. A third introduces a BusinessDate wrapper for one otherwise clear standard-library call.\n\n**Completion evidence:** Identify the representation coupling, failed-update state risk and extra wrapper cost. Give a safer collaboration or an explicit changed contract for each. Compare Hide Delegate with Remove Middle Man using the caller's actual responsibility, then state a demonstrated scenario that would justify the wrapper.",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "choice",
		preserveAssignment: true,
		caseSection: "transfer",
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-moving-features-between-objects-extension-practice",
		title: "Moving Features Between Objects Extension Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-extension-practice-moving-features-between-objects",
			"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-extension-practice"
		],
		content:
			"Implement optional maskedTelephone after the ownership move. Place the mask rule with the phone fields and retain Member as the caller boundary. Preserve the ordinary telephone, all getters, label output and update failure behavior. Mask all number characters except the final two and recalculate after a valid update.\n\n**Completion evidence:** Check number lengths 4 and 8, leading zeros and a subsequent changePhone. Retain 4911 core checks and 4991 complete checks. Verify that the full number stays unchanged and that the new rule belongs to the extracted owner, with no duplicated client formatting.",
		contentKind: "assignment",
		preserveInstructions: true,
		learningPath: "challenge",
		preserveAssignment: true,
		caseSection: "extension",
		sourceProject: true
	}
];
export function completeJavaOwnershipMove(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPR3 Moving Features Between Objects") return module;
	const complete = (entry: (typeof entries)[number]): RawCourseModuleItem => {
		const { caseSection, sourceProject, ...item } = entry;
		let content = item.content;
		if (caseSection) {
			const path = `/course-assets/design-patterns-in-java/ownership-move-checks.md#${
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
						projectLink: javaRefactoringUnitURL(
							javaOwnershipUnit.id,
							"starter"
						),
						solutionLink: javaRefactoringUnitURL(
							javaOwnershipUnit.id,
							"solution"
						)
					}
				: {})
		};
	};
	return {
		...module,
		id: javaOwnershipUnit.moduleID,
		curriculum: entries.slice(0, 5).map(complete),
		supplementalProjects: entries.slice(5).map(complete)
	};
}
