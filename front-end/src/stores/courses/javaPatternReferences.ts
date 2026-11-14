import type { RawCourse } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import { javaCollaborationURL } from "@/modules/javaCollaborationResources";
import { javaCreationalURL } from "@/modules/javaCreationalResources";
import { javaStudioURL } from "@/modules/javaStudioResources";

const entries: Record<
	string,
	{
		content: string;
		kind: "reading" | "assignment";
		case?: string | null;
		family?: string;
	}
> = {
	"Design Patterns in Java Reference Guide": {
		content:
			"The supplied projects target Java 21. [javac](https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html) documents --release, -d and @sources.txt; compile the whole package tree with the command supplied in each project. [Record](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Record.html) explains record components and shallow immutability. [List.copyOf](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html#copyOf(java.util.Collection)) documents an unmodifiable list whose membership is independent of later changes to the input collection; mutable elements still need their own ownership rule. [ServiceLoader](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ServiceLoader.html) is the provider-discovery API used in DPJ8.\n\nThe project's README and ContractTests specify each exercise's prices, event ordering, ownership and errors. Those are supplied exercise contracts. The Java documentation defines language/library behavior; it does not prescribe the exercise's business rules.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Core Skills": {
		content:
			"| Skill | Concrete checkpoint |\n| --- | --- |\n| Interface and composition | Explain which object selects an implementation and which operation it delegates. |\n| Packages and compilation | Compile the complete src tree from sources.txt and run Main from classes. |\n| Collections and ownership | Preserve list order and distinguish a snapshot from a shared mutable collection. |\n| Errors and effects | Identify which validations happen before mutation and which callback failures occur after commit. |\n| Characterization | Compare a baseline with an independently stated rule, including boundary and failure cases. |\n\nDPJ2 practices these boundaries before the pattern families. The notebook studio combines them: immutable Note values, a repository port, version checks and storage-before-audit ordering.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Next Topics": {
		content:
			"DPJ7 adds event lifetime, one-shot commands, undo state and visitor operations after the earlier behavioral patterns. DPJ8 adds provider discovery and replaceable application boundaries. DPJ9 compares a helper-only refactor with a larger abstraction, and DPJ10 combines justified boundaries in one protected refactor.\n\nAfter those projects, a separate change can investigate concurrent writes, durable storage or reliable event delivery. The notebook studio's find-then-save port is sequential. A concurrent version needs an atomic expected-version update; its contract and tests must change together. Durable audit delivery similarly requires a delivery/transaction policy beyond an in-memory callback.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Boundaries": {
		content:
			"This course assumes independent use of Java classes, interfaces, collections, exceptions, packages and basic tests. It studies design decisions through small Java 21 programs. Java Level 3 supplies prerequisite algorithm and recursion practice; DPJ1\u2013DPJ10 apply object collaboration and behavior-preserving refactoring.\n\nThe three optional studios are focused practice after their matching units. Strategy isolates algorithms, Structural Wrapper compares ordering and state ownership, and Architecture Judgment compares a helper with an injected repository. The later refactoring course has its own project sequence; reaching this course's capstone does not automatically satisfy that separate course. C++ ownership idioms, Python protocols and production database/concurrency guarantees belong to their corresponding prerequisite or follow-up work.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Prerequisite Check": {
		content:
			"Complete these short written traces before the pattern projects.\n\n1. An interface PricingRule declares long priceFor(int units). A constructor receives one PricingRule and calls priceFor(3). Which object chooses the implementation, and what argument reaches it?\n2. A list snapshot is created from [a,b], then the original list gains c. What membership should an independent snapshot retain?\n3. A method validates, saves a Note, then calls an audit sink that throws. Which effect has already happened, and does that exception prove rollback?\n\nExplain each result using the supplied sequence. A code trace and an ownership diagram are sufficient; the self-check gives the expected results. Revisit DPJ2 for interface delegation and snapshots, and DPJ7/DPJ8 for committed state versus callback failure.",
		kind: "assignment",
		case: "prerequisite"
	},
	"Design Patterns in Java Pathway Map": {
		content:
			"Follow DPJ1's characterization and decision record with DPJ2's Java boundaries. DPJ3\u2013DPJ4 examine creation, copying and compatibility; DPJ5 compares structural collaborations; DPJ6\u2013DPJ7 compare behavioral choices and event/command lifetime. DPJ8 moves the dependency boundary to application scale. DPJ9 develops the safe refactor sequence used in DPJ10.\n\nThe optional Strategy studio fits after DPJ6 or DPJ9. Structural Wrapper fits after DPJ5. Architecture Judgment fits after DPJ8 or DPJ10. Each begins with a working baseline and compares an extracted-helper intermediate with the selected structure. Their optional operations add new behavior after core, rather than defining additional required units.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Follow-Up Path": {
		content:
			"Choose a follow-up from an observed limitation in a completed project. A fixed pricing choice can become an injected PricingRule; a cache that stays stale can gain explicit invalidation; a repository that serves sequential callers can gain an atomic expected-version update for concurrent callers.\n\nEach change has a different contract. Rule injection specifies invocation count and errors. Invalidation specifies ownership and which cached entries survive. Concurrent writes specify an atomic storage outcome. Keep the original baseline and describe the changed result before choosing a pattern or storage tool. The separate refactoring course should be entered through its own stated prerequisites and projects.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Resource Map": {
		content:
			"The core projects provide complete role folders: Main.java, ContractTests.java, a README and package files; multi-file packs also provide sources.txt. Decision/checkpoint files are included where required by the project. Source links identify immutable Git revisions.\n\nThe starter is the learner's editable project. The reference is a separate comparison. A worked example can have its own smaller source folder. Keep the selected role folder together when exporting. Native Java projects compile with JDK 21; the site IDE's Run action displays their commands. The project-specific README states whether the starter already passes core or names methods still to implement.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Module Alignment Guide": {
		content:
			"| Unit | Behavior or design property to inspect |\n| --- | --- |\n| DPJ3 | Matching creation products and independent built values. |\n| DPJ4 | Copy ownership and compatibility translation. |\n| DPJ5 | Client contract, wrapper order, identity and lifetime. |\n| DPJ6 | Explicit behavior selection and valid state changes. |\n| DPJ7 | Captured listeners, command phase, undo and committed history. |\n| DPJ8 | Package dependency direction and a demonstrated substitute. |\n| DPJ9 | Independent oracle and helper-only counterfactual. |\n| DPJ10 | Preserved behavior through a measured refactor. |\n\nA matching output is one part of the evidence. Inspect who owns the rule, state or dependency that the selected pattern is meant to change.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Reference Map": {
		content:
			"Use a version-specific Java 21 API page when checking a record, collection or provider-discovery operation in these packs. Use the exact linked source revision when comparing a contract harness with a reference implementation. A newer default branch or Java API edition can describe different available APIs.\n\nThe local case inputs and project self-checks are exercise evidence. DECISIONS.md records the learner's design reasoning. A reference implementation demonstrates one working structure; the helper-only intermediate shows a smaller design worth comparing. Keep external documentation, exercise requirements and the chosen design decision distinct in that record.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Prerequisite Map": {
		content:
			"Interfaces and constructor injection support Strategy and the repository seam. Ordered collections and captured snapshots support Observer dispatch and visitor child lists. Object identity and ownership support Memento restore and copy semantics. Exceptions and operation ordering support mediator history and audit failures.\n\nUse these dependency edges to select review: an unexplained event order points back to collection traversal; a stale undo points back to command phase and document ownership; a snapshot that changes later points back to aliasing. DPJ9 and DPJ10 use all of these earlier contracts when judging a refactor.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Resource Inventory": {
		content:
			"| Supplied resource | Role |\n| --- | --- |\n| Main.java | Small reproducible driver with documented output. |\n| ContractTests.java | Executable checks for ordinary, boundary and failure behavior. |\n| sources.txt and src/ | Complete package tree and native compile inputs. |\n| README.md | Toolchain, commands and operation contract. |\n| DECISIONS.md | Change pressure, simpler alternative, cost and removal trigger. |\n| Case inputs and self-check | Fixed reasoning cases alongside the lesson. |\n\nSome early worked examples use fewer files; use their stated command. All three optional studio packs include both runnable roles and a preserved baseline. The reference completes the separately specified optional operation.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Project Ladder": {
		content:
			"Start with a trace of the supplied baseline, then make a small behavior-preserving change. Compare its source with an extracted-helper intermediate before adding interchangeable collaborators. Record the rule locations, ownership and cost. A later extension deliberately adds behavior under a separate contract.\n\nThe practice projects below revisit Strategy, Observer, creation, Command and an application boundary. They open the matching existing project so the same saved work can continue. Strategy and notebook starters already pass core and need structural improvement; the editor and creation starters name required unfinished methods. Optional studios remain choices alongside DPJ1\u2013DPJ10.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Checkpoints": {
		content:
			"For pricing, check quantities around both thresholds and compare quote with receipt. For wrappers, trace a miss, hit, failure and clear with attempts and source-call counts. For events, distinguish captured listeners from future registrations. For commands, record NEW, DONE and UNDONE plus current text. For repositories, record expected versus stored version and when audit runs.\n\nUse the supplied independent case table as well as baseline agreement. A copied baseline can preserve the same mistake as the target. After the behavior checks pass, inspect the actual dependency arrows and demonstrate the change scenario that justifies the new boundary.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Rubric": {
		content:
			"Evaluate four separate properties.\n\n- **Behavior:** The stated normal, boundary and failure cases have the required values, state and event order.\n- **Structure:** The chosen collaborator owns the intended rule or state; the dependency map matches the source.\n- **Judgment:** A helper-only or direct-construction alternative is compared with the added abstraction and its maintenance cost.\n- **Evidence:** The exact source, native command/output and decision record make the result reproducible.\n\nA green harness supports the behaviors it checks. Design justification also needs a concrete change scenario and a removal trigger. A failing case needs an explained cause before it becomes part of the accepted result.",
		kind: "reading",
		case: null
	},
	"Design Patterns in Java Capstone Gate": {
		content:
			"Before DPJ10, retain a runnable baseline and the required operation contracts. Explain the current rule locations and choose a change pressure grounded in that source. Prepare one ordinary case, one boundary/failure case and a smaller alternative design.\n\nDuring the capstone, preserve the baseline through separate structural steps, then demonstrate a new variant or dependency replacement. Compare changed files, rule locations and setup cost. The submitted packet contains the source tree, commands/results, decision and checkpoint notes, dependency map and a recoverable baseline. Optional batching belongs to its own stated contract after core.",
		kind: "reading",
		case: null
	},
	"Practice Project: Refactor If/else Behavior Into Strategy": {
		content:
			"Continue the Strategy Selection studio's pricing refactor. Locate the duplicate BULK/FLAT/MEMBER calculations in quote and receipt. First route both through one helper, then compare that intermediate with PricingRule collaborators and a single Plan selector. Keep the supplied prices and validation order.\n\nPredict BULK totals for 4,5,9,10 units and MEMBER for 6. Compare receipt(BULK,6) with quote(BULK,6). Run core after each step and record the actual rule locations and added setup cost. The optional caller-supplied rule remains separate from this core refactor.",
		kind: "assignment",
		case: "strategy",
		family: "strategy"
	},
	"Practice Project: Add Observer Events to a Small Model": {
		content:
			"Continue DPJ7's editor project by completing EventBus.publish according to its captured-list contract. Each subscription is an independent registration. Capture listeners in order at publication; changes to subscriptions affect later captured lists. A listener exception stops the remaining callbacks and propagates.\n\nTrace A and B subscribed in that order. During A's callback, close B's registration. B still receives this already captured event; only A receives the next event. Then trace an exception from A before B runs. Keep that failure distinct from EditorMediator's committed model/history state. Run core and retain callback order beside the source.",
		kind: "assignment",
		case: "observer",
		family: "collaboration"
	},
	"Practice Project: Convert Duplicate Constructors to Factory": {
		content:
			"Continue DPJ3's report-creation project. Compare direct construction with RendererFactory.forStyle and the Exporter.createRenderer hook. Complete the boxed Heading/BodyLine products, the boxed exporter's creation hook and required Builder methods. Matching product metadata is part of the contract.\n\nFor title Notes and body [one,two], predict the BOXED output. Add includeCount=true and footer End, then compare the complete output with Main. Test a mixed-style product pair and an empty body. Explain which selection pressure justifies the factory and when the direct ReportJob constructor remains simpler.",
		kind: "assignment",
		case: "factory",
		family: "creational"
	},
	"Practice Project: Implement Command-based Undo": {
		content:
			"Continue DPJ7's editor project by completing ReplaceCommand.execute and undo. A new command snapshots the document, applies its replacement and enters DONE. Undo requires DONE and text still equal to the applied replacement; it restores the snapshot and enters UNDONE. A rejected stale undo remains DONE. Commands are one-shot.\n\nTrace Ready to Checked and undo, then try executing that consumed command again. Separately trace an outside change to Other before undo and explain why it is rejected. Compare the mediator's private document/history ownership with a directly exposed mutable document. Run core and retain both phase and text traces.",
		kind: "assignment",
		case: "command",
		family: "collaboration"
	},
	"Practice Project: Refactor a Mini-App with Tests Before and After": {
		content:
			"Continue the Architecture Judgment notebook studio. Preserve create, edit, find and all while comparing a helper-only cleanup with an injected NoteRepository. Compile the application with fake storage, without MemoryNotes or Composition, and inspect the source dependency arrows.\n\nTrace a successful version-1 edit, a stale version-1 edit after it, and audit failure after a committed save. Capture an immutable snapshot before editing. Run core for the original and selected designs, and record added files/setup against the demonstrated substitution. Optional versioned removal is a separate extension.",
		kind: "assignment",
		case: "notebook",
		family: "architecture"
	}
};
export function applyJavaPatternReferences(course: RawCourse) {
	let replaced = 0;
	for (const module of course.modules) {
		if (
			![
				"Standards Map",
				"Course Roadmap",
				"Project Practice Guide"
			].includes(module.title)
		) {
			continue;
		}
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			const entry = entries[item.title];
			if (!entry)
				throw new Error(`Missing Java reference: ${item.title}`);
			item.content = entry.content;
			item.preserveInstructions = true;
			item.preserveAssignment = true;
			item.contentKind = entry.kind;
			item.learningPath = "choice";
			if (entry.case) {
				const path = `/course-assets/design-patterns-in-java/appendix-checks.md#${
					entry.case
				}`;
				item.content += `\n\n[Case inputs](${courseAssetViewerUrl(`${path}-inputs`)}) · [Project self-check](${courseAssetViewerUrl(`${path}-answers`)})`;
			}
			if (entry.family) {
				const url =
					entry.family === "collaboration"
						? javaCollaborationURL
						: entry.family === "creational"
							? javaCreationalURL
							: (role: "starter" | "solution") =>
									javaStudioURL(
										entry.family as
											"strategy" | "architecture",
										role
									);
				item.projectLink = url("starter");
				item.solutionLink = url("solution");
				item.ideImport = true;
			}
			replaced++;
		}
	}
	if (replaced !== 21) throw new Error("Expected21Java appendix records.");
}
