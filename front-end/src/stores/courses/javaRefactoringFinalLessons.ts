import type { RawCourseModuleItem } from "./types";

export type FinalRefactoringEntry = RawCourseModuleItem & {
	caseSection?: string;
};
export interface FinalRefactoringLesson {
	title: string;
	unitID: string;
	curriculum: FinalRefactoringEntry[];
	supplementalProjects: FinalRefactoringEntry[];
}
export const javaRefactoringFinalLessons: FinalRefactoringLesson[] = [
	{
		title: "DPR10 Capstone Refactoring Studio",
		unitID: "capstone-refactoring",
		curriculum: [
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-capstone-launch-choose-a-messy-but-salvageable-java-app",
				title: "Capstone Launch: Choose a Messy but Salvageable Java App",
				content:
					'Refactor a working workshop-registration application in small, behavior-preserving steps. The supplied starter manages several sessions, seat limits, an ordered waiting list, immutable snapshots, an event history, two reports and a command interface. Its parallel maps and mixed responsibilities create a useful diagnosis and extraction problem. The reference is one defensible design; the capstone is evaluated through working behavior, reviewable changes and explained decisions.\n\nA different medium Java application is suitable when it runs reproducibly, contains several interacting responsibilities and has observable behavior worth preserving. First record its entry points, sample inputs, outputs, errors and dependencies. Establish characterization checks before changing its structure. Use its own tests and commands in place of this pack\'s workshop-specific oracle. Keep the same diagnosis, safe-step, architecture and reflection evidence described below.\n\n## Run before changing code\n\nUse JDK 21 in the extracted project folder:\n\n    javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt\n    java -ea -cp out ContractChecks baseline\n    java -da -cp out ContractChecks baseline\n    java -ea -cp out ContractChecks core\n    java -cp out Main baseline\n    java -cp out Main core\n\nBoth baseline and core behavior checks pass in the starter. Passing them establishes the starting behavior; it does not establish that a refactor has happened. Main baseline uses the frozen LegacyWorkshopDesk; Main core uses the candidate WorkshopDesk. They print the same two reports and history:\n\n    Workshops 2\n    room capacity=2 open=true\n    enrolled=bo,cy\n    waiting=-\n    quiet capacity=1 open=false\n    enrolled=-\n    waiting=-\n    2\n    room|2|open|bo,cy|-\n    quiet|1|closed|-|-\n    [open, join:ana:enrolled, join:bo:enrolled, join:cy:waiting, leave:ana:enrolled, promote:cy]\n\nEvery displayed line ends with a newline. Demo and check modes need no standard input. To exercise the command interface, run:\n\n    java -cp out Main script-baseline < sample-input.txt\n    java -cp out Main script-core < sample-input.txt\n\nInput redirection is a terminal command. Without redirection, those two modes read lines from standard input until end of input. They write console output and keep state only in memory. No mode contacts a network, database or external service. The sample produces:\n\n    opened\n    ENROLLED\n    WAITLISTED\n    true\n    1\n    room|1|open|bo|-\n    true\n    error:IllegalStateException:closed\n\nKeep the API package, LegacyWorkshopDesk, AppScript, Main, CompatibilityClient, Step, Observation and ContractChecks unchanged. Modify WorkshopDesk and add cohesive implementation classes as needed. Include new Java files in sources.txt. Preserve public construction as new WorkshopDesk() and the DeskAPI methods.\n\n## Required project: diagnosis, sequence and implementation\n\nRead WorkshopDesk before opening the reference. Identify at least three concrete issues with source locations and consequences. For example, capacities, open flags, enrolled people, waiting people and history are kept in five maps keyed by the same session ID. Creating a session must keep all five maps consistent. The same class changes both when queue policy changes and when report formatting changes.\n\nWrite behavior promises in REFACTORING.md before selecting techniques. Prioritize one small extraction, then move a responsibility with its data, then isolate reporting. Predict the risk and protective check for each step. A possible sequence is:\n\n1. Extract a private membership predicate without changing validation or mutation order. Compile and run baseline/core.\n2. Group one session\'s state into a session object. Move the corresponding join/leave/close behavior with that state. Keep WorkshopDesk\'s public API and session insertion order.\n3. Move report rendering to a collaborator that consumes immutable snapshots. Keep exact output and query purity.\n4. Review names, visibility and package dependencies. Remove temporary duplication after the migrated path is protected.\n\nRecord actual source changes and results after each step. Use separate small commits when working in Git, or retain dated before/after files and results. A single passing final run cannot demonstrate safe intermediate transformations. The frozen legacy copy remains a behavior reference, not a base class for the candidate.\n\n### Observable behavior to preserve\n\nSession and participant IDs match [a-z][a-z0-9-]{0,15}; accepted input is exact, with no trimming or case conversion. Null IDs throw NullPointerException and other invalid IDs throw IllegalArgumentException, with message "session" or "participant". Capacity is an integer 1 through 4; other values throw IllegalArgumentException("capacity"). open validates session, then capacity, then rejects an existing ID with IllegalStateException("session"). No existing session can be reopened.\n\njoin and leave validate session then participant before looking up the session. Missing sessions throw NoSuchElementException("session"); a closed session throws IllegalStateException("closed") before duplicate/no-op decisions. join returns ENROLLED when there is a seat, WAITLISTED when added to the queue and DUPLICATE when already enrolled or waiting. Each session has its own roster; the same participant can join another session.\n\nleave returns false for an absent participant and true for a removal. Removing a waiting participant changes only that queue. Removing an enrolled participant promotes the earliest waiting participant, appending them to enrolled order. Arrival order matters: cy waiting before bo is promoted first even though bo sorts earlier. close returns true once, appends one event, retains the roster and queue, and returns false on repetition.\n\nSessionView records id, capacity, open, enrolled, waiting and history. All returned lists, including all(), are unmodifiable snapshots. Old snapshots remain unchanged after later operations. view, all and report never mutate state or append history. Session order is opening order; enrolled and waiting order is arrival order after removals/promotions. Different desk instances own independent state.\n\nHistory begins with "open". Successful joins append "join:ID:enrolled" or "join:ID:waiting". Removal appends "leave:ID:enrolled" or "leave:ID:waiting"; promotion then appends "promote:ID". First close appends "close". Duplicates, absent removals, repeated close and failures add no events.\n\nreport validates style first: null throws NullPointerException("style"), and anything except exact "plain" or "compact" throws IllegalArgumentException("style"). Plain output begins "Workshops N", then three lines per session: "ID capacity=C open=BOOLEAN", "enrolled=IDS" and "waiting=IDS". Compact begins "N", then "ID|C|open-or-closed|ENROLLED|WAITING". Lists use comma-separated IDs without spaces and "-" for empty. Every line, including the last, ends with newline.\n\nAppScript.run takes a non-null desk and a non-null list of non-null lines, validating the whole list before operations. Each trimmed nonblank line has whitespace-separated words. Commands are open ID CAPACITY, join ID PERSON, leave ID PERSON, close ID, view ID and report STYLE. Wrong arity or unknown commands throw IllegalArgumentException("command"). Capacity text uses Integer.parseInt; parse failures become IllegalArgumentException("capacity"). Parsing completes before domain validation. Each RuntimeException becomes "error:SimpleClass:message" followed by newline; later lines still run. Successful open prints "opened"; join prints its enum name; leave/close print true or false. view prints "ID|CAPACITY|BOOLEAN|[enrolled]|[waiting]|[history]". report prints its full report without an extra blank line.\n\n### Final review and reflection\n\nExplain which responsibilities moved, which state now belongs together, which collaborations are visible and which imports point across packages. Show one change that would now affect fewer files and one remaining coupling. Use before/after source evidence rather than class counts alone.\n\nThe reference keeps WorkshopDesk as a public facade, uses a package-private SessionBook per session and a package-private DeskReports renderer. The two fixed report formats need only a helper here. A Strategy becomes useful if callers need independently supplied report policies; that is a possible future requirement, not a reason to add an interface now. Similarly, open/closed alone does not require a State hierarchy, and ordinary construction does not require a Factory.\n\nDiscuss one technique that paid off, one pattern that emerged or remained unnecessary, and one postponed behavior change. Sorting the waiting list is an observable behavior change: demonstrate the cy-before-bo counterexample. A rename operation, persistence or networking would also introduce new behavior. Evaluate them separately from this refactor.\n\nSubmit a smell/risk map, ordered step log with passing evidence, final code and commands, before/after responsibility sketch, exact behavior example, pattern decision and reflection. These artifacts support individual reading or a walkthrough with an instructor.\n\nThe supplied harness runs on the Java standard library. A capstone using another application can retain its existing tests; the [JUnit guide](https://docs.junit.org/current/user-guide/) is a framework reference for such a codebase.',
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "core"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-diagnosis-pass-smells-risks-and-refactor-sequence",
				title: "Diagnosis Pass: Smells, Risks, and Refactor Sequence",
				content:
					"Inspect the working workshop-registration app before viewing the reference. Map the five parallel session maps, the join/leave/close decisions and the mixed report formatting. Use a fresh room with capacity 1, then ana enrolled and cy/bo waiting. Identify at least three located smells, the behavior promises at risk and an ordered sequence that begins with one small extraction. A different suitable medium Java app may use its own documented baseline and equivalent evidence.\n\n**Completion evidence:** Provide three located smells, the FIFO/validation/snapshot promises they threaten, a risk-ranked transformation sequence and the recorded starting results.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "core",
				preserveAssignment: true,
				caseSection: "capstone-diagnosis"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-execution-pass-small-safe-transformations",
				title: "Execution Pass: Small Safe Transformations",
				content:
					"Perform the planned refactor as small runnable changes. First extract the participant-membership decision, then move one session's owned state and operations into SessionBook, then move report rendering into DeskReports. Keep public DeskAPI calls, validation priority, histories and exact reports stable. Add new files to sources.txt and retain passing results/source snapshots after each stage.\n\n**Completion evidence:** Provide the source checkpoint and passing baseline/core results for each extraction, the updated source manifest and the unchanged DeskAPI client result.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "core",
				preserveAssignment: true,
				caseSection: "capstone-execution"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-pattern-arrival-review",
				title: "Pattern Arrival Review",
				content:
					"Review the resulting responsibilities before naming patterns. Explain the public WorkshopDesk facade, the session-owned state and the snapshot-based renderer. Compare a simple report helper with a caller-supplied Strategy requirement. Identify one abstraction justified by current evidence and one pattern left unnecessary, with a concrete future pressure that would change that choice.\n\n**Completion evidence:** Provide the resulting responsibility sketch, one justified abstraction, one simpler alternative and a concrete requirement that would justify a larger pattern.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "core",
				preserveAssignment: true,
				caseSection: "capstone-patterns"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-final-architecture-review",
				title: "Final Architecture Review",
				content:
					"Draw the actual before/after package and collaboration arrows. Compare two future change scenarios: altering report punctuation and changing promotion policy. Record which source responsibilities and tests each would affect before and after, plus one remaining coupling and the next justified improvement. Keep exploratory behavior changes separate from the preserved core.\n\n**Completion evidence:** Provide the before/after dependency view, source and test impact for both change scenarios, one remaining coupling and a justified next step.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "core",
				preserveAssignment: true,
				caseSection: "capstone-architecture"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-capstone-reflection-from-catalog-knowledge-to-judgment",
				title: "Capstone Reflection: From Catalog Knowledge to Judgment",
				content:
					"Use actual changes from this capstone to explain the move from catalog terms to design judgment. Compare the useful extraction with a tempting sorted-waiting-list change, one abandoned refactor, one remaining risk and a simpler alternative. Support the reflection with a source checkpoint, an exact case and a limitation of the automated checks.\n\n**Completion evidence:** Provide the checkpoint and exact counterexample supporting the useful extraction, abandoned refactor, simpler alternative and remaining risk.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "core",
				preserveAssignment: true,
				caseSection: "capstone-reflection"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-capstone-change-ledger-and-stop-points",
				title: "Capstone Change Ledger and Stop Points",
				content:
					"First retain a green baseline with its exact source and passing commands. Keep a change ledger with source checkpoint, located smell, risk, one proposed transformation, protected case, command/result, rollback target and next decision. Separate structural work from behavior, dependency and formatting changes. Define stop points for an unexplained test failure, uncertain compatibility, a diff too large to review or changed design pressure. Preserve an earlier passing export or commit before continuing.\n\n**Completion evidence:** Provide the retained green baseline, completed step ledger, one demonstrated stop decision and a recoverable rollback target for every major change.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "core",
				preserveAssignment: true,
				caseSection: "capstone-ledger"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-capstone-evidence-review",
				title: "Capstone Evidence Review",
				content:
					"Assemble the behavior inventory, passing before source, diagnosis, ordered source changes, public-client compatibility, before-and-after dependency view and commands/results. Include measurements for the two change scenarios, a postponed feature, one abandoned refactor with evidence and its counterexample, one remaining risk and a rollback point for every major change. Review behavior, structure, judgment and evidence separately.\n\n**Completion evidence:** Provide the assembled portfolio with reproducible commands, compatibility result, dependency comparison, two change scenarios and evidence for the postponed and abandoned work.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "core",
				preserveAssignment: true,
				caseSection: "capstone-evidence"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-core-project-capstone-refactoring-studio",
				title: "Core Project: Capstone Refactoring Studio",
				aliases: [
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-core-project",
					"dpr10-capstone-refactoring-studio-core-project",
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-curriculum-dpr10-capstone-refactoring-studio-core-project"
				],
				content:
					"Refactor the working WorkshopDesk in small steps while preserving DeskAPI, command parsing, validation order, FIFO promotion, immutable snapshots, histories and both reports. Move session state/behavior together and isolate reporting. Add new Java paths to sources.txt. Run baseline/core with -ea and -da and the unchanged external client. Submit the complete change ledger and architecture/reflection evidence; green core behavior already exists in the starter.\n\nThe supplied default is WorkshopDesk. Another suitable medium app uses its own characterization checks and equivalent risk/architecture portfolio; the workshop-specific oracle does not define that other app's behavior.\n\n**Completion evidence:** Provide the refactored source tree and complete source manifest, passing baseline/core and unchanged-client results, preserved before/after snapshots, and the diagnosis, step ledger, dependency comparison and design decisions from the capstone portfolio.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "core",
				preserveAssignment: true,
				caseSection: "capstone-core"
			}
		],
		supplementalProjects: [
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-understanding-check-capstone-refactoring-studio",
				title: "Understanding Check: Capstone Refactoring Studio",
				aliases: [
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-dpr10-capstone-refactoring-studio-diagnostic-checkpoint",
					"diagnostic-checkpoint-capstone-refactoring-studio",
					"diagnostic-checkpoint",
					"understanding-check",
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-diagnostic-checkpoint-capstone-refactoring-studio",
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-diagnostic-checkpoint",
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-understanding-check"
				],
				content:
					"Classify a helper extraction, sorting the waiting list, changing a report delimiter and adding persistence. For the supplied room/1 trace, identify which proposed change preserves existing behavior and which require new expectations. Explain why passing before/after checks is necessary but does not evaluate every design decision.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "capstone-understanding"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-capstone-refactoring-studio-transfer-practice",
				title: "Capstone Refactoring Studio Transfer Practice",
				aliases: [
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-transfer-practice-capstone-refactoring-studio",
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-transfer-practice"
				],
				content:
					'## Optional transfer: compare complete traces\n\nComplete trace.Equivalence.same(before, after, steps) while leaving the core and rename exercise at starter if desired. Supply two independently constructed DeskAPI objects. Validate before, after and the complete steps list in that order before any operation. Null arguments report NullPointerException("before"), ("after") or ("steps"); a null step is rejected before calls. Using the same desk object twice throws IllegalArgumentException("independent desks").\n\nApply every Step to each desk in order. Observation.take captures each step\'s returned text or RuntimeException\'s fully qualified class and message, followed by all session snapshots. Return false at the first different observation; return true only after all match. An empty plan returns true without calls. Preserve the supplied list. RuntimeException from a step is part of the observation; failure while obtaining a snapshot propagates. Existing state is allowed, so construct fresh desks when comparing identical initial conditions.\n\n    List<Step> plan = List.of(\n        new Step.Open("room", 1), new Step.Join("room", "ana"),\n        new Step.Join("room", "cy"), new Step.Join("room", "bo"),\n        new Step.Leave("room", "ana"), new Step.Report("compact"));\n    boolean same = Equivalence.same(\n        new LegacyWorkshopDesk(), new WorkshopDesk(), plan);\n\nRun ContractChecks transfer with -ea and -da. Explain why comparing only final rosters misses wrong return values, wrong error messages and a temporary snapshot defect that later disappears. Add a separate probe with one matching trace and one deliberate mismatch. Keep the supplied oracle intact.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "capstone-transfer"
			},
			{
				id: "design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-capstone-refactoring-studio-extension-practice",
				title: "Capstone Refactoring Studio Extension Practice",
				aliases: [
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-extension-practice-capstone-refactoring-studio",
					"design-patterns-in-java-part-2-dpr10-capstone-refactoring-studio-supplemental-extension-practice"
				],
				content:
					'## Optional extension: preview a participant rename\n\nComplete preview.RenamePreview.rename(snapshot, oldID, newID). This deliberately adds behavior after the refactor and remains independent of it. Accept a valid application-produced SessionView and return a preview; the live desk stays unchanged.\n\nValidate snapshot, oldID and newID in that order. Null snapshot throws NullPointerException("snapshot"); ID rules and messages use "oldID" and "newID". A closed snapshot throws IllegalStateException("closed") before no-op handling. If oldID is absent or equals newID, return the exact input snapshot. Otherwise reject a target ID already enrolled or waiting with IllegalArgumentException("newID"). Replace oldID in its current list position, retain every prior history entry verbatim and append exactly "rename:OLD:NEW". Preserve session ID, capacity and open flag. Return new immutable lists and retain the input\'s lists unchanged.\n\nFor an open snapshot with enrolled=[ana], waiting=[cy, bo], renaming cy to dee yields enrolled=[ana], waiting=[dee, bo]. Its history keeps "join:cy:waiting" and appends "rename:cy:dee". Moving dee to the end or rewriting old history would change the contract.\n\nRun ContractChecks extension under both assertion settings. Write PreviewProbe.java:\n\n    import api.*;\n    import legacy.LegacyWorkshopDesk;\n    import preview.RenamePreview;\n    import java.util.List;\n    public final class PreviewProbe {\n        private PreviewProbe() {}\n        public static void main(String[] args) {\n            DeskAPI desk = new LegacyWorkshopDesk();\n            desk.open("room", 1);\n            desk.join("room", "ana");\n            desk.join("room", "cy");\n            desk.join("room", "bo");\n            SessionView before = desk.view("room");\n            SessionView after = RenamePreview.rename(before, "cy", "dee");\n            if (!after.waiting().equals(List.of("dee", "bo")))\n                throw new AssertionError("queue position");\n            if (!before.equals(desk.view("room")))\n                throw new AssertionError("live state changed");\n            System.out.println("preview passed");\n        }\n    }\n\nCompile with javac --release 21 -cp out -d out PreviewProbe.java and run java -cp out PreviewProbe. Retain a collision failure and a closed-session failure as additional evidence. Explain why this is a separate feature with a new contract.\n\nAfter completing all three projects, run ContractChecks all. Explicit failures remain enabled with either -ea or -da. The supplied checks cover specific observations and bounded model-based sequences; the capstone portfolio establishes the refactoring argument and remaining risks.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "capstone-extension"
			}
		]
	},
	{
		title: "Refactoring Clinic 11: Practice Studio",
		unitID: "clinic11-ownership",
		curriculum: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-core-concepts",
				title: "Refactoring Clinic 11: Core Concepts",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-11-curriculum-refactoring-clinic-11-core-concepts"
				],
				content:
					'The working TripPlanner computes route distance by repeatedly reading another object\'s name and stop list. Move the route\'s decisions beside its owned state while keeping the client-facing PlannerAPI unchanged. This narrow clinic concentrates on ownership and client impact; the capstone requires a larger diagnosis and sequence.\n\n## Build and characterize\n\nUse JDK 21 from this project folder:\n\n    javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt\n    java -ea -cp out ContractChecks baseline\n    java -da -cp out ContractChecks baseline\n    java -ea -cp out ContractChecks core\n    java -cp out Main baseline\n    java -cp out Main core\n    java -cp out CompatibilityClient\n\nBoth Main modes print exactly:\n\n    walk|stops=4|distance=7\n\nThe output ends with newline. The compatibility client prints "compatibility passed". The demo visits (0,0), (3,0), (3,-2), (1,-2). Its three legs have lengths 3, 2 and 2. These are open grid routes: each leg length is abs(nextX-currentX)+abs(nextY-currentY); there is no return to the start. Empty and single-stop routes have distance zero. No program reads standard input or contacts a file service, database or network; the application operates on in-memory values and prints to the console.\n\nThe starter is already behaviorally correct. Baseline checks characterize the frozen LegacyPlanner and the candidate TripPlanner; core checks characterize only the candidate. Passing results protect behavior, while source changes and a step log establish whether ownership improved. Keep Main, CompatibilityClient, ContractChecks, PlannerAPI, Point, RouteData and LegacyPlanner unchanged. Record work in REFACTORING.md.\n\n## Required project: move decisions with their data\n\nTrace summary(route) through name, stop count and distance before editing. Mark each access to RouteData and explain why the service knows so much about route representation. Contrast a method that mostly uses another object\'s data with a useful service that coordinates several independent objects: data access alone is insufficient to diagnose feature envy.\n\nFirst extract a private leg(Point,Point) method in TripPlanner without changing its loop. Compile and run baseline/core. Then introduce an owned route object, give it the route name and an immutable stop list, and move distance with that state. Move summary after its inputs are characterized. Keep new TripPlanner(), distance(RouteData) and summary(RouteData) available. Add implementation files to sources.txt.\n\nThe reference\'s package-private RoutePlan owns name and stops and computes its own distance and summary. TripPlanner remains the public facade that validates the route and constructs that owned object. RouteData stays a frozen input value at the client boundary. The client neither selects a RoutePlan implementation nor reaches into its state. A separate calculator that keeps fetching every point from an unrelated object can leave the original ownership problem in place.\n\nThe contract is:\n\n- Point accepts x and y from -100 through 100 inclusive. Invalid x throws IllegalArgumentException("x") before y validation; invalid y throws IllegalArgumentException("y").\n- RouteData validates name before stops. Null name throws NullPointerException("name"). Blank names, names longer than 24 Java char units, and pipe/carriage-return/newline characters throw IllegalArgumentException("name"). Other accepted characters and surrounding spaces are preserved exactly.\n- Null stop list throws NullPointerException("stops"). Null members are rejected by List.copyOf. There can be zero through eight stops; more throws IllegalArgumentException("stops"). The list is copied and unmodifiable. Point values are immutable.\n- distance and summary validate a non-null route with NullPointerException("route"). They leave its data unchanged and use consecutive stops in their original order. Maximum possible distance is 2800, so the defined domain fits int.\n- summary returns "NAME|stops=N|distance=D", with no newline inside the returned string. Main adds the displayed newline. Different planner objects produce the same result for the same value and share no mutable route state.\n\nTest a null route, an empty route, repeated points, a negative-coordinate route and the opposing-corner route (-100,100) to (100,-100), whose distance is 400. A shortcut abs(dx+dy) fails the last case because opposite signs cancel.\n\nRecord the old call path, the moved responsibility, the new owner, unchanged public calls and exact before/after output. Preserve actual source steps and passing results. Explain one benefit, one tradeoff of constructing an owned value at this boundary, and a change this clinic deliberately postpones. A route object is justified by cohesive state and decisions, not by increasing the number of classes.\n\n## Optional continuation: inspect the ownership boundary\n\nKeep the core project and its identity. Add a separate client that summarizes an empty route and then the same unusual route twice. Predict its results and check that the original input list stays unchanged. Compare a solution that owns the immutable points with a helper that repeatedly reaches through RouteData. Explain whether a new coordinate representation could be confined behind the owned route. This continuation adds evidence to the core refactor, rather than a separate required algorithm.\n\n## Separate client and review\n\nAfter the chosen implementation is complete, write Probe.java:\n\n    import api.*;\n    import app.TripPlanner;\n    import java.util.List;\n    public final class Probe {\n        private Probe() {}\n        public static void main(String[] args) {\n            PlannerAPI planner = new TripPlanner();\n            RouteData route = new RouteData("edge",\n                List.of(new Point(-100,100), new Point(100,-100)));\n            if (planner.distance(route) != 400)\n                throw new AssertionError("distance");\n            if (!planner.summary(route).equals("edge|stops=2|distance=400"))\n                throw new AssertionError("summary");\n            System.out.println("probe passed");\n        }\n    }\n\nCompile with javac --release 21 -cp out -d out Probe.java and run java -cp out Probe. This external client uses the original facade without knowing which class owns the moved behavior.\n\nAfter all three projects are complete, ContractChecks all runs their combined checks. Its explicit failures execute under -ea and -da. Keep learner-written checks in separate files. A final review includes the ownership argument, exact behavior evidence, a small step log and a limitation; a green result alone cannot evaluate that explanation.',
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "choice"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-guided-example",
				title: "Refactoring Clinic 11: Guided Example",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-11-curriculum-refactoring-clinic-11-guided-example"
				],
				content:
					"Trace the four sample points through the current distance and summary calls. Label each foreign-data access, calculate each leg, and predict an empty route before extracting anything. Compare a service that keeps fetching another object's state with RoutePlan owning that state.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-11-guided"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-11",
				title: "Core Project: Refactoring Clinic 11",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-11-curriculum-core-project-refactoring-clinic-11",
					"design-patterns-in-java-part-2-refactoring-clinic-11-curriculum-core-project",
					"design-patterns-in-java-part-2-refactoring-clinic-11-curriculum-refactoring-clinic-11-core-project",
					"refactoring-clinic-11-core-project",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-core-project"
				],
				content:
					"Refactor src/app/TripPlanner.java so an owned route object holds the immutable points and distance/summary behavior. Extract a leg helper first, then move state and its decisions together. Preserve new TripPlanner(), PlannerAPI, errors and exact output. Add the extracted Java file to sources.txt. Retain two small source changes, passing baseline/core results and an unchanged external client.\n\nRun ContractChecks core with -ea and -da.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-11-core"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-11",
				title: "Review: Refactoring Clinic 11",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-11-curriculum-review-refactoring-clinic-11",
					"design-patterns-in-java-part-2-refactoring-clinic-11-curriculum-refactoring-clinic-11-review-and-reflection",
					"refactoring-clinic-11-review-and-reflection",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-review-and-reflection"
				],
				content:
					"Compare the source dependencies before and after the move. Identify the actual owner of the points and distance rule, one public call that stayed unchanged, and a future representation change that the new boundary could contain. Use a concrete client result to support the argument.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-11-review"
			}
		],
		supplementalProjects: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-11",
				title: "Extension Challenge: Refactoring Clinic 11",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-11-supplemental-extension-challenge-refactoring-clinic-11",
					"design-patterns-in-java-part-2-refactoring-clinic-11-supplemental-extension-challenge",
					"design-patterns-in-java-part-2-refactoring-clinic-11-supplemental-refactoring-clinic-11-extension-challenge",
					"refactoring-clinic-11-extension-challenge",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-extension-challenge"
				],
				content:
					"Continue the core attempt with a separate Probe.java for empty input, negative coordinates and a caller list changed after RouteData construction. Preserve the frozen checks. Explain what each observation says about ownership and what it leaves for design review.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-11-continuation"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-transfer-practice",
				title: "Refactoring Clinic 11 Transfer Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-11-supplemental-transfer-practice-refactoring-clinic-11",
					"design-patterns-in-java-part-2-refactoring-clinic-11-supplemental-transfer-practice"
				],
				content:
					"## Optional transfer: longest leg\n\nComplete transfer.LongestLeg.measure(RouteData), independently of the core. Validate null with NullPointerException(\"route\"). Return the maximum consecutive Manhattan leg length; return zero for zero or one stop. Preserve the route and every point in order. There is no closing leg. The sample's result is 3, distinct from its total distance 7.\n\n    java -ea -cp out ContractChecks transfer\n    java -da -cp out ContractChecks transfer\n    java -cp out Main transfer\n\nExplain whether this new query belongs on an owned route or in a stateless operation over an immutable input value. The reference uses the latter for this independent exercise; compare the tradeoff with the core's cohesive route behavior. Retain a route where longest leg differs from total distance, an empty route and an opposing-sign case. The frozen checks cover values and purity; the source explanation addresses ownership.\n\nRun ContractChecks transfer with -ea and -da.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-11-transfer"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-11-extension-practice",
				title: "Refactoring Clinic 11 Extension Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-11-supplemental-extension-practice-refactoring-clinic-11",
					"design-patterns-in-java-part-2-refactoring-clinic-11-supplemental-extension-practice"
				],
				content:
					'## Optional extension: waypoint replacement preview\n\nComplete extension.WaypointEdit.replace(route,index,replacement), independently of core and transfer. This introduces a new operation with its own contract. Validate route first with NullPointerException("route"), then replacement with NullPointerException("replacement"), then the index. An index outside 0 through size-1 throws IndexOutOfBoundsException("index"). Thus an empty route has no valid replacement index.\n\nReturn a new RouteData with the exact original name and stop count, replacing only the selected position. Preserve the input and all other positions. Its returned stop list is unmodifiable. Coordinates follow the frozen Point contract. Replacing the sample\'s second point with (3,4) changes the total to 15: the new leg lengths are 7, 6 and 2.\n\n    java -ea -cp out ContractChecks extension\n    java -da -cp out ContractChecks extension\n    java -cp out Main extension\n\nDemonstrate the first and last indices, a rejected index and input retained after an edit. Keep this feature separate from the core\'s behavior-preserving moves.\n\nRun ContractChecks extension with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-11-extension"
			}
		]
	},
	{
		title: "Refactoring Clinic 12: Practice Studio",
		unitID: "clinic12",
		curriculum: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-core-concepts",
				title: "Refactoring Clinic 12: Core Concepts",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-12-curriculum-refactoring-clinic-12-core-concepts"
				],
				content:
					'The starter\'s original public behavior and Main core work. The post-refactor core check reports \'Complete rule registry\' until the new required design entry points are completed. Transfer and extension each report their named unfinished operation until completed. Their source files can be finished independently.\n\n## Run the working before design\n\nUse JDK 21 from the extracted project folder:\n\n    javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt\n    java -ea -cp out ContractChecks baseline\n    java -da -cp out ContractChecks baseline\n    java -cp out Main baseline\n    java -cp out Main core\n    java -cp out CompatibilityClient\n\nBaseline compares the frozen legacy implementation and the candidate\'s existing public behavior. Both Main modes print the same result:\n\n    text=go\n\n## Diagnose and migrate one branch\n\nMessageService currently owns a conditional for plain and compact output. Trace both modes with message "go": plain returns "text=go\\n" and compact returns "2|go\\n". The newline is part of each result. Empty input is valid: compact returns "0|\\n". Message length is Java String.length, so it counts UTF-16 char units, not displayed glyphs.\n\nExtract PlainRule first and route only the plain branch through it. Keep compact on the existing path, compile, and run baseline. Then extract CompactRule. Move selection to an assembly boundary with a defensive copy of a rule registry; the rendering method validates and dispatches through RenderRule. Adding a new caller-supplied variant should leave that method unchanged. A small selection map at assembly is compatible with polymorphic behavior.\n\nRequired API: new MessageService() still supports exactly plain and compact. Add the already-scaffolded MessageService(Map<String,RenderRule>) so callers can supply a different registry. Validate null registry with NullPointerException("rules"). Validate entries in the supplied map\'s iteration order: keys must match [a-z]{1,12}; null key throws NullPointerException("mode"), invalid key IllegalArgumentException("mode"), and null rule NullPointerException("rule"). Snapshot the mapping so later caller mutations do not change dispatch. An empty registry is valid and supports no modes.\n\nFor render, validate mode non-null first (message "mode"), then message. A null message throws NullPointerException("message"). Strings longer than 24 UTF-16 char units, or containing pipe, carriage return or newline, throw IllegalArgumentException("message"). Empty strings, accepted spaces and Unicode are retained exactly. Finally reject an unavailable mode with IllegalArgumentException("mode"). Invoke only the selected rule, exactly once. Rule results and runtime failures pass through this core boundary.\n\nPlainRule returns "text="+message+"\\n"; CompactRule returns message.length()+"|"+message+"\\n". Their input is validated by the facade. The reference uses ordinary objects and a map; inheritance is unnecessary for these independent policies. Compare this with a switch when the variant set is small and fixed. The refactor is justified here by a caller-supplied rule requirement and preserved branch-specific behavior.\n\nRecord the original branch hotspot, the actual plain-only migration, both protected outputs, the registry\'s owner, an unsupported-mode result and a new caps rule. Explain which conditional remains in assembly and why new behavior resides in the rules.\n\n## Finish and review\n\nAfter the required refactor, run:\n\n    java -ea -cp out ContractChecks core\n    java -da -cp out ContractChecks core\n\nFor each chosen independent exercise, run its ContractChecks transfer or extension mode under both assertion settings and Main with that mode. After all three projects are complete, run ContractChecks all. Every demo/check mode reads no standard input. The supplied application uses in-memory values and console output; its fixtures model callbacks without contacting external services.\n\nPreserve the api package, legacy implementation, check helper, ContractChecks, Main and CompatibilityClient. Keep learner-written checks in a separate file and add new Java source paths to sources.txt. The reference is one design, and the frozen checks cover stated observations; the review record supplies the ownership, risk and design argument.\n\nWrite this separately compiled Probe.java after completing core:\n\n    import app.MessageService;\n    import api.RenderRule;\n    import java.util.*;\n    public final class Probe {\n        private Probe() {}\n        public static void main(String[] args) {\n            RenderRule caps=text->text.toUpperCase(Locale.ROOT);\n            MessageService messages=new MessageService(Map.of("caps",caps));\n            if(!messages.render("caps","go").equals("GO"))throw new AssertionError("variant");\n            System.out.println("probe passed");\n        }\n    }\n\nCompile with javac --release 21 -cp out -d out Probe.java and run java -cp out Probe. Expected output is "probe passed" followed by newline. The public client demonstrates the required boundary independently of the supplied checker.',
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "choice"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-guided-example",
				title: "Refactoring Clinic 12: Guided Example",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-12-curriculum-refactoring-clinic-12-guided-example"
				],
				content:
					"Run plain and compact for the same message, trace validation before branch selection, and extract only plain first. Keep compact working during that mixed state. Record exact outputs before introducing a registry.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-12-guided"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-12",
				title: "Core Project: Refactoring Clinic 12",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-12-curriculum-core-project-refactoring-clinic-12",
					"design-patterns-in-java-part-2-refactoring-clinic-12-curriculum-core-project",
					"design-patterns-in-java-part-2-refactoring-clinic-12-curriculum-refactoring-clinic-12-core-project",
					"refactoring-clinic-12-core-project",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-core-project"
				],
				content:
					"Extract PlainRule and CompactRule from MessageService's conditional. Keep the default plain/compact API and complete the caller-supplied rule registry constructor. Preserve validation order and snapshot the map. Demonstrate the plain-only intermediate before migrating compact, then a caps rule supplied without editing the rendering method.\n\nRun ContractChecks core with -ea and -da.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-12-core"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-12",
				title: "Review: Refactoring Clinic 12",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-12-curriculum-review-refactoring-clinic-12",
					"design-patterns-in-java-part-2-refactoring-clinic-12-curriculum-refactoring-clinic-12-review-and-reflection",
					"refactoring-clinic-12-review-and-reflection",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-review-and-reflection"
				],
				content:
					"Use a caller-supplied caps rule to show where new variant behavior lives and which method remains unchanged. Compare the small fixed-switch alternative with runtime rule selection; identify the requirement that justifies the added boundary.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-12-review"
			}
		],
		supplementalProjects: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-12",
				title: "Extension Challenge: Refactoring Clinic 12",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-12-supplemental-extension-challenge-refactoring-clinic-12",
					"design-patterns-in-java-part-2-refactoring-clinic-12-supplemental-extension-challenge",
					"design-patterns-in-java-part-2-refactoring-clinic-12-supplemental-refactoring-clinic-12-extension-challenge",
					"refactoring-clinic-12-extension-challenge",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-extension-challenge"
				],
				content:
					"Continue the core attempt with empty, spaced and unavailable-mode inputs. Retain a registry snapshot after the caller clears its original map. Check that invalid input reaches no rule.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-12-continuation"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-transfer-practice",
				title: "Refactoring Clinic 12 Transfer Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-12-supplemental-transfer-practice-refactoring-clinic-12",
					"design-patterns-in-java-part-2-refactoring-clinic-12-supplemental-transfer-practice"
				],
				content:
					'## Independent transfer: validate and render a batch\n\nComplete RenderBatch.lines(Messages renderer,String mode,List<String> lines). Validate renderer, mode and the list in that order with NullPointerException messages "renderer", "mode" and "lines". Copy the input and validate every message using the same text rules before invoking any renderer. Null items report "message". Render each item once in original order and concatenate results exactly. Retain the caller\'s list.\n\nAn empty list returns "" without dispatch, so an unavailable mode is observed only when an item is actually rendered. A runtime failure propagates and stops later calls. Earlier callback effects have no rollback promise.\n\nA recorder that returns mode+":"+text+"\\n" over ["a", "", " b "] produces "plain:a\\nplain:\\nplain: b \\n". Retain its call log, a later invalid item with zero renderer calls, and a deliberately failing callback. This task can finish with the core registry still unfinished.\n\nRun ContractChecks transfer with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-12-transfer"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-12-extension-practice",
				title: "Refactoring Clinic 12 Extension Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-12-supplemental-extension-practice-refactoring-clinic-12",
					"design-patterns-in-java-part-2-refactoring-clinic-12-supplemental-extension-practice"
				],
				content:
					'## Independent extension: compose a prefix policy\n\nComplete PrefixRule implements RenderRule. The constructor validates prefix first: null throws NullPointerException("prefix"); more than 12 UTF-16 char units or any carriage return/newline throws IllegalArgumentException("prefix"). Other prefix text, including an empty prefix, is accepted exactly. Then validate delegate with NullPointerException("delegate").\n\nrender validates message using the core text rules, calls the delegate once, rejects a null returned result with NullPointerException("output"), and returns prefix followed by that exact result. Runtime failures propagate. Prefixes A then B around an identity rule yield "ABgo", not "goBA". This adds a new composable policy separately from preserving the two original outputs.\n\nRetain exact prefix ordering, one delegate-call observation, invalid input with no call, a null-result failure and a nested policy. Compare implementing a new rule with editing the old conditional.\n\nRun ContractChecks extension with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-12-extension"
			}
		]
	},
	{
		title: "Refactoring Clinic 13: Practice Studio",
		unitID: "clinic13",
		curriculum: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-core-concepts",
				title: "Refactoring Clinic 13: Core Concepts",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-13-curriculum-refactoring-clinic-13-core-concepts"
				],
				content:
					'The starter\'s original public behavior and Main core work. The post-refactor core check reports \'Complete parameter object\' until the new required design entry points are completed. Transfer and extension each report their named unfinished operation until completed. Their source files can be finished independently.\n\n## Run the working before design\n\nUse JDK 21 from the extracted project folder:\n\n    javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt\n    java -ea -cp out ContractChecks baseline\n    java -da -cp out ContractChecks baseline\n    java -cp out Main baseline\n    java -cp out Main core\n    java -cp out CompatibilityClient\n\nBaseline compares the frozen legacy implementation and the candidate\'s existing public behavior. Both Main modes print the same result:\n\n    2..9/3:[2, 5, 8]\n\n## Trace the data clump\n\nThe old Ranges API passes start, end and step separately to values and describe. For (2,9,3), values are [2,5,8] and describe is "2..9/3:[2, 5, 8]". End is inclusive only when reached by a whole step; 9 is not automatically appended. Equal endpoints produce one value.\n\nAll three integers form one coherent range concept. Introduce the scaffolded RangeSpec record as its validation boundary, then make new values(RangeSpec) and describe(RangeSpec) methods consume the whole object. Keep the old integer signatures as adapters so existing clients preserve their behavior. A parameter object groups related meaning; unrelated output formatting preferences need not join it.\n\nValidation order is start, end, step, then range consistency. Start and end must each be 0 through 100; violations throw IllegalArgumentException("start") or ("end"). Step must be 1 through 20; violations report "step". Only after those checks, end<start throws IllegalArgumentException("range"). Thus (10,0,0) reports step; (10,0,1) reports range. RangeSpec construction and the old API share those promises.\n\nReturn an unmodifiable ascending list starting at start and repeatedly adding step while the value is <=end. The new overloads reject null RangeSpec with NullPointerException("range"). describe preserves the exact "START..END/STEP:[list]" format, with ordinary List spacing and no newline in the returned string. Main adds a newline.\n\nFirst complete RangeSpec while leaving all original call sites untouched and rerun baseline. Then migrate enumeration to the object overload, adapt the old integer method and migrate describe. Compare old and new calls on a nonlanding end and an invalid group. The reference delegates old entry points to a validated RangeSpec.\n\nRecord the three values\' path through both old methods, the new validation boundary, changed call sites, equal/nonlanding endpoint cases, an invalid group and a judgment about whether the object clarified the API. Passing old behavior alone does not prove the new whole-object entry points work.\n\n## Finish and review\n\nAfter the required refactor, run:\n\n    java -ea -cp out ContractChecks core\n    java -da -cp out ContractChecks core\n\nFor each chosen independent exercise, run its ContractChecks transfer or extension mode under both assertion settings and Main with that mode. After all three projects are complete, run ContractChecks all. Every demo/check mode reads no standard input. The supplied application uses in-memory values and console output; its fixtures model callbacks without contacting external services.\n\nPreserve the api package, legacy implementation, check helper, ContractChecks, Main and CompatibilityClient. Keep learner-written checks in a separate file and add new Java source paths to sources.txt. The reference is one design, and the frozen checks cover stated observations; the review record supplies the ownership, risk and design argument.\n\nWrite this separately compiled Probe.java after completing core:\n\n    import app.*;\n    import java.util.List;\n    public final class Probe {\n        private Probe() {}\n        public static void main(String[] args) {\n            RangeSpec range=new RangeSpec(2,9,3);\n            RangeService service=new RangeService();\n            if(!service.values(range).equals(List.of(2,5,8)))throw new AssertionError("whole object");\n            if(!service.values(2,9,3).equals(service.values(range)))throw new AssertionError("old adapter");\n            System.out.println("probe passed");\n        }\n    }\n\nCompile with javac --release 21 -cp out -d out Probe.java and run java -cp out Probe. Expected output is "probe passed" followed by newline. The public client demonstrates the required boundary independently of the supplied checker.',
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "choice"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-guided-example",
				title: "Refactoring Clinic 13: Guided Example",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-13-curriculum-refactoring-clinic-13-guided-example"
				],
				content:
					"Trace start, end and step through values and describe. Predict the nonlanding endpoint example, introduce the validated object without changing old callers, then migrate one entry point at a time.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-13-guided"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-13",
				title: "Core Project: Refactoring Clinic 13",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-13-curriculum-core-project-refactoring-clinic-13",
					"design-patterns-in-java-part-2-refactoring-clinic-13-curriculum-core-project",
					"design-patterns-in-java-part-2-refactoring-clinic-13-curriculum-refactoring-clinic-13-core-project",
					"refactoring-clinic-13-core-project",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-core-project"
				],
				content:
					"Complete RangeSpec as the coherent start/end/step value, migrate enumeration and description to whole-object overloads, and retain the original integer signatures as adapters. Preserve inclusive-step behavior, unmodifiable results and the stated validation order. Run the separately compiled whole-object probe.\n\nRun ContractChecks core with -ea and -da.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-13-core"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-13",
				title: "Review: Refactoring Clinic 13",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-13-curriculum-review-refactoring-clinic-13",
					"design-patterns-in-java-part-2-refactoring-clinic-13-curriculum-refactoring-clinic-13-review-and-reflection",
					"refactoring-clinic-13-review-and-reflection",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-review-and-reflection"
				],
				content:
					"Explain why start/end/step form one concept and why an unrelated formatting preference need not join the object. Compare old and new calls, including an inconsistent range, to show a meaningful validation boundary.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-13-review"
			}
		],
		supplementalProjects: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-13",
				title: "Extension Challenge: Refactoring Clinic 13",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-13-supplemental-extension-challenge-refactoring-clinic-13",
					"design-patterns-in-java-part-2-refactoring-clinic-13-supplemental-extension-challenge",
					"design-patterns-in-java-part-2-refactoring-clinic-13-supplemental-refactoring-clinic-13-extension-challenge",
					"refactoring-clinic-13-extension-challenge",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-extension-challenge"
				],
				content:
					"Continue the core attempt with equal endpoints, invalid end/step combinations and a null RangeSpec. Record the exact error order while old and new calls coexist.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-13-continuation"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-transfer-practice",
				title: "Refactoring Clinic 13 Transfer Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-13-supplemental-transfer-practice-refactoring-clinic-13",
					"design-patterns-in-java-part-2-refactoring-clinic-13-supplemental-transfer-practice"
				],
				content:
					'## Independent transfer: preserve a whole list\n\nComplete EveryOther.select(List<Integer> values). Null input throws NullPointerException("values"); null members are rejected by List.copyOf. Return an unmodifiable list of positions 0,2,4,..., retaining values, duplicates and original relative order. Accept arbitrary integers, including negatives. Keep the caller\'s list unchanged.\n\nFor [8,1,8,2,9], the result is [8,8,9]. Empty input produces an empty list and a one-element input retains that element. This is index selection, not choosing even-valued integers. Discuss how passing the whole immutable input avoids a separate size parameter that could disagree with the list.\n\nRetain an odd-length case, duplicate values, an empty list and an input-purity check. This task is independent of RangeSpec.\n\nRun ContractChecks transfer with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-13-transfer"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-13-extension-practice",
				title: "Refactoring Clinic 13 Extension Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-13-supplemental-extension-practice-refactoring-clinic-13",
					"design-patterns-in-java-part-2-refactoring-clinic-13-supplemental-extension-practice"
				],
				content:
					'## Independent extension: combine two samples\n\nComplete MergeRanges.unique(first,second). Validate and snapshot first, then second, with NullPointerException("first") or ("second") for null lists. Null members are rejected before merging. Accept arbitrary int values in either order, remove duplicates across both inputs and return an unmodifiable ascending list. Preserve both caller inputs.\n\n[8,2,5,2] and [9,1,5] produce [1,2,5,8,9]. Two empty inputs produce []. Comparison must remain correct for Integer.MIN_VALUE and MAX_VALUE; subtraction is an unsafe comparator for that domain. The reference uses natural ordering in a TreeSet.\n\nThis adds a separate combination feature rather than changing the old range\'s inclusive-step policy. Retain overlapping/empty/extreme cases and both unchanged inputs.\n\nRun ContractChecks extension with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-13-extension"
			}
		]
	},
	{
		title: "Refactoring Clinic 14: Practice Studio",
		unitID: "clinic14",
		curriculum: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-core-concepts",
				title: "Refactoring Clinic 14: Core Concepts",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-14-curriculum-refactoring-clinic-14-core-concepts"
				],
				content:
					'The starter\'s original public behavior and Main core work. The post-refactor core check reports \'Complete named queries\' until the new required design entry points are completed. Transfer and extension each report their named unfinished operation until completed. Their source files can be finished independently.\n\n## Run the working before design\n\nUse JDK 21 from the extracted project folder:\n\n    javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt\n    java -ea -cp out ContractChecks baseline\n    java -da -cp out ContractChecks baseline\n    java -cp out Main baseline\n    java -cp out Main core\n    java -cp out CompatibilityClient\n\nBaseline compares the frozen legacy implementation and the candidate\'s existing public behavior. Both Main modes print the same result:\n\n    EnergyResult[raw=99, usable=49, lost=50]\n\n## Split a reused temporary before extracting queries\n\nThe working measure(watts,seconds,efficiency) reuses a temporary first for raw energy and then for usable energy. Its input is constant power in watts, a duration in seconds, and an integer efficiency percentage. This simplified calculation uses raw=watts*seconds joules, usable=floor(raw*efficiency/100), and lost=raw-usable. It models the stated arithmetic, not a physical measurement or variable-power simulation.\n\nValidation order is watts (0..1000), seconds (0..3600), then efficiency (0..100), inclusive. Invalid values throw IllegalArgumentException with message "watts", "seconds" or "efficiency". Each EnergyResult is immutable; raw is 0..3600000, usable is 0..raw and lost must equal raw-usable. Its constructor validates those fields in that order, reporting "raw", "usable" or "lost".\n\nFor (33,3,50), raw is 99, usable is 49 and lost is 50. Multiplying before integer division is essential: 99/100*50 gives the wrong usable value. For (1000,3600,100), raw and usable are 3600000 and lost is zero. Zero power, duration or efficiency follows the same formula.\n\nFirst name rawJoules and usableJoules separately while keeping all arithmetic and validation order. Run baseline and record those two values. Then complete the public raw(watts,seconds) and usable(raw,efficiency) query scaffolds and call them from measure. raw validates watts then seconds and returns their product. usable validates raw in 0..3600000 with IllegalArgumentException("raw"), then efficiency, and returns raw*efficiency/100. The stated bounds keep this product within int.\n\nThe reference gives each query one meaning and no state changes. Query extraction is appropriate because the computation is repeatable and has no outside effects. A temporary that holds a one-time random, file or network result cannot simply be replaced by a repeatedly executed query.\n\nRecord the reused variable\'s meanings, the split-variable checkpoint, exact intermediate values, the extracted query boundaries and the rounding-sensitive counterexample. Retain an invalid input and a maximum input. Explain why changing rounding policy would be new behavior.\n\n## Finish and review\n\nAfter the required refactor, run:\n\n    java -ea -cp out ContractChecks core\n    java -da -cp out ContractChecks core\n\nFor each chosen independent exercise, run its ContractChecks transfer or extension mode under both assertion settings and Main with that mode. After all three projects are complete, run ContractChecks all. Every demo/check mode reads no standard input. The supplied application uses in-memory values and console output; its fixtures model callbacks without contacting external services.\n\nPreserve the api package, legacy implementation, check helper, ContractChecks, Main and CompatibilityClient. Keep learner-written checks in a separate file and add new Java source paths to sources.txt. The reference is one design, and the frozen checks cover stated observations; the review record supplies the ownership, risk and design argument.\n\nWrite this separately compiled Probe.java after completing core:\n\n    import app.EnergyMeter;\n    public final class Probe {\n        private Probe() {}\n        public static void main(String[] args) {\n            EnergyMeter meter=new EnergyMeter();\n            int raw=meter.raw(33,3),usable=meter.usable(raw,50);\n            if(raw!=99||usable!=49)throw new AssertionError("intermediate values");\n            if(meter.measure(33,3,50).lost()!=50)throw new AssertionError("loss");\n            System.out.println("probe passed");\n        }\n    }\n\nCompile with javac --release 21 -cp out -d out Probe.java and run java -cp out Probe. Expected output is "probe passed" followed by newline. The public client demonstrates the required boundary independently of the supplied checker.',
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "choice"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-guided-example",
				title: "Refactoring Clinic 14: Guided Example",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-14-curriculum-refactoring-clinic-14-guided-example"
				],
				content:
					"Trace the reused variable for 33 watts, 3 seconds and 50 percent efficiency. Name rawJoules and usableJoules separately before extracting queries; compare their values after that first small step.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-14-guided"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-14",
				title: "Core Project: Refactoring Clinic 14",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-14-curriculum-core-project-refactoring-clinic-14",
					"design-patterns-in-java-part-2-refactoring-clinic-14-curriculum-core-project",
					"design-patterns-in-java-part-2-refactoring-clinic-14-curriculum-refactoring-clinic-14-core-project",
					"refactoring-clinic-14-core-project",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-core-project"
				],
				content:
					"Split EnergyMeter's reused temporary into raw and usable meanings, then complete pure raw and usable queries and call them from measure. Preserve validation and multiply-before-divide rounding. Retain actual intermediate values, a maximum case and the unchanged EnergyAPI client.\n\nRun ContractChecks core with -ea and -da.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-14-core"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-14",
				title: "Review: Refactoring Clinic 14",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-14-curriculum-review-refactoring-clinic-14",
					"design-patterns-in-java-part-2-refactoring-clinic-14-curriculum-refactoring-clinic-14-review-and-reflection",
					"refactoring-clinic-14-review-and-reflection",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-review-and-reflection"
				],
				content:
					"Explain why these parameter-only computations are safe repeatable queries. Compare them with a hypothetical query that obtains a new random or external value on each call, and identify the behavioral change that such repeated evaluation could introduce.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-14-review"
			}
		],
		supplementalProjects: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-14",
				title: "Extension Challenge: Refactoring Clinic 14",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-14-supplemental-extension-challenge-refactoring-clinic-14",
					"design-patterns-in-java-part-2-refactoring-clinic-14-supplemental-extension-challenge",
					"design-patterns-in-java-part-2-refactoring-clinic-14-supplemental-refactoring-clinic-14-extension-challenge",
					"refactoring-clinic-14-extension-challenge",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-extension-challenge"
				],
				content:
					"Continue the core attempt with zero and maximum readings, an invalid input group, and an out-of-range raw-query input. Preserve exception order and exact integer arithmetic.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-14-continuation"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-transfer-practice",
				title: "Refactoring Clinic 14 Transfer Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-14-supplemental-transfer-practice-refactoring-clinic-14",
					"design-patterns-in-java-part-2-refactoring-clinic-14-supplemental-transfer-practice"
				],
				content:
					'## Independent transfer: quantify loss\n\nComplete EnergyLoss.percentage(EnergyResult). Null input throws NullPointerException("result"). Return zero when raw is zero; otherwise return floor(lost*100/raw). Do not modify the result. Widen the numerator before multiplying when adapting the domain; the reference uses long.\n\nFor (99,49,50), the returned percentage is 50. It is a percentage of raw energy, distinct from the usable count or its percentage. Retain zero energy, all lost, no loss and a fractional result.\n\nRun ContractChecks transfer with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "choice",
				preserveAssignment: true,
				caseSection: "clinic-14-transfer"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-14-extension-practice",
				title: "Refactoring Clinic 14 Extension Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-14-supplemental-extension-practice-refactoring-clinic-14",
					"design-patterns-in-java-part-2-refactoring-clinic-14-supplemental-extension-practice"
				],
				content:
					'## Independent extension: aggregate a bounded batch\n\nComplete EnergyBatch.total(List<EnergyResult>). Null list throws NullPointerException("readings"). Snapshot the whole list; null members are rejected. After the snapshot, more than 20 readings throws IllegalArgumentException("readings"). Sum raw, usable and lost separately and return immutable BatchTotal with long fields. Preserve all input entries and order.\n\nAn empty batch gives (0,0,0). (99,49,50) plus (100,100,0) gives (199,149,50). Twenty maximum readings can total raw=72000000; this aggregate uses its own type because that exceeds one measurement\'s bound. BatchTotal validates raw 0..72000000, usable 0..raw and lost=raw-usable in that order.\n\nRetain two different readings, empty and maximum-size batches, a rejected over-size batch and the original input. Aggregating measurements is separate from changing the single-reading formula.\n\nRun ContractChecks extension with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-14-extension"
			}
		]
	},
	{
		title: "Refactoring Clinic 15: Practice Studio",
		unitID: "clinic15",
		curriculum: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-core-concepts",
				title: "Refactoring Clinic 15: Core Concepts",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-15-curriculum-refactoring-clinic-15-core-concepts"
				],
				content:
					'The starter\'s original public behavior and Main core work. The post-refactor core check reports \'Complete template skeleton\' until the new required design entry points are completed. Transfer and extension each report their named unfinished operation until completed. Their source files can be finished independently.\n\n## Run the working before design\n\nUse JDK 21 from the extracted project folder:\n\n    javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt\n    java -ea -cp out ContractChecks baseline\n    java -da -cp out ContractChecks baseline\n    java -cp out Main baseline\n    java -cp out Main core\n    java -cp out CompatibilityClient\n\nBaseline compares the frozen legacy implementation and the candidate\'s existing public behavior. Both Main modes print the same result:\n\n    begin\n    a\n    b\n    end\n\n## Identify the common sequence\n\nThe working DocumentService duplicates a document workflow: validate rows, create a header, append each row in order and finish with a footer. Plain output for ["a","b"] is "begin\\na\\nb\\nend\\n"; marked output is "BEGIN\\n* a\\n* b\\nEND\\n". Every shown line ends with newline. Empty input still has its header and footer. An empty row remains an actual blank body row.\n\nThe facade validates kind non-null with NullPointerException("kind"), then the entire row list, then checks whether kind is exactly plain or marked. Unknown kinds throw IllegalArgumentException("kind"). Row validation rejects a null list with NullPointerException("rows") and more than six rows with IllegalArgumentException("rows"). Each row must be non-null (NullPointerException("row")), at most 16 UTF-16 char units and contain no pipe, carriage return or newline (IllegalArgumentException("row")). Empty rows and accepted spaces are preserved. Input order and caller lists remain unchanged.\n\nExtract the repeated row loop into a helper first. Run baseline with both formats before adding variation. Then complete DocumentTemplate\'s final build method: validate all rows, call header once, line once per row in order, and footer once. Concatenate exactly those strings. Reject null hook results with NullPointerException("header"), ("line") or ("footer"). A hook runtime failure propagates and stops later hooks. Earlier callback effects have no rollback guarantee.\n\nheader and line are protected abstract hooks. The default footer is an empty string, permitting a deliberate omitted footer. PlainDocument and MarkedDocument implement their existing formats. Keep DocumentService.build(kind,rows) and new DocumentService() intact. The reference facade selects a format and delegates to the shared final skeleton; individual variants own their formatting.\n\nCompile a custom template with no footer and check its output. Record a trace such as header, line:a, line:, footer and verify that invalid later rows cause no hooks. A final template method keeps order fixed while subclasses supply steps. A Strategy-based design can instead receive independent step collaborators when runtime assembly or multiple unrelated behaviors warrant it; compare that tradeoff rather than introducing both forms by default.\n\nRetain both original outputs, the first shared-loop extraction, the final skeleton, an omitted-footer case, a failing body hook and an explanation of which duplication disappeared.\n\n## Finish and review\n\nAfter the required refactor, run:\n\n    java -ea -cp out ContractChecks core\n    java -da -cp out ContractChecks core\n\nFor each chosen independent exercise, run its ContractChecks transfer or extension mode under both assertion settings and Main with that mode. After all three projects are complete, run ContractChecks all. Every demo/check mode reads no standard input. The supplied application uses in-memory values and console output; its fixtures model callbacks without contacting external services.\n\nPreserve the api package, legacy implementation, check helper, ContractChecks, Main and CompatibilityClient. Keep learner-written checks in a separate file and add new Java source paths to sources.txt. The reference is one design, and the frozen checks cover stated observations; the review record supplies the ownership, risk and design argument.\n\nWrite this separately compiled Probe.java after completing core:\n\n    import app.DocumentTemplate;\n    import java.util.List;\n    public final class Probe {\n        private Probe() {}\n        public static void main(String[] args) {\n            DocumentTemplate custom=new DocumentTemplate() {\n                protected String header(){return "H\\n";}\n                protected String line(String row){return row+"\\n";}\n            };\n            if(!custom.build(List.of("a")).equals("H\\na\\n"))throw new AssertionError("optional footer");\n            System.out.println("probe passed");\n        }\n    }\n\nCompile with javac --release 21 -cp out -d out Probe.java and run java -cp out Probe. Expected output is "probe passed" followed by newline. The public client demonstrates the required boundary independently of the supplied checker.',
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "challenge"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-guided-example",
				title: "Refactoring Clinic 15: Guided Example",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-15-curriculum-refactoring-clinic-15-guided-example"
				],
				content:
					"Compare the two original workflows line by line. Mark header/body/footer variation separately from the fixed sequence, extract the row-loop helper first, and rerun both formats before introducing template subclasses.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-15-guided"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-15",
				title: "Core Project: Refactoring Clinic 15",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-15-curriculum-core-project-refactoring-clinic-15",
					"design-patterns-in-java-part-2-refactoring-clinic-15-curriculum-core-project",
					"design-patterns-in-java-part-2-refactoring-clinic-15-curriculum-refactoring-clinic-15-core-project",
					"refactoring-clinic-15-core-project",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-core-project"
				],
				content:
					"Extract DocumentService's shared row loop, then complete DocumentTemplate's fixed build sequence and its format hooks. Retain plain/marked output and validate all rows before any hook. Demonstrate an omitted footer and a failing body hook with an actual call trace.\n\nRun ContractChecks core with -ea and -da.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-15-core"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-15",
				title: "Review: Refactoring Clinic 15",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-15-curriculum-review-refactoring-clinic-15",
					"design-patterns-in-java-part-2-refactoring-clinic-15-curriculum-refactoring-clinic-15-review-and-reflection",
					"refactoring-clinic-15-review-and-reflection",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-review-and-reflection"
				],
				content:
					"Use the trace to explain why the template owns order while subclasses own formatting. Compare that inheritance boundary with independently supplied Strategy collaborators when several variation axes or runtime assembly would justify composition.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-15-review"
			}
		],
		supplementalProjects: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-15",
				title: "Extension Challenge: Refactoring Clinic 15",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-15-supplemental-extension-challenge-refactoring-clinic-15",
					"design-patterns-in-java-part-2-refactoring-clinic-15-supplemental-extension-challenge",
					"design-patterns-in-java-part-2-refactoring-clinic-15-supplemental-refactoring-clinic-15-extension-challenge",
					"refactoring-clinic-15-extension-challenge",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-extension-challenge"
				],
				content:
					"Continue the core attempt with a missing footer, an invalid later row and a body hook that fails. Predict which hooks run, which outputs are returned, and which callback effects may already have occurred.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-15-continuation"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-transfer-practice",
				title: "Refactoring Clinic 15 Transfer Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-15-supplemental-transfer-practice-refactoring-clinic-15",
					"design-patterns-in-java-part-2-refactoring-clinic-15-supplemental-transfer-practice"
				],
				content:
					'## Independent transfer: observe workflow stages\n\nComplete WorkflowTrace.stages(List<String> rows,StepHook hook). Validate and snapshot all rows with the same policy, then validate hook with NullPointerException("hook"). For valid input invoke hook.accept("start",""), then ("row",row) for each row, then ("end",""). Return an unmodifiable list containing "start", each "row:"+row, and "end". Input remains unchanged.\n\nFor ["a",""], the returned list is ["start","row:a","row:","end"], while hook arguments distinguish the stage name from its value. An empty input still calls start and end. A hook failure propagates and stops further calls. Record the actual call trace; a list constructed without invoking the hooks does not demonstrate collaborator order.\n\nThis exercise uses its own StepHook boundary and can finish with DocumentTemplate still unfinished. Retain a normal trace, empty trace, later-invalid input with no calls and one stopped trace.\n\nRun ContractChecks transfer with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-15-transfer"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-15-extension-practice",
				title: "Refactoring Clinic 15 Extension Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-15-supplemental-extension-practice-refactoring-clinic-15",
					"design-patterns-in-java-part-2-refactoring-clinic-15-supplemental-extension-practice"
				],
				content:
					'## Independent extension: numbered output and optional footer\n\nComplete NumberedRows.render(rows,footer). Apply the same whole-list validation and preserve input. Return "ROWS\\n", then one-based "NUMBER:ROW\\n" lines in original order. If footer is true, append "total=N\\n"; otherwise append nothing. Empty input produces only the header, plus "total=0\\n" when requested.\n\nFor ["a",""] with footer=true, output is "ROWS\\n1:a\\n2:\\ntotal=2\\n". Retain both footer choices, an empty input and a validation failure. This is a new format rather than a change to either original format.\n\nRun ContractChecks extension with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-15-extension"
			}
		]
	},
	{
		title: "Refactoring Clinic 16: Practice Studio",
		unitID: "clinic16",
		curriculum: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-core-concepts",
				title: "Refactoring Clinic 16: Core Concepts",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-16-curriculum-refactoring-clinic-16-core-concepts"
				],
				content:
					'The starter\'s baseline and core behavior checks already pass. A step log and actual source changes establish the design work. Transfer and extension each report their named unfinished operation until completed. Their source files can be finished independently.\n\n## Run the working before design\n\nUse JDK 21 from the extracted project folder:\n\n    javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt\n    java -ea -cp out ContractChecks baseline\n    java -da -cp out ContractChecks baseline\n    java -cp out Main baseline\n    java -cp out Main core\n    java -cp out CompatibilityClient\n\nBaseline compares the frozen legacy implementation and the candidate\'s existing public behavior. Both Main modes print the same result:\n\n    Hello, guest|screen\n    Hello, Ada|email\n\n## Preserve a deliberate missing-profile policy\n\nThe old Greetings API accepts a nullable Profile. Null deliberately produces hello="Hello, guest" and channel="screen". A present profile produces "Hello, "+its exact name and its stored channel. A real profile named guest with channel email is still present and must retain email.\n\nProfile is an immutable value. Validate name first: null throws NullPointerException("name"); blank, longer than 16 UTF-16 char units, or containing pipe/carriage-return/newline throws IllegalArgumentException("name"). Accepted spaces and Unicode are retained. Validate channel second: null throws NullPointerException("channel"), and anything except exact email or screen throws IllegalArgumentException("channel"). A partially populated or invalid profile fails during construction; it is never silently converted into a guest.\n\nTrace both old methods for null and a present profile. Extract a label decision first while keeping the channel path stable. Then introduce an internal Recipient abstraction. The reference uses KnownRecipient for present data and GuestRecipient for the intentional default; Recipient.of is the one nullable boundary. GreetingService remains the same public facade.\n\nThe guest object\'s methods define the default policy. They do not eliminate the need to distinguish presence at an input boundary. Default behavior is appropriate only where absence is an accepted domain case. Keep invalid Profile construction loud. Use the exact old outputs to protect this distinction.\n\nCore behavior checks already pass in the starter. Establish the source refactor with actual small changes, moved responsibility and an external unchanged client. Explain which repeated caller choices disappeared, where null is still interpreted, why guest is a policy rather than fabricated personal data, and one boundary where absence must instead be an error.\n\n## Finish and review\n\nAfter the required refactor, run:\n\n    java -ea -cp out ContractChecks core\n    java -da -cp out ContractChecks core\n\nFor each chosen independent exercise, run its ContractChecks transfer or extension mode under both assertion settings and Main with that mode. After all three projects are complete, run ContractChecks all. Every demo/check mode reads no standard input. The supplied application uses in-memory values and console output; its fixtures model callbacks without contacting external services.\n\nPreserve the api package, legacy implementation, check helper, ContractChecks, Main and CompatibilityClient. Keep learner-written checks in a separate file and add new Java source paths to sources.txt. The reference is one design, and the frozen checks cover stated observations; the review record supplies the ownership, risk and design argument.\n\nWrite this separately compiled Probe.java after completing core:\n\n    import app.GreetingService;\n    import api.*;\n    public final class Probe {\n        private Probe() {}\n        public static void main(String[] args) {\n            Greetings greetings=new GreetingService();\n            if(!greetings.channel(null).equals("screen"))throw new AssertionError("absent");\n            if(!greetings.channel(new Profile("guest","email")).equals("email"))throw new AssertionError("present guest");\n            System.out.println("probe passed");\n        }\n    }\n\nCompile with javac --release 21 -cp out -d out Probe.java and run java -cp out Probe. Expected output is "probe passed" followed by newline. The public client demonstrates the required boundary independently of the supplied checker.',
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "challenge"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-guided-example",
				title: "Refactoring Clinic 16: Guided Example",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-16-curriculum-refactoring-clinic-16-guided-example"
				],
				content:
					"Trace hello and channel for null, Ada/email and a real profile named guest/email. Extract one label decision first, then compare the special-case object and ordinary recipient paths.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-16-guided"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-16",
				title: "Core Project: Refactoring Clinic 16",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-16-curriculum-core-project-refactoring-clinic-16",
					"design-patterns-in-java-part-2-refactoring-clinic-16-curriculum-core-project",
					"design-patterns-in-java-part-2-refactoring-clinic-16-curriculum-refactoring-clinic-16-core-project",
					"refactoring-clinic-16-core-project",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-core-project"
				],
				content:
					"Replace repeated missing-profile choices with an internal Recipient boundary while keeping Greetings' existing nullable API. Preserve the guest policy and present profile values. Keep invalid partial profiles as construction failures and show the actual boundary move.\n\nRun ContractChecks core with -ea and -da.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-16-core"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-16",
				title: "Review: Refactoring Clinic 16",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-16-curriculum-review-refactoring-clinic-16",
					"design-patterns-in-java-part-2-refactoring-clinic-16-curriculum-refactoring-clinic-16-review-and-reflection",
					"refactoring-clinic-16-review-and-reflection",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-review-and-reflection"
				],
				content:
					"Identify the one accepted absence boundary and the invalid-data boundaries that must still fail. Explain why an Optional no-result return, a special-case object and a strict required-profile operation express different policies.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-16-review"
			}
		],
		supplementalProjects: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-16",
				title: "Extension Challenge: Refactoring Clinic 16",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-16-supplemental-extension-challenge-refactoring-clinic-16",
					"design-patterns-in-java-part-2-refactoring-clinic-16-supplemental-extension-challenge",
					"design-patterns-in-java-part-2-refactoring-clinic-16-supplemental-refactoring-clinic-16-extension-challenge",
					"refactoring-clinic-16-extension-challenge",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-extension-challenge"
				],
				content:
					"Continue the core attempt with a name containing accepted surrounding spaces and a partially populated profile. Check both exact text and channel rather than inferring absence from a name.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-16-continuation"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-transfer-practice",
				title: "Refactoring Clinic 16 Transfer Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-16-supplemental-transfer-practice-refactoring-clinic-16",
					"design-patterns-in-java-part-2-refactoring-clinic-16-supplemental-transfer-practice"
				],
				content:
					'## Independent transfer: an explicit Optional return\n\nComplete ProfileLookup.find(Map<String,Profile> directory,String key). Validate directory non-null with NullPointerException("directory"), then lookup key. Keys must match [a-z]{1,8}; null key throws NullPointerException("key") and other invalid lookup keys throw IllegalArgumentException("key").\n\nValidate and copy the complete directory in its iteration order before looking up a result. Directory keys use the same pattern, with messages "entryKey"; null keys throw NullPointerException and malformed ones IllegalArgumentException. Null profile values throw NullPointerException("profile"). Valid immutable Profile values are retained. Keep the supplied map unchanged.\n\nReturn Optional.of(profile) for a present key and Optional.empty() for a missing key. A missing entry and an invalid stored entry are different conditions. Even an invalid entry under an unrelated key is rejected by this complete-directory boundary. An empty directory is valid.\n\nRetain present, missing, empty and malformed-directory cases. Optional represents an explicit no-result return; the Optional object itself is always non-null. This task is independent of the core Recipient classes.\n\nRun ContractChecks transfer with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-16-transfer"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-16-extension-practice",
				title: "Refactoring Clinic 16 Extension Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-16-supplemental-extension-practice-refactoring-clinic-16",
					"design-patterns-in-java-part-2-refactoring-clinic-16-supplemental-extension-practice"
				],
				content:
					'## Independent extension: require presence\n\nComplete StrictGreeting.hello(Optional<Profile> result). A null Optional throws NullPointerException("result"). An empty Optional throws NoSuchElementException("profile"). A present profile returns "Hello, "+its exact name.\n\nThis separate operation has a strict presence policy; keep the original nullable Greetings API\'s guest policy unchanged. Retain a present profile, a real profile named guest, an empty Optional failure and a null-container failure. Explain why this boundary should refuse absence rather than fabricate a default.\n\nRun ContractChecks extension with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-16-extension"
			}
		]
	},
	{
		title: "Refactoring Clinic 17: Practice Studio",
		unitID: "clinic17",
		curriculum: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-core-concepts",
				title: "Refactoring Clinic 17: Core Concepts",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-17-curriculum-refactoring-clinic-17-core-concepts"
				],
				content:
					'The starter\'s baseline and core behavior checks already pass. A step log and actual source changes establish the design work. Transfer and extension each report their named unfinished operation until completed. Their source files can be finished independently.\n\n## Run the working before design\n\nUse JDK 21 from the extracted project folder:\n\n    javac --release 21 -encoding UTF-8 -Xlint:all -Werror -d out @sources.txt\n    java -ea -cp out ContractChecks baseline\n    java -da -cp out ContractChecks baseline\n    java -cp out Main baseline\n    java -cp out Main core\n    java -cp out CompatibilityClient\n\nBaseline compares the frozen legacy implementation and the candidate\'s existing public behavior. Both Main modes print the same result:\n\n    tasks=3\n    done=1\n    remaining=15\n    open=read,draw\n\n## Plan a sequence rather than a rewrite\n\nThe working BoardReport repeats unfinished-minute calculations and mixes calculation with report formatting. These are two concrete smells with different likely change causes. Trace the public summary and remainingMinutes calls before editing and write the proposed sequence in REFACTORING.md.\n\nTasks are immutable. Title is validated first: null throws NullPointerException("title"); blank, longer than 16 UTF-16 char units, or containing comma, pipe, carriage return or newline throws IllegalArgumentException("title"). Minutes must be 0..120, otherwise IllegalArgumentException("minutes"). Duplicate titles and zero minutes are valid.\n\nBoth board entry points validate a non-null list with NullPointerException("tasks"), then at most eight tasks with IllegalArgumentException("tasks"), then non-null members with NullPointerException("task"). Preserve caller data and encounter order. remainingMinutes sums only tasks whose done flag is false.\n\nsummary returns exactly four lines: "tasks=N\\n", "done=D\\n", "remaining=M\\n" and "open=TITLES\\n". TITLES are unfinished titles in encounter order, comma-separated without added spaces; "-" represents none. Retain duplicate titles. The sample [read(10,false),code(20,true),draw(5,false)] produces tasks=3, done=1, remaining=15 and open=read,draw. Empty input gives zero counts and open=-.\n\nUse these checkpoints:\n\n1. Extract the duplicated unfinished-minute loop into one private method. Run baseline and keep this small passing state.\n2. Move analysis into an owned BoardAnalysis while formatting stays in BoardReport. Validate the input once at that ownership boundary and produce a BoardStats value. Run baseline again and decide whether the planned next step is still safe.\n3. Move only formatting to BoardText, retaining the public facade and exact output. Run core and the unchanged external client.\n\nBoardStats is a frozen snapshot: tasks 0..8, done 0..tasks, remaining 0..960, and an unmodifiable copied openTitles list with size tasks-done. Its constructor validates those fields in that order and uses their field names in errors. Null members are rejected by List.copyOf. Derived stats retain unfinished titles in original order.\n\nThe reference performs one analysis pass, stores immutable state and lets a renderer consume the resulting value. Class counts alone do not show improvement: identify the responsibility moved and a change now confined behind that boundary.\n\nRetain the actual source/results for both intermediate checkpoints and the final design. Replay a retained earlier source in an isolated working copy to demonstrate a recoverable checkpoint. Keep personal work intact. Name a first proposed step that would be too broad and split it. Sorting titles changes observable output, so postpone it from the behavior-preserving core and evaluate it separately.\n\n## Finish and review\n\nAfter the required refactor, run:\n\n    java -ea -cp out ContractChecks core\n    java -da -cp out ContractChecks core\n\nFor each chosen independent exercise, run its ContractChecks transfer or extension mode under both assertion settings and Main with that mode. After all three projects are complete, run ContractChecks all. Every demo/check mode reads no standard input. The supplied application uses in-memory values and console output; its fixtures model callbacks without contacting external services.\n\nPreserve the api package, legacy implementation, check helper, ContractChecks, Main and CompatibilityClient. Keep learner-written checks in a separate file and add new Java source paths to sources.txt. The reference is one design, and the frozen checks cover stated observations; the review record supplies the ownership, risk and design argument.\n\nWrite this separately compiled Probe.java after completing core:\n\n    import api.*;\n    import app.BoardReport;\n    import java.util.List;\n    public final class Probe {\n        private Probe() {}\n        public static void main(String[] args) {\n            BoardAPI report=new BoardReport();\n            List<Task> tasks=List.of(new Task("z",5,false),new Task("a",2,true));\n            if(!report.summary(tasks).equals("tasks=2\\ndone=1\\nremaining=5\\nopen=z\\n"))\n                throw new AssertionError("unchanged board");\n            System.out.println("probe passed");\n        }\n    }\n\nCompile with javac --release 21 -cp out -d out Probe.java and run java -cp out Probe. Expected output is "probe passed" followed by newline. The public client demonstrates the required boundary independently of the supplied checker.',
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "challenge"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-guided-example",
				title: "Refactoring Clinic 17: Guided Example",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-17-curriculum-refactoring-clinic-17-guided-example"
				],
				content:
					"Map the duplicate calculation and mixed formatting responsibilities. Trace the sample, perform the first helper extraction, and use its result to decide whether analysis extraction is a small safe next step.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-17-guided"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-core-project-refactoring-clinic-17",
				title: "Core Project: Refactoring Clinic 17",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-17-curriculum-core-project-refactoring-clinic-17",
					"design-patterns-in-java-part-2-refactoring-clinic-17-curriculum-core-project",
					"design-patterns-in-java-part-2-refactoring-clinic-17-curriculum-refactoring-clinic-17-core-project",
					"refactoring-clinic-17-core-project",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-core-project"
				],
				content:
					"Refactor BoardReport in the planned three stages: extract the duplicated unfinished-minute helper, extract BoardAnalysis while formatting stays in the facade, then isolate BoardText. Retain both actual intermediate checkpoints, unchanged clients and one recoverable earlier source. Preserve title order and separate the sorted preview feature.\n\nRun ContractChecks core with -ea and -da.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-17-core"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-review-refactoring-clinic-17",
				title: "Review: Refactoring Clinic 17",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-17-curriculum-review-refactoring-clinic-17",
					"design-patterns-in-java-part-2-refactoring-clinic-17-curriculum-refactoring-clinic-17-review-and-reflection",
					"refactoring-clinic-17-review-and-reflection",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-review-and-reflection"
				],
				content:
					"Compare the actual before/helper/analysis/final source states. Name one change now confined behind a boundary, an unexplained failure that would trigger a stop, and the checkpoint to restore. Explain why sorting original report titles is postponed.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-17-review"
			}
		],
		supplementalProjects: [
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-extension-challenge-refactoring-clinic-17",
				title: "Extension Challenge: Refactoring Clinic 17",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-17-supplemental-extension-challenge-refactoring-clinic-17",
					"design-patterns-in-java-part-2-refactoring-clinic-17-supplemental-extension-challenge",
					"design-patterns-in-java-part-2-refactoring-clinic-17-supplemental-refactoring-clinic-17-extension-challenge",
					"refactoring-clinic-17-extension-challenge",
					"design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-extension-challenge"
				],
				content:
					"Continue the core attempt with duplicate titles, the maximum task list and a rejected over-size list. Keep original report ordering and input state stable while describing the first proposed step that needs to be split.\n\nRetain the stated trace, the actual source checkpoint and its comparison with the worked self-check.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-17-continuation"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-transfer-practice",
				title: "Refactoring Clinic 17 Transfer Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-17-supplemental-transfer-practice-refactoring-clinic-17",
					"design-patterns-in-java-part-2-refactoring-clinic-17-supplemental-transfer-practice"
				],
				content:
					'## Independent transfer: locate the first bad checkpoint\n\nComplete SnapshotDiff.firstDifference(before,after). Validate and copy before first, then after, with NullPointerException("before") or ("after") for null lists. Null captures are rejected. Compare exact strings, including whitespace and newlines, without modifying the lists.\n\nReturn the first unequal index. If all shared positions match but lengths differ, return the shared length. Return -1 only when both sequences are identical. ["before","step1","final"] versus ["before","bad","final"] gives 1, even though the final captures match. Empty versus one entry gives 0; two empty sequences give -1.\n\nRetain an intermediate mismatch, a length mismatch, exact newline difference and unchanged inputs. This protects a recorded checkpoint sequence, not the unrecorded behavior between snapshots.\n\nRun ContractChecks transfer with -ea and -da.',
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-17-transfer"
			},
			{
				id: "design-patterns-in-java-part-2-optional-refactoring-clinics-11-17-supplemental-refactoring-clinic-17-extension-practice",
				title: "Refactoring Clinic 17 Extension Practice",
				aliases: [
					"design-patterns-in-java-part-2-refactoring-clinic-17-supplemental-extension-practice-refactoring-clinic-17",
					"design-patterns-in-java-part-2-refactoring-clinic-17-supplemental-extension-practice"
				],
				content:
					"## Independent extension: a separate sorted preview\n\nComplete BoardPreview.sorted(tasks). Apply the same complete task-list validation, retain the original list and return a new unmodifiable list sorted by title using String's natural order. Equal titles retain their original relative order; duplicate tasks remain. Empty input returns an empty list.\n\nThe sample preview titles are [code,draw,read], while the core report still says open=read,draw. This new presentation is separate from changing the established core order. Retain first/last titles, stable duplicates with different minutes/done flags, empty input and input purity. Explain why a preview was safe to add without changing the characterized report.\n\nRun ContractChecks extension with -ea and -da.",
				contentKind: "assignment",
				preserveInstructions: true,
				learningPath: "challenge",
				preserveAssignment: true,
				caseSection: "clinic-17-extension"
			}
		]
	}
];
