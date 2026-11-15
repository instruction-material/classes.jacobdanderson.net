export const javaRefactoringFinalUnits = [
	{
		id: "capstone-refactoring",
		courseID: "design-patterns-in-java-part-2",
		revision: "29000ec4e21398f4fed4ac65cd73fbac97cfdf1a",
		pack: "DPR10-Capstone-Refactoring-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID:
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio",
		readingID:
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-capstone-launch-choose-a-messy-but-salvageable-java-app",
		coreID: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-core-project-capstone-refactoring-studio",
		sourceItems: [
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-capstone-launch-choose-a-messy-but-salvageable-java-app",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-diagnosis-pass-smells-risks-and-refactor-sequence",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-execution-pass-small-safe-transformations",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-pattern-arrival-review",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-final-architecture-review",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-capstone-reflection-from-catalog-knowledge-to-judgment",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-capstone-change-ledger-and-stop-points",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-capstone-evidence-review",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-core-project-capstone-refactoring-studio",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-understanding-check-capstone-refactoring-studio",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-capstone-refactoring-studio-transfer-practice",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-capstone-refactoring-studio-extension-practice"
		],
		independentItems: [
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-capstone-refactoring-studio-transfer-practice",
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-capstone-refactoring-studio-extension-practice"
		],
		files: {
			starter: [
				"Main.java",
				"CompatibilityClient.java",
				"ContractChecks.java",
				"README.md",
				"REFACTORING.md",
				"SOURCES.md",
				"sample-input.txt",
				"sources.txt",
				"src/api/DeskAPI.java",
				"src/api/JoinStatus.java",
				"src/api/Rules.java",
				"src/api/SessionView.java",
				"src/app/AppScript.java",
				"src/app/WorkshopDesk.java",
				"src/legacy/LegacyWorkshopDesk.java",
				"src/preview/RenamePreview.java",
				"src/trace/Equivalence.java",
				"src/trace/Observation.java",
				"src/trace/Step.java"
			],
			solution: [
				"Main.java",
				"CompatibilityClient.java",
				"ContractChecks.java",
				"README.md",
				"REFACTORING.md",
				"SOURCES.md",
				"sample-input.txt",
				"sources.txt",
				"src/api/DeskAPI.java",
				"src/api/JoinStatus.java",
				"src/api/Rules.java",
				"src/api/SessionView.java",
				"src/app/AppScript.java",
				"src/app/DeskReports.java",
				"src/app/SessionBook.java",
				"src/app/WorkshopDesk.java",
				"src/legacy/LegacyWorkshopDesk.java",
				"src/preview/RenamePreview.java",
				"src/trace/Equivalence.java",
				"src/trace/Observation.java",
				"src/trace/Step.java"
			]
		},
		instructions: [
			"Java 21: Capstone Refactoring Studio",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
			"java -ea -cp out ContractChecks baseline",
			"java -da -cp out ContractChecks baseline",
			"java -cp out Main baseline",
			"java -cp out Main core",
			"java -ea -cp out ContractChecks core",
			"java -da -cp out ContractChecks core",
			"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
			"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
			"Script modes read standard input: java -cp out Main script-core < sample-input.txt",
			"Demo and check modes need no input. Run displays native commands.",
			"Core behavior checks pass before refactoring; retain actual source changes and a small step record to establish design improvement."
		],
		instructionsByItem: {
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-capstone-refactoring-studio-transfer-practice":
				[
					"Java 21: Capstone Refactoring Studio",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks transfer",
					"java -da -cp out ContractChecks transfer",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Script modes read standard input: java -cp out Main script-core < sample-input.txt",
					"Demo and check modes need no input. Run displays native commands."
				],
			"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-capstone-refactoring-studio-extension-practice":
				[
					"Java 21: Capstone Refactoring Studio",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks extension",
					"java -da -cp out ContractChecks extension",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Script modes read standard input: java -cp out Main script-core < sample-input.txt",
					"Demo and check modes need no input. Run displays native commands."
				]
		},
		changesFiles: true
	},
	{
		id: "clinic11-ownership",
		courseID: "design-patterns-in-java-part-2",
		revision: "29000ec4e21398f4fed4ac65cd73fbac97cfdf1a",
		pack: "Clinic11-Ownership-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17",
		readingID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-core-concepts",
		coreID: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-11",
		sourceItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-core-concepts",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-guided-example",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-11",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-11",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-11",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-extension-practice"
		],
		independentItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-extension-practice"
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
				"src/api/PlannerAPI.java",
				"src/api/Point.java",
				"src/api/RouteData.java",
				"src/app/TripPlanner.java",
				"src/extension/WaypointEdit.java",
				"src/legacy/LegacyPlanner.java",
				"src/transfer/LongestLeg.java"
			],
			solution: [
				"Main.java",
				"CompatibilityClient.java",
				"ContractChecks.java",
				"README.md",
				"REFACTORING.md",
				"SOURCES.md",
				"sources.txt",
				"src/api/PlannerAPI.java",
				"src/api/Point.java",
				"src/api/RouteData.java",
				"src/app/RoutePlan.java",
				"src/app/TripPlanner.java",
				"src/extension/WaypointEdit.java",
				"src/legacy/LegacyPlanner.java",
				"src/transfer/LongestLeg.java"
			]
		},
		instructions: [
			"Java 21: Refactoring Clinic 11",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
			"java -ea -cp out ContractChecks baseline",
			"java -da -cp out ContractChecks baseline",
			"java -cp out Main baseline",
			"java -cp out Main core",
			"java -ea -cp out ContractChecks core",
			"java -da -cp out ContractChecks core",
			"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
			"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
			"Demo and check modes read no standard input. Run displays native commands.",
			"Core behavior checks pass before refactoring; retain actual source changes and a small step record to establish design improvement."
		],
		instructionsByItem: {
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-transfer-practice":
				[
					"Java 21: Refactoring Clinic 11",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks transfer",
					"java -da -cp out ContractChecks transfer",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				],
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-extension-practice":
				[
					"Java 21: Refactoring Clinic 11",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks extension",
					"java -da -cp out ContractChecks extension",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				]
		},
		changesFiles: true
	},
	{
		id: "clinic12",
		courseID: "design-patterns-in-java-part-2",
		revision: "29000ec4e21398f4fed4ac65cd73fbac97cfdf1a",
		pack: "Clinic12-Variant-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17",
		readingID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-core-concepts",
		coreID: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-12",
		sourceItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-core-concepts",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-guided-example",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-12",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-12",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-12",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-extension-practice"
		],
		independentItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-extension-practice"
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
				"src/api/Messages.java",
				"src/api/RenderRule.java",
				"src/api/Rules.java",
				"src/app/MessageService.java",
				"src/check/Checks.java",
				"src/extension/PrefixRule.java",
				"src/legacy/LegacyMessages.java",
				"src/transfer/RenderBatch.java"
			],
			solution: [
				"Main.java",
				"CompatibilityClient.java",
				"ContractChecks.java",
				"README.md",
				"REFACTORING.md",
				"SOURCES.md",
				"sources.txt",
				"src/api/Messages.java",
				"src/api/RenderRule.java",
				"src/api/Rules.java",
				"src/app/CompactRule.java",
				"src/app/MessageService.java",
				"src/app/PlainRule.java",
				"src/check/Checks.java",
				"src/extension/PrefixRule.java",
				"src/legacy/LegacyMessages.java",
				"src/transfer/RenderBatch.java"
			]
		},
		instructions: [
			"Java 21: Refactoring Clinic 12",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
			"java -ea -cp out ContractChecks baseline",
			"java -da -cp out ContractChecks baseline",
			"java -cp out Main baseline",
			"java -cp out Main core",
			"java -ea -cp out ContractChecks core",
			"java -da -cp out ContractChecks core",
			"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
			"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
			"Demo and check modes read no standard input. Run displays native commands.",
			"The original entry point works; post-refactor core checks remain unfinished until the required new design entry points are implemented."
		],
		instructionsByItem: {
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-transfer-practice":
				[
					"Java 21: Refactoring Clinic 12",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks transfer",
					"java -da -cp out ContractChecks transfer",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				],
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-extension-practice":
				[
					"Java 21: Refactoring Clinic 12",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks extension",
					"java -da -cp out ContractChecks extension",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				]
		},
		changesFiles: true
	},
	{
		id: "clinic13",
		courseID: "design-patterns-in-java-part-2",
		revision: "29000ec4e21398f4fed4ac65cd73fbac97cfdf1a",
		pack: "Clinic13-Parameter-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17",
		readingID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-core-concepts",
		coreID: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-13",
		sourceItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-core-concepts",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-guided-example",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-13",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-13",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-13",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-extension-practice"
		],
		independentItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-extension-practice"
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
				"src/api/RangeRules.java",
				"src/api/Ranges.java",
				"src/app/RangeService.java",
				"src/app/RangeSpec.java",
				"src/check/Checks.java",
				"src/extension/MergeRanges.java",
				"src/legacy/LegacyRanges.java",
				"src/transfer/EveryOther.java"
			],
			solution: [
				"Main.java",
				"CompatibilityClient.java",
				"ContractChecks.java",
				"README.md",
				"REFACTORING.md",
				"SOURCES.md",
				"sources.txt",
				"src/api/RangeRules.java",
				"src/api/Ranges.java",
				"src/app/RangeService.java",
				"src/app/RangeSpec.java",
				"src/check/Checks.java",
				"src/extension/MergeRanges.java",
				"src/legacy/LegacyRanges.java",
				"src/transfer/EveryOther.java"
			]
		},
		instructions: [
			"Java 21: Refactoring Clinic 13",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
			"java -ea -cp out ContractChecks baseline",
			"java -da -cp out ContractChecks baseline",
			"java -cp out Main baseline",
			"java -cp out Main core",
			"java -ea -cp out ContractChecks core",
			"java -da -cp out ContractChecks core",
			"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
			"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
			"Demo and check modes read no standard input. Run displays native commands.",
			"The original entry point works; post-refactor core checks remain unfinished until the required new design entry points are implemented."
		],
		instructionsByItem: {
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-transfer-practice":
				[
					"Java 21: Refactoring Clinic 13",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks transfer",
					"java -da -cp out ContractChecks transfer",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				],
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-extension-practice":
				[
					"Java 21: Refactoring Clinic 13",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks extension",
					"java -da -cp out ContractChecks extension",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				]
		},
		changesFiles: true
	},
	{
		id: "clinic14",
		courseID: "design-patterns-in-java-part-2",
		revision: "29000ec4e21398f4fed4ac65cd73fbac97cfdf1a",
		pack: "Clinic14-Calculation-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17",
		readingID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-core-concepts",
		coreID: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-14",
		sourceItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-core-concepts",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-guided-example",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-14",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-14",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-14",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-extension-practice"
		],
		independentItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-extension-practice"
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
				"src/api/BatchTotal.java",
				"src/api/EnergyAPI.java",
				"src/api/EnergyResult.java",
				"src/api/EnergyRules.java",
				"src/app/EnergyMeter.java",
				"src/check/Checks.java",
				"src/extension/EnergyBatch.java",
				"src/legacy/LegacyEnergy.java",
				"src/transfer/EnergyLoss.java"
			],
			solution: [
				"Main.java",
				"CompatibilityClient.java",
				"ContractChecks.java",
				"README.md",
				"REFACTORING.md",
				"SOURCES.md",
				"sources.txt",
				"src/api/BatchTotal.java",
				"src/api/EnergyAPI.java",
				"src/api/EnergyResult.java",
				"src/api/EnergyRules.java",
				"src/app/EnergyMeter.java",
				"src/check/Checks.java",
				"src/extension/EnergyBatch.java",
				"src/legacy/LegacyEnergy.java",
				"src/transfer/EnergyLoss.java"
			]
		},
		instructions: [
			"Java 21: Refactoring Clinic 14",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
			"java -ea -cp out ContractChecks baseline",
			"java -da -cp out ContractChecks baseline",
			"java -cp out Main baseline",
			"java -cp out Main core",
			"java -ea -cp out ContractChecks core",
			"java -da -cp out ContractChecks core",
			"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
			"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
			"Demo and check modes read no standard input. Run displays native commands.",
			"The original entry point works; post-refactor core checks remain unfinished until the required new design entry points are implemented."
		],
		instructionsByItem: {
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-transfer-practice":
				[
					"Java 21: Refactoring Clinic 14",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks transfer",
					"java -da -cp out ContractChecks transfer",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				],
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-extension-practice":
				[
					"Java 21: Refactoring Clinic 14",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks extension",
					"java -da -cp out ContractChecks extension",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				]
		},
		changesFiles: true
	},
	{
		id: "clinic15",
		courseID: "design-patterns-in-java-part-2",
		revision: "29000ec4e21398f4fed4ac65cd73fbac97cfdf1a",
		pack: "Clinic15-Workflow-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17",
		readingID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-core-concepts",
		coreID: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-15",
		sourceItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-core-concepts",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-guided-example",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-15",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-15",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-15",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-extension-practice"
		],
		independentItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-extension-practice"
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
				"src/api/Documents.java",
				"src/api/Rows.java",
				"src/api/StepHook.java",
				"src/app/DocumentService.java",
				"src/app/DocumentTemplate.java",
				"src/check/Checks.java",
				"src/extension/NumberedRows.java",
				"src/legacy/LegacyDocuments.java",
				"src/transfer/WorkflowTrace.java"
			],
			solution: [
				"Main.java",
				"CompatibilityClient.java",
				"ContractChecks.java",
				"README.md",
				"REFACTORING.md",
				"SOURCES.md",
				"sources.txt",
				"src/api/Documents.java",
				"src/api/Rows.java",
				"src/api/StepHook.java",
				"src/app/DocumentService.java",
				"src/app/DocumentTemplate.java",
				"src/app/MarkedDocument.java",
				"src/app/PlainDocument.java",
				"src/check/Checks.java",
				"src/extension/NumberedRows.java",
				"src/legacy/LegacyDocuments.java",
				"src/transfer/WorkflowTrace.java"
			]
		},
		instructions: [
			"Java 21: Refactoring Clinic 15",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
			"java -ea -cp out ContractChecks baseline",
			"java -da -cp out ContractChecks baseline",
			"java -cp out Main baseline",
			"java -cp out Main core",
			"java -ea -cp out ContractChecks core",
			"java -da -cp out ContractChecks core",
			"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
			"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
			"Demo and check modes read no standard input. Run displays native commands.",
			"The original entry point works; post-refactor core checks remain unfinished until the required new design entry points are implemented."
		],
		instructionsByItem: {
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-transfer-practice":
				[
					"Java 21: Refactoring Clinic 15",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks transfer",
					"java -da -cp out ContractChecks transfer",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				],
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-extension-practice":
				[
					"Java 21: Refactoring Clinic 15",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks extension",
					"java -da -cp out ContractChecks extension",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				]
		},
		changesFiles: true
	},
	{
		id: "clinic16",
		courseID: "design-patterns-in-java-part-2",
		revision: "29000ec4e21398f4fed4ac65cd73fbac97cfdf1a",
		pack: "Clinic16-Absence-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17",
		readingID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-core-concepts",
		coreID: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-16",
		sourceItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-core-concepts",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-guided-example",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-16",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-16",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-16",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-extension-practice"
		],
		independentItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-extension-practice"
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
				"src/api/Greetings.java",
				"src/api/Profile.java",
				"src/app/GreetingService.java",
				"src/check/Checks.java",
				"src/extension/StrictGreeting.java",
				"src/legacy/LegacyGreetings.java",
				"src/transfer/ProfileLookup.java"
			],
			solution: [
				"Main.java",
				"CompatibilityClient.java",
				"ContractChecks.java",
				"README.md",
				"REFACTORING.md",
				"SOURCES.md",
				"sources.txt",
				"src/api/Greetings.java",
				"src/api/Profile.java",
				"src/app/GreetingService.java",
				"src/app/GuestRecipient.java",
				"src/app/KnownRecipient.java",
				"src/app/Recipient.java",
				"src/check/Checks.java",
				"src/extension/StrictGreeting.java",
				"src/legacy/LegacyGreetings.java",
				"src/transfer/ProfileLookup.java"
			]
		},
		instructions: [
			"Java 21: Refactoring Clinic 16",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
			"java -ea -cp out ContractChecks baseline",
			"java -da -cp out ContractChecks baseline",
			"java -cp out Main baseline",
			"java -cp out Main core",
			"java -ea -cp out ContractChecks core",
			"java -da -cp out ContractChecks core",
			"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
			"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
			"Demo and check modes read no standard input. Run displays native commands.",
			"Core behavior checks pass before refactoring; retain actual source changes and a small step record to establish design improvement."
		],
		instructionsByItem: {
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-transfer-practice":
				[
					"Java 21: Refactoring Clinic 16",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks transfer",
					"java -da -cp out ContractChecks transfer",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				],
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-extension-practice":
				[
					"Java 21: Refactoring Clinic 16",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks extension",
					"java -da -cp out ContractChecks extension",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				]
		},
		changesFiles: true
	},
	{
		id: "clinic17",
		courseID: "design-patterns-in-java-part-2",
		revision: "29000ec4e21398f4fed4ac65cd73fbac97cfdf1a",
		pack: "Clinic17-Sequencing-Packs",
		layout: "src package folders, sources.txt and README.md",
		moduleID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17",
		readingID:
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-core-concepts",
		coreID: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-17",
		sourceItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-core-concepts",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-guided-example",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-17",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-17",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-17",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-extension-practice"
		],
		independentItems: [
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-transfer-practice",
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-extension-practice"
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
				"src/api/BoardAPI.java",
				"src/api/BoardRows.java",
				"src/api/BoardStats.java",
				"src/api/Task.java",
				"src/app/BoardReport.java",
				"src/check/Checks.java",
				"src/extension/BoardPreview.java",
				"src/legacy/LegacyBoard.java",
				"src/transfer/SnapshotDiff.java"
			],
			solution: [
				"Main.java",
				"CompatibilityClient.java",
				"ContractChecks.java",
				"README.md",
				"REFACTORING.md",
				"SOURCES.md",
				"sources.txt",
				"src/api/BoardAPI.java",
				"src/api/BoardRows.java",
				"src/api/BoardStats.java",
				"src/api/Task.java",
				"src/app/BoardAnalysis.java",
				"src/app/BoardReport.java",
				"src/app/BoardText.java",
				"src/check/Checks.java",
				"src/extension/BoardPreview.java",
				"src/legacy/LegacyBoard.java",
				"src/transfer/SnapshotDiff.java"
			]
		},
		instructions: [
			"Java 21: Refactoring Clinic 17",
			"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
			"java -ea -cp out ContractChecks baseline",
			"java -da -cp out ContractChecks baseline",
			"java -cp out Main baseline",
			"java -cp out Main core",
			"java -ea -cp out ContractChecks core",
			"java -da -cp out ContractChecks core",
			"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
			"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
			"Demo and check modes read no standard input. Run displays native commands.",
			"Core behavior checks pass before refactoring; retain actual source changes and a small step record to establish design improvement."
		],
		instructionsByItem: {
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-transfer-practice":
				[
					"Java 21: Refactoring Clinic 17",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks transfer",
					"java -da -cp out ContractChecks transfer",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				],
			"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-extension-practice":
				[
					"Java 21: Refactoring Clinic 17",
					"javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt",
					"java -ea -cp out ContractChecks baseline",
					"java -da -cp out ContractChecks baseline",
					"java -cp out Main baseline",
					"java -cp out Main core",
					"java -ea -cp out ContractChecks extension",
					"java -da -cp out ContractChecks extension",
					"Keep frozen APIs, legacy source and ContractChecks unchanged; add new Java files to sources.txt.",
					"Use the optional projects as independent saved attempts. The README supplies their complete contracts.",
					"Demo and check modes read no standard input. Run displays native commands."
				]
		},
		changesFiles: true
	}
] as const;
