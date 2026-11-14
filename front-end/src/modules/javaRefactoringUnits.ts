import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const javaOwnershipUnit = {
	id: "ownership-move",
	courseID: "design-patterns-in-java-part-2",
	revision: "c52d7badc93d4c15e921b5e8e515d03047fe1a05",
	pack: "DPR3-Contact-Ownership-Packs",
	layout: "src/contacts, src/dates and ClientCompatibility.java",
	moduleID:
		"design-patterns-in-java-part-2-dpr3-moving-features-between-objects",
	readingID:
		"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-moving-features-between-objects-core-concepts",
	coreID: "design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-core-project-moving-features-between-objects",
	sourceItems: [
		"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-moving-features-between-objects-core-concepts",
		"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-moving-features-between-objects-application-check",
		"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-ownership-move-and-client-compatibility-contract",
		"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-curriculum-core-project-moving-features-between-objects",
		"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-understanding-check-moving-features-between-objects",
		"design-patterns-in-java-part-2-dpr3-moving-features-between-objects-supplemental-moving-features-between-objects-extension-practice"
	],
	files: {
		starter: [
			"CHECKPOINTS.md",
			"ClientCompatibility.java",
			"ContractTests.java",
			"DECISIONS.md",
			"Main.java",
			"README.md",
			"sources.txt",
			"src/contacts/ContactPrinter.java",
			"src/contacts/LegacyMember.java",
			"src/contacts/LegacyPrinter.java",
			"src/contacts/Member.java",
			"src/dates/BusinessDate.java",
			"src/dates/ForeignDateMethods.java"
		],
		solution: [
			"CHECKPOINTS.md",
			"ClientCompatibility.java",
			"ContractTests.java",
			"DECISIONS.md",
			"Main.java",
			"README.md",
			"sources.txt",
			"src/contacts/ContactPrinter.java",
			"src/contacts/LegacyMember.java",
			"src/contacts/LegacyPrinter.java",
			"src/contacts/Member.java",
			"src/contacts/Phone.java",
			"src/dates/BusinessDate.java",
			"src/dates/ForeignDateMethods.java"
		]
	},
	instructions: [
		"Java 21 ownership move and client compatibility",
		"javac --release 21 -Xlint:all -Werror -d classes @sources.txt",
		"java -cp classes ContractTests base",
		"java -cp classes ContractTests core",
		"java -cp classes Main base",
		"java -cp classes Main",
		"Baseline reports 3253 passed; core reports 4911 passed. Both Main modes print the same six lines in the lesson.",
		"Preserve ClientCompatibility.java and the package tree. Add src/contacts/Phone.java to sources.txt when extracting the owner.",
		"After optional masked formatting: java -cp classes ContractTests",
		"The complete reference reports 4991 passed; core is independent of masking.",
		"Run displays native Java 21 commands. These programs read no standard input."
	]
} as const;
export const javaValueDataUnit = {
	id: "value-data",
	courseID: "design-patterns-in-java-part-2",
	revision: "3b76c2d4d865499a2dd305b47635298c30dc27a9",
	pack: "DPR4-Value-Data-Packs",
	layout: "src/supplies and ClientCompatibility.java",
	moduleID: "design-patterns-in-java-part-2-dpr4-organizing-data",
	readingID:
		"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-organizing-data-core-concepts",
	coreID: "design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-core-project-organizing-data",
	sourceItems: [
		"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-organizing-data-core-concepts",
		"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-data-modeling-lab-upgrade-a-weak-domain-model",
		"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-value-semantics-and-collection-ownership",
		"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-data-migration-and-compatibility-check",
		"design-patterns-in-java-part-2-dpr4-organizing-data-curriculum-core-project-organizing-data",
		"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-organizing-data-transfer-practice",
		"design-patterns-in-java-part-2-dpr4-organizing-data-supplemental-organizing-data-extension-practice"
	],
	files: {
		starter: [
			"CHECKPOINTS.md",
			"ClientCompatibility.java",
			"ContractTests.java",
			"DECISIONS.md",
			"Main.java",
			"README.md",
			"sources.txt",
			"src/supplies/ItemCode.java",
			"src/supplies/LegacySupplyRequest.java",
			"src/supplies/RequestCodec.java",
			"src/supplies/RequestLine.java",
			"src/supplies/ServiceLevel.java",
			"src/supplies/SupplyRequest.java"
		],
		solution: [
			"CHECKPOINTS.md",
			"ClientCompatibility.java",
			"ContractTests.java",
			"DECISIONS.md",
			"Main.java",
			"README.md",
			"sources.txt",
			"src/supplies/ItemCode.java",
			"src/supplies/LegacySupplyRequest.java",
			"src/supplies/RequestCodec.java",
			"src/supplies/RequestLine.java",
			"src/supplies/ServiceLevel.java",
			"src/supplies/SupplyRequest.java"
		]
	},
	instructions: [
		"Java 21 value data and compatible transport",
		"javac --release 21 -Xlint:all -Werror -d classes @sources.txt",
		"java -cp classes ContractTests base",
		"java -cp classes ContractTests core",
		"java -cp classes Main base",
		"java -cp classes Main",
		"Baseline reports 1673 passed; completed core reports 1704 passed. The unmodified starter intentionally fails core until the typed-value tasks are finished.",
		"After optional duplicate-line merging: java -cp classes ContractTests",
		"The complete reference reports 1709 passed; core remains independent of merging.",
		"Keep the baseline, ClientCompatibility.java and package tree unchanged. These programs read no standard input; Run displays native Java 21 commands."
	]
} as const;
export const javaConditionalFlowUnit = {
	id: "conditional-flow",
	courseID: "design-patterns-in-java-part-2",
	revision: "865d2215718312720de63ed79cdb3a192cbea350",
	pack: "DPR5-Conditional-Flow-Packs",
	layout: "src/lab, src/lab/optional and sources.txt",
	moduleID:
		"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions",
	readingID:
		"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-simplifying-conditional-expressions-core-concepts",
	coreID: "design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-core-project-simplifying-conditional-expressions",
	sourceItems: [
		"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-simplifying-conditional-expressions-application-check",
		"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-decision-table-and-branch-equivalence-contract",
		"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-curriculum-core-project-simplifying-conditional-expressions",
		"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-simplifying-conditional-expressions-extension-practice"
	],
	independentItems: [
		"design-patterns-in-java-part-2-dpr5-simplifying-conditional-expressions-supplemental-simplifying-conditional-expressions-extension-practice"
	],
	files: {
		starter: [
			"src/lab/GatePolicy.java",
			"README.md",
			"REFACTORING.md",
			"sources.txt",
			"src/lab/AdmissionPolicy.java",
			"src/lab/AuditTrail.java",
			"src/lab/BookingClient.java",
			"src/lab/BookingData.java",
			"src/lab/CoreChecks.java",
			"src/lab/CoreDemo.java",
			"src/lab/Inputs.java",
			"src/lab/LegacyGate.java",
			"src/lab/optional/FeePolicies.java",
			"src/lab/optional/LegacyOptionalWorkflow.java",
			"src/lab/optional/OptionalChecks.java",
			"src/lab/optional/OptionalDemo.java",
			"src/lab/optional/OptionalWorkflow.java",
			"src/lab/optional/StatusReporter.java"
		],
		solution: [
			"src/lab/GatePolicy.java",
			"README.md",
			"REFACTORING.md",
			"sources.txt",
			"src/lab/AdmissionPolicy.java",
			"src/lab/AuditTrail.java",
			"src/lab/BookingClient.java",
			"src/lab/BookingData.java",
			"src/lab/CoreChecks.java",
			"src/lab/CoreDemo.java",
			"src/lab/Inputs.java",
			"src/lab/LegacyGate.java",
			"src/lab/optional/FeePolicies.java",
			"src/lab/optional/LegacyOptionalWorkflow.java",
			"src/lab/optional/OptionalChecks.java",
			"src/lab/optional/OptionalDemo.java",
			"src/lab/optional/OptionalWorkflow.java",
			"src/lab/optional/StatusReporter.java"
		]
	},
	instructions: [
		"Java 21 conditional-flow refactoring",
		'javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out "@sources.txt"',
		"java -ea -cp out lab.CoreDemo baseline",
		"java -ea -cp out lab.CoreChecks baseline",
		"java -ea -cp out lab.CoreChecks core",
		"java -da -cp out lab.CoreChecks core",
		"java -ea -cp out lab.CoreChecks assertions",
		"java -da -cp out lab.CoreChecks assertions",
		"Baseline and completed core cover 144000 rows and 576017 explicit checks. The untouched starter core is intentionally unfinished.",
		"Optional: java -ea -cp out lab.optional.OptionalChecks baseline",
		"Optional completed workflow: java -ea -cp out lab.optional.OptionalChecks full",
		"Run displays native Java commands. These programs read no standard input. The full solution covers 720 fee pairs and 720 workflow cases.",
		"The optional project has a separate saved attempt. Copy the completed GatePolicy.java from the core attempt before implementing optional fee/reporting TODOs."
	]
} as const;
export const javaRefactoringUnits = [
	javaOwnershipUnit,
	javaValueDataUnit,
	javaConditionalFlowUnit
] as const;
type Role = "starter" | "solution";
export function javaRefactoringUnitURL(id: string, role: Role) {
	const unit = javaRefactoringUnits.find(unit => unit.id === id);
	if (!unit) throw new Error("Unknown refactoring unit");
	return `https://github.com/instruction-material/Java-Level-3/tree/${unit.revision}/${unit.pack}/${role}`;
}
export function javaRefactoringUnitResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3"
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (extra !== undefined || (role !== "starter" && role !== "solution"))
		return null;
	const unit = javaRefactoringUnits.find(
		unit => unit.pack === pack && unit.revision === resource.ref
	);
	return unit ? ({ unit, resource, role } as const) : null;
}
export function javaRefactoringUnitProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaRefactoringUnitResource(url);
	if (
		!selected ||
		courseID !== selected.unit.courseID ||
		!(selected.unit.sourceItems as readonly string[]).includes(itemID) ||
		selected.role !== (role === "starter" ? "starter" : "solution")
	) {
		return [courseID, itemID, role].join(":");
	}
	return [
		courseID,
		"independentItems" in selected.unit &&
		(selected.unit.independentItems as readonly string[]).includes(itemID)
			? itemID
			: role === "starter"
				? selected.unit.coreID
				: selected.unit.readingID,
		role,
		`native-java-${selected.unit.id}`
	].join(":");
}
export function javaRefactoringUnitImportFiles(url: string) {
	const selected = javaRefactoringUnitResource(url);
	if (!selected) return null;
	return selected.unit.files[selected.role].map(name => {
		const path = `${selected.resource.path}/${name}`;
		return {
			name,
			file: {
				path,
				label: name,
				size: null,
				htmlUrl: `https://github.com/instruction-material/Java-Level-3/blob/${selected.unit.revision}/${path}`,
				rawUrl: githubRawUrl(selected.resource, path)
			}
		};
	});
}
export function javaRefactoringUnitNativeInstructions(
	key?: string
): string[] | null {
	const parts = (key ?? "").split(":");
	if (parts.length !== 4) return null;
	const [course, item, role, suffix] = parts;
	const unit = javaRefactoringUnits.find(
		unit => unit.courseID === course && suffix === `native-java-${unit.id}`
	);
	if (
		!unit ||
		(role !== "starter" && role !== "reference") ||
		(item !== (role === "starter" ? unit.coreID : unit.readingID) &&
			!(
				"independentItems" in unit &&
				(unit.independentItems as readonly string[]).includes(item)
			))
	) {
		return null;
	}
	const files = unit.files[role === "starter" ? "starter" : "solution"];
	return [
		unit.instructions[0],
		`Export all ${files.length} role files, including ${unit.layout}.`,
		...unit.instructions.slice(1)
	];
}
