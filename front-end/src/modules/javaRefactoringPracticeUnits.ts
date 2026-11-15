export const javaRefactoringPracticeUnits = [
	{
		id: "practice-strategy",
		courseID: "design-patterns-in-java-part-2",
		revision: "863f2ba2ad2fe6c8c20681e3fdff6eeeb7170be9",
		pack: "DPJ-Studio-Strategy-Selection-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID: "design-patterns-in-java-part-2-project-practice-guide",
		readingID:
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-if-else-behavior-into-strategy",
		coreID: "design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-if-else-behavior-into-strategy",
		sourceItems: [
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-if-else-behavior-into-strategy"
		],
		independentItems: [
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-if-else-behavior-into-strategy"
		],
		files: {
			starter: [
				"Main.java",
				"ContractTests.java",
				"DECISIONS.md",
				"README.md",
				"sources.txt",
				"src/pricing/CartPricer.java",
				"src/pricing/Plan.java",
				"src/pricing/PricingRule.java",
				"src/pricing/legacy/LegacyPricer.java"
			],
			solution: [
				"Main.java",
				"ContractTests.java",
				"DECISIONS.md",
				"README.md",
				"sources.txt",
				"src/pricing/CartPricer.java",
				"src/pricing/Plan.java",
				"src/pricing/PricingRule.java",
				"src/pricing/legacy/LegacyPricer.java",
				"src/pricing/rules/BulkRule.java",
				"src/pricing/rules/FlatRule.java",
				"src/pricing/rules/MemberRule.java"
			]
		},
		instructions: [
			"Java 21 optional strategy refactoring practice",
			"Use the complete README contract, package tree and current sources.txt.",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d classes @sources.txt",
			"java -ea -cp classes ContractTests core",
			"java -da -cp classes ContractTests core",
			"Complete the pack's required core before the targeted review; other optional tasks stay separate.",
			"Run displays native commands. These programs read no standard input."
		]
	},
	{
		id: "practice-architecture",
		courseID: "design-patterns-in-java-part-2",
		revision: "863f2ba2ad2fe6c8c20681e3fdff6eeeb7170be9",
		pack: "DPJ-Studio-Architecture-Judgment-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID: "design-patterns-in-java-part-2-project-practice-guide",
		readingID:
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-a-mini-app-with-tests-before-and-after",
		coreID: "design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-a-mini-app-with-tests-before-and-after",
		sourceItems: [
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-a-mini-app-with-tests-before-and-after"
		],
		independentItems: [
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-refactor-a-mini-app-with-tests-before-and-after"
		],
		files: {
			starter: [
				"Main.java",
				"ContractTests.java",
				"DECISIONS.md",
				"README.md",
				"sources.txt",
				"src/notebook/Composition.java",
				"src/notebook/NotebookDesk.java",
				"src/notebook/api/Action.java",
				"src/notebook/api/AuditSink.java",
				"src/notebook/api/Note.java",
				"src/notebook/api/Notebook.java",
				"src/notebook/legacy/LegacyNotebook.java"
			],
			solution: [
				"Main.java",
				"ArchitectureProbe.java",
				"ContractTests.java",
				"DECISIONS.md",
				"README.md",
				"sources.txt",
				"src/notebook/Composition.java",
				"src/notebook/api/Action.java",
				"src/notebook/api/AuditSink.java",
				"src/notebook/api/Note.java",
				"src/notebook/api/Notebook.java",
				"src/notebook/application/NotebookService.java",
				"src/notebook/legacy/LegacyNotebook.java",
				"src/notebook/memory/MemoryNotes.java",
				"src/notebook/ports/NoteRepository.java"
			]
		},
		instructions: [
			"Java 21 optional architecture refactoring practice",
			"Use the complete README contract, package tree and current sources.txt.",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d classes @sources.txt",
			"java -ea -cp classes ContractTests core",
			"java -da -cp classes ContractTests core",
			"Complete the pack's required core before the targeted review; other optional tasks stay separate.",
			"Run displays native commands. These programs read no standard input."
		]
	},
	{
		id: "practice-collaboration",
		courseID: "design-patterns-in-java-part-2",
		revision: "c137b8cb5a0fec3c3a2effde9fc72d5e86ce394e",
		pack: "DPJ7-Editor-Collaboration-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID: "design-patterns-in-java-part-2-project-practice-guide",
		readingID:
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-add-observer-events-to-a-small-model",
		coreID: "design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-add-observer-events-to-a-small-model",
		sourceItems: [
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-add-observer-events-to-a-small-model",
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-implement-command-based-undo"
		],
		independentItems: [
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-add-observer-events-to-a-small-model",
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-implement-command-based-undo"
		],
		files: {
			starter: [
				"Main.java",
				"ContractTests.java",
				"README.md",
				"sources.txt",
				"src/editor/EditCommand.java",
				"src/editor/EditEvent.java",
				"src/editor/EditorMediator.java",
				"src/editor/EventBus.java",
				"src/editor/Nodes.java",
				"src/editor/ReplaceCommand.java",
				"src/editor/TextDocument.java",
				"src/editor/TextVisitor.java",
				"src/editor/Validation.java"
			],
			solution: [
				"Main.java",
				"ContractTests.java",
				"README.md",
				"sources.txt",
				"src/editor/EditCommand.java",
				"src/editor/EditEvent.java",
				"src/editor/EditorMediator.java",
				"src/editor/EventBus.java",
				"src/editor/Nodes.java",
				"src/editor/ReplaceCommand.java",
				"src/editor/TextDocument.java",
				"src/editor/TextVisitor.java",
				"src/editor/Validation.java"
			]
		},
		instructions: [
			"Java 21 optional collaboration refactoring practice",
			"Use the complete README contract, package tree and current sources.txt.",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d classes @sources.txt",
			"java -ea -cp classes ContractTests core",
			"java -da -cp classes ContractTests core",
			"Complete the pack's required core before the targeted review; other optional tasks stay separate.",
			"Run displays native commands. These programs read no standard input."
		]
	},
	{
		id: "practice-creational",
		courseID: "design-patterns-in-java-part-2",
		revision: "b82c4e7e50be39652407661e402d1e17c75c65a7",
		pack: "DPJ3-Report-Creation-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID: "design-patterns-in-java-part-2-project-practice-guide",
		readingID:
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-convert-duplicate-constructors-to-factory",
		coreID: "design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-convert-duplicate-constructors-to-factory",
		sourceItems: [
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-convert-duplicate-constructors-to-factory"
		],
		independentItems: [
			"design-patterns-in-java-part-2-project-practice-guide-supplemental-practice-project-convert-duplicate-constructors-to-factory"
		],
		files: {
			starter: [
				"Main.java",
				"ContractTests.java",
				"README.md",
				"sources.txt",
				"src/creation/BodyLine.java",
				"src/creation/Exporters.java",
				"src/creation/Families.java",
				"src/creation/FamilyRenderer.java",
				"src/creation/Heading.java",
				"src/creation/Renderer.java",
				"src/creation/RendererFactory.java",
				"src/creation/Report.java",
				"src/creation/ReportJob.java",
				"src/creation/Style.java"
			],
			solution: [
				"Main.java",
				"ContractTests.java",
				"README.md",
				"sources.txt",
				"src/creation/BodyLine.java",
				"src/creation/Exporters.java",
				"src/creation/Families.java",
				"src/creation/FamilyRenderer.java",
				"src/creation/Heading.java",
				"src/creation/Renderer.java",
				"src/creation/RendererFactory.java",
				"src/creation/Report.java",
				"src/creation/ReportJob.java",
				"src/creation/Style.java"
			]
		},
		instructions: [
			"Java 21 optional creational refactoring practice",
			"Use the complete README contract, package tree and current sources.txt.",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d classes @sources.txt",
			"java -ea -cp classes ContractTests core",
			"java -da -cp classes ContractTests core",
			"Complete the pack's required core before the targeted review; other optional tasks stay separate.",
			"Run displays native commands. These programs read no standard input."
		]
	}
] as const;
