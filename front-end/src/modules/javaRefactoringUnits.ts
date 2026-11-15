import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaRefactoringFinalUnits } from "./javaRefactoringFinalUnits";
import { javaRefactoringPracticeUnits } from "./javaRefactoringPracticeUnits";

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
export const javaMethodCallsUnit = {
	id: "method-calls",
	courseID: "design-patterns-in-java-part-2",
	revision: "51bfd80e0004a446246469b55b5f2e0c560cc207",
	pack: "DPR6-Method-Calls-Packs",
	layout: "src/dispatch, src/dispatch/optional and sources.txt",
	moduleID: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls",
	readingID:
		"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-simplifying-method-calls-core-concepts",
	coreID: "design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-core-project-simplifying-method-calls",
	sourceItems: [
		"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-simplifying-method-calls-application-check",
		"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-public-api-compatibility-contract",
		"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-null-optional-and-exception-boundary",
		"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-curriculum-core-project-simplifying-method-calls",
		"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-simplifying-method-calls-extension-practice"
	],
	independentItems: [
		"design-patterns-in-java-part-2-dpr6-simplifying-method-calls-supplemental-simplifying-method-calls-extension-practice"
	],
	files: {
		starter: [
			"src/dispatch/DispatchService.java",
			"ClientCompatibility.java",
			"ContractChecks.java",
			"Main.java",
			"README.md",
			"REFACTORING.md",
			"SOURCES.md",
			"sources.txt",
			"src/dispatch/CompatibilityDesk.java",
			"src/dispatch/DeliverySpeed.java",
			"src/dispatch/DispatchLog.java",
			"src/dispatch/LegacyDesk.java",
			"src/dispatch/Parcel.java",
			"src/dispatch/Quote.java",
			"src/dispatch/optional/LabelQueue.java",
			"src/dispatch/optional/LegacyQueueClient.java",
			"src/dispatch/optional/OptionalChecks.java",
			"src/dispatch/optional/QueueClient.java"
		],
		solution: [
			"src/dispatch/DispatchService.java",
			"ClientCompatibility.java",
			"ContractChecks.java",
			"Main.java",
			"README.md",
			"REFACTORING.md",
			"SOURCES.md",
			"sources.txt",
			"src/dispatch/CompatibilityDesk.java",
			"src/dispatch/DeliverySpeed.java",
			"src/dispatch/DispatchLog.java",
			"src/dispatch/LegacyDesk.java",
			"src/dispatch/Parcel.java",
			"src/dispatch/Quote.java",
			"src/dispatch/optional/LabelQueue.java",
			"src/dispatch/optional/LegacyQueueClient.java",
			"src/dispatch/optional/OptionalChecks.java",
			"src/dispatch/optional/QueueClient.java"
		]
	},
	instructions: [
		"Java 21 method-call migration and API compatibility",
		'javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out "@sources.txt"',
		"java -ea -cp out Main baseline",
		"java -ea -cp out ContractChecks baseline",
		"java -ea -cp out ContractChecks core",
		"java -da -cp out ContractChecks core",
		"java -ea -cp out Main core",
		"Baseline covers 576 rows and 2319 checks. Completed core covers 576 rows and 9266 checks; both Main modes print the same six lines.",
		"Required TODOs: DispatchService.quote, DispatchService.send and CompatibilityDesk.price.",
		"Optional: java -ea -cp out dispatch.optional.OptionalChecks baseline",
		"Optional completed client: java -ea -cp out dispatch.optional.OptionalChecks full",
		"The optional queue covers 21 queue lengths and 507 checks; it has a separate saved attempt and does not depend on dispatch TODOs.",
		"Run displays native Java commands. These programs read no standard input."
	]
} as const;
export const javaGeneralizationUnit = {
	id: "generalization",
	courseID: "design-patterns-in-java-part-2",
	revision: "0a5f53be17db36972ec699584cf7c5b666fddd18",
	pack: "DPR7-Generalization-Packs",
	layout: "src/roster, src/reports, src/events and sources.txt",
	moduleID: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization",
	readingID:
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-dealing-with-generalization-core-concepts",
	coreID: "design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-core-project-dealing-with-generalization",
	sourceItems: [
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-dealing-with-generalization-application-check",
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-substitutability-and-hierarchy-exit-contract",
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-curriculum-core-project-dealing-with-generalization",
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-dealing-with-generalization-transfer-practice",
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-dealing-with-generalization-extension-practice"
	],
	independentItems: [
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-dealing-with-generalization-transfer-practice",
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-dealing-with-generalization-extension-practice"
	],
	files: {
		starter: [
			"Main.java",
			"src/roster/Roster.java",
			"ContractChecks.java",
			"README.md",
			"REFACTORING.md",
			"SOURCES.md",
			"sources.txt",
			"src/events/Counter.java",
			"src/events/CounterAPI.java",
			"src/events/EventBuffer.java",
			"src/events/EventBufferAPI.java",
			"src/events/EventFactory.java",
			"src/events/LegacyEventModels.java",
			"src/events/NamedCounter.java",
			"src/events/NamedValue.java",
			"src/reports/Format.java",
			"src/reports/LegacyReports.java",
			"src/reports/ReportService.java",
			"src/reports/Row.java",
			"src/roster/CompatibilityClient.java",
			"src/roster/LegacyRoster.java",
			"src/roster/Mentor.java",
			"src/roster/MentorFormatter.java",
			"src/roster/RoleFormatter.java",
			"src/roster/RosterAPI.java",
			"src/roster/SponsorBanner.java",
			"src/roster/Volunteer.java",
			"src/roster/VolunteerFormatter.java"
		],
		solution: [
			"Main.java",
			"src/roster/Roster.java",
			"ContractChecks.java",
			"README.md",
			"REFACTORING.md",
			"SOURCES.md",
			"sources.txt",
			"src/events/Counter.java",
			"src/events/CounterAPI.java",
			"src/events/EventBuffer.java",
			"src/events/EventBufferAPI.java",
			"src/events/EventFactory.java",
			"src/events/LegacyEventModels.java",
			"src/events/NamedCounter.java",
			"src/events/NamedValue.java",
			"src/reports/CsvReport.java",
			"src/reports/Format.java",
			"src/reports/LegacyReports.java",
			"src/reports/PlainReport.java",
			"src/reports/Report.java",
			"src/reports/ReportService.java",
			"src/reports/Row.java",
			"src/roster/CompatibilityClient.java",
			"src/roster/LegacyRoster.java",
			"src/roster/LineSource.java",
			"src/roster/Member.java",
			"src/roster/Mentor.java",
			"src/roster/RosterAPI.java",
			"src/roster/SponsorBanner.java",
			"src/roster/Volunteer.java"
		]
	},
	instructions: [
		"Java 21 generalization: roster hierarchy",
		"Export every project file and keep the package directories. Add extracted types to sources.txt and remove retired formatter paths.",
		"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
		"java -ea -cp out Main baseline",
		"java -ea -cp out ContractChecks baseline",
		"java -ea -cp out Main core",
		"java -ea -cp out ContractChecks core",
		"java -da -cp out ContractChecks core",
		"Core completes the roster hierarchy and common line interface. The optional report/event projects are independent.",
		"Clean an earlier generated out directory after removing obsolete classes.",
		"Run displays native Java commands. These programs read no standard input."
	],
	instructionsByItem: {
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-dealing-with-generalization-transfer-practice":
			[
				"Java 21 optional report-template project",
				"Core roster files may remain at the starter design. Add Report, PlainReport and CsvReport paths to sources.txt.",
				"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
				"java -ea -cp out Main transfer-baseline",
				"java -ea -cp out Main transfer",
				"java -ea -cp out ContractChecks transfer",
				"java -da -cp out ContractChecks transfer",
				"Keep the common render order and move CSV-specific members into CsvReport.",
				"Run displays native Java commands. These programs read no standard input."
			],
		"design-patterns-in-java-part-2-dpr7-dealing-with-generalization-supplemental-dealing-with-generalization-extension-practice":
			[
				"Java 21 optional event/counter relationships",
				"Core roster and report files may remain at their starter designs.",
				"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
				"java -ea -cp out Main extension-baseline",
				"java -ea -cp out Main extension",
				"java -ea -cp out ContractChecks extension",
				"java -da -cp out ContractChecks extension",
				"Replace list inheritance with composition, remove DefaultEventBuffer and inherit the unchanged Counter contract.",
				"Clean an earlier generated out directory after removing obsolete classes.",
				"Run displays native Java commands. These programs read no standard input."
			]
	},
	changesFiles: true
} as const;
export const javaPatternJourneysUnit = {
	id: "pattern-journeys",
	courseID: "design-patterns-in-java-part-2",
	revision: "9dc0cd44aab53f25982938676492c4980df3e682",
	pack: "DPR8-Pattern-Journeys-Packs",
	layout: "src/notices, src/tickets, src/editor and sources.txt",
	moduleID: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns",
	readingID:
		"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-refactoring-toward-patterns-core-concepts",
	coreID: "design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-core-project-refactoring-toward-patterns",
	sourceItems: [
		"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-pattern-arrival-evidence-and-exit-trigger",
		"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-curriculum-core-project-refactoring-toward-patterns",
		"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-refactoring-toward-patterns-transfer-practice",
		"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-refactoring-toward-patterns-extension-practice"
	],
	independentItems: [
		"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-refactoring-toward-patterns-transfer-practice",
		"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-refactoring-toward-patterns-extension-practice"
	],
	files: {
		starter: [
			"Main.java",
			"CompatibilityClient.java",
			"ContractChecks.java",
			"README.md",
			"REFACTORING.md",
			"SOURCES.md",
			"sources.txt",
			"src/editor/AncientDay.java",
			"src/editor/Editor.java",
			"src/editor/EditorAPI.java",
			"src/editor/LegacyEditor.java",
			"src/notices/LegacyNotices.java",
			"src/notices/Notice.java",
			"src/notices/NoticeAPI.java",
			"src/notices/NoticeService.java",
			"src/tickets/GuardTicket.java",
			"src/tickets/LegacyTicket.java",
			"src/tickets/StrategyTicket.java",
			"src/tickets/Ticket.java",
			"src/tickets/TicketAPI.java"
		],
		solution: [
			"Main.java",
			"CompatibilityClient.java",
			"ContractChecks.java",
			"README.md",
			"REFACTORING.md",
			"SOURCES.md",
			"sources.txt",
			"src/editor/AncientDay.java",
			"src/editor/AppendCommand.java",
			"src/editor/CommandHistory.java",
			"src/editor/DayAdapter.java",
			"src/editor/DayExtension.java",
			"src/editor/EditCommand.java",
			"src/editor/Editor.java",
			"src/editor/EditorAPI.java",
			"src/editor/LegacyEditor.java",
			"src/editor/NoteDate.java",
			"src/editor/TextBuffer.java",
			"src/notices/BracketCreator.java",
			"src/notices/LegacyNotices.java",
			"src/notices/Notice.java",
			"src/notices/NoticeAPI.java",
			"src/notices/NoticeCreator.java",
			"src/notices/NoticeLine.java",
			"src/notices/NoticeService.java",
			"src/notices/Ordering.java",
			"src/notices/OriginalOrder.java",
			"src/notices/ReversedOrder.java",
			"src/notices/TextCreator.java",
			"src/tickets/GuardTicket.java",
			"src/tickets/LegacyTicket.java",
			"src/tickets/StrategyTicket.java",
			"src/tickets/Ticket.java",
			"src/tickets/TicketAPI.java",
			"src/tickets/TicketState.java"
		]
	},
	instructions: [
		"Java 21 notice creation and ordering",
		"Add extracted Java types to sources.txt and preserve all package directories.",
		"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
		"java -ea -cp out Main baseline",
		"java -ea -cp out ContractChecks baseline",
		"java -ea -cp out Main core",
		"java -ea -cp out ContractChecks core",
		"java -da -cp out ContractChecks core",
		"The three projects can be completed independently. Keep the frozen API, Legacy sources and checks unchanged.",
		"Run displays native Java commands. These programs read no standard input."
	],
	instructionsByItem: {
		"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-refactoring-toward-patterns-transfer-practice":
			[
				"Java 21 optional state-transition comparison",
				"Add extracted Java types to sources.txt and preserve all package directories.",
				"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
				"java -ea -cp out Main transfer-baseline",
				"java -ea -cp out ContractChecks baseline",
				"java -ea -cp out Main transfer",
				"java -ea -cp out ContractChecks transfer",
				"java -da -cp out ContractChecks transfer",
				"The three projects can be completed independently. Keep the frozen API, Legacy sources and checks unchanged.",
				"Run displays native Java commands. These programs read no standard input."
			],
		"design-patterns-in-java-part-2-dpr8-refactoring-toward-patterns-supplemental-refactoring-toward-patterns-extension-practice":
			[
				"Java 21 optional editor boundaries and undo",
				"Add extracted Java types to sources.txt and preserve all package directories.",
				"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
				"java -ea -cp out Main extension-baseline",
				"java -ea -cp out ContractChecks baseline",
				"java -ea -cp out Main extension",
				"java -ea -cp out ContractChecks extension",
				"java -da -cp out ContractChecks extension",
				"The three projects can be completed independently. Keep the frozen API, Legacy sources and checks unchanged.",
				"Run displays native Java commands. These programs read no standard input."
			]
	},
	changesFiles: true
} as const;
export const javaTestabilityUnit = {
	id: "testability",
	courseID: "design-patterns-in-java-part-2",
	revision: "aa80994ca32be755f09b68efbd583a689eecdcce",
	pack: "DPR9-Testability-Packs",
	layout: "src/journal and sources.txt",
	moduleID:
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence",
	readingID:
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-testability-di-and-refactoring-with-confidence-core-concepts",
	coreID: "design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-core-project-testability-di-and-refactoring-with-confidence",
	sourceItems: [
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-legacy-side-effect-seam-catalog",
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-characterization-test-quality-contract",
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-curriculum-core-project-testability-di-and-refactoring-with-confidence",
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-testability-di-and-refactoring-with-confidence-transfer-practice",
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-testability-di-and-refactoring-with-confidence-extension-practice"
	],
	independentItems: [
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-testability-di-and-refactoring-with-confidence-transfer-practice",
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-testability-di-and-refactoring-with-confidence-extension-practice"
	],
	files: {
		starter: [
			"Main.java",
			"CompatibilityClient.java",
			"ContractChecks.java",
			"README.md",
			"REFACTORING.md",
			"SOURCES.md",
			"sources.txt",
			"src/journal/CaptureNormalizer.java",
			"src/journal/DispatchJournal.java",
			"src/journal/Entry.java",
			"src/journal/EntrySink.java",
			"src/journal/JournalAPI.java",
			"src/journal/LegacyJournal.java",
			"src/journal/RetryingSink.java"
		],
		solution: [
			"Main.java",
			"CompatibilityClient.java",
			"ContractChecks.java",
			"README.md",
			"REFACTORING.md",
			"SOURCES.md",
			"sources.txt",
			"src/journal/CaptureNormalizer.java",
			"src/journal/DispatchJournal.java",
			"src/journal/Entry.java",
			"src/journal/EntrySink.java",
			"src/journal/JournalAPI.java",
			"src/journal/LegacyJournal.java",
			"src/journal/RetryingSink.java"
		]
	},
	instructions: [
		"Java 21 dependency seams and exact journal checks",
		"Preserve the package folders and include learner-written Java checks in sources.txt.",
		"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
		"java -ea -cp out ContractChecks baseline",
		"java -da -cp out ContractChecks baseline",
		"java -cp out Main baseline",
		"java -cp out Main core",
		"java -ea -cp out ContractChecks core",
		"java -da -cp out ContractChecks core",
		"Default output uses the current instant and a random ID. Injected checks supply exact values.",
		"The three projects can be completed independently. Keep frozen APIs, LegacyJournal and ContractChecks unchanged.",
		"Run displays native Java commands. These programs read no standard input."
	],
	instructionsByItem: {
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-testability-di-and-refactoring-with-confidence-transfer-practice":
			[
				"Java 21 optional volatile-output normalization",
				"Preserve the package folders and include learner-written Java checks in sources.txt.",
				"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
				"java -ea -cp out ContractChecks baseline",
				"java -da -cp out ContractChecks baseline",
				"java -cp out Main baseline",
				"java -cp out Main core",
				"java -ea -cp out ContractChecks transfer",
				"java -da -cp out ContractChecks transfer",
				"Default output uses the current instant and a random ID. Injected checks supply exact values.",
				"The three projects can be completed independently. Keep frozen APIs, LegacyJournal and ContractChecks unchanged.",
				"Run displays native Java commands. These programs read no standard input."
			],
		"design-patterns-in-java-part-2-dpr9-testability-di-and-refactoring-with-confidence-supplemental-testability-di-and-refactoring-with-confidence-extension-practice":
			[
				"Java 21 optional bounded output retry",
				"Preserve the package folders and include learner-written Java checks in sources.txt.",
				"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
				"java -ea -cp out ContractChecks baseline",
				"java -da -cp out ContractChecks baseline",
				"java -cp out Main baseline",
				"java -cp out Main core",
				"java -ea -cp out ContractChecks extension",
				"java -da -cp out ContractChecks extension",
				"Default output uses the current instant and a random ID. Injected checks supply exact values.",
				"The three projects can be completed independently. Keep frozen APIs, LegacyJournal and ContractChecks unchanged.",
				"Run displays native Java commands. These programs read no standard input."
			]
	},
	changesFiles: true
} as const;
export const javaRefactoringUnits = [
	javaOwnershipUnit,
	javaValueDataUnit,
	javaConditionalFlowUnit,
	javaMethodCallsUnit,
	javaGeneralizationUnit,
	javaPatternJourneysUnit,
	javaTestabilityUnit,
	...javaRefactoringFinalUnits,
	...javaRefactoringPracticeUnits
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
	const instructions =
		"instructionsByItem" in unit
			? ((unit.instructionsByItem as Record<string, readonly string[]>)[
					item
				] ?? unit.instructions)
			: unit.instructions;
	const layout =
		"changesFiles" in unit && unit.changesFiles
			? "Export all project files, including extracted types and the current sources.txt."
			: `Export all ${files.length} role files, including ${
					unit.layout
				}.`;
	return [instructions[0], layout, ...instructions.slice(1)];
}
